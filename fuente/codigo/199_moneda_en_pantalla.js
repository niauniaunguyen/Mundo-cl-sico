// ============================================================ LA MONEDA EN PANTALLA
// Cuando el cartel de arriba a la izquierda (#stats: nombre, estación, dinero…) se esconde, queda en su lugar una moneda con la cantidad.
// Atenas: el óbolo de plata con la lechuza de Atenea, una ramita de olivo y ΑΘΕ (la misma lechuza que la tetradracma; Aristófanes, Aves 1106).
// Roma: el sestercio de oricalco (latón) con la cabeza laureada del emperador y S C, «por decreto del Senado».
// Al pulsarla se vuelve a ver el cartel completo un momento (hudPeek).
const COIN_SVG={
 atenas:'<svg viewBox="0 0 40 40" aria-hidden="true"><defs><radialGradient id="cAg" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#f4f4f0"/><stop offset=".55" stop-color="#bfc2c2"/><stop offset="1" stop-color="#7f8484"/></radialGradient></defs>'+
  '<path d="M20 2.5c8.6 0 16.8 6.3 17.3 16.4.6 10.6-7.2 18.6-17.6 18.6C9.3 37.5 2.5 30 2.9 19.6 3.3 9.4 11 2.5 20 2.5z" fill="url(#cAg)" stroke="#6d7272" stroke-width="1.2"/>'+
  '<ellipse cx="18.5" cy="23" rx="7.2" ry="9" fill="#9da1a1"/><circle cx="15.3" cy="16.8" r="3.3" fill="#e9eae6" stroke="#5d6262" stroke-width="1"/><circle cx="21.7" cy="16.8" r="3.3" fill="#e9eae6" stroke="#5d6262" stroke-width="1"/>'+
  '<circle cx="15.5" cy="17" r="1.3" fill="#2e3232"/><circle cx="21.9" cy="17" r="1.3" fill="#2e3232"/><path d="M18.5 19l-1.2 2h2.4z" fill="#5d6262"/>'+
  '<path d="M13 26q5.5 3.5 11 0M14 29q4.5 2.5 9 0" stroke="#6d7272" stroke-width=".9" fill="none"/>'+
  '<path d="M27 10q4 1 4.5 5" stroke="#5f6a4a" stroke-width="1" fill="none"/><ellipse cx="29.7" cy="10.7" rx="1.9" ry=".9" fill="#7c8763" transform="rotate(25 29.7 10.7)"/><ellipse cx="31.6" cy="13.5" rx="1.9" ry=".9" fill="#7c8763" transform="rotate(70 31.6 13.5)"/>'+
  '<text x="30.5" y="31" font-family="Georgia,serif" font-size="6.4" font-weight="700" fill="#4d5252" text-anchor="middle">ΑΘΕ</text></svg>',
 roma:'<svg viewBox="0 0 40 40" aria-hidden="true"><defs><radialGradient id="cAe" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#f6dc8e"/><stop offset=".55" stop-color="#c99a3e"/><stop offset="1" stop-color="#7d5a1e"/></radialGradient></defs>'+
  '<circle cx="20" cy="20" r="17.5" fill="url(#cAe)" stroke="#7a5820" stroke-width="1.2"/><circle cx="20" cy="20" r="14.8" fill="none" stroke="#9c7428" stroke-width=".7" stroke-dasharray="1 1.4"/>'+
  '<path d="M25.5 11.5c-3.5-2.6-9.5-1.4-11.1 3.2-.9 2.6-.2 4-.9 5.4l-2.2 2.4 2 .8-.4 2c.8.8 1.9.6 2.4 1.4.3 1.6-.4 3.4.3 4.9h8.4c-.7-2.2-.5-4.4 1.1-6.1 2.6-2.8 3.3-8.6.4-14z" fill="#a87a2c" stroke="#6e4e18" stroke-width=".8"/>'+
  '<path d="M16 12.6l2 1.6M18.6 11.2l1.5 1.9M21.4 10.6l1 2.2M24 11l.4 2.3M26.1 12.4l-.4 2.3" stroke="#5f7a3a" stroke-width="1.6" stroke-linecap="round"/>'+
  '<text x="9" y="33.5" font-family="Georgia,serif" font-size="6" font-weight="700" fill="#6e4e18">S</text><text x="27.5" y="33.5" font-family="Georgia,serif" font-size="6" font-weight="700" fill="#6e4e18">C</text></svg>'};
function coinCSS(){if($('coinCSS'))return;const s=document.createElement('style');s.id='coinCSS';s.textContent=
 '#coinHud{position:absolute;top:calc(12px + env(safe-area-inset-top,0px));left:max(16px,env(safe-area-inset-left,0px));display:flex;align-items:center;gap:8px;padding:5px 12px 5px 6px;'+
 'background:rgba(22,16,12,.72);border-left:2px solid #d9874a;border-radius:0 22px 22px 0;color:#f3e6cf;font:600 1.05rem Alegreya,Georgia,serif;cursor:pointer;z-index:5;'+
 'opacity:0;transform:translateX(-12px);transition:opacity .45s ease,transform .45s ease;pointer-events:none;text-shadow:0 1px 2px #000}'+
 '#coinHud.on{opacity:1;transform:none;pointer-events:auto}#coinHud svg{width:38px;height:38px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))}'+
 '#coinHud small{font-weight:400;font-size:.8rem;color:#d8c6a8;margin-left:2px}#coinHud.bump svg{animation:coinBump .5s ease}'+
 '@keyframes coinBump{0%{transform:scale(1)}40%{transform:scale(1.25) rotate(-12deg)}100%{transform:scale(1)}}'+
 'body.tm #coinHud{font-size:.92rem}body.tm #coinHud svg{width:32px;height:32px}';document.head.appendChild(s);}
const COIN={el:null,mode:null,n:null};
function coinEl(){if(COIN.el&&COIN.el.isConnected)return COIN.el;coinCSS();const h=$('hud');if(!h)return null;const d=document.createElement('div');d.id='coinHud';d.setAttribute('role','status');
  d.onclick=()=>{try{hudPeek&&hudPeek();}catch(e){}};h.appendChild(d);COIN.el=d;COIN.mode=null;return d;}
function coinUpdate(){const d=coinEl();if(!d||typeof state==='undefined'||!state)return;const ro=MODE==='roma',n=state.obols|0;
  if(COIN.mode!==MODE){COIN.mode=MODE;d.innerHTML=COIN_SVG[ro?'roma':'atenas']+'<span class="n"></span><small></small>';COIN.n=null;}
  if(COIN.n!==n){if(COIN.n!=null&&n>COIN.n){d.classList.remove('bump');void d.offsetWidth;d.classList.add('bump');}COIN.n=n;d.querySelector('.n').textContent=n;
    d.querySelector('small').textContent=ro?(n===1?'sestercio':'sestercios'):(n===1?'óbolo':'óbolos');d.title=(ro?'Sestercios: ':'Óbolos: ')+n;}
  const st=$('stats');d.classList.toggle('on',!!st&&st.classList.contains('hid'));}
{const f=updateStats;updateStats=function(){const r=f.apply(this,arguments);try{coinUpdate();}catch(e){}return r;};}
// el cartel se esconde y aparece con una clase: la moneda sigue sus cambios
{const st=document.getElementById('stats');if(st&&typeof MutationObserver!=='undefined')new MutationObserver(()=>{try{coinUpdate();}catch(e){}}).observe(st,{attributes:true,attributeFilter:['class']});}
{let t=0;const f=uxTick;uxTick=function(dt){f(dt);t+=dt;if(t>0.8){t=0;try{coinUpdate();}catch(e){}}};}   // también cuando el dinero cambia sin pasar por updateStats
