// ============================================================ DIEZ MEJORAS DE JUEGO
// 1 rastro de tus viajes en el plano y % explorado · 2 cartas entre ciudades (los personajes se acuerdan) · 3 retos de clase e informe para el docente
// 4 calendario cívico: Asamblea en la Pnyx / Senado en calendas e idus · 5 comercio con riesgo de piratas y tormentas · 6 te tratan según vistes
// 7 sonido amortiguado dentro de los edificios · 8 móvil: vibración y botones grandes · 9 ficha de la foto con lugar y fuente · 10 modo ligero automático
function dzz(){if(!state.dz||typeof state.dz!=='object')state.dz={tr:{},carta:null,cartas:0,ev:{}};const z=state.dz;z.tr=z.tr||{};z.ev=z.ev||{};return z;}
const DZ={last:null,t:0,fps:[],liteAsk:false,crowd:null,crowdKey:null};
// ---------------------------------------------------------------- 1. rastro en el plano
function dzTrail(dt){const z=dzz(),k=regionOf(player.x);const L=z.tr[k]||(z.tr[k]=[]);const p=L[L.length-1];
  if(!p||Math.hypot(player.x-p[0],player.z-p[1])>9){L.push([Math.round(player.x),Math.round(player.z)]);if(L.length>3000)L.splice(0,L.length-3000);}}
function dzExplored(k){let n=0,d=0;for(const s of signObjs){if(regionOf(s.x)!==k)continue;n++;if(state.places.includes(s.data.id))d++;}
  let e=0,ed=0;for(const s of EPI.spheres){if(regionOf(s.x)!==k)continue;e++;if(epiDone(s.data))ed++;}return{n,d,e,ed,pct:n+e?Math.round(100*(d+ed)/(n+e)):0};}
{const f=drawMap;drawMap=function(){f();if(MED&&MED.on)return;try{const c=$('mapc'),W=c.width,H=c.height,x=c.getContext('2d'),k=regionOf(player.x),L=dzz().tr[k]||[];
  x.save();x.strokeStyle='rgba(168,57,43,.55)';x.lineWidth=2;x.setLineDash([4,4]);x.beginPath();let pen=false,prev=null;
  for(const p of L){const q=mapV(p[0],p[1],W,H);if(prev&&Math.hypot(p[0]-prev[0],p[1]-prev[1])>60)pen=false;if(pen)x.lineTo(q[0],q[1]);else{x.moveTo(q[0],q[1]);pen=true;}prev=p;}x.stroke();x.restore();
  const C=dzz().carta;if(C){const o=npcObjs.find(n=>n.data.id===C.to);if(o&&regionOf(o.x)===k){const q=mapV(o.x,o.z,W,H);x.fillStyle='#efe6d4';x.strokeStyle='#5a3a22';x.lineWidth=1.5;x.fillRect(q[0]-7,q[1]-14,14,10);x.strokeRect(q[0]-7,q[1]-14,14,10);x.beginPath();x.moveTo(q[0]-7,q[1]-14);x.lineTo(q[0],q[1]-8);x.lineTo(q[0]+7,q[1]-14);x.stroke();}}
  const E=dzExplored(k);x.fillStyle='rgba(22,16,12,.8)';x.fillRect(W-238,10,228,40);x.fillStyle='#f1e8d8';x.textAlign='left';x.font='13px Alegreya, Georgia';
  x.fillText('Explorado: '+E.pct+' %',W-226,27);x.font='11px Alegreya, Georgia';x.fillText(E.d+'/'+E.n+' lugares · '+E.ed+'/'+E.e+' sueños · rojo: tu camino',W-226,42);}catch(e){}};}
// ---------------------------------------------------------------- 2. cartas entre ciudades
function dzNpcO(id){return npcObjs.find(n=>n.data&&n.data.id===id);}
function dzRegName(k){if(k==='atenas')return MODE==='roma'?'Roma':'Atenas';const I=ISLANDS.find(i=>i.id===k);return I?I.name:k;}
function dzPickTo(from){const k0=regionOf(from.x),C=npcObjs.filter(o=>!o.hidden&&o.data&&o.data.topics&&o.data.id!==from.data.id&&regionOf(o.x)!==k0);if(!C.length)return null;
  const met=C.filter(o=>state.seen[o.data.id]);const L=met.length?met:C;return L[Math.floor(Math.random()*L.length)];}
{const f=renderOpts;renderOpts=function(extra){f(extra);try{const n=dlg&&dlg.n;if(!n||!n.topics)return;const z=dzz(),o=$('dOpts'),me=dzNpcO(n.id);if(!me)return;
  const add=(t,fn)=>{const b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">✉</span><span>'+t+'</span>';b.onclick=fn;o.insertBefore(b,o.lastChild);};
  if(z.carta&&z.carta.to===n.id){add('Entregar la carta de '+z.carta.fromN,()=>{const C=z.carta;z.carta=null;z.cartas=(z.cartas||0)+1;state.obols+=4;qAdd('kl',1,'Llevaste una carta');save();updateStats();try{sfxCoin();}catch(e){}
      $('dBody').innerHTML='<p>«¿Una carta de '+C.fromN+'? ¡Desde '+C.fromR+'!». Rompe el sello de cera, la lee en silencio y sonríe. «Dile, si vuelves a verle, que todo va bien por aquí. Toma, por el camino».</p><p class="sub">No había correo público: las cartas viajaban con amigos, esclavos o cualquiera que fuera en esa dirección. +4 '+(MODE==='roma'?'sestercios':'óbolos')+', +1 Kléos · cartas entregadas: '+z.cartas+'</p>';renderOpts();});}
  else if(!z.carta&&state.seen[n.id]&&(state.day||1)!==z.cartaDia){const to=dzPickTo(me);if(to)add('¿Llevas algo a '+dzRegName(regionOf(to.x))+'?',()=>{z.carta={to:to.data.id,toN:to.data.name,from:n.id,fromN:n.name,fromR:dzRegName(regionOf(me.x))};z.cartaDia=state.day||1;save();
      $('dBody').innerHTML='<p>«Ya que vas hacia allí: ¿podrías llevarle esta carta a <b>'+to.data.name+'</b>, en '+dzRegName(regionOf(to.x))+'? Es una tablilla de cera, atada y sellada. No hay correo: dependemos de los viajeros como tú».</p><p class="sub">La verás en el plano con un sobre. Fuentes: las cartas de Cicerón y las tablillas de Vindolanda viajaban así, con quien fuera de camino.</p>';renderOpts();});}}catch(e){}};}
// ---------------------------------------------------------------- 3. retos de clase e informe
function dzReport(){const ro=MODE==='roma',L=[],s=state;L.push('NÓSTOS · informe de progreso');L.push((ro?'Roma, 80 d.C.':'Atenas, 386 a.C.')+' · '+((s.pj&&s.pj.name)||'')+' · día '+(s.day||1)+' de juego · '+new Date().toLocaleString());L.push('');
  L.push('Lecciones aprendidas ('+(s.lessons||[]).length+'):');for(const id of s.lessons||[]){const n=(typeof NPCS!=='undefined'?NPCS:[]).find(q=>q.id===id);L.push(' - '+(n?n.name+': '+(n.title||''):id));}
  L.push('');L.push('Lugares descubiertos: '+(s.places||[]).length);const k='atenas',E=dzExplored(k);L.push('Ciudad explorada: '+E.pct+' %');
  L.push('Sueños vividos: '+Object.keys(s.seen||{}).filter(q=>q.startsWith('ep:')).length);
  try{const z=amz();const T=amList().filter(t=>z.seen[t.id]).map(t=>t.t);L.push('Lecciones de '+amName()+': '+(T.join(', ')||'ninguna'));}catch(e){}
  try{L.push('Cualidades: '+QUAL.map(q=>qName(q)+' '+qLv(q.k)).join(' · '));}catch(e){}
  try{const R=s.lrn&&s.lrn.route;if(R)L.push('Reto en curso: '+(R.name||R.id||'')+' · paso '+(R.i||0));}catch(e){}
  try{const rv=s.lrn&&s.lrn.rev;if(rv)L.push('Preguntas por repasar: '+Object.keys(rv).length);}catch(e){}
  L.push('Cartas entregadas: '+(dzz().cartas||0));return L.join('\n');}
function dzDownload(){const t=dzReport(),b=new Blob([t],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='nostos_informe_dia'+(state.day||1)+'.txt';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
  try{navigator.clipboard&&navigator.clipboard.writeText(t);}catch(e){}toast('Informe descargado (y copiado al portapapeles).');}
{const f=lrnSummary;lrnSummary=function(){f.apply(this,arguments);try{const B=$('lrnBox');if(!B||B.querySelector('.dzRep'))return;const b=document.createElement('button');b.className='dzRep';b.textContent='Descargar informe para el docente';b.style.cssText='margin:10px 0 0;padding:8px 14px;border-radius:8px;border:1px solid #c98a4a;background:#2a1e14;color:#f3e6cf;font:inherit;cursor:pointer';b.onclick=dzDownload;(B.querySelector('.lrnIn')||B).appendChild(b);}catch(e){}};}
// el docente comparte un enlace con ?reto=tema y la ruta guiada arranca sola al empezar
function dzRetoTick(){if(DZ.retoDone||ui!=='play')return;DZ.retoDone=true;try{const r=new URLSearchParams(location.search).get('reto');if(!r)return;const T=lrnThemes().find(t=>t.id===r||t.name&&t.name.toLowerCase().startsWith(r.toLowerCase()));if(T){lrnRouteStart(T.id);toast('<span class="label">Reto de clase</span><br>'+(T.name||T.id));}}catch(e){}}
// ---------------------------------------------------------------- 4. calendario cívico
// Atenas: la Asamblea se reúne cuatro veces por pritanía (unas 40 al año: Aristóteles, Const. de los atenienses 43.3), al amanecer. Roma: Augusto fijó el Senado en calendas e idus (Suetonio, Augusto 35.3).
function dzCivic(){const d=state.day||1,dm=(d-1)%SEASON_DAYS,ro=MODE==='roma';if(ro)return(dm===0||dm===Math.floor(SEASON_DAYS/2))?{k:'senado',h0:7,h1:13}:null;return d%9===3?{k:'asamblea',h0:6,h1:12}:null;}
function dzCivicTick(){const C=dzCivic(),on=C&&clock.h>=C.h0&&clock.h<C.h1,key=on?C.k+':'+state.day:null;if(key===DZ.crowdKey)return;
  if(DZ.crowd){scene.remove(DZ.crowd);DZ.crowd=null;}DZ.crowdKey=key;if(!on)return;const ro=MODE==='roma';let cx,cz,fx,fz,n;
  if(ro){const p=PLACES.find(q=>q.id==='ro_curia');if(!p)return;cx=p.x;cz=p.z+16;fx=p.x;fz=p.z;n=16;}else{if(typeof PNYX==='undefined')return;cx=PNYX.x;cz=PNYX.z;fx=PNYX.x;fz=PNYX.z-(PNYX.rz||20)*0.6;n=36;}
  const g=new THREE.Group();scene.add(g);DZ.crowd=g;for(let i=0;i<n;i++){const a=R()*TAU,r=4+R()*(ro?7:16),x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;if(!isFree(x,z,0.4))continue;
    const p=makePerson(ro?{chiton:'#efe6d4',himation:'#efe6d4',toga:true,praetexta:true,clavus:'lati',hair:pick(['#9a9590','#3a2a1e','#d8d0c2'])}:{chiton:pick(['#d8ccb4','#b8a888','#c9b48b']),himation:pick(['#6a4a30','#5a6a7a','#7a5a3a']),hair:'#3a2a1e',beard:R()<0.8});
    p.position.set(x,floorAt(x,z),z);p.rotation.y=Math.atan2(fx-x,fz-z);g.add(p);}
  if(clock.h<C.h0+2)toast(ro?'<span class="label">Calendas o idus</span><br>Hoy se reúne el Senado en la Curia.':'<span class="label">Día de Asamblea</span><br>Al amanecer, los ciudadanos suben a la Pnyx. Los arqueros escitas barren el Ágora con una cuerda teñida de rojo para que nadie se quede atrás (Aristófanes, Acarnienses 22).');}
// ---------------------------------------------------------------- 5. comercio: el riesgo del mar
// Al zarpar con carga en tu barco hay un pequeño riesgo: piratas o tormenta, que obligaba a echar carga por la borda (la «echazón» de la ley rodia, Digesto XIV 2).
function dzSeaRisk(){try{const c=m386z().carga;const n=Object.values(c).reduce((a,b)=>a+(+b||0),0);if(n<2||Math.random()>0.12)return;
  const k=Object.keys(c).find(q=>c[q]>0);if(!k)return;const lose=Math.max(1,Math.floor(c[k]/3));c[k]-=lose;save();
  const pir=Math.random()<0.5;setTimeout(()=>toast('<span class="label">'+(pir?'Piratas a la vista':'Temporal')+'</span><br>'+(pir?'Huis a fuerza de remos, pero se pierde parte de la carga':'Hay que echar carga por la borda para no hundirse')+': −'+lose+' '+(lose===1?COM[k].n:COM[k].pl)+'.'),2500);}catch(e){}}
{const f=sail;sail=function(){dzSeaRisk();return f.apply(this,arguments);};}
// ---------------------------------------------------------------- 6. te tratan según vistes (Roma: la ley lo marca; Atenas: no hay leyes de ropa, pero se nota la riqueza)
function dzDress(){try{const w=vestz().wear||{},ro=MODE==='roma',v=Object.values(w).join(' ');if(ro){if(/anillo|anulus|oro/i.test(v)&&/clavus|angust/i.test(v))return'Te mira el anillo de oro y baja un poco la voz: «Salve, caballero».';if(/toga/i.test(v))return'Ve tu toga y te trata de ciudadano.';if(/túnica|tunica/i.test(v)||!v)return'Sin toga, te trata con la confianza de cualquier vecino.';}
  else{if(/púrpura|purpura|oro|joya/i.test(v))return'Mira tu ropa fina y se muestra muy cortés: aquí hay dinero.';if(/exomis|corta/i.test(v))return'Por tu ropa de trabajo te habla de tú a tú, como a un artesano.';}}catch(e){}return'';}
{const f=openDialog;openDialog=function(n){f(n);try{const t=dzDress();if(t&&n&&n.topics&&!dzz().ev['dr:'+n.id+':'+(state.day||1)]){dzz().ev['dr:'+n.id+':'+(state.day||1)]=1;$('dBody').insertAdjacentHTML('beforeend','<p class="sub">'+t+'</p>');}}catch(e){}};}
// ---------------------------------------------------------------- 7. sonido amortiguado bajo techo
function dzUnderRoof(){const X=player.x,Z=player.z;for(const f of footprints){if(!f.w||Math.abs(f.x-X)>60||Math.abs(f.z-Z)>60)continue;const a=f.a||0,c=Math.cos(a),s2=Math.sin(a),dx=X-f.x,dz=Z-f.z,lx=dx*c-dz*s2,lz=dx*s2+dz*c;
  if(Math.abs(lx)<f.w/2-0.8&&Math.abs(lz)<f.d/2-0.8&&(f.house||/Templo|Basílica|Curia|Stoa|Pórtico|Partenón|Termas|Odeón|Casa|casa/.test(f.name||'')))return true;}return false;}
function dzMuffle(){try{if(!AUD||!AUD.master||!AUD.ctx)return;const inside=dzUnderRoof()||(typeof hdIn==='function'&&hdIn())||(typeof cavIn==='function'&&cavIn());
  if(!AUD.dzF){const f=AUD.ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=20000;const m=AUD.master,dst=m.context.destination;try{m.disconnect(dst);}catch(e){return;}m.connect(f);f.connect(dst);AUD.dzF=f;}
  AUD.dzF.frequency.setTargetAtTime(inside?1600:20000,AUD.ctx.currentTime,0.4);}catch(e){}}
// ---------------------------------------------------------------- 8. móvil: vibración breve al interactuar y opción de botones grandes
function dzBuzz(ms){try{if(ACC.haptic!==false&&navigator.vibrate)navigator.vibrate(ms||12);}catch(e){}}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#dOpts button,#tAct,#tUse,.ibtns button'))dzBuzz(10);},true);
{const st=document.createElement('style');st.textContent='body.bigbtn #touch .tb,body.bigbtn #touch button{transform:scale(1.25);transform-origin:center}body.bigbtn #dOpts button{min-height:52px;font-size:1.08em}';document.head.appendChild(st);}
function dzBig(){document.body.classList.toggle('bigbtn',!!ACC.bigBtn);}
{const f=accMenu;accMenu=function(){f.apply(this,arguments);try{const o=$('accBox');if(!o||o.querySelector('.dzAcc'))return;const d=document.createElement('div');d.className='dzAcc';
  const it=(k,n,on)=>'<label style="display:flex;gap:10px;align-items:center;padding:8px;border:1px solid #6a4a30;border-radius:8px;margin:6px 0;cursor:pointer"><input type="checkbox" data-dz="'+k+'" '+(on?'checked':'')+'> '+n+'</label>';
  d.innerHTML=it('bigBtn','Botones grandes en pantalla táctil',!!ACC.bigBtn)+it('haptic','Vibración breve al tocar botones (móvil)',ACC.haptic!==false);(o.querySelector('div')||o).appendChild(d);
  d.querySelectorAll('input[data-dz]').forEach(i=>i.onchange=()=>{ACC[i.dataset.dz]=i.checked;accSave();dzBig();if(i.dataset.dz==='haptic'&&i.checked)dzBuzz(30);});}catch(e){}};}
// ---------------------------------------------------------------- 9. ficha de la foto: el lugar más cercano y su fuente
function dzNearPlace(){let b=null,bd=80;for(const p of PLACES){const d=Math.hypot(p.x-player.x,p.z-player.z);if(d<bd){bd=d;b=p;}}return b;}
{const f=phCaption;phCaption=function(){const L=f();try{const p=dzNearPlace();if(p){let t=p.name+(p.gr?' · '+p.gr:'');L.splice(1,0,t);const src=(p.src||p.fuente||'');if(src)L.push('Fuente: '+String(src).replace(/<[^>]+>/g,'').slice(0,90));}}catch(e){}return L;};}
// 10. el modo ligero automático ya existía (099_para_aprender_y_ensenar.js: FPSW); aquí no se repite.
// ---------------------------------------------------------------- reloj
{const f=uxTick;uxTick=function(dt){f(dt);if(!state||ui==='start')return;DZ.t+=dt;
  if(DZ.t<0.5)return;DZ.t=0;try{if(ui==='play'){dzTrail();dzCivicTick();dzRetoTick();}dzMuffle();if(DZ.big!==!!ACC.bigBtn){DZ.big=!!ACC.bigBtn;dzBig();}}catch(e){}};}
