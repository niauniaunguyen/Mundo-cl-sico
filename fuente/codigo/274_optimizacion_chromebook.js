// ============================================================ OPTIMIZACIÓN PARA CHROMEBOOKS Y MINI-PC (28/11)
// Medido antes de empezar (Atenas, de día, en el Ágora): unas 4.800 llamadas de dibujo y 6,3 millones de triángulos por imagen, más
// 3.600 llamadas en la pasada de sombras. Lo que más pesaba no era el JavaScript sino la tarjeta gráfica:
//  · las tejas de todos los templos y pórticos de todos los mapas (83.000 hiladas) y sus 7.000 antefijas iban en dos mallas para el
//    mundo entero, sin descarte por la vista: ahora van por zonas (008, finishRoofs);
//  · el suavizado de bordes (antialias) y el retoque de color como filtro CSS sobre todo el lienzo, también en el modo ligero.
// Aquí, el resto, con tres niveles de equipo (bajo, medio, alto) que se miden solos la primera vez y un «modo aula»:
//  1 antialias según el nivel (003) · 2 retoque de color en el sombreador (gratis) en vez del filtro CSS · 3 resolución variable
//  también en el modo ligero · 4 algo menos de distancia de dibujo en el ligero · 5 el terreno en trozos que se descartan si no se ven
//  · 6 terreno lejano más sencillo en el ligero · 7 vegetación lejana más cerca en el ligero · 8 sombras de 1024 en el nivel medio
//  · 9 sombreadores compilados de una vez · 11 menos partículas en el ligero · 13 los objetos pequeños dejan de dibujarse antes según
//  el nivel (CULL de 113) · 14 el registro de objetos para descartar, cada dos imágenes en los equipos modestos · 16 sin objetos nuevos
//  en cada vuelta (269) · 28 la interfaz sin desenfoques ni sombras CSS en el ligero · 29 nivel medido y modo aula · 30 informe.
const K9={t:0,fps:0,n:0,acc:0,tierT:0,bench:null,splits:[],culF:1,lite:false,prL:null,shd:0,comp:0,pts:new WeakSet(),veg:new WeakSet()};
function k9Tier(){try{if(ACC.aula||ACC.lite)return 'bajo';return ACC.tier||'alto';}catch(e){return 'alto';}}
function k9Lite(){try{return !!(ACC.lite||ACC.aula);}catch(e){return false;}}
// ---------- 2. retoque de color en el mapeo tonal (antes: filtro CSS sepia/saturación/contraste sobre todo el lienzo en cada imagen)
try{const C=THREE.ShaderChunk,k='vec3 ACESFilmicToneMapping( vec3 color ) {';if(C.tonemapping_pars_fragment.indexOf(k)>=0&&C.tonemapping_pars_fragment.indexOf('ACESFilmicToneMapping0')<0){
  C.tonemapping_pars_fragment=C.tonemapping_pars_fragment.replace(k,'vec3 ACESFilmicToneMapping0( vec3 color ) {')+
  '\nvec3 ACESFilmicToneMapping( vec3 color ) {vec3 c=ACESFilmicToneMapping0(color);float l=dot(c,vec3(0.299,0.587,0.114));c=mix(vec3(l),c,1.08);c=(c-0.5)*1.04+0.505;'+
  'vec3 sp=vec3(dot(c,vec3(0.393,0.769,0.189)),dot(c,vec3(0.349,0.686,0.168)),dot(c,vec3(0.272,0.534,0.131)));return clamp(mix(c,sp,0.05),0.0,1.0);}\n';K9.grade=1;}}catch(e){console.warn('k9 grade',e);}
for(const n of['gqGrade','g4Grade']){try{const f=eval(n);if(typeof f!=='function')continue;const w=function(){const r=f.apply(this,arguments);try{if(K9.grade)renderer.domElement.style.filter='';}catch(e){}return r;};eval(n+'=w');}catch(e){}}
// ---------- 5 y 6. el terreno de Atenas y Roma en trozos (cada uno con su esfera: three.js descarta los que no se ven) y, en el ligero,
// el terreno lejano con menos vértices. Los trozos comparten los atributos de la malla (no se duplica memoria); la malla original deja
// de dibujarse (drawRange 0) pero sigue sirviendo para los rayos contra el suelo.
function k9Split(m,seg,nb){try{const g=m.geometry,idx=g.index,P=g.attributes.position;if(!idx||m.userData.k9split||P.count!==(seg+1)*(seg+1))return;const A=idx.array,per=Math.ceil(seg/nb);
  for(let bj=0;bj<nb;bj++)for(let bi=0;bi<nb;bi++){const j0=bj*per,j1=Math.min(seg,j0+per),i0=bi*per,i1=Math.min(seg,i0+per);if(j1<=j0||i1<=i0)continue;
    const I=new Uint32Array((j1-j0)*(i1-i0)*6);let w=0,mnx=1e9,mny=1e9,mnz=1e9,mxx=-1e9,mxy=-1e9,mxz=-1e9;
    for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++){const q=(j*seg+i)*6;for(let k=0;k<6;k++){const v=A[q+k];I[w++]=v;const x=P.getX(v),y=P.getY(v),z=P.getZ(v);if(x<mnx)mnx=x;if(x>mxx)mxx=x;if(y<mny)mny=y;if(y>mxy)mxy=y;if(z<mnz)mnz=z;if(z>mxz)mxz=z;}}
    const sg=new THREE.BufferGeometry();for(const k in g.attributes)sg.setAttribute(k,g.attributes[k]);sg.setIndex(new THREE.BufferAttribute(I,1));
    const bb=new THREE.Box3(new THREE.Vector3(mnx,mny-2,mnz),new THREE.Vector3(mxx,mxy+2,mxz));sg.boundingBox=bb;sg.boundingSphere=bb.getBoundingSphere(new THREE.Sphere());
    const c=new THREE.Mesh(sg,m.material);c.receiveShadow=m.receiveShadow;c.castShadow=m.castShadow;c.raycast=()=>{};Object.assign(c.userData,{noCull:1,noSeal:1,noInst:1,noCol:1,k9piece:1});m.add(c);}
  g.setDrawRange(0,0);m.raycast=function(rc,out){const d=g.drawRange.count;g.drawRange.count=Infinity;try{THREE.Mesh.prototype.raycast.call(this,rc,out);}finally{g.drawRange.count=d;}};
  m.userData.k9split=1;K9.splits.push(m);}catch(e){console.warn('k9 split',e);}}
if(typeof buildTerrain==='function'){const f=buildTerrain;buildTerrain=function(size,seg,cx,cz,inner){const a=[...arguments];if(!inner&&k9Lite())a[1]=Math.round(seg*0.6);
  const m=f.apply(this,a);if(m&&m.geometry)k9Split(m,a[1],inner?4:3);return m;};}
// ---------- 29. nivel del equipo: la primera vez se mide (5 s de juego, tras 10 s para que se asiente) y se guarda
function k9Bench(dt){if(K9.bench==='done'||k9Lite())return;try{if(ACC.tier){K9.bench='done';return;}}catch(e){return;}
  K9.tierT+=dt;if(K9.tierT<10)return;if(!K9.bench)K9.bench={t:0,n:0};K9.bench.t+=dt;K9.bench.n++;if(K9.bench.t<5)return;
  const fps=K9.bench.n/K9.bench.t,tier=fps<25?'bajo':fps<45?'medio':'alto';K9.bench='done';try{ACC.tier=tier;ACC.tierFps=Math.round(fps);accSave();}catch(e){}k9Apply(true);
  if(tier!=='alto')toast('<span class="label">Calidad ajustada a tu equipo</span><br>Nivel '+tier+' ('+Math.round(fps)+' imágenes/s). Lo puedes cambiar en el menú › Accesibilidad.');}
// ---------- 8 y 13. lo que depende del nivel
function k9Apply(force){const T=k9Tier(),lite=k9Lite();const F=T==='bajo'?0.5:T==='medio'?0.75:1;
  if(F!==K9.culF||force){K9.culF=F;try{for(const e of CULL.reg){if(e.lim0===undefined)e.lim0=e.lim;e.lim=e.lim0*F;}cullEval();}catch(e){}}
  try{const want=T==='alto'?2048:1024;if(sun.shadow.mapSize.x!==want){sun.shadow.mapSize.set(want,want);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}}catch(e){}
  // 4. modo ligero: algo menos de distancia de dibujo (el cielo, más cerca, para que no lo corte)
  try{const far=lite?3500:5000;if(camera.far!==far){camera.far=far;camera.updateProjectionMatrix();skyMesh.scale.setScalar(lite?0.8:1);}}catch(e){}
  try{document.body.classList.toggle('k9lite',lite);}catch(e){}
  if(lite!==K9.lite){K9.lite=lite;K9.prL=null;}}
// los objetos que CULL apunta después ya entran con el límite del nivel
{const f=cullRegister;cullRegister=function(){const n0=CULL.reg.length,r=f.apply(this,arguments);if(K9.culF!==1)for(let i=n0;i<CULL.reg.length;i++){const e=CULL.reg[i];if(e.lim0===undefined){e.lim0=e.lim;e.lim*=K9.culF;}}return r;};}
// ---------- 14. el registro de CULL (de media 3 ms por imagen) cada dos imágenes en los equipos modestos
{const f=cullTick;let acc=0,c=0;cullTick=function(dt){if(k9Tier()==='alto')return f.apply(this,arguments);acc+=dt||0;if((++c%2)!==0)return;const a=acc;acc=0;return f.call(this,a);};}
// ---------- modo aula: 30 imágenes por segundo como mucho (el tope de 258), sin sombras y resolución limitada
{const f=k8On;k8On=function(){try{if(ACC.aula)return true;}catch(e){}return f.apply(this,arguments);};}
// ---------- 3. resolución variable en el modo ligero (189 solo la ajusta fuera de él): entre el 50 % y la del ligero
function k9LiteRes(dt){if(!k9Lite())return;K9.acc+=dt;K9.n++;if(K9.acc<4)return;const fps=K9.n/K9.acc;K9.acc=0;K9.n=0;
  try{const cur=renderer.getPixelRatio();if(K9.prL===null)K9.prL=Math.min(cur,ACC.aula?0.75:cur);let pr=cur;if(fps<26)pr=Math.max(0.5,cur*0.9);else if(fps>40)pr=Math.min(K9.prL,cur/0.9);if(ACC.aula)pr=Math.min(pr,0.75);
    if(Math.abs(pr-cur)>0.01)renderer.setPixelRatio(pr);}catch(e){}}
// ---------- 7 y 11. vegetación lejana más cerca según el nivel (bajo 60 %, medio 80 %) y, en el ligero, la mitad de las partículas
function k9LiteScan(){const lite=k9Lite(),T=k9Tier(),vf=T==='bajo'?0.6:T==='medio'?0.8:1;
  try{for(const c of CHUNKS){if(!c.im||!c.im.userData.veg)continue;if(c.far0===undefined)c.far0=c.far;c.far=c.far0*vf;}}catch(e){}
  try{scene.traverse(o=>{if(!o.isPoints||!o.geometry||!o.geometry.attributes.position)return;const n=o.geometry.attributes.position.count;if(n<200)return;if(o.userData.k9n===undefined)o.userData.k9n=o.geometry.drawRange.count;
    o.geometry.setDrawRange(0,lite?Math.ceil(n/2):o.userData.k9n);});}catch(e){}
  try{if(typeof GB8!=='undefined'&&GB8.fx&&GB8.fx.pts)GB8.fx.pts.visible=!lite;}catch(e){}
  try{if(ACC.aula&&renderer.shadowMap.enabled){renderer.shadowMap.enabled=false;scene.traverse(o=>{if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true);});K9.shd=1;}}catch(e){}
  // los trozos del terreno siguen el material de su malla, por si alguien lo cambia
  for(const m of K9.splits)for(const c of m.children)if(c.userData.k9piece&&c.material!==m.material)c.material=m.material;}
// ---------- 28. interfaz más ligera
try{const st=document.createElement('style');st.textContent='body.k9lite *{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important}';document.head.appendChild(st);}catch(e){}
// ---------- 30. informe de rendimiento, para el profesorado
function k9Report(){const r=renderer,i=r.info,gl=r.getContext();let gpu='';try{const d=gl.getExtension('WEBGL_debug_renderer_info');gpu=d?gl.getParameter(d.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);}catch(e){}
  const mem=performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576)+' MB':'—';
  return ['Nóstos · informe de rendimiento','Fecha: '+new Date().toLocaleString(),'Época: '+MODE+' · zona: '+(typeof regionName==='function'?regionName(player.x,player.z):''),
    'Imágenes por segundo (media de 4 s): '+K9.fps.toFixed(1),'Nivel: '+k9Tier()+(ACC.tierFps?' (medido: '+ACC.tierFps+' imágenes/s)':'')+' · modo ligero: '+(ACC.lite?'sí':'no')+' · modo aula: '+(ACC.aula?'sí':'no'),
    'Ajuste automático: escalón '+(typeof AQ!=='undefined'?AQ.lvl:'?')+' · resolución '+r.getPixelRatio().toFixed(2)+' · suavizado de bordes: '+(typeof AA_ON!=='undefined'&&AA_ON?'sí':'no')+' · sombras: '+(r.shadowMap.enabled?sun.shadow.mapSize.x:'no'),
    'Llamadas de dibujo: '+i.render.calls+' · triángulos: '+i.render.triangles+' · programas: '+i.programs.length+' · geometrías: '+i.memory.geometries+' · texturas: '+i.memory.textures,
    'Objetos descartados por distancia: '+(typeof CULL!=='undefined'?CULL.out+' de '+CULL.reg.length:'?')+' · memoria JS: '+mem,
    'Equipo: '+(navigator.hardwareConcurrency||'?')+' núcleos, '+(navigator.deviceMemory||'?')+' GB · gráfica: '+gpu,'Navegador: '+navigator.userAgent].join('\n');}
function k9ReportOpen(){const t=k9Report();try{navigator.clipboard.writeText(t);}catch(e){}
  jmDlg('📊','Informe de rendimiento','copiado al portapapeles','<p>Pégalo en un correo o en un documento para comparar equipos. No incluye ningún dato personal.</p><pre style="white-space:pre-wrap;font-size:12px;max-height:50vh;overflow:auto">'+t.replace(/</g,'&lt;')+'</pre>',[['Cerrar',()=>{}]]);}
// opciones en Accesibilidad: nivel del equipo, modo aula e informe
{const f=accMenu;accMenu=function(){f.apply(this,arguments);try{const box=$('accBox');if(!box||box.querySelector('[data-k9]'))return;const ref=box.querySelector('input[data-k="lite"]');if(!ref)return;
  const d=document.createElement('div');d.setAttribute('data-k9','1');d.style.cssText='padding:8px;border:1px solid #6a4a30;border-radius:8px;margin:6px 0';
  d.innerHTML='<label style="display:flex;gap:10px;align-items:center;cursor:pointer"><input type="checkbox" data-k9a '+(ACC.aula?'checked':'')+'> Modo aula: como mucho 30 imágenes/s, sin sombras y menos resolución (los equipos se calientan menos y la batería dura más)</label>'+
    '<div style="margin-top:8px">Nivel del equipo: <select data-k9t><option value="">automático'+(ACC.tierFps?' (medido: '+ACC.tierFps+' imágenes/s)':'')+'</option><option value="bajo">bajo</option><option value="medio">medio</option><option value="alto">alto</option></select> <span style="opacity:.7">(el suavizado de bordes cambia al volver a abrir el juego)</span></div>'+
    '<button data-k9r style="margin-top:8px">Copiar informe de rendimiento</button>';ref.closest('label').after(d);
  const sel=d.querySelector('[data-k9t]');sel.value=ACC.tierSet?ACC.tier:'';
  d.querySelector('[data-k9a]').onchange=e=>{ACC.aula=e.target.checked;if(!ACC.aula&&K9.shd){renderer.shadowMap.enabled=true;scene.traverse(o=>{if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true);});K9.shd=0;}accSave();k9Apply(true);};
  sel.onchange=()=>{if(sel.value){ACC.tier=sel.value;ACC.tierSet=1;}else{delete ACC.tier;delete ACC.tierSet;K9.bench=null;K9.tierT=0;}accSave();k9Apply(true);};
  d.querySelector('[data-k9r]').onclick=k9ReportOpen;}catch(e){console.warn('k9 menu',e);}};}
// ---------- bucle
{let t0=0,fn=0;const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;const now=performance.now();if(!t0)t0=now;fn++;if(now-t0>=4000){K9.fps=fn*1000/(now-t0);t0=now;fn=0;}   // con el reloj real (el del juego se frena en los equipos lentos)
  k9Bench(dt);k9LiteRes(dt);
  K9.t+=dt;if(K9.t>2){K9.t=0;k9Apply(false);k9LiteScan();}}catch(e){if(!K9.err){K9.err=1;console.warn('k9',e);}}return r;};}
// 9. todos los sombreadores de la escena, compilados de una vez a los 3 s (en vez de un tirón cada vez que aparece uno nuevo)
{const f=gfTick;let t=0;gfTick=function(dt){const r=f.apply(this,arguments);try{if(state&&ui!=='start'&&!K9.comp){t+=dt;if(t>3){K9.comp=1;renderer.compile(scene,camera);}}}catch(e){}return r;};}
