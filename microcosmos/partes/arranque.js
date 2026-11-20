/* =====================================================================
   ARRANQUE
   ===================================================================== */
function start(data){
  const had = load(data);
  const away = had ? clamp((Date.now() - (S.t || Date.now()))/1000, 0, 8*3600) : 0; // antes de que nada guarde la partida
  setLang(S.lang || detectLang());
  applyQuality(S.q === 'auto' ? 2 : S.q);
  rebuildPlayer(); setZoneTint(S.zone); ensureDaily();
  // progreso sin conexión (máximo 8 horas)
  const g = atps()*away*(1 + .25*rl('pcr'));
  if (g > 1 && away > 30){ S.atp += g; setTimeout(() => toast(tr('Mientras no estabas, tus mitocondrias produjeron {g} ATP.', {g:fmt(g)})), 600); }
  window.claude?.hot?.snapshot?.(() => ({S}));
  resize(); renderHud(); initClass();
  if (!S.intro) showIntro(newBattle); else newBattle();
  requestAnimationFrame(t => { last = t; loop(t); });
  setTimeout(resize, 300);
  window.addEventListener('beforeunload', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
}
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
