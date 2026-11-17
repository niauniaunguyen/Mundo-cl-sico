// ============================================================ RELIEVE DE LOS DESTINOS: MÁS DETALLE Y SIN PAREDES IMPOSIBLES
// La revisión del terreno (herramientas/pruebas/terreno.js) encontró dos fallos repetidos en los destinos:
//  · paredes de 13 a 43 m donde un camino de salida sube a la puerta por un monte (Horcas Caudinas, Taigeto, Liceo, Egio...);
//  · la sierra que cierra el cuadrado de cada mapa cae en vertical al mar (unos 70 mapas con costa).
// Y el relieve era muy esquemático: llano con cúpulas lisas. Aquí, sobre la rejilla de alturas de cada destino (la misma que se
// dibuja y que se pisa: gridH), antes de pintarla y de colocar edificios y árboles:
//  1. los montes ganan crestas y barrancos que bajan por la ladera (líneas orientadas según la pendiente, como las que deja el agua);
//  2. ninguna pendiente pasa de unos 55°: se recorta lo alto y se rellena lo bajo a partes iguales (talud), sin tocar los solares
//     de los edificios ni el firme de los caminos.
// Las ciudades de partida (Atenas y Roma) tienen su propio relieve y no pasan por aquí.
const RELIEF={slope:Math.tan(55*Math.PI/180),on:true,ms:0,n:0};
// protección (0-1) de cada punto: 1 en los solares (y, si roads, en los caminos), bajando a 0 en unos metros. Los caminos se libran del
// detalle (crestas y barrancos), pero no del límite de pendiente: si un camino sube en terraplén, el terraplén se suaviza
function reliefMask(I,N1,st,x0,z0,roads,H){const P=new Float32Array(N1*N1);   // con H: solo protege los puntos de un solar que siguen a su altura (un camino que pasa por encima lo deforma)
  for(const p of I.pads){if(p.road&&!roads)continue;const road=!!p.road,r0=p.r+(road?1:2),r1=r0+(road?7:roads?12:4),i0=Math.max(0,Math.floor((p.x-r1-x0)/st)),i1=Math.min(N1-1,Math.ceil((p.x+r1-x0)/st)),j0=Math.max(0,Math.floor((p.z-r1-z0)/st)),j1=Math.min(N1-1,Math.ceil((p.z+r1-z0)/st));
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const d=Math.hypot(x0+i*st-p.x,z0+j*st-p.z),k=j*N1+i;if(H&&!road&&d<=p.r&&Math.abs(H[k]-p.h)>1.5)continue;const w=d<=r0?1:d>=r1?0:1-sstep((d-r0)/(r1-r0));if(w>P[k])P[k]=w;}}
  return P;}
// líneas a favor de la pendiente (barrancos y espolones): ondas orientadas con la ladera en puntos repartidos al azar (técnica de
// «erosión falsa» con ondas de Gabor). (dx,dz) es la dirección de bajada; devuelve -1..1 (negativo: fondo de barranco)
function reliefGully(lx,lz,dx,dz,f,seed){const cx=Math.floor(lx*f),cz=Math.floor(lz*f);let a=0,w=0;
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const gx=cx+i,gz=cz+j,px=(gx+hash(gx+seed,gz))/f,pz=(gz+hash(gz-seed,gx+7.3))/f,ox=lx-px,oz=lz-pz,d2=(ox*ox+oz*oz)*f*f,wt=Math.exp(-d2*1.6);
    a+=Math.cos((ox*-dz+oz*dx)*f*TAU*1.3)*wt;w+=wt;}
  return w>0?a/w:0;}
// límite de pendiente: la media de «recortar desde abajo» y «rellenar desde arriba» (distancia de chaflán en 8 direcciones, dos pasadas
// cada una). La media de dos superficies que respetan la pendiente también la respeta; los puntos protegidos no se mueven.
function reliefLimit(H,N1,st,P,T){const n=N1*N1,lo=Float32Array.from(H),hi=Float32Array.from(H),d1=T*st,d2=T*st*Math.SQRT2;
  const fix=k=>P[k]>0.999;
  const pass=(A,sg)=>{   // sg=+1: recortar (A=min(A, vecino+d)); sg=-1: rellenar (A=max(A, vecino-d))
    for(let dir=0;dir<2;dir++){const j0=dir?N1-1:0,j1=dir?-1:N1,dj=dir?-1:1;
      for(let j=j0;j!==j1;j+=dj)for(let ii=0;ii<N1;ii++){const i=dir?N1-1-ii:ii,k=j*N1+i;if(fix(k))continue;let v=A[k];
        const t=(i2,j2,d)=>{if(i2<0||j2<0||i2>=N1||j2>=N1)return;const c=A[j2*N1+i2]+sg*d;if(sg>0?c<v:c>v)v=c;};
        t(i-dj,j,d1);t(i,j-dj,d1);t(i-1,j-dj,d2);t(i+1,j-dj,d2);A[k]=v;}}};
  pass(lo,1);pass(lo,1);pass(hi,-1);pass(hi,-1);
  let moved=0;for(let k=0;k<n;k++){if(fix(k))continue;const v=(lo[k]+hi[k])/2,m=v+(H[k]-v)*P[k];if(Math.abs(m-H[k])>0.01){H[k]=m;moved++;}}return moved;}
function reliefPost(I,H,N1,st,x0,z0){if(!RELIEF.on)return;const t0=performance.now();
  const B=Float32Array.from(H),P=reliefMask(I,N1,st,x0,z0,true),PL=reliefMask(I,N1,st,x0,z0,false,B),sd=(I.seed||1)*13.7;
  // 1. crestas y barrancos en las laderas
  for(let j=1;j<N1-1;j++)for(let i=1;i<N1-1;i++){const k=j*N1+i,h=B[k],free=1-P[k];if(free<=0||h<4)continue;
    const gx=(B[k+1]-B[k-1])/(2*st),gz=(B[k+N1]-B[k-N1])/(2*st),g=Math.hypot(gx,gz);
    const amp=clamp((h-4)/45,0,1)*free*(I.dem?0.35:1);   // con relieve real (188), solo un poco de detalle encimaif(amp<=0)continue;const lx=x0+i*st-I.x,lz=z0+j*st-I.z;
    // relieve de cresta (picos y collados) que crece con la altura
    const rn=1-Math.abs(2*vnoise(lx*0.011+sd,lz*0.011)-1),rn2=1-Math.abs(2*vnoise(lx*0.027-sd,lz*0.027+3.1)-1);
    let d=(rn*rn-0.35)*Math.min(14,h*0.09)+(rn2*rn2-0.35)*Math.min(5,h*0.035);
    // barrancos a favor de la pendiente, más hondos cuanto más empinada es la ladera
    const sf=clamp((g-0.08)/0.35,0,1)*clamp(vnoise(lx*0.006-sd,lz*0.006+sd)*1.8-0.35,0,1);   // en manchas: unas laderas más surcadas que otras
    if(sf>0){const tw=(vnoise(lx*0.02+sd,lz*0.02)-0.5)*0.9,cs=Math.cos(tw),sn=Math.sin(tw),dx=(-gx*cs+gz*sn)/g,dz=(-gz*cs-gx*sn)/g;   // dirección algo torcida: no salen rayos
      d+=(reliefGully(lx,lz,dx,dz,1/46,sd)*Math.min(6,h*0.05)+reliefGully(lx,lz,dx,dz,1/17,sd+3)*Math.min(1.8,h*0.02))*sf;}
    H[k]=h+d*amp;}
  // 2. sin paredes
  const moved=reliefLimit(H,N1,st,PL,RELIEF.slope);
  RELIEF.ms+=performance.now()-t0;RELIEF.n++;I.reliefMoved=moved;}
// los ríos se excavan después (recarveIsland, con el relieve de la fórmula): sus orillas volvían a ser paredes. Tras excavar, el
// límite de pendiente se aplica otra vez sin mover el cauce ni los solares
{const f=recarveIsland;recarveIsland=function(I,pts,reach){const G=I.grid,before=G?Float32Array.from(G.H):null;f.apply(this,arguments);if(!G||!RELIEF.on||!I.mesh)return;
  const N1=G.n+1,H=G.H,P=reliefMask(I,N1,G.step,G.x0,G.z0,false,H);let any=false;   // solo el fondo del cauce queda fijo; las orillas excavadas pueden suavizarse
  for(let j=0;j<N1;j++)for(let i=0;i<N1;i++){const k=j*N1+i;if(!(H[k]<before[k]-0.05))continue;any=true;let mn=H[k];
    for(let b=-2;b<=2;b++)for(let a2=-2;a2<=2;a2++){const ii=i+a2,jj=j+b;if(ii>=0&&jj>=0&&ii<N1&&jj<N1)mn=Math.min(mn,H[jj*N1+ii]);}if(H[k]-mn<1.2)P[k]=1;}
  if(!any)return;
  const old=Float32Array.from(H);reliefLimit(H,N1,G.step,P,RELIEF.slope);const g=I.mesh.geometry,pos=g.attributes.position;let ch=false;
  for(let k=0;k<H.length;k++)if(H[k]!==old[k]){pos.setY(k,H[k]);ch=true;}if(ch){pos.needsUpdate=true;g.computeVertexNormals();}};}
// el terreno se rebaja bajo los edificios después (applyFlats): en un solar al borde de un desnivel quedaban hoyos de paredes rectas
// (Cirene, Horcas Caudinas, Lasithi, Samotracia). Tras rebajar, otra pasada del límite con la planta y el rellano de cada edificio fijos
{const f=applyFlats;applyFlats=function(){const r=f.apply(this,arguments);if(!RELIEF.on)return r;
  for(const I of ISLANDS){const G=I.grid;if(!G||!I.mesh||!I.flatMesh)continue;const N1=G.n+1,st=G.step,P=new Float32Array(N1*N1),H=G.H;
    // fijos: el rellano de cada edificio rebajado y la planta de todos los edificios del mapa (no los solares vacíos)
    const fix=(cx,cz,R,inside)=>{const i0=Math.max(0,Math.floor((cx-R-G.x0)/st)),i1=Math.min(N1-1,Math.ceil((cx+R-G.x0)/st)),j0=Math.max(0,Math.floor((cz-R-G.z0)/st)),j1=Math.min(N1-1,Math.ceil((cz+R-G.z0)/st));
      for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(inside(G.x0+i*st-cx,G.z0+j*st-cz))P[j*N1+i]=1;};
    for(const fp of footprints){if(Math.abs(fp.x-I.x)>I.R*1.6||Math.abs(fp.z-I.z)>I.R*1.6)continue;const a=fp.a||0,c=Math.cos(a),sn=Math.sin(a);
      if(fp.r)fix(fp.x,fp.z,fp.r+1.5,(dx,dz)=>Math.hypot(dx,dz)<fp.r+1.5);else if(fp.w&&fp.d){const hw=fp.w/2+1.5,hd=fp.d/2+1.5;fix(fp.x,fp.z,Math.hypot(hw,hd),(dx,dz)=>Math.abs(dx*c-dz*sn)<hw&&Math.abs(dx*sn+dz*c)<hd);}}
    for(const F of FLATS){const R=Math.max(F.hw,F.hd)*1.42+F.ring;if(Math.abs(F.cx-I.x)>I.R*1.6)continue;
      const i0=Math.max(0,Math.floor((F.cx-R-G.x0)/st)),i1=Math.min(N1-1,Math.ceil((F.cx+R-G.x0)/st)),j0=Math.max(0,Math.floor((F.cz-R-G.z0)/st)),j1=Math.min(N1-1,Math.ceil((F.cz+R-G.z0)/st));
      for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const dx=G.x0+i*st-F.cx,dz=G.z0+j*st-F.cz,lx=Math.abs(dx*F.c-dz*F.s)-F.hw,lz=Math.abs(dx*F.s+dz*F.c)-F.hd,d=F.round?Math.hypot(dx,dz)-F.hw:Math.hypot(Math.max(lx,0),Math.max(lz,0));if(d<F.ring)P[j*N1+i]=1;}}
    const old=Float32Array.from(H);if(!reliefLimit(H,N1,st,P,RELIEF.slope))continue;const g=I.mesh.geometry,pos=g.attributes.position;
    for(let k=0;k<H.length;k++)if(H[k]!==old[k])pos.setY(k,H[k]);pos.needsUpdate=true;g.computeVertexNormals();}
  return r;};}
