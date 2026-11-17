// ============================================================ RELIEVE REAL DE TODOS LOS DESTINOS
// El relieve base de cada destino (islandBase) deja de ser inventado (llano con montes en forma de cúpula) y pasa a ser el de hoy,
// del modelo de elevaciones Copernicus GLO-30 (un punto cada 30 m), a escala 1:1 y con el norte hacia -z. Los datos (#demdata,
// modelos/relieve_real.json) los prepara herramientas/relieve_real/dem_todos.py: para cada destino, su sitio real alineado con el
// mapa del juego (la costa real con la del juego y los solares en llano), suavizado para borrar casas y carreteras de hoy.
// Encima siguen los allanamientos de los edificios, los ríos excavados, un poco del detalle de 185_relieve.js y la sierra del borde.
// Con costa (cs): el mar sigue siendo el del juego (puertos, barcos, muelles), mezclado con el relieve real en una franja de unos
// 60 m junto a la orilla; tierra adentro manda el relieve real.
// Cuidado: el relieve actual no es el antiguo en todo. Los ríos han movido las costas (Éfeso y Mileto, hoy tierra adentro; las
// Termópilas, donde el mar llegaba al paso), y los aluviones enterraron santuarios (el Altis de Olimpia, bajo varios metros de limo
// del Alfeo y del Cladeo). Por eso la costa del juego manda y los solares se allanan a su altura. Las dos ciudades de partida
// (Atenas y Roma) tienen distancias comprimidas a propósito y no usan estos datos.
const DEM={c:{},data:null};
function demData(){if(DEM.data)return DEM.data;let d={};try{if(!/sinrelieve/.test(location.search)){const el=document.getElementById('demdata');if(el&&el.textContent.trim().length>2)d=JSON.parse(el.textContent);}}catch(e){}return DEM.data=d;}
function demGet(id){const k=MODE+':'+id;if(DEM.c[k]!==undefined)return DEM.c[k];const m=demData()[MODE],d=m&&m[id];if(!d)return DEM.c[k]=null;
  const b=atob(d.b),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return DEM.c[k]=Object.assign({H:new Int16Array(u.buffer)},d);}
// interpolación cúbica (Catmull-Rom): sin las aristas que dejaría la bilineal en una rejilla de 30 m
function demGrid(D,A,lx,lz,sc){const n=D.n,u=Math.min(n-1.001,Math.max(0,(lx-D.x0)/D.st)),v=Math.min(n-1.001,Math.max(0,(lz-D.x0)/D.st)),i=Math.floor(u),j=Math.floor(v),fu=u-i,fv=v-j;
  const g=(a,b)=>A[Math.min(n-1,Math.max(0,b))*n+Math.min(n-1,Math.max(0,a))]*sc,cr=(p0,p1,p2,p3,t)=>p1+0.5*t*(p2-p0+t*(2*p0-5*p1+4*p2-p3+t*(3*(p1-p2)+p3-p0)));
  const r=[];for(let k=-1;k<=2;k++)r.push(cr(g(i-1,j+k),g(i,j+k),g(i+1,j+k),g(i+2,j+k),fu));return cr(r[0],r[1],r[2],r[3],fv);}
function demH(D,lx,lz){return Math.max(1.5,demGrid(D,D.H,lx,lz,0.1));}
// el mar del juego: solo el que llega al borde del mapa (los charcos del relieve inventado no cuentan), algo suavizado
function demSea(D,I,f){const n=D.n,o=new Float32Array(n*n),low=new Uint8Array(n*n);for(let j=0;j<n;j++)for(let i=0;i<n;i++){const v=f(I,I.x+D.x0+i*D.st,I.z+D.x0+j*D.st);o[j*n+i]=v;low[j*n+i]=v<0.6?1:0;}
  const sea=new Uint8Array(n*n),q=[];for(let k=0;k<n;k++)for(const idx of[k,(n-1)*n+k,k*n,k*n+n-1])if(low[idx]&&!sea[idx]){sea[idx]=1;q.push(idx);}
  while(q.length){const idx=q.pop(),i=idx%n,j=(idx-i)/n;for(const[a,b]of[[i+1,j],[i-1,j],[i,j+1],[i,j-1]]){if(a<0||b<0||a>=n||b>=n)continue;const k2=b*n+a;if(low[k2]&&!sea[k2]){sea[k2]=1;q.push(k2);}}}
  const S=new Float32Array(n*n);for(let j=0;j<n;j++)for(let i=0;i<n;i++){let s=0,w=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=n||jj>=n)continue;const ww=a||b?0.5:1;s+=sea[jj*n+ii]*ww;w+=ww;}S[j*n+i]=s/w;}
  return S;}
{const f=islandBase;islandBase=function(I,x,z){const D=I&&demGet(I.id);if(!D)return f(I,x,z);I.dem=1;const lx=x-I.x,lz=z-I.z;let h=demH(D,lx,lz);
  if(I.lake){const L=I.lake,q=Math.hypot((x-L.x)/L.rx,(z-L.z)/L.rz);if(q<1.3)h=Math.min(h,lerp(-7,h,sstep(clamp((q-0.85)/0.45,0,1))));}
  let r=Math.max(carveH(x,z,sqMount(I.id,x,z,h)),-9);
  if(D.cs){if(!D.S)D.S=demSea(D,I,f);const s=clamp(demGrid(D,D.S,lx,lz,1),0,1);if(s>0.001)r=lerp(r,f(I,x,z),sstep(s));}   // el mar del juego
  return r;};}
// los solares con altura fija (pensados para el llano inventado) toman la del relieve real en su sitio
{const f=pad;pad=function(I,lx,lz,r,dh,fixed){if(I&&demGet(I.id)&&fixed!==undefined)fixed=undefined;return f.call(this,I,lx,lz,r,dh,fixed);};}
