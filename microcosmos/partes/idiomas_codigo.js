/* =====================================================================
   IDIOMAS: español (original), català, English
   ===================================================================== */
const LANGS = {es:'Español', ca:'Català', en:'English'};
let LANG = 'es';
// tr(): textos de la interfaz; la clave es el texto en español
function tr(s, v){
  let o = LANG !== 'es' && I18N[LANG] && I18N[LANG][s] || s;
  if (v) o = o.replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '');
  return o;
}
const BASE = JSON.parse(JSON.stringify({TYPES, TOOLS, EFF, COMBOS, UPG, CELLS, SKINS, ZONES, EVENTS, SPECIAL, ACH, DAILY, LAB, LICENSES}));
// Traduce los datos de biología sustituyendo sus textos (los números no cambian)
function applyData(l){
  const D = l === 'es' ? null : DT[l];
  const pick = (d, i, b) => d && d[i] != null ? d[i] : b;
  for (const id in TYPES){ const b = BASE.TYPES[id], t = TYPES[id], d = D && D.T[id];
    t.n = pick(d, 0, b.n); t.boss = pick(d, 1, b.boss); t.desc = pick(d, 2, b.desc);
    t.traits = b.traits.map((x, i) => [d ? d[3][i] : x[0], x[1]]); if (b.dodgeWhy) t.dodgeWhy = pick(d, 4, b.dodgeWhy); t.sci = pick(d, 5, b.sci); }
  TOOLS.forEach((t, i) => { const b = BASE.TOOLS[i], d = D && D.TL[t.id]; t.n = pick(d, 0, b.n); t.d = pick(d, 1, b.d); });
  for (const tl in EFF) for (const k in EFF[tl]){ const d = D && D.E[tl] && D.E[tl][k]; EFF[tl][k][1] = d || BASE.EFF[tl][k][1]; }
  COMBOS.forEach((c, i) => { const d = D && D.C[c.id]; c.n = pick(d, 0, BASE.COMBOS[i].n); c.why = pick(d, 1, BASE.COMBOS[i].why); });
  UPG.forEach((u, i) => { const d = D && D.U[u.id], b = BASE.UPG[i]; u.n = pick(d, 0, b.n); u.d = pick(d, 1, b.d); u.e = pick(d, 2, b.e); });
  const nd = (obj, base, key) => { for (const id in obj){ const d = D && D[key][id]; obj[id].n = pick(d, 0, base[id].n); obj[id].d = pick(d, 1, base[id].d); } };
  nd(CELLS, BASE.CELLS, 'CE'); nd(SKINS, BASE.SKINS, 'SK'); nd(ZONES, BASE.ZONES, 'Z'); nd(EVENTS, BASE.EVENTS, 'EV');
  for (const id in CELLS){ const d = D && D.CE[id]; CELLS[id].size = pick(d, 2, BASE.CELLS[id].size); }
  SPECIAL.forEach((s, i) => { const d = D && D.SP[i]; s.n = pick(d, 0, BASE.SPECIAL[i].n); s.p2 = pick(d, 1, BASE.SPECIAL[i].p2); });
  ACH.forEach((a, i) => { const d = D && D.A[a.id]; a.n = pick(d, 0, BASE.ACH[i].n); a.f = pick(d, 1, BASE.ACH[i].f); });
  DAILY.forEach((q, i) => { q.n = (D && D.DA[q.id]) || BASE.DAILY[i].n; });
  for (const id in LAB) LAB[id] = (D && D.LB[id] || BASE.LAB[id]).slice();
  LICENSES.splice(0, LICENSES.length, ...(D ? D.LI : BASE.LICENSES));
}
function detectLang(){ const n = (navigator.language || 'es').toLowerCase(); return n.startsWith('ca') ? 'ca' : n.startsWith('en') ? 'en' : 'es'; }
function setLang(l){
  LANG = LANGS[l] ? l : 'es'; S.lang = LANG;
  applyData(LANG); applyStatic();
  renderHud(); renderFoe(); renderMe(); renderTools(); renderLog();
  if (!$('#panel').hidden) renderPanel();
  save();
}

