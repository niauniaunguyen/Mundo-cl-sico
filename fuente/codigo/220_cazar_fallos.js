// ============================================================ CAZAR FALLOS EN EL ORDENADOR DE QUIEN JUEGA (Esc → Partida → Cazar fallos)
// 1. Registro de fallos mientras se juega: errores internos, atascos, caídas bajo el suelo, personas hundidas o flotando y tirones;
//    F8 avisa a mano de un fallo (foto + nota). Todo se guarda en el navegador y se descarga como un informe para subirlo a la conversación.
// 2. Revisión de destinos: viaja a cada destino del modo, por tandas, y anota FPS, gente hundida, suelo y errores, con una foto pequeña.
// 3. Jugador automático: anda, habla, abre menús y viaja durante unos minutos y anota dónde se atasca o se bloquea la interfaz.
// (4. Las pruebas que solo miran lo que ha cambiado están en herramientas/pruebas/cambios.sh.)
const CZ={log:[],imgs:[],seen:{},fr:0,frT:performance.now(),lowT:0,lastLow:0,stuckT:0,sx:0,sz:0,sinkT:0,audit:null,bot:null};
function czLoad(){try{CZ.log=JSON.parse(localStorage.getItem('nostos-fallos')||'[]');CZ.imgs=JSON.parse(localStorage.getItem('nostos-fallos-img')||'[]');}catch(e){CZ.log=[];CZ.imgs=[];}}
function czSave(){try{localStorage.setItem('nostos-fallos',JSON.stringify(CZ.log.slice(-400)));localStorage.setItem('nostos-fallos-img',JSON.stringify(CZ.imgs.slice(-30)));}catch(e){try{CZ.imgs=CZ.imgs.slice(-8);localStorage.setItem('nostos-fallos-img',JSON.stringify(CZ.imgs));}catch(e2){}}}
czLoad();
function czWhere(){const o={};try{o.x=Math.round(player.x);o.z=Math.round(player.z);o.zona=typeof regionName==='function'?regionName():'';o.ui=ui;o.modo=MODE;o.dia=state&&state.day;o.h=Math.round(clock.h*10)/10;}catch(e){}return o;}
// k: tipo; m: mensaje; key: para no repetir el mismo aviso (se cuenta)
function czAdd(k,m,key,extra){key=key||k+'|'+m;const now=Date.now(),s=CZ.seen[key];if(s&&now-s.t<15000){s.e.n=(s.e.n||1)+1;s.t=now;return s.e;}
  const e=Object.assign({t:new Date().toISOString(),k,m:String(m).slice(0,500)},czWhere(),extra||{});CZ.log.push(e);CZ.seen[key]={t:now,e};czSave();return e;}
// errores internos (sin tapar los avisos de la consola)
addEventListener('error',ev=>{try{czAdd('error',(ev.message||'error')+(ev.filename?' @'+String(ev.filename).split('/').pop()+':'+ev.lineno:''));}catch(e){}});
addEventListener('unhandledrejection',ev=>{try{czAdd('error','promesa: '+(ev.reason&&ev.reason.message||ev.reason));}catch(e){}});
{const f=console.error;console.error=function(){try{czAdd('consola',[...arguments].map(a=>a&&a.message||String(a)).join(' ').slice(0,300));}catch(e){}return f.apply(console,arguments);};}
{const f=console.warn;console.warn=function(){try{const m=[...arguments].map(a=>a&&a.message||String(a)).join(' ');if(/Error|error|undefined|null|NaN/.test(m))czAdd('aviso',m.slice(0,300));}catch(e){}return f.apply(console,arguments);};}
// vigilantes (tiempo real, para que funcionen igual con el juego lento)
function czWatch(){if(typeof ui==='undefined'||ui==='start'||!state)return;const now=performance.now();
  // FPS bajos durante 5 s seguidos
  CZ.fr++;if(now-CZ.frT>1000){const fps=CZ.fr*1000/(now-CZ.frT);CZ.fr=0;CZ.frT=now;CZ.fps=fps;if(fps<15&&ui==='play'){CZ.lowT++;if(CZ.lowT>=5&&now-CZ.lastLow>60000){CZ.lastLow=now;czAdd('fps','FPS bajos: '+fps.toFixed(0),'fps|'+Math.round(player.x/50)+','+Math.round(player.z/50),{fps:+fps.toFixed(1)});}}else CZ.lowT=0;}
  if(ui!=='play')return;const P=player;
  // atasco: se intenta andar y no se avanza en 3 s
  const mv=keys.w||keys.s||keys.a||keys.d;if(mv&&!FLY.on){if(!CZ.stuckT){CZ.stuckT=now;CZ.sx=P.x;CZ.sz=P.z;}else if(now-CZ.stuckT>3000){if(Math.hypot(P.x-CZ.sx,P.z-CZ.sz)<0.4)czAdd('atasco','No se puede avanzar','atasco|'+Math.round(P.x/8)+','+Math.round(P.z/8));CZ.stuckT=0;}}else CZ.stuckT=0;
  // bajo el suelo
  try{if(!FLY.on&&!(typeof BOAT!=='undefined'&&BOAT.on)){const f=floorAt(P.x,P.z);if(isFinite(f)&&P.feet<f-1.2)czAdd('suelo','El jugador está bajo el suelo ('+(f-P.feet).toFixed(1)+' m)','suelo|'+Math.round(P.x/10)+','+Math.round(P.z/10));if(!isFinite(f))czAdd('suelo','Suelo no válido (NaN)','nan|'+Math.round(P.x/10)+','+Math.round(P.z/10));}}catch(e){}
  // gente hundida o flotando cerca (cada 4 s)
  if(now-CZ.sinkT>4000){CZ.sinkT=now;try{czSink(40);}catch(e){}}}
function czSink(R,silent){let n=0;const P=player,L=[];const chk=(g,name)=>{if(!g||!g.visible||!g.parent)return;const u=g.userData||{};if(u.sitting||u.pose||u.kneel||u.boat||u.fly||u.ride)return;
    const p=new THREE.Vector3();g.getWorldPosition(p);if(Math.hypot(p.x-P.x,p.z-P.z)>R)return;let f;try{f=floorAt(p.x,p.z);}catch(e){return;}if(!isFinite(f))return;const d=p.y-f;
    if(d<-0.35||d>0.8){n++;L.push([name,+d.toFixed(2)]);if(!silent)czAdd('gente',(d<0?'Hundido ':'Flotando ')+(name||'alguien')+' ('+d.toFixed(2)+' m)','gente|'+(name||'')+'|'+Math.round(p.x/6)+','+Math.round(p.z/6),{dy:+d.toFixed(2)});}};
  try{for(const o of npcObjs)if(!o.hidden)chk(o.g,o.data&&o.data.name);}catch(e){}try{for(const w of walkers)chk(w.g,w.name||'caminante');}catch(e){}return {n,L:L.slice(0,8)};}
{const f=uxTick;uxTick=function(dt){f(dt);try{czWatch();}catch(e){}};}
// F8: avisar a mano de un fallo, con foto y nota
function czShot(w){return new Promise(res=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>{try{const c=renderer.domElement;w=w||480;const h=Math.round(c.height/c.width*w),t=document.createElement('canvas');t.width=w;t.height=h;t.getContext('2d').drawImage(c,0,0,w,h);res(t.toDataURL('image/jpeg',0.7));}catch(e){res(null);}});});});}
async function czReport(){const img=await czShot(560),prev=ui;const o=eduOverlay('czBox','Avisar de un fallo','<p>Escribe qué ves mal (por ejemplo: «este hombre atraviesa la pared»). Se guarda con una foto y el sitio exacto.</p><textarea id="czTx" rows="4" style="width:100%;font:inherit"></textarea><div id="czO" style="margin-top:8px"></div>'+(img?'<img src="'+img+'" style="max-width:100%;margin-top:8px;border-radius:6px">':''));
  setTimeout(()=>{try{$('czTx').focus();}catch(e){}},50);
  $('czO').appendChild(mgBtn('Guardar el aviso',()=>{const e=czAdd('aviso_manual',$('czTx').value.trim()||'(sin nota)','m|'+Date.now());if(img){CZ.imgs.push({t:e.t,img});e.img=1;}czSave();o.remove();ui='play';toast('Fallo anotado ('+CZ.log.length+' en el registro). Descárgalo en Esc → Partida → Cazar fallos.');}));}
addEventListener('keydown',e=>{if(e.code==='F8'){e.preventDefault();if(typeof ui!=='undefined'&&ui==='play')czReport();}});
// ---------------------------------------------------------------- 2. revisión de destinos, por tandas
function czDests(){const L=[{id:'ciudad',name:MODE==='roma'?'Roma':'Atenas'}];try{for(const I of ISLANDS)L.push({id:I.id,name:I.name||I.id});}catch(e){}return L;}
function czGoDest(id){const P=player;if(id==='ciudad'){const A=PLACES.find(q=>/^(agora|foro|forum)/i.test(q.id))||PLACES[0];P.x=A.x+15;P.z=A.z+15;P.yaw=Math.atan2(P.x-A.x,P.z-A.z);P.pitch=0.05;return true;}
  const I=ISLANDS.find(q=>q.id===id);if(!I)return false;const PT=typeof PORTS!=='undefined'?PORTS:{},a=I.arrive||I.town||PT[I.id+'_n']||PT[I.id]||{x:I.x,z:I.z},t=I.town&&I.town!==a?I.town:{x:I.x,z:I.z};
  P.x=a.x;P.z=a.z;let dx=t.x-a.x,dz=t.z-a.z;if(Math.hypot(dx,dz)<5){dx=I.x-a.x;dz=I.z-a.z;}if(Math.hypot(dx,dz)<5){dx=0;dz=-1;}P.yaw=Math.atan2(-dx,-dz);P.pitch=0.04;try{P.feet=floorAt(P.x,P.z);}catch(e){}return true;}
function czAudLoad(){try{return JSON.parse(localStorage.getItem('nostos-revision-'+MODE)||'{"i":0,"r":[]}');}catch(e){return {i:0,r:[]};}}
function czAudSave(A){try{localStorage.setItem('nostos-revision-'+MODE,JSON.stringify(A));}catch(e){A.r.forEach((r,j)=>{if(j<A.r.length-20)delete r.img;});try{localStorage.setItem('nostos-revision-'+MODE,JSON.stringify(A));}catch(e2){}}}
async function czAudit(n){if(CZ.audit||CZ.bot)return;const D=czDests(),A=czAudLoad();if(A.i>=D.length){A.i=0;A.r=[];}CZ.audit=1;const end=Math.min(D.length,A.i+(n||20)),h0=clock.h;
  try{for(;A.i<end;A.i++){const d=D[A.i];try{closeDialog();}catch(e){}if(!czGoDest(d.id))continue;rndBanner('Revisando destinos: '+(A.i+1)+' de '+D.length+' · '+d.name+'<br>No toques nada.');clock.h=11;
      const e0=CZ.log.filter(e=>e.k==='error'||e.k==='consola').length;
      for(let k=0;k<12;k++){await rndWait(1000);const I=d.id==='ciudad'?null:ISLANDS.find(q=>q.id===d.id);if(!I||I.mesh||I.built)break;}
      await rndWait(3500);try{if(d.id!=='ciudad')czGoDest(d.id);}catch(e){}await rndWait(1000);
      const m=await rndMeasure(2500),sk=czSink(70,true),e1=CZ.log.filter(e=>e.k==='error'||e.k==='consola').length;let fl=NaN;try{fl=floorAt(player.x,player.z);}catch(e){}
      const r={id:d.id,name:d.name,fps:m.fps,fps1pc:m.fps1pc,llamadas:m.llamadas,triK:m.triangulosK,gente:(typeof walkers!=='undefined'?walkers.length:0),hundidos:sk.n,detalle:sk.L,errores:e1-e0,suelo:isFinite(fl)?'ok':'NaN',img:await czShot(260)};
      r.problemas=[r.fps<20?'FPS bajos ('+r.fps+')':'',r.hundidos?r.hundidos+' persona(s) hundida(s) o flotando':'',r.errores?r.errores+' error(es)':'',r.suelo!=='ok'?'suelo no válido':''].filter(Boolean);
      A.r=A.r.filter(q=>q.id!==d.id);A.r.push(r);czAudSave(A);}}
  catch(e){czAdd('error','revisión: '+(e&&e.message||e));}
  CZ.audit=null;clock.h=h0;rndBanner('');czAudSave(A);
  const done=A.i>=D.length,bad=A.r.filter(r=>r.problemas&&r.problemas.length).length;
  czPanel((done?'<p><b>Revisión terminada</b>: ':'<p><b>Tanda terminada</b> ('+A.i+' de '+D.length+' destinos): ')+bad+' destinos con algo raro. '+(done?'':'Si el juego va lento, recarga la página antes de seguir; lo revisado se guarda.')+'</p>');}
// ---------------------------------------------------------------- 3. jugador automático
async function czBot(min,quiet){if(CZ.bot||CZ.audit)return;const B=CZ.bot={quiet:!!quiet,t0:performance.now(),dur:(min||10)*60000,tgt:null,lastMv:performance.now(),px:player.x,pz:player.z,nonPlay:0,acts:{andar:0,hablar:0,menus:0,viajes:0,atascos:0},nextMenu:performance.now()+45000,nextTrip:performance.now()+150000};
  const D=czDests(),stop=()=>{keys.w=keys.run=keys.jump=false;};
  try{while(CZ.bot&&performance.now()-B.t0<B.dur){await rndWait(250);const now=performance.now(),P=player;
      if(!B.quiet)rndBanner('Jugador automático: '+Math.ceil((B.dur-(now-B.t0))/60000)+' min · '+B.acts.hablar+' conversaciones, '+B.acts.atascos+' atascos<br>Pulsa F9 para pararlo.');
      if(ui!=='play'){stop();B.nonPlay+=250;if(ui==='dialog'){const bs=[...document.querySelectorAll('#dOpts button')];if(bs.length&&Math.random()<0.5&&B.nonPlay<6000)bs[Math.floor(Math.random()*bs.length)].click();else try{closeDialog();}catch(e){}}
        else{try{if(typeof GM!=='undefined'&&GM.on)gmClose();}catch(e){}if(B.nonPlay>3000){for(const id of['czBox','rndBox'])try{$(id)&&$(id).remove();}catch(e){}try{document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true}));}catch(e){}}}
        if(B.nonPlay>20000){czAdd('interfaz','La interfaz no vuelve al juego (ui='+ui+')','ui|'+ui);ui='play';B.nonPlay=0;}continue;}
      B.nonPlay=0;
      if(now>B.nextMenu){B.nextMenu=now+45000+Math.random()*30000;B.acts.menus++;try{gmOpen();await rndWait(1200);gmClose();}catch(e){czAdd('error','menú: '+e.message);}continue;}
      if(now>B.nextTrip){B.nextTrip=now+150000+Math.random()*90000;B.acts.viajes++;const d=D[1+Math.floor(Math.random()*(D.length-1))]||D[0];try{czGoDest(d.id);}catch(e){}B.tgt=null;await rndWait(6000);B.px=player.x;B.pz=player.z;B.lastMv=performance.now();continue;}
      if(!B.tgt){let best=null;try{const C=npcObjs.filter(o=>!o.hidden&&Math.hypot(o.x-P.x,o.z-P.z)<90);if(C.length&&Math.random()<0.7)best=C[Math.floor(Math.random()*C.length)];}catch(e){}
        const a=Math.random()*6.283,r=15+Math.random()*50;B.tgt=best?{x:best.x,z:best.z,npc:best}:{x:P.x+Math.sin(a)*r,z:P.z+Math.cos(a)*r};B.tgtT=now;B.acts.andar++;}
      const dx=B.tgt.x-P.x,dz=B.tgt.z-P.z,d=Math.hypot(dx,dz);P.yaw=Math.atan2(-dx,-dz);
      if(d<2.6||now-B.tgtT>40000){stop();if(B.tgt.npc&&d<4){try{if(focus){interact();B.acts.hablar++;}}catch(e){czAdd('error','hablar: '+e.message);}}B.tgt=null;await rndWait(600);continue;}
      keys.w=true;keys.run=d>12;
      if(Math.hypot(P.x-B.px,P.z-B.pz)>0.8){B.px=P.x;B.pz=P.z;B.lastMv=now;}
      else if(now-B.lastMv>5000){B.acts.atascos++;czAdd('atasco','El jugador automático no puede avanzar hacia '+(B.tgt.npc&&B.tgt.npc.data?B.tgt.npc.data.name:'un punto'),'bot|'+Math.round(P.x/8)+','+Math.round(P.z/8));keys.jump=true;await rndWait(300);keys.jump=false;B.tgt=null;B.lastMv=now;}}}
  catch(e){czAdd('error','jugador automático: '+(e&&e.message||e));}
  stop();const acts=B.acts;CZ.bot=null;rndBanner('');if(B.quiet){try{autoEnd(acts);}catch(e){}}else czPanel('<p><b>Jugador automático terminado</b>: '+acts.andar+' paseos, '+acts.hablar+' conversaciones, '+acts.menus+' menús, '+acts.viajes+' viajes, '+acts.atascos+' atascos.</p>');}
addEventListener('keydown',e=>{if(e.code==='F9'&&CZ.bot){CZ.bot=null;window.__spd=1;}});
// ---------------------------------------------------------------- informe y panel
function czHTML(){const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'),A=czAudLoad(),im={};for(const q of CZ.imgs)im[q.t]=q.img;
  const K={error:'Error interno',consola:'Error en la consola',aviso:'Aviso',fps:'FPS bajos',atasco:'Atasco',suelo:'Bajo el suelo',gente:'Gente hundida/flotando',interfaz:'Interfaz bloqueada',aviso_manual:'Aviso tuyo (F8)'};
  let sys={};try{sys=rndSys();}catch(e){}
  return '<!doctype html><meta charset="utf-8"><title>Fallos · Nóstos</title><body style="font-family:Georgia,serif;max-width:1000px;margin:auto;padding:16px;background:#f4ede0;color:#2b231c">'+
  '<h1>Registro de fallos · Nóstos</h1><p>'+new Date().toLocaleString()+' · modo '+esc(MODE)+'. Sube este archivo a la conversación.</p>'+
  '<h2>Avisos durante el juego ('+CZ.log.length+')</h2><table border="1" cellpadding="4" style="border-collapse:collapse;font-size:13px"><tr><th>Cuándo</th><th>Tipo</th><th>Qué</th><th>Veces</th><th>Dónde</th></tr>'+
  CZ.log.slice().reverse().map(e=>'<tr><td>'+esc(e.t.slice(5,19).replace('T',' '))+'</td><td>'+esc(K[e.k]||e.k)+'</td><td>'+esc(e.m)+(im[e.t]?'<br><img src="'+im[e.t]+'" style="max-width:420px">':'')+'</td><td>'+(e.n||1)+'</td><td>'+esc((e.zona||'')+' ('+e.x+', '+e.z+') '+(e.ui||''))+'</td></tr>').join('')+'</table>'+
  '<h2>Revisión de destinos ('+A.r.length+')</h2><table border="1" cellpadding="4" style="border-collapse:collapse;font-size:13px"><tr><th>Destino</th><th>Problemas</th><th>FPS</th><th>1 % peor</th><th>Llamadas</th><th>Foto</th></tr>'+
  A.r.slice().sort((a,b)=>(b.problemas||[]).length-(a.problemas||[]).length).map(r=>'<tr><td>'+esc(r.name)+'<br><small>'+esc(r.id)+'</small></td><td>'+esc((r.problemas||[]).join('; ')||'—')+(r.detalle&&r.detalle.length?'<br><small>'+esc(JSON.stringify(r.detalle))+'</small>':'')+'</td><td>'+r.fps+'</td><td>'+r.fps1pc+'</td><td>'+r.llamadas+'</td><td>'+(r.img?'<img src="'+r.img+'" width="200">':'')+'</td></tr>').join('')+'</table>'+
  '<h2>Datos</h2><pre style="white-space:pre-wrap;font-size:11px">'+esc(JSON.stringify({sys,log:CZ.log,revision:A.r.map(r=>Object.assign({},r,{img:undefined}))},null,1))+'</pre></body>';}
async function czDownload(){const html=czHTML(),fn='fallos_nostos_'+MODE+'.html';try{const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;if(dl){await dl.save({filename:fn,data:html});return;}}catch(e){}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download=fn;document.body.appendChild(a);a.click();a.remove();}
function czPanel(msg){const A=czAudLoad(),D=czDests();const o=eduOverlay('czBox','Cazar fallos',(msg||'')+
  '<p>El juego anota solo los errores internos, los atascos, las caídas bajo el suelo, la gente hundida y los tirones. Mientras juegas, pulsa <b>F8</b> para avisar de un fallo con foto y nota.</p>'+
  '<p>Registro: <b>'+CZ.log.length+'</b> avisos · Destinos revisados: <b>'+A.r.length+'</b> de '+D.length+'.</p><div id="czP" style="display:flex;flex-wrap:wrap;gap:8px"></div>');
  const P=$('czP'),go=(t,fn)=>P.appendChild(mgBtn(t,()=>{o.remove();ui='play';setTimeout(fn,600);}));
  P.appendChild(mgBtn('Descargar el informe',czDownload));
  go(A.i>0&&A.i<D.length?'Seguir revisando destinos (20 más)':'Revisar destinos (20 por tanda)',()=>czAudit(20));
  go('Jugador automático (10 min)',()=>czBot(10));go('Jugador automático (20 min)',()=>czBot(20));
  P.appendChild(mgBtn('Vaciar el registro',()=>{CZ.log=[];CZ.imgs=[];CZ.seen={};czSave();try{localStorage.removeItem('nostos-revision-'+MODE);}catch(e){}czPanel('<p>Registro vacío.</p>');}));}
{const f=gmDo;gmDo=function(k){if(k==='fallos'){try{gmClose&&gmClose();}catch(e){}czPanel();return;}return f.apply(this,arguments);};}
