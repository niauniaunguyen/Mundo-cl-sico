// ============================================================ modelos de Blender
// Piezas modeladas en Blender (personas, columnas, tejas, animales, atributos de los dioses), incrustadas en #glb.
// Cada pieza conserva el nombre del objeto de Blender (P_ persona, C_ columna, R_ tejado, A_ animal, G_ dios)
// y el nombre de su material indica su papel (cloth, drape, skin…), que aquí se sustituye por el color de cada personaje.
const GLB={ok:false,parts:{}};
const ROLE_C={cloth:'#e8e0cf',drape:'#6d7b9a',skin:'#c99a74',hair:'#3b2a1e',eye:'#1a120c',sandal:'#5a3d26',clay:'#a8532f',glaze:'#1d1612',wood:'#7a5434',bronze:'#8a6a3a',
  wicker:'#a8864f',mask:'#efe5d4',crest:'#a8392b',gold:'#d9a93a',leaf:'#5f7d3c',string:'#efe6d0',leather:'#7a4a2a',felt:'#8a7350',fennel:'#8a9a5a',pine:'#6b4a22',
  gorgon:'#a8392b',iron:'#55575c',marble:'#efe7d8',tile:'#b4583b',coat:'#6b4a2e',mane:'#2e2018',hoof:'#2a2018',wool:'#ece6d6',sheepface:'#3a3028'};
const FLAME_M=new THREE.MeshBasicMaterial({color:'#ffb050'});
function loadModels(done){
  const el=document.getElementById('glb'),txt=el?el.textContent.trim():'';
  if(!THREE.GLTFLoader||txt.length<100){done();return;}
  try{const b=atob(txt),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
    new THREE.GLTFLoader().parse(u.buffer,'',gl=>{
      gl.scene.updateMatrixWorld(true);
      for(const o of gl.scene.children){const inv=new THREE.Matrix4().copy(o.matrixWorld).invert(),list=[];
        o.traverse(m=>{if(m.isMesh){m.geometry.computeBoundingSphere();list.push({geo:m.geometry,role:m.material.name,mat:new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld)});}});
        GLB.parts[o.name]={pos:o.position.clone(),meshes:list};}
      GLB.ok=!!GLB.parts.P_head;if(GLB.ok)betterTrees();
      // segundo archivo: los animales (modelos/animales.blend)
      const e2=document.getElementById('glb2'),t2=e2?e2.textContent.trim():'';if(t2.length<100){done();return;}
      try{const b2=atob(t2),u2=new Uint8Array(b2.length);for(let i=0;i<b2.length;i++)u2[i]=b2.charCodeAt(i);
        new THREE.GLTFLoader().parse(u2.buffer,'',g2=>{g2.scene.updateMatrixWorld(true);
          for(const o of g2.scene.children){const inv=new THREE.Matrix4().copy(o.matrixWorld).invert(),list=[];o.traverse(m=>{if(m.isMesh){m.geometry.computeBoundingSphere();list.push({geo:m.geometry,role:m.material.name,mat:new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld)});}});GLB.parts[o.name]={pos:o.position.clone(),meshes:list};}
          done();},err=>{console.warn('Animales GLB:',err);done();});}catch(e){console.warn('Animales GLB:',e);done();}
      },err=>{console.warn('Modelos GLB:',err);done();});
  }catch(e){console.warn('Modelos GLB:',e);done();}
}
// copia de una pieza; roles: {papel: material}. El grupo queda en el pivote de la pieza (hombro, cadera…)
function glbPart(name,roles){
  const P=GLB.parts[name];if(!P)return null;if(name[0]==='P'&&name[1]==='_')bakePersonAO(P);const g=new THREE.Group();g.position.copy(P.pos);
  for(const m of P.meshes){const mat=(roles&&roles[m.role])||(m.role==='flame'?FLAME_M:lam(ROLE_C[m.role]||'#999999'));
    const me=new THREE.Mesh(m.geo,mat);me.applyMatrix4(m.mat);me.castShadow=true;g.add(me);}
  return g;
}
function glbGeo(name){const P=GLB.ok&&GLB.parts[name];return P?P.meshes[0].geo:null;}
// piel de los dioses: brillo dorado (y un halo, en buildGods)
const glowCache={};
function glowSkin(hex,glow){const k=hex+glow;if(!glowCache[k])glowCache[k]=new THREE.MeshLambertMaterial({color:hex,emissive:glow,emissiveIntensity:1.0});return glowCache[k];}
Object.assign(ROLE_C,{socle:'#a89a82',wood:'#4a3324',dark:'#1a140f',brick:'#a8624a',plaster:'#e3d8c2',bark:'#6b5236',foliage:'#7f8b5d',stone:'#a89c8a',vine:'#5f7d3a',
  travertine:'#d8ccb0',granite:'#9a6a5e',chariotpaint:'#8a2a1e',shieldpaint:'#9a2a1e',wall:'#e8dfcc',roof:'#b0563a'});

// ------------------------------------------------------------ instancias por zonas
// Cada zona de 240 m es un InstancedMesh con su propia esfera envolvente: three.js descarta las que quedan fuera de la vista
// y frame() oculta las que están muy lejos. Sirve para casas, árboles, viñas y muros, que se cuentan por miles.
// (three r128 crea los InstancedMesh con frustumCulled=false: chunked() lo vuelve a activar en cada zona)
const CHUNKS=[];
const CHUNK_FAR_K=matchMedia('(pointer:coarse)').matches?0.7:1;   // en móvil, menos distancia de dibujo
function chunked(geo,mat,items,opt){
  opt=opt||{};const S=Math.max(opt.cell||240,420),cells=new Map(),v=new THREE.Vector3(),sc=new THREE.Vector3();   // celdas grandes: menos grupos, menos llamadas de dibujo
  if(!geo.boundingSphere)geo.computeBoundingSphere();const gr=geo.boundingSphere.radius+geo.boundingSphere.center.length();
  for(const it of items){v.setFromMatrixPosition(it.m);const k=Math.floor(v.x/S)+','+Math.floor(v.z/S);let a=cells.get(k);if(!a){a=[];cells.set(k,a);}a.push(it);}
  for(const list of cells.values()){
    let cx=0,cy=0,cz=0;for(const it of list){v.setFromMatrixPosition(it.m);cx+=v.x;cy+=v.y;cz+=v.z;}cx/=list.length;cy/=list.length;cz/=list.length;
    let r=0;for(const it of list){v.setFromMatrixPosition(it.m);sc.setFromMatrixScale(it.m);r=Math.max(r,Math.hypot(v.x-cx,v.y-cy,v.z-cz)+gr*Math.max(sc.x,sc.y,sc.z));}
    const g=new THREE.BufferGeometry();for(const k in geo.attributes)g.setAttribute(k,geo.attributes[k]);if(geo.index)g.setIndex(geo.index);
    g.boundingSphere=new THREE.Sphere(new THREE.Vector3(cx,cy,cz),r);
    const im=new THREE.InstancedMesh(g,mat,list.length);list.forEach((it,i)=>{im.setMatrixAt(i,it.m);if(it.c)im.setColorAt(i,it.c);});
    im.castShadow=opt.shadow!==false;im.receiveShadow=!!opt.receive;im.userData.chunk=true;if(opt.veg)im.userData.veg=true;if(opt.low)im.userData.low=true;im.frustumCulled=true;im.matrixAutoUpdate=false;im.updateMatrix();scene.add(im);CHUNKS.push({im,x:cx,z:cz,far:(opt.far||1700)*CHUNK_FAR_K,near:opt.near||0});}
}
const WHITE_M=new THREE.MeshLambertMaterial({color:0xffffff});
const TINT={wall:'cw',brick:'cw',plaster:'cp',roof:'cr',foliage:'cf'};
// Coloca una pieza de Blender (todas sus partes P_x, H_x_wall, H_x_roof…) en muchos sitios. items: {x,y,z,a,sx,sy,sz,cw,cr,cp,cf}
function placeModules(prefix,items,opt){
  if(!items.length||!GLB.ok)return;
  const q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),p=new THREE.Vector3(),s=new THREE.Vector3();
  const mats=items.map(it=>{q.setFromAxisAngle(up,it.a||0);p.set(it.x,it.y,it.z);s.set(it.sx||1,it.sy||it.sx||1,it.sz||it.sx||1);return new THREE.Matrix4().compose(p,q,s);});
  opt=Object.assign({},opt||{});if(/^(T_(?!rock)|V_)/.test(prefix))opt.veg=true;if(prefix==='W_drywall')opt.low=true;   // árboles, arbustos y viñas no se sellan; los muretes de piedra seca se saltan
  for(const name in GLB.parts){if(name!==prefix&&name.indexOf(prefix+'_')!==0)continue;
    for(const m of GLB.parts[name].meshes){const key=TINT[m.role],def=new THREE.Color(ROLE_C[m.role]||'#999999');
      let mat=key?whiteRole(m.role):roleMat(m.role);   // con textura triplanar según el papel (acabado)
      if(m.role==='foliage'&&prefix.indexOf('T_')===0)mat=windMat(mat);   // las copas se mecen con el viento
      chunked(m.geo,mat,items.map((it,i)=>({m:mats[i],c:key?(it[key]||def):null})),opt);}}
}
// casas griegas de Blender: tres modelos según el tamaño, con colores de muro y tejado variados
function housesGLB(list){
  const walls=['#eee5d4','#e6dbc4','#d8c7a5','#efe8da','#cdb994','#c9b089'],roofs=['#b0563a','#a24d33','#bf6a45','#9a4a35','#b8643f'];
  const G={H_gra:[],H_grb:[],H_grc:[]};
  for(const hs of list){const v=hs.two?'H_grb':(hs.w<11.5&&hs.d<11.5?'H_grc':'H_gra'),B=v==='H_grc'?[9,9]:[12,11];
    G[v].push({x:hs.x,y:hs.gy,z:hs.z,a:hs.a,sx:hs.w/B[0],sy:hs.h/3.6,sz:hs.d/B[1],cw:new THREE.Color(pick(walls)),cr:new THREE.Color(pick(roofs))});
    addBox(hs.x,hs.z,hs.w,hs.d,hs.a);footprints.push({x:hs.x,z:hs.z,w:hs.w,d:hs.d,a:hs.a,c:'#b8a280',house:true});
    if(R()<0.07)TORCH_SPOTS.push(toW(hs.w*0.15+2,hs.d/2+0.9,hs.x,hs.z,hs.a));
    if(R()<0.05){const hp=toW(hs.w*0.15-0.4,hs.d/2+0.6,hs.x,hs.z,hs.a);herm(hp[0],hp[1],hs.a);}}
  for(const k in G)placeModules(k,G[k],{far:1500});
}
// árboles de Blender: list = [{x,z,kind,k}] con kind olive|cypress|pine|plane
function treesGLB(list){
  const by={olive:[],cypress:[],pine:[],plane:[]};
  for(const t of list){if(riverWater(t.x,t.z)!==null)continue;const h=t.y!==undefined?t.y:floorAt(t.x,t.z),k=t.k||rr(0.8,1.25);
    const it={x:t.x,y:h,z:t.z,a:R()*TAU,sx:k*rr(0.92,1.08),sy:k,sz:k*rr(0.92,1.08),cf:new THREE.Color(t.kind==='cypress'?'#3f5532':t.kind==='pine'?'#5d7340':t.kind==='plane'?'#6f8a45':'#7f8b5d').offsetHSL(rr(-0.02,0.02),rr(-0.05,0.05),rr(-0.06,0.05))};
    by[t.kind].push(it);if(t.collide)addCirc(t.x,t.z,0.45*k);}
  placeModules('T_olive',by.olive,{far:1600});placeModules('T_cypress',by.cypress,{far:1600});placeModules('T_pine',by.pine,{far:1900});placeModules('T_plane',by.plane,{far:1600});
}
// campo: viñas en hileras, olivares, muros de piedra seca, granjas, arbustos y rocas. Devuelve los árboles de los olivares.
function buildCountryside(x0,x1,z0,z1,o){
  o=o||{};const vines=[],walls=[],farms=[],bushes=[],rocks=[],trees=[],seen=new Set(),ca=Math.cos(FCELL.a),sa=Math.sin(FCELL.a);
  const W=(u,v)=>[u*ca-v*sa,u*sa+v*ca];   // de coordenadas de parcela a mundo
  for(let x=x0;x<x1;x+=30)for(let z=z0;z<z1;z+=30){const f=fieldCell(x,z),key=f.i+','+f.j;if(seen.has(key))continue;seen.add(key);
    const u0=f.i*FCELL.u,v0=f.j*FCELL.v,[cx,cz]=W(u0+FCELL.u/2,v0+FCELL.v/2);if(!fieldOk(cx,cz))continue;const t=fieldType(f.i,f.j),h2=hash(f.i*3.1,f.j*1.7);
    if(t===4){for(let r=4;r<FCELL.v-3;r+=3.2)for(let u=4;u<FCELL.u-4;u+=4.2){const[x2,z2]=W(u0+u,v0+r);if(!fieldOk(x2,z2))continue;vines.push({x:x2,y:terrainH(x2,z2),z:z2,a:-FCELL.a,sx:2.1,sy:1,sz:1});}}
    if(t===5){for(let r=6;r<FCELL.v-4;r+=9)for(let u=6;u<FCELL.u-4;u+=9){const[x2,z2]=W(u0+u+rr(-1,1),v0+r+rr(-1,1));if(fieldOk(x2,z2))trees.push({x:x2,z:z2,kind:o.grove||'olive',k:rr(0.85,1.15)});}}
    if(h2<0.4&&t){for(const[a,b,c2,d]of[[0,0,1,0],[0,1,1,1],[0,0,0,1],[1,0,1,1]]){if(hash(f.i+a*7,f.j+b*5+c2*3)<0.35)continue;
        const L=(c2-a)*FCELL.u+(d-b)*FCELL.v,n=Math.round(L/3);for(let k=0;k<n;k++){const tt=(k+0.5)/n,[x2,z2]=W(u0+(a+(c2-a)*tt)*FCELL.u,v0+(b+(d-b)*tt)*FCELL.v);if(!fieldOk(x2,z2))continue;
          walls.push({x:x2,y:terrainH(x2,z2)-0.05,z:z2,a:-FCELL.a+(d!==b?Math.PI/2:0),sx:3.05,sy:rr(0.85,1.15),sz:1});}}}
    if(h2>0.86&&t){const[fx,fz]=W(u0+8,v0+8);if(fieldOk(fx,fz)){const gy=minGround(fx,fz,18,14,-FCELL.a);farms.push({x:fx,y:gy,z:fz,a:-FCELL.a+Math.PI,sx:1,sy:1,sz:1,cw:new THREE.Color(pick(['#e6dbc4','#d8c7a5','#cdb994'])),cr:new THREE.Color(pick(['#a24d33','#b0563a','#9a4a35']))});addBox(fx,fz,18,14,-FCELL.a);footprints.push({x:fx,z:fz,w:18,d:14,a:-FCELL.a,c:'#b8a280',house:true});}}
    if(!t){for(let k=0;k<4;k++){const[x2,z2]=W(u0+rr(3,FCELL.u-3),v0+rr(3,FCELL.v-3));if(roadDist(x2,z2)<5)continue;(R()<0.6?bushes:rocks).push({x:x2,y:terrainH(x2,z2)-0.1,z:z2,a:R()*TAU,sx:rr(0.7,1.6)});}}}
  placeModules('V_vine',vines,{far:800,shadow:false});placeModules('W_drywall',walls,{far:900,shadow:false});placeModules('H_farm',farms,{far:1700});
  placeModules('T_bush',bushes,{far:900,shadow:false});placeModules('T_rock',rocks,{far:900,shadow:false});
  return trees;
}

function gableGeo(){
  const A=[-.5,0,-.5],B=[-.5,0,.5],C=[0,1,.5],D=[0,1,-.5],E=[.5,0,-.5],F=[.5,0,.5];
  // con cara inferior (A,E,F y A,F,B, mirando abajo): visto desde la calle el tejado ya no desaparece ni deja ver el cielo
  const v=[].concat(A,B,C,A,C,D,E,D,C,E,C,F,B,F,C,A,D,E,A,E,F,A,F,B);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));
  g.computeVertexNormals();g.addGroup(0,12,0);g.addGroup(12,12,1);return g;
}
const GABLE=gableGeo();

// friso con triglifos y metopas pintadas
function friezeTex(){
  const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');
  x.fillStyle='#e9dfcc';x.fillRect(0,0,256,64);
  for(let i=0;i<4;i++){const ox=i*64;
    x.fillStyle='#2b4479';x.fillRect(ox,0,24,64);x.fillStyle='#1d2f57';x.fillRect(ox+6,4,3,60);x.fillRect(ox+15,4,3,60);
    x.fillStyle='#b9472f';x.fillRect(ox+24,0,40,5);
    x.fillStyle='#a8392b';x.beginPath();x.ellipse(ox+44,40,8,16,0.3*(i%2?1:-1),0,TAU);x.fill();x.beginPath();x.arc(ox+44,18,5,0,TAU);x.fill();
  }
  const t=new THREE.CanvasTexture(c);t.wrapS=THREE.RepeatWrapping;return t;
}
const FRIEZE=friezeTex();
function friezeMat(len){const t=FRIEZE.clone();t.needsUpdate=true;t.repeat.set(Math.max(1,Math.round(len/7)),1);return new THREE.MeshLambertMaterial({map:t});}

// pintura de la Stoa Poikile (Maratón)
function battleTex(seed){
  const c=document.createElement('canvas');c.width=512;c.height=160;const x=c.getContext('2d');const r=mulberry32(seed);
  const g=x.createLinearGradient(0,0,0,160);g.addColorStop(0,'#c9b48a');g.addColorStop(1,'#9c7f55');x.fillStyle=g;x.fillRect(0,0,512,160);
  x.fillStyle='#3d6a8a';x.fillRect(0,110,512,50);
  for(let i=0;i<26;i++){const px=r()*500+6,py=60+r()*60,s=0.8+r()*0.5;x.fillStyle=r()<0.5?'#7a2c1d':'#2a1d14';
    x.beginPath();x.arc(px,py-22*s,5*s,0,TAU);x.fill();x.fillRect(px-4*s,py-17*s,8*s,22*s);
    x.fillStyle='#c8902f';x.beginPath();x.arc(px+(r()<0.5?-7:7)*s,py-8*s,7*s,0,TAU);x.fill();
    x.strokeStyle='#2a1d14';x.lineWidth=1.5;x.beginPath();x.moveTo(px-10*s,py-35*s);x.lineTo(px+12*s,py+5*s);x.stroke();}
  for(let i=0;i<5;i++){x.fillStyle='#4a3020';const px=r()*480;x.beginPath();x.moveTo(px,112);x.lineTo(px+40,112);x.lineTo(px+32,124);x.lineTo(px+6,124);x.fill();}
  const t=new THREE.CanvasTexture(c);return t;
}

// ============================================================ caminos
const footprints=[]; // para el plano
const ROADS=[];
function roadDist(x,z){let best=1e9;for(const r of ROADS){const p=r.pts;for(let i=0;i<p.length-1;i++){const ax=p[i][0],az=p[i][1],bx=p[i+1][0],bz=p[i+1][1];const dx=bx-ax,dz=bz-az,L=dx*dx+dz*dz;let t=((x-ax)*dx+(z-az)*dz)/L;t=clamp(t,0,1);const ex=x-ax-dx*t,ez=z-az-dz*t;const d=Math.sqrt(ex*ex+ez*ez)-r.w;if(d<best)best=d;}}return best;}

