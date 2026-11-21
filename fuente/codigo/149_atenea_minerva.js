// ============================================================ ATENEA EN EL PARTENÓN Y MINERVA EN EL CAPITOLIO: la diosa enseña
// Junto a la estatua de culto, la diosa se ofrece a enseñarte: Historia, Mitología y Sociedad, cinco subtemas cada uno.
// Cada subtema se vive como una esfera de sueño: un escenario, figuras y la explicación por fases.
// Desbloqueo: dos subtemas la primera vez; dos más por cada nivel de Sophía (Sapientia en Roma); uno más por cada cinco lecciones aprendidas.
// «Futuro» (lo que aún no ha pasado) se abre cuando has visto al menos tres de los otros temas de historia.
// ---------------------------------------------------------------- escenarios: piezas con grupos de figuras que cada fase muestra u oculta
const AM_CAM={wide:[0,12,32,0,2,0],mid:[0,4.5,15,0,1.8,0],close:[4,2.6,8,0,1.5,0],top:[0,30,26,0,0,-4],left:[-13,5,11,-5,1.8,0],right:[13,5,11,5,1.8,0],sea:[-8,7,30,0,1,55]};
function amGrp(S,name){const g=new THREE.Group();S.g.add(g);S.a[name]=g;g.userData.amg=1;g.visible=false;return g;}
function amP(g,look,x,z,r,sc){const p=makePerson(Object.assign({noVary:true},look));p.position.set(x,0,z);p.rotation.y=r||0;if(sc)p.scale.setScalar(sc);g.add(p);return p;}
function amB(g,w,h,d,col,x,y,z){return box(w,h,d,typeof col==='string'?lam(col):col,x,y,z,g);}
function amCrowd(g,n,cx,cz,r,looks,face){const out=[];for(let i=0;i<n;i++){const a=i/n*TAU+Math.random()*0.4,d=r*(0.4+Math.random()*0.6),x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d;out.push(amP(g,pick(looks),x,z,face!==undefined?face:Math.atan2(-x+cx,-z+cz)));}return out;}
function amShip(g,x,z,r,col){const s=new THREE.Group();s.position.set(x,0.1,z);s.rotation.y=r||0;g.add(s);amB(s,1.8,0.7,7,col||'#5a3a22',0,0.35,0);amB(s,0.12,4,0.12,'#3a2a1a',0,2.4,0);amB(s,3,2.2,0.06,'#efe6d2',0,2.8,0.1);return s;}
function amCol(g,x,z,h,col,r){const c=new THREE.Mesh(new THREE.CylinderGeometry(r||0.45,(r||0.45)*0.85,h,10),lam(col||'#efe6d8'));c.position.set(x,h/2,z);g.add(c);return c;}
function amTemple(g,x,z,w,l,col,roof){const t=new THREE.Group();t.position.set(x,0,z);g.add(t);amB(t,w+1,1,l+1,'#d8ccb4',0,0.5,0);const n=Math.max(4,Math.round(w/2.2));for(let i=0;i<n;i++)for(const s of[-1,1])amCol(t,-w/2+0.5+i*(w-1)/(n-1),s*(l/2-0.5),6,col);
  for(let i=1;i<Math.round(l/2.2)-1;i++)for(const s of[-1,1])amCol(t,s*(w/2-0.5),-l/2+0.5+i*(l-1)/(Math.round(l/2.2)-1),6,col);amB(t,w+0.6,0.8,l+0.6,col||'#efe6d8',0,6.4,0);const r=new THREE.Mesh(GABLE,[lam(roof||'#b4583b'),lam(col||'#efe6d8')]);r.scale.set(w+0.8,2,l+0.8);r.position.y=6.8;t.add(r);return t;}
function amFire(g,x,z,n){for(let i=0;i<(n||6);i++){const f=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));f.scale.set(4,6,1);f.position.set(x+rr(-6,6),3+rr(0,3),z+rr(-6,6));g.add(f);}}
function amHut(g,x,z,r){const h=new THREE.Group();h.position.set(x,0,z);g.add(h);const w=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.6,2.2,12),lam('#8a7458'));w.position.y=1.1;h.add(w);const c=new THREE.Mesh(new THREE.ConeGeometry(3,2.6,12),lam('#a89060'));c.position.y=3.5;h.add(c);h.rotation.y=r||0;return h;}
const AM_L={king:{chiton:'#a8392b',himation:'#d9a93a',hair:'#3a2a1e',beard:true,attrs:['G_diadem']},queen:{female:true,chiton:'#efe6d4',himation:'#7a3a8a',hair:'#2a1e14',attrs:['G_diadem']},
 man:{chiton:'#d8ccb4',himation:'#6a4a30',hair:'#3a2a1e',beard:true},woman:{female:true,chiton:'#e6dccb',himation:'#3f5a7a',hair:'#2a1e14'},poor:{chiton:'#9a8a6a',short:true,noHimation:true,hair:'#3a2a1e'},
 hoplite:{chiton:'#a8392b',short:true,noHimation:true,hair:'#3a2a1e',spear:true,helmet:'corinth'},soldier:{chiton:'#9a3a2a',short:true,noHimation:true,hair:'#2a1e14',spear:true},minoan:{female:true,chiton:'#e8c040',himation:'#3a6aa8',hair:'#1a1410'},
 minoanM:{chiton:'#c0703a',short:true,noHimation:true,hair:'#1a1410'},scribe:{chiton:'#efe6d4',himation:'#efe6d4',hair:'#7a6a5a',beard:true},roman:{chiton:'#efe6d4',himation:'#efe6d4',toga:true,hair:'#3a2a1e'},
 senator:{chiton:'#efe6d4',himation:'#efe6d4',toga:true,hair:'#9a9590',praetexta:true,clavus:'lati'},macedon:{chiton:'#7a2a2a',short:true,noHimation:true,hair:'#5a3a22',spear:true,helmet:'attic'},
 goddess:{female:true,chiton:'#efe6d4',himation:'#c9a24a',hair:'#5a3a22',helmet:'attic',attrs:['G_aegis','P_spear','P_spearhead','P_shield'],glow:'#ffe8b0'},god:{chiton:'#efe6d4',himation:'#3a5a9a',hair:'#d8d0c2',beard:true,beardC:'#e8e0d0',attrs:['G_scepter'],glow:'#fff0c0'},
 pos:{chiton:'#3a7a8a',himation:'#2a5a6a',hair:'#4a6a6a',beard:true,beardC:'#4a6a6a',glow:'#a8e8f0'},child:{chiton:'#efe6d4',hair:'#5a3a22',scale:0.62},slave:{chiton:'#8a7a5a',short:true,noHimation:true,hair:'#2a1e14'}};
// cada escenario: ground, piezas fijas y grupos (nombre → construir). Las fases dicen qué grupos se ven.
const AM_SET={
 palacio(S){S.ground('#b9a77a');S.hill(0,-70,60,10,'#a8955e');const P=new THREE.Group();S.g.add(P);for(let i=0;i<4;i++){const x=-12+i*8;amB(P,7,5,6,'#efe2c4',x,2.5,-10);amB(P,7.4,0.5,6.4,'#8a3a2a',x,5.2,-10);}
   for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.38,4,10),lam('#a8392b'));c.position.set(-14+i*5.6,2,-6.4);P.add(c);}
   amB(P,30,0.2,0.1,'#3a6aa8',0,3.6,-6.9);amB(P,8,0.6,6,'#d8ccb4',0,0.3,2);
   const g1=amGrp(S,'gente');amCrowd(g1,8,0,2,8,[AM_L.minoan,AM_L.minoanM]);const g2=amGrp(S,'toro');const t=S.beast('toro',0,6,Math.PI/2);g2.add(t);const lp=amP(g2,AM_L.minoanM,0,6,Math.PI/2);lp.position.y=2.6;lp.rotation.z=1.4;S.a.leaper=lp;
   const g3=amGrp(S,'barcos');S.water(0,60,300,60);for(let i=0;i<4;i++)amShip(g3,-30+i*18,50+rr(-6,6),Math.PI/2);
   const g4=amGrp(S,'escriba');amP(g4,AM_L.scribe,6,4,Math.PI);for(let i=0;i<4;i++)amB(g4,0.5,0.05,0.35,'#b5704a',5+i*0.6,0.9,3.2);amB(g4,3,0.85,1.2,'#6b4a2e',6,0.42,3.2);
   const g5=amGrp(S,'diosa');amP(g5,{female:true,chiton:'#e8c040',himation:'#3a6aa8',hair:'#1a1410',scale:1.4},0,-2,0);
   const g6=amGrp(S,'volcan');const v=new THREE.Mesh(new THREE.ConeGeometry(40,30,24),lam('#5a4a40'));v.position.set(-90,15,-140);g6.add(v);for(let i=0;i<6;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:HALO_TEX,color:'#5a5048',transparent:true,opacity:0.6,depthWrite:false}));s.scale.set(40+i*10,40+i*10,1);s.position.set(-90+i*6,40+i*14,-140);g6.add(s);}
   const g7=amGrp(S,'fuego');amFire(g7,0,-10,8);const g8=amGrp(S,'micenicos');amCrowd(g8,6,0,8,6,[AM_L.hoplite]);},
 ciudadela(S){S.ground('#a8956a');S.hill(0,-60,50,9,'#9a8a5e');const P=new THREE.Group();S.g.add(P);for(let i=-6;i<=6;i++){if(Math.abs(i)<1)continue;amB(P,4,6+Math.random(),3,'#9a907e',i*4,3,2);}
   amB(P,1.2,4,1.2,'#8a8070',-1.6,2,2);amB(P,1.2,4,1.2,'#8a8070',1.6,2,2);amB(P,4.4,1,1.4,'#8a8070',0,4.5,2);const tri=new THREE.Mesh(new THREE.ConeGeometry(1.6,2,3),lam('#7a7062'));tri.position.set(0,6,2);P.add(tri);   // la Puerta de los Leones
   amB(P,10,5,12,'#cdbf9f',0,2.5,-10);amB(P,10.6,0.6,12.6,'#8a3a2a',0,5.2,-10);
   const g1=amGrp(S,'rey');amP(g1,AM_L.king,0,-4,0,1.1);amCrowd(g1,4,0,-1,4,[AM_L.man,AM_L.woman]);
   const g2=amGrp(S,'guerreros');for(let i=0;i<8;i++)amP(g2,AM_L.hoplite,-7+i*2,8,Math.PI);const g3=amGrp(S,'escriba');amP(g3,AM_L.scribe,5,-2,Math.PI/2);for(let i=0;i<5;i++)amB(g3,0.5,0.05,0.35,'#b5704a',6,0.9+i*0.06,-3+i*0.5);
   const g4=amGrp(S,'tholos');const d=new THREE.Mesh(new THREE.SphereGeometry(6,20,10,0,TAU,0,Math.PI/2),lam('#8a7a5a'));d.position.set(-24,0,10);g4.add(d);amB(g4,2,4,6,'#6a5a48',-24,2,16);amP(g4,{chiton:'#d9a93a',himation:'#d9a93a',hair:'#d9a93a',beard:true,scale:0.9},-21,14,0);
   const g5=amGrp(S,'troya');S.water(0,70,300,50);for(let i=0;i<6;i++)amShip(g5,-30+i*12,60,Math.PI/2,'#3a2a1a');const g6=amGrp(S,'fuego');amFire(g6,0,-6,10);},
 aldea(S){S.ground('#8a8a5a');S.hill(-30,-70,50,14,'#7b8a4e');const g0=amGrp(S,'chozas');for(let i=0;i<7;i++)amHut(g0,-18+i*6+rr(-1,1),-6+rr(-3,3));g0.visible=true;
   const g1=amGrp(S,'gente');amCrowd(g1,6,0,4,7,[AM_L.poor,AM_L.woman]);const g2=amGrp(S,'herrero');amP(g2,AM_L.poor,6,6,-Math.PI/2);amB(g2,1,0.8,1,'#3a3430',4.8,0.4,6);amFire(g2,4.8,6,1);
   const g3=amGrp(S,'aedo');amP(g3,{chiton:'#efe6d4',himation:'#6a4a30',hair:'#d8d0c2',beard:true,beardC:'#d8d0c2',attrs:['G_lyre']},0,0,0);amCrowd(g3,7,0,3,4,[AM_L.poor,AM_L.woman,AM_L.child]);
   const g4=amGrp(S,'barcos');S.water(0,60,300,50);for(let i=0;i<3;i++)amShip(g4,-14+i*14,46,0.2);const g5=amGrp(S,'heroon');amB(g5,10,3,40,'#a89060',20,1.5,-14);amFire(g5,20,-14,2);
   const g6=amGrp(S,'letras');for(let i=0;i<5;i++){const c=document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');x.fillStyle='#f3e5c8';x.font='bold 48px Georgia';x.textAlign='center';x.fillText('ΑΒΓΔΕ'[i],32,50);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true}));sp.scale.set(2.2,2.2,1);sp.position.set(-5+i*2.5,4,2);g6.add(sp);}},
 polis(S){S.ground('#b9a77a');S.hill(0,-36,46,14,'#a8955e');const P=new THREE.Group();S.g.add(P);amTemple(P,0,-34,12,24,'#e8dfcc');P.position.y=0;P.children[0].position.y=12;
   const g1=amGrp(S,'agora');amCrowd(g1,10,0,6,10,[AM_L.man,AM_L.man,AM_L.woman]);const g2=amGrp(S,'barcos');S.water(-10,60,300,50);for(let i=0;i<4;i++)amShip(g2,-30+i*14,50,0.3);
   const g3=amGrp(S,'falange');for(let r=0;r<3;r++)for(let i=0;i<8;i++)amP(g3,AM_L.hoplite,-7+i*2,8+r*1.6,Math.PI);
   const g4=amGrp(S,'atleta');amP(g4,{chiton:'#e0b896',short:true,noHimation:true,hair:'#3a2a1e'},-8,4,Math.PI/2);amB(g4,30,0.1,2,'#d8c08a',0,0.05,4);
   const g5=amGrp(S,'legislador');amP(g5,AM_L.scribe,0,2,0,1.1);amB(g5,1.6,2.4,0.4,'#efe6d8',2.4,1.2,1);amCrowd(g5,6,0,6,5,[AM_L.man,AM_L.poor]);
   const g6=amGrp(S,'persas');for(let i=0;i<6;i++)amShip(g6,-20+i*8,56,Math.PI/2,'#2a2a2a');for(let i=0;i<6;i++)amShip(g6,-16+i*8,42,-Math.PI/2,'#6a4a2a');},
 helenistico(S){S.ground('#c9b48b');S.water(0,70,400,60);const P=new THREE.Group();S.g.add(P);
   const g1=amGrp(S,'falange');for(let r=0;r<4;r++)for(let i=0;i<9;i++){const p=amP(g1,AM_L.macedon,-8+i*2,4+r*1.6,Math.PI);}
   const g2=amGrp(S,'alejandro');const hz=S.beast('caballo',0,-4,Math.PI);g2.add(hz);const ax=amP(g2,{chiton:'#d9a93a',himation:'#a8392b',hair:'#c9a46a',helmet:'attic'},0,-4,Math.PI);ax.position.y=1.4;
   const g3=amGrp(S,'faro');amB(g3,8,14,8,'#efe6d8',-30,7,40);amB(g3,5,10,5,'#efe6d8',-30,19,40);const lc=new THREE.Mesh(new THREE.CylinderGeometry(1.8,1.8,6,12),lam('#efe6d8'));lc.position.set(-30,27,40);g3.add(lc);amFire(g3,-30,40,1);amTemple(g3,10,-12,14,10,'#efe6d8','#c9a24a');
   const g4=amGrp(S,'reinos');amP(g4,AM_L.king,-8,0,0.4);amP(g4,{chiton:'#efe6d4',himation:'#3a5a9a',hair:'#3a2a1e',beard:true,attrs:['G_diadem']},0,-1,0);amP(g4,{chiton:'#efe6d4',himation:'#2a7a4a',hair:'#3a2a1e',attrs:['G_diadem']},8,0,-0.4);
   const g5=amGrp(S,'romanos');for(let r=0;r<3;r++)for(let i=0;i<7;i++)amP(g5,{chiton:'#a8392b',short:true,noHimation:true,hair:'#2a1e14',spear:true,helmet:'attic'},-6+i*2,-2-r*1.6,0);
   const g6=amGrp(S,'fuego');amFire(g6,0,-10,10);const g7=amGrp(S,'escuela');amTemple(g7,0,-10,10,8,'#efe6d8');amCrowd(g7,6,0,0,5,[{chiton:'#efe6d4',himation:'#efe6d4',toga:true,hair:'#3a2a1e'},AM_L.man]);},
 olimpo(S){S.ground('#e8e4dc');for(let i=0;i<14;i++){const c=new THREE.Sprite(new THREE.SpriteMaterial({map:HALO_TEX,color:'#ffffff',transparent:true,opacity:0.7,depthWrite:false}));c.scale.set(30,14,1);c.position.set(rr(-60,60),rr(-2,4),rr(-60,20));S.g.add(c);}
   const g1=amGrp(S,'zeus');amP(g1,AM_L.god,0,-4,0,1.5);const g2=amGrp(S,'hefesto');amP(g2,{chiton:'#6a4a30',short:true,noHimation:true,hair:'#2a1e14',beard:true},4,-2,-0.8);
   const g3=amGrp(S,'atenea');const a=amP(g3,AM_L.goddess,0,-1,0,1.3);S.a.ath=a;const g4=amGrp(S,'dioses');amCrowd(g4,7,0,-4,9,[{female:true,chiton:'#efe6d4',himation:'#c94a6a',hair:'#c9a46a',glow:'#ffe8f0'},{chiton:'#efe6d4',himation:'#c9a24a',hair:'#d9a93a',glow:'#fff0c0'}]);
   const g5=amGrp(S,'metis');amP(g5,{female:true,chiton:'#7ab0c0',himation:'#3a6a8a',hair:'#2a1e14',glow:'#c0f0ff'},-5,0,0.6);},
 acropolis(S){S.ground('#b9a77a');S.hill(0,-50,40,10,'#a8955e');const g0=amGrp(S,'roca');g0.visible=true;
   const g1=amGrp(S,'poseidon');amP(g1,AM_L.pos,-6,-8,0.4,1.4);S.water(-10,-6,6,6);const g2=amGrp(S,'olivo');S.a.oliveG=g2;const t=new THREE.Group();t.position.set(6,0,-8);g2.add(t);const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.4,3,6),lam('#6a5a40'));tr.position.y=1.5;t.add(tr);const cr=new THREE.Mesh(new THREE.SphereGeometry(2.2,10,8),lam('#7a8a5a'));cr.position.y=3.8;t.add(cr);
   const g3=amGrp(S,'atenea');amP(g3,AM_L.goddess,2,-6,-0.3,1.4);const g4=amGrp(S,'cecrope');amP(g4,{chiton:'#d8ccb4',himation:'#5a6a3a',hair:'#d8d0c2',beard:true},0,0,Math.PI);amCrowd(g4,10,0,6,6,[AM_L.man,AM_L.woman]);
   const g5=amGrp(S,'cesta');amB(g5,1,0.8,1,'#a8864f',0,0.4,2);amCrowd(g5,3,0,2,2.2,[{female:true,chiton:'#efe6d4',himation:'#c94a6a',hair:'#3a2a1e'}]);const sn=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.12,6,16),lam('#4a6a3a'));sn.position.set(0,1.1,2);sn.rotation.x=Math.PI/2;g5.add(sn);
   const g6=amGrp(S,'hefesto');amP(g6,{chiton:'#6a4a30',short:true,noHimation:true,hair:'#2a1e14',beard:true},-4,0,0.5);amP(g6,AM_L.goddess,4,0,-0.5,1.3);const bb=amP(g6,{chiton:'#f3e5c8',hair:'#c9a46a',scale:0.4},0,0,0);bb.position.y=0.2;},
 telar(S){S.ground('#a89070');const P=new THREE.Group();S.g.add(P);for(const x of[-4,4]){amB(P,0.25,3.5,0.25,'#6b4a2e',x-1.6,1.75,-2);amB(P,0.25,3.5,0.25,'#6b4a2e',x+1.6,1.75,-2);amB(P,3.6,0.2,0.2,'#6b4a2e',x,3.4,-2);}
   const g1=amGrp(S,'aracne');amP(g1,{female:true,chiton:'#e6dccb',himation:'#8a3a5a',hair:'#3a2a1e'},4,0,Math.PI);const tp=document.createElement('canvas');tp.width=128;tp.height=128;const x=tp.getContext('2d');for(let i=0;i<40;i++){x.fillStyle=pick(['#a8392b','#3a6aa8','#d9a93a','#3a8a5a']);x.fillRect(rr(0,120),rr(0,120),rr(4,20),rr(4,20));}
   const tap=new THREE.Mesh(new THREE.PlaneGeometry(3,2.8),new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(tp),side:THREE.DoubleSide}));tap.position.set(4,1.9,-1.95);g1.add(tap);
   const g2=amGrp(S,'vieja');amP(g2,{female:true,chiton:'#7a6a5a',himation:'#5a4a3a',hair:'#d8d0c2',staff:true},0,3,Math.PI);const g3=amGrp(S,'atenea');amP(g3,AM_L.goddess,-4,0,Math.PI,1.2);const tp2=new THREE.Mesh(new THREE.PlaneGeometry(3,2.8),lam('#d9a93a'));tp2.position.set(-4,1.9,-1.95);g3.add(tp2);
   const g4=amGrp(S,'arana');const sp=new THREE.Mesh(new THREE.SphereGeometry(0.35,10,8),lam('#1a1410'));sp.position.set(4,3,-1.8);g4.add(sp);for(let i=0;i<8;i++){const l=amB(g4,0.04,0.04,0.8,'#1a1410',4,3,-1.8);l.rotation.y=i/8*TAU;}
   const g5=amGrp(S,'flauta');S.water(0,5,8,6);amP(g5,AM_L.goddess,0,2,Math.PI,1.2);const g6=amGrp(S,'marsias');amP(g6,{chiton:'#6a5a3a',short:true,noHimation:true,hair:'#3a2a1e',beard:true},-3,0,0.5);amP(g6,{chiton:'#efe6d4',himation:'#d9a93a',hair:'#d9a93a',attrs:['G_lyre'],glow:'#fff0c0'},3,0,-0.5);},
 mar(S){S.ground('#c9b48b');S.water(0,30,300,60);const g1=amGrp(S,'perseo');amP(g1,{chiton:'#a8392b',short:true,noHimation:true,hair:'#5a3a22',attrs:['G_petasos']},0,0,Math.PI);const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.8,0.8,0.08,20),lam('#e8e8f0'));sh.rotation.x=Math.PI/2;sh.position.set(0.6,1.3,-0.4);g1.add(sh);
   const g2=amGrp(S,'atenea');amP(g2,AM_L.goddess,-3,-2,0.5,1.3);const g3=amGrp(S,'gorgonas');for(let i=0;i<3;i++){const p=amP(g3,{female:true,chiton:'#3a5a3a',himation:'#2a4a2a',hair:'#3a6a3a'},6+i*2,-6,Math.PI*0.8);}
   const g4=amGrp(S,'egida');amP(g4,AM_L.goddess,0,-2,0,1.5);const hd=new THREE.Mesh(new THREE.SphereGeometry(0.35,10,8),lam('#3a6a3a'));hd.position.set(0,2.2,-1.6);g4.add(hd);
   const g5=amGrp(S,'paladio');amB(g5,1,1.2,1,'#efe6d8',0,0.6,0);amP(g5,{female:true,chiton:'#8a6a3a',himation:'#6a4a2a',hair:'#6a4a2a',helmet:'attic',spear:true,scale:0.6},0,0,Math.PI).position.y=1.2;amTemple(g5,0,-10,8,6,'#efe6d8');
   const g6=amGrp(S,'troya');amFire(g6,0,-20,10);for(let i=0;i<4;i++)amShip(g6,-12+i*8,30,0.3,'#3a2a1a');amP(g6,{chiton:'#a8392b',himation:'#7a5a3a',hair:'#3a2a1e',beard:true},2,6,Math.PI);
   const g7=amGrp(S,'vestales');amTemple(g7,0,-10,8,8,'#efe6d8');amCrowd(g7,4,0,-2,3,[{female:true,chiton:'#f4f0e8',himation:'#f4f0e8',veil:true,hair:'#4a3020'}]);amFire(g7,0,-10,1);},
 // Roma
 roma(S){S.ground('#8a8a5a');S.hill(-40,-70,34,14,'#7b8a4e');S.hill(40,-70,30,12,'#7b8a4e');S.water(-60,0,20,300);
   const g1=amGrp(S,'chozas');for(let i=0;i<6;i++)amHut(g1,-34+i*4,-36+rr(-3,3));const g2=amGrp(S,'reyes');amP(g2,AM_L.king,0,0,0,1.1);amCrowd(g2,8,0,4,6,[AM_L.man,AM_L.woman,AM_L.poor]);
   const g3=amGrp(S,'templo');amTemple(g3,0,-14,12,16,'#d8ccb4','#a8392b');const g4=amGrp(S,'senado');amB(g4,12,8,10,'#d8ccb0',14,4,-6);amCrowd(g4,10,6,2,5,[AM_L.senator,AM_L.roman]);
   const g5=amGrp(S,'plebe');amCrowd(g5,12,-6,6,6,[AM_L.poor,AM_L.woman,AM_L.slave]);const g6=amGrp(S,'legion');for(let r=0;r<3;r++)for(let i=0;i<8;i++)amP(g6,AM_L.soldier,-7+i*2,10+r*1.6,Math.PI);
   const g7=amGrp(S,'galos');for(let i=0;i<8;i++)amP(g7,{chiton:'#5a7a3a',short:true,noHimation:true,hair:'#c9a46a',beard:true,spear:true},-10+i*2.6,18,Math.PI);
   const g8=amGrp(S,'barcos');S.water(0,70,300,60);for(let i=0;i<5;i++)amShip(g8,-30+i*14,60,Math.PI/2,'#5a3a22');const g9=amGrp(S,'fuego');amFire(g9,0,-14,10);
   const g10=amGrp(S,'cesar');amP(g10,{chiton:'#efe6d4',himation:'#a02a2a',hair:'#3a2a1e'},0,2,Math.PI);const g11=amGrp(S,'emperador');amP(g11,{chiton:'#efe6d4',himation:'#6a1f3a',toga:true,hair:'#3a2a1e',attrs:['G_wreath']},0,0,0,1.2);amCrowd(g11,8,0,5,6,[AM_L.senator,AM_L.soldier]);
   const g12=amGrp(S,'cruz');amB(g12,0.4,4,0.4,'#d9a93a',0,6,-14);amB(g12,2,0.4,0.4,'#d9a93a',0,7,-14);},
 casa(S){S.ground('#c9b48b');const P=new THREE.Group();S.g.add(P);amB(P,20,0.2,14,'#d8ccb0',0,0.1,0);amB(P,20,4,0.4,'#e3d8c2',0,2,-7);amB(P,0.4,4,14,'#e3d8c2',-10,2,0);S.water(0,0,3,3);
   const g1=amGrp(S,'familia');amP(g1,AM_L.man,-2,0,0.3);amP(g1,AM_L.woman,2,0,-0.3);amP(g1,AM_L.child,0,2,Math.PI);amP(g1,{chiton:'#d8d0c2',himation:'#7a7068',hair:'#d8d0c2',beard:true,staff:true},-5,-2,0.6);
   const g2=amGrp(S,'esclavos');amP(g2,AM_L.slave,6,-3,-0.5);amP(g2,{female:true,chiton:'#8a7a5a',hair:'#2a1e14'},6,1,-0.8);
   const g3=amGrp(S,'telar');amB(g3,0.2,3,0.2,'#6b4a2e',-8,1.5,-5);amB(g3,0.2,3,0.2,'#6b4a2e',-5,1.5,-5);amB(g3,3,0.2,0.2,'#6b4a2e',-6.5,3,-5);amP(g3,AM_L.woman,-6.5,-3.5,Math.PI);
   const g4=amGrp(S,'clientes');amCrowd(g4,10,4,4,4,[AM_L.roman,AM_L.poor,AM_L.man]);amP(g4,AM_L.senator,-4,-2,Math.PI/2,1.1);
   const g5=amGrp(S,'escuela');amP(g5,AM_L.scribe,0,-4,0);for(let i=0;i<6;i++)amP(g5,AM_L.child,-4+i*1.6,0,Math.PI);
   const g6=amGrp(S,'mercado');for(let i=0;i<4;i++)amB(g6,2.4,1,1.2,'#8a6a44',-6+i*4,0.5,4);amCrowd(g6,10,0,6,6,[AM_L.poor,AM_L.woman,AM_L.slave,AM_L.man]);},
 asamblea(S){S.ground('#a8956a');S.hill(0,-45,30,6,'#9a8a5e');const P=new THREE.Group();S.g.add(P);amB(P,3,2,2,'#cdbf9f',0,1,-4);
   const g1=amGrp(S,'asamblea');for(let r=0;r<5;r++)for(let i=0;i<12;i++)amP(g1,pick([AM_L.man,AM_L.poor,AM_L.man]),-11+i*2,4+r*2,Math.PI);
   const g2=amGrp(S,'orador');amP(g2,AM_L.man,0,-4,0,1.05);const g3=amGrp(S,'consejo');amB(g3,14,6,10,'#d8ccb0',-16,3,-10);amCrowd(g3,8,-16,-2,4,[AM_L.man]);
   const g4=amGrp(S,'tribunal');for(let i=0;i<14;i++)amP(g4,AM_L.man,-6+(i%7)*2,6+Math.floor(i/7)*2,Math.PI);amB(g4,0.6,1.2,0.6,'#6b4a2e',4,0.6,0);amB(g4,0.6,1.2,0.6,'#6b4a2e',-4,0.6,0);
   const g5=amGrp(S,'excluidos');amP(g5,AM_L.woman,16,4,-1.2);amP(g5,AM_L.slave,17,6,-1.2);amP(g5,{chiton:'#b8a888',himation:'#5a6a7a',hair:'#3a2a1e',beard:true},18,2,-1.2);
   const g6=amGrp(S,'ostraca');for(let i=0;i<20;i++){const o=amB(g6,0.3,0.05,0.2,'#b5704a',rr(-4,4),0.03,rr(0,4));o.rotation.y=rr(0,3);}}};
// ---------------------------------------------------------------- un subtema = un sueño: escenario + fases [cámara, grupos visibles, texto, animación]
function amEpisode(T,goddess){const ro=MODE==='roma';
  return{id:'am_'+T.id,mode:MODE,name:T.t,h:T.h||12,hist:T.hist,vt:goddess+' te toca la frente…',vf:T.vf||(T.hist?'Una lección de historia, con escenas imaginadas a partir de lo que sabemos.':'Un mito, tal como lo contaban los antiguos.'),exitLabel:'Salir · Esc',endLabel:'Volver con '+goddess+' · E',
   build(S){(AM_SET[T.set]||AM_SET.polis)(S);S.a.all=Object.keys(S.a).filter(k=>S.a[k]&&S.a[k].userData&&S.a[k].userData.amg);},
   beats:T.ph.map((p,i)=>({h:p.h!==undefined?p.h:T.h||12,cut:true,cam:AM_CAM[p.c||'mid'],cam2:AM_CAM[p.c2||p.c||'mid'].map((v,j)=>v*(j<3?0.92:1)),d:14,
     txt:'<b>'+(i+1)+'. '+p.n+'</b><br>'+p.t+(i===T.ph.length-1&&T.src?'<p class="sub">Fuentes: '+T.src+'</p>':''),
     enter(S){for(const k of S.a.all||[])S.a[k].visible=(p.s||[]).includes(k)||k==='chozas'&&T.set==='aldea'||k==='roca';if(p.fx==='flash')epiFlash();},
     upd(t,dt,S){for(const k of p.s||[]){const g=S.a[k];if(!g)continue;g.traverse(o=>{if(o.userData&&o.userData.legs&&o.parent===g&&(p.walk||[]).includes(k)){o.position.z-=dt*1.4;personWalk(o,t*6,1);}});}
       if((p.s||[]).includes('barcos')||(p.s||[]).includes('troya')||(p.s||[]).includes('persas'))for(const k of['barcos','troya','persas']){const g=S.a[k];if(g&&g.visible)g.children.forEach((c,j)=>{if(c.isGroup&&!c.userData.legs){c.position.x+=dt*(j%2?1.2:-0.8);c.rotation.z=Math.sin(t+j)*0.04;}});}
       if(S.a.leaper&&(p.s||[]).includes('toro')){const k=(t*0.5)%1;S.a.leaper.position.y=2.4+Math.sin(k*Math.PI)*1.4;S.a.leaper.rotation.z=1.4+k*Math.PI*2;}}})),
   reward(){amSeen(T.id);}};}
// ---------------------------------------------------------------- el temario. a: h historia · m mitología · s sociedad. need: subtema previo (orden cronológico) o puntos de avance.
const AM_TOPICS={
atenas:[
 {id:'minoicos',a:'h',t:'Los minoicos',set:'palacio',hist:true,h:11,ph:[
  {n:'Creta, la isla de los palacios',c:'wide',s:['gente'],t:'Hace mucho, en la Edad del Bronce (hacia 3000-1450 a.C.), Creta fue la casa de un pueblo que vosotros no recordáis por su nombre. Hacia 1900 a.C. levantaron grandes palacios en Cnosos, Festo y Malia: patios, almacenes, columnas rojas que se estrechan hacia abajo, frescos de colores. Los llamamos «minoicos» por Minos, el rey de vuestras leyendas; no sabemos cómo se llamaban ellos.'},
  {n:'Dueños del mar',c:'sea',s:['barcos'],t:'Vivían del mar. Sus barcos llevaban aceite, vino y tejidos a Egipto, Chipre y las Cícladas. En las tumbas egipcias aparecen pintados unos extranjeros con regalos, los <i>keftiu</i>, que casi todos identifican con los cretenses. Tucídides cuenta que Minos fue el primero en tener una flota y limpiar el mar de piratas: es una tradición, no un dato comprobado.'},
  {n:'Una escritura que nadie lee',c:'close',s:['escriba'],t:'Los escribas apuntaban en tablillas de arcilla lo que entraba y salía de los almacenes: grano, aceite, ovejas. Usaban una escritura que llamamos <b>lineal A</b>. Aún hoy nadie ha conseguido leerla: sabemos que son cuentas, pero no qué lengua hablaban.'},
  {n:'Toros y diosas',c:'mid',s:['toro','diosa'],t:'En los frescos de Cnosos, jóvenes saltan por encima de un toro agarrándole los cuernos. Las figurillas muestran mujeres con serpientes en las manos, quizá diosas o sacerdotisas. Muchos estudiosos creen que una gran diosa tenía un papel central, pero su religión sigue siendo en buena parte un misterio.'},
  {n:'El final',c:'wide',c2:'top',s:['volcan','fuego','micenicos'],t:'Hacia 1600 a.C. el volcán de Tera (Santorini) estalló y enterró la ciudad de Akrotiri; Creta sufrió, pero siguió en pie. Hacia 1450 a.C. muchos palacios ardieron. Poco después, en Cnosos, los escribas ya escribían en <b>lineal B</b>, que sí es griego: los micénicos del continente se habían hecho con la isla.'}],
  src:'Tucídides I 4; frescos y tablillas de Cnosos (excavaciones de A. Evans desde 1900); J. L. Fitton, <i>Los minoicos</i>.'},
 {id:'micenicos',a:'h',t:'Los micénicos',set:'ciudadela',hist:true,need:'minoicos',h:15,ph:[
  {n:'Ciudadelas de piedra',c:'wide',s:['rey'],t:'Entre 1600 y 1200 a.C., en el continente, unos griegos levantaron ciudadelas: Micenas, Tirinto, Pilos, Tebas… y aquí mismo, en esta Acrópolis. Sus murallas son tan grandes que vosotros decís que las construyeron los Cíclopes. A la entrada de Micenas, dos leones de piedra guardan la puerta desde hace casi novecientos años.'},
  {n:'El wanax y sus escribas',c:'right',s:['rey','escriba'],t:'Mandaba un rey, el <i>wanax</i> (vuestro <i>ánax</i>), desde un palacio que recogía y repartía bienes. Sus escribas usaban el lineal B, que es una forma muy antigua de vuestra lengua. En sus tablillas ya aparecen nombres de dioses: Zeus, Hera, Poseidón… y una «señora de Atana».'},
  {n:'Tumbas de oro',c:'left',s:['tholos'],t:'Enterraban a los grandes en tumbas de cúpula, los <i>tholoi</i>, o en tumbas de pozo llenas de oro: máscaras, copas, espadas con incrustaciones. Siglos después alguien dirá que una de esas máscaras es la «de Agamenón»; en realidad es más antigua que cualquier guerra de Troya.'},
  {n:'Guerreros y la memoria de Troya',c:'sea',s:['guerreros','troya'],t:'Eran guerreros: carros, cascos de colmillos de jabalí, escudos enormes. Hacia 1200 a.C. una ciudad de Asia, Troya, fue destruida. Los cantores convirtieron aquellos tiempos en la Ilíada; el «Catálogo de las naves» conserva nombres de ciudades micénicas reales. Pero Homero no es un cronista: mezcla épocas.'},
  {n:'El derrumbe',c:'top',s:['fuego'],t:'Hacia 1200 a.C. los palacios ardieron uno tras otro. ¿Por qué? Aún se discute: sequías, terremotos, revueltas, los «Pueblos del Mar» que atacaron Egipto… probablemente todo a la vez. Con los palacios desapareció la escritura.'}],
  src:'Homero, <i>Ilíada</i> II (Catálogo de las naves); tablillas de Pilos y Cnosos (lineal B, descifrado por M. Ventris en 1952); J. Chadwick, <i>El mundo micénico</i>.'},
 {id:'oscura',a:'h',t:'La época oscura',set:'aldea',hist:true,need:'micenicos',h:17,ph:[
  {n:'Sin palacios ni letras',c:'wide',s:['gente'],t:'Después del derrumbe (hacia 1100-800 a.C.) Grecia se quedó con menos gente, aldeas pequeñas y casas de barro y paja. Nadie escribía: por eso los historiadores la llaman «época oscura», no porque no pasara nada, sino porque sabemos poco.'},
  {n:'El hierro',c:'close',s:['herrero'],t:'Aprendisteis a trabajar el hierro, que se encuentra en más sitios que el cobre y el estaño del bronce. Hesíodo llamará a su tiempo la «edad de hierro», la peor de todas, llena de trabajo y fatiga.'},
  {n:'No tan oscura',c:'right',s:['heroon'],t:'En Lefkandi, en Eubea, hacia el 950 a.C., enterraron a un hombre y a una mujer con oro y caballos dentro de un edificio de casi cincuenta metros. Había contactos con Chipre y con Oriente. La oscuridad no era total.'},
  {n:'Los aedos',c:'mid',s:['aedo'],t:'Lo que no se escribía se cantaba. Los aedos recitaban de memoria, con fórmulas fijas («Aquiles, el de los pies ligeros»), historias de héroes y dioses. Así llegaron hasta el siglo VIII a.C. los poemas que conocemos como de Homero.'},
  {n:'Vuelven las letras',c:'mid',s:['barcos','letras'],t:'Hacia el 800 a.C., comerciando con los fenicios, tomasteis su alfabeto y le añadisteis vocales. Heródoto lo cuenta: las llamáis «letras fenicias». Con ellas empieza una época nueva.'}],
  src:'Hesíodo, <i>Trabajos y días</i> 174-201; Heródoto V 58; excavaciones de Lefkandi (Toumba); I. Morris, <i>Archaeology as Cultural History</i>.'},
 {id:'arcaica',a:'h',t:'La época arcaica',set:'polis',hist:true,need:'oscura',h:10,ph:[
  {n:'Nace la polis',c:'wide',s:['agora'],t:'Entre el 800 y el 480 a.C. las aldeas se unieron en ciudades-estado, las <i>póleis</i>: una acrópolis con templos, un ágora donde reunirse y un territorio de campos. Cada polis con sus leyes y sus dioses. Es la forma de vivir que tú conoces.'},
  {n:'Colonias por todo el mar',c:'sea',s:['barcos'],t:'Faltaba tierra, y muchas ciudades enviaron colonos: Siracusa (733 a.C., según Tucídides), Massalia (hacia el 600), Bizancio, ciudades del mar Negro y de Italia. Platón dirá que vivís alrededor del mar «como hormigas o ranas alrededor de una charca».'},
  {n:'La falange',c:'mid',s:['falange'],t:'Los ciudadanos que podían pagarse escudo, casco y lanza luchaban hombro con hombro en la falange de hoplitas. Quien defiende la ciudad quiere opinar sobre ella: muchos ven aquí una raíz de la política de los ciudadanos.'},
  {n:'Olimpia',c:'left',s:['atleta'],t:'Según la tradición, los primeros Juegos Olímpicos se celebraron en el 776 a.C. Cada cuatro años, una tregua sagrada permitía a los griegos de todas partes viajar a Olimpia. Contáis los años por olimpiadas.'},
  {n:'Leyes y tiranos en Atenas',c:'close',s:['legislador'],t:'En Atenas, Dracón escribió leyes durísimas (621 a.C.). Solón (594) prohibió esclavizar por deudas y repartió los derechos según la riqueza. Luego gobernó el tirano Pisístrato y sus hijos. En el 508/507, Clístenes reorganizó a los ciudadanos en diez tribus: la democracia que hoy tienes.'},
  {n:'Las guerras contra Persia',c:'sea',s:['persas'],t:'El Imperio persa llegó hasta el Egeo. Atenas venció en Maratón (490 a.C.) y, diez años después, la flota griega derrotó a Jerjes en Salamina (480). Ahí termina la época arcaica y empieza la de tus abuelos.'}],
  src:'Aristóteles, <i>Constitución de los atenienses</i> 2-22; Heródoto VI-VIII; Tucídides VI 3; Platón, <i>Fedón</i> 109b.'},
 {id:'futuro',a:'h',t:'El futuro: helenismo y Roma',set:'helenistico',hist:true,need:3,h:13,ph:[
  {n:'Lo que aún no ha pasado',c:'wide',s:['falange'],t:'Te enseñaré lo que todavía no ha ocurrido. En el norte, Macedonia crecerá. Su rey Filipo II vencerá a Atenas y Tebas en Queronea (338 a.C.). Tú quizá lo veas de viejo. <i>(En el juego estamos en el 386 a.C.: esto es el futuro.)</i>'},
  {n:'Alejandro',c:'mid',s:['alejandro'],t:'Su hijo Alejandro (336-323 a.C.) cruzará a Asia, derrotará al rey persa y llegará hasta la India. Morirá en Babilonia con treinta y dos años. Su maestro será Aristóteles, que aún no ha nacido: nacerá en Estagira dentro de dos años. <i>(En este juego lo verás ya de niño: anacronismo señalado.)</i>'},
  {n:'Los reinos de los sucesores',c:'mid',s:['reinos'],t:'Sus generales, los diádocos, se repartirán el imperio: los Ptolomeos en Egipto, los Seléucidas en Asia, los Antigónidas en Macedonia. Las ciudades griegas, también Atenas, ya no decidirán solas su destino.'},
  {n:'Un mundo que habla griego',c:'left',s:['faro'],t:'El griego común, la <i>koiné</i>, se hablará desde Egipto hasta el Indo. En Alejandría habrá un faro gigantesco y una Biblioteca que intentará reunir todos los libros. A esta época la llamarán <b>helenística</b> (323-31 a.C.).'},
  {n:'Llega Roma',c:'mid',s:['romanos','fuego'],t:'Una ciudad de Italia, Roma, vencerá a Macedonia (Cinoscéfalas, 197; Pidna, 168), arrasará Corinto (146) y su general Sila saqueará Atenas (86 a.C.). En el 31 a.C., tras la batalla de Accio, caerá el último reino, el Egipto de Cleopatra.'},
  {n:'Grecia conquista a su conquistador',c:'close',s:['escuela'],t:'Pero Roma aprenderá de vosotros: sus jóvenes vendrán a estudiar a Atenas, sus casas se llenarán de estatuas griegas. Un poeta romano, Horacio, lo dirá así: «Grecia, conquistada, conquistó a su fiero vencedor».'}],
  src:'Arriano, <i>Anábasis</i>; Polibio; Plutarco, <i>Sila</i> 12-14; Horacio, <i>Epístolas</i> II 1, 156.'},
 {id:'nacimiento',a:'m',t:'Mi nacimiento',set:'olimpo',h:12,ph:[
  {n:'Metis, la astucia',c:'mid',s:['zeus','metis'],t:'Mi madre fue Metis, la más sabia de los dioses. Gea y Urano avisaron a Zeus: Metis le daría un hijo más fuerte que él. Así que Zeus, con palabras dulces, se la tragó.'},
  {n:'El dolor de cabeza',c:'close',s:['zeus','hefesto'],t:'Al poco tiempo, a Zeus le dolía la cabeza como nunca. Hefesto (otros dicen Prometeo) tomó un hacha de doble filo y le abrió la cabeza de un golpe.'},
  {n:'Nazco armada',c:'mid',fx:'flash',s:['zeus','hefesto','atenea'],t:'Y salí yo, ya adulta, con casco, lanza y escudo, lanzando un grito de guerra. Por eso soy la diosa de la sabiduría: llevo dentro la astucia de mi madre.'},
  {n:'El asombro del Olimpo',c:'wide',s:['zeus','atenea','dioses'],t:'El Olimpo tembló, la tierra gritó y el mar se agitó, dice el himno, hasta que me quité las armas. Lo veréis esculpido en el frontón oriental del Partenón, sobre tu cabeza cuando entras.'}],
  src:'Hesíodo, <i>Teogonía</i> 886-900 y 924-926; <i>Himno homérico</i> 28; Píndaro, <i>Olímpica</i> 7, 35-38.'},
 {id:'olivo',a:'m',t:'El olivo y Poseidón',set:'acropolis',h:9,ph:[
  {n:'Dos dioses para una ciudad',c:'wide',s:['cecrope'],t:'Cuando Cécrope, mitad hombre y mitad serpiente, reinaba en esta tierra, Poseidón y yo quisimos ser los patronos de la ciudad. Cada uno haría un regalo.'},
  {n:'El tridente',c:'left',s:['poseidon','cecrope'],t:'Poseidón golpeó la roca con su tridente y brotó un manantial… de agua salada. Aún podéis ver la marca y el «mar» en el Erecteo.'},
  {n:'El olivo',c:'right',fx:'flash',s:['poseidon','atenea','olivo','cecrope'],t:'Yo planté un olivo: aceite para comer, para la luz y para los atletas. El olivo sagrado sigue en la Acrópolis; Heródoto cuenta que, cuando los persas lo quemaron, al día siguiente ya había echado un brote.'},
  {n:'El veredicto',c:'mid',s:['atenea','olivo','cecrope'],t:'Los jueces me dieron la victoria y la ciudad tomó mi nombre. Una versión tardía dice que votaron todos, hombres y mujeres, y que las mujeres ganaron por un voto; Poseidón, furioso, inundó la tierra y las mujeres perdieron el voto. Es lo que contaba Varrón, según san Agustín. Busca la escena en el frontón occidental del Partenón.'}],
  src:'Heródoto VIII 55; Apolodoro, <i>Biblioteca</i> III 14, 1; Agustín, <i>La ciudad de Dios</i> XVIII 9 (citando a Varrón).'},
 {id:'erictonio',a:'m',t:'Erictonio, el niño de la tierra',set:'acropolis',h:10,ph:[
  {n:'Hefesto',c:'mid',s:['hefesto'],t:'Hefesto me persiguió, pero yo soy virgen, <i>parthénos</i>: de ahí el nombre de mi templo. De aquel encuentro cayó semilla a la tierra, y la Tierra dio a luz a un niño, Erictonio.'},
  {n:'La cesta cerrada',c:'close',s:['cesta','cecrope'],t:'Lo guardé en una cesta y la confié a las hijas de Cécrope, con una orden: no abrirla. La curiosidad pudo más.'},
  {n:'La serpiente',c:'close',fx:'flash',s:['cesta'],t:'Dentro había un niño… y una serpiente enroscada. Las muchachas, espantadas, se arrojaron desde la Acrópolis. Por eso en mi templo vive una serpiente sagrada, y en mi estatua, aquí al lado, hay otra junto al escudo.'},
  {n:'Rey de Atenas',c:'wide',s:['atenea','cecrope'],t:'Erictonio creció en mi templo, fue rey de Atenas y, dicen, fundó las Panateneas, la gran fiesta en mi honor. Los atenienses os llamáis hijos de la tierra, <i>autóctonos</i>, por él.'}],
  src:'Apolodoro, <i>Biblioteca</i> III 14, 6; Eurípides, <i>Ion</i> 20-26 y 267-274; Pausanias I 24, 7.'},
 {id:'aracne',a:'m',t:'Aracne',set:'telar',h:11,ph:[
  {n:'La tejedora orgullosa',c:'mid',s:['aracne'],t:'En Lidia vivía Aracne, la mejor tejedora del mundo. Cuando le decían que yo le había enseñado, ella se enfadaba: nadie le había enseñado nada.'},
  {n:'La anciana',c:'close',s:['aracne','vieja'],t:'Me disfracé de anciana y le aconsejé que pidiera perdón a la diosa. Ella me desafió. Entonces me quité el disfraz.'},
  {n:'El concurso',c:'mid',s:['aracne','atenea'],t:'Yo tejí a los dioses en majestad y los castigos de los soberbios. Ella tejió los engaños y amores de los dioses, sin un solo fallo. No pude encontrarle defecto, y eso me enfureció.'},
  {n:'La araña',c:'close',fx:'flash',s:['arana','atenea'],t:'Rompí su tela; ella, desesperada, quiso ahorcarse. La convertí en araña: seguiría colgando y tejiendo para siempre. Este mito lo cuenta el poeta romano Ovidio, siglos después de tu época.'}],
  src:'Ovidio, <i>Metamorfosis</i> VI 5-145 (fuente romana, del siglo I a.C.-I d.C.: anacronismo señalado).'},
 {id:'medusa',a:'m',t:'Perseo y la Gorgona',set:'mar',h:16,ph:[
  {n:'Un encargo imposible',c:'mid',s:['perseo','atenea'],t:'El joven Perseo prometió traer la cabeza de Medusa, una de las tres Gorgonas: quien la miraba a los ojos se convertía en piedra. Hermes y yo lo ayudamos.'},
  {n:'El escudo como espejo',c:'close',s:['perseo'],t:'Le di un consejo: no mirarla nunca de frente, sino su reflejo en el escudo de bronce bruñido. Con sandalias aladas y un casco que lo hacía invisible, llegó hasta ellas mientras dormían.'},
  {n:'Las Gorgonas',c:'right',fx:'flash',s:['perseo','gorgonas'],t:'Cortó la cabeza de Medusa, que era mortal; sus hermanas, inmortales, despertaron y lo persiguieron, pero no pudieron verlo.'},
  {n:'La égida',c:'close',s:['egida'],t:'Perseo me regaló la cabeza y yo la puse en mi égida, la piel que llevo sobre el pecho. Mírala en la estatua de Fidias: el rostro de Medusa en el centro.'}],
  src:'Hesíodo, <i>Teogonía</i> 274-283; Apolodoro, <i>Biblioteca</i> II 4, 2-3; Pausanias I 24, 7.'},
 {id:'oikos',a:'s',t:'La casa: el oîkos',set:'casa',h:10,ph:[
  {n:'Una casa es más que paredes',c:'mid',s:['familia'],t:'El <i>oîkos</i> es la casa entera: la familia, los esclavos, los bienes y las tierras. Al frente está el <i>kýrios</i>, el hombre que la representa ante la ciudad.'},
  {n:'Las mujeres',c:'left',s:['telar'],t:'La mujer de buena familia dirige la casa por dentro: la despensa, los esclavos, el tejido. Jenofonte, discípulo de Sócrates, lo describe así en el <i>Económico</i>. Pero las mujeres pobres trabajan fuera: venden en el mercado, son nodrizas, hilanderas.'},
  {n:'Hijos y herencia',c:'close',s:['familia'],t:'Lo más importante es que la casa no se extinga: los hijos heredan a partes iguales, y si solo hay una hija, la <i>epíkleros</i>, debe casarse con un pariente para que los bienes sigan en la familia.'},
  {n:'Los esclavos de la casa',c:'right',s:['familia','esclavos'],t:'Casi todas las casas tienen al menos un esclavo. Son propiedad, pero también parte del oîkos: al llegar se les recibe con frutos secos junto al hogar.'}],
  src:'Jenofonte, <i>Económico</i> VII-X; Iseo, discursos sobre herencias; S. Pomeroy, <i>Diosas, rameras, esposas y esclavas</i>.'},
 {id:'asamblea',a:'s',t:'Ciudadanos y Asamblea',set:'asamblea',h:9,ph:[
  {n:'La Pnyx',c:'wide',s:['asamblea'],t:'Unas cuarenta veces al año los ciudadanos varones adultos suben a la colina de la Pnyx. Allí se vota la guerra y la paz, los impuestos y las leyes, a mano alzada.'},
  {n:'¿Quién quiere hablar?',c:'close',s:['asamblea','orador'],t:'El heraldo pregunta: «¿Quién quiere hablar?». Cualquier ciudadano puede hacerlo, aunque en la práctica hablan los oradores de siempre. Desde hace unos años se paga a quien asiste, para que los pobres no pierdan el jornal.'},
  {n:'El Consejo de los Quinientos',c:'left',s:['consejo'],t:'Quinientos ciudadanos sorteados, cincuenta de cada tribu, preparan los asuntos de la Asamblea en el Buleuterio. Nadie puede ser consejero más de dos veces en la vida.'},
  {n:'El sorteo',c:'mid',s:['asamblea','consejo'],t:'Casi todos los cargos se sortean: creéis que es lo más democrático, porque cualquiera puede gobernar. Solo los generales, los estrategos, se eligen votando, porque la guerra pide expertos.'}],
  src:'Aristóteles, <i>Constitución de los atenienses</i> 41-44 y 62; Aristófanes, <i>Asambleístas</i> (392 a.C.); M. H. Hansen, <i>La democracia ateniense en la época de Demóstenes</i>.'},
 {id:'tribunales',a:'s',t:'Tribunales y ostracismo',set:'asamblea',need:1,h:11,ph:[
  {n:'Los jueces son el pueblo',c:'mid',s:['tribunal'],t:'Cada año se sortean seis mil jurados, los heliastas. Un juicio importante puede tener quinientos uno: un número impar para que no haya empate.'},
  {n:'Hablar contra el reloj',c:'close',s:['tribunal'],t:'No hay abogados ni fiscales: cada parte habla por sí misma, aunque puede pagar a un logógrafo que le escriba el discurso. El tiempo se mide con un reloj de agua, la <i>clepsidra</i>.'},
  {n:'Votar con fichas',c:'close',s:['tribunal'],t:'Los jurados votan en secreto con fichas de bronce: con el eje hueco para condenar, macizo para absolver. Así condenaron a Sócrates hace trece años.'},
  {n:'El ostracismo',c:'top',s:['ostraca'],t:'Antes, si un político parecía demasiado poderoso, los ciudadanos escribían su nombre en trozos de cerámica, <i>óstraka</i>. Con seis mil votos, se iba diez años al destierro, sin perder sus bienes. El último ostracismo fue hace unos treinta años, hacia el 417.'}],
  src:'Aristóteles, <i>Constitución de los atenienses</i> 22 y 63-69; Plutarco, <i>Arístides</i> 7; óstraka del Ágora y del Cerámico.'},
 {id:'excluidos',a:'s',t:'Los que no votan',set:'asamblea',need:2,h:15,ph:[
  {n:'La mayoría no vota',c:'wide',s:['asamblea','excluidos'],t:'Ciudadanos con derechos políticos sois unos treinta mil varones adultos. Pero en el Ática vive mucha más gente: mujeres, niños, extranjeros y esclavos.'},
  {n:'Las mujeres',c:'right',s:['excluidos'],t:'Las atenienses son ciudadanas: transmiten la ciudadanía a sus hijos y tienen un papel enorme en la religión (sacerdotisas de Atenea Polias, las fiestas). Pero no votan ni hablan en la Asamblea ni en los tribunales.'},
  {n:'Los metecos',c:'right',s:['excluidos'],t:'Los extranjeros que viven aquí, los metecos, pagan un impuesto de doce dracmas al año, sirven en el ejército y hacen buena parte del comercio. Pasión, el banquero más rico de Atenas, fue esclavo y luego meteco.'},
  {n:'Los esclavos',c:'right',s:['excluidos'],t:'Hay decenas de miles de esclavos: en las casas, los talleres y, en las peores condiciones, en las minas de plata del Laurión. La democracia ateniense se apoyaba también en su trabajo.'}],
  src:'Aristóteles, <i>Política</i> I y III; Jenofonte, <i>Ingresos</i> II y IV; Demóstenes XXXVI (sobre Pasión).'},
 {id:'educacion',a:'s',t:'Escuela y gimnasio',set:'casa',need:3,h:9,ph:[
  {n:'Tres maestros',c:'mid',s:['escuela'],t:'No hay escuela pública: las familias pagan. El niño va al <i>grammatistés</i> para leer y escribir, al <i>kitharistés</i> para la lira y los poemas de Homero, y al <i>paidotríbes</i> para el ejercicio físico.'},
  {n:'El pedagogo',c:'close',s:['escuela','esclavos'],t:'Le acompaña un esclavo, el <i>paidagogós</i>, «el que lleva al niño»: le carga los libros y vigila que se porte bien. La palabra «pedagogo» viene de ahí.'},
  {n:'¿Y las niñas?',c:'left',s:['telar'],t:'Las niñas aprenden en casa a hilar, tejer y llevar la casa. Algunas aprenden a leer. No van a la palestra.'},
  {n:'Los filósofos y los sofistas',c:'wide',s:['familia'],t:'Los jóvenes ricos pagan a sofistas para aprender a hablar en público. Y justo ahora, hacia el 387, Platón ha abierto su escuela en la Academia. La efebía, el entrenamiento militar obligatorio de dos años, se organizará más tarde, hacia el 335.'}],
  src:'Platón, <i>Protágoras</i> 325c-326c; Aristófanes, <i>Nubes</i> 961-1023; Aristóteles, <i>Constitución de los atenienses</i> 42.'}],
roma:[
 {id:'reyes',a:'h',t:'Orígenes y reyes',set:'roma',hist:true,h:17,ph:[
  {n:'Aldeas junto al Tíber',c:'wide',s:['chozas'],t:'En el siglo VIII a.C. había cabañas de madera y paja en el Palatino, junto a un vado del Tíber. Los arqueólogos han encontrado sus agujeros de poste. La tradición fija la fundación de Roma por Rómulo el 21 de abril del 753 a.C.'},
  {n:'Siete reyes',c:'mid',s:['reyes'],t:'Según Livio, reinaron siete reyes: Rómulo, Numa (que ordenó la religión), Tulo Hostilio, Anco Marcio, Tarquinio Prisco, Servio Tulio y Tarquinio el Soberbio. Los tres últimos están ligados a los etruscos, el pueblo vecino que enseñó a Roma muchas cosas.'},
  {n:'Mi templo en el Capitolio',c:'right',s:['templo'],t:'Los Tarquinios construyeron el templo donde estás ahora: tres cellas, para Júpiter, Juno y yo, Minerva. Se dedicó en el primer año de la República, el 509 a.C. Este año, el 80 d.C., ha ardido en un incendio; Domiciano lo reconstruirá.'},
  {n:'Adiós a los reyes',c:'wide',s:['reyes','plebe'],t:'En el 509 a.C., tras el crimen de Sexto Tarquinio contra Lucrecia, los romanos expulsaron al último rey. Desde entonces la palabra «rey», <i>rex</i>, quedó maldita en Roma.'}],
  src:'Livio I; Dionisio de Halicarnaso, <i>Antigüedades romanas</i> III-IV; Tácito, <i>Historias</i> III 72; excavaciones de las cabañas del Palatino.'},
 {id:'republica',a:'h',t:'La República y la conquista de Italia',set:'roma',hist:true,need:'reyes',h:10,ph:[
  {n:'Cónsules y Senado',c:'mid',s:['senado'],t:'En lugar de un rey, dos cónsules elegidos cada año, que se vigilan entre sí. El Senado, formado por antiguos magistrados, aconseja, y su consejo casi siempre se cumple.'},
  {n:'Patricios contra plebeyos',c:'left',s:['senado','plebe'],t:'Los plebeyos se retiraron de la ciudad (la secesión del 494 a.C.) hasta lograr sus tribunos. Exigieron leyes escritas: las Doce Tablas (451-450). En el 367 un plebeyo pudo ser cónsul por primera vez.'},
  {n:'Los galos',c:'wide',s:['galos'],t:'Hacia el 390 a.C. los galos vencieron en el río Alia y saquearon Roma. Livio cuenta que los gansos de Juno, en mi colina, despertaron a los defensores del Capitolio.'},
  {n:'Italia romana',c:'mid',s:['legion'],t:'Con guerras y alianzas, Roma venció a latinos, etruscos, samnitas y a las ciudades griegas del sur. En el 272 a.C. cayó Tarento: Italia era romana.'}],
  src:'Livio II-X; Polibio VI (la constitución romana).'},
 {id:'punicas',a:'h',t:'Cartago y el Mediterráneo',set:'roma',hist:true,need:'republica',h:13,ph:[
  {n:'La primera guerra púnica',c:'sea',s:['barcos'],t:'En el 264 a.C. Roma y Cartago chocaron por Sicilia. Roma, que no tenía flota, aprendió a construir barcos copiando uno cartaginés encallado, dice Polibio. Ganó en el 241.'},
  {n:'Aníbal',c:'wide',s:['legion'],t:'En el 218 Aníbal cruzó los Alpes con elefantes y destrozó a los romanos en Cannas (216). Pero Roma no se rindió: Escipión llevó la guerra a África y venció en Zama (202).'},
  {n:'146 a.C.',c:'top',s:['fuego'],t:'En el mismo año, el 146 a.C., Roma destruyó Cartago y Corinto. El Mediterráneo empezó a ser «nuestro mar», <i>mare nostrum</i>.'},
  {n:'El precio de la victoria',c:'mid',s:['plebe','senado'],t:'Llegaron riquezas y esclavos en masa. Los grandes propietarios compraron tierras y muchos campesinos, que habían luchado años lejos de casa, lo perdieron todo.'}],
  src:'Polibio I 20-21 y III; Livio XXI-XXX; Apiano, <i>Libyca</i>.'},
 {id:'imperio',a:'h',t:'De la República al Imperio',set:'roma',hist:true,need:'punicas',h:16,ph:[
  {n:'Los Gracos',c:'mid',s:['plebe','senado'],t:'Tiberio Graco (133 a.C.) y su hermano Cayo (123) quisieron repartir tierras a los pobres. Los dos murieron violentamente. La política romana se llenó de sangre.'},
  {n:'Generales con ejército propio',c:'wide',s:['legion'],t:'Mario abrió las legiones a los pobres, que pasaron a ser fieles a su general. Sila marchó sobre Roma con su ejército. Después, César y Pompeyo.'},
  {n:'César',c:'close',s:['cesar'],t:'En el 49 a.C. César cruzó el Rubicón con su ejército y ganó la guerra civil. Se hizo dictador perpetuo y fue asesinado en el Senado en los idus de marzo del 44.'},
  {n:'Augusto y los emperadores',c:'mid',s:['emperador'],t:'Octavio, su heredero, venció a Antonio y Cleopatra en Accio (31 a.C.) y en el 27 recibió el nombre de Augusto. Mantuvo las formas de la República, pero mandaba él. Después: Tiberio, Calígula, Claudio, Nerón… y en el 69, cuatro emperadores en un año. Ganó Vespasiano; hoy reina su hijo Tito, que acaba de inaugurar el anfiteatro Flavio.'}],
  src:'Plutarco, <i>Tiberio y Cayo Graco</i>, <i>César</i>; Suetonio, <i>Vidas de los doce césares</i>; <i>Res gestae divi Augusti</i>.'},
 {id:'futuroR',a:'h',t:'El futuro de Roma',set:'roma',hist:true,need:3,h:18,ph:[
  {n:'Lo que aún no ha pasado',c:'wide',s:['emperador'],t:'Te mostraré lo que aún no ha sucedido. Con Trajano (117 d.C.) el Imperio alcanzará su mayor tamaño, de Britania a Mesopotamia. <i>(En el juego estamos en el 80 d.C.: esto es el futuro.)</i>'},
  {n:'Todos ciudadanos',c:'mid',s:['plebe','senado'],t:'En el 212, el emperador Caracalla dará la ciudadanía romana a casi todos los habitantes libres del Imperio.'},
  {n:'La crisis',c:'wide',s:['galos','fuego'],t:'En el siglo III vendrán guerras civiles, invasiones, peste e inflación: unos cincuenta años con más de veinte emperadores. Aureliano rodeará Roma con una muralla nueva.'},
  {n:'Una religión nueva',c:'close',s:['cruz','emperador'],t:'Los cristianos, hoy una pequeña secta perseguida, crecerán. Constantino los protegerá (313) y fundará Constantinopla (330); Teodosio hará del cristianismo la religión oficial (380). Mi templo se cerrará.'},
  {n:'El final de Occidente',c:'top',s:['galos','fuego'],t:'En el 476, un jefe germano depondrá al último emperador de Occidente. En Oriente el Imperio, con capital en Constantinopla, durará hasta 1453. Y el latín seguirá vivo en las lenguas que hablarán tus descendientes.'}],
  src:'Dion Casio; <i>Historia Augusta</i>; Eusebio, <i>Vida de Constantino</i>; <i>Código Teodosiano</i> XVI 1, 2.'},
 {id:'triada',a:'m',t:'Mi nacimiento y la Tríada',set:'olimpo',h:12,ph:[
  {n:'Nacida de la cabeza de Júpiter',c:'mid',fx:'flash',s:['zeus','hefesto','atenea'],t:'Los griegos me llaman Atenea y cuentan que salí armada de la cabeza de Zeus. En Roma os quedasteis la historia: nací de la cabeza de Júpiter.'},
  {n:'Menrva',c:'close',s:['atenea'],t:'Pero yo ya estaba en Italia antes: los etruscos me llamaban Menrva. Mi nombre quizá venga de <i>mens</i>, «mente». Soy la diosa de la inteligencia, de los oficios y de la guerra bien pensada.'},
  {n:'La Tríada Capitolina',c:'wide',s:['zeus','atenea','dioses'],t:'En este templo vivimos tres: Júpiter en el centro, Juno a un lado y yo al otro. Toda colonia romana construye su propio Capitolio con nosotros tres.'},
  {n:'El dios que no quiso irse',c:'mid',s:['zeus','atenea'],t:'Cuando Tarquinio limpió la colina para construir el templo, todos los dioses que había allí aceptaron marcharse menos Término, el dios de los límites. Se quedó dentro del templo: Roma nunca retrocedería, dijeron los augures.'}],
  src:'Livio I 55; Ovidio, <i>Fastos</i> II 667-678 y III 835-848; Vitruvio I 7, 1.'},
 {id:'paladio',a:'m',t:'El Paladio',set:'mar',h:20,ph:[
  {n:'La estatua caída del cielo',c:'close',s:['paladio'],t:'En Troya había una pequeña estatua mía de madera, el Paladio, que había caído del cielo. Mientras estuviera en la ciudad, Troya no caería.'},
  {n:'El robo',c:'mid',s:['paladio','troya'],t:'Por eso, cuentan los griegos, Diomedes y Ulises entraron de noche en Troya y la robaron. Poco después cayó la ciudad.'},
  {n:'Eneas',c:'sea',s:['troya'],t:'Los romanos cuentan otra cosa: que el verdadero Paladio lo salvó Eneas del incendio y lo trajo a Italia.'},
  {n:'En el templo de Vesta',c:'mid',s:['vestales'],t:'Hoy está escondido en el templo de Vesta, en el Foro, y solo lo ven las vestales. Cuando el templo ardió en el 241 a.C., el pontífice Metelo entró en las llamas para salvarlo y se quedó ciego.'}],
  src:'Dionisio de Halicarnaso, <i>Antigüedades romanas</i> I 68-69; Ovidio, <i>Fastos</i> VI 417-454; Virgilio, <i>Eneida</i> II 162-170.'},
 {id:'aracneR',a:'m',t:'Aracne',set:'telar',h:11,ph:[
  {n:'La tejedora orgullosa',c:'mid',s:['aracne'],t:'Tu poeta Ovidio lo cuenta: en Lidia vivía Aracne, la mejor tejedora del mundo, y negaba que yo le hubiera enseñado.'},
  {n:'La anciana',c:'close',s:['aracne','vieja'],t:'Me disfracé de anciana y le pedí humildad. Ella me desafió a un concurso. Me quité el disfraz.'},
  {n:'El concurso',c:'mid',s:['aracne','atenea'],t:'Yo tejí a los dioses en majestad; ella, los engaños de los dioses, sin un fallo. Era perfecto, y eso no lo soporté.'},
  {n:'La araña',c:'close',fx:'flash',s:['arana','atenea'],t:'Rompí su tela y la convertí en araña. Por eso las arañas tejen colgadas: es Aracne. Una advertencia contra la soberbia… y también contra una diosa que no sabe perder.'}],
  src:'Ovidio, <i>Metamorfosis</i> VI 5-145.'},
 {id:'flauta',a:'m',t:'La flauta y Marsias',set:'telar',need:2,h:14,ph:[
  {n:'Invento la tibia',c:'close',s:['flauta'],t:'Inventé la <i>tibia</i>, la flauta doble, agujereando madera de boj. La música era hermosa. Por eso los flautistas me honran en mis fiestas.'},
  {n:'Mi reflejo',c:'close',s:['flauta'],t:'Pero al tocarla vi mi reflejo en el agua: las mejillas hinchadas, la cara deformada. La tiré lejos.'},
  {n:'Marsias',c:'mid',s:['marsias'],t:'El sátiro Marsias la recogió, aprendió a tocarla y se creyó tan bueno que desafió a Apolo, el de la lira.'},
  {n:'El castigo',c:'mid',fx:'flash',s:['marsias'],t:'Apolo ganó y castigó cruelmente a Marsias por su soberbia. En el Foro hay una estatua de Marsias: dicen que es símbolo de la libertad de la ciudad.'}],
  src:'Ovidio, <i>Fastos</i> VI 693-710 y <i>Metamorfosis</i> VI 382-400; Plinio, <i>Historia natural</i> XXI 9.'},
 {id:'quinquatrus',a:'m',t:'Las Quinquatrus, mi fiesta',set:'casa',need:4,h:10,ph:[
  {n:'Cinco días de marzo',c:'mid',s:['mercado'],t:'Del 19 al 23 de marzo celebráis mis Quinquatrus. El primer día fue mi nacimiento, dice Ovidio, y el templo del Aventino se dedicó ese día.'},
  {n:'Los artesanos',c:'mid',s:['mercado'],t:'Me honran todos los oficios: tejedores, bataneros, zapateros, carpinteros, médicos, pintores, escultores… y los maestros. Soy la diosa de las manos que saben hacer.'},
  {n:'Los escolares',c:'close',s:['escuela'],t:'Los niños tienen vacaciones y llevan al maestro su paga, el <i>minerval</i>. Juvenal, un poeta que escribirá dentro de unos años, hablará del niño que en mis fiestas pide la elocuencia de Cicerón.'},
  {n:'Las trompetas',c:'wide',s:['familia','clientes'],t:'El último día, el <i>tubilustrium</i>, se purifican las trompetas sagradas. Ya ves: entre la escuela y la guerra, todo lo que pide cabeza es mío.'}],
  src:'Ovidio, <i>Fastos</i> III 809-848; Juvenal X 114-117; Varrón, <i>Sobre la lengua latina</i> VI 14 y 17.'},
 {id:'familiaR',a:'s',t:'La familia y el paterfamilias',set:'casa',h:10,ph:[
  {n:'El paterfamilias',c:'mid',s:['familia'],t:'La <i>familia</i> romana es todo lo que está bajo la potestad del <i>paterfamilias</i>: esposa (según el tipo de matrimonio), hijos, nietos y esclavos. Mientras él vive, ni sus hijos adultos tienen bienes propios.'},
  {n:'La matrona',c:'left',s:['telar','familia'],t:'La matrona dirige la casa, recibe a los invitados y sale a la calle con libertad, más que una ateniense. Los epitafios alaban a la que «guardó la casa e hiló lana».'},
  {n:'Los hijos',c:'close',s:['familia'],t:'El padre podía, en teoría, decidir sobre la vida de sus hijos. En la práctica, hoy está mal visto. A los catorce años el muchacho deja la toga con franja púrpura y viste la toga viril.'},
  {n:'Los antepasados',c:'mid',s:['familia'],t:'En el atrio de las familias nobles se guardan las máscaras de cera de los antepasados, que salen en los funerales. Ser romano es estar a la altura de los mayores: el <i>mos maiorum</i>.'}],
  src:'Gayo, <i>Instituciones</i> I 48-55; Polibio VI 53; epitafio de Claudia (<i>CIL</i> I² 1211); J. Carcopino, <i>La vida cotidiana en Roma</i>.'},
 {id:'clientes',a:'s',t:'Patronos y clientes',set:'casa',h:7,ph:[
  {n:'La salutatio',c:'mid',s:['clientes'],t:'Al amanecer, ante la puerta de cada poderoso hay una cola de clientes con toga: vienen a saludar a su patrono, la <i>salutatio</i>.'},
  {n:'Lo que da el patrono',c:'close',s:['clientes'],t:'El patrono protege: ayuda en los juicios, presta dinero, da una pequeña cantidad diaria, la <i>sportula</i> (seis sestercios y cuarto: Marcial, que ahora empieza a publicar, se quejará de ella en sus epigramas).'},
  {n:'Lo que da el cliente',c:'wide',s:['clientes'],t:'El cliente acompaña a su patrono por el Foro, lo aplaude cuando habla y le vota. Cuantos más clientes, más importante pareces.'},
  {n:'Una red de favores',c:'mid',s:['clientes','familia'],t:'Toda Roma funciona con favores y lealtades. Un esclavo liberado pasa a ser cliente de su antiguo amo.'}],
  src:'Marcial III 7 y X 70; Juvenal I 95-126; Séneca, <i>Sobre la brevedad de la vida</i> 14.'},
 {id:'ordenes',a:'s',t:'Senadores, caballeros y plebe',set:'roma',need:1,h:11,ph:[
  {n:'Los senadores',c:'mid',s:['senado'],t:'Unos seiscientos senadores, con al menos un millón de sestercios y la túnica de franja ancha. No pueden dedicarse al comercio: su riqueza debe estar en tierras.'},
  {n:'Los caballeros',c:'right',s:['senado'],t:'El orden ecuestre: cuatrocientos mil sestercios y franja estrecha. Son banqueros, recaudadores y altos funcionarios del emperador.'},
  {n:'La plebe',c:'wide',s:['plebe'],t:'La inmensa mayoría de los ciudadanos de Roma son plebeyos: artesanos, tenderos, jornaleros. Unos doscientos mil reciben trigo gratis cada mes.'},
  {n:'Pan y juegos',c:'mid',s:['plebe','emperador'],t:'El emperador cuida de la plebe con trigo, baños y espectáculos. Dentro de unos años, el poeta Juvenal lo resumirá con desprecio: el pueblo solo pide «pan y juegos».'}],
  src:'Suetonio, <i>Augusto</i> 40-41; Plinio, <i>Historia natural</i> XXXIII 32; Juvenal X 77-81.'},
 {id:'esclavosR',a:'s',t:'Esclavos y libertos',set:'casa',need:2,h:13,ph:[
  {n:'Millones de esclavos',c:'mid',s:['esclavos','familia'],t:'Prisioneros de guerra, niños abandonados, hijos de esclavas: en Italia quizá uno de cada cinco habitantes es esclavo. Trabajan en casas, talleres, minas y en enormes fincas.'},
  {n:'Sin derechos',c:'close',s:['esclavos'],t:'Un esclavo es una cosa ante la ley: puede ser vendido, castigado, separado de su familia. Su suerte depende del amo.'},
  {n:'La libertad',c:'mid',s:['esclavos','familia'],t:'Pero en Roma es frecuente liberar a los esclavos, la manumisión. El liberto se vuelve ciudadano, y sus hijos, plenamente romanos.'},
  {n:'Libertos ricos',c:'wide',s:['mercado'],t:'Algunos libertos se hacen muy ricos con el comercio. Petronio se burla de uno, Trimalción, en su novela. Y los libertos del emperador han llegado a gobernar el Imperio desde palacio.'}],
  src:'Gayo, <i>Instituciones</i> I 9-17; Petronio, <i>Satiricón</i> 26-78; Plinio el Joven, <i>Cartas</i> III 14.'},
 {id:'escuelaR',a:'s',t:'La escuela',set:'casa',need:3,h:8,ph:[
  {n:'El ludi magister',c:'mid',s:['escuela'],t:'Desde los siete años, muchos niños (y algunas niñas) van a la escuela del <i>ludi magister</i>, a veces bajo un toldo en un pórtico, a leer, escribir y contar. Empiezan antes del amanecer.'},
  {n:'El gramático',c:'close',s:['escuela'],t:'Hacia los once años, el <i>grammaticus</i> enseña a leer bien a los poetas: Virgilio y Homero, en latín y en griego.'},
  {n:'El rétor',c:'wide',s:['escuela'],t:'Hacia los quince, el <i>rhetor</i> enseña a hablar en público con ejercicios de discursos inventados. Es la preparación para el Foro y la política.'},
  {n:'La vara',c:'close',s:['escuela'],t:'La disciplina es dura: Horacio recuerda a su maestro Orbilio como «el que pega». Quintiliano, que hoy enseña en Roma pagado por el Estado, pide maestros que no peguen.'}],
  src:'Quintiliano, <i>Institución oratoria</i> I 1-3; Horacio, <i>Epístolas</i> II 1, 70; Marcial IX 68.'}]};
// ---------------------------------------------------------------- estado y desbloqueo
const AM={F:null,o:null};
function amz(){if(!state.diosa||typeof state.diosa!=='object')state.diosa={};const k=MODE==='roma'?'R':'A';if(!state.diosa[k])state.diosa[k]={met:0,base:0,seen:{}};return state.diosa[k];}
function amList(){return AM_TOPICS[MODE==='roma'?'roma':'atenas'];}
function amSeen(id){const z=amz(),first=!z.seen[id];z.seen[id]=1;save();if(first){qAdd('so',1,'Aprendiste con '+amName());toast('<span class="label">'+amName()+' te ha enseñado</span><br>'+((amList().find(t=>t.id===id)||{}).t||'')+' · '+amLeft()+' por escuchar');}
  setTimeout(()=>{if(ui==='play'&&!EPI.cur&&AM.o&&Math.hypot(player.x-AM.o.x,player.z-AM.o.z)<12)amTalk();},900);}
function amName(){return MODE==='roma'?'Minerva':'Atenea';}
function amProg(){let n=(state.lessons||[]).length;if(state.seen)for(const k in state.seen)if(k.startsWith('ep:')&&!k.startsWith('ep:am_'))n++;return n;}
// cupo: 2 la primera vez + 2 por cada nivel de Sophía ganado desde entonces + 1 por cada 6 pasos de avance (lecciones y sueños)
function amCap(){const z=amz();return 2+2*Math.max(0,qLv('so')-z.base)+Math.floor(amProg()/6);}
function amUsed(){return Object.keys(amz().seen).length;}
function amLeft(){return Math.max(0,amCap()-amUsed());}
// ¿por qué está cerrado? null = abierto. need: id previo · número = cuántos del mismo ámbito hay que haber visto antes
function amLock(T){const z=amz(),L=amList();if(typeof T.need==='string'&&!z.seen[T.need]){const p=L.find(x=>x.id===T.need);return'Antes: «'+(p?p.t:T.need)+'»';}
  if(typeof T.need==='number'){const n=L.filter(x=>x.a===T.a&&z.seen[x.id]).length;if(n<T.need)return'Se abre cuando hayas escuchado '+T.need+' de este ámbito ('+n+'/'+T.need+')';}return null;}
const AM_AMB={h:['Historia','⏳','Del pasado lejano a lo que aún no ha pasado.'],m:['Mitología','✶','Cinco mitos en los que tomé parte.'],s:['Sociedad','⚖','Cómo vivís: cinco claves.']};
// ---------------------------------------------------------------- diálogo
function amTalk(){const z=amz(),ro=MODE==='roma',nm=amName(),qn=ro?'Sapientia':'Sophía';let intro;
  if(!z.met){z.met=1;z.base=qLv('so');save();
    intro=ro?'<p>Te veo mirar hacia la cella, ennegrecida por el incendio de este año. No te asustes: soy Minerva, la de la mente. Juno y Júpiter duermen; yo prefiero a quien pregunta.</p><p>Puedo abrirte la memoria del mundo: la <b>historia</b> de Roma, mis <b>mitos</b> y cómo vive tu <b>sociedad</b>. Hoy podrás escuchar dos lecciones. Cuando tu '+qn+' crezca un nivel, te enseñaré dos más.</p>'
     :'<p>Contemplas mi estatua: oro y marfil de Fidias, doce metros. Pero yo no estoy en el oro. Soy Atenea, y me gusta quien mira con atención.</p><p>Puedo abrirte la memoria del mundo: la <b>historia</b> de los griegos, mis <b>mitos</b> y cómo vive tu <b>sociedad</b>. Hoy podrás escuchar dos lecciones. Cuando tu '+qn+' crezca un nivel, te enseñaré dos más.</p>';
    if(AM.F&&AM.F.mk)AM.F.mk.visible=false;}
  else intro='<p>'+(ro?'Vuelves a mi cella. ¿Qué quieres saber?':'Vuelves al Partenón. ¿Qué quieres saber?')+'</p>';
  const left=amLeft();intro+='<p class="sub">Lecciones nuevas que puedes escuchar ahora: <b>'+left+'</b>'+(left?'':' · Sube un nivel de '+qn+' (o sigue aprendiendo por el mundo) para escuchar más.')+' Las ya escuchadas puedes repetirlas siempre.</p>';
  vmS(ro?'M':'Α',nm,ro?'diosa de la sabiduría y de los oficios':'Παλλὰς Ἀθηνᾶ · diosa de la sabiduría',intro,[
   ...['h','m','s'].map(a=>{const L=amList().filter(t=>t.a===a),n=L.filter(t=>z.seen[t.id]).length;return[AM_AMB[a][1]+' '+AM_AMB[a][0]+' <span class="sub">'+n+'/'+L.length+'</span>',()=>amAmb(a)];}),
   ['Despedirse',()=>closeDialog()]]);}
function amAmb(a){const z=amz(),ro=MODE==='roma',A=AM_AMB[a],left=amLeft();
  const L=amList().filter(t=>t.a===a);let html='<p>'+A[2]+'</p><p class="sub">'+(left?'Puedes escuchar '+left+' lección'+(left>1?'es':'')+' nueva'+(left>1?'s':'')+'.':'No te quedan lecciones nuevas por ahora: sube tu '+(ro?'Sapientia':'Sophía')+'.')+'</p>';
  const btns=L.map(T=>{const seen=z.seen[T.id],lock=amLock(T);
    if(seen)return['✓ '+T.t+' <span class="sub">repetir</span>',()=>amPlay(T)];
    if(lock)return['🔒 '+T.t+' <span class="sub">'+lock+'</span>',()=>{toast(lock);},'dis'];
    if(!left)return['◌ '+T.t+' <span class="sub">necesitas más '+(ro?'Sapientia':'Sophía')+'</span>',()=>toast('Sube un nivel de '+(ro?'Sapientia':'Sophía')+' para escuchar dos lecciones más.'),'dis'];
    return['✦ '+T.t+' <span class="sub">'+T.ph.length+' fases</span>',()=>amPlay(T)];});
  vmS(ro?'M':'Α',amName(),A[0],html,[...btns,['Volver',()=>amTalk()]]);}
function amPlay(T){if(EPI.cur||ui==='voyage'||ui==='episode')return;closeDialog();epiStart(amEpisode(T,amName()));}
// ---------------------------------------------------------------- colocación: Atenea ante la Parthenos; Minerva en su cella del templo capitolino
function amSpot(){if(MODE==='roma'){const fp=(footprints||[]).find(f=>f.name==='Templo de Júpiter Óptimo Máximo');const cx=fp?fp.x:-228,cz=fp?fp.z:22;return{x:cx+4.2,z:cz+7.2,face:[cx+4.2,cz+60]};}   // ante la puerta de la cella, junto a la imagen de culto (la cella del juego es única: la de Júpiter en el centro)
  const fp=(footprints||[]).find(f=>f.name==='Partenón');if(!fp)return null;const p=toW(3.5,6,fp.x,fp.z,fp.a),d=toW(0,24,fp.x,fp.z,fp.a);return{x:p[0],z:p[1],face:d};}
function amSetup(){AM.F=null;AM.o=null;const ro=MODE==='roma';const s=amSpot();if(!s)return;const y=floorAt(s.x,s.z);
  const look=ro?{female:true,chiton:'#efe6d4',himation:'#8a2a3a',hair:'#5a3a22',helmet:'attic',attrs:['G_aegis','P_spear','P_spearhead','P_shield']}
    :{female:true,chiton:'#efe6d4',himation:'#c9a24a',hair:'#5a3a22',helmet:'attic',attrs:['G_aegis','P_spear','P_spearhead','P_shield']};
  const F=divineFigure(s.x,s.z,look,'#ffe8b0',amName(),ro?'diosa de la sabiduría':'diosa de la sabiduría',1.2);F.g.position.y=y;F.g.rotation.y=Math.atan2(s.face[0]-s.x,s.face[1]-s.z);F.lb.visible=false;F.lb.userData.never=1;
  if(amz().met)F.mk.visible=false;AM.F=F;
  AM.o=egxObj(s.x,s.z,y,'am:talk',amName(),'pulsa E para hablar',3.2);}
{const f=egxAct0;egxAct0=function(o){if(String(o.act).startsWith('am:'))return amTalk();return f(o);};}
// la diosa respira y mira al jugador cuando se acerca
{const f=uxTick;uxTick=function(dt){f(dt);const F=AM.F;if(!F||ui!=='play')return;const dx=player.x-F.g.position.x,dz=player.z-F.g.position.z,d=Math.hypot(dx,dz);if(d>30)return;
  const t=performance.now()/1000;F.g.position.y=floorAt(F.g.position.x,F.g.position.z)+0.06+Math.sin(t*1.3)*0.05;if(d<10){const want=Math.atan2(dx,dz);let a=want-F.g.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));F.g.rotation.y+=a*Math.min(1,dt*2);}};}
{const st=document.createElement('style');st.textContent='#dOpts button.dis{opacity:.55}#dOpts button .sub{opacity:.75;font-size:.85em;margin-left:.4em}';document.head.appendChild(st);}
