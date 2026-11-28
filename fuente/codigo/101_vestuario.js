// ============================================================ VESTUARIO: ropa, colores, pelo, coronas, calzado y anillos con sus reglas
// En Atenas no hay leyes sobre la ropa: metecos, extranjeros y ciudadanos visten igual (Pseudo-Jenofonte, Constitución de los atenienses 1.10).
// En Roma sí: toga, estola y calcei son de ciudadanos; el clavus y el anillo de oro, de caballeros. Las coronas de los juegos solo se ganan.
function vestz(){if(!state.vest||typeof state.vest!=='object')state.vest={own:{},wear:{}};const v=state.vest;v.own=v.own||{};v.wear=v.wear||{};return v;}
const vEsCiu=()=>typeof fxEsCiu==='function'&&fxEsCiu();
const VCOL=[['natural','Lana sin teñir','#e8dfcc',0,'El color de la lana o del lino tal cual: lo que viste casi todo el mundo.'],['pardo','Pardo','#8a6a4a',2,'Lana oscura, de oveja negra o teñida con corteza: ropa de trabajo y de viaje.'],
 ['azul','Azul de glasto','#4f6a7d',6,'El glasto (isatis) da azules discretos; el índigo de la India es carísimo.'],['azafran','Azafrán','#d9a23a',6,'El azafrán tiñe de amarillo intenso; en Atenas es el color del krokotós, la túnica de las niñas en Braurón.'],
 ['rojo','Rojo de rubia','#a8392b',8,'La raíz de la rubia (Rubia tinctorum) da rojos que no se van con el lavado.'],['purpura','Púrpura de Tiro','#5a1f4a',30,'Se saca de un caracol de mar, el múrice: hacen falta miles para teñir un manto, por eso vale una fortuna (Plinio, Historia natural IX 124-141).']];
const VEST={A:[
 {k:'quiton',s:'tun',n:'Quitón corto',p:0,look:{},t:'La túnica de todos los días, de lana o de lino, ceñida a la cintura.'},
 {k:'exomis',s:'tun',n:'Exomís',p:2,look:{exomis:true},t:'Túnica de trabajo que deja un hombro al aire: la llevan artesanos, esclavos y campesinos, y también Hefesto en los vasos.'},
 {k:'peplo',s:'tun',n:'Peplo',p:4,fem:true,look:{pattern:true},t:'El vestido dórico de lana, prendido en los hombros con fíbulas: el que se teje cada año para Atenea en las Panateneas.'},
 {k:'himation',s:'man',n:'Himatión',p:0,look:{},t:'El manto grande que envuelve el cuerpo: vestirlo con elegancia, sin que arrastre, es señal de buena educación.'},
 {k:'clamide',s:'man',n:'Clámide',p:5,male:true,look:{himOnly:true},t:'El manto corto prendido en el hombro de los jinetes, los viajeros y los efebos.'},
 {k:'sinmanto',s:'man',n:'Sin manto',p:0,look:{noHimation:true},t:'Solo con la túnica, como quien trabaja o hace calor.'},
 {k:'velo',s:'man',n:'Manto sobre la cabeza',p:0,fem:true,look:{veil:true},t:'Las mujeres respetables se cubren la cabeza con el manto al salir de casa.'},
 {k:'barba',s:'pelo',n:'Barba',p:0,male:true,look:{beard:true},t:'En el siglo IV los atenienses adultos llevan barba; afeitarse es cosa de jóvenes.'},
 {k:'afeitado',s:'pelo',n:'Sin barba',p:1,male:true,look:{beard:false},t:'Como los muchachos y los efebos. Un adulto afeitado llama la atención: Alejandro pondrá de moda el afeitado medio siglo después.'},
 {k:'laconio',s:'pelo',n:'Melena «a la espartana»',p:1,male:true,look:{beard:true},say:'«¡Mira ese, con melena de espartano!» Los atenienses se burlaban de los lakonízontes, los admiradores de Esparta que imitaban su pelo largo y su bastón (Aristófanes, Aves 1281-1283).',t:'El pelo largo de los espartanos. En Atenas delata simpatía por Esparta.'},
 {k:'recogido',s:'pelo',n:'Pelo recogido en un moño',p:0,fem:true,look:{},t:'El krobylos, el moño de las atenienses, a veces cubierto con un pañuelo, el sakkos.'},
 {k:'mirto',s:'cor',n:'Corona de mirto',p:3,look:{crown:'#4f7a3a'},t:'Para el simposio y las bodas: el mirto es de Afrodita.'},
 {k:'hiedra',s:'cor',n:'Corona de hiedra',p:3,look:{crown:'#3f6a2a'},t:'La hiedra es de Dioniso: se lleva en las Dionisias y en los banquetes.'},
 {k:'olivo',s:'cor',n:'Corona de olivo silvestre',p:0,look:{crown:'#7f8b5d'},lock:()=>'Solo se gana venciendo en Olimpia: el kótinos de olivo silvestre no se compra.',t:'El premio de Olimpia, cortado de un olivo sagrado junto al templo de Zeus.'},
 {k:'laurel',s:'cor',n:'Corona de laurel',p:0,look:{crown:'#4a6a32'},lock:()=>'Es el premio de los Juegos Píticos de Delfos y la llevan los sacerdotes de Apolo: no se compra.',t:'El laurel es de Apolo: premio de Delfos.'}],
 R:[
 {k:'tunica',s:'tun',n:'Túnica',p:0,look:{short:true},t:'Lo que viste casi todo el mundo en Roma, ciudadanos incluidos, fuera de las ocasiones solemnes.'},
 {k:'toga',s:'tun',n:'Toga',p:12,male:true,look:{toga:true,short:false},lock:()=>vEsCiu()?null:'Solo pueden vestirla los ciudadanos romanos. Claudio se la hizo quitar a extranjeros que se hacían pasar por ciudadanos (Suetonio, Claudio 15 y 25).',t:'Seis metros de lana blanca, pesada y cara: la vistes en el Foro, en los tribunales y en la salutatio de tu patrono.'},
 {k:'clavus',s:'tun',n:'Túnica con franja estrecha (angusticlavia)',p:0,male:true,look:{short:true,clavus:'#6a1f3a'},lock:()=>'La franja púrpura estrecha es de los caballeros (equites), y la ancha, de los senadores: no basta con pagarla.',t:'Las franjas púrpura de la túnica dicen el rango de quien la lleva.'},
 {k:'stola',s:'tun',n:'Estola',p:10,fem:true,look:{},lock:()=>vEsCiu()?null:'La estola es el vestido de la matrona, la mujer casada según el derecho romano: una extranjera no la lleva.',t:'Vestido largo de tirantes sobre la túnica: la señal de la matrona respetable.'},
 {k:'pallium',s:'man',n:'Pallium griego',p:4,look:{himation:null},t:'El manto a la griega: el de los extranjeros, los filósofos y los romanos que quieren parecer cultos.'},
 {k:'paenula',s:'man',n:'Paenula',p:5,look:{himOnly:true},t:'Capa cerrada con capucha, de lana gruesa o de cuero: la de los viajeros y los días de lluvia.'},
 {k:'sinmanto',s:'man',n:'Sin manto',p:0,look:{noHimation:true},t:'Solo la túnica, como la gente que trabaja.'},
 {k:'palla',s:'man',n:'Palla sobre la cabeza',p:3,fem:true,look:{veil:true},t:'El manto con el que las romanas se cubren la cabeza en la calle y en los sacrificios.'},
 {k:'afeitado',s:'pelo',n:'Afeitado',p:0,male:true,look:{beard:false},t:'En el año 80 los romanos van afeitados: la barba volverá con Adriano, cuarenta años más tarde.'},
 {k:'barba',s:'pelo',n:'Barba de filósofo',p:1,male:true,look:{beard:true},say:'«¿Y esa barba? ¿Eres filósofo griego?» En Roma solo los filósofos y los que están de luto se dejan barba.',t:'Rara en Roma: es la marca de los filósofos griegos y de los que guardan luto.'},
 {k:'flavio',s:'pelo',n:'Tupé de rizos flavio',p:6,fem:true,look:{},t:'La moda de la corte: un alto frente de rizos sobre la frente, como el de Julia, la hija de Tito. Hace falta una ornatrix, una esclava peinadora, y horas.'},
 {k:'mono',s:'pelo',n:'Moño sencillo',p:0,fem:true,look:{},t:'Pelo recogido en la nuca: el de la mayoría de las mujeres.'},
 {k:'soleae',s:'calz',n:'Sandalias (soleae)',p:0,look:{},t:'Para casa y para el campo. En el Foro, con la toga, no quedan bien.'},
 {k:'calcei',s:'calz',n:'Calcei',p:6,look:{},lock:()=>vEsCiu()?null:'El calceus es el zapato cerrado del ciudadano, el que va con la toga. Los de los senadores son rojos.',t:'Zapato cerrado de cuero, atado al tobillo: el calzado del ciudadano en público.'},
 {k:'hierro',s:'ani',n:'Anillo de hierro',p:1,look:{},t:'El anillo de sello de casi todos: sirve para firmar en la cera.'},
 {k:'oro',s:'ani',n:'Anillo de oro',p:0,look:{},lock:()=>'El anillo de oro es de los caballeros (ius anuli aurei); un liberto solo puede llevarlo si se lo concede el emperador.',t:'El distintivo del orden ecuestre.'},
 {k:'mirto',s:'cor',n:'Corona de mirto',p:3,look:{crown:'#4f7a3a'},t:'Para las bodas y los banquetes.'},
 {k:'rosas',s:'cor',n:'Corona de rosas',p:5,look:{crown:'#b84a5a'},t:'En los banquetes, sobre todo en las Rosalias de mayo.'},
 {k:'laurel',s:'cor',n:'Corona de laurel',p:0,look:{crown:'#4a6a32'},lock:()=>'La corona de laurel es del general que celebra el triunfo, y ahora del emperador: nadie más la lleva por la calle.',t:'La corona del triunfo.'}]};
const VSLOT={tun:'Túnica o vestido',man:'Manto',pelo:'Pelo',cor:'Corona',calz:'Calzado',ani:'Anillo',col:'Color de la ropa'};
function vestList(){const fem=pjFem();return VEST[MODE==='roma'?'R':'A'].filter(it=>!(it.fem&&!fem)&&!(it.male&&fem));}
function vestWear(){const v=vestz(),L=vestList(),patch={};for(const s in v.wear){const it=L.find(i=>i.s===s&&i.k===v.wear[s]);if(it&&!(it.lock&&it.lock()))Object.assign(patch,it.look);}
  const c=VCOL.find(c=>c[0]===v.wear.col);if(c&&c[0]!=='natural'){if(MODE==='roma'&&patch.toga){}else patch.himation=c[2];}if(v.wear.tcol){const c2=VCOL.find(c=>c[0]===v.wear.tcol);if(c2&&!patch.toga)patch.chiton=c2[2];}
  if(patch.himation===null)delete patch.himation;return patch;}
const playerLookV=playerLook;playerLook=function(){const L=Object.assign({},playerLookV(),vestWear());if(L.crown){AVATAR.crown=L.crown;delete L.crown;}else AVATAR.crown=null;return L;};
const pjAvatarV=pjAvatar;pjAvatar=function(){pjAvatarV();vestCrown();};
const buildAvatarV=buildAvatar;buildAvatar=function(){buildAvatarV();try{vestCrown();}catch(e){}};
function vestCrown(){const g=AVATAR.walk;if(!g)return;const old=g.getObjectByName('vestCrown');if(old)g.remove(old);if(!AVATAR.crown)return;g.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(g),h=b.max.y-g.position.y;
  const c=new THREE.Group();c.name='vestCrown';const m=lam(AVATAR.crown),ring=new THREE.Mesh(new THREE.TorusGeometry(0.1,0.018,6,18),m);ring.rotation.x=Math.PI/2;c.add(ring);
  for(let i=0;i<14;i++){const a=i/14*TAU,l=new THREE.Mesh(new THREE.SphereGeometry(0.028,5,4),m);l.scale.set(1,0.5,1.8);l.position.set(Math.cos(a)*0.1,0.01,Math.sin(a)*0.1);l.rotation.y=-a;c.add(l);}c.position.set(0,h-0.09,0.005);g.add(c);}
function vestMenu(){const v=vestz(),L=vestList(),mon=MODE==='roma'?'sestercios':'óbolos',ro=MODE==='roma';
  const owns=it=>it.p===0||v.own[it.k+'_'+it.s];
  const slotHtml=s=>{const items=L.filter(i=>i.s===s);if(!items.length)return '';const cur=v.wear[s]||items[0].k;
    return '<h4 style="color:#f0c890;margin:12px 0 4px">'+VSLOT[s]+'</h4>'+items.map(it=>{const lk=it.lock&&it.lock(),on=cur===it.k&&!lk;return '<div style="display:flex;gap:8px;align-items:flex-start;padding:6px;border:1px solid '+(on?'#8fd6ff':'#6a4a30')+';border-radius:8px;margin:4px 0;opacity:'+(lk?0.6:1)+'"><div style="flex:1"><b>'+(on?'✓ ':'')+it.n+'</b><br><span style="opacity:.85;font-size:14px">'+it.t+'</span>'+(lk?'<br><span style="color:#e8a07a;font-size:14px">'+lk+'</span>':'')+'</div>'+
      (lk?'':owns(it)?(on?'':'<button data-w="'+s+'|'+it.k+'">Ponérmelo</button>'):'<button data-b="'+s+'|'+it.k+'">Comprar ('+it.p+')</button>')+'</div>';}).join('');};
  const colHtml=(key,label)=>'<h4 style="color:#f0c890;margin:12px 0 4px">'+label+'</h4><div style="display:flex;flex-wrap:wrap;gap:6px">'+VCOL.map(c=>{const own=c[3]===0||v.own['col_'+c[0]],on=(v.wear[key]||'natural')===c[0];return '<button data-c="'+key+'|'+c[0]+'" title="'+c[4]+'" style="border:2px solid '+(on?'#8fd6ff':'#6a4a30')+'"><span style="display:inline-block;width:14px;height:14px;border-radius:7px;background:'+c[2]+';vertical-align:middle"></span> '+c[1]+(own?'':' ('+c[3]+')')+'</button>';}).join('')+'</div>';
  const o=eduOverlay('vestBox','Vestuario','<p style="opacity:.85">'+(ro?(vEsCiu()?'Eres ciudadano romano: puedes vestir la toga, la estola y los calcei.':'Eres un forastero (peregrinus): puedes vestir casi todo, pero no la toga, la estola ni los calcei, que son de los ciudadanos. Consigue la ciudadanía y podrás.'):'En Atenas no hay leyes sobre la ropa: un meteco o un forastero puede vestir lo mismo que un ciudadano. «Aquí no distinguirías por la ropa a un ciudadano de un meteco o de un esclavo», se queja un autor ateniense (Pseudo-Jenofonte, Constitución de los atenienses 1.10).')+' Monedas: '+state.obols+' '+mon+'.</p>'+
    slotHtml('tun')+slotHtml('man')+colHtml('col','Color del manto')+colHtml('tcol','Color de la túnica')+slotHtml('pelo')+slotHtml('cor')+slotHtml('calz')+slotHtml('ani')+'<p class="sub" style="opacity:.75">Míralo en tercera persona (V) o en el modo foto.</p>');
  o.querySelectorAll('button').forEach(b=>{if(b.classList.contains('eduX'))return;b.style.cssText+=';font:inherit;padding:4px 10px;border-radius:8px;background:rgba(217,135,74,.15);color:#f1e8d8;cursor:pointer;'+(b.dataset.c?'':'border:1px solid #d9874a');});
  const apply=()=>{save();pjAvatar();vestMenu();};
  o.querySelectorAll('button[data-w]').forEach(b=>b.onclick=()=>{const[s,k]=b.dataset.w.split('|');v.wear[s]=k;const it=L.find(i=>i.s===s&&i.k===k);if(it&&it.say)setTimeout(()=>toast(it.say),600);apply();});
  o.querySelectorAll('button[data-b]').forEach(b=>b.onclick=()=>{const[s,k]=b.dataset.b.split('|'),it=L.find(i=>i.s===s&&i.k===k);if(state.obols<it.p){toast('No tienes bastante dinero.');return;}state.obols-=it.p;v.own[k+'_'+s]=1;v.wear[s]=k;updateStats();try{sfxCoin();}catch(e){}if(it.say)setTimeout(()=>toast(it.say),600);apply();});
  o.querySelectorAll('button[data-c]').forEach(b=>b.onclick=()=>{const[key,c]=b.dataset.c.split('|'),C=VCOL.find(x=>x[0]===c);if(!(C[3]===0||v.own['col_'+c])){if(state.obols<C[3]){toast('No tienes bastante dinero.');return;}state.obols-=C[3];v.own['col_'+c]=1;updateStats();try{sfxCoin();}catch(e){}}v.wear[key]=c;
    if(c==='purpura')setTimeout(()=>toast(ro?'Un transeúnte se te queda mirando: tanta púrpura sin tener rango es de mal gusto, y Nerón llegó a prohibir algunos tonos (Suetonio, Nerón 32).':'Te miran por la calle: la púrpura es carísima, y quien la lleva presume de rico.'),600);apply();});}
// el códice recoge las prendas que tienes
const eduEntriesV=eduEntries;eduEntries=function(){const E=eduEntriesV(),v=vestz();for(const it of vestList())if(it.p===0||v.own[it.k+'_'+it.s])E.push({c:'Vestuario',n:it.n,t:it.t+(it.lock&&it.lock()?' '+it.lock():'')});return E;};
GM_IC.vest='<path d="M8 4l4 2 4-2 4 4-3 3v9H7v-9L4 8z"/>';
const gmDoV=gmDo;gmDo=function(k){if(k==='vest'){gmClose();setTimeout(vestMenu,80);return;}return gmDoV(k);};

