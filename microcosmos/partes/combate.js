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

function newBattle(keepHp){
  ensureDaily(); stopMusic();
  const ch = storyCh();
  const L = effLevel();
  let boss = !ch && S.kills >= KPL && S.advance && !S.practice;
  let sp = boss && L % 10 === 0 ? (L/10 - 1) % SPECIAL.length : -1;
  let type;
  if (ch){ const b = ch.battles[S.story.step]; if (b === '@sepsis'){ boss = true; sp = 0; type = 'gn'; } else type = b; }
  else if (S.practice){ type = S.practice; S.practice = null; }
  else type = sp >= 0 ? SPECIAL[sp].type : boss ? bossType() : pickType();
  const max = 30*Math.pow(1.25, L-1)*(boss ? (sp >= 0 ? 6 : 4) : 1)*(TYPES[type].hpK || 1);
  const e = {type, boss, special:sp, phase:1, L, hp:max, max, atk:4*Math.pow(1.2, L-1)*(boss ? (sp >= 0 ? 1.6 : 1.4) : 1),
    turn:0, hidden:false, spore:false, dark:false, block:0, marked:0, grow:1, drift:0, biofilm:false, res:false, ev:null,
    inRbc:type === 'mal', cd4:0};
  if (type === 'gp' && !boss && !ch && Math.random() < Math.min(.6, S.press/150)){ e.res = true; S.sarmSeen = true; }
  if (!boss && !ch && L >= 3 && Math.random() < .15){
    const ks = Object.keys(EVENTS); e.ev = ks[Math.floor(Math.random()*ks.length)];
    if (e.ev === 'antib' && !BACT.has(type)) e.ev = 'fiebre';
    if (e.ev === 'vacuna'){ const k = S.known[type] = S.known[type] || {}; TOOLS.forEach(t => k[t.id] = true); }
  }
  B = {e, php:Math.min(keepHp != null ? keepHp : maxHp(), maxHp()), cds:{}, busy:false, over:false, timer:null,
    last:null, lastOk:false, usedAb:false, onlyFago:true, turns:0, firstDone:false, why:null};
  setFoe(e); setDark(false); setZoneTint(ch ? ch.zone : S.zone); ambient(ch ? ch.zone : S.zone);
  renderFoe(); renderMe(); renderTools(); renderHud();
  const name = foeName(e);
  if (sp >= 0) setMsg('none', tr('Jefe especial'), tr('{n}: tiene dos fases. Al bajar a la mitad de vida cambiará de comportamiento.', {n:name}));
  else if (boss) setMsg('ok', tr('¡Jefe!'), tr('{n}: más vida y más ataque. Vencerlo te lleva al nivel {l}.', {n:name, l:L+1}));
  else setMsg('ok', tr('Nuevo organismo'), tr('Observa sus características y elige la herramienta que las aproveche.'),
    e.ev ? tr('Evento') + ' · ' + EVENTS[e.ev].n + ': ' + tr(EVENT_UI[e.ev].fx) : e.res ? tr('¡Cepa resistente! El uso repetido de penicilina ha seleccionado estafilococos SARM.') : '');
  resize(); // después del mensaje: su altura cambia el encuadre
  setEventFx(e.ev);
  if (boss) startMusic(sp >= 0);
  const go = () => {
    if (!S.seen[type]){ S.seen[type] = true; save(); checkAch(); showSpecies(type, true); }
    else { scheduleAuto(); if (e.ev) narr('ev_' + e.ev); else if (boss) narr('boss'); else if (NARR[type]) narr(type); else if (e.res) narr('sarm'); }
  };
  if (sp >= 0) cinematic(tr('Jefe · nivel {l}', {l:L}), name, go); else go();
}
const foeName = e => e.special >= 0 ? SPECIAL[e.special].n : e.boss ? TYPES[e.type].boss : e.res ? tr('Estafilococo resistente (SARM)') : TYPES[e.type].n;

function useTool(id){
  if (!B || B.busy || B.over || !owns(id) || (B.cds[id] || 0) > 0 || !$('#modal').hidden) return;
  const T = TOOL[id], e = B.e;
  B.busy = true; clearTimeout(B.timer); B.turns++;
  const r = eff(id, e);
  (S.known[e.type] = S.known[e.type] || {})[id] = true;
  if (toolCd(T)) B.cds[id] = toolCd(T) + 1;
  if (T.ab){ B.usedAb = true; S.press = Math.min(100, S.press + 4); }
  if (id !== 'fago') B.onlyFago = false;
  B.why = {tool:id, m:r.m};
  renderTools();
  sfx.tool(id);
  const from = P_POS.clone().add(V(.6,.3,0)), to = E_POS.clone();
  const go = () => {
    const Ty = TYPES[e.type];
    const dodge = (Ty.dodge || 0) && id !== 'luz' && !e.spore && Math.random() < Ty.dodge;
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
    } else {
      ok = r.m > 0;
      const cb = cellD().bonus[e.type] || 1, mark = e.marked > 0 ? (has('h2') ? 2 : 1.6) : 1, vac = e.ev === 'vacuna' && id === 'ac' ? 2 : 1;
      const crit = has('c2') && r.m > 0 && Math.random() < .15 ? 2 : 1;
      const dmg = atk()*T.pow*r.m*mark*cb*vac*crit*treeMods(id, e)*dmgMods(e, true)*rnd(.9, 1.1);
      e.hp = Math.max(0, e.hp - dmg);
      const [v, l] = verdict(r.m);
      floatText(r.m > 0 ? fmt(dmg) : tr('Inmune'), E_POS.clone().add(V(0,1.2,0)), r.m >= 2 ? 'great' : r.m >= 1 ? 'dmg' : r.m > 0 ? 'bad' : 'none');
      const extra = [];
      if (r.combo){ extra.push(tr('Combinación: {n}.', {n:r.combo.n}));
        if (!S.combos[r.combo.id]){ S.combos[r.combo.id] = true; toast(tr('¡Combinación descubierta: {n}!', {n:r.combo.n})); }
        S.comboCount++; dailyProg('combo'); }
      if (crit > 1) extra.push(tr('¡Golpe crítico de perforina!'));
      if (r.m > 0 && e.ev === 'fiebre') extra.push(tr('Fiebre: +25 % de daño.'));
      if (r.m > 0 && e.ev === 'hipoxia') extra.push(tr('Hipoxia: −20 % de daño.'));
      if (vac > 1 && r.m > 0) extra.push(tr('Vacuna: los anticuerpos hacen el doble.'));
      if (id === 'ac' && r.m > 0 && !e.hidden && !e.inRbc){ e.marked = has('h1') ? 6 : 4; extra.push(has('h1') ? tr('Opsonizado: más daño durante 5 turnos.') : tr('Opsonizado: +60 % de daño durante 3 turnos.')); }
      if (id === 'tax' && r.m > 0){ e.block = 3; extra.push(tr('Huso mitótico bloqueado durante 3 turnos.')); }
      if (mark > 1 && r.m > 0) extra.push(tr('Daño aumentado por la opsonización.'));
      if (cb > 1 && r.m > 0) extra.push(tr('{c}: ×{k} contra este organismo.', {c:cellD().n, k:dec(cb)}));
      setMsg(v, `${T.n} · ${l} (×${dec(Math.round(r.m*100)/100)})`, r.why, extra.join(' '));
      if (r.m > 0){ burst(to, T.col, r.m >= 2 ? 40 : 18, r.m >= 2 ? 4 : 2.5); shake = S.calm ? 0 : r.m >= 2 ? .25 : .1; if (r.m >= 2) impact(to, T.col); }
      if (r.m >= 2){ dailyProg('great'); narr('great'); }
      else if (r.m === 0) narr('immune');
      if (r.combo) narr('combo');
      // efecto secundario sobre tu propia célula
      if (SIDE[id]){ const sd = maxHp()*SIDE[id][0]*(has('i3') ? .4 : 1); B.php = Math.max(1, B.php - sd);
        floatText('−' + fmt(sd), P_POS.clone().add(V(0,1.3,0)), 'hurt'); extra.push(tr(SIDE[id][1])); narr('side'); renderMe(); }
      if (extra.length){ $('#msgX').textContent = extra.join(' '); placeNarr(); }
      sfx.hit(r.m);
    }
    if (!B.firstDone){ B.firstDone = true; S.first.n++; if (r.m >= 2) S.first.ok++; }
    B.last = id; B.lastOk = ok;
    // fase 2 de los jefes especiales
    if (e.special >= 0 && e.phase === 1 && e.hp > 0 && e.hp < e.max*.5){
      e.phase = 2; toast(special(e).n + ' · ' + tr('fase 2')); $('#msgX').textContent = special(e).p2; shake = S.calm ? 0 : .35; impact(E_POS, 0xff4f7b);
    }
    renderFoe(); renderTools();
    if (e.hp <= 0) return setTimeout(win, 250);
    B.timer = setTimeout(enemyTurn, 420/(S.auto ? speed() : 1));
  };
  if (id === 'fago'){ const dir = E_POS.clone().sub(P_POS); tween(560, p => PL.reach(p, dir)); lunge(player, dir.clone().normalize().multiplyScalar(1.3), 560, go); }
  else projectile(from, to, T.col, id === 'luz' ? 1 : 10, 520, go, id);
  if (id === 'luz') setDark(true);
}

function enemyTurn(){
  if (!B || B.over) return;
  const e = B.e, Ty = TYPES[e.type];
  e.turn++;
  const notes = [];
  const heal = (f, why) => { const h = e.max*f; e.hp = Math.min(e.max, e.hp + h); floatText('+' + fmt(h), E_POS.clone().add(V(.6,1.5,0)), 'heal'); notes.push(why); };
  switch (e.type){
    case 'gp': if (e.turn % 3 === 0) heal(.15, tr('Fisión binaria: la colonia se divide y recupera un 15 % de vida.')); break;
    case 'lev': if (e.turn % 3 === 0) heal(.15, tr('Gemación: le brota una yema nueva (+15 % de vida).')); break;
    case 'vir':
      e.hidden = !e.hidden; notes.push(e.hidden ? tr('El virus entra en una célula y se replica a escondidas.') : tr('Nuevos viriones salen de la célula huésped: vuelve a estar expuesto.'));
      if (e.turn % 4 === 0){ e.drift++; notes.push(tr('Deriva antigénica: sus espículas mutan y los anticuerpos pierden eficacia.')); } break;
    case 'veg': if (!e.dark) heal(.08, tr('Fotosíntesis: con la luz fabrica glucosa y se repara (+8 %).')); break;
    case 'can': if (e.block > 0) notes.push(tr('El taxol frena su división.')); else heal(.12, tr('Mitosis descontrolada: +12 % de vida.')); break;
    case 'bac': if (!e.spore && e.hp < e.max*.35){ e.spore = true; notes.push(tr('Esporulación: forma una endospora resistente y deja de atacar.')); burst(E_POS, 0x8fffe8, 30, 2); } break;
    case 'pri': e.grow *= 1.12; notes.push(tr('Convierte proteínas sanas en priones: su ataque crece un 12 %.')); break;
    case 'mal': { const c = e.turn % 3; e.inRbc = c !== 2;
      notes.push(e.inRbc ? tr('El plasmodio se oculta dentro de un glóbulo rojo.') : tr('El eritrocito revienta y salen merozoítos: ahora está expuesto.')); break; }
    case 'vih': e.cd4++; e.hidden = e.turn % 3 === 0;
      notes.push(tr('El VIH infecta más linfocitos T CD4: tus anticuerpos y linfocitos T pierden eficacia.') + (e.hidden ? ' ' + tr('Además entra en latencia, integrado en el ADN de una célula.') : '')); break;
    case 'ten': heal(.06, tr('Su cuello forma nuevas proglótides: recupera un 6 %.')); break;
  }
  if ((e.type === 'gp' || e.type === 'gn') && e.turn === 6 && !e.biofilm){ e.biofilm = true; notes.push(tr('Biopelícula: se rodea de una matriz de polisacáridos que frena tus ataques (×0,6). El autoclave la atraviesa.')); }
  // eventos
  if (e.ev === 'antib' && BACT.has(e.type)){ const d = e.max*.08; e.hp = Math.max(0, e.hp - d); floatText('−' + fmt(d) + ' · ' + tr('antibiótico'), E_POS.clone().add(V(-.5,1.5,0)), 'evt ev-antib'); notes.push(tr('El antibiótico en sangre le resta un 8 %.')); }
  if (e.ev === 'inflam'){ const h = maxHp()*.06; B.php = Math.min(maxHp(), B.php + h); floatText('+' + fmt(h) + ' · ' + tr('inflamación'), P_POS.clone().add(V(0,1.5,0)), 'evt ev-inflam'); notes.push(tr('Inflamación: recuperas un 6 % de vida.')); }
  if (e.ev === 'fiebre' && e.turn === 1) notes.push(tr('La fiebre también aumenta su daño (+25 %).'));
  // fase 2 de jefes especiales
  if (e.phase === 2){
    if (e.special === 0){ const d = maxHp()*.05; B.php = Math.max(0, B.php - d); notes.push(tr('Choque endotóxico: el LPS te resta un 5 % de vida.')); }
    if (e.special === 2 && !(e.block > 0)) heal(.1, tr('Angiogénesis: los vasos nuevos lo curan un 10 %.'));
    if (e.special === 3){ e.grow *= 1.2; notes.push(tr('Agregación: su ataque crece un 20 %.')); }
    if (e.special === 4) heal(.08, tr('Citoadherencia: recupera un 8 %.'));
  }
  if (has('i4') && B.php > 0){ const h = maxHp()*.04; B.php = Math.min(maxHp(), B.php + h); }
  if (e.hp <= 0){ renderFoe(); return setTimeout(win, 250); }
  const finish = () => {
    for (const k in B.cds) if (B.cds[k] > 0) B.cds[k]--;
    if (e.marked > 0) e.marked--;
    if (e.block > 0) e.block--;
    if (notes.length){ $('#msgX').textContent = notes.join(' '); placeNarr(); }
    if (B.php > 0) B.busy = false;
    B.why = null;
    renderFoe(); renderMe(); renderTools();
    if (B.php <= 0) return setTimeout(lose, 300);
    if (B.php < maxHp()*.25) narr('lowhp');
    scheduleAuto();
  };
  if (e.spore){ notes.push(tr('La endospora está en reposo: no ataca.')); return setTimeout(finish, 200); }
  if (e.type === 'tbc' && e.turn % 2){ notes.push(tr('Crecimiento lento: esta vez no ataca.')); return setTimeout(finish, 200); }
  const fever = e.type === 'mal' && e.turn % 3 === 0;
  if (fever) notes.push(tr('Acceso de fiebre: al reventar a la vez muchos eritrocitos, el golpe es más fuerte.'));
  const hits = Ty.hits || 1;
  let i = 0;
  if (hits > 1) notes.push(tr('Sus cilios baten en ondas: ataca dos veces.'));
  const hit = () => {
    const dir = P_POS.clone().sub(E_POS).normalize().multiplyScalar(1.4);
    lunge(foeObj.g, dir, 360, () => {
      const dmg = e.atk*e.grow*taken()*dmgMods(e, false)*(fever ? 1.5 : 1)*rnd(.85, 1.15)/(hits > 1 ? 1.6 : 1);
      B.php = Math.max(0, B.php - dmg);
      floatText('−' + fmt(dmg), P_POS.clone().add(V(0,1.3,0)), 'hurt');
      burst(P_POS, 0xff4f7b, 12, 2); shake = S.calm ? 0 : .12; sfx.hurt();
      renderMe();
      if (++i < hits && B.php > 0) hit(); else finish();
    });
  };
  hit();
}

function win(){
  const e = B.e; if (B.over) return; B.over = true; stopMusic();
  if (storyCh()) return storyWin(e);
  const g = reward(e.L, e.boss)*(e.ev === 'hipoxia' ? 1.5 : 1)*(e.special >= 0 ? 2 : 1);
  S.atp += g; S.totalKills++; S.defeated[e.type] = (S.defeated[e.type] || 0) + 1;
  if (e.special >= 0){ S.specialWins++; S.lpts++; toast(tr('+1 punto del árbol inmunitario')); }
  if (BACT.has(e.type) && !B.usedAb){ S.press = Math.max(0, S.press - 2); dailyProg('noab'); if (S.wk !== weekKey()){ S.wk = weekKey(); S.wkNoAb = 0; } S.wkNoAb = (S.wkNoAb || 0) + 1; }
  if (B.onlyFago) dailyProg('fago');
  if (B.turns <= 3) dailyProg('quick');
  if (e.boss) dailyProg('boss');
  dailyProg('kills');
  LOG.unshift({L:e.L, n:foeName(e), turns:B.turns, g, win:true}); LOG.length = Math.min(LOG.length, 8);
  floatText('+' + fmt(g) + ' ATP', E_POS.clone().add(V(0,.6,0)), 'atp');
  burst(E_POS, TYPES[e.type].col, S.calm ? 20 : 60, 4.5); sfx.win();
  const obj = foeObj;
  tween(450, p => obj.g.scale.setScalar(obj.base*(1 - easeOut(p))), () => { scene.remove(obj.g); });
  let hp;
  if (e.boss){
    S.stats.lvl[e.L] = Math.round((Date.now() - (S.stats.lvlStart || Date.now()))/1000); S.stats.lvlStart = Date.now();
    S.level++; S.kills = 0; S.runMax = Math.max(S.runMax, S.level); S.best = Math.max(S.best, S.level);
    hp = maxHp();
    const nt = TYPE_ORDER.some(id => TYPES[id].min === S.level);
    toast(tr('Nivel {l}.', {l:S.level}) + (nt ? ' ' + tr('Aparece un organismo nuevo.') : ''));
  } else {
    S.kills = Math.min(KPL, S.kills + 1);
    hp = Math.min(maxHp(), B.php + maxHp()*.35);
  }
  setMsg('great', tr('Victoria'), tr('+{g} ATP.', {g:fmt(g)}) + ' ' + (e.boss ? tr('Jefe derrotado.') : tr('Recuperas un 35 % de vida.')), e.ev === 'hipoxia' ? tr('Incluye un 50 % más de ATP por la hipoxia.') : '');
  checkAch(); save(); renderHud(); renderLog(); pushBoard();
  setTimeout(() => newBattle(hp), 900/(S.auto ? speed() : 1));
}

function lose(){
  if (B.over) return; B.over = true; sfx.lose(); stopMusic();
  const e = B.e;
  if (storyCh()){ setMsg('none', tr('Derrota'), tr('Vuelve a intentarlo: este paso de la historia empieza de nuevo.')); burst(P_POS, 0xff4f7b, 40, 3); save(); return setTimeout(() => newBattle(), 1500); }
  S.stats.deaths[e.L] = (S.stats.deaths[e.L] || 0) + 1;
  LOG.unshift({L:e.L, n:foeName(e), turns:B.turns, g:0, win:false}); LOG.length = Math.min(LOG.length, 8);
  let txt;
  if (e.boss){ S.advance = false; txt = tr('El jefe te ha vencido. Se ha desactivado «Avanzar»: reúne ATP, mejora tus orgánulos y vuelve a intentarlo.'); }
  else { S.level = Math.max(1, S.level-1); S.kills = 0; txt = tr('Te retiras al nivel {l} para recuperarte.', {l:S.level}); }
  burst(P_POS, 0xff4f7b, 40, 3);
  setMsg('none', tr('Derrota'), txt);
  toast(txt);
  save(); renderHud(); renderLog();
  setTimeout(() => newBattle(), 1500);
}

function autoPick(){
  const e = B.e; let best = null, bs = -1;
  for (const T of TOOLS){
    if (!owns(T.id) || (B.cds[T.id] || 0) > 0) continue;
    const known = T.id === 'fago' || (S.known[e.type] && S.known[e.type][T.id]);
    if (!known) continue;
    const r = eff(T.id, e, {known:true});
    let s;
    if (T.id === 'luz') s = e.type === 'veg' && !e.dark ? 99 : -1;
    else {
      s = T.pow*r.m;
      if (T.id === 'ac' && r.m > 0 && e.marked === 0 && !e.hidden) s *= 1.9;
      if (T.id === 'tax' && e.type === 'can' && e.block === 0) s *= 1.6;
      // preparar una combinación conocida
      if (COMBOS.some(c => c.first === T.id && S.combos[c.id] && (!c.types || c.types.includes(e.type)) && owns(c.then) && !(B.cds[c.then] > 1)) && r.m > 0) s *= 1.3;
    }
    if (s > bs){ bs = s; best = T.id; }
  }
  return best || 'fago';
}
function scheduleAuto(){
  if (!B || B.over || B.busy) return;
  clearTimeout(B.timer);
  if (S.auto && canAuto() && $('#modal').hidden && !CINE) B.timer = setTimeout(() => useTool(autoPick()), 650/speed());
}


// ---- Modo historia ----
function storyWin(e){
  const g = reward(e.L, e.boss);
  S.atp += g; S.totalKills++; S.defeated[e.type] = (S.defeated[e.type] || 0) + 1;
  floatText('+' + fmt(g) + ' ATP', E_POS.clone().add(V(0,.6,0)), 'atp');
  burst(E_POS, TYPES[e.type].col, S.calm ? 20 : 60, 4.5); sfx.win();
  const obj = foeObj; tween(450, p => obj.g.scale.setScalar(obj.base*(1 - easeOut(p))), () => scene.remove(obj.g));
  const ch = storyCh(); S.story.step++;
  setMsg('great', tr('Victoria'), tr('+{g} ATP.', {g:fmt(g)}));
  if (S.story.step < ch.battles.length){ save(); renderHud(); return setTimeout(() => newBattle(), 900); }
  S.story.ch++; S.story.step = 0;
  if (S.story.ch >= STORY.length){ S.story = null; const first = !S.storyDone; S.storyDone = true; if (first){ S.adn += 3; S.lpts += 1; } save(); rebuildPlayer(); renderHud();
    return setTimeout(() => showStoryEnd(first), 900); }
  save(); rebuildPlayer(); renderHud();
  setTimeout(() => showChapter(newBattle), 900);
}
function startStory(){
  if (B){ B.over = true; clearTimeout(B.timer); }
  S.story = {ch:0, step:0}; save(); rebuildPlayer(); renderHud(); narr('story', true);
  showChapter(newBattle);
}
function leaveStory(){
  if (B){ B.over = true; clearTimeout(B.timer); }
  S.story = null; save(); rebuildPlayer(); renderHud(); newBattle();
}
