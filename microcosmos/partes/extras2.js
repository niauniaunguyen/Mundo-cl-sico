/* =====================================================================
   VERSIÓN 13: microbiota, antibiograma, plásmidos, brotes, citocinas,
   vacunas, especiación, estados del cuerpo, retos del profesor y gráficos
   ===================================================================== */
Object.assign(IC, {
  dish:'<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="1.6"/><circle cx="15" cy="9.5" r="1.6"/><circle cx="12" cy="15" r="1.6"/>',
  syringe:'<path d="M15 4l5 5M17.5 6.5L9 15l-2.5.5.5-2.5 8.5-8.5"/><path d="M11 9l4 4M4 20l3-3"/>',
  plate:'<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h8M8 11h5M8 15h8"/>',
  biota:'<rect x="5" y="9" width="9" height="4" rx="2"/><rect x="11" y="14" width="8" height="4" rx="2"/><path d="M14 11h3l2-2"/>',
});

// ---- Estados del cuerpo (cambian cada 5 minutos de juego) ----
let bodyAcc = 0;
function stepBody(dt){
  if (S.clase) return; bodyAcc += dt; if (bodyAcc < 1) return; bodyAcc = 0;
  if (!S.bodyT) S.bodyT = Date.now();
  if (Date.now() - S.bodyT > 5*60e3){ S.bodyT = Date.now(); let n; do { n = Math.floor(Math.random()*BODY.length); } while (n === S.bodyI); S.bodyI = n;
    const b = bodyCur(); toast(tr('Tu cuerpo: {n}. {d}', {n:tr(b.n), d:tr(b.d)})); renderHud(); renderMe(); }
  stepOutbreak();
}

// ---- Microbiota aliada (intestino y piel) ----
const biotaOn = () => !fixedStats() && BIOTA_ZONES.includes(S.zone);
function biotaTurn(notes){
  if (!biotaOn() || (S.biota == null ? 60 : S.biota) <= 0) return;
  const t = B.e; if (!t || t.dead || !BIOTA_FOES.includes(t.type)) return;
  const d = t.max*.03*(S.biota/100); t.hp = Math.max(0, t.hp - d);
  floatText('−' + fmt(d) + ' · ' + tr('microbiota'), t.pos.clone().add(V(-.4,1.7,0)), 'evt ev-inflam');
  notes.push(tr('Tu microbiota compite con él por el alimento y el espacio: le resta un {p} %.', {p:dec((3*S.biota/100).toFixed(1))}));
}
function biotaAfterTool(T){
  if (!biotaOn() || !T.ab) return;
  S.biota = Math.max(0, (S.biota == null ? 60 : S.biota) - 20);
  toast(tr('El antibiótico también mata a tu microbiota: baja al {p} %.', {p:S.biota}));
}
function biotaAfterWin(){ if (biotaOn() && !B.usedAb) S.biota = Math.min(100, (S.biota == null ? 60 : S.biota) + 5); }

// ---- Plásmidos: la resistencia se contagia entre bacterias del grupo ----
function plasmidSetup(es){
  const b = es.filter(x => PLASMID_FOES.includes(x.type));
  if (b.length >= 2 && Math.random() < .5){ b[0].res = true; b[0].plas = true; }
}
function plasmidTurn(e, notes, who){
  if (!e.plas) return;
  const target = B.es.find(x => !x.dead && x !== e && PLASMID_FOES.includes(x.type) && !x.res);
  if (target && Math.random() < .35){ target.res = true; target.plas = true;
    notes.push(who(tr('Transferencia horizontal: le pasa a {n} un plásmido con el gen de resistencia a la penicilina.', {n:TYPES[target.type].n})));
    ring(target.pos, 0x4dffa0, 3, 700); }
}

// ---- Antibiograma: placa de Petri con discos de antibiótico ----
const ABG_TOOLS = ['lis','pen','iso','fgt','cmp','aut','uv'];
function showAntibiogram(){
  const e = B && B.e; if (!e || B.abgDone || B.busy || !PLASMID_FOES.concat(['tbc']).includes(e.type)) return;
  const tools = ABG_TOOLS.filter(t => owns(t)).slice(0, 5); if (tools.length < 2) return toast(tr('Necesitas al menos dos herramientas para el antibiograma.'));
  const res = tools.map(t => ({t, m:eff(t, e).m})), best = res.reduce((a, b) => b.m > a.m ? b : a);
  const pos = tools.map((_, i) => { const a = -Math.PI/2 + i/tools.length*Math.PI*2; return [150 + Math.cos(a)*78, 150 + Math.sin(a)*78]; });
  const svg = halos => `<svg viewBox="0 0 300 300" class="petri"><circle cx="150" cy="150" r="140" fill="#2a1f10" stroke="#9fb3c0" stroke-width="3"/><circle cx="150" cy="150" r="132" fill="#c9a35a" opacity=".85"/>
    ${res.map((r, i) => `<circle cx="${pos.at(i)[0]}" cy="${pos.at(i)[1]}" r="${halos ? 12 + Math.min(r.m, 3)*14 : 12}" fill="#f7efe0" opacity="${halos ? .9 : 0}" class="halo"/><circle cx="${pos.at(i)[0]}" cy="${pos.at(i)[1]}" r="11" fill="#fff" stroke="${hex(TOOL[r.t].col)}" stroke-width="4"/><text x="${pos.at(i)[0]}" y="${pos.at(i)[1] + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="#03070c">${i + 1}</text>`).join('')}</svg>`;
  showModal(`<div class="eyebrow">${ico('dish')}${tr('Antibiograma')}</div><h2>${tr('¿Qué disco frena más a {n}?', {n:foeName(e)})}</h2>
    <p>${tr('Has sembrado la bacteria en una placa con agar y has puesto discos con cada herramienta. Tras incubar, alrededor de cada disco aparece un halo donde no crece: cuanto más grande, más eficaz. Elige el mejor y tendrás +30 % de daño con él en este combate.')}</p>
    <div class="abg"><div id="abgSvg">${svg(false)}</div><div class="qopts">${res.map((r, i) => `<button data-abg="${r.t}" disabled>${i + 1} · ${TOOL[r.t].n}</button>`).join('')}</div></div>
    <button class="go" id="abgInc">${tr('Incubar 24 horas')}</button><p class="qres" id="qres"></p><button class="go" id="mGo" hidden>${tr('Al combate')}</button>`);
  $('#abgInc').onclick = () => { $('#abgSvg').innerHTML = svg(true); $('#abgInc').hidden = true; $('#mBox').querySelectorAll('[data-abg]').forEach(b => b.disabled = false); };
  $('#mBox').querySelectorAll('[data-abg]').forEach(b => b.onclick = () => {
    const ok = eff(b.dataset.abg, e).m >= best.m - .01; B.abgDone = true;
    const k = S.known[knowKey(e)] = S.known[knowKey(e)] || {}; tools.forEach(t => k[t] = true);
    $('#mBox').querySelectorAll('[data-abg]').forEach(x => { x.disabled = true; if (x.dataset.abg === best.t) x.classList.add('right'); else if (x === b && !ok) x.classList.add('wrong'); });
    if (ok){ B.abg = best.t; sfx.ach(); }
    $('#qres').textContent = ok ? tr('¡Bien leído! {t} tiene el halo más grande: +30 % de daño con ella en este combate.', {t:TOOL[best.t].n}) : tr('El halo más grande era el de {t}.', {t:TOOL[best.t].n});
    const g = $('#mGo'); g.hidden = false; g.onclick = closeModal; renderTools(); renderFoe(); });
}

// ---- Citocinas: un punto por turno, se gastan en habilidades; si abusas, tormenta ----
function cytoHtml(){
  if (!B || fixedStats() && !storyCh()) return '';
  const c = B.cyt || 0;
  return `<div class="cyto" role="group" aria-label="${tr('Citocinas')}"><span class="cn num" title="${esc(tr('Citocinas: se acumula una por turno'))}">${c}</span>` +
    CYTO.map(x => `<button class="cyb" data-cyt="${x.id}" ${c < x.c || B.busy || B.over ? 'disabled' : ''} style="--c:${hex(x.col)}" title="${esc(tr(x.n) + ': ' + tr(x.d))}">${tr(x.n)} <small>${x.c}</small></button>`).join('') + '</div>';
}
function useCyto(id){
  const X = CYTO.find(x => x.id === id); if (!B || B.busy || B.over || (B.cyt || 0) < X.c) return;
  B.cyt -= X.c; B.cytUsed = (B.cytUsed || 0) + 1;
  if (id === 'fev'){ B.fever = 3; floatText(tr('Fiebre'), P_POS.clone().add(V(0,1.6,0)), 'great'); setMsg('ok', tr('Fiebre'), tr(X.d)); }
  if (id === 'inf'){ const h = maxHp()*.2; B.php = Math.min(maxHp(), B.php + h); floatText('+' + fmt(h), P_POS.clone().add(V(0,1.4,0)), 'heal'); setMsg('ok', tr('Inflamación'), tr(X.d)); }
  if (id === 'neu'){ const e = B.e, d = atk()*3*streakK(); e.hp = Math.max(0, e.hp - d);
    for (let i = 0; i < 6; i++) setTimeout(() => projectile(P_POS.clone().add(V(rnd(-1,1), rnd(-1,1), 0)), e.pos.clone(), 0xe8e0ff, 3, 380, null, null), i*60);
    setTimeout(() => { floatText(fmt(d), e.pos.clone().add(V(0,1.2,0)), 'great'); squash(e); if (!reap()){ renderFoe(); setTimeout(win, 250); } else renderFoe(); }, 450);
    setMsg('great', tr('Neutrófilos'), tr(X.d)); }
  if (B.cytUsed > 3){ const d = maxHp()*.15; B.php = Math.max(1, B.php - d); floatText('−' + fmt(d) + ' · ' + tr('tormenta'), P_POS.clone().add(V(0,1.3,0)), 'hurt');
    $('#msgX').textContent = tr('Tormenta de citocinas: has abusado de las señales de alarma y la inflamación te daña a ti (−15 % de vida).'); }
  sfx.buy(); renderMe(); renderTools();
}
document.addEventListener('click', ev => { const b = ev.target.closest('[data-cyt]'); if (b) useCyto(b.dataset.cyt); });

// ---- Brotes en el mapa ----
function stepOutbreak(){
  if (S.clase || storyCh() || S.best < 8) return;
  const o = S.outbreak, now = Date.now();
  if (!o){ if (!S.obNext) S.obNext = now + 6*60e3; if (now < S.obNext) return;
    const zs = Object.keys(ZONES).filter(z => z !== S.zone); const z = zs.at(Math.floor(Math.random()*zs.length));
    S.outbreak = {zone:z, t0:now, k:0, need:5, spread:0}; toast(tr('¡Brote en {z}! Ve allí desde el mapa y vence 5 organismos antes de 10 minutos para contenerlo.', {z:ZONES[z].n})); renderHud(); return; }
  if (now - o.t0 > 10*60e3){
    if (o.spread >= 1){ S.outbreak = null; S.obNext = now + 8*60e3; toast(tr('El brote se ha extinguido solo, pero no has llegado a tiempo.')); renderHud(); return; }
    const zs = Object.keys(ZONES).filter(z => z !== o.zone); o.zone = zs.at(Math.floor(Math.random()*zs.length)); o.t0 = now; o.spread++; o.need = 7; o.k = 0;
    toast(tr('El brote se ha extendido a {z}. Ahora hay que vencer 7 organismos.', {z:ZONES[o.zone].n})); renderHud();
  }
}
function outbreakWin(n){
  const o = S.outbreak; if (!o || S.zone !== o.zone || storyCh()) return;
  o.k += n; if (o.k < o.need) return toast(tr('Brote: {k}/{n}', {k:o.k, n:o.need}));
  S.outbreak = null; S.obNext = Date.now() + 8*60e3; S.adn += 1; const t = B.es[0].type; S.samp[t] = (S.samp[t] || 0) + 2;
  sfx.ach(); toast(tr('¡Brote contenido! +1 ADN y 2 muestras. Así trabajan los epidemiólogos: cortar la transmisión a tiempo.')); renderHud();
}

// ---- Vacunación con muestras ----
function makeVaccine(t){
  if (sampAvail(t) < 3) return;
  S.spent[t] = (S.spent[t] || 0) + 3; S.vax = S.vax || {}; S.vax[t] = (S.vax[t] || 0) + 10;
  sfx.ach(); toast(tr('Vacuna contra {n}: los próximos 10 combates contra él empezarán con el evento «Vacuna».', {n:TYPES[t].n})); save(); renderPanel();
}

// ---- Especiación ----
function showSpeciation(then){
  const pool = SPECIES.filter(x => !(S.species || []).includes(x.id)); if (!pool.length) return then && then();
  showModal(`<div class="eyebrow" style="color:var(--gfp)">${ico('dna')}${tr('Especiación')}</div><h2>${tr('Tu linaje se convierte en una especie nueva')}</h2>
    <p>${tr('Tras muchas generaciones acumulando cambios, tu linaje ya no puede cruzarse con sus antepasados: es una especie nueva. Elige el rasgo que la define. Este rasgo es permanente.')}</p>
    <div class="muts">${pool.map(x => `<button class="mutc spc" data-spc="${x.id}"><b>${tr(x.n)}</b><span>${tr(x.d)}</span><small>${tr(x.e)}</small></button>`).join('')}</div>`);
  $('#mBox').querySelectorAll('[data-spc]').forEach(b => b.onclick = () => { (S.species = S.species || []).push(b.dataset.spc); save(); $('#modal').hidden = true; toast(tr('Nueva especie: {n}', {n:tr(SPEC[b.dataset.spc].n)})); then && then(); });
}

// ---- Retos del profesor (código compartible) ----
const chalCode = c => btoa(unescape(encodeURIComponent(JSON.stringify(c))));
function chalHtml(){
  const c = S.chal;
  let h = `<div class="nb">${tr('Retos del profesor')}</div>`;
  if (c){ const D = c.type ? TYPES[c.type].n : tr('cualquier organismo');
    h += `<div class="org ${c.p >= c.n ? 'ok' : ''}">${vesicle('plate', 0xffc65c)}<h4>${tr('Reto: vence {n} veces a {t}', {n:c.n, t:D})}${c.ban ? ' ' + tr('sin usar {b}', {b:TOOL[c.ban].n}) : ''}</h4>
      <div class="meter"><i style="width:${Math.min(100, c.p/c.n*100)}%"></i></div><div class="eff">${c.p} / ${c.n}${c.p >= c.n ? ' · ' + tr('completado') : ''}</div><button class="buy" id="chalDel">${tr('Quitar reto')}</button></div>`; }
  h += `<div class="org"><h4>${tr('Crear un reto para la clase')}</h4><p>${tr('Elige el organismo, cuántas veces hay que vencerlo y una herramienta prohibida. Comparte el código con tus alumnos.')}</p>
    <div class="chf"><select id="chT"><option value="">${tr('cualquier organismo')}</option>${TYPE_ORDER.map(t => `<option value="${t}">${TYPES[t].n}</option>`).join('')}</select>
    <select id="chN">${[3, 5, 10, 20].map(n => `<option>${n}</option>`).join('')}</select>
    <select id="chB"><option value="">${tr('sin prohibir nada')}</option>${TOOLS.map(t => `<option value="${t.id}">${tr('sin')} ${t.n}</option>`).join('')}</select></div>
    <button class="buy" id="chMake">${tr('Crear código')}</button><textarea id="chOut" readonly rows="2" hidden></textarea></div>
    <div class="org"><h4>${tr('Cargar un reto')}</h4><textarea id="chIn" rows="2" placeholder="${tr('Pega aquí el código del reto')}"></textarea><button class="buy" id="chLoad">${tr('Cargar')}</button></div>`;
  return h;
}
document.addEventListener('click', ev => {
  const id = ev.target.id;
  if (id === 'chMake'){ const c = {type:$('#chT').value || null, n:+$('#chN').value, ban:$('#chB').value || null}; const o = $('#chOut'); o.hidden = false; o.value = chalCode(c); copyText(o.value, o); }
  else if (id === 'chLoad'){ try{ const c = JSON.parse(decodeURIComponent(escape(atob($('#chIn').value.trim())))); if (!c || !c.n) throw 0;
      S.chal = {type:c.type && TYPES[c.type] ? c.type : null, n:Math.min(100, Math.max(1, +c.n)), ban:c.ban && TOOL[c.ban] ? c.ban : null, p:0}; save(); renderPanel(); toast(tr('Reto cargado')); }
    catch(_){ toast(tr('El código no es válido')); } }
  else if (id === 'chalDel'){ S.chal = null; save(); renderPanel(); }
});
function chalWin(){
  const c = S.chal; if (!c || c.p >= c.n || storyCh()) return;
  if (c.ban && B.usedTools && B.usedTools[c.ban]) return;
  const n = B.es.filter(x => !c.type || x.type === c.type).length; if (!n) return;
  c.p = Math.min(c.n, c.p + n);
  if (c.p >= c.n){ S.adn += 1; sfx.ach(); toast(tr('¡Reto del profesor completado! +1 ADN.')); } else toast(tr('Reto: {k}/{n}', {k:c.p, n:c.n}));
}

// ---- Gráficos: luz de las herramientas, división visible, viaje entre zonas, estado de tu célula ----
const toolLight = new THREE.PointLight(0xffffff, 0, 9); scene.add(toolLight);
function toolFlash(col, pos){ if (QL === 0) return; toolLight.color.setHex(col); toolLight.position.copy(pos).add(V(0,1,1.5)); tween(520, p => toolLight.intensity = 2.6*Math.sin(p*Math.PI), () => toolLight.intensity = 0); }
function splitFx(e){
  const o = e && e.obj; if (!o || o.dying || QL === 0) return;
  const c = o.g.clone(); c.position.copy(o.g.position); scene.add(c); const dir = V(rnd(-1, 1), rnd(.2, 1), 0).normalize();
  tween(800, p => { c.position.copy(o.g.position).addScaledVector(dir, .9*easeOut(p)); c.scale.setScalar(o.base*(1 - p)*.8); }, () => scene.remove(c));
}
function travelFx(){ const t = $('#travel'); t.hidden = false; t.classList.remove('go'); void t.offsetWidth; t.classList.add('go'); setTimeout(() => { t.hidden = true; }, 1000); }
function stepPlayerState(t){
  if (!B || !player) return;
  const low = B.php < maxHp()*.3, fev = B.fever > 0 || (B.e && B.e.ev === 'fiebre') || (S.bodyI != null && bodyCur().id === 'fever'), inf = B.e && B.e.ev === 'inflam' || cellD().inflam;
  const base = SKINS[S.skin].col;
  const col = low ? 0xff4f7b : inf ? 0xff9ad0 : fev ? 0xffa64d : base;
  pLight.color.lerp(new THREE.Color(col), .05);
  pLight.intensity = 1.1 + (low ? .9*(.5 + .5*Math.sin(t*6)) : fev ? .5 : 0);
}

// ---- Accesibilidad: paleta para daltonismo y alto contraste ----
function applyA11y(){ $('#app').classList.toggle('cb', !!S.cb); $('#app').classList.toggle('hc', !!S.hc); }
setTimeout(applyA11y, 0);

// ---- Lámina científica descargable (Atlas) ----
function showPlate(id){
  const Ty = TYPES[id], src = thumb(id), parts = PARTS[id] || [];
  showModal(`<div class="plate"><div class="pl-h">${tr('Lámina')} ${prep(id)} · Microcosmos</div><h2>${Ty.n}</h2><div class="sci">${Ty.sci}</div>
    <div class="pl-b">${src ? `<img src="${src}" alt="">` : ''}<ol>${parts.map(p => `<li><b>${tr(p[0])}</b> ${tr(p[1])}</li>`).join('') || Ty.traits.map(x => `<li>${esc(x[0])}</li>`).join('')}</ol></div>
    <p class="pl-d">${Ty.desc}</p></div><div class="row"><button class="go" id="plDl">${tr('Descargar lámina')}</button><button class="ghost" id="mGo">${tr('Cerrar')}</button></div>`);
  $('#plDl').onclick = () => downloadPlate(id);
}
function downloadPlate(id){
  const Ty = TYPES[id], parts = PARTS[id] || [], cv = document.createElement('canvas'); cv.width = 1200; cv.height = 1600;
  const x = cv.getContext('2d'); x.fillStyle = '#f3ead6'; x.fillRect(0, 0, 1200, 1600);
  x.strokeStyle = '#3b2f22'; x.lineWidth = 6; x.strokeRect(40, 40, 1120, 1520); x.lineWidth = 2; x.strokeRect(58, 58, 1084, 1484);
  x.fillStyle = '#3b2f22'; x.textAlign = 'center'; x.font = '600 30px Georgia, serif'; x.fillText(tr('Lámina') + ' ' + prep(id) + ' · Microcosmos', 600, 120);
  x.font = '700 64px Georgia, serif'; x.fillText(Ty.n, 600, 210); x.font = 'italic 34px Georgia, serif'; x.fillText(Ty.sci, 600, 260);
  const wrap = (s, w) => { const out = []; let l = ''; for (const t of s.split(' ')){ if (x.measureText(l + ' ' + t).width > w){ out.push(l); l = t; } else l = (l + ' ' + t).trim(); } out.push(l); return out; };
  const finish = () => { x.textAlign = 'left'; let y = 1000; x.font = '28px Georgia, serif';
    (parts.length ? parts.map((p, i) => `${i + 1}. ${tr(p[0])}: ${tr(p[1])}`) : Ty.traits.map((t, i) => `${i + 1}. ${t[0]}`)).forEach(l => wrap(l, 1000).forEach(s => { x.fillText(s, 100, y); y += 38; }));
    y += 20; x.font = 'italic 24px Georgia, serif'; wrap(Ty.desc, 1000).slice(0, 8).forEach(s => { x.fillText(s, 100, y); y += 32; });
    const a = document.createElement('a'); a.download = 'lamina-' + id + '.png'; a.href = cv.toDataURL('image/png'); a.click(); };
  const src = thumb(id); if (!src) return finish();
  const im = new Image(); im.onload = () => { x.save(); x.filter = 'sepia(.85) contrast(1.15)'; x.beginPath(); x.arc(600, 620, 330, 0, Math.PI*2); x.clip(); x.fillStyle = '#e6dcc4'; x.fillRect(270, 290, 660, 660); x.drawImage(im, 270, 290, 660, 660); x.restore();
    x.beginPath(); x.arc(600, 620, 330, 0, Math.PI*2); x.lineWidth = 4; x.stroke(); finish(); }; im.src = src;
}

// ---- Comparación de escala (fichas de organismo nuevo) ----
function scaleHtml(id){
  const a = SIZE_UM[id], me = CELL_UM[S.cell] || 21; if (!a) return '';
  const r = a/me, txt = r < 1 ? tr('Es unas {k} veces más pequeño que tu célula.', {k:fmt(Math.round(1/r))}) : r > 1.5 ? tr('Es unas {k} veces más grande que tu célula.', {k:fmt(Math.round(r))}) : tr('Tiene más o menos tu tamaño.');
  const L = v => Math.max(4, Math.min(100, 50 + 12*Math.log10(v)));
  return `<div class="scl"><div class="scb"><span style="width:${L(me)}%" class="me"></span><em>${tr('Tú')} · ${me} µm</em></div><div class="scb"><span style="width:${L(a)}%"></span><em>${TYPES[id].n} · ${a >= 1000 ? fmt(a/1000) + ' mm' : a + ' µm'}</em></div><small>${txt} ${tr('(Escala logarítmica.)')}</small></div>`;
}

// ---- Resumen del combate (al vencer a un jefe o en los eventos) ----
function summaryHtml(){
  const d = B.dmgBy || {}, ks = Object.keys(d).filter(k => d[k] > 0); if (!ks.length) return '';
  const tot = ks.reduce((a, k) => a + d[k], 0), top = ks.reduce((a, k) => d[k] > d[a] ? k : a);
  return `<div class="summ"><b>${tr('Resumen')}</b>${ks.sort((a, b) => d[b] - d[a]).slice(0, 4).map(k => `<div class="sr"><span>${TOOL[k].n}</span><i style="width:${d[k]/tot*100}%;background:${hex(TOOL[k].col)}"></i><em>${Math.round(d[k]/tot*100)} %</em></div>`).join('')}
    <small>${tr('Herramienta estrella: {t}. Turnos: {n}.', {t:TOOL[top].n, n:B.turns})}</small></div>`;
}
