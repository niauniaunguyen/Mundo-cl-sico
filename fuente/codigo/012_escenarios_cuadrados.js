// ============================================================ ESCENARIOS CUADRADOS
// Cada mapa es un cuadrado: la ciudad de partida (con el Pireo o con Ostia y los montes) y cada destino. Más allá del borde se levantan
// montes que no se pueden subir (o está el mar); cada vecino por tierra tiene un tramo del borde, en el lado que mira hacia él, y al
// cruzarlo se viaja hasta allí (días y coste como antes), llegando por el lado opuesto. Por mar se sigue viajando desde el puerto.
function regionSquare(k){if(k==='atenas')return{cx:INNER.x,cz:INNER.z,h:INNER.size/2};   // la ciudad: el cuadrado de su malla de terreno
  const I=ISLANDS.find(q=>q.id===k);if(!I)return null;return{cx:I.x,cz:I.z,h:I.R*(I.land?1.25:1.4)};}
function sqClamp(p){if(BOAT&&BOAT.on)return;const I=islandOf(p.x);if(!I)return;const S=regionSquare(I.id);if(!S||sqOut(S,player.x,player.z)>250||player.feet>600)return;   // lejos (Creta, sueños, cuevas) no se toca
  p.x=clamp(p.x,S.cx-S.h+20,S.cx+S.h-20);p.z=clamp(p.z,S.cz-S.h+20,S.cz+S.h-20);}
function sqOut(S,x,z){return Math.max(Math.abs(x-S.cx),Math.abs(z-S.cz))-S.h;}   // >0: fuera del cuadrado
// tramos del borde para los vecinos por tierra de un mapa: cada uno en el lado que mira hacia él; si hay varios en un lado, repartidos
function edgeSlots(f){const C=edgeSlots._c||(edgeSlots._c={}),key=MODE+':'+f;if(C[key])return C[key];const S=regionSquare(f),out={};if(!S)return C[key]=out;
  const links=[];for(const[a,b]of WORLD_LINKS[MODE==='roma'?'roma':'atenas']){const t=a===f?b:b===f?a:null;if(!t)continue;const br=bearing(f,t);if(br)links.push({t,br});}
  const side=br=>Math.abs(br.dx)>=Math.abs(br.dz)?(br.dx>0?'E':'W'):(br.dz>0?'S':'N');const bySide={};for(const L of links)(bySide[side(L.br)]=bySide[side(L.br)]||[]).push(L);
  for(const sd in bySide){const L=bySide[sd],ns=sd==='E'||sd==='W';L.sort((a,b)=>ns?a.br.dz-b.br.dz:a.br.dx-b.br.dx);
    L.forEach((l,i)=>{const t=L.length===1?(ns?l.br.dz:l.br.dx)*0.5:((i+1)/(L.length+1)*2-1)*0.7,o=sd==='E'?[1,0]:sd==='W'?[-1,0]:sd==='S'?[0,1]:[0,-1],tg=[-o[1],o[0]];
      out[l.t]={x:S.cx+o[0]*(S.h-26)+tg[0]*t*S.h,z:S.cz+o[1]*(S.h-26)+tg[1]*t*S.h,ox:o[0],oz:o[1],side:sd};});}   // a 26 m del borde: el paso se corta a 20
  return C[key]=out;}
// montes más allá del borde (solo en tierra; el mar sigue siendo mar), con un paso abierto en cada salida
function sqMount(k,x,z,h){if(h<0.6)return h;let S;try{S=regionSquare(k);}catch(err){return h;}if(!S)return h;const e=sqOut(S,x,z);if(e<-22)return h;
  const e2=Math.max(0,e+22);let add=260*(1-Math.exp(-e2*0.75/260))+Math.max(0,fbm(x*0.011+3.1,z*0.011)-0.35)*Math.min(1,Math.max(0,e+22)/50)*40;
  let G;try{G=edgeSlots(k);}catch(err){G={};}for(const t in G){const g=G[t],lat=Math.abs((x-g.x)*(-g.oz)+(z-g.z)*g.ox);const ee=Math.max(0,e),w0=9+ee*0.4,rp=31+ee*0.9;if(lat<w0+rp)add*=sstep(clamp((lat-w0)/rp,0,1));}   // el paso se abre en valle a medida que se aleja del borde
  if(e>3000)add*=Math.max(0,1-(e-3000)/1500);   // muy lejos, la sierra baja despacio
  return h+add;}
// antes de construir el terreno: la puerta de cada destino y un camino aplanado (pads) desde la llegada hasta ella
function defineGates(){
  GATES_W.length=0;const has=id=>id==='atenas'||ISLANDS.some(I=>I.id===id);
  for(const[a,b]of WORLD_LINKS[MODE==='roma'?'roma':'atenas']){if(!has(a)||!has(b))continue;
    for(const[f,t]of[[a,b],[b,a]]){const br=bearing(f,t);if(!br)continue;let gx,gz,path=null;
      const sl=edgeSlots(f)[t];
      if(f==='atenas'){const p=homeGate(t);if(!p)continue;if(sl){gx=sl.x;gz=sl.z;const L=Math.hypot(gx-p[0],gz-p[1]),n=Math.max(2,Math.ceil(L/14));path=[];for(let i=0;i<=n;i++)path.push([lerp(p[0],gx,i/n),lerp(p[1],gz,i/n)]);}else{gx=p[0];gz=p[1];}}
      else{const I=ISLANDS.find(q=>q.id===f),th0=Math.atan2(br.dz,br.dx);let best=null;
        let bc=1e9;   // dentro de la dirección del vecino (±50°), el paso más llano: la puerta sale por el valle, no por la cumbre
        if(sl&&I.land)best=[sl.x,sl.z];else   // en tierra firme, la puerta está en su tramo del borde del cuadrado
        for(let k=-6;k<=6;k++){const th=th0+k*0.15,x=I.x+Math.cos(th)*I.R*0.86,z=I.z+Math.sin(th)*I.R*0.86;if(islandBase(I,x,z)<=2||!GATES_W.every(g=>Math.hypot(g.x-x,g.z-z)>60))continue;
          let c=0,ph=islandBase(I,I.x+Math.cos(th)*I.R*0.3,I.z+Math.sin(th)*I.R*0.3);for(let r=0.34;r<=0.861;r+=0.04){const hh=islandBase(I,I.x+Math.cos(th)*I.R*r,I.z+Math.sin(th)*I.R*r);if(hh<0.5)c+=50;c+=Math.abs(hh-ph);ph=hh;}
          c+=Math.abs(k)*3;if(c<bc){bc=c;best=[x,z];}}
        if(!best)continue;[gx,gz]=best;
        // camino: de la llegada (o del centro) a la puerta, con la pendiente limitada
        const gd=Math.hypot(gx-I.x,gz-I.z),s={x:I.x+(gx-I.x)/gd*I.R*0.42,z:I.z+(gz-I.z)/gd*I.R*0.42},L=Math.hypot(gx-s.x,gz-s.z),n=Math.max(3,Math.ceil(L/12));path=[];   // desde las afueras del pueblo, sin cruzar sus edificios
        for(let i=0;i<=n;i++){const u=i/n;path.push([lerp(s.x,gx,u),lerp(s.z,gz,u)]);}
        const hs=path.map(p=>islandBase(I,p[0],p[1]));hs[0]=s.h!==undefined?s.h:hs[0];const st=L/n*0.22;
        for(let r=0;r<3;r++){for(let i=1;i<hs.length;i++)hs[i]=clamp(hs[i],hs[i-1]-st,hs[i-1]+st);for(let i=hs.length-2;i>0;i--)hs[i]=clamp(hs[i],hs[i+1]-st,hs[i+1]+st);}
        path.forEach((p,i)=>{pad(I,p[0]-I.x,p[1]-I.z,i?6:10,0,Math.max(1.6,hs[i])).road=true;});}
      let ox=gx-(f==='atenas'?INNER.x:ISLANDS.find(q=>q.id===f).x),oz=gz-(f==='atenas'?INNER.z:ISLANDS.find(q=>q.id===f).z),ol=Math.hypot(ox,oz)||1;
      if(sl&&(f==='atenas'||ISLANDS.find(q=>q.id===f).land)&&Math.hypot(gx-sl.x,gz-sl.z)<1){ox=sl.ox;oz=sl.oz;ol=1;}
      GATES_W.push({from:f,to:t,x:gx,z:gz,ox:ox/ol,oz:oz/ol,br,path});}}
}
// después del terreno: el camino de tierra, dos mojones y un letrero en cada puerta
function buildGates(){
  const dirt=new THREE.MeshLambertMaterial({color:'#a8957a',polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),st=MODE==='roma'?TRAV_STONE():M.limestone;
  for(const g of GATES_W){
    if(g.path){const pos=[],P=g.path;for(let i=0;i<P.length-1;i++){const[a,b]=[P[i],P[i+1]],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1,nx=-dz/l*2.2,nz=dx/l*2.2,
        q=(x,z)=>[x,terrainH(x,z)+0.07,z],A=q(a[0]+nx,a[1]+nz),Bv=q(a[0]-nx,a[1]-nz),C=q(b[0]-nx,b[1]-nz),D=q(b[0]+nx,b[1]+nz);pos.push(...A,...Bv,...C,...A,...C,...D);}
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.computeVertexNormals();const m=new THREE.Mesh(geo,dirt);m.material.side=THREE.DoubleSide;m.receiveShadow=true;scene.add(m);}
    const a=Math.atan2(g.ox,g.oz),gy=terrainH(g.x,g.z),grpG=grp(g.x,gy,g.z,a);
    for(const s of[-1,1]){box(0.9,2.6,0.9,st,s*3.4,1.2,0,grpG);const p=toW(s*3.4,0,g.x,g.z,a);addBox(p[0],p[1],0.9,0.9,a);}
    box(0.14,2.2,0.14,M.wood,4.6,1.1,-2,grpG);const sg=box(1.6,0.5,0.08,lam('#c9b48b'),5.1,2.05,-2,grpG);sg.rotation.y=0.3;
    const days=Math.max(1,Math.round(g.br.km/30)),lb=labelSprite('Hacia '+mapName(g.to),'por el '+dirName(g.ox,g.oz)+' · unos '+days+(days>1?' días':' día')+' de camino');
    lb.position.set(0,3.6,0);lb.visible=false;grpG.add(lb);g.lb=lb;}
}
// franja que sigue el relieve (caminos, cañadas, lindes): una losa plana larga queda enterrada o flotando
function drapeStrip(x0,z0,x1,z1,w,mat,lift){const L=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.ceil(L/4)),nx=-(z1-z0)/L*w/2,nz=(x1-x0)/L*w/2,pos=[],y=(x,z)=>terrainH(x,z)+Math.max(0.22,lift||0);
  const P=[];for(let i=0;i<=n;i++){const x=lerp(x0,x1,i/n),z=lerp(z0,z1,i/n);P.push([x+nx,y(x+nx,z+nz),z+nz,x-nx,y(x-nx,z-nz),z-nz]);}
  for(let i=0;i<n;i++){const a=P[i],b=P[i+1];if(Math.max(Math.abs(a[1]-a[4]),Math.abs(b[1]-b[4]),Math.abs(a[1]-b[1]),Math.abs(a[4]-b[4]))>Math.max(2.5,w*0.35))continue;   // en las laderas muy empinadas no se pinta
  pos.push(a[0],a[1],a[2],b[0],b[1],b[2],a[3],a[4],a[5],a[3],a[4],a[5],b[0],b[1],b[2],b[3],b[4],b[5]);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();
  const m=new THREE.Mesh(g,mat);m.material.side=THREE.DoubleSide;m.material.polygonOffset=true;m.material.polygonOffsetFactor=-2;m.material.polygonOffsetUnits=-2;m.receiveShadow=true;scene.add(m);return m;}
const TRAV_STONE=()=>lam('#d8ccb0');
// al llegar a una puerta se camina hasta el mapa vecino
let gateT=0,gateCool=0;
function gatesTick(dt){gateCool=Math.max(0,gateCool-dt);gateT+=dt;if(gateT<0.2)return;gateT=0;if(ui!=='play'||!GATES_W.length)return;
  const reg=regionOf(player.x);
  for(const g of GATES_W){if(regionOf(g.x)!==reg)continue;const d=Math.hypot(player.x-g.x,player.z-g.z);if(g.lb)g.lb.visible=d<70;
    if(d<4.5&&!gateCool){gateTravel(g);return;}}}
function gateTravel(g){
  const tg=GATES_W.find(q=>q.from===g.to&&q.to===g.from);if(!tg)return;
  ui='voyage';releasePointer();if(MOUNT.riding)dismount();if(MOUNT.g){MOUNT.g.visible=false;MOUNT.st='away';}
  const days=Math.max(1,Math.round(g.br.km/30)),v=$('voyage');v.classList.add('land');
  v.querySelector('.vt').textContent='Caminas hacia el '+dirName(g.ox,g.oz)+', rumbo a '+mapName(g.to);
  v.querySelector('.vs').textContent='Unos '+Math.round(g.br.km)+' kilómetros: '+(days>1?days+' días':'un día')+' de camino.';
  v.querySelector('.vf').textContent=pick(MODE==='roma'?ROMA_LAND_FACTS:LAND_FACTS);v.hidden=false;requestAnimationFrame(()=>v.classList.add('show'));
  setTimeout(()=>{const x=tg.x-tg.ox*14,z=tg.z-tg.oz*14;player.x=x;player.z=z;player.feet=floorAt(x,z);player.camY=player.feet+player.eye;player.vy=0;player.yaw=Math.atan2(tg.ox,tg.oz);player.pitch=0;
    curZone=null;addHours(Math.min(30,g.br.km/5));updateSky();gateCool=3;
    v.classList.remove('show');setTimeout(()=>{v.hidden=true;ui='play';toast('<span class="label">Llegas a '+mapName(g.to)+'</span><br>El camino de vuelta hacia '+mapName(g.from)+' sale por el '+dirName(tg.ox,tg.oz)+'.');},700);},2200);
}
// mapas de paso que completan Grecia e Italia: un pueblo, un santuario o monumento y una estela
function defineSimple(I,o){for(const b of o.blobs||[])I.blobs.push({x:I.x+b[0],z:I.z+b[1],R:b[2],H:b[3]});
  if(o.lake)I.lake={x:I.x+o.lake[0],z:I.z+o.lake[1],rx:o.lake[2],rz:o.lake[3]};if(o.tint)I.tint=o.tint;
  I.arrive=pad(I,...(o.arr||[-I.R*0.72,30]),24,0,3);I.town=pad(I,o.tx||0,o.tz||0,o.tr||70,0,4);I.town.house=true;
  if(o.site)I.site=pad(I,o.site[0],o.site[1],o.site[2]||22,0,o.site[3]);
  for(const q of o.pads||[])pad(I,q[0],q[1],q[2]);}   // espacios libres de árboles para escenas y objetos
function buildSimple(I,o){const t=I.town,s=I.site;
  if(o.temple&&s)temple(Object.assign({x:s.x,z:s.z,gy:s.h,rot:Math.PI/2,W:12,L:24,nW:6,nL:12,colD:1,colH:6,cella:{w:7.5,l:14,door:2.4}},o.temple));
  if(o.rtemple&&s)romanTemple(Object.assign({x:s.x,z:s.z,gy:s.h-0.2,rot:0,W:14,L:24,pod:2.5,colD:0.9,colH:9,nW:6,deep:2},o.rtemple));
  if(o.early&&o.extra){I.chkFree=true;if(typeof NAT_NY!=='undefined'&&NAT_NY[I.id])footprints.push({x:I.x+NAT_NY[I.id].dx,z:I.z+NAT_NY[I.id].dz,r:4});o.extra(I);}   // los mapas nuevos levantan sus edificios antes que las casas, y las casas evitan lo ya construido
  destHouses(I,t.x,t.z,o.houses||30,o.spread||120,!!o.roman);
  const a=I.arrive;(o.steles||[]).forEach((S,i)=>place(S[0],S[1],S[2],S[3],a.x+9,a.z-8+i*12,-Math.PI/2));
  if(o.npc)NPC_POS[o.npc]=[a.x+16,a.z+10,-Math.PI/2];
  if(o.extra&&!o.early)o.extra(I);
  if(o.roman)romaArrive(I,o.label);else if(I.land)greekArrive(I,o.label);}
const SIMPLE_GR={
 larisa:{npc:'tisandro',label:'Larisa',blobs:[[0,-620,420,190],[-650,0,300,150]],site:[120,-80,22],temple:{name:'Templo de Apolo de Larisa'},
  steles:[['larisa_llanura','La llanura de Tesalia','ΘΕΣΣΑΛΙΑ','La mayor llanura de Grecia, regada por el río Peneo y rodeada de montañas: el Olimpo al norte, el Pindo al oeste, el Otris al sur. Aquí se crían los mejores caballos y se forma la mejor caballería griega. La tierra la poseen unas pocas familias aristocráticas, como los Aléuadas de Larisa, y la trabajan los penestas, campesinos sometidos que no son libres ni del todo esclavos. Hacia el norte se llega a Macedonia por el estrecho valle del Tempe; hacia el oeste, cruzando el Pindo, al Epiro.']],
  extra(I){if(!GLB.ok)return;for(let i=0;i<7;i++){const x=I.x+150+rr(-60,60),z=I.z+160+rr(-50,50),g=grp(x,terrainH(x,z),z,R()*TAU);animalGLB('A_horse',g,pick(['#6b4a2e','#3a2a1e','#d8cfc0','#8a6a4a']),'#2a1e16');addCirc(x,z,1);}}},
 pela:{npc:'teodoto_pela',label:'Pela',blobs:[[300,-500,260,90]],site:[-60,-130,30],temple:{name:'Santuario de Pela',W:14,L:26},
  steles:[['pela_capital','Pela, capital de Macedonia','ΠΕΛΛΑ','El rey Arquelao trasladó hace unos años la capital de Macedonia desde Egas hasta aquí, junto a una laguna comunicada con el mar. Quiso hacer de su corte una pequeña Atenas: invitó al pintor Zeuxis a decorar su palacio y al poeta Eurípides, que murió en Macedonia en el 406. Ahora reina Amintas III, que lucha por conservar el trono frente a los ilirios y a la liga de Olinto. En el sur de Grecia se discute si los macedonios son griegos de verdad. Dentro de cuatro años nacerá aquí su hijo Filipo, que dominará Grecia, y de Filipo nacerá Alejandro.']]},
 dodona:{npc:'anthis',label:'Dodona',blobs:[[-50,-600,380,260],[500,0,300,200],[-100,520,320,180]],site:[60,-40,30],houses:12,spread:90,
  steles:[['dodona_oraculo','El oráculo de Dodona','ΔΩΔΩΝΗ','El oráculo más antiguo de Grecia, según Heródoto. Zeus habla por el rumor de las hojas de una encina sagrada, y sus sacerdotes, los selos, duermen en el suelo y no se lavan los pies, como ya cuenta la Ilíada. Alrededor del árbol hay un círculo de calderos de bronce sobre trípodes: al tocar uno, el sonido pasa de caldero en caldero. Los fieles escriben sus preguntas en láminas de plomo: si les conviene casarse, si el hijo que espera su mujer es suyo, si deben emigrar. Se han encontrado miles.']],
  extra(I){const s=I.site;if(GLB.ok)treesGLB([{x:s.x,z:s.z,kind:'plane',k:2.4,collide:true}]);try{forestBuild(I,520,true);}catch(e){console.warn('dodona bosque',e);}
   for(let i=0;i<14;i++){const a=i/14*TAU,x=s.x+Math.cos(a)*11,z=s.z+Math.sin(a)*11,g=grp(x,s.h,z,0);for(let k=0;k<3;k++){const l=box(0.06,1.3,0.06,M.bronze,Math.cos(k*2.1)*0.3,0.65,Math.sin(k*2.1)*0.3,g);}const c=new THREE.Mesh(new THREE.SphereGeometry(0.42,12,8,0,TAU,Math.PI/2,Math.PI/2),M.bronze);c.position.y=1.5;g.add(c);addCirc(x,z,0.45);}}},
 calidon:{npc:'laodoco',label:'Calidón',blobs:[[60,-450,300,160]],site:[160,-160,26],temple:{name:'Templo de Ártemis Lafria'},
  steles:[['calidon_jabali','El jabalí de Calidón','ΚΑΛΥΔΩΝ','Aquí sitúa el mito la cacería del jabalí monstruoso que Ártemis envió contra Calidón porque el rey Eneo la había olvidado en sus sacrificios. Acudieron héroes de toda Grecia; la cazadora Atalanta fue la primera en herirlo y Meleagro lo mató y le regaló la piel, lo que desató la discordia. Sobre la ciudad está el santuario de Ártemis Lafria. Muchos etolios viven aún en aldeas sin murallas y tienen fama de guerreros de armas ligeras: en el 426 derrotaron en sus montes a los atenienses de Demóstenes.']]},
 egio:{npc:'xenias',label:'Egio',blobs:[[0,520,360,220]],site:[110,60,24],temple:{name:'Santuario de Zeus Homario'},
  steles:[['egio_aqueos','Egio y los aqueos','ΑΙΓΙΟΝ','Las ciudades de Acaya, en la costa norte del Peloponeso, forman una liga que se reúne en el santuario de Poseidón de Hélice, a poca distancia de aquí. Hélice no lo sabe, pero dentro de trece años, en el 373, un terremoto nocturno y una ola gigante la tragarán entera, y durante siglos los viajeros verán sus ruinas bajo el agua. Después, los aqueos se reunirán aquí, en Egio.']]},
 itome:{npc:'damon_itome',label:'Itome',blobs:[[120,-140,170,80]],site:[120,-140,16],temple:{name:'Santuario de Zeus Itomatas',W:9,L:16,nW:4,nL:8,colH:5,colD:0.8,cella:{w:6,l:9,door:2}},
  steles:[['itome_hilotas','Mesenia y los hilotas','ΙΘΩΜΗ','Mesenia es una de las tierras más fértiles de Grecia, y por eso Esparta la conquistó hace siglos. Sus habitantes son hilotas: siervos que cultivan la tierra para sus amos espartanos y les entregan la mitad de la cosecha. Se han sublevado varias veces; en la gran rebelión que siguió al terremoto del 464 resistieron diez años aquí, en el monte Itome, junto al santuario de Zeus Itomatas. Dentro de diecisiete años, Epaminondas de Tebas liberará Mesenia y fundará en esta ladera la ciudad de Mesene.']]},
 calcis:{npc:'lisimaco_calcis',label:'Calcis',site:[90,-90,24],temple:{name:'Templo de Apolo de Calcis'},
  steles:[['calcis_euripo','El Euripo','ΕΥΡΙΠΟΣ','Calcis está junto al Euripo, el estrecho que separa la isla de Eubea de Beocia: en su parte más angosta mide unos cuarenta metros, y desde el 411 lo cruza un puente. Sus corrientes cambian de sentido varias veces al día, tan deprisa que los barcos tienen que esperar, y nadie sabe por qué. Aristóteles, que pasará aquí sus últimos días, intentará explicarlo. Calcis fundó hace siglos colonias por todo el Mediterráneo, de Sicilia y el sur de Italia a la península que lleva su nombre, la Calcídica.']]}
};
const SIMPLE_RO={
 regium:{npc:'melanto',label:'Regium',roman:true,blobs:[[300,-200,280,180]],site:[90,-60,22],rtemple:{name:'Templo de Regium'},
  steles:[['regium_estrecho','El estrecho de Sicilia','FRETVM SICVLVM','Regium, la Regio que fundaron los griegos de Calcis, vigila el estrecho que separa Italia de Sicilia, de apenas tres kilómetros en su parte más angosta. Los marineros temen sus remolinos y sus corrientes: aquí sitúa la Odisea a Escila, el monstruo de la roca, y a Caribdis, el remolino que se traga los barcos. En la otra orilla está Messana. Hace unos veinte años desembarcó en este puerto el apóstol Pablo, preso, camino de Roma.']]}
};
// disposición previa: zonas aplanadas y relieves antes de construir mallas
function defineIslandLayout(){
  const E=ISLANDS[0],De=ISLANDS[1],N=ISLANDS[2],C=ISLANDS[3],L=ISLANDS[4];
  E.site=pad(E,120,-120,26);E.town=pad(E,-235,30,40,0,3.5);
  De.sanct=pad(De,-120,0,62,0,3);De.lake=pad(De,-95,62,22,0,1.6);
  N.blobs.push({x:N.x-N.R*0.98-55,z:N.z-N.R*0.3,R:38,H:9});N.town=pad(N,-N.R*0.78,N.R*0.36,40,0,4);N.quarry=pad(N,90,-N.R*0.5,22);
  C.palace=pad(C,-C.R*0.30,-C.R*0.26,112);C.polis=pad(C,-C.R*0.36,-C.R*0.58,62);C.cave=pad(C,60,-40,10);
  L.shrine=pad(L,-L.R*0.86,-70,16,0,2.5);L.temple=pad(L,-L.R*0.72,50,20);
}
function buildIslandMesh(I){const S=I.R*2.9,seg=Math.round(S/(I.step||6));const g=new THREE.PlaneGeometry(S,S,seg,seg);g.rotateX(-Math.PI/2);
  const pos=g.attributes.position,col=new Float32Array(pos.count*3),c=new THREE.Color(),dry=new THREE.Color('#b9ab86');
  // una sola altura por punto; la pendiente se saca de los puntos vecinos (antes se calculaban cinco alturas por punto: la carga tardaba mucho)
  const N1=seg+1,H=new Float32Array(pos.count),st=S/seg;for(let i=0;i<pos.count;i++){const x=pos.getX(i)+I.x,z=pos.getZ(i)+I.z,h=islandH(x,z);H[i]=h;pos.setXYZ(i,x,h,z);}
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),h=H[i],r=Math.floor(i/N1),cc=i%N1;
    const hx1=H[r*N1+Math.min(N1-1,cc+1)],hx0=H[r*N1+Math.max(0,cc-1)],hz1=H[Math.min(N1-1,r+1)*N1+cc],hz0=H[Math.max(0,r-1)*N1+cc];
    const sl=(Math.abs(hx1-hx0)+Math.abs(hz1-hz0))/(2*st);
    c.copy(GRASS_C).lerp(GREEN_C,clamp(fbm(x*0.05,z*0.05)*1.6-0.4,0,1));if(!I.green&&I.id!=='lesbos'&&I.id!=='egina'&&I.id!=='tebas'&&I.id!=='esparta')c.lerp(dry,0.45);if(I.green)c.lerp(_c2.set('#7f8f55'),0.32);
    if(h<3)c.lerp(SAND_C,clamp((3-h)/2,0,1));c.lerp(ROCK_C,clamp((sl-0.4)*1.6,0,1));if(h<-1)c.set('#8a7d60');if(I.tint)I.tint(x,z,h,c);
    const v=0.94+hash(x*0.37,z*0.53)*0.1;col[i*3]=c.r*v;col[i*3+1]=c.g*v;col[i*3+2]=c.b*v;}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();const m=new THREE.Mesh(g,terrainMat());m.receiveShadow=true;scene.add(m);I.mesh=m;gridSet(I,g,S,seg);}

// barco mercante de vela (holkás), con ojos pintados en la proa
const SAIL_TEX=canvasTex(128,128,(x)=>{x.fillStyle='#e9dfc6';x.fillRect(0,0,128,128);x.fillStyle='#c9bb98';for(let i=8;i<128;i+=16)x.fillRect(i,0,2,128);for(let j=10;j<128;j+=24)x.fillRect(0,j,128,1);x.fillStyle='#a8392b';x.fillRect(0,0,128,9);});
function makeShip(x,z,ang){
  const g=grp(x,-2.2,z,ang);
  const sh=new THREE.Shape();sh.moveTo(-11,1.4);sh.quadraticCurveTo(-12.6,2.6,-12.2,4.8);sh.lineTo(-11.5,4.8);sh.quadraticCurveTo(-11.3,2.8,-10,2.3);sh.lineTo(9.5,2.3);sh.quadraticCurveTo(11.4,2.5,12.6,3.7);sh.lineTo(12.4,1.0);sh.quadraticCurveTo(11,-1.2,8,-1.6);sh.lineTo(-8,-1.6);sh.quadraticCurveTo(-10.5,-1.2,-11,1.4);
  const geo=new THREE.ExtrudeGeometry(sh,{depth:4.2,bevelEnabled:true,bevelThickness:0.8,bevelSize:0.6,bevelSegments:3,curveSegments:10});geo.translate(0,0,-2.1);geo.rotateY(-Math.PI/2);
  const hull=new THREE.Mesh(geo,lam('#3b2b1f'));hull.castShadow=true;g.add(hull);
  box(5.0,0.12,0.25,lam('#a8392b'),0,2.0,0,g).scale.set(1,1,80);
  box(4.4,0.25,18.5,M.wood,0,2.25,0,g);
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.CircleGeometry(0.42,16),lam('#f1e8d8'));e.position.set(s*3.05,2.0,9.6);e.rotation.y=s*Math.PI/2;g.add(e);const p=new THREE.Mesh(new THREE.CircleGeometry(0.2,12),lam('#1a1512'));p.position.set(s*3.07,2.0,9.62);p.rotation.y=s*Math.PI/2;g.add(p);}
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.22,13,8),M.wood);mast.position.set(0,8.7,1.5);g.add(mast);
  const yard=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,12.5,6),M.wood);yard.rotation.z=Math.PI/2;yard.position.set(0,14.4,1.5);g.add(yard);
  const sail=new THREE.Mesh(new THREE.PlaneGeometry(11.6,8.2),new THREE.MeshLambertMaterial({map:SAIL_TEX,side:THREE.DoubleSide}));sail.position.set(0,10.2,1.75);g.add(sail);
  for(const s of[-1,1]){const o=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.12,6.5,6),M.wood);o.position.set(s*2.8,1.4,-10.4);o.rotation.x=0.55;g.add(o);const bl=box(0.1,1.4,0.5,M.wood,s*2.8,-1.2,-11.8,g);bl.rotation.x=0.55;}
  for(let i=0;i<10;i++){const am=new THREE.Mesh(PGEO.jar,lam(pick(['#b5603a','#a8532f','#c9744a'])));am.position.set(-1.4+(i%4)*0.95,2.35,-3+Math.floor(i/4)*0.9);g.add(am);}
  for(let k=-9;k<=9;k+=3)addCirc(x+Math.sin(ang)*k,z+Math.cos(ang)*k,3.2);
  SHIPS.push({g,ph:Math.random()*10});return g;
}
// muelle con barco y armador; d = dirección hacia el mar
function buildPort(key,label,sx,sz,dx,dz,who){
  const W=who||(MODE==='roma'?{name:'Lucio Ancario',sub:'Naviero · naves a Hispania y a África',role:'el naviero',look:{chiton:'#c9b48b',short:true,noHimation:true,hair:'#3a2a1e'}}:{name:'Hagnón',sub:'Armador · barco a las islas',role:'el armador'});
  const ang=Math.atan2(dx,dz),len=44,lx=-dz,lz=dx,cx=sx+dx*(len/2-8),cz=sz+dz*(len/2-8);
  const q=box(8,10,len,M.limestone,cx,1.7-5,cz);q.rotation.y=ang;addPlat(cx,cz,8,len,ang,1.7);
  for(let k=6;k<len-10;k+=8){const bx=sx+dx*k+lx*3.6,bz=sz+dz*k+lz*3.6;box(0.4,0.7,0.4,M.stone,bx,2.05,bz);}
  makeShip(sx+dx*(len-20)+lx*8.2,sz+dz*(len-20)+lz*8.2,ang);
  const cpx=sx+dx*(len-26)+lx*2.4,cpz=sz+dz*(len-26)+lz*2.4;const cp=makePerson(W.look||{chiton:'#c9b48b',himation:'#2f4c6e',beard:true,hair:'#3a2a1e'});cp.position.set(cpx,1.7,cpz);cp.rotation.y=ang+Math.PI/2;scene.add(cp);
  PIERS[key]={sx,sz,dx,dz,len,lx,lz};
  const lb=labelSprite(W.name,W.sub,true);lb.position.y=2.45;lb.visible=false;cp.add(lb);addCirc(cpx,cpz,0.4);
  captains.push({kind:'captain',port:key,x:cpx,z:cpz,g:cp,lb,data:{name:W.name,role:W.role}});
  PORTS[key]={x:sx-dx*7,z:sz-dz*7,yaw:Math.atan2(dx,dz),label};
  addTorch(sx-dx*3+lx*5,sz-dz*3+lz*5,2.6);addTorch(sx-dx*3-lx*5,sz-dz*3-lz*5,2.6);
  for(let i=0;i<8;i++){const ax=sx-dx*(4+R()*4)+lx*(6+R()*5),az=sz-dz*(4+R()*4)+lz*(6+R()*5);const am=new THREE.Mesh(PGEO.jar,lam(pick(['#b5603a','#c46a3a'])));am.scale.setScalar(1.6);am.position.set(ax,floorAt(ax,az),az);scene.add(am);}
}
function buildHarbor(){
  let t=0,sx=PG.x,sz=PG.z;for(t=0;t<1600;t+=3){const x=PG.x+LW_DIR[0]*t,z=PG.z+LW_DIR[1]*t;if(terrainH(x,z)<0.4){sx=x-LW_DIR[0]*4;sz=z-LW_DIR[1]*4;break;}}
  HARBOR.ok=true;HARBOR.x=sx;HARBOR.z=sz;
  buildPort('atenas','El Pireo',sx,sz,LW_DIR[0],LW_DIR[1]);
  const lx=-LW_DIR[1],lz=LW_DIR[0];
  stoa({name:'Almacenes del puerto',x:sx-LW_DIR[0]*40+lx*32,z:sz-LW_DIR[1]*40+lz*32,rot:Math.atan2(-lx,-lz),len:40,depth:10,colH:4.4,colD:0.55});
  {const tx=sx-LW_DIR[0]*95-lx*55,tz=sz-LW_DIR[1]*95-lz*55;greekTheatre({x:tx,z:tz,rot:Math.atan2(LW_DIR[0],LW_DIR[1]),R0:7,R1:26,H:9,name:'Teatro del Pireo'});}
  place('pireo','El Pireo','ΠΕΙΡΑΙΕΥΣ','El gran puerto de Atenas, a unos siete kilómetros de la ciudad y unido a ella por los Muros Largos. Tiene tres puertos naturales: el Cántaro, para el comercio, y Zea y Muniquia, para los barcos de guerra. Sus calles las trazó en cuadrícula Hipódamo de Mileto. Aquí se cambia moneda, se compra trigo del mar Negro y se embarca hacia todo el Mediterráneo. En el juego, el puerto está muy simplificado: solo un muelle con un barco mercante.',sx-LW_DIR[0]*9-lx*6,sz-LW_DIR[1]*9-lz*6,0);
}
function lion(x,z,a){const g=grp(x,floorAt(x,z),z,a),m=lam('#ece5d6');box(1.4,0.5,2.6,M.stone,0,0.25,0,g);
  const b=box(0.9,1.1,2.0,m,0,1.1,-0.2,g);b.rotation.x=-0.35;box(0.75,0.25,0.9,m,0,0.62,0.85,g);
  for(const s of[-1,1]){box(0.22,1.1,0.25,m,s*0.3,1.0,0.75,g);}
  const mane=new THREE.Mesh(new THREE.SphereGeometry(0.62,10,8),m);mane.position.set(0,1.95,0.55);g.add(mane);box(0.5,0.45,0.6,m,0,1.9,1.0,g);addBox(x,z,1.4,2.6,a);}
function palm(x,z){const gy=floorAt(x,z),g=grp(x,gy,z,R()*TAU);const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.32,8,7),lam('#7a6044'));tr.position.y=4;tr.rotation.z=0.06;g.add(tr);
  for(let i=0;i<9;i++){const l=new THREE.Mesh(new THREE.ConeGeometry(0.45,3.6,4),lam('#5e7a3a'));l.scale.z=0.25;const t=i/9*TAU;l.position.set(Math.cos(t)*1.4,8.0,Math.sin(t)*1.4);l.rotation.set(Math.sin(t)*1.15,0,-Math.cos(t)*1.15);g.add(l);}addCirc(x,z,0.4);}
function islandVillagers(I,cx,cz,n,barks){for(let i=0;i<n;i++){const fem=R()<0.4,x=cx+rr(-18,18),z=cz+rr(-18,18);const g=makePerson({chiton:pick(['#e8dfcc','#d7c9ab','#c9b48b']),himation:pick(['#7a5a3a','#4f6a7d','#8a3f2f','#5c6b3f']),female:fem,beard:!fem&&R()<0.7,carry:fem&&R()<0.5?'hydria':null});
  g.position.set(x,floorAt(x,z),z);g.rotation.y=R()*TAU;scene.add(g);walkers.push({g,mode:'idle',tx:x,tz:z,wait:Infinity,speed:0,phase:R()*10,x,z,barks});}}
function islandTrees(list){if(GLB.ok){treesGLB(list.map(p=>({x:p[0],z:p[1],y:terrainH(p[0],p[1]),kind:R()<0.7?'olive':'cypress'})));return;}
  const olive=[],cyp=[];list.forEach(p=>(R()<0.7?olive:cyp).push(p));
  const trunkG=new THREE.CylinderGeometry(0.15,0.28,1.8,6);trunkG.translate(0,0.9,0);const crownG=new THREE.IcosahedronGeometry(1.7,0),coneG=new THREE.ConeGeometry(0.9,7,7);coneG.translate(0,4.2,0);
  const tm=new THREE.InstancedMesh(trunkG,lam('#6b5236'),olive.length),cm=new THREE.InstancedMesh(crownG,lam('#7f8b5d'),olive.length),ym=new THREE.InstancedMesh(coneG,lam('#3d5130'),cyp.length);
  const mm=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
  olive.forEach((t,i)=>{const h=terrainH(t[0],t[1]),k=rr(0.8,1.3);q.setFromAxisAngle(up,R()*TAU);p.set(t[0],h,t[1]);s.set(k,k,k);mm.compose(p,q,s);tm.setMatrixAt(i,mm);p.set(t[0],h+2.3*k,t[1]);s.set(k,k*0.75,k);mm.compose(p,q,s);cm.setMatrixAt(i,mm);});
  cyp.forEach((t,i)=>{const h=terrainH(t[0],t[1]),k=rr(0.7,1.3);q.identity();p.set(t[0],h,t[1]);s.set(k,k,k);mm.compose(p,q,s);ym.setMatrixAt(i,mm);});
  [tm,cm,ym].forEach(m=>{m.castShadow=true;m.userData.veg=true;scene.add(m);});}

