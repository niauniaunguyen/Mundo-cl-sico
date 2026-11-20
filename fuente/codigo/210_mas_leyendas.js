// ============================================================ MÁS LEYENDAS, ESCUDO Y CRÓTALOS (portal de las leyendas, 208)
// El portal dorado lleva ahora a elegir una leyenda. En ninguna se hiere a nadie: se esquiva, se protege uno con el escudo y se
// recogen los orbes de Niké (Victoria). Al entrar se avisa de qué cuenta el mito y de que aquí no se mata a la criatura.
//  · La Hidra de Lerna (208).
//  · Las aves del Estínfalo (Arcadia): sueltan plumas de bronce desde el cielo (la sombra roja avisa dónde caen). Con los crótalos de
//    bronce que Atenea dio a Heracles (hechos por Hefesto), el ruido las espanta un rato. Apolodoro II 5,6; Pausanias VIII 22,4;
//    las plumas como dardos, en Apolonio de Rodas, Argonáuticas II 1030-1089.
//  · El león de Nemea: ninguna arma atravesaba su piel. Acecha, se agazapa (aviso) y embiste en línea recta: hay que apartarse a tiempo.
//    Apolodoro II 5,1; Hesíodo, Teogonía 326-332.
//  · Caco en el Aventino (leyenda romana): el hijo de Vulcano escupe fuego y humo desde su cueva; el fuego deja el suelo ardiendo un
//    momento. Virgilio, Eneida VIII 190-267; Livio I 7,4-7; Ovidio, Fastos I 543-578.
// Escudo (todas): mantener Q o el botón derecho del ratón (en el móvil, el botón «Escudo»). Para lo que llega de frente (y lo que cae
// desde arriba) mientras le quede aguante; se cansa al sostenerlo y al parar golpes, y se recupera bajándolo.
const LEG={},LEG_ORDER=['hidra','aves','leon','caco'];
const LEY_SH={up:false,st:1,tired:false,key:false,mouse:false,btn:false,crT:0,el:null};
function legIn(){return !!(INT2.in&&LEY_ROOMS.includes(INT2.in.o.room));}
function legZ(k){const z=leyz();if(!z[k])z[k]={best:0,won:0,tries:0};return z[k];}
// ---- elegir leyenda al cruzar el portal
{const f=int2Enter;int2Enter=function(o){if(o&&o.id==='ley'&&!o._go){legChoose(o);return;}if(o)o._go=false;return f.apply(this,arguments);};}
function legChoose(o){if(ui!=='play')return;const P=player;P.x=o.x+Math.sin(o.a)*1.7;P.z=o.z+Math.cos(o.a)*1.7;
  const ro=leyRo(),Ni=leyN('Niké','Victoria');
  int2Dlg('Ν',Ni,'El portal de las leyendas','<p>«Elige la leyenda en la que quieres entrar. En todas te pido lo mismo: <b>reúne '+LEY.GOAL+' de mis orbes</b> sin que te alcancen tres veces. Nadie sale herido: ni tú, ni la criatura.»</p><p class="sub">Escudo: mantén <b>Q</b> o el botón derecho del ratón. En el Estínfalo, los crótalos con <b>R</b>.</p>');
  const box=$('dOpts');box.innerHTML='';let n=0;
  for(const k of LEG_ORDER){const L=LEG[k];if(!L)continue;const z=legZ(k),b=document.createElement('button');n++;
    b.innerHTML='<span class="n">'+n+'</span><span>'+L.title()+(z.won?' · <b>vencida</b>':z.best?' · récord '+z.best:'')+'</span>';
    b.onclick=()=>{closeDialog();o.room=k;o._go=true;int2Enter(o);};box.appendChild(b);}
  const c=document.createElement('button');c.innerHTML='<span class="n">'+(n+1)+'</span><span>Ahora no</span>';c.onclick=closeDialog;box.appendChild(c);}
LEG.hidra={title:()=>'La Hidra de Lerna'};
// ---- el escenario común: suelo, borde, salida dorada, cielo de tormenta (208)
function legArena(room,col,col2){const R=int2Base(room);R.g=grp(R.X,R.Y,R.Z,0);INT2.rooms[room]=R;const g=R.g;
  const fl=new THREE.Mesh(new THREE.CircleGeometry(70,48),lam(col2||'#5a5440'));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;g.add(fl);
  const in1=new THREE.Mesh(new THREE.CircleGeometry(LEY_RA+1,48),lam(col));in1.rotation.x=-Math.PI/2;in1.position.y=0.01;in1.receiveShadow=true;g.add(in1);
  addPlat(R.X,R.Z,140,140,0,R.Y);
  for(let i=0;i<28;i++){const a=i/28*TAU,b=(i+1)/28*TAU;addSeg(R.X+Math.cos(a)*LEY_RA,R.Z+Math.sin(a)*LEY_RA,R.X+Math.cos(b)*LEY_RA,R.Z+Math.sin(b)*LEY_RA,0.3);}
  R.exit={x:R.X,z:R.Z+13.6,a:Math.PI};const eg=grp(R.X,R.Y,R.Z+13.6,Math.PI);const A=int2Aura(eg,1.6,2.6,false);A.m.color.set('#ffd25a');A.sm.color.set('#ffd25a');R.exitA=A;R.exitG=eg;
  egxObj(R.X,R.Z+13.6-0.9,R.Y,()=>int2Leave(),'Salir de la leyenda','',2.2);R.spawn=[0,11,Math.PI];return R;}
function legRocks(R,n,r0,r1,col,seed){const m=lam(col||'#8d8476'),g=R.g,rr=mulberry32(seed||7);
  for(let i=0;i<n;i++){const a=rr()*TAU,r=r0+rr()*(r1-r0),s=1.5+rr()*4;const k=new THREE.Mesh(new THREE.DodecahedronGeometry(s,1),m);k.position.set(Math.cos(a)*r,s*0.35,Math.sin(a)*r);k.rotation.set(rr()*3,rr()*3,rr()*3);k.scale.y=0.6+rr()*0.8;k.castShadow=k.receiveShadow=true;g.add(k);}}
{const f=int2Room;int2Room=function(room){if(INT2.rooms[room]||!LEG[room]||!LEG[room].build)return f.apply(this,arguments);return LEG[room].build();};}
// ---- proyectiles comunes
const LEG_FEATHER=new THREE.ConeGeometry(0.05,0.75,5),LEG_BRONZE=new THREE.MeshPhongMaterial({color:'#b08a4a',shininess:70,specular:new THREE.Color('#ffe2a0')});
const LEG_FIRE=new THREE.SphereGeometry(0.34,10,8),LEG_FIREM=new THREE.MeshBasicMaterial({color:'#ffb040'});
function legShot(mesh,pos,vel,o){mesh.position.copy(pos);scene.add(mesh);const s=Object.assign({m:mesh,v:vel,life:5,g:1.5,r:0.5},o||{});LEY.shots.push(s);return s;}
// ---- el escudo
function legBlock(s){const S=LEY_SH;if(!S.up||S.st<=0)return false;const v=s.v.clone().normalize(),f=new THREE.Vector3(-Math.sin(player.yaw),0,-Math.cos(player.yaw));
  const front=f.dot(new THREE.Vector3(-v.x,0,-v.z).normalize())>0.25,above=v.y<-0.75;if(!front&&!above)return false;
  S.st=Math.max(0,S.st-(s.cost||0.18));legSfx('clang');if(S.st<=0){S.tired=true;toast('<span class="label">Escudo</span><br>Tienes el brazo cansado: bájalo un momento para recuperar el aguante.');}return true;}
function legShieldTick(dt){const S=LEY_SH,want=(S.key||S.mouse||S.btn)&&!S.tired&&legIn()&&LEY.on;S.up=want&&S.st>0;
  if(S.up)S.st=Math.max(0,S.st-0.22*dt);else S.st=Math.min(1,S.st+0.2*dt);if(S.tired&&S.st>0.35)S.tired=false;if(S.st<=0&&S.up){S.up=false;S.tired=true;}
  if(!S.el){const d=document.createElement('div');d.style.cssText='position:fixed;left:30%;bottom:-70px;width:280px;height:280px;margin-left:-140px;z-index:28;pointer-events:none;transition:transform .15s,opacity .15s;opacity:0;transform:translateY(120px)';
    // un hoplon (escudo redondo griego) con borde de bronce, visto desde detrás del brazo
    d.innerHTML='<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><radialGradient id="lsg" cx="45%" cy="40%"><stop offset="0" stop-color="#d9b56a"/><stop offset=".7" stop-color="#9a7434"/><stop offset="1" stop-color="#5c4118"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="#3b2a16"/><circle cx="50" cy="50" r="44" fill="url(#lsg)"/><circle cx="50" cy="50" r="36" fill="none" stroke="#e6c886" stroke-width="1.2" opacity=".6"/><circle cx="50" cy="50" r="8" fill="#b89048" stroke="#6a4a1c" stroke-width="1"/></svg>';
    document.body.appendChild(d);S.el=d;}
  S.el.style.opacity=S.up?0.92:0;S.el.style.transform=S.up?'translateY(0)':'translateY(120px)';}
function legShieldHud(){const S=LEY_SH,w=Math.round(S.st*100);return '<span title="aguante del escudo (Q)">Escudo <span style="display:inline-block;width:52px;height:8px;border:1px solid #c9a64a;border-radius:4px;vertical-align:middle;background:linear-gradient(90deg,'+(S.tired?'#a05030':'#e6c886')+' '+w+'%,transparent '+w+'%)"></span></span>'+
  (LEY.kind==='aves'?'<span>Crótalos '+(S.crT>0?Math.ceil(S.crT)+' s':'listos (R)')+'</span>':'');}
window.addEventListener('keydown',e=>{if(!legIn()||ui!=='play')return;if(e.code==='KeyQ'){LEY_SH.key=true;e.stopImmediatePropagation();e.preventDefault();}
  else if(e.code==='KeyR'&&!e.repeat&&LEY.kind==='aves'){legCrotalos();e.stopImmediatePropagation();e.preventDefault();}},true);
window.addEventListener('keyup',e=>{if(e.code==='KeyQ'&&LEY_SH.key){LEY_SH.key=false;if(legIn())e.stopImmediatePropagation();}},true);
window.addEventListener('mousedown',e=>{if(e.button===2&&legIn()){LEY_SH.mouse=true;e.preventDefault();}},true);
window.addEventListener('mouseup',e=>{if(e.button===2)LEY_SH.mouse=false;},true);
window.addEventListener('contextmenu',e=>{if(legIn())e.preventDefault();},true);
function legTouchBtns(){if(LEY.tb||typeof isTouch==='undefined'||!isTouch)return;const mk=(t,css)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='position:fixed;z-index:31;right:18px;width:86px;height:86px;border-radius:50%;border:2px solid #c9a64a;background:rgba(40,30,18,.75);color:#f3e6c8;font:600 14px var(--text,system-ui);'+css;document.body.appendChild(b);return b;};
  const a=mk('Escudo','bottom:190px'),c=mk('Crótalos','bottom:290px');a.addEventListener('touchstart',e=>{LEY_SH.btn=true;e.preventDefault();});a.addEventListener('touchend',()=>LEY_SH.btn=false);c.addEventListener('touchstart',e=>{legCrotalos();e.preventDefault();});LEY.tb=[a,c];}
// ---- sonidos
function legSfx(k){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;
  if(k==='clang'){[880,1320,1980].forEach((f,i)=>{const o=c.createOscillator();o.type='triangle';o.frequency.value=f*(0.98+Math.random()*0.04);o.connect(envGain(t,0.06/(i+1),0.002,0.5));o.start(t);o.stop(t+0.55);});}
  else if(k==='crot'){for(let i=0;i<9;i++){const o=c.createOscillator();o.type='square';o.frequency.value=1500+Math.random()*900;o.connect(envGain(t+i*0.07,0.035,0.002,0.05));o.start(t+i*0.07);o.stop(t+i*0.07+0.08);}}
  else if(k==='fire'){const s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(900,t);f.frequency.exponentialRampToValueAtTime(220,t+0.7);s.connect(f).connect(envGain(t,0.14,0.03,0.7));s.start(t,Math.random());s.stop(t+0.8);}
  else if(k==='screech'){const o=c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(1900,t);o.frequency.exponentialRampToValueAtTime(900,t+0.3);o.connect(envGain(t,0.05,0.01,0.3));o.start(t);o.stop(t+0.35);}
  else leySfx(k);}
function legHurt(msg){LEY.hits++;LEY.inv=1.2;leySfx('hit');if(LEY.fl){LEY.fl.style.opacity=1;setTimeout(()=>LEY.fl&&(LEY.fl.style.opacity=0),280);}leyHud();if(LEY.hits>=3)legLose();}
// ---- empezar, perder, ganar (las tres leyendas nuevas; la Hidra sigue con lo suyo en 208)
function legStart(){const L=LEG[LEY.kind];leyReset();LEY.orbOk=L.orbOk||null;L.reset(LEY.R);LEY.on=true;LEY.grace=2.5;LEY_SH.st=1;LEY_SH.tired=false;LEY_SH.crT=0;const z=legZ(LEY.kind);z.tries++;save();legTouchBtns();leyHud();
  const ro=leyRo(),Ni=leyN('Niké','Victoria');
  int2Dlg('Ν',Ni,'Una leyenda: '+L.title(),'<p class="sub"><b>Esto no es historia: es un mito</b>, tal como lo contaban '+(ro?'griegos y romanos':'los griegos')+'. Entras en él como en un sueño, y aquí nadie hace daño a nadie.</p>'+
   '<p><b>Recoge '+LEY.GOAL+' orbes de '+Ni+'</b>. '+L.rule+'</p><p><b>Escudo:</b> mantén Q o el botón derecho. Para lo que llega de frente, pero se cansa.'+(LEY.kind==='aves'?' <b>Crótalos:</b> R espanta a las aves un rato.':'')+'</p><p><b>Tres golpes</b> y la leyenda te expulsa.</p>'+L.myth);}
function legLose(){LEY.on=false;leyHud();const L=LEG[LEY.kind],z=legZ(LEY.kind);z.best=Math.max(z.best||0,LEY.n);save();
  toast('<span class="label">La leyenda te expulsa</span><br>'+L.lose+' Has reunido '+LEY.n+' orbes'+(z.best>LEY.n?' (tu récord: '+z.best+')':'')+'.');INT2.busy=false;int2Leave();}
function legWin(){LEY.on=false;LEY.won=true;leyHud();const L=LEG[LEY.kind],z=legZ(LEY.kind);z.best=LEY.GOAL;const first=!z.won;z.won++;save();
  for(const s of LEY.shots)scene.remove(s.m);LEY.shots=[];for(const o of LEY.orbs)scene.remove(o.g);LEY.orbs=[];try{sfxCoin();setTimeout(sfxCoin,250);}catch(e){}if(L.end)L.end();
  int2Dlg('Ν',leyN('Niké','Victoria'),'¡Victoria!','<p>'+L.win+'</p><p>'+(first?'Ganas la <b>corona de '+leyN('Niké','Victoria')+'</b> de esta leyenda: queda anotada en tu viaje.':'Ya la habías vencido: esta es tu victoria número '+z.won+'.')+'</p>');
  try{rwDiscover('La corona de '+leyN('Niké','Victoria')+': '+L.title(),'has vencido sin herir a nadie');}catch(e){}}
// ---- cada fotograma
function legTick(dt){const L=LEG[LEY.kind],R=LEY.R,P=player;if(!L||!R)return;
  if(!LEY.started&&!INT2.busy&&ui==='play'){LEY.started=true;player.yaw=0;player.pitch=0.05;legStart();return;}
  const t=(LEY.t+=dt);legShieldTick(dt);if(LEY_SH.crT>0)LEY_SH.crT=Math.max(0,LEY_SH.crT-dt);
  L.tick(dt,t,LEY.on&&ui==='play'&&LEY.grace<=0);
  if(!LEY.on||ui!=='play')return;
  if(LEY.lp&&dt>0){LEY.pv.x=LEY.pv.x*0.8+((P.x-LEY.lp.x)/dt)*0.2;LEY.pv.z=LEY.pv.z*0.8+((P.z-LEY.lp.z)/dt)*0.2;}LEY.lp={x:P.x,z:P.z};
  if(LEY.grace>0)LEY.grace-=dt;LEY.inv=Math.max(0,LEY.inv-dt);
  const lo=new THREE.Vector3(P.x,P.feet+0.25,P.z),hi=new THREE.Vector3(P.x,P.feet+1.65,P.z),_c=new THREE.Vector3(),seg=new THREE.Line3(lo,hi);
  for(let i=LEY.shots.length-1;i>=0;i--){const s=LEY.shots[i];s.life-=dt;s.v.y-=s.g*dt;s.m.position.addScaledVector(s.v,dt);const p=s.m.position;if(s.orient)s.m.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),s.v.clone().normalize());
    seg.closestPointToPoint(p,true,_c);let hit=_c.distanceTo(p)<s.r&&LEY.inv<=0;if(hit&&legBlock(s)){hit=false;s.life=0;}
    const ground=p.y<R.Y+0.05;if(hit||s.life<=0||ground||Math.hypot(p.x-R.X,p.z-R.Z)>LEY_RA+8){scene.remove(s.m);LEY.shots.splice(i,1);if(ground&&s.onGround)s.onGround(p);if(hit){legHurt();if(!LEY.on)return;}}}
  if(L.hitTest&&LEY.inv<=0&&L.hitTest(P)){legHurt();if(!LEY.on)return;}
  while(LEY.orbs.length<2)leyOrb();
  for(let i=LEY.orbs.length-1;i>=0;i--){const o=LEY.orbs[i];o.g.position.y=R.Y+1.1+Math.sin(t*2.4+o.ph)*0.18;o.c.rotation.y+=dt*2;
    if(Math.hypot(o.x-P.x,o.z-P.z)<1.3&&Math.abs(P.feet-R.Y)<2.2){scene.remove(o.g);LEY.orbs.splice(i,1);LEY.n++;leySfx('orb');if(typeof legNetOrb==='function')legNetOrb();leyHud();
      if(LEY.n>=LEY.GOAL){legWin();return;}if(L.onOrb)L.onOrb(LEY.n);}}}
// el escudo también en la Hidra (208 no lo actualiza)
{const f=leyTick;leyTick=function(dt){f(dt);try{if(legIn()&&LEY.kind==='hidra'){LEY.orbOk=null;legShieldTick(dt);legTouchBtns();if(LEY.on)leyHud();}else if(!legIn()){LEY_SH.up=false;if(LEY_SH.el)LEY_SH.el.style.opacity=0;if(LEY.tb)LEY.tb.forEach(b=>b.hidden=true);}if(legIn()&&LEY.tb)LEY.tb.forEach((b,i)=>b.hidden=i===1&&LEY.kind!=='aves');}catch(e){}};}

// ============ LAS AVES DEL ESTÍNFALO
LEG.aves={title:()=>'Las aves del Estínfalo',rule:'Las aves sueltan <b>plumas de bronce</b>: una sombra roja en el suelo avisa dónde van a caer. Cada 3 orbes llegan más aves.',
  lose:'Las plumas de bronce te han alcanzado tres veces.',win:'«Veinte orbes bajo una lluvia de bronce. El ruido de los crótalos aún resuena en el lago: las aves se van volando y no vuelven a Arcadia.»',
  myth:'<p class="sub">En el mito, el lago Estínfalo (Arcadia) estaba lleno de aves que se refugiaban en el bosque. Atenea dio a Heracles unos crótalos de bronce hechos por Hefesto; con su ruido las espantó y salieron volando (Apolodoro II 5,6). Pausanias (VIII 22,4) vio aves así en el templo de Ártemis Estinfalia; Apolonio de Rodas cuenta que soltaban sus plumas como dardos (Argonáuticas II 1030-1089). En el mito Heracles las abatió con flechas; aquí solo se las espanta.</p>',
  build(){const R=legArena('aves','#5e6645','#4b5a3a');const g=R.g;
    const lake=new THREE.Mesh(new THREE.CircleGeometry(40,40,Math.PI*0.15,Math.PI*0.7),new THREE.MeshPhongMaterial({color:'#3a5560',shininess:90,specular:new THREE.Color('#99aabb')}));lake.rotation.x=-Math.PI/2;lake.rotation.z=Math.PI;lake.position.set(0,0.04,-14);g.add(lake);
    const reedM=lam('#8a8a50');for(let i=0;i<160;i++){const a=Math.random()*TAU,r=LEY_RA+0.5+Math.random()*8,h=1+Math.random()*1.8,c=new THREE.Mesh(new THREE.ConeGeometry(0.04,h,4),reedM);c.position.set(Math.cos(a)*r,h/2,Math.sin(a)*r);g.add(c);}
    for(let i=0;i<22;i++){const a=Math.random()*TAU,r=LEY_RA+6+Math.random()*14;const t=new THREE.Mesh(new THREE.ConeGeometry(1.6+Math.random(),6+Math.random()*4,7),lam('#3e5232'));t.position.set(Math.cos(a)*r,4,Math.sin(a)*r);g.add(t);}   // el bosque donde se escondían
    INT2_ZN.aves=['El lago Estínfalo','ΣΤΥΜΦΑΛΟΣ','Leyenda · Apolodoro, Biblioteca II 5,6'];return R;},
  reset(R){const A=this;if(A.birds)for(const b of A.birds)R.g.remove(b.g);A.birds=[];A.t=2.5;A.flee=0;A.marks=A.marks||[];for(const m of A.marks)R.g.remove(m.m);A.marks=[];for(let i=0;i<6;i++)A.add(R);LEY.extra='<span>Aves '+A.birds.length+'</span>';},
  add(R){const g=new THREE.Group(),dark=new THREE.MeshPhongMaterial({color:'#3a3026',shininess:30});
    const body=new THREE.Mesh(new THREE.SphereGeometry(0.3,10,8),dark);body.scale.set(0.8,0.7,1.8);g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(0.17,8,6),dark);head.position.set(0,0.12,0.55);g.add(head);
    const beak=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.45,6),LEG_BRONZE);beak.rotation.x=Math.PI/2;beak.position.set(0,0.1,0.85);g.add(beak);
    const wings=[];for(const sg of[-1,1]){const p=new THREE.Group();p.position.set(sg*0.18,0.08,0);const w=new THREE.Mesh(new THREE.PlaneGeometry(1.3,0.5),new THREE.MeshPhongMaterial({color:'#6a5432',side:THREE.DoubleSide,shininess:50,specular:new THREE.Color('#c8a060')}));w.rotation.x=-Math.PI/2;w.position.x=sg*0.65;p.add(w);g.add(p);wings.push(p);}
    const tail=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.5),wings[0].children[0].material);tail.rotation.x=-Math.PI/2;tail.position.z=-0.7;g.add(tail);
    R.g.add(g);this.birds.push({g,wings,a:Math.random()*TAU,r:6+Math.random()*6,h:7+Math.random()*3,sp:(0.25+Math.random()*0.2)*(Math.random()<0.5?1:-1),ph:Math.random()*TAU});},
  tick(dt,t,act){const R=LEY.R,A=this,P=player;if(!A.birds)return;if(A.flee>0)A.flee-=dt;
    for(const b of A.birds){b.a+=b.sp*dt;const h=A.flee>0?Math.min(26,b.g.position.y+dt*8):b.h+Math.sin(t*0.7+b.ph)*0.8,x=Math.cos(b.a)*b.r,z=Math.sin(b.a)*b.r;
      b.g.position.set(x,A.flee>0?h:b.g.position.y+(h-b.g.position.y)*Math.min(1,dt*2),z);b.g.rotation.y=Math.atan2(-Math.sin(b.a)*Math.sign(b.sp),Math.cos(b.a)*Math.sign(b.sp))+Math.PI/2*0;
      const tx=-Math.sin(b.a)*b.sp,tz=Math.cos(b.a)*b.sp;b.g.rotation.y=Math.atan2(tx,tz);const fl=Math.sin(t*(A.flee>0?18:9)+b.ph)*0.6;b.wings[0].rotation.z=fl;b.wings[1].rotation.z=-fl;}
    for(let i=A.marks.length-1;i>=0;i--){const m=A.marks[i];m.t-=dt;m.m.material.opacity=0.25+0.5*(1-m.t/1.1);if(m.t<=0){R.g.remove(m.m);A.marks.splice(i,1);}}
    if(!act||A.flee>0)return;A.t-=dt;if(A.t>0)return;A.t=Math.max(1.0,2.8-0.12*A.birds.length)*(0.7+Math.random()*0.6);
    // una ave suelta tres plumas hacia donde vas a estar; la sombra avisa 1,1 s antes
    const b=A.birds[Math.floor(Math.random()*A.birds.length)],tx=P.x-R.X+LEY.pv.x*1.0,tz=P.z-R.Z+LEY.pv.z*1.0;legSfx('screech');
    const mk=new THREE.Mesh(new THREE.RingGeometry(0.2,1.5,24),new THREE.MeshBasicMaterial({color:'#c0402a',transparent:true,opacity:0.3,depthWrite:false}));mk.rotation.x=-Math.PI/2;mk.position.set(tx,0.06,tz);R.g.add(mk);A.marks.push({m:mk,t:1.1});
    for(let k=0;k<3;k++){const ex=tx+(Math.random()-0.5)*1.6,ez=tz+(Math.random()-0.5)*1.6,from=new THREE.Vector3(R.X+b.g.position.x,R.Y+b.g.position.y,R.Z+b.g.position.z),to=new THREE.Vector3(R.X+ex,R.Y,R.Z+ez),T=1.1;
      const v=to.clone().sub(from).divideScalar(T);v.y+=0.5*2*T;legShot(new THREE.Mesh(LEG_FEATHER,LEG_BRONZE),from,v,{g:2,r:0.42,orient:true,life:3});}},
  onOrb(n){if(n%3===0&&this.birds.length<14){this.add(LEY.R);LEY.extra='<span>Aves '+this.birds.length+'</span>';legSfx('screech');}},
  end(){this.flee=99;}};
function legCrotalos(){if(LEY.kind!=='aves'||!LEY.on||LEY_SH.crT>0)return;LEY_SH.crT=10;LEG.aves.flee=4.5;legSfx('crot');setTimeout(()=>legSfx('crot'),300);
  toast('<span class="label">Crótalos</span><br>¡Clac, clac! El ruido de bronce espanta a las aves.');}

// ============ EL LEÓN DE NEMEA
LEG.leon={title:()=>'El león de Nemea',rule:'El león acecha a tu alrededor; cuando <b>se agazapa y ruge</b>, va a embestir en línea recta: apártate de lado. Cada 4 orbes embiste más a menudo.',
  lose:'El león te ha derribado tres veces.',win:'«Veinte orbes, y el león, cansado de embestir al aire, se tumba a la entrada de su cueva. Hoy nadie ha tenido que vencerlo.»',
  myth:'<p class="sub">En el mito, el león de Nemea, hijo de Tifón (o criado por Hera, según Hesíodo, Teogonía 326-332), tenía una piel que ninguna arma atravesaba. Heracles lo encerró en su cueva de dos bocas y lo venció con las manos; luego se vistió con su piel (Apolodoro II 5,1). Aquí basta con esquivarlo.</p>',
  build(){const R=legArena('leon','#a08a5c','#8a7650');legRocks(R,26,LEY_RA+3,LEY_RA+16,'#9b8a6c',11);
    const cave=new THREE.Mesh(new THREE.CircleGeometry(2.6,20,0,Math.PI),new THREE.MeshBasicMaterial({color:'#120d09'}));cave.position.set(0,0,-LEY_RA-2);cave.scale.y=1.3;R.g.add(cave);
    for(const sg of[-1,1]){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(4.5,1),lam('#8f7d60'));r.position.set(sg*4.6,2.2,-LEY_RA-3);r.castShadow=true;R.g.add(r);}
    INT2_ZN.leon=['Nemea','ΝΕΜΕΑ','Leyenda · Apolodoro, Biblioteca II 5,1'];return R;},
  mk(R){const g=new THREE.Group(),fur=new THREE.MeshLambertMaterial({color:'#b98d52'}),mane=new THREE.MeshLambertMaterial({color:'#6a4524'});
    const body=new THREE.Mesh(new THREE.SphereGeometry(0.5,14,10),fur);body.scale.set(0.95,0.95,2.0);body.position.y=1.0;g.add(body);
    const mn=new THREE.Mesh(new THREE.SphereGeometry(0.62,14,10),mane);mn.position.set(0,1.25,0.85);mn.scale.set(1,1.05,0.8);g.add(mn);
    const hd=new THREE.Mesh(new THREE.SphereGeometry(0.33,12,9),fur);hd.position.set(0,1.3,1.25);hd.scale.set(1,0.95,1.1);g.add(hd);
    const mz=new THREE.Mesh(new THREE.SphereGeometry(0.18,10,8),new THREE.MeshLambertMaterial({color:'#d8b080'}));mz.position.set(0,1.18,1.52);mz.scale.set(1,0.8,1);g.add(mz);
    const nose=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),lam('#2a1c14'));nose.position.set(0,1.25,1.68);g.add(nose);
    for(const sx of[-0.12,0.12]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.035,6,5),new THREE.MeshBasicMaterial({color:'#e8b030'}));e.position.set(sx,1.38,1.5);g.add(e);}
    const legs=[];for(const [x,z] of [[-0.3,0.65],[0.3,0.65],[-0.3,-0.7],[0.3,-0.7]]){const p=new THREE.Group();p.position.set(x,0.95,z);const l=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.09,0.95,8),fur);l.position.y=-0.47;p.add(l);const paw=new THREE.Mesh(new THREE.SphereGeometry(0.12,8,6),fur);paw.position.y=-0.92;paw.scale.set(1,0.6,1.3);p.add(paw);g.add(p);legs.push(p);}
    const tail=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.05,1.1,6),fur);tail.position.set(0,1.05,-1.45);tail.rotation.x=-1.0;g.add(tail);const tuft=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,5),mane);tuft.position.set(0,1.5,-1.9);g.add(tuft);
    g.traverse(o=>{if(o.isMesh)o.castShadow=true;});R.g.add(g);return {g,legs,body};},
  reset(R){const A=this;if(!A.lion)A.lion=A.mk(R);A.lion.g.visible=true;A.lion.g.position.set(0,0,-8);A.lion.g.rotation.set(0,0,0);A.st='acecha';A.t=3;A.ang=-Math.PI/2;A.waitK=1;A.rested=false;LEY.extra='<span>León: acecha</span>';},
  tick(dt,t,act){const A=this,L=A.lion,R=LEY.R,P=player;if(!L)return;const px=P.x-R.X,pz=P.z-R.Z,lp=L.g.position;
    if(A.rested){L.g.rotation.z=0;L.body.position.y=0.75;return;}
    let speed=0;
    if(A.st==='acecha'){A.ang+=dt*0.35;const tx=px+Math.cos(A.ang)*8,tz=pz+Math.sin(A.ang)*8,dx=tx-lp.x,dz=tz-lp.z,d=Math.hypot(dx,dz);if(d>0.1){const s=Math.min(d,dt*3.2);lp.x+=dx/d*s;lp.z+=dz/d*s;speed=3.2;}
      const r=Math.hypot(lp.x,lp.z);if(r>LEY_RA-1.5){lp.x*=(LEY_RA-1.5)/r;lp.z*=(LEY_RA-1.5)/r;}
      L.g.rotation.y=Math.atan2(px-lp.x,pz-lp.z);L.body.position.y=1.0;if(act){A.t-=dt;if(A.t<=0){A.st='agazapa';A.t=0.9;LEY.extra='<span style="color:#ff9a5a">León: ¡va a embestir!</span>';leyHud();if(typeof sfxRoar==='function')sfxRoar(1);}}}
    else if(A.st==='agazapa'){A.t-=dt;L.body.position.y=0.78;L.g.rotation.y=Math.atan2(px-lp.x,pz-lp.z);if(A.t<=0){const dx=px+LEY.pv.x*0.3-lp.x,dz=pz+LEY.pv.z*0.3-lp.z,d=Math.hypot(dx,dz)||1;A.dir={x:dx/d,z:dz/d};A.st='embiste';A.t=Math.min(1.5,(d+5)/17);}}
    else if(A.st==='embiste'){A.t-=dt;lp.x+=A.dir.x*17*dt;lp.z+=A.dir.z*17*dt;speed=17;L.g.rotation.y=Math.atan2(A.dir.x,A.dir.z);const r=Math.hypot(lp.x,lp.z);if(r>LEY_RA-1){lp.x*=(LEY_RA-1)/r;lp.z*=(LEY_RA-1)/r;A.t=0;}
      if(A.t<=0){A.st='jadea';A.t=1.3;LEY.extra='<span>León: jadea</span>';leyHud();}}
    else if(A.st==='jadea'){A.t-=dt;L.body.position.y=0.95+Math.sin(t*12)*0.03;if(A.t<=0){A.st='acecha';A.t=(2.2+Math.random()*2.2)*A.waitK;LEY.extra='<span>León: acecha</span>';leyHud();}}
    const ph=t*(speed>5?16:7);L.legs.forEach((l,i)=>{l.rotation.x=speed>0.5?Math.sin(ph+(i%2?Math.PI:0)+(i>1?Math.PI/2:0))*(speed>5?0.9:0.45):0;});},
  hitTest(P){const A=this;if(A.st!=='embiste')return false;const R=LEY.R,L=A.lion.g.position,hx=R.X+L.x+Math.sin(A.lion.g.rotation.y)*1.3,hz=R.Z+L.z+Math.cos(A.lion.g.rotation.y)*1.3;
    if(Math.hypot(hx-P.x,hz-P.z)>1.25||Math.abs(P.feet-R.Y)>1.6)return false;
    // con el escudo alzado y de cara al león, el golpe se para (te empuja), pero cansa mucho el brazo
    const S=LEY_SH;if(S.up&&S.st>0){const f=-Math.sin(player.yaw)*A.dir.x+-Math.cos(player.yaw)*A.dir.z;if(f<-0.3){S.st=Math.max(0,S.st-0.55);legSfx('clang');player.x+=A.dir.x*2;player.z+=A.dir.z*2;A.st='jadea';A.t=1.5;LEY.inv=0.8;if(S.st<=0)S.tired=true;return false;}}
    A.st='jadea';A.t=1.5;return true;},
  onOrb(n){if(n%4===0)this.waitK=Math.max(0.45,this.waitK-0.15);},
  end(){this.rested=true;LEY.extra='<span>León: descansa</span>';}};

// ============ CACO EN EL AVENTINO (leyenda romana)
LEG.caco={title:()=>'Caco en el Aventino',rule:'Caco escupe <b>bolas de fuego</b> que caen en arco y dejan el suelo ardiendo un momento: no te quedes en las llamas. A veces llena la cueva de humo.',
  lose:'El fuego de Caco te ha alcanzado tres veces.',win:'«Veinte orbes entre el humo y las llamas. Caco se queda sin fuego y las vacas que robó salen solas de la cueva, como volvieron a Hércules en la leyenda.»',
  myth:'<p class="sub">En la leyenda romana, Caco, hijo de Vulcano, vivía en una cueva del Aventino y escupía fuego y humo. Robó parte de los bueyes de Hércules y los metió en su cueva arrastrándolos de la cola, de espaldas, para que las huellas engañaran; pero los mugidos lo delataron (Livio I 7,4-7; Virgilio, Eneida VIII 190-267; Ovidio, Fastos I 543-578). Junto a ese lugar estaba el Ara Máxima de Hércules, en el Foro Boario. En la leyenda Hércules lo mató; aquí solo hay que esquivar su fuego.</p>',
  build(){const R=legArena('caco','#5a4c40','#3e342c');legRocks(R,34,LEY_RA+1.5,LEY_RA+9,'#5e5248',23);
    const ledge=new THREE.Mesh(new THREE.CylinderGeometry(3.4,4.2,2.6,10),lam('#6a5a4c'));ledge.position.set(0,1.3,-12.5);ledge.castShadow=ledge.receiveShadow=true;R.g.add(ledge);addCirc(R.X,R.Z-12.5,4.2);
    INT2_ZN.caco=['La cueva de Caco','CACVS','Leyenda · Virgilio, Eneida VIII'];return R;},
  reset(R){const A=this;if(!A.giant){const p=makePerson({chiton:'#2a1d16',short:true,noHimation:true,hair:'#1a1210',beard:true});p.scale.setScalar(2.3);p.position.set(0,2.6,-12.5);R.g.add(p);A.giant=p;
      A.glow=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ff7a2a',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));A.glow.scale.set(2.4,2.4,1);A.glow.position.set(0,2.6+3.7,-12.0);R.g.add(A.glow);}
    if(A.fires)for(const f of A.fires)R.g.remove(f.m);A.fires=[];if(A.smoke)for(const s of A.smoke)R.g.remove(s.m);A.smoke=[];A.t=2.5;A.st=6;A.warn=0;A.per=2.6;
    if(!A.cows){A.cows=[];}for(const c of A.cows)R.g.remove(c);A.cows=[];LEY.extra='';},
  tick(dt,t,act){const A=this,R=LEY.R,P=player;if(!A.giant)return;A.giant.rotation.y=Math.atan2(P.x-R.X,P.z-R.Z-(-12.5));
    for(let i=A.fires.length-1;i>=0;i--){const f=A.fires[i];f.t-=dt;f.m.material.opacity=Math.min(0.9,f.t)*0.9;f.m.scale.setScalar(1+Math.sin(t*20+i)*0.08);if(f.t<=0){R.g.remove(f.m);A.fires.splice(i,1);}}
    for(let i=A.smoke.length-1;i>=0;i--){const s=A.smoke[i];s.t-=dt;s.m.position.x+=s.vx*dt;s.m.position.z+=s.vz*dt;s.m.material.opacity=Math.min(0.55,s.t*0.12);if(s.t<=0){R.g.remove(s.m);A.smoke.splice(i,1);}}
    A.glow.material.opacity=A.warn>0?0.9*(1-A.warn/0.8):0.15;
    if(!act)return;
    if(A.warn>0){A.warn-=dt;if(A.warn<=0){legSfx('fire');const from=new THREE.Vector3(R.X,R.Y+6.3,R.Z-12.0),to=new THREE.Vector3(P.x+LEY.pv.x*1.1,R.Y,P.z+LEY.pv.z*1.1),T=1.3,v=to.clone().sub(from).divideScalar(T);v.y+=0.5*9*T;
        const m=new THREE.Mesh(LEG_FIRE,LEG_FIREM),gl=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ff8a30',transparent:true,opacity:0.85,blending:THREE.AdditiveBlending,depthWrite:false}));gl.scale.set(1.6,1.6,1);m.add(gl);
        legShot(m,from,v,{g:9,r:0.55,life:3,cost:0.25,onGround:p=>{const fm=new THREE.Mesh(new THREE.CircleGeometry(1.3,18),new THREE.MeshBasicMaterial({color:'#ff6a20',transparent:true,opacity:0.9,blending:THREE.AdditiveBlending,depthWrite:false}));fm.rotation.x=-Math.PI/2;fm.position.set(p.x-R.X,0.07,p.z-R.Z);R.g.add(fm);A.fires.push({m:fm,t:3});}});}}
    else{A.t-=dt;if(A.t<=0){A.warn=0.8;A.t=A.per*(0.7+Math.random()*0.6);}}
    A.st-=dt;if(A.st<=0){A.st=9+Math.random()*5;for(let k=0;k<7;k++){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#3a3632',transparent:true,opacity:0.5,depthWrite:false}));m.scale.set(9,6,1);m.position.set((Math.random()-0.5)*6,2+Math.random()*2,-9+Math.random()*4);R.g.add(m);A.smoke.push({m,t:9,vx:(Math.random()-0.5)*1.5,vz:1.2+Math.random()*1.4});}}},
  orbOk:(x,z)=>z>-8.5,
  hitTest(P){const R=LEY.R;if(Math.abs(P.feet-R.Y)>0.6)return false;for(const f of this.fires)if(f.t>0.4&&Math.hypot(R.X+f.m.position.x-P.x,R.Z+f.m.position.z-P.z)<1.1)return true;return false;},
  onOrb(n){if(n%4===0)this.per=Math.max(1.3,this.per-0.3);},
  end(){const R=LEY.R;   // las vacas: siluetas que salen de la cueva
    const cm=lam('#7a5a3a');for(let i=0;i<4;i++){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,1.6),cm);b.position.y=0.9;g.add(b);const h=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.4,0.5),cm);h.position.set(0,1.2,0.95);g.add(h);
      for(const [x,z] of [[-0.25,0.6],[0.25,0.6],[-0.25,-0.6],[0.25,-0.6]]){const l=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.6,0.14),cm);l.position.set(x,0.3,z);g.add(l);}
      g.position.set(-4+i*2.6,0,-9+i*0.5);R.g.add(g);this.cows.push(g);}}};
