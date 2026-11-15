// ============================================================ APRENDER HACIENDO (1): votar en la Asamblea (Atenas) y asistir al Senado (Roma)
// El contenido va dentro de la mecánica: para votar bien hay que entender el procedimiento y los argumentos.
// Atenas, 386 a.C.: la Asamblea se reúne en la Pnyx los días de Asamblea (151_diez_ideas.js, dzCivic). Purificación con un lechón, el heraldo pregunta «¿Quién quiere hablar?»,
// el Consejo trae un proboúleuma, se vota a mano alzada (cheirotonía) y los próedros juzgan la mayoría (Aristóteles, Const. de los atenienses 43-44; Esquines I 23; Aristófanes, Acarnienses 43-45).
// Roma, 80 d.C.: el Senado se reúne en calendas e idus; Augusto dejó que los hijos de senadores asistieran (Suetonio, Augusto 38.2). El cónsul hace la relatio, pide las sententiae por rango y se vota por discessio.
function asz(){if(!state.asm||typeof state.asm!=='object')state.asm={done:{},votes:0,ok:0};return state.asm;}
const AS_ISSUES={
 atenas:[
  {id:'paz',t:'La paz que manda el Rey',pb:'El Consejo trae a la Asamblea el texto que el sátrapa Tiribazo leyó en Sardes con el sello del Rey de Persia: las ciudades de Asia y Chipre serán del Rey; las demás ciudades griegas, autónomas; Lemnos, Imbros y Esciros seguirán siendo de Atenas. Quien no acepte, tendrá guerra con el Rey.',
   sp:[['Un orador del partido de la paz','«Atenienses: la flota de Antálcidas cierra el Helesponto. Sin el trigo del mar Negro, el pan sube cada día. La paz nos deja las islas y nos devuelve el trigo. Aceptémosla.»','si'],
       ['Un orador contrario a la paz','«¿Y los griegos de Jonia? ¿Y Evágoras de Chipre, nuestro amigo? Esta paz no es del Rey: es de Esparta, que la hará cumplir a su antojo. Votad que no.»','no']],
   q:'¿Qué votas?',hist:'si',
   end:'En la historia, Atenas aceptó la paz en el 387/386 a.C., agotada por la guerra y sin trigo. Se la llamó Paz del Rey o Paz de Antálcidas. Esparta la usó para imponerse en Grecia durante quince años.',
   src:'Jenofonte, Helénicas V 1, 25-36; Diodoro XIV 110.'},
  {id:'proxenia',t:'Honores para un mercader',pb:'El Consejo propone elogiar a Hegesandro de Quíos, que en el invierno trajo trigo al Pireo y lo vendió al precio de siempre cuando los demás lo subían: corona de olivo, título de próxeno y benefactor del pueblo ateniense, y su nombre en una estela en la Acrópolis.',
   sp:[['Un prítano, a favor','«Quien ayuda a la ciudad cuando el pan escasea merece que se sepa. Así otros mercaderes querrán venir a nuestro puerto.»','si'],
       ['Un viejo labrador, en contra','«¿Coronas para un extranjero que ya ganó dinero? Que le den las gracias y basta.»','no']],
   q:'¿Votas los honores?',hist:'si',
   end:'Este decreto es imaginado, pero del tipo que se conserva por decenas: Atenas honraba con la proxenía y con estelas a los extranjeros que la ayudaban, sobre todo con el trigo. El próxeno cuidaba de los atenienses en su ciudad.',
   src:'IG II² 1-100 (decretos de proxenía del siglo IV); Demóstenes XX 29-40 (honores a Leucón del Bósforo por el trigo).'},
  {id:'estrategos',t:'La elección de los estrategos',pb:'Hoy se eligen los diez estrategos del año. Es de los pocos cargos que no se sortean: la guerra pide gente que sepa.',
   sp:[['Partidarios de Cabrias','«Cabrias venció a los espartanos en Egina el año pasado: sabe mandar hoplitas y barcos.»','a'],
       ['Partidarios de Ifícrates','«Ifícrates destrozó una mora espartana con sus peltastas cerca de Corinto. ¡Nadie conoce mejor la guerra ligera!»','b']],
   q:'¿A quién das tu mano?',choices:[['Cabrias','a'],['Ifícrates','b'],['A los dos: hay diez puestos','c']],hist:'c',
   end:'Pregunta con trampa: se eligen diez estrategos y se puede votar a muchos. Cabrias e Ifícrates fueron elegidos estrategos de Atenas muchas veces a lo largo de su vida. Lo importante: los cargos que exigen pericia se votan; casi todos los demás, se sortean.',
   src:'Aristóteles, Const. de los atenienses 44, 4 y 61, 1; Jenofonte, Helénicas IV 5, 11-18 (Ifícrates en Lequeo) y V 1, 10-13 (Cabrias en Egina).'}],
 roma:[
  {id:'campania',t:'Ayuda para Campania',pb:'El cónsul hace la relatio: el año pasado el Vesubio sepultó ciudades de Campania. El emperador Tito propone que se elijan, entre los antiguos cónsules, unos curatores para reconstruir la región, y que los bienes de las víctimas que murieron sin herederos se usen para ello.',
   sp:[['Un consular, primero en opinar','«Padres conscriptos: que se nombren por sorteo entre los consulares, como quiere el príncipe, y que se haga ya.»','a'],
       ['Un senador joven','«Que los nombre el Senado votando a los más capaces.»','b']],
   q:'Tu padre te pregunta en voz baja: «¿Qué sententia crees que ganará?»',choices:[['La del sorteo entre consulares','a'],['La de votarlos','b']],hist:'a',
   end:'Suetonio cuenta que Tito sacó a suertes a los curatores entre los consulares y destinó a la reconstrucción los bienes de los muertos sin herederos. En el Senado del Imperio, lo que propone el príncipe casi siempre se aprueba.',
   src:'Suetonio, Tito 8, 3-4; Dion Casio LXVI 24.'},
  {id:'incendio',t:'Después del incendio',pb:'El cónsul informa del incendio de este año: tres días y tres noches; ardieron el templo de Júpiter en el Capitolio, el Panteón y muchos edificios. Se pregunta al Senado cómo reconstruir.',
   sp:[['Un senador','«Que paguen las ciudades de Italia, como en otras ocasiones.»','b'],
       ['Otro senador','«El príncipe ha dicho que cargará él con los daños: que se le den las gracias y se apruebe.»','a']],
   q:'¿Qué propuesta crees que se aprueba?',choices:[['Agradecer al príncipe, que paga','a'],['Que paguen las ciudades de Italia','b']],hist:'a',
   end:'Tito declaró que todo el daño correría de su cuenta: quitó los adornos de sus propias villas para los templos y edificios públicos. Votar en el Senado se hacía por discessio: los senadores se movían al lado del que había propuesto la sententia.',
   src:'Suetonio, Tito 8, 4; Dion Casio LXVI 24.'},
  {id:'quorum',t:'Cómo vota el Senado',pb:'Hoy hay pocos asuntos. El cónsul pide las sententiae en orden: primero los consulares, después los antiguos pretores, y así hacia abajo.',
   sp:[['Tu padre te explica','«¿Ves? Los jóvenes casi nunca llegan a hablar: cuando les toca, todo está decidido. Por eso se dice que son pedarii: votan con los pies.»','a']],
   q:'¿Por qué se llamaba pedarii a los senadores de menor rango?',choices:[['Porque votaban moviéndose de un lado a otro de la sala','a'],['Porque iban a pie a la Curia, y no en carro','b']],hist:'a',hist2:'b',
   end:'Las dos respuestas son antiguas. Aulo Gelio recoge que se llamaba así a los que no habían tenido una magistratura curul (e iban a pie, no en carro), y también que, sin turno para hablar, votaban «con los pies»: en la discessio caminaban hasta el lado de la propuesta que apoyaban.',
   src:'Aulo Gelio, Noches áticas III 18; Suetonio, Augusto 35 y 38.'}]};
function asNext(){const z=asz(),L=AS_ISSUES[MODE==='roma'?'roma':'atenas'];return L.find(i=>!z.done[i.id])||L[(state.day||1)%L.length];}
function asOpen(){const ro=MODE==='roma',C=dzCivic(),on=C&&clock.h>=C.h0&&clock.h<C.h1;
  if(!on){let d=0;for(let k=1;k<30;k++){const s=state.day;state.day=s+k;const c=dzCivic();state.day=s;if(c){d=k;break;}}
    vmS(ro?'S':'Ε',ro?'La Curia':'La Pnyx',ro?'el Senado no se reúne hoy':'hoy no hay Asamblea',ro?'<p>Las puertas de bronce de la Curia están cerradas. El Senado se reúne en las <b>calendas</b> y en los <b>idus</b> de cada mes, por la mañana.</p><p class="sub">Próxima sesión: dentro de '+d+' día'+(d>1?'s':'')+'. Ven entre la hora primera y la sexta.</p>'
      :'<p>La ladera está vacía: solo el viento y las piedras de la tribuna. La Asamblea se reúne unas cuarenta veces al año, al amanecer.</p><p class="sub">Próxima Asamblea: dentro de '+d+' día'+(d>1?'s':'')+', de las 6 a las 12 h.</p>',[vmBye]);return;}
  const I=asNext();asStep(I,0,null);}
function asStep(I,k,mine){const ro=MODE==='roma',gl=ro?'S':'Ε',nm=ro?'El Senado':'La Asamblea';
  if(k===0){vmS(gl,nm,I.t,(ro?'<p>Entras con tu padre: los hijos de senadores pueden escuchar desde un lado. Se ofrece incienso y vino en el altar de la Victoria; el cónsul toma los auspicios.</p>'
      :'<p>Los purificadores llevan un lechón alrededor de la asamblea y riegan su sangre. El heraldo maldice a quien engañe al pueblo. Recibes la ficha que te dará la paga: tres óbolos.</p>')+'<p><b>'+(ro?'Relatio del cónsul':'Propuesta del Consejo')+':</b> '+I.pb+'</p>',[['Seguir',()=>asStep(I,1,null)]]);return;}
  if(k===1){const btn=I.sp.map((s,i)=>['Escuchar: '+s[0],()=>{$('dBody').innerHTML='<p><b>'+s[0]+'</b></p><p>'+s[1]+'</p>';}]);
    if(!ro)btn.push(['Pedir la palabra tú (Lógos '+qLv('lo')+')',()=>asSpeak(I)]);btn.push(['Pasar a la votación',()=>asStep(I,2,mine)]);
    vmS(gl,nm,I.t,'<p>'+(ro?'El cónsul pide las sententiae por orden de rango.':'El heraldo pregunta: «<b>¿Quién quiere hablar?</b>» (Τίς ἀγορεύειν βούλεται;)')+'</p>',btn);return;}
  if(k===2){const ch=I.choices||[['Levantar la mano a favor','si'],['Levantar la mano en contra','no']];
    vmS(gl,nm,I.t,'<p>'+I.q+'</p>'+(ro?'':'<p class="sub">Se vota a mano alzada; los próedros calculan a ojo la mayoría.</p>'),ch.map(c=>[c[0],()=>asEnd(I,c[1],mine)]));}}
function asSpeak(I){const lv=qLv('lo'),good=lv>=3||Math.random()<0.35+lv*0.12;
  $('dBody').innerHTML='<p>Subes a la tribuna de piedra, el <b>bema</b>, y te pones la corona de mirto del orador.</p>'+(good?'<p>Hablas claro y breve; algunos asienten, otros silban. Has dicho lo que piensas ante seis mil ciudadanos.</p><p class="sub">+1 Lógos</p>':'<p>Te tiembla la voz; los arqueros escitas no llegan a bajarte, pero las risas te ahogan. Así le pasó a más de uno, cuenta Platón (Protágoras 319c).</p>');
  if(good)qAdd('lo',1,'Hablaste en la Asamblea');}
function asEnd(I,v,mine){const z=asz(),ro=MODE==='roma',first=!z.done[I.id];z.done[I.id]=1;z.votes++;const ok=v===I.hist||v===I.hist2;if(ok)z.ok++;save();
  if(first){qAdd('so',1,ro?'Asististe al Senado':'Votaste en la Asamblea');if(!ro){state.obols+=3;updateStats();}}
  vmS(ro?'S':'Ε',ro?'El Senado':'La Asamblea','resultado',(ro?(ok?'<p>¡Acertaste! La mayoría se pasa al lado de esa sententia.</p>':'<p>No: la mayoría se pasa al otro lado de la sala.</p>')
    :(v==='c'?'<p>Votas a los dos, como muchos otros.</p>':'<p>Levantas la mano. Los próedros miran la ladera y anuncian el resultado.</p>'))+'<p>'+I.end+'</p><p class="sub">Fuentes: '+I.src+(first&&!ro?' · +3 óbolos de paga':'')+'</p>',[vmBye]);}
// la tribuna de la Pnyx y la puerta de la Curia
function asSetup(){const ro=MODE==='roma';let x,z;if(ro){const p=PLACES.find(q=>q.id==='ro_curia');if(!p)return;const f=findFree(p.x,p.z+12,1);if(!f)return;[x,z]=f;}
  else{if(typeof PNYX==='undefined')return;const f=findFree(PNYX.x,PNYX.z-(PNYX.rz||20)*0.6,1);if(!f)return;[x,z]=f;}
  egxObj(x,z,undefined,'asm:open',ro?'La Curia':'La tribuna de la Pnyx',ro?'el Senado, en calendas e idus':'la Asamblea del pueblo',3.4);}
{const f=egxAct0;egxAct0=function(o){if(String(o.act).startsWith('asm:'))return asOpen();return f(o);};}
