// ============================================================ EQUIPOS MODESTOS (prueba del 25/11: Chromebook del instituto)
// Lo que decía la prueba: 2 núcleos, 4 GB, gráfica Intel UHD (Jasper Lake), 1366×633. Entre 2,5 y 5 imágenes/s en Atenas, con el
// modo ligero APAGADO (solo había bajado la calidad automática): 60 personas con figura de Blender, sombras, 1.500-1.800 llamadas de
// dibujo, hasta 5,9 millones de triángulos y el sellado de paredes (seal2Tick) gastando 7-9 ms en cada fotograma.
// Cambios:
//  · 099: la primera vez que se abre el juego en un equipo con 2 núcleos o menos, o 4 GB o menos, se enciende el modo ligero (ACC.liteHw).
//    Así se aplica desde el arranque (antes solo se encendía a los 20 s y, al volver a abrir, se apagaba otra vez). Se puede quitar en
//    el menú › Accesibilidad; si se quita a mano, no se vuelve a encender.
//  · aquí, solo en esos equipos y con el modo ligero puesto: menos distancia de dibujo (las cosas pequeñas desaparecen antes),
//    menos personas con figura de Blender, resolución al 85 % y el sellado de paredes con 2 ms por fotograma como mucho.
//  · 256: en modo ligero no se encienden las dos luces de interior (cada luz más encarece todos los píxeles).
const K8={weak:false,told:false,k:0.5};
try{const nc=navigator.hardwareConcurrency||4,mem=navigator.deviceMemory||8;K8.weak=nc<=2||mem<=4;}catch(e){}
function k8On(){return K8.weak&&typeof ACC!=='undefined'&&ACC.lite;}
try{if(k8On()){BP.K=Math.min(BP.K,6);BP.R=Math.min(BP.R,45);BP.VR=Math.min(BP.VR,45);SEAL2.ms=2;}}catch(e){}
{const f=cullRegister;cullRegister=function(){const n0=CULL.reg.length,r=f.apply(this,arguments);if(k8On())for(let i=n0;i<CULL.reg.length;i++){const e=CULL.reg[i];if(!e.k8){e.k8=1;e.lim*=K8.k;}}return r;};}
{const f=accApply;accApply=function(){const r=f.apply(this,arguments);try{if(k8On())renderer.setPixelRatio(0.85);}catch(e){}return r;};}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!K8.told&&state&&ui==='play'&&ACC.liteHw&&ACC.lite&&!ACC.liteHwTold){K8.told=true;ACC.liteHwTold=1;try{localStorage.setItem('nostos-acc',JSON.stringify(ACC));}catch(e){}
  toast('<span class="label">Modo ligero</span><br>Este ordenador es modesto, así que el juego dibuja menos cosas a lo lejos, menos sombras y menos detalle para ir más fluido. Puedes quitarlo en el menú › Accesibilidad.');}}catch(e){}return r;};}
