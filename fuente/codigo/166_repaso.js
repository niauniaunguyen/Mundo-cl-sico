// ============================================================ REPASO ESPACIADO: lo aprendido vuelve a preguntarse días después
// Recordar cuesta menos si se repasa cuando ya se empieza a olvidar (efecto de espaciado). Cada lección con pregunta vuelve
// a los 1, 3, 7, 14 y 30 días de juego. La pregunta la hace cualquiera con quien hables («me han dicho que hablaste con…»),
// o se repasa desde Aprender › Repasar. Si fallas, se explica otra vez y vuelve al principio. Tras cinco aciertos seguidos, dominada.
const RV_INT=[1,3,7,14,30];
function rvz(){const s=state;if(!s.rv)s.rv={l:{},ok:0,ko:0,day:0};return s.rv;}
function rvDay(){return state.day||1;}
function rvNpc(id){return NPCS.find(n=>n.id===id&&n.quiz&&n.quiz.a);}
function rvSync(){const z=rvz(),d=rvDay();(state.lessons||[]).forEach((id,i)=>{if(!z.l[id]&&rvNpc(id))z.l[id]={s:0,due:d+1+(i%3)};});}
function rvDue(){rvSync();const z=rvz(),d=rvDay();return Object.keys(z.l).filter(id=>z.l[id].s<RV_INT.length&&z.l[id].due<=d&&rvNpc(id)).sort((a,b)=>z.l[a].due-z.l[b].due);}
function rvMastered(){const z=rvz();return Object.values(z.l).filter(e=>e.s>=RV_INT.length).length;}
function rvMark(id,ok){const z=rvz(),e=z.l[id]||(z.l[id]={s:0,due:0}),d=rvDay();
  if(ok){e.s++;e.due=d+(RV_INT[Math.min(e.s,RV_INT.length-1)]);z.ok++;if(z.ok%3===0)qAdd('so',1,'Repasar a tiempo es aprender de verdad.');}
  else{e.s=0;e.due=d+1;z.ko++;}
  save();}
// pinta la pregunta en el elemento B (cuerpo) y los botones en O; al terminar llama a done(ok)
function rvAskIn(B,O,id,intro,done){const n=rvNpc(id);if(!n){done&&done(null);return;}const q=n.quiz,L=LESSONS[id]||{};const order=[0,1,2].sort(()=>Math.random()-0.5);
  B.innerHTML=(intro?'<p>'+intro+'</p>':'')+'<p><span class="label">Repaso · '+(L.title||'')+'</span><br>'+q.q+'</p>';O.innerHTML='';
  const fin=ok=>{rvMark(id,ok);const e=rvz().l[id];
    B.innerHTML=ok?'<div class="verdict">¡Lo recuerdas!</div><p class="sub">'+(e.s>=RV_INT.length?'Ya la dominas: no volverá a salir.':'Volverá a salir dentro de '+RV_INT[Math.min(e.s,RV_INT.length-1)]+' días.')+'</p>'
      :'<div class="verdict bad">'+(q.ko||'No era esa.')+'</div><p style="margin-top:8px">'+(L.summary||'')+'</p><p class="sub">Te lo volverán a preguntar mañana. Si quieres oírlo otra vez, habla con '+(L.who||n.name)+'.</p>';
    done&&done(ok);};
  order.forEach((ai,i)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(i+1)+'</span><span>'+q.a[ai]+'</span>';b.onclick=()=>fin(ai===0);O.appendChild(b);});
  const b=document.createElement('button');b.innerHTML='<span class="n">'+(order.length+1)+'</span><span>No me acuerdo</span>';b.onclick=()=>fin(false);O.appendChild(b);
  try{O.querySelector('button').focus({preventScroll:true});}catch(e){}}
// en una conversación: si hay algo que repasar (de otra persona), aparece la opción
{const f=renderOpts;renderOpts=function(extra){f(extra);try{const n=dlg&&dlg.n;if(!n||!n.topics||dlg.rv)return;const L=rvDue().filter(id=>id!==n.id);if(!L.length)return;
  const id=L[0],o=$('dOpts'),b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">↻</span><span>«¿Te acuerdas de lo que te contó '+(LESSONS[id].who||'')+'?»</span>';
  b.onclick=()=>{dlg.rv=1;rvAskIn($('dBody'),o,id,'«Me han dicho que hablaste con <b>'+(LESSONS[id].who||'')+'</b>. A ver si te acuerdas…»',()=>{const c=document.createElement('button');c.innerHTML='<span class="n">1</span><span>Seguir hablando</span>';c.onclick=()=>{$('dBody').innerHTML='<p>'+n.intro+'</p>';renderOpts();};o.innerHTML='';o.appendChild(c);c.focus({preventScroll:true});});};
  o.insertBefore(b,o.firstChild);}catch(e){}};}
// panel para repasar todo lo pendiente de una vez
function rvOpen(){const L=rvDue();const o=eduOverlay('rvBox','Repasar','<div id="rvB"></div><div id="rvO" class="lrnRow" style="flex-direction:column;align-items:stretch"></div><p class="sub" id="rvS"></p>');
  const B=$('rvB'),O=$('rvO'),S=$('rvS');let i=0,ok=0;
  const next=()=>{S.textContent='Dominadas: '+rvMastered()+' · aciertos en repasos: '+rvz().ok;
    if(i>=L.length){B.innerHTML=L.length?'<p><b>Has repasado '+L.length+'.</b> '+ok+' bien.</p><p class="sub">Lo que hayas fallado volverá mañana; lo acertado, más adelante.</p>':'<p>Hoy no te toca repasar nada. Vuelve otro día: lo que aprendes vuelve a salir justo cuando empieza a olvidarse.</p>';O.innerHTML='';return;}
    rvAskIn(B,O,L[i],null,r=>{if(r)ok++;i++;const c=document.createElement('button');c.textContent=i<L.length?'Siguiente ('+(L.length-i)+')':'Terminar';c.onclick=next;O.innerHTML='';O.appendChild(c);c.focus({preventScroll:true});});};
  next();}
{const g0=gmRight;gmRight=function(d){g0(d);try{if((GM.page||'')!=='aprender')return;const L=d.querySelector('.gr .list');if(!L||L.querySelector('[data-rv]'))return;const n=rvDue().length;
  const b=document.createElement('button');b.dataset.rv='1';b.innerHTML=gmIc('journal')+'<span class="t">Repasar'+(n?' ('+n+')':'')+'</span><span class="k">'+(n?'lo que empieza a olvidarse':'hoy no toca nada')+'</span>';b.onclick=()=>{gmClose();setTimeout(rvOpen,80);};L.insertBefore(b,L.firstChild);}catch(e){}};}
// aviso una vez al día
{const f=uxTick;uxTick=function(dt){f(dt);try{if(!state||ui!=='play')return;const z=rvz(),d=rvDay();if(z.day===d)return;z.day=d;const n=rvDue().length;
  if(n)toast('<span class="label">Repaso</span><br>Hoy '+(n===1?'hay una lección':'hay '+n+' lecciones')+' que empiezan a olvidarse. Cualquiera con quien hables te puede preguntar, o ve a Aprender › Repasar.');}catch(e){}};}
// informe del docente
{const f=dzReport;dzReport=function(){const r=f();try{const z=rvz();const i=r.indexOf('--- datos para el panel');const line='Repaso espaciado: '+z.ok+' aciertos, '+z.ko+' fallos, '+rvMastered()+' lecciones dominadas, '+rvDue().length+' pendientes hoy.';
  return i>=0?r.slice(0,i)+line+'\n\n'+r.slice(i):r+'\n'+line;}catch(e){return r;}};}
{const f=pdData;pdData=function(){const d=f();try{const z=rvz();d.repasoOk=z.ok;d.repasoKo=z.ko;d.dominadas=rvMastered();}catch(e){}return d;};}
