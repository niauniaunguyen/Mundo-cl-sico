// ============================================================ EL MINOTAURO ABRE LOS PORTALES DE LEYENDA (22/11)
// Atenas · En el sueño de Cnosos, en la sala del centro del laberinto, ya no hay un combate a puñetazos: hay un portal de leyenda.
//   1. Dédalo (en un rincón del laberinto) pide siete plumas; con ellas hace las alas, pero las guarda hasta que superes al Minotauro.
//   2. El portal del centro se abre cuando las alas están hechas. Dentro, «El Minotauro», al estilo de los portales: Asterión acecha
//      y embiste (se esquiva o se para con el escudo) mientras reúnes los orbes de Niké. Nadie muere.
//   3. Al volver a la sala, Dédalo te da las alas y huyes volando por la sala abierta al cielo, como Dédalo e Ícaro (Ovidio, Met. VIII 183-235).
//      Al despertar se abren los portales de leyenda, cada uno en el lugar de su mito: la Hidra en Lerna, las aves en el lago Estínfalo,
//      el león en Nemea y la hazaña de Diomedes en Troya. (Caco, leyenda romana, queda para el modo Roma.)
// Roma · No hay Creta: la leyenda de entrada es Caco, en un portal junto al templo de Hércules Vencedor, en el Foro Boario, al pie del
//   Aventino (allí estaba el Ara Máxima de Hércules, Livio I 7). Al superarla, ese portal ofrece también los trabajos de Hércules
//   (la Hidra, las aves, el león), y en Apulia se abre el de Diomedes en Argiripa.
// Desaparece el portal único de Atenea Niké / Palatino. Las partidas que ya habían entrado en alguna leyenda los conservan abiertos.
const MNT={door:null,dest:{},t:0,back:false,msg:false};
function leyOpen(){const z=leyz();if(!z.open){for(const k in z)if(z[k]&&typeof z[k]==='object'&&z[k].tries>0){z.open=1;save();break;}}return !!z.open;}
const LEY_DEST={atenas:[['lerna','hidra'],['estinfalo','aves'],['nemea','leon'],['troya','diomedes']],roma:[['apulia','argiripa']]};
function leyRed(o){try{const red=new THREE.Color(LEY_RED);o.A.m.color.copy(red);o.A.sm.color.copy(red);leyHalo(o.g);}catch(e){}}
// ---- el portal de la ciudad: solo en Roma, junto al templo de Hércules Vencedor
leyDoor=function(){if(MODE!=='roma')return;const P=int2Place(/ro_hercules|Hércules Vencedor/i)||int2Place(/Boario/i)||int2Place(/Aventin/i);if(!P)return;const s=int2Spot(P,9,6);if(!s)return;
  const o=int2Door(Object.assign(s,{id:'ley',room:'caco',name:'Portal de las leyendas',sub:'junto al templo de Hércules: Caco en el Aventino'}));leyRed(o);LEY.door=o;};
// el menú del portal: en Roma, Caco y (abiertos) los trabajos de Hércules; las leyendas con portal propio no salen aquí
{const f=legChoose;legChoose=function(o){const ro=leyRo(),op=leyOpen(),keep=k=>ro?(k==='caco'||(op&&['hidra','aves','leon'].includes(k))):['hidra','aves','leon'].includes(k),all=LEG_ORDER.slice();
  LEG_ORDER.length=0;all.filter(keep).forEach(k=>LEG_ORDER.push(k));try{return f.apply(this,arguments);}finally{LEG_ORDER.length=0;all.forEach(k=>LEG_ORDER.push(k));}};}
// ---- los portales de los destinos (se crean al acercarte, con el relieve ya hecho)
function leyDestTick(){if(!leyOpen()||typeof ISLANDS==='undefined')return;for(const[id,room]of LEY_DEST[MODE==='roma'?'roma':'atenas']){if(MNT.dest[id])continue;const I=ISLANDS.find(q=>q.id===id);if(!I)continue;
  if(Math.hypot(player.x-I.x,player.z-I.z)>I.R*1.4)continue;const c=I.town||I,f=findFree(c.x+22,c.z+14,1.6)||[c.x+22,c.z+14],a=Math.atan2(c.x-f[0],c.z-f[1])+Math.PI;
  const o=int2Door({id:'ley_'+room,room,x:f[0],z:f[1],a,name:'Portal de leyenda',sub:LEG[room].title()});o.g.position.y=floorAt(f[0],f[1]);leyRed(o);MNT.dest[id]=o;}}
// ---- Cnosos: el portal en la sala del centro
function mntW(){return wz();}
function mntReady(){const w=mntW();return !!(w.own||w.ready);}
minotaurEncounter=function(){};   // ya no hay combate: en su lugar está el portal
function mntDoorTick(){if(MODE!=='atenas'||!KNOS.maze||MNT.door)return;const M2=KNOS.maze;if(KNOS.mino)KNOS.mino.visible=false;
  const o=int2Door({id:'ley_mino',room:'minotauro',x:M2.cx,z:M2.cz+2,a:0,name:'Portal de leyenda',sub:'el Minotauro'});o.g.position.y=KNOS.y;leyRed(o);MNT.door=o;}
{const f=int2Enter;int2Enter=function(o){if(o&&o.id==='ley_mino'&&!mntReady()){if(!MNT.lockT||performance.now()-MNT.lockT>4000){MNT.lockT=performance.now();toast('<span class="label">El portal no se abre</span><br>Una luz roja late en el centro del laberinto, pero no te deja pasar. En un rincón del laberinto, Dédalo necesita tu ayuda.');}return;}return f.apply(this,arguments);};}
// Dédalo hace las alas con las siete plumas, pero las guarda hasta que superes al Minotauro
{const f=daedalusTalk;daedalusTalk=function(){const w=wz();if(w.own||w.got.length<FEATHERS.length||!FEATHERS.length)return f.apply(this,arguments);w.ready=1;save();
  vmS('Δ','Dédalo','Arquitecto ateniense, prisionero del rey Minos · personaje mítico','<p>¡Siete! Ya están cosidas con hilo de lino y pegadas con cera. Pero no podemos salir volando desde aquí: los muros son altos y el techo nos encierra.</p><p>La única sala abierta al cielo es la del centro, donde vive Asterión, el Minotauro. Ahí brilla ahora una luz roja: un portal. Crúzalo, aguanta a la bestia y vuelve a la sala. Allí te esperaré con las alas.</p>',[['Voy al centro del laberinto',()=>closeDialog(),'quiz']]);};}
// ---- la leyenda del Minotauro (al estilo de los portales, como el león de Nemea)
LEY_ROOMS.push('minotauro');
LEG.minotauro=Object.assign({},LEG.leon,{title:()=>'El Minotauro',
  rule:'Asterión acecha entre los muros; cuando <b>baja los cuernos y brama</b>, va a embestir en línea recta: apártate de lado o para el golpe con el escudo. Cada 4 orbes embiste más a menudo.',
  lose:'Asterión te ha derribado tres veces.',
  win:'«Veinte orbes. Asterión, cansado de embestir al aire, se sienta entre los huesos y resopla. Ya no da tanto miedo: parece lo que es, alguien encerrado desde niño en un sitio del que no sabe salir. Nadie ha tenido que matarlo.» Vuelve a la sala del centro: Dédalo te espera con las alas.',
  myth:'<p class="sub">En el mito, el Minotauro, al que llamaban Asterión, era hijo de Pasífae, la mujer del rey Minos, y de un toro enviado por Poseidón (Apolodoro III 1,3-4). Minos lo encerró en el laberinto que construyó Dédalo y lo alimentaba con los jóvenes que Atenas enviaba como tributo. Teseo lo mató con ayuda del ovillo de Ariadna (Apolodoro, Epítome I 7-9; Plutarco, Teseo 15-19), y Dédalo y su hijo Ícaro huyeron de Creta con alas de plumas y cera (Ovidio, Metamorfosis VIII 183-235). Aquí no muere nadie: esquiva, para con el escudo y reúne los orbes.</p>',
  build(){const R=legArena('minotauro','#6e604c','#4a3f34');const g=R.g,m=new THREE.MeshPhongMaterial({color:'#8a745c',shininess:4});
    for(let i=0;i<22;i++){if(i%5===2)continue;const a=i/22*TAU,b=(i+1)/22*TAU,x=Math.cos((a+b)/2)*(LEY_RA+1.2),z=Math.sin((a+b)/2)*(LEY_RA+1.2),w=new THREE.Mesh(new THREE.BoxGeometry(4.6,5.2,0.6),m);w.position.set(x,2.6,z);w.rotation.y=-(a+b)/2+Math.PI/2;w.castShadow=w.receiveShadow=true;g.add(w);}
    for(let i=0;i<16;i++){const a=Math.random()*TAU,r=LEY_RA+5+Math.random()*12,w=new THREE.Mesh(new THREE.BoxGeometry(5+Math.random()*5,5.2,0.6),m);w.position.set(Math.cos(a)*r,2.6,Math.sin(a)*r);w.rotation.y=Math.random()<0.5?0:Math.PI/2;g.add(w);}   // más muros, como un laberinto sin fin
    const bm=lam('#e9e1cf');for(let k=0;k<18;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.3+Math.random()*0.4,0.07,0.07),bm);b.position.set((Math.random()-0.5)*20,0.05,(Math.random()-0.5)*20);b.rotation.y=Math.random()*3;g.add(b);}
    INT2_ZN.minotauro=['El centro del laberinto','ΛΑΒΥΡΙΝΘΟΣ','Leyenda · Apolodoro, Epítome I 7-9'];return R;},
  mk(R){const g=makePerson({chiton:'#3a2a20',skin:'#4a3426',hair:'#2a1a12',short:true,noHimation:true,noVary:true});g.scale.setScalar(1.35);
    const hd=new THREE.Group();hd.position.set(0,1.86,0.04);g.add(hd);const hm=lam('#3a281c');box(0.34,0.36,0.42,hm,0,0,0,hd);box(0.26,0.22,0.24,lam('#2a1d14'),0,-0.08,0.27,hd);
    for(const s of[-1,1]){const h=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.42,6),lam('#e9e0cc'));h.position.set(s*0.27,0.2,0);h.rotation.z=-s*1.1;hd.add(h);}
    for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(0.03,6,4),new THREE.MeshBasicMaterial({color:0xff6a2a}));e.position.set(s*0.09,0.05,0.215);hd.add(e);}
    g.traverse(o=>{if(o.isMesh)o.castShadow=true;});R.g.add(g);this.head=hd;return {g,legs:[],body:new THREE.Object3D()};},
  tick(dt,t,act){LEG.leon.tick.call(this,dt,t,act);const A=this;if(LEY.extra&&LEY.extra.indexOf('León')>=0){LEY.extra=LEY.extra.replace('León','Asterión');try{leyHud();}catch(e){}}if(!A.lion||!A.head)return;const want=A.rested?0.5:A.st==='agazapa'?0.75:A.st==='embiste'?0.55:A.st==='jadea'?0.25:0;A.head.rotation.x+=(want-A.head.rotation.x)*Math.min(1,dt*8);
    if(A.lion.g.userData.arms){const a=A.lion.g.userData.arms,sw=A.st==='embiste'?Math.sin(t*16)*0.8:Math.sin(t*1.7)*0.15;a[0].rotation.x=-0.3+sw;a[1].rotation.x=-0.3-sw;}},
  end(){this.rested=true;LEY.extra='<span>Asterión: descansa</span>';const z=leyz();z.mino=1;save();KNOS.slain=true;try{qAdd('ar',1,'Has aguantado las embestidas del Minotauro.');}catch(e){}}});
{const f=legStart;legStart=function(){const r=f.apply(this,arguments);try{if(LEY.kind==='minotauro')LEY.extra='<span>Asterión: acecha</span>';}catch(e){}return r;};}
// ---- de vuelta en la sala: Dédalo trae las alas y huyes volando
function mntBackTick(){if(MODE!=='atenas'||!KNOS.on||INT2.in||INT2.busy||ui!=='play'||!leyz().mino||MNT.fled)return;const M2=KNOS.maze;if(!M2||Math.hypot(player.x-M2.cx,player.z-M2.cz)>12)return;
  if(MNT.back)return;MNT.back=true;MNT.backT=0.9;}
function mntBackShow(){if(ui!=='play'||!KNOS.on){MNT.back=false;return;}{const w=wz(),first=!w.own;
    vmS('Δ','Dédalo','Con Ícaro, en la sala abierta al cielo','<p>'+(first?'Has vuelto, y entero. Mira: aquí están tus alas. Escúchame bien, como se lo digo a Ícaro cada día: no vueles demasiado bajo, que la humedad del mar pesa en las plumas, ni demasiado alto, que el sol derrite la cera. Por el camino de en medio.':'Ya tienes tus alas. Esta sala está abierta al cielo: desde aquí podemos salir.')+'</p><p>Ícaro ya se ha puesto las suyas y mira hacia arriba, impaciente. Minos es dueño de la tierra y del mar, pero no del aire.</p>',
      [['Ponerte las alas y huir volando',()=>{if(first){w.own=true;w.q='done';w.ready=1;try{qAdd('kl',2,'Dicen que has volado como Dédalo.');}catch(e){}save();try{wingsRefresh();updateStats();}catch(e){}}closeDialog();mntFlee();},'quiz'],['Todavía no',()=>{closeDialog();MNT.back=false;MNT.backWait=1;}]]);}}
{const f=toggleWings;toggleWings=function(){if(MODE==='atenas'&&KNOS.on&&leyz().mino&&wz().own&&!MNT.fled&&inMaze(player.x,player.z)){mntFlee();return;}return f.apply(this,arguments);};}
function mntFlee(){if(MNT.fled)return;MNT.fled=true;knossosTravel('cnosos');MNT.fleeT=3.6;
  try{const v=$('voyage');v.querySelector('.vt').textContent='Huyes volando';v.querySelector('.vs').textContent='Despliegas las alas y te elevas por la sala abierta del centro, por encima de los muros del laberinto y de los tejados rojos del palacio. Dédalo vuela delante; Ícaro, feliz, sube cada vez más alto…';
    v.querySelector('.vf').textContent='Ovidio, Metamorfosis VIII 183-235: Ícaro se acercó demasiado al sol, la cera se fundió y cayó al mar que lleva su nombre. Tú despiertas junto a las ruinas de Cnosos.';}catch(e){}}
function mntFleeEnd(){MNT.fled=false;MNT.back=false;try{const E=EPISODES.find(e=>e.id==='cnosos');if(E)epiReward(E);}catch(e){}const z=leyz();if(!z.open){z.open=1;save();MNT.msg=true;}}
// ---- el aviso: se han abierto los portales (en Roma, al superar a Caco)
{const f=legWin;legWin=function(){const k=LEY.kind,r=f.apply(this,arguments);try{if(leyRo()&&k==='caco'){const z=leyz();if(!z.open){z.open=1;save();MNT.msg=true;}}}catch(e){}return r;};}
function mntMsg(){try{momento('logro','Los portales de leyenda','se han abierto por el mundo');}catch(e){}MNT.msgT=2.2;}
function mntMsgShow(){const ro=leyRo();{vmS('Ν',ro?'Victoria':'Niké','Se abren los portales de leyenda',(ro?'<p>«Has vencido el miedo en la cueva de Caco. Ahora el portal del Foro Boario, junto al templo de Hércules Vencedor, te lleva también a los trabajos de Hércules: la Hidra de Lerna, las aves del Estínfalo y el león de Nemea.»</p><p>«Y en Apulia, en la ciudad que fundó un viejo héroe griego, te espera otro portal: <b>Diomedes en Argiripa</b>.»</p>':
    '<p>«Has salido del laberinto. Desde ahora, los portales de leyenda están repartidos por el mundo, cada uno donde ocurrió su mito:»</p><p>· <b>La Hidra</b>, en las fuentes de Lerna.<br>· <b>Las aves</b>, en el lago Estínfalo, en Arcadia.<br>· <b>El león</b>, en el valle de Nemea.<br>· <b>La hazaña de Diomedes</b>, en la llanura de Troya.</p>')+
    '<p class="sub">Busca la luz roja al llegar a cada lugar. Puedes volver a cualquiera para batir tu récord.</p>',[['¡A buscarlos!',()=>closeDialog(),'quiz']]);}}
// ---- cada poco
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(state&&ui!=='start'){if(MNT.fleeT>0&&(MNT.fleeT-=dt)<=0)mntFleeEnd();if(MNT.backT>0&&(MNT.backT-=dt)<=0)mntBackShow();if(MNT.msgT>0&&ui==='play'&&(MNT.msgT-=dt)<=0)mntMsgShow();MNT.t-=dt;if(MNT.t<=0){MNT.t=1;leyOpen();leyDestTick();mntDoorTick();if(MNT.backWait&&KNOS.maze&&Math.hypot(player.x-KNOS.maze.cx,player.z-KNOS.maze.cz)>14)MNT.backWait=0;if(!MNT.backWait)mntBackTick();
  if(MNT.msg&&ui==='play'&&!INT2.busy){MNT.msg=false;mntMsg();}}}}catch(e){if(!MNT.err){MNT.err=1;console.warn('mnt',e);}}return r;};}
