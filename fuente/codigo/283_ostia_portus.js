// ============================================================ OSTIA: EL TÍBER Y EL PUERTO DE CLAUDIO (modo Roma, 80 d.C.) (28/11)
// Fuentes: Suetonio, Claudio 20; Plinio, Historia natural XVI 201-202 y XXXVI 70 (la nave del obelisco); Tácito, Anales XV 18 (la
// tempestad del 62); la inscripción de Claudio del año 46 sobre los canales (CIL XIV 85); J.-C. Golvin, Ciudades del mundo antiguo,
// pp. 122-123 («Ostia, puertos de Claudio y de Trajano»). En el 80 solo existe el de Claudio: el hexágono de Trajano es del 100-112.
// Antes: Ostia no tenía río, el faro estaba tierra adentro (r3Lighthouse en x = +0,42 R, con el mar al oeste) y la llegada por mar caía
// en un islote redondo en medio del agua (la llegada por defecto, a −0,72 R, quedaba mar adentro).
// Coordenadas locales: el mar, al oeste (x < −175); el norte, −z. El Tíber viene del este, al norte de la ciudad y de la Vía Ostiense
// (que va por la orilla izquierda, como la real), y desemboca al norte del pueblo; el puerto, mar adentro, más al norte.
const OST={built:false,land:[
  [-175,-500,-300,-505,7,2.2],[-300,-505,-420,-468,7,2.2],   // el brazo norte del puerto
  [-175,-246,-300,-252,7,2.2],[-300,-252,-410,-292,7,2.2],   // el brazo sur
  [-470,-392,-470,-362,14,2.6]]};                            // la isla del faro, sobre la nave hundida
{const f=islandBase;islandBase=function(I,x,z){let h=f(I,x,z);if(I.id!=='ostia')return h;const lx=x-I.x,lz=z-I.z;if(lx>-160||lz<-530||lz>-230)return h;
  for(const[ax,az,bx,bz,hw,H]of OST.land){const dx=bx-ax,dz=bz-az,t=clamp(((lx-ax)*dx+(lz-az)*dz)/(dx*dx+dz*dz||1),0,1),d=Math.hypot(lx-ax-dx*t,lz-az-dz*t);
    const v=d<hw?1.2+H*(1-(d/hw)*(d/hw)):1.2-(d-hw)*0.35;if(v>h)h=v;}return h;};}
if(typeof SIMPLE_RO!=='undefined'&&SIMPLE_RO.ostia){const O=SIMPLE_RO.ostia,e=O.extra;O.arr=[-120,60];
  O.extra=function(I){e.call(this,I);try{ostPortus(I);}catch(err){console.warn('ostia',err);}};}
function ostPortus(I){const X=x=>I.x+x,Z=z=>I.z+z,P=(id,name,gr,txt,x,z,rot)=>place(id,name,gr,txt,X(x),Z(z),rot||0),lime=M.limestone,brick=lam('#b5764a');
  // ---------------- el Tíber y los canales de Claudio
  addRiver([[560,-312],[440,-282],[320,-258],[200,-232],[90,-205],[-20,-186],[-120,-174],[-230,-178]].map(p=>[X(p[0]),Z(p[1])]),34,{name:'El Tíber'});
  addRiver([[-60,-186],[-110,-250],[-150,-300],[-200,-328]].map(p=>[X(p[0]),Z(p[1])]),14,{name:'El canal de Claudio'});
  for(const[x,z,a]of[[150,-222,0.25],[300,-252,0.2]])makeShip(X(x),Z(z),Math.PI/2+a);
  P('tiber_ostia','La boca del Tíber','TIBERIS','El río de Roma llega al mar entre bancos de arena que cambian cada invierno: por eso los barcos grandes no pueden entrar. Las mercancías se pasan a barcazas, que suben los treinta kilómetros hasta Roma remolcadas desde la orilla por bueyes y hombres. Ostia está en la orilla izquierda, como el camino de Roma, la Vía Ostiense.',90,-150,0);
  P('canal_claudio','Los canales de Claudio','FOSSAE','Claudio mandó excavar canales desde el Tíber hasta el puerto nuevo. Una inscripción del año 46 dice que con ellos libró a Roma del peligro de las inundaciones, porque el río crecido podía desahogarse hacia el mar.\n(CIL XIV 85; Golvin, p. 123, n.º 10)',-55,-140,0);
  // la barca para cruzar el río: no hay puente en la boca del Tíber
  {const s=[X(40),Z(-152)],n=[X(40),Z(-236)];
   const b=new THREE.Group(),hull=new THREE.Mesh(new THREE.BoxGeometry(3,0.9,8),lam('#6b4a2e'));hull.position.y=0.45;b.add(hull);b.position.set(X(46),0.1,Z(-195));scene.add(b);
   egxObj(s[0],s[1],undefined,()=>egxTeleport(n[0],n[1],undefined,Math.PI,'El barquero empuja con la pértiga y la barca cruza el río entre las barcazas. En la otra orilla empieza el camino del puerto de Claudio.'),'La barca del Tíber','cruzar a la otra orilla',3);
   egxObj(n[0],n[1],undefined,()=>egxTeleport(s[0],s[1],undefined,0,'Vuelves en la barca a la orilla de Ostia.'),'La barca del Tíber','volver a Ostia',3);
   P('barca_tiber','La barca','TRAIECTVS','No hay puente en la boca del Tíber: para ir de Ostia al puerto nuevo se cruza el río en barca, pagando unas monedas al barquero.',40,-138,0);}
  // ---------------- el puerto de Claudio: dos brazos curvos, una isla con el faro, muelles y almacenes
  {const L=[];for(const[ax,az,bx,bz]of OST.land.slice(0,4)){const n=Math.ceil(Math.hypot(bx-ax,bz-az)/6);for(let i=0;i<n;i++){const t=(i+0.5)/n,x=X(ax+(bx-ax)*t),z=Z(az+(bz-az)*t);
      L.push([new THREE.BoxGeometry(9,0.3,6.4),new THREE.Matrix4().makeRotationY(Math.atan2(bx-ax,bz-az)).setPosition(x,Math.max(1.9,floorAt(x,z))+0.05,z)]);}}
   const m=new THREE.Mesh(mergeGeos(L),lam('#cdbf9f'));m.receiveShadow=true;scene.add(m);}
  {const x=X(-470),z=Z(-377),gy=floorAt(x,z),g=grp(x,gy,z,0),w=lam('#e8dfcc');
   box(14,16,14,w,0,8,0,g);box(11,11,11,w,0,21.5,0,g);box(8.5,9,8.5,w,0,31.5,0,g);const c=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.8,7,12),w);c.position.y=39.5;g.add(c);
   const fire=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));fire.scale.set(6,9,1);fire.position.y=46;g.add(fire);addBox(x,z,14,14,0);
   place('faro_portus','El faro de Claudio','PHARVS PORTVS','Para hacer el cimiento de la isla de la entrada, Claudio mandó hundir, lleno de piedra, el barco gigantesco que había traído de Egipto el obelisco del Vaticano: el mayor que se había visto en el mar, según Plinio. Encima levantó una torre muy alta, a imitación del Faro de Alejandría, con fuegos que de noche guían a los barcos. Tiene cuatro pisos, cada uno más estrecho que el de abajo; arriba arde el fuego al aire libre.\n(Suetonio, Claudio 20; Plinio, Historia natural XVI 201-202; Golvin, p. 123, n.º 2)',x+12,z+14,0);}
  {const x=X(-404),z=Z(-288),gy=floorAt(x,z);box(3,6,3,lime,x,gy+3,z);statue(x,gy+6,z,-Math.PI/2,5,'bronze');addBox(x,z,3,3,0);
   place('coloso_portus','Una estatua colosal','SIGNVM','Las monedas y los relieves del puerto muestran una estatua gigantesca junto al faro. No se sabe dónde estaba ni a quién representaba: el sitio, al final del brazo sur, es una hipótesis, como en la reconstrucción de Golvin.\n(Golvin, p. 123, n.º 3)',x+8,z+10,0);}
  P('portus_claudio','El puerto de Claudio','PORTVS AVGVSTI','Como la boca del Tíber se llena de arena, Claudio construyó un puerto nuevo, mar adentro, al norte del río: dos brazos curvos que abrazan el agua y, en la entrada, una isla con un faro. Lo empezó en el 42 y lo inauguró Nerón. Mide más de un kilómetro, tiene unos dos kilómetros y medio de muelles y caben unos doscientos barcos. Pero no es seguro: en el año 62, una tempestad hundió unas doscientas naves dentro del mismo puerto. Dentro de veinte años, Trajano excavará detrás otro puerto más resguardado, en forma de hexágono.\n(Suetonio, Claudio 20; Tácito, Anales XV 18; Golvin, p. 123, n.os 1 y 4)',-150,-420,Math.PI/2);
  {const q=[];for(let z=-488;z<=-262;z+=6){if(z>-345&&z<-312)continue;q.push([new THREE.BoxGeometry(8,3.4,6.4),new THREE.Matrix4().makeTranslation(X(-180),0.2,Z(z))]);}   // el muelle de la orilla (sin cortar el canal)
   const m=new THREE.Mesh(mergeGeos(q),lime);m.receiveShadow=true;scene.add(m);for(const[z0,z1]of[[-488,-345],[-312,-262]])addPlat(X(-180),Z((z0+z1)/2),8,z1-z0,0,1.9);}
  for(let i=0;i<4;i++)for(let j=0;j<2;j++)blockBuilding({name:'Almacenes del puerto (horrea)',x:X(-145+j*44),z:Z(-470+i*30),rot:Math.PI/2,w:24,d:36,h:7,mat:brick});
  P('horrea_portus','Los almacenes del puerto','HORREA','Hileras de almacenes de ladrillo para el trigo de Egipto y de África, el aceite de Hispania y el vino de la Galia. Cuando un barco llega, lo remolca una barca de remos hasta su muelle, marcado con un número en una columna; si no hay sitio, espera fondeado y lo descargan con barcas pequeñas. Hay grúas, estibadores y hasta buceadores que rescatan lo que cae al agua. Alrededor está naciendo un barrio nuevo, Porto.\n(Golvin, p. 123, n.º 8)',-100,-332,0);
  for(const[x,z,a]of[[-260,-420,0.3],[-330,-360,1.6],[-240,-300,-0.4],[-380,-430,2.2],[-300,-470,0.1],[-560,-340,1.4]])makeShip(X(x),Z(z),a);
  OST.built=true;}
