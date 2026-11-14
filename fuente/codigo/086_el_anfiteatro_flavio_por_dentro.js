// ============================================================ EL ANFITEATRO FLAVIO POR DENTRO: muros, deambulatorios, vomitoria y el acceso del espectador
// 1) Sobre los túneles de los ejes mayores el anfiteatro seguía cerrado: muro interior y gradas por encima del túnel.
// 2) Techos de los deambulatorios en cada piso, para que por los arcos no se vea ni el cielo ni la parte de atrás de las gradas.
// 3) Vomitoria en la cavea y el recorrido real del espectador: tésera (arco, sector, grada, asiento), deambulatorio, escalera y vomitorio.
const COLX={A:94,B:78,gy:2,ai:41.5,bi:24,ST:30,seats:[]};
function colTier(j){return 4.2+(40-4.2)*(j+1)/COLX.ST;}
const romaColosseum0=romaColosseum;romaColosseum=function(){romaColosseum0();try{colPlus();}catch(e){console.warn('colPlus',e);}};
function colPlus(){const C=ROMA.col,{A,B,gy,ai,bi,ST}=COLX,ao=A-7,bo=B-7,tunnel=u=>Math.abs(Math.sin(u*TAU))<0.13,j0=3;
  // muro interior y gradas por encima de los túneles de los ejes
  ringMesh(ringGeo(2,96,(u,k)=>{const t=u*TAU;return[ao*Math.cos(t),k?40:7.8,bo*Math.sin(t)];},u=>!tunnel(u),()=>'#bfb39a'),C.x,gy,C.z);
  ringMesh(ringGeo(2,240,(u,k)=>{const t=u*TAU;return[ao*Math.cos(t),k?7.8:0,bo*Math.sin(t)];},u=>!tunnel(u)||Math.abs(Math.sin(u*TAU))*bo<3.6,()=>'#bfb39a'),C.x,gy,C.z);   // a los lados del túnel, también abajo
  const K=1+2*(ST-j0),P=(u,k)=>{const t=u*TAU;let s,y;if(k===0){s=j0/ST;y=7.8;}else{const j=j0+Math.floor((k-1)/2),e=(k-1)%2;s=(j+e)/ST;y=colTier(j);}return[lerp(ai,ao,s)*Math.cos(t),y,lerp(bi,bo,s)*Math.sin(t)];};
  ringMesh(ringGeo(K,128,P,u=>!tunnel(u),k=>k%2?'#e6dccb':'#bfb39b'),C.x,gy,C.z);
  CAVEAS.push({k:'c',x:C.x,z:C.z,a:0,gy,ai,bi,ao,bo,ST,s0:j0/ST,rr:ao+1});   // las gradas se pisan: se sube y se baja por ellas
  // techos de los deambulatorios (bóvedas vistas desde abajo) y cubierta del último piso
  const ann=(y,r1a,r1b,r2a,r2b,col)=>{const s=new THREE.Shape();s.absellipse(0,0,r1a,r1b,0,TAU,false,0);const h=new THREE.Path();h.absellipse(0,0,r2a,r2b,0,TAU,true,0);s.holes.push(h);
    const g=new THREE.ShapeGeometry(s,96);g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:col,side:THREE.DoubleSide}));m.position.set(C.x,gy+y,C.z);m.receiveShadow=true;scene.add(m);return m;};
  for(const y of[10.3,22.1,33.9])ann(y,A-1.4,B-1.4,ao,bo,'#a89c84');ann(46,A-0.6,B-0.6,ao-1,bo-1,'#b8ab90');
  // vomitoria: bocas oscuras en la cavea, en la parte alta de cada meniano
  const dark=lam('#1a1410'),lin=lam('#d8ccb4');
  for(const[j,n]of[[9,24],[19,32],[27,36]]){const s=(j+1)/ST,a=lerp(ai,ao,s),b=lerp(bi,bo,s),y=gy+colTier(j);
    for(let i=0;i<n;i++){const t=(i+0.5)/n*TAU;if(Math.abs(Math.sin(t))<0.2&&j<9)continue;const x=C.x+a*Math.cos(t),z=C.z+b*Math.sin(t),g=grp(x,y,z,Math.atan2(-Math.cos(t),-Math.sin(t)));
      box(2.2,2.6,0.6,dark,0,1.3,0.1,g);box(2.8,0.4,0.8,lin,0,2.8,0.1,g);}}
  // las cuatro entradas del público, con su número de arco
  COLX.ent=[];[[0.33,'XXIV'],[0.67,'LIII'],[0.17,'IX'],[0.83,'LXVII']].forEach(([f,num])=>{const t=f*TAU,x=C.x+(A+3)*Math.cos(t),z=C.z+(B+3)*Math.sin(t);COLX.ent.push({t,num,x,z});});}
function colSetup(){if(MODE!=='roma'||!COLX.ent)return;COLX.seats.length=0;for(const e of COLX.ent)egxObj(e.x,e.z,undefined,'col:entrada','Arco '+e.num,'entrada del público',4);}
// ---- el acceso del espectador
function colz(){if(!state.colos||typeof state.colos!=='object')state.colos={};return state.colos;}
function colSeat(){const fem=pjFem(),ciu=fxz().ciu;return fem?{m:'el meniano más alto, en las gradas de madera',j:28,who:'Las mujeres, por una ley de Augusto, se sientan arriba del todo, en las gradas de madera, lejos de los hombres; solo las Vestales tienen sitio de honor abajo.'}
  :ciu?{m:'el segundo meniano, entre los ciudadanos con toga',j:14,who:'Augusto ordenó los asientos por clases: los senadores en el podio, junto a la arena; los caballeros en las catorce primeras filas; luego los ciudadanos, que deben llevar toga; arriba, los pobres, los esclavos y las mujeres.'}
  :{m:'la parte alta, con la plebe y los forasteros',j:24,who:'Como no eres ciudadano, te toca arriba, con la plebe, los extranjeros y los esclavos. Los senadores se sientan en el podio y los caballeros en las catorce primeras filas.'};}
function colAct(o){const e=COLX.ent&&COLX.ent.reduce((b,x)=>!b||Math.hypot(x.x-o.x,x.z-o.z)<Math.hypot(b.x-o.x,b.z-o.z)?x:b,null);if(o.act==='col:salir')return colSalir();if(!e)return;
  const S=colSeat(),cu=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][Math.floor(e.t/TAU*12)%12],gr=S.j+1,loc=1+Math.floor((e.t*37)%40);
  vmS('🎟','Arco '+e.num,'entrada del público','<p>Sobre cada arco de la planta baja hay un número grabado: del I al LXXVI. (Los cuatro de los ejes no tienen número: son las entradas de honor y de los gladiadores.) Un empleado mira tu tésera, una ficha de hueso o de barro que te dio tu patrono, y te indica el camino.</p><div class="curio"><span class="label">Tu tésera</span><p><b>ARCVS '+e.num+' · CVNEVS '+cu+' · GRADVS '+gr+' · LOCVS '+loc+'</b></p><p class="sub">Arco '+e.num+', sector '+cu+', grada '+gr+', asiento '+loc+': '+S.m+'.</p></div><p class="sub">'+S.who+' La entrada era gratuita: las téseras las repartían los organizadores de los juegos.</p>',
    [['Entrar y buscar tu asiento',()=>colEntrar(e,S),'quiz'],vmBye]);}
function colEntrar(e,S){const C=ROMA.col,{ai,bi,ST}=COLX,ao=COLX.A-7,bo=COLX.B-7,s=(S.j+0.5)/ST,t=e.t,x=C.x+lerp(ai,ao,s)*Math.cos(t),z=C.z+lerp(bi,bo,s)*Math.sin(t),y=COLX.gy+colTier(S.j);
  const k='s'+S.j+'_'+e.num;if(!COLX.seats.includes(k)){COLX.seats.push(k);egxObj(x+0.2,z+0.2,y,'col:salir','Salir del anfiteatro','por el vomitorio',2.2);}
  COLX.back={x:e.x,z:e.z};closeDialog();
  vmS('🏟','El deambulatorio','dentro del anfiteatro','<p>Pasas bajo el arco '+e.num+' y entras en un pasillo abovedado que da la vuelta entera al edificio, lleno de gente, de vendedores de comida y de cojines de alquiler. Sigues los números pintados en las paredes hasta tu escalera, subes los escalones de travertino y llegas a un pasillo más estrecho que acaba en una boca de luz: el <b>vomitorio</b>.</p><p class="sub">Se llaman vomitoria porque por ellos el anfiteatro «vomitaba» a la gente: con ochenta entradas y decenas de escaleras, cincuenta mil espectadores podían salir en pocos minutos.</p>',
    [['Salir a la cavea',()=>{closeDialog();fzPut(x,z,Math.atan2(-(C.x-x),-(C.z-z)));const st=colz();if(!st.vis){st.vis=1;save();qAdd('so',1,'Ya sabes cómo se llena un anfiteatro.');}
      setTimeout(()=>toast('<span class="label">La cavea</span><br>Cincuenta mil personas. Arriba, los marineros de la flota de Miseno tensan el toldo, el velario. A veces se rocía al público con agua perfumada de azafrán.'),500);},'quiz']]);}
function colSalir(){vmS('🏟','Salir','por el vomitorio','<p>Vuelves al vomitorio, bajas la escalera y sales por el mismo arco por el que entraste.</p>',[['Salir',()=>{closeDialog();const b=COLX.back;if(b)fzPut(b.x,b.z);},'quiz'],vmBye]);}

// ============================================================ MODO FOTO: oculta la interfaz, zoom y foto con pie (lugar, coordenadas y día) para guardar
const PH={on:false,fov:null,cap:true,url:null,blob:null};
function phCSS(){if($('phCSS'))return;const s=document.createElement('style');s.id='phCSS';s.textContent=
 'body.photo #hud,body.photo #atBtn,body.photo #tbtns,body.photo #keys,body.photo #toast,body.photo #atLay{display:none!important}'+
 '#phUI{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center;background:rgba(20,15,10,.72);border:1px solid #d9874a;border-radius:12px;padding:8px 12px;color:#f1e8d8;font:14px Alegreya,Georgia,serif;max-width:94vw}'+
 '#phUI button,#phPrev button{font:inherit;padding:7px 12px;border-radius:8px;border:1px solid #d9874a;background:rgba(217,135,74,.18);color:#f1e8d8;cursor:pointer}#phUI button.main,#phPrev button.main{background:#d9874a;color:#1a120c}#phUI .h{opacity:.8;font-size:12px}'+
 '#phFlash{position:fixed;inset:0;background:#fff;z-index:61;pointer-events:none;animation:phF .35s ease-out forwards}@keyframes phF{from{opacity:.85}to{opacity:0}}'+
 '#phPrev{position:fixed;inset:0;z-index:62;background:rgba(10,8,6,.82);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px}#phPrev img{max-width:92vw;max-height:72vh;border:2px solid #d9874a;border-radius:8px;box-shadow:0 8px 30px #000}#phPrev .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}';document.head.appendChild(s);}
function phToggle(on){on=on===undefined?!PH.on:on;if(on&&ui!=='play')return;phCSS();PH.on=on;document.body.classList.toggle('photo',on);
  if(on){PH.fov=camera.fov;let u=$('phUI');if(!u){u=document.createElement('div');u.id='phUI';document.body.appendChild(u);}
    u.innerHTML='<b>📷 Modo foto</b><button class="main" id="phShot">Hacer foto</button><button id="phCap"></button><button id="phZi">＋</button><button id="phZo">－</button><button id="phX">Salir</button><span class="h">'+(document.body.classList.contains('tm')?'':'Clic o Espacio: foto · rueda o +/−: zoom · P o Esc: salir')+'</span>';
    $('phShot').onclick=e=>{e.stopPropagation();phShot();};$('phCap').onclick=e=>{e.stopPropagation();PH.cap=!PH.cap;phCapLbl();};$('phZi').onclick=e=>{e.stopPropagation();phZoom(-6);};$('phZo').onclick=e=>{e.stopPropagation();phZoom(6);};$('phX').onclick=e=>{e.stopPropagation();phToggle(false);};phCapLbl();}
  else{const u=$('phUI');if(u)u.remove();PH.z=null;}}
function phCapLbl(){const b=$('phCap');if(b)b.textContent='Pie de foto: '+(PH.cap?'sí':'no');}
function phZoom(d){PH.z=clamp((PH.z||camera.fov)+d,15,90);}
function phCaption(){const ro=MODE==='roma',p=player;let dia='';try{const c=calNow();dia='día '+(state.day||1)+' · '+c.mes+' · '+(typeof horaRomana==='function'&&ro?horaRomana(clock.h):'~'+Math.floor(clock.h)+' h');}catch(e){}
  return ['Nóstos · '+(ro?'Roma, 80 d.C.':'Atenas, 386 a.C.')+' · '+(typeof regionName==='function'?regionName():''),'x '+Math.round(p.x)+' · z '+Math.round(p.z)+' · altura '+p.feet.toFixed(1)+' · '+dia];}
function phShot(){try{if(!(typeof gfxRender==='function'&&gfxRender()))renderer.render(scene,camera);const src=renderer.domElement,W=src.width,H=src.height,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(src,0,0);
    if(PH.cap){const L=phCaption(),fs=Math.max(14,Math.round(H/48));x.font='600 '+fs+'px Georgia, serif';const w=Math.max(...L.map(t=>x.measureText(t).width))+fs*1.4,h=fs*1.45*L.length+fs*0.8;
      x.fillStyle='rgba(20,15,10,.7)';x.fillRect(fs*0.6,H-h-fs*0.6,w,h);x.fillStyle='#f3e6cf';L.forEach((t,i)=>{x.font=(i?'':'600 ')+Math.round(fs*(i?0.82:1))+'px Georgia, serif';x.fillText(t,fs*1.3,H-h-fs*0.6+fs*1.25+i*fs*1.45);});}
    const f=document.createElement('div');f.id='phFlash';document.body.appendChild(f);setTimeout(()=>f.remove(),400);try{if(aOK())sfxTap();}catch(e){}
    c.toBlob(b=>{if(!b)return;PH.blob=b;if(PH.url)URL.revokeObjectURL(PH.url);PH.url=URL.createObjectURL(b);phPreview();},'image/png');}
  catch(e){toast('No se ha podido hacer la foto: '+e.message);}}
function phName(){const d=new Date(),z=n=>String(n).padStart(2,'0');return 'nostos_'+(MODE==='roma'?'roma':'atenas')+'_'+d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+'_'+z(d.getHours())+z(d.getMinutes())+z(d.getSeconds())+'.png';}
function phPreview(){let p=$('phPrev');if(p)p.remove();p=document.createElement('div');p.id='phPrev';p.innerHTML='<img alt="Tu foto"><div class="row"><button class="main" id="phSave">Guardar la foto</button><button id="phAgain">Hacer otra</button><button id="phClose">Salir del modo foto</button></div>';document.body.appendChild(p);p.querySelector('img').src=PH.url;
  $('phSave').onclick=async()=>{const name=phName();try{const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;if(dl){await dl.save({filename:name,data:PH.blob});p.remove();toast('<span class="label">Foto guardada</span><br>'+name);return;}}catch(e){if(e&&e.code==='declined'){return;}}
    try{const a=document.createElement('a');a.href=PH.url;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),300);p.remove();toast('<span class="label">Foto guardada</span><br>'+name);}catch(e){toast('No se ha podido guardar: mantén pulsada la imagen para guardarla.');}};
  $('phAgain').onclick=()=>p.remove();$('phClose').onclick=()=>{p.remove();phToggle(false);};}
window.addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;
  if((e.code==='KeyP'||e.code==='F2')&&!e.repeat&&(ui==='play'||PH.on)){if($('phPrev'))return;e.preventDefault();e.stopImmediatePropagation();phToggle();return;}
  if(!PH.on)return;if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();if($('phPrev'))$('phPrev').remove();else phToggle(false);return;}
  if(e.code==='Space'&&!$('phPrev')){e.preventDefault();e.stopImmediatePropagation();phShot();}if(e.code==='Equal'||e.code==='NumpadAdd')phZoom(-5);if(e.code==='Minus'||e.code==='NumpadSubtract')phZoom(5);},true);
window.addEventListener('wheel',e=>{if(PH.on&&!$('phPrev')){phZoom(e.deltaY>0?3:-3);}},{passive:true});
GM_IC.foto='<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.6"/><path d="M8.5 7l1.6-2.5h3.8L15.5 7"/>';

// ============================================================ ILUMINACIÓN REALZADA (opcional, para ordenadores potentes)
// Posprocesado al estilo de los «shaders» de Minecraft: resplandor (bloom) del sol, el cielo y el fuego; color según la hora
// (dorado al alba y al atardecer, azulado de noche) y viñeta. Los efectos se descargan solo al activarla. Se guarda en localStorage.
const GFX={on:false,ready:false,loading:false,comp:null,bloom:null,grade:null};
try{GFX.want=localStorage.getItem('nostos-gfx')==='on';}catch(e){}
function gfxLoad(){if(GFX.ready)return Promise.resolve();if(GFX.loading)return GFX.loading;const base='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/';
  const L=['shaders/CopyShader.js','shaders/LuminosityHighPassShader.js','postprocessing/EffectComposer.js','postprocessing/RenderPass.js','postprocessing/ShaderPass.js','postprocessing/UnrealBloomPass.js'];
  GFX.loading=L.reduce((p,f)=>p.then(()=>new Promise((ok,ko)=>{const s=document.createElement('script');s.src=base+f;s.onload=ok;s.onerror=()=>ko(new Error(f));document.head.appendChild(s);})),Promise.resolve()).then(()=>{gfxBuild();GFX.ready=true;});return GFX.loading;}
function gfxBuild(){const W=innerWidth,H=innerHeight,pr=renderer.getPixelRatio();let rt;const o={format:THREE.RGBAFormat,depthBuffer:true,stencilBuffer:true};   // stencil = profundidad de 24 bits (con 16 había rayas en ventanas y molduras pegadas al muro)
  try{if(renderer.capabilities.isWebGL2&&THREE.WebGLMultisampleRenderTarget){rt=new THREE.WebGLMultisampleRenderTarget(W*pr,H*pr,o);rt.samples=4;}else rt=new THREE.WebGLRenderTarget(W*pr,H*pr,o);}catch(e){rt=new THREE.WebGLRenderTarget(W*pr,H*pr,o);}
  const c=new THREE.EffectComposer(renderer,rt);c.setPixelRatio(renderer.getPixelRatio());c.setSize(W,H);c.addPass(new THREE.RenderPass(scene,camera));
  const b=new THREE.UnrealBloomPass(new THREE.Vector2(W,H),0.32,0.55,0.82);c.addPass(b);
  const g=new THREE.ShaderPass({uniforms:{tDiffuse:{value:null},warm:{value:0},night:{value:0},vig:{value:0.32},sat:{value:1.12}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'uniform sampler2D tDiffuse;uniform float warm,night,vig,sat;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);float l=dot(c.rgb,vec3(0.299,0.587,0.114));c.rgb=mix(vec3(l),c.rgb,sat);'+
     'c.rgb*=mix(vec3(1.0),vec3(1.10,0.98,0.84),warm);c.rgb=mix(c.rgb,c.rgb*vec3(0.78,0.86,1.12),night);vec2 d=vUv-0.5;c.rgb*=1.0-vig*dot(d,d)*1.6;gl_FragColor=c;}'});
  c.addPass(g);GFX.comp=c;GFX.bloom=b;GFX.grade=g;addEventListener('resize',()=>{if(GFX.comp){GFX.comp.setSize(innerWidth,innerHeight);}});}
function gfxTick(){if(!GFX.grade)return;const h=clock.h,u=GFX.grade.uniforms,dawn=Math.max(0,1-Math.abs(h-6.8)/1.6),dusk=Math.max(0,1-Math.abs(h-18.2)/1.8),nt=h<5||h>20?1:h<6?(6-h):h>19?(h-19):0;
  u.warm.value=Math.min(1,dawn+dusk)*0.9;u.night.value=clamp(nt,0,1)*0.8;u.sat.value=1.16-u.night.value*0.28;GFX.bloom.strength=0.28+u.warm.value*0.22+(u.night.value>0.3?0.25:0);}
function gfxRender(){if(typeof PH!=='undefined'&&PH.on&&typeof DOF!=='undefined'&&DOF.on&&DOF.comp){DOF.comp.render();return true;}if(GFX.on&&GFX.comp){gfxTick();GFX.comp.render();return true;}return false;}
function gfxLabel(){return 'Iluminación: '+(GFX.on?'realzada':'normal');}
function gfxSet(on){try{localStorage.setItem('nostos-gfx',on?'on':'off');}catch(e){}if(!on){GFX.on=false;toast('Iluminación normal.');return;}
  toast('Cargando la iluminación realzada…');gfxLoad().then(()=>{GFX.on=true;toast('<span class="label">Iluminación realzada</span><br>Resplandor, color según la hora y viñeta. Si va lenta, desactívala en el menú.');try{gmRender();}catch(e){}}).catch(e=>{GFX.on=false;toast('No se ha podido cargar la iluminación realzada (¿sin conexión?).');});}
if(GFX.want)setTimeout(()=>gfxSet(true),4000);
GM_IC.gfx='<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>';

