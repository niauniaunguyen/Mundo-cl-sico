// ============================================================ VIDA EN EL MAR (SW2): periplo, barcos, viento y vela, tormentas, piratas, encuentros míticos, pecios y rumbos conocidos
// Capa sobre SW. Teclas en la barca: Z vela, L periplo (cuaderno), U rumbo conocido. En táctil, botones en #sw2Hud.
const SW2={ships:[],enc:null,storm:null,pir:null,sail:false,amph:[],hudT:0,hudK:'',sailG:null,lastEnc:''};
function sw2z(){const z=swz();z.per=z.per||{};z.vis=z.vis||{};z.ports=z.ports||{};z.wr=z.wr||{};z.amph=z.amph||0;z.done=z.done||{};z.enc=z.enc||{};z.trips=z.trips||0;return z;}
const sw2coin=()=>swD().coin;
function sw2strip(h){return String(h).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
function sw2keys(seg){const S=swD().segs[seg];return S?[...new Set((S.deco||[]).filter(d=>d.info).map(d=>d.info))]:[];}
// ---- el viento del día: de dónde sopla (0 = norte) y con qué fuerza
function sw2wind(){const d=state.day||1,h=Math.abs(Math.sin(d*12.9898)*43758.5453)%1,h2=Math.abs(Math.sin(d*78.233)*12345.678)%1;const b=Math.floor(h*8)*45,st=2+h2*3+(typeof WXS!=='undefined'&&WXS.rain>0.3?3:0);return{b,st};}
function sw2windName(b){const ro=MODE==='roma';const G={0:['Bóreas','del norte'],45:['Cecias','del nordeste'],90:['Euro','del este'],135:['Euro del sur','del sudeste'],180:['Noto','del sur'],225:['Libs','del sudoeste'],270:['Céfiro','del oeste'],315:['Argestes','del noroeste']},R={0:['Aquilón','del norte'],45:['Aquilón del este','del nordeste'],90:['Euro','del este'],135:['Vulturno','del sudeste'],180:['Austro','del sur'],225:['Ábrego','del sudoeste'],270:['Favonio','del oeste'],315:['Coro','del noroeste']};return (ro?R:G)[b];}
// ---- barcos
function sw2Ship(type){const big={pesca:1.1,mercante:2.3,trirreme:1.6,liburna:1.5,pirata:1.5}[type];const g=new THREE.Group(),hull=swBoatMesh();scene.remove(hull);hull.scale.set(big,big*(type==='trirreme'||type==='liburna'||type==='pirata'?0.9:1),big*(type==='trirreme'?3.4:type==='liburna'||type==='pirata'?2.6:type==='mercante'?1.6:1));g.add(hull);
  if(type!=='pesca'){const h=type==='mercante'?9:7;const m=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.15,h,6),lam('#4a3220'));m.position.y=h/2+0.6;g.add(m);const sl=box(type==='mercante'?5:4,type==='mercante'?4:3.2,0.08,lam(type==='pirata'?'#6a2418':type==='trirreme'?'#e8e0cc':'#e2d6bc'),0,h-1.8,0.2,g);}
  else{const n=box(1.6,0.05,1.2,lam('#9a8a6a'),0,0.7,-1.2,g);const p=makePerson({chiton:'#8a7a5a',beard:true,hair:'#3a2e24'});p.position.set(0,0.6,0.4);p.scale.setScalar(0.9);g.add(p);}
  if(type==='trirreme'||type==='liburna'||type==='pirata'){for(const s of[-1,1])for(let i=0;i<10;i++){const o=box(0.05,0.05,2.6,lam('#5a4532'),s*1.5,0.4,-6+i*1.3,g);o.rotation.z=s*0.5;}}
  scene.add(g);return g;}
function sw2ClearShips(){if(typeof sw2OrbClear==='function')sw2OrbClear();for(const S of SW2.ships)scene.remove(S.g);SW2.ships.length=0;if(SW2.pir){scene.remove(SW2.pir.g);SW2.pir=null;}if(SW2.enc){scene.remove(SW2.enc.g);SW2.enc=null;}}
function sw2SpawnShip(seg){const ro=MODE==='roma',types=ro?['pesca','mercante','liburna','pesca','mercante']:['pesca','mercante','trirreme','pesca','mercante'];const type=types[Math.floor(Math.random()*types.length)];
  const cz=swSegZ(seg),side=Math.random()<0.5?-1:1,z0=(Math.random()-0.5)*400,g=sw2Ship(type),sp=type==='pesca'?1.2:type==='mercante'?3:5;
  const x=SW.X+side*(SW.H+60),z=cz+z0,vx=-side*sp,vz=(Math.random()-0.5)*0.8;g.position.set(x,swSeaY()-0.2,z);g.rotation.y=Math.atan2(vx,vz);
  if(type==='pesca'){g.position.x=SW.X+(Math.random()-0.5)*400;}
  SW2.ships.push({g,type,seg,x:g.position.x,z,vx:type==='pesca'?0:vx,vz:type==='pesca'?0:vz,talk:0});}
// ---- encuentros míticos
const SW2_ENC={
 leucotea:{name:'Leucótea',sub:'la diosa blanca del mar',look:{chiton:'#e8eef0',himation:'#9fc8d0',hair:'#3a2a1e'},tail:null,modes:['atenas','roma'],
  txt:'<p>Una gaviota se posa en la borda… y de pronto es una mujer vestida de blanco, con los pies en el agua.</p><p>Es Leucótea. Antes se llamaba Ino y era hija de Cadmo; se arrojó al mar huyendo de su marido enloquecido y los dioses la convirtieron en diosa marina. En la <i>Odisea</i>, cuando la balsa de Ulises se rompe en una tormenta, se le aparece como un ave y le da su velo inmortal para que no se ahogue (Odisea V 333-353).</p>',
  ro:'<p>Los romanos la llaman Mater Matuta y celebran su fiesta en junio (Ovidio, Fastos VI 473-550).</p>'},
 tetis:{name:'Tetis',sub:'la nereida de los pies de plata',look:{chiton:'#c8d8e0',himation:'#6a8aa0',hair:'#2a2420'},tail:null,modes:['atenas'],segs:['egeonorte','saronico','cicladas','icario'],
  txt:'<p>Del agua sube una niebla blanca y, en ella, una mujer de pies brillantes como la plata.</p><p>Es Tetis, la nereida madre de Aquiles. En la <i>Ilíada</i>, cuando Aquiles llora junto al mar, ella sube de las profundidades «como la niebla», se sienta a su lado y lo acaricia (Ilíada I 357-363). Zeus la casó con un mortal, Peleo, porque una profecía decía que su hijo sería más fuerte que su padre.</p>'},
 triton:{name:'Tritón',sub:'el trompetero del mar',look:{chiton:'#4f7f6a',himation:'#3a6a5a',beard:true,hair:'#5a7a6a'},tail:'#3a7a6a',modes:['atenas','roma'],
  txt:'<p>Un ser con barba verde y cola de pez asoma entre las olas y sopla una gran caracola. El mar se calma a su alrededor.</p><p>Es Tritón, hijo de Poseidón y Anfitrite. Ovidio cuenta que, después del diluvio, Neptuno le mandó tocar su caracola para que las aguas se retiraran, y al oírla los ríos y los mares volvieron a su sitio (Metamorfosis I 330-342).</p>'},
 proteo:{name:'Proteo',sub:'el viejo del mar que cambia de forma',look:{chiton:'#6a7a7a',himation:'#4a5a5a',beard:true,hair:'#d8d4c8'},tail:'#4a6a6a',modes:['atenas','roma'],segs:['aegyptium','cretico','africum'],
  txt:'<p>Sobre un banco de arena, entre focas que dormitan, un anciano te mira con desconfianza.</p><p>Es Proteo, el viejo del mar que lo sabe todo pero solo habla si lo atrapan. En la <i>Odisea</i>, Menelao se esconde con sus hombres bajo pieles de foca en la isla de Faros, junto a Egipto, y lo sujeta mientras Proteo se convierte en león, en serpiente, en agua y en árbol, hasta que se rinde y le dice cómo volver a casa (Odisea IV 351-570). Virgilio cuenta algo parecido de Aristeo (Geórgicas IV 387-452).</p><p>De él viene la palabra «proteico»: lo que cambia de forma.</p>'},
 sirenas:{name:'Las sirenas',sub:'un canto que viene de una roca',look:{chiton:'#d8b8a0',himation:'#a87a5a',hair:'#5a3a2a'},tail:null,modes:['atenas','roma'],sirens:1,
  txt:'<p>Desde una roca llega un canto dulcísimo. Dos figuras, con cuerpo de ave y cabeza de mujer, como las pintaban los griegos, te llaman por tu nombre.</p><p>En la <i>Odisea</i>, las sirenas prometen a Ulises contarle todo lo que pasó en Troya y todo lo que ocurre en la tierra; a su alrededor hay un montón de huesos de los que se quedaron a escucharlas (Odisea XII 39-54 y 158-200).</p>'}};
function sw2SeaFig(E){const g=new THREE.Group(),p=makePerson(E.look);g.add(p);if(E.tail){const t=new THREE.Mesh(new THREE.ConeGeometry(0.42,2.6,8),lam(E.tail));t.rotation.x=Math.PI/2;t.position.set(0,0.4,1.3);g.add(t);}
  if(E.sirens){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),lam('#5c564c'));r.scale.set(6,3,5);r.position.y=-1;g.add(r);p.position.set(-1.2,2,0);const p2=makePerson(E.look);p2.position.set(1.4,2,0.4);g.add(p2);for(const q of[p,p2])for(const s of[-1,1]){const w=box(1.4,0.06,0.7,lam('#8a6a4a'),s*0.8,1.3,-0.2,q);w.rotation.z=s*0.5;}}
  else if(E===SW2_ENC.proteo){const b=new THREE.Mesh(new THREE.CylinderGeometry(5,6,1.2,16),lam('#cdb98a'));b.position.y=-0.6;g.add(b);for(let i=0;i<3;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(0.4,8,6),lam('#6a6a66'));s.scale.set(1,0.7,2.4);s.position.set(-3+i*2.5,0.1,2.5);g.add(s);}}
  scene.add(g);return g;}
function sw2RollEnc(seg){if(SW2.enc||Math.random()>0.18)return;const pool=Object.keys(SW2_ENC).filter(k=>{const E=SW2_ENC[k];return E.modes.includes(MODE)&&(!E.segs||E.segs.includes(seg))&&k!==SW2.lastEnc&&!(E.sirens&&MODE==='roma'&&false);});if(!pool.length)return;
  const k=pool[Math.floor(Math.random()*pool.length)],E=SW2_ENC[k];SW2.lastEnc=k;const a=player.yaw,x=player.x-Math.sin(a)*45,z=player.z-Math.cos(a)*45;if(swIsleNear(x,z)&&swIsleNear(x,z).d<15)return;
  const g=sw2SeaFig(E);g.position.set(x,swSeaY()+(E.sirens?1:0.2),z);g.rotation.y=Math.atan2(player.x-x,player.z-z);SW2.enc={k,g,x,z,t:90};setTimeout(()=>{if(SW2.enc&&SW2.enc.k===k)toast('<span class="label">Algo en el mar</span><br>'+(E.sirens?'Se oye un canto dulcísimo que viene de una roca…':'Delante de la barca, algo se mueve entre las olas…'));},700);}
function sw2EncTalk(){const e=SW2.enc;if(!e)return;const E=SW2_ENC[e.k],z=sw2z();z.enc[e.k]=1;save();
  const btn=[];if(E.sirens){if(MODE==='atenas'&&typeof seaIntro==='function')btn.push(['Escuchar… y soñar el sueño de Ulises',()=>{closeDialog();const v=$('voyage');seaIntro(()=>{v.hidden=true;v.classList.remove('show');ui='play';});}]);btn.push(['Taparte los oídos con cera y seguir remando',()=>{closeDialog();toast('Como los compañeros de Ulises, te tapas los oídos con cera. El canto se apaga a tu espalda.');sw2EncGone();}]);}
  else btn.push(['Despedirse',()=>{closeDialog();sw2EncGone();}]);
  vmS('🌊',E.name,E.sub,E.txt+(MODE==='roma'&&E.ro?E.ro:''),btn);}
function sw2EncGone(){if(!SW2.enc)return;const g=SW2.enc.g;SW2.enc=null;let k=0;const iv=setInterval(()=>{g.position.y-=0.15;if(++k>20){clearInterval(iv);scene.remove(g);}},50);}
// ---- pecios con ánforas en cada tramo (se suben buceando y se venden en puerto)
function sw2Wrecks(){const D=swD();for(const id in D.segs){const S=D.segs[id],cz=swSegZ(id);let lx=((S.k*137+60)%480)-240,lz=((S.k*271+130)%480)-240;
    for(let t=0;t<8;t++){let bad=false;for(const I of S.isl){if(Math.hypot((lx-I.x)/I.rx,(lz-I.z)/I.rz)<1.4)bad=true;}if(!bad)break;lx=(lx+170)%480-240;lz=(lz+110)%480-240;}
    const x=SW.X+lx,z=cz+lz,wood=lam('#3e3022'),g=grp(x,SW.BED+0.5,z,S.k);box(4,1,13,wood,0,0,0,g);box(0.4,1.6,10,wood,1.9,0.6,0,g);
    for(let i=0;i<3;i++){const key=id+':'+i,m=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.12,1.2,8),lam('#b0643c'));m.position.set(x+(i-1)*2.2,SW.BED+1.3,z+2);m.rotation.z=1.3;scene.add(m);SW2.amph.push({key,seg:id,x:m.position.x,z:m.position.z,m});}}
  sw2AmphVis();}
function sw2AmphVis(){const z=sw2z();for(const A of SW2.amph)A.m.visible=!z.wr[A.key];}
// ---- tareas, ánforas y registro al desembarcar
function sw2Ports(){const out=[];const D=swD();for(const s in D.segs)for(const I of D.segs[s].isl)if(I.id&&(swMoorOf(I.id)||I.port))out.push([I.id,I.name]);return out;}
function sw2Lost(why){const z=sw2z();const lost=[];if(z.amph){lost.push(z.amph+' ánfora'+(z.amph>1?'s':''));z.amph=0;}if(z.task){lost.push('el encargo para '+z.task.name);z.task=null;}save();return lost.length?' Pierdes '+lost.join(' y ')+'.':'';}
// ---- periplo
function swPeriplo(){const D=swD(),z=sw2z();let tot=0,read=0,html='<p>Como los marinos antiguos, que llevaban periplos (guías escritas de costas y puertos), anotas lo que aprendes en cada mar. Lo leído pasa también al códice (C).</p>';
  for(const id in D.segs){const S=D.segs[id],ks=sw2keys(id),r=ks.filter(k=>z.per[k]).length;tot+=ks.length;read+=r;
    html+='<p><b>'+(z.vis[id]?S.name:'Un mar sin explorar')+'</b>'+(z.vis[id]?' · '+r+' de '+ks.length+' historias'+(z.done[id]?' ✓':''):'')+(z.vis[id]&&r?'<br><span style="opacity:.8">'+ks.filter(k=>z.per[k]).map(k=>D.info[k][0]).join(' · ')+'</span>':'')+'</p>';}
  if(z.af===1){const D2=SW_AF[MODE];html='<p><b>Los regalos de '+D2.name+':</b> '+Object.keys(SW_AFT).map(k=>SW_AFT[k][0]+(z.afit&&z.afit[k]?' ✓':' ('+D.segs[D2.items[k][0]].name+')')).join(' · ')+'</p>'+html;}
  html='<p><b>'+read+' de '+tot+'</b> historias del mar · <b>'+Object.keys(z.vis).length+' de '+Object.keys(D.segs).length+'</b> mares recorridos'+(z.task?' · Encargo: '+z.task.what+' para '+z.task.name:'')+(z.amph?' · Ánforas a bordo: '+z.amph:'')+'</p>'+html;
  vmS('📜','Periplo','tu cuaderno de navegación',html,[vmBye]);}
function sw2Read(key){const D=swD(),z=sw2z();if(z.per[key])return;z.per[key]=1;save();
  for(const id in D.segs){const ks=sw2keys(id);if(!ks.includes(key)||z.done[id]||!ks.every(k=>z.per[k]))continue;z.done[id]=1;const pay=MODE==='roma'?4:2;state.obols+=pay;save();updateStats();if(typeof sfxCoin==='function')sfxCoin();
    setTimeout(()=>toast('<span class="label">Periplo</span><br>Has anotado todas las historias de '+D.segs[id].name+'. Un marino te pagaría bien por ese periplo: +'+pay+' '+sw2coin()+'.'),600);}}
// ---- rumbos conocidos
function swShortcut(){if(!BOAT.sea||!SW.seg||SW.swim)return;const D=swD(),z=sw2z(),S=D.segs[SW.seg],opts=[];
  for(const[dir,nm]of[['n','al norte'],['s','al sur'],['e','al este'],['w','al oeste']]){const t=S[dir];if(t&&z.vis[t])opts.push(['Navegar '+nm+': '+D.segs[t].name,()=>{closeDialog();swFade(()=>{const L={n:[0,SW.H-8],s:[0,-SW.H+8],e:[-SW.H+8,0],w:[SW.H-8,0]}[dir];swEnterSeg(t,L[0],L[1]);addHours(1);});}]);}
  for(const I of S.isl)if(I.id&&z.ports[I.id]&&D.entry[I.id]&&D.entry[I.id][0]===SW.seg)opts.push(['Ir hasta '+I.name.replace(/^(El|La|Los|Las) /,m=>m.toLowerCase()),()=>{closeDialog();swFade(()=>{const E=D.entry[I.id];swEnterSeg(E[0],E[1],E[2],true);});}]);
  if(!opts.length){toast('Todavía no conoces bien estas costas: recorre los mares vecinos y visita sus puertos para poder ir más deprisa.');return;}
  opts.push(vmBye);vmS('🧭','Rumbo conocido','por costas que ya conoces','<p>Por costas que ya has recorrido puedes navegar más deprisa: sabes dónde están los bajíos, los puertos y los vientos.</p>',opts);}
// ---- enganches
{const ent0=swEnterSeg;swEnterSeg=function(id,lx,lz,quiet){const r=ent0(id,lx,lz,quiet);const z=sw2z(),first=!z.vis[id];z.vis[id]=1;save();sw2ClearShips();for(let i=0;i<2+Math.floor(Math.random()*2);i++)sw2SpawnShip(id);
   if(!quiet&&!first){sw2RollEnc(id);
     if(!SW2.storm&&Math.random()<(typeof WXS!=='undefined'&&WXS.rain>0.3?0.35:0.07)){SW2.storm={t:70,safe:false,gx:0,gz:0,gt:0};setTimeout(()=>toast('<span class="label">¡Tormenta!</span><br>El cielo se oscurece y el viento arrecia. Busca refugio al abrigo de una costa (acércate a menos de 60 m) o desembarca en un puerto.'),900);}
     if(MODE==='atenas'&&!SW2.pir&&z.trips>2&&Math.random()<0.12){const a=Math.random()*TAU,g=sw2Ship('pirata'),x=player.x+Math.cos(a)*150,zz=player.z+Math.sin(a)*150;g.position.set(x,swSeaY()-0.2,zz);SW2.pir={g,x,z:zz,t:45};
       setTimeout(()=>toast('<span class="label">¡Piratas!</span><br>Una nave de vela roja, sin estandarte, se acerca a toda prisa. Rema con fuerza (Mayús) para alejarte.'),1200);}}
   return r;};
 const land0=swLand;swLand=function(id){const z=sw2z();const ok=swMoorOf(id)||swPortOf(id);land0(id);if(!ok)return;
   setTimeout(()=>{z.ports[id]=1;z.trips++;let msg='';if(z.amph){const pay=z.amph*(MODE==='roma'?3:2);state.obols+=pay;msg+='Vendes en el puerto las '+z.amph+' ánforas que sacaste del fondo: +'+pay+' '+sw2coin()+'. ';z.amph=0;}
     if(z.task&&z.task.to===id){state.obols+=z.task.pay;msg+='Entregas '+z.task.what+': te pagan '+z.task.pay+' '+sw2coin()+'. ';z.task=null;}
     sw2ClearShips();SW2.storm=null;save();updateStats();if(msg){if(typeof sfxCoin==='function')sfxCoin();toast('<span class="label">En el puerto</span><br>'+msg);}},700);};
 const lv0=swLeaveBoat;swLeaveBoat=function(){sw2ClearShips();SW2.storm=null;return lv0();};
 const act0=swAct;swAct=function(o){const a=String(o.act||'').slice(3);
   if(a.startsWith('info:'))sw2Read(a.slice(5));
   if(a==='barca'&&!BOAT.on){const ro=MODE==='roma',god=ro?'Neptuno':'Poseidón';
     return vmS('⚓',o.data&&o.data.name||'La barca','antes de zarpar','<p>Antes de salir al mar, los marinos pedían la protección de los dioses.</p>',[['Subir y zarpar',()=>{closeDialog();swBoard();}],['Mirar la barca',()=>vmS('⛵','Tu barca','sus adornos',ro?'<p>En la proa lleva dos <b>ojos pintados</b>: la costumbre griega de que el barco «vea» su camino siguió viva en época romana. En la popa se curva un <b>cuello de cisne</b> de madera, el adorno que llevan muchos barcos romanos en los relieves y pinturas.</p><p>Junto a la popa va una estatuilla de <b>Neptuno</b> con su tridente: la <i>tutela</i>, el dios protector de la nave. Ovidio cuenta que su barco llevaba como protectora a Minerva, pintada en la popa (Tristes I 10.1-2), y los Hechos de los Apóstoles mencionan un barco de Alejandría con la insignia de los Dioscuros (28.11).</p>':'<p>En la proa lleva dos <b>ojos pintados</b>, como las trirremes: en el puerto de Zea, en el Pireo, se han encontrado ojos de mármol que se encajaban en la proa de los barcos de guerra. Así el barco «ve» el camino.</p><p>En la popa se curva el <b>aflaston</b>, el adorno en forma de abanico: en la <i>Ilíada</i>, Héctor agarra el aflaston de una nave griega y no lo suelta (XV 716-717). Y en la popa va una estatuilla de <b>Atenea</b>, la protectora de la ciudad: los barcos llevaban la imagen de un dios protector.</p>',[['Subir y zarpar',()=>{closeDialog();swBoard();}],vmBye])],
       ['Hacer una libación a '+god+' y zarpar (1 '+(ro?'sestercio':'óbolo')+')',()=>{if(state.obols>=1){state.obols-=1;updateStats();}const z=sw2z();if(z.lib!==state.day){z.lib=state.day;if(typeof qAdd==='function')qAdd('eu',1);}save();
         vmS('🍷','Una libación',god,ro?'<p>Derramas un poco de vino en el agua y prometes a Neptuno una ofrenda si vuelves sano y salvo. Los marineros invocaban también a los Dioscuros, Cástor y Pólux, «las estrellas brillantes» que protegen a los barcos (Horacio, Odas I 3.1-8).</p>':'<p>Derramas un poco de vino en el agua y pides a Poseidón un buen viaje. Tucídides cuenta que, antes de zarpar hacia Sicilia en el 415, toda la flota ateniense hizo libaciones con copas de oro y plata y cantó un himno a la vez, a la señal de una trompeta (VI 32.1).</p>',[['Zarpar',()=>{closeDialog();swBoard();}]]);}],vmBye]);}
   return act0(o);};
 const ac0=swAction;swAction=function(){if(BOAT.sea&&SW.seg&&typeof SWAF!=='undefined'&&sw2z().af===1){for(const k in SWAF.it){const I=SWAF.it[k];if(I.seg!==SW.seg)continue;const d=Math.hypot(player.x-I.x,player.z-I.z);if(I.under?(SW.swim&&SW.depth>20&&d<4):(!SW.swim&&d<7))return['Coger: '+SW_AFT[k][0].toLowerCase(),()=>sw2AfTake(k)];}}if(BOAT.sea&&SW.seg){if(SW.swim){if(SW.depth>8)for(const A of SW2.amph){if(A.seg!==SW.seg||!A.m.visible)continue;if(Math.hypot(player.x-A.x,player.z-A.z)<3.5)return['Coger el ánfora',()=>{const z=sw2z();z.wr[A.key]=1;z.amph++;save();sw2AmphVis();toast('Subes un ánfora del pecio. La venderás en el próximo puerto. Ánforas a bordo: '+z.amph+'.');}];}}
     else{if(SW2.enc&&Math.hypot(player.x-SW2.enc.x,player.z-SW2.enc.z)<24)return['Acercarte a '+SW2_ENC[SW2.enc.k].name.replace(/^(Las) /,'las '),sw2EncTalk];
       for(const S of SW2.ships)if(Math.hypot(player.x-S.x,player.z-S.z)<18)return['Hablar con '+{pesca:'el pescador',mercante:'el patrón del mercante',trirreme:'el trierarca',liburna:'el capitán de la liburna'}[S.type],()=>sw2ShipTalk(S)];}}
   return ac0();};
 const row0=swRow;swRow=function(dt){if(SW.seg&&!SW.swim){const w=sw2wind(),euf=SW2.sail&&sw2z().af===2,pb=(w.b+180)*Math.PI/180,px=euf?Math.sin(SW.h):Math.sin(pb),pz=euf?Math.cos(SW.h):-Math.cos(pb),k=SW2.sail?0.9:0.12;let dx=px*w.st*k,dz=pz*w.st*k;
     if(SW2.storm){const S=SW2.storm;S.gt-=dt;if(S.gt<0){S.gt=2+Math.random()*3;const a=Math.random()*TAU;S.gx=Math.cos(a)*5;S.gz=Math.sin(a)*5;}dx+=S.gx;dz+=S.gz;}
     SW.dvx=dx;SW.dvz=dz;}else{SW.dvx=0;SW.dvz=0;}return row0(dt);};
 const tk0=swTick;swTick=function(dt){tk0(dt);if(!swD()||!SW.built)return;sw2Tick(dt);};}
function sw2ShipTalk(S){const ro=MODE==='roma',z=sw2z();S.talk=1;
  const T={pesca:ro?'<p>«¿Ves esa torre en la costa? Desde ahí el vigía avisa cuando llegan los bancos de atunes, y salimos todos a cercarlos con las redes» (Estrabón V 2.6). «Lo que sobra de los peces se deja fermentar al sol con sal: así se hace el garum, la salsa que echáis a todo en Roma. El mejor viene de Hispania» (Plinio XXXI 93-94).</p>':'<p>«¿Ves esa atalaya? Desde ahí el vigía avista los bancos de atunes y nos hace señales para cercarlos con las redes». Aristófanes se burla de un político que vigila los tributos «como un atalayero de atunes» (Caballeros 313).</p><p>«Lo que no se come fresco se sala y se vende en ánforas por todo el Egeo».</p>',
   mercante:ro?'<p>«Llevamos grano de Alejandría para Roma: la ciudad come tanto que, si nuestros barcos se retrasan, hay motines. En invierno el mar se cierra y nadie navega, de noviembre a marzo» (lo recogerá Vegecio, IV 39). «Un buen viento del norte nos trae de Egipto en tres semanas; volver cuesta el doble».</p>':'<p>«Llevamos vino de Quíos y aceite del Ática. Solo navegamos con buen tiempo: Hesíodo aconseja hacerse a la mar en los cincuenta días después del solsticio de verano, cuando el mar es tranquilo» (Trabajos y días 663-665). «En invierno, los barcos se varan en la playa y se espera».</p>',
   trirreme:'<p>«Somos doscientos a bordo: ciento setenta remeros en tres filas, algunos marineros y los soldados de cubierta. Un flautista marca el ritmo de la boga. Los remeros son ciudadanos pobres, metecos y algunos esclavos; en la expedición a Sicilia se les pagaba una dracma al día» (Tucídides VI 31.3). «Con ella, la flota de Atenas manda en el mar».</p>',
   liburna:'<p>«Una liburna: ligera y rápida, con dos filas de remos. Roma copió el diseño de los liburnos, unos piratas de Iliria, y con estas naves Augusto venció en Accio» (lo contará Vegecio, IV 33). «Ya no hay piratas: Pompeyo los barrió de todo el mar en tres meses, en el 67 a.C.» (Plutarco, Pompeyo 24-28).</p>'}[S.type];
  const btn=[];if(S.type==='mercante'&&!z.task){const P=sw2Ports().filter(p=>p[0]!==z.at);if(P.length){const p=P[Math.floor(Math.random()*P.length)],what=ro?['una carta sellada','un saco de pimienta','un ánfora de garum'][Math.floor(Math.random()*3)]:['una carta sellada','un ánfora de vino de Quíos','un rollo de papiro'][Math.floor(Math.random()*3)],pay=ro?10:5;
    btn.push(['Aceptar un encargo: llevar '+what+' a '+p[1],()=>{z.task={to:p[0],name:p[1],what,pay};save();closeDialog();toast('<span class="label">Encargo</span><br>Llevas '+what+' para '+p[1]+'. Te pagarán '+pay+' '+sw2coin()+' al desembarcar allí. Lo verás en el periplo (L).');}]);}}
  btn.push(vmBye);vmS('⛵',{pesca:'Un pescador',mercante:'El patrón de un mercante',trirreme:'El trierarca',liburna:'El capitán de una liburna'}[S.type],'en alta mar',T,btn);}
function sw2Tick(dt){const sy=swSeaY(),inS=BOAT.sea&&SW.seg;sw2OrbTick(dt);if(typeof navTick==='function')navTick(dt);
  if(!swIn()&&(SW2.ships.length||SW2.enc||SW2.pir)){sw2ClearShips();SW2.storm=null;}
  for(const S of SW2.ships){if(S.seg!==SW.seg){S.g.visible=false;continue;}S.g.visible=true;S.x+=S.vx*dt;S.z+=S.vz*dt;const t=performance.now()/1000;S.g.position.set(S.x,sy-0.2+Math.sin(t*1.3+S.x)*0.06,S.z);if(Math.abs(S.x-SW.X)>SW.H+120){S.vx*=-1;S.g.rotation.y=Math.atan2(S.vx,S.vz);}}
  if(SW2.enc){SW2.enc.t-=dt;if(SW2.enc.t<0)sw2EncGone();}
  // piratas: persiguen la barca
  if(SW2.pir&&inS){const P=SW2.pir,dx=player.x-P.x,dz=player.z-P.z,d=Math.hypot(dx,dz)||1;P.t-=dt;P.x+=dx/d*6.6*dt;P.z+=dz/d*6.6*dt;P.g.position.set(P.x,sy-0.2,P.z);P.g.rotation.y=Math.atan2(dx,dz);
    if(d<12&&ui==='play'){scene.remove(P.g);SW2.pir=null;const z=sw2z(),take=Math.min(state.obols,6);state.obols-=take;const lost=sw2Lost();updateStats();
      vmS('☠','Piratas','te han alcanzado','<p>Los piratas abordan tu barca, se llevan '+take+' óbolos'+(lost?' y lo que llevabas':'')+' y se van riendo.'+lost+'</p><p>No es una aventura de libro: Isócrates, escribiendo hacia el 380 a.C., se queja de que los piratas dominan el mar (Panegírico 115), y en la guerra los capturados se vendían como esclavos. Por eso los mercantes viajaban en convoy, escoltados por trirremes.</p>',[vmBye]);}
    else if(P.t<0||d>260){scene.remove(P.g);SW2.pir=null;toast('Has dejado atrás a los piratas. Esta vez.');}}
  // tormenta
  if(SW2.storm&&inS){const S=SW2.storm;S.t-=dt;const n=swIsleNear(player.x,player.z);if(n&&n.d<60)S.safe=true;
    if(scene.fog&&!SW.uw){scene.fog.color.set('#56636c');scene.fog.near=60;scene.fog.far=520;}
    if(S.t<0){SW2.storm=null;if(S.safe)toast('La tormenta pasa. Al abrigo de la costa, la barca ha aguantado.');else{const lost=sw2Lost();toast('<span class="label">La tormenta</span><br>Una ola enorme vuelca la barca. Consigues enderezarla agarrado al casco, empapado y temblando.'+lost);}updateSky();}}
  else if(SW2.storm&&!inS)SW2.storm=null;
  // la vela
  if(SW.bg&&!SW2.sailG){const g=new THREE.Group(),m=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,4.2,6),lam('#4a3220'));m.position.y=2.6;g.add(m);box(2.6,2.2,0.05,lam('#e8dcc4'),0,3.2,0,g);SW.bg.add(g);SW2.sailG=g;}
  if(SW2.sailG){SW2.sailG.visible=SW2.sail&&BOAT.sea;if(SW2.sail){const w=sw2wind();SW2.sailG.rotation.y=-(w.b*Math.PI/180)-SW.bg.rotation.y+Math.PI/2;}}
  // indicaciones
  SW2.hudT-=dt;if(SW2.hudT>0)return;SW2.hudT=0.4;let H=$('sw2Hud');if(!H){H=document.createElement('div');H.id='sw2Hud';document.body.appendChild(H);const st=document.createElement('style');st.textContent='#sw2Hud{position:fixed;left:50%;bottom:calc(150px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:20;text-align:center;color:#f1e8d8;font-size:.8rem;text-shadow:0 1px 3px #000;pointer-events:none;max-width:92vw}#sw2Hud button{pointer-events:auto;margin:3px;padding:6px 10px;border-radius:8px;border:1px solid #c98a4e;background:rgba(24,19,15,.85);color:#f1e8d8;font:inherit}';document.head.appendChild(st);}
  if(!inS||SW.swim||ui!=='play'){if(H.innerHTML)H.innerHTML='';SW2.hudK='';return;}
  const w=sw2wind(),wn=sw2windName(w.b),night=clock.h<6||clock.h>=20,z=sw2z();
  const key=[w.b,SW2.sail,night,!!SW2.storm,!!SW2.pir,isTouch,!!z.task,z.amph,z.blvl,z.bxp].join('|');if(key===SW2.hudK)return;SW2.hudK=key;
  H.innerHTML='Barca nivel '+(z.blvl||0)+((z.blvl||0)<10?' ('+(z.bxp||0)+'/'+sw2Need(z.blvl||0)+' esferas de espuma)':' (máximo)')+'<br>'+'Sopla '+wn[0]+' ('+wn[1]+')'+(w.st>5?', fuerte':'')+' · vela '+(SW2.sail?'izada':'arriada')+(isTouch?'':' (<b>Z</b>)')+(night?'<br>De noche: la Osa Mayor señala el norte, como a Ulises (Odisea V 270-277)':'')+(SW2.storm?'<br><b>Tormenta:</b> busca el abrigo de una costa':'')+(SW2.pir?'<br><b>¡Piratas!</b> Rema con fuerza para escapar':'')+(z.task?'<br>Encargo: '+z.task.what+' → '+z.task.name:'')+(z.amph?' · ánforas: '+z.amph:'')+
    (isTouch?'<br><button id="s2v">Vela</button><button id="s2p">Periplo</button><button id="s2u">Rumbo</button><button id="s2g">Guía</button>':'<br><b>L</b>: periplo · <b>U</b>: rumbo conocido · <b>Y</b>: '+(SWNAV.on?'ocultar':'mostrar')+' flechas');
  const b1=$('s2v');if(b1){b1.onclick=()=>{SW2.sail=!SW2.sail;SW2.hudK='';};$('s2p').onclick=swPeriplo;$('s2u').onclick=swShortcut;$('s2g').onclick=()=>{SWNAV.on=!SWNAV.on;try{localStorage.setItem('nostos-guia',SWNAV.on?'on':'off');}catch(_){}};}}
window.addEventListener('keydown',e=>{if(ui!=='play'||!BOAT.sea||(e.target&&e.target.tagName==='INPUT')||e.repeat)return;
  if(e.code==='KeyZ'&&SW.seg&&!SW.swim){SW2.sail=!SW2.sail;SW2.hudK='';toast(SW2.sail?'Izas la vela: el viento empuja la barca hacia donde sopla.':'Arrías la vela: solo los remos.');}
  else if(e.code==='KeyL'){e.preventDefault();swPeriplo();}
  else if(e.code==='KeyU'){e.preventDefault();swShortcut();}});
// ---- esferas de espuma (turquesa; las del caballo son doradas): al recogerlas sube el nivel de la barca y rema más deprisa
const SWORB={list:[],acc:0};
function sw2Need(l){return 5+l*3;}
function sw2Mul(){const z=sw2z();return 1+0.08*Math.min(10,z.blvl||0);}
function sw2OrbSpawn(){const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw),d=40+Math.random()*60,l=(Math.random()-0.5)*50,x=player.x+fx*d+rx*l,z=player.z+fz*d+rz*l;
  const n=swIsleNear(x,z);if(n&&n.d<12)return;const cz=swSegZ(SW.seg);if(Math.abs(x-SW.X)>SW.H-10||Math.abs(z-cz)>SW.H-10)return;
  const g=new THREE.Group(),y=swSeaY()+1.3;g.position.set(x,y,z);g.add(new THREE.Mesh(new THREE.SphereGeometry(0.6,16,12),new THREE.MeshBasicMaterial({color:0x6ff2e4})));
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:typeof EPI_TEX!=='undefined'?EPI_TEX:null,color:0x40e0d0,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));sp.scale.set(4.2,4.2,1);g.add(sp);
  scene.add(g);SWORB.list.push({g,x,z,y,seg:SW.seg,t:Math.random()*6});}
function sw2OrbClear(){for(const o of SWORB.list)scene.remove(o.g);SWORB.list.length=0;}
function sw2OrbTick(dt){if(!(BOAT.sea&&SW.seg&&!SW.swim&&ui==='play')){if(SWORB.list.length&&!swIn())sw2OrbClear();return;}
  SWORB.acc-=dt;if(SWORB.acc<0){SWORB.acc=2.5;if(SWORB.list.filter(o=>o.seg===SW.seg).length<5)sw2OrbSpawn();}
  const t=performance.now()/1000;for(let i=SWORB.list.length-1;i>=0;i--){const o=SWORB.list[i];o.g.visible=o.seg===SW.seg;o.g.position.y=o.y+Math.sin(t*2+o.t)*0.3;
    const d=Math.hypot(player.x-o.x,player.z-o.z);if(o.seg!==SW.seg||d>260){scene.remove(o.g);SWORB.list.splice(i,1);continue;}
    if(d<3.2){scene.remove(o.g);SWORB.list.splice(i,1);const z=sw2z();z.bxp=(z.bxp||0)+1;z.blvl=z.blvl||0;if(typeof sfxCoin==='function')sfxCoin();
      if(z.blvl<10&&z.bxp>=sw2Need(z.blvl)){z.bxp=0;z.blvl++;if(z.blvl===10&&!z.af)setTimeout(sw2Afro,600);toast('<span class="label">Tu barca · nivel '+z.blvl+'</span><br>Remas con más soltura: la barca va un '+Math.round((sw2Mul()-1)*100)+' % más deprisa.');if(typeof qAdd==='function')qAdd('ar',1);}
      save();SW2.hudK='';}}}
function sw2Setup(){if(!swD()||!SW.built)return;SW2.amph.length=0;SW2.sailG=null;sw2ClearShips();sw2Wrecks();sw2AfItems();}
// ---- Afrodita (Venus) nace de la espuma y encarga tres regalos perdidos en el mar; recompensa: viento siempre a favor con la vela
const SW_AF={atenas:{name:'Afrodita',items:{manzana:['egeonorte',330,-60,0],cinturon:['cicladas',-150,60,1],paloma:['saronico',100,150,0]}},roma:{name:'Venus',items:{manzana:['syria',-20,-180,0],cinturon:['crater',0,100,1],paloma:['eolias',100,150,0]}}};
const SW_AFT={manzana:['La manzana de oro','<p>Una manzana de oro flota sobre las olas, sin hundirse.</p><p>En la boda de Peleo y Tetis, Eris, la Discordia, arrojó entre las diosas una manzana de oro «para la más bella». Hera, Atenea y Afrodita se la disputaron, y Zeus mandó que juzgara el pastor Paris, hijo de Príamo. Afrodita le prometió a la mujer más bella del mundo, Helena, y Paris le dio la manzana: así empezó la guerra de Troya (Apolodoro, Epítome 3.2; la Ilíada lo recuerda en XXIV 25-30).</p>'],
 cinturon:['El cinturón bordado','<p>En el fondo brilla una cinta bordada de colores.</p><p>Es el cinturón de Afrodita, en el que estaban bordados el amor, el deseo y las palabras dulces que engañan hasta a los más sensatos. En la <i>Ilíada</i>, Hera se lo pide prestado para seducir a Zeus y distraerlo de la guerra (XIV 214-221).</p>'],
 paloma:['Una paloma blanca','<p>Sobre un madero a la deriva, una paloma blanca te mira sin miedo y se posa en tu mano.</p><p>Las palomas eran las aves de Afrodita. Virgilio cuenta que dos palomas de Venus guiaron a Eneas por el bosque hasta la rama dorada (Eneida VI 190-193).</p>']};
const SWAF={on:false,it:{}};
function sw2AfItems(){const D=SW_AF[MODE];if(!D)return;for(const k in SWAF.it)scene.remove(SWAF.it[k].g);SWAF.it={};const z=sw2z();
  for(const k in D.items){const [seg,lx,lz,under]=D.items[k];if(!D||(z.afit&&z.afit[k]))continue;const x=SW.X+lx,zz=swSegZ(seg)+lz,y=under?SW.BED+0.5:swSeaY()+0.3,g=new THREE.Group();g.position.set(x,y,zz);
    if(k==='manzana'){const a=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,10),new THREE.MeshLambertMaterial({color:'#ffd040',emissive:'#806000'}));a.position.y=0.3;g.add(a);}
    if(k==='cinturon'){const c=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.07,6,24),new THREE.MeshLambertMaterial({color:'#e05a8a',emissive:'#602040'}));c.rotation.x=Math.PI/2;c.position.y=0.15;g.add(c);}
    if(k==='paloma'){box(1.6,0.2,0.3,lam('#6a5a44'),0,0,0,g);const b=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),lam('#f4f0ea'));b.scale.set(1,0.9,1.6);b.position.y=0.3;g.add(b);const hd=new THREE.Mesh(new THREE.SphereGeometry(0.09,8,6),lam('#f4f0ea'));hd.position.set(0,0.42,0.22);g.add(hd);}
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:typeof EPI_TEX!=='undefined'?EPI_TEX:null,color:0xff8ac0,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));sp.scale.set(3.2,3.2,1);sp.position.y=0.4;g.add(sp);
    scene.add(g);SWAF.it[k]={g,seg,x,z:zz,under};}
  for(const k in SWAF.it)SWAF.it[k].g.visible=z.af===1;}
function sw2Afro(){const z=sw2z();if(z.af||SWAF.on)return;const ro=MODE==='roma',D=SW_AF[MODE],nm=D.name;SWAF.on=true;SWAF.c1=SWAF.c2=0;
  const ui0=ui;ui='cine';if(typeof releasePointer==='function')releasePointer();SW.vx=SW.vz=0;if(typeof cineCSS==='function')cineCSS();
  const a=player.yaw,cx=player.x-Math.sin(a)*16,cz=player.z-Math.cos(a)*16,sy=swSeaY();player.pitch=0.06;
  const foam=new THREE.Group();scene.add(foam);const fm=new THREE.MeshLambertMaterial({color:'#f6f4ee',transparent:true,opacity:0.92});
  for(let i=0;i<40;i++){const r=Math.random()*4,an=Math.random()*TAU,m=new THREE.Mesh(new THREE.SphereGeometry(0.5+Math.random()*0.9,8,6),fm);m.position.set(cx+Math.cos(an)*r,sy+Math.random()*0.6,cz+Math.sin(an)*r);m.scale.setScalar(0.01);foam.add(m);}
  const shell=new THREE.Mesh(new THREE.SphereGeometry(1.6,16,8,0,TAU,0,Math.PI/2),lam('#f0d8cc',{side:THREE.DoubleSide}));shell.scale.set(1,0.35,1);shell.position.set(cx,sy-3,cz);scene.add(shell);
  const fig=makePerson({chiton:'#f6efe4',himation:'#e8a0b4',hair:'#d8b060'});fig.position.set(cx,sy-4.5,cz);fig.rotation.y=Math.atan2(player.x-cx,player.z-cz);scene.add(fig);
  const d=document.createElement('div');d.id='cine';d.innerHTML='<div class="cap"></div><div class="sk">'+(isTouch?'Toca para saltar':'Clic para saltar')+'</div>';document.body.appendChild(d);requestAnimationFrame(()=>d.classList.add('on'));
  const cap=t=>{const c=d.querySelector('.cap');if(c)c.innerHTML=t;};cap('La barca se detiene sola. Delante de ti, el mar empieza a hervir de espuma blanca…');
  let t=0,t0=performance.now(),done=false;const end=()=>{if(done)return;done=true;clearInterval(iv);d.classList.remove('on');setTimeout(()=>d.remove(),500);scene.remove(foam);scene.remove(shell);
    ui='play';z.af=1;z.afit=z.afit||{};save();sw2AfItems();
    vmS('🐚',nm,ro?'la madre de Eneas':'la que nació de la espuma',(ro?'<p>«Soy Venus, la madre de Eneas y de todos los romanos. No te asustes: solo he recreado para ti mi nacimiento. No nací aquí: nací de la espuma del mar junto a la isla de Citera, y las olas me llevaron después a Chipre. Has recogido la espuma de todos los mares: ya eres un marino de verdad».</p>':'<p>«Soy Afrodita. No te asustes: solo he recreado para ti mi nacimiento. No nací aquí: nací de la espuma del mar junto a la isla de Citera, y las olas me llevaron después a Chipre. Has recogido la espuma de todos los mares: ya eres un marino de verdad».</p>')+
      '<p>«Pero he perdido tres regalos que me pertenecen, y el mar los esconde: <b>la manzana de oro</b>, <b>mi cinturón bordado</b> (está en el fondo: tendrás que bucear) y <b>una de mis palomas</b>. Brillan con una luz rosada. Tráemelos y te protegeré en el mar».</p><p class="src">'+(ro?'La manzana, en el mar de Siria; el cinturón, en el fondo del golfo de Neápolis; la paloma, en las islas Eolias.':'La manzana, en el Egeo del norte; el cinturón, en el fondo del mar de las Cícladas; la paloma, en el golfo Sarónico.')+' Lo verás en el periplo (L).</p>'+
      (ro?'<p class="src">Hesíodo cuenta que Afrodita nació de la espuma del mar (Teogonía 188-200); los romanos la identificaban con Venus.</p>':'<p class="src">Hesíodo, Teogonía 188-200: Afrodita nació de la espuma y llegó primero a Citera y después a Chipre.</p>'),[vmBye]);
    setTimeout(()=>{if(fig.parent){let k=0;const iv2=setInterval(()=>{fig.position.y-=0.12;if(++k>40){clearInterval(iv2);scene.remove(fig);}},50);}},1500);SWAF.on=false;};
  d.onclick=end;
  const iv=setInterval(()=>{t=(performance.now()-t0)/1000;const k=Math.min(1,t/3);foam.children.forEach((m,i)=>{m.scale.setScalar(0.01+k*(1+0.3*Math.sin(t*3+i)));m.position.y=sy+0.2+Math.sin(t*2+i)*0.15;});
    if(t>3)shell.position.y=Math.min(sy+0.2,sy-3+(t-3)*1.6);if(t>3.6)fig.position.y=Math.min(sy+0.5,sy-4.5+(t-3.6)*2.2);
    player.yaw=Math.atan2(player.x-cx,player.z-cz);
    if(t>3&&t<6&&!SWAF.c1){SWAF.c1=1;cap('De la espuma surge una gran concha, y sobre ella…');}if(t>6&&!SWAF.c2){SWAF.c2=1;cap(ro?'…una mujer de una belleza imposible. Es Venus, la madre de Eneas.':'…una mujer de una belleza imposible. Es Afrodita, la nacida de la espuma.');}
    if(t>10.5)end();},50);}
function sw2AfTake(k){const z=sw2z(),D=SW_AF[MODE],T=SW_AFT[k];z.afit=z.afit||{};z.afit[k]=1;save();if(SWAF.it[k]){scene.remove(SWAF.it[k].g);delete SWAF.it[k];}if(typeof sfxCoin==='function')sfxCoin();
  const n=Object.keys(z.afit).length,ro=MODE==='roma';let fin='';
  if(n>=3){z.af=2;save();if(typeof qAdd==='function')qAdd('eu',2);fin=ro?'<p class="src">Una voz suena desde la espuma: «Gracias. Desde ahora, cuando ices la vela, el viento soplará siempre a tu favor». Horacio pedía a la diosa de Chipre que guiara la nave de Virgilio (Odas I 3.1-8).</p><p><b>Bendición de Venus:</b> con la vela izada, el viento siempre sopla hacia donde vas.</p>':'<p class="src">Una voz suena desde la espuma: «Gracias. Desde ahora seré para ti Afrodita Euploia, la de la buena navegación». En el Pireo hay un santuario de Afrodita Euploia que fundó el general Conón tras su victoria naval de Cnido, en el 394 (Pausanias I 1.3).</p><p><b>Bendición de Afrodita Euploia:</b> con la vela izada, el viento siempre sopla hacia donde vas.</p>';}
  else fin='<p class="src">Llevas '+n+' de 3 regalos de '+D.name+'.</p>';
  vmS('🐚',T[0],'un regalo de '+D.name,T[1]+fin,[vmBye]);}

const eduEntriesSW2=eduEntries;eduEntries=function(){const E=eduEntriesSW2();const D=swD();if(!D||!state)return E;const z=sw2z();
  for(const k in z.per)if(D.info[k])E.push({c:'Periplo',n:D.info[k][0],t:sw2strip(D.info[k][2])});
  for(const k in z.enc)if(SW2_ENC[k])E.push({c:'Encuentros en el mar',n:SW2_ENC[k].name,t:sw2strip(SW2_ENC[k].txt+(MODE==='roma'&&SW2_ENC[k].ro?SW2_ENC[k].ro:''))});return E;};
// ---- modo atención en el mar: encuentros, barcos, esferas, regalos, ánforas, islas y la propia barca
const atCandsSW=atCands;atCands=function(){const C=atCandsSW();try{if(!swD()||!SW.built)return C;const sy=swSeaY(),z=sw2z(),ro=MODE==='roma',two=t=>{const a=sw2strip(t).split(/(?<=\.)\s/);return a.slice(0,3).join(' ');};
  if(SW.bg&&SW.bg.visible!==false)C.push({obj:SW.bg,x:SW.bg.position.x,y:sy+0.8,z:SW.bg.position.z,r:2.2,name:z.mine?'Tu barca':'La barca',sub:'barca de remos',txt:()=>(ro?'Una barca de remos con dos ojos pintados en la proa, un cuello de cisne en la popa y una estatuilla de Neptuno, su dios protector (la tutela).':'Una barca de remos con dos ojos pintados en la proa para que «vea» el camino, el aflaston en abanico en la popa y una estatuilla de Atenea, su protectora.')+' Nivel '+(z.blvl||0)+': recoge esferas de espuma para que reme más deprisa.'});
  if(!swIn())return C;
  if(SW2.enc){const E=SW2_ENC[SW2.enc.k];C.push({obj:SW2.enc.g,x:SW2.enc.x,y:sy+2,z:SW2.enc.z,r:2.5,name:E.name,sub:E.sub,txt:()=>two(E.txt)});}
  const SH={pesca:['Una barca de pescadores','pesca de bajura',ro?'Pescan atún, sardinas y caballas; con las vísceras saladas al sol se hace el garum (Plinio XXXI 93-94).':'Pescan atún, que avistan desde atalayas en la costa, y lo salan para venderlo en ánforas.'],
   mercante:['Un barco mercante','de vela, cargado de ánforas',ro?'Lleva grano, vino o aceite. En invierno el mar «se cierra» y casi nadie navega.':'Lleva vino, aceite o trigo en ánforas. Solo se navega con buen tiempo, de primavera a otoño.'],
   trirreme:['Una trirreme','barco de guerra ateniense','Unos doscientos hombres a bordo, ciento setenta de ellos remeros en tres filas. Un flautista marca el ritmo de la boga.'],
   liburna:['Una liburna','galera ligera de la flota romana','Rápida y con dos filas de remos; Roma copió el diseño de los liburnos de Iliria. Vigila que no vuelvan los piratas.']};
  for(const S of SW2.ships){if(S.seg!==SW.seg)continue;const T=SH[S.type];C.push({obj:S.g,x:S.x,y:sy+2.5,z:S.z,r:4,name:T[0],sub:T[1],txt:()=>T[2]+' Acércate con la barca y pulsa E para hablar.'});}
  if(SW2.pir)C.push({obj:SW2.pir.g,x:SW2.pir.x,y:sy+2.5,z:SW2.pir.z,r:4,name:'Una nave pirata',sub:'¡rema!',txt:()=>'Vela roja y ningún estandarte: piratas. Isócrates se queja hacia el 380 a.C. de que dominan el mar (Panegírico 115). Rema con fuerza para escapar.'});
  for(const o of SWORB.list){if(o.seg!==SW.seg)continue;C.push({obj:o.g,x:o.x,y:o.g.position.y,z:o.z,r:1.4,name:'Una esfera de espuma',sub:'brilla sobre el agua',txt:()=>'Pasa con la barca por encima para recogerla: con cada nivel remas más deprisa (hasta el nivel 10). Llevas '+(z.bxp||0)+' de '+sw2Need(z.blvl||0)+' para el siguiente nivel.'});}
  if(typeof SWAF!=='undefined'&&z.af===1)for(const k in SWAF.it){const I=SWAF.it[k];if(I.seg!==SW.seg)continue;C.push({obj:I.g,x:I.x,y:I.g.position.y+0.4,z:I.z,r:1.6,name:SW_AFT[k][0],sub:'un regalo de '+SW_AF[MODE].name,txt:()=>two(SW_AFT[k][1])+(I.under?' Está en el fondo: tírate al agua y bucea.':' Acércate con la barca y pulsa E.')});}
  if(SW.swim)for(const A of SW2.amph){if(A.seg!==SW.seg||!A.m.visible)continue;C.push({obj:A.m,x:A.x,y:A.m.position.y,z:A.z,r:1.2,name:'Un ánfora',sub:'de un barco hundido',txt:()=>'Un ánfora de un mercante hundido: podía llevar vino, aceite o salsa de pescado. Acércate y pulsa E para subirla; la venderás en el próximo puerto.'});}
  const Sg=swD().segs[SW.seg];if(Sg){const cz=swSegZ(SW.seg);for(const I of Sg.isl){if(I.rock)continue;C.push({x:SW.X+I.x,y:sy+Math.min(I.h,40)*0.6,z:cz+I.z,r:Math.min(I.rx,I.rz)*0.8,place:1,name:I.name,sub:I.sub||'',txt:()=>(I.sub?I.sub.charAt(0).toUpperCase()+I.sub.slice(1)+'. ':'')+(I.id?'Acércate a su orilla con la barca y pulsa E para desembarcar.':'No se puede desembarcar aquí en este viaje.')});}}
 }catch(e){}return C;};
const eduReportSW2=eduReport;eduReport=function(){const r=eduReportSW2();try{const D=swD();if(D){const z=sw2z();let tot=0;for(const id in D.segs)tot+=sw2keys(id).length;r.periplo=Object.keys(z.per).filter(k=>D.info[k]).length+' de '+tot+' historias del mar, '+Object.keys(z.vis).length+' de '+Object.keys(D.segs).length+' mares';}}catch(e){}return r;};

