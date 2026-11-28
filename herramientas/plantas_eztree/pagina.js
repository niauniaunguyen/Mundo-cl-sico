// Se empaqueta con esbuild y se abre en Chromium (generar.mjs). Genera los arbustos con EZ-Tree (MIT, Daniel Greenheck), les pone las
// coordenadas del atlas de hojas (hojas.js), los deja en la caja [-0,5,0,5]×[0,1]×[-0,5,0,5] y los exporta a GLB.
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Tree } from 'ez-tree';
import { hojasAtlas, CELDA } from './hojas.js';
// Las especies del matorral mediterráneo (la «maquia» y la «garriga»); nombres griegos según Teofrasto, Historia de las plantas:
//  lentisco (σχῖνος): mata densa y redonda, de 1 a 3 m · mirto (μυρσίνη): mata densa, algo más alta que ancha
//  adelfa (ῥοδοδάφνη): junto a ríos y torrentes, tallos largos y rectos · coscoja (πρῖνος): baja, enmarañada, muy ramificada
//  retama (σπάρτον): varillas verdes casi sin hojas que salen del suelo
const SP={
 lentisco:{levels:3,angle:{1:55,2:55,3:50},children:{0:6,1:3,2:2},length:{0:1,1:13,2:6,3:3},radius:{0:0.6,1:0.6,2:0.5,3:0.5},start:{1:0,2:0.3,3:0.3},leaf:{count:5,size:4.4,var:0.4,angle:50}},
 mirto:{levels:3,angle:{1:28,2:50,3:45},children:{0:7,1:3,2:2},length:{0:1,1:15,2:5,3:3},radius:{0:0.5,1:0.6,2:0.5,3:0.5},start:{1:0,2:0.35,3:0.3},leaf:{count:5,size:4.0,var:0.4,angle:40}},
 adelfa:{levels:2,angle:{1:16,2:40},children:{0:9,1:4},length:{0:1,1:20,2:6},radius:{0:0.6,1:0.7,2:0.6},start:{1:0,2:0.45},leaf:{count:8,size:5.6,var:0.3,angle:30}},
 coscoja:{levels:3,angle:{1:70,2:65,3:55},children:{0:7,1:3,2:2},length:{0:1,1:9,2:5,3:2.5},radius:{0:0.6,1:0.6,2:0.5,3:0.5},start:{1:0,2:0.2,3:0.2},leaf:{count:5,size:3.8,var:0.4,angle:55}},
 retama:{levels:1,angle:{1:14},children:{0:12},length:{0:1,1:16},radius:{0:0.5,1:0.45},start:{1:0},leaf:{count:8,size:5.6,var:0.3,angle:15}}};
function opts(t,sp,seed){const o=t.options,S=SP[sp];o.seed=seed;o.type='deciduous';o.bark.textured=false;o.bark.flatShading=false;
  Object.assign(o.branch,{levels:S.levels,angle:S.angle,children:S.children,length:S.length,radius:S.radius,start:S.start,
    sections:{0:2,1:3,2:2,3:2},segments:{0:4,1:3,2:3,3:3},taper:{0:0.7,1:0.7,2:0.7,3:0.7},twist:{0:0,1:0,2:0,3:0},
    gnarliness:{0:0.1,1:0.12,2:0.12,3:0.1},force:{direction:{x:0,y:1,z:0},strength:sp==='adelfa'||sp==='retama'?0.02:0.005}});
  Object.assign(o.leaves,{billboard:'double',count:S.leaf.count,size:S.leaf.size,sizeVariance:S.leaf.var,angle:S.leaf.angle,start:0,alphaTest:0.5});}
function remapUV(g,cell){const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,cell[0]+Math.min(0.995,Math.max(0.005,uv.getX(i)))*0.25,cell[1]+Math.min(0.995,Math.max(0.005,uv.getY(i)))*0.5);}
function bake(sp,seed){const t=new Tree();opts(t,sp,seed);t.generate();
  const pick=g=>{const n=new THREE.BufferGeometry();for(const a of['position','normal','uv'])n.setAttribute(a,g.attributes[a].clone());if(g.index)n.setIndex(g.index.clone());return n;};
  const b=pick(t.branchesMesh.geometry),l=pick(t.leavesMesh.geometry);
  {const uv=b.attributes.uv,c=CELDA.corteza;for(let i=0;i<uv.count;i++)uv.setXY(i,c[0]+0.125+(uv.getY(i)%1)*0.0,c[1]+0.05+((uv.getY(i)*0.1)%1)*0.4);}
  remapUV(l,CELDA[sp]);const g=mergeGeometries([b.index?b:b,l.index?l:l]);
  g.computeBoundingBox();const bb=g.boundingBox,sz=new THREE.Vector3();bb.getSize(sz);const k=1/Math.max(sz.x,sz.z,sz.y);
  g.translate(-(bb.min.x+bb.max.x)/2,-bb.min.y,-(bb.min.z+bb.max.z)/2);g.scale(k,k,k);
  // proporción final: ancho×alto de cada especie (el juego aplica luego su escala)
  const P={lentisco:[1,0.75],mirto:[0.9,1],adelfa:[0.8,1],coscoja:[1,0.6],retama:[0.8,1]}[sp];g.computeBoundingBox();const s2=new THREE.Vector3();g.boundingBox.getSize(s2);
  g.scale(P[0]/Math.max(s2.x,s2.z),P[1]/s2.y,P[0]/Math.max(s2.x,s2.z));g.computeBoundingSphere();return g;}
const out={},info=[];for(const sp of Object.keys(SP))for(const v of[0,1]){const g=bake(sp,[101,277,353,419,557,613,709,811,907,997][Object.keys(SP).indexOf(sp)*2+v]);out['AB_'+sp+'_'+v]=g;
  info.push(sp+v+' tri='+(g.index?g.index.count/3:g.attributes.position.count/3));}
window.__info=info;
// vista previa con el atlas
const atlas=new THREE.CanvasTexture(hojasAtlas(document));atlas.colorSpace=THREE.SRGBColorSpace;
const mat=new THREE.MeshLambertMaterial({map:atlas,alphaTest:0.5,side:THREE.DoubleSide});
const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});r.setSize(1600,440);document.body.appendChild(r.domElement);
const sc=new THREE.Scene();sc.background=new THREE.Color('#bfd1e0');sc.add(new THREE.HemisphereLight(0xdde8ff,0x6a5a40,1.6));const s=new THREE.DirectionalLight(0xfff2dd,2.2);s.position.set(5,10,6);sc.add(s);
const keys=Object.keys(out),W=keys.length*1.6;const cam=new THREE.OrthographicCamera(-W/2,W/2,W/2*440/1600,-W/2*440/1600,0.1,100);cam.position.set(0,0.7,20);cam.lookAt(0,0.7,0);
keys.forEach((k,i)=>{const m=new THREE.Mesh(out[k],mat);m.scale.setScalar(1.3);m.position.set(-W/2+0.8+i*1.6,-0.3,0);m.rotation.y=0.6;sc.add(m);});
const gr=new THREE.Mesh(new THREE.PlaneGeometry(40,4),new THREE.MeshLambertMaterial({color:'#9a8a60'}));gr.rotation.x=-Math.PI/2;gr.position.y=-0.3;sc.add(gr);
r.render(sc,cam);
// exportar: solo la geometría (el juego pinta el atlas y pone su material)
const root=new THREE.Scene();for(const k of keys){const m=new THREE.Mesh(out[k],new THREE.MeshBasicMaterial());m.name=k;root.add(m);}
new GLTFExporter().parse(root,buf=>{const u=new Uint8Array(buf);let s='';for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));window.__glb=btoa(s);window.__done=1;},e=>{window.__err=String(e);window.__done=1;},{binary:true});
