// ============================================================ MÁS MODELOS DE BLENDER Y DETALLES DE LA CIUDAD (27/11)
// 1. Animales de casa y de campo de Blender (herramientas/blender/criaturas.py, lote4 → modelos/criaturas4.glb → datos/glbcr4.txt):
//    gallina (y gallo, la misma con otro plumaje y algo más grande), cabra y cerdo. Sustituyen a las figuras sencillas de 052 igual que
//    los gatos de 263 y siguen moviéndose igual. Los cerdos antiguos eran más oscuros y cerdosos que los de hoy (Varrón, Sobre el
//    campo II 4; Columela VII 9 prefiere las cerdas negras en los sitios fríos): por eso el modelo es pardo oscuro.
// 2. Puestos de mercado (K2_puesto1/2/3 de edificios.py: pescado, cerámica, telas y especias) en el Ágora y en el Macellum, con el
//    toldo de un color distinto en cada uno. Los puestos de madera y toldo (skenai) del Ágora: Demóstenes, Sobre la corona 169.
// 3. Luz en las cellas: un haz de luz con polvo entra por la puerta de cada templo griego. Los templos miraban casi siempre al este
//    (la estatua veía salir el sol: Vitruvio IV 5), así que la luz entraba por la mañana. Solo de día y no en el modo ligero.
// 4. Fuentes con agua que cae: un chorro desde cada caño (krene de Atenas, lacus de Roma) y gotas que salpican. Las gotas se
//    mueven en la tarjeta gráfica (sin trabajo para el procesador): una llamada de dibujo para todos los chorros y otra para las gotas.
// 5. Roma en el año 80: el incendio de ese año quemó el templo de Júpiter Capitolino (Dion Casio LXVI 24). Aquí el techo dorado
//    aparece quemado, con andamios de madera, vigas carbonizadas y bloques nuevos; Domiciano lo reconstruyó y lo dedicó hacia el 82
//    (Suetonio, Domiciano 5; Plutarco, Publícola 15). En el Anfiteatro Flavio, inaugurado este año por Tito con cien días de juegos
//    (Suetonio, Tito 7; Dion Casio LXVI 25), un tramo del ático aún con andamios: según el Cronógrafo del 354 lo terminó Domiciano.
const GB8={tpl:null,loading:false,done:new WeakSet(),t:0,mats:new Map(),stalls:0,shafts:[],spouts:[],fx:null,cap:0};
// ---------- 1. animales
function gb8Load(){if(GB8.tpl||GB8.loading||typeof bpBytes!=='function')return;GB8.loading=true;
  bpBytes('glbcr4').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const T={};gl.scene.traverse(o=>{if(/^CR_/.test(o.name))T[o.name]=o;if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});gl.scene.updateMatrixWorld(true);GB8.tpl=T;},e=>console.warn('gx8',e));}).catch(e=>console.warn('gx8',e));}
function gb8Part(n){const T=GB8.tpl&&GB8.tpl[n];return T?T.clone(true):null;}
function gb8Tint(o,hex,k){if(!hex)return;o.traverse(m=>{if(!m.isMesh)return;const key=m.material.uuid+hex;let M=GB8.mats.get(key);if(!M){M=m.material.clone();M.color=new THREE.Color(hex).lerp(new THREE.Color('#ffffff'),k);GB8.mats.set(key,M);}m.material=M;});}
function gb8Model(key,tint,k){const B=gb8Part('CR_'+key+'_cuerpo');if(!B)return null;const g=new THREE.Group();g.add(B);B.position.set(0,0,0);const legs=[];
  for(const n of['pDI','pDD','pTI','pTD']){const p=gb8Part('CR_'+key+'_'+n);if(!p)continue;const piv=new THREE.Group();piv.position.copy(p.position);p.position.set(0,0,0);piv.add(p);g.add(piv);legs.push(piv);}
  gb8Tint(g,tint,k);g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=false;}});return {g,legs,body:B};}
const GB8_SP={hen:'gallina',rooster:'gallina',goat:'cabra',pig:'cerdo'};
{const f=faunaAdd;faunaAdd=function(sp,x,z,o){const F=f.apply(this,arguments);if(F&&o&&o.c)F.c=o.c;return F;};}   // el color de cada animal, para teñir el modelo
function gb8Upgrade(F){if(GB8.done.has(F)||!F.A||!F.A.g)return;GB8.done.add(F);const key=GB8_SP[F.sp];if(!key)return;const c=F.c||(F.o&&F.o.c)||{};
  // gallinas y gallos: el color de su plumaje; cabras: su capa; cerdos: el modelo tal cual (los rosados de 052 eran de hoy)
  const tint=F.sp==='pig'?null:F.sp==='goat'?(c.coat||null):(c.feather||(F.sp==='rooster'?'#a0402a':null)),k=F.sp==='goat'?0.5:0.35;
  const M=gb8Model(key,tint,k);if(!M)return;const A=F.A,g=A.g;for(const ch of g.children)ch.visible=false;const s=g.scale.x||1;
  M.g.scale.setScalar((F.sp==='rooster'?1.15:1)*(s<0.8?1:1/s));g.add(M.g);A.legs=M.legs;A.head=new THREE.Object3D();A.body=new THREE.Object3D();A.tail=null;M.g.userData.gx8=1;
  if(F.beh==='lie'){g.position.y=floorAt(g.position.x,g.position.z);F.beh='still';}if(F.beh==='sit')F.beh='still';}
// ---------- 2. puestos de mercado
const GB8_AWN=['#b8462e','#d8c8a0','#3a5a8a','#8a6a2a','#e2d6bc','#6a2a3a','#4a6a3a','#c9862a'];
function gb8Stalls(){if(GB8.stalls||typeof PLACES==='undefined'||!PLACES.length||typeof GLB==='undefined'||!GLB.ok)return;if(!Object.keys(GLB.parts||{}).some(n=>n.indexOf('K2_puesto1_')===0))return;GB8.stalls=-1;
  const P=[PLACES.find(p=>p.id==='mercado'),PLACES.find(p=>p.id==='ro_macellum'),PLACES.find(p=>p.id==='ro_subura')].filter(Boolean);const by={1:[],2:[],3:[]};let n=0;
  for(const pl of P){const a0=(pl.rot||0);for(let i=0;i<9;i++){const row=Math.floor(i/3),col=i%3,lx=(col-1)*4.2+(row%2)*1.5,lz=10+row*5.5;let [x,z]=toW(lx,lz,pl.x,pl.z,a0);
      try{if(!isFree(x,z,1.8)){const f=findFree(x,z,1.8);if(Math.hypot(f[0]-x,f[1]-z)>6)continue;x=f[0];z=f[1];}}catch(e){continue;}
      const kind=1+((i+(pl.id.length))%3),a=a0+Math.PI+(R()-0.5)*0.3;by[kind].push({x,y:floorAt(x,z),z,a,cr:new THREE.Color(GB8_AWN[(i*3+pl.id.length)%GB8_AWN.length])});addBox(x,z,3.0,2.4,a);n++;}}
  for(const k in by)if(by[k].length)placeModules('K2_puesto'+k,by[k],{far:500});GB8.stalls=n;}
// ---------- 3. luz en las cellas (envuelve temple() de 008)
const GB8_SHAFT=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{uI:{value:0},uT:{value:0}},
  vertexShader:'varying vec2 vUv;varying vec3 vP;void main(){vUv=uv;vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform float uI;uniform float uT;varying vec2 vUv;varying vec3 vP;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){float e=smoothstep(0.0,0.25,vUv.x)*smoothstep(1.0,0.75,vUv.x);float f=mix(0.35,1.0,vUv.y);float d=step(0.985,h(floor(vec2(vUv.x*60.0,vUv.y*90.0+uT*1.5))))*0.8;gl_FragColor=vec4(vec3(1.0,0.9,0.7)*(e*f*(0.55+d))*uI,1.0);}'});
function gb8Shaft(r,o){try{const C=o.cella;if(!C||!r||!r.g)return;if(typeof ACC!=='undefined'&&ACC.lite)return;
  const cw=C.w,cl=C.l,t=C.t||0.9,oz=C.oz||0,e=o.entH||o.colH*(o.order==='ionic'?0.24:0.32),hh=o.colH+e*0.4,door=C.door||Math.min(4.5,cw*0.3),zd=oz+cl/2-t,y0=r.base;
  const top=y0+hh*0.82,L=Math.min(cl-2*t-1,hh*1.1),w=door*0.9,geo=new THREE.BufferGeometry();
  // un haz inclinado desde lo alto de la puerta hasta el suelo de la cella, y la mancha de luz en el suelo
  const v=[-w/2,top,zd, w/2,top,zd, w/2,y0+0.03,zd-L, -w/2,y0+0.03,zd-L,  -w/2,y0+0.03,zd, w/2,y0+0.03,zd, w/2,y0+0.03,zd-L, -w/2,y0+0.03,zd-L];
  const uv=[0,1,1,1,1,0,0,0, 0,0.6,1,0.6,1,0.2,0,0.2];geo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);
  const m=new THREE.Mesh(geo,GB8_SHAFT);m.renderOrder=3;m.userData.noSeal=1;m.userData.noInst=1;m.userData.noCol=1;r.g.add(m);GB8.shafts.push(m);}catch(e){}}
{const f=temple;temple=function(o){const r=f.apply(this,arguments);gb8Shaft(r,o);return r;};}
// ---------- 4. fuentes: se apuntan los caños al construirlos (envuelve pieceAt de 031)
{const f=pieceAt;pieceAt=function(key,geo,mat,b,lx,ly,lz,sx,sy,sz){const r=f.apply(this,arguments);try{
  if(key==='kreS'){const p=toW(lx,lz+0.2,b.x,b.z,b.a);GB8.spouts.push({x:p[0],z:p[1],y0:b.y+ly+0.1,y1:b.y+0.78,a:b.a});}
  else if(key==='lacusM'){const p=toW(lx,lz+0.15,b.x,b.z,b.a);GB8.spouts.push({x:p[0],z:p[1],y0:b.y+ly+0.05,y1:b.y+0.9,a:b.a});}}catch(e){}return r;};}
function gb8Fountains(){if(GB8.fx||!GB8.spouts.length)return;const S=GB8.spouts.slice(0,160),N=S.length;GB8.fx=1;
  const sg=new THREE.CylinderGeometry(0.025,0.04,1,6,1,true);sg.translate(0,-0.5,0);
  const sm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:true,uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{uT:{value:0}}]),
    vertexShader:'varying float vY;\n#include <fog_pars_vertex>\nvoid main(){vY=position.y;vec4 mvPosition=modelViewMatrix*instanceMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
    fragmentShader:'uniform float uT;varying float vY;\n#include <fog_pars_fragment>\nvoid main(){float s=0.6+0.4*sin(vY*40.0+uT*25.0);gl_FragColor=vec4(mix(vec3(0.55,0.7,0.78),vec3(0.95),s*0.5),0.55);\n#include <fog_fragment>\n}'});
  const im=new THREE.InstancedMesh(sg,sm,N),M4=new THREE.Matrix4();S.forEach((s,i)=>{M4.makeScale(1,Math.max(0.2,s.y0-s.y1),1);M4.setPosition(s.x,s.y0,s.z);im.setMatrixAt(i,M4);});
  im.userData.noSeal=1;im.userData.noInst=1;im.userData.noCol=1;im.frustumCulled=false;scene.add(im);
  // gotas: 14 por caño, con su punto de origen y una semilla; el vértice calcula su salto parabólico y vuelve a empezar
  const K=14,pos=new Float32Array(N*K*3),sd=new Float32Array(N*K);S.forEach((s,i)=>{for(let k=0;k<K;k++){const j=i*K+k;pos[j*3]=s.x;pos[j*3+1]=s.y1;pos[j*3+2]=s.z;sd[j]=Math.random();}});
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));pg.setAttribute('aS',new THREE.BufferAttribute(sd,1));
  const pm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uT:{value:0}},
    vertexShader:'uniform float uT;attribute float aS;varying float vA;void main(){float t=fract(uT*1.6+aS*7.0);float an=aS*61.0;vec3 v=vec3(cos(an),0.0,sin(an))*(0.25+aS*0.35);vec3 p=position+v*t+vec3(0.0,1.1*t-2.6*t*t,0.0);vA=1.0-t;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=clamp(28.0/-mv.z,1.0,5.0);gl_Position=projectionMatrix*mv;}',
    fragmentShader:'varying float vA;void main(){vec2 c=gl_PointCoord-0.5;if(dot(c,c)>0.25)discard;gl_FragColor=vec4(0.85,0.92,0.97,0.75*vA);}'});
  const pts=new THREE.Points(pg,pm);pts.frustumCulled=false;pts.userData.noSeal=1;pts.userData.noInst=1;scene.add(pts);GB8.fx={im,pts,sm,pm,n:N};}
// ---------- 5. Roma en el año 80: el Capitolio quemado y el ático del anfiteatro
function gb8Scaffold(list,wood){if(!list.length)return null;const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),wood,list.length),M4=new THREE.Matrix4(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),p=new THREE.Vector3(),s=new THREE.Vector3();
  list.forEach((b,i)=>{q.setFromAxisAngle(up,b.a||0);p.set(b.x,b.y,b.z);s.set(b.sx,b.sy,b.sz);im.setMatrixAt(i,M4.compose(p,q,s));});im.castShadow=true;im.receiveShadow=true;im.userData.noSeal=1;im.userData.noInst=1;
  im.geometry.computeBoundingSphere();const bx=new THREE.Box3();for(const b of list)bx.expandByPoint(new THREE.Vector3(b.x,b.y,b.z));im.geometry.boundingSphere=bx.getBoundingSphere(new THREE.Sphere());im.geometry.boundingSphere.radius+=3;scene.add(im);return im;}
function gb8Rome80(){if(GB8.r80||MODE!=='roma'||typeof PLACES==='undefined'||!PLACES.length)return;GB8.r80=1;const wood=lam('#8a6a48'),B=[];
  // el templo (029: x -228, z 22, 53 × 62 m, columnas de 15 m sobre un podio de 4): andamio a lo largo del frente y de un lado
  const tx=-228,tz=22,W=53,L=62,gy=floorAt(tx,tz),H=19;
  const run=(x1,z1,x2,z2)=>{const len=Math.hypot(x2-x1,z2-z1),a=Math.atan2(x2-x1,z2-z1),n=Math.max(1,Math.round(len/3));
    for(let i=0;i<=n;i++){const x=x1+(x2-x1)*i/n,z=z1+(z2-z1)*i/n;B.push({x,y:gy+H/2,z,sx:0.16,sy:H,sz:0.16});}
    for(let h=2;h<H;h+=2.2){B.push({x:(x1+x2)/2,y:gy+h,z:(z1+z2)/2,a,sx:0.1,sy:0.1,sz:len});if(h%4.4<2.3)B.push({x:(x1+x2)/2,y:gy+h+0.06,z:(z1+z2)/2,a,sx:0.9,sy:0.05,sz:len});}};
  run(tx-W/2-1.2,tz+L/2+1.2,tx+W/2+1.2,tz+L/2+1.2);run(tx+W/2+1.2,tz+L/2+1.2,tx+W/2+1.2,tz-L/2+6);
  const sc=gb8Scaffold(B,wood);
  // el techo dorado, quemado: la madera ardió y el bronce dorado de las tejas se fundió
  try{const burnt=lam('#2e2622');scene.traverse(o=>{if(!o.isMesh||!o.material||!o.material.color||Array.isArray(o.material))return;if(o.material.color.getHexString()!=='c9a24a')return;const v=new THREE.Vector3();o.getWorldPosition(v);if(Math.hypot(v.x-tx,v.z-tz)<45)o.material=burnt;});}catch(e){}
  // vigas quemadas y bloques nuevos al pie
  const D=[],S=[];for(let i=0;i<10;i++){const x=tx-W/2+4+i*4.5,z=tz+L/2+7+(i%3);D.push({x,y:floorAt(x,z)+0.25+(i%2)*0.5,z,a:R()*0.6,sx:0.5,sy:0.5,sz:6+R()*3});}
  for(let i=0;i<8;i++){const x=tx+W/2+6+(i%2)*1.8,z=tz+10-Math.floor(i/2)*2.4;S.push({x,y:floorAt(x,z)+0.6,z,sx:1.6,sy:1.2,sz:2.2});}
  gb8Scaffold(D,lam('#1e1a18'));gb8Scaffold(S,lam('#ece6d8'));
  try{egxObj(tx+W/2+8,tz+L/2+6,undefined,()=>jmDlg('🔥','El templo quemado','Júpiter Óptimo Máximo, en obras','<p>El incendio de este año, tres días y tres noches mientras Tito estaba en Campania, alcanzó el Capitolio y quemó el templo de Júpiter, Juno y Minerva. Es la tercera vez que arde: ya había ardido en el 83 a.C. y en el 69, en la guerra civil. Tito ha prometido reconstruirlo; lo terminará su hermano Domiciano, que lo cubrirá de oro.</p><p class="sub">Dion Casio LXVI 24; Suetonio, Domiciano 5; Plutarco, Publícola 15 (el dorado de Domiciano). El aspecto del techo quemado y de los andamios es una reconstrucción.</p>',[['Seguir',()=>{}]]),'Templo en obras','tras el incendio del 80',2.4);}catch(e){}
  // el anfiteatro (029: centro 400, 60; semiejes 94 × 78; el ático empieza a 34,1 m)
  const C={x:400,z:60},A2=94+1.4,B2=78+1.4,F=[];for(let i=0;i<=14;i++){const t=0.58*Math.PI*2+i*0.022,x=C.x+A2*Math.cos(t),z=C.z+B2*Math.sin(t);F.push({x,y:2+34.1+6,z,sx:0.18,sy:12.5,sz:0.18});
    if(i<14){const t2=t+0.011,xm=C.x+A2*Math.cos(t2),zm=C.z+B2*Math.sin(t2);for(let h=36;h<48;h+=2.2)F.push({x:xm,y:2+h,z:zm,a:Math.atan2(-A2*Math.sin(t2),B2*Math.cos(t2)),sx:0.1,sy:0.1,sz:2.2});}}
  gb8Scaffold(F,wood);
  try{const x=C.x+(A2+8)*Math.cos(0.58*Math.PI*2+0.15),z=C.z+(B2+8)*Math.sin(0.58*Math.PI*2+0.15);egxObj(x,z,undefined,()=>jmDlg('🏟','Aún en obras','El ático del anfiteatro','<p>Tito inaugura el anfiteatro este año con cien días de juegos, pero el edificio no está terminado del todo: los andamios del último piso lo recuerdan. Lo acabará su hermano Domiciano, que también construirá las galerías bajo la arena.</p><p class="sub">Suetonio, Tito 7; Dion Casio LXVI 25; Cronógrafo del año 354 (Domiciano lo termina «hasta los escudos»). Qué parte exacta faltaba es incierto.</p>',[['Seguir',()=>{}]]),'Andamios','el anfiteatro, aún sin terminar',2.4);}catch(e){}
  GB8.r80=2;}
// ---------- bucle
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;
  let I=0;try{I=clamp((sun.intensity||0)*0.35,0,0.35)*(sun.position.y>0?1:0);}catch(e){}GB8_SHAFT.uniforms.uI.value=I;GB8_SHAFT.uniforms.uT.value+=dt;
  if(GB8.fx&&GB8.fx.sm){GB8.fx.sm.uniforms.uT.value+=dt;GB8.fx.pm.uniforms.uT.value+=dt;}
  GB8.t+=dt;if(GB8.t<1.5)return r;GB8.t=0;gb8Stalls();gb8Fountains();gb8Rome80();
  if(typeof FAUNA==='undefined'||!FAUNA.length)return r;if(!FAUNA.some(F=>GB8_SP[F.sp]))return r;gb8Load();if(!GB8.tpl)return r;
  let n=0;for(const F of FAUNA)if(GB8_SP[F.sp]&&!GB8.done.has(F)){gb8Upgrade(F);if(++n>=20)break;}}catch(e){if(!GB8.err){GB8.err=1;console.warn('gx8',e);}}return r;};}
GB8.all=function(){gb8Stalls();gb8Fountains();gb8Rome80();gb8Load();if(!GB8.tpl)return 0;let n=0;for(const F of FAUNA)if(GB8_SP[F.sp]&&!GB8.done.has(F)){gb8Upgrade(F);n++;}return n;};   // para las pruebas
GB8.fa=()=>typeof FAUNA!=='undefined'?FAUNA:[];GB8.toW=toW;
