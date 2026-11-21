// ============================================================ BIOMAS POR REGIÓN (auditoría de identidad, 21/11)
// La lámina de los 186 destinos mostró el mismo suelo, los mismos árboles y el mismo cielo desde Britania hasta Egipto, y la ciudad casi
// nunca a la vista al llegar. Aquí cada destino recibe el paisaje de su región:
//  · color del suelo (la mezcla de tierra y hierba de cada sitio: caliza clara en las Cícladas, tierra roja en Hispania, verde intenso
//    en Britania y Germania, arena ocre en Egipto y África), con más o menos hierba;
//  · árboles propios (si el destino no tiene ya un bosque con sus especies, 123): olivos y pinos en el Ática, plátanos y robles en el
//    norte de Grecia, cipreses en las Jónicas, encinas en Hispania, robles y hayas en el norte del Imperio, palmeras en Egipto y África;
//    y su cantidad (pocos en las Cícladas y en el desierto, muchos en el norte);
//  · bruma del horizonte (gris húmeda en el norte, polvorienta en el desierto, clara sobre el mar en las islas);
//  · al llegar a un destino, la vista se gira sola hacia la ciudad o el santuario que le da nombre.
// Fuentes (resumidas): Teofrasto, Historia de las plantas (árboles por región); Estrabón, Geografía; Plinio, Historia natural; Tácito,
// Agrícola 12 (el cielo de Britania «feo, de lluvias y nieblas»); Heródoto II (Egipto y el Nilo).
const BIO={cur:null,turnT:0,lastIsl:null,palms:new Set(),
  D:{atica:{n:'Ática',dry:'#c4a983',gr:'#8a8f5a',k:0.3,lush:0,trees:['olive','olive','pine'],nT:1},
     pelop:{n:'Peloponeso',dry:'#bba985',gr:'#78874d',k:0.3,lush:0.25,trees:['olive','pine','cypress','plane'],nT:1.1},
     norte_gr:{n:'Grecia central y del norte',dry:'#aaa47b',gr:'#6f8a48',k:0.4,lush:0.5,trees:['plane','plane','pine','cypress'],nT:1.3},
     egeo:{n:'Islas del Egeo',dry:'#d2c9b2',gr:'#9a9a6e',k:0.45,lush:0,trees:['olive','pine'],nT:0.45,haze:'#d6e3ec',hk:0.15},
     jonicas:{n:'Islas Jónicas',dry:'#a9a375',gr:'#5f7f42',k:0.4,lush:0.6,trees:['cypress','olive','olive','plane'],nT:1.4},
     jonia:{n:'Asia Menor',dry:'#c0a87b',gr:'#7c8c4f',k:0.35,lush:0.35,trees:['plane','olive','pine'],nT:1.1},
     egipto:{n:'Egipto y Libia',dry:'#dabf86',gr:'#7d8a45',k:0.6,lush:0,trees:['olive'],nT:0.12,palms:40,haze:'#e8d6ae',hk:0.3},
     estepa:{n:'Mar Negro',dry:'#bfb47c',gr:'#9aa05c',k:0.5,lush:0.35,trees:['plane'],nT:0.25,haze:'#c9ccc4',hk:0.22},
     creta:{n:'Creta',dry:'#c6ad82',gr:'#7f8a52',k:0.3,lush:0.1,trees:['olive','cypress','pine'],nT:1},
     italia:{n:'Italia central',dry:'#aaa075',gr:'#6c8444',k:0.35,lush:0.45,trees:['pine','cypress','olive','plane'],nT:1.2},
     sur:{n:'Sur de Italia e islas',dry:'#c9b485',gr:'#88894f',k:0.35,lush:0.1,trees:['olive','olive','pine'],nT:0.8},
     padana:{n:'Norte de Italia',dry:'#9fa66f',gr:'#5f8a3e',k:0.5,lush:0.8,trees:['plane','cypress','plane'],nT:1.4,haze:'#c8cfd2',hk:0.15},
     hispania:{n:'Hispania',dry:'#c69c6d',gr:'#7c844c',k:0.45,lush:0.15,trees:['olive','olive','pine'],nT:0.9},
     norte:{n:'Galia, Germania y Britania',dry:'#909b64',gr:'#4f7a37',k:0.55,lush:0.95,trees:['plane','plane','pine'],nT:1.6,haze:'#b9c2c8',hk:0.35},
     africa:{n:'África',dry:'#d8b783',gr:'#868a4c',k:0.55,lush:0,trees:['olive'],nT:0.35,palms:25,haze:'#e6d2a8',hk:0.25},
     oriente:{n:'Oriente',dry:'#cab28b',gr:'#83874f',k:0.35,lush:0.1,trees:['olive','cypress'],nT:0.8,palms:8}},
  M:{atenas:{atica:'ciudad maraton decelia laurion pentelico salamina megara citeron escironides platea tebas lebadea calcis',
     pelop:'esparta micenas corinto argos epidauro mantinea olimpia nemea liceo taigeto lerna erimanto estinfalo tenaro itome sicion pilos egio',
     norte_gr:'delfos parnaso termopilas eta larisa tempe pela dodona calidon achelous doride anfisa opunte estagira olinto',
     egeo:'egina delos naxos lesbos melos samos quios rodas tasos lemnos samotracia cos',jonicas:'corcira itaca cefalonia leucade zacinto',
     jonia:'troya efeso mileto halicarnaso sardes cime cnido bizancio',sur:'siracusa386 tarento crotona',egipto:'naucratis menfis cirene',estepa:'olbia panticapeo sinope',
     creta:'creta amniso arcanes gortina festo comos malia lasithi dreros gurnia praiso zacro cidonia samaria moclos licto itanos falasarna aptera eleuterna'},
   roma:{italia:'campania samnium picenum umbria etruria nemi soracte clitumno ciminia caudium ostia tibur praeneste capua cumae pompeii rubico',
     sur:'apulia lucania regium sila tarentum siracusa aetna agrigentum segesta henna selinus caralis aleria melita',
     padana:'aemilia liguria venetia transpadana lunae padus aquileia ravenna mediolanum alpes',
     hispania:'tarraco barcino emporiae ilerda emerita gades cartnova corduba medulas olisipo',
     norte:'massilia nemausus lugdunum alesia londinium caledonia colonia mogontiacum carnuntum eboracum treveri teutoburgum emona salona',
     africa:'cartago caesarea_m cirta zama cyrene',egipto:'alejandria menfis',
     oriente:'corinthus athenae delos ephesus pergamum rhodus antiochia hierosolyma cyprus eleusis smyrna tyrus galilaea'}}};
function bioOf(I){if(!I)return null;const L=BIO.M[MODE]||{};for(const k in L)if((' '+L[k]+' ').includes(' '+I.id+' '))return BIO.D[k];return null;}
// 1. suelo: se mezcla el color de cada punto con el de la región; donde la región es húmeda, más puntos pasan a hierba (manchas, no uniforme)
{const f=buildIslandMesh;buildIslandMesh=function(I){f.apply(this,arguments);try{const B=bioOf(I);if(!B||!I.mesh)return;const a=I.mesh.geometry.attributes.color,p=I.mesh.geometry.attributes.position;
  const dry=new THREE.Color(B.dry),gr=new THREE.Color(B.gr),c=new THREE.Color();
  for(let i=0;i<a.count;i++){c.setRGB(a.getX(i),a.getY(i),a.getZ(i));const x=p.getX(i),z=p.getZ(i),h=p.getY(i);if(h<-0.5)continue;
    const green=c.g-c.r*0.93>0.005,rock=Math.abs(c.r-c.g)<0.03&&Math.abs(c.g-c.b)<0.05&&c.r<0.62;if(rock)continue;
    let tgt=green?gr:dry;if(!green&&B.lush>0&&h>2){const n=fbm(x*0.012+7.3,z*0.012-2.1);if(n<B.lush*0.9)tgt=gr;}
    const v=0.95+hash(x*0.21,z*0.17)*0.1;c.lerp(tgt,tgt===gr&&!green?Math.max(B.k,0.6):B.k);a.setXYZ(i,c.r*v,c.g*v,c.b*v);}
  a.needsUpdate=true;}catch(e){console.warn('bioma suelo',I&&I.id,e);}};}
// 2. árboles de la región (solo donde no hay ya un bosque con especies propias) y palmeras en Egipto, África y Oriente
{const f=destTrees;destTrees=function(I,n,kinds){const B=bioOf(I);if(!B||(typeof FORESTS!=='undefined'&&FORESTS[I.id]))return f.apply(this,arguments);
  const r=f.call(this,I,Math.max(4,Math.round(n*B.nT)),B.trees);try{if(B.palms&&!BIO.palms.has(I.id)&&typeof crPalm==='function'){BIO.palms.add(I.id);let c=0;
    for(let k=0;k<B.palms*6&&c<B.palms;k++){const a=Math.random()*TAU,d=40+Math.random()*I.R*0.9,x=I.x+Math.cos(a)*d,z=I.z+Math.sin(a)*d,h=terrainH(x,z);if(h<1.5||h>40)continue;
      if(I.pads&&I.pads.some(p=>Math.hypot(x-p.x,z-p.z)<p.r+8))continue;if(typeof isFree==='function'&&!isFree(x,z,2))continue;const g=crPalm(x,z,0.8+Math.random()*0.5,Math.random()<0.2);if(g&&!g.parent)scene.add(g);c++;}}}catch(e){console.warn('palmeras',e);}
  return r;};}
// 3. bruma del horizonte de la región (se aplica justo antes de dibujar, sobre el color que haya calculado el cielo)
{const f=renderer.render.bind(renderer);const hz=new THREE.Color();renderer.render=function(s,c){try{const B=BIO.cur;if(B&&B.haze&&s===scene&&scene.fog){hz.set(B.haze);scene.fog.color.lerp(hz,B.hk*(typeof DAYF!=='undefined'?Math.max(0.3,DAYF):1));}}catch(e){}return f(s,c);};}
// 4. al llegar a un destino (cualquier viaje: barco, carretero, plano), la vista gira sola hacia la ciudad o el lugar que le da nombre
function bioTick(dt){if(typeof ui==='undefined'||ui!=='play')return;const P=player,I=typeof islandOf==='function'?islandOf(P.x):null;
  if(I!==BIO.lastIsl){const was=BIO.lastIsl;BIO.lastIsl=I;BIO.cur=bioOf(I);
    if(I&&I!==was){const t=I.town||{x:I.x,z:I.z};let dx=t.x-P.x,dz=t.z-P.z;if(Math.hypot(dx,dz)<25){dx=I.x-P.x;dz=I.z-P.z;}if(Math.hypot(dx,dz)>25){BIO.turn={to:Math.atan2(-dx,-dz),t:0};}}}
  if(BIO.turn){const T=BIO.turn,now=performance.now();if(!T.t0)T.t0=now;const el=(now-T.t0)/1000;if(el<0.6)return;let d=T.to-P.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));const st=Math.min(1,Math.max(dt,(now-(T.last||now))/1000)*2.2);T.last=now;P.yaw+=d*st;if(Math.abs(d)<0.02||el>4||(keys&&(keys.a||keys.d)))BIO.turn=null;}}
{const f=uxTick;uxTick=function(dt){f(dt);try{bioTick(dt);}catch(e){}};}
