// ============================================================ MONTAÑAS MÁS REALES SIN CASTIGAR A LOS EQUIPOS MODESTOS (27/11)
// Antes, el Himeto, el Egaleo y el Parnés eran cúpulas lisas (una campana de Gauss cada uno) y la sierra del borde de cada mapa, una
// pared con un poco de ruido. Ahora:
//  1. Forma: la parte alta del Himeto pasa a ser una sierra larga de norte a sur, la del Egaleo corre de noroeste a sureste y la del
//     Parnés es un macizo ancho de este a oeste, como los reales (la falda y las alturas no cambian: el mapa comprime las distancias). Encima, un relieve con
//     erosión preparado fuera del juego (herramientas/terreno/montes_erosion.py: fBm «erosionado» y gotas de lluvia que abren
//     barrancos): crestas, barrancos ramificados y valles. Se lee de una tabla de 256 × 256 alturas (128 KB), así que calcularlo
//     cuesta casi nada; se aplica solo en los montes (nunca en la ciudad) y en la sierra del borde de todos los mapas.
//  2. Sombreado de detalle: la misma erosión, a tres escalas (la de la forma y otras dos más finas), en una textura de 512 × 512
//     que guarda la inclinación de cada punto y por dónde corre el agua: luces y sombras de barrancos y crestas más finos que la malla,
//     caliza gris y desnuda en las pendientes con estratos, matorral oscuro (frigana y maquia) a manchas y en los barrancos,
//     donde se junta la humedad. Son tres lecturas de textura por píxel, y solo en las laderas.
//  3. Al construir el terreno, oclusión ambiental calculada una vez con las alturas de la malla: los valles y barrancos, más oscuros
//     y verdes; las crestas, más claras. Va en los colores de los vértices: no cuesta nada al dibujar.
//  4. Perspectiva aérea: los montes lejanos, algo más azulados y con menos contraste, como se ven de verdad.
// En el modo ligero (Chromebook, móviles) se quedan la forma (1), la oclusión (3) y la perspectiva (4): el sombreado de detalle (2)
// se apaga, porque es lo único que cuesta en la tarjeta gráfica.
// Los montes del Ática: el Himeto, famoso por su miel y su tomillo, era casi pelado ya en la Antigüedad; el Parnés tenía bosques de
// abetos y pinos (Teofrasto, Historia de las plantas III 9; Platón, Critias 111 c, sobre los montes del Ática que antes tenían bosque).
const MTN={h:null,N:256,P1:3100,on:true,tex:null,n:0,ms:0};
function mtLoad(){if(typeof bpBytes!=='function')return Promise.resolve();return bpBytes('glbmt').then(b=>{if(b&&b.byteLength>=MTN.N*MTN.N*2)MTN.h=new Uint16Array(b,0,MTN.N*MTN.N);}).catch(e=>console.warn('montes',e));}
// altura de la erosión (0-1) en el mosaico, que se repite cada MTN.P1 metros, girado para que no siga los ejes
const MT_C=Math.cos(0.43),MT_S=Math.sin(0.43);
function mtTile(x,z){const H=MTN.h,N=MTN.N;if(!H)return 0.5;const u=(x*MT_C-z*MT_S)/MTN.P1*N,v=(x*MT_S+z*MT_C)/MTN.P1*N;
  const x0=Math.floor(u),y0=Math.floor(v),fx=u-x0,fy=v-y0,a=((x0%N)+N)%N,b=((y0%N)+N)%N,a1=(a+1)%N,b1=(b+1)%N;
  return ((H[b*N+a]*(1-fx)+H[b*N+a1]*fx)*(1-fy)+(H[b1*N+a]*(1-fx)+H[b1*N+a1]*fx)*fy)/65535;}
// el relieve erosionado que se suma a un monte de altura mh: proporcional a su altura, y nada en los montes muy bajos
function mtDetail(x,z,mh){if(!MTN.on||mh<60)return 0;const w=sstep(clamp((mh-60)/100,0,1));   // nada por debajo de 60 m de monte: las afueras de la ciudad no cambian
  return (mtTile(x,z)-0.5)*mh*0.55*w+(mtTile(x*3.7+911,z*3.7-377)-0.5)*Math.min(mh,220)*0.13*w;}
// sierras alargadas: a lo largo, cresta casi llana que baja en los extremos; de través, laderas cóncavas abajo y convexas arriba
function mtRidge(x,z,cx,cz,ax,az,L,W,H){const dx=x-cx,dz=z-cz,u=dx*ax+dz*az;let v=-dx*az+dz*ax;v-=W*0.22*Math.sin(u*0.0021+cx*0.001);
  const fa=1-sstep(clamp((Math.abs(u)/L-0.45)/0.6,0,1)),t=Math.abs(v)/W;if(fa<=0||t>2.6)return 0;return H*fa*Math.exp(-t*t*1.6)*(1+0.18*Math.exp(-t*t*6));}
const MT_ATT=[   // [x, z, eje x, eje z, media longitud, media anchura, altura]; las cúpulas de 001 que sustituyen: [x, z, r, h]
  {o:[1700,0,750,380],n:[1760,40,0.26,-0.966,1500,520,390]},    // Himeto: de norte a sur, algo inclinado hacia el nordeste
  {o:[-2100,-250,750,300],n:[-2100,-250,-0.72,-0.69,1150,430,300]},   // Egaleo: de noroeste a sureste
  {o:[-300,-2700,1150,450],n:[-300,-2750,1,0,1800,820,470]}];   // Parnés: macizo ancho de este a oeste
// La falda de cada monte no se toca (sobre ella están el Liceo, el nacimiento del Iliso, los campos): solo su parte alta, por
// encima de una cuarta parte de su altura, se reparte en forma de sierra (más alta en la cresta, más baja a los lados).
if(typeof rawH==='function'){const f=rawH;rawH=function(x,z){const h0=f(x,z);if(MODE!=='atenas')return h0;let d=0,mh=0;
  for(const M of MT_ATT){const o=M.o,n=M.n,old=bump(x,z,o[0],o[1],o[2],o[3]);mh+=old;const k=old/o[3];if(k<0.2)continue;
    const w=sstep(clamp((k-0.2)/0.4,0,1)),r=mtRidge(x,z,n[0],n[1],n[2],n[3],n[4],n[5],n[6]),ratio=clamp(r/Math.max(old,1),0.55,1.3);d+=old*(ratio-1)*w;}
  mh+=bump(x,z,450,-960,130,200)*0.5;   // el Licabeto, más rocoso (a media fuerza: tiene la ciudad al pie)
  d+=mtDetail(x,z,mh);return h0>=0?Math.max(0,h0+d):h0+d;};}
// la sierra del borde de todos los mapas
if(typeof sqMount==='function'){const f=sqMount;sqMount=function(k,x,z,h){const r=f.apply(this,arguments),add=r-h;if(!(add>60))return r;return r+mtDetail(x+k.length*977,z,add);};}
// ---------- 3. oclusión ambiental en los colores de los vértices (una vez, al construir la malla)
function mtAO(m,seg){try{const g=m.geometry,P=g.attributes.position,C=g.attributes.color;if(!P||!C)return;const W=seg+1;if(P.count!==W*W)return;const t0=performance.now();
  const H=new Float32Array(W*W);for(let i=0;i<W*W;i++)H[i]=P.getY(i);const step=Math.abs(P.getX(1)-P.getX(0))||1,D=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],R=[1,2,4,7,11];
  const c=C.array;for(let j=0;j<W;j++)for(let i=0;i<W;i++){const k=j*W+i,h0=H[k];let occ=0,lap=0,nl=0;
    for(const d of D){let mx=0;for(const r of R){const ii=i+d[0]*r,jj=j+d[1]*r;if(ii<0||jj<0||ii>=W||jj>=W)break;const dh=(H[jj*W+ii]-h0)/(r*step*Math.hypot(d[0],d[1]));if(dh>mx)mx=dh;}occ+=Math.atan(mx);
      const ii=i+d[0],jj=j+d[1];if(ii>=0&&jj>=0&&ii<W&&jj<W){lap+=H[jj*W+ii]-h0;nl++;}}
    occ/=8*1.5708;const ao=1-Math.min(0.55,occ*1.6),cv=nl?clamp(lap/nl/(step*0.35),-1,1):0;   // cv > 0: hondonada; < 0: cresta
    const veg=Math.max(0,cv)*0.5;c[k*3]*=ao*(1-veg*0.35)*(1-Math.min(0,cv)*0.08);c[k*3+1]*=ao*(1-veg*0.12)*(1-Math.min(0,cv)*0.08);c[k*3+2]*=ao*(1-veg*0.4)*(1-Math.min(0,cv)*0.1);}
  C.needsUpdate=true;MTN.n++;MTN.ms+=performance.now()-t0;}catch(e){console.warn('montes ao',e);}}
if(typeof buildTerrain==='function'){const f=buildTerrain;buildTerrain=function(size,seg){const m=f.apply(this,arguments);if(m&&m.geometry)mtAO(m,seg);return m;};}
// ---------- 2 y 4. sombreado (envuelve terrainMat de 036: todos los terrenos lo usan)
const MT_U={mtMap:{value:(()=>{const t=new THREE.DataTexture(new Uint8Array([128,128,128,0]),1,1,THREE.RGBAFormat);t.needsUpdate=true;return t;})()},uMt:{value:0},uMtF:{value:1}};
try{if(typeof ACC!=='undefined'&&ACC.lite)MT_U.uMtF.value=0.6;}catch(e){}
function mtTex(){if(MTN.tex||MTN.texL||typeof bpBytes!=='function')return;if(typeof ACC!=='undefined'&&ACC.lite)return;MTN.texL=1;
  bpBytes('imgmt').then(buf=>{if(!buf)return;const url=URL.createObjectURL(new Blob([buf],{type:'image/webp'})),im=new Image();im.onload=()=>{const t=new THREE.Texture(im);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;
    try{t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());}catch(e){}t.needsUpdate=true;MT_U.mtMap.value=t;MT_U.uMt.value=1;MTN.tex=t;};im.src=url;}).catch(e=>console.warn('montes tex',e));}
const MT_GLSL=[
  '{float dist=length(vTpPos-cameraPosition);',
  ' if(uMt>0.0){float mw=uMt*clamp(smoothstep(0.1,0.34,slope)*0.85+smoothstep(55.0,170.0,vTpPos.y)*0.6,0.0,1.0);',
  '  if(mw>0.002){mat2 r1=mat2(0.9047,-0.4169,0.4169,0.9047);vec2 q0=r1*wp/3100.0;',
  '   vec4 d0=texture2D(mtMap,q0),d1=texture2D(mtMap,mat2(0.6,-0.8,0.8,0.6)*wp/720.0+0.31),d2=texture2D(mtMap,mat2(-0.28,-0.96,0.96,-0.28)*wp/170.0+0.67);',
  '   vec2 g=(d0.rg-0.5)*1.3+(d1.rg-0.5)*0.9+(d2.rg-0.5)*0.55;g=mat2(0.9047,0.4169,-0.4169,0.9047)*g;',   // la del mosaico grande, devuelta a los ejes del mundo
  '   float sh=1.0+clamp(dot(g,uLd.xz)/max(uLd.y,0.3)*1.1,-0.55,0.35);',
  '   float gully=max(d0.a,max(d1.a*0.9,d2.a*0.7));float lum=dot(col,vec3(0.299,0.587,0.114));',
  '   col=mix(col,vec3(lum*1.08,lum*1.06,lum*1.0),mw*rockW*0.55);',   // caliza: gris clara, poco color
  '   float st=0.5+0.5*sin(vTpPos.y*1.9+d1.b*7.0+d2.b*3.0);col*=1.0-mw*rockW*0.14*smoothstep(0.62,0.95,st);',   // estratos
  '   float bush=smoothstep(0.5,0.78,d2.b*0.45+(1.0-d1.b)*0.25+gully*0.7+tV(wp*0.35)*0.25);',
  '   col=mix(col,col*vec3(0.5,0.58,0.4),mw*bush*(1.0-rockW*0.55)*0.8);',   // matorral oscuro a manchas y en los barrancos
  '   col*=mix(1.0,sh,mw)*(1.0-mw*gully*0.22);}}',
  ' float ap=smoothstep(500.0,4200.0,dist)*0.42*uMtF;float l2=dot(col,vec3(0.299,0.587,0.114));col=mix(col,vec3(l2)*vec3(0.86,0.93,1.06)+vec3(0.02,0.03,0.05),ap);}',   // perspectiva aérea
].join('\n');
if(typeof terrainMat==='function'){const f=terrainMat;terrainMat=function(){const m=f.apply(this,arguments);const prev=m.onBeforeCompile;
  m.onBeforeCompile=function(sh,r){if(prev)prev.call(this,sh,r);Object.assign(sh.uniforms,MT_U);
    sh.fragmentShader='uniform sampler2D mtMap;uniform float uMt,uMtF;\n'+sh.fragmentShader.replace('diffuseColor.rgb*=col;',MT_GLSL+'\ndiffuseColor.rgb*=col;');};
  m.customProgramCacheKey=()=>'terr3';m.needsUpdate=true;return m;};}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(state&&ui!=='start'){mtTex();const lite=typeof ACC!=='undefined'&&ACC.lite;MT_U.uMt.value=MTN.tex&&!lite?1:0;MT_U.uMtF.value=lite?0.6:1;}}catch(e){}return r;};}   // si el modo ligero se activa a mitad de partida, el detalle se apaga
