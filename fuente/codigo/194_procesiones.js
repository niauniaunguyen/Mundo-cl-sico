// ============================================================ PROCESIONES (P8, fiestas con multitudes que se mueven)
// Los días de Panateneas (Atenas) y de Juegos Romanos (Roma), además de la multitud quieta de la fiesta (evCrowd, 014), una procesión
// recorre la ciudad por su camino de verdad, en el orden que cuentan las fuentes, y llega al final antes de que acabe la fiesta.
// El avance depende de la hora del juego (no del tiempo real): quien llega tarde la encuentra donde debe estar.
//  Panateneas · del Dípilon a la Acrópolis por la Vía Panatenaica. Orden y grupos según el friso del Partenón (idealizado), Tucídides VI 56-58
//    (canéforas, hoplitas), Jenofonte, Banquete 4.17 (ancianos con ramas de olivo, talóforos), Eliano, Historias varias VI 1 y Harpocración
//    s.v. skaphephoroi (metecos con bandejas y sus hijas con cántaros), IG II² 334 (la hecatombe). El peplo de las Grandes Panateneas, colgado
//    como la vela de un barco con ruedas: un fragmento de Estratis (hacia el 400 a.C.) ya parece aludir a ello; el barco está mejor documentado
//    en época helenística (anacronismo posible, señalado en el aviso).
//  Juegos Romanos · pompa circensis, del Capitolio al Circo Máximo por el Foro, el Vico Tusco y el Velabro (Dionisio de Halicarnaso VII 72):
//    el magistrado que da los juegos, los hijos de los ciudadanos a caballo y a pie, los aurigas, los bailarines armados con sus músicos,
//    los bailarines vestidos de sátiros, los que llevan el incienso y los vasos de oro y plata, y al final las imágenes de los dioses en andas.
const PROC={g:null,key:null,ms:[],pts:null,cum:null,L:0,seen:false,h0:0,h1:0};
function procRoute(id){
  if(id==='panateneas'){const r=ROADS.find(q=>q.name==='Vía Panatenaica');if(!r)return null;const P=r.pts.map(p=>[p[0],p[1]]);
    for(const k of['propileos','partenon']){const a=placeAt(k);if(a)P.push([a.x,a.z]);}return P;}
  if(id==='ludiromani'){const c=ROMA.circus;if(!c||!c.cr)return null;
    return[[-195,18],[-165,24],[-130,20],[-85,10],[-40,-12],[10,-12],[23,30],[22,84],[-60,98],[-200,112]].concat([c.cr(-c.Lh+25,0),c.cr(-c.Lh*0.4,0),c.cr(c.Lh*0.2,0)]);}
  return null;}
function procCum(P){const c=[0];for(let i=1;i<P.length;i++)c.push(c[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));return c;}
function procAt(s){const P=PROC.pts,C=PROC.cum;if(s<=0){const dx=P[1][0]-P[0][0],dz=P[1][1]-P[0][1],l=Math.hypot(dx,dz)||1;return{x:P[0][0]+dx/l*s,z:P[0][1]+dz/l*s,tx:dx/l,tz:dz/l};}
  let i=1;while(i<C.length-1&&C[i]<s)i++;const l=C[i]-C[i-1]||1,t=Math.min(1,(s-C[i-1])/l),dx=(P[i][0]-P[i-1][0])/l,dz=(P[i][1]-P[i-1][1])/l;
  return{x:P[i-1][0]+(P[i][0]-P[i-1][0])*t,z:P[i-1][1]+(P[i][1]-P[i-1][1])*t,tx:dx,tz:dz};}
// grupos: [nº, aspecto, por fila, nombre del grupo]
function procGroups(id){const W=(o)=>Object.assign({noVary:true},o);
  if(id==='panateneas')return[
    [1,W({chiton:'#efe6d5',himation:'#3e5a8a',beard:true,staff:true}),1,'el heraldo'],
    [6,W({female:true,chiton:'#f3ecdc',himation:'#c9a24a',carry:'basket'}),2,'las canéforas, muchachas de buena familia con las cestas del sacrificio'],
    [2,W({female:true,chiton:'#f3ecdc',himation:'#7a2a2a',veil:true}),2,'la sacerdotisa de Atenea Políade y su ayudante'],
    [4,W({chiton:'#6a2a5a',himation:'#6a2a5a',beard:true,carry:'basket'}),2,'los metecos, con túnicas de púrpura y bandejas de pasteles y panales'],
    [4,W({female:true,chiton:'#e2d6c0',himation:'#6a2a5a',carry:'hydria'}),2,'sus hijas, con cántaros de agua'],
    [6,W({chiton:'#efe6d5',himation:'#d8d0bf',beard:true,hair:'#d8d4cc',branch:true}),2,'los talóforos: los ancianos más hermosos, con ramas de olivo'],
    [8,'vaca',2,'la hecatombe: las vacas del sacrificio, una por cada demo que la paga'],
    [8,W({exomis:true,chiton:'#b9a27a',beard:true,rope:true}),2,'los que tiran del barco'],
    [1,'barco',1,'el barco con ruedas que lleva el peplo nuevo como vela'],
    [8,W({soldier:true,helmet:true,spear:true,chiton:'#9a3a2a'}),2,'los hoplitas'],
    [4,'caballo',2,'los jóvenes de la caballería con sus caballos'],
    [14,null,3,'los ciudadanos, demo por demo']];
  return[
    [1,W({toga:true,praetexta:true,chiton:'#f3eee2',himation:'#f3eee2'}),1,'el magistrado que da los juegos'],
    [4,'caballo',2,'los hijos de los ciudadanos a caballo (y otros a pie)'],
    [4,null,2,'los aurigas, con los colores de las cuatro facciones'],
    [8,W({short:true,noHimation:true,chiton:'#b0302a',helmet:true,spear:true}),2,'los bailarines armados, con túnica roja y casco de bronce'],
    [4,W({short:true,noHimation:true,chiton:'#e8dcc0',branch:true}),2,'los flautistas y los citaristas'],
    [4,W({short:true,noHimation:true,chiton:'#6b4a2a',beard:true}),2,'los bailarines vestidos de sátiros y silenos, que imitan en broma a los armados'],
    [6,W({toga:true,chiton:'#efe9dc',himation:'#f3eee2',carry:'amphora'}),2,'los que llevan el incienso y los vasos de oro y plata'],
    [3,'andas',1,'las imágenes de los dioses en andas, a hombros'],
    [14,null,3,'los ciudadanos con toga']];}
function procBranch(o){const b=new THREE.Group();const st=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.02,1.1,4),lam('#6b4f2e'));st.position.y=0.55;b.add(st);
  for(let i=0;i<4;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(0.12,5,4),lam('#5f7a45'));l.scale.set(1,0.6,1);l.position.set(rr(-0.08,0.08),0.85+i*0.09,rr(-0.08,0.08));b.add(l);}
  b.position.set(0.32,1.0,0.1);o.add(b);}
function procShip(){const g=new THREE.Group(),wd=lam('#7a5434');
  const h=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.9,7),wd);h.position.y=1.1;g.add(h);
  const pr=new THREE.Mesh(new THREE.ConeGeometry(0.5,1.6,4),wd);pr.rotation.x=Math.PI/2;pr.position.set(0,1.2,4.2);g.add(pr);
  for(const sx of[-0.85,0.85])for(const sz of[-2.4,2.4]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.18,12),lam('#4a3624'));w.rotation.z=Math.PI/2;w.position.set(sx,0.55,sz);g.add(w);}
  const m=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.11,7.5,6),wd);m.position.y=1.5+3.75;g.add(m);
  const y=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,5.6,5),wd);y.rotation.z=Math.PI/2;y.position.y=8.4;g.add(y);
  const c=document.createElement('canvas');c.width=128;c.height=96;const x=c.getContext('2d');x.fillStyle='#d9a43a';x.fillRect(0,0,128,96);
  x.strokeStyle='#5a2a6a';x.lineWidth=6;x.strokeRect(4,4,120,88);x.fillStyle='#5a2a6a';for(let i=0;i<6;i++){x.beginPath();x.arc(20+i*18,50+(i%2?8:-8),6,0,TAU);x.fill();}   // la gigantomaquia, solo insinuada
  const sail=new THREE.Mesh(new THREE.PlaneGeometry(5.2,4),new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));sail.position.set(0,6.3,0.12);sail.rotation.y=Math.PI/2;g.add(sail);
  return g;}
function procLitter(){const g=new THREE.Group();const p=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.14,2.2),lam('#8a6a2a'));p.position.y=1.72;g.add(p);
  for(const sx of[-0.68,0.68]){const b=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,3.4,5),lam('#6b4f2e'));b.rotation.x=Math.PI/2;b.position.set(sx,1.66,0);g.add(b);}
  const god=makePerson({noVary:true,chiton:'#d4b048',himation:'#c9a24a',skin:'#d4b048',hair:'#b8902e',beard:true});god.scale.setScalar(0.62);god.position.y=1.79;g.add(god);
  const bearers=[];for(const sx of[-0.68,0.68])for(const sz of[-1.3,1.3]){const o=makePerson({noVary:true,short:true,noHimation:true,chiton:'#e8dcc0'});o.position.set(sx,0,sz);g.add(o);bearers.push(o);}
  g.userData.bearers=bearers;return g;}
function procBuild(id){const g=new THREE.Group();scene.add(g);const ms=[];let d=0;const ro=id!=='panateneas';
  const civ=ro?[{toga:true,chiton:'#efe9dc',himation:'#f3eee2'},{toga:true,chiton:'#e8e2d4',himation:'#ece5d6'},{short:true,noHimation:true,chiton:'#a89070'}]
    :[{chiton:'#e8e0cf',himation:'#6d7b9a',beard:true},{chiton:'#efe6d5',himation:'#8a6a3a',beard:true},{chiton:'#d8c9a8',himation:'#4f6a5a',beard:true}];
  const fac=['#e8e4d8','#b0302a','#3f7a3a','#3a5a9a'];
  for(const[n,look,row,name]of procGroups(id)){const gap=look==='barco'?9:look==='andas'?4:look==='vaca'||look==='caballo'?2.6:1.5;d+=gap*0.6;
    for(let i=0;i<n;i++){const r=Math.floor(i/row),c=i%row;let o,kind='p';
      if(look==='vaca'||look==='caballo'){o=new THREE.Group();g.add(o);makeBeast(look,o,0,0,0);kind='b';{const y=makePerson({noVary:true,short:true,noHimation:true,chiton:ro?'#efe9dc':'#c9b48b',hair:'#3e2c1f'});y.position.set(-0.9,0,0.4);o.add(y);o.userData.lead=y;}}
      else if(look==='barco'){o=procShip();kind='s';}
      else if(look==='andas'){o=procLitter();kind='l';}
      else{const L=look||Object.assign({noVary:true,hair:pick(['#2b1f17','#3e2c1f','#5b4532','#8d8a85'])},pick(civ));
        const LL=(!look&&ro&&name.startsWith('los aurigas'))?{noVary:true,short:true,noHimation:true,chiton:fac[i%4],helmet:true}:L;
        o=makePerson(LL);if(LL.branch)procBranch(o);}
      if(o.parent!==g)g.add(o);const lat=(c-(row-1)/2)*(look==='barco'?0:1.3);
      ms.push({o,kind,d:d+r*gap,lat,ph:Math.random()*TAU,name});}
    d+=Math.ceil(n/row)*gap;}
  PROC.tail=d;return{g,ms};}
function procOff(){if(PROC.g){scene.remove(PROC.g);PROC.g=null;}PROC.key=null;PROC.ms=[];}
function procWant(){if(!state||ui==='start')return null;const ev=todayEvent();const f=ev&&ev.fest;if(!f||(f.id!=='panateneas'&&f.id!=='ludiromani'))return null;
  if(clock.h<ev.h0||clock.h>=ev.h1)return null;return{f,ev,key:f.id+':'+state.day};}
let _procT=0;
function procTick(dt){const w=procWant();if(!w){if(PROC.g)procOff();return;}
  if(w.key!==PROC.key){procOff();const P=procRoute(w.f.id);if(!P||P.length<2)return;PROC.pts=P;PROC.cum=procCum(P);PROC.L=PROC.cum[PROC.cum.length-1];
    const B=procBuild(w.f.id);PROC.g=B.g;PROC.ms=B.ms;PROC.key=w.key;PROC.id=w.f.id;PROC.h0=w.ev.h0+0.25;PROC.h1=w.ev.h1-0.75;PROC.seen=false;}
  // la cabeza de la procesión: de la salida (con toda la fila detrás) hasta el final, donde la fila se apretuja
  const k=Math.max(0,Math.min(1,(clock.h-PROC.h0)/Math.max(0.5,PROC.h1-PROC.h0))),S=k*(PROC.L+PROC.tail*0.75);
  const hd=procAt(Math.min(S,PROC.L)),far=Math.hypot(hd.x-player.x,hd.z-player.z)>700&&Math.hypot(PROC.pts[PROC.pts.length-1][0]-player.x,PROC.pts[PROC.pts.length-1][1]-player.z)>700;
  PROC.g.visible=!far;if(far)return;
  for(const m of PROC.ms){const s=Math.min(S-m.d,PROC.L-m.d*0.25);const moving=S-m.d<PROC.L-m.d*0.25&&k>0&&k<1;const p=procAt(s);
    const x=p.x-p.tz*m.lat,z=p.z+p.tx*m.lat;const o=m.o;const dx=x-o.position.x,dz=z-o.position.z,mv=Math.hypot(dx,dz);
    o.position.set(x,floorAt(x,z),z);o.rotation.y=Math.atan2(p.tx,p.tz);
    if(moving&&mv>0.001){m.ph+=Math.min(mv,1)*4.6;if(m.kind==='p')personWalk(o,m.ph,1);else if(m.kind==='l')for(const b of o.userData.bearers)personWalk(b,m.ph,0.8);
      else if(m.kind==='b'&&o.userData.lead)personWalk(o.userData.lead,m.ph,1);}
    else if(m.kind==='p')personWalk(o,0,0);}
  if(!PROC.seen&&Math.hypot(hd.x-player.x,hd.z-player.z)<40){PROC.seen=true;procNotice();}}
function procNotice(){const G=procGroups(PROC.id).map(g=>g[3]);const pan=PROC.id==='panateneas';
  toast('<span class="label">'+(pan?'La procesión de las Panateneas':'La procesión de los Juegos Romanos')+'</span><br>Abre la marcha '+G[0]+'; detrás, '+G.slice(1,-1).join('; ')+'; y al final, '+G[G.length-1]+'.'+
    (pan?' <i>El barco con ruedas está bien documentado en época helenística; para el 386 a.C. es probable, pero no seguro.</i>':' <i>Así la describe Dionisio de Halicarnaso, que la vio en tiempos de Augusto.</i>'));}
{const f=evTick;evTick=function(dt){f.apply(this,arguments);try{procTick(dt);}catch(e){if(!_procT){_procT=1;console.warn('procesión',e);}}};}
