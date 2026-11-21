// ============================================================ PROBAR CON ALUMNOS: dónde se atascan, encuesta breve e informe, y menos texto al empezar
// Todo se guarda solo en el navegador del alumno (state.pt). Nada se envía a ningún sitio: el informe se descarga y lo entrega quien quiera.
// ?prueba=1 en el enlace muestra el botón «Terminar la prueba» con la encuesta. Los atascos: 2 minutos de juego sin salir de un radio de 12 m ni hablar con nadie.
function ptz(){if(!state.pt||typeof state.pt!=='object')state.pt={play:0,dlg:0,qok:0,qko:0,stuck:[],map:0,surv:null,t0:Date.now()};return state.pt;}
const PT={ax:null,az:null,at:0,dlgAt:0,on:/[?&]prueba=1/.test(location.search),btn:null,brief:false,lvl0:undefined};
function ptPlace(){try{const p=dzNearPlace();return(p?p.name+' · ':'')+regionName();}catch(e){return regionName();}}
function ptTick(dt){const z=ptz();if(ui!=='play')return;z.play+=dt;
  if(PT.ax===null||Math.hypot(player.x-PT.ax,player.z-PT.az)>12){PT.ax=player.x;PT.az=player.z;PT.at=0;return;}PT.at+=dt;
  if(PT.at>120&&performance.now()-PT.dlgAt>120000){const w=ptPlace(),last=z.stuck[z.stuck.length-1];if(last&&last.w===w)last.m+=2;else z.stuck.push({w,m:2,t:Math.round(z.play/60)});if(z.stuck.length>40)z.stuck.shift();PT.at=0;}}
{const f=openDialog;openDialog=function(n){PT.dlgAt=performance.now();try{ptz().dlg++;}catch(e){}return f(n);};}
{const f=answer;answer=function(ok){try{ok?ptz().qok++:ptz().qko++;}catch(e){}return f.apply(this,arguments);};}
{const f=openMap;openMap=function(){try{ptz().map++;}catch(e){}return f.apply(this,arguments);};}
function ptText(){const z=ptz(),L=['','— Sesión de prueba —','Tiempo de juego: '+Math.round(z.play/60)+' min · diálogos abiertos: '+z.dlg+' · plano abierto: '+z.map+' veces','Preguntas: '+z.qok+' acertadas, '+z.qko+' falladas'];
  if(z.stuck.length){L.push('Dónde se quedó parado más de 2 minutos sin hablar con nadie:');for(const s of z.stuck)L.push(' - '+s.w+' (unos '+s.m+' min, hacia el minuto '+s.t+')');}else L.push('No se ha quedado atascado en ningún sitio.');
  const S=z.surv;if(S){L.push('','— Encuesta —','¿Te has divertido? '+S.fun+'/5','¿Has sabido qué hacer? '+S.clear+'/5','Lo que más te ha gustado: '+(S.like||'—'),'Dónde te has perdido o aburrido: '+(S.lost||'—'),'Algo que has aprendido: '+(S.learn||'—'));}
  return L.join('\n');}
{const f=dzReport;dzReport=function(){return f()+'\n'+ptText();};}
function ptSurvey(then){const sc=k=>'<div style="display:flex;gap:6px;margin:6px 0 14px">'+[1,2,3,4,5].map(v=>'<button data-'+k+'="'+v+'" style="width:44px;height:44px;border-radius:50%;border:1px solid #c98a4a;background:#2a1e14;color:#f3e6cf;font:inherit;font-size:1.1em;cursor:pointer">'+v+'</button>').join('')+'</div>';
  const ta=(id,ph)=>'<textarea id="'+id+'" rows="2" placeholder="'+ph+'" style="width:100%;box-sizing:border-box;background:#1e1712;color:#f3e6cf;border:1px solid #6a4a30;border-radius:8px;padding:8px;font:inherit;margin:4px 0 12px"></textarea>';
  const o=eduOverlay('ptBox','Encuesta breve','<div style="max-width:560px;margin:0 auto"><p>Cuatro preguntas. No hay respuestas buenas ni malas: sirven para mejorar el juego.</p><p>¿Te has divertido?</p>'+sc('fun')+'<p>¿Has sabido en todo momento qué hacer?</p>'+sc('clear')+
    '<p>¿Qué es lo que más te ha gustado?</p>'+ta('ptLike','Escribe aquí…')+'<p>¿Dónde te has perdido o aburrido?</p>'+ta('ptLost','Escribe aquí…')+'<p>Di una cosa que hayas aprendido.</p>'+ta('ptLearn','Escribe aquí…')+
    '<button id="ptGo" style="padding:10px 18px;border-radius:8px;border:1px solid #c98a4a;background:#c98a4a;color:#1e1712;font:inherit;cursor:pointer">Enviar al informe y descargarlo</button></div>');
  const S={fun:0,clear:0};for(const k of['fun','clear'])o.querySelectorAll('button[data-'+k+']').forEach(b=>b.onclick=()=>{S[k]=+b.dataset[k];o.querySelectorAll('button[data-'+k+']').forEach(x=>x.style.background=+x.dataset[k]<=S[k]?'#c98a4a':'#2a1e14');});
  $('ptGo').onclick=()=>{S.like=$('ptLike').value.trim();S.lost=$('ptLost').value.trim();S.learn=$('ptLearn').value.trim();ptz().surv=S;save();o.remove();dzDownload();if(then)then();};}
{const f=lrnSummary;lrnSummary=function(){f.apply(this,arguments);try{const B=$('lrnBox');if(!B||B.querySelector('.ptSv'))return;const b=document.createElement('button');b.className='ptSv';b.textContent='Encuesta breve (para mejorar el juego)';b.style.cssText='margin:10px 0 0 8px;padding:8px 14px;border-radius:8px;border:1px solid #6a4a30;background:#1e1712;color:#f3e6cf;font:inherit;cursor:pointer';b.onclick=()=>{B.remove();ptSurvey();};(B.querySelector('.dzRep')||{}).parentNode?B.querySelector('.dzRep').parentNode.appendChild(b):B.appendChild(b);}catch(e){}};}
function ptButton(){if(!PT.on||PT.btn)return;const b=document.createElement('button');b.textContent='Terminar la prueba';b.style.cssText='position:fixed;left:12px;bottom:12px;z-index:40;padding:8px 14px;border-radius:8px;border:1px solid #c98a4a;background:rgba(30,23,18,.9);color:#f3e6cf;font:14px Alegreya,Georgia,serif;cursor:pointer';
  b.onclick=()=>{releasePointer&&releasePointer();ptSurvey();};document.body.appendChild(b);PT.btn=b;}
// menos texto al empezar: los primeros 8 minutos de una partida nueva, los diálogos usan la lectura breve (con «…más» para quien quiera); luego, la que haya elegido el jugador
function ptBrief(){const z=ptz(),want=z.play<480&&!ACC.lvlChosen&&(!state.lessons||state.lessons.length<3);
  if(want&&!PT.brief){PT.lvl0=ACC.lvl;ACC.lvl='breve';PT.brief=true;}else if(!want&&PT.brief){ACC.lvl=PT.lvl0;PT.brief=false;}}
{const f=accSave;accSave=function(){if(PT.brief){const cur=ACC.lvl;if(cur!=='breve'){ACC.lvlChosen=1;PT.brief=false;}else ACC.lvl=PT.lvl0;f.apply(this,arguments);if(PT.brief)ACC.lvl='breve';return;}if(ACC.lvl&&ACC.lvl!=='normal')ACC.lvlChosen=1;return f.apply(this,arguments);};}
{const f=uxTick;uxTick=function(dt){f(dt);if(!state||ui==='start')return;try{ptTick(dt);ptBrief();ptButton();}catch(e){}};}
