// ============================================================ COLOR CALIBRADO (experimental, se activa en Esc → Partida)
// Con la opción activa, los colores escritos en el código (en sRGB, como en cualquier editor) se pasan a lineales al crearlos, y la
// imagen final se vuelve a codificar en sRGB (renderer.outputEncoding, en 232). Es la gestión del color correcta, la que three.js
// hace por defecto desde la versión 152; en r128 hay que hacerlo a mano. Tiene que ir antes que nada: por eso este archivo es el 000.
// Sin la opción, no cambia nada.
const COLCAL=(()=>{try{return localStorage.getItem('nostos-color')==='calibrado';}catch(e){return false;}})();
if(COLCAL&&typeof THREE!=='undefined'){const P=THREE.Color.prototype,lin=c=>c<0.04045?c*0.0773993808:Math.pow(c*0.9478672986+0.0521327014,2.4),srgb=c=>c<0.0031308?c*12.92:1.055*Math.pow(c,0.41666)-0.055;
  for(const k of['setHex','setStyle']){const f=P[k];P[k]=function(){f.apply(this,arguments);this.r=lin(this.r);this.g=lin(this.g);this.b=lin(this.b);return this;};}
  const gh=P.getHex;P.getHex=function(){const r=this.r,g=this.g,b=this.b;this.r=srgb(r);this.g=srgb(g);this.b=srgb(b);const h=gh.call(this);this.r=r;this.g=g;this.b=b;return h;};
  P.getHexString=function(){return('000000'+this.getHex().toString(16)).slice(-6);};
  const gs=P.getStyle;P.getStyle=function(){const r=this.r,g=this.g,b=this.b;this.r=srgb(r);this.g=srgb(g);this.b=srgb(b);const s=gs.call(this);this.r=r;this.g=g;this.b=b;return s;};}
