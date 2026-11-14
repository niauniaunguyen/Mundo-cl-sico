// ============================================================ PERSONAS, NO CARTELES: memoria y fama, familias y acompañantes, pleitos, comer, la fuente, el calor
// Fama: lo que haces corre de boca en boca (Hesíodo, Trabajos y días 760-764: la phḗmē «también es una diosa»; Virgilio, Eneida 4, 173-188).
// Se deduce de lo que ya guarda la partida (lecciones, favores a los dioses, capítulos, caballo, ciudadanía, casa) y de los empujones.
const MEM={t:0,gT:0};
function memz(){if(!state.memLog){state.memLog=[];const L=state.memLog;for(const id of state.lessons||[])L.push({k:'lec',r:id,d:0});
  for(const id in ((state.gods||{}).q||{}))if(state.gods.q[id]==='done')L.push({k:'god',r:id,d:0});if(state.story&&state.story.done)L.push({k:'cap',r:state.story.done,d:0});
  try{if(hz().own)L.push({k:'horse',d:0});if(cz().st>=2)L.push({k:'ciu',d:0});if(cz().st>=3)L.push({k:'casa',d:0});}catch(e){}}return state.memLog;}
function memHas(k,r){return memz().some(e=>e.k===k&&(r===undefined||e.r===r));}
function memTick(dt){if(!state||ui==='start')return;MEM.t-=dt;if(MEM.t>0)return;MEM.t=3;const L=memz(),d=state.day||1,add=(k,r)=>{if(!memHas(k,r)){L.push({k,r,d});if(L.length>60)L.shift();}};
  for(const id of state.lessons||[])add('lec',id);for(const id in ((state.gods||{}).q||{}))if(state.gods.q[id]==='done')add('god',id);
  if(state.story&&state.story.done&&!memHas('cap',state.story.done))add('cap',state.story.done);try{if(hz().own)add('horse');if(cz().st>=2)add('ciu');if(cz().st>=3)add('casa');}catch(e){}
  if((state.bumps||0)>=6&&!memHas('bump'))add('bump');
  // por la calle: alguien te reconoce
  if(ui==='play'&&performance.now()/1000-MEM.gT>120&&Math.random()<0.3){const P=player;for(const w of walkers){if(w.home||!w.g.visible||w.fol)continue;const dd=Math.hypot(w.g.position.x-P.x,w.g.position.z-P.z);if(dd<4.5&&dd>1.2){const s=memSay(true);if(s){MEM.gT=performance.now()/1000;toast('<i>«'+s+'»</i>');memFirst();}break;}}}}
function memFama(){let f=0;for(const e of memz())f+=e.k==='lec'?2:e.k==='god'?3:e.k==='cap'?2:e.k==='casa'?3:e.k==='bump'?0:1;return f-Math.min(20,Math.floor((state.bumps||0)/3));}
function memName(id){const n=(typeof NPCS!=='undefined'?NPCS:[]).find(n=>n.id===id);if(n)return n.name;const g=(typeof GODS!=='undefined'?GODS:[]).find(g=>g.id===id);return g?g.name:null;}
function memSay(street,n){const p=pjz()||{},f=p.g==='f',ro=MODE==='roma',L=memz().filter(e=>e.d>0||Math.random()<0.5).slice(-12).reverse();if(!L.length)return null;
  const heard=n?(state.seen['mm:'+n.id]||[]):[];const e=L.find(e=>!heard.includes(e.k+(e.r||'')))||null;if(!e)return null;
  const quien=f?'la que':'el que',ese=f?'esa':'ese',nm=e.r!==undefined?memName(e.r):null;let s=null;
  if(street){s=e.k==='lec'&&nm?'Mira, '+ese+' es '+(p.name||'')+', '+quien+' supo responder a '+nm+'.':e.k==='god'&&nm?'¿Ves a '+ese+'? Dicen que '+nm+' le debe un favor.':e.k==='horse'?'¡Qué caballo lleva '+ese+' forastero!'.replace('forastero',f?'forastera':'forastero'):e.k==='casa'?'Ahí va '+(f?'la nueva vecina':'el nuevo vecino')+'.':e.k==='bump'?'Cuidado, que ahí viene '+quien+' va empujando a todo el mundo.':e.k==='cap'?'Ese nombre, '+(p.name||'')+'… se oye mucho últimamente.':null;}
  else{s=e.k==='lec'&&nm?(n&&e.r===n.id?'Todavía me acuerdo de lo bien que respondiste.':'¿Tú eres '+quien+' respondió tan bien a '+nm+'? Me lo contaron en '+(ro?'las termas':'la fuente')+'.'):
    e.k==='god'&&nm?'Me han dicho que hiciste un favor a '+nm+'. Los dioses no olvidan, y nosotros tampoco.':e.k==='horse'?'Así que ahora tienes caballo… Se te ve subir en el mundo.':e.k==='ciu'?(ro?'¡Ciudadano romano! Enhorabuena: eso abre muchas puertas.':'Me dicen que la Asamblea votó un decreto en tu favor. No se ve todos los días.'):
    e.k==='casa'?'Ahora eres '+(f?'vecina':'vecino')+': ya sé que has comprado casa.':e.k==='bump'?'¿No serás tú '+quien+' va por ahí empujando a la gente? Ten más cuidado.':e.k==='cap'?'Se habla de ti: andas metido en asuntos importantes.':null;
    if(s&&n){heard.push(e.k+(e.r||''));state.seen['mm:'+n.id]=heard;}}
  return s;}
function memFirst(){if(state.seen['st:fama'])return;state.seen['st:fama']=1;toast('<span class="label">Fíjate · La fama</span><br>'+(MODE==='roma'?'En Roma todo se sabe: se habla en el foro, en las termas, en la barbería. Virgilio pinta a la Fama como un monstruo con tantos ojos, lenguas y orejas como plumas, que crece mientras corre (Eneida 4, 173-188). Lo que haces cambia cómo te tratan.':'En una ciudad griega todo se sabe: se habla en la fuente, en la barbería, en el ágora. Hesíodo avisa de que el rumor, la phḗmē, nunca muere del todo: «también ella es una diosa» (Trabajos y días 760-764). Lo que haces cambia cómo te tratan.'));}
function memGreet(n,first){if(!n||!state)return '';const F=memFama();let s='';
  if(!first&&F>=14&&Math.random()<0.5)s='<p class="sub">Te recibe con una sonrisa de verdad: «¡'+(pjz()||{}).name+'! Siempre es un gusto verte».</p>';
  else if(F<0&&Math.random()<0.6){s='<p class="sub">Te mira con desconfianza: «Ah… tú».</p>';setTimeout(()=>{try{const g=GS.dlgG;if(g&&g.userData.gs)gzExpr(g.userData.gs,'enfado',3);}catch(e){}},300);}
  if(Math.random()<0.45){const r=memSay(false,n);if(r){s+='<p class="sub">«'+r+'»</p>';memFirst();}}return s;}
// ---- familias y acompañantes: el niño con su madre o su pedagogo; el amo con un esclavo detrás
const FAM={t:0,n:0,argT:60,arg:null,lT:0,li:0};
const FAM_ARG={a:[['¡Esa higuera está en mi lado de la linde!','¡Mentira! La plantó mi abuelo.'],['¡Tu cabra se ha vuelto a comer mis coles!','¡Pues cierra tu huerto como es debido!'],['¡Me debes tres dracmas desde las Dionisias!','¡Te las pagué, y hay testigos!'],['¡Te veré ante los jueces!','¡Y yo a ti, sicofanta!']],
  r:[['¡El agua de tu tejado cae en mi patio!','¡Siempre ha caído ahí, y la ley me da la razón!'],['¡Tu gallo canta antes del alba!','¡Y tu perro ladra toda la noche!'],['¡Esas ramas tuyas me quitan la luz!','¡Pues pódalas tú, si te atreves!'],['¡In ius te voco! ¡Ante el pretor!','¡Vamos, vamos, que te conviene!']]};
Object.assign(ST_TXT,{
 pedagogo:MODE==='roma'?['El pedagogo','El niño no va solo al ludus del maestro: lo acompaña el paedagogus, a menudo un esclavo griego, que le lleva las tablillas, vigila sus modales y le enseña griego.']:['El pedagogo','El niño no va solo a la escuela: lo acompaña un esclavo de confianza, el paidagogós («el que conduce al niño»), que le lleva las tablillas y vigila sus modales. De ahí viene nuestra palabra pedagogo.'],
 acolito:MODE==='roma'?['El pedisecuo','Ningún romano acomodado sale solo: detrás va un esclavo, el pedisequus («el que sigue a pie»), con lo que haga falta. Cuantos más acompañantes, más importante pareces.']:['El acólito','El akólouthos («el que sigue») es el esclavo que acompaña a su amo por la calle y le lleva las cosas, como Jantias carga con el equipaje de Dioniso en las Ranas de Aristófanes.'],
 pleito:MODE==='roma'?['Pleitos entre vecinos','Las Doce Tablas, la ley más antigua de Roma, ya regulaban las peleas de vecinos: las ramas que dan sombra al campo ajeno, la fruta que cae al otro lado, el agua de lluvia. «In ius vocare» es citar a alguien ante el pretor.']:['Pleitos entre vecinos','Los atenienses tienen fama de pleiteadores. En las Nubes de Aristófanes, a un campesino le enseñan Atenas en un mapa y no se lo cree: «¡No veo jueces sentados!» (v. 207-208).'],
 fuente:MODE==='roma'?['La fuente del barrio','En Roma casi nadie tiene agua corriente en casa: se va a los lacus, las fuentes de los barrios que alimentan los acueductos. Frontino, que dirigirá las aguas de Roma en el 97, contará 591 (De aquaeductu 78).']:['La fuente','Ir a la fuente con la hidria es tarea de mujeres y esclavas, cada mañana y cada tarde. Es uno de los pocos sitios donde las atenienses se encuentran y charlan fuera de casa: los vasos pintados lo muestran a menudo.'],
 almuerzo:MODE==='roma'?['El prandium','A mediodía, un bocado rápido: pan, queso, fruta o las sobras de la víspera, muchas veces de pie, en la calle o en una popina. La comida importante es la cena, a partir de la hora nona.']:['El áriston','A mediodía se toma algo ligero, el áriston: pan o torta de cebada (maza), queso, aceitunas, higos. La comida fuerte es la cena, el deîpnon, al caer la tarde.'],
 calor:MODE==='roma'?['La siesta','En verano, después del prandium llega la meridiatio: la ciudad se para y quien puede busca la sombra de los pórticos. «La hora sexta es el descanso de los cansados», dice Marcial (Epigramas 4, 8).']:['El calor del mediodía','En verano, a mediodía, la ciudad va más despacio: quien puede busca la sombra de las stoas, los pórticos del ágora, hechos precisamente para eso. Ahí se charla y se filosofa: de la Stoa Pintada tomarán su nombre los estoicos.']});
function famLink(f,l,kind,off){f.fol=l;f.foff=off;f.wait=1e9;f.moving=false;l.lead=(l.lead||0)+1;f.fkind=kind;const P=player,far=Math.hypot(l.g.position.x-P.x,l.g.position.z-P.z)>45;
  if(far){const a=l.g.rotation.y;f.g.position.set(l.g.position.x+Math.cos(a)*off[0]+Math.sin(a)*off[1],0,l.g.position.z-Math.sin(a)*off[0]+Math.cos(a)*off[1]);f.g.position.y=terrainH(f.g.position.x,f.g.position.z);}
  stFeat(kind==='kid'?l.g:f.g,kind==='kid'?(l.g.userData.bt||'').match(/anciano/)||!/P_hair_m/.test([...bvParts(l.g)].join())?'madre':'pedagogo':'acolito');FAM.n++;}
function famForm(){const P=player,mv=walkers.filter(w=>!w.home&&w.g&&w.bv&&w.speed>0&&!w.fol&&!w.lead&&Math.hypot(w.g.position.x-P.x,w.g.position.z-P.z)<400);
  const kids=mv.filter(w=>/^niño$/.test(w.g.userData.bt||'')),adults=mv.filter(w=>!w.g.userData.bt||w.g.userData.bt==='grueso'||w.g.userData.bt==='flaco');
  for(const k of kids){if(FAM.n>=14)break;let b=null,bd=180;for(const a of adults){if(a.lead||a.fol)continue;const d=Math.hypot(a.g.position.x-k.g.position.x,a.g.position.z-k.g.position.z);if(d<bd){bd=d;b=a;}}if(b)famLink(k,b,'kid',[0.75,0.15]);}
  const slaves=mv.filter(w=>!w.lead&&!w.fol&&!w.g.userData.bt&&(()=>{const s=bvParts(w.g);return s.has('P_tunic_short')||s.has('P_basket')||s.has('P_amphora');})());
  const rich=mv.filter(w=>!w.lead&&!w.fol&&!/^niño/.test(w.g.userData.bt||'')&&(()=>{const s=bvParts(w.g);return !s.has('P_tunic_short')&&!s.has('P_hydria')&&!s.has('P_basket')&&!s.has('P_amphora')&&(MODE==='roma'?(s.has('P_toga')||s.has('P_hair_m')):s.has('P_himation_m'));})());
  for(const s of slaves){if(FAM.n>=22||!rich.length)break;const r=rich.find(r=>!r.lead&&Math.hypot(r.g.position.x-s.g.position.x,r.g.position.z-s.g.position.z)<200);if(r)famLink(s,r,'slave',[0.35,-1.4]);}}
function famTick(dt){if(!state||ui==='start')return;FAM.t-=dt;if(FAM.t<=0){FAM.t=4;try{famForm();}catch(e){}}const P=player;
  for(const w of walkers){const l=w.fol;if(!l)continue;const g=w.g;w.home=l.home;if(l.home){g.visible=false;continue;}if(!l.g.visible){g.visible=false;continue;}g.visible=true;
    const dx0=g.position.x-P.x,dz0=g.position.z-P.z;if(dx0*dx0+dz0*dz0>160*160)continue;
    const a=l.g.rotation.y,tx=l.g.position.x+Math.cos(a)*w.foff[0]+Math.sin(a)*w.foff[1],tz=l.g.position.z-Math.sin(a)*w.foff[0]+Math.cos(a)*w.foff[1],dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);
    if(d>25){g.position.x=tx;g.position.z=tz;g.position.y=terrainH(tx,tz);continue;}
    if(d>0.3){const sp=Math.max(l.speed*1.2,1.1)*(d>2?1.6:1),st=Math.min(d,sp*dt);if(!npcStep(g,dx/d,dz/d,st)){g.position.x+=dx/d*st;g.position.z+=dz/d*st;}g.position.y=terrainH(g.position.x,g.position.z);
      w.ph=(w.ph===undefined?w.phase:w.ph)+st*4.6*(w.sf||1);g.rotation.y+=wrapA(Math.atan2(dx,dz)-g.rotation.y)*Math.min(1,dt*6);personWalk(g,w.ph,1);w.fmv=1;}
    else{if(w.fmv){w.fmv=0;personWalk(g,0,0);}g.rotation.y+=wrapA(a-g.rotation.y)*Math.min(1,dt*3);}}
  // pleitos: de vez en cuando, una pareja de un corrillo cercano se pone a discutir
  FAM.argT-=dt;const A=FAM.arg;
  if(!A&&FAM.argT<=0){FAM.argT=20;for(const w of walkers){if(!w.pal||!w.spk||!w.g.visible)continue;const d=Math.hypot(w.g.position.x-P.x,w.g.position.z-P.z);if(d<20&&d>3){FAM.arg={a:w,b:w.pal,t:16,c:0,s:0,L:FAM_ARG[MODE==='roma'?'r':'a'][Math.floor(Math.random()*4)],li:0,lT:1};FAM.argT=150+Math.random()*120;break;}}}
  if(A){A.t-=dt;A.c-=dt;A.lT-=dt;const ok=A.a.pal===A.b&&A.a.g.visible;if(!ok||A.t<=0){for(const w of[A.a,A.b]){const gs=w.g.userData.gs;if(gs){gsRest(gs);gs.ct=1;}}FAM.arg=null;}
    else{for(const w of[A.a,A.b]){const gs=gsRig(w.g);gs.ct=2;}if(A.c<=0){A.c=1.1;A.s^=1;const sp=A.s?A.a:A.b,ls=A.s?A.b:A.a,g1=sp.g.userData.gs,g2=ls.g.userData.gs;gsSet(g1,['alto','senala','palmas'][Math.floor(Math.random()*3)],1.25);gzExpr(g1,'enfado',2);gsSet(g2,'pecho',0.9);gzExpr(g2,'enfado',2);}
      const d=Math.hypot(A.a.g.position.x-P.x,A.a.g.position.z-P.z);if(A.lT<=0&&A.li<2&&d<14){A.lT=5;toast('<i>«'+A.L[A.li]+'»</i>');A.li++;stFeat(A.a.g,'pleito');}}}}
// ---- necesidades: comer a mediodía, ir a la fuente con la hidria, el calor del verano
GSET.comer=[0,0,-0.75,-0.3,0.1,0,0,-2.45];GSET.abanico=[0,0,-0.55,0.35,0,0.05,0,-2.1];
const NEED={t:0,fz:null,hot:false};
function needFountains(){if(NEED.fz&&NEED.fm===MODE)return NEED.fz;NEED.fm=MODE;const ids=(MODE==='roma'?ZS_R:ZS_A).agua;NEED.fz=PLACES.filter(q=>ids.includes(q.id)||/^fuente_ciudad/.test(q.id));return NEED.fz;}
function needBread(g,on){const a=g.userData.arms&&g.userData.arms[1];if(!a)return;let m=g.userData.bread;if(on&&!m){g.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(a),sy=g.scale.y||1,hy=(b.min.y-g.position.y)/sy;if(!(hy>0.4&&hy<1.2))return;
    m=new THREE.Mesh(NEED.bg||(NEED.bg=new THREE.SphereGeometry(0.055,8,6)),lam('#c8954e'));m.scale.set(1.2,0.7,1);m.position.set(0,hy-a.position.y+0.04,0.05);m.userData.keep=1;const gs=g.userData.gs,f=gs&&gs.fore&&gs.fore[1];if(f){m.position.x-=f.position.x;m.position.y-=f.position.y;m.position.z-=f.position.z;f.add(m);}else a.add(m);g.userData.bread=m;}
  else if(!on&&m){m.parent&&m.parent.remove(m);g.userData.bread=null;}}
function needTick(dt){if(!state||ui==='start')return;const h=clock.h,P=player,t=performance.now()/1000,day=state.day||1,inside=typeof CASA!=='undefined'&&CASA.inside;
  NEED.t-=dt;const scan=NEED.t<=0;if(scan)NEED.t=1.5;const lunch=h>=11.5&&h<14,hot=seasonOn==='ver'&&h>=12&&h<16.5&&!inside,water=(h>=6.5&&h<10)||(h>=17&&h<19.5);
  if(hot!==NEED.hot){NEED.hot=hot;for(const w of walkers){if(w.fol)continue;if(w.spd0===undefined)w.spd0=w.speed;w.speed=w.spd0*(hot?0.72:1);}}
  for(const w of walkers){if(w.home||!w.g.visible||w.fol)continue;const g=w.g,u=g.userData,dx=g.position.x-P.x,dz=g.position.z-P.z,d2=dx*dx+dz*dz;
    // la fuente
    if(scan&&water&&w.speed>0&&w.fq!==day&&bvParts(g).has('P_hydria')&&d2<300*300){w.fq=day;let b=null,bd=260;for(const q of needFountains()){const dd=Math.hypot(q.x-g.position.x,q.z-g.position.z);if(dd<bd){bd=dd;b=q;}}if(b){w.fgo=b;w.tx=b.x+(Math.random()-0.5)*3;w.tz=b.z+(Math.random()-0.5)*3;w.wait=0;}}
    if(w.fgo){w.tx=w.fgo.x+((w.phase*7)%3-1.5);w.tz=w.fgo.z+((w.phase*13)%3-1.5);if(Math.hypot(g.position.x-w.tx,g.position.z-w.tz)<1.6||!water){if(water){w.wait=7+Math.random()*7;stFeat(g,'fuente');}w.fgo=null;}}
    if(d2>26*26)continue;
    const idle=!w.moving&&(w.wait>0||w.speed===0);
    // comer
    if(scan){const want=lunch&&idle&&!w.pal&&(w.eatD===day?w.eat:Math.random()<0.3);if(lunch&&idle&&w.eatD!==day){w.eatD=day;w.eat=want;}if(!lunch)w.eat=false;
      if(w.eat&&!u.bread){gsRig(g);GS.list.add(g);needBread(g,true);stFeat(g,'almuerzo');}else if(!w.eat&&u.bread)needBread(g,false);}
    const gs=u.gs;if(!gs||!idle||w.pal)continue;
    if(w.eat){w.eT=(w.eT||Math.random()*3)-dt;if(w.eT<=0){w.eT=3+Math.random()*3;gs.react=1.2;gsSet(gs,'comer',1,true);}}
    else if(hot){w.hT=(w.hT===undefined?Math.random()*8:w.hT)-dt;if(w.hT<=0){w.hT=8+Math.random()*10;gs.react=2.4;gs.fan=2.4;gsSet(gs,'abanico',1,true);stFeat(g,'calor');}if(gs.fan>0){gs.fan-=dt;gs.tgt.rz=GSET.abanico[3]+Math.sin(t*9)*0.18;}}}}
