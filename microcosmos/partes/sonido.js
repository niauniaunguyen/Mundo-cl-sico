/* =====================================================================
   SONIDO (sintetizado)
   ===================================================================== */
let AC = null;
function tone(f, dur=.12, type='sine', vol=.08, slide=0){
  if (!S.sound) return;
  try{
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f*slide), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + dur + .02);
  }catch(_){}
}
const sfx = {
  shoot:() => tone(520, .18, 'triangle', .06, 1.8),
  hit:m => m >= 2 ? (tone(880, .12, 'square', .05), setTimeout(() => tone(1320, .15, 'square', .04), 60)) : m > 0 ? tone(300, .12, 'triangle', .07, .6) : tone(140, .2, 'sawtooth', .04, .8),
  hurt:() => tone(160, .18, 'sawtooth', .05, .5),
  win:() => { tone(660, .12, 'triangle', .06); setTimeout(() => tone(990, .18, 'triangle', .06), 90); },
  buy:() => tone(740, .1, 'sine', .07, 1.5),
  lose:() => tone(220, .5, 'sawtooth', .05, .4),
  ach:() => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, .16, 'triangle', .05), i*90)); },
};
// Música de jefe: un bajo pulsante en modo frigio (más tenso en los jefes especiales)
let musicT = null, musicStep = 0;
function startMusic(epic){
  stopMusic(); if (!S.sound) return;
  const bass = epic ? [55, 55, 58.27, 55, 65.41, 55, 58.27, 49] : [65.41, 65.41, 69.3, 65.41];
  const lead = [220, 233.08, 261.63, 233.08, 196, 220, 174.61, 196];
  musicT = setInterval(() => {
    if (!B || B.over){ stopMusic(); return; }
    const i = musicStep++;
    tone(bass[i % bass.length], .28, 'sawtooth', .035, .98);
    if (epic && i % 2 === 0) tone(lead[(i/2|0) % lead.length], .22, 'triangle', .022);
    if (i % 4 === 2) tone(1800, .03, 'square', .012);
  }, epic ? 230 : 300);
}
function stopMusic(){ clearInterval(musicT); musicT = null; musicStep = 0; }

