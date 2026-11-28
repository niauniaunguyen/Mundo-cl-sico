// ============================================================ JUGABILIDAD (5): música, trofeos, acertijos, compañía, giros y sesión de clase (22/11)
// G5 Música que se toca: ritmo con la lira (Atenas) o la cítara (Roma). En Atenas la música (mousiké) era parte de la educación de
//    los jóvenes con el kitharistés (Platón, Protágoras 326a). Hay un maestro de música en el Ágora / el Foro; también sirve para
//    ensayar el coro del corego.
// G6 Trofeos que se ven: lo que ganas aparece en el diario (pestaña Trofeos) y en tu persona: una corona en la cabeza (hiedra si
//    fuiste corego, laurel en Roma).
// G7 Acertijos de observación: te enseñan un fragmento de algo cercano (dibujado desde el sitio) y tienes que encontrarlo y
//    fotografiarlo con el modo foto (P).
// G8 Compañía de viaje: alguien te acompaña, comenta lo que ves y te orienta si te pierdes (personajes inventados).
// G9 Misiones con giro: a veces, al llegar al destino de un encargo, algo ha cambiado y eliges cómo resolverlo.
// G10 Sesión de clase: 15 o 30 minutos con un objetivo; al final, resumen, una pregunta de repaso y un código para entregar.
// ---- G5: música
function x4Musica(title,done){const ro=MODE==='roma',N=16,beat=0.62,notes=[];let t0=0,hit=0,miss=0,i=0,raf=0;for(let k=0;k<N;k++)notes.push({t:1.6+k*beat*(k%4===3?1.5:1),done:false});
  const d=document.createElement('div');d.id='x4Mu';d.style.cssText='position:fixed;inset:0;z-index:66;display:flex;align-items:center;justify-content:center;background:rgba(8,6,4,.55)';
  d.innerHTML='<div style="width:min(560px,92vw);padding:22px 26px;border-radius:14px;background:rgba(22,16,12,.96);border:1px solid #d9874a;color:#fbe6c8;font-family:var(--f-body);text-align:center">'+
   '<div style="font:400 1.3rem var(--f-display);color:#ffe0b4">'+title+'</div><div style="font-size:.9rem;color:#d9b48c;margin:4px 0 12px">Pulsa <b>Espacio</b> (o toca) cuando cada nota llegue a la línea. '+(ro?'Cítara romana.':'Lira, la de los muchachos atenienses.')+'</div>'+
   '<canvas width="520" height="120" style="width:100%;background:rgba(0,0,0,.35);border-radius:8px"></canvas><div class="sc" style="margin-top:8px">0 / '+N+'</div></div>';
  document.body.appendChild(d);try{releasePointer();}catch(e){}const prev=ui;ui='x4';const cv=d.querySelector('canvas'),x=cv.getContext('2d'),sc=d.querySelector('.sc'),scale=[0,2,4,7,9,12,14,16],base=ro?261.6:293.7;
  const play=k=>{try{if(aOK())rwPluck(base*Math.pow(2,scale[k%scale.length]/12),AUD.ctx.currentTime,0.07,1.2);}catch(e){}};
  const press=()=>{const now=(performance.now()-t0)/1000;let best=null,bd=1;for(const n of notes){if(n.done)continue;const dd=Math.abs(n.t-now);if(dd<bd){bd=dd;best=n;}}
    if(best&&bd<0.16){best.done=true;best.ok=true;hit++;play(notes.indexOf(best));}else{miss++;try{gfNoise(AUD.ctx.currentTime,'lowpass',300,1,0.05,0.005,0.08);}catch(e){}}};
  const kd=e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();e.stopPropagation();press();}if(e.code==='Escape'){e.stopPropagation();end();}};
  addEventListener('keydown',kd,true);cv.addEventListener('pointerdown',press);
  const end=()=>{cancelAnimationFrame(raf);removeEventListener('keydown',kd,true);d.remove();ui=prev==='x4'?'play':prev;if(ui==='play')try{requestPointer();}catch(e){}
    const pct=Math.max(0,Math.round(100*(hit-miss*0.3)/N));try{if(pct>=70)momento('step',title,'¡Muy bien! '+pct+' %');else gfFloat(pct+' %','#e8c07a');}catch(e){}if(done)done(pct);};
  const draw=()=>{const now=(performance.now()-t0)/1000;x.clearRect(0,0,520,120);x.fillStyle='rgba(240,200,140,.25)';x.fillRect(70,10,3,100);
    for(const n of notes){const px=70+(n.t-now)*180;if(px<-20||px>540)continue;if(!n.done&&now-n.t>0.2){n.done=true;miss+=0.5;}
      x.fillStyle=n.ok?'#9fd08a':n.done?'#7a5a4a':'#e8b07a';x.beginPath();x.arc(px,60+Math.sin(notes.indexOf(n))*22,10,0,7);x.fill();}
    sc.textContent=hit+' / '+N;if(now>notes[N-1].t+0.8){end();return;}raf=requestAnimationFrame(draw);};
  t0=performance.now();raf=requestAnimationFrame(draw);}
function x4MusicSpot(){if(X4.mus||typeof egxObj!=='function'||!state)return;X4.mus=1;const ro=MODE==='roma';let x,z;
  try{if(ro){const p=PLACES.find(q=>/basilica|forum|foro/i.test((q.id||'')+(q.name||'')));x=(p?p.x:0)+10;z=(p?p.z:-22)+8;}else{const q=AL(-24,20);x=q[0];z=q[1];}const f=findFree(x,z,1);if(f){x=f[0];z=f[1];}}catch(e){return;}
  const g=makePerson(ro?{chiton:'#e9dfcb',himation:'#7a4a6a',hair:'#3a2a1e'}:{chiton:'#efe6d4',himation:'#6a4a8a',hair:'#5a4636',beard:true});g.position.set(x,floorAt(x,z),z);scene.add(g);
  egxObj(x,z,undefined,()=>{jmDlg('♫',ro?'Citaredo':'Kitharistés',ro?'Maestro de cítara':'Maestro de lira','<p>'+(ro?'«En Roma la música se oye en el teatro y en los banquetes. ¿Pruebas con la cítara?»':'«Aquí aprenden los muchachos a tocar la lira y a cantar a los poetas. ¿Lo intentas?»')+'</p>',
    [['Tocar',()=>x4Musica(ro?'La cítara':'La lira',pct=>{const z=x4z();z.mus=Math.max(z.mus||0,pct);save();if(pct>=70){cyPay(2,'El maestro te da unas monedas');try{qAdd('kl',1,'Has tocado bien.');}catch(e){}}if(pct>=90)x4Trofeo('musico',ro?'Citaredo':'Kitharodós','Una pieza casi perfecta');})],['Ahora no',()=>{}]]);},ro?'Citaredo':'Kitharistés','pulsa E',3);}
// ---- G6: trofeos
function x4TabTro(){const T=x4z().tro,k=Object.keys(T);if(!k.length)return '<p>Aún no tienes trofeos. Se ganan costeando un coro, ganando discursos, en campañas, con la música… y aparecen aquí y en tu persona.</p>';
  return '<div class="tro">'+k.map(id=>'<div><b>'+({corego:'🌿',cliente:'🏛',musico:'♫',logografo:'Λ',declamator:'Q'}[id]||'★')+'</b>'+T[id].t+'<br><small>'+T[id].s+' · día '+T[id].d+'</small></div>').join('')+'</div>';}
X4_TABS.tro={n:'Trofeos',h:x4TabTro};
function x4TroApply(){try{const w=AVATAR.walk,T=x4z().tro;if(!w||w.userData.x4c||!(T.corego||T.cliente||T.declamator||T.logografo))return;
  const ro=MODE==='roma',g=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:ro?0x4a6a2a:0x2f5a26});for(let i=0;i<14;i++){const a=i/14*TAU,l=new THREE.Mesh(new THREE.SphereGeometry(0.035,5,3),m);l.scale.set(1.6,0.5,0.9);l.position.set(Math.cos(a)*0.12,0,Math.sin(a)*0.12);l.rotation.y=-a;g.add(l);}
  g.position.y=1.9;w.add(g);w.userData.x4c=g;}catch(e){}}
// ---- G7: acertijos de observación
function x4AcerCand(){const L=[];try{for(const s of signObjs){const d=Math.hypot(s.x-player.x,s.z-player.z);if(d>25&&d<140&&s.data&&s.data.name)L.push({x:s.x,z:s.z,n:s.data.name,id:s.data.id});}}catch(e){}return L;}
function x4AcerNew(){const z=x4z(),L=x4AcerCand().filter(c=>!(z.acerOk||{})[c.id]);if(!L.length){jmSay('<p>No veo nada cerca que no hayas encontrado ya. Prueba en otro barrio.</p>');return;}
  const c=L[Math.floor(Math.random()*L.length)],cam=new THREE.PerspectiveCamera(32,1,0.5,600),a=Math.random()*TAU,gy=floorAt(c.x,c.z);
  cam.position.set(c.x+Math.sin(a)*14,gy+4,c.z+Math.cos(a)*14);cam.lookAt(c.x,gy+3,c.z);const cv=document.createElement('canvas');cv.width=cv.height=220;
  try{const W=renderer.domElement.width,H=renderer.domElement.height,s=Math.min(W,H);const asp=camera.aspect;cam.aspect=W/H;cam.updateProjectionMatrix();renderer.render(scene,cam);cv.getContext('2d').drawImage(renderer.domElement,(W-s*0.5)/2,(H-s*0.5)/2,s*0.5,s*0.5,0,0,220,220);camera.aspect=asp;}catch(e){}
  z.acer={x:c.x,z:c.z,id:c.id,n:c.n,img:cv.toDataURL('image/jpeg',0.7)};save();x4AcerShow();momento('start','Un acertijo de observación','Encuentra lo que se ve en el fragmento y fotografíalo (P)');}
function x4AcerShow(){const a=x4z().acer;if(!a)return;jmDlg('◎','Acertijo de observación','Cerca de aquí','<p>Encuentra esto y hazle una foto con el modo foto (<b>P</b>), mirándolo de cerca:</p><p style="text-align:center"><img src="'+a.img+'" style="width:200px;height:200px;border-radius:50%;-webkit-mask:radial-gradient(circle,#000 58%,transparent 72%);mask:radial-gradient(circle,#000 58%,transparent 72%)"></p><p class="sub">Pista: está a menos de 140 pasos de donde estabas.</p>',[['De acuerdo',()=>{}],['Pedir otro',()=>{x4z().acer=null;x4AcerNew();}]]);}
{const f=phShot;phShot=function(){const r=f.apply(this,arguments);try{const z=x4z(),a=z.acer;if(a){const d=Math.hypot(a.x-camera.position.x,a.z-camera.position.z),v=new THREE.Vector3();camera.getWorldDirection(v);
    const ang=Math.abs(wrapA(Math.atan2(a.x-camera.position.x,a.z-camera.position.z)-Math.atan2(v.x,v.z)));
    if(d<30&&ang<0.45){(z.acerOk||(z.acerOk={}))[a.id]=1;z.acer=null;z.acerN=(z.acerN||0)+1;save();setTimeout(()=>{momento('done','Acertijo resuelto',a.n);cyPay(3,'Buen ojo');try{qAdd('so',1,'Sabes mirar.');}catch(e){}if(z.acerN>=5)x4Trofeo('ojo','Buen ojo','Cinco acertijos de observación');},400);}}}catch(e){}return r;};}
X4.extra.push(()=>{const a=state&&x4z().acer;return a?{id:'acer',k:'Acertijo',t:'Encuentra y fotografía el fragmento',s:'Pulsa en «Ver» en el diario para volver a verlo.',at:null}:null;});
// ---- G8: compañía de viaje
const X4_COMP={atenas:{n:'Eutíquides',t:'joven discípulo (inventado)',look:{chiton:'#e8dcc4',himation:'#5a6a4a',hair:'#4a3626'}},roma:{n:'Lucila',t:'liberta y guía (inventada)',look:{chiton:'#d8c8a8',himation:'#8a5a4a',female:true,hair:'#3a2a1e'}}};
function x4CompOn(on){const z=x4z();z.comp=!!on;save();if(!on&&X4.cg){scene.remove(X4.cg);X4.cg=null;}}
function x4CompSay(txt){let b=$('x4Say');if(!b){b=document.createElement('div');b.id='x4Say';b.style.cssText='position:fixed;left:50%;bottom:calc(110px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);max-width:min(560px,88vw);z-index:22;padding:8px 14px;border-radius:10px;background:rgba(22,16,12,.82);border-left:3px solid #c9773f;color:#fbe6c8;font:15px/1.4 var(--f-body);transition:opacity .5s;pointer-events:none';document.body.appendChild(b);}
  const C=X4_COMP[MODE==='roma'?'roma':'atenas'];b.innerHTML='<b style="color:#e8b07a">'+C.n+':</b> '+txt;b.style.opacity=1;clearTimeout(X4.sayT);X4.sayT=setTimeout(()=>{b.style.opacity=0;},7000);}
function x4CompTick(dt){const z=state&&x4z();if(!z||!z.comp||ui==='vuelo'){if(X4.cg)X4.cg.visible=false;return;}const C=X4_COMP[MODE==='roma'?'roma':'atenas'];
  if(!X4.cg){X4.cg=makePerson(Object.assign({noVary:true},C.look));X4.cg.position.set(player.x+1.5,player.feet,player.z+1.5);scene.add(X4.cg);X4.cph=0;}
  const g=X4.cg;g.visible=!BOAT.on&&!FLY.on;const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),tx=player.x-fx*2.2+fz*1.3,tz=player.z-fz*2.2-fx*1.3,dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);
  if(d>30){g.position.set(tx,floorAt(tx,tz),tz);}else if(d>0.6){const sp=Math.min(d,(d>4?7:3.6)*dt);g.position.x+=dx/d*sp;g.position.z+=dz/d*sp;X4.cph+=sp*4.6;g.rotation.y+=wrapA(Math.atan2(dx,dz)-g.rotation.y)*Math.min(1,dt*6);try{personWalk(g,X4.cph,1);}catch(e){}}
  else{try{personWalk(g,0,0);}catch(e){}g.rotation.y+=wrapA(player.yaw+Math.PI-g.rotation.y)*Math.min(1,dt*2);}
  g.position.y=floorAt(g.position.x,g.position.z);
  X4.ct=(X4.ct||0)+dt;if(X4.ct<2)return;X4.ct=0;
  try{for(const s of signObjs){const dd=Math.hypot(s.x-player.x,s.z-player.z);if(dd>16)continue;const k='c:'+s.data.id;if((z.cs||(z.cs={}))[k])continue;z.cs[k]=1;save();
      const tx2=(s.data.text||s.data.desc||'').replace(/<[^>]+>/g,'').split(/(?<=[.!?])\s/)[0];x4CompSay('Mira: '+s.data.name+'. '+(tx2&&tx2.length<220?tx2:''));return;}}catch(e){}
  try{if(typeof MTR!=='undefined'&&MTR.lost>70&&!X4.saidLost){X4.saidLost=1;setTimeout(()=>{X4.saidLost=0;},90000);const t=guideTarget();if(t){const b=Math.atan2(t.x-player.x,-(t.z-player.z))*180/Math.PI,dirs=['norte','noreste','este','sureste','sur','suroeste','oeste','noroeste'];
      x4CompSay('Creo que nos hemos despistado. Lo que buscamos queda hacia el '+dirs[Math.round(((b%360)+360)%360/45)%8]+', a unos '+moDist(Math.hypot(t.x-player.x,t.z-player.z))+'.');}}}catch(e){}}
X4_TABS.comp={n:'Compañía',h:()=>{const C=X4_COMP[MODE==='roma'?'roma':'atenas'],on=x4z().comp;return '<p><b>'+C.n+'</b>, '+C.t+', puede acompañarte: comenta los lugares que veis y te orienta si os perdéis.</p><button class="bt" id="x4CompB">'+(on?'Viajar solo':'Viajar con '+C.n)+'</button>';},
  bind:d=>{const b=d.querySelector('#x4CompB');if(b)b.onclick=()=>{x4CompOn(!x4z().comp);x4Diario('comp');};}};
X4_TABS.acer={n:'Acertijos',h:()=>{const z=x4z();return '<p>Te enseño un fragmento de algo que hay cerca y tienes que encontrarlo y fotografiarlo. Resueltos: '+(z.acerN||0)+'.</p>'+(z.acer?'<button class="bt" id="x4AcV">Ver el acertijo actual</button> ':'')+'<button class="bt" id="x4AcN">'+(z.acer?'Pedir otro':'Pedir un acertijo')+'</button>';},
  bind:d=>{const v=d.querySelector('#x4AcV'),n=d.querySelector('#x4AcN');if(v)v.onclick=()=>{x4Close();setTimeout(x4AcerShow,100);};if(n)n.onclick=()=>{x4Close();x4z().acer=null;setTimeout(x4AcerNew,200);};}};
// ---- G9: giros en los encargos del día
{const f=jmDone;jmDone=function(k,inc){try{if(k==='ir'){const z=jmz(),e=z.enc&&z.enc.list.find(q=>q.k==='ir'&&!q.done);if(e&&!e.tw&&Math.random()<0.45){e.tw=1;save();x4Giro(e,()=>f.call(this,k,inc));return;}}}catch(er){}return f.apply(this,arguments);};}
function x4Giro(e,finish){const ro=MODE==='roma',G=[['La persona que esperaba el recado se ha ido al mercado.','Ir a buscarla'],['Hay un malentendido: dicen que el encargo era para otro sitio.','Ir al otro sitio'],['El portero no te deja pasar sin una contraseña.','Buscar a quien la sabe']][Math.floor(Math.random()*3)];
  jmDlg('↻','Algo ha cambiado','Encargo · '+e.txt,'<p>'+G[0]+' ¿Cómo lo resuelves?</p>',[
   ['Hablando: convencer con lo que sabes',()=>jmQuiz('Convencer','<p>Te hacen una pregunta para ver si eres de fiar.</p>',()=>{momento('step','Resuelto hablando',e.txt);finish();},()=>{jmSay('<p>No les convences. Te queda buscar o pagar.</p>');e.tw=0;})],
   [G[1]+' (buscando)',()=>{let p=[player.x+(Math.random()-0.5)*90,player.z+(Math.random()-0.5)*90];try{const q=findFree(p[0],p[1],1);if(q)p=q;}catch(er){}e.x=p[0];e.z=p[1];e.tw=2;save();momento('start','Nuevo destino del encargo',e.txt);}],
   ['Pagando una propina ('+x4Coin(2)+')',()=>{if((state.obols||0)<2){jmSay('<p>No llevas bastante dinero.</p>');e.tw=0;return;}state.obols-=2;updateStats();finish();}]]);}
// ---- G10: sesión de clase
function x4SesStart(min,obj){const z=x4z();z.ses={t0:Date.now(),min,obj,L:(state.lessons||[]).length,P:(state.places||[]).length,M:(state.myths||[]).length,ok:false};save();
  momento('start','Sesión de clase · '+min+' minutos',{lec:'Objetivo: aprender 2 lecciones',lug:'Objetivo: copiar 3 inscripciones',lib:'Objetivo: explorar y aprender lo que quieras'}[obj]);}
function x4SesTick(){const z=state&&x4z(),S=z&&z.ses;if(!S||S.fin)return;const left=S.min*60-(Date.now()-S.t0)/1000;let c=$('x4Ses');
  if(!c){c=document.createElement('div');c.id='x4Ses';c.style.cssText='position:fixed;right:max(16px,env(safe-area-inset-right,0px));top:calc(64px + env(safe-area-inset-top,0px));z-index:21;padding:4px 10px;border-radius:999px;background:rgba(22,16,12,.8);border:1px solid #d9874a;color:#fbe6c8;font:600 13px var(--f-body)';document.body.appendChild(c);}
  const dL=(state.lessons||[]).length-S.L,dP=(state.places||[]).length-S.P,goal=S.obj==='lec'?dL>=2:S.obj==='lug'?dP>=3:true;
  c.textContent='Sesión · '+Math.max(0,Math.floor(left/60))+':'+String(Math.max(0,Math.floor(left%60))).padStart(2,'0')+(S.obj==='lec'?' · lecciones '+dL+'/2':S.obj==='lug'?' · inscripciones '+dP+'/3':'');
  if(S.obj!=='lib'&&goal&&!S.ok){S.ok=true;save();try{momento('step','Objetivo de la sesión cumplido','Sigue hasta que acabe el tiempo');}catch(e){}}
  if(left<=0){S.fin=true;save();c.remove();x4SesEnd(S,dL,dP,goal);}}
function x4SesEnd(S,dL,dP,goal){const dM=(state.myths||[]).length-S.M,nm=(typeof pjz==='function'&&pjz().name)||'',ro=MODE==='roma';
  jmQuiz('Sesión terminada: una pregunta de repaso','<p><b>Resumen</b>: '+S.min+' minutos · lecciones nuevas: '+dL+' · inscripciones: '+dP+' · mitos: '+dM+'. '+(goal?'Objetivo cumplido.':'Objetivo no cumplido.')+'</p>',q=>x4SesCode(S,dL,dP,goal,1),q=>x4SesCode(S,dL,dP,goal,0));}
function x4SesCode(S,dL,dP,goal,ok){const nm=(typeof pjz==='function'&&pjz().name)||'',code=btoa(unescape(encodeURIComponent([nm,MODE[0],S.min,S.obj,dL,dP,goal?1:0,ok,state.day||1].join('|')))).replace(/=+$/,'');
  try{if(goal)momento('done','Sesión de clase','Objetivo cumplido');}catch(e){}
  jmSay('<p>'+(ok?'¡Respuesta correcta!':'Respuesta incorrecta: repasa esa lección en el diario.')+'</p><p>Código para entregar al docente:</p><p style="font:600 1.1rem monospace;word-break:break-all;background:rgba(0,0,0,.3);padding:8px;border-radius:6px">'+code+'</p>');}
{const f=gmDo;gmDo=function(k){if(k==='sesion'){try{gmClose&&gmClose();}catch(e){}setTimeout(()=>jmDlg('⌛','Sesión de clase','Elige duración y objetivo','<p>Una sesión corta con un objetivo. Al final verás un resumen, una pregunta de repaso y un código para el docente.</p>',[
    ['15 min · aprender 2 lecciones',()=>x4SesStart(15,'lec')],['30 min · aprender 2 lecciones',()=>x4SesStart(30,'lec')],['15 min · copiar 3 inscripciones',()=>x4SesStart(15,'lug')],['30 min · explorar libremente',()=>x4SesStart(30,'lib')]]),300);return;}return f.apply(this,arguments);};}
// ---- ticks
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(state&&ui!=='start'){x4CompTick(dt);X4.t5=(X4.t5||0)+dt;if(X4.t5>1){X4.t5=0;x4SesTick();x4MusicSpot();x4TroApply();}}}catch(e){}return r;};}
