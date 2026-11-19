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

// Sonido propio de cada herramienta
const TOOL_SFX = {
  fago:() => tone(140, .25, 'sine', .09, .5),
  lis:() => [0, 50, 100].forEach(d => setTimeout(() => tone(900 + d*3, .04, 'square', .03), d)),
  pen:() => { tone(1568, .25, 'sine', .05); setTimeout(() => tone(2093, .3, 'sine', .03), 70); },
  uv:() => tone(2400, .3, 'sawtooth', .02, 1.2),
  ac:() => [0, 70, 140].forEach((d, i) => setTimeout(() => tone([1046, 1318, 1568][i], .1, 'triangle', .05), d)),
  anf:() => tone(600, .08, 'square', .05, .4),
  osm:() => { noiseBurst(.25, 600, .05); tone(300, .2, 'sine', .05, 2); },
  luz:() => tone(800, .6, 'triangle', .05, .2),
  cel:() => tone(220, .25, 'sawtooth', .04, .7),
  tc:() => { tone(1200, .05, 'square', .04); setTimeout(() => tone(1800, .08, 'square', .04), 50); },
  tax:() => tone(3000, .4, 'sine', .025, .9),
  aut:() => noiseBurst(.5, 3000, .06),
  iso:() => tone(90, .2, 'sine', .1, .6),
  art:() => [0, 90].forEach((d, i) => setTimeout(() => tone(i ? 1760 : 1320, .3, 'sine', .04), d)),
  arv:() => [0, 40, 80, 120].forEach(d => setTimeout(() => tone(1500 + Math.random()*500, .03, 'square', .025), d)),
  pzq:() => tone(70, .5, 'triangle', .1, 1.5),
};
sfx.tool = id => (TOOL_SFX[id] || sfx.shoot)();
let NOISE = null;
function noiseBuf(){
  if (NOISE) return NOISE;
  const n = AC.sampleRate*2, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
  for (let i=0;i<n;i++) d[i] = Math.random()*2 - 1;
  return NOISE = b;
}
function noiseBurst(dur, freq, vol){
  if (!S.sound) return;
  try{ AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(), t = AC.currentTime;
    src.buffer = noiseBuf(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = .8;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    src.connect(f).connect(g).connect(AC.destination); src.start(t); src.stop(t + dur + .05);
  }catch(_){}
}
// Paisaje sonoro de cada zona (generativo): latido en la sangre, respiración en los pulmones...
let AMB = null, ambZone = null;
function stopAmbient(){
  if (!AMB) return;
  AMB.timers.forEach(clearInterval);
  try{ const t = AC.currentTime; AMB.master.gain.setTargetAtTime(0, t, .4); const nodes = AMB.nodes; setTimeout(() => nodes.forEach(n => { try{ n.stop && n.stop(); n.disconnect(); }catch(_){} }), 1500); }catch(_){}
  AMB = null; ambZone = null;
}
function ambient(zone){
  if (!S.sound || !S.music){ stopAmbient(); return; }
  if (zone === ambZone && AMB) return;
  if (!AC || AC.state !== 'running') return; // espera a que el jugador interactúe
  stopAmbient(); ambZone = zone;
  const t0 = AC.currentTime, master = AC.createGain(); master.gain.setValueAtTime(0, t0); master.gain.linearRampToValueAtTime(1, t0 + 2); master.connect(AC.destination);
  const A = AMB = {master, nodes:[], timers:[]};
  const noise = (type, freq, vol, q=.7) => { const src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    src.buffer = noiseBuf(); src.loop = true; f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.value = vol;
    src.connect(f).connect(g).connect(master); src.start(); A.nodes.push(src); return g; };
  const drone = (freq, vol, type='sine') => { const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = freq; g.gain.value = vol; o.connect(g).connect(master); o.start(); A.nodes.push(o); return g; };
  const ping = (f, dur, type, vol, slide) => { try{ const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime; o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(f*slide, t + dur); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + .05); }catch(_){} };
  const every = (ms, fn) => A.timers.push(setInterval(() => { if (AMB === A && !document.hidden) fn(); }, ms));
  if (zone === 'san'){ // latido a 70 pulsaciones por minuto y flujo de sangre
    noise('lowpass', 260, .035);
    every(857, () => { ping(58, .16, 'sine', .14, .6); setTimeout(() => ping(52, .14, 'sine', .1, .6), 240); });
  } else if (zone === 'pul'){ // respiración
    const g = noise('bandpass', 900, 0, .5);
    every(100, () => { g.gain.setTargetAtTime(.05*(.5 + .5*Math.sin(Date.now()/1000*Math.PI/2.5)), AC.currentTime, .1); });
    drone(110, .012);
  } else if (zone === 'int'){ // borborigmos
    drone(45, .03); noise('lowpass', 180, .02);
    every(1400, () => { if (Math.random() < .6) ping(140 + Math.random()*80, .35, 'sine', .07, .45); });
  } else if (zone === 'pie'){ // aire sobre la piel
    noise('highpass', 2500, .012);
    every(2300, () => { if (Math.random() < .5) ping(1200 + Math.random()*900, .6, 'triangle', .015); });
  } else if (zone === 'cer'){ // pulsos eléctricos de neuronas sobre un fondo etéreo
    drone(220, .012); drone(221.6, .012); drone(330, .008, 'triangle');
    every(600, () => { if (Math.random() < .5) ping(2200, .02, 'square', .02); });
  } else if (zone === 'cha'){ // agua y burbujas
    noise('lowpass', 500, .025);
    every(700, () => { if (Math.random() < .7) ping(400 + Math.random()*300, .09, 'sine', .04, 2.2); });
  }
}
// el audio solo puede empezar tras una interacción
window.addEventListener('pointerdown', () => {
  try{ AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    (AC.state === 'running' ? Promise.resolve() : AC.resume()).then(() => ambient(storyCh() ? storyCh().zone : S.zone), () => {}); }catch(_){}
}, {passive:true});
