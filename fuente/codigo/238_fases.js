// ============================================================ LAS FASES DEL JUEGO (acordadas el 22/11; ver fuente/FASES.md)
// Recién llegado → Vivir en la ciudad → Preparar el regreso → Después del nóstos. No cierran nada: todo sigue abierto.
// Solo deciden qué se presenta: al entrar en una fase nueva, Hermes (Mercurio) trae un mensaje con lo que conviene buscar ahora,
// el Diario tiene la pestaña «Tu fase» con esas sugerencias, y la cabecera de «Tu viaje» dice en qué fase estás.
// Cómo se calcula (modo libre, con «Tu viaje» de 134): early hasta acabar los primeros pasos (o 3 lecciones); mid hasta «vivir en la
// ciudad» (12 lecciones o inscripción); end hasta el regreso (la decisión con tu paisano); post después. Modo Historia: capítulos
// acabados 0-2, 3-7, 8-9 y 10 o más.
const FASES=[{n:'Recién llegado',en:'early game'},{n:'Vivir en la ciudad',en:'midgame'},{n:'Preparar el regreso',en:'endgame'},{n:'Después del nóstos',en:'postgame'}];
const FASE_SUG={
 atenas:[
  ['Aprende de la gente del Ágora: cada persona con nombre te enseña algo.','Lee las estelas y mira con atención (clic derecho) lo que te rodea.','Prueba los encargos del día, las tabas y los dados.','De noche, mira el cielo; de día, mide un templo con su sombra.','Sal al Ática a pie o con un carretero.'],
  ['Consigue un caballo y aprende a comerciar entre ciudades.','Viaja por mar: Esparta, Delfos, Egipto, Creta…','Compra una casa, hereda la granja o busca una escuela.','Inscríbete como meteco y busca un cargo: corego en las Leneas.','Escribe discursos con Lisias y habla en la Asamblea.','Busca a las Musas, las esferas de sueño y las sombras de los filósofos.','En el sueño de Cnosos, ayuda a Dédalo y supera al Minotauro: se abrirán los portales de leyenda.','Cumple los diez encargos de Hermes: su caduceo abre los interiores cerrados.'],
  ['Gana la ciudadanía por decreto, como el banquero Pasión.','Sal de la caverna de Platón y baja al Hades órfico.','La hazaña de Diomedes: su portal está en la llanura de Troya.','Cuando estés listo, habla con tu paisano: es la hora del regreso.'],
  ['Las cinco grandes pruebas: lleva cada cualidad al nivel 10.','Viaja a la Luna con el barco de Luciano y vuela con las alas de Dédalo.','Completa las esferas de sueño con Hipnos y recorre toda Creta.','Colecciona monedas, figurillas y trofeos; bate tus récords en las leyendas.']],
 roma:[
  ['Aprende de la gente del Foro: cada persona con nombre te enseña algo.','Lee las inscripciones y mira con atención (clic derecho) lo que te rodea.','Prueba los encargos del día, las tabas y los dados.','De noche, mira el cielo; de día, mide el obelisco del Circo con su sombra.','Sal al Lacio a pie o con un carretero.'],
  ['Consigue un caballo y aprende a comerciar entre ciudades.','Viaja por mar y por tierra: Italia, Sicilia, Hispania, la Galia, Egipto…','Compra una domus, hereda la granja o busca una escuela.','Busca la ciudadanía y haz campaña en Tarraco con un programma.','Prepara suasorias con Quintiliano y asiste al Senado.','Busca a las Musas, las esferas de sueño y las sombras de los filósofos.','Junto al templo de Hércules, en el Foro Boario, cruza el portal de Caco: se abrirán los portales de leyenda.','Cumple los diez encargos de Mercurio: su caduceo abre los interiores cerrados.'],
  ['Llega a caballero, con el anillo de oro.','Escucha el sueño de Escipión y baja a los Infiernos con la Sibila.','Diomedes en Argiripa: su portal está en Apulia.','Cuando estés listo, habla con tu paisano: es la hora del regreso.'],
  ['Las cinco grandes pruebas: lleva cada cualidad al nivel 10.','El capítulo de Tácito, el viaje a la Luna y las alas de Dédalo.','Completa las esferas con la casa del Sueño y visita la Atenas romana.','Colecciona monedas, figurillas y trofeos; bate tus récords en las leyendas.']]};
function faseNow(){try{if(typeof storyOn==='function'&&storyOn()){const d=state.story.done||0;return d>=10?3:d>=8?2:d>=3?1:0;}
  const V=viaje();if(V.nos)return 3;if(V.ok)return 2;if(V.S>=V.ST||V.L>=3)return 1;return 0;}catch(e){return 0;}}
function faseHTML(f){const L=FASE_SUG[MODE==='roma'?'roma':'atenas'][f];return '<p><b>'+FASES[f].n+'</b> <span class="sub">('+FASES[f].en+', fase '+(f+1)+' de 4)</span></p>'+L.map(t=>'<p>· '+t+'</p>').join('')+
  '<p class="sub">Son sugerencias: nada está cerrado, y lo de otras fases sigue ahí para quien lo encuentre.</p>';}
X4_TABS.fase={n:'Tu fase',h:()=>faseHTML(faseNow())};
// el mensaje de Hermes al cambiar de fase (en partidas ya empezadas, la primera vez solo se anota la fase, sin mensaje)
const FS={t:0};
function faseTick(dt){if(!state)return;FS.t-=dt;if(FS.t>0)return;FS.t=2;const f=faseNow();if(state.fase===undefined){state.fase=f;save();return;}
  if(f>state.fase){state.fase=f;state.faseMsg=f;FS.wait=2;save();try{momento('chapter',FASES[f].n,'Fase '+(f+1)+' de 4 de tu viaje');}catch(e){}return;}
  // el mensaje espera a que estés jugando (sin diálogos abiertos); si cerraste el juego antes, sale al volver
  if(state.faseMsg!==undefined&&ui==='play'){if((FS.wait=(FS.wait||0)-2)>0)return;const k=state.faseMsg;delete state.faseMsg;save();faseMsg(k);}}
function faseMsg(f){const ro=MODE==='roma',H=ro?'Mercurio':'Hermes';
  try{vmS('☤',H,'Un mensaje para ti','<p>«Te traigo noticias: '+(f===3?'has vuelto a tu casa, pero el camino no se acaba aquí.':f===2?'ya vives aquí como uno más. Ahora toca preparar el regreso.':'ya te mueves con soltura. El mundo se abre más allá de la ciudad.')+'»</p>'+faseHTML(f),[['Gracias, '+H,()=>closeDialog(),'quiz']]);}catch(e){}}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{faseTick(dt);}catch(e){}return r;};}
// «Tu viaje» (menú) dice en qué fase estás
{const f=viajeHTML;viajeHTML=function(){const h=f.apply(this,arguments);try{const k=faseNow();return h.replace('<b>Tu viaje</b>','<b>Tu viaje</b> · fase '+(k+1)+' de 4: <b>'+FASES[k].n+'</b>');}catch(e){return h;}};}
