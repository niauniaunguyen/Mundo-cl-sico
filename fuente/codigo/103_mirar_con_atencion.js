// ============================================================ MIRAR CON ATENCIÓN: definición y brillo de todo lo interactivo
// La definición sale, por este orden, de los textos del propio módulo, de lo que el jugador ya leyó al interactuar (se guarda la primera
// vez) o, si no hay nada, del nombre y su descripción corta. El brillo va a la figura del objeto o, si no tiene, a las piezas de su sitio.
function atStrip(t){return String(t||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
function atTwo(t){t=atStrip(t);const m=t.match(/^(.{30,420}?[.!?»])(\s|$)(.{0,260}?[.!?»])?(\s|$)/);return m?(m[1]+(m[3]&&m[1].length<200?' '+m[3]:'')):t.slice(0,360);}
function atDescOf(o){try{const a=String(o.act||''),k=a.split(':')[1]||'',ro=MODE==='roma';
  if(o.data&&o.data.desc)return o.data.desc;
  if(a.startsWith('amb:')&&AMB_TXT[k])return AMB_TXT[k][2];
  if(a.startsWith('pop:'))return atTwo(POP[ro?'R':'A'].intro);
  if(a.startsWith('nat:')){const id=a.slice(4);if(typeof NAT_NY!=='undefined'&&NAT_NY[id])return atTwo(NAT_NY[id].t);if(id.startsWith('tr_')&&typeof NAT_TRAV!=='undefined'&&NAT_TRAV[id.slice(3)])return atStrip(NAT_TRAV[id.slice(3)][3]);}
  if(a==='rc:mirador'&&typeof RC_VIEW!=='undefined'){const I=islandOf(o.x);if(I&&RC_VIEW[I.id])return 'Mirador. '+RC_VIEW[I.id];}
  if(a==='rc:ruina'&&typeof RC_RUIN!=='undefined'){const I=islandOf(o.x);if(I&&RC_RUIN[I.id])return RC_RUIN[I.id][0]+'. '+atTwo(RC_RUIN[I.id][1]);}
  const L=state&&state.atDesc;if(L&&L[a])return L[a];}catch(e){}return '';}
// la primera vez que se lee de verdad, se guarda la explicación para el modo atención
const egxActAt=egxAct;egxAct=function(o){const r=egxActAt(o);try{const a=String(o.act||'');setTimeout(()=>{const d=$('dialog'),b=$('dBody');if(!d||d.hidden||!b)return;const t=atTwo(b.innerText||'');if(t.length<25)return;state.atDesc=state.atDesc||{};if(!state.atDesc[a]){state.atDesc[a]=t;save();}},120);}catch(e){}return r;};
// brillo: si el objeto no tiene figura propia, se iluminan las piezas que hay en su sitio
function atGlowNear(x,z,y){let n=0;const b=new THREE.Box3(),v=new THREE.Vector3();for(const o of scene.children){if(n>=3)break;if(!o.visible||o.userData.atGlow||o.isInstancedMesh||o.isLight||o.isSprite||o.isPoints||o.isLine)continue;
    if(Math.abs(o.position.x-x)>2.6||Math.abs(o.position.z-z)>2.6)continue;if(Math.abs(o.position.y-y)>8)continue;b.setFromObject(o);if(b.isEmpty())continue;b.getSize(v);if(v.x>14||v.z>14||v.y>14)continue;if(atGlowObj(o))n++;}return n;}
const atGlowSetN=atGlowSet;atGlowSet=function(c){if(c&&!c.obj&&!c.place&&c!==ATG.cur&&!(ATG.cur&&c.name===ATG.cur.name&&c.sub===ATG.cur.sub&&Math.hypot(c.x-ATG.cur.x,c.z-ATG.cur.z)<1)){atGlowClear();ATG.cur=c;try{if(atGlowNear(c.x,c.z,floorAt(c.x,c.z)))return;atGlowRing(c.x,floorAt(c.x,c.z),c.z,1.1);}catch(e){}return;}return atGlowSetN(c);};

// definición sin efectos: se abre el diálogo de forma invisible, se copia el texto y se restaura todo (estado, posición, interfaz)
const AT_NOPROBE=/^(tt:|pir_|faro_|d:oraculo|fs:|c:|sm:|hd:|at:|col:|cy:mini|f:|ep:|epi|sea|barco|boat|moon|luna|knos|daed|oly|gate|casa|hogar|h:)/;
function atProbe(o){const a=String(o.act||'');if(!a||AT_NOPROBE.test(a))return '';state.atDesc=state.atDesc||{};if(state.atDesc[a])return state.atDesc[a];
  const snap={};for(const k in state)if(k!=='atDesc')snap[k]=JSON.stringify(state[k]);const pl={x:player.x,z:player.z,feet:player.feet,yaw:player.yaw,pitch:player.pitch,camY:player.camY},ui0=ui,dlg0=typeof dlg!=='undefined'?dlg:null,dl=$('dialog'),hid=dl?dl.hidden:true,b0=$('dBody')?$('dBody').innerHTML:'',o0=$('dOpts')?$('dOpts').innerHTML:'',t0=$('dTitle')?$('dTitle').textContent:'',g0=$('dGlyph')?$('dGlyph').textContent:'';
  const kids=new Set(document.body.children),nsc=scene.children.length,G={toast,save,qAdd,updateStats,aOK,setTimeout:window.setTimeout,setInterval:window.setInterval,raf:window.requestAnimationFrame};let txt='';
  try{toast=()=>{};save=()=>{};qAdd=()=>{};updateStats=()=>{};aOK=()=>false;window.setTimeout=()=>0;window.setInterval=()=>0;window.requestAnimationFrame=()=>0;if(dl)dl.style.visibility='hidden';
    if($('dBody'))$('dBody').innerHTML='';egxAct0(o);const b=$('dBody');if(b){const tx=b.textContent||'';if(tx.trim())txt=atTwo(tx);}}catch(e){}
  finally{toast=G.toast;save=G.save;qAdd=G.qAdd;updateStats=G.updateStats;aOK=G.aOK;window.setTimeout=G.setTimeout;window.setInterval=G.setInterval;window.requestAnimationFrame=G.raf;
    for(const k in snap){try{if(JSON.stringify(state[k])!==snap[k])state[k]=JSON.parse(snap[k]);}catch(e){}}for(const k in state)if(!(k in snap)&&k!=='atDesc')delete state[k];
    Object.assign(player,pl);ui=ui0;try{dlg=dlg0;}catch(e){}if(dl){dl.hidden=hid;dl.style.visibility='';}if($('dBody'))$('dBody').innerHTML=b0;if($('dOpts'))$('dOpts').innerHTML=o0;if($('dTitle'))$('dTitle').textContent=t0;if($('dGlyph'))$('dGlyph').textContent=g0;
    for(const el of [...document.body.children])if(!kids.has(el)&&el.id!=='atLay'&&el.id!=='atCard')el.remove();while(scene.children.length>nsc)scene.remove(scene.children[scene.children.length-1]);}
  if(txt.length>=25){state.atDesc[a]=txt;return txt;}return '';}
const atDescOfP=atDescOf;atDescOf=function(o){return atDescOfP(o)||atProbe(o);};

// definiciones escritas a mano para lo que no se puede abrir «en seco» (te lleva a otro sitio o empieza un juego)
const AT_DEF=[[/^pir_entrada/,'La cara norte de la Gran Pirámide, la tumba del faraón Keops (Jufu), de hacia el 2560 a.C. La entrada original está escondida a cierta altura; Heródoto cuenta que la construyeron cien mil hombres en veinte años (Historias II 124).'],
 [/^pir_salir/,'La galería que lleva de vuelta al exterior de la Gran Pirámide.'],
 [/^pir_sarcofago/,'El sarcófago de granito rojo de Asuán, en la Cámara del Rey de la Gran Pirámide. Ya estaba vacío cuando lo vieron los viajeros griegos y romanos.'],
 [/^faro_/,'El Faro de Alejandría, en la isla de Faros: una torre de más de cien metros, obra de Sóstrato de Cnido hacia el 280 a.C., con un fuego en lo alto para guiar a los barcos. Fue una de las siete maravillas del mundo.'],
 [/^d:oraculo/,'El ádyton del templo de Apolo en Delfos: aquí la Pitia, sentada en el trípode, da los oráculos del dios. Las respuestas eran tan oscuras que había que interpretarlas (Heródoto I 53, sobre Creso).'],
 [/^at:/,o=>MODE==='roma'?'Camila, la reina guerrera de los volscos, aliada de Turno contra Eneas: tan veloz que corría sobre las espigas sin doblarlas (Virgilio, Eneida VII 803-817 y XI). Puedes retarla a una carrera.':'Atalanta, la cazadora de Arcadia, criada por una osa: solo se casaría con quien la venciera en la carrera, e Hipómenes lo logró con tres manzanas de oro de Afrodita (Ovidio, Metamorfosis X 560-707). Puedes retarla a una carrera.'],
 [/^hd:/,'El Necromanteion, el oráculo de los muertos junto al río Aqueronte, en el Epiro: aquí se consultaba a las almas de los difuntos. Heródoto cuenta que Periandro de Corinto envió a preguntar a su esposa muerta (V 92).'],
 [/^fs:/,'El antro de la Sibila de Cumas, la profetisa de Apolo que guía a Eneas en su bajada al mundo de los muertos (Virgilio, Eneida VI). Se le atribuían los Libros Sibilinos que Roma guarda en el Capitolio.'],
 [/^col:/,'Una de las 76 entradas numeradas del Anfiteatro Flavio para el público. Cada espectador lleva una tésera con el número de su arco, su sector y su fila, y así 50.000 personas entran y salen en pocos minutos.'],
 [/^tt:/,o=>((o.data&&o.data.sub)?o.data.sub.charAt(0).toUpperCase()+o.data.sub.slice(1)+'. ':'')+(MODE==='roma'?'Juega a los latrunculi, el juego de los soldaditos: se captura encerrando una pieza entre dos de las tuyas (Ovidio, Arte de amar III 357-358). Con él puedes revivir batallas de la Antigüedad en el tablero.':'Juega a la pettéia, el juego de las piedras: se captura encerrando una pieza entre dos de las tuyas; Platón la cita varias veces (República 487b-c). Con él puedes revivir batallas de la Antigüedad en el tablero.')],
 [/^f:/,o=>'Tu granja. '+((o.data&&o.data.sub)?o.data.sub.charAt(0).toUpperCase()+o.data.sub.slice(1)+'.':'')+' Aquí se siembra, se riega, se cosecha y se guarda la cosecha, como en los tratados de Hesíodo (Trabajos y días) y de Catón (Sobre la agricultura).'],
 [/^rc:recoger/,'Plantas silvestres: según la estación hay tomillo, orégano, hinojo, espárragos, bellotas o setas. Sirven para la cocina y como remedio, y se guardan en tu herbario (Teofrasto, Historia de las plantas).']];
const atDescOfD=atDescOf;atDescOf=function(o){const a=String(o.act||'');for(const[re,t]of AT_DEF)if(re.test(a))return typeof t==='function'?t(o):t;return atDescOfD(o);};

