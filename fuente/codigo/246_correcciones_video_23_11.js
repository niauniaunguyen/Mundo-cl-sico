// ============================================================ CORRECCIONES DEL VÍDEO DEL 23/11
// · Portales de leyenda: en Nemea se podía salir del círculo del combate y ya no se podía volver a entrar (y el león no te seguía).
//   Ahora el jugador no puede alejarse del centro más que el borde del círculo (el portal de salida, a 13,6 m, queda dentro).
// (Las demás correcciones de ese vídeo están en 100, 113, 182, 186, 233 y 245.)
const C23={R:14.6,n:0};
function c23Clamp(){if(typeof legIn!=='function'||!legIn())return;const R=INT2.in&&INT2.in.R;if(!R)return;const P=player,dx=P.x-R.X,dz=P.z-R.Z,d=Math.hypot(dx,dz);
  if(d>C23.R){const k=C23.R/d;P.x=R.X+dx*k;P.z=R.Z+dz*k;C23.n++;}}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{c23Clamp();}catch(e){}return r;};}
