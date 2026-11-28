// ============================================================ MUROS ESCANEADOS (ambientCG, CC0) (22/11: «texturas de ambientCG en mármol, estuco...»)
// Las texturas de detalle de los edificios (036, PTEX) estaban dibujadas a mano. Ahora llevan escaneos reales de https://ambientcg.com,
// preparados en herramientas/texturas/muros_ambientcg.py (modelos/muro_*.jpg → datos/immu_*.txt, en segundo plano):
//   · mármol ← Marble012 (mármol blanco de vetas grises, como el pentélico de Atenas o el de Luni en Roma)
//   · piedra ← Travertine009 (travertino claro: los sillares de Roma; en Atenas hace de piedra caliza)
//   · estuco ← Plaster003 (enlucido de cal de las casas)       · madera ← Wood049 (veta de las tablas)
//   · ladrillo ← Bricks097 (ladrillo viejo y desigual: el «opus testaceum» de Roma)
// El mármol, la piedra, el estuco y la madera conservan su dibujo de siempre (las juntas de los sillares, las tablas) y solo se les añade
// el grano fino del escaneo; el ladrillo se cambia entero, porque trae sus propias hiladas. El color sigue siendo el de cada material.
// En los equipos modestos (ACC.lite) se quedan las de siempre. Mientras no llegan, se ven las dibujadas.
const MUR={want:{marmol:'marble',piedra:'stone',estuco:'plaster',madera:'wood',ladrillo:'brick'},done:0,loading:0,err:null};
function murImg(buf){return new Promise((ok,ko)=>{const url=URL.createObjectURL(new Blob([buf],{type:'image/jpeg'})),im=new Image();im.onload=()=>ok(im);im.onerror=ko;im.src=url;});}
// mezcla en un lienzo de 512 px: el dibujo de siempre × el escaneo (gris de media 1, guardado como 1/1,6)
function murApply(key,im,replace){const T=PTEX[key];if(!T||!T.image)return;const N=512,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');
  const s=document.createElement('canvas');s.width=s.height=N;const sx=s.getContext('2d');sx.drawImage(im,0,0,N,N);const sd=sx.getImageData(0,0,N,N).data;
  if(!replace)x.drawImage(T.image,0,0,N,N);else{x.fillStyle='#d9d9d9';x.fillRect(0,0,N,N);}   // el ladrillo: la media de antes (0,85)
  const I=x.getImageData(0,0,N,N),d=I.data;for(let i=0;i<d.length;i+=4){const k=sd[i]*1.6/255;d[i]=Math.min(255,d[i]*k);d[i+1]=Math.min(255,d[i+1]*k);d[i+2]=Math.min(255,d[i+2]*k);}
  x.putImageData(I,0,0);T.image=c;T.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());T.needsUpdate=true;MUR.done++;}
function murLoad(){if(MUR.loading||typeof bpBytes!=='function'||typeof PTEX==='undefined')return;MUR.loading=1;
  if(typeof ACC!=='undefined'&&ACC.lite)return;
  for(const k in MUR.want)bpBytes('immu_'+k).then(buf=>buf&&murImg(buf)).then(im=>{if(im)murApply(MUR.want[k],im,k==='ladrillo');}).catch(e=>{MUR.err=String(e);});}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!MUR.loading&&state&&ui!=='start'){MUR.t=(MUR.t||0)+dt;if(MUR.t>4)murLoad();}}catch(e){MUR.err=String(e);}return r;};}
