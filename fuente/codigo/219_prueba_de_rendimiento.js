// ============================================================ PRUEBA DE RENDIMIENTO (Esc → Partida → Prueba de rendimiento)
// Para medir el juego en el ordenador de quien juega (el entorno de pruebas automático no tiene tarjeta gráfica y no sirve para los FPS).
// Recorre varios sitios del modo actual, mide en cada uno los FPS (media y 1 % más lento), el tiempo de dibujo, las llamadas de dibujo,
// los triángulos, la memoria y las funciones del bucle que más tardan (PROFT, 128); prueba qué ajuste ayuda más (sombras, efectos de luz,
// resolución, número de personas detalladas); hace capturas de los personajes de cerca, y al final ofrece descargar un informe en HTML.
// La primera vez recarga la página para que el medidor de funciones (128) quede activo desde el arranque; después empieza sola al jugar.
const RND={on:false,step:'',log:[],shots:[],ab:[],box:null,rT:0,rN:0,rMax:0};
function rndFlag(v){try{if(v===undefined)return localStorage.getItem('nostos-rend');if(v)localStorage.setItem('nostos-rend',v);else localStorage.removeItem('nostos-rend');}catch(e){return null;}}
// tiempo que tarda cada orden de dibujo (lo que la CPU pasa preparando el fotograma para la tarjeta gráfica)
{const f=renderer.render.bind(renderer);renderer.render=function(s,c){if(!RND.on)return f(s,c);const t=performance.now();f(s,c);const d=performance.now()-t;RND.rT+=d;RND.rN++;if(d>RND.rMax)RND.rMax=d;};}
const rndWait=ms=>new Promise(r=>setTimeout(r,ms));
function rndBanner(t){if(!RND.box){RND.box=document.createElement('div');RND.box.style.cssText='position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:9999;background:rgba(30,22,14,.92);color:#f3e6c8;font:15px Georgia,serif;padding:10px 16px;border-radius:8px;border:1px solid #b8955a;max-width:90vw;text-align:center;pointer-events:none';document.body.appendChild(RND.box);}RND.box.innerHTML=t;RND.box.hidden=!t;}
function rndSys(){const o={pantalla:innerWidth+'×'+innerHeight,pixeles:(window.devicePixelRatio||1)+' (juego: '+renderer.getPixelRatio()+')',nucleos:navigator.hardwareConcurrency||'?',memoriaGB:navigator.deviceMemory||'?',navegador:navigator.userAgent,modo:MODE,tactil:typeof isTouch!=='undefined'&&isTouch,ligero:!!(typeof ACC!=='undefined'&&ACC.lite)};
  try{const gl=renderer.getContext(),x=gl.getExtension('WEBGL_debug_renderer_info');o.grafica=x?gl.getParameter(x.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);o.webgl2=!!renderer.capabilities.isWebGL2;}catch(e){}
  try{o.detalle=typeof GQ!=='undefined'?GQ.q:'?';o.efectosLuz=typeof GFX!=='undefined'?!!GFX.on:'?';o.sombras=renderer.shadowMap.enabled&&sun.castShadow;o.personasDetalladas=BP.K;}catch(e){}return o;}
// mide 'ms' milisegundos: fotogramas reales (requestAnimationFrame), dibujo, llamadas, triángulos, memoria, gente y funciones lentas
function rndMeasure(ms){return new Promise(res=>{const F=[];let last=performance.now();const t0=last;RND.rT=0;RND.rN=0;RND.rMax=0;try{profReset();}catch(e){}let calls=0,tris=0,n=0;
  const tick=()=>{const now=performance.now();F.push(now-last);last=now;try{calls+=renderer.info.render.calls;tris+=renderer.info.render.triangles;n++;}catch(e){}
    if(now-t0<ms){requestAnimationFrame(tick);return;}
    const s=(F.length>1?F.slice(1):F).sort((a,b)=>a-b),avg=s.reduce((a,b)=>a+b,0)/Math.max(1,s.length),p99=s[Math.floor(s.length*0.99)]||avg,p50=s[Math.floor(s.length/2)]||avg;
    const r={fps:+(1000/avg).toFixed(1),fpsMediana:+(1000/p50).toFixed(1),fps1pc:+(1000/p99).toFixed(1),msMedio:+avg.toFixed(1),msPeor:+(s[s.length-1]||0).toFixed(0),fotogramas:s.length,
      dibujoMs:+(RND.rT/Math.max(1,RND.rN)).toFixed(1),dibujoMaxMs:+RND.rMax.toFixed(0),llamadas:Math.round(calls/Math.max(1,n)),triangulosK:Math.round(tris/Math.max(1,n)/1000)};
    try{r.geometrias=renderer.info.memory.geometries;r.texturas=renderer.info.memory.textures;r.programas=(renderer.info.programs||[]).length;}catch(e){}
    try{if(performance.memory)r.memoriaMB=Math.round(performance.memory.usedJSHeapSize/1048576);}catch(e){}
    try{let v=0,bp=0;scene.traverse(o=>{if(o.isSkinnedMesh&&o.visible)v++;});r.mallasConEsqueleto=v;r.personasModeloNuevo=BP.list?BP.list.filter(g=>g.visible).length:0;r.caminantes=walkers.length;}catch(e){}
    try{r.funcionesLentas=profReport(8);}catch(e){}
    res(r);};requestAnimationFrame(tick);});}
// captura del lienzo justo después de dibujarse (en el mismo fotograma; sin conservar el búfer)
function rndShot(name,w){return new Promise(res=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>{try{const c=renderer.domElement;w=w||480;const h=Math.round(c.height/c.width*w),t=document.createElement('canvas');t.width=w;t.height=h;t.getContext('2d').drawImage(c,0,0,w,h);RND.shots.push({name,img:t.toDataURL('image/jpeg',0.72)});}catch(e){}res();});});});}
function rndStations(){const P=PLACES||[],pick=[],re=MODE==='roma'?[/^(foro|forum)/i,/colis|anfit|flavi/i,/palat/i,/campo|marte|pante/i,/capit/i,/emporio|tiber|puerto/i]:[/^agora$/i,/^agora/i,/^(acro|parten)/i,/pire/i,/cerami|dipil/i,/pnyx|pnix/i,/academ|liceo/i];
  for(const r of re){const p=P.find(q=>r.test(q.id||'')||r.test(q.name||''));if(p&&!pick.includes(p))pick.push(p);}
  for(const p of P){if(pick.length>=5)break;if(!pick.includes(p)&&Math.abs(p.x)<7000&&Math.abs(p.z)<7000)pick.push(p);}return pick.slice(0,6);}
function rndGo(p,off,yawTo){const Pl=player;Pl.x=p.x+off[0];Pl.z=p.z+off[1];const dx=(yawTo?yawTo.x:p.x)-Pl.x,dz=(yawTo?yawTo.z:p.z)-Pl.z;Pl.yaw=Math.atan2(-dx,-dz);Pl.pitch=0.03;try{Pl.feet=floorAt(Pl.x,Pl.z);}catch(e){}try{closeDialog();}catch(e){}}
async function rndRun(){if(RND.on)return;RND.on=true;RND.log=[];RND.shots=[];RND.ab=[];const sys=rndSys(),h0=clock.h;rndFlag('');
  try{
    rndBanner('Prueba de rendimiento: espera a que carguen los personajes… <b>No toques nada.</b>');
    for(let i=0;i<40&&!(BP.ready&&(!BPH.N||Object.keys(BPH.tpl).length>=3));i++)await rndWait(1500);
    const st=rndStations();
    for(let i=0;i<st.length;i++){const p=st[i];rndBanner('Prueba de rendimiento · sitio '+(i+1)+' de '+st.length+': '+(p.name||p.id)+'<br>No toques nada.');
      clock.h=11;rndGo(p,[18,18]);await rndWait(6000);const r=await rndMeasure(8000);r.sitio=p.name||p.id;RND.log.push(r);await rndShot(r.sitio,420);}
    // ¿qué ajuste ayuda más? En el primer sitio, cada cambio por separado y luego todos juntos
    const p0=st[0];if(p0){rndGo(p0,[18,18]);await rndWait(4000);rndBanner('Prueba de rendimiento · comparando ajustes…<br>No toques nada.');
      const base=await rndMeasure(6000);RND.ab.push(['Como está ahora',base]);
      const pr=renderer.getPixelRatio(),sh=sun.castShadow,gf=typeof GFX!=='undefined'?GFX.on:false,k=BP.K;
      const tests=[['Sin sombras',()=>{sun.castShadow=false;},()=>{sun.castShadow=sh;}],['Sin efectos de luz',()=>{if(typeof GFX!=='undefined')GFX.on=false;},()=>{if(typeof GFX!=='undefined')GFX.on=gf;}],
        ['Resolución más baja (×0,75)',()=>{renderer.setPixelRatio(pr*0.75);},()=>{renderer.setPixelRatio(pr);}],['Menos personas detalladas (20)',()=>{BP.K=Math.min(k,20);},()=>{BP.K=k;}],
        ['Todo lo anterior junto',()=>{sun.castShadow=false;if(typeof GFX!=='undefined')GFX.on=false;renderer.setPixelRatio(pr*0.75);BP.K=Math.min(k,20);},()=>{sun.castShadow=sh;if(typeof GFX!=='undefined')GFX.on=gf;renderer.setPixelRatio(pr);BP.K=k;}]];
      for(const [n,on,off] of tests){try{on();await rndWait(2500);RND.ab.push([n,await rndMeasure(6000)]);}finally{off();}await rndWait(1500);}
      // personajes de cerca (para revisar brazos, barba y ropa en este ordenador)
      rndBanner('Prueba de rendimiento · fotos de los personajes de cerca…');
      const Pl=player,fx=-Math.sin(Pl.yaw),fz=-Math.cos(Pl.yaw),sx=Math.cos(Pl.yaw),sz=-Math.sin(Pl.yaw),made=[];
      const kinds=MODE==='roma'?[['tunicado',{scale:0.85}],['togado',{}],['romana',{}],['legionario',{}]]:[['obrero',{scale:0.85}],['ciudadano',{}],['mujer',{}],['obrero',{}]];
      kinds.forEach(([k,c],j)=>{try{const g=bpMake(k,c);if(!g)return;const o=(j-1.5)*0.85,x=Pl.x+fx*2.6+sx*o,z=Pl.z+fz*2.6+sz*o;g.position.set(x,floorAt(x,z),z);g.rotation.y=Pl.yaw;scene.add(g);made.push(g);}catch(e){}});
      Pl.pitch=0.12;await rndWait(4000);await rndShot('Personajes de cerca (de frente)',900);
      for(const g of made)g.rotation.y=Pl.yaw+Math.PI*0.5;await rndWait(1500);await rndShot('Personajes de cerca (de lado)',900);
      for(const g of made)g.rotation.y=Pl.yaw+Math.PI;await rndWait(1500);await rndShot('Personajes de cerca (de espaldas)',900);
      for(const g of made){scene.remove(g);try{BP_YOUNG&&BP_YOUNG.delete(g);}catch(e){}}}
  }catch(e){RND.log.push({error:String(e&&e.message||e)});}
  clock.h=h0;RND.on=false;rndBanner('');rndReport(sys);}
async function rndReport(sys){const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const cols=['sitio','fps','fps1pc','msPeor','dibujoMs','llamadas','triangulosK','personasModeloNuevo','mallasConEsqueleto','memoriaMB'],cn={sitio:'Sitio',fps:'FPS medios',fps1pc:'FPS en el 1 % peor',msPeor:'Peor fotograma (ms)',dibujoMs:'Dibujo (ms)',llamadas:'Llamadas de dibujo',triangulosK:'Triángulos (miles)',personasModeloNuevo:'Personas modelo nuevo',mallasConEsqueleto:'Mallas animadas',memoriaMB:'Memoria (MB)'};
  const tr=r=>'<tr>'+cols.map(c=>'<td>'+esc(r[c]===undefined?'—':r[c])+'</td>').join('')+'</tr>';
  const html='<!doctype html><meta charset="utf-8"><title>Prueba de rendimiento · Nóstos</title><body style="font-family:Georgia,serif;max-width:980px;margin:auto;padding:16px;background:#f4ede0;color:#2b231c">'+
    '<h1>Prueba de rendimiento · Nóstos</h1><p>'+new Date().toLocaleString()+'. Sube este archivo a la conversación para que se pueda optimizar el juego para este ordenador.</p>'+
    '<h2>Ordenador</h2><ul>'+Object.entries(sys).map(([k,v])=>'<li><b>'+esc(k)+'</b>: '+esc(v)+'</li>').join('')+'</ul>'+
    '<h2>Por sitios</h2><table border="1" cellpadding="4" style="border-collapse:collapse;font-size:14px"><tr>'+cols.map(c=>'<th>'+cn[c]+'</th>').join('')+'</tr>'+RND.log.map(tr).join('')+'</table>'+
    '<h2>¿Qué ajuste ayuda más?</h2><table border="1" cellpadding="4" style="border-collapse:collapse;font-size:14px"><tr><th>Ajuste</th><th>FPS medios</th><th>FPS en el 1 % peor</th><th>Dibujo (ms)</th></tr>'+RND.ab.map(([n,r])=>'<tr><td>'+esc(n)+'</td><td>'+r.fps+'</td><td>'+r.fps1pc+'</td><td>'+r.dibujoMs+'</td></tr>').join('')+'</table>'+
    '<h2>Funciones que más tardan</h2>'+RND.log.map(r=>'<h3>'+esc(r.sitio||'')+'</h3><pre style="white-space:pre-wrap;font-size:12px">'+esc(r.funcionesLentas||r.error||'')+'</pre>').join('')+
    '<h2>Capturas</h2>'+RND.shots.map(s=>'<figure><img src="'+s.img+'" style="max-width:100%"><figcaption>'+esc(s.name)+'</figcaption></figure>').join('')+
    '<h2>Datos</h2><pre id="datos" style="white-space:pre-wrap;font-size:11px">'+esc(JSON.stringify({sys,sitios:RND.log,ajustes:RND.ab},null,1))+'</pre></body>';
  const fn='rendimiento_nostos_'+MODE+'.html';
  const save=async()=>{try{const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;if(dl){await dl.save({filename:fn,data:html});return;}}catch(e){}
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download=fn;document.body.appendChild(a);a.click();a.remove();};
  const avg=RND.log.filter(r=>r.fps).map(r=>r.fps);const m=avg.length?(avg.reduce((a,b)=>a+b,0)/avg.length).toFixed(0):'?';
  const o=eduOverlay('rndBox','Prueba de rendimiento terminada','<p>Media: <b>'+m+' FPS</b> en '+avg.length+' sitios.</p><p>Descarga el informe y súbelo a la conversación: lleva los números de este ordenador y fotos de los personajes de cerca.</p><div id="rndO"></div>');
  try{$('rndO').appendChild(mgBtn('Descargar el informe',save));}catch(e){}
  save();}
function rndStart(){if(!PROFT.on){rndFlag(MODE||'1');toast('La página se recargará para preparar la prueba. Después entra en la partida y la prueba empezará sola.');setTimeout(()=>location.reload(),2200);return;}
  setTimeout(rndRun,1500);}
// si se recargó para la prueba: empieza sola a los 15 s de estar jugando
{let t=0,armed=!!rndFlag();const f=uxTick;uxTick=function(dt){f(dt);if(!armed||RND.on||ui!=='play')return;t+=dt;if(t>0.5&&!RND.warned){RND.warned=1;rndBanner('La prueba de rendimiento empezará en unos segundos. <b>No toques nada</b> hasta que termine (unos 3 minutos).');}
  if(t>12){armed=false;rndRun();}};}
{const f=gmDo;gmDo=function(k){if(k==='rend'){try{gmClose&&gmClose();}catch(e){}rndStart();return;}return f.apply(this,arguments);};}
