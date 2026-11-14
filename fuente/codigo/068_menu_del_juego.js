// ============================================================ MENÚ DEL JUEGO: a la izquierda, una figura humana con las cinco cualidades a su alrededor;
// a la derecha, las opciones en botones. Se abre con Tab o Esc, con el icono de la barra o con el botón de menú del móvil.
const GM={on:false,sel:null};
const GM_IC={journal:'<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v14H7.5A2.5 2.5 0 0 0 5 19.5z"/><path d="M5 19.5A2.5 2.5 0 0 0 7.5 22H20v-5"/><path d="M9.5 7.5h6"/>',map:'<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
 lib:'<path d="M7 4h11a2 2 0 0 1 2 2v11"/><path d="M7 4a2 2 0 0 0-2 2v1.5h4V6a2 2 0 0 0-2-2z"/><path d="M9 7.5V18a2 2 0 0 0 2 2h8.5a1.5 1.5 0 0 0 1.5-1.5V17H11"/><path d="M12 9.5h5M12 12.5h5"/>',time:'<path d="M6.5 3h11M6.5 21h11"/><path d="M8 3c0 5 8 5 8 9s-8 4-8 9"/><path d="M16 3c0 5-8 5-8 9s8 4 8 9"/>',
 view:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',torch:'<path d="M10 22l1-9h2l1 9z"/><path d="M12 2.5c2.2 2.3 3.2 4 3.2 5.7a3.2 3.2 0 0 1-6.4 0c0-1.7 1-3.4 3.2-5.7z"/><path d="M9.3 13h5.4"/>',
 horse:'<path d="M6 21v-4.5L3.5 14l1.8-3.6 4.2-1.9L11 5l1.6 2.6c3.4.8 6.4 4 6.4 8.4V21"/><path d="M11 5l-.6-2"/>',sound:'<path d="M4 9.5h3.5L13 5v14l-5.5-4.5H4z"/><path d="M16.5 9a4.2 4.2 0 0 1 0 6M19 6.5a7.8 7.8 0 0 1 0 11"/>',
 cam:'<path d="M3 12c3-4 6-4 9 0s6 4 9 0"/><path d="M3 17c3-4 6-4 9 0s6 4 9 0" opacity=".5"/>',full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',keys:'<rect x="2.5" y="6.5" width="19" height="11.5" rx="2"/><path d="M6.5 10.5h1M10.5 10.5h1M14.5 10.5h1M8 14.5h8"/>',
 save:'<path d="M12 3v11.5M7.5 10l4.5 4.5 4.5-4.5"/><path d="M4 16.5V20h16v-3.5"/>',load:'<path d="M12 15V3.5M7.5 8L12 3.5 16.5 8"/><path d="M4 16.5V20h16v-3.5"/>',era:'<path d="M3 9l9-5 9 5z"/><path d="M5.5 9v8.5M10 9v8.5M14 9v8.5M18.5 9v8.5"/><path d="M3 21h18M4 17.5h16"/>',
 back:'<path d="M5 12h14M12 5l-7 7 7 7"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>'};
const gmSvg=k=>'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'+GM_IC[k]+'</svg>';
// dónde se sitúa cada cualidad y a qué parte del cuerpo apunta
const GM_POS={kl:{x:392,y:22,to:[282,36],part:'la corona de laurel: la fama'},so:{x:10,y:24,to:[262,64],part:'la cabeza: el saber'},lo:{x:10,y:168,to:[288,92],part:'la boca: la palabra'},
 eu:{x:10,y:316,to:[268,176],part:'el corazón: la piedad'},ar:{x:392,y:168,to:[368,88],part:'el brazo: el valor y la fuerza'}};
function gmCSS(){if($('gmCSS'))return;const s=document.createElement('style');s.id='gmCSS';s.textContent=
 '#gmenu{position:fixed;inset:0;z-index:52;background:radial-gradient(ellipse at 30% 40%,rgba(40,28,18,.9),rgba(10,7,5,.94));display:flex;align-items:stretch;justify-content:center;gap:28px;padding:calc(18px + env(safe-area-inset-top,0px)) max(18px,env(safe-area-inset-right,0px)) calc(18px + env(safe-area-inset-bottom,0px)) max(18px,env(safe-area-inset-left,0px));color:var(--bone);animation:gmIn .22s ease-out;overflow:auto}'+
 '@keyframes gmIn{from{opacity:0}to{opacity:1}}#gmenu .gl{flex:1 1 560px;max-width:640px;display:flex;flex-direction:column;min-height:0}#gmenu .gr{flex:0 1 380px;display:flex;flex-direction:column;gap:12px;min-height:0}'+
 '#gmenu h2{margin:0 0 2px;font-family:var(--f-display);font-weight:400;letter-spacing:.04em}#gmenu .who{color:var(--muted);font-size:.85rem;margin-bottom:6px}#gmenu svg.fig{width:100%;height:auto;max-height:66vh;display:block}'+
 '#gmenu .card{cursor:pointer}#gmenu .card rect.bg{fill:rgba(22,16,12,.88);stroke:rgba(217,135,74,.55);stroke-width:1.2;transition:stroke .15s}#gmenu .card:hover rect.bg,#gmenu .card.sel rect.bg{stroke:#f3c99a;stroke-width:2}'+
 '#gmenu .det{min-height:64px;font-size:.88rem;line-height:1.45;color:var(--bone);background:rgba(22,16,12,.6);border-left:2px solid var(--clay);padding:8px 12px;margin-top:6px}#gmenu .det .sub{color:var(--muted)}'+
 '#gmenu .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}#gmenu .grid button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:14px 6px;min-height:84px;border-radius:14px;background:rgba(22,16,12,.75);border:1px solid rgba(217,135,74,.35);color:var(--bone);font-size:.78rem;line-height:1.15;transition:background .15s,border-color .15s,transform .12s}'+
 '#gmenu .grid button:hover,#gmenu .grid button:focus-visible{background:rgba(217,135,74,.2);border-color:#f3c99a;transform:translateY(-2px)}#gmenu .grid .ic{width:28px;height:28px}#gmenu .grid button[aria-pressed="false"]{opacity:.55}'+
 '#gmenu .play{display:flex;align-items:center;justify-content:center;gap:10px;padding:14px;border-radius:14px;background:var(--clay);color:#1a120c;border:none;font-size:1rem;font-family:var(--f-display);letter-spacing:.05em}#gmenu .play .ic{width:22px;height:22px}'+
 '#gmenu .hint{color:var(--muted);font-size:.75rem;text-align:center}'+
 '@media (max-width:820px),(orientation:portrait){#gmenu{flex-direction:column;justify-content:flex-start;gap:14px}#gmenu .gl,#gmenu .gr{flex:none;max-width:none;width:100%}#gmenu svg.fig{max-height:46vh}#gmenu .grid{grid-template-columns:repeat(4,1fr)}}'+
 '@media (orientation:landscape) and (max-height:520px){#gmenu{flex-direction:row}#gmenu svg.fig{max-height:78vh}#gmenu .grid{grid-template-columns:repeat(4,1fr)}#gmenu .grid button{min-height:64px;padding:8px 4px}#gmenu .det{display:none}}'+
 '@media (prefers-reduced-motion:reduce){#gmenu{animation:none}#gmenu .grid button{transition:none}}';document.head.appendChild(s);}
function gmFigure(){const ro=MODE==='roma',st='stroke="#d9874a" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"',fi='fill="rgba(217,135,74,.08)"';
  // figura de pie, con túnica y manto, el brazo derecho levantado como un orador
  return '<g '+st+'>'+
   '<circle cx="280" cy="64" r="24" '+fi+'/>'+(ro?'':'<path d="M262 50 q18 -16 36 0" stroke-width="1.6"/>')+
   '<path d="M262 40 q-8 -6 -6 -14 M270 34 q-4 -9 2 -14 M282 32 q0 -9 8 -12 M294 36 q6 -8 13 -6 M300 46 q9 -4 13 2" stroke="#9fb06a" stroke-width="2"/>'+
   '<path d="M273 88 v10 M287 88 v10"/>'+
   '<path d="M246 108 q34 -14 68 0 l10 70 q-8 70 -4 150 l-80 0 q4 -80 -4 -150 z" '+fi+'/>'+
   '<path d="M250 112 q30 40 74 26 M262 150 q20 60 8 176 M290 150 q8 90 20 176 M300 140 q12 50 4 110" stroke-width="1.4" opacity=".75"/>'+
   '<path d="M314 110 q28 -8 40 -24 q8 -12 14 -22" /><path d="M368 64 l4 -8 M368 64 l6 -4 M368 64 l7 1" stroke-width="1.8"/>'+
   '<path d="M246 110 q-22 40 -20 96 q0 14 4 22" /><path d="M230 228 l-6 6 M230 228 l2 8" stroke-width="1.8"/>'+
   '<path d="M258 328 l-4 70 l-14 6 M302 328 l4 70 l14 6"/>'+
   '<path d="M210 420 h140" stroke-width="1.2" opacity=".5"/>'+
   '<circle cx="268" cy="176" r="5" fill="#d9874a" stroke="none" opacity=".8"/></g>';}
function gmCards(){const ro=MODE==='roma',Q=qz();let h='';
  for(const q of QUAL){const P=GM_POS[q.k];if(!P)continue;const lv=qLv(q.k),pts=Q[q.k]||0,a=QLV[lv-1]||0,b=QLV[lv],fr=b?Math.min(1,(pts-a)/(b-a)):1,nm=ro?q.r:q.a,sel=GM.sel===q.k;
    const cx=P.x+(P.x<200?158:0),cy=P.y+38;
    h+='<path d="M'+cx+' '+cy+' C '+(P.x<200?cx+40:cx-40)+' '+cy+', '+(P.to[0]+(P.x<200?-30:30))+' '+P.to[1]+', '+P.to[0]+' '+P.to[1]+'" stroke="rgba(217,135,74,.5)" stroke-width="1.3" fill="none" stroke-dasharray="3 4"/><circle cx="'+P.to[0]+'" cy="'+P.to[1]+'" r="3.5" fill="#f3c99a"/>';
    h+='<g class="card'+(sel?' sel':'')+'" data-q="'+q.k+'" transform="translate('+P.x+' '+P.y+')" role="button" tabindex="0" aria-label="'+nm+', nivel '+lv+'"><title>'+nm+' ('+q.ga+'): '+q.d+'</title>'+
      '<rect class="bg" width="158" height="76" rx="10"/><text x="12" y="22" fill="#f1e8d8" font-size="15" font-family="var(--f-display),Georgia,serif">'+nm+'</text>'+
      '<text x="12" y="38" fill="#c9a67a" font-size="10" letter-spacing="1.5">'+q.ga+'</text>'+
      '<text x="146" y="34" fill="#f3c99a" font-size="26" text-anchor="end" font-family="var(--f-display),Georgia,serif">'+lv+'</text><text x="146" y="46" fill="#a8977f" font-size="8.5" text-anchor="end">NIVEL</text>'+
      '<rect x="12" y="54" width="134" height="7" rx="3.5" fill="rgba(241,232,216,.15)"/><rect x="12" y="54" width="'+(134*fr).toFixed(1)+'" height="7" rx="3.5" fill="#d9874a"/>'+
      '<text x="12" y="71" fill="#a8977f" font-size="8.5">'+(b?pts+' / '+b+' puntos':'nivel máximo')+'</text></g>';}
  // tarjeta de resumen abajo a la derecha
  const p=pjz?pjz():null,o=typeof origen==='function'?origen():null;
  h+='<g transform="translate(392 316)"><rect width="158" height="96" rx="10" fill="rgba(22,16,12,.6)" stroke="rgba(217,135,74,.25)"/>'+
   '<text x="12" y="22" fill="#f1e8d8" font-size="13">'+(state.obols||0)+' '+(ro?'sestercios':'óbolos')+'</text>'+
   '<text x="12" y="42" fill="#c9a67a" font-size="11">Día '+(state.day||1)+' · '+(calNow().mes||'')+'</text>'+
   '<text x="12" y="60" fill="#c9a67a" font-size="11">'+(state.lessons?state.lessons.length:0)+' lecciones aprendidas</text>'+
   '<text x="12" y="78" fill="#c9a67a" font-size="11">'+(state.places?state.places.length:0)+' lugares conocidos</text></g>';
  return h;}
function gmRender(){const d=$('gmenu');if(!d)return;const ro=MODE==='roma',p=typeof pjz==='function'?pjz():null,o=typeof origen==='function'?origen():null;
  const nm=p&&p.name?(typeof fxNombre==='function'?fxNombre():p.name):'Tu personaje';
  d.querySelector('.gl').innerHTML='<h2>'+nm+'</h2><div class="who">'+(o?o.n:'')+(o?' · ':'')+(ro?'Roma, año 80':'Atenas, 386 a.C.')+'</div>'+
   '<svg class="fig" viewBox="0 0 560 440" role="img" aria-label="Tus cualidades">'+gmFigure()+progFigure()+gmCards()+'</svg><div class="det" aria-live="polite"></div>';
  const show=k=>{const q=QUAL.find(x=>x.k===k);if(!q)return;GM.sel=k;d.querySelectorAll('.card').forEach(c=>c.classList.toggle('sel',c.dataset.q===k));const lv=qLv(k);
    d.querySelector('.det').innerHTML='<b>'+(ro?q.r:q.a)+'</b> · <span class="sub">'+q.ga+' · '+GM_POS[k].part+' · nivel '+lv+'</span> · <i>«'+qTitle(k,lv)+'»</i><br>'+q.d+'<br><span class="sub"><b>Lo que ya tienes:</b> '+QPROG[k].slice(1,lv).map(r=>r[2]).join(' · ')+(lv<10?'<br><b>Nivel '+(lv+1)+':</b> '+qUnlock(k,lv+1):'')+'</span>';};
  d.querySelectorAll('.card').forEach(c=>{c.onclick=()=>show(c.dataset.q);c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(c.dataset.q);}};});
  if(GM.sel)show(GM.sel);else d.querySelector('.det').innerHTML='<span class="sub">Toca o pasa el ratón por una cualidad para saber qué significa y cómo subirla.</span>';
  gmRight(d);}
function gmOpen(){if(ui!=='play'||GM.on)return;gmCSS();GM.page=null;GM.on=true;ui='gmenu';releasePointer();for(const id of['hud','touch','toast'])if($(id))$(id).style.visibility='hidden';const d=document.createElement('div');d.id='gmenu';d.innerHTML='<div class="gl"></div><div class="gr"></div>';document.body.appendChild(d);gmRender();
  setTimeout(()=>{const b=d.querySelector('.play');b&&b.focus({preventScroll:true});},40);if(aOK()){const t=AUD.ctx.currentTime;pluck(LYRE[3],t+0.01,0.04);pluck(LYRE[1],t+0.12,0.035);}}
function gmClose(){if(!GM.on)return;GM.on=false;for(const id of['hud','touch','toast'])if($(id))$(id).style.visibility='';const d=$('gmenu');if(d)d.remove();if(ui==='gmenu')ui='play';}
function gmDo(k){if(k==='sound'){initAudio();toggleSound();gmRender();return;}if(k==='cam'){gfToggleMotion();gmRender();return;}if(k==='voc'){vocToggle();gmRender();return;}if(k==='gfx'){gfxSet(!GFX.on);gmRender();return;}if(k==='ao'){aoSet(!GFX.ao);gmRender();return;}if(k==='wx'){wxCycle();gmRender();return;}if(k==='mt'){mtCycle();gmRender();return;}if(k==='zurron'){gmClose();setTimeout(objZurron,80);return;}if(k==='foto'){gmClose();setTimeout(()=>phToggle(true),80);return;}
  gmClose();
  if(k==='journal')openJournal();else if(k==='map')openMap();else if(k==='lib')openLibrary();else if(k==='time')advanceTime();else if(k==='view')toggleView();else if(k==='torch')toggleTorch();else if(k==='horse')callHorse();
  else if(k==='keys')keysToggle(true);else if(k==='era')$('bEra').click();else if(k==='save'){openJournal();setTimeout(()=>$('jSave').click(),60);}else if(k==='load'){openJournal();setTimeout(()=>$('jLoad').click(),60);}
  else if(k==='full'){const d=document.documentElement;try{if(document.fullscreenElement)document.exitFullscreen();else(d.requestFullscreen||d.webkitRequestFullscreen).call(d);}catch(e){}}}
addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;
  if(GM.on){if(e.code==='Escape'&&GM.page){e.preventDefault();e.stopImmediatePropagation();GM.page=null;gmRender();return;}if(e.code==='Escape'||e.code==='Tab'){e.preventDefault();e.stopImmediatePropagation();gmClose();requestPointer&&requestPointer();}return;}
  if(ui==='play'&&(e.code==='Tab'||(e.code==='Escape'&&!document.pointerLockElement))){e.preventDefault();e.stopImmediatePropagation();gmOpen();}},true);
// el icono del menú en la barra, delante de los demás
(function(){const bar=$('bar');if(!bar)return;const b=document.createElement('button');b.id='bMenu';b.className='ib';b.setAttribute('aria-label','Menú');b.title='Menú';b.innerHTML=gmSvg('menu')+'<kbd>Tab</kbd>';b.onclick=()=>gmOpen();const first=$('bHorse');bar.insertBefore(b,first||bar.firstChild);})();

