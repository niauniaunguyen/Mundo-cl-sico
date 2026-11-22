// ============================================================ LO QUE FALTABA (22/11): aves de Blender, casa habitada y color calibrado
// 1. El mochuelo y el águila del vuelo de entrada, modelados en Blender (herramientas/blender/aves.py → modelos/aves.glb): cuerpo,
//    cabeza con disco facial y ojos (mochuelo) o pico ganchudo y nuca dorada (águila), cola, y alas en dos piezas (brazo y mano)
//    que baten de verdad; el mochuelo, con el dorso moteado de blanco; el águila, con las primarias separadas como dedos.
//    Se traen en segundo plano al elegir época; si aún no han llegado, vuela el ave sencilla de antes.
// 2. La casa propia, habitada: arcón y taburete en el dormitorio, el fuego del hogar con su humo y una olla, la hidria del agua,
//    comida en la mesa del banquete (pan, fruta, una copa), lámparas de aceite en pie que se encienden al anochecer, pesas de barro
//    y cesto de lana junto al telar (Atenas) o el estuche de rollos (capsa) y el tintero (Roma), el brocal de la cisterna en el
//    patio (Atenas: las casas guardaban el agua de lluvia en cisternas) o la mesa de mármol del atrio (cartibulum, Roma).
// 3. Color calibrado (experimental): Esc → Partida. Gestión del color correcta (000_color_calibrado.js); al activarlo o quitarlo,
//    el juego guarda y se recarga.
// ---- 1. aves
const AV={tpl:null,loading:false};
function avLoad(){if(AV.loading||AV.tpl||typeof bpBytes!=='function'||!THREE.GLTFLoader)return;AV.loading=true;
  bpBytes('glbav').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const T={};for(const k of['mochuelo','aguila','paloma','gaviota','gorrion']){const o=gl.scene.getObjectByName(k);if(o)T[k]=o;}
    gl.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;if(o.material){o.material.side=THREE.DoubleSide;if(o.material.roughness!==undefined)o.material.roughness=0.9;}}});AV.tpl=T;},e=>console.warn('aves',e));}).catch(e=>console.warn('aves',e));}
{const f=chooseMode;chooseMode=function(){const r=f.apply(this,arguments);try{setTimeout(avLoad,1500);}catch(e){}return r;};}
{const f=vueloBird;vueloBird=function(owl){const T=AV.tpl&&AV.tpl[owl?'mochuelo':'aguila'];if(!T)return f.apply(this,arguments);const g=T.clone(true),n=owl?'mochuelo':'aguila';
  const W=[];for(const[s,c]of[[-1,'I'],[1,'D']]){const sh=g.getObjectByName(n+'_a'+c+'1'),el=g.getObjectByName(n+'_a'+c+'2');if(sh&&el)W.push({sh,el,s});}
  if(W.length<2)return f.apply(this,arguments);g.position.set(0,0,0);g.rotation.set(0,0,0);g.scale.setScalar(1);const o=new THREE.Group();o.add(g);o.userData={W,owl,k:1,glb:true};return o;};}
// ---- 2. la casa habitada
const CASA2={g:null,flames:[],lamps:[],smoke:[]};
function c2Flame(){if(CASA2.tex)return CASA2.tex;const c=document.createElement('canvas');c.width=32;c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(16,44,1,16,40,18);
  g.addColorStop(0,'rgba(255,250,210,1)');g.addColorStop(0.35,'rgba(255,190,80,.9)');g.addColorStop(1,'rgba(255,120,20,0)');x.fillStyle=g;x.beginPath();x.moveTo(16,4);x.quadraticCurveTo(30,40,16,62);x.quadraticCurveTo(2,40,16,4);x.fill();
  return CASA2.tex=new THREE.CanvasTexture(c);}
function c2Glow(){if(CASA2.gtex)return CASA2.gtex;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,1,32,32,31);g.addColorStop(0,'rgba(255,200,120,.55)');g.addColorStop(1,'rgba(255,160,60,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return CASA2.gtex=new THREE.CanvasTexture(c);}
function c2Fire(g,x,y,z,big,night){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:c2Flame(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(big?0.5:0.09,big?0.8:0.16,1);s.position.set(x,y+(big?0.35:0.07),z);g.add(s);
  const h=new THREE.Sprite(new THREE.SpriteMaterial({map:c2Glow(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));h.scale.set(big?3.2:1.4,big?3.2:1.4,1);h.position.set(x,y+(big?0.4:0.08),z);g.add(h);
  const o={s,h,big,night,ph:Math.random()*9};CASA2.flames.push(o);return o;}
function buildCasa2(){if(CASA2.g||typeof CASA==='undefined'||!CASA.X)return;const ro=MODE==='roma',g=new THREE.Group();g.position.set(CASA.X,CASA.Y,CASA.Z);scene.add(g);CASA2.g=g;
  const L=c=>lam(c),wood=roleMat('wood'),B=(w,h,d,m,x,y,z)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=true;g.add(b);return b;},
    C=(r0,r1,h,m,x,y,z,seg)=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(r0,r1,h,seg||12),m);c.position.set(x,y,z);c.castShadow=true;g.add(c);return c;},S=(r,m,x,y,z,sx,sy,sz)=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),m);s.position.set(x,y,z);s.scale.set(sx||1,sy||1,sz||1);g.add(s);return s;};
  // dormitorio: arcón con herrajes y taburete
  B(1.1,0.55,0.55,wood,-10.9,0.28,-9.3);B(1.14,0.08,0.59,L('#7a5a3a'),-10.9,0.59,-9.3);for(const dx of[-0.4,0.4])B(0.06,0.5,0.6,L('#9a7a3a'),-10.9+dx,0.3,-9.3);
  for(const[dx,dz]of[[-0.2,-0.2],[0.2,-0.2],[-0.2,0.2],[0.2,0.2]])C(0.025,0.03,0.42,wood,-7.6+dx,0.21,-12.4+dz,6);B(0.5,0.05,0.5,L(ro?'#7a1c3a':'#b9a882'),-7.6,0.44,-12.4);
  // lámpara sobre el arcón
  S(0.07,L('#a8603a'),-10.7,0.66,-9.3,1.5,0.5,1);c2Fire(g,-10.62,0.66,-9.3,false,true);
  // cocina: fuego del hogar, olla y trípode, hidria
  c2Fire(g,-9,0.9,10,true,false);for(let i=0;i<3;i++){const a=i/3*TAU;C(0.015,0.015,0.55,L('#3a3632'),-9+Math.cos(a)*0.22,1.15,10+Math.sin(a)*0.22,5);}S(0.2,L('#4a3a30'),-9,1.42,10,1,0.85,1);
  const hy=S(0.24,L('#a8532f'),-11.1,0.42,12.3,1,1.35,1);C(0.08,0.11,0.2,L('#a8532f'),-11.1,0.85,12.3);
  // banquete: comida en la mesa
  for(let i=0;i<3;i++)C(0.12,0.12,0.06,L('#c89a5a'),-0.3+i*0.3,0.73,-11.6,10);S(0.16,L('#6a4a2a'),0.1,0.72,-11.3,1,0.35,1);for(let i=0;i<5;i++)S(0.04,L(['#8a2a4a','#c9a64a','#6a8a3a'][i%3]),0.05+(i%3)*0.05,0.78,-11.32+(i>2?0.05:0));
  const ky=C(0.13,0.04,0.05,L(ro?'#c9a64a':'#2a1d14'),-0.4,0.75,-11.25);
  // lámparas de aceite en pie (se encienden al anochecer)
  for(const x of[-2.6,2.6]){C(0.03,0.05,1.45,L('#7a6a3a'),x,0.72,-10.6,6);C(0.16,0.02,0.04,L('#7a6a3a'),x,0.02,-10.6,8);S(0.07,L('#a8603a'),x,1.48,-10.6,1.5,0.5,1);CASA2.lamps.push(c2Fire(g,x+0.08,1.48,-10.6,false,true));}
  if(ro){C(0.16,0.16,0.4,L('#7a4a2a'),10.2,0.2,-10.4,12);for(let i=0;i<5;i++)C(0.03,0.03,0.46,L('#e8dcc0'),10.12+(i%3)*0.08,0.3,-10.45+Math.floor(i/3)*0.08,6);C(0.04,0.05,0.07,L('#3a3a3a'),9.2,0.86,-10.8,8);
    B(1.4,0.08,0.7,L('#e8e4dc'),0,0.85,7.2);B(0.12,0.8,0.5,L('#e8e4dc'),-0.55,0.41,7.2);B(0.12,0.8,0.5,L('#e8e4dc'),0.55,0.41,7.2);}
  else{for(let i=0;i<9;i++){const p=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.12,4),L('#9a5a3a'));p.position.set(8.2+i*0.2,0.3,-12.05);p.rotation.x=Math.PI;g.add(p);}
    C(0.22,0.16,0.35,L('#c8b07a'),7.6,0.18,-11.2,10);S(0.14,L('#efe6d4'),7.6,0.38,-11.2,1,0.6,1);
    C(0.45,0.5,0.6,L('#d8ccb4'),3.6,0.3,6,16);C(0.32,0.32,0.62,L('#2a2622'),3.6,0.32,6,16);}
  CASA2.smokeAt=[-9,1.6,10];}
function casa2Tick(dt){if(!CASA2.g){if(typeof CASA!=='undefined'&&CASA.X)try{buildCasa2();}catch(e){console.warn('casa2',e);}return;}
  const inside=typeof CASA!=='undefined'&&CASA.inside;CASA2.g.visible=true;if(!inside)return;const t=performance.now()/1000,night=typeof DAYF==='undefined'||DAYF<0.45;
  for(const f of CASA2.flames){const on=!f.night||night;f.s.visible=f.h.visible=on;if(!on)continue;const k=1+Math.sin(t*11+f.ph)*0.08+Math.sin(t*23+f.ph*2)*0.05;f.s.scale.y=(f.big?0.8:0.16)*k;f.h.material.opacity=0.75+0.25*Math.sin(t*7+f.ph);}
  // humo del hogar que sube hasta el tejado
  if(!CASA2.smoke.length){for(let i=0;i<10;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:typeof G4!=='undefined'&&G4.smT?G4.smT:c2Glow(),transparent:true,depthWrite:false,opacity:0,color:0xcfc8be}));s.userData.t=i*0.4;CASA2.g.add(s);CASA2.smoke.push(s);}}
  const [sx,sy,sz]=CASA2.smokeAt;for(const s of CASA2.smoke){s.userData.t+=dt;if(s.userData.t>4)s.userData.t=0;const k=s.userData.t/4;s.position.set(sx+k*0.6,sy+k*2.6,sz+Math.sin(k*4)*0.2);const sc=0.3+k*1.4;s.scale.set(sc,sc,1);s.material.opacity=0.3*Math.sin(Math.PI*k);}}
// ---- 3. color calibrado
function colcalApply(){if(typeof COLCAL==='undefined'||!COLCAL||CASA2.colOk)return;CASA2.colOk=1;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMappingExposure=0.9;
  try{SKY.fragmentShader=SKY.fragmentShader.replace(/\}\s*$/,'gl_FragColor.rgb=pow(max(gl_FragColor.rgb,vec3(0.0)),vec3(1.0/2.2));}');SKY.needsUpdate=true;}catch(e){}
  try{renderer.domElement.style.filter='none';}catch(e){}}
function colcalTex(){if(typeof COLCAL==='undefined'||!COLCAL)return;scene.traverse(o=>{const m=o.material;if(!m)return;for(const mm of(Array.isArray(m)?m:[m])){for(const k of['map','emissiveMap']){const t=mm[k];if(t&&t.encoding!==THREE.sRGBEncoding&&!t.userData.colcal){t.userData.colcal=1;t.encoding=THREE.sRGBEncoding;t.needsUpdate=true;mm.needsUpdate=true;}}}});}
{const f=gmDo;gmDo=function(k){if(k==='colcal'){const on=!(typeof COLCAL!=='undefined'&&COLCAL);try{localStorage.setItem('nostos-color',on?'calibrado':'');}catch(e){}try{save();}catch(e){}
  try{gmClose&&gmClose();}catch(e){}toast('<span class="label">Color '+(on?'calibrado':'de siempre')+'</span><br>El juego se recarga para aplicarlo…');setTimeout(()=>location.reload(),1200);return;}return f.apply(this,arguments);};}
// que la resolución dinámica y el ajuste de color de 231 no pisen el modo calibrado
{const f=g4Grade;g4Grade=function(){if(typeof COLCAL!=='undefined'&&COLCAL)return;return f.apply(this,arguments);};}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(state&&ui!=='start'){casa2Tick(dt);colcalApply();CASA2.ct=(CASA2.ct||0)+dt;if(CASA2.ct>3){CASA2.ct=0;colcalTex();}}}catch(e){}return r;};}
