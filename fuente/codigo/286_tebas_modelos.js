// ============================================================ TEBAS: MODELOS MEJORADOS CASI SIN COSTE (28/11)
// Antes, los templos de Tebas eran cajas lisas. Ahora, con las mismas pocas llamadas de dibujo (todo fundido por material o instanciado):
//  · texturas pintadas una sola vez en un lienzo y repetidas a escala real (no se estiran): relieves con registros de figuras y columnas
//    de jeroglíficos con restos de color, sillería, adobe, el techo azul con estrellas, la gola con hojas, el granito con su columna
//    de signos y la fachada de las casas;
//  · pilonos con muros en talud, toro en las aristas, gola, puerta con su cornisa y los mástiles con banderas en sus nichos;
//  · columnas de papiro: fuste con bulbo y ataduras, capitel abierto (campaniforme) o cerrado, y ábaco;
//  · carneros y esfinges con su forma (plinto, cuerpo, patas, cabeza, cuernos o tocado), colosos sentados con el tocado real (nemes);
//  · casas de adobe de cuatro tipos (uno, dos y tres pisos, con terraza, pretil, ventanas altas y torre de viento).
// Las texturas pesan poco (de 128 a 512 px) y se comparten. Lo de los colores: los templos egipcios estaban pintados, y en el 386 a.C. y
// en el 80 d.C. quedaba mucha pintura; aquí se ve apagada, como restos.
const TBM={tex:{},mat:{}};
function tbTex(k){if(TBM.tex[k])return TBM.tex[k];const R0=forRng(k.length*0.137+0.31),rn=()=>R0();let t;
  const noise=(x,w,h,base,amp)=>{x.fillStyle=base;x.fillRect(0,0,w,h);for(let i=0;i<w*h/18;i++){const v=Math.floor(rn()*amp);x.fillStyle='rgba('+(v>amp/2?'255,255,255':'0,0,0')+','+(0.04+rn()*0.06)+')';x.fillRect(rn()*w,rn()*h,1+rn()*2,1+rn()*2);}};
  const glyph=(x,cx,cy,s)=>{const g=Math.floor(rn()*7);x.beginPath();if(g===0)x.arc(cx,cy,s*0.35,0,TAU);else if(g===1){x.moveTo(cx-s*0.4,cy+s*0.4);x.lineTo(cx,cy-s*0.4);x.lineTo(cx+s*0.4,cy+s*0.4);}
    else if(g===2)x.rect(cx-s*0.4,cy-s*0.15,s*0.8,s*0.3);else if(g===3){x.moveTo(cx-s*0.4,cy);x.quadraticCurveTo(cx,cy-s*0.5,cx+s*0.4,cy);}else if(g===4){x.ellipse(cx,cy,s*0.2,s*0.4,0,0,TAU);}
    else if(g===5){x.moveTo(cx-s*0.3,cy+s*0.4);x.lineTo(cx-s*0.3,cy-s*0.2);x.arc(cx,cy-s*0.2,s*0.3,Math.PI,0);x.lineTo(cx+s*0.3,cy+s*0.4);}else{x.moveTo(cx-s*0.4,cy+s*0.3);x.lineTo(cx+s*0.4,cy-s*0.3);}x.stroke();};
  const figure=(x,cx,by,hgt,col)=>{const u=hgt/10;x.fillStyle=col;x.beginPath();x.arc(cx,by-hgt+u*1.1,u*1.1,0,TAU);x.fill();x.fillRect(cx-u*0.9,by-hgt+u*2.2,u*1.8,u*3.4);
    x.beginPath();x.moveTo(cx-u*1.6,by-hgt+u*5.6);x.lineTo(cx+u*1.6,by-hgt+u*5.6);x.lineTo(cx+u*0.9,by-hgt+u*7);x.lineTo(cx-u*0.9,by-hgt+u*7);x.fill();x.fillRect(cx-u*0.8,by-hgt+u*7,u*0.5,u*3);x.fillRect(cx+u*0.3,by-hgt+u*7,u*0.5,u*3);
    x.fillRect(cx+u*0.9,by-hgt+u*2.6,u*2.4,u*0.5);};
  if(k==='relief'||k==='colrel'){t=canvasTex(512,512,(x,w,h)=>{noise(x,w,h,'#d8c398',120);x.strokeStyle='rgba(90,60,30,0.35)';x.lineWidth=1;for(let y=0;y<h;y+=32){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();}
      const regs=k==='colrel'?[[0,256],[256,256]]:[[0,170],[170,170],[340,172]];
      for(const[y0,rh]of regs){x.fillStyle='rgba(60,90,140,0.25)';x.fillRect(0,y0+2,w,8);x.fillStyle='rgba(160,60,40,0.2)';x.fillRect(0,y0+10,w,4);
        for(let i=0;i<4;i++){const cx=40+i*128+rn()*20,by=y0+rh-14;figure(x,cx,by,rh*0.6,'rgba(70,45,25,0.28)');figure(x,cx+2,by-1,rh*0.6,i%2?'rgba(170,70,50,0.18)':'rgba(60,100,150,0.16)');
          x.strokeStyle='rgba(60,40,20,0.35)';x.lineWidth=1.6;for(let j=0;j<5;j++)glyph(x,cx+52,y0+26+j*rh*0.15,rh*0.1);x.strokeStyle='rgba(60,40,20,0.2)';x.beginPath();x.moveTo(cx+40,y0+18);x.lineTo(cx+40,by);x.moveTo(cx+64,y0+18);x.lineTo(cx+64,by);x.stroke();}}});}
  else if(k==='relief2'||k==='relief3')t=canvasTex(512,512,(x,w,h)=>{noise(x,w,h,'#d8c398',120);x.strokeStyle='rgba(90,60,30,0.35)';x.lineWidth=1;for(let y=0;y<h;y+=32){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();}
      for(const[y0,rh]of[[0,256],[256,256]]){x.fillStyle='rgba(60,90,140,0.25)';x.fillRect(0,y0+2,w,8);x.fillStyle='rgba(160,60,40,0.2)';x.fillRect(0,y0+10,w,4);
        if(k==='relief2'){   // ofrendas: el rey ante el dios, con la mesa llena entre los dos
          for(let i=0;i<2;i++){const cx=80+i*256,by=y0+rh-16;figure(x,cx,by,rh*0.7,'rgba(70,45,25,0.3)');x.save();x.translate(2*(cx+150),0);x.scale(-1,1);figure(x,cx,by,rh*0.78,'rgba(60,100,150,0.22)');x.restore();
            x.fillStyle='rgba(70,45,25,0.3)';x.fillRect(cx+56,by-rh*0.28,40,5);x.fillRect(cx+73,by-rh*0.28,6,rh*0.28);for(let j=0;j<5;j++){x.beginPath();x.arc(cx+60+j*8,by-rh*0.28-6-(j%2)*6,5,0,TAU);x.fill();}
            x.strokeStyle='rgba(60,40,20,0.35)';x.lineWidth=1.6;for(let j=0;j<6;j++)for(let c2=0;c2<3;c2++)glyph(x,cx+40+c2*24,y0+30+j*16,12);}}
        else{   // la batalla: el rey en su carro, los caballos al galope y los enemigos caídos
          for(let i=0;i<2;i++){const cx=60+i*256,by=y0+rh-20;x.fillStyle='rgba(70,45,25,0.32)';
            for(let hh=0;hh<2;hh++){x.beginPath();x.ellipse(cx+90+hh*6,by-48,34,14,-0.15,0,TAU);x.fill();x.beginPath();x.moveTo(cx+118+hh*6,by-58);x.lineTo(cx+140+hh*6,by-92);x.lineTo(cx+150+hh*6,by-80);x.lineTo(cx+124+hh*6,by-48);x.fill();
              for(let l=0;l<4;l++){x.save();x.translate(cx+70+l*14+hh*6,by-40);x.rotate((l%2?0.6:-0.5));x.fillRect(-2,0,4,38);x.restore();}}
            x.beginPath();x.arc(cx+40,by-24,22,0,TAU);x.strokeStyle='rgba(70,45,25,0.4)';x.lineWidth=3;x.stroke();x.fillRect(cx+18,by-70,44,8);
            figure(x,cx+40,by-60,rh*0.55,'rgba(170,70,50,0.22)');x.strokeStyle='rgba(70,45,25,0.45)';x.lineWidth=2;x.beginPath();x.arc(cx+76,by-150,30,Math.PI*0.6,Math.PI*1.4);x.stroke();
            for(let e=0;e<4;e++){x.save();x.translate(cx+170+e*18,by-6);x.rotate(1.3+e*0.2);figure(x,0,0,rh*0.32,'rgba(70,45,25,0.25)');x.restore();}}}}});
  else if(k==='nemesQ'||k==='nemesG')t=canvasTex(64,64,(x,w,h)=>{noise(x,w,h,k==='nemesQ'?'#b49a7a':'#b07a6a',120);x.fillStyle='rgba(40,25,15,0.35)';for(let y=0;y<h;y+=8)x.fillRect(0,y,w,3);});
  else if(k==='casing')t=canvasTex(128,128,(x,w,h)=>{noise(x,w,h,'#ece0c4',40);x.strokeStyle='rgba(120,100,70,0.16)';x.lineWidth=1;for(let y=0,r=0;y<h;y+=16,r++){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();for(let xx=(r%2)*24;xx<w;xx+=48){x.beginPath();x.moveTo(xx,y);x.lineTo(xx,y+16);x.stroke();}}});
  else if(k==='stone')t=canvasTex(256,256,(x,w,h)=>{noise(x,w,h,'#d3bd92',120);x.strokeStyle='rgba(90,60,30,0.3)';x.lineWidth=1;for(let y=0,r=0;y<h;y+=32,r++){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();for(let xx=(r%2)*32;xx<w;xx+=64){x.beginPath();x.moveTo(xx,y);x.lineTo(xx,y+32);x.stroke();}}});
  else if(k==='mud'||k==='mud2')t=canvasTex(256,256,(x,w,h)=>{noise(x,w,h,k==='mud'?'#a8865c':'#9a7a52',140);for(let y=0,r=0;y<h;y+=12,r++)for(let xx=-(r%2)*16;xx<w;xx+=32){x.fillStyle='rgba('+(rn()<0.5?'255,240,210':'40,25,10')+','+(0.05+rn()*0.07)+')';x.fillRect(xx+1,y+1,30,10);}
      x.strokeStyle='rgba(50,35,20,0.35)';x.lineWidth=1;for(let y=0;y<h;y+=12){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();}});
  else if(k==='ceil')t=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#1d3a6a';x.fillRect(0,0,w,h);x.fillStyle='#e8c860';for(let i=0;i<4;i++)for(let j=0;j<4;j++){const cx=16+i*32+(j%2)*16,cy=16+j*32;x.beginPath();for(let a=0;a<10;a++){const r=a%2?2.5:7,an=a*Math.PI/5-Math.PI/2;x.lineTo(cx+Math.cos(an)*r,cy+Math.sin(an)*r);}x.fill();}});
  else if(k==='corn')t=canvasTex(128,64,(x,w,h)=>{const C=['#2f6d8a','#b5483a','#3f8a5a','#d8b050'];for(let i=0;i<16;i++){x.fillStyle=C[i%4];x.fillRect(i*8,0,8,h);x.fillStyle='rgba(255,255,255,0.25)';x.fillRect(i*8,0,1,h);}x.fillStyle='rgba(216,195,152,0.55)';x.fillRect(0,0,w,h);x.fillStyle='#d8c398';x.fillRect(0,h-8,w,8);});
  else if(k==='capt')t=canvasTex(128,64,(x,w,h)=>{noise(x,w,h,'#cdb78f',100);const C=['rgba(60,120,90,0.45)','rgba(60,90,150,0.4)','rgba(200,160,60,0.4)'];for(let i=0;i<12;i++){x.fillStyle=C[i%3];x.beginPath();x.moveTo(i*10.7,h);x.quadraticCurveTo(i*10.7+5,0,i*10.7+10.7,h);x.fill();}});
  else if(k==='gran'||k==='obel')t=canvasTex(k==='obel'?128:128,k==='obel'?512:128,(x,w,h)=>{x.fillStyle='#b07a6a';x.fillRect(0,0,w,h);for(let i=0;i<w*h/6;i++){x.fillStyle=['rgba(40,30,30,0.35)','rgba(240,220,210,0.3)','rgba(120,60,50,0.3)'][Math.floor(rn()*3)];x.fillRect(rn()*w,rn()*h,1+rn()*1.5,1+rn()*1.5);}
      if(k==='obel'){x.strokeStyle='rgba(50,25,20,0.55)';x.lineWidth=1.4;for(let f=0;f<4;f++){const cx=f*32+16;x.strokeRect(cx-8,8,16,h-16);for(let j=0;j<22;j++)glyph(x,cx,22+j*22,10);}}});
  else if(k==='house')t=canvasTex(128,128,(x,w,h)=>{noise(x,w,h,'#c4a274',120);x.fillStyle='rgba(255,245,225,0.25)';x.fillRect(0,0,w,h*0.5);x.fillStyle='#3a2a1e';x.fillRect(20,18,12,8);x.fillRect(84,18,12,8);x.fillStyle='rgba(60,40,25,0.4)';x.fillRect(0,h-6,w,6);});
  else if(k==='qtz')t=canvasTex(128,128,(x,w,h)=>{noise(x,w,h,'#b49a7a',150);for(let i=0;i<60;i++){x.strokeStyle='rgba(80,60,40,0.18)';x.beginPath();x.moveTo(rn()*w,rn()*h);x.lineTo(rn()*w,rn()*h);x.stroke();}});
  if(k==='colrel')t.repeat.set(3,3);   // en las columnas (torno con UV de 0 a 1), tres figuras alrededor y tres registros de alto
  t.anisotropy=4;TBM.tex[k]=t;return t;}
// material con textura y su escala (metros que ocupa una repetición), que usan boxUV y las piezas
function tbMat(k,col){const key=k+(col||'');if(TBM.mat[key])return TBM.mat[key];const S={relief:8,relief2:8,relief3:8,nemesQ:2,nemesG:2,casing:8,colrel:4,stone:4,mud:4,mud2:4,ceil:4,corn:4,capt:1,gran:3,obel:1,house:8,qtz:4}[k]||4;
  const m=new THREE.MeshLambertMaterial({map:tbTex(k),color:col||'#ffffff'});m.userData.s=S;TBM.mat[key]=m;return m;}
// caja con las UV a escala del mundo: la textura se repite cada s metros en cada cara, sin estirarse
function boxUV(w,h,d,s){const g=new THREE.BoxGeometry(w,h,d),uv=g.attributes.uv,F=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let f=0;f<6;f++)for(let v=0;v<4;v++){const i=f*4+v;uv.setXY(i,uv.getX(i)*F[f][0]/s,uv.getY(i)*F[f][1]/s);}return g;}
// fundir piezas conservando las UV (mergeGeos solo guarda posición y normal)
function tbMerge(list){const P=[],N=[],U=[];for(const[g0,m]of list){const g=(g0.index?g0.toNonIndexed():g0.clone()).applyMatrix4(m);if(!g.attributes.normal)g.computeVertexNormals();P.push(...g.attributes.position.array);N.push(...g.attributes.normal.array);
    const uv=g.attributes.uv;if(uv)U.push(...uv.array);else for(let i=0;i<g.attributes.position.count;i++)U.push(0,0);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeBoundingSphere();return g;}
// ---- geometrías compartidas (una vez)
const TBG={};
function tbGeo(){if(TBG.ok)return TBG;TBG.ok=1;const V=p=>p.map(q=>new THREE.Vector2(q[0],q[1]));
  TBG.shaft=new THREE.LatheGeometry(V([[0,0],[1.0,0],[1.1,0.03],[1.14,0.07],[1.06,0.13],[0.99,0.4],[0.93,0.8],[0.9,0.86],[0.95,0.87],[0.9,0.89],[0.95,0.9],[0.9,0.92],[0.88,1],[0,1]]),10);
  TBG.capO=new THREE.LatheGeometry(V([[0,0],[0.9,0],[1.15,0.25],[1.55,0.6],[1.85,0.9],[1.9,1],[0,1]]),12);
  TBG.capC=new THREE.LatheGeometry(V([[0,0],[0.9,0],[1.18,0.3],[1.15,0.65],[0.85,0.92],[0.7,1],[0,1]]),10);
  TBG.abac=boxUV(1.5,0.35,1.5,1);TBG.abac.translate(0,0.175,0);
  // carnero sentado sobre plinto (mira a +z), unos 4,5 m
  {const L=[],put=(g,x,y,z,rx,ry,rz)=>{const m=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx||0,ry||0,rz||0)).setPosition(x,y,z);L.push([g,m]);};
   put(boxUV(2.2,0.7,4.8,4),0,0.35,0);const body=new THREE.CylinderGeometry(0.62,0.72,2.6,7);body.rotateX(Math.PI/2);body.scale(1,0.8,1);put(body,0,1.25,-0.4);put(boxUV(1.5,1.1,1.3,4),0,1.25,-1.4);put(boxUV(1.5,0.8,1.6,4),0,1.1,1.6);
   for(const s of[-1,1])put(boxUV(0.45,0.5,1.5,4),s*0.45,0.95,2.2);put(boxUV(1.0,1.1,1.3,4),0,2.25,1.45);put(boxUV(0.7,0.6,0.9,4),0,2.15,2.2);
   for(const s of[-1,1]){const h=new THREE.TorusGeometry(0.32,0.12,5,8,Math.PI*1.4);put(h,s*0.55,2.4,1.5,0,Math.PI/2,0);}put(boxUV(0.6,1.1,0.5,4),0,1.6,2.25);
   TBG.ram=tbMerge(L);}
  // esfinge de cabeza humana con nemes, unos 4 m
  {const L=[],put=(g,x,y,z,rx)=>{L.push([g,new THREE.Matrix4().makeRotationX(rx||0).setPosition(x,y,z)]);};
   put(boxUV(2,0.6,4.4,4),0,0.3,0);{const b=new THREE.CylinderGeometry(0.7,0.8,3,8);b.rotateX(Math.PI/2);put(b,0,1.3,-0.3);}put(boxUV(1.4,0.7,1.6,4),0,0.95,1.5);put(boxUV(0.9,1,0.9,4),0,2.05,1.35);
   const ne=new THREE.CylinderGeometry(0.4,0.75,1.2,4);ne.rotateY(Math.PI/4);put(ne,0,2.2,1.2);TBG.sph=tbMerge(L);}
  // casas: cuatro tipos (dimensiones base; se escalan poco), con pretil, ventanas altas y, algunas, torre de viento y caseta de la escalera
  TBG.house=[];const S=8,hs=(w,h,d,ex)=>{const L=[[boxUV(w,h,d,S),new THREE.Matrix4().makeTranslation(0,h/2,0)]];
    L.push([boxUV(w,0.6,0.3,S),new THREE.Matrix4().makeTranslation(0,h+0.3,d/2-0.15)],[boxUV(w,0.6,0.3,S),new THREE.Matrix4().makeTranslation(0,h+0.3,-d/2+0.15)],[boxUV(0.3,0.6,d,S),new THREE.Matrix4().makeTranslation(w/2-0.15,h+0.3,0)],[boxUV(0.3,0.6,d,S),new THREE.Matrix4().makeTranslation(-w/2+0.15,h+0.3,0)]);
    for(const e of ex||[])L.push([boxUV(e[0],e[1],e[2],S),new THREE.Matrix4().makeTranslation(e[3],h+e[1]/2,e[4])]);return tbMerge(L);};
  TBG.house.push(hs(8,4,7,[[2.4,2.2,2.4,2.2,-1.8]]),hs(9,7.5,8,[[2,3.2,1.2,-2.8,-3.2],[2.6,2.2,2.6,2.6,2]]),hs(8,11,8,[[2.2,3.6,1.2,2.6,-2.9]]),hs(11,3.6,9,[[3,2.4,3,-3.2,2.4]]));
  return TBG;}
// pilono: dos torres en talud con toro y gola, puerta central con su cornisa, mástiles con banderas en la cara de delante (−z local)
function tbPylonParts(x,y,z,a,w,h,push){const tw=w*0.42,td=Math.max(5,w*0.2),k=0.78,R=new THREE.Matrix4().makeRotationY(a),O=new THREE.Matrix4().makeTranslation(x,y,z),T=(lx,ly,lz,ry)=>O.clone().multiply(R).multiply(new THREE.Matrix4().makeRotationY(ry||0).setPosition(lx,ly,lz));
  const rel=tbMat('relief3'),corn=tbMat('corn'),st=tbMat('stone');
  for(const s of[-1,1]){const g=boxUV(tw,h,td,rel.userData.s),p=g.attributes.position;for(let i=0;i<p.count;i++)if(p.getY(i)>0){p.setX(i,p.getX(i)*k);p.setZ(i,p.getZ(i)*k);}g.computeVertexNormals();push(rel,g,T(s*w*0.29,h/2,0));
    push(corn,boxUV(tw*k+1.2,h*0.07,td*k+1.2,4),T(s*w*0.29,h+h*0.035,0));const tor=new THREE.CylinderGeometry(0.45,0.45,tw*k+0.4,6);tor.rotateZ(Math.PI/2);push(st,tor,T(s*w*0.29,h-0.2,-td*k/2-0.1));
    for(const f of[-0.25,0.25]){const pole=new THREE.CylinderGeometry(0.35,0.5,h*1.35,6);push(st,pole,T(s*w*0.29+f*tw,h*0.675,-td/2-0.9));const fl=boxUV(0.08,h*0.12,h*0.1,4);push(tbMat('corn','#c84030'),fl,T(s*w*0.29+f*tw,h*1.28,-td/2-0.9-h*0.05));}}
  const gw=w*0.2,gh=h*0.72;push(rel,boxUV(gw,gh,td*0.9,rel.userData.s),T(0,gh/2,0));push(corn,boxUV(gw+1,h*0.06,td*0.9+1,4),T(0,gh+h*0.03,0));push(tbMat('stone','#3a2c22'),boxUV(gw*0.45,gh*0.62,td*0.95,4),T(0,gh*0.31,0));
  return{tw:tw,td:td};}
// coloso sentado (rey con nemes), de altura H, mirando a +z local
function tbColossusParts(x,y,z,a,H,mat,push){const s=H/18,R=new THREE.Matrix4().makeRotationY(a),O=new THREE.Matrix4().makeTranslation(x,y,z),T=(lx,ly,lz)=>O.clone().multiply(R).multiply(new THREE.Matrix4().makeTranslation(lx*s,ly*s,lz*s)),B=(w,h,d)=>boxUV(w*s,h*s,d*s,4);
  push(mat,B(8,2.4,11),T(0,1.2,0));push(mat,B(7,7.5,6),T(0,6.15,-2.4));push(mat,B(6.4,2,5),T(0,8.4,1.6));for(const sx of[-1,1]){push(mat,B(2.2,6.2,1.9),T(sx*1.55,5.3,3.8));push(mat,B(2.4,0.8,3),T(sx*1.55,2.8,4.6));}
  const to=new THREE.CylinderGeometry(2.3*s,3.0*s,6.2*s,4);to.rotateY(Math.PI/4);to.scale(1,1,0.65);push(mat,to,T(0,12.4,-1.6));for(const sx of[-1,1])push(mat,B(1.1,1,4.2),T(sx*2.4,9.8,1.2));
  const nm=tbMat(mat.map===tbTex('gran')?'nemesG':'nemesQ');
  push(mat,B(2.4,3,2.4),T(0,16.6,-1.2));const ne=new THREE.CylinderGeometry(1.5*s,2.6*s,3.8*s,4);ne.rotateY(Math.PI/4);ne.scale(1,1,0.8);push(nm,ne,T(0,16.4,-1.7));
  push(nm,B(2.9,0.9,2.9),T(0,18.4,-1.4));for(const sx of[-1,1]){push(nm,B(0.9,2.8,0.5),T(sx*1.55,14.8,-0.15));push(mat,B(0.3,0.8,0.5),T(sx*1.3,16.8,-1.1));}
  push(mat,B(0.4,0.6,0.5),T(0,16.4,0.15));push(mat,B(0.5,1.3,0.4),T(0,14.4,0.05));push(mat,B(0.35,0.9,0.35),T(0,18.6,0.0));}
// templo genérico mejorado (pilono, patio porticado, sala de columnas con techo pintado, santuario con gola), de frente a +z local
function tbTempleParts(x,y,z,a,s,ctx){const R=a,toW2=(lx,lz)=>toW(lx,lz,x,z,R),push=ctx.push,col=ctx.col,rel=tbMat('relief2'),st=tbMat('stone'),corn=tbMat('corn'),M4=(lx,ly,lz)=>{const p=toW2(lx,lz);return new THREE.Matrix4().makeRotationY(R).setPosition(p[0],y+ly,p[1]);};
  tbPylonParts(x,y,z,R+Math.PI,34*s,18*s,push);
  const wl=(lx,lz,w,d,h,m)=>{push(m||rel,boxUV(w,h,d,(m||rel).userData.s),M4(lx,h/2,lz));push(corn,boxUV(w+0.8,1.1*s,d+0.8,4),M4(lx,h+0.55*s,lz));const p=toW2(lx,lz);addBox(p[0],p[1],w,d,R);};
  for(const sx of[-1,1])wl(sx*17*s,-22*s,1.6*s,40*s,8*s);
  for(let i=0;i<4;i++)for(const sx of[-1,1]){const p=toW2(sx*13*s,(-8-i*8)*s);col(p[0],p[1],0.9*s,7*s,false,true);}
  for(let i=0;i<3;i++)for(let j=0;j<4;j++){const p=toW2((-9+j*6)*s,(-46-i*6)*s);col(p[0],p[1],1.1*s,9*s,j===1||j===2,true);}
  wl(0,-42*s,36*s,1.6*s,10*s);wl(0,-62*s,36*s,1.6*s,10*s);for(const sx of[-1,1])wl(sx*17.2*s,-52*s,1.6*s,20*s,10*s);
  push(st,boxUV(36*s,1.2*s,20*s,4),M4(0,10.6*s,-52*s));push(tbMat('ceil'),boxUV(34*s,0.1,18*s,4),M4(0,9.95*s,-52*s));
  wl(0,-72*s,20*s,18*s,9*s);
  footprints.push({x:toW2(0,-36*s)[0],z:toW2(0,-36*s)[1],w:36*s,d:72*s,a:R,c:'#e2d0a8',name:ctx.name});}
