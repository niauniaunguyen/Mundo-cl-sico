// ============================================================ DÉDALO, EL TALLER DE HEFESTO Y EL NUEVO TALOS (modo Atenas) (28/11)
// Una misión inventada para el juego con piezas de mitos reales (se dice en los textos):
//  1. Tras escapar del laberinto de Cnosos con las alas, Dédalo aparece escondido en Creta, junto a la llegada. Quiere rehacer a Talos,
//     el gigante de bronce que Hefesto regaló a Minos para guardar la isla, y te pide que visites el taller del dios.
//  2. En Lemnos, en una cueva junto al mar, no está Hefesto: están Eurínome y Tetis, las diosas del mar que lo recogieron cuando Hera lo
//     arrojó del Olimpo (Ilíada XVIII 394-405). Te mandan a preguntar a sus compañeros de trabajo.
//  3. La cueva es un portal a otro mapa: el taller (Ilíada XVIII 369-477: los veinte fuelles, los trípodes con ruedas de oro que se
//     mueven solos, las sirvientas de oro que piensan y hablan) con los Cíclopes que lo ayudan (Calímaco, Himno a Ártemis 46-86;
//     Virgilio, Eneida VIII 416-453). Brontes cuenta que Hefesto ha ido a llevarle a Ártemis un arco y unas flechas nuevas, que le
//     encargó, a su santuario del lago Estínfalo (Pausanias VIII 22.7), y no ha vuelto.
//  4. En el Estínfalo, las aves de plumas de bronce le han robado las flechas: se entra en su portal de leyenda y, al ganar, aparece
//     Hefesto, que te lleva a su taller.
//  5. Vuelves con Dédalo, le describes el taller y te regala un Talos nuevo, con un refuerzo en el clavo del tobillo (su punto débil:
//     Apolonio de Rodas IV 1638-1688; Apolodoro I 9.26). En los portales de leyenda aparece a tu lado y se interpone tres veces entre tú
//     y los proyectiles enemigos.
const TAL={dae:null,lem:null,ws:null,n:0,g:null,hud:null,won:false,shownT:0};
function talz(){if(!state.talos||typeof state.talos!=='object')state.talos={st:0};return state.talos;}
function talReg(){try{return islandOf(player.x);}catch(e){return null;}}
const TAL_LOOK={dae:{noVary:true,chiton:'#cdbf9f',himation:'#5a4a3a',beard:true,hair:'#bdb6aa',beardC:'#cfc8bc',staff:true},
 tetis:{female:true,chiton:'#bfe0e8',himation:'#4f8a9a',hair:'#3a2a1e'},euri:{female:true,chiton:'#d8e8d0',himation:'#2f6a6a',hair:'#5a4a3a'},
 hef:{chiton:'#6a4a32',short:true,noHimation:true,beard:true,hair:'#3a2a1e',staff:true}};
function talPerson(look,x,z,a,name,sub,act){const g=makePerson(look);g.position.set(x,floorAt(x,z),z);g.rotation.y=a||0;scene.add(g);addCirc(x,z,0.5);const o=egxObj(x,z,undefined,act,name,sub,3);return{g,o};}
// ---------------- 1 y 5: Dédalo en Creta
function talDaedalus(){if(TAL.dae||MODE!=='atenas'||typeof wz!=='function'||wz().q!=='done')return;const I=ISLANDS.find(q=>q.id==='creta');if(!I)return;const A=I.arrive||(Array.isArray(I.port)?{x:I.port[0],z:I.port[1]}:null)||{x:I.x,z:I.z};   // Creta guarda su puerto como [x, z]if(!I.mesh)return;
  const f=findFree(A.x+18,A.z-14,1);TAL.dae=talPerson(TAL_LOOK.dae,f[0],f[1],-Math.PI/2,'Dédalo','escondido en Creta',()=>talDaeTalk());
  box(1.8,0.9,0.9,lam('#7a5a3a'),f[0]+1.6,floorAt(f[0],f[1])+0.45,f[1]+1.2);}
function talDaeTalk(){const z=talz();
  if(z.st===0){vmS('Δ','Dédalo','escondido en Creta','<p>«¡Tú! El que salió volando conmigo del laberinto. Minos me busca por toda la isla, así que me escondo aquí, entre pescadores. Pero no estoy ocioso.</p><p>»¿Sabes quién guarda esta isla? Talos, un gigante de bronce que da tres vueltas a Creta cada día y apedrea los barcos que se acercan. Se lo regaló Hefesto a Minos. Tiene una sola vena, que le va del cuello al tobillo, cerrada abajo con un clavo de bronce: si alguien quita el clavo, Talos se vacía como un odre.</p><p>»Quiero hacer uno mejor, uno que no tenga ese punto débil. Pero para eso necesito saber cómo trabaja Hefesto. Ve a su taller, en Lemnos, la isla donde cayó cuando lo arrojaron del Olimpo, y cuéntame lo que veas».</p><p class="src">Apolodoro I 9.26; Apolonio de Rodas IV 1638-1688</p>',
    [['Iré a Lemnos',()=>{z.st=1;save();closeDialog();toast('<span class="label">El taller de Hefesto</span><br>Viaja a Lemnos (por mar, desde el Pireo) y busca la cueva junto al mar.');}],vmBye]);return;}
  if(z.st<5){vmS('Δ','Dédalo','escondido en Creta','<p>«¿Ya has visto el taller? No me cuentes cuentos de marineros: quiero saber cómo es de verdad».</p>',[vmBye]);return;}
  if(z.st===5){talQuiz(0,0);return;}
  vmS('Δ','Dédalo','escondido en Creta','<p>«¿Qué tal se porta Talos? Ni una flecha en el tobillo, espero. Lo reforcé con una abrazadera de bronce: el clavo no se sale ni aunque tire Medea en persona».</p>',[vmBye]);}
const TAL_Q=[['¿Quién ayuda a Hefesto a moverse por el taller, porque cojea?',['Unas sirvientas de oro que parecen muchachas vivas, y piensan y hablan','Dos esclavos tracios','Un caballo de bronce'],0],
 ['¿Qué tienen los trípodes del taller?',['Ruedas de oro: van solos a la asamblea de los dioses y vuelven','Patas de león','Fuego dentro'],0],
 ['¿Cuántos fuelles soplan en las fraguas?',['Veinte','Dos','Siete'],0],
 ['¿Quién trabaja en los yunques con él?',['Los Cíclopes, que tienen un solo ojo','Los Gigantes','Los Titanes'],0]];
function talQuiz(i,ok){if(i>=TAL_Q.length){if(ok>=3){const z=talz();z.st=6;z.got=1;save();if(typeof sfxCoin==='function')sfxCoin();
      vmS('Δ','Dédalo','escondido en Creta','<p>«¡Eso es! Sirvientas de oro… trípodes que andan solos… Ya sé cómo darle movimiento sin que se le acabe la vida por una vena».</p><p>Al cabo de unos días, Dédalo te enseña su obra: un Talos más pequeño, a tu medida, de bronce bruñido. En el tobillo, el clavo está sujeto con una abrazadera doble. «Te acompañará cuando entres en los portales de leyenda. Se pondrá delante de lo que te lancen: tres veces, y luego necesitará descansar. No es un dios: es un buen trabajo».</p><p class="sub">Este Talos es inventado para el juego. En el mito, el único Talos es el gigante de Minos, al que mataron los argonautas al volver de la Cólquide.</p>',[['Gracias, Dédalo',()=>{closeDialog();toast('<span class="label">Talos</span><br>Desde ahora, en los portales de leyenda, Talos te protege de tres proyectiles en cada intento.');}]]);}
    else vmS('Δ','Dédalo','escondido en Creta','<p>«Hmm. No me cuadra. ¿Seguro que has estado dentro? Vuelve a mirarlo bien y cuéntamelo otra vez».</p>',[vmBye]);return;}
  const Q=TAL_Q[i],ord=[0,1,2].sort(()=>Math.random()-0.5);vmS('Δ','Dédalo','«cuéntame el taller»','<p>«'+Q[0]+'»</p>',ord.map(k=>[Q[1][k],()=>talQuiz(i+1,ok+(k===Q[2]?1:0))]));}
// ---------------- 2: Eurínome y Tetis en Lemnos
function talLemnos(){if(TAL.lem||MODE!=='atenas'||talz().st<1)return;const I=ISLANDS.find(q=>q.id==='lemnos');if(!I||!I.arrive)return;
  const sh=shoreAlong(I.x-80,I.z+120,0,1,I.R*1.4),cx=sh[0],cz=sh[1]-26;const c=caveMouth(cx,cz,Math.PI);
  const T=talPerson(TAL_LOOK.tetis,cx-4,cz+8,Math.PI,'Tetis','nereida, madre de Aquiles',()=>talSeaTalk()),E=talPerson(TAL_LOOK.euri,cx+4,cz+8,Math.PI,'Eurínome','hija del Océano',()=>talSeaTalk());
  const door=egxObj(cx,cz+2.5,undefined,()=>talCave(),'La cueva del taller','entrar',3);TAL.lem={T,E,door,x:cx,z:cz};
  place('lemnos_cueva','La cueva de las diosas del mar','ΣΠΕΟΣ','En la Ilíada, Hefesto recuerda que, cuando su madre Hera lo arrojó del Olimpo porque había nacido cojo, lo recogieron en el mar Eurínome, hija del Océano, y Tetis; durante nueve años vivió escondido con ellas en una cueva hueca, mientras el Océano rugía fuera, y les hacía broches, pulseras y collares. En el juego, la cueva está en Lemnos, la isla donde cayó la otra vez, cuando lo arrojó Zeus.\n(Ilíada XVIII 394-405 y I 590-594)',cx+9,cz+12,0);}
function talSeaTalk(){const z=talz();
  if(z.st===1){vmS('Θ','Tetis y Eurínome','las diosas que salvaron a Hefesto','<p>Tetis: «¿Buscas a Hefesto? No está. Hace días que no oímos el martillo».</p><p>Eurínome: «Cuando su madre lo tiró del cielo, cojo y pequeño, nosotras lo recogimos del mar y lo tuvimos nueve años en esta cueva. Nos hacía joyas con conchas y oro. Ahora tiene ayudantes: entra y pregunta a sus compañeros de trabajo; ellos sabrán dónde ha ido».</p>',[['Entrar en la cueva',()=>{z.st=2;save();closeDialog();talCave();}],vmBye]);return;}
  vmS('Θ','Tetis y Eurínome','las diosas que salvaron a Hefesto','<p>«'+(z.st>=4?'Ya ha vuelto: lo oímos martillear otra vez. Gracias por ayudarlo.':'Pregunta dentro, a los del yunque.')+'»</p>',[vmBye]);}
function talCave(){const z=talz();if(z.st<2){toast('Habla primero con las diosas.');return;}const W=talWorkshop();egxTeleport(W.x,W.z+26,W.Y,0,'<span class="label">El taller de Hefesto</span><br>El calor te golpea la cara. Se oye el rugido de los fuelles y el golpe de los martillos.');}
// ---------------- 3: el taller (otro mapa, a 900 m de altura sobre Lemnos)
function talWorkshop(){if(TAL.ws)return TAL.ws;const I=ISLANDS.find(q=>q.id==='lemnos'),X=I.x+200,Z=I.z-200,Y=900,W={x:X,z:Z,Y,trip:[],maids:[],cyc:[],fires:[],hef:null};TAL.ws=W;
  const rock=new THREE.MeshLambertMaterial({color:'#4a3a32',emissive:'#1a0c06',side:THREE.BackSide}),floor=new THREE.MeshLambertMaterial({color:'#3a2e28',emissive:'#140804'}),bronze=new THREE.MeshLambertMaterial({color:'#b07a3a',emissive:'#3a1e08'}),gold=new THREE.MeshLambertMaterial({color:'#e0b050',emissive:'#5a3a10'});
  const g=grp(X,Y,Z,0),R=40;
  const d=new THREE.Mesh(new THREE.SphereGeometry(R,32,16,0,TAU,0,Math.PI/2),rock);d.scale.y=0.55;g.add(d);box(R*2,1,R*2,floor,0,-0.5,0,g);addPlat(X,Z,R*2,R*2,0,Y);
  for(let i=0;i<48;i++){const a=i/48*TAU,b=(i+1)/48*TAU;addSeg(X+Math.cos(a)*(R-1.5),Z+Math.sin(a)*(R-1.5),X+Math.cos(b)*(R-1.5),Z+Math.sin(b)*(R-1.5),0.5);}
  // el río de lava y las fraguas
  const lava=new THREE.MeshBasicMaterial({color:'#ff6a20'});{const m=new THREE.Mesh(new THREE.PlaneGeometry(4,60),lava);m.rotation.x=-Math.PI/2;m.position.set(X-22,Y+0.05,Z);scene.add(m);W.lava=m;addBox(X-22,Z,4,60,0);}
  for(const[fx,fz]of[[-12,-14],[0,-20],[12,-14]]){box(5,3,4,new THREE.MeshLambertMaterial({color:'#2a2420',emissive:'#100806'}),fx,1.5,fz,g);addBox(X+fx,Z+fz,5,4,0);const f=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,color:'#ff9040'}));f.scale.set(4,4,1);f.position.set(X+fx,Y+3.6,Z+fz);scene.add(f);W.fires.push(f);
    box(2.2,1,1.2,bronze,fx,1,fz+4,g);addBox(X+fx,Z+fz+4,2.2,1.2,0);}
  // los veinte fuelles, en fila contra la pared
  for(let i=0;i<20;i++){const a=Math.PI*0.15+i/19*Math.PI*0.7,x=Math.cos(a)*(R-5),z=-Math.sin(a)*(R-5)*0.95;const b=new THREE.Mesh(new THREE.SphereGeometry(0.9,10,8),new THREE.MeshLambertMaterial({color:'#5a3a26',emissive:'#140804'}));b.scale.set(1,0.55,1.5);b.position.set(X+x,Y+0.8,Z+z);b.rotation.y=-a;scene.add(b);W.fires.push({bel:b,ph:i});addCirc(X+x,Z+z,1);}
  // los trípodes de oro con ruedas, que van y vienen solos
  for(let i=0;i<20;i++){const t=new THREE.Group();for(let k=0;k<3;k++){const l=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,1.4,5),gold);const a=k/3*TAU;l.position.set(Math.cos(a)*0.4,0.7,Math.sin(a)*0.4);l.rotation.set(Math.sin(a)*0.2,0,-Math.cos(a)*0.2);t.add(l);const w=new THREE.Mesh(new THREE.TorusGeometry(0.15,0.04,5,10),gold);w.position.set(Math.cos(a)*0.5,0.15,Math.sin(a)*0.5);w.rotation.y=a;t.add(w);}
    const bowl=new THREE.Mesh(new THREE.SphereGeometry(0.6,12,8,0,TAU,Math.PI/2,Math.PI/2),gold);bowl.position.y=1.5;t.add(bowl);scene.add(t);W.trip.push({g:t,ph:i/20*TAU,r:14+(i%3)*4});}
  // las sirvientas de oro (Ilíada XVIII 417-420)
  for(let i=0;i<3;i++){const p=makePerson({female:true,chiton:'#e0b050',himation:'#e0b050',hair:'#e0b050',noVary:true});p.traverse(o=>{if(o.isMesh)o.material=gold;});scene.add(p);W.maids.push({g:p,ph:i*2});}
  // los Cíclopes en los yunques
  const nm=['Brontes','Estéropes','Arges'];[[-12,-8],[0,-14],[12,-8]].forEach(([cx,cz],i)=>{let p;try{p=bestOneEye(bestHuman('obrero',{chiton:'#2a201a'},2.4),1.55);}catch(e){p=makePerson({chiton:'#2a201a',short:true,noHimation:true});p.scale.setScalar(2.4);}
    p.position.set(X+cx,Y,Z+cz);p.rotation.y=Math.PI;scene.add(p);addCirc(X+cx,Z+cz,1.2);W.cyc.push({g:p,ph:i});
    egxObj(X+cx,Z+cz+2.5,Y,()=>talCycTalk(nm[i]),nm[i],'Cíclope de la fragua',3.5);});
  // Hefesto, si ya ha vuelto
  W.hefSpot=[X+6,Z-2];talHefVis();
  // la salida
  {const door=new THREE.Mesh(new THREE.PlaneGeometry(6,9),new THREE.MeshBasicMaterial({color:'#ffd090',transparent:true,opacity:0.5,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));door.position.set(X,Y+4.5,Z+R-2);scene.add(door);
   egxObj(X,Z+R-5,Y,()=>talLeave(),'Salir de la cueva','vuelta a Lemnos',3);}
  for(const[k,dx,dz]of[['ws_fuelles',0,-34],['ws_tripodes',14,0],['ws_sirvientas',-6,6],['ws_ciclopes',0,-14],['ws_lava',-22,0]])try{atReg(X+dx,Z+dz,Y+1.5,k,8);}catch(e){}
  return W;}
function talHefVis(){const W=TAL.ws;if(!W)return;const z=talz();if(z.st>=4&&!W.hef){const[x,z2]=W.hefSpot;W.hef=talPerson(TAL_LOOK.hef,x,z2,Math.PI,'Hefesto','el dios herrero',()=>talHefTalk());W.hef.g.position.y=W.Y;W.hef.o.y=W.Y;}}
function talLeave(){const L=TAL.lem;if(!L)return;egxTeleport(L.x,L.z+6,undefined,0,'Sales a la luz de Lemnos. El mar huele a sal después del humo.');}
function talCycTalk(n){const z=talz();
  if(z.st<=2){z.st=3;save();vmS('Κ',n,'Cíclope de la fragua','<p>«¿Hefesto? Se fue hace cinco días. Ártemis le encargó un arco nuevo y un carcaj de flechas que no fallen, y se los fue a llevar él mismo a su santuario del lago Estínfalo, en Arcadia. Tenía que volver al día siguiente, y aquí no ha vuelto. Esas aves de plumas de bronce que anidan en el lago… no me fío».</p><p class="sub">Calímaco cuenta que fueron los Cíclopes, en su fragua de Lípari, los que hicieron el arco y las flechas de Ártemis. El santuario de Ártemis en Estínfalo, con las aves en el tejado, lo describe Pausanias. El encargo y el robo son inventados.</p><p class="src">Calímaco, Himno a Ártemis 46-86; Pausanias VIII 22.7</p>',
    [['Iré al Estínfalo',()=>{closeDialog();toast('<span class="label">Las flechas de Ártemis</span><br>Ve al lago Estínfalo, en Arcadia. Busca allí el rastro de Hefesto.');}],vmBye]);return;}
  const say={Brontes:'«Yo soy el trueno, Estéropes el relámpago, Arges el rayo. Así nos llama Hesíodo. Forjamos el rayo de Zeus».',Estéropes:'«Los trípodes van solos a las asambleas de los dioses y vuelven. Las sirvientas de oro piensan y hablan: las hizo él».',Arges:'«Veinte fuelles soplan a la vez, fuerte o suave, según lo que pide el metal».'}[n];
  vmS('Κ',n,'Cíclope de la fragua','<p>'+say+'</p>'+(z.st===3?'<p>«Ve al Estínfalo, rápido».</p>':''),[vmBye]);}
function talHefTalk(){vmS('Η','Hefesto','el dios herrero','<p>«Bienvenido a mi casa. Aquí hago lo que me piden los dioses: el rayo de Zeus, el carro del Sol, las armas de Aquiles… y, cuando me dejan, cosas para mí: estas sirvientas que me ayudan a andar, los trípodes que van solos. Si quieres contárselo a Dédalo, cuéntaselo: ese ateniense es lo más parecido a un dios que he conocido con un martillo».</p><p class="src">Ilíada XVIII 369-477</p>',[vmBye]);}
// ---------------- 4: el Estínfalo
function talStym(){if(TAL.sty||MODE!=='atenas'||talz().st!==3)return;const I=ISLANDS.find(q=>q.id==='estinfalo');if(!I||!I.arrive)return;const f=findFree(I.arrive.x+24,I.arrive.z+10,1);
  const g=new THREE.Group();for(let i=0;i<6;i++){const fe=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.6,4),new THREE.MeshLambertMaterial({color:'#b07a3a',emissive:'#301806'}));fe.rotation.set(1.4,i,0.3);fe.position.set((i%3-1)*0.5,0.05,(i<3?0:0.5));g.add(fe);}g.position.set(f[0],floorAt(f[0],f[1]),f[1]);scene.add(g);
  TAL.sty={g,o:egxObj(f[0],f[1],undefined,()=>talStymGo(),'Plumas de bronce y un carcaj roto','el rastro de Hefesto',3)};}
function talStymGo(){vmS('🪶','El rastro de Hefesto','junto al lago','<p>En el barro, plumas de bronce afiladas como cuchillos, un carcaj vacío con adornos de plata y unas huellas desiguales, de alguien que cojea. Las aves se han llevado las flechas de Ártemis. Desde el lago llegan sus chillidos metálicos.</p>',[['Entrar en el portal de las aves',()=>{closeDialog();TAL.quest=true;const P=player,o={id:'ley',room:'aves',_go:true,x:P.x,z:P.z,a:player.yaw+Math.PI,y:floorAt(P.x,P.z)};int2Enter(o);}],vmBye]);}
{const f=legWin;legWin=function(){const r=f.apply(this,arguments);try{if(TAL.quest&&LEY.kind==='aves'&&talz().st===3){talz().st=4;save();TAL.hefPending=true;}}catch(e){}return r;};}
{const f=int2Leave;int2Leave=function(){const r=f.apply(this,arguments);try{if(TAL.hefPending){TAL.hefPending=false;TAL.quest=false;setTimeout(()=>talHefMeet(),1600);}}catch(e){}return r;};}
function talHefMeet(){vmS('Η','Hefesto','el dios herrero, cubierto de barro','<p>Entre los juncos aparece un hombre bajo, de brazos enormes y piernas torcidas, apoyado en un bastón: Hefesto. Lleva bajo el brazo las flechas de plata que has recuperado.</p><p>«Las aves me las quitaron de las manos mientras cruzaba el lago, y con esta pierna no hay quien las persiga. Gracias. Ártemis no es paciente. Ven: te enseñaré mi casa».</p>',[['Ir con Hefesto al taller',()=>{closeDialog();const W=talWorkshop();talHefVis();talz().st=5;save();egxTeleport(W.x+3,W.z+8,W.Y,0,'<span class="label">El taller de Hefesto</span><br>Hefesto te lleva de vuelta a su fragua. Fíjate bien en todo: Dédalo querrá saberlo.');}]]);}
// ---------------- el taller se mueve: trípodes, sirvientas, fuelles, fuego, lava
function talTick(dt){if(MODE!=='atenas')return;const t=(TAL.shownT+=dt);
  if(!TAL.dae)talDaedalus();if(!TAL.lem)talLemnos();if(!TAL.sty)talStym();if(TAL.sty&&talz().st>3){scene.remove(TAL.sty.g);TAL.sty.o.r=0;}
  const W=TAL.ws;if(W&&Math.hypot(player.x-W.x,player.z-W.z)<80&&player.feet>800){
    W.trip.forEach(T=>{const a=T.ph+t*0.15;T.g.position.set(W.x+Math.cos(a)*T.r,W.Y,W.z+Math.sin(a)*T.r*0.7);T.g.rotation.y=-a;});
    W.maids.forEach((M,i)=>{const a=M.ph+t*0.1;M.g.position.set(W.x+6+Math.cos(a)*8,W.Y,W.z+4+Math.sin(a)*6);M.g.rotation.y=-a+Math.PI;});
    for(const F of W.fires){if(F.bel){F.bel.scale.y=0.55+Math.sin(t*3+F.ph)*0.12;}else F.material.opacity=0.7+Math.sin(t*11+F.position.x)*0.25;}
    W.cyc.forEach(C=>{C.g.rotation.x=Math.max(0,Math.sin(t*4+C.ph*2))*0.15;});if(W.lava)W.lava.material.color.setHSL(0.05,1,0.5+Math.sin(t*2)*0.06);}
  talLegTick(dt);}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{talTick(dt);}catch(e){if(!TAL.err){TAL.err=1;console.warn('talos',e);}}return r;};}
// ---------------- Talos en los portales de leyenda: se interpone tres veces
function talOn(){return MODE==='atenas'&&talz().got;}
function talBlock(){if(!talOn()||!LEY.on||TAL.n<=0)return false;TAL.n--;LEY.inv=1.0;TAL.guard=1.2;try{legSfx('clang');}catch(e){}talHud();
  toast(TAL.n>0?'<span class="label">¡Talos!</span><br>Se pone delante y el golpe rebota en su bronce. Puede hacerlo '+TAL.n+' '+(TAL.n===1?'vez':'veces')+' más.':'<span class="label">¡Talos!</span><br>Para el golpe, pero se le ha soltado una placa: ya no podrá protegerte en este intento.');return true;}
{const f=legHurt;legHurt=function(msg){if(talBlock())return;return f.apply(this,arguments);};}
{const f=legStart;legStart=function(){const r=f.apply(this,arguments);try{if(talOn()){TAL.n=3;talSpawn();talHud();}}catch(e){}return r;};}
function talSpawn(){if(!TAL.g){const p=makePerson({chiton:'#8a6a3a',short:true,noHimation:true,hair:'#8a6a3a',noVary:true});const br=new THREE.MeshPhongMaterial({color:'#b0803a',specular:'#ffe0a0',shininess:60,emissive:'#2a1406'});p.traverse(o=>{if(o.isMesh)o.material=br;});p.scale.setScalar(1.35);
    const nail=new THREE.Mesh(new THREE.TorusGeometry(0.09,0.03,6,12),new THREE.MeshPhongMaterial({color:'#e8d080',emissive:'#4a3a10'}));nail.position.set(0.12,0.12,0);nail.rotation.x=Math.PI/2;p.add(nail);TAL.g=p;scene.add(p);}
  TAL.g.visible=true;TAL.g.position.set(player.x+1.5,player.feet,player.z+1.5);}
function talLegTick(dt){if(!TAL.g)return;const on=talOn()&&typeof legIn==='function'&&legIn();TAL.g.visible=on;if(TAL.hud)TAL.hud.style.display=on&&LEY.on?'block':'none';if(!on)return;
  const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw);TAL.guard=Math.max(0,(TAL.guard||0)-dt);
  const tx=TAL.guard>0?player.x+fx*1.6:player.x+rx*1.8-fx*0.8,tz=TAL.guard>0?player.z+fz*1.6:player.z+rz*1.8-fz*0.8;const g=TAL.g;g.position.x+=(tx-g.position.x)*Math.min(1,dt*(TAL.guard>0?12:3));g.position.z+=(tz-g.position.z)*Math.min(1,dt*(TAL.guard>0?12:3));g.position.y=player.feet;g.rotation.y=player.yaw+Math.PI;}
function talHud(){if(!TAL.hud){const d=document.createElement('div');d.id='talHud';d.style.cssText='position:fixed;left:50%;top:96px;transform:translateX(-50%);z-index:31;pointer-events:none;font:600 14px var(--f-body,serif);color:#f0d090;text-shadow:0 1px 2px #000';document.body.appendChild(d);TAL.hud=d;}
  TAL.hud.innerHTML='Talos: '+'⛨'.repeat(Math.max(0,TAL.n))+'<span style="opacity:.35">'+'⛨'.repeat(Math.max(0,3-TAL.n))+'</span>';}
// Modo Atención: el taller
Object.assign(ATX_DEF,{
 ws_fuelles:['Los veinte fuelles','soplan solos','Homero cuenta que Hefesto tiene veinte fuelles que soplan sobre los crisoles, fuerte o suave, según lo que necesita el trabajo.','Homero cuenta que Hefesto tiene veinte fuelles que soplan sobre los crisoles, fuerte o suave, según lo que necesita el trabajo.',1,20],
 ws_tripodes:['Trípodes con ruedas de oro','autómatas','Veinte trípodes con ruedas de oro que van solos a la asamblea de los dioses y vuelven solos a casa (Ilíada XVIII 373-377).','Veinte trípodes con ruedas de oro que van solos a la asamblea de los dioses y vuelven solos a casa (Ilíada XVIII 373-377).',1,20],
 ws_sirvientas:['Las sirvientas de oro','muchachas mecánicas','De oro, como muchachas vivas: tienen inteligencia, voz y fuerza, y ayudan a andar a su amo cojo (Ilíada XVIII 417-420).','De oro, como muchachas vivas: tienen inteligencia, voz y fuerza, y ayudan a andar a su amo cojo (Ilíada XVIII 417-420).',1.5,20],
 ws_ciclopes:['Los Cíclopes de la fragua','Brontes, Estéropes y Arges','Hesíodo los llama trueno, relámpago y rayo; Calímaco y Virgilio los ponen a trabajar en las fraguas de Hefesto.','Virgilio los pone en la fragua de Vulcano, bajo las islas Eolias, forjando el rayo de Júpiter y el escudo de Eneas.',2,25],
 ws_lava:['El río de fuego','bajo el volcán','Los antiguos situaban las fraguas de Hefesto bajo los volcanes: en Lemnos, en el Etna o en las islas Eolias.','Los antiguos situaban las fraguas de Hefesto bajo los volcanes: en Lemnos, en el Etna o en las islas Eolias.',0.2,25]});
