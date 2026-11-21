// ============================================================ ATENAS ROMANA, AÑO 80 (P10, modo Roma)
// El destino «Atenas» del modo Roma (SIMPLE_RO.athenae, 109) tenía la Acrópolis con el Partenón, el templete de Roma y Augusto y poco más.
// Aquí se sustituye su extra() por la ciudad que vería un viajero del 80 d.C., con lo que ya existía entonces (y nada posterior):
//  · en la Acrópolis, el Erecteion y, en el arquitrabe del Partenón, los agujeros de la inscripción de bronce en honor de Nerón (61/62 d.C.)
//  · al norte, el mercado de César y Augusto (el «Ágora romana») con su puerta de Atenea Arquegétide y la Torre de los Vientos
//  · en el Ágora vieja, el Odeón de Agripa y el templo de Ares, traído piedra a piedra de otro lugar del Ática en tiempos de Augusto
//  · al sureste, el templo de Zeus Olímpico a medio hacer: algunas columnas corintias en pie sobre la plataforma y huecos donde faltan
// Fuentes: Pausanias I 8.4-6, I 18.6; Vitruvio I 6.4 y VII pref. 15-17; Varrón, Sobre la agricultura III 5.17; Plinio XXXVI 45;
// IG II² 3175 (dedicatoria de la puerta) e IG II² 3277 (Nerón); Camp, The Archaeology of Athens (2001).
// No se ponen: la biblioteca de Adriano, el arco de Adriano, el monumento de Filopapo ni la biblioteca de Panteno, todos posteriores al 80.
function atrTower(x,z){const gy=minGround(x,z,10,10,0),g=grp(x,gy,z,0);
  const b=new THREE.Mesh(new THREE.CylinderGeometry(3.9,4,12,8),M.marble);b.rotation.y=Math.PI/8;b.position.y=6;g.add(b);
  const fr=new THREE.Mesh(new THREE.CylinderGeometry(4.02,4.02,1.5,8),lam('#d9cdb2'));fr.rotation.y=Math.PI/8;fr.position.y=10.7;g.add(fr);   // el friso de los ocho vientos
  const rf=new THREE.Mesh(new THREE.ConeGeometry(4.3,2.4,8),M.marble);rf.rotation.y=Math.PI/8;rf.position.y=13.2;g.add(rf);
  const tr=new THREE.Mesh(new THREE.ConeGeometry(0.35,1.4,6),M.gold||lam('#c9a24a'));tr.position.y=15;g.add(tr);                              // el tritón de bronce que gira con el viento
  const rod=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,1.6,4),M.gold||lam('#c9a24a'));rod.rotation.z=Math.PI/2;rod.position.set(0.6,15.2,0);g.add(rod);g.userData.vane=rod;
  for(const s of[-1,1]){const p=toW(s*1.2,4.6,x,z,0);addColumn(p[0],gy,p[1],0.28,4.2,0,'corinthian');}box(3.6,0.6,1.6,M.marble,0,4.5,4.4,g);
  const ann=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,4,12),M.marble);ann.position.set(0,2,-4.6);g.add(ann);                         // el depósito del reloj de agua
  addCirc(x,z,4.2);footprints.push({x,z,r:4.5,c:'#efe7d8',name:'Torre de los Vientos'});return g;}
function atrOlympieion(x,z){const W=41,L=108,gy=minGround(x,z,W,L,Math.PI/2),g=grp(x,gy,z,Math.PI/2);
  for(let i=0;i<3;i++){const ex=(2-i)*1.1;box(W+ex*2,2.5,L+ex*2,i===0?M.limestone:M.marble,0,(i+1)*0.5-1.25,0,g);}addPlat(x,z,W+1,L+1,Math.PI/2,gy+1.5);
  let sd=80;const R=()=>(sd=(sd*16807)%2147483647)/2147483647,cols=[],cr=0.95,ch=17.25;
  for(let i=0;i<8;i++)for(let k of[0,1,18,19])cols.push([-W/2+2.6+i*(W-5.2)/7,-L/2+2.6+k*(L-5.2)/19]);
  for(let k=2;k<18;k++)for(let i of[0,1,6,7])cols.push([-W/2+2.6+i*(W-5.2)/7,-L/2+2.6+k*(L-5.2)/19]);
  // en pie sobre todo el lado este y parte del sur (la obra de Cosucio para Antíoco IV); en el resto, solo los primeros tambores
  for(const[c0,c1]of cols){const p=toW(c0,c1,x,z,Math.PI/2);const stand=(c1>L/2-14)||(c0>W/2-6&&R()<0.5);
    if(stand)addColumn(p[0],gy+1.5,p[1],cr,ch,0,'corinthian');
    else if(R()<0.7){const h=0.6+R()*2.4;const d=new THREE.Mesh(new THREE.CylinderGeometry(cr,cr*1.02,h,16),M.marble);d.position.set(p[0],gy+1.5+h/2,p[1]);scene.add(d);addCirc(p[0],p[1],cr);}}
  footprints.push({x,z,w:L,d:W,a:0,c:'#efe7d8',name:'Templo de Zeus Olímpico'});}
{const D=typeof SIMPLE_RO!=='undefined'&&SIMPLE_RO.athenae;if(D)D.extra=function(I){
  r3Sea(I,'el Pireo');const s=I.site;
  roundTemple({x:s.x+20,z:s.z+30,r:4,colD:0.45,colH:5,n:9,pod:1,gy:s.h,rot:0,name:'Templo de Roma y Augusto'});
  temple({x:s.x-4,z:s.z-27,gy:s.h,rot:Math.PI/2,W:11.6,L:22,nW:6,nL:2,prostyle:true,order:'ionic',colD:0.7,colH:6.6,name:'El Erecteion',cella:{w:10.4,l:18,door:2.4}});
  r3Plaque(s.x+30,s.z-6,'neron_partenon','Las letras de Nerón','ΝΕΡΩΝ','En el año 61 o 62, los atenienses clavaron en el arquitrabe del lado este del Partenón, entre los escudos de bronce, una inscripción de letras de bronce en honor de Nerón. Tras su muerte en el 68 seguramente se arrancaron: hoy solo quedan los agujeros de los clavos, y con ellos se ha podido leer el texto (IG II² 3277). Una ciudad libre que ya no se gobierna sola halaga a quien manda.');
  // el mercado de César y Augusto
  const ax=I.x+60,az=I.z-320;forumR(ax,az,90,60,'Mercado de César y Augusto');
  temple({x:ax-48,z:az,rot:-Math.PI/2,W:11.3,L:4.4,nW:4,nL:2,prostyle:true,amphi:true,colD:1.2,colH:8,name:'Puerta de Atenea Arquegétide'});
  r3Plaque(ax-56,az+9,'puerta_arquegetis','La puerta de Atenea Arquegétide','ΑΘΗΝΑΙ ΑΡΧΗΓΕΤΙΔΙ','Este gran patio con pórticos es un mercado nuevo, pagado con dinero que regalaron Julio César y Augusto. La puerta, de cuatro columnas dóricas, se dedicó hacia el año 10 a.C. a Atenea Arquegétide, «la que guía a la ciudad», según dice la inscripción de su arquitrabe (IG II² 3175). El Ágora vieja se ha llenado de templos y monumentos, y el comercio se ha venido aquí.');
  atrTower(ax+70,az);
  r3Plaque(ax+70,az+9,'torre_vientos','La Torre de los Vientos','ΑΝΔΡΟΝΙΚΟΣ ΚΥΡΡΗΣΤΗΣ','Torre de mármol de ocho lados que hizo el astrónomo Andrónico de Cirro, hace más de un siglo. En cada lado hay un relieve con uno de los ocho vientos y un reloj de sol; dentro, un reloj de agua alimentado por una fuente de la Acrópolis marca las horas aunque esté nublado. Arriba, un tritón de bronce gira con el viento y señala con su vara el que sopla. Lo cuentan Vitruvio (I 6.4) y Varrón (Sobre la agricultura III 5.17).');
  // el Ágora vieja
  const gx=I.x-60,gz=I.z-330;blockBuilding({name:'Odeón de Agripa',x:gx,z:gz,rot:0,w:43,d:51,h:15,mat:M.marble,door:true,socle:true});
  r3Plaque(gx,gz+30,'odeon_agripa','El Odeón de Agripa','ΩΙΔΕΙΟΝ','Marco Agripa, el yerno de Augusto, regaló a Atenas hacia el 15 a.C. esta sala de conciertos cubierta, para unas mil personas, en medio del Ágora. Su tejado cubre unos veinticinco metros sin columnas en medio, algo muy difícil. Pausanias (I 8.6) lo llama simplemente el Odeón. Es la primera vez que un gran edificio ocupa la plaza abierta donde votaban los atenienses.');
  temple({x:I.x-110,z:I.z-392,rot:0,W:15,L:34,nW:6,nL:13,colD:1.0,colH:6.2,name:'Templo de Ares',cella:{w:9,l:20,door:2.4}});
  r3Plaque(I.x-110,I.z-366,'ares_agora','Un templo que viajó','ARES','Este templo dórico tiene más de cuatrocientos años, pero lleva aquí poco tiempo: en época de Augusto se desmontó en otro lugar del Ática (seguramente en Acarnas), se numeraron las piedras y se volvió a levantar en el Ágora, dedicado a Ares. Las marcas de los canteros todavía se ven. Pausanias lo describe (I 8.4).');
  atrOlympieion(I.x+215,I.z-50);
  r3Plaque(I.x+215,I.z-112,'olimpieion_atenas','El templo de Zeus Olímpico','OLYMPIEION','Lo empezaron los hijos del tirano Pisístrato hacia el 520 a.C. y lo dejaron en los cimientos. En el 174 a.C., el rey Antíoco IV de Siria encargó al arquitecto romano Cosucio continuarlo en mármol, con columnas corintias de diecisiete metros (Vitruvio VII, prefacio). Antíoco murió y la obra se paró otra vez. Sila se llevó a Roma algunas columnas para el templo de Júpiter del Capitolio (Plinio XXXVI 45). Anacronismo señalado: lo terminará el emperador Adriano en el 131-132.');
  r3Ruins(I.x-150,I.z+60,6,10,'#e8e2d0');};}
