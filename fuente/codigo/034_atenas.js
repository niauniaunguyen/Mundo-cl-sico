// ============================================================ ATENAS: decoración de la polis (siglo IV a.C.)
const HEKA=[];   // hecateos de los cruces: posición, para nombrarlos en el modo «mirar con atención» (197)
// Las calles griegas no se pavimentan: tierra apisonada y grava, con desagües de piedra; el Ágora es un gran espacio de tierra
// con plátanos, puestos de mercado, estatuas honoríficas, estelas con decretos, hermas, fuentes y pozos.
Object.assign(DTEX,{
 earth:canvasTex(256,256,(x)=>{x.fillStyle='#a8916a';x.fillRect(0,0,256,256);const r=mulberry32(41);for(let i=0;i<900;i++){const c=120+r()*60|0;x.fillStyle='rgba('+c+','+(c-14)+','+(c-40)+','+(0.25+r()*0.4)+')';const s=1+r()*3;x.fillRect(r()*256,r()*256,s,s);}}),
 gravel:canvasTex(128,128,(x)=>{x.fillStyle='#9f8f72';x.fillRect(0,0,128,128);const r=mulberry32(43);for(let i=0;i<700;i++){const c=110+r()*90|0;x.fillStyle='rgb('+c+','+(c-8)+','+(c-26)+')';x.beginPath();x.arc(r()*128,r()*128,0.6+r()*1.8,0,TAU);x.fill();}}),
 drain:canvasTex(64,64,(x)=>{x.fillStyle='#857a66';x.fillRect(0,0,64,64);x.fillStyle='#4f4a40';x.fillRect(14,0,36,64);x.fillStyle='#6f6656';for(let i=0;i<4;i++)x.fillRect(0,i*16,64,1);})
});
function bronzeFig(x,y,z,a,look,s){const br=lam('#7d6a3e'),sk=lam('#8f7646');const g=makePerson(Object.assign({chiton:'#7d6a3e',himation:'#7d6a3e',hair:'#7d6a3e',attrRoles:{cloth:br,drape:br,skin:sk,hair:br,sandal:br,eye:br}},look));g.scale.setScalar(s||1.15);g.position.set(x,y,z);g.rotation.y=a;scene.add(g);return g;}
// calles de grava con desagüe de piedra a un lado (dentro de las murallas)
function athensRoadsDecor(){
  const road=[],ruv=[],drn=[],duv=[],q=(arr,uvs,a,b,c,d,ta,tb,tc,td)=>{arr.push(...a,...b,...c,...a,...c,...d);uvs.push(...ta,...tb,...tc,...ta,...tc,...td);};
  for(const r of ROADS){const p=r.pts;if(p.some(v=>v[0]>8000))continue;const pts=[];for(let i=0;i<p.length-1;i++){const L=Math.hypot(p[i+1][0]-p[i][0],p[i+1][1]-p[i][1]),n=Math.max(1,Math.ceil(L/3));for(let k=0;k<n;k++)pts.push([lerp(p[i][0],p[i+1][0],k/n),lerp(p[i][1],p[i+1][1],k/n)]);}pts.push(p[p.length-1]);
    let s=0,prev=null;const w=r.w/2;
    for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1,nx=-dz/l,nz=dx/l,[x,z]=pts[i];if(i)s+=Math.hypot(x-pts[i-1][0],z-pts[i-1][1]);
      const P=(o,y)=>[x+nx*o,terrainH(x+nx*o,z+nz*o)+y,z+nz*o],ok=terrainH(x,z)>-0.5&&!inCavea(x,z),city=insideWalls(x,z);
      const cur={ok,city,s,L:P(-w,0.1),R:P(w,0.1),d0:P(w,0.07),d1:P(w+0.8,0.07)};
      if(prev&&prev.ok&&ok){const u0=prev.s/4,u1=s/4,v=r.w/4;q(road,ruv,prev.L,prev.R,cur.R,cur.L,[u0,0],[u0,v],[u1,v],[u1,0]);
        if(prev.city&&city)q(drn,duv,prev.d0,prev.d1,cur.d1,cur.d0,[u0*2,0],[u0*2,1],[u1*2,1],[u1*2,0]);}
      prev=cur;}}
  const mk=(pos,uv,tex)=>{if(!pos.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();const m=DMAT(tex);m.side=THREE.DoubleSide;const me=new THREE.Mesh(g,m);me.receiveShadow=true;me.userData.drape=true;scene.add(me);};
  mk(road,ruv,'gravel');mk(drn,duv,'drain');
}
function athensDecor(){
  // el Ágora: tierra apisonada
  {const c=AL(12,-28);drape(c[0],c[1],215,240,0,'earth',8,0.08);}
  athensRoadsDecor();
  const avoid=[...Object.values(NPC_POS),AL(-97,21),AL(-64,66),AL(-89,-68),AL(10,-30),AL(40,-19.6),AL(30,67),AL(-120,2),AL(-113,-3),AL(92,-70),AL(-74,-42)];
  const farNPC=(x,z,m)=>avoid.every(p=>Math.hypot(p[0]-x,p[1]-z)>m);
  // puestos del mercado: mesas, toldos y mercancías; algunos vendedores pregonan
  const AW=[lam('#c9a24a'),lam('#a8392b'),lam('#e9dfc8'),lam('#5c6b3f')],JAR=lam('#b5603a'),WIC=lam('#a8864f'),CL=[lam('#7a2a5e'),lam('#2f4c86'),lam('#efe6d2')];
  const sells=[['Higos del Ática, los más dulces de Grecia. ¡Prueba uno!','Aceite nuevo, de olivos de Acarnas.'],['¡Anguilas del Copais, recién llegadas de Beocia!','Pescado del Falero: sardinas, pulpo, atún.'],['Vasijas del Cerámico, con figuras rojas. Barato.','Lámparas, cántaros, ollas: todo para la casa.'],['Telas de Mileto, lana fina. Para un himation de verdad.','Perfume de rosas, en aríbalos de Corinto.'],['Coronas de mirto y violetas para el banquete.','Libros, rollos de papiro egipcio. Eurípides, Homero.']];
  let ns=0;for(let k=0;k<900&&ns<34;k++){const[x,z]=AL(rr(-70,92),rr(-118,62)),a=Math.floor(R()*4)*Math.PI/2+rr(-0.15,0.15);if(roadDist(x,z)<5||!isFree(x,z,2.6)||footHit(x,z,3)||!farNPC(x,z,5))continue;
    const b={x,y:floorAt(x,z),z,a};try{atReg(x,z,b.y,'puesto',1.6);}catch(e){}pieceAt('stallT',UNIT,M.wood,b,0,0,0,2.0,0.85,0.9);pieceAt('stallA'+(ns%4),UNIT,AW[ns%4],b,0,2.15,-0.15,2.7,0.06,2.1);
    for(const[px,pz]of[[-1.25,-1.1],[1.25,-1.1],[-1.25,0.8],[1.25,0.8]])pieceAt('stallP',UNITC,M.wood,b,px,0,pz,0.08,2.15,0.08);
    const kind=ns%3;for(let i=0;i<3;i++){if(kind===0)pieceAt('stallJ',PGEO.jar,JAR,b,-0.6+i*0.6,0.85,0,1.3,1.3,1.3);else if(kind===1)pieceAt('stallK',UNITC,WIC,b,-0.6+i*0.6,0.85,0,0.5,0.28,0.5);else pieceAt('stallC'+i,UNIT,CL[i],b,-0.6+i*0.6,0.85,0,0.5,0.22,0.6);}
    addBox(x,z,2.7,2.1,a);
    if(ns%3===0){const sp=toW(0,-0.9,x,z,a),fem=R()<0.4,g=makePerson({chiton:pick(['#e8dfcc','#d7c9ab','#c9b48b']),himation:pick(['#7a5a3a','#4f6a7d','#8a3f2f']),female:fem,beard:!fem&&R()<0.7,hair:pick(['#2b1f17','#5b4532','#8d8a85'])});g.position.set(sp[0],floorAt(sp[0],sp[1]),sp[1]);g.rotation.y=a;scene.add(g);walkers.push({g,mode:'idle',tx:sp[0],tz:sp[1],wait:Infinity,speed:0,phase:R()*10,x:sp[0],z:sp[1],barks:pick(sells)});}
    ns++;}
  // los plátanos que plantó Cimón en el Ágora
  {const tr=[];for(let k=0;k<200&&tr.length<16;k++){const[x,z]=AL(rr(-80,100),R()<0.5?rr(55,75):rr(-130,-112));if(roadDist(x,z)>3&&isFree(x,z,3)&&!footHit(x,z,4)&&farNPC(x,z,4))tr.push({x,z,kind:'plane',k:rr(1.0,1.25),collide:true});}if(GLB.ok)treesGLB(tr);}
  // los Tiranicidas, Harmodio y Aristogitón
  {const[x,z]=findFree(...AL(-59,-26),3),gy=floorAt(x,z),a=-Math.PI/2;   // «más o menos enfrente del Metroon» (Arriano, Anábasis III 16.8)
   box(3.4,1.5,1.9,M.marble,x,gy+0.75,z).rotation.y=a;addBox(x,z,3.4,1.9,a);
   const p1=toW(-0.75,0,x,z,a),p2=toW(0.75,0,x,z,a);const f1=bronzeFig(p1[0],gy+1.5,p1[1],a+0.3,{short:true,beard:false}),f2=bronzeFig(p2[0],gy+1.5,p2[1],a-0.3,{short:true,beard:true});
   if(f1.userData.arms){f1.userData.arms[1].rotation.x=-2.7;f1.userData.arms[0].rotation.x=-0.6;}if(f2.userData.arms){f2.userData.arms[0].rotation.x=-1.4;f2.userData.arms[1].rotation.x=0.4;}
   place('tiranicidas','Los Tiranicidas','ΑΡΜΟΔΙΟΣ ΚΑΙ ΑΡΙΣΤΟΓΕΙΤΩΝ','Harmodio y Aristogitón mataron en el 514 a Hiparco, hermano del tirano Hipias, durante las Panateneas. Murieron por ello, pero los atenienses los honran como fundadores de la libertad: sus descendientes comen gratis en el Pritaneo y nadie más puede tener una estatua junto a ellos. El primer grupo de bronce, de Antenor, se lo llevó Jerjes a Persia en el 480; este es el que hicieron Critio y Nesiotes en el 477.',...toW(0,2.6,x,z,a),a);}
  // estatuas de Conón y Evágoras, por la victoria de Cnido (394)
  {const pts=[AL(-88,-54),AL(-88,-47)];pts.forEach((p0,i)=>{const[x,z]=findFree(p0[0],p0[1],1.5),gy=floorAt(x,z);box(1.3,1.7,1.3,M.marble,x,gy+0.85,z);addBox(x,z,1.3,1.3,0);bronzeFig(x,gy+1.7,z,Math.PI/2,{beard:true,hair:i?'#7d6a3e':'#7d6a3e'},1.1);});
   place('conon','Estatuas de Conón y Evágoras','ΚΟΝΩΝ ΚΑΙ ΕΥΑΓΟΡΑΣ','Junto al pórtico de Zeus Liberador, la ciudad ha levantado hace pocos años estatuas de bronce del general Conón y de su amigo Evágoras, rey de Salamina de Chipre, que con la flota del rey de Persia derrotaron a los espartanos en Cnido (394). Con el dinero persa Conón reconstruyó los Muros Largos. Es la primera vez desde los Tiranicidas que Atenas honra así a un hombre vivo.',AL(-82,-44)[0],AL(-82,-44)[1],Math.PI/2);}
  // estelas con decretos junto al Metroon y el Consejo
  for(let i=0;i<6;i++){const[x,z]=AL(-86,-34+i*2.3);if(!isFree(x,z,0.8))continue;const b={x,y:floorAt(x,z),z,a:Math.PI/2};pieceAt('decree',UNIT,M.marble,b,0,0,0,0.7,1.9,0.18);pieceAt('decreeP',GABLE,M.marble,b,0,1.9,0,0.78,0.22,0.2);addBox(x,z,0.7,0.3,Math.PI/2);}
  // hermas en los cruces, hecateos de tres caras, fuentes públicas y pozos
  // (los hecateos se anotan en HEKA para el modo «mirar con atención», 197)
  let nh=0,nk=0;for(const r of ROADS){const p=r.pts;if(p.some(v=>v[0]>8000))continue;
    for(let i=1;i<p.length-1;i++){const[x0,z0]=p[i];if(!insideWalls(x0,z0,10))continue;const dx=p[i+1][0]-p[i-1][0],dz=p[i+1][1]-p[i-1][1],l=Math.hypot(dx,dz)||1,ox=-dz/l*(r.w/2+2.2),oz=dx/l*(r.w/2+2.2);
      const[x,z]=[x0+ox,z0+oz];if(!isFree(x,z,1.2)||footHit(x,z,1)||!farNPC(x,z,3))continue;
      if(nh%3===2){const gy=floorAt(x,z);HEKA.push({x,z,y:gy});box(0.45,1.3,0.45,M.marble,x,gy+0.65,z);for(let k=0;k<3;k++){const t=k/3*TAU;statue(x+Math.sin(t)*0.32,gy+1.3,z+Math.cos(t)*0.32,t,0.42,'marble');}addCirc(x,z,0.4);}
      else herm(x,z,Math.atan2(-ox,-oz)+Math.PI);nh++;}
    const L=p.reduce((s,v,i)=>i?s+Math.hypot(v[0]-p[i-1][0],v[1]-p[i-1][1]):0,0);let acc=0;
    for(let i=0;i<p.length-1;i++){const dx=p[i+1][0]-p[i][0],dz=p[i+1][1]-p[i][1],Ls=Math.hypot(dx,dz),ux=dx/Ls,uz=dz/Ls;for(let d=30;d<Ls;d+=15){acc+=15;if(acc<210)continue;const x0=p[i][0]+ux*d,z0=p[i][1]+uz*d;if(!insideWalls(x0,z0,15))continue;
      const off=r.w/2+3.4,x=x0-uz*off,z=z0+ux*off,ar=Math.atan2(x0-x,z0-z);if(!isFree(x,z,2.6)||footHit(x,z,2.4)||!farNPC(x,z,4))continue;acc=0;
      const b={x,y:floorAt(x,z),z,a:ar};pieceAt('kreB',UNIT,M.limestone,b,0,0,-0.9,4.2,2.9,0.5);pieceAt('kreR',UNIT,M.stone,b,0,0,0.2,3.8,0.75,1.5);pieceAt('kreW',UNIT,lam('#4f8a96'),b,0,0.72,0.2,3.4,0.05,1.2);
      for(const s of[-1,1])pieceAt('kreC',UNITC,M.marble,b,s*1.6,0,0.85,0.36,2.7,0.36);pieceAt('kreT',UNIT,M.marble,b,0,2.7,0,4.6,0.4,2.3);pieceAt('kreS',UNIT,M.bronze,b,0,1.5,-0.55,0.26,0.26,0.36);addBox(x,z,4.6,2.3,ar);
      if(nk===0)place('krene','Fuente pública','ΚΡΗΝΗ','Una fuente pública (krene): un pequeño pórtico con un pilón en el que cae el agua por caños de bronce con forma de cabeza de león. Atenas no tiene acueductos como los que tendrá Roma: el agua llega por canales subterráneos desde las colinas o se saca de los pozos. Ir a la fuente es tarea de esclavas y de mujeres pobres, y uno de los pocos lugares donde las atenienses pueden charlar fuera de casa.',...toW(2.6,3,x,z,ar),ar);nk++;}}}
  {let nw=0;for(const f of footprints){if(!f.house||nw>=46||R()<0.9)continue;const p=toW(rr(-f.w*0.3,f.w*0.3),f.d/2+2.2,f.x,f.z,f.a);if(!isFree(p[0],p[1],1.2)||roadDist(p[0],p[1])<2)continue;const b={x:p[0],y:floorAt(p[0],p[1]),z:p[1],a:f.a};pieceAt('well',UNITC,lam('#a8532f'),b,0,0,0,0.95,0.72,0.95);pieceAt('wellI',UNITC,M.dark,b,0,0.7,0,0.6,0.03,0.6);addCirc(p[0],p[1],0.55);nw++;}}
  place('ciudad_calles','Las calles de Atenas','ΟΔΟΙ','A diferencia de Roma, las calles de Atenas no se pavimentan: son de tierra apisonada y grava, polvorientas en verano y embarradas en invierno, y muchas son estrechas y torcidas, porque la ciudad creció sin plan. A un lado corren desagües de piedra que llevan el agua de lluvia hacia el gran canal del Ágora. Un viajero de la época escribió que Atenas era seca, mal regada y mal trazada por su antigüedad, aunque sus edificios públicos eran los más bellos de Grecia. A las puertas de las casas hay hermas y pozos.',...AL(-58,104),0);
  place('mercado','El mercado del Ágora','ΑΓΟΡΑ','El Ágora es también el gran mercado de Atenas. Cada mercancía tiene su rincón: los «círculos» (kykloi) del pescado, la carne y las verduras, los puestos de perfumes, de libros, de cerámica, de esclavos. Los inspectores del mercado (agoranomoi) vigilan la calidad, y los metronomoi, los pesos y medidas. «A la hora del ágora llena», a media mañana, aquí se encuentra toda la ciudad.',...AL(30,10),0);
  place('hermas','Hermas','ΕΡΜΑΙ','Pilares de piedra con la cabeza de Hermes y un falo, que protegen las puertas de las casas, los cruces y los caminos. En los cruces hay también hecateos, pilares con tres imágenes de Hécate, diosa de las encrucijadas. En el 415, la noche antes de que zarpara la expedición a Sicilia, alguien mutiló casi todas las hermas de Atenas: el escándalo acabó con el destierro de Alcibíades. Las hermas más famosas están en el ángulo noroeste del Ágora, entre la Stoa Real y la Stoa Poikile.',...AL(-83,-135),0);
  flushStatues();flushPieces();
}

