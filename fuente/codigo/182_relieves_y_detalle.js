// ============================================================ RELIEVES DE LOS TEMPLOS Y DETALLE SEGÚN LA DISTANCIA
// Propuesta 6. Sobre los entablamentos (007, entablature) se añaden en relieve las piezas que antes solo estaban pintadas:
// · dórico: triglifos con sus tres barras, justo encima de los pintados (mismas posiciones que la textura del friso), la tenia del
//   arquitrabe con una régula bajo cada triglifo, y los mútulos bajo la cornisa (uno sobre cada triglifo y otro sobre cada metopa);
// · jónico: las tres fajas del arquitrabe, que sobresalen un poco cada una, y una fila de dentículos bajo la cornisa.
// Cada edificio junta sus relieves en dos mallas (una por material), así apenas suben las llamadas de dibujo.
// Propuestas 9 y 10. Árboles: de cerca (menos de 70 m; 45 m en móvil) cada copa se cambia por una versión con muchos más racimos de
// hojas y un borde irregular; de lejos sigue la copa sencilla. El cambio es por árbol, no por zona: cada medio segundo los árboles
// cercanos pasan a una malla de detalle y en la sencilla se ocultan (escala cero).
const RLV={n:0};
function rlvMerge(geos){if(!geos.length)return null;const L=geos.map(g=>({g,m:new THREE.Matrix4()}));const m=mergeG(L);geos.forEach(g=>g.dispose());return m;}
{const f=entablature;entablature=function(g,W,L,y,e,o){const r=f.apply(this,arguments);try{rlvAdd(g,W,L,y,e,o||{});}catch(err){console.warn('relieves',err);}return r;};}
function rlvAdd(g,W,L,y,e,o){const ah=e*0.4,fh=e*0.4,ch=e*0.2,blue=[],marb=[];
  const len=[L,L,W,W];
  if(!o.ionic){const ia=o.ia||W/6,rr=[Math.max(1,2*L/ia/4),Math.max(1,2*L/ia/4),Math.max(1,2*W/ia/4),Math.max(1,2*W/ia/4)];
    // taenia: banda fina en lo alto del arquitrabe
    {const t=new THREE.BoxGeometry(W+0.06,0.06,L+0.06);t.translate(0,y+ah-0.03,0);marb.push(t);}
    for(let fc=0;fc<4;fc++){const Ln=len[fc],r=rr[fc],tile=Ln/r,tw=tile*24/256,bw=tw*6/24;
      const PB=(d,o2,w,hh,dep,yy,arr)=>{let x,z,sx,sz;if(fc===0){x=W/2+o2;z=L/2-d;sx=dep;sz=w;}else if(fc===1){x=-W/2-o2;z=-L/2+d;sx=dep;sz=w;}else if(fc===2){x=-W/2+d;z=L/2+o2;sx=w;sz=dep;}else{x=W/2-d;z=-L/2-o2;sx=w;sz=dep;}
        const b=new THREE.BoxGeometry(sx,hh,sz);b.translate(x,yy,z);arr.push(b);};
      for(let m=0;;m++){const s=m/4+12/256;if(s>=r-0.02)break;const d=s*tile;if(d<tw*0.5||d>Ln-tw*0.5)continue;
        const ft=y+ah+fh/2;   // centro del friso
        for(const k of[-1,0,1])PB(d+k*(9/24)*tw,0.035,bw,fh*0.9,0.07,ft-fh*0.03,blue);   // tres barras del triglifo
        PB(d,0.06,tw,0.05,0.04,ft+fh*0.45,blue);   // capitel del triglifo
        PB(d,0.035,tw,0.05,0.07,y+ah-0.085,marb);   // régula bajo la tenia
        PB(d,0.2,tw*1.1,0.06,0.36,y+ah+fh-0.03,marb);   // mútulo sobre el triglifo
        const dm=d+tile/8;if(dm<Ln-tw)PB(dm,0.2,tw*1.1,0.06,0.36,y+ah+fh-0.03,marb);}}   // y sobre la metopa
  }else{// jónico: tres fajas y dentículos
    for(let k=1;k<3;k++){const b=new THREE.BoxGeometry(W+0.035*k,ah/3,L+0.035*k);b.translate(0,y+ah/6+k*ah/3,0);marb.push(b);}
    for(let fc=0;fc<4;fc++){const Ln=len[fc],n=Math.floor(Ln/0.22);for(let i=0;i<n;i++){const d=(i+0.5)*Ln/n;let x,z,sx=0.11,sz=0.11;const o2=0.07;
      if(fc===0){x=W/2+o2;z=L/2-d;}else if(fc===1){x=-W/2-o2;z=-L/2+d;}else if(fc===2){x=-W/2+d;z=L/2+o2;}else{x=W/2-d;z=-L/2-o2;}
      const b=new THREE.BoxGeometry(sx,0.13,sz);b.translate(x,y+ah+fh-0.07,z);marb.push(b);}}}
  const gb=rlvMerge(blue),gm=rlvMerge(marb);
  if(gb){const me=new THREE.Mesh(gb,lam('#2b4479'));me.castShadow=true;me.receiveShadow=true;g.add(me);}
  if(gm){const me=new THREE.Mesh(gm,M.marbleShade);me.castShadow=true;me.receiveShadow=true;g.add(me);}RLV.n++;}

// ---------------------------------------------------------------- copas detalladas de cerca
const TLOD={sets:new Map(),t:0,R:(typeof isTouch!=='undefined'&&isTouch)?45:70,max:(typeof isTouch!=='undefined'&&isTouch)?140:300,zero:new THREE.Matrix4().makeScale(0,0,0)};
try{if(ACC.lite){TLOD.R=30;TLOD.max=80;}}catch(e){}
function tlodHiGeo(lo){// muchos racimos sobre la superficie de la copa sencilla, que queda dentro algo más pequeña
  const p=lo.attributes.position;lo.computeBoundingBox();const b=lo.boundingBox,h=b.max.y-b.min.y,sz=Math.max(b.max.x-b.min.x,b.max.z-b.min.z,h);
  const R=mulberry32(p.count*7+13),list=[];const inner=lo.clone();inner.scale(0.9,0.94,0.9);
  {const c=new THREE.Vector3();b.getCenter(c);inner.translate(c.x*0.1,c.y*0.06,c.z*0.1);}list.push({g:inner,m:new THREE.Matrix4()});
  const N=Math.min(46,Math.max(18,Math.round(sz*7))),pts=[];
  for(let k=0;k<N*6&&pts.length<N;k++){const i=Math.floor(R()*p.count),x=p.getX(i),y=p.getY(i),z=p.getZ(i);if(y<b.min.y+h*0.12)continue;if(pts.some(q=>Math.hypot(q[0]-x,q[1]-y,q[2]-z)<sz*0.085))continue;pts.push([x,y,z]);}
  for(const [x,y,z] of pts){const r=sz*(0.07+R()*0.05),g=new THREE.SphereGeometry(r,7,5),q=g.attributes.position;
    for(let i=0;i<q.count;i++){const a=q.getX(i),bb=q.getY(i),c=q.getZ(i),k=0.78+0.42*nz3(Math.round(a*40+x*7),Math.round(bb*40+y*7),Math.round(c*40+z*7));q.setXYZ(i,a*k,bb*k*0.85,c*k);}
    g.computeVertexNormals();const m=new THREE.Matrix4().makeTranslation(x*1.02,y,z*1.02);list.push({g:g.index?g:g,m});}
  const out=mergeG(list.map(o=>({g:o.g.index?o.g:o.g,m:o.m})));out.computeBoundingSphere();try{if(typeof vegPrep==='function')vegPrep(out);}catch(e){}return out;}
// registro: las copas que se colocan con chunked()
{const f=chunked;chunked=function(geo,mat,items,opt){const n0=CHUNKS.length;f.apply(this,arguments);try{if(!opt||!opt.veg)return;
  let crown=null;for(const nm of['T_olive_crown','T_pine_crown','T_plane_crown','T_cypress']){const P=GLB.parts[nm];if(P&&P.meshes.some(m=>m.geo===geo&&(m.role==='foliage'))){crown=nm;break;}}if(!crown)return;
  const key=crown+'|'+mat.uuid;let S=TLOD.sets.get(key);if(!S){S={lo:geo,mat,ims:[],hi:null,near:new Map(),key};TLOD.sets.set(key,S);}
  for(let i=n0;i<CHUNKS.length;i++)S.ims.push(CHUNKS[i].im);}catch(e){console.warn('tlod',e);}};}
function tlodTick(dt){TLOD.t-=dt;if(TLOD.t>0||!TLOD.sets.size)return;TLOD.t=0.5;const cx=camera.position.x,cz=camera.position.z,R2=TLOD.R*TLOD.R,m4=new THREE.Matrix4(),v=new THREE.Vector3(),c=new THREE.Color();
  for(const S of TLOD.sets.values()){
    if(!S.hi){const geo=plHiGeo(S.lo,S.key.split('|')[0])||tlodHiGeo(S.lo);S.hi=new THREE.InstancedMesh(geo,S.mat,TLOD.max);S.hi.count=0;S.hi.castShadow=true;S.hi.frustumCulled=false;S.hi.userData.veg=true;S.hi.userData.tlod=true;scene.add(S.hi);
      if(S.ims.some(im=>im.instanceColor))S.hi.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(TLOD.max*3),3);}
    const want=new Map();for(const im of S.ims){if(!im.parent||!im.visible)continue;const sp=im.geometry.boundingSphere;if(sp&&Math.hypot(sp.center.x-cx,sp.center.z-cz)>sp.radius+TLOD.R)continue;
      const A=im.instanceMatrix.array,orig=im.userData.tlodOrig;for(let i=0;i<im.count;i++){const o=orig&&orig.has(i)?orig.get(i):null,e=o?o.elements:null;const x=e?e[12]:A[i*16+12],z=e?e[14]:A[i*16+14];
        const dx=x-cx,dz=z-cz;if(dx*dx+dz*dz<R2&&want.size<TLOD.max)want.set(im.uuid+':'+i,[im,i]);}}
    // devolver a la copa sencilla los que se alejan
    for(const [k,[im,i]] of S.near){if(want.has(k))continue;const o=im.userData.tlodOrig;if(o&&o.has(i)){im.setMatrixAt(i,o.get(i));o.delete(i);im.instanceMatrix.needsUpdate=true;}S.near.delete(k);}
    let n=0;for(const [k,[im,i]] of want){let o=im.userData.tlodOrig;if(!o)o=im.userData.tlodOrig=new Map();if(!o.has(i)){im.getMatrixAt(i,m4);o.set(i,m4.clone());im.setMatrixAt(i,TLOD.zero);im.instanceMatrix.needsUpdate=true;}
      S.near.set(k,[im,i]);S.hi.setMatrixAt(n,o.get(i));if(S.hi.instanceColor&&im.instanceColor){im.getColorAt(i,c);S.hi.setColorAt(n,c);}n++;}
    S.hi.count=n;S.hi.instanceMatrix.needsUpdate=true;if(S.hi.instanceColor)S.hi.instanceColor.needsUpdate=true;}}
{const f=uxTick;uxTick=function(dt){f(dt);try{tlodTick(dt);}catch(e){}};}
// ---- copas de detalle hechas en Blender (herramientas/blender/plantas.py → #glbpl): racimos de hojas deformados, unos 3.500
// triángulos por copa. Se traen en segundo plano (datos/glbpl.txt) la primera vez que hay árboles cerca; mientras tanto, y si no
// llegan, se usan las de tlodHiGeo. Cada copa de Blender está en la caja [-0,5,0,5]×[0,1]×[-0,5,0,5] y se estira a la de la copa
// sencilla (encaja con su tronco, su escala y su giro); dentro se deja la sencilla algo encogida, que tapa los huecos entre racimos.
const PLH={tpl:null,loading:0,map:{T_olive_crown:'H_olive',T_pine_crown:'H_pine',T_plane_crown:'H_plane',T_cypress:'H_cypress'}};
function plLoad(){if(PLH.loading||typeof bpBytes!=='function'||!THREE.GLTFLoader)return;PLH.loading=1;
  bpBytes('glbpl').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const T={};gl.scene.traverse(o=>{if(o.isMesh)T[o.name]=o.geometry;});PLH.tpl=T;
    for(const S of TLOD.sets.values()){if(!S.hi)continue;const g=plHiGeo(S.lo,S.key.split('|')[0]);if(g){S.hi.geometry=g;}}},e=>console.warn('plantas',e));}).catch(e=>console.warn('plantas',e));}
function plHiGeo(lo,crown){if(!PLH.tpl){plLoad();return null;}const H=PLH.tpl[PLH.map[crown]];if(!H)return null;
  lo.computeBoundingBox();const b=lo.boundingBox,cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2,y0=b.min.y+(crown==='T_cypress'?0.3:0),w=(b.max.x-b.min.x)*1.04,d=(b.max.z-b.min.z)*1.04,h=b.max.y-y0;
  const g=H.clone();g.deleteAttribute&&g.attributes.uv&&g.deleteAttribute('uv');const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setXYZ(i,cx+p.getX(i)*w,y0+p.getY(i)*h,cz+p.getZ(i)*d);
  if(g.attributes.normal&&g.attributes.normal.normalized){const n=g.attributes.normal,a=new Float32Array(n.count*3);for(let i=0;i<n.count;i++){a[i*3]=n.getX(i);a[i*3+1]=n.getY(i);a[i*3+2]=n.getZ(i);}g.setAttribute('normal',new THREE.Float32BufferAttribute(a,3));}
  g.computeVertexNormals();{const n=g.attributes.normal,cy=y0+h*0.45;for(let i=0;i<n.count;i++){let rx=(p.getX(i)-cx)/w,ry=(p.getY(i)-cy)/h,rz=(p.getZ(i)-cz)/d;const L=Math.hypot(rx,ry,rz)||1;   // normales hacia fuera de la copa: la luz la envuelve como un follaje, sin facetas
    let nx=n.getX(i)*0.4+rx/L*0.6,ny=n.getY(i)*0.4+ry/L*0.6,nz=n.getZ(i)*0.4+rz/L*0.6;const M=Math.hypot(nx,ny,nz)||1;n.setXYZ(i,nx/M,ny/M,nz/M);}}
  const inner=lo.clone();inner.scale(0.86,0.9,0.86);{const c=new THREE.Vector3();b.getCenter(c);inner.translate(c.x*0.14,c.y*0.1,c.z*0.14);}
  const keep=n=>{for(const k of Object.keys(n.attributes))if(k!=='position'&&k!=='normal')n.deleteAttribute(k);return n;};
  const out=mergeG([{g:keep(g),m:new THREE.Matrix4()},{g:keep(inner),m:new THREE.Matrix4()}]);out.computeBoundingSphere();try{if(typeof vegPrep==='function')vegPrep(out);}catch(e){}return out;}
