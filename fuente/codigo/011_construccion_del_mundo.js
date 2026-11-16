// ============================================================ construcción del mundo
const npcObjs=[],signObjs=[],walkers=[];let SEA=null;
const OLIVE_POS=[];
let terrainInner,potX=0,potZ=0;
const TRIAL_H={x:AL(-65,60)[0],z:AL(-65,60)[1]};   // Agora XIV, lám. 5: al oeste de la Stoa Sur I
function grp(x,y,z,a){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=a||0;scene.add(g);return g;}
function wseg(x,z,a,x1,z1,x2,z2,t){const p=toW(x1,z1,x,z,a),q=toW(x2,z2,x,z,a);addSeg(p[0],p[1],q[0],q[1],t||0.4);}

function buildWorld(){bwSteps().forEach(st=>st[1]());}
// la construcción va por etapas para que la pantalla de carga (el barco) pueda dibujarse entre una y otra
function bwSteps(){
  if(MODE==='roma')return romeSteps();
  return [
  ['defineRiversGR',()=>{defineRiversGR();
  }],
  ['buildTerrain',()=>{terrainInner=buildTerrain(INNER.size+300,500,INNER.x,INNER.z,true);
  }],
  ['buildTerrain',()=>{buildTerrain(12000,300,INNER.x,INNER.z,false);
  }],
  ['mar',()=>{const sea=SEA=new THREE.Mesh(new THREE.PlaneGeometry(30000,30000),new THREE.MeshPhongMaterial({color:'#3a7891',shininess:80,specular:'#9fc3d0'}));
  sea.rotation.x=-Math.PI/2;sea.position.y=-2.2;scene.add(sea);
  }],
  ['montes',()=>{{const mm=new THREE.MeshLambertMaterial({color:'#aab5bd',fog:false});const r=mulberry32(7);
for(let i=0;i<40;i++){const a=r()*TAU;if(Math.abs(wrapA(a-2.5))<0.5)continue;const d=4200+r()*1200,h=220+r()*360;const m=new THREE.Mesh(new THREE.ConeGeometry(900+r()*900,h,10,1),mm);m.position.set(INNER.x+Math.cos(a)*d,h/2-60,INNER.z+Math.sin(a)*d);m.rotation.y=r()*TAU;scene.add(m);}}
  }],
  ['buildAcropolis',()=>{buildAcropolis();
  }],
  ['buildSouthSlope',()=>{buildSouthSlope();
  }],
  ['buildAgora',()=>{buildAgora();
  }],
  ['buildKerameikos',()=>{buildKerameikos();
  }],
  ['buildOutskirts',()=>{buildOutskirts();
  }],
  ['buildWalls',()=>{buildWalls();
  }],
  ['buildHarbor',()=>{buildHarbor();
  }],
  ['buildIslands',()=>{buildIslands();R.seed(386386);   // semilla: lo que se construye después (las casas de la ciudad) ya no depende de cuánto azar gastan los destinos, que cambia con su relieve

  }],
  ['buildLandRoute',()=>{buildLandRoute();
  }],
  ['definePlaces',()=>{definePlaces();
  }],
  ['buildAthensSchools',()=>{buildAthensSchools();
  }],
  ['buildMyHouse',()=>{buildMyHouse();
  }],
  ['applyFlats',()=>{applyFlats();
  }],
  ['buildHouses',()=>{buildHouses();
  }],
  ['buildTrees',()=>{buildTrees();
  }],
  ['finishColumns',()=>{finishColumns();
  }],
  ['buildTorches',()=>{buildTorches();
  }],
  ['buildSocial',()=>{buildSocial();
  }],
  ['buildGeoGR',()=>{buildGeoGR();buildTucGR();
  }],
  ['PLACES',()=>{PLACES.forEach(pl=>{const s=stele(pl.x,pl.z,pl.rot,pl.id);signObjs.push({kind:'sign',data:pl,g:s.g,mk:s.mk,x:pl.x,z:pl.z});});
  }],
  ['placeReliefs',()=>{placeReliefs();
  }],
  ['placeNewNPCs',()=>{placeNewNPCs();
  }],
  ['buildRaphaelHall',()=>{buildRaphaelHall();
  }],
  ['athensDecor',()=>{athensDecor();
  }],
  ['placeNPCs',()=>{placeNPCs();
  }],
  ['houseApply',()=>{houseApply();
  }],
  ['poseDream',()=>{poseDream();
  }],
  ['buildPerformers',()=>{buildPerformers();
  }],
  ['placeWalkers',()=>{placeWalkers();
  }],
  ['buildGods',()=>{buildGods();
  }],
  ['buildMount',()=>{buildMount();
  }],
  ['buildAvatar',()=>{buildAvatar();
  }],
  ['finishRoofs',()=>{finishRoofs();
  }]];
}

// ------------------------------------------------------------ Acrópolis
function buildAcropolis(){
  // murallas: al sur el muro de Cimón; al norte, tambores y entablamentos de los templos quemados por los persas
  {const pts=[];for(let i=0;i<=120;i++){const t=i/120*TAU,c=Math.cos(t),s=Math.sin(t),k=Math.pow(Math.pow(Math.abs(c),4)+Math.pow(Math.abs(s),4),-0.25);pts.push([c*ACRO.rx*k*0.995,s*ACRO.rz*k*0.995]);}
   const drumG=new THREE.CylinderGeometry(0.95,0.95,1.3,16);drumG.rotateX(Math.PI/2);
   for(let i=0;i<120;i++){const a=pts[i],b=pts[i+1],mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2;if(mx<-100&&mz>-34&&mz<36)continue;
     const len=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[0]-a[0],b[1]-a[1]);const m=box(2.4,18,len+0.4,M.limestone,mx,AY+1.1-9,mz);m.rotation.y=ang;addSeg(a[0],a[1],b[0],b[1],1.2);
     if(mz<-45&&mx>-70&&mx<70){const ol=Math.hypot(mx,mz),nx=mx/ol,nz=mz/ol;const dg=grp(mx+nx*1.3,AY-6,mz+nz*1.3,ang);try{atReg(mx+nx*1.3,mz+nz*1.3,AY-6,'tambores',2.2);}catch(e){}
       for(let k=-1;k<=1;k+=2){const d=new THREE.Mesh(drumG,M.marbleShade);d.position.set(0,0,k*len/4);dg.add(d);}
       const tb=new THREE.Mesh(new THREE.BoxGeometry(0.6,1.2,len),friezeMat(len));tb.position.set(0,2.2,0);dg.add(tb);}}}
  // Partenón (Ictino y Calícrates, 447-432): estilóbato 30,88 x 69,50 m, 8 x 17 columnas de 10,43 m
  const PX=32,PZ=13,PA=Math.PI/2;
  temple({name:'Partenón',x:PX,z:PZ,rot:PA,W:30.88,L:69.5,nW:8,nL:17,colD:1.905,colH:10.43,entH:3.3,pedH:3.45,steps:3,stepH:0.55,gy:AY,roofMat:M.marble,sculpt:13,
    cella:{w:21.7,l:48,t:1.1,door:4.9,part:-7,partSolid:true,backDoor:true,frieze:true,pro:{n:6,d:3.4,cd:1.7,ch:10.1},opi:{n:6,d:3.4,cd:1.7,ch:10.1},inner:{n:9,x:7.2,z1:-3.5,z2:20.5,r:0.55,h:10.0,back:5,two:true}}});
  for(const lx of[-4.5,4.5])for(const lz of[-11.5,-18.5]){const p=toW(lx,lz,PX,PZ,PA);addColumn(p[0],AY+1.65,p[1],0.6,10.6,PA,'ionic');}
  {const g=grp(PX,AY+1.65,PZ,PA),gold=M.gold,silver=lam('#cfd3d6'),wood=lam('#6b4a2e');
   for(const s of[-1,1])for(let i=0;i<5;i++){const lz=-9+i*-3.1;box(1.4,0.9,2.2,wood,s*8.6,0.45,lz,g);const p=toW(s*8.6,lz,PX,PZ,PA);addBox(p[0],p[1],1.4,2.2,PA);
     box(0.6,2.6,2.4,wood,s*9.5,1.3,lz,g);for(let k=0;k<3;k++){const v=new THREE.Mesh(PGEO.jar,k%2?gold:silver);v.scale.setScalar(0.7);v.position.set(s*9.5,2.62,lz-0.8+k*0.8);g.add(v);}
     const ph=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.18,0.08,14),gold);ph.position.set(s*8.6,0.95,lz);g.add(ph);}
   for(let i=0;i<6;i++){const cr=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.06,6,18),gold);cr.rotation.x=Math.PI/2;const sx=(i%2?1:-1)*4.2,sz=12+Math.floor(i/2)*3.5;box(0.25,1.3,0.25,M.marbleShade,sx,0.65,sz,g);cr.position.set(sx,1.4,sz);g.add(cr);const p=toW(sx,sz,PX,PZ,PA);addCirc(p[0],p[1],0.3);}
   for(const s of[-1,1]){const d=box(2.4,9.6,0.25,lam('#4a3020'),s*3.6,4.8,24.6,g);d.rotation.y=s*0.9;const d2=box(2.4,9.6,0.25,lam('#4a3020'),s*3.6,4.8,-24.6,g);d2.rotation.y=-s*0.9;}}
  // Atenea Pártenos de Fidias, con el estanque de agua delante
  {const p=toW(0,-1.5,PX,PZ,PA);const g=grp(p[0],AY+1.65,p[1],PA);g.scale.setScalar(1.2);
   box(6.6,1.1,3.4,M.marbleShade,0,0.55,0,g);
   if(GLB.ok){// oro (vestido, armas) y marfil (piel), con la Nike en la mano derecha
     const au={bronze:M.gold,wood:M.gold,crest:M.gold,gold:M.gold};
     const st=makePerson({chiton:'#d9a93a',himation:'#c9962e',skin:'#f3e5c8',hair:'#d9a93a',female:true,helmet:'attic',attrs:['G_aegis','P_spear','P_spearhead','P_shield'],attrRoles:au,scale:4.4});
     st.position.y=1.1;g.add(st);st.userData.arms[1].rotation.x=-1.25;
     const nk=makePerson({chiton:'#d9a93a',himation:'#d9a93a',skin:'#f3e5c8',hair:'#d9a93a',female:true,scale:0.24});nk.position.set(0.04,-0.66,-0.12);nk.rotation.x=1.25;st.userData.arms[1].add(nk);
     const snake=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.12,6,16),M.gold);snake.rotation.x=Math.PI/2;snake.position.set(-1.6,1.3,-0.4);g.add(snake);}
   else{
   const body=new THREE.Mesh(new THREE.CylinderGeometry(0.9,1.5,5.2,14),M.gold);body.position.y=3.7;g.add(body);
   const tor=new THREE.Mesh(new THREE.CylinderGeometry(0.85,0.9,1.8,14),M.gold);tor.position.y=7.1;g.add(tor);
   const hd=new THREE.Mesh(new THREE.SphereGeometry(0.55,14,12),M.ivory);hd.position.y=8.4;g.add(hd);
   const hel=new THREE.Mesh(new THREE.SphereGeometry(0.62,14,10,0,TAU,0,Math.PI*0.5),M.gold);hel.position.y=8.55;g.add(hel);
   const crest=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.7,1.3),M.gold);crest.position.y=9.3;g.add(crest);
   const sh=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,0.15,20),M.gold);sh.rotation.z=Math.PI/2;sh.position.set(-1.6,2.5,0.3);g.add(sh);
   const nike=new THREE.Mesh(new THREE.ConeGeometry(0.3,1.1,8),M.gold);nike.position.set(1.4,6.5,0.9);g.add(nike);
   const arm=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,1.4,8),M.ivory);arm.rotation.x=Math.PI/2;arm.position.set(1.2,6.0,0.4);g.add(arm);
   const snake=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.12,6,16),M.gold);snake.rotation.x=Math.PI/2;snake.position.set(-1.4,0.9,-0.6);g.add(snake);
   const spear=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,9,6),M.gold);spear.position.set(-1.1,4.5,-0.4);g.add(spear);}
   addCirc(p[0],p[1],3.4);
   const pool=toW(0,5.5,PX,PZ,PA);const w=new THREE.Mesh(new THREE.PlaneGeometry(6.4,6.4),new THREE.MeshPhongMaterial({color:'#24435a',shininess:90,specular:'#7fa7bf'}));w.rotation.x=-Math.PI/2;w.position.set(pool[0],AY+1.67,pool[1]);scene.add(w);
   box(7,0.12,7,M.limestone,pool[0],AY+1.6,pool[1]);}
  // cimientos del templo antiguo de Atenea (quemado en el 480)
  {const x=-12,z=-14,a=PA,W=21.3,L=43.4,g=grp(x,AY,z,a);box(W,1.4,L,M.limestone,0,-0.0,0,g);addPlat(x,z,W,L,a,AY+0.7);
   for(let i=0;i<6;i++)for(let j=0;j<12;j++){if(i>0&&i<5&&j>0&&j<11)continue;if(R()<0.35)continue;const p=toW(-W/2+1.4+i*(W-2.8)/5,-L/2+1.4+j*(L-2.8)/11,x,z,a);const c=new THREE.Mesh(new THREE.CylinderGeometry(0.85,0.9,0.3+R()*0.6,14),M.limestone);c.position.set(p[0],AY+0.9,p[1]);scene.add(c);}
   footprints.push({x,z,w:W,d:L,a,c:'#b9a684',name:'Templo antiguo'});}
  erechtheion(-18,-34);
  propylaia(-106,-2);
  // bastión y templo de Atenea Nike (Calícrates, c. 425): 5,64 x 8,27 m, anfipróstilo jónico de columnas de 4,04 m
  {const top=54.7,x0=-150,x1=-128,z0=7,z1=31,cx=(x0+x1)/2,cz=(z0+z1)/2,bot=minGround(cx,cz,22,24,0)-3;
   box(x1-x0,top-bot,z1-z0,M.limestone,cx,(top+bot)/2,cz);addPlat(cx,cz,x1-x0,z1-z0,0,top);
   const pm=texMat(TEX.nike,6,1);
   const par=(ax,az,bx,bz)=>{const len=Math.hypot(bx-ax,bz-az),m=box(Math.abs(bx-ax)>0.1?len:0.4,1.05,Math.abs(bz-az)>0.1?len:0.4,pm,(ax+bx)/2,top+0.52,(az+bz)/2);addSeg(ax,az,bx,bz,0.25);};
   par(x0,z1,x1,z1);par(x0,z0,x0,z1);par(x0,z0,-137,z0);
   temple({name:'Templo de Atenea Nike',x:-141,z:20,rot:PA,W:5.64,L:8.27,nW:4,prostyle:true,amphi:true,order:'ionic',colD:0.53,colH:4.04,entH:1.25,pedH:0.8,steps:3,stepH:0.22,gy:top,roofMat:M.marble,cella:{w:5.0,l:4.0,door:2.4,t:0.6}});
   {const p=toW(0,-0.6,-141,20,PA),g=grp(p[0],top+0.66,p[1],PA);box(1,0.6,0.8,M.marbleShade,0,0.3,0,g);const st=makePerson({chiton:'#8a6a3a',himation:'#b8862f',skin:'#7a5a3a',hair:'#3a2a18',female:true});st.scale.setScalar(0.8);st.position.y=0.6;g.add(st);
    const pom=new THREE.Mesh(new THREE.SphereGeometry(0.09,8,6),lam('#a8392b'));pom.position.set(0.28,1.45,0.2);g.add(pom);const hel=new THREE.Mesh(new THREE.SphereGeometry(0.13,8,6,0,TAU,0,Math.PI*0.6),M.bronze);hel.position.set(-0.3,1.45,0.2);g.add(hel);addCirc(p[0],p[1],0.6);}}
  // Atenea Prómacos de Fidias
  if(GLB.ok){const x=-62,z=-6;box(5.4,1.6,5.4,M.marble,x,AY+0.8,z);const g=grp(x,AY+1.6,z,-PA);
   const br={bronze:M.bronze,wood:M.bronze,crest:M.bronze};
   const st=makePerson({chiton:'#8a6a3a',himation:'#7d5f33',skin:'#8a6a3a',hair:'#8a6a3a',female:true,helmet:'attic',attrs:['G_aegis','P_spear','P_spearhead','P_shield'],attrRoles:br,scale:4.6});g.add(st);
   addBox(x,z,5.4,5.4,0);}
  else{const x=-62,z=-6;box(5.4,1.6,5.4,M.marble,x,AY+0.8,z);const g=grp(x,AY+1.6,z,-PA);g.scale.setScalar(1.15);
   const b=new THREE.Mesh(new THREE.CylinderGeometry(0.8,1.3,6.5,12),M.bronze);b.position.y=3.25;g.add(b);
   const h=new THREE.Mesh(new THREE.SphereGeometry(0.6,12,10),M.bronze);h.position.y=7.1;g.add(h);
   const hc=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.6,1.1),M.bronze);hc.position.y=7.8;g.add(hc);
   const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,10,6),M.bronze);sp.position.set(1.1,5,0.3);g.add(sp);
   const tip=new THREE.Mesh(new THREE.ConeGeometry(0.2,0.8,6),M.gold);tip.position.set(1.1,10.3,0.3);g.add(tip);
   const sh=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,0.15,18),M.bronze);sh.rotation.z=Math.PI/2;sh.position.set(-1.2,3.8,0);g.add(sh);
   addBox(x,z,5.4,5.4,0);}
  {const b=stoa({name:'Santuario de Ártemis Brauronia',x:-80,z:44,rot:Math.PI,len:38,depth:7,colH:4.2,colD:0.6});
   box(1.4,0.9,1.0,M.marbleShade,0,0.6+0.45,-2.2,b.g);const ar=makePerson({chiton:'#7a5a3a',himation:'#c9a24a',skin:'#7a5a3a',hair:'#3a2a18',female:true});ar.position.set(0,1.5,-2.2);b.g.add(ar);
   {const p=toW(0,-2.2,-80,44,Math.PI);addBox(p[0],p[1],1.4,1,Math.PI);}
   const cols=['#a8392b','#2f4c86','#c9a24a','#efe6d4','#6f8a4e','#7a3a5e','#d9874a'];
   for(let i=0;i<16;i++){const x=-17+i*2.2;const cl=new THREE.Mesh(new THREE.PlaneGeometry(1.5,2.2),lam(cols[i%cols.length],{side:THREE.DoubleSide}));cl.position.set(x,3.0,-2.62);b.g.add(cl);box(1.7,0.06,0.06,M.wood,x,4.15,-2.62,b.g);}
   for(let i=0;i<2;i++){const bear=new THREE.Group();bear.position.set(i?9:-9,0.6,-1.5);b.g.add(bear);box(0.8,0.6,1.1,lam('#e6dcc8'),0,0.5,0,bear);box(0.5,0.45,0.5,lam('#e6dcc8'),0,0.75,0.7,bear);}}
  {const x=-36,a=Math.PI,W=41,Dd=14,H=7,t=0.9,gy=minGround(x,52,W,Dd,a),g=grp(x,gy,52,a),wm=M.stone;const zz=52;
   box(W,0.6,Dd,M.limestone,0,0,0,g);addPlat(x,zz,W,Dd,a,gy+0.3);
   const W2=(x1,z1,x2,z2,h,y)=>{const len=Math.hypot(x2-x1,z2-z1);box(Math.abs(x2-x1)>0.01?len:t,h||H+2,Math.abs(z2-z1)>0.01?len:t,wm,(x1+x2)/2,(y!==undefined?y:-2)+(h||H+2)/2,(z1+z2)/2,g);if(y===undefined)wseg(x,zz,a,x1,z1,x2,z2,t/2);};
   W2(-W/2,-Dd/2,W/2,-Dd/2);W2(-W/2,-Dd/2,-W/2,Dd/2);W2(W/2,-Dd/2,W/2,Dd/2);W2(-W/2,Dd/2,-1.6,Dd/2);W2(1.6,Dd/2,W/2,Dd/2);W2(-1.6,Dd/2,1.6,Dd/2,H-3.4,3.4);
   for(let i=0;i<6;i++){const p=toW(-15+i*6,0,x,zz,a);addColumn(p[0],gy+0.3,p[1],0.35,H-0.3,a,'doric');}
   coffered(g,W-2*t,Dd-2*t,H-0.1);gableRoof(g,W+0.8,Dd+0.8,H,2.2,M.tile,wm,true);
   const br=M.bronze;for(let i=0;i<12;i++){const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.08,16),br);sh.rotation.x=Math.PI/2;sh.position.set(-18+i*3.2,3.2,-Dd/2+t/2+0.06);g.add(sh);}
   for(let i=0;i<5;i++){box(4,0.12,0.9,M.wood,-16+i*8,1.0,-Dd/2+t+0.5,g);box(4,0.12,0.9,M.wood,-16+i*8,2.0,-Dd/2+t+0.5,g);for(let k=0;k<4;k++){const v=new THREE.Mesh(PGEO.jar,br);v.scale.setScalar(0.8);v.position.set(-17.5+i*8+k*1.0,1.06,-Dd/2+t+0.5);g.add(v);}
     {const p=toW(-16+i*8,-Dd/2+t+0.5,x,zz,a);addBox(p[0],p[1],4,0.9,a,0.1);}}
   for(let i=0;i<10;i++){const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,3.2,5),M.wood);sp.position.set(12+i*0.35,1.7,-Dd/2+t+0.25);sp.rotation.z=0.1;g.add(sp);}
   footprints.push({x,z:zz,w:W,d:Dd,a,c:'#d6c6a6',name:'Calcoteca'});}
  {const x=14,z=-30;box(9,1.6,4.5,M.marble,x,AY+0.8,z);box(9.6,0.4,5.1,M.marbleShade,x,AY+1.7,z);box(3,0.6,1.2,M.marble,x,AY+0.3,z+3);addBox(x,z,9,4.5,0);} // altar de Atenea
  // cueva de Pan, en la ladera noroeste
  {const x=-100,z=-79,gy=terrainH(x,z-4);const g=grp(x,gy,z,Math.PI);
   const arch=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.6,3.6,10,1,true,-Math.PI/2,Math.PI),lam('#8f8576',{side:THREE.DoubleSide}));arch.rotation.z=Math.PI/2;arch.rotation.y=Math.PI/2;arch.position.set(0,1.6,0.5);g.add(arch);
   box(4,3.2,3,lam('#1a1512'),0,1.6,-1.2,g);for(let i=0;i<4;i++)box(0.5,0.4,0.15,M.dark,-1.6+i*1.05,3.6+R()*0.6,0.3,g);
   for(let i=0;i<7;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(0.8+R()*1.2,0),M.stone);r.position.set(rr(-5,5),rr(0,3),rr(-1,1));g.add(r);}
   addCirc(x,z-1,2.6);}
}

// Erecteion (421-406): bloque principal de 11,6 x 22,8 m, pórtico este de 6 columnas jónicas (6,58 m),
// pórtico norte con 4+2 columnas y pórtico de las Cariátides al sur. Local: +z = este, +x = norte.
function erechtheion(cx,cz){
  const a=Math.PI/2,W=11.6,L=22.8,base=0.9,gy=AY,g=grp(cx,gy,cz,a),t=0.7,hh=6.58,wm=M.marble;
  for(let i=0;i<3;i++){const ex=(2-i)*0.4,top=0.3*(i+1);box(W+ex*2,top+6,L+ex*2,M.marble,0,top-(top+6)/2,0,g);}
  addPlat(cx,cz,W+0.8,L+0.8,a,gy+base);
  const zE=L/2-3.2,zP=1.0,zV=-4.0;   // fachada este, tabique de la cella este, muro del vestíbulo oeste
  const wl=(x1,z1,x2,z2,h)=>{const len=Math.hypot(x2-x1,z2-z1),mx=(x1+x2)/2,mz=(z1+z2)/2;box(Math.abs(x2-x1)>0.01?len:t,h||hh,Math.abs(z2-z1)>0.01?len:t,wm,mx,base+(h||hh)/2,mz,g);wseg(cx,cz,a,x1,z1,x2,z2,t/2);};
  const xs=-W/2+t/2,xn=W/2-t/2,zw=-L/2+t/2;
  wl(xs,-L/2,xs,-8.6);wl(xs,-7.4,xs,zE);                 // muro sur, con la puerta de la escalera de las Cariátides
  wl(xn,-L/2,xn,-6.6);wl(xn,-4.4,xn,zE);                 // muro norte, con la gran puerta del pórtico norte
  wl(-W/2,zw,1.8,zw);wl(3.0,zw,W/2,zw);                  // muro oeste con puertecilla al Pandroseion
  wl(-W/2,zE,-1.3,zE);wl(1.3,zE,W/2,zE);box(2.6,hh-4.8,t,wm,0,base+4.8+(hh-4.8)/2,zE,g); // puerta este
  wl(-W/2,zP,W/2,zP);                                     // la cella de Atenea no comunica con la parte oeste
  wl(-W/2,zV,-3.6,zV);wl(-2.2,zV,2.2,zV);wl(3.6,zV,W/2,zV);// vestíbulo con dos puertas
  wl(0,zV,0,zP);
  for(const[x1,x2]of[[-3.6,-2.2],[2.2,3.6]])box(x2-x1,hh-2.6,t,wm,(x1+x2)/2,base+2.6+(hh-2.6)/2,zV,g);
  box(W-0.4,hh,0.3,wm,0,base+hh/2,zE-0.01,g).visible=false;
  coffered(g,W-2*t,zE-zP-t,base+hh-0.1).position.z=(zE+zP)/2;coffered(g,W-2*t,zP-(-L/2)-t,base+hh-0.1).position.z=(zP-L/2)/2;
  for(let i=0;i<6;i++){const p=toW(-W/2+0.55+i*(W-1.1)/5,L/2-0.5,cx,cz,a);addColumn(p[0],gy+base,p[1],0.345,6.58,a,'ionic');}
  const top=entablature(g,W,L,base+6.58,1.85,{ionic:true,friezeTex:TEX.eleusinian});
  coffered(g,W-0.3,3,base+6.58+0.6).position.z=L/2-1.5;
  gableRoof(g,W+0.7,L+0.7,top,1.5,M.marble,M.blue);acroteria(g,W,L,top,1.5);
  // cella este: Atenea Polias y la lámpara de Calímaco
  {box(2.2,0.9,1.6,M.marbleShade,0,base+0.45,zP+2.2,g);
   const st=makePerson({chiton:'#c98a2e',himation:'#e0b04a',skin:'#6b4a2a',hair:'#3a2a18',female:true});st.scale.setScalar(0.95);st.position.set(0,base+0.9,zP+2.2);g.add(st);
   const ae=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.36,0.3,10),M.gold);ae.position.set(0,base+0.9+1.42,zP+2.3);g.add(ae);
   const lx=1.6,lz=zP+4.6;box(0.5,1.1,0.5,M.bronze,lx,base+0.55,lz,g);const lamp=new THREE.Mesh(new THREE.SphereGeometry(0.28,12,8),M.gold);lamp.scale.y=0.5;lamp.position.set(lx,base+1.2,lz);g.add(lamp);
   const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.09,4.4,6),M.bronze);trunk.position.set(lx,base+3.5,lz);g.add(trunk);
   for(let i=0;i<7;i++){const lf=new THREE.Mesh(new THREE.ConeGeometry(0.16,1.3,4),M.bronze);lf.scale.z=0.3;const tt=i/7*TAU;lf.position.set(lx+Math.cos(tt)*0.5,base+5.7,lz+Math.sin(tt)*0.5);lf.rotation.set(Math.sin(tt)*1.1,0,-Math.cos(tt)*1.1);g.add(lf);}
   const fl=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));fl.scale.set(0.7,0.9,1);fl.position.set(lx,base+1.45,lz);g.add(fl);
   const p=toW(0,zP+2.2,cx,cz,a);addBox(p[0],p[1],2.2,1.6,a);const q=toW(lx,lz,cx,cz,a);addCirc(q[0],q[1],0.35);}
  // sala norte: altares de Poseidón-Erecteo, Butes y Hefesto, y pinturas de los Butadas
  for(let i=0;i<3;i++){const az=zV+1.0+i*1.2;box(1.3,0.95,0.8,wm,2.6,base+0.48,az,g);const p=toW(2.6,az,cx,cz,a);addBox(p[0],p[1],1.3,0.8,a);}
  for(let i=0;i<2;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.6),new THREE.MeshLambertMaterial({map:battleTex(30+i)}));m.position.set(xn-0.37,base+3.2,zV+1.2+i*2.2);m.rotation.y=-Math.PI/2;g.add(m);}
  // sala sur: el pozo de agua salada («mar de Erecteo»)
  {const wz=zV+2.4;const rim=new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,0.6,18,1,true),lam('#bdb3a0',{side:THREE.DoubleSide}));rim.position.set(-2.6,base+0.3,wz);g.add(rim);
   const w=new THREE.Mesh(new THREE.CircleGeometry(0.85,18),new THREE.MeshPhongMaterial({color:'#2a5468',shininess:90}));w.rotation.x=-Math.PI/2;w.position.set(-2.6,base+0.1,wz);g.add(w);const p=toW(-2.6,wz,cx,cz,a);addCirc(p[0],p[1],0.95);}
  // vestíbulo: entrada a la tumba de Cécrope, bajo el pórtico de las Cariátides
  box(1.6,1.8,0.2,lam('#1a1512'),-W/2+t+0.11,base+0.9,-7.2,g).rotation.y=Math.PI/2;
  // pórtico norte con las marcas del tridente
  {const pn=toW(W/2+3.3,-L/2+6.35,cx,cz,a),gn=grp(pn[0],gy,pn[1],a);box(6.6,0.9,10.7,M.marble,0,0.45-0.0,0,gn);addPlat(pn[0],pn[1],6.6,10.7,a,gy+0.9);
   for(let i=0;i<4;i++){const p=toW(W/2+6.0,-L/2+1.5+i*9.7/3,cx,cz,a);addColumn(p[0],gy+0.9,p[1],0.41,7.0,a,'ionic');}
   for(const zz of[-L/2+1.5,-L/2+11.2]){const p=toW(W/2+1.0,zz,cx,cz,a);addColumn(p[0],gy+0.9,p[1],0.41,7.0,a,'ionic');}
   const t2=entablature(gn,6.6,10.7,0.9+7.0,1.9,{ionic:true,friezeTex:TEX.eleusinian});coffered(gn,6.2,10.3,0.9+7.0+0.62);gableRoof(gn,7.3,11.4,t2,1.5,M.marble,M.blue,true);
   for(let i=0;i<3;i++){const hdisc=new THREE.Mesh(new THREE.CircleGeometry(0.16,10),lam('#1a1512'));hdisc.rotation.x=-Math.PI/2;hdisc.position.set(-0.6+i*0.45,0.92,-2.2+(i%2)*0.3);gn.add(hdisc);}
   box(1.0,0.3,1.0,M.marbleShade,-0.2,1.05,-2.0,gn).visible=false;
   box(2.4,0.18,0.12,lam('#4a3020'),W/2+0.16-W/2-3.3,0.95,0,gn).visible=false;}
  // pórtico de las Cariátides, sobre la tumba de Cécrope
  {const pc=toW(-W/2-1.75,-L/2+4.6,cx,cz,a),gc=grp(pc[0],gy,pc[1],a);box(3.5,1.77,5.1,M.marble,0,0.88,0,gc);addBox(pc[0],pc[1],3.5,5.1,a,0.2);
   const pos=[[-1.25,-2.1],[-1.25,-0.7],[-1.25,0.7],[-1.25,2.1],[0.6,-2.1],[0.6,2.1]];
   for(const[lx,lz]of pos){const k=makePerson({chiton:'#f0e8da',himation:'#e6dcc8',hair:'#e6dcc8',skin:'#efe5d4',female:true});k.scale.setScalar(1.18);k.position.set(lx,1.77,lz);k.rotation.y=-Math.PI/2;gc.add(k);
     const kal=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.15,0.28,10),M.marble);kal.position.set(lx,1.77+2.42,lz);gc.add(kal);}
   box(3.9,0.55,5.5,M.marble,0,1.77+2.56+0.27,0,gc);box(4.1,0.25,5.7,M.marbleShade,0,1.77+2.56+0.67,0,gc);}
  for(let i=0;i<4;i++){const p=toW(-W/2+1.6+i*(W-3.2)/3,-L/2-0.2,cx,cz,a);addColumn(p[0],gy+base+1.4,p[1],0.33,5.2,a,'ionic',true);}
  {const pw=toW(1,-L/2-8.5,cx,cz,a),gw=grp(pw[0],gy,pw[1],a),wm2=M.limestone;
   for(const[w,d,x,z]of[[16,0.6,0,-8],[0.6,16,-8,0],[0.6,16,8,0]]){box(w,1.3,d,wm2,x,0.65,z,gw);}
   wseg(pw[0],pw[1],a,-8,-8,8,-8,0.3);wseg(pw[0],pw[1],a,-8,-8,-8,8,0.3);wseg(pw[0],pw[1],a,8,-8,8,8,0.3);
   OLIVE_POS.push(toW(2,-L/2-9,cx,cz,a));
   box(2,0.8,2,M.marble,-4,0.4,-3,gw);}
  footprints.push({x:cx,z:cz,w:W,d:L,a,c:'#efe7d8',name:'Erecteion'});
}

// Propileos de Mnesicles (437-432): cuerpo central con fachadas dóricas hexástilas (columnas de 8,81 m al oeste),
// sala con dos filas de tres columnas jónicas, muro de cinco puertas; Pinacoteca al norte. Local: +z = oeste, +x = sur.
function propylaia(cx,cz){
  const a=-Math.PI/2,gy=AY,g=grp(cx,gy,cz,a),W=21,L=24.6;
  box(W+1,1.0,L+1,M.marble,0,-0.2,0,g);addPlat(cx,cz,W+1,L+1,a,gy+0.3);
  const xs=[-9.975,-6.345,-2.715,2.715,6.345,9.975];
  for(const x of xs){let p=toW(x,11.4,cx,cz,a);addColumn(p[0],gy+0.3,p[1],0.78,8.81,a,'doric');p=toW(x,-11.4,cx,cz,a);addColumn(p[0],gy+0.3,p[1],0.78,8.81,a,'doric');}
  for(const x of[-3.1,3.1])for(const z of[8.6,5.0,1.4]){const p=toW(x,z,cx,cz,a);addColumn(p[0],gy+0.3,p[1],0.52,10.25,a,'ionic');}
  const H=11.6;
  for(const s of[-1,1]){box(1.0,H,L-1,M.marble,s*(W/2-0.5),0.3+H/2,0,g);wseg(cx,cz,a,s*(W/2-0.5),-L/2+0.5,s*(W/2-0.5),L/2-0.5,0.5);}
  // muro de las cinco puertas
  const solid=[[-10.5,-8.7],[-7.3,-6.1],[-3.2,-2.1]];
  for(const[x1,x2]of solid)for(const s of[-1,1]){const a1=s*x1,a2=s*x2;box(Math.abs(a2-a1),H,1.3,M.marble,(a1+a2)/2,0.3+H/2,-2.5,g);wseg(cx,cz,a,a1,-2.5,a2,-2.5,0.65);}
  for(const[x1,x2,hh]of[[-2.1,2.1,7.4],[-6.1,-3.2,5.4],[3.2,6.1,5.4],[-8.7,-7.3,3.6],[7.3,8.7,3.6]])box(x2-x1,H-hh,1.3,M.marble,(x1+x2)/2,0.3+hh+(H-hh)/2,-2.5,g);
  const top=entablature(g,W+0.4,L,0.3+8.81,2.9,{ia:3.63});
  coffered(g,W-1,L-1,0.3+8.81+1.0);
  gableRoof(g,W+1.1,L+0.7,top,2.6,M.marble,M.blue);acroteria(g,W,L,top,2.6);
  // ala norte: Pinacoteca (10,75 x 9 m) con pórtico de tres columnas dóricas
  {const c=toW(-18,8.1,cx,cz,a),gp=grp(c[0],gy,c[1],a);
   {const wm=M.marbleShade,t=0.7,H=7.2,X0=-5,X1=4,Z=5.375;const W2=(x1,z1,x2,z2,h,y)=>{const len=Math.hypot(x2-x1,z2-z1);box(Math.abs(x2-x1)>0.01?len:t,h||H,Math.abs(z2-z1)>0.01?len:t,wm,(x1+x2)/2,(y||0)+(h||H)/2,(z1+z2)/2,gp);if(!y)wseg(c[0],c[1],a,x1,z1,x2,z2,t/2);};
    W2(X0,-Z,X0,Z);W2(X0,-Z,X1,-Z);W2(X0,Z,X1,Z);W2(X1,-Z,X1,0.3);W2(X1,2.1,X1,Z);W2(X1,0.3,X1,2.1,H-3.2,3.2);
    for(const z of[-2.6,4.0])box(0.25,1.4,1.0,M.dark,X1+0.01,3.4,z,gp);
    coffered(gp,X1-X0-2*t,2*Z-2*t,H-0.1).position.x=(X0+X1)/2;
    const pics=[[X0+t/2+0.03,-2.6,Math.PI/2],[X0+t/2+0.03,0,Math.PI/2],[X0+t/2+0.03,2.6,Math.PI/2],[-2.2,-Z+t/2+0.03,0],[1.2,-Z+t/2+0.03,0],[-2.2,Z-t/2-0.03,Math.PI],[1.2,Z-t/2-0.03,Math.PI]];
    pics.forEach((pp,i)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.6),new THREE.MeshLambertMaterial({map:battleTex(50+i)}));m.position.set(pp[0],3.4,pp[1]);m.rotation.y=pp[2];gp.add(m);box(2.4,0.12,0.06,lam('#6b4a2e'),pp[0],2.55,pp[1],gp).rotation.y=pp[2];});
    for(let i=0;i<4;i++){const z=-4+i*2.5;box(1.0,0.5,2.0,lam('#6b4a2e'),X0+t+0.6,0.55,z,gp);box(0.9,0.12,1.9,lam('#a8392b'),X0+t+0.6,0.86,z,gp);}
    {const p=toW(-18+X0+t+0.6,8.1,cx,cz,a);addBox(p[0],p[1],1.2,10,a,0.1);}}
   box(12,0.6,11.4,M.marble,1,0.0,0,gp);
   for(const z of[-3.6,0,3.6]){const p=toW(-11.6,8.1+z,cx,cz,a);addColumn(p[0],gy+0.3,p[1],0.5,5.85,a,'doric');}
   const t2=entablature(gp,12,11.4,0.3+5.85,1.8,{ia:3.6});gableRoof(gp,12.6,12,t2,1.5,M.tile,M.marbleShade);}
  // ala sur, abierta hacia el bastión de Nike
  {const c=toW(13.4,9,cx,cz,a),gs=grp(c[0],gy,c[1],a);
   box(0.9,7.2,9.5,M.marbleShade,2.4,3.6,0,gs);wseg(c[0],c[1],a,2.4,-4.75,2.4,4.75,0.45);box(5.5,7.2,0.9,M.marbleShade,0,3.6,-4.75,gs);wseg(c[0],c[1],a,-2.75,-4.75,2.75,-4.75,0.45);
   box(6,0.6,9.8,M.marble,0,0.0,0,gs);
   for(const z of[-3,0.2,3.4]){const p=toW(11.6,9+z,cx,cz,a);addColumn(p[0],gy+0.3,p[1],0.5,5.85,a,'doric');}
   const t2=entablature(gs,6,10,0.3+5.85,1.8,{ia:3.2});gableRoof(gs,6.6,10.6,t2,1.1,M.tile,M.marbleShade);}
  footprints.push({x:cx,z:cz,w:W,d:L,a,c:'#efe7d8',name:'Propileos'});
}

// ------------------------------------------------------------ ladera sur: teatro, Odeón, Asclepieion
function buildSouthSlope(){
  // teatro de Dioniso en su fase de madera: gradas (ikria) sobre la ladera
  {const mSeat=lam('#8a6a44'),mRise=lam('#a08660'),t0=-0.07,tl=Math.PI+0.14;
   for(let i=0;i<THEA.r1-THEA.r0;i++){const r=THEA.r0+i,top=THEA.h0+(i+1)*THEA.step;
     const ring=new THREE.Mesh(new THREE.RingGeometry(r,r+1,48,1,t0,tl),i%10===9?M.stone:mSeat);ring.rotation.x=-Math.PI/2;ring.position.set(THEA.x,top,THEA.z);ring.receiveShadow=true;scene.add(ring);
     const rise=new THREE.Mesh(new THREE.CylinderGeometry(r,r,THEA.step,48,1,true,Math.PI/2-0.07,tl),mRise);rise.position.set(THEA.x,top-THEA.step/2,THEA.z);rise.material.side=THREE.DoubleSide;scene.add(rise);}
   for(let k=1;k<6;k++){const t=Math.PI+k/6*Math.PI;for(let r=THEA.r0+1;r<THEA.r1;r+=2){const x=THEA.x+Math.cos(t)*r,z=THEA.z+Math.sin(t)*r;box(0.9,0.1,1.9,M.stone,x,terrainH(x,z)+0.04,z).rotation.y=-t+Math.PI/2;}}
   const orch=new THREE.Mesh(new THREE.CircleGeometry(THEA.r0,40),lam('#cdb993'));orch.rotation.x=-Math.PI/2;orch.position.set(THEA.x,THEA.h0+0.03,THEA.z);orch.receiveShadow=true;scene.add(orch);
   box(1.4,1,1.4,M.marble,THEA.x,THEA.h0+0.5,THEA.z);addCirc(THEA.x,THEA.z,1);
   const sk=grp(THEA.x,THEA.h0,THEA.z+16,0);box(24,6.2,5,M.wood,0,3.1,0,sk);addBox(THEA.x,THEA.z+16,24,5,0);
   for(const x of[-6,0,6])box(x?1.8:2.4,3.2,0.2,M.dark,x,1.6,-2.55,sk);
   for(const x of[-9,-3,3,9])box(2.6,2.2,0.15,lam('#3c5f7a'),x,4.4,-2.55,sk);
   box(25,0.5,6,lam('#6a4a2e'),0,6.4,0,sk);
   footprints.push({x:THEA.x,z:THEA.z,r:THEA.r1,c:'#a8865c',name:'Teatro'});}
  temple({name:'Templo antiguo de Dioniso',x:THEA.x-20,z:THEA.z+48,rot:Math.PI/2,W:8,L:13.4,nW:4,prostyle:true,colD:0.6,colH:4.6,cella:{w:7,l:8.5,oz:-1.8,door:2.2}});
  // Odeón de Pericles: sala cuadrada de 62,4 x 68,6 m con tejado piramidal y un bosque de columnas
  {const x=162,z=124,W=62.4,L=68.6,g0=minGround(x,z,W,L,0);let g1=-1e9;for(let i=-1;i<=1;i+=0.5)for(let j=-1;j<=1;j+=0.5)g1=Math.max(g1,terrainH(x+i*W/2,z+j*L/2));
   const avg=(g0+g1)/2,top=g1+7,wm=M.stone,t=1.2;
   box(W,0.6,L,M.limestone,x,avg,z);addPlat(x,z,W-2,L-2,0,avg+0.3);
   const wall=(ax,az,bx,bz)=>{const len=Math.hypot(bx-ax,bz-az);box(Math.abs(bx-ax)>0.1?len:t,top-g0+2,Math.abs(bz-az)>0.1?len:t,wm,(ax+bx)/2,(top+g0-2)/2,(az+bz)/2);addSeg(ax,az,bx,bz,t/2);};
   const x0=x-W/2,x1=x+W/2,z0=z-L/2,z1=z+L/2;
   wall(x0,z0,x1,z0);wall(x1,z0,x1,z1);wall(x0,z1,x-3,z1);wall(x+3,z1,x1,z1);wall(x0,z0,x0,z-3);wall(x0,z+3,x0,z1);
   const roof=new THREE.Mesh(new THREE.ConeGeometry(1,1,4,1),M.tile);roof.rotation.y=Math.PI/4;roof.scale.set((W/2+1.2)*Math.SQRT2,22,(L/2+1.2)*Math.SQRT2);roof.position.set(x,top+11,z);roof.castShadow=true;scene.add(roof);
   for(let i=0;i<9;i++)for(let j=0;j<10;j++){const cx=x0+W*(i+1)/10,cz=z0+L*(j+1)/11;const gh=floorAt(cx,cz);addColumn(cx,gh,cz,0.45,top-gh,0,'doric');}
   footprints.push({x,z,w:W,d:L,a:0,c:'#b9a684',name:'Odeón'});}
  // Asclepieion (420/419)
  temple({name:'Templo de Asclepio',x:-45,z:110,rot:Math.PI/2,W:6.2,L:10.5,nW:4,prostyle:true,colD:0.55,colH:4.3,cella:{w:5.6,l:6.6,oz:-1.2,door:2}});
  {const x=-30,z=110,gy=terrainH(x,z);box(4,1.2,2,M.marble,x,gy+0.6,z);addBox(x,z,4,2,0);
   const sp=grp(-52,terrainH(-52,96),96,0);box(3,2.6,2,lam('#1a1512'),0,1.3,0,sp);for(let i=0;i<5;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(0.9+R(),0),M.stone);r.position.set(rr(-3,3),rr(0,2.5),rr(-1.5,0.5));sp.add(r);}addCirc(-52,96,2);
   const tg=grp(-36,terrainH(-36,102),102,0);box(0.8,2.4,0.25,M.marble,0,1.2,0,tg);addCirc(-36,102,0.4);}
}

// ------------------------------------------------------------ Ágora (disposición según los planos de la Escuela Americana)
function herm(x,z,a){const g=grp(x,floorAt(x,z),z,a);box(0.32,1.3,0.3,M.marble,0,0.65,0,g);box(0.5,0.12,0.2,M.marble,0,1.15,0,g);const h=new THREE.Mesh(PGEO.head,lam('#efe5d4'));h.scale.setScalar(1.15);h.position.y=1.48;g.add(h);const b=new THREE.Mesh(PGEO.beard,lam('#6b4a2a'));b.position.set(0,1.38,0.08);g.add(b);
  // el falo esquemático, del mismo mármol, a media altura del pilar: protegía y traía buena suerte (y fue lo que se mutiló en el 415)
  {const f=new THREE.Mesh(new THREE.CylinderGeometry(0.028,0.032,0.13,8),M.marble);f.rotation.x=Math.PI/2-0.45;f.position.set(0,0.63,0.2);g.add(f);const t=new THREE.Mesh(new THREE.SphereGeometry(0.029,8,6),M.marble);t.position.set(0,0.66,0.26);g.add(t);const sc=new THREE.Mesh(new THREE.SphereGeometry(0.045,8,6),M.marble);sc.scale.set(1.2,0.8,0.7);sc.position.set(0,0.57,0.165);g.add(sc);}
  addCirc(x,z,0.3);}
function buildAgora(){
  // Stoa Basileios (17,72 x 7,18 m, ocho columnas dóricas)
  {const[x,z]=AL(-100,-112),s=stoa({name:'Stoa Basileios',x,z,rot:Math.PI/2,len:17.72,depth:7.18,colH:4.4,colD:0.58,nCols:8,inner:'doric',innerN:4});
   const ry=0.6+4.4+4.4*0.3+7.18*0.18;
   for(const e of[-1,1]){const f=makePerson({chiton:'#b5603a',himation:'#9a4a2e',skin:'#c97a4a',hair:'#6b3020',beard:e>0});f.scale.setScalar(0.55);f.position.set(e*8.9,ry,0.3);s.g.add(f);const f2=makePerson({chiton:'#b5603a',himation:'#c7864e',skin:'#c97a4a',hair:'#6b3020',female:e<0});f2.scale.setScalar(0.5);f2.position.set(e*8.9,ry,-0.4);f2.rotation.z=e*0.5;s.g.add(f2);}
   for(let i=0;i<8;i++){const p=AL(-92+(i%2)*2.5,-121+i*2.6);herm(p[0],p[1],Math.PI/2);}}
  // Stoa de Zeus Eleutherios (c. 430-425): 46,5 m con dos alas salientes coronadas por Nikes
  {const[x,z]=AL(-104,-68),a=Math.PI/2,s=stoa({name:'Stoa de Zeus Eleutherios',x,z,rot:a,len:26.5,depth:11.5,colH:5.8,colD:0.85,nCols:8,inner:'ionic',innerN:6});
   for(const sx of[-1,1]){const lc=sx*(13.25+5),wc=toW(lc,3.25,x,z,a),gw=grp(wc[0],s.gy,wc[1],a);
     box(10,0.6,18,M.marble,0,0.3-0.0,0,gw);addPlat(wc[0],wc[1],10,18,a,s.gy+0.6);
     box(0.8,6.8,18,M.stone,sx*4.6,0.6+3.4,0,gw);wseg(wc[0],wc[1],a,sx*4.6,-9,sx*4.6,8,0.4);
     box(10,6.8,0.8,M.stone,0,0.6+3.4,-8.6,gw);wseg(wc[0],wc[1],a,-5,-8.6,5,-8.6,0.4);
     for(let i=0;i<4;i++){const p=toW(lc-3.9+i*2.6,3.25+8.2,x,z,a);addColumn(p[0],s.gy+0.6,p[1],0.42,5.8,a,'doric');}
     const t2=entablature(gw,10,18,0.6+5.8,1.75,{ia:2.6});coffered(gw,9.4,17.4,0.6+5.8+0.6);gableRoof(gw,10.7,18.7,t2,1.6,M.tile,M.blue);
     const nk=makePerson({chiton:'#d9a93a',himation:'#d9a93a',skin:'#d9a93a',hair:'#b8862f',female:true});nk.scale.setScalar(0.6);nk.position.set(0,t2+1.6,9.4);gw.add(nk);}}
  // Hefestión (c. 450-415): 13,71 x 31,77 m, 6 x 13 columnas dóricas de 5,71 m, sobre el Colono Agoreo
  temple({name:'Hefestión',x:AL(-142,-52)[0],z:AL(-142,-52)[1],rot:Math.PI/2,W:13.71,L:31.77,nW:6,nL:13,colD:1.02,colH:5.71,entH:1.95,pedH:1.7,steps:3,stepH:0.36,roofMat:M.marble,sculpt:9,
    cella:{w:9.2,l:16.5,oz:-0.6,door:3,antis:4.2,antisCols:true,antisBack:true,backDoor:true}});
  blockBuilding({name:'Metroon (antiguo Bouleuterion)',x:AL(-112,-25)[0],z:AL(-112,-25)[1],rot:Math.PI/2,w:23.3,d:23.3,h:8,door:true});
  blockBuilding({name:'Bouleuterion nuevo',x:AL(-138,-22)[0],z:AL(-138,-22)[1],rot:0,w:22.5,d:17.5,h:9,door:true});
  // Tholos (c. 470): 18,3 m de diámetro, seis soportes interiores, tejado cónico de tejas romboidales
  {const[x,z]=AL(-110,18),r=9.15,gy=minGround(x,z,20,20,0),gap=0.27,h=5.2;
   const wl=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h+2,48,1,true,Math.PI/2+gap/2,TAU-gap),lam('#d8cbb0',{side:THREE.DoubleSide}));wl.position.set(x,gy+h/2-1,z);wl.castShadow=true;scene.add(wl);
   box(19.6,0.5,19.6,M.limestone,x,gy+0.0,z).geometry=new THREE.CylinderGeometry(r+0.4,r+0.4,0.5,48);addPlat(x,z,r*1.3,r*1.3,0,gy+0.25);
   const rf=new THREE.Mesh(new THREE.ConeGeometry(r+0.7,4.4,48,1),texMat(TEX.diamond,24,3));rf.position.set(x,gy+h+2.2,z);rf.castShadow=true;scene.add(rf);
   const ce=new THREE.Mesh(new THREE.CircleGeometry(r,40),lam('#6b4a2e',{side:THREE.DoubleSide}));ce.rotation.x=Math.PI/2;ce.position.set(x,gy+h,z);scene.add(ce);
   for(const[ex,ez]of[[-3.4,-4.6],[0,-5.4],[3.4,-4.6],[-3.4,4.6],[0,5.4],[3.4,4.6]])addColumn(x+ex,gy+0.25,z+ez,0.35,h-0.25,0,'doric');
   for(let i=0;i<40;i++){const t0=i/40*TAU,t1=(i+1)/40*TAU,mid=(t0+t1)/2;if(Math.abs(wrapA(mid-Math.PI/2))<gap)continue;addSeg(x+Math.sin(t0)*r,z+Math.cos(t0)*r,x+Math.sin(t1)*r,z+Math.cos(t1)*r,0.4);}
   box(0.6,3.2,2.6,M.dark,x+r+0.05,gy+1.6,z).visible=false;
   footprints.push({x,z,r,c:'#d6c6a6',name:'Tholos'});}
  // Monumento de los Héroes Epónimos: en el 386 está aún en su primer emplazamiento, al sur, junto a la Heliea (Agora XIV, lám. 5);
  // el monumento excavado delante del Metroon es de hacia el 330
  {const[x,z]=AL(-82,37),gy=terrainH(x,z);box(1.9,1.6,16.6,M.marble,x,gy+0.8,z);
   for(let i=0;i<10;i++){const k=makePerson({chiton:'#7d6236',himation:'#8a6a3a',hair:'#6b5230',skin:'#8a6a3a',beard:true});k.position.set(x,gy+1.6,z-7.4+i*1.65);k.rotation.y=Math.PI/2;scene.add(k);}
   for(let i=0;i<5;i++)box(0.08,1.1,1.3,lam('#e8dfc8'),x+1.0,gy+0.9,z-6+i*3);
   for(let i=0;i<9;i++){box(0.15,1.1,0.15,M.stone,x+2.6,gy+0.55,z-8.8+i*2.2);box(0.15,1.1,0.15,M.stone,x-2.6,gy+0.55,z-8.8+i*2.2);}
   box(0.1,0.1,17.8,M.stone,x+2.6,gy+1.05,z);box(0.1,0.1,17.8,M.stone,x-2.6,gy+1.05,z);
   addBox(x,z,5.4,18,0);footprints.push({x,z,w:1.9,d:16.6,a:0,c:'#efe7d8'});}
  // Altar de los Doce Dioses (9,35 x 9,8 m, parapeto con relieves)
  {const[x,z]=AL(-55,-98),gy=terrainH(x,z),pm=texMat(TEX.nike,3,1);
   box(9.35,1.15,0.35,pm,x,gy+0.58,z-4.9);box(9.35,1.15,0.35,pm,x,gy+0.58,z+4.9);box(0.35,1.15,9.8,pm,x+4.68,gy+0.58,z);
   box(0.35,1.15,3.4,pm,x-4.68,gy+0.58,z-3.2);box(0.35,1.15,3.4,pm,x-4.68,gy+0.58,z+3.2);
   addSeg(x-4.68,z-4.9,x+4.68,z-4.9,0.2);addSeg(x-4.68,z+4.9,x+4.68,z+4.9,0.2);addSeg(x+4.68,z-4.9,x+4.68,z+4.9,0.2);addSeg(x-4.68,z-4.9,x-4.68,z-1.5,0.2);addSeg(x-4.68,z+1.5,x-4.68,z+4.9,0.2);
   box(2.4,1.0,1.6,M.marble,x+1,gy+0.5,z);addBox(x+1,z,2.4,1.6,0);footprints.push({x,z,w:9.35,d:9.8,a:0,c:'#efe7d8'});}
  // Stoa Poikile (c. 460): al menos 46 x 12,6 m, dórica por fuera y jónica por dentro, con las pinturas
  {const[x,z]=AL(-55,-152);const titles=['Batalla de Énoe','Teseo contra las Amazonas','Caída de Troya','Batalla de Maratón'];
   stoa({name:'Stoa Poikile',x,z,rot:0,len:46,depth:12.6,colH:5.6,colD:0.9,nCols:13,inner:'ionic',innerN:6,
     paintings:(g,gy)=>{for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(9.5,3.2),new THREE.MeshLambertMaterial({map:battleTex(10+i)}));m.position.set(-16.5+i*11,3.9,-6.3+0.86);g.add(m);}}});}
  // Stoa Sur I (c. 430-420): 80,45 m, dieciséis comedores, muros de adobe sobre zócalo de piedra
  stoa({name:'Stoa Sur I',x:AL(-12,82)[0],z:AL(-12,82)[1],rot:Math.PI,len:80.45,depth:15,colH:4.6,colD:0.62,nCols:24,inner:'doric',innerN:12,rooms:{n:16,d:5.2},wallMat:mudMat(80,5)});
  // Recinto rectangular del suroeste (¿Heliea? ¿Eaceo?)
  {const H=TRIAL_H,e=enclosure({name:'Recinto rectangular',x:H.x,z:H.z,w:31,d:26.5,h:3.6,gap:5});
   for(let i=0;i<5;i++)box(16,0.45,0.9,M.wood,H.x-2,e.gy+0.22,H.z-8+i*3.2);
   box(1.6,1.2,1,M.stone,H.x-10,e.gy+0.6,H.z);
   {const kx=H.x+18,kz=H.z+6;box(0.3,1.8,1.1,M.marble,kx,e.gy+0.9,kz);for(let r=0;r<6;r++)box(0.32,0.05,0.9,M.dark,kx,e.gy+0.5+r*0.22,kz);addCirc(kx,kz,0.6);}}
  // fuente del sureste
  {const[x,z]=AL(38,76),a=Math.PI,gy=minGround(x,z,18.4,7,a),g=grp(x,gy,z,a);
   box(18.4,0.5,7,M.limestone,0,0.0,0,g);addPlat(x,z,18.4,7,a,gy+0.25);
   box(18.4,5,0.8,M.stone,0,2.5,-3.1,g);box(0.8,5,7,M.stone,-8.8,2.5,0,g);box(0.8,5,7,M.stone,8.8,2.5,0,g);
   wseg(x,z,a,-9.2,-3.1,9.2,-3.1);wseg(x,z,a,-8.8,-3.5,-8.8,3);wseg(x,z,a,8.8,-3.5,8.8,3);
   const w=new THREE.Mesh(new THREE.PlaneGeometry(16,2.6),new THREE.MeshPhongMaterial({color:'#2f6a85',shininess:90}));w.rotation.x=-Math.PI/2;w.position.set(0,0.55,-1.4);g.add(w);box(16,0.7,0.3,M.marble,0,0.35,-0.05,g);
   for(let i=0;i<3;i++){const p=toW(-5+i*5,3,x,z,a);addColumn(p[0],gy+0.25,p[1],0.38,4.2,a,'doric');}
   const t2=entablature(g,18.4,7,0.25+4.2,1.3,{ia:5});gableRoof(g,19,7.6,t2,1.2,M.tile,M.marbleShade,true);
   footprints.push({x,z,w:18.4,d:7,a,c:'#e4dac6',name:'Fuente'});}
  // la Ceca (Argyrokopeion), al este de la fuente: hornos y escorias de bronce, de hacia el 400 (Agora XIV, lám. 5)
  {const[x,z]=AL(64,80),e=enclosure({name:'Ceca',x,z,w:24,d:20,h:3.8,gap:3,rot:Math.PI});
   for(let i=0;i<3;i++){const fx=x-6+i*6,fz=z+4;box(1.8,1.4,1.8,lam('#7a6a5a'),fx,e.gy+0.7,fz);const f=new THREE.Mesh(new THREE.SphereGeometry(0.35,8,6),new THREE.MeshBasicMaterial({color:'#ff8a3a'}));f.position.set(fx,e.gy+1.2,fz-0.9);scene.add(f);addBox(fx,fz,1.8,1.8,0);}
   box(2.4,0.9,1.2,M.wood,x+5,e.gy+0.45,z-4);addBox(x+5,z-4,2.4,1.2,0);}
  // casa de Simón el zapatero y mojón del Ágora
  {const[x,z]=AL(-74,102);courtyardHouse(x,z,0,13,11,3.6,false,true);box(1.2,0.8,0.7,M.wood,x+3,terrainH(x+3,z+7)+0.4,z+7);addBox(x+3,z+7,1.2,0.7,0);}
  {const[x,z]=AL(-66,88),gy=terrainH(x,z);box(0.5,1.1,0.35,M.marble,x,gy+0.55,z);addCirc(x,z,0.3);}
  // puestos del mercado en la plaza abierta
  {const cols=['#b0462f','#c79a3a','#5e7a96','#8a6b3e','#e3d7bd','#6f8a4e'];
   for(let i=0;i<22;i++){const lx=rr(-20,85),lz=rr(-60,40);const[x,z]=AL(lx,lz);if(roadDist(x,z)<4)continue;if(Math.hypot(lx-10,lz+30)<5||Math.hypot(lx-40,lz+18)<6)continue;
    const gy=terrainH(x,z),r=R()*TAU,g=grp(x,gy,z,r);
    box(3,0.9,1.4,M.wood,0,0.45,0,g);for(const[px,pz]of[[-1.4,-0.8],[1.4,-0.8],[-1.4,0.8],[1.4,0.8]])box(0.1,2.4,0.1,M.wood,px,1.2,pz,g);try{atReg(x,z,gy,'puesto',1.6);}catch(e){}
    const cl=box(3.3,0.06,2,lam(pick(cols)),0,2.45,0,g);cl.rotation.x=0.12;
    for(let j=0;j<4;j++){const am=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,6),lam(pick(['#b5683f','#a3552f','#d1a35c','#7c9a4a'])));am.scale.y=1.4;am.position.set(-1+j*0.65,1.1,0);g.add(am);}
    addBox(x,z,3,1.4,r);}}
  // mesa de cambio de Pasión
  {const[x,z]=AL(40,-18),gy=terrainH(x,z);box(2.4,0.95,1.1,M.wood,x,gy+0.48,z);for(let i=0;i<9;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.02+R()*0.12,10),lam(i%3?'#cfd3d6':'#c9a24a'));c.position.set(x-0.9+R()*1.8,gy+1.0,z-0.3+R()*0.6);scene.add(c);}
   box(0.5,0.32,0.4,M.dark,x+0.9,gy+1.11,z);addBox(x,z,2.4,1.1,0);}
  // plátanos plantados por Cimón
  for(let i=0;i<26;i++){const t=i/26*TAU;const lx=35+Math.cos(t)*78,lz=-15+Math.sin(t)*62;const[x,z]=AL(lx,lz);if(roadDist(x,z)<4)continue;PLANES.push([x,z]);}
  // prisión (edificio de poros) y Eleusinion
  blockBuilding({name:'Prisión',x:-575,z:-190,rot:Math.PI/2,w:37,d:16.5,h:4.6,door:true,mat:M.limestone});
  {const e=enclosure({name:'Eleusinion',x:ELEUS.x,z:ELEUS.z,rot:0,w:32,d:42,h:3.2,gap:5,mapC:'#cdbf9f'});
   temple({name:'Templo del Eleusinion',x:ELEUS.x-3,z:ELEUS.z-4,rot:Math.PI/2,W:11.1,L:17.9,nW:4,prostyle:true,amphi:true,order:'ionic',colD:0.6,colH:5.4,cella:{w:10,l:11,door:2.4}});}
  // burros
  donkey(...AL(20,-40),0.4);donkey(...AL(58,10),2.1);donkey(-555,-160,1.2);donkey(PG.x+LW_DIR[0]*36+4,PG.z+LW_DIR[1]*36,2.4);
}
const PLANES=[];
// cuadrúpedo de Blender: cuerpo y patas con pivote en la cadera (para animar el paso); devuelve las patas [dl, di, tl, ti]
function animalGLB(prefix,g,coat,mane){const ro={coat:lam(coat),mane:lam(mane||'#2e2018')};
  for(const k of['_body','_mane','_tail','_head']){const p=glbPart(prefix+k,ro);if(p)g.add(p);}
  return['fl','fr','bl','br'].map(k=>{const p=glbPart(prefix+'_leg_'+k,ro);g.add(p);return p;});}
function donkey(x,z,a){
  if(GLB.ok){const g=grp(x,terrainH(x,z),z,a);animalGLB('A_donkey',g,'#7b6a5a','#3a3028');box(0.62,0.08,0.62,lam('#a3552f'),0,1.42,0.1,g);
    for(const s of[-1,1]){const bg=box(0.16,0.42,0.5,lam('#8a5a32'),s*0.36,1.12,0.1,g);bg.rotation.z=s*0.12;}addCirc(x,z,0.7);return;}
  const g=grp(x,terrainH(x,z),z,a),c=lam('#7b6a5a'),dk=lam('#4a3e34');
  box(0.5,0.55,1.2,c,0,1.0,0,g);for(const[px,pz]of[[-0.17,-0.45],[0.17,-0.45],[-0.17,0.45],[0.17,0.45]])box(0.1,0.75,0.1,dk,px,0.38,pz,g);
  box(0.25,0.5,0.25,c,0,1.35,0.6,g).rotation.x=0.6;box(0.24,0.24,0.5,c,0,1.55,0.85,g);box(0.06,0.25,0.06,dk,-0.08,1.75,0.75,g);box(0.06,0.25,0.06,dk,0.08,1.75,0.75,g);
  box(0.72,0.35,0.5,lam('#a3552f'),0,1.35,0,g);addCirc(x,z,0.7);}

// casa con patio: crujía al fondo (a veces con piso alto), ala lateral, muros del patio y puerta a la calle
function courtyardHouse(x,z,a,w,d,h,two,keep){
  if(!keep&&x<8000&&roadDist(x,z)<Math.hypot(w,d)/2+2.5)return;   // ninguna casa encima de un camino
  {const M=Math.max(w,d),hit=(x,z)=>footprints.some(f=>f.house&&Math.abs(f.x-x)<(Math.max(f.w||0,f.d||0)+M)/2+1.2&&Math.abs(f.z-z)<(Math.max(f.w||0,f.d||0)+M)/2+1.2);   // no levantar una casa encima de otra
   if(hit(x,z)){let ok=false;const rnd=forRng(((x*0.0731+z*0.0317)%1+1)%1);   // generador propio con semilla en la posición: siempre igual y sin tocar R()
    for(let k=0;k<12&&!ok;k++){const nx=x+(rnd()-0.5)*22,nz=z+(rnd()-0.5)*22;if(!hit(nx,nz)&&Math.abs(terrainH(nx,nz)-terrainH(x,z))<1.5&&terrainH(nx,nz)>0.5){x=nx;z=nz;ok=true;}}if(!ok)return;}}
  {const sl=(px,pz)=>{let lo=1e9,hi=-1e9;for(const[i,j]of[[-1,-1],[1,-1],[-1,1],[1,1],[0,0],[-1,0],[1,0],[0,-1],[0,1]]){const p=toW(i*w/2,j*d/2,px,pz,a),h=terrainH(p[0],p[1]);lo=Math.min(lo,h);hi=Math.max(hi,h);}return hi-lo;};
   const busy=(px,pz)=>ISLANDS.some(I=>I.arrive&&Math.hypot(px-I.arrive.x,pz-I.arrive.z)<60)||PLACES.some(q=>Math.hypot(px-q.x,pz-q.z)<Math.max(w,d))||footprints.some(f=>{const fw=f.r?f.r*2:(f.w||0),fd=f.r?f.r*2:(f.d||0);return Math.abs(f.x-px)<(Math.max(fw,fd)+Math.max(w,d))/2+1&&Math.abs(f.z-pz)<(Math.max(fw,fd)+Math.max(w,d))/2+1;});
   if(!keep&&sl(x,z)>2.5){let ok=false;for(let k=0;k<14&&!ok;k++){const nx=x+(R()-0.5)*30,nz=z+(R()-0.5)*30;if(sl(nx,nz)<=2.5&&terrainH(nx,nz)>0.5&&!busy(nx,nz)){x=nx;z=nz;ok=true;}}if(!ok)return;}}   // en ladera fuerte la casa quedaría medio enterrada
  const gy=minGround(x,z,w,d,a),g=grp(x,gy,z,a),rd=Math.min(5,d*0.42),sw=Math.min(4,w*0.32),wm=lam('#e8dfcc'),sm=M.limestone;
  box(w,h+2,rd,wm,0,h/2-1,-d/2+rd/2,g);box(w+0.1,0.9,rd+0.1,sm,0,0.45,-d/2+rd/2,g);
  if(two)box(w*0.6,2.8,rd,wm,-w*0.2,h+1.4,-d/2+rd/2,g);
  box(sw,h+1,d-rd,wm,-w/2+sw/2,(h-0.4)/2-0.5,rd/2,g);
  box(w-sw,2.6,0.45,wm,sw/2,1.3,d/2-0.22,g);box(0.45,2.6,d-rd,wm,w/2-0.22,1.3,rd/2,g);
  box(1.1,2.1,0.1,lam('#4a3324'),sw/2+1,1.05,d/2+0.02,g);
  gableRoof(g,rd+0.5,w+0.5,h,0.9,M.tile,wm,true).position.z=-d/2+rd/2;
  const r2=gableRoof(g,sw+0.5,d-rd+0.5,h-0.4,0.8,M.tile,wm);r2.position.x=-w/2+sw/2;r2.position.z=rd/2;
  addBox(x,z,w,d,a);footprints.push({x,z,w,d,a,c:'#b8a280',house:true});
}

// ------------------------------------------------------------ Cerámico: Dípilon, Puerta Sagrada, Pompeion, alfareros
function gatePt(G,s,l){return[G.x+G.ox*s-G.oz*l,G.z+G.oz*s+G.ox*l];}
function buildKerameikos(){
  const ang=Math.atan2(D.ox,D.oz),wm=lam('#c4b08c'),tm=lam('#b9a481');
  const bx=(s0,s1,l0,l1,h,mat)=>{const p=gatePt(D,(s0+s1)/2,(l0+l1)/2),gy=minGround(p[0],p[1],Math.abs(l1-l0),Math.abs(s1-s0),ang)-2;const m=box(Math.abs(l1-l0),h+2,Math.abs(s1-s0),mat||wm,p[0],gy+(h+2)/2,p[1]);m.rotation.y=ang;
    const c=[gatePt(D,s0,l0),gatePt(D,s1,l0),gatePt(D,s1,l1),gatePt(D,s0,l1)];for(let i=0;i<4;i++){const q=c[i],r=c[(i+1)%4];addSeg(q[0],q[1],r[0],r[1],0.2);}};
  // Dípilon: patio de unos 41 x 22 m entre cuatro torres, con puertas dobles
  for(const s of[-1,1]){bx(-41,3,s*11,s*14,9);bx(-2,6,s*10.5,s*18.5,13,tm);bx(-45,-37,s*10.5,s*18.5,13,tm);}
  for(const s0 of[2.5,-41.5]){bx(s0-1.5,s0+1.5,-11,-4.4,8);bx(s0-1.5,s0+1.5,4.4,11,8);bx(s0-1.5,s0+1.5,-1,1,8);
    const p=gatePt(D,s0,0),gy=terrainH(p[0],p[1]);const l=box(9,2,3,wm,p[0],gy+7,p[1]);l.rotation.y=ang;}
  footprints.push({x:gatePt(D,-19,0)[0],z:gatePt(D,-19,0)[1],w:28,d:44,a:ang,c:'#a89a82',name:'Dípilon'});
  // Puerta Sagrada con el arroyo Erídano
  {const a2=Math.atan2(SG.ox,SG.oz);for(const s of[-1,1]){const p=gatePt(SG,0,s*9),gy=terrainH(p[0],p[1])-2;const t=box(7,14,7,tm,p[0],gy+7,p[1]);t.rotation.y=a2;addCirc(p[0],p[1],4.2);}
   // el cauce del Erídano cruza la muralla por la Puerta Sagrada, perpendicular a ella
   const p=gatePt(SG,28,-2.5),g=grp(p[0],terrainH(p[0],p[1])+0.08,p[1],a2),w=new THREE.Mesh(new THREE.PlaneGeometry(3,72),new THREE.MeshPhongMaterial({color:'#2f6a85',shininess:80}));w.rotation.x=-Math.PI/2;g.add(w);}
  // Pompeion (c. 400): patio porticado donde se prepara la procesión
  {const c=gatePt(D,-75,-38),gy=minGround(c[0],c[1],22,50,ang),g=grp(c[0],gy,c[1],ang);
   for(const s of[-1,1]){box(0.8,5,50,M.stone,s*11,2.5,0,g);wseg(c[0],c[1],ang,s*11,-25,s*11,25);}
   box(22,5,0.8,M.stone,0,2.5,-25,g);wseg(c[0],c[1],ang,-11,-25,11,-25);box(8.5,5,0.8,M.stone,-6.75,2.5,25,g);box(8.5,5,0.8,M.stone,6.75,2.5,25,g);wseg(c[0],c[1],ang,-11,25,-2.5,25);wseg(c[0],c[1],ang,2.5,25,11,25);
   for(let i=0;i<10;i++)for(const s of[-1,1]){const p=toW(s*7.5,-21+i*4.7,c[0],c[1],ang);addColumn(p[0],gy,p[1],0.3,4.2,ang,'ionic');}
   for(const s of[-1,1]){const r=gableRoof(g,4.6,50,4.6,0.7,M.tile,M.stone);r.position.x=s*9;}
   footprints.push({x:c[0],z:c[1],w:22,d:50,a:ang,c:'#d6c6a6',name:'Pompeion'});}
  // barrio de alfareros y casa del banquete
  {const p=gatePt(D,-90,32);potX=p[0];potZ=p[1];
   for(let i=0;i<3;i++){const q=gatePt(D,-86+i*6,38);const k=new THREE.Mesh(new THREE.SphereGeometry(2,12,8,0,TAU,0,Math.PI/2),lam('#9a5b3a'));k.position.set(q[0],terrainH(q[0],q[1]),q[1]);k.castShadow=true;scene.add(k);addCirc(q[0],q[1],2);}
   for(let i=0;i<12;i++){const q=gatePt(D,-96+R()*10,24+R()*8);const am=new THREE.Mesh(new THREE.SphereGeometry(0.35,10,8),lam(pick(['#c46a3a','#1f1712','#b5603a'])));am.scale.y=1.5;am.position.set(q[0],terrainH(q[0],q[1])+0.5,q[1]);am.castShadow=true;scene.add(am);}
   footprints.push({x:potX,z:potZ,w:34,d:30,a:ang,c:'',reserve:true});
   const sp=gatePt(D,-92,64);SYMP.x=sp[0];SYMP.z=sp[1];
   blockBuilding({name:'Casa con andrón',x:SYMP.x,z:SYMP.z,rot:ang+Math.PI/2,w:14,d:12,h:5,door:true,socle:true,mat:lam('#e3d8c2')});
   const kp=toW(2.4,7.4,SYMP.x,SYMP.z,ang+Math.PI/2);const kr=new THREE.Mesh(new THREE.LatheGeometry(V2([[0.12,0],[0.22,0.04],[0.12,0.14],[0.2,0.35],[0.42,0.68],[0.46,0.84],[0.43,0.9]]),18),lam('#22170f'));kr.position.set(kp[0],terrainH(kp[0],kp[1]),kp[1]);kr.castShadow=true;scene.add(kr);addCirc(kp[0],kp[1],0.5);
   donkey(...gatePt(D,-80,26),1.2);}
  // tumbas a lo largo del Dromos y de la Vía Sacra, y túmulos del cementerio público
  {const n=170,im=new THREE.InstancedMesh(new THREE.BoxGeometry(0.7,1,0.2),M.marble,n),mm=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
   for(let i=0;i<n;i++){const G=i%3?DROMOS:SG,t=25+R()*(G===DROMOS?500:260),side=R()<0.5?-1:1,off=(G===DROMOS?24:6)+R()*10;const[x,z]=gatePt(G,t,side*off);const h=0.8+R()*1.4;
     q.setFromAxisAngle(up,Math.atan2(G.ox,G.oz)+Math.PI/2+rr(-0.2,0.2));p.set(x,terrainH(x,z)+h/2,z);s.set(1,h,1);mm.compose(p,q,s);im.setMatrixAt(i,mm);try{atReg(x,z,terrainH(x,z),'estelaf',0.8);}catch(e){}}
   im.castShadow=true;scene.add(im);
   for(let i=0;i<5;i++){const[x,z]=gatePt(DROMOS,120+i*85,(i%2?1:-1)*34);const mo=new THREE.Mesh(new THREE.SphereGeometry(7,16,8,0,TAU,0,Math.PI/2),lam('#9a8a62'));mo.scale.y=0.45;mo.position.set(x,terrainH(x,z)-0.3,z);scene.add(mo);addCirc(x,z,6.5);
     const[sx,sz]=gatePt(DROMOS,120+i*85,(i%2?1:-1)*26);box(2.2,2.2,0.3,M.marble,sx,terrainH(sx,sz)+1.1,sz).rotation.y=Math.atan2(DROMOS.ox,DROMOS.oz);addCirc(sx,sz,1.1);}}
}

// ------------------------------------------------------------ fuera del centro: Pnyx, Academia, Liceo, Cinosarges, Olimpieion
function buildOutskirts(){
  // Pnyx, fase II (c. 400): muro de contención curvo al norte y tribuna al sur; el público mira hacia el sur
  {const x=PNYX.x,z=PNYX.z+40,gy=Math.min(terrainH(x,z-2.5),terrainH(x,z),terrainH(x,z+2))-0.3;box(5,3,4,M.limestone,x,gy+1.5-0.5,z);
   for(let i=0;i<3;i++){box(3,0.5,1,M.limestone,x,gy+0.25+i*0.5,z-2.5+i*0.4);addPlat(x,z-2.5+i*0.4,3,1,0,gy+0.5+i*0.5);}
   addBox(x,z,5,4,0);addPlat(x,z,5,4,0,gy+1.5);
   for(let i=0;i<=34;i++){const t=Math.PI*(1.06+i/34*0.88),r=68;const px=x+Math.cos(t)*r,pz=z+8+Math.sin(t)*r*0.82;if(roadDist(px,pz)<6)continue;const h=terrainH(px,pz);   // paso abierto donde cruza un camino
     const b=box(6.4,3.2,2.2,M.limestone,px,h-0.4,pz);b.rotation.y=-t+Math.PI/2;const b2=box(6.4,1.6,1.2,M.limestone,px+Math.cos(t)*1.4,h+1.6,pz+Math.sin(t)*1.4*0.82);b2.rotation.y=-t+Math.PI/2;}
   footprints.push({x,z,w:5,d:4,a:0,c:'#efe7d8',name:'Bema'});}
  // Academia
  {const x=ACADEMY.x,z=ACADEMY.z,a=0.785,gy=minGround(x,z,44,44,a)-0.2,g=grp(x,gy,z,a);
   for(const[dx,dz,w,d]of[[0,-22,44,1],[-22,0,1,44],[22,0,1,44]]){box(w,4.5,d,M.stone,dx,2.25,dz,g);const p=toW(dx,dz,x,z,a);addBox(p[0],p[1],w,d,a);}
   box(17,4.5,1,M.stone,-13.5,2.25,22,g);box(17,4.5,1,M.stone,13.5,2.25,22,g);{const p1=toW(-13.5,22,x,z,a),p2=toW(13.5,22,x,z,a);addBox(p1[0],p1[1],17,1,a);addBox(p2[0],p2[1],17,1,a);}
   for(let i=0;i<9;i++){const lz=-19+i*4.75;for(const lx of[-18.5,18.5]){const p=toW(lx,lz,x,z,a);addColumn(p[0],gy,p[1],0.35,4.2,a,'doric');}}
   for(const s of[-1,1]){const r=gableRoof(g,5,44,4.4,0.8,M.tile,M.stone);r.position.x=s*20;}
   footprints.push({x,z,w:44,d:44,a,c:'#d6c6a6',name:'Academia'});
   const ex=new THREE.Mesh(new THREE.CylinderGeometry(4,4,0.6,20,1,false,0,Math.PI),M.marble);const p=toW(0,32,x,z,a);ex.position.set(p[0],terrainH(p[0],p[1])+0.3,p[1]);ex.rotation.y=a+Math.PI;scene.add(ex);
   const al=toW(-12,-34,x,z,a);box(2.4,1,1.4,M.marble,al[0],terrainH(al[0],al[1])+0.5,al[1]).rotation.y=a;addCirc(al[0],al[1],1.2); // altar de Prometeo
   OLIVE_POS.push(toW(10,40,x,z,a));}
  stoa({name:'Gimnasio del Liceo',x:LYCEUM.x,z:LYCEUM.z-14,rot:0,len:40,depth:9,colH:4.5,colD:0.55});
  stoa({name:'Gimnasio de Cinosarges',x:CYNO.x,z:CYNO.z-6,rot:0,len:30,depth:8,colH:4.2,colD:0.5});
  temple({name:'Santuario de Heracles',x:CYNO.x+28,z:CYNO.z+4,rot:Math.PI/2,W:6,L:9,nW:4,prostyle:true,colD:0.5,colH:3.8,cella:{w:5.4,l:5.4,oz:-1,door:2}});
  // Olimpieion de los Pisistrátidas, abandonado: cimientos de unos 41 x 108 m y tambores sueltos
  {const x=OLY.x,z=OLY.z,a=Math.PI/2,W=41,L=108,gy=minGround(x,z,W+4,L+4,a)-0.2,g=grp(x,gy,z,a);
   for(let i=0;i<2;i++){const ex=(1-i)*1.2,top=0.6*(i+1),hh=top+6;box(W+ex*2,hh,L+ex*2,M.limestone,0,top-hh/2,0,g);addPlat(x,z,W+ex*2,L+ex*2,a,gy+top);}
   const r=mulberry32(520);
   for(let i=0;i<8;i++)for(let j=0;j<21;j++){const outer=i===0||i===7||j===0||j===20,inner2=i===1||i===6||j===1||j===19;if(!outer&&!inner2)continue;if(r()<0.5)continue;const h=0.6+r()*3.6,p=toW(-W/2+2.4+i*(W-4.8)/7,-L/2+2.4+j*(L-4.8)/20,x,z,a);
     const c=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.25,h,18),M.limestone);c.position.set(p[0],gy+1.2+h/2,p[1]);c.castShadow=c.receiveShadow=true;scene.add(c);addCirc(p[0],p[1],1.25);}
   for(let i=0;i<8;i++){const p=toW(-W/2-5-r()*7,-L/2+r()*L,x,z,a);const d=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,1.4,16),M.limestone);d.rotation.z=Math.PI/2;d.rotation.y=r()*3;d.position.set(p[0],terrainH(p[0],p[1])+1.15,p[1]);d.castShadow=true;scene.add(d);addCirc(p[0],p[1],1.4);}
   footprints.push({x,z,w:W,d:L,a,c:'#c9b99c',name:'Olimpieion'});}
}

// ------------------------------------------------------------ murallas: zócalo de piedra y alzado de adobe
function buildWalls(){
  const segs=[],tw=[];
  for(let i=0;i<WN;i++){const a=wallPts[i],b=wallPts[(i+1)%WN];let gate=false;for(const k in gateSeg)if(gateSeg[k]===i)gate=true;
    if(gate){tw.push(a,b);continue;}segs.push([a,b]);if(i%5===0)tw.push(a);}
  const addLong=(sx,sz)=>{let px=sx,pz=sz;for(let i=0;i<80;i++){const nx=px+LW_DIR[0]*30,nz=pz+LW_DIR[1]*30;segs.push([[px,pz],[nx,nz]]);if(i%3===2)tw.push([nx,nz]);px=nx;pz=nz;if(nx<INNER.x-INNER.size/2||nz>INNER.z+INNER.size/2||terrainH(nx,nz)<0.8)break;}};
  addLong(LW[0][0],LW[0][1]);addLong(LW[1][0],LW[1][1]);
  const unit=new THREE.BoxGeometry(1,1,1);
  const soc=new THREE.InstancedMesh(unit,lam('#a89a82'),segs.length),mud=new THREE.InstancedMesh(unit,lam('#c2a882'),segs.length);
  const mm=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
  segs.forEach((sg,i)=>{const[a,b]=sg,mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2,len=Math.hypot(b[0]-a[0],b[1]-a[1]);const h0=Math.min(terrainH(a[0],a[1]),terrainH(b[0],b[1]),terrainH(mx,mz)),h1=Math.max(terrainH(a[0],a[1]),terrainH(b[0],b[1]));
    q.setFromAxisAngle(up,Math.atan2(b[0]-a[0],b[1]-a[1]));
    p.set(mx,(h1+3+h0-3)/2,mz);s.set(2.8,h1+3-(h0-3),len+0.6);mm.compose(p,q,s);soc.setMatrixAt(i,mm);
    p.set(mx,h1+3+2.6,mz);s.set(2.5,5.2,len+0.6);mm.compose(p,q,s);mud.setMatrixAt(i,mm);addSeg(a[0],a[1],b[0],b[1],1.4);});
  [soc,mud].forEach(m=>{m.castShadow=m.receiveShadow=true;scene.add(m);});
  const it=new THREE.InstancedMesh(unit,lam('#b9a481'),tw.length);
  tw.forEach((t,i)=>{const h=terrainH(t[0],t[1]);try{atReg(t[0],t[1],h,'wtower',4);}catch(e){}p.set(t[0],h+4,t[1]);q.identity();s.set(7,16,7);mm.compose(p,q,s);it.setMatrixAt(i,mm);addCirc(t[0],t[1],3.9);});
  it.castShadow=true;scene.add(it);
}

// ------------------------------------------------------------ lugares (estelas que se leen con E)
function definePlaces(){
  const P=(id,name,greek,text,xz,rot)=>place(id,name,greek,text,xz[0],xz[1],rot);
  P('partenon','Partenón','ΠΑΡΘΕΝΩΝ','Templo de Atenea Pártenos (la Virgen), construido entre 447 y 432 bajo Pericles, con el dinero de la Liga de Delos. Arquitectos: Ictino y Calícrates; escultor: Fidias. Mide 30,9 por 69,5 metros, con 8 columnas en las fachadas y 17 en los lados, de más de 10 metros de altura. Más que un templo de culto es un tesoro y un monumento a la victoria sobre los persas. Fíjate en los colores: frisos, frontones y molduras están pintados; nada de mármol desnudo.',[72,8],Math.PI/2);
  P('partenos','Atenea Pártenos','ΑΘΗΝΑ ΠΑΡΘΕΝΟΣ','La estatua de Fidias: casi doce metros de madera revestida de marfil (la piel) y más de una tonelada de oro (el vestido), que se puede desmontar y pesar en caso de necesidad. En su mano derecha sostiene una Nike, la Victoria alada; a sus pies, la serpiente sagrada. Delante hay un estanque poco profundo de agua.',toW(0,12,32,13,Math.PI/2),Math.PI/2);
  P('archaios','Cimientos del templo antiguo','ΑΡΧΑΙΟΣ ΝΕΩΣ','Entre el Erecteion y el Partenón se ven los cimientos del viejo templo de Atenea, de época de los Pisistrátidas, incendiado por los persas en el 480. Si parte del edificio siguió en pie durante años es una cuestión discutida. Las columnas y entablamentos de los templos quemados se empotraron en la muralla norte de la Acrópolis, donde se ven desde el Ágora como recuerdo de la destrucción.',[-12,0],0);
  P('erecteion','Erecteion','ΕΡΕΧΘΕΙΟΝ','Templo de varios cultos, terminado hacia el 406: Atenea Polias, Poseidón, Erecteo y Cécrope. El terreno tiene un desnivel de unos 3 metros, por eso el edificio tiene pórticos a alturas distintas. Bajo el pórtico de las Cariátides está la tumba de Cécrope, el primer rey; en el pórtico norte se enseñan las marcas del tridente de Poseidón. El friso es de piedra gris de Eleusis con figuras de mármol blanco añadidas.',toW(0,16,-18,-34,Math.PI/2),Math.PI/2);
  P('tesoro','El tesoro del Partenón','ΟΠΙΣΘΟΔΟΜΟΣ','La sala oeste del Partenón, con cuatro columnas jónicas, no comunica con la de la estatua. Aquí y en el pórtico trasero se guardan los tesoros de Atenea y de los otros dioses: coronas de oro, copas (fiálai) de oro y plata, armas de gala, monedas. Cada año los tesoreros hacen inventario y lo graban en piedra; por eso sabemos, objeto por objeto, qué había aquí.',toW(0,-15,32,13,Math.PI/2),Math.PI/2);
  P('polias','Atenea Polias y la lámpara de oro','ΑΘΗΝΑ ΠΟΛΙΑΣ','En la sala este del Erecteion está la imagen más sagrada de Atenas: una vieja estatua de madera de olivo de Atenea, que se decía caída del cielo. A ella se ofrece el peplo en las Panateneas. Delante arde día y noche una lámpara de oro obra de Calímaco: se llena de aceite una vez al año, y su humo sale por una palmera de bronce que hace de chimenea.',toW(-2.6,5.6,-18,-34,Math.PI/2),Math.PI/2);
  P('tridente','El mar de Erecteo y las marcas del tridente','ΘΑΛΑΣΣΑ ΕΡΕΧΘΗΙΣ','En la parte oeste del Erecteion hay altares de Poseidón-Erecteo, de Butes y de Hefesto, y pinturas de la familia sacerdotal de los Butadas. Hay también un pozo de agua salada, el «mar de Erecteo», que según se dice suena como el oleaje cuando sopla el viento del sur. En la roca bajo el pórtico norte se enseñan las marcas que dejó el tridente de Poseidón en su disputa con Atenea; por eso el techo del pórtico tiene una abertura.',toW(-0.2,-6.2,-18,-34,Math.PI/2),Math.PI/2);
  P('pinacoteca','Pinacoteca','ΠΙΝΑΚΟΘΗΚΗ','El ala norte de los Propileos guarda cuadros pintados sobre tabla. Pausanias vio, entre otros, a Diomedes y Odiseo llevándose el Paladio de Troya, a Orestes matando a Egisto, el sacrificio de Políxena y a Aquiles entre las hijas de Licomedes en Esciros, algunos atribuidos a Polignoto. Por su forma, con la puerta descentrada, muchos piensan que era también una sala de banquetes con lechos.',[-110,-12],0);
  P('brauronion','Santuario de Ártemis Brauronia','ΒΡΑΥΡΩΝΙΟΝ','Sucursal en la Acrópolis del santuario de Ártemis en Braurón, en la costa del Ática. A la diosa se le ofrecen sobre todo vestidos y telas, que los inventarios describen uno por uno. En Braurón, niñas atenienses servían a la diosa haciendo de «osas» (árktoi) antes de casarse; Aristófanes lo recuerda en Lisístrata.',[-80,38],0);
  P('calcoteca','Calcoteca','ΧΑΛΚΟΘΗΚΗ','El almacén de bronce de la Acrópolis: armas, escudos, proyectiles, vasos y otros objetos de bronce que pertenecen a Atenea o se guardan para la ciudad. Sus inventarios del siglo IV se conservan en inscripciones.',[-30,43],0);
  P('olivo','El olivo de Atenea','ΜΟΡΙΑ','Según el mito, Atenea hizo brotar aquí el primer olivo al disputarse el Ática con Poseidón. Crece en el Pandroseion, el patio al oeste del Erecteion. De este árbol descienden los olivos sagrados (moriai) del Ática, cuyo aceite premia a los vencedores de las Panateneas. Arrancar uno puede costar el destierro.',toW(9,-20,-18,-34,Math.PI/2),0);
  P('promacos','Atenea Prómacos','ΑΘΗΝΑ ΠΡΟΜΑΧΟΣ','«La que combate en primera línea». Estatua de bronce de Fidias, de unos nueve metros. Los marineros que doblan el cabo Sunion dicen que ven brillar al sol la punta de su lanza.',[-66,2],-Math.PI/2);
  P('propileos','Propileos','ΠΡΟΠΥΛΑΙΑ','La entrada monumental a la Acrópolis, obra de Mnesicles (437-432). Por el paso central sube la procesión de las Panateneas con los animales del sacrificio. El techo de mármol está pintado de azul con estrellas doradas. En el ala norte, la Pinacoteca guarda cuadros. La obra quedó sin terminar al estallar la guerra del Peloponeso.',[-90,6],Math.PI/2);
  P('areopago','Areópago','ΑΡΕΙΟΣ ΠΑΓΟΣ','La colina de Ares. Aquí se reúne el antiguo consejo formado por todos los ex arcontes, que conservan el cargo de por vida. Desde las reformas de Efialtes (462) ha perdido casi todo su poder político, pero sigue juzgando los homicidios. Según el mito, aquí fue juzgado Orestes, absuelto por el voto de Atenea.',[AREO.x,AREO.z],0);
  P('pan','Cueva de Pan','ΠΑΝΟΣ ΣΠΗΛΑΙΟΝ','Una gruta en la ladera norte de la Acrópolis. Según Heródoto, antes de Maratón el dios Pan se apareció al corredor Filípides y se quejó de que los atenienses no lo honraban. Tras la victoria le dedicaron esta cueva, con sacrificios y una carrera de antorchas cada año. Muy cerca hay otras grutas sagradas de Apolo y de Zeus.',[-100,-86],Math.PI);
  P('basileios','Stoa Basileios','ΣΤΟΑ ΒΑΣΙΛΕΙΟΣ','El pórtico del arconte rey, el magistrado encargado de los asuntos religiosos. Aquí se exponen las leyes de Solón y de Dracón, revisadas y grabadas de nuevo tras el 403, y aquí juran los magistrados sobre una gran piedra. En este pórtico Sócrates respondió a la acusación de impiedad en el 399; Platón sitúa aquí el comienzo del Eutifrón. Sobre el tejado hay figuras de terracota: Teseo arrojando a Escirón al mar y la Aurora raptando a Céfalo.',AL(-90,-104),Math.PI/2);
  P('poikile','Stoa Poikile','ΣΤΟΑ ΠΟΙΚΙΛΗ','El «pórtico pintado». Sus grandes tablas de madera, obra de Polignoto, Micón y Paneno, muestran la batalla de Énoe, a Teseo contra las Amazonas, la caída de Troya y la batalla de Maratón. Es un lugar de paseo y conversación: aquí se reúnen filósofos, comerciantes y curiosos.',AL(-55,-142),0);
  P('bouleuterion','Bouleuterion','ΒΟΥΛΕΥΤΗΡΙΟΝ','Sede del Consejo de los Quinientos, construida a finales del siglo V detrás del viejo edificio del Consejo. Dentro, los consejeros se sientan en gradas frente a la tribuna.',AL(-122,-12),0);
  P('metroon','Metroon (antiguo Bouleuterion)','ΜΗΤΡΩΙΟΝ','El viejo edificio del Consejo, de hacia el 500, ahora dedicado a la Madre de los dioses. Desde finales del siglo V guarda el archivo de la ciudad: leyes, decretos, cuentas y actas, en papiro y en tablillas. Cualquier ciudadano puede pedir consultarlos a los esclavos públicos que los custodian.',AL(-98,-14),Math.PI/2);
  P('eponimos','Monumento de los Héroes Epónimos','ΕΠΩΝΥΜΟΙ','Diez estatuas de bronce de los héroes que dan nombre a las diez tribus de Clístenes: Erecteo, Egeo, Pandión, Leonte, Acamante, Eneo, Cécrope, Hipotoonte, Áyax y Antíoco. En los tablones de su base se cuelgan los avisos públicos: leyes propuestas, convocatorias de juicios, listas de reclutamiento. Es el tablón de anuncios de la democracia. Hacia el 330 lo trasladarán frente al Metroon, donde lo encontraron los arqueólogos; ahora, en el 386, está aquí, al sur de la plaza, según la reconstrucción de Travlos (Agora XIV, lámina 5), que lo marca con interrogante.',AL(-76,26),Math.PI/2);
  P('doce','Altar de los Doce Dioses','ΒΩΜΟΣ ΤΩΝ ΔΩΔΕΚΑ ΘΕΩΝ','Fundado por Pisístrato el Joven hacia el 522. Es el punto cero de Atenas: desde aquí se miden las distancias a todas partes del Ática. También es un asilo: quien se refugia junto a él suplicando queda bajo la protección de los dioses.',AL(-63,-104),0);
  P('hefestion','Hefestión','ΗΦΑΙΣΤΕΙΟΝ','Templo de Hefesto, dios del fuego y la forja, y de Atenea Ergane, patrona de los artesanos. Mide 13,7 por 31,8 metros, con 6 por 13 columnas dóricas. Domina el Ágora desde la colina del Colono Agoreo, rodeado de talleres de bronce y de cerámica. Se empezó hacia 450 y se terminó hacia 415.',AL(-122,-44),Math.PI/2);
  P('peribolos','Recinto rectangular','ΗΛΙΑΙΑ;','Un gran recinto sin techo de unos 31 por 26,5 metros, con muros de mampostería poligonal. Los excavadores lo identificaron con la Heliea, el mayor tribunal, pero ellos mismos lo presentaron solo como una hipótesis. Hoy muchos piensan que era el Eaceo, el santuario del héroe Éaco, que una ley del 374/373 convirtió en granero. En el juego se usa como tribunal.',AL(-45,50),Math.PI/2);
  P('kleroterion','Kleroterion','ΚΛΗΡΩΤΗΡΙΟΝ','La máquina de sortear. Cada ciudadano tiene una placa de bronce con su nombre (pinakion) que se inserta en las ranuras de esta piedra. Un tubo deja caer al azar bolas blancas y negras: cada bola decide si una fila entera de nombres es elegida o no. Así se escogen jurados y magistrados sin que nadie pueda hacer trampa.',AL(-45,69),Math.PI/2);
  P('horos','Mojón del Ágora','ΗΟΡΟΣ ΕΙΜΙ ΤΕΣ ΑΓΟΡΑΣ','La inscripción dice: «Soy el límite del Ágora». Este mojón se encontró en su sitio original, junto a la casa de Simón. Dentro de estos límites el espacio es sagrado y público. Los que han cometido ciertos delitos tienen prohibido entrar: quedan apartados de la vida de la ciudad.',AL(-63,91),Math.PI/2);
  P('simon','Casa de Simón el zapatero','ΣΙΜΩΝΟΣ','Una casa modesta en la esquina suroeste del Ágora. Los arqueólogos encontraron aquí clavos de botas, ojales de hueso y la base de una copa con el nombre «de Simón». Diógenes Laercio cuenta que Sócrates visitaba el taller del zapatero Simón para conversar, y Jenofonte, que los jóvenes que aún no podían entrar en el Ágora se reunían en talleres junto a ella.',AL(-80,112),0);
  P('ceca','La Ceca','ΑΡΓΥΡΟΚΟΠΕΙΟΝ','El taller de la moneda. Los arqueólogos lo identifican así por los hornos, las escorias de bronce y los cospeles (los discos de metal sin acuñar) que encontraron dentro; no se sabe si aquí se acuñaba también la plata de las lechuzas. En el 406, en lo peor de la guerra, Atenas tuvo que acuñar monedas de bronce bañadas en plata, y Aristófanes se burló de ellas en Las ranas: la ciudad, dice, trata a sus mejores ciudadanos como a esa moneda falsa.',AL(64,66),Math.PI);
  P('fuente','Fuente del sureste','ΚΡΗΝΗ','Una fuente pública del siglo VI, quizá la famosa Eneacruno («nueve caños») de los Pisistrátidas, aunque la identificación es discutida. Aquí las mujeres y los esclavos llenan las hidrias cada día: es uno de los pocos lugares donde las mujeres atenienses se encuentran y conversan fuera de casa.',AL(38,68),Math.PI);
  P('eleusinion','Eleusinion de la ciudad','ΕΛΕΥΣΙΝΙΟΝ','Santuario de Deméter y de su hija Core (Perséfone), en la ladera junto a la Vía Panatenaica. Aquí se guardan los objetos sagrados de los Misterios de Eleusis cuando llegan a Atenas antes de la gran procesión de otoño. También se exponen las estelas con los bienes confiscados a los acusados de profanar los Misterios en el 415.',[ELEUS.x+19,ELEUS.z+6],Math.PI/2);
  P('bema','Bema de la Pnyx','ΒΗΜΑ','La tribuna de los oradores. En esta fase de la Pnyx (desde hacia el 400) el público se sienta sobre una terraza sostenida por un gran muro curvo al norte y mira hacia la tribuna, al sur. Quien sube a hablar lleva una corona de mirto: mientras habla, su persona es inviolable.',[PNYX.x+5,PNYX.z+34],Math.PI);
  P('teatro','Teatro de Dioniso','ΘΕΑΤΡΟΝ ΔΙΟΝΥΣΟΥ','Aquí se estrenaron las tragedias de Esquilo, Sófocles y Eurípides y las comedias de Aristófanes. Las gradas son todavía de madera (ikria) sobre la ladera de la Acrópolis; caben miles de espectadores. En el centro de la orquesta, donde canta y danza el coro, está el altar de Dioniso. Detrás, la escena de madera con sus tres puertas.',[THEA.x-22,THEA.z+12],0);
  P('odeion','Odeón de Pericles','ΩΙΔΕΙΟΝ','Una enorme sala cuadrada de unos 62 por 68 metros, cubierta por un tejado en forma de pirámide sostenido por un bosque de columnas. Se decía que imitaba la tienda del rey persa Jerjes y que se construyó con mástiles de las naves persas capturadas. Aquí se celebran los concursos musicales de las Panateneas y los poetas presentan sus obras antes de las Dionisias.',[162,166],0);
  P('asklepieion','Santuario de Asclepio','ΑΣΚΛΗΠΙΕΙΟΝ','Asclepio, el dios médico de Epidauro, llegó a Atenas en el 420/419, en plena guerra y tras la peste. Lo trajo un particular, Telémaco, cuya estela cuenta la fundación; el poeta Sófocles acogió al dios en su casa mientras se construía el santuario. Los enfermos duermen aquí esperando que el dios los cure en sueños y dejan exvotos con la parte del cuerpo sanada.',[-34,104],0);
  P('dipilon','Puerta del Dípilon','ΔΙΠΥΛΟΝ','La «puerta doble», la mayor de Atenas: un patio de unos 40 por 22 metros entre cuatro torres, con una puerta doble a cada lado, para atrapar a los atacantes. Por aquí entran los viajeros de Eleusis, Beocia y el Peloponeso, y de aquí parte la procesión de las Panateneas.',gatePt(D,-48,6),0);
  P('pompeion','Pompeion','ΠΟΜΠΕΙΟΝ','Edificio con patio porticado entre el Dípilon y la Puerta Sagrada, construido hacia el 400. Aquí se prepara la procesión (pompé) de las Panateneas y se guarda el material ritual. Tras la fiesta, los ciudadanos comen aquí la carne de los sacrificios.',gatePt(D,-75,-24),0);
  P('ceramico','Cementerio del Cerámico','ΚΕΡΑΜΕΙΚΟΣ','Fuera de las murallas, a lo largo del Dromos hacia la Academia y de la Vía Sacra hacia Eleusis, se alinean las tumbas: estelas pintadas, vasos de mármol y relieves de despedida. En los túmulos del cementerio público se entierra a los caídos en la guerra. Pericles pronunció aquí su famoso discurso fúnebre en el 431.',gatePt(DROMOS,60,14),0);
  P('academia','La Academia','ΑΚΑΔΗΜΕΙΑ','Un gimnasio con bosque sagrado dedicado al héroe Academo, a más de un kilómetro y medio del Dípilon. Hay pistas para correr, una palestra, el altar de Prometeo, de donde parten carreras de antorchas, y olivos sagrados de Atenea. Platón ha comprado un jardín junto a él para su escuela, que tomará el nombre del lugar.',[ACADEMY.x+30,ACADEMY.z+40],0);
  P('liceo','Liceo','ΛΥΚΕΙΟΝ','Gimnasio junto al santuario de Apolo Liceo, a orillas del Iliso. Aquí entrenan los jóvenes, se pasa revista a la caballería y enseñaban los sofistas. Sócrates venía a menudo a conversar. Isócrates tiene su escuela muy cerca.',[LYCEUM.x+14,LYCEUM.z+4],0);
  P('olimpieion','Olimpieion','ΟΛΥΜΠΙΕΙΟΝ','El templo de Zeus Olímpico, empezado por los hijos del tirano Pisístrato hacia el 520 para ser el mayor de Grecia y abandonado al caer la tiranía. Casi ciento cuarenta años después solo quedan los cimientos y algunos tambores de columna. La democracia no quiso terminar la obra de los tiranos: no se acabará hasta el emperador Adriano, en el 132 d.C.',[OLY.x-60,OLY.z+8],-Math.PI/2);
  P('cinosarges','Cinosarges','ΚΥΝΟΣΑΡΓΕΣ','Gimnasio y santuario de Heracles, al sureste de la ciudad, cerca del río Iliso. Tradicionalmente era el lugar de ejercicio de los nóthoi, hijos de padre ateniense y madre extranjera; se cuenta que Temístocles entrenaba aquí. Antístenes enseña en él.',[CYNO.x-10,CYNO.z+5],0);
}

// ------------------------------------------------------------ antorchas
function buildTorches(){
  for(const k in GATES){const G=GATES[k];for(const sg of[-1,1]){const[x,z]=gatePt(G,-6,sg*(k==='dipylon'?7:9));addTorch(x,z,2.8);}}
  const L=[[-58,-10],[-58,6],[72,2],[72,24],[-6,-30],[-6,-38],[THEA.x-9,THEA.z+13],[THEA.x+9,THEA.z+13],[150,166],[-40,104],[PNYX.x-3,PNYX.z+36],[PNYX.x+3,PNYX.z+36],
    AL(-92,-104),AL(-92,-120),AL(-90,-56),AL(-90,-80),AL(-97,18),AL(-69,63.6),AL(-69,72.4),AL(-32,-144),AL(-78,-144),AL(-50,72),AL(25,72),AL(36,-20),AL(-98,-25),
    [-565,-197],[-565,-179],[ELEUS.x+17,ELEUS.z-3],[ELEUS.x+17,ELEUS.z+3],[potX+3,potZ+3],[OLY.x-55,OLY.z],[ACADEMY.x+12,ACADEMY.z+32],[LYCEUM.x+12,LYCEUM.z-6],[CYNO.x-6,CYNO.z+0.5],[CYNO.x+6,CYNO.z+0.5]];
  L.forEach(p=>addTorch(p[0],p[1]));
  {const p1=toW(-2,7.4,SYMP.x,SYMP.z,0),p2=toW(2,7.4,SYMP.x,SYMP.z,0);}
  TORCH_SPOTS.slice(0,110).forEach(p=>addTorch(p[0],p[1],2.1));
}

// ------------------------------------------------------------ personajes y paseantes
function placeNPCs(){
  const sympDoor=toW(-2.2,7.6,SYMP.x,SYMP.z,Math.atan2(D.ox,D.oz)+Math.PI/2);
  const pos={
    pritano:[...AL(-97,21),-Math.PI/2],ciudadano:[PNYX.x+4,PNYX.z+34,Math.PI],dicasta:[...AL(-64,66),Math.PI/2],carcelero:[-563,-186,Math.PI/2],
    platon:[ACADEMY.x+14,ACADEMY.z+28,0.785],isocrates:[LYCEUM.x+6,LYCEUM.z+2,0],lisias:[...AL(-89,-68),Math.PI/2],manes:[...AL(10,-30),0],
    alfarero:[potX,potZ,0],sacerdotisa:[-3.4,-31,Math.PI/2],aristofanes:[THEA.x+3,THEA.z+4,Math.PI],hoplita:[PG.x+LW_DIR[0]*26,PG.z+LW_DIR[1]*26,0],
    pasion:[...AL(40,-19.6),0],filina:[sympDoor[0],sympDoor[1],Math.atan2(D.ox,D.oz)+Math.PI/2],antistenes:[CYNO.x+2,CYNO.z+1.6,0]
  };
  Object.assign(pos,{platonakis:[ACADEMY.x+18,ACADEMY.z+32,1.3],orfeotelesta:[ELEUS.x+21,ELEUS.z+8,Math.PI/2],abuela:[...AL(30,67),0],enfermo:[-37,114,Math.PI/2],iniciada:[ELEUS.x+6,ELEUS.z+12,Math.PI/2]},NPC_POS);
  NPCS.forEach(n=>{const[x,z,r]=pos[n.id];const g=makePerson(dressLook(n.look,n.title));const y=floorAt(x,z);g.position.set(x,y,z);g.rotation.y=r;scene.add(g);
    const lb=labelSprite(n.name,n.title,!HIST.has(n.id));lb.position.y=2.45;lb.visible=false;g.add(lb);const mk=markerSprite();mk.position.y=2.95;g.add(mk);
    addCirc(x,z,0.4);npcObjs.push({kind:'npc',data:n,g,lb,mk,x,z,baseRot:r});});
}
function placeWalkers(){
  const looks=[['#e8dfcc','#7a5a3a'],['#d7c9ab','#4f6a7d'],['#efe6d5','#8a3f2f'],['#c9b48b','#5c6b3f'],['#e2d6c0','#a07a3a'],['#a89070','#a89070'],['#f0e9dc','#6a4d7a'],
    ['#ddd0b4','#3f5a4a'],['#e9e0cb','#9a6a2a'],['#cdbb98','#6b4a3a'],['#efe8d8','#2f4a6a'],['#d9c6a2','#7a3a4a']];
  for(let i=0;i<60;i++){const L=pick(looks);const fem=R()<0.25;const g=makePerson({...(i>=34&&!fem&&R()<0.55?{chlamys:pick(['#7a5a3a','#8a3f2f','#4f6a7d','#6b4a3a','#5c6b3f']),petasos:R()<0.5?'head':'back',noHimation:true}:{}),pattern:fem&&R()<0.35?pick(['spots','stars']):undefined,chiton:L[0],himation:L[1],female:fem,veil:fem&&R()<0.35,...(()=>{if(fem)return{};const r=R();return r<0.24?{exomis:true,chiton:pick(['#b8a27a','#a89070','#8a7a62','#c9b48b','#9a8466'])}:r<0.36?{himOnly:true}:{};})(),carry:fem&&R()<0.4?'hydria':(!fem&&R()<0.15?'amphora':(R()<0.15?'basket':null)),beard:!fem&&R()<0.7,hair:pick(['#2b1f17','#3e2c1f','#5b4532','#8d8a85'])});
    const mode=i<34?'agora':'road';let x,z;
    if(mode==='agora'){x=AG.x+rr(-30,90);z=AG.z+rr(-70,45);}
    else{const rd=ROADS[i%2?0:4];const s=Math.floor(R()*(rd.pts.length-1)),t=R();x=lerp(rd.pts[s][0],rd.pts[s+1][0],t);z=lerp(rd.pts[s][1],rd.pts[s+1][1],t);g.userData.road=rd;g.userData.seg=s;g.userData.dir=R()<0.5?1:-1;}
    g.position.set(x,terrainH(x,z),z);scene.add(g);walkers.push({g,mode,tx:x,tz:z,wait:R()*4,speed:rr(0.9,1.4),phase:R()*10,x,z});}
}

// ------------------------------------------------------------ casas
function buildHouses(){
  const occ=new Set(),OC=6;
  const free=(x,z,w,d)=>{for(let i=Math.floor((x-w/2-1.5)/OC);i<=Math.floor((x+w/2+1.5)/OC);i++)for(let j=Math.floor((z-d/2-1.5)/OC);j<=Math.floor((z+d/2+1.5)/OC);j++)if(occ.has(i+','+j))return false;return true;};
  const mark=(x,z,w,d)=>{for(let i=Math.floor((x-w/2)/OC);i<=Math.floor((x+w/2)/OC);i++)for(let j=Math.floor((z-d/2)/OC);j<=Math.floor((z+d/2)/OC);j++)occ.add(i+','+j);};
  for(const f of footprints){if(f.r)mark(f.x,f.z,f.r*2+8,f.r*2+8);else{const m=Math.max(f.w,f.d)+8;mark(f.x,f.z,m,m);}}
  const list=[];
  const hkeys=new Set();
  const hBad=(x,z)=>!insideWalls(x,z,18)||superD(x,z,ACRO.x,ACRO.z,ACRO.rx,ACRO.rz)<1.45||Math.hypot(x-AG.x,z-AG.z)<165||superD(x,z,PNYX.x,PNYX.z,PNYX.rx,PNYX.rz)<1.25||superD(x,z,AREO.x,AREO.z,46,22)<1.4||(x>-60&&x<200&&z>60&&z<200)||(x>-250&&x<-100&&Math.abs(z+2)<26)||Math.hypot(x-D.x,z-D.z)<110||Math.hypot(x-SG.x,z-SG.z)<60;
  for(let k=0;k<90000&&list.length<2800;k++){
    const th=R()*TAU,rad=Math.sqrt(R())*780;let x=WALLC.x+Math.cos(th)*rad,z=WALLC.z+Math.sin(th)*rad;
    if(hBad(x,z))continue;
    let w=rr(10,16),d=rr(10,15),a=(R()<0.5?0:Math.PI/2)+(R()<0.5?0:Math.PI)+rr(-0.12,0.12)+0.35,two=R()<0.2;
    const dm=demeAt(x,z);
    if(dm){   // en los barrios, las casas forman manzanas pegadas, con callejas entre ellas
      const c=Math.cos(dm.a),sn=Math.sin(dm.a),dx=x-WALLC.x,dz=z-WALLC.z,iu=Math.round((dx*c-dz*sn)/dm.p),iv=Math.round((dx*sn+dz*c)/dm.p);
      if(((iu%dm.blk)+dm.blk)%dm.blk===dm.blk-1)continue;const vm=((iv%3)+3)%3;if(vm===2)continue;const key=dm.id+':'+iu+':'+iv;if(hkeys.has(key))continue;
      const q=toW(iu*dm.p,iv*dm.p,WALLC.x,WALLC.z,dm.a);x=q[0];z=q[1];if(hBad(x,z))continue;w=d=dm.p-0.6;a=dm.a+(vm===0?Math.PI:0);two=R()<dm.two;
      if(roadDist(x,z)<w/2+1)continue;
      if(Math.abs(terrainH(x+6,z)-terrainH(x-6,z))>3.2||Math.abs(terrainH(x,z+6)-terrainH(x,z-6))>3.2)continue;
      if(!free(x,z,w*0.7,d*0.7))continue;hkeys.add(key);}
    else{
      if(roadDist(x,z)<Math.max(w,d)/2+2)continue;
      if(Math.abs(terrainH(x+6,z)-terrainH(x-6,z))>3.2||Math.abs(terrainH(x,z+6)-terrainH(x,z-6))>3.2)continue;
      if(!free(x,z,w,d))continue;mark(x,z,w,d);}
    list.push({x,z,w,d,a,h:rr(3.2,4.4),two,gy:minGround(x,z,w,d,a)});
  }
  if(GLB.ok){housesGLB(list);return;}
  const unit=new THREE.BoxGeometry(1,1,1);unit.translate(0,0.5,0);
  const n=list.length,white=new THREE.MeshLambertMaterial({color:0xffffff});
  const body=new THREE.InstancedMesh(unit,white,n*3),soc=new THREE.InstancedMesh(unit,lam('#a89a82'),n*2),cw=new THREE.InstancedMesh(unit,white,n*2),door=new THREE.InstancedMesh(unit,lam('#4a3324'),n);
  const roof=new THREE.InstancedMesh(GABLE.clone().clearGroups(),white,n*2);
  const mm=new THREE.Matrix4(),q=new THREE.Quaternion(),q2=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),c=new THREE.Color();
  const walls=['#eee5d4','#e6dbc4','#d8c7a5','#efe8da','#cdb994','#c9b089'],roofs=['#b0563a','#a24d33','#bf6a45','#9a4a35','#b8643f'];
  let bi=0,si=0,ci=0,ri=0;
  const put=(m,idx,hs,lx,lz,y,sx,sy,sz,rot)=>{const w=toW(lx,lz,hs.x,hs.z,hs.a);q.setFromAxisAngle(up,hs.a+(rot||0));p.set(w[0],y,w[1]);s.set(sx,sy,sz);mm.compose(p,q,s);m.setMatrixAt(idx,mm);};
  list.forEach((hs,i)=>{const{w,d,h}=hs,rd=Math.min(5.2,d*0.42),sw=Math.min(4.2,w*0.32),col=c.set(pick(walls)).clone(),rc=c.set(pick(roofs)).clone();
    put(body,bi,hs,0,-d/2+rd/2,hs.gy-2,w,h+2,rd);body.setColorAt(bi++,col);
    put(body,bi,hs,-w/2+sw/2,rd/2,hs.gy-2,sw,h+1.6,d-rd);body.setColorAt(bi++,col);
    if(hs.two){put(body,bi,hs,-w*0.2,-d/2+rd/2,hs.gy+h,w*0.55,2.6,rd);}else{put(body,bi,hs,0,0,hs.gy-5,0.01,0.01,0.01);}body.setColorAt(bi++,col);
    put(soc,si++,hs,0,-d/2+rd/2,hs.gy-1,w+0.12,1.9,rd+0.12);put(soc,si++,hs,-w/2+sw/2,rd/2,hs.gy-1,sw+0.12,1.9,d-rd+0.12);
    put(cw,ci,hs,sw/2,d/2-0.22,hs.gy-1,w-sw,3.6,0.45);cw.setColorAt(ci++,col);put(cw,ci,hs,w/2-0.22,rd/2,hs.gy-1,0.45,3.6,d-rd);cw.setColorAt(ci++,col);
    put(door,i,hs,sw/2+1.2,d/2+0.02,hs.gy,1.1,2.1,0.1);
    put(roof,ri,hs,0,-d/2+rd/2,hs.gy+h+(hs.two?0:0),w+0.5,0.9,rd+0.5,Math.PI/2);{const w2=toW(0,-d/2+rd/2,hs.x,hs.z,hs.a);q.setFromAxisAngle(up,hs.a+Math.PI/2);p.set(w2[0],hs.gy+h,w2[1]);s.set(rd+0.5,0.9,w+0.5);mm.compose(p,q,s);roof.setMatrixAt(ri,mm);}roof.setColorAt(ri++,rc);
    put(roof,ri,hs,-w/2+sw/2,rd/2,hs.gy+h-0.4,sw+0.5,0.8,d-rd+0.5);roof.setColorAt(ri++,rc);
    addBox(hs.x,hs.z,w,d,hs.a);footprints.push({x:hs.x,z:hs.z,w,d,a:hs.a,c:'#b8a280',house:true});
    if(R()<0.07)TORCH_SPOTS.push(toW(sw/2+2.2,d/2+0.9,hs.x,hs.z,hs.a));
    if(R()<0.05){const hp=toW(sw/2-0.2,d/2+0.6,hs.x,hs.z,hs.a);herm(hp[0],hp[1],hs.a);}});
  [body,soc,cw,door,roof].forEach(m=>{m.castShadow=true;m.receiveShadow=true;scene.add(m);});
}

function buildTrees(){
  const pts=[];
  for(let i=0;i<320;i++){const a=R()*TAU,d=24+Math.sqrt(R())*120;pts.push([ACADEMY.x+Math.cos(a)*d,ACADEMY.z+Math.sin(a)*d,1]);}
  for(let i=0;i<80;i++){const a=R()*TAU,d=18+R()*60;pts.push([LYCEUM.x+Math.cos(a)*d,LYCEUM.z+Math.sin(a)*d,1]);}
  for(let i=0;i<50;i++){const a=R()*TAU,d=18+R()*50;pts.push([CYNO.x+Math.cos(a)*d,CYNO.z+Math.sin(a)*d,1]);}
  const half=INNER.size/2-20;
  for(let i=0;i<3200;i++){const x=INNER.x+rr(-half,half),z=INNER.z+rr(-half,half);if(insideWalls(x,z,-30))continue;if(roadDist(x,z)<6)continue;const h=terrainH(x,z);if(h<0.5||h>120)continue;pts.push([x,z,0]);}
  if(GLB.ok){// olivos, cipreses y plátanos de Blender, más los olivares, viñas, muros y granjas del campo
    const T=[];pts.forEach(p=>{if(!p[2]&&fieldAt(p[0],p[1]))return;if(!p[2]&&nearRiver(p[0],p[1]))return;T.push({x:p[0],z:p[1],kind:R()<0.82?'olive':'cypress',collide:!!p[2]});});   // no dentro de los campos de cultivo
    OLIVE_POS.forEach(s=>T.push({x:s[0],z:s[1],kind:'olive',k:1.5,collide:true}));
    PLANES.forEach(s=>T.push({x:s[0],z:s[1],kind:'plane',k:rr(1.0,1.25),collide:true}));
    const h2=INNER.size/2-30;T.push(...buildCountryside(INNER.x-h2,INNER.x+h2,INNER.z-h2,INNER.z+h2));buildCrops(INNER.x-h2,INNER.x+h2,INNER.z-h2,INNER.z+h2);buildVida(INNER.x-h2,INNER.x+h2,INNER.z-h2,INNER.z+h2);
    treesGLB(T);return;}
  const olive=[],cyp=[];pts.forEach(p=>(R()<0.82?olive:cyp).push(p));
  OLIVE_POS.forEach(s=>olive.push([s[0],s[1],2]));
  PLANES.forEach(s=>olive.push([s[0],s[1],3]));
  const trunkG=new THREE.CylinderGeometry(0.15,0.28,1.8,6);trunkG.translate(0,0.9,0);
  const crownG=new THREE.IcosahedronGeometry(1.7,0),coneG=new THREE.ConeGeometry(0.9,7,7);coneG.translate(0,4.2,0);
  const tm=new THREE.InstancedMesh(trunkG,lam('#6b5236'),olive.length),cm=new THREE.InstancedMesh(crownG,new THREE.MeshLambertMaterial({color:0xffffff}),olive.length),ym=new THREE.InstancedMesh(coneG,lam('#3d5130'),cyp.length);
  const mm=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),c=new THREE.Color();
  olive.forEach((t,i)=>{const h=floorAt(t[0],t[1]),plane=t[2]===3,k=t[2]===2?1.5:plane?2.2:rr(0.8,1.3);q.setFromAxisAngle(up,R()*TAU);p.set(t[0],h,t[1]);s.set(k,plane?k*1.6:k,k);mm.compose(p,q,s);tm.setMatrixAt(i,mm);
    p.set(t[0],h+(plane?3.6:2.3)*k,t[1]);s.set(k*rr(0.9,1.2),k*(plane?0.95:0.75),k*rr(0.9,1.2));mm.compose(p,q,s);cm.setMatrixAt(i,mm);cm.setColorAt(i,c.set(plane?'#6f8a45':'#7f8b5d').offsetHSL(rr(-0.02,0.02),0,rr(-0.06,0.05)));if(t[2])addCirc(t[0],t[1],0.4);});
  cyp.forEach((t,i)=>{const h=terrainH(t[0],t[1]),k=rr(0.7,1.3);q.identity();p.set(t[0],h,t[1]);s.set(k,k,k);mm.compose(p,q,s);ym.setMatrixAt(i,mm);if(t[2])addCirc(t[0],t[1],0.5);});
  [tm,cm,ym].forEach(m=>{m.castShadow=true;m.userData.veg=true;scene.add(m);});
}

// ------------------------------------------------------------ islas (escenarios aparte, lejos de Atenas; se llega en barco)
const ISL0=12000,ISLD=3000;
// destinos de Grecia continental y del Peloponeso a los que se llega con Lisicles, el arriero (primavera del 386 a.C.)
const GREECE_DESTS=[
 {id:'megara',name:'Mégara',gr:'ΜΕΓΑΡΑ',sub:'La ciudad dórica entre Atenas y el Istmo, con dos colinas por acrópolis.',R:420,H:14,seed:9.1,days:'un día de camino por Eleusis y la costa',fare:2,dir:[-1,0],land:true,step:8},
 {id:'corinto',name:'Corinto',gr:'ΚΟΡΙΝΘΟΣ',sub:'La rica ciudad del Istmo, con dos puertos y una montaña por acrópolis.',R:480,H:14,seed:9.7,days:'dos días de camino por Mégara y las Rocas Escironias',fare:3,dir:[-1,0],land:true,step:8,coast:[0,-1],coastAt:0.8},
 {id:'platea',name:'Platea',gr:'ΠΛΑΤΑΙΑΙ',sub:'La pequeña ciudad de Beocia que vuelve a levantarse, al pie del Citerón.',R:420,H:12,seed:10.3,days:'dos días de camino por el paso del Citerón',fare:3,dir:[-1,0],land:true,step:8},
 {id:'delfos',name:'Delfos',gr:'ΔΕΛΦΟΙ',sub:'El santuario de Apolo en la ladera del Parnaso: el ombligo del mundo.',R:460,H:18,seed:10.9,days:'cuatro o cinco días de camino por Beocia y la Fócide',fare:6,dir:[-1,0],land:true,step:8},
 {id:'argos',name:'Argos',gr:'ΑΡΓΟΣ',sub:'La vieja rival de Esparta, en la llanura de la Argólide.',R:460,H:12,seed:11.5,days:'tres días de camino por Mégara y el Istmo de Corinto',fare:5,dir:[-1,0],land:true,step:8},
 {id:'epidauro',name:'Epidauro',gr:'ΕΠΙΔΑΥΡΟΣ',sub:'El santuario de Asclepio, adonde los enfermos acuden a soñar con el dios.',R:420,H:16,seed:12.1,days:'tres días de camino por el Istmo y los montes de la Argólide',fare:5,dir:[-1,0],land:true,step:8},
 {id:'mantinea',name:'Mantinea',gr:'ΜΑΝΤΙΝΕΙΑ',sub:'La ciudad democrática de Arcadia, en una llanura alta rodeada de montes.',R:440,H:10,seed:12.7,days:'cinco días de camino por el Istmo, Argos y los montes de Arcadia',fare:6,dir:[-1,0],land:true,step:8},
 {id:'olimpia',name:'Olimpia',gr:'ΟΛΥΜΠΙΑ',sub:'El santuario de Zeus en la Élide, donde cada cuatro años se celebran los Juegos.',R:480,H:10,seed:13.3,days:'ocho o nueve días de camino por el Istmo, Arcadia y la Élide',fare:9,dir:[-1,0],land:true,step:8},
 {id:'maraton',name:'Maratón',gr:'ΜΑΡΑΘΩΝ',sub:'La llanura junto al mar donde los atenienses vencieron a los persas hace ciento cuatro años.',R:460,H:6,seed:13.9,days:'un día de camino rodeando el Pentélico',fare:2,dir:[-1,0],land:true,step:8,coast:[1,0],coastAt:0.4},
 {id:'termopilas',name:'Termópilas',gr:'ΘΕΡΜΟΠΥΛΑΙ',sub:'El paso estrecho entre el monte y el mar donde murieron Leónidas y los trescientos.',R:460,H:6,seed:14.5,days:'cuatro días de camino por Beocia, la Fócide y la Lócride',fare:5,dir:[-1,0],land:true,step:8,coast:[0,1],coastAt:0.12},
 {id:'larisa',name:'Larisa',gr:'ΛΑΡΙΣΑ',sub:'La gran llanura de Tesalia, tierra de caballos, junto al río Peneo.',R:500,H:6,seed:15.1,days:'seis o siete días de camino por las Termópilas y la Ftiótide',fare:8,dir:[-1,0],land:true,step:8},
 {id:'pela',name:'Pela',gr:'ΠΕΛΛΑ',sub:'La nueva capital de los reyes de Macedonia, junto a una laguna.',R:480,H:6,seed:15.7,days:'diez días de camino por Tesalia y el valle del Tempe',fare:12,dir:[-1,0],land:true,step:8},
 {id:'dodona',name:'Dodona',gr:'ΔΩΔΩΝΗ',sub:'El oráculo de Zeus, junto a una encina sagrada en los montes del Epiro.',R:440,H:20,seed:16.3,days:'diez u once días de camino por Tesalia y el Pindo',fare:12,dir:[-1,0],land:true,step:8},
 {id:'calidon',name:'Calidón',gr:'ΚΑΛΥΔΩΝ',sub:'La ciudad de Meleagro y del jabalí, en Etolia, frente al golfo de Corinto.',R:440,H:14,seed:16.9,days:'seis días de camino por Delfos, Anfisa y Naupacto',fare:7,dir:[-1,0],land:true,step:8,coast:[0,1],coastAt:0.55},
 {id:'egio',name:'Egio',gr:'ΑΙΓΙΟΝ',sub:'Una ciudad de Acaya junto al golfo de Corinto.',R:440,H:10,seed:17.5,days:'cuatro días de camino por el Istmo y la costa de Acaya',fare:5,dir:[-1,0],land:true,step:8,coast:[0,-1],coastAt:0.5},
 {id:'itome',name:'Itome',gr:'ΙΘΩΜΗ',sub:'El monte sagrado de Mesenia, la tierra de los hilotas.',R:460,H:12,seed:18.1,days:'ocho días de camino por el Istmo, Arcadia y Esparta',fare:9,dir:[-1,0],land:true,step:8},
 {id:'calcis',name:'Calcis',gr:'ΧΑΛΚΙΣ',sub:'La ciudad del Euripo, en Eubea, unida a Beocia por un puente.',R:420,H:8,seed:18.7,days:'tres días de camino por Tanagra y Áulide',fare:4,dir:[-1,0],land:true,step:8},
 {id:'citeron',name:'El monte Citerón',gr:'ΚΙΘΑΙΡΩΝ',sub:'El monte de Dioniso y de las ménades, entre el Ática y Beocia.',R:440,H:18,seed:41.3,days:'un día de camino, de paso hacia Platea',fare:2,dir:[-1,0],land:true,step:8},
 {id:'nemea',name:'Nemea',gr:'ΝΕΜΕΑ',sub:'El valle del león y de los juegos de Zeus, entre Corinto y Micenas.',R:440,H:12,seed:42.1,days:'cuatro días de camino por el Istmo',fare:4,dir:[-1,0],land:true,step:8},
 {id:'liceo',name:'El monte Liceo',gr:'ΛΥΚΑΙΟΝ ΟΡΟΣ',sub:'La montaña de Zeus Liceo y de Pan, en el corazón de Arcadia.',R:440,H:22,seed:42.9,days:'seis días de camino por los montes de Arcadia',fare:6,dir:[-1,0],land:true,step:8},
 {id:'tempe',name:'El valle del Tempe',gr:'ΤΕΜΠΗ',sub:'La garganta del Peneo entre el Olimpo y el Osa: el valle de los laureles.',R:440,H:16,seed:43.7,days:'nueve días de camino por Tesalia',fare:8,dir:[-1,0],land:true,step:8},
 {id:'parnaso',name:'El monte Parnaso',gr:'ΠΑΡΝΑΣΣΟΣ',sub:'El monte de Apolo y de las Musas, con la cueva de Pan y de las ninfas, sobre Delfos.',R:440,H:24,seed:44.5,days:'tres días de camino por Beocia',fare:4,dir:[-1,0],land:true,step:8},
 {id:'pentelico',name:'El monte Pentélico',gr:'ΠΕΝΤΕΛΙΚΟΝ ΟΡΟΣ',sub:'Entre Atenas y Maratón: mármol, colmenas y la cueva de Pan.',R:440,H:18,seed:48.5,days:'medio día de camino, de paso hacia Maratón',fare:1,dir:[-1,0],land:true,step:8},
 {id:'eta',name:'El monte Eta',gr:'ΟΙΤΗ',sub:'La montaña de la pira de Heracles, sobre las Termópilas.',R:440,H:22,seed:49.3,days:'cuatro días de camino por Beocia y la Fócide',fare:4,dir:[-1,0],land:true,step:8},
 {id:'achelous',name:'El río Aqueloo',gr:'ΑΧΕΛΩΙΟΣ',sub:'El mayor río de Grecia, entre Etolia y Acarnania.',R:440,H:10,seed:50.1,days:'ocho días de camino hacia el noroeste',fare:8,dir:[-1,0],land:true,step:8},
 {id:'taigeto',name:'El monte Taigeto',gr:'ΤΑΫΓΕΤΟΝ',sub:'La sierra de Ártemis y de los cazadores, entre Laconia y Mesenia.',R:440,H:26,seed:50.9,days:'siete días de camino por el Peloponeso',fare:7,dir:[-1,0],land:true,step:8},
 {id:'escironides',name:'Las rocas Escironias',gr:'ΣΚΙΡΩΝΙΔΕΣ ΠΕΤΡΑΙ',sub:'El camino colgado sobre el mar entre Megara y el Istmo.',R:440,H:20,seed:51.7,days:'un día y medio de camino por Megara',fare:2,dir:[-1,0],land:true,step:8,coast:[0,1],coastAt:0.35},
 {id:'lerna',name:'Lerna',gr:'ΛΕΡΝΑ',sub:'Las fuentes y el pantano de la Hidra, al sur de Argos.',R:440,H:10,seed:56.5,days:'cuatro días de camino por Argos',fare:4,dir:[-1,0],land:true,step:8,coast:[1,0],coastAt:0.5},
 {id:'erimanto',name:'El monte Erimanto',gr:'ΕΡΥΜΑΝΘΟΣ',sub:'Bosques y cumbres nevadas entre Acaya y Élide: el monte del jabalí.',R:440,H:26,seed:57.3,days:'siete días de camino por Acaya',fare:7,dir:[-1,0],land:true,step:8},
 {id:'estinfalo',name:'El lago Estínfalo',gr:'ΣΤΥΜΦΑΛΙΣ ΛΙΜΝΗ',sub:'Un lago de montaña en el norte de Arcadia, el de las aves de Heracles.',R:440,H:16,seed:58.1,days:'tres días de camino por Corinto',fare:3,dir:[-1,0],land:true,step:8},
 {id:'tenaro',name:'El cabo Ténaro',gr:'ΤΑΙΝΑΡΟΝ',sub:'La punta más al sur de Grecia: el templo de Poseidón y la puerta del Hades.',R:420,H:14,seed:58.9,days:'siete días de camino por Esparta',fare:7,dir:[-1,0],land:true,step:8,coast:[0,1],coastAt:0.3},
 {id:'lebadea',name:'Lebadea',gr:'ΛΕΒΑΔΕΙΑ',sub:'El bosque del río Hercina y la cueva del oráculo de Trofonio, en Beocia.',R:440,H:14,seed:59.7,days:'dos días de camino por Tebas',fare:2,dir:[-1,0],land:true,step:8}
];
const ISLANDS=[
 {id:'egina',name:'Egina',gr:'ΑΙΓΙΝΑ',sub:'La isla de Éaco, en el golfo Sarónico, frente al Pireo.',R:330,H:75,seed:1.3,days:'medio día de navegación con buen viento',fare:2,dir:[-1,0.15]},
 {id:'delos',name:'Delos',gr:'ΔΗΛΟΣ',sub:'La isla sagrada de Apolo, en el centro de las Cícladas.',R:230,H:30,seed:2.1,days:'dos días de navegación, con escala en Ceos',fare:6,dir:[-1,0]},
 {id:'naxos',name:'Naxos',gr:'ΝΑΞΟΣ',sub:'La mayor de las Cícladas, la isla de Ariadna y del mármol.',R:400,H:115,seed:0.7,days:'dos días y medio de navegación',fare:6,dir:[-0.85,0.53]},
 {id:'creta',name:'Creta',gr:'ΚΡΗΤΗ',sub:'La gran isla de Minos.',R:520,H:150,seed:3.3,days:'cuatro o cinco días por mar abierto',fare:12,dir:[-0.6,-0.8]},
 {id:'lesbos',name:'Lesbos',gr:'ΛΕΣΒΟΣ',sub:'La isla de los poetas, frente a la costa de Asia.',R:430,H:95,seed:4.6,days:'tres o cuatro días de navegación hacia el noreste',fare:9,dir:[-1,-0.1]},
 {id:'troya',name:'Troya (Ilión)',gr:'ΙΛΙΟΝ',sub:'La pequeña Ilión del siglo IV, sobre las ruinas de la Troya de Homero, junto al Helesponto.',R:420,H:22,seed:5.2,days:'cuatro días de navegación hacia el Helesponto',fare:9,dir:[-1,0.25]},
 {id:'tebas',name:'Tebas',gr:'ΘΗΒΑΙ',sub:'La gran ciudad de Beocia, la de Cadmo, Edipo y Heracles.',R:560,H:18,seed:6.1,days:'dos días de camino por el Citerón, por el paso de Eleuteras',fare:3,dir:[-1,0],land:true},
 {id:'esparta',name:'Esparta',gr:'ΣΠΑΡΤΗ',sub:'La ciudad sin murallas de Licurgo, junto al Eurotas, al pie del Taigeto.',R:600,H:14,seed:7.3,days:'seis o siete días de camino por Mégara, el Istmo de Corinto, la Argólide y Arcadia',fare:8,dir:[-1,0],land:true},
 {id:'micenas',name:'Micenas',gr:'ΜΥΚΗΝΑΙ',sub:'Las ruinas de la ciudad de Agamenón, en la Argólide.',R:520,H:16,seed:8.2,days:'tres días de camino por Mégara y el Istmo de Corinto',fare:5,dir:[-1,0],land:true},
 ...GREECE_DESTS,
 {id:'efeso',name:'Éfeso',gr:'ΕΦΕΣΟΣ · ΙΩΝΙΑ',sub:'La gran ciudad de Jonia, con el templo de Ártemis, una de las maravillas del mundo.',R:480,H:10,seed:19.3,days:'tres o cuatro días de navegación, por las Cícladas y Samos',fare:9,dir:[-1,0],land:true,sea:true,step:8,coast:[-1,0],coastAt:0.45,net:'asia'},
 {id:'mileto',name:'Mileto',gr:'ΜΙΛΗΤΟΣ · ΙΩΝΙΑ',sub:'La ciudad de los primeros filósofos y de las noventa colonias.',R:460,H:8,seed:19.9,days:'cuatro días de navegación, por las Cícladas',fare:9,dir:[-1,0],land:true,sea:true,step:8,coast:[0,-1],coastAt:0.35,net:'asia'},
 {id:'halicarnaso',name:'Halicarnaso',gr:'ΑΛΙΚΑΡΝΑΣΣΟΣ · ΚΑΡΙΑ',sub:'La ciudad de Heródoto, entre griegos y carios, en la costa de Caria.',R:460,H:12,seed:20.5,days:'cuatro o cinco días de navegación, por Cos',fare:10,dir:[-1,0],land:true,sea:true,step:8,coast:[0,1],coastAt:0.4,net:'asia'},
 {id:'sardes',name:'Sardes',gr:'ΣΑΡΔΕΙΣ · ΛΥΔΙΑ',sub:'La antigua capital de Lidia, hoy residencia del sátrapa persa.',R:480,H:14,seed:21.1,days:'por mar hasta Éfeso y tres días de camino por el valle del Caístro',ldays:'tres días de camino desde Éfeso',fare:12,lfare:4,dir:[-1,0],land:true,step:8,net:'asia'},
 {id:'estagira',name:'Estagira',gr:'ΣΤΑΓΕΙΡΑ · ΧΑΛΚΙΔΙΚΗ',sub:'Una pequeña ciudad de la Calcídica, junto a Macedonia: la patria de Aristóteles.',R:440,H:12,seed:22.3,days:'cuatro o cinco días de navegación hacia el norte, bordeando Eubea',fare:9,dir:[-1,0],land:true,sea:true,step:8,coast:[1,0],coastAt:0.3},
 {id:'salamina',name:'Salamina',gr:'ΣΑΛΑΜΙΣ',sub:'La isla de Áyax, frente al Pireo, donde se venció a Jerjes.',R:380,H:60,seed:23.1,days:'medio día de navegación desde el Pireo',fare:1,dir:[-1,0]},
 {id:'melos',name:'Melos',gr:'ΜΗΛΟΣ',sub:'La isla dórica que Atenas castigó en el 416 y que ha vuelto a ser de los melios.',R:400,H:90,seed:23.7,days:'tres días de navegación hacia el sur de las Cícladas',fare:7,dir:[-1,0]},
 {id:'samos',name:'Samos',gr:'ΣΑΜΟΣ · ΙΩΝΙΑ',sub:'La isla de Hera, de Pitágoras y del túnel de Eupalino.',R:440,H:110,seed:24.3,days:'tres días de navegación por las Cícladas e Icaria',fare:9,dir:[-1,0],green:true},
 {id:'quios',name:'Quíos',gr:'ΧΙΟΣ · ΙΩΝΙΑ',sub:'La rica isla jonia del mejor vino de Grecia, que dice ser la patria de Homero.',R:440,H:100,seed:24.9,days:'tres días de navegación hacia el este, por Andros',fare:9,dir:[-1,0],green:true},
 {id:'rodas',name:'Rodas',gr:'ΡΟΔΟΣ',sub:'La ciudad nueva que fundaron juntas las tres ciudades de la isla, consagrada al Sol.',R:460,H:90,seed:25.5,days:'cinco o seis días de navegación, por las Cícladas y Cos',fare:12,dir:[-1,0]},
 {id:'corcira',name:'Corcira',gr:'ΚΕΡΚΥΡΑ',sub:'La colonia rebelde de Corinto, en la ruta de Italia: la isla de los feacios.',R:460,H:80,seed:26.1,days:'unos siete días de navegación, rodeando el Peloponeso',fare:12,dir:[-1,0],green:true},
 {id:'bizancio',name:'Bizancio',gr:'ΒΥΖΑΝΤΙΟΝ',sub:'La colonia de Mégara que vigila el Bósforo y el paso del trigo del mar Negro.',R:460,H:14,seed:26.7,days:'seis días de navegación por el Helesponto y la Propóntide',fare:12,dir:[-1,0],land:true,sea:true,step:8,coast:[1,0],coastAt:0.35,green:true},
 {id:'olinto',name:'Olinto',gr:'ΟΛΥΝΘΟΣ · ΧΑΛΚΙΔΙΚΗ',sub:'La capital de la liga de los calcideos, con su barrio de calles rectas.',R:440,H:10,seed:27.3,days:'cinco días de navegación hacia el norte, hasta el golfo Toroneo',fare:9,dir:[-1,0],land:true,sea:true,step:8,coast:[0,1],coastAt:0.45,green:true},
 {id:'pilos',name:'Pilos',gr:'ΠΥΛΟΣ · ΜΕΣΣΗΝΙΑ',sub:'La bahía de Mesenia donde los espartanos se rindieron en Esfacteria.',R:460,H:14,seed:27.9,days:'cuatro días de navegación rodeando el Peloponeso por el cabo Malea',fare:8,dir:[-1,0],land:true,sea:true,step:8,coast:[0,1],coastAt:0.45,green:true},
 {id:'decelia',name:'Decelia',gr:'ΔΕΚΕΛΕΙΑ',sub:'El demo del Ática, al pie del Parnes, donde los espartanos tuvieron su fuerte.',R:420,H:20,seed:28.5,days:'medio día de camino hacia el norte, al pie del Parnes',fare:1,dir:[-1,0],land:true,step:8},
 {id:'naucratis',name:'Náucratis',gr:'ΝΑΥΚΡΑΤΙΣ · ΑΙΓΥΠΤΟΣ',sub:'El puerto de los griegos en el delta del Nilo, en el Egipto libre del faraón Hakor.',R:480,H:3,seed:36.3,days:'unos diez días de navegación por Creta, y un día Nilo arriba desde la boca Canópica',fare:16,dir:[-1,0],land:true,sea:true,step:8,net:'eg',flat:true,desert:true},
 {id:'menfis',name:'Menfis y las pirámides',gr:'ΜΕΜΦΙΣ · ΑΙΓΥΠΤΟΣ',sub:'La vieja capital de Egipto, el templo de Ptah y las pirámides que vio Heródoto.',R:480,H:4,seed:36.9,days:'en barco hasta Náucratis y unos cuatro días remontando el Nilo',ldays:'unos cuatro días remontando el Nilo en barca',fare:19,lfare:3,dir:[-1,0],land:true,step:8,net:'eg',desert:true},
 {id:'doride',name:'La Dóride',gr:'ΔΩΡΙΣ',sub:'El pequeño valle entre el Eta y el Parnaso que los dorios llaman su madre patria.',R:440,H:40,seed:40.1,days:'tres días de camino, por Beocia y la Fócide',fare:4,dir:[-1,0],land:true,step:8,green:true},
 {id:'anfisa',name:'Anfisa',gr:'ΑΜΦΙΣΣΑ · ΛΟΚΡΙΣ',sub:'La ciudad de los locrios ozolios, sobre la llanura sagrada de Delfos.',R:440,H:30,seed:40.7,days:'dos días y medio de camino, por Beocia, hasta más allá de Delfos',fare:4,dir:[-1,0],land:true,step:8},
 {id:'opunte',name:'Opunte',gr:'ΟΠΟΥΣ · ΛΟΚΡΙΣ',sub:'La ciudad de los locrios orientales, patria de Áyax el menor y de Patroclo.',R:440,H:14,seed:41.3,days:'dos días de navegación, por el canal de Eubea',fare:4,dir:[-1,0],land:true,sea:true,step:8,coast:[1,0],coastAt:0.4,green:true},
 {id:'sicion',name:'Sición',gr:'ΣΙΚΥΩΝ',sub:'La ciudad de los pintores, entre Corinto y Acaya.',R:460,H:16,seed:41.9,days:'dos días de camino, por Mégara y el Istmo',fare:3,dir:[-1,0],land:true,step:8},
 {id:'itaca',name:'Ítaca',gr:'ΙΘΑΚΗ',sub:'La isla áspera de Ulises, en el mar Jonio.',R:360,H:90,seed:42.5,days:'unos seis días de navegación, rodeando el Peloponeso',fare:11,dir:[-1,0]},
 {id:'cefalonia',name:'Cefalenia',gr:'ΚΕΦΑΛΛΗΝΙΑ',sub:'La mayor de las islas Jónicas, con cuatro ciudades.',R:460,H:130,seed:43.1,days:'unos seis días de navegación, rodeando el Peloponeso',fare:11,dir:[-1,0],green:true},
 {id:'leucade',name:'Léucade',gr:'ΛΕΥΚΑΣ',sub:'La colonia de Corinto con el acantilado blanco de Apolo.',R:400,H:110,seed:43.7,days:'unos siete días de navegación, rodeando el Peloponeso',fare:12,dir:[-1,0],green:true},
 {id:'zacinto',name:'Zacinto',gr:'ΖΑΚΥΝΘΟΣ',sub:'La isla boscosa de las lagunas de pez.',R:420,H:90,seed:44.3,days:'unos cinco días de navegación, rodeando el Peloponeso',fare:10,dir:[-1,0],green:true},
 {id:'tasos',name:'Tasos',gr:'ΘΑΣΟΣ',sub:'La isla del oro y del vino, frente a Tracia.',R:430,H:120,seed:44.9,days:'cinco días de navegación hacia el norte, por Eubea y Lemnos',fare:10,dir:[-1,0],green:true},
 {id:'lemnos',name:'Lemnos',gr:'ΛΗΜΝΟΣ',sub:'La isla de Hefesto, que la paz del Rey deja a Atenas.',R:430,H:60,seed:45.5,days:'tres o cuatro días de navegación hacia el norte, por Eubea',fare:8,dir:[-1,0]},
 {id:'samotracia',name:'Samotracia',gr:'ΣΑΜΟΘΡΑΚΗ',sub:'La isla montañosa de los Misterios de los Grandes Dioses.',R:380,H:160,seed:46.1,days:'cinco días de navegación hacia el norte',fare:10,dir:[-1,0],green:true},
 {id:'cos',name:'Cos',gr:'ΚΩΣ',sub:'La isla de Hipócrates y de los médicos asclepíadas.',R:420,H:80,seed:46.7,days:'cuatro días de navegación, por las Cícladas',fare:9,dir:[-1,0]},
 {id:'cime',name:'Cime',gr:'ΚΥΜΗ · ΑΙΟΛΙΣ',sub:'La mayor ciudad eolia de Asia, de nuevo bajo el rey de Persia.',R:460,H:12,seed:47.3,days:'tres o cuatro días de navegación, por Quíos',fare:9,dir:[-1,0],land:true,sea:true,step:8,coast:[1,0],coastAt:0.4,net:'asia2',green:true},
 {id:'cnido',name:'Cnido',gr:'ΚΝΙΔΟΣ · ΔΩΡΙΣ',sub:'La ciudad doria de Caria, de médicos y de la gran batalla naval del 394.',R:440,H:30,seed:47.9,days:'cuatro o cinco días de navegación, por las Cícladas',fare:10,dir:[-1,0],land:true,sea:true,step:8,coast:[0,1],coastAt:0.4,net:'asia2'},
 {id:'siracusa386',name:'Siracusa',gr:'ΣΥΡΑΚΟΥΣΑΙ · ΣΙΚΕΛΙΑ',sub:'La mayor ciudad griega de Occidente, en manos del tirano Dionisio.',R:500,H:12,seed:48.5,days:'unos diez días de navegación, por Corcira y el mar Jonio',fare:18,dir:[-1,0],land:true,sea:true,step:8,coast:[1,0],coastAt:0.4,net:'sic386'},
 {id:'tarento',name:'Tarento',gr:'ΤΑΡΑΣ · ΙΤΑΛΙΑ',sub:'La colonia espartana de Italia, gobernada por el pitagórico Arquitas.',R:480,H:10,seed:49.1,days:'unos nueve días de navegación, por Corcira y el mar Jonio',fare:17,dir:[-1,0],land:true,sea:true,step:8,coast:[0,1],coastAt:0.4,net:'tar386',green:true},
 {id:'cirene',name:'Cirene',gr:'ΚΥΡΗΝΗ · ΛΙΒΥΗ',sub:'La colonia de Tera en Libia, rica por el silfio.',R:480,H:30,seed:49.7,days:'unos ocho días de navegación, por Creta',fare:16,dir:[-1,0],land:true,sea:true,step:8,coast:[0,1],coastAt:0.4,net:'cyr386'},
 {id:'olbia',name:'Olbia',gr:'ΟΛΒΙΑ · ΠΟΝΤΟΣ',sub:'La colonia de Mileto en la boca del Borístenes, entre los escitas.',R:480,H:6,seed:50.3,days:'unos quince días de navegación, por el Helesponto, el Bósforo y la costa de Tracia',fare:22,dir:[-1,0],land:true,sea:true,step:8,coast:[1,0],coastAt:0.4,net:'pon1',green:true,flat:true},
 {id:'panticapeo',name:'Panticapeo',gr:'ΠΑΝΤΙΚΑΠΑΙΟΝ · ΒΟΣΠΟΡΟΣ',sub:'La capital del reino del Bósforo, de donde viene el trigo de Atenas.',R:480,H:20,seed:50.9,days:'unos dieciséis días de navegación, por el Helesponto y el Bósforo',fare:22,dir:[-1,0],land:true,sea:true,step:8,coast:[1,0],coastAt:0.4,net:'pon2',green:true},
 {id:'sinope',name:'Sinope',gr:'ΣΙΝΩΠΗ · ΠΟΝΤΟΣ',sub:'La colonia de Mileto en la costa sur del mar Negro, patria de Diógenes.',R:460,H:20,seed:51.5,days:'unos doce días de navegación, por el Bósforo y la costa de Bitinia',fare:20,dir:[-1,0],land:true,sea:true,step:8,coast:[0,1],coastAt:0.4,net:'pon3',green:true},
 {id:'crotona',name:'Crotona',gr:'ΚΡΟΤΩΝ · ΙΤΑΛΙΑ',sub:'La ciudad de los atletas, de los médicos y de Pitágoras, en la Magna Grecia.',R:480,H:16,seed:52.1,days:'unos nueve días de navegación, por Corcira y el mar Jonio',fare:17,dir:[-1,0],land:true,sea:true,step:8,coast:[1,0],coastAt:0.4,net:'cro386',green:true},
 {id:'laurion',name:'El Laurión',gr:'ΛΑΥΡΕΙΟΝ',sub:'Las minas de plata del sur del Ática, donde trabajan miles de esclavos.',R:440,H:26,seed:53.7,days:'un día de camino hacia el sur del Ática',fare:2,dir:[-1,0],land:true,step:8,coast:[1,0],coastAt:0.45},
];
function layoutDests(){ISLANDS.forEach((I,i)=>{I.x=ISL0+i*ISLD;I.z=0;I.pads=[];I.blobs=[];const l=Math.hypot(I.dir[0],I.dir[1]);I.dir=[I.dir[0]/l,I.dir[1]/l];});}
layoutDests();
// por mar o por tierra: las islas, por mar; los destinos de tierra firme, por tierra, salvo que digan sea:true
function bySea(I){return I.sea!==undefined?I.sea:!I.land;}
function netOf(k){if(k==='atenas')return MODE==='roma'?'it':'gr';const I=ISLANDS.find(x=>x.id===k);return I&&I.net||'gr';}
const PIERS={},PORTS={},SHIPS=[],captains=[],reliefObjs=[],NPC_POS={};
const HARBOR={ok:false,x:0,z:0};
function regionOf(x){if(x<8000)return 'atenas';return ISLANDS[clamp(Math.round((x-ISL0)/ISLD),0,ISLANDS.length-1)].id;}
function islandOf(x){if(x<8000)return null;return ISLANDS[clamp(Math.round((x-ISL0)/ISLD),0,ISLANDS.length-1)];}
function islandBase(I,x,z){const dx=x-I.x,dz=z-I.z,th=Math.atan2(dz,dx);const R=I.R*(1+0.14*Math.sin(3*th+I.seed)+0.07*Math.sin(7*th+I.seed*2.3));const r=Math.hypot(dx,dz)/R;
  let h=r>1?(I.land?1.2+(r-1)*R*(I.flat?0.035:0.06)+fbm(x*0.01,z*0.01)*(I.flat?4:9):1.2-(r-1)*R*0.12):1.2+I.H*Math.pow(1-r,1.5)+(fbm(x*0.012+I.seed,z*0.012)-0.42)*12*Math.min(1,(1-r)*4);
  for(const b of I.blobs){const d=Math.hypot(x-b.x,z-b.z)/b.R;const H=Math.min(b.H,b.R*0.55),q=1-d*d;const hb=d>1?1.2-(d-1)*b.R*0.15:1.2+H*q*q;if(hb>h)h=hb;}   // montes: perfil suave (sin escalón en el borde) y nunca más empinados de unos 40° (antes, hasta 58°: paredes imposibles en el Eta o el Taigeto)
  if(I.coast){const px=x-I.x,pz=z-I.z,d=px*I.coast[0]+pz*I.coast[1]-I.R*I.coastAt+Math.sin((px*I.coast[1]-pz*I.coast[0])*0.012+I.seed)*25;if(d>-40)h=Math.min(h,lerp(h,1.2-d*0.09,clamp((d+40)/40,0,1)));}   // costa: el mar en una dirección
  if(I.lake){const L=I.lake,q=Math.hypot((x-L.x)/L.rx,(z-L.z)/L.rz);if(q<1.3)h=Math.min(h,lerp(-7,h,sstep(clamp((q-0.85)/0.45,0,1))));}   // lago
  return Math.max(carveH(x,z,sqMount(I.id,x,z,h)),-9);}   // escenario cuadrado: montes más allá del borde
function padIndex(I){if(I._pi&&I._pi.n===I.pads.length)return I._pi;const C=48,m=new Map();   // índice de los allanamientos por celdas: mismo resultado, mucho menos trabajo al construir el relieve
  const order=[...I.pads.filter(p=>!p.road),...I.pads.filter(p=>p.road)];order.forEach((p,k)=>{if(p.bw===undefined){let dm=0;for(let i=0;i<12;i++){const a=i/12*TAU;for(const rr2 of[18,45,80]){const hh=islandBase(I,p.x+Math.cos(a)*(p.r+rr2),p.z+Math.sin(a)*(p.r+rr2));dm=Math.max(dm,Math.abs(hh-p.h)-rr2*0.75);}}p.bw=clamp(18+dm*1.3,18,110);}   // la rampa entre el allanamiento y el monte se alarga con el desnivel (talud de unos 37°): sin paredes verticales en los caminos que cortan un monte
    const R=p.r+p.bw,i0=Math.floor((p.x-R)/C),i1=Math.floor((p.x+R)/C),j0=Math.floor((p.z-R)/C),j1=Math.floor((p.z+R)/C);
    for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const key=i*100003+j;let L=m.get(key);if(!L){L=[];m.set(key,L);}L.push(p);}});
  I._pi={n:I.pads.length,C,m};return I._pi;}
function islandH(x,z){const I=islandOf(x);if(I.grid&&!GRIDOFF){const gh=gridH(I,x,z);if(gh!==null)return gh;}let h=islandBase(I,x,z);const P=padIndex(I),L=P.m.get(Math.floor(x/P.C)*100003+Math.floor(z/P.C));
  if(L)for(const p of L){const d=Math.hypot(x-p.x,z-p.z),bw=p.bw||18;if(d<p.r+bw)h=lerp(h,p.h,1-sstep(clamp((d-p.r)/bw,0,1)));}return h;}   // los caminos entre mapas (road) mandan sobre lo demás: van al final de cada lista   // los caminos entre mapas (road) mandan sobre lo demás
function pad(I,lx,lz,r,dh,fixed){const x=I.x+lx,z=I.z+lz;const p={x,z,r,h:fixed!==undefined?fixed:islandBase(I,x,z)+(dh||0)};I.pads.push(p);return p;}
function shoreAlong(x0,z0,dx,dz,maxT){for(let t=0;t<maxT;t+=2){if(terrainH(x0+dx*t,z0+dz*t)<0.4)return[x0+dx*(t-3),z0+dz*(t-3)];}return[x0,z0];}
// ============================================================ caminos: Grecia e Italia recorribles a pie
// Cada mapa (la ciudad de partida y cada destino) se une a sus vecinos reales por caminos. En el borde del mapa, en la dirección
// geográfica del vecino (según las coordenadas de MED_POS), hay una puerta: al llegar a ella se camina hasta el mapa vecino y se aparece
// en la puerta que mira hacia el mapa de origen. Así, para ir al sur hay que salir por el sur.
const WORLD_LINKS={
 atenas:[['atenas','megara'],['atenas','laurion'],['atenas','citeron'],['citeron','platea'],['atenas','pentelico'],['pentelico','maraton'],['megara','escironides'],['escironides','corinto'],['platea','tebas'],['tebas','calcis'],['tebas','lebadea'],['lebadea','parnaso'],['parnaso','delfos'],['delfos','eta'],['eta','termopilas'],['delfos','calidon'],
  ['termopilas','larisa'],['larisa','tempe'],['tempe','pela'],['larisa','dodona'],['dodona','achelous'],['achelous','calidon'],['corinto','nemea'],['nemea','micenas'],['corinto','egio'],['micenas','argos'],['argos','epidauro'],['argos','lerna'],['lerna','mantinea'],
  ['mantinea','esparta'],['mantinea','liceo'],['liceo','olimpia'],['esparta','taigeto'],['taigeto','itome'],['itome','olimpia'],['egio','erimanto'],['erimanto','olimpia'],['corinto','estinfalo'],['estinfalo','mantinea'],['esparta','tenaro']],
 roma:[['atenas','ciminia'],['ciminia','etruria'],['atenas','soracte'],['soracte','umbria'],['atenas','picenum'],['atenas','samnium'],['atenas','nemi'],['nemi','campania'],['etruria','lunae'],['lunae','liguria'],['etruria','aemilia'],['umbria','clitumno'],['clitumno','picenum'],['umbria','rubico'],['rubico','aemilia'],
  ['picenum','samnium'],['samnium','caudium'],['caudium','campania'],['samnium','apulia'],['campania','lucania'],['apulia','lucania'],['lucania','sila'],['sila','regium'],['aemilia','liguria'],['aemilia','transpadana'],['aemilia','padus'],['padus','venetia'],
  ['transpadana','venetia'],['transpadana','liguria']]};
// en la ciudad de partida, las puertas están al final de los caminos que salen hacia cada región
function homeGate(to){
  if(MODE==='roma')return{ostia:[-1000,385],tibur:[1280,-30],praeneste:[1280,-30],ciminia:[-1000,385],soracte:[-690,-1520],nemi:[1270,1160],etruria:[-1000,385],umbria:[-690,-1520],picenum:[-40,-1480],samnium:[1280,-30],campania:[1270,1160]}[to];
  return{pentelico:[LYCEUM.x+150,LYCEUM.z-260],citeron:[NG.x-20,NG.z-410],megara:[SG.x+SG.ox*420+90,SG.z+SG.oz*420],platea:[NG.x-20,NG.z-410],maraton:[LYCEUM.x+150,LYCEUM.z-260]}[to];}
const GATES_W=[];
const llOf=id=>(MODE==='roma'?MED_POS_RO:MED_POS)[id];
function bearing(a,b){const A=llOf(a),B=llOf(b);if(!A||!B)return null;const dx=(B[0]-A[0])*Math.cos(A[1]*Math.PI/180),dz=-(B[1]-A[1]),l=Math.hypot(dx,dz);return{dx:dx/l,dz:dz/l,km:l*111};}
function dirName(dx,dz){const a=Math.atan2(-dz,dx);const k=((Math.round(a/(Math.PI/4))%8)+8)%8;return['este','noreste','norte','noroeste','oeste','suroeste','sur','sureste'][k];}
function mapName(id){return id==='atenas'?homeName():(ISLANDS.find(I=>I.id===id)||{name:id}).name;}
