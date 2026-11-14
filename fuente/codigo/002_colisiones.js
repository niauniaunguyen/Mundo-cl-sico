// ============================================================ colisiones
const CELL=20,cgrid=new Map();
const ck=(i,j)=>i+','+j;
function gridAdd(o,x0,z0,x1,z1){for(let i=Math.floor(x0/CELL);i<=Math.floor(x1/CELL);i++)for(let j=Math.floor(z0/CELL);j<=Math.floor(z1/CELL);j++){const k=ck(i,j);let a=cgrid.get(k);if(!a){a=[];cgrid.set(k,a);}a.push(o);}}
function addSeg(x1,z1,x2,z2,t=0.25){gridAdd({s:1,x1,z1,x2,z2,t},Math.min(x1,x2)-t,Math.min(z1,z2)-t,Math.max(x1,x2)+t,Math.max(z1,z2)+t);}
function addCirc(x,z,r){gridAdd({s:0,x,z,r},x-r,z-r,x+r,z+r);}
function addBox(cx,cz,w,d,a,t=0.2){const c=[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(p=>toW(p[0],p[1],cx,cz,a));for(let i=0;i<4;i++){const p=c[i],q=c[(i+1)%4];addSeg(p[0],p[1],q[0],q[1],t);}}
// Cierra con una caja de colisión los edificios cuyo contorno no tiene paredes sólidas (termas, casas del Palatino,
// pórticos…). No toca templos, teatros, plazas ni recintos abiertos, ni los edificios con personajes o estelas dentro.
const OPEN_FP=/Teatro|Anfiteatro|Circo|Foro|Ágora|Agora|Academia|Liceo|Cinosarges|Cnosos|Pnyx|Ilión|Cadmea|Templo|Partenón|Hefestión|Erecteion|Propileos|Olimpieion|Gran templo|Hereo|Mausoleo|Ara|Reloj|Dípilon|Bema|Fuente|Odeón|Tholos/;
let SEALED=[];
function sealFootprints(){
  const near=(x,z)=>{const i0=Math.floor(x/CELL),j0=Math.floor(z/CELL);for(let i=i0-1;i<=i0+1;i++)for(let j=j0-1;j<=j0+1;j++){const arr=cgrid.get(ck(i,j));if(!arr)continue;
    for(const o of arr){let cx,cz,lim;if(o.s){const dx=o.x2-o.x1,dz=o.z2-o.z1,L=dx*dx+dz*dz;const t=clamp(L?((x-o.x1)*dx+(z-o.z1)*dz)/L:0,0,1);cx=o.x1+dx*t;cz=o.z1+dz*t;lim=o.t+1.5;}else{cx=o.x;cz=o.z;lim=o.r+1.5;}
      if((x-cx)**2+(z-cz)**2<lim*lim)return true;}}return false;};
  const people=[...npcObjs,...signObjs].map(o=>[o.x,o.z]);
  const n=[];
  for(const f of footprints){
    if(f.reserve||f.house||f.r||!f.name||OPEN_FP.test(f.name)||f.w<4||f.d<4)continue;
    const a=f.a||0,inside=(x,z)=>{const p=toL(x,z,f.x,f.z,a);return Math.abs(p[0])<f.w/2-2.5&&Math.abs(p[1])<f.d/2-2.5;};
    if(people.some(q=>inside(q[0],q[1])))continue;
    let hit=0,tot=0;
    for(let k=0;k<40;k++){const t=k/40*4,side=Math.floor(t),u=t-side-0.5;const lp=[[u*f.w,-f.d/2],[f.w/2,u*f.d],[-u*f.w,f.d/2],[-f.w/2,-u*f.d]][side];const w=toW(lp[0],lp[1],f.x,f.z,a);tot++;if(near(w[0],w[1]))hit++;}
    if(hit/tot<0.35){addBox(f.x,f.z,f.w,f.d,a,0.3);n.push(f.name);}
  }
  // piezas macizas sueltas o instanciadas (ínsulas, domus, casas de campo, tumbas…) que llegan al suelo sin colisión
  const m=new THREE.Matrix4(),c=new THREE.Vector3();
  const solid=(cx,cz,w,d,a,y0,y1)=>{
    if(w<3||d<3||w>70||d>70||y1-y0<2.5)return;const g=terrainH(cx,cz);if(y0>g+1.2||floorAt(cx,cz)>y1-0.5)return;
    if(people.some(p=>{const l=toL(p[0],p[1],cx,cz,a);return Math.abs(l[0])<w/2+0.5&&Math.abs(l[1])<d/2+0.5;}))return;
    let hit=0;for(let k=0;k<24;k++){const t=k/24*4,side=Math.floor(t),u=t-side-0.5;const lp=[[u*w,-d/2],[w/2,u*d],[-u*w,d/2],[-w/2,-u*d]][side];const p=toW(lp[0],lp[1],cx,cz,a);if(near(p[0],p[1]))hit++;}
    if(hit/24<0.35){addBox(cx,cz,w,d,a,0.25);(n.list=n.list||[]).push([cx|0,cz|0,w|0,d|0,(y1-y0)|0]);n.meshes=n.list.length;}};
  scene.updateMatrixWorld(true);
  scene.traverse(o=>{
    if(!o.isMesh||!o.geometry||o.userData.noCol)return;
    for(let p=o;p;p=p.parent)if(p.userData&&(p.userData.arms||p.userData.walk||p.userData.anim))return;
    const geo=o.geometry;if(!geo.boundingBox)geo.computeBoundingBox();const bb=geo.boundingBox;
    const ax=[new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()],ext=[0,0,0];
    const one=mw=>{ // caja orientada en planta: los dos ejes locales más horizontales dan anchura, fondo y giro
      bb.getCenter(c).applyMatrix4(mw);mw.extractBasis(ax[0],ax[1],ax[2]);ext[0]=(bb.max.x-bb.min.x)/2;ext[1]=(bb.max.y-bb.min.y)/2;ext[2]=(bb.max.z-bb.min.z)/2;
      const ord=[0,1,2].sort((i,j)=>Math.abs(ax[i].y)/ax[i].length()-Math.abs(ax[j].y)/ax[j].length());const v=ord[2],h1=ord[0],h2=ord[1];
      if(Math.abs(ax[v].y)/ax[v].length()<0.97)return;
      const hv=Math.abs(ax[v].y)*ext[v],a=Math.atan2(ax[h1].z,ax[h1].x);
      solid(c.x,c.z,2*ext[h1]*Math.hypot(ax[h1].x,ax[h1].z),2*ext[h2]*Math.hypot(ax[h2].x,ax[h2].z),-a,c.y-hv,c.y+hv);};
    if(o.isInstancedMesh){for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);one(m.premultiply(o.matrixWorld));}}
    else one(o.matrixWorld.clone());
  });
  return n;
}
function resolve(p,rad){
  for(let it=0;it<3;it++){
    const i0=Math.floor(p.x/CELL),j0=Math.floor(p.z/CELL);const seen=new Set();
    for(let i=i0-1;i<=i0+1;i++)for(let j=j0-1;j<=j0+1;j++){
      const arr=cgrid.get(ck(i,j));if(!arr)continue;
      for(const o of arr){if(seen.has(o))continue;seen.add(o);
        let cx,cz,lim;
        if(o.s){const dx=o.x2-o.x1,dz=o.z2-o.z1,L=dx*dx+dz*dz;let t=L?((p.x-o.x1)*dx+(p.z-o.z1)*dz)/L:0;t=clamp(t,0,1);cx=o.x1+dx*t;cz=o.z1+dz*t;lim=rad+o.t;}
        else{cx=o.x;cz=o.z;lim=rad+o.r;}
        const ex=p.x-cx,ez=p.z-cz,d2=ex*ex+ez*ez;
        if(d2<lim*lim){const d=Math.sqrt(d2)||1e-4,k=(lim-d)/d;p.x+=ex*k;p.z+=ez*k;}
      }
    }
  }
}

