// ============================================================ ROMA: decoración según las reconstrucciones
// Pavimentos (travertino en foros y plazas, mármoles de colores en el Foro de Augusto, calzadas de basalto con aceras),
// estatuas en frontones y arcadas, arcos honoríficos, monumentos menores del Foro y mobiliario urbano (fuentes, altares, miliarios, balcones).
// Referencias: maqueta de Gismondi (Museo della Civiltà Romana), Rome Reborn, Forma Urbis Romae.
const DTEX={
 trav:canvasTex(256,256,(x)=>{x.fillStyle='#9a8f78';x.fillRect(0,0,256,256);const r=mulberry32(11);for(let j=0;j<4;j++){const off=(j%2)*64;for(let i=-1;i<3;i++){const c=150+r()*28|0;x.fillStyle='rgb('+c+','+(c-8)+','+(c-28)+')';x.fillRect(i*128+off+2,j*64+2,124,60);
   for(let k=0;k<6;k++){x.fillStyle='rgba(120,100,70,'+(0.05+r()*0.08)+')';x.fillRect(i*128+off+r()*120,j*64+r()*58,r()*30+4,2);}}}}),
 basalt:canvasTex(256,256,(x)=>{x.fillStyle='#3b3a37';x.fillRect(0,0,256,256);const r=mulberry32(23);
   for(let j=0;j<6;j++)for(let i=0;i<6;i++){const cx=i*43+(j%2)*21+r()*10,cy=j*43+r()*10,n=5+(r()*3|0),c=78+r()*30|0;x.fillStyle='rgb('+c+','+(c-2)+','+(c-6)+')';x.beginPath();
     for(let k=0;k<n;k++){const t=k/n*TAU+r()*0.4,rr=17+r()*7;x.lineTo(cx+Math.cos(t)*rr,cy+Math.sin(t)*rr);}x.closePath();x.fill();}}),
 marble:canvasTex(256,256,(x)=>{const cols=['#a88f55','#c9c1b2','#5e3b3c','#c9c1b2','#9c8657','#86847c'],r=mulberry32(31);
   for(let j=0;j<4;j++)for(let i=0;i<4;i++){x.fillStyle=cols[(i+j*2)%cols.length];x.fillRect(i*64,j*64,64,64);x.strokeStyle='rgba(120,70,90,0.35)';x.lineWidth=1;for(let k=0;k<3;k++){x.beginPath();x.moveTo(i*64+r()*64,j*64);x.bezierCurveTo(i*64+r()*64,j*64+20,i*64+r()*64,j*64+44,i*64+r()*64,j*64+64);x.stroke();}
     x.strokeStyle='rgba(40,30,20,0.35)';x.strokeRect(i*64+0.5,j*64+0.5,63,63);}
   x.fillStyle='#bdb5a6';for(let j=0;j<4;j+=2)for(let i=0;i<4;i+=2){x.beginPath();x.arc(i*64+64,j*64+64,14,0,TAU);x.fill();}}),
 walk:canvasTex(128,128,(x)=>{x.fillStyle='#8f8268';x.fillRect(0,0,128,128);const r=mulberry32(5);for(let j=0;j<4;j++)for(let i=0;i<2;i++){const c=140+r()*22|0;x.fillStyle='rgb('+c+','+(c-12)+','+(c-34)+')';x.fillRect(i*64+(j%2)*32+1,j*32+1,62,30);}}),
 curb:canvasTex(64,32,(x)=>{x.fillStyle='#9d9482';x.fillRect(0,0,64,32);x.fillStyle='#857c6a';for(let i=0;i<4;i++)x.fillRect(i*16,0,1,32);})
};
const DMAT=k=>{const m=new THREE.MeshLambertMaterial({map:DTEX[k],color:0xe4cfa8,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});return m;};
// superficie que sigue el terreno: rectángulo (cx, cz, w, d, giro), con la textura repetida cada 'tile' metros
function drape(cx,cz,w,d,a,tex,tile,yo){
  const nx=Math.max(2,Math.ceil(w/4)),nz=Math.max(2,Math.ceil(d/4)),pos=[],uv=[],idx=[];
  for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const lx=-w/2+w*i/nx,lz=-d/2+d*j/nz,p=toW(lx,lz,cx,cz,a);pos.push(p[0],terrainH(p[0],p[1])+(yo||0.05),p[1]);uv.push(lx/tile,lz/tile);}
  for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const k=j*(nx+1)+i;idx.push(k,k+nx+1,k+1,k+1,k+nx+1,k+nx+2);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  const m=new THREE.Mesh(g,DMAT(tex));m.receiveShadow=true;scene.add(m);return m;
}
// une geometrías (cada una con su matriz) en una sola, sin índices
function mergeGeos(list){const P=[],N=[];for(const[g0,m]of list){const g=(g0.index?g0.toNonIndexed():g0.clone()).applyMatrix4(m);if(!g.attributes.normal)g.computeVertexNormals();P.push(...g.attributes.position.array);N.push(...g.attributes.normal.array);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.computeBoundingSphere();return g;}
// estatua ligera (figura con manto, unos 170 triángulos), para frontones, arcadas y nichos; mide 1,9 m con escala 1
const STATUE_G=(()=>{   // proporciones humanas: hombros más anchos que la base, cabeza proporcionada, dos brazos y un plinto (antes, de lejos, parecía una gallina)
  const body=new THREE.LatheGeometry(V2([[0,0],[0.3,0],[0.3,0.2],[0.19,0.2],[0.2,0.28],[0.17,0.75],[0.15,1.1],[0.18,1.32],[0.23,1.52],[0.2,1.6],[0.07,1.64],[0.06,1.7],[0,1.7]]),10);
  const head=new THREE.SphereGeometry(0.13,8,6),arm=new THREE.CylinderGeometry(0.055,0.045,0.6,5),fore=new THREE.CylinderGeometry(0.045,0.04,0.34,5);
  return mergeGeos([[body,new THREE.Matrix4()],[head,new THREE.Matrix4().makeScale(1,1.12,1).setPosition(0,1.82,0.01)],
    [arm,new THREE.Matrix4().makeRotationZ(0.12).setPosition(-0.27,1.25,0)],[arm,new THREE.Matrix4().makeRotationZ(-0.12).setPosition(0.27,1.25,0)],
    [fore,new THREE.Matrix4().makeRotationX(Math.PI/2-0.25).setPosition(0.3,0.98,0.16)]]);})();
const STAT={marble:[],bronze:[],gold:[]};
// cuadriga de bronce o dorada con su auriga: los cuatro caballos y el carro de Blender (sin modelos, bloques)
function quadriga(x,y,z,a,gold){const c=gold?'#c9a24a':'#7d6a3e',g=grp(x,y,z,a);
  if(GLB.ok&&GLB.parts.A_horse_body){for(let i=0;i<4;i++){const h=new THREE.Group();h.position.set(-1.3+i*0.86,0,1.1);animalGLB('A_horse',h,c,c);g.add(h);}if(GLB.parts.B_chariot){const ch=glbPart('B_chariot',{chariotpaint:lam(c),wood:lam(c)});ch.position.set(0,0,0);g.add(ch);}}
  else for(let i=0;i<4;i++)box(0.3,1.1,1.6,lam(c),-1.3+i*0.86,0.6,1.1,g);
  const p=toW(0,-0.7,x,z,a);statue(p[0],y+0.3,p[1],a,1.25,gold?'gold':'bronze');}
function statue(x,y,z,a,s,kind){const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),a||0);STAT[kind||'marble'].push({m:new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),q,new THREE.Vector3(s,s,s))});}
function flushStatues(){chunked(STATUE_G,lam('#ece4d6'),STAT.marble,{far:900});chunked(STATUE_G,lam('#8a6a3a'),STAT.bronze,{far:900});chunked(STATUE_G,lam('#d9a93a'),STAT.gold,{far:1400});}
// piezas repetidas (fuentes, altares, balcones…): {geo, mat, items:[{x,y,z,a,sx,sy,sz}]}
const PIECES=new Map();
function piece(key,geo,mat,x,y,z,a,sx,sy,sz){let p=PIECES.get(key);if(!p){p={geo,mat,list:[]};PIECES.set(key,p);}const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),a||0);p.list.push({m:new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),q,new THREE.Vector3(sx||1,sy||sx||1,sz||sx||1))});}
function flushPieces(){for(const p of PIECES.values())chunked(p.geo,p.mat,p.list,{far:700,shadow:false});}
const UNIT=(()=>{const g=new THREE.BoxGeometry(1,1,1);g.translate(0,0.5,0);return g;})(),UNITC=(()=>{const g=new THREE.CylinderGeometry(0.5,0.5,1,8);g.translate(0,0.5,0);return g;})();
// pieza en coordenadas locales de un edificio colocado en (x,y,z) con giro a
function pieceAt(key,geo,mat,b,lx,ly,lz,sx,sy,sz){const p=toW(lx,lz,b.x,b.z,b.a);piece(key,geo,mat,p[0],b.y+ly,p[1],b.a,sx,sy,sz);}

// calzadas de basalto: banda de rodadura y, en la ciudad, aceras elevadas con bordillo
function romaRoadsDecor(){
  const road=[],ruv=[],walk=[],wuv=[],curb=[],cuv=[],q=(arr,uvs,a,b,c,d,ta,tb,tc,td)=>{arr.push(...a,...b,...c,...a,...c,...d);uvs.push(...ta,...tb,...tc,...ta,...tc,...td);};
  // cruces: la acera de una calzada no se monta sobre otra (en el Velabro y en otros cruces se veían escalones de acera atravesando la calle),
  // y cada calzada va un pelo más alta que la anterior para que dos que se cruzan no parpadeen
  const SG=new Map(),SC=30;ROADS.forEach((r,ri)=>{const p=r.pts;for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1];for(let x=Math.floor(Math.min(a[0],b[0])/SC)-1;x<=Math.floor(Math.max(a[0],b[0])/SC)+1;x++)for(let z=Math.floor(Math.min(a[1],b[1])/SC)-1;z<=Math.floor(Math.max(a[1],b[1])/SC)+1;z++){const k=x+','+z;let A=SG.get(k);if(!A)SG.set(k,A=[]);A.push([ri,a,b,r.w/2]);}}});
  const inOther=(x,z,ri)=>{const A=SG.get(Math.floor(x/SC)+','+Math.floor(z/SC));if(!A)return false;for(const[rj,a,b,hw]of A){if(rj===ri)continue;const vx=b[0]-a[0],vz=b[1]-a[1],L2=vx*vx+vz*vz||1,u=Math.max(0,Math.min(1,((x-a[0])*vx+(z-a[1])*vz)/L2));if(Math.hypot(a[0]+vx*u-x,a[1]+vz*u-z)<hw+0.4)return true;}return false;};
  let RI=-1;
  for(const r of ROADS){RI++;const ri=RI,yo=(ri%7)*0.007;const p=r.pts,pts=[];for(let i=0;i<p.length-1;i++){const L=Math.hypot(p[i+1][0]-p[i][0],p[i+1][1]-p[i][1]),n=Math.max(1,Math.ceil(L/3));for(let k=0;k<n;k++)pts.push([lerp(p[i][0],p[i+1][0],k/n),lerp(p[i][1],p[i+1][1],k/n)]);}pts.push(p[p.length-1]);
    let s=0,prev=null;const w=r.w/2;
    for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1,nx=-dz/l,nz=dx/l,[x,z]=pts[i];if(i)s+=Math.hypot(x-pts[i-1][0],z-pts[i-1][1]);
      const ok=romaRiverDist(x,z)>romaRiverW(z)+14&&terrainH(x,z)>-0.5,city=romaInUrbs(x,z),P=(o,y)=>[x+nx*o,terrainH(x+nx*o,z+nz*o)+y,z+nz*o];
      const cur={ok,city,s,L:P(-w,0.12+yo),R:P(w,0.12+yo),wl:[P(-w,0.38),P(-w-1.8,0.38)],wr:[P(w,0.38),P(w+1.8,0.38)],xl:inOther(x-nx*(w+0.9),z-nz*(w+0.9),ri),xr:inOther(x+nx*(w+0.9),z+nz*(w+0.9),ri)};
      if(prev&&prev.ok&&ok){const u0=prev.s/3,u1=s/3,v=r.w/3;q(road,ruv,prev.L,prev.R,cur.R,cur.L,[u0,0],[u0,v],[u1,v],[u1,0]);
        if(prev.city&&city){if(!prev.xl&&!cur.xl){q(walk,wuv,prev.wl[0],prev.wl[1],cur.wl[1],cur.wl[0],[u0,0],[u0,0.9],[u1,0.9],[u1,0]);q(curb,cuv,prev.L,prev.wl[0],cur.wl[0],cur.L,[u0*2,0],[u0*2,1],[u1*2,1],[u1*2,0]);}
          if(!prev.xr&&!cur.xr){q(walk,wuv,prev.wr[1],prev.wr[0],cur.wr[0],cur.wr[1],[u0,0],[u0,0.9],[u1,0.9],[u1,0]);q(curb,cuv,prev.wr[0],prev.R,cur.R,cur.wr[0],[u0*2,1],[u0*2,0],[u1*2,0],[u1*2,1]);}}}
      prev=cur;}}
  const mk=(pos,uv,tex)=>{if(!pos.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();const m=DMAT(tex);m.side=THREE.DoubleSide;const me=new THREE.Mesh(g,m);me.receiveShadow=true;me.userData.drape=true;scene.add(me);};
  mk(road,ruv,'basalt');mk(walk,wuv,'walk');mk(curb,cuv,'curb');
}
// arco honorífico: un vano o tres (perfil extruido con los arcos recortados), columnas adosadas, ático con inscripción y grupo de bronce encima
function arch(o){
  const a=o.rot||0,W=o.W,D=o.D,H=o.H,h1=H*0.7,gy=minGround(o.x,o.z,W,D,a)-0.1,g=grp(o.x,gy,o.z,a);
  const spans=o.three?[[-W*0.39,-W*0.225,0.55],[-W*0.15,W*0.15,0.7],[W*0.225,W*0.39,0.55]]:[[-W*0.24,W*0.24,0.68]];
  const sh=new THREE.Shape();sh.moveTo(-W/2,0);sh.lineTo(-W/2,h1);sh.lineTo(W/2,h1);sh.lineTo(W/2,0);
  for(const[x0,x1,f]of[...spans].reverse()){const r=(x1-x0)/2,hs=h1*f-r;sh.lineTo(x1,0);sh.lineTo(x1,hs);sh.absarc((x0+x1)/2,hs,r,0,Math.PI,false);sh.lineTo(x0,0);}
  sh.lineTo(-W/2,0);
  const eg=new THREE.ExtrudeGeometry(sh,{depth:D,bevelEnabled:false,curveSegments:12});eg.translate(0,0,-D/2);const em=new THREE.Mesh(eg,TRAV);em.castShadow=true;em.receiveShadow=true;g.add(em);
  let x=-W/2;for(const[x0,x1]of[...spans,[W/2,W/2]]){if(x0-x>0.05){const p=toW((x+x0)/2,0,o.x,o.z,a);addBox(p[0],p[1],x0-x,D,a);}x=x1;}
  box(W+0.6,0.8,D+0.6,M.marble,0,h1+0.4,0,g);box(W,H-h1-0.8,D-0.4,TRAV,0,h1+0.8+(H-h1-0.8)/2,0,g);
  for(const s of[-1,1]){box(W*0.6,(H-h1)*0.5,0.08,lam('#e8dfcc'),0,h1+0.8+(H-h1-0.8)/2,s*(D/2-0.15),g);
    const cols=o.three?[-W/2+0.7,-W*0.19,W*0.19,W/2-0.7]:[-W/2+0.7,W/2-0.7];
    for(const e of cols){const p=toW(e,s*(D/2+0.35),o.x,o.z,a);box(1.1,1.2,0.9,M.marble,e,0.6,s*(D/2+0.3),g);addColumn(p[0],gy+1.2,p[1],0.38,h1-1.2,a,'corinthian',true);}}
  quadriga(o.x,gy+H,o.z,a,o.gold);
  if(o.three)for(const s of[-1,1]){const p=toW(s*(W/2-1),0,o.x,o.z,a);statue(p[0],gy+H,p[1],a,1.3,'bronze');}
  footprints.push({x:o.x,z:o.z,w:W,d:D,a,c:'#e4dac6',name:o.name});
}
function romaDecor(){
  // pavimentos de plazas
  drape(0,0,232,116,0,'trav',6,0.05);                 // Foro Romano
  drape(-85,-141,118,30,0,'trav',6,0.06);             // Foro de César
  drape(40,-195,104,108,0,'marble',4,0.06);           // Foro de Augusto: mármoles de colores (giallo antico, pavonazzetto, africano)
  drape(-640,-622,56,50,0,'trav',6,0.05);             // plaza ante el Panteón
  drape(-218,-32,108,82,0,'trav',6,0.14);             // área Capitolina (solo la cima llana)
  drape(480,-90,150,26,0,'trav',6,0.06);              // terraza de las Termas de Tito
  drape(-490,20,98,72,0,'trav',6,0.05);             // Pórtico de Octavia
  // anillo de travertino alrededor del anfiteatro, con los mojones que marcaban el recinto
  {const C=ROMA.col,A=94,B=78,gy=2;const P=(u,k)=>{const t=u*TAU,a=A+1+k*3,b=B+1+k*3;const x=a*Math.cos(t),z=b*Math.sin(t);return[x,terrainH(C.x+x,C.z+z)-gy+0.06,z];};   // siete filas: sigue la cuesta del Celio sin flotar
   const ring=new THREE.Mesh(ringGeo(7,240,P,null,()=>'#ffffff',90),DMAT('trav'));ring.position.set(C.x,gy,C.z);ring.receiveShadow=true;scene.add(ring);
   for(let i=0;i<80;i++){const t=i/80*TAU,x=C.x+(A+19)*Math.cos(t),z=C.z+(B+19)*Math.sin(t);piece('cippus',UNIT,TRAV,x,terrainH(x,z),z,t,0.7,1.6,0.5);}}
  romaRoadsDecor();
  // estatuas en los frontones y sobre los vértices de los templos
  for(const T of ROMA.peds){const f=T.L/2+0.25,top=T.y,kind=T.gold?'gold':'marble';
    const ap=toW(0,f,T.x,T.z,T.a);statue(ap[0],top+T.ph+0.1,ap[1],T.a,Math.min(1.6,T.W/14),T.gold?'gold':'bronze');
    for(const s of[-1,1]){const c=toW(s*(T.W/2-0.3),f,T.x,T.z,T.a);statue(c[0],top+0.2,c[1],T.a,Math.min(1.3,T.W/18),kind);}
    const n=Math.max(3,Math.round(T.W/4.2));for(let i=0;i<n;i++){const t=(i+0.5)/n*2-1,h=T.ph*(1-Math.abs(t))*0.8;if(h<0.9)continue;const p=toW(t*T.W*0.42,T.L/2-0.1,T.x,T.z,T.a);statue(p[0],top+0.15,p[1],T.a,Math.min(1.5,h/1.75),'marble');}
    if(T.gold){const qp=toW(0,f-2.2,T.x,T.z,T.a);quadriga(qp[0],top+T.ph*0.55,qp[1],T.a,true);}}
  // anfiteatro: estatuas en los arcos del segundo y tercer piso, escudos de bronce en el ático y mástiles del toldo (velario)
  {const C=ROMA.col,A=94,B=78,gy=2;for(let i=0;i<80;i++){const t=(i+0.5)/80*TAU,nx=Math.cos(t)/A,nz=Math.sin(t)/B,nl=Math.hypot(nx,nz),a=Math.atan2(nx/nl,nz/nl),x=C.x+(A-1.4)*Math.cos(t),z=C.z+(B-1.4)*Math.sin(t);
     statue(x,gy+10.5+1.3,z,a,1.15,'marble');statue(x,gy+22.3+1.3,z,a,1.15,'marble');
     if(i%2===0){const sx=C.x+(A+0.3)*Math.cos(t),sz=C.z+(B+0.3)*Math.sin(t);const sh=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,0.15,14),BRONZE2);sh.rotation.order='YXZ';sh.rotation.y=a;sh.rotation.x=Math.PI/2;sh.position.set(sx,gy+41,sz);scene.add(sh);}}
   for(let i=0;i<240;i++){const t=i/240*TAU,x=C.x+(A-1)*Math.cos(t),z=C.z+(B-1)*Math.sin(t);piece('mast',UNITC,M.wood,x,gy+47.5,z,0,0.25,4.2,0.25);}}
  // Foro de Augusto: estatuas de los grandes hombres de Roma en los pórticos y Augusto en su cuadriga en el centro
  {const gy=romaH(40,-195);for(let z=-244;z<=-148;z+=6){statue(-21.5,gy+0.6,z,Math.PI/2,1.1,'marble');statue(101.5,gy+0.6,z,-Math.PI/2,1.1,'marble');}
   box(4.2,1.8,5.6,M.marble,40,gy+0.9,-160);box(4.6,0.3,6,M.marble,40,gy+1.95,-160);quadriga(40,gy+2.1,-160,0,true);addBox(40,-160,4.2,5.6,0);}
  // estatuas sobre los áticos de las basílicas, y en el Foro de César, la de su fundador
  for(const[x,z,L,a]of[[20,-48,88,0],[-25,39,84,Math.PI]]){for(let i=0;i<12;i++){const lx=-L/2+3+i*(L-6)/11,p=toW(lx,0,x,z,a);statue(p[0],romaH(x,z)+20.6,p[1],a,1.05,'marble');}}
  {const gy=romaH(-70,-141);box(3,3.2,4,M.marble,-70,gy+1.6,-141);statue(-70,gy+3.2,-141,Math.PI/2,1.5,'bronze');addBox(-70,-141,3,4,0);}
  // arcos honoríficos
  arch({x:71,z:22,rot:0,W:16,D:6,H:13,three:true,name:'Arco de Augusto'});
  arch({x:-84,z:2,rot:Math.PI/2,W:9,D:4,H:11,name:'Arco de Tiberio'});
  // monumentos menores del Foro: columnas rostrales, Miliario de Oro, Ombligo de Roma, Lacus Curtius y Lapis Niger
  for(const[x,z]of[[-58,-26],[-58,10]]){const gy=romaH(x,z);box(2,1.6,2,M.marble,x,gy+0.8,z);addColumn(x,gy+1.6,z,0.55,9,0,'doric',true);for(let k=0;k<3;k++)for(let s=0;s<4;s++){const t=s*Math.PI/2,b=new THREE.Mesh(new THREE.ConeGeometry(0.22,1.1,5),BRONZE2);b.rotation.z=Math.PI/2;b.rotation.y=-t;b.position.set(x+Math.cos(t)*0.75,gy+3.5+k*2.2,z+Math.sin(t)*0.75);scene.add(b);}statue(x,gy+10.8,z,-Math.PI/2,1.1,'bronze');addCirc(x,z,1.1);}
  {const x=-80,z=-24,gy=romaH(x,z);const c=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.5,2.2,16),M.gold);c.position.set(x,gy+1.6,z);scene.add(c);box(1.4,0.5,1.4,M.marble,x,gy+0.25,z);addCirc(x,z,0.8);}
  {const x=-82,z=-12,gy=romaH(x,z);const c=new THREE.Mesh(new THREE.CylinderGeometry(1.6,2,1.4,20),TRAV);c.position.set(x,gy+0.7,z);scene.add(c);const c2=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.4,1,20),TRAV2);c2.position.set(x,gy+1.9,z);scene.add(c2);addCirc(x,z,2);}
  {const x=12,z=-4,gy=romaH(x,z);for(const[w,d,px,pz]of[[9,0.3,0,-3.5],[9,0.3,0,3.5],[0.3,7,-4.5,0],[0.3,7,4.5,0]]){box(w,0.8,d,M.marble,x+px,gy+0.4,z+pz);}const pv=box(8.6,0.06,6.6,lam('#6f6a5e'),x,gy+0.06,z);addBox(x,z,9,7,0,0.15);
   const al=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.6,1,10),M.marble);al.position.set(x,gy+0.5,z);scene.add(al);}
  {const x=-48,z=-38,gy=romaH(x,z);box(4,0.06,3,lam('#1f1d1b'),x,gy+0.08,z);for(const[w,d,px,pz]of[[4.2,0.12,0,-1.55],[4.2,0.12,0,1.55],[0.12,3.2,-2.1,0],[0.12,3.2,2.1,0]])box(w,0.9,d,M.marble,x+px,gy+0.45,z+pz);addBox(x,z,4.2,3.2,0,0.1);}
  // fuentes públicas (lacus) y altares de los lares de las encrucijadas por las calles; miliarios en las calzadas
  const W2=lam('#5f8f96');let nf=0,nc=0,nm=0;
  for(const r of ROADS){const p=r.pts;let acc=0,side=1;for(let i=0;i<p.length-1;i++){const dx=p[i+1][0]-p[i][0],dz=p[i+1][1]-p[i][1],L=Math.hypot(dx,dz),ux=dx/L,uz=dz/L;
    for(let d=20;d<L;d+=12){acc+=12;const x0=p[i][0]+ux*d,z0=p[i][1]+uz*d,city=romaInUrbs(x0,z0);const step=city?96:150;if(acc<step)continue;acc=0;side=-side;
      const off=r.w/2+(city?3.6:2.2),x=x0-uz*off*side,z=z0+ux*off*side,a=Math.atan2(-uz*side,ux*side)+Math.PI/2,ar=Math.atan2(x0-x,z0-z);
      if(romaRiverDist(x,z)<romaRiverW(z)+10||!isFree(x,z,1.6)||footHit(x,z,1.5))continue;const gy=terrainH(x,z);
      if(!city){piece('mile',UNITC,TRAV,x,gy,z,0,0.7,1.7,0.7);addCirc(x,z,0.4);nm++;continue;}
      const b={x,y:gy,z,a:ar};
      if((nf+nc)%3!==2){pieceAt('lacusB',UNIT,TRAV,b,0,0,0,2.8,0.9,1.6);pieceAt('lacusW',UNIT,W2,b,0,0.86,0,2.5,0.05,1.3);pieceAt('lacusP',UNIT,TRAV2,b,0,0,-0.95,0.7,1.7,0.4);pieceAt('lacusM',UNITC,BRONZE2,b,0,1.15,-0.7,0.18,0.18,0.18);addBox(x,z,2.8,1.9,ar);nf++;
        if(nf===1)place('ro_lacus','Fuente pública','LACVS','Una de las cientos de fuentes públicas (lacus) de Roma: un pilón de piedra al que cae sin parar el agua de los acueductos por un caño de bronce. De aquí sacan el agua los vecinos de las ínsulas, que no la tienen en casa. Agripa, como edil en el 33 a.C., construyó 700 pilones y 105 fuentes; según Frontino, a finales del siglo I había casi 600 fuentes públicas. El agua que rebosa limpia las calles y va a las cloacas.',x-uz*2.5*side,z+ux*2.5*side,ar);}
      else{pieceAt('compB',UNIT,TRAV,b,0,0,0,1.6,1.1,1.1);pieceAt('compT',UNIT,lam('#a8392b'),b,0,1.1,0,1.3,1.3,0.9);pieceAt('compN',UNIT,M.dark,b,0,1.3,0.43,0.7,0.8,0.06);pieceAt('compR',GABLE,M.tile,b,0,2.4,0,1.6,0.6,1.1);addBox(x,z,1.6,1.1,ar);nc++;
        if(nc===1)place('ro_compitum','Altar de los lares de la encrucijada','LARES COMPITALES','En cada cruce de calles hay un pequeño santuario de los lares compitales, los dioses protectores del barrio. Augusto reorganizó la ciudad en 265 barrios (vici) y unió este culto al de su propio genio: cada barrio elige cuatro magistrados, a menudo libertos, que cuidan el altar y celebran las fiestas Compitalia en enero.',x-uz*2.5*side,z+ux*2.5*side,ar);}}}}
  // balcones de madera en las fachadas de las ínsulas (maeniana)
  if(ROMA.houses){const WD=lam('#8a6340'),WD2=lam('#a07a4a');for(const[k,f,w,hy]of[['H_insa',8,12,9.0],['H_insb',7,9,8.3]])for(const it of ROMA.houses[k]){if(hash(it.x,it.z)<0.4)continue;const b={x:it.x,y:it.y,z:it.z,a:it.a},y=hy*it.sy;
     pieceAt('balF',UNIT,WD,b,0,y,f+0.65,w,0.18,1.3);pieceAt('balR',UNIT,WD2,b,0,y+0.18,f+1.25,w,0.9,0.07);for(const s of[-1,0,1])pieceAt('balS',UNIT,WD2,b,s*w*0.45,y-0.9,f+0.4,0.15,0.9,0.15);}}
  place('ro_calzada','Las calzadas y las aceras','VIAE','Las calles principales de Roma se pavimentan con grandes losas poligonales de basalto (basoli), encajadas como un rompecabezas sobre capas de grava y cal. A los lados, aceras elevadas (crepidines) con bordillos de piedra protegen a los peatones del barro y de los carros, que desde César no pueden circular de día por el centro salvo para obras públicas. Fuera de la ciudad, las calzadas llevan miliarios que marcan la distancia desde Roma.',-50,-16,0);
  place('ro_miliario','El Miliario de Oro','MILLIARIVM AVREVM','Una columna de bronce dorado que Augusto levantó en el 20 a.C. junto a los Rostra, como punto de partida simbólico de todas las calzadas del imperio: en ella estaban escritas las distancias desde Roma a las principales ciudades. De ahí el dicho «todos los caminos llevan a Roma». Muy cerca, el Ombligo de la Ciudad (Umbilicus Urbis) marca su centro.',-80,-28,0);
  place('ro_curtius','Lacus Curtius','LACVS CVRTIVS','Un pequeño recinto con un pozo seco en medio del Foro. Según una leyenda, en el 362 a.C. se abrió aquí una sima que solo se cerraría si Roma sacrificaba lo que más valía; el joven Marco Curcio, entendiendo que eso eran el valor y las armas, se lanzó dentro a caballo. Otra versión lo relaciona con un guerrero sabino de la época de Rómulo. Los romanos echan monedas en él para pedir buena salud al emperador.',12,-10,0);
  place('ro_lapis','Lapis Niger','LAPIS NIGER','Un trozo de pavimento de mármol negro, cercado, delante de la Curia. Señala un lugar funesto: unos dicen que la tumba de Rómulo, otros la de su padre adoptivo Fáustulo. Debajo hay un altar arcaico y una piedra con una de las inscripciones latinas más antiguas, del siglo VI a.C., que habla de un rey.',-48,-43,0);
  place('ro_rostrales','Columnas rostrales','COLVMNAE ROSTRATAE','Columnas adornadas con espolones de bronce de naves enemigas, como la que honró a Gayo Duilio por la primera victoria naval romana sobre Cartago, en Milas (260 a.C.). Augusto dedicó otras con los espolones de la flota de Antonio y Cleopatra tras la batalla de Accio.',-62,-26,0);
  place('ro_arco_augusto','Arco de Augusto','ARCVS AVGVSTI','Arco de tres vanos entre el templo del Divino Julio y el de Cástor, dedicado por el Senado a Augusto en el 19 a.C., cuando los partos devolvieron las enseñas militares que habían capturado a Craso en Carras. En sus pilares se grabaron las listas de cónsules y de generales que habían celebrado un triunfo (los Fastos). Encima, el emperador en una cuadriga de bronce.',71,30,0);
  place('ro_arco_tiberio','Arco de Tiberio','ARCVS TIBERII','Arco levantado en el 16 d.C. junto al templo de Saturno para celebrar que Germánico había recuperado las enseñas de las legiones de Varo, perdidas en el bosque de Teutoburgo siete años antes.',-78,2,Math.PI/2);
  flushStatues();flushPieces();
  ROMA.decor={fountains:nf,compita:nc,miles:nm};
}

// carreras en el Circo y combate en la arena
function updateRome(dt,t){
  // procesión de los fieles de Isis por el patio del Iseo y galos de la Gran Madre bailando
  if(ROMA.isiacs&&Math.hypot(player.x+525,player.z+340)<220){const L=40,per=2*L,base=(t*0.9)%per;for(const o of ROMA.isiacs){let s=(base-o.k*1.8+per)%per;const back=s>L;const z=-360+(back?per-s:s),x=-525+(back?1.4:-1.4);
    o.g.position.set(x,floorAt(x,z),z);o.g.rotation.y=back?Math.PI:0;const ar=o.g.userData.arms;if(ar){ar[0].rotation.x=Math.sin(t*6+o.k)*0.3;ar[1].rotation.x=o.k?-1.2+Math.sin(t*14+o.k)*0.25:-0.3;}}}
  if(ROMA.galli&&Math.hypot(player.x+75,player.z-220)<160)for(const o of ROMA.galli){const ar=o.g.userData.arms;o.g.rotation.y+=Math.sin(t*2+o.ph)*0.01;o.g.position.y=floorAt(o.g.position.x,o.g.position.z)+Math.abs(Math.sin(t*4+o.ph))*0.12;if(ar){ar[0].rotation.x=-1.4+Math.sin(t*8+o.ph)*0.4;ar[1].rotation.x=-1.0+Math.sin(t*8+o.ph+1.5)*0.5;}}
  const c=ROMA.circus,near=c&&Math.hypot(player.x-c.C.x,player.z-c.C.z)<700;if(c)for(const ch of ROMA.chariots)ch.g.visible=near;
  if(near){const Lh=200;
    for(const ch of ROMA.chariots){const R=22+ch.lane*0.5,per=4*Lh+TAU*R;ch.s=(ch.s+ch.v*dt*(1+0.06*Math.sin(t*0.3+ch.ph)))%per;let s=ch.s,x,z,a;
      if(s<2*Lh){x=Lh-s;z=-R;a=-Math.PI/2;}else if((s-=2*Lh)<Math.PI*R){const th=-Math.PI/2-s/R;x=-Lh+Math.cos(th)*R;z=Math.sin(th)*R;a=Math.PI-th;}
      else if((s-=Math.PI*R)<2*Lh){x=-Lh+s;z=R;a=Math.PI/2;}else{s-=2*Lh;const th=Math.PI/2-s/R;x=Lh+Math.cos(th)*R;z=Math.sin(th)*R;a=Math.PI-th;}
      {const P0=c.cr?c.cr(x,z):[c.C.x+x,c.C.z+z];ch.g.position.set(P0[0],1.02,P0[1]);}ch.g.rotation.y=a+(c.CA||0);const ph=t*14+ch.ph;ch.legs.forEach((l,i)=>{l.rotation.x=Math.sin(ph+(i%4===0||i%4===3?0:Math.PI))*0.6;});}}
  const C=ROMA.col;if(C&&ROMA.glad.length&&Math.hypot(player.x-C.x,player.z-C.z)<260){const[a,b,j]=ROMA.glad,th=t*0.5,r=2.6+Math.sin(t*1.7)*0.6;
    a.position.x=C.x+8+Math.cos(th)*r;a.position.z=C.z-6+Math.sin(th)*r;b.position.x=C.x+8-Math.cos(th)*r;b.position.z=C.z-6-Math.sin(th)*r;
    a.rotation.y=Math.atan2(b.position.x-a.position.x,b.position.z-a.position.z);b.rotation.y=a.rotation.y+Math.PI;
    for(const[g,o]of[[a,0],[b,1.6]]){const ar=g.userData.arms;if(ar){ar[1].rotation.x=-1.2+Math.sin(t*5+o)*0.9;ar[0].rotation.x=-0.6;}}
    j.rotation.y=Math.atan2(a.position.x-j.position.x,a.position.z-j.position.z);}
  if(ROMA.wheel)ROMA.wheel.rotation.z=t*0.6;
  {const near=Math.hypot(player.x-60,player.z+92)<190;if(near!==ROMA.schoolNear){ROMA.schoolNear=near;for(const k of ROMA.school)k.visible=near;}}   // alumnos de las dos escuelas del Argileto
  updateRomaTheatre(dt,t);
}

