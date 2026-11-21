// ============================================================ ARBUSTOS DE DETALLE (matorral mediterráneo)
// Las matas de antes eran bolas deformadas con una textura de hojas encima. Ahora, de cerca, son arbustos con ramas y hojas de verdad,
// generados con EZ-Tree (https://github.com/dgreenheck/ez-tree, licencia MIT) en herramientas/plantas_eztree (→ modelos/arbustos.glb,
// datos/glbab.txt, que se trae en segundo plano). Cinco especies del matorral de Grecia e Italia, cada una en dos variantes; los nombres
// griegos son los de Teofrasto (Historia de las plantas):
//  lentisco (σχῖνος, lentiscus): mata densa y redonda, hojas pequeñas verde oscuro · mirto (μυρσίνη, myrtus): densa, más alta que ancha,
//  con flores blancas; consagrado a Afrodita/Venus · adelfa (ῥοδοδάφνη, nerium): junto a ríos y torrentes, hojas largas y flores rosas
//  · coscoja (πρῖνος): baja y enmarañada, hojas dentadas verde gris; de ella se sacaba el tinte rojo del quermes (coccum)
//  · retama (σπάρτον, spartum/genista): varillas verdes casi sin hojas y flores amarillas; sus tallos servían para atar y trenzar.
// Hay dos fuentes de matas: el matorral bajo alrededor del jugador (GD, 115) y las matas al pie de los árboles (T_bush, 155). Las que
// quedan cerca (AB.R) se esconden en su malla sencilla y se dibujan con el arbusto de detalle; al alejarse vuelven a la sencilla.
// La especie depende del sitio (siempre la misma para cada mata): junto al agua, adelfas; en el Ática seca, más coscoja y retama; en
// Italia y en los destinos húmedos, más lentisco y mirto. El atlas de hojas se pinta aquí (copia de herramientas/plantas_eztree/hojas.js).
const AB_CELL={lentisco:[0,0.5],mirto:[0.25,0.5],adelfa:[0.5,0.5],coscoja:[0.75,0.5],retama:[0,0]};
function abAtlas(){const doc=document;const c=doc.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d');let s=7;const R=()=>(s=(s*16807)%2147483647)/2147483647;
  const stem=(cx,cy,len,w,col)=>{x.strokeStyle=col;x.lineWidth=w;x.lineCap='round';x.beginPath();x.moveTo(cx,cy);x.quadraticCurveTo(cx+6,cy-len*0.5,cx,cy-len);x.stroke();};
  const leaf=(cx,cy,ang,w,h,col,edge)=>{x.save();x.translate(cx,cy);x.rotate(ang);x.fillStyle=col;x.beginPath();
    if(edge){for(let i=0;i<=16;i++){const t=i/16*Math.PI*2,r=1+(i%2?0.18:0);x.lineTo(Math.sin(t)*w*r,-h/2-Math.cos(t)*h/2*r);} }else x.ellipse(0,-h/2,w,h/2,0,0,Math.PI*2);
    x.fill();x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=1.2;x.beginPath();x.moveTo(0,0);x.lineTo(0,-h*0.9);x.stroke();x.restore();};
  const cell=(i,row,f)=>{x.save();x.translate(i*256+128,row*256+250);f();x.restore();};
  // 0 lentisco
  cell(0,0,()=>{for(let b=0;b<3;b++){const a=(b-1)*0.45;x.save();x.rotate(a);stem(0,0,210,4,'#6a4e36');for(let k=0;k<8;k++){const y=-40-k*21;
      for(const sd of[-1,1])leaf(0,y,sd*1.15,11,30,['#3e5c30','#4a6a38','#36522a'][Math.floor(R()*3)]);}leaf(0,-212,0,11,30,'#45633a');x.restore();}});
  // 1 mirto
  cell(1,0,()=>{for(let b=0;b<3;b++){x.save();x.rotate((b-1)*0.5);stem(0,0,215,3,'#5e4630');for(let k=0;k<10;k++){const y=-30-k*18;
      for(const sd of[-1,1])leaf(0,y,sd*(0.7+R()*0.3),7,26,['#3c5e2c','#466a32','#35552a'][Math.floor(R()*3)]);}
      if(b!==1){x.fillStyle='#f4f0e6';for(let p=0;p<5;p++){x.beginPath();x.arc(Math.cos(p*1.26)*7,-200+Math.sin(p*1.26)*7,5,0,7);x.fill();}x.fillStyle='#e8d070';x.beginPath();x.arc(0,-200,3,0,7);x.fill();}x.restore();}});
  // 2 adelfa
  cell(2,0,()=>{for(let b=0;b<2;b++){x.save();x.rotate((b-0.5)*0.5);stem(0,0,200,4,'#7a6a48');for(let k=0;k<4;k++){const y=-60-k*38;
      for(let w=0;w<3;w++)leaf(0,y,(w-1)*0.9,7,70,['#4f6a3c','#5a7444','#466236'][w]);}
      for(let p=0;p<5;p++){x.fillStyle=['#e6869c','#d9708a','#f0a0b2'][p%3];x.beginPath();x.arc((p-2)*11,-205+Math.abs(p-2)*5,10,0,7);x.fill();}x.restore();}});
  // 3 coscoja
  cell(3,0,()=>{for(let b=0;b<3;b++){x.save();x.rotate((b-1)*0.55);stem(0,0,200,4,'#5c4a38');for(let k=0;k<7;k++){const y=-35-k*24;
      for(const sd of[-1,1])leaf(sd*4,y,sd*(0.9+R()*0.4),12,26,['#5b6a46','#66744e','#4f5e3e'][Math.floor(R()*3)],true);}x.restore();}});
  // retama (fila de abajo, celda 0): varillas verdes casi sin hojas, con flores amarillas en racimo
  cell(0,1,()=>{for(let b=0;b<9;b++){x.save();x.rotate((b-4)*0.11);stem(0,0,230,8,['#5f7a3a','#6a8440','#56703a'][b%3]);
      for(let k=0;k<6;k++){if(k%2&&b%2)continue;x.fillStyle=['#e8c22a','#f0d040','#d9b020'][k%3];x.beginPath();x.ellipse(5,-150-k*14,4,6,0.4,0,7);x.fill();}x.restore();}});
  // corteza (fila de abajo, celda 1): pardo grisáceo con vetas
  x.fillStyle='#6a5a46';x.fillRect(256,256,256,256);for(let i=0;i<60;i++){x.strokeStyle=R()<0.5?'#584a3a':'#7c6c56';x.lineWidth=2+R()*3;const u=256+R()*256;x.beginPath();x.moveTo(u,256);x.lineTo(u+R()*10-5,512);x.stroke();}
  return c;}
const AB={tpl:null,loading:0,mat:null,sp:['lentisco','mirto','adelfa','coscoja','retama'],ims:{},gd:[],tb:[],t:0,dirty:false,
  R:(typeof isTouch!=='undefined'&&isTouch)?16:26,RT:(typeof isTouch!=='undefined'&&isTouch)?30:55,MX:(typeof isTouch!=='undefined'&&isTouch)?60:180,zero:new THREE.Matrix4().makeScale(0,0,0)};
try{if(ACC.lite){AB.R=11;AB.RT=22;AB.MX=40;}}catch(e){}
function abLoad(){if(AB.loading||typeof bpBytes!=='function'||!THREE.GLTFLoader)return;AB.loading=1;
  bpBytes('glbab').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const T={};gl.scene.traverse(o=>{if(o.isMesh&&/^AB_/.test(o.name)){const g=o.geometry,n=g.attributes.normal;   // normales comprimidas (8 bits): a decimales, porque vegPrep las reescribe
      if(n&&!(n.array instanceof Float32Array)){const f=new Float32Array(n.count*3),a=n.array,st=n.data?n.data.stride:3,of=n.offset||0;   // three r128: getX no deshace la normalización
        for(let i=0;i<n.count;i++){let x=a[i*st+of],y=a[i*st+of+1],z=a[i*st+of+2];const l=Math.hypot(x,y,z)||1;f[i*3]=x/l;f[i*3+1]=y/l;f[i*3+2]=z/l;}g.setAttribute('normal',new THREE.BufferAttribute(f,3));}
      try{vegPrep(g);}catch(e){}g.computeBoundingSphere();T[o.name]=g;}});
    if(!Object.keys(T).length)return;const tx=new THREE.CanvasTexture(abAtlas());tx.anisotropy=4;
    AB.mat=new THREE.MeshLambertMaterial({map:tx,alphaTest:0.5,side:THREE.DoubleSide});try{n2Sway(AB.mat,0.05,'ab');}catch(e){}
    for(const k in T){const im=new THREE.InstancedMesh(T[k],AB.mat,AB.MX);im.count=0;im.frustumCulled=false;im.castShadow=!(typeof isTouch!=='undefined'&&isTouch);im.receiveShadow=true;
      im.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(AB.MX*3),3);im.userData.veg=true;scene.add(im);AB.ims[k]=im;}
    AB.tpl=T;GD.cx=1e9;AB.dirty=true;},e=>console.warn('arbustos',e));}).catch(e=>console.warn('arbustos',e));}
// la especie de cada mata, según el sitio (dry: Ática y destinos áridos)
function abPick(x,z,dry){const h=hash(x*0.731,z*0.417),v=hash(z*1.31,x*0.29)<0.5?0:1;let wet=false;
  for(const [dx,dz] of[[9,0],[-9,0],[0,9],[0,-9]]){try{if(riverWater(x+dx,z+dz)!==null){wet=true;break;}}catch(e){}}
  if(wet&&h<0.6)return 'AB_adelfa_'+v;
  const W=dry?[['coscoja',0.36],['lentisco',0.3],['retama',0.2],['mirto',0.1],['adelfa',0.04]]:[['lentisco',0.32],['mirto',0.3],['coscoja',0.14],['retama',0.14],['adelfa',0.1]];
  let a=0;for(const [k,w] of W){a+=w;if(h<a)return 'AB_'+k+'_'+v;}return 'AB_lentisco_'+v;}
const _abM=new THREE.Matrix4(),_abP=new THREE.Vector3(),_abQ=new THREE.Quaternion(),_abS=new THREE.Vector3(),_abC=new THREE.Color();
// color de cada arbusto: casi blanco (la textura ya da el color), con algo de variación y un punto más pálido donde es seco
function abTint(src,x,z){const b=0.82+hash(x*3.1,z*2.7)*0.3;_abC.setRGB(b,b,b);if(src){const dry=src.r>src.g*0.92;if(dry)_abC.multiply(new THREE.Color(1.06,1.0,0.82));}return _abC.clone();}
function abRebuild(){if(!AB.tpl)return;const n={};for(const k in AB.ims)n[k]=0;
  for(const L of[AB.gd,AB.tb])for(const o of L){const im=AB.ims[o.k];if(!im||n[o.k]>=AB.MX)continue;im.setMatrixAt(n[o.k],o.m);im.setColorAt(n[o.k],o.c);n[o.k]++;}
  for(const k in AB.ims){const im=AB.ims[k];im.count=n[k];im.instanceMatrix.needsUpdate=true;im.instanceColor.needsUpdate=true;}AB.dirty=false;}
// (1) el matorral bajo alrededor del jugador (GD.tf): tras cada recolocación, las matas más cercanas pasan al arbusto de detalle
function abFromGD(){AB.gd.length=0;if(!AB.tpl||!GD.tf)return;const im=GD.tf,P=player,R2=AB.R*AB.R,dry=!(MODE==='roma'||(P.x>8000&&(()=>{try{const I=islandOf(P.x);return I&&I.green;}catch(e){return false;}})()));
  for(let i=0;i<im.count;i++){im.getMatrixAt(i,_abM);_abM.decompose(_abP,_abQ,_abS);const dx=_abP.x-P.x,dz=_abP.z-P.z;if(dx*dx+dz*dz>R2||_abS.x<0.05)continue;
    let src=null;try{im.getColorAt(i,_abC);src=_abC.clone();}catch(e){}
    const k=abPick(_abP.x,_abP.z,dry);_abS.set(_abS.x*1.05,_abS.y*1.25,_abS.z*1.05);_abP.y+=0.06*_abS.y;   // la mata sencilla está algo hundida; el arbusto, apoyado
    AB.gd.push({k,m:new THREE.Matrix4().compose(_abP,_abQ,_abS),c:abTint(src,_abP.x,_abP.z)});im.setMatrixAt(i,AB.zero);}
  im.instanceMatrix.needsUpdate=true;AB.dirty=true;}
{const f=gdTick;gdTick=function(){const cx=GD.cx;const r=f.apply(this,arguments);try{if(!AB.tpl){if(GD.tf&&GD.tf.count)abLoad();}else if(GD.cx!==cx)abFromGD();}catch(e){if(!AB.err){AB.err=1;console.warn('arbustos',e);}}return r;};}
// (2) las matas al pie de los árboles (T_bush, colocadas en trozos con chunked): las cercanas se cambian como las copas de detalle (182)
function abTBIms(){if(AB.tbIms)return AB.tbIms;const P=GLB.parts&&GLB.parts.T_bush;if(!P)return null;const pos=new Set(P.meshes.map(m=>m.geo.attributes.position));
  AB.tbIms=CHUNKS.filter(c=>c.im&&pos.has(c.im.geometry.attributes.position)).map(c=>c.im);return AB.tbIms;}
function abTBTick(){const L=abTBIms();if(!L||!L.length)return;const cx=player.x,cz=player.z,R2=AB.RT*AB.RT,want=new Set(),out=[],first=GLB.parts.T_bush.meshes[0].geo.attributes.position;
  for(const im of L){if(!im.parent)continue;const sp=im.geometry.boundingSphere;if(sp&&Math.hypot(sp.center.x-cx,sp.center.z-cz)>sp.radius+AB.RT)continue;
    let o=im.userData.abOrig;if(!o)o=im.userData.abOrig=new Map();const A=im.instanceMatrix.array;
    for(let i=0;i<im.count;i++){const e=o.has(i)?o.get(i).elements:null,x=e?e[12]:A[i*16+12],z=e?e[14]:A[i*16+14],dx=x-cx,dz=z-cz;if(dx*dx+dz*dz>R2)continue;
      if(!e&&A[i*16]===0&&A[i*16+5]===0&&A[i*16+10]===0)continue;   // escondida por otro sistema (copas de detalle, edificios…)
      want.add(im.uuid+':'+i);if(!o.has(i)){im.getMatrixAt(i,_abM);o.set(i,_abM.clone());im.setMatrixAt(i,AB.zero);im.instanceMatrix.needsUpdate=true;}
      if(im.geometry.attributes.position===first&&out.length<AB.MX*3){const m=o.get(i);m.decompose(_abP,_abQ,_abS);let src=null;if(im.instanceColor){im.getColorAt(i,_abC);src=_abC.clone();}
        _abS.multiplyScalar(1.15);out.push({k:abPick(_abP.x,_abP.z,MODE!=='roma'),m:new THREE.Matrix4().compose(_abP,_abQ,_abS),c:abTint(src,_abP.x,_abP.z)});}}}
  // las que se alejan vuelven a la mata sencilla
  for(const im of L){const o=im.userData.abOrig;if(!o)continue;for(const [i,m] of o){if(want.has(im.uuid+':'+i))continue;im.setMatrixAt(i,m);o.delete(i);im.instanceMatrix.needsUpdate=true;}}
  AB.tb=out;AB.dirty=true;}
function abTick(dt){if(!AB.tpl){AB.t-=dt;if(AB.t<=0){AB.t=2;const L=abTBIms();if(L&&L.length)abLoad();}return;}AB.t-=dt;if(AB.t<=0){AB.t=0.6;try{abTBTick();}catch(e){AB.errMsg=String(e&&e.stack||e);if(!AB.err2){AB.err2=1;console.warn('arbustos T_bush',e);}}}if(AB.dirty)abRebuild();}
{const f=uxTick;uxTick=function(dt){f(dt);try{abTick(dt);}catch(e){}};}
