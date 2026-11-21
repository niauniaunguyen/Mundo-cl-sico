(function(){
"use strict";
// ============================================================ idioma (es / ca / en)
// construir.py envuelve los literales traducibles: 'texto' -> _t(id,'texto') y `a ${x} b` -> _tt(id,["a "," b"],x).
// I18N.tr[idioma][id] es la traducción (o null: se queda el español); I18N.html traduce los textos fijos del HTML.
const I18N=/*@@I18N@@*/{tr:{},html:{}};
const LANGS=['es','ca','en'],LANG_KEY='mundo-clasico-lang';
const LANG=(()=>{let l=new URLSearchParams(location.search).get('lang');if(!l)try{l=localStorage.getItem(LANG_KEY);}catch(e){}return LANGS.includes(l)?l:'es';})();
const _TR=LANG==='es'?null:I18N.tr[LANG]||null;
// registro de textos sin traducir que se piden durante la partida (para traducir primero lo que se ve): solo con #debug y ?registro=1
const _TREC=(location.hash==='#debug'&&/[?&]registro=1/.test(location.search))?(window.__tmiss=new Map()):null;
function _trec(s){if(_TREC&&window.__trecOn&&typeof s==='string'&&/[a-záéíóúñ]{3}/i.test(s))_TREC.set(s,(_TREC.get(s)||0)+1);}
function _t(i,s){const v=_TR&&_TR[i];if(v==null&&_TREC)_trec(s);return v==null?s:v;}
function _tt(i,q,...a){const v=_TR&&_TR[i];if(v==null&&_TREC)_trec(q[0]+q.slice(1).map((x,k)=>'{'+k+'}'+x).join(''));if(v==null){let r=q[0];for(let k=0;k<a.length;k++)r+=a[k]+q[k+1];return r;}return v.replace(/\{(\d+)\}/g,(m,k)=>a[+k]);}
// cambia de idioma recargando la página (los textos se traducen al definirse); conserva la época si ya se eligió
function setLang(l){if(l===LANG)return;try{localStorage.setItem(LANG_KEY,l);}catch(e){}
  const u=new URLSearchParams(location.search);u.set('lang',l);
  if(document.getElementById('modes').hidden)u.set('modo',MODE);else u.delete('modo');
  location.href=location.pathname+'?'+u+location.hash;}
function langQuery(){return LANG==='es'?'':'?lang='+LANG;}
(function i18nStatic(){
  document.documentElement.lang=LANG;
  document.querySelectorAll('.langs button,#bLang option').forEach(b=>{const l=b.dataset.lang||b.value;if(b.tagName==='OPTION')b.selected=l===LANG;else b.setAttribute('aria-pressed',l===LANG?'true':'false');});
  if(LANG==='es')return;
  const H=I18N.html[LANG]||{};
  const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  for(let n=tw.nextNode();n;n=tw.nextNode()){const t=n.nodeValue.trim();if(t&&H[t])n.nodeValue=n.nodeValue.replace(t,H[t]);}
  document.querySelectorAll('[title],[placeholder],[aria-label]').forEach(el=>{for(const a of['title','placeholder','aria-label']){const v=el.getAttribute(a);if(v&&H[v])el.setAttribute(a,H[v]);}});
  if(H[document.title])document.title=H[document.title];
})();
document.querySelectorAll('.langs button').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
document.getElementById('bLang').onchange=e=>setLang(e.target.value);
if(!window.THREE){document.getElementById('loadmsg').textContent='No se pudo cargar el motor 3D. Revisa tu conexión y recarga la página.';return;}

// ============================================================ utilidades
const TAU=Math.PI*2;
let MODE='atenas';   // 'atenas' (386 a.C.) o 'roma' (80 d.C.); se elige en la pantalla inicial antes de construir el mundo
// datos del juego (modelos, imágenes, relieve real): en atenas_un_archivo.html van dentro de la página; en atenas.html cada bloque
// está vacío y lleva data-src (un archivo de datos/), y se trae al pedirlo. El cargador adelanta los que sirven a las dos épocas (window.__pre).
const DATO={p:{}};
function datoGet(id){if(DATO.p[id])return DATO.p[id];const el=document.getElementById(id);
  if(!el||el.textContent.trim().length>2||!el.dataset||!el.dataset.src)return DATO.p[id]=Promise.resolve(el?el.textContent:'');
  const pre=window.__pre&&window.__pre[id];if(pre)delete window.__pre[id];
  return DATO.p[id]=(pre||fetch(el.dataset.src).then(r=>{if(!r.ok)throw new Error(el.dataset.src+' ('+r.status+')');return r.text();}))
    .then(t=>{el.textContent=t;return t;}).catch(e=>{console.warn('No se pudieron traer los datos',id,e);delete DATO.p[id];return '';});}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const sstep=t=>t*t*(3-2*t);
function mulberry32(a){const f=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};f.seed=s=>{a=s;};return f;}   // seed(): volver a sembrar (ver «semilla» en la construcción del mundo)
const R=mulberry32(386);
const rr=(a,b)=>a+(b-a)*R();
const pick=a=>a[Math.floor(R()*a.length)];
function hash(x,z){const s=Math.sin(x*127.1+z*311.7)*43758.5453;return s-Math.floor(s);}
function vnoise(x,z){const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi;const a=hash(xi,zi),b=hash(xi+1,zi),c=hash(xi,zi+1),d=hash(xi+1,zi+1);const u=sstep(xf),v=sstep(zf);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function fbm(x,z){return vnoise(x,z)*0.5+vnoise(x*2.1+5,z*2.1+3)*0.25+vnoise(x*4.3+9,z*4.3+1)*0.125;}
// rotación igual que Object3D.rotation.y
function toW(lx,lz,x,z,a){const c=Math.cos(a),s=Math.sin(a);return[x+lx*c+lz*s,z-lx*s+lz*c];}
function toL(wx,wz,x,z,a){const c=Math.cos(a),s=Math.sin(a),dx=wx-x,dz=wz-z;return[dx*c-dz*s,dx*s+dz*c];}
function wrapA(a){while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a;}

