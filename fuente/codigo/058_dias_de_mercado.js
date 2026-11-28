// ============================================================ días de mercado: puestos con vendedor y pregón, campesinos que llegan e inspectores
const MKT=[];   // vendedores del mercado de hoy (se vacía cuando desaparece la multitud)
const MKT_TIPOS={
 roma:[
  {n:'Verduras',c:['#5f8a3a','#7aa04a','#e6e0b0'],s:'esfera',p:['¡Coles, puerros y lechugas de mi huerto!','¡Rábanos y cebollas, recién arrancados esta madrugada!']},
  {n:'Aves y huevos',c:['#efe6d4','#c9a24a'],s:'jaula',p:['¡Gallinas de Tusculum! ¡Huevos frescos de esta mañana!','¡Pollos cebados para la cena de los Idus!']},
  {n:'Quesos',c:['#e9d9a0','#c9b070'],s:'cilindro',p:['¡Queso de oveja, fresco y ahumado!','¡Requesón del Lacio! ¡Pruébalo, que no cuesta nada!']},
  {n:'Cerámica',c:['#b8734a','#a8624a','#8a5a3a'],s:'jarra',p:['¡Ollas, jarras y lucernas! ¡Barro de Arretium!','¡Una lucerna nueva, que las noches son largas!']},
  {n:'Calzado y cuero',c:['#6b4a2e','#8a6a44'],s:'caja',p:['¡Sandalias y botas! Te las ajusto aquí mismo.','¡Correas, cinturones y bolsas de cuero!']},
  {n:'Aceite y vino',c:['#b8734a','#c9935a'],s:'anfora',p:['¡Aceite de la Bética! ¡Vino de la Sabina!','¡Vino nuevo de Campania, a un as el sextario!']},
  {n:'Miel y cera',c:['#e8b84a','#c98a2a'],s:'jarra',p:['¡Miel de tomillo! ¡Cera para las tablillas de la escuela!']},
  {n:'Frutas',c:['#c9302b','#e8b84a','#6f8a3a','#8a5a32'],s:'esfera',p:['¡Higos secos, nueces y manzanas!','¡Uvas pasas de Hispania!']}],
 atenas:[
  {n:'Higos y aceitunas',c:['#5a4a3a','#6f8a3a','#3a3a2a'],s:'esfera',p:['¡Higos secos del Ática, los más dulces del mundo!','¡Aceitunas negras y verdes!']},
  {n:'Ajos y cebollas',c:['#efe6d4','#c9a24a'],s:'esfera',p:['¡Ajos de Mégara! ¡Cebollas para el puchero!']},
  {n:'Quesos',c:['#e9d9a0','#c9b070'],s:'cilindro',p:['¡Queso de cabra fresco!','¡Queso de Citnos, el mejor de las islas!']},
  {n:'Cerámica',c:['#b8734a','#2a2a2a','#a8624a'],s:'jarra',p:['¡Cántaros y ollas del Cerámico!','¡Lécitos para los muertos y copas para los vivos!']},
  {n:'Lana',c:['#e9e0cb','#c9b48b','#8a5a3a'],s:'caja',p:['¡Lana de Mégara, hilada y sin hilar!']},
  {n:'Coronas de flores',c:['#4f6a3a','#c9302b','#e8b84a'],s:'esfera',p:['¡Coronas de mirto y de violetas para el banquete y el sacrificio!']},
  {n:'Legumbres',c:['#c9a24a','#8a6a44','#e6d4a0'],s:'caja',p:['¡Lentejas, garbanzos y habas!']},
  {n:'Miel del Himeto',c:['#e8b84a','#c98a2a'],s:'jarra',p:['¡Miel del Himeto, la mejor de Grecia!']}]};
function mktGoods(b,T){for(let k=0;k<5;k++){const col=lam(pick(T.c)),x=-1.2+k*0.6;let m;
  if(T.s==='esfera'){m=new THREE.Mesh(new THREE.SphereGeometry(0.17,7,5),col);m.position.set(x,1.06,0);}
  else if(T.s==='cilindro'){m=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.16,12),col);m.position.set(x,1.0,0);}
  else if(T.s==='jarra'){m=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.2,0.42,10),col);m.position.set(x,1.12,0);}
  else if(T.s==='anfora'){m=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.08,0.75,10),col);m.position.set(x,1.28,0);}
  else if(T.s==='jaula'){m=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.4,0.5),new THREE.MeshLambertMaterial({color:'#8a6a44',wireframe:true}));m.position.set(x,1.1,0);const h=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,5),col);h.position.copy(m.position);b.add(h);}
  else{m=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.2,0.4),col);m.position.set(x,1.0,0);}
  b.add(m);}}
function mktStalls(ev,p,g){MKT.length=0;const L=MKT_TIPOS[MODE],n=L.length;
  for(let i=0;i<n;i++){const row=i%2,x=p.x-(n/2)*6+i*6+(row?3:0),z=p.z-8+row*14,b=new THREE.Group();b.position.set(x,floorAt(x,z),z);b.rotation.y=row?Math.PI:0;g.add(b);
    box(3.2,0.9,1.4,M.wood,0,0.45,0,b);const aw=box(3.6,0.08,2,lam(pick(['#a8392b','#c9a24a','#4f6a7d','#e9dcc4'])),0,2.3,0.2,b);aw.rotation.x=-0.15;for(const s of[-1,1])box(0.08,2.3,0.08,M.wood,s*1.6,1.15,0.9,b);
    const T=L[i];mktGoods(b,T);const v=makePerson(Object.assign({noVary:true,hair:pick(['#2b1f17','#5b4532','#8d8a85'])},i%3===2?{female:true,chiton:'#e2d6c0',himation:pick(['#8a3f5e','#4f6a7d'])}:(MODE==='roma'?{short:true,noHimation:true,chiton:pick(['#a89070','#c9b48b'])}:{exomis:true,chiton:'#a89070',beard:true})));
    v.position.set(0,0,-1.1);b.add(v);const lb=labelSprite(T.n,'',false);lb.position.set(0,2.9,0);lb.visible=false;b.add(lb);
    MKT.push({x,z,T,lb,v,next:performance.now()+2000+Math.random()*20000});}}
function mktTick(){if(!MKT.length||!EVC.g||ui!=='play')return;const now=performance.now();
  for(const s of MKT){const d=Math.hypot(s.x-player.x,s.z-player.z);s.lb.visible=d<10;if(d<14&&now>s.next){s.next=now+25000+Math.random()*20000;if(s.v){armUp(s.v,null,-2.4);setTimeout(()=>armUp(s.v,null,0),1600);}toast('<i>«'+pick(s.T.p)+'»</i> <span class="sub">— puesto de '+s.T.n.toLowerCase()+'</span>');for(const o of MKT)o.next=Math.max(o.next,now+7000);}}}
// los campesinos que llegan al mercado por las calzadas y los inspectores del mercado
function mktSetup(){const M2=(look,back,side,extra)=>({back,side,make:()=>{const g=makePerson(Object.assign({noVary:true},look));if(extra)extra(g);return g;}});
  const burro=(back,side)=>({back,side,walk:false,make:()=>{const a=animal('donkey',{c:{coat:pick(['#7a6a5a','#5a4a3a','#8a7a6a']),mane:'#2a2018'},extra:['mane'],s:0.9});scene.remove(a.g);const g=new THREE.Group();a.g.rotation.y=Math.PI;g.add(a.g);for(const s of[-1,1]){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.22,0.5,10),lam('#a8875a'));c.position.set(s*0.45,1.1,0);g.add(c);}return g;}});
  const mktDay=MODE==='roma'?(d=>{const sd=state.day;state.day=d;const e=todayEvent();state.day=sd;return!!e&&e.id==='nundinas';}):(d=>{const sd=state.day;state.day=d;const e=todayEvent();state.day=sd;return!!e&&e.id==='noumenia';});
  const dest=MODE==='roma'?[0,-22]:AL(10,15);
  const roads=ROADS.filter(r=>r&&r.pts&&r.pts.length>3).slice(0,3);
  roads.forEach((rd,i)=>{const pts=rd.pts.slice(0,Math.min(rd.pts.length,8)).map(p=>[p[0],p[1]]).reverse();pts.push(dest);
    const peas=MODE==='roma'?{short:true,noHimation:true,chiton:pick(['#8a7350','#a89070']),hair:'#3a2a1e',beard:true}:{exomis:true,chiton:'#a89070',hair:'#3a2a1e',beard:true};
    vuMake({id:'mercado_llegada'+i,pts,h0:6,h1:9,day:mktDay,arrive:0.95,members:[M2(peas,0,0),burro(2.2,0),M2({female:true,chiton:'#d8c9a8',himation:'#6a4d3a',hair:'#3b2a1e',carry:'basket'},4.4,0.6),M2(Object.assign({},peas,{carry:'basket'}),5,-0.8)],
      toast:i===0?(MODE==='roma'?'<span class="label">Campesinos camino del mercado</span><br>Cada ocho días, en las nundinas, los campesinos de los alrededores bajan a la ciudad con sus burros cargados de verduras, quesos, huevos y aves. Venden, compran lo que no tienen en el campo (herramientas, sal, telas), se enteran de las leyes que se van a votar y vuelven a casa al atardecer. Por eso también eran el día de la escuela libre y de los baños.':'<span class="label">Campesinos camino del Ágora</span><br>En la noumenia, el primer día del mes, hay un mercado especialmente grande: los campesinos del Ática traen a la ciudad sus higos, su queso, su leña y su carbón, y aprovechan para comprar. Aristófanes saca a varios personajes que van a vender o comprar «en la noumenia».'):null});});
  // los inspectores: un edil (Roma) o dos agoránomos (Atenas) recorren los puestos
  const loop=MODE==='roma'?[[-46,-34],[46,-34],[46,-6],[-46,-6],[-46,-34]]:(()=>{const a=AL(-30,0),b=AL(50,0),c=AL(50,30),d=AL(-30,30);return[a,b,c,d,a];})();
  const mem=MODE==='roma'?[M2({toga:true,praetexta:true,chiton:'#efe9dc',himation:'#f3eee2',hair:'#5b4532'},0,0),M2({short:true,noHimation:true,chiton:'#c9b48b',hair:'#2a1a12'},1.4,0.8,g=>{box(0.5,0.05,0.35,lam('#c9a24a'),0.3,1.2,0.25,g);}),M2({short:true,noHimation:true,chiton:'#a8392b',hair:'#2a1a12'},1.6,-0.8)]
    :[M2({chiton:'#e8e0cf',himation:'#6d7b9a',beard:true,hair:'#8d8a85',staff:true},0,-0.6),M2({chiton:'#efe6d5',himation:'#8a6a3a',beard:true,hair:'#5b4532',staff:true},0,0.6),M2({exomis:true,chiton:'#a89070',hair:'#2a1a12'},1.6,0,g=>{box(0.4,0.3,0.3,lam('#8a7a5a'),0,1.0,0.3,g);})];
  vuMake({id:'inspectores',pts:loop,h0:8,h1:12.5,day:mktDay,loop:3,members:mem,
    toast:MODE==='roma'?'<span class="label">El edil revisa el mercado</span><br>Los ediles vigilan los mercados: comprueban que las balanzas y las medidas coinciden con las oficiales, que se guardan en templos, y multan a los tramposos. Un esclavo público les lleva las pesas de bronce. Su edicto obliga a los vendedores de esclavos y de animales a declarar los defectos de lo que venden: si lo ocultan, el comprador puede devolverlo. En muchas ciudades se conservan las mesas de medidas de piedra, con huecos del tamaño de cada medida.':'<span class="label">Los agoránomos</span><br>Cada año se sortean diez agoránomos, cinco para la ciudad y cinco para el Pireo: vigilan que lo que se vende en el mercado no esté adulterado ni podrido. Otros diez magistrados, los metrónomos, comprueban las pesas y las medidas, y los sitofílakes controlan el precio del trigo y del pan. Así lo cuenta la Constitución de los atenienses de la escuela de Aristóteles. En el Ágora se han encontrado pesas y medidas oficiales de bronce y de barro con el sello «público».'});}

