/* =====================================================================
   VERSIÓN 12: distancia, sinergias, diagnóstico a ciegas, mutaciones,
   expedición diaria, investigación, duelo, ciclos, microscopio y rendimiento
   ===================================================================== */
Object.assign(IC, {
  range:'<path d="M3 12h18"/><path d="M6.5 8.5L3 12l3.5 3.5M17.5 8.5L21 12l-3.5 3.5"/>',
  lens:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/><path d="M8 11h6M11 8v6"/>',
  cycle:'<path d="M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6"/><path d="M17.7 2.8v3.8h-3.8M6.3 21.2v-3.8h3.8"/>',
  duel:'<path d="M4 20l8-8M20 20l-8-8M14 4l6 6M10 4L4 10"/>',
  dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="15" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="9" cy="15" r="1.2"/>',
});
document.querySelectorAll('[data-ic="range"],[data-ic="lens"]').forEach(s => s.innerHTML = ico(s.dataset.ic));

// ---- 1. Distancia: cerca engulles mejor; lejos recibes menos daño, pero la fagocitosis no llega ----
const rangeK = kind => { const far = S.range === 'far';
  if (kind === 'fago') return far ? .3 : 1.25;
  if (kind === 'hurt') return far ? .7 : 1;
  return 1; };
function setRange(r){
  S.range = r; save(); renderHud();
  toast(r === 'far' ? tr('Te alejas: recibes un 30 % menos de daño, pero la fagocitosis apenas llega (×0,3).') : tr('Te acercas: la fagocitosis hace ×1,25, pero recibes el daño completo.'));
}
$('#bRange').onclick = () => setRange(S.range === 'far' ? 'near' : 'far');

// ---- 2. Enemigos que se ayudan (combates en grupo) ----
const BACT_ANY = ['gp','gn','bac','myc','tbc'];
function setSynergy(es){
  const find = ts => es.find(x => ts.includes(x.type));
  const bact = find(BACT_ANY), tum = find(['can']), vir = find(['vir','vih']), prot = find(['ame','par']), pri = find(['pri']);
  if (bact) es.forEach(x => { if (x !== bact){ x.shieldBy = bact; x.syn = tr('Protegido por la biopelícula de {n}', {n:TYPES[bact.type].n}); } });
  if (tum && vir){ vir.hideIn = tum; vir.syn = tr('Escondido dentro de {n}', {n:TYPES[tum.type].n}); }
  if (prot && bact){ prot.eats = bact; prot.syn = tr('Se alimenta de {n}', {n:TYPES[bact.type].n}); }
  if (pri) es.forEach(x => { if (x !== pri && !x.syn){ x.prionBy = pri; x.syn = tr('Contagiado por el prion'); } });
}
const shieldK = x => x.shieldBy && !x.shieldBy.dead ? .75 : 1;
function synergyTurn(e, notes, heal, who){
  if (e.hideIn && !e.hideIn.dead && !e.hidden){ e.hidden = true; notes.push(who(tr('Se esconde dentro de la célula tumoral, que no tiene defensas contra él.'))); }
  if (e.eats && !e.eats.dead) heal(.08, tr('Fagocita a su compañera bacteria y se cura un 8 %.'));
  if (e.prionBy && !e.prionBy.dead){ e.grow *= 1.05; }
}

// ---- 3. Mutaciones al evolucionar ----
function showMutations(then){
  const pool = MUTS.filter(m => m.id !== S.mut).sort(() => Math.random() - .5).slice(0, 3);
  showModal(`<div class="eyebrow" style="color:var(--gram)">${ico('dna')}${tr('Mutación')}</div><h2>${tr('Elige una mutación para esta vida')}</h2>
    <p>${tr('Las mutaciones son cambios al azar en el ADN. Casi siempre tienen ventajas y costes: la selección natural decide si compensan. Esta te acompañará hasta la próxima evolución.')}</p>
    <div class="muts">${pool.map(m => `<button class="mutc" data-mut="${m.id}"><b>${tr(m.n)}</b><span>${tr(m.d)}</span><small>${tr(m.e)}</small></button>`).join('')}</div>`);
  $('#mBox').querySelectorAll('[data-mut]').forEach(b => b.onclick = () => {
    S.mut = b.dataset.mut; save(); rebuildPlayer(); $('#modal').hidden = true;
    toast(tr('Mutación: {n}', {n:tr(MUT[S.mut].n)})); renderHud(); then && then(); });
}
const mutHtml = () => S.mut && MUT[S.mut] ? `<div class="org">${vesicle('dna', 0xa67bff)}<h4>${tr('Mutación de esta vida')}: ${tr(MUT[S.mut].n)}</h4><p>${tr(MUT[S.mut].d)}</p><div class="eff">${tr(MUT[S.mut].e)}</div></div>` : '';

// ---- 4. Expedición diaria ----
function makeDaily(){
  const d = today(), h = hashStr('exp' + d), rule = DAY_RULES[h % DAY_RULES.length];
  SEED = h % 9973 + 11;
  const ok = t => TYPES[t].min <= 30 && rule.tools.some(tl => (EFF[tl][t] || EFF[tl].def)[0] >= 1.5);
  let pool = TYPE_ORDER.filter(ok); if (rule.hard) pool = pool.filter(t => TYPES[t].min >= 12);
  const battles = []; for (let i = 0; i < 5; i++) battles.push(pool.at(Math.floor(sr()*pool.length)));
  const zones = Object.keys(ZONES), X = {id:'dia', daily:true, n:T_('Expedición diaria'), ic:'dice', col:0xffc65c, need:5,
    d:tr('Hoy') + ': ' + tr(rule.n) + '. ' + tr(rule.d), reward:{adn:2, samp:1},
    chapters:[{n:rule.n, cell:'mac', zone:zones.at(h % zones.length), L:rule.hard ? 16 : 12, tools:rule.tools, battles, t:rule.d}],
    end:[T_('Expedición completada'), T_('Vuelve mañana: habrá otra regla y otros organismos.')]};
  const i = EXPED.findIndex(x => x.id === 'dia'); if (i >= 0) EXPED.splice(i, 1, X); else EXPED.splice(1, 0, X);
  EXPED_BY.dia = X; return X;
}
makeDaily();

// ---- 5. Diagnóstico a ciegas ----
function identifyFoe(){
  const e = B && B.e; if (!e || !e.blind || B.busy) return;
  const others = TYPE_ORDER.filter(t => S.seen[t] && t !== e.type).sort(() => Math.random() - .5).slice(0, 3);
  const opts = [e.type, ...others].sort(() => Math.random() - .5);
  showModal(`<div class="eyebrow">${ico('scope')}${tr('Diagnóstico a ciegas')}</div><h2>${tr('¿Qué organismo es?')}</h2>
    <p>${tr('Fíjate en su forma, en cómo ataca y en qué herramientas le han hecho efecto. Si aciertas, ganarás el doble de ATP al vencerlo.')}</p>
    <div class="qopts">${opts.map(t => `<button data-id="${t}">${TYPES[t].n}</button>`).join('')}</div>`);
  $('#mBox').querySelectorAll('[data-id]').forEach(b => b.onclick = () => {
    const ok = b.dataset.id === e.type; e.blind = false; e.idOk = ok; $('#modal').hidden = true;
    toast(ok ? tr('¡Diagnóstico correcto! Ganarás el doble de ATP.') : tr('No era eso: es {n}.', {n:TYPES[e.type].n})); if (ok) sfx.ach();
    revealFoe(e); renderFoe(); renderTools(); scheduleAuto(); });
}
function revealFoe(e){
  const o = e.obj; if (!o) return; scene.remove(o.g);
  const n = buildFoe(e, B.es.length); n.g.position.copy(e.pos); e.obj = n;
  const f = FOES.find(x => x.e === e); if (f) f.obj = n; if (B.e === e) aimAt(e);
}

// ---- 8. Investigación con muestras ----
function research(t){
  const lv = S.research[t] || 0; if (lv >= 3 || sampAvail(t) < 5) return;
  S.spent[t] = (S.spent[t] || 0) + 5; S.research[t] = lv + 1;
  const k = S.known[t] = S.known[t] || {}; TOOLS.forEach(x => k[x.id] = true);
  sfx.ach(); toast(tr('Investigación de {n}: nivel {l}. Conoces todas sus debilidades y le haces +{p} % de daño.', {n:TYPES[t].n, l:lv + 1, p:(lv + 1)*10}));
  save(); renderPanel(); renderTools();
}

// ---- 9. Ciclos de vida (Atlas) ----
function cycleSvg(steps, col){
  const W = 560, H = 360, cx = W/2, cy = H/2, rx = 190, ry = 120, n = steps.length;
  const pt = i => { const a = -Math.PI/2 + i/n*Math.PI*2; return [cx + Math.cos(a)*rx, cy + Math.sin(a)*ry]; };
  const wrap = s => { const w = s.split(' '), out = ['']; for (const x of w){ if ((out.at(-1) + ' ' + x).trim().length > 22) out.push(x); else out[out.length - 1] = (out.at(-1) + ' ' + x).trim(); } return out; };
  let g = `<svg viewBox="0 0 ${W} ${H}" class="cyc" role="img"><defs><marker id="cy-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="${hex(col)}"/></marker></defs>`;
  for (let i = 0; i < n; i++){ const [x1, y1] = pt(i), [x2, y2] = pt((i + 1) % n), mx = (x1 + x2)/2, my = (y1 + y2)/2, bx = cx + (mx - cx)*1.25, by = cy + (my - cy)*1.25;
    g += `<path d="M${x1 + (x2 - x1)*.22} ${y1 + (y2 - y1)*.22} Q${bx} ${by} ${x2 - (x2 - x1)*.22} ${y2 - (y2 - y1)*.22}" fill="none" stroke="${hex(col)}" stroke-width="2" opacity=".7" marker-end="url(#cy-a)"/>`; }
  steps.forEach((s, i) => { const [x, y] = pt(i), lines = wrap(tr(s));
    g += `<g><circle cx="${x}" cy="${y}" r="15" fill="${hex(col)}" opacity=".9"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#03070c">${i + 1}</text>`;
    lines.forEach((l, k) => g += `<text x="${x}" y="${y + 34 + k*16 - (y < cy ? 62 + (lines.length - 1)*16 : 0)}" text-anchor="middle" font-size="13" fill="#dcecf3">${esc(l)}</text>`); g += '</g>'; });
  return g + '</svg>';
}
function showCycle(id){
  const Ty = TYPES[id];
  showModal(`<div class="eyebrow" style="color:${hex(Ty.col)}">${ico('cycle')}${tr('Ciclo de vida')}</div><h2>${Ty.n}</h2><div class="sci">${Ty.sci}</div>
    ${cycleSvg(CYCLES[id], Ty.col)}<button class="go" id="mGo">${tr('Cerrar')}</button>`);
}

// ---- 10. Duelo en clase (dos jugadores en el mismo dispositivo) ----
function showDuel(){
  const D = {p:[0, 0], round:0, turn:0, max:6};
  const pool = TYPE_ORDER.filter(t => S.seen[t]);
  if (pool.length < 4){ toast(tr('Descubre al menos 4 organismos para jugar al duelo.')); return; }
  const step = () => {
    if (D.round >= D.max){ const w = D.p[0] === D.p[1] ? tr('¡Empate!') : tr('Gana el jugador {n}', {n:D.p[0] > D.p[1] ? 1 : 2});
      showModal(`<div class="eyebrow">${ico('duel')}${tr('Duelo en clase')}</div><h2>${w}</h2><p class="num">${tr('Jugador {n}', {n:1})}: ${D.p[0]} · ${tr('Jugador {n}', {n:2})}: ${D.p[1]}</p><button class="go" id="mGo">${tr('Cerrar')}</button>`, () => { if (!B || B.over) newBattle(); });
      return; }
    const a = D.round % 2, d = 1 - a; // a elige el organismo, d responde
    showModal(`<div class="eyebrow">${ico('duel')}${tr('Duelo en clase')} · ${tr('ronda {r} de {n}', {r:D.round + 1, n:D.max})}</div>
      <h2>${tr('Jugador {n}: elige un organismo', {n:a + 1})}</h2><p>${tr('Que el jugador {n} no mire. Elige el organismo que creas más difícil de vencer.', {n:d + 1})}</p>
      <div class="qopts">${pool.map(t => `<button data-dt="${t}">${TYPES[t].n}</button>`).join('')}</div>`);
    $('#mBox').querySelectorAll('[data-dt]').forEach(b => b.onclick = () => {
      const t = b.dataset.dt, fake = {type:t};
      const sc = TOOLS.filter(T => T.id !== 'luz' && (T.need == null || S.best >= T.need)).map(T => ({T, m:eff(T.id, fake).m}));
      const best = sc.reduce((x, y) => y.m > x.m ? y : x), wrong = sc.filter(x => x.m < best.m*.7).sort(() => Math.random() - .5).slice(0, 3);
      const opts = [best, ...wrong].sort(() => Math.random() - .5);
      showModal(`<div class="eyebrow">${ico('duel')}${tr('Duelo en clase')} · ${tr('ronda {r} de {n}', {r:D.round + 1, n:D.max})}</div>
        <div class="spec">${fov(t, '', LAB[t][1])}<div><h2>${tr('Jugador {n}: ¿con qué lo vences?', {n:d + 1})}</h2><p><b>${TYPES[t].n}</b> · ${TYPES[t].traits.map(x => x[0]).join(' · ')}</p></div></div>
        <div class="qopts">${opts.map(o => `<button data-dq="${o.T.id}">${vesicle(o.T.id, o.T.col)}${o.T.n}</button>`).join('')}</div><p class="qres" id="qres"></p><button class="go" id="dNext" hidden>${tr('Siguiente')}</button>`);
      $('#mBox').querySelectorAll('[data-dq]').forEach(q => q.onclick = () => {
        const m = eff(q.dataset.dq, fake).m, pts = m >= best.m - .01 ? 2 : m >= 1 ? 1 : 0;
        D.p[d] += pts; if (pts < 2) D.p[a] += 1;
        $('#mBox').querySelectorAll('[data-dq]').forEach(x => { x.disabled = true; if (x.dataset.dq === best.T.id) x.classList.add('right'); else if (x === q) x.classList.add('wrong'); });
        $('#qres').textContent = (pts === 2 ? tr('¡Perfecto! +2 puntos.') : pts ? tr('Eficaz, pero había algo mejor: +1 punto, y +1 para quien eligió el organismo.') : tr('No le afecta: +1 punto para quien eligió el organismo.')) + ' ' + eff(best.T.id, fake).why;
        const nx = $('#dNext'); nx.hidden = false; nx.onclick = () => { D.round++; step(); }; });
    });
  };
  if (B){ B.over = true; clearTimeout(B.timer); }
  step();
}

// ---- Microscopio: modos de observación ----
function applyScope(){
  const M = SCOPES.find(x => x.id === (S.scope || '')) || SCOPES[0];
  $('#c').style.filter = M.f; $('#bScope').setAttribute('aria-pressed', !!M.id);
}
$('#bScope').onclick = () => { const i = SCOPES.findIndex(x => x.id === (S.scope || '')); const M = SCOPES[(i + 1) % SCOPES.length];
  S.scope = M.id; save(); applyScope(); toast(tr('Microscopio: {n}', {n:tr(M.n)})); };

// ---- Rendimiento: ahorro de batería, normal o cine ----
function applyPerf(){
  $('#app').classList.toggle('cine', S.perf === 'cine');
  if (S.perf === 'eco') applyQuality(0); else if (S.perf === 'cine') applyQuality(2); else applyQuality(S.q === 'auto' ? 2 : S.q);
}
const perfHtml = () => `<div class="nb">${tr('Rendimiento')}</div><div class="seg" role="radiogroup">` + [['eco', tr('Ahorro de batería')], ['normal', tr('Normal')], ['cine', tr('Cine')]]
  .map(([k, n]) => `<button role="radio" aria-checked="${S.perf === k}" data-perf="${k}">${n}</button>`).join('') + `</div><p class="lead">${tr('El ahorro de batería dibuja a 30 imágenes por segundo y con menos partículas. El modo cine usa la máxima calidad y un efecto de lente de microscopio.')}</p>`;
document.addEventListener('click', ev => { const b = ev.target.closest('[data-perf]'); if (!b) return; S.perf = b.dataset.perf; save(); applyPerf(); renderPanel(); });

// ---- Evolución: animación de mitosis ----
function mitosisFx(){
  const p0 = player.position.clone(); ring(p0, 0xa67bff, 7, 1200);
  tween(900, p => { const k = Math.sin(p*Math.PI); player.scale.set(1 + .5*k, 1 - .3*k, 1); }, () => { player.scale.setScalar(1 + .025*Math.min(S.evos, 12)); burst(p0, 0xa67bff, 50, 3); });
  floatText(tr('Mitosis'), p0.clone().add(V(0,1.6,0)), 'great');
}

// arranque de lo nuevo
setTimeout(() => { applyScope(); if (S.perf !== 'normal') applyPerf(); }, 0);
