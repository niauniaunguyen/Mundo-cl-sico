// ============================================================ ROMA: barrios, densidad y muralla
// El tejido urbano sigue lo que sabemos por la Forma Urbis (el plano de mármol de época severa), las excavaciones y la maqueta de Gismondi:
// ínsulas de pisos en manzanas continuas con callejas de 4 a 7 m en los valles (Subura, Velabro, Vía Lata, Trastévere),
// domus con jardín mezcladas con ínsulas en las colinas (Celio, Aventino, Quirinal), grandes jardines (horti) en el borde de la ciudad,
// almacenes (horrea) junto al Emporio y lo que queda de la muralla serviana, ya desbordada por la ciudad y medio oculta entre las casas.
// Los catálogos regionarios del siglo IV cuentan 46.602 ínsulas y 1.790 domus.
// [cx, cz, rx, rz, tejido, giro de las calles, ínsulas altas]
const RQUART=[
 [700,-330,170,150,'horti',0.1],      // jardines de Mecenas, sobre el viejo cementerio del Esquilino
 [870,-40,120,150,'horti',0],         // jardines de Lamia
 [-70,-880,150,100,'horti',0.4],      // jardines de Salustio, entre el Quirinal y el Pincio
 [-330,-930,130,90,'horti',0.2],      // jardines de Lúculo, en el Pincio
 [-800,-960,330,290,'open',0],        // el norte del Campo de Marte sigue siendo un campo abierto
 [210,-400,190,170,'dense',1.0,true], // Subura
 [-160,150,120,95,'dense',0.1],       // Velabro y Vico Tusco
 [-390,-470,105,330,'dense',-1.16],   // a lo largo de la Vía Lata
 [-700,-400,280,330,'campus',0],      // centro del Campo de Marte: monumentos, pórticos y algunas ínsulas
 [-250,590,185,135,'rich',0.15],      // Aventino
 [520,330,170,115,'rich',0],          // Celio
 [-150,-610,230,105,'rich',0.6]       // Quirinal
];
function romaQuarter(x,z){for(const Q of RQUART)if(Math.hypot((x-Q[0])/Q[2],(z-Q[1])/Q[3])<1)return Q;return null;}
// muralla serviana (siglo IV a.C.): restos entre las casas, con sus puertas donde la cruzan las calles
const SERV=[[-470,330],[-405,425],[-398,560],[-372,690],[-300,760],[-150,740],[-60,690],[175,620],[410,575],[440,440],[430,300],[560,190],[600,60],[590,-100],[580,-330],[560,-560],[420,-720],[200,-790],[70,-775],[-150,-720],[-330,-660],[-400,-540],[-300,-330],[-290,-110],[-300,40]];
const SERV_GATES=[['Porta Trigemina',-440,372],['Porta Raudusculana',-182,750],['Porta Capena',440,440],['Porta Caelimontana',480,258],['Porta Querquetulana',600,50],['Porta Esquilina',583,-330],['Porta Viminalis',362,-738],['Porta Collina',62,-773],['Porta Fontinalis',-300,-330]];
const TUFA_W=lam('#a69a78');
function portaServ(x,z,a,name){
  const W=11,D=5.5,H=10.5,h1=7.6,r=2.5,gy=minGround(x,z,W,D,a)-0.3,g=grp(x,gy,z,a);
  const sh=new THREE.Shape();sh.moveTo(-W/2,0);sh.lineTo(-W/2,H);sh.lineTo(W/2,H);sh.lineTo(W/2,0);sh.lineTo(r,0);sh.lineTo(r,h1-r);sh.absarc(0,h1-r,r,0,Math.PI,false);sh.lineTo(-r,0);sh.lineTo(-W/2,0);
  const eg=new THREE.ExtrudeGeometry(sh,{depth:D,bevelEnabled:false,curveSegments:10});eg.translate(0,0,-D/2);const m=new THREE.Mesh(eg,TUFA_W);m.castShadow=m.receiveShadow=true;g.add(m);
  for(let i=-2;i<=2;i++)box(1.2,1.1,D+0.2,TUFA_W,i*2.3,H+0.55,0,g);   // almenas
  for(const s of[-1,1]){const p=toW(s*(W/2+r)/2,0,x,z,a);addBox(p[0],p[1],W/2-r,D,a);}
  footprints.push({x,z,w:W,d:D,a,c:'#8f8467',name});
}
function romaQuarters(){
  // la muralla: tramos de 5 m de sillares de toba; muchos han desaparecido o están metidos en las casas
  const items=[],col=new THREE.Color(),gaps=[],segs=[];let s=0,gap=null;
  for(let i=0;i<SERV.length-1;i++){const[ax,az]=SERV[i],[bx,bz]=SERV[i+1],L=Math.hypot(bx-ax,bz-az),n=Math.max(1,Math.round(L/5)),dx=(bx-ax)/L,dz=(bz-az)/L,a=Math.atan2(-dz,dx);
    for(let k=0;k<n;k++){const t=(k+0.5)/n,x=lerp(ax,bx,t),z=lerp(az,bz,t),l=L/n;s+=l;
      if(roadDist(x,z)<2.5){if(!gap)gap={s0:s,x0:x,z0:z,a};gap.x1=x;gap.z1=z;continue;}
      if(gap){gaps.push(gap);gap=null;}
      if(romaRiverDist(x,z)<romaRiverW(z)+8||footHit(x,z,3))continue;
      const keep=fbm(s*0.011,7.3)>0.4||(x>380&&z<-300);   // el agger del Esquilino se conserva mejor
      if(!keep)continue;
      const p0=toW(-l/2,0,x,z,a),p1=toW(l/2,0,x,z,a),h0=Math.min(terrainH(p0[0],p0[1]),terrainH(p1[0],p1[1])),h1=Math.max(terrainH(p0[0],p0[1]),terrainH(p1[0],p1[1]));
      const ht=(x>380&&z<-300?9:rr(5,8.5))+(h1-h0);col.set('#a69a78').offsetHSL(0,rr(-0.03,0.03),rr(-0.05,0.04));
      items.push({m:new THREE.Matrix4().compose(new THREE.Vector3(x,h0-1.5,z),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),a),new THREE.Vector3(l+0.2,ht+1.5,4)),c:col.clone()});
      addBox(x,z,l,4,a);segs.push({x,z,w:l,d:4,a,c:'#8f8467',wall:true});}}
  footprints.push(...segs);chunked(UNIT,WHITE_M,items,{far:1700});
  for(const G of gaps){const x=(G.x0+G.x1)/2,z=(G.z0+G.z1)/2,n=SERV_GATES.find(q=>Math.hypot(q[1]-x,q[2]-z)<60);if(n)portaServ(x,z,G.a,n[0]);}
  ROMA.wall={segs:items.length,gates:gaps.length};
  place('ro_muralla','La muralla serviana','MVRVS SERVII TVLLII','La muralla que, según la tradición, construyó el rey Servio Tulio. Los restos que se ven son del siglo IV a.C., levantados tras el saqueo de los galos (390 a.C.) con grandes sillares de toba amarilla traída de Veyes: unos 11 kilómetros de muro, con un foso y un terraplén (agger) en la llanura del Esquilino, donde no había defensa natural. Hace siglos que Roma no la necesita y la ha desbordado por todas partes: las casas se apoyan en ella o la usan de cantera, y las puertas se han quedado dentro de la ciudad, como arcos en medio de la calle.',575,-300,Math.PI/2);
  place('ro_insulae','Las ínsulas','INSVLAE','La mayoría de los romanos vive en ínsulas: bloques de pisos de ladrillo y madera de cinco o seis plantas que ocupan manzanas enteras, separadas por callejas estrechas. En la planta baja, tiendas y talleres que dan a la calle; arriba, los pisos: cuanto más alto, más pequeños, más baratos y más peligrosos. No tienen agua corriente ni letrinas, y se cocina con braseros, así que los incendios y los derrumbes son frecuentes. Augusto limitó su altura a unos 70 pies (21 m) y creó los vigiles, bomberos y vigilantes nocturnos. Tras el incendio del 64, Nerón obligó a ensanchar las calles, a dejar patios y a poner pórticos en las fachadas. Los catálogos del siglo IV cuentan unas 46.600 ínsulas y 1.790 domus, aunque quizá cuentan viviendas y no edificios.',156,-294,-2.36);
  place('ro_regiones','Las catorce regiones','XIV REGIONES','En el 7 a.C. Augusto dividió Roma en catorce regiones, que desbordan la vieja muralla, y estas en 265 barrios (vici), cada uno con su altar de los lares y sus magistrados. Las regiones se numeran; los nombres que conocemos, de catálogos posteriores, salen de un monumento o lugar de cada una: Porta Capena (I), Celio (II), Isis y Serapis (III), Templo de la Paz (IV), Esquilino (V), Alta Semita (VI), Vía Lata (VII), Foro Romano (VIII), Circo Flaminio (IX), Palatino (X), Circo Máximo (XI), Piscina Pública (XII), Aventino (XIII) y Trastévere (XIV). Siete cohortes de vigiles, cada una a cargo de dos regiones, vigilan los incendios.',-191,-132,-1.12);
  {const G=SERV_GATES.find(q=>q[0]==='Porta Capena');place('ro_capena','Porta Capena','PORTA CAPENA','La puerta de la muralla serviana por la que sale la Vía Apia hacia el sur. Por encima pasa un ramal del acueducto del Agua Marcia, que gotea sobre los que cruzan: por eso hay quien la llama «la puerta mojada». Aquí empiezan los viajes hacia Campania y Brindisi, y aquí se despide a los que parten y se recibe a los generales que vuelven.',G[1]-14,G[2]-14,-0.6);}
  // una sinagoga del Trastévere, a la manera de la de Ostia: sala con pórtico, placa con la menorá y pila para lavarse las manos
  {const x=-735,z=345,a=-Math.PI/2,gy=minGround(x,z,14,22,a)-0.2,g=grp(x,gy,z,a);
   box(14,8,22,PLAST,0,3,0,g);gableRoof(g,14.6,22.6,7,2.6,M.tile,PLAST);addBox(x,z,14,22,a);
   box(14,0.5,4,TRAV,0,0.25,13,g);for(const s of[-1,1]){const p=toW(s*3,14.4,x,z,a);addColumn(p[0],gy+0.5,p[1],0.3,5,a,'ionic');}
   box(14.2,0.6,4.2,M.tile,0,5.8,13,g);box(2.2,3.4,0.1,M.dark,0,1.7,11.06,g);
   const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.1),new THREE.MeshLambertMaterial({map:canvasTex(128,88,(c,W,H)=>{c.fillStyle='#ece4d2';c.fillRect(0,0,W,H);c.strokeStyle='#7a2a1a';c.lineWidth=4;c.beginPath();c.moveTo(64,74);c.lineTo(64,22);
     for(const r of[14,28,42]){c.moveTo(64-r,22);c.quadraticCurveTo(64-r,58,64,58);c.quadraticCurveTo(64+r,58,64+r,22);}c.stroke();c.fillRect(46,74,36,6);c.fillStyle='#d9a43a';for(const dx of[-42,-28,-14,0,14,28,42])c.fillRect(64+dx-3,14,6,8);})}));
   pl.position.set(0,4.2,11.07);g.add(pl);
   box(1.6,0.8,1,TRAV,4.5,0.4,15.6,g);const w=new THREE.Mesh(new THREE.PlaneGeometry(1.3,0.7),new THREE.MeshPhongMaterial({color:'#4f8fa8',shininess:90}));w.rotation.x=-Math.PI/2;w.position.set(4.5,0.81,15.6);g.add(w);{const p=toW(4.5,15.6,x,z,a);addBox(p[0],p[1],1.6,1,a);}
   footprints.push({x,z:z,w:14,d:30,a,c:'#e3d8c2',name:'Sinagoga'});
   {const p=toW(-5,15.4,x,z,a);place('ro_sinagoga','Una sinagoga del Trastévere','PROSEVCHA','Una casa de oración (proseucha) de los judíos de Roma, que viven sobre todo en este barrio desde que Pompeyo trajo prisioneros de Judea en el 63 a.C. Cada sábado se reúnen aquí para leer en griego la Ley y los Profetas; durante la semana es escuela, tribunal y casa común. Las inscripciones de las catacumbas nombran más de diez sinagogas en Roma: la de los Augustenses, la de los Agripenses, la de los Hebreos… No se ha encontrado ninguna de esta época en la ciudad: esta se inspira en la de Ostia, del siglo I, con su pórtico y su pila para lavarse las manos. Sobre la puerta, la menorá, el candelabro de siete brazos.',p[0],p[1],a);}}
  // horrea: almacenes de dos pisos alrededor de un gran patio, con una sola puerta; trigo, aceite, vino, mármol
  const HR=[[-405,735,84,62,0.2,'Almacenes de Galba'],[-430,825,62,46,0.2,'Almacenes de Lolio'],[-255,845,60,40,0.35,'Almacenes']];
  for(const[x,z,W,D,a,name]of HR){const gy=minGround(x,z,W,D,a)-0.3,g=grp(x,gy,z,a),wd=13,h=9.5;
    const wing=(lx,lz,w,d)=>{box(w,h+3,d,BRICK,lx,(h-3)/2,lz,g);const rf=new THREE.Mesh(GABLE,M.tile);rf.scale.set(w>d?d+0.8:w+0.8,2.6,w>d?w+0.8:d+0.8);if(w>d)rf.rotation.y=Math.PI/2;rf.position.set(lx,h,lz);rf.castShadow=true;g.add(rf);const p=toW(lx,lz,x,z,a);addBox(p[0],p[1],w,d,a);};
    wing(0,-D/2+wd/2,W,wd);wing(-W/2+wd/2,0,wd,D-2*wd);wing(W/2-wd/2,0,wd,D-2*wd);
    const fw=(W-7)/2;wing(-W/2+fw/2,D/2-wd/2,fw,wd);wing(W/2-fw/2,D/2-wd/2,fw,wd);
    box(7.2,2.6,wd,BRICK,0,h-1.3,D/2-wd/2,g);   // dintel sobre la puerta
    for(let i=0;i<Math.floor((W-2*wd)/5);i++)for(const sd of[-1,1])box(2.2,3.2,0.1,M.dark,-W/2+wd+2.5+i*5,1.6,sd*(D/2-wd)-sd*0.06,g);   // puertas de las celdas al patio
    footprints.push({x,z,w:W,d:D,a,c:'#b5785e',name});}
  {const hp=toW(0,37,-405,735,0.2);place('ro_horrea','Los almacenes de Galba','HORREA GALBANA','Los mayores almacenes de Roma, levantados por la familia de los Sulpicios Galbas a finales del siglo II a.C. y hoy propiedad del emperador. Son patios enormes rodeados de cientos de celdas de dos pisos, con una sola puerta vigilada. Guardan el trigo que se reparte gratis a unos doscientos mil ciudadanos, y también aceite, vino y mármol. Detrás crece una colina artificial con los trozos de las ánforas de aceite que no se pueden reutilizar.',hp[0],hp[1],0.2);}
  // Naumaquia de Augusto en el Trastévere: el estanque de las batallas navales, con su isla y el bosque sagrado alrededor
  {const N={x:-870,z:705,w:240,d:150},gy=romaH(N.x,N.z),tr=[];
   for(const[lx,lz,w,d]of[[0,-N.d/2,N.w+3,3],[0,N.d/2,N.w+3,3],[-N.w/2,0,3,N.d+3],[N.w/2,0,3,N.d+3]]){box(w,4,d,TRAV,N.x+lx,gy-0.4,N.z+lz);addBox(N.x+lx,N.z+lz,w,d,0);}
   const wt=new THREE.Mesh(new THREE.PlaneGeometry(N.w-3,N.d-3),new THREE.MeshPhongMaterial({color:'#4f7d82',shininess:70,specular:'#9ab8b0'}));wt.rotation.x=-Math.PI/2;wt.position.set(N.x,gy+0.9,N.z);wt.receiveShadow=true;scene.add(wt);
   const isl=new THREE.Mesh(new THREE.CylinderGeometry(16,18,3,24),TUFA_W);isl.position.set(N.x,gy+0.6,N.z);scene.add(isl);addCirc(N.x,N.z,17);
   {const t=new THREE.Mesh(new THREE.CylinderGeometry(9,9,3.4,20,1,true),TUFA_W);t.material.side=THREE.DoubleSide;t.position.set(N.x,gy+3.6,N.z);scene.add(t);const m=new THREE.Mesh(new THREE.CylinderGeometry(3,3.4,6,12),TRAV);m.position.set(N.x,gy+4.6,N.z);scene.add(m);}
   box(4,0.6,N.d/2-18,M.wood,N.x,gy+1.3,N.z-N.d/4-9);   // puente a la isla
   for(const[dx,dz,a]of[[-70,-30,0.3],[-40,40,-0.5],[60,-35,2.6],[80,30,3.4],[20,-55,1.4],[-90,10,1.9]]){const g=grp(N.x+dx,gy+0.2,N.z+dz,a);box(3.2,1.4,15,lam('#6b4a2e'),0,0.5,0,g);box(3.4,0.25,15.4,lam('#8a6340'),0,1.25,0,g);const pr=box(0.5,0.5,2.6,BRONZE2,0,0.2,8.6,g);const mt=box(0.25,7,0.25,M.wood,0,4.5,0,g);box(5,3.6,0.08,lam('#d9cfb2'),0,5.2,0.2,g);for(let i=0;i<6;i++)for(const sd of[-1,1]){const o=box(0.12,0.12,4,M.wood,sd*2.6,0.7,-5+i*2,g);o.rotation.x=0.5;}}
   for(let i=0;i<70;i++){const t=i/70*TAU,x=N.x+Math.cos(t)*(N.w/2+14)*1.02,z=N.z+Math.sin(t)*(N.d/2+14)*1.05;tr.push({x,z,kind:i%3?'plane':'cypress'});}
   if(GLB.ok)treesGLB(tr);
   footprints.push({x:N.x,z:N.z,w:N.w+30,d:N.d+30,a:0,c:'#4f7d82',name:'Naumaquia de Augusto'});
   place('ro_naumaquia','Naumaquia de Augusto','NAVMACHIA AVGVSTI','Un estanque de unos 540 por 360 metros que Augusto mandó excavar en el 2 a.C. para inaugurar el templo de Marte Vengador. Allí se libró una batalla de espectáculo entre «atenienses» y «persas», con treinta naves con espolón y unos tres mil combatientes, sin contar a los remeros. Lo rodea un bosque sagrado dedicado a sus nietos Gayo y Lucio. Este año, en los juegos de inauguración del anfiteatro, Tito lo ha vuelto a llenar de naves: «atenienses» contra «siracusanos», con asalto a la isla del centro.',N.x+40,N.z-N.d/2-24,0);}
  // Casa Dorada: el ala del Opio del palacio de Nerón, con su fachada porticada hacia el sur; Vespasiano devolvió al pueblo el resto
  {const x=500,z=-240,gy=minGround(x,z,140,40,0)-0.3,g=grp(x,gy,z,0);box(140,15,40,PLAST,0,6.5,0,g);addBox(x,z,140,40,0);
   const r=new THREE.Mesh(new THREE.CylinderGeometry(15,15,6,8),PLAST);r.position.set(0,16,-2);g.add(r);const dm=new THREE.Mesh(new THREE.SphereGeometry(14,20,8,0,TAU,0,Math.PI/2),M.tile);dm.scale.y=0.5;dm.position.set(0,19,-2);g.add(dm);
   for(let i=0;i<14;i++)box(3,5.4,0.1,M.dark,-62+i*9.6,3.5,20.06,g);
   porticus(x-70,z+20,x+70,z+20,8,8,'corinthian',1,gy+0.3);
   footprints.push({x,z:z+4,w:140,d:48,a:0,c:'#e3d8c2',name:'Casa Dorada'});
   place('ro_domus_aurea','La Casa Dorada','DOMVS AVREA','Después del incendio del 64, Nerón se construyó en el centro de Roma un palacio inmenso, con jardines, viñas, un lago y pabellones con techos de marfil y salas giratorias; en el vestíbulo, su estatua colosal. «Por fin vivo como un hombre», dijo al inaugurarla. Vespasiano devolvió el terreno al pueblo: donde estaba el lago se levanta el anfiteatro, y junto a esta ala del Opio, las termas de Tito. Sus salas pintadas aún se usan. Plinio cuenta que el grupo del Laocoonte está en la casa de Tito; quizá sea aquí.',x-30,z+34,0);}
}
// barrios: manzanas de ínsulas, domus en las colinas y jardines, según RQUART; fuera de esas zonas, ínsulas en los valles y barrio mixto en las colinas
function romaCity(){
  // ocupación del suelo en celdas de 2 m: lo marcado no se puede construir
  const OC=2,occ=new Set(),key=(i,j)=>(i+4000)*10000+(j+4000);
  const markRect=(x,z,w,d,a,m)=>{const W=w+2*(m||0),D=d+2*(m||0),nx=Math.ceil(W/1.8),nz=Math.ceil(D/1.8);for(let i=0;i<=nx;i++)for(let j=0;j<=nz;j++){const p=toW(-W/2+W*i/nx,-D/2+D*j/nz,x,z,a);occ.add(key(Math.floor(p[0]/OC),Math.floor(p[1]/OC)));}};
  const freeRect=(x,z,w,d,a)=>{const W=w-4.4,D=d-4.4,nx=Math.ceil(W/1.8),nz=Math.ceil(D/1.8);for(let i=0;i<=nx;i++)for(let j=0;j<=nz;j++){const p=toW(-W/2+W*i/nx,-D/2+D*j/nz,x,z,a);if(occ.has(key(Math.floor(p[0]/OC),Math.floor(p[1]/OC))))return false;}return true;};
  for(const f of footprints){if(f.r)markRect(f.x,f.z,f.r*2,f.r*2,0,6);else markRect(f.x,f.z,f.w,f.d,f.a||0,f.wall?1:6);}
  for(const r of RHILLS.slice(0,2))markRect(r[0],r[1],r[2]*2,r[3]*2,0);
  markRect(-330,820,90,90,0);   // el monte de ánforas rotas
  markRect(-491,20,100,80,0);   // el patio del Pórtico de Octavia (sin casas dentro)
  markRect(40,198,290,150,0);   // la cima del Palatino es de los emperadores: sin ínsulas
  markRect(-418,280,56,78,0);   // la plaza del Foro Boario, entre Portuno, Hércules y la Porta Trigemina
  for(const p of PLACES)markRect(p.x,p.z,6,6,0);
  for(const p of[[-215,555],[232,-402],[-760,330],[-790,-388],[-675,-296],[-36,-90],[215,-176]])markRect(p[0],p[1],8,8,0);   // sitios de personajes
  const G={H_insa:[],H_insb:[],H_dom:[]},cw=['#c4795a','#b8735a','#d19a7a','#a8624a','#c98a6c'],cp=['#e3d8c2','#e9c9a0','#d8b48a','#efe2c8','#c9a27a'],cr=['#b0563a','#a24d33','#bf6a45','#9a4a35'],tr=[];
  const SZ={H_insa:[22,16],H_insb:[16,14],H_dom:[26,42]};
  let n=0;
  // ¿se puede construir aquí? (dentro de la ciudad, en su zona, fuera del río, de las calzadas y de lo ya ocupado, sin demasiada pendiente)
  const ok=(x,z,w,d,a,Q,trast)=>{
    if(superD(x,z,-222,-42,70,108)<1.12)return false;   // en el Capitolio no se puede vivir (desde Manlio Capitolino, 384 a.C.)
    if(!romaInUrbs(x,z)||inIsla(x,z,6))return false;if(romaQuarter(x,z)!==Q)return false;if((x<romaRiverX(z))!==trast)return false;
    if(romaRiverDist(x,z)<romaRiverW(z)+20)return false;
    let lo=1e9,hi=-1e9;for(const[i,j]of[[-1,-1],[1,-1],[-1,1],[1,1],[0,0],[-1,0],[1,0],[0,-1],[0,1]]){const p=toW(i*w/2,j*d/2,x,z,a),h=romaH(p[0],p[1]);lo=Math.min(lo,h);hi=Math.max(hi,h);if(roadDist(p[0],p[1])<2)return false;}
    if(lo<0.4||hi-lo>4)return false;return freeRect(x,z,w,d,a);};   // más de 4 m de desnivel bajo la planta: la ínsula quedaría medio enterrada ladera arriba
  const put=(k,x,z,a,big)=>{const[w,d]=SZ[k],gy=minGround(x,z,w,d,a);markRect(x,z,w,d,a);
    G[k].push({x,y:gy,z,a,sx:k==='H_dom'?1.45:1,sy:k==='H_dom'?1.2:big?rr(1.02,1.25):rr(0.85,1.08),sz:k==='H_dom'?1.4:1,cw:new THREE.Color(pick(cw)),cp:new THREE.Color(pick(cp)),cr:new THREE.Color(pick(cr))});
    addBox(x,z,w,d,a);footprints.push({x,z,w,d,a,c:k==='H_dom'?'#cdb994':'#b98a6c',house:true});n++;
    if(R()<0.05)TORCH_SPOTS.push(toW(w*0.3,d/2+1,x,z,a));};
  const garden=(x,z)=>{if(R()<0.7&&freeRect(x,z,5,5,0)&&roadDist(x,z)>3){tr.push({x,z,kind:pick(['pine','cypress','plane','cypress'])});markRect(x,z,3,3,0);}};
  // una retícula de manzanas girada A alrededor de (cx, cz); cada fila de manzanas se desplaza al azar para que las calles no sean rectas
  const grid=(cx,cz,rx,rz,A,Q,trast,K0,tall)=>{
    const P={dense:[66,38],campus:[66,40],mixed:[58,44],auto:[62,40],rich:[46,54],horti:[13,13]}[K0],ext=Math.max(rx,rz)+40;
    for(let v=-ext;v<ext;v+=P[1]){const off=rr(0,P[0]);for(let u=-ext-off;u<ext;u+=P[0]){
      const a=A+rr(-0.03,0.03),c=toW(u,v,cx,cz,A);if(Math.hypot((c[0]-cx)/(rx+40),(c[1]-cz)/(rz+40))>1)continue;
      const L=(x,z)=>toW(x,z,c[0],c[1],a),kind=K0==='auto'?(romaH(c[0],c[1])>16?'mixed':'dense'):K0;
      if(kind==='horti'){if(R()<0.3)continue;const h=romaH(c[0],c[1]);if(romaQuarter(c[0],c[1])!==Q||!romaInUrbs(c[0],c[1])||roadDist(c[0],c[1])<4||h<0.4)continue;garden(c[0],c[1]);continue;}
      if(kind==='rich'){const r=R();
        if(r<0.7){const p=L(0,-4);if(ok(p[0],p[1],26,42,a+Math.PI,Q,trast)){put('H_dom',p[0],p[1],a+Math.PI);for(let i=-1;i<=1;i++){const q=L(i*9,21);garden(q[0],q[1]);}continue;}}
        if(r<0.9){for(const s of[-1,1]){const p=L(s*8,-18);if(ok(p[0],p[1],16,14,a+Math.PI,Q,trast))put('H_insb',p[0],p[1],a+Math.PI);}for(let i=-1;i<=1;i++){const q=L(i*12,8+R()*10);garden(q[0],q[1]);}continue;}
        for(let i=0;i<4;i++){const q=L(rr(-20,20),rr(-20,20));garden(q[0],q[1]);}continue;}
      if(kind==='campus'&&R()<0.55)continue;
      if((kind==='mixed'&&R()<0.26)||(kind==='dense'&&!tall&&R()<0.04)){const fa=a+(R()<0.5?0:Math.PI);if(ok(c[0],c[1],26,42,fa,Q,trast)){put('H_dom',c[0],c[1],fa);continue;}}
      if(kind==='mixed'&&R()<0.1)continue;
      // manzana de ínsulas: dos filas espalda con espalda, con las fachadas (y las tiendas) hacia la calle
      const pa=(kind==='dense'?(tall?0.8:0.6):kind==='campus'?0.35:0.25)*(!trast&&Math.hypot((c[0]+80)/1000,(c[1]+150)/850)>0.85?0.3:1),len=P[0]-6;
      for(const s of[-1,1]){let cu=-len/2;while(cu<len/2-8){let k=R()<pa?'H_insa':'H_insb';if(cu+SZ[k][0]>len/2)k='H_insb';const[w,d]=SZ[k];if(cu+w>len/2+2)break;
        if(R()<0.04){cu+=w;continue;}   // un hueco: patio, solar o placita
        const p=L(cu+w/2,s*d/2),fa=a+(s<0?Math.PI:0);if(ok(p[0],p[1],w,d,fa,Q,trast))put(k,p[0],p[1],fa,tall);cu+=w;}}}}};
  for(const Q of RQUART){if(Q[4]==='open')continue;grid(Q[0],Q[1],Q[2],Q[3],Q[5],Q,Q[0]<romaRiverX(Q[1]),Q[4],Q[6]);}
  // el resto: ínsulas en los valles, barrio mixto en las colinas; el Trastévere con su propia orientación, junto al río
  grid(-80,-150,1000,850,0,null,false,'auto');grid(-800,300,330,560,0.32,null,true,'auto');
  if(GLB.ok&&GLB.parts.H_insa_brick){for(const k in G)placeModules(k,G[k],{far:1150,cell:320});}
  else{const geo=new THREE.BoxGeometry(1,1,1);geo.translate(0,0.5,0);const it=[];for(const k in G)for(const b of G[k]){const B=k==='H_insa'?[22,14,16]:k==='H_insb'?[16,11,14]:[26,8.4,42];const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),b.a);it.push({m:new THREE.Matrix4().compose(new THREE.Vector3(b.x,b.y-1,b.z),q,new THREE.Vector3(B[0],B[1]+1,B[2])),c:b.cw});}chunked(geo,WHITE_M,it,{far:1500});}
  // árboles en las laderas sin construir
  for(let i=0;i<2200;i++){const x=rr(-1080,920),z=rr(-1000,800);if(!romaInUrbs(x,z)||romaRiverDist(x,z)<romaRiverW(z)+12||roadDist(x,z)<4)continue;const sl=Math.abs(romaH(x+4,z)-romaH(x-4,z))+Math.abs(romaH(x,z+4)-romaH(x,z-4));if(sl<2.2||R()<0.3)continue;
    if(!freeRect(x,z,8,8,0))continue;tr.push({x,z,kind:pick(['pine','pine','cypress','plane'])});}
  if(GLB.ok)treesGLB(tr.filter(t=>isFree(t.x,t.z,2)));
  ROMA.nHouses=n;ROMA.houses=G;
}
function romaNPCs(){
  const aq=ROMA.aq.reduce((b,p)=>Math.abs(p[0]-600)<Math.abs(b[0]-600)?p:b,ROMA.aq[0]),ax=aq[0]+Math.sin(aq[2])*5,az=aq[1]+Math.cos(aq[2])*5;
  Object.assign(NPC_POS,{
    marcial:[298,64,-Math.PI/2],quintiliano:[-25,35,Math.PI],josefo:[215,-176,-Math.PI/2],epicteto:[430,-76,0],marcelo:[436,-70,-0.6],musonio:[-675,-296,Math.PI/2],
    frontino:[ax,az,0],plinio:[40,-168,0],tacito:[-56,-40,0],dion:[-790,-388,Math.PI],sulpicia:[-215,555,0],rabirio:[28,214,Math.PI/2],atrecto:[-36,-90,-Math.PI/2],
    prisco:[385,64,-Math.PI/2],cornelia:[89,42,-Math.PI/2],hermeros:[-78,46,Math.PI/2],cliente:[603,390,0],pretoriano:[8,92,Math.PI],auriga:[-200,330,Math.PI/2],
    mercader:[romaRiverX(640)+romaRiverW(640)+16,640,-Math.PI/2],termas:[482,-83,0],vigil:[232,-402,0],augur:[-200,-96,0],junia:[-760,330,0],medico:[-508,236,Math.PI/2],
    sarapion:[-525,-362.5,0],licinia:[-62,230,0.4],debora:[-752,347,-Math.PI/2]
  });
  for(const k in NPC_POS){const p=NPC_POS[k],f=findFree(p[0],p[1],0.6);p[0]=f[0];p[1]=f[1];}
}
function romaWalkers(){
  const looks=[{chiton:'#efe9dc',toga:true,himation:'#f3eee2'},{short:true,chiton:'#a89070'},{short:true,chiton:'#c9b48b'},{short:true,chiton:'#8a6a4a'},{short:true,chiton:'#d7c9ab'},
    {female:true,chiton:'#e2d6c0',himation:'#8a3f5e',veil:true},{female:true,chiton:'#efe6d5',himation:'#4f6a7d'},{female:true,chiton:'#d8c9a8',himation:'#6a4d7a',veil:true,carry:'hydria'},{soldier:'nospear',chiton:'#a8392b'},{chiton:'#e9dfc8',himation:'#5c6b5a',beard:true}];
  const boxes=[[-50,110,-45,30],[150,330,-460,-300],[-700,-560,-560,-480],[-520,-380,100,220],[350,460,140,200],[-820,-700,260,420]];
  for(let i=0;i<78;i++){const L=Object.assign({},pick(looks),{hair:pick(['#2b1f17','#3e2c1f','#5b4532','#8d8a85'])});if(!L.female&&!L.soldier)L.beard=R()<0.25;if(L.toga){L.himation='#ece3c9';const q=R();if(q<0.08){L.praetexta=true;L.clavus='lati';}else if(q<0.2)L.clavus='lati';}else if(L.short&&R()<0.06)L.clavus='angusti';if(L.short&&R()<0.2)L.carry=pick(['amphora','basket']);
    const g=makePerson(L),road=i>=60,b=boxes[i<30?0:i<40?1:i<46?2:i<52?3:i<56?4:5];let x,z;
    if(!road){x=rr(b[0],b[1]);z=rr(b[2],b[3]);[x,z]=findFree(x,z,0.5);}
    else{const rd=ROADS[[0,3,1,7,10][i%5]];const s=Math.floor(R()*(rd.pts.length-1)),t=R();x=lerp(rd.pts[s][0],rd.pts[s+1][0],t);z=lerp(rd.pts[s][1],rd.pts[s+1][1],t);g.userData.road=rd;g.userData.seg=s;g.userData.dir=R()<0.5?1:-1;}
    g.position.set(x,terrainH(x,z),z);scene.add(g);walkers.push({g,mode:road?'road':'agora',box:road?null:b,tx:x,tz:z,wait:R()*4,speed:rr(0.9,1.4),phase:R()*10,x,z});}
}

