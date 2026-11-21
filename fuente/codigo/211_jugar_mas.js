// ============================================================ JUGAR MÁS: encargos del día, fama, imprevistos del camino, memoria, regateo,
// dos oficios nuevos, retos de foto y leyendas en grupo. Nada de esto obliga a nada: son razones para salir a la ciudad y al campo.
//  J3 Encargos del día: tres tareas cortas cada día de juego (ir a un sitio, hablar con gente, hacer un oficio, hacer una foto, reunir
//     orbes en una leyenda). Panel plegable arriba a la izquierda. Cada una paga un poco; las tres, algo más.
//  J4 Fama: la honra (158) y tu fama en el camino (ayudar o no) se notan: te saludan por la calle y los precios bajan (o suben).
//  J5 Imprevistos del camino (fuera de las ciudades): un carro volcado, un peaje de bribones, un viajero perdido, una tormenta, un rebaño.
//     Sin violencia: se resuelven ayudando, hablando, pagando o dando media vuelta.
//  J7 Memoria: lo que decides en el camino vuelve días después (el carretero que ayudaste, los bribones que te reconocen…).
//  J8 Aprender haciendo: para convencer a los bribones, orientar al viajero o regatear con un mercader hay que saber algo (preguntas
//     sobre lo que se ve y se aprende en el juego). Acertar con el mercader da un 10 % de descuento ese día.
//  J6 Oficios nuevos (177): la prensa de aceite y la ceca (acuñar moneda).
//  J9 Retos de foto: en el modo foto, una lista de cosas que fotografiar; al acertar, una ficha que explica lo fotografiado.
//  J10 Leyendas en grupo: en el modo en línea, los orbes que reúnen los compañeros en la misma leyenda cuentan para todos.
function jmz(){const s=state;if(!s.jm||typeof s.jm!=='object')s.jm={fama:0,mem:[],enc:null,regDay:0,fotos:{}};return s.jm;}
const JM={t:0,evT:120,greetT:0,ui:null,open:false};
function jmCoin(n){return n+' '+uxCoin(n);}
function jmDlg(glyph,name,title,html,opts){dlg={n:null};ui='dialog';releasePointer();$('dGlyph').textContent=glyph;setName(name,true);$('dTitle').textContent=title;$('dBody').innerHTML=html;
  const o=$('dOpts');o.innerHTML='';opts.forEach((p,i)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(i+1)+'</span><span>'+p[0]+'</span>';b.onclick=()=>{closeDialog();setTimeout(()=>{try{p[1]();}catch(e){console.warn(e);}},60);};o.appendChild(b);});$('dialog').hidden=false;}
function jmSay(html){jmDlg('·','','',html,[['Seguir',()=>{}]]);}
// ---- preguntas (J8): sobre lo que se ve y se aprende en el juego
const JM_Q={atenas:[['¿A qué diosa está dedicado el Partenón?','Atenea','Hera','Ártemis'],['¿Dónde se reúne la Asamblea de los atenienses?','En la Pnyx','En el Partenón','En el Cerámico'],
  ['¿Qué es un óbolo?','Una moneda pequeña de plata','Un tipo de vasija','Un barrio de Atenas'],['¿Quién enseña en la Academia?','Platón','Pericles','Homero'],['¿Qué puerto usa Atenas?','El Pireo','Corinto','Éfeso'],
  ['¿Qué dios es el mensajero de los dioses?','Hermes','Ares','Hefesto'],['¿De qué se hace el aceite?','De aceitunas','De uvas','De trigo'],['¿Cómo se llama la plaza del mercado y de la vida pública?','El ágora','El foro','La acrópolis'],
  ['¿Qué estilo tienen las columnas del Partenón?','Dórico','Corintio','Toscano'],['¿Quién forja en su fragua para los dioses?','Hefesto','Apolo','Dioniso'],['¿Qué es un hoplita?','Un soldado de infantería pesada','Un sacerdote','Un comerciante'],
  ['¿En qué fiesta se lleva el peplo nuevo a Atenea?','Las Panateneas','Las Saturnales','Las Lupercales']],
 roma:[['¿Quién gobierna Roma en el año 80?','El emperador Tito','Julio César','Augusto'],['¿Qué edificio inauguró Tito con cien días de juegos?','El anfiteatro Flavio','El Panteón','El Circo Máximo'],
  ['¿Qué es un sestercio?','Una moneda','Un barrio','Un tipo de túnica'],['¿Qué lleva el ciudadano romano en las ocasiones solemnes?','La toga','El himation','La clámide'],['¿Por dónde llega el agua a Roma?','Por los acueductos','Por el Tíber','En carros'],
  ['¿Qué diosa cuida el fuego sagrado de Roma?','Vesta','Venus','Minerva'],['¿Cómo se llama el mensajero de los dioses en Roma?','Mercurio','Marte','Vulcano'],['¿Qué río pasa por Roma?','El Tíber','El Arno','El Nilo'],
  ['¿Qué loba amamantó a los gemelos?','La loba del Lupercal','La loba del Capitolio de Atenas','Ninguna'],['¿Dónde se compran la carne y el pescado?','En el macellum','En la curia','En las termas'],
  ['¿Qué edificio enorme está dedicado al baño y al deporte?','Las termas','La basílica','El foro'],['¿Qué volcán sepultó Pompeya en el 79?','El Vesubio','El Etna','El Olimpo']]};
function jmQuiz(title,intro,ok,ko){const L=JM_Q[MODE==='roma'?'roma':'atenas'],q=L[Math.floor(Math.random()*L.length)],ans=[q[1],q[2],q[3]].sort(()=>Math.random()-0.5);
  jmDlg('?',title,'',intro+'<p><b>'+q[0]+'</b></p>',ans.map(a=>[a,()=>{if(a===q[1])ok(q);else ko(q);}]));}
// ---- J3: encargos del día
function jmPlaceTarget(){const L=(PLACES||[]).filter(p=>isFinite(p.x)&&Math.abs(p.x)<4000&&Math.abs(p.z)<4000&&p.name&&!/sueño|viajes|regiones/i.test(p.id+p.name));return L[Math.floor(Math.random()*L.length)];}
function jmNewDay(){const z=jmz(),d=state.day||1;if(z.enc&&z.enc.day===d)return;const pool=[];const P=jmPlaceTarget();
  if(P)pool.push({k:'ir',txt:'Ve a '+P.name,x:P.x,z:P.z});pool.push({k:'hablar',txt:'Habla con 3 personas',n:0,goal:3});pool.push({k:'oficio',txt:'Trabaja en un oficio (torno, forja, horno, prensa…)'});
  pool.push({k:'foto',txt:'Haz una foto de algo que te guste (modo foto)'});pool.push({k:'orbes',txt:'Reúne 5 orbes en el portal de las leyendas',n:0,goal:5});pool.push({k:'regateo',txt:'Regatea con un mercader (y acierta)'});
  const pick=[pool[0]].concat(pool.slice(1).sort(()=>Math.random()-0.5).slice(0,2));z.enc={day:d,list:pick.map(p=>Object.assign({done:false},p)),bonus:false};save();jmPanel();
  if(d>1)toast('<span class="label">Encargos de hoy</span><br>'+pick.map(p=>'· '+p.txt).join('<br>'));}
function jmDone(k,inc){const z=jmz();if(!z.enc)return;for(const e of z.enc.list){if(e.k!==k||e.done)continue;if(e.goal){e.n=(e.n||0)+(inc||1);if(e.n<e.goal){jmPanel();save();return;}}e.done=true;cyPay(3,'Encargo cumplido: '+e.txt);
    if(!z.enc.bonus&&z.enc.list.every(q=>q.done)){z.enc.bonus=true;setTimeout(()=>cyPay(4,'Los tres encargos del día'),1500);try{qAdd('so',1,'Cumples lo que te encargan.');}catch(e){}}save();jmPanel();return;}}
function jmPanel(){const z=state&&jmz();if(!JM.ui){const d=document.createElement('div');d.id='jmEnc';d.style.cssText='position:fixed;left:16px;top:118px;z-index:20;max-width:300px;background:rgba(26,20,14,.78);color:#f3e6c8;border:1px solid #6a5034;border-radius:8px;padding:4px 10px;font:14px/1.35 var(--text,system-ui);cursor:pointer;user-select:none';
    d.onclick=()=>{JM.open=!JM.open;jmPanel();};document.body.appendChild(d);JM.ui=d;}
  if(!z||!z.enc){JM.ui.hidden=true;return;}const L=z.enc.list,n=L.filter(e=>e.done).length;
  JM.ui.innerHTML='<b>Encargos de hoy</b> '+n+'/'+L.length+' '+(JM.open?'▴':'▾')+(JM.open?'<br>'+L.map(e=>(e.done?'✔ <s>':'· ')+e.txt+(e.goal&&!e.done?' ('+(e.n||0)+'/'+e.goal+')':'')+(e.done?'</s>':'')).join('<br>'):'');}
{const f=openDialog;openDialog=function(n){const r=f.apply(this,arguments);try{if(n&&n.id&&!(JM.talked||(JM.talked={}))[n.id]){JM.talked[n.id]=1;jmDone('hablar');}}catch(e){}return r;};}
{const f=mgPay;mgPay=function(k){const r=f.apply(this,arguments);try{jmDone('oficio');}catch(e){}return r;};}
{const f=phShot;phShot=function(){const r=f.apply(this,arguments);try{jmDone('foto');jmFotoCheck();}catch(e){}return r;};}
{const f=leySfx;leySfx=function(k){if(k==='orb')try{jmDone('orbes');}catch(e){}return f.apply(this,arguments);};}
// ---- J4: fama y saludos; precios
function jmRank(){try{return honRank(honScore());}catch(e){return 0;}}
{const f=trPrice;trPrice=function(g,where,sell){let p=f.apply(this,arguments);try{const z=jmz(),k=1-0.03*Math.min(5,jmRank())-(z.regDay===state.day?0.1:0)+(z.fama<=-2?0.12:0)-(z.fama>=3?0.05:0);p=sell?Math.round(p/Math.max(0.6,k)):Math.max(1,Math.round(p*k));}catch(e){}return p;};}
function jmGreet(){const z=jmz(),r=jmRank(),nm=(pjz&&pjz()&&pjz().name)||'';if(r<1&&z.fama<2&&z.fama>-2)return;
  const good=z.fama>-2,L=good?(MODE==='roma'?['¡Salve'+(nm?', '+nm:'')+'!','¡Ave! ¿Qué tal el día?','Mira, ese es '+(nm||'el forastero')+' del que hablan.']:['¡Khaire'+(nm?', '+nm:'')+'!','¡Salud! Que los dioses te acompañen.','Ese es '+(nm||'el forastero')+', el que ayuda a la gente.']):['(Alguien te da la espalda y murmura.)','(Un tendero hace como que no te ve.)'];
  toast('<span class="label">'+(good?'Te saludan':'Mala fama')+'</span><br>'+L[Math.floor(Math.random()*L.length)]);}
// ---- J5 + J7: imprevistos del camino y su memoria
function jmInCity(){const P=player;try{if(Math.abs(P.x)>4000||Math.abs(P.z)>4000)return true;return MODE==='roma'?romaInUrbs(P.x,P.z):insideWalls(P.x,P.z);}catch(e){return true;}}
function jmMem(k,extra){const z=jmz();z.mem.push(Object.assign({k,day:state.day||1,done:false},extra||{}));if(z.mem.length>20)z.mem.shift();save();}
const JM_EV={
 carro(){const ro=MODE==='roma';jmDlg('Κ',ro?'Un carretero':'Un carretero','Un carro volcado','<p>Un carro cargado de '+(ro?'ánforas de vino':'leña y aceitunas')+' ha volcado en una rodada del camino. El carretero, sudando, intenta levantarlo solo y la mula no deja de dar coces.</p>',
   [['Ayudarle a levantar el carro',()=>{const z=jmz();z.fama++;addHours&&addHours(0.5);jmMem('carro');jmSay('<p>Entre los dos enderezáis el carro. «¡Que '+(ro?'Mercurio':'Hermes')+' te guarde el camino! Me acordaré de ti.» Se te ha ido media hora, pero la gente del camino habla.</p>');}],
    ['Seguir tu camino',()=>{const z=jmz();z.fama=Math.max(-5,z.fama-1);jmSay('<p>Sigues adelante. A tu espalda el carretero suelta alguna palabra que no repetiremos.</p>');}]]);},
 peaje(){const ro=MODE==='roma';jmDlg('Λ','Dos bribones','Un peaje que no es de nadie','<p>Dos tipos con bastones te cortan el paso: «Por aquí se paga. '+jmCoin(2)+' y pasas tranquilo». No parecen muy listos.</p>',
   [['Pagar',()=>{state.obols=Math.max(0,state.obols-2);updateStats();save();jmMem('peaje',{pago:1});jmSay('<p>Pagas y te apartas. Tendrás que contarlo al magistrado: en '+(ro?'Roma los <i>tresviri capitales</i>':'Atenas los <i>Once</i>')+' se encargan de los ladrones.</p>');}],
    ['Hablar con ellos para que te dejen pasar',()=>jmQuiz('Los bribones','<p>«¿Ah, sí? Pues si eres tan listo, contesta esto…»</p>',()=>{jmMem('peaje',{listo:1});jmz().fama++;jmSay('<p>Se miran, se rascan la cabeza y se apartan riéndose: «Este sabe más que el maestro de mi sobrino». Pasas sin pagar.</p>');},
      q=>{state.obols=Math.max(0,state.obols-3);updateStats();save();jmSay('<p>«¡Ja! Era <b>'+q[1]+'</b>.» Te cobran '+jmCoin(3)+' por listillo.</p>');})],
    ['Dar media vuelta',()=>{const P=player;P.x+=Math.sin(P.yaw)*25;P.z+=Math.cos(P.yaw)*25;P.feet=floorAt(P.x,P.z);P.camY=P.feet+P.eye;jmSay('<p>Das media vuelta y buscas otro camino. Más vale perder un rato que la bolsa.</p>');}]]);},
 perdido(){jmQuiz('Un viajero perdido','<p>Un viajero con el polvo del camino hasta las cejas te para: «Disculpa, vengo de lejos y no sé nada de esta tierra. ¿Me ayudas?»</p>',
   ()=>{cyPay(2,'El viajero te da las gracias');jmMem('viajero');jmz().fama++;},q=>{jmSay('<p>El viajero duda: un vecino le dice que la respuesta era <b>'+q[1]+'</b>. Te despides algo avergonzado.</p>');});},
 tormenta(){const ro=MODE==='roma',Z=ro?'Júpiter':'Zeus';jmDlg('Ζ','El cielo','Se acerca una tormenta','<p>El cielo se oscurece de golpe sobre los montes y se oyen los primeros truenos. '+Z+' anda enfadado, dicen los campesinos. ¿Dónde te refugias?</p>',
   [['Bajo el olivo solitario del campo',()=>jmSay('<p>Un rayo cae cerca y se te ponen los pelos de punta. Los antiguos ya lo sabían: los árboles altos y solitarios atraen el rayo, y el lugar donde caía un rayo se consideraba sagrado y se cercaba ('+(ro?'el <i>bidental</i>':'el <i>enelýsion</i>')+'). Mejor un pórtico o una casa.</p>')],
    ['En un granero cercano',()=>{jmz().fama++;jmSay('<p>El granjero te deja pasar mientras llueve a cántaros. Bien elegido: bajo techo y lejos de árboles solitarios.</p>');}]]);},
 rebano(){jmDlg('Π','Un pastor','Un rebaño en el camino','<p>Un rebaño de cabras ocupa todo el camino. El pastor silba y los perros corren, pero las cabras van a su aire.</p>',
   [['Esperar con paciencia',()=>{addHours&&addHours(0.25);jmMem('pastor');jmSay('<p>Esperas. El pastor, agradecido, te da un trozo de queso de cabra envuelto en hojas de higuera. Te viene bien.</p>');}],['Abrirte paso entre las cabras',()=>jmSay('<p>Pasas entre empujones y balidos. Una cabra se come una punta de tu manto.</p>')]]);}};
function jmEvTick(dt){if(ui!=='play'||INT2.in||jmInCity())return;try{if(MOUNT.riding||FLY.on)return;}catch(e){}JM.evT-=dt;if(JM.evT>0)return;JM.evT=150+Math.random()*120;
  const ks=Object.keys(JM_EV),k=ks.filter(q=>q!==JM.last)[Math.floor(Math.random()*(ks.length-1))];JM.last=k;JM_EV[k]();}
// lo que vuelve (J7): una vez, otro día, al estar en la ciudad
function jmMemTick(){if(ui!=='play'||INT2.in||!jmInCity())return;const z=jmz(),d=state.day||1,m=z.mem.find(q=>!q.done&&q.day<d);if(!m)return;m.done=true;save();const ro=MODE==='roma';
  if(m.k==='carro'){cyPay(4,'El carretero que ayudaste');toast('<span class="label">Te reconocen</span><br>«¡Eh, tú! ¡El del carro!» El carretero que ayudaste en el camino te da una parte de lo que ganó en el mercado.');}
  else if(m.k==='peaje'&&m.listo)toast('<span class="label">Corren rumores</span><br>En la fuente cuentan que alguien dejó en ridículo a dos bribones del camino con una sola pregunta. Te miran con sonrisa.');
  else if(m.k==='peaje'&&m.pago)toast('<span class="label">Justicia</span><br>Los dos bribones del camino han sido detenidos: '+(ro?'los tresviri capitales':'los Once')+' los buscaban. Te devuelven lo que pagaste.'),state.obols+=2,updateStats();
  else if(m.k==='viajero')toast('<span class="label">Una carta</span><br>El viajero al que orientaste llegó bien: ha dejado recado de agradecimiento en la posada.');
  else if(m.k==='pastor')toast('<span class="label">El pastor</span><br>El pastor del camino vende quesos en el mercado y te guarda el mejor.');}
// ---- J8: el mercader regateador; J6: dos oficios nuevos
MG_SPOTS.atenas.push(['mercado',-12,-10,'mg:hag','Un mercader regateador','regatear (hay que saber algo)'],['agora',16,-14,'mg:mint','La ceca (argyrokopeion)','acuñar moneda'],['ceramico',-14,12,'mg:press','Una prensa de aceite','prensar aceitunas']);
MG_SPOTS.roma.push(['ro_macellum',12,-10,'mg:hag','Un mercader regateador','regatear (hay que saber algo)'],['ro_jupiter',-14,10,'mg:mint','La ceca de Juno Moneta','acuñar moneda'],['ro_appia',-12,8,'mg:press','Una prensa de aceite','prensar aceitunas']);
{const f=egxAct0;egxAct0=function(o){const a=String(o&&o.act);if(a==='mg:hag'){jmHaggle();return;}if(a==='mg:mint'){mgMint();return;}if(a==='mg:press'){mgPress();return;}return f.apply(this,arguments);};}
function jmHaggle(){const z=jmz();if(z.regDay===state.day){toast('<span class="label">El mercader</span><br>«Ya te hice precio hoy. ¡Vuelve mañana!»');return;}
  jmQuiz('Un mercader regateador','<p>«¿Rebaja? Te la hago si me demuestras que no eres un ignorante. A ver…»</p>',()=>{z.regDay=state.day;save();jmDone('regateo');jmSay('<p>«Bien dicho. Hoy te hago un <b>10 % de descuento</b> en todo lo que compres.»</p>');},
    q=>jmSay('<p>«Ja, era <b>'+q[1]+'</b>. Sin rebaja.» Mañana puedes volver a intentarlo.</p>'));}
function mgPress(){const ro=MODE==='roma';eduOverlay('mgBox','La prensa de aceite','<p>Las aceitunas se trituran en un molino de piedra y la pasta se apila en capachos de esparto bajo una viga larga: cargando el extremo de la viga, se aprieta despacio y sale el aceite. Si se aprieta de golpe, los capachos revientan.'+(ro?' Catón describe la prensa y su viga en su tratado del campo (De agri cultura 18-22).':' En el Ática el olivo es sagrado: el primero lo hizo brotar Atenea en la Acrópolis.')+'</p>'+mgBar('prs')+'<p id="prsS" class="sub"></p><div id="prsO"></div>');
  const K=$('prsK'),Z=$('prsZ'),S=$('prsS');Z.style.left='55%';Z.style.width='25%';let v=0,t=0,good=0,on=true,last=performance.now(),hold=false;
  const kd=e=>{if(e.code==='Space'){e.preventDefault();hold=true;}},ku=e=>{if(e.code==='Space')hold=false;};addEventListener('keydown',kd);addEventListener('keyup',ku);
  const b=mgBtn('Cargar la viga (mantener)',()=>{});b.onpointerdown=()=>hold=true;b.onpointerup=b.onpointerleave=()=>hold=false;$('prsO').appendChild(b);
  const step=now=>{if(!on||!$('mgBox')){removeEventListener('keydown',kd);removeEventListener('keyup',ku);return;}const dt=Math.min(0.05,(now-last)/1000);last=now;v=Math.max(0,Math.min(1,v+(hold?0.38:-0.26)*dt));t+=dt;if(v>0.55&&v<0.8)good+=dt;K.style.left=(v*100)+'%';
    S.textContent='Tiempo: '+(12-t).toFixed(1)+' s · aceite que cae: '+good.toFixed(1)+(v>=0.97?' · ¡cuidado, revientan los capachos!':'');
    if(v>=0.99){good=Math.max(0,good-dt*3);}
    if(t>=12){on=false;removeEventListener('keydown',kd);removeEventListener('keyup',ku);const q=good/12,coins=q>0.6?4:q>0.35?2:1;mgPay('press',q,coins);S.innerHTML='<b>'+(q>0.6?'Una tinaja de aceite limpio.':q>0.35?'Un poco de aceite, algo turbio.':'Poca cosa: has apretado a destiempo.')+'</b> +'+jmCoin(coins)+'.';return;}
    requestAnimationFrame(step);};requestAnimationFrame(step);}
function mgMint(){const ro=MODE==='roma';eduOverlay('mgBox','Acuñar moneda','<p>'+(ro?'En la ceca, junto al templo de Juno Moneta (de ahí viene «moneda»), el operario coloca el disco de metal (cospel) entre dos cuños y otro golpea el de arriba con un martillo. Hacia finales del siglo I la ceca se trasladó cerca del Coliseo.':'En la ceca de Atenas (el argyrokopeion, en una esquina del Ágora) se acuñan los tetradracmas de la lechuza con plata del Laurión: el cospel caliente va entre dos cuños y se golpea con un martillo.')+' Golpea cuando el cuño de arriba esté justo encima del cospel.</p>'+mgBar('mnt')+'<p id="mntS" class="sub"></p><div id="mntO"></div>');
  const K=$('mntK'),Z=$('mntZ'),S=$('mntS');Z.style.left='44%';Z.style.width='12%';let x=0,dir=1,n=0,hits=0,on=true,last=performance.now();
  const hit=()=>{if(!on)return;n++;if(x>0.44&&x<0.56){hits++;try{legSfx('clang');}catch(e){}}if(n>=6){on=false;removeEventListener('keydown',kd);const coins=hits>=5?4:hits>=3?2:1;mgPay('mint',hits/6,coins);
      S.innerHTML='<b>'+(hits>=5?'Monedas bien centradas: '+(ro?'el retrato del emperador se lee perfectamente.':'la lechuza de Atenea, nítida.'):hits>=3?'Algunas monedas salen descentradas, pero valen.':'Muchas monedas fallidas: van a refundirse.')+'</b> +'+jmCoin(coins)+'.';}};
  const kd=e=>{if(e.code==='Space'){e.preventDefault();hit();}};addEventListener('keydown',kd);$('mntO').appendChild(mgBtn('¡Golpe!',hit));
  const step=now=>{if(!on||!$('mgBox')){removeEventListener('keydown',kd);return;}const dt=Math.min(0.05,(now-last)/1000);last=now;x+=dir*dt*(0.75+n*0.08);if(x>1){x=1;dir=-1;}if(x<0){x=0;dir=1;}K.style.left=(x*100)+'%';S.textContent='Golpes: '+n+'/6 · bien centrados: '+hits;requestAnimationFrame(step);};requestAnimationFrame(step);}
// ---- J9: retos de foto
const JM_FOTO={atenas:[['partenon|Partenón','El Partenón','Templo dórico de Atenea Pártenos (447-432 a.C.), obra de Ictino y Calícrates con las esculturas de Fidias.'],['erecte|Erecteion|cariátide','El Erecteion','Templo jónico con el pórtico de las cariátides: seis muchachas de mármol que sostienen el techo.'],
  ['teatro','Un teatro','El teatro de Dioniso: en el 386 a.C. aún tiene gradas de madera y piedra; las de mármol son de Licurgo, hacia el 330.'],['pnyx|Pnyx','La Pnyx','La colina donde se reúne la Asamblea: miles de ciudadanos votan a mano alzada.'],['stoa|Stoa','Una stoa','Un pórtico largo con columnas: refugio del sol, lugar de negocios y de filósofos (los estoicos toman su nombre de una).'],['hefest|Hefest','El templo de Hefesto','El templo dórico mejor conservado de Grecia, sobre el barrio de los herreros.']],
 roma:[['coliseo|Anfiteatro','El anfiteatro Flavio','Inaugurado por Tito en el 80 con cien días de juegos (Suetonio, Tito 7; Dion Casio LXVI 25).'],['vesta|Vesta','El templo de Vesta','Templo redondo donde las vestales guardan el fuego que nunca se apaga.'],['acueducto|Acueducto','Un acueducto','Roma recibe cada día cientos de miles de metros cúbicos de agua por sus acueductos (Frontino, De aquaeductibus).'],
  ['arco|Arco','Un arco honorífico','Los arcos celebran victorias y personajes; el de Tito, en la Vía Sacra, se terminará poco después de su muerte (81 d.C.).'],['curia|Curia','La curia','La sede del Senado, en el Foro.'],['circo|Circo','El Circo Máximo','Las carreras de carros: hasta unas 150.000 personas mirando.']]};
function jmFotoCheck(){const z=jmz(),L=JM_FOTO[MODE==='roma'?'roma':'atenas'],cam=camera;cam.updateMatrixWorld();const fr=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse));
  for(const [re,name,txt] of L){if(z.fotos[name])continue;const R=new RegExp(re,'i');const hit=(PLACES||[]).find(p=>R.test(p.id+' '+p.name)&&Math.hypot(p.x-cam.position.x,p.z-cam.position.z)<160&&fr.containsPoint(new THREE.Vector3(p.x,floorAt(p.x,p.z)+4,p.z)));
    if(hit){z.fotos[name]=1;save();cyPay(2,'Reto de foto: '+name);setTimeout(()=>toast('<span class="label">Ficha · '+name+'</span><br>'+txt),1200);return;}}}
{const f=phToggle;phToggle=function(on){f.apply(this,arguments);try{if(PH.on&&$('phUI')&&!$('jmRetos')){const z=jmz(),L=JM_FOTO[MODE==='roma'?'roma':'atenas'],d=document.createElement('div');d.id='jmRetos';d.style.cssText='position:fixed;left:16px;bottom:110px;z-index:70;background:rgba(20,16,12,.8);color:#f3e6c8;border-radius:8px;padding:6px 10px;font:13px/1.4 var(--text,system-ui);pointer-events:none';
      d.innerHTML='<b>Retos de foto</b><br>'+L.map(q=>(z.fotos[q[1]]?'✔ ':'· ')+q[1]).join('<br>');document.body.appendChild(d);}if(!PH.on&&$('jmRetos'))$('jmRetos').remove();}catch(e){}};}
// ---- J10: leyendas en grupo (los orbes de los compañeros en la misma leyenda cuentan para todos)
{const f=netPresence;netPresence=function(force){try{if(typeof NET!=='undefined'&&NET.room){NET.q=NET.q||0;NET.ley=(typeof legIn==='function'&&legIn()&&LEY.on)?{k:LEY.kind,n:LEY.n}:null;}}catch(e){}return f.apply(this,arguments);};}
function jmNetLey(){if(typeof NET==='undefined'||!NET.room||!legIn()||!LEY.on)return 0;let s=0,m=0;try{for(const p of NET.room.peers()){if(p.sameTab)continue;const L=p.presence&&p.presence.ly;if(L&&L.k===LEY.kind){s+=Math.max(0,Math.min(LEY.GOAL,+L.n||0));m++;}}}catch(e){}LEY.mates=m;return s;}
// ---- cada fotograma
{const f=uxTick;uxTick=function(dt){f(dt);if(!state||ui==='start')return;try{
  JM.t+=dt||0;if(JM.t>1){JM.t=0;jmNewDay();jmPanel();if(JM.ui)JM.ui.hidden=!!(INT2.in&&typeof legIn==='function'&&legIn())||ui!=='play'&&ui!=='dialog';
    const z=jmz();if(z.enc)for(const e of z.enc.list)if(e.k==='ir'&&!e.done&&Math.hypot(e.x-player.x,e.z-player.z)<30)jmDone('ir');
    JM.greetT-=1;if(JM.greetT<=0&&jmInCity()&&!INT2.in&&ui==='play'){JM.greetT=70+Math.random()*60;jmGreet();}
    if(Math.random()<0.2)jmMemTick();
    const nn=jmNetLey();if(legIn()&&LEY.on){LEY.netN=nn;if(nn>0){LEY.extraNet='<span>Grupo +'+nn+' ('+LEY.mates+')</span>';}}}
  jmEvTick(Math.min(0.1,dt||0));}catch(e){if(!JM.err){JM.err=String(e&&e.stack||e).slice(0,300);console.warn('jugar mas',e);}}};}
