// ============================================================ RIGOR VISUAL: peinados y barbas de cada época, distintivos y objetos de oficio
// Atenas 386: el hombre adulto lleva barba (afeitarse se pondrá de moda con Alejandro: Ateneo 13, 565a); muchas mujeres recogen el pelo en un
// sakkos o una redecilla (kekryphalos), como en los vasos áticos. Roma 80: los hombres van afeitados (la barba vuelve con Adriano, Historia
// Augusta, Adriano 26); las damas llevan el tupé de rizos flavio (retratos de Julia, hija de Tito); los niños libres, la bulla al cuello
// (Plutarco, Cuestiones romanas 101); los senadores, calcei negros. Objetos de oficio en la mano de los personajes según su título.
// La primera vez que ves de cerca cada cosa, un aviso la explica (una vez por partida).
const ST={t:0,curl:null,front:{}};
const ST_TXT={
 sakkos:['El sakkos','Muchas atenienses se recogen el pelo en un sakkos, una bolsa de tela a veces bordada, o en una redecilla (kekryphalos). Así aparecen en los vasos áticos pintados de esta época: hilando, en la fuente o preparando una boda.'],
 barba:['La barba del ciudadano','En Atenas el hombre adulto lleva barba; ir afeitado es cosa de muchachos. Solo dentro de medio siglo, con Alejandro Magno, se pondrá de moda afeitarse (lo cuenta Ateneo, 13, 565a).'],
 afeitado:['Caras afeitadas','En la Roma del 80 casi todos los hombres van afeitados, y el barbero (tonsor) es visita de cada día. La primera afeitada de un joven se celebra: es la depositio barbae. Solo llevan barba los filósofos y quienes están de luto, hasta que el emperador Adriano, dentro de unos cuarenta años, la ponga de moda.'],
 flavio:['El peinado flavio','Las damas de Roma lucen sobre la frente un alto tupé de rizos, hechos con tenacillas calientes (calamistrum) y a veces con postizos. Es la moda de la corte de los Flavios: así aparece Julia, la hija de Tito, en sus retratos. Peinarlas es trabajo de esclavas especialistas, las ornatrices.'],
 bulla:['La bulla','Los niños libres de Roma llevan al cuello la bulla, un amuleto contra el mal de ojo: de oro los ricos, de cuero los pobres. El muchacho la deja, ofrecida a los Lares de la casa, el día que viste la toga viril, hacia los dieciséis años.'],
 calcei:['Los zapatos del senador','Fíjate en sus pies: el senador no lleva sandalias, sino calcei senatorii, botines de cuero negro atados con correas. Los de familia patricia llevan además una lunula, una media luna de marfil.'],
 rollo:['Un rollo de papiro','Los libros de esta época son rollos: hojas de papiro pegadas en una tira larga. Se leen desenrollando con una mano y enrollando con la otra; una obra larga ocupa muchos rollos («libros»).'],
 tablillas:['Tablillas de cera','Dos o más tablas de madera con una capa de cera, unidas como un librito. Se escribe con un punzón (stylos en griego, stilus en latín) y se borra alisando la cera con el otro extremo, que es plano. Sirven para cuentas, cartas y deberes de escuela.'],
 estrigil:['El estrígil','Una rasqueta curva de bronce. En el gimnasio el atleta se unta de aceite y polvo y, tras el ejercicio, se rasca la piel con ella para limpiarse el sudor y la arena.'],
 cayado:['El cayado','El cayado del pastor (kalaúrops en griego, pedum en latín): con el gancho se atrapa por la pata a la oveja o la cabra que se escapa. Es también el atributo de Pan.']};
function stHair(g){let c=null;g.traverse(o=>{if(c||!o.isMesh)return;const p=(o.userData.part||(o.parent&&o.parent.userData.part)||'');if(/^P_hair/.test(p))c=o.material.color.clone();});return c||new THREE.Color('#3b2a1e');}
function stHead(g,m){const gs=g.userData.gs;if(gs&&gs.head){m.position.y-=1.55;gs.head.add(m);}else g.add(m);return m;}
function stFind(g,part){let r=null;g.traverse(o=>{if(!r&&o.userData&&o.userData.part===part)r=o;});return r;}
function stCurlGeo(){if(ST.curl)return ST.curl;const F=faceSpots(),R0=(F.bl!=null?F.bl:0.11)+0.004,s=new THREE.SphereGeometry(0.024,7,5).toNonIndexed(),pos=[],nor=[];
  for(let r=0;r<3;r++){const n=11-r*2;for(let i=0;i<n;i++){const a=-1.15+2.3*i/(n-1)+(r%2)*0.06,R=R0*(0.9-r*0.16),y=1.915+r*0.032;
    const P=s.attributes.position,N=s.attributes.normal;for(let k=0;k<P.count;k++){pos.push(P.getX(k)+Math.sin(a)*R,P.getY(k)+y,P.getZ(k)+Math.cos(a)*R-0.035);nor.push(N.getX(k),N.getY(k),N.getZ(k));}}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return ST.curl=g;}
function stFront(names,y0,y1){const k=names.join()+y0;if(ST.front[k]!==undefined)return ST.front[k];let mz=-1,v=new THREE.Vector3();for(const n of names){const P=GLB.parts[n];if(!P)continue;for(const m of P.meshes){const a=m.geo.attributes.position;for(let i=0;i<a.count;i+=2){v.fromBufferAttribute(a,i).applyMatrix4(m.mat);const y=v.y+P.pos.y;if(y>y0&&y<y1&&v.z+P.pos.z>mz)mz=v.z+P.pos.z;}}}return ST.front[k]=mz>0?mz:0.14;}
function stHand(g,item){const a=g.userData.arms&&g.userData.arms[1];if(!a)return false;g.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(a),sy=g.scale.y||1,hy=(b.min.y-g.position.y)/sy;if(!(hy>0.4&&hy<1.2))return false;
  const y=hy-a.position.y+0.05,W=M.wood;let m;
  if(item==='rollo'){m=new THREE.Mesh(new THREE.CylinderGeometry(0.028,0.028,0.27,8),lam('#e6d8b8'));m.rotation.x=Math.PI/2;m.position.set(0,y,0.06);}
  else if(item==='tablillas'){m=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.21,0.15),lam('#7a5232'));m.position.set(0.02,y-0.06,0.03);}
  else if(item==='estrigil'){m=new THREE.Mesh(new THREE.TorusGeometry(0.06,0.009,4,10,Math.PI*1.1),M.bronze||lam('#a8803a'));m.rotation.y=Math.PI/2;m.position.set(0,y-0.05,0.02);}
  else if(item==='cayado'){m=new THREE.Group();const st=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.022,1.7,6),W);st.position.y=0;m.add(st);const hk=new THREE.Mesh(new THREE.TorusGeometry(0.06,0.016,5,10,Math.PI*1.3),W);hk.position.set(0.06,0.85,0);m.add(hk);m.position.set(0,0.85-a.position.y+0.02,0.06);}
  if(!m)return false;m.traverse(o=>{if(o.isMesh)o.castShadow=true;});m.userData.keep=1;a.add(m);return true;}
function stItem(tt){if(/maestr|gramátic|filósof|poeta|escritor|historiador|orador|retóric|rétor|sofista|bibliotec|rapsod|lector/.test(tt))return'rollo';
  if(/escriba|secretari|contable|banquer|trapezit|argentari|cambista|mercader|comerciante|negociante|publicano|naviero|notari|escribano|alumno|estudiante/.test(tt))return'tablillas';
  if(/atleta|luchador|pancraci|púgil|pugil|gimnas|pedotrib|entrenador|corredor/.test(tt))return'estrigil';
  if(/pastor|cabrer|boyer|porquer|vaquer/.test(tt))return'cayado';return null;}
function stFeat(g,k){(g.userData.feat||(g.userData.feat=[])).push(k);}
function stWalker(w,g,P){const u=g.userData,ro=MODE==='roma',kid=/^niño/.test(u.bt||''),fem=P.has('P_hair_f')||P.has('P_chiton_f'),male=P.has('P_hair_m')&&!fem,arm=P.has('P_galea')||P.has('P_spear')||P.has('P_helmet');
  if(!ro){if(male&&!kid&&!arm&&!P.has('P_beard')&&Math.random()<0.8){const b=glbPart('P_beard',{hair:lam('#'+stHair(g).getHexString())});if(b){stHead(g,b);stFeat(g,'barba');}}else if(P.has('P_beard'))stFeat(g,'barba');
    if(fem&&!kid&&!P.has('P_veil')&&!P.has('P_hydria')&&Math.random()<0.45){const s=new THREE.Mesh(ST.sg||(ST.sg=new THREE.SphereGeometry(0.135,14,10)),lam(['#7a2a1e','#2f4a6a','#d8c8a8','#6a3a5a','#8a6a2a'][Math.floor(Math.random()*5)]));s.scale.set(0.95,0.88,1.22);s.position.set(0,1.87,-0.105);s.castShadow=true;stHead(g,s);stFeat(g,'sakkos');}}
  else{if(P.has('P_beard')&&Math.random()<0.9){const b=stFind(g,'P_beard');if(b){b.parent.remove(b);const F=faceSpots();g.traverse(o=>{if(o.isMesh&&o.material===F.mat&&o.geometry.attributes.color){const c=o.geometry.attributes.color;o.geometry=faceGeo('#'+new THREE.Color(c.getX(0),c.getY(0),c.getZ(0)).getHexString(),true);}});}}
    if(male&&!kid&&!stFind(g,'P_beard')){stTrim(g);stFeat(g,'afeitado');}
    if(fem&&!kid&&!P.has('P_veil')&&Math.random()<0.45){const m=new THREE.Mesh(stCurlGeo(),personMat('#'+stHair(g).getHexString(),'hair'));const cg=m.geometry;if(!cg.attributes.color){const n=cg.attributes.position.count;cg.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(n*3).fill(0.9),3));}m.castShadow=true;stHead(g,m);stFeat(g,'flavio');}
    if(kid){const z=stFront(['P_tunic_short','P_chiton_m','P_chiton_f','P_toga'],1.22,1.42);const b=new THREE.Mesh(ST.bg||(ST.bg=new THREE.SphereGeometry(0.034,10,8)),lam('#d4a640'));b.scale.set(1,1,0.35);b.position.set(0,1.31,z+0.01);g.add(b);
      const c=new THREE.Mesh(ST.cg||(ST.cg=new THREE.TorusGeometry(0.1,0.004,4,18)),lam('#6a4a2a'));c.rotation.x=Math.PI/2-0.5;c.position.set(0,1.5,0.03);g.add(c);stFeat(g,'bulla');}}
  if(!kid&&!u.stoop&&!P.has('P_hydria')&&!P.has('P_amphora')&&!P.has('P_basket')&&!arm&&!u.post){const r=Math.random();const it=r<0.06?'tablillas':r<0.09?'rollo':null;if(it&&stHand(g,it))stFeat(g,it);}}
// patillas: el pelo masculino del modelo baja hasta la mandíbula y de frente parece barba; al romano afeitado se le recorta a la altura de la oreja
function stTrim(g){const hp=stFind(g,'P_hair_m');if(!hp)return;hp.updateMatrix();hp.traverse(o=>{if(!o.isMesh)return;let ng=(ST.trim||(ST.trim=new Map())).get(o.geometry);
  if(!ng){ng=o.geometry.clone();const A=ng.attributes.position,v=new THREE.Vector3(),M4=new THREE.Matrix4().multiplyMatrices(hp.matrix,o.matrix),Mi=M4.clone().invert();
    for(let i=0;i<A.count;i++){v.fromBufferAttribute(A,i).applyMatrix4(M4);if(v.z>-0.03&&v.y<1.83){v.y=1.83+(v.y-1.83)*0.08;v.z=Math.min(v.z,0.07);v.applyMatrix4(Mi);A.setXYZ(i,v.x,v.y,v.z);}}ng.computeVertexNormals();ST.trim.set(o.geometry,ng);}o.geometry=ng;});}
function stNpc(o,g,P,tt){if(!GLB.ok)return;const it=stItem(tt);if(it&&!(it==='cayado'&&P.has('P_staff'))&&!P.has('P_spear')&&!g.userData.pose&&!P.has('P_basket')){if(stHand(g,it)){stFeat(g,it);if(g.userData.post==='cruzados'||g.userData.post==='espalda')g.userData.post='peso';}}
  if(MODE==='roma'&&/senador|cónsul|pretor|censor|emperador/.test(tt)){const sd=lam('#5a3d26'),bk=lam('#1f1612');let ch=false;g.traverse(m=>{if(m.isMesh&&m.material===sd){m.material=bk;ch=true;}});if(ch)stFeat(g,'calcei');}}
function stTick(dt){if(!state||ui!=='play')return;ST.t-=dt;if(ST.t>0)return;ST.t=1;const P=player,seen=state.seen||(state.seen={});let best=null,bd=4.5;
  const chk=g=>{if(!g||!g.visible)return;const f=g.userData.feat;if(!f)return;const d=Math.hypot(g.position.x-P.x,g.position.z-P.z);if(d>=bd)return;for(const k of f)if(!seen['st:'+k]&&ST_TXT[k]){best=k;bd=d;return;}};
  for(const w of walkers)if(!w.home&&Math.abs(w.g.position.x-P.x)<5&&Math.abs(w.g.position.z-P.z)<5)chk(w.g);for(const o of npcObjs)if(!o.hidden&&Math.abs(o.x-P.x)<5&&Math.abs(o.z-P.z)<5)chk(o.g);
  if(best){seen['st:'+best]=1;const T=ST_TXT[best];toast('<span class="label">Fíjate · '+T[0]+'</span><br>'+T[1]);}}
