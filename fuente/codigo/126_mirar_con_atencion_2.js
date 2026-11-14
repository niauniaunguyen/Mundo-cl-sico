// ============================================================ MIRAR CON ATENCIÓN (2): con el clic derecho, y muchas más cosas que mirar con su definición
// Mantén el clic derecho (o Q) para mirar; clic izquierdo o E: la ficha completa. Bajo la mira ya sale una primera definición.
// Se añaden: edificios con nombre (definición del glosario o de su estela), casas, árboles por especie, flores silvestres, animales salvajes, mariposas y lagartijas.
{const st=document.createElement('style');st.textContent='#atLay .nm i.df{display:block;max-width:min(520px,80vw);white-space:normal;font:italic 13px Georgia,serif;color:#efe2c8;margin:4px auto 0;line-height:1.35}';document.head.appendChild(st);}
addEventListener('mousedown',e=>{if(e.button===2&&ui==='play'&&state&&!(typeof PH!=='undefined'&&PH.on)){e.preventDefault();atShow(true);}
  else if(e.button===0&&AT.on){e.preventDefault();e.stopImmediatePropagation();if(AT.cur)atCardShow();}},true);
addEventListener('mouseup',e=>{if(e.button===2&&AT.on)atShow(false);},true);
addEventListener('contextmenu',e=>{if(ui==='play'||AT.on)e.preventDefault();});
// árboles: se registran al plantarlos (sin tocar el azar), en una rejilla de 30 m
const TRG=new Map();function trRec(x,z,k){const key=Math.floor(x/30)+','+Math.floor(z/30);let a=TRG.get(key);if(!a){a=[];TRG.set(key,a);}a.push([x,z,k]);}
{const tg0=treesGLB;treesGLB=function(list){try{for(const t of list)if(t&&isFinite(t.x))trRec(t.x,t.z,t.kind);}catch(e){}return tg0(list);};}
const TREE_DEF={
 olive:['Olivo','El árbol de Atenea: lo hizo brotar en la Acrópolis cuando ganó a Poseidón el patronazgo de Atenas. Los olivos sagrados, las moriai, son de la diosa: arrancar uno se juzga en el Areópago (Lisias, discurso 7). Su aceite es el premio de las Panateneas.','Da aceite para comer, para la lámpara y para el cuerpo en las termas. Columela lo llama «el primero de todos los árboles» (Sobre la agricultura 5, 8).'],
 wolive:['Acebuche','El olivo silvestre. Con sus ramas se tejen las coronas de los vencedores de Olimpia.','El olivo silvestre. Con sus ramas se tejen las coronas de los vencedores de Olimpia.'],
 cypress:['Ciprés','El árbol de los muertos: se planta junto a las tumbas, y sus ramas adornan la casa en duelo. Dicen que el joven Cipariso, que mató sin querer a su ciervo querido, se convirtió en ciprés de pena.','Los romanos ponen una rama de ciprés en la puerta de la casa donde hay un muerto, para avisar a los que pasan (Plinio, Historia natural 16, 139).'],
 pine:['Pino','De él salen la resina para sellar las ánforas y calafatear los barcos y la madera de los remos. El tirso de las ménades termina en una piña.','Árbol de Cibeles: su compañero Atis se convirtió en pino, y en marzo un pino cortado entra en procesión en su templo (Ovidio, Fastos 4). Las piñas dan piñones para los postres.'],
 bpine:['Pino negro','Alto y recto, crece en los montes y da la mejor pez para los barcos.','Alto y recto, crece en los montes (en la Sila, el laricio) y da la mejor pez para los barcos.'],
 plane:['Plátano','El árbol de la sombra: Sócrates y Fedro conversan tumbados bajo un plátano junto al Iliso (Platón, Fedro 230b). En los gimnasios se plantan en hileras para pasear.','Los romanos ricos lo traen de Grecia solo por su sombra y hasta lo riegan con vino, cuenta Plinio (Historia natural 12, 8).'],
 fir:['Abeto','Madera recta y ligera: de abeto se hacen los mástiles, los remos largos y las vigas de los techos.','Madera recta y ligera: de abeto se hacen los mástiles, los remos largos y las vigas de los techos.'],
 cedar:['Cedro','Su madera huele bien y no se pudre: se usa para templos, estatuas de culto y cofres.','Su madera huele bien y no se pudre: se usa para templos, estatuas de culto y cofres; el aceite de cedro protege los libros de la polilla.'],
 oak:['Roble','El árbol de Zeus: en Dodona el dios habla por el rumor de sus hojas. Los arcadios dicen que sus antepasados vivían de bellotas.','El árbol de Júpiter. La corona de hojas de roble, la corona cívica, se da a quien salva la vida de un ciudadano en la batalla.'],
 holm:['Encina','De hoja dura y siempre verde; sus bellotas engordan a los cerdos y su leña da el mejor carbón.','De hoja dura y siempre verde; sus bellotas engordan a los cerdos y su leña da el mejor carbón.'],
 beech:['Haya','Un árbol de los montes frescos del norte; sus frutos, los hayucos, se dan a los cerdos.','Virgilio empieza sus Bucólicas con un pastor tumbado «bajo la cubierta de un haya frondosa» (1, 1).'],
 chestnut:['Castaño','Sus castañas se comen asadas o en harina en las aldeas de montaña.','Sus castañas se comen asadas o en harina en las aldeas de montaña.'],
 laurel:['Laurel','El árbol de Apolo: la Pitia masca sus hojas antes de profetizar, y los vencedores de Delfos se coronan con él.','El árbol de Apolo y de la victoria: el general que celebra un triunfo lleva una corona de laurel, y junto a la puerta de la casa de Augusto se plantaron dos laureles (Res Gestae 34).'],
 wpoplar:['Álamo blanco','El árbol de Heracles, que lo trajo de la orilla del Aqueronte: en Olimpia solo se quema su leña en los sacrificios a Zeus (Pausanias 5, 14, 2).','El árbol de Hércules: sus vencedores se coronan con álamo.']};
const FLOWER_DEF={'#c8302a':['Amapola','La flor de Deméter y del sueño: crece entre el trigo, y de su jugo se saca un remedio para dormir.','Flor de Ceres, entre las mieses. Livio cuenta que Tarquinio el Soberbio, sin decir palabra, cortó con su bastón las amapolas más altas de su jardín para que su hijo entendiera que debía acabar con los principales de una ciudad (1, 54).'],
 '#f2efe4':['Manzanilla','Flor pequeña y olorosa: los médicos la usan en infusiones y cataplasmas.','Flor pequeña y olorosa: los médicos la usan en infusiones y cataplasmas.'],
 '#8a5ab0':['Anémona','Dicen que nació de la sangre de Adonis, el amado de Afrodita: las atenienses lo lloran en verano, en las Adonias, con jardincillos en macetas que suben al tejado.','Ovidio cuenta que Venus la hizo nacer de la sangre de Adonis: una flor hermosa que dura poco, porque el viento la deshoja (Metamorfosis 10, 735-739).'],
 '#e8c838':['Crisantemo silvestre','Flor amarilla de los campos en primavera, que las cabras mordisquean.','Flor amarilla de los campos en primavera, que las cabras mordisquean.'],
 '#d9a83a':['Margarita amarilla','Flor de los ribazos secos en verano.','Flor de los ribazos secos en verano.'],
 '#b07ad0':['Cardo','Sus flores moradas pinchan; los burros lo comen, y de algunos cardos se comen las pencas.','Sus flores moradas pinchan; los burros lo comen, y de algunos cardos se comen las pencas.'],
 '#b89ad8':['Azafrán silvestre','De sus estigmas rojos se saca un tinte amarillo y un perfume muy caros: de azafrán son las túnicas de las niñas que sirven a Ártemis en Braurón.','De sus estigmas rojos se saca un tinte y un perfume muy caros: en los teatros se rocía al público con agua de azafrán.'],
 '#f5f0d8':['Narciso','Perséfone cogía narcisos en un prado cuando la tierra se abrió y Hades se la llevó (Himno homérico a Deméter).','Ovidio cuenta que el joven Narciso se enamoró de su propio reflejo y se convirtió en esta flor (Metamorfosis 3).'],
 '#e8d040':['Flor amarilla de invierno','Una de las pocas flores que se abren con el frío.','Una de las pocas flores que se abren con el frío.']};
const HOUSE_DEF=['Una casa','Las casas de Atenas son de adobe sobre un zócalo de piedra, cerradas a la calle y abiertas a un patio interior; las ventanas a la calle son pocas y pequeñas.','La mayoría de los romanos viven de alquiler en ínsulas, bloques de varios pisos con tiendas abajo; los ricos, en una domus con atrio y peristilo.'];
// definición de un edificio: su estela, o el glosario (la palabra más larga que aparezca en el nombre)
const BLD_C=new Map();function bldDef(nm){if(BLD_C.has(nm))return BLD_C.get(nm);const n=nm.toLowerCase();let r=null;
  const P=PLACES.find(p=>p.name&&(p.name.toLowerCase()===n||n.includes(p.name.toLowerCase())||p.name.toLowerCase().includes(n)));if(P)r=P.text;
  if(!r){let best=null,bl=0;for(const G of GLOSS){for(const k of G[1]){if(k.length>bl&&new RegExp('(^|[^a-záéíóúñ])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'($|[^a-záéíóúñ])').test(n)){best=G;bl=k.length;}}}if(best)r=best[2];}
  BLD_C.set(nm,r);return r;}
function atShort(t){const s=atFirst(t);return s.length>150?s.slice(0,147).replace(/\s\S*$/,'')+'…':s;}
const atC0=atCands;atCands=function(){const C=atC0(),P=player,ro=MODE==='roma',M=ro?2:1;
  try{
  // edificios con nombre y casas
  for(const f of footprints){if(f.reserve||!isFinite(f.x))continue;const dx=f.x-P.x,dz=f.z-P.z;if(Math.abs(dx)>140||Math.abs(dz)>140)continue;const rr2=f.r||Math.max(f.w||0,f.d||0)/2;if(rr2<2)continue;
    if(f._gy===undefined)f._gy=floorAt(f.x,f.z);if(f.name){const t=bldDef(f.name);C.push({x:f.x,y:f._gy+Math.min(8,rr2*0.5),z:f.z,r:rr2*0.75,far:160,bias:0.5,name:f.name,sub:'edificio',def:t?atShort(t):'',txt:()=>t?atFirst(t)+' '+atFirst(t.slice(atFirst(t).length).trim()):'Un edificio. Busca su estela para saber más.'});}
    else if(f.house&&Math.hypot(dx,dz)<70)C.push({x:f.x,y:f._gy+2.5,z:f.z,r:rr2*0.8,far:70,bias:0.6,name:HOUSE_DEF[0],sub:ro?'insula o domus':'oikía',txt:()=>HOUSE_DEF[M]});}
  // árboles
  const cx=Math.floor(P.x/30),cz=Math.floor(P.z/30);for(let i=cx-2;i<=cx+2;i++)for(let j=cz-2;j<=cz+2;j++){const a=TRG.get(i+','+j);if(!a)continue;for(const q of a){const[x,z,k]=q;const D=TREE_DEF[k];if(!D)continue;if(Math.abs(x-P.x)>55||Math.abs(z-P.z)>55)continue;if(q[3]===undefined)q[3]=terrainH(x,z)+3.2;C.push({x,y:q[3],z,r:2.2,far:55,bias:0.35,name:D[0],sub:'árbol',txt:()=>D[M]});}}
  // flores silvestres
  if(typeof NAT2!=='undefined')for(const f of NAT2.pts){const D=FLOWER_DEF[f[3]];if(!D)continue;if(Math.hypot(f[0]-P.x,f[1]-P.z)>22)continue;C.push({x:f[0],y:f[2]+0.3,z:f[1],r:0.9,far:22,bias:0.25,name:D[0],sub:'flor silvestre',txt:()=>D[M]});}
  // animales salvajes, mariposas y lagartijas
  if(typeof WFA!=='undefined')for(const A of WFA.list){const g=A.g;if(!g.visible)continue;const I=(FAUNA_INFO[A.k]||{})[ro?'R':'A'];if(!I)continue;C.push({obj:g,x:g.position.x,y:g.position.y+0.6,z:g.position.z,r:A.k==='hare'?0.5:1,name:I[0],sub:'animal salvaje',txt:()=>I[1]+(I[2]?' ('+I[2]+')':'')});}
  if(typeof NAT2!=='undefined'){for(const b of NAT2.bf)if(b.on)C.push({x:b.x,y:b.y,z:b.z,r:0.45,far:20,name:'Mariposa',sub:'insecto',def:'En griego se llama psyché, la misma palabra que «alma».',txt:()=>'En griego, mariposa se dice psyché, la misma palabra que «alma»: por eso se pinta a veces el alma de un muerto como una mariposa que sale volando. Los romanos la llaman papilio.'});
    for(const L of NAT2.lz)if(L.on&&L.g.visible)C.push({x:L.g.position.x,y:L.g.position.y+0.1,z:L.g.position.z,r:0.4,far:18,name:'Lagartija',sub:'reptil',def:'Toma el sol en las piedras y huye en cuanto te mueves.',txt:()=>ro?'Toma el sol en las piedras y huye en cuanto te mueves. Praxíteles esculpió a un Apolo joven a punto de cazar una lagartija con una flecha: el Apolo Sauróctono, del que en Roma hay copias.':'Toma el sol en las piedras y huye en cuanto te mueves.'});}
  // las demás cosas: su definición corta bajo la mira
  }catch(e){console.warn('atCands+',e);}
  return C;};
// elegir: cada cosa con su alcance y su prioridad (personas y objetos antes que flores, árboles y edificios)
atPick=function(){const cam=camera,P=new THREE.Vector3(),D=new THREE.Vector3();cam.getWorldPosition(P);cam.getWorldDirection(D);let best=null,bs=1e9;
  for(const c of atCands()){const vx=c.x-P.x,vy=c.y-P.y,vz=c.z-P.z,d=Math.hypot(vx,vy,vz);if(d<0.5||d>(c.place?420:c.far||60))continue;const cos=(vx*D.x+vy*D.y+vz*D.z)/d;if(cos<0.6)continue;
    const ang=Math.acos(Math.min(1,cos)),thr=Math.atan(c.r/d)+(c.place?0.01:0.035);if(ang>thr)continue;const sc=ang/thr+(c.place?1.2:0)+(c.bias||0)+d/400;if(sc<bs){bs=sc;best=c;}}
  return best;};
