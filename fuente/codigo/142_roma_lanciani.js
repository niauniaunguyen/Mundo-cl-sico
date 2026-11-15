// ============================================================ ROMA: lo que faltaba según la Forma Urbis de Lanciani (revisión lámina a lámina, v217)
// Láminas 8, 9, 10, 14, 15, 16, 21, 22, 23, 28, 29, 30, 34, 35, 36, 42 frente al plano del juego. Se corrigieron en 029 la Saepta Julia
// (de norte a sur junto a la Vía Lata), las termas de Agripa (pegadas al sur del Panteón) y la Vía Recta con el puente de Nerón (al norte
// del Panteón). Aquí, lo que existía en el 80 d.C. y no estaba: termas de Nerón, teatro y cripta de Balbo, el área sagrada de Largo
// Argentina, el templo de Quirino, el pórtico de Livia, los jardines de Salustio, Lúculo y Mecenas, el Macellum Magnum y el circo vaticano.
// Lo posterior al 80 que sale en las láminas (estadio de Domiciano, termas de Trajano, Ludus Magnus, foro de Trajano) no se añade.
Object.assign(PSRC,{
 ro_saepta:{a:['Dion Casio LIII 23 (Agripa la termina, 26 a.C.) y LXVI 24 (arde en el 80)','Marcial II 14 y IX 59 (las tiendas de lujo de la Saepta)'],m:['R. Lanciani, Forma Urbis Romae (1893-1901), láms. 15 y 21','F. Coarelli, Roma (2007)'],n:[]},
 ro_termas_neron:{a:['Marcial VII 34 («¿Qué hay peor que Nerón? ¿Y qué mejor que las termas de Nerón?»)','Suetonio, Nerón 12'],m:['Lanciani, lám. 15 (las rehace Alejandro Severo: thermae Alexandrianae)'],n:['La planta del juego es esquemática.']},
 ro_balbo:{a:['Suetonio, Augusto 29','Dion Casio LIV 25 y LXVI 24 (arde en el 80)'],m:['D. Manacorda, Crypta Balbi (2001)','Lanciani, lám. 21'],n:[]},
 ro_argentina:{a:['Cicerón, Sobre las leyes II 28 (Fortuna Huiusce Diei)','Plutarco, César 66 (la curia de Pompeyo)'],m:['F. Coarelli, L’Area Sacra di Largo Argentina (1981)'],n:['Se descubrió al derribar el barrio en 1926-1929; Lanciani aún no la conocía. La atribución de los templos A, C y D a dioses concretos es discutida.']},
 ro_quirino:{a:['Augusto, Res gestae 19','Dion Casio LIV 19','Vitruvio III 2, 7 (templo díptero)'],m:['Lanciani, lám. 16','L. Richardson, A New Topographical Dictionary of Ancient Rome (1992)'],n:[]},
 ro_livia:{a:['Ovidio, Fastos VI 639-648','Dion Casio LIV 23 y LV 8','Plinio, Historia natural XIV 11 (la parra del pórtico)'],m:['Lanciani, lám. 23'],n:[]},
 ro_horti:{a:['Tácito, Anales XI 1 y 32-38 (Mesalina en los jardines de Lúculo)','Dion Casio LXVI 10 (Vespasiano en los de Salustio)','Suetonio, Nerón 38 (la torre de Mecenas)','Horacio, Sátiras I 8 (el cementerio del Esquilino convertido en jardín)'],m:['Lanciani, láms. 9, 10 y 23','M. Cima y E. La Rocca (eds.), Horti Romani (1998)'],n:[]},
 ro_macellum:{a:['Dion Casio LXI 18 (Nerón lo inaugura en el 59)'],m:['Richardson (1992), s.v. Macellum Magnum'],n:['Su ubicación exacta en el Celio se discute; el juego lo pone junto a la Puerta Celimontana.']},
 ro_vaticano:{a:['Plinio, Historia natural XVI 201 y XXXVI 74 (el obelisco)','Tácito, Anales XV 44 (los cristianos en los jardines de Nerón)','Suetonio, Claudio 21'],m:['Lanciani, láms. 7 y 14'],n:['El obelisco es el que hoy está en la plaza de San Pedro, trasladado en 1586.']}});
function romaLanciani(){const H=(x,z)=>romaH(x,z),ok=(x,z,r)=>isFree(x,z,r);
  // termas de Nerón, al oeste del Panteón
  {const x=-770,z=-545,g=grp(x,H(x,z)-0.2,z,0);box(70,14,44,PLAST,0,7,0,g);box(24,18,20,PLAST,0,9,0,g);const dm=new THREE.Mesh(new THREE.SphereGeometry(11,18,9,0,TAU,0,Math.PI/2),LEAD);dm.position.y=18;g.add(dm);
   for(const s of[-1,1]){const b=new THREE.Mesh(new THREE.PlaneGeometry(14,10),lam('#4f8a96'));b.rotation.x=-Math.PI/2;b.position.set(s*24,14.05,0);g.add(b);}
   addBox(x,z,70,44,0);footprints.push({x,z,w:70,d:44,a:0,c:'#e2d6c0',name:'Termas de Nerón'});
   place('ro_termas_neron','Termas de Nerón','THERMAE NERONIANAE','Las termas que Nerón hizo construir hacia el 62, junto a su gimnasio, al oeste del Panteón: salas calientes, piscinas al aire libre y jardines. Marcial bromea: «¿Hay algo peor que Nerón? ¿Y algo mejor que sus termas?». Siguen abiertas y son de las más concurridas del Campo de Marte.',x,z+26,0);}
  place('ro_saepta','La Saepta Julia','SAEPTA IVLIA','Un enorme recinto alargado, rodeado de pórticos, que Julio César empezó y Agripa terminó en el 26 a.C. para las votaciones de los comicios: aquí se encerraba por tribus a los ciudadanos que votaban. Con los emperadores ya casi no se vota y se usa para combates de gladiadores, exhibiciones y, sobre todo, tiendas de lujo: Marcial se burla de los que pasean entre esclavos de precio y muebles de carey sin comprar nada. El incendio de este año la ha dañado.',-472,-425,0);
  // teatro de Balbo y su cripta
  theatre({x:-505,z:-118,rot:-Math.PI/2,R0:12,R1:40,H:18,name:'Teatro de Balbo'});
  {const x=-430,z=-118;porticus(x-20,z-20,x+20,z-20,6,6,'tuscan',1,H(x,z));porticus(x-20,z+20,x+20,z+20,6,6,'tuscan',-1,H(x,z));footprints.push({x,z,w:44,d:44,a:0,c:'#d8ccb4',name:'Cripta de Balbo'});}
  place('ro_balbo','Teatro de Balbo','THEATRVM BALBI','El más pequeño de los tres teatros de piedra de Roma, inaugurado en el 13 a.C. por Lucio Cornelio Balbo, un gaditano que llegó a cónsul: Augusto animaba a los ricos a embellecer la ciudad. Detrás tiene un patio con pórticos, la «cripta». También ardió en el incendio de este año.',-470,-160,0);
  // área sagrada de Largo Argentina: cuatro templos republicanos en fila, ante la curia de Pompeyo
  {const zs=[-262,-238,-212,-190];zs.forEach((z,i)=>{if(i===1)roundTemple({x:-535,z,r:6,colD:0.6,colH:7,n:18,pod:2,rot:Math.PI/2,name:'Templo de la Fortuna de Este Día'});
     else romanTemple({x:-535,z,rot:Math.PI/2,W:10,L:16,pod:2.2,colD:0.7,colH:7,nW:4,deep:1,name:['Templo A','','Templo C','Templo D'][i]});});
   footprints.push({x:-535,z:-226,w:20,d:90,a:0,c:'#d8ccb4',name:'Área sagrada'});
   place('ro_argentina','Cuatro templos antiguos','AREA SACRA','En fila, cuatro templos de los tiempos de la República, mucho más antiguos que los pórticos de Pompeyo que tienen detrás. El redondo lo prometió Quinto Lutacio Cátulo a la Fortuna de Este Día en la batalla contra los cimbrios (101 a.C.). Justo detrás está la sala de reuniones de Pompeyo donde mataron a César en los idus de marzo del 44 a.C.; Augusto la mandó cerrar.',-510,-226,0);}
  // templo de Quirino, en el Quirinal
  {const x=-215,z=-650;romanTemple({x,z,rot:0,W:30,L:54,pod:3,colD:1.2,colH:12,nW:8,deep:3,peri:true,name:'Templo de Quirino'});
   place('ro_quirino','Templo de Quirino','AEDES QVIRINI','Quirino es Rómulo convertido en dios. Augusto le reconstruyó en el 16 a.C. este templo enorme, rodeado por dos filas de columnas (un «díptero», dice Vitruvio): setenta y seis columnas en total. La colina, el Quirinal, toma de él su nombre.',x+24,z+30,0);}
  // pórtico de Livia, en el Opio, junto al Clivo Suburano
  {const x=330,z=-290,gy=H(x,z);porticus(x-45,z-30,x+45,z-30,7,7,'corinthian',1,gy);porticus(x-45,z+30,x+45,z+30,7,7,'corinthian',-1,gy);porticus(x-45,z-30,x-45,z+30,7,7,'corinthian',-1,gy);porticus(x+45,z-30,x+45,z+30,7,7,'corinthian',1,gy);
   {const g=grp(x,gy,z,0);box(8,4,6,M.marble,0,2,0,g);addBox(x,z,8,6,0);}
   footprints.push({x,z,w:96,d:66,a:0,c:'#d8ccb4',reserve:true});
   place('ro_livia','Pórtico de Livia','PORTICVS LIVIAE','Un gran patio con pórticos y jardines en el Opio. Aquí estaba la casa de Vedio Polión, un liberto riquísimo y cruel que echaba a sus esclavos a las morenas; al heredarla, Augusto la mandó derribar entera y Livia levantó en su lugar este pórtico abierto a todos (7 a.C.), con un santuario de la Concordia. Una sola parra da sombra a los paseos y doce ánforas de vino al año, cuenta Plinio.',x,z+36,0);}
  // jardines: Salustio, Lúculo, Mecenas (árboles, un pabellón y su estela)
  const garden=(x,z,id,nm,gr,txt,pav)=>{const tr=[];for(let i=0;i<46;i++){const a=i*2.39996,r=8+Math.sqrt(i)*9,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;if(ok(px,pz,2))tr.push({x:px,z:pz,kind:['pine','cypress','plane','pine'][i%4],k:1});}if(GLB.ok&&tr.length)treesGLB(tr);
    if(pav){const g=grp(x+pav[0],H(x+pav[0],z+pav[1]),z+pav[1],pav[2]||0);box(pav[3],7,pav[4],PLAST,0,3.5,0,g);const ap=new THREE.Mesh(new THREE.CylinderGeometry(pav[4]/2,pav[4]/2,7,16,1,false,0,Math.PI),PLAST);ap.position.set(pav[3]/2,3.5,0);g.add(ap);addBox(g.position.x,g.position.z,pav[3],pav[4],pav[2]||0);footprints.push({x:g.position.x,z:g.position.z,w:pav[3],d:pav[4],a:pav[2]||0,name:nm,house:true});}
    footprints.push({x,z,r:55,c:'#c8d0a8',reserve:true});place(id,nm,gr,txt,x,z+6,0);};
  garden(-110,-860,'ro_salustio','Jardines de Salustio','HORTI SALLVSTIANI','Los jardines que el historiador Salustio se pagó con lo que ganó gobernando África. Hoy son del emperador: Vespasiano pasaba aquí más tiempo que en el Palatino y recibía a quien quisiera verlo. Hay pabellones, estatuas, fuentes y un obelisco.',[16,-14,0.3,22,10]);
  garden(-330,-975,'ro_luculo','Jardines de Lúculo','HORTI LVCVLLIANI','En la colina de los jardines, el Pincio, Lúculo, el general rico de los banquetes famosos, construyó unos jardines en terrazas. Mesalina, la mujer del emperador Claudio, los codició, hizo matar a su dueño y fue aquí donde la mataron a ella en el 48, cuando Claudio descubrió que se había casado con su amante (Tácito, Anales XI).',null);
  garden(700,-290,'ro_mecenas','Jardines de Mecenas','HORTI MAECENATIS','Mecenas, el amigo de Augusto y protector de Virgilio y Horacio, convirtió el viejo cementerio de los pobres del Esquilino en unos jardines: Horacio se ríe de las brujas que antes rondaban las tumbas. Tienen una sala semicircular para lecturas y una torre: desde ella, dicen, contempló Nerón el incendio del 64 cantando la caída de Troya.',[-14,10,0,20,12]);
  // Macellum Magnum de Nerón, en el Celio
  {const x=520,z=330,gy=H(x,z),g=grp(x,gy,z,0);for(const[a,b,c,d]of[[-20,-20,20,-20],[20,-20,20,20],[20,20,-20,20],[-20,20,-20,-6],[-20,6,-20,-20]]){const L=Math.hypot(c-a,d-b),w=box(L>0?(Math.abs(c-a)>0?L:1):1,5,Math.abs(d-b)>0?L:1,PLAST,(a+c)/2,2.5,(b+d)/2,g);}
   const th=new THREE.Mesh(new THREE.CylinderGeometry(7,7,8,20),PLAST);th.position.y=4;g.add(th);const rf=new THREE.Mesh(new THREE.ConeGeometry(8,4,20),M.tile||PLAST);rf.position.y=10;g.add(rf);addCirc(x,z,7.2);
   for(const[a,b,c,d]of[[-20,-20,20,-20],[20,-20,20,20],[20,20,-20,20],[-20,20,-20,6],[-20,-6,-20,-20]])addSeg(x+a,z+b,x+c,z+d,0.5);
   footprints.push({x,z,w:42,d:42,a:0,c:'#d8ccb4',name:'Macellum Magnum',house:true});
   place('ro_macellum','El gran mercado de Nerón','MACELLVM MAGNVM','Nerón inauguró en el 59 este mercado de lujo en el Celio: un patio rodeado de tiendas de dos pisos con un pabellón redondo en el centro, de cúpula, donde se vendía el pescado y la carne más caros. Salió en sus monedas.',x-26,z,0);}
  // el circo vaticano de Gayo y Nerón, al otro lado del río
  {const x=-1260,z=-720,gy=H(x,z),g=grp(x,gy,z,0);for(const s of[-1,1])box(220,5,8,PLAST,0,2.5,s*24,g);box(160,1.2,3,M.marble||PLAST,0,0.6,0,g);addBox(x,z,160,3,0);for(const s of[-1,1])addSeg(x-110,z+s*24,x+110,z+s*24,4);
   if(GLB.ok&&GLB.parts.B_obelisk)placeModules('B_obelisk',[{x,y:gy+1.2,z,a:0,sx:0.9}],{far:2400});
   footprints.push({x,z,w:224,d:56,a:0,c:'#d8ccb0',name:'Circo de Gayo y Nerón'});
   place('ro_vaticano','El circo del Vaticano','CIRCVS GAI ET NERONIS','Al otro lado del río, en la llanura del Vaticano, Calígula se construyó un circo privado en los jardines de su madre Agripina, y trajo de Egipto, en un barco gigantesco, el obelisco de la espina. Nerón corría aquí con sus caballos. En el 64, tras el incendio, en estos jardines hizo matar a los cristianos, cuenta Tácito; la tradición dirá que Pedro murió aquí.',x+40,z+34,0);}}
// la roca Tarpeya: el acantilado de toba del Capitolio (antes solo había la estela, un bloque blanco). Peñascos de toba con textura de roca,
// en la cara que baja (se busca con la pendiente del terreno), y colisión. Toba volcánica, «cappellaccio», como el resto de la colina
function romaTarpeya(){const P=PLACES.find(q=>q.id==='ro_tarpeya');const x0=P?P.x:-205,z0=P?P.z:66,H=(x,z)=>terrainH(x,z);
  let gx=H(x0+4,z0)-H(x0-4,z0),gz=H(x0,z0+4)-H(x0,z0-4);const gl=Math.hypot(gx,gz)||1;gx/=gl;gz/=gl;   // hacia abajo: -gradiente
  const dx=-gx,dz=-gz,px=-dz,pz=dx,mat=triplanar(new THREE.MeshLambertMaterial({color:'#b9a98c'}),PTEX.rock,2.2),r=mulberry32(4242);
  for(let i=0;i<14;i++){const s=(i-6.5)/6.5,along=s*18+(r()-0.5)*3,out=-(4+r()*22),x=x0+px*along+dx*out,z=z0+pz*along+dz*out,sc=3+r()*4;   // peñascos que asoman de la ladera, cuesta arriba
    const geo=new THREE.IcosahedronGeometry(1,1),pa=geo.attributes.position;for(let k=0;k<pa.count;k++){const f=0.78+r()*0.4;pa.setXYZ(k,pa.getX(k)*f,pa.getY(k)*f*1.25,pa.getZ(k)*f);}geo.computeVertexNormals();
    const m=new THREE.Mesh(geo,mat);m.scale.set(sc,sc*1.3,sc*0.9);m.rotation.set(r()*0.4,r()*6,r()*0.4);m.position.set(x,H(x,z)+sc*0.15,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);addCirc(x,z,sc*0.8);}}
