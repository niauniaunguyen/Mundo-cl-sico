// ============================================================ vida urbana: el ritmo del día y escenas públicas que se repiten
// Ritmo: cada paseante tiene un «rango» fijo; si es mayor que la actividad de la hora, está en casa (oculto y quieto).
function vuAct(h){if(MODE==='roma')return h<5||h>=21?0.12:h<7?0.45:h<11.5?1:h<14?0.32:h<17?0.72:0.5;   // la siesta de las horas sexta y séptima vacía las calles
  return h<5||h>=21?0.1:h<7?0.4:h<12.5?1:h<15?0.55:h<18?0.6:0.35;}
const VU_BARKS={roma:[[5,7,['Ya es la hora prima y la cola de clientes da la vuelta a la esquina.','Mis hijos van ya a la escuela, con una lucerna. El maestro grita desde antes del alba.']],[7,11.5,['¡A estas horas el Foro es un hormiguero!','Voy a la basílica: hoy hay juicio por una herencia.']],[11.5,14,['Hora sexta: el que tenga sentido común está durmiendo la siesta.','Con este calor, solo los perros y los forasteros andan por la calle.']],[14,17,['Voy a las termas: después de la hora octava, el agua está en su punto.','¿Termas? Un cuadrante de bronce y tienes baño para toda la tarde.']],[17,21,['Esta noche ceno en casa de mi patrono. Si me invita, claro.','Antes de que oscurezca hay que estar en casa: de noche Roma no es para pasear.']],[21,29,['¡Cuidado con lo que cae de las ventanas! Juvenal dice que es mejor hacer testamento antes de salir a cenar.','Los carros no dejan dormir: de día no pueden entrar en la ciudad, así que pasan toda la noche.','Los vigiles hacen la ronda: buscan fuegos y ladrones.']]],
 atenas:[[5,7,['Las mujeres ya están en la fuente con los cántaros. Es el mejor momento para enterarse de todo.','Hoy hay que madrugar: el que llega tarde no encuentra el mejor pescado.']],[7,12.5,['¡El Ágora está llena! Es la mejor hora para comprar y para hablar de política.','Dicen que en el barrio de los perfumistas hay un filósofo preguntando a todo el mundo qué es la justicia.']],[12.5,15,['Con este calor, mejor una siesta a la sombra de un plátano.','La comida, en casa: cebada, aceitunas y un poco de queso.']],[15,18,['Los jóvenes están en el gimnasio. Mi hijo vuelve de la palestra lleno de aceite y arena.','Esta tarde hay carrera de antorchas, dicen.']],[18,29,['Esta noche hay simposio en casa de mi vecino. Se oye la flautista desde aquí.','Sin una antorcha, de noche no se ve ni dónde pisas.']]]};
function vuBark(){const L=VU_BARKS[MODE]||[],h=clock.h<5?clock.h+24:clock.h;for(const[a,b,ls]of L)if(h>=a&&h<b)return pick(ls);return null;}
const VU={t:0,seen:{}};
function vuTick(dt){if(!state)return;for(const P of VU_SCENES)vuScene(P,dt);const now=performance.now();if(now-VU.t<1200)return;VU.t=now;const a=vuAct(clock.h);
  for(const w of walkers){if(w.rk===undefined)w.rk=Math.random();const home=w.rk>a;if(home!==!!w.home){w.home=home;if(home)w.g.visible=false;}}}
// ---- escenas: grupos que recorren un camino en formación a ciertas horas
const VU_SCENES=[];
function vuPath(P,s){const pts=P.pts;let acc=0;for(let i=0;i<pts.length-1;i++){const L=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);if(s<=acc+L){const t=(s-acc)/L;return[lerp(pts[i][0],pts[i+1][0],t),lerp(pts[i][1],pts[i+1][1],t),Math.atan2(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1])];}acc+=L;}const n=pts.length-1;return[pts[n][0],pts[n][1],Math.atan2(pts[n][0]-pts[n-1][0],pts[n][1]-pts[n-1][1])];}
function vuLen(P){let a=0;for(let i=0;i<P.pts.length-1;i++)a+=Math.hypot(P.pts[i+1][0]-P.pts[i][0],P.pts[i+1][1]-P.pts[i][1]);return a;}
function vuMake(P){P.len=vuLen(P);P.g=[];for(const m of P.members){const g=m.make();g.visible=false;scene.add(g);P.g.push({g,m,ph:Math.random()*6});}VU_SCENES.push(P);}
function vuScene(P,dt){const d=state.day||1;let hh=clock.h;if(P.h1>24&&hh<P.h1-24)hh+=24;const on=P.day(d)&&hh>=P.h0&&hh<P.h1;
  if(!on){if(P.vis){P.vis=false;P.g.forEach(o=>o.g.visible=false);}return;}
  // posición a lo largo del camino según la hora (con pausa opcional)
  let f=(hh-P.h0)/(P.h1-P.h0);if(P.loop)f=(f*P.loop)%1;let s=f*P.len;
  if(P.arrive)s=Math.min(1,f/P.arrive)*P.len;
  if(P.stop){const[s0,len]=P.stop;const fs=s0/P.len,fl=len;if(f>fs&&f<fs+fl)s=s0;else if(f>=fs+fl)s=s0+(f-fs-fl)/(1-fs-fl)*(P.len-s0);else s=f/fs*s0;}
  const near=Math.hypot(P.pts[0][0]-player.x,P.pts[0][1]-player.z)<600||P.g.some(o=>Math.hypot(o.g.position.x-player.x,o.g.position.z-player.z)<400);
  P.vis=true;for(const o of P.g){const[x,z,a]=vuPath(P,Math.max(0,s-o.m.back));const c=Math.cos(a),sn=Math.sin(a),px=x+c*o.m.side,pz=z-sn*o.m.side;
    const moved=Math.hypot(px-o.g.position.x,pz-o.g.position.z);o.g.position.set(px,floorAt(px,pz),pz);o.g.rotation.y=a;o.g.visible=near;
    if(o.m.walk!==false){o.ph+=moved*4.6;personWalk(o.g,o.ph,moved>0.02?1:0);}}
  if(P.toast&&near&&ui==='play'){const k=P.id+':'+d;if(!VU.seen[k]&&P.g.some(o=>Math.hypot(o.g.position.x-player.x,o.g.position.z-player.z)<22)){VU.seen[k]=1;toast(P.toast);}}}
function vuSetup(){VU_SCENES.length=0;const M=(look,back,side,extra)=>({back,side,make:()=>{const g=makePerson(Object.assign({noVary:true},look));if(extra)extra(g);return g;}});
  if(MODE==='roma'){
    // un pretor con sus seis lictores por el Foro, por la mañana
    const fasces=g=>{const f=new THREE.Group();const rods=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,1.5,8),lam('#8a5a32'));f.add(rods);const tie=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.06,8),lam('#a8392b'));tie.position.y=0.3;f.add(tie);const t2=tie.clone();t2.position.y=-0.3;f.add(t2);f.position.set(-0.32,1.45,0.05);f.rotation.z=0.15;g.add(f);};
    const lictor={chiton:'#a8392b',himation:'#a8392b',short:true,noHimation:true,hair:'#3a2a1e'};
    const mem=[];for(let i=0;i<6;i++)mem.push(M(lictor,i*1.7,0,fasces));mem.push(M({toga:true,praetexta:true,chiton:'#efe9dc',himation:'#f3eee2',hair:'#8d8a85'},12.5,0));for(let i=0;i<3;i++)mem.push(M({toga:true,chiton:'#efe9dc',himation:'#ece3c9',hair:'#3a2a1e'},14.5+i*1.2,(i-1)*1.1));
    vuMake({id:'pretor',pts:[[58,-32],[-34,-36],[-40,2],[10,10],[58,-12],[58,-32]],h0:8,h1:12,day:()=>true,loop:3,members:mem,
      toast:'<span class="label">Un pretor y sus lictores</span><br>Abre paso una fila de seis lictores con las fasces al hombro: un haz de varas atado con cintas rojas, símbolo del poder de castigar. Dentro de la ciudad las fasces van sin hacha; fuera, con ella. La gente se aparta: el que no lo hace se lleva un golpe de vara. Un cónsul lleva doce lictores; un pretor, seis.'});
    // un cortejo fúnebre de una familia noble, hasta los Rostra: elogio del difunto
    const dark={chiton:'#3a3a40',himation:'#2a2a30',hair:'#2a1a12'},mask=g=>{if(GLB.ok){const ro={mask:lam('#efe5d4'),hair:lam('#2a1a12')};g.add(glbPart('P_mask',ro));g.add(glbPart('P_mask_hair',ro));}};
    const bier=g=>{const b=new THREE.Group();const l=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.25,2.2),lam('#6b4a2e'));b.add(l);const cl=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.25,2),lam('#a8392b'));cl.position.y=0.25;b.add(cl);const hd=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),lam('#d8c4a8'));hd.position.set(0,0.45,0.75);b.add(hd);b.position.set(0,1.6,-1.2);g.add(b);};
    const fm=[];fm.push(M({chiton:'#efe6d4',himation:'#8a3f5e',hair:'#3a2a1e'},0,-0.8),M({chiton:'#efe6d4',himation:'#8a3f5e',hair:'#3a2a1e'},0,0.8));   // flautistas
    for(let i=0;i<3;i++)fm.push(M({female:true,chiton:'#3a3a40',himation:'#2a2a30',hair:'#5a4a3a',veil:true},2.2,(i-1)*1.2));   // plañideras
    for(let i=0;i<3;i++)fm.push(M({toga:true,praetexta:true,chiton:'#efe9dc',himation:'#f3eee2',hair:'#2a1a12'},4.6+i*1.4,0,mask));   // actores con las máscaras de los antepasados
    fm.push(M({short:true,noHimation:true,chiton:'#8a7350',hair:'#2a1a12'},9.5,-0.9,bier),M({short:true,noHimation:true,chiton:'#8a7350',hair:'#2a1a12'},9.5,0.9));   // el lecho fúnebre, llevado a hombros
    for(let i=0;i<5;i++)fm.push(M(Object.assign({toga:true},dark),12.5+Math.floor(i/2)*1.3,(i%2?0.9:-0.9)));   // la familia, de luto
    vuMake({id:'funeral',pts:[[240,-30],[100,-30],[40,-32],[-20,-22],[-44,-10]],h0:9,h1:11.5,day:d=>d%3===1,arrive:0.65,members:fm,
      toast:'<span class="label">Un funeral noble</span><br>Flautistas, plañideras que cantan los lamentos y, detrás, actores que llevan puestas las máscaras de cera de los antepasados del muerto, con la toga de sus cargos: parece que toda la familia ha vuelto para acompañarlo. Polibio cuenta que el cortejo se detiene en los Rostra, donde un hijo pronuncia el elogio del difunto y de cada antepasado. Luego saldrán de la ciudad: la ley prohíbe enterrar dentro.'});
    // de noche, los carros: la ley de César les prohíbe circular de día
    const cart=()=>{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.7,2.6),lam('#6b4a2e'));b.position.y=0.9;g.add(b);for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.15,12),lam('#4a3a2a'));w.rotation.z=Math.PI/2;w.position.set(s*0.9,0.55,0);g.add(w);}
      const mule=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.9,1.5),lam('#6b5a4a'));mule.position.set(0,1.1,2.3);g.add(mule);const hd=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.4,0.6),lam('#6b5a4a'));hd.position.set(0,1.55,3.1);g.add(hd);for(let i=0;i<3;i++){const a=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.12,0.8,8),lam('#b8734a'));a.position.set(-0.4+i*0.4,1.5,-0.5);g.add(a);}return g;};
    ROADS.slice(0,6).forEach((rd,i)=>{if(!rd||!rd.pts||rd.pts.length<2)return;vuMake({id:'carro'+i,pts:rd.pts.map(p=>[p[0],p[1]]),h0:21,h1:29,day:()=>true,loop:2,members:[{back:0,side:1.4,make:cart,walk:false},{back:-1.2,side:2.4,make:()=>makePerson({noVary:true,short:true,noHimation:true,chiton:'#8a6a4a',hair:'#2a1a12'})}],
      toast:i===0?'<span class="label">Los carros de la noche</span><br>Una ley de Julio César prohíbe a los carros circular por Roma de día, salvo los de las obras públicas y los de las fiestas. Por eso los transportes entran de noche, y el estruendo de las ruedas y los gritos de los arrieros no dejan dormir a nadie, como se queja el poeta Juvenal.':null});});}
  else{
    // los días de asamblea, al alba: carrera hacia la Pnyx para cobrar los tres óbolos
    const cit=[];for(let i=0;i<16;i++)cit.push(M({chiton:pick(['#e8dfcc','#d7c9ab','#efe6d5']),himation:pick(['#7a5a3a','#4f6a7d','#8a3f2f','#5c6b3f']),beard:true,hair:pick(['#2b1f17','#5b4532','#8d8a85'])},(i>>1)*1.6,(i%2?1:-1)*(0.7+Math.random()*0.8)));
    const ag=AL(0,-10),py=[PNYX.x+PNYX.rx*0.2,PNYX.z-PNYX.rz*0.6];
    vuMake({id:'pnyx',pts:[ag,[lerp(ag[0],py[0],0.5),lerp(ag[1],py[1],0.5)],py],h0:6,h1:8,day:d=>d>=3&&(d-3)%8===0,loop:2,members:cit,
      toast:'<span class="label">¡A la Pnyx!</span><br>Hoy hay asamblea. Desde hace unos años se pagan tres óbolos a los asistentes, pero solo a los primeros en llegar: al entrar recibes una ficha y, cuando se acaban, los rezagados se quedan sin paga, como se queja un personaje de Las asambleístas de Aristófanes. Antes era al revés: los arqueros escitas, los policías de la ciudad, barrían el Ágora con una cuerda teñida de rojo, y a quien llegaba manchado se le multaba.'});
    const sc={chiton:'#c46a3a',himation:'#c46a3a',short:true,noHimation:true,pattern:'stars',patC:'#2f4c86',hair:'#8a5a2a',beard:true,spear:true};
    vuMake({id:'escitas',pts:[[py[0]-3,py[1]-2],[py[0]+3,py[1]-2]],h0:6,h1:13,day:d=>d>=3&&(d-3)%8===0,members:[M(sc,0,-1),M(sc,0,1)],toast:null});}}

