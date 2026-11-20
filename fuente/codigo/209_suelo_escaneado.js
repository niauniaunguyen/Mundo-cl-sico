// ============================================================ SUELO ESCANEADO (Poly Haven, CC0)
// Las texturas de detalle del terreno (036, terrainMat) se cambian por escaneos reales de suelo de Poly Haven (https://polyhaven.com),
// preparados en herramientas/texturas/suelo_polyhaven.py (modelos/suelo_*.jpg → datos/imgsu_*.txt, en segundo plano):
//   tierra ← dry_ground_rocks (tierra seca con piedrecitas) · roca ← rocky_terrain_02 (laderas empinadas) · hierba ← grass_ground
//   grava ← rocky_trail_02 · grietas ← dry_ground_01 (tierra seca cuarteada)
// Siguen siendo texturas «de detalle»: el color de cada sitio lo ponen los vértices del terreno (tierra del Ática, campos, terra rossa).
// Cada escaneo cubre unos pocos metros, así que se repite más a menudo que las texturas de antes (el sombreado ya mezcla dos escalas
// giradas para que no se note la repetición). Mientras no llegan, se ven las texturas procedurales de siempre.
const SU={done:0,want:{tierra:['groundMap','tpScale',1/3.2],roca:['rockMap','rS',1/7],hierba:['grassMap','hS',1/2.6],grava:['gravMap','vS',1/2.4],grietas:['crackMap','cS',1/3.4]},err:null};
function suLoad(){if(SU.loading||typeof bpBytes!=='function'||typeof TERR_U==='undefined')return;SU.loading=1;
  if(typeof ACC!=='undefined'&&ACC.lite)return;   // en los equipos modestos, las de siempre (pesan menos)
  for(const k in SU.want){const [u,s,sc]=SU.want[k];
    bpBytes('imgsu_'+k).then(buf=>{if(!buf)return;const url=URL.createObjectURL(new Blob([buf],{type:'image/jpeg'})),im=new Image();
      im.onload=()=>{const t=new THREE.Texture(im);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.needsUpdate=true;
        TERR_U[u].value=t;TERR_U[s].value=sc;SU.done++;};im.src=url;}).catch(e=>{SU.err=String(e);});}}
{const f=uxTick;uxTick=function(dt){f(dt);if(SU.loading)return;if(!state||ui==='start')return;if(!SU.t0)SU.t0=performance.now();if(performance.now()-SU.t0<6000)return;try{suLoad();}catch(e){SU.err=String(e);}};}   // 6 s después de empezar
