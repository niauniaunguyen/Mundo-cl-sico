// ============================================================ EL PORTAL DE LAS LEYENDAS (prototipo: la Hidra de Lerna)
// Un portal con aura dorada junto al templo de Atenea Niké (Atenas; en Roma, en el Palatino, donde estaba el templo de la Victoria) lleva
// a una leyenda: aquí, la ciénaga de Lerna con la Hidra. No es historia: es el mito tal como lo contaban (se avisa al entrar).
// Reglas: Niké (Victoria) deja orbes por la ciénaga; recoge 20 sin que te alcance el veneno. Tres golpes y la leyenda te expulsa.
// Cada 4 orbes la Hidra se enfurece y le brota otra cabeza (en el mito, por cada cabeza cortada salían dos): más cabezas, más disparos.
// Las cabezas avisan antes de escupir (se echan atrás y se iluminan de verde): se puede esquivar corriendo o saltando.
// Fuentes: Hesíodo, Teogonía 313-318 (hija de Tifón y Equidna, criada por Hera); Apolodoro, Biblioteca II 5,2 (las cabezas, Yolao y
// las antorchas, la cabeza inmortal bajo una roca, las flechas mojadas en su veneno); Pausanias II 37,4 (la fuente Amimone y el plátano
// bajo el que creció la Hidra; Pausanias cree que tenía una sola cabeza y que el poeta Pisandro le dio muchas). Niké: Teogonía 383-385.
// Reutiliza las puertas e interiores de 204 (INT2): la leyenda es un «interior» al aire libre, en su sitio lejano.
const LEY={on:false,n:0,hits:0,heads:[],shots:[],orbs:[],t:0,inv:0,won:false,grace:0,lp:null,pv:{x:0,z:0},hud:null,fl:null,GOAL:20,MAXH:3,R:null};
const LEY_RA=15,LEY_HZ=-10,LEY_ROOMS=['hidra','aves','leon','caco'];   // radio de la ciénaga y dónde está la Hidra (z local)
function leyRo(){return MODE==='roma';}
function leyN(gr,la){return leyRo()?la:gr;}
function leyz(){if(!state.leyendas||typeof state.leyendas!=='object')state.leyendas={hidra:{best:0,won:0,tries:0}};return state.leyendas;}
// ---- la puerta, en la ciudad
{const f=int2Setup;int2Setup=function(){const was=INT2.ready;const r=f.apply(this,arguments);try{if(!was&&INT2.ready)leyDoor();}catch(e){console.warn('leyendas',e);}return r;};}
function leyDoor(){const ro=leyRo();let P=ro?(int2Place(/Victoria/i)||int2Place(/Palatin/i)):(int2Place(/Atenea Nik|Nike|Niké/i)||int2Place(/Propileo/i)||int2Place(/Acrópolis/i));
  if(!P&&!ro)P={x:-141,z:20};const s=int2Spot(P,ro?10:-4,ro?-8:9);if(!s)return;
  const o=int2Door(Object.assign(s,{id:'ley',room:'hidra',name:'Portal de las leyendas',sub:ro?'junto al templo de la Victoria: la Hidra de Lerna':'junto a Atenea Niké: la Hidra de Lerna'}));
  const gold=new THREE.Color('#ffd25a');o.A.m.color.copy(gold);o.A.sm.color.copy(gold);LEY.door=o;}
// ---- la ciénaga de Lerna
{const f=int2Room;int2Room=function(room){if(room!=='hidra'||INT2.rooms[room])return f.apply(this,arguments);return leyRoom();};}
function leyRoom(){const R=int2Base('hidra');R.g=grp(R.X,R.Y,R.Z,0);INT2.rooms.hidra=R;LEY.R=R;const g=R.g,ro=leyRo();
  // suelo: barro y hierba de ciénaga, más allá una orilla ancha para no ver el borde
  const fl=new THREE.Mesh(new THREE.CircleGeometry(70,48),lam('#5f6a3e'));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;g.add(fl);
  const mud=new THREE.Mesh(new THREE.CircleGeometry(LEY_RA+1,48),lam('#6e6040'));mud.rotation.x=-Math.PI/2;mud.position.y=0.01;mud.receiveShadow=true;g.add(mud);
  addPlat(R.X,R.Z,140,140,0,R.Y);
  for(let i=0;i<28;i++){const a=i/28*TAU,b=(i+1)/28*TAU;addSeg(R.X+Math.cos(a)*LEY_RA,R.Z+Math.sin(a)*LEY_RA,R.X+Math.cos(b)*LEY_RA,R.Z+Math.sin(b)*LEY_RA,0.3);}
  // charcas, juncos y el plátano de la fuente Amimone (Pausanias)
  const wm=new THREE.MeshPhongMaterial({color:'#3d5a4c',shininess:80,specular:new THREE.Color('#9fb8a8'),transparent:true,opacity:0.85});
  for(const [x,z,r] of [[-8,-3,2.6],[7,-5,2.2],[-4,6,1.6],[9,5,1.8],[0,-14.5,4.5],[-12,-9,2]]){const w=new THREE.Mesh(new THREE.CircleGeometry(r,24),wm);w.rotation.x=-Math.PI/2;w.position.set(x,0.03,z);g.add(w);}
  const reedG=new THREE.ConeGeometry(0.035,1,4),reedM=lam('#7d8a48');const NR=(typeof ACC!=='undefined'&&ACC.lite)?120:320,reeds=new THREE.InstancedMesh(reedG,reedM,NR);const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
  for(let i=0;i<NR;i++){const a=hash(i,3.1)*TAU,rad=i<NR*0.7?LEY_RA+0.5+hash(i,7.7)*9:3+hash(i,5.5)*(LEY_RA-3),x=Math.cos(a)*rad,z=Math.sin(a)*rad;if(Math.hypot(x,z-LEY_HZ)<4.5||Math.hypot(x,z-11)<3)continue;
    const h=0.9+hash(i,2.2)*1.6;e.set((hash(i,1.1)-0.5)*0.3,0,(hash(i,4.4)-0.5)*0.3);q.setFromEuler(e);m4.compose(new THREE.Vector3(x,h/2,z),q,new THREE.Vector3(1,h,1));reeds.setMatrixAt(i,m4);}
  g.add(reeds);
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.7,7,8),lam('#8c8270'));tr.position.set(7,3.5,-15);g.add(tr);
  for(const [x,y,z,s] of [[7,8,-15,3.4],[5.2,7,-14,2.4],[8.8,7.2,-16,2.6],[7,9.6,-15.5,2.2]]){const c=new THREE.Mesh(new THREE.IcosahedronGeometry(s,1),lam('#4f6b34'));c.position.set(x,y,z);c.castShadow=true;g.add(c);}
  // la Hidra: cuerpo de serpiente enroscado y cuellos con cabeza
  const hm=new THREE.MeshPhongMaterial({color:'#2f5a3a',shininess:30,specular:new THREE.Color('#3a5a40')}),bel=lam('#a8a060');
  const body=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),hm);body.scale.set(2.4,1.3,3);body.position.set(0,0.7,LEY_HZ-0.6);body.castShadow=true;body.userData.proc=1;g.add(body);
  for(let i=0;i<14;i++){const a=i/14*TAU*1.6,r=2.6+i*0.12,s=new THREE.Mesh(new THREE.SphereGeometry(0.75-i*0.035,12,8),hm);s.position.set(Math.cos(a)*r,0.45,LEY_HZ-0.6+Math.sin(a)*r*0.9);s.castShadow=true;s.userData.proc=1;g.add(s);}   // la cola enroscada
  addCirc(R.X,R.Z+LEY_HZ-0.6,3.4);LEY.hm=hm;LEY.bel=bel;LEY.body=body;LEY.heads=[];leyHyLoad();leyStormSky();
  // Yolao, a la entrada, con una antorcha (el que quemaba los cuellos)
  const yo=makePerson({chiton:'#9a2a1e',short:true,noHimation:true,hair:'#3a2a1a',beard:false});yo.position.set(R.X-3.2,R.Y,R.Z+11.5);yo.rotation.y=Math.PI*0.85;scene.add(yo);addCirc(R.X-3.2,R.Z+11.5,0.4);INT2.ppl.push(yo);
  int2Info(R,-3.2,11.5,'Yolao','sobrino y auriga de '+leyN('Heracles','Hércules'),'Ι','Yolao, con la antorcha',
    '<p>«Mi tío '+leyN('Heracles','Hércules')+' le cortaba las cabezas con la hoz, pero de cada cuello brotaban dos. Así que yo quemaba los muñones con teas de un bosque cercano, y ya no salían más. La del medio era inmortal: la enterró bajo una roca enorme junto al camino de Lerna a Eleunte.»</p><p>«Luego mojó sus flechas en el veneno de la Hidra. Con esas flechas, años después, mataría al centauro Neso… y la sangre de Neso acabaría matándole a él.»</p><p class="sub">Apolodoro, <i>Biblioteca</i> II 5,2 y II 7,6-7. Euristeo no le contó este trabajo porque le había ayudado Yolao.</p>');
  int2Info(R,7,-12.6,'El plátano','junto a la fuente Amimone','Π','Donde creció la Hidra','<p>En Lerna, junto a la fuente Amimone, crece un plátano bajo el que dicen que se crio la Hidra. Pausanias añade que él cree que tenía una sola cabeza, y que fue el poeta Pisandro de Camiro quien le dio muchas para que pareciera más terrible.</p><p class="sub">Pausanias II 37,4. Hesíodo (<i>Teogonía</i> 313-318) dice que era hija de Tifón y Equidna y que la crio Hera, enfadada con '+leyN('Heracles','Hércules')+'.</p>');
  // salida: el mismo portal dorado, detrás de quien llega
  R.exit={x:R.X,z:R.Z+13.6,a:Math.PI};const eg=grp(R.X,R.Y,R.Z+13.6,Math.PI);const A=int2Aura(eg,1.6,2.6,false);A.m.color.set('#ffd25a');A.sm.color.set('#ffd25a');R.exitA=A;R.exitG=eg;
  egxObj(R.X,R.Z+13.6-0.9,R.Y,()=>int2Leave(),'Salir de la leyenda','',2.2);R.spawn=[0,11,Math.PI];
  return R;}
// una cabeza: cuello de esferas a lo largo de una curva, y la cabeza (hocico, mandíbula, ojos)
const LEY_NG=new THREE.SphereGeometry(1,10,7),LEY_EYE=new THREE.MeshBasicMaterial({color:'#ffd23a'});
function leyAddHead(){const R=INT2.rooms.hidra;if(!R)return;const i=LEY.heads.length,g=R.g;const H={k:i,neck:[],t:2+Math.random()*2,warn:0,ph:Math.random()*TAU,grow:0};
  for(let j=0;j<20;j++){const s=new THREE.Mesh(LEY_NG,LEY.hm);s.castShadow=true;g.add(s);H.neck.push(s);}
  const hd=new THREE.Group();const sk=new THREE.Mesh(LEY_NG,LEY.hm);sk.scale.set(0.38,0.3,0.6);hd.add(sk);
  const jw=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.55,8),LEY.bel);jw.rotation.x=Math.PI/2;jw.position.set(0,-0.14,0.42);jw.scale.set(1,1,0.5);hd.add(jw);
  for(const sx of[-0.2,0.2]){const ey=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),LEY_EYE);ey.position.set(sx,0.12,0.28);hd.add(ey);}
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#7cff5a',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));glow.scale.set(1.6,1.6,1);glow.position.z=0.5;hd.add(glow);
  H.head=hd;H.glow=glow;g.add(hd);LEY.heads.push(H);if(LEY.tpl)leyMdlHead(H);leyFan();return H;}
function leyFan(){const n=LEY.heads.length;LEY.heads.forEach((H,i)=>{H.fan=n<2?0:(i/(n-1)-0.5)*Math.min(2.2,0.45*n);H.len=3.4+((i*7)%3)*0.5;});}
// posición de la cabeza (local) en este instante
function leyHeadPos(H,t){const b=LEY.tpl?new THREE.Vector3(Math.sin(H.fan)*0.42,LEY.tpl.top-0.35,LEY_HZ-0.6+0.12-Math.abs(Math.sin(H.fan))*0.2):new THREE.Vector3(Math.sin(H.fan)*1.3,1.4,LEY_HZ+0.6),sw=Math.sin(t*1.3+H.ph)*0.5,back=H.warn>0?-1.1*Math.sin(Math.min(1,(0.7-H.warn)/0.7)*Math.PI/2):0;
  const L=H.len*Math.min(1,H.grow);const tip=new THREE.Vector3(Math.sin(H.fan)*(1.3+L*0.7)+sw*0.6,b.y+L*0.8+Math.cos(t*1.7+H.ph)*0.3,LEY_HZ+0.6+L*0.55+back);return [b,tip];}
// ---- proyectiles: bolas de veneno con estela
const LEY_SG=new THREE.SphereGeometry(0.28,10,8),LEY_SM=new THREE.MeshBasicMaterial({color:'#8cff4a'});
function leyShoot(H,tipW){const P=player,R=LEY.R;const tgt=new THREE.Vector3(P.x,P.feet+1.0,P.z);const d=tipW.distanceTo(tgt),sp=10+Math.min(5,LEY.heads.length*0.6),tf=d/sp;
  tgt.x+=LEY.pv.x*tf*0.7;tgt.z+=LEY.pv.z*tf*0.7;const v=tgt.clone().sub(tipW).normalize().multiplyScalar(sp);
  const m=new THREE.Mesh(LEY_SG,LEY_SM);m.position.copy(tipW);scene.add(m);const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#6dff3a',transparent:true,opacity:0.7,blending:THREE.AdditiveBlending,depthWrite:false}));gl.scale.set(1.3,1.3,1);m.add(gl);
  LEY.shots.push({m,v,life:4});if(H&&H.mdl)H.mdl.snap=1;try{leySfx('spit');}catch(e){}}
// ---- orbes de Niké
const LEY_OG=new THREE.OctahedronGeometry(0.28,1),LEY_OM=new THREE.MeshBasicMaterial({color:'#ffe08a'});
function leyOrb(){const R=LEY.R;for(let k=0;k<40;k++){const a=Math.random()*TAU,r=3+Math.random()*(LEY_RA-4.5),x=Math.cos(a)*r,z=Math.sin(a)*r;if(LEY.kind==='hidra'&&z<LEY_HZ+5)continue;if(LEY.orbOk&&!LEY.orbOk(x,z))continue;
    if(LEY.orbs.some(o=>Math.hypot(o.x-x,o.z-z)<4))continue;if(Math.hypot(R.X+x-player.x,R.Z+z-player.z)<4)continue;
    const g=new THREE.Group();g.position.set(R.X+x,R.Y+1.1,R.Z+z);const c=new THREE.Mesh(LEY_OG,LEY_OM);g.add(c);
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ffd25a',transparent:true,opacity:0.9,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(1.6,2.0,1);g.add(s);
    for(const sg of[-1,1]){const w=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.22),new THREE.MeshBasicMaterial({color:'#fff4d0',side:THREE.DoubleSide,transparent:true,opacity:0.85}));w.position.set(sg*0.36,0.08,0);w.rotation.z=sg*0.35;g.add(w);}   // las alas de Niké
    scene.add(g);LEY.orbs.push({g,x:R.X+x,z:R.Z+z,c,ph:Math.random()*TAU});return;}}
// ---- sonidos (sintetizados, como el resto del juego)
function leySfx(k){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;
  if(k==='spit'){const s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(1800,t);f.frequency.exponentialRampToValueAtTime(500,t+0.25);s.connect(f).connect(envGain(t,0.09,0.01,0.25));s.start(t,Math.random());s.stop(t+0.3);}
  else if(k==='hit'){const o=c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(70,t+0.35);o.connect(envGain(t,0.12,0.005,0.35));o.start(t);o.stop(t+0.4);}
  else if(k==='orb')sfxCoin();
  else if(k==='grow'&&typeof sfxRoar==='function')sfxRoar(0.7);}
// ---- marcador y destello
function leyHud(){if(!LEY.hud){const d=document.createElement('div');d.id='leyHud';d.style.cssText='position:fixed;top:52px;left:50%;transform:translateX(-50%);z-index:30;pointer-events:none;background:rgba(26,20,14,.82);color:#f3e6c8;border:1px solid #c9a64a;border-radius:8px;padding:5px 14px;font:600 15px/1.3 var(--text,system-ui);display:flex;gap:16px;white-space:nowrap';document.body.appendChild(d);LEY.hud=d;
    const fl=document.createElement('div');fl.style.cssText='position:fixed;inset:0;z-index:29;pointer-events:none;background:radial-gradient(ellipse at center,rgba(120,255,60,0) 40%,rgba(90,200,40,.55));opacity:0;transition:opacity .25s';document.body.appendChild(fl);LEY.fl=fl;}
  LEY.hud.hidden=!LEY.on;if(!LEY.on)return;const hearts='●'.repeat(3-LEY.hits)+'○'.repeat(LEY.hits);
  LEY.hud.innerHTML='<span style="color:#ffd25a">'+leyN('Orbes de Niké','Orbes de Victoria')+' '+LEY.n+'/'+LEY.GOAL+'</span><span title="golpes que aguantas">Vida '+hearts+'</span>'+(LEY.kind==='hidra'?'<span>Cabezas '+LEY.heads.length+'</span>':(LEY.extra||''))+(typeof legShieldHud==='function'?legShieldHud():'');}
// ---- empezar, perder, ganar
function leyReset(){for(const s of LEY.shots)scene.remove(s.m);for(const o of LEY.orbs)scene.remove(o.g);LEY.shots=[];LEY.orbs=[];
  const R=LEY.R;if(R)for(const H of LEY.heads){for(const s of H.neck)R.g.remove(s);R.g.remove(H.head);}LEY.heads=[];LEY.n=0;LEY.hits=0;LEY.inv=0;LEY.won=false;LEY.t=0;LEY.lp=null;
  if(LEY.body){LEY.body.visible=true;LEY.R.g.children.forEach(c=>{if(c.userData.sunk){c.position.y+=c.userData.sunk;c.userData.sunk=0;}});}}
function leyStart(){leyReset();for(let i=0;i<LEY.MAXH;i++)leyAddHead().grow=1;LEY.on=true;LEY.grace=2.5;const z=leyz();z.hidra.tries=(z.hidra.tries||0)+1;save();leyHud();
  const ro=leyRo(),He=leyN('Heracles','Hércules'),Ni=leyN('Niké','Victoria');
  int2Dlg('Ν',Ni,'Una leyenda: la Hidra de Lerna','<p class="sub"><b>Esto no es historia: es un mito</b>, tal como lo contaban '+(ro?'griegos y romanos':'los griegos')+'. Entras en él como en un sueño.</p>'+
   '<p><b>Recoge '+LEY.GOAL+' orbes de '+Ni+'</b> sin que te alcance el veneno de la Hidra.</p>'+
   '<p>Las cabezas <b>se echan atrás y brillan de verde</b> antes de escupir: muévete de lado o salta.</p>'+
   '<p><b>Tres golpes</b> y la leyenda te expulsa. Puedes salir cuando quieras por el portal dorado.</p>'+
   '<p>Cada 4 orbes, a la Hidra <b>le brota otra cabeza</b>.</p>'+
   '<p>«Soy '+Ni+', la Victoria. Acompaño a Atenea'+(ro?' y a Júpiter':' y a Zeus')+' y corono a quien vence. Esta es la ciénaga de Lerna, donde '+He+' hizo su segundo trabajo.»</p>'+
   '<p class="sub">Niké es hija de la oceánide Estigia y del titán Palante (Hesíodo, <i>Teogonía</i> 383-385). En la Acrópolis tiene su templo, el de Atenea Niké (hacia 420 a.C.); en Roma, la Victoria tiene templo en el Palatino desde el 294 a.C. (Livio X 33).</p>');}
function leyLose(){LEY.on=false;leyHud();const z=leyz();z.hidra.best=Math.max(z.hidra.best||0,LEY.n);save();
  toast('<span class="label">La leyenda te expulsa</span><br>El veneno de la Hidra te ha alcanzado tres veces. Has reunido '+LEY.n+' orbes'+(z.hidra.best>LEY.n?' (tu récord: '+z.hidra.best+')':'')+'. Puedes volver a intentarlo cuando quieras.');
  INT2.busy=false;int2Leave();}
function leyWin(){LEY.on=false;LEY.won=true;leyHud();const z=leyz();z.hidra.best=LEY.GOAL;const first=!z.hidra.won;z.hidra.won=(z.hidra.won||0)+1;save();
  for(const s of LEY.shots)scene.remove(s.m);LEY.shots=[];for(const o of LEY.orbs)scene.remove(o.g);LEY.orbs=[];
  LEY.sink=1;try{sfxCoin();setTimeout(sfxCoin,250);}catch(e){}
  // PREMIO: por decidir. De momento queda anotado (state.leyendas.hidra.won) y se ofrece la corona de laurel como título.
  int2Dlg('Ν',leyN('Niké','Victoria'),'¡Victoria!','<p>«Veinte orbes, y ni una gota de veneno de más. La Hidra se hunde en la ciénaga, como en el mito se hundió bajo la roca su cabeza inmortal.»</p><p>'+(first?'Ganas la <b>corona de '+leyN('Niké','Victoria')+'</b>: queda anotada en tu viaje.':'Ya tenías la corona: esta es tu victoria número '+z.hidra.won+'.')+'</p><p class="sub">El premio definitivo está por decidir; de momento, la victoria queda guardada en la partida.</p>');
  try{rwDiscover('La corona de '+leyN('Niké','Victoria'),'has vencido en la leyenda de la Hidra');}catch(e){}}
// ---- cada fotograma
function leyTick(dt){const inH=INT2.in&&LEY_ROOMS.includes(INT2.in.o.room);if(inH){LEY.kind=INT2.in.o.room;LEY.R=INT2.in.R;}
  if(!inH){if(!skyMesh.visible)skyMesh.visible=true;if(LEY.on||LEY.shots.length||LEY.orbs.length){LEY.on=false;leyReset();}if(LEY.hud&&!LEY.hud.hidden)leyHud();LEY.started=false;return;}
  if(LEY.kind!=='hidra'){if(typeof legTick==='function')legTick(dt);return;}   // las otras leyendas (210)
  if(!LEY.started&&!INT2.busy&&ui==='play'){LEY.started=true;player.yaw=0;player.pitch=0.05;leyStart();return;}
  const R=LEY.R,t=(LEY.t+=dt),P=player;
  // la Hidra (también quieta mientras se lee un diálogo, pero sin disparar)
  for(const H of LEY.heads){if(H.grow<1)H.grow=Math.min(1,H.grow+dt*0.8);const [b,tip]=leyHeadPos(H,t),c1=new THREE.Vector3(b.x,tip.y*0.75,b.z+0.2);
    if(H.mdl){leyMdlPose(H,b,c1,tip,t,P,R);continue;}
    for(let j=0;j<H.neck.length;j++){const u=(j+1)/(H.neck.length+1),p=new THREE.Vector3().copy(b).multiplyScalar((1-u)*(1-u)).addScaledVector(c1,2*u*(1-u)).addScaledVector(tip,u*u);H.neck[j].position.copy(p);H.neck[j].scale.setScalar(0.46-u*0.2);}
    H.head.position.copy(tip);H.head.lookAt(P.x-R.X,P.feet+1-R.Y,P.z-R.Z);H.glow.material.opacity=H.warn>0?0.9*(1-H.warn/0.7):0;}
  if(LEY.sink){LEY.sink+=dt;for(const c of R.g.children)if(c!==R.exitG&&(c.userData.hy||c.material===LEY.hm||c.material===LEY.bel||c.type==='Group'&&c.children[0]&&c.children[0].material===LEY.hm)){const d=Math.min(dt*0.8,6-(c.userData.sunk||0));if(d>0){c.position.y-=d;c.userData.sunk=(c.userData.sunk||0)+d;}}if(LEY.sink>9)LEY.sink=0;}
  if(!LEY.on||ui!=='play')return;
  // velocidad del jugador (para apuntar un poco por delante)
  if(LEY.lp&&dt>0){LEY.pv.x=LEY.pv.x*0.8+((P.x-LEY.lp.x)/dt)*0.2;LEY.pv.z=LEY.pv.z*0.8+((P.z-LEY.lp.z)/dt)*0.2;}LEY.lp={x:P.x,z:P.z};
  if(LEY.grace>0)LEY.grace-=dt;LEY.inv=Math.max(0,LEY.inv-dt);
  // disparos: cada cabeza avisa 0,7 s y escupe
  const per=Math.max(1.8,4.2-0.3*LEY.heads.length);
  for(const H of LEY.heads){if(H.grow<1||LEY.grace>0)continue;if(H.warn>0){H.warn-=dt;if(H.warn<=0){H.warn=0;H.t=per*(0.8+Math.random()*0.5);const w=H.mdl?H.mdl.head.localToWorld(new THREE.Vector3(0,-0.03,0.9)):H.head.getWorldPosition(new THREE.Vector3());leyShoot(H,w);}continue;}
    H.t-=dt;if(H.t<=0)H.warn=0.7;}
  const lo=new THREE.Vector3(P.x,P.feet+0.25,P.z),hi=new THREE.Vector3(P.x,P.feet+1.65,P.z),_c=new THREE.Vector3(),seg=new THREE.Line3(lo,hi);
  for(let i=LEY.shots.length-1;i>=0;i--){const s=LEY.shots[i];s.life-=dt;s.v.y-=1.5*dt;s.m.position.addScaledVector(s.v,dt);const p=s.m.position;
    seg.closestPointToPoint(p,true,_c);let hit=_c.distanceTo(p)<0.5&&LEY.inv<=0;if(hit&&typeof legBlock==='function'&&legBlock(s)){hit=false;s.life=0;}
    if(hit||s.life<=0||p.y<R.Y+0.05||Math.hypot(p.x-R.X,p.z-R.Z)>LEY_RA+6){scene.remove(s.m);LEY.shots.splice(i,1);
      if(hit){LEY.hits++;LEY.inv=1.2;leySfx('hit');if(LEY.fl){LEY.fl.style.opacity=1;setTimeout(()=>LEY.fl&&(LEY.fl.style.opacity=0),280);}leyHud();if(LEY.hits>=3){leyLose();return;}}}}
  // orbes: siempre dos a la vista; se cogen pasando por encima
  while(LEY.orbs.length<2)leyOrb();
  for(let i=LEY.orbs.length-1;i>=0;i--){const o=LEY.orbs[i];o.g.position.y=R.Y+1.1+Math.sin(t*2.4+o.ph)*0.18;o.c.rotation.y+=dt*2;
    if(Math.hypot(o.x-P.x,o.z-P.z)<1.3&&Math.abs(P.feet-R.Y)<2.2){scene.remove(o.g);LEY.orbs.splice(i,1);LEY.n++;leySfx('orb');leyHud();
      if(LEY.n>=LEY.GOAL){leyWin();return;}
      if(LEY.n%4===0&&LEY.heads.length<9){leyAddHead();leySfx('grow');toast('<span class="label">La Hidra se enfurece</span><br>Le brota otra cabeza: ya tiene '+LEY.heads.length+'.');}}}}
{const f=uxTick;uxTick=function(dt){f(dt);try{leyTick(Math.min(0.1,dt||0));}catch(e){if(!LEY.err){LEY.err=String(e&&e.stack||e).slice(0,300);console.warn('leyendas',e);}}};}
INT2_ZN.hidra=['La ciénaga de Lerna','ΛΕΡΝΗ','Leyenda · Apolodoro, Biblioteca II 5,2'];

// ---- la Hidra de Blender (herramientas/blender/hidra.py → modelos/hidra.glb → datos/glbhy.txt, en segundo plano)
// Mientras no llega, se ve la de esferas. Cada cuello es una copia del cuello recto (de y = 0 a y = 1) que se dobla en cada fotograma
// sobre la curva del cuello: cada anillo va a su punto de la curva, con un marco que no gira (transporte paralelo); así las escamas
// siguen al cuello. La cabeza se pone en la punta y mira al jugador; la mandíbula se abre al avisar y al escupir.
function leyHyLoad(){if(LEY.loading||typeof bpBytes!=='function'||!THREE.GLTFLoader)return;LEY.loading=1;
  bpBytes('glbhy').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const S=gl.scene;S.updateMatrixWorld(true);
    const get=n=>S.getObjectByName(n),neck=get('HY_cuello'),head=get('HY_cabeza'),body=get('HY_cuerpo'),top=get('HY_cima');if(!neck||!head||!body)return;
    const ng=neck.geometry;LEY.tpl={neck:ng,nmat:neck.material,P0:ng.attributes.position.array.slice(),N0:ng.attributes.normal.array.slice(),head,body,top:top?top.position.y:2.1};
    const cache=new Map();S.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;const m=o.material;if(!m)return;
      // al material del juego (Phong, como las rocas): color, relieve y brillo de piel húmeda
      if(!cache.has(m)){const eye=/ojo/.test(m.name),pm=new THREE.MeshPhongMaterial({map:m.map||null,normalMap:m.normalMap||null,color:m.map?new THREE.Color(1.55,1.55,1.5):m.color.clone(),shininess:eye?90:28,specular:new THREE.Color(eye?'#ffffff':'#3a3a2c'),
        emissive:eye?new THREE.Color('#ffffff'):new THREE.Color('#000000'),emissiveMap:eye?m.map:null,emissiveIntensity:eye?0.35:0,side:/lengua/.test(m.name)?THREE.DoubleSide:THREE.FrontSide});if(m.map){m.map.anisotropy=4;m.map.encoding=THREE.LinearEncoding;}cache.set(m,pm);}
      o.material=cache.get(m);});
    if(INT2.rooms.hidra)leyMdlBody();},e=>console.warn('hidra',e));}).catch(e=>console.warn('hidra',e));}
function leyMdlBody(){const R=INT2.rooms.hidra,T=LEY.tpl;if(!R||!T||LEY.mbody)return;const b=T.body.clone();b.position.set(0,0,LEY_HZ-0.6);b.userData.hy=1;R.g.add(b);LEY.mbody=b;
  for(const c of R.g.children)if(c.userData.proc)c.visible=false;for(const H of LEY.heads)if(!H.mdl)leyMdlHead(H);}
function leyMdlHead(H){const R=INT2.rooms.hidra,T=LEY.tpl;if(!R||!T)return;if(!LEY.mbody)leyMdlBody();
  const g=T.neck.clone();g.attributes.position=g.attributes.position.clone();g.attributes.normal=g.attributes.normal.clone();
  const nk=new THREE.Mesh(g,T.nmat);nk.castShadow=true;nk.frustumCulled=false;nk.userData.hy=1;R.g.add(nk);
  const hd=T.head.clone(true);hd.position.set(0,0,0);hd.rotation.set(0,0,0);hd.userData.hy=1;R.g.add(hd);const jaw=hd.getObjectByName('HY_mandibula');
  H.glow.parent&&H.glow.parent.remove(H.glow);H.glow.position.set(0,-0.06,0.62);H.glow.scale.set(0.42,0.42,1);H.glow.material.depthTest=true;hd.add(H.glow);
  let eye=null;hd.traverse(o=>{if(o.isMesh&&o.material&&o.material.emissiveMap){if(!eye)eye=o.material.clone();o.material=eye;}});   // los ojos se encienden de verde al avisar (cada cabeza, los suyos)
  for(const s of H.neck)s.visible=false;H.head.visible=false;H.mdl={nk,head:hd,jaw,eye,jaw0:jaw?jaw.rotation.x:0};}
const _lyB=new THREE.Vector3(),_lyT=new THREE.Vector3(),_lyL=new THREE.Vector3(),_lyS=new THREE.Vector3(),_lyQ=new THREE.Vector3();
function leyMdlPose(H,b,c1,tip,t,P,R){const M=H.mdl,T=LEY.tpl,pos=M.nk.geometry.attributes.position,nor=M.nk.geometry.attributes.normal,P0=T.P0,N0=T.N0,NR=44;
  const bz=(s,o)=>o.copy(b).multiplyScalar((1-s)*(1-s)).addScaledVector(c1,2*s*(1-s)).addScaledVector(tip,s*s);
  const dz=(s,o)=>o.copy(c1).sub(b).multiplyScalar(2*(1-s)).addScaledVector(_lyQ.copy(tip).sub(c1),2*s).normalize();
  // marcos de los anillos
  const F=M.F||(M.F=Array.from({length:NR},()=>({p:new THREE.Vector3(),t:new THREE.Vector3(),l:new THREE.Vector3(),s:new THREE.Vector3()})));
  _lyL.set(0,0.3,1).normalize();   // en la base, el lomo mira hacia delante: al doblarse hacia quien llega, queda arriba (el vientre, abajo)
  for(let i=0;i<NR;i++){const f=F[i],s=i/(NR-1);bz(s,f.p);dz(s,f.t);_lyL.addScaledVector(f.t,-_lyL.dot(f.t)).normalize();f.l.copy(_lyL);f.s.copy(f.t).cross(f.l);}
  const pa=pos.array,na=nor.array;
  for(let v=0;v<pa.length;v+=3){const f=F[Math.max(0,Math.min(NR-1,Math.round(P0[v+1]*(NR-1))))],x=P0[v],z=P0[v+2];
    pa[v]=f.p.x+f.s.x*x+f.l.x*z;pa[v+1]=f.p.y+f.s.y*x+f.l.y*z;pa[v+2]=f.p.z+f.s.z*x+f.l.z*z;
    const nx=N0[v],ny=N0[v+1],nz=N0[v+2];na[v]=f.s.x*nx+f.t.x*ny+f.l.x*nz;na[v+1]=f.s.y*nx+f.t.y*ny+f.l.y*nz;na[v+2]=f.s.z*nx+f.t.z*ny+f.l.z*nz;}
  pos.needsUpdate=true;nor.needsUpdate=true;M.nk.geometry.computeBoundingSphere();
  // la cabeza: en la punta (con la nuca metida en el cuello) y mirando al jugador
  const fe=F[NR-1];M.head.position.copy(fe.p).addScaledVector(fe.t,-0.12);M.head.lookAt(P.x-R.X,P.feet+1-R.Y,P.z-R.Z);
  if(M.jaw){const open=H.warn>0?0.15+0.45*(1-H.warn/0.7):Math.max(0,(M.snap||0))*0.6+0.04+0.03*Math.sin(t*2.3+H.ph);M.jaw.rotation.x=M.jaw0+open;}
  if(M.snap>0)M.snap-=0.05;
  const w=H.warn>0?1-H.warn/0.7:0;H.glow.material.opacity=0.75*w;
  if(M.eye){M.eye.emissive.setRGB(1-0.6*w,1,1-0.7*w);M.eye.emissiveIntensity=0.35+1.4*w;}}

// ---- el cielo de pesadilla: nubes de tormenta de noche (Poly Haven, CC0; retocadas en herramientas/blender/cielo_tormenta.py), luz
// apagada y fría, niebla gris y relámpagos de vez en cuando (con su trueno). Solo dentro de la leyenda.
function leyStormSky(){if(LEY.skyLoading||typeof bpBytes!=='function')return;LEY.skyLoading=1;
  bpBytes('imgtm').then(buf=>{if(!buf)return;const url=URL.createObjectURL(new Blob([buf],{type:'image/jpeg'})),im=new Image();
    im.onload=()=>{const tx=new THREE.Texture(im);tx.needsUpdate=true;const m=new THREE.MeshBasicMaterial({map:tx,side:THREE.BackSide,fog:false});
      const sp=new THREE.Mesh(new THREE.SphereGeometry(900,48,24),m);sp.frustumCulled=false;LEY.sky=sp;if(LEY.R)LEY.R.g.add(sp);};im.src=url;}).catch(e=>console.warn('cielo',e));}
function leyStormLight(dt){const inH=INT2.in&&LEY_ROOMS.includes(INT2.in.o.room);if(!inH)return;if(!LEY.sky&&!LEY.skyLoading)leyStormSky();
  if(LEY.sky&&INT2.in.R&&LEY.sky.parent!==INT2.in.R.g)INT2.in.R.g.add(LEY.sky);
  LEY.flT=(LEY.flT===undefined?6:LEY.flT)-(dt||0);if(LEY.flT<=0){LEY.flT=7+Math.random()*10;LEY.flash=1;setTimeout(()=>{try{if(typeof sfxThunder==='function'&&INT2.in)sfxThunder();}catch(e){}},600+Math.random()*1400);}
  const f=LEY.flash>0?Math.max(0,LEY.flash)*(0.6+0.4*Math.sin(LEY.flash*40)):0;if(LEY.flash>0)LEY.flash-=(dt||0)*3.2;
  sun.intensity=0.5+1.2*f;sun.color.set('#b9c3d6');hemi.intensity=0.5+1.1*f;hemi.color.set('#8c97aa');hemi.groundColor.set('#3a3529');
  scene.fog.color.set('#4b4d53');STARS.material.opacity=0;if(LEY.sky)skyMesh.visible=false;if(LEY.sky)LEY.sky.material.color.setScalar(1+1.6*f);}
{const f=updateSky;updateSky=function(){const r=f.apply(this,arguments);try{leyStormLight(0);}catch(e){}return r;};}
{const f=uxTick;uxTick=function(dt){f(dt);try{leyStormLight(Math.min(0.1,dt||0));}catch(e){}};}
