// ============================================================ ROMA: constructores
const TRAV=lam('#d8ccb0'),TRAV2=lam('#c9bc9f'),BRICK=lam('#a8624a'),TUFA=lam('#8f8678'),PLAST=lam('#e3d8c2'),BRONZE2=lam('#7d6a3e'),LEAD=lam('#7d7d74');
const RTEX={
 rinceau:canvasTex(256,32,(x)=>{x.fillStyle='#ece3d2';x.fillRect(0,0,256,32);x.strokeStyle='#b9ad94';x.lineWidth=2.5;x.beginPath();for(let i=0;i<8;i++){const o=i*32;x.moveTo(o,16);x.bezierCurveTo(o+8,4,o+16,4,o+16,16);x.bezierCurveTo(o+16,28,o+24,28,o+32,16);}x.stroke();x.fillStyle='#c4b79c';for(let i=0;i<8;i++){x.beginPath();x.arc(i*32+8,10,3,0,TAU);x.fill();x.beginPath();x.arc(i*32+24,22,3,0,TAU);x.fill();}}),
 arcade:canvasTex(128,128,(x)=>{x.fillStyle='#d6c9ab';x.fillRect(0,0,128,128);x.fillStyle='#3a3026';for(let i=0;i<2;i++)for(let j=0;j<2;j++){const ox=i*64+12,oy=j*64+14;x.beginPath();x.moveTo(ox,oy+46);x.lineTo(ox,oy+18);x.arc(ox+20,oy+18,20,Math.PI,0);x.lineTo(ox+40,oy+46);x.closePath();x.fill();}x.fillStyle='#c4b697';x.fillRect(0,60,128,5);x.fillRect(0,124,128,4);}),
 windows:canvasTex(128,128,(x)=>{x.fillStyle='#b8735a';x.fillRect(0,0,128,128);x.fillStyle='#2e241c';for(let i=0;i<4;i++)for(let j=0;j<4;j++)x.fillRect(i*32+10,j*32+8,12,16);x.fillStyle='#c98a6c';for(let j=0;j<4;j++)x.fillRect(0,j*32+28,128,2);}),
 brick:canvasTex(64,64,(x)=>{x.fillStyle='#a8624a';x.fillRect(0,0,64,64);x.strokeStyle='#8a4c38';x.lineWidth=1;for(let r=0;r<16;r++){x.beginPath();x.moveTo(0,r*4);x.lineTo(64,r*4);x.stroke();}}),
 seats:canvasTex(64,64,(x)=>{x.fillStyle='#d9cfba';x.fillRect(0,0,64,64);})
};
// anillos de gradas o muros: P(u,k) da el punto [x,y,z] del anillo k en la fracción u del perímetro; skip(u) deja huecos (vomitorios, puertas)
function ringGeo(K,N,P,skip,colOf,uvU){
  const pos=[],col=[],uv=[],c=new THREE.Color();
  for(let k=0;k<K-1;k++){c.set(colOf?colOf(k):'#d8ccb0');
    for(let i=0;i<N;i++){const u0=i/N,u1=(i+1)/N;if(skip&&skip((u0+u1)/2,k))continue;
      const a=P(u0,k),b=P(u1,k),e=P(u1,k+1),d=P(u0,k+1);pos.push(...a,...b,...e,...a,...e,...d);for(let j=0;j<6;j++)col.push(c.r,c.g,c.b);
      if(uvU){const U0=u0*uvU,U1=u1*uvU,V0=k/(K-1),V1=(k+1)/(K-1);uv.push(U0,V0,U1,V0,U1,V1,U0,V0,U1,V1,U0,V1);}}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));if(uvU)g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;
}
const RING_M=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});
function ringMesh(geo,x,y,z,a){const m=new THREE.Mesh(geo,RING_M);m.position.set(x,y,z);m.rotation.y=a||0;m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;}
// escalera frontal: n peldaños de 'rise' desde gy hasta gy+H, de anchura w, a partir de z0 hacia +z local
function stairs(g,o,lx,z0,w,H,gy,a,mat){const n=Math.max(1,Math.ceil(H/0.32)),rise=H/n,run=0.42;
  for(let i=0;i<n;i++){const top=H-i*rise,zc=z0+i*run+run/2;box(w,top+2,run+0.02,mat||TRAV,lx,top/2-1,zc,g);const wp=toW(lx,zc,o.x,o.z,a);addPlat(wp[0],wp[1],w,run,a,gy+top);}
  return z0+n*run;}
function wsegO(o,a,x1,z1,x2,z2,t){const p=toW(x1,z1,o.x,o.z,a),q=toW(x2,z2,o.x,o.z,a);addSeg(p[0],p[1],q[0],q[1],t||0.4);}
// templo romano: podio alto con escalinata solo delante, pórtico profundo y cella cerrada (columnas adosadas si pseudo)
function romanTemple(o){
  const a=o.rot||0,W=o.W,L=o.L,P=o.pod||3.5,cr=o.colD/2,colH=o.colH,ord=o.order||'corinthian';
  const sN=Math.ceil(P/0.32)*0.42;
  const gy=o.gy!==undefined?o.gy:minGround(o.x,o.z,W+2,L+2,a)-0.2;
  const g=grp(o.x,gy,o.z,a);
  box(W,P+6,L,o.podMat||TRAV,0,P/2-3,0,g);box(W+0.6,0.5,L+0.6,o.podMat||TRAV,0,P-0.25,0,g);box(W+0.5,0.6,L+0.5,o.podMat||TRAV,0,0.3,0,g);
  addPlat(o.x,o.z,W,L,a,gy+P);
  const sw=o.stairW||W*0.86;stairs(g,o,0,L/2,sw,P,gy,a,o.podMat);
  wsegO(o,a,-W/2,-L/2,W/2,-L/2);wsegO(o,a,-W/2,-L/2,-W/2,L/2);wsegO(o,a,W/2,-L/2,W/2,L/2);wsegO(o,a,-W/2,L/2,-sw/2,L/2);wsegO(o,a,sw/2,L/2,W/2,L/2);
  wsegO(o,a,-sw/2,L/2,-sw/2,L/2+sN,0.2);wsegO(o,a,sw/2,L/2,sw/2,L/2+sN,0.2);
  const m=cr*1.15,nW=o.nW,ia=(W-2*m)/(nW-1),deep=o.deep||Math.max(2,Math.round(L*0.33/ia)+1),cellaZ=L/2-m-(deep-1)*ia-ia*0.6;
  const cols=[];for(let i=0;i<nW;i++)for(let j=0;j<deep;j++){if(j>0&&i>0&&i<nW-1&&!o.fullPorch)continue;cols.push([-W/2+m+i*ia,L/2-m-j*ia,false]);}
  if(o.peri){for(let z=L/2-m-deep*ia;z>-L/2+m-0.1;z-=ia){cols.push([-W/2+m,z,false]);cols.push([W/2-m,z,false]);}if(o.peri==='all')for(let i=1;i<nW-1;i++)cols.push([-W/2+m+i*ia,-L/2+m,false]);}
  const cw=o.peri?W-2*m-ia*0.9:W-0.2;
  if(!o.peri&&o.pseudo){for(let z=cellaZ-ia;z>-L/2+m-0.1;z-=ia){cols.push([-cw/2,z,true]);cols.push([cw/2,z,true]);}}
  for(const c of cols){const wp=toW(c[0],c[1],o.x,o.z,a);addColumn(wp[0],gy+P,wp[1],cr,colH,a,ord,c[2]);}
  const cl=cellaZ+L/2-(o.peri==='all'?m*2:0.1),cz=cellaZ-cl/2,hh=colH;
  wsegO(o,a,-cw/2,cellaZ,-cw/2,cellaZ-cl);wsegO(o,a,cw/2,cellaZ,cw/2,cellaZ-cl);wsegO(o,a,-cw/2,cellaZ-cl,cw/2,cellaZ-cl);
  const hollow=!o.solid&&cw>7&&cl>8&&tpRule(o.name);
  if(!hollow){box(cw,hh,cl,o.cellaMat||M.marbleShade,0,P+hh/2,cz,g);box(4.2,hh*0.7,0.1,M.dark,0,P+hh*0.35,cellaZ+0.06,g);box(3.6,hh*0.6,0.12,BRONZE2,0,P+hh*0.3,cellaZ+0.08,g);wsegO(o,a,-cw/2,cellaZ,cw/2,cellaZ);}
  else{// cella hueca: se puede entrar a ver la estatua de culto
   const cm=o.cellaMat||M.marbleShade,tw=0.8,dw=Math.min(4.4,cw*0.4),sw2=(cw-dw)/2,H2=hh+(o.entH||colH*0.24)*0.4;
   box(tw,H2,cl,cm,-cw/2+tw/2,P+H2/2,cz,g);box(tw,H2,cl,cm,cw/2-tw/2,P+H2/2,cz,g);box(cw,H2,tw,cm,0,P+H2/2,cellaZ-cl+tw/2,g);
   box(sw2,H2,tw,cm,-cw/2+sw2/2,P+H2/2,cellaZ-tw/2,g);box(sw2,H2,tw,cm,cw/2-sw2/2,P+H2/2,cellaZ-tw/2,g);box(dw,H2-hh*0.72,tw,cm,0,P+hh*0.72+(H2-hh*0.72)/2,cellaZ-tw/2,g);
   for(const s of[-1,1]){const d=box(dw/2,hh*0.72,0.15,BRONZE2,0,P+hh*0.36,0,g);d.position.set(s*(dw/2+dw*0.18),P+hh*0.36,cellaZ+dw*0.2);d.rotation.y=s*1.15;}
   box(cw-2*tw,0.1,cl-2*tw,M.marble,0,P+0.05,cz,g);box(cw-0.2,0.2,cl-0.2,M.marbleShade,0,P+H2-0.1,cz,g);
   wsegO(o,a,-cw/2,cellaZ,-dw/2,cellaZ);wsegO(o,a,dw/2,cellaZ,cw/2,cellaZ);
   tpDecorate(o,g,cw-2*tw,cellaZ-cl+tw,cellaZ-tw,P,hh,null,true);}
  tpDecorate(o,null,0,0,0,0,0,toW(W*0.36,L/2+sN+4,o.x,o.z,a),true);
  const e=o.entH||colH*0.24,top=entablature(g,W,L,P+colH,e,{ionic:true,friezeTex:RTEX.rinceau});
  coffered(g,W-0.4,L-0.4,P+colH+e*0.4-0.12);
  gableRoof(g,W+0.7,L+0.7,top,o.pedH||W*0.2,o.roofMat||M.tile,o.tymp||PLAST);
  ROMA.peds.push({x:o.x,z:o.z,a,W,L,y:gy+top,ph:o.pedH||W*0.2,gold:!!(o.name&&o.name.includes('Júpiter'))});   // estatuas del frontón: romaDecor()
  footprints.push({x:o.x,z:o.z,w:W,d:L,a,c:'#efe7d8',name:o.name});
  return{g,gy,top:gy+P};
}
// templo redondo (Vesta, Hércules): podio circular, anillo de columnas, cella cilíndrica y tejado cónico
function roundTemple(o){
  const gy=minGround(o.x,o.z,o.r*2,o.r*2,0)-0.1,P=o.pod||2,g=grp(o.x,gy,o.z,o.rot||0);
  const pod=new THREE.Mesh(new THREE.CylinderGeometry(o.r+0.6,o.r+0.8,P+4,32),TRAV);pod.position.y=P/2-2;g.add(pod);addPlat(o.x,o.z,o.r*1.4,o.r*1.4,0,gy+P);
  stairs(g,{x:o.x,z:o.z},0,o.r+0.2,3.6,P,gy,o.rot||0);
  const n=o.n||20;for(let i=0;i<n;i++){const t=i/n*TAU;addColumn(o.x+Math.cos(t)*(o.r-0.5),gy+P,o.z+Math.sin(t)*(o.r-0.5),o.colD/2,o.colH,t,'corinthian');}
  const ce=new THREE.Mesh(new THREE.CylinderGeometry(o.r*0.62,o.r*0.62,o.colH,24),M.marbleShade);ce.position.y=P+o.colH/2;ce.castShadow=true;g.add(ce);addCirc(o.x,o.z,o.r*0.65);
  const ent=new THREE.Mesh(new THREE.CylinderGeometry(o.r+0.2,o.r+0.2,1.1,32),M.marble);ent.position.y=P+o.colH+0.55;g.add(ent);
  const rf=new THREE.Mesh(new THREE.ConeGeometry(o.r+0.9,o.r*0.55,32),o.roofMat||BRONZE2);rf.position.y=P+o.colH+1.1+o.r*0.275;rf.castShadow=true;g.add(rf);
  tpDecorate(o,null,0,0,0,0,0,toW(o.r*0.7,o.r+5,o.x,o.z,o.rot||0),MODE==='roma');
  footprints.push({x:o.x,z:o.z,r:o.r,c:'#efe7d8',name:o.name});return g;
}
// basílica: pórtico de dos pisos en la fachada (+z local) y nave alta detrás
function basilica(o){
  const a=o.rot||0,L=o.L,D=o.D,gy=minGround(o.x,o.z,L,D,a)-0.1,g=grp(o.x,gy,o.z,a),pd=7,h1=8.5,h2=7.5,base=1.2;
  box(L+2,base+4,D+2,TRAV,0,base/2-2,0,g);addPlat(o.x,o.z,L+2,D+2,a,gy+base);
  const n=Math.round(L/5.2)+1,ia=(L-1.6)/(n-1);
  for(let i=0;i<n;i++){const lx=-L/2+0.8+i*ia,wp=toW(lx,D/2-0.8,o.x,o.z,a);addColumn(wp[0],gy+base,wp[1],0.48,h1,a,'doric');addColumn(wp[0],gy+base+h1+1.6,wp[1],0.4,h2,a,'ionic',true);}
  box(L,1.6,pd,M.marbleShade,0,base+h1+0.8,D/2-pd/2,g);box(L+0.3,1.2,pd+0.3,M.marbleShade,0,base+h1+1.6+h2+0.6,D/2-pd/2,g);
  if(o.hollow)basilicaInterior(o,g,gy,base,h1,h2,pd);else box(L-1,h1+h2+12,D-pd,PLAST,0,base+(h1+h2+12)/2,-pd/2,g);   // la Basílica Julia se puede visitar (172_interiores_roma.js)
  for(const s of[-1,1])box(0.9,(h1+h2+3),pd,PLAST,s*(L/2-0.45),base+(h1+h2+3)/2,D/2-pd/2,g);
  const pr=new THREE.Mesh(GABLE,[M.tile,PLAST]);pr.rotation.y=Math.PI/2;pr.scale.set(pd+0.6,1.4,L);pr.position.set(0,base+h1+h2+3.2,D/2-pd/2);g.add(pr);ROOFS.push({r:pr,mat:M.tile,fancy:false});
  gableRoof(g,L+0.6,D-pd+1,base+h1+h2+12,5,M.tile,PLAST,true).position.z=-pd/2;   // centrado sobre la nave (antes iba 3,5 m adelantado: dejaba un hueco de cielo detrás)
  for(let i=0;i<Math.floor(L/6);i++)box(1.8,2.6,0.2,M.dark,-L/2+4+i*6,base+h1+h2+7,-pd/2+(D-pd)/2+0.06,g);
  wsegO(o,a,-L/2+0.5,-D/2,L/2-0.5,-D/2);if(!o.hollow)wsegO(o,a,-L/2+0.5,D/2-pd,L/2-0.5,D/2-pd);wsegO(o,a,-L/2+0.5,-D/2,-L/2+0.5,D/2-0.6);wsegO(o,a,L/2-0.5,-D/2,L/2-0.5,D/2-0.6);
  footprints.push({x:o.x,z:o.z,w:L,d:D,a,c:'#e4dac6',name:o.name});return{g,gy};
}
// pórtico de columnas (para foros y patios): fila de columnas con techo de una vertiente apoyado en un muro trasero
function porticus(x1,z1,x2,z2,depth,colH,ord,side,gy0,wallMat){
  const L=Math.hypot(x2-x1,z2-z1),a=Math.atan2(z2-z1,x2-x1),rot=-a,mx=(x1+x2)/2,mz=(z1+z2)/2;
  const gy=gy0!==undefined?gy0:minGround(mx,mz,L,depth,rot)-0.05,g=grp(mx,gy,mz,rot),s=side||1,n=Math.max(2,Math.round(L/4.2)),ia=L/n;
  box(L,0.6+3,depth,TRAV,0,0.3-1.5,0,g);addPlat(mx,mz,L,depth,rot,gy+0.6);
  for(let i=0;i<=n;i++){const wp=toW(-L/2+i*ia,s*depth/2-s*0.6,mx,mz,rot);addColumn(wp[0],gy+0.6,wp[1],0.42,colH,rot,ord||'corinthian');}
  box(L,colH+2.5,0.8,wallMat||PLAST,0,0.6+(colH+2.5)/2,-s*depth/2,g);const wa=toW(-L/2,-s*depth/2,mx,mz,rot),wb=toW(L/2,-s*depth/2,mx,mz,rot);addSeg(wa[0],wa[1],wb[0],wb[1],0.4);
  box(L,1.1,depth,M.marbleShade,0,0.6+colH+0.55,0,g);
  const rf=box(L+0.4,0.35,depth+1.2,M.tile,0,0.6+colH+1.6,0,g);rf.rotation.x=s*0.16;
  return g;
}
// teatro: gradas en semicírculo hacia -z local y escena hacia +z
function theatre(o){
  const a=o.rot||0,gy=terrainH(o.x,o.z),R0=o.R0,R1=o.R1,H=o.H,steps=24,N=40;
  const P=(u,k)=>{const t=Math.PI+u*Math.PI;let r,y;if(k===0){r=R0;y=0;}else if(k===1){r=R0;y=1.2;}else{const s=Math.floor((k-2)/2),e=(k-2)%2;r=R0+2+(R1-R0-6)*(s+e)/steps;y=1.2+(H-6)*(s+1)/steps;}return[Math.cos(t)*r,y,Math.sin(t)*r];};
  ringMesh(ringGeo(2+steps*2+1,N,P,null,k=>k%2?'#e2d9c6':'#cfc3aa'),o.x,gy,o.z,a);
  // muro exterior con arcadas de dos pisos
  const nb=Math.round(Math.PI*R1/6.8),geoK=['B_bay_tus','B_bay_ion'],items=[[],[]];
  for(let i=0;i<nb;i++){const t=Math.PI+(i+0.5)/nb*Math.PI,lx=Math.cos(t)*(R1-1),lz=Math.sin(t)*(R1-1),wp=toW(lx,lz,o.x,o.z,a),ra=a+Math.atan2(Math.cos(t),Math.sin(t));
    items[0].push({x:wp[0],y:gy,z:wp[1],a:ra,sx:Math.PI*R1/nb/7.3});items[1].push({x:wp[0],y:gy+10.5,z:wp[1],a:ra,sx:Math.PI*R1/nb/7.3});
    const pp=toW(Math.cos(Math.PI+i/nb*Math.PI)*(R1-1),Math.sin(Math.PI+i/nb*Math.PI)*(R1-1),o.x,o.z,a);addCirc(pp[0],pp[1],1.3);}
  if(GLB.ok&&GLB.parts.B_bay_tus){placeModules('B_bay_tus',items[0],{far:2200});placeModules('B_bay_ion',items[1],{far:2200});}
  else{const w=new THREE.Mesh(new THREE.CylinderGeometry(R1,R1,22,32,1,true,Math.PI/2,Math.PI),texMat(RTEX.arcade,16,2));w.material.side=THREE.DoubleSide;w.position.set(o.x,gy+11,o.z);w.rotation.y=a;scene.add(w);}
  const wall=ringGeo(2,N,(u,k)=>{const t=Math.PI+u*Math.PI;return[Math.cos(t)*(R1-5),k?H:0,Math.sin(t)*(R1-5)];},null,()=> '#bfb39a');ringMesh(wall,o.x,gy,o.z,a);
  for(let i=0;i<N;i++){const t0=Math.PI+i/N*Math.PI,t1=Math.PI+(i+1)/N*Math.PI;wsegO(o,a,Math.cos(t0)*(R1-5),Math.sin(t0)*(R1-5),Math.cos(t1)*(R1-5),Math.sin(t1)*(R1-5),0.6);}
  // escena: frente de columnas en dos pisos
  // escena: muro de ladrillo con cornisa (por detrás, la fachada que daba a la calle o al pórtico)
  const g=grp(o.x,gy,o.z,a),sw=R1*1.7,scM=texMat(RTEX.brick,Math.max(2,sw/5),Math.max(1,(H+2)/3));box(sw,H+2,7,scM,0,(H+2)/2,R0+5,g);box(sw+0.8,0.7,7.8,M.marble,0,H+2.35,R0+5,g);box(R0*2.2,1.2,8,M.wood,0,0.6,R0+0.5,g);
  // en ladera: subestructura de piedra bajo la cávea, la orquesta y la escena hasta el punto más bajo del terreno (antes flotaban)
  {let mn=gy;for(let i=0;i<=16;i++)for(const rr of[R0,(R0+R1)/2,R1]){const t=Math.PI+i/16*Math.PI,w=toW(Math.cos(t)*rr,Math.sin(t)*rr,o.x,o.z,a);mn=Math.min(mn,terrainH(w[0],w[1]));}
   for(const lx of[-sw/2,0,sw/2])for(const lz of[0,R0+8.5]){const w=toW(lx,lz,o.x,o.z,a);mn=Math.min(mn,terrainH(w[0],w[1]));}
   const dh=gy-mn+0.3;if(dh>0.8){const sm=M.stone,cy=new THREE.Mesh(new THREE.CylinderGeometry(R1,R1,dh,32,1,false,Math.PI/2,Math.PI),sm);cy.position.set(o.x,gy-dh/2,o.z);cy.rotation.y=a;scene.add(cy);
    box(sw,dh,R0+8.5,sm,0,-dh/2,(R0+8.5)/2,g);box(R1*2,dh,1,sm,0,-dh/2,0,g);}}
  for(const[dx,w]of[[0,3.4],[-R0*0.55,2.6],[R0*0.55,2.6]]){box(w,w*1.7,0.2,M.dark,dx,1.2+w*0.85,R0+1.45,g);box(w+0.8,0.5,0.4,M.marble,dx,1.2+w*1.7+0.25,R0+1.4,g);}   // las tres puertas de la escena
  for(let i=0;i<12;i++){const lx=-sw*0.42+i*sw*0.84/11;for(const lv of[0,1]){const wp=toW(lx,R0+1.2,o.x,o.z,a);addColumn(wp[0],gy+1.2+lv*(H*0.45),wp[1],0.4,H*0.42,a,'corinthian',true);}}
  // Los extremos de la cávea: en los teatros griegos, muros de contención (analémmata) que sujetaban la tierra de la ladera; en los romanos, el muro de los tribunalia sobre las bóvedas. Nunca se veía la sección hueca de las gradas.
  {const pr=[[R0,0],[R0,1.2]];for(let s=0;s<steps;s++){const y=1.2+(H-6)*(s+1)/steps;pr.push([R0+2+(R1-R0-6)*s/steps,y],[R0+2+(R1-R0-6)*(s+1)/steps,y]);}const Ht=Math.max(H,GLB.ok&&GLB.parts.B_bay_tus?21:22);pr.push([R1-5,H],[R1-5,Ht],[R1,Ht]);
   const pos=[];for(const sg of[-1,1])for(let i=0;i<pr.length-1;i++){const[r0,y0]=pr[i],[r1,y1]=pr[i+1];pos.push(sg*r0,0,0,sg*r1,0,0,sg*r1,y1,0,sg*r0,0,0,sg*r1,y1,0,sg*r0,y0,0);}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(pos.filter((v,i)=>i%3!==2).map((v,i)=>i%2?v/10:Math.abs(v)/14),2));geo.computeVertexNormals();const emM=new THREE.MeshLambertMaterial({color:'#cdbfa4',side:THREE.DoubleSide});const em=new THREE.Mesh(geo,emM);em.position.set(o.x,gy,o.z);em.rotation.y=a;em.receiveShadow=true;scene.add(em);
   for(const sg of[-1,1])wsegO(o,a,sg*(R0+2.5),0.7,sg*(R1-5),0.7,0.3);}
  wsegO(o,a,-sw/2,R0+1.5,sw/2,R0+1.5);   // los pasillos laterales (párodos) quedan abiertos: se entra a la orquesta para ver la función
  ROMA.theatres.push({x:o.x,z:o.z,a,gy,R0,R1,H,name:o.name});
  CAVEAS.push({k:'t',x:o.x,z:o.z,a,gy,R0,R1,H,steps,rr:R1+1});   // las gradas se pisan y se suben   // todos tienen funciones (ROMA_PLAYS, por nombre del teatro)
  // huella circular: cubre la cávea y la escena sea cual sea el giro (la rectangular no giraba y dejaba entrar casas en el teatro)
  footprints.push({x:o.x,z:o.z,r:R1+1,c:'#e4dac6',name:o.name});
  return g;
}
// puente: tablero de piedra sobre arcos entre dos orillas, con rampas suaves a ambos lados
function bridge(z,xA,xB,w,wood){
  const L=Math.abs(xB-xA),mx=(xA+xB)/2,top=Math.max(romaH(xA,z),romaH(xB,z),2.2)+0.35,g=grp(mx,0,z,0),mat=wood?M.wood:TRAV;
  box(L,1.2,w,mat,0,top-0.6,0,g);for(const s of[-1,1]){box(L,1,0.5,mat,0,top+0.5,s*(w/2-0.25),g);addSeg(xA,z+s*(w/2-0.25),xB,z+s*(w/2-0.25),0.3);}
  addPlat(mx,z,L,w,0,top);
  const np=Math.max(2,Math.round(L/(wood?7:16)));for(let i=1;i<np;i++){const px=-L/2+i*L/np;box(wood?0.6:4,top+6,wood?w*0.8:w,mat,px,top/2-4,0,g);}
  for(const[xe,sg]of[[xA,Math.sign(xA-xB)],[xB,Math.sign(xB-xA)]]){for(let k=1;k<=6;k++){const ex=xe+sg*k*2,t=top-k*0.35;if(t<romaH(ex,z)-0.2)break;addPlat(ex,z,2.1,w,0,t);box(2.1,1,w,mat,ex-mx,t-0.5,0,g);}}
  footprints.push({x:mx,z,w:L,d:w,a:0,c:'#cfc3a8'});return g;
}
// candelabro de siete brazos (menorá), del botín de Jerusalén
function menorah(x,z,a){const g=grp(x,floorAt(x,z),z,a),gold=M.gold;
  box(1.6,0.5,0.9,M.marble,0,0.25,0,g);box(0.9,0.5,0.6,gold,0,0.75,0,g);const st=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,2.2,8),gold);st.position.y=2.1;g.add(st);
  for(const r of[0.32,0.62,0.92]){const t=new THREE.Mesh(new THREE.TorusGeometry(r,0.05,6,20,Math.PI),gold);t.rotation.z=Math.PI;t.position.y=2.75;g.add(t);for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,r+0.05,6),gold);c.position.set(s*r,2.75+(r+0.05)/2,0);g.add(c);}}
  for(let i=-3;i<=3;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.16,6),FLAME_M);f.position.set(i*0.307,i===0?3.9:2.75+[0,0.37,0.67,0.97][Math.abs(i)]+0.12,0);g.add(f);}
  addCirc(x,z,0.9);return g;}


