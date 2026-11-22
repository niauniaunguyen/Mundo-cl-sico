// ============================================================ DIOMEDES EN EL PORTAL DE LAS LEYENDAS (210)
// Atenas · «La hazaña de Diomedes» (Ilíada V-VI). Diomedes, hijo de Tideo, protegido de Atenea, en la llanura de Troya:
//  - Atenea le hace salir del casco y del escudo un fuego «como el astro de otoño» (V 4-7): cuando va a lanzar, el fuego se aviva.
//  - Lanza una piedra «que hoy no levantarían dos hombres» (V 302-304): cae en arco donde vas a estar; la sombra roja avisa.
//  - Arroja la lanza en línea recta: una raya roja en el suelo marca la dirección. El escudo para las dos cosas (la piedra cansa mucho).
//  - La mirada de Atenea (R): la diosa le quitó la niebla de los ojos para distinguir a dioses y hombres (V 127-128). Aquí te la presta
//    a ti un momento: algunos orbes de Niké están velados por la niebla y solo se ven (y se cogen) con esa mirada.
//  - Al reunir los 20 orbes no se vence a nadie: se repite la escena de Glauco y Diomedes (VI 119-236). Descubrís que vuestros abuelos
//    fueron huéspedes, clava la lanza en la tierra y cambiáis las armas. Te llevas su armadura de bronce (trofeo).
//  En el mito, Diomedes hiere a Afrodita y a Ares (V 330-351 y 855-863): aquí no se hiere a nadie.
//  Época: en el 386 a.C. Homero se aprendía en la escuela (Platón, Protágoras 325e-326a; en el Banquete de Jenofonte III 5, Nicérato
//  dice que su padre le hizo aprender de memoria la Ilíada y la Odisea).
// Roma · «Diomedes en Argiripa» (Virgilio, Eneida XI 225-295; VIII 9-17). Diomedes, ya viejo, reina en Apulia, en la ciudad que fundó
//  (Argiripa, la Arpi de los romanos). Los latinos le mandan a Vénulo para pedirle ayuda contra Eneas. Lo acompañas: escuchas, respondes
//  y decides qué contarás al rey Latino. No hay orbes ni golpes: es una leyenda para escuchar. Las aves que vuelan sobre el palacio son
//  sus compañeros, convertidos en aves por Venus (Eneida XI 271-274; Ovidio, Metamorfosis XIV 483-511; Plinio X 126-127 las sitúa en
//  las islas Diomedeas, hoy Tremiti).
LEY_ROOMS.push('diomedes','argiripa');LEG_ORDER.push('diomedes','argiripa');
// en cada modo, solo su leyenda
{const f=legChoose;legChoose=function(o){const ro=leyRo(),keep=k=>!(ro&&k==='diomedes')&&!(!ro&&k==='argiripa'),all=LEG_ORDER.slice();LEG_ORDER.length=0;all.filter(keep).forEach(k=>LEG_ORDER.push(k));
  try{return f.apply(this,arguments);}finally{LEG_ORDER.length=0;all.forEach(k=>LEG_ORDER.push(k));}};}
const DMD={see:0,cd:0,warned:false,tb:null,ov:null};
function dioStoneGeo(){if(!DMD.sg){DMD.sg=new THREE.DodecahedronGeometry(0.55,1);DMD.sm=lam('#8e8574');}return [DMD.sg,DMD.sm];}
function dioMark(R,x,z,t){const m=new THREE.Mesh(new THREE.RingGeometry(0.3,1.8,24),new THREE.MeshBasicMaterial({color:'#c0402a',transparent:true,opacity:0.35,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,0.06,z);R.g.add(m);LEG.diomedes.marks.push({m,t,T:t});}
function dioLine(R,x0,z0,x1,z1,t){const L=Math.hypot(x1-x0,z1-z0)+6,m=new THREE.Mesh(new THREE.PlaneGeometry(0.35,L),new THREE.MeshBasicMaterial({color:'#d04030',transparent:true,opacity:0.4,depthWrite:false}));
  m.rotation.x=-Math.PI/2;m.rotation.z=-Math.atan2(x1-x0,z1-z0);const ux=(x1-x0)/(L-6||1),uz=(z1-z0)/(L-6||1);m.position.set(x0+ux*L/2,0.07,z0+uz*L/2);R.g.add(m);LEG.diomedes.marks.push({m,t,T:t});}
function dioGaze(){const A=LEG.diomedes;if(LEY.kind!=='diomedes'||!LEY.on||DMD.cd>0)return;DMD.see=5;DMD.cd=14;legSfx('crot');
  if(!DMD.ov){const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:27;pointer-events:none;background:radial-gradient(ellipse at center,rgba(255,220,140,0) 45%,rgba(230,190,90,.4));opacity:0;transition:opacity .4s';document.body.appendChild(d);DMD.ov=d;}
  toast('<span class="label">La mirada de Atenea</span><br>La niebla se aparta de tus ojos: ves lo que estaba velado.');A.hud();}
window.addEventListener('keydown',e=>{if(!legIn()||ui!=='play'||LEY.kind!=='diomedes')return;if(e.code==='KeyR'&&!e.repeat){dioGaze();e.stopImmediatePropagation();e.preventDefault();}},true);
LEG.diomedes={title:()=>'La hazaña de Diomedes',
  rule:'Diomedes lanza <b>piedras</b> que caen en arco (la sombra roja avisa) y <b>lanzas</b> en línea recta (una raya roja marca por dónde). Cuando el fuego de su casco se aviva, va a lanzar. Algunos orbes están <b>velados por la niebla</b>: pulsa <b>R</b> para la mirada de Atenea y verlos.',
  lose:'Las piedras y las lanzas de Diomedes te han alcanzado tres veces.',
  win:'Diomedes deja de lanzar y te mira con curiosidad: «¿Quién eres tú, que aguantas así? Si fueras un dios no me atrevería contigo.» Le cuentas quiénes eran tus abuelos y de dónde vienes, y sonríe: «Entonces eres mi huésped desde antiguo: mi abuelo Eneo recibió al tuyo en su casa veinte días, y se hicieron regalos. Hay muchos otros con los que medirse; tú y yo, no.»</p>'+
   '<p>Clava la lanza en la tierra, os dais la mano y cambiáis las armas: él te da su armadura de bronce. Así lo cuenta la Ilíada (VI 212-236) de Diomedes y Glauco, que luchaban en bandos contrarios. Homero añade, con humor, que Glauco salió perdiendo: dio armas de oro por armas de bronce, cien bueyes por nueve.',
  myth:'<p class="sub">En la Ilíada, Atenea da a Diomedes una fuerza y un valor enormes y le hace salir fuego del casco y del escudo (V 1-8); le quita la niebla de los ojos para que distinga a los dioses (V 127-128). Ese día levanta una piedra que hoy no moverían dos hombres (V 302-304) y llega a herir a Afrodita y a Ares. Aquí nadie sale herido: esquiva, para con el escudo y reúne los orbes. Lo que viene al final es la escena más famosa de la amistad entre huéspedes (canto VI).</p>',
  build(){const R=legArena('diomedes','#b09a6a','#a08c60');legRocks(R,14,LEY_RA+4,LEY_RA+18,'#9a8c70',31);const g=R.g;
    const riv=new THREE.Mesh(new THREE.PlaneGeometry(16,140),new THREE.MeshPhongMaterial({color:'#4f7480',shininess:80}));riv.rotation.x=-Math.PI/2;riv.rotation.z=0.4;riv.position.set(-34,0.03,0);g.add(riv);   // el Escamandro
    const wall=new THREE.Mesh(new THREE.BoxGeometry(70,7,3),lam('#b8a888'));wall.position.set(10,3.5,-58);g.add(wall);for(let i=0;i<5;i++){const t=new THREE.Mesh(new THREE.BoxGeometry(6,11,6),lam('#ac9c7c'));t.position.set(-18+i*14,5.5,-58);g.add(t);}   // Troya, a lo lejos
    for(let i=0;i<9;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(1.2,2.2,9),lam('#5a3e26'));s.position.set(20+i*5,0.6,46+(i%2)*3);s.rotation.y=0.2;g.add(s);}   // las naves varadas de los aqueos
    INT2_ZN.diomedes=['La llanura de Troya','ΤΡΟΙΑ','Leyenda · Ilíada V-VI'];return R;},
  hud(){LEY.extra='<span>Mirada de Atenea '+(DMD.see>0?'<b style="color:#ffe08a">activa</b>':DMD.cd>0?Math.ceil(DMD.cd)+' s':'lista (R)')+'</span>';leyHud();},
  reset(R){const A=this;if(!A.hero){const p=makePerson({chiton:'#7a2e22',himation:'#7a2e22',spear:true,beard:true,hair:'#3a2616',beardC:'#3a2616'});p.position.set(0,0,-8);R.g.add(p);A.hero=p;
      const f=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ffb050',transparent:true,opacity:0.5,blending:THREE.AdditiveBlending,depthWrite:false}));f.scale.set(1.4,1.4,1);f.position.set(0,2.05,0);p.add(f);A.fire=f;
      const f2=f.clone();f2.material=f.material.clone();f2.scale.set(1.8,1.8,1);f2.position.set(-0.35,1.2,0.25);p.add(f2);A.fire2=f2;}
    if(!A.conv){A.conv=1;try{const n=bpConv(A.hero,true);if(n){A.hero=n;n.add(A.fire);n.add(A.fire2);}}catch(e){}}
    A.hero.position.set(0,0,-8);A.ang=-Math.PI/2;A.st='mira';A.t=3;A.per=2.8;A.done=false;A.marks=A.marks||[];for(const m of A.marks)R.g.remove(m.m);A.marks=[];if(A.planted){R.g.remove(A.planted);A.planted=null;}
    DMD.see=0;DMD.cd=0;A.hud();},
  tick(dt,t,act){const A=this,R=LEY.R,P=player,H=A.hero;if(!H)return;const px=P.x-R.X,pz=P.z-R.Z,hp=H.position;
    for(let i=A.marks.length-1;i>=0;i--){const m=A.marks[i];m.t-=dt;m.m.material.opacity=0.2+0.45*(1-m.t/m.T);if(m.t<=0){R.g.remove(m.m);A.marks.splice(i,1);}}
    H.rotation.y=Math.atan2(px-hp.x,pz-hp.z);const warn=A.st==='piedra'||A.st==='lanza';A.fire.material.opacity=warn?0.75+0.25*Math.sin(t*20):0.35+0.1*Math.sin(t*3);A.fire2.material.opacity=A.fire.material.opacity*0.8;
    if(A.stone)A.stone.position.set(hp.x,2.6,hp.z);
    if(DMD.cd>0){DMD.cd=Math.max(0,DMD.cd-dt);}if(DMD.see>0){DMD.see=Math.max(0,DMD.see-dt);}if(DMD.ov)DMD.ov.style.opacity=DMD.see>0&&legIn()?1:0;
    if(LEY.on){A.hT=(A.hT||0)-dt;if(A.hT<=0){A.hT=0.5;A.hud();}
      let hid=0;for(const o of LEY.orbs){if(!o._d){o._d=1;if(LEY.n>=2&&!LEY.orbs.some(q=>q.hid)&&Math.random()<0.5){o.hid=1;o.hx=o.x;o.x+=1e5;o.g.visible=false;if(!DMD.warned){DMD.warned=true;toast('<span class="label">Un orbe velado</span><br>La niebla esconde uno de los orbes de Niké. Pulsa R: la mirada de Atenea.');}}}
        if(o.hid){hid++;if(DMD.see>0){o.hid=0;o.x=o.hx;o.g.visible=true;}else{o.g.visible=false;}}}}
    if(A.done||!act)return;
    if(A.st==='mira'){A.ang+=dt*0.25;const tx=Math.cos(A.ang)*9,tz=Math.sin(A.ang)*9,dx=tx-hp.x,dz=tz-hp.z,d=Math.hypot(dx,dz);if(d>0.2){const s=Math.min(d,dt*2.2);hp.x+=dx/d*s;hp.z+=dz/d*s;}
      A.t-=dt;if(A.t<=0){if(Math.random()<0.45){A.st='piedra';A.t=1.1;const[g,m]=dioStoneGeo();A.stone=new THREE.Mesh(g,m);R.g.add(A.stone);A.tx=px+LEY.pv.x*1.1;A.tz=pz+LEY.pv.z*1.1;dioMark(R,A.tx,A.tz,1.1+1.3);}
        else{A.st='lanza';A.t=0.85;A.tx=px+LEY.pv.x*0.5;A.tz=pz+LEY.pv.z*0.5;dioLine(R,hp.x,hp.z,A.tx,A.tz,0.85+0.9);}}}
    else if(A.st==='piedra'){A.t-=dt;if(A.t<=0){R.g.remove(A.stone);A.stone=null;const[g,m]=dioStoneGeo(),from=new THREE.Vector3(R.X+hp.x,R.Y+2.6,R.Z+hp.z),to=new THREE.Vector3(R.X+A.tx,R.Y,R.Z+A.tz),T=1.3,v=to.clone().sub(from).divideScalar(T);v.y+=0.5*9*T;
        legShot(new THREE.Mesh(g,m),from,v,{g:9,r:0.75,life:3,cost:0.45});A.st='mira';A.t=A.per*(0.7+Math.random()*0.6);}}
    else if(A.st==='lanza'){A.t-=dt;if(A.t<=0){const from=new THREE.Vector3(R.X+hp.x,R.Y+1.45,R.Z+hp.z),dir=new THREE.Vector3(A.tx-hp.x,0,A.tz-hp.z).normalize(),sp=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,2.2,5),LEG_BRONZE);
        legShot(sp,from,dir.multiplyScalar(21),{g:0,r:0.45,life:2,cost:0.2,orient:true});A.st='mira';A.t=A.per*(0.7+Math.random()*0.6);}}},
  onOrb(n){if(n%4===0)this.per=Math.max(1.2,this.per-0.3);},
  end(){const A=this,R=LEY.R;A.done=true;if(A.stone){R.g.remove(A.stone);A.stone=null;}DMD.see=0;
    const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,2.4,5),LEG_BRONZE);sp.position.set(A.hero.position.x+0.8,1.0,A.hero.position.z);sp.rotation.z=0.12;R.g.add(sp);A.planted=sp;   // «clavó la lanza en la tierra» (VI 213)
    try{x4Trofeo('armadura_diomedes','La armadura de Diomedes','Cambiada como huéspedes, igual que Glauco y Diomedes (Ilíada VI)');}catch(e){}
    try{qAdd('eu',1,'Has preferido la amistad entre huéspedes a la pelea.');}catch(e){}}};
// el botón táctil de la mirada de Atenea
{const f=legTouchBtns;legTouchBtns=function(){f.apply(this,arguments);if(DMD.tb||typeof isTouch==='undefined'||!isTouch)return;const b=document.createElement('button');b.textContent='Mirada';
  b.style.cssText='position:fixed;z-index:31;right:18px;bottom:290px;width:86px;height:86px;border-radius:50%;border:2px solid #c9a64a;background:rgba(40,30,18,.75);color:#f3e6c8;font:600 14px var(--text,system-ui)';b.hidden=true;
  b.addEventListener('touchstart',e=>{dioGaze();e.preventDefault();});document.body.appendChild(b);DMD.tb=b;};}
{const f=leyTick;leyTick=function(dt){f(dt);try{if(DMD.tb)DMD.tb.hidden=!(legIn()&&LEY.kind==='diomedes'&&LEY.on);if(DMD.ov&&!legIn())DMD.ov.style.opacity=0;}catch(e){}};}

// ============ ROMA: DIOMEDES EN ARGIRIPA (una leyenda para escuchar)
LEG.argiripa={title:()=>'Diomedes en Argiripa',
  build(){const R=legArena('argiripa','#c2b28c','#9a8c64');const g=R.g;
    const sea=new THREE.Mesh(new THREE.CircleGeometry(60,40,Math.PI*1.15,Math.PI*0.7),new THREE.MeshPhongMaterial({color:'#4a7c90',shininess:90}));sea.rotation.x=-Math.PI/2;sea.position.set(0,0.03,8);g.add(sea);   // el Adriático
    const st=new THREE.Mesh(new THREE.BoxGeometry(16,0.9,9),lam('#d8ccb0'));st.position.set(0,0.45,-10);st.receiveShadow=true;g.add(st);addPlat(R.X,R.Z-10,16,9,0,R.Y+0.9);
    const roof=new THREE.Mesh(new THREE.BoxGeometry(17,0.8,10),lam('#c8b894'));roof.position.set(0,6.6,-10);g.add(roof);
    for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.45,5.4,14),lam('#efe6d2'));c.position.set(-7+i*2.8,3.6,-6);c.castShadow=true;g.add(c);}
    const th=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.1,1.1),lam('#7a5a3a'));th.position.set(0,1.45,-12.2);g.add(th);const tb=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.6,0.2),lam('#7a5a3a'));tb.position.set(0,2.2,-12.8);g.add(tb);
    const p=makePerson({chiton:'#e8e0cc',himation:'#6a2a2a',beard:true,hair:'#d8d4cc',beardC:'#e2ded6',staff:true});p.position.set(0,0.9,-11.6);g.add(p);this.hero=p;
    this.birds=[];const wm=new THREE.MeshLambertMaterial({color:'#f2f0ea',side:THREE.DoubleSide});for(let i=0;i<7;i++){const b=new THREE.Group(),bd=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,6),wm);bd.scale.set(0.8,0.7,1.8);b.add(bd);const w=[];
      for(const sg of[-1,1]){const q=new THREE.Group();q.position.x=sg*0.12;const m=new THREE.Mesh(new THREE.PlaneGeometry(1.1,0.32),wm);m.rotation.x=-Math.PI/2;m.position.x=sg*0.55;q.add(m);b.add(q);w.push(q);}g.add(b);this.birds.push({g:b,w,a:Math.random()*TAU,r:7+Math.random()*9,h:9+Math.random()*5,sp:0.2+Math.random()*0.2,ph:Math.random()*9});}
    egxObj(R.X,R.Z-9.6,R.Y+0.9,()=>argStory(),'Diomedes','habla con el viejo rey · E',2.4);
    INT2_ZN.argiripa=['Argiripa, en Apulia','ARGYRIPA','Leyenda · Virgilio, Eneida XI 225-295'];return R;},
  reset(){},
  tick(dt,t){if(!this.birds)return;for(const b of this.birds){b.a+=b.sp*dt;b.g.position.set(Math.cos(b.a)*b.r,b.h+Math.sin(t*0.6+b.ph)*0.6,Math.sin(b.a)*b.r);b.g.rotation.y=Math.atan2(-Math.sin(b.a),Math.cos(b.a));const f=Math.sin(t*5+b.ph)*0.45;b.w[0].rotation.z=f;b.w[1].rotation.z=-f;}
    if(Math.random()<dt/6&&aOK()){const c=AUD.ctx,tt=c.currentTime,o=c.createOscillator();o.type='triangle';o.frequency.setValueAtTime(1200,tt);o.frequency.exponentialRampToValueAtTime(700,tt+0.5);o.connect(envGain(tt,0.025,0.02,0.5));o.start(tt);o.stop(tt+0.6);}}};
{const f=legStart;legStart=function(){if(LEY.kind!=='argiripa')return f.apply(this,arguments);leyReset();LEY.on=false;const z=legZ('argiripa');z.tries++;save();if(LEY.hud)LEY.hud.hidden=true;
  int2Dlg('V','Victoria','Una leyenda: Diomedes en Argiripa','<p class="sub"><b>Esto no es historia: es una leyenda</b>, tal como la cuenta Virgilio en la Eneida. Entras en ella como en un sueño.</p>'+
    '<p>Eneas ha llegado al Lacio y los latinos se preparan para la guerra. Han enviado a Vénulo hasta Apulia para pedir ayuda a un viejo héroe griego que reina allí: <b>Diomedes</b>, el que luchó en Troya. Tú vas con la embajada.</p><p>Acércate al rey y escúchalo (E). Al final tendrás que decidir qué mensaje lleváis de vuelta.</p>'+
    '<p class="sub">¿Ves las aves blancas que gritan sobre el palacio? Fíjate en ellas.</p>');};}
function argStory(){const z=legZ('argiripa');let ok=0;const Q=[
  ['«Pueblos felices del reino de Saturno, antiguos ausonios: ¿qué os empuja a buscar una guerra que no conocéis? Todos los que pisamos los campos de Troya lo hemos pagado. Mira esas aves sobre el palacio.» ¿Qué son?',
   [['Sus compañeros de Troya, convertidos en aves por Venus',1],['Las aves sagradas de Júpiter',0],['Aves que trajo de Grecia en su barco',0]],'«Mis compañeros. Venus los convirtió en aves, y ahora vagan por los ríos y llenan los acantilados de gritos que parecen llanto» (XI 271-274).'],
  ['«Ya debí esperarlo desde el día en que, loco de mí, herí con el hierro el cuerpo de una diosa.» ¿A qué diosa hirió Diomedes en Troya?',
   [['A Venus, en la mano',1],['A Juno',0],['A Minerva, su protectora',0]],'«A Venus, en la mano (XI 276-277; Ilíada V 330-340). Desde entonces no me ha dejado en paz: ni volver a casa pude.»'],
  ['«No me pidáis que luche contra los troyanos: después de Troya no quiero guerras. Llevad a Eneas los regalos que me traéis. Me he enfrentado a él: sé lo alto que se alza con el escudo. Si Troya hubiera tenido dos hombres como él…» ¿Qué mensaje lleváis al rey Latino?',
   [['Que Diomedes no vendrá, y que lo mejor es hacer la paz con Eneas',1],['Que Diomedes vendrá con su ejército',0],['Que Diomedes pide más oro para venir',0]],'«Haced un pacto, como sea; pero que no choquen vuestras armas con las suyas» (XI 292-293). En la Eneida, el rey Latino propone entonces la paz, aunque Turno no la acepta.']];
  let i=0;const step=()=>{if(i>=Q.length){const first=!z.won;if(ok>=2){z.won++;z.best=20;save();try{rwDiscover('La corona de Victoria: Diomedes en Argiripa','has escuchado al viejo héroe');}catch(e){}
        try{x4Trofeo('aves_diomedeas','Una pluma de ave diomedea','Recuerdo de la embajada a Argiripa (Eneida XI)');}catch(e){}try{qAdd('so',1,'Has escuchado a Diomedes.');}catch(e){}}else save();
      int2Dlg('V','Victoria',ok>=2?'La embajada vuelve':'Vuelve a escucharlo','<p>'+(ok>=2?'Has entendido lo que Diomedes os ha dicho: el viejo guerrero ya no quiere guerras y aconseja la paz con Eneas. '+(first?'Ganas la <b>corona de Victoria</b> de esta leyenda.':'Ya habías llevado este mensaje otras veces.'):'Has acertado '+ok+' de 3. Habla otra vez con Diomedes y fíjate bien en lo que dice.')+'</p><p class="sub">Para los romanos, Diomedes era un antiguo enemigo de Eneas, y por tanto de sus antepasados, que acabó pidiendo la paz. En Apulia se le daba culto como a un héroe; Estrabón (VI 3,9) y Plinio (X 126-127) hablan de las islas Diomedeas y de sus aves.</p>');return;}
    const q=Q[i];jmDlg('Δ','Diomedes','Rey de Argiripa · '+(i+1)+'/3','<p>'+q[0]+'</p>',q[1].slice().sort(()=>Math.random()-0.5).map(o=>[o[0],()=>{ok+=o[1];jmDlg('Δ','Diomedes','',(o[1]?'':'<p class="sub">No era eso.</p>')+'<p>'+q[2]+'</p>',[['Seguir',()=>{i++;step();}]]);}]));};step();}
