// ============================================================ terreno
// Escala: edificios a tamaño real; la Acrópolis y el Ágora conservan su disposición aproximada
// según los planos de excavación; las distancias entre barrios están comprimidas.
const ACRO={x:0,z:0,rx:135,rz:64,h:60};
const AY=ACRO.h;
const THEA={x:62,z:142,r0:10,r1:58,h0:2,step:0.45};
const AG={x:-370,z:-330};                 // centro del Ágora: los edificios se colocan con AL(x,z) en metros desde aquí
                                          // (antes en x=−470: el Ágora quedaba demasiado lejos de la Acrópolis; ver docs/revision_atenas.md)
const AGORA={x:AG.x,z:AG.z,r:150};
const AL=(lx,lz)=>[AG.x+lx,AG.z+lz];
const PNYX={x:-520,z:60,rx:70,rz:55,h:45};
const AREO={x:-290,z:-75};
function superD(x,z,cx,cz,rx,rz){const dx=Math.abs((x-cx)/rx),dz=Math.abs((z-cz)/rz);return Math.pow(dx*dx*dx*dx+dz*dz*dz*dz,0.25);}
function plateau(x,z,cx,cz,rx,rz,h,edge){const d=superD(x,z,cx,cz,rx,rz);if(d<=1)return h;return h*(1-sstep(Math.min(1,(d-1)/edge)));}
function bump(x,z,cx,cz,r,h){const dx=x-cx,dz=z-cz;return h*Math.exp(-(dx*dx+dz*dz)/(r*r));}
function rawH(x,z){
  let h=(fbm(x*0.006,z*0.006)-0.45)*8;
  const ag=Math.hypot(x-AG.x,z-AG.z);if(ag<190)h=lerp(h,0,1-sstep(clamp((ag-140)/50,0,1)));
  h+=plateau(x,z,AREO.x,AREO.z,46,22,34,1.0);   // Areópago
  h+=bump(x,z,AG.x-140,AG.z-45,42,11);          // Colono Agoreo (Hefestión)
  h+=plateau(x,z,PNYX.x,PNYX.z,PNYX.rx,PNYX.rz,PNYX.h,1.3);
  h+=bump(x,z,-330,345,115,78);                 // colina de las Musas
  h+=bump(x,z,-700,-40,85,38);                  // colina de las Ninfas
  h+=bump(x,z,450,-960,130,200);                // Licabeto
  h+=bump(x,z,1700,0,750,380);                  // Himeto
  h+=bump(x,z,-2100,-250,750,300);              // Egaleo
  h+=bump(x,z,-300,-2700,1150,450);             // Parnés
  h+=bump(x,z,-215,-5,75,24);                   // collado al oeste de la Acrópolis
  if(Math.abs(x-40)<250&&z>0)h+=30*(1-sstep(clamp((z-64)/95,0,1)))*sstep(clamp((z-15)/35,0,1))*(1-sstep(clamp((Math.abs(x-40)-130)/90,0,1)))*(0.3+0.7*sstep(clamp((superD(x,z,165,100,52,62)-1)/0.6,0,1))); // ladera sur, más suave junto al Odeón
  {const d=superD(x,z,162,124,33,36.5);if(d<1.5)h=lerp(8,h,sstep(clamp((d-1)/0.5,0,1)));}   // terraza del Odeón, excavada en la ladera como el real
  const s=(z-x)-1750;if(s>0)h-=sstep(clamp(s/220,0,1))*22;
  h=pirCarve(x,z,h);
  const th=Math.hypot(x-THEA.x,z-(THEA.z+12));if(th<45)h=lerp(h,THEA.h0,1-sstep(clamp((th-25)/20,0,1)));
  {const tx=x-THEA.x,tz=z-THEA.z,r=Math.hypot(tx,tz);if(r<THEA.r1+12){const ph=Math.abs(Math.atan2(tx,-tz)),rc=Math.min(Math.max(r,THEA.r0),THEA.r1),cav=THEA.h0+(rc-THEA.r0)*THEA.step+0.3;
    const out=r>THEA.r1?1-sstep((r-THEA.r1)/12):1,w=1-sstep(clamp((ph-1.55)/0.9,0,1)),e=cav*out*w;if(e>h)h=e;}} // la ladera abraza las gradas
  let a=plateau(x,z,ACRO.x,ACRO.z,ACRO.rx,ACRO.rz,ACRO.h,0.3);
  if(x>-240&&x<-110){const t=clamp((x+235)/95,0,1);const side=1-sstep(clamp((Math.abs(z+2)-7)/5,0,1));a=Math.max(a,(25+35*t)*side);} // rampa de Mnesicles
  return a>0?Math.max(h,a):(s>0||pirWet(x,z))?h:Math.max(h,0);   // bajo el nivel del suelo solo el mar y las dársenas del Pireo
}

// ------------------------------------------------------------ explanadas bajo los edificios
// Los edificios se apoyan en el punto más bajo de su solar (minGround); en pendiente, el terreno subía por dentro y tapaba suelos,
// basas y figuras. Tras construir los edificios con nombre, el terreno se rebaja a ese nivel bajo cada uno, con un rellano de 5 m
// (lo que mide una celda de la malla, para que ningún triángulo vuelva a asomar dentro) y una transición suave. Solo se rebaja.
const FLATS=[],FLAT_GRID=new Map(),FLAT_C=40;
function flatAt(x,z,h){const a=FLAT_GRID.get(Math.floor(x/FLAT_C)+','+Math.floor(z/FLAT_C));if(!a)return h;
  for(const f of a){const dx=x-f.cx,dz=z-f.cz,lx=Math.abs(dx*f.c-dz*f.s)-f.hw,lz=Math.abs(dx*f.s+dz*f.c)-f.hd,d=f.round?Math.hypot(dx,dz)-f.hw:Math.hypot(Math.max(lx,0),Math.max(lz,0));
    if(d<f.ring){if(h>f.base)h=f.base;}else if(d<f.ring+f.blend){const t=lerp(f.base,h,sstep((d-f.ring)/f.blend));if(t<h)h=t;}}
  return h;}
function addFlat(f){FLATS.push(f);const R=Math.max(f.hw,f.hd)*1.42+f.ring+f.blend;
  for(let i=Math.floor((f.cx-R)/FLAT_C);i<=Math.floor((f.cx+R)/FLAT_C);i++)for(let j=Math.floor((f.cz-R)/FLAT_C);j<=Math.floor((f.cz+R)/FLAT_C);j++){const k=i+','+j;let a=FLAT_GRID.get(k);if(!a)FLAT_GRID.set(k,a=[]);a.push(f);}}
function applyFlats(){
  // alturas de la malla tal como se ve (interpolada entre vértices): la de Atenas o Roma y la de cada isla
  const grids=[];const addGrid=(m,cx,cz,S)=>{if(!m)return;const pos=m.geometry.attributes.position,seg=Math.round(Math.sqrt(pos.count))-1;grids.push({m,pos,x0:cx-S/2,z0:cz-S/2,S,st:S/seg,G:seg+1});};
  addGrid(terrainInner,INNER.x,INNER.z,INNER.size);for(const I of ISLANDS)if(I.mesh){addGrid(I.mesh,I.x,I.z,I.R*2.9);grids[grids.length-1].I=I;}
  const meshH=(x,z)=>{for(const g of grids){if(x<=g.x0+1||z<=g.z0+1||x>=g.x0+g.S-1||z>=g.z0+g.S-1)continue;const fx=(x-g.x0)/g.st,fz=(z-g.z0)/g.st,ix=Math.floor(fx),iz=Math.floor(fz),u=fx-ix,v=fz-iz,H=(i,j)=>g.pos.getY(i+g.G*j);
    const p=H(ix,iz),q=H(ix,iz+1),r=H(ix+1,iz+1),t=H(ix+1,iz);return u+v<=1?p+u*(t-p)+v*(q-p):r+(1-u)*(q-r)+(1-v)*(t-r);}return null;};
  // piezas de los edificios ya construidos, repartidas en celdas
  const terr=new Set(grids.map(g=>g.m)),cells=new Map(),CC=20;
  scene.traverse(o=>{if(!(o.isMesh||o.isInstancedMesh)||o.isSprite||terr.has(o)||!o.geometry)return;if(o.geometry.type==='PlaneGeometry'&&o.geometry.parameters.width>500)return;
    o.updateWorldMatrix(true,false);const bb=new THREE.Box3().setFromObject(o);if(!isFinite(bb.min.x)||bb.max.x-bb.min.x>400||bb.max.z-bb.min.z>400)return;
    for(let i=Math.floor(bb.min.x/CC);i<=Math.floor(bb.max.x/CC);i++)for(let j=Math.floor(bb.min.z/CC);j<=Math.floor(bb.max.z/CC);j++){const k=i+','+j;let a=cells.get(k);if(!a)cells.set(k,a=[]);a.push({o,bb});}});
  const rc=new THREE.Raycaster(),dn=new THREE.Vector3(0,-1,0),org=new THREE.Vector3();rc.far=1.3;
  // primera superficie construida que queda bajo el terreno en (x,z), o null
  const covered=(x,z)=>{const mh=meshH(x,z);if(mh==null)return null;const a=cells.get(Math.floor(x/CC)+','+Math.floor(z/CC));if(!a)return null;const cand=[];
    for(const e of a){const bb=e.bb;if(x>=bb.min.x&&x<=bb.max.x&&z>=bb.min.z&&z<=bb.max.z&&bb.min.y<mh&&bb.max.y>mh-1.3)cand.push(e.o);}if(!cand.length)return null;
    org.set(x,mh-0.02,z);rc.set(org,dn);const h=rc.intersectObjects(cand,false);return h.length&&mh-h[0].point.y>0.04?h[0].point.y:null;};
  const added=[];
  for(const fp of footprints){if(fp.reserve||fp.noFlat||(!fp.name&&MODE==='atenas'&&fp.x<8000))continue;
    const round=!!fp.r,w=round?fp.r*2:fp.w,d=round?fp.r*2:fp.d,a=fp.a||0;if(!w||!d||w*d>5000)continue;
    // se mide dentro del solar y un poco más allá (escalinatas, zócalos)
    let low=Infinity;for(let i=-1;i<=1;i+=1/6)for(let j=-1;j<=1;j+=1/6){const p=toW(i*(w/2+1.2),j*(d/2+1.2),fp.x,fp.z,a),y=covered(p[0],p[1]);if(y!=null&&y<low)low=y;}
    if(low===Infinity)continue;
    const f={cx:fp.x,cz:fp.z,c:Math.cos(a),s:Math.sin(a),hw:w/2+1.5,hd:d/2+1.5,round,base:low-0.04,ring:5,blend:7};addFlat(f);added.push(f);}
  if(!added.length)return;
  // vuelve a calcular las alturas de las mallas de terreno afectadas
  for(const g of grids){const pos=g.pos,hf=g.m===terrainInner?displayH:terrainH;let ch=false;
    for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);if(!FLAT_GRID.has(Math.floor(x/FLAT_C)+','+Math.floor(z/FLAT_C)))continue;const h=hf(x,z);if(Math.abs(h-pos.getY(i))>0.001){pos.setY(i,h);ch=true;}}
    if(ch){pos.needsUpdate=true;g.m.geometry.computeVertexNormals();g.m.geometry.computeBoundingSphere();}
    if(ch&&g.I&&g.I.grid){const H=g.I.grid.H;for(let i=0;i<pos.count;i++)H[i]=pos.getY(i);g.I.flatMesh=true;}}   // en los destinos el suelo físico es la malla que se ve (más basta que un corte estrecho)
}
const CAVEAS=[];
function caveaH(C,x,z){const dx=x-C.x,dz=z-C.z;if(Math.abs(dx)>C.rr||Math.abs(dz)>C.rr)return null;const c=Math.cos(C.a),s=Math.sin(C.a),lx=dx*c-dz*s,lz=dx*s+dz*c;
  if(C.k==='t'){if(lz>0.5)return null;const r=Math.hypot(lx,lz);if(r<C.R0-2||r>C.R1-0.5)return null;if(r>C.R1-5)return C.gy+1.2+(C.H-6);   // el pasillo de arriba (summa cavea)
    const span=C.R1-C.R0-6,y1=1.2+(C.H-6)*0.5/C.steps;if(r<C.R0+2)return C.gy+y1*(r-C.R0+2)/4;   // rampa suave del borde de la orquesta al primer peldaño
    const f=Math.min(1,(r-C.R0-2)/span+0.5/C.steps);return C.gy+1.2+(C.H-6)*f;}
  if(C.k==='c'){let lo=0,hi=1;const q=s=>{const a=C.ai+(C.ao-C.ai)*s,b=C.bi+(C.bo-C.bi)*s;return(lx/a)**2+(lz/b)**2;};if(q(C.s0-0.004)<1||q(1)>1)return null;   /* el Coliseo: gradas elípticas sobre el podio */
    for(let i=0;i<12;i++){const m=(lo+hi)/2;if(q(m)>1)lo=m;else hi=m;}const s=(lo+hi)/2,a=C.ai+(C.ao-C.ai)*s,b=C.bi+(C.bo-C.bi)*s;if(Math.abs(Math.sin(Math.atan2(lz/b,lx/a)))<0.14)return null;
    const j=Math.max(C.s0*C.ST,s*C.ST-0.5);return C.gy+4.2+(40-4.2)*Math.min(C.ST,j+1)/C.ST;}
  const r=Math.hypot(lx,lz);if(r<0.01)return null;const cs=lx/r,sn=lz/r,d0=1/Math.hypot(cs/C.ax,sn/C.az),d1=1/Math.hypot(cs/C.rx,sn/C.rz);if(r<d0+0.5||r>d1)return null;if(Math.abs(sn)<0.07)return null;   // las entradas de los extremos, a ras de suelo
  const f=Math.min(1,(r-d0)/(d1-d0)+0.5/C.steps);return C.gy+1.2+(C.H-2)*f;}   // a las gradas se sube por la escalera exterior (como en Pompeya); desde la arena no: el podio lo impide
function inCavea(x,z){const dx=x-THEA.x,dz=z-THEA.z;return dz<3&&Math.hypot(dx,dz)<THEA.r1+1;}
function terrainH(x,z){const h=terrainH0(x,z);if(x>8000){const I=islandOf(x);if(I&&I.flatMesh&&!GRIDOFF&&I.grid&&gridH(I,x,z)!==null)return h;}return FLATS.length?flatAt(x,z,h):h;}
{const f0=terrainH0;terrainH0=function(x,z){const h=f0(x,z);return x>8000?h:sqMount('atenas',x,z,h);};}
function terrainH0(x,z){
  if(x>8000)return islandH(x,z);
  if(MODE==='roma')return romaH(x,z);
  const dx=x-THEA.x,dz=z-THEA.z,r=Math.hypot(dx,dz);
  if(r<THEA.r0)return THEA.h0;
  if(dz<3&&r<THEA.r1+1)return THEA.h0+(Math.floor(r-THEA.r0)+1)*THEA.step;
  return carveH(x,z,rawH(x,z));
}
function displayH(x,z){return MODE==='atenas'&&inCavea(x,z)&&Math.hypot(x-THEA.x,z-THEA.z)>=THEA.r0?terrainH(x,z)-0.7:terrainH(x,z);}

// plataformas (escalinatas, suelos de templos)
const platforms=[];
function addPlat(cx,cz,w,d,a,top){platforms.push({cx,cz,hw:w/2,hd:d/2,c:Math.cos(a),s:Math.sin(a),top});}
function floorAt(x,z){
  let h=terrainH(x,z);
  for(const C of CAVEAS){const y=caveaH(C,x,z);if(y!==null&&y>h)h=y;}
  for(const p of platforms){const dx=x-p.cx,dz=z-p.cz;const lx=dx*p.c-dz*p.s,lz=dx*p.s+dz*p.c;if(Math.abs(lx)<=p.hw&&Math.abs(lz)<=p.hd&&p.top>h)h=p.top;}
  const wv=riverWater(x,z);if(wv!==null&&wv-1.25>h)h=wv-1.25;
  return h;
}
function minGround(cx,cz,w,d,a){let m=Infinity;for(let i=-1;i<=1;i+=0.5)for(let j=-1;j<=1;j+=0.5){const p=toW(i*w/2,j*d/2,cx,cz,a);m=Math.min(m,terrainH(p[0],p[1]));}return m;}

