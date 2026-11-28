// ============================================================ edificios
const signs=[];
function gableRoof(g,W,L,y,h,roofMat,tympMat,alongX){const r=new THREE.Mesh(GABLE,[roofMat||M.tile,tympMat||M.blue]);if(alongX){r.rotation.y=Math.PI/2;r.scale.set(L,h,W);}else r.scale.set(W,h,L);r.position.y=y;r.castShadow=true;g.add(r);
  ROOFS.push({r,mat:roofMat||M.tile,fancy:!tympMat||tympMat===M.blue});return r;}
// tejas cobijas en hileras y antefijas con palmeta (solo en los templos), instanciadas; se colocan al final, cuando los tejados ya están en su sitio
const ROOFS=[];
function finishRoofs(){
  const cg=glbGeo('R_cover'),ag=glbGeo('R_antefix');if(!cg)return;
  const byMat=new Map(),afx=[],v=new THREE.Vector3(),p0=new THREE.Vector3(),p1=new THREE.Vector3(),ra=new THREE.Vector3(),rb=new THREE.Vector3(),X=new THREE.Vector3(),Y=new THREE.Vector3(),Z=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
  for(const R0 of ROOFS){const r=R0.r;if(!r.parent)continue;r.updateWorldMatrix(true,false);const W=r.matrixWorld;
    ra.set(0,1,-0.5).applyMatrix4(W);rb.set(0,1,0.5).applyMatrix4(W);const len=ra.distanceTo(rb),n=Math.max(2,Math.round(len/0.62));
    const key=R0.mat.color.getHexString();if(!byMat.has(key))byMat.set(key,{mat:lam('#'+R0.mat.color.clone().multiplyScalar(0.82).getHexString()),list:[]});const L=byMat.get(key).list;
    for(let i=0;i<n;i++){const t=-0.5+(i+0.5)/n;
      for(const s of[-1,1]){p0.set(s*0.5,0,t).applyMatrix4(W);p1.set(0,1,t).applyMatrix4(W);
        X.subVectors(p1,p0);const sl=X.length();X.divideScalar(sl);Z.subVectors(rb,ra).normalize();Y.crossVectors(Z,X);if(Y.y<0){Y.negate();Z.negate();}Z.crossVectors(X,Y);
        const m=new THREE.Matrix4().makeBasis(v.copy(X).multiplyScalar(sl),Y,Z);m.setPosition(p0);L.push(m);
        if(R0.fancy&&ag){const o=v.set(-X.x,0,-X.z).normalize();const ax=o.clone().negate(),az=new THREE.Vector3().crossVectors(ax,up);const ma=new THREE.Matrix4().makeBasis(ax,up,az);ma.setPosition(p0.x+o.x*0.04,p0.y-0.05,p0.z+o.z*0.04);afx.push(ma);}}}}
  // por zonas (chunked): antes eran dos mallas para todo el mundo, sin descarte por la vista, con las tejas de todos los destinos (83.000 hiladas)
  for(const{mat,list}of byMat.values())chunked(cg,mat,list.map(m=>({m})),{far:900,shadow:true});
  if(afx.length)chunked(ag,lam('#d9cfbd'),afx.map(m=>({m})),{far:550,shadow:false});
}
function acroteria(g,W,L,y,h,mat,alongX){for(const e of[-1,1]){const p=alongX?[e*(L/2+0.2),0]:[0,e*(L/2+0.2)];const ac=new THREE.Mesh(new THREE.ConeGeometry(Math.max(0.25,W*0.02),Math.max(0.8,W*0.05),6),mat||M.gold);ac.position.set(p[0],y+h+0.4,p[1]);g.add(ac);
  for(const s of[-1,1]){const q=alongX?[e*(L/2+0.2),s*(W/2)]:[s*(W/2),e*(L/2+0.2)];const a2=new THREE.Mesh(new THREE.ConeGeometry(Math.max(0.2,W*0.015),Math.max(0.6,W*0.035),6),mat||M.gold);a2.position.set(q[0],y+0.35,q[1]);g.add(a2);}}}
function pedimentFigures(g,W,L,y,h,n){for(const ez of[-1,1])for(let i=0;i<n;i++){const t=(i-(n-1)/2)/((n-1)/2);const hh=(1-Math.abs(t))*h*0.85;if(hh<0.75)continue;
  const f=makePerson({chiton:pick(['#e9e0cf','#c9a24a','#b8432f','#e9e0cf']),himation:pick(['#2f4c86','#a8392b','#e2d8c4']),skin:'#efe5d4',hair:'#7a5a2a',female:R()<0.4,beard:R()<0.4});
  f.scale.setScalar(Math.min(1.6,hh/1.95));f.position.set(t*W*0.42,y+0.05,ez*(L/2+0.35));f.rotation.y=ez>0?0:Math.PI;g.add(f);}}

// Templo períptero o próstilo con medidas reales.
// W: anchura del estilóbato (eje x local), L: longitud (eje z local, +z = fachada principal).
function temple(o){
  const a=o.rot||0,W=o.W,L=o.L,cr=o.colD/2,colH=o.colH,ion=o.order==='ionic';
  const steps=o.steps||3,sh=o.stepH||0.4,base=steps*sh;
  const gy=o.gy!==undefined?o.gy:minGround(o.x,o.z,W+4,L+4,a)-0.1;
  const g=new THREE.Group();g.position.set(o.x,gy,o.z);g.rotation.y=a;scene.add(g);
  for(let i=0;i<steps;i++){const ex=(steps-1-i)*sh*1.3;const top=sh*(i+1),hh=top+8;box(W+ex*2,hh,L+ex*2,i===0&&o.euthynteria?M.limestone:M.marble,0,top-hh/2,0,g);addPlat(o.x,o.z,W+ex*2,L+ex*2,a,gy+top);}
  const m=cr*1.12,nW=o.nW,nL=o.nL||2,iaW=(W-2*m)/(nW-1),iaL=(L-2*m)/(nL-1);
  const pts=[];
  if(o.prostyle){for(let i=0;i<nW;i++){pts.push([-W/2+m+i*iaW,L/2-m]);if(o.amphi)pts.push([-W/2+m+i*iaW,-L/2+m]);}}
  else{for(let i=0;i<nW;i++){pts.push([-W/2+m+i*iaW,-L/2+m]);pts.push([-W/2+m+i*iaW,L/2-m]);}for(let j=1;j<nL-1;j++){pts.push([-W/2+m,-L/2+m+j*iaL]);pts.push([W/2-m,-L/2+m+j*iaL]);}}
  for(const p of pts){const wp=toW(p[0],p[1],o.x,o.z,a);addColumn(wp[0],gy+base,wp[1],cr,colH,a,ion?'ionic':'doric');}
  const ey=base+colH,e=o.entH||colH*(ion?0.24:0.32);
  const top=entablature(g,W,L,ey,e,{ionic:ion,ia:iaW,friezeTex:o.friezeTex});
  coffered(g,W-0.4,L-0.4,ey+e*0.4-0.12);
  const ph=o.pedH||W*0.12;
  gableRoof(g,W+0.7,L+0.7,top,ph,o.roofMat||M.tile,M.blue);
  acroteria(g,W,L,top,ph,o.acroMat);
  if(o.sculpt)pedimentFigures(g,W,L,top,ph,o.sculpt);
  const C=o.cella;
  if(C){
    const cw=C.w,cl=C.l,t=C.t||0.9,hh=colH+e*0.4,cm=C.mat||M.marbleShade,oz=C.oz||0;
    const seg=(x1,z1,x2,z2)=>{const p=toW(x1,z1,o.x,o.z,a),q=toW(x2,z2,o.x,o.z,a);addSeg(p[0],p[1],q[0],q[1],t/2);};
    const wall=(x1,z1,x2,z2)=>{const len=Math.hypot(x2-x1,z2-z1),mx=(x1+x2)/2,mz=(z1+z2)/2,w=box(Math.abs(x2-x1)>0.01?len:t,hh,Math.abs(z2-z1)>0.01?len:t,cm,mx,base+hh/2,mz,g);seg(x1,z1,x2,z2);return w;};
    const z1=oz-cl/2,z2=oz+cl/2,xl=-cw/2+t/2,xr=cw/2-t/2;
    const ext=C.antis?C.antis:0;
    wall(xl,z1-(C.antisBack?ext:0),xl,z2+ext);wall(xr,z1-(C.antisBack?ext:0),xr,z2+ext);
    const door=C.door||Math.min(4.5,cw*0.3),sidew=(cw-door)/2;
    const front=zz=>{box(sidew,hh,t,cm,-cw/2+sidew/2,base+hh/2,zz,g);box(sidew,hh,t,cm,cw/2-sidew/2,base+hh/2,zz,g);box(door,hh*0.12,t,cm,0,base+hh*0.94,zz,g);seg(-cw/2,zz,-door/2,zz);seg(door/2,zz,cw/2,zz);};
    front(z2-t/2);
    if(C.backDoor)front(z1+t/2);else wall(-cw/2,z1+t/2,cw/2,z1+t/2);
    if(C.part!==undefined){if(C.partSolid)wall(-cw/2,C.part,cw/2,C.part);else front(C.part);}
    coffered(g,cw-2*t,cl-2*t,base+hh-0.1);
    if(C.frieze){const fr=new THREE.Mesh(new THREE.BoxGeometry(cw+0.05,1.0,cl+0.05),[texMat(TEX.procession,cl/6),texMat(TEX.procession,cl/6),M.marble,M.marble,texMat(TEX.procession,cw/6),texMat(TEX.procession,cw/6)]);fr.position.y=base+hh-0.5;g.add(fr);}
    const porch=(zz,n,cd,ch)=>{for(let i=0;i<n;i++){const lx=-cw/2+cd*0.6+i*(cw-cd*1.2)/(n-1);const wp=toW(lx,zz,o.x,o.z,a);addColumn(wp[0],gy+base,wp[1],cd/2,ch||colH*0.97,a,'doric');}};
    if(C.pro)porch(z2+C.pro.d,C.pro.n,C.pro.cd,C.pro.ch);
    if(C.opi)porch(z1-C.opi.d,C.opi.n,C.opi.cd,C.opi.ch);
    if(C.antisCols){for(const s of[-1,1]){const wp=toW(s*cw*0.2,z2+ext-0.6,o.x,o.z,a);addColumn(wp[0],gy+base,wp[1],cr*0.95,colH*0.97,a,'doric');if(C.antisBack){const wb=toW(s*cw*0.2,z1-ext+0.6,o.x,o.z,a);addColumn(wb[0],gy+base,wb[1],cr*0.95,colH*0.97,a,'doric');}}}
    if(C.inner){const I=C.inner,h1=I.two?I.h*0.56:I.h,bh=0.55;
      const col=(lx,lz)=>{const wp=toW(lx,lz,o.x,o.z,a);addColumn(wp[0],gy+base,wp[1],I.r,h1,a,'doric');if(I.two)addColumn(wp[0],gy+base+h1+bh,wp[1],I.r*0.78,I.h-h1-bh,a,'doric',true);};
      for(let k=0;k<I.n;k++){const lz=I.z1+k*(I.z2-I.z1)/(I.n-1);for(const s of[-1,1])col(s*I.x,lz);}
      if(I.back){for(let k=0;k<I.back;k++)col(-I.x+k*(2*I.x)/(I.back-1),I.z1-1.5);}
      if(I.two){const zm=(I.z1-1.5+I.z2)/2,zl=I.z2-I.z1+1.5+I.r*2;for(const s of[-1,1])box(I.r*2.2,bh,zl,M.marbleShade,s*I.x,base+h1+bh/2,zm,g);box(2*I.x+I.r*2.2,bh,I.r*2.2,M.marbleShade,0,base+h1+bh/2,I.z1-1.5,g);
        for(const s of[-1,1])box(I.r*2,0.18,zl,M.marble,s*(I.x+0.4),base+h1+bh+0.09,zm,g);}}
  }
  if(C&&o.name!=='Partenón'){const t=C.t||0.9,oz=C.oz||0,z1=oz-C.l/2,z2=oz+C.l/2,zb=(C.part!==undefined?C.part:z1)+t;tpDecorate(o,g,C.w-2*t,zb,z2-t,base,colH,null,false);}
  tpDecorate(o,null,0,0,0,0,0,toW(W*0.32,L/2+3.5,o.x,o.z,a),false);
  footprints.push({x:o.x,z:o.z,w:W,d:L,a,c:'#efe7d8',name:o.name});
  return {g,gy,base,ey,top};
}

// Pórtico (stoa): muro de fondo, columnata exterior, opcionalmente columnata interior, habitaciones y alas.
function stoa(o){
  const a=o.rot||0,L=o.len,Dd=o.depth,colH=o.colH||5.5,cr=(o.colD||0.75)/2;
  const gy=minGround(o.x,o.z,L+2,Dd+2,a)-0.1;
  const g=new THREE.Group();g.position.set(o.x,gy,o.z);g.rotation.y=a;scene.add(g);
  box(L+1.2,4.3,Dd+1.2,M.limestone,0,0.3-2.15,0,g);box(L,4.6,Dd,M.marble,0,0.6-2.3,0,g);
  addPlat(o.x,o.z,L+1.2,Dd+1.2,a,gy+0.3);addPlat(o.x,o.z,L,Dd,a,gy+0.6);
  const wh=colH+1.0,t=0.8,wm=o.wallMat||M.stone;
  const seg=(x1,z1,x2,z2)=>{const p=toW(x1,z1,o.x,o.z,a),q=toW(x2,z2,o.x,o.z,a);addSeg(p[0],p[1],q[0],q[1],t/2);};
  box(L,wh,t,wm,0,0.6+wh/2,-Dd/2+t/2,g);seg(-L/2,-Dd/2+t/2,L/2,-Dd/2+t/2);
  box(t,wh,Dd,wm,-L/2+t/2,0.6+wh/2,0,g);box(t,wh,Dd,wm,L/2-t/2,0.6+wh/2,0,g);seg(-L/2+t/2,-Dd/2,-L/2+t/2,Dd/2-1);seg(L/2-t/2,-Dd/2,L/2-t/2,Dd/2-1);
  const n=o.nCols||Math.round(L/(cr*2*4.5))+1;
  const ia=(L-2.4)/(n-1);
  for(let i=0;i<n;i++){const lx=-L/2+1.2+i*ia;const p=toW(lx,Dd/2-0.8,o.x,o.z,a);addColumn(p[0],gy+0.6,p[1],cr,colH,a,o.order||'doric');}
  if(o.inner){const ni=o.innerN||Math.floor(n/2);const zi=o.rooms?(-Dd/2+o.rooms.d+(Dd/2-0.8-(-Dd/2+o.rooms.d))/2):0;for(let i=0;i<ni;i++){const lx=-L/2+3+i*(L-6)/(ni-1);const p=toW(lx,zi,o.x,o.z,a);addColumn(p[0],gy+0.6,p[1],cr*0.8,colH+1.2,a,o.inner);}}
  if(o.rooms){const R2=o.rooms,rw=L/R2.n,zf=-Dd/2+R2.d;
    for(let i=0;i<R2.n;i++){const x0=-L/2+i*rw;if(i>0){box(0.5,wh,R2.d,wm,x0,0.6+wh/2,-Dd/2+R2.d/2,g);seg(x0,-Dd/2,x0,zf);}
      const dw=1.3,sw=(rw-dw)/2;box(sw,wh,0.5,wm,x0+sw/2,0.6+wh/2,zf,g);box(sw,wh,0.5,wm,x0+rw-sw/2,0.6+wh/2,zf,g);seg(x0,zf,x0+sw,zf);seg(x0+rw-sw,zf,x0+rw,zf);box(dw,0.5,0.5,wm,x0+rw/2,0.6+wh-0.25,zf,g);}}
  entablature(g,L,Dd,0.6+colH,colH*0.3,{ia});
  coffered(g,L-0.6,Dd-0.6,0.6+colH+colH*0.12);
  gableRoof(g,L+1.2,Dd+1.2,0.6+colH+colH*0.3,o.roofH||Dd*0.18,o.roofMat||M.tile,o.tymp||M.marbleShade,true);   // con alongX, primero la medida a lo largo de x (la cumbrera)
  if(o.paintings)o.paintings(g,gy);
  footprints.push({x:o.x,z:o.z,w:L,d:Dd,a,c:'#e4dac6',name:o.name});
  return {g,gy};
}

function blockBuilding(o){ // edificio cerrado con tejado a dos aguas
  const a=o.rot||0,gy=minGround(o.x,o.z,o.w,o.d,a);
  const g=new THREE.Group();g.position.set(o.x,gy,o.z);g.rotation.y=a;scene.add(g);
  box(o.w,o.h+3,o.d,o.mat||M.stone,0,(o.h+3)/2-3,0,g);
  if(o.socle)box(o.w+0.1,1.0,o.d+0.1,M.limestone,0,0.5,0,g);
  gableRoof(g,o.w+0.8,o.d+0.8,o.h,o.roofH||o.w*0.16,M.tile,o.mat||M.stone,o.ridgeX);
  if(o.door){box(2.2,3,0.2,M.dark,0,1.5,o.d/2+0.05,g);}
  addBox(o.x,o.z,o.w,o.d,a);
  footprints.push({x:o.x,z:o.z,w:o.w,d:o.d,a,c:'#d6c6a6',name:o.name});
  return {g,gy};
}

// recinto sin techo (muros perimetrales con una entrada en el lado +x local)
function enclosure(o){
  const a=o.rot||0,gy=minGround(o.x,o.z,o.w,o.d,a),h=o.h||3.5,t=o.t||0.9,mat=o.mat||texMat(TEX.polygonal,6,1),gap=o.gap||4;
  const g=new THREE.Group();g.position.set(o.x,gy,o.z);g.rotation.y=a;scene.add(g);
  const W=o.w,Dd=o.d;const seg=(x1,z1,x2,z2)=>{const p=toW(x1,z1,o.x,o.z,a),q=toW(x2,z2,o.x,o.z,a);addSeg(p[0],p[1],q[0],q[1],t/2);};
  box(W,h+2,t,mat,0,h/2-1,-Dd/2,g);seg(-W/2,-Dd/2,W/2,-Dd/2);
  box(W,h+2,t,mat,0,h/2-1,Dd/2,g);seg(-W/2,Dd/2,W/2,Dd/2);
  box(t,h+2,Dd,mat,-W/2,h/2-1,0,g);seg(-W/2,-Dd/2,-W/2,Dd/2);
  const sl=(Dd-gap)/2;box(t,h+2,sl,mat,W/2,h/2-1,-Dd/2+sl/2,g);box(t,h+2,sl,mat,W/2,h/2-1,Dd/2-sl/2,g);seg(W/2,-Dd/2,W/2,-gap/2);seg(W/2,gap/2,W/2,Dd/2);
  footprints.push({x:o.x,z:o.z,w:W,d:Dd,a,c:o.mapC||'#c9b48b',name:o.name});
  return {g,gy};
}

function stele(x,z,a,id){
  const gy=floorAt(x,z);const g=new THREE.Group();g.position.set(x,gy,z);g.rotation.y=a;scene.add(g);
  box(0.8,0.3,0.5,M.stone,0,0.15,0,g);box(0.6,1.5,0.18,M.marble,0,1.05,0,g);
  const ped=new THREE.Mesh(GABLE,[M.marble,M.red]);ped.scale.set(0.7,0.22,0.2);ped.position.y=1.8;g.add(ped);
  const mk=new THREE.Mesh(new THREE.OctahedronGeometry(0.22),new THREE.MeshBasicMaterial({color:0xf0b45c,fog:false}));mk.position.y=2.6;g.add(mk);
  addCirc(x,z,0.45);
  return {g,mk};
}

