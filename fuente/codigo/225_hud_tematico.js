// ============================================================ HUD TEMÁTICO (propuesta 1B del lienzo, «pieza de museo», 22/11)
// Deja los recuadros oscuros de siempre y viste cada pieza del HUD con su material, gastado por los siglos:
// · Atenas: cerámica ática de figuras rojas (barniz negro mate, desconchado, con saltaduras donde asoma la arcilla) y la decoración
//   pintada en arcilla: meandro, ovas y lengüetas, como en las bandas de los vasos del Museo del Ágora.
// · Roma: fresco pompeyano tal como sale de la ceniza (rojo y negro apagados, grietas, pintura caída y oro casi perdido), con
//   candelabros y la cenefa calada de los zócalos del III y IV estilo.
// Todo se pinta con SVG (ruido fractal, luz especular, mapas de desplazamiento) al tamaño real de cada pieza, sin imágenes externas.
// Brújula: los vientos con su nombre. Atenas: los ocho de Aristóteles (Meteorológicos II 6), unos 50 años posterior a 386 a.C.
// (la Torre de los Vientos, con los nombres áticos, es del siglo I a.C.). Roma: los de Plinio (Historia natural II 119-120).
// Barra de objetos: en Atenas, los números acrofónicos áticos (Ι, ΙΙ… Π = 5), los que se grababan en Atenas en el siglo IV a.C.
// (los alfabéticos, Α = 1, Β = 2…, eran jonios y Atenas no los usa hasta época helenística); en Roma, los números romanos.
// El caduceo de los mensajes es de bronce: kerykeion griego, sin alas, con las serpientes en ocho abierto (como en los vasos áticos);
// en Roma, el caduceo alado de Mercurio. Para volver al HUD de antes: localStorage nostos-hud-clasico = 1.
const HZ={a:MODE!=='roma',on:false,off:false};
try{HZ.off=localStorage.getItem('nostos-hud-clasico')==='1';}catch(e){}
const HZ_NS='http:'+'/'+'/www.w3.org/2000/svg';
function hzURI(svg){return 'url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';}
function hzSvg(w,h,defs,body){return '<svg xmlns="'+HZ_NS+'" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'"><defs>'+defs+'</defs>'+body+'</svg>';}
// --- Atenas: barniz, arcilla y decoración pintada
const HZ_DA='<linearGradient id="aGl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#25221f"/><stop offset=".5" stop-color="#141211"/><stop offset="1" stop-color="#0b0a09"/></linearGradient>'+
 '<radialGradient id="aMed" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#3b291c"/><stop offset=".55" stop-color="#150d08"/><stop offset="1" stop-color="#070403"/></radialGradient>'+
 '<radialGradient id="aClay" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#e59a62"/><stop offset=".65" stop-color="#c46632"/><stop offset="1" stop-color="#93481c"/></radialGradient>'+
 '<filter id="fG" x="-15%" y="-15%" width="130%" height="150%" color-interpolation-filters="sRGB">'+
 '<feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="5" result="er"/>'+
 '<feDisplacementMap in="SourceGraphic" in2="er" scale="7" xChannelSelector="R" yChannelSelector="G" result="sg"/>'+
 '<feColorMatrix in="sg" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="sa"/>'+
 '<feGaussianBlur in="sa" stdDeviation="2" result="b"/>'+
 '<feSpecularLighting in="b" surfaceScale="3" specularConstant=".6" specularExponent="16" lighting-color="#e9e6dc" result="s"><feDistantLight azimuth="235" elevation="40"/></feSpecularLighting>'+
 '<feComposite in="s" in2="sa" operator="in" result="si"/>'+
 '<feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="4" seed="17" result="fl"/>'+
 '<feColorMatrix in="fl" values="0 0 0 0 .66  0 0 0 0 .4  0 0 0 0 .22  0 0 0 14 -9.4" result="flake"/>'+
 '<feComposite in="flake" in2="sa" operator="in" result="flk"/>'+
 '<feTurbulence type="turbulence" baseFrequency="1.6 .04" numOctaves="1" seed="31" result="sc"/>'+
 '<feColorMatrix in="sc" values="0 0 0 0 .85  0 0 0 0 .75  0 0 0 0 .65  0 0 0 5 -4.1" result="scr"/>'+
 '<feComposite in="scr" in2="sa" operator="in" result="scri"/>'+
 '<feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="1" seed="4" result="n"/>'+
 '<feColorMatrix in="n" values="0 0 0 0 .8  0 0 0 0 .7  0 0 0 0 .6  0 0 0 .12 0" result="nl"/>'+
 '<feComposite in="nl" in2="sa" operator="in" result="ni"/>'+
 '<feGaussianBlur in="sa" stdDeviation="3" result="sb"/><feOffset in="sb" dx="1" dy="3" result="so"/>'+
 '<feComponentTransfer in="so" result="sh"><feFuncA type="linear" slope=".5"/></feComponentTransfer>'+
 '<feMerge result="m"><feMergeNode in="sh"/><feMergeNode in="sg"/><feMergeNode in="ni"/><feMergeNode in="flk"/><feMergeNode in="scri"/></feMerge>'+
 '<feComposite in="m" in2="si" operator="arithmetic" k1="0" k2="1" k3=".4" k4="0"/></filter>'+
 '<filter id="fC" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">'+
 '<feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="4" seed="8" result="t"/>'+
 '<feDiffuseLighting in="t" surfaceScale="3" diffuseConstant="1" lighting-color="#f4ead8" result="d"><feDistantLight azimuth="235" elevation="55"/></feDiffuseLighting>'+
 '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1=".95" k2="0" k3="0" k4="0" result="m"/>'+
 '<feComposite in="m" in2="SourceAlpha" operator="in"/></filter>'+
 '<filter id="fP" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="2" result="w"/>'+
 '<feDisplacementMap in="SourceGraphic" in2="w" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="d"/>'+
 '<feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" seed="13" result="wo"/>'+
 '<feColorMatrix in="wo" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.1" result="woA"/><feComposite in="d" in2="woA" operator="in"/></filter>'+
 '<filter id="fR" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>'+
 '<pattern id="aMea" width="14" height="12.6" patternUnits="userSpaceOnUse"><path d="M0 10.5 H11.2 V2.1 H3.5 V7.7 H8.4 V4.9" fill="none" stroke="#cf723a" stroke-width="1.7"/></pattern>'+
 '<pattern id="aMeaL" width="20" height="18" patternUnits="userSpaceOnUse"><path d="M0 15 H16 V3 H5 V11 H12 V7" fill="none" stroke="#cf723a" stroke-width="2.2"/></pattern>'+
 '<pattern id="aEgg" width="13" height="10" patternUnits="userSpaceOnUse"><ellipse cx="6.5" cy="5" rx="3.6" ry="4.1" fill="none" stroke="#cf723a" stroke-width="1.4"/><circle cx="6.5" cy="5.4" r="1.5" fill="#cf723a"/><path d="M0 0 V8.5" stroke="#cf723a" stroke-width="1.2"/></pattern>'+
 '<pattern id="aTon" width="9" height="8" patternUnits="userSpaceOnUse"><path d="M1 0 Q4.5 10 8 0" fill="#cf723a"/></pattern>';
function hzHi(x0,y0,x1,y,op,sw){return '<path d="M'+x0+' '+(y+4)+' Q'+((x0+x1)/2)+' '+(y-3)+' '+x1+' '+(y+4)+'" stroke="#fff" stroke-width="'+(sw||4)+'" opacity="'+op+'" fill="none" filter="url(#fR)"/>';}
// recuadro de barniz; o.top: meandro arriba; o.bot: ovas abajo; o.ton: lengüetas; o.vol: volutas a los lados (barra de objetos)
function hzPanelA(w,h,o){o=o||{};const mx=o.vol?20:5,m=5,W=w-2*mx,H=h-2*m,r=o.r!=null?o.r:7;
  let s='<g filter="url(#fG)"><rect x="'+mx+'" y="'+m+'" width="'+W+'" height="'+H+'" rx="'+r+'" fill="url(#aGl)"/></g>',p='';const x0=mx+6,x1=w-mx-6;
  if(o.top&&w>h){p+='<rect x="'+x0+'" y="'+(m+4)+'" width="'+(x1-x0)+'" height="12.6" fill="url(#aMea)"/><path d="M'+x0+' '+(m+18.5)+' H'+x1+'" stroke="#cf723a" stroke-width="1.3"/>';}
  if(o.ton){p+='<rect x="'+x0+'" y="'+(m+3)+'" width="'+(x1-x0)+'" height="8" fill="url(#aTon)"/><path d="M'+x0+' '+(m+12)+' H'+x1+' M'+x0+' '+(h-m-5)+' H'+x1+'" stroke="#cf723a" stroke-width="1.2"/>';}
  if(o.bot){p+='<path d="M'+x0+' '+(h-m-17)+' H'+x1+'" stroke="#cf723a" stroke-width="1.3"/><rect x="'+x0+'" y="'+(h-m-15)+'" width="'+(x1-x0)+'" height="10" fill="url(#aEgg)"/>';}
  if(o.vol){const c=h/2+2;p+='<path d="M'+(mx+1)+' '+c+' c-12 0 -16 -11 -9 -16 c5 -4 12 0 9 5 c-2 3 -6 2 -5 -1 M'+(w-mx-1)+' '+c+' c12 0 16 -11 9 -16 c-5 -4 -12 0 -9 5 c2 3 6 2 5 -1" fill="none" stroke="#cf723a" stroke-width="2"/>';}
  if(o.ring){p+='<rect x="'+(mx+3)+'" y="'+(m+3)+'" width="'+(W-6)+'" height="'+(H-6)+'" rx="'+Math.max(0,r-2)+'" fill="none" stroke="#cf723a" stroke-width="1.1"/>';}
  if(p)s+='<g filter="url(#fP)">'+p+'</g>';
  s+=hzHi(mx+8,m+4,w-mx-8,m+4,.08,Math.min(5,H/6));return hzSvg(w,h,HZ_DA,s);}
function hzCompassA(w,h){const m=4,t=16;let s='<g filter="url(#fG)"><path d="M'+(m+t)+' '+m+' H'+(w-m-t)+' L'+(w-m)+' '+(h/2)+' L'+(w-m-t)+' '+(h-m)+' H'+(m+t)+' L'+m+' '+(h/2)+'Z" fill="url(#aGl)"/></g>';
  const x0=m+t+2,x1=w-m-t-2;s+='<g filter="url(#fP)"><rect x="'+x0+'" y="'+(m+3)+'" width="'+(x1-x0)+'" height="8" fill="url(#aTon)"/><path d="M'+x0+' '+(m+12)+' H'+x1+' M'+x0+' '+(h-m-4)+' H'+x1+'" stroke="#cf723a" stroke-width="1.2"/></g>';
  s+=hzHi(m+t,m+2,w-m-t,m+2,.05,3);return hzSvg(w,h,HZ_DA,s);}
function hzMedalA(S){const c=S/2,r=c-3;return hzSvg(S,S,HZ_DA,'<g filter="url(#fG)"><circle cx="'+c+'" cy="'+c+'" r="'+r+'" fill="url(#aMed)"/></g><g filter="url(#fP)"><circle cx="'+c+'" cy="'+c+'" r="'+(r-4.5)+'" fill="none" stroke="#cf723a" stroke-width="1.6"/></g>'+
  '<ellipse cx="'+(c-7)+'" cy="'+(c-12)+'" rx="8" ry="3.5" fill="#fff" opacity=".16" filter="url(#fR)"/>');}
function hzSelA(S){const c=S/2,r=c-3;return hzSvg(S,S,HZ_DA,'<g filter="url(#fC)"><circle cx="'+c+'" cy="'+c+'" r="'+r+'" fill="url(#aClay)"/></g><circle cx="'+c+'" cy="'+c+'" r="'+r+'" fill="none" stroke="#f6d6b0" stroke-width="2.4"/><circle cx="'+c+'" cy="'+c+'" r="'+(r-5)+'" fill="none" stroke="#140d08" stroke-width="1" opacity=".5"/>');}
function hzMiniA(S){const c=S/2,k=S/188;return hzSvg(S,S,HZ_DA,'<g filter="url(#fG)"><circle cx="'+c+'" cy="'+c+'" r="'+(c-3)+'" fill="url(#aGl)"/></g><g filter="url(#fP)"><circle cx="'+c+'" cy="'+c+'" r="'+(c-9*k)+'" fill="none" stroke="url(#aMeaL)" stroke-width="'+(9*k)+'"/>'+
  '<circle cx="'+c+'" cy="'+c+'" r="'+(c-14.6*k)+'" fill="none" stroke="#cf723a" stroke-width="'+(2*k)+'"/></g><path d="M'+(c*.35)+' '+(c*.5)+' Q'+(c*.62)+' '+(c*.2)+' '+(c*1.05)+' '+(c*.16)+'" stroke="#fff" stroke-width="5" opacity=".18" fill="none" filter="url(#fR)"/>');}
// --- Roma: fresco, oro gastado, candelabros y cenefa calada
const HZ_DR='<linearGradient id="rRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a5563f"/><stop offset="1" stop-color="#874230"/></linearGradient>'+
 '<linearGradient id="rBlk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#37302a"/><stop offset="1" stop-color="#26201b"/></linearGradient>'+
 '<linearGradient id="rAu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc96"/><stop offset=".5" stop-color="#c9962f"/><stop offset="1" stop-color="#8a6420"/></linearGradient>'+
 '<filter id="fW" x="-10%" y="-10%" width="120%" height="140%" color-interpolation-filters="sRGB">'+
 '<feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="4" seed="7" result="t"/>'+
 '<feDiffuseLighting in="t" surfaceScale="2.4" diffuseConstant="1.04" lighting-color="#fff" result="d"><feDistantLight azimuth="235" elevation="58"/></feDiffuseLighting>'+
 '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.02" k2="0" k3="0" k4="0" result="lit"/>'+
 '<feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="4" seed="19" result="fl"/>'+
 '<feColorMatrix in="fl" values="0 0 0 0 .8  0 0 0 0 .74  0 0 0 0 .64  0 0 0 14 -9.3" result="flake"/>'+
 '<feMerge result="mm"><feMergeNode in="lit"/><feMergeNode in="flake"/></feMerge>'+
 '<feComposite in="mm" in2="SourceAlpha" operator="in" result="body"/>'+
 '<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="sb"/><feOffset in="sb" dx="1" dy="3" result="so"/><feComponentTransfer in="so" result="sh"><feFuncA type="linear" slope=".45"/></feComponentTransfer>'+
 '<feMerge><feMergeNode in="sh"/><feMergeNode in="body"/></feMerge></filter>'+
 '<filter id="fAu" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">'+
 '<feTurbulence type="fractalNoise" baseFrequency=".25" numOctaves="3" seed="23" result="lo"/>'+
 '<feColorMatrix in="lo" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4 2.4" result="loA"/>'+
 '<feColorMatrix in="SourceGraphic" type="saturate" values=".45" result="ds"/><feComposite in="ds" in2="loA" operator="in"/></filter>'+
 '<pattern id="rCand" width="34" height="18" patternUnits="userSpaceOnUse"><path d="M17 1.6 V16.4 M12 5 Q17 1.6 22 5 M10.2 10 Q17 6.6 23.8 10 M13.6 14.8 h6.8" stroke="#d2a24a" stroke-width="1.1" fill="none"/><circle cx="17" cy="1.8" r="1.3" fill="#ecc878"/></pattern>'+
 '<pattern id="rGarl" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" fill="#15100c"/><path d="M0 10.8 H24 M0 1.2 H24" stroke="#d9b56a" stroke-width=".8"/><path d="M6 9.5 C6 7 3.4 5.2 3 3.4 M6 9.5 C6 7 8.6 5.2 9 3.4 M6 9.5 V3.8" stroke="#e9d6a6" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M18 9.5 Q15.4 6 18 3 Q20.6 6 18 9.5 Z" fill="none" stroke="#d9b56a" stroke-width=".9"/><circle cx="12" cy="6.4" r=".9" fill="#e9d6a6"/><circle cx="0" cy="6.4" r=".9" fill="#e9d6a6"/></pattern>';
function hzRnd(n){let s=n*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
function hzCracks(x0,y0,x1,y1,n,seed){const R=hzRnd(seed);let d='';for(let i=0;i<n;i++){let x=x0+R()*(x1-x0),y=y0+R()*(y1-y0)*.4;d+='M'+x.toFixed(1)+' '+y.toFixed(1);for(let j=0;j<3;j++){x+=(R()-.5)*14;y+=6+R()*12;if(y>y1)break;d+=' l'+((R()-.5)*12).toFixed(1)+' '+(4+R()*10).toFixed(1);}}
  return '<path d="'+d+'" stroke="#2a0e08" stroke-width="1.1" fill="none" opacity=".7"/>';}
function hzPanelR(w,h,o){o=o||{};const it=o.top?20:6,ib=o.bot?15:6,ix=o.ix!=null?o.ix:7;
  let s='<g filter="url(#fW)"><rect x="2" y="2" width="'+(w-4)+'" height="'+(h-4)+'" fill="url(#rBlk)"/><rect x="'+ix+'" y="'+it+'" width="'+(w-2*ix)+'" height="'+(h-it-ib)+'" fill="url(#rRed)"/></g>';
  if(o.top)s+='<rect x="4" y="3" width="'+(w-8)+'" height="17" fill="url(#rCand)"/>';
  s+='<g filter="url(#fAu)"><rect x="'+(ix+4)+'" y="'+(it+4)+'" width="'+(w-2*ix-8)+'" height="'+(h-it-ib-8)+'" fill="none" stroke="url(#rAu)" stroke-width="1.5"/></g>';
  if(o.bot)s+='<rect x="2" y="'+(h-14)+'" width="'+(w-4)+'" height="12" fill="url(#rGarl)"/>';
  if(w>80&&h>40)s+=hzCracks(ix,it,w-ix,h-ib,Math.max(1,Math.round(w/130)),w*7+h);return hzSvg(w,h,HZ_DR,s);}
function hzBarR(w,h){let s='<g filter="url(#fW)"><rect x="2" y="2" width="'+(w-4)+'" height="'+(h-4)+'" fill="url(#rBlk)"/></g>';if(w>h)s+='<rect x="2" y="2" width="'+(w-4)+'" height="12" fill="url(#rGarl)"/>';
  s+='<g filter="url(#fAu)"><rect x="6" y="'+(w>h?17:6)+'" width="'+(w-12)+'" height="'+(h-(w>h?23:12))+'" fill="none" stroke="url(#rAu)" stroke-width="1.2"/></g>';return hzSvg(w,h,HZ_DR,s);}
function hzCompassR(w,h){let s='<g filter="url(#fW)"><rect x="2" y="2" width="'+(w-4)+'" height="'+(h-4)+'" fill="url(#rBlk)"/></g><g filter="url(#fAu)"><rect x="5" y="5" width="'+(w-10)+'" height="'+(h-10)+'" fill="none" stroke="url(#rAu)" stroke-width="1.4"/></g>'+
  '<rect x="10" y="'+(h-14)+'" width="'+(w-20)+'" height="7" fill="url(#rCand)" opacity=".6"/>';return hzSvg(w,h,HZ_DR,s);}
function hzMedalR(S){return hzSvg(S,S,HZ_DR,'<g filter="url(#fW)"><rect x="2" y="2" width="'+(S-4)+'" height="'+(S-4)+'" fill="url(#rBlk)"/><rect x="6" y="6" width="'+(S-12)+'" height="'+(S-12)+'" fill="url(#rRed)"/></g><g filter="url(#fAu)"><rect x="9" y="9" width="'+(S-18)+'" height="'+(S-18)+'" fill="none" stroke="url(#rAu)" stroke-width="1"/></g>');}
function hzSlotR(S){return hzSvg(S,S,HZ_DR,'<g filter="url(#fW)"><rect x="1" y="1" width="'+(S-2)+'" height="'+(S-2)+'" fill="url(#rRed)"/></g><g filter="url(#fAu)"><rect x="4" y="4" width="'+(S-8)+'" height="'+(S-8)+'" fill="none" stroke="url(#rAu)" stroke-width="1"/></g>');}
function hzSelR(S){return hzSvg(S,S,HZ_DR,'<g filter="url(#fW)"><rect x="1" y="1" width="'+(S-2)+'" height="'+(S-2)+'" fill="url(#rRed)"/></g><rect x="2.5" y="2.5" width="'+(S-5)+'" height="'+(S-5)+'" fill="none" stroke="#f8e4b4" stroke-width="3"/>');}
function hzMiniR(S){const c=S/2,k=S/188,r=c-16*k;return hzSvg(S,S,HZ_DR,'<g filter="url(#fW)"><rect x="1" y="1" width="'+(S-2)+'" height="'+(S-2)+'" fill="url(#rBlk)"/><rect x="'+(7*k)+'" y="'+(7*k)+'" width="'+(S-14*k)+'" height="'+(S-14*k)+'" fill="url(#rRed)"/></g>'+
  '<circle cx="'+c+'" cy="'+c+'" r="'+(r+1)+'" fill="#e4d6b2"/><g filter="url(#fAu)"><circle cx="'+c+'" cy="'+c+'" r="'+(r+1.5*k)+'" fill="none" stroke="url(#rAu)" stroke-width="'+(2.4*k)+'"/>'+
  '<rect x="'+(11*k)+'" y="'+(11*k)+'" width="'+(S-22*k)+'" height="'+(S-22*k)+'" fill="none" stroke="url(#rAu)" stroke-width="'+(1.4*k)+'"/>'+
  '<path d="M'+(11*k)+' '+(11*k)+' l'+(18*k)+' '+(18*k)+' M'+(S-11*k)+' '+(11*k)+' l'+(-18*k)+' '+(18*k)+' M'+(11*k)+' '+(S-11*k)+' l'+(18*k)+' '+(-18*k)+' M'+(S-11*k)+' '+(S-11*k)+' l'+(-18*k)+' '+(-18*k)+'" stroke="url(#rAu)" stroke-width="'+(1.4*k)+'"/></g>'+
  hzCracks(8*k,8*k,S-8*k,S-8*k,2,13));}
const HZ_NOISE=hzSvg(64,64,'<filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 .1  0 0 0 0 .06  0 0 0 0 .03  0 0 0 -1.4 1"/></filter>','<rect width="64" height="64" filter="url(#n)" opacity=".35"/>');
// --- el caduceo de bronce
const HZ_BZ='<filter id="hzBzF" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">'+
 '<feGaussianBlur in="SourceAlpha" stdDeviation="1.1" result="b"/>'+
 '<feSpecularLighting in="b" surfaceScale="3" specularConstant="1.1" specularExponent="20" lighting-color="#fff1d4" result="s"><feDistantLight azimuth="235" elevation="40"/></feSpecularLighting>'+
 '<feComposite in="s" in2="SourceAlpha" operator="in" result="si"/>'+
 '<feTurbulence type="fractalNoise" baseFrequency=".18" numOctaves="3" seed="27" result="pt"/>'+
 '<feColorMatrix in="pt" values="0 0 0 0 .36  0 0 0 0 .55  0 0 0 0 .45  0 0 0 9 -5.6" result="pat"/>'+
 '<feComposite in="pat" in2="SourceAlpha" operator="in" result="pati"/>'+
 '<feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="5" result="n"/>'+
 '<feColorMatrix in="n" values="0 0 0 0 .2  0 0 0 0 .12  0 0 0 0 .05  0 0 0 .3 0" result="nn"/>'+
 '<feComposite in="nn" in2="SourceAlpha" operator="in" result="ni"/>'+
 '<feMerge result="m"><feMergeNode in="SourceGraphic"/><feMergeNode in="ni"/><feMergeNode in="pati"/></feMerge>'+
 '<feComposite in="m" in2="si" operator="arithmetic" k1="0" k2="1" k3=".7" k4="0"/></filter>'+
 '<linearGradient id="hzBz" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="52" y2="60"><stop offset="0" stop-color="#e2b46a"/><stop offset=".45" stop-color="#a87634"/><stop offset="1" stop-color="#5e3c16"/></linearGradient>';
const HZ_KER='<svg class="hzCad" viewBox="-3 -8 46 113" aria-hidden="true"><defs>'+HZ_BZ+'</defs><g filter="url(#hzBzF)" fill="none" stroke="url(#hzBz)" stroke-linecap="round">'+
 '<path d="M20 30 V96" stroke-width="5"/><circle cx="20" cy="99" r="4.5" fill="url(#hzBz)" stroke="none"/><circle cx="20" cy="22" r="11" stroke-width="5"/>'+
 '<path d="M11 15 C3 6 6 -4 15 -2" stroke-width="4.6"/><path d="M29 15 C37 6 34 -4 25 -2" stroke-width="4.6"/><path d="M12 34 h16 M13 39 h14" stroke-width="3.4"/>'+
 '<ellipse cx="16" cy="-2" rx="4" ry="2.8" fill="url(#hzBz)" stroke="none"/><ellipse cx="24" cy="-2" rx="4" ry="2.8" fill="url(#hzBz)" stroke="none"/></g>'+
 '<circle cx="17.3" cy="-3" r=".9" fill="#1a1008"/><circle cx="22.7" cy="-3" r=".9" fill="#1a1008"/></svg>';
const HZ_CAD='<svg class="hzCad" viewBox="-1 -1 54 109" aria-hidden="true"><defs>'+HZ_BZ+'</defs><g filter="url(#hzBzF)" stroke-linecap="round">'+
 '<path d="M26 8 V100" stroke="url(#hzBz)" stroke-width="5" fill="none"/><circle cx="26" cy="102" r="4.5" fill="url(#hzBz)"/><circle cx="26" cy="6" r="5" fill="url(#hzBz)"/>'+
 '<path d="M24 14 C6 6 0 10 2 18 C8 16 14 18 24 20 Z M28 14 C46 6 52 10 50 18 C44 16 38 18 28 20 Z" fill="url(#hzBz)"/>'+
 '<path d="M6 13 l5 2 M10 11 l5 3 M46 13 l-5 2 M42 11 l-5 3" stroke="#5e3c16" stroke-width="1" fill="none"/>'+
 '<path d="M26 92 C12 86 12 74 26 68 C40 62 40 50 26 44 C14 39 15 30 22 26" stroke="url(#hzBz)" stroke-width="4.4" fill="none"/>'+
 '<path d="M26 92 C40 86 40 74 26 68 C12 62 12 50 26 44 C38 39 37 30 30 26" stroke="url(#hzBz)" stroke-width="4.4" fill="none"/>'+
 '<ellipse cx="20" cy="25" rx="4" ry="2.8" fill="url(#hzBz)"/><ellipse cx="32" cy="25" rx="4" ry="2.8" fill="url(#hzBz)"/></g>'+
 '<circle cx="19" cy="24" r=".9" fill="#1a1008"/><circle cx="33" cy="24" r=".9" fill="#1a1008"/></svg>';
// --- vientos y números
const HZ_WIND=HZ.a?{N:'Βορέας',NE:'Καικίας',E:'Ἀπηλιώτης',SE:'Εὖρος',S:'Νότος',SO:'Λίψ',SW:'Λίψ',O:'Ζέφυρος',W:'Ζέφυρος',NO:'Ἀργέστης',NW:'Ἀργέστης'}:
  {N:'SEPTENTRIO',NE:'AQVILO',E:'SVBSOLANVS',SE:'VOLTVRNVS',S:'AVSTER',SO:'AFRICVS',SW:'AFRICVS',O:'FAVONIVS',W:'FAVONIVS',NO:'CORVS',NW:'CORVS'};
const HZ_NUM=HZ.a?['Ι','ΙΙ','ΙΙΙ','ΙΙΙΙ','Π','ΠΙ','ΠΙΙ','ΠΙΙΙ','ΠΙΙΙΙ']:['I','II','III','IV','V','VI','VII','VIII','IX'];
// --- cada pieza que cambia de tamaño se repinta a su tamaño exacto
function hzFit(el,gen){if(!el||el._hzG)return;el._hzG=gen;const go=()=>{const w=Math.round(el.offsetWidth),h=Math.round(el.offsetHeight);if(w<8||h<8)return;const k=w+'x'+h;if(el._hzK===k)return;el._hzK=k;
  try{el.style.backgroundImage=hzURI(gen(w,h));}catch(e){}};go();if(window.ResizeObserver)new ResizeObserver(go).observe(el);}
function hzCSS(){if($('hzCSS'))return;const A=HZ.a,s=document.createElement('style');s.id='hzCSS';
  const H='0 0 2px rgba(12,7,4,.95),0 0 4px rgba(12,7,4,.85),0 1px 1px rgba(12,7,4,.95)';
  const ac=A?'#eea36a':'#f8e4b4',ac2=A?'#d9a274':'#ecc98a',tx=A?'#fbe6c8':'#fbe9c8';
  s.textContent=
  'body.hz #stats{background-color:transparent;border-left:none;background-repeat:no-repeat;background-size:100% 100%;backdrop-filter:none;-webkit-backdrop-filter:none;box-shadow:none;'+(A?'padding:27px 20px 25px':'padding:27px 22px 25px')+'}'+
  'body.hz #stats .t{color:'+ac+';text-shadow:'+H+';'+(A?'font-size:1.1rem;letter-spacing:.04em':'font-size:.98rem;letter-spacing:.09em;text-transform:uppercase')+'}'+
  'body.hz #stats .row{color:'+ac+';text-shadow:'+H+'}body.hz #sProg{color:'+ac2+'}body.hz #sProg:hover{color:'+tx+'}'+
  'body.hz #objective{color:'+tx+';font-style:normal;font-weight:500;font-size:.92rem;text-shadow:'+H+'}body.hz #objective b{color:'+ac+'}'+
  'body.hz #compass{height:40px;width:min(400px,50vw);background:transparent no-repeat;background-size:100% 100%}'+
  'body.hz #compass .c{top:'+(A?10:9)+'px;color:'+ac+';text-shadow:'+H+';white-space:nowrap;'+(A?'font:700 15px var(--f-body)':'font-size:13px;letter-spacing:.06em')+'}'+
  'body.hz #compass .c small{font:600 9px var(--f-display);margin-left:3px;opacity:.75;letter-spacing:0}'+
  'body.hz #compass .c.minor{top:'+(A?13:12)+'px;color:'+ac2+';font-size:'+(A?11.5:10)+'px}'+
  'body.hz #compass .c.obj{top:'+(A?8:7)+'px;font-size:17px;color:#ffe0a8;text-shadow:0 0 6px rgba(255,190,90,.85),'+H+'}'+
  'body.hz #compass::after{width:0;height:0;background:none;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid '+(A?'#eea36a':'#e9c46a')+';bottom:'+(A?4:3)+'px}'+
  'body.hz.tm #compass{height:34px}body.hz.tm #compass .c{top:7px;font-size:12px}body.hz.tm #compass .c.minor{top:10px;font-size:9.5px}body.hz.tm #compass .c.obj{top:5px}'+
  'body.hz #bar button.ib,body.hz #tbtns button.ib{border:none;background:var(--hzMed) center/100% 100% no-repeat;backdrop-filter:none;-webkit-backdrop-filter:none;box-shadow:none;color:'+ac+';border-radius:'+(A?'50%':'0')+'}'+
  'body.hz #bar button.ib{width:42px;height:42px}'+
  'body.hz #bar button.ib:hover,body.hz #bar button.ib:focus-visible{background:var(--hzMed) center/100% 100% no-repeat;color:'+(A?'#ffc58e':'#fff3d6')+';filter:brightness(1.2);transform:translateY(-1px)}'+
  'body.hz #tbtns button.ib:active{background:var(--hzSel) center/100% 100% no-repeat;color:'+(A?'#140d08':'#f8e4b4')+'}'+
  'body.hz #bar button.ib[aria-pressed="false"]{opacity:.55}'+
  'body.hz #bar button.ib .ic,body.hz #tbtns button.ib .ic{filter:drop-shadow(0 1px 1px rgba(0,0,0,.7))}'+
  'body.hz #bar button.ib kbd{color:'+(A?'#cf723a':'#ecc878')+';text-shadow:'+H+';right:'+(A?7:6)+'px;bottom:'+(A?4:5)+'px;opacity:1}'+
  'body.hz #bar select{border:none;border-radius:0;height:40px;padding:4px 14px;background:var(--hzPill) center/100% 100% no-repeat;color:'+tx+';backdrop-filter:none;-webkit-backdrop-filter:none;box-shadow:none;text-shadow:'+H+'}'+
  'body.hz #bar select option{background:#16100c;color:#f1e8d8;text-shadow:none}'+
  'body.hz #bar #clock{color:'+tx+';text-shadow:'+H+'}'+
  'body.hz #mini{box-sizing:content-box;background:var(--hzMini) center/100% 100% no-repeat;box-shadow:none;filter:drop-shadow(1px 4px 5px rgba(0,0,0,.45));'+(A?'width:160px;height:160px;padding:14px':'border-radius:0;width:156px;height:156px;padding:16px')+'}'+
  '@media (max-width:760px){body.hz #mini{'+(A?'width:104px;height:104px;padding:9px':'width:102px;height:102px;padding:10px')+'}}'+
  'body.hz.tm #mini{'+(A?'width:84px;height:84px;padding:7px':'width:82px;height:82px;padding:8px')+'}'+
  '@media (orientation:landscape) and (max-height:520px){body.hz.tm #mini{'+(A?'width:66px;height:66px;padding:6px':'width:66px;height:66px;padding:6px')+'}}'+
  'body.hz #hbar{border:none;border-radius:0;background:transparent no-repeat;background-size:100% 100%;gap:6px;'+(A?'padding:21px 28px 9px':'padding:20px 14px 10px')+'}'+
  'body.hz #hbar .s{border:none;width:46px;height:46px;color:'+ac+';border-radius:'+(A?'50%':'0')+';background:var(--hzSlot) center/100% 100% no-repeat}'+
  'body.hz #hbar .s.off{color:'+ac+';opacity:.42}'+
  'body.hz #hbar .s.sel{background:var(--hzSel) center/100% 100% no-repeat;box-shadow:none;border:none;color:'+(A?'#140d08':'#fff3d6')+'}'+
  'body.hz #hbar .s svg{width:24px;height:24px;margin-top:7px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.55))}body.hz #hbar .s.sel svg{filter:none}'+
  'body.hz #hbar .s .k{left:0;right:0;top:4px;text-align:center;opacity:1;letter-spacing:-.02em;color:'+(A?'#cf723a':'#ecc878')+';text-shadow:'+H+';font:'+(A?'700 9px var(--f-body)':'600 8.5px var(--f-display)')+'}'+
  'body.hz #hbar .s.sel .k{'+(A?'color:#140d08;text-shadow:0 0 2px rgba(255,246,230,.6)':'color:#fff3d6')+'}'+
  'body.hz #hbar .s .c{color:'+tx+';text-shadow:'+H+';right:6px;bottom:3px}body.hz #hbar .s.sel .c{color:'+(A?'#140d08':'#fff3d6')+';text-shadow:none}'+
  'body.hz.tm #hbar{'+(A?'padding:12px 24px 5px':'padding:13px 8px 6px')+';gap:3px}body.hz.tm #hbar .s{width:36px;height:36px}body.hz.tm #hbar .s svg{width:20px;height:20px;margin-top:0}'+
  '@media (orientation:portrait){body.hz.tm #hbar{padding:8px 6px}}'+
  '@media (max-width:520px){body.hz #hbar .s{width:34px;height:34px}body.hz #hbar .s svg{width:19px;height:19px;margin-top:4px}body.hz #hbar .s .k{display:none}}'+
  'body.hz #hbName{text-shadow:'+H+';color:'+tx+'}'+
  'body.hz #prompt{border:none;background:transparent no-repeat;background-size:100% 100%;padding:9px 22px 9px 11px;display:flex;align-items:center;gap:11px;font-size:1.05rem;font-weight:600;color:'+(A?'#f1d2ae':'#fbe9c8')+';text-shadow:'+H+'}'+
  'body.hz #prompt[hidden]{display:none}body.hz #prompt b{color:'+ac+'}'+
  'body.hz #prompt kbd{margin:0;min-width:30px;height:30px;box-sizing:border-box;padding:0 9px;display:inline-flex;align-items:center;justify-content:center;font:700 1rem var(--f-display);text-shadow:0 0 2px rgba(255,246,230,.7);'+
   (A?'border-radius:999px;color:#140d08;background:var(--hzNoise),radial-gradient(circle at 38% 32%,#e59a62,#c46632 65%,#93481c);box-shadow:0 0 0 2.5px #140d08,inset 0 -2px 3px rgba(0,0,0,.3)':
      'border-radius:0;color:#2a1a0a;background:var(--hzNoise),linear-gradient(135deg,#e8d08e,#b58a32 55%,#8a6420);box-shadow:0 0 0 2px #1a120d,inset 0 -2px 3px rgba(0,0,0,.25)')+'}'+
  'body.hz #msgBtn{height:82px}body.hz #msgBtn svg.hzCad{width:'+(A?30:38)+'px;height:76px}'+
  'body.hz.tm #msgBtn{height:66px}body.hz.tm #msgBtn svg.hzCad{width:'+(A?24:30)+'px;height:60px}'+
  'body.hz #msgBtn .dot{background:#c4422a;box-shadow:0 0 0 2px #140d08;top:0;right:-8px}';
  document.head.appendChild(s);}
function hzInit(){if(HZ.on||HZ.off||!document.body)return;HZ.on=true;const A=HZ.a,b=document.body;b.classList.add('hz',A?'hzA':'hzR');hzCSS();
  const v=(k,svg)=>b.style.setProperty(k,hzURI(svg));
  v('--hzMed',A?hzMedalA(48):hzMedalR(48));v('--hzSlot',A?hzMedalA(48):hzSlotR(48));v('--hzSel',A?hzSelA(48):hzSelR(48));
  v('--hzMini',A?hzMiniA(188):hzMiniR(188));v('--hzPill',A?hzPanelA(140,40,{r:16}):hzPanelR(140,40,{ix:4}));v('--hzNoise',HZ_NOISE);
  hzFit($('stats'),A?(w,h)=>hzPanelA(w,h,{top:1,bot:1}):(w,h)=>hzPanelR(w,h,{top:1,bot:1}));
  hzFit($('compass'),A?hzCompassA:hzCompassR);
  hzFit($('prompt'),A?(w,h)=>hzPanelA(w,h,{r:h/2-5}):(w,h)=>hzPanelR(w,h,{ix:4}));
  hzBar();const m=$('msgBtn');if(m)hzCad(m);}
function hzBar(){const b=$('hbar');if(!b)return;hzFit(b,HZ.a?(w,h)=>hzPanelA(w,h,{top:1,vol:w>h,r:h/2>22?22:h/2}):hzBarR);
  const ks=b.querySelectorAll('.s .k');if(ks.length&&ks[0].textContent!==HZ_NUM[0])ks.forEach((k,i)=>{if(HZ_NUM[i])k.textContent=HZ_NUM[i];});}
function hzCad(b){if(b._hz)return;const s=b.querySelector('svg');if(!s)return;b._hz=1;s.outerHTML=HZ.a?HZ_KER:HZ_CAD;}
{const f=hbRender;hbRender=function(){const r=f.apply(this,arguments);if(HZ.on)try{hzBar();}catch(e){}return r;};}
{const f=msgBtn;msgBtn=function(){const b=f.apply(this,arguments);if(HZ.on&&b)try{hzCad(b);}catch(e){}return b;};}
{const f=drawCompass;drawCompass=function(){const r=f.apply(this,arguments);if(HZ.on)try{const el=$('compass');for(const c of el.children){if(!c.classList.contains('c')||c.classList.contains('obj')||c.childElementCount)continue;
  const t=c.textContent,n=HZ_WIND[t];if(n)c.innerHTML=n+'<small>'+t+'</small>';}}catch(e){}return r;};}
if(document.body)hzInit();else addEventListener('DOMContentLoaded',hzInit);
