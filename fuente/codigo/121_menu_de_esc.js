// ============================================================ MENÚ DE ESC: la derecha ordenada (consultar · en el camino · Ajustes · Partida · Ayuda)
GM_IC.help='<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.6 2.6 0 1 1 3.7 2.4c-.8.3-1.2 1-1.2 1.8"/><circle cx="12" cy="17" r=".8"/>';
GM_IC.cog='<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>';
GM_IC.hint='<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/>';
GM_IC.disk='<path d="M5 3.5h11l3.5 3.5v13.5H5z"/><path d="M8 3.5v5h7v-5M8 20.5v-6h8v6"/>';
GM_IC.book=GM_IC.book||GM_IC.journal;
const GM_ICK={codex:'lib',zurron:'save',comercio:'era',vest:'view',musica:'sound',foto:'view',acc:'help',prof:'era',mt:'help',voc:'journal',gfx:'torch',ao:'view',wx:'time','pg:ajustes':'cog','pg:partida':'disk'};
function gmIc(k){return gmSvg(GM_IC[k]?k:(GM_ICK[k]&&GM_IC[GM_ICK[k]]?GM_ICK[k]:'menu'));}
function gmRight(d){const g=d.querySelector('.gr');if(!g)return;const pg=GM.page||'',K=x=>isTouch?'':x;
  const pr=k=>k==='sound'?' aria-pressed="'+(AUD_ON?'true':'false')+'"':k==='cam'?' aria-pressed="'+(GF.reduced?'false':'true')+'"':k==='voc'?' aria-pressed="'+(vocEff()==='off'?'false':'true')+'"':'';
  const btn=(k,t,sub,cls)=>'<button data-g="'+k+'" class="'+(cls||'')+'"'+pr(k)+'>'+gmIc(k)+'<span class="t">'+t+'</span>'+(sub?'<span class="k">'+sub+'</span>':'')+'</button>';
  let h='';
  if(!pg){h='<button class="play" data-g="back">'+gmSvg('back')+'Volver al juego</button>'+
    '<div class="sec">Consultar</div><div class="big">'+btn('journal','Diario',K('J'))+btn('map','Plano',K('M'))+btn('lib','Biblioteca',K('B'))+btn('codex','Códice',K('C'))+btn('zurron','Zurrón',K('I'))+btn('help','Ayuda','pistas y controles','helpb')+'</div>'+
    '<div class="sec">En el camino</div><div class="grid">'+btn('time','Pasar unas horas',K('T'))+btn('torch','Antorcha',K('F'))+btn('horse','Caballo',K('H'))+btn('view','Vista',K('V'))+btn('foto','Modo foto')+btn('diario','Diario de viaje','fotos y notas para descargar')+btn('comercio','Comercio')+btn('vest','Vestuario')+btn('musica','Música antigua')+'</div>'+
    '<div class="two">'+btn('pg:ajustes','Ajustes','sonido, imagen, idioma…','wide')+btn('pg:partida','Partida','guardar, cargar, época','wide')+'</div>';}
  else{h='<button class="play" data-g="pg:">'+gmSvg('back')+'Volver al menú</button><div class="sec">'+{ajustes:'Ajustes',partida:'Partida',ayuda:'Ayuda'}[pg]+'</div><div class="list">';
    if(pg==='ajustes')h+=[['sound','Sonido: '+(AUD_ON?'sí':'no')],['cam','Balanceo de cámara: '+(GF.reduced?'no':'sí')],['voc',vocLabel()],['gfx',gfxLabel()],['ao',aoLabel()],['gq',(typeof gqLabel==='function'?gqLabel():'Detalle gráfico')],['wx',wxLabel()],['acc','Accesibilidad (letra, voz, contraste)'],...(isTouch?[]:[['keys','Controles del teclado']]),['full','Pantalla completa']].map(b=>btn(b[0],b[1])).join('');
    else if(pg==='partida')h+=btn('save','Guardar partida')+btn('load','Cargar partida')+btn('era','Cambiar de época',MODE==='roma'?'ir a Atenas, 386 a.C.':'ir a Roma, 80 d.C.')+btn('prof','Panel del profesor');
    else h+=btn('hint','Pedir una pista al pedagogo',K('tecla G'))+btn('mt',mtLabel(),'toca para cambiarlo')+(isTouch?'':btn('keys','Ver los controles del teclado'))+btn('acc','Accesibilidad (letra, voz, contraste)');
    h+='</div>';}
  h+='<div class="hint">'+(isTouch?'':(pg?'Esc para volver al menú · ':'')+'Tab o Esc para cerrar')+'</div>';
  g.innerHTML=h;g.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{const k=b.dataset.g;
    if(k.startsWith('pg:')){GM.page=k.slice(3)||null;gmRight(d);const f=g.querySelector('button:not(.play)');f&&f.focus({preventScroll:true});return;}
    if(k==='help'){GM.page='ayuda';gmRight(d);return;}
    if(k==='hint'){gmClose();setTimeout(()=>{try{requestPointer&&requestPointer();}catch(e){}mtAsk();},80);return;}
    if(k==='mt'){mtCycle();gmRight(d);return;}
    gmDo(k);});}
{const st=document.createElement('style');st.textContent=
 '#gmenu .sec{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#c9a67a;margin:4px 2px -4px}'+
 '#gmenu .big{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}#gmenu .big button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:104px;padding:12px 6px;border-radius:16px;background:rgba(22,16,12,.8);border:1px solid rgba(217,135,74,.45);color:var(--bone);font-size:1rem;transition:background .15s,border-color .15s,transform .12s}'+
 '#gmenu .big .ic{width:34px;height:34px}#gmenu .big button:hover,#gmenu .big button:focus-visible{background:rgba(217,135,74,.22);border-color:#f3c99a;transform:translateY(-2px)}'+
 '#gmenu .big .helpb{background:rgba(217,135,74,.28);border:2px solid #f3c99a}#gmenu .big .helpb .t{font-weight:600}'+
 '#gmenu .k{font-size:.7rem;color:#c9a67a;letter-spacing:.04em}#gmenu .big .k{border:1px solid rgba(201,166,122,.45);border-radius:6px;padding:0 6px}#gmenu .big .helpb .k{border:none;color:#f3d9b6}'+
 '#gmenu .grid{grid-template-columns:repeat(4,1fr)!important;gap:8px!important}#gmenu .grid button{min-height:70px!important;padding:8px 4px!important;font-size:.74rem!important;gap:4px!important}#gmenu .grid .ic{width:22px!important;height:22px!important}#gmenu .grid .k{display:none}'+
 '#gmenu .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}#gmenu .two button,#gmenu .list button{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:10px;align-items:center;text-align:left;padding:12px 14px;border-radius:14px;background:rgba(22,16,12,.8);border:1px solid rgba(217,135,74,.45);color:var(--bone);font-size:.98rem}'+
 '#gmenu .two .ic,#gmenu .list .ic{grid-row:1 / span 2;width:28px;height:28px}#gmenu .two .k,#gmenu .list .k{grid-column:2}#gmenu .two button:hover,#gmenu .list button:hover,#gmenu .two button:focus-visible,#gmenu .list button:focus-visible{background:rgba(217,135,74,.22);border-color:#f3c99a}'+
 '#gmenu .list{display:flex;flex-direction:column;gap:8px;overflow:auto;min-height:0}#gmenu .list button[aria-pressed="false"]{opacity:.6}'+
 '@media (max-width:820px),(orientation:portrait){#gmenu .big{grid-template-columns:repeat(3,1fr)}#gmenu .big button{min-height:84px}}'+
 '@media (orientation:landscape) and (max-height:520px){#gmenu .big button{min-height:62px;padding:6px 4px;font-size:.85rem}#gmenu .big .ic{width:24px;height:24px}#gmenu .grid button{min-height:52px!important}#gmenu .sec{display:none}}';
 document.head.appendChild(st);}
