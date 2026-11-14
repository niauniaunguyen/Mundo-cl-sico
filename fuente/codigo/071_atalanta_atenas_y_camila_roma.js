// ============================================================ ATALANTA (Atenas) Y CAMILA (Roma): la carrera de la Areté máxima
// Atalanta: Ovidio, Metamorfosis X 560-707 (Hipómenes); Apolodoro III 9.2 (Melanión). Camila: Virgilio, Eneida VII 803-817 y XI 532-835.
// Atalanta corre más que nadie: sin las manzanas de Afrodita no se le puede ganar. A Camila sí, si administras bien el aliento.
function atz(){if(!state.atal||typeof state.atal!=='object')state.atal={met:0,apples:0,won:0,lost:0,debt:0,debtDay:0,thanked:0,lions:0};return state.atal;}
const ATAL={obj:null,fig:null};
function atalSetup(){const ro=MODE==='roma';let x,z;
  if(ro){const I=ISLANDS.find(q=>q.id==='campania');if(!I||!I.town)return;x=I.town.x+24;z=I.town.z-18;}
  else{const p=PLACES.find(q=>q.id==='estadio_olimpia');if(!p)return;x=p.x+7;z=p.z+5;}
  const f=findFree(x,z,1);x=f[0];z=f[1];
  const F=divineFigure(x,z,ro?{female:true,chiton:'#c9a86a',himation:'#6a3a2a',hair:'#3a2a1e'}:{female:true,chiton:'#e8dcc0',himation:'#5a6a3a',hair:'#b07a3a'},ro?'#f0e0c0':'#ffe0a0',ro?'Camila':'Atalanta',ro?'la virgen guerrera de los volscos':'la cazadora que nadie alcanza',1.08);
  F.g.rotation.y=R()*TAU;F.lb.visible=false;F.mk.visible=false;ATAL.fig=F;ATAL.obj=egxObj(x,z,undefined,'at:atalanta',ro?'Camila':'Atalanta',ro?'la virgen guerrera de los volscos':'la cazadora que nadie alcanza',3.2);}
// ---- diálogo
const ATAL_T=[
 ['¿Quién eres?','Atalanta. Mi padre quería un hijo y me dejó en el monte al nacer. Me amamantó una osa y me criaron unos cazadores. Desde entonces vivo con Ártemis: cazo, corro y no quiero marido. Unos dicen que soy de Arcadia, hija de Yaso; otros, que de Beocia, hija de Esqueneo. Los poetas no se ponen de acuerdo, y a mí me da igual.'],
 ['¿Estuviste en la caza de Calidón?','Fui la primera en herir al jabalí que Ártemis mandó contra Calidón: le clavé una flecha detrás de la oreja. Meleagro lo remató y me regaló la piel. Sus tíos no soportaron que la llevara una mujer, y aquello acabó en sangre. También luché con Peleo en los juegos fúnebres de Pelias, y le gané.'],
 ['¿Por qué retas a tus pretendientes?','Un oráculo me advirtió que no me casara. Así que puse una condición: me casaría con quien me ganara corriendo, y quien perdiera, moriría. Muchos lo intentaron. Sus cabezas adornaban la meta. Al final llegó uno, Hipómenes (o Melanión, según quién lo cuente), que me ganó con un truco… pero esa historia ya la sabrás.'],
 ['¿Corren las mujeres en Olimpia?','En los Juegos, no: a las casadas ni siquiera se les deja mirar. Pero cada cuatro años, en este mismo estadio, las muchachas corren en las Hereas, la fiesta de Hera. Corren con el pelo suelto y una túnica que no llega a las rodillas, con el hombro derecho al aire, en una pista más corta. La que gana se lleva una corona de olivo y parte de la vaca sacrificada a Hera (Pausanias V 16, 2-4). Y la espartana Cinisca acaba de ganar la carrera de cuadrigas, como dueña de los caballos.']];
const CAM_T=[
 ['¿Quién eres?','Camila, de los volscos. Mi padre, Métabo, era rey de Priverno y lo expulsaron. Huyó conmigo en brazos, perseguido, hasta un río crecido. Me ató a su lanza, me ofreció a Diana y me lanzó a la otra orilla. Crecí en los bosques, bebiendo leche de yegua, con una piel de tigre por vestido y una honda en la mano (Eneida XI 539-584).'],
 ['¿Es verdad que corres tanto?','Virgilio dice que podría pasar por encima de un trigal sin doblar las espigas, y correr sobre el mar sin mojarme los pies (Eneida VII 808-811). Exagera un poco. Solo un poco.'],
 ['¿Qué te pasó en la guerra?','Luché con Turno contra Eneas y sus troyanos, al frente de mis jinetes volscos. Maté a muchos. Me fijé demasiado en la armadura dorada de un sacerdote, y un tal Arrunte, que me seguía a escondidas, me alcanzó con su lanza. Diana lo castigó (Eneida XI 759-867). Ahora corro donde quiero.'],
 ['¿Y si te tiro manzanas de oro?','Ríe. «Eso es cosa de Atalanta, la griega. A mí no se me engaña con manzanas: si quieres ganarme, guarda el aliento para el final».']];
function atalAct(){const ro=MODE==='roma',a=atz(),one=casaOpen(ro?'C':'Α',ro?'Camila':'Atalanta',ro?'Heroína de la Eneida · Virgilio':'Heroína del mito · Ovidio y Apolodoro'),B=$('dBody'),T=ro?CAM_T:ATAL_T;
  if(!a.met){a.met=1;save();}
  const menu=msg=>{$('dOpts').innerHTML='';if(msg)B.innerHTML=msg;
    T.forEach(t=>one(t[0],()=>menu('<p>'+t[1]+'</p>')));
    const lv=qLv('ar'),q=ro?'Virtus':'Areté';
    one(a.won?'Correr otra vez':'Echarle una carrera',()=>{
      if(lv<10){menu('<p>'+(ro?'Camila':'Atalanta')+' te mira de arriba abajo. «Con esas piernas no me harías ni sudar. Vuelve cuando seas '+(ro?'la persona más rápida de Roma':'la persona más rápida de Grecia')+'».</p><p class="sub">Necesitas '+q+' 10 (tienes '+lv+'). Sube corriendo, cabalgando y tratando con atletas y soldados.</p>');return;}
      closeDialog();race3d(ro?MG_CAMILA:MG_ATAL);},'quiz');
    one('Despedirse',closeDialog);};
  menu('<p>'+(ro?'Una muchacha con una piel de tigre al hombro y una aljaba a la espalda te mira con descaro. Tiene las piernas de quien no ha parado de correr en su vida.':'Una muchacha alta, con el pelo recogido y una túnica corta de cazadora, estira las piernas junto a la meta. Brilla un poco, como los dioses: es una heroína de los mitos, no una mujer de este tiempo.')+'</p>'+
    (a.won?'<p>«Tú otra vez. Ya me ganaste una vez'+(ro?'':'… con ayuda')+'. ¿Quieres repetir?»</p>':a.lost?'<p>«¿Vienes a perder otra vez? Me gusta tu tozudez».</p>':'<p>«'+(ro?'Dicen que eres rápido. Yo he dejado atrás a los vientos.':'Dicen que eres la persona más rápida de Atenas. Yo nunca he perdido una carrera… limpia.')+'»</p>')+
    '<p class="sub">Correr contra una heroína del mito es una licencia del juego, como un sueño.</p>');}
// ---- el minijuego: una carrera de lado, administrando el aliento
function atalRace(rival){return{id:rival.id,title:rival.title,own:true,
 intro:rival.intro,ctl:'Corres solo. Mantén <b>W</b> (o la flecha arriba) para esprintar: gastas aliento. Al soltar, lo recuperas. Si lo agotas, te ahogas y te frenas.'+(rival.apples?' <b>Espacio</b>: lanzar una manzana de oro.':''),
 ctlT:'Mantén <b>Esprint</b> para acelerar: gasta aliento.'+(rival.apples?' <b>Manzana</b>: lánzala cuando la tengas cerca.':''),
 touch:rival.apples?[['KeyW','Esprint'],['Space','Manzana']]:[['KeyW','Esprint']],src:rival.src,first:rival.first,winT:rival.winT,failT:rival.failT,
 init(G){G.L=rival.L;G.pd=0;G.ad=0;G.b=100;G.tired=0;G.astop=0;G.apples=rival.apples?Math.min(3,atz().apples||0):0;G.used=0;G.sp=0;G.asp=0;G.ap=[];G.prevSp=false;G.res=null;G.lead=0;},
 tick(G,dt){const sprint=mgk('KeyW','ArrowUp')&&G.tired<=0,lv=qLv('ar');
   if(G.tired>0)G.tired-=dt;
   const tv=G.tired>0?6:sprint?12.5+0.05*lv:9+0.03*lv;G.sp+=(tv-G.sp)*Math.min(1,dt*3);
   if(sprint)G.b-=28*dt;else G.b=Math.min(100,G.b+(G.tired>0?18:12)*dt);if(G.b<=0){G.b=0;G.tired=1.8;mgSay('Te ahogas. Las piernas no responden.',1.6);}
   G.pd+=G.sp*dt;
   // la rival: ritmo constante, alguna aceleración, y se para por las manzanas
   if(G.astop>0){G.astop-=dt;G.asp*=0.85;}else{let v=rival.pace+Math.sin(G.t*0.9)*0.5;if(G.ad-G.pd>25)v-=0.8;if(G.pd-G.ad>3)v+=rival.kick;G.asp+=(v-G.asp)*Math.min(1,dt*2);}
   G.ad+=G.asp*dt;
   const thr=mgk('Space');if(thr&&!G.prevSp&&rival.apples){if(G.apples-G.used<=0)mgSay('No te quedan manzanas.',1.2);else{G.used++;const near=Math.abs(G.ad-G.pd)<16;G.ap.push({x:G.pd+2,y:0,vx:near?13:9,vy:-6,ok:near});
     if(near){G.astop=2.5;mgSay(['«Ella se asombra y, deseosa del fruto brillante, se aparta de la carrera y recoge el oro que rueda» (Metamorfosis X 666-667).','Lanzas la segunda hacia un lado: Atalanta se desvía para cogerla.','La tercera, con fuerza, lejos del camino. Ella duda… y va a por ella.'][Math.min(2,G.used-1)],3);}
     else mgSay('La manzana rueda lejos: Atalanta va demasiado por delante y ni la ve. Lánzala cuando la tengas cerca.',2.5);}}
   G.prevSp=thr;
   for(const p of G.ap){p.x+=p.vx*dt;p.vx*=0.985;p.vy+=20*dt;p.y+=p.vy*dt;if(p.y>0){p.y=0;p.vy*=-0.35;}}
   if(G.pd>=G.L&&!G.res)return G.ad<G.L?'win':'fail';if(G.ad>=G.L)return 'fail';return null;},
 draw(G,x){const t=G.t,cam=G.pd-30,k=2.1,sx=d=>(d-cam)*k;
   const sky=x.createLinearGradient(0,0,0,50);sky.addColorStop(0,rival.sky[0]);sky.addColorStop(1,rival.sky[1]);x.fillStyle=sky;x.fillRect(0,0,160,90);
   x.fillStyle=rival.hill;for(let i=-1;i<5;i++){const hx=((i*60-cam*0.3)%240+240)%240-40;x.beginPath();x.ellipse(hx,46,40,14,0,Math.PI,TAU);x.fill();}
   x.fillStyle='#8a9a6a';x.fillRect(0,46,160,8);for(let i=0;i<60;i++){const px=((i*13-cam*0.8)%170+170)%170-5;x.fillStyle=['#c8402a','#e8dcc0','#4a6a9a','#d8a040'][i%4];x.fillRect(px,47+(i%3)*2,1.4,2);}
   x.fillStyle=rival.track;x.fillRect(0,54,160,36);x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=0.3;x.beginPath();x.moveTo(0,70);x.lineTo(160,70);x.stroke();
   for(let m=0;m<=G.L;m+=50){const X=sx(m);if(X<-5||X>165)continue;x.fillStyle='rgba(255,255,255,.4)';x.fillRect(X,56,0.4,30);x.fillStyle='rgba(30,20,10,.6)';x.font='2.4px Georgia';x.fillText(Math.round((G.L-m))+'',X+0.8,88);}
   {const X=sx(G.L);x.fillStyle='#e8dcc0';x.fillRect(X-0.6,40,1.2,48);x.fillRect(X+5,40,1.2,48);x.fillRect(X-0.6,40,7,1.5);x.fillStyle='rgba(30,20,10,.8)';x.font='2.6px Georgia';x.fillText('META',X+0.4,38.5);}
   const runner=(d,lane,col,hair,fem,me)=>{const X=sx(d),Y=lane,ph=t*(me?G.sp:G.asp)*0.9,s=Math.sin(ph);x.strokeStyle=col;x.lineWidth=1.1;x.lineCap='round';
     x.beginPath();x.moveTo(X,Y-9);x.lineTo(X+1,Y-4);x.stroke();x.beginPath();x.moveTo(X+1,Y-4);x.lineTo(X+1+s*2.6,Y);x.moveTo(X+1,Y-4);x.lineTo(X+1-s*2.6,Y);x.stroke();
     x.beginPath();x.moveTo(X+0.4,Y-7.5);x.lineTo(X+0.4-s*2.2,Y-5);x.moveTo(X+0.4,Y-7.5);x.lineTo(X+0.4+s*2.2,Y-5.2);x.stroke();
     x.fillStyle=col;x.beginPath();x.moveTo(X-1.3,Y-8.6);x.lineTo(X+1.6,Y-8.6);x.lineTo(X+2.4,Y-4.6);x.lineTo(X-0.6,Y-4.6);x.fill();
     x.fillStyle='#c99a74';x.beginPath();x.arc(X,Y-10.4,1.25,0,TAU);x.fill();x.fillStyle=hair;x.beginPath();x.arc(X-0.3,Y-10.9,1.2,Math.PI,TAU);x.fill();if(fem){x.fillRect(X-1.8,Y-10.6,0.8,2.2);}
     if(me){x.fillStyle='#e8b07a';x.font='2.3px Georgia';x.textAlign='center';x.fillText('tú',X,Y-13);x.textAlign='left';}};
   for(const p of G.ap){x.fillStyle='#ffd040';x.beginPath();x.arc(sx(p.x),78+p.y*0.5-1,1.1,0,TAU);x.fill();x.fillStyle='rgba(255,240,160,.4)';x.beginPath();x.arc(sx(p.x),78+p.y*0.5-1,2.2,0,TAU);x.fill();}
   runner(G.ad,68,rival.col,rival.hair,true,false);const pf=pjFem();runner(G.pd,80,'#e8e4da','#3b2a1e',pf,true);
   if(G.astop>0){x.fillStyle='rgba(255,230,140,.9)';x.font='2.4px Georgia';x.textAlign='center';x.fillText('se para a recoger la manzana',sx(G.ad),53);x.textAlign='left';}},
 hud(G){const diff=G.pd-G.ad;return 'Aliento: <span style="display:inline-block;width:90px;height:9px;background:rgba(255,255,255,.2);vertical-align:middle"><span style="display:block;height:100%;width:'+G.b.toFixed(0)+'%;background:'+(G.tired>0?'#c0392b':'#7fb8d8')+'"></span></span> · Faltan <b>'+Math.max(0,Math.round(G.L-G.pd))+'</b> pasos · '+(diff>=0?'vas <b>'+diff.toFixed(0)+'</b> por delante':'te saca <b>'+(-diff).toFixed(0)+'</b>')+(rival.apples?' · Manzanas: <b>'+Math.max(0,G.apples-G.used)+'</b>':'');},
 after(G,res){return rival.after(G,res);}};}
const MG_ATAL=atalRace({id:'atalanta',L:420,pace:10.8,kick:0.6,apples:true,col:'#5a6a3a',hair:'#b07a3a',sky:['#9ec4e0','#f0e2c0'],hill:'#9aa878',track:'#c9a87a',
 title:'Una carrera contra Atalanta',
 intro:'<p>Atalanta se coloca en la línea de salida del estadio de Olimpia, a tu lado. «Nadie me ha ganado nunca corriendo limpio», dice. «Ni siquiera Hipómenes».</p><p>Ella es más rápida que tú: con piernas solo no basta. Gestiona el aliento: si esprintas sin parar, te ahogarás.</p>',
 src:'Ovidio, Metamorfosis X 560-707; Apolodoro, Biblioteca III 9, 2; Teognis 1287-1294. La carrera de Atalanta es un mito: correr contra ella es una licencia del juego.',
 first:'¡Ya! Atalanta sale como una flecha.',winT:'¡Has ganado a Atalanta!',failT:'Atalanta gana',
 after(G,res){const a=atz();
  if(res==='win'){const first=!a.won;a.won=1;if(G.used>0&&!a.thanked){a.debt=1;a.debtDay=state.day||1;}if(first){qAdd('kl',6,'Has vencido a Atalanta: tu nombre corre por toda Grecia.');qAdd('ar',4);state.obols+=10;}save();updateStats();sfxCoin();
    return '<p>Cruzas la meta antes que ella. Atalanta se queda mirando la manzana de oro que tiene en la mano, y luego te mira a ti. Por primera vez, sonríe. «Ganaste. Pero sabes, como yo, cómo lo has hecho».</p>'+(G.used>0?'<p><b>Ahora no olvides dar las gracias a Afrodita.</b> Hipómenes no lo hizo: no le llevó ni incienso ni una palabra. La diosa, ofendida, lo hizo arder de deseo en un santuario de Cibeles, y la diosa los convirtió a los dos en leones para tirar de su carro (Metamorfosis X 681-704).</p>':'')+
     (first?'<div class="curio"><span class="label">Corona de olivo</span><p>Recibes una corona de olivo y diez óbolos. Tu epigrama: <i>«Corrió contra Atalanta y llegó antes»</i>.</p></div>':'');}
  const first=!a.lost;a.lost=1;if(first){qAdd('ar',3,'Has corrido contra Atalanta. Has perdido, pero nadie te olvidará.');qAdd('kl',2);}save();updateStats();
  return '<p>Atalanta cruza la meta y se da la vuelta para verte llegar. No se burla: te ofrece la mano. «Has corrido bien. Muy bien. Pero nadie me gana corriendo limpio».</p>'+(a.apples?'<p class="sub">Tienes las manzanas de Afrodita: lánzalas (Espacio) cuando la tengas cerca, a poca distancia; si va muy por delante, no las verá.</p>':'<p class="sub">Hipómenes solo ganó porque rezó a Afrodita, y ella le dio tres manzanas de oro. Quizá debas hablar con la diosa, en los Jardines, junto al Iliso.</p>');}});
const MG_CAMILA=atalRace({id:'camila',L:420,pace:9.85,kick:0.3,apples:false,col:'#6a3a2a',hair:'#3a2a1e',sky:['#a8c8e0','#f2e6c8'],hill:'#8a9a6a',track:'#b89a6a',
 title:'Una carrera contra Camila',
 intro:'<p>Camila se ata las sandalias junto a un trigal del Lacio. «Hasta aquel olivo y vuelta… no, mejor solo hasta el olivo. No quiero que te desmayes».</p><p>Es muy rápida, pero se le puede ganar si administras el aliento: no esprintes todo el rato, y guarda fuerzas para el final.</p>',
 src:'Virgilio, Eneida VII 803-817 y XI 532-867. Camila es un personaje de la Eneida: correr contra ella es una licencia del juego.',
 first:'¡Ya! Camila sale descalza sobre la hierba.',winT:'¡Has ganado a Camila!',failT:'Camila gana',
 after(G,res){const a=atz();
  if(res==='win'){const first=!a.won;a.won=1;if(first){qAdd('kl',6,'Has vencido a Camila: tu nombre corre por todo el Lacio.');qAdd('ar',4);state.obols+=10;}save();updateStats();sfxCoin();
    return '<p>Llegas al olivo un paso antes que ella. Camila se ríe, sin aliento. «¡Por Diana! Nadie me había hecho sudar así desde los troyanos».</p>'+(first?'<div class="curio"><span class="label">Corona de olivo</span><p>Recibes una corona y diez sestercios. Tu epigrama: <i>«Corrió más que Camila, que corría más que el viento»</i>.</p></div>':'');}
  const first=!a.lost;a.lost=1;if(first){qAdd('ar',3,'Has corrido contra Camila.');qAdd('kl',2);}save();updateStats();
  return '<p>Camila te espera junto al olivo, apoyada en la lanza. «No está mal para alguien que duerme bajo techo. Guarda el aliento para el final: la carrera se gana en los últimos pasos».</p>';}});
// ---- Afrodita: las manzanas y el agradecimiento
function atalGodOpts(d,add){if(MODE!=='atenas'||d.id!=='afrodita')return;const a=atz();
  if(a.met&&!a.apples&&!a.won)add('Ayúdame a vencer a Atalanta',()=>{
    if(qLv('ar')<10){$('dBody').innerHTML='<p>Afrodita se ríe. «Antes de pedirme trampas, ponte en forma. Ni con mis manzanas la alcanzarías».</p><p class="sub">Necesitas Areté 10.</p>';renderGodOpts(d);return;}
    if(qLv('eu')<5){$('dBody').innerHTML='<p>«Hipómenes me rezó con humildad, y yo lo escuché. A ti apenas te he visto en mis altares». Afrodita se da la vuelta.</p><p class="sub">Necesitas Eusébeia 5.</p>';renderGodOpts(d);return;}
    a.apples=3;save();sfxCoin();$('dBody').innerHTML='<p>Afrodita sonríe. «En Chipre, en el campo de Támaso, hay un árbol de hojas doradas que brilla con ramas de oro. De allí traigo estas tres manzanas» (Metamorfosis X 644-651). Te las pone en las manos: pesan y brillan.</p><p>«Lánzalas cuando la tengas cerca. Y luego, acuérdate de mí».</p><div class="verdict">Tienes las tres manzanas de oro de Afrodita.</div>';renderGodOpts(d);},'quiz');
  if(a.debt)add('Darte las gracias por las manzanas',()=>{a.debt=0;a.thanked=1;qAdd('eu',3,'Has sido agradecido con Afrodita.');save();sfxCoin();$('dBody').innerHTML='<p>Quemas incienso y le das las gracias. Afrodita asiente, satisfecha. «Hipómenes no lo hizo. Tú sí. Por eso tú seguirás teniendo dos piernas y él camina a cuatro patas tirando del carro de Cibeles».</p>';renderGodOpts(d);},'quiz');}
// ---- si no le das las gracias, te pasa lo que a Hipómenes (en suave)
function atalTick(){if(!state||MODE!=='atenas')return;const a=state.atal;if(!a||!a.debt||a.lions)return;if((state.day||1)<a.debtDay+3)return;
  a.debt=0;a.lions=1;const Q=qz();Q.eu=Math.max(0,(Q.eu||0)-12);save();updateStats();
  toast('<span class="label">Afrodita está ofendida</span><br>No le diste las gracias por las manzanas. Esta noche sueñas que te crece una melena y que tiras del carro de Cibeles, como Hipómenes y Atalanta. Te despiertas sudando: has perdido parte de tu Eusébeia.');}

