// ============================================================ destinos nuevos (Grecia, Italia, Hispania): piezas comunes
function DP(I,lx,lz){return[I.x+lx,I.z+lz];}
// muralla circular con puertas (ángulos) y torres cada «tw» tramos; socle: zócalo de piedra con adobe encima
function ringWall(cx,cz,r,gates,mat,h,tw,socle){
  const N=Math.max(36,Math.round(r*TAU/9));
  for(let i=0;i<N;i++){const t0=i/N*TAU,t1=(i+1)/N*TAU,mid=(t0+t1)/2;if(gates.some(g=>Math.abs(wrapA(mid-g))<4.5/r))continue;
    const ax=cx+Math.cos(t0)*r,az=cz+Math.sin(t0)*r,bx=cx+Math.cos(t1)*r,bz=cz+Math.sin(t1)*r,len=Math.hypot(bx-ax,bz-az),g0=Math.min(terrainH(ax,az),terrainH(bx,bz)),ry=Math.atan2(bx-ax,bz-az);
    if(socle){box(2.6,3,len+0.4,socle,(ax+bx)/2,g0+0.5,(az+bz)/2).rotation.y=ry;box(2.2,h-2,len+0.4,mat,(ax+bx)/2,g0+2+(h-2)/2,(az+bz)/2).rotation.y=ry;}
    else box(2.4,h+3,len+0.4,mat,(ax+bx)/2,g0+h/2-1.5,(az+bz)/2).rotation.y=ry;
    addSeg(ax,az,bx,bz,1.2);
    if(tw&&i%tw===0){box(6,h+4,6,socle||mat,ax,terrainH(ax,az)+(h+4)/2-2,az).rotation.y=ry;addCirc(ax,az,3.6);}}
  for(const g of gates)for(const s of[-1,1]){const t=g+s*5.5/r,x=cx+Math.cos(t)*r,z=cz+Math.sin(t)*r;box(6,h+5,6,socle||mat,x,terrainH(x,z)+(h+5)/2-2,z).rotation.y=-t;addCirc(x,z,3.6);}
  footprints.push({x:cx,z:cz,r,c:'rgba(0,0,0,0)',noFlat:true,reserve:true});
}
// muralla rectangular con una puerta en el centro de cada lado
function rectWall(cx,cz,w,d,mat,h){
  const sides=[[[-w/2,-d/2],[w/2,-d/2]],[[w/2,-d/2],[w/2,d/2]],[[w/2,d/2],[-w/2,d/2]],[[-w/2,d/2],[-w/2,-d/2]]];
  for(const[a,b]of sides){const mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2;for(const[p,q]of[[a,[mx-(b[0]-a[0])*4/Math.hypot(b[0]-a[0],b[1]-a[1]),mz-(b[1]-a[1])*4/Math.hypot(b[0]-a[0],b[1]-a[1])]],[[mx+(b[0]-a[0])*4/Math.hypot(b[0]-a[0],b[1]-a[1]),mz+(b[1]-a[1])*4/Math.hypot(b[0]-a[0],b[1]-a[1])],b]]){
      const ax=cx+p[0],az=cz+p[1],bx=cx+q[0],bz=cz+q[1],len=Math.hypot(bx-ax,bz-az),g0=Math.min(terrainH(ax,az),terrainH(bx,bz));box(2.2,h+3,len,mat,(ax+bx)/2,g0+h/2-1.5,(az+bz)/2).rotation.y=Math.atan2(bx-ax,bz-az);addSeg(ax,az,bx,bz,1.1);}
    for(const s of[-1,1]){const tx=cx+mx+s*(b[0]-a[0])*5.5/Math.hypot(b[0]-a[0],b[1]-a[1]),tz=cz+mz+s*(b[1]-a[1])*5.5/Math.hypot(b[0]-a[0],b[1]-a[1]);box(5,h+5,5,mat,tx,terrainH(tx,tz)+(h+5)/2-2,tz);addCirc(tx,tz,3);}}
  for(const[a]of sides){const x=cx+a[0],z=cz+a[1];box(6,h+4,6,mat,x,terrainH(x,z)+(h+4)/2-2,z);addCirc(x,z,3.5);}
}
// teatro griego excavado en la ladera: gradas algo más allá del semicírculo, orquesta circular de tierra batida
// (aquí había una primera versión de greekTheatre(x,z,a,R0,R1,name) que nunca se usaba: la que vale es greekTheatre(o), en 032_glosario_lateral.js)
// estadio: pista de arena entre dos taludes, con las líneas de salida y llegada de piedra
function stadiumG(x,z,a,Lg,W,name){
  const gy=minGround(x,z,W,Lg,a)-0.05,g=grp(x,gy,z,a);
  box(W,0.3,Lg,lam('#d8c39a'),0,0.12,0,g);for(const e of[-1,1])box(W,0.12,0.6,M.limestone,0,0.32,e*(Lg/2-2),g);
  for(const s of[-1,1]){const t=box(10,4,Lg+10,lam('#9a9a62'),s*(W/2+5),0.6,0,g);t.rotation.z=s*0.35;const p=toW(s*(W/2+2.5),0,x,z,a);addBox(p[0],p[1],3,Lg+10,a);}
  addPlat(x,z,W,Lg,a,gy+0.27);footprints.push({x,z,w:W,d:Lg,a,c:'#d8c39a',name,noFlat:true});
}
function tumulus(x,z,r,h,col){const m=new THREE.Mesh(new THREE.SphereGeometry(r,24,10,0,TAU,0,Math.PI/2),lam(col||'#8f8a5a'));m.scale.y=h/r;m.position.set(x,terrainH(x,z)-0.3,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);addCirc(x,z,r*0.95);return m;}
function pool(x,z,w,d,y){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshPhongMaterial({color:'#3f7a8a',shininess:80}));m.rotation.x=-Math.PI/2;m.position.set(x,(y!==undefined?y:terrainH(x,z))+0.12,z);scene.add(m);return m;}
const SMOKE_TEX=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(120,115,110,0.85)');g.addColorStop(0.6,'rgba(110,105,100,0.4)');g.addColorStop(1,'rgba(100,95,90,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);})();
const PLUMES=[];
function plume(x,y,z,n,s){const g=new THREE.Group();g.position.set(x,y,z);scene.add(g);for(let i=0;i<n;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:SMOKE_TEX,transparent:true,depthWrite:false,opacity:0.8}));sp.userData.ph=i/n;g.add(sp);}PLUMES.push({g,s});return g;}
function updatePlumes(t){for(const P of PLUMES){if(Math.abs(player.x-P.g.position.x)>2600)continue;for(const sp of P.g.children){const f=(t*0.02+sp.userData.ph)%1;sp.position.set(Math.sin(f*7+sp.userData.ph*9)*P.s*0.6+f*P.s*1.5,f*P.s*4,Math.cos(f*5)*P.s*0.4);const k=P.s*(0.4+f*1.4);sp.scale.set(k,k,1);sp.material.opacity=0.75*(1-f);}}}
// casas de un destino: griegas con patio o romanas (domus e ínsulas de Blender); evita los solares ocupados
function destHouses(I,cx,cz,n,spread,roman,opt){opt=opt||{};let k=0;const G={H_dom:[],H_insb:[]},walls=['#e3d8c2','#e9c9a0','#d8b48a','#efe2c8'],roofs=['#b0563a','#a24d33','#bf6a45'];
  for(let tries=0;tries<n*12&&k<n;tries++){const x=cx+rr(-spread,spread)*(opt.sx||1),z=cz+rr(-spread,spread)*(opt.sz||1);
    if(opt.inside&&!opt.inside(x,z))continue;if(I.pads.some(p=>p.noHouse!==false&&p.house!==true&&Math.hypot(x-p.x,z-p.z)<p.r+(p.road?(roman?26:14):9)))continue;   // los caminos entre mapas quedan libres
    if(I.arrive&&x>I.arrive.x-6&&x<I.arrive.x+24&&z>I.arrive.z-20&&z<I.arrive.z+60)continue;   // la franja de las estelas, junto a la llegada
    if(PLACES.some(q=>Math.abs(q.x-x)<24&&Math.abs(q.z-z)<26))continue;   // ninguna casa encima de un cartel
    const h0=terrainH(x,z);if(h0<1.4)continue;if(I.chkFree&&!isFree(x,z,11))continue;if(Math.abs(terrainH(x+7,z)-terrainH(x-7,z))+Math.abs(terrainH(x,z+7)-terrainH(x,z-7))>4)continue;
    if(footprints.some(f=>f.r?Math.hypot(x-f.x,z-f.z)<(f.reserve?0:f.r+8):Math.abs(x-f.x)<(f.w||0)/2+9&&Math.abs(z-f.z)<(f.d||0)/2+9))continue;
    const a=(opt.a||0)+(R()<0.5?0:Math.PI/2)+rr(-0.06,0.06);
    if(roman&&GLB.ok&&GLB.parts.H_insa_brick){const kd=R()<0.6?'H_dom':'H_insb',B=kd==='H_dom'?[26,42]:[16,14];{const sc=kd==='H_dom'?1.45:1;let lo=1e9,hi=-1e9;for(const[i,j]of[[-1,-1],[1,-1],[-1,1],[1,1],[0,0],[-1,0],[1,0],[0,-1],[0,1]]){const p=toW(i*B[0]*sc/2,j*B[1]*sc/2,x,z,a),h=terrainH(p[0],p[1]);lo=Math.min(lo,h);hi=Math.max(hi,h);}if(hi-lo>3)continue;}/* toda la planta sobre suelo casi llano: que no quede media casa en el aire */{const M=Math.max(B[0],B[1]);if(footprints.some(f=>f.house&&Math.abs(x-f.x)<(Math.max(f.w||0,f.d||0)+M)/2+2&&Math.abs(z-f.z)<(Math.max(f.w||0,f.d||0)+M)/2+2))continue;}const gy=minGround(x,z,B[0],B[1],a);
      G[kd].push({x,y:gy,z,a,sx:kd==='H_dom'?1.45:1,sy:kd==='H_dom'?1.2:rr(0.6,0.8),sz:kd==='H_dom'?1.4:1,cw:new THREE.Color(pick(walls)),cp:new THREE.Color(pick(walls)),cr:new THREE.Color(pick(roofs))});addBox(x,z,B[0],B[1],a);footprints.push({x,z,w:B[0],d:B[1],a,c:'#cdb994',house:true});}
    else courtyardHouse(x,z,a,rr(9,13),rr(9,12),rr(3.2,4),R()<0.15);
    k++;}
  for(const kd in G)placeModules(kd,G[kd],{far:1200,cell:320});}
// habitantes con frases sueltas (como islandVillagers), vestidos a la romana
function romaVillagers(I,cx,cz,n,barks){for(let i=0;i<n;i++){const fem=R()<0.4,x=cx+rr(-16,16),z=cz+rr(-16,16);
  const g=makePerson(fem?{female:true,chiton:pick(['#e8dfcc','#d7c9ab','#e2c7a0']),himation:pick(['#7a5a3a','#4f6a7d','#8a3f2f','#6a5a7a']),hair:pick(['#3b2a1e','#5b4532','#2a1a12'])}:{short:true,noHimation:true,chiton:pick(['#c9b48b','#a08a62','#d7c9ab','#8a7350']),hair:pick(['#3b2a1e','#5b4532','#2a1a12']),beard:R()<0.2});
  const p=findFree(x,z,0.8);g.position.set(p[0],floorAt(p[0],p[1]),p[1]);g.rotation.y=R()*TAU;scene.add(g);walkers.push({g,mode:'idle',tx:p[0],tz:p[1],wait:Infinity,speed:0,phase:R()*10,x:p[0],z:p[1],barks});}}
function destTrees(I,n,kinds){const tr=[];for(let k=0;k<n*4&&tr.length<n;k++){const a=R()*TAU,d=Math.sqrt(R())*I.R*1.25,x=I.x+Math.cos(a)*d,z=I.z+Math.sin(a)*d;const h=terrainH(x,z);if(h<2||h>I.H*3+60)continue;
  if(I.pads.some(p=>Math.hypot(x-p.x,z-p.z)<p.r+10))continue;if(footprints.some(f=>f.r?Math.hypot(x-f.x,z-f.z)<f.r+4:Math.abs(x-f.x)<(f.w||0)/2+5&&Math.abs(z-f.z)<(f.d||0)/2+5))continue;tr.push({x,z,kind:pick(kinds)});}
  if(GLB.ok)treesGLB(tr);else islandTrees(tr.map(t=>[t.x,t.z]));}
function caveMouth(x,z,a){const gy=minGround(x,z,4,3,a),gt=Math.max(gy,terrainH(x,z)),g=grp(x,gy,z,a);box(4,3.2+(gt-gy),3,lam('#1a1512'),0,(3.2+(gt-gy))/2,-1.2,g);
  for(let i=0;i<9;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(0.9+R()*1.3,0),M.stone),lx=rr(-4.5,4.5),lz=rr(-2,0.5),w=toW(lx,lz,x,z,a);r.position.set(lx,terrainH(w[0],w[1])-gy+rr(-0.2,2.6),lz);g.add(r);}   /* cada roca apoyada en el terreno de su sitio */addCirc(x,z-1,2.4);return g;}

function buildIslands(){
  defineIslandLayout();defineMainlandLayout();defineGates();
  const treePts=[];
  for(const I of ISLANDS){
    buildIslandMesh(I);
    const sh=I.land?[I.x-I.R*0.6,I.z]:shoreAlong(I.x,I.z,I.dir[0],I.dir[1],I.R*1.6);
    if(!I.land)buildPort(I.id,I.name,sh[0],sh[1],I.dir[0],I.dir[1]);
    I.port=sh;
    for(let k=0;k<(I.desert?0:500);k++){const a=R()*TAU,d=Math.sqrt(R())*I.R*0.95,x=I.x+Math.cos(a)*d,z=I.z+Math.sin(a)*d;const h=terrainH(x,z);if(h<3||h>I.H*0.8)continue;if(I.pads.some(p=>Math.hypot(x-p.x,z-p.z)<p.r+8))continue;if(Math.hypot(x-sh[0],z-sh[1])<40)continue;treePts.push([x,z]);}
  }
  const[E,De,N,C,L]=ISLANDS;
  // Egina: templo de Afaya (c. 500), 13,77 x 28,82 m, 6 x 12 columnas
  {const s=E.site;temple({name:'Templo de Afaya',x:s.x,z:s.z,rot:Math.PI/2,W:13.77,L:28.82,nW:6,nL:12,colD:0.98,colH:5.27,entH:1.9,pedH:1.7,steps:3,stepH:0.3,gy:s.h,roofMat:M.marble,sculpt:11,cella:{w:8,l:15.5,oz:-0.5,door:2.6,antis:3.2,antisCols:true,antisBack:true,backDoor:true}});
   NPC_POS.egina=[s.x+19,s.z+3,Math.PI/2];place('afaya','Templo de Afaya','ΑΦΑΙΑ','Templo dórico de hacia el 500, de unos 13,8 por 28,8 metros, en lo alto de un pinar al noreste de la isla. Está dedicado a Afaya, una diosa local identificada con la cretense Britomartis. Sus frontones muestran las guerras de Troya presididas por Atenea; los guerreros, pintados con colores vivos, son de lo mejor de la escultura de su tiempo.',s.x+20,s.z-5,Math.PI/2);
   const t=E.town;temple({name:'Templo de Apolo',x:t.x+10,z:t.z-22,rot:-Math.PI/2,W:8,L:14,nW:4,prostyle:true,amphi:true,colD:0.7,colH:5,gy:t.h,cella:{w:7,l:8,door:2.2}});
   for(let i=0;i<8;i++){const hx=t.x+rr(-30,30),hz=t.z+rr(-10,38);if(Math.hypot(hx-(t.x+10),hz-(t.z-22))<14)continue;courtyardHouse(hx,hz,R()<0.5?0:Math.PI/2,rr(9,12),rr(9,12),3.4,false);}
   islandVillagers(E,t.x,t.z+10,4,['Las tortugas de Egina corren por todos los mercados del mar. Las nuestras, no las lechuzas.','¿Ateniense? Mi abuelo fue expulsado de esta isla por los tuyos. Volvimos con Lisandro.','Dicen que Éaco sigue juzgando a los muertos. Que me encuentre de buen humor.']);
   place('egina_puerto','Puerto de Egina','ΑΙΓΙΝΑ','Egina fue una gran potencia comercial: sus monedas de plata con una tortuga están entre las primeras de Grecia. Enemiga de Atenas, en el 431 los atenienses expulsaron a sus habitantes y repartieron la isla entre colonos atenienses. Tras la derrota ateniense del 404, Lisandro devolvió la isla a los eginetas. Durante la guerra de Corinto sus corsarios saquearon el Ática, hasta la Paz del Rey.',t.x+4,t.z+2,0);}
  // Delos: lago sagrado, palmera, leones, Keraton, templo de los atenienses
  {const s=De.sanct,lk=De.lake;const w=new THREE.Mesh(new THREE.CircleGeometry(1,40),new THREE.MeshPhongMaterial({color:'#3f7a8a',shininess:80}));w.rotation.x=-Math.PI/2;w.scale.set(20,15,1);w.position.set(lk.x,lk.h+0.08,lk.z);scene.add(w);
   for(let i=0;i<24;i++){const a=i/24*TAU;addCirc(lk.x+Math.cos(a)*19,lk.z+Math.sin(a)*14.5,1.2);}
   palm(lk.x-22,lk.z-6);
   for(let i=0;i<9;i++)lion(lk.x-34,lk.z-30+i*5.5,Math.PI/2);
   temple({name:'Templo de los atenienses',x:s.x+10,z:s.z-20,rot:-Math.PI/2,W:11.5,L:17.5,nW:6,prostyle:true,amphi:true,colD:0.72,colH:5.4,gy:s.h,roofMat:M.marble,cella:{w:9,l:9,door:2.6}});
   {const gx=s.x-18,gz=s.z-24,gy=s.h,W=13.5,Lg=29.5;box(W+1.2,1.2,Lg+1.2,M.marble,gx,gy+0.1,gz);addPlat(gx,gz,W+1.2,Lg+1.2,0,gy+0.7);
     for(let i=0;i<6;i++)for(let j=0;j<13;j++){if(i>0&&i<5&&j>0&&j<12)continue;if(R()<0.3)continue;const h=R()<0.5?rr(1,3):5.2;const c=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.55,h,14),M.marble);c.position.set(gx-W/2+0.9+i*(W-1.8)/5,gy+0.7+h/2,gz-Lg/2+0.9+j*(Lg-1.8)/12);c.castShadow=true;scene.add(c);addCirc(c.position.x,c.position.z,0.6);}
     footprints.push({x:gx,z:gz,w:W,d:Lg,a:0,c:'#efe7d8',name:'Gran templo'});}
   {const kx=s.x+6,kz=s.z+22;box(5,1.6,3,M.marble,kx,s.h+0.8,kz);for(let i=0;i<14;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.7,5),lam('#d8ccb0'));h.position.set(kx-2.2+(i%7)*0.73,s.h+1.95,kz+(i<7?-0.6:0.6));h.rotation.z=(i%2?0.5:-0.5);scene.add(h);}addBox(kx,kz,5,3,0);
     place('keraton','Altar de cuernos (Keraton)','ΚΕΡΑΤΩΝ','El altar que, según el mito, construyó Apolo de niño con cuernos de cabra entrelazados. Teseo bailó a su alrededor la danza de la grulla al volver de Creta. Su identificación arqueológica es discutida.',kx+5,kz,0);}
   NPC_POS.delos=[lk.x-14,lk.z-16,0];
   place('delos_lago','Lago sagrado y palmera de Leto','ΛΙΜΝΗ','El lago redondo junto al que, según el mito, nació Apolo. En la orilla crece una palmera sagrada: ya en la Odisea, Ulises recuerda haber visto en Delos un joven retoño de palmera junto al altar de Apolo.',lk.x-20,lk.z+18,0);
   place('leones','Terraza de los leones','ΛΕΟΝΤΕΣ','Una hilera de leones de mármol de Naxos, de hacia el 600, mira hacia el lago sagrado. Fueron un regalo de los naxios, que entonces dominaban el santuario. Originalmente eran unos dieciséis.',lk.x-40,lk.z+20,0);
   place('atenienses_delos','Templo de los atenienses','ΝΑΟΣ ΤΩΝ ΑΘΗΝΑΙΩΝ','Templo dórico que Atenas construyó hacia 425-417, cuando controlaba el santuario. Al lado está el gran templo de Apolo, empezado en el siglo V y todavía sin terminar: algunas columnas apenas asoman del suelo.',s.x+2,s.z-8,0);
   islandVillagers(De,s.x+10,s.z+10,4,['Aquí nadie nace ni muere: es la ley del dios.','¿Has visto a las Delíades? Cantan como si fueran todos los pueblos a la vez.','Los atenienses mandan aquí, pero el oro del santuario es de Apolo.']);}
  // Naxos: Portara en el islote, kuros inacabado en la cantera
  {const b=N.blobs[0],sh=shoreAlong(b.x,b.z,(N.x-b.x)/Math.hypot(N.x-b.x,N.z-b.z),(N.z-b.z)/Math.hypot(N.x-b.x,N.z-b.z),300);
   const ex=b.x,ez=b.z,cdx=sh[0]-ex,cdz=sh[1]-ez,cl=Math.hypot(cdx,cdz);
   {const sh2=shoreAlong(sh[0]+cdx/cl*6,sh[1]+cdz/cl*6,cdx/cl,cdz/cl,200);}
   const mainShore=shoreAlong(N.x,N.z,-cdx/cl,-cdz/cl,N.R*1.6);
   const mx=(sh[0]+mainShore[0])/2,mz=(sh[1]+mainShore[1])/2,ml=Math.hypot(mainShore[0]-ex,mainShore[1]-ez),ca=Math.atan2(cdx,cdz);
   const cw=box(6,8,ml+10,M.limestone,(ex+mainShore[0])/2,1.6-4,(ez+mainShore[1])/2);cw.rotation.y=ca;addPlat((ex+mainShore[0])/2,(ez+mainShore[1])/2,6,ml+10,ca,1.6);
   const gy=terrainH(ex,ez);const pg=grp(ex,gy,ez,ca);box(15,0.8,37,M.marble,0,0.0,0,pg);addPlat(ex,ez,15,37,ca,gy+0.4);
   box(1.0,6.0,1.4,M.marble,-2.3,0.4+3,-12,pg);box(1.0,6.0,1.4,M.marble,2.3,0.4+3,-12,pg);box(5.8,1.1,1.4,M.marble,0,0.4+6.55,-12,pg);
   {const p1=toW(-2.3,-12,ex,ez,ca),p2=toW(2.3,-12,ex,ez,ca);addCirc(p1[0],p1[1],0.8);addCirc(p2[0],p2[1],0.8);}
   footprints.push({x:ex,z:ez,w:15,d:37,a:ca,c:'#efe7d8',name:'Portara'});
   NPC_POS.naxos=[mainShore[0]-cdx/cl*4,mainShore[1]-cdz/cl*4,ca+Math.PI];
   place('portara','La Portara','ΠΟΡΤΑΡΑ','La gran puerta de mármol de un templo de Apolo que el tirano Lígdamis empezó hacia el 530 en el islote de Palacia, unido a Naxos por un dique. Al caer la tiranía, la obra se abandonó. Según la tradición local, en este islote Teseo abandonó a Ariadna. Mira hacia Delos.',...toW(3,-6,ex,ez,ca),ca);
   const q=N.quarry,qg=grp(q.x,q.h,q.z,0.6);for(let i=0;i<10;i++){const r=new THREE.Mesh(new THREE.BoxGeometry(rr(1.5,4),rr(1,3),rr(1.5,4)),lam('#e6dfd2'));r.position.set(rr(-16,16),0.8,rr(-16,16));r.rotation.y=R()*3;if(Math.abs(r.position.x)<4&&Math.abs(r.position.z)<8)continue;qg.add(r);}
   const k=makePerson({chiton:'#e6dfd2',himation:'#e6dfd2',skin:'#e6dfd2',hair:'#d8d0c2'});k.scale.setScalar(5.4);k.rotation.x=-Math.PI/2;k.position.set(0,0.9,4.5);qg.add(k);addBox(q.x,q.z,6,12,0.6);
   place('kouros','Kuros inacabado','ΚΟΥΡΟΣ','En una cantera de Naxos yace un kuros (estatua de joven) de unos diez metros, abandonado sin terminar en el siglo VI, quizá porque se agrietó. Muestra cómo los escultores desbastaban el bloque en la misma cantera antes de transportarlo.',q.x+12,q.z+12,0);
   const t=N.town;for(let i=0;i<9;i++)courtyardHouse(t.x+rr(-28,28),t.z+rr(-28,28),R()<0.5?0:Math.PI/2,rr(9,12),rr(9,12),3.4,R()<0.2);
   islandVillagers(N,t.x,t.z,4,['El mármol de Naxos es el mejor; el de Paros, dicen los de Paros.','Dioniso es nuestro dios. Aquí el vino es bueno de verdad.','De noche, mira la corona de Ariadna en el cielo.']);}
  // Creta: Cnosos en el 386 a.C. — ruinas del palacio a tamaño real (≈150 m de lado, mil años abandonado) y la ciudad griega viva al lado
  {const p=C.palace,gy=p.h,wm=lam('#9d927a'),wd=lam('#8f8670'),earth=lam('#6f7a3e'),gyp=lam('#a1987f'),HC=75;
   const wall=(x0,z0,x1,z1,hmax)=>{const L=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.round(L/3.5)),dx=(x1-x0)/n,dz=(z1-z0)/n,hor=Math.abs(dx)>Math.abs(dz);for(let q=0;q<n;q++){if(R()<0.3)continue;const h=rr(0.15,hmax),cx=x0+dx*(q+0.5),cz=z0+dz*(q+0.5);box(hor?Math.abs(dx)*rr(0.75,1):0.8,h+0.5,hor?0.8:Math.abs(dz)*rr(0.75,1),wm,cx,gy+h/2-0.25,cz);if(h>0.7)addSeg(cx-dx/2,cz-dz/2,cx+dx/2,cz+dz/2,0.4);}};
   // patio central (≈50 × 25 m, eje norte-sur), losas a la vista
   box(25,0.12,50,gyp,p.x,gy+0.06,p.z);
   const inCourt=(x,z)=>Math.abs(x-p.x)<14&&Math.abs(z-p.z)<27;
   // almacenes del oeste: muros largos y estrechos en paralelo
   for(let k=0;k<16;k++){const z=p.z-36+k*4.6,x=p.x-38;wall(x-8,z,x+8,z,1.3);}
   wall(p.x-29.5,p.z-37,p.x-29.5,p.z+38,1.6);
   // resto del palacio: muros arrasados en cuadrícula de 10 m, cubiertos de tierra a trozos
   for(let i=-7;i<7;i++)for(let j=-7;j<7;j++){const cx=p.x+i*10+5,cz=p.z+j*10+5;if(inCourt(cx,cz)||(cx<p.x-29&&cx>p.x-47&&Math.abs(cz-p.z)<38))continue;
     if(Math.hypot(i+0.5,j+0.5)>7.3)continue;
     if(R()<0.45)wall(cx+5,cz-5,cx+5,cz+5,1.2);
     if(R()<0.45)wall(cx-5,cz+5,cx+5,cz+5,1.2);
     if(R()<0.42){const m=new THREE.Mesh(new THREE.SphereGeometry(rr(3,5.5),9,5,0,TAU,0,Math.PI/2),earth);m.scale.y=rr(0.25,0.45);m.position.set(cx+rr(-2,2),gy-0.2,cz+rr(-2,2));m.receiveShadow=true;scene.add(m);}
     if(R()<0.35)for(let b=0;b<3;b++){const s=box(rr(0.8,1.4),0.5,rr(0.5,0.8),wd,cx+rr(-4,4),gy+0.2,cz+rr(-4,4));s.rotation.y=R()*3;}}
   // basas de piedra donde estuvieron las columnas de madera (ya no queda ninguna columna)
   for(let k=0;k<6;k++){const b=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.6,0.25,14),wd);b.position.set(p.x+14.5,gy+0.12,p.z-20+k*8);scene.add(b);}
   // la gran escalinata del este, medio enterrada, y la rampa de la entrada norte
   for(let k=0;k<6;k++)box(8,0.35,1.1,wm,p.x+33,gy-0.2-k*0.3,p.z+8+k*1.1);
   box(6,0.5,18,wd,p.x,gy+0.1,p.z-45);
   footprints.push({x:p.x,z:p.z,w:HC*2,d:HC*2,a:0,c:'#b9ad8c',name:'Ruinas de Cnosos'});
   NPC_POS.creta=[p.x+2,p.z,0];buildKnossosDream(C);
   place('cnosos','Ruinas de Cnosos','ΚΝΩΣΟΣ','Estas ruinas enormes, cubiertas de tierra y hierba, llevan abandonadas casi mil años. Los cretenses dicen que eran el palacio del rey Minos y que aquí Dédalo construyó el laberinto; por eso las monedas de la ciudad llevan un laberinto. Hoy sabemos que era un palacio de la Edad del Bronce, de unos 150 metros de lado, con un gran patio central, almacenes llenos de tinajas y columnas de madera, destruido hacia el 1375 a.C.',p.x+16,p.z+30,0);
   place('cnosos_evans','El palacio que no se ve','ΚΝΩΣΟΣ','Anacronismo señalado: el palacio de columnas rojas y frescos de colores que aparece en los libros es la reconstrucción que hizo el arqueólogo Arthur Evans a partir de 1900, en parte con hormigón. En el 386 a.C. nadie lo había visto así: solo quedaban estos muros arrasados. Si sueñas con el laberinto, verás el palacio como pudo ser en su apogeo.',p.x-20,p.z-46,0);
   // la casa de Rea y el bosque de cipreses (Diodoro V 66.1)
   {const rx=p.x+62,rz=p.z+62,g=grp(rx,minGround(rx,rz,12,9,0),rz,0);for(const[a,b,w,d]of[[0,-4,12,0.9],[0,4,12,0.9],[-6,0,0.9,9],[6,0,0.9,9]])box(w,0.6,d,wd,a,0.2,b,g);
    const cyp=[];for(let k=0;k<22;k++){const a=k/22*TAU,d=rr(9,16);cyp.push([rx+Math.cos(a)*d,rz+Math.sin(a)*d]);}
    for(const[x,z]of cyp){const c=new THREE.Mesh(new THREE.ConeGeometry(1,rr(8,11),7),lam('#36502f'));c.position.set(x,terrainH(x,z)+4.6,z);c.castShadow=true;scene.add(c);addCirc(x,z,0.6);}
    footprints.push({x:rx,z:rz,r:18,name:'Bosque de Rea'});
    place('casa_rea','Los cimientos de la casa de Rea','ΡΕΑΣ ΟΙΚΟΣ','Los de Cnosos enseñan estos cimientos, en medio de un bosque de cipreses muy antiguo, y dicen que fueron la casa de Rea, la madre de Zeus. Para ellos todos los dioses están emparentados con Creta.',rx+3,rz-8,0);
    if(typeof PSRC!=='undefined')PSRC.casa_rea={a:['Diodoro de Sicilia V 66.1']};}
   // la ciudad griega de Cnosos, al norte de las ruinas, hacia el mar
   {const c=C.polis;
    const ag={x:c.x,z:c.z};box(34,0.1,26,lam('#b3a684'),ag.x,floorAt(ag.x,ag.z)+0.05,ag.z);
    stoa({name:'Stoa de Cnosos',x:ag.x,z:ag.z-17,rot:0,len:30,depth:6,colH:4.2,colD:0.55});
    temple({name:'Templo de Apolo Delfinio',x:ag.x+34,z:ag.z,rot:-Math.PI/2,W:9,L:16,nW:4,nL:7,colD:0.6,colH:5,entH:1.1,pedH:0.9,steps:2,stepH:0.3,roofMat:M.marble});
    for(let k=0;k<26;k++){const a=R()*TAU,d=rr(32,c.r-6),x=c.x+Math.cos(a)*d,z=c.z+Math.sin(a)*d;if(Math.abs(x-(ag.x+34))<14&&Math.abs(z-ag.z)<14)continue;courtyardHouse(x,z,R()<0.5?0:Math.PI/2,rr(9,12),rr(9,12),3.4,R()<0.2);}
    place('cnosos_ciudad','La ciudad de Cnosos','ΚΝΩΣΟΣ','Cnosos es una de las tres grandes ciudades de Creta, con Gortina y Lito, y siempre está en guerra o en alianza con alguna de ellas. Sus ciudadanos comen juntos en comedores públicos, como los espartanos, y sus muchachos se educan en grupos, las «manadas». Homero ya la llamaba «la gran ciudad donde reinó Minos».',ag.x-12,ag.z+10,0);
    if(typeof PSRC!=='undefined')PSRC.cnosos_ciudad={a:['Homero, Odisea XIX 178-179','Aristóteles, Política II 10 (1271b-1272b)','Estrabón X 4.7 y 4.16-20']};
    // el cambista con las monedas del laberinto
    {const f=findFree(ag.x+6,ag.z+4,0.8),g=grp(f[0],floorAt(f[0],f[1]),f[1],0);box(1.6,0.9,0.8,lam('#7a5a3a'),0,0.45,0,g);for(let k=0;k<5;k++){const m=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.02,10),M.gold||lam('#c9a24a'));m.position.set(-0.5+k*0.22,0.92,0);g.add(m);}
     const pg=makePerson({chiton:'#d8ccb0',himation:'#6a4a3a',beard:true,hair:'#4a3a2a'});pg.position.set(f[0],floorAt(f[0],f[1]),f[1]+1.1);pg.rotation.y=Math.PI;scene.add(pg);
     const o=egxObj(f[0],f[1],undefined,'crt:cambista','Un cambista de Cnosos','con monedas del laberinto',3);o.g=pg;}
    // santuario de Deméter en la colina de Gipsades, al sur de las ruinas
    {const sx=p.x+10,sz=p.z+HC+30;temple({name:'Santuario de Deméter',x:sx,z:sz,rot:0,W:6,L:9,nW:4,nL:5,colD:0.45,colH:3.6,entH:0.9,pedH:0.7,steps:2,stepH:0.25,roofMat:M.marble});
     place('demeter_cnosos','Santuario de Deméter','ΔΗΜΗΤΡΟΣ ΙΕΡΟΝ','En la ladera de esta colina, frente a las ruinas, los de Cnosos dan culto a Deméter y a su hija Perséfone. Les ofrecen figurillas de barro, lámparas y vasitos con trigo y miel.',sx+6,sz-8,0);
     if(typeof PSRC!=='undefined')PSRC.demeter_cnosos={m:['Santuario excavado en la colina de Gipsades, con ofrendas desde el siglo VIII a.C. hasta época romana (Coldstream, 1973)']};}
    islandVillagers(C,ag.x,ag.z,7,['Los cretenses no mentimos. Bueno, casi nunca.','Aquí cerca nació Zeus. Y aquí está su tumba, aunque no lo digas en Atenas.','Las leyes de Gortina son más viejas que las vuestras.','Esas ruinas de ahí abajo eran el palacio de Minos. Mi abuelo encontró una tinaja enterrada más alta que él.','Hoy comemos en el comedor común: pan, vino aguado y un poco de queso. Para todos igual.','Si vas al Ida, sigue el camino de los cipreses.']);}
   const cv=C.cave;caveMouth(cv.x,cv.z,Math.PI);place('cueva_zeus','Cueva de Zeus','ΑΝΤΡΟΝ ΔΙΟΣ','Una de las grutas donde, según los cretenses, Rea escondió a Zeus recién nacido. Los curetes danzaban golpeando sus escudos para que Cronos no oyera el llanto. Se veneraban así la cueva del monte Ida y la del monte Dicte; ambas recibían ofrendas desde la Edad del Bronce. Esta es una gruta pequeña de la costa; la gran cueva del Ida está tierra adentro: sigue el poste «El camino del Ida».',cv.x,cv.z+8,0);}
  // Lesbos: santuario de la cabeza de Orfeo y templo de Apolo
  {const s=L.shrine;const cg=caveMouth(s.x-6,s.z,-Math.PI/2);box(1.4,1,1,M.marble,s.x,s.h+0.5,s.z);addBox(s.x,s.z,1.4,1,0);
   const st=grp(s.x+2,s.h,s.z+3,-Math.PI/2);box(0.8,1.6,0.2,M.marble,0,0.8,0,st);const ly=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.04,6,16,Math.PI),M.gold);ly.position.set(0,1.3,0.12);st.add(ly);
   NPC_POS.lesbos=[s.x+5,s.z-4,Math.PI/2];
   place('cabeza_orfeo','Santuario de la cabeza de Orfeo','ΟΡΦΕΩΣ ΚΕΦΑΛΗ','Según la tradición, la cabeza de Orfeo llegó cantando a esta costa de Antisa y fue enterrada en una gruta, donde daba oráculos. Vasos atenienses del siglo V ya muestran la cabeza profetizando ante jóvenes que anotan sus respuestas. La lira, dicen, se ofreció en un templo de Apolo.',s.x+4,s.z+6,0);
   const t=L.temple;temple({name:'Templo de Apolo (Lesbos)',x:t.x,z:t.z,rot:-Math.PI/2,W:9,L:16,nW:4,prostyle:true,amphi:true,order:'ionic',colD:0.6,colH:5.2,gy:t.h,cella:{w:8,l:9,door:2.4}});
   place('poetas','La isla de los poetas','ΛΕΣΒΟΣ','Lesbos dio a Grecia algunos de sus grandes músicos y poetas: Terpandro, que según la tradición dio a la lira siete cuerdas; Arión de Metimna; Alceo y Safo de Mitilene, que hacia el 600 escribieron en su dialecto eolio poemas para cantar con la lira. Un epigrama atribuido a Platón llama a Safo la décima musa.',t.x+12,t.z+10,0);
   for(let i=0;i<8;i++)courtyardHouse(t.x+rr(-35,35),t.z+rr(20,60),R()<0.5?0:Math.PI/2,rr(9,12),rr(9,12),3.4,false);
   islandVillagers(L,t.x,t.z+30,4,['¿Has oído cantar a los ruiseñores de Antisa? Dicen que es Orfeo.','Mitilene se ha aliado otra vez con Atenas. Hasta la próxima vez.','Safo era de aquí. Bueno, de Mitilene, pero de aquí.']);}
  buildTroy();buildThebes();buildSparta();buildMycenae();buildGreece2();buildGates();
  islandTrees(treePts.filter(p=>!footprints.some(f=>f.w&&Math.abs(p[0]-f.x)<f.w&&Math.abs(p[1]-f.z)<f.d)));
}
function placeReliefs(){
  for(const r of RELIEFS){let x=r.x,z=r.z;if(r.ax!==undefined){const p=AL(r.ax,r.az);x=p[0];z=p[1];}
    if(r.island==='egina'){const s=ISLANDS[0].site;x=s.x+20;z=s.z+5;}
    r.x=x;r.z=z;const mk=new THREE.Mesh(new THREE.OctahedronGeometry(0.26),new THREE.MeshBasicMaterial({color:0x6fa8dc,fog:false}));mk.position.set(x,floorAt(x,z)+2.3,z);scene.add(mk);
    reliefObjs.push({kind:'relief',data:r,x,z,mk});}
}


// ------------------------------------------------------------ cinta de agua que sigue el terreno (ríos)
function riverRibbon(pts,w,color){const r=addRiver(pts,w,{color});return r&&r.mesh;}
function horse(x,z,a){
  if(GLB.ok){const g=grp(x,terrainH(x,z),z,a);animalGLB('A_horse',g,pick(['#6b4a2e','#4a3020','#8a6a4a','#d8cfc0']),'#2e2018');addCirc(x,z,1.1);return;}
  const g=grp(x,terrainH(x,z),z,a),c=lam('#6b4a2e'),dk=lam('#2e2018');g.scale.setScalar(1.5);
  box(0.5,0.55,1.3,c,0,1.05,0,g);for(const[px,pz]of[[-0.17,-0.5],[0.17,-0.5],[-0.17,0.5],[0.17,0.5]])box(0.1,0.8,0.1,dk,px,0.4,pz,g);
  box(0.25,0.6,0.25,c,0,1.5,0.65,g).rotation.x=0.5;box(0.22,0.24,0.55,c,0,1.75,0.9,g);box(0.06,0.5,0.4,dk,0,1.6,0.55,g);box(0.08,0.5,0.08,dk,0,0.95,-0.7,g).rotation.x=0.4;addCirc(x,z,1.1);}
function arriero(port,x,z,a,who){const W=who||(MODE==='roma'?{name:'Cayo Fabio',sub:'Cochero · viajes por Italia',role:'el cochero',look:{chiton:'#a08a62',short:true,noHimation:true,hair:'#3a2a1e'}}:{name:'Lisicles',sub:'Arriero · caminos de Grecia',role:'el arriero'});
  const g=makePerson(W.look||{chiton:'#a08a62',himation:'#6b5a3a',beard:true,hair:'#3a2a1e',staff:true});g.position.set(x,floorAt(x,z),z);g.rotation.y=a;scene.add(g);
  const lb=labelSprite(W.name,W.sub,true);lb.position.y=2.45;lb.visible=false;g.add(lb);addCirc(x,z,0.4);
  captains.push({kind:'captain',mode:'tierra',port,x,z,g,lb,data:{name:W.name,role:W.role}});
  const dx=x+Math.cos(a)*2.2,dz=z-Math.sin(a)*2.2;donkey(dx,dz,a);}

// ------------------------------------------------------------ Troya (Ilión) y Tebas
function defineMainlandLayout(){
  const T=ISLANDS.find(I=>I.id==='troya'),B=ISLANDS.find(I=>I.id==='tebas');
  T.blobs.push({x:T.x+90,z:T.z-40,R:120,H:30});T.hill=pad(T,90,-40,52);
  B.blobs.push({x:B.x+60,z:B.z,R:200,H:24});B.cadmea=pad(B,60,0,150);
  B.blobs.push({x:B.x+330,z:B.z+70,R:70,H:16});B.ismen=pad(B,330,70,22);
  B.dirce=pad(B,-170,40,30,0,3);B.arrive=pad(B,-330,30,24,0,3);
  defineGreeceLayout();
}
function buildTroy(){
  const T=ISLANDS.find(I=>I.id==='troya'),h=T.hill;
  temple({name:'Templo de Atenea Ilíade',x:h.x,z:h.z,rot:Math.PI/2,W:10,L:18,nW:4,prostyle:true,amphi:true,colD:0.8,colH:5.6,gy:h.h,cella:{w:9,l:10.5,door:2.6}});
  NPC_POS.ilion=[h.x+14,h.z+3,Math.PI/2];NPC_POS.locria=[h.x+4,h.z+10,Math.PI/2];
  for(let i=0;i<14;i++){const a=R()*TAU,d=20+R()*26,x=h.x+Math.cos(a)*d,z=h.z+Math.sin(a)*d;if(Math.abs(x-h.x)<14&&Math.abs(z-h.z)<9)continue;if([[h.x+14,h.z+3],[h.x+4,h.z+10]].some(q=>Math.abs(q[0]-x)<10&&Math.abs(q[1]-z)<10))continue;   /* ni encima ni pegada a Ideo o a Peribea */courtyardHouse(x,z,R()<0.5?0:Math.PI/2,rr(9,12),rr(9,12),3.4,false);}
  // los grandes muros de la Edad del Bronce, en ruinas
  const wm=lam('#b9aa8a');for(let i=0;i<36;i++){if(i%5===3)continue;const t0=i/36*TAU,t1=(i+1)/36*TAU,r=72;const ax=h.x+Math.cos(t0)*r,az=h.z+Math.sin(t0)*r,bx=h.x+Math.cos(t1)*r,bz=h.z+Math.sin(t1)*r;
    const mx=(ax+bx)/2,mz=(az+bz)/2,len=Math.hypot(bx-ax,bz-az),hh=rr(2.5,6.5),gy=Math.min(terrainH(ax,az),terrainH(bx,bz));const m=box(3.2,hh+3,len+0.3,wm,mx,gy+hh/2-1.5,mz);m.rotation.y=Math.atan2(bx-ax,bz-az);m.rotation.z=0;addSeg(ax,az,bx,bz,1.6);
    if(i%9===0){const tw=box(8,hh+5,8,wm,ax,gy+(hh+5)/2-2,az);tw.rotation.y=Math.atan2(bx-ax,bz-az);addCirc(ax,az,4.5);}}
  footprints.push({x:h.x,z:h.z,r:72,c:'#cdbf9f',name:'Ilión'});
  // tumbas de los héroes
  const tum=(dx,dz,id,name,gr,text)=>{const s=shoreAlong(T.x,T.z,dx,dz,T.R*1.7),x=s[0]-dx*45,z=s[1]-dz*45;const mo=new THREE.Mesh(new THREE.SphereGeometry(12,18,10,0,TAU,0,Math.PI/2),lam('#9a8a62'));mo.scale.y=0.55;mo.position.set(x,terrainH(x,z)-0.5,z);scene.add(mo);addCirc(x,z,11.5);
    place(id,name,gr,text,x-dx*16,z-dz*16,0);};
  tum(-0.75,0.66,'tumba_aquiles','Tumba de Aquiles y Patroclo','ΑΧΙΛΛΕΙΟΝ','Junto al cabo Sigeo se alza el túmulo que la tradición atribuye a Aquiles, cuyos huesos se mezclaron con los de su amigo Patroclo en una misma urna de oro, como cuenta la Odisea. Los navegantes que entran en el Helesponto ofrecen aquí libaciones. Cincuenta años después de tu viaje, Alejandro Magno correrá desnudo alrededor de esta tumba.');
  tum(-0.2,-0.98,'tumba_ayax','Tumba de Áyax','ΑΙΑΝΤΕΙΟΝ','En el cabo Reteo, otro túmulo se atribuye a Áyax Telamonio, que se quitó la vida cuando las armas de Aquiles fueron para Odiseo. La tradición cuenta que el mar devolvió aquí sus armas, como prueba de que le correspondían.');
  // el río Escamandro
  {const pts=[];for(let i=0;i<=40;i++){const t=i/40;pts.push([h.x+40-t*T.R*1.2+Math.sin(t*9)*25,h.z+90+t*T.R*0.25]);}riverRibbon(pts,9);
   place('escamandro','El Escamandro','ΣΚΑΜΑΝΔΡΟΣ','El río de la llanura de Troya, que los dioses llaman Janto. En la Ilíada, el propio dios del río, furioso porque Aquiles llena su cauce de cadáveres troyanos, se levanta contra el héroe y casi lo ahoga, hasta que Hefesto lo seca con fuego.',pts[10][0]+10,pts[10][1]-10,0);}
  place('ilion_templo','Ilión y el templo de Atenea','ΙΛΙΟΝ','Sobre la colina de la antigua Troya vive hoy una pequeña ciudad de colonos eolios, Ilión. Su templo de Atenea es modesto, pero famoso: Jerjes sacrificó aquí mil bueyes antes de invadir Grecia en el 480, y se enseñan armas que, según dicen, son de la guerra de Troya.',h.x+16,h.z-6,Math.PI/2);
  place('murallas_troya','Los muros de Troya','ΤΕΙΧΗ ΤΡΟΙΑΣ','Restos de grandes murallas de piedra, con muros inclinados y torres, que según el mito construyeron Poseidón y Apolo para el rey Laomedonte, que después se negó a pagarles. Hoy sabemos que en esta colina se superponen ciudades de casi dos mil años; la destruida hacia el 1200 a.C. es la candidata más probable a la Troya de la guerra.',h.x+78,h.z+8,0);
  islandVillagers(T,h.x-16,h.z+18,4,['Todos los que cruzan el Helesponto suben a ver Troya. Bueno para el negocio.','Esa piedra de ahí era el altar de Zeus donde murió Príamo. O eso decimos.','Las doncellas locrias llegaron anoche. Nadie las vio; nunca las ve nadie.']);
}
function buildThebes(){
  const B=ISLANDS.find(I=>I.id==='tebas'),c=B.cadmea,gy=c.h;
  // murallas de la Cadmea con siete puertas
  const gates=[0.3,1.2,2.1,2.9,3.8,4.7,5.6],wm=lam('#b5a37e'),r=158;
  for(let i=0;i<70;i++){const t0=i/70*TAU,t1=(i+1)/70*TAU,mid=(t0+t1)/2;if(gates.some(g=>Math.abs(wrapA(mid-g))<0.05))continue;const ax=c.x+Math.cos(t0)*r,az=c.z+Math.sin(t0)*r,bx=c.x+Math.cos(t1)*r,bz=c.z+Math.sin(t1)*r;
    const mx=(ax+bx)/2,mz=(az+bz)/2,len=Math.hypot(bx-ax,bz-az),g0=Math.min(terrainH(ax,az),terrainH(bx,bz));const m=box(2.6,10,len+0.4,wm,mx,g0+3,mz);m.rotation.y=Math.atan2(bx-ax,bz-az);addSeg(ax,az,bx,bz,1.3);}
  for(const g of gates)for(const s of[-1,1]){const t=g+s*0.06,x=c.x+Math.cos(t)*r,z=c.z+Math.sin(t)*r;box(7,13,7,lam('#a8966f'),x,terrainH(x,z)+4.5,z);addCirc(x,z,4);}
  footprints.push({x:c.x,z:c.z,r,c:'#cdbf9f',name:'Cadmea'});
  // ruinas del palacio de Cadmo
  {const px=c.x+20,pz=c.z-20;for(let i=0;i<5;i++)for(let j=0;j<4;j++){if(R()<0.4)continue;const hh=rr(0.5,1.8);box(9,hh+1,0.8,lam('#bdb091'),px+i*9-18,gy+hh/2-0.5,pz+j*9-13);addSeg(px+i*9-22.5,pz+j*9-13,px+i*9-13.5,pz+j*9-13,0.4);}
   place('palacio_cadmo','Ruinas del palacio de Cadmo','ΚΑΔΜΕΙΟΝ','Restos de un palacio muy antiguo en lo alto de la Cadmea. Los tebanos enseñan aquí la estancia nupcial de Sémele, la hija de Cadmo, a la que Zeus fulminó con su rayo cuando ella le pidió verlo en todo su esplendor. Los arqueólogos han encontrado en la Cadmea un palacio micénico de la Edad del Bronce.',px+26,pz+4,0);}
  temple({name:'Templo de Deméter Tesmófora',x:c.x-40,z:c.z+40,rot:Math.PI/2,W:8,L:14,nW:4,prostyle:true,colD:0.6,colH:4.6,gy,cella:{w:7,l:8.5,oz:-1.5,door:2.2}});
  for(let k=0;k<70;k++){const a=R()*TAU,d=30+Math.sqrt(R())*112,x=c.x+Math.cos(a)*d,z=c.z+Math.sin(a)*d;if(Math.hypot(x-(c.x+20),z-(c.z-20))<34||Math.hypot(x-(c.x-40),z-(c.z+40))<16)continue;
    if(footprints.some(f=>f.house&&Math.abs(f.x-x)<14&&Math.abs(f.z-z)<14))continue;courtyardHouse(x,z,(R()<0.5?0:Math.PI/2)+rr(-0.1,0.1),rr(9,14),rr(9,13),rr(3.2,4.2),R()<0.15);}
  NPC_POS.epaminondas=[c.x+46,c.z-4,0];
  place('cadmea','La Cadmea','ΚΑΔΜΕΙΑ','La acrópolis de Tebas, fortificada según el mito por Cadmo. Aquí están los edificios de gobierno, los templos más antiguos y las casas de las familias nobles. Cuatro años después de tu visita, en el 382, un general espartano la ocupará a traición con ayuda de los tebanos partidarios de Esparta.',c.x+60,c.z+8,0);
  {const t=gates[2],x=c.x+Math.cos(t)*(r-14),z=c.z+Math.sin(t)*(r-14);place('siete_puertas','Las siete puertas de Tebas','ΕΠΤΑΠΥΛΟΙ ΘΗΒΑΙ','Tebas es famosa por sus siete puertas, que Esquilo nombra en Los siete contra Tebas: Electra, Prétide, Neíta, Crenea, Hipsista, Ogigia y Homolóide. Ante ellas lucharon los siete jefes que acompañaban a Polinices contra su hermano Eteocles. Su número y sus nombres eran motivo de orgullo, aunque los estudiosos discuten dónde estaba cada una.',x,z,0);}
  {const t=gates[0],x=c.x+Math.cos(t)*(r+16),z=c.z+Math.sin(t)*(r+16);courtyardHouse(x+8,z+8,0,12,11,3.6,false,true);place('casa_anfitrion','Casa de Anfitrión','ΟΙΚΙΑ ΑΜΦΙΤΡΥΩΝΟΣ','Junto a la puerta Electra, los tebanos enseñan las ruinas de la casa de Anfitrión, donde nació Heracles: hijo de Zeus, que tomó la apariencia de Anfitrión para unirse a su esposa Alcmena. Por eso Heracles es el gran héroe de Tebas.',x,z,0);}
  {const t=gates[0]+0.22,x=c.x+Math.cos(t)*(r+30),z=c.z+Math.sin(t)*(r+30);temple({name:'Heracleo de Tebas',x,z,rot:t,W:8,L:14,nW:4,prostyle:true,colD:0.6,colH:4.6,cella:{w:7,l:8.5,door:2.2}});
   place('heracleo_tebas','El Heracleo y el regalo de Trasibulo','ΗΡΑΚΛΕΙΟΝ','El santuario de Heracles, fuera de la puerta Electra, junto al gimnasio de Yolao, su sobrino y compañero. Dentro hay dos grandes estatuas de mármol, una Atenea y un Heracles, obra del escultor ateniense Alcámenes. Las dedicó Trasibulo: en el 404, cuando los Treinta Tiranos gobernaban Atenas, Tebas acogió a los demócratas desterrados, y desde aquí salió Trasibulo con setenta hombres a tomar la fortaleza de File y liberar Atenas. Fue su manera de dar las gracias.',x+Math.cos(t)*14,z+Math.sin(t)*14,0);}
  place('anguilas','Las anguilas del Copais','ΕΓΧΕΛΥΣ ΚΩΠΑΪΣ','Al norte de Tebas se extiende el lago Copais, rodeado de cañaverales: de ahí salen las cañas para los aulós, las flautas, y las anguilas más famosas de Grecia. En Los acarnienses de Aristófanes, un beocio llega al mercado de Atenas con patos, liebres, tordos y anguilas del Copais, y el ateniense las recibe como a una diosa. Los atenienses se burlan de los beocios: dicen que son gordos, comilones y lentos, «cerdos beocios».',c.x+16,c.z+40,0);
  NPC_POS.ismenias=[c.x+70,c.z+26,-Math.PI/2];
  // la fuente Dirce y la casa de Píndaro
  {const d=B.dirce;const w=new THREE.Mesh(new THREE.CircleGeometry(1,28),new THREE.MeshPhongMaterial({color:'#3f7a8a',shininess:80}));w.rotation.x=-Math.PI/2;w.scale.set(11,7,1);w.position.set(d.x,d.h+0.08,d.z);scene.add(w);
   for(let i=0;i<18;i++){const a=i/18*TAU;addCirc(d.x+Math.cos(a)*10.5,d.z+Math.sin(a)*6.5,1);}
   blockBuilding({name:'Fuente Dirce',x:d.x,z:d.z-12,rot:0,w:12,d:5,h:4,mat:M.limestone});
   courtyardHouse(d.x+26,d.z+14,0,13,12,3.8,true,true);
   NPC_POS.pelopidas=[d.x+12,d.z+2,Math.PI/2];
   place('dirce','Fuente Dirce','ΔΙΡΚΗ','La fuente sagrada de Tebas. Según el mito, Dirce, esposa del rey Lico, maltrató a Antíope, madre de los gemelos Anfión y Zeto; cuando estos crecieron, la ataron a un toro salvaje y la arrojaron aquí. Anfión construyó después las murallas de Tebas: las piedras se movían solas al son de su lira.',d.x-14,d.z+4,0);
   place('casa_pindaro','Casa de Píndaro','ΟΙΚΙΑ ΠΙΝΔΑΡΟΥ','Aquí vivió Píndaro (c. 518-438), el gran poeta de las odas para los vencedores de los juegos. Su casa se respeta como un lugar casi sagrado. Medio siglo después de tu visita, cuando Alejandro Magno arrase Tebas en el 335, ordenará respetar solo esta casa.',d.x+26,d.z+24,0);}
  // el Ismenion
  {const s=B.ismen;temple({name:'Templo de Apolo Ismenio',x:s.x,z:s.z,rot:Math.PI/2,W:11,L:23,nW:6,nL:11,colD:0.85,colH:5.4,gy:s.h,cella:{w:7.4,l:13,door:2.4,antis:3,antisCols:true}});
   place('ismenion','Ismenion','ΙΣΜΗΝΙΟΝ','Santuario de Apolo Ismenio, en una colina junto al río Ismeno. Aquí se consultaba al dios y se dedicaban trípodes; Heródoto vio en él trípodes con inscripciones en «letras cadmeas», que atribuyó a tiempos de Edipo y Layo.',s.x+20,s.z+8,0);}
  // llegada por el camino de Atenas, con el arriero
  {const a=B.arrive;arriero('tebas',a.x+3,a.z+3,-Math.PI/2);PORTS.tebas={x:a.x-4,z:a.z,yaw:-Math.PI/2,label:'Tebas'};
   const pts=[];for(let i=0;i<=20;i++){const t=i/20;pts.push([lerp(a.x,c.x-r-10,t),lerp(a.z,c.z,t)]);}
   islandVillagers(B,c.x+10,c.z+30,6,['Desde la paz, los de Platea nos miran por encima del hombro.','Los espartanos piden soldados para sus guerras. ¿Y quién nos defiende de los espartanos?','Aquí nació Heracles. Y Dioniso. ¿Qué ciudad puede decir lo mismo?','Píndaro era de aquí. Escribía mejor que todos vuestros poetas juntos.']);}
}
function buildLandRoute(){ // arriero en la puerta norte de Atenas
  const p=gatePt(NG,18,6);arriero('atenas',p[0],p[1],Math.atan2(-NG.ox,-NG.oz));
  const q=gatePt(NG,12,0);PORTS.atenas_n={x:q[0],z:q[1],yaw:Math.atan2(NG.ox,NG.oz),label:'Atenas, puerta norte'};
  place('camino_tebas','Camino de Tebas','ΟΔΟΣ ΕΙΣ ΘΗΒΑΣ','Por esta puerta sale el camino hacia Beocia: atraviesa el Ática, sube por el paso de Eleuteras en el monte Citerón y baja hasta Tebas, a unos setenta kilómetros. Se tardan unos dos días a pie o en carro.',...gatePt(NG,16,-7),0);
}

// ------------------------------------------------------------ actores, coro y público del teatro
const PERF={actors:{},chorus:{},aud:[],cur:null,scene:-1,aulos:5};
function buildPerformers(){
  const mask=(g,c)=>{if(GLB.ok){const ro={mask:lam(c||'#efe5d4'),hair:lam('#2a1a12')};g.add(glbPart('P_mask',ro));g.add(glbPart('P_mask_hair',ro));return;}const m=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.4,0.08),lam(c||'#efe5d4'));m.position.set(0,1.82,0.13);g.add(m);const hr=new THREE.Mesh(new THREE.SphereGeometry(0.2,10,8),lam('#2a1a12'));hr.scale.set(1,1.3,0.9);hr.position.set(0,1.98,-0.02);g.add(hr);};
  for(const pl of PLAYS){
    PERF.actors[pl.id]=pl.cast.map(([nm,col])=>{const g=makePerson({chiton:col,himation:col,skin:'#c99a74',hair:'#2a1a12'});g.scale.setScalar(1.12);mask(g);g.visible=false;g.position.set(THEA.x,THEA.h0,THEA.z+12);scene.add(g);return g;});
    PERF.chorus[pl.id]=[];for(let i=0;i<12;i++){const g=makePerson({chiton:pl.chorusC,himation:pl.chorusC,female:true,hair:'#2a1a12'});mask(g,'#e9dcc6');g.visible=false;scene.add(g);PERF.chorus[pl.id].push(g);}
  }
  const looks=[['#e8dfcc','#7a5a3a'],['#d7c9ab','#4f6a7d'],['#efe6d5','#8a3f2f'],['#c9b48b','#5c6b3f'],['#e2d6c0','#a07a3a']];
  for(let i=0;i<46;i++){const L=pick(looks),r=THEA.r0+3+Math.floor(R()*30),t=Math.PI+0.15+R()*(Math.PI-0.3);const x=THEA.x+Math.cos(t)*(r+0.5),z=THEA.z+Math.sin(t)*(r+0.5);
    const g=makePerson({chiton:L[0],himation:L[1],beard:R()<0.7,hair:pick(['#2b1f17','#5b4532','#8d8a85'])});g.position.set(x,terrainH(x,z)-0.42,z);g.rotation.y=Math.atan2(THEA.x-x,THEA.z-z);g.visible=false;scene.add(g);PERF.aud.push(g);}
  for(let i=0;i<6;i++){const t=Math.PI*0.1+i/5*Math.PI*0.8;addTorch(THEA.x+Math.cos(t)*(THEA.r0+0.6),THEA.z+Math.sin(t)*(THEA.r0+0.6),2.2);}
  place('programa','Programa del teatro','ΔΙΔΑΣΚΑΛΙΑΙ','Este año, por primera vez, la ciudad ha decidido reponer en las Dionisias una tragedia antigua. Hoy se representan tres obras de Eurípides (480-406): Medea, por la mañana; Las troyanas, por la tarde; y Las bacantes, por la noche, a la luz de las antorchas. Siéntate en las gradas durante la función para seguir la obra escena a escena.',THEA.x+24,THEA.z+12,0);
}
function currentPlay(){return PLAYS.find(p=>clock.h>=p.start&&clock.h<p.end)||null;}
function updatePerformance(dt,t){
  if(MODE!=='atenas')return;
  const pl=currentPlay();
  if(pl!==PERF.cur){
    if(PERF.cur){PERF.actors[PERF.cur.id].forEach(g=>g.visible=false);PERF.chorus[PERF.cur.id].forEach(g=>g.visible=false);}
    PERF.cur=pl;PERF.scene=-1;PERF.aud.forEach(g=>g.visible=!!pl);
    if(pl){PERF.chorus[pl.id].forEach(g=>g.visible=true);if(regionOf(player.x)==='atenas'&&ui!=='start')toast('<span class="label">Teatro de Dioniso</span><br>Empieza '+pl.title+', de Eurípides.');}
  }
  const el=$('stage');
  if(!pl){if(el&&!el.hidden)el.hidden=true;return;}
  // las escenas avanzan con el tiempo real que pasas mirando (unos 16 s cada una) y la obra vuelve a empezar; antes dependían de la hora del juego y tardaban minutos
  if(PERF.wtFor!==pl.id){PERF.wtFor=pl.id;PERF.wt=0;}if(Math.hypot(player.x-THEA.x,player.z-THEA.z)<140)PERF.wt+=dt;
  const n=pl.scenes.length,si=Math.floor(PERF.wt/16)%n,sc=pl.scenes[si];
  if(si!==PERF.scene){PERF.scene=si;}
  pl.cast.forEach((c,i)=>{const g=PERF.actors[pl.id][i],pos=sc[2][i];const off=pos[1]>=9.5;g.visible=!off;if(off)return;const tx=THEA.x+pos[0],tz=THEA.z+pos[1];
    g.position.x+= (tx-g.position.x)*Math.min(1,dt*1.5);g.position.z+=(tz-g.position.z)*Math.min(1,dt*1.5);g.position.y=THEA.h0+0.03+(pos[1]<0?0:0);g.rotation.y=Math.PI+Math.sin(t*0.7+i)*0.25;
    const a=g.userData.arms;if(a){a[1].rotation.x=-0.6+Math.sin(t*2+i)*0.4;}});
  PERF.chorus[pl.id].forEach((g,i)=>{const ang=t*0.15+i/12*TAU;g.position.set(THEA.x+Math.cos(ang)*6.4,THEA.h0+0.03+Math.abs(Math.sin(t*3+i))*0.08,THEA.z+Math.sin(ang)*6.4);g.rotation.y=Math.atan2(-Math.sin(ang),Math.cos(ang))+Math.PI/2;
    const a=g.userData.arms;if(a){a[0].rotation.x=Math.sin(t*2+i)*0.6;a[1].rotation.x=-Math.sin(t*2+i)*0.6;}});
  const near=regionOf(player.x)==='atenas'&&Math.hypot(player.x-THEA.x,player.z-THEA.z)<80;
  if(el){if(near&&ui==='play'){el.hidden=false;el.querySelector('.st').textContent=pl.title+' · Eurípides ('+pl.year+' a.C.) · escena '+(si+1)+' de '+n+': '+sc[0];el.querySelector('.sx').textContent=sc[1];}else el.hidden=true;}
  if(near){PERF.aulos-=dt;if(PERF.aulos<0){PERF.aulos=4+Math.random()*5;playAulos();}}
}

// librero del Ágora: puesto con rollos
function bookStall(x,z,a){const g=grp(x,floorAt(x,z),z,a),wd=M.wood,pap=lam('#e9dcb8'),rl=[lam('#e9dcb8'),lam('#d8c79c'),lam('#c9b07a')];
  box(3.2,0.9,1.2,wd,0,0.45,0,g);box(3.4,0.08,1.4,lam('#8a6a4a'),0,0.92,0,g);
  for(let i=0;i<9;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.42,8),rl[i%3]);c.rotation.z=Math.PI/2;c.position.set(-1.3+i*0.32,1.02,rr(-0.3,0.3));g.add(c);}
  box(3.2,2.2,0.4,wd,0,1.1,-1.3,g);for(let j=0;j<3;j++){box(3.1,0.05,0.38,lam('#8a6a4a'),0,0.5+j*0.6,-1.2,g);for(let i=0;i<12;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.36,8),rl[(i+j)%3]);c.rotation.x=Math.PI/2;c.position.set(-1.4+i*0.25,0.6+j*0.6,-1.2);g.add(c);}}
  for(const s of[-1,1])box(0.1,2.6,0.1,wd,s*1.6,1.3,0.6,g);const aw=box(3.6,0.06,2.4,lam('#c9a24a'),0,2.6,-0.4,g);aw.rotation.x=0.12;
  addBox(x,z,3.4,3,a);}
function playAulos(){if(!aOK())return;const c=AUD.ctx;let t=c.currentTime+0.1;const sc=[293.7,311.1,349.2,392,440,466.2,523.3];let i=2+Math.floor(Math.random()*3);const n=4+Math.floor(Math.random()*5);
  const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=1500;f.connect(AUD.master);
  for(let k=0;k<n;k++){const d=0.35+Math.random()*0.5;for(const det of[1,1.006]){const o=c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(sc[i]*det,t);const vb=c.createOscillator(),vg=c.createGain();vb.frequency.value=5.5;vg.gain.value=sc[i]*0.006;vb.connect(vg).connect(o.frequency);
    const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.022,t+0.05);g.gain.setValueAtTime(0.022,t+d-0.06);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g).connect(f);o.start(t);o.stop(t+d+0.02);vb.start(t);vb.stop(t+d+0.02);}
    t+=d;i=clamp(i+(Math.random()<0.55?-1:1)*(Math.random()<0.8?1:2),0,sc.length-1);}}
function placeNewNPCs(){
  const lat=[-LW_DIR[1],LW_DIR[0]],hp=(back,side)=>[HARBOR.x-LW_DIR[0]*back+lat[0]*side,HARBOR.z-LW_DIR[1]*back+lat[1]*side];
  const fa=(p,q)=>Math.atan2(q[0]-p[0],q[1]-p[1]);
  const pi1=hp(14,8),pi2=hp(14,-8),sy=hp(22,14),cy=hp(22,-14),hc=[HARBOR.x,HARBOR.z];
  Object.assign(NPC_POS,{
    espeusipo:[ACADEMY.x+20,ACADEMY.z+22,0.785],teeteto:[ACADEMY.x+6,ACADEMY.z+36,0.785],
    iseo:[...AL(-58,58),Math.PI/2],calistrato:[...AL(-96,-4),-Math.PI/2],
    araros:[THEA.x-7,THEA.z+12,Math.PI],antifanes:[THEA.x+14,THEA.z-14,Math.PI*0.75],
    ificrates:[...pi1,fa(pi1,hc)],cabrias:[...pi2,fa(pi2,hc)],siracusa:[...sy,fa(sy,hc)],chipre:[...cy,fa(cy,hc)],
    esparta:[...AL(-120,2),Math.PI/2],macedonia:[...AL(-113,-3),-Math.PI/2],tesalia:[...AL(92,-70),0],epiro:[...AL(-74,-42),0],
    aristipo:[...AL(-30,-138),0],librero:[...AL(6,-116),0],nodriza:[...findFree(...AL(52,112),1.2),0],metronomo:[...findFree(...AL(28,-6),1),0.6]});
  {const p=AL(6,-119.5);bookStall(p[0],p[1],0);}
  {const q=hp(-12,-2);NPC_POS.naucleros=[q[0],q[1],fa(q,hp(-12,8))];}
  {const p=AL(97,-72);horse(p[0],p[1],0.4);const q=AL(99,-66);horse(q[0],q[1],2.6);}
}


// ------------------------------------------------------------ vida cotidiana: escuela, sacrificio, fuente, boda, mojones
function isFree(x,z,r){for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const px=x+i*r,pz=z+j*r,p={x:px,z:pz};resolve(p,0.45);
  if(Math.hypot(p.x-px,p.z-pz)>0.05)return false;if(Math.abs(floorAt(px,pz)-terrainH(px,pz))>0.15)return false;if(Math.abs(terrainH(px,pz)-terrainH(x,z))>1.6)return false;}return true;}
function findFree(x,z,r){if(isFree(x,z,r))return[x,z];for(let d=3;d<90;d+=3)for(let k=0;k<Math.max(8,Math.round(d*1.2));k++){const a=k/Math.max(8,Math.round(d*1.2))*TAU,px=x+Math.cos(a)*d,pz=z+Math.sin(a)*d;if(isFree(px,pz,r))return[px,pz];}return[x,z];}
function torchSprite(parent,y){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));sp.position.set(0.38,y,0.15);sp.scale.set(1.3,1.7,1);parent.add(sp);
  const st=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.04,0.9,5),M.wood);st.position.set(0.38,y-0.5,0.15);parent.add(st);return sp;}
function sheep(parent,x,z){const g=new THREE.Group();g.position.set(x,0,z);const w=lam('#ece6d6'),d=lam('#3a3028');
  if(GLB.ok){animalGLB('A_sheep',g,'#3a3028');box(0.16,0.05,0.14,lam('#c9302b'),0,0.84,0.47,g);parent.add(g);return g;}
  box(0.45,0.42,0.8,w,0,0.62,0,g);box(0.24,0.24,0.3,d,0,0.82,0.48,g);for(const[px,pz]of[[-0.14,-0.28],[0.14,-0.28],[-0.14,0.28],[0.14,0.28]])box(0.07,0.45,0.07,d,px,0.22,pz,g);
  box(0.5,0.06,0.06,lam('#c9302b'),0,0.86,0.2,g);parent.add(g);return g;}
const SOCIAL={school:[],sacrifice:[],smoke:[],wedding:null,horoi:[]};
function buildSocial(){
  // sacrificio al amanecer junto al Altar de los Doce Dioses
  {const[ax,az]=AL(-55,-98),gy=terrainH(ax,az),g=grp(ax,gy,az,0);
   const pr=makePerson({chiton:'#f4efe4',himation:'#f4efe4',beard:true,hair:'#8d8a85'});pr.position.set(-6.2,0,0.6);pr.rotation.y=Math.PI/2;g.add(pr);
   pr.userData.arms[0].rotation.x=-2.2;pr.userData.arms[1].rotation.x=-2.2;
   const kn=makePerson({chiton:'#f1e4c4',himation:'#c9a24a',female:true,hair:'#3b2a1e'});kn.position.set(-6.4,0,-1.2);kn.rotation.y=Math.PI/2;g.add(kn);
   const bk=new THREE.Mesh(PGEO.basket,lam('#c9a24a'));bk.position.set(0,1.98,0);kn.add(bk);
   const au=makePerson({chiton:'#d8c9a8',himation:'#6f3a6e',beard:true,hair:'#2b1f17'});au.position.set(-8.4,0,-2);au.rotation.y=Math.PI/2+0.4;g.add(au);
   for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.02,0.45,5),M.wood);p.position.set(s*0.06,1.62,0.32);p.rotation.x=1.1;p.rotation.z=s*0.15;au.add(p);}
   const sh=sheep(g,-4.6,0.2);sh.rotation.y=Math.PI/2;
   const look=[['#e8dfcc','#7a5a3a'],['#efe6d5','#8a3f2f'],['#d7c9ab','#4f6a7d'],['#e2d6c0','#a07a3a']];
   for(let i=0;i<6;i++){const L=look[i%4],p=makePerson({chiton:L[0],himation:L[1],female:i%3===0,beard:i%3!==0,hair:'#3e2c1f'});p.position.set(-9.5-Math.floor(i/3)*1.3,0,-1.6+(i%3)*1.6);p.rotation.y=Math.PI/2;g.add(p);SOCIAL.sacrifice.push(p);}
   SOCIAL.sacrifice.push(pr,kn,au,sh);
   const fl=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));fl.position.set(1,1.3,0);fl.scale.set(1.3,1.6,1);g.add(fl);SOCIAL.sacrifice.push(fl);
   const smM=new THREE.SpriteMaterial({color:'#b8b2a8',transparent:true,opacity:0.35,depthWrite:false});
   for(let i=0;i<10;i++){const s=new THREE.Sprite(smM.clone());s.position.set(1,1.5+i*0.9,0);s.scale.setScalar(0.8+i*0.25);g.add(s);SOCIAL.smoke.push({s,ph:i/10});}
   NPC_POS.mageiros=[...AL(-35,-92.5),Math.PI*0.75];
   SOCIAL.sacG=g;}
  // mujeres en la fuente del sureste
  {const looks=[['#e9dcc4','#8a3f5e'],['#d7c9ab','#5c6b3f'],['#efe6d5','#a07a3a']];
   const bks=['¿Has visto el vestido de la mujer de Calias? Azafrán. A su edad.','Mi cuñada sale de cuentas en Targelión. Iré a ayudarla, claro.','En las Tesmoforias nos burlamos de los hombres todo lo que queremos. Tres días sin ellos, ¡qué descanso!','No me cuentes más, que mi marido vuelve del Pireo a mediodía y no tengo ni el agua.','La de enfrente se pone tanto blanco de plomo que parece una estatua.'];
   for(let i=0;i<3;i++){const[x,z]=AL(60+i*6,73.5+(i%2)*1.5);const L=looks[i];const g=makePerson({chiton:L[0],himation:L[1],female:true,carry:'hydria',hair:'#3b2a1e'});g.position.set(x,floorAt(x,z),z);g.rotation.y=Math.PI+(i-1)*0.5;scene.add(g);addCirc(x,z,0.35);
     walkers.push({g,mode:'idle',tx:x,tz:z,wait:Infinity,speed:0,phase:R()*10,x,z,barks:bks});}
   NPC_POS.aguadora=[...AL(45,68),Math.PI*1.2];}
  // cortejo nupcial al anochecer
  {const pts=[[-292,-184],[-215,-170],[-140,-155]];let L=0;const seg=[];for(let i=0;i<pts.length-1;i++){const l=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);seg.push(l);L+=l;}
   const mem=[],torches=[];const add=(g,back,side)=>{scene.add(g);g.visible=false;mem.push({g,back,side});return g;};
   const cart=new THREE.Group();box(1.3,0.35,2.0,M.wood,0,0.85,0,cart);for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.08,14),lam('#4a3324'));w.rotation.z=Math.PI/2;w.position.set(s*0.72,0.5,0.1);cart.add(w);}
   box(0.08,0.08,1.6,M.wood,0,0.75,1.7,cart);const mule=new THREE.Group();const mc=lam('#6b5a4a');box(0.45,0.5,1.1,mc,0,0.95,0,mule);for(const[px,pz]of[[-0.15,-0.4],[0.15,-0.4],[-0.15,0.4],[0.15,0.4]])box(0.09,0.7,0.09,mc,px,0.35,pz,mule);box(0.22,0.5,0.22,mc,0,1.35,0.55,mule).rotation.x=0.6;box(0.22,0.22,0.45,mc,0,1.55,0.8,mule);mule.position.set(0,0,2.8);cart.add(mule);
   const bride=makePerson({chiton:'#e0a526',himation:'#e8b84a',female:true,hair:'#3b2a1e'});bride.position.set(-0.3,1.02,-0.3);cart.add(bride);
   const groom=makePerson({chiton:'#f4efe4',himation:'#2f4c86',beard:true,hair:'#2b1f17'});groom.position.set(0.32,1.02,-0.3);cart.add(groom);
   const veil=new THREE.Mesh(new THREE.ConeGeometry(0.32,0.9,10,1,true),new THREE.MeshLambertMaterial({color:'#f0d9a0',transparent:true,opacity:0.75,side:THREE.DoubleSide}));veil.position.set(0,1.75,0);bride.add(veil);
   add(cart,0,0);
   const ppl=[['#efe6d5','#6a4d7a',0,-1.6,true,false],['#e9dcc4','#8a3f5e',1,-4,true,true],['#d7c9ab','#4f6a7d',-1,-4,false,true],['#e8dfcc','#7a5a3a',1,-6.2,false,true],['#efe6d5','#a07a3a',-1,-6.2,true,true],['#e2d6c0','#5c6b3f',0,-8,false,false],['#e8dfcc','#8a3f2f',1.1,-9.4,true,false],['#d7c9ab','#7a5a3a',-1.1,-9.4,false,false],['#efe6d5','#4f6a7d',0,4.8,false,true],['#e9dcc4','#a07a3a',0.9,3.6,false,false]];
   for(const[c1,c2,side,back,fem,torch]of ppl){const p=makePerson({chiton:c1,himation:c2,female:fem,beard:!fem,hair:'#3e2c1f'});if(torch)torches.push(torchSprite(p,2.1));add(p,-back,side);}
   SOCIAL.wedding={pts,seg,L,mem,torches,on:false};
   NPC_POS.novia=[...findFree(-300,-176,1.5),Math.PI/2];}
  // mojones de hipoteca en los campos junto al camino de la Academia
  {const rd=ROADS[1],a=rd.pts[0],b=rd.pts[1];for(let i=0;i<3;i++){const t=0.35+i*0.18,x=lerp(a[0],b[0],t)+(i%2?-1:1)*16,z=lerp(a[1],b[1],t)+(i%2?1:-1)*10;const gy=terrainH(x,z);const m=box(0.42,1.0,0.22,M.limestone,x,gy+0.5,z);m.rotation.y=R()*TAU;addCirc(x,z,0.35);
     if(i===0)place('horos_hipoteca','Mojón de hipoteca','ΟΡΟΣ','Una piedra clavada en un campo: «Mojón de un terreno vendido con derecho a recompra a Fanóstrato de Peania por mil dracmas». Cuando una tierra garantizaba una deuda, el acreedor ponía en ella uno de estos horoi, para que todos supieran que no podía venderse ni hipotecarse de nuevo hasta saldar la deuda. Se han encontrado cientos en el Ática. No había ningún registro público de la propiedad.',x+2.5,z+2.5,0);}}
}
function updateSocial(dt,t){
  if(MODE!=='atenas')return;
  const h=clock.h,day=h>=7.5&&h<15,sac=h>=6&&h<9.5;
  const nearS=!SOCIAL.schoolAt||Math.hypot(player.x-SOCIAL.schoolAt[0],player.z-SOCIAL.schoolAt[1])<170;for(const k of SOCIAL.school)k.visible=day&&nearS;   // alumnos y pedagogos: de día y cerca
  for(const o of SOCIAL.sacrifice)o.visible=sac;
  for(const s of SOCIAL.smoke){s.s.visible=sac||(h>=9.5&&h<10.5);if(s.s.visible){const f=(t*0.12+s.ph)%1;s.s.position.y=1.4+f*9;s.s.position.x=1+f*1.5;s.s.material.opacity=0.38*(1-f);s.s.scale.setScalar(0.7+f*3);}}
  const W=SOCIAL.wedding;if(!W)return;const on=h>=18&&h<20;
  if(on!==W.on){W.on=on;W.mem.forEach(m=>m.g.visible=on);if(on&&regionOf(player.x)==='atenas'&&ui==='play'&&Math.hypot(player.x-W.pts[0][0],player.z-W.pts[0][1])<300)toast('<span class="label">Cortejo nupcial</span><br>Al este del Eleusinion, una novia viaja en carro a su nueva casa entre antorchas.');}
  if(!on)return;const s0=(h-18)/2*W.L;
  const at=s=>{s=clamp(s,0,W.L);let i=0;while(i<W.seg.length-1&&s>W.seg[i]){s-=W.seg[i];i++;}const a=W.pts[i],b=W.pts[i+1],u=Math.min(1,s/W.seg[i]);return[lerp(a[0],b[0],u),lerp(a[1],b[1],u),Math.atan2(b[0]-a[0],b[1]-a[1])];};
  W.mem.forEach((m,k)=>{const[x,z,ang]=at(s0+m.back);const ox=Math.cos(ang)*m.side,oz=-Math.sin(ang)*m.side;const px=x+ox,pz=z+oz;m.g.position.set(px,terrainH(px,pz)+(k?Math.abs(Math.sin(t*5+k))*0.04:0),pz);m.g.rotation.y=ang;});
  for(const tc of W.torches){const f=1+Math.sin(t*11+tc.id)*0.1;tc.scale.set(1.3*f,1.7*f,1);}
  const[cx,cz]=at(s0);if(Math.hypot(player.x-cx,player.z-cz)<60){PERF.aulos-=dt;if(PERF.aulos<0){PERF.aulos=3+Math.random()*4;playAulos();}}
}

// ============================================================ estado y guardado
let SAVE_KEY='atenas-386-v1';   // cada época guarda su progreso aparte (Roma: roma-80-v1)
let state;
function loadState(){state={lessons:[],places:[],obols:0,seen:{},done:false,myths:[],steps:{},day:1};
  try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(s&&Array.isArray(s.lessons))state=Object.assign(state,s);}catch(e){}
  if(!Array.isArray(state.myths))state.myths=[];if(!state.gods||!Array.isArray(state.gods.met))state.gods={met:[],q:{}};}
loadState();
const hot=window.claude&&window.claude.hot;
if(hot&&hot.data&&hot.data.state)state=hot.data.state;
function save(){if(typeof ui!=='undefined'&&ui==='play'&&player.x<1e6)state.pos={x:+player.x.toFixed(1),z:+player.z.toFixed(1),yaw:+player.yaw.toFixed(2),h:+clock.h.toFixed(2)};try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch(e){}}
// partidas guardadas: el progreso se guarda solo en el navegador; además se puede sacar a un archivo (o copiar como texto) y volver a cargar
function saveData(){save();return JSON.stringify({juego:'mundo-clasico',modo:MODE,fecha:new Date().toISOString(),state});}
function saveDlg(title,html,opts){const prev=ui;dlg={n:null};ui='dialog';releasePointer();$('dGlyph').textContent='✎';setName(title);$('dTitle').textContent='Partidas guardadas';$('dBody').innerHTML=html;
  const o=$('dOpts');o.innerHTML='';let k=1;for(const[t,fn]of opts.concat([['Cerrar',null]])){const b=document.createElement('button');b.innerHTML='<span class="n">'+(k++)+'</span><span>'+t+'</span>';b.onclick=()=>{if(fn)fn();else{$('dialog').hidden=true;dlg=null;ui=prev==='dialog'?'play':prev;}};o.appendChild(b);}
  $('dialog').hidden=false;}
function exportSave(){const txt=saveData(),name=(MODE==='roma'?'roma-80':'atenas-386')+'-dia'+(state.day||1)+'-'+new Date().toISOString().slice(0,10)+'.json';
  saveDlg('Guardar partida','<p>Tu progreso se guarda solo en este navegador. Para llevártelo a otro ordenador o tener una copia, descarga el archivo o copia este texto y guárdalo donde quieras. Se carga con «Cargar partida».</p><textarea id="saveTxt" readonly style="width:100%;height:90px;font-size:.75rem">'+txt.replace(/</g,'&lt;')+'</textarea>',
   [['Descargar el archivo '+name,()=>offerDownload(name,txt)],
    ['Copiar el texto',()=>{const t=$('saveTxt');t.select();try{navigator.clipboard.writeText(txt).catch(()=>document.execCommand('copy'));}catch(e){try{document.execCommand('copy');}catch(e2){}}toast('Texto de la partida copiado.');}]]);}
// en la página publicada, las descargas pasan por el visor (capacidad downloads), que pide confirmación; fuera de él, un enlace normal
async function offerDownload(name,txt){
  try{const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;
    if(dl){await dl.save({filename:name,data:txt});toast('<span class="label">'+(/^cuaderno/.test(name)?'Archivo descargado':'Partida guardada')+'</span><br>'+name);return;}}
  catch(e){if(e&&e.code==='declined')return;toast('No se ha podido descargar el archivo aquí: copia el texto y guárdalo en un documento.');return;}
  try{const b=new Blob([txt],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}catch(e){}}
function loadSaveText(txt){try{const d=JSON.parse(txt);if(d.juego!=='mundo-clasico'||!d.state||!Array.isArray(d.state.lessons))throw 0;
    localStorage.setItem(d.modo==='roma'?'roma-80-v1':'atenas-386-v1',JSON.stringify(d.state));const u=new URL(location.href);u.searchParams.set('modo',d.modo==='roma'?'roma':'atenas');location.href=u.toString();}
  catch(e){alert('Eso no es una partida guardada de este juego.');}}
function importSave(){
  saveDlg('Cargar partida','<p>Elige un archivo de partida o pega aquí el texto que copiaste. La partida que tengas ahora en esa época se sustituirá.</p><textarea id="loadTxt" style="width:100%;height:90px;font-size:.75rem" placeholder="Pega aquí el texto de la partida"></textarea>',
   [['Elegir un archivo…',()=>{const inp=document.createElement('input');inp.type='file';inp.accept='.json,application/json,text/plain';inp.onchange=()=>{const f=inp.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>loadSaveText(rd.result);rd.readAsText(f);};inp.click();}],
    ['Cargar el texto pegado',()=>loadSaveText($('loadTxt').value)]]);}

// ============================================================ jugador
const player={x:-490,z:-410,feet:0,vy:0,yaw:-2.27,pitch:0.02,grounded:true,eye:1.62,camY:0};
if(hot&&hot.data&&hot.data.player)Object.assign(player,hot.data.player);
if(hot&&hot.snapshot)hot.snapshot(()=>({state,player:{x:player.x,z:player.z,yaw:player.yaw,pitch:player.pitch}}));
const keys={};
let ui='start'; // start | play | dialog | journal | map | voyage | sea | episode | end
const isTouch=('ontouchstart' in window)||navigator.maxTouchPoints>0;
const joy={x:0,y:0};

