// ============================================================ MISIONES FINALES DE LAS CUALIDADES (y la carrera en 3D)
// Lógos: duelo con Gorgias en Larisa / juicio ante los centúnviros en la Basílica Julia.
// Eusébeia: iniciación en Eleusis / bajada a los Infiernos con la Sibila de Cumas (Eneida VI).
// Kléos: decreto de la Asamblea en tu honor / la inauguración del Anfiteatro Flavio con Tito y Marcial.
function finz(){if(!state.fin||typeof state.fin!=='object')state.fin={gor:0,gorDay:0,jui:0,juiDay:0,eleu:0,sib:0,sibSt:0,dec:0,col:0};return state.fin;}
const FZ={X:9500,Y:4200,built:{},ovr:false,zone:null,objs:{}};
// zonas especiales: la pista de la carrera (z 3000), el Telesterion de Eleusis o los Infiernos (z 6000)
function fzIn(){if(Math.abs(player.x-FZ.X)<500&&player.feet>FZ.Y-60&&player.feet<FZ.Y+300){if(player.z>2700&&player.z<3500)return 'race';if(player.z>5700&&player.z<7200)return MODE==='roma'?'inf':'tel';}return null;}
const fzSp=(col,sx,sy,op,par,x,y,z)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:HALO_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:op,fog:false,color:col}));s.scale.set(sx,sy,1);s.position.set(x||0,y||0,z||0);(par||scene).add(s);return s;};
function fzPut(x,z,yaw,dy){player.x=x;player.z=z;player.feet=floorAt(x,z)+(dy||0);player.camY=player.feet+player.eye;player.vy=0;player.pitch=0;if(yaw!==undefined)player.yaw=yaw;if(GF){GF.vx=0;GF.vz=0;}curZone=null;hudKey='';}
function fzGo(t1,t2,fn){if(typeof cavTravel==='function')return cavTravel(t1,t2,fn);fn();}
function fzRestore(){if(!FZ.ovr)return;FZ.ovr=false;scene.fog.near=260;scene.fog.far=2400;if(SEA)SEA.visible=true;for(const L of FZ.lights||[])L.intensity=0;updateSky();}
// ---- textos en secuencia: cada paso es un párrafo con «Seguir»
function finSeq(glyph,name,title,steps,done){const one=casaOpen(glyph,name,title),B=$('dBody');let i=0;
  const show=()=>{const s=steps[i];B.innerHTML=(s.h?'<p class="sub"><b>'+s.h+'</b></p>':'')+s.t;$('dOpts').innerHTML='';
    if(i<steps.length-1)one(s.btn||'Seguir',()=>{i++;show();},'quiz');else one(s.btn||'Seguir',()=>{done&&done();},'quiz');};
  show();$('dialog').hidden=false;}
// ---- duelo de palabra: cada parte del discurso tiene tres opciones (2 = buena, 1 = floja, 0 = mala)
function finDuel(cfg){const one=casaOpen(cfg.glyph,cfg.name,cfg.title),B=$('dBody');let i=0,pts=0;
  const ask=()=>{const P=cfg.parts[i];B.innerHTML='<p class="sub"><b>'+P.h+'</b> · parte '+(i+1)+' de '+cfg.parts.length+'</p><p>'+P.q+'</p>';$('dOpts').innerHTML='';
    P.o.map(o=>o).sort(()=>R()-0.5).forEach(o=>one(o[0],()=>{pts+=o[1];B.innerHTML='<p><i>'+o[0]+'</i></p><p>'+o[2]+'</p><p class="sub">'+(o[1]===2?cfg.good:o[1]===1?cfg.meh:cfg.bad)+'</p>';$('dOpts').innerHTML='';
      one(i<cfg.parts.length-1?'Seguir':'Esperar el veredicto',()=>{i++;if(i<cfg.parts.length)ask();else cfg.end(pts,cfg.parts.length*2,one,B);},'quiz');},'quiz'));};
  B.innerHTML=cfg.intro;$('dOpts').innerHTML='';one('Empezar',ask,'quiz');one('Ahora no',closeDialog);$('dialog').hidden=false;}
const finNeed=(k,lv)=>qLv(k)>=lv;
function fLack(k,txt){const q=QUAL.find(x=>x.k===k);return '<p class="sub">Necesitas '+qName(q)+' 10 (tienes '+qLv(k)+'). '+(txt||'')+'</p>';}
// ======================================================== 1. LA CARRERA EN 3D
const RACE={on:false,D:null,G:null,rival:null,apples:[],ret:null,ov:null,cd:0,ph:0,thr:false};
function raceBuild(){if(FZ.built.race===MODE)return;FZ.built.race=MODE;const X=FZ.X,Z=3000,Y=FZ.Y,ro=MODE==='roma',L=252,g=grp(X,Y,Z,0);
  // suelo y pista (la de Olimpia mide un estadio, unos 192 metros; esta es algo más larga)
  box(140,1,420,lam(ro?'#9aa868':'#9aa878'),0,-0.5,L/2,g);addPlat(X,Z+L/2,140,420,0,Y);
  for(const[a,b,c,d]of[[-12,-40,12,-40],[12,-40,12,L+60],[12,L+60,-12,L+60],[-12,L+60,-12,-40]])addSeg(X+a,Z+b,X+c,Z+d,0.4);
  if(ro){const wh=lam('#d8b860');for(let i=0;i<40;i++){box(30,0.9,8,wh,(i%2?-1:1)*30,0.45,-20+i*8,g);}box(8,0.04,L+20,lam('#b89a6a'),0,0.02,L/2,g);
    const t=grp(X,Y,Z+L+4,0);box(0.6,3,0.6,lam('#6a5236'),0,1.5,0,t);const c=new THREE.Mesh(new THREE.SphereGeometry(2.6,10,8),lam('#7a9a5a'));c.position.y=4;c.scale.y=0.7;t.add(c);}
  else{box(16,0.04,L+20,lam('#c9a87a'),0,0.02,L/2,g);
    // los taludes de tierra donde se sentaba el público (en Olimpia no había gradas de piedra), con gente
    for(const s of[-1,1]){const bk=box(14,4,L+30,lam('#8a9a6a'),s*16,1.2,L/2,g);bk.rotation.z=s*0.35;
      for(let i=0;i<110;i++){const p=box(0.5,0.9,0.5,lam(pick(['#e8dcc0','#c8402a','#4a6a9a','#d8a040','#7a5a3a'])),s*rr(12,19),0,rr(-10,L+20),g);p.position.y=0.6+(Math.abs(p.position.x)-11)*0.36;}}
    // la tribuna de los jueces (hellanodikai) y las líneas de salida y llegada de piedra (balbís), con sus ranuras
    box(5,2.4,6,lam('#e8e0d0'),-11,1.2,L*0.55,g);}
  for(const zz of[0,L]){box(16,0.15,0.6,lam('#f0ebe0'),0,0.08,zz,g);for(let i=-3;i<=3;i++)box(0.05,0.16,0.62,lam('#8a8070'),i*2,0.09,zz,g);}
  box(0.3,3,0.3,lam('#e8e0d0'),-8,1.5,L,g);box(0.3,3,0.3,lam('#e8e0d0'),8,1.5,L,g);box(16.3,0.3,0.3,lam('#e8e0d0'),0,3,L,g);
  FZ.objs.race={L};}
function raceOverlay(){let o=$('race3d');if(o)return o;o=document.createElement('div');o.id='race3d';
  o.style.cssText='position:fixed;left:0;right:0;top:0;z-index:35;pointer-events:none;font:15px Alegreya,Georgia,serif;color:#f1e8d8;text-shadow:0 1px 3px #000';
  o.innerHTML='<div class="hud" style="text-align:center;padding:10px 120px 0"></div><div class="msg" style="position:fixed;left:50%;bottom:18%;transform:translateX(-50%);max-width:min(620px,90vw);text-align:center;font-size:17px;background:rgba(20,16,12,.7);border-radius:8px;padding:6px 12px"></div>'+
   '<div class="cd" style="position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);font:64px Marcellus,Georgia,serif;color:#ffe0a0"></div>'+
   '<div class="tb" style="position:fixed;right:14px;bottom:14px;display:flex;gap:10px;pointer-events:auto"><button data-k="sprint" style="font:inherit;padding:14px 18px;border-radius:10px;border:1px solid #d9874a;background:#d9874a;color:#1a120c">Esprint</button><button data-k="apple" style="font:inherit;padding:14px 18px;border-radius:10px;border:1px solid #ffd040;background:rgba(255,208,64,.85);color:#1a120c">Manzana</button><button data-k="quit" style="font:inherit;padding:14px 18px;border-radius:10px;border:1px solid #d9874a;background:rgba(20,16,12,.8);color:#f1e8d8">Abandonar</button></div>';
  document.body.appendChild(o);
  o.querySelectorAll('.tb button').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();if(k==='sprint')RACE.tSprint=true;else if(k==='apple')RACE.thr=true;else raceEnd('skip');});for(const ev of['pointerup','pointerleave','pointercancel'])b.addEventListener(ev,()=>{if(k==='sprint')RACE.tSprint=false;});});
  return o;}
function race3d(D){const ro=MODE==='roma';raceBuild();if(MOUNT.riding)dismount();if(MOUNT.g){MOUNT.g.visible=false;MOUNT.st='away';}FLY.on=false;
  RACE.ret={x:player.x,z:player.z,yaw:player.yaw};const ov=raceOverlay();ov.hidden=false;ov.querySelector('.tb').style.display=isTouch?'flex':'none';
  ov.querySelector('[data-k=apple]').style.display=D===MG_ATAL&&atz().apples?'':'none';
  MG.d=ov;MG.keys={};const G={t:0};D.init(G);Object.assign(RACE,{on:true,D,G,cd:3.6,ph:0,thr:false,tSprint:false});
  if(!RACE.rival||RACE.rival.mode!==MODE){if(RACE.rival)scene.remove(RACE.rival.g);const F=divineFigure(FZ.X+2.2,3000,ro?{female:true,chiton:'#c9a86a',himation:'#6a3a2a',hair:'#3a2a1e'}:{female:true,chiton:'#e8dcc0',himation:'#5a6a3a',hair:'#b07a3a'},ro?'#f0e0c0':'#ffe0a0',ro?'Camila':'Atalanta','',1.05);F.lb.visible=false;F.mk.visible=false;F.g.rotation.y=0;RACE.rival={g:F.g,mode:MODE};}
  RACE.apples.forEach(a=>scene.remove(a));RACE.apples=[];
  fzGo(ro?'Camila te lleva hasta un trigal del Lacio…':'Atalanta te lleva hasta la línea de salida…',ro?'«Hasta aquel olivo. Descalza, como yo».':'«Un estadio y algo más. Sin trampas… o con las que tú traigas».',()=>{fzPut(FZ.X-2.2,3000-1,Math.PI);RACE.rival.g.position.set(FZ.X+2.2,FZ.Y,3000);
    setTimeout(()=>mgSay('<b>Mayús</b> o <b>W</b>: esprintar (gasta aliento). Se corre solo.'+(D===MG_ATAL&&atz().apples?' <b>Espacio</b>: lanzar una manzana cuando la tengas cerca.':''),4),900);});}
function raceTick(dt){if(!RACE.on||!state)return;const ov=$('race3d');if(!ov)return;const G=RACE.G,D=RACE.D,X=FZ.X,Z=3000;
  if(ui!=='play')return;
  if(RACE.cd>0){RACE.cd-=dt;const n=Math.ceil(RACE.cd-0.6);ov.querySelector('.cd').textContent=RACE.cd>0.6?(n>0?n:'¡Ya!'):'';if(RACE.cd<=0.6&&!RACE.go){RACE.go=1;mgSay(D.first,2.5);}
    fzPut(X-2.2,Z-1,undefined);if(RACE.cd<=0){ov.querySelector('.cd').textContent='';RACE.go=0;}return;}
  MG.keys.KeyW=!!(keys.run||keys.w||RACE.tSprint);MG.keys.Space=RACE.thr;
  G.t+=dt;const r=D.tick(G,dt);RACE.thr=false;
  // posiciones en el mundo: 1 paso del modelo = 0,6 m
  player.x=X-2.2;player.z=Z+G.pd*0.6;player.feet=FZ.Y+Math.abs(Math.sin(G.t*G.sp*0.9))*0.06;player.camY=player.feet+player.eye;if(GF){GF.vx=0;GF.vz=0;}
  const rg=RACE.rival.g;rg.position.z=Z+G.ad*0.6;rg.position.x=X+2.2+(G.astop>0?Math.min(2.5,(2.5-G.astop)*3):0);RACE.ph+=G.asp*dt*0.95;personWalk(rg,RACE.ph,G.astop>0?0.3:1.6);rg.rotation.y=G.astop>0?-0.8:0;
  // manzanas: esferas de oro que ruedan
  while(RACE.apples.length<G.ap.length){const m=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,10),new THREE.MeshLambertMaterial({color:'#ffd040',emissive:'#8a6010'}));scene.add(m);fzSp('#fff0a0',1,1,0.7,m);RACE.apples.push(m);}
  G.ap.forEach((p,i)=>{const m=RACE.apples[i];m.position.set(X+(p.ok?2.6+Math.min(3,(p.x-G.pd)*0.08):1),FZ.Y+0.16+Math.max(0,-p.y)*0.12,Z+p.x*0.6);});
  ov.querySelector('.hud').innerHTML=D.hud(G);
  if(r)raceEnd(r);}
function raceEnd(res){if(!RACE.on)return;RACE.on=false;const ov=$('race3d');if(ov)ov.hidden=true;const D=RACE.D,G=RACE.G;
  const txt=res==='skip'?'<p>Abandonas la carrera.</p>':D.after(G,res);const back=()=>{closeDialog();fzGo('Vuelves…','',()=>{const R0=RACE.ret;if(R0)fzPut(R0.x,R0.z,R0.yaw);RACE.apples.forEach(a=>scene.remove(a));RACE.apples=[];});};
  const one=casaOpen(MODE==='roma'?'C':'Α',res==='win'?D.winT:res==='fail'?D.failT:'Carrera abandonada',D.title),B=$('dBody');B.innerHTML=txt;
  if(res!=='win')one('Repetir la carrera',()=>{closeDialog();race3d(D);},'quiz');one('Volver',back,res==='win'?'quiz':'');$('dialog').hidden=false;}
addEventListener('keydown',e=>{if(!RACE.on||ui!=='play')return;if(e.code==='Space'){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)RACE.thr=true;}},true);
// ======================================================== 2. LÓGOS: GORGIAS (Atenas) Y LOS CENTÚNVIROS (Roma)
function gorgiasAct(){const f=finz(),ro=false;void ro;
  const one=casaOpen('Γ','Gorgias de Leontinos','Sofista y maestro de retórica · casi cien años'),B=$('dBody');
  const T=[['¿Cuántos años tienes?','Casi cien. Nací en Leontinos, en Sicilia, antes de las guerras médicas. Cuando me preguntan cómo he llegado a viejo con la cabeza tan clara, contesto que nunca he hecho nada por darme un placer (Ateneo XII 548d). Vivo aquí, en Larisa: los tesalios pagan bien a quien les enseña a hablar.'],
   ['¿Es verdad que tienes una estatua de oro en Delfos?','De oro macizo, y la pagué yo. Ningún hombre se había atrevido antes (Plinio, Historia natural XXXIII 83; Pausanias X 18, 7). Si la palabra puede convertir a un hombre en oro, ¿por qué no iba a hacerlo conmigo?'],
   ['¿Qué es para ti la palabra?','«Un gran soberano que, con el cuerpo más pequeño e invisible, hace las obras más divinas: puede quitar el miedo, apartar la pena, crear la alegría y aumentar la compasión». Lo escribí en mi Elogio de Helena (8). Por eso defendí a Helena: si la persuadieron con palabras, no tiene culpa.'],
   ['¿Estuviste en Atenas?','Hace cuarenta años vine como embajador de Leontinos a pedir ayuda contra Siracusa. Hablé en la Asamblea y los atenienses se quedaron con la boca abierta: nunca habían oído antítesis tan bien medidas (Diodoro XII 53). Me votaron la flota. Desde entonces, todo el mundo me imita.']];
  const menu=msg=>{$('dOpts').innerHTML='';if(msg)B.innerHTML=msg;T.forEach(t=>one(t[0],()=>menu('<p>'+t[1]+'</p>')));
    one(f.gor?'Hablar otra vez de retórica':'Aceptar su desafío',()=>{if(f.gor){menu('<p>«Tú y yo ya nos hemos medido. Vuelve cuando quieras a escuchar a un viejo».</p>');return;}
      if(!finNeed('lo',10)){menu('<p>Gorgias te mira con una sonrisa cansada. «Todavía hablas como quien pide el pan. Vuelve cuando te escuchen las asambleas».</p>'+fLack('lo','Habla con oradores y políticos, y haz de jurado.'));return;}
      if(f.gorDay===state.day){menu('<p>«Hoy ya me has hecho reír bastante. Mañana».</p>');return;}gorgiasDuel();},'quiz');
    one('Despedirse',closeDialog);};
  menu('<p>Un anciano muy erguido, vestido de púrpura, está sentado bajo un pórtico rodeado de jóvenes tesalios. Habla despacio, midiendo cada frase como si la pesara. Es Gorgias, el sofista más famoso de Grecia.</p><p>«Así que tú eres la persona de la que hablan en Atenas. Dicen que tu palabra convence. Demuéstralo: te propongo un desafío delante de mis alumnos».</p>');}
function gorgiasDuel(){const f=finz();f.gorDay=state.day;save();
  finDuel({glyph:'Γ',name:'El desafío de Gorgias',title:'Un elogio de la sal, ante los alumnos de Larisa',
   intro:'<p>«Elogiar a Aquiles es fácil. Elogiar a Helena, ya es más difícil: lo hice yo. Te propongo algo peor: haz el <b>elogio de la sal</b>». Los alumnos se ríen. En el Banquete de Platón alguien recuerda que hay un libro entero en alabanza de la sal (177b).</p><p class="sub">Un discurso tiene cuatro partes. En cada una elige la mejor salida. Necesitas una buena actuación (6 puntos de 8) para ganar.</p>',
   good:'Los alumnos murmuran con aprobación. Gorgias asiente despacio.',meh:'Algunos alumnos bostezan. Gorgias levanta una ceja.',bad:'Risas en el pórtico. Gorgias se tapa la cara con la mano.',
   parts:[
    {h:'Proemio',q:'Tienes que ganarte al público antes de hablar de la sal. ¿Cómo empiezas?',o:[
      ['«Me pedís que alabe lo más humilde de la mesa. Pero lo humilde es lo que más falta hace: nadie echa de menos el oro en el pan, y todos echan de menos la sal»',2,'Antítesis, humildad y una sorpresa: el proemio de manual.'],
      ['«La sal es muy importante y ahora os diré por qué»',1,'Correcto, pero no despierta a nadie.'],
      ['«Yo soy mejor orador que Gorgias, y os lo voy a demostrar»',0,'Insultar al anfitrión en el primer minuto: el público se pone en contra.']]},
    {h:'Narración',q:'Ahora cuenta los hechos: de dónde viene la sal y qué hace.',o:[
      ['«Nace del mar, que es de Poseidón, y del sol, que es de Helios: es hija de dos dioses. La sal guarda el pescado del invierno y la carne del verano»',2,'Una narración breve, clara y con un toque divino.'],
      ['«Hay sal en el mar, en las salinas, en las lágrimas, en el sudor, en las rocas, en la sangre, en…»',1,'Te pierdes en la lista. La narración debe ser breve.'],
      ['«Una vez me eché demasiada sal en las lentejas»',0,'Una anécdota sin gracia y sin relación con el elogio.']]},
    {h:'Pruebas',q:'Toca demostrar el valor de la sal. ¿Qué argumento eliges?',o:[
      ['«Por la sal se pagan los tratos y se sellan las amistades: compartir el pan y la sal es ser huésped. Y Homero llama a la sal “divina”» (Ilíada IX 214)',2,'Un argumento de costumbre y una autoridad: Homero. Gorgias sonríe.'],
      ['«La sal es buena porque todo el mundo la usa»',1,'Es cierto, pero es un argumento débil: muchos usan cosas malas.'],
      ['«Si no os gusta la sal, sois unos ignorantes»',0,'Un ataque, no un argumento.']]},
    {h:'Epílogo',q:'Termina. El epílogo debe recoger lo dicho y mover el ánimo.',o:[
      ['«Hija de los dioses, guardiana del alimento, testigo de la amistad: si os quitaran la sal, la vida no tendría sabor. Alabadla, pues, como yo: con poco y con verdad»',2,'Recapitulación en tres miembros y un cierre que suena. Aplausos.'],
      ['«Y eso es todo lo que tenía que decir de la sal»',1,'Acabas, pero no cierras.'],
      ['«Bueno, no sé, ya me he cansado»',0,'Los alumnos se miran entre ellos.']]}],
   end(p,max,one,B){const win=p>=6;if(win){f.gor=1;qAdd('lo',4,'Has vencido a Gorgias con la palabra.');qAdd('kl',4);state.obols+=15;updateStats();sfxCoin();}save();
     B.innerHTML='<p>Has conseguido '+p+' de '+max+' puntos.</p>'+(win?'<p>Gorgias se levanta, despacio, y te aplaude. «Has hecho de la sal algo divino. Eso es la retórica: hacer grande lo pequeño y pequeño lo grande». Sus alumnos te rodean para preguntarte de dónde eres.</p><div class="curio"><span class="label">Rhḗtōr</span><p>Gorgias te regala una copia de su Elogio de Helena y quince óbolos. Tu epigrama: <i>«Convenció al que convencía a todos»</i>.</p></div>':'<p>Gorgias sonríe con paciencia. «Bien empezado. Pero un discurso es como un cuerpo: si le falta un miembro, cojea. Vuelve mañana».</p>');
     $('dOpts').innerHTML='';one('Despedirse',closeDialog,'quiz');}});}
function juicioAct(){const f=finz();
  if(f.jui){finSeq('Q','Quintiliano','Maestro de retórica',[{t:'<p>«Todavía se habla en el Foro de tu discurso ante los centúnviros. Eso es lo que yo llamo un vir bonus dicendi peritus: un hombre bueno que sabe hablar».</p>',btn:'Despedirse'}],closeDialog);return;}
  if(!finNeed('lo',10)){finSeq('Q','Quintiliano','Maestro de retórica',[{t:'<p>«Tengo un caso para alguien de mucha palabra, pero todavía no es para ti».</p>'+fLack('lo','Habla con oradores y políticos.'),btn:'Despedirse'}],closeDialog);return;}
  if(f.juiDay===state.day){finSeq('Q','Quintiliano','Maestro de retórica',[{t:'<p>«El tribunal no vuelve a reunirse hasta mañana».</p>',btn:'Despedirse'}],closeDialog);return;}
  f.juiDay=state.day;save();
  finDuel({glyph:'⚖',name:'Ante los centúnviros',title:'Basílica Julia · una querella por un testamento',
   intro:'<p>Quintiliano te propone un caso. Vibia, una mujer de buena familia, ha sido <b>desheredada</b> por su padre, un anciano de ochenta años que se casó con una joven y murió a los once días dejándoselo todo a la nueva esposa. Vibia presenta una «querella por testamento contrario al deber» (querela inofficiosi testamenti): el padre no la desheredó por una razón, sino arrastrado por una pasión de viejo.</p><p>El tribunal de los centúnviros se reúne en la Basílica Julia: ciento ochenta jueces repartidos en cuatro salas, el pretor presidiendo bajo la lanza clavada en el suelo, y las galerías llenas de público que se asoma para escuchar. Al otro lado, defendiendo a la viuda, está Marco Aquilio Régulo, el abogado más temido de Roma.</p><p class="sub">El caso imita uno que Plinio el Joven defenderá dentro de veinticinco años (Cartas VI 33): una licencia del juego. Necesitas 8 puntos de 10.</p>',
   good:'Murmullo de aprobación en las cuatro salas. Desde la galería alguien grita «¡Bene!».',meh:'Algunos jueces se distraen con la otra sala.',bad:'Régulo sonríe. Mala señal.',
   parts:[
    {h:'Exordio',q:'Empiezas. Los jueces todavía no saben nada del caso.',o:[
      ['«Jueces: no os pido que castiguéis a una viuda. Os pido que devolváis a una hija lo que la naturaleza le daba y una pasión de última hora le ha quitado»',2,'Te ganas la benevolencia y planteas el caso en una frase.'],
      ['«Jueces, este es un caso de herencias»',1,'Exacto, pero frío.'],
      ['«Régulo es un mentiroso, todo el mundo lo sabe»',0,'Atacar al rival antes de presentarte te hace parecer débil.']]},
    {h:'Narración',q:'Cuenta los hechos.',o:[
      ['«Un anciano de ochenta años, que había querido a su hija toda la vida, se casa con una joven y, a los once días, muere habiendo cambiado el testamento. Once días bastaron para borrar ochenta años de cariño»',2,'Clara, breve y con la cifra que todos recordarán.'],
      ['Leer el testamento entero, cláusula por cláusula',1,'Los jueces se aburren: la narración ha de ser breve.'],
      ['«La viuda es una cazafortunas y seguro que lo envenenó»',0,'Una acusación sin pruebas: Régulo la aprovechará.']]},
    {h:'Argumentación',q:'Ahora debes probar que el testamento es «contrario al deber».',o:[
      ['«Un padre puede desheredar, pero con causa. Aquí no hay ninguna: ni ofensa de la hija, ni mala conducta. Solo el color de la locura (color insaniae): un juicio nublado por la edad y la pasión»',2,'Es el argumento técnico de estas querellas: la «apariencia de locura».'],
      ['«Vibia es muy buena persona»',1,'Ayuda, pero no prueba nada sobre el testamento.'],
      ['«La ley no importa, lo importante es lo que es justo»',0,'Ante un tribunal de derecho, desprecias el derecho.']]},
    {h:'Réplica',q:'Régulo se levanta: «¡La hija abandonó a su padre en su vejez!». ¿Qué respondes?',o:[
      ['«Régulo habla de abandono, pero estas son las cartas del padre a su hija, del mes pasado: “a mi querida Vibia”. ¿Así se escribe a quien te abandona?»',2,'Una prueba documental contra una acusación vaga: la sala aplaude.'],
      ['«Eso no es verdad»',1,'Lo niegas, pero sin pruebas.'],
      ['Quedarte callado',0,'El silencio parece una confesión.']]},
    {h:'Peroración',q:'Termina. Es el momento de mover a los jueces.',o:[
      ['Señalas a Vibia, que espera de luto con sus hijos: «Mirad a quien el padre llamaba “mi querida”. No le deis la razón a una pasión de once días contra el amor de toda una vida»',2,'Recapitulas y conmueves. Quintiliano asiente desde la galería.'],
      ['«Eso es todo, jueces»',1,'Correcto, pero sin fuerza.'],
      ['«Si perdéis este caso, os arrepentiréis»',0,'Amenazar a los jueces: un error grave.']]}],
   end(p,max,one,B){const win=p>=8;if(win){f.jui=1;qAdd('lo',4,'Has ganado un juicio ante los centúnviros.');qAdd('kl',4);state.obols+=15;updateStats();sfxCoin();}save();
     B.innerHTML='<p>Has conseguido '+p+' de '+max+' puntos.</p>'+(win?'<p>Las cuatro salas votan. Tres a una: el testamento se anula, y Vibia recibe su parte. Régulo recoge sus papeles sin mirarte. En la galería, un joven de dieciocho años toma notas: es Plinio. Quintiliano te abraza.</p><div class="curio"><span class="label">Orator</span><p>Recibes quince sestercios y la gratitud de una familia. Tu epigrama: <i>«Venció a Régulo ante los Cien»</i>.</p></div>':'<p>Las salas se dividen y la viuda conserva la herencia. Quintiliano te consuela: «Hasta Cicerón perdió juicios. Vuelve mañana: el tribunal se reunirá de nuevo».</p>');
     $('dOpts').innerHTML='';one('Salir de la Basílica',closeDialog,'quiz');}});}
// ======================================================== 3. EUSÉBEIA: ELEUSIS (Atenas) Y LA SIBILA DE CUMAS (Roma)
function eleusisAct(){const f=finz(),mo=calNow().mo,BOE=8;
  if(f.eleu){finSeq('Δ','Los heraldos de los Misterios','Eleusinion de la ciudad',[{t:'<p>Ya eres epóptes: has visto. Lo que viste en el Telesterion no se cuenta. Alcibíades lo parodió en una fiesta y tuvo que huir de Atenas condenado a muerte; el poeta Esquilo estuvo a punto de morir linchado por decir en el teatro algo que parecía un secreto.</p>',btn:'Despedirse'}],closeDialog);return;}
  if(!finNeed('eu',10)){finSeq('Δ','Los heraldos de los Misterios','Eleusinion de la ciudad',[{t:'<p>Un sacerdote de la familia de los Cérices te mira. «Los Misterios están abiertos a todos los que hablan griego y no tienen las manos manchadas de sangre: hombres y mujeres, libres y esclavos. Pero el grado más alto, el de los que ven, exige un alma preparada».</p>'+fLack('eu','Cumple los encargos de los dioses, visita santuarios y participa en las fiestas.'),btn:'Despedirse'}],closeDialog);return;}
  if(mo!==BOE){const dleft=(((BOE-mo+12)%12)*SEASON_DAYS)-((state.day-1)%SEASON_DAYS);
    const one=casaOpen('Δ','Los heraldos de los Misterios','Eleusinion de la ciudad'),B=$('dBody');B.innerHTML='<p>«Los Grandes Misterios se celebran en el mes de Boedromión, en otoño. Faltan unos '+dleft+' días. Vuelve entonces».</p>';
    one('Esperar hasta Boedromión (pasan '+dleft+' días)',()=>{closeDialog();addHours(24*dleft);updateSky();toast('<span class="label">Boedromión</span><br>Han pasado los días. Vuelve al Eleusinion: empiezan los Misterios.');},'quiz');one('Despedirse',closeDialog);$('dialog').hidden=false;return;}
  finSeq('Δ','Los Grandes Misterios de Eleusis','Boedromión · iniciación',[
   {h:'15 de Boedromión: la reunión',t:'<p>En la Stoa Pintada, el heraldo hace la proclama: que se aparten quienes tengan las manos manchadas de sangre o no hablen griego de forma inteligible (Isócrates, Panegírico 157). Te presentas con tu mistagogo, que te ha preparado durante meses. Ya pasaste por los Misterios Menores, en primavera, junto al Iliso.</p>'},
   {h:'16 de Boedromión: «¡Al mar, iniciados!»',t:'<p>Con el grito de «¡Hálade mýstai!», miles de personas bajan al mar en Falero. Cada uno lleva un lechón, que se baña con él y luego se sacrifica: la sangre del cerdo purifica.</p>'},
   {h:'19 de Boedromión: la procesión',t:'<p>Sales de Atenas por la Puerta Sagrada, con una corona de mirto y un haz de ramas (el bákchos), detrás de la estatua de Yaco. Son unos veinte kilómetros por la Vía Sagrada. En el puente del Cefiso, hombres enmascarados insultan a los ricos y a los importantes: es la gefirismós, y nadie puede ofenderse.</p>'},
   {h:'La noche',t:'<p>Llegas a Eleusis al anochecer, a la luz de miles de antorchas. Rompes el ayuno como la propia Deméter cuando buscaba a su hija: con el kykeón, una bebida de agua, harina de cebada y poleo (Himno homérico a Deméter 208-210). Y entras en el Telesterion.</p><p class="sub">Lo que pasaba dentro era un secreto bajo pena de muerte, y casi nadie lo rompió. El juego solo te enseñará lo poco que se sabe.</p>',btn:'Entrar en el Telesterion'}],
   ()=>{closeDialog();fzGo('Entras en el Telesterion…','Miles de iniciados en silencio, de pie en las gradas, a oscuras.',()=>{telBuild();fzPut(FZ.X,6000+20,0);setTimeout(()=>toast('<span class="label">El Telesterion</span><br>Una sala enorme, cuadrada, llena de columnas, con gradas en las paredes. En el centro, el Anactoron. Espera la señal del hierofante.'),900);});});}
function telBuild(){if(FZ.built.tel)return;FZ.built.tel=1;const X=FZ.X,Z=6000,Y=FZ.Y,g=grp(X,Y,Z,0),st=lam('#8a7a66'),dk=lam('#3a3028');
  // la sala de Pericles: unos 51 m de lado, 42 columnas y gradas en las cuatro paredes
  box(54,0.6,54,dk,0,-0.3,0,g);addPlat(X,Z,54,54,0,Y);box(56,14,1,st,0,7,-27.5,g);box(56,14,1,st,0,7,27.5,g);box(1,14,56,st,-27.5,7,0,g);box(1,14,56,st,27.5,7,0,g);box(56,1,56,dk,0,14.5,0,g);
  for(const[a,b,c,d]of[[-26,-26,26,-26],[26,-26,26,26],[26,26,-26,26],[-26,26,-26,-26]])addSeg(X+a,Z+b,X+c,Z+d,0.4);
  for(let k=0;k<6;k++){const w=0.9;for(const s of[-1,1]){box(52,0.5,w,st,0,0.25+k*0.5,s*(26-w/2-k*w),g);box(w,0.5,52,st,s*(26-w/2-k*w),0.25+k*0.5,0,g);}}
  for(let i=0;i<6;i++)for(let j=0;j<7;j++){const x=-17.5+i*7,z=-18+j*6;if(Math.abs(x)<5&&Math.abs(z)<5)continue;const c=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.6,14,10),st);c.position.set(x,7,z);g.add(c);addCirc(X+x,Z+z,0.6);}
  box(9,5,6,lam('#6a5a48'),0,2.5,0,g);addBox(X,Z,9,6,0);
  // los iniciados, de pie en las gradas, y antorchas
  for(let i=0;i<70;i++){const s=R()<0.5?-1:1,side=R()<0.5,k=Math.floor(R()*5),off=26-0.5-k*0.9,along=rr(-22,22);const p=makePerson({chiton:pick(['#e8dcc0','#d8c8a8','#c8b898']),hair:'#3a2a1e',female:R()<0.45});
    p.position.set(X+(side?s*off:along),Y+0.5+k*0.5,Z+(side?along:s*off));p.rotation.y=Math.atan2(X-p.position.x,Z-p.position.z);scene.add(p);}
  FZ.lights=[];for(const[x,z]of[[-6,-6],[6,-6],[-6,6],[6,6]]){fzSp('#ffb050',1.6,2.2,0.9,g,x,3,z);const L=new THREE.PointLight(0xff9a50,0,30,1.5);L.position.set(X+x,Y+3,Z+z);scene.add(L);FZ.lights.push(L);}
  FZ.telLight=fzSp('#fff6d0',40,40,0,g,0,7,0);
  const hp=makePerson({chiton:'#f4efe4',himation:'#7a2a5a',beard:true,hair:'#d8d0c2'});hp.position.set(X,Y,Z+4);scene.add(hp);
  egxObj(X,Z+5,Y,'fe:hierofante','El hierofante','sacerdote de los Misterios',3);egxObj(X,Z+3.5,Y,'fe:anactoron','El Anactoron','lo más sagrado',3.2);egxObj(X+20,Z+20,Y,'fe:gradas','Las gradas','los iniciados',3);}
function telAct(o){const f=finz(),a=o.act,one=casaOpen('Δ',o.data.name,'Telesterion de Eleusis'),B=$('dBody');
  if(a==='fe:gradas'){B.innerHTML='<p>Miles de personas de pie, en silencio, en las gradas que rodean la sala por los cuatro lados: hombres y mujeres, ricos y pobres, ciudadanos, extranjeros y esclavos. Pocas cosas en Grecia reunían así a todo el mundo.</p>';one('Cerrar',closeDialog);return;}
  if(a==='fe:anactoron'){B.innerHTML='<p>Un pequeño edificio de piedra en medio de la sala: el Anactoron. Solo el hierofante puede entrar. Dentro se guardan los objetos sagrados (hierá), que las sacerdotisas trajeron a Atenas en cestas cerradas y devolvieron en la procesión.</p>';one('Cerrar',closeDialog);return;}
  if(a==='fe:hierofante'){if(f.eleu){B.innerHTML='<p>El hierofante te mira en silencio. Ya has visto.</p>';one('Cerrar',closeDialog);return;}
    B.innerHTML='<p>El hierofante, de la familia de los Eumólpidas, vestido de púrpura, levanta las manos. Se sabe que en la iniciación había «cosas dichas, cosas mostradas y cosas hechas» (legómena, deiknýmena, drómena), y nada más.</p>';
    one('Esperar la señal',()=>{f.eleu=1;qAdd('eu',5,'Has visto los Misterios de Eleusis.');qAdd('kl',2);save();updateStats();sfxCoin();if(FZ.telLight){FZ.telLight.material.opacity=1;setTimeout(()=>{if(FZ.telLight)FZ.telLight.material.opacity=0.25;},4000);}
      B.innerHTML='<p>Se apagan las antorchas. Silencio absoluto. De pronto, las puertas del Anactoron se abren y sale una luz enorme, como de un gran fuego: se decía que se veía desde lejos (Plutarco, Sobre el progreso en la virtud 81e). Se oye un gong. El hierofante muestra algo.</p><p>Un autor cristiano, siglos después, contó que lo que se mostraba era «una espiga de trigo segada en silencio» (Hipólito, Refutación V 8, 39). No sabemos si es verdad.</p><p>Al salir, los iniciados decían que ya no temían a la muerte: «Felices los que han visto esto entre los hombres de la tierra» (Himno a Deméter 480).</p><div class="curio"><span class="label">Epóptes</span><p>Ahora eres «el que ha visto». El juego condensa en una noche dos años: en realidad, los iniciados (mýstai) volvían al año siguiente para ser epóptai.</p></div>';
      $('dOpts').innerHTML='';one('Salir de Eleusis',()=>{closeDialog();fzGo('Vuelves a Atenas…','Con la corona de mirto todavía en la cabeza.',()=>{const p=PLACES.find(q=>q.id==='eleusinion');if(p)fzPut(p.x+3,p.z+3,0);});},'quiz');},'quiz');
    one('Cerrar',closeDialog);return;}}
// ---- la Sibila de Cumas y los Infiernos (Eneida VI)
function sibilaAct(){const f=finz();
  if(f.sib){finSeq('Σ','El antro de la Sibila','Cumas, en Campania',[{t:'<p>El antro está en silencio. Hace mucho que la Sibila no habla: en tiempos de Nerón, en el Satiricón de Petronio, alguien cuenta que la vio colgada en una jarra, tan vieja que solo pedía morir (48, 8). Pero tú bajaste con ella.</p>',btn:'Despedirse'}],closeDialog);return;}
  if(!finNeed('eu',10)){finSeq('Σ','El antro de la Sibila','Cumas, en Campania',[{t:'<p>Una galería larga excavada en la roca, con aberturas por las que entra la luz. Aquí profetizaba la Sibila. Un guía te cuenta que Eneas bajó desde aquí a los Infiernos, para ver a su padre. «Pero solo los piadosos pueden seguirle», dice.</p>'+fLack('eu','Cumple con los dioses y las fiestas.'),btn:'Despedirse'}],closeDialog);return;}
  finSeq('Σ','El antro de la Sibila','Cumas, en Campania',[{t:'<p>Entras en la galería. De sus cien bocas salen cien voces (Eneida VI 43-44). Al fondo, una mujer muy vieja se agita, poseída por Apolo. «La bajada al Averno es fácil: la puerta de Dite está abierta noche y día. Volver a subir, eso es lo difícil» (VI 126-129).</p><p class="sub">Es la bajada de Eneas a los Infiernos, en el libro VI de la Eneida. Recorrerla es una licencia del juego.</p>',btn:'Seguir a la Sibila'}],
   ()=>{closeDialog();fzGo('Sigues a la Sibila…','«Busca en el bosque una rama de oro: sin ella nadie baja» (VI 136-141).',()=>{infBuild();f.sibSt=Math.max(f.sibSt,0);save();fzPut(FZ.X,6000-40,Math.PI);setTimeout(()=>toast('<span class="label">El bosque del Averno</span><br>Busca la rama dorada. Sin ella, Caronte no te dejará cruzar.'),900);});});}
function infBuild(){if(FZ.built.inf)return;FZ.built.inf=1;const X=FZ.X,Z=6000,Y=FZ.Y,g=grp(X,Y,Z,0),rk=lam('#3a3a44'),dk=lam('#24242c');
  // un camino largo: bosque (z -50), Averno (-20), vestíbulo (0), Aqueronte (25), Cerbero (60), campos del llanto (90), cruce (120), Elíseos (170), puertas del sueño (215)
  box(30,0.6,320,dk,0,-0.3,90,g);addPlat(X,Z+90,30,320,0,Y);addSeg(X-14,Z-70,X-14,Z+250,0.4);addSeg(X+14,Z-70,X+14,Z+250,0.4);addSeg(X-14,Z-70,X+14,Z-70,0.4);addSeg(X-14,Z+250,X+14,Z+250,0.4);
  for(let i=0;i<60;i++){const s=R()<0.5?-1:1;const b=box(rr(2,5),rr(4,14),rr(2,5),rk,s*rr(10,14),0,rr(-70,240),g);b.position.y=b.geometry.parameters.height/2;}
  for(let i=0;i<24;i++){const t=grp(X+(R()<0.5?-1:1)*rr(4,12),Y,Z+rr(-68,-35),0);box(0.4,4,0.4,lam('#3a2a1e'),0,2,0,t);const c=new THREE.Mesh(new THREE.ConeGeometry(2,5,7),lam('#2a3a2a'));c.position.y=5;t.add(c);}
  {const t=grp(X+5,Y,Z-52,0);box(0.5,4,0.5,lam('#3a2a1e'),0,2,0,t);const c=new THREE.Mesh(new THREE.ConeGeometry(2.2,5,7),lam('#2a3a2a'));c.position.y=5;t.add(c);FZ.bough=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,1.4),new THREE.MeshLambertMaterial({color:'#ffd040',emissive:'#8a6010'}));FZ.bough.position.set(0.9,3.4,0);t.add(FZ.bough);fzSp('#ffe080',2,2,0.8,FZ.bough);}
  {const w=new THREE.Mesh(new THREE.PlaneGeometry(26,14),new THREE.MeshPhongMaterial({color:'#1a2a30',shininess:60}));w.rotation.x=-Math.PI/2;w.position.set(X,Y+0.02,Z-20);scene.add(w);}
  {const w=new THREE.Mesh(new THREE.PlaneGeometry(28,10),new THREE.MeshPhongMaterial({color:'#2a3a3a',shininess:40}));w.rotation.x=-Math.PI/2;w.position.set(X,Y+0.03,Z+27);scene.add(w);const b=grp(X-4,Y,Z+27,0);box(2,0.5,5,lam('#3a2a1e'),0,0.3,0,b);const ch=makePerson({chiton:'#4a4038',hair:'#d8d0c2',beard:true});ch.position.set(X-4,Y+0.5,Z+25.5);scene.add(ch);}
  {const c=grp(X,Y,Z+60,Math.PI);box(2.4,1.2,1,lam('#2a2020'),0,1,0,c);for(const dx of[-0.7,0,0.7]){box(0.5,0.5,0.8,lam('#2a2020'),dx,1.9,0.8,c);}for(const dx of[-0.9,0.9])box(0.25,0.9,0.25,lam('#2a2020'),dx,0.45,0,c);fzSp('#ff4020',3,2,0.35,c,0,2,0.8);}
  {const d=divineFigure(X+6,Z+92,{female:true,chiton:'#3a2a4a',himation:'#5a2a3a',hair:'#2a1e16'},'#9a8ab0','Dido','',1);d.lb.visible=false;d.mk.visible=false;d.g.rotation.y=Math.PI/2;}
  for(let i=0;i<14;i++){const s=makePerson({chiton:'#6a7a8a',hair:'#3a4a5a',female:R()<0.5});s.position.set(X+rr(-10,10),Y,Z+rr(80,110));s.rotation.y=R()*TAU;scene.add(s);s.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=0.45;}});}
  fzSp('#ff3010',30,16,0.5,null,X-12,Y+6,Z+128);
  // los Campos Elíseos: verdes y luminosos, con su propio sol (VI 637-641)
  box(28,0.62,90,lam('#7ab060'),0,0,190,g);for(let i=0;i<18;i++){const t=grp(X+rr(-12,12),Y+0.3,Z+rr(150,232),0);box(0.4,2.4,0.4,lam('#6a5236'),0,1.2,0,t);const c=new THREE.Mesh(new THREE.SphereGeometry(1.6,8,6),lam('#8ac070'));c.position.y=3;t.add(c);}
  FZ.elys=fzSp('#fff0b0',40,40,0.9,null,X,Y+60,Z+300);
  {const a=divineFigure(X,Z+188,{chiton:'#f4efe4',himation:'#4a3a6a',beard:true,hair:'#d8d0c2'},'#e0f0ff','Anquises','',1.1);a.lb.visible=false;a.mk.visible=false;a.g.rotation.y=Math.PI;}
  {const p=grp(X,Y,Z+228,0);box(1,6,1,lam('#d8c890'),-4,3,0,p);box(1,6,1,lam('#d8c890'),-1.5,3,0,p);box(1,6,1,lam('#f4f0e8'),1.5,3,0,p);box(1,6,1,lam('#f4f0e8'),4,3,0,p);}
  {const sb=divineFigure(X+2.5,Z-38,{female:true,chiton:'#5a4a3a',himation:'#3a2a1e',hair:'#d8d0c2',veil:true},'#c0a0ff','La Sibila','',1);sb.lb.visible=false;sb.mk.visible=false;sb.g.rotation.y=Math.PI;FZ.sib=sb.g;}
  FZ.lights=[];
  const E=(dz,act,nm,sub,r,dx)=>egxObj(X+(dx||0),Z+dz,Y,act,nm,sub,r||4);
  E(-52,'fi:rama','Un árbol del bosque','algo brilla entre las hojas',3.5,4);E(-22,'fi:averno','El lago Averno','sin pájaros');E(2,'fi:vestibulo','El vestíbulo','las sombras de los males',5);E(23,'fi:caronte','Caronte','el barquero',4,-4);
  E(57,'fi:cerbero','Cerbero','el perro de tres cabezas',4);E(90,'fi:dido','Dido','en los Campos del Llanto',4,5);E(124,'fi:cruce','El cruce','Tártaro o Elíseos',5);E(150,'fi:proserpina','La puerta de Proserpina','deja aquí la rama',4);
  E(184,'fi:anquises','Anquises','el padre de Eneas',4);E(224,'fi:puertas','Las puertas del Sueño','de cuerno y de marfil',5);}
function infAct(o){const f=finz(),a=o.act,one=casaOpen('Σ',o.data.name,'Los Infiernos · Eneida VI'),B=$('dBody'),fin=()=>one('Cerrar',closeDialog);
  const st=f.sibSt||0,block=(need,msg)=>{if(st<need){B.innerHTML='<p>'+msg+'</p>';fin();return true;}return false;};
  const tp=(dz,yaw)=>{closeDialog();fzPut(FZ.X,6000+dz,yaw===undefined?Math.PI:yaw);};
  if(a==='fi:rama'){if(st>=1){B.innerHTML='<p>Ya llevas la rama de oro. En su lugar ha brotado otra, igual de dorada (VI 143-144).</p>';fin();return;}
    B.innerHTML='<p>Entre las hojas oscuras brilla una rama de oro, con hojas de oro que tintinean con el viento (VI 204-209). La Sibila dijo: si el destino te llama, se dejará coger con facilidad; si no, ni el hierro la arrancará (VI 146-148).</p>';
    one('Coger la rama',()=>{f.sibSt=1;save();if(FZ.bough)FZ.bough.visible=false;sfxCoin();B.innerHTML='<p>La rama se suelta sola en tu mano. El destino te llama. Ahora, al Averno.</p>';$('dOpts').innerHTML='';fin();},'quiz');fin();return;}
  if(a==='fi:averno'){B.innerHTML='<p>Un lago negro en el cráter de un volcán apagado, rodeado de bosque. Su aliento es tan pestilente que ningún pájaro lo sobrevuela: por eso los griegos lo llamaron Áornos, «sin pájaros» (VI 237-242). El Averno existe de verdad, junto a Cumas. Agripa lo convirtió en puerto militar hace un siglo.</p>';fin();return;}
  if(a==='fi:vestibulo'){B.innerHTML='<p>En la entrada del Orco viven el Llanto y las Preocupaciones, las Enfermedades, la triste Vejez, el Miedo, el Hambre, la Pobreza, la Muerte, el Trabajo, la Guerra y la Discordia, con su cabellera de serpientes (VI 273-281). En medio, un olmo enorme donde anidan los Sueños vanos.</p>';fin();return;}
  if(a==='fi:caronte'){if(block(1,'Caronte, sucio, con la barba blanca y los ojos de fuego, te cierra el paso. «Este es el lugar de las sombras. Los vivos no suben a mi barca». Necesitas la rama de oro.'))return;
    B.innerHTML='<p>En la orilla esperan las almas de los que no fueron enterrados: tendrán que vagar cien años antes de cruzar (VI 325-330). Caronte te mira con furia… hasta que la Sibila le enseña la rama de oro. Se calla, y te deja subir. La barca de cuero cruje bajo tu peso: no está hecha para los vivos (VI 413-414).</p>';
    one('Cruzar el río',()=>{if(f.sibSt<2){f.sibSt=2;save();}tp(42);},'quiz');fin();return;}
  if(a==='fi:cerbero'){if(block(2,'Todavía no has cruzado el río.'))return;
    B.innerHTML='<p>En la otra orilla, Cerbero, con sus tres cabezas, ladra tumbado en su cueva. La Sibila le tira una torta de miel con hierbas que dan sueño. Las tres bocas la devoran, y el monstruo se queda dormido, enorme, por todo el antro (VI 417-423).</p>';
    one('Pasar junto a Cerbero',()=>{if(f.sibSt<3){f.sibSt=3;save();}tp(72);},'quiz');fin();return;}
  if(a==='fi:dido'){B.innerHTML='<p>Entre los mirtos de los Campos del Llanto, donde vagan los que murieron por amor, ves a Dido, la reina de Cartago, con la herida todavía fresca. Eneas le habló llorando: «Me fui contra mi voluntad, reina». Ella no le contestó. Le dio la espalda y se marchó al bosque, con su primer marido, Siqueo (VI 450-476).</p>';fin();return;}
  if(a==='fi:cruce'){B.innerHTML='<p>El camino se divide. A la izquierda, detrás de una triple muralla rodeada por el Flegetonte, un río de fuego, está el Tártaro: se oyen gemidos, latigazos y cadenas. Ningún justo puede pisarlo (VI 548-563). A la derecha, el camino hacia el palacio de Dite y los Campos Elíseos.</p><p class="sub">La Sibila te lleva a la derecha.</p>';fin();return;}
  if(a==='fi:proserpina'){if(block(3,'Todavía no has llegado hasta aquí.'))return;
    B.innerHTML='<p>En la puerta del palacio de Dite, te purificas con agua fresca y clavas la rama de oro en el umbral: es el regalo para Proserpina (VI 628-636).</p>';
    one('Dejar la rama y entrar en los Elíseos',()=>{if(f.sibSt<4){f.sibSt=4;save();}tp(165);setTimeout(()=>toast('<span class="label">Los Campos Elíseos</span><br>Prados alegres, con su propio sol y sus propias estrellas. Busca a Anquises.'),400);},'quiz');fin();return;}
  if(a==='fi:anquises'){if(block(4,'Todavía no puedes llegar hasta aquí.'))return;
    B.innerHTML='<p>Anquises, el padre de Eneas, te recibe con los brazos abiertos. Tres veces intenta Eneas abrazarlo, y tres veces la sombra se le escapa de las manos, como el viento (VI 700-702).</p><p>Anquises le enseña las almas que esperan para nacer: Rómulo, los reyes, los Bruto, los Escipiones, César, y Augusto, que traerá de nuevo la edad de oro (VI 756-807). Y le dice lo que será Roma: «Tú, romano, recuerda que tu arte será gobernar a los pueblos, imponer la paz, perdonar a los vencidos y abatir a los soberbios» (VI 851-853).</p><p>Al final, un joven triste: Marcelo, el sobrino de Augusto, que morirá a los veinte años. Dicen que, cuando Virgilio leyó estos versos ante Augusto, la madre de Marcelo, Octavia, se desmayó.</p>';
    if(f.sibSt<5){f.sibSt=5;qAdd('so',2);save();}fin();return;}
  if(a==='fi:puertas'){if(block(5,'Antes de salir, habla con Anquises.'))return;
    B.innerHTML='<p>Hay dos puertas del Sueño. Por la de cuerno salen las sombras verdaderas; por la de marfil, los sueños falsos. Anquises despide a Eneas y a la Sibila por la de marfil (VI 893-898). Los lectores llevan dos mil años preguntándose por qué.</p>';
    one('Salir por la puerta de marfil',()=>{const first=!f.sib;f.sib=1;if(first){qAdd('eu',5,'Has bajado a los Infiernos como Eneas.');qAdd('kl',2);state.obols+=10;updateStats();sfxCoin();}save();closeDialog();
      fzGo('Sales por la puerta de marfil…','Despiertas en Cumas, junto al antro, con el sol de Campania en la cara.',()=>{const I=ISLANDS.find(q=>q.id==='campania');if(I&&I.town)fzPut(I.town.x-20,I.town.z+16,0);});
      setTimeout(()=>{const one2=casaOpen('Σ','Pius','La bajada de Eneas');$('dBody').innerHTML='<div class="curio"><span class="label">Pius</span><p>Has bajado a los Infiernos y has vuelto, como Eneas, el piadoso. Recibes diez sestercios. Tu epigrama: <i>«Bajó con la rama de oro y subió por la puerta de marfil»</i>.</p></div>';one2('Cerrar',closeDialog);$('dialog').hidden=false;},3800);},'quiz');fin();return;}}
// ======================================================== 4. KLÉOS: EL DECRETO (Atenas) Y EL ANFITEATRO (Roma)
function fDeeds(){const L=[];const c=state.cav,a=state.atal,f=finz();
  if(c&&c.done)L.push(MODE==='roma'?'recorrió el sueño de Escipión':'recorrió con Platón la caverna y volvió por los demás');
  if(a&&a.won)L.push(MODE==='roma'?'venció a Camila en la carrera':'venció a Atalanta en la carrera');
  if(f.gor)L.push('venció a Gorgias con la palabra');if(f.jui)L.push('venció a Régulo ante los centúnviros');if(f.eleu)L.push('fue iniciado en Eleusis hasta el grado de los que ven');if(f.sib)L.push('bajó a los Infiernos con la Sibila');
  if(state.olyKey)L.push('reunió los dones de las nueve Musas');if(state.zeusMet)L.push('fue recibido en el Olimpo');
  const fr=state.friends?Object.values(state.friends).filter(x=>x.p>=100).length:0;if(fr)L.push('es amigo íntimo de '+fr+' personalidades');
  if(state.lessons&&state.lessons.length)L.push('aprendió '+state.lessons.length+' lecciones de los sabios');
  return L;}
function decretoAct(){const f=finz(),P=pjz(),nm=P&&P.name?P.name:'el forastero';
  if(f.dec){finSeq('Ε','Eucles de Acarnas','Prítano de la tribu Eneida',[{t:'<p>«Tu estela ya está en el Ágora, junto al Bouleuterion. Y cada día tienes tu sitio en el Pritaneo. Pocos extranjeros han tenido tanto honor».</p>',btn:'Despedirse'}],closeDialog);return;}
  if(!finNeed('kl',10)){finSeq('Ε','Eucles de Acarnas','Prítano de la tribu Eneida',[{t:'<p>«La ciudad honra a quienes le hacen bien, sobre todo a los extranjeros: los nombra próxenos y benefactores, y lo graba en piedra. Pero para eso hace falta que toda Atenas conozca tu nombre».</p>'+fLack('kl','Conoce a mucha gente, cumple misiones y haz amistades.'),btn:'Despedirse'}],closeDialog);return;}
  const D=fDeeds();
  finSeq('Ε','Un decreto en tu honor','La Asamblea, en la Pnyx',[
   {h:'La propuesta',t:'<p>Eucles te cuenta que un consejero ha presentado al Consejo una propuesta para honrarte. El Consejo la ha aprobado como «decreto previo» (probouleuma) y hoy se vota en la Asamblea.</p>'},
   {h:'La Asamblea',t:'<p>En la Pnyx hay más de seis mil ciudadanos. El heraldo lee la propuesta: dice que '+nm+' '+(D.length?D.slice(0,5).join('; ')+'.':'ha hecho mucho bien a la ciudad.')+' Pregunta quién quiere hablar. Un viejo protesta: «¿Tanto honor para un extranjero?». Otro le contesta que la ciudad siempre ha sido generosa con sus benefactores.</p>'},
   {h:'La votación',t:'<p>El presidente pide la votación a mano alzada (cheirotonía). Un bosque de brazos se levanta. Los encargados ni siquiera necesitan contarlos: se aprueba.</p>'},
   {h:'El decreto',t:'<p class="sub">Así suenan los decretos grabados en piedra:</p><p><i>«Ha parecido bien al Consejo y al Pueblo. La tribu Eneida ejercía la pritanía. Presidía Eucles de Acarnas. Que se elogie a '+nm+' por su virtud y su buena disposición hacia el pueblo de los atenienses, y que se le corone con una corona de olivo. Que sea próxeno y benefactor (euergétes) del pueblo ateniense, él y sus descendientes. Que tenga derecho a poseer tierra y casa (énktesis). Que se le invite a comer en el Pritaneo. Que el secretario grabe este decreto en una estela de piedra y la coloque en el Ágora».</i></p>'},
   {h:'Los honores',t:'<p>La sítesis, comer cada día en el Pritaneo a cargo de la ciudad, era el honor de los vencedores olímpicos y de los descendientes de Harmodio y Aristogitón, los tiranicidas. La proxenía obligaba a cuidar de los atenienses en tu patria. Era lo más alto a lo que podía aspirar un extranjero, salvo la ciudadanía, que se concedía muy pocas veces.</p>',btn:'Ir a ver tu estela'}],
   ()=>{f.dec=1;qAdd('kl',6,'Atenas ha grabado tu nombre en piedra.');qAdd('lo',2);state.obols+=20;updateStats();sfxCoin();save();closeDialog();decretoStele(true);});}
function decretoStele(go){const f=finz();if(!f.dec||MODE!=='atenas'||PLACES.find(q=>q.id==='decreto_pj'))return;const o=npcObjs.find(q=>q.data&&q.data.id==='pritano');if(!o)return;
  const P=pjz(),nm=P&&P.name?P.name:'el forastero',D=fDeeds();const x=o.x+5,z=o.z+3;
  placeLive('decreto_pj','Decreto en honor de '+nm,'ΕΔΟΞΕΝ ΤΗΙ ΒΟΥΛΗΙ ΚΑΙ ΤΩΙ ΔΗΜΩΙ','Ha parecido bien al Consejo y al Pueblo: que se elogie a '+nm+', que '+(D.length?D.join('; '):'ha hecho mucho bien a la ciudad')+', y que se le corone con una corona de olivo. Que sea próxeno y benefactor del pueblo ateniense, que tenga derecho a casa y tierra y que coma en el Pritaneo. Que el secretario grabe este decreto en piedra y lo coloque en el Ágora.',x,z,0);
  if(go){fzPut(x+2,z+2,0);toast('<span class="label">Tu estela</span><br>Ahí está tu nombre, grabado en mármol, en el Ágora de Atenas.');}}
function coliseoAct(){const f=finz(),P=pjz(),nm=P&&P.name?P.name:'tú';
  if(f.col){finSeq('M','Marco Valerio Marcial','Poeta de epigramas',[{t:'<p>«Ya te escribí tu epigrama. ¿Quieres otro? Págamelo, que los poetas también comemos».</p>',btn:'Despedirse'}],closeDialog);return;}
  if(!finNeed('kl',10)){finSeq('M','Marco Valerio Marcial','Poeta de epigramas',[{t:'<p>«Estoy escribiendo un libro sobre los juegos del nuevo anfiteatro. Solo meto en él a gente famosa: el César, los cazadores, los gladiadores… ¿Tú? Todavía no».</p>'+fLack('kl','Conoce a mucha gente y cumple misiones.'),btn:'Despedirse'}],closeDialog);return;}
  const som=state.cav&&state.cav.done;
  finSeq('M','Los juegos inaugurales del Anfiteatro Flavio','Año 80 · cien días de juegos',[
   {h:'La invitación',t:'<p>Un esclavo imperial te trae una tablilla: el emperador Tito, que ha oído hablar de ti, te invita a su palco en la inauguración del anfiteatro que empezó su padre, Vespasiano. Marcial te acompaña: «Siéntate a mi lado y fíjate en todo. Tengo un libro que escribir».</p>'},
   {h:'El anfiteatro',t:'<p>Cincuenta mil personas, ordenadas por rangos: los senadores abajo, junto a la arena; los caballeros detrás; luego los ciudadanos con toga, y arriba del todo, las mujeres y los pobres. Un toldo enorme, el velum, da sombra. Marcial susurra: «Que Babilonia deje de presumir de sus murallas y Egipto de sus pirámides: todas las obras ceden ante el anfiteatro del César» (Libro de los espectáculos 1).</p>'},
   {h:'Las cacerías',t:'<p>Las fieras salen por trampillas desde los sótanos. Durante los juegos se mataron unos nueve mil animales, y hubo grullas que luchaban entre sí, elefantes y cazadoras mujeres (Dion Casio LXVI 25; Suetonio, Tito 7). El cazador Carpóforo mata un oso, un león y un leopardo seguidos. Marcial escribe deprisa en sus tablillas.</p><p class="sub">Hoy nos parece cruel, y muchos antiguos también lo pensaban: Séneca escribió que volvía de los juegos «más cruel e inhumano» (Cartas 7).</p>'},
   {h:'Prisco y Vero',t:'<p>Dos gladiadores, Prisco y Vero, luchan tanto rato y tan igualados que el público pide que los liberen a los dos. Tito, contra la regla, les da a los dos la espada de madera de la libertad y la palma de la victoria (Libro de los espectáculos 29).</p>'},
   {h:'Las bolas de madera',t:'<p>Desde lo alto, Tito lanza al público bolas de madera con un premio escrito: comida, ropa, plata, caballos, esclavos (Dion Casio LXVI 25, 5). Una cae en tus manos. Marcial se ríe: «Hasta la Fortuna te conoce ya».</p>'},
   {h:'Tu epigrama',t:'<p>Al salir, Marcial te da una tablilla. Es tu epigrama:</p><p style="text-align:center"><i>«Mira la arena del César, '+nm+', y no te asombres:<br>hoy la arena te mira a ti, y Roma te aplaude».</i></p>'+(som?'<p class="sub">Esa noche sueñas otra vez con el Africano, que señala la Tierra diminuta y sonríe: «¿Lo ves? Un punto. Disfrútalo, pero no te lo creas».</p>':''),btn:'Guardar la tablilla'}],
   ()=>{f.col=1;qAdd('kl',6,'Marcial te ha dedicado un epigrama.');qAdd('so',1);state.obols+=20;updateStats();sfxCoin();save();
     const one=casaOpen('M','Fama','Anfiteatro Flavio');$('dBody').innerHTML='<div class="curio"><span class="label">Fama</span><p>Tu nombre está en un epigrama de Marcial, y Marcial se lee en todo el imperio. Recibes veinte sestercios de tu bola de madera.</p></div><p class="sub">El Libro de los espectáculos de Marcial es real y se escribió para estos juegos; tu epigrama, claro, es del juego.</p>';one('Cerrar',closeDialog);$('dialog').hidden=false;});}
// ======================================================== 5. ENGANCHES: dónde aparecen, opciones, luz
function finSetup(){const ro=MODE==='roma';
  if(!ro){const I=ISLANDS.find(q=>q.id==='larisa');if(I&&I.town){const f=findFree(I.town.x+16,I.town.z-12,1);const g=makePerson({chiton:'#7a2a5a',himation:'#5a1a3a',beard:true,beardC:'#f0ece4',hair:'#f0ece4'});g.position.set(f[0],floorAt(f[0],f[1]),f[1]);g.rotation.y=R()*TAU;scene.add(g);egxObj(f[0],f[1],undefined,'fg:gorgias','Gorgias de Leontinos','sofista, casi centenario',3);}
    const p=PLACES.find(q=>q.id==='eleusinion');if(p){const f=findFree(p.x-6,p.z+4,1);const g=makePerson({chiton:'#f4efe4',himation:'#7a2a5a',beard:true,hair:'#d8d0c2'});g.position.set(f[0],floorAt(f[0],f[1]),f[1]);scene.add(g);egxObj(f[0],f[1],undefined,'fe:heraldos','Los heraldos de los Misterios','Eleusis',3);}
    decretoStele(false);}
  else{const I=ISLANDS.find(q=>q.id==='campania');if(I&&I.town){const f=findFree(I.town.x-26,I.town.z+20,1);const g=grp(f[0],floorAt(f[0],f[1]),f[1],0);box(5,4,3,lam('#a89878'),0,2,0,g);box(1.6,2.6,0.2,lam('#1a1410'),0,1.3,1.55,g);egxObj(f[0],f[1]+2.5,undefined,'fs:sibila','El antro de la Sibila','Cumas',3.4);}}}
function finOpts(n,add){const ro=MODE==='roma';
  if(ro&&n.id==='quintiliano')add('¿Tienes un caso para mí?','quiz',()=>{closeDialog();juicioAct();});
  if(ro&&n.id==='marcial')add('¿Me llevas a los juegos del anfiteatro?','quiz',()=>{closeDialog();coliseoAct();});
  if(!ro&&n.id==='pritano')add('¿Cómo honra la ciudad a los extranjeros?','quiz',()=>{closeDialog();decretoAct();});}
function finAct(o){const a=o.act;if(a==='fg:gorgias')return gorgiasAct();if(a==='fe:heraldos')return eleusisAct();if(a.startsWith('fe:'))return telAct(o);if(a==='fs:sibila')return sibilaAct();if(a.startsWith('fi:'))return infAct(o);}
function finTick(dt){if(!state)return;raceTick(dt);const z=fzIn();if(!z||z==='race'){if(FZ.ovr)fzRestore();return;}FZ.ovr=true;const F=scene.fog,t=performance.now()/1000;
  if(z==='tel'){sun.intensity=0;hemi.intensity=0.07;F.color.set('#050403');F.near=8;F.far=70;for(const L of FZ.lights||[])L.intensity=1.6*(0.9+Math.sin(t*9+L.position.x)*0.1);SKY.uniforms.top.value.set('#050403');SKY.uniforms.mid.value.set('#050403');SKY.uniforms.bot.value.set('#050403');STARS.material.opacity=0;return;}
  if(z==='inf'){if(SEA)SEA.visible=false;const lz=player.z-6000,ely=lz>155;STARS.material.opacity=ely?0.6:0;
    if(ely){sun.intensity=1.1;sun.color.set('#fff4d0');hemi.intensity=0.9;hemi.color.set('#e8ffe0');F.color.set('#d8ecd0');F.near=40;F.far=300;SKY.uniforms.top.value.set('#6a9ad0');SKY.uniforms.mid.value.set('#b8d8e8');SKY.uniforms.bot.value.set('#e0f0d8');}
    else{sun.intensity=0.08;hemi.intensity=0.22;hemi.color.set('#6070a0');hemi.groundColor.set('#101018');F.color.set('#0a0c14');F.near=10;F.far=90;SKY.uniforms.top.value.set('#05060a');SKY.uniforms.mid.value.set('#0a0c14');SKY.uniforms.bot.value.set('#0a0c14');}
    if(FZ.sib&&!ely){const tx=player.x+2.5,tz=player.z+3;FZ.sib.position.x+=(tx-FZ.sib.position.x)*Math.min(1,dt*1.5);FZ.sib.position.z+=(tz-FZ.sib.position.z)*Math.min(1,dt*1.5);FZ.sib.position.y=FZ.Y;}}}
// ============================================================ TODAS LAS ESFERAS DE SUEÑO: Hipnos (Atenas) y la casa del Sueño (Roma)
// Hesíodo, Teogonía 211-212 y 758-766; Ilíada XIV 231-291; Odisea XIX 560-569. Ovidio, Metamorfosis XI 592-649.
function dreamSpheres(){return EPI.spheres.map(s=>s.data);}
function dreamCount(){const L=dreamSpheres();return [L.filter(e=>epiDone(e)).length,L.length];}
function dreamCheck(){const[d,n]=dreamCount();if(!n||d<n||state.dreamAll)return;state.dreamAll=1;save();
  const go=()=>{if(ui!=='play'){setTimeout(go,800);return;}dreamFinale();};setTimeout(go,2500);}
function dreamFinale(){const ro=MODE==='roma',P=pjz(),nm=P&&P.name?P.name:'';
  const steps=ro?[
   {h:'La casa del Sueño',t:'<p>Esa noche no sueñas con nada: te sueñan a ti. Te encuentras junto a los cimerios, en una cueva hueca dentro de un monte, adonde nunca llega el sol. No canta ningún gallo ni ladra ningún perro: solo se oye el murmullo del Lete, el río del olvido. En la puerta crecen amapolas, y la Noche las recoge para esparcir su jugo sobre la tierra (Ovidio, Metamorfosis XI 592-607).</p>'},
   {h:'Somno y sus hijos',t:'<p>En el centro, sobre un lecho de ébano con plumas negras, duerme el dios Somno. A su alrededor flotan los Sueños vanos, tantos como espigas en un campo. Somno abre un ojo, pesado: «Así que tú eres quien ha visto todos los sueños que guardo en las esferas».</p><p>Te presenta a sus hijos: Morfeo, que imita como nadie la cara, la voz y los andares de las personas; Ícelo, al que los dioses llaman Fobétor, que se convierte en fieras y serpientes; y Fantaso, que se hace tierra, roca, agua o árbol (XI 633-643).</p>'},
   {h:'El regalo',t:'<p>«Has visto mis sueños de dioses y de héroes. Ahora Morfeo te visitará cada noche con un sueño verdadero: te dirá dónde está alguien que todavía no conoces».</p><div class="curio"><span class="label">Somniorum spectator</span><p>Has visto todas las esferas de sueño. Recibes veinticinco sestercios, y cada mañana Morfeo te dirá en sueños dónde encontrar a una persona que aún no conoces.</p></div>',btn:'Despertar'}]:[
   {h:'Hipnos',t:'<p>Esa noche no sueñas con nada: te sueñan a ti. Un joven con alas en las sienes se inclina sobre ti con una rama que gotea agua del Lete. Es Hipnos, el Sueño, hijo de la Noche y hermano de la Muerte. Hesíodo dice que recorre la tierra y el mar, tranquilo y suave con los hombres, mientras su hermano tiene el corazón de bronce (Teogonía 211-212 y 758-766).</p>'},
   {h:'Lemnos',t:'<p>«Una vez Hera vino a buscarme a Lemnos para que durmiera a Zeus mientras ella ayudaba a los griegos ante Troya. Me prometió por esposa a una de las Gracias. Lo dormí, y casi me cuesta caro» (Ilíada XIV 231-291). Se ríe. «Tú, en cambio, has entrado en todos mis sueños sin pedir permiso».</p>'},
   {h:'Las dos puertas',t:'<p>«Penélope lo sabía: hay dos puertas para los sueños. Los que salen por la de marfil engañan, y traen palabras que no se cumplen. Los que salen por la de cuerno pulido se cumplen, si un mortal los ve» (Odisea XIX 560-569). En griego, marfil (eléphas) suena a «engañar» y cuerno (kéras) a «cumplir».</p>'},
   {h:'El regalo',t:'<p>«Desde ahora, cada noche te enviaré un sueño por la puerta de cuerno: te diré dónde está alguien que todavía no conoces».</p><div class="curio"><span class="label">Oneiropólos</span><p>Has visto todas las esferas de sueño. Recibes veinticinco óbolos, y cada mañana Hipnos te dirá en sueños dónde encontrar a una persona que aún no conoces.</p></div>',btn:'Despertar'}];
  finSeq(ro?'S':'Υ',ro?'La casa del Sueño':'Hipnos, el Sueño','Has visto todas las esferas de sueño',steps,()=>{state.dreamGift=1;state.obols+=25;qAdd('so',3,'Has visto todos los sueños.');qAdd('eu',3);save();updateStats();sfxCoin();closeDialog();
    toast('<span class="label">'+(ro?'Somniorum spectator':'Oneiropólos')+'</span><br>Cada mañana tendrás un sueño verdadero.');});}
// cada día nuevo, un sueño verdadero: dónde está alguien que aún no conoces
let dreamDayLast=null;
function dreamTick(){if(!state||!state.dreamGift||ui!=='play')return;if(dreamDayLast===null){dreamDayLast=state.day;return;}if(state.day===dreamDayLast)return;dreamDayLast=state.day;
  const L=npcObjs.filter(o=>o.data&&o.data.where&&!(state.seen&&state.seen['m:'+o.data.id])&&!o.hidden);const ro=MODE==='roma';
  if(!L.length){toast('<span class="label">'+(ro?'Un sueño de Morfeo':'Un sueño por la puerta de cuerno')+'</span><br>Sueñas con todas las caras que ya conoces. No queda nadie por encontrar.');return;}
  const o=pick(L);toast('<span class="label">'+(ro?'Un sueño de Morfeo':'Un sueño por la puerta de cuerno')+'</span><br>Sueñas con '+o.data.name+(o.data.title?', '+o.data.title.charAt(0).toLowerCase()+o.data.title.slice(1):'')+'. Lo encontrarás '+o.data.where.charAt(0).toLowerCase()+o.data.where.slice(1).replace(/\.$/,'')+'.');}

