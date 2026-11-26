/* =====================================================================
   ESTADO Y FÓRMULAS
   ===================================================================== */
const SAVE_KEY = 'microcosmos.v1';
const today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); };
const fresh = () => ({v:1, level:1, kills:0, runMax:1, best:1, atp:0, adn:0, evos:0, totalKills:0,
  upg:{fue:0, mem:0, cit:0, rib:0, mit:0, ref:0, nuc:0, rel:0, gol:0, per:0, cen:0, tlr:0, glc:0, sec:0}, memoria:false, tools:{fago:true}, known:{}, seen:{}, defeated:{},
  auto:false, advance:true, sound:true, intro:false, t:Date.now(),
  lang:null, cell:'mac', skin:'cfp', zone:'san', clase:false, big:false, calm:false, q:'auto',
  press:0, combos:{}, comboCount:0, quiz:{ok:0, n:0}, first:{ok:0, n:0}, ach:{}, daily:{date:'', list:[]}, dailyDone:0,
  sarmSeen:false, specialWins:0, stats:{lvl:{}, deaths:{}, buys:{}, lvlStart:Date.now()}, practice:null,
  tree:{}, lpts:0, achSeen:{}, miles:{}, focus:false, story:null, storyDone:false, evDone:{}, varSeen:{}, samp:{}, relics:{}, relSp:{}, nudged:0, mut:null, streak:0, research:{}, spent:{}, scope:'', perf:'normal', range:'near', expDay:'', expBest:{}, diag:{ok:0, n:0}, narr:true, voice:false, music:true, narrSeen:{}, sideSeen:false});
let S = fresh();

// Modo historia: el capítulo fija tu célula, tus herramientas y el nivel
// Eventos especiales (antes «modo historia»): S.story = {ev, ch, step}
const curEx = () => S.story ? EXPED_BY[S.story.ev || 'inf'] : null;
const storyCh = () => S.story && curEx() ? curEx().chapters[S.story.ch] : null;
// ficha del organismo: el original o la variante (un organismo con alguna característica cambiada)
const VTY_C = {};
function VTY(id){
  const V = VARIANTS[id], k = id + LANG;
  if (VTY_C[k]) return VTY_C[k];
  const b = TYPES[V.base];
  return VTY_C[k] = Object.assign({}, b, {n:tr(V.n), sci:tr(V.sci), boss:tr(V.boss || V.n), col:V.col, desc:tr(V.diff),
    traits:V.traits.map(t => [tr(t[0]), t[1], t[2]]), dodge:V.dodge != null ? V.dodge : b.dodge, dodgeWhy:V.dodgeWhy ? tr(V.dodgeWhy) : b.dodgeWhy, V});
}
const TY = e => e.var ? VTY(e.var) : TYPES[e.type];
const knowKey = e => e.var || e.type;
const effLevel = () => storyCh() ? storyCh().L : S.level;
const fixedStats = () => S.clase || !!storyCh();
const cellD = () => CELLS[(storyCh() && storyCh().cell) || S.cell] || CELLS.mac;
const owns = id => storyCh() ? storyCh().tools.includes(id) : S.clase || !!S.tools[id];
const canAuto = () => S.memoria || S.clase || !!storyCh();
// Árbol de habilidades
const has = id => !!S.tree[id];
const treeSpent = () => Object.keys(S.tree).reduce((a, id) => a + (TREE_NODES[id] ? TREE_NODES[id].cost : 0), 0);
const treeFree = () => S.lpts - treeSpent();
const toolCd = T => Math.max(0, T.cd - ((T.id === 'ac' && has('h4')) || ((T.id === 'tc' || T.id === 'tax') && has('c3')) ? 1 : 0));
const adnM = () => 1 + .1*S.adn;
// mutación elegida al evolucionar y recurso de la zona (solo en la partida normal)
const mutK = (k, d=1) => { if (fixedStats() || !S.mut || !MUT[S.mut]) return d; const v = MUT[S.mut].k[k]; return v != null ? v : d; };
const zoneK = (k, d=1) => { if (fixedStats()) return d; const z = ZONE_RES[S.zone]; const v = z && z.k[k]; return v != null ? v : d; };
const streakK = () => 1 + .05*Math.min(S.streak || 0, 10);
const sampAvail = t => (S.samp[t] || 0) - (S.spent[t] || 0);
// ---- Coleccionables (no cuentan en el modo clase ni en los eventos) ----
const stars = id => STARS.filter(n => (S.samp[id] || 0) >= n).length;
const rl = id => fixedStats() ? 0 : (S.relics[id] || 0);
const grpTier = g => { const m = Math.min(...g.types.map(stars)); return m >= 5 ? 3 : m >= 3 ? 2 : m >= 1 ? 1 : 0; };
const grpK = k => fixedStats() ? 1 : GROUPS.filter(g => g.k === k).reduce((a, g) => a*(1 + GROUP_K[grpTier(g)]), 1);
const collAtk = () => (1 + .06*rl('dna'))*(1 + .04*rl('crispr'))*grpK('atk');
const collHp = () => (1 + .06*rl('teo'))*(1 + .04*rl('crispr'))*grpK('hp');
const collAtp = () => (1 + .1*rl('leeu'))*grpK('atp');
// contra un organismo concreto y con una herramienta concreta
const collVs = (type, tool) => { if (fixedStats()) return 1; let k = (1 + STAR_DMG*stars(type))*(1 + .1*(S.research[type] || 0));
  for (const r in REL_TOOL) if (REL_TOOL[r].includes(tool)) k *= 1 + RELIC[r].p/100*rl(r); return k; };
const collAtpVs = type => fixedStats() ? 1 : 1 + STAR_ATP*stars(type);
// En modo clase no hay mejoras: tus estadísticas crecen con el nivel
const atk = () => (fixedStats() ? 10*Math.pow(1.24, effLevel()-1) : 10*Math.pow(1.15, S.upg.fue)*Math.pow(1.12, S.upg.nuc)*Math.pow(1.1, S.upg.tlr)*adnM()*collAtk()*mutK('atk'))*cellD().atk;
const maxHp = () => (fixedStats() ? 120*Math.pow(1.2, effLevel()-1) : 100*Math.pow(1.15, S.upg.mem)*Math.pow(1.12, S.upg.rel)*Math.pow(1.1, S.upg.glc)*adnM()*collHp()*mutK('hp'))*cellD().hp;
// orgánulos avanzados: solo en la partida normal
const adv = k => fixedStats() ? 0 : (S.upg[k] || 0);
const advUnlocked = () => S.best >= 30;
const eliteUnlocked = () => S.best >= 100;
// salto de dificultad a partir del nivel 31 (tejidos profundos)
const deepHp = L => L > 30 ? 3.2*Math.pow(1.1, L - 31) : 1;
const deepAtk = L => L > 30 ? 1.9*Math.pow(1.06, L - 31) : 1;
const taken = () => fixedStats() ? .8 : Math.pow(.96, S.upg.cit)*mutK('taken')*zoneK('taken');
const atps = () => S.clase ? 0 : S.upg.mit*.3*Math.pow(1.15, S.runMax-1)*adnM()*(1 + .25*rl('krebs'))*mutK('atps')*zoneK('atps');
const reward = (L, boss) => 5*Math.pow(1.2, L-1)*(boss ? 6 : 1)*Math.pow(1.2, S.upg.rib)*adnM()*collAtp()*mutK('rw')*zoneK('rw')*(L > 30 ? 1.5 : 1);
const upgCost = u => Math.ceil(u.base*Math.pow(u.k, S.upg[u.id]));
const evoGain = () => S.runMax >= 10 ? Math.floor(Math.pow(S.runMax/5, 2)) : 0;
const speed = () => Math.pow(1.25, S.upg.ref);

const SI = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
const decSep = () => LANG === 'en' ? '.' : ',';
const dec = n => String(n).replace('.', decSep());
function fmt(n){
  if (!isFinite(n)) return '∞';
  if (n < 1000) return n < 10 && n % 1 ? dec(n.toFixed(1)) : Math.floor(n).toString();
  const i = Math.min(SI.length-1, Math.floor(Math.log10(n)/3));
  if (i === SI.length-1 && n >= 1e21) return dec(n.toExponential(2));
  const v = n/Math.pow(1000, i);
  return dec(v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : v.toFixed(0)) + ' ' + SI[i];
}

function save(){ S.t = Date.now(); try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(_){} }
function load(data){
  let d = data && data.S;
  if (!d){ try{ d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); }catch(_){ d = null; } }
  if (!d || d.v !== 1) return false;
  const f = fresh(), nested = ['upg', 'quiz', 'first', 'daily', 'stats', 'diag'];
  const keep = {}; nested.forEach(k => keep[k] = f[k]);
  S = Object.assign(f, d);
  nested.forEach(k => S[k] = Object.assign(keep[k], d[k] || {}));
  for (const k in S.upg) if (!isFinite(S.upg[k])) S.upg[k] = 0;
  if (!isFinite(S.atp)) S.atp = 0;
  if (S.story && !S.story.ev) S.story.ev = 'inf';
  if (S.story && !storyCh()) S.story = null;
  if (S.storyDone) S.evDone.inf = true;
  if (!S.runMaxT) S.runMaxT = Date.now();
  if (!d.achSeen) S.achSeen = Object.fromEntries(Object.keys(S.ach || {}).map(k => [k, true])); // partidas anteriores: ya las vieron
  if (!CELLS[S.cell]) S.cell = 'mac'; if (!SKINS[S.skin]) S.skin = 'cfp'; if (!ZONES[S.zone]) S.zone = 'san';
  S.best = Math.max(S.best || 1, S.runMax || 1, S.level || 1); S.runMax = Math.max(S.runMax || 1, S.level || 1);
  return true;
}
// Código de partida para copiarla a otro navegador
const exportCode = () => btoa(unescape(encodeURIComponent(JSON.stringify(S))));
function importCode(code){
  try{ const d = JSON.parse(decodeURIComponent(escape(atob(code.trim())))); if (!d || d.v !== 1) return false; return load({S:d}); }
  catch(_){ return false; }
}

// ---- Retos diarios ----
function hashStr(s){ let h = 2166136261; for (const c of s){ h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function ensureDaily(){
  const d = today(); if (S.daily.date === d) return;
  const h = hashStr(d), a = h % DAILY.length; let b = (h >>> 8) % DAILY.length; if (b === a) b = (b + 1) % DAILY.length;
  S.daily = {date:d, list:[{id:DAILY[a].id, p:0, done:false}, {id:DAILY[b].id, p:0, done:false}]};
}
function dailyProg(id, n=1){
  ensureDaily();
  for (const q of S.daily.list){
    if (q.id !== id || q.done) continue;
    const D = DAILY.find(x => x.id === id); q.p = Math.min(D.goal, q.p + n);
    if (q.p >= D.goal){ q.done = true; S.adn += 1; S.dailyDone++; toast(tr('Reto diario completado: +1 ADN')); }
  }
}

// ---- Logros ----
const ACH_TEST = {
  k1:s => s.totalKills >= 1, k100:s => s.totalKills >= 100,
  gp:s => (s.defeated.gp || 0) >= 50, gn:s => (s.defeated.gn || 0) >= 50, vir:s => (s.defeated.vir || 0) >= 25, lev:s => (s.defeated.lev || 0) >= 25,
  veg:s => (s.defeated.veg || 0) >= 20, par:s => (s.defeated.par || 0) >= 20, can:s => (s.defeated.can || 0) >= 15, pri:s => (s.defeated.pri || 0) >= 10,
  combo:s => s.comboCount >= 3, quiz:s => s.quiz.ok >= 5, sarm:s => s.sarmSeen, evo:s => s.evos >= 1, l25:s => s.best >= 25,
  atlas:s => TYPE_ORDER.every(id => s.seen[id]), daily:s => s.dailyDone >= 3, boss:s => s.specialWins >= 1,
};
const achQueue = [];
function checkAch(){
  for (const a of ACH) if (!S.ach[a.id] && ACH_TEST[a.id](S)){ const g = reward(S.level, false)*10; S.ach[a.id] = Date.now(); S.atp += g; achQueue.push({id:a.id, g}); }
  showAchQueue();
}
const skinUnlocked = id => { const n = SKINS[id].need; if (!n) return true;
  return n[0] === 'ev' ? !!S.evDone[n[1]] : n[0] === 'evos' ? S.evos >= n[1] : n[0] === 'daily' ? S.dailyDone >= n[1] : Object.keys(S.ach).length >= n[1]; };

