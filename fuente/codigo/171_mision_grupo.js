// ============================================================ MISIÓN DE GRUPO (modo en línea): preparar un banquete entre varios
// Solo en una sala en línea. Cada jugador se encarga de uno o más papeles (traer la crátera, el vino, el agua…); cada uno va a su sitio,
// señalado con una columna de luz, y al final el grupo se reúne. Hace falta que colaboren al menos dos personas distintas.
// No usa mensajes nuevos: el estado de cada uno viaja en su «presencia» (campo q), como la posición.
const COOP={
 atenas:{id:'symposion',title:'Preparar un banquete',meet:'casa',meetN:'tu casa',
  intro:'Esta noche hay banquete (sympósion) en tu casa. Repartíos el trabajo: alguien trae la crátera de los alfareros, alguien el vino y alguien el agua de la fuente. Cuando esté todo, reuníos allí.',
  roles:[{k:'krater',n:'La crátera',at:'demo_kerameis',t:'En el barrio de los alfareros eliges una crátera pintada, el vaso grande donde se mezcla el vino con el agua.'},
         {k:'vino',n:'El vino',at:'mercado',t:'En el mercado compras un ánfora de vino de Quíos: el mejor, y el más caro.'},
         {k:'agua',n:'El agua fresca',at:'fuente',t:'Llenas una hidria en la fuente: el vino se bebe mezclado con mucha agua.'}],
  end:'<p>Os recostáis en los lechos, con coronas en la cabeza. Primero se vierte un poco de vino puro para el «buen genio» (Agathós Daímon); después el que preside, el simposiarca, decide cuánta agua lleva cada crátera. Beber el vino sin mezclar es cosa de bárbaros: se cuenta que el rey espartano Cleómenes enloqueció por beberlo puro, como los escitas (Heródoto 6, 84).</p><p>En el Banquete de Platón los invitados acuerdan beber con moderación para poder hablar del amor toda la noche (176a-e); en el de Jenofonte, hay música, acertijos y una bailarina. El banquete es eso: vino, conversación y amistad.</p>'},
 roma:{id:'cena',title:'Preparar una cena',meet:'domus_triclinio',meetN:'el triclinio de la domus',
  intro:'Esta noche hay cena en la domus. Repartíos el trabajo: alguien va al gran mercado por la comida, alguien al horno de la Subura por el pan, alguien a la fuente por agua y alguien a buscar al último invitado a la salida de las termas. Después, todos al triclinio.',
  roles:[{k:'comida',n:'La comida',at:'ro_macellum',t:'En el mercado de Nerón compras pescado, aceitunas, huevos y un buen trozo de cerdo.'},
         {k:'pan',n:'El pan',at:'ro_subura',t:'En un horno (pistrinum) de la Subura compras panes redondos, marcados en ocho porciones.'},
         {k:'agua',n:'El agua',at:'ro_lacus',t:'En la fuente del barrio llenas una jarra: el vino se sirve con agua, a veces caliente.'},
         {k:'invitado',n:'El último invitado',at:'ro_termas',t:'A la salida de las Termas de Tito encuentras a tu amigo… y a uno que se apunta sin que nadie lo invite. Marcial se burla de uno así, que te persigue por todas las termas hasta que lo invitas a cenar (Epigramas 12, 82).'}],
  end:'<p>Os recostáis en tres lechos alrededor de la mesa, como manda la costumbre: el triclinio. Varrón decía que los invitados no deben ser menos que las Gracias ni más que las Musas: entre tres y nueve (en Aulo Gelio, Noches áticas 13, 11, 2). Primero los entrantes con huevos, luego los platos fuertes y, al final, la fruta: «del huevo a las manzanas» (Horacio, Sátiras 1, 3, 6-7).</p><p>Antes del postre se ofrece algo a los Lares. Después, conversación, música… y algún esclavo que lee poesía.</p>'}};
function coopDef(){return COOP[MODE==='roma'?'roma':'atenas'];}
function coopAt(id){const p=(PLACES||[]).find(q=>q.id===id);return p?{x:p.x,z:p.z}:null;}
function coopz(){const s=state;if(!s.coop)s.coop={done:{}};return s.coop;}
// estado de la misión a partir de mi q y de las presencias de los demás
function coopStatus(){const D=coopDef(),r=NET.room;const peers=[];if(r)for(const p of r.peers()){if(p.sameTab)continue;const pr=p.presence||{};peers.push({n:netClean(pr.n,20)||'Alguien',x:+pr.x,z:+pr.z,q:pr.q});}
  const me={n:NET.name||'Tú',x:player.x,z:player.z,q:NET.q,me:true},all=[me,...peers].filter(p=>p.q&&p.q.m===D.id&&p.q.r);
  const roles={};for(const R of D.roles)roles[R.k]={by:[],got:false};
  for(const p of all)for(const k in p.q.r){if(!roles[k])continue;roles[k].by.push(p.n);if(p.q.r[k])roles[k].got=true;}
  const contrib=all.filter(p=>Object.values(p.q.r).some(v=>v));const allGot=D.roles.every(R=>roles[R.k].got);
  const M=coopAt(D.meet),here=M?all.filter(p=>Math.hypot(p.x-M.x,p.z-M.z)<15):[];
  return{D,roles,all,contrib,allGot,M,here,ready:allGot&&contrib.length>=2&&here.length>=all.length};}
function coopOpen(){if(!NET.room){toast('La misión de grupo es para jugar en línea: entra antes en una sala (menú › En línea).');return;}const D=coopDef();
  eduOverlay('coopBox',D.title,'<p>'+D.intro+'</p><div id="coopL"></div><p class="sub">Hace falta que colaboren al menos dos personas. Cada uno ve en su pantalla lo que han conseguido los demás.</p>');coopRender();}
function coopRender(){const L=$('coopL');if(!L)return;const S=coopStatus(),D=S.D,my=(NET.q&&NET.q.m===D.id)?NET.q.r:{};
  L.innerHTML=D.roles.map(R=>{const st=S.roles[R.k],mine=R.k in my;return '<div style="padding:8px;border:1px solid #6a4a30;border-radius:8px;margin:6px 0"><b>'+R.n+'</b> · '+(st.got?'✓ conseguido':st.by.length?'se encarga: '+st.by.join(', '):'nadie aún')+
    (mine?(my[R.k]?'':' <span class="sub">(ve al sitio marcado)</span>'):' <button data-k="'+R.k+'">Me encargo yo</button>')+'</div>';}).join('')+
    (S.allGot?'<p><b>¡Ya está todo! Reuníos en '+D.meetN+'.</b></p>':'');
  L.querySelectorAll('button[data-k]').forEach(b=>b.onclick=()=>{if(!NET.q||NET.q.m!==D.id)NET.q={m:D.id,r:{}};NET.q.r[b.dataset.k]=0;try{netPresence(true);}catch(e){}
    const R=D.roles.find(x=>x.k===b.dataset.k),p=coopAt(R.at);if(p){try{mtBeacon(p.x,p.z);MTR.beaconT=600;}catch(e){}}toast('<span class="label">'+R.n+'</span><br>Te encargas tú. Ve al sitio marcado con la columna de luz.');coopRender();});}
{const f=uxTick;uxTick=function(dt){f(dt);try{coopTick(dt);}catch(e){}};}
function coopTick(dt){if(!NET.room||!NET.q||ui!=='play')return;const D=coopDef();if(NET.q.m!==D.id)return;
  // llegar al sitio de cada papel propio
  for(const k in NET.q.r){if(NET.q.r[k])continue;const R=D.roles.find(x=>x.k===k),p=R&&coopAt(R.at);if(p&&Math.hypot(player.x-p.x,player.z-p.z)<8){NET.q.r[k]=1;try{netPresence(true);}catch(e){}
      toast('<span class="label">'+R.n+' ✓</span><br>'+R.t);try{netSay('',NET.name+': '+R.n.toLowerCase()+' ✓');}catch(e){}coopRender();}}
  NET.qt=(NET.qt||0)-dt;if(NET.qt>0)return;NET.qt=0.5;const S=coopStatus();
  if(S.allGot&&!NET.qMeet){NET.qMeet=1;if(S.M){try{mtBeacon(S.M.x,S.M.z);MTR.beaconT=900;}catch(e){}}toast('<span class="label">'+D.title+'</span><br>¡Ya está todo! Reuníos en '+D.meetN+' (columna de luz).'+(S.contrib.length<2?' Pero falta que colabore alguien más: entre todos, al menos dos.':''));coopRender();}
  if(S.ready){const z=coopz();const first=!z.done[D.id];z.done[D.id]=(z.done[D.id]||0)+1;NET.q=null;NET.qMeet=0;try{netPresence(true);}catch(e){}
    if(first){qAdd('kl',2,'El banquete ha sido un éxito.');qAdd('eu',1);}save();
    eduOverlay('coopEnd',D.title+' ✓','<p class="sub">Con '+S.all.map(p=>p.n).join(', ')+'.</p>'+D.end);}}
// botón en el panel del modo en línea
{const f=netList;netList=function(){f.apply(this,arguments);try{const h=$('netHead');if(h&&!$('coopBtn')){const b=document.createElement('button');b.id='coopBtn';b.textContent='Misión de grupo';b.style.cssText='margin-left:8px;pointer-events:auto;font:inherit;font-size:.85em;padding:2px 8px;border-radius:6px;border:1px solid #c98a4a;background:#c98a4a;color:#1e1712;cursor:pointer';b.onclick=()=>coopOpen();h.parentNode.appendChild(b);}}catch(e){}};}
