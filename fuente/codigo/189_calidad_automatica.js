// ============================================================ CALIDAD AUTOMÁTICA SEGÚN EL ORDENADOR (P2)
// Antes: si en 20 s el juego iba a menos de 24 imágenes por segundo, se encendía el modo ligero de golpe y no volvía atrás.
// Ahora, cada 4 s de juego se mide la fluidez y se ajusta poco a poco, en los dos sentidos:
//  · por debajo de 30 imágenes/s: primero baja la resolución (pixel ratio, de 15 en 15 %, hasta 0,6); si no basta, baja un escalón
//    de detalle (2 → 1 → 0): sombras, personas y columnas de alto detalle, copas de detalle de los árboles, figuras de Blender;
//  · por encima de 55, y durante dos medidas seguidas: lo contrario, en orden inverso (primero el detalle, luego la resolución).
// Se puede desactivar en el menú › Accesibilidad («Ajustar la calidad automáticamente»); el modo ligero manual sigue mandando.
const AQ={on:true,t:0,n:0,last:0,good:0,lvl:2,pr:1,prMax:1,base:null,log:[]};
function aqBase(){if(AQ.base)return AQ.base;const b={};try{b.bpK=BP.K;b.bpVR=BP.VR;}catch(e){}try{b.bphN=BPH.N;b.bphD=BPH.D;}catch(e){}try{b.npbK=NPB.K;b.npbR=NPB.R;}catch(e){}
  try{b.archR=ARCH.R;}catch(e){}try{b.tlR=TLOD.R;b.tlMax=TLOD.max;}catch(e){}b.sh=renderer.shadowMap.enabled;return AQ.base=b;}
function aqApply(){const b=aqBase(),L=AQ.lvl,k=L>=2?1:L===1?0.6:0.35;
  try{BP.K=Math.max(4,Math.round(b.bpK*k));BP.VR=b.bpVR*(L>=2?1:L===1?0.75:0.5);}catch(e){}
  try{BPH.N=L>=2?b.bphN:L===1?Math.min(b.bphN,2):0;}catch(e){}
  try{if(b.npbK!==undefined)NPB.K=Math.max(3,Math.round(b.npbK*k));}catch(e){}
  try{ARCH.R=L>=2?b.archR:L===1?b.archR*0.6:0;}catch(e){}
  try{TLOD.R=b.tlR*(L>=2?1:L===1?0.7:0.45);TLOD.max=Math.round(b.tlMax*(L>=2?1:L===1?0.6:0.3));}catch(e){}
  try{const sh=L>=1&&b.sh;if(renderer.shadowMap.enabled!==sh){renderer.shadowMap.enabled=sh;scene.traverse(o=>{if(o.material){const m=Array.isArray(o.material)?o.material:[o.material];m.forEach(x=>x.needsUpdate=true);}});}}catch(e){}
  try{renderer.setPixelRatio(AQ.pr);}catch(e){}}
function aqStep(fps){AQ.log.push(Math.round(fps));if(AQ.log.length>20)AQ.log.shift();
  if(fps<30){AQ.good=0;
    if(AQ.pr>0.6+1e-3){AQ.pr=Math.max(0.6,+(AQ.pr*0.85).toFixed(3));aqApply();return 'pr-';}
    if(AQ.lvl>0){AQ.lvl--;aqApply();return 'lvl-';}return '';}
  if(fps>55){if(++AQ.good<2)return '';AQ.good=0;
    if(AQ.lvl<2){AQ.lvl++;aqApply();return 'lvl+';}
    if(AQ.pr<AQ.prMax-1e-3){AQ.pr=Math.min(AQ.prMax,+(AQ.pr/0.85).toFixed(3));aqApply();return 'pr+';}}
  else AQ.good=0;return '';}
(function aqLoop(now){requestAnimationFrame(aqLoop);
  if(typeof ACC!=='undefined'&&(ACC.lite||ACC.noAuto)){AQ.last=now;return;}   // el modo ligero manual y la opción desactivada mandan
  if(typeof ui==='undefined'||ui!=='play'||document.hidden||typeof renderer==='undefined'){AQ.last=now;return;}
  if(!AQ.started){AQ.started=1;AQ.prMax=AQ.pr=renderer.getPixelRatio();aqBase();try{FPSW.asked=true;}catch(e){}}   // sustituye al encendido de golpe del modo ligero
  const dt=(now-(AQ.last||now))/1000;AQ.last=now;if(dt<=0||dt>5)return;   // hasta 5 s por imagen: en un ordenador muy lento también hay que medir (al volver de otra pestaña el salto es mayor)AQ.t+=dt;AQ.n++;
  if(AQ.t>=4){const fps=AQ.n/AQ.t;AQ.t=0;AQ.n=0;aqStep(fps);}})(0);
// opción en Accesibilidad
{const f=accMenu;accMenu=function(){f.apply(this,arguments);try{const box=$('accBox');if(!box||box.querySelector('[data-k="noAuto"]'))return;const ref=box.querySelector('input[data-k="lite"]');if(!ref)return;
  const lab=document.createElement('label');lab.style.cssText='display:flex;gap:10px;align-items:center;padding:8px;border:1px solid #6a4a30;border-radius:8px;margin:6px 0;cursor:pointer';
  lab.innerHTML='<input type="checkbox" data-k="noAuto2" '+(ACC.noAuto?'':'checked')+'> Ajustar la calidad automáticamente según lo que pueda tu ordenador';ref.closest('label').after(lab);
  lab.querySelector('input').onchange=e=>{ACC.noAuto=!e.target.checked;accSave();if(ACC.noAuto){AQ.lvl=2;AQ.pr=AQ.prMax;aqApply();}};}catch(e){}};}
// accApply pone la resolución de siempre al guardar cualquier opción: se vuelve a aplicar la del ajuste automático
{const f=accApply;accApply=function(){f.apply(this,arguments);try{if(AQ.started&&!ACC.lite&&!ACC.noAuto)aqApply();}catch(e){}};}
// el modo ligero que encendía solo el sistema anterior pasa a manos del ajuste automático (el que se eligió a mano se respeta)
try{if(ACC.lite&&ACC.liteAuto){ACC.lite=false;ACC.liteAuto=0;accSave();}}catch(e){}
AQ.step=aqStep;   // para las pruebas
