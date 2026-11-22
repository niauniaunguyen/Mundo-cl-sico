// ============================================================ JUGABILIDAD (4): diario de misiones, calendario, discursos y cargos (22/11)
// G1 Diario de misiones: todas las misiones abiertas en una lista (botón del rollo en la barra de arriba, o pulsando el objetivo);
//    eliges cuál sigue la luz y la brújula. Si no eliges, manda la de siempre.
// G2 Calendario: los próximos doce días con lo que pasa en cada uno (mercados, asambleas, fiestas, juegos). La víspera te avisa y,
//    si llegas a tiempo, asistir cuenta (fama, piedad, saber). Si no llegas, la ocasión pasa.
// G3 Discursos (sin violencia: se gana con palabras). El personaje es forastero, y un forastero no podía hablar en la Asamblea ni
//    en una contio: por eso, en Atenas, trabaja de logógrafo con Lisias (meteco y logógrafo él mismo) escribiendo discursos para
//    clientes ciudadanos, sobre casos de sus discursos conservados (Lisias 24, 7 y 22); en Roma, declama en la escuela de Quintiliano
//    temas de las Suasorias que recogió Séneca el Viejo. Se eligen argumentos por el carácter (ethos), la emoción (pathos) o la razón
//    (logos), según lo que pide el público en cada momento (Aristóteles, Retórica I 2).
// G4 Cargos con responsabilidades, posibles para un forastero:
//    · Atenas: corego en las Leneas. Los metecos podían costear un coro en las Leneas (no en las Dionisias); es una liturgia cara y
//      honrosa. Hay que ser meteco (registrarse con un patrono, el prostátes).
//    · Roma: en el año 80, los magistrados de Roma ya los elegía en la práctica el Senado; las campañas con carteles pintados (los
//      programmata de Pompeya) siguen en los municipios. Aquí, en Tarraco, ayudas a un candidato a edil: pintas sus carteles con la
//      fórmula correcta y pides el voto. El candidato es inventado.
function x4z(){if(!state.x4||typeof state.x4!=='object')state.x4={};const z=state.x4;z.tro=z.tro||{};z.cal=z.cal||{};z.ret=z.ret||{n:0};z.car=z.car||{};return z;}
const X4={mc:null,mcT:0,extra:[],ui:null};
function x4Coin(n){return n+' '+(MODE==='roma'?'sestercios':'óbolos');}
// ---- panel con el material del HUD
function x4CSS(){if($('x4CSS'))return;const s=document.createElement('style');s.id='x4CSS';s.textContent=
 '#x4P{position:fixed;inset:0;z-index:65;display:flex;align-items:center;justify-content:center;background:rgba(8,6,4,.5)}#x4P[hidden]{display:none}'+
 '#x4P .c{width:min(640px,94vw);max-height:84vh;overflow:auto;box-sizing:border-box;padding:28px 30px 24px;color:#fbe6c8;font-family:var(--f-body);background:rgba(22,16,12,.96) no-repeat;background-size:100% 100%}'+
 'body.hz #x4P .c{background-color:transparent}#x4P h3{margin:0 0 4px;font:400 1.35rem var(--f-display);color:#ffe0b4;letter-spacing:.03em;text-shadow:0 0 3px #000}'+
 '#x4P .tabs{display:flex;gap:6px;margin:8px 0 12px;flex-wrap:wrap}#x4P .tabs button{font:600 .85rem var(--f-display);letter-spacing:.06em;padding:5px 12px;border-radius:999px;border:1px solid rgba(240,200,144,.45);background:rgba(0,0,0,.25);color:#f1d2ae;cursor:pointer}'+
 '#x4P .tabs button.on{background:rgba(217,135,74,.45);color:#fff3df}#x4P .x{float:right;background:none;border:0;color:#f1d2ae;font-size:1.3rem;cursor:pointer}'+
 '#x4P .m{display:flex;gap:10px;align-items:flex-start;padding:9px 10px;margin:0 0 7px;border-left:3px solid #c9773f;background:rgba(0,0,0,.22);border-radius:0 8px 8px 0;text-shadow:0 0 2px #000}'+
 '#x4P .m.tr{border-left-color:#ffd27a;background:rgba(255,200,110,.12)}#x4P .m .tx{flex:1}#x4P .m small{display:block;color:#d9b48c;font-size:.8rem}#x4P .m .k{font:600 .7rem var(--f-display);letter-spacing:.14em;text-transform:uppercase;color:#e8b07a}'+
 '#x4P .m button,#x4P .bt{font:600 .85rem var(--f-display);padding:5px 12px;border-radius:999px;border:1px solid #d9874a;background:#3a2a1c;color:#f3e6cf;cursor:pointer;white-space:nowrap}'+
 '#x4P .day{display:grid;grid-template-columns:86px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(240,200,144,.15)}#x4P .day b{color:#ffe0b4}#x4P .day.hoy b{color:#ffd27a}'+
 '#x4P .tro{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}#x4P .tro div{padding:8px;border:1px solid rgba(240,200,144,.3);border-radius:8px;background:rgba(0,0,0,.2);font-size:.85rem}#x4P .tro b{display:block;color:#ffe0b4;font-size:1.4rem}'+
 '#bMis svg{width:20px;height:20px}';document.head.appendChild(s);}
function x4Panel(title,tabs,cur){x4CSS();let d=$('x4P');if(!d){d=document.createElement('div');d.id='x4P';document.body.appendChild(d);d.addEventListener('click',e=>{if(e.target===d)x4Close();});
    addEventListener('keydown',e=>{if(!d.hidden&&e.code==='Escape'){e.stopPropagation();x4Close();}},true);}
  const T=tabs[cur]||tabs[Object.keys(tabs)[0]];
  d.innerHTML='<div class="c"><button class="x" aria-label="Cerrar">✕</button><h3>'+title+'</h3><div class="tabs">'+Object.keys(tabs).map(k=>'<button data-k="'+k+'" class="'+(k===cur?'on':'')+'">'+tabs[k].n+'</button>').join('')+'</div><div class="bd">'+T.h()+'</div></div>';
  d.hidden=false;X4.ui={title,tabs,cur};try{releasePointer();}catch(e){}if(ui==='play')ui='x4';
  d.querySelector('.x').onclick=x4Close;d.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>x4Panel(title,tabs,b.dataset.k));if(T.bind)T.bind(d);
  try{if(typeof HZ!=='undefined'&&HZ.on){const c=d.querySelector('.c');c._hzG=null;c._hzK=null;hzFit(c,HZ.a?(w,h)=>hzPanelA(w,h,{top:1,bot:1,r:10}):(w,h)=>hzPanelR(w,h,{top:1,bot:1}));}}catch(e){}}
function x4Close(){const d=$('x4P');if(d)d.hidden=true;if(ui==='x4')ui='play';try{requestPointer();}catch(e){}}
// ---- G1: las misiones abiertas
function x4Missions(){const now=performance.now();if(X4.mc&&now-X4.mcT<500)return X4.mc;const L=[];
  try{if(storyOn()){const c=curChapter(),s=curStoryStep();if(c)L.push({id:'story',k:'Historia',t:'Capítulo '+(state.story.ch+1)+' · '+c.title,s:s?s.obj:'',at:()=>storyTarget()});}}catch(e){}
  try{const s=curStep();if(s)L.push({id:'steps',k:'Primeros pasos',t:s.title,s:s.short||'',at:()=>s.at&&s.at()});}catch(e){}
  try{const h=hz();if(h.q==='on'||h.q==='caught')L.push({id:'horse',k:'El caballo',t:h.q==='on'?'Busca la yegua escapada':'Vuelve a hablar con el criador',s:'',at:()=>horseTarget()});}catch(e){}
  try{const z=hmz();if(z.on&&HM.run&&HM.run.M)L.push({id:'hermes',k:'Encargo de '+hmName(),t:HM.run.M.t,s:HM.run.M.asp||'',at:()=>HM.tg||null});}catch(e){}
  try{const z=jmz();if(z.enc)z.enc.list.forEach((e,i)=>{if(!e.done)L.push({id:'jm'+i,k:'Encargos de hoy',t:e.txt+(e.goal?' ('+(e.n||0)+'/'+e.goal+')':''),s:'',at:e.x!=null?()=>({x:e.x,z:e.z}):null});});}catch(e){}
  for(const f of X4.extra){try{const m=f();if(m)(Array.isArray(m)?m:[m]).forEach(q=>L.push(q));}catch(e){}}
  try{const t=nextTarget();if(t)L.push({id:'next',k:'Lecciones',t:'Siguiente lección: '+t.data.name,s:LESSONS[t.data.id]?LESSONS[t.data.id].where:'',at:()=>t});}catch(e){}
  X4.mc=L;X4.mcT=now;return L;}
{const f=hmBeacon;hmBeacon=function(x,z){try{HM.tg={x,z};}catch(e){}return f.apply(this,arguments);};}
{const f=hmClear;hmClear=function(){try{HM.tg=null;}catch(e){}return f.apply(this,arguments);};}
function x4Tracked(){const z=state&&x4z();if(!z||!z.track)return null;const m=x4Missions().find(q=>q.id===z.track);if(!m){z.track=null;return null;}return m;}
{const f=guideTarget;guideTarget=function(){try{const m=x4Tracked();if(m&&m.at){const p=m.at();if(p&&isFinite(p.x))return p;}}catch(e){}return f.apply(this,arguments);};}
{const f=updateStats;updateStats=function(){const r=f.apply(this,arguments);try{const m=x4Tracked();if(m)$('objective').innerHTML='<b>'+m.t+'</b><br><span class="sub">'+(m.s||m.k)+'</span>';}catch(e){}return r;};}
setInterval(()=>{try{if(state&&ui==='play'&&x4Tracked())updateStats();}catch(e){}},1500);
function x4TabMis(){const L=x4Missions(),z=x4z();if(!L.length)return '<p>No tienes misiones abiertas. Habla con la gente: siempre hay alguien que necesita algo.</p>';
  return '<p class="sub" style="margin:0 0 8px;color:#d9b48c">Elige qué misión sigue la luz y la brújula. Si no eliges ninguna, se sigue la principal.</p>'+L.map(m=>'<div class="m'+(z.track===m.id?' tr':'')+'"><div class="tx"><span class="k">'+m.k+'</span><br>'+m.t+(m.s?'<small>'+m.s+'</small>':'')+'</div>'+
    (m.at?'<button data-t="'+m.id+'">'+(z.track===m.id?'◆ Siguiendo':'Seguir')+'</button>':'<small style="max-width:90px">sin lugar fijo</small>')+'</div>').join('')+(z.track?'<button class="bt" data-t="">Volver a la misión principal</button>':'');}
function x4BindMis(d){d.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const z=x4z();z.track=b.dataset.t||null;save();X4.mcT=0;try{updateStats();}catch(e){}x4Diario('mis');});}
// ---- G2: calendario
function x4DayEvents(d){const out=[],sd=state.day;try{state.day=d;const e=todayEvent();if(e)out.push({t:e.title,s:e.short,h0:e.h0,h1:e.h1,at:e.at,id:e.id,r:e.r||30});
    const c=typeof dzCivic==='function'?dzCivic():null;if(c&&!(e&&e.id==='asamblea'))out.push(c.k==='senado'?{t:'Sesión del Senado',s:'En calendas e idus el Senado se reúne en la Curia (Suetonio, Augusto 35). Se puede mirar desde fuera.',h0:c.h0,h1:c.h1,id:'senado',at:()=>{const p=PLACES.find(q=>q.id==='ro_curia');return p?{x:p.x,z:p.z+14}:null;},r:30}:
      {t:'Asamblea en la Pnyx',s:'Unas 40 veces al año (Aristóteles, Const. ateniense 43). Solo votan los ciudadanos; los forasteros miran desde fuera.',h0:c.h0,h1:c.h1,id:'asamblea',at:()=>({x:PNYX.x,z:PNYX.z+(PNYX.rz||40)*0.8}),r:45});}finally{state.day=sd;}return out;}
function x4TabCal(){const d0=state.day||1,h=clock.h;let s='<p class="sub" style="margin:0 0 6px;color:#d9b48c">Lo que pasa en los próximos días. Si estás allí a tiempo, cuenta. La víspera te aviso.</p>';
  for(let d=d0;d<d0+12;d++){const E=x4DayEvents(d),lab=d===d0?'Hoy':d===d0+1?'Mañana':'Día '+d;let cn='';try{const c=calNow(d);cn=c&&c.txt?c.txt:'';}catch(e){}
    s+='<div class="day'+(d===d0?' hoy':'')+'"><div><b>'+lab+'</b>'+(cn?'<br><small>'+cn+'</small>':'')+'</div><div>'+(E.length?E.map(e=>'<b>'+e.t+'</b> <small>('+e.h0+'-'+e.h1+' h)</small><br><small>'+e.s+'</small>'+(x4z().cal[d+':'+e.id]?' <small style="color:#9fd08a">✔ asististe</small>':(d===d0&&h>=e.h1?' <small style="color:#d08a7a">ya pasó</small>':''))).join('<br>'):'<small>Un día corriente.</small>')+'</div></div>';}
  return s;}
X4.extra.push(()=>{if(!state)return null;const d=state.day||1,E=x4DayEvents(d).filter(e=>clock.h<e.h1&&e.at&&!x4z().cal[d+':'+e.id]);return E.map(e=>({id:'cal:'+e.id,k:'Hoy en el calendario',t:e.t+(clock.h<e.h0?' (empieza a las '+e.h0+' h)':' (ahora)'),s:e.s,at:()=>e.at()}));});
function x4CalTick(){if(!state||ui!=='play')return;const z=x4z(),d=state.day||1,h=clock.h;
  if(h>=18&&z.calAv!==d){z.calAv=d;const E=x4DayEvents(d+1);if(E.length){try{momento('start','Mañana: '+E[0].t,E[0].s);}catch(e){}save();}}
  for(const e of x4DayEvents(d)){const k=d+':'+e.id;if(z.cal[k]||h<e.h0||h>=e.h1||!e.at)continue;const p=e.at();if(!p)continue;if(Math.hypot(p.x-player.x,p.z-player.z)>(e.r||30)+10)continue;
    z.cal[k]=1;save();const fest=/fiesta|dionis|leneas|panaten|saturn|luperc|haloa|misterio|inaugur|carreras|naumaq/i.test(e.id+e.t);
    try{qAdd(fest?'eu':'so',1,fest?'Has acudido a la fiesta.':'Has estado donde pasaban las cosas.');}catch(er){}try{jmz().fama=(jmz().fama||0)+1;}catch(er){}
    try{momento('done',e.t,fest?'Has acudido: la ciudad te ha visto en la fiesta':'Has llegado a tiempo y lo has visto con tus propios ojos');}catch(er){}}}
// ---- el diario (con pestañas: misiones, calendario y lo que añadan otros sistemas)
const X4_TABS={mis:{n:'Misiones',h:x4TabMis,bind:x4BindMis},cal:{n:'Calendario',h:x4TabCal}};
function x4Diario(cur){x4Panel(MODE==='roma'?'Commentarii · tus asuntos':'Ὑπομνήματα · tus asuntos',X4_TABS,cur||'mis');}
function x4Btn(){if($('bMis')||!$('bar'))return;const b=document.createElement('button');b.id='bMis';b.className='ib';b.type='button';b.setAttribute('aria-label','Misiones y calendario');b.title='Misiones y calendario';
  b.innerHTML='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5"/><path d="M5 5a1.5 1.5 0 1 1 3 0v13"/><path d="M10 8h6M10 11h6M10 14h4"/></svg>';
  b.onclick=e=>{e.stopPropagation();if(ui==='play')x4Diario('mis');};const bar=$('bar');bar.insertBefore(b,bar.children[1]||null);
  const o=$('objective');if(o){o.style.cursor='pointer';o.title='Pulsa para ver todas tus misiones';o.addEventListener('click',e=>{e.stopPropagation();if(ui==='play')x4Diario('mis');});}}
// ---- G3: discursos
const X4_RET={
 atenas:[{t:'Defender a un inválido',c:'Un artesano tullido cobra la pensión pública de un óbolo diario; un vecino dice que no la merece (Lisias, discurso 24).',
   r:[{m:'Los jueces desconfían: ¿quién es este hombre que pide dinero público?',o:[['ethos','Presentarlo como vecino honrado que trabaja cuanto puede y nunca ha pleiteado.'],['logos','Citar la ley que concede la pensión a quien no puede trabajar.'],['pathos','Hacer llorar a los jueces con su desgracia desde el principio.']]},
    {m:'Ahora quieren hechos: ¿de verdad no puede trabajar?',o:[['logos','Recordar que necesita dos bastones y que su oficio apenas da para vivir.'],['ethos','Insistir en que es buena persona.'],['pathos','Describir lo triste que sería quitarle la pensión.']]},
    {m:'Al final, los jueces están cansados y deciden con el corazón.',o:[['pathos','Pedirles que no quiten al débil lo único que la ciudad le da.'],['logos','Repetir los argumentos de la ley.'],['ethos','Volver a hablar de su carácter.']]}]},
  {t:'El olivo sagrado',c:'Acusan a un propietario de haber arrancado un olivo sagrado de Atenea (moría) en su finca (Lisias, discurso 7).',
   r:[{m:'Los jueces del Areópago son ancianos y serios: miran quién habla.',o:[['ethos','Mostrar al acusado como hombre piadoso que ha cumplido sus liturgias.'],['pathos','Quejarse a gritos de la injusticia.'],['logos','Empezar con una lista de fechas.']]},
    {m:'Piden pruebas: ¿había olivo o no?',o:[['logos','Presentar testigos de que allí solo había un tocón cuando él compró la finca.'],['ethos','Decir que alguien tan piadoso nunca haría algo así.'],['pathos','Hablar del miedo que pasa la familia.']]},
    {m:'Para terminar, hay que conmover sin mentir.',o:[['pathos','Recordar que pierde la patria y los bienes por una calumnia.'],['logos','Volver a contar los testigos.'],['ethos','Insistir en las liturgias.']]}]},
  {t:'Los vendedores de grano',c:'En tiempos de escasez, unos vendedores compran más grano del permitido para subir el precio (Lisias, discurso 22). Tu cliente acusa.',
   r:[{m:'Los jueces temen al pueblo hambriento, pero no quieren parecer injustos.',o:[['ethos','Presentar a tu cliente como alguien que habla por el bien común, no por odio.'],['pathos','Gritar que los vendedores matan de hambre a la ciudad.'],['logos','Leer el precio del grano día a día.']]},
    {m:'Quieren saber qué dice la ley y qué hicieron.',o:[['logos','Recordar que la ley prohíbe comprar más de cincuenta cestas y que ellos lo admiten.'],['ethos','Repetir que tu cliente es honrado.'],['pathos','Describir el hambre en el Pireo.']]},
    {m:'Ahora hay que mover a los jueces a actuar.',o:[['pathos','Hacerles ver que los ciudadanos esperan su sentencia para comer.'],['logos','Volver a citar la ley.'],['ethos','Hablar de tu cliente.']]}]}],
 roma:[{t:'Alejandro ante el Océano',c:'Suasoria: Alejandro delibera si cruzar el Océano tras conquistar el mundo (Séneca el Viejo, Suasorias 1).',
   r:[{m:'Quintiliano y los alumnos esperan ver quién eres antes de escucharte.',o:[['ethos','Hablar como un viejo consejero que siempre fue leal a Alejandro.'],['pathos','Empezar llorando por los soldados.'],['logos','Enumerar las distancias del Océano.']]},
    {m:'Ahora piden razones.',o:[['logos','El Océano no tiene tierras ni enemigos que vencer: no hay nada que ganar.'],['ethos','Repetir que eres leal.'],['pathos','Describir las olas terribles.']]},
    {m:'El final debe conmover a Alejandro.',o:[['pathos','Que piense en sus soldados, que quieren volver a ver a sus familias.'],['logos','Resumir las razones.'],['ethos','Volver a presentarte.']]}]},
  {t:'Los trescientos en las Termópilas',c:'Suasoria: los trescientos espartanos deliberan si retirarse ante los persas (Suasorias 2). Debes aconsejar.',
   r:[{m:'Los «espartanos» quieren saber si eres digno de aconsejarles.',o:[['ethos','Hablar como un espartano que comparte su suerte.'],['logos','Calcular cuántos persas hay.'],['pathos','Suplicarles que no mueran.']]},
    {m:'Ahora quieren razones de peso.',o:[['logos','El paso es estrecho: allí el número no cuenta y se gana tiempo para Grecia.'],['ethos','Decir que eres valiente.'],['pathos','Hablar de las madres espartanas.']]},
    {m:'Un final que se recuerde.',o:[['pathos','«Cenaremos con los dioses»: la gloria vale más que la vida.'],['logos','Volver al número de persas.'],['ethos','Repetir que eres uno de ellos.']]}]},
  {t:'Cicerón y Antonio',c:'Suasoria: Cicerón delibera si pedir perdón a Marco Antonio para salvar la vida (Suasorias 6).',
   r:[{m:'Los alumnos esperan que muestres respeto por Cicerón.',o:[['ethos','Hablar como un amigo que admira su vida entera.'],['pathos','Empezar con la muerte que le espera.'],['logos','Recordar las leyes de la proscripción.']]},
    {m:'Ahora la razón.',o:[['logos','Pedir perdón no le salvaría: Antonio no perdona, y perdería su honra.'],['ethos','Repetir que lo admiras.'],['pathos','Describir su miedo.']]},
    {m:'El cierre.',o:[['pathos','Su voz, la de las Filípicas, vivirá más que él.'],['logos','Resumir el argumento.'],['ethos','Volver a tu amistad.']]}]}]};
function x4Ret(){const ro=MODE==='roma',L=X4_RET[ro?'roma':'atenas'],z=x4z(),C=L[z.ret.n%L.length];let sc=50,i=0;
  const step=()=>{if(i>=C.r.length){const ok=sc>=80;z.ret.n++;if(ok){z.ret.w=(z.ret.w||0)+1;save();cyPay(ro?6:5,ro?'Quintiliano te elogia':'El cliente gana el pleito');try{qAdd('lo',2,'Has convencido con palabras.');}catch(e){}
        try{momento('done',C.t,ro?'Quintiliano: «Así se habla en el foro»':'Tu cliente ha ganado con tu discurso');}catch(e){}if(z.ret.w>=3)x4Trofeo(ro?'declamator':'logografo',ro?'Declamador':'Logógrafo','Tres discursos que convencieron');}
      else{save();jmSay('<p>'+(ro?'Quintiliano sonríe a medias: «Bien, pero aún no convences. Escucha qué pide el público en cada parte».':'Tu cliente pierde por poco. Lisias: «Cada parte del discurso pide algo distinto: primero que se fíen de ti, luego razones, al final el corazón».')+'</p><p>Apoyo final: '+sc+'%.</p>');}return;}
    const R=C.r[i],ops=R.o.slice().sort(()=>Math.random()-0.5);
    jmDlg(ro?'Q':'Λ',(ro?'Declamación · ':'Discurso · ')+C.t,(i+1)+' de 3',(i===0?'<p>'+C.c+'</p>':'')+'<p><b>'+R.m+'</b></p><p class="sub">Apoyo del público: '+sc+'%</p>',
      ops.map(o=>[o[1],()=>{const best=o===R.o[0];sc=Math.max(0,Math.min(100,sc+(best?18:-8)));try{gfFloat((best?'+':'')+(best?18:-8)+' % · '+o[0],best?'#cfe0a8':'#e8a080');}catch(e){}i++;setTimeout(step,250);}]));};step();}
{const f=openDialog;openDialog=function(n){const r=f.apply(this,arguments);try{if(n&&(n.id==='lisias'||n.id==='quintiliano')&&ui==='dialog'){const o=$('dOpts'),b=document.createElement('button'),k=o.children.length+1;
    b.innerHTML='<span class="n">'+k+'</span><span>'+(n.id==='lisias'?'Escribir un discurso para un cliente (logógrafo)':'Declamar una suasoria')+'</span>';b.onclick=()=>{closeDialog();setTimeout(x4Ret,80);};o.insertBefore(b,o.firstChild);}
  if(n&&n.id==='lisias'&&ui==='dialog')x4CarOffer();}catch(e){}return r;};}
// ---- G4: cargos
function x4Car(){return x4z().car;}
function x4CarOffer(){if(MODE==='roma')return;const c=x4Car();if(c.st)return;const o=$('dOpts'),b=document.createElement('button');b.innerHTML='<span class="n">·</span><span>¿Puede un meteco costear un coro?</span>';b.onclick=()=>{closeDialog();setTimeout(x4CoregoStart,80);};o.appendChild(b);}
function x4CoregoStart(){const c=x4Car(),met=(typeof fxz==='function'&&fxz().st==='meteco');
  if(!met){jmSay('<p>Lisias: «En las Leneas, sí: allí los metecos pueden ser coregos y pagar un coro. En las Dionisias, no. Pero antes tienes que ser meteco: busca un patrono, un prostátes, que te inscriba en el demo y paga el impuesto de los metecos».</p>');return;}
  jmDlg('Λ','Corego en las Leneas','Una liturgia','<p>«Ser corego cuesta mucho: el coro, el maestro, los trajes, las máscaras… A cambio, si tu coro gana, tu nombre queda escrito. ¿Te atreves?»</p><p class="sub">Coste: '+x4Coin(30)+'.</p>',
    [['Sí, costearé el coro',()=>{if((state.obols||0)<30){jmSay('<p>No te llega el dinero: necesitas '+x4Coin(30)+'.</p>');return;}state.obols-=30;updateStats();c.st='poeta';c.d0=state.day||1;save();x4CoregoPoeta();}],['Todavía no',()=>{}]]);}
function x4CoregoPoeta(){const c=x4Car();jmDlg('Λ','Elige poeta','Corego · paso 1 de 3','<p>El arconte te asigna un poeta por sorteo entre los que se presentan. Te dejan elegir entre dos.</p>',
  [['Un veterano que conoce bien el teatro',()=>{c.poeta='veterano';c.st='ensayo';c.q=(c.q||0)+1;save();momento('step','Has elegido poeta','Ahora toca ensayar con el coro');}],['Un joven con ideas nuevas',()=>{c.poeta='joven';c.st='ensayo';c.q=(c.q||0)+(Math.random()<0.5?2:0);save();momento('step','Has elegido poeta','Ahora toca ensayar con el coro');}]]);}
X4.extra.push(()=>{const c=state&&x4Car();if(!c||!c.st||c.st==='fin')return null;const T={x:THEA.x,z:THEA.z+30};
  if(c.st==='ensayo')return {id:'corego',k:'Corego en las Leneas',t:'Ensaya con el coro en el teatro',s:'Ve al teatro de Dioniso y ensaya (ritmo).',at:()=>T};
  if(c.st==='fiesta')return {id:'corego',k:'Corego en las Leneas',t:'El día del concurso: '+(c.dia<=(state.day||1)?'¡hoy!':'día '+c.dia),s:'Ve al teatro entre las 9 y las 17 h.',at:()=>T};return null;});
function x4CarTick(){if(!state||ui!=='play')return;const c=x4Car();if(MODE!=='roma'&&c.st&&typeof THEA!=='undefined'){const d=Math.hypot(THEA.x-player.x,THEA.z+30-player.z);
    if(c.st==='ensayo'&&d<30&&!X4.ensayo){X4.ensayo=1;setTimeout(()=>{X4.ensayo=0;},20000);x4Musica('El ensayo del coro',sc=>{c.q=(c.q||0)+(sc>=70?2:sc>=45?1:0);c.st='fiesta';c.dia=(state.day||1)+2;save();momento('step','Ensayo terminado','El concurso será el día '+c.dia+', en el teatro');});}
    if(c.st==='fiesta'&&d<35&&(state.day||1)>=c.dia&&clock.h>=9&&clock.h<17){const win=(c.q||0)+Math.random()*2>=3;c.st='fin';c.win=win;save();
      if(win){momento('done','Tu coro gana en las Leneas','Tu nombre se graba en la lista de vencedores');x4Trofeo('corego','Corona de hiedra del corego','Coro vencedor en las Leneas');try{qAdd('kl',3,'Corego vencedor.');}catch(e){}}
      else jmSay('<p>Tu coro queda segundo. El público aplaude, pero la corona es para otro. Aun así, todos saben que costeaste un coro: eso da fama.</p>');try{jmz().fama=(jmz().fama||0)+2;}catch(e){}}}
  if(MODE==='roma')x4CampTick();}
// Roma: campaña en Tarraco
function x4Tar(){try{return ISLANDS.find(i=>i.id==='tarraco');}catch(e){return null;}}
function x4TarC(){const I=x4Tar();if(!I)return null;const t=I.town||I.arrive||I;return isFinite(t.x)?{x:t.x,z:t.z}:null;}
const X4_PROG=[['L(ucium) Caecilium Ingenuum aed(ilem) o(ro) v(os) f(aciatis)',1],['L. Caecilio Ingenuo salutem dicit Tarraco',0],['Vota a Lucio Cecilio, el mejor',0]];
X4.extra.push(()=>{if(MODE!=='roma'||!state)return null;const c=x4Car(),T=x4TarC();if(!T)return null;
  if(!c.st)return {id:'camp',k:'Cargos · Tarraco',t:'Una campaña electoral en Tarraco',s:'En Tarraco buscan quien ayude a un candidato a edil (en Roma, en el año 80, ya elige el Senado).',at:()=>T};
  if(c.st==='pintar')return {id:'camp',k:'Campaña en Tarraco',t:'Pinta los carteles del candidato ('+(c.p||0)+'/3)',s:'Busca las paredes señaladas en Tarraco.',at:()=>c.pts&&c.pts[c.p||0]?{x:c.pts[c.p||0][0],z:c.pts[c.p||0][1]}:T};
  if(c.st==='votos')return {id:'camp',k:'Campaña en Tarraco',t:'Pide el voto a 3 vecinos ('+(c.v||0)+'/3)',s:'Habla con la gente de Tarraco.',at:()=>T};
  if(c.st==='eleccion')return {id:'camp',k:'Campaña en Tarraco',t:'Día de las elecciones: día '+c.dia,s:'Vuelve a Tarraco para saber el resultado.',at:()=>T};return null;});
function x4CampTick(){const c=x4Car(),T=x4TarC();if(!T)return;const d=Math.hypot(T.x-player.x,T.z-player.z);
  if(!c.st&&d<60&&!X4.campAsk){X4.campAsk=1;jmDlg('L','Lucio Cecilio Ingenuo','Candidato a edil de Tarraco (personaje inventado)','<p>«¡Forastero! Me presento a edil de la colonia. Necesito manos: pintar mis carteles en las paredes y pedir el voto a los vecinos. Tú no votas, pero puedes ayudar. Si gano, no lo olvidaré.»</p><p class="sub">En los municipios del Imperio aún se votaba a los magistrados locales; los carteles electorales pintados se conservan en Pompeya.</p>',
      [['Le ayudaré',()=>{c.st='pintar';c.p=0;c.pts=[];for(let i=0;i<3;i++){const a=i*2.1+0.4;let p=[T.x+Math.cos(a)*22,T.z+Math.sin(a)*22];try{const f=findFree(p[0],p[1],1);if(f)p=f;}catch(e){}c.pts.push(p);}save();momento('start','Campaña en Tarraco','Pinta tres carteles en las paredes señaladas');}],['Ahora no',()=>{setTimeout(()=>{X4.campAsk=0;},60000);}]]);}
  if(c.st==='pintar'&&c.pts){const p=c.pts[c.p||0];if(p&&Math.hypot(p[0]-player.x,p[1]-player.z)<5&&!X4.pint){X4.pint=1;const ops=X4_PROG.slice().sort(()=>Math.random()-0.5);
      jmDlg('✎','Pintar el cartel','Cartel '+((c.p||0)+1)+' de 3','<p>¿Qué fórmula se pinta en un cartel electoral? (como las de Pompeya: «os ruego que lo elijáis»)</p>',ops.map(o=>[o[0],()=>{X4.pint=0;if(o[1]){c.p=(c.p||0)+1;c.ok=(c.ok||0)+1;if(c.p>=3){c.st='votos';c.v=0;}save();momento('step','Cartel pintado',o[0]);}else{gfFloat('Así no se escribía','#e8a080');}}]));}}
  if(c.st==='eleccion'&&d<60&&(state.day||1)>=c.dia){const win=(c.ok||0)+(c.v||0)>=5||Math.random()<0.4;c.st='fin';c.win=win;save();
    if(win){momento('done','Lucio Cecilio, edil de Tarraco','Ahora eres su cliente: te protegerá y te ayudará');x4Trofeo('cliente','Amigo del edil de Tarraco','Ganaste una campaña electoral');try{qAdd('kl',3,'Tu candidato ha ganado.');}catch(e){}}
    else jmSay('<p>Lucio Cecilio pierde por pocos votos. «El año que viene», dice. Te agradece la ayuda con unos sestercios.</p>');cyPay(win?10:3,'La campaña de Tarraco');}}
{const f=openDialog;openDialog=function(n){const r=f.apply(this,arguments);try{const c=x4Car(),T=x4TarC();if(MODE==='roma'&&c.st==='votos'&&T&&n&&Math.hypot(T.x-player.x,T.z-player.z)<150&&!(c.vs||(c.vs={}))[n.id]&&ui==='dialog'){const o=$('dOpts'),b=document.createElement('button');
    b.innerHTML='<span class="n">·</span><span>Pedirle el voto para Lucio Cecilio</span>';b.onclick=()=>{closeDialog();setTimeout(()=>jmQuiz('Pedir el voto','<p>«¿Y por qué iba a votarle? Demuéstrame que sabes de qué hablas.»</p>',()=>{c.vs[n.id]=1;c.v=(c.v||0)+1;if(c.v>=3){c.st='eleccion';c.dia=(state.day||1)+2;}save();momento('step','Un voto más',c.v>=3?'Las elecciones serán el día '+c.dia:'Llevas '+c.v+' de 3');},()=>{c.vs[n.id]=1;save();jmSay('<p>No le convences. Prueba con otra persona.</p>');}),80);};o.appendChild(b);}}catch(e){}return r;};}
// ---- trofeos (G6 los muestra; aquí solo se registran)
function x4Trofeo(id,t,s){const z=x4z();if(z.tro[id])return;z.tro[id]={t,s,d:state.day||1};save();setTimeout(()=>{try{momento('logro',t,s);}catch(e){}try{if(typeof x4TroApply==='function')x4TroApply();}catch(e){}},2600);}
// ---- ticks
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{X4.t=(X4.t||0)+dt;if(X4.t>0.6){X4.t=0;x4CalTick();x4CarTick();x4Btn();}}catch(e){}return r;};}
