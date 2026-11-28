// ============================================================ GIZA: LAS PIRÁMIDES, LA ESFINGE Y SUS TEMPLOS (Menfis, las dos épocas) (28/11)
// Comparado con J.-C. Golvin, Ciudades del mundo antiguo, p. 32 (Giza en la dinastía IV). En el 386 a.C. y en el 80 d.C. las pirámides
// conservaban su revestimiento de caliza blanca pulida (se arrancó en la Edad Media para construir El Cairo); la ciudad de las pirámides,
// el puerto y el barrio de los obreros llevaban dos mil años abandonados, y los templos funerarios estaban arruinados. Aquí:
//  · pirámides con caras de verdad y su textura de sillares finos; la de Keops con la cima plana (Diodoro I 63: «arriba, seis codos»);
//  · los templos altos, junto a la cara este, y las calzadas que bajan hacia el valle;
//  · las tres pirámides de las reinas de Keops y los campos de mastabas al este y al oeste;
//  · la Esfinge a su tamaño (unos 73 m de largo y 20 de alto), con la estela del sueño de Tutmosis IV entre las patas y el templo del
//    valle de Kefrén al lado; en el 386, con la arena hasta el pecho (Heródoto no la menciona); en el 80, despejada, con escalinata y altar.
// No se encontró ningún modelo CC0 de la Esfinge ni de las pirámides que sirviera (ver la conversación del 28/11); son modelos propios.
// Todo con el kit de 286_tebas_modelos.js (boxUV, tbMerge, tbMat) y pocas mallas.
// la pirámide: cuatro caras con UV a escala del mundo; con top>0, cima plana de ese lado
egPyramid=function(x,z,base,h,col,top){const y=floorAt(x,z),b=base/2,t=(top||0)/2,ht=t>0?h*(1-t/b):h,P=[],U=[],s=8,sl=Math.hypot(b-t,ht);
  const quad=(a,b2,c,d)=>{P.push(...a,...b2,...c,...a,...c,...d);};
  for(let f=0;f<4;f++){const an=f*Math.PI/2,c=Math.cos(an),sn=Math.sin(an),R2=(u,v,yy)=>[x+u*c-v*sn,y+yy,z+u*sn+v*c];
    const p0=R2(-b,b,0),p1=R2(b,b,0),p2=R2(t,t,ht),p3=R2(-t,t,ht);
    if(t>0){quad(p0,p1,p2,p3);U.push(0,0,base/s,0,(b+t)/s,sl/s,0,0,(b+t)/s,sl/s,(b-t)/s,sl/s);}else{P.push(...p0,...p1,...p2);U.push(0,0,base/s,0,b/s,sl/s);}}
  if(t>0){const q=(u,v)=>[x+u,y+ht,z+v];P.push(...q(-t,-t),...q(-t,t),...q(t,t),...q(-t,-t),...q(t,t),...q(t,-t));U.push(0,0,0,1,1,1,0,0,1,1,1,0);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();
  const m=new THREE.Mesh(g,tbMat('casing',col||'#ffffff'));m.castShadow=true;m.receiveShadow=true;scene.add(m);
  addBox(x,z,base*0.92,base*0.92,0);footprints.push({x,z,w:base,d:base,a:0,c:'#e2d6b8',name:'Pirámide'});try{atReg(x,z,undefined,'pyramid',base*0.45);}catch(e){}return m;};
// la Esfinge, mirando a +z local (en el mapa se gira hacia el este, hacia el río)
egSphinx=function(x,z,a,buried){const y=floorAt(x,z),L=[],st=tbMat('stone','#e6cfa0'),R=new THREE.Matrix4().makeRotationY(a),O=new THREE.Matrix4().makeTranslation(x,y,z),
    T=(g,lx,ly,lz)=>L.push([g,O.clone().multiply(R).multiply(new THREE.Matrix4().makeTranslation(lx,ly,lz))]);
  T(boxUV(22,2,76,4),0,1,0);   // la roca madre recortada
  {const g=new THREE.CylinderGeometry(1,1,40,12);g.rotateX(Math.PI/2);g.scale(9.5,8,1);T(g,0,10,-8);}
  {const g=new THREE.SphereGeometry(1,12,8);g.scale(10,8.5,10);T(g,0,9.5,-24);}
  for(const s of[-1,1]){T(boxUV(5,5,12,4),s*7.5,4.5,-26);T(boxUV(4.4,4,16,4),s*5.2,3,25);T(boxUV(5,4.5,5,4),s*5.2,3.2,32.5);}
  T(boxUV(13,15,9,4),0,10.5,15);T(boxUV(7,8,7,4),0,20.5,17);
  {const g=new THREE.CylinderGeometry(4.3,7.4,9,4);g.rotateY(Math.PI/4);g.scale(1,1,0.62);T(g,0,18.8,15.2);}
  T(boxUV(7.6,1.6,7.4,4),0,25.2,16.4);T(boxUV(1.4,2,1.6,4),0,20,20.8);T(boxUV(1,1.4,1,4),0,25.9,20.3);
  for(const s of[-1,1])T(boxUV(0.7,2,1.4,4),s*3.8,21.5,16.6);
  T(boxUV(4,5.5,0.9,4),0,4.7,29);   // la estela del sueño de Tutmosis IV, entre las patas
  const m=new THREE.Mesh(tbMerge(L),st);m.castShadow=true;m.receiveShadow=true;scene.add(m);
  const p=toW(0,0,x,z,a);addBox(p[0],p[1],22,74,a);
  if(buried){const s=new THREE.Mesh(new THREE.SphereGeometry(1,24,10,0,TAU,0,Math.PI/2),lam('#d8b97a'));s.scale.set(27,19.5,50);s.rotation.y=a;const q=toW(0,-2,x,z,a);s.position.set(q[0],y-1,q[1]);scene.add(s);}
  else{const L2=[];for(let i=0;i<8;i++){const g=boxUV(16,0.4,1.8,4);L2.push([g,O.clone().multiply(R).multiply(new THREE.Matrix4().makeTranslation(0,2-i*0.25,40+i*1.8))]);}
    L2.push([boxUV(3,1.6,3,4),O.clone().multiply(R).multiply(new THREE.Matrix4().makeTranslation(0,2.8,36))]);const m2=new THREE.Mesh(tbMerge(L2),tbMat('stone'));m2.receiveShadow=true;scene.add(m2);}
  try{atReg(x,z,undefined,'sphinx',10);}catch(e){}return m;};
// lo que rodea las pirámides
function gzBuild(I){const ro=MODE==='roma',X=x=>I.x+x,Z=z=>I.z+z,L={},st=tbMat('stone','#ece2ca'),rel=tbMat('relief2'),
  put=(m,g,mt)=>{(L[m.uuid]=L[m.uuid]||{m,L:[]}).L.push([g,mt]);},bx=(m,lx,lz,w,h,d,a,coll)=>{const x=X(lx),z=Z(lz),y=floorAt(x,z);put(m,boxUV(w,h,d,m.userData.s||4),new THREE.Matrix4().makeRotationY(a||0).setPosition(x,y+h/2-0.5,z));if(coll!==false)addBox(x,z,w,d,a||0);};
  // mastaba: tumba de caliza en talud, con la falsa puerta en la cara este
  const mastaba=(lx,lz,w,d,h)=>{const x=X(lx),z=Z(lz);if(!isFree(x,z,Math.max(w,d)/2+1))return;const y=floorAt(x,z),g=boxUV(w,h,d,4),p=g.attributes.position;for(let i=0;i<p.count;i++)if(p.getY(i)>0){p.setX(i,p.getX(i)*0.9);p.setZ(i,p.getZ(i)*0.94);}g.computeVertexNormals();
    put(st,g,new THREE.Matrix4().makeTranslation(x,y+h/2-0.3,z));put(tbMat('stone','#4a3a2a'),boxUV(0.3,2.2,1.2,4),new THREE.Matrix4().makeTranslation(x+w*0.45+0.1,y+1.1,z));addBox(x,z,w,d,0);};
  // templos altos (junto a la cara este) y calzadas
  const temple=(lx,lz,w,d,h)=>{bx(rel,lx,lz,w,h,d);bx(st,lx,lz,w+1,1,d+1,0,false);};
  const causeway=(pts,w)=>{const m=tbMat('stone','#ddd0b0');for(let i=0;i+1<pts.length;i++){const[a0,b0]=[pts[i],pts[i+1]],Ln=Math.hypot(b0[0]-a0[0],b0[1]-a0[1]),an=Math.atan2(b0[0]-a0[0],b0[1]-a0[1]),n=Math.ceil(Ln/8);
      for(let k=0;k<n;k++){const t=(k+0.5)/n,lx=a0[0]+(b0[0]-a0[0])*t,lz=a0[1]+(b0[1]-a0[1])*t,x=X(lx),z=Z(lz);put(m,boxUV(w,0.6,8.4,4),new THREE.Matrix4().makeRotationY(an).setPosition(x,floorAt(x,z)+0.1,z));}}};
  // Keops (centro en −330, −280; 230 m)
  temple(-185,-280,40,52,7);causeway([[-165,-280],[-60,-262],[60,-240]],8);
  for(const[qz,qb]of[[-372,48],[-322,46],[-218,44]])egPyramid(X(-130),Z(qz),qb,30);
  for(let i=0;i<3;i++)for(let j=0;j<4;j++)mastaba(-80+i*24,-396+j*26,20,12,6);
  for(let i=0;i<4;i++)for(let j=0;j<7;j++)mastaba(-470-i*28,-390+j*30,20,11,5.5);
  // Kefrén (centro en −350, 20; 215 m): templo alto, calzada en diagonal y el templo del valle junto a la Esfinge
  temple(-218,20,46,40,7);causeway([[-230,42],[-222,70],[-172,84]],7);bx(tbMat('stone','#c9a8a0'),-150,96,44,12,44);
  // Micerino (centro en −260, 230; 105 m)
  temple(-190,230,34,30,6);causeway([[-172,230],[-80,236]],6);
  for(const k in L){const m=new THREE.Mesh(tbMerge(L[k].L),L[k].m);m.castShadow=true;m.receiveShadow=true;scene.add(m);}
  place('gz_templos','Los templos de las pirámides','ΙΕΡΑ ΤΩΝ ΠΥΡΑΜΙΔΩΝ','Junto a la cara este de cada pirámide había un templo donde se hacían ofrendas al rey muerto, y de él bajaba una calzada cubierta hasta un templo en el valle, a la orilla de un canal del Nilo: por ahí llegaba el cuerpo del rey en su barca. Hace dos mil años que nadie los cuida: '+(ro?'muchos bloques se los han llevado para otras obras.':'los techos se han caído y la arena entra por las puertas.')+' El templo del valle de Kefrén, junto a la Esfinge, es de granito rojo de Asuán y aún se mantiene en pie.\n(Heródoto II 124; J.-C. Golvin, Ciudades del mundo antiguo, p. 32)',X(-160),Z(-250),Math.PI/2);
  place('gz_mastabas','Las mastabas','ΤΑΦΟΙ','Alrededor de la pirámide de Keops, en calles ordenadas, las tumbas de su familia y de sus altos funcionarios: bloques de piedra en talud, con una capilla y una puerta falsa en la cara este, por la que el alma del muerto salía a recoger las ofrendas. El pozo con el sarcófago está debajo, en la roca. Las tres pirámides pequeñas, al este, son de sus reinas.\n(J.-C. Golvin, p. 32)',X(-56),Z(-420),Math.PI/2);
  place('gz_cima','La cima de la Gran Pirámide','ΚΟΡΥΦΗ','La Gran Pirámide no acaba en punta: Diodoro dice que arriba hay una plataforma de seis codos por lado. Quizá nunca se colocó la última piedra; quizá se cayó. Las caras, en cambio, todavía están cubiertas de caliza blanca y pulida, tan bien encajada que de lejos parece una sola piedra.\n(Diodoro I 63; Heródoto II 124-125)',X(-215+12),Z(-280-40),Math.PI/2);}
{const w=(o)=>{if(!o||!o.extra)return;const e=o.extra;o.extra=function(I){const r=e.apply(this,arguments);try{gzBuild(I);}catch(err){console.warn('giza',err);}return r;};};
 if(typeof SIMPLE_GR!=='undefined')w(SIMPLE_GR.menfis);if(typeof SIMPLE_RO!=='undefined')w(SIMPLE_RO.menfis);}
