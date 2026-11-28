// ============================================================ AYUDA SIN LLEVAR DE LA MANO (modo libre)
// Un pedagogo que solo habla si lo llamas (G o el botón «?»), con pistas en tres niveles (idea, dirección, sitio exacto); un vecino que se ofrece
// si te ve perdido (y no insiste si dices que no); tres caminos para empezar; un tablón de encargos; y un nivel de ayuda en el menú.
// En el modo Historia la G sigue siendo «llévame»; todo esto es para el modo libre.
const MTR={lost:0,sig:'',walk:0,lx:null,lz:null,cool:0,offer:null,beacon:null,beaconT:0,startT:0};
function mtz(){if(!state.mt||typeof state.mt!=='object')state.mt={help:'poca',path:'',asks:{},fails:{},board:0};const m=state.mt;m.asks=m.asks||{};m.fails=m.fails||{};return m;}
function mtWho(){return MODE==='roma'?{n:'Antíoco',t:'tu paedagogus'}:{n:'Zópiro',t:'tu pedagogo'};}
const MT_PATHS={filo:{n:'La escuela y la filosofía',re:/Filos|Educ|Lengua|Ciencia|Literat|Retór|Histor|Teatro|Arte/i},com:{n:'El comercio y el campo',re:/Econ|Comerc|Oficio|Trabaj|Agric|Artes|Vida/i},dios:{n:'Los dioses y los mitos',re:/Relig|Mito|Culto|Muerte/i}};
// ¿qué conviene hacer ahora? el paso de «Primeros pasos» pendiente o, si ya están, una persona del camino elegido
function mtGoal(){try{const st=curStep();if(st){const at=st.at&&st.at();return{key:'st_'+st.id,title:st.title,short:st.short,cat:st.cat,txt:st.txt,x:at?at.x:null,z:at?at.z:null,who:at&&at.data?at.data.name:null};}}catch(e){}
  const m=mtz(),P=MT_PATHS[m.path];let best=null,bd=1e9;for(const n of npcObjs){if(n.hidden||npcDone(n.data))continue;if(P&&!P.re.test(n.data.cat||''))continue;const d=Math.hypot(n.x-player.x,n.z-player.z);if(d<bd){bd=d;best=n;}}
  if(!best)best=nextTarget();if(!best)return null;const d=best.data;return{key:'np_'+d.id,title:d.lesson||d.name,short:d.where||d.name,cat:d.cat||'',x:best.x,z:best.z,who:d.name};}
function mtIdea(g){const c=g.cat||'',ro=MODE==='roma';if(/Pol/i.test(c))return ro?'Los políticos andan por el Foro, junto a la Curia y los Rostra.':'Los políticos están en el ágora, junto al Bouleuterion y la Tholos.';
  if(/Relig|Mito|Culto/i.test(c))return 'Busca cerca de los templos y los altares: allí están los sacerdotes.';if(/Filos|Educ/i.test(c))return ro?'Los maestros y los filósofos suelen estar en los pórticos y junto a las bibliotecas.':'Los filósofos y los maestros están en el ágora, en los pórticos y en los gimnasios, la Academia y el Liceo.';
  if(/Lugar/i.test(c))return 'Mira a tu alrededor: las estelas tienen un rombo dorado encima.';if(/Econ|Comerc|Oficio|Agric/i.test(c))return ro?'Prueba en los mercados y las tiendas, junto al río y en el Foro.':'Prueba en el mercado del ágora y en los talleres del Cerámico.';
  return 'Pregunta a la gente que tenga un rombo ! sobre la cabeza.';}
function mtSay(t){const w=mtWho();toast('<span class="label">'+w.n+', '+w.t+'</span><br>'+t);}
// pistas en tres niveles para el mismo objetivo
function mtAsk(){if(!state||ui!=='play')return;const m=mtz(),g=mtGoal();if(!g){mtSay('Ahora mismo no se me ocurre nada: has hecho lo más importante. Explora, lee estelas o viaja a otra ciudad.');return;}
  const n=(m.asks[g.key]||0)+1;m.asks[g.key]=Math.min(3,n);save();
  if(n===1){mtSay('Te iría bien esto: <b>'+g.title+'</b>. '+mtIdea(g)+' <span class="sub">(Si me vuelves a preguntar, te digo hacia dónde.)</span>');return;}
  if(n===2||g.x===null){const dx=g.x-player.x,dz=g.z-player.z,d=Math.hypot(dx,dz);mtSay(g.x===null?g.short:'<b>'+g.title+'</b>: '+g.short+'. Está hacia el <b>'+dirName(dx,dz)+'</b>, a unos '+Math.max(10,Math.round(d/10)*10)+' pasos. <span class="sub">(Si vuelves a preguntar, te lo señalo.)</span>');return;}
  mtBeacon(g.x,g.z);mtSay('Mira la columna de luz dorada: allí está <b>'+(g.who||g.short||g.title)+'</b>. '+(g.txt?'<span class="sub">'+g.txt+'</span>':''));}
// columna de luz sobre el objetivo (desaparece al llegar o al rato)
function mtBeacon(x,z){if(MTR.beacon){scene.remove(MTR.beacon);MTR.beacon=null;}const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0xffcf6a,transparent:true,opacity:0.32,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
  const c=new THREE.Mesh(new THREE.CylinderGeometry(0.7,1.1,90,16,1,true),m);c.position.y=45;g.add(c);g.position.set(x,floorAt(x,z),z);scene.add(g);MTR.beacon=g;MTR.beaconT=120;}
// ¿perdido? sin progreso unos minutos y caminando de un lado a otro
function mtSig(){const s=state;return[(s.places||[]).length,(s.lessons||[]).length,Object.keys(s.seen||{}).length,s.obols,(s.myths||[]).length,s.day].join('|');}
function mtTick(dt){if(!state)return;if(MTR.beacon){MTR.beaconT-=dt;const b=MTR.beacon,d=Math.hypot(b.position.x-player.x,b.position.z-player.z);b.children[0].material.opacity=0.32*(0.75+0.25*Math.sin(performance.now()/300));if(MTR.beaconT<=0||d<6){scene.remove(b);MTR.beacon=null;}}
  if(ui!=='play'||storyOn())return;const m=mtz();MTR.startT+=dt;
  if(!m.path&&!m.pathAsked&&MTR.startT>25&&!curStepBusy()){m.pathAsked=1;save();mtPathAsk();return;}
  if(m.help==='ninguna')return;if(MTR.cool>0){MTR.cool-=dt;return;}
  const sg=mtSig();if(sg!==MTR.sig){MTR.sig=sg;MTR.lost=0;MTR.walk=0;}else MTR.lost+=dt;
  if(MTR.lx!==null)MTR.walk+=Math.hypot(player.x-MTR.lx,player.z-MTR.lz);MTR.lx=player.x;MTR.lz=player.z;
  const lim=m.help==='mucha'?90:180;if(MTR.lost>lim&&MTR.walk>80&&!MTR.offer){MTR.lost=0;MTR.walk=0;mtOffer();}}
function curStepBusy(){return !!($('dialog')&&!$('dialog').hidden);}
function mtOffer(){const ro=MODE==='roma',who=pick(ro?['Una vendedora de higos','Un aguador','Un liberto con su perro','Una matrona que vuelve del mercado']:['Una vendedora de higos','Un aguador','Un viejo con bastón','Una mujer que vuelve de la fuente']);
  const o=document.createElement('div');o.id='mtOffer';o.dataset.keys='1';o.style.cssText='position:fixed;left:50%;bottom:calc(100px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:40;background:rgba(22,16,12,.9);border-left:3px solid #d9874a;padding:10px 14px;color:#f1e8d8;font:15px Alegreya,Georgia,serif;width:min(520px,calc(100% - 32px));border-radius:6px';
  o.innerHTML='<b>'+who+'</b> se te acerca: «Pareces perdido, forastero. ¿Buscas algo?»<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button id="mtYes" style="font:inherit;padding:6px 12px;border-radius:7px;border:1px solid #d9874a;background:#d9874a;color:#1a120c">Sí, ¿qué me recomiendas? <b>(1 o G)</b></button><button id="mtNo" style="font:inherit;padding:6px 12px;border-radius:7px;border:1px solid #d9874a;background:transparent;color:#f1e8d8">No, gracias <b>(2)</b></button></div>';
  document.body.appendChild(o);MTR.offer=o;const close=(yes)=>{if(!MTR.offer)return;MTR.offer.remove();MTR.offer=null;MTR.cool=yes?120:600;if(yes){const g=mtGoal();if(g){mtz().asks[g.key]=Math.max(1,mtz().asks[g.key]||0);mtAsk();}}};
  $('mtYes').onclick=e=>{e.stopPropagation();close(true);};$('mtNo').onclick=e=>{e.stopPropagation();close(false);};setTimeout(()=>{if(MTR.offer===o)close(false);},20000);MTR.offerClose=close;}
// tres caminos para empezar
function mtPathAsk(){const w=mtWho();vmS('?',w.n,w.t,'<p>«'+(MODE==='roma'?'Roma es enorme':'Atenas es grande')+' y no hace falta verlo todo hoy. Dime qué te interesa más y por ahí empezamos; lo demás seguirá aquí.»</p><p class="sub">Puedes llamarme cuando quieras con la <b>G</b> (o el botón «?»). Si me preguntas varias veces por lo mismo, te daré más detalles.</p>',
  [...Object.entries(MT_PATHS).map(([k,P])=>[P.n,()=>{mtz().path=k;save();closeDialog();mtSay('Bien elegido. Cuando quieras una pista sobre '+P.n.toLowerCase()+', pulsa <b>G</b>.');},'quiz']),['Ya veré yo solo',()=>{mtz().path='libre';save();closeDialog();mtSay('Como quieras. Si te pierdes, pulsa <b>G</b>.');}]]);}
// el maestro te lo explica de otra manera si fallas dos veces
const answerMt=answer;answer=function(ok){const n=dlg&&dlg.n;answerMt(ok);try{if(!ok&&n&&LESSONS[n.id]){const m=mtz();m.fails[n.id]=(m.fails[n.id]||0)+1;save();if(m.fails[n.id]>=2){const s=LESSONS[n.id].summary||'';const B=$('dBody');if(B)B.innerHTML+='<div class="curio"><span class="label">Te lo explico de otra manera</span><p>'+s.split('. ').slice(0,2).join('. ')+'.</p><p class="sub">No pasa nada por equivocarse: vuelve a escuchar y prueba otra vez.</p></div>';}}}catch(e){}};
// el tablón de encargos en el ágora o en el Foro
function mtBoardSetup(){let p=null;if(MODE==='roma'){p=artAnchor('ro_rostra',-14,10);}else if(typeof AG!=='undefined')p=findFree(AG.x+24,AG.z+20,1);if(!p)return;const[x,z]=p,g=grp(x,floorAt(x,z),z,0),wd=lam('#7a5a3a');box(0.2,2.4,0.2,wd,-1.3,1.2,0,g);box(0.2,2.4,0.2,wd,1.3,1.2,0,g);box(2.9,1.6,0.12,lam('#e8dcc0'),0,1.8,0,g);box(3.1,0.15,0.3,wd,0,2.65,0,g);addCirc(x,z,1.5);egxObj(x,z,undefined,'mt:board',MODE==='roma'?'Album de anuncios':'Tablón de anuncios','encargos para hacer',3);}
function mtAct(o){const ro=MODE==='roma',L=[];
  try{const st=curStep();if(st){const at=st.at&&st.at();L.push({d:'Fácil',t:st.title,s:st.short,x:at?at.x:null,z:at?at.z:null});}}catch(e){}
  const near=[...npcObjs].filter(n=>!n.hidden&&!npcDone(n.data)).sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z));
  if(near[0])L.push({d:'Fácil',t:near[0].data.lesson||near[0].data.name,s:near[0].data.where||'',x:near[0].x,z:near[0].z});
  const sg=PLACES.filter(p=>!(state.places||[]).includes(p.id)&&Math.hypot(p.x-player.x,p.z-player.z)<900).sort(()=>Math.random()-0.5)[0];if(sg)L.push({d:'Media',t:'Lee la estela «'+sg.name+'»',s:'a unos '+Math.round(Math.hypot(sg.x-player.x,sg.z-player.z)/10)*10+' pasos',x:sg.x,z:sg.z});
  const far=near.find(n=>Math.hypot(n.x-player.x,n.z-player.z)>500);if(far)L.push({d:'Difícil',t:far.data.lesson||far.data.name,s:(far.data.where||'')+' (lejos de aquí)',x:far.x,z:far.z});
  vmS('▤',ro?'Album de anuncios':'Tablón de anuncios','encargos para hacer','<p>'+(ro?'En las paredes blanqueadas del Foro se pintan los anuncios: el album. Aquí alguien ha apuntado cosas que podrías hacer.':'En el ágora se ponen tablas blanqueadas con los anuncios de la ciudad. Alguien ha añadido una lista de cosas que podrías hacer.')+' Elige una y te la señalo.</p>',
   [...L.slice(0,4).map(e=>['<b>'+e.d+'</b> · '+e.t+(e.s?' <span class="sub">('+e.s+')</span>':''),()=>{closeDialog();if(e.x!==null){mtBeacon(e.x,e.z);toast('Mira la columna de luz dorada: tu encargo está allí.');}},'quiz']),vmBye]);}
// nivel de ayuda en el menú
function mtLabel(){return 'Ayuda: '+(state?{mucha:'mucha',poca:'poca',ninguna:'solo si la pido'}[mtz().help]:'poca');}
function mtCycle(){const m=mtz();m.help={mucha:'poca',poca:'ninguna',ninguna:'mucha'}[m.help]||'poca';save();toast('<span class="label">'+mtLabel()+'</span><br>'+{mucha:'Te ofrecerán ayuda en cuanto parezcas perdido, y el pedagogo te dará pistas con la G.',poca:'Solo te ofrecerán ayuda si llevas un buen rato perdido. La G sigue disponible.',ninguna:'Nadie te ofrecerá ayuda: solo la tendrás si pulsas la G.'}[m.help]);}
GM_IC.mt='<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.7"/><circle cx="12" cy="17" r=".6"/>';
// teclas y botón táctil
window.addEventListener('keydown',e=>{if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;if(e.code==='KeyG'&&!e.repeat&&state&&!storyOn()){if(MTR.offer&&MTR.offerClose){MTR.offerClose(true);return;}if(ui==='play')mtAsk();}});
function mtSetup(){mtBoardSetup();if(!$('mtBtn')){const b=document.createElement('button');b.id='mtBtn';b.textContent='?';b.title='Pedir una pista (G)';b.style.cssText='position:fixed;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(214px + env(safe-area-inset-bottom,0px));width:46px;height:46px;border-radius:50%;border:1px solid #d9874a;background:rgba(22,16,12,.7);color:#f1e8d8;font:700 22px Alegreya,Georgia,serif;z-index:31;display:none';b.onclick=e=>{e.stopPropagation();mtAsk();};document.body.appendChild(b);}}
function mtBtnTick(){const b=$('mtBtn');if(b)b.style.display=document.body.classList.contains('tm')&&ui==='play'&&state&&!storyOn()?'':'none';}

// ============================================================ TREPAR: las laderas empinadas se suben despacio, apoyando las manos, en vez de chocar con ellas
// Cuanto más empinada, más lento (hasta un 20 %); caen piedrecitas y polvo; en tercera persona el cuerpo se inclina; las bajadas muy empinadas se bajan resbalando.
// Trepar entrena: cada 30 m de desnivel, +1 Areté o Virtus (hasta 3 al día). Con el caballo no se puede: hay que bajarse.
const CLB={t:0,k:0,dust:0,lf:null,up:0,horseMsg:0};
function clbz(){if(!state.clb||typeof state.clb!=='object')state.clb={d:0,n:0,seen:0};return state.clb;}
function clbSlow(px,pz,k,lim){if(MOUNT.riding){if(performance.now()-CLB.horseMsg>15000){CLB.horseMsg=performance.now();toast('El caballo no puede subir por una ladera tan empinada. Bájate (<b>H</b>) y trepa tú.');}return null;}
  const f=clamp(lim/k,0.2,1)*0.8;CLB.t=0.35;CLB.k=k;const c=clbz();if(!c.seen){c.seen=1;save();toast('<span class="label">Trepas</span><br>En las laderas muy empinadas subes despacio, buscando dónde apoyar los pies y las manos, como los pastores y los cazadores de cabras monteses. Los griegos decían que las montañas eran de Pan y de Ártemis cazadora. Trepar te entrena: sube tu '+(MODE==='roma'?'Virtus':'Areté')+'.');}
  return[player.x+(px-player.x)*f,player.z+(pz-player.z)*f];}
function clbTick(dt){if(!state||ui!=='play')return;const w=AVATAR.walk;CLB.t-=dt;const on=CLB.t>0;
  if(w&&w.visible)w.rotation.x=on?-Math.min(0.35,0.12*CLB.k):(w.rotation.x*0.8);
  if(on){CLB.dust-=dt;if(CLB.dust<=0){CLB.dust=0.18;const a=player.yaw;pfx(player.x+Math.sin(a)*0.4,player.feet+0.15,player.z+Math.cos(a)*0.4,{col:'#b9a588',vx:(Math.random()-0.5)*0.6,vy:0.4,vz:(Math.random()-0.5)*0.6,g:3,life:0.9,s:0.28,grow:0.7,a:0.45});pfx(player.x,player.feet+0.2,player.z,{col:'#6e6252',vx:Math.sin(a)*1.5,vy:1.2,vz:Math.cos(a)*1.5,g:12,life:0.7,s:0.09,a:0.9});}
    if(CLB.lf!==null&&player.feet>CLB.lf){CLB.up+=player.feet-CLB.lf;if(CLB.up>=30){CLB.up=0;const c=clbz(),d=state.day||1;if(c.d!==d){c.d=d;c.n=0;}if(c.n<3){c.n++;save();qAdd('ar',1,'Trepar entrena.');}}}}
  CLB.lf=player.feet;
  // bajar resbalando por las pendientes muy fuertes
  if(player.grounded&&!FLY.on&&!MOUNT.riding&&!BOAT.on&&Math.abs(floorAt(player.x,player.z)-terrainH(player.x,player.z))<0.05&&Math.hypot(GF.vx||0,GF.vz||0)>0.5){const x=player.x,z=player.z,gx=(terrainH(x+1,z)-terrainH(x-1,z))/2,gz=(terrainH(x,z+1)-terrainH(x,z-1))/2,g=Math.hypot(gx,gz);
    if(g>1.4&&((GF.vx||0)*gx+(GF.vz||0)*gz)<0){const s=Math.min(3,g)*0.9*dt;tryMove(x-gx/g*s,z-gz/g*s);CLB.dust-=dt;if(CLB.dust<=0){CLB.dust=0.15;pfx(x,player.feet+0.1,z,{col:'#b9a588',vx:-gx/g*1.2,vy:0.5,vz:-gz/g*1.2,g:3,life:0.8,s:0.3,grow:0.8,a:0.45});}}}}


// cuadros flotantes con botones (data-keys): se responden con las teclas 1, 2, 3… aunque el ratón esté capturado por la cámara
addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;const n=+e.key;if(!(n>=1&&n<=9))return;
  const box=[...document.querySelectorAll('[data-keys]')].find(b=>b.isConnected&&!b.hidden&&b.offsetParent!==null);if(!box)return;
  const bs=[...box.querySelectorAll('button')].filter(b=>!b.disabled&&b.offsetParent!==null);const b=bs[n-1];if(!b)return;e.preventDefault();e.stopImmediatePropagation();b.click();},true);
