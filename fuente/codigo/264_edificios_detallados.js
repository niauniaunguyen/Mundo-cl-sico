// ============================================================ EDIFICIOS DETALLADOS (27/11)
// Casas modeladas de nuevo en Blender (herramientas/blender/edificios.py → modelos/edificios.glb → #glbed), con las mismas medidas,
// origen y orientación que las sencillas de atenas_modelos.glb (H_gra, H_grb, H_grc, H_farm, H_dom, H_insa, H_insb):
// tejas planas y cobijas con antefijas, cumbrera, cabezas de vigas, zócalo de piedra, puertas de dos hojas con clavos, ventanas con
// postigos, patio empedrado con pórtico (pastas), altar y brocal de cisterna; granja con era, pithoi, horno y cerca de piedra seca;
// domus con tabernae, fauces, compluvio, impluvio y peristilo; ínsulas con tiendas de arco, balcón de madera y postigos.
// Segunda tanda (propuestas 3-10):
//  · variantes de cada casa (H2_gra2, H2_gra3…): con tienda a la calle, con telar en el pórtico y el tejado en obras, granja con torre…
//    Cada casa elige la suya según su posición (siempre la misma).
//  · interiores pintados en los huecos de las puertas y de las tiendas (hogar, telar, tienda, atrio) y rótulos pintados en las
//    fachadas romanas (textos reales de Pompeya: no hay carteles electorales, porque en Roma ya no se votaba a los magistrados)
//  · color de los vértices horneado en Blender: sombra en rincones, aleros y juntas (oclusión ambiental), humedad al pie de los muros,
//    chorreones bajo el alero y tejas de distinto tono
//  · tres niveles de detalle: detallada (H2) de cerca, intermedia (H3, sin piezas pequeñas) a media distancia y la sencilla de lejos.
//    El juego decide por zonas de 420 m (CHUNKS near/far): nunca se dibujan dos versiones de la misma casa a la vez.
const ED={ok:false,n:0,D1:520,D2:1150,N1:90,N2:260,
  map:{H_gra:['H2_gra','H2_gra2','H2_gra3'],H_grb:['H2_grb','H2_grb2'],H_grc:['H2_grc','H2_grc2'],H_farm:['H2_farm','H2_farm2'],H_dom:['H2_dom','H2_dom2'],H_insa:['H2_insa','H2_insa2'],H_insb:['H2_insb','H2_insb2']},
  mid:{H_gra:'H3_gra',H_grb:'H3_grb',H_grc:'H3_grc',H_farm:'H3_farm',H_dom:'H3_dom',H_insa:'H3_insa',H_insb:'H3_insb'},
  vc:new Map(),geoRole:new Map(),tex:{}};
try{if(typeof ACC!=='undefined'&&ACC.lite){ED.D1=380;ED.D2=760;ED.N1=30;ED.N2=80;}else if(typeof isTouch!=='undefined'&&isTouch){ED.D1=430;ED.D2=900;ED.N1=50;ED.N2=150;}}catch(e){}
Object.assign(ROLE_C,{redpaint:'#8e3a2a',mud:'#8f7255',paintred:'#a8463a',paintblue:'#3a5488',interior:'#3a2c20',sign:'#e8dfcc',lares:'#c9a27a'});
function edParse(done){let p;try{p=bpBytes('glbed');}catch(e){done();return;}
  p.then(buf=>{if(!buf){done();return;}new THREE.GLTFLoader().parse(buf,'',gl=>{gl.scene.updateMatrixWorld(true);
    for(const o of gl.scene.children){if(!/^(H2|H3|K2)_/.test(o.name))continue;const list=[];
      o.traverse(m=>{if(m.isMesh){m.geometry.computeBoundingSphere();list.push({geo:m.geometry,role:m.material.name,mat:new THREE.Matrix4()});ED.geoRole.set(m.geometry.attributes.position,m.material.name);}});
      GLB.parts[o.name]={pos:new THREE.Vector3(),meshes:list};ED.n++;}
    ED.ok=ED.n>0;done();},e=>{console.warn('edificios',e);done();});}).catch(e=>{console.warn('edificios',e);done();});}
{const f=loadModels;loadModels=function(done){return f.call(this,()=>{try{edParse(done);}catch(e){console.warn('edificios',e);done();}});};}
// ---------------------------------------------------------------- texturas pintadas (interiores, rótulos, Lares)
function edCanvas(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.flipY=false;if(THREE.sRGBEncoding)t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}   // coordenadas de glTF: sin voltear
function edInteriorTex(){if(ED.tex.int)return ED.tex.int;return ED.tex.int=edCanvas(1024,256,(x,W,H)=>{const cw=W/4;
  const room=(i,fl)=>{const x0=i*cw;const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1c140e');g.addColorStop(0.7,'#3a2a1c');g.addColorStop(1,'#4a3826');x.fillStyle=g;x.fillRect(x0,0,cw,H);
    x.fillStyle='rgba(0,0,0,0.35)';x.fillRect(x0,0,cw,H*0.12);fl(x0);const v=x.createRadialGradient(x0+cw/2,H/2,cw*0.1,x0+cw/2,H/2,cw*0.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,0.55)');x.fillStyle=v;x.fillRect(x0,0,cw,H);};
  room(0,x0=>{const g=x.createRadialGradient(x0+cw*0.5,H*0.8,4,x0+cw*0.5,H*0.8,70);g.addColorStop(0,'rgba(255,170,70,0.9)');g.addColorStop(1,'rgba(255,120,40,0)');x.fillStyle=g;x.fillRect(x0,0,cw,H);   // hogar
    x.fillStyle='#2a1c12';x.fillRect(x0+cw*0.35,H*0.82,cw*0.3,H*0.06);x.fillStyle='#ffb050';x.beginPath();x.moveTo(x0+cw*0.42,H*0.82);x.lineTo(x0+cw*0.5,H*0.66);x.lineTo(x0+cw*0.58,H*0.82);x.fill();
    x.fillStyle='#6a3a22';for(const k of[0.15,0.78]){x.beginPath();x.ellipse(x0+cw*k,H*0.78,12,20,0,0,6.3);x.fill();}});
  room(1,x0=>{x.strokeStyle='#5a4028';x.lineWidth=6;x.beginPath();x.moveTo(x0+cw*0.2,H*0.95);x.lineTo(x0+cw*0.25,H*0.12);x.moveTo(x0+cw*0.8,H*0.95);x.lineTo(x0+cw*0.75,H*0.12);x.moveTo(x0+cw*0.22,H*0.18);x.lineTo(x0+cw*0.78,H*0.18);x.stroke();   // telar
    x.strokeStyle='rgba(220,200,160,0.7)';x.lineWidth=1;for(let k=0;k<22;k++){const xx=x0+cw*(0.28+k*0.02);x.beginPath();x.moveTo(xx,H*0.2);x.lineTo(xx,H*0.7);x.stroke();}
    x.fillStyle='#a8603a';for(let k=0;k<8;k++){x.beginPath();x.arc(x0+cw*(0.3+k*0.055),H*0.73,5,0,6.3);x.fill();}x.fillStyle='rgba(160,60,40,0.8)';x.fillRect(x0+cw*0.28,H*0.2,cw*0.44,H*0.18);});
  room(2,x0=>{x.fillStyle='#5a3e26';for(const yy of[0.3,0.55])x.fillRect(x0+cw*0.05,H*yy,cw*0.9,6);   // tienda: estantes, ánforas, mostrador
    for(let k=0;k<6;k++){x.fillStyle=['#b06a3a','#9a5a30','#c27a46'][k%3];x.beginPath();x.ellipse(x0+cw*(0.12+k*0.15),H*0.24,9,16,0,0,6.3);x.fill();x.beginPath();x.ellipse(x0+cw*(0.12+k*0.15),H*0.49,9,16,0,0,6.3);x.fill();}
    x.fillStyle='#8a7a66';x.fillRect(x0+cw*0.05,H*0.72,cw*0.9,H*0.28);x.fillStyle='#2a1c12';for(const k of[0.3,0.65]){x.beginPath();x.ellipse(x0+cw*k,H*0.73,16,6,0,0,6.3);x.fill();}});
  room(3,x0=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#5a4a38');g.addColorStop(1,'#a89070');x.fillStyle=g;x.fillRect(x0+cw*0.25,0,cw*0.5,H);   // atrio con luz cenital e impluvio
    x.fillStyle='rgba(255,240,200,0.35)';x.beginPath();x.moveTo(x0+cw*0.35,0);x.lineTo(x0+cw*0.65,0);x.lineTo(x0+cw*0.75,H*0.8);x.lineTo(x0+cw*0.25,H*0.8);x.fill();
    x.fillStyle='#6a8aa0';x.fillRect(x0+cw*0.3,H*0.82,cw*0.4,H*0.06);x.fillStyle='#d8ccb4';for(const k of[0.12,0.88])x.fillRect(x0+cw*k-6,H*0.15,12,H*0.7);
    x.fillStyle='#8e3a2a';x.fillRect(x0,H*0.6,cw*0.2,H*0.4);x.fillRect(x0+cw*0.8,H*0.6,cw*0.2,H*0.4);});});}
// rótulos: textos reales de rótulos y anuncios de Pompeya (CIL IV), que también se pintaban en Roma
const ED_SIGNS=[['SALVE LVCRVM','«¡Bienvenida, ganancia!»'],['VINVM','vino'],['HOSPITIVM HIC LOCATVR','«aquí se alquila alojamiento» (CIL IV 807)'],['TONSOR','barbero'],
  ['PISTOR','panadero'],['LVCRVM GAVDIVM','«la ganancia es alegría»'],['LOCANTVR TABERNAE CVM PERGVLIS','«se alquilan tiendas con su entresuelo» (CIL IV 138)'],['FVLLONICA','lavandería']];
function edSignTex(){if(ED.tex.sign)return ED.tex.sign;return ED.tex.sign=edCanvas(1024,512,(x,W,H)=>{const cw=W/4,ch=H/2;
  ED_SIGNS.forEach(([t],i)=>{const x0=(i%4)*cw,y0=i<4?H-ch:0;   // las filas van de abajo arriba (UV)
    x.fillStyle='#e6dccb';x.fillRect(x0,y0,cw,ch);x.strokeStyle='#8e3a2a';x.lineWidth=5;x.strokeRect(x0+8,y0+8,cw-16,ch-16);
    const words=t.split(' ');let fs=46;x.font='bold '+fs+'px serif';const lines=[];let cur='';for(const w of words){const tst=cur?cur+' '+w:w;if(x.measureText(tst).width>cw-30&&cur){lines.push(cur);cur=w;}else cur=tst;}lines.push(cur);
    if(lines.length>2){fs=30;x.font='bold '+fs+'px serif';}x.fillStyle=i%2?'#1a120c':'#8e2a1e';x.textAlign='center';x.textBaseline='middle';
    lines.forEach((l,k)=>x.fillText(l,x0+cw/2,y0+ch/2+(k-(lines.length-1)/2)*fs*1.05));
    for(let k=0;k<160;k++){x.fillStyle='rgba(120,100,80,'+(Math.random()*0.25)+')';x.fillRect(x0+Math.random()*cw,y0+Math.random()*ch,2,2);}});});}
// los Lares del compitum: dos jóvenes bailando con el cuerno de beber (rhyton) y el cubo (situla), el genio en medio y las serpientes debajo
function edLaresTex(){if(ED.tex.lar)return ED.tex.lar;return ED.tex.lar=edCanvas(256,256,(x,W,H)=>{x.fillStyle='#e8d8b8';x.fillRect(0,0,W,H);x.fillStyle='#8e3a2a';x.fillRect(0,0,W,10);x.fillRect(0,H-10,W,10);
  const fig=(cx,col,mir)=>{x.fillStyle=col;x.beginPath();x.moveTo(cx-14,150);x.lineTo(cx+14,150);x.lineTo(cx+22*mir,105);x.lineTo(cx,70);x.lineTo(cx-10,105);x.fill();x.fillStyle='#c99a74';x.beginPath();x.arc(cx,60,10,0,6.3);x.fill();
    x.strokeStyle='#c99a74';x.lineWidth=4;x.beginPath();x.moveTo(cx,80);x.lineTo(cx+30*mir,58);x.stroke();x.fillStyle='#d9a93a';x.beginPath();x.moveTo(cx+30*mir,58);x.lineTo(cx+38*mir,40);x.lineTo(cx+26*mir,50);x.fill();
    x.strokeStyle='#c99a74';x.beginPath();x.moveTo(cx-8,150);x.lineTo(cx-14*mir,175);x.moveTo(cx+8,150);x.lineTo(cx+18*mir,168);x.stroke();};
  fig(60,'#5a8a4a',1);fig(196,'#5a8a4a',-1);x.fillStyle='#f2ecdf';x.fillRect(118,80,20,80);x.fillStyle='#c99a74';x.beginPath();x.arc(128,70,10,0,6.3);x.fill();
  x.strokeStyle='#3a5a2a';x.lineWidth=6;x.beginPath();x.moveTo(20,220);x.bezierCurveTo(70,190,90,240,128,215);x.bezierCurveTo(160,195,190,240,236,215);x.stroke();});}
function edMat(m,role){const k=m.uuid+'|'+role;if(ED.vc.has(k))return ED.vc.get(k);let n;
  if(role==='interior'){const t=edInteriorTex();n=new THREE.MeshLambertMaterial({map:t,emissive:0xffffff,emissiveMap:t,emissiveIntensity:0.25});}
  else if(role==='sign'){n=new THREE.MeshLambertMaterial({map:edSignTex(),polygonOffset:true,polygonOffsetFactor:-1});}
  else if(role==='lares'){n=new THREE.MeshLambertMaterial({map:edLaresTex()});}
  else{n=m.clone();n.vertexColors=true;if(m.onBeforeCompile!==THREE.Material.prototype.onBeforeCompile){n.onBeforeCompile=m.onBeforeCompile;n.customProgramCacheKey=()=>(m.customProgramCacheKey?m.customProgramCacheKey():'')+'vc';n.userData=Object.assign({},m.userData);}}
  ED.vc.set(k,n);return n;}
function edFix(n0){for(let i=n0;i<CHUNKS.length;i++){const im=CHUNKS[i].im,role=ED.geoRole.get(im.geometry.attributes.position);if(!role)continue;im.material=edMat(im.material,role);im.userData.ed=1;im.userData.noCol=true;im.userData.noSeal=1;}}   // la casa ya tiene su colisión (addBox): el sellado de paredes no tiene que estudiar cada pieza
function edHash(x,z){const s=Math.sin(x*12.9898+z*78.233)*43758.5453;return s-Math.floor(s);}
// Colocación dinámica (Roma coloca miles de casas en cientos de tandas: con trozos fijos por zona salían más de 13.000 mallas).
// · La versión sencilla se coloca como siempre (trozos fijos), pero cada casa a menos de ED.D2 se oculta en su trozo (escala 0).
// · La detallada (a menos de ED.D1) y la intermedia (de ED.D1 a ED.D2) se dibujan con UNA malla instanciada por pieza y papel,
//   que se rellena solo con las casas cercanas y se rehace cuando el jugador se mueve unos metros.
const EDD={items:[],refs:[],meshes:new Map(),px:1e9,pz:1e9,t:0,n1:0,n2:0};
const _edM=new THREE.Matrix4(),_edZ=new THREE.Matrix4().makeScale(0,0,0),_edQ=new THREE.Quaternion(),_edP=new THREE.Vector3(),_edS=new THREE.Vector3(),_edU=new THREE.Vector3(0,1,0);
{const f=placeModules;placeModules=function(prefix,items,opt){const V=ED.map[prefix];
  if(!ED.ok||!V||!items.length||!Object.keys(GLB.parts).some(n=>n.indexOf(V[0]+'_')===0))return f.apply(this,arguments);
  const n0=CHUNKS.length;f.apply(this,arguments);
  // índice de las casas sencillas recién colocadas, para poder ocultarlas una a una
  const byPos=new Map();for(let c=n0;c<CHUNKS.length;c++){const im=CHUNKS[c].im;for(let i=0;i<im.count;i++){im.getMatrixAt(i,_edM);_edP.setFromMatrixPosition(_edM);const r={im,i,m:_edM.clone(),hid:false},k=Math.round(_edP.x*4)+','+Math.round(_edP.z*4);EDD.refs.push(r);let L=byPos.get(k);if(!L){L=[];byPos.set(k,L);}L.push(r);}}
  const mid=ED.mid[prefix];
  for(const it of items){_edQ.setFromAxisAngle(_edU,it.a||0);_edP.set(it.x,it.y,it.z);_edS.set(it.sx||1,it.sy||it.sx||1,it.sz||it.sx||1);
    const k=V[Math.floor(edHash(it.x,it.z)*V.length)%V.length];EDD.items.push({x:it.x,z:it.z,refs:byPos.get(Math.round(it.x*4)+','+Math.round(it.z*4))||[],m:new THREE.Matrix4().compose(_edP,_edQ,_edS),it,det:Object.keys(GLB.parts).some(n=>n.indexOf(k+'_')===0)?k:V[0],mid,shadow:!(opt&&opt.shadow===false)});}
  EDD.px=1e9;};}
function edMeshesFor(part){let L=EDD.meshes.get(part);if(L)return L;L=[];
  for(const name in GLB.parts){if(name.indexOf(part+'_')!==0)continue;for(const m of GLB.parts[name].meshes){const key=TINT[m.role];let mat=key?whiteRole(m.role):roleMat(m.role);mat=edMat(mat,m.role);
    const im=new THREE.InstancedMesh(m.geo,mat,16);im.count=0;im.frustumCulled=false;im.castShadow=true;im.receiveShadow=true;im.userData.ed=1;im.userData.noCol=true;im.userData.noSeal=1;im.userData.noCull=1;im.userData.noInst=1;
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(im);L.push({im,role:m.role,key,cap:16});}}
  EDD.meshes.set(part,L);return L;}
function edGrow(e,n){if(n<=e.cap)return;let cap=e.cap;while(cap<n)cap*=2;const o=e.im,im=new THREE.InstancedMesh(o.geometry,o.material,cap);Object.assign(im.userData,o.userData);im.frustumCulled=false;im.castShadow=o.castShadow;im.receiveShadow=true;
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.remove(o);o.dispose&&o.dispose();scene.add(im);e.im=im;e.cap=cap;}
function edUpdate(){const px=player.x,pz=player.z;if(Math.hypot(px-EDD.px,pz-EDD.pz)<30)return;EDD.px=px;EDD.pz=pz;const D2=ED.D2*ED.D2;
  // las casas más cercanas: las ED.N1 primeras con todo el detalle, las ED.N2 siguientes con el intermedio, el resto sencillas
  const near=[];for(const e of EDD.items){const d=(e.x-px)**2+(e.z-pz)**2;e.lod=0;if(d<D2){e.d=d;near.push(e);}}near.sort((a,b)=>a.d-b.d);
  near.forEach((e,i)=>{e.lod=i<ED.N1?2:i<ED.N1+ED.N2&&e.mid?1:0;});
  const dirty=new Set();for(const e of EDD.items){const h=e.lod>0;for(const r of e.refs){if(r.hid!==h){r.hid=h;r.im.setMatrixAt(r.i,h?_edZ:r.m);dirty.add(r.im);}}}for(const im of dirty)im.instanceMatrix.needsUpdate=true;
  const by=new Map();for(const e of near){if(!e.lod)continue;const part=e.lod===2?e.det:e.mid;let L=by.get(part);if(!L){L=[];by.set(part,L);}L.push(e);}
  for(const[part,L]of EDD.meshes)if(!by.has(part))for(const e of L)e.im.count=0;
  EDD.n1=0;EDD.n2=0;const col=new THREE.Color();
  for(const[part,L]of by){const ms=edMeshesFor(part);if(/^H2_/.test(part))EDD.n1+=L.length;else EDD.n2+=L.length;
    for(const e of ms){edGrow(e,L.length);const im=e.im;L.forEach((it,i)=>{im.setMatrixAt(i,it.m);if(e.key){const c=it.it[e.key];col.set(c||ROLE_C[e.role]||'#ffffff');im.setColorAt(i,col);}});
      im.count=L.length;im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;}}}
{const f=gfTick;gfTick=function(dt){try{if(ED.ok&&EDD.items.length){EDD.t+=dt;if(EDD.t>0.3){EDD.t=0;edUpdate();}}}catch(e){if(!ED.err){ED.err=1;console.warn('ed',e);}}return f.apply(this,arguments);};}
