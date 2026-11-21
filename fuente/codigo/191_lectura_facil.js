// ============================================================ LECTURA FÁCIL (P5)
// Opción de Accesibilidad: textos más cortos y sencillos (frases breves, una idea por frase, palabras corrientes y los términos
// difíciles explicados). De momento, los 123 textos largos de los dos modos Historia (fuente/lectura_facil.json: {original: sencillo},
// #lfdata, datos/lfdata.txt, que solo se descarga si se activa). Funciona en castellano. No toca el código de cada diálogo: vigila el
// cuadro de diálogo y cambia los párrafos cuyo texto coincide con uno original. Para ampliarlo, basta con añadir parejas al JSON.
const LF={map:null,loading:0,obs:null};
const lfNorm=t=>t.replace(/\s+/g,' ').trim();
function lfOn(){return typeof ACC!=='undefined'&&ACC.lf&&LANG==='es';}
function lfLoad(){if(LF.map||LF.loading)return;LF.loading=1;datoGet('lfdata').then(t=>{try{const o=JSON.parse(t||'{}'),m=new Map();for(const k in o)m.set(lfNorm(k),o[k]);LF.map=m;lfScan();}catch(e){console.warn('lectura fácil',e);}});}
function lfScan(){if(!lfOn()||!LF.map)return;const d=$('dialog');if(!d||d.hidden)return;
  d.querySelectorAll('#dBody p').forEach(p=>{if(p.dataset.lf)return;const s=LF.map.get(lfNorm(p.textContent));if(s){p.textContent=s;p.dataset.lf='1';p.title='Lectura fácil';}});}
function lfWatch(){if(LF.obs)return;const b=$('dBody');if(!b)return;LF.obs=new MutationObserver(()=>{if(lfOn())lfScan();});LF.obs.observe(b,{childList:true,subtree:true,characterData:true});}
setTimeout(()=>{lfWatch();if(lfOn())lfLoad();},1200);
{const f=accMenu;accMenu=function(){f.apply(this,arguments);try{const box=$('accBox');if(!box||box.querySelector('[data-k="lf"]'))return;const ref=box.querySelector('input[data-k="font"]');if(!ref)return;
  const lab=document.createElement('label');lab.style.cssText='display:flex;gap:10px;align-items:center;padding:8px;border:1px solid #6a4a30;border-radius:8px;margin:6px 0;cursor:pointer';
  lab.innerHTML='<input type="checkbox" data-k="lf" '+(ACC.lf?'checked':'')+'> Lectura fácil: textos más cortos y sencillos en el modo Historia'+(LANG==='es'?'':' (de momento, solo en castellano)');ref.closest('label').after(lab);
  lab.querySelector('input').onchange=e=>{ACC.lf=e.target.checked;accSave();if(ACC.lf){lfWatch();lfLoad();}};}catch(e){}};}
