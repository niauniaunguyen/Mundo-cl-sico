// ============================================================ LA GRANJA: amistad con un viejo campesino, herencia y vida de granja
// (parcelas que se aran, siembran, riegan y cosechan según el calendario real; árboles, animales, elaboración, venta, mejoras, cansancio y sueño)
const FARM={ok:false,x:0,z:0,plots:[],objs:[],vis:{},farmer:null,beeG:null};
const CROPS={
 atenas:{trigo:{n:'Trigo',sow:[9,10,11],days:10,water:false,y:3,col:'#d9b44a',k:'grain'},cebada:{n:'Cebada',sow:[9,10,11,0],days:8,water:false,y:3,col:'#cdb466',k:'grain'},
  habas:{n:'Habas',sow:[9,10,11,0],days:7,water:false,y:3,col:'#4f7a34',k:'veg'},lentejas:{n:'Lentejas',sow:[0,1,10,11],days:7,water:false,y:3,col:'#8a7a3a',k:'veg'},
  garbanzos:{n:'Garbanzos',sow:[1,2,3],days:6,water:false,y:3,col:'#b8a050',k:'veg'},pepinos:{n:'Pepinos',sow:[3,4,5],days:4,water:true,y:4,col:'#3f7a2a',k:'veg'},
  cebollas:{n:'Cebollas y ajos',sow:[6,7,8,9],days:5,water:true,y:4,col:'#c9a0b0',k:'veg'}},
 roma:{trigo:{n:'Escanda (far)',sow:[9,10,11],days:10,water:false,y:3,col:'#d9b44a',k:'grain'},cebada:{n:'Cebada',sow:[9,10,11,0],days:8,water:false,y:3,col:'#cdb466',k:'grain'},
  habas:{n:'Habas',sow:[9,10,0],days:7,water:false,y:3,col:'#4f7a34',k:'veg'},lentejas:{n:'Lentejas',sow:[0,1,2],days:7,water:false,y:3,col:'#8a7a3a',k:'veg'},
  coles:{n:'Coles',sow:[1,2,3,7,8],days:5,water:true,y:4,col:'#5a9a4a',k:'veg'},pepinos:{n:'Pepinos',sow:[3,4,5],days:4,water:true,y:4,col:'#3f7a2a',k:'veg'},
  nabos:{n:'Nabos',sow:[6,7,8],days:4,water:false,y:4,col:'#e8e0d0',k:'veg'}}};
const ITEMS={trigo:['saco de trigo',3],cebada:['saco de cebada',2],habas:['cesta de habas',2],lentejas:['saco de lentejas',2],garbanzos:['saco de garbanzos',2],pepinos:['cesta de pepinos',1],cebollas:['ristra de cebollas y ajos',1],coles:['cesta de coles',1],nabos:['cesta de nabos',1],
 aceitunas:['cesta de aceitunas',1],aceite:['ánfora de aceite',6],uvas:['cesta de uvas',1],vino:['ánfora de vino',7],higos:['cesta de higos',1],huevos:['docena de huevos',2],leche:['cántaro de leche',1],queso:['queso',5],miel:['tarro de miel',6]};
const crops=()=>CROPS[MODE==='roma'?'roma':'atenas'];
function farmz(){if(!state.farm||typeof state.farm!=='object')state.farm={};const f=state.farm;
  if(f.q===undefined)Object.assign(f,{q:0,aff:0,talkDay:0,own:false,plots:[],inv:{},seeds:{},en:100,day:state.day||1,up:{},hens:4,goats:2,eggs:0,milk:0,honey:0,olD:-99,viD:-99,fiD:-99,must:[],offerDay:0,earn:0,shrine:0});
  while(f.plots.length<12)f.plots.push({st:'raw'});return f;}
const farmPlots=()=>farmz().up.plots?12:8;
const FCOST={arar:12,sembrar:5,regar:4,cosechar:8,recoger:3,elaborar:5};
const FTXT={atenas:{farmer:'Lamprias',ftitle:'campesino del demo de Colono',offerPlace:'eleusinion',offerName:'el Eleusinion, el santuario de Deméter en la ciudad',god:'Deméter',
  intro:'Un viejo de manos como raíces se endereza apoyado en la azada. «¿Un forastero por aquí? Soy Lamprias. Esta tierra era de mi padre y del padre de mi padre. Mi hijo, Nicias, cayó hace ocho años en la guerra de Corinto, y ahora estoy solo con cuatro gallinas y dos cabras. ¿Me echas una mano? Hay tres parcelas de trigo que se me van a pasar».',
  legal:'«Escucha bien, que esto es serio. Tú eres forastero, y un forastero no puede tener tierra en el Ática: solo los ciudadanos, o quien recibe ese derecho por un decreto de la Asamblea. Así que la finca será de mi sobrino Dexileo, que vive en la ciudad y no distingue un arado de un remo. He hablado con él delante de testigos: te la arrienda de por vida por un óbolo al año. Tú la trabajas, y lo que saques es tuyo».',
  sub:'En Atenas solo los ciudadanos podían poseer tierra; los metecos necesitaban un privilegio especial (énktesis). El arrendamiento de fincas era muy común, y se conservan contratos grabados en piedra.',src:'Jenofonte, Económico; Iseo, discursos sobre herencias; inscripciones de arriendos del Ática (IG II² 2492 y otras).',
  bye:'«Me voy a vivir con mi hija, en la ciudad, junto al Cerámico. Iré a verte en las fiestas. Cuida de las cabras: la blanca da coces».'},
 roma:{farmer:'Ofelio',ftitle:'veterano y campesino de la vía Apia',offerPlace:'ro_saturno',offerName:'el templo de Saturno, el dios de las siembras, en el Foro',god:'Saturno',
  intro:'Un hombre mayor, con una cicatriz en la frente, deja el azadón. «Salve. Me llamo Ofelio. Serví veinticinco años en la Legión V y me dieron estas yugadas al licenciarme. Mi hijo murió en Judea, en el asedio de Jerusalén. Ahora estamos solos el huerto y yo. ¿Me ayudas? Tengo tres parcelas de escanda que no puedo segar solo».',
  legal:'«Escucha bien, que esto es serio. Eres peregrino, no ciudadano romano, y la ley no te deja recibir un legado en un testamento. Pero hay una manera: el fideicomiso. Dejo la finca a mi sobrino Marco, ciudadano, y le ruego por escrito, por su buena fe, que te la entregue a ti. Lo he hecho ante siete testigos con sus sellos. Marco es honrado; y si no lo fuera, el pretor obliga a cumplir los fideicomisos».',
  sub:'Los peregrinos no podían recibir herencias ni legados según el derecho civil romano, pero sí fideicomisos, hasta que Adriano lo prohibió. Augusto hizo obligatorio cumplirlos.',src:'Gayo, Instituciones II 285; Columela, Sobre la agricultura; Catón, Sobre la agricultura.',
  bye:'«Me voy a Roma, a vivir con la familia de Marco, junto al Aventino. Pasaré por aquí en las Saturnales. Y no dejes que los gorriones se coman la simiente».'}};
const ftxt=()=>FTXT[MODE==='roma'?'roma':'atenas'];
// consejo del mes: Hesíodo en Atenas; Catón, Varrón, Columela y Virgilio en Roma
const FMES={atenas:[['Pleno invierno: «el mes de Leneón, días malos que desollarían a un buey». Quédate en casa, repara los aperos y cuida de los animales.','Hesíodo, Trabajos y días 504-535'],
  ['Aún es invierno. Las lentejas y los garbanzos se siembran ahora. Prepara el arado para la primavera.','Hesíodo, Trabajos y días 427-436'],
  ['«Cuando aparece la golondrina, poda las viñas antes de que llegue»: es primavera. Siembra garbanzos.','Hesíodo, Trabajos y días 564-570'],
  ['Primavera avanzada: siembra pepinos en el huerto, junto al pozo, y riégalos cada día.','Hesíodo, Trabajos y días 571-581'],
  ['«Cuando salen las Pléyades, hijas de Atlas, empieza la siega». Corta el trigo y la cebada.','Hesíodo, Trabajos y días 383-384'],
  ['Trilla en la era cuando sople el viento y guarda el grano en tinajas.','Hesíodo, Trabajos y días 597-600'],
  ['«En la estación del cardo y de la cigarra», siéntate a la sombra. Siembra cebollas y ajos y riégalos. Los higos maduran.','Hesíodo, Trabajos y días 582-596'],
  ['Final del verano: cosecha los higos y prepara la viña.','Hesíodo, Trabajos y días 609-614'],
  ['«Cuando Orión y Sirio llegan al centro del cielo, corta los racimos y llévalos a casa»: es la vendimia.','Hesíodo, Trabajos y días 609-611'],
  ['«Cuando oigas la voz de la grulla que grita cada año desde las nubes, es la señal de arar y sembrar». Siembra trigo, cebada y habas.','Hesíodo, Trabajos y días 448-451'],
  ['Sigue arando y sembrando antes de las lluvias fuertes. Empieza la recogida de la aceituna.','Hesíodo, Trabajos y días 458-464'],
  ['Comienzo del invierno: termina de sembrar y recoge las aceitunas antes de que las heladas las estropeen.','Hesíodo, Trabajos y días 479-492']],
 roma:[['Invierno: Catón manda reparar los aperos, hacer cestos y limpiar los establos. «El padre de familia debe ser vendedor, no comprador».','Catón, Sobre la agricultura 2 y 39'],
  ['Siembra lentejas y planta coles. Abona los prados.','Columela II 10; Catón 156-157 (elogio de la col)'],
  ['Poda las viñas y cava alrededor de los olivos. Planta coles.','Columela IV y V; Virgilio, Geórgicas II 397-419'],
  ['Primavera: siembra pepinos y riega el huerto.','Columela XI 3'],
  ['Comienza la siega de la cebada. Cuida de que los animales tengan pasto.','Varrón, Sobre la agricultura I 32'],
  ['Siega el trigo y trilla en la era, al sol y al viento.','Varrón I 51-52; Virgilio, Geórgicas I 178-186'],
  ['Pleno verano: siembra nabos, que se recogen en otoño. Guarda el grano en el granero.','Columela II 10; Plinio, Historia natural XVIII 125-132'],
  ['Prepara las tinajas y los lagares para la vendimia. Siembra coles y nabos.','Catón 23'],
  ['Vendimia: pisa la uva en el lagar y guarda el mosto en las tinajas.','Catón 23-26; Varrón I 54'],
  ['«Cuando las Pléyades se ocultan al alba», siembra el trigo. Siembra también cebada y habas.','Virgilio, Geórgicas I 219-226'],
  ['Recoge la aceituna en cuanto caiga: cuanto antes se prense, mejor aceite.','Catón 64-65'],
  ['Termina la recogida de la aceituna y prénsala. Celebra las Saturnales.','Catón 64-67; Macrobio, Saturnales I 7']]};
const fmes=()=>FMES[MODE==='roma'?'roma':'atenas'][calNow().mo];
// ---- lugar: una zona llana fuera de la ciudad, cerca de la Academia (Atenas) o de la vía Apia (Roma)
function farmFind(){const anc=placeAt(MODE==='roma'?'ro_appia':'academia');if(!anc)return null;
  const ok=(cx,cz)=>{if(Math.abs(cx-INNER.x)>INNER.size/2-70||Math.abs(cz-INNER.z)>INNER.size/2-70)return false;let mn=1e9,mx=-1e9;
    for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){const x=cx+i*6,z=cz+j*5.5;if(MODE==='roma'?romaInUrbs(x,z):insideWalls(x,z,30))return false;const h=terrainH(x,z);if(floorAt(x,z)>h+0.05||riverWater(x,z)!==null||!isFree(x,z,1.4))return false;mn=Math.min(mn,h);mx=Math.max(mx,h);if(mx-mn>3)return false;}return true;};
  for(let r=60;r<=520;r+=20)for(let k=0;k<24;k++){const a=k/24*TAU+r*0.01,x=anc.x+Math.cos(a)*r,z=anc.z+Math.sin(a)*r;if(ok(x,z))return[x,z];}return null;}
function fW(lx,lz){return[FARM.x+lx,FARM.z+lz];}
function farmSetup(){if(FARM.ok)return;const p=farmFind();if(!p)return;FARM.ok=true;FARM.x=p[0];FARM.z=p[1];const T=ftxt();
  let q=fW(-14,-12);blockBuilding({name:MODE==='roma'?'Villa rústica':'Casa de la finca',x:q[0],z:q[1],rot:0,w:12,d:8,h:3.6,mat:M.limestone,door:true});
  egxObj(q[0]+2,q[1]+5.2,undefined,'f:house',MODE==='roma'?'La casa de la granja':'La casa de la granja','dormir · cocina · libro de la finca');
  q=fW(-4,-12);for(let k=0;k<5;k++){const x=q[0]+(k%3)*1.2,z=q[1]+Math.floor(k/3)*1.2,c=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.32,1.1,10),lam('#b5603a'));c.position.set(x,floorAt(x,z)+0.55,z);scene.add(c);}addBox(q[0]+1.2,q[1]+0.6,3.4,2.4,0);
  egxObj(q[0]+1.2,q[1]+2.6,undefined,'f:store','El almacén','vender · semillas · mejoras');
  // parcelas: 3 filas de 4 (la tercera, con la mejora)
  const fur=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#4a3424';x.fillRect(0,0,64,64);x.fillStyle='#2e2016';for(let i=0;i<8;i++)x.fillRect(0,i*8+5,64,3);return new THREE.CanvasTexture(c);})();
  FARM.mats={raw:lam('#5f5530'),tilled:new THREE.MeshLambertMaterial({map:fur,color:'#a89888'}),sown:new THREE.MeshLambertMaterial({map:fur,color:'#8a7a68'}),off:lam('#6e6a48')};
  const stalk=new THREE.CylinderGeometry(0.035,0.05,1,5),ball=new THREE.SphereGeometry(0.22,8,6);
  for(let i=0;i<12;i++){const lx=2+(i%4)*4.2,lz=-6+Math.floor(i/4)*4.4,w=fW(lx,lz),y=floorAt(w[0],w[1]);
    const base=new THREE.Mesh(new THREE.PlaneGeometry(3.4,3.4),FARM.mats.raw);base.rotation.x=-Math.PI/2;base.position.set(w[0],y+0.08,w[1]);scene.add(base);
    for(let k=0;k<16;k++){const t=k/16*4,sx=k<4?-1.8+t:k<8?1.8:k<12?1.8-(t-2):-1.8,sz=k<4?-1.8:k<8?-1.8+(t-1):k<12?1.8:1.8-(t-3);const r=new THREE.Mesh(new THREE.DodecahedronGeometry(0.16,0),M.stone);r.position.set(w[0]+sx*1,floorAt(w[0]+sx,w[1]+sz)+0.08,w[1]+sz);scene.add(r);}
    const plants=[];for(let k=0;k<9;k++){const g=new THREE.Group();const px=w[0]-1.1+(k%3)*1.1,pz=w[1]-1.1+Math.floor(k/3)*1.1;g.position.set(px,floorAt(px,pz)+0.05,pz);
      for(let s=0;s<4;s++){const m=new THREE.Mesh(stalk,lam('#6a8a3a'));m.position.set((s%2-0.5)*0.18,0.5,(Math.floor(s/2)-0.5)*0.18);m.rotation.z=(s-1.5)*0.08;g.add(m);}
      const b=new THREE.Mesh(ball,lam('#4f7a34'));b.position.y=0.2;g.add(b);g.visible=false;scene.add(g);plants.push(g);}
    const o=egxObj(w[0],w[1],undefined,'f:plot:'+i,'Parcela '+(i+1),'',2.3);FARM.plots.push({base,plants,o,x:w[0],z:w[1]});}
  // pozo, era, altar, gallinero, corral, olivos, viña, higuera
  q=fW(-2,2);{const y=floorAt(q[0],q[1]);const c=new THREE.Mesh(new THREE.CylinderGeometry(0.9,1,0.9,14,1,true),M.stone);c.material=M.stone;c.position.set(q[0],y+0.45,q[1]);scene.add(c);box(0.1,1.8,0.1,M.wood,q[0]-0.8,y+0.9,q[1]);box(0.1,1.8,0.1,M.wood,q[0]+0.8,y+0.9,q[1]);box(1.8,0.1,0.1,M.wood,q[0],y+1.8,q[1]);addCirc(q[0],q[1],1);}
  egxObj(q[0]+1.6,q[1],undefined,'f:well','El pozo','agua para regar');
  q=fW(22,-12);{const m=new THREE.Mesh(new THREE.CircleGeometry(4,24),lam('#cdbf9c'));m.rotation.x=-Math.PI/2;m.position.set(q[0],floorAt(q[0],q[1])+0.05,q[1]);scene.add(m);}
  egxObj(q[0],q[1],undefined,'f:era',MODE==='roma'?'La era (area)':'La era (hálōs)','donde se trilla el grano',3);
  q=fW(-22,-4);{const y=floorAt(q[0],q[1]);box(0.9,1,0.9,M.limestone,q[0],y+0.5,q[1]);if(MODE==='roma')box(0.5,0.5,0.5,M.stone,q[0],y+1.25,q[1]);else box(0.35,1.1,0.35,M.marble,q[0],y+1.55,q[1]);addBox(q[0],q[1],0.9,0.9,0);}
  egxObj(q[0]+1.5,q[1],undefined,'f:shrine',MODE==='roma'?'El altar de los lares del campo':'El altar de Deméter','ofrendas');
  q=fW(-16,6);{const y=floorAt(q[0],q[1]);blockBuilding({name:'Gallinero',x:q[0],z:q[1],rot:0,w:3,d:2.4,h:1.6,mat:M.wood,door:false});}
  FARM.hensAt=fW(-16,9);egxObj(q[0]+2.2,q[1]+1,undefined,'f:coop','El gallinero','huevos');
  q=fW(-8,9);{const y=floorAt(q[0],q[1]);for(let k=0;k<14;k++){const a=k/14*TAU;box(0.1,1,0.1,M.wood,q[0]+Math.cos(a)*3,y+0.5,q[1]+Math.sin(a)*3);addCirc(q[0]+Math.cos(a)*3,q[1]+Math.sin(a)*3,0.15);}}
  FARM.penAt=q;egxObj(q[0]+3.6,q[1],undefined,'f:pen','El corral de las cabras','leche');
  {const L=[];for(let k=0;k<6;k++){const w=fW(-18+k*3.4,17);L.push({x:w[0],z:w[1],kind:'olive',k:1.2,collide:true});}if(GLB.ok)treesGLB(L);const w=fW(-10,19.5);egxObj(w[0],w[1],undefined,'f:olives','El olivar','aceitunas',4);}
  q=fW(12,18);if(typeof vinesAt==='function')vinesAt(q[0],q[1],12,6);egxObj(q[0]-7,q[1],undefined,'f:vines','La viña','uvas',3.5);
  q=fW(-22,10);if(GLB.ok)treesGLB([{x:q[0],z:q[1],kind:'plane',k:0.7,collide:true}]);egxObj(q[0]+1.5,q[1],undefined,'f:figs','La higuera','higos');
  q=fW(-27,-14);placeLive('granja',MODE==='roma'?'Una finca de la vía Apia':'Una finca del demo de Colono',MODE==='roma'?'VILLA RVSTICA':'ΑΓΡΟΣ',MODE==='roma'?'Las fincas pequeñas del suburbio de Roma abastecen la ciudad de verduras, huevos, leche y flores. Columela y Varrón escriben tratados enteros sobre cómo llevarlas: qué sembrar cada mes, cómo cuidar los animales, cómo elegir al capataz.':'Fuera de las murallas, entre la Academia y el demo de Colono, hay pequeñas fincas familiares de cereal, olivos, viña y huerto. Hesíodo y Jenofonte, en su Económico, cuentan cómo se trabajaban.',q[0],q[1],0);
  const f=farmz();FARM.hens=[];FARM.goats=[];farmAnimals();
  // el viejo campesino, mientras la finca no sea tuya
  if(!f.own){q=fW(4,-9);const g=makePerson({noVary:true,chiton:MODE==='roma'?'#8a7a5a':'#a08a62',short:true,noHimation:true,beard:true,beardC:'#d8d0c2',hair:'#c8c0b4',staff:true});g.position.set(q[0],floorAt(q[0],q[1]),q[1]);g.rotation.y=Math.PI;scene.add(g);addCirc(q[0],q[1],0.4);
    FARM.farmer=g;egxObj(q[0],q[1],undefined,'f:farmer',T.farmer,T.ftitle);
    if(f.q<=1){[0,1,2].forEach(i=>{const P=f.plots[i];if(!P.st||P.st==='raw'){P.st='ripe';P.crop='trigo';P.g=99;}});}}
  farmDraw();}
function farmAnimals(){const f=farmz();if(!FARM.ok)return;
  while(FARM.hens.length<f.hens){const x=FARM.hensAt[0]+rr(-2,2),z=FARM.hensAt[1]+rr(-1,2),F=faunaAdd('hen',x,z,{r:3});if(!F)break;FARM.hens.push(F);}
  while(FARM.goats.length<f.goats){const x=FARM.penAt[0]+rr(-1.5,1.5),z=FARM.penAt[1]+rr(-1.5,1.5),F=faunaAdd('goat',x,z,{r:2});if(!F)break;FARM.goats.push(F);}
  if(f.up.bees&&!FARM.beeG){const q=fW(-24,15);FARM.beeG=new THREE.Group();for(let k=0;k<4;k++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,1.1,10),lam('#b0603a'));c.rotation.z=Math.PI/2;c.position.set((k%2)*1.2,0.45+Math.floor(k/2)*0.62,0);FARM.beeG.add(c);}FARM.beeG.position.set(q[0],floorAt(q[0],q[1]),q[1]);scene.add(FARM.beeG);egxObj(q[0]+1.5,q[1]+1.5,undefined,'f:bees','Las colmenas','miel');}}
// ---- dibujo de las parcelas
function farmDraw(){if(!FARM.ok)return;const f=farmz(),C=crops(),n=farmPlots();
  FARM.plots.forEach((V,i)=>{const P=f.plots[i],on=i<n;V.base.visible=true;V.base.material=!on?FARM.mats.off:P.st==='raw'?FARM.mats.raw:P.st==='tilled'?FARM.mats.tilled:FARM.mats.sown;
    const c=P.crop&&C[P.crop],k=P.st==='ripe'?1:P.st==='sown'&&c?Math.min(1,(P.g||0)/c.days):0;
    V.plants.forEach(g=>{g.visible=on&&(P.st==='sown'||P.st==='ripe');if(!g.visible)return;const grain=c&&c.k==='grain',ripe=P.st==='ripe',hh=(grain?1.1:0.55)*(0.15+0.85*k);
      g.children.forEach((m,j)=>{if(j<4){m.visible=grain||j<2;m.scale.set(1,hh,1);m.position.y=hh/2;m.material=lam(ripe&&grain?c.col:'#6a8a3a');}else{m.visible=!grain;m.scale.setScalar(0.4+0.8*k);m.position.y=0.15+0.2*k;m.material=lam(ripe?c.col:'#5f8a3a');}});});
    const tag=!on?'(sin uso: compra la mejora)':P.st==='raw'?'sin arar':P.st==='tilled'?'arada, lista para sembrar':P.st==='ripe'?c.n+', ¡madura!':c?c.n+' · '+Math.round(k*100)+' %'+(c.water&&!P.w&&!farmRain()?' · necesita agua':''):'';
    V.o.data.name='Parcela '+(i+1)+' · '+tag;});}
// ---- tiempo: crecimiento, animales y lluvia al pasar los días
function farmRain(){const mo=calNow().mo;return mo>=10||mo<=2;}
function farmDay(){const f=farmz(),C=crops();let n=0;while(f.day<state.day&&n<12){f.day++;n++;const rain=farmRain();
    f.plots.forEach((P,i)=>{if(P.st!=='sown')return;const c=C[P.crop];if(!c){P.st='tilled';return;}if(!c.water||P.w||rain)P.g=(P.g||0)+1;P.w=false;if(P.g>=c.days)P.st='ripe';});
    f.eggs=Math.min(48,(f.eggs||0)+f.hens*(calNow().mo>=10||calNow().mo<=0?1:2));f.milk=Math.min(16,(f.milk||0)+f.goats);if(f.up.bees&&f.day%3===0)f.honey=Math.min(8,(f.honey||0)+1);
    f.must=(f.must||[]).filter(m=>{if(f.day>=m){f.inv.vino=(f.inv.vino||0)+1;return false;}return true;});}
  if(n){f.en=fMax();save();farmDraw();}}
function farmTick(){if(!FARM.ok||!state)return;const f=farmz();if(f.day<state.day)farmDay();
  if(f.own){nbSpawn();const cn=calNow(),fs=frurNow();if(fs.length&&f.festNote!==cn.year+':'+cn.mo&&ui==='play'&&Math.hypot(player.x-FARM.x,player.z-FARM.z)<90){f.festNote=cn.year+':'+cn.mo;save();toast('<span class="label">Fiesta del campo</span><br>Este mes: '+fs.map(x=>x.n).join(' y ')+'. Celébrala en el altar de la finca.');}}
  if(!f.seen&&ui==='play'&&Math.hypot(player.x-FARM.x,player.z-FARM.z)<70){f.seen=1;save();toast('<span class="label">Una finca</span><br>Un viejo campesino trabaja solo su tierra. Quizá le venga bien una ayuda.');}
  if(!FARM.t||performance.now()-FARM.t>4000){FARM.t=performance.now();farmDraw();}}
// ---- interacción
const fMax=()=>100+5*(qLv('ar')-1);
function fSpend(k){const f=farmz(),cn=calNow(),c=k==='arar'?(f.plowMo===cn.year+':'+cn.mo?3:f.up.ox?5:12):k==='cosechar'&&f.up.sickle?5:FCOST[k];if(f.en<c){toast('Estás agotado. Ve a la casa a dormir: mañana tendrás fuerzas.');return false;}f.en-=c;return true;}
function fHearts(a){return '♥'.repeat(Math.min(5,a))+'♡'.repeat(Math.max(0,5-a));}
function fInvTxt(){const f=farmz(),L=Object.keys(f.inv).filter(k=>f.inv[k]>0);return L.length?L.map(k=>f.inv[k]+' × '+ITEMS[k][0]).join(', '):'nada';}
function fPrice(k){const ev=typeof todayEvent==='function'?todayEvent():null,mk=!!ev&&(ev.id==='noumenia'||ev.id==='nundinas'),f=farmz(),cn=calNow();let x=mk?1.5:1;if((k==='trigo'||k==='cebada')&&f.grainMo===cn.year+':'+cn.mo)x*=1.5;if(k==='trigo'&&f.up.mill)x*=1.5;x*=1+0.02*(qLv('lo')-1);return{p:ITEMS[k][1]*x,mk};}
function farmAct(o){if(o.act.startsWith('f:nb:'))return nbTalk(o);const f=farmz(),T=ftxt(),C=crops(),mon=MODE==='roma'?'sestercios':'óbolos',act=o.act,B=$('dBody');
  const one=casaOpen('❀',o.data.name,(f.own?'Tu granja':'La granja de '+T.farmer)+' · fuerzas '+f.en+'/'+fMax()),back=()=>farmAct(o),done=(h)=>{B.innerHTML=h;$('dOpts').innerHTML='';one('Seguir',back);one('Cerrar',closeDialog);save();updateStats();farmDraw();};
  const mine=f.own||(act.startsWith('f:plot:')&&f.q===1&&+act.split(':')[2]<3);
  if(act==='f:farmer')return farmerTalk(o);
  if(!mine&&act!=='f:shrine'){B.innerHTML='<p>Esto es de '+T.farmer+'. Habla con él.</p>';one('Cerrar',closeDialog);return;}
  if(act.startsWith('f:plot:')){const i=+act.split(':')[2],P=f.plots[i];
    if(i>=farmPlots()){B.innerHTML='<p>Esta parcela está sin trabajar desde hace años. Con la mejora «más tierra», del almacén, podrás usarla.</p>';one('Cerrar',closeDialog);return;}
    const c=P.crop&&C[P.crop];
    if(P.st==='raw'){B.innerHTML='<p>Tierra dura, con hierbas. Hay que ararla antes de sembrar'+(f.up.ox?': con el buey es rápido.':'. Sin buey, con el arado a mano, cuesta mucho.')+'</p>';one('Arar ('+(f.up.ox?5:12)+' de fuerza)',()=>{if(!fSpend('arar'))return;P.st='tilled';gfStep();done('<p>Abres surcos rectos, de un extremo al otro. La tierra huele a lluvia.</p>');},'quiz');}
    else if(P.st==='tilled'){const mo=calNow().mo,ok=Object.keys(C).filter(k=>C[k].sow.includes(mo));B.innerHTML='<p>Tierra arada. Este mes se puede sembrar: '+(ok.length?ok.map(k=>C[k].n.toLowerCase()).join(', '):'nada; espera al mes que viene')+'.</p><p class="sub">Tus semillas: '+(Object.keys(f.seeds).filter(k=>f.seeds[k]>0).map(k=>f.seeds[k]+' de '+C[k].n.toLowerCase()).join(', ')||'ninguna (cómpralas en el almacén)')+'. Consejo del mes: '+fmes()[0]+'</p>';
      ok.forEach(k=>{if((f.seeds[k]||0)>0)one('Sembrar '+C[k].n.toLowerCase()+' ('+C[k].days+' días'+(C[k].water?', hay que regar':'')+')',()=>{if(!fSpend('sembrar'))return;f.seeds[k]--;P.st='sown';P.crop=k;P.g=0;P.w=false;done('<p>Echas la semilla a voleo y la cubres con el rastrillo. '+(C[k].water?'Necesitará agua cada día, salvo cuando llueva.':'Con las lluvias le basta.')+'</p>');},'quiz');});}
    else if(P.st==='sown'){B.innerHTML='<p>'+c.n+': '+Math.round(Math.min(1,P.g/c.days)*100)+' % de crecimiento. '+(c.water?(P.w||farmRain()?'Hoy ya tiene agua.':'Hoy aún no la has regado.'):'No necesita riego.')+'</p>';if(c.water&&!P.w&&!farmRain())one('Regar con agua del pozo (4 de fuerza)',()=>{if(!fSpend('regar'))return;P.w=true;splash&&splash(P?FARM.plots[i].x:0,FARM.plots[i].z,false);done('<p>Vacías los cántaros al pie de las plantas. La tierra se oscurece.</p>');},'quiz');}
    else if(P.st==='ripe'){B.innerHTML='<p>'+c.n+' a punto. Hay que cosecharlo antes de que se estropee.</p>';one('Cosechar (8 de fuerza)',()=>{if(!fSpend('cosechar'))return;const bonus=f.blessDay&&f.day-f.blessDay<15?(qLv('eu')>=6?2:1):0;const y=c.y+bonus;
      if(f.own)f.inv[P.crop]=(f.inv[P.crop]||0)+y;P.st='raw';P.crop=null;P.g=0;
      if(f.q===1){f.reaped=(f.reaped||0)+1;if(f.reaped>=3){f.q=2;toast('<span class="label">'+T.farmer+'</span><br>Ya está todo segado. Ve a hablar con él.');}}
      done('<p>'+(c.k==='grain'?'Siegas con la hoz, atas las gavillas y las llevas a la era.':'Arrancas y llenas los cestos.')+' '+(f.own?'+'+y+' '+ITEMS[P.crop||'trigo'][0]+(bonus?' ('+(bonus>1?'dos':'una')+' de más: '+T.god+' está contenta)':'')+'.':'Es para '+T.farmer+'.')+'</p>');},'quiz');}
    one('Cerrar',closeDialog);return;}
  if(act==='f:house'){const mo=calNow().mo,adv=fmes();B.innerHTML='<p>Una casa sencilla de adobe y piedra, con un hogar, un telar y un lagar pequeño. Fuerzas: '+f.en+'/'+fMax()+'.</p><p class="sub">Consejo del mes: '+adv[0]+' <i>('+adv[1]+')</i></p>';
    one('Dormir hasta el amanecer',()=>{const dh=(24-clock.h)+6;addHours(dh);updateSky();farmDay();f.en=fMax();save();farmDraw();const L=f.plots.slice(0,farmPlots()).filter(P=>P.st==='ripe').length;done('<p>Duermes en el jergón junto al hogar. Al amanecer cantan los gallos.'+(farmRain()?' Ha llovido por la noche: el huerto está regado.':'')+'</p><p class="sub">'+(L?L+' parcela'+(L>1?'s':'')+' madura'+(L>1?'s':'')+'. ':'')+(f.eggs?f.eggs+' huevos en el gallinero. ':'')+(f.milk?f.milk+' cántaros de leche. ':'')+'Fuerzas al máximo.</p>');},'quiz');
    if((f.milk||0)>=3)one('Hacer queso (3 de leche → 1 queso)',()=>{if(!fSpend('elaborar'))return;f.milk-=3;f.inv.queso=(f.inv.queso||0)+1;done('<p>Cuajas la leche con jugo de higuera, la escurres en un cesto de mimbre y la salas. Mañana será queso.</p>');});
    if((f.inv.aceitunas||0)>=3)one('Prensar aceitunas (3 cestas → 1 ánfora de aceite)',()=>{if(!fSpend('elaborar'))return;f.inv.aceitunas-=3;f.inv.aceite=(f.inv.aceite||0)+1;done('<p>Trituras las aceitunas con la piedra de molino, metes la pasta en capachos y la prensas con la viga. El primer aceite, el más fino, sale verde y amargo.</p>');});
    if((f.inv.uvas||0)>=3)one('Pisar la uva (3 cestas → mosto, que en 5 días será vino)',()=>{if(!fSpend('elaborar'))return;f.inv.uvas-=3;f.must=f.must||[];f.must.push(f.day+5);done('<p>Pisas la uva en el lagar y el mosto cae a la tinaja. Fermentará unos días.</p>');});
    one('El libro de la finca',()=>farmBook(o));one('Cerrar',closeDialog);return;}
  if(act==='f:store'){B.innerHTML='<p>En el almacén guardas: '+fInvTxt()+'.</p><p class="sub">'+(fPrice('trigo').mk?'¡Hoy es día de mercado: todo se vende a mejor precio!':'Los días de mercado ('+(MODE==='roma'?'las nundinae':'la noumenia')+') se vende más caro.')+' Tienes '+state.obols+' '+mon+'.</p>';
    const L=Object.keys(f.inv).filter(k=>f.inv[k]>0);if(L.length)one('Vender todo en el mercado',()=>{let tot=0;for(const k of L){tot+=fPrice(k).p*f.inv[k];f.inv[k]=0;}tot=Math.round(tot);state.obols+=tot;f.earn=(f.earn||0)+tot;if(tot>0&&!f.sold1){f.sold1=1;qAdd('kl',2,'Tu granja empieza a dar fruto.');}done('<p>Un arriero lo carga en el carro y lo baja al mercado. Vuelve con '+tot+' '+mon+'.</p><p class="sub">Ganancias de la granja: '+f.earn+' '+mon+'.</p>');},'quiz');
    const seeds=()=>{const mo=calNow().mo;B.innerHTML='<p>Un vecino te vende simiente. Cada saco siembra una parcela y cuesta 1 '+(MODE==='roma'?'sestercio':'óbolo')+'. Tienes '+state.obols+' '+mon+'.</p>';$('dOpts').innerHTML='';Object.keys(C).forEach(k=>one(C[k].n+(C[k].sow.includes(mo)?' (se siembra este mes)':'')+' · tienes '+(f.seeds[k]||0),()=>{if(state.obols<1){toast('No tienes dinero.');return;}state.obols--;f.seeds[k]=(f.seeds[k]||0)+1;save();updateStats();seeds();},C[k].sow.includes(mo)?'quiz':''));one('Volver',back);};
    one('Comprar semillas',seeds);
    one('Mejoras para la granja',()=>{B.innerHTML='<p>¿Qué quieres comprar?</p>';$('dOpts').innerHTML='';
      const buy=(k,txt,cost,fn)=>one(txt+' · '+cost+' '+mon+(f.up[k]?' (ya lo tienes)':''),()=>{if(f.up[k]&&k!=='hen'&&k!=='goat')return;if(state.obols<cost){toast('No tienes bastante dinero.');return;}state.obols-=cost;fn();save();updateStats();farmAnimals();farmDraw();done('<p>Hecho.</p>');});
      buy('ox','Un buey para arar (arar cansa mucho menos)',40,()=>f.up.ox=1);buy('plots','Más tierra: 4 parcelas más',30,()=>f.up.plots=1);buy('bees','Colmenas (miel cada tres días)',25,()=>f.up.bees=1);
      buy('hen','Dos gallinas más',8,()=>f.hens+=2);buy('goat','Una cabra más',12,()=>f.goats+=1);one('Volver',back);});
    one('Cerrar',closeDialog);return;}
  if(act==='f:coop'){B.innerHTML='<p>'+f.hens+' gallinas picotean. '+(f.eggs?'Hay '+f.eggs+' huevos en los nidales.':'Hoy aún no han puesto.')+'</p>';if(f.eggs>=12)one('Recoger los huevos',()=>{if(!fSpend('recoger'))return;const d=Math.floor(f.eggs/12);f.inv.huevos=(f.inv.huevos||0)+d;f.eggs-=d*12;done('<p>Recoges '+d*12+' huevos en un cesto con paja.</p>');},'quiz');else if(f.eggs)one('Esperar a tener una docena',closeDialog);one('Cerrar',closeDialog);return;}
  if(act==='f:pen'){B.innerHTML='<p>'+f.goats+' cabras. '+(f.milk?'Tienen las ubres llenas: '+f.milk+' cántaros de leche.':'Ya las has ordeñado.')+'</p>';if(f.milk)one('Ordeñar y guardar un cántaro para vender',()=>{if(!fSpend('recoger'))return;f.milk--;f.inv.leche=(f.inv.leche||0)+1;done('<p>Ordeñas sentado en un taburete bajo. La cabra blanca intenta darte una coz.</p>');},'quiz');one('Cerrar',closeDialog);return;}
  if(act==='f:bees'){B.innerHTML='<p>Las abejas zumban entre el tomillo. '+(f.honey?f.honey+' panales listos.':'Aún no hay panales.')+'</p>'+(MODE==='roma'?'':'<p class="sub">La miel del monte Himeto, junto a Atenas, era la más famosa de Grecia.</p>');if(f.honey)one('Sacar la miel (con humo, para calmarlas)',()=>{if(!fSpend('recoger'))return;f.inv.miel=(f.inv.miel||0)+f.honey;f.honey=0;done('<p>Ahumas las colmenas y cortas los panales. Te pica una abeja en la mano.</p>');},'quiz');one('Cerrar',closeDialog);return;}
  const tree=(k,item,months,n,txt,key)=>{const mo=calNow().mo;if(!months.includes(mo)){B.innerHTML='<p>'+txt[0]+'</p>';one('Cerrar',closeDialog);return;}if(f.day-f[key]<20){B.innerHTML='<p>Ya lo has cosechado esta temporada.</p>';one('Cerrar',closeDialog);return;}
    B.innerHTML='<p>'+txt[1]+'</p>';one('Cosechar (8 de fuerza)',()=>{if(!fSpend('cosechar'))return;f[key]=f.day;f.inv[item]=(f.inv[item]||0)+n;done('<p>'+txt[2]+' +'+n+' '+ITEMS[item][0]+'.</p>');},'quiz');one('Cerrar',closeDialog);};
  if(act==='f:olives')return tree('ol','aceitunas',[10,11,0],6,['Los olivos aún tienen la aceituna verde y pequeña. Se recoge de noviembre a enero.','Las aceitunas están negras y brillantes.','Vareas las ramas con una caña y recoges las aceitunas de las mantas extendidas en el suelo.'],'olD');
  if(act==='f:vines')return tree('vi','uvas',[7,8],farmz().vinBonus===calNow().year?9:6,['Las uvas aún están verdes. La vendimia es a finales del verano.','Los racimos cuelgan, morados y llenos de avispas.','Cortas los racimos con la podadera y llenas los cestos.'],'viD');
  if(act==='f:figs')return tree('fi','higos',[6,7],4,['La higuera aún no tiene higos maduros. Maduran en pleno verano.','Los higos están blandos y abiertos.','Recoges los higos con cuidado: se aplastan enseguida.'],'fiD');
  if(act==='f:well'){B.innerHTML='<p>Agua fresca a unos metros de profundidad. Con ella riegas el huerto. Para regar una parcela, ve a ella y elige «Regar».</p><p class="sub">Las fincas del Ática y del Lacio dependían de las lluvias de invierno; en verano solo se regaba el huerto, con agua de pozos y cisternas.</p>';one('Cerrar',closeDialog);return;}
  if(act==='f:era'){B.innerHTML='<p>La era: un círculo de tierra apisonada y piedras donde se trilla el grano. Los animales lo pisan dando vueltas, y luego se avienta con la pala contra el viento para separar el grano de la paja.</p><p class="sub">'+(MODE==='roma'?'Varrón, Sobre la agricultura I 51-52.':'Hesíodo, Trabajos y días 597-608.')+'</p>';one('Cerrar',closeDialog);return;}
  if(act==='f:shrine'){const mo=calNow().mo,can=!f.blessDay||f.day-f.blessDay>=15;B.innerHTML='<p>'+(MODE==='roma'?'Un pequeño altar a los lares del campo y a Ceres, junto a la piedra que marca el límite de la finca, sagrada para el dios Término.':'Un pequeño altar de piedra con una herma, junto al campo. Aquí se ofrecen a Deméter las primicias: el primer grano, el primer aceite.')+'</p>';
    if(f.own)for(const FS of frurNow())one('Celebrar '+FS.n,()=>{frurDo(FS);done('<p>'+FS.t+'</p><p class="sub">'+FS.fx+' ('+FS.s+')</p>');},'quiz');
    if(f.own&&can)one('Ofrecer primicias (1 producto del almacén)',()=>{const k=Object.keys(f.inv).find(k=>f.inv[k]>0);if(!k){toast('No tienes nada que ofrecer: guarda algo de la cosecha.');return;}f.inv[k]--;f.blessDay=f.day;qAdd('eu',1);done('<p>Dejas en el altar '+ITEMS[k][0]+' y una guirnalda. Durante quince días, cada cosecha te dará algo más.</p>');},'quiz');one('Cerrar',closeDialog);return;}}
function farmBook(o){const f=farmz(),C=crops(),mo=calNow().mo,mon=MODE==='roma'?'sestercios':'óbolos',adv=fmes(),one=casaOpen('❀','El libro de la finca','Mes de '+calNow().mes),B=$('dBody');
  const L=f.plots.slice(0,farmPlots()).map((P,i)=>'Parcela '+(i+1)+': '+(P.st==='raw'?'sin arar':P.st==='tilled'?'arada':P.st==='ripe'?C[P.crop].n+', madura':C[P.crop].n+', '+Math.round(Math.min(1,P.g/C[P.crop].days)*100)+' %')).join(' · ');
  B.innerHTML='<p><b>Consejo del mes:</b> '+adv[0]+' <i>('+adv[1]+')</i></p><p><b>Se siembra este mes:</b> '+(Object.keys(C).filter(k=>C[k].sow.includes(mo)).map(k=>C[k].n.toLowerCase()).join(', ')||'nada')+'. <b>Se cosecha en los árboles:</b> '+([[10,11,0],[7,8],[6,7]].map((m,j)=>m.includes(mo)?['aceitunas','uvas','higos'][j]:'').filter(Boolean).join(', ')||'nada este mes')+'.</p><p class="sub">'+L+'</p><p class="sub">Almacén: '+fInvTxt()+'. Semillas: '+(Object.keys(f.seeds).filter(k=>f.seeds[k]>0).map(k=>f.seeds[k]+' '+C[k].n.toLowerCase()).join(', ')||'ninguna')+'. Animales: '+f.hens+' gallinas, '+f.goats+' cabras'+(f.up.bees?', colmenas':'')+(f.up.ox?', un buey':'')+'. Ganancias: '+(f.earn||0)+' '+mon+'.</p>'+(f.own?'<p class="sub"><b>Vecinos:</b> '+nbs().map(N=>{const z=nbz(N.id),r=nbReq(N);return N.name+' '+fHearts(z.h)+(r?' (pide '+r.n+' × '+ITEMS[r.k][0]+', '+Math.max(0,r.until-f.day)+' días)':'');}).join(' · ')+'</p><p class="sub"><b>Fiestas del campo este mes:</b> '+(frur().filter(x=>x.mo===mo).map(x=>x.n+(farmz().fest&&farmz().fest[x.id]===calNow().year?' (ya celebrada)':'')).join(', ')||'ninguna')+'.</p>':'');
  one('Volver',()=>farmAct(o));one('Cerrar',closeDialog);}
// ---- la amistad con el viejo campesino
function farmerTalk(o){const f=farmz(),T=ftxt(),C=crops(),one=casaOpen(T.farmer.charAt(0),T.farmer,T.ftitle+' · '+fHearts(f.aff)),B=$('dBody');
  if(f.q===0){B.innerHTML='<p>'+T.intro+'</p>';one('Ayudarle a segar',()=>{f.q=1;f.reaped=0;save();farmDraw();B.innerHTML='<p>«Gracias. Las tres parcelas de la izquierda, junto al pozo. La hoz está en la casa… bueno, ya la tienes en la mano».</p>';$('dOpts').innerHTML='';one('Ir a segar',closeDialog);toast('<span class="label">Granja</span><br>Cosecha las tres parcelas maduras de '+T.farmer+'.');},'quiz');one('Ahora no',closeDialog);return;}
  if(f.q===1){B.innerHTML='<p>«Las tres parcelas maduras, junto al pozo. Ánimo, que se nota que no estás acostumbrado».</p>';one('Seguir segando',closeDialog);return;}
  if(f.q===2){B.innerHTML='<p>«¡Buen trabajo! Hace años que nadie me ayudaba sin pedir nada. Toma, para ti: un saco de simiente».</p><p>«Una cosa más, si vas a la ciudad: lleva estas primicias a '+T.offerName+'. Yo ya no tengo piernas para el camino».</p>';
    one('Llevaré la ofrenda',()=>{f.q=3;f.seeds.habas=(f.seeds.habas||0)+2;f.aff=1;f.talkDay=state.day;save();B.innerHTML='<p>Te da un cesto con espigas, un puñado de habas y un cuenco de aceite.</p>';$('dOpts').innerHTML='';one('Ponerse en camino',closeDialog);toast('<span class="label">Granja</span><br>Lleva las primicias a '+T.offerName+'.');},'quiz');return;}
  if(f.q===3){B.innerHTML='<p>«¿Ya has dejado las primicias en '+T.offerName+'? No hay prisa, pero los dioses tienen buena memoria».</p>';one('Todavía no',closeDialog);return;}
  if(f.q===4&&f.aff<5){const today=f.talkDay!==state.day;B.innerHTML='<p>'+(today?pick(MODE==='roma'?['«Siéntate. En la legión aprendí que un buen campamento se monta antes de que oscurezca. En el campo es igual: todo a su tiempo».','«Catón dice que el capataz debe ser el primero en levantarse y el último en acostarse. Yo ya me acuesto el primero».','«¿Ves esa piedra? Es la del dios Término. Ni yo puedo moverla: marca dónde acaba lo mío».','«Mi hijo quería ser campesino como yo. La guerra no le dejó».']:['«Siéntate a la sombra. Mi abuelo plantó estos olivos; yo no veré los que plante yo. Así es la tierra».','«Hesíodo decía: primero una casa, una mujer y un buey para arar. Yo me quedé con el buey».','«Cuando los espartanos entraban en el Ática, nos encerrábamos en la ciudad y veíamos el humo de nuestros campos desde la muralla».','«Mi hijo sabía injertar como nadie. Este peral es suyo».']):'«Mañana seguimos hablando. Hoy ya me has hecho compañía».')+'</p><p class="sub">Amistad: '+fHearts(f.aff)+'. Vuelve a hablar con él otros días, o hazle un regalo.</p>';
    if(today)one('Charlar un rato',()=>{f.aff++;f.talkDay=state.day;save();farmerTalk(o);},'quiz');
    if(state.obols>=3&&f.giftDay!==state.day)one('Regalarle '+(MODE==='roma'?'un ánfora de vino':'una jarra de vino')+' de la ciudad (3 '+(MODE==='roma'?'sestercios':'óbolos')+')',()=>{state.obols-=3;f.aff++;f.giftDay=state.day;save();updateStats();farmerTalk(o);});
    one('Despedirse',closeDialog);return;}
  if(f.q===4&&f.aff>=5){B.innerHTML='<p>«Tengo que decirte algo. Estoy viejo. '+(MODE==='roma'?'Mi sobrino Marco quiere que me vaya a vivir con su familia, y tiene razón.':'Mi hija quiere que me vaya a vivir con ella, y tiene razón.')+' Pero no quiero que esta tierra se quede a los cardos. Quiero que sea tuya».</p><p>'+T.legal+'</p><p class="sub">'+T.sub+' ('+T.src+')</p>';
    one('Aceptar la granja',()=>{f.q=5;f.own=true;f.en=fMax();{const mo=calNow().mo,ok=Object.keys(C).filter(k=>C[k].sow.includes(mo));(ok.length?ok:['trigo','habas']).forEach(k=>f.seeds[k]=(f.seeds[k]||0)+3);}qAdd('kl',3,'Tienes una granja.');qAdd('eu',1);save();
      B.innerHTML='<p>'+T.bye+'</p><p>Te deja las llaves del almacén, seis sacos de simiente y un abrazo que huele a tierra.</p><p class="sub">Ahora la granja es tuya: ara, siembra según el mes, riega el huerto, cosecha, cuida de los animales y vende en el mercado. En la casa puedes dormir para recuperar fuerzas y leer el libro de la finca. Tus vecinos te harán encargos, y en el altar podrás celebrar las fiestas del campo.</p>';$('dOpts').innerHTML='';
      one('Despedirse de '+T.farmer,()=>{closeDialog();if(FARM.farmer){scene.remove(FARM.farmer);FARM.farmer=null;}const i=EGX_OBJS.findIndex(q=>q.act==='f:farmer');if(i>=0){if(EGX_OBJS[i].lb)scene.remove(EGX_OBJS[i].lb);EGX_OBJS.splice(i,1);}farmDraw();toast('<span class="label">Tu granja</span><br>'+T.farmer+' se aleja por el camino, apoyado en su bastón.');});},'quiz');return;}}
function farmOfferSetup(){const T=ftxt(),p=placeAt(T.offerPlace);if(p)egxObj(p.x+5,p.z+5,undefined,'f:offer','Dejar las primicias de '+T.farmer,T.god);}
function farmOffer(){const f=farmz(),T=ftxt(),one=casaOpen('❀','Las primicias',T.god),B=$('dBody');
  if(f.q!==3){B.innerHTML='<p>'+(MODE==='roma'?'En el templo de Saturno, el dios de las siembras, se guarda también el tesoro de Roma. En las Saturnales, en diciembre, se le desatan los pies a su estatua, que el resto del año los tiene atados con lana.':'En el Eleusinion de la ciudad, al pie de la Acrópolis, se guardan los objetos sagrados de los Misterios de Deméter y Core, la diosa del grano y su hija.')+'</p>';one('Cerrar',closeDialog);return;}
  B.innerHTML='<p>Dejas el cesto en el altar: espigas, habas y un cuenco de aceite, las primeras de la cosecha. '+(MODE==='roma'?'Un sacerdote con la cabeza cubierta murmura una oración a Saturno y a Ceres.':'Una sacerdotisa de Deméter lo recibe y vierte unas gotas de aceite sobre el altar.')+'</p><p class="sub">Ofrecer las primicias (aparchaí en griego, primitiae en latín) era una costumbre de todo el Mediterráneo. Atenas pedía a todas las ciudades aliadas que enviaran primicias de cebada y trigo a Eleusis.</p>';
  one('Volver a la granja a contárselo',()=>{f.q=4;save();closeDialog();toast('<span class="label">Granja</span><br>Vuelve con '+T.farmer+'. Habla con él varios días: os estáis haciendo amigos.');},'quiz');}

