// ============================================================ EL PANEL DE METAS, LEGIBLE (28/11)
// El panel de Metas (229, x4Panel: Metas, Misiones, Tu fase, Calendario…) llevaba el material del HUD temático (225): en Atenas, barniz
// negro con saltaduras de arcilla; en Roma, fresco rojo con la pintura caída. En una pieza pequeña queda bien, pero en un panel de texto
// las manchas caían encima de las letras y el rojo dejaba poco contraste. Ahora:
//  · fondo liso y oscuro (el barniz negro en Atenas; el negro de los zócalos pompeyanos en Roma), sin manchas detrás del texto;
//  · el estilo de cada época solo en el marco: banda de arcilla y línea negra, como las bandas de los vasos áticos; o rojo pompeyano
//    con un filete de oro;
//  · letra más grande (16 px) y con más contraste, panel más ancho;
//  · seis pestañas principales (Metas, Misiones, Tu fase, Calendario, Trofeos, Leyendas) y el resto en «Otras ▾».
const KM10={more:false,main:['metas','mis','fase','cal','tro','leyendas']};
function k10CSS(){if($('k10CSS'))return;const s=document.createElement('style');s.id='k10CSS';s.textContent=
 '#x4P.k10{background:rgba(6,5,4,.62)}'+
 '#x4P.k10 .c{width:min(780px,94vw);max-height:88vh;padding:0;display:flex;flex-direction:column;overflow:hidden;background:#17120f!important;background-image:none!important;border-radius:6px;color:#f4ead8;font-size:16px;line-height:1.55;text-shadow:none}'+
 '#x4P.k10.ath .c{border:2px solid #b8693a;box-shadow:0 0 0 4px #17120f,0 0 0 6px #b8693a,0 12px 40px rgba(0,0,0,.6)}'+
 '#x4P.k10.rom .c{background:#1a1311!important;border:3px solid #8e2a20;box-shadow:inset 0 0 0 1px #c9a24a,0 0 0 1px #c9a24a,0 12px 40px rgba(0,0,0,.6)}'+
 '#x4P.k10 .hd{flex:0 0 auto;padding:18px 26px 10px;border-bottom:1px solid rgba(240,196,138,.25)}'+
 '#x4P.k10.ath .hd{background:linear-gradient(#b8693a,#b8693a) top/100% 6px no-repeat,linear-gradient(#0b0908,#0b0908) 0 6px/100% 2px no-repeat,#17120f;padding-top:24px}'+
 '#x4P.k10.rom .hd{background:linear-gradient(#8e2a20,#8e2a20) top/100% 6px no-repeat,linear-gradient(#c9a24a,#c9a24a) 0 6px/100% 1px no-repeat,#1a1311;padding-top:24px}'+
 '#x4P.k10 h3{font-size:1.5rem;color:#f6d3a2;text-shadow:none;margin:0 0 8px}'+
 '#x4P.k10 .x{font-size:1.5rem;color:#f6d3a2;padding:0 4px}'+
 '#x4P.k10 .tabs{margin:6px 0 0;gap:6px}#x4P.k10 .tabs button{font:600 .9rem var(--f-display);padding:6px 14px;background:#241c17;border:1px solid #6b4a33;color:#ecd9bd;text-shadow:none}'+
 '#x4P.k10 .tabs button:hover{border-color:#d9874a;color:#fff}#x4P.k10 .tabs button.on{background:#d9874a;border-color:#d9874a;color:#1a120c}'+
 '#x4P.k10 .tabs .mo{background:transparent;border-style:dashed}#x4P.k10 .tabs2{display:none;flex-wrap:wrap;gap:6px;margin:8px 0 0;padding-top:8px;border-top:1px dashed rgba(240,196,138,.25)}#x4P.k10 .tabs2.open{display:flex}'+
 '#x4P.k10 .bd{flex:1 1 auto;overflow:auto;padding:16px 26px 22px;font-size:16px}'+
 '#x4P.k10 .bd p,#x4P.k10 .bd small,#x4P.k10 .bd span,#x4P.k10 .bd div{text-shadow:none}#x4P.k10 .bd small{color:#cdbfa6;font-size:.88em}'+
 '#x4P.k10 .m{background:#211a15;border-left-color:#d9874a;text-shadow:none}#x4P.k10 .m .k{color:#f0c48a}'+
 '#x4P.k10 button.bt,#x4P.k10 .m button{background:#2c2119;border:1px solid #d9874a;color:#f6e2c4;border-radius:6px;padding:5px 12px;font:600 .88rem var(--f-display);cursor:pointer}'+
 // Metas (276)
 '#x4P.k10 .met .pr{font-size:1.05rem;color:#f4ead8}#x4P.k10 .met h4{color:#f0c48a;font-size:1.15rem;margin:20px 0 8px;border-bottom:1px solid rgba(240,196,138,.2);padding-bottom:4px}'+
 '#x4P.k10 .met .st{opacity:1;background:#1e1813;border-color:#3e2f24;color:#d9ccb6}#x4P.k10 .met .st b{color:#efe3cf}#x4P.k10 .met .st.ok{border-color:#5f7f4c}#x4P.k10 .met .st.ok .n{color:#9fc48a}'+
 '#x4P.k10 .met .st.now{background:#3a2616;border-color:#e0a060;color:#fbefdc}#x4P.k10 .met .st.now b{color:#ffe2b8}#x4P.k10 .met .st span{font-size:.92em}#x4P.k10 .met .st .pts{color:#b9a88e;opacity:1}#x4P.k10 .met .gift{color:#d8bf86!important}'+
 '#x4P.k10 .met .nxt{background:#2a1d13;border-color:#e0a060}#x4P.k10 .met .ac{background:#211a15;border-left-color:#e0a060}#x4P.k10 .met .ac .h{color:#ffcf8a;font-weight:600}'+
 '#x4P.k10 .met .bg{background:#1e1813;border-color:#3e2f24;color:#e8dcc8}#x4P.k10 .met .bg small{opacity:1;color:#c6b8a0}#x4P.k10 .met .bg.ok{background:#1d2618;border-color:#5f7f4c}'+
 '#x4P.k10 .via{color:#e8dcc8!important;font-size:1rem!important}#x4P.k10 .via .opt{opacity:.85!important}'+
 '@media (max-width:560px){#x4P.k10 .hd{padding:18px 14px 8px}#x4P.k10 .bd{padding:12px 14px 18px}#x4P.k10 .tabs button{padding:5px 10px;font-size:.82rem}}';
 document.head.appendChild(s);}
// el panel, sin el material del HUD temático y con la cabecera fija
{const f=x4Panel;x4Panel=function(title,tabs,cur){k10CSS();const on=typeof HZ!=='undefined'?HZ.on:false;try{if(typeof HZ!=='undefined')HZ.on=false;f.apply(this,arguments);}finally{if(typeof HZ!=='undefined')HZ.on=on;}
  try{const d=$('x4P');d.classList.add('k10');d.classList.toggle('rom',MODE==='roma');d.classList.toggle('ath',MODE!=='roma');const c=d.querySelector('.c');c.style.backgroundImage='none';
    // cabecera (título, cierre y pestañas) fija arriba; el contenido se desplaza debajo
    const x=c.querySelector('.x'),h=c.querySelector('h3'),t=c.querySelector('.tabs'),hd=document.createElement('div');hd.className='hd';c.insertBefore(hd,c.firstChild);[x,h,t].forEach(e=>e&&hd.appendChild(e));
    // pestañas: las principales a la vista; el resto, en «Otras»
    const keys=Object.keys(tabs);if(keys.length>8&&t){const t2=document.createElement('div');t2.className='tabs2'+(KM10.more?' open':'');let n=0;
      for(const b of[...t.querySelectorAll('button[data-k]')]){const k=b.dataset.k;if(KM10.main.includes(k)||k===cur)continue;t2.appendChild(b);n++;}
      if(n){const mo=document.createElement('button');mo.className='mo';mo.textContent=KM10.more?'Otras ▴':'Otras ▾';mo.onclick=()=>{KM10.more=!KM10.more;t2.classList.toggle('open',KM10.more);mo.textContent=KM10.more?'Otras ▴':'Otras ▾';};t.appendChild(mo);hd.appendChild(t2);}}}catch(e){console.warn('k10',e);}};}
