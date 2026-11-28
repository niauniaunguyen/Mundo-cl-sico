// ============================================================ JUGAR SOLO (para grabar): el juego se juega en automático, a ×1 o ×2
// Esc → Partida → «Jugar solo», o la tecla F7. Usa el jugador automático de 220 (anda, habla con la gente, elige respuestas, abre el
// menú y viaja a otros destinos) sin límite de tiempo y sin carteles de prueba, con un mando pequeño en una esquina: velocidad ×1/×2
// y parar. La velocidad ×2 acelera el tiempo del juego (todo se mueve el doble de rápido: gente, animales, sol, el propio jugador).
// Los fallos que encuentre se siguen anotando en el registro de 220 (Esc → Partida → Cazar fallos).
const AUTO={el:null};
function autoUI(){if(AUTO.el)return AUTO.el;const d=document.createElement('div');d.id='autoBox';
  d.style.cssText='position:fixed;right:max(12px,env(safe-area-inset-right,0px));bottom:max(96px,calc(env(safe-area-inset-bottom,0px) + 96px));z-index:40;display:flex;gap:6px;align-items:center;background:rgba(24,18,12,.82);border:1px solid #b8955a;border-radius:10px;padding:6px 8px;font:14px Georgia,serif;color:#f3e6c8';
  const lb=document.createElement('span');lb.textContent='Jugando solo';lb.style.marginRight='4px';
  const mk=(t,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.style.cssText='font:inherit;padding:4px 10px;border-radius:7px;border:1px solid #b8955a;background:#3a2c1e;color:#f3e6c8;cursor:pointer';b.onclick=e=>{e.stopPropagation();fn(b);};return b;};
  const sp=mk('×1',b=>{window.__spd=(window.__spd||1)>=2?1:2;b.textContent='×'+window.__spd;});
  const st=mk('Parar',()=>autoStop());d.append(lb,sp,st);document.body.appendChild(d);AUTO.el=d;AUTO.sp=sp;return d;}
function autoStart(){if(typeof CZ==='undefined'||CZ.bot||CZ.audit)return;autoUI().hidden=false;window.__spd=window.__spd||1;if(AUTO.sp)AUTO.sp.textContent='×'+window.__spd;try{toast('El juego se juega solo. Pulsa ×2 para ir más rápido y «Parar» (o F7) para volver a jugar tú.');}catch(e){}
  czBot(1e6,true);}
function autoStop(){if(typeof CZ!=='undefined'&&CZ.bot)CZ.bot=null;window.__spd=1;if(AUTO.el)AUTO.el.hidden=true;}
function autoEnd(a){window.__spd=1;if(AUTO.el)AUTO.el.hidden=true;try{toast('Has vuelto a jugar tú. Mientras jugaba solo: '+a.andar+' paseos, '+a.hablar+' conversaciones, '+a.viajes+' viajes.');}catch(e){}}
addEventListener('keydown',e=>{if(e.code!=='F7')return;e.preventDefault();if(typeof CZ!=='undefined'&&CZ.bot)autoStop();else if(typeof ui!=='undefined'&&ui==='play')autoStart();});
{const f=gmDo;gmDo=function(k){if(k==='auto'){try{gmClose&&gmClose();}catch(e){}setTimeout(autoStart,400);return;}return f.apply(this,arguments);};}
