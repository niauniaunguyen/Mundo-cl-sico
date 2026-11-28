// ============================================================ PERSONAS: más variedad y menos detalle a lo lejos
// Variedad (solo en la gente anónima de la calle; los personajes con nombre no cambian): niños y niñas, ancianos con el pelo gris o
// blanco (algunos calvos), complexiones más anchas o más delgadas, y peinados de mujer distintos: moño en la nuca o cinta en el pelo.
// La elección depende del número de cada transeúnte, no del azar: el mundo sale igual en cada carga.
// Detalle según la distancia: a más de 75 m no se dibujan los ojos, los rasgos de la cara, la barba ni las mangas (no se distinguen y
// cuestan llamadas de dibujo); al acercarte vuelven.
{const f=glbPart;glbPart=function(n,r){const g=f(n,r);if(g)g.userData.part=n;return g;};}
const PV={t:0,list:null,grey:null,white:null};
function pvHash(i,k){const h=Math.sin(i*127.1+k*311.7)*43758.5453;return h-Math.floor(h);}
function pvParts(g,name){const out=[];g.traverse(o=>{if(o.userData&&o.userData.part===name)out.push(o);});return out;}
function pvRecolor(parts,col){const m=lam(col);for(const p of parts)p.traverse(o=>{if(o.isMesh)o.material=m;});}
function pvHead(g){const h=pvParts(g,'P_head')[0];if(!h)return null;g.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(h),c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());
  const inv=new THREE.Matrix4().copy(g.matrixWorld).invert();c.applyMatrix4(inv);const sc=g.scale.x||1;return{c,r:Math.max(s.x,s.z)/2/sc};}
function pvVary(w,i){const g=w.g;if(!g||g.userData.pvDone)return;g.userData.pvDone=true;const fem=pvParts(g,'P_hair_f').length>0,a=pvHash(i,1),b=pvHash(i,2),c=pvHash(i,3);
  if(a<0.11){const s=0.64+b*0.12;g.scale.set(s,s,s);for(const p of pvParts(g,'P_beard'))p.visible=false;g.userData.pvNoBeard=true;w.pvAge='niño';return;}   // niños
  if(a<0.27){// ancianos: pelo gris o blanco; algunos hombres, calvos
    const col=b<0.5?'#9a958c':'#d8d4cc';pvRecolor(pvParts(g,fem?'P_hair_f':'P_hair_m').concat(pvParts(g,'P_beard')),col);if(!fem&&c<0.4)for(const p of pvParts(g,'P_hair_m'))p.visible=false;w.pvAge='anciano';}
  else if(!fem&&c<0.08)for(const p of pvParts(g,'P_hair_m'))p.visible=false;
  // complexión
  const sx=b<0.18?1.13:b>0.85?0.9:1;if(sx!==1){g.scale.x*=sx;g.scale.z*=sx;}
  // peinados de mujer: moño en la nuca o cinta
  if(fem){const H=pvHead(g);if(H){if(c<0.45){const bun=new THREE.Mesh(new THREE.SphereGeometry(H.r*0.55,10,8),(function(){const hp=pvParts(g,'P_hair_f')[0];let m=null;if(hp)hp.traverse(o=>{if(!m&&o.isMesh)m=o.material;});return m||lam('#3b2a1e');})());bun.position.set(H.c.x,H.c.y+H.r*0.15,H.c.z-H.r*0.95);g.add(bun);}
      else if(c<0.7){const band=new THREE.Mesh(new THREE.TorusGeometry(H.r*1.02,H.r*0.09,6,18),lam(['#a8392b','#2f4c86','#c9a24a','#efe6d4'][Math.min(3,Math.floor(b*4))]));band.rotation.x=Math.PI/2;band.position.set(H.c.x,H.c.y+H.r*0.45,H.c.z);g.add(band);}}}}
function pvSetup(){try{(walkers||[]).forEach((w,i)=>pvVary(w,i+(MODE==='roma'?1000:0)));}catch(e){}}
// nivel de detalle: piezas finas de cada persona (ojos, cara, barba, mangas)
function pvFine(g){if(g.userData.pvFine)return g.userData.pvFine;const L=[],F=faceSpots();g.traverse(o=>{const n=o.userData&&o.userData.part;if(n==='P_eyes'||n==='P_beard'||n==='P_sleeve_l'||n==='P_sleeve_r')L.push(o);else if(o.isMesh&&F&&F.mat&&o.material===F.mat)L.push(o);});g.userData.pvFine=L;return L;}
function pvTick(dt){PV.t-=dt;if(PV.t>0||!state)return;PV.t=0.4;const cx=camera.position.x,cz=camera.position.z;
  const L=PV.list||(PV.list=[...(walkers||[]).map(w=>w.g),...(npcObjs||[]).map(o=>o.g)].filter(Boolean));
  for(const g of L){const d=Math.hypot(g.position.x-cx,g.position.z-cz),far=d>75;if(g.userData.pvFar===far)continue;g.userData.pvFar=far;for(const o of pvFine(g))if(!(o.userData.part==='P_beard'&&g.userData.pvNoBeard))o.visible=!far;}}
{const f=uxTick;uxTick=function(dt){f(dt);try{pvTick(dt);}catch(e){}};}
