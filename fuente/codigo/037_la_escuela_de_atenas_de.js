// ============================================================ «La escuela de Atenas» de Rafael: biblioteca, sueño en la Academia y diálogo libre con Platón
let RAFAEL_SRC='';   // se rellena al llegar datos/rafaelimg.txt (más abajo, con la imagen de Roma)
// figuras del fresco: [id, nombre, x %, y %, texto]
const RAF_FIG=[
 ['platon','Platón',48.4,58,'Con los rasgos de Leonardo da Vinci, señala al cielo y lleva el <i>Timeo</i>: para él lo verdaderamente real son las Ideas, eternas, que solo capta la razón. En el 386 a.C. tiene unos 42 años y acaba de fundar la Academia.'],
 ['aristoteles','Aristóteles',54.3,60,'Lleva la <i>Ética</i> y tiende la mano hacia la tierra: el conocimiento empieza por observar las cosas concretas. En el 386 a.C. aún no ha nacido: nacerá en Estagira en el 384 y entrará en la Academia en el 367, con 17 años.'],
 ['socrates','Sócrates',35,57,'De verde oliva, de perfil, cuenta argumentos con los dedos: es el método socrático, preguntar hasta que el otro descubre lo que no sabe. Fue condenado a muerte en el 399 a.C.: en el año del juego lleva trece años muerto.'],
 ['alcibiades','Alcibíades o Jenofonte',22.3,58,'El joven con casco y armadura que escucha a Sócrates. Suele identificarse con Alcibíades, el brillante y temerario discípulo de Sócrates (muerto en el 404), o con Jenofonte, otro discípulo, militar y escritor, que vive en el 386.'],
 ['epicuro','Epicuro',10.5,62,'Con una corona de pámpanos, quizá Epicuro (341-270 a.C.), que enseñará que la felicidad es la ausencia de dolor y de miedo. Nacerá 45 años después del año del juego.'],
 ['hipatia','¿Hipatia?',26.2,70,'La figura de blanco que mira al espectador. La tradición moderna la llama Hipatia, matemática y filósofa de Alejandría asesinada en el 415 d.C.; otros creen que es un joven, quizá Francesco Maria della Rovere. No hay ningún documento de la época que lo confirme.'],
 ['pitagoras','Pitágoras',19.5,82,'Escribe en un libro mientras un muchacho le sostiene una tablilla con las proporciones de la armonía musical. Pitágoras de Samos (c. 570-495 a.C.) enseñó que el universo está ordenado por números. En el 386, sus seguidores, como Arquitas de Tarento, siguen activos.'],
 ['heraclito','Heráclito',42,83,'Apoyado en un bloque, escribe pensativo. Rafael le dio los rasgos de Miguel Ángel y lo añadió cuando la obra estaba casi terminada. Heráclito de Éfeso (c. 540-480 a.C.) decía que todo fluye y que la guerra es el padre de todas las cosas.'],
 ['diogenes','Diógenes',58.8,79,'Tumbado en la escalinata, medio desnudo, con una copa: Diógenes el cínico, que vivía en una tinaja y despreciaba las convenciones. En el 386 a.C. es un muchacho de unos 26 años en Sinope; llegará a Atenas años después.'],
 ['euclides','Euclides o Arquímedes',86.7,86,'Se inclina con un compás sobre una pizarra, rodeado de alumnos. Tiene los rasgos del arquitecto Bramante. Euclides (c. 300 a.C.) escribirá los <i>Elementos</i> de geometría, el libro de matemáticas más leído de la historia.'],
 ['zoroastro','Zoroastro',90,68,'Sostiene la esfera celeste, con las estrellas. Zoroastro o Zaratustra, el profeta persa, simboliza aquí la astronomía y la sabiduría oriental.'],
 ['ptolomeo','Ptolomeo',95.5,76,'De espaldas, con una corona y el globo terrestre: Claudio Ptolomeo (siglo II d.C.), astrónomo y geógrafo de Alejandría, al que Rafael confunde con los reyes Ptolomeos de Egipto.'],
 ['rafael','Rafael',98.2,63,'Con un gorro oscuro, mira directamente al espectador: es el autorretrato de Rafael Sanzio (1483-1520), que se pintó entre los sabios. Junto a él, su colega Sodoma.'],
 ['apolo','Apolo',17.5,30,'En la hornacina de la izquierda, el dios Apolo con su lira: la música, la poesía y la armonía.'],
 ['atenea','Atenea (Minerva)',84.5,32,'En la hornacina de la derecha, Atenea, la diosa de la sabiduría, con el escudo de la Gorgona.']
];
ESSAYS.push({id:'rafael',cat:'Contexto',title:'«La escuela de Atenas» de Rafael',body:[
 'Rafael pintó este fresco entre 1509 y 1511 en la Estancia de la Signatura del Palacio Vaticano, por encargo del papa Julio II. Mide unos 5 por 7,7 metros y representa la Filosofía: frente a él está la <i>Disputa del Sacramento</i>, que representa la Teología. Toca cada figura para saber quién es (muchas identificaciones son tradicionales y se discuten).',
 '@@RF@@',
 'Es una reunión imposible: junta a pensadores separados por casi dos mil años, en un edificio que nunca existió en Atenas. Su arquitectura, con bóvedas de casetones, se inspira en el proyecto de Bramante para la nueva basílica de San Pedro y en las basílicas romanas, como la de Majencio (siglo IV d.C.). En el año del juego, el 386 a.C., Platón tiene unos 42 años y acaba de fundar la Academia; Sócrates ha muerto hace trece años, y Aristóteles todavía no ha nacido.',
 'En el juego, junto a la Academia hay una estela que te deja dormir bajo los olivos y soñar con el fresco: allí puedes hablar con sus figuras. Y en la Academia, si el juego tiene acceso a Claude, puedes discutir libremente con Platón.'],
 src:{a:['Giorgio Vasari, Vidas de los artistas (1550), vida de Rafael'],m:['K. Hall (ed.), Raphael’s School of Athens (1997)','G. Most, Leggere Raffaello. La Scuola di Atene e il suo pre-testo (1999)'],n:['Rafael murió en 1520: la obra es de dominio público. La identificación de muchas figuras, incluida la de Hipatia, es moderna y discutida.']}});
function rfHTML(){return RAFAEL_SRC?'<div class="rf"><img src="'+RAFAEL_SRC+'" alt="La escuela de Atenas, de Rafael">'+RAF_FIG.map((f,i)=>'<button class="rf-spot" data-rf="'+i+'" style="left:'+f[2]+'%;top:'+f[3]+'%" aria-label="'+f[1]+'" title="'+f[1]+'"></button>').join('')+'</div><div class="rf-info" id="rfInfo">Toca un punto del cuadro.</div>':'<i>(La imagen del fresco no está disponible en esta copia.)</i>';}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.rf-spot');if(!b)return;const f=RAF_FIG[+b.dataset.rf],box=document.getElementById('rfInfo');if(box)box.innerHTML='<b>'+f[1]+'.</b> '+f[4];document.querySelectorAll('.rf-spot').forEach(s=>s.classList.toggle('on',s===b));});

// ------------------------------------------------------------ el sueño: la sala del fresco, a 600 m de altura sobre los campos junto a la Academia
const DREAM={x:0,z:0,y:600,on:false};
function buildRaphaelHall(){
  const X=ACADEMY.x+260,Z=ACADEMY.z+60,Y=600,UP=1.5;Object.assign(DREAM,{x:X,z:Z});
  const g=grp(X,Y,Z,0),wall=M.marbleShade,mar=M.marble;DREAM.g=g;g.visible=false;   // oculta mientras no se sueña: desde la ciudad se veía flotando en el cielo
  // suelo delantero con el dibujo de mármoles del fresco, escalinata y suelo superior
  const flo=canvasTex(256,256,(x)=>{x.fillStyle='#d8cbb4';x.fillRect(0,0,256,256);x.fillStyle='#8a5a4a';x.fillRect(16,16,224,224);x.fillStyle='#efe6d4';x.fillRect(40,40,176,176);x.fillStyle='#8a5a4a';x.fillRect(64,64,128,128);x.fillStyle='#efe6d4';x.fillRect(96,96,64,64);});
  const fl=new THREE.Mesh(new THREE.BoxGeometry(40,1,20),[mar,mar,texMat(flo,6,3),mar,mar,mar]);fl.position.set(0,-0.5,14);fl.receiveShadow=true;g.add(fl);addPlat(X,Z+14,40,20,0,Y);
  for(let i=0;i<5;i++){const top=(i+1)*0.3,zc=4-i*0.45;box(38,top+1,0.46,mar,0,top/2-0.5,zc,g);addPlat(X,Z+zc,38,0.46,0,Y+top);}
  box(40,UP+1,60,mar,0,UP/2-0.5,-28.3,g);addPlat(X,Z-28.3,40,60,0,Y+UP);
  // muros laterales con pilastras, hornacinas y estatuas
  for(const s of[-1,1]){box(2,22,82,wall,s*19,11,-17,g);addSeg(X+s*18,Z-58,X+s*18,Z+24,0.3);
    for(let k=0;k<7;k++){const zc=-50+k*11;box(1.8,18,1.8,mar,s*17.6,UP+9,zc,g);box(2.2,0.8,2.2,mar,s*17.6,UP+18.4,zc,g);
      if(k<6){box(0.3,7,4,lam('#c9bfa9'),s*17.9,UP+6.5,zc+5.5,g);const st=makePerson({chiton:'#ece4d6',himation:'#ece4d6',skin:'#ece4d6',hair:'#ece4d6',female:k===4,attrRoles:{cloth:mar,drape:mar,skin:mar,hair:mar,sandal:mar,eye:mar}});st.scale.setScalar(k===5?1.9:1.3);st.position.set(s*17.2,UP+(k===5?1.2:3.2),zc+5.5);st.rotation.y=-s*Math.PI/2;g.add(st);if(k===5)box(1.6,1.2,2,mar,s*17.2,UP+0.6,zc+5.5,g);}}}
  box(40,1.2,1.2,mar,0,UP+18.2,-56,g);
  // bóveda de cañón con casetones y arcos fajones, como en el fresco
  const cof=canvasTex(128,128,(x)=>{x.fillStyle='#bfb29a';x.fillRect(0,0,128,128);for(let i=0;i<2;i++)for(let j=0;j<2;j++){const o=[i*64+6,j*64+6];x.fillStyle='#8e826c';x.fillRect(o[0],o[1],52,52);x.fillStyle='#a69a82';x.fillRect(o[0]+8,o[1]+8,36,36);x.fillStyle='#7c715d';x.fillRect(o[0]+16,o[1]+16,20,20);}});
  const vg=new THREE.CylinderGeometry(18,18,82,40,1,true,Math.PI/2,Math.PI);vg.rotateX(Math.PI/2);const vm=new THREE.MeshLambertMaterial({map:cof,side:THREE.DoubleSide});cof.repeat.set(10,12);
  const vault=new THREE.Mesh(vg,vm);vault.position.set(0,UP+18.8,-17);g.add(vault);
  for(const zc of[-50,-28,-6,16]){const t=new THREE.Mesh(new THREE.TorusGeometry(17.6,0.7,8,32,Math.PI),mar);t.position.set(0,UP+18.8,zc);g.add(t);}
  // muro del fondo con un gran arco abierto al cielo, y otro arco más allá
  for(const[zc,w,r,hs]of[[-57,40,7,9],[-76,30,5,7]]){const sh=new THREE.Shape();const H2=r+hs+18;sh.moveTo(-w/2,0);sh.lineTo(-w/2,H2);sh.lineTo(w/2,H2);sh.lineTo(w/2,0);sh.lineTo(r,0);sh.lineTo(r,hs);sh.absarc(0,hs,r,0,Math.PI,false);sh.lineTo(-r,0);sh.lineTo(-w/2,0);
    const m=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:2,bevelEnabled:false,curveSegments:16}),wall);m.position.set(0,UP,zc-1);g.add(m);addSeg(X-w/2,Z+zc,X-r,Z+zc,1);addSeg(X+r,Z+zc,X+w/2,Z+zc,1);}
  box(30,UP+1,20,mar,0,UP/2-0.5,-67,g);addPlat(X,Z-67,30,20,0,Y+UP);for(const s of[-1,1]){box(2,18,20,wall,s*14,UP+9,-67,g);addSeg(X+s*14,Z-77,X+s*14,Z-57,0.5);}addSeg(X-15,Z-77,X+15,Z-77,0.5);
  // balaustrada delantera (debajo, el vacío)
  box(40,1,0.6,mar,0,0.5,23.7,g);addSeg(X-20,Z+23.7,X+20,Z+23.7,0.4);
  footprints.push({x:X,z:Z-20,w:40,d:90,a:0,c:'#efe7d8',name:'Sueño: la escuela de Atenas',reserve:true});
  // figuras secundarias del fresco
  const extra=[['#c44a2a','#e8d9b0',-6,-2],['#6a8a4a','#e2d6c0',-9,-4],['#3d6aa8','#d8c9a8',8,-3],['#c97a2a','#efe6d2',11,-1],['#8a5a8a','#e2d6c0',-13,6],['#a8392b','#efe6d2',14,8],['#4f6a7d','#e8dfcc',3,-6],['#7a6a3a','#d7c9ab',-3,-7]];
  for(const[hi,ch,lx,lz]of extra){const p=makePerson({chiton:ch,himation:hi,beard:R()<0.7,hair:pick(['#8d8a85','#3e2c1f','#5b4532'])});p.position.set(X+lx,floorAt(X+lx,Z+lz),Z+lz);p.rotation.y=Math.atan2(-lx,8-lz)*0.6;scene.add(p);}
  // posiciones de los filósofos (como en el fresco: Platón y Aristóteles arriba, en el centro)
  const P=(lx,lz,r)=>[X+lx,Z+lz,r];
  Object.assign(NPC_POS,{r_platon:P(-1.2,-2,0),r_aristoteles:P(1.2,-2,0),r_socrates:P(-8,0,Math.PI/2),r_alcibiades:P(-10.5,0.6,-Math.PI/2),r_pitagoras:P(-9,12,0.4),r_heraclito:P(-3,11,0.2),
    r_diogenes:P(3,4.6,-0.3),r_euclides:P(10,13,-0.6),r_ptolomeo:P(15,10,-1.2),r_zoroastro:P(13.5,8.5,-1),r_hipatia:P(-12,9,0.6),r_epicuro:P(-15,7,0.5),r_rafael:P(16,15,-0.8)});
  place('ro_sueno_salida','Despertar','ΕΓΡΗΓΟΡΣΙΣ','Estás dentro de un sueño: la sala que Rafael pintó en el Vaticano en 1509-1511, con los sabios de dos mil años reunidos en una misma escalinata. Habla con ellos. Cuando quieras, toca esta estela para despertar bajo los olivos de la Academia.',X+4,Z+20,Math.PI);PLACES[PLACES.length-1].go='academia';
  const sp=toW(18,40,ACADEMY.x,ACADEMY.z,0);
  place('sueno','Los olivos de Academo','ΟΝΕΙΡΟΣ','Bajo los olivos sagrados del bosque de Academo, donde Platón pasea con sus discípulos, se está bien a la sombra. Dicen que quien duerme aquí sueña con los sabios del pasado y del futuro. Toca esta estela para dormir y soñar con «La escuela de Atenas», el fresco que Rafael pintará dentro de diecinueve siglos.',sp[0],sp[1],0);PLACES[PLACES.length-1].go='sueno';
}
// posturas del fresco (después de placeNPCs)
function poseDream(){
  const pose={r_diogenes:(g)=>{g.rotation.z=Math.PI/2;g.position.y+=0.3;},r_pitagoras:(g)=>{g.position.y-=0.55;if(g.userData.arms)g.userData.arms[1].rotation.x=-1;},r_heraclito:(g)=>{g.position.y-=0.6;g.rotation.x=0.15;if(g.userData.arms){g.userData.arms[0].rotation.x=-1.5;g.userData.arms[1].rotation.x=-0.9;}},
    r_euclides:(g)=>{g.rotation.x=0.5;if(g.userData.arms)g.userData.arms[1].rotation.x=-1.5;},r_platon:(g)=>{if(g.userData.arms)g.userData.arms[1].rotation.x=-2.9;},r_aristoteles:(g)=>{if(g.userData.arms)g.userData.arms[1].rotation.x=-1.4;},
    r_socrates:(g)=>{if(g.userData.arms){g.userData.arms[0].rotation.x=-1.2;g.userData.arms[1].rotation.x=-1.2;}},
    r_ptolomeo:(g)=>{const s=new THREE.Mesh(new THREE.SphereGeometry(0.32,16,12),lam('#6f8a6a'));s.position.set(0,1.35,0.45);g.add(s);},r_zoroastro:(g)=>{const s=new THREE.Mesh(new THREE.SphereGeometry(0.32,16,12),lam('#3a4f8a'));s.position.set(0,1.35,0.45);g.add(s);}};
  for(const n of npcObjs){if(!/^r_/.test(n.data.id))continue;n.noTurn=true;const f=pose[n.data.id];if(f)f(n.g);}
}
function dreamTravel(to){
  closeDialog();ui='voyage';if(MOUNT.riding)dismount();if(MOUNT.g){MOUNT.g.visible=false;MOUNT.st='away';}
  const v=$('voyage');v.querySelector('.vt').textContent=to==='sueno'?'Te quedas dormido…':'Despiertas…';v.classList.toggle('land',true);
  v.querySelector('.vs').textContent=to==='sueno'?'Bajo los olivos de Academo, el rumor de las hojas te adormece.':'El sol se filtra entre los olivos. ¿Ha sido solo un sueño?';
  v.querySelector('.vf').textContent=to==='sueno'?'Rafael pintó «La escuela de Atenas» en 1509-1511, diecinueve siglos después de tu viaje.':'Platón enseñará en la Academia hasta su muerte, en el 348/347 a.C.';
  v.hidden=false;requestAnimationFrame(()=>v.classList.add('show'));
  setTimeout(()=>{if(to==='sueno'){player.x=DREAM.x;player.z=DREAM.z+18;player.yaw=0;}else{const p=toW(18,46,ACADEMY.x,ACADEMY.z,0);player.x=p[0];player.z=p[1];player.yaw=Math.PI;}
    player.feet=floorAt(player.x,player.z);player.camY=player.feet+player.eye;player.vy=0;player.pitch=0.05;curZone=null;DREAM.on=to==='sueno';if(DREAM.g)DREAM.g.visible=DREAM.on;
    v.classList.remove('show');setTimeout(()=>{v.hidden=true;ui='play';},700);},2600);
}

// imagen real (no generada) en la pantalla de inicio: la Loba Capitolina en Roma, «La escuela de Atenas» en Atenas
let LOBA_SRC='';
const LOBA_CAP='<b>El Vesubio en erupción, de noche</b>Pintura de época moderna (siglos XVIII-XIX), con el faro del puerto de Nápoles. En el año 79, hace solo uno, el volcán sepultó Pompeya y Herculano; Plinio el Viejo murió al acercarse para verlo y ayudar a los vecinos (Plinio el Joven, Cartas VI 16).';
function stImgFill(){const f=document.getElementById('stImg');if(!f)return;const roma=typeof MODE!=='undefined'&&MODE==='roma';const src=roma?LOBA_SRC:RAFAEL_SRC;if(!src){f.hidden=true;return;}
  f.querySelector('img').src=src;f.querySelector('img').alt=roma?'La Loba Capitolina con Rómulo y Remo':'La escuela de Atenas, de Rafael';
  f.querySelector('figcaption').innerHTML=roma?LOBA_CAP:'<b>La escuela de Atenas</b>Rafael la pintó en el Vaticano en 1509-1511, casi dos mil años después de tu partida: es una Atenas imaginada. En el centro, Platón, que en 386 a.C. empieza a enseñar en la Academia, y su futuro alumno Aristóteles. <i>Dominio público.</i>';f.hidden=false;}
setTimeout(stImgFill,0);
// las dos imágenes llegan aparte (en atenas.html, de datos/): al llegar, se ponen en la pantalla de inicio y en la presentación si ya estaban abiertas
for(const[id,set]of[['rafaelimg',v=>RAFAEL_SRC=v],['lobaimg',v=>LOBA_SRC=v]])datoGet(id).then(t=>{t=t.trim();if(t.length<100)return;set('data:image/jpeg;base64,'+t);
  try{stImgFill();const b=document.querySelector('#intro .ibg');if(b&&!/url\(["']?data:/.test(b.style.backgroundImage))b.style.backgroundImage='url('+((MODE==='roma')?LOBA_SRC:RAFAEL_SRC)+')';}catch(e){}});
