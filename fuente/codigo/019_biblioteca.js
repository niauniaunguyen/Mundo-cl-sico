// ============================================================ biblioteca
let libCur='e:contexto',uiReturn=null;
const norm=t=>String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/<[^>]+>/g,' ').toLowerCase();
function libSections(){
  const secs=[{t:'Contexto',items:ESSAYS.filter(e=>e.cat==='Contexto').map(e=>({id:'e:'+e.id,title:e.title}))}];
  ['Política','Filosofía','Historia','Sociedad','Cultura','Ciencia','Religión','Genealogías','Mitos'].forEach(c=>secs.push({t:c,items:Object.keys(LESSONS).filter(id=>LESSONS[id].cat===c).map(id=>({id:'l:'+id,title:LESSONS[id].title}))}));
  {const ms=secs.find(x=>x.t==='Mitos');RELIEFS.forEach(r=>ms.items.push({id:'r:'+r.id,title:'Mito en piedra: '+r.name}));}
  secs.push({t:'Mitología griega',items:MYTHS.map(m=>({id:'m:'+m.id,title:m.title}))});
  secs.push({t:'Lugares',items:PLACES.map(p=>({id:'p:'+p.id,title:p.name}))});
  secs.push({t:'Sobre el juego',items:ESSAYS.filter(e=>e.cat==='Juego').map(e=>({id:'e:'+e.id,title:e.title}))});
  return secs;
}
function srcText(sr){return sr?[].concat(sr.a||[],sr.m||[],sr.n||[]).join(' '):'';}
function libPlain(id){const[k,v]=id.split(':');
  if(k==='r'){const r=RELIEFS.find(x=>x.id===v);return r.name+' '+r.see+' '+r.ok+' '+srcText(RSRC[v]);}
  if(k==='m'){const m=MYTHS.find(x=>x.id===v);return m.title+' '+m.cat+' '+m.t+' '+(m.a||[]).join(' ')+' '+(m.n||[]).join(' ');}
  if(k==='e'){const e=ESSAYS.find(x=>x.id===v);return e.title+' '+e.body.join(' ')+' '+srcText(e.src);}
  if(k==='p'){const p=PLACES.find(x=>x.id===v);return p.name+' '+p.text+' '+srcText(PSRC[v]);}
  const L=LESSONS[v],n=NPCS.find(x=>x.id===v);const gt=t=>t?t.n+' '+(t.d||'')+' '+(t.c||[]).map(gt).join(' '):'';return gt(n&&n.gen)+' '+L.title+' '+L.who+' '+L.summary+' '+(n?n.topics.map(t=>t.join(' ')).join(' '):TRIAL_STEPS.map(s=>s.t).join(' '))+' '+srcText(SRC[v]);}
function renderLibNav(q){
  const qq=norm(q||'').trim();let h='';
  for(const sc of libSections()){const items=qq?sc.items.filter(it=>norm(libPlain(it.id)).includes(qq)):sc.items;if(!items.length)continue;
    h+='<h4>'+sc.t+'</h4>'+items.map(it=>'<button data-id="'+it.id+'"'+(it.id===libCur?' aria-current="true"':'')+'>'+it.title+'</button>').join('');}
  $('libList').innerHTML=h||'<div class="empty">Nada coincide con la búsqueda.</div>';
  $('libList').querySelectorAll('button').forEach(b=>b.onclick=()=>showArticle(b.dataset.id));
}
function srcBlock(sr){if(!sr)return'';let h='';
  if(sr.a&&sr.a.length)h+='<h5>Fuentes antiguas</h5><ul class="src">'+sr.a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
  if(sr.m&&sr.m.length)h+='<h5>Estudios modernos</h5><ul class="src">'+sr.m.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
  if(sr.n&&sr.n.length)h+='<h5>Precisiones y dudas</h5>'+sr.n.map(x=>'<div class="note">'+x+'</div>').join('');return h;}
function showArticle(id){
  libCur=id;const[k,v]=id.split(':');let h='<article>';
  if(k==='e'){const e=ESSAYS.find(x=>x.id===v);h+='<span class="label">'+e.cat.replace('Juego','Sobre el juego')+'</span><h3>'+e.title+'</h3>'+e.body.map(p=>p==='@@RF@@'?rfHTML():'<p>'+p+'</p>').join('')+srcBlock(e.src);}
  else if(k==='m'){const m=MYTHS.find(x=>x.id===v);h+='<span class="label">Mitología griega · '+m.cat+'</span><h3>'+m.title+'</h3><div class="meta">Te lo cuenta Demofonte, el librero del Ágora.</div><p>'+m.t+'</p>'+srcBlock({a:m.a,n:m.n});}
  else if(k==='r'){const r=RELIEFS.find(x=>x.id===v),ok=state.myths.includes(v);h+='<span class="label">Mito en piedra</span><h3>'+r.name+'</h3><div class="meta">'+(ok?'Ya lo has reconocido en el juego.':'Aún no lo has reconocido en el juego.')+'</div><p>'+r.see+'</p><p>'+r.ok+'</p>'+srcBlock(RSRC[v]);}
  else if(k==='p'){const p=PLACES.find(x=>x.id===v),ok=state.places.includes(v);h+='<span class="label">Lugar · '+p.greek+'</span><h3>'+p.name+'</h3><div class="meta">'+(ok?'Ya has leído su estela en el juego.':'Aún no has encontrado su estela en el juego.')+'</div><p>'+p.text+'</p>'+srcBlock(PSRC[v]);}
  else{const L=LESSONS[v],n=NPCS.find(x=>x.id===v),ok=state.lessons.includes(v);
    h+='<span class="label">'+L.cat+' · <span class="'+(L.fict?'fict':'')+'">'+L.who+'</span></span><h3>'+L.title+'</h3><div class="meta">'+(L.fict?'Personaje inventado. ':(L.fict===false?'Personaje histórico. ':''))+(ok?'Lección superada.':'Lección pendiente.')+' Dónde: '+L.where+'.</div><p>'+L.summary+'</p>';
    const qa=n?n.topics.map(t=>[t[0],t[1]]):TRIAL_STEPS.filter(s=>!s.vote).map(s=>[s.who+' ('+s.title+')',s.t]);
    h+='<h5>'+(n?'Lo que cuenta '+n.name:'Las intervenciones del juicio')+'</h5><dl class="qa">'+qa.map(t=>'<dt>'+t[0]+'</dt><dd>'+t[1]+'</dd>').join('')+'</dl>'+(n&&n.gen?'<h5>'+(n.genTitle||'Árbol genealógico que explica '+n.name)+'</h5>'+treeHTML(n.gen):'')+srcBlock(SRC[v]);}
  h+='</article>';$('libArt').innerHTML=h;$('libArt').scrollTop=0;
  $('libList').querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',b.dataset.id===id?'true':'false'));
}
function openLibrary(id){
  if(ui==='dialog'||ui==='library')return;
  uiReturn=ui==='start'?'start':'play';ui='library';releasePointer();$('library').hidden=false;
  if(id)libCur=id;renderLibNav($('libQ').value);showArticle(libCur);
}
function advanceTime(){addHours(3);updateSky();toast('Pasan unas horas: '+hourLabel());}


// ============================================================ diario
let jTab='steps';
function openJournal(tab){if(TUT.on&&TUT.i===4){TUT.journal=true;tab='guia';setTimeout(()=>{sfxCoin();tutEnd(false);},50);}if(tab)jTab=tab;ui='journal';releasePointer();$('journal').hidden=false;renderJournal();}
// primeros pasos: título y subtítulo a la vista; la explicación, al pulsar la tarjeta
const STEP_OPEN=new Set();
document.addEventListener('click',e=>{const c=e.target&&e.target.closest&&e.target.closest('#journal .entry.stp');if(!c)return;const id=c.dataset.stp;if(STEP_OPEN.has(id))STEP_OPEN.delete(id);else STEP_OPEN.add(id);
  const op=STEP_OPEN.has(id),t=c.querySelector('.stx'),m=c.querySelector('.smore');if(t)t.hidden=!op;if(m)m.textContent=op?'menos ▴':'más ▾';c.classList.toggle('open',op);c.setAttribute('aria-expanded',op);});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.matches&&e.target.matches('#journal .entry.stp')){e.preventDefault();e.target.click();}});
{const st=document.createElement('style');st.textContent='#journal .entry.stp{cursor:pointer;position:relative}#journal .entry.stp:hover{background:rgba(241,232,216,.1)}#journal .entry.stp .ssub{color:#dccdb2;font-size:.95rem;margin:0}#journal .entry.stp .stx{margin-top:8px}#journal .entry.stp .smore{display:block;margin-top:6px;font-size:.8rem;color:#e8a66a;letter-spacing:.04em}#journal .entry.stp.open{background:rgba(241,232,216,.09)}#journal .entries:has(.stp){align-items:start}';document.head.appendChild(st);}
function renderJournal(){
  document.querySelectorAll('#journal .tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===jTab?'true':'false'));
  const el=$('jBody');let h='';
  if(jTab==='steps'&&storyOn()){h=storyJournal();}
  else if(jTab==='steps'){const L=STEPS(),d=stepsDone();h=calendarHTML()+'<p style="margin:0 0 12px;max-width:68ch;line-height:1.5">'+(d>=L.length?'Has completado los primeros pasos. Ahora explora por tu cuenta: personajes, lugares, dioses, viajes, esferas de sueño y la biblioteca (B).':'Diez misiones para empezar, cada una sobre un aspecto distinto de la ciudad. Puedes hacerlas en cualquier orden; el objetivo de arriba a la izquierda y el rombo ◆ de la brújula te guían hacia la siguiente.')+'</p><div class="entries">'+
    L.map((s,i)=>{const op=STEP_OPEN.has(s.id);return '<div class="entry stp'+(s.ok()?'':' locked')+(op?' open':'')+'" data-stp="'+s.id+'" role="button" tabindex="0" aria-expanded="'+op+'"><span class="label">'+(i+1)+' · '+s.cat+(s.ok()?' · hecho ✓':'')+'</span><h3>'+s.title+'</h3>'+(s.short?'<p class="ssub">'+s.short+'</p>':'')+'<p class="stx"'+(op?'':' hidden')+'>'+s.txt+'</p><span class="smore">'+(op?'menos ▴':'más ▾')+'</span></div>';}).join('')+'</div>'+
    (d<L.length?'<p style="margin:14px 0 0"><button class="linkbtn" id="stepsOff">'+(state.steps._off?'Volver a mostrar los primeros pasos':'Ocultar los primeros pasos y explorar libremente')+'</button></p>':'');}
  else if(jTab==='lessons'){h='<div class="entries">'+Object.keys(LESSONS).map(id=>{const L=LESSONS[id],ok=state.lessons.includes(id);return ok?'<div class="entry"><span class="label">'+L.cat+' · <span class="'+(L.fict?'fict':'')+'">'+L.who+'</span></span><h3>'+L.title+'</h3><p>'+L.summary+'</p><button class="linkbtn" data-lib="l:'+id+'">Leer más y ver las fuentes</button></div>':'<div class="entry locked"><span class="label">'+L.cat+'</span><h3>'+L.title+'</h3><p>'+(L.hint||('Habla con '+L.who+' y supera su pregunta.'))+'</p><div class="where">'+L.where+'</div></div>';}).join('')+'</div>';}
  else if(jTab==='places'){h='<div class="entries">'+PLACES.map(p=>state.places.includes(p.id)?'<div class="entry"><span class="label">'+p.greek+'</span><h3>'+p.name+'</h3><p>'+p.text+'</p><button class="linkbtn" data-lib="p:'+p.id+'">Ver las fuentes</button></div>':'<div class="entry locked"><span class="label">Sin descubrir</span><h3>'+p.name+'</h3><p>Busca su estela (el rombo dorado) y pulsa E para leerla.</p></div>').join('')+'</div>';}
  else if(jTab==='myths'){h='<p style="margin:0 0 12px;max-width:68ch;line-height:1.5">Busca los rombos azules junto a frontones, metopas, frisos y pinturas, y pulsa E para identificar el mito. Eunice, la abuela de la fuente del sureste del Ágora, te explica el juego.</p><div class="entries">'+RELIEFS.map(r=>state.myths.includes(r.id)?'<div class="entry"><span class="label">Mito reconocido</span><h3>'+r.name+'</h3><p>'+r.ok+'</p><button class="linkbtn" data-lib="r:'+r.id+'">Ver las fuentes</button></div>':'<div class="entry locked"><span class="label">Por reconocer</span><h3>'+r.name+'</h3><p>Busca el rombo azul y descubre qué mito representa.</p></div>').join('')+'</div>';}
  else if(jTab==='gods'){h='<p style="margin:0 0 12px;max-width:68ch;line-height:1.5">'+(MODE==='roma'?'Los dioses se aparecen fuera de la ciudad, en la campiña, junto a los lugares de su culto: los de Grecia, con su nombre romano, y los que solo tiene Roma. Se los reconoce por el brillo de su piel. Cada uno te puede pedir un favor.':'Los dioses se aparecen fuera de las murallas, junto a los lugares de su culto. Se los reconoce por el brillo de su piel. Cada uno te puede pedir un favor.')+'</p><div class="entries">'+GODS.map(d=>{const met=state.gods.met.includes(d.id),q=state.gods.q[d.id];
    if(!met)return '<div class="entry locked"><span class="label">Sin encontrar</span><h3>'+d.name+'</h3><p>Dicen que se le ha visto '+d.where+'.</p></div>';
    const st=q==='done'?'Favor concedido':q==='ready'?'Encargo cumplido: vuelve a hablar con '+(GODS.find(x=>x.id===d.id).name):q==='on'?'Encargo en curso':'Aún no le has preguntado si necesita algo';
    return '<div class="entry"><span class="label">'+d.gr+' · '+st+'</span><h3>'+d.name+', '+d.title+'</h3><p>'+(q&&q!=='done'?d.quest.goal:q==='done'?'Has cumplido su encargo.':'Habla con '+d.name+' y pregúntale si puedes hacer algo por él o por ella.')+'</p><div class="where">'+d.where[0].toUpperCase()+d.where.slice(1)+'</div></div>';}).join('')+'</div>';}
  else if(jTab==='ficha'){h=qualHTML();}
  else if(jTab==='guia'){h=guideHTML();}
  else if(jTab==='fiestas'){h=(MODE==='roma'?'<div class="entries">'+fastosHTML()+'</div>':'')+festsHTML();}
  else if(jTab==='fx'){h=fxJournal();setTimeout(()=>{const e=$('fxEnt'),c=$('fxCop');if(e)e.onclick=fxEntregar;if(c)c.onclick=()=>{const t=fxCuadFile();try{navigator.clipboard.writeText(t).then(()=>toast('Cuaderno copiado: pégalo en un correo o en la plataforma de clase.'),()=>toast('No se ha podido copiar.'));}catch(err){toast('No se ha podido copiar.');}};},0);}
  else if(jTab==='curios'){const L=curioList(),got=L.filter(c=>(state.curios||[]).includes(c.id)),est=L.filter(c=>c.at&&!got.includes(c)).length,dia=L.filter(c=>!c.at&&!got.includes(c)).length;
    h='<p style="margin:0 0 12px;max-width:68ch;line-height:1.5">Anécdotas, costumbres y rarezas que contaban los propios antiguos. Unas aparecen al leer ciertas estelas; otras te las cuentan al amanecer de cada día. Llevas '+got.length+' de '+L.length+': quedan '+est+' en estelas y '+dia+' por contar. <span class="sub">Seleccionadas a partir de J. C. McKeown, <i>Gabinete de curiosidades griegas</i> (Crítica, 2014), con sus fuentes antiguas.</span></p><div class="entries">'+got.map(c=>'<div class="entry"><span class="label">Curiosidad</span><h3>'+c.h+'</h3><p>'+c.t+'</p><div class="where">'+c.s+'</div></div>').join('')+'</div>';}
  else{h='<div class="timeline">'+TIMELINE.map(t=>'<span class="y'+(t[0]==='386'?' now':'')+'">'+t[0]+' a.C.</span><div>'+t[1]+'</div>').join('')+'</div>';}
  el.innerHTML=h;el.scrollTop=0;
  el.querySelectorAll('[data-lib]').forEach(b=>b.onclick=()=>{closeModals();openLibrary(b.dataset.lib);});
  const so=$('stepsOff');if(so)so.onclick=()=>{state.steps._off=state.steps._off?0:1;save();updateStats();renderJournal();};
}
document.querySelectorAll('#journal .tabs button').forEach(b=>b.onclick=()=>{jTab=b.dataset.tab;renderJournal();});
document.addEventListener('change',e=>{if(e.target&&e.target.id==='pjOrig'&&jTab==='fx'&&!$('journal').hidden){fxSetOrig(e.target.value);renderJournal();}});
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModals);
function closeModals(){$('journal').hidden=true;$('map').hidden=true;$('library').hidden=true;ui=uiReturn||'play';uiReturn=null;}

