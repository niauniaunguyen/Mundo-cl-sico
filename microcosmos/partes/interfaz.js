/* =====================================================================
   INTERFAZ
   ===================================================================== */
const IC = {
  cell:'<path d="M12.5 3.2c3.6.3 7.6 2.6 7.9 6.6.3 3.7-1.4 5.3-1.6 7.6-.3 2.7-3.3 3.9-6.3 3.4-3.2-.5-4.5-2.6-6.8-3.4C3.3 16.6 3 13.4 3.8 10.7 5 6.4 8.6 2.9 12.5 3.2z"/><path d="M9.2 11.4c.2-1.6 1.6-2.6 3.1-2.4 1.6.2 2.6 1.5 2.4 3-.2 1.6-1.7 2.5-3.2 2.3-1.4-.2-2.5-1.4-2.3-2.9z"/><circle cx="16.6" cy="15.6" r=".8"/><circle cx="7.4" cy="8.2" r=".7"/>',
  atp:'<path d="M2.8 10.2l2.4-1.4 2.4 1.4V13l-2.4 1.4L2.8 13z"/><path d="M7.6 11.6h1.6l.7 2.1-1.5 1.1-1.5-1.1"/><path d="M10 12.4h.9"/><circle cx="13" cy="12.4" r="1.9"/><circle cx="17" cy="12.4" r="1.9"/><circle cx="21" cy="12.4" r="1.9"/><path d="M14.9 12.4h.2M18.9 12.4h.2"/>',
  dna:'<path d="M7 3c0 4.5 10 4.5 10 9s-10 4.5-10 9M17 3c0 4.5-10 4.5-10 9s10 4.5 10 9"/><path d="M8.6 6h6.8M10 9h4M10 15h4M8.6 18h6.8"/>',
  memo:'<path d="M12 21v-7M12 14L7 8.5M12 14l5-5.5M5.6 10l2.8-2.8M15.6 7.2l2.8 2.8"/><path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9"/><path d="M18.4 2.8v3.6h-3.6"/>',
  adv:'<path d="M3.5 12h12M11.5 7.5l4.5 4.5-4.5 4.5"/><circle cx="20" cy="5" r="1"/><circle cx="20" cy="9.7" r="1"/><circle cx="20" cy="14.3" r="1"/><circle cx="20" cy="19" r="1"/>',
  snd:'<path d="M4 9.5v5h3.5l4.5 4V5.5l-4.5 4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.5a8 8 0 0 1 0 11"/>',
  flask:'<path d="M9 3h6M10 3v6.2L4.6 18.4A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.6L14 9.2V3"/><path d="M6.8 15h10.4"/><circle cx="10.5" cy="17.8" r=".9"/><circle cx="13.8" cy="18.3" r=".6"/>',
  pipette:'<path d="M14.5 3.5l6 6M17.5 6.5l-9.8 9.8-1.2 3.7 3.7-1.2 9.8-9.8"/><path d="M4.5 19.5l2-2"/><path d="M10.2 13.8l2.1 2.1"/>',
  slide:'<rect x="2.5" y="7" width="19" height="10" rx="1.4"/><path d="M8.5 7v10"/><path d="M4 9.5l3 0M4 11.5h3"/><circle cx="15" cy="12" r="2.6"/><circle cx="15" cy="12" r=".7"/>',
  mito:'<path d="M3.4 12c0-3.4 3.8-5.6 8.6-5.6s8.6 2.2 8.6 5.6-3.8 5.6-8.6 5.6S3.4 15.4 3.4 12z"/><path d="M6.2 12c.9-2.4 1.5 2.4 2.7 0s1.5 2.4 2.7 0 1.5 2.4 2.7 0 1.5 2.4 2.7 0 1 1.3 1.6.4"/>',
  x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  map:'<circle cx="12" cy="4.6" r="2.3"/><path d="M8 9.2c0-1 1-1.8 2-1.8h4c1 0 2 .8 2 1.8v5.3h-2V21h-4v-6.5H8z"/><circle cx="12" cy="11.5" r="1.4"/><path d="M18.5 15.5c1.2 1.4 2 2.4 2 3.4a2 2 0 0 1-4 0c0-1 .8-2 2-3.4z"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5c0 3 1.5 4.5 3.7 4.6M16 6h3.5c0 3-1.5 4.5-3.7 4.6"/><path d="M12 13v4M8.5 20.5h7M10 17h4v3.5h-4z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.9 1.9M16.6 16.6l1.9 1.9M5.5 18.5l1.9-1.9M16.6 7.4l1.9-1.9"/>',
  log:'<path d="M5 4h11l3 3v13H5z"/><path d="M8 9h8M8 12.5h8M8 16h5"/>',
  fago:'<path d="M12 3.8c4.5 0 8.2 3.5 8.2 8.2 0 2.5-1.2 3.6-2.6 3.2-1.4-.4-1.2-2.5-3-3.2"/><path d="M12 3.8C7.4 3.8 3.8 7.4 3.8 12s3.6 8.2 8.2 8.2c2.2 0 4.2-.8 5.5-2.2"/><circle cx="15.2" cy="16" r="1.9"/><path d="M8.2 11.2c.1-1.3 1.2-2.2 2.5-2.1 1.3.1 2.2 1.2 2.1 2.5-.1 1.3-1.3 2.2-2.6 2-1.2-.1-2.1-1.2-2-2.4z"/>',
  lis:'<path d="M11.5 12l-5.2-3.8a6.5 6.5 0 1 0 0 7.6z"/><circle cx="7.4" cy="9.6" r=".7"/><path d="M14.5 10.6l1.4-.8 1.4.8v1.6l-1.4.8-1.4-.8z"/><path d="M19.2 11.4l1.4-.8 1.4.8V13l-1.4.8-1.4-.8z"/>',
  pen:'<g transform="rotate(-38 12 12)"><rect x="3" y="8.3" width="18" height="7.4" rx="3.7"/><path d="M12 8.3v7.4"/></g>',
  uv:'<circle cx="9" cy="9" r="3"/><path d="M9 2.6v1.6M9 13.8v1.6M2.6 9h1.6M13.8 9h1.6M4.5 4.5l1.1 1.1M12.4 12.4l1.1 1.1M4.5 13.5l1.1-1.1M12.4 5.6l1.1-1.1"/><path d="M11.5 20c1-1.3 2-1.3 3 0s2 1.3 3 0 2-1.3 3 0"/>',
  ac:'<path d="M12 21v-7.5M12 13.5L6.5 7M12 13.5L17.5 7M4.4 9.2l3-3M16.6 6.2l3 3"/><circle cx="12" cy="17" r=".8"/>',
  anf:'<path d="M3 8.5h6.5M14.5 8.5H21M3 15.5h6.5M14.5 15.5H21"/><path d="M9.5 6v12M14.5 6v12"/><path d="M12 10v4"/><circle cx="5" cy="5.5" r="1.1"/><circle cx="19" cy="18.5" r="1.1"/>',
  osm:'<path d="M12 3c3 4.2 5.6 7 5.6 10.2a5.6 5.6 0 0 1-11.2 0C6.4 10 9 7.2 12 3z"/><path d="M12 10.5v5.5M9.8 14l2.2 2.2 2.2-2.2"/>',
  luz:'<path d="M9.2 18h5.6M10.2 21h3.6"/><path d="M8.6 14.6a5.6 5.6 0 1 1 6.8 0c-.8.8-1 1.6-1 2.6H9.6c0-1-.2-1.8-1-2.6z"/><path d="M4 4l16 16"/>',
  cel:'<path d="M3 6h18M3 12h18M3 18h18M8 6v6M16 6v6M12 12v6M6 18v3M18 18v3"/><path d="M15 2.5l-5.5 19" stroke-dasharray="2 2.2"/>',
  tc:'<circle cx="9" cy="12" r="5.2"/><circle cx="9" cy="12" r="2"/><path d="M14.2 12h2.6M16.8 9.8v4.4"/><path d="M19 10.5l2 1.5-2 1.5"/>',
  tax:'<circle cx="4.5" cy="12" r="1.6"/><circle cx="19.5" cy="12" r="1.6"/><path d="M6.1 12h11.8M6 10.8c4-5.2 8-5.2 12 0M6 13.2c4 5.2 8 5.2 12 0"/><path d="M11 9.2v5.6M13 9.2v5.6"/>',
  aut:'<path d="M10 14V5a2 2 0 0 1 4 0v9a3.6 3.6 0 1 1-4 0z"/><path d="M12 9v7.5"/><path d="M17.5 4c1 1 1 2 0 3s-1 2 0 3M20.5 4c1 1 1 2 0 3s-1 2 0 3"/>',
  lyso:'<circle cx="12" cy="12" r="7.6"/><circle cx="12" cy="12" r="6"/><circle cx="10" cy="10" r="1"/><circle cx="14.2" cy="11" r="1"/><circle cx="11" cy="14.6" r="1"/><circle cx="15" cy="15" r=".7"/>',
  bilayer:'<circle cx="5" cy="5" r="1.6"/><circle cx="10" cy="5" r="1.6"/><circle cx="15" cy="5" r="1.6"/><circle cx="20" cy="5" r="1.6"/><circle cx="5" cy="19" r="1.6"/><circle cx="10" cy="19" r="1.6"/><circle cx="15" cy="19" r="1.6"/><circle cx="20" cy="19" r="1.6"/><path d="M4.4 6.6v4M5.6 6.6v4M9.4 6.6v4M10.6 6.6v4M14.4 6.6v4M15.6 6.6v4M19.4 6.6v4M20.6 6.6v4M4.4 13.4v4M5.6 13.4v4M9.4 13.4v4M10.6 13.4v4M14.4 13.4v4M15.6 13.4v4M19.4 13.4v4M20.6 13.4v4"/>',
  cyto:'<path d="M3 5c6 2 12 12 18 14M3 19c6-2 12-12 18-14M12 3v18M3 12h18"/>',
  ribo:'<ellipse cx="12" cy="15.2" rx="7" ry="4.3"/><ellipse cx="12" cy="8.2" rx="4.6" ry="3"/><path d="M2.5 12.4c3 0 4-1.4 6-1.4s3 1.4 6 1.4 4.5-1 7-1"/>',
  signal:'<path d="M2.5 12h4l2-5.5 3.5 11 2.5-6.5 1.5 1h5.5"/>',
};
const ico = (n, cls='ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;
const hex = c => '#' + c.toString(16).padStart(6, '0');
const rgba = (c, a) => `rgba(${c >> 16 & 255},${c >> 8 & 255},${c & 255},${a})`;
const prep = id => String(TYPE_ORDER.indexOf(id) + 1).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c]));
const UPG_IC = {fue:'lyso', mem:'bilayer', cit:'cyto', rib:'ribo', mit:'mito', ref:'signal'};
const UPG_COL = {fue:0xd8ff6b, mem:0x58c8ff, cit:0x8fd3ff, rib:0xff9fd8, mit:0xff7a4a, ref:0xffc65c};
// símbolos de eficacia: no dependen solo del color
const SYM = {great:'▲▲', ok:'●', bad:'▼', none:'✕', unk:'?'};
const badge = (v, txt) => `<span class="badge ${v}" aria-label="${esc(verdictWord(v))}"><b aria-hidden="true">${SYM[v]}</b>${txt}</span>`;
const verdictWord = v => ({great:tr('Muy eficaz'), ok:tr('Eficaz'), bad:tr('Poco eficaz'), none:tr('No le afecta'), unk:tr('Sin probar')}[v]);
function vesicle(icon, col, extra=''){
  return `<span class="ves" style="--c:${hex(col)};--c1:${rgba(col,.38)};--c2:${rgba(col,.1)};--c3:${rgba(col,.7)}">${ico(icon)}${extra}</span>`;
}
function fov(id, cls='', scale=''){
  const src = thumb(id);
  return `<div class="fov ${cls}">${src ? `<img src="${src}" alt="">` : ''}${scale ? `<span class="fovscale">${scale}</span>` : ''}</div>`;
}
function copyText(txt, ta){
  const done = () => toast(tr('Copiado al portapapeles'));
  try{ navigator.clipboard.writeText(txt).then(done, () => { if (ta){ ta.focus(); ta.select(); } toast(tr('Selecciona el texto y cópialo')); }); }
  catch(_){ if (ta){ ta.focus(); ta.select(); } toast(tr('Selecciona el texto y cópialo')); }
}
// textos fijos del HTML
function applyStatic(){
  document.querySelectorAll('[data-t]').forEach(el => el.textContent = tr(el.dataset.t));
  document.querySelectorAll('[data-tt]').forEach(el => { el.title = tr(el.dataset.tt); el.setAttribute('aria-label', tr(el.dataset.tt)); });
  document.documentElement.lang = LANG;
}
document.querySelectorAll('[data-ic]').forEach(s => s.innerHTML = ico(s.dataset.ic));

function setMsg(v, head, txt, extra=''){
  const m = $('#msg'); m.className = 'v-' + v;
  $('#msgV').textContent = head; $('#msgT').textContent = txt; $('#msgX').textContent = extra;
  if (typeof placeNarr === 'function') placeNarr();
}
let toastT;
function toast(t){ const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => el.hidden = true, 3200); }
// tarjeta de logro con su dato curioso
// Aviso de logro: dice por qué lo has conseguido; al pulsarlo, se abre la curiosidad que has ganado
let achBusy = false, achT = null, achCur = null;
function showAchQueue(){
  if (achBusy || !achQueue.length) return;
  const q = achQueue.shift(), a = ACH.find(x => x.id === q.id); if (!a) return showAchQueue(); achBusy = true; achCur = a.id; sfx.ach();
  const el = $('#achc');
  el.innerHTML = `${vesicle('trophy', 0xffc65c)}<span class="at"><span class="eyebrow">${tr('Logro conseguido')} · +${fmt(q.g)} ATP</span><b>${esc(a.n)}</b><span class="why">${esc(tr(ACH_WHY[a.id]))}</span>
    <span class="cta">${tr('Has ganado una curiosidad: pulsa para descubrirla')}</span></span>`;
  el.hidden = false;
  clearTimeout(achT); achT = setTimeout(hideAch, 8000);
}
function hideAch(){ $('#achc').hidden = true; achBusy = false; achCur = null; showAchQueue(); }
function showCurio(id){
  const a = ACH.find(x => x.id === id); if (!a) return;
  S.achSeen[id] = true; save(); renderHud();
  if (!$('#modal').hidden){ openLab('ret'); return; } // no tapar una ventana abierta (por ejemplo, el cuestionario)
  showModal(`<div class="curio">${vesicle('trophy', 0xffc65c)}<div><div class="eyebrow">${tr('Curiosidad')} · ${esc(a.n)}</div>
    <p class="cw">${esc(tr(ACH_WHY[id]))}</p><p class="cf">${esc(a.f)}</p><button class="go" id="mGo">${tr('Seguir')}</button></div></div>`);
}
$('#achc').addEventListener('click', () => { const id = achCur; clearTimeout(achT); $('#achc').hidden = true; achBusy = false; achCur = null; if (id) showCurio(id); showAchQueue(); });
const unseenCurios = () => Object.keys(S.ach).filter(id => !S.achSeen[id]).length;
// Evento del combate: color de ambiente en la escena
function setEventFx(ev){ const app = $('#app'); [...app.classList].filter(c => c.startsWith('ev-')).forEach(c => app.classList.remove(c)); if (ev) app.classList.add('ev-' + ev); }
// título de jefe especial
function cinematic(eyebrow, title, then){
  const c = $('#cine'); c.querySelector('.ce').textContent = eyebrow; c.querySelector('.ct').textContent = title; c.hidden = false;
  // espera a que la escena ya se esté dibujando (el primer fotograma puede tardar mientras se compilan los shaders)
  const f0 = FRAME, run = () => FRAME > f0 + 3 ? tween(2400, p => CINE = Math.sin(Math.min(1, p*1.15)*Math.PI), () => { CINE = 0; c.hidden = true; then && then(); }) : requestAnimationFrame(run);
  run();
}
function renderLog(){
  const el = $('#log'); el.hidden = !(S.auto && canAuto()) || !LOG.length;
  el.innerHTML = `<div class="lh">${ico('log')}${tr('Registro')}</div>` + LOG.slice(0, 6).map(l =>
    `<div class="${l.win ? '' : 'lose'}"><span class="num">${tr('Nv')} ${l.L}</span> ${esc(l.n)} · ${l.turns} ${tr('t.')} · ${l.win ? '+' + fmt(l.g) + ' ATP' : tr('derrota')}</div>`).join('');
}

function renderHud(){
  const ch = storyCh();
  $('#hLvlK').textContent = ch ? tr('Capítulo') : tr('Nivel');
  $('#hLvl').textContent = ch ? `${S.story.ch + 1}/${STORY.length}` : S.level;
  let h = '';
  if (ch) ch.battles.forEach((b, i) => h += `<span class="pip ${i < S.story.step ? 'on' : ''} ${b === '@sepsis' ? 'boss' : ''}"></span>`);
  else { for (let i=0;i<KPL;i++) h += `<span class="pip ${i < S.kills ? 'on' : ''}"></span>`;
    h += `<span class="pip boss ${B && B.e.boss ? 'on' : ''}" title="${tr('Jefe')}"></span>`; }
  $('#bStory').setAttribute('aria-pressed', !!ch);
  $('#hPips').innerHTML = h;
  $('#hAtp').textContent = fmt(S.atp);
  const r = atps(); $('#hAtps').textContent = r > 0 ? `+${fmt(r)}/s` : '';
  $('#hAdnBox').hidden = !(S.adn > 0 || S.evos > 0); $('#hAdn').textContent = fmt(S.adn);
  const bA = $('#bAuto'); bA.setAttribute('aria-pressed', S.auto && canAuto()); bA.disabled = !canAuto();
  bA.title = canAuto() ? tr('Combate automático: usa la mejor herramienta que ya hayas probado contra cada organismo') : tr('Compra «Memoria inmunitaria» en el laboratorio para desbloquearlo');
  bA.querySelector('.lbl').textContent = S.auto && canAuto() ? `${tr('Auto')} ×${dec(speed().toFixed(1))}` : tr('Auto');
  $('#bAdv').setAttribute('aria-pressed', S.advance);
  $('#bSnd').setAttribute('aria-pressed', S.sound);
  $('#bMap').querySelector('.lbl').textContent = ZONES[S.zone].n;
  $('#pAtp').innerHTML = S.clase ? tr('Modo clase') : ico('atp') + fmt(S.atp);
  $('#labDot').hidden = !anyAffordable();
  $('#bLab').setAttribute('aria-expanded', !$('#panel').hidden);
  const uc = unseenCurios(); $('#retDot').hidden = !uc;
  $('#app').classList.toggle('big', !!S.big); $('#app').classList.toggle('calm', !!S.calm);
}
function anyAffordable(){
  if (S.clase) return false;
  if (!S.memoria && S.atp >= 50) return true;
  if (TOOLS.some(t => !S.tools[t.id] && S.atp >= t.cost)) return true;
  return UPG.some(u => (u.max == null || S.upg[u.id] < u.max) && S.atp >= upgCost(u));
}

function renderFoe(){
  if (!B) return;
  const e = B.e, Ty = TYPES[e.type];
  $('#fEye').textContent = `${tr('Prep. nº')} ${prep(e.type)} · ${e.special >= 0 ? tr('Jefe especial') : e.boss ? tr('Jefe') : tr('nivel') + ' ' + e.L}${e.phase === 2 ? ' · ' + tr('fase 2') : ''}`;
  $('#fStain').textContent = LAB[e.type][0];
  $('#fName').textContent = foeName(e);
  $('#fSci').textContent = Ty.sci;
  $('#fBar').style.width = (e.hp/e.max*100) + '%';
  $('#fHp').textContent = `${fmt(Math.ceil(e.hp))} / ${fmt(e.max)}`;
  $('#fSize').textContent = LAB[e.type][1];
  $('#fAtk').textContent = `${tr('ataque')} ${fmt(e.atk*e.grow)}`;
  const tags = B.why ? KEYTRAIT[B.why.tool] || [] : [];
  let t = Ty.traits.map(([x, tag]) => `<span class="trait ${tags.includes(tag) ? 'why' : ''}">${esc(x)}</span>`).join('');
  if (e.res) t += `<span class="trait st ${B.why && B.why.tool === 'pen' ? 'why' : ''}">${tr('Resistente a β-lactámicos')}</span>`;
  if (e.hidden) t += `<span class="trait st ${B.why ? 'why' : ''}">${tr('Dentro de una célula')}</span>`;
  if (e.spore) t += `<span class="trait st ${B.why ? 'why' : ''}">${tr('Endospora')}</span>`;
  if (e.biofilm) t += `<span class="trait st">${tr('Biopelícula')}</span>`;
  if (e.drift) t += `<span class="trait st">${tr('Deriva antigénica')} ×${e.drift}</span>`;
  if (e.dark) t += `<span class="trait good">${tr('A oscuras')}</span>`;
  if (e.marked > 0) t += `<span class="trait good">${tr('Opsonizado')} · ${Math.min(3, e.marked)}</span>`;
  if (e.block > 0) t += `<span class="trait good">${tr('Mitosis bloqueada')}</span>`;
  if (e.grow > 1) t += `<span class="trait st">${tr('Ataque')} ×${dec(e.grow.toFixed(2))}</span>`;
  $('#fTraits').innerHTML = t;
  const ev = $('#fEvt');
  if (e.ev){ const U = EVENT_UI[e.ev], open = ev.dataset.ev === e.ev && ev.dataset.open === '1';
    if (ev.dataset.ev !== e.ev){ ev.classList.remove('flash'); void ev.offsetWidth; ev.classList.add('flash'); }
    ev.dataset.ev = e.ev; ev.style.setProperty('--ec', hex(U.col));
    ev.innerHTML = `${vesicle(U.ic, U.col)}<span class="et"><span class="eyebrow">${tr('Evento del combate')}</span><b>${esc(EVENTS[e.ev].n)}</b><span class="fx">${esc(tr(U.fx))}</span>
      ${open ? `<span class="ed">${esc(EVENTS[e.ev].d)}</span>` : ''}</span><span class="ei" aria-hidden="true">${open ? '−' : '?'}</span>`;
    ev.setAttribute('aria-expanded', open); ev.hidden = false;
  } else { ev.hidden = true; ev.dataset.ev = ''; ev.dataset.open = ''; }
  // si la ficha cambia de alto (estados nuevos), reencuadra la escena para que no tape al organismo
  if ($('#foe').offsetHeight !== lastFoeH) resize();
}
$('#fEvt').addEventListener('click', () => { const ev = $('#fEvt'); ev.dataset.open = ev.dataset.open === '1' ? '' : '1'; renderFoe(); resize(); });
function renderMe(){
  if (!B) return;
  const m = maxHp();
  $('#meName').textContent = cellD().n; $('#meSize').textContent = cellD().size;
  $('#mBar').style.width = (B.php/m*100) + '%';
  $('#mHp').textContent = `${fmt(Math.ceil(B.php))} / ${fmt(m)}`;
  $('#mAtk').textContent = `${tr('ataque')} ${fmt(atk())}`;
}
function renderTools(){
  const nav = $('#tools'), e = B && B.e;
  nav.innerHTML = TOOLS.filter(t => owns(t.id)).map(T => {
    const cd = B ? (B.cds[T.id] || 0) : 0;
    const left = Math.max(1, cd - (B && B.busy ? 1 : 0)); // turnos que faltan
    let bd = badge('unk', '');
    if (e && S.known[e.type] && S.known[e.type][T.id]){
      const r = eff(T.id, e, {known:true});
      if (T.id === 'luz') bd = r.m > 0 ? (e.dark ? badge('bad', tr('hecho')) : badge('great', tr('útil'))) : badge('none', '×0');
      else { const [v] = verdict(r.m); bd = badge(v, `×${dec(Math.round(r.m*100)/100)}`); }
    }
    const ring = cd > 0 ? `<span class="cdr" style="--p:${Math.min(1, left/(T.cd + 1))}"></span><span class="cdn num">${left}</span>` : '';
    return `<button class="tool" style="--c:${hex(T.col)}" data-tool="${T.id}" ${cd > 0 || !B || B.busy || B.over ? 'disabled' : ''} title="${esc(T.n + ': ' + T.d)}" aria-label="${esc(T.n)}${cd > 0 ? ', ' + tr('recargando {n} turnos', {n:left}) : ''}">
      ${vesicle(T.id, T.col, ring)}<span class="tn">${T.n}</span>
      <span class="tm"><span class="rc">${T.cd ? tr('recarga {n}', {n:T.cd}) : tr('sin recarga')}</span>${bd}</span></button>`;
  }).join('');
  document.documentElement.style.setProperty('--toolsH', nav.offsetHeight + 'px');
}
$('#tools').addEventListener('click', ev => { const b = ev.target.closest('[data-tool]'); if (b) useTool(b.dataset.tool); });

// ---- Laboratorio ----
let tab = 'mej';
function openLab(t){ if (t) tab = t; $('#panel').hidden = false; renderPanel(); }
function closeLab(){ $('#panel').hidden = true; if ($('#bLab')) $('#bLab').setAttribute('aria-expanded', false); }
$('#bLab').onclick = () => { $('#panel').hidden ? openLab() : closeLab(); renderHud(); };
$('#pClose').onclick = closeLab;
document.querySelectorAll('.tab').forEach(b => b.onclick = () => { tab = b.dataset.tab; renderPanel(); $('#pBody').scrollTop = 0; });
$('.tabs').addEventListener('keydown', ev => { // flechas entre pestañas
  if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
  const tabs = [...document.querySelectorAll('.tab')], i = tabs.findIndex(b => b.dataset.tab === tab);
  const n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; tab = n.dataset.tab; renderPanel(); n.focus();
});

const buyBtn = (attrs, cost) => `<button class="buy" ${attrs} data-cost="${cost}">${ico('atp')}${fmt(cost)}</button>`;
function granules(n, max){
  const shown = Math.min(n, 10), cap = max ? Math.min(max, 10) : 10;
  let h = `<span class="gran" aria-label="${tr('nivel')} ${n}">`;
  for (let i=0;i<cap;i++) h += `<i class="${i < shown ? 'on' : ''}"></i>`;
  if (n > 10) h += `<small>+${n - 10}</small>`;
  return h + '</span>';
}
function phylo(){
  const n = Math.min(S.evos, 12), W = 320, H = 120, x0 = 18, x1 = W - 44, y = H/2;
  let s = `<svg class="phylo" viewBox="0 0 ${W} ${H}" role="img" aria-label="${tr('Árbol de tu linaje: {n} evoluciones', {n:S.evos})}">`;
  s += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" class="tr"/>`;
  for (let i=0;i<n;i++){ const x = x0 + (i+1)*(x1 - x0)/(n+1), up = i % 2 ? -1 : 1, len = 22 + (i % 3)*9;
    s += `<path d="M${x.toFixed(1)} ${y} L${(x+16).toFixed(1)} ${y - up*len}" class="br"/><circle cx="${(x+16).toFixed(1)}" cy="${y - up*len}" r="3.6" class="lf"/>`; }
  s += `<circle cx="${x0}" cy="${y}" r="4.5" class="root"/><text x="${x0 - 6}" y="${y + 20}" class="tx">LUCA</text>`;
  s += `<circle cx="${x1}" cy="${y}" r="8" class="now" style="stroke:${hex(SKINS[S.skin].col)}"/><text x="${x1 + 13}" y="${y + 4}" class="tx">${tr('tú')}</text></svg>`;
  return s;
}
const toggleRow = (id, on, title, desc) => `<div class="org set"><h4>${title}</h4><p>${desc}</p><button class="sw" role="switch" aria-checked="${!!on}" data-set="${id}"><i></i></button></div>`;
function reportText(){
  const L = [];
  L.push(`Microcosmos · ${tr('Informe de partida')} · ${new Date().toLocaleDateString(LANG)}`);
  L.push(`${tr('Nivel actual')}: ${S.level} · ${tr('Récord')}: ${S.best} · ${tr('Victorias')}: ${S.totalKills}${S.clase ? ' · ' + tr('Modo clase') : ''}`);
  const seen = TYPE_ORDER.filter(id => S.seen[id]);
  L.push(`${tr('Organismos encontrados')}: ${seen.length} / ${TYPE_ORDER.length}`);
  seen.forEach(id => { const kn = S.known[id] ? TOOLS.filter(t => S.known[id][t.id]) : [];
    L.push(`  · ${TYPES[id].n}: ${kn.length ? kn.map(t => `${t.n} ×${dec(eff(t.id, {type:id}).m)}`).join(', ') : tr('sin herramientas probadas')}`); });
  const pf = S.first.n ? Math.round(S.first.ok/S.first.n*100) : 0, pq = S.quiz.n ? Math.round(S.quiz.ok/S.quiz.n*100) : 0;
  L.push(`${tr('Primer golpe «Muy eficaz»')}: ${S.first.ok} / ${S.first.n} (${pf} %)`);
  L.push(`${tr('Cuestionario')}: ${S.quiz.ok} / ${S.quiz.n} (${pq} %)`);
  L.push(`${tr('Combinaciones descubiertas')}: ${COMBOS.filter(c => S.combos[c.id]).map(c => c.n).join(', ') || '—'}`);
  L.push(`${tr('Logros')}: ${Object.keys(S.ach).length} / ${ACH.length}`);
  return L.join('\n');
}
function statsHtml(){
  const lv = Object.entries(S.stats.lvl).sort((a, b) => b[0] - a[0]).slice(0, 8);
  const de = Object.entries(S.stats.deaths).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const bu = Object.entries(S.stats.buys).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const nm = id => (TOOL[id] || UPG.find(u => u.id === id) || {n:id === 'mem0' ? tr('Memoria inmunitaria') : id}).n;
  return `<div class="stat"><span>${tr('Tiempo por nivel')}</span><span>${lv.map(([l, s]) => `${tr('Nv')} ${l}: ${s} s`).join('<br>') || '—'}</span>
    <span>${tr('Derrotas por nivel')}</span><span>${de.map(([l, n]) => `${tr('Nv')} ${l}: ${n}`).join('<br>') || '—'}</span>
    <span>${tr('Compras')}</span><span>${bu.map(([id, n]) => `${esc(nm(id))}: ${n}`).join('<br>') || '—'}</span></div>`;
}

function renderPanel(){
  document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tab));
  let h = '';
  if (tab === 'mej'){
    if (S.clase){
      h += `<div class="nb">${tr('Modo clase')}</div><p class="lead">${tr('En el modo clase no hay mejoras ni ATP: tienes todas las herramientas y tus estadísticas crecen con el nivel. Céntrate en elegir bien. Puedes practicar con cualquier organismo desde el Atlas.')}</p>`;
    } else {
      h += `<div class="nb">${tr('Cuaderno · orgánulos')}</div><p class="lead">${tr('Invierte ATP en tus orgánulos. Cada mejora cuesta más que la anterior: el crecimiento es exponencial, como el de una población de bacterias.')}</p>`;
      h += `<div class="org">${vesicle('memo', 0x4dffa0)}<h4>${tr('Memoria inmunitaria')}</h4><p>${tr('Los linfocitos B y T de memoria recuerdan cada patógeno. Desbloquea el combate automático, que usa la mejor herramienta que ya hayas probado contra cada organismo.')}</p><div class="eff">${tr('Desbloquea «Auto»')}</div>
        ${S.memoria ? `<button class="buy done" disabled>${tr('Activa')}</button>` : buyBtn('data-mem', 50)}</div>`;
      for (const u of UPG){
        const maxed = u.max != null && S.upg[u.id] >= u.max, c = upgCost(u);
        h += `<div class="org">${vesicle(UPG_IC[u.id], UPG_COL[u.id])}<h4>${u.n} ${granules(S.upg[u.id], u.max)}</h4><p>${u.d}</p><div class="eff">${u.e}</div>
          ${maxed ? `<button class="buy done" disabled>${tr('Máximo')}</button>` : buyBtn(`data-upg="${u.id}"`, c)}</div>`;
      }
    }
    h += `<div class="nb">${tr('Constantes vitales')}</div><div class="stat"><span>${tr('Célula')}</span><span>${cellD().n}</span><span>${tr('Ataque')}</span><span>${fmt(atk())}</span><span>${tr('Vida máxima')}</span><span>${fmt(maxHp())}</span><span>${tr('Daño recibido')}</span><span>${Math.round(taken()*100)} %</span><span>${tr('ATP por segundo')}</span><span>${fmt(atps())}</span><span>${tr('ATP por victoria (nivel {l})', {l:S.level})}</span><span>${fmt(reward(S.level, false))}</span></div>`;
  } else if (tab === 'her'){
    h += `<div class="nb">${tr('Cuaderno · herramientas')}</div><p class="lead">${tr('Cada herramienta aprovecha una característica concreta de un tipo de célula. Cuando uses una contra un organismo, su eficacia quedará anotada en el botón y en el Atlas.')}</p>`;
    h += `<div class="org press">${vesicle('pen', 0x4dffa0)}<h4>${tr('Presión selectiva')}</h4><p>${tr('Cada vez que usas penicilina, sobreviven las bacterias que por azar la resisten. Si abusas, aparecerán estafilococos SARM. Vencer bacterias sin antibióticos hace bajar la presión.')}</p>
      <div class="meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(S.press)}"><i style="width:${S.press}%"></i></div><div class="eff">${tr('Probabilidad de SARM')}: ${Math.round(Math.min(.6, S.press/150)*100)} %</div></div>`;
    h += `<div class="nb">${tr('Combinaciones')} · ${COMBOS.filter(c => S.combos[c.id]).length} / ${COMBOS.length}</div>`;
    h += COMBOS.map(c => S.combos[c.id]
      ? `<div class="combo">${vesicle(c.first, TOOL[c.first].col)}<span class="plus">+</span>${vesicle(c.then, TOOL[c.then].col)}<div><b>${c.n}</b> · ×${dec(c.m)}<p>${c.why}</p></div></div>`
      : `<div class="combo unk"><span class="ves q">?</span><span class="plus">+</span><span class="ves q">?</span><div><b>???</b><p>${tr('Prueba a usar dos herramientas seguidas que se complementen.')}</p></div></div>`).join('');
    h += `<div class="nb">${tr('Herramientas')}</div>`;
    for (const T of TOOLS){
      h += `<div class="org">${vesicle(T.id, T.col)}<h4>${T.n}</h4><p>${T.d}</p><div class="eff">${tr('Potencia')} ${dec(T.pow)} · ${tr('recarga')} ${T.cd ? T.cd : tr('ninguna')}</div>
        ${owns(T.id) ? `<button class="buy done" disabled>${tr('Tuya')}</button>` : buyBtn(`data-tool-buy="${T.id}"`, T.cost)}</div>`;
    }
  } else if (tab === 'atl'){
    const seen = TYPE_ORDER.filter(id => S.seen[id]).length;
    h += `<div class="nb">${tr('Caja de preparaciones')} · ${seen} / ${TYPE_ORDER.length}</div><p class="lead">${tr('Cada organismo que encuentras queda guardado como una preparación. Las herramientas aparecen cuando las has probado contra él.')}${S.clase ? ' ' + tr('En el modo clase puedes practicar con cualquiera.') : ''}</p>`;
    for (const id of TYPE_ORDER){
      const Ty = TYPES[id];
      const practice = S.clase ? `<button class="buy prac" data-prac="${id}">${tr('Practicar')}</button>` : '';
      if (!S.seen[id]){
        h += `<div class="slidecard locked"><div class="lab">${tr('Prep.')} ${prep(id)}</div><div class="fov unk">?</div><div class="txt"><h4>${tr('Sin descubrir')}</h4><div class="sci">${tr('Aparece en el nivel {l}', {l:Ty.min})}</div>${practice}</div></div>`;
        continue;
      }
      const kn = S.known[id] ? Object.keys(S.known[id]) : [];
      const chips = TOOLS.filter(t => kn.includes(t.id)).map(t => { const r = eff(t.id, {type:id}); const [v] = verdict(r.m); return badge(v, `${t.n} ×${dec(r.m)}`); }).join('');
      h += `<div class="slidecard"><div class="lab">${tr('Prep.')} ${prep(id)}</div>${fov(id, '', LAB[id][1])}<div class="txt">
        <h4 style="color:${hex(Ty.col)}">${Ty.n}</h4><div class="sci">${Ty.sci} · ${tr('vencidos')}: ${S.defeated[id] || 0}</div><div class="stain">${LAB[id][0]}</div>
        <p>${Ty.desc}</p><div class="known">${chips || badge('unk', tr('Aún no has probado nada'))}</div><div class="row"><button class="buy" data-scope="${id}">${ico('scope')}${tr('Examinar')}</button>${practice}</div></div></div>`;
    }
    h += `<div class="nb">${tr('Fuentes')}</div><ul class="refs">${SOURCES.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`;
    h += `<div class="nb">${tr('Licencias del juego')}</div><ul class="refs">${LICENSES.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`;
  } else if (tab === 'dia'){
    h += diagHtml();
  } else if (tab === 'ret'){
    ensureDaily();
    h += boardHtml();
    h += `<div class="nb">${tr('Retos de hoy')}</div><p class="lead">${tr('Cada día hay dos retos nuevos. Cada uno da 1 punto de ADN y desbloquea colores para tu célula.')}</p>`;
    h += S.daily.list.map(q => { const D = DAILY.find(x => x.id === q.id);
      return `<div class="org daily ${q.done ? 'ok' : ''}">${vesicle(q.done ? 'trophy' : 'flask', q.done ? 0x4dffa0 : 0xffc65c)}<h4>${D.n}</h4><div class="meter"><i style="width:${q.p/D.goal*100}%"></i></div><div class="eff">${q.p} / ${D.goal}${q.done ? ' · ' + tr('completado') : ''}</div></div>`; }).join('');
    h += `<div class="nb">${tr('Logros')} · ${Object.keys(S.ach).length} / ${ACH.length}</div><div class="achs">`;
    h += ACH.map(a => !S.ach[a.id] ? `<div class="ach">${ico('trophy')}<div><b>${a.n}</b><p>${tr('Cómo conseguirlo')}: ${esc(tr(ACH_GOAL[a.id]))}</p></div></div>`
      : S.achSeen[a.id] ? `<div class="ach ok">${ico('trophy')}<div><b>${a.n}</b><p class="cw">${esc(tr(ACH_WHY[a.id]))}</p><p>${a.f}</p></div></div>`
      : `<div class="ach ok new">${ico('trophy')}<div><b>${a.n}</b><p class="cw">${esc(tr(ACH_WHY[a.id]))}</p><button class="buy" data-curio="${a.id}">${tr('Descubrir curiosidad')}</button></div></div>`).join('') + '</div>';
  } else if (tab === 'evo'){
    const g = evoGain();
    h += `<div class="nb">${tr('Linaje')}</div>${phylo()}`;
    h += treeHtml();
    h += `<div class="nb">${tr('Tu tipo de célula')}</div><div class="cells">` + Object.entries(CELLS).map(([id, c]) => {
      const ok = S.evos >= c.need, sel = S.cell === id;
      return `<button class="cellc ${sel ? 'sel' : ''}" data-cell="${id}" ${ok ? '' : 'disabled'} aria-pressed="${sel}">
        <b>${c.n}</b><small>${ok ? c.size : tr('Evoluciona {n} veces', {n:c.need})}</small><span>${c.d}</span></button>`; }).join('') + '</div>';
    h += `<div class="nb">${tr('Color de fluorescencia')}</div><div class="skins">` + Object.entries(SKINS).map(([id, k]) => {
      const ok = skinUnlocked(id), n = k.need;
      const why = !n ? '' : n[0] === 'evos' ? tr('Evoluciona {n} veces', {n:n[1]}) : n[0] === 'daily' ? tr('Completa {n} retos diarios', {n:n[1]}) : tr('Consigue {n} logros', {n:n[1]});
      return `<button class="skin ${S.skin === id ? 'sel' : ''}" data-skin="${id}" ${ok ? '' : 'disabled'} style="--k:${hex(k.col)}" aria-pressed="${S.skin === id}" title="${esc(k.d)}"><i></i><b>${k.n}</b><small>${ok ? esc(k.d) : why}</small></button>`; }).join('') + '</div>';
    if (!S.clase){
      h += `<div class="nb">${tr('Evolución')}</div><p class="lead">${tr('Selección natural: al evolucionar empiezas de nuevo en el nivel 1, sin ATP ni mejoras de orgánulos, pero tu linaje hereda ADN. Cada punto de ADN da +10 % de ataque, vida y ATP para siempre. Conservas las herramientas, el Atlas y la memoria inmunitaria.')}</p>`;
      h += `<div class="stat"><span>${tr('ADN actual')}</span><span>${fmt(S.adn)} (×${dec(adnM().toFixed(1))})</span><span>${tr('Nivel máximo en esta vida')}</span><span>${S.runMax}</span><span>${tr('Récord')}</span><span>${S.best}</span><span>${tr('Evoluciones')}</span><span>${S.evos}</span><span>${tr('ADN si evolucionas ahora')}</span><span style="color:var(--gram)">+${g}</span></div>`;
      h += `<div class="org evobox">${vesicle('dna', 0xa67bff)}<h4>${tr('Evolucionar')}</h4><p>${g > 0 ? tr('Ganarás {g} de ADN. La ganancia crece con el cuadrado del nivel máximo alcanzado: (nivel ÷ 5)².', {g}) : tr('Alcanza el nivel 10 para poder evolucionar.')}</p><div class="eff" style="color:var(--gram)">+${g} ADN</div>
        <button class="buy evo" id="evoBtn" ${g > 0 ? '' : 'disabled'}>${tr('Evolucionar')}</button></div>`;
    }
  } else if (tab === 'aju'){
    h += `<div class="nb">${tr('Idioma')}</div><div class="seg" role="radiogroup">` + Object.entries(LANGS).map(([k, n]) => `<button role="radio" aria-checked="${LANG === k}" data-lang="${k}">${n}</button>`).join('') + '</div>';
    h += `<div class="nb">${tr('Aula')}</div>`;
    h += toggleRow('clase', S.clase, tr('Modo clase'), tr('Sin parte incremental: todas las herramientas desde el principio, sin ATP ni mejoras, y práctica libre con cualquier organismo. Tu progreso normal se conserva.'));
    h += `<div class="org"><h4>${tr('Informe para el profesor')}</h4><p>${tr('Resumen de lo aprendido: organismos, herramientas probadas, aciertos al primer intento y cuestionario.')}</p><textarea id="repTa" readonly rows="7">${esc(reportText())}</textarea><button class="buy" id="repBtn">${tr('Copiar informe')}</button></div>`;
    h += `<div class="nb">${tr('Narrador y sonido')}</div>`;
    h += toggleRow('narr', S.narr, tr('Narradora'), tr('La doctora Olmo, del laboratorio, comenta las jugadas importantes.'));
    h += toggleRow('voice', S.voice, tr('Leer en voz alta'), tr('La narradora lee sus comentarios en voz alta.'));
    h += toggleRow('music', S.music, tr('Música y ambiente'), tr('Paisaje sonoro de cada zona: el latido en la sangre, la respiración en los pulmones, las burbujas de la charca…'));
    h += `<div class="nb">${tr('Accesibilidad')}</div>`;
    h += toggleRow('big', S.big, tr('Texto grande'), tr('Aumenta el tamaño de los menús y las fichas.'));
    h += toggleRow('calm', S.calm, tr('Reducir efectos'), tr('Menos partículas, sin temblores de cámara y animaciones más suaves.'));
    h += `<div class="nb">${tr('Calidad gráfica')}</div><div class="seg" role="radiogroup">` + [['auto', tr('Automática')], ['2', tr('Alta')], ['1', tr('Media')], ['0', tr('Baja')]].map(([k, n]) => `<button role="radio" aria-checked="${String(S.q) === k}" data-q="${k}">${n}</button>`).join('') + '</div>';
    h += `<p class="lead">${tr('En automático, la calidad baja sola si el juego va lento.')} ${tr('Ahora')}: ${[tr('Baja'), tr('Media'), tr('Alta')][QL]}.</p>`;
    h += `<div class="nb">${tr('Guardar partida')}</div><div class="org"><h4>${tr('Código de partida')}</h4><p>${tr('Tu progreso solo se guarda en este navegador. Copia este código para guardarlo o llevarlo a otro dispositivo.')}</p>
      <textarea id="expTa" readonly rows="3">${exportCode()}</textarea><button class="buy" id="expBtn">${tr('Copiar código')}</button></div>`;
    h += `<div class="org"><h4>${tr('Cargar partida')}</h4><p>${tr('Pega un código de partida. Sustituirá a la partida actual.')}</p><textarea id="impTa" rows="3" placeholder="${tr('Pega aquí el código')}"></textarea><button class="buy" id="impBtn">${tr('Cargar')}</button></div>`;
    h += `<div class="nb">${tr('Datos de partida')}</div><p class="lead">${tr('Sirven para ajustar el equilibrio del juego: dónde se tarda más, dónde se pierde y qué se compra. No salen de este navegador salvo que los copies.')}</p>${statsHtml()}
      <button class="buy wide" id="statBtn">${tr('Copiar datos')}</button>`;
    h += `<div class="nb">${tr('Partida')}</div><div class="org">${vesicle('x', 0xff4f7b)}<h4>${tr('Borrar partida')}</h4><p>${tr('Empieza desde cero: se pierde todo, también el ADN y el Atlas.')}</p><button class="buy danger" id="wipeBtn">${tr('Borrar')}</button></div>`;
  }
  $('#pBody').innerHTML = h;
  refreshAfford();
  if (tab === 'ret') fillBoardNames();
}
function refreshAfford(){
  document.querySelectorAll('#pBody [data-cost]').forEach(b => b.disabled = S.atp < +b.dataset.cost);
}
$('#pBody').addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b || b.disabled) return;
  if (tab === 'dia' && diagClick(b)) return;
  if (b.dataset.scope){ openScope(b.dataset.scope); return; }
  if (b.dataset.curio){ S.achSeen[b.dataset.curio] = true; save(); renderPanel(); renderHud(); return; }
  if (b.dataset.node){ const n = TREE_NODES[b.dataset.node]; if (treeFree() >= n.cost && (!n.prev || has(n.prev))){ S.tree[n.id] = true; sfx.buy(); } save(); renderPanel(); renderTools(); return; }
  if (b.id === 'treeReset'){ S.tree = {}; save(); renderPanel(); renderTools(); return; }
  const buy = id => { S.stats.buys[id] = (S.stats.buys[id] || 0) + 1; sfx.buy(); };
  if (b.dataset.upg){ const u = UPG.find(x => x.id === b.dataset.upg), c = upgCost(u); if (S.atp < c) return; S.atp -= c; S.upg[u.id]++; if (u.id === 'mem' && B) B.php += maxHp() - maxHp()/1.15; buy(u.id); }
  else if (b.dataset.toolBuy){ const T = TOOL[b.dataset.toolBuy]; if (S.atp < T.cost) return; S.atp -= T.cost; S.tools[T.id] = true; buy(T.id); toast(tr('Nueva herramienta: {n}', {n:T.n})); renderTools(); }
  else if (b.hasAttribute('data-mem')){ if (S.atp < 50) return; S.atp -= 50; S.memoria = true; buy('mem0'); toast(tr('Memoria inmunitaria: ya puedes activar «Auto».')); }
  else if (b.dataset.prac){ S.practice = b.dataset.prac; closeLab(); if (B){ B.over = true; clearTimeout(B.timer); } newBattle(); return; }
  else if (b.dataset.cell){ S.cell = b.dataset.cell; rebuildPlayer(); if (B) B.php = Math.min(B.php, maxHp()); renderMe(); }
  else if (b.dataset.skin){ S.skin = b.dataset.skin; rebuildPlayer(); }
  else if (b.dataset.lang){ setLang(b.dataset.lang); }
  else if (b.dataset.q){ S.q = b.dataset.q === 'auto' ? 'auto' : +b.dataset.q; applyQuality(S.q === 'auto' ? 2 : S.q); }
  else if (b.dataset.set){ const k = b.dataset.set; S[k] = !S[k];
    if (k === 'music' || k === 'voice') ambient(storyCh() ? storyCh().zone : S.zone);
    if (k === 'clase'){ if (B){ B.over = true; clearTimeout(B.timer); } S.auto = S.auto && canAuto(); renderTools(); newBattle(); toast(S.clase ? tr('Modo clase activado') : tr('Modo clase desactivado')); } }
  else if (b.id === 'repBtn') return copyText(reportText(), $('#repTa'));
  else if (b.id === 'expBtn') return copyText(exportCode(), $('#expTa'));
  else if (b.id === 'statBtn') return copyText(JSON.stringify({stats:S.stats, level:S.level, best:S.best, evos:S.evos, first:S.first, quiz:S.quiz}, null, 1));
  else if (b.id === 'impBtn'){
    if (!importCode($('#impTa').value)) return toast(tr('El código no es válido'));
    if (B){ B.over = true; clearTimeout(B.timer); } save(); setLang(S.lang || LANG); rebuildPlayer(); closeLab(); renderHud(); newBattle(); toast(tr('Partida cargada')); return;
  }
  else if (b.id === 'evoBtn'){
    if (b.dataset.sure){ evolve(); return; }
    b.dataset.sure = '1'; b.textContent = tr('¿Seguro? Confirmar'); return;
  } else if (b.id === 'wipeBtn'){
    if (b.dataset.sure){ if (B){ B.over = true; clearTimeout(B.timer); } try{ localStorage.removeItem(SAVE_KEY); }catch(_){} const l = LANG; S = fresh(); S.lang = l; rebuildPlayer(); closeLab(); renderHud(); showIntro(newBattle); return; }
    b.dataset.sure = '1'; b.textContent = tr('Confirmar borrado'); return;
  } else return;
  save(); renderHud(); renderMe(); renderPanel();
});
function evolve(){
  const g = evoGain(); if (!g) return;
  if (B){ B.over = true; clearTimeout(B.timer); }
  S.adn += g; S.evos++; S.lpts += 2;
  S.level = 1; S.kills = 0; S.runMax = 1; S.atp = 0; S.advance = true; S.press = 0; S.stats.lvlStart = Date.now();
  for (const k in S.upg) S.upg[k] = 0;
  checkAch(); rebuildPlayer(); save(); closeLab(); renderHud();
  const unlocked = Object.entries(CELLS).filter(([, c]) => c.need === S.evos).map(([, c]) => c.n);
  showModal(`<div class="intro"><div class="fov big">${thumb('me') ? `<img src="${thumb('me')}" alt="">` : ''}</div><div>
    <div class="eyebrow" style="color:var(--gram)">${tr('Evolución {n}', {n:S.evos})}</div><h2>${tr('Tu linaje hereda {g} de ADN', {g})}</h2>
    <p>${tr('Ahora tienes {a} de ADN: ×{m} de ataque, vida y ATP. Vuelves al nivel 1 con las herramientas y todo lo que has aprendido.', {a:S.adn, m:dec(adnM().toFixed(1))})}</p>
    ${unlocked.length ? `<p><b>${tr('Nueva célula disponible: {n}.', {n:unlocked.join(', ')})}</b> ${tr('Elígela en la pestaña Evolución.')}</p>` : ''}</div></div>
    ${phylo()}<button class="go" id="mGo">${tr('Seguir')}</button>`, () => newBattle());
}

$('#bAuto').onclick = () => { if (!canAuto()) return; S.auto = !S.auto; save(); renderHud(); renderLog(); scheduleAuto(); };
$('#bAdv').onclick = () => { S.advance = !S.advance; save(); renderHud(); };
$('#bSnd').onclick = () => { S.sound = !S.sound; if (!S.sound) stopMusic(); save(); renderHud(); };
$('#bMap').onclick = () => showMap();
window.addEventListener('keydown', ev => {
  if (ev.key === 'Escape'){ if (!$('#panel').hidden) closeLab(); }
  if (ev.target && /TEXTAREA|INPUT/.test(ev.target.tagName)) return;
  const n = parseInt(ev.key, 10);
  if (n >= 1 && n <= 9 && $('#modal').hidden){ const owned = TOOLS.filter(t => owns(t.id)); if (owned[n-1]) useTool(owned[n-1].id); }
});

// ---- Ventanas ----
let modalDone = null;
function showModal(html, done){
  $('#mBox').innerHTML = html; $('#modal').hidden = false; $('#mBox').scrollTop = 0; modalDone = done || null;
  const g = $('#mGo'); if (g){ g.onclick = closeModal; g.focus(); }
}
function closeModal(){ $('#modal').hidden = true; const d = modalDone; modalDone = null; if (d) d(); scheduleAuto(); }
// Mapa del cuerpo: elige la zona de la infección
function showMap(){
  const Zp = {cer:[110,30], pul:[110,92], int:[110,145], pie:[165,118], san:[86,205], cha:[250,190]};
  let svg = `<svg class="body" viewBox="0 0 300 250" role="img" aria-label="${tr('Mapa del cuerpo')}">
    <circle cx="110" cy="32" r="22" class="sil"/><path d="M80 62h60c8 0 12 5 12 13v70c0 8-4 12-10 12h-6v70h-18v-62h-16v62H84v-70h-6c-6 0-10-4-10-12V75c0-8 4-13 12-13z" class="sil"/>
    <path d="M68 70l-20 64M152 70l22 60" class="sil arm"/>
    <path d="M250 160c9 12 16 21 16 30a16 16 0 0 1-32 0c0-9 7-18 16-30z" class="sil pond"/>`;
  for (const [id, [x, y]] of Object.entries(Zp)){
    svg += `<g class="hot ${S.zone === id ? 'sel' : ''}" data-zone="${id}" tabindex="0" role="button" aria-label="${esc(ZONES[id].n)}"><circle cx="${x}" cy="${y}" r="13"/><circle cx="${x}" cy="${y}" r="4" class="dot"/><text x="${x}" y="${y + 27}">${esc(ZONES[id].n)}</text></g>`;
  }
  svg += '</svg>';
  const list = Object.entries(ZONES).map(([id, z]) => {
    const pool = (z.types || TYPE_ORDER).filter(t => TYPES[t].min <= S.level);
    return `<button class="zone ${S.zone === id ? 'sel' : ''}" data-zone="${id}" aria-pressed="${S.zone === id}"><b>${z.n}</b><span>${z.d}</span><small>${pool.length ? pool.map(t => TYPES[t].n).join(' · ') : tr('Aún no hay organismos de esta zona a tu nivel: aparecerán los de la sangre.')}</small></button>`; }).join('');
  showModal(`<div class="eyebrow">${tr('Mapa')}</div><h2>${tr('¿Dónde está la infección?')}</h2><p>${tr('Cada zona tiene sus organismos típicos. Tu nivel no cambia: solo eliges contra qué luchar.')}</p>
    <div class="mapw">${svg}<div class="zones">${list}</div></div><button class="go" id="mGo">${tr('Cerrar')}</button>`);
  $('#mBox').querySelectorAll('[data-zone]').forEach(el => {
    const pick = () => { S.zone = el.dataset.zone; save(); setZoneTint(S.zone); ambient(S.zone); renderHud(); toast(tr('Zona: {z}. El próximo organismo será de aquí.', {z:ZONES[S.zone].n})); closeModal(); };
    el.addEventListener('click', pick); el.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); } });
  });
}
// Ficha de organismo nuevo con pregunta: ¿qué herramienta funcionará mejor?
function showSpecies(id, isNew){
  const Ty = TYPES[id];
  let quiz = '';
  if (isNew){
    const fake = {type:id};
    // la mejor = la de mayor eficacia contra ESTE organismo; la potencia solo desempata
    const scored = TOOLS.filter(t => t.id !== 'luz' || id === 'veg').map(t => ({t, m:eff(t.id, fake).m + (t.pow || 0)*.01}));
    const best = scored.reduce((a, b) => b.m > a.m ? b : a);
    const pool = scored.filter(s => s.t !== best.t && s.m < best.m*.7);
    SEED = hashStr(id) % 1000 + 7; const pick = [];
    while (pick.length < 3 && pool.length) pick.push(pool.splice(Math.floor(sr()*pool.length), 1)[0]);
    const opts = [best, ...pick].sort(() => sr() - .5);
    quiz = `<div class="quiz" id="quiz"><div class="eyebrow">${tr('Pregunta')}</div><b>${tr('¿Qué herramienta crees que funcionará mejor?')}</b>
      <div class="qopts">${opts.map(o => `<button data-q="${o.t.id}">${vesicle(o.t.id, o.t.col)}${o.t.n}</button>`).join('')}</div><p class="qres" id="qres" aria-live="polite"></p></div>`;
    showModal(`<div class="spec">${fov(id, 'big', LAB[id][1])}<div>
      <div class="eyebrow" style="color:${hex(Ty.col)}">${tr('Organismo nuevo · añadido al Atlas')} · ${tr('prep. nº')} ${prep(id)}</div>
      <h2>${Ty.n}</h2><div class="sci">${Ty.sci}</div><div class="stain">${ico('slide')}${LAB[id][0]}</div>
      <p>${Ty.desc}</p><div class="traits">${Ty.traits.map(([x]) => `<span class="trait">${esc(x)}</span>`).join('')}</div></div></div>
      ${quiz}<button class="go" id="mGo" hidden>${tr('Al combate')}</button>`);
    $('#quiz').querySelectorAll('[data-q]').forEach(b => b.onclick = () => {
      const ok = b.dataset.q === best.t.id; S.quiz.n++;
      $('#quiz').querySelectorAll('[data-q]').forEach(x => { x.disabled = true; if (x.dataset.q === best.t.id) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
      (S.known[id] = S.known[id] || {})[best.t.id] = true;
      let msg = (ok ? tr('¡Correcto!') : tr('No exactamente: la mejor es {t}.', {t:best.t.n})) + ' ' + eff(best.t.id, fake).why;
      if (ok){ S.quiz.ok++; const g = reward(S.level, false)*8*(has('h3') ? 2 : 1); if (!S.clase) S.atp += g; msg += S.clase ? '' : ' ' + tr('+{g} ATP.', {g:fmt(g)}); sfx.ach(); }
      if (!owns(best.t.id)) msg += ' ' + tr('Todavía no la tienes: búscala en el Laboratorio.');
      $('#qres').textContent = msg; $('#qres').className = 'qres ' + (ok ? 'ok' : 'no');
      const go = $('#mGo'); go.hidden = false; go.onclick = closeModal; go.focus();
      checkAch(); save(); renderHud(); renderTools();
    });
    return;
  }
  showModal(`<div class="spec">${fov(id, 'big', LAB[id][1])}<div><h2>${Ty.n}</h2><div class="sci">${Ty.sci}</div><p>${Ty.desc}</p><button class="go" id="mGo">${tr('Cerrar')}</button></div></div>`);
}
function showIntro(then){
  const me = thumb('me');
  showModal(`<div class="intro"><div class="fov big">${me ? `<img src="${me}" alt="">` : ''}<span class="fovscale">${cellD().size}</span></div><div>
    <div class="eyebrow">${tr('Un RPG incremental de biología celular')}</div><h2 class="big">Micro<b>cosmos</b></h2>
    <p>${tr('Eres un macrófago, un glóbulo blanco que patrulla el cuerpo. Te enfrentarás por turnos a bacterias, virus, hongos, protozoos, células tumorales y hasta priones.')}</p>
    <div class="seg mini" role="radiogroup">${Object.entries(LANGS).map(([k, n]) => `<button role="radio" aria-checked="${LANG === k}" data-ilang="${k}">${n}</button>`).join('')}</div></div></div>
    <ul class="steps">
      <li>${vesicle('pen', 0x4dffa0)}<div><b>${tr('Aprovecha sus características.')}</b> ${tr('La penicilina destruye la pared de peptidoglucano, pero un virus no tiene pared. El agua destilada revienta a una célula sin pared, pero no a una vegetal.')}</div></li>
      <li>${vesicle('lis', 0x9be7ff)}<div><b>${tr('Combina herramientas')}</b> ${tr('y vigila la resistencia a los antibióticos: si abusas de la penicilina, aparecerán cepas resistentes.')}</div></li>
      <li>${vesicle('atp', 0xffc65c)}<div><b>${tr('Gana ATP')}</b> ${tr('en cada victoria y gástalo en el Laboratorio: orgánulos más potentes y herramientas nuevas.')}</div></li>
      <li>${vesicle('map', 0x8fd3ff)}<div><b>${tr('Elige la zona')}</b> ${tr('del cuerpo en el mapa. Cada nivel tiene 5 combates y un jefe, y cada 10 niveles llega un jefe especial.')}</div></li>
      <li>${vesicle('dna', 0xa67bff)}<div><b>${tr('Evoluciona')}</b> ${tr('cuando te atasques: empiezas de nuevo con ADN que te hace más fuerte, y desbloqueas otras células del sistema inmune.')}</div></li>
    </ul>
    <p class="hint">${tr('Teclas 1–9: usar herramientas. El progreso se guarda en este navegador. En Ajustes encontrarás el modo clase, otros idiomas y opciones de accesibilidad.')}</p>
    <button class="go" id="mGo">${tr('Empezar')}</button>`, () => { S.intro = true; save(); then && then(); });
  $('#mBox').querySelectorAll('[data-ilang]').forEach(b => b.onclick = () => { setLang(b.dataset.ilang); showIntro(then); });
}

/* =====================================================================
   BUCLE PRINCIPAL
   ===================================================================== */
let last = performance.now(), hudAcc = 0, saveAcc = 0, fpsN = 0, fpsT = 0, slow = 0;
const clock = new THREE.Clock();
function loop(now){
  requestAnimationFrame(loop);
  const dt = Math.min(.1, (now - last)/1000); last = now; FRAME++;
  const t = clock.getElapsedTime();
  S.atp += atps()*dt;
  hudAcc += dt; saveAcc += dt;
  if (hudAcc > .25){ hudAcc = 0; $('#hAtp').textContent = fmt(S.atp); if (!S.clase) $('#pAtp').innerHTML = ico('atp') + fmt(S.atp); $('#labDot').hidden = !anyAffordable(); if (!$('#panel').hidden) refreshAfford(); }
  if (saveAcc > 5){ saveAcc = 0; save(); }
  // calidad automática: si va lento, se reduce
  fpsN++; fpsT += dt;
  if (fpsT > 4){ const fps = fpsN/fpsT; fpsN = 0; fpsT = 0;
    slow = fps < 28 && t > 8 && !document.hidden ? slow + 1 : 0; // dos mediciones lentas seguidas, pasado el arranque
    if (S.q === 'auto' && slow >= 2 && QL > 0){ slow = 0; applyQuality(QL - 1); toast(tr('Calidad gráfica reducida para que el juego vaya más fluido.')); } }
  for (let i = tweens.length-1; i >= 0; i--){
    const w = tweens[i], p = clamp((now - w.t0)/w.ms, 0, 1);
    w.fn(p); if (p >= 1){ tweens.splice(i, 1); w.done && w.done(); }
  }
  for (let i = parts.length-1; i >= 0; i--){
    const p = parts[i]; p.life -= dt;
    p.m.position.addScaledVector(p.vel, dt); p.vel.multiplyScalar(.94);
    p.m.material.opacity = Math.max(0, p.life/p.max);
    if (p.life <= 0){ scene.remove(p.m); p.m.material.dispose(); parts.splice(i, 1); }
  }
  const mot = reduceMotion || S.calm ? .3 : 1;
  player.rotation.y = Math.sin(t*.4)*.3;
  PL.up(t*mot);
  if (foeObj) foeObj.up(t*mot, B && B.e);
  ENV.dark.value += (darkTarget - ENV.dark.value)*Math.min(1, dt*3);
  ENV.tint.value.lerp(tintTarget, Math.min(1, dt*2));
  hemi.intensity = .55*(1 - .55*ENV.dark.value);
  ENV.up(t, dt, mot);
  const sx = shake > 0 ? rnd(-shake, shake) : 0, sy = shake > 0 ? rnd(-shake, shake) : 0; shake = Math.max(0, shake - dt*.8);
  const bp = camera.position.clone();
  camera.position.x += Math.sin(t*.25)*.25*mot + sx; camera.position.y += Math.sin(t*.31)*.12*mot + sy;
  // plano cinematográfico: la cámara se acerca al jefe
  if (CINE > 0){ camera.position.lerp(E_POS.clone().add(V(-1.2, .9, 4.2)), CINE*.75); }
  camera.lookAt(CINE > 0 ? LOOK.clone().lerp(E_POS, CINE*.8) : LOOK);
  renderer.render(scene, camera);
  camera.position.copy(bp);
}

