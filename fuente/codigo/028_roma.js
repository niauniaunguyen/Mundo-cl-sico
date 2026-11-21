// ============================================================ ROMA: la domus visitable del Celio
// Una casa de atrio y peristilo a tamaño real (28 × 64 m), con sus estancias, pinturas del cuarto estilo y mosaicos.
// Coordenadas locales: x de -14 a 14; la fachada da a la calle en z = +31 y el fondo está en z = -33.
const DOMUS={x:600,z:360,y:31.6,H:6};
const DOMUS_PAINT={rojo:['#9e2a1e','#7a1c14','#e9dcc0'],amarillo:['#d9a43a','#a87a22','#efe4c8'],negro:['#1e1a18','#3a2a22','#e9dcc0'],blanco:['#ece4d2','#c9b48b','#f3eee2']};
// pintura mural del cuarto estilo: zócalo oscuro, paneles de color con una viñeta y franjas de arquitecturas fingidas; arriba, zona clara
function domusWallTex(kind){const P=DOMUS_PAINT[kind];return canvasTex(256,384,(x,W,H)=>{
  x.fillStyle=P[2];x.fillRect(0,0,W,H);
  const zz=H*5/6;x.fillStyle=kind==='negro'?'#3a1410':'#2a1a14';x.fillRect(0,zz,W,H-zz);x.strokeStyle='#c9a24a';x.lineWidth=2;x.strokeRect(10,zz+8,W-20,H-zz-16);   // zócalo
  for(let i=0;i<5;i++){x.fillStyle='#4f6a3a';x.beginPath();x.ellipse(30+i*50,zz+30,6,12,0.3,0,TAU);x.fill();}
  x.fillStyle=P[0];x.fillRect(36,H*0.3,W-72,H*0.52);x.strokeStyle=P[1];x.lineWidth=6;x.strokeRect(40,H*0.3+4,W-80,H*0.52-8);   // panel central
  x.strokeStyle='#efe2c0';x.lineWidth=1.5;x.strokeRect(50,H*0.3+14,W-100,H*0.52-28);
  x.fillStyle='#efe2c0';x.beginPath();x.ellipse(W/2,H*0.56,14,20,0,0,TAU);x.fill();x.fillStyle=P[1];x.beginPath();x.ellipse(W/2,H*0.56,9,15,0,0,TAU);x.fill();   // viñeta
  for(const s of[0,W-36]){x.fillStyle=kind==='negro'?'#2a2420':'#efe6d0';x.fillRect(s,H*0.3,36,H*0.52);x.fillStyle='#c9a24a';x.fillRect(s+15,H*0.3+6,5,H*0.52-12);for(let k=0;k<6;k++){x.fillStyle='#7a5a2a';x.fillRect(s+11,H*0.32+k*30,13,3);}}   // candelabros
  x.fillStyle=P[1];x.fillRect(0,H*0.27,W,H*0.03);
  x.strokeStyle='#8a6a4a';x.lineWidth=2;for(let i=0;i<4;i++){x.beginPath();x.moveTo(i*64+8,H*0.25);x.lineTo(i*64+8,H*0.05);x.stroke();}   // zona alta: columnillas
  x.strokeStyle='#5f7a3a';x.lineWidth=3;x.beginPath();for(let i=0;i<=W;i+=8)x.lineTo(i,H*0.12+Math.sin(i/20)*10);x.stroke();});}   // guirnalda
function domusFloorTex(kind){return canvasTex(256,256,(x,W,H)=>{
  if(kind==='bn'){x.fillStyle='#efe9da';x.fillRect(0,0,W,H);x.fillStyle='#1e1a18';for(let i=0;i<8;i++)for(let j=0;j<8;j++)if((i+j)%2)x.fillRect(i*32+8,j*32+8,16,16);x.strokeStyle='#1e1a18';x.lineWidth=4;x.strokeRect(2,2,W-4,H-4);}
  else if(kind==='signinum'){x.fillStyle='#a8624a';x.fillRect(0,0,W,H);x.fillStyle='#f3eee2';for(let i=0;i<10;i++)for(let j=0;j<10;j++)x.fillRect(i*25.6+11,j*25.6+11,4,4);}
  else if(kind==='tierra'){x.fillStyle='#8a7a5a';x.fillRect(0,0,W,H);for(let i=0;i<400;i++){x.fillStyle=R()<0.5?'#7a6a4a':'#9a8a6a';x.fillRect(R()*W,R()*H,3,3);}}
  else if(kind==='emblema'){x.fillStyle='#efe9da';x.fillRect(0,0,W,H);x.strokeStyle='#1e1a18';x.lineWidth=6;x.strokeRect(10,10,W-20,H-20);x.strokeRect(24,24,W-48,H-48);
    x.fillStyle='#3a6f8a';x.fillRect(70,70,W-140,H-140);for(let i=0;i<6;i++){x.fillStyle=['#c9a24a','#e8a040','#c96a4a'][i%3];x.beginPath();x.ellipse(95+(i%3)*33,100+Math.floor(i/3)*55,13,6,i*0.6,0,TAU);x.fill();}}
  else if(kind==='cave'){x.fillStyle='#efe9da';x.fillRect(0,0,W,H);x.fillStyle='#1e1a18';x.lineWidth=4;x.strokeRect(6,6,W-12,H-12);
    x.beginPath();x.moveTo(50,170);x.lineTo(70,120);x.lineTo(150,115);x.lineTo(180,95);x.lineTo(205,100);x.lineTo(200,120);x.lineTo(180,125);x.lineTo(175,170);x.lineTo(160,170);x.lineTo(155,135);x.lineTo(90,140);x.lineTo(80,170);x.closePath();x.fill();
    x.fillStyle='#a8392b';x.fillRect(175,108,20,4);x.font='bold 30px Georgia, serif';x.textAlign='center';x.fillStyle='#1e1a18';x.fillText('CAVE CANEM',W/2,220);}});}
function domusMat(kind,len,h){const t=domusWallTex(kind).clone();t.needsUpdate=true;t.repeat.set(Math.max(1,Math.round(len/4)),1);t.wrapS=THREE.RepeatWrapping;return new THREE.MeshLambertMaterial({map:t});}
const DOMUS_EXT=()=>lam('#e6dcc6'),DOMUS_ENL=()=>lam('#e9dfca');
// muro de A a B (locales) con huecos: doors = [[t0,t1,dintel]] medidos desde A; L e I = acabados a la izquierda y a la derecha según se va de A a B
function domusWall(ax,az,bx,bz,L,Rk,doors){const D=DOMUS,H=D.H,T=0.45,len=Math.hypot(bx-ax,bz-az),dx=(bx-ax)/len,dz=(bz-az)/len,ang=-Math.atan2(dz,dx);
  const mk=(k,l,h)=>k==='ext'?DOMUS_EXT():k==='enl'?DOMUS_ENL():domusMat(k,l,h);
  const seg=(t0,t1,y0,y1)=>{const l=t1-t0;if(l<0.05)return;const cx=ax+dx*(t0+t1)/2,cz=az+dz*(t0+t1)/2,end=lam('#e6dcc6');
    const m=new THREE.Mesh(new THREE.BoxGeometry(l,y1-y0,T),[end,end,end,end,mk(L,l,y1-y0),mk(Rk,l,y1-y0)]);m.position.set(D.x+cx,D.y+(y0+y1)/2,D.z+cz);m.rotation.y=ang;m.castShadow=true;m.receiveShadow=true;scene.add(m);
    if(y0<0.1)addSeg(D.x+ax+dx*t0,D.z+az+dz*t0,D.x+ax+dx*t1,D.z+az+dz*t1,0.3);};
  let t=0;for(const d of(doors||[]).slice().sort((a,b)=>a[0]-b[0])){seg(t,d[0],0,H);if(d[2]<H)seg(d[0],d[1],d[2],H);t=d[1];}seg(t,len,0,H);}
function domusFloor(x0,z0,x1,z1,kind,rep){const D=DOMUS,t=domusFloorTex(kind);t.repeat.set(rep?(x1-x0)/rep:1,rep?(z1-z0)/rep:1);const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),new THREE.MeshLambertMaterial({map:t}));
  m.rotation.x=-Math.PI/2;m.position.set(D.x+(x0+x1)/2,D.y+0.04,D.z+(z0+z1)/2);m.receiveShadow=true;scene.add(m);}
// tejado: losa de tejas inclinada (tx, tz = inclinación en x y en z)
function domusRoof(x0,z0,x1,z1,y,tx,tz){const D=DOMUS,m=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,0.3,z1-z0),[lam('#b0563a'),lam('#b0563a'),lam('#b0563a'),lam('#5a4330'),lam('#b0563a'),lam('#b0563a')]);
  m.position.set(D.x+(x0+x1)/2,D.y+y,D.z+(z0+z1)/2);m.rotation.set(tx||0,0,tz||0);m.castShadow=true;scene.add(m);}
function domusBox(w,h,d,col,x,y,z,ry){const D=DOMUS,b=box(w,h,d,typeof col==='string'?lam(col):col,D.x+x,D.y+y,D.z+z);if(ry)b.rotation.y=ry;return b;}
// la casa de la novia de la boda romana: la misma planta, en la misma calle, con otras pinturas; y la calle libre entre las dos casas para el cortejo
const DOMUS_NOVIA={x:470,z:360};
function buildDomusNovia(){
  const keep={x:DOMUS.x,z:DOMUS.z},P=Object.assign({},DOMUS_PAINT);
  Object.assign(DOMUS,DOMUS_NOVIA);Object.assign(DOMUS_PAINT,{rojo:P.amarillo,amarillo:P.rojo,negro:['#2f3d33','#1e2a22','#e9dcc0']});
  buildDomus(true);
  Object.assign(DOMUS,keep);Object.assign(DOMUS_PAINT,P);
  footprints.push({x:(DOMUS.x+DOMUS_NOVIA.x)/2,z:DOMUS.z+38,w:DOMUS.x-DOMUS_NOVIA.x+40,d:12,a:0,reserve:true});
  NPC_POS.pomponia=[DOMUS_NOVIA.x+3.6,DOMUS.z+34,0];
}
function buildDomus(copy){
  const D=DOMUS,W=(x,z)=>[D.x+x,D.z+z];
  footprints.push({x:D.x,z:D.z-1,w:28,d:64,a:0,c:'#cdb994',name:copy?'Casa de los Valerios':'Domus del Celio',reserve:true});
  // suelos
  domusFloor(-1.5,23,1.5,31,'cave');domusFloor(-8,5,8,23,'bn',2);domusFloor(-5,-5,5,5,'bn',1.5);domusFloor(-8,-5,-5,5,'bn',2);domusFloor(-14,5,-8,23,'signinum',2);domusFloor(8,5,14,23,'signinum',2);
  domusFloor(-14,-5,-8,5,'signinum',2);domusFloor(5,-5,14,5,'bn',2);domusFloor(-14,-25,14,-5,'signinum',2.5);domusFloor(-7,-33,7,-25,'emblema');domusFloor(-14,-33,-7,-25,'bn',2);domusFloor(7,-33,14,-25,'tierra',3);
  domusFloor(-14,23,-5,31,'tierra',3);domusFloor(5,23,14,31,'tierra',3);domusFloor(-5,23,-1.5,31,'tierra',3);domusFloor(1.5,23,5,31,'tierra',3);
  {const g=new THREE.Mesh(new THREE.PlaneGeometry(18,11),lam('#6f8a4a'));g.rotation.x=-Math.PI/2;g.position.set(D.x,D.y+0.06,D.z-15);scene.add(g);}   // jardín
  // muros exteriores
  domusWall(-14,31,14,31,'ext','enl',[[0.5,8.5,3.8],[12.5,15.5,3.6],[19.5,27.5,3.8]]);
  domusWall(-14,31,-14,23,'enl','ext');domusWall(-14,23,-14,5,'blanco','ext');domusWall(-14,5,-14,-5,'blanco','ext');domusWall(-14,-5,-14,-25,'amarillo','ext');domusWall(-14,-25,-14,-33,'negro','ext');
  domusWall(14,-33,14,-25,'enl','ext');domusWall(14,-25,14,-5,'amarillo','ext');domusWall(14,-5,14,5,'amarillo','ext');domusWall(14,5,14,23,'blanco','ext');domusWall(14,23,14,31,'enl','ext');
  domusWall(14,-33,7,-33,'ext','enl');domusWall(7,-33,-7,-33,'ext','rojo');domusWall(-7,-33,-14,-33,'ext','negro');
  // fachada: tabernas, celda del portero, escalera y fauces
  domusWall(-14,23,-5,23,'enl','blanco');domusWall(-5,23,-1.5,23,'enl','rojo');domusWall(1.5,23,5,23,'enl','rojo');domusWall(5,23,14,23,'enl','blanco');
  domusWall(-1.5,31,-1.5,23,'negro','enl',[[3,4.6,2.4]]);domusWall(1.5,23,1.5,31,'negro','enl');domusWall(-5,31,-5,23,'enl','enl');domusWall(5,23,5,31,'enl','enl');
  // atrio, cubículos y alas
  domusWall(-8,23,-8,11,'rojo','blanco',[[3,4.6,2.6],[9,10.6,2.6]]);domusWall(8,11,8,23,'rojo','blanco',[[1.4,3,2.6],[7.4,9,2.6]]);
  domusWall(-14,16,-8,16,'blanco','blanco');domusWall(8,16,14,16,'blanco','blanco');domusWall(-14,11,-8,11,'blanco','rojo');domusWall(8,11,14,11,'blanco','rojo');
  domusWall(-14,5,-8,5,'rojo','blanco');domusWall(5,5,14,5,'rojo','amarillo');
  // tablino, andron, cubículo y biblioteca
  domusWall(-5,5,-5,-5,'negro','rojo');domusWall(-8,5,-8,-5,'rojo','blanco',[[4.2,5.8,2.6]]);domusWall(5,-5,5,5,'negro','amarillo');
  domusWall(-14,-5,-8,-5,'blanco','amarillo');domusWall(-5,-5,5,-5,'negro','amarillo',[[2,8,3.6]]);domusWall(5,-5,14,-5,'amarillo','amarillo',[[4,5.6,2.6]]);
  // fondo: cubículo del dueño, triclinio y cocina
  domusWall(-14,-25,-7,-25,'amarillo','negro',[[3,4.6,2.6]]);domusWall(-7,-25,7,-25,'amarillo','rojo',[[4,10,4]]);domusWall(7,-25,14,-25,'amarillo','enl',[[2,3.6,2.6]]);
  domusWall(-7,-25,-7,-33,'rojo','negro');domusWall(7,-33,7,-25,'rojo','enl');
  // puerta de la calle, abierta
  for(const s of[-1,1]){const b=domusBox(1.4,3.4,0.15,M.wood,s*1.4,1.7,30.2,s*0.9);}
  // atrio: impluvio, mesa, arca, lararío
  {for(const[w,d,x,z]of[[6.6,0.3,0,11],[6.6,0.3,0,17],[0.3,6,-3.15,14],[0.3,6,3.15,14]]){domusBox(w,0.3,d,M.marble,x,0.15,z);}
   const w=new THREE.Mesh(new THREE.PlaneGeometry(6,6),new THREE.MeshPhongMaterial({color:'#4f8fa8',shininess:90}));w.rotation.x=-Math.PI/2;w.position.set(D.x,D.y+0.12,D.z+14);scene.add(w);addBox(D.x,D.z+14,6.6,6.6,0);
   domusBox(2.4,0.9,1,M.marble,0,0.45,9.4);addBox(D.x,D.z+9.4,2.4,1,0);   // cartibulum
   domusBox(1.4,1,0.9,lam('#6b4a2e'),-6.6,0.5,7);for(const y of[0.2,0.8])domusBox(1.45,0.08,0.95,lam('#b07a3a'),-6.6,y,7);addBox(D.x-6.6,D.z+7,1.4,0.9,0);   // arca
   {const lx=7,lz=21.6;domusBox(2.2,1.2,0.8,M.marble,lx,0.6,lz);domusBox(2.2,1.6,0.25,new THREE.MeshLambertMaterial({map:canvasTex(128,96,(x,W,H)=>{x.fillStyle='#e9dcc0';x.fillRect(0,0,W,H);x.fillStyle='#a8392b';for(const s of[22,106]){x.fillRect(s-5,22,10,40);x.beginPath();x.arc(s,16,7,0,TAU);x.fill();}
     x.fillStyle='#efe6d4';x.fillRect(58,24,12,44);x.beginPath();x.arc(64,18,6,0,TAU);x.fill();x.strokeStyle='#4f6a3a';x.lineWidth=5;x.beginPath();for(let i=0;i<=W;i+=6)x.lineTo(i,84+Math.sin(i/9)*5);x.stroke();})}),lx,2,lz+0.95);
    domusBox(2.6,0.3,1,M.marble,lx,2.95,lz);addBox(D.x+lx,D.z+lz,2.2,0.8,0);}
   // armario de las imágenes de los antepasados, en el ala
   {domusBox(3,2.2,0.6,lam('#5a4330'),-11,1.1,5.6);for(let i=0;i<4;i++){const h=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),lam('#d8cbb4'));h.position.set(D.x-12.1+i*0.75,D.y+1.6,D.z+5.95);scene.add(h);}}}
  // cubículos: camas, arcones, lucernas
  for(const[x,z]of[[-11,19.5],[-11,13.5],[11,19.5],[11,13.5],[-11,0],[-10.5,-29]]){domusBox(1.1,0.55,2.2,lam('#6b4a2e'),x,0.28,z);domusBox(1,0.15,2,lam('#c9b48b'),x,0.62,z);domusBox(0.9,0.12,0.35,lam('#a8392b'),x,0.72,z-0.85);addBox(D.x+x,D.z+z,1.1,2.2,0);}
  // tablino: mesa con tablillas y rollos
  {domusBox(2.6,0.9,1.2,lam('#5a4330'),0,0.45,0);for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.5,8),lam('#e7dcc4'));r.rotation.z=Math.PI/2;r.position.set(D.x-0.8+i*0.5,D.y+0.97,D.z);scene.add(r);}addBox(D.x,D.z,2.6,1.2,0);}
  // biblioteca: estantes con rollos
  for(const x of[7.5,11.5]){domusBox(3,3,0.6,lam('#5a4330'),x,1.5,4.4);for(let k=0;k<4;k++)for(let i=0;i<8;i++){const r=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.4,6),lam(k%2?'#e7dcc4':'#d8c9a3'));r.rotation.x=Math.PI/2;r.position.set(D.x+x-1.2+i*0.34,D.y+0.5+k*0.7,D.z+4.1);scene.add(r);}addBox(D.x+x,D.z+4.4,3,0.6,0);}
  // peristilo: columnas, seto, fuente con estatua
  for(let i=0;i<7;i++)for(const z of[-9.5,-20.5]){const[x2,z2]=W(-9+i*3,z);addColumn(x2,D.y,z2,0.3,4.2,0,'doric');addCirc(x2,z2,0.35);}
  for(let i=1;i<4;i++)for(const x of[-9.5,9.5]){const[x2,z2]=W(x,-9.5-i*2.75);addColumn(x2,D.y,z2,0.3,4.2,0,'doric');addCirc(x2,z2,0.35);}
  for(const[w,d,x,z]of[[17,0.5,0,-10.3],[17,0.5,0,-19.7],[0.5,9,-8.7,-15],[0.5,9,8.7,-15]])domusBox(w,0.6,d,lam('#3f5a2a'),x,0.3,z);
  {domusBox(3,0.5,3,M.marble,0,0.25,-15);const w=new THREE.Mesh(new THREE.PlaneGeometry(2.6,2.6),new THREE.MeshPhongMaterial({color:'#4f8fa8',shininess:90}));w.rotation.x=-Math.PI/2;w.position.set(D.x,D.y+0.52,D.z-15);scene.add(w);statue(D.x,D.y+0.5,D.z-15,0,1,'bronze');addBox(D.x,D.z-15,3,3,0);}
  for(let i=0;i<10;i++){const x=rr(-7.5,7.5),z=rr(-19,-11);if(Math.abs(x)<2.5&&Math.abs(z+15)<2.5)continue;const s=new THREE.Mesh(new THREE.SphereGeometry(rr(0.4,0.8),10,8),lam(pick(['#4f6b3a','#5f7a3a','#3f5a2a'])));s.position.set(D.x+x,D.y+0.4,D.z+z);s.castShadow=true;scene.add(s);}
  // triclinio: tres lechos alrededor de una mesa
  {for(const[w,d,x,z]of[[5,1.4,0,-31.6],[1.4,4,-3.6,-29],[1.4,4,3.6,-29]]){domusBox(w,0.7,d,lam('#6b4a2e'),x,0.35,z);domusBox(w-0.1,0.18,d-0.1,lam('#a8392b'),x,0.79,z);addBox(D.x+x,D.z+z,w,d,0);}
   const t=new THREE.Mesh(new THREE.CylinderGeometry(0.8,0.8,0.7,20),M.marble);t.position.set(D.x,D.y+0.35,D.z-29);scene.add(t);addCirc(D.x,D.z-29,0.8);}
  // cocina: fogón, horno, ánforas; letrina en el rincón
  {domusBox(3,1,1.2,lam('#a8624a'),10.5,0.5,-32.2);addBox(D.x+10.5,D.z-32.2,3,1.2,0);const f=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));f.scale.set(0.8,1,1);f.position.set(D.x+10.5,D.y+1.3,D.z-32.2);scene.add(f);
   const o=new THREE.Mesh(new THREE.SphereGeometry(0.9,14,10,0,TAU,0,Math.PI/2),lam('#8a6a4a'));o.position.set(D.x+8.2,D.y+1,D.z-32);scene.add(o);domusBox(1.8,1,1.6,lam('#a8624a'),8.2,0.5,-32);addBox(D.x+8.2,D.z-32,1.8,1.6,0);
   for(let i=0;i<4;i++){const a=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.12,0.9,10),lam('#b8734a'));a.position.set(D.x+13.3,D.y+0.45,D.z-29+i*0.6);scene.add(a);}
   domusBox(1.4,0.5,1.2,M.limestone,13,0.25,-26.2);}
  // escalera de madera a los pisos de arriba (cenacula) y mostradores de las tabernas
  for(let i=0;i<12;i++)domusBox(3,0.18,0.5,lam('#6b4a2e'),3.3,0.2+i*0.42,24+i*0.55);
  for(const x of[-9.5,9.5]){domusBox(6,1,0.8,M.limestone,x,0.5,29.6);addBox(D.x+x,D.z+29.6,6,0.8,0);for(let i=0;i<3;i++){const a=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,0.3,10),lam('#8a6a4a'));a.position.set(D.x+x-1.6+i*1.6,D.y+0.9,D.z+29.6);scene.add(a);}}
  // tejados (el atrio, con el compluvio abierto sobre el impluvio)
  const H=D.H;domusRoof(-14.2,23,14.2,31.6,H+0.3,0.06,0);
  domusRoof(-8,17,8,23,H-0.1,-0.11,0);domusRoof(-8,5,8,11,H-0.1,0.11,0);domusRoof(-8,11,-3,17,H-0.1,0,-0.13);domusRoof(3,11,8,17,H-0.1,0,0.13);
  domusRoof(-14.2,5,-8,23,H+0.2,0,0.05);domusRoof(8,5,14.2,23,H+0.2,0,-0.05);domusRoof(-14.2,-5,14.2,5,H+0.2,0,0);
  domusRoof(-14.2,-9.5,14.2,-4.8,(H+4.3)/2,-0.35,0);domusRoof(-14.2,-25.2,14.2,-20.5,(H+4.3)/2,0.35,0);domusRoof(-14.2,-20.5,-9.5,-9.5,(H+4.3)/2,0,-0.35);domusRoof(9.5,-20.5,14.2,-9.5,(H+4.3)/2,0,0.35);
  domusRoof(-14.2,-33.6,14.2,-25,H+0.3,0.05,0);
  if(copy)return;
  // estelas
  const S=(id,n,l,t,x,z,r)=>{const[x2,z2]=W(x,z);place(id,n,l,t,x2,z2,r||0);};
  S('domus_fauces','Las fauces: «Cuidado con el perro»','FAVCES','Por este pasillo estrecho, las fauces, se entra desde la calle. A un lado, en su cuartito, vive el portero (ostiarius), a menudo encadenado a la puerta, con un perro. En el suelo, un mosaico avisa: CAVE CANEM, «cuidado con el perro». En Pompeya hay uno igual en la casa del Poeta Trágico. A los lados de la entrada, la casa alquila dos tiendas (tabernae) que dan a la calle.',2.4,27,Math.PI/2);
  S('domus_atrio','El atrio y el impluvio','ATRIVM','El corazón de la casa. El tejado se inclina hacia dentro y deja en medio una abertura, el compluvio, por la que entran la luz y la lluvia; el agua cae en el impluvio, el estanque de mármol, y se guarda en una cisterna. Aquí recibe el dueño cada mañana a sus clientes en la salutatio. Junto al impluvio está la mesa de mármol (cartibulum), y en un rincón, el arca de hierro y bronce con el dinero de la familia, a la vista de todos.',4.2,9,0);
  S('domus_lararium','El larario','LARARIVM','El altar de los dioses de la casa. Pintados en la pared: los dos Lares, jóvenes que bailan con un cuerno de beber en la mano, y en medio el Genio del dueño, con la toga sobre la cabeza, haciendo un sacrificio; abajo, una serpiente, guardiana de la casa. Cada día se les ofrece incienso, vino o una parte de la comida, y en las fiestas, guirnaldas.',5.2,20.6,Math.PI);
  S('domus_alas','Las alas y los antepasados','IMAGINES','En estas alas, abiertas al atrio, las familias nobles guardan en armarios las máscaras de cera de sus antepasados que ocuparon magistraturas, con sus nombres y cargos escritos debajo. En los funerales, actores las llevan puestas para que los muertos ilustres acompañen al difunto. Polibio quedó impresionado: «No hay espectáculo más hermoso para un joven ambicioso».',-10.5,8.2,0);
  S('domus_cubiculo','El cubículo','CVBICVLVM','Los dormitorios son pequeños, oscuros y sin ventanas a la calle: una cama de madera con colchón de lana, un arcón y una lucerna de aceite. Las paredes se pintan con paneles claros. Los romanos ricos pasan poco tiempo en ellos: sirven para dormir, para guardar cosas y, a veces, para recibir a un amigo en privado.',-11,16.8,Math.PI);
  S('domus_tablino','El tablino','TABLINVM','Entre el atrio y el peristilo está el despacho del dueño, el tablino, abierto por delante y por detrás: desde la puerta de la calle se ve toda la casa en fila, una vista pensada para impresionar. Aquí se guardan las cuentas y los documentos de la familia, y el dueño atiende sus negocios. Una cortina o unos biombos de madera lo cierran cuando hace falta.',3.8,2.6,0);
  S('domus_pinturas','Las pinturas de las paredes','PICTVRAE','Las paredes están pintadas al fresco con el estilo de moda, que los historiadores llamarán «cuarto estilo»: zócalo oscuro, grandes paneles rojos, negros o amarillos con una pequeña escena en el centro, y entre ellos arquitecturas fantásticas, finas como de juguete. Los colores son caros: el rojo cinabrio viene de las minas de Hispania. El pintor Fábulo decoró así la Domus Aurea de Nerón.',-4.2,-1.8,Math.PI/2);
  S('domus_mosaicos','Los suelos','PAVIMENTA','Cada estancia tiene su suelo: mosaicos de teselas blancas y negras con dibujos geométricos en el atrio y el tablino, suelos de opus signinum (cal y ladrillo machacado, rojizo, con teselas blancas incrustadas) en las habitaciones de servicio y los pórticos, y en el triclinio, un emblema de colores en el centro, hecho con teselas diminutas, como un cuadro de piedra.',-2.6,-27.2,Math.PI);
  S('domus_peristilo','El peristilo','PERISTYLIVM','Detrás, la parte más privada de la casa: un jardín rodeado de columnas, a la manera griega. Hay arriates con setos de boj, rosas, laurel y hierbas, una fuente con una estatua y, a veces, pajareras. Las habitaciones de alrededor se abren a los pórticos para tener luz y aire. Aquí pasea la familia, juegan los niños y se cena en verano.',6.5,-11.5,Math.PI);
  S('domus_triclinio','El triclinio','TRICLINIVM','El comedor. Tres lechos en forma de U alrededor de una mesa: los comensales comen recostados sobre el codo izquierdo, tres en cada lecho, y el lugar de honor es el del lecho del centro. Los esclavos sirven por el lado abierto. Una cena de invitados tiene entrantes (gustatio), varios platos principales y postre, con vino mezclado con agua. Las mujeres de la familia también se recuestan.',-5.4,-26.4,Math.PI);
  S('domus_cocina','La cocina y la letrina','CVLINA','Una cocina pequeña y llena de humo: un fogón de obra donde se cocina sobre trébedes con carbón o leña, un horno para el pan, ánforas de aceite y de vino y ollas de barro. Al lado, la letrina, conectada a la cloaca o a un pozo negro. Aquí trabajan los esclavos de la casa; los dueños apenas entran.',8.6,-26.6,Math.PI);
  S('domus_cenacula','Escalera y tabernas','CENACVLA','La escalera sube a los pisos de arriba, los cenacula, que el dueño alquila con entrada propia. Las dos tiendas de la fachada también se alquilan: una taberna de vino y comida caliente y un taller. Las casas de los ricos están rodeadas de negocios y de vecinos pobres: en Roma, ricos y pobres viven pared con pared.',3.4,22.4,Math.PI);
  NPC_POS.filero=[D.x-4.6,D.z+16,Math.PI/2];
  // el culto de la casa: la abuela, el larario y el hogar se pueden usar; estelas de los Penates, el Genio y los Lemures
  NPC_POS.avia=[D.x+4.4,D.z+18.4,Math.PI/2];
  for(const[x,z,ctx,nm,sub]of[[7,20.1,'domus','El larario','ofrenda a los Lares'],[10.5,-30.7,'focus','El hogar','Vesta y los Penates']]){const[x2,z2]=W(x,z);const lb=labelSprite(nm,sub,false);lb.position.set(x2,D.y+2.6,z2);lb.visible=false;scene.add(lb);CULT_OBJS.push({kind:'culto',ctx,x:x2,z:z2,lb,r:2.4,data:{name:nm,role:''}});}
  S('domus_penates','La despensa y los Penates','PENVS','Junto a la cocina está la despensa, el penus: de esa palabra viene el nombre de los Penates, los dioses que cuidan de que en la casa no falte comida. Sus figurillas se guardan en el larario, junto a los Lares. La mesa y el salero son sagrados, y en cada comida se echa al fuego un poco de comida y de sal para ellos. En muchas cocinas hay además un altarcito de los Lares junto al fogón, al que rezan sobre todo los esclavos y las mujeres. Según la leyenda, Eneas salvó de Troya en llamas los Penates de su ciudad y los trajo a Italia: son los antepasados de los Penates públicos de Roma.',11.6,-27.4,Math.PI);
  S('domus_genio','El Genio y la Juno','GENIVS','Junto al dormitorio de los dueños. Cada hombre tiene su Genio, un espíritu protector que nace con él, y cada mujer, su Juno. El del padre de familia es el Genio de toda la casa: se le pinta en el larario con la toga sobre la cabeza, o como una serpiente. En el cumpleaños del dueño se le ofrecen vino, tortas, incienso y flores, sin sangre, como cuenta Censorino. Se jura «por el Genio» de alguien, y desde Augusto, también por el del emperador.',-11.2,-26.8,Math.PI);
  S('domus_lemures','Los Manes, los Lemures y las Larvas','LEMVRES','Los muertos de la familia, si reciben sus ofrendas, son Manes: espíritus buenos a los que se honra en febrero, en las Parentales, y cuyas máscaras se guardan en las alas del atrio. Los que no descansan, los Lemures o Larvas, vagan de noche por las casas. En las tres noches de las Lemurias, en mayo, el padre de familia los echa con un rito de habas negras ante el larario, como cuenta Ovidio. Puedes practicarlo allí mismo.',-3.4,21.4,Math.PI/2);
  // la cola de clientes de la salutatio, en la calle
  for(let i=0;i<5;i++){const c=makePerson({chiton:'#efe9dc',toga:true,himation:'#f3eee2',hair:pick(['#2b1f17','#5b4532','#8d8a85']),beard:R()<0.4});const px=D.x+1+(i%2?1:-1)*0.6,pz=D.z+33+i*1.3;c.position.set(px,terrainH(px,pz),pz);c.rotation.y=Math.PI;scene.add(c);addCirc(px,pz,0.35);(ROMA.clients=ROMA.clients||[]).push(c);}
}

// ------------------------------------------------------------ ROMA: relieve de los destinos
function defineRomaDests(){
  const G=id=>ISLANDS.find(I=>I.id===id);
  for(const I of ISLANDS)I.arrive=pad(I,-I.R*0.72,30,24,0,3);
  {const I=G('campania');I.blobs.push({x:I.x+250,z:I.z-170,R:250,H:230});I.town=pad(I,-120,60,70,0,3.5);I.town.house=true;I.pomp=pad(I,240,110,60,0,3);I.tomb=pad(I,-230,-30,10,0,4);
   I.tint=(x,z,h,c)=>{const d=Math.hypot(x-(I.x+250),z-(I.z-80));if(d<300&&h>1.5)c.lerp(_c1.set('#4a4744'),clamp((300-d)/100,0,0.92));};}
  {const I=G('apulia');I.town=pad(I,40,0,70,0,3.5);I.town.house=true;}
  {const I=G('lucania');I.sanct=pad(I,0,-40,110,0,3.5);I.town=pad(I,-60,120,50,0,3.5);I.town.house=true;}
  {const I=G('samnium');for(let i=0;i<7;i++){const a=i/7*TAU+0.3;I.blobs.push({x:I.x+Math.cos(a)*I.R*1.0,z:I.z+Math.sin(a)*I.R*1.0,R:200,H:120+50*Math.sin(i*1.7)});}I.blobs.push({x:I.x+260,z:I.z-220,R:90,H:60});I.pietra=pad(I,260,-220,16);I.town=pad(I,0,0,140,0,4);I.town.house=true;}
  {const I=G('picenum');I.blobs.push({x:I.x+40,z:I.z-20,R:150,H:16},{x:I.x+330,z:I.z-300,R:220,H:150});I.town=pad(I,40,-20,90);I.town.house=true;}
  {const I=G('umbria');I.town=pad(I,0,40,90,0,3.5);I.town.house=true;}
  {const I=G('etruria');I.blobs.push({x:I.x+120,z:I.z-80,R:140,H:40},{x:I.x-120,z:I.z+120,R:120,H:22});I.civ=pad(I,120,-80,80);I.civ.house=true;I.ara=pad(I,150,-40,30);I.necro=pad(I,-120,120,80);}
  {const I=G('aemilia');I.town=pad(I,60,-60,100,0,3.5);I.town.house=true;}
  {const I=G('liguria');I.blobs.push({x:I.x,z:I.z-330,R:300,H:180},{x:I.x+300,z:I.z-120,R:160,H:80});I.town=pad(I,-30,60,60,0,4);I.town.house=true;}
  {const I=G('venetia');I.blobs.push({x:I.x+160,z:I.z-140,R:90,H:26});I.thea=pad(I,160,-120,30);I.town=pad(I,-20,40,110,0,4);I.town.house=true;I.arena=pad(I,-150,140,70,0,4);}
  {const I=G('transpadana');I.lake={x:I.x+120,z:I.z-40,rx:110,rz:420};for(let i=0;i<5;i++)I.blobs.push({x:I.x-200+i*160,z:I.z-I.R*1.05,R:220,H:200+60*Math.sin(i)});I.town=pad(I,-110,120,90,0,4);I.town.house=true;I.villa=pad(I,-20,-120,26,0,4);}
  {const I=G('cartago');I.blobs.push({x:I.x-60,z:I.z-20,R:130,H:40});I.byrsa=pad(I,-60,-20,60);I.lake={x:I.x+110,z:I.z+150,rx:34,rz:34};I.town=pad(I,-40,140,72,0,4);I.town.house=true;I.tophet=pad(I,90,250,24,0,3);I.amph=pad(I,-280,60,60,0,4);}
  {const I=G('tarraco');I.blobs.push({x:I.x+40,z:I.z-60,R:200,H:34});I.upper=pad(I,40,-110,80);I.lower=pad(I,-40,110,70,0,4);I.lower.house=true;I.circH=islandBase(I,I.x+40,I.z-8);I.amph=pad(I,150,150,38);for(let k=-3;k<=3;k++)pad(I,40+k*48,-8,40,0,I.circH);}   // el circo, en una terraza entre el foro provincial y la ciudad baja
  {const I=G('barcino');I.blobs.push({x:I.x+20,z:I.z-30,R:90,H:10},{x:I.x+280,z:I.z+20,R:160,H:80});I.town=pad(I,20,-30,70);I.town.house=true;I.quarry=pad(I,240,40,20);}
  {const I=G('emporiae');I.neap=pad(I,-60,70,64,0,4);I.neap.house=true;I.urbs=pad(I,30,-130,175,0,9);I.urbs.house=true;I.pal=pad(I,150,80,34,0,5);I.amph=pad(I,-210,-130,40,0,8);}   // Neápolis junto al puerto; la ciudad romana, mucho mayor, tierra adentro; la Paleápolis al otro lado del puerto; el anfiteatro fuera de la muralla
  {const I=G('ilerda');I.blobs.push({x:I.x+20,z:I.z-30,R:140,H:40});I.town=pad(I,20,-30,70);I.town.house=true;}
  {const I=G('emerita');I.town=pad(I,0,-60,120,0,4);I.town.house=true;I.spect=pad(I,170,-160,70,0,4);for(const cx of[-60,40,140,220])pad(I,cx,-310,58,0,4);}
  for(const id in SIMPLE_RO){const I=G(id);if(I)defineSimple(I,SIMPLE_RO[id]);}
}
let ROMA_DEF=false;
function romaDestsPre(){if(ROMA_DEF)return;ROMA_DEF=true;defineRomaDests();defineGates();}
function romaReliefChunk(k,n){romaDestsPre();for(let i=k;i<ISLANDS.length;i+=n){const I=ISLANDS[i];if(!I.mesh)buildIslandMesh(I);}}
function buildRomaDests(){
  romaDestsPre();
  for(const I of ISLANDS)if(!I.mesh)buildIslandMesh(I);
  const G=id=>ISLANDS.find(I=>I.id===id);
  // ---------------------------------------- I. Latium et Campania: Neápolis y el Vesubio
  {const I=G('campania'),t=I.town;
   plume(I.x+250,232,I.z-170,14,60);
   theatre({x:t.x-30,z:t.z-50,rot:Math.PI,R0:10,R1:30,H:14,name:'Teatro de Neápolis',noPlays:true});
   romanTemple({x:t.x+30,z:t.z-10,rot:Math.PI,W:16,L:26,pod:3,colD:1,colH:9,nW:6,deep:2,name:'Templo de los Dioscuros'});
   forumR(t.x+30,t.z+30,40,24,'Foro de Neápolis');destHouses(I,t.x,t.z,30,90,true);
   {const sh=shoreAlong(t.x,t.z,0,1,400);makeShip(sh[0]+10,sh[1]+40,0);}
   {const p=I.pomp;for(let i=0;i<70;i++){const x=p.x+rr(-60,60),z=p.z+rr(-50,50),y=terrainH(x,z);const h=rr(0.15,1.3);box(rr(2,8),h,rr(0.6,2),R()<0.4?lam('#a8624a'):lam('#9a948c'),x,y+h/2-0.1,z).rotation.y=R()<0.5?0:Math.PI/2;}
    for(let i=0;i<6;i++){const x=p.x+rr(-30,30),z=p.z+rr(-30,30);addColumn(x,terrainH(x,z)-3,z,0.35,4.2,0,'doric');}
    for(let i=0;i<5;i++){const x=p.x+rr(-30,30),z=p.z+rr(-30,30);const g=makePerson({short:true,noHimation:true,chiton:'#8a8478',hair:'#2a1a12'});g.position.set(x,terrainH(x,z),z);g.rotation.y=R()*TAU;if(g.userData.arms){g.userData.arms[0].rotation.x=-1.4;g.userData.arms[1].rotation.x=-1.4;}scene.add(g);}
    place('pompeya','Pompeya, sepultada','POMPEII','Bajo esta llanura gris está Pompeya, una ciudad de unos doce mil habitantes, enterrada por cuatro a seis metros de piedra pómez y ceniza. Solo asoman los tejados más altos y algunas columnas. Los supervivientes cavan túneles para recuperar lo que pueden. Tito ha nombrado a dos antiguos cónsules «encargados de restaurar Campania» y ha dado a los damnificados los bienes de los muertos sin herederos. Este año el propio emperador ha venido a la zona.',p.x-40,p.z-50,0);}
   place('vesubio','El Vesubio','VESVVIVS','Hace poco más de un año, a finales del verano o en otoño del 79, la montaña, cubierta de viñas, estalló. Una columna de humo y piedras subió hasta el cielo y nubes ardientes bajaron por las laderas: Pompeya, Herculano, Estabias y Oplontis desaparecieron. Plinio el Viejo, almirante de la flota de Miseno, murió en Estabias cuando acudía a socorrer a los habitantes. Su sobrino, Plinio el Joven, lo contará en dos cartas al historiador Tácito.',I.x+120,I.z-60,0);
   place('neapolis','Neápolis','NEAPOLIS','La «ciudad nueva» la fundaron los griegos de Cumas hace más de cinco siglos, y aquí todavía se habla griego, se celebran juegos al modo griego, los Sebastá, y se estudia retórica y filosofía. Muchos romanos ricos tienen aquí sus villas de recreo. En este teatro debutó Nerón como cantante en el 64: un terremoto sacudió el edificio, que se derrumbó cuando el público acababa de salir.',t.x-10,t.z-30,0);
   {const v=I.tomb;box(5,4,5,TRAV2,v.x,v.h+2,v.z);const c=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.4,2,16),TRAV2);c.position.set(v.x,v.h+5,v.z);scene.add(c);addBox(v.x,v.z,5,5,0);
    place('tumba_virgilio','La tumba de Virgilio','MANTVA ME GENVIT','En el camino de Neápolis a Puteoli, a menos de dos millas, está la tumba de Virgilio, que vivió muchos años aquí y escribió aquí las Geórgicas. Su epitafio dice: «Mantua me engendró, los calabreses me arrebataron, ahora me tiene Parténope; canté los pastos, los campos, los caudillos».',v.x+8,v.z+4,0);}
   romaArrive(I,'Neápolis');NPC_POS.numerio=[t.x+10,t.z+16,0];
   romaVillagers(I,t.x+20,t.z+20,5,['Todavía me cae ceniza en el pelo cuando sopla del este.','Mi primo vivía en Herculano. No sabemos nada de él.','Aquí hablamos griego en casa y latín en el foro.','Han llegado familias de Pompeya sin nada. El emperador manda dinero, pero no basta.']);}
  // ---------------------------------------- II. Apulia et Calabria: Brundisium
  {const I=G('apulia'),t=I.town;
   const sh=shoreAlong(t.x,t.z,1,0,400);{const q=box(44,10,8,M.limestone,sh[0]+14,1.7-5,sh[1]);addPlat(sh[0]+14,sh[1],44,8,0,1.7);}
   makeShip(sh[0]+40,sh[1]+50,Math.PI/2);for(let i=0;i<3;i++)blockBuilding({name:'Almacenes',x:sh[0]-30,z:sh[1]-40+i*26,rot:Math.PI/2,w:22,d:12,h:6,mat:BRICK});
   romanTemple({x:t.x-40,z:t.z-30,rot:0,W:14,L:24,pod:3,colD:0.9,colH:8,nW:4,deep:2,name:'Templo de Brundisium'});forumR(t.x-40,t.z+20,36,22,'Foro de Brundisium');destHouses(I,t.x,t.z,30,90,true);
   {const fl=grp(t.x-180,terrainH(t.x-180,t.z+120),t.z+120,0);for(let i=0;i<14;i++)sheep(fl,rr(-14,14),rr(-10,10));}
   place('brundisium','El puerto de Brundisium','BRVNDISIVM','El mejor puerto de Italia hacia Oriente: un brazo de mar que se abre en dos como la cornamenta de un ciervo (eso significa su nombre en mesapio). De aquí zarpan los barcos a Dirraquio y Apolonia, en el Epiro, a un día de navegación, y de allí sigue la Vía Egnatia hasta Bizancio. Por aquí pasan los gobernadores, los soldados y los mercaderes que van a Grecia y a Asia.',sh[0]-20,sh[1]+20,0);
   place('fin_apia','El final de la Vía Apia','VIA APPIA','Aquí termina la Vía Apia, que empezó Apio Claudio en el 312 a.C. hasta Capua y luego se prolongó hasta este puerto. El poeta Horacio contó con humor su viaje de Roma a Brundisium del 37 a.C.: posaderos tramposos, mosquitos, ranas y un fuego en la cocina que casi quema la posada.',I.arrive.x+30,I.arrive.z-20,0);
   place('virgilio_muerte','Aquí murió Virgilio','VERGILIVS','En septiembre del 19 a.C., Virgilio desembarcó aquí enfermo, al volver de Grecia, y murió a los pocos días. Había pedido que quemaran la Eneida, que no había terminado de pulir. Augusto lo prohibió y mandó publicarla. Lo enterraron en Neápolis.',t.x-60,t.z-50,0);
   place('calabria','Calabria, el talón de Italia','CALABRIA','En tu época, Calabria no es la punta de Italia sino el talón, la tierra de los mesapios y de Tarento, la vieja colonia que fundaron los espartanos. La punta es el Brucio. Por aquí nació el poeta Ennio, que decía tener tres corazones porque hablaba griego, osco y latín; y aquí nació Pacuvio, su sobrino. Apulia es tierra de rebaños: la lana de Tarento y de Canusio es famosa.',t.x-170,t.z+100,0);
   romaArrive(I,'Brundisium');NPC_POS.pactumeio=[sh[0]-10,sh[1]-6,Math.PI/2];
   romaVillagers(I,t.x,t.z+10,5,['Mañana zarpa una nave a Dirraquio, si el viento lo permite.','Mis ovejas pasan el verano en los montes del Samnio y el invierno aquí.','Ennio era de por aquí: hablaba tres lenguas y decía que tenía tres corazones.','Aquí desembarcan todos los que vuelven de Grecia contando maravillas.']);}
  // ---------------------------------------- III. Lucania et Bruttii: Paestum
  {const I=G('lucania'),s=I.sanct,t=I.town;
   temple({name:'Templo de Hera (el más antiguo)',x:s.x-60,z:s.z+20,rot:Math.PI/2,W:24.5,L:54.3,nW:9,nL:18,colD:1.45,colH:6.4,gy:s.h,roofMat:M.tile,cella:{w:13,l:34,door:3}});
   temple({name:'Segundo templo de Hera',x:s.x+10,z:s.z+20,rot:Math.PI/2,W:24.3,L:59.9,nW:6,nL:14,colD:2,colH:8.9,gy:s.h,roofMat:M.tile,cella:{w:13,l:36,door:3,antis:4,antisCols:true}});
   temple({name:'Templo de Atenea',x:s.x+30,z:s.z-120,rot:Math.PI/2,W:14.5,L:32.9,nW:6,nL:13,colD:1.25,colH:6.1,gy:s.h,roofMat:M.tile,cella:{w:8,l:18,door:2.6}});
   romanTemple({x:t.x,z:t.z-30,rot:0,W:12,L:22,pod:2.6,colD:0.8,colH:7,nW:4,deep:2,name:'Templo del foro de Paestum'});forumR(t.x,t.z+10,40,26,'Foro de Paestum');destHouses(I,t.x,t.z,20,70,true);
   {const g=new THREE.SphereGeometry(0.2,6,5);g.translate(0,0.6,0);for(let i=0;i<220;i++){const x=t.x+80+(i%22)*2.2,z=t.z-40+Math.floor(i/22)*3;piece('rosa',g,lam(i%3?'#c9466e':'#e6789a'),x,terrainH(x,z),z,0,1,1,1);}}
   place('templos_paestum','Los templos de Posidonia','POSEIDONIA','Tres grandes templos dóricos de los griegos de Síbaris, que fundaron aquí Posidonia, la ciudad de Poseidón, hacia el 600 a.C. El más antiguo tiene nueve columnas en la fachada, algo muy raro. Sus columnas engordan en el centro y sus capiteles son anchos como mesas. Estaban dedicados probablemente a Hera y a Atenea. Cuando los veas, ya serán más antiguos que la propia República romana.',s.x-20,s.z+60,0);
   place('posidonia','De Posidonia a Paestum','PAESTVM','Hacia el 400 a.C. los lucanos, un pueblo itálico de las montañas, se hicieron con la ciudad griega. Un escritor griego contó que los posidoniatas se reunían una vez al año a llorar, en griego, la lengua y las costumbres que habían perdido. En el 273 a.C. Roma fundó aquí una colonia latina, Paestum, que le fue fiel incluso cuando Aníbal recorría Italia.',t.x+20,t.z-50,0);
   place('rosas_paestum','Las rosas de Paestum','ROSARIA PAESTI','Virgilio y Propercio cantaron los rosales de Paestum, que florecen dos veces al año. Las rosas se venden en Roma para coronas, perfumes y banquetes, y las guirnaldas de los dioses.',t.x+80,t.z-50,0);
   place('brucio','Lucania y el Brucio','BRVTTII','Más al sur, la punta de Italia es el Brucio, tierra de bosques: la pez del monte Sila calafatea los barcos de medio Imperio. Allí está Regio, junto al estrecho donde los marineros dicen que viven Escila y Caribdis. Los brucios se pasaron a Aníbal, y Roma los castigó: durante mucho tiempo sirvieron como criados de los magistrados.',I.arrive.x+30,I.arrive.z+30,0);
   romaArrive(I,'Paestum');NPC_POS.hostilia=[t.x+70,t.z-34,Math.PI/2];
   romaVillagers(I,t.x,t.z+20,5,['Las rosas de aquí florecen dos veces al año. Las vendemos en Roma.','Estos templos ya eran viejos cuando Aníbal pasó por aquí.','En verano, la llanura se llena de mosquitos. Mejor vivir en la colina.','La pez del Sila calafatea medio Imperio.']);}
  // ---------------------------------------- IV. Samnium: Saepinum
  {const I=G('samnium'),t=I.town;
   rectWall(t.x,t.z,220,240,lam('#b5a98e'),6);
   {const ga=lam('#c9bc9f');for(const[x,z]of[[t.x,t.z-120],[t.x,t.z+120]]){arch({x,z,rot:0,W:8,D:3,H:9});for(const s of[-1,1])statue(x+s*2.2,terrainH(x,z)+4.5,z+(z<t.z?-1.6:1.6),z<t.z?Math.PI:0,0.9,'marble');}}
   forumR(t.x+20,t.z,46,26,'Foro de Saepinum');basilica({x:t.x+20,z:t.z-40,rot:0,L:36,D:18,name:'Basílica de Saepinum'});
   theatre({x:t.x-70,z:t.z+80,rot:0,R0:8,R1:24,H:11,name:'Teatro de Saepinum',noPlays:true});destHouses(I,t.x,t.z,26,90,true,{inside:(x,z)=>Math.abs(x-t.x)<100&&Math.abs(z-t.z)<110&&Math.abs(x-t.x)>8});
   drapeStrip(t.x,I.z-I.R*1.2,t.x,I.z+I.R*1.2,14,new THREE.MeshLambertMaterial({color:'#8f9a62'}),0.08);   // el tratturo, la cañada de los rebaños
   {const fl=grp(t.x,terrainH(t.x,t.z+200),t.z+200,0);for(let i=0;i<30;i++)sheep(fl,rr(-6,6),rr(-30,30));}
   {const p=I.pietra;romanTemple({x:p.x,z:p.z,rot:Math.PI/2,W:12,L:20,pod:3,colD:0.8,colH:6,nW:4,deep:2,name:'Santuario de Pietrabbondante'});}
   place('saepinum','Saepinum','SAEPINVM','Un pueblo pequeño en un valle de montaña, en el corazón del antiguo Samnio. Sus murallas con torres las pagaron Tiberio y su hermano Druso en tiempos de Augusto, como dice la inscripción de las puertas, donde hay estatuas de bárbaros prisioneros. Dentro: un foro, una basílica, un teatro, termas, tiendas. Todo lo necesario para vivir como en Roma, pero con más ovejas.',t.x+10,t.z-100,0);
   place('tratturo','El camino de los rebaños','CALLIS','La calle principal de Saepinum es también un camino de trashumancia: cada otoño bajan por aquí miles de ovejas desde los montes del Samnio a los pastos de invierno de Apulia, y en primavera vuelven a subir. Los rebaños son de grandes propietarios, a veces del propio emperador, y los pastores son a menudo esclavos.',t.x+12,t.z+130,0);
   place('guerras_samnitas','Las guerras samnitas','SAMNITES','Los samnitas fueron los enemigos más duros de Roma en Italia: tres guerras, entre el 343 y el 290 a.C. En el 321 atraparon a un ejército romano en el desfiladero de Caudio y lo hicieron pasar bajo el yugo, una humillación que Roma no olvidó. En el 82 a.C., Sila los derrotó a las puertas de Roma y se vengó con matanzas.',I.arrive.x+30,I.arrive.z-30,0);
   place('pietrabbondante','El santuario samnita','PIETRABBONDANTE','En aquella cumbre está el gran santuario de los samnitas, con un templo y un teatro juntos, donde se reunían los jefes de su liga. Se abandonó tras la guerra de los aliados, cuando los samnitas lucharon contra Roma por la ciudadanía. Hoy apenas sube nadie.',I.pietra.x-14,I.pietra.z+14,0);
   romaArrive(I,'Saepinum');NPC_POS.gavio=[t.x+8,t.z+150,Math.PI];
   romaVillagers(I,t.x+20,t.z+30,5,['Mi abuelo todavía hablaba osco en casa.','Los rebaños bajan a Apulia en otoño y pasan justo por la puerta del pueblo.','Aquí no hay mar ni grandes señores: piedras, ovejas y frío.','Los recaudadores del emperador cuentan las ovejas mejor que nosotros.']);}
  // ---------------------------------------- V. Picenum: Asculum
  {const I=G('picenum'),t=I.town;
   {const pts=[];for(let i=0;i<=30;i++){const tt=i/30;pts.push([I.x-I.R*1.2+tt*I.R*2.4,I.z-140+Math.sin(tt*5)*20]);}riverRibbon(pts,16);const bz=I.z-140+Math.sin(0.5*5)*20;
    box(8,1,24,TRAV2,t.x,terrainH(t.x,bz-14)+0.6,bz);addPlat(t.x,bz,8,24,0,terrainH(t.x,bz-14)+1.1);for(const s of[-1,1])box(0.5,1,24,TRAV2,t.x+s*3.8,terrainH(t.x,bz)+1.6,bz);}
   romanTemple({x:t.x+30,z:t.z+10,rot:Math.PI,W:12,L:20,pod:2.8,colD:0.8,colH:7,nW:4,deep:2,podMat:TRAV,name:'Templo de Asculum'});forumR(t.x-20,t.z+20,36,22,'Foro de Asculum');destHouses(I,t.x,t.z,30,80,true);
   place('asculum','Asculum y la guerra de los aliados','ASCVLVM','En el 91 a.C., los habitantes de Asculum mataron en el teatro al magistrado romano y a todos los romanos de la ciudad: empezó la guerra de los aliados, los pueblos de Italia que pedían la ciudadanía romana. Pompeyo Estrabón, padre de Pompeyo Magno, tomó la ciudad en el 89 tras un largo asedio. Roma ganó la guerra, pero acabó dando la ciudadanía a casi todos los italianos.',t.x+10,t.z-30,0);
   place('ventidio','El niño cautivo que fue cónsul','VENTIDIVS','Entre los prisioneros de Asculum desfiló en el triunfo de Pompeyo Estrabón un niño, Publio Ventidio. De mayor fue arriero de mulas para el ejército, se ganó la confianza de César, llegó a cónsul y en el 38 a.C. venció a los partos. Fue el primer romano que celebró un triunfo sobre ellos: había entrado en Roma como cautivo en un triunfo y volvió como triunfador.',t.x-40,t.z-10,0);
   place('salaria','La Vía Salaria','VIA SALARIA','Por este camino los sabinos llevaban la sal desde la desembocadura del Tíber hacia el interior, y de ahí su nombre. Hoy une Roma con Asculum y el Adriático. El puente sobre el río Tronto es de la época de Augusto.',t.x,I.z-120,0);
   place('picenos','Los picenos y el pájaro carpintero','PICENTES','Según la leyenda, los antepasados de los picenos llegaron aquí desde la Sabina guiados por un pájaro carpintero, el picus, el ave de Marte: de ahí su nombre. El Piceno es tierra de olivos, y sus aceitunas se sirven en las mejores mesas de Roma.',I.arrive.x+30,I.arrive.z-30,0);
   romaArrive(I,'Asculum');NPC_POS.ventidio_nieto=[t.x-30,t.z+4,0];
   romaVillagers(I,t.x+10,t.z+20,5,['Las aceitunas del Piceno son las mejores: pregunta en cualquier mesa de Roma.','El pájaro carpintero guió a nuestros antepasados hasta aquí.','Mi bisabuelo vio arder la ciudad en la guerra contra Roma. Ahora somos más romanos que nadie.','El travertino de nuestras canteras es tan bueno como el de Tíbur.']);}
  // ---------------------------------------- VI. Umbria et Ager Gallicus: Ariminum
  {const I=G('umbria'),t=I.town;
   arch({x:t.x,z:t.z+110,rot:0,W:17,D:4,H:17});
   {const pts=[];for(let i=0;i<=30;i++){const tt=i/30;pts.push([I.x-I.R*1.2+tt*I.R*2.4,I.z-80+Math.sin(tt*4)*14]);}riverRibbon(pts,26);const bz=I.z-80+Math.sin(0.5*4)*14,bx=t.x+40,gy=terrainH(bx,bz-20);
    const g=grp(bx,gy,bz,0);box(9,1.4,44,lam('#ddd5c4'),0,1.3,0,g);for(let i=0;i<5;i++)box(9,1.6,1.4,lam('#d5ccba'),0,0.3,-16+i*8,g);for(const s of[-1,1])box(0.5,1,44,lam('#ddd5c4'),s*4.3,2.4,0,g);addPlat(bx,bz,9,44,0,gy+2);for(const s of[-1,1])addSeg(bx+s*4.3,bz-22,bx+s*4.3,bz+22,0.3);}
   forumR(t.x,t.z+20,44,26,'Foro de Ariminum');romanTemple({x:t.x-40,z:t.z-20,rot:Math.PI/2,W:12,L:22,pod:2.8,colD:0.8,colH:7,nW:4,deep:2,name:'Templo de Ariminum'});destHouses(I,t.x,t.z,30,90,true);
   place('arco_augusto','El Arco de Augusto','ARCVS AVGVSTI','El Senado dedicó este arco a Augusto en el 27 a.C., cuando restauró la Vía Flaminia y las principales calzadas de Italia. Aquí termina la Flaminia, que viene de Roma. En los medallones, Júpiter, Apolo, Neptuno y la diosa Roma.',t.x+14,t.z+120,0);
   place('puente_tiberio','El puente de Tiberio','PONS TIBERII','Cinco arcos de piedra de Istria sobre el río Ariminus. Lo empezó Augusto en el 14 d.C. y lo terminó Tiberio en el 21. Desde aquí sale la Vía Emilia hacia Placentia, por la llanura del Po. Este puente seguirá en uso dos mil años después.',t.x+52,I.z-50,0);
   place('rubicon','El Rubicón','RVBICO','Unas millas al norte corre el Rubicón, un riachuelo que marcaba la frontera entre Italia y la provincia de la Galia Cisalpina. Un general no podía cruzarlo con su ejército. César lo cruzó en enero del 49 a.C. diciendo, según Suetonio, «la suerte está echada», y empezó la guerra civil. Se cuenta que arengó a sus soldados en el foro de Ariminum.',t.x-10,t.z+50,0);
   place('umbros','Umbros y galos','VMBRI','Los umbros eran un pueblo antiguo de los montes; en Iguvium guardan unas tablas de bronce con sus ritos escritos en su lengua. Esta costa, en cambio, fue de los galos senones hasta que Roma los venció en el 283 a.C.: por eso la llaman el «campo galo». Ariminum es colonia latina desde el 268.',I.arrive.x+30,I.arrive.z-30,0);
   romaArrive(I,'Ariminum');NPC_POS.cesio=[t.x+8,t.z+96,Math.PI];
   romaVillagers(I,t.x,t.z+30,5,['Aquí termina la Flaminia y empieza la Emilia: todo el mundo pasa por Ariminum.','Dicen que César habló a sus soldados en este mismo foro.','El pescado del Adriático es mejor que el del Tíber.','Del puerto salen barcos hacia Istria y Dalmacia.']);}
  // ---------------------------------------- VII. Etruria: Tarquinii
  {const I=G('etruria'),c=I.civ,n=I.necro;
   {const a=I.ara;box(36,4,30,TUFA,a.x,a.h+1,a.z);addPlat(a.x,a.z,36,30,0,a.h+3);for(const[x1,z1,x2,z2]of[[-18,-15,18,-15],[-18,15,18,15],[-18,-15,-18,15],[18,-15,18,-5.2],[18,5.2,18,15]])addSeg(a.x+x1,a.z+z1,a.x+x2,a.z+z2,0.6);   // tres lados cerrados y, delante, una escalinata de tufo para subir a pie
    {const sg=grp(a.x,a.h,a.z,Math.PI/2);stairs(sg,{x:a.x,z:a.z},0,18,10,3,a.h,Math.PI/2,TUFA);}romanTemple({x:a.x,z:a.z,rot:Math.PI/2,W:22,L:26,pod:2,colD:1.2,colH:7,nW:4,deep:2,order:'tuscan',gy:a.h+3,roofMat:M.tile,name:'Gran templo de Tarquinii'});}
   destHouses(I,c.x,c.z,24,60,true);
   for(let i=0;i<14;i++){const a=R()*TAU,d=rr(10,70);tumulus(n.x+Math.cos(a)*d,n.z+Math.sin(a)*d,rr(4,8),rr(2,4),'#8a8f5a');}
   {const x=n.x,z=n.z,gy=n.h,W=6,D=5,Hh=3;const tex=canvasTex(512,128,(g)=>{g.fillStyle='#e9d9b6';g.fillRect(0,0,512,128);g.fillStyle='#9a2f22';g.fillRect(0,0,512,10);g.fillRect(0,118,512,10);
      for(let i=0;i<4;i++){const ox=20+i*125;g.fillStyle='#a8392b';g.fillRect(ox,70,90,10);g.fillStyle='#c97a4a';g.beginPath();g.arc(ox+30,50,10,0,TAU);g.fill();g.fillRect(ox+20,58,22,16);g.fillStyle='#2f5a4a';g.fillRect(ox+44,60,30,8);g.fillStyle='#c97a4a';g.beginPath();g.arc(ox+70,48,9,0,TAU);g.fill();}
      g.strokeStyle='#5f7f3a';g.lineWidth=4;for(let i=0;i<8;i++){g.beginPath();g.moveTo(i*64+32,110);g.lineTo(i*64+32,90);g.stroke();}});
     const wm=new THREE.MeshLambertMaterial({map:tex,side:THREE.DoubleSide});
     for(const[w,d,lx,lz,ry]of[[W,0.3,0,-D/2,0],[0.3,D,-W/2,0,0],[0.3,D,W/2,0,0]]){const m=new THREE.Mesh(new THREE.BoxGeometry(w,Hh,d),[wm,wm,lam('#9a8a6a'),lam('#9a8a6a'),wm,wm]);m.position.set(x+lx,gy+Hh/2,z+lz);scene.add(m);}
     box(W+0.6,0.4,D+0.6,lam('#8a7a5a'),x,gy+Hh+0.2,z);for(const s of[-1,1])box((W-1.6)/2,Hh,0.3,lam('#7a6a4a'),x+s*(W/4+0.4),gy+Hh/2,z+D/2);
     addSeg(x-W/2,z-D/2,x+W/2,z-D/2,0.2);addSeg(x-W/2,z-D/2,x-W/2,z+D/2,0.2);addSeg(x+W/2,z-D/2,x+W/2,z+D/2,0.2);addSeg(x-W/2,z+D/2,x-0.8,z+D/2,0.2);addSeg(x+0.8,z+D/2,x+W/2,z+D/2,0.2);
     const mo=new THREE.Mesh(new THREE.SphereGeometry(7,24,10,0,TAU,0,Math.PI/2),lam('#8a8f5a'));mo.scale.y=0.55;mo.position.set(x,gy+Hh-0.6,z-1);scene.add(mo);
     footprints.push({x,z,w:W,d:D,a:0,c:'#9a8a6a',name:'Tumba pintada'});
     place('tumbas_pintadas','Las tumbas pintadas','MONTEROZZI','En esta colina, frente a la ciudad, los etruscos de Tarquinii enterraron a sus muertos durante siglos en cámaras excavadas en la roca, bajo túmulos de tierra. Las paredes de muchas están pintadas: banquetes, músicos, bailarines, juegos atléticos, cacerías. Entra en esta: los antepasados siguen de fiesta para siempre. Algunas familias todavía honran aquí a los suyos.',x+6,z+8,0);}
   place('haruspices','Los harúspices','HARVSPICES','Los etruscos son los maestros de la «disciplina etrusca»: saben leer la voluntad de los dioses en el hígado de los animales sacrificados y en los rayos. Roma sigue consultando a sus harúspices, y el emperador Claudio, que escribió veinte libros de historia etrusca, reorganizó su colegio de sesenta. El harúspice Espurinna, de una familia de aquí, avisó a César de los idus de marzo.',c.x+20,c.z+40,0);
   place('tarquinios','La ciudad de los Tarquinios','TARQVINII','De aquí salió Lucumón, hijo de un noble de Corinto refugiado en Etruria, que se fue a Roma con su mujer Tanaquil y llegó a ser el rey Tarquinio Prisco. Su familia dio a Roma su último rey, Tarquinio el Soberbio. Tarquinii fue una de las grandes ciudades de la liga etrusca; hoy es un municipio romano tranquilo.',c.x-30,c.z+20,0);
   place('ara_regina','El gran templo','TEMPLVM','Un templo etrusco de los antiguos, con un podio enorme, columnas toscanas muy separadas y un tejado de madera adornado con terracotas pintadas, entre ellas una pareja de caballos alados. Mucho más tarde, en la Edad Media, la gente llamará a sus ruinas «el altar de la reina».',I.ara.x+22,I.ara.z+8,0);
   place('lengua_etrusca','Una lengua que se apaga','RASNA','Los etruscos se llaman a sí mismos rasna. Su lengua no se parece al latín ni al griego, aunque la escriben con un alfabeto tomado de los griegos, de derecha a izquierda. Hace siglos, dice Livio, los niños romanos nobles aprendían etrusco como ahora aprenden griego. Hoy casi nadie lo habla: solo los viejos de algunas familias y los harúspices, que leen sus libros sagrados en la lengua antigua. Los historiadores modernos podrán leer sus inscripciones, pero entenderán muy poco.',c.x-22,c.z+18,0);
   place('doce_pueblos','Los doce pueblos','FANVM VOLTVMNAE','Las grandes ciudades etruscas, como Tarquinii, Veyes, Caere, Volsinii, Vulci o Clusium, formaban una liga de doce pueblos. Cada año sus jefes se reunían en el santuario de Voltumna, cerca de Volsinii, para celebrar fiestas y juegos y, a veces, decidir la guerra. Roma las fue venciendo una a una: Veyes cayó en el 396 a.C., tras diez años de asedio. En tiempos de Augusto, Etruria pasó a ser la séptima región de Italia.',c.x+30,c.z-20,0);
   place('mujeres_etruscas','Las mujeres etruscas','TANAQVIL','A los griegos les escandalizaba que las mujeres etruscas comieran recostadas junto a sus maridos en los banquetes, como se ve en las pinturas de las tumbas, y que asistieran a los juegos. Tenían su propio nombre, no solo el de la familia, y a menudo aparecen en las inscripciones de los sepulcros. Livio cuenta que fue Tanaquil, la esposa etrusca de Tarquinio Prisco, quien sabía leer los presagios y quien hizo rey a su marido, y después a Servio Tulio.',c.x-30,c.z-14,0);
   romaArrive(I,'Tarquinii');NPC_POS.spurinna=[c.x+10,c.z+30,0];
   romaVillagers(I,c.x,c.z+10,5,['Mi familia es etrusca desde antes de Roma. Todavía leemos los libros del rayo.','En las tumbas de los antepasados hay banquetes pintados que nunca se acaban.','Pocos hablan ya etrusco. Los viejos, y los harúspices.','El vino de Graviscae, el puerto, es flojo; el aceite, bueno.']);}
  // ---------------------------------------- VIII. Aemilia: Mutina
  {const I=G('aemilia'),t=I.town;
   drapeStrip(I.x-I.R*1.2,I.z+60,I.x+I.R*1.2,I.z+60,7,new THREE.MeshLambertMaterial({color:'#8f8778'}),0.1);for(let i=-6;i<=6;i++){const x=I.x+i*90,z=I.z+66;const m=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.4,1.8,10),TRAV);m.position.set(x,terrainH(x,z)+0.9,z);scene.add(m);addCirc(x,z,0.5);}
   {const mt=new THREE.MeshLambertMaterial({color:'#a59a72'});for(let i=-7;i<=7;i++){{drapeStrip(I.x+i*71,I.z-I.R*1.2,I.x+i*71,I.z+I.R*1.2,1.4,mt,0.05);drapeStrip(I.x-I.R*1.2,I.z+i*71,I.x+I.R*1.2,I.z+i*71,1.4,mt,0.05);}}}
   for(let i=-6;i<6;i++)for(let j=-6;j<6;j++){if(R()<0.4)continue;const x=I.x+(i+0.5)*71,z=I.z+(j+0.5)*71;if(Math.hypot(x-t.x,z-t.z)<130||Math.abs(z-I.z-60)<40)continue;const m=new THREE.Mesh(new THREE.PlaneGeometry(64,64),lam(pick(['#b8a865','#8f9a52','#a8a070','#c2b27a'])));m.rotation.x=-Math.PI/2;m.position.set(x,terrainH(x,z)+0.04,z);scene.add(m);}
   rectWall(t.x,t.z,160,180,BRICK,6);forumR(t.x,t.z,40,26,'Foro de Mutina');romanTemple({x:t.x,z:t.z-50,rot:0,W:12,L:22,pod:2.8,colD:0.8,colH:7,nW:4,deep:2,name:'Templo de Mutina'});destHouses(I,t.x,t.z,26,75,true,{inside:(x,z)=>Math.abs(x-t.x)<72&&Math.abs(z-t.z)<82});
   place('via_emilia','La Vía Emilia','VIA AEMILIA','El cónsul Marco Emilio Lépido la trazó en el 187 a.C., recta como una regla, desde Ariminum hasta Placentia, a orillas del Po: unos 260 kilómetros. A lo largo de ella se fundaron colonias cada pocas jornadas: Bononia, Mutina, Parma, Regium. Toda la región ha tomado su nombre.',I.x-40,I.z+76,0);
   place('centuriacion','Los campos en cuadrícula','CENTVRIATIO','Cuando se funda una colonia, los agrimensores dividen el campo con la groma en grandes cuadrados de veinte actus, unos 710 metros de lado, separados por caminos rectos: los cardines y los decumanos. Cada cuadrado se reparte entre cien lotes. Dos mil años después, desde el aire, se seguirán viendo estos cuadros en la llanura del Po.',I.x+150,I.z+120,0);
   place('guerra_mutina','La guerra de Mutina','BELLVM MVTINENSE','En el 43 a.C., tras el asesinato de César, Marco Antonio sitió aquí a Décimo Bruto. El Senado, empujado por los discursos de Cicerón, envió contra él a los dos cónsules, Hircio y Pansa, y al joven Octaviano. Antonio fue derrotado, pero los dos cónsules murieron, y Octaviano se quedó con sus ejércitos: fue el primer paso hacia su poder.',t.x+30,t.z+60,0);
   place('lana_mutina','La lana de Mutina','LANA','Colonia romana desde el 183 a.C., Mutina vive del campo y del ganado. Sus lanas, blancas y finas, son famosas en Roma, igual que las de Parma. En la llanura se crían también cerdos que alimentan a la ciudad de Roma.',t.x-50,t.z-70,0);
   romaArrive(I,'Mutina');NPC_POS.agrimensor=[I.x+150,I.z+132,Math.PI];
   romaVillagers(I,t.x,t.z+20,5,['Desde que trazaron los campos en cuadros, cada uno sabe dónde termina lo suyo.','La lana de Mutina es blanquísima.','Por la Emilia pasan legiones hacia el Rin y el Danubio.','Mi abuelo recibió su lote de tierra al licenciarse de la legión.']);}
  // ---------------------------------------- IX. Liguria: Genua
  {const I=G('liguria'),t=I.town;
   const sh=shoreAlong(t.x,t.z,0,1,400);makeShip(sh[0]+20,sh[1]+30,0);box(8,4,30,lam('#9a8e7a'),sh[0]-20,-0.5,sh[1]+12);addPlat(sh[0]-20,sh[1]+12,8,30,0,1.5);
   for(let k=0;k<7;k++){const z=t.z-90-k*22,y=terrainH(t.x+60,z);box(90,2,4,lam('#8f8576'),t.x+60,y-0.6,z+2);for(let i=0;i<18;i++){const x=t.x+20+i*5;box(1,1.2,1,lam('#5e7a3a'),x,y+0.6,z-2);}}
   romanTemple({x:t.x-40,z:t.z-30,rot:0,W:10,L:18,pod:2.4,colD:0.7,colH:6,nW:4,deep:2,name:'Templo de Genua'});destHouses(I,t.x,t.z,26,70,true);
   {const x=t.x+20,z=t.z+20;box(0.4,2,0.4,M.wood,x,terrainH(x,z)+1,z);box(1.4,1,0.12,M.bronze,x,terrainH(x,z)+2.2,z+0.25);addCirc(x,z,0.6);
    place('tabla_polcevera','La tabla de bronce del Polcevera','SENTENTIA MINVCIORVM','En el 117 a.C., los genuates y sus vecinos del valle del Polcevera discutían por unas tierras. El Senado envió a dos hermanos, los Minucios Rufos, que dictaron una sentencia: qué campos eran públicos, cuánto vino y trigo se pagaba por ellos y por dónde pasaban los límites, de mojón en mojón. La grabaron en bronce. Se encontrará en 1506, y es uno de los documentos más antiguos sobre el campo de Italia.',x+4,z+4,0);}
   place('genua','Genua','GENVA','El puerto de los ligures, aliado de Roma desde antiguo. Los cartagineses lo destruyeron en el 205 a.C. y los romanos lo reconstruyeron. Aquí bajan de los montes la madera, el ganado, la miel y las pieles, y llegan el aceite y el vino del sur.',sh[0]-10,sh[1]-20,0);
   place('ligures','Los ligures','LIGVRES','Los ligures de los montes resistieron a Roma durante más de un siglo. Diodoro cuenta que viven de una tierra pobre que hay que romper a golpes, que las mujeres trabajan como los hombres y que son pequeños, flacos y durísimos. Sus laderas están cortadas en bancales de piedra seca.',t.x+60,t.z-80,0);
   place('via_aurelia','La costa ligur','VIA AVRELIA','La Vía Aurelia, que sale de Roma por la costa de Etruria, sigue hasta aquí y continúa hacia la Galia por una costa de acantilados. Augusto la prolongó con la Vía Julia Augusta y venció a los últimos pueblos de los Alpes: en La Turbie, junto al mar, se alza su trofeo.',I.arrive.x+30,I.arrive.z-30,0);
   romaArrive(I,'Genua');NPC_POS.veturia=[sh[0]-14,sh[1]-8,Math.PI];
   romaVillagers(I,t.x,t.z+10,5,['En nuestros montes no se cultiva: se arranca la tierra a la piedra, bancal a bancal.','La madera de Liguria hace los mejores barcos.','Los de la costa somos marineros; los del monte, duros como sus robles.','En invierno el puerto se llena de barcos que esperan el buen tiempo.']);}
  // ---------------------------------------- X. Venetia et Histria: Verona
  {const I=G('venetia'),t=I.town;
   {const pts=[];for(let i=0;i<=40;i++){const a=-Math.PI*0.9+i/40*Math.PI*1.3;pts.push([t.x+40+Math.cos(a)*170,t.z-60+Math.sin(a)*150]);}riverRibbon(pts,30,'#4f8a86',1);}   // el Adigio rodea Verona en un meandro: se queda como está
   amphi(I.arena.x,I.arena.z,0,60,49,18,'Arena de Verona');
   {const h=I.thea;theatre({x:h.x,z:h.z+20,rot:0,R0:10,R1:30,H:14,name:'Teatro de Verona',noPlays:true});}
   rectWall(t.x,t.z,180,170,BRICK,7);forumR(t.x,t.z,44,26,'Foro de Verona');romanTemple({x:t.x,z:t.z-50,rot:0,W:16,L:28,pod:3.5,colD:1,colH:9,nW:6,deep:2,name:'Capitolio de Verona'});destHouses(I,t.x,t.z,30,80,true,{inside:(x,z)=>Math.abs(x-t.x)<82&&Math.abs(z-t.z)<78});
   place('arena_verona','La arena de Verona','AMPHITHEATRVM','Un gran anfiteatro de piedra rosada del Valpolicella, construido hace unos cincuenta años, fuera de las murallas: caben unas treinta mil personas, más que veroneses hay en la ciudad. Viene gente de todos los pueblos de los alrededores a ver los combates de gladiadores y las cacerías.',I.arena.x+66,I.arena.z,0);
   place('catulo','La ciudad de Catulo','CATVLLVS','Aquí nació, hacia el 84 a.C., el poeta Catulo, que en Roma se enamoró de una mujer a la que llamó Lesbia y le escribió versos que todavía se recitan: «Odio y amo. Quizá me preguntes por qué lo hago. No lo sé, pero siento que ocurre, y me atormento». Su familia tenía una villa en el lago Benaco, en Sirmio.',t.x+30,t.z+60,0);
   place('aquileia_patavium','Patavium y Aquileya','PATAVIVM · AQVILEIA','Al este están Patavium, donde nació Tito Livio, el gran historiador de Roma (Asinio Polión se burlaba de su acento paduano), y Aquileya, colonia desde el 181 a.C. y gran puerto del Adriático: allí llega el ámbar del Báltico. Más allá, en Istria, Pola tiene también su anfiteatro, que se está ampliando.',I.arrive.x+30,I.arrive.z-30,0);
   place('vénetos','Los vénetos','VENETI','Los vénetos, aliados de Roma desde antiguo contra los galos, decían descender de los énetos de Paflagonia que llegaron con Antenor tras la guerra de Troya. Eran famosos criadores de caballos: con caballos vénetos ganó un espartano en Olimpia, según Estrabón.',I.thea.x-10,I.thea.z+50,0);
   romaArrive(I,'Verona');NPC_POS.valeria=[t.x+20,t.z+30,0];
   romaVillagers(I,t.x,t.z+10,5,['En la arena caben más veroneses de los que viven en Verona.','Los caballos vénetos ganaban carreras hasta en Olimpia.','El ámbar del norte llega a Aquileya y de allí a toda Italia.','Catulo era de aquí. Mi abuela se sabía de memoria sus versos más indecentes.']);}
  // ---------------------------------------- XI. Transpadana: Comum
  {const I=G('transpadana'),t=I.town;
   rectWall(t.x,t.z,150,150,lam('#b9ad92'),6);forumR(t.x,t.z,36,24,'Foro de Comum');romanTemple({x:t.x,z:t.z-44,rot:0,W:12,L:20,pod:2.8,colD:0.8,colH:7,nW:4,deep:2,name:'Templo de Comum'});destHouses(I,t.x,t.z,24,65,true,{inside:(x,z)=>Math.abs(x-t.x)<68&&Math.abs(z-t.z)<68});
   {const v=I.villa;blockBuilding({name:'Villa junto al lago',x:v.x,z:v.z,rot:Math.PI/2,w:30,d:14,h:7,mat:PLAST});porticus(v.x+10,v.z-16,v.x+10,v.z+16,5,4.6,'tuscan',1);}
   const sh=shoreAlong(t.x,t.z,1,-0.4,500);{const b=grp(sh[0]+12,-2,sh[1],0);box(2.4,1,9,M.wood,0,0.5,0,b);}
   place('comum','Comum y el lago Lario','COMVM · LARIVS','Novum Comum lo fundó César en el 59 a.C. con cinco mil colonos, entre ellos quinientos griegos ilustres. Está en la punta del lago Lario, largo y estrecho entre montañas, por el que se navega hacia los pasos de los Alpes. Los ricos de la ciudad tienen villas en sus orillas.',t.x+30,t.z+60,0);
   place('plinio_viejo','Plinio el Viejo','PLINIVS','Aquí nació, hacia el 23 d.C., Gayo Plinio Segundo: soldado, abogado, procurador, almirante y sobre todo lector incansable. Escribió una Historia natural en treinta y siete libros sobre todo lo que se sabía del mundo, que dedicó a Tito hace tres años. Murió el año pasado en la erupción del Vesubio, por querer verla de cerca y ayudar a los que huían.',t.x-30,t.z+60,0);
   place('plinio_joven','Plinio el Joven','PLINIVS CAECILIVS','Su sobrino y heredero, Gayo Plinio Cecilio Segundo, nació aquí hacia el 61. Ahora tiene unos dieciocho años y estudia retórica en Roma con Quintiliano. Será abogado, cónsul y gobernador, y dejará diez libros de cartas, en las que hablará de sus villas del lago: a una la llamará «Tragedia» y a otra «Comedia».',I.villa.x+12,I.villa.z+20,0);
   place('transpadanos','Los transpadanos','TRANSPADANI','Los pueblos al norte del Po recibieron el derecho latino en el 89 a.C. y la ciudadanía romana completa en el 49, gracias a César. La gran ciudad de la región es Mediolanum, en la llanura. Al norte, por los Alpes, se va a la Retia y a la Galia; Augusto venció a los salasos y fundó Augusta Pretoria para guardar los pasos.',I.arrive.x+30,I.arrive.z-30,0);
   romaArrive(I,'Comum');NPC_POS.hermes_liberto=[t.x-20,t.z+50,0];
   romaVillagers(I,t.x,t.z+10,5,['El lago es tan largo que sus orillas parecen dos países.','Los Plinios son de aquí: el tío y el sobrino.','De Mediolanum a los pasos de los Alpes hay solo unos días; de ahí, la Galia.','En invierno baja del norte un viento que corta la cara.']);}
  // ---------------------------------------- Hispania: Tarraco
  {const I=G('tarraco'),u=I.upper,l=I.lower;
   ringWall(u.x,u.z,95,[Math.PI/2,-Math.PI/2],lam('#a49580'),7,6);
   romanTemple({x:u.x,z:u.z-40,rot:0,W:22,L:34,pod:4,colD:1.3,colH:11,nW:8,deep:2,name:'Templo de Augusto (Tarraco)'});
   {// foro provincial, terminado con Vespasiano: recinto porticado del templo arriba y, abajo, la plaza del concilio de la provincia
    const gy=u.h+0.1;box(110,1,60,TRAV2,u.x,u.h+0.2,u.z+20);addPlat(u.x,u.z+20,110,60,0,u.h+0.7);
    porticus(u.x-40,u.z-77,u.x+40,u.z-77,6,7,'corinthian',1,gy);porticus(u.x-43,u.z-74,u.x-43,u.z-12,6,7,'corinthian',-1,gy);porticus(u.x+43,u.z-74,u.x+43,u.z-12,6,7,'corinthian',1,gy);
    porticus(u.x-55,u.z-6,u.x-55,u.z+46,6,6,'tuscan',-1,gy);porticus(u.x+55,u.z-6,u.x+55,u.z+46,6,6,'tuscan',1,gy);porticus(u.x-52,u.z+53,u.x+52,u.z+53,6,6,'tuscan',-1,gy);
    for(let i=0;i<7;i++)for(const sx of[-1,1]){const x=u.x+sx*44,z=u.z+i*7;box(1.3,1.8,1.3,TRAV,x,u.h+1.6,z);addCirc(x,z,0.9);}
    footprints.push({x:u.x,z:u.z+20,w:110,d:60,a:0,c:'#d8ccb4',name:'Foro provincial: plaza del concilio'});}
   arcadeLine(I.x-330,I.z-150,I.x-202,I.z-298,{H:24,span:8.6,dep:3.2,levels:[0.48,1],mat:lam('#c9b48e')});
   {// el circo, en obras: terraza alargada de este a oeste que separa el foro provincial de la ciudad baja (unos 325 × 115 m)
    const cx=I.x+40,cz=I.z-8,gy=I.circH,g=grp(cx,gy,cz,0),L=300,Wd=110,sm=lam('#c9b48e');
    box(L,0.3,Wd-24,lam('#b8a27a'),0,0.15,0,g);addPlat(cx,cz,L,Wd-24,0,gy+0.3);
    for(const sg of[-1,1]){const done=sg<0;for(let i=0;i<14;i++){const seg=L/14,x=-L/2+seg*(i+0.5),hh=done?7:(i%3===2?0:1.5+((i*7)%5)*0.9);if(hh<=0)continue;box(seg-0.4,hh,10,sm,x,hh/2,sg*(Wd/2-5),g);addBox(cx+x,cz+sg*(Wd/2-5),seg,10,0);}}   // la grada norte ya en pie, la sur a medio hacer
    box(170,1.1,6,lam('#b8a27a'),0,0.55,0,g);addBox(cx,cz,170,6,0);   // los cimientos de la espina
    for(let i=0;i<18;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,8,5),M.wood);p.position.set(-120+i*14,4,Wd/2-10.5);g.add(p);}for(const y of[2.5,5])box(250,0.12,1.2,M.wood,0,y,Wd/2-10.5,g);
    for(let k=0;k<6;k++){const w=makePerson({short:true,noHimation:true,chiton:['#8a7a5a','#a89070','#7a6a50'][k%3],hair:'#2a1e16',carry:k%2?'basket':null});w.position.set(cx-60+k*24,gy+0.3,cz+Wd/2-16);w.rotation.y=Math.PI;scene.add(w);}
    footprints.push({x:cx,z:cz,w:L,d:Wd,a:0,c:'#d8ccb0',name:'Circo de Tarraco (en obras)'});
    place('circo_tarraco','El circo, en obras','CIRCVS','Bajo la gran plaza del concilio se está construyendo un circo para las carreras de carros: una terraza alargada de unos 325 metros, metida entre la parte alta y la ciudad baja, que la separa de la plaza como una muralla. La grada del norte ya está en pie; la del sur y la espina, a medio hacer. Lo terminará el emperador Domiciano. Sus bóvedas seguirán en pie veinte siglos después, dentro de las casas de la ciudad.',cx+70,cz+Wd/2+6,0);}
   // el anfiteatro de madera, provisional, junto a la playa: donde hacia el año 100 se levantará el de piedra (vídeo de Roma: «debería tener anfiteatro»)
   {const ax=I.x+150,az=I.z+150,gy=I.amph?I.amph.h:islandBase(I,ax,az),g=grp(ax,gy,az,0.35),wd=lam('#8a6a44'),wd2=lam('#6e5236'),sand=lam('#d9c69a');
    const RX=32,RZ=24,N=40;const e=new THREE.Mesh(new THREE.CircleGeometry(1,40),sand);e.scale.set(RX-9,RZ-9,1);e.rotation.x=-Math.PI/2;e.position.y=0.06;g.add(e);
    for(let k=0;k<N;k++){const a0=k/N*TAU,a1=(k+1)/N*TAU,am=(a0+a1)/2;if(Math.abs(Math.sin(am))<0.08)continue;   // las dos entradas, en los extremos del eje mayor
      for(let t=0;t<4;t++){const f=(RX-8+t*2.2)/RX,x=Math.cos(am)*RX*f,z=Math.sin(am)*RZ*(RZ-8+t*2.2)/RZ,L=Math.hypot(Math.cos(a1)-Math.cos(a0),(Math.sin(a1)-Math.sin(a0))*RZ/RX)*RX*f+0.3,hh=1+t*0.9,b=box(L,hh,2.1,t%2?wd:wd2,x,hh/2,z,g);b.rotation.y=-Math.atan2(Math.cos(am)*RZ,-Math.sin(am)*RX);}
      const x=Math.cos(am)*(RX-0.6),z=Math.sin(am)*(RZ-0.6),p=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,5.2,6),wd2);p.position.set(x,2.6,z);g.add(p);
      const q=toW(Math.cos(a0)*(RX-0.6),Math.sin(a0)*(RZ-0.6),ax,az,0.35),r2=toW(Math.cos(a1)*(RX-0.6),Math.sin(a1)*(RZ-0.6),ax,az,0.35);addSeg(q[0],q[1],r2[0],r2[1],0.3);
      const q2=toW(Math.cos(a0)*(RX-9),Math.sin(a0)*(RZ-9),ax,az,0.35),r3=toW(Math.cos(a1)*(RX-9),Math.sin(a1)*(RZ-9),ax,az,0.35);addSeg(q2[0],q2[1],r3[0],r3[1],0.3);}
    footprints.push({x:ax,z:az,w:RX*2,d:RZ*2,a:0.35,c:'#a88a60',name:'Anfiteatro de madera de Tarraco'});
    for(let k=0;k<2;k++){const w=makePerson({chiton:'#b8a888',short:true,noHimation:true,hair:'#2a1e16'});const p=toW(-8+k*16,0,ax,az,0.35);w.position.set(p[0],gy+0.1,p[1]);scene.add(w);}
    place('anfiteatro_tarraco','El anfiteatro de madera','AMPHITHEATRVM LIGNEVM','Gradas de tablas sobre postes, alrededor de una arena de arena de playa: así son los anfiteatros provisionales que se montan para unos juegos y se desmontan después. Tarraco tendrá uno de piedra, aquí mismo, junto al mar, pero se construirá hacia el año 100, en tiempos de Trajano. (Lo de madera es una reconstrucción verosímil: sabemos que antes del de piedra los combates se daban en recintos provisionales o en el foro, pero no conocemos este en concreto.) En el anfiteatro de piedra morirán quemados en el 259 el obispo Fructuoso y sus diáconos.',ax-RX-4,az+6,0);}
   if(0)place('anfiteatro_tarraco','Aquí no hay todavía anfiteatro','AMPHITHEATRVM','Junto a la playa, fuera de las murallas, Tarraco tendrá su anfiteatro, pero no ahora: se construirá hacia el año 100, en tiempos de Trajano. En el 80 los combates de gladiadores se dan en recintos provisionales de madera o en el foro. En el anfiteatro morirán quemados en el 259 el obispo Fructuoso y sus diáconos.',I.x+120,I.z+170,0);
   theatre({x:l.x+50,z:l.z+20,rot:Math.PI,R0:10,R1:28,H:13,name:'Teatro de Tarraco',noPlays:true});forumR(l.x-20,l.z-10,40,24,'Foro de la colonia');destHouses(I,l.x,l.z,30,70,true);
   {const sh=shoreAlong(l.x,l.z,0,1,400);buildPort('tarraco','Tarraco',sh[0],sh[1],0,1);}
   romaArrive(I,'Tarraco',HISP_DRIVER);
   place('tarraco_capital','Tarraco, capital de la Hispania Citerior','TARRACO','Los hermanos Escipiones desembarcaron aquí en el 218 a.C., al empezar la guerra contra Aníbal, y la convirtieron en su base. Hoy es colonia y capital de la provincia más grande del Imperio, que va del Mediterráneo al Atlántico. Aquí reside el gobernador. Augusto pasó aquí el invierno del 26 al 25 a.C., enfermo, durante la guerra contra los cántabros.',l.x,l.z-40,0);
   place('templo_augusto_tarraco','El templo de Augusto','TEMPLVM DIVI AVGVSTI','En el 15 d.C., poco después de su muerte, los hispanos pidieron a Tiberio permiso para levantar aquí un templo al divino Augusto. Fue el primero de su clase en Occidente, como cuenta Tácito, y sirvió de ejemplo a otras provincias. Aquí se reúnen cada año los delegados de las ciudades de la provincia.',u.x+14,u.z-14,0);
   place('foro_provincial','El foro provincial, en obras','CONCILIVM PROVINCIAE','Los emperadores Flavios están transformando la parte alta de la ciudad en un gran conjunto en terrazas para el culto imperial y las reuniones de la provincia: arriba, el templo; en medio, una enorme plaza porticada; abajo, un circo para las carreras. Las obras durarán aún años.',u.x+60,u.z+40,0);
   place('murallas_tarraco','Las murallas de los Escipiones','MVRI','Las murallas de la ciudad alta se levantaron en tiempos de la guerra contra Aníbal y se ampliaron poco después: en la base hay bloques enormes sin labrar, sobre los que se construyó con sillares. Los romanos las hicieron con mano de obra de los íberos de la zona.',u.x-90,u.z+10,0);
   place('galba_tarraco','El gobernador que llegó a emperador','GALBA','Durante ocho años, desde el 60, gobernó la provincia desde aquí Servio Sulpicio Galba, un anciano noble y severo. En el 68, harto de Nerón, aceptó en Carthago Nova que lo llamaran general del Senado y del pueblo romano, y se puso en marcha hacia Roma con una legión nueva reclutada en Hispania, la que con el tiempo se llamará VII Gemina. Fue emperador solo siete meses: lo asesinaron en el Foro en enero del 69, al principio del año de los cuatro emperadores.',u.x-40,u.z-20,0);
   place('foro_provincial_tarraco','El foro de la provincia','CONCILIVM PROVINCIAE','En lo alto de la ciudad, los Flavios han terminado hace poco un conjunto enorme en terrazas: arriba, el templo dentro de un recinto con pórticos; debajo, una plaza de unos trescientos metros de largo rodeada de pórticos, donde se reúne cada año el concilio de la provincia, con delegados de todas sus ciudades. En la plaza se alinean pedestales con estatuas de los flamines, los sacerdotes del culto imperial de la provincia.',u.x+20,u.z+44,0);
   place('tarraco_futuro','Lo que se está haciendo','CIRCVS · AMPHITHEATRVM','Bajo esta plaza, el circo en obras: lo terminará Domiciano a finales de siglo, y sus bóvedas aún se ven en la Tarragona de hoy. El anfiteatro de piedra junto a la playa es más tardío, de comienzos del siglo II; por ahora, los juegos se dan en un anfiteatro provisional de madera, en ese mismo sitio.',u.x-20,u.z+60,0);
   place('acueducto_tarraco','El acueducto','AQVAEDVCTVS','Este puente lleva el agua del río Francolí a la ciudad: unos doscientos metros de largo, casi treinta de alto y dos pisos de arcos, de sillares sin argamasa. Hoy se le llama Pont del Diable o de les Ferreres. En realidad está a unos cuatro kilómetros al norte; aquí lo ves más cerca. Su fecha exacta se discute: suele situarse en época de Augusto.',I.x-270,I.z-190,0);
   place('vino_tarraco','Los vinos de Tarraco','VINVM TARRACONENSE','Las colinas de alrededor están cubiertas de viñas. Plinio el Viejo alaba la finura del vino de Tarraco, y Marcial lo pondrá solo por debajo de los de Campania. Sale del puerto en ánforas hacia la Galia y Roma, junto con su lino, que Plinio admira por su brillo.',l.x+30,l.z+40,0);
   NPC_POS.flamen=[u.x+20,u.z-10,0];
   romaVillagers(I,l.x,l.z+10,5,['El gobernador ha vuelto de inspeccionar las minas del norte. Viene de mal humor.','Aquí llegan delegados de todas las ciudades de la provincia, desde Gallaecia hasta Carthago Nova.','El vino de Tarraco se bebe en Roma, aunque allí presuman de su Falerno.','Dicen que el foro nuevo será el más grande de Hispania.']);}
  // ---------------------------------------- África: Carthago
  {const I=G('cartago'),b=I.byrsa,t=I.town;
   romanTemple({x:b.x,z:b.z-30,rot:0,W:20,L:36,pod:4,colD:1.3,colH:11,nW:6,deep:2,name:'Capitolio de Carthago'});forumR(b.x,b.z+30,70,40,'Foro de Carthago');   // 14 m más al sur: el pórtico norte del foro cortaba la escalinata del Capitolio
   for(let i=0;i<10;i++){const x=b.x+rr(-60,60),z=b.z+rr(70,110);box(rr(3,6),rr(0.6,1.4),rr(3,6),lam('#9a8a6a'),x,terrainH(x,z)+0.3,z);}
   {const L=I.lake;box(16,2,16,TRAV,L.x,0.6,L.z);addBox(L.x,L.z,16,16,0);box(6,6,8,lam('#d8ccb4'),L.x,4,L.z);for(let i=0;i<24;i++){const a=i/24*TAU;const g=grp(L.x+Math.cos(a)*38,terrainH(L.x+Math.cos(a)*38,L.z+Math.sin(a)*38),L.z+Math.sin(a)*38,-a);box(3,3,8,lam('#cdbf9f'),0,1.5,0,g);}
    {const sh=shoreAlong(L.x+30,L.z-70,1,0,400);buildPort('cartago','Carthago',sh[0],sh[1],1,0);}}
   {const q=I.tophet;for(let i=0;i<60;i++){const x=q.x+rr(-20,20),z=q.z+rr(-20,20);box(0.4,rr(0.6,1.2),0.15,lam('#c9bfa9'),x,terrainH(x,z)+0.4,z).rotation.y=rr(-0.3,0.3);}}
   amphi(I.amph.x,I.amph.z,0,46,36,13,'Anfiteatro de Carthago');
   destHouses(I,t.x,t.z,40,90,true);
   place('byrsa','La Byrsa y el Capitolio','BYRSA','La Byrsa fue la ciudadela de la Cartago púnica. Según la leyenda, la reina Dido, huida de Tiro, pidió al rey del lugar tanta tierra como pudiera abarcar una piel de buey; la cortó en tiras finísimas y rodeó con ellas toda la colina. Los romanos allanaron la cima, enterrando bajo el relleno las casas púnicas, y levantaron encima el foro, la basílica y el Capitolio de la colonia.',b.x+30,b.z+44,0);
   place('puertos_cartago','Los puertos de Cartago','COTHON','Cartago tenía dos puertos unidos: uno rectangular para los mercantes y, detrás, uno circular para la flota de guerra, con una isla en el centro donde vivía el almirante y gradas para unas doscientas veinte naves alrededor. Hoy los usan las naves del trigo: según Flavio Josefo, África alimenta a Roma ocho meses al año.',I.lake.x-40,I.lake.z-30,0);
   place('delenda','«Cartago debe ser destruida»','DELENDA EST CARTHAGO','Catón el Viejo terminaba todos sus discursos en el Senado con la misma frase: «Además, opino que Cartago debe ser destruida». En el 146 a.C., tras tres años de asedio, Escipión Emiliano tomó la ciudad, la incendió y la arrasó; los supervivientes fueron vendidos como esclavos. Que los romanos sembraran sal en sus campos es un invento moderno: ningún autor antiguo lo dice.',b.x-40,b.z+50,0);
   place('tofet','El tofet','TOPHET','Junto al puerto está el antiguo recinto sagrado de Baal Hammón y de Tanit, con miles de urnas y estelas. Las urnas guardan huesos quemados de niños pequeños y de animales. Griegos y romanos acusaban a los cartagineses de sacrificar a sus hijos; los historiadores de hoy discuten si todos fueron sacrificios. Los dioses no se han ido: a Baal Hammón lo llaman ahora Saturno, y a Tanit, Celeste.',I.tophet.x+26,I.tophet.z,0);
   place('colonia_carthago','La colonia de César y Augusto','COLONIA IVLIA CONCORDIA CARTHAGO','Gayo Graco intentó fundar aquí una colonia en el 122 a.C., pero fracasó. Julio César la proyectó y Augusto la fundó, con tres mil colonos y muchos habitantes de los alrededores. Hoy es la capital de la provincia de África, donde reside el procónsul, y una de las ciudades más grandes de Occidente.',t.x+30,t.z+30,0);
   place('punicos_hoy','Los púnicos de hoy','LINGVA PVNICA','La ciudad es romana, pero en las casas y en el campo muchos siguen hablando la lengua púnica, la de sus abuelos fenicios. En las ciudades de la provincia hay inscripciones en latín y en púnico a la vez, y familias de antiguo nombre fenicio son hoy ciudadanos romanos.',t.x-30,t.z-30,0);
   NPC_POS.himilcon=[I.lake.x-20,I.lake.z-50,Math.PI];
   romaVillagers(I,t.x,t.z+10,5,['Mi abuela todavía reza a Tanit, aunque ahora la llame Celeste.','Sale una nave de trigo para Roma casi cada día en verano.','Dicen que Aníbal nació en esta ciudad. Aquí no hablamos mucho de él.','En el anfiteatro dan fieras de verdad: leones de Numidia, no esos gatos de Italia.']);}
  // ---------------------------------------- Hispania: Barcino
  {const I=G('barcino'),t=I.town;
   rectWall(t.x,t.z,130,110,lam('#b5a98e'),6);romanTemple({x:t.x+20,z:t.z-20,rot:0,W:17.5,L:35,pod:3,colD:1.1,colH:9,nW:6,deep:2,peri:true,name:'Templo de Augusto (Barcino)'});
   forumR(t.x-20,t.z+20,30,20,'Foro de Barcino');destHouses(I,t.x,t.z,20,55,true,{inside:(x,z)=>Math.abs(x-t.x)<60&&Math.abs(z-t.z)<50});
   vineyard(t.x-160,t.z-60,60,50);vineyard(t.x-120,t.z+100,50,40);
   {const q=I.quarry;for(let i=0;i<8;i++)box(rr(2,4),rr(1,3),rr(2,4),lam('#c9a87a'),q.x+rr(-10,10),q.h+1,q.z+rr(-10,10));}
   {const sh=shoreAlong(t.x,t.z,0,1,400);buildPort('barcino','Barcino',sh[0],sh[1],0,1);}
   romaArrive(I,'Barcino',HISP_DRIVER);
   place('barcino_colonia','Barcino','COLONIA IVLIA AVGVSTA FAVENTIA PATERNA BARCINO','Una colonia pequeña que Augusto fundó hace unos noventa años sobre una colina baja junto al mar, el monte Táber, entre dos ríos. Tiene murallas, un foro y unas calles en cuadrícula; no llega a cinco mil habitantes. Es más pequeña que Tarraco, pero tiene buen puerto y mucho campo.',t.x+10,t.z+60,0);
   place('templo_barcino','El templo de Augusto','TEMPLVM','En lo alto del monte Táber, el templo del culto imperial, rodeado de columnas corintias. Cuatro de ellas seguirán en pie veinte siglos después, escondidas en un patio de la ciudad.',t.x+34,t.z-4,0);
   place('vino_layetano','El vino de los layetanos','VINVM LAIETANVM','Los campos de los layetanos, los íberos de esta costa, están llenos de viñas. Su vino se exporta en ánforas a la Galia y a Roma, donde es barato y abundante. Plinio el Viejo alabó su cantidad; Marcial, menos amable, se burlará de sus posos.',t.x-150,t.z-30,0);
   place('mons_iovis','El monte de Júpiter','MONS IOVIS','Junto al puerto se alza el monte de Júpiter, de donde sale la piedra con la que se construye la colonia. Desde arriba se ve toda la llanura entre los dos ríos.',I.quarry.x-14,I.quarry.z+12,0);
   NPC_POS.pedania=[t.x-140,t.z-40,0];
   romaVillagers(I,t.x,t.z+10,5,['Aquí todos tienen una viña o trabajan en la de otro.','Las ánforas de vino salen del puerto por miles.','Tarraco es la capital, pero aquí se vive más tranquilo.','Los abuelos de mis abuelos eran layetanos. Ahora todos somos romanos.']);}
  // ---------------------------------------- Hispania: Emporiae
  {const I=G('emporiae'),n=I.neap,u=I.urbs,pa=I.pal,am=I.amph;
   // Neápolis griega: recinto alargado junto al puerto, con la puerta del sur (aquí, al oeste), el Asclepieion y el Serapeion junto a ella, y el ágora con su pórtico en medio
   rectWall(n.x,n.z,124,84,lam('#b8a888'),5);
   temple({name:'Santuario de Asclepio',x:n.x-48,z:n.z-18,rot:Math.PI/2,W:7,L:12,nW:4,prostyle:true,colD:0.55,colH:4,gy:n.h,cella:{w:6,l:7,door:2}});statue(n.x-38,n.h+0.8,n.z-18,Math.PI/2,1.5,'marble');
   temple({name:'Serapeion',x:n.x-44,z:n.z+20,rot:Math.PI/2,W:7,L:11,nW:4,prostyle:true,colD:0.5,colH:3.8,gy:n.h,cella:{w:6,l:6,door:2}});porticus(n.x-56,n.z+8,n.x-30,n.z+8,4,4,'ionic',1,n.h);
   forumR(n.x+6,n.z-4,30,20,'Ágora de Emporion');porticus(n.x-10,n.z-18,n.x+24,n.z-18,6,5,'doric',-1,n.h);
   for(const[dx,dz]of[[-20,26],[26,22],[34,-26]]){const g=grp(n.x+dx,n.h,n.z+dz,0);box(3,0.6,3,lam('#9a8a70'),0,0.3,0,g);addBox(n.x+dx,n.z+dz,3,3,0);}   // cisternas
   destHouses(I,n.x+20,n.z+4,10,40,false,{inside:(x,z)=>Math.abs(x-n.x-4)<56&&Math.abs(z-n.z)<38});
   // el espigón del puerto, hacia la Paleápolis
   {const sh=shoreAlong(n.x+70,n.z,0,1,300),g=grp(sh[0],0,sh[1],0);box(5,3,46,lam('#a89a80'),0,0.4,22,g);addBox(sh[0],sh[1]+22,5,46,0);}
   // Paleápolis: el primer asentamiento, en la antigua isla, con el templo de Ártemis de Éfeso
   temple({name:'Templo de Ártemis de Éfeso',x:pa.x,z:pa.z-8,rot:0,W:8,L:13,nW:4,prostyle:true,colD:0.55,colH:4.2,gy:pa.h,cella:{w:6.5,l:8,door:2}});destHouses(I,pa.x,pa.z+6,6,22,false);
   // ciudad romana: rectángulo grande tierra adentro, con dos ejes, el foro en medio, el templo capitolino al fondo y casas con jardín hacia el mar
   rectWall(u.x,u.z,320,140,lam('#b5a98e'),5);
   forumR(u.x,u.z,64,40,'Foro de Emporiae');romanTemple({x:u.x+44,z:u.z,rot:-Math.PI/2,W:14,L:24,pod:3,colD:0.9,colH:8,nW:6,deep:2,name:'Templo capitolino de Emporiae'});
   porticus(u.x-32,u.z-22,u.x+30,u.z-22,6,6,'tuscan',1,u.h);porticus(u.x-32,u.z+22,u.x+30,u.z+22,6,6,'tuscan',-1,u.h);
   {const g=grp(u.x-46,u.h,u.z,0);box(14,8,36,PLAST,0,4,0,g);box(14.6,0.4,36.6,M.tile||PLAST,0,8.2,0,g);addBox(u.x-46,u.z,14,36,0);footprints.push({x:u.x-46,z:u.z,w:14,d:36,a:0,name:'Basílica',house:true});}
   destHouses(I,u.x,u.z,34,150,true,{inside:(x,z)=>Math.abs(x-u.x)<152&&Math.abs(z-u.z)<64&&!(Math.abs(x-u.x)<60&&Math.abs(z-u.z)<34)});
   for(const dx of[-90,90]){const x=u.x+dx,z=u.z+46,g=grp(x,u.h,z,0);box(30,5,18,PLAST,0,2.5,0,g);box(30.6,0.35,18.6,M.tile||PLAST,0,5.2,0,g);addBox(x,z,30,18,0);footprints.push({x,z,w:30,d:18,a:0,name:'Domus con mosaicos',house:true});}
   amphi(am.x,am.z,0,38,30,9,'Anfiteatro de Emporiae');
   place('emporiae_mosaicos','Las casas de la colina','DOMVS','Junto a la muralla que mira al mar, las familias ricas tienen casas grandes con atrio, peristilo, jardín y suelos de mosaico blanco y negro. Desde sus terrazas se ve el puerto y la vieja ciudad griega.',u.x-90,u.z+60,0);
   place('emporiae_anfiteatro','El anfiteatro','AMPHITHEATRVM','Fuera de la puerta de la ciudad romana hay un anfiteatro pequeño, con gradas sobre terraplenes de tierra y un muro de piedra, para combates de gladiadores y cacerías de fieras en los días de fiesta. Al lado se ejercitan los jóvenes en una gran palestra.',am.x+40,am.z,0);
   place('paleapolis','La Paleápolis','ΠΑΛΑΙΑ ΠΟΛΙΣ','La «ciudad vieja»: aquí, en lo que era una isla junto a la desembocadura del río, se establecieron los primeros griegos de Focea hacia el 600 a.C. Estrabón cuenta que los de Emporion veneran a Ártemis de Éfeso, como los de Massalia.',pa.x+18,pa.z+10,0);
   {const sh=shoreAlong(n.x,n.z,0,1,300);buildPort('emporiae','Emporiae',sh[0],sh[1],0,1);}
   romaArrive(I,'Emporiae',HISP_DRIVER);
   place('emporion_griega','Emporion, la ciudad griega','ΕΜΠΟΡΙΟΝ','Los griegos de Focea, llegados desde Massalia, fundaron aquí hacia el 575 a.C. un puesto de comercio, un emporion: de ahí el nombre. Primero en un islote y luego en esta pequeña ciudad amurallada junto al puerto, al lado de un poblado íbero. Durante siglos vendieron vino, aceite y cerámica a los íberos a cambio de cereal, metales y lino. Hoy la ciudad griega está medio vacía.',n.x+14,n.z+30,0);
   place('escipion_218','Aquí desembarcó Roma','SCIPIO','En el 218 a.C. el cónsul Gneo Escipión desembarcó aquí con su ejército para cortar el paso a Aníbal: fue el principio de seis siglos de Hispania romana. En el 195, Catón también desembarcó aquí, y Livio describe la doble ciudad, griega e íbera, separada por un muro.',n.x-40,n.z+20,0);
   place('asclepio_emporion','El Asclepio de Emporion','ΑΣΚΛΗΠΙΟΣ','En el santuario de la ciudad griega está la gran estatua de Asclepio, el dios que cura, tallada en mármol griego. Los enfermos vienen a pedirle salud, como en Epidauro.',n.x-4,n.z+8,0);
   place('ciudad_romana','La ciudad romana','EMPORIAE','En la colina, al lado de la ciudad griega, los romanos levantaron hacia el 100 a.C. una ciudad nueva en cuadrícula, con foro, templo y casas con mosaicos. César instaló aquí a sus veteranos y Augusto unió las dos ciudades en un solo municipio, Emporiae.',u.x+20,u.z+80,0);
   NPC_POS.dionisia=[n.x+8,n.z+14,Math.PI];
   romaVillagers(I,u.x,u.z+10,5,['Mi familia todavía rinde culto a Ártemis de Éfeso, como los primeros colonos.','En la ciudad vieja ya no vive casi nadie. Todos se han mudado a la colina.','Por aquí pasa la Vía Augusta, que va de los Pirineos a Gades.','El puerto ya no es lo que era: ahora todo va a Tarraco.']);}
  // ---------------------------------------- Hispania: Ilerda
  {const I=G('ilerda'),t=I.town;
   {const pts=[];for(let i=0;i<=30;i++){const tt=i/30;pts.push([t.x+140+Math.sin(tt*4)*20,I.z-I.R*1.2+tt*I.R*2.4]);}riverRibbon(pts,26,'#4f8a86');const bz=t.z+40,bx=t.x+140+Math.sin(((bz+I.R*1.2)/(I.R*2.4))*4)*20;
    const g=grp(bx,terrainH(bx-24,bz),bz,0);box(48,1.2,6,TRAV,0,1.2,0,g);for(let i=0;i<4;i++)box(1.6,2.4,6,TRAV,-15+i*10,0,0,g);addPlat(bx,bz,48,6,0,terrainH(bx-24,bz)+1.8);for(const s of[-1,1])addSeg(bx-24,bz+s*2.9,bx+24,bz+s*2.9,0.3);}
   ringWall(t.x,t.z,70,[0,Math.PI],lam('#a89a80'),6,6);forumR(t.x,t.z,30,20,'Foro de Ilerda');romanTemple({x:t.x,z:t.z-34,rot:0,W:10,L:18,pod:2.4,colD:0.7,colH:6,nW:4,deep:2,name:'Templo de Ilerda'});destHouses(I,t.x,t.z,18,55,true,{inside:(x,z)=>Math.hypot(x-t.x,z-t.z)<64});
   romaArrive(I,'Ilerda',HISP_DRIVER);
   place('ilergetes','Los ilergetes','ILERGETES','Ilerda fue la capital de los ilergetes, el pueblo íbero más poderoso del valle del Sicoris. Sus reyes, Indíbil y Mandonio, se aliaron unas veces con Cartago y otras con Roma, y acabaron sublevándose contra los romanos en el 205 a.C.: Indíbil murió en la batalla y Mandonio fue entregado y ejecutado.',t.x+20,t.z+70,0);
   place('cesar_ilerda','César en Ilerda','BELLVM ILERDENSE','En el verano del 49 a.C., César vino aquí a combatir a los generales de Pompeyo, Afranio y Petreyo. Una crecida del Sicoris se llevó sus puentes y lo dejó aislado y sin víveres; él mandó hacer barcas de mimbre y cuero, cruzó el río y acabó rindiendo a los pompeyanos sin apenas batalla. Lo cuenta él mismo en La guerra civil.',t.x+120,t.z+60,0);
   place('ilerda_municipio','Ilerda romana','MVNICIPIVM ILERDA','Desde Augusto, Ilerda es un municipio de ciudadanos romanos, con su foro y sus magistrados. Vive del río, de los cereales y del cruce de caminos entre Tarraco, Osca y Caesaraugusta. El poeta Horacio, en broma, amenazó a su libro con acabar desterrado «en Ilerda», en el fin del mundo.',t.x-20,t.z-50,0);
   NPC_POS.atilio=[t.x+120,t.z+46,Math.PI/2];
   romaVillagers(I,t.x,t.z+20,5,['El Sicoris crece en primavera con la nieve de los Pirineos.','Mi abuelo contaba que César hizo barcas de mimbre para cruzar el río.','Somos ilergetes, pero hablamos latín como en Roma. Bueno, casi.','De aquí a Tarraco, tres días de carro; de aquí a Osca, otros tres.']);}
  // ---------------------------------------- Lusitania: Emerita Augusta
  {const I=G('emerita'),t=I.town,s=I.spect;
   {const pts=[];for(let i=0;i<=30;i++){const tt=i/30;pts.push([I.x-I.R*1.2+tt*I.R*2.4,t.z+150+Math.sin(tt*3)*12]);}riverRibbon(pts,60,'#4f8a86');const bz=t.z+150+Math.sin(1.5)*12;
    const p2=[];for(let i=0;i<=24;i++){const k=i/24,x=t.x-300+k*600,tt=(x-(I.x-I.R*1.2))/(I.R*2.4);p2.push([x,t.z+150+Math.sin(tt*3)*12+78*Math.sin(Math.PI*k)]);}riverRibbon(p2,34,'#4f8a86');
    const deck=Math.max(terrainH(t.x,bz-52),terrainH(t.x,bz+122),3)+3.4;stoneBridge(t.x,bz-50,t.x,bz+120,7,8.5,deck,lam('#9a8f80'));}
   circusH(I.x+40,I.z-310,0,165,33,48,9,'Circo de Emerita');
   {const p3=[];for(let i=0;i<=16;i++){const k=i/16;p3.push([I.x-300+k*90+Math.sin(k*5)*14,I.z-360+k*450]);}riverRibbon(p3,10,'#4f8a86');}
   arcadeLine(I.x-380,I.z-260,I.x-125,I.z-150,{H:22,span:6.4,dep:3,levels:[0.38,0.7,1],mat:lam('#9c9488'),band:'#a0523a'});
   rectWall(t.x,t.z,220,190,lam('#b5a98e'),6);forumR(t.x,t.z,46,28,'Foro de Emerita');romanTemple({x:t.x-40,z:t.z-50,rot:0,W:21.5,L:40,pod:3.4,colD:1.2,colH:9,nW:6,deep:2,peri:true,name:'Templo del culto imperial («de Diana»)'});
   destHouses(I,t.x,t.z,30,100,true,{inside:(x,z)=>Math.abs(x-t.x)<104&&Math.abs(z-t.z)<90});
   theatre({x:s.x-20,z:s.z,rot:0,R0:11,R1:32,H:15,name:'Teatro de Emerita',noPlays:true});amphi(s.x+60,s.z+30,0.3,48,40,14,'Anfiteatro de Emerita');
   romaArrive(I,'Emerita Augusta',HISP_DRIVER);
   place('emerita_fundacion','La ciudad de los veteranos','EMERITA AVGVSTA','Augusto la fundó en el 25 a.C. para los soldados licenciados, los «eméritos», de las legiones V Alauda y X Gemina, que habían luchado contra cántabros y astures. Cada veterano recibió un lote de tierra enorme: los agrimensores la citan como ejemplo. Hoy es la capital de la provincia de Lusitania.',t.x+30,t.z-100,0);
   place('puente_anas','El puente sobre el Anas','PONS','Uno de los puentes más largos del Imperio: casi ochocientos metros y unos sesenta arcos de granito cruzan el río Anas, que aquí se abre en dos brazos alrededor de una isla. Aquí lo ves acortado. Por él pasa el camino que une el sur con el norte de Hispania, la futura Vía de la Plata.',t.x+10,t.z+110,0);
   place('teatro_emerita','El teatro y el anfiteatro','THEATRVM · AMPHITHEATRVM','El teatro lo regaló a la colonia Agripa, el yerno de Augusto, hacia el 16 a.C.; al lado, unos años después, se construyó el anfiteatro. Así, en el mismo rincón de la ciudad, se ven comedias y combates de gladiadores.',s.x+10,s.z+46,0);
   place('circo_emerita','El circo','CIRCVS','Más de cuatrocientos metros de largo y sitio para unas treinta mil personas: casi toda la colonia y los campesinos de alrededor caben en sus gradas. Se construyó fuera de la muralla en la primera mitad del siglo I. Las cuadrigas salen de los cárceres, en el extremo recto, y dan siete vueltas alrededor de la espina.',I.x-60,I.z-250,0);
   place('milagros_emerita','El acueducto de granito y ladrillo','AQVAEDVCTVS','Trae el agua de un embalse a unos cinco kilómetros al norte, el que hoy se llama de Proserpina, y cruza el valle del río Albarregas sobre pilares de granito con hiladas de ladrillo rojo y tres pisos de arcos. Hoy lo llaman «Los Milagros». La fecha se discute: muchos lo sitúan en el siglo I; otros, algo después.',I.x-250,I.z-180,0);
   place('foro_emerita','El templo y el pórtico del foro','TEMPLVM · PORTICVS','Los emeritenses de hoy llaman a este templo «de Diana», pero estaba dedicado al culto del emperador. Es de granito cubierto de estuco, para que parezca mármol. Junto al foro, hacia mediados de siglo, la colonia levantó un pórtico de mármol que imitaba el Foro de Augusto de Roma, con cariátides y escudos con las cabezas de Júpiter Amón y de Medusa.',t.x-20,t.z-26,0);
   place('lusitania','Lusitania','LVSITANIA','Los lusitanos, pueblo de pastores guerreros, resistieron a Roma durante décadas. Su jefe Viriato, un pastor, venció a varios ejércitos romanos hasta que, en el 139 a.C., lo asesinaron mientras dormía tres de los suyos, comprados por Roma. Cuando fueron a cobrar, les respondieron que Roma no pagaba a traidores.',I.arrive.x+30,I.arrive.z-30,0);
   NPC_POS.tito_cornelio=[t.x+20,t.z-30,0];
   romaVillagers(I,t.x,t.z+10,5,['Mi abuelo luchó contra los cántabros. Le dieron tierra aquí, más de la que podía arar.','El gobernador de Lusitania vive aquí. Por eso hay tanto funcionario.','En el teatro dan comedias griegas; en el anfiteatro, lo que la gente quiere de verdad.','El Anas es ancho y lento; en verano casi se cruza a pie.']);}
  for(const I of ISLANDS)if(!I.desert)destTrees(I,240,['pine','cypress','olive','plane']);
  for(const id in SIMPLE_RO){const I=G(id);if(I)buildSimple(I,SIMPLE_RO[id]);}
  buildGates();
}
