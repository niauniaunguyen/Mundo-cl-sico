// ============================================================ HUD
const $=id=>document.getElementById(id);
// ------------------------------------------------------------ días y acontecimientos
// Al pasar la medianoche empieza un día nuevo (state.day). Algunos días hay un acontecimiento: un aviso, una multitud en su sitio
// y una entrada en el diario. 'every' lo repite cada tantos días a partir de 'day'; 'once' solo ocurre ese día.
function addHours(dh){clock.h+=dh;while(clock.h>=24){clock.h-=24;newDay();}}
function newDay(){if(!state)return;state.day=(state.day||1)+1;save();const ev=todayEvent();
  toast('<span class="label">Amanece el día '+state.day+'</span>'+(ev?'<br>Hoy: '+ev.title+'. '+ev.short:''));evCrowd(true);
  const cu=curioDaily();if(cu)setTimeout(()=>toast('<span class="label">Curiosidad del día</span><br>'+cu.h+''),5000);}
const EVENTS_ATENAS=[
 {id:'asamblea',day:3,every:8,title:'Asamblea en la Pnyx',short:'Por la mañana, los ciudadanos se reúnen en la colina de la Pnyx.',h0:7,h1:13,at:()=>({x:PNYX.x,z:PNYX.z}),n:60,r:35,
  txt:'Unas cuarenta veces al año, al amanecer, los ciudadanos suben a la Pnyx para votar a mano alzada leyes, guerras y tratados. Para que no falte quórum, desde hace pocos años se paga a los asistentes: tres óbolos, lo que cobra un trabajador por media jornada. Antes se empujaba a los rezagados con una cuerda teñida de rojo; ahora basta con la paga.'},
 {id:'dionisias',day:5,once:true,title:'Grandes Dionisias',short:'Procesión de Dioniso y concurso de tragedias en el teatro.',h0:7,h1:20,at:()=>({x:THEA.x,z:THEA.z+30}),n:70,r:30,
  txt:'La gran fiesta de primavera en honor de Dioniso. Una procesión lleva la estatua del dios al teatro, con toros para el sacrificio y falos de madera; durante días se representan comedias, tragedias y dramas satíricos ante toda la ciudad. Y este año hay una novedad: según las listas de vencedores grabadas en piedra, en el arcontado de Teodoto (387/386 a.C.) se repuso por primera vez una tragedia antigua, junto a las nuevas.'}
, {id:'noumenia',day:1,every:5,title:'Mercado de la noumenia',short:'El primer día del mes: mercado grande en el Ágora, con campesinos de todo el Ática.',h0:7,h1:13,at:()=>{const q=AL(10,15);return{x:q[0],z:q[1]};},n:40,r:26,stalls:true,
  txt:'La noumenia, la luna nueva, abre cada mes del calendario ateniense. Es día de sacrificios en las casas y de un mercado especialmente concurrido en el Ágora, al que bajan los campesinos del Ática. Los agoránomos vigilan la calidad de lo que se vende, y los metrónomos, las pesas y medidas.'}
];
const EVENTS_ROMA=[
 {id:'nundinas',day:3,every:8,title:'Día de mercado',short:'Las nundinas: campesinos y vendedores llenan el Foro.',h0:7,h1:15,at:()=>({x:0,z:-22}),n:45,r:28,stalls:true,
  txt:'Cada ocho días (las nundinas, «el noveno día» contando a la romana) los campesinos de los alrededores bajan a la ciudad a vender y comprar. Por tradición, las leyes debían anunciarse durante tres días de mercado antes de votarse, y en las nundinas no se celebraban asambleas.'},
 {id:'inauguracion',day:5,once:true,title:'Inauguración del Anfiteatro Flavio',short:'Tito abre los juegos de cien días. Todo el mundo va al anfiteatro.',h0:6,h1:19,at:()=>({x:ROMA.col.x,z:ROMA.col.z+108}),n:90,r:45,
  txt:'Tito inaugura el anfiteatro que empezó su padre con unos juegos de cien días. Según Suetonio, en un solo día se mataron cinco mil fieras de todas clases; Dion Casio cuenta que lucharon grullas y elefantes, que también mujeres mataron fieras y que hubo combates de gladiadores, uno a uno y en grupo. Marcial escribió, probablemente para la ocasión, un librito de epigramas: el Libro de los espectáculos. Desde las gradas, el emperador lanzaba al público bolitas de madera con premios: comida, ropa, vajilla de plata, caballos o esclavos.'},
 {id:'naumaquia',day:8,every:9,title:'Batalla naval en la naumaquia',short:'En el estanque de Augusto, en el Trastévere, «atenienses» contra «siracusanos».',h0:9,h1:17,at:()=>({x:-870,z:705-95}),n:70,r:40,
  txt:'Como parte de los juegos, Tito llena de naves el estanque que Augusto mandó excavar en el Trastévere. Según Dion Casio, unos combatientes hicieron de atenienses y otros de siracusanos, como en la guerra del Peloponeso, y los «atenienses» desembarcaron en la isla y tomaron el muro que rodeaba el monumento.'},
 {id:'carreras',day:11,every:9,title:'Carreras en el Circo Máximo',short:'Las cuatro facciones compiten en el Circo.',h0:8,h1:18,at:()=>{const c=ROMA.circus;return c?{x:c.C.x,z:c.C.z-70}:null;},n:70,r:60,
  txt:'Las carreras de carros son el espectáculo más popular de Roma: en el Circo Máximo caben unos ciento cincuenta mil espectadores. Corren las cuatro facciones, los blancos, los rojos, los verdes y los azules, y la gente apuesta y discute por ellas con pasión. Según Dion Casio, en los juegos inaugurales de Tito hubo un día de carreras de caballos, entre el de los gladiadores y las fieras y el de la batalla naval.'}
];
const EVENTS=()=>MODE==='roma'?EVENTS_ROMA:EVENTS_ATENAS;
function todayEvent(){if(!state)return null;const d=state.day||1;const e=EVENTS().find(e=>e.once?d===e.day:d>=e.day&&(d-e.day)%e.every===0);if(e)return e;const f=typeof festOfDay==='function'?festOfDay(d):null;return f?festEvent(f):null;}
// la multitud del acontecimiento: aparece en su sitio durante sus horas y desaparece después
const EVC={g:null,id:null};
function evCrowd(force){const ev=todayEvent(),on=ev&&clock.h>=ev.h0&&clock.h<ev.h1&&ui!=='start';const want=on?ev.id+':'+state.day:null;
  if(want===EVC.id&&!force)return;if(EVC.g){if(EVC.g.userData.off)scene.remove(EVC.g.userData.off);scene.remove(EVC.g);EVC.g=null;}MKT.length=0;FEST_ACT.o=null;EVC.id=want;if(!on)return;const p=ev.at();if(!p)return;
  const g=new THREE.Group();scene.add(g);EVC.g=g;if(ev.fest)festSpawn(ev,p,g);const looks=MODE==='roma'?[{toga:true,chiton:'#efe9dc',himation:'#f3eee2'},{short:true,noHimation:true,chiton:'#a89070'},{short:true,noHimation:true,chiton:'#c9b48b'},{female:true,chiton:'#e2d6c0',himation:'#8a3f5e',veil:true},{female:true,chiton:'#efe6d5',himation:'#4f6a7d'}]
    :[{chiton:'#e8e0cf',himation:'#6d7b9a',beard:true},{chiton:'#efe6d5',himation:'#8a6a3a',beard:true},{exomis:true,chiton:'#a89070',beard:true},{female:true,chiton:'#e2d6c0',himation:'#8a3f5e'},{chiton:'#d8c9a8',himation:'#4f6a5a'}];
  for(let i=0;i<ev.n;i++){const a=Math.random()*TAU,d=Math.sqrt(Math.random())*ev.r;let x=p.x+Math.cos(a)*d,z=p.z+Math.sin(a)*d;const q={x,z};resolve(q,0.5);x=q.x;z=q.z;
    const o=makePerson(Object.assign({hair:pick(['#2b1f17','#3e2c1f','#5b4532','#8d8a85'])},pick(looks)));o.position.set(x,floorAt(x,z),z);o.rotation.y=Math.atan2(p.x-x,p.z-z)+rr(-0.8,0.8);g.add(o);}
  if(ev.stalls)mktStalls(ev,p,g);
  if(ui==='play'&&Math.hypot(player.x-p.x,player.z-p.z)>200)toast('<span class="label">'+ev.title+'</span><br>'+ev.short);}
// en el diario: el día, el acontecimiento de hoy y el próximo
function calendarHTML(){const d=state.day||1,ev=todayEvent();let nx=null,nd=d;for(let k=1;k<=20&&!nx;k++){const sd=state.day;state.day=d+k;const e=todayEvent();state.day=sd;if(e){nx=e;nd=d+k;}}
  const cn=calNow(d);return '<div class="entry" style="margin:0 0 14px"><span class="label">Día '+d+' · mes de '+cn.mes+' · '+cn.season.n+(ev?' · hoy':'')+'</span><h3>'+(ev?ev.title:'Un día corriente')+'</h3><p>'+(ev?ev.txt+' <i>('+ev.h0+' a '+ev.h1+' h)</i>':'Cada noche que pasa empieza un día nuevo. Algunos días hay acontecimientos en la ciudad.')+'</p>'+(nx?'<p class="sub">Próximo acontecimiento: '+nx.title+', el día '+nd+'.</p>':'')+'</div>';}
let evT=0;function evTick(dt){evT+=dt;if(evT<1)return;evT=0;if(state)evCrowd(false);const o=FEST_ACT.o;if(o)o.lb.visible=Math.hypot(o.x-player.x,o.z-player.z)<10;}
// ------------------------------------------------------------ primeros pasos: diez misiones de iniciación por época
// Cada una presenta un aspecto distinto (política, lugares, lecciones, plano, religión, mitos o espectáculos, caballo, teatro, vida cotidiana, sueños).
// ok() comprueba si ya está hecha (con el progreso normal del juego o con state.steps); at() da hacia dónde apunta la brújula.
const npcAt=id=>{const o=npcObjs.find(n=>n.data.id===id);return o?{x:o.x,z:o.z}:null;};
const placeAt=id=>{const p=PLACES.find(q=>q.id===id);return p?{x:p.x,z:p.z}:null;};
const seenAny=id=>!!(state.seen[id]&&state.seen[id].length);
function nearestSign(){let b=null,bd=1e9;for(const s of signObjs){if(state.places.includes(s.data.id)||regionOf(s.x)!==regionOf(player.x))continue;const d=Math.hypot(s.x-player.x,s.z-player.z);if(d<bd){bd=d;b=s;}}return b;}
function nearestSphere(){let b=null,bd=1e9;for(const s of EPI.spheres){if(epiDone(s.data))continue;const d=Math.hypot(s.x-player.x,s.z-player.z);if(d<bd){bd=d;b=s;}}return b;}
const anyDream=()=>EPISODES.some(e=>e.mode===MODE&&epiDone(e));
function watchingPlay(){if(MODE==='atenas'&&currentPlay()&&inCavea(player.x,player.z))return true;
  return!!ROMA.theatres&&ROMA.theatres.some((T,i)=>RPERF.cur[i]&&Math.hypot(player.x-T.x,player.z-T.z)<T.R1+14);}
const STEPS_ATENAS=[
 {id:'pritano',cat:'Política',title:'La democracia: habla con un prítano',short:'Eucles, junto a la Tholos, al oeste del Ágora',txt:'Junto a la Tholos, en el lado oeste del Ágora, Eucles preside este mes el Consejo de los Quinientos. Acércate a él (tiene un rombo ! sobre la cabeza), pulsa E y escucha al menos uno de sus temas.',ok:()=>seenAny('pritano'),at:()=>npcAt('pritano')},
 {id:'estela',cat:'Lugares',title:'Lee una estela',short:'Busca una estela con un rombo dorado y pulsa E',txt:'Las estelas con un rombo dorado explican los edificios y los lugares. Acércate a una y pulsa E: quedará anotada en tu diario, en la pestaña Lugares.',ok:()=>state.places.length>0,at:()=>nearestSign()},
 {id:'leccion',cat:'Lecciones',title:'Supera tu primera lección',short:'Habla con alguien y elige «Ponme a prueba»',txt:'Después de escuchar a un personaje, elige «Ponme a prueba». Si aciertas la pregunta, la lección se guarda en el diario y ganas tres óbolos.',ok:()=>state.lessons.length>0,at:()=>nextTarget()},
 {id:'plano',cat:'Orientarse',title:'Mira el plano de Atenas',short:'Pulsa M',txt:'Pulsa M para abrir el plano. Puedes ampliarlo con la rueda o con los botones, y si haces clic en un lugar que ya has descubierto, viajas hasta él.',ok:()=>!!state.steps.map,at:()=>null},
 {id:'partenon',cat:'Religión y arte',title:'Sube a la Acrópolis',short:'Lee la estela del Partenón, en la Acrópolis',txt:'Sube por los Propileos a la roca sagrada de Atenea y lee la estela del Partenón. Dentro está la gran estatua de oro y marfil de la diosa.',ok:()=>state.places.includes('partenon'),at:()=>placeAt('partenon')},
 {id:'mito',cat:'Mitos',title:'Reconoce un mito en piedra',short:'Busca un rombo azul junto a un relieve',txt:'Los frontones, metopas y frisos cuentan mitos. Busca un rombo azul junto a un relieve, pulsa E y di qué mito representa. Eunice, la abuela de la fuente del sureste del Ágora, te explica cómo se juega.',ok:()=>state.myths.length>0,at:()=>npcAt('abuela')},
 {id:'platon',cat:'Filosofía',title:'A caballo hasta la Academia',short:'Ve al noroeste, a la Academia, y habla con Platón',txt:'Ve al noroeste, fuera de las murallas, hasta el bosque de la Academia, y habla con Platón. Es lejos: si consigues un caballo (Eudico de Larisa, el criador tesalio del Ágora, te dará uno a cambio de un favor), pulsa H para llamarlo y montar.',ok:()=>seenAny('platon'),at:()=>npcAt('platon')},
 {id:'teatro',cat:'Teatro',title:'Una función en el teatro',short:'Siéntate en el teatro de Dioniso durante una tragedia',txt:'En el teatro de Dioniso, en la ladera sur de la Acrópolis, se representan tragedias de Eurípides de 8 a 11, de 14 a 17 y de 20 a 23 h. Siéntate en las gradas mientras dura una. Con T puedes cambiar la hora.',ok:()=>!!state.steps.teatro,at:()=>({x:THEA.x,z:THEA.z})},
 {id:'fuente',cat:'Vida cotidiana',title:'Charla en la fuente',short:'Habla con Mirrina, en la fuente del sureste del Ágora',txt:'En la fuente del sureste del Ágora, Mirrina y sus vecinas llenan sus cántaros. Habla con ella: te contará cómo es el día a día de una mujer ateniense.',ok:()=>seenAny('aguadora'),at:()=>npcAt('aguadora')},
 {id:'sueno',cat:'Sueños',title:'Sueña un mito',short:'Toca una esfera de luz y vive el sueño hasta el final',txt:'Las esferas de luz que flotan en algunos lugares te hacen soñar un mito o un momento histórico. Acércate a una, pulsa E y vívelo hasta el final.',ok:anyDream,at:()=>nearestSphere()}
];
const STEPS_ROMA=[
 {id:'tacito',cat:'Política',title:'Un joven senador',short:'Tácito, junto a la Curia, en el Foro',txt:'Junto a la Curia, en el Foro, Tácito acaba de entrar en el Senado. Acércate a él (tiene un rombo ! sobre la cabeza), pulsa E y escucha al menos uno de sus temas.',ok:()=>seenAny('tacito'),at:()=>npcAt('tacito')},
 {id:'estela',cat:'Lugares',title:'Lee una estela',short:'Busca una estela con un rombo dorado y pulsa E',txt:'Las estelas con un rombo dorado explican los edificios y los lugares. Acércate a una y pulsa E: quedará anotada en tu diario, en la pestaña Lugares.',ok:()=>state.places.length>0,at:()=>nearestSign()},
 {id:'leccion',cat:'Lecciones',title:'Supera tu primera lección',short:'Habla con alguien y elige «Ponme a prueba»',txt:'Después de escuchar a un personaje, elige «Ponme a prueba». Si aciertas la pregunta, la lección se guarda en el diario y ganas tres sestercios.',ok:()=>state.lessons.length>0,at:()=>nextTarget()},
 {id:'plano',cat:'Orientarse',title:'Mira el plano de Roma',short:'Pulsa M',txt:'Pulsa M para abrir el plano. Puedes ampliarlo con la rueda o con los botones, y si haces clic en un lugar que ya has descubierto, viajas hasta él.',ok:()=>!!state.steps.map,at:()=>null},
 {id:'vestal',cat:'Religión',title:'El fuego de Vesta',short:'Habla con la vestal Cornelia, junto al templo de Vesta',txt:'Junto al templo redondo de Vesta, en el Foro, la vestal Cornelia guarda el fuego sagrado de Roma. Habla con ella y escucha al menos uno de sus temas.',ok:()=>seenAny('cornelia'),at:()=>npcAt('cornelia')},
 {id:'anfiteatro',cat:'Espectáculos',title:'El Anfiteatro Flavio',short:'Lee la estela del anfiteatro, al este del Foro',txt:'Sigue la Vía Sacra hacia el este y lee la estela del gran anfiteatro que Tito acaba de inaugurar con cien días de juegos.',ok:()=>state.places.includes('ro_coliseo'),at:()=>placeAt('ro_coliseo')},
 {id:'panteon',cat:'Arquitectura',title:'A caballo al Campo de Marte',short:'Ve al Campo de Marte y lee la estela del Panteón',txt:'Ve hacia el noroeste, por la Vía Lata, hasta el Campo de Marte, y lee la estela del Panteón. Si consigues un caballo (Félix, el auriga de los Verdes, te dará uno a cambio de un favor), pulsa H para llamarlo y montar.',ok:()=>state.places.includes('ro_panteon'),at:()=>placeAt('ro_panteon')},
 {id:'teatro',cat:'Teatro',title:'Una comedia de Plauto o de Terencio',short:'Entra en el teatro de Pompeyo o en el de Marcelo durante una función',txt:'En los teatros de Pompeyo y de Marcelo se representan comedias de 8 a 11, de 12 a 15 y de 16 a 19 h. Entra en uno de ellos mientras dura una función. Con T puedes cambiar la hora.',ok:()=>!!state.steps.teatro,at:()=>{const T=ROMA.theatres;if(!T)return null;return T.reduce((b,q)=>Math.hypot(q.x-player.x,q.z-player.z)<Math.hypot(b.x-player.x,b.z-player.z)?q:b,T[0]);}},
 {id:'boda',cat:'Vida cotidiana',title:'Una boda romana',short:'Habla con Pomponia, en el Celio, y asiste a la boda',txt:'En el Celio, a la puerta de la casa de los Valerios, Pomponia te invita a la boda de Valeria y Quinto. Asiste a ella hasta el final: verás también cómo es por dentro una domus.',ok:()=>!!state.seen.boda,at:()=>npcAt('pomponia')},
 {id:'sueno',cat:'Sueños',title:'Sueña un momento histórico',short:'Toca una esfera de luz y vive el sueño hasta el final',txt:'Las esferas de luz que flotan en algunos lugares te hacen soñar un mito o un momento histórico. Acércate a una, pulsa E y vívelo hasta el final.',ok:anyDream,at:()=>nearestSphere()}
];
const STEPS=()=>MODE==='roma'?STEPS_ROMA:STEPS_ATENAS;
const stepsDone=()=>STEPS().filter(s=>s.ok()).length;
function curStep(){if(!state||state.steps._off)return null;return STEPS().find(s=>!s.ok())||null;}
function stepFlag(k){if(!state.steps[k]){state.steps[k]=1;save();}}
// hacia dónde apunta el rombo de la brújula: la misión en curso o, si no hay, la persona más cercana por conocer
function guideTarget(){const ht=horseTarget();if(ht)return ht;if(storyOn())return storyTarget();const s=curStep();if(s){const p=s.at();if(p)return p;if(!state.steps._off)return null;}return nextTarget();}
let stepsT=0;
function stepsTick(dt){
  if(!state||ui!=='play')return;stepsT+=dt;if(stepsT<0.5)return;stepsT=0;
  if(!state.steps.teatro&&watchingPlay())stepFlag('teatro');
  const L=STEPS();for(const s of L){if(state.steps['ok:'+s.id]||!s.ok())continue;state.steps['ok:'+s.id]=1;state.obols+=1;
    const d=stepsDone();sfxCoin();
    toast('<span class="label">Primeros pasos · '+d+' / '+L.length+'</span><br>'+s.title+' · +1 '+(MODE==='roma'?'sestercio':'óbolo'));
    if(d===L.length){state.obols+=5;setTimeout(()=>toast('<span class="label">Primeros pasos completados · +5 '+(MODE==='roma'?'sestercios':'óbolos')+'</span><br>Ya conoces lo básico. Ahora explora por tu cuenta: quedan muchos personajes por conocer, dioses en el campo, viajes por mar y por tierra, esferas de sueño y la biblioteca (B), con ensayos y fuentes.'),2500);}
    save();updateStats();}
}
function updateStats(){
  $('sLessons').textContent='Lecciones '+state.lessons.length+'/'+Object.keys(LESSONS).length;
  $('sPlaces').textContent='Lugares '+state.places.length+'/'+PLACES.length;
  $('sObols').textContent=state.obols+(MODE==='roma'?' sestercios':' óbolos');
  $('sMyths').textContent='Mitos '+state.myths.length+'/'+RELIEFS.length;
  $('sGods').textContent='Favores '+godsDone()+'/'+GODS.length;
  {const L=Object.keys(LESSONS).length,Pl=PLACES.length,My=MODE==='atenas'?RELIEFS.length:0,Go=GODS.length,
     done=state.lessons.length+state.places.length+(My?state.myths.length:0)+godsDone(),tot=L+Pl+My+Go,pc=tot?Math.floor(done/tot*100):0;
   const b=$('sProg');b.textContent='Progreso '+pc+' %';b.title='Lecciones '+state.lessons.length+'/'+L+' · Lugares '+state.places.length+'/'+Pl+(My?' · Mitos '+state.myths.length+'/'+My:'')+(Go?' · Favores '+godsDone()+'/'+Go:'')+'. Pulsa para ver tu ficha.';}
  {const h=hz();$('sHorse').hidden=!(h.own&&MOUNT.riding);if(h.own)$('sHorse').textContent=horseName()+' · nv '+h.lvl+' · '+h.xp+'/'+horseNeed(h.lvl);}
  {const h=hz();if(h.q==='on'||h.q==='caught'){$('objective').innerHTML='<b>Encargo del caballo</b><br><span class="sub">'+(h.q==='on'?'Busca la yegua escapada (rombo ◆)':'La yegua ha vuelto sola: habla con '+(MODE==='roma'?'Félix, el auriga':'Eudico de Larisa'))+'</span>';return;}}
  if(storyOn()){$('objective').innerHTML=storyStatus()+'<br><span class="sub">G: que te lleven · J: capítulos</span>';return;}
  const st=curStep();if(st){$('objective').innerHTML='<b>Primeros pasos '+stepsDone()+'/'+STEPS().length+'</b> · '+st.title+'<br><span class="sub">'+st.short+'</span>';return;}
  const t=nextTarget(),nx=t?(state.lessons.includes(t.data.id)?'Siguiente: pide a '+t.data.name+' que te lleve a un juicio · '+LESSONS[t.data.id].where:'Siguiente: '+t.data.name+' · '+LESSONS[t.data.id].where):'Has completado todas las lecciones. Sigue explorando.';
  try{const V=viaje(),ro=MODE==='roma';let h;
    if(!V.ok)h='<b>Tu viaje · Vivir en '+(ro?'Roma':'Atenas')+'</b> · '+Math.min(V.L,12)+'/12 lecciones<br><span class="sub">'+nx+'</span>';
    else if(!V.nos)h='<b>Tu viaje · El regreso</b> · habla con tu paisano, '+PAISANO.name+'<br><span class="sub">'+PAISANO.where+'. ¿Vuelves a tu tierra o te quedas?</span>';
    else h='<b>Tu viaje · Las grandes pruebas</b> · '+V.big+'/5<br><span class="sub">El nivel 10 de cada cualidad: mira tus cualidades en el menú (Tab). '+nx+'</span>';
    $('objective').innerHTML=h;}catch(e){$('objective').textContent=nx;}
}
function npcDone(d){return state.lessons.includes(d.id)&&(!d.event||state.lessons.includes(d.event));}
function nextTarget(){let best=null,bd=1e9;for(const n of npcObjs){if(n.hidden||npcDone(n.data))continue;const d=Math.hypot(n.x-player.x,n.z-player.z);if(d<bd){bd=d;best=n;}}return best;}
function toast(html){const d=document.createElement('div');d.innerHTML=html;$('toast').appendChild(d);setTimeout(()=>d.remove(),5200);}
let zoneTimer=0;
function showZone(name,greek,sub){const z=$('zone');z.querySelector('.zn').textContent=name;z.querySelector('.zg').textContent=greek||'';z.querySelector('.zs').textContent=sub||'';z.classList.add('show');clearTimeout(zoneTimer);zoneTimer=setTimeout(()=>z.classList.remove('show'),4200);}
const ZONES=[
  ...ISLANDS.map(I=>({id:'isl_'+I.id,name:I.name,gr:I.gr,sub:I.sub,test:x=>regionOf(x)===I.id})),
  {id:'puerto',name:'El Pireo',gr:'ΠΕΙΡΑΙΕΥΣ',sub:'El puerto de Atenas. Aquí embarcan los viajeros hacia las islas.',test:(x,z)=>(HARBOR.ok&&Math.hypot(x-HARBOR.x,z-HARBOR.z)<90)||pirIn(x,z)},
  {id:'acro',name:'Acrópolis',gr:'ΑΚΡΟΠΟΛΙΣ',sub:'La roca sagrada de Atenea, coronada por los templos de Pericles.',test:(x,z)=>superD(x,z,ACRO.x,ACRO.z,ACRO.rx,ACRO.rz)<1.05&&floorAt(x,z)>48},
  {id:'agora',name:'Ágora',gr:'ΑΓΟΡΑ',sub:'Mercado, plaza y corazón político de la ciudad.',test:(x,z)=>Math.hypot(x-AG.x,z-AG.z)<150},
  {id:'pnyx',name:'Pnyx',gr:'ΠΝΥΞ',sub:'La colina donde se reúne la Asamblea del pueblo.',test:(x,z)=>superD(x,z,PNYX.x,PNYX.z,PNYX.rx,PNYX.rz)<1.05},
  {id:'teatro',name:'Teatro de Dioniso',gr:'ΘΕΑΤΡΟΝ',sub:'Ladera sur de la Acrópolis.',test:(x,z)=>Math.hypot(x-THEA.x,z-THEA.z)<62},
  {id:'odeion',name:'Odeón de Pericles',gr:'ΩΙΔΕΙΟΝ',sub:'La sala de los concursos musicales.',test:(x,z)=>Math.abs(x-162)<34&&Math.abs(z-124)<37},
  {id:'areo',name:'Areópago',gr:'ΑΡΕΙΟΣ ΠΑΓΟΣ',sub:'La colina de Ares, donde se juzgan los homicidios.',test:(x,z)=>superD(x,z,AREO.x,AREO.z,46,22)<1.05},
  {id:'eleus',name:'Eleusinion',gr:'ΕΛΕΥΣΙΝΙΟΝ',sub:'Santuario de Deméter y Core en la ciudad.',test:(x,z)=>Math.abs(x-ELEUS.x)<17&&Math.abs(z-ELEUS.z)<22},
  {id:'academia',name:'Academia',gr:'ΑΚΑΔΗΜΕΙΑ',sub:'El bosque sagrado de Academo, fuera de las murallas.',test:(x,z)=>Math.hypot(x-ACADEMY.x,z-ACADEMY.z)<140},
  {id:'liceo',name:'Liceo',gr:'ΛΥΚΕΙΟΝ',sub:'Gimnasio de Apolo Liceo, junto al río Iliso.',test:(x,z)=>Math.hypot(x-LYCEUM.x,z-LYCEUM.z)<80},
  {id:'ceramico',name:'Cerámico',gr:'ΚΕΡΑΜΕΙΚΟΣ',sub:'Barrio de alfareros y cementerio junto al Dípilon.',test:(x,z)=>Math.hypot(x-D.x,z-D.z)<130},
  {id:'muros',name:'Muros Largos',gr:'ΜΑΚΡΑ ΤΕΙΧΗ',sub:'El corredor fortificado hacia el puerto del Pireo.',test:(x,z)=>!insideWalls(x,z)&&((x-PG.x)*LW_DIR[0]+(z-PG.z)*LW_DIR[1])>0&&Math.abs((x-PG.x)*LW_DIR[1]-(z-PG.z)*LW_DIR[0])<230},
  {id:'olimp',name:'Olimpieion',gr:'ΟΛΥΜΠΙΕΙΟΝ',sub:'El templo inacabado de los tiranos.',test:(x,z)=>Math.abs(x-OLY.x)<62&&Math.abs(z-OLY.z)<28},
  {id:'cino',name:'Cinosarges',gr:'ΚΥΝΟΣΑΡΓΕΣ',sub:'Gimnasio de Heracles, junto al Iliso.',test:(x,z)=>Math.hypot(x-CYNO.x,z-CYNO.z)<60},
  ...ATH_DEMES.map(d=>({id:'demo_'+d.id,name:d.name,gr:d.gr,sub:d.sub,test:(x,z)=>MODE==='atenas'&&insideWalls(x,z)&&demeAt(x,z)===d})),
  {id:'ciudad',name:'Calles de Atenas',gr:'ΑΣΤΥ',sub:'Casas con patio, de adobe sobre zócalo de piedra, y callejas de tierra.',test:(x,z)=>insideWalls(x,z)},
  {id:'campo',name:'Campos del Ática',gr:'ΧΩΡΑ',sub:'Olivares, viñas y caminos entre los demos.',test:()=>true},
];
let curZone=null;
function checkZone(){{const fz=fzIn();if(fz){const k='fz_'+fz+(fz==='inf'&&player.z-6000>155?'2':'');if(curZone!==k){curZone=k;const T={fz_race:MODE==='roma'?['Un trigal del Lacio','CAMILLA','Eneida VII 803-817']:['El estadio','ΣΤΑΔΙΟΝ','La carrera contra Atalanta'],fz_tel:['El Telesterion','ΤΕΛΕΣΤΗΡΙΟΝ','Eleusis, la noche de los Misterios'],fz_inf:['Los Infiernos','AVERNVS','Eneida, libro VI'],fz_inf2:['Los Campos Elíseos','ELYSIVM','Eneida VI 637-678']}[k];showZone(T[0],T[1],T[2]);}return;}}if(cavIn()){const lz=player.z-CAV.Z,k=MODE==='roma'?'somnium':lz<95?'caverna':player.feet<CAV.Y+50?'cav_fuera':'ideas';if(curZone!==k){curZone=k;const T={somnium:['El Sueño de Escipión','SOMNIVM SCIPIONIS','Cicerón, República, libro VI'],caverna:['La caverna','ΣΠΗΛΑΙΟΝ','Platón, República, libro VII'],cav_fuera:['Fuera de la caverna','ΤΟ ΦΩΣ','La luz del sol'],ideas:['El mundo de las Ideas','ΑΙ ΙΔΕΑΙ','Lo que es siempre']}[k];showZone(T[0],T[1],T[2]);}return;}if(player.feet>MOON.y-50){if(curZone!=='luna'){curZone='luna';showZone('La Luna','ΣΕΛΗΝΗ','El reino de Endimión, según Luciano');}return;}if(player.feet>CASA.Y-50){if(curZone!=='casa'){curZone='casa';showZone('Tu casa',MODE==='roma'?'DOMVS':'ΟΙΚΙΑ',MODE==='roma'?'En el Quirinal':'En Melite');}return;}if(OLYM.built&&player.feet>OLYM.y-50&&player.feet<CASA.Y-50){if(curZone!=='olimpo'){curZone='olimpo';showZone('El Olimpo','ΟΛΥΜΠΟΣ','La morada de los dioses');}return;}const z=ZONES.find(zn=>zn.test(player.x,player.z));if(z&&z.id!==curZone){curZone=z.id;showZone(z.name,z.gr,z.sub);fxZone(z.id);}}

// brújula
const CDIRS=[['N',0],['NE',45],['E',90],['SE',135],['S',180],['SO',225],['O',270],['NO',315]];
function drawCompass(){
  const el=$('compass'),W=el.clientWidth,fov=110;const head=-player.yaw*180/Math.PI;let h='';
  for(const[l,b]of CDIRS){const d=((b-head+540)%360)-180;if(Math.abs(d)<fov/2)h+='<span class="c'+(l.length>1?' minor':'')+'" style="left:'+(W/2+d/fov*W)+'px">'+l+'</span>';}
  const t=guideTarget();if(t){const b=Math.atan2(t.x-player.x,-(t.z-player.z))*180/Math.PI;let d=((b-head+540)%360)-180;d=clamp(d,-fov/2+3,fov/2-3);h+='<span class="c obj" style="left:'+(W/2+d/fov*W)+'px">◆</span>';}
  el.innerHTML=h;
}

