// ============================================================ JUGABILIDAD (6): diez propuestas más (22/11)
// J1 El cielo de noche: reconocer constelaciones y para qué servían (Hesíodo, Trabajos y días 383-384, 571, 609-617; en Roma,
//    Virgilio, Geórgicas I 204-230): las Pléyades marcan la siega y la siembra, Orión la trilla, Arturo la vendimia, la Osa el norte.
// J2 Medir con sombras, como Tales: cuánto mide un templo, una pirámide o un obelisco a partir de tu sombra (con el sol de ese momento).
//    Tales midió así las pirámides (lo cuenta Diógenes Laercio I 27, citando a Jerónimo; Plutarco, Banquete de los siete sabios 147a).
// J3 El cambista: monedas y cambios. Atenas: óbolo, dracma, mina; la dracma de Egina pesa más (unos 10 óbolos áticos). Roma: as,
//    sestercio, denario y áureo. En la mesa de Pasión (Atenas) o de un argentario del Foro (Roma).
// J4 El médico: casos sencillos con la medicina de entonces (dieta, reposo, ejercicio, baños; la incubación en el santuario de
//    Asclepio): tratados hipocráticos «Sobre la dieta en las enfermedades agudas»; en Roma, Celso, Sobre la medicina (I 1-3).
//    Aviso: es medicina antigua, no consejo médico.
// J5 Modo explorador: sin brújula, sin minimapa y sin columna de luz. Te orientas por el sol, los montes y los monumentos; lo que
//    consigues así cuenta más.
// J6 Señala y aprende: al mirar de cerca un templo, una fuente, un altar o una muralla, aparece su nombre en griego o en latín.
// J7 Cuaderno: notas propias en cada sitio, que se pueden descargar para entregarlas.
// J8 Filosofía: en la Academia, que Platón acaba de fundar (h. 387 a.C.), un diálogo sobre qué es la valentía (como el Laques);
//    en Roma, con Epicteto, el ejercicio de separar lo que depende de ti y lo que no (Manual 1).
// J9 Pintar: en Atenas, decorar un vaso en el taller (figuras rojas, la técnica de esta época); en Roma, pintar un fresco (IV estilo).
// J10 La temporada de navegación: de noviembre a marzo apenas se navega (Hesíodo aconseja los cincuenta días tras el solsticio de
//    verano, Trabajos 663-665; Plinio cuenta que el mar «se abre» en primavera, II 122). En invierno, el pasaje cuesta más y te avisan.
const X6={tip:null,tipT:0};
function x6z(){const z=x4z();z.x6=z.x6||{};return z.x6;}
// ---- J1: el cielo
const X6_CON=[{n:'Las Pléyades',s:[[0.2,0.3],[0.24,0.28],[0.22,0.34],[0.27,0.32],[0.25,0.36],[0.21,0.27]],a:'Cuando salen al alba, en mayo, empieza la siega; cuando se ponen, en otoño, se ara y se siembra.'},
 {n:'Orión',s:[[0.5,0.3],[0.62,0.32],[0.54,0.45],[0.56,0.46],[0.58,0.47],[0.5,0.6],[0.63,0.6]],a:'Cuando aparece al alba, en pleno verano, es hora de trillar el grano en la era.'},
 {n:'Arturo',s:[[0.8,0.55]],a:'Cuando sale al anochecer, en septiembre, empieza la vendimia.'},
 {n:'La Osa Mayor',s:[[0.12,0.7],[0.2,0.68],[0.27,0.7],[0.33,0.74],[0.35,0.84],[0.43,0.84],[0.43,0.75]],a:'Nunca se pone: gira alrededor del norte y guía a los marinos.'}];
function x6Sky(hi){const c=document.createElement('canvas');c.width=360;c.height=220;const x=c.getContext('2d');x.fillStyle='#0b1226';x.fillRect(0,0,360,220);for(let i=0;i<160;i++){x.fillStyle='rgba(255,255,255,'+(0.2+Math.random()*0.5)+')';x.fillRect(Math.random()*360,Math.random()*220,1,1);}
  X6_CON.forEach((C,k)=>{x.fillStyle=k===hi?'#ffe08a':'#e8ecff';C.s.forEach(p=>{x.beginPath();x.arc(p[0]*360,p[1]*220,k===hi?3:2,0,7);x.fill();});if(k===hi&&C.s.length>1){x.strokeStyle='rgba(255,220,140,.6)';x.beginPath();C.s.forEach((p,i)=>i?x.lineTo(p[0]*360,p[1]*220):x.moveTo(p[0]*360,p[1]*220));x.stroke();}});return c.toDataURL();}
function x6Cielo(){if(typeof DAYF!=='undefined'&&DAYF>0.3){jmSay('<p>Vuelve de noche: con el sol en el cielo no se ven las estrellas.</p>');return;}const ord=[0,1,2,3].sort(()=>Math.random()-0.5);let i=0,ok=0;
  const step=()=>{if(i>=4){x6z().cielo=Math.max(x6z().cielo||0,ok);save();if(ok>=3){cyPay(2,'Sabes leer el cielo');try{qAdd('so',1,'Conoces las estrellas del calendario.');momento('done','El cielo de noche',ok+' de 4 constelaciones');}catch(e){}}else jmSay('<p>Has reconocido '+ok+' de 4. Las estrellas eran el calendario del campesino y la brújula del marino.</p>');return;}
    const k=ord[i],ops=X6_CON.map(c=>c.n).sort(()=>Math.random()-0.5);jmDlg('✶','El cielo de noche',(MODE==='roma'?'Virgilio, Geórgicas I':'Hesíodo, Trabajos y días')+' · '+(i+1)+'/4','<p><img src="'+x6Sky(k)+'" style="width:100%;border-radius:8px"></p><p>¿Qué son las estrellas en amarillo?</p>',
      ops.map(n=>[n,()=>{const r=n===X6_CON[k].n;if(r)ok++;jmDlg('✶',X6_CON[k].n,r?'¡Bien!':'Era '+X6_CON[k].n,'<p>'+X6_CON[k].a+'</p>',[['Seguir',()=>{i++;step();}]]);}]));};step();}
X4_TABS.cielo={n:'Cielo',h:()=>'<p>De noche, mira el cielo y reconoce las constelaciones que guiaban el trabajo del campo y la navegación.</p><button class="bt" id="x6Sk">Mirar el cielo</button>',bind:d=>{const b=d.querySelector('#x6Sk');if(b)b.onclick=()=>{x4Close();setTimeout(x6Cielo,150);};}};
// ---- J2: medir con sombras
const X6_MON={atenas:[['partenon','el Partenón',18],['hefestion','el Hefestion',12],['menfis','la gran pirámide',146]],roma:[['ro_obelisco','el obelisco del Circo',24],['ro_jupiter','el templo de Júpiter',30],['ro_coliseo','el Anfiteatro Flavio',48]]};
function x6Mon(){const L=X6_MON[MODE==='roma'?'roma':'atenas'];for(const m of L){const p=(PLACES||[]).find(q=>q.id===m[0]||(m[0]==='menfis'&&/pir[aá]mide/i.test(q.name||'')));if(p&&Math.hypot(p.x-player.x,p.z-player.z)<90)return {n:m[1],h:m[2]};}return null;}
function x6Tales(){const m=x6Mon(),e=typeof SUNDIR!=='undefined'?SUNDIR.y:0;if(!m){jmSay('<p>Acércate a un monumento alto ('+X6_MON[MODE==='roma'?'roma':'atenas'].map(q=>q[1]).join(', ')+') para medirlo con su sombra.</p>');return;}
  if(e<0.12){jmSay('<p>Hace falta sol, y que no esté demasiado bajo: vuelve a medir de día.</p>');return;}const t=e/Math.sqrt(1-e*e),yo=1.7,sy=yo/t,sm=m.h/t,r=n=>(Math.round(n*10)/10).toString().replace('.',',');
  const ok=Math.round(m.h),ops=[ok,Math.round(ok*1.6),Math.round(ok*0.55)].sort(()=>Math.random()-0.5);
  jmDlg('◐','Medir con sombras','Como Tales','<p>Tú mides 1,7 m y ahora tu sombra mide <b>'+r(sy)+' m</b>. La sombra de '+m.n+' mide <b>'+r(sm)+' m</b>.</p><p>Si tu altura es a tu sombra como la altura del monumento a la suya, ¿cuánto mide '+m.n+'?</p>',
    ops.map(v=>[v+' m',()=>{if(v===ok){cyPay(2,'Medido como Tales');try{qAdd('so',1,'Has medido con una proporción.');momento('done','Medir con sombras',m.n+': unos '+ok+' m');}catch(er){}}else jmSay('<p>Casi. Haz la cuenta: altura = '+r(sm)+' × 1,7 ÷ '+r(sy)+' ≈ '+ok+' m.</p>');}]));}
X4_TABS.medir={n:'Medir',h:()=>'<p>Junto a un templo alto, una pirámide o un obelisco, mide su altura con tu sombra, como hizo Tales con las pirámides.</p><button class="bt" id="x6Me">Medir aquí</button>',bind:d=>{const b=d.querySelector('#x6Me');if(b)b.onclick=()=>{x4Close();setTimeout(x6Tales,150);};}};
// ---- J3: el cambista
const X6_CAM={atenas:[['¿Cuántos óbolos son 3 dracmas?','18','12','30'],['¿Cuántas dracmas tiene una mina?','100','60','1000'],['Un mercader de Egina trae 6 dracmas eginéticas (unos 10 óbolos áticos cada una). ¿Cuántas dracmas áticas son?','10','6','36'],['Un talento son 60 minas. ¿Cuántas dracmas son?','6000','600','3600']],
  roma:[['¿Cuántos sestercios vale un denario?','4','10','16'],['¿Cuántos ases vale un sestercio?','4','2','10'],['Un áureo vale 25 denarios. ¿Cuántos sestercios son?','100','25','250'],['Un soldado cobra 225 denarios al año (desde Augusto; Tácito, Anales I 17). ¿Cuántos sestercios son?','900','225','2250']]};
function x6Cambio(){const L=X6_CAM[MODE==='roma'?'roma':'atenas'].slice().sort(()=>Math.random()-0.5).slice(0,3);let i=0,ok=0;
  const step=()=>{if(i>=3){if(ok===3){cyPay(3,'El cambista te deja ayudar en la mesa');try{qAdd('lo',1,'Sabes de cuentas.');momento('done','El cambista','Tres cambios sin un error');}catch(e){}}else jmSay('<p>Has hecho bien '+ok+' de 3 cambios. El cambista cobra una pequeña comisión por cada cambio: el que no sabe contar, paga de más.</p>');return;}
    const q=L[i];jmDlg('⚖',MODE==='roma'?'Argentario':'La mesa del cambista','Cambio '+(i+1)+'/3','<p><b>'+q[0]+'</b></p>',[q[1],q[2],q[3]].sort(()=>Math.random()-0.5).map(a=>[a,()=>{if(a===q[1])ok++;i++;step();}]));};step();}
// ---- J4: el médico
const X6_MED=[['Un hombre con fiebre alta desde ayer, sin hambre y muy débil.','Reposo y una tisana de cebada (ptisana) en poca cantidad','Correr en el gimnasio para sudar la fiebre','Un gran banquete para recuperar fuerzas'],
 ['Un escribano que pasa el día sentado, con la espalda dolorida y el cuerpo pesado.','Paseos y ejercicio moderado cada día','Quedarse en cama un mes','Beber vino puro'],
 ['Una mujer con dolor de estómago después de comer mucho y pesado.','Ayuno ligero y comida sencilla unos días','Comer el doble','Bañarse en agua helada'],
 ['Un enfermo que no mejora y quiere pedir ayuda al dios.','Dormir en el santuario de Asclepio (la incubación) y contar el sueño a los sacerdotes','Ir al teatro','Viajar por mar en invierno']];
function x6Medico(){const L=X6_MED.slice().sort(()=>Math.random()-0.5).slice(0,3);let i=0,ok=0;
  const step=()=>{if(i>=3){if(ok>=3){cyPay(2,'El médico te da las gracias');try{qAdd('eu',1,'Has ayudado a los enfermos.');momento('done',MODE==='roma'?'El médico griego':'El médico hipocrático','Has aprendido la medicina de la dieta');}catch(e){}}else jmSay('<p>Has acertado '+ok+' de 3. Los médicos de la escuela de Hipócrates curaban sobre todo con la dieta, el reposo y el ejercicio.</p>');return;}
    const q=L[i];jmDlg('⚕',MODE==='roma'?'Un médico griego':'Un médico hipocrático','Caso '+(i+1)+'/3 · medicina antigua, no consejo médico','<p>'+q[0]+'</p><p><b>¿Qué le recomiendas?</b></p>',[q[1],q[2],q[3]].sort(()=>Math.random()-0.5).map(a=>[a,()=>{if(a===q[1])ok++;i++;step();}]));};step();}
// ---- J5: modo explorador
function x6Expl(on){const z=x6z();z.expl=!!on;save();document.body.classList.toggle('explorador',!!on);}
(()=>{const s=document.createElement('style');s.textContent='body.explorador #compass,body.explorador #mini{display:none!important}';document.head.appendChild(s);})();
{const f=moBeacon;moBeacon=function(){if(state&&x6z().expl){if(MO.beacon)MO.beacon.visible=false;return;}return f.apply(this,arguments);};}
{const f=momento;momento=function(kind,t,s){const r=f.apply(this,arguments);try{if(state&&x6z().expl&&(kind==='step'||kind==='done')){qAdd('so',1,'Lo has encontrado sin brújula.');}}catch(e){}return r;};}
// ---- J6: señala y aprende
const X6_W=[[/templo|partenón|hefestion|erecteion/i,'ναός (naós)','templum','templo'],[/stoa|pórtico/i,'στοά (stoá)','porticus','pórtico'],[/fuente/i,'κρήνη (kréne)','fons','fuente'],[/altar|ara\b/i,'βωμός (bomós)','ara','altar'],
 [/teatro|odeón/i,'θέατρον (théatron)','theatrum','teatro'],[/muralla|muro/i,'τεῖχος (teíkhos)','murus','muralla'],[/puerta|propileos/i,'πύλη (pýle)','porta','puerta'],[/ágora|foro|mercado/i,'ἀγορά (agorá)','forum','plaza del mercado'],
 [/tumba|sepulcro|necrópolis/i,'τάφος (táphos)','sepulcrum','tumba'],[/puerto/i,'λιμήν (limén)','portus','puerto'],[/estatua/i,'ἄγαλμα (ágalma)','statua','estatua'],[/casa/i,'οἰκία (oikía)','domus','casa'],[/taller/i,'ἐργαστήριον (ergastérion)','officina','taller']];
function x6Tip(){const z=x6z();if(z.noTip||ui!=='play')return x6TipShow(null);const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);let best=null,bd=14;
  for(const f of footprints){if(!f.name)continue;const dx=f.x-player.x,dz=f.z-player.z,d=Math.hypot(dx,dz)-Math.max(f.w||0,f.d||0,(f.r||0)*2)/2;if(d>bd||d<-8)continue;const dot=(dx*fx+dz*fz)/(Math.hypot(dx,dz)||1);if(dot<0.75)continue;
    const w=X6_W.find(q=>q[0].test(f.name));if(w){bd=d;best=w;}}
  x6TipShow(best);}
function x6TipShow(w){let e=$('x6Tip');if(!e){e=document.createElement('div');e.id='x6Tip';e.style.cssText='position:fixed;left:50%;top:calc(50% + 26px);transform:translateX(-50%);z-index:20;padding:3px 10px;border-radius:999px;background:rgba(16,12,9,.65);color:#fbe6c8;font:14px var(--f-body);pointer-events:none;transition:opacity .4s;opacity:0;white-space:nowrap';document.body.appendChild(e);}
  if(!w){e.style.opacity=0;return;}e.innerHTML=(MODE==='roma'?'<b style="color:#f8e4b4">'+w[2]+'</b>':'<b style="color:#eea36a">'+w[1]+'</b>')+' · '+w[3];e.style.opacity=1;}
// ---- J7: cuaderno
function x6Here(){try{const P=(PLACES||[]).filter(p=>isFinite(p.x)).map(p=>[Math.hypot(p.x-player.x,p.z-player.z),p]).sort((a,b)=>a[0]-b[0])[0];return P&&P[0]<80?P[1].name:regionName();}catch(e){return 'Aquí';}}
X4_TABS.notas={n:'Cuaderno',h:()=>{const L=x6z().notas||[];return '<p>Escribe lo que observas o piensas en cada sitio. Puedes descargar el cuaderno para entregarlo.</p><div style="display:flex;gap:6px;margin-bottom:8px"><input id="x6NT" maxlength="400" placeholder="Nota sobre '+x6Here().replace(/"/g,'')+'…" style="flex:1;padding:6px 8px;border-radius:6px;border:1px solid #7a5a3a;background:rgba(0,0,0,.3);color:#fbe6c8"><button class="bt" id="x6NA">Añadir</button></div>'+
  L.slice().reverse().map(n=>'<div class="m"><div class="tx"><span class="k">'+n.p+' · día '+n.d+'</span><br>'+n.t.replace(/</g,'&lt;')+'</div></div>').join('')+(L.length?'<button class="bt" id="x6ND">Descargar el cuaderno</button>':'');},
  bind:d=>{const i=d.querySelector('#x6NT'),a=d.querySelector('#x6NA'),dl=d.querySelector('#x6ND');if(i){i.addEventListener('keydown',e=>e.stopPropagation());setTimeout(()=>i.focus(),50);}
    if(a)a.onclick=()=>{const t=(i.value||'').trim();if(!t)return;const z=x6z();(z.notas||(z.notas=[])).push({t,p:x6Here(),d:state.day||1});save();x4Diario('notas');};
    if(dl)dl.onclick=()=>{const nm=(typeof pjz==='function'&&pjz().name)||'',txt='Cuaderno de '+nm+' · Nóstos · '+(MODE==='roma'?'Roma, 80 d.C.':'Atenas, 386 a.C.')+'\n\n'+(x6z().notas||[]).map(n=>'['+n.p+' · día '+n.d+']\n'+n.t+'\n').join('\n');
      const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));l.download='cuaderno_nostos.txt';document.body.appendChild(l);l.click();l.remove();};}};
// ---- J8: filosofía
function x6Laques(){const R=[['«Dime: ¿qué es la valentía?»',[['Quedarse en su puesto en la batalla sin huir',0],['No tener miedo de nada',0],['Una firmeza del alma',1]],'«¿Y los jinetes escitas, que vencen retirándose y volviendo? ¿No son valientes? Tu definición es demasiado estrecha.»'],
  ['«Una firmeza del alma… ¿Toda firmeza? ¿También la del terco que insiste en un error?»',[['No: solo la firmeza acompañada de saber',1],['Sí, toda firmeza',0],['La valentía es no pensar',0]],'«Bien: entonces la valentía tiene que ver con saber qué es de temer y qué no.»'],
  ['«Y saber qué es de temer y qué no… ¿no es saber qué está bien y qué está mal? Entonces la valentía sería toda la virtud entera.»',[['Entonces aún no sabemos del todo qué es la valentía',1],['Ya está todo claro',0],['La filosofía no sirve para nada',0]],'«Exacto. Saber que no sabemos es el principio: así acaba también el Laques. Vuelve otro día y seguiremos buscando.»']];let i=0,ok=0;
  const step=()=>{if(i>=R.length){if(ok>=2){try{qAdd('so',2,'Has buscado una definición con Platón.');momento('done','Diálogo en la Academia','¿Qué es la valentía?');}catch(e){}}return;}const r=R[i];
    jmDlg('Π','Platón','En la Academia, recién fundada','<p>'+r[0]+'</p>',r[1].map(o=>[o[0],()=>{ok+=o[1];jmDlg('Π','Platón','',o[1]?'<p>'+r[2]+'</p>':'<p>«Mmm… piénsalo otra vez.» '+r[2]+'</p>',[['Seguir',()=>{i++;step();}]]);}]));};step();}
function x6Epicteto(){const L=[['Lo que piensas de los demás',1],['Que llueva mañana',0],['Lo que deseas',1],['Lo que dicen de ti en el Foro',0],['Cómo respondes a un insulto',1],['Tu salud',0]].sort(()=>Math.random()-0.5);let i=0,ok=0;
  const step=()=>{if(i>=L.length){if(ok>=5){try{qAdd('so',2,'Distingues lo que depende de ti.');momento('done','Con Epicteto','Lo que depende de ti y lo que no');}catch(e){}}jmSay('<p>«Has acertado '+ok+' de 6. De nosotros dependen el juicio, el deseo y la aversión; no dependen el cuerpo, la fama ni los cargos (Manual 1). Ocúpate de lo primero.»</p>');return;}
    const q=L[i];jmDlg('E','Epicteto','Ejercicio '+(i+1)+'/6','<p>«¿Esto depende de ti?» <b>'+q[0]+'</b></p>',[['Depende de mí',()=>{if(q[1])ok++;i++;step();}],['No depende de mí',()=>{if(!q[1])ok++;i++;step();}]]);};step();}
// ---- J9: pintar un vaso o un fresco
function x6Pintar(){const ro=MODE==='roma',sel={};const A=ro?[['Fondo',['Rojo pompeyano','Negro','Amarillo']],['Tema',['Un paisaje con una villa','Una naturaleza muerta','Un mito: Perseo y Andrómeda']]]:[['Forma',['Cílix (copa)','Hidria','Crátera']],['Escena',['Atenea','Atletas','Un banquete']]];
  const ask=k=>{if(k>=A.length)return x6Paint(sel,ro);jmDlg(ro?'▦':'⚱',ro?'Pintar un fresco':'Decorar un vaso',A[k][0],'<p>'+(ro?'Estilo de moda en el año 80 (IV estilo): fondos de color, arquitecturas fingidas y cuadritos en el centro.':'Técnica de figuras rojas: el fondo se pinta de barniz negro y las figuras quedan del color del barro.')+'</p><p>Elige: <b>'+A[k][0]+'</b></p>',A[k][1].map(o=>[o,()=>{sel[A[k][0]]=o;ask(k+1);}]));};ask(0);}
function x6Paint(sel,ro){const c=document.createElement('canvas');c.width=220;c.height=220;const x=c.getContext('2d');
  if(ro){x.fillStyle={'Rojo pompeyano':'#9e3a2a','Negro':'#2a2420','Amarillo':'#c9a03a'}[sel.Fondo];x.fillRect(0,0,220,220);x.strokeStyle='#e8d8b0';x.lineWidth=3;x.strokeRect(14,14,192,192);x.fillStyle='#e8dcc4';x.fillRect(60,60,100,90);
    x.fillStyle='#4a6a3a';if(/paisaje/.test(sel.Tema)){x.fillRect(60,120,100,30);x.fillStyle='#d8ccb4';x.fillRect(95,95,40,25);}else if(/naturaleza/.test(sel.Tema)){x.beginPath();x.arc(110,110,18,0,7);x.fill();x.fillStyle='#a8452c';x.beginPath();x.arc(132,118,10,0,7);x.fill();}else{x.fillStyle='#7a5a3a';x.fillRect(80,85,12,50);x.fillRect(130,90,10,45);}}
  else{x.fillStyle='#e8dcc8';x.fillRect(0,0,220,220);const sh=sel.Forma||'',g=x;g.fillStyle='#1a1410';g.beginPath();if(/Cílix/.test(sh)){g.ellipse(110,110,95,40,0,0,7);}else if(/Hidria/.test(sh)){g.ellipse(110,120,60,80,0,0,7);}else{g.ellipse(110,115,80,70,0,0,7);}g.fill();
    g.fillStyle='#c46632';g.beginPath();g.ellipse(110,120,10,22,0,0,7);g.fill();g.beginPath();g.arc(110,92,8,0,7);g.fill();if(/Atletas/.test(sel.Escena)){g.beginPath();g.ellipse(80,125,8,20,0.3,0,7);g.fill();g.beginPath();g.arc(84,100,7,0,7);g.fill();}
    if(/banquete/.test(sel.Escena)){g.fillRect(70,140,80,6);}if(/Atenea/.test(sel.Escena)){g.fillRect(124,80,4,70);}g.strokeStyle='#c46632';g.lineWidth=2;for(let i=0;i<10;i++){g.strokeRect(40+i*14,170,10,6);}}
  const z=x6z();z.obra=c.toDataURL('image/jpeg',0.8);save();x4Trofeo(ro?'fresco':'vaso',ro?'Tu fresco':'Tu vaso',ro?'Un fresco de IV estilo pintado por ti':'Un vaso de figuras rojas decorado por ti');
  jmSay('<p>'+(ro?'Tu fresco':'Tu vaso')+':</p><p style="text-align:center"><img src="'+z.obra+'" style="width:200px;border-radius:8px"></p>');}
// ---- J10: la temporada de navegación
function x6Winter(){try{const m=calNow().mo;return m>=10||m<=2;}catch(e){return false;}}
{const f=fareOf;fareOf=function(from,to,land){const v=f.apply(this,arguments);try{if(!land&&v>0&&x6Winter()){const z=x6z(),k=(state.day||1)+':'+to;if(X6.warn!==k){X6.warn=k;setTimeout(()=>toast('<span class="label">Mar cerrado</span><br>En invierno casi nadie navega: el mar está bravo y los días son cortos. '+(MODE==='roma'?'Plinio dice que el mar «se abre» en primavera (II 122).':'Hesíodo aconseja navegar en los cincuenta días tras el solsticio de verano (Trabajos 663-665).')+' El pasaje cuesta la mitad más.'),200);}return Math.ceil(v*1.5);}}catch(e){}return v;};}
// ---- dónde se juega: opciones en los personajes y puntos en el mapa
{const f=openDialog;openDialog=function(n){const r=f.apply(this,arguments);try{if(!n||ui!=='dialog')return r;const o=$('dOpts'),add=(t,fn)=>{const b=document.createElement('button');b.innerHTML='<span class="n">·</span><span>'+t+'</span>';b.onclick=()=>{closeDialog();setTimeout(fn,80);};o.appendChild(b);};
  if(n.id==='pasion')add('Ayudar en la mesa del cambista',x6Cambio);if(n.id==='platon')add('Un diálogo: ¿qué es la valentía?',x6Laques);if(n.id==='epicteto')add('El ejercicio de lo que depende de ti',x6Epicteto);
  if(n.id==='alfarero')add('Decorar un vaso en el taller',x6Pintar);if(n.id==='enfermo')add('Pedir consejo al médico',x6Medico);}catch(e){}return r;};}
function x6Spots(){if(X6.spots||!state||typeof egxObj!=='function')return;X6.spots=1;const ro=MODE==='roma',P=id=>(PLACES||[]).find(q=>q.id===id);
  try{if(ro){const b=P('ro_basilica_julia');if(b){const q=findFree(b.x+6,b.z+10,1)||[b.x+6,b.z+10];egxObj(q[0],q[1],undefined,x6Cambio,'Argentario','cambio de monedas · E',3);}
      const is=P('ro_isla');if(is){const q=findFree(is.x+4,is.z+4,1)||[is.x+4,is.z+4];egxObj(q[0],q[1],undefined,x6Medico,'Un médico griego','junto al templo de Esculapio · E',3);}
      const f=P('ro_basilica_emilia');if(f){const q=findFree(f.x-6,f.z+8,1)||[f.x-6,f.z+8];egxObj(q[0],q[1],undefined,x6Pintar,'Un taller de pintores','pintar un fresco · E',3);}}
    else if(typeof ACRO!=='undefined'){const x=ACRO.x+30,z=ACRO.z+ACRO.rz+14,q=findFree(x,z,1)||[x,z];egxObj(q[0],q[1],undefined,x6Medico,'Un médico hipocrático','junto al santuario de Asclepio · E',3);}}catch(e){}}
// menú: modo explorador y «señala y aprende»
{const f=gmDo;gmDo=function(k){if(k==='expl'){x6Expl(!x6z().expl);try{gmClose();}catch(e){}toast('<span class="label">Modo explorador</span><br>'+(x6z().expl?'Sin brújula ni minimapa: oriéntate por el sol y los monumentos.':'Vuelven la brújula y el minimapa.'));return;}
  if(k==='señala'){const z=x6z();z.noTip=!z.noTip;save();try{gmClose();}catch(e){}toast('<span class="label">Señala y aprende</span><br>'+(z.noTip?'Desactivado.':'Activado: al mirar un edificio de cerca verás su nombre antiguo.'));return;}return f.apply(this,arguments);};}
X4_TABS.mas={n:'Más',h:()=>'<p><button class="bt" id="x6E">'+(x6z().expl?'Quitar el modo explorador':'Modo explorador (sin brújula ni minimapa)')+'</button></p><p><button class="bt" id="x6T">'+(x6z().noTip?'Activar':'Desactivar')+' «señala y aprende»</button></p>',
  bind:d=>{d.querySelector('#x6E').onclick=()=>{x6Expl(!x6z().expl);x4Diario('mas');};d.querySelector('#x6T').onclick=()=>{const z=x6z();z.noTip=!z.noTip;save();x4Diario('mas');};}};
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(state&&ui!=='start'){X6.tipT-=dt;if(X6.tipT<=0){X6.tipT=0.4;x6Tip();x6Spots();if(x6z().expl&&!document.body.classList.contains('explorador'))document.body.classList.add('explorador');}}}catch(e){}return r;};}
