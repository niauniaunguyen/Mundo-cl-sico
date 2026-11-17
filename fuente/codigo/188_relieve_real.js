// ============================================================ RELIEVE REAL DE TODOS LOS DESTINOS
// El relieve base de cada destino (islandBase) deja de ser inventado (llano con montes en forma de cúpula) y pasa a ser el de hoy,
// del modelo de elevaciones Copernicus GLO-30 (un punto cada 30 m), a escala 1:1 y con el norte hacia -z. Los datos (#demdata,
// modelos/relieve_real.json) los prepara herramientas/relieve_real/dem_todos.py: para cada destino, su sitio real alineado con el
// mapa del juego (la costa real con la del juego y los solares en llano), suavizado para borrar casas y carreteras de hoy.
// Encima siguen los allanamientos de los edificios, los ríos excavados, un poco del detalle de 185_relieve.js y la sierra del borde.
// Con costa (cs): el mar sigue siendo el del juego (puertos, barcos, muelles), mezclado con el relieve real en una franja de unos
// 60 m junto a la orilla; tierra adentro manda el relieve real.
// Cuidado: el relieve actual no es el antiguo en todo. Los ríos han movido las costas (Éfeso y Mileto, hoy tierra adentro; las
// Termópilas, donde el mar llegaba al paso), y los aluviones enterraron santuarios (el Altis de Olimpia, bajo varios metros de limo
// del Alfeo y del Cladeo). Por eso la costa del juego manda y los solares se allanan a su altura. Las dos ciudades de partida
// (Atenas y Roma) tienen distancias comprimidas a propósito y no usan estos datos.
const DEM={c:{},data:null};
// un bloque por época (#demdata_atenas, #demdata_roma): se trae al elegirla (chooseMode), antes de construir el mundo
function demData(){if(DEM.data&&DEM.dm===MODE)return DEM.data;DEM.dm=MODE;let d={};try{if(!/sinrelieve/.test(location.search)){const el=document.getElementById('demdata_'+MODE)||document.getElementById('demdata');if(el&&el.textContent.trim().length>2)d=JSON.parse(el.textContent);}}catch(e){}return DEM.data=d;}
function demGet(id){const k=MODE+':'+id;if(DEM.c[k]!==undefined)return DEM.c[k];const m=demData()[MODE],d=m&&m[id];if(!d)return DEM.c[k]=null;
  const b=atob(d.b),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return DEM.c[k]=Object.assign({H:new Int16Array(u.buffer)},d);}
// interpolación cúbica (Catmull-Rom): sin las aristas que dejaría la bilineal en una rejilla de 30 m
function demGrid(D,A,lx,lz,sc){const n=D.n,u=Math.min(n-1.001,Math.max(0,(lx-D.x0)/D.st)),v=Math.min(n-1.001,Math.max(0,(lz-D.x0)/D.st)),i=Math.floor(u),j=Math.floor(v),fu=u-i,fv=v-j;
  const g=(a,b)=>A[Math.min(n-1,Math.max(0,b))*n+Math.min(n-1,Math.max(0,a))]*sc,cr=(p0,p1,p2,p3,t)=>p1+0.5*t*(p2-p0+t*(2*p0-5*p1+4*p2-p3+t*(3*(p1-p2)+p3-p0)));
  const r=[];for(let k=-1;k<=2;k++)r.push(cr(g(i-1,j+k),g(i,j+k),g(i+1,j+k),g(i+2,j+k),fu));return cr(r[0],r[1],r[2],r[3],fv);}
function demH(D,lx,lz){return Math.max(1.5,demGrid(D,D.H,lx,lz,0.1));}
// el mar del juego: solo el que llega al borde del mapa (los charcos del relieve inventado no cuentan), algo suavizado
function demSea(D,I,f){const n=D.n,o=new Float32Array(n*n),low=new Uint8Array(n*n);for(let j=0;j<n;j++)for(let i=0;i<n;i++){const v=f(I,I.x+D.x0+i*D.st,I.z+D.x0+j*D.st);o[j*n+i]=v;low[j*n+i]=v<0.6?1:0;}
  const sea=new Uint8Array(n*n),q=[];for(let k=0;k<n;k++)for(const idx of[k,(n-1)*n+k,k*n,k*n+n-1])if(low[idx]&&!sea[idx]){sea[idx]=1;q.push(idx);}
  while(q.length){const idx=q.pop(),i=idx%n,j=(idx-i)/n;for(const[a,b]of[[i+1,j],[i-1,j],[i,j+1],[i,j-1]]){if(a<0||b<0||a>=n||b>=n)continue;const k2=b*n+a;if(low[k2]&&!sea[k2]){sea[k2]=1;q.push(k2);}}}
  const S=new Float32Array(n*n);for(let j=0;j<n;j++)for(let i=0;i<n;i++){let s=0,w=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=n||jj>=n)continue;const ww=a||b?0.5:1;s+=sea[jj*n+ii]*ww;w+=ww;}S[j*n+i]=s/w;}
  return S;}
{const f=islandBase;islandBase=function(I,x,z){const D=I&&demGet(I.id);if(!D)return f(I,x,z);I.dem=1;const lx=x-I.x,lz=z-I.z;let h=demH(D,lx,lz);
  if(I.lake){const L=I.lake,q=Math.hypot((x-L.x)/L.rx,(z-L.z)/L.rz);if(q<1.3)h=Math.min(h,lerp(-7,h,sstep(clamp((q-0.85)/0.45,0,1))));}
  let r=Math.max(carveH(x,z,sqMount(I.id,x,z,h)),-9);
  if(D.cs){if(!D.S)D.S=demSea(D,I,f);const s=clamp(demGrid(D,D.S,lx,lz,1),0,1);if(s>0.001)r=lerp(r,f(I,x,z),sstep(s));}   // el mar del juego
  return r;};}
// los solares con altura fija (pensados para el llano inventado) toman la del relieve real en su sitio
{const f=pad;pad=function(I,lx,lz,r,dh,fixed){if(I&&demGet(I.id)&&fixed!==undefined&&islandBase(I,I.x+lx,I.z+lz)>0.6)fixed=undefined;return f.call(this,I,lx,lz,r,dh,fixed);};}   // salvo en el mar del juego: ahí el solar fijo es un muelle o una llegada ganada al agua
// límite superior de los árboles: con el relieve inventado salía de la altura de sus montes (I.H); con el real, el límite del arbolado
// en las montañas del Mediterráneo, hacia 2.300 m (abetos del Taigeto, del Parnaso o del Eta; el pino de Heldreich del Olimpo llega a unos 2.500), en altura del juego
function vegTop(I,k){const D=I&&demGet(I.id);if(!D)return k?I.H*k:I.H*3+60;return 2300-(D.e0||0);}
// ---- los ríos por sus valles. Los ríos de los destinos se trazaron sobre el llano inventado (una línea que cruza el mapa); con el
// relieve real, una línea así sube y baja por las lomas, y addRiver la corta en la primera subida o abre una zanja. Ahora, en los mapas
// con relieve real, cada río busca el fondo del valle cerca de su trazado (hasta 220 m a cada lado), sin quiebros (programación dinámica:
// la altura más un coste por desviarse de un punto al siguiente), sin pasar por los solares ni por los edificios y bajando hacia donde
// baja el valle. Solo se mueven los que antes quedaban cortados; los que deben quedarse donde están (el Cladeo de Olimpia, situado con
// sus coordenadas; el Nilo; el meandro del Adigio que rodea Verona) llevan keep.
function riverPL(I){return(typeof PLACES!=='undefined'?PLACES:[]).filter(p=>Math.abs(p.x-I.x)<I.R*1.4&&Math.abs(p.z-I.z)<I.R*1.4);}
// ¿pasaría el río por un solar, una estela o un edificio?
function riverHit(I,x,z,w,PL){for(const p of I.pads)if(Math.hypot(x-p.x,z-p.z)<p.r+w/2+8)return true;for(const p of PL)if(Math.hypot(x-p.x,z-p.z)<w/2+10)return true;
  try{const q={x,z};resolve(q,w/2+2);if(Math.hypot(q.x-x,q.z-z)>0.05)return true;}catch(e){}return false;}
function riverValley(I,pts,w){const n=pts.length,K=22,ST=10,R=I.R*1.18,nrm=[],PL=riverPL(I);
  for(let i=0;i<n;i++){const a=pts[Math.max(0,i-2)],b=pts[Math.min(n-1,i+2)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;nrm.push([-dz/l,dx/l]);}
  const at=(i,k)=>[pts[i][0]+nrm[i][0]*k*ST,pts[i][1]+nrm[i][1]*k*ST];
  const cost=(i,k)=>{const[x,z]=at(i,k),lx=x-I.x,lz=z-I.z;if(Math.abs(lx)>R||Math.abs(lz)>R)return 1e6;return uncarvedH(x,z)+(riverHit(I,x,z,w,PL)?400:0)+0.004*k*k*ST*ST/40;};   // un poco de preferencia por el trazado original
  const S=2*K+1;let D=new Float64Array(S),B=[];for(let k=-K;k<=K;k++)D[k+K]=cost(0,k);
  for(let i=1;i<n;i++){const N=new Float64Array(S),bk=new Int8Array(S),seg=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1])||1,mx=Math.max(1,Math.round(seg*0.7/ST));
    for(let k=0;k<S;k++){let best=1e18,bi=0;for(let j=Math.max(0,k-mx);j<=Math.min(S-1,k+mx);j++){const d=(k-j)*ST,v=D[j]+0.6*d*d/seg;if(v<best){best=v;bi=j;}}N[k]=best+cost(i,k-K);bk[k]=bi;}B.push(bk);D=N;}
  let k=0;for(let j=1;j<S;j++)if(D[j]<D[k])k=j;const ks=new Array(n);ks[n-1]=k;for(let i=n-1;i>0;i--){k=B[i-1][k];ks[i-1]=k;}
  let o=ks.map(k=>(k-K)*ST);for(let it=0;it<3;it++)o=o.map((v,i)=>i&&i<n-1?(o[i-1]+2*v+o[i+1])/4:v);
  let q=pts.map((p,i)=>[p[0]+nrm[i][0]*o[i],p[1]+nrm[i][1]*o[i]]);
  return q;}
// hasta dónde llega un trazado antes de que addRiver lo corte (el agua solo baja: se corta donde el terreno sube más de 10 m sobre ella)
function riverReach(pts){let L=1e9;for(let i=0;i<pts.length;i++){const h=uncarvedH(pts[i][0],pts[i][1]),lv=Math.max(-1,Math.min(L,h-0.4));if(i>3&&h-lv>10)return i;L=lv;}return pts.length;}
{const f=addRiver;addRiver=function(pts,w,opt){opt=opt||{};
  if(!opt.keep&&pts&&pts.length>3&&pts[0][0]>8000&&!/sinvalle/.test(location.search)){const I=islandOf(pts[0][0]);if(I&&demGet(I.id)&&I.pads&&riverReach(pts)<pts.length){try{const v=riverValley(I,pts,w),C=[pts,pts.slice().reverse(),v,v.slice().reverse()];const PL=riverPL(I);let b=0,bn=-1e9;C.forEach((c,i)=>{const r=riverReach(c);let k=0;for(let j=0;j<r;j++)if(riverHit(I,c[j][0],c[j][1],w,PL))k++;const sc=r-4*k+(i>1?1:0);if(sc>bn){bn=sc;b=i;}});pts=C[b];}catch(e){console.warn('riverValley',e);}}}   // de los cuatro trazados (el original o por el valle, en un sentido o en el otro), el que llega más lejos sin pasar por solares, estelas ni edificios
  return f.call(this,pts,w,opt);};}
