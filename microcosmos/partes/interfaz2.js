/* =====================================================================
   INTERFAZ v4: narrador, historia, microscopio, diagnóstico, árbol y tablón de la clase
   ===================================================================== */
Object.assign(IC, {
  book:'<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15.5H5.5A1.5 1.5 0 0 0 4 21z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15.5h5.5c.8 0 1.5.7 1.5 1.5z"/><path d="M6.5 8h2.5M6.5 11h2.5M15 8h2.5"/>',
  scope:'<path d="M9 3.5l4 2.3-3 5.2-4-2.3z"/><path d="M11 9.5l2 1.2M8.6 13a5 5 0 1 0 8.3 4.2"/><path d="M5 21h14M12 17.5V21"/><circle cx="16.4" cy="14.2" r="1.3"/>',
  tree:'<circle cx="12" cy="4.5" r="2"/><circle cx="5.5" cy="12" r="2"/><circle cx="18.5" cy="12" r="2"/><circle cx="5.5" cy="19.5" r="2"/><circle cx="12" cy="19.5" r="2"/><circle cx="18.5" cy="19.5" r="2"/><path d="M12 6.5v11M10.5 6l-3.6 4.4M13.5 6l3.6 4.4M5.5 14v3.5M18.5 14v3.5"/>',
  board:'<rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M7 21l3-4M17 21l-3-4"/><path d="M7 13V10M11 13V7.5M15 13V9M19 13"/>',
  eye:'<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  tube:'<path d="M9 3h6M10 3v13.5a2 2 0 0 0 4 0V3"/><path d="M10 11h4"/><circle cx="12" cy="14.2" r=".8"/>',
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
  spark:'<path d="M12 2.5l1.8 5.2 5.2 1.8-5.2 1.8L12 16.5l-1.8-5.2-5.2-1.8 5.2-1.8z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  planet:'<circle cx="12" cy="12" r="5.5"/><path d="M4.2 15.8C1.8 17.6 1 19.2 1.8 20s3.5-.3 6.7-2.3M16 6.4c3.4-2.1 6-3 6.6-2.3.8.8-.4 2.8-3 5"/><path d="M7.8 17.7c3.3-1.6 7.6-4.8 11.8-8.6"/>',
  doctor:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/><path d="M9.5 15l2.5 3.5 2.5-3.5"/><path d="M16.5 17v2.2a1.3 1.3 0 0 0 2.6 0V17"/>',
});
document.querySelectorAll('[data-ic]').forEach(s => s.innerHTML = ico(s.dataset.ic));

// ---- Narrador: la doctora Olmo ----
let TTS = null;
try{ window.claude?.use?.('tts').then(t => { TTS = t; }, () => {}); }catch(_){}
const narrShown = new Set();
let narrT = null;
function speak(text){
  if (!S.voice) return;
  const fallback = () => { try{ const u = new SpeechSynthesisUtterance(text); u.lang = {es:'es-ES', ca:'ca-ES', en:'en-GB'}[LANG]; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(_){} };
  if (TTS) TTS.speak(text, {language:LANG}).catch(fallback); else fallback();
}
function narr(key, force){
  if (!S.narr || !NARR[key] || (!force && narrShown.has(key))) return;
  narrShown.add(key);
  const el = $('#narr'), txt = tr(NARR[key]);
  el.querySelector('.nt').textContent = txt; el.hidden = false; $('#msg').classList.remove('mini'); resize(); // la tarjeta crece: la cámara se reencuadra
  clearTimeout(narrT); narrT = setTimeout(hideNarr, 9000);
  speak(txt);
}
function placeNarr(){} // la narradora ya no flota: va dentro de la tarjeta de mensajes
function hideNarr(){ if ($('#narr').hidden) return; $('#narr').hidden = true; resize(); foldMsgLater(); }
$('#narr .nx').onclick = () => { clearTimeout(narrT); hideNarr(); try{ TTS && TTS.stop(); speechSynthesis.cancel(); }catch(_){} };

// ---- Eventos especiales ----
$('#bStory').onclick = () => showEvents();
const exLocked = X => S.best < X.need && !S.evDone[X.id] && !(S.story && S.story.ev === X.id);
function exReward(X){
  const r = X.reward, p = [];
  if (r.adn) p.push(tr('+{n} ADN', {n:r.adn})); if (r.lpts) p.push(tr('+{n} punto del árbol inmunitario', {n:r.lpts}));
  if (r.skin) p.push(tr('el color «{n}»', {n:SKINS[r.skin].n}));
  return p.join(' · ');
}
function showEvents(){
  const cards = EXPED.map(X => {
    const lock = exLocked(X), done = !!S.evDone[X.id], now = S.story && S.story.ev === X.id;
    return `<button class="exc ${done ? 'done' : ''} ${now ? 'now' : ''}" data-ex="${X.id}" ${lock ? 'disabled' : ''} style="--k:${hex(X.col)}">
      ${vesicle(X.ic, X.col)}<span class="et"><b>${tr(X.n)}</b><small>${lock ? tr('Se desbloquea al llegar al nivel {l}', {l:X.need}) : tr(X.d)}</small>
      <span class="rw">${now ? tr('En curso · capítulo {i} de {n}', {i:S.story.ch + 1, n:X.chapters.length}) : done ? '✓ ' + tr('Completado') : tr('Recompensa') + ': ' + exReward(X)}</span></span></button>`; }).join('');
  showModal(`<div class="eyebrow">${ico('spark')}${tr('Eventos especiales')}</div><h2>${tr('Eventos')}</h2>
    <p>${tr('Campañas cortas con combates preparados. La primera vez que completas un evento te llevas su recompensa. Tu partida normal se conserva.')}</p>
    <div class="exl">${cards}</div><div class="row"><button class="ghost" id="mGo">${tr('Cerrar')}</button></div>`);
  $('#mBox').querySelectorAll('[data-ex]').forEach(b => b.onclick = () => showEvent(b.dataset.ex));
}
function showEvent(id){
  const X = EXPED_BY[id], here = S.story && S.story.ev === id, cur = here ? S.story.ch : -1;
  const rows = X.chapters.map((c, i) => {
    const st = S.evDone[id] && !here || i < cur ? 'ok' : i === cur ? 'now' : '';
    return `<li class="${st}"><span class="num">${i + 1}</span><div><b>${tr(c.n)}</b><small>${CELLS[c.cell].n} · ${c.pl ? tr(c.pl) : ZONES[c.zone].n}</small></div></li>`; }).join('');
  const other = S.story && !here ? `<p class="hint">${tr('Saldrás del evento «{n}», que tienes a medias.', {n:tr(curEx().n)})}</p>` : '';
  showModal(`<div class="eyebrow" style="color:${hex(X.col)}">${ico(X.ic)}${tr('Evento')}</div><h2>${tr(X.n)}</h2>
    <p>${tr(X.d)}</p><p><b>${S.evDone[id] ? tr('Ya conseguiste la recompensa.') : tr('Recompensa') + ': ' + exReward(X)}</b></p>
    <ol class="chap">${rows}</ol>${other}
    <div class="row">${here ? `<button class="go" id="stGo">${tr('Continuar')}</button><button class="ghost" id="stLeave">${tr('Salir del evento')}</button>`
      : `<button class="go" id="stGo">${S.evDone[id] ? tr('Volver a jugarlo') : tr('Empezar')}</button><button class="ghost" id="stBack">${tr('Volver')}</button>`}</div>`);
  $('#stGo').onclick = () => { $('#modal').hidden = true; if (here) showChapter(() => { if (!B || B.over) newBattle(); else scheduleAuto(); }); else startStory(id); };
  const lv = $('#stLeave'); if (lv) lv.onclick = () => { $('#modal').hidden = true; leaveStory(); };
  const bk = $('#stBack'); if (bk) bk.onclick = showEvents;
}
function showChapter(then){
  const ch = storyCh(), X = curEx(); if (!ch){ then && then(); return; }
  let first = ch.battles[0]; if (first.t) first = first.t; if (first === '@sepsis') first = 'gn';
  const nm = b => { b = b.t || b; return b === '@sepsis' ? tr('Sepsis') : VARIANTS[b] ? tr(VARIANTS[b].n) : TYPES[b].n; };
  showModal(`<div class="spec">${fov(first, 'big', ch.pl ? tr(ch.pl) : ZONES[ch.zone].n)}<div>
    <div class="eyebrow" style="color:${hex(X.col)}">${tr(X.n)} · ${tr('Capítulo {i} de {n}', {i:S.story.ch + 1, n:X.chapters.length})}</div><h2>${tr(ch.n)}</h2>
    <p>${tr(ch.t)}</p>
    <div class="stat"><span>${tr('Juegas como')}</span><span>${CELLS[ch.cell].n}</span><span>${tr('Combates')}</span><span>${ch.battles.map(nm).join(' → ')}</span><span>${tr('Herramientas')}</span><span>${ch.tools.map(t => TOOL[t].n).join(', ')}</span></div>
    <button class="go" id="mGo">${tr('Al combate')}</button></div></div>`, then);
}
function showStoryEnd(X, first){
  const sk = X.reward.skin;
  showModal(`<div class="intro"><div class="fov big">${thumb('me') ? `<img src="${thumb('me')}" alt="">` : ''}</div><div>
    <div class="eyebrow">${tr(X.n)} · ${tr('Epílogo')}</div><h2>${tr(X.end[0])}</h2><p>${tr(X.end[1])}</p>
    ${first ? `<p><b>${tr('Evento completado')}: ${exReward(X)}.</b></p>${sk ? `<p class="hint">${tr('Encontrarás el color nuevo en el Laboratorio, en «Tu célula».')}</p>` : ''}` : ''}</div></div>
    <button class="go" id="mGo">${tr('Seguir')}</button>`, () => { checkAch(); newBattle(); });
}
// Primera vez que aparece una variante: compárala con el original y adivina qué funcionará
function showVariant(id){
  const Vr = VARIANTS[id], Ty = VTY(id), Ob = TYPES[Vr.base], ch = storyCh();
  const fake = {type:Vr.base, var:id}, tools = ch ? ch.tools : TOOLS.map(t => t.id);
  const sc = tools.filter(t => t !== 'luz').map(t => ({t:TOOL[t], m:eff(t, fake).m + TOOL[t].pow*.01}));
  const best = (Vr.qbest && sc.find(x => x.t.id === Vr.qbest)) || sc.reduce((a, b) => b.m > a.m ? b : a);
  const tr0 = Ob.traits.map(([x]) => `<span class="trait">${esc(x)}</span>`).join('');
  const tr1 = Ty.traits.map(traitTag).join('');
  const okQ = q => Vr.qbest ? q === Vr.qbest : best.m - .01*best.t.pow <= eff(q, fake).m;
  showModal(`<div class="eyebrow" style="color:${hex(Vr.col)}">${tr('Variante')} · ${tr('pariente de {n}', {n:Ob.n})}</div><h2>${Ty.n}</h2><div class="sci">${Ty.sci}</div>
    <div class="vcmp"><div>${fov(Vr.base, '', tr('Original'))}<b>${Ob.n}</b><div class="traits">${tr0}</div></div>
      <div>${fov(id, '', tr('Variante'))}<b>${Ty.n}</b><div class="traits">${tr1}</div></div></div>
    <p><b>${tr('Qué ha cambiado')}:</b> ${tr(Vr.diff)}</p>
    <div class="quiz" id="quiz"><div class="eyebrow">${tr('Pregunta')}</div><b>${tr('Con este cambio, ¿qué herramienta funcionará mejor?')}</b>
      <div class="qopts">${sc.sort((a, b) => a.t.id < b.t.id ? -1 : 1).map(o => `<button data-q="${o.t.id}">${vesicle(o.t.id, o.t.col)}${o.t.n}</button>`).join('')}</div>${hintHtml()}<p class="qres" id="qres" aria-live="polite"></p></div>
    <button class="go" id="mGo" hidden>${tr('Al combate')}</button>`, () => narr('variant'));
  wireHint({best:best.t.id, tags:hintTags(Ty.traits, best.t.id), ok:okQ});
  $('#quiz').querySelectorAll('[data-q]').forEach(b => b.onclick = () => {
    const ok = okQ(b.dataset.q); S.quiz.n++; $('#qHint').disabled = true;
    $('#quiz').querySelectorAll('[data-q]').forEach(x => { x.disabled = true; if (x.dataset.q === best.t.id || (x === b && ok)) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
    (S.known[id] = S.known[id] || {})[b.dataset.q] = true; S.known[id][best.t.id] = true;
    if (ok){ S.quiz.ok++; sfx.ach(); }
    $('#qres').innerHTML = esc((ok ? tr('¡Correcto!') : tr('No exactamente: la mejor es {t}.', {t:best.t.n})) + ' ' + eff(best.t.id, fake).why) + `<span class="vfact"><b>${tr('Curiosidad')}:</b> ${esc(tr(Vr.fact))}</span>`;
    $('#qres').className = 'qres ' + (ok ? 'ok' : 'no');
    const go = $('#mGo'); go.hidden = false; go.focus();
    checkAch(); save(); renderTools();
  });
}

// ---- Microscopio interactivo ----
let SCOPE = null;
function openScope(id){
  closeScope();
  const name = id === 'me' ? cellD().n : TYPES[id].n, parts = PARTS[id] || [];
  showModal(`<div class="scope"><div class="sview"><canvas id="scv" aria-label="${tr('Modelo 3D de {n}', {n:esc(name)})}"></canvas><div id="sdots"></div>
      <div class="szoom"><button id="szi" aria-label="${tr('Acercar')}">+</button><button id="szo" aria-label="${tr('Alejar')}">−</button></div></div>
    <div class="sinfo"><div class="eyebrow">${ico('scope')}${tr('Microscopio')}</div><h2>${esc(name)}</h2>
      <p class="hint">${tr('Arrastra para girar el modelo, usa la rueda o pellizca para acercarte y toca los puntos para ver cada parte.')}</p>
      <div class="spart" id="spart" aria-live="polite"><b>${tr('Elige una parte')}</b></div>
      <div class="plist">${parts.map((p, i) => `<button data-part="${i}">${esc(tr(p[0]))}</button>`).join('')}</div>
      <button class="go" id="mGo">${tr('Cerrar')}</button></div></div>`, closeScope);
  const cv = $('#scv');
  let R;
  try{ R = new THREE.WebGLRenderer({canvas:cv, antialias:true, alpha:true}); }catch(_){ return; }
  R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping;
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0x9fd0ff, 0x1a0820, .7));
  const d1 = new THREE.DirectionalLight(0xffffff, .8); d1.position.set(-3,4,6); sc.add(d1);
  const d2 = new THREE.DirectionalLight(0x6c95ff, 1); d2.position.set(2,2,-6); sc.add(d2);
  const cam = new THREE.PerspectiveCamera(35, 1, .05, 100);
  const fake = {type:id, grow:1, hidden:false, dark:false, block:0, spore:id === 'bac', inRbc:true};
  const o = id === 'me' ? buildMacrophage(S.cell, SKINS[S.skin].col, S.evos, S.upg) : BUILD[id](fake);
  o.up(2, fake); sc.add(o.g); o.g.updateMatrixWorld(true);
  const sph = new THREE.Box3().setFromObject(o.g).getBoundingSphere(new THREE.Sphere());
  const rad = Math.min(sph.radius, 2.4), center = sph.center.clone();
  const st = {yaw:-.4, pitch:.25, zoom:1, drag:null, pts:new Map()};
  const dots = $('#sdots');
  dots.innerHTML = parts.map((p, i) => `<button class="sdot" data-part="${i}" aria-label="${esc(tr(p[0]))}"><i></i></button>`).join('');
  const show = i => { const p = parts[i]; $('#spart').innerHTML = `<b>${esc(tr(p[0]))}</b><p>${esc(tr(p[1]))}</p>`;
    document.querySelectorAll('[data-part]').forEach(b => b.classList.toggle('on', +b.dataset.part === i)); };
  document.querySelectorAll('#mBox [data-part]').forEach(b => b.onclick = () => show(+b.dataset.part));
  cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); st.pts.set(e.pointerId, [e.clientX, e.clientY]); });
  cv.addEventListener('pointermove', e => {
    if (!st.pts.has(e.pointerId)) return;
    const prev = st.pts.get(e.pointerId);
    if (st.pts.size === 1){ st.yaw -= (e.clientX - prev[0])*.007; st.pitch = clamp(st.pitch + (e.clientY - prev[1])*.007, -1.3, 1.3); }
    else { const [a, b] = [...st.pts.values()], d0 = Math.hypot(a[0] - b[0], a[1] - b[1]);
      st.pts.set(e.pointerId, [e.clientX, e.clientY]); const [c, d] = [...st.pts.values()], d1 = Math.hypot(c[0] - d[0], c[1] - d[1]);
      st.zoom = clamp(st.zoom*d0/Math.max(1, d1), .35, 1.6); return; }
    st.pts.set(e.pointerId, [e.clientX, e.clientY]);
  });
  const up = e => st.pts.delete(e.pointerId);
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', e => { e.preventDefault(); st.zoom = clamp(st.zoom*(e.deltaY > 0 ? 1.1 : .9), .35, 1.6); }, {passive:false});
  $('#szi').onclick = () => st.zoom = clamp(st.zoom*.8, .35, 1.6);
  $('#szo').onclick = () => st.zoom = clamp(st.zoom*1.25, .35, 1.6);
  const clock0 = performance.now(), v = V(), toCam = V(), rel = V();
  SCOPE = {R, raf:0};
  const frame = () => {
    if (!SCOPE) return;
    SCOPE.raf = requestAnimationFrame(frame);
    const w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w*R.getPixelRatio()) || cv.height !== Math.round(h*R.getPixelRatio())){ R.setSize(w, h, false); cam.aspect = w/Math.max(1, h); cam.updateProjectionMatrix(); }
    const t = (performance.now() - clock0)/1000;
    o.up(2 + (reduceMotion || S.calm ? t*.3 : t), fake);
    const dist = rad/Math.sin(THREE.MathUtils.degToRad(17))*st.zoom;
    cam.position.set(center.x + Math.sin(st.yaw)*Math.cos(st.pitch)*dist, center.y + Math.sin(st.pitch)*dist, center.z + Math.cos(st.yaw)*Math.cos(st.pitch)*dist);
    cam.lookAt(center); R.render(sc, cam);
    toCam.copy(cam.position).sub(center);
    parts.forEach((p, i) => { const el = dots.children[i]; if (!el) return;
      v.set(p[2][0], p[2][1], p[2][2]).applyMatrix4(o.g.matrixWorld); rel.copy(v).sub(center);
      const back = rel.dot(toCam) < -rad*.15;
      v.project(cam); el.style.left = ((v.x*.5 + .5)*w) + 'px'; el.style.top = ((-v.y*.5 + .5)*h) + 'px'; el.classList.toggle('back', back); });
  };
  frame();
}
function closeScope(){ if (!SCOPE) return; cancelAnimationFrame(SCOPE.raf); try{ SCOPE.R.dispose(); SCOPE.R.forceContextLoss(); }catch(_){} SCOPE = null; }

// ---- Laboratorio de diagnóstico ----
let DG = null;
function newCase(){
  let pool = S.clase ? TYPE_ORDER.slice() : TYPE_ORDER.filter(id => S.seen[id]);
  if (pool.length < 3) pool = TYPE_ORDER.slice(0, 3);
  DG = {type:pool[Math.floor(Math.random()*pool.length)], cand:pool, tests:[], guess:null, n:S.diag.n + 1};
}
function diagResult(test, type){ const T = DIAG_TESTS[test], k = (DIAG_KEY[test] || {})[type] || DIAG_DEF[test]; return tr(T.r[k]); }
function diagHtml(){
  if (!DG) newCase();
  let h = `<div class="nb">${tr('Laboratorio de diagnóstico')}</div><p class="lead">${tr('Llega una muestra sin etiquetar. Puedes hacer hasta tres pruebas: elige bien cuáles y después da tu diagnóstico. Cuantas menos pruebas uses, más ATP ganas.')}</p>`;
  h += `<div class="stat"><span>${tr('Diagnósticos correctos')}</span><span>${S.diag.ok} / ${S.diag.n}</span></div>`;
  h += `<div class="case"><div class="ch">${ico('tube')}<b>${tr('Muestra nº {n}', {n:DG.n})}</b><small>${tr('Pruebas: {u} de 3', {u:DG.tests.length})}</small></div>`;
  h += `<div class="tests">${Object.entries(DIAG_TESTS).map(([k, T]) => `<button data-test="${k}" ${DG.tests.includes(k) || DG.tests.length >= 3 || DG.guess ? 'disabled' : ''}>${tr(T.n)}</button>`).join('')}</div>`;
  if (DG.tests.length) h += `<ul class="results">${DG.tests.map(k => `<li><b>${tr(DIAG_TESTS[k].n)}:</b> ${diagResult(k, DG.type)}</li>`).join('')}</ul>`;
  if (!DG.guess){
    h += `<div class="nb">${tr('Tu diagnóstico')}</div><div class="guess">${DG.cand.map(id => `<button data-guess="${id}" ${DG.tests.length ? '' : 'disabled'}>${TYPES[id].n}</button>`).join('')}</div>`;
    if (!DG.tests.length) h += `<p class="hint">${tr('Haz al menos una prueba antes de diagnosticar.')}</p>`;
  } else {
    const ok = DG.guess === DG.type, Ty = TYPES[DG.type];
    h += `<div class="verd ${ok ? 'ok' : 'no'}">${fov(DG.type, '', LAB[DG.type][1])}<div><b>${ok ? tr('¡Diagnóstico correcto!') : tr('No era {n}.', {n:TYPES[DG.guess].n})}</b>
      <p>${tr('Era {n} ({s}).', {n:Ty.n, s:Ty.sci})} ${tr('Técnica habitual')}: ${LAB[DG.type][0]}.</p>${DG.gain ? `<p class="num">+${fmt(DG.gain)} ATP</p>` : ''}
      <div class="row"><button class="buy" id="dgNext">${tr('Siguiente muestra')}</button><button class="buy" data-scope="${DG.type}">${tr('Examinar')}</button></div></div></div>`;
  }
  return h + '</div>';
}
function diagClick(b){
  if (b.dataset.test){ if (DG.tests.length < 3 && !DG.tests.includes(b.dataset.test)){ DG.tests.push(b.dataset.test); tone(500 + DG.tests.length*120, .08, 'sine', .04); } }
  else if (b.dataset.guess){
    DG.guess = b.dataset.guess; S.diag.n++; const ok = DG.guess === DG.type;
    if (ok){ S.diag.ok++; DG.gain = S.clase ? 0 : reward(S.level, false)*(2 + (3 - DG.tests.length)); S.atp += DG.gain; sfx.ach(); } else sfx.hurt();
    S.seen[DG.type] = true; save(); renderHud(); pushBoard();
  } else if (b.id === 'dgNext') newCase();
  else return false;
  renderPanel(); return true;
}

// ---- Árbol inmunitario ----
function treeHtml(){
  let h = `<div class="nb">${tr('Árbol inmunitario')} · ${tr('{n} puntos libres', {n:treeFree()})}</div>
    <p class="lead">${tr('Ganas 2 puntos cada vez que evolucionas y 1 por cada jefe especial. Cada rama se desbloquea en orden. Puedes reiniciar el árbol gratis.')}</p><div class="tree">`;
  for (const br of TREE){
    h += `<div class="branch"><b>${tr(br.n)}</b>`;
    br.nodes.forEach(n => { const N = TREE_NODES[n.id], own = has(n.id), avail = !own && (!N.prev || has(N.prev)) && treeFree() >= n.cost;
      h += `<button class="node ${own ? 'own' : avail ? 'av' : ''}" data-node="${n.id}" ${own || !avail ? 'disabled' : ''} aria-pressed="${own}">
        <span class="nc num">${own ? '✓' : n.cost}</span><span><b>${tr(n.n)}</b><small>${tr(n.d)}</small></span></button>`; });
    h += '</div>';
  }
  return h + `</div><button class="buy wide" id="treeReset" ${treeSpent() ? '' : 'disabled'}>${tr('Reiniciar el árbol')}</button>`;
}

// ---- Tablón de la clase (datos compartidos de la página) ----
let DB = null, USER = null, ME = null, boardDocs = [], boardState = 'off', lastBoard = '', boardT = 0;
const weekKey = () => { const d = new Date(), j = new Date(d.getFullYear(), 0, 1); return d.getFullYear() + '-W' + Math.ceil(((d - j)/864e5 + j.getDay() + 1)/7); };
const CLASS_GOAL = 300;
async function initClass(){
  try{
    if (!window.claude || !window.claude.use){ boardState = 'none'; return; }
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    if (!db || !user){ boardState = 'none'; rerenderBoard(); return; }
    DB = db; USER = user; ME = await user.id();
    if (!ME){ boardState = 'none'; rerenderBoard(); return; }
    boardState = 'loading';
    const timer = setTimeout(() => { if (boardState === 'loading'){ boardState = 'slow'; rerenderBoard(); } }, 10000);
    db.collection('board').onSnapshot(snap => {
      if (!snap.metadata.fromCache) clearTimeout(timer);
      boardDocs = snap.docs.map(d => Object.assign({id:d.id}, d.data())); boardState = 'ok'; rerenderBoard();
    }, () => { clearTimeout(timer); boardState = 'error'; rerenderBoard(); });
    pushBoard(true);
  }catch(_){ boardState = 'none'; }
}
function rerenderBoard(){ if (!$('#panel').hidden && tab === 'ret') renderPanel(); }
async function pushBoard(force){
  if (!DB || !ME || boardState === 'readonly') return;
  const wk = weekKey(); if (S.wk !== wk){ S.wk = wk; S.wkNoAb = 0; }
  const body = {best:S.best, kills:S.totalKills, ach:Object.keys(S.ach).length, quiz:S.quiz.ok, diag:S.diag.ok, story:!!S.storyDone, wk, wkNoAb:S.wkNoAb || 0};
  const j = JSON.stringify(body); if (j === lastBoard) return;
  if (!force && Date.now() - boardT < 30000) return; // como mucho una escritura cada 30 s
  boardT = Date.now(); lastBoard = j;
  try{ await DB.doc('board/' + ME).set(body); }catch(e){ if (e && e.code === 'invalid_argument'){ boardState = 'readonly'; rerenderBoard(); } }
}
function boardHtml(){
  let h = `<div class="nb">${ico('board')}${tr('Tablón de la clase')}</div>`;
  if (boardState === 'none' || boardState === 'off') return h + `<p class="lead">${tr('El tablón compartido solo funciona en la página publicada y con la sesión iniciada. Comparte el enlace con tu clase para que cada alumno aparezca aquí.')}</p>`;
  if (boardState === 'loading') return h + `<p class="lead">${tr('Cargando el tablón…')}</p>`;
  if (boardState === 'slow') return h + `<p class="lead">${tr('No se puede contactar con el tablón ahora mismo. Lo intentará de nuevo solo.')}</p>`;
  if (boardState === 'error') return h + `<p class="lead">${tr('El tablón no está disponible en esta visita.')}</p>`;
  const wk = weekKey(), total = boardDocs.filter(d => d.wk === wk).reduce((a, d) => a + (+d.wkNoAb || 0), 0);
  h += `<div class="org daily">${vesicle('board', 0x4dffa0)}<h4>${tr('Reto de la clase esta semana')}</h4><p>${tr('Entre todos: vencer {g} bacterias sin usar antibióticos.', {g:CLASS_GOAL})}</p>
    <div class="meter"><i style="width:${Math.min(100, total/CLASS_GOAL*100)}%"></i></div><div class="eff">${total} / ${CLASS_GOAL}</div></div>`;
  const rows = boardDocs.slice().sort((a, b) => (b.best - a.best) || (b.kills - a.kills)).slice(0, 30);
  h += `<ol class="board">${rows.map(d => `<li class="${d.id === ME ? 'me' : ''}"><span class="who" data-uid="${esc(d.id)}">…</span><span class="num">${tr('Nv')} ${+d.best || 1}</span><span class="num">${+d.kills || 0} ${tr('vict.')}</span><span class="num">${+d.ach || 0} ★</span></li>`).join('') || `<li>${tr('Todavía no hay nadie. ¡Sé el primero!')}</li>`}</ol>`;
  if (boardState === 'readonly') h += `<p class="hint">${tr('Puedes ver el tablón, pero no tienes permiso para aparecer en él.')}</p>`;
  else h += `<p class="hint">${tr('Tus datos se publican solos al jugar: nivel, victorias, logros y diagnósticos. Solo tú puedes cambiar tu fila.')}</p>`;
  return h;
}
function fillBoardNames(){
  if (!USER) return;
  const els = [...document.querySelectorAll('#pBody [data-uid]')]; if (!els.length) return;
  USER.profiles(els.map(e => e.dataset.uid)).then(ps => els.forEach(e => { const p = ps[e.dataset.uid]; e.textContent = (p && p.name || tr('Alguien')) + (e.dataset.uid === ME ? ' (' + tr('tú') + ')' : ''); }));
}


// ---- Ventana de hito (nivel 30, 40…) ----
function showMilestone(m, then){
  sfx.ach(); ring(P_POS, 0xffc65c, 6, 1400);
  showModal(`<div class="curio">${vesicle('trophy', 0xffc65c)}<div><div class="eyebrow">${tr('Hito')} · ${tr('Nivel')} ${m.L}</div><h2>${esc(m.t)}</h2>
    ${m.d ? `<p>${esc(m.d)}</p>` : ''}<p class="cw"><b>${esc(m.r)}</b></p>
    <div class="row"><button class="go" id="mGo">${tr('Seguir')}</button>${m.L === 30 ? `<button class="ghost" id="msLab">${tr('Ver orgánulos avanzados')}</button>` : ''}</div></div></div>`, then);
  const b = $('#msLab'); if (b) b.onclick = () => { closeModal(); openLab('mej'); };
  save(); renderHud();
}
