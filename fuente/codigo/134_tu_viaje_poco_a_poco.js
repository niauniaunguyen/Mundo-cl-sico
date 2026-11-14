// ============================================================ TU VIAJE, POCO A POCO: las herramientas se abren por etapas, y una meta clara (el regreso)
// Etapa 1: diario, plano, ayuda, ajustes, vista, antorcha. Etapa 2 (3 primeros pasos o 1 lección; en Historia, 1 capítulo): modo atención,
// biblioteca, zurrón, pasar unas horas. Etapa 3 (3 lecciones o los 10 primeros pasos; 3 capítulos): códice, comercio, vestuario, caballo, modo foto.
// Etapa 4 (6 lecciones o 4 días; 5 capítulos): música antigua. Lo cerrado se ve con candado y su condición. Nunca se vuelve a cerrar
// (state.capMax). En Ajustes: «Mostrarlo todo desde el principio» (state.unlockAll). Meta del modo libre: «Tu viaje» (primeros pasos → vivir
// en la ciudad: 12 lecciones o inscripción → el regreso con tu paisano → las cinco grandes pruebas, opcionales).
const CAP_FEAT={atencion:2,lib:2,zurron:2,time:2,codex:3,comercio:3,vest:3,horse:3,foto:3,musica:4};
const CAP_TX={atencion:['Mirar con atención','Mantén pulsado el clic derecho (o Q; en el móvil, el ojo) y apunta a cualquier cosa —una persona, un edificio, un árbol— para saber qué es.'],
 lib:['La biblioteca (B)','Todas las fuentes antiguas del juego, para leer cuando quieras.'],zurron:['El zurrón (I)','Lo que llevas encima. Las casillas de abajo son tu barra de objetos.'],
 time:['Pasar unas horas (T)','Para ver la ciudad de noche, esperar a una fiesta o a que escampe.'],codex:['El códice (C)','Todo lo que has visto y aprendido, con buscador y línea del tiempo.'],
 comercio:['Comercio','Compra en una ciudad y vende en otra.'],vest:['Vestuario','Viste según tu condición, como se vestía de verdad.'],horse:['El caballo (H)','Pregunta a un criador de caballos: con uno viajarás mucho más rápido.'],
 foto:['Modo foto','Haz fotos del mundo antiguo y guárdalas.'],musica:['Música antigua','Escucha el epitafio de Seikilos, un himno délfico y los modos griegos.']};
function capLvl(){if(!state)return 4;if(state.unlockAll)return 4;const L=(state.lessons||[]).length,S=typeof stepsDone==='function'?stepsDone():0,ST=STEPS().length,d=state.day||1,ch=(state.story&&state.story.done)||0;
  let l=1;if(S>=3||L>=1||ch>=1)l=2;if(S>=ST||L>=3||ch>=3)l=3;if(L>=6||d>=4||ch>=5)l=4;l=Math.max(l,state.capMax||1);state.capMax=l;return l;}
function capOk(k){const n=CAP_FEAT[k];if(!n)return true;if(k==='horse'){try{const h=hz();if(h.own||h.q)return true;}catch(e){}}return capLvl()>=n;}
function capWhy(n){const ro=MODE==='roma';if(state&&state.story)return{2:'al terminar el primer capítulo',3:'al terminar el tercer capítulo',4:'al terminar el quinto capítulo'}[n];
  return{2:'al completar 3 primeros pasos o aprender tu primera lección',3:'al aprender 3 lecciones o completar los primeros pasos',4:'al aprender 6 lecciones o pasar 4 días en '+(ro?'Roma':'Atenas')}[n];}
function capNo(k){const T=CAP_TX[k];toast('<span class="label">Aún no · '+(T?T[0]:'')+'</span><br>Se abrirá '+capWhy(CAP_FEAT[k])+'.');}
// cerrojos en las funciones que abren cada cosa (solo se llaman desde la interfaz)
for(const[fn,k]of[['openLibrary','lib'],['advanceTime','time'],['callHorse','horse'],['objZurron','zurron'],['eduCodex','codex'],['eduMusic','musica'],['eduTrade','comercio'],['vestMenu','vest']]){
  try{const o=eval(fn);if(typeof o!=='function')continue;const w=function(){if(!capOk(k)){capNo(k);return;}return o.apply(this,arguments);};eval(fn+'=w');}catch(e){}}
{const p0=phToggle;phToggle=function(on){const opening=on===undefined?!PH.on:on;if(opening&&!capOk('foto')){capNo('foto');return;}return p0.apply(this,arguments);};}
{const a0=atShow;atShow=function(on){if(on&&!capOk('atencion')){if(!AT.capT||performance.now()-AT.capT>4000){AT.capT=performance.now();capNo('atencion');}return;}return a0.apply(this,arguments);};}
{const t0=atTick;atTick=function(dt){t0(dt);const b=$('atBtn');if(b&&!capOk('atencion'))b.style.display='none';};}
// el menú: candado y condición en lo cerrado; en Ajustes, la opción de abrirlo todo
{const g0=gmRight;gmRight=function(d){g0(d);try{const g=d.querySelector('.gr');if(!g)return;
  for(const b of g.querySelectorAll('button[data-g]')){const k=b.dataset.g,n=CAP_FEAT[k];if(!n||capOk(k))continue;b.disabled=true;b.classList.add('caplock');b.title='Se abrirá '+capWhy(n);const s=b.querySelector('.k');if(s)s.textContent='🔒 pronto';else b.insertAdjacentHTML('beforeend','<span class="k">🔒 pronto</span>');}
  if(GM.page==='ajustes'){const l=g.querySelector('.list')||g;const b=document.createElement('button');b.className='wide';b.innerHTML='<span class="t">'+(state.unlockAll?'✓ ':'')+'Mostrarlo todo desde el principio</span><span class="k">'+(state.unlockAll?'activado: todas las herramientas abiertas':'si no, se van abriendo a medida que avanzas')+'</span>';
    b.onclick=()=>{state.unlockAll=!state.unlockAll;save();capTick(9);gmRender();};l.appendChild(b);}}catch(e){}};}
{const st=document.createElement('style');st.textContent='#gmenu button.caplock{opacity:.38;cursor:not-allowed;filter:grayscale(.6)}#gmenu .via{margin:10px 4px 0;font-size:.86rem;line-height:1.5;color:var(--bone,#efe2c8)}#gmenu .via b{color:#ecc29a}#gmenu .via .ok{color:#9fc48a}#gmenu .via .now{color:#f1c27a}#gmenu .via .opt{opacity:.7}';document.head.appendChild(st);}
// botones de la barra de arriba
const CAP={t:0,shown:null};
function capTick(dt){if(!state||ui==='start')return;CAP.t-=dt;if(CAP.t>0)return;CAP.t=1;const l=capLvl();
  for(const[id,k]of[['bLib','lib'],['bTime','time'],['bHorse','horse'],['tTime','time'],['tHorse','horse']]){const b=$(id);if(b){const v=capOk(k)?'':'none';if(b.style.display!==v)b.style.display=v;}}
  if(state.capShown===undefined){state.capShown=l;return;}   // partidas ya empezadas: sin ventana
  if(l>state.capShown&&ui==='play'){const nu=Object.keys(CAP_FEAT).filter(k=>CAP_FEAT[k]>state.capShown&&CAP_FEAT[k]<=l&&capOk(k));state.capShown=l;save();if(!nu.length)return;
    try{sfxChime&&sfxChime();}catch(e){}vmS('✦','Se abre más camino','etapa '+l+' de 4 de tu viaje','<p>Ya te mueves con soltura. A partir de ahora tienes también:</p>'+nu.map(k=>'<p><b>'+CAP_TX[k][0]+'</b> · '+CAP_TX[k][1]+'</p>').join('')+'<p class="sub">Todo está también en el menú (Tab).</p>',[['¡Adelante!',()=>closeDialog(),'quiz']]);}}
// «Tu viaje»: la meta del modo libre
function viaje(){const L=(state.lessons||[]).length,f=fxz(),S=stepsDone(),ST=STEPS().length,big=QUAL.filter(q=>qLv(q.k)>=10).length;return{S,ST,L,ok:fxNostosOk(),nos:f.nostos,big,f};}
function viajeHTML(){const V=viaje(),ro=MODE==='roma',city=ro?'Roma':'Atenas',ins=ro?'hacerte ciudadano':'inscribirte como meteco',m=(ok,now)=>ok?'<span class="ok">✓</span>':now?'<span class="now">➤</span>':'○';
  const s1=V.S>=V.ST,s2=V.ok,s3=!!V.nos;
  return '<div class="via"><b>Tu viaje</b><br>'+m(s1,!s1)+' Primeros pasos · '+Math.min(V.S,V.ST)+'/'+V.ST+'<br>'+m(s2,s1&&!s2)+' Vivir en '+city+' · '+Math.min(V.L,12)+'/12 lecciones (o '+ins+')<br>'+
    m(s3,s2&&!s3)+' El regreso · '+(s3?(V.nos==='volver'?'has decidido volver':'has decidido quedarte'):'habla con tu paisano, '+PAISANO.name)+'<br><span class="opt">'+m(V.big>=5,s3&&V.big<5)+' Las grandes pruebas · '+V.big+'/5 (nivel 10 de cada cualidad; opcional)</span></div>';}
{const r0=gmRender;gmRender=function(){r0();try{const gl=$('gmenu')&&$('gmenu').querySelector('.gl');if(gl&&!storyOn())gl.insertAdjacentHTML('beforeend',viajeHTML());}catch(e){}};}
