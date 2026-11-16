// ============================================================ INTERIORES DE ROMA: el Panteón, las Termas de Tito y la Basílica Julia por dentro
// Antes eran bloques macizos. Ahora se entra, a su tamaño, con actividad:
//  · Panteón: la rotonda con sus hornacinas, las estatuas de Marte, Venus y el Divino Julio (Dion Casio 53, 27) y la luz de lo alto.
//  · Termas de Tito: vestuario, sala templada, sala caliente y sala fría; si las recorres en el orden de un baño romano, lo aprendes.
//  · Basílica Julia: la nave de arcadas y el tribunal de los centunviros, donde asistes a un pleito por una herencia y votas.
// Lo que no se sabe con seguridad se dice en la propia ficha (la forma del Panteón de Agripa, por ejemplo).
const INT={term:null,bas:null};
function intWallSeg(x1,z1,x2,z2){addSeg(x1,z1,x2,z2,0.45);}
// ---------------------------------------------------------------- Panteón (lo llama 029_roma.js, después de la rotonda)
function pantheonInterior(cx,cz,gy){const g=grp(cx,gy,cz,0),y0=0.25;
  const wall=new THREE.Mesh(new THREE.CylinderGeometry(25.2,25.2,24,48,1,true),lam('#e3d8c2',{side:THREE.BackSide}));wall.position.y=12;wall.userData.noCol=true;g.add(wall);
  const dome=new THREE.Mesh(new THREE.SphereGeometry(25.2,48,16,0,TAU,0.16,Math.PI/2-0.16),lam('#d8ccb4',{side:THREE.BackSide}));dome.scale.y=0.62;dome.position.y=24;dome.userData.noCol=true;g.add(dome);
  const fl=new THREE.Mesh(new THREE.CircleGeometry(25.2,48),lam('#cfc3aa'));fl.rotation.x=-Math.PI/2;fl.position.y=y0+0.02;g.add(fl);
  for(let r=4;r<25;r+=6){const ring=new THREE.Mesh(new THREE.RingGeometry(r,r+0.25,48),lam('#8a5a4a'));ring.rotation.x=-Math.PI/2;ring.position.y=y0+0.04;g.add(ring);}   // bandas de pórfido en el suelo
  // siete hornacinas (la de enfrente de la puerta, más grande); en tres, las estatuas que cita Dion Casio
  const gods=[['Marte','padre de Rómulo y antepasado de los romanos'],['Venus','madre de Eneas y de la familia Julia'],['El Divino Julio','César, convertido en dios tras su muerte']];
  for(let i=0;i<7;i++){const a=Math.PI/2+(i-3)*(Math.PI*2/8),x=Math.cos(a)*24.4,z=Math.sin(a)*24.4,big=i===3;
    const n=box(big?7:5,big?11:8,0.6,lam('#5a4a3a'),x,y0+(big?6:4.5),z,g);n.rotation.y=-a+Math.PI/2;n.userData.noCol=true;
    const ped=box(1.4,1.1,1.2,lam('#d8ccb4'),Math.cos(a)*23.2,y0+0.55,Math.sin(a)*23.2,g);ped.userData.noCol=true;
    const gi=i===3?2:i===2?0:i===4?1:-1;if(gi>=0){const st=makePerson({noVary:true,chiton:'#ece6da',himation:'#e2dccf',hair:'#e8e2d6',skin:'#ece6da',beard:gi!==1});
      st.position.set(cx+Math.cos(a)*23.2,gy+y0+1.1,cz+Math.sin(a)*23.2);st.rotation.y=Math.atan2(-Math.cos(a),-Math.sin(a));st.scale.setScalar(1.35);scene.add(st);
      egxObj(cx+Math.cos(a)*21.6,cz+Math.sin(a)*21.6,gy+y0,'int:pg'+gi,gods[gi][0],gods[gi][1],3);}}
  egxObj(cx,cz,gy+y0,'int:pcupula','La cúpula y la luz','¿cómo era por dentro?',5);
  // un haz de luz que cae del óculo
  const sh=new THREE.Mesh(new THREE.CylinderGeometry(4,4.6,38,24,1,true),new THREE.MeshBasicMaterial({color:0xfff2d0,transparent:true,opacity:0.07,depthWrite:false,side:THREE.DoubleSide,fog:false}));sh.position.set(cx,gy+20,cz);sh.userData.noCol=true;sh.userData.noVault=true;scene.add(sh);}
// ---------------------------------------------------------------- Termas de Tito (las llama 029_roma.js en lugar del bloque macizo)
const TERM_ROOMS=[
 {k:'apo',n:'Vestuario (apodyterium)',x0:-35,x1:-17,z0:-26,z1:18,t:'Te desnudas y dejas la ropa en un hueco de la pared. Conviene pagar a un esclavo para que la vigile: los ladrones de ropa de las termas son famosos, y hay tablillas de maldición contra ellos.'},
 {k:'tep',n:'Sala templada (tepidarium)',x0:17,x1:35,z0:-4,z1:18,t:'Una sala tibia para acostumbrar el cuerpo al calor. Aquí te untan de aceite y te lo raspan después con el estrígilo, una cuchilla curva de bronce: así se limpia la piel, sin jabón.'},
 {k:'cal',n:'Sala caliente (caldarium)',x0:17,x1:35,z0:-26,z1:-4,t:'Calor húmedo: el aire caliente del horno pasa por debajo del suelo, que se apoya en pilas de ladrillo (el hipocausto), y por tubos dentro de las paredes. Hay una piscina caliente y una gran pila (labrum) para refrescarse la cara.'},
 {k:'fri',n:'Sala fría (frigidarium)',x0:-17,x1:17,z0:-26,z1:18,t:'Una zambullida en el agua fría para cerrar los poros y terminar. Es la sala más grande y más alta, y la más fresca en verano.'}];
const TERM_ORDER=['apo','tep','cal','fri'];
function termasInterior(cx,cz,gy){const g=grp(cx,gy,cz,0),H=22,F=0.6,W=lam('#e6dccb'),warm=lam('#e8cfb0'),wa=lam('#5d8a90');INT.term={cx,cz,gy};
  // muros (1,5 m) con la puerta al sur, tabiques con pasos y techo; el suelo, a la altura del pórtico
  const wb=(w,h,d,x,y,z,m)=>{const b=box(w,h,d,m||W,x,y,z,g);return b;};
  wb(70,H+3,1.5,0,(H+3)/2-3,-25.25);wb(1.5,H+3,44,-34.25,(H+3)/2-3,-4);wb(1.5,H+3,44,34.25,(H+3)/2-3,-4);
  for(const sx of[-1,1])wb(32,H+3,1.5,sx*19,(H+3)/2-3,17.25);wb(6,H-9,1.5,0,9+(H-9)/2,17.25);
  wb(70,1,44,0,H,-4,lam('#d8ccb4'));wb(69,F,43,0,F/2-0.0,-4,lam('#cfc3aa'));
  // tabiques: vestuario | fría | (templada / caliente)
  for(const[sx]of[[-17],[17]]){wb(1,H,22,sx,H/2,-15);wb(1,H,14,sx,H/2,11);}   // pasos de 4 m a la altura de z=0..4 (puertas)
  wb(7,H,1,20.5,H/2,-4,warm);wb(7,H,1,31.5,H/2,-4,warm);   // templada / caliente, con un paso de 4 m en medio
  // colisiones (coordenadas del mundo; el edificio no está girado)
  const S=(x1,z1,x2,z2)=>intWallSeg(cx+x1,cz+z1,cx+x2,cz+z2);
  S(-35,-26,35,-26);S(-35,-26,-35,18);S(35,-26,35,18);S(-35,18,-3,18);S(3,18,35,18);
  for(const sx of[-17,17]){S(sx,-26,sx,-4);S(sx,4,sx,18);}   // pasos de 8 m (z -4..4): vestuario-fría y fría-templada
  S(17,-4,24,-4);S(28,-4,35,-4);   // templada-caliente
  addPlat(cx,cz-4,70,44,0,gy+F);
  // la piscina fría (con borde: se puede saltar), la caliente y el labrum
  wb(16,0.55,10,0,F+0.27,-6,lam('#d8ccb4'));const w1=new THREE.Mesh(new THREE.PlaneGeometry(15,9),new THREE.MeshPhongMaterial({color:0x5d8a90,shininess:90}));w1.rotation.x=-Math.PI/2;w1.position.set(0,F+0.5,-6);g.add(w1);
  addBox(cx,cz-6,16,10,0,0.3);
  wb(12,0.55,6,26,F+0.27,-21,warm);const w2=new THREE.Mesh(new THREE.PlaneGeometry(11,5),new THREE.MeshPhongMaterial({color:0x6f9a90,shininess:90}));w2.rotation.x=-Math.PI/2;w2.position.set(26,F+0.5,-21);g.add(w2);addBox(cx+26,cz-21,12,6,0,0.3);
  {const lb=new THREE.Mesh(new THREE.CylinderGeometry(1.4,0.5,0.5,20),lam('#d8ccb4'));lb.position.set(26,F+1.4,-10);g.add(lb);const pd=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.5,1.2,12),lam('#d8ccb4'));pd.position.set(26,F+0.6,-10);g.add(pd);addCirc(cx+26,cz-10,1.4);}
  // bancos y nichos del vestuario
  for(let i=0;i<6;i++){wb(1.2,0.5,4,-33.5,F+0.25,-22+i*7,lam('#bfb39a'));for(let j=0;j<3;j++)wb(0.3,0.9,1.2,-33.6,F+1.6+j*1.1,-22+i*7,lam('#5a4a3a'));}
  // un poco de vapor en la caliente
  for(let i=0;i<10;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(1.6,8,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.06,depthWrite:false}));p.position.set(20+(i%5)*3,F+2+Math.floor(i/5)*2,-20+(i%3)*4);p.userData.noCol=true;p.userData.noVault=true;g.add(p);}
  for(const R of TERM_ROOMS)egxObj(cx+(R.x0+R.x1)/2,cz+(R.z0+R.z1)/2+(R.k==='fri'?8:0),gy+F,'int:t'+R.k,R.n,'termas',4);}
function termz(){const s=state;if(!s.term)s.term={seq:[],done:0};return s.term;}
function termTick(dt){const T=INT.term;if(!T||MODE!=='roma'||ui!=='play')return;const lx=player.x-T.cx,lz=player.z-T.cz;
  const R=TERM_ROOMS.find(r=>lx>r.x0&&lx<r.x1&&lz>r.z0&&lz<r.z1);const z=termz();if(!R){if(Math.abs(lx)>40||Math.abs(lz+4)>30)z.cur=null;return;}if(z.cur===R.k)return;z.cur=R.k;
  if(z.seq[z.seq.length-1]!==R.k)z.seq.push(R.k);if(z.seq.length>14)z.seq.shift();
  toast('<span class="label">'+R.n+'</span><br>'+R.t);
  // cuenta el orden de las salas aunque se cruce la fría de camino: vestuario, luego templada, luego caliente y, al final, la fría
  const s=z.seq.join(','),sub=(q,o)=>{let i=0;for(const k of q){if(k===o[i])i++;if(i===o.length)return true;}return false;},ok=R.k==='fri'&&sub(z.seq,TERM_ORDER);
  if(ok){z.seq=[];z.done++;if(z.done===1){qAdd('vi',2,'Te has bañado como un romano.');qAdd('so',1);}save();
    setTimeout(()=>eduOverlay('termEnd','Un baño completo','<p>Has hecho el recorrido de un baño romano: vestuario, sala templada, sala caliente y, para terminar, el agua fría. Se iba casi a diario, por la tarde, y por muy poco dinero: un cuarto de as (Horacio, Sátiras 1, 3, 137) y gratis los días que un magistrado o el emperador lo pagaban.</p><p>Vitruvio explica cómo se calientan las salas con el hipocausto y por qué la caliente mira al sol de la tarde (Sobre la arquitectura 5, 10). Séneca, que vivía encima de unos baños, se queja del ruido: los que levantan pesas resoplando, el depilador que grita para anunciarse, los vendedores de pasteles y salchichas (Cartas 56, 1-2).</p><p class="sub">Las Termas de Tito se inauguraron este año, junto al anfiteatro (Suetonio, Tito 7, 3). Su planta se conoce por los dibujos que hizo Andrea Palladio en el siglo XVI; la distribución de las salas en el juego es simplificada.</p>'),900);}
  else if(R.k==='fri'&&z.seq.length>=2&&!s.includes('cal')){setTimeout(()=>toast('Un bañista se ríe: «¿Al agua fría tan pronto? Primero se entra en calor: templada, caliente… y luego la fría».'),1500);}}
{const f=uxTick;uxTick=function(dt){f(dt);try{termTick(dt);}catch(e){}};}
// ---------------------------------------------------------------- Basílica Julia (la llama basilica() en 026 cuando o.hollow)
function basilicaInterior(o,g,gy,base,h1,h2,pd){const L=o.L,D=o.D,a=o.rot||0,Hh=h1+h2+12,W=lam('#e3d8c2'),N=D-pd,zc=-pd/2;INT.bas={x:o.x,z:o.z,a,gy:gy+base};
  // muros del fondo y de los lados; el frente da al pórtico con cinco grandes arcos (pilares entre ellos)
  box(L-1,Hh,1.2,W,0,base+Hh/2,zc-N/2+0.6,g);for(const s of[-1,1])box(1.2,Hh,N,W,s*(L/2-1.1),base+Hh/2,zc,g);
  const fz=zc+N/2-0.6,nA=9,aw=(L-1)/nA;for(let i=0;i<=nA;i++){box(aw*0.42,Hh,1.2,W,-L/2+0.5+i*aw,base+Hh/2,fz,g);}box(L-1,Hh-h1-2,1.2,W,0,base+h1+2+(Hh-h1-2)/2,fz,g);
  box(L-1,1,N,lam('#d8ccb4'),0,base+Hh,zc,g);   // techo
  // dos filas de pilares que separan la nave de las naves laterales, y el suelo de mármoles de colores
  const nP=12;for(let i=0;i<nP;i++)for(const s of[-1,1]){const lx=-L/2+L*(i+0.5)/nP,lz=zc+s*N*0.28;box(1.6,Hh-2,1.6,lam('#d6cbb5'),lx,base+(Hh-2)/2,lz,g);const w=toW(lx,lz,o.x,o.z,a);addCirc(w[0],w[1],1.0);}
  for(let i=0;i<10;i++)for(let j=0;j<4;j++){const t=box(L/10-0.2,0.04,N/4-0.2,lam(((i+j)%2)?'#c9b9a0':'#9a7a6a'),-L/2+L*(i+0.5)/10,base+0.03,zc-N/2+N*(j+0.5)/4,g);t.userData.noCol=true;}
  // los cuatro tribunales de los centunviros: estrado, sillas de los jueces y bancos para el público
  for(let k=0;k<4;k++){const lx=-L/2+L*(k+0.5)/4,lz=zc-N*0.12;box(10,0.8,5,lam('#bfae92'),lx,base+0.4,lz,g);for(let c=0;c<5;c++)box(0.8,1.2,0.8,lam('#7a5434'),lx-3.2+c*1.6,base+1.4,lz-1.2,g);
    for(let r=0;r<2;r++)box(8,0.45,0.6,lam('#8a6a4a'),lx,base+0.23,lz+4+r*1.6,g);const w=toW(lx,lz,o.x,o.z,a);addBox(w[0],w[1],10,5,a,0.2);
    if(k===1){const e=toW(lx,lz+3,o.x,o.z,a);egxObj(e[0],e[1],gy+base,'int:jui','Tribunal de los centunviros','pleitos de herencias',4);}}
  // colisiones: fondo, lados y los pilares del frente (los arcos quedan libres)
  const S=(x1,z1,x2,z2)=>{const p=toW(x1,z1,o.x,o.z,a),q=toW(x2,z2,o.x,o.z,a);intWallSeg(p[0],p[1],q[0],q[1]);};
  S(-L/2+0.5,zc-N/2,L/2-0.5,zc-N/2);S(-L/2+0.5,zc-N/2,-L/2+0.5,zc+N/2);S(L/2-0.5,zc-N/2,L/2-0.5,zc+N/2);
  for(let i=0;i<=nA;i++){const lx=-L/2+0.5+i*aw,w=toW(lx,fz,o.x,o.z,a);addCirc(w[0],w[1],aw*0.21+0.3);}
  addPlat(o.x,o.z,L+2,D+2,a,gy+base);
  // tres peldaños delante, desde el Foro (la plataforma está 1,2 m más alta)
  for(let k=1;k<=3;k++){const lz=D/2+1+(k-0.5)*0.8,top=base-k*0.4;box(L,top+2,0.8,TRAV,0,top/2-1,lz,g);const w=toW(0,lz,o.x,o.z,a);addPlat(w[0],w[1],L,0.8,a,gy+top);}}
// ---------------------------------------------------------------- textos y el pleito
const INT_TX={
 pg0:'Marte, el dios de la guerra y padre de Rómulo. Dion Casio cuenta que en el Panteón de Agripa había estatuas de muchos dioses, entre ellas las de Marte y Venus, y una del Divino Julio (Historia romana 53, 27, 2-3). Agripa quiso poner también una de Augusto; Augusto no aceptó, y su estatua y la de Agripa se pusieron fuera, en el pórtico.',
 pg1:'Venus, la madre de Eneas: los Julios decían descender de ella, así que honrarla aquí era honrar a la familia de Augusto (Dion Casio 53, 27, 2). Plinio cuenta que la Venus del Panteón llevaba en las orejas las dos mitades de una perla de Cleopatra (Historia natural 9, 121).',
 pg2:'El Divino Julio: Julio César, que el Senado declaró dios después de su muerte. Su estatua estaba entre las de los dioses (Dion Casio 53, 27, 3).',
 pcupula:'<p>Ves una rotonda con cúpula y una abertura redonda arriba, el óculo, por donde entra la única luz y también la lluvia (el suelo tiene desagües).</p><p><b>Cuidado: así es el Panteón que reconstruirá Adriano hacia el 125 d.C.</b>, el que se conserva. Del de Agripa (27-25 a.C.) no sabemos bien la forma: las excavaciones muestran que también miraba al norte, pero no si tenía cúpula. Plinio cuenta que tenía capiteles de bronce y cariátides del escultor ateniense Diógenes (Historia natural 34, 13 y 36, 38). Y este mismo año, el 80, un incendio lo ha dañado (Dion Casio 66, 24, 2).</p>'};
function intAct(o){const k=String(o.act).slice(4),ro=MODE==='roma';
  if(k==='jui')return juiOpen();
  if(k.startsWith('t')){const R=TERM_ROOMS.find(r=>'t'+r.k===k);if(R){openInfo(R.n,'<p>'+R.t+'</p><p class="sub">Recorre las salas en el orden de un baño: vestuario, templada, caliente y fría.</p>');return;}}
  const t=INT_TX[k];if(t)openInfo(o.data.name,t.startsWith('<p>')?t:'<p>'+t+'</p>');}
function openInfo(title,html){eduOverlay('intBox',title,html);}
{const f=egxAct0;egxAct0=function(o){if(String(o.act).startsWith('int:'))return intAct(o);return f(o);};}
// el pleito: una querella de testamento «inoficioso» (el hijo desheredado sin motivo)
const JUI=[
 {who:'El abogado del heredero',t:'«Jueces: el difunto Lucio Valerio era dueño de sus bienes y escribió su testamento con plena razón, ante siete testigos, con su sello. Dejó todo a su amigo Marco, que lo cuidó en la enfermedad. ¿Vamos a deshacer la voluntad de un hombre libre?»'},
 {who:'El abogado del hijo',t:'«Jueces: un padre puede dejar sus bienes a quien quiera, sí. Pero dejar a su hijo sin nada, sin una sola razón, sin mencionarlo siquiera, va contra el deber de un padre (officium). Un testamento así no es fruto de la razón: es como si lo hubiera escrito un loco. Pedimos que se anule».'}];
function juiOpen(){const z=state.jui||(state.jui={n:0});let i=0;
  const B=()=>$('juiB');const show=()=>{const s=JUI[i];B().innerHTML='<p><b>'+s.who+'</b></p><p>'+s.t+'</p>';const O=$('juiO');O.innerHTML='';const b=document.createElement('button');b.textContent=i<JUI.length-1?'Escuchar a la otra parte':'Votar';b.onclick=()=>{i++;i<JUI.length?show():vote();};O.appendChild(b);};
  const vote=()=>{B().innerHTML='<p>Los jueces dan su voto. ¿Qué votas tú?</p>';const O=$('juiO');O.innerHTML='';
    for(const[t,v]of[['Anular el testamento: el hijo debe recibir su parte','a'],['Mantener el testamento: era su voluntad','m']]){const b=document.createElement('button');b.textContent=t;b.style.display='block';b.style.margin='6px 0';b.onclick=()=>fin(v);O.appendChild(b);}};
  const fin=v=>{z.n++;if(z.n===1){qAdd('kl',1,'Has juzgado en la Basílica Julia.');qAdd('so',1);}save();
    B().innerHTML='<p>'+(v==='a'?'Votas con la mayoría: en casos así los centunviros solían dar la razón al hijo.':'Votas con la minoría: en casos así los centunviros solían dar la razón al hijo.')+' Esta reclamación se llama «querella de testamento inoficioso»: si un padre desheredaba sin motivo a sus hijos, el tribunal podía anular el testamento y darles su parte.</p><p>El tribunal de los centunviros juzga herencias aquí, en la Basílica Julia, con unos 180 jueces repartidos en cuatro salas; el público llena las galerías y se asoma para oír a los abogados. Plinio el Joven, abogado famoso en este tribunal, describe un pleito así, el de Atia Viriola, desheredada por su padre a los ochenta años de él (Cartas 6, 33). <span class="sub">(Plinio lo escribe hacia el 106 d.C.: dentro de unos veinticinco años.)</span> Quintiliano, que enseña retórica aquí al lado, habla a menudo de este tribunal en su Institución oratoria.</p>';
    $('juiO').innerHTML='';};
  eduOverlay('juiBox','Tribunal de los centunviros','<div id="juiB"></div><div id="juiO"></div>');show();}
// bajo techo no llueve (la lluvia se dibuja alrededor de la cámara)
function intInside(){const x=player.x,z=player.z,T=INT.term,B=INT.bas;
  if(T&&Math.abs(x-T.cx)<35&&z>T.cz-26&&z<T.cz+18)return true;
  if(B){const l=toL(x,z,B.x,B.z,B.a);if(Math.abs(l[0])<50&&l[1]>-24&&l[1]<18)return true;}
  if(MODE==='roma'&&Math.hypot(x+640,z+540)<25)return true;return false;}
{const f=uxTick;uxTick=function(dt){f(dt);try{if(MODE==='roma'&&typeof WXS!=='undefined'&&WXS.rainM&&WXS.rainM.visible&&intInside())WXS.rainM.visible=false;}catch(e){}};}
