// ============================================================ EL INFRAMUNDO, COMO MAPA (24/11)
// Al terminar la catábasis (254), Caronte te cruza el Aqueronte y llegas a la casa de Hades. Un mapa propio, con sus zonas:
//  · La orilla del Aqueronte: Caronte y su barca; las sombras de los que no fueron enterrados esperan sin poder cruzar
//    (Ilíada XXIII 71-74, Patroclo; Aristófanes, Ranas 137-270, la barca y el óbolo).
//  · La puerta de Hades, con Cerbero, que deja entrar y no salir (Hesíodo, Teogonía 769-773). Aquí, dormido y manso.
//  · El juicio: Minos, Radamantis y Éaco, en la encrucijada de donde salen los dos caminos (Platón, Gorgias 523e-524a, y el mito de Er,
//    República X 614c-d; los dos, de la época de este juego).
//  · Los prados de Asfódelos: las sombras de la mayoría, sin pena ni gloria. Allí, la sombra de Aquiles: «preferiría ser jornalero de un
//    pobre en la tierra que reinar sobre todos los muertos» (Odisea XI 488-491). Y el adivino Tiresias (Odisea XI 90-151).
//  · Los Campos Elíseos / las Islas de los Bienaventurados: luz, prados de rosas, juegos y música (Píndaro, fr. 129; Olímpica II 68-80;
//    Odisea IV 561-569).
//  · Los ríos: Aqueronte, Cocito, Piriflegetonte (de fuego) y Estigia, como en el Fedón (112e-114b); y el Lete, el río del olvido (en el
//    mito de Er, la llanura del Lete y el río Ameles, República X 621a).
//  · El Tártaro: Sísifo con su piedra, Tántalo en el agua que se le escapa (Odisea XI 582-600) y las Danaides con sus jarras agujereadas
//    (Platón, Gorgias 493b; Pausanias X 31,9, en la pintura de Polignoto en Delfos). Las puertas de bronce de los Titanes (Teogonía 726-735).
//  · La mansión de Hades y Perséfone: la sala de los tronos y el granado (Himno homérico a Deméter).
//  · Hermes Psicopompo, el que acompaña a las almas, te lleva de vuelta arriba.
// En Roma, los nombres latinos (Plutón, Proserpina, Mercurio, el Orco); la Eneida VI se cita como anacronismo en el modo Atenas.
const INF={built:false,objs:[],X:0,Z:0,Y:4200,zone:'',people:[]};
function infN(g,l){return MODE==='roma'?l:g;}
function infTalk(glyph,name,title,intro,topics,src){int2Dlg(glyph,name,title,'<p>'+intro+'</p>');const box=$('dOpts');const seen=new Set();
  const render=()=>{box.innerHTML='';let n=1;topics.forEach(([q,a],i)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(n++)+'</span><span>'+q+'</span>';if(seen.has(i))b.className='seen';
      b.onclick=()=>{seen.add(i);$('dBody').innerHTML='<p>'+a+'</p>'+(src?'<p class="sub">'+src+'</p>':'');render();};box.appendChild(b);});
    const c=document.createElement('button');c.innerHTML='<span class="n">'+n+'</span><span>Despedirse</span>';c.onclick=closeDialog;box.appendChild(c);};render();}
function infPerson(kind,cfg,x,z,a,sc,ghost){const g=bestHuman(kind,cfg,sc||1);g.position.set(INF.X+x,INF.Y,INF.Z+z);g.rotation.y=a||0;scene.add(g);
  if(ghost)g.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=0.5;if(o.material.emissive)o.material.emissive=new THREE.Color('#1a2638');}});INF.people.push(g);return g;}
function infObj(x,z,fn,name,sub,r){return egxObj(INF.X+x,INF.Z+z,INF.Y,fn,name,sub,r||3);}
function buildInf(){if(INF.built)return;INF.built=true;const I=ISLANDS[0],X=I.x,Z=I.z+24000,Y=INF.Y;Object.assign(INF,{X,Z});const g=grp(X,Y,Z,0),ro=MODE==='roma';
  const fl=(w,d,col,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),lam(col));m.rotation.x=-Math.PI/2;m.position.set(x,y||0,z);m.receiveShadow=true;g.add(m);return m;};
  fl(520,520,'#25222a',0,0,0);addPlat(X,Z,520,520,0,Y);
  // la bóveda: rocas alrededor
  const rm=lam('#2e2a32');for(let i=0;i<70;i++){const a=i/70*TAU,r=240+Math.random()*25,s=12+Math.random()*18,k=new THREE.Mesh(new THREE.DodecahedronGeometry(s,1),rm);k.position.set(Math.cos(a)*r,s*0.6,Math.sin(a)*r);k.scale.y=1.5+Math.random()*2;g.add(k);}
  for(let i=0;i<48;i++){const a=i/48*TAU,b=(i+1)/48*TAU;addSeg(X+Math.cos(a)*232,Z+Math.sin(a)*232,X+Math.cos(b)*232,Z+Math.sin(b)*232,0.5);}
  const glow=(x,z,col,s,y)=>{const f=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:col,transparent:true,opacity:0.6,blending:THREE.AdditiveBlending,depthWrite:false}));f.scale.set(s,s*1.4,1);f.position.set(x,y||s*0.5,z);g.add(f);return f;};
  const river=(x,z,w,d,col,emis)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshPhongMaterial({color:col,shininess:90,emissive:new THREE.Color(emis||'#000000')}));m.rotation.x=-Math.PI/2;m.position.set(x,0.06,z);g.add(m);return m;};
  // ---- orilla del Aqueronte (sur) y el río
  river(0,165,460,26,'#1d2f3a');fl(80,40,'#3a3630',0,200,0.03);
  const boat=new THREE.Group();boat.position.set(-12,0.2,168);g.add(boat);const bw=lam('#3a2a1e');const hull=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.7,8),bw);hull.position.y=0.3;boat.add(hull);const pr=new THREE.Mesh(new THREE.ConeGeometry(1.2,2.2,4),bw);pr.rotation.x=Math.PI/2;pr.position.set(0,0.3,5);boat.add(pr);
  const char=infPerson('obrero',{chiton:'#4a4440'},-12,163,Math.PI,1.05);const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,4.5,6),bw);pole.position.set(INF.X-11.3,INF.Y+1.8,INF.Z+163);pole.rotation.z=0.3;scene.add(pole);
  infObj(-12,160,()=>infTalk('Χ',infN('Caronte','Charon'),'El barquero del Aqueronte','«Te he traído gratis, cosa que no hago nunca. Los demás me pagan un óbolo, el que les ponen en la boca al enterarlos.»',[
    ['¿Por qué un óbolo?','«Sin óbolo no hay barca. Y sin entierro, tampoco: los que se quedan sin enterrar vagan por esta orilla cien años», gruñe. En las Ranas de Aristófanes (del 405 a.C.), Caronte cobra dos óbolos a Dioniso y le hace remar.'],
    ['¿Quiénes son esas sombras de la orilla?','«Los que nadie enterró. Patroclo se le apareció en sueños a Aquiles para pedirle que lo enterrara cuanto antes y así poder cruzar.» (Ilíada XXIII 71-74)'],
    ['¿Puedo volver arriba?','«Pocos vivos han bajado: Heracles, Orfeo, Teseo… y tú. Habla con Hermes, el que acompaña a las almas: él sabe el camino.»']],'Aristófanes, Ranas 137-270; Ilíada XXIII 71-74.'),infN('Caronte','Charon'),'el barquero');
  for(let i=0;i<9;i++){const s=infPerson(i%2?'mujer':'ciudadano',{chiton:'#9aa0b0'},-60+i*14,190+Math.sin(i)*6,Math.PI,1,true);}
  infObj(30,196,()=>infTalk('Σ','Las sombras de la orilla','sin poder cruzar','Unas sombras pálidas te miran sin hablar. Una se acerca: «¿Eres de arriba? Si ves a mi familia, diles que me entierren, aunque sea con un puñado de tierra, como hizo Antígona con su hermano.»',[['¿Por qué importa tanto el entierro?','Para los griegos, quien no recibía los ritos funerarios no podía descansar. Por eso Antígona, en la tragedia de Sófocles, desobedece al rey para echar tierra sobre el cuerpo de su hermano Polinices.']],'Sófocles, Antígona.'),'Las sombras','esperan en la orilla');
  // ---- Hermes, para volver
  const her=infPerson('ciudadano',{chiton:'#d8c8a0',himation:'#6a4a8a'},18,175,Math.PI,1);glow(18,175,'#ffe8a0',2.2,2.2);
  infObj(18,172,()=>{infTalk('Ἑ',infN('Hermes Psicopompo','Mercurio'),'el que acompaña a las almas','«¿Quieres volver arriba? Yo bajo y subo cada día con las almas: conozco el camino.»',[['¿Por qué tú?','«Soy el mensajero de los dioses y el único que va y viene entre los vivos y los muertos. Por eso me llaman Psicopompo, “el que lleva las almas”.» (Odisea XXIV 1-14, donde Hermes guía a las almas de los pretendientes.)']],'Odisea XXIV 1-14.');
    const box=$('dOpts');const b=document.createElement('button');b.innerHTML='<span class="n">★</span><span>Volver arriba con Hermes</span>';b.onclick=()=>{closeDialog();infBack();};box.insertBefore(b,box.firstChild);},infN('Hermes','Mercurio'),'te lleva de vuelta arriba');
  // ---- la puerta de Hades y Cerbero (z 110)
  const gm=lam('#1a181c');for(const sx of[-14,14]){const p=new THREE.Mesh(new THREE.BoxGeometry(3,16,3),gm);p.position.set(sx,8,110);g.add(p);}const lin=new THREE.Mesh(new THREE.BoxGeometry(32,3,3),gm);lin.position.set(0,17,110);g.add(lin);
  for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.BoxGeometry(200,10,2),gm);w.position.set(s*115.5,5,110);g.add(w);addSeg(X+s*15.5,Z+110,X+s*215,Z+110,1);}
  glow(-14,107,'#6a8aff',3,16);glow(14,107,'#6a8aff',3,16);
  {const Q=(typeof crbHas==='function'&&crbHas('cerbero'))?crbQuad({g},'cerbero',1.7):null;const cg=Q?Q.g:herSimple({g},'#1e1814',1,0.8).g;cg.position.set(-8,0,103);cg.rotation.y=0.6;if(Q&&Q.legs)Q.legs.forEach(l=>l.rotation.x=-1.2);cg.position.y=-0.35;}
  infObj(-6,100,()=>infTalk('Κ','Cerbero','duerme a la puerta','Cerbero duerme con las tres cabezas sobre las patas. Una de ellas abre un ojo, te reconoce y vuelve a cerrarlo.',[['¿Qué hace aquí?','Guarda la puerta: a los que entran les mueve la cola y las orejas, pero no deja salir a ninguno, y se come al que lo intenta (Hesíodo, Teogonía 769-773). Contigo es distinto: lo esquivaste sin hacerle daño.']],'Hesíodo, Teogonía 769-773.'),'Cerbero','duerme a la puerta');
  // ---- el juicio (z 55): Minos, Radamantis y Éaco
  fl(40,22,'#3a3440',0,55,0.04);const th=lam('#4a4048');
  [['Minos',0,'ciudadano'],['Radamantis',-8,'ciudadano'],['Éaco',8,'ciudadano']].forEach(([n,x])=>{const t=new THREE.Mesh(new THREE.BoxGeometry(2.2,2.2,2),th);t.position.set(x,1.1,48);g.add(t);infPerson('ciudadano',{chiton:'#2a2630',himation:'#4a3a5a',beard:true},x,48.5,0,1.1);});
  infObj(0,52,()=>infTalk('Μ','Minos, Radamantis y Éaco','los jueces de los muertos','«Aquí, en la encrucijada, juzgamos a cada alma: Radamantis a los de Asia, Éaco a los de Europa, y yo, Minos, decido cuando ellos dudan. Un camino lleva a las Islas de los Bienaventurados; el otro, al Tártaro.»',[
    ['¿Cómo juzgáis?','«Las almas llegan desnudas, sin ropa ni riqueza, y nosotros también: así nadie se deja engañar por un buen vestido o un apellido ilustre.» Lo cuenta Sócrates al final del Gorgias de Platón (523c-524a), escrito hacia el 387 a.C., justo la época de este juego.'],
    ['¿Y luego?','En el mito de Er (Platón, República X), las almas justas suben al cielo por la derecha y las injustas bajan por la izquierda; mil años después vuelven, eligen una vida nueva y beben del río del olvido antes de nacer otra vez.']],'Platón, Gorgias 523a-527a; República X 614b-621d.'),'Los tres jueces','Minos, Radamantis y Éaco');
  // ---- prados de Asfódelos (oeste)
  fl(170,150,'#4a4a50',-120,-10,0.03);const asm=new THREE.MeshBasicMaterial({color:'#e8e6dc'});for(let i=0;i<260;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.12,5,4),asm);f.position.set(-120+(Math.random()-0.5)*165,0.5,-10+(Math.random()-0.5)*145);g.add(f);const st=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.5,3),lam('#5a6a4a'));st.position.set(f.position.x,0.25,f.position.z);g.add(st);}
  for(let i=0;i<14;i++)infPerson(i%3?'ciudadano':'mujer',{chiton:'#a0a4b0'},-170+Math.random()*100,-60+Math.random()*100,Math.random()*6,1,true);
  infPerson('hoplita',{chiton:'#8a8ea0'},-110,-20,0.5,1.15,true);
  infObj(-110,-17,()=>infTalk('Α','La sombra de Aquiles','en los prados de Asfódelos','La sombra del héroe más grande de Troya camina por el prado gris. «¿Vienes de arriba? ¿Cómo está mi hijo? ¿Y mi padre, Peleo?»',[
    ['¿Eres feliz aquí? Eres el más honrado de los muertos.','«No me consueles de la muerte. Preferiría ser jornalero en la tierra, al servicio de un hombre pobre, que reinar sobre todos los muertos.» (Odisea XI 488-491)'],
    ['¿Qué son estos prados?','Los prados de asfódelos, una planta de flores pálidas: aquí van casi todas las sombras, ni castigadas ni premiadas. Ulises vio a Aquiles marcharse a grandes zancadas por ellos (Odisea XI 539).']],'Odisea XI 467-540.'),'La sombra de Aquiles','prados de Asfódelos');
  infPerson('ciudadano',{chiton:'#b0b0b8',himation:'#6a6a7a',beard:true,staff:true},-150,20,1.2,1,true);
  infObj(-150,23,()=>infTalk('Τ','Tiresias','el adivino ciego de Tebas','«Solo yo conservo la razón entre los muertos: Perséfone me lo concedió. Ulises vino a preguntarme por su regreso.»',[['¿Qué le dijiste a Ulises?','«Que volvería a Ítaca, tarde y solo, en barco ajeno, y que encontraría su casa llena de pretendientes. Y que no tocara las vacas del Sol.» (Odisea XI 90-137)']],'Odisea X 490-495; XI 90-151.'),'Tiresias','el adivino');
  // ---- los Campos Elíseos (este): luz cálida y verde
  fl(170,150,'#4f7a3e',120,-10,0.035);for(let i=0;i<20;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(2.4,7,7),lam('#3f6a32'));t.position.set(60+Math.random()*120,3.5,-80+Math.random()*140);g.add(t);}
  const rose=new THREE.MeshBasicMaterial({color:'#e86a7a'});for(let i=0;i<160;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.13,5,4),rose);f.position.set(120+(Math.random()-0.5)*160,0.35,-10+(Math.random()-0.5)*140);g.add(f);}
  const sunE=new THREE.PointLight('#ffe0a0',1.6,180,1.2);sunE.position.set(120,40,-10);g.add(sunE);glow(120,-10,'#fff0c0',30,30);
  for(let i=0;i<8;i++)infPerson(i%2?'mujer':'ciudadano',{chiton:'#f0e6c8',himation:'#c8a050'},80+Math.random()*80,-50+Math.random()*80,Math.random()*6,1);
  infObj(110,-5,()=>infTalk('Η','Los bienaventurados','en los Campos Elíseos','Aquí brilla un sol propio. Unos juegan a los dados y otros montan a caballo; suena una lira y huele a incienso. Un anciano te saluda: «Bienvenido a las Islas de los Bienaventurados».',[
    ['¿Quién vive aquí?','Los que fueron justos tres veces, en esta vida y en otras, dice Píndaro (Olímpica II 68-80): allí soplan las brisas del Océano y brillan flores de oro. En la Odisea (IV 561-569), Proteo anuncia a Menelao que irá a los Campos Elíseos, donde nunca nieva ni hace frío.'],
    ['¿Qué hacen todo el día?','«Unos se divierten con caballos y ejercicios, otros con el juego de damas, otros con la lira», cuenta Píndaro (fragmento 129).']],'Píndaro, Olímpica II 68-80 y fr. 129; Odisea IV 561-569.'+(ro?' Virgilio los describe en la Eneida VI 637-678.':'')),'Los bienaventurados','Campos Elíseos');
  // el Lete, al borde de los Elíseos
  river(190,-10,14,180,'#6a8a9a');infObj(178,-10,()=>infTalk('Λ','El río Lete','el olvido','Un río tranquilo, de agua clara. Quien bebe olvida su vida anterior.',[['¿Beber?','Mejor no: no recordarías nada de lo que has aprendido aquí. En el mito de Er, las almas beben del río Ameles, en la llanura del Lete, antes de volver a nacer; las imprudentes beben de más (Platón, República X 621a-b).']],'Platón, República X 621a-b.'),'El Lete','el río del olvido');
  // ---- los ríos: Cocito y Piriflegetonte, cruzando el centro (z -55)
  river(-70,-75,120,9,'#2a3a4a');const fire=river(70,-75,120,9,'#ff6a2a','#a03000');for(let i=0;i<14;i++)glow(15+i*8,-75,'#ff8a30',3,1.2);
  infObj(0,-70,()=>infTalk('Π','Los ríos del Hades','Cocito y Piriflegetonte','A la izquierda corre un río negro y lento entre lamentos: el Cocito. A la derecha, un río de fuego: el Piriflegetonte.',[['¿Cuántos ríos hay?','En el Fedón (112e-114b), que Platón escribió por estos años, Sócrates habla de cuatro: el Océano, el Aqueronte, el Piriflegetonte, de fuego y barro ardiente, y el Cocito; y de la laguna Estigia. Los dioses juran por la Estigia, y ese juramento no se puede romper (Hesíodo, Teogonía 775-806).']],'Platón, Fedón 112e-114b; Hesíodo, Teogonía 775-806.'),'Los ríos','Cocito y Piriflegetonte');
  // ---- el Tártaro (noroeste): foso, Sísifo, Tántalo, Danaides, puertas de bronce
  const pit=new THREE.Mesh(new THREE.CircleGeometry(38,40),new THREE.MeshBasicMaterial({color:'#0a0606'}));pit.rotation.x=-Math.PI/2;pit.position.set(-120,0.05,-160);g.add(pit);glow(-120,-160,'#ff4a1a',30,4);
  for(let i=0;i<32;i++){const a=i/32*TAU,b=(i+1)/32*TAU;addSeg(X-120+Math.cos(a)*38,Z-160+Math.sin(a)*38,X-120+Math.cos(b)*38,Z-160+Math.sin(b)*38,0.4);}
  const bz=new THREE.MeshPhongMaterial({color:'#8a6a3a',shininess:70});const gate=new THREE.Mesh(new THREE.BoxGeometry(18,14,1.5),bz);gate.position.set(-120,7,-201);g.add(gate);
  // Sísifo: rampa y piedra
  const ramp=new THREE.Mesh(new THREE.BoxGeometry(6,0.6,30),lam('#4a3e36'));ramp.position.set(-60,4,-150);ramp.rotation.x=-0.28;g.add(ramp);INF.rock=new THREE.Mesh(new THREE.DodecahedronGeometry(1.4,1),lam('#6a5e52'));g.add(INF.rock);INF.sis=infPerson('obrero',{chiton:'#5a4a3a'},-60,-140,Math.PI,1);
  infObj(-56,-135,()=>infTalk('Σ','Sísifo','empuja su piedra','Un hombre empuja una piedra enorme cuesta arriba con manos y pies; cuando está a punto de llegar arriba, la piedra rueda otra vez hasta abajo.',[['¿Por qué?','Sísifo, rey de Corinto, el más astuto de los hombres, engañó a los dioses (según algunos, a la propia Muerte). Su castigo es un trabajo que nunca termina (Odisea XI 593-600).']],'Odisea XI 593-600.'),'Sísifo','y su piedra');
  // Tántalo: estanque y árbol
  river(-170,-120,14,14,'#3a5a6a');const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.4,5,7),lam('#4a3a2a'));tr.position.set(-170,2.5,-127);g.add(tr);const cr=new THREE.Mesh(new THREE.SphereGeometry(3,10,8),lam('#3a5a2a'));cr.position.set(-170,6,-127);g.add(cr);
  for(let i=0;i<10;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.2,6,5),lam(i%2?'#c84a3a':'#e8b030'));f.position.set(-170+(Math.random()-0.5)*4,4.5+Math.random(),-125+(Math.random()-0.5)*3);g.add(f);}
  infPerson('ciudadano',{chiton:'#6a5a4a',beard:true},-170,-120,0,1);
  infObj(-165,-115,()=>infTalk('Τ','Tántalo','de pie en el agua','Un anciano está metido en el agua hasta la barbilla; cuando se agacha a beber, el agua desaparece. Sobre su cabeza cuelgan peras, granadas, manzanas e higos; cuando alarga la mano, el viento las aparta.',[['¿Qué hizo?','Según unos, robó el néctar y la ambrosía de los dioses para dárselo a los hombres; según otros, quiso poner a prueba a los dioses en un banquete. De su nombre viene la palabra «tantalizar» (Odisea XI 582-592; Píndaro, Olímpica I).']],'Odisea XI 582-592; Píndaro, Olímpica I 54-64.'),'Tántalo','el agua que se escapa');
  // Danaides
  INF.dan=[];for(let i=0;i<5;i++){const d=infPerson('mujer',{chiton:'#8a8a9a'},-95+i*3,-190,0,1);const j=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.25,0.6,8),lam('#a85a32'));j.position.set(0.25,1.5,0);d.add(j);INF.dan.push({d,ph:i});}
  const jar=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.1,2.4,12),lam('#9a5030'));jar.position.set(-85,1.2,-195);g.add(jar);
  infObj(-88,-190,()=>infTalk('Δ','Las Danaides','con sus jarras','Unas mujeres llevan agua en jarras de un lado a otro para llenar una tinaja enorme; pero la tinaja tiene un agujero y nunca se llena.',[['¿Quiénes son?','Las hijas de Dánao, que según el mito mataron a sus maridos la noche de bodas. Platón cita la imagen de la tinaja agujereada en el Gorgias (493b), y Polignoto las pintó en su famoso cuadro del Hades en Delfos (Pausanias X 31,9).']],'Platón, Gorgias 493b; Pausanias X 31,9-11.'),'Las Danaides','la tinaja sin fondo');
  infObj(-120,-196,()=>infTalk('Τ','Las puertas de bronce','del Tártaro','Unas puertas enormes de bronce, cerradas. Detrás, muy hondo, se oye algo inmenso que se mueve.',[['¿Qué hay detrás?','Los Titanes, encerrados por Zeus tras la guerra. Poseidón puso las puertas de bronce y los de cien brazos las vigilan (Hesíodo, Teogonía 729-735).']],'Hesíodo, Teogonía 713-735.'),'Las puertas de bronce','del Tártaro');
  // ---- la mansión de Hades (norte)
  const hm=lam('#1e1a22'),hm2=lam('#2c2630');const hx=60,hz=-170;const base=new THREE.Mesh(new THREE.BoxGeometry(64,1.5,48),hm2);base.position.set(hx,0.75,hz);g.add(base);addPlat(X+hx,Z+hz,64,48,0,Y+1.5);
  for(let i=0;i<10;i++){for(const zz of[-20,20]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.9,1,14,12),hm);c.position.set(hx-27+i*6,8.5,hz+zz);g.add(c);}}
  const roof=new THREE.Mesh(new THREE.BoxGeometry(66,2,50),hm);roof.position.set(hx,16.5,hz);g.add(roof);const back=new THREE.Mesh(new THREE.BoxGeometry(64,14,1.5),hm);back.position.set(hx,8.5,hz-23);g.add(back);
  addSeg(X+hx-32,Z+hz-23,X+hx+32,Z+hz-23,0.8);addSeg(X+hx-32,Z+hz-23,X+hx-32,Z+hz+18,0.8);addSeg(X+hx+32,Z+hz-23,X+hx+32,Z+hz+18,0.8);
  for(let i=0;i<8;i++)glow(hx-24+i*7,hz+18,'#9a7aff',2.2,6);
  for(const[tx,kind,cfg,name]of[[-4,'ciudadano',{chiton:'#1a1418',himation:'#3a2a3a',beard:true,hair:'#1a1210'},'Hades'],[4,'mujer',{chiton:'#e8e0d0',himation:'#7a2a3a'},'Perséfone']]){const t=new THREE.Mesh(new THREE.BoxGeometry(2.6,3,2.4),lam('#3a2e40'));t.position.set(hx+tx,3,hz-16);g.add(t);infPerson(kind,cfg,hx+tx,hz-15,0,1.25);}
  const pom=new THREE.Mesh(new THREE.SphereGeometry(2.6,10,8),lam('#3a5a2a'));pom.position.set(hx+14,6,hz-12);g.add(pom);const pt=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.4,4,7),lam('#4a3a2a'));pt.position.set(hx+14,3.5,hz-12);g.add(pt);
  for(let i=0;i<9;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,6),lam('#b8283a'));f.position.set(hx+14+(Math.random()-0.5)*4,5.5+Math.random()*1.5,hz-12+(Math.random()-0.5)*4);g.add(f);}
  infObj(hx-4,hz-12,()=>infTalk('Α',infN('Hades','Plutón'),'el señor de los muertos','En el trono de la izquierda, '+infN('Hades','Plutón')+' te mira sin enfado. «Has bajado hasta el fondo sin hacer daño a nadie. Pocos pueden decir eso.»',[
    ['¿Eres el dios de la muerte?','«No: la muerte es Tánato. Yo gobierno a los muertos. Cuando mis hermanos y yo nos repartimos el mundo, a Zeus le tocó el cielo, a Poseidón el mar y a mí la tierra de abajo.» (Ilíada XV 187-193)'],
    ['¿Por qué te llaman Plutón?','«Plutón quiere decir “el rico”: de debajo de la tierra salen el trigo y los metales. Los griegos prefieren no decir mi nombre: dicen “el de abajo” o “el rico”.» Platón juega con este nombre en el Crátilo (403a-404b).'],
    ['¿Es un castigo vivir aquí?','«Para mí no. Es mi casa. Para los vivos, es el final del camino; por eso les da miedo.»']],'Ilíada XV 187-193; Platón, Crátilo 403a-404b; Hesíodo, Teogonía 455, 767-774.'),infN('Hades','Plutón'),'en su trono');
  infObj(hx+4,hz-12,()=>infTalk('Π',infN('Perséfone','Proserpina'),'la reina del Hades','«Me alegra ver a alguien de arriba. ¿Huele todavía a trigo maduro en Eleusis?»',[
    ['¿Cómo llegaste aquí?','«Recogía flores en un prado con las hijas del Océano cuando la tierra se abrió y '+infN('Hades','Plutón')+' me trajo en su carro. Mi madre, Deméter, me buscó por toda la tierra con antorchas, y mientras tanto no creció nada.» (Himno homérico a Deméter)'],
    ['¿Por qué vuelves cada año?','«Comí unos granos de granada aquí abajo. Quien come en el Hades le pertenece. Por eso paso aquí un tercio del año, y cuando subo, florece la tierra.» (Himno a Deméter 371-374 y 398-403)'],
    ['¿Qué son los Misterios de Eleusis?','«El culto a mi madre y a mí. Lo que pasa dentro no se puede contar; pero los iniciados dicen que esperan algo mejor después de la muerte.» (Himno a Deméter 480-482)']],'Himno homérico a Deméter.'),infN('Perséfone','Proserpina'),'en su trono, junto al granado');
}
function infTravel(){if(MOUNT.riding)dismount();if(MOUNT.g){MOUNT.g.visible=false;MOUNT.st='away';}FLY.on=false;try{if(typeof PEGR!=='undefined')PEGR.on=false;}catch(e){}const ro=MODE==='roma';
  seaScreen('En la barca de '+(ro?'Charon':'Caronte'),'El Aqueronte','La barca avanza sobre un agua negra y quieta. '+(ro?'Charon':'Caronte')+' rema sin hablar. En la orilla que dejas atrás, las sombras de los que no fueron enterrados alargan las manos. Al otro lado, entre la niebla, se adivinan unas puertas enormes y se oye un ladrido triple, ya manso.','Aristófanes, Ranas 180-270; Odisea XI','Desembarcar',()=>{buildInf();player.x=INF.X;player.z=INF.Z+150;player.yaw=0;player.feet=INF.Y;player.camY=player.feet+player.eye;player.vy=0;player.pitch=0.05;curZone=null;hudKey='';ui='play';
    if(!state.infra){state.infra=1;save();try{qAdd('kl',3,'Has visitado el Inframundo.');}catch(e){}}toast('<span class="label">El Inframundo</span><br>Habla con los jueces, recorre Asfódelos y los Campos Elíseos, asómate al Tártaro y entra en la casa de '+infN('Hades','Plutón')+'. Hermes, junto a la barca, te lleva de vuelta.');});}
function infBack(){const ro=MODE==='roma',id=ro?'cumae':'tenaro',I=ISLANDS.find(q=>q.id===id)||ISLANDS[0];
  seaScreen('Con '+infN('Hermes','Mercurio'),'De vuelta','Hermes te lleva de la mano por un camino que sube y sube, a oscuras. De repente, una luz: estás en la boca de la cueva, al aire libre, y el sol te hace daño en los ojos.','Odisea XXIV 1-14','Salir',()=>{const c=I.town||I;const f=findFree(c.x+20,c.z+10,1.5)||[c.x+20,c.z+10];player.x=f[0];player.z=f[1];player.feet=floorAt(f[0],f[1]);player.camY=player.feet+player.eye;player.vy=0;curZone=null;hudKey='';ui='play';});}
// animaciones y zonas
const INF_ZONES=[['La orilla del Aqueronte',0,180,60],['La puerta de Hades',0,110,25],['El juicio',0,52,22],['Los prados de Asfódelos',-120,-10,80],['Los Campos Elíseos',120,-10,80],['Los ríos',0,-75,30],['El Tártaro',-120,-160,55],['La casa de Hades',60,-170,40]];
function infTick(dt){if(!INF.built||Math.abs(player.feet-INF.Y)>60)return;const t=performance.now()/1000;
  if(INF.rock){const k=(t*0.12)%1,u=k<0.85?k/0.85:1-(k-0.85)/0.15;INF.rock.position.set(-60,1.4+u*8,-136-u*26);if(INF.sis){INF.sis.position.set(INF.X-60,INF.Y+u*8*0.95,INF.Z-133-u*26);}}
  for(const D of INF.dan||[]){const u=0.5+0.5*Math.sin(t*0.5+D.ph);D.d.position.x=INF.X-95+D.ph*3+u*8;}
  for(const p of INF.people)bestAnim(p,dt,0);
  const lx=player.x-INF.X,lz=player.z-INF.Z;let zn='';for(const[n,x,z,r]of INF_ZONES)if(Math.hypot(lx-x,lz-z)<r){zn=n;break;}if(zn&&zn!==INF.zone){INF.zone=zn;toast('<span class="label">'+zn+'</span>');}else if(!zn)INF.zone='';}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{infTick(dt);}catch(e){if(!INF.err){INF.err=String(e).slice(0,200);console.warn('inframundo',e);}}return r;};}
