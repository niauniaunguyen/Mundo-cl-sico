/* =====================================================================
   COMBATE
   ===================================================================== */
let B = null; // combate actual
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const BACT = new Set(BACTERIA);
const LOG = []; // registro de los últimos combates

function zonePool(){
  const unlocked = TYPE_ORDER.filter(id => TYPES[id].min <= S.level);
  const Z = ZONES[S.zone] || ZONES.san;
  if (!Z.types) return {pool:unlocked, fallback:false};
  const p = unlocked.filter(id => Z.types.includes(id));
  return p.length ? {pool:p, fallback:false} : {pool:unlocked, fallback:true};
}
function pickType(){
  const {pool} = zonePool(), newest = pool[pool.length-1];
  if (Math.random() < .4) return newest;
  return pool[Math.floor(Math.random()*pool.length)];
}
function bossType(){ // el jefe rota entre los tres organismos más recientes de la zona
  const {pool} = zonePool();
  return pool[Math.max(0, pool.length-1 - ((S.level-1) % Math.min(3, pool.length)))];
}
const special = e => e.special >= 0 ? SPECIAL[e.special] : null;

function eff(toolId, e, opt={}){
  const t = EFF[toolId];
  let [m, why] = t[e.type] || t.def, combo = null;
  const VE = e.var && VARIANTS[e.var].eff[toolId]; if (VE){ m = VE[0]; why = tr(VE[1]); }
  if (e.res && toolId === 'pen'){ m = .1; why = tr('Cepa resistente (SARM): su transpeptidasa PBP2a no se une a la penicilina. La lisozima sí la ataca.'); }
  if (e.drift && toolId === 'ac'){ m *= Math.pow(.5, e.drift); why = tr('Deriva antigénica: sus espículas han mutado y tus anticuerpos ya no encajan tan bien.'); }
  if (e.hidden && toolId !== 'tc' && toolId !== 'luz'){
    m *= cellD().hidden ? .5 : .15;
    why = cellD().hidden ? tr('El virus está dentro de una célula, pero como linfocito NK detectas que esa célula ha perdido el MHC-I.') : tr('El virus está escondido dentro de una célula: casi nada lo alcanza. Solo un linfocito T reconoce la célula infectada.');
  }
  if (e.inRbc && toolId !== 'art' && toolId !== 'luz'){ m *= .1; why = tr('El plasmodio está dentro de un glóbulo rojo: casi nada lo alcanza. La artemisinina sí, porque la activa el hierro del hemo.'); }
  if (e.cd4 && (toolId === 'ac' || toolId === 'tc')){ m *= Math.pow(.75, e.cd4); why += ' ' + tr('El VIH ha destruido parte de tus linfocitos T CD4 (×{k}).', {k:dec(Math.pow(.75, e.cd4).toFixed(2))}); }
  if (e.spore && toolId !== 'aut' && toolId !== 'luz'){ m *= .1; why = tr('La endospora está deshidratada y blindada con proteínas y ácido dipicolínico. Solo el autoclave la destruye.'); }
  if (e.biofilm && toolId !== 'aut' && toolId !== 'luz' && m > 0){ m *= .6; why += ' ' + tr('La biopelícula frena el ataque (×0,6).'); }
  if (e.adapted === toolId && m > 0){ m *= .4; why = tr('Se ha adaptado a esta herramienta: tras recibirla tantas veces, han sobrevivido las formas que la resisten (×0,4).'); }
  if (B && B.e === e && B.lastOk && !e.spore && !e.hidden){
    const C = COMBOS.find(c => c.first === B.last && c.then === toolId && (!c.types || c.types.includes(e.type)));
    if (C && (!opt.known || S.combos[C.id])){ if (C.m > m){ m = C.m; why = C.why; } combo = C; }
  }
  return {m, why, combo};
}
function verdict(m){
  if (m >= 2) return ['great', tr('Muy eficaz')];
  if (m >= 1) return ['ok', tr('Eficaz')];
  if (m > 0) return ['bad', tr('Poco eficaz')];
  return ['none', tr('No le afecta')];
}
// multiplicadores del árbol de habilidades para una herramienta contra un organismo
function treeMods(id, e){
  let k = 1;
  if (id === 'fago' && has('i1')) k *= 1.5;
  if (has('i2') && BACT.has(e.type)) k *= 1.25;
  if (id === 'tc' && has('c1')) k *= 1.4;
  if (has('c4') && ['vir', 'vih', 'can'].includes(e.type)) k *= 1.3;
  return k;
}
// multiplicadores de los eventos y de la fase 2 de los jefes
function dmgMods(e, forPlayer){
  let k = 1;
  if (e.ev === 'fiebre') k *= 1.25;
  if (forPlayer && e.ev === 'hipoxia') k *= .8;
  if (e.phase === 2 && e.special === 1) k *= 1.3;
  return k;
}

function makeFoe(type, boss, sp, vr, L, k){
  const max = 30*Math.pow(1.23, L-1)*(boss ? (sp >= 0 ? 6 : 4) : 1)*(TYPES[type].hpK || 1)*deepHp(L)*(vr && vr.hpK || 1)*k.hp;
  return {type, boss, special:sp, phase:1, L, hp:max, max, atk:4*Math.pow(1.2, L-1)*(boss ? (sp >= 0 ? 1.6 : 1.4) : 1)*deepAtk(L)*(vr && vr.atkK || 1)*k.atk, atpK:k.atp,
    var:vr ? vr.id : null, stall:0, turn:0, hidden:false, spore:false, dark:false, block:0, marked:0, grow:1, drift:0, biofilm:false, res:false, ev:null,
    inRbc:type === 'mal', cd4:0, dead:false};
}
const alive = () => B ? B.es.filter(x => !x.dead) : [];
function newBattle(keepHp){
  ensureDaily(); stopMusic();
  const ch = storyCh();
  const L = effLevel();
  let boss = !ch && S.kills >= KPL && S.advance && !S.practice;
  let sp = boss && L % 10 === 0 ? (L/10 - 1) % SPECIAL.length : -1;
  let type, vr = null, practice = false;
  if (ch){ let b = ch.battles[S.story.step]; if (b && b.t){ boss = true; b = b.t; }
    if (b === '@sepsis'){ boss = true; sp = 0; type = 'gn'; } else if (VARIANTS[b]){ vr = VARIANTS[b]; type = vr.base; } else type = b; }
  else if (S.practice){ type = S.practice; S.practice = null; practice = true; }
  else type = sp >= 0 ? SPECIAL[sp].type : boss ? bossType() : pickType();
  // desde el nivel 50, dos enemigos; desde el 150, tres. Los jefes especiales, los eventos y las prácticas, de uno en uno
  const n = ch || practice || sp >= 0 ? 1 : nFoes(L), K = GROUP_FOE[n];
  const x3 = !ch && L >= 100 ? HP_X100 : 1;
  const es = [makeFoe(type, boss, sp, vr, L, boss ? GROUP_FOE[1] : K)];
  for (let i = 1; i < n; i++) es.push(makeFoe(pickType(), false, -1, null, L, K));
  es.forEach((e, i) => { e.i = i; e.hp = e.max = e.max*x3; });
  if (n === 1 && !ch && !boss && !practice && L >= 5 && S.seen[type] && !vr && Math.random() < .18) es[0].blind = true;
  if (n > 1) setSynergy(es);
  const e = es[0];
  if (type === 'gp' && !boss && !ch && Math.random() < Math.min(.6, S.press/150)*(1 - .25*rl('flem'))){ e.res = true; S.sarmSeen = true; }
  if (!boss && !ch && L >= 3 && Math.random() < .15){
    const ks = Object.keys(EVENTS); let ev = ks[Math.floor(Math.random()*ks.length)];
    if (ev === 'antib' && !es.some(x => BACT.has(x.type))) ev = 'fiebre';
    if (ev === 'hipoxia' && zoneK('nohyp', false)) ev = 'inflam';
    es.forEach(x => { x.ev = ev; if (ev === 'vacuna'){ const k = S.known[x.type] = S.known[x.type] || {}; TOOLS.forEach(t => k[t.id] = true); } });
  }
  B = {es, e, php:Math.min(keepHp != null ? keepHp : maxHp(), maxHp()), cds:{}, busy:false, over:false, timer:null,
    last:null, lastOk:false, usedAb:false, onlyFago:true, turns:0, firstDone:false, why:null};
  setFoes(es); setDark(false); setZoneTint(ch ? ch.tint || ch.zone : S.zone); ambient(ch ? ch.zone : S.zone);
  renderFoe(); renderMe(); renderTools(); renderHud();
  const name = foeName(e);
  if (sp >= 0) setMsg('none', tr('Jefe especial'), tr('{n}: tiene dos fases. Al bajar a la mitad de vida cambiará de comportamiento.', {n:name}));
  else if (boss) setMsg('ok', tr('¡Jefe!'), tr('{n}: más vida y más ataque. Vencerlo te lleva al nivel {l}.', {n:name, l:L+1}), n > 1 ? tr('Viene acompañado: vence a todos para ganar.') : '');
  else if (n > 1) setMsg('ok', tr('{n} organismos a la vez', {n}), tr('Elige a cuál atacar tocándolo en la lista o en la escena. Las herramientas de área los alcanzan a todos.'),
    e.ev ? tr('Evento') + ' · ' + EVENTS[e.ev].n + ': ' + tr(EVENT_UI[e.ev].fx) : '');
  else setMsg('ok', tr('Nuevo organismo'), tr('Observa sus características y elige la herramienta que las aproveche.'),
    e.ev ? tr('Evento') + ' · ' + EVENTS[e.ev].n + ': ' + tr(EVENT_UI[e.ev].fx) : e.res ? tr('¡Cepa resistente! El uso repetido de penicilina ha seleccionado estafilococos SARM.') : '');
  resize(); // después del mensaje: su altura cambia el encuadre
  setEventFx(e.ev);
  if (boss) startMusic(sp >= 0);
  const go = () => {
    if (vr){ if (!S.varSeen[vr.id]){ S.varSeen[vr.id] = true; save(); showVariant(vr.id); } else { scheduleAuto(); narr('variant'); } return; }
    const fresh = [...new Set(es.map(x => x.type))].filter(t => !S.seen[t]);
    if (fresh.length){ fresh.forEach(t => { S.seen[t] = true; }); save(); checkAch(); fresh.forEach((t, i) => i ? whenFree(() => showSpecies(t, true)) : showSpecies(t, true)); }
    else { scheduleAuto(); if (n > 1) narr('duo'); else if (e.ev) narr('ev_' + e.ev); else if (boss) narr('boss'); else if (NARR[type]) narr(type); else if (e.res) narr('sarm'); }
  };
  if (sp >= 0) cinematic(tr('Jefe · nivel {l}', {l:L}), name, go); else go();
}
const foeName = e => e.special >= 0 ? SPECIAL[e.special].n : e.var ? (e.boss ? TY(e).boss : TY(e).n) : e.boss ? TYPES[e.type].boss : e.res ? tr('Estafilococo resistente (SARM)') : TYPES[e.type].n;
// cambiar de objetivo (lista de la ficha, escena o tecla Tab)
function selectTarget(i){
  if (!B || B.over) return;
  const x = B.es[i]; if (!x || x.dead || x === B.e) return;
  B.e = x; aimAt(x); B.why = null; renderFoe(); renderTools(); sfx.tool('fago');
}

// daño de una herramienta contra un enemigo (sin efectos de pantalla)
function toolDmg(id, x, r){
  const T = TOOL[id];
  const cb = cellD().bonus[x.type] || 1, mark = x.marked > 0 ? (has('h2') ? 2 : 1.6) : 1, vac = x.ev === 'vacuna' && id === 'ac' ? 2 : 1;
  const vul = x.var && VARIANTS[x.var].vul || 1;
  const k = (id === 'fago' ? mutK('fago')*rangeK('fago') : 1)*(id === 'lis' ? mutK('lis') : 1)*(id === 'art' ? zoneK('art') : 1)*(T.ab ? zoneK('ab') : 1)*streakK()*shieldK(x);
  return {dmg:atk()*T.pow*r.m*mark*cb*vac*vul*k*collVs(x.type, id)*treeMods(id, x)*dmgMods(x, true)*rnd(.9, 1.1), cb, mark, vac, vul};
}
// los enemigos que han llegado a 0 desaparecen; si quedan otros, el objetivo pasa al siguiente
function reap(){
  for (const x of B.es) if (!x.dead && x.hp <= 0){ x.dead = true; killFoeObj(x, B.last); burst(x.pos, TY(x).col, S.calm ? 16 : 40, 4); if (B.es.length > 1) floatText(tr('Vencido'), x.pos.clone().add(V(0,1,0)), 'great'); }
  const left = alive();
  if (left.length && B.e.dead){ B.e = left[0]; aimAt(B.e); }
  return left.length;
}

function useTool(id){
  if (!B || B.busy || B.over || !owns(id) || (B.cds[id] || 0) > 0 || !$('#modal').hidden) return;
  const T = TOOL[id], e = B.e;
  B.busy = true; clearTimeout(B.timer); B.turns++;
  const r = eff(id, e);
  const hitList = T.aoe ? alive() : [e];
  hitList.forEach(x => { (S.known[knowKey(x)] = S.known[knowKey(x)] || {})[id] = true; });
  let cenProc = false;
  if (toolCd(T)){ if (adv('cen') && Math.random() < .07*adv('cen')){ cenProc = true; ring(P_POS, 0xff9fd8); } else B.cds[id] = toolCd(T) + 1; }
  if (T.ab){ B.usedAb = true; S.press = Math.min(100, S.press + 4); }
  if (id !== 'fago') B.onlyFago = false;
  B.why = {tool:id, m:r.m};
  renderTools();
  sfx.tool(id);
  const from = P_POS.clone().add(V(.6,.3,0)), to = E_POS.clone();
  const go = () => {
    const Ty = TY(e);
    const dodge = !T.aoe && (Ty.dodge || 0) && id !== 'luz' && !e.spore && !(Ty.V && Ty.V.markStops && e.marked > 0) && Math.random() < Ty.dodge;
    let ok = false;
    if (dodge){
      floatText(tr('Esquiva'), E_POS.clone().add(V(0,1.2,0)), 'info');
      setMsg('bad', tr('Esquiva'), Ty.dodgeWhy, '');
      tone(200, .1, 'sine', .04);
    } else if (id === 'luz'){
      ok = r.m > 0;
      if (e.type === 'veg' && !e.dark){ e.dark = true; floatText(tr('Sin fotosíntesis'), E_POS.clone().add(V(0,1.4,0)), 'great'); }
      else floatText(tr('Sin efecto'), E_POS.clone().add(V(0,1.4,0)), 'none');
      setMsg(r.m > 0 ? 'great' : 'none', `${T.n} · ${r.m > 0 ? tr('Muy eficaz') : tr('No le afecta')}`, r.why);
      sfx.hit(r.m*2);
    } else if (T.aoe){
      // herramienta de área: cada enemigo recibe según sus propias características
      let total = 0;
      for (const x of hitList){
        const rx = eff(id, x), d = rx.m > 0 ? toolDmg(id, x, rx).dmg : 0;
        x.hp = Math.max(0, x.hp - d); total += d;
        floatText(rx.m > 0 ? fmt(d) : tr('Inmune'), x.pos.clone().add(V(0,1.2,0)), rx.m >= 2 ? 'great' : rx.m >= 1 ? 'dmg' : rx.m > 0 ? 'bad' : 'none', T.col);
        if (rx.m > 0) squash(x);
        if (rx.m > 0) burst(x.pos, T.col, rx.m >= 2 ? 30 : 14, 3);
      }
      ok = total > 0;
      const [v, l] = verdict(r.m), extra = [];
      if (hitList.length > 1) extra.push(tr('Herramienta de área: alcanza a los {n} organismos ({d} de daño en total).', {n:hitList.length, d:fmt(total)}));
      if (cenProc) extra.push(tr('Centrosoma: esta herramienta no gasta recarga.'));
      if (SIDE[id] && mutK('side') > 0){ const sd = maxHp()*SIDE[id][0]*(has('i3') ? .4 : 1); B.php = Math.max(1, B.php - sd);
        floatText('−' + fmt(sd), P_POS.clone().add(V(0,1.3,0)), 'hurt'); extra.push(tr(SIDE[id][1])); renderMe(); }
      setMsg(v, `${T.n} · ${l} (×${dec(Math.round(r.m*100)/100)})`, r.why, extra.join(' '));
      shake = S.calm ? 0 : .2; impact(E_BASE, T.col); sfx.hit(Math.max(1, r.m));
      if (r.m >= 2){ dailyProg('great'); narr('great'); }
    } else {
      ok = r.m > 0;
      const crit = has('c2') && r.m > 0 && Math.random() < .15 ? 2 : 1;
      const {dmg:d0, cb, mark, vac, vul} = toolDmg(id, e, r), dmg = d0*crit;
      e.hp = Math.max(0, e.hp - dmg);
      const [v, l] = verdict(r.m);
      floatText(r.m > 0 ? fmt(dmg) : tr('Inmune'), E_POS.clone().add(V(0,1.2,0)), r.m >= 2 ? 'great' : r.m >= 1 ? 'dmg' : r.m > 0 ? 'bad' : 'none', T.col);
      if (r.m > 0) squash(e); if (r.m >= 2 || crit > 1) camPunch(crit > 1 ? .84 : .9);
      const extra = [];
      if (S.streak >= 2 && r.m > 0) extra.push(tr('Racha de {n}: +{p} % de daño.', {n:S.streak, p:Math.round((streakK() - 1)*100)}));
      if (shieldK(e) < 1 && r.m > 0) extra.push(tr('Protegido por la biopelícula de su compañero (×0,75).'));
      // gránulos secretores: parte del daño salpica a los demás enemigos
      const others = alive().filter(x => x !== e);
      if (adv('sec') && dmg > 0 && others.length){ const sd = dmg*.1*adv('sec');
        for (const x of others){ x.hp = Math.max(0, x.hp - sd); floatText('−' + fmt(sd) + ' · ' + tr('gránulos'), x.pos.clone().add(V(0,1.3,0)), 'evt ev-golgi');
          projectile(E_POS.clone(), x.pos.clone(), 0xff7ad9, 4, 300, null, null); }
        extra.push(tr('Gránulos secretores: {d} de daño a cada uno de los demás.', {d:fmt(sd)})); }
      if (r.combo){ extra.push(tr('Combinación: {n}.', {n:r.combo.n}));
        if (!S.combos[r.combo.id]){ S.combos[r.combo.id] = true; toast(tr('¡Combinación descubierta: {n}!', {n:r.combo.n})); }
        S.comboCount++; dailyProg('combo'); }
      if (crit > 1) extra.push(tr('¡Golpe crítico de perforina!'));
      if (cenProc) extra.push(tr('Centrosoma: esta herramienta no gasta recarga.'));
      if (r.m > 0 && e.ev === 'fiebre') extra.push(tr('Fiebre: +25 % de daño.'));
      if (r.m > 0 && e.ev === 'hipoxia') extra.push(tr('Hipoxia: −20 % de daño.'));
      if (vac > 1 && r.m > 0) extra.push(tr('Vacuna: los anticuerpos hacen el doble.'));
      if (id === 'ac' && r.m > 0 && !e.hidden && !e.inRbc){ e.marked = has('h1') ? 6 : 4; extra.push(has('h1') ? tr('Opsonizado: más daño durante 5 turnos.') : tr('Opsonizado: +60 % de daño durante 3 turnos.')); }
      if (vul > 1 && r.m > 0) extra.push(tr('Sin citoesqueleto: +40 % de daño.'));
      if (id === 'uv' && r.m > 0 && e.var && VARIANTS[e.var].uvStall){ e.stall = VARIANTS[e.var].uvStall + 1; extra.push(tr('Sus ribosomas se quedan sin instrucciones: no se repara durante 2 turnos.')); }
      if (id === 'tax' && r.m > 0){ e.block = 3; extra.push(tr('Huso mitótico bloqueado durante 3 turnos.')); }
      if (mark > 1 && r.m > 0) extra.push(tr('Daño aumentado por la opsonización.'));
      if (cb > 1 && r.m > 0) extra.push(tr('{c}: ×{k} contra este organismo.', {c:cellD().n, k:dec(cb)}));
      setMsg(v, `${T.n} · ${l} (×${dec(Math.round(r.m*100)/100)})`, r.why, extra.join(' '));
      if (r.m > 0){ burst(to, T.col, r.m >= 2 ? 40 : 18, r.m >= 2 ? 4 : 2.5); shake = S.calm ? 0 : r.m >= 2 ? .25 : .1; if (r.m >= 2) impact(to, T.col); }
      if (r.m >= 2){ dailyProg('great'); narr('great'); }
      else if (r.m === 0) narr('immune');
      if (r.combo) narr('combo');
      // efecto secundario sobre tu propia célula
      if (SIDE[id] && mutK('side') > 0){ const sd = maxHp()*SIDE[id][0]*(has('i3') ? .4 : 1); B.php = Math.max(1, B.php - sd);
        floatText('−' + fmt(sd), P_POS.clone().add(V(0,1.3,0)), 'hurt'); extra.push(tr(SIDE[id][1])); narr('side'); renderMe(); }
      if (extra.length){ $('#msgX').textContent = extra.join(' '); placeNarr(); }
      sfx.hit(r.m);
    }
    if (!B.firstDone){ B.firstDone = true; S.first.n++; if (r.m >= 2) S.first.ok++; }
    if (!dodge && id !== 'luz' && !fixedStats()){ if (r.m >= 2) S.streak = (S.streak || 0) + 1; else if (r.m < 1) S.streak = 0; renderHud(); }
    B.uses = B.uses || {}; B.uses[id] = (B.uses[id] || 0) + 1;
    if (e.boss && e.special < 0 && !e.adapted && e.hp > 0 && e.hp < e.max*.5){
      const top = Object.entries(B.uses).filter(([t]) => t !== 'luz').sort((a, b) => b[1] - a[1])[0];
      if (top && top[1] >= 2){ e.adapted = top[0]; toast(tr('{n} se ha adaptado: {t} ya no le hace tanto daño. Cambia de estrategia.', {n:foeName(e), t:TOOL[top[0]].n})); impact(E_POS, 0xffc65c); }
    }
    B.last = id; B.lastOk = ok;
    // fase 2 de los jefes especiales
    if (e.special >= 0 && e.phase === 1 && e.hp > 0 && e.hp < e.max*.5){
      e.phase = 2; toast(special(e).n + ' · ' + tr('fase 2')); $('#msgX').textContent = special(e).p2; shake = S.calm ? 0 : .35; impact(E_POS, 0xff4f7b);
    }
    const left = reap();
    renderFoe(); renderTools();
    if (!left) return setTimeout(win, 250);
    B.timer = setTimeout(enemyTurn, 420/(S.auto ? speed() : 1));
  };
  if (T.aoe){ hitList.forEach((x, i) => projectile(from.clone(), x.pos.clone(), T.col, 8, 520, i ? null : go, id)); }
  else if (id === 'fago'){ const dir = E_POS.clone().sub(P_POS); tween(560, p => PL.reach(p, dir)); lunge(player, dir.clone().normalize().multiplyScalar(1.3), 560, go); }
  else projectile(from, to, T.col, id === 'luz' ? 1 : 10, 520, go, id);
  if (id === 'luz') setDark(true);
}

// lo que hace cada enemigo en su turno antes de atacar (curarse, esconderse, mutar…)
function foeEffects(e, notes){
  const many = B.es.length > 1, who = s => many ? foeName(e) + ': ' + s : s;
  const heal = (f, why) => { const h = e.max*f; e.hp = Math.min(e.max, e.hp + h); floatText('+' + fmt(h), e.pos.clone().add(V(.6,1.5,0)), 'heal'); notes.push(who(why)); };
  switch (e.type){
    case 'gp': if (e.turn % 3 === 0) heal(.15, tr('Fisión binaria: la colonia se divide y recupera un 15 % de vida.')); break;
    case 'lev': if (e.turn % 3 === 0) heal(.15, tr('Gemación: le brota una yema nueva (+15 % de vida).')); break;
    case 'vir':
      e.hidden = !e.hidden; notes.push(who(e.hidden ? tr('El virus entra en una célula y se replica a escondidas.') : tr('Nuevos viriones salen de la célula huésped: vuelve a estar expuesto.')));
      if (e.turn % 4 === 0){ e.drift++; notes.push(who(tr('Deriva antigénica: sus espículas mutan y los anticuerpos pierden eficacia.'))); } break;
    case 'veg': if (!e.dark) heal(.08*zoneK('veg'), zoneK('veg') > 1 ? tr('Fotosíntesis con mucha luz: se repara el doble (+16 %).') : tr('Fotosíntesis: con la luz fabrica glucosa y se repara (+8 %).')); break;
    case 'can': if (e.block > 0) notes.push(who(tr('El taxol frena su división.'))); else heal(.12, tr('Mitosis descontrolada: +12 % de vida.')); break;
    case 'bac': if (!e.spore && e.hp < e.max*.35){ e.spore = true; notes.push(who(tr('Esporulación: forma una endospora resistente y deja de atacar.'))); burst(e.pos, 0x8fffe8, 30, 2); } break;
    case 'pri': e.grow *= 1.12; notes.push(who(tr('Convierte proteínas sanas en priones: su ataque crece un 12 %.'))); break;
    case 'mal': { const c = e.turn % 3; e.inRbc = c !== 2;
      notes.push(who(e.inRbc ? tr('El plasmodio se oculta dentro de un glóbulo rojo.') : tr('El eritrocito revienta y salen merozoítos: ahora está expuesto.'))); break; }
    case 'vih': e.cd4++; e.hidden = e.turn % 3 === 0;
      notes.push(who(tr('El VIH infecta más linfocitos T CD4: tus anticuerpos y linfocitos T pierden eficacia.') + (e.hidden ? ' ' + tr('Además entra en latencia, integrado en el ADN de una célula.') : ''))); break;
    case 'ten': heal(.06, tr('Su cuello forma nuevas proglótides: recupera un 6 %.')); break;
  }
  synergyTurn(e, notes, heal, who);
  const VR = e.var && VARIANTS[e.var];
  if (VR && VR.regen){ if (e.stall > 0) notes.push(tr('Sin ARNm nuevo, sus ribosomas están parados: no se repara.')); else heal(VR.regen, tr('Sus ribosomas fabrican proteínas sin parar: se repara un 9 %.')); }
  if (VR && VR.atkK && VR.atkK < 1 && e.turn === 1) notes.push(tr('Sin mitocondrias le falta ATP: ataca muy débil.'));
  if ((e.type === 'gp' || e.type === 'gn') && e.turn === 6 && !e.biofilm){ e.biofilm = true; notes.push(who(tr('Biopelícula: se rodea de una matriz de polisacáridos que frena tus ataques (×0,6). El autoclave la atraviesa.'))); }
  if (e.ev === 'antib' && BACT.has(e.type)){ const d = e.max*.08; e.hp = Math.max(0, e.hp - d); floatText('−' + fmt(d) + ' · ' + tr('antibiótico'), e.pos.clone().add(V(-.5,1.5,0)), 'evt ev-antib'); notes.push(who(tr('El antibiótico en sangre le resta un 8 %.'))); }
  // fase 2 de jefes especiales
  if (e.phase === 2){
    if (e.special === 0){ const d = maxHp()*.05; B.php = Math.max(0, B.php - d); notes.push(tr('Choque endotóxico: el LPS te resta un 5 % de vida.')); }
    if (e.special === 2 && !(e.block > 0)) heal(.1, tr('Angiogénesis: los vasos nuevos lo curan un 10 %.'));
    if (e.special === 3){ e.grow *= 1.2; notes.push(tr('Agregación: su ataque crece un 20 %.')); }
    if (e.special === 4) heal(.08, tr('Citoadherencia: recupera un 8 %.'));
  }
}

function enemyTurn(){
  if (!B || B.over) return;
  const notes = [], ev = B.es[0].ev;
  // Golgi: tus vesículas secretadas dañan a tu objetivo cada turno
  if (adv('gol') && B.e.hp > 0){ const t = B.e, d = atk()*.06*adv('gol'); t.hp = Math.max(0, t.hp - d);
    projectile(P_POS.clone().add(V(.5,.3,0)), t.pos.clone(), 0xffc65c, 3 + adv('gol'), 420, () => floatText('−' + fmt(d) + ' · Golgi', t.pos.clone().add(V(.4,1.6,0)), 'evt ev-golgi'), null); }
  for (const x of alive()){ if (x.hp <= 0) continue; x.turn++; foeEffects(x, notes); }
  if (ev === 'inflam'){ const h = maxHp()*.06; B.php = Math.min(maxHp(), B.php + h); floatText('+' + fmt(h) + ' · ' + tr('inflamación'), P_POS.clone().add(V(0,1.5,0)), 'evt ev-inflam'); notes.push(tr('Inflamación: recuperas un 6 % de vida.')); }
  if (ev === 'fiebre' && B.es[0].turn === 1) notes.push(tr('La fiebre también aumenta su daño (+25 %).'));
  if (has('i4') && B.php > 0){ const h = maxHp()*.04; B.php = Math.min(maxHp(), B.php + h); }
  // peroxisomas: la catalasa te cura cada turno
  if (adv('per') && B.php > 0){ const h = maxHp()*.015*adv('per'); B.php = Math.min(maxHp(), B.php + h); burst(P_POS, 0x8fff9a, 6 + 2*adv('per'), 1.2); floatText('+' + fmt(h) + ' · ' + tr('peroxisomas'), P_POS.clone().add(V(-.5,1.6,0)), 'evt ev-inflam'); }
  if (!reap()){ renderFoe(); return setTimeout(win, 250); }
  const finish = () => {
    for (const k in B.cds) if (B.cds[k] > 0) B.cds[k]--;
    for (const x of B.es){ if (x.marked > 0) x.marked--; if (x.block > 0) x.block--; if (x.stall > 0) x.stall--; }
    if (notes.length){ $('#msgX').textContent = notes.join(' '); placeNarr(); }
    if (B.php > 0) B.busy = false;
    B.why = null;
    renderFoe(); renderMe(); renderTools();
    if (B.php <= 0) return setTimeout(lose, 300);
    if (B.php < maxHp()*.25) narr('lowhp');
    scheduleAuto();
  };
  // cada enemigo vivo ataca, uno detrás de otro
  const queue = alive();
  const next = () => {
    if (B.over) return;
    const e = queue.shift(); if (!e || B.php <= 0) return finish();
    const many = B.es.length > 1, who = s => many ? foeName(e) + ': ' + s : s;
    if (e.spore){ notes.push(who(tr('La endospora está en reposo: no ataca.'))); return next(); }
    if (e.type === 'tbc' && e.turn % 2){ notes.push(who(tr('Crecimiento lento: esta vez no ataca.'))); return next(); }
    const fever = e.type === 'mal' && e.turn % 3 === 0;
    if (fever) notes.push(who(tr('Acceso de fiebre: al reventar a la vez muchos eritrocitos, el golpe es más fuerte.')));
    const hits = TY(e).hits || 1;
    let i = 0;
    if (hits > 1) notes.push(who(tr('Sus cilios baten en ondas: ataca dos veces.')));
    const hit = () => {
      const dir = P_POS.clone().sub(e.pos).normalize().multiplyScalar(1.4);
      lunge(e.obj.g, dir, many ? 300 : 360, () => {
        if (Math.random() < mutK('dodge', 0)){ floatText(tr('Esquivas'), P_POS.clone().add(V(0,1.3,0)), 'info'); if (++i < hits && B.php > 0) hit(); else next(); return; }
        const dmg = e.atk*e.grow*taken()*rangeK('hurt')*dmgMods(e, false)*(fever ? 1.5 : 1)*rnd(.85, 1.15)/(hits > 1 ? 1.6 : 1);
        B.php = Math.max(0, B.php - dmg);
        floatText('−' + fmt(dmg), P_POS.clone().add(V(0,1.3,0)), 'hurt');
        burst(P_POS, 0xff4f7b, 12, 2); shake = S.calm ? 0 : .12; sfx.hurt();
        renderMe();
        if (++i < hits && B.php > 0) hit(); else next();
      });
    };
    hit();
  };
  next();
}

function win(){
  if (B.over) return; B.over = true; stopMusic();
  const e = B.es[0];
  if (storyCh()) return storyWin(e);
  let g = 0;
  for (const x of B.es){
    g += reward(x.L, x.boss)*(x.ev === 'hipoxia' ? 1.5 : 1)*(x.special >= 0 ? 2 : 1)*collAtpVs(x.type)*(x.atpK || 1)*(x.idOk ? 2 : 1);
    S.totalKills++; S.defeated[x.type] = (S.defeated[x.type] || 0) + 1;
    if (BACT.has(x.type) && !B.usedAb){ S.press = Math.max(0, S.press - 2); dailyProg('noab'); if (S.wk !== weekKey()){ S.wk = weekKey(); S.wkNoAb = 0; } S.wkNoAb = (S.wkNoAb || 0) + 1; }
    dailyProg('kills');
  }
  S.atp += g;
  const boss = B.es.some(x => x.boss);
  if (e.special >= 0){ S.specialWins++; S.lpts++; toast(tr('+1 punto del árbol inmunitario')); }
  if (B.onlyFago) dailyProg('fago');
  if (B.turns <= 3) dailyProg('quick');
  if (boss) dailyProg('boss');
  LOG.unshift({L:e.L, n:B.es.map(foeName).join(' + '), turns:B.turns, g, win:true}); LOG.length = Math.min(LOG.length, 8);
  floatText('+' + fmt(g) + ' ATP', E_BASE.clone().add(V(0,.6,0)), 'atp');
  burst(E_BASE, TY(e).col, S.calm ? 20 : 60, 4.5); sfx.win();
  let hp;
  if (boss){
    S.stats.lvl[e.L] = Math.round((Date.now() - (S.stats.lvlStart || Date.now()))/1000); S.stats.lvlStart = Date.now();
    S.level++; S.kills = 0; if (S.level > S.runMax) S.runMaxT = Date.now(); S.runMax = Math.max(S.runMax, S.level); S.best = Math.max(S.best, S.level);
    var mile = milestone(S.level);
    hp = maxHp();
    const nt = TYPE_ORDER.some(id => TYPES[id].min === S.level);
    toast(tr('Nivel {l}.', {l:S.level}) + (nt ? ' ' + tr('Aparece un organismo nuevo.') : ''));
  } else {
    S.kills = Math.min(KPL, S.kills + 1);
    hp = Math.min(maxHp(), B.php + maxHp()*.35);
  }
  setMsg('great', tr('Victoria'), tr('+{g} ATP.', {g:fmt(g)}) + ' ' + (boss ? tr('Jefe derrotado.') : tr('Recuperas un 35 % de vida.')), e.ev === 'hipoxia' ? tr('Incluye un 50 % más de ATP por la hipoxia.') : '');
  B.es.forEach(dropLoot);
  B.es.forEach(x => { if (x.blind) toast(tr('Era {n}.', {n:TYPES[x.type].n})); });
  checkAch(); save(); renderHud(); renderLog(); pushBoard(); evoNudge();
  if (typeof mile !== 'undefined' && mile) setTimeout(() => showMilestone(mile, () => newBattle(hp)), 900);
  else setTimeout(() => newBattle(hp), 900/(S.auto ? speed() : 1));
}

function lose(){
  if (B.over) return; B.over = true; sfx.lose(); stopMusic();
  const e = B.es[0];
  if (storyCh()){ setMsg('none', tr('Derrota'), tr('Vuelve a intentarlo: este paso de la historia empieza de nuevo.')); burst(P_POS, 0xff4f7b, 40, 3); save(); return setTimeout(() => newBattle(), 1500); }
  S.stats.deaths[e.L] = (S.stats.deaths[e.L] || 0) + 1;
  LOG.unshift({L:e.L, n:B.es.map(foeName).join(' + '), turns:B.turns, g:0, win:false}); LOG.length = Math.min(LOG.length, 8);
  let txt;
  if (B.es.some(x => x.boss)){ S.advance = false; txt = tr('El jefe te ha vencido. Se ha desactivado «Avanzar»: reúne ATP, mejora tus orgánulos y vuelve a intentarlo.'); }
  else { S.level = Math.max(1, S.level-1); S.kills = 0; txt = tr('Te retiras al nivel {l} para recuperarte.', {l:S.level}); }
  burst(P_POS, 0xff4f7b, 40, 3);
  setMsg('none', tr('Derrota'), txt);
  toast(txt);
  save(); renderHud(); renderLog(); evoNudge();
  setTimeout(() => newBattle(), 1500);
}

// puntuación de una herramienta contra el objetivo (las de área suman lo que hacen a todos)
function toolScore(T, e){
  const kn = (x, id) => id === 'fago' || (S.known[knowKey(x)] && S.known[knowKey(x)][id]);
  if (T.aoe) return alive().reduce((a, x) => a + (kn(x, T.id) ? T.pow*eff(T.id, x, {known:true}).m : 0), 0);
  if (!kn(e, T.id)) return -1;
  const r = eff(T.id, e, {known:true});
  if (T.id === 'luz') return e.type === 'veg' && !e.dark ? 99 : -1;
  let s = T.pow*r.m;
  if (T.id === 'ac' && r.m > 0 && e.marked === 0 && !e.hidden) s *= 1.9;
  if (T.id === 'tax' && e.type === 'can' && e.block === 0) s *= 1.6;
  // preparar una combinación conocida
  if (COMBOS.some(c => c.first === T.id && S.combos[c.id] && (!c.types || c.types.includes(e.type)) && owns(c.then) && !(B.cds[c.then] > 1)) && r.m > 0) s *= 1.3;
  return s;
}
function autoPick(){
  // en el modo automático, ataca primero al enemigo con menos vida
  const left = alive();
  if (left.length > 1){ const t = left.reduce((a, x) => x.hp < a.hp ? x : a); if (t !== B.e){ B.e = t; aimAt(t); renderFoe(); } }
  const e = B.e; let best = null, bs = -1;
  for (const T of TOOLS){
    if (!owns(T.id) || (B.cds[T.id] || 0) > 0) continue;
    const s = toolScore(T, e);
    if (s > bs){ bs = s; best = T.id; }
  }
  if (S.auto && !fixedStats()){ const want = best === 'fago' || !best ? 'near' : B.php < maxHp()*.5 ? 'far' : S.range; if (want !== S.range){ S.range = want; renderHud(); } }
  return best || (TOOLS.find(t => owns(t.id) && !(B.cds[t.id] > 0)) || TOOL.fago).id;
}
function scheduleAuto(){
  if (!B || B.over || B.busy) return;
  clearTimeout(B.timer);
  if (S.auto && canAuto() && $('#modal').hidden && !CINE) B.timer = setTimeout(() => useTool(autoPick()), 650/speed());
}


// ---- Eventos especiales (campañas con capítulos) ----
function storyWin(e){
  const g = reward(e.L, e.boss);
  S.atp += g; S.totalKills++; if (!e.var) S.defeated[e.type] = (S.defeated[e.type] || 0) + 1;
  floatText('+' + fmt(g) + ' ATP', E_POS.clone().add(V(0,.6,0)), 'atp');
  burst(E_POS, TY(e).col, S.calm ? 20 : 60, 4.5); sfx.win();
  const X = curEx(), ch = storyCh(); S.story.step++;
  setMsg('great', tr('Victoria'), tr('+{g} ATP.', {g:fmt(g)}));
  if (S.story.step < ch.battles.length){ save(); renderHud(); return setTimeout(() => newBattle(), 900); }
  S.story.ch++; S.story.step = 0;
  if (S.story.ch >= X.chapters.length){
    S.story = null; let first = !S.evDone[X.id]; S.evDone[X.id] = true; if (X.id === 'inf') S.storyDone = true;
    if (X.daily){ S.evDone.dia = false; first = S.expDay !== today(); if (first){ S.expDay = today(); const t = X.chapters[0].battles.at(0); S.samp[t] = (S.samp[t] || 0) + 1; } }
    if (first){ S.adn += X.reward.adn || 0; S.lpts += X.reward.lpts || 0; }
    const rel = first && X.id !== 'inf' && !X.daily ? pickRelic() : null; if (rel) S.relics[rel] = (S.relics[rel] || 0) + 1;
    save(); rebuildPlayer(); renderHud();
    return setTimeout(() => { showStoryEnd(X, first); if (rel) whenFree(() => showRelic(rel)); }, 900); }
  save(); rebuildPlayer(); renderHud();
  setTimeout(() => showChapter(newBattle), 900);
}
function startStory(id){
  if (B){ B.over = true; clearTimeout(B.timer); }
  S.story = {ev:id, ch:0, step:0}; save(); rebuildPlayer(); renderHud(); narr('ex_' + id, true);
  showChapter(newBattle);
}
function leaveStory(){
  if (B){ B.over = true; clearTimeout(B.timer); }
  S.story = null; save(); rebuildPlayer(); renderHud(); newBattle();
}

// ---- Coleccionables: muestras y hallazgos ----
const whenFree = fn => { if ($('#modal').hidden && !CINE) fn(); else setTimeout(() => whenFree(fn), 600); };
function pickRelic(){
  const pool = RELICS.filter(r => (S.relics[r.id] || 0) < 3); if (!pool.length) return null;
  const w = pool.map(r => S.relics[r.id] ? 1 : 3), tot = w.reduce((a, b) => a + b, 0); let x = Math.random()*tot;
  for (let i = 0; i < pool.length; i++){ x -= w.at(i); if (x <= 0) return pool.at(i).id; }
  return pool.at(-1).id;
}
function dropLoot(e){
  if (S.clase || storyCh() || e.var) return;
  // muestra del organismo vencido
  if (Math.random() < (e.boss ? .25 : .04)*(1 + .25*rl('koch'))*zoneK('samp')){
    const before = stars(e.type); S.samp[e.type] = (S.samp[e.type] || 0) + 1;
    floatText('+1 ' + tr('muestra'), E_POS.clone().add(V(-.6,1.1,0)), 'evt ev-sample'); sfx.ach();
    if (stars(e.type) > before) toast(tr('Biobanco: {n} sube a {s}. +6 % de daño y +5 % de ATP contra él.', {n:TYPES[e.type].n, s:'★'.repeat(stars(e.type))}));
    else toast(tr('Biobanco: +1 muestra de {n} ({k}/{t}).', {n:TYPES[e.type].n, k:S.samp[e.type], t:STARS.find(x => x > S.samp[e.type]) || STARS.at(-1)}));
  }
  // hallazgo científico: en los jefes
  if (!e.boss) return;
  let p = e.special >= 0 ? (S.relSp[e.special] ? .4 : 1) : .06;
  if (Math.random() >= p) return;
  if (e.special >= 0) S.relSp[e.special] = true;
  const id = pickRelic(); if (!id) return;
  S.relics[id] = (S.relics[id] || 0) + 1;
  rebuildPlayer(); setTimeout(() => whenFree(() => showRelic(id)), 1000);
}
// si llevas un rato sin batir tu récord y evolucionar compensa, te lo sugiere
function evoNudge(){
  if (S.clase || storyCh()) return;
  const g = evoGain(), stuck = Date.now() - (S.runMaxT || Date.now()) > 8*60e3;
  S.evoHint = stuck && g >= Math.max(4, S.adn*.25);
  if (S.evoHint && Date.now() - (S.nudged || 0) > 15*60e3){ S.nudged = Date.now(); toast(tr('Llevas un rato sin avanzar. Si evolucionas ahora, tu linaje gana {g} de ADN (pestaña Evolución).', {g})); }
  renderHud();
}

// ---- Hitos: el nivel 30 abre los tejidos profundos ----
function milestone(L){
  if (L < 30 || L % 10 || S.miles[L]) return null;
  S.miles[L] = true;
  if (L === 50){ S.adn += 5; S.lpts += 2; return {L, t:tr(MILESTONE.t50), d:tr(MILESTONE.d50), r:tr(MILESTONE.r50)}; }
  if (L === 100){ S.adn += 10; S.lpts += 3; return {L, t:tr(MILESTONE.t100), d:tr(MILESTONE.d100), r:tr(MILESTONE.r100), lab:true}; }
  if (L === 150){ S.adn += 15; S.lpts += 3; return {L, t:tr(MILESTONE.t150), d:tr(MILESTONE.d150), r:tr(MILESTONE.r150)}; }
  if (L === 30){ S.adn += 8; S.lpts += 3; return {L, t:tr(MILESTONE.t30), d:tr(MILESTONE.d30), r:tr(MILESTONE.r30)}; }
  S.adn += 3; S.lpts += 1; return {L, t:tr(MILESTONE.tN, {l:L}), d:'', r:tr(MILESTONE.rN)};
}
