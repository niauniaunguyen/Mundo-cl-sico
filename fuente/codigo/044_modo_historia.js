// ============================================================ MODO HISTORIA
// Diez capítulos guiados por época (STORY_ATENAS / STORY_ROMA). Cada capítulo: actores propios, pasos y escenas.
// Paso: {obj, at (ancla del rombo), npc|actor|sign|dream|go(+r)|auto, h (hora), scene:[líneas]}
// Línea: ['Quién','texto'] · ['','narración'] · {ask,a:[correcta,...],ok,ko} · {choose:[[opción,[líneas],marca]]} · {fn} · {if,then,else}
let STORY=null,storyActors=[],storyBusy=0;
const storyOn=()=>!!STORY&&!!state&&!!state.story;
function stAnchor(a){if(!a)return null;if(typeof a==='function')return a();if(Array.isArray(a))return{x:a[0],z:a[1]};
  const i=a.indexOf(':'),k=a.slice(0,i),id=a.slice(i+1);if(k==='npc')return npcAt(id);if(k==='place')return placeAt(id);
  if(k==='actor'){const o=storyActors.find(q=>q.id===id);return o?{x:o.x,z:o.z}:null;}return null;}
function spawnActor(A){const p=stAnchor(A.at);if(!p)return;const f=findFree(p.x+(A.dx||0),p.z+(A.dz||0),0.6);
  const g=makePerson(Object.assign({noVary:true},A.look));g.position.set(f[0],floorAt(f[0],f[1]),f[1]);g.rotation.y=A.rot||0;scene.add(g);
  const lb=labelSprite(A.name,A.title,true);lb.position.y=2.45;lb.visible=false;g.add(lb);const mk=markerSprite();mk.position.y=2.95;mk.visible=false;g.add(mk);
  storyActors.push({kind:'story',id:A.id,x:f[0],z:f[1],g,lb,mk,data:{name:A.name,role:A.title,glyph:A.glyph||A.name.charAt(0)}});}
function clearActors(){storyActors.forEach(a=>scene.remove(a.g));storyActors=[];}
const curChapter=()=>storyOn()?STORY[state.story.ch]||null:null;
const curStoryStep=()=>{const c=curChapter();return c?c.steps[state.story.st]||null:null;};
function stepAnchor(s){return s.at||(s.npc?'npc:'+s.npc:s.actor?'actor:'+s.actor:s.sign?'place:'+s.sign:s.go||null);}
function storyTarget(){const s=curStoryStep();return s?stAnchor(stepAnchor(s)):null;}
function storyStatus(){const c=curChapter(),s=curStoryStep();if(!c)return '';
  return '<b>Capítulo '+(state.story.ch+1)+' · '+c.title+'</b><br><span class="sub">'+(s?s.obj:'')+'</span>';}
function storyMarkers(){const s=curStoryStep();storyActors.forEach(a=>a.mk.visible=!!s&&s.actor===a.id);}
// abre el capítulo actual: tarjeta de presentación, actores y primer paso
function storyResume(fresh){
  clearActors();const c=curChapter();if(!c){storyFinale();return;}
  (c.actors||[]).forEach(spawnActor);storyMarkers();updateStats();
  if(fresh||state.story.st===0)storyCard(c);
}
function storyCard(c){
  ui='dialog';dlg={n:null,story:1};releasePointer();
  $('dGlyph').textContent=String(state.story.ch+1);setName('Capítulo '+(state.story.ch+1)+' de '+STORY.length+' · '+c.cat);$('dTitle').textContent=c.title;
  $('dBody').innerHTML='<p>'+c.intro+'</p><p class="sub">Objetivo: '+c.steps[0].obj+'</p>';
  const o=$('dOpts');o.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>Empezar</span>';
  b.onclick=()=>{closeDialog();const s=curStoryStep();if(s&&s.auto)storyFire();};o.appendChild(b);$('dialog').hidden=false;setTimeout(()=>b.focus({preventScroll:true}),30);
}
// los ganchos del juego preguntan si este gesto es el que espera la historia
function storyHook(kind,id){
  const s=curStoryStep();if(!s||storyBusy>performance.now())return false;
  if((kind==='npc'&&s.npc===id)||(kind==='actor'&&s.actor===id)||(kind==='dream'&&s.dream===id)){storyFire();return true;}
  return false;}
function storySignMatch(id){const s=curStoryStep();return !!s&&s.sign===id;}
let storyT=0;
function storyTick(dt){
  if(!storyOn()||ui!=='play')return;storyT+=dt;if(storyT<0.3)return;storyT=0;
  for(const a of storyActors)a.lb.visible=Math.hypot(a.x-player.x,a.z-player.z)<9;
  const s=curStoryStep();if(!s||storyBusy>performance.now())return;
  if(s.go){const p=stAnchor(s.go);if(p&&Math.hypot(p.x-player.x,p.z-player.z)<(s.r||12))storyFire();}
  else if(s.auto)storyFire();
}
function storyFire(){const s=curStoryStep();if(!s)return;if(s.h!==undefined){clock.h=s.h;updateSky();}playScene(s.scene||[],storyNext);}
// reproduce una escena en el cuadro de diálogo; al terminar llama a done
function playScene(lines,done){
  const L=lines.slice();ui='dialog';dlg={n:null,story:1};releasePointer();$('dialog').hidden=false;
  const btn=(txt,fn,k,cls)=>{const b=document.createElement('button');b.className=cls||'';b.innerHTML='<span class="n">'+k+'</span><span>'+txt+'</span>';b.onclick=fn;$('dOpts').appendChild(b);return b;};
  const say=(who,txt)=>{$('dGlyph').textContent=who?who.charAt(0):'§';setName(who||'Narración',!!who);$('dTitle').textContent=curChapter()?'Capítulo '+(state.story.ch+1)+' · '+curChapter().title:'';$('dBody').innerHTML='<p>'+txt+'</p>';};
  const step=()=>{
    $('dOpts').innerHTML='';const l=L.shift();
    if(l===undefined){closeDialog();storyBusy=performance.now()+800;done&&done();return;}
    if(Array.isArray(l)){say(l[0],l[1]);const b=btn(L.length?'Seguir':'Continuar',step,1);setTimeout(()=>b.focus({preventScroll:true}),30);return;}
    if(l.fn){l.fn();step();return;}
    if(l.if!==undefined){L.unshift(...((state.story.f[l.if]?l.then:l.else)||[]));step();return;}
    if(l.choose){say(l.who||'',l.txt||'¿Qué haces?');l.choose.forEach((c,i)=>btn(c[0],()=>{if(c[2])state.story.f[c[2]]=1;save();L.unshift(...(c[1]||[]));step();},i+1,'quiz'));return;}
    if(l.ask){say(l.who||'',l.ask);const opts=l.a.map((t,i)=>[t,i===0]).sort(()=>R()-0.5);
      opts.forEach((o,i)=>btn(o[0],()=>{if(o[1]){sfxCoin();L.unshift([l.who||'',l.ok]);step();}else{$('dBody').innerHTML='<p>'+l.ask+'</p><p class="sub">'+l.ko+'</p>';}},i+1,'quiz'));return;}
  };
  step();
}
function storyNext(){
  const c=curChapter();if(!c)return;state.story.st++;save();
  if(state.story.st<c.steps.length){storyMarkers();updateStats();const s=curStoryStep();if(s.auto)setTimeout(storyFire,400);
    else toast('<span class="label">Capítulo '+(state.story.ch+1)+'</span><br>'+s.obj);return;}
  // fin del capítulo
  state.obols+=5;sfxCoin();const done=state.story.ch;qAdd('kl',2);qAdd(npcQual({cat:c.cat}),2);state.story.done=Math.max(state.story.done||0,done+1);
  ui='dialog';dlg={n:null,story:1};releasePointer();
  $('dGlyph').textContent='✓';setName('Capítulo '+(done+1)+' completado · +5 '+(MODE==='roma'?'sestercios':'óbolos'));$('dTitle').textContent=c.title;
  $('dBody').innerHTML='<p>'+c.end+'</p><div class="curio"><span class="label">Lo que has aprendido · '+c.cat+'</span><p>'+c.learn+'</p></div>';
  const o=$('dOpts');o.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>'+(done+1<STORY.length?'Seguir con el capítulo '+(done+2):'Ver el final')+'</span>';
  b.onclick=()=>{closeDialog();state.story.ch=done+1;state.story.st=0;save();storyResume(true);};o.appendChild(b);$('dialog').hidden=false;
  save();updateStats();setTimeout(()=>b.focus({preventScroll:true}),30);
}
function storyFinale(){const F=MODE==='roma'?STORY_FIN_ROMA:STORY_FIN_ATENAS;
  ui='dialog';dlg={n:null,story:1};releasePointer();$('dGlyph').textContent='Ω';setName('Fin de la historia');$('dTitle').textContent=F.title;
  $('dBody').innerHTML=F.txt.map(t=>'<p>'+t+'</p>').join('');
  const o=$('dOpts');o.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>Seguir explorando libremente</span>';b.onclick=closeDialog;o.appendChild(b);$('dialog').hidden=false;}
function storyJournal(){const c=state.story;
  return '<p style="margin:0 0 12px;max-width:68ch;line-height:1.5">Modo Historia: '+(MODE==='roma'?'una familia de Herculano tras la erupción del Vesubio':'una familia de Acarnas que espera a un soldado que nunca volvió')+'. Sigue el rombo ◆ de la brújula y el objetivo de arriba a la izquierda.</p><div class="entries">'+
    STORY.map((ch,i)=>{const ok=i<(c.done||0),cur=i===c.ch;return '<div class="entry'+(ok||cur?'':' locked')+'"><span class="label">Capítulo '+(i+1)+' · '+ch.cat+(ok?' · completado ✓':cur?' · en curso':'')+'</span><h3>'+(ok||cur?ch.title:'Por descubrir')+'</h3><p>'+(ok?ch.learn:cur?(curStoryStep()?curStoryStep().obj:''):'Completa el capítulo anterior.')+'</p></div>';}).join('')+'</div>';}
// entrar en el modo Historia desde la pantalla de inicio (guarda aparte)
function startStory(){
  STORY=MODE==='roma'?STORY_ROMA:STORY_ATENAS;
  if(!/-historia$/.test(SAVE_KEY)){SAVE_KEY+='-historia';loadState();}
  state.steps._off=1;if(!state.story||typeof state.story.ch!=='number')state.story={ch:0,st:0,f:{},done:0};state.story.f=state.story.f||{};
  if(!state.pos){const p=stAnchor(STORY[0].start);if(p){const f=findFree(p.x,p.z,0.6);player.x=f[0];player.z=f[1];}}
  npcObjs.forEach(n=>{n.mk.visible=false;});signObjs.forEach(s=>{s.mk.visible=!state.places.includes(s.data.id);});
  storyHud=true;hudKey='';
  {const t=document.querySelector('#journal [data-tab="steps"]');if(t){const l=t.querySelector('.tl');if(l)l.textContent='Capítulos';else t.textContent='Capítulos';t.setAttribute('aria-label','Capítulos');t.title='Capítulos';}}
  startGame();storyResume(state.story.st===0);
}
// ---- Historia de Atenas: «La lechuza de bronce»
function storyTravel(a,dx,dz){const p=stAnchor(a);if(!p)return;const f=findFree(p.x+(dx||8),p.z+(dz||8),0.6);player.x=f[0];player.z=f[1];player.feet=floorAt(f[0],f[1]);player.camY=player.feet+player.eye;player.vy=0;}
const LK={abuelo:{chiton:'#d8cfc0',himation:'#6b5a3a',beard:true,hair:'#d8d0c2',beardC:'#e0d8cc',staff:true},
 madre:{female:true,chiton:'#e2d6c0',himation:'#5a6a7a',veil:true,hair:'#5b4532'},
 traso:{chiton:'#f3eee2',himation:'#7a2a4a',beard:true,hair:'#2b1f17'},
 padre:{exomis:true,chiton:'#8a7a5a',beard:true,hair:'#4a3a2a',staff:true}};
const STORY_ATENAS=[
 {cat:'Política',title:'Una voz en la Asamblea',start:'npc:pritano',
  intro:'Tienes quince años y vienes de Acarnas, una aldea del Ática a tres horas de camino. Tu padre, Eudemo, murió en la guerra contra Esparta cuando eras niño; al menos, eso te dijeron. Ahora vuestro vecino, el rico Trasónides, quiere quedarse con la tierra de tu abuelo. Tu abuelo te ha traído a la ciudad para pedir ayuda.',
  actors:[{id:'abuelo',name:'Arquipo',title:'Tu abuelo',look:LK.abuelo,at:'npc:pritano',dx:5,dz:3},{id:'traso',name:'Trasónides',title:'Vuestro vecino',look:LK.traso,at:'place:bema',dx:6,dz:4}],
  steps:[
   {obj:'Escucha a tu abuelo',auto:true,h:9,scene:[['','El Ágora hierve de gente: vendedores, esclavos con cántaros, ciudadanos que discuten a la sombra de los pórticos. Tu abuelo se apoya en su bastón, sin aliento.'],
    ['Arquipo','Ya no tengo piernas para esto. Escúchame bien: Trasónides dice que le debo dos mil dracmas y que, si no le pago antes del verano, la tierra será suya. Esa tierra la plantó mi padre, olivo a olivo.'],
    ['Arquipo','En esta ciudad nadie es dueño de otro, ni siquiera un rico. Ve a la Tholos, el edificio redondo, y habla con Eucles, el prítano. Él sabrá decirte qué puede hacer un ciudadano pobre contra uno rico.']]},
   {obj:'Habla con Eucles, el prítano, junto a la Tholos',npc:'pritano',scene:[['Eucles','¿Una disputa por una tierra? Eso lo deciden los tribunales, no yo. Pero antes, muchacho, aprende cómo funciona tu ciudad.'],
    ['Eucles','Cada año se sortean quinientos consejeros, cincuenta por tribu. Este mes nos toca a los de mi tribu presidir: comemos aquí, en la Tholos, y siempre hay alguno despierto, de día y de noche. Preparamos lo que se votará en la Asamblea.'],
    {who:'Eucles',ask:'¿Quién puede hablar en la Asamblea de la Pnyx?',a:['Cualquier ciudadano varón adulto que quiera','Solo los ricos que pagan impuestos','Solo los miembros del Consejo'],ok:'Exacto. El heraldo pregunta «¿Quién quiere hablar?», y cualquier ciudadano puede subir a la tribuna: lo llamamos isegoría, igualdad de palabra.',ko:'No. Piensa en lo que pregunta el heraldo: «¿Quién quiere hablar?». No pregunta cuánto dinero tienes.'},
    ['Eucles','Mañana hay Asamblea. Sube a la Pnyx, la colina al suroeste. Tu vecino Trasónides suele hablar allí: le gusta que lo vean.']]},
   {obj:'Sube a la colina de la Pnyx y acércate a la tribuna',go:'place:bema',r:20,h:8,scene:[['','Miles de ciudadanos sentados en la ladera. El heraldo alza la voz: «¿Quién quiere hablar?». Sube un hombre de manto granate y anillos de oro. Es Trasónides.'],
    ['Trasónides','Atenienses: os propongo que la ciudad pague más a los que mantienen las naves. ¡Los ricos sostenemos esta ciudad!'],
    ['','La gente murmura. Unos aplauden y otros silban. Te dan ganas de subir a la tribuna y decir lo que os hace.'],
    {choose:[['Intentar subir a la tribuna',[['Un arquero escita','¡Quieto, chaval! Para hablar aquí tienes que tener dieciocho años y estar inscrito en el registro de tu demo. Vuelve dentro de tres años.']],'impulsivo'],['Esperar y observar',[['','Te fijas en cómo habla: sabe cuándo levantar la voz, cuándo hacer reír, cuándo callar. Hablar en público es un arte, y él lo domina.']],'paciente']]}]},
   {obj:'Habla con Trasónides, junto a la tribuna',actor:'traso',scene:[['Trasónides','Vaya, el nieto de Arquipo. Te pareces a tu padre, ¿lo sabías? Lástima lo que le pasó.'],
    ['Trasónides','Tu abuelo me pidió dos mil dracmas hace siete años. Yo se las presté, como buen vecino. Tengo el mojón con la deuda clavado en vuestra tierra y testigos. No es nada personal: es la ley.'],
    ['','Sonríe, pero sus ojos no sonríen. Cuando se va, te das cuenta de que no te ha dicho para qué pidió tu abuelo aquel dinero.']]}],
  end:'Has visto la democracia ateniense por dentro: ruidosa, abierta y desigual. Cualquiera puede hablar, pero no todos saben hacerlo. Y has descubierto una pregunta que nadie te contesta: ¿para qué necesitaba tu abuelo dos mil dracmas?',
  learn:'En la Atenas del siglo IV el Consejo de los Quinientos, elegido por sorteo, prepara los asuntos, y la Asamblea de todos los ciudadanos varones adultos los vota en la Pnyx. La isegoría permite hablar a cualquiera, pero las mujeres, los extranjeros (metecos) y los esclavos no participan.'},
 {cat:'Vida cotidiana y mujeres',title:'Noticias en la fuente',
  intro:'En Atenas, las noticias no corren por la Asamblea, sino por las fuentes. Allí las mujeres se encuentran cada mañana, llenan sus cántaros y se cuentan lo que los hombres no dicen en público. La prima de tu madre, Mirrina, vive junto a la fuente del Ágora.',
  actors:[{id:'madre',name:'Filia',title:'Tu madre',look:LK.madre,at:'npc:aguadora',dx:4,dz:4,rot:Math.PI}],
  steps:[
   {obj:'Habla con Mirrina, en la fuente del sureste del Ágora',npc:'aguadora',h:7,scene:[['Mirrina','¡Pero si eres el hijo de Filia! Cómo has crecido. Ven, ayúdame con el cántaro, que pesa como un buey.'],
    ['Mirrina','Una mujer honrada casi no sale de casa, dicen los hombres. Pero ¿quién trae el agua? ¿Quién va a las fiestas de Deméter, a los funerales, a las bodas? Nosotras lo sabemos todo.'],
    ['Mirrina','Lo del préstamo… Tu abuelo pidió ese dinero en el año en que dijeron que tu padre estaba prisionero en Corinto. Era para pagar su rescate. Trasónides se ofreció a llevarlo él mismo. Volvió diciendo que llegó tarde: que tu padre había muerto.'],
    {who:'Mirrina',ask:'En una familia ateniense, ¿quién representa legalmente a una mujer?',a:['Su kyrios: el padre, el marido o el pariente varón más cercano','Ella misma, si es mayor de edad','La sacerdotisa de Atenea'],ok:'Así es. Una mujer no puede firmar contratos importantes ni ir a juicio por sí misma: lo hace su kyrios, su «señor» o tutor.',ko:'No. Aunque las mujeres llevan la casa, la ley exige que un hombre de la familia las represente.'}]},
   {obj:'Lee la estela del mojón del Ágora (horos)',sign:'horos',scene:[['Mirrina','¿Ves ese mojón? Marca el límite del Ágora. En el campo se usan otros parecidos para marcar las deudas: «Horos de la tierra empeñada a Fulano por tantas dracmas». Si no pagas, la tierra pasa al acreedor.'],
    ['Mirrina','Y mira quién viene por ahí…']]},
   {obj:'Habla con tu madre, que ha venido a la ciudad',actor:'madre',scene:[['Filia','No podía quedarme en casa esperando. Tu abuelo no duerme. Y yo tampoco.'],
    ['Filia','Toma. Tu padre talló esta lechuza de bronce antes de irse a la guerra. Dijo que era para ti, para que Atenea te cuidara mientras él no estaba. Yo la he guardado siete años.'],
    ['','La lechuza cabe en tu mano. Tiene una muesca en un ala, como si alguien la hubiera mordido sin querer.'],
    {choose:[['Prometerle que descubrirás la verdad',[['Filia','No prometas lo que no depende de ti. Promete solo que volverás.']],''],['Preguntarle si cree que tu padre vive',[['Filia','Cada noche me digo que no. Y cada mañana miro el camino.']],'esperanza']]}]}],
  end:'Mirrina te ha dado la primera pista: la deuda era el rescate de tu padre, y fue Trasónides quien lo llevó a Corinto. Llevas al cuello la lechuza de bronce.',
  learn:'La vida de las atenienses giraba en torno al oikos, la casa. No votaban ni podían ir a juicio, y dependían de un kyrios. Pero dirigían el hogar y la economía doméstica, tenían un gran papel en la religión (fiestas, funerales, sacerdocios) y lugares de encuentro propios, como las fuentes.'},
 {cat:'Economía',title:'El banquero que fue esclavo',
  intro:'Si Trasónides prestó dinero, quizá quede algún rastro en un banco. El banquero más rico de Atenas, Pasión, empezó su vida como esclavo en esa misma mesa de cambio que hoy es suya.',
  actors:[{id:'formion',name:'Formión',title:'Esclavo y ayudante de Pasión',look:{chiton:'#c9b48b',short:true,noHimation:true,hair:'#3b2a1e'},at:'place:mercado',dx:5,dz:3}],
  steps:[
   {obj:'Habla con Pasión, el banquero',npc:'pasion',scene:[['Pasión','Los bancos guardamos dinero, cambiamos monedas de otras ciudades y prestamos con interés. Y lo apuntamos todo, muchacho. Todo.'],
    ['Pasión','Ese préstamo no pasó por mi mesa: fue entre vecinos. Pero hay algo extraño… Desde hace tres años, alguien viene cada mes y deposita veinte dracmas a nombre de Arquipo de Acarnas. Nunca deja su nombre. Firma con un dibujo: una lechuza.'],
    ['','Te tiemblan las manos. Sacas la lechuza de bronce. Pasión la mira largo rato.'],
    ['Pasión','El dibujo tiene una muesca en el ala, como esta. Habla con Formión, en el mercado: él atiende a ese hombre.']]},
   {obj:'Lee la estela del mercado del Ágora',sign:'mercado',scene:[
    {who:'',ask:'¿De dónde sale la plata de las lechuzas, las monedas de Atenas?',a:['De las minas del Laurion, en el sur del Ática','Del tributo de Persia','De Egipto, a cambio de aceite'],ok:'Exacto: las minas del Laurion, donde trabajan miles de esclavos en condiciones durísimas.',ko:'Piensa en el Ática: al sur, cerca del cabo Sunion, hay unas minas famosas.'}]},
   {obj:'Busca a Formión en el mercado',actor:'formion',scene:[['Formión','¿El de la lechuza? Viene a primera hora. Cojea de la pierna izquierda y huele a cola y a pintura, como los que trabajan en los talleres. Habla poco. Una vez le pregunté su nombre y dijo: «Llámame Doro».'],
    ['Formión','Yo también soy esclavo, ¿sabes? Mi amo Pasión lo fue. Dice que, si trabajo bien, un día seré libre y quizá dirija el banco. En esta ciudad pasan esas cosas, a veces.']]}],
  end:'Alguien está pagando en secreto la deuda de tu abuelo, firma con la lechuza que tu padre talló y cojea de la pierna izquierda. No te atreves a decir en voz alta lo que piensas.',
  learn:'Atenas tenía una economía monetaria avanzada: bancos (trapezai) que cambiaban monedas, guardaban depósitos y prestaban con interés. La plata del Laurion, extraída por esclavos, acuñaba las famosas lechuzas. Algunos esclavos de banqueros, como Pasión, llegaron a ser libres y ricos.'},
 {cat:'Religión',title:'La ofrenda de la lechuza',
  intro:'Los atenienses dan las gracias a los dioses con ofrendas: vasos, estatuillas, relieves. En la Acrópolis se guardan miles, y los tesoreros de Atenea apuntan cada una en sus inventarios. Si tu padre volvió vivo, quizá se lo agradeció a la diosa.',
  steps:[
   {obj:'Sube a la Acrópolis y lee la estela del olivo de Atenea',sign:'olivo',scene:[['','El olivo sagrado se agita con el viento. Dicen que es el que la diosa hizo brotar cuando ganó Atenas en su disputa con Poseidón.']]},
   {obj:'Habla con Teano, sacerdotisa de Atenea Polias',npc:'sacerdotisa',scene:[['Teano','La diosa protege a esta ciudad desde antes de que hubiera reyes. Yo cuido su imagen de madera de olivo, la más sagrada, y su lámpara de oro que nunca se apaga.'],
    ['Teano','¿Una lechuza de bronce? Déjame ver los inventarios… Aquí. Hace tres años, un hombre dedicó una pequeña lechuza de bronce, con un ala mellada. La inscripción dice: «Eudemo de Acarnas, salvado, a Atenea».'],
    ['','El mundo se detiene. Hace tres años. Tu padre no murió en Corinto. Tu padre volvió. Y no vino a casa.'],
    ['Teano','Llora si lo necesitas, muchacho. La diosa ha visto llorar a muchos en esta roca.'],
    {who:'Teano',ask:'¿Qué fiesta celebra cada año el cumpleaños de Atenea con una gran procesión hasta la Acrópolis?',a:['Las Panateneas','Las Dionisias','Las Tesmoforias'],ok:'Sí: en las Panateneas toda la ciudad sube en procesión y le lleva a la diosa un peplo nuevo tejido por muchachas atenienses.',ko:'No. Esa fiesta lleva el nombre de la diosa y de «todos los atenienses».'},
    {choose:[['Rezar a Atenea por tu padre',[['','Pones la mano en la piedra fría y pides algo muy simple: volver a verlo.']],''],['Preguntar a Teano por qué no volvió a casa',[['Teano','Hay heridas que no se ven. A veces un hombre no vuelve porque cree que ya no es el que se fue.']],'']]}]}],
  end:'Tu padre está vivo, o lo estaba hace tres años. Volvió de Corinto, dio las gracias a Atenea… y desapareció.',
  learn:'La religión griega no tenía un libro sagrado ni una iglesia: consistía en ritos, sacrificios, fiestas y ofrendas. Las sacerdotisas, como la de Atenea Polias, tenían un papel público muy importante. Las ofrendas votivas (exvotos) se dedicaban para pedir o agradecer un favor.'},
 {cat:'Guerra y memoria',title:'Los nombres de los muertos',
  intro:'Cada año, Atenas entierra en el Cerámico a los caídos en la guerra y graba sus nombres en grandes estelas, ordenados por tribus. Tu padre debería estar en una de ellas.',
  actors:[{id:'anciana',name:'Arquestrate',title:'Madre de un caído',look:{female:true,chiton:'#2a2420',himation:'#3a3430',veil:true,hair:'#d8d0c2'},at:'place:ceramico',dx:-5,dz:4}],
  steps:[
   {obj:'Ve al Cerámico, fuera de la puerta del Dípilon',go:'place:ceramico',r:18,scene:[['','Las tumbas se alinean junto al camino. Hay relieves de jóvenes a caballo, de madres que se despiden de sus hijas, de soldados que se dan la mano.'],
    ['','En la estela de los caídos del año 394, en la columna de la tribu Eneida, encuentras un nombre: EUDEMO. Lo tocas con los dedos. Lo grabaron porque lo creyeron muerto.']]},
   {obj:'Habla con la mujer que llora junto a las tumbas',actor:'anciana',scene:[['Arquestrate','Mi hijo también está en esa piedra. Tenía veinte años. Su nombre está ahí, pero su cuerpo se quedó en Corinto.'],
    ['Arquestrate','Tú al menos tienes una esperanza. Agárrala fuerte. Y si encuentras a tu padre, no le preguntes por qué tardó: abrázalo.']]},
   {obj:'Habla con Cleótimo, el hoplita veterano',npc:'hoplita',scene:[['Cleótimo','¿Eudemo de Acarnas? ¡Claro que lo recuerdo! Estábamos en la misma fila de la falange, junto al río Nemea, cerca de Corinto. Los espartanos nos rompieron el ala.'],
    ['Cleótimo','Lo vi caer con una lanza en la pierna. Unos corintios aliados de Esparta se lo llevaron vivo. A los prisioneros que nadie rescata los venden como esclavos. Lo siento, muchacho.'],
    {who:'Cleótimo',ask:'¿Cómo luchaban los hoplitas griegos?',a:['En falange: filas apretadas, cada uno protegiendo con el escudo al compañero de su izquierda','Cada uno por su cuenta, en duelos','A caballo, con arcos'],ok:'Eso es. La falange solo funciona si nadie huye: por eso el escudo es lo más sagrado del hoplita.',ko:'No. Piensa en el gran escudo redondo, el hoplon: protege también al de al lado.'}]}],
  end:'Ahora sabes lo que pasó: tu padre cayó herido en la pierna, fue hecho prisionero y, como el rescate nunca llegó, lo vendieron como esclavo.',
  learn:'Atenas honraba a sus caídos con un funeral público anual, un discurso fúnebre y listas de nombres en el Cerámico. Los hoplitas, ciudadanos que se pagaban su armadura, combatían en falange. En la guerra de Corinto (395-387 a.C.), Atenas, Tebas, Argos y Corinto lucharon contra Esparta.'},
 {cat:'Esclavitud',title:'Lo que vale un hombre',
  intro:'En Atenas hay casi tantos esclavos como ciudadanos. Trabajan en las casas, en los talleres, en las minas. Para entender lo que vivió tu padre, tienes que escuchar a uno de ellos.',
  actors:[{id:'artesano',name:'Calias',title:'Broncista del barrio de Hefesto',look:{exomis:true,chiton:'#7a6a4a',beard:true,hair:'#3b2a1e'},at:'place:hefestion',dx:6,dz:5}],
  steps:[
   {obj:'Habla con Manes, el esclavo frigio',npc:'manes',scene:[['Manes','Me trajeron de Frigia cuando tenía diez años. Me compraron en un mercado como se compra una mula. Mi amo no es cruel, pero no soy dueño de mi tiempo, ni de mi nombre: «Manes» es como llaman aquí a todos los frigios.'],
    ['Manes','Un esclavo que trabaja en un taller puede guardar algo de lo que gana. Si ahorra mucho y su amo acepta, compra su libertad. Entonces es un liberto: libre, pero no ciudadano.'],
    {who:'Manes',ask:'¿Cómo se convertía en esclavo un griego libre?',a:['Por ser capturado en una guerra, o por los piratas, y no ser rescatado','Por no pagar impuestos','Por suspender en la escuela'],ok:'Así es. La guerra era la gran fábrica de esclavos. Por eso pagar un rescate a tiempo podía salvar una vida.',ko:'No. Piensa en lo que le pasó a tu padre en Corinto.'},
    ['Manes','¿Un liberto que cojea y huele a cola? Hay un tal Doro que compra bronce y madera en el barrio de Hefesto, junto al templo. Pregunta allí.']]},
   {obj:'Busca al broncista Calias, junto al templo de Hefesto',actor:'artesano',scene:[['Calias','¿Doro? Me compra hilo de bronce para armar… caras. Eso hace: caras. Es el mejor fabricante de máscaras de teatro que he visto, aunque no quiere que nadie lo sepa.'],
    ['Calias','Llegó de Corinto en un barco de Ctesón, el naviero del Pireo. Si quieres saber más, pregúntale a él.']]}],
  end:'Tu padre fue esclavo. Ahora es libre, pero vive escondido con otro nombre y fabrica máscaras para el teatro. Y llegó en un barco del Pireo.',
  learn:'La esclavitud era normal en el mundo griego. Los esclavos procedían de la guerra, la piratería o el comercio con pueblos «bárbaros». Había esclavos domésticos, artesanos, mineros y públicos. Algunos compraban su libertad y se convertían en libertos, que vivían como metecos, sin derechos de ciudadanía.'},
 {cat:'Mar y comercio',title:'El cuaderno del naviero',
  intro:'Atenas vive del mar: por el Pireo entra el trigo del mar Negro que la alimenta y salen el aceite, la cerámica y la plata. Los navieros apuntan pasajeros y mercancías, y un buen naviero nunca olvida una cara.',
  steps:[
   {obj:'Ve al Pireo (a pie, a caballo o con el carretero)',go:'place:pireo',r:40,at:'place:pireo',scene:[['','El puerto huele a brea y a pescado. Hay barcos de Egipto, de Sicilia, del mar Negro. Alguien grita precios en cinco lenguas.']]},
   {obj:'Habla con Ctesón, el naviero',npc:'naucleros',scene:[['Ctesón','¿Doro? Lo traje yo desde el Lequeo, el puerto de Corinto, hace tres años. Venía con la pierna mal curada y la carta de libertad en la mano: lo liberó su amo, un fabricante de máscaras corintio, en su testamento.'],
    ['Ctesón','¿Y tu familia es de Acarnas? Qué cosa… Hace siete años también llevé a Corinto a un vecino vuestro, Trasónides. Iba a pagar el rescate de un prisionero, decía. Pero en Corinto no fue a ver a ningún prisionero: compró un cargamento entero de vasos corintios y volvió más rico.'],
    ['','Ahora lo entiendes todo. Trasónides nunca pagó el rescate. Se quedó el dinero de tu abuelo, dijo que tu padre había muerto… y ahora quiere vuestra tierra por la misma deuda.'],
    {who:'Ctesón',ask:'¿De dónde llega el trigo que alimenta a Atenas?',a:['Sobre todo del mar Negro, por el Bósforo','De Esparta','De las minas del Laurion'],ok:'Eso es. El Ática no produce trigo suficiente; por eso a Atenas le importa tanto dominar el mar.',ko:'No. El Ática es seca y pedregosa: el trigo viene de muy lejos, por mar.'},
    {choose:[['Ir ahora mismo a buscar a Trasónides',[['Ctesón','Calma. Si lo acusas sin pruebas, el que acabará pagando serás tú. Yo tengo mi cuaderno de pasajeros. Y estoy dispuesto a declarar.']],'impulsivo'],['Pedirle a Ctesón que declare en un juicio',[['Ctesón','Lo haré. Mis cuadernos dicen la verdad, y a mí no me gustan los que se ríen de las familias pobres.']],'paciente']]},
    ['Ctesón','Por cierto, ya que andas por el puerto: al final del muelle hay una barca de remos amarrada desde hace días. Nadie la reclama. Si algún día quieres ver el mar con tus propios ojos, no hace falta que pagues un pasaje.']]},
   {obj:'Busca en el muelle la barca que nadie reclama',go:()=>{const m=typeof swMoorOf==='function'?swMoorOf('atenas'):null;return m?{x:m.land.x,z:m.land.z}:null;},r:10,scene:[['','Al final del muelle, entre las grandes naves de carga, flota una barca de remos. Tiene dos ojos pintados en la proa, como las trirremes, para que «vea» el camino, y en la popa una pequeña Atenea de madera. No hay nadie cerca.'],
    ['','Podrías subir (E) y remar mar adentro: sobre el agua, unas flechas te indicarían el camino hacia cada isla y cada costa. Pero ahora tienes algo más urgente.'],
    {choose:[['Prometerte que volverás a por ella',[['','Te quedas mirando el horizonte. Egina, las Cícladas, Creta, Asia… Algún día.']],''],['Tocar la estatuilla de Atenea para que te dé suerte',[['','La madera está gastada de tantas manos. Antes de zarpar, los marinos piden siempre la protección de los dioses.']],'']]}]}],
  end:'Ya sabes la verdad sobre la deuda: Trasónides se quedó el rescate. Tienes un testigo y una prueba. Pero te falta lo más importante: tu padre. Y en el muelle del Pireo te espera una barca sin dueño: cuando quieras, súbete y sal al mar.',
  learn:'El Pireo era el gran puerto de Atenas, unido a la ciudad por los Muros Largos. Atenas dependía del trigo importado del mar Negro, Egipto y Sicilia. Los navieros (naukleroi) y los comerciantes (emporoi), a menudo metecos, movían el comercio del Egeo.'},
 {cat:'Teatro',title:'Detrás de la máscara',
  intro:'En el teatro de Dioniso los actores llevan máscaras de lino y yeso: el rey, el esclavo, la reina, el dios. Detrás de la escena, alguien las fabrica. Hoy hay función.',
  actors:[{id:'doro',name:'Doro',title:'Fabricante de máscaras',look:LK.padre,at:'place:teatro',dx:9,dz:-6}],
  steps:[
   {obj:'Ve al teatro de Dioniso, en la ladera sur de la Acrópolis',go:'place:teatro',r:30,h:9,scene:[['','Catorce mil personas en las gradas. En la orquesta, el coro canta y baila. Un actor con máscara de anciano llora por un hijo perdido. A tu alrededor, la gente también llora.']]},
   {obj:'Habla con Aristófanes, el poeta cómico',npc:'aristofanes',scene:[['Aristófanes','Las máscaras son media obra, chaval. Con tres actores tienes que hacer todos los papeles: cambias de máscara y eres otro. ¿El mejor mascarero? Doro, sin duda. Está ahí detrás, entre los decorados. Nunca sale al sol.'],
    {who:'Aristófanes',ask:'¿Cuántos actores con papel hablado podía haber en una tragedia, además del coro?',a:['Tres','Uno','Veinte'],ok:'Tres: protagonista, deuteragonista y tritagonista. Las máscaras les permitían hacer muchos papeles cada uno.',ko:'Menos de los que crees: por eso hacían falta tantas máscaras.'}]},
   {obj:'Busca a Doro detrás de la escena',actor:'doro',scene:[['Doro','Aquí no se puede pasar, muchacho. Vuelve a las gradas.'],
    ['','Te mira. Tú sacas la lechuza de bronce. Él se queda quieto, como una de sus máscaras.'],
    ['Doro','La muesca del ala… te la hiciste tú, con los dientes, cuando tenías tres años. Tu madre se enfadó muchísimo.'],
    ['Eudemo','Sí. Soy yo. Soy tu padre.'],
    ['Eudemo','No me mires así. ¿Qué querías que hiciera? ¿Volver a Acarnas cojo, sin un óbolo, después de cinco años de esclavo? Para tu abuelo, yo morí como un héroe junto al río Nemea. Era mejor así. Por eso pago su deuda en secreto.'],
    {choose:[['Abrazarlo sin decir nada',[['','Huele a cola y a pintura. Tiembla. Durante un largo rato ninguno de los dos dice nada.'],['Eudemo','Has crecido tanto…']],'abrazo'],['Decirle que lo habéis esperado siete años',[['Eudemo','Lo sé. Cada día lo sabía. Y cada día tenía menos valor para volver.']],'reproche']]},
    ['Eudemo','Tengo que pensar. Déjame solo. Por favor.']]}],
  end:'Has encontrado a tu padre. Pero un hombre que se esconde detrás de máscaras no se quita la suya tan fácilmente.',
  learn:'El teatro griego nació en las fiestas de Dioniso. Cada año se representaban tragedias, comedias y dramas satíricos en un concurso. Los actores, siempre hombres, llevaban máscaras y podían hacer varios papeles. La ciudad pagaba la entrada a los pobres para que nadie se quedara fuera.'},
 {cat:'Filosofía',title:'¿Es peor sufrir la injusticia o cometerla?',
  intro:'Tu padre cree que su vergüenza vale más que la verdad. Tú no sabes qué decirle. En el bosque de Academo, fuera de las murallas, un tal Platón ha abierto una escuela para pensar estas cosas despacio.',
  actors:[{id:'doro',name:'Eudemo',title:'Tu padre',look:LK.padre,at:'place:academia',dx:-8,dz:6}],
  steps:[
   {obj:'Ve a la Academia, al noroeste de la ciudad',go:'place:academia',r:30,scene:[['','Olivos, un gimnasio, jóvenes que discuten a la sombra. Nadie grita, como en el Ágora. Aquí se escucha.']]},
   {obj:'Habla con Platón',npc:'platon',scene:[['Platón','Mi maestro Sócrates decía que es peor cometer una injusticia que sufrirla. El que sufre una injusticia pierde dinero, o salud. El que la comete se estropea por dentro, en el alma.'],
    ['Platón','Tu padre fue esclavo. ¿Y eso lo hace peor? El alma no se vende en el mercado. El que debería avergonzarse es quien se quedó el rescate, no quien fue vendido.'],
    {who:'Platón',ask:'Según Sócrates, ¿qué es peor?',a:['Cometer una injusticia','Sufrir una injusticia','Las dos cosas son igual de malas'],ok:'Eso decía Sócrates, y por eso aceptó morir antes que huir de la cárcel saltándose las leyes.',ko:'Piensa en el alma: ¿a quién estropea la injusticia, al que la sufre o al que la hace?'},
    ['Platón','Por cierto: alguien te ha seguido desde la ciudad. Lleva un rato escuchando detrás de ese olivo.']]},
   {obj:'Habla con tu padre, junto a los olivos',actor:'doro',scene:[['Eudemo','Lo he oído todo. El filósofo tiene razón, y me ha dolido oírlo de otro antes que de mí mismo.'],
    ['Eudemo','Trasónides me robó siete años. Y yo le he dejado robarme también la vergüenza. Se acabó. Declararé en el juicio, con mi nombre verdadero.'],
    {choose:[['Decirle que estás orgulloso de él',[['Eudemo','Calla, que me harás llorar delante de los filósofos.']],''],['Preguntarle si volverá a casa',[['Eudemo','Primero el juicio. Luego… luego tendré que mirar a tu madre a los ojos. Eso me da más miedo que los espartanos.']],'']]}]}],
  end:'Tu padre va a declarar. Ya no está solo, y tú tampoco.',
  learn:'Platón fundó la Academia hacia el 387 a.C. junto al gimnasio de Academo. Siguiendo a Sócrates, defendió que la justicia es la salud del alma y que es peor cometer una injusticia que sufrirla (diálogo Gorgias). La filosofía griega buscaba respuestas racionales a cómo vivir bien.'},
 {cat:'Justicia',title:'Quinientas una piedras',
  intro:'Hoy se juzga la demanda de Trasónides contra tu abuelo. Los jueces no son profesionales: son ciudadanos sorteados esa misma mañana, cientos de ellos, para que nadie pueda sobornarlos a todos.',
  actors:[{id:'traso',name:'Trasónides',title:'El acusador',look:LK.traso,at:'place:kleroterion',dx:8,dz:6},{id:'doro',name:'Eudemo',title:'Tu padre',look:LK.padre,at:'place:kleroterion',dx:-6,dz:6},{id:'abuelo',name:'Arquipo',title:'Tu abuelo',look:LK.abuelo,at:'place:kleroterion',dx:-8,dz:4}],
  steps:[
   {obj:'Ve a las máquinas de sorteo (kleroterion), en el Ágora',go:'place:kleroterion',r:16,h:7,scene:[['','Los ciudadanos meten sus plaquitas de bronce con su nombre en las ranuras de una piedra. Un funcionario echa bolas blancas y negras por un tubo: las blancas eligen jueces, las negras los mandan a casa.'],
    {ask:'¿Por qué los atenienses sorteaban a los jueces cada mañana?',a:['Para que nadie supiera de antemano quién juzgaría y fuera imposible sobornarlos','Porque nadie quería ser juez','Para ahorrar dinero'],ok:'Exacto. Además, eran tantos —cientos por tribunal— que comprarlos a todos era imposible.',ko:'Piensa en Trasónides: un hombre rico. ¿Qué podría intentar si supiera quién va a ser juez?'}]},
   {obj:'Habla con tu abuelo antes del juicio',actor:'abuelo',scene:[['Arquipo','¿Por qué me miras así? ¿Y quién es este hombre cojo que…?'],
    ['','Tu abuelo se queda sin voz. Deja caer el bastón.'],
    ['Arquipo','¿Eudemo? ¿Hijo?'],
    ['Eudemo','Perdóname, padre. Perdóname por todo.'],
    ['','Tu abuelo no dice nada. Le pone las dos manos en la cara, como cuando era niño, y llora.']]},
   {obj:'Enfréntate a Trasónides en el juicio',actor:'traso',scene:[['','El agua de la clepsidra empieza a caer: cada parte tiene el mismo tiempo para hablar. Trasónides habla primero. Lo hace bien: deuda, mojón, testigos.'],
    ['','Luego habláis vosotros. Ctesón lee su cuaderno: Trasónides en Corinto, sin ir a ver a ningún prisionero. Pasión enseña los pagos de la lechuza. Y entonces se levanta un hombre cojo.'],
    ['Eudemo','Atenienses: mi nombre está grabado en la estela de los caídos del Cerámico. Pero estoy vivo. Me vendieron como esclavo porque el rescate de mi padre nunca llegó a Corinto. Ese hombre lo sabía. Me dio por muerto para quedarse el dinero.'],
    ['Trasónides','¡Mentira! ¿Quién va a creer a un esclavo?'],
    ['Eudemo','Un liberto, Trasónides. Y ciudadano de Acarnas, inscrito en mi demo. Pregunta a los de mi tribu: algunos estuvieron junto a mí en la falange.'],
    {ask:'¿Con qué votan los jueces atenienses?',a:['Con fichas de bronce: la de eje hueco para condenar y la de eje macizo para absolver','Levantando la mano','Escribiendo en una tablilla de cera'],ok:'Así es: cada juez tapa el eje con los dedos para que nadie vea cuál echa en la urna. El voto es secreto.',ko:'Recuerda: el voto es secreto. Se hace con objetos de bronce que se meten en una urna.'},
    ['','Se cuentan los votos: 402 fichas a vuestro favor, 99 en contra. La demanda de Trasónides queda rechazada, y como no ha conseguido ni la quinta parte de los votos, tendrá que pagar una multa: un óbolo por cada dracma que reclamaba.']]},
   {obj:'Sube al atardecer junto al olivo de Atenea',go:'place:olivo',r:14,h:19,scene:[['','El sol se pone sobre el golfo. Ahí está tu madre: Mirrina la ha traído corriendo desde la fuente. Ve a tu padre. Se para.'],
    ['Filia','Siete años, Eudemo.'],['Eudemo','Siete años, Filia.'],
    ['','No hacen falta más palabras. Tu abuelo se ríe y llora a la vez. Tú sacas la lechuza de bronce y se la pones a tu padre en la mano.'],
    ['Eudemo','No. Es tuya. Para que Atenea te cuide. Aunque, la verdad, esta vez nos has cuidado tú a nosotros.']]}],
  end:'La tierra de tu abuelo está a salvo, Trasónides ha sido condenado y tu familia vuelve a estar completa. En los inventarios de Atenea queda una lechuza de bronce que cuenta, sin palabras, toda esta historia.',
  learn:'Los tribunales populares de Atenas (la Helea) estaban formados por cientos de ciudadanos sorteados. No había abogados ni fiscales: cada parte hablaba por sí misma, con un tiempo medido por la clepsidra, a menudo con discursos escritos por logógrafos como Lisias. El voto era secreto y se decidía por mayoría.'}
];
const STORY_FIN_ATENAS={title:'La lechuza de bronce',txt:['Has terminado la historia de Atenas. Con tu familia has recorrido la ciudad entera: la Asamblea y la fuente, el banco y la Acrópolis, las tumbas del Cerámico, el puerto, el teatro, la Academia y los tribunales. Y, con tu padre, has visto el mar de la paz del Rey, de Bizancio a Éfeso.',
 'Eudemo, Filia, Arquipo, Trasónides y Doro son personajes inventados, pero todo lo que les pasa podía pasar en la Atenas del 386 a.C.: prisioneros de guerra vendidos como esclavos, rescates que no llegaban, nombres grabados por error entre los muertos, libertos que rehacían su vida y jueces sorteados cada mañana.',
 'Ahora puedes seguir explorando libremente: quedan muchos personajes, lugares, viajes y sueños por descubrir.']};
// ---- Historia de Roma: «La tablilla de Tercia»
const LKR={grato:{chiton:'#f3eee2',toga:true,beard:false,hair:'#8d8a85'},
 tercia:{female:true,chiton:'#d8c9a8',himation:'#8a5a3a',hair:'#5b4532',scale:0.78},
 nino:{chiton:'#efe6d4',short:true,noHimation:true,hair:'#3b2a1e',scale:0.8},
 vigil:{chiton:'#8a3a2a',short:true,noHimation:true,hair:'#2b1f17',beard:true},
 tito:{chiton:'#f3eee2',toga:true,hair:'#5b4532',glow:false},
 madre:{female:true,chiton:'#e2d6c0',himation:'#4a5a6a',veil:true,hair:'#5b4532',staff:true},
 esclavo:{chiton:'#c9b48b',short:true,noHimation:true,hair:'#3b2a1e'}};
const STORY_ROMA=[
 {cat:'Sociedad',title:'Una carta de Neápolis',start:'npc:tacito',
  intro:'Hace unos meses el Vesubio sepultó Pompeya y Herculano. Tú eres de Herculano. Aquella noche tu padre, barquero, ayudó a subir a la gente a las barcas y no volvió. Tu madre quedó herida y vive ahora en Neápolis. Tu hermana pequeña, Tercia, de nueve años, subió a una barca distinta de la tuya y nunca supisteis adónde la llevaron. Llegas a Roma con una carta de tu madre para un senador que fue amigo de la familia.',
  actors:[{id:'grato',name:'Quinto Vetio Grato',title:'Senador, patrono de tu familia',look:LKR.grato,at:'npc:cliente',dx:6,dz:4,rot:Math.PI}],
  steps:[
   {obj:'Lee la carta de tu madre',auto:true,h:7,scene:[['','Roma es enorme: un millón de personas, el ruido de los carros por la noche, el olor del pan y del humo. Despliegas la carta de tu madre, escrita con mano temblorosa.'],
    ['Carta de tu madre','«Hijo mío: busca a Quinto Vetio Grato. Tu abuelo fue cliente de su padre. En Roma, quien no tiene patrono no tiene a nadie. Pídele que nos ayude a encontrar a Tercia. Y come algo caliente, que te conozco.»'],
    ['','Por la mañana, a la puerta de las casas de los ricos, se hace cola. Pregunta a alguno de los que esperan.']]},
   {obj:'Habla con Lucio Fabio, que espera en la salutatio',npc:'cliente',scene:[['Lucio Fabio','¿Que vienes a ver al senador Grato? Ponte a la cola, como todos. Cada mañana los clientes venimos a saludar a nuestro patrono, con la toga bien puesta. Él nos da la espórtula, unas monedas o una cesta de comida, y a cambio lo acompañamos al Foro y lo aplaudimos.'],
    {who:'Lucio Fabio',ask:'¿Qué recibe el cliente de su patrono en la salutatio?',a:['La espórtula: dinero o comida','Un voto en el Senado','Un sueldo fijo de soldado'],ok:'Eso. Y si tienes un problema con la justicia, el patrono te protege. Al menos en teoría.',ko:'No. Piensa en la «cestita»: eso significa sportula.'}]},
   {obj:'Habla con el senador Quinto Vetio Grato',actor:'grato',scene:[['Grato','¿Herculano? Terrible, terrible. Toma, muchacho, tu espórtula. Ya veré qué se puede hacer. Vuelve dentro de unas semanas.'],
    ['','Y ya está. Se da la vuelta y sigue saludando a los demás clientes. Ni siquiera ha abierto la carta de tu madre.'],
    ['','Un joven que estaba cerca lo ha visto todo. Se te acerca.']]},
   {obj:'Habla con el joven que te ha visto: Plinio',npc:'plinio',scene:[['Plinio','Perdona que me meta. Me llamo Gayo Plinio. Yo también estuve allí, en Miseno, aquella noche. Mi tío mandaba la flota. Salió con las naves a rescatar a la gente de la costa… y no volvió.'],
    ['Plinio','Las naves de mi tío recogieron a gente en la playa. Quizá alguien apuntó los nombres. Escribiré a Miseno. Mientras tanto, ve a ver a las vestales: el emperador ha mandado repartir ayuda a los refugiados de Campania, y ellas saben a quién se ha acogido en los templos.'],
    {choose:[['Darle las gracias y decirle que lo sientes por su tío',[['Plinio','Gracias. Era un hombre que nunca dejaba de leer, ni en el baño. Murió por ir a ayudar. Me gustaría que eso sirviera de algo.']],''],['Preguntarle por qué te ayuda',[['Plinio','Porque si mi tío te hubiera visto, ya estaría ayudándote. Y porque estoy harto de los senadores que no abren las cartas.']],'']]},
    ['Plinio','Y cuando vayas a ver a tu madre a Neápolis, ve por mar, como hacía tu padre. En el Emporio, junto al Tíber, hay una barca vieja amarrada que nadie usa desde hace días. Río abajo se llega a Ostia y, costeando hacia el sur, al golfo de Neápolis.']]},
   {obj:'Busca en el Emporio la barca que nadie usa',go:()=>{const m=typeof swMoorOf==='function'?swMoorOf('atenas'):null;return m?{x:m.land.x,z:m.land.z}:null;},r:10,scene:[['','Entre las barcazas que descargan ánforas, flota una barca de remos. Tiene dos ojos pintados en la proa, un cuello de cisne de madera en la popa y una pequeña estatuilla de Neptuno con su tridente. No hay nadie cerca.'],
    ['','Te acuerdas de tu padre, el barquero de Herculano. Podrías subir (E) y bajar por el río hasta el mar: sobre el agua, unas flechas te indicarían el camino. Pero antes tienes que seguir buscando a Tercia.'],
    {choose:[['Prometerte que irás en ella a ver a tu madre',[['','Neápolis, el golfo, el Vesubio todavía humeante… Algún día cruzarás ese mar.']],''],['Tocar la estatuilla de Neptuno, como hacía tu padre',[['','Tu padre siempre tocaba la estatuilla antes de soltar amarras. Los marineros piden a Neptuno que los devuelva sanos a casa.']],'']]}]}],
  end:'Tu patrono no te ha hecho caso, pero has encontrado a un amigo inesperado: Plinio, que perdió a su tío en la misma erupción. Y en el Emporio te espera una barca sin dueño: cuando quieras, súbete y baja al mar.',
  learn:'La sociedad romana se basaba en el clientelismo: los clientes saludaban cada mañana a su patrono (salutatio), lo acompañaban en público y recibían a cambio protección y la espórtula. Las relaciones personales importaban más que las instituciones para resolver problemas.'},
 {cat:'Religión romana',title:'El fuego que nunca se apaga',
  intro:'En el templo redondo de Vesta arde el fuego sagrado de Roma. Seis sacerdotisas, las vestales, lo cuidan día y noche. Son mujeres muy respetadas: pueden testificar, hacer testamento y hasta salvar a un condenado si se cruzan con él.',
  steps:[
   {obj:'Lee la estela del templo de Vesta, en el Foro',sign:'ro_vesta',scene:[['','Dentro del templo no hay estatua: solo el fuego. Si se apagara, sería la peor de las señales para Roma.']]},
   {obj:'Habla con Cornelia, la vestal',npc:'cornelia',scene:[['Cornelia','Desde la erupción, el emperador Tito ha nombrado comisionados para ayudar a Campania. Los templos han acogido a niños que llegaban solos en barcos de grano o de la flota.'],
    ['Cornelia','Recuerdo a una niña de Herculano. Se sentaba en la escalinata de este templo y repetía una canción de barqueros. Preguntaba por su hermano. La anotamos en las listas del tesoro del templo de Saturno, como a todos.'],
    ['Cornelia','Pero un día ya no vino. Lo siento. Busca su nombre en el templo de Saturno.'],
    {who:'Cornelia',ask:'¿Qué guardan las vestales en el templo de Vesta?',a:['El fuego sagrado de Roma, que no puede apagarse nunca','El tesoro del Estado','Las armas de Rómulo'],ok:'El fuego y algunos objetos sagrados que solo ellas pueden ver. El tesoro está en el templo de Saturno: allí irás ahora.',ko:'Piensa en el nombre de la diosa: Vesta es la diosa del hogar.'}]}],
  end:'Tercia estuvo aquí, a pocos pasos del fuego de Vesta, cantando la canción de los barqueros de vuestro padre. Está viva. O lo estaba.',
  learn:'La religión romana era una religión del Estado: sus ritos garantizaban la «paz con los dioses». Las vestales, elegidas de niñas, servían treinta años cuidando el fuego de Vesta, símbolo del hogar de Roma. Tenían privilegios que ninguna otra mujer romana tenía.'},
 {cat:'Derecho y ciudadanía',title:'Una línea en el registro',
  intro:'En el templo de Saturno se guarda el tesoro del Estado y muchos registros. Allí se apuntan, entre otras cosas, los nacimientos de los hijos de ciudadanos. Pero los registros también pueden contar mentiras.',
  actors:[{id:'escriba',name:'Eros',title:'Esclavo público del tesoro',look:LKR.esclavo,at:'place:ro_saturno',dx:6,dz:4}],
  steps:[
   {obj:'Lee la estela del templo de Saturno',sign:'ro_saturno'},
   {obj:'Habla con Eros, el escriba del tesoro',actor:'escriba',scene:[['Eros','¿Una niña de Herculano llamada Tercia? Déjame mirar… Aquí está la lista de los refugiados. Y aquí… vaya.'],
    ['Eros','Hay una anotación posterior, de una venta: «Una niña campana, llamada Tercia, comprada en Puteoli por Gayo Pompeyo Hermeros, liberto». La tiene registrada como esclava suya.'],
    ['','Sientes que te falta el aire. Tu hermana, vendida como esclava.'],
    ['Eros','Si es hija de ciudadanos, eso no vale nada. Pero hay que demostrarlo. Pregunta a un abogado o a un senador joven. Por ahí anda Tácito.']]},
   {obj:'Habla con Tácito, el joven senador',npc:'tacito',scene:[['Tácito','Un ciudadano nacido libre no puede ser esclavo, aunque alguien lo venda. Se hace un juicio por la libertad, una causa liberalis. Alguien libre tiene que defenderla en su nombre: tú mismo, si eres mayor de edad, o un amigo.'],
    ['Tácito','Hace poco hubo un caso así en Herculano: una tal Petronia Justa tuvo que demostrar que había nacido libre. La prueba mejor es la declaración de nacimiento. Pero las de vuestra familia se habrán quemado con la ciudad, ¿verdad?'],
    {who:'Tácito',ask:'Si un ciudadano romano nacido libre es vendido como esclavo, ¿qué dice la ley?',a:['Sigue siendo libre: puede reclamarlo en un juicio por la libertad','Pasa a ser esclavo del comprador','Pierde la ciudadanía para siempre'],ok:'Exacto. La libertad de un ciudadano no se puede comprar ni vender. Pero hay que probarla ante un juez.',ko:'No. En Roma la libertad de nacimiento era algo que no se podía perder por una venta.'},
    ['Tácito','Primero, averigua quién es ese Hermeros y por qué la compró. A veces la verdad es más complicada que una línea en un registro.']]}],
  end:'Tercia está registrada como esclava de un liberto rico, Hermeros. La ley está de tu parte, pero necesitarás pruebas.',
  learn:'Roma distinguía entre ciudadanos, extranjeros (peregrinos), esclavos y libertos. El nacimiento de los hijos de ciudadanos se declaraba oficialmente (professio liberorum). Quien era esclavizado injustamente podía recuperar su libertad mediante una causa liberalis, en la que un hombre libre lo defendía.'},
 {cat:'Economía y esclavitud',title:'El liberto que compró una niña',
  intro:'Gayo Pompeyo Hermeros fue esclavo, compró su libertad y ahora es rico gracias al comercio. Muchos senadores lo desprecian por su pasado. Tú ni siquiera sabes si es un villano.',
  steps:[
   {obj:'Pregunta por Hermeros a Eutiques, el comerciante del Emporio',npc:'mercader',scene:[['Eutiques','¿Hermeros? Trae vino de Hispania y trigo de Egipto. Empezó con nada: lo vendieron de niño en el mercado de Delos, como a una mercancía. Ahora tiene tres barcos.'],
    ['Eutiques','Por aquí pasa de todo, muchacho: grano, aceite, mármol… y personas. Después de la erupción aparecieron traficantes que recogían niños perdidos en la costa y los vendían en Puteoli. Una vergüenza.'],
    {who:'Eutiques',ask:'¿Qué era la annona?',a:['El reparto de trigo gratuito o barato a los ciudadanos de Roma','Un impuesto sobre los esclavos','Una fiesta de la cosecha'],ok:'Eso. Más de doscientos mil romanos reciben trigo de la annona, que llega sobre todo de Egipto y África.',ko:'No. Piensa en lo que necesita una ciudad de un millón de personas para no tener hambre.'}]},
   {obj:'Habla con Hermeros, el liberto',npc:'hermeros',scene:[['Hermeros','¿Tercia? ¿Eres su hermano? Siéntate. Te contaré la verdad, aunque no me deje en buen lugar.'],
    ['Hermeros','La vi en Puteoli, en un estrado de venta, con un cartel colgado del cuello. Un traficante iba a llevarla a Oriente. Yo estuve en un estrado así, a su edad. Pagué lo que pedían. No pude dejarla allí.'],
    ['Hermeros','La apunté como esclava porque era la única manera legal de sacarla de allí. En mi casa estudiaba con mis hijos. Pero hace un mes, cuando llegó la epidemia, se puso enferma. Yo estaba en Ostia. Mi mayordomo tuvo miedo del contagio y… la llevó a la isla del Tíber, con los enfermos.'],
    ['Hermeros','Cuando volví ya no estaba. No he dormido bien desde entonces.'],
    {choose:[['Perdonarlo',[['Hermeros','No sé si lo merezco. Pero declararé ante el juez que tu hermana nació libre. Te lo juro por mis Lares.']],'perdon'],['Echarle en cara lo que hizo su mayordomo',[['Hermeros','Tienes razón. En mi casa, la culpa de lo que hacen mis esclavos es mía. Declararé que tu hermana nació libre; es lo mínimo.']],'']]},
    ['Hermeros','Antes de ir a la isla, pasa por la escuela de mis hijos. Tercia dejó allí algo que querrás ver.']]}],
  end:'Hermeros no es un villano: es un antiguo esclavo que compró a tu hermana para salvarla, aunque luego le falló. Y Tercia estuvo enferma en la isla del Tíber.',
  learn:'Roma era una sociedad esclavista. Los esclavos se compraban en grandes mercados como Delos o Puteoli. Muchos libertos, como Hermeros, se hicieron ricos con el comercio, aunque la élite los despreciaba. La annona garantizaba el trigo a la plebe de Roma.'},
 {cat:'Educación',title:'Lo que escribió Tercia',
  intro:'Los niños romanos de familias con algo de dinero aprenden a leer, escribir y contar con un maestro de primeras letras, desde los siete años. Escriben en tablillas de cera con un punzón.',
  actors:[{id:'primo',name:'Primo',title:'Hijo de Hermeros, compañero de Tercia',look:LKR.nino,at:'npc:flavio',dx:4,dz:3}],
  steps:[
   {obj:'Habla con Flavio, el maestro de primeras letras',npc:'flavio',scene:[['Flavio','¿El hermano de Tercia? Era la mejor de la clase con los números, y la peor callándose. Se nota que es de familia de barqueros: cantaba remando con los brazos.'],
    ['Flavio','Olvidó esto aquí. Su tablilla de cera.'],
    ['','En la cera hay letras torcidas: MATER · FRATER · DOMVS. Y debajo, un dibujo: una montaña que echa humo, el mar, una barca. Y dos figuras pequeñas cogidas de la mano.'],
    {who:'Flavio',ask:'¿Con qué escriben los niños en la tablilla de cera?',a:['Con un estilo o punzón: la punta escribe y el otro extremo, plano, borra','Con pluma y tinta','Con tiza'],ok:'Así es. La cera se puede alisar y volver a usar mil veces. El papiro es caro y se reserva para lo importante.',ko:'No. Piensa en cómo se borra la cera: hace falta un instrumento con dos extremos distintos.'}]},
   {obj:'Habla con Primo, el hijo de Hermeros',actor:'primo',scene:[['Primo','Tercia me enseñó a silbar con dos dedos. Dijo que su hermano se lo había enseñado a ella.'],
    ['Primo','Cuando se la llevaron a la isla, lloraba. Me dijo: «Si viene mi hermano, dile que estoy esperando».'],
    {choose:[['Enseñarle a Primo el silbido con dos dedos',[['','Silbáis los dos a la vez. Por un momento, es como si Tercia estuviera aquí.']],'silbido'],['Prometerle a Primo que la traerás',[['Primo','¿De verdad? Entonces te espero.']],'']]}]}],
  end:'Llevas la tablilla de cera de Tercia: un dibujo de vuestra casa antes del volcán. Y sabes que te está esperando.',
  learn:'La educación romana tenía tres etapas: el maestro de primeras letras (ludi magister), el gramático, que enseñaba literatura griega y latina, y el rétor, que enseñaba a hablar en público. No era obligatoria ni gratuita, y muchas niñas solo hacían la primera etapa.'},
 {cat:'Medicina',title:'La isla de Esculapio',
  intro:'En medio del Tíber hay una isla con forma de barco. Allí está el templo de Esculapio, el dios de la medicina, que llegó a Roma hace tres siglos durante una epidemia. Hoy está lleno de enfermos.',
  steps:[
   {obj:'Ve a la isla del Tíber y lee su estela',sign:'ro_isla',scene:[['','Hay enfermos tumbados en los pórticos, durmiendo junto al templo con la esperanza de que el dios los cure en sueños. Otros solo esperan.']]},
   {obj:'Habla con Asclepíades, el médico griego',npc:'medico',scene:[['Asclepíades','Esta epidemia es de las peores que recuerdo. Muchos amos traen aquí a sus esclavos enfermos para no pagar médico. Por eso el emperador Claudio dio una ley: el esclavo abandonado en esta isla que se cure queda libre, y su amo pierde todo derecho sobre él.'],
    ['Asclepíades','¿Una niña de Herculano con fiebre? Sí, la recuerdo. Se curó. ¡Y gracias a esa ley, es libre ante cualquier juez! La cuidaba una mujer del Trastévere, una tejedora judía. Se la llevó a su casa cuando se curó.'],
    {who:'Asclepíades',ask:'¿Qué establecía la ley de Claudio sobre los esclavos abandonados en la isla del Tíber?',a:['Si se curaban, quedaban libres','Debían volver con su amo','Pasaban a ser esclavos del templo'],ok:'Eso es. Fue una de las primeras leyes romanas que protegía a los esclavos de la crueldad de sus amos.',ko:'No. El emperador quiso castigar a los amos que abandonaban a sus esclavos enfermos.'},
    ['Asclepíades','Y tú, muchacho, lávate las manos antes de irte. No me fío de esta fiebre.']]}],
  end:'Tercia sobrevivió a la epidemia, y además la ley la ha hecho libre. Ahora vive en el Trastévere, con una tejedora judía.',
  learn:'La medicina romana mezclaba la religión (el culto a Esculapio, sueños curativos en los templos) con la ciencia de los médicos, casi siempre griegos. Suetonio cuenta que en el año 80 hubo en Roma una epidemia gravísima. El emperador Claudio dio la ley que liberaba a los esclavos enfermos abandonados en la isla.'},
 {cat:'Religiones y comunidades',title:'Una vela encendida en el Trastévere',
  intro:'Al otro lado del Tíber, en el Trastévere, viven marineros, artesanos y muchos extranjeros: sirios, egipcios, judíos. Cada comunidad tiene sus dioses, sus fiestas y sus costumbres, y Roma, por lo general, las deja vivir.',
  steps:[
   {obj:'Busca a Débora, la tejedora, en el Trastévere',npc:'debora',scene:[['Débora','Así que tú eres el hermano. Tercia no paraba de hablar de ti. Pasa, pasa. Hoy es viernes: al ponerse el sol empieza el sábado, el día de descanso. Encenderemos una lámpara.'],
    ['Débora','Yo vine de Judea hace diez años, después de que las legiones de Tito destruyeran Jerusalén y nuestro Templo. Perdí allí a mi hija, que tendría ahora la edad de Tercia. Cuando la vi sola en la isla, ardiendo de fiebre, no pude dejarla.'],
    ['Débora','Pero no está aquí. Esta mañana se fue con mi sobrino a llevar telas al mercado del Campo de Marte, junto a los templos de Isis. Y quería ver el anfiteatro nuevo: no habla de otra cosa.'],
    {who:'Débora',ask:'¿Qué día de la semana descansan los judíos?',a:['El sábado (sabbat), desde la puesta de sol del viernes','El domingo','El primer día de cada mes'],ok:'Así es. A los romanos les parecía muy raro que alguien descansara un día de cada siete; algunos se burlaban, y otros lo imitaban.',ko:'No. El descanso empieza el viernes, cuando se pone el sol.'},
    {choose:[['Darle las gracias a Débora por cuidar de tu hermana',[['Débora','No me las des. Me ha devuelto algo que creía perdido: las ganas de cantar.']],''],['Preguntarle cómo es vivir en Roma siendo judía',[['Débora','Pagamos un impuesto especial desde la caída de Jerusalén y algunos se ríen de nuestras costumbres. Pero aquí tenemos nuestras sinagogas, nuestros vecinos y nuestro sábado. Se vive.']],'']]}]}],
  end:'Por un momento, en casa de Débora, has sentido lo que es una familia otra vez. Tercia está muy cerca, en algún lugar entre el anfiteatro y el Campo de Marte.',
  learn:'Roma acogía muchas religiones: los cultos tradicionales, los de Oriente (Isis, la Gran Madre, Mitra) y comunidades como la judía, numerosa en el Trastévere, o los primeros cristianos. Se toleraban mientras no amenazaran el orden público; tras la guerra de Judea (66-70), los judíos pagaban un impuesto especial.'},
 {cat:'Espectáculos',title:'Cien días de juegos',
  intro:'Tito inaugura el Anfiteatro Flavio con cien días de espectáculos: cazas de animales, combates de gladiadores, incluso batallas navales. Cincuenta mil personas llenan las gradas. Encontrar a una niña allí es como buscar un grano de trigo en un granero.',
  steps:[
   {obj:'Ve al Anfiteatro Flavio',go:'place:ro_coliseo',r:60,h:11,scene:[['','El ruido es ensordecedor. Cada uno se sienta según su rango: los senadores, abajo, con togas blancas; luego los caballeros, los ciudadanos… y arriba del todo, las mujeres y los esclavos.']]},
   {obj:'Habla con Prisco, el gladiador liberado',npc:'prisco',scene:[['Prisco','El día de la inauguración luché contra Vero. Estuvimos horas, ninguno caía. El público pidió que nos liberaran a los dos, y Tito nos dio a cada uno la espada de madera de la libertad. El poeta Marcial lo ha escrito en versos.'],
    ['Prisco','¿Buscas a una niña? Sube conmigo a las gradas de arriba, que desde allí se ve todo… Mira, allí, en el último piso: una cría con un pañuelo rojo silbando con dos dedos.'],
    ['','Es ella. Gritas su nombre, pero el rugido del público se lo traga. Bajáis las escaleras corriendo y, cuando llegáis, ya no está. La muchedumbre sale como un río.'],
    {who:'Prisco',ask:'¿Dónde se sentaban las mujeres en el anfiteatro?',a:['En las gradas más altas, separadas de los hombres','En primera fila','No podían entrar'],ok:'Augusto ordenó que cada grupo se sentara en su sitio. Las mujeres, salvo las vestales, iban arriba del todo.',ko:'No. Las leyes de Augusto ordenaban los asientos por rango, y a las mujeres les tocaba lo peor.'},
    ['Prisco','No te rindas. Si iba al Campo de Marte, la encontrarás allí. Pero date prisa: dicen que se ve humo hacia el norte.']]}],
  end:'La has visto. Está viva, sana, silbando como le enseñaste. Pero se te ha escapado entre cincuenta mil personas, y hay humo en el cielo.',
  learn:'Los espectáculos (munera y venationes) eran un regalo del emperador al pueblo y una forma de propaganda. El Anfiteatro Flavio se inauguró en el año 80 con cien días de juegos. Los gladiadores eran en su mayoría esclavos, pero algunos ganaban fama y la libertad, simbolizada por la espada de madera (rudis).'},
 {cat:'Ciudad y catástrofes',title:'Tres días de fuego',
  intro:'Es el año 80, y mientras Tito está en Campania ayudando a los refugiados del Vesubio, un incendio terrible arrasa durante tres días el Campo de Marte y el Capitolio: el templo de Isis, el Panteón, el templo de Júpiter… Roma, construida de madera y ladrillo, arde con facilidad.',
  actors:[{id:'vigil',name:'Décimo',title:'Vigil de la VII cohorte',look:LKR.vigil,at:'place:ro_iseo',dx:8,dz:6},{id:'tercia',name:'Tercia',title:'Tu hermana',look:LKR.tercia,at:'place:ro_panteon',dx:-6,dz:10}],
  steps:[
   {obj:'Corre al templo de Isis, en el Campo de Marte',go:'place:ro_iseo',r:30,h:21,scene:[['','El cielo está rojo. Hay humo, gritos, gente que huye con lo que puede cargar. Las llamas salen por el tejado del templo de Isis.']]},
   {obj:'Habla con Décimo, el vigil',actor:'vigil',scene:[['Décimo','¡Atrás, que se cae el pórtico! Los vigiles hacemos cadenas de cubos desde las fuentes, usamos bombas de agua y, si hace falta, derribamos casas enteras para que el fuego no salte.'],
    {who:'Décimo',ask:'¿Quiénes eran los vigiles?',a:['Bomberos y vigilantes nocturnos de Roma, creados por Augusto','Los guardaespaldas del emperador','Los sacerdotes que vigilaban el fuego de Vesta'],ok:'Eso somos: siete cohortes de libertos, una por cada dos barrios. Apagamos fuegos y patrullamos de noche.',ko:'No. Piensa en lo que estoy haciendo ahora mismo, con este cubo.'},
    ['Décimo','¿Una niña? Hay un grupo de niños que se ha refugiado bajo el pórtico del Panteón. ¡Ve, rápido, antes de que llegue el fuego!']]},
   {obj:'Busca a Tercia junto al Panteón',actor:'tercia',scene:[['','Entre el humo oyes un silbido de dos dedos. Silbas también. Te contesta.'],
    ['Tercia','¿Eres tú? ¿Eres tú de verdad?'],
    ['','Se te tira encima tan fuerte que casi os caéis. Huele a humo y a lana. Ha crecido. Tiene una cicatriz pequeña en la frente.'],
    ['Tercia','Le dije a Primo que vendrías. Se lo dije a todo el mundo. Nadie me creía.'],
    {choose:[['Enseñarle su tablilla de cera',[['Tercia','¡Mi dibujo! Es nuestra casa. Y ese eres tú, y esa soy yo. ¿Dónde está padre?'],['','No sabes qué contestar. Ella lo entiende en tu silencio y te aprieta la mano. Ya lo hablaréis. Ahora hay que salir de aquí.']],''],['Cogerla en brazos y correr lejos del fuego',[['','Corres con ella hasta el Tíber, donde el aire se puede respirar. Allí, por primera vez en meses, os reís los dos sin motivo.']],'']]}]}],
  end:'Has encontrado a Tercia. Ya nada os separará… salvo una línea en un registro, que todavía dice que es esclava.',
  learn:'Roma sufría incendios frecuentes por sus casas de madera y sus calles estrechas. Augusto creó los vigiles, bomberos y policía nocturna. En el año 80 un incendio destruyó gran parte del Campo de Marte y el Capitolio, y ese mismo año hubo además una epidemia: Tito tuvo que hacer frente a tres desastres seguidos.'},
 {cat:'Poder imperial',title:'Nadie debe irse triste',
  intro:'Tito ha vuelto de Campania. Cuentan que un día, al darse cuenta de que no había hecho ningún favor a nadie, dijo: «Amigos, he perdido el día». Hoy recibe peticiones en el Palatino. Es tu oportunidad.',
  actors:[{id:'tito',name:'Tito',title:'Emperador',look:LKR.tito,at:'place:ro_palatino',dx:6,dz:6,rot:Math.PI},{id:'tercia',name:'Tercia',title:'Tu hermana',look:LKR.tercia,at:'place:ro_palatino',dx:-5,dz:8},{id:'madre',name:'Fannia',title:'Tu madre',look:LKR.madre,at:'place:ro_coliseo',dx:12,dz:12}],
  steps:[
   {obj:'Habla con el pretoriano Pudente para entrar en el Palatino',npc:'pretoriano',scene:[['Pudente','¿Una petición al emperador? Todo el mundo quiere una. Pero Tito dice que nadie debe irse triste después de hablar con él, así que… pasa. Con respeto, y sin hablar más de la cuenta.'],
    {who:'Pudente',ask:'¿Qué era la guardia pretoriana?',a:['La guardia personal del emperador, acampada en Roma','La policía de los barrios','Los soldados de las fronteras'],ok:'Así es. Somos nueve cohortes, las mejor pagadas del ejército. Y a veces hemos decidido quién era emperador.',ko:'No. Nuestro nombre viene del «pretorio», la tienda del general.'}]},
   {obj:'Presenta tu petición al emperador Tito',actor:'tito',scene:[['Tito','Herculano… Estuve allí hace unas semanas. No queda nada en pie. Habla.'],
    ['','Le cuentas todo: la barca, la venta en Puteoli, Hermeros, la isla, el incendio. Plinio declara que la flota de su tío recogió niños en la costa. Hermeros jura que la compró a un traficante y que nació libre. Y tú le enseñas la tablilla de cera.'],
    ['Tito','¿Qué pone aquí?'],
    ['Tercia','Mater, frater, domus. Madre, hermano, casa. Y esa es la montaña antes de estallar.'],
    {ask:'Tito pregunta: ¿por qué Tercia es libre según la ley, aunque la vendieran?',a:['Porque nació libre, hija de ciudadanos, y además la ley de Claudio libera a los esclavos abandonados enfermos en la isla','Porque el emperador puede hacer lo que quiera','Porque Hermeros es un liberto'],ok:'«Por partida doble», dice Tito, sonriendo. «Nadie puede vender la libertad de un ciudadano, y Claudio ya había decidido sobre los que se abandonan en la isla».',ko:'Recuerda lo que te dijeron Tácito y el médico Asclepíades.'},
    ['Tito','Que se borre esa venta del registro de Saturno. Tercia, hija de ciudadanos de Herculano, es libre. Y que la comisión de Campania pague a vuestra familia una casa en Neápolis, con los bienes de los que murieron sin herederos.'],
    ['Tito','Hoy no he perdido el día.']]},
   {obj:'Ve con Tercia al anfiteatro: alguien os espera',go:'place:ro_coliseo',r:40,h:18,at:'actor:madre',scene:[['','Junto a los arcos del anfiteatro hay una mujer con un bastón y un manto azul. Plinio ha pagado su viaje desde Neápolis.'],
    ['Tercia','¡Mater!'],
    ['Fannia','Mis niños. Mis dos niños.'],
    ['','Tu madre os abraza a los dos. No dice nada más durante un buen rato. Luego mira la tablilla de cera y se ríe entre lágrimas.'],
    ['Fannia','Tendremos que volver a dibujar la casa. La nueva.']]}],
  end:'Tercia es libre, tu familia vuelve a estar unida y tenéis una casa nueva en Neápolis. Detrás de vosotros, el anfiteatro sigue rugiendo, como si nada hubiera pasado.',
  learn:'El emperador concentraba todo el poder, pero se presentaba como «el primer ciudadano» y debía mostrarse generoso: escuchaba peticiones, daba juegos y repartía ayudas. Tito (79-81) fue muy popular por su reacción ante el Vesubio, el incendio y la epidemia; reinó solo dos años.'}
];
const STORY_FIN_ROMA={title:'La tablilla de Tercia',txt:['Has terminado la historia de Roma. Buscando a tu hermana has recorrido la ciudad entera: la salutatio de un senador, el templo de Vesta, los registros del tesoro, el Emporio, una escuela, la isla de Esculapio, el Trastévere, el anfiteatro, el incendio del Campo de Marte y el Palatino. Y, con Tercia, has seguido el trigo desde África y Egipto hasta el Emporio.',
 'Tercia, tu familia, Grato, Hermeros, Débora y Primo son inventados. Tito, Plinio el Joven, Tácito, Prisco y la ley de Claudio son reales, y también lo son la erupción del 79, el incendio y la epidemia del 80, la inauguración del anfiteatro y los juicios por la libertad, como el de Petronia Justa de Herculano.',
 'Ahora puedes seguir explorando libremente.']};
