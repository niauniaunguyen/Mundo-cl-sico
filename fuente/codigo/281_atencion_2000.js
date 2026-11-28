// ============================================================ MIRAR CON ATENCIÓN: 2000 COSAS QUE OBSERVAR EN CADA ÉPOCA (28/11)
// Cada cosa que se analiza por primera vez (E o mantener la mirada) se registra; la ficha dice cuántas llevas y cuántas faltan para 2000.
// Qué cuenta: lo que tiene nombre propio (personas, dioses, lugares, animales, edificios, talleres, frontones, ríos…) una vez; y, en las
// series de monumentos (hermas, estelas, estatuas, torres, puestos, barcos, tumbas, miliarios, cipos, fuentes de barrio, compita…), cada
// ejemplar, porque cada uno está en su sitio (el mundo se construye siempre igual: semilla 386). No cuentan las columnas ni los tramos de
// muro, ni las acciones («Salir de…»).
// Premios: cada 100, unas monedas; a las 500, un título; a las 1000, los ojos de Linceo, el argonauta que veía hasta bajo tierra
// (Píndaro, Nemea X 61-63; Apolonio, Argonáuticas I 151-155, anacronismo señalado en Atenas): marcas sobre lo que aún no has
// observado cerca. Con las 2000, lo grande: la ciudad te levanta una estatua de bronce con tu nombre en el Ágora (o en el Foro), con su
// inscripción, y un título; y te ofrecen el gran mapa (el de Hecateo, en Atenas; el de Agripa, en Roma) con todo lo que has visto.
const K13={GOAL:2000,last:0,mk:[],lyT:0,stat:null};
const K13_SER={atenas:['pediment','herm','estelaf','wtower','puesto','ship','st_marble','st_bronze','publico','tesoro','cave','neosoikos','lion','tumulus','spring','cairn','pyramid','reeds','pool','altar','vine','kiln','inn','tambores','tomb','lacus','mile','cippus','compitum','tower'],
  roma:['pediment','st_marble','st_bronze','publico','cippus','tomb','lacus','mile','letrero','compitum','porticus','macetas','bridge','aqueduct','altar','quadriga','inn','st_honor','tower','kiln','tumulus','ship','herm','estelaf','spring','cave','pool','vine','reeds','lion']};
const K13_NO=/^(Salir|Bajar|Subir|Entrar|Volver|Imaginarlo|Hablar|Pasar|Ir |Leer|Tocar|Coger|Cruzar|Montar|Desmontar|Abrir|Cerrar|Seguir|Sentarse|Descansar)\b/;
function k13z(){if(!state.at2||typeof state.at2!=='object')state.at2={ms:0,title:0,lince:0,done:0};return state.at2;}
let K13_NK=null;function k13NameKind(){if(K13_NK)return K13_NK;K13_NK=new Map();const S=new Set(K13_SER[MODE==='roma'?'roma':'atenas']);for(const k in ATX_DEF)if(S.has(k))K13_NK.set(ATX_DEF[k][0],k);return K13_NK;}
function k13Key(c){if(!c||!c.name)return null;const nm=String(c.name).replace(/<[^>]+>/g,'').trim();if(!nm||K13_NO.test(nm))return null;if(/^Parcela \d/.test(nm))return 'at:Parcela';
  try{if(typeof horseName==='function'&&nm===horseName())return null;}catch(e){}
  if(nm.indexOf('Frontón · ')===0&&isFinite(c.x)&&isFinite(c.z))return 'atx:pediment:'+Math.round(c.x)+','+Math.round(c.z);   // cada frontón, el suyo
  const k=k13NameKind().get(nm);if(k&&isFinite(c.x)&&isFinite(c.z))return 'atx:'+k+':'+Math.round(c.x)+','+Math.round(c.z);return 'at:'+nm;}
function k13Count(){const S=state.atSeen||{};let n=0;for(const k in S){if(k.startsWith('atx:')){n++;continue;}const nm=k.slice(3);if(K13_NO.test(nm)||/^Parcela \d/.test(nm))continue;n++;}return n;}
// ---------- registrar al analizar (la ficha de 085)
{const f=atCardShow;atCardShow=function(){const c=AT.cur,before=state.atSeen?Object.assign({},state.atSeen):{};const r=f.apply(this,arguments);try{if(!c)return r;state.atSeen=state.atSeen||{};
  // la ficha de 085 guarda 'at:'+nombre; aquí, la clave de verdad (los ejemplares de una serie, por su sitio)
  const key=k13Key(c);if(key&&key.startsWith('atx:')&&!before['at:'+c.name]&&state.atSeen['at:'+c.name])delete state.atSeen['at:'+c.name];
  const isNew=key&&!before[key]&&!(key.startsWith('at:')&&before[key]);if(key)state.atSeen[key]=1;const n=k13Count(),left=Math.max(0,K13.GOAL-n);
  const e=$('atCard');if(e&&key){e.insertAdjacentHTML('beforeend','<p style="margin:8px 0 0;font-size:.9em;color:'+(isNew?'#ffd27a':'#cbbfa8')+'">'+(isNew?'✦ Nuevo · ':'Ya observado · ')+'<b>'+Math.min(n,K13.GOAL)+'</b> de '+K13.GOAL+(left?' · te faltan '+left:' · ¡todo observado!')+'</p>');}
  if(isNew){save();k13Milestones(n);try{updateStats();}catch(e){}}}catch(err){console.warn('k13',err);}return r;};}
// ---------- hitos
function k13Milestones(n){const z=k13z(),ro=MODE==='roma';const coin=ro?'sestercios':'óbolos';
  const h=Math.floor(Math.min(n,K13.GOAL)/100);if(h>z.ms){z.ms=h;state.obols=(state.obols||0)+5;save();toast('<span class="label">'+(h*100)+' cosas observadas</span><br>+5 '+coin+'. Te faltan '+Math.max(0,K13.GOAL-n)+'.');}
  if(n>=500&&!z.title){z.title=1;save();vmS('◉',ro?'Diligens':'Φιλοθεάμων','500 cosas observadas','<p>'+(ro?'En el barrio ya te llaman <b>diligens</b>: el que se fija en todo.':'En el Ágora ya te llaman <b>philotheámon</b>, «amigo de mirar»: Platón usa la palabra para los que no se pierden un espectáculo (República V 475d).')+'</p><p class="sub">Te faltan '+(K13.GOAL-n)+'. A las 1000, un regalo para los ojos.</p>',[vmBye]);}
  if(n>=1000&&!z.lince){z.lince=1;save();vmS('👁','Los ojos de Linceo','1000 cosas observadas','<p>Linceo, el argonauta, veía tan lejos que distinguía lo que había bajo tierra. Desde hoy, en el modo atención, unas marcas doradas te señalan lo que aún no has observado cerca.</p><p class="sub">Píndaro, Nemea X 61-63.'+(ro?' Apolonio de Rodas, Argonáuticas I 151-155.':' (Apolonio de Rodas lo cuenta también, pero un siglo después de este juego.)')+'</p>',[vmBye]);}
  if(n>=K13.GOAL&&!z.done){z.done=1;save();setTimeout(k13Final,1200);}}
// ---------- lo grande: la estatua, el título y el mapa
function k13Final(){const ro=MODE==='roma',nm=(pjz()&&pjz().name)||'',z=k13z();k13Statue();
  vmS('✦',ro?'Una estatua en el Foro':'Una estatua en el Ágora','2000 cosas observadas',
   '<p>'+(ro?'El Senado y el pueblo de Roma acuerdan honrarte con una <b>estatua de bronce en el Foro</b>, como a los que han servido bien a la ciudad. En la basa, la inscripción: <i>«A '+nm+', de Quíos, que lo observó todo»</i>.':'La Asamblea vota levantarte una <b>estatua de bronce en el Ágora</b>, el honor más alto que la ciudad concede a un extranjero. En la basa: <i>«El pueblo, a '+nm+' de Quíos, que lo observó todo»</i>.')+'</p>'+
   '<p>Te llaman, desde hoy, <b>'+(ro?'Spectator':'Theōrós (θεωρός)')+'</b>: '+(ro?'el que contempla.':'«el que mira»; también se llamaba así a los embajadores sagrados que la ciudad enviaba a los grandes festivales.')+'</p>'+
   '<p>Y te regalan <b>'+(ro?'una copia del mapa de Agripa':'el mapa de Hecateo')+'</b>, el mundo entero en una tabla, para que veas todo lo que has recorrido.</p>'+
   '<p class="sub">'+(ro?'Las estatuas honoríficas llenaban el Foro; Plinio cuenta que había tantas que hubo que retirar muchas (Historia natural XXXIV 30). Agripa mandó pintar un gran mapa del mundo en el pórtico de Vipsania (Plinio III 17).':'Atenas concedía estatuas de bronce en el Ágora a muy pocos: los tiranicidas, Conón tras la batalla de Cnido (394 a.C.; Demóstenes XX 70). Hecateo de Mileto dibujó hacia el 500 a.C. un mapa del mundo que mejoraba el de Anaximandro (Agatémero I 1).')+'</p>',
   [['Ver el mapa',()=>{closeDialog();setTimeout(k13Map,80);}],['Gracias',()=>closeDialog()]]);}
function k13Statue(){if(K13.stat||!k13z().done)return;const P=PLACES.find(p=>p.id===(MODE==='roma'?'foro':'mercado'))||PLACES.find(p=>/foro|mercado|agora/i.test(p.id));if(!P)return;
  let x=P.x+12,z=P.z-10;try{const f=findFree(x,z,1.6);x=f[0];z=f[1];}catch(e){}const y=floorAt(x,z),g=new THREE.Group();g.position.set(x,y,z);scene.add(g);
  const base=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.3,1.4),lam('#d8d0c0'));base.position.y=0.65;base.castShadow=true;g.add(base);
  const c=Object.assign({},(pjz()&&pjz().look)||{},{female:pjz()&&pjz().g==='f'});let fig=null;try{fig=makePerson(Object.assign({noBlender:true,noVary:true},c));}catch(e){}
  if(fig){fig.traverse(o=>{if(o.isMesh)o.material=new THREE.MeshPhongMaterial({color:'#8a6a3e',shininess:60,specular:new THREE.Color('#e8c890')});});fig.position.y=1.3;fig.scale.setScalar(1.15);g.add(fig);}
  addCirc(x,z,0.9);const nm=(pjz()&&pjz().name)||'';egxObj(x,z,y,()=>k13Final(),MODE==='roma'?'Tu estatua':'Tu estatua','«…que lo observó todo» · '+nm,2.6);K13.stat=g;}
function k13Map(){const L=PLACES.filter(p=>isFinite(p.x)&&state.atSeen&&state.atSeen['at:'+p.name]);let d=$('k13Map');if(!d){d=document.createElement('div');d.id='k13Map';document.body.appendChild(d);}
  const xs=L.map(p=>p.x),zs=L.map(p=>p.z),x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs);
  d.style.cssText='position:fixed;inset:0;z-index:66;background:rgba(10,8,6,.9);display:flex;align-items:center;justify-content:center';
  const W=900,H=560,sx=v=>20+(v-x0)/Math.max(1,x1-x0)*(W-40),sz=v=>20+(v-z0)/Math.max(1,z1-z0)*(H-40);
  d.innerHTML='<div style="background:#e9dcc0;color:#2a1e14;border-radius:8px;padding:14px;max-width:96vw"><div style="display:flex;justify-content:space-between;align-items:center"><b>'+(MODE==='roma'?'El mapa de Agripa: lo que has recorrido':'El mapa de Hecateo: lo que has recorrido')+'</b><button id="k13X">✕</button></div>'+
   '<svg viewBox="0 0 '+W+' '+H+'" style="width:min(900px,92vw);height:auto;background:#f3e8cf;border:1px solid #8a6a3e;margin-top:8px">'+L.map(p=>'<circle cx="'+sx(p.x).toFixed(1)+'" cy="'+sz(p.z).toFixed(1)+'" r="2.4" fill="#8a2a1e"><title>'+p.name.replace(/</g,'')+'</title></circle>').join('')+'</svg>'+
   '<p style="margin:6px 0 0;font-size:.9em">'+L.length+' lugares observados. Pasa el ratón por un punto para ver su nombre. (Las distancias son las del juego, no las reales.)</p></div>';
  d.querySelector('#k13X').onclick=()=>d.remove();d.onclick=e=>{if(e.target===d)d.remove();};}
// ---------- los ojos de Linceo: marcas sobre lo que falta, cerca, mientras se mira con atención
const K13_MKM=new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ffd25a',transparent:true,opacity:0.85,depthTest:false,blending:THREE.AdditiveBlending});
function k13Lince(dt){const z=k13z();for(const m of K13.mk)m.visible=false;if(!z.lince||!AT.on)return;K13.lyT-=dt;if(K13.lyT>0&&K13.mkL)return;K13.lyT=0.5;
  const S=state.atSeen||{},P=player,out=[];try{for(const c of atCands()){if(!isFinite(c.x)||c.place)continue;const d=Math.hypot(c.x-P.x,c.z-P.z);if(d>45)continue;const k=k13Key(c);if(!k||S[k])continue;out.push([d,c]);}}catch(e){}
  out.sort((a,b)=>a[0]-b[0]);K13.mkL=out.slice(0,14);while(K13.mk.length<K13.mkL.length){const s=new THREE.Sprite(K13_MKM);s.scale.set(0.7,0.7,1);s.renderOrder=11;scene.add(s);K13.mk.push(s);}
  K13.mkL.forEach(([d,c],i)=>{const s=K13.mk[i];s.position.set(c.x,(c.y||floorAt(c.x,c.z))+0.9,c.z);s.visible=true;});}
{const f=atTick;atTick=function(dt){const r=f.apply(this,arguments);try{if(k13z().lince){if(!AT.on)K13.mkL=null;k13Lince(dt);}}catch(e){}return r;};}
// ---------- en Metas: la meta, y honra por lo observado
{const f=honParts;honParts=function(){const P=f.apply(this,arguments);P.push(['Cosas observadas (cada 20)',Math.floor(Math.min(k13Count(),K13.GOAL)/20),1]);return P;};}
try{MET_BIG.atenas.push(['◉','Observarlo todo','2000 cosas en el modo atención (Q). Al final, una estatua.',()=>k13Count()>=K13.GOAL]);MET_BIG.roma.push(['◉','Observarlo todo','2000 cosas en el modo atención (Q). Al final, una estatua.',()=>k13Count()>=K13.GOAL]);}catch(e){}
{const f=metHTML;metHTML=function(){let h=f.apply(this,arguments);try{const n=k13Count(),p=Math.min(1,n/K13.GOAL);h=h.replace('<h4>Lo que te espera','<h4>Mirar con atención · '+Math.min(n,K13.GOAL)+'/'+K13.GOAL+'</h4><div class="nxt"><div>Has observado <b>'+Math.min(n,K13.GOAL)+'</b> cosas; te faltan <b>'+Math.max(0,K13.GOAL-n)+'</b>. Mantén <b>Q</b> (o el ojo) y pulsa E sobre lo que tengas delante. '+(n<500?'A las 500, un título; a las 1000, los ojos de Linceo; a las 2000, una estatua.':n<1000?'A las 1000, los ojos de Linceo; a las 2000, una estatua.':n<K13.GOAL?'A las 2000, una estatua en '+(MODE==='roma'?'el Foro.':'el Ágora.'):'')+'</div><div class="bar"><i style="width:'+Math.round(p*100)+'%"></i></div></div><h4>Lo que te espera');}catch(e){}return h;};}
// ---------- censo (para las pruebas): cuántas cosas distintas se pueden registrar recorriendo todos los lugares
function k13Census(){const keys=new Set(),P=player,sx=P.x,sz=P.z;const spots=PLACES.filter(p=>isFinite(p.x)).map(p=>[p.x,p.z]);try{for(const I of ISLANDS)if(I.town||I.x)spots.push([(I.town||I).x,(I.town||I).z]);}catch(e){}
  try{for(const[x,z]of spots){P.x=x;P.z=z;for(const c of atCands()){const k=k13Key(c);if(k)keys.add(k);}}}finally{P.x=sx;P.z=sz;}
  // las series, enteras (aunque queden lejos de los puntos de muestreo)
  try{const S=new Set(K13_SER[MODE==='roma'?'roma':'atenas']);for(const a of ATR.values())for(const o of a)if(S.has(o.k))keys.add('atx:'+o.k+':'+Math.round(o.x)+','+Math.round(o.z));}catch(e){}
  let sky=0;try{sky=GQ_STARS.length+GQ_CONST.length;for(const S of GQ_STARS)keys.add('at:Estrella: '+((K13_ANT[S[0]]||[S[0]])[0]));for(const C of GQ_CONST)keys.add('at:Constelación: '+C[0]);}catch(e){}
  let u=0,s=0;for(const k of keys)k.startsWith('atx:')?s++:u++;return{total:keys.size,unicos:u,series:s,cielo:sky};}
// ---------- el bucle
{let t=0;const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;t+=dt;if(t>3){t=0;if(k13z().done)k13Statue();}}catch(e){}return r;};}
// ---------- el cielo de noche: constelaciones y estrellas (212 las dibuja con su posición real para el año y el lugar)
const K13_CON={'Orión':['Ὠρίων','El cazador gigante. Cuando sale al amanecer, en verano, es tiempo de trillar; cuando se pone, de arar (Hesíodo, Trabajos y días 598 y 615). En la Odisea, Odiseo lo ve cazando en el Hades (XI 572-575).'],
 'La Osa Mayor (Hélice)':['Ἄρκτος · Ἑλίκη','La Osa, que también llaman el Carro: la única que nunca se baña en el Océano, porque no se pone (Odisea V 273-275). Los marinos griegos se orientaban por ella; los fenicios, por la Osa Menor.'],
 'El León':['Λέων','El Sol la cruza en pleno verano, en los días de más calor. Más tarde se contó que era el león de Nemea, puesto en el cielo por Zeus.'],
 'El Cisne':['Ὄρνις','Los griegos la llamaban simplemente el Ave. Después se dijo que era Zeus transformado en cisne para acercarse a Leda.'],
 'La Lira':['Λύρα','La lira que Hermes fabricó con el caparazón de una tortuga (Himno homérico a Hermes 24-51) y que tocó Orfeo.'],
 'El Can Mayor (Sirio)':['Κύων','El perro de Orión, con Sirio en la boca. Su salida al amanecer, a finales de julio, marcaba los «días de perro», los más calurosos (Hesíodo, Trabajos y días 582-588).'],
 'Las Pléyades':['Πλειάδες','Las siete hijas de Atlas y Pléyone. «Cuando salen las Pléyades, empieza la siega; cuando se ponen, la siembra» (Hesíodo, Trabajos y días 383-384). A simple vista se ven seis.'],
 'Pegaso':['Ἵππος','Los griegos la llamaban el Caballo. Más tarde se dijo que era Pegaso, el caballo alado nacido de la sangre de Medusa.'],
 'Los Gemelos (Dioscuros)':['Δίδυμοι','Cástor y Polideuces, los Dioscuros, hermanos de Helena: protegen a los marinos, que ven su señal en las luces de los mástiles durante las tormentas.'],
 'El Boyero (Arturo)':['Βοώτης','El Boyero, «que se pone tarde» (Odisea V 272), sigue a la Osa por el cielo. Su estrella más brillante es Arturo.'],
 'El Escorpión':['Σκορπίος','El escorpión que mató a Orión: por eso, dicen, nunca están los dos a la vez en el cielo; cuando sale uno, se pone el otro.']};
const K13_ANT={Sirius:['Sirio','Σείριος','La estrella más brillante del cielo. Hesíodo avisa de que en verano «Sirio seca la cabeza y las rodillas» (Trabajos y días 587); en la Ilíada es «el perro de Orión» (XXII 29).'],
 Arcturus:['Arturo','Ἀρκτοῦρος','«El guardián de la Osa». Hesíodo marca con su salida al anochecer el final del invierno y la poda de las viñas, y con su salida al amanecer, la vendimia (Trabajos y días 564-570 y 609-611).'],
 Procyon:['Proción','Προκύων','«El que va delante del Perro»: sale por el este poco antes que Sirio.'],
 Canopus:['Canopo','Κάνωβος','Desde Atenas apenas asoma sobre el horizonte sur; en Egipto se ve alta. Su nombre es el del puerto egipcio de Canopo.'],
 Capella:['La Cabra','Αἴξ','Los griegos la llamaban la Cabra: Amaltea, la cabra que amamantó a Zeus niño en Creta.'],
 Spica:['La Espiga','Στάχυς','La espiga de trigo que lleva en la mano la Virgen.'],
 Castor:['Cástor','Κάστωρ','Uno de los Dioscuros, el domador de caballos.'],Pollux:['Polideuces (Pólux)','Πολυδεύκης','El otro Dioscuro, el boxeador.'],
 Antares:['Antares','Ἀντάρης','«Rival de Ares»: roja como el planeta de Ares. Es el corazón del Escorpión.'],
 Alcyone:['Alcíone','Ἀλκυόνη','Una de las Pléyades, hijas de Atlas.'],Electra:['Electra','Ἠλέκτρα','Una de las Pléyades, madre de Dárdano, el antepasado de los troyanos.'],
 Maia:['Maya','Μαῖα','La mayor de las Pléyades, madre de Hermes.'],Merope:['Mérope','Μερόπη','Una de las Pléyades: dicen que brilla menos porque se casó con un mortal, Sísifo.'],
 Taygeta:['Taigete','Ταϋγέτη','Una de las Pléyades; da nombre al monte Taigeto, sobre Esparta.'],Atlas:['Atlas','Ἄτλας','El padre de las Pléyades, a su lado en el cielo.']};
function k13StarDef(n){const A=K13_ANT[n];let con='';for(const[c,L]of GQ_CONST)if(L.some(p=>p[0]===n||p[1]===n)){con=c;break;}const S=GQ_STARS.find(s=>s[0]===n),mag=S?S[3]:3;
  if(A)return{name:'Estrella: '+A[0],sub:A[1]+(con?' · '+con:''),txt:()=>A[2]+' (Magnitud '+mag+': cuanto menor el número, más brillante.)'};
  return{name:'Estrella: '+n,sub:con?'en '+con:'estrella',txt:()=>'Una estrella de magnitud '+mag+' (cuanto menor el número, más brillante).'+(con?' Forma parte de '+con+'.':'')+' Su nombre, «'+n+'», es moderno, casi siempre de origen árabe o medieval: astrónomos griegos como Eudoxo la señalaban por su lugar en la figura (el pie, el ojo, la cola…).'};}
{const f=atGround;atGround=function(){try{const D=new THREE.Vector3();camera.getWorldDirection(D);const op=STARS.material.opacity;
  if(D.y>0.12&&op>0.3&&typeof gqStarPos==='function'){const S=gqStarPos(),v=new THREE.Vector3();let best=null,ba=0.045;
    for(const n in S){const p=S[n];v.set(p[0],p[1],p[2]).normalize();if(v.y<0)continue;const a=Math.acos(Math.min(1,v.dot(D)));if(a<ba){ba=a;best=n;}}
    if(best){const d=k13StarDef(best);return Object.assign({sky:1,def:atShort(d.txt())},d);}
    let bc=null,bca=0.2;for(const[c,L]of GQ_CONST){let cx=0,cy=0,cz=0,k=0;for(const pr of L)for(const n of pr){const p=S[n];if(!p)continue;v.set(p[0],p[1],p[2]).normalize();cx+=v.x;cy+=v.y;cz+=v.z;k++;}if(!k)continue;v.set(cx,cy,cz).normalize();if(v.y<0)continue;const a=Math.acos(Math.min(1,v.dot(D)));if(a<bca){bca=a;bc=c;}}
    if(bc){const C=K13_CON[bc]||['',''];return{sky:1,name:'Constelación: '+bc,sub:C[0],def:atShort(C[1]),txt:()=>C[1]};}}}catch(e){}return f.apply(this,arguments);};}
