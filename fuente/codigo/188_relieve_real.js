// ============================================================ RELIEVE REAL (prueba: Olimpia y Delfos)
// En los destinos con datos en DEMDATA (187_relieve_real_datos.js, generado por herramientas/relieve_real/dem.py a partir del modelo de
// elevaciones Copernicus GLO-30, un punto cada 30 m), el relieve base de islandBase deja de ser inventado (llano con montes en
// forma de cúpula) y pasa a ser el de hoy, a escala 1:1, con el norte hacia -z. Encima siguen los allanamientos de los edificios,
// los ríos excavados, el detalle de 185_relieve.js y la sierra del borde del mapa.
// Cuidado: el relieve actual no es el de la Antigüedad en todo. En Olimpia, el Alfeo y el Cladeo enterraron el santuario bajo
// varios metros de limo después de los terremotos y las riadas de los siglos VI-VII d.C.: el suelo antiguo del Altis está unos
// 4-7 m por debajo del de los alrededores de hoy (las excavaciones alemanas lo destaparon desde 1875). Por eso el santuario se
// allana a su altura y no a la del terreno actual.
const DEM={c:{}};
function demGet(id){if(DEM.c[id]!==undefined)return DEM.c[id];const d=typeof DEMDATA!=='undefined'&&DEMDATA[id];if(!d)return DEM.c[id]=null;
  const b=atob(d.b),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return DEM.c[id]=Object.assign({H:new Int16Array(u.buffer)},d);}
// interpolación cúbica (Catmull-Rom): sin las aristas que dejaría la bilineal en una rejilla de 30 m
function demH(D,lx,lz){const n=D.n,u=Math.min(n-1.001,Math.max(0,(lx-D.x0)/D.st)),v=Math.min(n-1.001,Math.max(0,(lz-D.x0)/D.st)),i=Math.floor(u),j=Math.floor(v),fu=u-i,fv=v-j;
  const g=(a,b)=>D.H[Math.min(n-1,Math.max(0,b))*n+Math.min(n-1,Math.max(0,a))]*0.1,cr=(p0,p1,p2,p3,t)=>p1+0.5*t*(p2-p0+t*(2*p0-5*p1+4*p2-p3+t*(3*(p1-p2)+p3-p0)));
  const r=[];for(let k=-1;k<=2;k++)r.push(cr(g(i-1,j+k),g(i,j+k),g(i+1,j+k),g(i+2,j+k),fu));return Math.max(1.5,cr(r[0],r[1],r[2],r[3],fv));}
{const f=islandBase;islandBase=function(I,x,z){const D=I&&demGet(I.id);if(!D)return f(I,x,z);I.dem=1;let h=demH(D,x-I.x,z-I.z);
  if(I.lake){const L=I.lake,q=Math.hypot((x-L.x)/L.rx,(z-L.z)/L.rz);if(q<1.3)h=Math.min(h,lerp(-7,h,sstep(clamp((q-0.85)/0.45,0,1))));}
  return Math.max(carveH(x,z,sqMount(I.id,x,z,h)),-9);};}
// los solares con altura fija (pensados para el llano inventado) toman la del relieve real en su sitio
{const f=pad;pad=function(I,lx,lz,r,dh,fixed){if(I&&demGet(I.id)&&fixed!==undefined)fixed=undefined;return f.call(this,I,lx,lz,r,dh,fixed);};}
