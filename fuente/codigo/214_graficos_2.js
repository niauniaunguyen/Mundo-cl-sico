// ============================================================ GRÁFICOS (2): interiores con rayos de luz y humo, agua que corre en las fuentes, polvo y huellas,
// viento visible, gente más variada, mercados con puestos, vida en las fachadas, sombras de nubes, oficios animados y montes con nombre.
//  W1 Interiores: un haz de luz que entra por la puerta, humo que sube del hogar y lucernas que titilan.
//  WG2 Fuentes: chorro de agua que cae y ondas en la pila (las krenai de Atenas, los lacus de Roma).
//  W3 Polvo al correr por tierra y huellas que se borran poco a poco (más marcadas si ha llovido).
//  W4 Viento: más fuerte con el mal tiempo y en otoño; en días de viento vuelan briznas y hojas cerca de ti.
//  W5 Gente variada: complexiones distintas y ancianos con bastón.
//  W6 Mercados: puestos con toldos de rayas y mercancía (ánforas, cestos de fruta, pescado, telas).
//  W7 Vida en las fachadas: macetas, ropa tendida (Roma), pintadas electorales (dipinti) y el mojón del Ágora.
//  W8 Sombras de las nubes que pasan por el suelo (según el tiempo).
//  W9 Los trabajadores de los oficios, con los modelos nuevos, hacen su trabajo (empujar, agacharse, coger…).
//  W10 Montes del horizonte con su nombre real en el modo atención.
const WG2={t:0,int:{},jets:[],prints:null,pi:0,dust:[],motes:null,mk:false,fa:false,mtn:[],job:[],jobT:0};
const w2Rnd=mulberry32(4207);
// ---------------------------------------------------------------- W1 interiores
function w2Glow(c0,c1){const c=document.createElement('canvas');c.width=64;c.height=256;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,c0);g.addColorStop(1,c1);x.fillStyle=g;x.fillRect(0,0,64,256);
  const h=x.createLinearGradient(0,0,64,0);h.addColorStop(0,'rgba(0,0,0,1)');h.addColorStop(0.3,'rgba(0,0,0,0)');h.addColorStop(0.7,'rgba(0,0,0,0)');h.addColorStop(1,'rgba(0,0,0,1)');x.globalCompositeOperation='destination-out';x.fillStyle=h;x.fillRect(0,0,64,256);return new THREE.CanvasTexture(c);}
function w2Puff(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,1,32,32,31);g.addColorStop(0,'rgba(255,255,255,0.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
const W2T={};function w2Tex(k){if(!W2T[k])W2T[k]=k==='beam'?w2Glow('rgba(255,236,190,0.0)','rgba(255,228,170,0.55)'):w2Puff();return W2T[k];}
function w2Interior(R){if(!R||!R.g||WG2.int[R.X+','+R.Z])return;const I={R,smoke:[],lamps:[]};WG2.int[R.X+','+R.Z]=I;const g=R.g;
  const bb=new THREE.Box3().setFromObject(g),sz=bb.getSize(new THREE.Vector3());if(!isFinite(sz.x)||sz.x<2)return;
  const sp=R.spawn||[0,0];   // el haz entra por la puerta (junto a la salida) y cae en diagonal hacia dentro
  const bm=new THREE.MeshBasicMaterial({map:w2Tex('beam'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,opacity:0.55});
  for(let i=0;i<2;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(1.4,Math.min(5,sz.y*1.1)),bm);p.position.set(sp[0]*0.6+(i-0.5)*0.9,Math.min(2.4,sz.y*0.45),sp[1]*0.55);p.rotation.set(0.5,i*1.2,0);p.renderOrder=5;g.add(p);}
  const sm=new THREE.SpriteMaterial({map:w2Tex('puff'),color:'#9a948a',transparent:true,depthWrite:false,opacity:0.3});
  const cx=-sp[0]*0.4,cz=-sp[1]*0.6;for(let i=0;i<10;i++){const s=new THREE.Sprite(sm.clone());s.position.set(cx,0.4,cz);s.userData.ph=i/10;g.add(s);I.smoke.push(s);}
  for(let i=0;i<2;i++){const L=new THREE.PointLight('#ffb060',0.9,7,2);L.position.set((i?1:-1)*sz.x*0.3,1.6,cz*0.5);g.add(L);
    const f=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ffcc77',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));f.scale.set(0.35,0.5,1);f.position.copy(L.position);g.add(f);I.lamps.push({L,f,ph:i*2.3});}}
{const f=int2Room;int2Room=function(room){const R=f.apply(this,arguments);try{if(gqOn('medio'))w2Interior(R);}catch(e){console.warn('interior',e);}return R;};}
function w2IntTick(dt){if(typeof INT2==='undefined'||!INT2.in)return;const I=WG2.int[INT2.in.R.X+','+INT2.in.R.Z];if(!I)return;const t=WG2.t;
  for(const s of I.smoke){const k=(t*0.12+s.userData.ph)%1;s.position.y=0.4+k*3.2;s.position.x+=Math.sin(t+s.userData.ph*9)*0.002;s.scale.setScalar(0.4+k*1.6);s.material.opacity=0.32*Math.sin(k*Math.PI);}
  for(const l of I.lamps){const n=0.75+0.18*Math.sin(t*13+l.ph)+0.1*Math.sin(t*29+l.ph*3)+0.05*Math.sin(t*51);l.L.intensity=0.9*n;l.f.scale.set(0.3*n+0.05,0.48*n,1);}}
// ---------------------------------------------------------------- WG2 fuentes
function w2Fountains(){if(WG2.fo)return;WG2.fo=1;const re=/krene|fuente|lacus|ninfeo|enneakrounos|fons|meta_sudans/i;
  const wm=new THREE.MeshBasicMaterial({color:'#cfe6f0',transparent:true,opacity:0.55,depthWrite:false,side:THREE.DoubleSide});
  for(const p of PLACES){if(!re.test((p.id||'')+' '+(p.name||''))||!isFinite(p.x)||Math.abs(p.x)>4000)continue;const y=floorAt(p.x,p.z);
    const jet=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.07,1.1,6,4,true),wm.clone());jet.position.set(p.x,y+1.15,p.z);scene.add(jet);
    const ring=new THREE.Mesh(new THREE.RingGeometry(0.1,0.16,20),new THREE.MeshBasicMaterial({color:'#e8f6fa',transparent:true,opacity:0.5,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(p.x,y+0.62,p.z);scene.add(ring);
    WG2.jets.push({jet,ring,ph:w2Rnd()*6});}}
function w2FountTick(){const t=WG2.t;for(const J of WG2.jets){const d=Math.hypot(J.jet.position.x-player.x,J.jet.position.z-player.z),on=d<90;J.jet.visible=J.ring.visible=on;if(!on)continue;
  J.jet.material.opacity=0.42+0.12*Math.sin(t*17+J.ph);J.jet.scale.x=J.jet.scale.z=1+0.15*Math.sin(t*11+J.ph);const k=(t*0.7+J.ph)%1;J.ring.scale.setScalar(1+k*4);J.ring.material.opacity=0.5*(1-k);}}
// ---------------------------------------------------------------- W3 polvo y huellas
function w2PrintTex(){const c=document.createElement('canvas');c.width=32;c.height=64;const x=c.getContext('2d');x.fillStyle='rgba(40,28,16,0.55)';x.beginPath();x.ellipse(16,40,9,20,0,0,TAU);x.fill();x.beginPath();x.ellipse(16,12,7,9,0,0,TAU);x.fill();return new THREE.CanvasTexture(c);}
function w2Prints(){if(WG2.prints)return;const g=new THREE.PlaneGeometry(0.13,0.28);g.rotateX(-Math.PI/2);const m=new THREE.MeshBasicMaterial({map:w2PrintTex(),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4,opacity:0.6});
  const N=80,M2=new THREE.InstancedMesh(g,m,N);M2.instanceMatrix.setUsage(THREE.DynamicDrawUsage);M2.frustumCulled=false;M2.count=0;scene.add(M2);WG2.prints={M:M2,N,a:[],last:null,side:0};
  const sm=new THREE.SpriteMaterial({map:w2Tex('puff'),color:'#c8b08a',transparent:true,depthWrite:false,opacity:0});for(let i=0;i<14;i++){const s=new THREE.Sprite(sm.clone());s.visible=false;scene.add(s);WG2.dust.push({s,life:0});}}
const _w2m=new THREE.Matrix4(),_w2q=new THREE.Quaternion(),_w2v=new THREE.Vector3(),_w2s=new THREE.Vector3(1,1,1),_w2up=new THREE.Vector3(0,1,0);
function w2StepTick(dt){const P=WG2.prints;if(!P)return;const inside=typeof INT2!=='undefined'&&INT2.in,ok=ui==='play'&&player.grounded&&!inside&&!(typeof MOUNT!=='undefined'&&MOUNT.riding)&&!(typeof BOAT!=='undefined'&&BOAT.on);
  const sp=Math.hypot(GF.vx||0,GF.vz||0),wet=(WXS.rain||0)>0.1||(state&&state.wx&&state.wx.wet);
  if(ok&&sp>1){const L=P.last;if(!L||Math.hypot(player.x-L[0],player.z-L[1])>0.72){P.last=[player.x,player.z];P.side^=1;const a=Math.atan2(GF.vx,GF.vz),o=P.side?0.11:-0.11;
      const x=player.x+Math.cos(a)*o,z=player.z-Math.sin(a)*o;P.a.push({x,z,y:terrainH(x,z)+0.02,a,t:0,k:wet?1:0.55});if(P.a.length>P.N)P.a.shift();
      if(sp>6&&!wet){const D=WG2.dust.find(d=>d.life<=0);if(D){D.life=1;D.s.visible=true;D.s.position.set(player.x,terrainH(player.x,player.z)+0.15,player.z);D.s.scale.setScalar(0.4);}}}}
  let n=0;for(const f of P.a){f.t+=dt;const al=Math.max(0,1-f.t/(f.k>0.9?40:22));if(al<=0)continue;_w2q.setFromAxisAngle(_w2up,f.a);_w2v.set(f.x,f.y,f.z);_w2s.set(al*0.3+0.7,1,1);_w2m.compose(_w2v,_w2q,_w2s);P.M.setMatrixAt(n++,_w2m);}
  P.M.count=n;P.M.instanceMatrix.needsUpdate=true;P.M.material.opacity=wet?0.75:0.45;
  for(const D of WG2.dust){if(D.life<=0)continue;D.life-=dt*1.4;D.s.position.y+=dt*0.4;D.s.scale.multiplyScalar(1+dt*1.5);D.s.material.opacity=Math.max(0,D.life)*0.35;if(D.life<=0)D.s.visible=false;}}
// ---------------------------------------------------------------- W4 viento
{const f=windTick;windTick=function(dt){f(dt);try{if(GF.reduced)return;let ss='pri';try{ss=calNow().season.id;}catch(e){}const k=1+0.7*(WXS.cl||0)+(ss==='oto'?0.3:ss==='inv'?0.15:0);WIND.s.value*=k;}catch(e){}};}
function w2Motes(){if(WG2.motes)return;const N=40,g=new THREE.BufferGeometry(),p=new Float32Array(N*3);g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const m=new THREE.PointsMaterial({color:'#b89a5a',size:0.07,transparent:true,opacity:0.8,depthWrite:false});WG2.motes=new THREE.Points(g,m);WG2.motes.frustumCulled=false;scene.add(WG2.motes);WG2.mv=[];for(let i=0;i<N;i++)WG2.mv.push({x:0,y:-999,z:0,ph:w2Rnd()*6});}
function w2MoteTick(dt){const M=WG2.motes;if(!M)return;const on=ui==='play'&&WIND.s.value>1.15&&!(typeof INT2!=='undefined'&&INT2.in)&&(WXS.rain||0)<0.2;M.visible=on;if(!on)return;let ss='pri';try{ss=calNow().season.id;}catch(e){}
  M.material.color.set(ss==='oto'?'#a86a2a':ss==='pri'?'#efe2ea':'#b89a5a');M.material.size=ss==='oto'?0.11:0.06;const a=M.geometry.attributes.position,w=WIND.s.value,t=WG2.t;
  WG2.mv.forEach((q,i)=>{q.x+=w*2.2*dt;q.z+=Math.sin(t*0.9+q.ph)*0.8*dt;q.y+=Math.sin(t*2+q.ph)*0.6*dt;const gy=terrainH(q.x,q.z);
    if(q.y<gy||Math.hypot(q.x-player.x,q.z-player.z)>22){const r=4+w2Rnd()*16,an=w2Rnd()*TAU;q.x=player.x+Math.cos(an)*r-8;q.z=player.z+Math.sin(an)*r;q.y=terrainH(q.x,q.z)+0.2+w2Rnd()*2.2;}a.setXYZ(i,q.x,q.y,q.z);});a.needsUpdate=true;}
// ---------------------------------------------------------------- W5 gente variada
{const f=bpMake;bpMake=function(kind,c){const g=f.apply(this,arguments);if(!g)return g;try{const r=Math.random(),root=g.children[0];
  const wd=0.9+Math.random()*0.22;root.scale.x*=wd;root.scale.z*=0.95+(wd-0.9)*0.6;   // complexiones: más anchos o más delgados
  if(!/hoplita|legionario/.test(kind)&&r<0.13&&!(c&&c.noVary)){g.userData.old=1;root.scale.y*=0.96;root.rotation.x=0.07;   // ancianos: un poco encorvados y con bastón
    const cane=new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.018,0.95,6),lam('#6b4a2c'));cane.userData.w2cane=1;g.userData.cane=cane;}}catch(e){}return g;};}
function w2CaneTick(){for(const g of BP.list){if(!g.userData.cane||g.userData.caneOk)continue;let h=null;g.traverse(o=>{if(o.isBone&&/^hand\.?_?R$/i.test(o.name))h=o;});if(h){g.add(g.userData.cane);g.userData.caneHand=h;g.userData.caneOk=1;}}}
// el bastón, siempre vertical y apoyado en el suelo, bajo la mano derecha (cada fotograma, solo los cercanos)
const _w2h=new THREE.Vector3();function w2CaneFrame(){const cx=camera.position.x,cz=camera.position.z;for(const g of BP.list){const c=g.userData.cane,h=g.userData.caneHand;if(!h||!g.visible||!g.parent)continue;
  if((g.position.x-cx)**2+(g.position.z-cz)**2>900)continue;h.getWorldPosition(_w2h);g.worldToLocal(_w2h);const s=g.scale.y||1;c.position.set(_w2h.x,0.475/s,_w2h.z);c.rotation.set(0,0,0);c.scale.setScalar(1/s);}}
// ---------------------------------------------------------------- W6 mercados
function w2Awn(c1,c2){const c=document.createElement('canvas');c.width=128;c.height=32;const x=c.getContext('2d');for(let i=0;i<8;i++){x.fillStyle=i%2?c1:c2;x.fillRect(i*16,0,16,32);}const t=new THREE.CanvasTexture(c);return new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide});}
function w2Stall(x,z,a,ro,i){const g=grp(x,floorAt(x,z),z,a),wood=lam('#7a5634');const C=[['#c9b28a','#8a3b2a'],['#d8cfa8','#3e5a7a'],['#cbb488','#5e6e3a']][i%3];
  for(const [px,pz] of[[-1.1,-0.6],[1.1,-0.6],[-1.1,0.6],[1.1,0.6]])box(0.07,pz<0?2.2:1.9,0.07,wood,px,(pz<0?2.2:1.9)/2,pz,g);
  const aw=new THREE.Mesh(new THREE.PlaneGeometry(2.5,1.5),w2Awn(C[0],C[1]));aw.rotation.x=-Math.PI/2+0.2;aw.position.set(0,2.05,0);g.add(aw);
  box(2.1,0.08,0.8,wood,0,0.85,0.1,g);box(0.07,0.85,0.07,wood,-0.95,0.42,0.4,g);box(0.07,0.85,0.07,wood,0.95,0.42,0.4,g);
  const kind=i%4;for(let k=0;k<5;k++){const gx=-0.8+k*0.4;
    if(kind===0){const am=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.05,0.32,8),lam('#a8603a'));am.position.set(gx,1.05,0.1);g.add(am);}
    else if(kind===1){box(0.3,0.1,0.3,lam('#a8884a'),gx,0.94,0.1,g);for(let j=0;j<4;j++){const s=new THREE.Mesh(new THREE.SphereGeometry(0.045,6,5),lam(['#c84a2a','#e0a030','#6a8a3a','#7a3a5a'][(k+j)%4]));s.position.set(gx+(j%2-0.5)*0.1,1.02,0.1+(j>1?0.06:-0.06));g.add(s);}}
    else if(kind===2){const f=box(0.32,0.04,0.09,lam('#9aa4a8'),gx,0.92,0.1,g);f.rotation.y=0.3;}
    else box(0.34,0.12,0.28,lam(['#8a3b2a','#3e5a7a','#c9a64a','#5e6e3a','#e8dcc0'][k]),gx,0.95,0.1,g);}
  addBox(x,z,2.3,1.4,a);}
function w2Markets(){if(WG2.mk)return;WG2.mk=true;const ro=MODE==='roma';const P=kPlace(ro?/macellum/:/agora/)||kPlace(ro?/foro/:/agora/);if(!P)return;
  for(let i=0;i<8;i++){const an=i/8*TAU+0.3,r=ro?14:22,f=findFree(P.x+Math.cos(an)*r,P.z+Math.sin(an)*r,1.6);if(roadDist&&roadDist(f[0],f[1])<1.8)continue;w2Stall(f[0],f[1],-an+Math.PI/2,ro,i);}}
// ---------------------------------------------------------------- W7 vida en las fachadas
function w2TextTex(txt,col,bg,w,h,font){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=col;x.font=font;x.textAlign='center';x.textBaseline='middle';
  txt.split('\n').forEach((l,i,A)=>x.fillText(l,w/2,h/2+(i-(A.length-1)/2)*h/(A.length+0.6)));return new THREE.CanvasTexture(c);}
function w2Facades(){if(WG2.fa)return;WG2.fa=true;const ro=MODE==='roma';
  const pot=(x,z)=>{const g=grp(x,floorAt(x,z),z,0);const v=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.15,0.4,10),lam('#a65a36'));v.position.y=0.2;g.add(v);
    for(let i=0;i<5;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(0.13,6,5),lam(['#4f6e34','#5d7a3a','#3e5a2a'][i%3]));l.position.set((i%3-1)*0.1,0.48+(i>2?0.12:0),(i%2-0.5)*0.12);g.add(l);}};
  const P0=kPlace(ro?/subura/:/kerameis|ceramico|demo_/)||kPlace(ro?/foro/:/agora/);if(!P0)return;
  for(let i=0;i<14;i++){const f=findFree(P0.x+(w2Rnd()-0.5)*80,P0.z+(w2Rnd()-0.5)*80,0.5);pot(f[0],f[1]);}
  if(ro){   // ropa tendida entre dos postes, en los patios de las ínsulas
    for(let i=0;i<5;i++){const f=findFree(P0.x+(w2Rnd()-0.5)*70,P0.z+(w2Rnd()-0.5)*70,2.5),g=grp(f[0],floorAt(f[0],f[1]),f[1],w2Rnd()*3);box(0.08,2.4,0.08,lam('#6b4a2c'),-1.6,1.2,0,g);box(0.08,2.4,0.08,lam('#6b4a2c'),1.6,1.2,0,g);box(3.2,0.015,0.015,lam('#c9b89a'),0,2.25,0,g);
      for(let k=0;k<4;k++)box(0.5,0.6+w2Rnd()*0.3,0.02,lam(['#e8dcc0','#b04a30','#c9a64a','#6a7a8a'][k]),-1.1+k*0.72,1.9,0,g);}
    // pintadas electorales, como las de Pompeya (CIL IV): en rojo sobre el enlucido
    const DIP=[['C · IVLIVM · POLYBIVM\nAED · O · V · F','«Os pido que votéis a Gayo Julio Polibio para edil» (Pompeya, CIL IV 429)'],['M · HOLCONIVM · PRISCVM\nIIVIR · I · D · O · V · F','«Votad a Marco Holconio Prisco para duunviro» (Pompeya, CIL IV)'],['VALE · QVI · LEGIS','«Salud a quien lo lea» (saludo frecuente en las paredes)']];
    DIP.forEach((d,i)=>{const P=kPlace([/subura/,/foro/,/argiletum|subura/][i])||P0,f=findFree(P.x+12+i*6,P.z-8-i*5,1.5),g=grp(f[0],floorAt(f[0],f[1]),f[1],w2Rnd()*3);
      box(3.4,2.6,0.4,lam('#d8c8a8'),0,1.3,0,g);const p=new THREE.Mesh(new THREE.PlaneGeometry(3,1.2),new THREE.MeshLambertMaterial({map:w2TextTex(d[0],'#a02818','#e2d4b4',512,200,'bold 44px Georgia'),transparent:false}));p.position.set(0,1.6,0.21);g.add(p);addBox(f[0],f[1],3.4,0.4,g.rotation.y);
      egxObj(f[0],f[1],undefined,()=>int2Dlg('✎','Pintada electoral','dipinto',"<p><b>"+d[0].replace('\n',' ')+"</b></p><p>"+d[1]+". En las ciudades romanas, los candidatos y sus amigos pintaban recomendaciones de voto en las paredes con letras rojas; las abreviaturas O·V·F son «oro vos faciatis», «os pido que lo hagáis».</p><p class=\"sub\">Las conservadas son sobre todo de Pompeya, sepultada el año anterior (79 d.C.); en Roma las hubo igual, pero no han sobrevivido.</p>"),'Pintada electoral','léela',2.4);});}
  else{   // el mojón del Ágora (h. 500 a.C., hoy en el museo del Ágora): «Soy el límite del Ágora»
    const A=kPlace(/agora/);if(A){const f=findFree(A.x-26,A.z+20,0.6),g=grp(f[0],floorAt(f[0],f[1]),f[1],0.4);box(0.45,1.1,0.3,M.marble,0,0.55,0,g);
      const p=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.85),new THREE.MeshLambertMaterial({map:w2TextTex('ΗΟ\nΡΟΣ\nΕΙΜΙ\nΤΕΣ\nΑΓΟ\nΡΑΣ','#5a4a3a','#e6e0d2',128,280,'bold 34px Georgia')}));p.position.set(0,0.6,0.152);g.add(p);addCirc(f[0],f[1],0.35);
      egxObj(f[0],f[1],undefined,()=>int2Dlg('Η','Mojón del Ágora','horos',"<p><b>ΗΟΡΟΣ ΕΙΜΙ ΤΕΣ ΑΓΟΡΑΣ</b>: «Soy el límite del Ágora».</p><p>Mojones como este marcaban dónde empezaba el espacio público: quien estaba privado de derechos (por ejemplo, por no cumplir con sus padres o por cobardía en la guerra) no podía pasar de aquí. Está escrito en el alfabeto ático antiguo, con H para el sonido «h» y E para la «e» larga.</p><p class=\"sub\">El original, de hacia el 500 a.C., se conserva en el museo del Ágora (Atenas).</p>"),'Mojón del Ágora','léelo',1.8);}
    for(let i=0;i<6;i++){const D=kPlace(/demo_|kerameis|ceramico/)||P0,f=findFree(D.x+(w2Rnd()-0.5)*60,D.z+(w2Rnd()-0.5)*60,1.2),g=grp(f[0],floorAt(f[0],f[1]),f[1],w2Rnd()*3);
      box(1.2,0.04,1.2,lam('#3e5a2a'),0,2.6,0,g);box(0.06,2.6,0.06,lam('#6b4a2c'),0,1.3,0,g);}}}   // emparrados
// ---------------------------------------------------------------- W8 sombras de nubes (el terreno, 036, ya lleva el código; aquí se mueve)
function w2CloudTick(dt){if(typeof TERR_U==='undefined'||!TERR_U.cShK)return;const cl=WXS.cl||0,day=typeof DAYF!=='undefined'?DAYF:1;
  const k=gqOn('medio')&&!(typeof INT2!=='undefined'&&INT2.in)?Math.max(0,Math.min(1,cl*2.2))*(1-Math.max(0,cl-0.6)*2)*day:0;TERR_U.cShK.value=k*0.32;TERR_U.cShC.value=0.62-cl*0.3;
  const w=(WIND.s?WIND.s.value:1);TERR_U.cShO.value.x+=dt*0.0004*w;TERR_U.cShO.value.y+=dt*0.00017*w;}
// ---------------------------------------------------------------- W9 los oficios trabajan
const W2J={forja:'empujar',martillo:'empujar',girar:'agachado',pisar:'bailar',brazos:'coger',pregon:'hablar',remar:'empujar'};
function w2JobSetup(){if(typeof OFIC==='undefined')return;for(const O of OFIC)for(const p of O.ppl||[]){const B=p.m&&p.m.userData&&p.m.userData.bp;if(!B||B.job!==undefined)continue;
  const T=BP.tpl[B.kind],want=W2J[p.anim]||(O.tipo==='pregon'?'hablar':'coger'),cl=T&&T.anims.find(a=>a.name.endsWith(want));B.job=null;if(!cl)continue;
  B.job=B.mix.clipAction(cl);B.job.play();B.job.setEffectiveWeight(1);B.jobRate=want==='bailar'?0.6:want==='empujar'?0.8:1;WG2.job.push(p.m);}}
{const f=bpTick;bpTick=function(dt){f(dt);try{const cx=camera.position.x,cz=camera.position.z;for(const g of WG2.job){const B=g.userData.bp;if(!B||!B.job||!g.parent)continue;
  const v=new THREE.Vector3();g.getWorldPosition(v);if((v.x-cx)**2+(v.z-cz)**2>BP.R*BP.R)continue;if(B.idle)B.idle.setEffectiveWeight(0);if(B.walk)B.walk.setEffectiveWeight(0);
  const d=B.job.getClip().duration;B.job.time=(B.t*B.jobRate)%d;B.mix.update(0);}w2CaneFrame();}catch(e){}};}
// ---------------------------------------------------------------- W10 montes con nombre (modo atención)
const W2M={atenas:[['Himeto','Ὑμηττός',100,'Famoso por su miel y su mármol gris azulado. Al atardecer se vuelve violeta: por eso a Atenas la llamaban «coronada de violetas» (Píndaro).'],['Pentélico','Πεντελικόν',40,'De sus canteras sale el mármol blanco del Partenón y de los Propileos.'],['Parnes','Πάρνης',0,'El monte más alto del Ática (1413 m), con bosques y la frontera con Beocia; en él estaba la fortaleza de File.'],['Egáleo','Αἰγάλεως',275,'Desde sus laderas, según Heródoto, Jerjes vio desde su trono la batalla de Salamina (480 a.C.).'],['Licabeto','Λυκαβηττός',60,'Una colina rocosa junto a la ciudad, sin templos en esta época; la leyenda dice que Atenea la dejó caer.']],
 roma:[['Montes Albanos','Mons Albanus',135,'Un antiguo volcán. En su cima, el santuario de Júpiter Laciar, donde se celebraban las Ferias Latinas.'],['Montes Sabinos y Tiburtinos','Montes Sabini',60,'Por ellos llegan los acueductos (el Anio Viejo, el Anio Nuevo, el Marcio) y allí está Tíbur, con sus villas.'],['Soracte','Soracte',5,'El monte aislado que se ve al norte. Horacio lo canta cubierto de nieve (Odas I 9).'],['Janículo','Ianiculum',270,'La colina al otro lado del Tíber, desde donde se domina la ciudad.']]};
function w2Mtns(){if(WG2.mtn.length)return;const L=W2M[MODE==='roma'?'roma':'atenas'];if(!L)return;const c=MODE==='roma'?(kPlace(/foro/)||{x:0,z:0}):(kPlace(/agora/)||{x:0,z:0});
  for(const [n,orig,brg,tx] of L){const a=brg*Math.PI/180;WG2.mtn.push({n,orig,tx,dx:Math.sin(a),dz:-Math.cos(a),c});}}
{const f=atCands;atCands=function(){const C=f.apply(this,arguments);try{if(typeof INT2!=='undefined'&&INT2.in)return C;const P=player,D=900;
  for(const m of WG2.mtn){C.push({x:P.x+m.dx*D,y:terrainH(P.x,P.z)+120,z:P.z+m.dz*D,r:140,name:m.n,sub:m.orig+' · en el horizonte',txt:()=>m.tx});}}catch(e){}return C;};}
// ---------------------------------------------------------------- bucle
{const f=uxTick;uxTick=function(dt){f(dt);if(!state||ui==='start')return;try{dt=Math.min(0.1,dt||0);WG2.t+=dt;
  if(typeof PLACES!=='undefined'&&PLACES.length>20){if(!WG2.boot){WG2.boot=1;w2Prints();w2Motes();w2Mtns();}
    if(gqOn('medio')){w2Fountains();w2Markets();w2Facades();}}
  w2IntTick(dt);w2FountTick();w2StepTick(dt);w2MoteTick(dt);w2CloudTick(dt);
  WG2.jobT+=dt;if(WG2.jobT>1.5){WG2.jobT=0;w2JobSetup();w2CaneTick();}}catch(e){if(!WG2.err){WG2.err=String(e&&e.stack||e).slice(0,300);console.warn('graficos 2',e);}}};}
