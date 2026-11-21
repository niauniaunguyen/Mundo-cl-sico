// ============================================================ campos del Ática y de la campiña romana
// parcelas de 60 x 45 m algo giradas: 1 trigo, 2 forraje, 3 barbecho arado, 4 viña, 5 olivar
const FIELD_C=[null,new THREE.Color('#c8b36a'),new THREE.Color('#8e9a50'),new THREE.Color('#9a7b56'),new THREE.Color('#8f8a58'),new THREE.Color('#a29a6a')];
const FCELL={u:60,v:45,a:0.3};
function fieldCell(x,z){const c=Math.cos(FCELL.a),s=Math.sin(FCELL.a),u=x*c+z*s,v=-x*s+z*c;return{i:Math.floor(u/FCELL.u),j:Math.floor(v/FCELL.v),fu:u/FCELL.u-Math.floor(u/FCELL.u),fv:v/FCELL.v-Math.floor(v/FCELL.v)};}
function fieldOk(x,z){
  if(MODE==='roma')return romaFieldOk(x,z);
  if(nearRiver(x,z))return false;
  if(insideWalls(x,z,-25))return false;if(roadDist(x,z)<7)return false;
  for(const p of[ACADEMY,LYCEUM,CYNO])if(Math.hypot(x-p.x,z-p.z)<140)return false;
  for(const T of ROMA.theatres)if(Math.hypot(x-T.x,z-T.z)<T.R1+10)return false;   // teatros griegos de fuera de la ciudad (el del Pireo)
  const h=rawH(x,z);if(h<1||h>70)return false;
  return Math.abs(rawH(x+4,z)-rawH(x-4,z))+Math.abs(rawH(x,z+4)-rawH(x,z-4))<2.4;
}
function fieldType(i,j){const h=hash(i*1.73+11,j*2.31+7);return h<0.26?1:h<0.42?2:h<0.55?3:h<0.66?4:h<0.78?5:0;}
function fieldAt(x,z){const f=fieldCell(x,z);if(f.fu<0.05||f.fu>0.95||f.fv<0.06||f.fv>0.94)return 0;if(!fieldOk(x,z))return 0;return fieldType(f.i,f.j);}
function flutedShaft(n,depth,rt){const g=new THREE.CylinderGeometry(rt,1,1,n*2,1);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);if(Math.hypot(x,z)<0.01)continue;const k=1-depth*(0.5+0.5*Math.cos(Math.atan2(z,x)*n));p.setX(i,x*k);p.setZ(i,z*k);}g.computeVertexNormals();g.translate(0,0.5,0);return g;}
function finishColumns(){
  const mm=new THREE.Matrix4(),q=new THREE.Quaternion(),q2=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),off=new THREE.Vector3();
  // cada pieza se reparte en zonas con chunked(): three.js descarta las que quedan fuera de la vista y frame() las lejanas
  const pend=[],mk=(geo,mat)=>{const o={geo,mat,list:[],setMatrixAt(i,m){this.list[i]={m:m.clone()};}};pend.push(o);return o;};
  // corintio (Roma): basa ática, fuste estriado y capitel de acanto de 2,3 radios de alto; sin modelos, se dibuja como jónico
  if(glbGeo('C_corinthian_capital')&&CCOLS.length){const n=CCOLS.length,base=mk(glbGeo('C_ionic_base'),M.marble,n),sh=mk(glbGeo('C_ionic_shaft'),M.marble,n),cap=mk(glbGeo('C_corinthian_capital'),M.marble,n);
    CCOLS.forEach((c,i)=>{const[x,y,z,r,h,a]=c;q.setFromAxisAngle(up,a);const ch=2.3*r,bh=0.56*r;
      p.set(x,y,z);s.set(r,r,r);mm.compose(p,q,s);base.setMatrixAt(i,mm);
      p.set(x,y+bh,z);s.set(r,h-bh-ch,r);mm.compose(p,q,s);sh.setMatrixAt(i,mm);
      p.set(x,y+h-ch,z);s.set(r,r,r);mm.compose(p,q,s);cap.setMatrixAt(i,mm);});}
  else{ICOLS.push(...CCOLS);}
  // dórico: fuste con 20 estrías y éntasis, equino y ábaco
  {const n=COLS.length,sh=mk(glbGeo('C_doric_shaft')||flutedShaft(20,0.045,0.8),M.marble,n),ech=mk(glbGeo('C_doric_echinus')||new THREE.LatheGeometry(V2([[0.78,0],[0.98,0.08],[1.18,0.2],[1.3,0.32]]),24),M.marble,n),ab=mk(new THREE.BoxGeometry(1,1,1),M.marbleShade,n);
   COLS.forEach((c,i)=>{const[x,y,z,r,h,a]=c;q.setFromAxisAngle(up,a);
     p.set(x,y,z);s.set(r,h-0.62*r/0.95,r);mm.compose(p,q,s);sh.setMatrixAt(i,mm);
     p.set(x,y+h-0.62*r/0.95,z);s.set(r,r/0.95,r);mm.compose(p,q,s);ech.setMatrixAt(i,mm);
     p.set(x,y+h-0.3*r/0.95,z);s.set(r*2.7,0.3*r/0.95,r*2.7);mm.compose(p,q,s);ab.setMatrixAt(i,mm);});}
  // jónico con modelos de Blender: basa ática, fuste con filetes y capitel completo (volutas en espiral) en una sola pieza
  if(glbGeo('C_ionic_capital')){const n=ICOLS.length,base=mk(glbGeo('C_ionic_base'),M.marble,n),sh=mk(glbGeo('C_ionic_shaft'),M.marble,n),cap=mk(glbGeo('C_ionic_capital'),M.marble,n);
   ICOLS.forEach((c,i)=>{const[x,y,z,r,h,a]=c;q.setFromAxisAngle(up,a);const ch=1.0*r,bh=0.56*r;
     p.set(x,y,z);s.set(r,r,r);mm.compose(p,q,s);base.setMatrixAt(i,mm);
     p.set(x,y+bh,z);s.set(r,h-bh-ch,r);mm.compose(p,q,s);sh.setMatrixAt(i,mm);
     p.set(x,y+h-ch,z);s.set(r,r,r);mm.compose(p,q,s);cap.setMatrixAt(i,mm);});}
  // jónico: basa ática, fuste con 24 estrías profundas, volutas
  else{const n=ICOLS.length;
   const base=mk(new THREE.LatheGeometry(V2([[1.45,0],[1.45,0.1],[1.3,0.2],[1.12,0.28],[1.2,0.42],[1.05,0.52],[1.0,0.56]]),24),M.marble,n);
   const sh=mk(flutedShaft(24,0.07,0.86),M.marble,n);
   const ech=mk(new THREE.LatheGeometry(V2([[0.86,0],[1.0,0.12],[1.05,0.22]]),20),M.marble,n);
   const volG=new THREE.CylinderGeometry(0.42,0.42,1.25,16);volG.rotateX(Math.PI/2);
   const vol=mk(volG,M.marble,n*2),cush=mk(new THREE.BoxGeometry(1,1,1),M.marble,n),ab=mk(new THREE.BoxGeometry(1,1,1),M.marbleShade,n);
   ICOLS.forEach((c,i)=>{const[x,y,z,r,h,a]=c;q.setFromAxisAngle(up,a);const cap=1.0*r,bh=0.56*r;
     p.set(x,y,z);s.set(r,r,r);mm.compose(p,q,s);base.setMatrixAt(i,mm);
     p.set(x,y+bh,z);s.set(r,h-bh-cap,r);mm.compose(p,q,s);sh.setMatrixAt(i,mm);
     p.set(x,y+h-cap,z);s.set(r,r,r);mm.compose(p,q,s);ech.setMatrixAt(i,mm);
     p.set(x,y+h-cap*0.55,z);s.set(r*2.5,r*0.42,r*1.25);mm.compose(p,q,s);cush.setMatrixAt(i,mm);
     for(let k=0;k<2;k++){off.set((k?1:-1)*1.25*r,0,0).applyQuaternion(q);p.set(x+off.x,y+h-cap*0.62,z+off.z);s.set(r,r,r);mm.compose(p,q,s);vol.setMatrixAt(i*2+k,mm);}
     p.set(x,y+h-0.12*r,z);s.set(r*2.6,0.24*r,r*2.6);mm.compose(p,q,s);ab.setMatrixAt(i,mm);});}
  // de cerca, las piezas de Blender; a más de 260 m, un cilindro de 10 lados con las mismas medidas
  const lowOf=geo=>{if(geo.type==='BoxGeometry')return geo;if(!geo.boundingBox)geo.computeBoundingBox();const b=geo.boundingBox,r=Math.max(-b.min.x,b.max.x,-b.min.z,b.max.z),h=Math.max(0.01,b.max.y-b.min.y),g=new THREE.CylinderGeometry(r,r,h,10);g.translate(0,b.min.y+h/2,0);return g;};
  for(const o of pend){const l=o.list.filter(Boolean);if(!l.length)continue;const cl=MODE==='roma'?120:240,nr=MODE==='roma'?260:340;chunked(o.geo,o.mat,l,{cell:cl,far:nr,receive:true});chunked(lowOf(o.geo),o.mat,l,{cell:cl,near:nr,far:MODE==='roma'?1300:1700,shadow:false});}
}

// ============================================================ texturas pintadas (policromía)
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
const TEX={
  sima:canvasTex(256,32,(x)=>{x.fillStyle='#ece3d2';x.fillRect(0,0,256,32);x.fillStyle='#2b4479';x.fillRect(0,0,256,7);x.fillStyle='#a8392b';x.fillRect(0,26,256,6);x.strokeStyle='#b8862f';x.lineWidth=3;x.beginPath();for(let i=0;i<8;i++){const o=i*32+4;x.moveTo(o,22);x.lineTo(o,11);x.lineTo(o+22,11);x.lineTo(o+22,19);x.lineTo(o+11,19);x.lineTo(o+11,15);}x.stroke();}),
  procession:canvasTex(512,64,(x)=>{x.fillStyle='#2c4a84';x.fillRect(0,0,512,64);const r=mulberry32(5);x.fillStyle='#efe6d4';
    for(let i=0;i<9;i++){const o=i*57+r()*8;x.beginPath();x.ellipse(o+22,40,16,7,-0.15,0,TAU);x.fill();x.fillRect(o+33,22,5,14);x.beginPath();x.arc(o+38,20,4,0,TAU);x.fill();
      x.fillRect(o+10,44,3,16);x.fillRect(o+16,46,3,14);x.fillRect(o+28,46,3,14);x.fillRect(o+34,44,3,16);x.fillRect(o+19,20,5,14);x.beginPath();x.arc(o+21,17,3.5,0,TAU);x.fill();}
    x.fillStyle='#b8862f';x.fillRect(0,0,512,3);x.fillRect(0,61,512,3);}),
  eleusinian:canvasTex(512,64,(x)=>{x.fillStyle='#3a3a40';x.fillRect(0,0,512,64);const r=mulberry32(9);x.fillStyle='#f1ebe0';
    for(let i=0;i<16;i++){const o=i*32+r()*6;x.beginPath();x.arc(o+12,14,4,0,TAU);x.fill();x.fillRect(o+8,18,8,22);x.beginPath();x.moveTo(o+6,40);x.lineTo(o+18,40);x.lineTo(o+20,60);x.lineTo(o+4,60);x.fill();}}),
  coffers:canvasTex(64,64,(x)=>{x.fillStyle='#d9cfbd';x.fillRect(0,0,64,64);x.fillStyle='#2b4479';x.fillRect(6,6,52,52);x.fillStyle='#d9a93a';for(const[a,b]of[[32,32],[18,20],[46,44]]){x.beginPath();for(let k=0;k<5;k++){const t=k/5*TAU-Math.PI/2;x.lineTo(a+Math.cos(t)*5,b+Math.sin(t)*5);const t2=t+TAU/10;x.lineTo(a+Math.cos(t2)*2,b+Math.sin(t2)*2);}x.fill();}}),
  diamond:canvasTex(64,64,(x)=>{x.fillStyle='#a84f34';x.fillRect(0,0,64,64);x.strokeStyle='#6e2f1e';x.lineWidth=2;x.beginPath();x.moveTo(0,32);x.lineTo(32,0);x.lineTo(64,32);x.lineTo(32,64);x.closePath();x.stroke();x.beginPath();x.moveTo(-32,32);x.lineTo(0,0);x.moveTo(64,0);x.lineTo(96,32);x.stroke();}),
  nike:canvasTex(256,64,(x)=>{x.fillStyle='#ece3d2';x.fillRect(0,0,256,64);x.fillStyle='#c9bfae';for(let i=0;i<4;i++){const o=i*64;x.beginPath();x.ellipse(o+32,40,8,18,0,0,TAU);x.fill();x.beginPath();x.arc(o+32,16,5,0,TAU);x.fill();x.beginPath();x.moveTo(o+28,26);x.lineTo(o+8,8);x.lineTo(o+22,34);x.fill();x.beginPath();x.moveTo(o+36,26);x.lineTo(o+56,8);x.lineTo(o+42,34);x.fill();}}),
  mudbrick:canvasTex(64,32,(x)=>{x.fillStyle='#bfa57e';x.fillRect(0,0,64,32);x.strokeStyle='#a68b65';x.lineWidth=1;for(let r=0;r<4;r++){x.beginPath();x.moveTo(0,r*8);x.lineTo(64,r*8);x.stroke();for(let k=0;k<4;k++){const o=k*16+(r%2)*8;x.beginPath();x.moveTo(o,r*8);x.lineTo(o,r*8+8);x.stroke();}}}),
  polygonal:canvasTex(64,64,(x)=>{x.fillStyle='#b9a684';x.fillRect(0,0,64,64);x.strokeStyle='#8f7d5e';x.lineWidth=1.5;const r=mulberry32(3);for(let i=0;i<14;i++){x.beginPath();const cx=r()*64,cy=r()*64;for(let k=0;k<6;k++){const t=k/6*TAU+r()*0.4,rr=7+r()*6;x.lineTo(cx+Math.cos(t)*rr,cy+Math.sin(t)*rr);}x.closePath();x.stroke();}})
};
function texMat(t,rx,ry){const tt=t.clone();tt.needsUpdate=true;tt.repeat.set(rx,ry||1);return new THREE.MeshLambertMaterial({map:tt});}
const MUD=texMat(TEX.mudbrick,1,1);
function mudMat(w,h){return texMat(TEX.mudbrick,Math.max(1,w/3),Math.max(1,h/1.5));}

// entablamento: arquitrabe, friso (dórico con triglifos o jónico continuo) y cornisa pintada
function entablature(g,W,L,y,e,o){
  o=o||{};const ah=e*0.4,fh=e*0.4,ch=e*0.2;
  box(W,ah,L,M.marbleShade,0,y+ah/2,0,g);
  let fz;
  if(o.ionic){const t=o.friezeTex||TEX.procession;fz=new THREE.Mesh(new THREE.BoxGeometry(W,fh,L),[texMat(t,L/6),texMat(t,L/6),M.marble,M.marble,texMat(t,W/6),texMat(t,W/6)]);}
  else{const ia=o.ia||W/6,uL=Math.max(1,2*L/ia/4),uW=Math.max(1,2*W/ia/4);const f=r=>{const t=FRIEZE.clone();t.needsUpdate=true;t.repeat.set(r,1);return new THREE.MeshLambertMaterial({map:t});};
    fz=new THREE.Mesh(new THREE.BoxGeometry(W,fh,L),[f(uL),f(uL),M.marble,M.marble,f(uW),f(uW)]);}
  fz.position.y=y+ah+fh/2;fz.castShadow=true;g.add(fz);
  const cn=new THREE.Mesh(new THREE.BoxGeometry(W+0.7,ch,L+0.7),[texMat(TEX.sima,L/4),texMat(TEX.sima,L/4),M.marble,M.blue,texMat(TEX.sima,W/4),texMat(TEX.sima,W/4)]);
  cn.position.y=y+ah+fh+ch/2;cn.castShadow=true;g.add(cn);
  return y+e;
}
function coffered(g,W,L,y){const c=new THREE.Mesh(new THREE.BoxGeometry(W,0.25,L),[M.marble,M.marble,M.marble,texMat(TEX.coffers,W/1.6,L/1.6),M.marble,M.marble]);c.position.y=y;g.add(c);return c;}

