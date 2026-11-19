/* =====================================================================
   ESTADO Y FÓRMULAS
   ===================================================================== */
const SAVE_KEY = 'microcosmos.v1';
const today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); };
const fresh = () => ({v:1, level:1, kills:0, runMax:1, best:1, atp:0, adn:0, evos:0, totalKills:0,
  upg:{fue:0, mem:0, cit:0, rib:0, mit:0, ref:0}, memoria:false, tools:{fago:true}, known:{}, seen:{}, defeated:{},
  auto:false, advance:true, sound:true, intro:false, t:Date.now(),
  lang:null, cell:'mac', skin:'cfp', zone:'san', clase:false, big:false, calm:false, q:'auto',
  press:0, combos:{}, comboCount:0, quiz:{ok:0, n:0}, first:{ok:0, n:0}, ach:{}, daily:{date:'', list:[]}, dailyDone:0,
  sarmSeen:false, specialWins:0, stats:{lvl:{}, deaths:{}, buys:{}, lvlStart:Date.now()}, practice:null,
  tree:{}, lpts:0, achSeen:{}, story:null, storyDone:false, diag:{ok:0, n:0}, narr:true, voice:false, music:true, narrSeen:{}, sideSeen:false});
let S = fresh();

// Modo historia: el capítulo fija tu célula, tus herramientas y el nivel
const storyCh = () => S.story ? STORY[S.story.ch] : null;
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
// En modo clase no hay mejoras: tus estadísticas crecen con el nivel
const atk = () => (fixedStats() ? 10*Math.pow(1.24, effLevel()-1) : 10*Math.pow(1.15, S.upg.fue)*adnM())*cellD().atk;
const maxHp = () => (fixedStats() ? 120*Math.pow(1.2, effLevel()-1) : 100*Math.pow(1.15, S.upg.mem)*adnM())*cellD().hp;
const taken = () => fixedStats() ? .8 : Math.pow(.96, S.upg.cit);
const atps = () => S.clase ? 0 : S.upg.mit*.3*Math.pow(1.15, S.runMax-1)*adnM();
const reward = (L, boss) => 5*Math.pow(1.2, L-1)*(boss ? 6 : 1)*Math.pow(1.2, S.upg.rib)*adnM();
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
  if (S.story && !STORY[S.story.ch]) S.story = null;
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
  return n[0] === 'evos' ? S.evos >= n[1] : n[0] === 'daily' ? S.dailyDone >= n[1] : Object.keys(S.ach).length >= n[1]; };

