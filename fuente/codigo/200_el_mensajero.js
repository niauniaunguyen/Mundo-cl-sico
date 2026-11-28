// ============================================================ EL MENSAJERO: los avisos van al caduceo
// Antes, cada aviso (noticias, sucesos, logros, consejos) salía a la derecha de la pantalla, y a veces eran tantos que agobiaban.
// Ahora se guardan: abajo a la derecha hay un caduceo, la vara del heraldo (el κηρύκειον de Hermes; el caduceus de Mercurio), con
// una luz que parpadea y el número de mensajes nuevos. Al pulsarlo (o con la tecla del punto [.]) salen en el centro de la pantalla, y
// se quitan con un clic, con Esc o con la misma tecla. Lo que es respuesta inmediata a lo que acaba de hacer el alumno (pulsar un
// botón, responder, comprar…) se sigue viendo un momento como antes: si no, parecería que el juego no responde.
// En Accesibilidad no hace falta nada: en el propio panel se puede volver a «ver los avisos en pantalla, como antes».
const MSG={list:[],unread:0,lastIn:0,old:false,max:60};
try{MSG.old=localStorage.getItem('nostos-avisos-antes')==='1';}catch(e){}
['pointerdown','keydown'].forEach(ev=>addEventListener(ev,e=>{if(e.code==='Period')return;MSG.lastIn=performance.now();},true));
const CADUCEO_SVG='<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M20 6v40" stroke="#e8c070" stroke-width="2.6" stroke-linecap="round"/>'+
 '<circle cx="20" cy="5.2" r="2.6" fill="#e8c070"/><path d="M20 9c-7 0-10 4-10 6 3-1 6-2 10-1 4-1 7 0 10 1 0-2-3-6-10-6z" fill="#d9a948" opacity=".95"/>'+
 '<path d="M20 15c-6 2-6 6 0 8s6 6 0 8-6 6 0 8M20 15c6 2 6 6 0 8s-6 6 0 8 6 6 0 8" stroke="#7fa35a" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
 '<circle cx="15.4" cy="16.4" r="1.6" fill="#7fa35a"/><circle cx="24.6" cy="16.4" r="1.6" fill="#7fa35a"/></svg>';
function msgCSS(){if($('msgCSS'))return;const s=document.createElement('style');s.id='msgCSS';s.textContent=
 '#msgBtn{position:absolute;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px));width:60px;height:70px;border:none;'+
 'background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;z-index:6;pointer-events:auto;transition:transform .15s}'+
 '#msgBtn:hover{transform:scale(1.06)}#msgBtn svg{width:50px;height:62px;overflow:visible;filter:drop-shadow(2.5px 0 0 #ffd23a) drop-shadow(-2.5px 0 0 #ffd23a) drop-shadow(0 2.5px 0 #ffd23a) drop-shadow(0 -2.5px 0 #ffd23a) drop-shadow(0 2px 4px rgba(0,0,0,.7))}#msgBtn .dot{position:absolute;top:-2px;right:-6px;min-width:22px;height:22px;border-radius:11px;background:#c4422a;color:#fff;'+
 'font:700 12px/22px Georgia,serif;text-align:center;padding:0 5px;box-shadow:0 0 0 2px rgba(22,16,12,.9);display:none}#msgBtn.new .dot{display:block;animation:msgBlink 1.1s ease-in-out infinite}'+
 '#msgBtn.new svg{animation:msgPulse 1.6s ease-in-out infinite}@keyframes msgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}'+
 '@keyframes msgBlink{0%,100%{opacity:1}50%{opacity:.35}}@keyframes msgRing{0%{box-shadow:0 0 0 0 rgba(240,200,144,.6)}100%{box-shadow:0 0 0 14px rgba(240,200,144,0)}}'+
 '#msgBox{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:60;background:rgba(10,7,4,.45)}#msgBox[hidden]{display:none}'+
 '#msgBox .card{width:min(560px,92vw);max-height:78vh;overflow:auto;background:rgba(28,21,15,.97);border:1px solid #d9874a;border-radius:14px;padding:16px 18px 12px;color:#f1e8d8;font-family:Alegreya,Georgia,serif;box-shadow:0 10px 40px rgba(0,0,0,.6)}'+
 '#msgBox h3{margin:0 0 10px;font:600 1.05rem Georgia,serif;letter-spacing:.12em;text-transform:uppercase;color:#e8b07a;display:flex;align-items:center;gap:10px}#msgBox h3 svg{width:22px;height:26px}'+
 '#msgBox .m{padding:9px 12px;margin:0 0 8px;border-left:3px solid #c9773f;background:rgba(255,255,255,.04);border-radius:0 8px 8px 0;line-height:1.4}#msgBox .m.old{opacity:.6}'+
 '#msgBox .m.go{cursor:pointer}#msgBox .m.go:hover{border-left-color:#f0c890}#msgBox .m .when{display:block;font-size:.75rem;color:#bfae92;margin-top:4px}'+
 '#msgBox .foot{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-top:10px}#msgBox button.ok{font:600 1rem Georgia,serif;padding:8px 18px;border-radius:8px;border:1px solid #d9874a;background:#3a2a1c;color:#f3e6cf;cursor:pointer}'+
 '#msgBox .lnk{background:none;border:0;color:#d8c6a8;text-decoration:underline;cursor:pointer;font:inherit;font-size:.82rem;padding:0}'+
 'body.tm #msgBtn{bottom:calc(92px + env(safe-area-inset-bottom,0px));width:52px;height:60px}body.tm #msgBtn svg{width:42px;height:52px}';document.head.appendChild(s);}
function msgBtn(){let b=$('msgBtn');if(b)return b;msgCSS();const h=$('hud');if(!h)return null;b=document.createElement('button');b.id='msgBtn';b.type='button';
  b.title='Mensajes del heraldo [.]';b.setAttribute('aria-label','Mensajes');b.innerHTML=CADUCEO_SVG+'<span class="dot"></span>';b.onclick=e=>{e.stopPropagation();msgOpen();};h.appendChild(b);return b;}
function msgRefresh(){const b=msgBtn();if(!b)return;b.classList.toggle('new',MSG.unread>0);b.querySelector('.dot').textContent=MSG.unread>9?'9+':String(MSG.unread);b.hidden=MSG.old;}
function msgWhen(){try{return 'día '+(state.day||1)+' · '+Math.floor(clock.h)+' h';}catch(e){return '';}}
function msgPush(html){MSG.list.unshift({html,when:msgWhen(),read:false});if(MSG.list.length>MSG.max)MSG.list.length=MSG.max;MSG.unread=MSG.list.filter(m=>!m.read).length;msgRefresh();}
// los avisos: todo pasa por la cadena de siempre (sellos de logros, enlaces al diario…), pero si no es respuesta inmediata, se quita de la
// pantalla y se guarda en el caduceo
{const f=toast;toast=function(html){const c=$('toast'),n0=c?c.children.length:0;const r=f.apply(this,arguments);
  try{if(MSG.old)return r;const now=performance.now();if(now-MSG.lastIn<1500)return r;   // lo acaba de provocar el alumno: se ve como antes
    if(c)while(c.children.length>n0)c.lastElementChild.remove();msgPush(String(html));}catch(e){}return r;};}
function msgOpen(){let d=$('msgBox');msgCSS();if(!d){d=document.createElement('div');d.id='msgBox';d.hidden=true;document.body.appendChild(d);d.addEventListener('click',e=>{if(e.target===d)msgClose();});}
  const fresh=MSG.list.filter(m=>!m.read),shown=fresh.length?fresh:MSG.list.slice(0,6);
  d.innerHTML='<div class="card" role="dialog" aria-label="Mensajes"><h3>'+CADUCEO_SVG+(fresh.length?(fresh.length===1?'Un mensaje nuevo':fresh.length+' mensajes nuevos'):'Últimos mensajes')+'</h3>'+
    (shown.length?shown.map((m,i)=>'<div class="m'+(m.read?' old':'')+'" data-i="'+MSG.list.indexOf(m)+'">'+m.html+'<span class="when">'+m.when+'</span></div>').join(''):'<p>Todavía no hay mensajes.</p>')+
    '<div class="foot"><button class="ok" type="button">Entendido</button><span>'+(fresh.length&&MSG.list.length>fresh.length?'<button class="lnk" data-a="all">Ver también los anteriores</button> · ':'')+
    '<button class="lnk" data-a="old">Ver los avisos en pantalla, como antes</button></span></div></div>';
  d.querySelector('.ok').onclick=msgClose;
  d.querySelectorAll('.m').forEach(e=>{const m=MSG.list[+e.dataset.i];let T=null;try{T=typeof toastTarget==='function'?toastTarget(m.html):null;}catch(x){}
    if(T){e.classList.add('go');e.title='Abrir';e.onclick=()=>{msgClose();try{toastOpen(T);}catch(x){}};}});
  const a=d.querySelector('[data-a="all"]');if(a)a.onclick=()=>{fresh.forEach(m=>m.read=true);MSG.unread=0;msgRefresh();msgOpen();d.querySelector('h3').lastChild.textContent='Últimos mensajes';};
  d.querySelector('[data-a="old"]').onclick=()=>{MSG.old=true;try{localStorage.setItem('nostos-avisos-antes','1');}catch(x){}msgClose();msgRefresh();toast('Los avisos vuelven a salir en pantalla. Para volver al heraldo: Menú › Accesibilidad.');};
  fresh.forEach(m=>m.read=true);MSG.unread=0;msgRefresh();d.hidden=false;MSG.open=true;try{if(typeof releasePointer==='function')releasePointer();}catch(e){}
  setTimeout(()=>{const b=d.querySelector('.ok');b&&b.focus();},30);}
function msgClose(){const d=$('msgBox');if(d)d.hidden=true;MSG.open=false;}
addEventListener('keydown',e=>{if(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  if(MSG.open&&(e.key==='Escape'||e.code==='Period'||e.key==='Enter')){e.preventDefault();e.stopPropagation();msgClose();return;}
  if(e.code==='Period'&&!MSG.old&&typeof ui!=='undefined'&&ui==='play'){e.preventDefault();msgOpen();}},true);
// en Accesibilidad: volver al heraldo (o a los avisos en pantalla)
{const f=accMenu;accMenu=function(){const r=f.apply(this,arguments);try{const o=$('dOpts');if(o&&!o.querySelector('.msgOpt')){const b=document.createElement('button');b.className='quiz msgOpt';
  b.innerHTML='<span class="n">✉</span><span>Avisos: '+(MSG.old?'en pantalla, como antes (pulsa para usar el heraldo)':'en el heraldo, abajo a la derecha (pulsa para verlos en pantalla)')+'</span>';
  b.onclick=()=>{MSG.old=!MSG.old;try{localStorage.setItem('nostos-avisos-antes',MSG.old?'1':'0');}catch(e){}msgRefresh();b.querySelector('span:last-child').textContent='Avisos: '+(MSG.old?'en pantalla, como antes':'en el heraldo, abajo a la derecha');};o.insertBefore(b,o.lastElementChild);}}catch(e){}return r;};}
{let t=0;const f=uxTick;uxTick=function(dt){f(dt);t+=dt;if(t>1){t=0;try{msgRefresh();}catch(e){}}};}
