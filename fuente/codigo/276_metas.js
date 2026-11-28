// ============================================================ METAS: QUE EL JUGADOR SEPA QUÉ PUEDE CONSEGUIR, Y QUIERA CONSEGUIRLO (28/11)
// Antes, en el modo libre, las metas estaban repartidas en cinco sitios (la esquina de la pantalla, el menú, el Diario, «Tus asuntos»
// y «La honra») y la mejor, llegar de forastero a ciudadano, era un botón más del menú. Tras los diez primeros pasos solo se veía
// «Siguiente lección». Ahora:
//  1 una pantalla de METAS (la que era «Tus asuntos», con todas sus pestañas): la escalera de la honra, cuánto falta, qué se gana en
//    cada escalón y tres maneras concretas de ganar honra ahora; «Tu viaje» y «Lo que te espera»;
//  2 en la pantalla, la próxima meta con su barra (en lugar de «Progreso %»), que abre Metas;
//  3 la promesa: al despedirse el guía (y una vez en las partidas ya empezadas), qué puede llegar a ser el jugador y qué le espera;
//  4 «Lo que te espera»: las grandes experiencias, con una pista de dónde empiezan, que se marcan al vivirlas;
//  5 cada escalón de la honra anuncia el siguiente y lo que da (158);
//  6 el objetivo de la esquina, después de los primeros pasos, dice para qué sirve: «Para Elogio del Consejo: …»;
//  7 todo suma honra, y se dice: los encargos de Hermes, los del día y las fiestas cuentan; cada vez que sube, «+N de honra»;
//  8 nombres claros: el Diario (J) es lo aprendido; Metas, lo que puedes conseguir.
// Y el protagonista es siempre de Quíos: sin selector de patria (las partidas ya empezadas conservan la suya). En Roma, un quiota
// del año 80: Quíos era ciudad libre y aliada desde el decreto del Senado del 80 a.C. (senatus consultum de Chiis, Sherk, RDGE 70),
// tras sufrir la deportación de sus habitantes por Mitrídates (Apiano, Guerras mitridáticas 46-47); su vino era el más caro de Roma
// (Plinio, Historia natural XIV 73 y 97). Tiberio Claudio Zósimo, el paisano romano, es un personaje inventado.
function metz(){if(!state.metas||typeof state.metas!=='object')state.metas={enc:0,encSeen:{},last:null,promised:0};const z=state.metas;z.encSeen=z.encSeen||{};return z;}
// ---------- la patria: Quíos
try{ORIG.roma.push({id:'quios',n:'Quíos, en Asia',de:'de Quíos',gm:'quiota',gf:'quiota',pn:'Tiberio Claudio Zósimo',pt:'Quiota en Roma, vinatero del Emporio',look:{chiton:'#e9dfcb',himation:'#6a3a5a',beard:true,hair:'#4a3a2a'},
  pi:'¡Un quiota! Soy Tiberio Claudio Zósimo. Vendo el vino de nuestra isla en el Emporio, junto al Tíber, y atiendo a los paisanos que llegan a Roma. Si te tratan mal, ven a buscarme. Y si traes vino de casa, mejor.',
  tp:[['¿Qué noticias hay de Quíos?','Quíos es ciudad libre y aliada del pueblo romano: tiene sus leyes, sus magistrados y su moneda, y no paga tributo como las demás ciudades de la provincia de Asia. Nos lo ganamos caro: hace más de ciento cincuenta años, Mitrídates mandó deportar a toda la isla, y fue Roma quien nos devolvió a casa. Y el vino sigue siendo el más caro del mundo: Plinio dice que en tiempos de los abuelos se servía como medicina.'],
   ['¿Cómo me mirarán en Roma?','Hay de todo. Muchos romanos admiran a los griegos: mandan a sus hijos a aprender con ellos y llenan sus casas de estatuas y libros griegos. Otros nos llaman «grieguillos», charlatanes y aduladores; Catón el Viejo ya desconfiaba de los médicos griegos, como recuerda Plinio. Pero en las escuelas, en las bibliotecas y en las consultas de los médicos casi todo el mundo habla griego.'],
   ['¿Cómo puedo hacerme ciudadano romano?','Para vivir aquí no te hace falta: Quíos es ciudad libre. Pero la ciudadanía abre muchas puertas. Hay varios caminos: servir veinticinco años en las tropas auxiliares, que un ciudadano te libere si fueras esclavo, o que el emperador te la conceda porque alguien importante lo pide por ti. Yo la tengo así: por eso me llamo Tiberio Claudio, como el emperador que me la dio. Busca un patrono y gana dignitas en la ciudad.']],
  bark:['¿De Quíos? El vino de tu isla es el que se sirve en los banquetes buenos.','Un griego de Quíos… ¿La isla de Homero, no?'],
  react:'Al oír «de Quíos», sonríe: «¡El mejor vino del mundo! Hasta Plinio lo alaba».'});}catch(e){console.warn('metas quios',e);}
function metQuios(){return (ORIG[MODE]||[]).find(o=>o.id==='quios')||null;}
{const f=origen;origen=function(){const o=f.apply(this,arguments);return o||(pjz()?metQuios():null);};}
fxOrigSelect=function(){const o=origen();return '<b>'+(o?o.n:'Quíos')+'</b>';};
function metFixOrig(){try{const p=pjz();if(!p)return;const L=ORIG[MODE]||[];if(!p.o||!L.some(o=>o.id===p.o)){p.o='quios';save();try{fxRelabel();}catch(e){}}}catch(e){}}
// ---------- 7. más fuentes de honra
{const f=honParts;honParts=function(){const P=f.apply(this,arguments);let hm=0,fe=0;try{hm=hmz().m||0;}catch(e){}try{fe=Object.keys(x4z().cal).length;}catch(e){}
  P.push(['Encargos de '+(MODE==='roma'?'Mercurio':'Hermes'),hm,3],['Fiestas y acontecimientos vividos',fe,1],['Encargos del día cumplidos',metz().enc||0,1]);return P;};}
function metEncCount(){try{const z=jmz(),m=metz();if(!z.enc||!z.enc.list)return;z.enc.list.forEach((e,i)=>{const k=(z.enc.day||state.day)+':'+i+':'+(e.txt||'').slice(0,20);if(e.done&&!m.encSeen[k]){m.encSeen[k]=1;m.enc=(m.enc||0)+1;save();}});}catch(e){}}
// ---------- la escalera
function metLadder(){const L=honList(),sc=honScore(),r=honRank(sc),nx=L[r+1];return{L,sc,r,cur:L[r],nx,need:nx?nx[0]-sc:0,p:nx?Math.min(1,(sc-L[r][0])/(nx[0]-L[r][0])):1};}
function metCoin(){return MODE==='roma'?'sestercios':'óbolos';}
// ---------- 1 (y 6). las mejores maneras de ganar honra ahora mismo
function metActions(){const A=[],ro=MODE==='roma';
  try{const t=nextTarget();if(t)A.push({v:3,t:'Aprende con '+t.data.name,s:(LESSONS[t.data.id]&&LESSONS[t.data.id].where)||'',hon:'+3'});}catch(e){}
  try{const z=x4z(),d=state.day||1;for(const e of x4DayEvents(d)){if(z.cal[d+':'+e.id]||clock.h>=e.h1)continue;A.push({v:2.5,t:'Ve a «'+e.t+'»',s:'hoy, de '+e.h0+' a '+e.h1+' h',hon:'+1 y Eusébeia'});break;}}catch(e){}
  try{const S=(EPI.spheres||[]).filter(s=>s.data&&!epiSeen(s.data.id));if(S.length)A.push({v:2,t:'Vive un sueño en una esfera de luz',s:'te quedan '+S.length+' por descubrir',hon:'+2'});}catch(e){}
  try{if(!(asz().votes>0))A.push({v:2.8,t:ro?'Asiste a una sesión del Senado':'Vota en la Asamblea',s:ro?'en la Curia, cuando haya sesión':'en la Pnyx, los días de asamblea',hon:'+3'});}catch(e){}
  try{const z=hmz();if((z.m||0)<10)A.push({v:2.6,t:'Cumple un encargo de '+(ro?'Mercurio':'Hermes'),s:ro?'junto a su templo, al pie del Aventino':'en el Ágora, junto a las hermas del pórtico del noroeste',hon:'+3'});}catch(e){}
  try{const z=jmz();if(z.enc&&z.enc.list&&z.enc.list.some(e=>!e.done))A.push({v:2.2,t:'Termina los encargos de hoy',s:z.enc.list.filter(e=>!e.done).length+' pendientes',hon:'+1 cada uno'});}catch(e){}
  A.push({v:1,t:'Descubre lugares nuevos',s:'cada estela y cada lugar que encuentras',hon:'+1'});
  return A.sort((a,b)=>b.v-a.v).slice(0,3);}
// ---------- 4. lo que te espera
const MET_BIG={atenas:[
  ['🏛','Inscribirte como meteco','Habla con tu paisano, Aristócrito, en el Ágora.',()=>{const f=fxz();return f.st==='meteco'||!!f.ciu;}],
  ['🗳','Votar en la Asamblea','En la Pnyx, los días de asamblea.',()=>asz().votes>0],
  ['🏠','Tener casa en Atenas','Pregunta por casas en venta o en alquiler.',()=>(cz().st||0)>0],
  ['🐎','Tu propio caballo','Un criador de caballos tiene una yegua escapada.',()=>!!hz().own],
  ['🎶','Los dones de las nueve Musas','Cada Musa espera donde mejor conviene a su arte.',()=>Object.keys(muz().dons).length>=9],
  ['🐂','Vencer al Minotauro','En el sueño de Cnosos. Abre los portales de las leyendas.',()=>mntReady()],
  ['🦁','Los trabajos de Heracles','Los portales de leyenda: Nemea, Lerna, Estínfalo…',()=>(premz().lit||[]).length>0],
  ['💀','Bajar al Hades','Por la cueva del cabo Ténaro, cuando hayas vencido a Cerbero.',()=>!!state.infra],
  ['🪶','Volar con las alas de Dédalo','Dédalo está encerrado en su propio laberinto, en Creta.',()=>!!wz().own],
  ['🌙','Viajar a la Luna','En el barco de Luciano: busca a quien cuenta historias verdaderas.',()=>!!state.luna],
  ['⛵','El regreso a Quíos','Cuando estés listo, decide con tu paisano si vuelves o te quedas.',()=>!!fxz().nostos]],
 roma:[
  ['🏛','Hacerte ciudadano romano','Habla con tu paisano, Tiberio Claudio Zósimo, junto al Templo de la Paz.',()=>!!fxz().ciu],
  ['🗳','Asistir al Senado','En la Curia, los días de sesión.',()=>asz().votes>0],
  ['🏠','Tener tu domus','Pregunta por casas en venta o en alquiler.',()=>(cz().st||0)>0],
  ['🐎','Tu propio caballo','Un criador de caballos tiene una yegua escapada.',()=>!!hz().own],
  ['🎶','Los dones de las nueve Musas','Cada Musa espera donde mejor conviene a su arte.',()=>Object.keys(muz().dons).length>=9],
  ['🔥','Vencer a Caco','Junto al templo de Hércules, en el Foro Boario. Abre los portales.',()=>mntReady()],
  ['🦁','Los trabajos de Hércules','Los portales de leyenda, desde el Foro Boario.',()=>(premz().lit||[]).length>0],
  ['💀','Bajar a los Infiernos','Por Cumas, junto al lago Averno, con la Sibila.',()=>!!state.infra],
  ['🪶','Volar con las alas de Dédalo','Dédalo está encerrado en su propio laberinto, en Creta.',()=>!!wz().own],
  ['🌙','Viajar a la Luna','En el barco de Luciano: busca a quien cuenta historias verdaderas.',()=>!!state.luna],
  ['⛵','El regreso a Quíos','Cuando estés listo, decide con tu paisano si vuelves o te quedas.',()=>!!fxz().nostos]]};
function metBig(){return (MET_BIG[MODE==='roma'?'roma':'atenas']).map(([ic,t,h,f])=>{let ok=false;try{ok=!!f();}catch(e){}return{ic,t,h,ok};});}
// ---------- la pantalla de Metas
function metHTML(){const ro=MODE==='roma',M=metLadder(),A=metActions(),B=metBig(),nb=B.filter(b=>b.ok).length;
  let h='<div class="met">';
  h+='<p class="pr">'+(ro?'Llegaste a Roma desde Quíos, un griego sin derechos y sin patrono. Hay quien empezó igual y acabó con el <b>anillo de oro de caballero</b>.':'Llegaste a Atenas desde Quíos, un forastero sin derechos. El banquero Pasión llegó como esclavo y acabó siendo <b>ciudadano de Atenas</b>.')+' Todo lo que aprendes y haces por la ciudad te acerca.</p>';
  // la escalera
  h+='<div class="lad">'+M.L.map((R,i)=>{const st=i<M.r?'ok':i===M.r?'now':'';return '<div class="st '+st+'"><div class="n">'+(i<M.r?'✦':i===M.r?'➤':i)+'</div><div class="tx"><b>'+R[1]+'</b> <span class="pts">'+R[0]+'</span><br><span>'+R[2]+'</span>'+(i>M.r?'<br><span class="gift">Al llegar: una ceremonia y '+i*5+' '+metCoin()+'</span>':'')+'</div></div>';}).join('')+'</div>';
  if(M.nx)h+='<div class="nxt"><div>'+(ro?'Tu dignitas':'Tu honra')+': <b>'+M.sc+'</b> · te faltan <b>'+M.need+'</b> para <b>'+M.nx[1]+'</b></div><div class="bar"><i style="width:'+Math.round(M.p*100)+'%"></i></div></div>';
  else h+='<div class="nxt"><b>Has llegado al honor más alto.</b> Te quedan las grandes pruebas y lo que te espera.</div>';
  h+='<h4>Cómo ganar '+(ro?'dignitas':'honra')+' ahora</h4>'+A.map(a=>'<div class="ac"><span class="h">'+a.hon+'</span><b>'+a.t+'</b>'+(a.s?'<br><small>'+a.s+'</small>':'')+'</div>').join('')+'<p><button class="bt" data-mh>De dónde sale tu '+(ro?'dignitas':'honra')+'</button></p>';
  h+='<h4>Lo que te espera · '+nb+'/'+B.length+'</h4><div class="big">'+B.map(b=>'<div class="bg'+(b.ok?' ok':'')+'"><span class="ic">'+b.ic+'</span><b>'+b.t+'</b>'+(b.ok?' <span class="v">✓</span>':'<br><small>'+b.h+'</small>')+'</div>').join('')+'</div>';
  try{h+='<h4>Tu viaje</h4>'+viajeHTML();}catch(e){}
  return h+'</div>';}
function metBind(d){const b=d.querySelector('[data-mh]');if(b)b.onclick=()=>{x4Close();setTimeout(honPage,80);};}
function metCSS(){if($('metCSS'))return;const s=document.createElement('style');s.id='metCSS';s.textContent=
  '.met .pr{line-height:1.5;margin:0 0 10px}.met h4{margin:16px 0 6px;color:#ecc29a;font-weight:400;font-size:1.05rem}'+
  '.met .lad{display:flex;flex-direction:column;gap:4px}.met .st{display:flex;gap:10px;align-items:flex-start;padding:6px 8px;border:1px solid #5a4030;border-radius:8px;opacity:.8}.met .st.ok{opacity:.9}.met .st.now{opacity:1;border-color:#e0a060;background:rgba(224,160,96,.12)}'+
  '.met .st .n{width:1.6em;text-align:center;color:#ecc29a;font-size:1.1em}.met .st .pts{opacity:.6;font-size:.85em}.met .st span{font-size:.9em}.met .gift{color:#c9b07a;font-size:.82em!important}'+
  '.met .nxt{margin:10px 0;padding:8px 10px;border:1px solid #e0a060;border-radius:8px}.met .bar{height:10px;background:#2a1e14;border-radius:5px;overflow:hidden;margin-top:6px}.met .bar i{display:block;height:100%;background:linear-gradient(90deg,#c98a4a,#f1c27a)}'+
  '.met .ac{padding:6px 8px;border-left:3px solid #c98a4a;margin:4px 0;background:rgba(255,255,255,.03)}.met .ac .h{float:right;color:#f1c27a;font-size:.9em}'+
  '.met .big{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px}.met .bg{padding:7px 9px;border:1px solid #5a4030;border-radius:8px;font-size:.92em}.met .bg.ok{border-color:#7fa86a;background:rgba(127,168,106,.1)}.met .bg .ic{margin-right:6px}.met .bg .v{color:#9fc48a}.met .bg small{opacity:.75}'+
  '#sProg.met2{display:inline-flex;flex-direction:column;gap:2px;min-width:12em;text-align:left}#sProg.met2 .b{height:5px;background:rgba(0,0,0,.35);border-radius:3px;overflow:hidden}#sProg.met2 .b i{display:block;height:100%;background:#e0a060}';
  document.head.appendChild(s);}
// las pestañas: Metas la primera; el panel se llama Metas
{const old=Object.assign({},X4_TABS);for(const k in X4_TABS)delete X4_TABS[k];X4_TABS.metas={n:'Metas',h:()=>{metCSS();return metHTML();},bind:metBind};Object.assign(X4_TABS,old);}
x4Diario=function(cur){metCSS();x4Panel(MODE==='roma'?'Metas · lo que puedes conseguir en Roma':'Metas · lo que puedes conseguir en Atenas',X4_TABS,cur||'metas');};
function metOpen(){try{if(ui!=='play'&&ui!=='gmenu')return;if(ui==='gmenu')gmClose();setTimeout(()=>x4Diario('metas'),60);}catch(e){}}
// ---------- 2. la próxima meta en la pantalla
{const f=updateStats;updateStats=function(){const r=f.apply(this,arguments);try{const b=$('sProg');if(!b||!state)return r;const M=metLadder(),ro=MODE==='roma';
  b.classList.add('met2');b.innerHTML=M.nx?'<span>➤ '+M.nx[1]+' · '+M.sc+'/'+M.nx[0]+'</span><span class="b"><i style="width:'+Math.round(M.p*100)+'%"></i></span>':'<span>✦ '+M.cur[1]+'</span>';
  b.title=(M.nx?'Tu próxima meta: '+M.nx[1]+' ('+M.nx[2]+'). Te faltan '+M.need+' de '+(ro?'dignitas':'honra')+'. ':'')+'Pulsa para ver tus metas.';metCSS();}catch(e){}return r;};}
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#sProg');if(b){e.stopImmediatePropagation();e.preventDefault();metOpen();}},true);
try{const b=$('bMis');if(b){b.title='Metas';b.setAttribute('aria-label','Metas: lo que puedes conseguir');}}catch(e){}
{const f=x4Btn;x4Btn=function(){const r=f.apply(this,arguments);try{const b=$('bMis');if(b){b.title='Metas';b.setAttribute('aria-label','Metas: lo que puedes conseguir');}}catch(e){}return r;};}
// ---------- 6. el objetivo de la esquina dice para qué sirve
{const f=x4Missions;x4Missions=function(){const L=f.apply(this,arguments);try{const M=metLadder();if(M.nx)for(const m of L)if(m.id==='next'&&!m._met){m._met=1;m.k='Para «'+M.nx[1]+'»';m.t=m.t.replace('Siguiente lección: ','Aprende con ')+' (+3 de honra)';}}catch(e){}return L;};}
// ---------- 3. la promesa
function metPromise(){const ro=MODE==='roma',M=metLadder(),B=metBig().filter(b=>!b.ok).slice(0,6);metz().promised=1;save();
  vmS('✦',ro?'Lo que puedes llegar a ser':'Lo que puedes llegar a ser',ro?'de peregrino a caballero':'de forastero a ciudadano',
   '<p>'+(ro?'Has llegado a Roma desde Quíos sin nada: ni ciudadanía, ni patrono, ni amigos. Pero en Roma cuenta la <b>dignitas</b>, y se gana. Muchos griegos de las provincias acabaron con la ciudadanía y algunos, con el anillo de oro de los caballeros.':'Has llegado a Atenas desde Quíos sin nada: ni derechos, ni casa, ni amigos. Pero en Atenas cuenta la <b>honra</b>, y se gana. El banquero Pasión llegó como esclavo y la Asamblea acabó haciéndolo ciudadano.')+'</p>'+
   '<p>Tu camino: '+M.L.map((R,i)=>(i===M.r?'<b>'+R[1]+'</b>':R[1])).join(' → ')+'.</p>'+
   '<p>Y por el camino te esperan:</p><p>'+B.map(b=>b.ic+' '+b.t).join('<br>')+'</p>'+
   '<p class="sub">Todo está en <b>Metas</b>: el botón de la barra de arriba o la meta que verás junto a tus '+metCoin()+'. '+(ro?'Que la Fortuna te acompañe.':'Que los dioses te acompañen.')+'</p>',[['¡Allá voy!',()=>{closeDialog();}],['Ver mis metas',()=>{closeDialog();setTimeout(()=>x4Diario('metas'),80);}]]);}
{const f=obFinish;obFinish=function(){const r=f.apply(this,arguments);try{if(!metz().promised&&!(typeof storyOn==='function'&&storyOn()))setTimeout(function w(){if(ui!=='play'){setTimeout(w,1500);return;}if(!metz().promised)metPromise();},2500);}catch(e){}return r;};}
// ---------- 7. «+N de honra», y el bucle
const MET={t:0,old:0,q:0};
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;if(!MET.fix&&pjz()){MET.fix=1;metFixOrig();}MET.t+=dt;if(MET.t<2)return r;MET.t=0;metFixOrig();metEncCount();
  const z=metz(),sc=honScore();if(z.last===null||z.last===undefined){z.last=sc;save();}else if(sc>z.last){MET.q+=sc-z.last;z.last=sc;save();}else if(sc<z.last){z.last=sc;}
  if(MET.q>0&&ui==='play'){const M=metLadder(),ro=MODE==='roma';toast('<span class="label">+'+MET.q+' de '+(ro?'dignitas':'honra')+'</span><br>'+(M.nx?M.sc+'/'+M.nx[0]+' para «'+M.nx[1]+'»':'Has llegado al honor más alto'));MET.q=0;try{updateStats();}catch(e){}}
  // partidas ya empezadas (o sin guía): la promesa una vez, cuando ya se ha jugado un poco
  if(!z.promised&&ui==='play'&&!(typeof storyOn==='function'&&storyOn())){MET.old+=2;const ob=state.ob;if(MET.old>20&&(!ob||ob.done))metPromise();}}catch(e){if(!MET.err){MET.err=1;console.warn('metas',e);}}return r;};}
// ---------- 8. en el menú (Tab): «La honra» pasa a ser «Tus metas»
{const g0=gmRight;gmRight=function(d){g0(d);try{const b=d.querySelector('[data-hon]');if(b&&!b.dataset.met){b.dataset.met=1;const M=metLadder();b.querySelector('.t').textContent='Tus metas';b.querySelector('.k').textContent=M.nx?'➤ '+M.nx[1]+' · '+M.sc+'/'+M.nx[0]:M.cur[1];b.onclick=()=>{gmClose();setTimeout(()=>x4Diario('metas'),80);};}}catch(e){}};}
// el botón de la barra abre Metas (antes, Misiones)
{const f=x4Btn;x4Btn=function(){const had=!!$('bMis'),r=f.apply(this,arguments);try{const b=$('bMis');if(b&&!b.dataset.met){b.dataset.met=1;b.onclick=e=>{e.stopPropagation();x4Diario('metas');};}}catch(e){}return r;};}
// las pestañas: primero las de metas; el resto, después (y sin dos «Cuaderno»)
{const order=['metas','mis','fase','cal','tro','leyendas'],old=Object.assign({},X4_TABS);for(const k in X4_TABS)delete X4_TABS[k];for(const k of order)if(old[k])X4_TABS[k]=old[k];for(const k in old)if(!X4_TABS[k])X4_TABS[k]=old[k];
  if(X4_TABS.notas&&X4_TABS.cuaderno)X4_TABS.notas.n='Notas';}
// la próxima meta, siempre a la vista: cuando el cartel de arriba se esconde (199), una pastilla bajo la moneda
function metPill(){let d=$('metPill');if(!d){d=document.createElement('div');d.id='metPill';d.style.cssText='position:fixed;left:16px;top:80px;z-index:20;background:rgba(26,20,14,.78);color:#f3e6c8;border:1px solid #6a5034;border-radius:8px;padding:3px 10px 5px;font:13px/1.3 var(--text,system-ui);cursor:pointer;user-select:none;min-width:11em';
    d.onclick=e=>{e.stopPropagation();metOpen();};d.title='Tus metas';document.body.appendChild(d);}
  const st=$('stats'),show=ui==='play'&&state&&!(st&&!st.classList.contains('hid'));d.hidden=!show;if(!show)return;
  const M=metLadder(),k=(M.nx?M.nx[1]+M.sc:M.cur[1]);if(d.dataset.k===k)return;d.dataset.k=k;
  d.innerHTML=M.nx?'➤ '+M.nx[1]+' <span style="opacity:.75">'+M.sc+'/'+M.nx[0]+'</span><div style="height:4px;background:rgba(0,0,0,.4);border-radius:2px;margin-top:3px;overflow:hidden"><i style="display:block;height:100%;width:'+Math.round(M.p*100)+'%;background:#e0a060"></i></div>':'✦ '+M.cur[1];}
{let t=0;const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{t+=dt;if(t>0.5){t=0;if(state&&ui!=='start')metPill();else if($('metPill'))$('metPill').hidden=true;}}catch(e){}return r;};}
