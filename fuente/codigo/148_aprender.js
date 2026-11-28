// ============================================================ APRENDER MEJOR: diez ayudas para quien juega para aprender
// 1 niveles de lectura · 2 «¿qué he aprendido?» · 3 repaso espaciado · 4 mapa de conceptos · 5 línea del tiempo · 6 glosario al pasar el dedo
// 7 rutas por temas · 8 modo sin presión · 9 viajar tocando el plano · 10 lectura fácil con pictogramas
// Todo se elige en el menú (Tab) › Aprender, o en Accesibilidad. Las opciones se guardan en este navegador (ACC).
if(ACC.lvl===undefined)ACC.lvl='normal';if(ACC.mapGo===undefined)ACC.mapGo=true;
const LRN={sess:null,offT:0,lastOffer:0,rv:null,route:null};
function lrnZ(){if(!state.lrn||typeof state.lrn!=='object')state.lrn={rev:{},route:null};return state.lrn;}
function lrnFirst(t,n){const s=String(t||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();const m=s.match(/[^.!?]+[.!?»”]*/g)||[s];return m.slice(0,n||1).join(' ').trim();}
function lrnCSS(){if($('lrnCSS'))return;const st=document.createElement('style');st.id='lrnCSS';st.textContent=`
.glt{border-bottom:1px dotted #e8b06a;cursor:help}
#glTip{position:fixed;z-index:80;max-width:min(320px,80vw);background:rgba(22,16,12,.96);color:#f1e8d8;border:1px solid #d9874a;border-radius:8px;padding:8px 10px;font:14px/1.4 Alegreya,Georgia,serif;box-shadow:0 6px 20px rgba(0,0,0,.5);pointer-events:none}
#glTip b{color:#f0c890;font-weight:400;font-family:var(--f-display);display:block}
.lrnMore{font:inherit;background:none;border:none;color:#e8b06a;text-decoration:underline;cursor:pointer;padding:0 2px}
.lrnPlus{margin-top:10px;padding:8px 10px;border-left:3px solid #8fd3c4;background:rgba(143,211,196,.08)}
.lrnEasy{list-style:none;padding:0;margin:4px 0}.lrnEasy li{margin:6px 0;line-height:1.45;font-size:1.05em}.lrnEasy .pic{display:inline-block;width:1.6em;text-align:center}
.lrnOrig{font:inherit;font-size:.85em;background:none;border:1px solid #6a4a30;border-radius:6px;color:#e8c9a0;padding:2px 8px;cursor:pointer;margin-top:4px}
.lrnRow{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0}.lrnRow button{font:inherit;padding:6px 12px;border-radius:8px;border:1px solid #6a4a30;background:#1d1610;color:#f1e8d8;cursor:pointer}.lrnRow button.on{background:#d9874a;color:#1a120c;border-color:#d9874a}
.lrnTl{position:relative;margin:10px 0 0 70px;border-left:2px solid #6a4a30;padding-left:14px}.lrnTl .it{position:relative;margin:0 0 12px}.lrnTl .it:before{content:'';position:absolute;left:-21px;top:6px;width:10px;height:10px;border-radius:50%;background:#d9874a}
.lrnTl .y{position:absolute;left:-88px;top:1px;width:62px;text-align:right;color:#e8b06a;font-size:.85em}.lrnTl .now{color:#8fd3c4}.lrnTl .now:before{background:#8fd3c4}.lrnTl .fut{opacity:.75}.lrnTl .fut:before{background:#7a6a5a}`;document.head.appendChild(st);}
// ---------------------------------------------------------------- 6. glosario al pasar el dedo o el ratón (en diálogos, estelas, avisos y fichas)
function lrnGloss(root){if(typeof GL_RE==='undefined'||!root||root.dataset.lgl)return;root.dataset.lgl='1';const seen=new Set(),W=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest('button,.glt,.label,kbd,input,textarea,select,.lrnEasy .pic'))return NodeFilter.FILTER_REJECT;return n.nodeValue.trim().length>2?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
  const nodes=[];while(W.nextNode())nodes.push(W.currentNode);
  for(const tn of nodes){const t=tn.nodeValue;GL_RE.lastIndex=0;let m,last=0,frag=null;while((m=GL_RE.exec(t))){const i=GL_IDX.get(m[1].toLowerCase());if(i===undefined||seen.has(i))continue;seen.add(i);frag=frag||document.createDocumentFragment();
      frag.appendChild(document.createTextNode(t.slice(last,m.index)));const s=document.createElement('span');s.className='glt';s.dataset.g=i;s.textContent=m[1];frag.appendChild(s);last=m.index+m[1].length;}
    if(frag){frag.appendChild(document.createTextNode(t.slice(last)));tn.parentNode.replaceChild(frag,tn);}}}
function glTip(el,on){let tp=$('glTip');if(!on){if(tp)tp.remove();return;}const e=GLOSS[+el.dataset.g];if(!e)return;if(!tp){tp=document.createElement('div');tp.id='glTip';document.body.appendChild(tp);}
  tp.innerHTML='<b>'+e[0]+'</b>'+e[2];const r=el.getBoundingClientRect();tp.style.left=Math.max(8,Math.min(innerWidth-tp.offsetWidth-8,r.left))+'px';tp.style.top=(r.bottom+6+tp.offsetHeight>innerHeight?r.top-tp.offsetHeight-6:r.bottom+6)+'px';}
document.addEventListener('mouseover',e=>{const g=e.target.closest&&e.target.closest('.glt');if(g)glTip(g,true);});
document.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest('.glt'))glTip(null,false);});
document.addEventListener('click',e=>{const g=e.target.closest&&e.target.closest('.glt');if(g){glTip(g,true);setTimeout(()=>glTip(null,false),4500);}else glTip(null,false);},true);
// ---------------------------------------------------------------- 1. niveles de lectura y 10. lectura fácil (en el cuerpo de los diálogos y estelas)
const LRN_PIC=[[/templo|santuario|dios|diosa|sacrific|ofrenda|altar|sacerdot|culto/i,'🏛️'],[/juicio|tribunal|ley|leyes|jurado|justicia/i,'⚖️'],[/guerra|batalla|soldad|ejército|legi|hoplita|armas/i,'⚔️'],
 [/barco|nave|puerto|mar\b|navega|trirreme/i,'⛵'],[/trigo|campo|cosecha|granja|olivo|viña|cereal/i,'🌾'],[/dinero|óbolo|dracma|sestercio|precio|paga|moneda/i,'💰'],[/libro|escrib|poema|poeta|rollo|leer|letras|tablilla/i,'📜'],
 [/teatro|comedia|tragedia|actor/i,'🎭'],[/familia|hijo|hija|mujer|madre|padre|boda|casar|niñ/i,'👪'],[/casa|ínsula|hogar|domus/i,'🏠'],[/asamblea|discurso|orador|votar|senado|consejo/i,'🗣️'],[/vino|banquete|simposio|comer|comida|cena/i,'🍷'],[/año|siglo|hace\s|antes|después/i,'⏳']];
function lrnPic(s){for(const[re,p]of LRN_PIC)if(re.test(s))return p;return '•';}
function lrnEasyHTML(txt){let s=String(txt).replace(/<br\s*\/?>/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();const notes=[];s=s.replace(/\s*\(([^)]{3,160})\)/g,(m,a)=>{notes.push(a);return '';});
  let parts=s.match(/[^.!?;:]+[.!?;:»”]*/g)||[s];const out=[];for(let p of parts){p=p.replace(/[;:]$/,'.').trim();if(!p)continue;if(p.length>150){const q=p.split(/,\s+(?=(?:y|pero|que|porque|aunque|donde|cuando|mientras)\b)/);for(const r of q)out.push(r.trim());}else out.push(p);}
  return '<ul class="lrnEasy">'+out.map(p=>'<li><span class="pic" aria-hidden="true">'+lrnPic(p)+'</span>'+p.charAt(0).toUpperCase()+p.slice(1)+'</li>').join('')+'</ul>'+(notes.length?'<p class="sub">Notas: '+notes.join(' · ')+'</p>':'');}
function lrnBody(B){if(!B||B.dataset.llv===(ACC.lvl+'|'+(ACC.easy?1:0)+'|'+B.innerHTML.length))return;const ps=[...B.querySelectorAll(':scope > p')].filter(p=>!p.classList.contains('sub')&&!p.closest('.verdict'));
  if(ACC.easy){for(const p of ps){if(p.dataset.lez||p.textContent.length<60)continue;const orig=p.innerHTML;const d=document.createElement('div');d.dataset.lez='1';d.innerHTML=lrnEasyHTML(orig)+'<button class="lrnOrig">Ver el texto original</button>';
      d.querySelector('.lrnOrig').onclick=ev=>{ev.stopPropagation();const pp=document.createElement('p');pp.innerHTML=orig;pp.dataset.lez='1';d.replaceWith(pp);};p.replaceWith(d);}}
  else if(ACC.lvl==='breve'){for(const p of ps){const full=p.innerHTML,txt=p.textContent;if(p.dataset.lbr||txt.length<230)continue;const sh=lrnFirst(full,2);p.dataset.lbr='1';p.innerHTML=sh+' <button class="lrnMore">…más</button>';
      p.querySelector('.lrnMore').onclick=ev=>{ev.stopPropagation();p.innerHTML=full;};}}
  if(ACC.lvl==='ampliada'&&typeof dlg!=='undefined'&&dlg&&dlg.n&&LESSONS[dlg.n.id]&&!B.querySelector('.lrnPlus')&&!B.querySelector('.verdict')){const L=LESSONS[dlg.n.id];
    const d=document.createElement('div');d.className='lrnPlus';d.innerHTML='<span class="label">Para saber más · '+L.title+'</span><br>'+L.summary+(L.where?'<br><span class="sub">Dónde: '+L.where+'</span>':'');B.appendChild(d);}
  B.dataset.llv=ACC.lvl+'|'+(ACC.easy?1:0)+'|'+B.innerHTML.length;}
// se aplica al abrir o cambiar diálogos, estelas, fichas de atención y avisos
const LRN_OBS=new MutationObserver(ms=>{const set=new Set();for(const m of ms){let t=m.target.nodeType===1?m.target:m.target.parentElement;if(!t)continue;const r=t.closest&&(t.closest('#dBody')||t.closest('#atCard')||t.closest('#toast > div')||t.closest('#codex')||t.closest('#lrnBox'));if(r)set.add(r);
    for(const n of m.addedNodes)if(n.nodeType===1&&(n.id==='atCard'||n.parentElement&&n.parentElement.id==='toast'))set.add(n);}
  for(const r of set){try{if(r.id==='dBody'){clearTimeout(LRN.bt);LRN.bt=setTimeout(()=>lrnDoBody(r),120);}
      else lrnGloss(r);}catch(e){lrnObserve();}}});
// el texto de los diálogos se escribe letra a letra (064 TW): se espera a que termine; con lectura fácil o breve se muestra entero al momento
function lrnDoBody(r){if(typeof TW!=='undefined'&&TW.on){if(ACC.easy||ACC.lvl==='breve'){try{twFinish();}catch(e){}}else{LRN.bt=setTimeout(()=>lrnDoBody(r),250);return;}}
  try{LRN_OBS.disconnect();lrnBody(r);delete r.dataset.lgl;lrnGloss(r);}catch(e){}lrnObserve();}
function lrnObserve(){LRN_OBS.observe(document.body,{childList:true,subtree:true});}
setTimeout(()=>{lrnCSS();lrnObserve();},500);
// ---------------------------------------------------------------- 8. modo sin presión y 3. repaso espaciado (las preguntas falladas vuelven)
{const a0=answer;answer=function(ok){const n=dlg&&dlg.n;if(!ok&&n&&n.quiz){const z=lrnZ();z.rev[n.id]={d:(state.day||1)+2,k:(z.rev[n.id]?z.rev[n.id].k:0)+1};save();
    if(ACC.calm){const right=n.quiz.a[0];a0.call(this,true);const B=$('dBody');B.insertAdjacentHTML('afterbegin','<div class="verdict" style="background:rgba(143,211,196,.12);border-color:#8fd3c4">No era esa, y no pasa nada. La respuesta es: <b>'+right+'</b>. Te la apunto como aprendida, y otro día alguien te la volverá a preguntar para que no se te olvide.</div>');return;}}
  return a0.apply(this,arguments);};}
const RVP={g:null,id:null,ph:0,lb:null,asked:false};
function rvCandidate(){const z=lrnZ(),day=state.day||1;for(const id in z.rev){if(z.rev[id].d<=day&&LESSONS[id]){const n=(typeof NPCS!=='undefined'?NPCS:[]).find(q=>q.id===id);if(n&&n.quiz)return n;}}return null;}
function rvTick(dt){if(!state||ui!=='play'||RVP.g)return rvStep(dt);LRN.rvT=(LRN.rvT||0)+dt;if(LRN.rvT<20)return;LRN.rvT=0;if(Math.random()>0.25)return;if(typeof EVP!=='undefined'&&EVP.g)return;
  let city=false;try{city=!islandOf(player.x);}catch(e){}if(!city)return;const n=rvCandidate();if(!n)return;
  const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),p=findFree(player.x+fx*8-fz*3,player.z+fz*8+fx*3,0.6)||[player.x+fx*6,player.z+fz*6];
  const g=makePerson({chiton:pick(['#d8ccb4','#c9b48b','#e6dccb']),himation:pick(['#5a4a3a','#2f4c6e','#7a3a2a']),hair:'#3a2a1e',beard:Math.random()<0.5,short:MODE==='roma',noHimation:MODE==='roma'});
  g.position.set(p[0],floorAt(p[0],p[1]),p[1]);scene.add(g);const lb=labelSprite('Un vecino curioso','¿te acuerdas?',true);lb.position.y=2.45;g.add(lb);Object.assign(RVP,{g,id:n.id,n,ph:0,lb,asked:false,t:0});}
function rvStep(dt){const g=RVP.g;if(!g)return;RVP.t+=dt;const dx=player.x-g.position.x,dz=player.z-g.position.z,d=Math.hypot(dx,dz);
  if(RVP.asked||RVP.t>80||d>70){if(d>40||RVP.t>80){scene.remove(g);RVP.g=null;return;}g.position.x-=dx/d*dt*1.3;g.position.z-=dz/d*dt*1.3;g.position.y=floorAt(g.position.x,g.position.z);g.rotation.y=Math.atan2(-dx,-dz);RVP.ph+=dt*6;personWalk(g,RVP.ph,1);return;}
  g.rotation.y=Math.atan2(dx,dz);if(d>2.2){const v=Math.min(d-2.2,dt*1.4);g.position.x+=dx/d*v;g.position.z+=dz/d*v;g.position.y=floorAt(g.position.x,g.position.z);RVP.ph+=dt*6;personWalk(g,RVP.ph,1);return;}
  personWalk(g,0,0);if(ui!=='play')return;RVP.asked=true;RVP.lb.visible=false;const n=RVP.n,q=n.quiz,order=[0,1,2].sort(()=>Math.random()-0.5);
  vmS('?','Un vecino curioso','repaso','<p>«Oye, el otro día te vi hablando con '+n.name+'. Yo nunca me acuerdo de esto: '+q.q.charAt(0).toLowerCase()+q.q.slice(1)+'»</p><p class="sub">Repaso: esta pregunta te costó la otra vez. Contestarla bien ahora la fija en la memoria.</p>',
   order.map(ai=>[q.a[ai],()=>{const z=lrnZ();if(ai===0){delete z.rev[n.id];save();try{qAdd('so',1,'Repasar es aprender dos veces.');}catch(e){}$('dBody').innerHTML='<div class="verdict">«¡Eso es! Gracias.» Ya no se te olvidará.</div><p>'+lrnFirst(LESSONS[n.id].summary,2)+'</p>';}
     else{z.rev[n.id]={d:(state.day||1)+2,k:(z.rev[n.id]?z.rev[n.id].k:0)+1};save();$('dBody').innerHTML='<div class="verdict bad">«Mmm, creo que no era así…» La respuesta es: <b>'+q.a[0]+'</b>.</div><p>'+lrnFirst(LESSONS[n.id].summary,2)+'</p><p class="sub">Volverá a salir dentro de unos días.</p>';}
     $('dOpts').innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>Adiós</span>';b.onclick=()=>closeDialog();$('dOpts').appendChild(b);},'quiz']));}
// ---------------------------------------------------------------- 2. ¿qué he aprendido? (resumen de la sesión)
function lrnSnap(){return{lessons:[...(state.lessons||[])],places:[...(state.places||[])],myths:[...(state.myths||[])],t:performance.now()};}
function lrnSummary(){const S=LRN.sess||lrnSnap(),nl=(state.lessons||[]).filter(id=>!S.lessons.includes(id)),np=(state.places||[]).filter(id=>!S.places.includes(id)),nm=(state.myths||[]).filter(id=>!S.myths.includes(id));
  const mins=Math.round((performance.now()-S.t)/60000);let h='<p style="opacity:.85">En esta sesión ('+mins+' min) has aprendido '+nl.length+(nl.length===1?' lección':' lecciones')+', descubierto '+np.length+(np.length===1?' lugar':' lugares')+(nm.length?' y '+nm.length+(nm.length===1?' mito':' mitos'):'')+'.</p>';
  const ideas=nl.map(id=>LESSONS[id]).filter(Boolean).slice(0,5);
  if(ideas.length)h+='<h4 style="color:#f0c890">Ideas clave</h4><ol>'+ideas.map(L=>'<li><b>'+L.title+'</b>: '+lrnFirst(L.summary,1)+'</li>').join('')+'</ol>';
  else h+='<p>Aún no has superado ninguna lección en esta sesión. Habla con las personas que tienen el rombo ◆ y responde a su pregunta.</p>';
  if(np.length)h+='<h4 style="color:#f0c890">Lugares</h4><p>'+np.map(id=>{const p=PLACES.find(q=>q.id===id);return p?p.name:'';}).filter(Boolean).slice(0,12).join(' · ')+'</p>';
  const qid=nl.find(id=>{const n=NPCS.find(q=>q.id===id);return n&&n.quiz;})||(state.lessons||[]).slice(-1)[0];const qn=qid&&NPCS.find(q=>q.id===qid);
  if(qn&&qn.quiz){const order=[0,1,2].sort(()=>Math.random()-0.5);h+='<h4 style="color:#f0c890">Pregunta de repaso</h4><p>'+qn.quiz.q+'</p><div class="lrnRow" id="lrnQ">'+order.map(ai=>'<button data-ok="'+(ai===0?1:0)+'">'+qn.quiz.a[ai]+'</button>').join('')+'</div><p id="lrnQr"></p>';}
  h+='<div class="lrnRow"><button id="lrnSave">Guardar este resumen (texto)</button></div>';
  const o=eduOverlay('lrnBox','¿Qué he aprendido?',h);o.querySelectorAll('#lrnQ button').forEach(b=>b.onclick=()=>{const ok=b.dataset.ok==='1';o.querySelectorAll('#lrnQ button').forEach(x=>x.classList.toggle('on',x.dataset.ok==='1'));$('lrnQr').innerHTML=ok?'¡Correcto!':'No era esa: la buena está marcada.';});
  const sv=o.querySelector('#lrnSave');if(sv)sv.onclick=()=>{const txt='Nóstos · '+(MODE==='roma'?'Roma, 80 d.C.':'Atenas, 386 a.C.')+'\n'+o.innerText.replace(/Guardar este resumen \(texto\)|Cerrar/g,'');try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download='nostos_resumen.txt';a.click();}catch(e){}};}
// ---------------------------------------------------------------- 4. mapa de conceptos (lecciones unidas por temas y por palabras del glosario)
function lrnConcepts(){const ids=(state.lessons||[]).filter(id=>LESSONS[id]);if(ids.length<2){eduOverlay('lrnBox','Mapa de conceptos','<p>Necesitas al menos dos lecciones aprendidas para ver cómo se relacionan. Ahora tienes '+ids.length+'.</p>');return;}
  const terms={};for(const id of ids){const s=LESSONS[id].summary||'';const set=new Set();GL_RE.lastIndex=0;let m;while((m=GL_RE.exec(s))){const i=GL_IDX.get(m[1].toLowerCase());if(i!==undefined)set.add(i);}terms[id]=set;}
  const cats=[...new Set(ids.map(id=>LESSONS[id].cat||'Otros'))],W=820,H=Math.max(560,cats.length*90),cx=W/2,cy=H/2,P={};
  cats.forEach((c,i)=>{const a=i/cats.length*Math.PI*2-Math.PI/2,R=Math.min(W,H)*0.3;P['c:'+c]=[cx+Math.cos(a)*R,cy+Math.sin(a)*R];});
  const byCat={};ids.forEach(id=>{const c=LESSONS[id].cat||'Otros';(byCat[c]=byCat[c]||[]).push(id);});
  for(const c in byCat){const[hx,hy]=P['c:'+c],L=byCat[c];L.forEach((id,j)=>{const a=j/L.length*Math.PI*2+0.3,r=70+(L.length>6?(j%2)*28:0);P[id]=[hx+Math.cos(a)*r,hy+Math.sin(a)*r];});}
  let svg='<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;background:rgba(255,255,255,.03);border-radius:10px" font-family="Alegreya,Georgia,serif">';
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const A=terms[ids[i]],B=terms[ids[j]];let k=0;for(const t of A)if(B.has(t))k++;if(k&&LESSONS[ids[i]].cat!==LESSONS[ids[j]].cat){const[a1,b1]=P[ids[i]],[a2,b2]=P[ids[j]];svg+='<line x1="'+a1+'" y1="'+b1+'" x2="'+a2+'" y2="'+b2+'" stroke="#8fd3c4" stroke-opacity="'+Math.min(0.8,0.25+k*0.2)+'" stroke-dasharray="4 4"/>';}}
  for(const id of ids){const c=LESSONS[id].cat||'Otros',[hx,hy]=P['c:'+c],[x,y]=P[id];svg+='<line x1="'+hx+'" y1="'+hy+'" x2="'+x+'" y2="'+y+'" stroke="#d9874a" stroke-opacity=".6"/>';}
  for(const c of cats){const[x,y]=P['c:'+c];svg+='<circle cx="'+x+'" cy="'+y+'" r="34" fill="#3a2a1e" stroke="#d9874a"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" fill="#f0c890" font-size="14">'+c+'</text>';}
  for(const id of ids){const[x,y]=P[id],t=LESSONS[id].title;svg+='<g class="cn" data-id="'+id+'" style="cursor:pointer"><circle cx="'+x+'" cy="'+y+'" r="7" fill="#d9874a"/><text x="'+x+'" y="'+(y-11)+'" text-anchor="middle" fill="#f1e8d8" font-size="11">'+(t.length>28?t.slice(0,26)+'…':t)+'</text></g>';}
  svg+='</svg>';const o=eduOverlay('lrnBox','Mapa de conceptos','<p style="opacity:.85">Cada tema es un círculo grande; tus lecciones cuelgan de él. Las líneas punteadas unen lecciones de temas distintos que comparten conceptos (palabras del glosario). Toca una lección para recordarla.</p>'+svg+'<div id="lrnCn" style="margin-top:10px"></div>');
  o.querySelectorAll('.cn').forEach(g=>g.onclick=()=>{const L=LESSONS[g.dataset.id],sh=[...terms[g.dataset.id]].map(i=>GLOSS[i][0]);$('lrnCn').innerHTML='<b style="color:#f0c890">'+L.title+'</b> · '+(L.cat||'')+'<p>'+L.summary+'</p>'+(sh.length?'<p class="sub">Conceptos: '+sh.join(', ')+'</p>':'');});}
// ---------------------------------------------------------------- 5. línea del tiempo de todo lo visto, con «ahora» y lo que aún no ha pasado
function lrnYears(s){const out=[];let m;const re=/(\d{1,4})\s*(a\.\s?C\.|d\.\s?C\.)/g;while((m=re.exec(s)))out.push(/a\.\s?C/.test(m[2])?-(+m[1]):+m[1]);
  if(!out.length){const re2=/(?:\ben el|\bdel|\bhacia el|\bdesde el|\bel año)\s+(\d{2,4})(?![\d.,]*\s*(?:metros|m\b|kil|años|hombres|naves|personas|%|dracmas|óbolos|sestercios|talentos))/g;while((m=re2.exec(s))){const y=+m[1];if(y<10||y>3000)continue;out.push(MODE==='roma'?(y<=80?y:-y):-y);}}
  if(!out.length){const h=/hace\s+(\d{1,3})\s+años/.exec(s);if(h)out.push((MODE==='roma'?80:-386)-(+h[1]));}return out;}
function lrnTimeline(){const E=typeof eduEntries==='function'?eduEntries():[],now=MODE==='roma'?80:-386,items=[];
  for(const n of(typeof NPCS!=='undefined'?NPCS:[]))if(state.seen&&state.seen['m:'+n.id]&&n.intro)E.push({c:'Personas',n:n.name,t:String(n.intro).replace(/<[^>]+>/g,'')});
  for(const e of E){const ys=lrnYears(e.t||'');if(!ys.length)continue;const y=ys[0];items.push({y,n:e.n,c:e.c,t:lrnFirst(e.t,1)});}
  items.push({y:now,n:'Ahora: '+(MODE==='roma'?'año 80 d.C.':'primavera del 386 a.C.'),c:'',t:'Aquí estás tú.',now:true});items.sort((a,b)=>a.y-b.y);
  const fy=y=>y<0?(-y)+' a.C.':y+' d.C.';
  const h='<p style="opacity:.85">Todo lo que has visto que tiene fecha, ordenado. Lo que está por debajo de «Ahora» aún no ha ocurrido en tu viaje: son anacronismos señalados o noticias del futuro que cuentan los textos. '+(items.length-1)+' fechas.</p><div class="lrnTl">'+
   items.map(it=>'<div class="it'+(it.now?' now':it.y>now?' fut':'')+'"><span class="y">'+fy(it.y)+'</span><b>'+it.n+'</b>'+(it.c?' <span class="sub">('+it.c+')</span>':'')+'<br><span style="opacity:.85">'+it.t+(it.y>now&&!it.now?' <i>(aún no ha pasado)</i>':'')+'</span></div>').join('')+'</div>';
  eduOverlay('lrnBox','Línea del tiempo',h);}
// ---------------------------------------------------------------- 7. rutas por temas: el mentor propone un recorrido de 6-8 personas de un mismo tema
function lrnThemes(){const reg=regionOf(player.x),C={};for(const o of npcObjs){if(o.hidden)continue;const L=LESSONS[o.data.id];if(!L||regionOf(o.x)!==reg)continue;const c=L.cat||'Otros';(C[c]=C[c]||[]).push(o);}return C;}
function lrnRouteMenu(){const C=lrnThemes(),cats=Object.keys(C).filter(c=>C[c].length>=2).sort((a,b)=>C[b].length-C[a].length),z=lrnZ();
  let h='<p style="opacity:.85">Elige un tema y el pedagogo te propone un recorrido por las personas que saben de él, de la más cercana a la más lejana. En cada parada aparece una columna de luz.</p>';
  if(z.route)h+='<p>Ruta en curso: <b>'+z.route.cat+'</b>, parada '+(z.route.i+1)+' de '+z.route.ids.length+'.</p><div class="lrnRow"><button id="lrnRNext">Señalar la siguiente parada</button><button id="lrnRStop">Abandonar la ruta</button></div>';
  h+='<div class="lrnRow">'+cats.map(c=>'<button data-c="'+c+'">'+c+' ('+C[c].length+')</button>').join('')+'</div>';if(!cats.length)h+='<p>En este mapa no hay suficientes personas para un recorrido.</p>';
  const o=eduOverlay('lrnBox','Rutas por temas',h);o.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{lrnRouteStart(b.dataset.c);o.remove();ui='play';});
  const nx=o.querySelector('#lrnRNext');if(nx)nx.onclick=()=>{o.remove();ui='play';lrnRouteShow();};const sp=o.querySelector('#lrnRStop');if(sp)sp.onclick=()=>{z.route=null;save();o.remove();ui='play';toast('Has dejado la ruta.');};}
function lrnRouteStart(cat){const L=(lrnThemes()[cat]||[]).slice();const ids=[];let px=player.x,pz=player.z;while(L.length&&ids.length<8){let bi=0,bd=1e9;L.forEach((o,i)=>{const d=Math.hypot(o.x-px,o.z-pz);if(d<bd){bd=d;bi=i;}});const o=L.splice(bi,1)[0];ids.push(o.data.id);px=o.x;pz=o.z;}
  const z=lrnZ();z.route={cat,ids,i:0};save();toast('<span class="label">Ruta: '+cat+'</span><br>'+ids.length+' paradas. El pedagogo te va marcando cada una con una columna de luz. Habla con cada persona y supera su pregunta para pasar a la siguiente.');setTimeout(lrnRouteShow,1500);}
function lrnRouteShow(){const z=lrnZ(),R=z.route;if(!R)return;const id=R.ids[R.i],o=npcObjs.find(q=>q.data.id===id);if(!o)return;try{mtBeacon(o.x,o.z);MTR.beaconT=600;}catch(e){}
  toast('<span class="label">Ruta · parada '+(R.i+1)+' de '+R.ids.length+'</span><br>'+o.data.name+(o.data.title?', '+o.data.title:'')+'. '+(LESSONS[id]?'Te hablará de: '+LESSONS[id].title+'.':''));}
function lrnRouteTick(){const z=state&&state.lrn,R=z&&z.route;if(!R||ui!=='play')return;const id=R.ids[R.i];if((state.lessons||[]).includes(id)){R.i++;save();
    if(R.i>=R.ids.length){z.route=null;save();toast('<span class="label">Ruta completada: '+R.cat+'</span><br>Has recorrido '+R.ids.length+' paradas. Mira el resumen en el menú › Aprender › ¿Qué he aprendido?');try{qAdd('so',2,'Has completado una ruta de aprendizaje.');}catch(e){}return;}
    setTimeout(lrnRouteShow,1200);}}
// ---------------------------------------------------------------- 9. viajar tocando el plano (sin destreza con el joystick o el teclado)
setTimeout(()=>{const c=$('mapc');if(!c)return;c.addEventListener('click',e=>{if(!ACC.mapGo||MV.moved||(typeof MED!=='undefined'&&MED.on))return;const[mx,my]=mapPt(e);
  for(const s of signObjs){if(!state.places.includes(s.data.id)||regionOf(s.x)!==regionOf(player.x))continue;const q=mapV(s.x,s.z,c.width,c.height);if(Math.hypot(q[0]-mx,q[1]-my)<16)return;}   // cerca de una estela: el viaje de siempre
  const v=mapVB(),x=v.x0+mx/c.width*v.w,z=v.z0+my/c.height*v.h;if(regionOf(x)!==regionOf(player.x)){toast('Ese punto está fuera de este mapa.');return;}
  const f=findFree(x,z,0.6);if(!f||floorAt(f[0],f[1])<-0.4){toast('Ahí no se puede ir: es agua o está ocupado.');return;}
  e.stopImmediatePropagation();player.x=f[0];player.z=f[1];player.feet=floorAt(f[0],f[1]);player.camY=player.feet+player.eye;player.vy=0;closeModals();toast('Viajas hasta ese punto del plano.');},true);},1000);
// ---------------------------------------------------------------- menú › Aprender, y las opciones en Accesibilidad
function lrnLvlLabel(){return{breve:'Lectura: breve',normal:'Lectura: normal',ampliada:'Lectura: ampliada'}[ACC.lvl]||'Lectura: normal';}
function lrnCycleLvl(){ACC.lvl=ACC.lvl==='breve'?'normal':ACC.lvl==='normal'?'ampliada':'breve';accSave();}
{const g0=gmRight;gmRight=function(d){g0(d);try{const g=d.querySelector('.gr');if(!g)return;const pg=GM.page||'';
  if(!pg){const two=g.querySelector('.two');if(two&&!two.querySelector('[data-lrn]')){const b=document.createElement('button');b.dataset.lrn='1';b.className='wide';b.innerHTML=gmIc('journal')+'<span class="t">Aprender</span><span class="k">resumen, repaso, rutas, lectura…</span>';b.onclick=()=>{GM.page='aprender';gmRight(d);};two.appendChild(b);}}
  else if(pg==='aprender'){const sec=g.querySelector('.sec');if(sec)sec.textContent='Aprender';const L=g.querySelector('.list');if(!L)return;
    const it=(t,sub,fn)=>{const b=document.createElement('button');b.innerHTML=gmIc('journal')+'<span class="t">'+t+'</span>'+(sub?'<span class="k">'+sub+'</span>':'');b.onclick=fn;L.appendChild(b);};L.innerHTML='';
    const ov=f=>()=>{gmClose();setTimeout(f,80);};
    it('¿Qué he aprendido?','resumen de esta sesión y una pregunta',ov(lrnSummary));it('Mapa de conceptos','cómo se relacionan tus lecciones',ov(lrnConcepts));it('Línea del tiempo','todo lo visto, por fechas',ov(lrnTimeline));
    it('Rutas por temas',lrnZ().route?'en curso: '+lrnZ().route.cat:'un recorrido guiado de 6-8 paradas',ov(lrnRouteMenu));
    it(lrnLvlLabel(),'breve · normal · ampliada (toca para cambiar)',()=>{lrnCycleLvl();gmRight(d);});
    it('Lectura fácil: '+(ACC.easy?'sí':'no'),'frases cortas, una idea por línea, con dibujos',()=>{ACC.easy=!ACC.easy;accSave();gmRight(d);});
    it('Sin presión: '+(ACC.calm?'sí':'no'),'fallar no bloquea: se explica y se sigue',()=>{ACC.calm=!ACC.calm;accSave();gmRight(d);});
    it('Viajar tocando el plano: '+(ACC.mapGo?'sí':'no'),'en el plano (M), toca un punto para ir allí',()=>{ACC.mapGo=!ACC.mapGo;accSave();gmRight(d);});}}catch(e){}};}
{const a0=accMenu;accMenu=function(){a0();try{const o=$('accBox');if(!o)return;const box=o.querySelector('div');const d=document.createElement('div');d.style.cssText='padding:8px;border:1px solid #6a4a30;border-radius:8px;margin:6px 0';
  const draw=()=>{d.innerHTML='<b>Para aprender</b><div class="lrnRow">'+['breve','normal','ampliada'].map(v=>'<button data-l="'+v+'" class="'+(ACC.lvl===v?'on':'')+'">'+v+'</button>').join('')+'</div><div class="lrnRow"><button data-t="easy" class="'+(ACC.easy?'on':'')+'">Lectura fácil</button><button data-t="calm" class="'+(ACC.calm?'on':'')+'">Sin presión</button><button data-t="mapGo" class="'+(ACC.mapGo?'on':'')+'">Viajar tocando el plano</button></div>';
    d.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{ACC.lvl=b.dataset.l;accSave();draw();});d.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ACC[b.dataset.t]=!ACC[b.dataset.t];accSave();draw();});};
  draw();const ps=box.querySelector('p.sub');box.insertBefore(d,ps||null);}catch(e){}};}
// ---------------------------------------------------------------- bucle: sesión, aviso del resumen, repaso y ruta
function lrnTick(dt){if(!state)return;if(!LRN.sess&&ui==='play')LRN.sess=lrnSnap();if(ui!=='play')return;
  try{rvTick(dt);}catch(e){}try{lrnRouteTick();}catch(e){}
  if(LRN.sess&&performance.now()-Math.max(LRN.sess.t,LRN.lastOffer)>25*60000){LRN.lastOffer=performance.now();const n=(state.lessons||[]).filter(id=>!LRN.sess.lessons.includes(id)).length;if(n)toast('<span class="label">Un respiro</span><br>Llevas un buen rato y has aprendido '+n+(n===1?' lección':' lecciones')+'. Míralo en el menú (Tab) › Aprender › ¿Qué he aprendido?');}}
{const f=uxTick;uxTick=function(dt){f(dt);try{lrnTick(dt);}catch(e){}};}
