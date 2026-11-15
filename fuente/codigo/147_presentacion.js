// ============================================================ PRESENTACIÓN AL ELEGIR ÉPOCA
// Al escoger Atenas o Roma: el cuadro a pantalla completa (Rafael en Atenas; el Vesubio de noche en Roma), el texto de la época subiendo
// en perspectiva, como los títulos de La guerra de las galaxias, y abajo el barco de la carga. Sin botones mientras carga.
// Al terminar: «Un jugador» y «Multijugador» (aún no disponible); con «Un jugador», «Historia» o «Libre», y unos enlaces pequeños.
const INTRO={el:null,poll:null,step:0};
function introCSS(){if($('introCSS'))return;const st=document.createElement('style');st.id='introCSS';st.textContent=`
#intro{position:fixed;inset:0;z-index:55;background:#050403;overflow:hidden;color:#f1e8d8}
#intro .ibg{position:absolute;inset:-4%;background-size:cover;background-position:center;filter:brightness(.68) saturate(1);animation:introZoom 70s ease-out forwards}
#intro .ishade{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,transparent 0,rgba(0,0,0,.35) 60%,rgba(0,0,0,.8) 100%),linear-gradient(to bottom,rgba(0,0,0,.55),transparent 30%,transparent 65%,rgba(0,0,0,.85))}
#intro .ititle{position:absolute;top:calc(5% + env(safe-area-inset-top,0px));left:0;right:0;text-align:center;font-family:var(--f-display);font-size:clamp(2.4rem,8vw,5.2rem);letter-spacing:.08em;text-shadow:0 4px 24px rgba(0,0,0,.8);animation:introIn 2.4s ease-out both}
#intro .ititle span{display:block;font-size:.3em;letter-spacing:.4em;color:#e8b06a;margin-top:8px}
#intro .icrawlw{position:absolute;left:0;right:0;top:22%;bottom:150px;perspective:380px;overflow:hidden;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 30%,#000 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 30%,#000 100%)}
#intro .icrawlp{position:absolute;left:50%;top:0;bottom:0;width:min(760px,88vw);transform-origin:50% 100%;transform:translateX(-50%) rotateX(22deg);transform-style:preserve-3d}
#intro .icrawl{position:absolute;left:0;right:0;top:0;will-change:transform;transform:translateY(100vh);backface-visibility:hidden;color:#f3d48a;font-size:clamp(1.15rem,2.6vw,1.7rem);line-height:1.55;text-align:justify;text-shadow:0 2px 10px #000}
#intro .icrawl p{margin:0 0 1.1em}
#intro .ifoot{position:absolute;left:0;right:0;bottom:calc(5% + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;align-items:center;gap:18px;padding:0 16px}
#intro .ibtns{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;opacity:0;transform:translateY(16px);transition:opacity .9s,transform .9s;pointer-events:none}
#intro.ready .ibtns{opacity:1;transform:none;pointer-events:auto}
#intro .ibig{min-width:min(300px,80vw);padding:20px 28px;border-radius:12px;border:1px solid #d9874a;background:rgba(22,16,12,.85);color:#f1e8d8;font:inherit;font-family:var(--f-display);font-size:clamp(1.3rem,3vw,1.8rem);letter-spacing:.06em;cursor:pointer;box-shadow:0 10px 36px rgba(0,0,0,.6);transition:background .2s,transform .2s}
#intro .ibig:hover:not(:disabled),#intro .ibig:focus-visible{background:#d9874a;color:#1a120c;transform:translateY(-2px)}
#intro .ibig small{display:block;font-family:Alegreya,Georgia,serif;font-style:italic;font-size:.55em;letter-spacing:0;opacity:.8;margin-top:4px}
#intro .ibig:disabled{opacity:.55;cursor:not-allowed}
#intro .ilinks{display:none;gap:10px 18px;justify-content:center;flex-wrap:wrap;font-size:.95rem}
#intro.step2 .ilinks{display:flex}
#intro .ilinks button,#intro .ilinks select{background:none;border:none;color:#e8c9a0;text-decoration:underline;font:inherit;cursor:pointer}
#intro.ready .icrawlw{opacity:.35;transition:opacity 1.5s}
#intro .icap{position:absolute;right:12px;bottom:6px;font-size:.7rem;color:#bfb29c;opacity:.75;max-width:min(520px,70vw);text-align:right;font-style:italic}
body.intro #ldBox{left:50%!important;right:auto!important;top:auto!important;bottom:calc(16px + env(safe-area-inset-bottom,0px))!important;transform:translateX(-50%);width:min(520px,calc(100vw - 32px));z-index:60}
body.intro #ldBox.gone{transform:translate(-50%,20px)}
@media (max-width:700px){#intro .ifoot{bottom:calc(3% + env(safe-area-inset-bottom,0px));gap:12px}#intro .ibtns{flex-direction:column;align-items:center;gap:12px}#intro .ibig{padding:14px 22px}#intro .icap{top:calc(4px + env(safe-area-inset-top,0px));bottom:auto;right:8px;left:8px;text-align:center;max-width:none;font-size:.65rem}#intro .ititle{top:calc(7% + env(safe-area-inset-top,0px))}}
@keyframes introZoom{from{transform:scale(1)}to{transform:scale(1.08)}}
@keyframes introIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){#intro .icrawlp{transform:translateX(-50%)}#intro .icrawl{transform:none!important}#intro .ibg{animation:none}}`;document.head.appendChild(st);}
function introStart(){if(INTRO.el||!$('start')||$('start').hidden)return;introCSS();const ro=MODE==='roma';
  const src=ro?(typeof LOBA_SRC!=='undefined'?LOBA_SRC:''):(typeof RAFAEL_SRC!=='undefined'?RAFAEL_SRC:'');
  const d=document.createElement('div');d.id='intro';
  const txt=($('stIntro')?$('stIntro').innerHTML:'');
  d.innerHTML='<div class="ibg" style="background-image:url('+src+')"></div><div class="ishade"></div>'+
   '<div class="ititle">'+(ro?'Roma':'Atenas')+'<span>'+(ro?'AÑO 80 d.C.':'PRIMAVERA DEL 386 a.C.')+'</span></div>'+
   '<div class="icrawlw"><div class="icrawlp"><div class="icrawl">'+txt+'</div></div></div>'+
   '<div class="ifoot"><div class="ibtns"></div><div class="ilinks"></div></div>'+
   '<div class="icap">'+(ro?'El Vesubio en erupción, de noche (pintura de época moderna). En el 79 sepultó Pompeya.':'La escuela de Atenas, de Rafael (1509-1511): una Atenas imaginada dos mil años después.')+'</div>';
  document.body.appendChild(d);document.body.classList.add('intro');INTRO.el=d;INTRO.step=0;
  // el texto sube con una animación solo de transform (Web Animations): la ejecuta el compositor, fuera del hilo principal,
  // así que sigue fluida aunque el juego esté construyendo el mundo (antes se animaba «top» y subía a trompicones)
  try{const cr=d.querySelector('.icrawl'),wh=d.querySelector('.icrawlp').offsetHeight,th=cr.offsetHeight;
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)INTRO.anim=cr.animate([{transform:'translateY('+wh+'px)'},{transform:'translateY('+(-th-40)+'px)'}],{duration:Math.max(40000,(wh+th)*42),delay:1200,easing:'linear',fill:'forwards'});}catch(e){}
  INTRO.poll=setInterval(()=>{if(!INTRO.el)return clearInterval(INTRO.poll);
    if($('start').hidden){introEnd();return;}   // la partida ya empezó (p. ej., recuperada)
    if(INTRO.step===0&&$('go')&&!$('go').disabled){INTRO.step=1;introStep1();}},300);}
function introBtn(label,sub,fn,dis){const b=document.createElement('button');b.className='ibig';b.innerHTML=label+(sub?'<small>'+sub+'</small>':'');if(dis)b.disabled=true;else b.onclick=fn;return b;}
function introStep1(){const d=INTRO.el,B=d.querySelector('.ibtns');B.innerHTML='';
  B.append(introBtn('Un jugador','',introStep2),introBtn('Multijugador','aún no disponible',null,true));
  d.classList.add('ready');setTimeout(()=>{const b=B.querySelector('button');b&&b.focus();},400);}
function introStep2(){const d=INTRO.el,B=d.querySelector('.ibtns');B.innerHTML='';d.classList.add('step2');
  B.append(introBtn('Historia','diez capítulos guiados',()=>introGo('goStory')),introBtn('Libre','explora a tu ritmo',()=>introGo('go')));
  const L=d.querySelector('.ilinks');L.innerHTML='';const lk=(t,id)=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{const o=$(id);if(o)o.click();if(id!=='bBack')introEnd();};L.appendChild(b);};
  lk('Volver','');L.lastChild.onclick=()=>{d.classList.remove('step2');introStep1();};
  if($('loadStart'))lk('Cargar partida','loadStart');if($('libStart'))lk('Leer la biblioteca','libStart');lk('Cambiar de época','bBack');
  setTimeout(()=>{const b=B.querySelector('button');b&&b.focus();},300);}
function introGo(id){const b=$(id);introEnd();if(b&&!b.disabled)b.click();}
function introEnd(){if(INTRO.el){INTRO.el.remove();INTRO.el=null;}clearInterval(INTRO.poll);document.body.classList.remove('intro');}
{const f=chooseMode;chooseMode=function(m){const r=f.apply(this,arguments);try{introStart();}catch(e){console.warn('intro',e);}return r;};}
// el modo en línea queda fuera de la portada por ahora («Multijugador: aún no disponible»)
{const gn=document.getElementById('goNet');if(gn)gn.hidden=true;}
