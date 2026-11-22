// ============================================================ ROPA SIN CRUCES (vídeo del 22/11: Lisicles, el arriero)
// En las figuras hechas por piezas (las que no son de Blender), el manto (himation) y la toga pasaban por dentro de las mangas anchas
// del quitón y asomaban a trozos por la espalda y los hombros; y el pelo se metía en el cuello de la túnica.
// Arreglo: se «hincha» un poco cada malla de esas prendas, empujando sus vértices hacia fuera a lo largo de la normal (manto y toga
// 1,8 cm, velo 1,2 cm, pelo 0,6 cm), para que queden siempre por fuera de la túnica.
// Se hace una sola vez sobre las piezas compartidas, así que vale también para las personas ya creadas.
const RSC={done:false,n:0};
function rscInflate(P,d){if(!P||!P.meshes)return;for(const m of P.meshes){const g=m.geo;if(!g||g.userData&&g.userData.rsc)continue;const p=g.attributes.position;let nr=g.attributes.normal;if(!nr){g.computeVertexNormals();nr=g.attributes.normal;}if(!p||!nr)continue;
  for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)+nr.getX(i)*d,p.getY(i)+nr.getY(i)*d,p.getZ(i)+nr.getZ(i)*d);p.needsUpdate=true;g.computeBoundingSphere();g.userData=g.userData||{};g.userData.rsc=1;RSC.n++;}}
function rscApply(){if(RSC.done||typeof GLB==='undefined'||!GLB.ok||!GLB.parts)return;RSC.done=true;
  try{for(const[n,d]of[['P_himation_m',0.018],['P_himation_f',0.018],['P_toga',0.018],['P_veil',0.012],['P_hair_m',0.006],['P_hair_f',0.006]])rscInflate(GLB.parts[n],d);}catch(e){console.warn('rsc',e);}}
// después de que 183 (figApply) haya dado caída y pliegues a la ropa; si alguien se crea antes, se aplica en ese momento
{const f=figApply;figApply=function(){const r=f.apply(this,arguments);try{rscApply();}catch(e){}return r;};}
{const f=makePersonGLB;makePersonGLB=function(c){try{if(typeof FIG!=='undefined'&&FIG.done)rscApply();}catch(e){}return f.apply(this,arguments);};}
