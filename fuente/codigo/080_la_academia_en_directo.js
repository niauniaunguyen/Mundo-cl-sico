// ============================================================ LA ACADEMIA EN DIRECTO: una sesión con Platón (modo Atenas)
// Platón acaba de abrir su escuela en el bosque de Academo (h. 387 a.C.). La sesión avanza sola, como una conversación de verdad,
// y se detiene cuando Platón pregunta al jugador. Va enlazando lo que el jugador ya sabe (lecciones, caverna, sueños, palabras griegas…)
// y termina con un mapa del conocimiento. Los textos son del juego; las ideas, de los diálogos de Platón (Menón, Hipias mayor, República).
function acaz(){if(!state.aca||typeof state.aca!=='object')state.aca={n:0,done:0,best:0};return state.aca;}
const ACA={on:false,fig:null,ppl:[],line:0,timer:0,paused:false,steps:null,i:0,ok:0,box:null};
const ACA_WHO={P:'Platón',E:'Espeusipo',T:'Teeteto',J:'Un joven ateniense',N:'Narración'};
const ACA_COL={P:'#f0c890',E:'#a8c4e0',T:'#c8e0a0',J:'#e0b0c8',N:'#c9b9a2',Y:'#ffe2a8'};
// figuras que Platón dibuja en la arena (SVG en el diálogo)
function acaFig(k){const S=(w,h,inner)=>'<svg viewBox="0 0 '+w+' '+h+'" style="width:min(260px,70%);display:block;margin:6px auto;background:#d9c49a;border-radius:8px" aria-hidden="true"><g fill="none" stroke="#5a3a1e" stroke-width="2" stroke-linecap="round">'+inner+'</g></svg>';
  const T=(x,y,t)=>'<text x="'+x+'" y="'+y+'" fill="#5a3a1e" stroke="none" font-size="13" font-family="Georgia" text-anchor="middle">'+t+'</text>';
  if(k==='sq')return S(200,150,'<rect x="60" y="25" width="80" height="80"/>'+T(100,125,'lado 2 · área 4'));
  if(k==='sq4')return S(200,190,'<rect x="20" y="10" width="160" height="160"/><path d="M100 10v160M20 90h160" stroke-dasharray="4 4"/>'+T(100,185,'lado 4 · área 16, no 8'));
  if(k==='sq3')return S(200,170,'<rect x="40" y="10" width="120" height="120"/>'+T(100,155,'lado 3 · área 9, no 8'));
  if(k==='diag')return S(200,200,'<rect x="20" y="20" width="160" height="160" stroke-dasharray="4 4"/><path d="M100 20L180 100L100 180L20 100Z" stroke-width="3"/><path d="M20 20h80v80h-80z"/>'+T(100,196,'el cuadrado sobre la diagonal: área 8'));
  if(k==='sun')return S(220,150,'<circle cx="60" cy="60" r="22"/><path d="M60 22v-12M60 98v12M22 60h-12M98 60h12M33 33l-8-8M87 87l8 8M33 87l-8 8M87 33l8-8"/><path d="M130 95q20-30 40 0q-20 30-40 0z"/><circle cx="150" cy="95" r="6"/><path d="M98 70L128 92" stroke-dasharray="3 4"/>'+T(110,140,'el sol hace ver; el Bien hace conocer'));
  if(k==='alma')return S(220,160,'<circle cx="110" cy="40" r="22"/><path d="M60 80h100l-15 30H75z"/><path d="M50 130h120"/>'+T(110,45,'razón')+T(110,100,'ánimo')+T(110,150,'deseo'));
  return '';}
// enlaces con lo que el jugador ya ha hecho en el juego (cada uno solo si es verdad)
function acaKnows(){const L=state.lessons||[],P=state.places||[],K={};const kn=k=>{try{return vocKnown(k);}catch(e){return false;}};
  K.n=L.length;K.pl=P.length;K.my=(state.myths||[]).length;
  try{K.dream=dreamCount()[0];}catch(e){K.dream=0;}
  try{K.cav=cavz().done||cavz().visits;}catch(e){K.cav=0;}
  try{K.gor=finz().gor;K.eleu=finz().eleu;}catch(e){}
  try{K.cefis=artz().done&&artz().done.cefis;}catch(e){}
  try{K.ovid=Object.keys(ovz().seen||{}).length;}catch(e){K.ovid=0;}
  try{K.daed=wz().own||wz().got.length>0;}catch(e){}
  K.teeteto=L.includes('teeteto');K.isocrates=L.includes('isocrates');K.aristipo=L.includes('aristipo');K.antistenes=L.includes('antistenes');K.orfeo=L.includes('orfeotelesta');
  K.pnyx=P.includes('pnyx');K.teatro=P.includes('teatro');
  K.verdad=kn('verdad');K.ley=kn('ley');K.ciudad=kn('ciudad');K.dios=kn('dios');K.escuela=kn('escuela');
  K.so=qLv('so');K.lo=qLv('lo');K.ar=qLv('ar');K.eu=qLv('eu');K.kl=qLv('kl');return K;}
function acaScript(){const K=acaKnows(),fem=typeof pjFem==='function'&&pjFem(),me=(typeof fxNombre==='function'?fxNombre():'')||'forastero',S=[];
  const s=(w,t,f)=>S.push({w,t,f}),ask=(q,opts)=>S.push({ask:q,opts}),pause=t=>S.push({w:'N',t});
  pause('Bajo los olivos sagrados del bosque de Academo, junto a una exedra de piedra, una docena de jóvenes se sienta en círculo. Nadie paga: Platón no cobra, a diferencia de los sofistas. En medio, una zona de arena alisada para dibujar.');
  if(fem)pause('Algunos te miran con sorpresa: no hay mujeres en el círculo. Platón les hace un gesto para que callen y te señala un sitio. (Dentro de unos años estudiarán aquí dos mujeres, Axiotea de Fliunte y Lastenia de Mantinea; de Axiotea se decía que venía vestida de hombre.)');
  s('P','Bienvenido'+(fem?'a':'')+', '+me+'. Hoy no voy a enseñaros nada. Vamos a buscar juntos qué es saber algo.');
  s('E','Mi tío dice siempre lo mismo, y luego se pasa la mañana preguntando.');
  if(K.n>0)s('P','Me dicen que en estos días has hablado con '+K.n+(K.n===1?' maestro':' maestros')+' de la ciudad'+(K.pl?', que conoces '+K.pl+(K.pl===1?' lugar':' lugares'):'')+(K.my?' y '+K.my+' relieves con sus mitos':'')+'. Mucho saber, ¿no? ¿O mucha opinión?');
  else s('P','Acabas de llegar a Atenas, pero seguro que ya crees saber muchas cosas. Veamos si las sabes, o solo las opinas.');
  ask('Un hombre conoce el camino a Larisa sin haber ido nunca, porque se lo han explicado bien. ¿Sabe el camino?',[
   ['Sí, lo sabe',0,'Lo recorrerá bien, es cierto. Pero si alguien le dice otra cosa, ¿cómo lo defenderá? No sabe por qué es ese el camino.'],
   ['Tiene una opinión verdadera, pero no sabe',1,'Exacto. La opinión verdadera sirve tanto como el saber mientras dura; pero se escapa, como las estatuas de Dédalo, que según dicen huían si no las atabas.'],
   ['No sabe nada en absoluto',0,'No tanto: si llega a Larisa, algo sabía. Lo que tiene es una opinión verdadera, que no es poco.']]);
  if(K.daed)s('J','¡Dédalo! '+me+' dice que lo ha visto, encerrado en su laberinto de Creta.');
  s('P','Para que una opinión verdadera se convierta en saber hay que atarla dando la razón de por qué es así. Os lo enseñaré con un dibujo.');
  s('P','Mirad este cuadrado: cada lado mide dos pies. ¿Cuánto mide su área?','sq');s('T','Cuatro pies cuadrados.','sq');
  s('P','Ahora quiero un cuadrado del doble de área: de ocho pies.','sq');
  ask('¿Qué lado tiene el cuadrado de área ocho?',[
   ['El doble: cuatro pies',0,'Dibújalo y cuéntalo: con lado cuatro salen dieciséis, el doble del doble. Es lo que contestó el esclavo de Menón la primera vez.','sq4'],
   ['Tres pies',0,'Más cerca, pero tres por tres son nueve, no ocho. También lo probó el esclavo. Mira ahora la diagonal.','sq3'],
   ['La diagonal del primer cuadrado',1,'¡Eso es! El cuadrado construido sobre la diagonal tiene exactamente el doble de área. Cuéntalo tú mismo: son cuatro medios cuadrados.','diag']]);
  s('P','Mira el dibujo: cuatro mitades del cuadrado pequeño dentro del grande. Ocho.','diag');
  s('T','Y fíjate en lo extraño: esa diagonal no se puede medir con el lado. No hay ningún número entero, ni ninguna fracción, que diga cuántas veces cabe uno en otro. Son inconmensurables.','diag');
  if(K.teeteto)s('T','Ya te lo conté el otro día: Teodoro lo demostró para las raíces de tres, de cinco y hasta la de diecisiete. Yo estoy intentando demostrarlo para todas.');
  s('P','Ahora decidme: nadie le enseñó esto al esclavo de Menón. Yo solo le pregunté. ¿De dónde sacó la respuesta?');
  ask('¿De dónde sacó el esclavo la respuesta, si nadie se la dio?',[
   ['La adivinó por suerte',0,'¿Por suerte, después de equivocarse dos veces y corregirse él solo? La suerte no corrige.'],
   ['Ya la tenía dentro: la recordó',1,'Eso creo yo. Aprender es recordar lo que el alma ya vio antes de nacer. Si es así, el alma es inmortal.'],
   ['Se la enseñó Platón sin darse cuenta',0,'Es una buena objeción, y la tengo en cuenta. Pero yo solo pregunté; las respuestas eran suyas.']]);
  if(K.verdad)s('P','Tú sabes ya algo de nuestra lengua: dime, ¿qué significa ἀλήθεια? «Lo que no se olvida», «lo que no está oculto». Fíjate: la verdad, en griego, es un des-olvido.');
  if(K.dream)s('E','Dicen que '+me+' ha visto en sueños '+K.dream+(K.dream===1?' mito':' mitos')+' como si los hubiera vivido.');
  if(K.dream||K.eleu||K.orfeo)s('P','No me extraña. Los sueños, los misterios'+(K.eleu?' de Eleusis, en los que te iniciaste,':'')+(K.orfeo?' y los cantos de los órficos':'')+' dicen a su manera lo mismo: el alma viene de otro lugar y lo recuerda a ratos.');
  s('P','Vamos un paso más allá. Hipias me dijo una vez que lo bello es una muchacha bella. Pero también es bella una yegua, una lira, incluso una olla bien hecha.');
  ask('Una muchacha, una yegua y una olla son bellas. ¿Qué tienen en común?',[
   ['Nada: cada una es bella a su manera',0,'Entonces la palabra «bello» no significaría nada. Y sí significa algo: algo comparten.'],
   ['Que son útiles',0,'¿Una muchacha bella es bella porque sea útil? Lo útil y lo bello no son lo mismo, aunque a veces vayan juntos.'],
   ['Todas participan de lo Bello mismo',1,'Así lo veo yo. Hay una Belleza que no es ninguna cosa bella y que hace bellas a todas: no envejece, no cambia, no depende de quién la mire. A esas realidades las llamo Ideas, Formas.']]);
  if(K.cefis)s('J','Como la estatua de la Paz que hace Cefisodoto: '+me+' le hizo de modelo.');
  if(K.cefis||K.teatro)s('P','Las estatuas y los poemas imitan las cosas, y las cosas imitan las Ideas: el artista copia una copia. Por eso desconfío un poco de los poetas'+(K.teatro?' que aplaudís en el teatro':'')+'.');
  if(K.ovid)s('E','Los poetas cuentan que todo se transforma: ninfas en árboles, hombres en lobos. '+me+' anda buscando esas historias por todas partes.');
  if(K.ovid)s('P','Las cosas de este mundo cambian sin parar, como decía Heráclito. Por eso no se las puede saber del todo. Solo lo que no cambia se puede saber.');
  s('P','Ahora, la pregunta que más me importa: ¿por qué ser justo?');
  ask('Si tuvieras un anillo que te volviera invisible, como el pastor Giges, ¿seguirías siendo justo?',[
   ['No: si nadie me ve, no hay castigo',0,'Eso responden casi todos con sinceridad. Pero entonces la justicia sería solo miedo. Yo creo que el injusto se daña a sí mismo, aunque nadie lo vea.'],
   ['Sí: la justicia es buena para el alma',1,'Esa es la respuesta que intento demostrar. Un alma justa es un alma en orden, y un alma en orden es feliz.'],
   ['Depende de lo que me convenga',0,'Eso decía Trasímaco: que la justicia es lo que conviene al más fuerte. ¿Y si lo que te conviene es ser justo?']]);
  s('P','Pensad en el alma como en tres partes: la razón, que piensa; el ánimo, que se indigna y se atreve; y el deseo, que quiere comer, beber, tener. La justicia es que cada parte haga lo suyo y la razón gobierne.','alma');
  s('P','Con la ciudad pasa lo mismo: gobernantes que piensan, guardianes valientes, productores que trabajan. Esta ciudad nuestra, que vota en la Pnix lo que dice el orador más hábil, ¿la gobierna la razón?','alma');
  if(K.pnyx)s('J',me+' ha estado en la Asamblea: que lo cuente.');
  if(K.gor)s('P','Tú derrotaste en un debate a un discípulo de Gorgias. Él enseña a convencer; yo intento enseñar a buscar la verdad. La retórica sin filosofía es como la cocina sin medicina: agrada, pero no cura.');
  if(K.isocrates)s('E','Isócrates, el de la escuela de al lado, dice que la filosofía de mi tío no sirve para nada práctico.');
  if(K.isocrates)s('P','Isócrates enseña a hablar bien de cosas probables. Yo prefiero buscar despacio cosas ciertas. Ya veremos qué escuela dura más.');
  s('P','Os enseñaré la última imagen. ¿Qué necesitan los ojos, además de las cosas, para ver?','sun');
  ask('¿Qué hace falta para que el ojo vea las cosas?',[
   ['Solo tener buenos ojos',0,'De noche tienes los mismos ojos y no ves. Falta algo.','sun'],
   ['La luz del sol',1,'Eso es. El sol da la luz con la que vemos y hace crecer las cosas. Pues lo que el sol es para la vista, el Bien es para el saber: lo que hace que las Ideas se puedan conocer.','sun'],
   ['Que las cosas sean bonitas',0,'Lo feo también se ve. Falta algo que no está ni en el ojo ni en la cosa.','sun']]);
  if(K.cav)s('P','Tú lo sabes mejor que nadie: has salido de la caverna y has mirado ese sol. Nadie que haya subido quiere volver a las sombras… y, sin embargo, hay que volver, para ayudar a los que siguen dentro.');
  else s('P','Imaginad unos prisioneros que solo han visto sombras en el fondo de una cueva. Si uno sale y ve el sol, ¿le creerán cuando vuelva? Algún día escribiré esa imagen.');
  s('P','No os he enseñado nada hoy. Solo he preguntado. Lo que habéis encontrado ya era vuestro.');
  s('E','Siempre termina así. Y lo peor es que tiene razón.');
  return {S,K};}
// ---- la escena: oyentes alrededor de Platón
function acaScene(on){for(const g of ACA.ppl)scene.remove(g);ACA.ppl.length=0;if(!on)return;const P=npcObjs.find(o=>o.data.id==='platon');if(!P)return;
  const looks=[{chiton:'#ece6d8',himation:'#4a5a6e',beard:true,hair:'#3b2a1e'},{chiton:'#efe9dc',himation:'#6b7a4e',beard:true,hair:'#2a2018'},{chiton:'#e8e0d0',hair:'#3a2a1a'},{chiton:'#e0d8c8',himation:'#7a5a4a',hair:'#5a3a2a'},{chiton:'#ece4d4',hair:'#2a1a10'},{chiton:'#e4dccc',himation:'#5a6a7a',hair:'#4a3a2a'}];
  looks.forEach((lk,i)=>{const a=Math.PI*0.25+i*Math.PI*0.3,r=4.2,x=P.x+Math.cos(a)*r,z=P.z+Math.sin(a)*r;const g=makePerson(Object.assign({noVary:true},lk));
    g.position.set(x,floorAt(x,z)-0.35,z);g.rotation.y=Math.atan2(P.x-x,P.z-z);scene.add(g);ACA.ppl.push(g);});}
// ---- el motor de la sesión en directo
function acaOpts(n,add){if(MODE!=='atenas'||n.id!=='platon')return;const a=acaz();
  add(a.done?'Asistir de nuevo a una sesión de la Academia':'Asistir a una sesión de la Academia, en directo','quiz',acaStart);
  if(a.done)add('Ver mi mapa del conocimiento','',()=>{$('dBody').innerHTML=acaMap();renderOpts();});}
function acaStart(){if(clock.h<7||clock.h>17){$('dBody').innerHTML='<p>«Las sesiones son por la mañana, cuando la cabeza está despejada. Vuelve mañana temprano».</p>';renderOpts();return;}
  const {S,K}=acaScript();ACA.steps=S;ACA.K=K;ACA.i=0;ACA.ok=0;ACA.on=true;ACA.paused=false;acaScene(true);
  const one=casaOpen('Π','La Academia','sesión en directo con Platón');const B=$('dBody');B.innerHTML='<div class="acaLog" id="acaLog"></div>';ACA.box=$('acaLog');
  if(!$('acaCSS')){const st=document.createElement('style');st.id='acaCSS';st.textContent='.acaLog{max-height:52vh;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding-right:4px}.acaL{animation:acaIn .35s ease-out;line-height:1.45}.acaL b{font-weight:600}.acaL.n{font-style:italic;opacity:.85}.acaL.y{border-left:3px solid #ffe2a8;padding-left:8px}@keyframes acaIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}';document.head.appendChild(st);}
  acaNext();}
function acaLine(w,t,fig){const d=document.createElement('div');d.className='acaL'+(w==='N'?' n':'')+(w==='Y'?' y':'');
  d.innerHTML=(w==='N'?'':'<b style="color:'+ACA_COL[w]+'">'+(w==='Y'?'Tú':ACA_WHO[w])+':</b> ')+'<span></span>'+(fig?acaFig(fig):'');d.querySelector('span').textContent=w==='N'||w==='Y'?t:'«'+t+'»';
  ACA.box.appendChild(d);try{if(w!=='N'&&w!=='Y')vocWalk(d);}catch(e){}ACA.box.scrollTop=ACA.box.scrollHeight;
  try{if(aOK()&&w!=='N')sfxTap();}catch(e){}}
function acaCtl(){const o=$('dOpts');o.innerHTML='';const mk=(t,f,c)=>{const b=document.createElement('button');b.textContent=t;if(c)b.className=c;b.onclick=f;o.appendChild(b);};
  mk('Seguir ▸',()=>{clearTimeout(ACA.timer);acaNext();},'quiz');mk(ACA.paused?'Reanudar la sesión':'Pausa',()=>{ACA.paused=!ACA.paused;clearTimeout(ACA.timer);if(!ACA.paused)acaNext();else acaCtl();});
  mk('Salir de la sesión',acaEnd);}
function acaNext(){if(!ACA.on||$('dialog').hidden){acaEnd(true);return;}const st=ACA.steps[ACA.i++];if(!st)return acaFinish();
  if(st.ask){acaLine('P',st.ask);const o=$('dOpts');o.innerHTML='';
    st.opts.slice().sort(()=>R()-0.5).forEach(([t,ok,rep,fig])=>{const b=document.createElement('button');b.className='quiz';b.textContent=t;b.onclick=()=>{acaLine('Y',t);if(ok)ACA.ok++;
      setTimeout(()=>{acaLine('P',(ok?'':'')+rep,fig);acaCtl();ACA.timer=setTimeout(acaNext,2600+rep.length*30);},700);o.innerHTML='';};o.appendChild(b);});return;}
  acaLine(st.w,st.t,st.f);acaCtl();if(!ACA.paused)ACA.timer=setTimeout(acaNext,1800+st.t.length*32);}
function acaFinish(){clearTimeout(ACA.timer);const a=acaz(),first=!a.done,tot=ACA.steps.filter(s=>s.ask).length;a.n++;a.best=Math.max(a.best||0,ACA.ok);a.done=1;save();
  if(first){qAdd('so',3,'Una mañana en la Academia te ha enseñado a preguntar.');qAdd('lo',2);qAdd('kl',1,'Ya te cuentan entre los que van a la Academia.');}
  else if(!a.day||a.day!==state.day){qAdd('so',1);}a.day=state.day;save();
  const o=$('dOpts');o.innerHTML='';acaLine('N','La sesión termina. Los alumnos se levantan y siguen discutiendo por el camino de vuelta a la ciudad. Has acertado '+ACA.ok+' de las '+tot+' preguntas de Platón.');
  const b=document.createElement('button');b.className='quiz';b.textContent='Ver mi mapa del conocimiento';b.onclick=()=>{$('dBody').innerHTML=acaMap();o.innerHTML='';const c=document.createElement('button');c.textContent='Despedirse';c.onclick=()=>acaEnd();o.appendChild(c);};o.appendChild(b);
  const c=document.createElement('button');c.textContent='Despedirse';c.onclick=()=>acaEnd();o.appendChild(c);}
function acaEnd(silent){clearTimeout(ACA.timer);ACA.on=false;acaScene(false);if(!silent)closeDialog();}
// ---- el mapa del conocimiento: las Ideas en el centro y, alrededor, lo que el jugador ha enlazado con ellas
function acaMap(){const K=acaKnows();const N=[
  ['Geometría','el cuadrado doble'+(K.teeteto?' · Teeteto y los inconmensurables':''),true],
  ['El alma recuerda','aprender es recordar'+(K.verdad?' · ἀλήθεια':'')+(K.dream?' · tus sueños':'')+(K.eleu?' · Eleusis':''),!!(K.verdad||K.dream||K.eleu||K.orfeo)],
  ['Lo Bello','las Ideas'+(K.cefis?' · la estatua de Cefisodoto':'')+(K.teatro?' · el teatro':''),!!(K.cefis||K.teatro)],
  ['Lo que cambia','Heráclito'+(K.ovid?' · '+K.ovid+' metamorfosis':''),K.ovid>0],
  ['La justicia','el anillo de Giges · el alma en tres partes'+(K.pnyx?' · la Asamblea':''),true],
  ['Retórica o filosofía',(K.gor?'tu debate con Gorgias':'convencer o buscar la verdad')+(K.isocrates?' · Isócrates':''),!!(K.gor||K.isocrates)],
  ['El Bien','el sol'+(K.cav?' · tu salida de la caverna':''),!!K.cav],
  ['Opinión y saber','el camino a Larisa'+(K.daed?' · las estatuas de Dédalo':''),true]];
  const cx=240,cy=195,R0=135;let svg='<svg viewBox="0 0 480 390" style="width:100%;max-width:440px;display:block;margin:auto" role="img" aria-label="Mapa del conocimiento"><g font-family="Georgia" text-anchor="middle">';
  N.forEach((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/N.length,x=cx+Math.cos(a)*R0,y=cy+Math.sin(a)*R0;svg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'" stroke="'+(n[2]?'#d9874a':'#6a5a4a')+'" stroke-width="'+(n[2]?2.5:1)+'" stroke-dasharray="'+(n[2]?'':'4 4')+'"/>';});
  svg+='<circle cx="'+cx+'" cy="'+cy+'" r="42" fill="#3a2a1a" stroke="#f0c890" stroke-width="2"/><text x="'+cx+'" y="'+(cy-2)+'" fill="#f0c890" font-size="15">Las Ideas</text><text x="'+cx+'" y="'+(cy+16)+'" fill="#c9b9a2" font-size="10">ἰδέαι</text>';
  N.forEach((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/N.length,x=cx+Math.cos(a)*R0,y=cy+Math.sin(a)*R0;const w=n[0].split(' '),ln=n[0].length>11&&w.length>1?[w.slice(0,Math.ceil(w.length/2)).join(' '),w.slice(Math.ceil(w.length/2)).join(' ')]:[n[0]],dx=Math.abs(Math.cos(a))>0.5?Math.sign(Math.cos(a))*16:0,anc=dx>0?'start':dx<0?'end':'middle',ty=dx?y+4-(ln.length-1)*7:y+(Math.sin(a)>0.3?24:-14-(ln.length-1)*14);svg+='<circle cx="'+x+'" cy="'+y+'" r="9" fill="'+(n[2]?'#f0c890':'#3a3028')+'" stroke="#d9874a"/><text x="'+(x+dx)+'" y="'+ty+'" text-anchor="'+anc+'" fill="'+(n[2]?'#f1e8d8':'#8a7a6a')+'" font-size="12">'+ln.map((t,j)=>'<tspan x="'+(x+dx)+'" dy="'+(j?14:0)+'">'+t+'</tspan>').join('')+'</text>';});
  svg+='</g></svg>';
  const lit=N.filter(n=>n[2]).length;
  return '<div class="novoc"><p><b>Tu mapa del conocimiento</b> · '+lit+' de '+N.length+' enlaces encendidos</p>'+svg+'<ul>'+N.map(n=>'<li'+(n[2]?'':' style="opacity:.55"')+'><b>'+n[0]+'</b>: '+n[1]+(n[2]?'':' <span class="sub">(aún sin enlazar: búscalo por el juego)</span>')+'</li>').join('')+'</ul><p class="sub">Nota: Platón escribirá el Menón hacia el 385 y la República hacia el 375; en el 386 son ideas que está madurando. La famosa inscripción «que no entre quien no sepa geometría» es una leyenda muy posterior.</p></div>';}

// si se cierra el diálogo a mitad de sesión (Esc), se recoge la escena
const closeDialogAca=closeDialog;
closeDialog=function(){if(ACA.on){ACA.on=false;clearTimeout(ACA.timer);acaScene(false);}closeDialogAca();};

