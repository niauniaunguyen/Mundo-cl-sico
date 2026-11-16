// ============================================================ CONVERSACIONES CON CONSECUENCIAS: rumores, votos que se recuerdan y recomendaciones
// Lo que haces deja huella en la gente:
//  1. Rumores. Tus actos (cómo votaste en la Asamblea o el Senado, las cartas que entregaste, con quién aprendiste) corren de boca en boca:
//     quien vive cerca te lo comenta al empezar a hablar, una vez por persona y hecho.
//  2. Tu voto se recuerda. Según lo que votaste, unos te dan la razón y otros te la discuten.
//  3. Una puerta que se abre. Cuando ya te conocen (lecciones y buena fama), te recomiendan a alguien que sabe de lo que menos has
//     trabajado, y te lo señalan con una columna de luz.
function cqz(){const s=state;if(!s.cq)s.cq={ev:[],told:{},rec:{}};return s.cq;}
function cqAdd(k,txt,x,z,good){const Z=cqz();if(Z.ev.some(e=>e.k===k))return;Z.ev.push({k,txt,x,z,good:good!==false,day:state.day||1});if(Z.ev.length>40)Z.ev.shift();save();}
// reacciones a cada voto (lo que dirán los vecinos); h: la que coincide con lo que pasó en la historia
const CQ_VOTE={
 paz:{si:'«Te oí en la Pnyx votar por la paz del Rey. Hiciste bien: con el trigo cortado en el Helesponto no se podía seguir. Aunque duele dejar Jonia a los persas».',
      no:'«Así que votaste contra la paz… Valiente, pero la ciudad está agotada y sin trigo. Mi vecino dice que eres un exaltado; yo creo que tienes orgullo de ateniense».'},
 proxenia:{si:'«Votaste los honores para el extranjero que nos ayudó. Bien: quien trata bien a Atenas debe saber que Atenas no olvida».',
      no:'«¿Votaste contra honrar al próxeno? Hay quien piensa como tú: que los honores se dan ya demasiado fácilmente».'},
 estrategos:{a:'«Diste tu mano a Cabrias. Buen soldado, sí, aunque hay diez puestos y caben más».',b:'«Votaste a Ifícrates, el de los peltastas. Los aristócratas aún no le perdonan que sea hijo de un zapatero».',
      c:'«Votaste a los dos generales. Eso es saber contar: son diez estrategos cada año».'},
 campania:{a:'«Se dice que en el Senado apostaste por el sorteo entre los consulares. Así se hace: que la suerte reparta y nadie se ofenda».',b:'«Dicen que creías que se votaría a los comisionados para Campania. Aquí casi todo se deja a la suerte… o al príncipe».'},
 incendio:{a:'«Me contaron que en la Curia diste por hecho que pagaría el príncipe. Y así es: Tito abre su bolsa, y luego se le agradece».',b:'«¿Creías que pagarían las ciudades de Italia? Bastante tienen con la ceniza del Vesubio».'}};
// 1-2. al votar
{const f=asEnd;asEnd=function(I,v,mine){f.apply(this,arguments);try{const R=CQ_VOTE[I.id];if(R&&R[v]){cqz().votes=cqz().votes||{};cqz().votes[I.id]=v;
  cqAdd('vote:'+I.id,R[v],player.x,player.z,v===I.hist||v===I.hist2);}}catch(e){}};}
// cartas entregadas y lecciones con personajes históricos: se apuntan como hechos
{const f=uxTick;uxTick=function(dt){f(dt);try{if(!state||ui!=='play')return;const Z=cqz();Z.chk=(Z.chk||0)+dt;if(Z.chk<2)return;Z.chk=0;
  const dz=typeof dzz==='function'?dzz():null;if(dz&&dz.cartas&&dz.cartas>(Z.cartas||0)){Z.cartas=dz.cartas;cqAdd('carta:'+dz.cartas,'«¿Tú eres quien trajo la carta desde tan lejos? Aquí eso se agradece: sin viajeros como tú, no sabríamos nada de los nuestros».',player.x,player.z,true);}
  for(const id of state.lessons||[]){if(Z['l:'+id])continue;Z['l:'+id]=1;if(typeof HIST!=='undefined'&&HIST.has(id)){const n=NPCS.find(q=>q.id===id);if(n){const o=npcObjs.find(q=>q.data===n);cqAdd('les:'+id,'«Dicen que has estado hablando con '+n.name+'. ¡Nada menos! ¿Es verdad todo lo que se cuenta?»',o?o.x:player.x,o?o.z:player.z,true);}}}}catch(e){}};}
// el rumor aparece al empezar a hablar con alguien que vive cerca (a menos de 500 m del hecho), una vez por persona y hecho
{const f=openDialog;openDialog=function(n){f.apply(this,arguments);try{if(!n||!n.topics||ui!=='dialog')return;const Z=cqz(),o=npcObjs.find(q=>q.data===n);if(!o)return;const t=Z.told[n.id]||(Z.told[n.id]={});
  const ev=Z.ev.filter(e=>!t[e.k]&&Math.hypot(e.x-o.x,e.z-o.z)<500&&!e.k.endsWith(':'+n.id)).slice(-3);if(!ev.length)return;const e=ev[ev.length-1];t[e.k]=1;save();
  $('dBody').insertAdjacentHTML('beforeend','<p class="sub" style="border-left:3px solid #c98a4a;padding-left:8px">'+e.txt+'</p>');}catch(e){}};}
// 3. recomendaciones
function cqRecCat(){// el bloque del currículo que menos has trabajado, y una persona que sabe de él y aún no te ha enseñado
  let best=null;try{const n=curOf(state.lessons),T=curAll();let lo=2;for(const k in T){const p=(n[k]||0)/T[k];if(p<lo){lo=p;best=k;}}}catch(e){}
  const cats=best?Object.keys(CUR_CAT).filter(c=>CUR_CAT[c].includes(best)):null;
  const c=npcObjs.filter(o=>o.data.topics&&o.data.quiz&&!(state.lessons||[]).includes(o.data.id)&&(!cats||cats.includes(LESSONS[o.data.id]&&LESSONS[o.data.id].cat))&&o.x<8000);
  if(!c.length)return null;c.sort((a,b)=>Math.hypot(a.x-player.x,a.z-player.z)-Math.hypot(b.x-player.x,b.z-player.z));return c[Math.min(2,c.length-1)];}
{const f=renderOpts;renderOpts=function(extra){f(extra);try{const n=dlg&&dlg.n;if(!n||!n.topics)return;const Z=cqz(),L=(state.lessons||[]).length;let hs=0;try{hs=honScore();}catch(e){}
  if(L<6||hs<15||Z.rec[n.id]||!(state.lessons||[]).includes(n.id))return;   // te recomienda quien ya te ha enseñado algo
  const o=$('dOpts'),b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">☞</span><span>«¿Conoces a alguien que sepa más que yo de otras cosas?»</span>';
  b.onclick=()=>{const t=cqRecCat();Z.rec[n.id]=1;save();if(!t){$('dBody').innerHTML='<p>«Ya conoces a todos los que yo conozco. ¡Ahora eres tú quien debería presentarme a mí!»</p>';renderOpts();return;}
    const L2=LESSONS[t.data.id]||{};$('dBody').innerHTML='<p>«Ve a ver a <b>'+t.data.name+'</b>'+(t.data.title?', '+t.data.title.charAt(0).toLowerCase()+t.data.title.slice(1):'')+'. Dile que vas de mi parte: te hablará de <i>'+(L2.title||'lo suyo')+'</i>. Te indico por dónde».</p><p class="sub">Verás una columna de luz donde está. Entre los antiguos, una carta o una palabra de recomendación abría puertas: Cicerón escribió un libro entero de ellas (Cartas a los familiares, libro 13).</p>';
    try{mtBeacon(t.x,t.z);MTR.beaconT=600;}catch(e){}cqz().recTo=t.data.id;save();renderOpts();};
  o.insertBefore(b,o.lastChild);}catch(e){}};}
// al llegar a la persona recomendada, te recibe de otra manera (y algo de fama)
{const f=openDialog;openDialog=function(n){f.apply(this,arguments);try{const Z=cqz();if(n&&Z.recTo===n.id){Z.recTo=null;qAdd('kl',1,'Vienes recomendado: eso abre puertas.');save();
  $('dBody').insertAdjacentHTML('afterbegin','<p class="sub" style="border-left:3px solid #c98a4a;padding-left:8px">«¿Vienes de parte de un amigo? Entonces pasa, siéntate: para ti tengo tiempo».</p>');}}catch(e){}};}
