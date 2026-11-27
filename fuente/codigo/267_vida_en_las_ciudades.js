// ============================================================ VIDA EN LAS CIUDADES (27/11)
// Escenas pequeñas que aparecen cuando el jugador se acerca (a menos de VC.R m) y se quitan al alejarse, para no gastar:
//  1 tiendas que abren y cierran: de noche, tablas puestas en las tiendas de las casas detalladas y lucernas en las puertas
//  2 oficios a la vista: alfarero con su aprendiz que hace girar el torno y el horno humeando (Cerámico), herrero con la fragua
//    (junto al Hefestión), y en Roma batanero pisando la ropa en la tina y panadería con molino movido por un asno
//  3 niños jugando (tabas, aro, pelota) y, por la mañana, el pedagogo que lleva al niño a la escuela
//  4 vida en los patios de las casas griegas: hilar con la rueca, sacar agua del pozo, guisar al fuego
//  5 cola en las fuentes, con hidrias
//  6 barbería con su corrillo, viejos jugando a la petteia en el pórtico y, en Roma, un escriba que escribe cartas por encargo
//  7 puerto en carga y descarga: estibadores con ánforas y el contable con su tablilla
//  8 ritos: guirnaldas en algunas puertas, en Atenas la rama de olivo (ha nacido un niño) o la cinta de lana (una niña), libación
//    en el altar del patio por la mañana y, algunas noches, una procesión de boda con antorchas
//  9 pregonero que anuncia noticias (y rumores sobre lo que ha hecho el jugador)
// 10 la gente y el tiempo: con lluvia los paseantes aprietan el paso; en verano, a mediodía, sombrillas (skiadeion); en invierno, braseros
const VC={R:130,R2:190,max:12,spots:[],live:[],t:0,px:1e9,pz:1e9,sx:1e9,sz:1e9,her:{t:0,said:new Set()},night:null,pts:null};
try{if(typeof ACC!=='undefined'&&ACC.lite){VC.R=90;VC.R2=140;VC.max=6;}}catch(e){}
const vcRo=()=>MODE==='roma';
function vcNight(){try{return clock.h>=20.5||clock.h<6;}catch(e){return false;}}
function vcP(cfg,x,z,ry,pose,seat){const g=makePerson(Object.assign({},cfg));g.position.set(x,floorAt(x,z),z);g.rotation.y=ry||0;g.userData.vc=1;scene.add(g);if(pose)try{personPose(g,pose,seat);}catch(e){}return g;}
function vcM(geo,col,x,y,z,parentList){const m=new THREE.Mesh(geo,typeof col==='string'?lam(col):col);m.position.set(x,y,z);m.castShadow=true;m.userData.vc=1;scene.add(m);if(parentList)parentList.push(m);return m;}
function vcL(S,dx,dz){const c=Math.cos(S.a),s=Math.sin(S.a);return[S.x+dx*c+dz*s,S.z-dx*s+dz*c];}
const VC_CFG={A:{m:{chiton:'#d8ccb0',himation:'#6d5a42',beard:true},w:{exomis:true,chiton:'#a89070',beard:true},f:{female:true,chiton:'#e2d6c0',himation:'#8a3f5e'},f2:{female:true,chiton:'#d8c9a8',himation:'#4f6a7d',veil:true},k:{chiton:'#e8e0cf',short:true,noHimation:true,scale:0.62},old:{chiton:'#d8c9a8',himation:'#5a5a5a',beard:true,beardC:'#d8d0c2',hair:'#d8d0c2'}},
  R:{m:{toga:true},w:{short:true,noHimation:true,chiton:'#a89070'},f:{female:true,chiton:'#e2d6c0',himation:'#8a3f5e',veil:true},f2:{female:true,chiton:'#d7c9ab',himation:'#4a5a6a'},k:{short:true,noHimation:true,chiton:'#e8e0cf',scale:0.62},old:{toga:true,hair:'#d8d0c2'}}};
const vcC=k=>VC_CFG[vcRo()?'R':'A'][k];
function vcArm(g,i,x){const a=g&&g.userData.arms;if(a&&a[i]&&a[i].rotation)a[i].rotation.x=x;}
const VC_INFO={
 alfarero:['El alfarero','<p>En el Cerámico trabajan los alfareros. Mientras el maestro da forma a la arcilla, un aprendiz hace girar el torno con la mano: así aparece en los vasos pintados. Luego se cuece en el horno en tres fases, y así sale el negro brillante.</p><p class="sub">Escenas de taller de alfarero en vasos áticos de figuras negras y rojas (siglos VI-V a.C.).</p>'],
 herrero:['La fragua','<p>Junto al templo de Hefesto, el dios herrero, están los talleres de bronce y de hierro: el Hefestión se alza sobre el barrio de los metalúrgicos.</p><p class="sub">Excavaciones del Ágora de Atenas (talleres de fundición al pie del Colono Agoreo).</p>'],
 batanero:['La lavandería (fullonica)','<p>El batanero pisa la ropa en una tina con agua y orina, que limpia la lana. La orina se recogía en vasijas por la calle, y Vespasiano le puso un impuesto: «el dinero no huele» (pecunia non olet).</p><p class="sub">Suetonio, Vespasiano 23; fullonicae de Pompeya.</p>'],
 molino:['La panadería (pistrinum)','<p>El molino tiene forma de reloj de arena: un asno con los ojos tapados da vueltas y la piedra de arriba gira sobre la de abajo y muele el trigo. Al lado está el horno de pan.</p><p class="sub">Panaderías de Pompeya (la de Modesto); Apuleyo, Metamorfosis IX 11-13.</p>'],
 barberia:['La barbería','<p>La barbería es el sitio de las noticias y los cotilleos: Plutarco la llama «un banquete sin vino». Allí se habla de política, de juicios y de quién se ha peleado con quién.</p><p class="sub">Plutarco, Sobre la charlatanería 7; Lisias XXIV 20.</p>'],
 petteia:['A la sombra del pórtico','<p>Dos ancianos juegan a las fichas en un tablero grabado en el escalón. Se han encontrado tableros así en las gradas y los pórticos de muchas ciudades.</p>'],
 escriba:['El escriba','<p>Por unas monedas escribe cartas, contratos o recibos a quien no sabe escribir, en tablillas de cera o en papiro.</p>'],
 fuente:['La fuente','<p>Ir a por agua era trabajo de mujeres y de esclavas, y la fuente, un sitio para charlar. Los vasos áticos pintan muchas veces mujeres con hidrias en la fuente.</p><p class="sub">Hidrias de figuras negras con escenas de fuente (siglo VI a.C.).</p>'],
 puerto:['El puerto','<p>Los estibadores cargan y descargan ánforas a hombros; un contable lo apunta todo en su tablilla.</p><p class="sub">En Ostia, los descargadores de sacos (saccarii) aparecen en relieves e inscripciones.</p>']};
// ---------------------------------------------------------------- dónde
function vcPlace(id){return typeof PLACES!=='undefined'?PLACES.find(p=>p.id===id):null;}
function vcFixedSpots(){const S=[],ro=vcRo(),add=(kind,p,dx,dz,a)=>{if(p)S.push({kind,x:p.x+dx,z:p.z+dz,a:a||0,live:null});};
  if(!ro){add('alfarero',vcPlace('ceramico'),18,6);add('alfarero',vcPlace('ceramico'),-14,-10,2);add('herrero',vcPlace('hefestion')||vcPlace('mercado'),-24,18,1);
    add('barberia',vcPlace('mercado'),26,-18,0.5);add('petteia',vcPlace('poikile')||vcPlace('mercado'),6,9,3);add('puerto',vcPlace('pireo'),20,14,0);}
  else{add('batanero',vcPlace('ro_subura'),22,10,0);add('molino',vcPlace('ro_subura'),-20,16,1);add('barberia',vcPlace('ro_subura'),10,-22,2);add('escriba',vcPlace('ro_basilica_julia'),12,-14,0);
    add('petteia',vcPlace('ro_basilica_julia'),-10,12,1);add('puerto',vcPlace('ro_emporio'),18,12,0);add('herrero',vcPlace('ro_subura'),-26,-18,2);}
  for(const p of PLACES)if(/^fuente_|^krene$|^ro_lacus$/.test(p.id))S.push({kind:'fuente',x:p.x+3,z:p.z+3,a:0,live:null});
  try{if(typeof PORTS!=='undefined')for(const k in PORTS){const P=PORTS[k];if(P&&P.x>8000)S.push({kind:'puerto',x:P.x+12,z:P.z+8,a:0,live:null});}}catch(e){}
  return S;}
// casas detalladas cercanas (264): patios, niños delante, guirnaldas, lucernas y braseros
function vcHouseSpots(){if(typeof EDD==='undefined')return;const px=player.x,pz=player.z,v=new THREE.Vector3();
  for(const e of EDD.items){if(e.lod!==2||e.vcDone)continue;const d=Math.hypot(e.x-px,e.z-pz);if(d>VC.R)continue;e.vcDone=1;const h=edHash(e.x*1.7,e.z*0.9),greek=/^H2_gr/.test(e.det),a=Math.atan2(e.m.elements[8],e.m.elements[10]);
    const W=(lx,lz)=>{v.set(lx,0,lz).applyMatrix4(e.m);return[v.x,v.z];};
    if(greek&&h<0.35){const p=W(h<0.12?-1.8:h<0.24?1.8:0.6,h<0.24?2.6:0.9);VC.spots.push({kind:'patio',x:p[0],z:p[1],a,v:Math.floor(h*30)%3,live:null});}
    if(h>0.8){const p=W(h>0.9?-3:3,9.5);VC.spots.push({kind:'ninos',x:p[0],z:p[1],a,v:Math.floor(h*97)%3,live:null});}
    if(h>0.55&&h<0.75){const dz=/dom/.test(e.det)?15.05:/insa/.test(e.det)?8.56:/insb/.test(e.det)?7.56:5.52,dx=/dom/.test(e.det)?0:/ins/.test(e.det)?0:greek?(/gra2|grc2/.test(e.det)?-2.4:3.1):1.5;
      const p=W(dx,dz);VC.spots.push({kind:'rito',x:p[0],z:p[1],a,v:Math.floor(h*41)%3,ro:vcRo(),live:null});}
    const shops=/dom/.test(e.det)?[[-5.5,15.1],[5.5,15.1]]:/insa/.test(e.det)?[[-7.4,8.6],[0,8.6],[7.4,8.6]]:/insb/.test(e.det)?[[-5.4,7.6],[5.4,7.6]]:/gra2/.test(e.det)?[[2.6,5.6]]:/grc2/.test(e.det)?[[1.9,5.6]]:[];
    e.vcShops=shops.map(([lx,lz])=>W(lx,lz));const dp=W(/dom/.test(e.det)?0.6:greek?(/gra2|grc2/.test(e.det)?-1.85:3.65):1.5,/dom/.test(e.det)?15.2:/insa/.test(e.det)?8.6:/insb/.test(e.det)?7.6:5.62);e.vcDoor=dp;}}
// ---------------------------------------------------------------- escenas
function vcBuild(S){const o=[],ro=vcRo(),L=(dx,dz)=>vcL(S,dx,dz),F=(x,z)=>floorAt(x,z),A={o,anim:null};
  const P=(k,dx,dz,ry,pose,seat)=>{const[x,z]=L(dx,dz);const g=vcP(vcC(k),x,z,S.a+(ry||0),pose,seat);o.push(g);return g;};
  const B=(geo,col,dx,dy,dz)=>{const[x,z]=L(dx,dz);return vcM(geo,col,x,F(x,z)+dy,z,o);};
  const pot=(dx,dy,dz,s)=>{const g=new THREE.LatheGeometry([[0.04,0],[0.14,0.08],[0.18,0.22],[0.12,0.36],[0.08,0.42],[0.1,0.45]].map(p=>new THREE.Vector2(p[0]*(s||1),p[1]*(s||1))),10);return B(g,'#b0603a',dx,dy,dz);};
  switch(S.kind){
  case'alfarero':{const m=P('w',0,0,0,'sit',0.4);B(new THREE.CylinderGeometry(0.25,0.3,0.4,8),'#6a4a30',0,0.2,0);const wh=B(new THREE.CylinderGeometry(0.42,0.42,0.06,16),'#5a3e26',0,0.55,0.62);B(new THREE.CylinderGeometry(0.05,0.05,0.55,6),'#4a3020',0,0.27,0.62);
    const v=pot(0,0.58,0.62,0.9);const ap=P('k',0.75,0.75,-2.2,'kneel');const kiln=B(new THREE.SphereGeometry(1.1,12,8,0,Math.PI*2,0,Math.PI/2),'#a8805a',-2.6,0,1.5);B(new THREE.BoxGeometry(0.5,0.45,0.08),'#1a120c',-2.6,0.25,2.58);
    for(let k=0;k<5;k++)pot(1.6+k*0.4,0,-0.6,0.8+((k*7)%3)*0.15);
    A.anim=(t,dt)=>{wh.rotation.y+=dt*6;v.rotation.y+=dt*6;vcArm(m,0,-0.9+Math.sin(t*2)*0.08);vcArm(m,1,-0.9+Math.cos(t*2)*0.08);vcArm(ap,0,-0.8+Math.sin(t*6)*0.5);};A.smoke=L(-2.6,1.5);break;}
  case'herrero':{const m=P('w',0,0);B(new THREE.BoxGeometry(0.5,0.6,0.3),'#3a3a3e',0,0.3,0.75);const fr=B(new THREE.BoxGeometry(1.2,0.9,1.0),'#8a6a50',-1.6,0.45,0.6);
    const gl=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.1,0.5),new THREE.MeshBasicMaterial({color:'#ff7a20'}));const[gx,gz]=L(-1.6,0.6);gl.position.set(gx,F(gx,gz)+0.92,gz);scene.add(gl);o.push(gl);
    const hm=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.08,0.35),lam('#444'));const a=m.userData.arms;if(a&&a[0]){hm.position.set(0,-0.55,0.1);a[0].add(hm);}
    A.anim=(t,dt,near)=>{const s=Math.max(0,Math.sin(t*5));vcArm(m,0,-1.6+s*1.2);vcArm(m,1,-0.6);gl.material.color.setHSL(0.07,1,0.45+0.1*Math.sin(t*9));if(near<22&&s>0.97&&(A.cl||0)<t-0.5){A.cl=t;try{sfxClang(0.25);}catch(e){}}};break;}
  case'batanero':{const tub=B(new THREE.CylinderGeometry(0.6,0.55,0.7,14),'#7a6a58',0,0.35,0);const m=P('w',0,0);for(let k=0;k<3;k++){const c=B(new THREE.PlaneGeometry(0.9,1.3),new THREE.MeshLambertMaterial({color:['#d8ccb0','#a8392b','#4f6a7d'][k],side:THREE.DoubleSide}),1.6+k*1.0,1.2,-0.6);c.rotation.y=S.a;}
    B(new THREE.BoxGeometry(3.4,0.05,0.05),'#5a4028',2.6,1.9,-0.6);const y0=m.position.y;A.anim=t=>{m.position.y=y0+0.35+Math.abs(Math.sin(t*3.2))*0.12;vcArm(m,0,-0.4);vcArm(m,1,-0.4);};break;}
  case'molino':{const base=B(new THREE.ConeGeometry(0.45,0.9,12),'#7a7470',0,0.45,0);const top=B(new THREE.CylinderGeometry(0.45,0.2,0.9,12),'#8a847e',0,1.15,0);top.geometry.translate(0,0,0);
    let don=null;try{const An=animal('donkey',{c:{coat:'#6a5a4a',mane:'#2a2018'}});if(An&&An.g){don=An;scene.add(An.g);o.push(An.g);}}catch(e){}B(new THREE.BoxGeometry(1.6,1.6,1.4),'#9a7a5a',3.2,0.8,1.2);
    A.anim=(t,dt)=>{top.rotation.y+=dt*0.9;if(don){const a=t*0.9,r=1.9,[x,z]=L(Math.cos(a)*r,Math.sin(a)*r);don.g.position.set(x,F(x,z),z);don.g.rotation.y=S.a-a;if(don.legs)don.legs.forEach((l,i)=>{l.rotation.x=Math.sin(t*6+i*Math.PI)*0.4;});}};break;}
  case'barberia':{const c=P('m',0,0,0,'sit',0.45);B(new THREE.BoxGeometry(0.45,0.45,0.45),'#6a4a30',0,0.22,0);const b=P('w',0.55,-0.3,-0.9);const w1=P('old',-1.4,0.4,1.4),w2=P('m',-1.1,-0.9,0.9);
    A.anim=t=>{vcArm(b,0,-1.3+Math.sin(t*3)*0.25);vcArm(b,1,-0.9);vcArm(w1,0,-0.3-0.3*Math.max(0,Math.sin(t*1.2)));vcArm(w2,1,-0.2-0.3*Math.max(0,Math.sin(t*1.4+2)));};break;}
  case'petteia':{const a=P('old',-0.6,0,Math.PI/2,'sit',0.45),b=P('old',0.6,0,-Math.PI/2,'sit',0.45);B(new THREE.BoxGeometry(2.2,0.45,0.5),'#b8ad9a',0,0.22,0);
    const bd=document.createElement('canvas');bd.width=bd.height=64;const x=bd.getContext('2d');x.fillStyle='#c8b89a';x.fillRect(0,0,64,64);x.strokeStyle='#5a4a3a';for(let i=0;i<=8;i++){x.beginPath();x.moveTo(i*8,0);x.lineTo(i*8,64);x.moveTo(0,i*8);x.lineTo(64,i*8);x.stroke();}
    for(let i=0;i<10;i++){x.fillStyle=i%2?'#f2ece0':'#2a2a2a';x.beginPath();x.arc(4+((i*3)%8)*8,4+((i*5)%8)*8,3,0,6.3);x.fill();}const bm=B(new THREE.BoxGeometry(0.5,0.03,0.5),new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(bd)}),0,0.46,0);
    A.anim=t=>{const k=Math.floor(t/2.5)%2;vcArm(k?a:b,0,-0.9*Math.max(0,Math.sin(t*2.5)));};break;}
  case'escriba':{const s=P('m',0,0,0,'sit',0.45);B(new THREE.BoxGeometry(0.9,0.7,0.5),'#6a4a30',0,0.35,0.55);B(new THREE.BoxGeometry(0.3,0.02,0.22),'#c9a060',0,0.71,0.5);const c=P('w',0.3,1.3,Math.PI);
    A.anim=t=>{vcArm(s,0,-1.1+Math.sin(t*7)*0.06);vcArm(c,0,-0.4*Math.max(0,Math.sin(t*0.8)));};break;}
  case'fuente':{const W=[];for(let k=0;k<4;k++){const g=P(k%2?'f':'f2',k*0.9,-1.2-k*0.2,Math.PI*0.05);W.push(g);try{const h=glbPart('P_hydria');if(h){h.scale.setScalar(0.9);h.position.set(0,k===0?0.9:1.65,k===0?0.35:0);g.add(h);}}catch(e){}}
    const st=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.8,6),new THREE.MeshBasicMaterial({color:'#bfe0ff',transparent:true,opacity:0.55}));const[sx,sz]=L(0,-0.85);st.position.set(sx,F(sx,sz)+1.0,sz);scene.add(st);o.push(st);
    A.anim=(t,dt,near)=>{st.scale.x=1+Math.sin(t*20)*0.15;vcArm(W[1],0,-0.3-0.2*Math.max(0,Math.sin(t*1.1)));vcArm(W[2],1,-0.3-0.2*Math.max(0,Math.sin(t*1.5+1)));};break;}
  case'puerto':{const M=[];for(let k=0;k<3;k++){const g=P('w',0,0);M.push(g);try{const am=glbPart('P_amphora');if(am){am.position.set(0.25,1.55,0);am.rotation.z=-0.9;g.add(am);}}catch(e){}}
    const c=P('m',-3,2,Math.PI/2,'sit',0.45);B(new THREE.BoxGeometry(0.45,0.45,0.45),'#6a4a30',-3,0.22,2);for(let k=0;k<6;k++)pot(4+(k%3)*0.45,0,-1+Math.floor(k/3)*0.45,1.6);
    A.anim=t=>{M.forEach((g,k)=>{const u=((t*0.12+k/3)%1),q=u<0.5?u*2:2-u*2,[x,z]=L(-1+q*6,-2+k*0.8);g.position.set(x,F(x,z),z);g.rotation.y=S.a+(u<0.5?Math.PI/2:-Math.PI/2);const L2=g.userData.legs;if(L2)L2.forEach((l,i)=>{l.rotation.x=Math.sin(t*7+i*Math.PI)*0.4;});vcArm(g,0,-2.6);});vcArm(c,0,-0.9+Math.sin(t*5)*0.05);};break;}
  case'patio':{if(S.v===0){const w=P('f',0,0,0);const st=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.9,5),lam('#6a4a30'));const a=w.userData.arms;if(a&&a[1]){st.position.set(0,-0.4,0.15);a[1].add(st);}
      A.anim=t=>{vcArm(w,1,-1.2);vcArm(w,0,-0.6+Math.sin(t*4)*0.25);};}
    else if(S.v===1){const w=P('f2',0,0,0);A.anim=t=>{const k=Math.max(0,Math.sin(t*0.9));vcArm(w,0,-0.4-1.2*k);vcArm(w,1,-0.4-1.2*k);w.rotation.x=0.25*k;};}
    else{const w=P('f',0,0,0,'kneel');const fire=new THREE.Mesh(new THREE.ConeGeometry(0.15,0.35,6),new THREE.MeshBasicMaterial({color:'#ffa040'}));const[fx,fz]=L(0,0.6);fire.position.set(fx,F(fx,fz)+0.18,fz);scene.add(fire);o.push(fire);pot(0,0.25,0.6,0.9);
      A.anim=t=>{fire.scale.y=0.8+Math.sin(t*13)*0.25;vcArm(w,0,-0.9+Math.sin(t*2)*0.2);};A.smoke=L(0,0.6);}
    break;}
  case'ninos':{if(S.v===0){const K=[P('k',0,0,0,'kneel'),P('k',0.7,0.4,-2,'kneel'),P('k',-0.6,0.5,2,'kneel')];const T=[];for(let k=0;k<4;k++)T.push(B(new THREE.BoxGeometry(0.04,0.03,0.05),'#efe6d5',0.1*k-0.1,0.02,0.3));
      A.anim=t=>{const u=(t*0.7)%1;vcArm(K[0],0,-1.4*Math.sin(u*Math.PI));T.forEach((m,k)=>{const[x,z]=L(0.1*k-0.1,0.3);m.position.y=F(x,z)+0.02+Math.max(0,Math.sin((u-0.1*k)*Math.PI*2))*0.25;});};}
    else if(S.v===1){const k1=P('k',0,0,0);const hoop=new THREE.Mesh(new THREE.TorusGeometry(0.32,0.02,6,16),lam('#8a6a3a'));scene.add(hoop);o.push(hoop);
      A.anim=t=>{const a=t*0.8,[x,z]=L(Math.cos(a)*3,Math.sin(a)*3),[hx,hz]=L(Math.cos(a+0.25)*3,Math.sin(a+0.25)*3);k1.position.set(x,F(x,z),z);k1.rotation.y=S.a-a;hoop.position.set(hx,F(hx,hz)+0.34,hz);hoop.rotation.y=S.a-a;hoop.rotation.z=t*3;
        const L2=k1.userData.legs;if(L2)L2.forEach((l,i)=>{l.rotation.x=Math.sin(t*9+i*Math.PI)*0.5;});vcArm(k1,0,-0.7);};}
    else{const a=P('k',-1.5,0,Math.PI/2),b=P('k',1.5,0,-Math.PI/2);const ball=B(new THREE.SphereGeometry(0.1,8,6),'#a8392b',0,1,0);
      A.anim=t=>{const u=(t*0.6)%2,q=u<1?u:2-u,[x,z]=L(-1.3+q*2.6,0);ball.position.set(x,F(x,z)+1.1+Math.sin(q*Math.PI)*1.2,z);vcArm(a,0,u<1?-1.2:-0.3);vcArm(b,0,u<1?-0.3:-1.2);};}
    break;}
  case'rito':{const[x,z]=[S.x,S.z],y=F(x,z);if(S.ro||S.v===0){const g=new THREE.Mesh(new THREE.TorusGeometry(0.32,0.06,6,14),lam(S.ro?'#4a7a3a':'#5a7a3a'));g.position.set(x,y+2.55,z);g.rotation.y=S.a;scene.add(g);o.push(g);}
    else if(S.v===1){const br=new THREE.Mesh(new THREE.ConeGeometry(0.18,0.7,5),lam('#6a7a4a'));br.position.set(x,y+2.4,z);br.rotation.z=0.6;scene.add(br);o.push(br);A.info=['Una rama de olivo en la puerta','<p>En esta casa ha nacido un niño: se cuelga una rama de olivo en la puerta. Si es niña, una cinta de lana.</p><p class="sub">Hesiquio, s.v. «stéphanon ekphérein».</p>'];}
    else{const w=new THREE.Mesh(new THREE.TorusGeometry(0.25,0.03,5,12),lam('#efe6d5'));w.position.set(x,y+2.4,z);w.rotation.y=S.a;scene.add(w);o.push(w);A.info=['Una cinta de lana en la puerta','<p>En esta casa ha nacido una niña: se cuelga una cinta de lana. Si es niño, una rama de olivo.</p><p class="sub">Hesiquio, s.v. «stéphanon ekphérein».</p>'];}
    break;}}
  return A;}
function vcInfoObj(S,A){const I=A.info||VC_INFO[S.kind];if(!I||S.infoObj)return;S.infoObj=egxObj(S.x,S.z,undefined,()=>jmDlg('👁',I[0],I[0],I[1],[['Seguir',()=>{}]]),I[0],'',2.6);}
// ---------------------------------------------------------------- humo (hornos y fuegos)
function vcSmokeTick(dt){if(!VC.pts){const N=80,g=new THREE.BufferGeometry();VC.pp=new Float32Array(N*3);g.setAttribute('position',new THREE.BufferAttribute(VC.pp,3));
    const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),gr=x.createRadialGradient(16,16,1,16,16,16);gr.addColorStop(0,'rgba(120,110,100,0.5)');gr.addColorStop(1,'rgba(120,110,100,0)');x.fillStyle=gr;x.fillRect(0,0,32,32);
    VC.pts=new THREE.Points(g,new THREE.PointsMaterial({size:1.4,map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));VC.pts.frustumCulled=false;VC.pts.userData.noSeal=1;VC.pts.userData.noCull=1;scene.add(VC.pts);VC.puffs=[];}
  const src=VC.live.filter(L=>L.A.smoke).map(L=>L.A.smoke);if(src.length&&Math.random()<dt*6){const s=src[Math.floor(Math.random()*src.length)];VC.puffs.push({x:s[0]+(Math.random()-0.5)*0.3,y:floorAt(s[0],s[1])+1.2,z:s[1],a:0});if(VC.puffs.length>80)VC.puffs.shift();}
  let n=0;const w=(typeof WIND!=='undefined'&&WIND.u)?WIND.u.value:null;for(const p of VC.puffs){p.a+=dt;p.y+=dt*0.8;if(w){p.x+=w.x*dt*0.6;p.z+=w.y*dt*0.6;}VC.pp[n*3]=p.x;VC.pp[n*3+1]=p.y;VC.pp[n*3+2]=p.z;n++;}
  VC.puffs=VC.puffs.filter(p=>p.a<6);VC.pts.geometry.setDrawRange(0,n);VC.pts.geometry.attributes.position.needsUpdate=true;}
// ---------------------------------------------------------------- 1 tiendas que cierran de noche, lucernas en las puertas; 10 braseros en invierno
function vcClosedTex(){if(VC.closed)return VC.closed;const src=edInteriorTex().image,c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.drawImage(src,0,0);const cw=c.width/4;
  for(const i of[2,3]){x.fillStyle='#5a3e26';x.fillRect(i*cw,0,cw,c.height);x.strokeStyle='#2a1c12';x.lineWidth=4;for(let k=0;k<6;k++){x.beginPath();x.moveTo(i*cw+k*cw/6,0);x.lineTo(i*cw+k*cw/6,c.height);x.stroke();}x.fillStyle='#3a2a1a';x.fillRect(i*cw,c.height*0.45,cw,10);}
  const t=new THREE.CanvasTexture(c);t.flipY=false;if(THREE.sRGBEncoding)t.encoding=THREE.sRGBEncoding;return VC.closed=t;}
function vcShops(){const n=vcNight(),mo=(()=>{try{return calNow().mo;}catch(e){return 6;}})(),winter=mo>=10||mo<=1;
  if(n!==VC.night&&typeof ED!=='undefined'){VC.night=n;for(const m of ED.vc.values()){if(!m.userData||m.userData.vcInt===undefined){if(m.map===ED.tex.int||m.map===VC.closed)m.userData.vcInt=1;else continue;}m.map=n?vcClosedTex():edInteriorTex();m.emissiveMap=m.map;m.needsUpdate=true;}}
  // lucernas en las puertas (de noche) y braseros en las tiendas (tardes de invierno)
  if(!VC.lp){const N=120,g=new THREE.BufferGeometry();VC.lpp=new Float32Array(N*3);g.setAttribute('position',new THREE.BufferAttribute(VC.lpp,3));const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),gr=x.createRadialGradient(16,16,1,16,16,16);gr.addColorStop(0,'rgba(255,220,150,1)');gr.addColorStop(1,'rgba(255,120,30,0)');x.fillStyle=gr;x.fillRect(0,0,32,32);
    VC.lp=new THREE.Points(g,new THREE.PointsMaterial({size:0.45,map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));VC.lp.frustumCulled=false;VC.lp.userData.noSeal=1;VC.lp.userData.noCull=1;scene.add(VC.lp);}
  let k=0;const eve=(()=>{try{return clock.h>=16.5||clock.h<7;}catch(e){return false;}})();
  if(typeof EDD!=='undefined')for(const e of EDD.items){if(k>=118)break;if(e.lod!==2)continue;if(n&&e.vcDoor&&edHash(e.x,e.z*3)<0.45){VC.lpp[k*3]=e.vcDoor[0];VC.lpp[k*3+1]=floorAt(e.vcDoor[0],e.vcDoor[1])+2.3;VC.lpp[k*3+2]=e.vcDoor[1];k++;}
    if(winter&&eve&&e.vcShops)for(const s of e.vcShops){if(k>=118)break;VC.lpp[k*3]=s[0];VC.lpp[k*3+1]=floorAt(s[0],s[1])+0.4;VC.lpp[k*3+2]=s[1];k++;}}
  VC.lp.geometry.setDrawRange(0,k);VC.lp.geometry.attributes.position.needsUpdate=true;VC.lp.visible=k>0;}
// ---------------------------------------------------------------- 8 boda de noche · 3 pedagogo de mañana · 9 pregonero
const VC_PREG={A:['¡Oíd! Mañana hay Asamblea en la Pnyx: los prítanes convocan al pueblo.','¡Ha llegado al Pireo un barco con trigo del Ponto! Se venderá a precio justo.','¡Los heliastas sorteados que acudan mañana al tribunal!','¡Se busca un esclavo que ha huido! Quien lo vea, que avise.','¡Este año el corego de la tribu Erecteida prepara el ditirambo!'],
  R:['¡Oíd! Mañana hay reparto de trigo en el Pórtico de Minucio para los inscritos.','¡El emperador Tito ofrece juegos en el nuevo anfiteatro! Cien días de espectáculos.','¡Se ha perdido una mula en el Clivus Suburanus! Hay recompensa.','¡Los ediles avisan: no se vacían orinales por la ventana!','¡Ha llegado a Ostia la flota del trigo de Egipto!']};
function vcRumor(){try{const r=[];if(typeof premAll==='function'){const n=premAll().filter(premWon).length;if(n>=3)r.push('Dicen por ahí que '+(vcRo()?'un forastero':'alguien de fuera')+' ha vencido a '+n+' monstruos de las leyendas. ¡Bah, cuentos!');}
  if(typeof bz==='function'&&bz().st===3)r.push('Dicen que el «'+(typeof barcoName==='function'?barcoName():'barco')+'» ha vuelto a puerto con la bodega llena.');if(state&&state.k10&&state.k10.lit&&state.k10.lit.length)r.push('Se comenta que alguien ha pagado de su bolsillo un servicio a la ciudad. ¡Así da gusto!');return r;}catch(e){return[];}}
function vcHerald(dt){const H=VC.her;H.t-=dt;if(H.t>0||ui!=='play'||!mapaTierra())return;H.t=55+Math.random()*40;let near=null;
  for(const w of (typeof walkers!=='undefined'?walkers:[])){if(!w.g||!w.g.visible)continue;const d=Math.hypot(w.g.position.x-player.x,w.g.position.z-player.z);if(d>6&&d<28){near=w;break;}}if(!near)return;
  const L=VC_PREG[vcRo()?'R':'A'].concat(vcRumor()),t=L[Math.floor(Math.random()*L.length)];toast('<span class="label">'+(vcRo()?'Un pregonero (praeco)':'Un heraldo (kêryx)')+'</span><br>«'+t+'»');try{sfxPhrase(0,0.5);}catch(e){}}
function vcEvents(){const h=(()=>{try{return clock.h;}catch(e){return 12;}})(),d=(state&&state.day)||1;
  // procesión de boda: algunas noches (1 de cada 3), de 20,5 a 23 h, por una calle cercana
  const want=h>=20.5&&h<23&&d%3===0&&mapaTierra();if(want&&!VC.wed&&typeof ROADS!=='undefined'){let best=null,bd=1e9;for(const R of ROADS){if(!R.pts)continue;for(let i=0;i+1<R.pts.length;i++){const a=R.pts[i],dd=Math.hypot(a[0]-player.x,a[1]-player.z);if(dd<bd&&dd>25){bd=dd;best=[a,R.pts[i+1]];}}}
    if(best&&bd<140){const g=[],cfg=vcC('m'),fc=vcC('f2');for(let k=0;k<7;k++){const p=vcP(k===2?Object.assign({},fc,{veil:'#d9a63a'}):k===1||k===5?fc:cfg,best[0][0],best[0][1],0);g.push(p);}VC.wed={g,a:best[0],b:best[1],t:0};
      toast('<span class="label">Una boda</span><br>Pasa una procesión con antorchas: llevan a la novia a su nueva casa entre cantos (el himeneo).');}}
  if(VC.wed&&!want){for(const p of VC.wed.g)scene.remove(p);VC.wed=null;}}
function vcWedTick(dt){const W=VC.wed;if(!W)return;W.t+=dt*0.03;const u=Math.min(1,W.t),dx=W.b[0]-W.a[0],dz=W.b[1]-W.a[1],L=Math.hypot(dx,dz)||1;
  W.g.forEach((p,k)=>{const q=Math.max(0,u-k*1.4/L),x=W.a[0]+dx*q,z=W.a[1]+dz*q;p.position.set(x+(k%2?0.6:-0.6),floorAt(x,z),z);p.rotation.y=Math.atan2(dx,dz);const L2=p.userData.legs;if(L2&&u<1)L2.forEach((l,i)=>{l.rotation.x=Math.sin(W.t*900+i*Math.PI+k)*0.35;});if(k===0||k===6)vcArm(p,0,-2.4);});
  if(VC.lp&&VC.lp.visible!==undefined){const P=VC.lpp;let n=VC.lp.geometry.drawRange.count;for(const k of[0,6]){if(n>=118)break;const p=W.g[k].position;P[n*3]=p.x+0.3;P[n*3+1]=p.y+2.4;P[n*3+2]=p.z;n++;}VC.lp.geometry.setDrawRange(0,n);VC.lp.geometry.attributes.position.needsUpdate=true;VC.lp.visible=true;}}
function vcPedagogo(){const h=(()=>{try{return clock.h;}catch(e){return 12;}})(),want=h>=7&&h<9.5&&mapaTierra();if(want&&!VC.ped&&typeof ROADS!=='undefined'){for(const R of ROADS){if(!R.pts)continue;const a=R.pts[0],b=R.pts[R.pts.length-1];if(Math.hypot(a[0]-player.x,a[1]-player.z)<90){
      const ad=vcP(vcRo()?{short:true,noHimation:true,chiton:'#8a7a5a',beard:true}:{exomis:true,chiton:'#8a7a5a',beard:true},a[0],a[1],0),ch=vcP(vcC('k'),a[0],a[1],0);try{const t=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.18,0.03),lam('#c9a060'));const ar=ch.userData.arms;if(ar&&ar[1]){t.position.set(0,-0.45,0.08);ar[1].add(t);}}catch(e){}VC.ped={ad,ch,a,b:R.pts[1]||b,t:0};break;}}}
  if(VC.ped&&!want){scene.remove(VC.ped.ad);scene.remove(VC.ped.ch);VC.ped=null;}}
function vcPedTick(dt){const P=VC.ped;if(!P)return;P.t+=dt;const dx=P.b[0]-P.a[0],dz=P.b[1]-P.a[1],L=Math.hypot(dx,dz)||1,q=((P.t*0.9)/L)%1,x=P.a[0]+dx*q,z=P.a[1]+dz*q,ry=Math.atan2(dx,dz);
  P.ad.position.set(x-0.5,floorAt(x,z),z);P.ch.position.set(x+0.4,floorAt(x,z),z+0.3);P.ad.rotation.y=P.ch.rotation.y=ry;for(const g of[P.ad,P.ch]){const L2=g.userData.legs;if(L2)L2.forEach((l,i)=>{l.rotation.x=Math.sin(P.t*7+i*Math.PI)*0.4;});}}
// ---------------------------------------------------------------- 10 la gente y el tiempo
const VC_PARA={geo:null};
function vcWeather(){if(typeof walkers==='undefined')return;const rain=typeof WXS!=='undefined'&&WXS.rain>0.3,h=(()=>{try{return clock.h;}catch(e){return 12;}})(),mo=(()=>{try{return calNow().mo;}catch(e){return 6;}})(),sunny=!rain&&mo>=5&&mo<=8&&h>=11&&h<17;
  if(!VC_PARA.geo){VC_PARA.geo=new THREE.ConeGeometry(0.55,0.25,10,1,true);VC_PARA.mat=new THREE.MeshLambertMaterial({color:'#c9a27a',side:THREE.DoubleSide});VC_PARA.st=new THREE.CylinderGeometry(0.012,0.012,0.9,4);}
  for(const w of walkers){if(!w.g)continue;if(w.sp0===undefined)w.sp0=w.speed;w.speed=rain&&w.sp0>0?w.sp0*1.6:w.sp0;
    const fem=w.g.userData.cfg&&w.g.userData.cfg.female;if(!fem)continue;if(w.rk===undefined)w.rk=Math.random();const want=sunny&&w.rk<0.3;
    if(want&&!w.para&&w.g.visible&&Math.hypot(w.g.position.x-player.x,w.g.position.z-player.z)<80){const g=new THREE.Group(),c=new THREE.Mesh(VC_PARA.geo,VC_PARA.mat),s=new THREE.Mesh(VC_PARA.st,lam('#5a4028'));c.position.y=2.15;s.position.y=1.75;g.add(c,s);g.position.set(0.18,0,0.1);w.g.add(g);w.para=g;}
    if(w.para)w.para.visible=want;}}
// ---------------------------------------------------------------- bucle
function vcRefresh(){const px=player.x,pz=player.z;if(Math.hypot(px-VC.px,pz-VC.pz)<25)return;VC.px=px;VC.pz=pz;
  if(!VC.fixed||VC.mode!==MODE){VC.fixed=true;VC.mode=MODE;VC.spots=vcFixedSpots();}vcHouseSpots();
  for(const S of VC.spots){const d=Math.hypot(S.x-px,S.z-pz);if(S.live&&d>VC.R2){for(const o of S.live.o)scene.remove(o);VC.live.splice(VC.live.indexOf(S.live),1);S.live=null;}}
  const cand=VC.spots.filter(S=>!S.live&&Math.hypot(S.x-px,S.z-pz)<VC.R).sort((a,b)=>Math.hypot(a.x-px,a.z-pz)-Math.hypot(b.x-px,b.z-pz));
  for(const S of cand){if(VC.live.length>=VC.max)break;try{const A=vcBuild(S);A.S=S;S.live=A;VC.live.push(A);vcInfoObj(S,A);}catch(e){console.warn('vc',S.kind,e);}}}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start'||!mapaTierra())return r;const t=performance.now()/1000;
  for(const A of VC.live){if(!A.anim)continue;const d=Math.hypot(A.S.x-player.x,A.S.z-player.z);if(d<VC.R)A.anim(t,dt,d);}vcSmokeTick(dt);vcWedTick(dt);vcPedTick(dt);vcHerald(dt);
  VC.t+=dt;if(VC.t>1){VC.t=0;vcRefresh();vcShops();vcEvents();vcPedagogo();vcWeather();}}catch(e){if(!VC.err){VC.err=1;console.warn('vc',e);}}return r;};}
