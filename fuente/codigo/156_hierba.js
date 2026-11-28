// ============================================================ HIERBA DE VERDAD: briznas instanciadas alrededor del jugador
// Antes solo había textura en el suelo y matas redondas. Ahora, siguiendo las técnicas habituales (InstancedMesh + viento en el shader):
// · matojos de 7 briznas finas y curvadas, miles de copias en un radio de ~34 m que se recolocan al andar (siempre iguales en cada sitio: hash de la celda);
// · raíz oscura y punta clara (color por vértice) y un tinte por matojo; normales hacia arriba para que se iluminen como el suelo y no «brillen» de canto;
// · viento en el shader: balanceo desfasado por matojo + ráfagas que recorren el campo como una ola; se aparta al pasar el jugador;
// · manchas: la densidad sale de un ruido (prados y claros), nada en caminos, ciudades, agua, pendientes fuertes ni junto a edificios;
// · se encoge al llegar al borde del radio, para que no aparezca de golpe; colores según la estación (el Ática se agosta en verano; Italia, más verde).
const GR={on:true,mesh:null,cx:1e9,cz:1e9,C:1.4,R:34,max:0,cache:new Map(),u:{uP:{value:new THREE.Vector3()},uQ:{value:[new THREE.Vector4(0,-9999,0,1),new THREE.Vector4(0,-9999,0,1),new THREE.Vector4(0,-9999,0,1),new THREE.Vector4(0,-9999,0,1)]}}};   // uQ: otros que pisan la hierba (caballo, perro, gente) (256)
function grGeo(){const pos=[],col=[],nor=[],idx=[];const B=7,S=3;
  for(let b=0;b<B;b++){const a=b/B*TAU+hash(b,3)*0.9,r=b?0.09+hash(b,5)*0.15:0,ox=Math.cos(a)*r,oz=Math.sin(a)*r,h=0.22+hash(b,7)*0.22,w=0.026+hash(b,9)*0.014,face=hash(b,11)*TAU,lean=0.08+hash(b,13)*0.14,lx=Math.cos(a),lz=Math.sin(a);
    const fx=Math.cos(face),fz=Math.sin(face),base=pos.length/3;
    for(let s=0;s<=S;s++){const t=s/S,hw=w*(1-t*0.92),bx=ox+lx*lean*t*t,bz=oz+lz*lean*t*t,y=h*t;
      pos.push(bx-fx*hw,y,bz-fz*hw, bx+fx*hw,y,bz+fz*hw);const c=0.62+0.38*t;col.push(c,c,c,c,c,c);nor.push(0,1,0,0,1,0);}
    for(let s=0;s<S;s++){const i=base+s*2;idx.push(i,i+1,i+3,i,i+3,i+2);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setIndex(idx);g.computeBoundingSphere();return g;}
function grMat(){const m=new THREE.MeshLambertMaterial({color:0xffffff,vertexColors:true,side:THREE.DoubleSide});
  m.onBeforeCompile=sh=>{sh.uniforms.uWT=WIND.u;sh.uniforms.uWS=WIND.s;sh.uniforms.uP=GR.u.uP;sh.uniforms.uQ=GR.u.uQ;
    sh.vertexShader='uniform float uWT;uniform float uWS;uniform vec3 uP;uniform vec4 uQ[4];\n'+sh.vertexShader.replace('#include <project_vertex>',
`vec4 wp=vec4(transformed,1.0);
#ifdef USE_INSTANCING
wp=instanceMatrix*wp;
#endif
wp=modelMatrix*wp;
float hk=clamp(position.y/0.44,0.0,1.0);hk*=hk;
float ph=wp.x*0.37+wp.z*0.29;
float gust=sin(dot(wp.xz,vec2(0.07,0.045))-uWT*1.7)*0.5+0.5;
float sw=(sin(uWT*2.2+ph)*0.55+sin(uWT*3.9+ph*1.8)*0.2+gust*1.1)*uWS;
wp.xz+=vec2(0.82,0.57)*sw*0.16*hk;
vec2 dp=wp.xz-uP.xz;float dl=length(dp);float pu=(1.0-smoothstep(0.2,1.3,dl))*step(abs(wp.y-uP.y),2.0);
wp.xz+=normalize(dp+vec2(0.0001))*pu*0.38*hk;wp.y-=pu*0.25*hk;
for(int i=0;i<4;i++){vec2 dq=wp.xz-uQ[i].xz;float dm=length(dq);float pq=(1.0-smoothstep(0.15,uQ[i].w,dm))*step(abs(wp.y-uQ[i].y),2.0);wp.xz+=normalize(dq+vec2(0.0001))*pq*0.34*hk;wp.y-=pq*0.22*hk;}
vec4 mvPosition=viewMatrix*wp;gl_Position=projectionMatrix*mvPosition;`);
  sh.fragmentShader=sh.fragmentShader.split('gl_FrontFacing').join('true');};
  m.customProgramCacheKey=()=>'hierba3';return m;}
function grInit(){const touch=typeof isTouch!=='undefined'&&isTouch,lite=typeof ACC!=='undefined'&&ACC.lite;GR.R=lite?20:touch?26:34;GR.max=lite?3000:touch?6000:14000;
  GR.mesh=new THREE.InstancedMesh(grGeo(),grMat(),GR.max);GR.mesh.count=0;GR.mesh.frustumCulled=false;GR.mesh.receiveShadow=true;GR.mesh.castShadow=false;GR.mesh.userData.noCull=true;GR.mesh.userData.veg=true;
  GR.mesh.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(GR.max*3),3);scene.add(GR.mesh);}
// colores de la punta según estación y lugar
function grPal(green){let mo=3;try{mo=calNow().mo;}catch(e){}const sum=mo>=5&&mo<=8,aut=mo>=9&&mo<=10;
  if(green)return sum?['#8a9a4a','#9aa452','#7d9044']:['#6f9a3c','#7fa846','#64903a'];
  return sum?['#c9b47a','#d6c08a','#bba468']:aut?['#a8a060','#b4a868','#98a058']:['#8ea050','#9cac58','#a8aa62'];}
function grCell(i,j){const k=i+','+j;let r=GR.cache.get(k);if(r!==undefined)return r;r=0;const C=GR.C,x=(i+0.5)*C,z=(j+0.5)*C;
  do{const t=terrainH(x,z);if(t<1.4)break;const w=riverWater(x,z);if(w!==null&&w>t-0.6)break;
    let green=false;if(x>8000){const I=islandOf(x);if(!I||I.desert)break;green=!!I.green;}else{if(MODE==='roma'?romaInUrbs(x,z):insideWalls(x,z))break;green=MODE==='roma';}
    if(x<8000&&roadDist(x,z)<2.8)break;
    const sl=(Math.abs(terrainH(x+1,z)-terrainH(x-1,z))+Math.abs(terrainH(x,z+1)-terrainH(x,z-1)))/4;if(sl>0.45)break;
    if(!isFree(x,z,0.7))break;
    let fm=1;if(typeof fieldAt==='function'){const ft=fieldAt(x,z);fm=[1,0,0.75,0,0.25,0.6][ft]||1;}if(fm<=0)break;
    const n=fbm(x*0.035+11,z*0.035-7),d=Math.max(0,Math.min(1,(n-(green?0.3:0.42))*3.2))*(1-sl*1.4)*fm;if(d<=0.05)break;r={d,green};}while(false);
  if(GR.cache.size>90000)GR.cache.clear();GR.cache.set(k,r);return r;}
function grTick(){if(!GR.on||!state||ui==='start')return;if(!GR.mesh)grInit();const P=player;GR.u.uP.value.set(P.x,P.feet,P.z);
  const hide=P.feet>(P.x>8000?400:300)||(typeof EPI!=='undefined'&&EPI.cur);GR.mesh.visible=!hide;if(hide)return;
  if(Math.hypot(P.x-GR.cx,P.z-GR.cz)<4.5)return;GR.cx=P.x;GR.cz=P.z;
  const C=GR.C,R=GR.R,i0=Math.floor((P.x-R)/C),i1=Math.floor((P.x+R)/C),j0=Math.floor((P.z-R)/C),j1=Math.floor((P.z+R)/C),m=new THREE.Matrix4(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),sc=new THREE.Vector3(),p=new THREE.Vector3(),col=new THREE.Color();
  const palG=grPal(true).map(c=>new THREE.Color(c)),palD=grPal(false).map(c=>new THREE.Color(c));let n=0;
  for(let i=i0;i<=i1&&n<GR.max;i++)for(let j=j0;j<=j1&&n<GR.max;j++){const c=grCell(i,j);if(!c)continue;const cxx=(i+0.5)*C,czz=(j+0.5)*C,dd=Math.hypot(cxx-P.x,czz-P.z);if(dd>R)continue;
    const k=Math.round(c.d*8);for(let s=0;s<k&&n<GR.max;s++){const x=(i+hash(i*7+s,j*3))*C,z=(j+hash(i*3,j*7+s))*C,d=Math.hypot(x-P.x,z-P.z);if(d>R)continue;
      const fade=Math.min(1,(R-d)/7),sz=(0.55+hash(i+s*11,j)*0.5)*(0.7+c.d*0.4)*fade;if(sz<0.08)continue;
      q.setFromAxisAngle(up,hash(i,j+s*13)*TAU);sc.set(sz,sz*(0.8+hash(j,i+s)*0.5),sz);p.set(x,terrainH(x,z)-0.03,z);m.compose(p,q,sc);GR.mesh.setMatrixAt(n,m);
      const pal=c.green?palG:palD;col.copy(pal[Math.floor(hash(i+s,j*5)*3)]).offsetHSL((hash(x,z)-0.5)*0.03,0,(hash(z,x)-0.5)*0.08);GR.mesh.setColorAt(n,col);n++;}}
  GR.mesh.count=n;GR.mesh.instanceMatrix.needsUpdate=true;GR.mesh.instanceColor.needsUpdate=true;}
// al cambiar de estación, recolorear
{let lastMo=-1;const f=uxTick;uxTick=function(dt){f(dt);try{let mo=-1;try{mo=calNow().mo;}catch(e){}if(mo!==lastMo){lastMo=mo;GR.cx=1e9;}grTick();}catch(e){}};}
// ---------------------------------------------------------------- el suelo bajo la hierba: una capa verde que sigue el terreno alrededor del jugador
// Antes la hierba salía de arena pelada. Ahora una malla (misma rejilla que la hierba) tiñe el suelo donde hay hierba, con bordes suaves
// (cada vértice promedia las 9 celdas vecinas) y se desvanece en el borde del radio. Va en una capa transparente encima del terreno.
const GRG={mesh:null,n:0,a:null,c:null,p:null};
function grgInit(){const R=GR.R,C=GR.C,n=Math.ceil(R*2/C)+3;GRG.n=n;const g=new THREE.PlaneGeometry(1,1,n-1,n-1);g.rotateX(-Math.PI/2);
  GRG.p=g.attributes.position;GRG.a=new THREE.BufferAttribute(new Float32Array(n*n),1);GRG.c=new THREE.BufferAttribute(new Float32Array(n*n*3),3);g.setAttribute('aA',GRG.a);g.setAttribute('color',GRG.c);
  const m=new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-6});
  m.onBeforeCompile=sh=>{sh.vertexShader='attribute float aA;varying float vA;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvA=aA;');
    sh.fragmentShader='varying float vA;\n'+sh.fragmentShader.replace('#include <tonemapping_fragment>','gl_FragColor.a*=vA;\n#include <tonemapping_fragment>');};
  m.customProgramCacheKey=()=>'sueloHierba1';GRG.mesh=new THREE.Mesh(g,m);GRG.mesh.frustumCulled=false;GRG.mesh.receiveShadow=true;GRG.mesh.renderOrder=1;GRG.mesh.userData.noCull=true;GRG.mesh.userData.veg=true;scene.add(GRG.mesh);}
function grgBuild(){if(!GRG.mesh)grgInit();const P=player,C=GR.C,n=GRG.n,R=GR.R,ci=Math.floor(P.x/C),cj=Math.floor(P.z/C),h=Math.floor(n/2),col=new THREE.Color();
  let mo=3;try{mo=calNow().mo;}catch(e){}const sum=mo>=5&&mo<=8;const cG=new THREE.Color(sum?'#6a7a38':'#46682a'),cD=new THREE.Color(sum?'#94844a':'#62723a');
  const d=(i,j)=>{const c=grCell(i,j);return c?c.d:0;};
  for(let a=0;a<n;a++)for(let b=0;b<n;b++){const i=ci-h+a,j=cj-h+b,x=i*C,z=j*C,k=b*n+a;   // vértice en la esquina (i,j) de la rejilla de la hierba
    let s=0,gr=0;for(let u=-1;u<=0;u++)for(let v=-1;v<=0;v++){const c=grCell(i+u,j+v);if(c){s+=c.d;if(c.green)gr++;}}
    s+=0.5*(d(i-2,j-1)+d(i+1,j-1)+d(i-1,j-2)+d(i-1,j+1));s/=6;
    const dist=Math.hypot(x-P.x,z-P.z),fade=Math.max(0,Math.min(1,(R-dist)/8));
    GRG.p.setXYZ(k,x,terrainH(x,z)+0.1,z);GRG.a.setX(k,Math.min(0.82,s*1.05)*fade);col.copy(gr>=2?cG:cD);GRG.c.setXYZ(k,col.r,col.g,col.b);}
  GRG.p.needsUpdate=true;GRG.a.needsUpdate=true;GRG.c.needsUpdate=true;GRG.mesh.geometry.computeVertexNormals();}
{const f=grTick;grTick=function(){const ox=GR.cx,oz=GR.cz;f();if(!GR.mesh)return;if(GRG.mesh)GRG.mesh.visible=GR.mesh.visible;if(GR.mesh.visible&&(GR.cx!==ox||GR.cz!==oz))grgBuild();};}
