// ============================================================ PAREDES SÓLIDAS EN TODOS LOS EDIFICIOS
// sealFootprints() se ejecuta al construir la ciudad y no ve lo que se levanta después (destinos, aldeas, caminos, mapas de
// transición, la casa, la granja…), ni los muros de menos de 3 m de grueso, ni las columnas. Esta segunda pasada recorre todas
// las piezas verticales que llegan al suelo y que aún no frenan al jugador, y las «corta» a la altura de la rodilla con rayos:
// así un muro con una puerta deja la puerta libre y bajo un arco de acueducto se puede pasar. No toca la vegetación, lo que se
// mueve (gente, animales, carros, barcos), lo invisible, lo transparente ni los muretes bajos que se saltan.
const SEAL2={t:0,snap:null,done:false,n:{box:0,seg:0,circ:0,skipPeople:0,moved:0},prof:new Map()};
const SEAL2_MAT=new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
function seal2Near(x,z,pad){const i0=Math.floor(x/CELL),j0=Math.floor(z/CELL);for(let i=i0-1;i<=i0+1;i++)for(let j=j0-1;j<=j0+1;j++){const a=cgrid.get(ck(i,j));if(!a)continue;
  for(const o of a){let cx,cz,lim;if(o.s){const dx=o.x2-o.x1,dz=o.z2-o.z1,L=dx*dx+dz*dz;const t=clamp(L?((x-o.x1)*dx+(z-o.z1)*dz)/L:0,0,1);cx=o.x1+dx*t;cz=o.z1+dz*t;lim=o.t+pad;}else{cx=o.x;cz=o.z;lim=o.r+pad;}
    if((x-cx)**2+(z-cz)**2<lim*lim)return true;}}return false;}
function seal2Skip(o){for(let p=o;p;p=p.parent){if(!p.visible)return true;const u=p.userData||{};if(u.arms||u.walk||u.anim||u.pose||u.legs||u.wings||u.noCol||u.veg||u.low||u.tick||u.dir||u.seg)return true;}
  if(typeof BOAT!=='undefined'&&BOAT.g&&seal2In(o,BOAT.g))return true;return false;}
function seal2In(o,g){for(let p=o;p;p=p.parent)if(p===g)return true;return false;}
// recoge las piezas candidatas: caja orientada en planta de cada malla o instancia
function seal2Cands(){const out=new Map(),m=new THREE.Matrix4(),c=new THREE.Vector3(),ax=[new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()],ext=[0,0,0];
  scene.updateMatrixWorld(true);
  scene.traverse(o=>{if(!o.isMesh||!o.geometry||!o.geometry.attributes||!o.geometry.attributes.position||o.isSkinnedMesh)return;if(seal2Skip(o))return;
    const mt=Array.isArray(o.material)?o.material[0]:o.material;if(!mt||(mt.transparent&&mt.opacity<0.9)||mt.isSpriteMaterial||mt.isPointsMaterial||mt.wireframe)return;
    const g=o.geometry;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox;if(!isFinite(bb.min.x))return;
    const one=(mw,i)=>{bb.getCenter(c).applyMatrix4(mw);mw.extractBasis(ax[0],ax[1],ax[2]);ext[0]=(bb.max.x-bb.min.x)/2;ext[1]=(bb.max.y-bb.min.y)/2;ext[2]=(bb.max.z-bb.min.z)/2;
      const L=k=>ax[k].length()||1,ord=[0,1,2].sort((p,q)=>Math.abs(ax[p].y)/L(p)-Math.abs(ax[q].y)/L(q)),v=ord[2];if(Math.abs(ax[v].y)/L(v)<0.97)return;
      const hv=Math.abs(ax[v].y)*ext[v],y0=c.y-hv,y1=c.y+hv;if(y1-y0<1.4)return;
      const hw=k=>2*ext[k]*Math.hypot(ax[k].x,ax[k].z);let h1=ord[0],h2=ord[1];if(hw(h1)<hw(h2)){const t=h1;h1=h2;h2=t;}   // h1: eje largo
      const w=hw(h1),d=hw(h2);if(d<0.08||w<0.25||w>70)return;if(d<3&&w<1.2&&w/d>2.2)return;   // puertas y tablas sueltas
      const gr=terrainH(c.x,c.z),fl=floorAt(c.x,c.z);if(!(Math.abs(y0-gr)<1.3||Math.abs(y0-fl)<1.3||(y0<gr&&y1>gr+1.6)))return;if(fl>y1-0.5)return;
      out.set(o.uuid+'#'+i,{o,i,mw:mw.clone(),x:c.x,z:c.z,y0,y1,w,d,v,h1,h2,ay:ax[v].y,a:Math.atan2(ax[h1].z,ax[h1].x)});};
    if(o.isInstancedMesh){for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);one(m.clone().premultiply(o.matrixWorld),i);}}else one(o.matrixWorld,-1);});
  return out;}
// ¿esta pieza ya frena al jugador? (su contorno tiene colisión o está encerrada por colisiones en todas direcciones)
function seal2Covered(P){const ca=Math.cos(P.a),sa=Math.sin(P.a),W=(lx,lz)=>[P.x+lx*ca-lz*sa,P.z+lx*sa+lz*ca];let pts=[];
  if(P.w<3&&P.w/P.d<2.2)pts=[[0,0]];else if(P.d<3){for(let k=0;k<=8;k++)pts.push([(k/8-0.5)*P.w,0]);}
  else for(let k=0;k<24;k++){const t=k/24*4,s=Math.floor(t),u=t-s-0.5;pts.push([[u*P.w,-P.d/2],[P.w/2,u*P.d],[-u*P.w,P.d/2],[-P.w/2,-u*P.d]][s]);}
  let hit=0;for(const q of pts){const p=W(q[0],q[1]);if(seal2Near(p[0],p[1],pts.length===1?P.d/2+0.2:0.6))hit++;}if(hit/pts.length>=0.5)return true;
  const R=P.w/2+4;for(let k=0;k<8;k++){const an=k/8*TAU,ux=Math.cos(an),uz=Math.sin(an);let ok=false;for(let r=0.3;r<=R&&!ok;r+=0.35)ok=seal2Near(P.x+ux*r,P.z+uz*r,0.05);if(!ok)return false;}return true;}
// perfil de la pieza a la altura de la rodilla, en coordenadas locales: tramos macizos de cada fila (se guarda por geometría)
function seal2Profile(P){const g=P.o.geometry,bb=g.boundingBox,v=P.v,h1=P.h1,h2=P.h2,uy=Math.abs(P.ay)||1,span=bb.max.getComponent(v)-bb.min.getComponent(v);
  const dl=Math.min(span*0.45,0.9/uy),yl=P.ay>0?bb.min.getComponent(v)+dl:bb.max.getComponent(v)-dl;
  const rows=P.d<1.6?1:clamp(Math.round(P.d/0.7),2,10),key=g.uuid+'|'+v+h1+'|'+Math.round(yl*20)+'|'+rows;let pr=SEAL2.prof.get(key);if(pr)return pr;
  if(!SEAL2.tmp){SEAL2.tmp=new THREE.Mesh(new THREE.BufferGeometry(),SEAL2_MAT);SEAL2.rc=new THREE.Raycaster();}
  const tg=new THREE.BufferGeometry();for(const k in g.attributes)tg.setAttribute(k,g.attributes[k]);if(g.index)tg.setIndex(g.index);tg.computeBoundingSphere();tg.computeBoundingBox();
  const T=SEAL2.tmp;T.geometry=tg;T.updateMatrixWorld(true);const rc=SEAL2.rc,o=new THREE.Vector3(),dir=new THREE.Vector3();
  const a0=bb.min.getComponent(h1)-1,a1=bb.max.getComponent(h1)+1,b0=bb.min.getComponent(h2),b1=bb.max.getComponent(h2);pr={rows:[],rowsN:rows,full:true,lenL:bb.max.getComponent(h1)-bb.min.getComponent(h1)};
  for(let r=0;r<rows;r++){const b=rows===1?(b0+b1)/2:b0+(b1-b0)*(r+0.5)/rows;o.set(0,0,0);o.setComponent(v,yl);o.setComponent(h2,b);o.setComponent(h1,a0);dir.set(0,0,0);dir.setComponent(h1,1);
    rc.ray.origin.copy(o);rc.ray.direction.copy(dir);rc.near=0;rc.far=a1-a0;const hs=rc.intersectObject(T,false).map(h=>h.distance+a0).sort((p,q)=>p-q);const H=[];for(const t of hs)if(!H.length||t-H[H.length-1]>1e-3)H.push(t);
    const iv=[];if(H.length>=2){if(H.length%2===0){for(let k=0;k<H.length;k+=2)iv.push([H[k],H[k+1]]);}else iv.push([H[0],H[H.length-1]]);}
    pr.rows.push({b,iv});if(!(iv.length===1&&iv[0][1]-iv[0][0]>pr.lenL*0.92))pr.full=false;}
  SEAL2.prof.set(key,pr);return pr;}
function seal2People(){const L=[];for(const a of[npcObjs,signObjs,(typeof EGX_OBJS!=='undefined'?EGX_OBJS:[]),(typeof godObjs!=='undefined'?godObjs:[]),(typeof MUSE_OBJS!=='undefined'?MUSE_OBJS:[])])for(const o of a||[])if(o&&isFinite(o.x)&&isFinite(o.z))L.push([o.x,o.z]);return L;}
function seal2Enclosed(x,z,R){for(let k=0;k<8;k++){const an=k/8*TAU,ux=Math.cos(an),uz=Math.sin(an);let ok=false;for(let r=0.3;r<=R&&!ok;r+=0.45)ok=seal2Near(x+ux*r,z+uz*r,0.05);if(!ok)return false;}return true;}
function seal2Run(prev){const it=seal2Job(prev);let r;do{r=it.next();}while(!r.done);return SEAL2.n;}
function* seal2Job(prev){const C=seal2Cands(),ppl=seal2People(),lp=new THREE.Vector3(),ln=new THREE.Vector3();let nb=0,ns=0,nc=0;const A=SEAL2.added=SEAL2.added||[];const FOUND=[];SEAL2.fdone=SEAL2.fdone||new Set();
  // donde un camino cruza un muro hay paso (una puerta, una escalera): el eje de los caminos no se cierra nunca
  const RG=new Map(),RC=10;for(const R of ROADS){const p=R.pts,hw=Math.max(1.5,(R.w||3)/2+0.5);for(let i=0;i+1<p.length;i++){const ax=p[i][0],az=p[i][1],bx=p[i+1][0],bz=p[i+1][1],L=Math.hypot(bx-ax,bz-az);for(let u=0;u<=L;u+=1.5){const x=ax+(bx-ax)*u/(L||1),z=az+(bz-az)*u/(L||1),k=Math.floor(x/RC)+','+Math.floor(z/RC);let a=RG.get(k);if(!a)RG.set(k,a=[]);a.push(x,z,hw);}}}
  const onRoad=(x,z)=>{const i0=Math.floor(x/RC),j0=Math.floor(z/RC);for(let i=i0-1;i<=i0+1;i++)for(let j=j0-1;j<=j0+1;j++){const a=RG.get(i+','+j);if(!a)continue;for(let q=0;q<a.length;q+=3)if((x-a[q])**2+(z-a[q+1])**2<a[q+2]*a[q+2])return true;}return false;};
  const busy=(x1,z1,x2,z2,t)=>ppl.some(([px,pz])=>{const dx=x2-x1,dz=z2-z1,L=dx*dx+dz*dz,u=clamp(L?((px-x1)*dx+(pz-z1)*dz)/L:0,0,1);return Math.hypot(px-x1-dx*u,pz-z1-dz*u)<t-0.05;});
  for(const[k,P]of C){yield 0;const Q=prev&&prev.get(k);if(prev&&(!Q||Math.hypot(Q.x-P.x,Q.z-P.z)>0.02||Math.abs(Q.y0-P.y0)>0.02)){SEAL2.n.moved++;continue;}   // se ha movido: no es pared
    if(!SEAL2.fdone.has(k)){SEAL2.fdone.add(k);try{const ca=Math.cos(P.a),sa=Math.sin(P.a);let lo=1e9,wet=false;   // ¿cuelga por su lado de abajo? se le pondrá un zócalo de piedra
      for(const[u,q]of[[-.45,-.45],[.45,-.45],[.45,.45],[-.45,.45],[0,-.45],[0,.45],[-.45,0],[.45,0],[0,0]]){const lx=u*P.w,lz=q*P.d,x=P.x+lx*ca-lz*sa,z=P.z+lx*sa+lz*ca,t=terrainH(x,z);if(t<-0.5||(typeof riverWater==='function'&&riverWater(x,z)!==null)){wet=true;break;}const f=floorAt(x,z);lo=Math.min(lo,f<=P.y0+0.2?Math.max(t,f):t);}
      const gap=P.y0-lo;if(!wet&&gap>0.35&&gap<14&&P.y0-terrainH(P.x,P.z)<1.2)FOUND.push([P.x,P.z,P.w,P.d,P.a,P.y0,lo]);}catch(e){}}
    const col=P.w<3&&P.w/P.d<2.2;
    if(col){if(seal2Near(P.x,P.z,0.05))continue;}
    let pr;try{pr=seal2Profile(P);}catch(e){continue;}
    if(!pr.rows.some(r=>r.iv.length))continue;   // hueco a la altura de la rodilla (pérgola, arco, porche): se pasa
    if(col){const r=(P.w+P.d)/4;if(onRoad(P.x,P.z))continue;if(ppl.some(([px,pz])=>Math.hypot(px-P.x,pz-P.z)<r-0.05)){SEAL2.n.skipPeople++;continue;}addCirc(P.x,P.z,r);nc++;A.push(['circ',P.x,P.z,r,0,0,P.o.name||'',P.y0]);continue;}
    if(pr.full&&P.d>=1.6){{const ca=Math.cos(P.a),sa=Math.sin(P.a);let open=false;for(const[lx,lz]of[[0,0],[-P.w/2+0.5,0],[P.w/2-0.5,0],[0,-P.d/2+0.5],[0,P.d/2-0.5],[-P.w/2+0.5,-P.d/2+0.5],[P.w/2-0.5,P.d/2-0.5],[-P.w/2+0.5,P.d/2-0.5],[P.w/2-0.5,-P.d/2+0.5]]){const x=P.x+lx*ca-lz*sa,z=P.z+lx*sa+lz*ca;if(!seal2Near(x,z,0.05)&&!seal2Enclosed(x,z,40)){open=true;break;}}if(!open)continue;}const ca=Math.cos(P.a),sa=Math.sin(P.a),inside=ppl.some(([px,pz])=>{const dx=px-P.x,dz=pz-P.z,lx=dx*ca+dz*sa,lz=-dx*sa+dz*ca;return Math.abs(lx)<P.w/2+0.4&&Math.abs(lz)<P.d/2+0.4;});
      if(inside){SEAL2.n.skipPeople++;continue;}{let rd=false;for(const[u,v]of[[0,0],[-.45,0],[.45,0],[0,-.45],[0,.45],[-.45,-.45],[.45,.45],[-.45,.45],[.45,-.45]]){const lx=u*P.w,lz=v*P.d;if(onRoad(P.x+lx*ca-lz*sa,P.z+lx*sa+lz*ca)){rd=true;break;}}if(rd){SEAL2.n.road=(SEAL2.n.road||0)+1;continue;}}addBox(P.x,P.z,P.w,P.d,-P.a,0.25);nb++;A.push(['box',P.x,P.z,P.w,P.d,P.a,P.o.name||'',P.y0]);continue;}
    const tw=pr.rowsN===1?Math.max(0.12,P.d/2):P.d/pr.rowsN/2+0.06;
    for(const R of pr.rows)for(const[a,b]of R.iv){if((b-a)*P.w/Math.max(1e-6,pr.lenL)<0.12)continue;
      lp.set(0,0,0);lp.setComponent(P.h1,a);lp.setComponent(P.h2,R.b);ln.set(0,0,0);ln.setComponent(P.h1,b);ln.setComponent(P.h2,R.b);
      lp.applyMatrix4(P.mw);ln.applyMatrix4(P.mw);const t=tw,x1=lp.x,z1=lp.z,x2=ln.x,z2=ln.z;
      const L=Math.hypot(x2-x1,z2-z1);if(L<0.05)continue;
      // ¿ya frena? el centro y los dos extremos del tramo tienen colisión, o el tramo está encerrado (dentro de una casa cerrada)
      const mx=(x1+x2)/2,mz=(z1+z2)/2;if(seal2Near(mx,mz,0.05)&&seal2Near(x1+(x2-x1)*0.1,z1+(z2-z1)*0.1,0.05)&&seal2Near(x2-(x2-x1)*0.1,z2-(z2-z1)*0.1,0.05))continue;
      if(seal2Enclosed(mx,mz,40))continue;
      // los extremos se recortan lo que mide el grosor, para que la tapa redonda del segmento no invada un vano vecino
      const sh=Math.min(t*0.9,L*0.45)/L,ax1=x1+(x2-x1)*sh,az1=z1+(z2-z1)*sh,ax2=x2-(x2-x1)*sh,az2=z2-(z2-z1)*sh;
      if(busy(ax1,az1,ax2,az2,t)){SEAL2.n.skipPeople++;continue;}
      {const LL=Math.hypot(ax2-ax1,az2-az1),n=Math.max(1,Math.ceil(LL/0.5));let st=-1;const put=(i0,i1)=>{const u0=i0/n,u1=i1/n;if((u1-u0)*LL<0.3)return;addSeg(ax1+(ax2-ax1)*u0,az1+(az2-az1)*u0,ax1+(ax2-ax1)*u1,az1+(az2-az1)*u1,t);ns++;A.push(['seg',ax1+(ax2-ax1)*u0,az1+(az2-az1)*u0,ax1+(ax2-ax1)*u1,az1+(az2-az1)*u1,t,P.o.name||'',P.y0,P.w,P.d]);};
       for(let q=0;q<=n;q++){const r=onRoad(ax1+(ax2-ax1)*q/n,az1+(az2-az1)*q/n);if(!r&&st<0)st=q;if(r&&st>=0){put(st,Math.max(st,q-1));st=-1;}if(r)SEAL2.n.road=(SEAL2.n.road||0)+(q===0?0:0);}if(st>=0)put(st,n);}}}
  SEAL2.found=FOUND;
  if(FOUND.length){try{if(!SEAL2.unit){SEAL2.unit=new THREE.BoxGeometry(1,1,1);SEAL2.unit.translate(0,0.5,0);}const q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),items=[];   // cajas instanciadas por zonas, como las casas
    for(const[x,z,w,d,a,y0,lo]of FOUND){const h=y0-lo+0.6;q.setFromAxisAngle(up,-a);items.push({m:new THREE.Matrix4().compose(new THREE.Vector3(x,lo-0.5,z),q.clone(),new THREE.Vector3(w+0.12,h,d+0.12))});}
    const before=CHUNKS.length;chunked(SEAL2.unit,SEAL2.stone||(SEAL2.stone=lam('#a89c86')),items,{far:1200,shadow:false,receive:true});for(let k=before;k<CHUNKS.length;k++){CHUNKS[k].im.userData.noCol=true;CHUNKS[k].im.userData.zocalo=true;}
    SEAL2.n.zocalos=(SEAL2.n.zocalos||0)+FOUND.length;}catch(e){console.warn('zocalos',e);}}
  SEAL2.n.box+=nb;SEAL2.n.seg+=ns;SEAL2.n.circ+=nc;
  {const p={x:player.x,z:player.z};resolve(p,0.35);player.x=p.x;player.z=p.z;}
  return SEAL2.n;}
// en dos tiempos: una foto de las piezas al segundo de juego y el sellado al segundo siguiente, con las que no se han movido
function seal2Tick(dt){if(!state)return;
  if(SEAL2.done){SEAL2.ck=(SEAL2.ck||0)+dt;if(SEAL2.ck<6)return;SEAL2.ck=0;const n=scene.children.length;if(SEAL2.nch===undefined){SEAL2.nch=n;return;}
    if(n!==SEAL2.nch&&performance.now()-(SEAL2.last||0)>30000){SEAL2.nch=n;SEAL2.done=false;SEAL2.t=0;SEAL2.last=performance.now();SEAL2.runs=(SEAL2.runs||1)+1;}return;}   // hay construcciones nuevas (un interior, un destino): otra pasada
  SEAL2.t+=dt;
  if(!SEAL2.snap&&SEAL2.t>1){try{SEAL2.snap=seal2Cands();}catch(e){SEAL2.done=true;console.warn('seal2',e);}return;}
  if(SEAL2.snap&&SEAL2.t>2){if(!SEAL2.job)SEAL2.job=seal2Job(SEAL2.snap);const t0=performance.now(),bud=SEAL2.ms||(ui==='play'?6:40);let r;try{do{r=SEAL2.job.next();}while(!r.done&&performance.now()-t0<bud);}catch(e){console.warn('seal2',e);r={done:true};}
    if(r.done){SEAL2.done=true;SEAL2.job=null;SEAL2.snap=null;SEAL2.prof.clear();SEAL2.nch=scene.children.length;}}}

// ============================================================ CUÁNTOS ÉRAMOS: población de Atenas (386 a.C.) y de Roma (80 d.C.)
// Un escribiente junto al monumento de los Héroes Epónimos (Atenas) y un escriba del Tabularium (Roma). Cifras aproximadas, con su margen.
const POP={A:{who:'Lisícrates',sub:'escribiente, junto a los Héroes Epónimos',look:{chiton:'#d8ccb0',himation:'#6a5a4a',beard:true,hair:'#5a4a3a'},anchor:['eponimos',4,3],
  intro:'«Aquí, en el monumento de los Héroes Epónimos, se cuelgan las listas: quién sirve en el ejército, qué leyes se proponen, quién tiene un pleito. Yo copio nombres todo el día. ¿Quieres saber cuántos somos? Nadie lo sabe con exactitud, pero te lo puedo calcular.»',
  q:[['¿Cuántos ciudadanos hay?','<p>Varones adultos, mayores de dieciocho años, hijos de padre y madre atenienses: unos <b>25.000 o 30.000</b>. Antes de la guerra con Esparta y de la peste del 430 éramos muchos más, quizá 40.000 o 60.000. La peste se llevó a uno de cada tres, y la guerra hizo el resto.</p><p class="sub">Los historiadores lo calculan a partir de los efectivos militares y de los jueces y consejeros que hacían falta cada año (M. H. Hansen).</p>'],
   ['¿Y contando a todos?','<p>En todo el Ática, con mujeres, niños, metecos y esclavos, quizá <b>entre 150.000 y 250.000 personas</b>. Metecos, extranjeros libres que viven aquí y pagan un impuesto especial, el metoikion, puede haber 10.000 o 20.000 adultos. Los esclavos son lo más incierto: según quién lo calcule, de 20.000 a más de 100.000.</p>'],
   ['¿Cuántos viven en la ciudad?','<p>Dentro de las murallas y en el Pireo, quizá <b>entre 35.000 y 60.000</b>. La mayoría de los atenienses vive en los demos del campo: hay unos 139, desde Acarnas hasta Sunio. Cuando los espartanos invadían el Ática todos se metían en la ciudad, y entonces sí que no se cabía.</p>'],
   ['¿Por qué no lo sabéis con exactitud?','<p>Porque nadie cuenta a todo el mundo. Cada demo lleva su registro de ciudadanos, el lexiarchikon grammateion, y la ciudad sabe cuántos hoplitas y remeros puede reunir; pero a las mujeres, los niños y los esclavos no los cuenta nadie. Los historiadores de dentro de muchos siglos tendrán que deducirlo de pistas.</p>']],
  codex:'Atenas hacia el 386 a.C.: unos 25.000-30.000 ciudadanos varones adultos (40.000-60.000 antes de la guerra del Peloponeso y la peste). En todo el Ática, 150.000-250.000 personas contando mujeres, niños, metecos (10.000-20.000 adultos) y esclavos (cifra muy discutida: de 20.000 a más de 100.000). En la ciudad y el Pireo, quizá 35.000-60.000. Fuentes: M. H. Hansen, The Athenian Democracy in the Age of Demosthenes (1991) y Three Studies in Athenian Demography (1988).'},
 R:{who:'Tito Apronio',sub:'escriba del Tabularium',look:{toga:true,chiton:'#efe9dc',himation:'#f3eee2',hair:'#3a2a1e'},anchor:['ro_tabularium',6,10],
  intro:'«Salud. En el Tabularium se guardan las leyes en tablas de bronce, los decretos del Senado y las cuentas del erario. Yo copio y archivo. ¿La población de Roma? Eso es lo que todo el mundo pregunta y nadie sabe. Pero hay pistas.»',
  q:[['¿Cuántos vivís en Roma?','<p>Cerca de <b>un millón de personas</b>, según la estimación más común de los historiadores: algunos bajan a 450.000 u 800.000, otros suben a 1,2 millones. Es la ciudad más grande del mundo. Ninguna ciudad de Europa volverá a ser tan grande hasta Londres, hacia el año 1800.</p>'],
   ['¿Cómo se sabe?','<p>Por el trigo. Augusto fijó en <b>200.000</b> el número de ciudadanos varones adultos que reciben cada mes trigo gratis del Estado, la frumentatio (lo cuenta él mismo en sus Res Gestae, 15). Si a cada uno le sumas su familia, y luego los esclavos, los libertos y los extranjeros, sale una ciudad de en torno a un millón.</p>'],
   ['¿Dónde vive tanta gente?','<p>Amontonada en ínsulas, bloques de pisos de cinco o seis plantas: abajo, tiendas; arriba, cuanto más alto, más pobre. Augusto limitó su altura a unos 70 pies, unos 20 metros. Un catálogo de los barrios de Roma, unos siglos posterior, cuenta unas <b>46.000 ínsulas</b> y solo <b>1.790 domus</b>, casas de una sola familia rica.</p>'],
   ['¿Y los esclavos y los extranjeros?','<p>Los esclavos son quizá una cuarta o una tercera parte de la ciudad. Y los extranjeros libres vienen de todo el Imperio: sirios, egipcios, griegos, judíos, hispanos, galos. Juvenal se queja de que «el Orontes sirio desemboca en el Tíber» (Sátiras III 62).</p>'],
   ['¿Y comparada con Atenas?','<p>La Atenas de Platón, con su puerto, tenía quizá 35.000-60.000 habitantes: Roma tiene entre quince y veinticinco veces más. Solo Roma reúne tanta gente como varias regiones de Grecia juntas.</p>']],
  codex:'Roma hacia el 80 d.C.: cerca de un millón de habitantes (estimaciones entre 450.000 y 1,2 millones), la mayor ciudad del mundo antiguo. 200.000 ciudadanos varones adultos recibían trigo gratis (Augusto, Res Gestae 15). Los catálogos regionarios (siglo IV) cuentan unas 46.000 ínsulas y 1.790 domus. Esclavos, quizá un cuarto o un tercio de la población; muchos extranjeros libres (Juvenal, Sátiras III 62). Fuentes: W. Scheidel, «Population and demography», A Companion to the Ancient Roman World; catálogos Curiosum y Notitia.'}};
function popSetup(){const P=POP[MODE==='roma'?'R':'A'],f=artAnchor(...P.anchor);if(f)artPerson(f,P.look,'pop:talk',P.who,P.sub,3);}
function popAct(o){const P=POP[MODE==='roma'?'R':'A'],z=eduz();if(!z.pop){z.pop=1;save();qAdd('so',1);}
  const menu=html=>vmS('✎',P.who,P.sub,html,[...P.q.map(([t,h])=>[t,()=>menu(h),'quiz']),vmBye]);menu('<p>'+P.intro+'</p>');}
const eduEntriesPop=eduEntries;eduEntries=function(){const E=eduEntriesPop();if(eduz().pop){const P=POP[MODE==='roma'?'R':'A'];E.push({c:'Población',n:MODE==='roma'?'Cuántos viven en Roma':'Cuántos viven en Atenas',t:P.codex});}return E;};

// ============================================================ MIRAR CON ATENCIÓN: lo que el juego ha elegido brilla en azul claro
// Personas, dioses, animales y transeúntes: una capa azul translúcida sobre su cuerpo. Edificios y lugares: el contorno de su planta.
// Objetos y carteles: un anillo azul en el suelo. Así se ve con claridad qué es lo que nombra la mira.
const ATG={list:[],cur:null,t:0,mat:new THREE.MeshBasicMaterial({color:0x7fcfff,transparent:true,opacity:0.6,depthWrite:false}),beam:new THREE.MeshBasicMaterial({color:0xaee6ff,transparent:true,opacity:0.95,depthWrite:false}),rim:new THREE.MeshBasicMaterial({color:0xb8ecff,transparent:true,opacity:0.7,depthWrite:false,side:THREE.BackSide}),
  line:new THREE.LineBasicMaterial({color:0xa8e0ff,transparent:true,opacity:0.95,depthWrite:false}),fill:new THREE.MeshBasicMaterial({color:0x5cbcff,transparent:true,opacity:0.3,depthWrite:false,side:THREE.DoubleSide})};
const artPersonAt=artPerson;artPerson=function(f,look,act,name,sub,r){const n=EGX_OBJS.length,g=artPersonAt(f,look,act,name,sub,r);if(g&&EGX_OBJS.length>n)EGX_OBJS[EGX_OBJS.length-1].g=g;return g;};
function atGlowClear(){for(const m of ATG.list){if(m.parent)m.parent.remove(m);if(m.userData.own)m.geometry.dispose();}ATG.list.length=0;ATG.cur=null;}
function atGlowObj(obj){let n=0;obj.traverse(m=>{if(n>60||!m.isMesh||m.isInstancedMesh||m.isSkinnedMesh||m.userData.atGlow||!m.visible)return;const c=new THREE.Mesh(m.geometry,ATG.mat);c.userData.atGlow=1;c.scale.setScalar(1.02);c.renderOrder=5;m.add(c);ATG.list.push(c);const r=new THREE.Mesh(m.geometry,ATG.rim);r.userData.atGlow=1;r.scale.setScalar(1.09);r.renderOrder=4;m.add(r);ATG.list.push(r);n++;});return n;}
function atGlowFoot(f,y){const g=new THREE.Group();g.userData.atGlow=1;const H=Math.min(22,Math.max(6,Math.max(f.w||0,f.d||0,(f.r||0)*2,10)*0.5));
  if(f.r){const ring=new THREE.Mesh(new THREE.TorusGeometry(f.r+0.6,0.12,6,48),ATG.mat.clone());ring.rotation.x=Math.PI/2;ring.position.y=0.25;ring.userData.own=1;g.add(ring);for(let k=0;k<8;k++){const a=k/8*TAU,l=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(Math.cos(a)*(f.r+0.6),0,Math.sin(a)*(f.r+0.6)),new THREE.Vector3(Math.cos(a)*(f.r+0.6),H,Math.sin(a)*(f.r+0.6))]),ATG.line);g.add(l);}}
  else{const w=(f.w||10)+1.2,d=(f.d||10)+1.2,box=new THREE.BoxGeometry(w,H,d);box.translate(0,H/2,0);const fill=new THREE.Mesh(box,ATG.fill);fill.userData.own=1;g.add(fill);
    const t=Math.max(0.18,Math.min(0.5,Math.max(w,d)/120)),bm=(sx,sy,sz,x,y,z)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),ATG.beam);b.position.set(x,y,z);b.userData.own=1;g.add(b);};   // aristas gruesas, visibles de lejos
    for(const yy of[0.15,H])for(const sz of[-1,1]){bm(w,t,t,0,yy,sz*d/2);bm(t,t,d,sz*w/2,yy,0);}for(const sx of[-1,1])for(const sz of[-1,1])bm(t,H,t,sx*w/2,H/2,sz*d/2);g.rotation.y=-(f.a||0);}
  g.position.set(f.x,y,f.z);scene.add(g);ATG.list.push(g);}
function atGlowRing(x,y,z,r){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,0.08,6,32),ATG.mat);ring.rotation.x=Math.PI/2;ring.position.set(x,y+0.1,z);ring.userData.atGlow=1;scene.add(ring);ATG.list.push(ring);}
function atGlowSet(c){if(c===ATG.cur||(c&&ATG.cur&&c.name===ATG.cur.name&&c.sub===ATG.cur.sub&&Math.hypot(c.x-ATG.cur.x,c.z-ATG.cur.z)<1))return;atGlowClear();ATG.cur=c;if(!c)return;
  try{if(c.obj&&atGlowObj(c.obj))return;
    if(c.place){const nm=String(c.name).toLowerCase();let best=footprints.find(f=>f.name&&!f.reserve&&Math.hypot(f.x-c.x,f.z-c.z)<120&&(f.name.toLowerCase()===nm||nm.includes(f.name.toLowerCase())||f.name.toLowerCase().includes(nm))),bd=best?0:1e9;
      if(!best)for(const f of footprints){if(f.reserve||f.house)continue;const d=Math.hypot(f.x-c.x,f.z-c.z)-(f.r||Math.max(f.w||0,f.d||0)/2);if(d<bd){bd=d;best=f;}}
      if(best&&bd<30){atGlowFoot(best,floorAt(best.x,best.z));return;}atGlowFoot({x:c.x,z:c.z,r:6},floorAt(c.x,c.z));return;}
    atGlowRing(c.x,floorAt(c.x,c.z),c.z,1.1);}catch(e){}}
const atUpdateG=atUpdate;atUpdate=function(){atUpdateG();atGlowSet(AT.on?AT.cur:null);};
const atShowG=atShow;atShow=function(on){atShowG(on);if(!on)atGlowClear();};
const atTickG=atTick;atTick=function(dt){atTickG(dt);if(ATG.list.length){ATG.t+=dt;const k=0.75+0.25*Math.sin(ATG.t*5);const k2=0.85+0.15*Math.sin(ATG.t*5);ATG.mat.opacity=0.6*k2;ATG.rim.opacity=0.7*k2;ATG.fill.opacity=0.3*k2;ATG.beam.opacity=0.95*k2;ATG.line.opacity=0.95*k2;}};

