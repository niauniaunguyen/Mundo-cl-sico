// ============================================================ OPTIMIZACIÓN SIN PERDER CALIDAD (28/11)
// Medido antes (Atenas, navegador de pruebas): 2.253 rótulos, cada uno con su lienzo (unos 440 MB de píxeles, aunque la mayoría solo se
// ve al acercarse); 785 MB de memoria JavaScript tras recolectar, 320 MB de ellos en geometría (175 MB en mallas sueltas, muchas copias
// idénticas de la misma caja o el mismo cilindro); 27.500 objetos en la escena cuyas matrices se recalculaban en cada imagen aunque
// estén quietos; las personas cercanas pasaban a figura de Blender de 21 piezas (21 llamadas de dibujo) en vez de la de una malla.
// Aquí, sin cambiar lo que se ve:
//  · rótulos que se dibujan la primera vez que aparecen (antes, todos al construir el mundo);
//  · geometrías idénticas compartidas (misma forma, mismas medidas, mismos vértices): una copia en memoria y en la tarjeta;
//  · matrices congeladas en lo que lleva un rato quieto, con vigilancia: si algo se mueve, vuelve a calcularse;
//  · las personas cercanas, con la figura de Blender de una malla (269), y más de ellas;
//  · sin sombra lo diminuto (menos de 25 cm: a la resolución del mapa de sombras no se distingue);
//  · el mapa de sombras, cada tres imágenes si ni la cámara ni el sol se mueven (cada dos si se mueven, como antes);
//  · el registro de objetos para descartar por distancia (113), cada cuatro imágenes una vez apuntado todo;
//  · en 036: la textura proyectada en tres direcciones solo lee las proyecciones con peso, y el terreno solo las capas presentes;
//  · medir: tiempo de la tarjeta gráfica en el informe (si el navegador lo permite) y un recorrido de prueba fijo en Accesibilidad.
const K11={lab:0,labBuilt:0,geo:0,geoSaved:0,frz:0,unfrz:0,tiny:0,t:0,scan:0};
// ---------- rótulos perezosos
const K11_PH=(()=>{const t=new THREE.DataTexture(new Uint8Array([0,0,0,0]),1,1,THREE.RGBAFormat);t.needsUpdate=true;return t;})();
{const f=labelSprite;labelSprite=function(name,sub,fict){const a=arguments,m=new THREE.SpriteMaterial({map:K11_PH,depthTest:false,transparent:true,fog:false}),s=new THREE.Sprite(m);
  s.scale.set(2.6,0.65,1);s.renderOrder=10;K11.lab++;
  s.onBeforeRender=function(){if(s.userData.k11)return;s.userData.k11=1;try{const r=f.apply(null,a),k=s.scale.y/0.65;m.map=r.material.map;s.scale.x=r.scale.x*k;s.scale.y=r.scale.y*k;m.needsUpdate=true;r.material.dispose();K11.labBuilt++;}catch(e){}};
  s.userData.k11get=()=>{if(!s.userData.k11)s.onBeforeRender();return s;};return s;};}
// ---------- geometrías idénticas compartidas
function k11GeoKey(g){if(!g||!g.parameters||!g.attributes.position||g.groups.length>1||g.morphAttributes&&Object.keys(g.morphAttributes).length)return null;const P=g.attributes.position.array;
  if(!g.boundingBox)g.computeBoundingBox();const b=g.boundingBox;let s1=0,s2=0;for(let i=0;i<Math.min(P.length,60);i++){s1+=P[i]*(i+1);s2+=P[P.length-1-i]*(i+1);}
  const uv=g.attributes.uv?g.attributes.uv.array:null;let su=0;if(uv)for(let i=0;i<Math.min(uv.length,24);i++)su+=uv[i]*(i+1);
  return g.type+'|'+JSON.stringify(g.parameters)+'|'+P.length+'|'+(g.index?g.index.count:0)+'|'+[b.min.x,b.min.y,b.min.z,b.max.x,b.max.y,b.max.z].map(v=>v.toFixed(4)).join(',')+'|'+s1.toFixed(3)+'|'+s2.toFixed(3)+'|'+su.toFixed(3)+'|'+Object.keys(g.attributes).join(',');}
function k11Dedupe(){const t0=performance.now(),users=new Map();
  scene.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh||o.isInstancedMesh)return;const g=o.geometry;if(!g||!g.parameters)return;let L=users.get(g);if(!L)users.set(g,L=[]);L.push(o);});
  const canon=new Map();let n=0,bytes=0;
  for(const[g,L]of users){const k=k11GeoKey(g);if(!k)continue;const c=canon.get(k);if(!c){canon.set(k,g);continue;}if(c===g)continue;
    for(const o of L)o.geometry=c;let b=0;for(const a in g.attributes)b+=g.attributes[a].array.byteLength;if(g.index)b+=g.index.array.byteLength;bytes+=b;try{g.dispose();}catch(e){}n++;}
  K11.geo+=n;K11.geoSaved+=bytes;K11.geoMs=Math.round(performance.now()-t0);}
// ---------- matrices congeladas en lo que está quieto
const K11F={roots:new Map(),i:0,list:[]};
function k11Dyn(o){if(o.isLight||o.isCamera||o===skyMesh||(typeof STARS!=='undefined'&&o===STARS))return true;const u=o.userData||{};if(u.legs||u.bp||u.bpf||u.npb||u.npbHold||u.pj||u.gx8||u.gts||u.chunk||u.ed||u.k9piece)return true;
  if(o.isInstancedMesh||o.isPoints||o.isSprite)return true;return false;}
function k11Hash(o){let h=0,i=1,dyn=false;o.traverse(c=>{if(dyn)return;if(c.isSkinnedMesh||c.isBone||c.isSprite){dyn=true;return;}   /* con rótulo: personajes que se giran al hablarles */const p=c.position,q=c.quaternion,s=c.scale;h+=(p.x*1.3+p.y*2.1+p.z*3.7+q.x*5+q.y*7+q.z*11+q.w*13+s.x*17+s.y*19+s.z*23)*(i%89+1);i++;});return dyn?NaN:h+i*1e-3;}
function k11Set(o,on){o.traverse(c=>{c.matrixAutoUpdate=on;});if(on)o.matrixWorldNeedsUpdate=true;}
function k11FreezeTick(){const ch=scene.children;if(!ch.length)return;let W=0;
  for(let k=0;k<350&&ch.length;k++){K11F.i=(K11F.i+1)%ch.length;const o=ch[K11F.i];if(!o||k11Dyn(o))continue;let S=K11F.roots.get(o);const h=k11Hash(o);W++;
    if(h!==h){if(S&&S.fz){k11Set(o,true);S.fz=0;K11.unfrz++;}K11F.roots.set(o,{h:NaN,n:-1e9,fz:0});continue;}
    if(!S){K11F.roots.set(o,{h,n:0,fz:0});continue;}
    if(Math.abs(S.h-h)>1e-6){if(S.fz){k11Set(o,true);S.fz=0;K11.unfrz++;}S.h=h;S.n=0;continue;}
    S.n++;if(!S.fz&&S.n>=3){o.updateMatrixWorld(true);k11Set(o,false);S.fz=1;K11.frz++;}}}
// lo que mueve el propio juego, sin esperar a la vigilancia: los grupos que CULL vuelve a meter en la escena ya traen su matriz
// ---------- las personas cercanas: figura de Blender de una malla, y más
try{const f=npcDress;npcDress=function(){BP1.on++;try{return f.apply(this,arguments);}finally{BP1.on--;}};}catch(e){}
// las de lejos también (una llamada en vez de unas 20 de la figura de piezas), pero quietas, con la versión aligerada y sin sombra;
// solo se animan las de menos de 60 m (en móvil y ligero, menos)
const K11N={anim:60,lowD:28};
try{const lite=typeof ACC!=='undefined'&&ACC.lite,touch=typeof isTouch!=='undefined'&&isTouch;if(lite){NPB.R=140;NPB.K=110;NPB.MAXB=150;K11N.anim=30;K11N.lowD=18;}else if(touch){NPB.R=200;NPB.K=180;NPB.MAXB=240;K11N.anim=40;}else{NPB.R=320;NPB.K=320;NPB.MAXB=420;}}catch(e){}
{const f=npbTick;npbTick=function(){const r=f.apply(this,arguments);try{const L2=K11N.lowD*K11N.lowD;for(const e of NPB.list){const F=e.f;if(!F)continue;F.d2=e.d2;
  if(!F.me){F.root.traverse(o=>{if(!F.me&&o.isSkinnedMesh)F.me=o;});if(F.me)F.me.userData.full=F.me.geometry;}const me=F.me;if(!me)continue;const low=BP1.low[e.g.userData.npbKind],far=e.d2>L2;
  if(low&&me.userData.isLow!==far){me.userData.isLow=far;me.geometry=far?low:me.userData.full;}me.castShadow=!far;}}catch(err){}return r;};}
function k11NpbFill(){let n=0;try{const W=new Set(walkers.map(w=>w.g));for(const g of NPB.all){if(g.userData.npb||!g.parent||W.has(g)||(g.parent.userData&&g.parent.userData.old===g))continue;if(npcOk(g)){NPB.list.push({g,f:null,d2:1e12});n++;}}}catch(e){}return n;}
{const f=npbAnim;npbAnim=function(dt){const all=NPB.vis,A2=K11N.anim*K11N.anim;NPB.vis=all.filter(F=>!(F.d2>A2));try{return f.apply(this,arguments);}finally{NPB.vis=all;}};}
// ---------- sin sombra lo diminuto
const _k11B=new THREE.Box3(),_k11V=new THREE.Vector3();
function k11Tiny(){let n=0;scene.traverse(o=>{if(!o.isMesh||!o.castShadow||o.isInstancedMesh||o.isSkinnedMesh||o.userData.k11t)return;o.userData.k11t=1;const g=o.geometry;if(!g)return;if(!g.boundingSphere)g.computeBoundingSphere();
  o.getWorldScale(_k11V);const r=g.boundingSphere.radius*Math.max(_k11V.x,_k11V.y,_k11V.z);if(r<0.125){o.castShadow=false;n++;}});K11.tiny+=n;}
// ---------- el mapa de sombras
{let lx=null,lz=null,ls=null,f3=0;const f=o8Tick;o8Tick=function(){const r=f.apply(this,arguments);try{if(!renderer.shadowMap.enabled)return r;const p=camera.position,still=lx!==null&&Math.abs(p.x-lx)+Math.abs(p.z-lz)<0.05&&ls!==null&&Math.abs(SUNDIR.x-ls)<1e-4;lx=p.x;lz=p.z;ls=SUNDIR.x;
  if(still){f3++;renderer.shadowMap.needsUpdate=(f3%3===0);}else f3=0;}catch(e){}return r;};}
// ---------- el registro de CULL, más espaciado una vez apuntado todo
{const f=cullRegister;let c=0;cullRegister=function(max,full){if(full||!CULL.passed)return f.apply(this,arguments);if((++c%4)!==0)return 0;return f.apply(this,arguments);};
 const g=cullRegister;cullRegister=function(max,full){const ci=CULL.ci||0,r=g.apply(this,arguments);if(!full&&(CULL.ci||0)<ci)CULL.passed=1;return r;};}
// ---------- tiempo de la tarjeta gráfica (EXT_disjoint_timer_query_webgl2; Chrome lo da en muchos equipos, no en todos)
const K11G={ext:null,q:null,ms:0,n:0,ok:false,on:false};
try{const gl=renderer.getContext();K11G.ext=gl.getExtension('EXT_disjoint_timer_query_webgl2');K11G.ok=!!K11G.ext;
  if(K11G.ok){const f=renderer.render.bind(renderer);renderer.render=function(s,c){if(!K11G.on||s!==scene)return f(s,c);const gl=renderer.getContext(),X=K11G.ext;
    if(K11G.q&&gl.getQueryParameter(K11G.q,gl.QUERY_RESULT_AVAILABLE)){if(!gl.getParameter(X.GPU_DISJOINT_EXT)){const ns=gl.getQueryParameter(K11G.q,gl.QUERY_RESULT);K11G.ms=K11G.ms*0.9+ns/1e6*0.1;K11G.n++;}gl.deleteQuery(K11G.q);K11G.q=null;}
    if(K11G.q)return f(s,c);const q=gl.createQuery();gl.beginQuery(X.TIME_ELAPSED_EXT,q);try{return f(s,c);}finally{gl.endQuery(X.TIME_ELAPSED_EXT);K11G.q=q;}};}}catch(e){}
{const f=k9Report;k9Report=function(){let t=f.apply(this,arguments);t+='\nTarjeta gráfica: '+(K11G.ok?(K11G.n?K11G.ms.toFixed(1)+' ms por imagen':'midiendo… (vuelve a copiar el informe en unos segundos)'):'el navegador no da este dato')+
  '\nOptimización: '+K11.labBuilt+' de '+K11.lab+' rótulos creados · '+K11.geo+' geometrías repetidas compartidas ('+Math.round(K11.geoSaved/1048576)+' MB) · '+K11.frz+' grupos quietos congelados ('+K11.unfrz+' descongelados) · '+K11.tiny+' piezas diminutas sin sombra';
  if(K11.bench)t+='\nRecorrido de prueba: '+K11.bench;return t;};}
{const f=k9ReportOpen;k9ReportOpen=function(){K11G.on=true;return f.apply(this,arguments);};}
// ---------- recorrido de prueba: cinco vistas fijas, 6 s cada una; imágenes por segundo, llamadas de dibujo y triángulos
const K11_RUTA={atenas:[['mercado',0],['partenon',1.2],['teatro',2.6],['ceramico',4],['pnyx',5.2]],roma:[['foro',0],['ro_coliseo',1.5],['ro_circo',3],['ro_panteon',4.2],['ro_jupiter',5.5]]};
function k11Bench(done){if(K11.running)return;K11.running=1;K11G.on=true;const L=(K11_RUTA[MODE==='roma'?'roma':'atenas']).map(([id,a])=>{const p=PLACES.find(q=>q.id===id);return p?{p,a}:null;}).filter(Boolean);
  const save={x:player.x,z:player.z,feet:player.feet,yaw:player.yaw,pitch:player.pitch},res=[];let i=0;const info=renderer.info;
  toast('<span class="label">Recorrido de prueba</span><br>30 segundos: no toques nada.');
  const step=()=>{if(i>=L.length){Object.assign(player,save);player.camY=player.feet+(player.eye||1.6);K11.running=0;
      const fps=res.reduce((a,r)=>a+r.fps,0)/res.length,cl=Math.round(res.reduce((a,r)=>a+r.calls,0)/res.length),tr=Math.round(res.reduce((a,r)=>a+r.tris,0)/res.length);
      K11.bench=fps.toFixed(1)+' imágenes/s de media; '+cl+' llamadas y '+Math.round(tr/1000)+' mil triángulos por imagen'+(K11G.n?'; tarjeta gráfica '+K11G.ms.toFixed(1)+' ms':'')+' ('+res.map(r=>r.id+' '+r.fps.toFixed(0)).join(', ')+')';
      if(done)done(K11.bench);else k9ReportOpen();return;}
    const {p,a}=L[i];const dx=Math.sin(a)*26,dz=Math.cos(a)*26;player.x=p.x+dx;player.z=p.z+dz;player.feet=floorAt(player.x,player.z)+8;player.camY=player.feet+(player.eye||1.6);player.vy=0;player.yaw=Math.atan2(dx,dz);player.pitch=-0.18;
    let n=0,calls=0,tris=0,t0=0;const meas=now=>{if(!t0)t0=now;const el=now-t0;if(el>1500){n++;calls+=info.render.calls;tris+=info.render.triangles;}if(el<6000){requestAnimationFrame(meas);return;}
      res.push({id:p.id,fps:n/4.5,calls:calls/Math.max(1,n),tris:tris/Math.max(1,n)});i++;step();};requestAnimationFrame(meas);};
  step();}
{const f=accMenu;accMenu=function(){f.apply(this,arguments);try{const d=document.querySelector('#accBox [data-k9]');if(!d||d.querySelector('[data-k11]'))return;const b=document.createElement('button');b.dataset.k11=1;b.style.cssText='margin:8px 0 0 8px';
  b.textContent='Recorrido de prueba (30 s)';b.onclick=()=>{try{closeModals&&closeModals();}catch(e){}try{ui='play';}catch(e){}setTimeout(()=>k11Bench(),400);};d.appendChild(b);}catch(e){}};}
// ---------- el bucle
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;K11.t+=dt;K11.scan+=dt;
  k11FreezeTick();
  if(!K11.d1&&K11.t>6){K11.d1=1;k11Dedupe();k11Tiny();}
  if(!K11.d2&&BP.ready&&BP1.done>=Object.keys(BP1.tpl).length&&BP1.done>0){K11.d2=1;k11NpbFill();}   // con las plantillas ya cargadas: npcOk descarta para siempre a quien no puede vestir
  if(K11.scan>30){K11.scan=0;k11Dedupe();k11Tiny();}}catch(e){if(!K11.err){K11.err=1;console.warn('k11',e);}}return r;};}
// rayos contra rótulos sin cámara: three avisa en cada rayo («Raycaster.camera needs to be set»); se les da la del juego
for(const n of['intersectObject','intersectObjects']){const f=THREE.Raycaster.prototype[n];THREE.Raycaster.prototype[n]=function(){if(!this.camera&&typeof camera!=='undefined')this.camera=camera;return f.apply(this,arguments);};}
