// ============================================================ PARA QUÉ SIRVEN LOS OBJETOS: antorchas que se gastan, ladrones nocturnos, limosna, guías, vino en el odre,
// la buena impresión del que va limpio, el periplo con rutas y peligros, la ofrenda del camino que protege, y las alas visibles en la espalda.
function uxz(){const h=hbz();if(h.antor===undefined)h.antor=3;if(h.burn===undefined)h.burn=3;if(!h.odreC)h.odreC='agua';if(h.notas===undefined)h.notas='';return h;}
const UX={robAcc:0,wings:null};
function uxCoin(n){return MODE==='roma'?(n===1?'sestercio':'sestercios'):(n===1?'óbolo':'óbolos');}
function uxProt(){const d=state.day||1,s=spz();let c=false;try{c=cultz().d===d;}catch(e){}return uxz().prot===d||s.ad===d||s.comp===d||c;}
// ---- 1. la antorcha se gasta: cada una dura unas tres horas de juego
const toggleTorchUx=toggleTorch;toggleTorch=function(){const h=uxz();if(state&&typeof TORCH!=='undefined'&&!TORCH.on&&h.burn<=0&&h.antor<=0){toast('<span class="label">No te quedan antorchas</span><br>Compra más con la bolsa (casilla 3): dos por '+(MODE==='roma'?'un sestercio':'un óbolo')+'. Son palos con trapos o estopa empapados en pez.');return;}if(state&&!TORCH.on&&h.burn<=0&&h.antor>0){h.antor--;h.burn=3;save();}return toggleTorchUx();};
function uxTorchTick(dt){if(typeof TORCH==='undefined'||!TORCH.on)return;const h=uxz();h.burn-=dt*clock.speed;if(h.burn>0)return;
  if(h.antor>0){h.antor--;h.burn=3;save();toast('La antorcha se consume y enciendes otra. Te quedan '+h.antor+'.');}else{h.burn=0;save();try{toggleTorchUx();}catch(e){TORCH.on=false;}toast('<span class="label">La antorcha se ha consumido</span><br>Compra más con la bolsa (casilla 3).');}}
// ---- ladrones de noche: sin antorcha, por la ciudad y sin haber hecho ninguna ofrenda hoy
function uxThiefTick(dt){if(ui!=='play'||!state)return;const h=uxz(),d=state.day||1,night=clock.h>=21||clock.h<5;
  if(!night||(typeof TORCH!=='undefined'&&TORCH.on)||h.robN===d||(state.obols||0)<3||player.feet>CASA.Y-50||(typeof fzIn==='function'&&fzIn())){UX.robAcc=0;return;}
  UX.robAcc+=dt*clock.speed;if(UX.robAcc<1)return;UX.robAcc=0;if(Math.random()>0.3)return;h.robN=d;
  if(uxProt()){toast('<span class="label">Una sombra se acerca… y se va</span><br>Un ladrón te sigue un rato en la oscuridad, pero acaba por dejarte en paz. '+(MODE==='roma'?'Quizá los Lares a los que has hecho hoy tu ofrenda te protegen.':'Quizá el dios al que has hecho hoy tu ofrenda te protege.'));save();return;}
  const n=Math.min(8,1+Math.floor(state.obols*0.1));state.obols-=n;save();updateStats();
  toast('<span class="label">¡Te han robado!</span><br>En la oscuridad alguien te da un empujón y te quita '+n+' '+uxCoin(n)+'. '+(MODE==='roma'?'Juvenal advierte que en Roma es una locura salir a cenar sin haber hecho testamento, y que de noche los ricos van con antorchas y esclavos (Sátiras III 268-301). Lleva siempre la antorcha.':'En Atenas los llaman lopodýtai, «los que quitan el manto»: en Las aves de Aristófanes, a un personaje le roban el manto de noche, al salir de una fiesta (493-498). Lleva siempre la antorcha.'));}
// ---- 2. la bolsa: dinero, limosna, antorchas, vino para el odre y un guía
hbBolsa=function(){const ro=MODE==='roma',n=state.obols||0,h=uxz(),d=state.day||1,pay=(c,fn)=>{if(state.obols<c){toast('No tienes bastante dinero.');return;}state.obols-=c;save();updateStats();try{sfxCoin();}catch(e){}fn();};
  let info;if(ro){const dn=Math.floor(n/4),s=n%4;info='Llevas <b>'+n+' sestercios</b>'+(dn?': '+dn+' denario'+(dn>1?'s':'')+' de plata'+(s?' y '+s+' sestercio'+(s>1?'s':''):''):'')+'. Un denario vale cuatro sestercios, y un sestercio, cuatro ases de cobre.';}
  else{const dr=Math.floor(n/6),o=n%6;info='Llevas <b>'+n+' óbolos</b>'+(dr?': '+dr+' dracma'+(dr>1?'s':'')+(o?' y '+o+' óbolo'+(o>1?'s':''):''):'')+'. Seis óbolos hacen una dracma; muchos atenienses llevan las monedas pequeñas en la boca.';}
  const B=[];
  if(h.lim!==d)B.push(['Dar limosna a un mendigo (1 '+uxCoin(1)+')',()=>pay(1,()=>{h.lim=d;qAdd('eu',1);save();vmS('✋','Limosna','',ro?'<p>Echas un as en la mano de un mendigo junto a un puente. En Roma los mendigos se ponían en los puentes y en las cuestas, donde la gente va despacio; Juvenal y Marcial los mencionan. Darles algo era un gesto de piedad, aunque los filósofos discutían si la limosna hacía bien.</p><p class="sub">+1 Pietas</p>':'<p>Das un óbolo a un mendigo a la puerta de un templo. Homero ya decía que los mendigos y los forasteros vienen de parte de Zeus (Odisea VI 207-208), y por eso no está bien despreciarlos.</p><p class="sub">+1 Eusébeia</p>',[vmBye]);}),'quiz']);
  B.push(['Comprar dos antorchas (1 '+uxCoin(1)+') · tienes '+h.antor,()=>pay(1,()=>{h.antor+=2;save();closeDialog();toast('Compras dos antorchas de pez. Ahora tienes '+h.antor+'.');hbRender(true);}),'quiz']);
  if(hbz().got.odre)B.push([ro?'Llenar el odre de posca (1 sestercio)':'Llenar el odre de vino aguado (1 óbolo)',()=>pay(1,()=>{h.odre=3;h.odreC=ro?'posca':'vino';save();closeDialog();toast(ro?'Llenas el odre de posca: agua con un chorro de vinagre. Es lo que beben los soldados y los pobres: quita la sed mejor que el agua sola y da algo de calor.':'Llenas el odre de vino mezclado con agua, como lo beben los griegos: tres partes de agua por una de vino. Solo los bárbaros lo beben puro.');hbRender(true);}),'quiz']);
  const t=nextTarget();if(t)B.push(['Pagar a un guía para que te lleve a tu próximo encargo (2 '+uxCoin(2)+')',()=>pay(2,()=>{closeDialog();const p=findFree(t.x+3,t.z+3,1)||[t.x+3,t.z+3];fzPut(p[0],p[1],Math.atan2(-(t.x-p[0]),-(t.z-p[1])));addHours(0.5);toast('<span class="label">Un guía</span><br>Un muchacho espabilado te lleva por atajos hasta '+(t.data&&t.data.name?t.data.name:'tu destino')+'. En las ciudades antiguas no hay nombres en las calles ni números en las casas: las direcciones se dan por templos, fuentes y tiendas.');}),'quiz']);
  B.push(vmBye);vmS(ro?'◉':'◉',ro?'Tu bolsa':'Tu bolsa','',' <p>'+info+'</p><p class="sub">'+(ro?'Un legionario cobra unos tres sestercios al día; una hogaza de pan cuesta un as.':'Un jornal es de una dracma; asistir a la Asamblea se paga con tres óbolos.')+'</p>',B);};
// ---- 4. el odre: agua, vino aguado o posca; imprescindible en los caminos largos
const hbOdreUx=hbOdre;hbOdre=function(){const h=uxz(),n0=h.odre,full0=h.odre<3&&hbNearWater();hbOdreUx();if(full0&&h.odre===3)h.odreC='agua';
  if(h.odre<n0&&h.odreC!=='agua'){WXS.warm=wxNow()+2;save();toast(h.odreC==='posca'?'La posca te entona: durante un par de horas el frío y la nieve no te frenan.':'El vino aguado te calienta el cuerpo: durante un par de horas el frío y la nieve no te frenan.');}};
const wxSpeedUx=wxSpeed;wxSpeed=function(){let f=wxSpeedUx();if(WXS.warm&&wxNow()<WXS.warm&&wxK()==='nieve')f/=0.86;return f;};
function uxRoad(days){if(days<2||!state)return;const h=uxz();setTimeout(()=>{if(h.odre>0){h.odre--;save();hbRender(true);toast('Por el camino bebes de tu odre. Quedan '+h.odre+' tragos.');}
  else if(uxProt()){toast('Haces el camino sin agua, pero encuentras fuentes a tiempo. Ha habido suerte.');}
  else{WXS.heatE=3;WXS.heatMsg=true;toast('<span class="label">Llegas sediento</span><br>Has hecho el camino sin agua y llegas agotado: caminarás más despacio hasta que bebas. Lleva siempre el odre lleno en los viajes por tierra.');}},3600);}
const sailUx=sail;sail=function(from,to,land){const r=sailUx(from,to,land);if(land){let dd=3;try{const I=ISLANDS.find(q=>q.id===to);dd=I&&I.ldays&&/semana/.test(I.ldays)?10:3;}catch(e){}uxRoad(dd);}return r;};
const gateTravelUx=gateTravel;gateTravel=function(g){gateTravelUx(g);try{uxRoad(Math.max(1,Math.round(g.br.km/30)));}catch(e){}};
// ---- 5. el estrígilo: quien va limpio y con aceite causa buena impresión
const answerUx=answer;answer=function(ok){const n0=(state.lessons||[]).length;answerUx(ok);try{if(ok&&state.lessons.length>n0){const h=uxz(),d=state.day||1,clean=h.str!==undefined&&h.str>=0&&d-h.str<=1;
  if(clean){state.obols+=1;save();updateStats();setTimeout(()=>toast('Limpio y oliendo a aceite, causas buena impresión: el maestro te da un '+uxCoin(1)+' más.'),1400);}
  else if(hbz().got.strigil&&(h.str<0||d-h.str>=4))setTimeout(()=>toast('El maestro arruga la nariz: hueles a sudor y a polvo del camino. Pasa por '+(MODE==='roma'?'las termas':'la palestra')+' con tu estrígilo.'),1400);}}catch(e){}};
// ---- 2. la tablilla: tus notas y el álbum de inscripciones copiadas
const hbTablillaUx=hbTablilla;hbTablilla=function(){hbTablillaUx();try{const h=uxz(),B=$('dBody'),ids=(state.places||[]);const P=ids.map(id=>PLACES.find(p=>p.id===id)).filter(Boolean);
  const box=document.createElement('div');box.innerHTML='<p><span class="label">Tus notas</span></p><textarea id="uxNotas" rows="4" style="width:100%;box-sizing:border-box;font:15px Alegreya,Georgia,serif;background:#1d1610;color:#f1e8d8;border:1px solid #6a4a30;border-radius:6px;padding:6px" placeholder="Escribe aquí lo que quieras recordar…"></textarea>'+
    '<details><summary><b>Inscripciones copiadas · '+P.length+'</b></summary>'+(P.length?P.map(p=>'<p><span style="letter-spacing:.12em;font-variant:small-caps">'+(p.greek||'')+'</span> · '+p.name+'</p>').join(''):'<p class="sub">Lee las estelas y los rótulos de los monumentos: copiarás aquí su inscripción.</p>')+'</details>';
  B.insertBefore(box,B.children[1]||null);const ta=$('uxNotas');ta.value=h.notas||'';ta.addEventListener('keydown',e=>e.stopPropagation());ta.addEventListener('input',()=>{h.notas=ta.value.slice(0,3000);save();});}catch(e){}};
// ---- 8. el periplo o el itinerario: rutas, días, precios y peligros; con él regateas el pasaje
function hbRollo(){const ro=MODE==='roma',mo=calNow().mo,inv=mo>=10||mo<=1;let rows='';try{for(const I of ISLANDS){if(!I.days)continue;rows+='<tr><td><b>'+I.name+'</b></td><td class="sub">'+I.days+'</td><td>'+(I.fare?Math.round(I.fare*0.9*(inv&&bySea(I)?1.5:1))+' '+uxCoin(2):'')+'</td></tr>';}}catch(e){}
  vmS('⛵',ro?'Tu itinerario':'Tu periplo',ro?'rutas, millas y peligros':'puertos, jornadas y peligros','<p>'+(ro?'Un rollo con los puertos y las calzadas, con las distancias en millas: como los itinerarios que usaban los viajeros romanos, listas de paradas más que mapas.':'Un rollo con los puertos y las jornadas de navegación, costa a costa: los griegos lo llamaban periplo, «navegación alrededor».')+' Con él sabes qué capitanes son de fiar y regateas mejor: <b>los pasajes te cuestan un 10 % menos</b>.</p>'+
   '<div style="max-height:38vh;overflow:auto"><table style="width:100%;border-collapse:collapse;font-size:14px">'+rows+'</table></div>'+
   '<div class="curio"><span class="label">Peligros</span><p>'+(inv?'<b>Es invierno: el mar está cerrado</b> y los pocos que navegan cobran más. ':'')+(ro?'Desde que Pompeyo limpió el mar de piratas (67 a.C.), se navega seguro; el peligro son las tormentas. ':'Hay piratas en el Egeo, y el cabo Malea, al sur del Peloponeso, es temido: «Si doblas el Malea, olvídate de tu casa», decían los marinos (Estrabón VIII 6, 20). ')+'Con tormenta, ningún barco zarpa.</p></div>',[['Abrir el plano',()=>{closeDialog();openMap();},'quiz'],vmBye]);};
HB_ITEMS.find(i=>i.k==='rollo').use=()=>hbRollo();
const fareOfUx=fareOf;fareOf=function(from,to,land){const f=fareOfUx(from,to,land);return(!land&&state&&hbz().got.rollo)?Math.max(1,Math.round(f*0.9)):f;};
// ---- 9. el amuleto: la ofrenda en el altar del camino protege hoy de ladrones y de los caminos sin agua
const spMenuUx=spMenu;spMenu=function(){spMenuUx();try{const h=uxz(),d=state.day||1;if(h.prot===d)return;const O=$('dOpts'),b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">✶</span><span>'+(MODE==='roma'?'Dejar una ofrenda en el altar de la esquina (te protege hoy)':'Dejar una ofrenda en una herma del camino (te protege hoy)')+'</span>';
  b.onclick=()=>{h.prot=d;qAdd('eu',1);save();vmS(MODE==='roma'?'Λ':'Ἑ',MODE==='roma'?'Los Lares Viales':'La herma del camino','una ofrenda para el viaje',MODE==='roma'?'<p>Dejas unas flores y un poco de incienso en el altar de los Lares de la esquina. Los romanos también honraban a los Lares Viales, protectores de los caminos, antes de salir de viaje.</p><p class="sub">Hoy los ladrones y los caminos sin agua te darán menos problemas. +1 Pietas</p>':'<p>Dejas un pastel de miel al pie de una herma, un pilar con la cabeza de Hermes que hay en los cruces y a las puertas de las casas. Hermes guía a los viajeros, y los caminantes le echan una piedra al pasar: así crecen los montones de piedras de los caminos.</p><p class="sub">Hoy los ladrones y los caminos sin agua te darán menos problemas. +1 Eusébeia</p>',[vmBye]);};O.insertBefore(b,O.firstChild);}catch(e){}};
// ---- contador de antorchas en la casilla 1 y del odre en la 4
const hbRenderUx=hbRender;hbRender=function(force){hbRenderUx(force);try{const b=$('hbar');if(!b)return;const h=uxz(),s0=b.children[0];if(s0&&!s0.querySelector('.c')){const c=document.createElement('span');c.className='c';s0.appendChild(c);}if(s0)s0.querySelector('.c').textContent=h.antor+(typeof TORCH!=='undefined'&&TORCH.on?'·':'');
  const s3=b.children[3];if(s3&&hbz().got.odre){s3.title='Odre: '+h.odre+' tragos de '+(h.odreC==='agua'?'agua':h.odreC==='posca'?'posca':'vino aguado');}}catch(e){}};
// ---- 7. las alas, visibles en la espalda en tercera persona
function uxWingMesh(){const g=new THREE.Group(),feather=new THREE.MeshLambertMaterial({color:'#efe6d2',side:THREE.DoubleSide}),tip=new THREE.MeshLambertMaterial({color:'#b89a6a',side:THREE.DoubleSide}),wax=new THREE.MeshLambertMaterial({color:'#e2c98a'});
  for(const s of[-1,1]){const w=new THREE.Group();w.position.set(s*0.1,1.58,-0.24);g.add(w);const bar=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.07,0.05),wax);bar.position.set(s*0.55,0.06,0);w.add(bar);
    for(let i=0;i<8;i++){const L=0.78-i*0.06,f=new THREE.Mesh(new THREE.PlaneGeometry(0.16,L),i>5?tip:feather);f.position.set(s*(0.08+i*0.14),0.06-L/2+0.02,-0.01*i);f.rotation.z=s*(0.15+i*0.06);w.add(f);}
    for(let i=0;i<6;i++){const f=new THREE.Mesh(new THREE.PlaneGeometry(0.12,0.4),feather);f.position.set(s*(0.1+i*0.16),-0.1,0.02);f.rotation.z=s*0.2;w.add(f);}
    w.userData.s=s;}
  g.visible=false;return g;}
function uxWingsTick(dt){const w=AVATAR.walk;if(!w)return;if(!w.userData.uxW){w.userData.uxW=uxWingMesh();w.add(w.userData.uxW);}const W=w.userData.uxW,on=typeof FLY!=='undefined'&&FLY.on;W.visible=on;if(!on)return;
  const t=performance.now()/1000,fl=player.vy>0.5||keys.up?1.6:0.7;for(const c of W.children){const s=c.userData.s;c.rotation.z=s*(0.42+0.3*Math.sin(t*6*fl));c.rotation.y=s*0.3;}}
function uxTick(dt){if(!state)return;try{uxTorchTick(dt);uxThiefTick(dt);uxWingsTick(dt);}catch(e){}}

// ============================================================ TEJADOS Y CORNISAS: posarse sobre los edificios
// El suelo del juego es el terreno más algunas plataformas planas, y las paredes son segmentos en 2D: por eso no se podía aterrizar en un tejado.
// Aquí, cuando estás por encima del suelo, se mira con un rayo qué hay justo debajo de tus pies (tejados de tejas, a dos aguas, planos, cúpulas, cornisas,
// los tejados de las casas de los modelos 3D…) y, al moverte en el aire o por los tejados, otro rayo hacia delante impide atravesar las paredes.
const RF={ok:false,grid:new Map(),C:16,ray:new THREE.Raycaster(),tmp:null,down:new THREE.Vector3(0,-1,0),o:new THREE.Vector3(),hv:new THREE.Vector3()};
function rfKey(i,j){return i+','+j;}
function rfAdd(e,b){const C=RF.C;for(let i=Math.floor(b.min.x/C);i<=Math.floor(b.max.x/C);i++)for(let j=Math.floor(b.min.z/C);j<=Math.floor(b.max.z/C);j++){const k=rfKey(i,j);let a=RF.grid.get(k);if(!a){a=[];RF.grid.set(k,a);}a.push(e);}}
function rfSkip(o){for(let p=o;p;p=p.parent){if(p===scene)return false;if(p.userData&&(p.userData.arms||p.userData.noRoof))return true;if(typeof AVATAR!=='undefined'&&(p===AVATAR.walk||p===AVATAR.rider))return true;if(typeof MOUNT!=='undefined'&&p===MOUNT.g)return true;}return false;}
// mallas enormes (toda la ciudad fusionada en una): se indexan sus triángulos por celdas, para poder posarse en sus tejados
RF.big=[];
function rfBig(o){const g=o.geometry,P=g.attributes.position,ix=g.index,n=ix?ix.count/3:P.count/3,W=new Float32Array(P.count*3),v=new THREE.Vector3(),C=RF.C;
  for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(o.matrixWorld);W[i*3]=v.x;W[i*3+1]=v.y;W[i*3+2]=v.z;}
  const B={o,W,ix:ix?ix.array:null,grid:new Map()};let c=0;
  for(let t=0;t<n;t++){const a=ix?ix.array[t*3]:t*3,b=ix?ix.array[t*3+1]:t*3+1,d=ix?ix.array[t*3+2]:t*3+2;
    const y0=Math.min(W[a*3+1],W[b*3+1],W[d*3+1]),y1=Math.max(W[a*3+1],W[b*3+1],W[d*3+1]);if(y1<1.2)continue;   // lo que está a ras de suelo no hace falta
    const x0=Math.min(W[a*3],W[b*3],W[d*3]),x1=Math.max(W[a*3],W[b*3],W[d*3]),z0=Math.min(W[a*3+2],W[b*3+2],W[d*3+2]),z1=Math.max(W[a*3+2],W[b*3+2],W[d*3+2]);
    if(x1-x0>200||z1-z0>200)continue;
    for(let i=Math.floor(x0/C);i<=Math.floor(x1/C);i++)for(let j=Math.floor(z0/C);j<=Math.floor(z1/C);j++){const k=rfKey(i,j);let L=B.grid.get(k);if(!L){L=[];B.grid.set(k,L);}L.push(t);}c++;}
  RF.big.push(B);return c;}
const _rfA=new THREE.Vector3(),_rfB=new THREE.Vector3(),_rfC=new THREE.Vector3(),_rfP=new THREE.Vector3();
function rfBigHits(keys,res){const r=RF.ray;for(const B of RF.big){if(!B.o.visible)continue;const seen=new Set();for(const k of keys){const L=B.grid.get(k);if(!L)continue;for(const t of L){if(seen.has(t))continue;seen.add(t);
  const a=B.ix?B.ix[t*3]:t*3,b=B.ix?B.ix[t*3+1]:t*3+1,d=B.ix?B.ix[t*3+2]:t*3+2,W=B.W;_rfA.set(W[a*3],W[a*3+1],W[a*3+2]);_rfB.set(W[b*3],W[b*3+1],W[b*3+2]);_rfC.set(W[d*3],W[d*3+1],W[d*3+2]);
  if(r.ray.intersectTriangle(_rfA,_rfB,_rfC,false,_rfP)){const dd=r.ray.origin.distanceTo(_rfP);if(dd<=r.far)res.push({distance:dd,object:B.o});}}}}}
function rfKeyAt(x,z){return rfKey(Math.floor(x/RF.C),Math.floor(z/RF.C));}
function rfSetup(){RF.grid.clear();RF.big.length=0;scene.updateMatrixWorld(true);const bb=new THREE.Box3(),m4=new THREE.Matrix4();let n=0;
  scene.traverse(o=>{if(!o.isMesh||!o.geometry||!o.geometry.attributes||!o.geometry.attributes.position)return;const mt=Array.isArray(o.material)?o.material[0]:o.material;if(!mt||mt.transparent||mt.isMeshBasicMaterial||mt.isShaderMaterial)return;if(rfSkip(o))return;
    const g=o.geometry;if(!g.boundingBox)g.computeBoundingBox();
    if(o.isInstancedMesh){if(o.count>60000||o.userData.veg)return;for(let i=0;i<o.count;i++){o.getMatrixAt(i,m4);m4.premultiply(o.matrixWorld);bb.copy(g.boundingBox).applyMatrix4(m4);if(bb.max.x-bb.min.x>300||bb.max.z-bb.min.z>300)continue;rfAdd({o,i},bb);n++;}return;}
    bb.copy(g.boundingBox).applyMatrix4(o.matrixWorld);if(bb.max.x-bb.min.x>300||bb.max.z-bb.min.z>300){if(!o.isInstancedMesh&&!(typeof TERR_MATS!=='undefined'&&TERR_MATS.includes(mt))&&bb.max.y-bb.min.y>3)n+=rfBig(o);return;}if(bb.max.y-bb.min.y<0.05&&bb.max.x-bb.min.x<0.5)return;rfAdd({o,i:-1},bb);n++;});
  RF.tmp=new THREE.Mesh();RF.ok=true;return n;}
function rfCands(x,z){return RF.grid.get(rfKey(Math.floor(x/RF.C),Math.floor(z/RF.C)))||[];}
function rfHit(e,res){const r=RF.ray;if(e.i<0){if(!e.o.visible)return;e.o.raycast(r,res);return;}const t=RF.tmp;t.geometry=e.o.geometry;t.material=e.o.material;e.o.getMatrixAt(e.i,t.matrixWorld);t.matrixWorld.premultiply(e.o.matrixWorld);const L=res.length;t.raycast(r,res);for(let k=L;k<res.length;k++)res[k].object=e.o;}
// la superficie más alta bajo el punto (x, y, z), si la hay
function rfSurf(x,z,y){if(!RF.ok)return null;const c=rfCands(x,z);if(!c.length&&!RF.big.length)return null;RF.ray.set(RF.o.set(x,y,z),RF.down);RF.ray.far=60;const res=[];for(const e of c)rfHit(e,res);rfBigHits([rfKeyAt(x,z)],res);let best=null;for(const h of res){if(!best||h.distance<best.distance)best=h;}return best?y-best.distance:null;}
// ¿hay una pared entre la posición actual y la nueva, a la altura del cuerpo?
function rfWall(nx,nz){if(!RF.ok)return false;const dx=nx-player.x,dz=nz-player.z,d=Math.hypot(dx,dz);if(d<1e-5)return false;RF.hv.set(dx/d,0,dz/d);const res=[];
  for(const yo of[0.5,1.4]){RF.ray.set(RF.o.set(player.x,player.feet+yo,player.z),RF.hv);RF.ray.far=d+0.45;const cs=new Set([...rfCands(player.x,player.z),...rfCands(nx,nz)]);for(const e of cs)rfHit(e,res);rfBigHits([...new Set([rfKeyAt(player.x,player.z),rfKeyAt(nx,nz)])],res);if(res.length)return true;}return false;}
// el suelo bajo los pies: el de siempre, o un tejado si estás por encima de él
function rfFloor(x,z,y){const fl=floorAt(x,z);if(!RF.ok||y<fl+0.9)return fl;const s=rfSurf(x,z,y+0.35);return s!==null&&s>fl+0.9?s:fl;}
// moverse por encima del suelo (por un tejado): sin las paredes 2D de abajo, pero con las de verdad
function rfMove(nx,nz){if(rfWall(nx,nz))return false;
  if(nx>=8000){const q={x:nx,z:nz};sqClamp(q);nx=q.x;nz=q.z;}   // destinos: el cuadrado de su escenario
  const s=rfSurf(nx,nz,player.feet+0.65),fl=floorAt(nx,nz),h=s!==null&&s>fl+0.9?s:fl;if(h-player.feet>0.65)return false;player.x=nx;player.z=nz;return true;}

