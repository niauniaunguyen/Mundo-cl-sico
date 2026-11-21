// ============================================================ ROCAS ESCANEADAS (Poly Haven, CC0)
// Rocas reales escaneadas con fotogrametría (https://polyhaven.com, dominio público), simplificadas en herramientas/blender/rocas_polyhaven.py
// (→ modelos/rocas.glb → datos/glbrk.txt, en segundo plano): tres piedras sueltas, dos peñascos, dos paredes de roca, dos acantilados y una
// ladera. Se usan de tres maneras:
//  1. las piedras sueltas del suelo alrededor del jugador (GD.rk, 115): las cercanas se cambian por piedras y peñascos escaneados;
//  2. las laderas empinadas cercanas (fuera de las ciudades): afloran paredes y acantilados de roca, de cara a la pendiente y medio enterrados;
//  3. las cuevas de los interiores (204): las paredes, con paredes de roca escaneadas.
// Material Phong con el color y el relieve (normal map) del escaneo; el tono se ajusta un poco a la piedra caliza de cada sitio.
const RK={tpl:null,loading:0,ims:{},rkL:[],cl:[],cx:1e9,cz:1e9,R:(typeof isTouch!=='undefined'&&isTouch)?20:32,MX:(typeof isTouch!=='undefined'&&isTouch)?50:120,
  CR:(typeof isTouch!=='undefined'&&isTouch)?110:180,CMX:(typeof isTouch!=='undefined'&&isTouch)?14:36,zero:new THREE.Matrix4().makeScale(0,0,0)};
try{if(ACC.lite){RK.R=14;RK.MX=30;RK.CR=80;RK.CMX=8;}}catch(e){}
const RK_PIEDRA=['RK_rock_07','RK_rock_09','RK_stone_01'],RK_PENA=['RK_namaqualand_boulder_02','RK_namaqualand_boulder_05'],RK_PARED=['RK_rock_face_01','RK_rock_face_02'],RK_CLIFF=['RK_namaqualand_cliff_01','RK_namaqualand_cliff_02','RK_mountainside','RK_rock_face_01'];
function rkLoad(){if(RK.loading||typeof bpBytes!=='function'||!THREE.GLTFLoader)return;RK.loading=1;
  bpBytes('glbrk').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const T={};gl.scene.updateMatrixWorld(true);
    gl.scene.traverse(o=>{if(!o.isMesh||!/^RK_/.test(o.name))return;const g=o.geometry.clone();g.applyMatrix4(o.matrixWorld);g.computeBoundingBox();const b=g.boundingBox,s=new THREE.Vector3();b.getSize(s);
      const sm=o.material,m=new THREE.MeshPhongMaterial({map:sm.map||null,normalMap:sm.normalMap||null,shininess:4,specular:new THREE.Color('#1a1a1a'),color:new THREE.Color('#f2ece2')});
      if(m.normalMap)m.normalScale=new THREE.Vector2(1,-1);const nm=o.name.replace(/\.\d+$/,'');T[nm]={g,m,size:s,max:Math.max(s.x,s.y,s.z)};});
    if(!Object.keys(T).length)return;RK.tpl=T;for(const k in T){const n=k===RK_CLIFF[0]||RK_CLIFF.includes(k)||RK_PARED.includes(k)?RK.CMX:RK.MX,im=new THREE.InstancedMesh(T[k].g,T[k].m,n);im.count=0;im.frustumCulled=false;im.castShadow=true;im.receiveShadow=true;
      im.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(n*3),3);scene.add(im);RK.ims[k]=im;}
    GD.cx=1e9;RK.cx=1e9;},e=>console.warn('rocas',e));}).catch(e=>console.warn('rocas',e));}
const _rkM=new THREE.Matrix4(),_rkP=new THREE.Vector3(),_rkQ=new THREE.Quaternion(),_rkS=new THREE.Vector3(),_rkE=new THREE.Euler(),_rkC=new THREE.Color();
// tono: el escaneo (granito y arenisca de Sudáfrica, rocas de Europa) se aclara hacia la caliza gris clara del Ática y del Lacio
function rkTint(x,z,src){const b=0.86+hash(x*1.7,z*2.3)*0.22;_rkC.setRGB(b*1.04,b*1.02,b*0.98);if(src)_rkC.lerp(new THREE.Color(Math.min(1,src.r*1.25),Math.min(1,src.g*1.25),Math.min(1,src.b*1.25)),0.25);return _rkC.clone();}
// (1) piedras del suelo cercanas
function rkFromGD(){RK.rkL.length=0;if(!RK.tpl||!GD.rk)return;const im=GD.rk,P=player,R2=RK.R*RK.R;
  for(let i=0;i<im.count;i++){im.getMatrixAt(i,_rkM);_rkM.decompose(_rkP,_rkQ,_rkS);const dx=_rkP.x-P.x,dz=_rkP.z-P.z;if(dx*dx+dz*dz>R2||_rkS.x<0.05)continue;
    let src=null;try{im.getColorAt(i,_rkC);src=_rkC.clone();}catch(e){}const big=_rkS.x>0.75,L=big?RK_PENA:RK_PIEDRA,k=L[Math.floor(hash(_rkP.x*3.1,_rkP.z*1.9)*L.length)],T=RK.tpl[k];if(!T)continue;
    const want=Math.max(_rkS.x,_rkS.z)*(big?1.1:0.9),s=want/T.max;_rkE.set(0,hash(_rkP.z,_rkP.x)*TAU,0);_rkQ.setFromEuler(_rkE);_rkS.set(s,s*(0.8+hash(_rkP.x,_rkP.z*2)*0.4),s);
    _rkP.y=floorAt(_rkP.x,_rkP.z)-T.size.y*s*0.12;RK.rkL.push({k,m:new THREE.Matrix4().compose(_rkP,_rkQ,_rkS),c:rkTint(_rkP.x,_rkP.z,src)});im.setMatrixAt(i,RK.zero);}
  im.instanceMatrix.needsUpdate=true;rkRebuild();}
{const f=gdTick;gdTick=function(){const cx=GD.cx;const r=f.apply(this,arguments);try{if(!RK.tpl){if(GD.rk&&GD.rk.count)rkLoad();}else if(GD.cx!==cx)rkFromGD();}catch(e){if(!RK.err){RK.err=String(e&&e.stack||e).slice(0,300);console.warn('rocas',e);}}return r;};}
// (2) roca que aflora en las laderas empinadas: celdas de 22 m alrededor del jugador, siempre la misma decisión por celda
function rkSlope(x,z){const e=1.5,gx=(terrainH(x+e,z)-terrainH(x-e,z))/(2*e),gz=(terrainH(x,z+e)-terrainH(x,z-e))/(2*e);return [Math.hypot(gx,gz),gx,gz];}
function rkCliffs(){RK.cl.length=0;if(!RK.tpl)return;const P=player,C=22,n=Math.ceil(RK.CR/C),i0=Math.floor(P.x/C),j0=Math.floor(P.z/C),cand=[],D=RK.dbg={celdas:0,llano:0,bajo:0,ciudad:0,ocupado:0,azar:0};
  for(let i=i0-n;i<=i0+n;i++)for(let j=j0-n;j<=j0+n;j++){const x=(i+hash(i*7.1,j*3.3))*C,z=(j+hash(i*2.9,j*5.7))*C,d=Math.hypot(x-P.x,z-P.z);if(d>RK.CR)continue;D.celdas++;
    const [sl,gx,gz]=rkSlope(x,z);if(sl<0.5){D.llano++;continue;}const t=terrainH(x,z);if(t<2){D.bajo++;continue;}
    try{if(x<8000){if(MODE==='roma'?romaInUrbs(x,z):insideWalls(x,z)){D.ciudad++;continue;}}if(riverWater(x,z)!==null)continue;if(!isFree(x,z,1)){D.ocupado++;continue;}}catch(e){D.err=String(e);continue;}
    if(hash(i*1.3,j*7.9)>Math.min(0.85,0.35+sl*0.4)){D.azar++;continue;}cand.push({x,z,t,sl,gx,gz,d,i,j});}
  cand.sort((a,b)=>a.d-b.d);const cnt={};
  for(const c of cand){const L=c.sl>0.9?RK_CLIFF:RK_CLIFF.concat(RK_PARED),k=L[Math.floor(hash(c.i*4.1,c.j*2.2)*L.length)],T=RK.tpl[k];if(!T)continue;cnt[k]=cnt[k]||0;if(cnt[k]>=RK.CMX)continue;cnt[k]++;
    // de cara a la pendiente (la cara del escaneo mira a +Z): hacia donde baja el terreno
    const yaw=Math.atan2(-c.gx,-c.gz),s=(4+hash(c.i,c.j*3)*6)/Math.max(T.size.x,T.size.y);_rkE.set(0,yaw+(hash(c.j,c.i)-0.5)*0.6,0);_rkQ.setFromEuler(_rkE);
    _rkS.set(s,s*(0.8+hash(c.i*2,c.j)*0.5),s);_rkP.set(c.x,c.t-T.size.y*_rkS.y*0.35,c.z);RK.cl.push({k,m:new THREE.Matrix4().compose(_rkP,_rkQ,_rkS),c:rkTint(c.x,c.z,null)});}
  rkRebuild();}
function rkRebuild(){if(!RK.tpl)return;const n={};for(const k in RK.ims)n[k]=0;
  for(const L of[RK.rkL,RK.cl])for(const o of L){const im=RK.ims[o.k];if(!im||n[o.k]>=im.instanceMatrix.count)continue;im.setMatrixAt(n[o.k],o.m);im.setColorAt(n[o.k],o.c);n[o.k]++;}
  for(const k in RK.ims){const im=RK.ims[k];im.count=n[k];im.instanceMatrix.needsUpdate=true;im.instanceColor.needsUpdate=true;}}
function rkTick(){if(!state||ui==='start')return;if(!RK.tpl){if(!RK.loading&&performance.now()>20000)rkLoad();return;}const P=player;if(P.feet-terrainH(P.x,P.z)>30)return;
  if(typeof INT2!=='undefined'&&INT2.in)return;if(Math.hypot(P.x-RK.cx,P.z-RK.cz)<18)return;RK.cx=P.x;RK.cz=P.z;rkCliffs();}
{let t=0;const f=uxTick;uxTick=function(dt){f(dt);t+=dt;if(t<0.5)return;t=0;try{rkTick();}catch(e){if(!RK.err){RK.err=String(e&&e.stack||e).slice(0,300);console.warn('rocas',e);}}};}
// (3) las cuevas de los interiores (204): las paredes de roca, con paredes escaneadas mirando hacia dentro
{const f=int2Room;int2Room=function(room){const had=!!INT2.rooms[room];const R=f.apply(this,arguments);try{if(had||!R.cave||!RK.tpl)return R;
  const T1=RK.tpl[RK_PARED[0]],T2=RK.tpl[RK_PARED[1]],T3=RK.tpl[RK_CLIFF[0]];if(!T1)return R;let Wc=11,D=12;if(room==='semnai'||room==='mundus'){Wc=14;D=18;}
  // las rocas facetadas de antes se quitan; se ponen paredes escaneadas alrededor (salvo en la boca)
  for(const c of[...R.g.children])if(c.isMesh&&c.geometry&&c.geometry.type==='DodecahedronGeometry')R.g.remove(c);
  const N=16;for(let i=0;i<N;i++){const a=i/N*TAU,x=Math.cos(a)*Wc/2*1.02,z=Math.sin(a)*D/2*1.02;if(z>D/2-2.6&&Math.abs(x)<2.2)continue;const T=[T1,T2,T3][i%3]||T1;
    const s=(4.2+hash(i,room.length)*1.6)/Math.max(T.size.x,T.size.y),m=new THREE.Mesh(T.g,T.m);m.scale.set(s,s*1.15,s);m.position.set(x,-0.4,z);m.rotation.y=Math.atan2(-x,-z);m.castShadow=m.receiveShadow=true;R.g.add(m);}
  }catch(e){console.warn('rocas cueva',e);}return R;};}
