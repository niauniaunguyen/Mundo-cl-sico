// ============================================================ RENDIMIENTO (prueba del 23/11: RTX 4070, 18-25 imágenes/s en Atenas)
// Lo que decía la prueba de rendimiento:
//  · seal2Tick (100, sellado de paredes) gastaba 7 ms en cada fotograma, sin parar: volvía a sellar cada 30 s porque cambiaba el número
//    de cosas en la escena, y ahora hay cosas que aparecen y desaparecen solas (objetos junto a las puertas, gorriones). Arreglado en 100:
//    no cuentan las marcadas con userData.noSeal, hacen falta al menos 3 piezas nuevas, y las pasadas repetidas gastan 2,5 ms como mucho.
//  · Personas con la figura de Blender: con 60 (218) era lo que más pesaba; con 20 se ganaban 6 imágenes/s. Se vuelve a 40 en escritorio.
//  · Esas figuras proyectaban sombra hasta a 140 m: ahora solo las que están a menos de 35 m (más lejos la sombra apenas se ve y obliga
//    a dibujar cada figura dos veces).
try{if(!ACC.lite)BP.K=Math.min(BP.K,typeof isTouch!=='undefined'&&isTouch?22:40);}catch(e){}
try{if(typeof AQ!=='undefined'&&AQ.base)AQ.base.bpK=Math.min(AQ.base.bpK,40);}catch(e){}
const RND23={SH:35};
function r23Meshes(g){let L=g.userData.r23m;if(!L){L=[];g.children[0].traverse(o=>{if(o.isMesh&&o.castShadow)L.push(o);});g.userData.r23m=L;}return L;}
{const f=bpLod;bpLod=function(){const r=f.apply(this,arguments);try{if(typeof camera==='undefined')return r;const cx=camera.position.x,cz=camera.position.z,S2=RND23.SH*RND23.SH;
  for(const g of BP.list){if(!g.parent||!g.children[0]||!g.children[0].visible)continue;const dx=g.position.x-cx,dz=g.position.z-cz,on=dx*dx+dz*dz<S2;if(g.userData.r23sh===on)continue;g.userData.r23sh=on;for(const m of r23Meshes(g))m.castShadow=on;}}catch(e){}return r;};}
