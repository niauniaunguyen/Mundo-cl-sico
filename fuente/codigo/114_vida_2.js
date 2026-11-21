// ============================================================ VIDA 2: una ciudad menos estática
// Corros de gente que charla con gestos, paseantes con carga, reacciones al jugador (quejas si chocas, saludos por tu nombre
// cuando ya te conocen), personajes que respiran y te miran, sucesos espontáneos (ladrón, pregonero, riña, mensajero),
// pájaros que se espantan, y cosas que hacer con las manos: comer en un puesto, llevar un ánfora de encargo y sentarse a mirar.
const VIV={t:0,circ:[],evt:null,cd:35,fed:0,carry:null,sit:false,eye0:null,lab:[],propsDone:false,npcT:0,bumpG:0,vend:[]};
function v2City(){const x=player.x,z=player.z;if(x>8000)return false;try{return MODE==='roma'?romaInUrbs(x,z):insideWalls(x,z);}catch(e){return false;}}
function v2Day(){return clock.h>6.5&&clock.h<19.5;}
function v2Spd(){return(VIV.fed>performance.now()?1.1:1)*(VIV.carry?0.82:1);}
function v2Say(x,y,z,txt,ms){const sp=labelSprite(txt,'',false);sp.position.set(x,y,z);scene.add(sp);VIV.lab.push({sp,until:performance.now()+(ms||2200)});return sp;}
function v2Free(x,z){const f=findFree(x,z,0.8);return f&&terrainH(f[0],f[1])>0.3?f:null;}
function v2Person(look,x,z){const g=makePerson(look);g.position.set(x,floorAt(x,z),z);scene.add(g);return g;}
// ---- cargas: algunos paseantes llevan un ánfora al hombro o una cesta en la cabeza
function v2Props(){if(VIV.propsDone||!walkers.length)return;VIV.propsDone=true;const jar=PGEO&&PGEO.jar;
  for(const w of walkers){if(w.mode!=='road'&&w.mode!=='agora')continue;const r=R();
    if(r<0.14&&jar){const a=new THREE.Mesh(jar,lam('#b5603a'));a.scale.setScalar(0.5);a.position.set(0.24,1.5,0.02);a.rotation.z=0.7;w.g.add(a);}
    else if(r<0.24){const b=new THREE.Mesh(new THREE.CylinderGeometry(0.26,0.2,0.22,10),lam('#a8875a'));b.position.set(0,1.86,0);w.g.add(b);
      for(let i=0;i<4;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.07,6,5),lam(pick(['#6a8a3a','#a8392b','#d8a83a','#5a3a6a'])));f.position.set(rr(-0.12,0.12),1.99,rr(-0.12,0.12));w.g.add(f);}}}}
// ---- corros: dos o tres paseantes se paran a charlar, mirándose y gesticulando
function v2Circles(dt){const now=performance.now();
  if(VIV.circ.length<3&&R()<dt*0.5){const cand=walkers.filter(w=>!w.home&&w.g.visible&&!w.v2c&&!w.barks&&(w.mode==='road'||w.mode==='agora')&&Math.hypot(w.g.position.x-player.x,w.g.position.z-player.z)<70);
    if(cand.length>1){const a=pick(cand),grp=[a];for(const w of cand){if(w!==a&&grp.length<3&&Math.hypot(w.g.position.x-a.g.position.x,w.g.position.z-a.g.position.z)<14)grp.push(w);}
      if(grp.length>1){const cx=grp.reduce((s,w)=>s+w.g.position.x,0)/grp.length,cz=grp.reduce((s,w)=>s+w.g.position.z,0)/grp.length,C={cx,cz,ws:grp,until:now+rr(14000,30000),sp:0,spT:0};
        grp.forEach((w,i)=>{const t=i/grp.length*TAU+R();w.v2c=C;w.v2p=[cx+Math.cos(t)*0.95,cz+Math.sin(t)*0.95];w.wait=999;});VIV.circ.push(C);}}}
  for(let k=VIV.circ.length-1;k>=0;k--){const C=VIV.circ[k];const done=now>C.until||C.ws.some(w=>w.home);
    if(done){C.ws.forEach(w=>{w.v2c=null;w.wait=R()*2;armUp(w.g,0,0);});VIV.circ.splice(k,1);continue;}
    C.spT-=dt;if(C.spT<=0){C.spT=rr(1.8,3.2);C.sp=(C.sp+1)%C.ws.length;}
    C.ws.forEach((w,i)=>{const g=w.g,[tx,tz]=w.v2p,dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);
      if(d>0.15){const st=Math.min(d,1.1*dt);g.position.x+=dx/d*st;g.position.z+=dz/d*st;g.position.y=terrainH(g.position.x,g.position.z);w.ph=(w.ph||0)+st*4.6;personWalk(g,w.ph,1);g.rotation.y=Math.atan2(dx,dz);}
      else{personWalk(g,0,0);const ta=Math.atan2(C.cx-g.position.x,C.cz-g.position.z);g.rotation.y+=wrapA(ta-g.rotation.y)*Math.min(1,dt*4);
        if(i===C.sp)armUp(g,-0.5-Math.abs(Math.sin(now/300+i))*0.6,-0.2-Math.abs(Math.sin(now/410+i))*0.5);else armUp(g,0,0);}});}}
// ---- reacciones: si chocas corriendo se quejan; cuando ya te conocen, te saludan por tu nombre
const V2_QUEJA={A:['¡Eh! ¡Mira por dónde vas!','¡Cuidado, bárbaro!','¡Por el perro! ¡Más despacio!','¿Es que no tienes ojos?'],R:['¡Eh, cuidado!','¡Mira por dónde andas!','¡Por Hércules, más despacio!','¿Vas a apagar un incendio?']};
function v2Bump(){const now=performance.now();if(now<VIV.bumpG)return;const fast=keys.run||MOUNT.riding;if(!fast)return;
  for(const w of walkers){if(w.home||!w.g.visible)continue;const g=w.g,d=Math.hypot(g.position.x-player.x,g.position.z-player.z);if(d>1.25||(w.bumpT&&now<w.bumpT))continue;
    w.bumpT=now+20000;VIV.bumpG=now+3500;g.rotation.y=Math.atan2(player.x-g.position.x,player.z-g.position.z);armUp(g,null,-2.2);setTimeout(()=>armUp(g,0,0),1400);
    v2Say(g.position.x,g.position.y+2.5,g.position.z,pick(V2_QUEJA[MODE==='roma'?'R':'A']),1900);if(w.wait!==undefined)w.wait=Math.max(w.wait,1.5);return;}}
function v2Greet(){const fame=(state.lessons||[]).length+(state.places||[]).length/4,nm=state.pj&&state.pj.name;
  if(nm&&fame>=6&&R()<0.55)return pick(MODE==='roma'?['¡Salve, '+nm+'!','¡Ave, '+nm+'! ¿Qué tal te va?','¡'+nm+'! Te vi el otro día en el Foro']:['¡Salud, '+nm+'!','¡Alégrate, '+nm+'!','¡'+nm+'! ¿Vienes del Ágora?']);
  return pick(SAL[MODE==='roma'?'R':'A']);}
// ---- personajes principales: respiran, miran alrededor y se giran hacia ti
function v2Npcs(dt){const now=performance.now()/1000;
  for(const n of npcObjs){const g=n.g;if(!g||n.hidden||!g.visible)continue;const d=Math.hypot(n.x-player.x,n.z-player.z);if(d>30)continue;
    if(n.rtWalk)continue;if(n.v2r===undefined){n.v2r=g.rotation.y;n.v2ph=R()*10;}
    g.scale.y=1+Math.sin(now*1.6+n.v2ph)*0.007;
    let ta=n.v2r;if(d<7)ta=Math.atan2(player.x-n.x,player.z-n.z);else{const s=Math.sin(now*0.23+n.v2ph);if(s>0.6)ta=n.v2r+0.6;else if(s<-0.6)ta=n.v2r-0.5;}
    g.rotation.y+=wrapA(ta-g.rotation.y)*Math.min(1,dt*2.2);}}
// ---- sucesos espontáneos (de día, en la ciudad)
const V2_NEWS={A:['¡Oíd, atenienses! La asamblea se reúne pasado mañana en la Pnyx.','¡Ha llegado una carta del Gran Rey: la paz vale para todos los griegos!','¡Evágoras de Chipre resiste todavía a los persas!','¡Ifícrates y sus peltastas vuelven de Corinto!','¡Mañana hay carreras de antorchas en la fiesta!','¡Se busca esclavo huido: se llama Sirisco, tiene una cicatriz en la frente!'],
 R:['¡Oíd, quirites! El emperador Tito vuelve de Campania, donde ayuda a los que perdieron todo en el Vesubio.','¡Mañana hay reparto de trigo en el Pórtico de Minucio!','¡En el anfiteatro nuevo habrá cien días de juegos!','¡Se ha perdido un esclavo: se llama Felicio, responde por su amo Gavio!','¡Los ediles prohíben tirar basuras a la calle desde las ventanas!']};
const V2_RINA={A:[['¡Me has vendido el pescado podrido!','¡Mentira! ¡Estaba fresco esta mañana!'],['¡Ese asno es mío!','¡Lo compré en Mégara, tengo testigos!'],['¡Tu cabra se ha comido mis coles!','¡Pues vigila tu huerto!']],
 R:[['¡Me debes tres denarios desde las Saturnales!','¡Te los pago en los idus, lo juro por Mercurio!'],['¡Tu carro me ha manchado la toga!','¡Pues no te pongas en medio!'],['¡Ese sitio del puesto es mío!','¡Aquí estaba yo antes del amanecer!']]};
function v2Event(dt){if(VIV.evt){v2EvtTick(VIV.evt,dt);return;}if(!v2City()||!v2Day()||ui!=='play')return;VIV.cd-=dt;if(VIV.cd>0)return;VIV.cd=rr(60,120);
  const k=pick(['ladron','pregon','rina','mensajero']),a=R()*TAU,d=rr(16,28),p=v2Free(player.x+Math.cos(a)*d,player.z+Math.sin(a)*d);if(!p)return;
  const E={k,t:0,objs:[],x:p[0],z:p[1]};const ro=MODE==='roma';
  if(k==='ladron'){const dir=Math.atan2(player.x-p[0],player.z-p[1])+rr(-0.6,0.6);E.dx=Math.sin(dir);E.dz=Math.cos(dir);
    E.th=v2Person({short:true,noHimation:true,chiton:'#7a6a52',hair:'#2a1e16'},p[0],p[1]);E.me=v2Person({chiton:'#d8c9a8',himation:'#7a2a3a',beard:true,hair:'#5a4a3a'},p[0]-E.dx*6,p[1]-E.dz*6);
    const bread=new THREE.Mesh(new THREE.SphereGeometry(0.16,8,6),lam('#c98a4a'));bread.scale.set(1.4,0.8,1);bread.position.set(0.3,1.05,0.2);E.th.add(bread);E.bread=bread;E.objs.push(E.th,E.me);E.sh=0;}
  else if(k==='pregon'){E.g=v2Person(ro?{toga:true,chiton:'#efe9dc',himation:'#f3eee2',hair:'#5a4a3a'}:{chiton:'#efe6d4',himation:'#4f6a7d',beard:true,hair:'#6a5a4a',staff:true},p[0],p[1]);E.g.rotation.y=Math.atan2(player.x-p[0],player.z-p[1]);E.objs.push(E.g);
    E.lines=[pick(V2_NEWS[ro?'R':'A']),pick(V2_NEWS[ro?'R':'A'])];E.li=0;E.lt=0;
    for(const w of walkers){if(w.home||!w.g.visible||w.v2c)continue;if(Math.hypot(w.g.position.x-p[0],w.g.position.z-p[1])<25&&R()<0.6){w.wait=Math.max(w.wait||0,14);w.v2listen=p;}}}
  else if(k==='rina'){const ang=R()*TAU,o=[Math.cos(ang)*0.75,Math.sin(ang)*0.75];E.a=v2Person({chiton:'#c9b48b',himation:'#5a4a3a',beard:true,hair:'#3a2a1e'},p[0]+o[0],p[1]+o[1]);E.b=v2Person({chiton:'#a89070',himation:'#8a3f2f',beard:R()<0.6,hair:'#2a1e16'},p[0]-o[0],p[1]-o[1]);
    E.a.rotation.y=Math.atan2(-o[0],-o[1]);E.b.rotation.y=Math.atan2(o[0],o[1]);E.objs.push(E.a,E.b);E.lines=pick(V2_RINA[ro?'R':'A']);E.li=0;E.lt=0;}
  else{const dir=Math.atan2(player.x-p[0],player.z-p[1]);E.dx=Math.sin(dir);E.dz=Math.cos(dir);E.g=v2Person({short:true,noHimation:true,chiton:'#efe6d4',hair:'#4a3020'},p[0],p[1]);E.objs.push(E.g);E.said=0;}
  VIV.evt=E;}
function v2EvtTick(E,dt){E.t+=dt;const now=performance.now(),ro=MODE==='roma',end=()=>{for(const o of E.objs)scene.remove(o);VIV.evt=null;};
  if(E.k==='ladron'){const run=(g,sp,ph)=>{if(!npcStep(g,E.dx,E.dz,sp*dt)){const a=Math.atan2(E.dz,E.dx)+(R()<0.5?1:-1)*rr(0.8,1.6);E.dx=Math.cos(a);E.dz=Math.sin(a);}g.position.y=floorAt(g.position.x,g.position.z);g.rotation.y=Math.atan2(E.dx,E.dz);E[ph]=(E[ph]||0)+sp*dt*3.2;personWalk(g,E[ph],1.4);};
    if(!E.caught){run(E.th,4.4,'p1');run(E.me,3.7,'p2');E.sh-=dt;if(E.sh<=0){E.sh=2.6;v2Say(E.me.position.x,E.me.position.y+2.6,E.me.position.z,ro?'¡Al ladrón! ¡Detenedlo!':'¡Al ladrón! ¡Que alguien lo pare!',1800);}
      if(Math.hypot(E.th.position.x-player.x,E.th.position.z-player.z)<2.2){E.caught=E.t;E.th.remove(E.bread);E.bread.position.set(E.th.position.x,floorAt(E.th.position.x,E.th.position.z)+0.1,E.th.position.z);scene.add(E.bread);E.objs.push(E.bread);
        state.obols+=2;save();updateStats();sfxCoin();v2Say(E.me.position.x,E.me.position.y+2.6,E.me.position.z,ro?'¡Gracias! Toma, por la molestia.':'¡Gracias, forastero! Que los dioses te lo paguen.',2600);
        toast('<span class="label">Has detenido al ladrón</span><br>'+(ro?'El panadero te da 2 sestercios. En Roma no había policía: cada uno perseguía a su ladrón, y si lo cogía lo llevaba ante el magistrado.':'El tendero te da 2 óbolos. En Atenas no había policía: el robado gritaba «¡al ladrón!» y los vecinos ayudaban a atraparlo; los Once juzgaban a los ladrones cogidos con las manos en la masa.'));}}
    else{run(E.th,5,'p1');personWalk(E.me,0,0);}
    if(E.t>(E.caught?E.caught+4:16))end();}
  else if(E.k==='pregon'){E.lt-=dt;if(E.lt<=0&&E.li<E.lines.length){E.lt=6;armUp(E.g,null,-2.6);v2Say(E.g.position.x,E.g.position.y+2.7,E.g.position.z,E.lines[E.li++],5600);}
    for(const w of walkers){if(w.v2listen){const ta=Math.atan2(w.v2listen[0]-w.g.position.x,w.v2listen[1]-w.g.position.z);w.g.rotation.y+=wrapA(ta-w.g.rotation.y)*Math.min(1,dt*3);}}
    if(E.t>13){for(const w of walkers)if(w.v2listen){w.v2listen=null;w.wait=R()*2;}end();}}
  else if(E.k==='rina'){E.lt-=dt;if(E.lt<=0&&E.li<4){E.lt=2.8;const g=E.li%2?E.b:E.a;armUp(g,-1.1,-1.6);setTimeout(()=>armUp(g,0,0),1500);v2Say(g.position.x,g.position.y+2.6,g.position.z,E.lines[E.li%2],2500);E.li++;}
    if(E.t>12){const g=E.b;g.rotation.y+=Math.PI*dt;g.position.x+=Math.sin(g.rotation.y)*2*dt;g.position.z+=Math.cos(g.rotation.y)*2*dt;g.position.y=floorAt(g.position.x,g.position.z);E.ph=(E.ph||0)+dt*6;personWalk(g,E.ph,1);}
    if(E.t>16)end();}
  else{const g=E.g;g.position.x+=E.dx*4.6*dt;g.position.z+=E.dz*4.6*dt;g.position.y=floorAt(g.position.x,g.position.z);g.rotation.y=Math.atan2(E.dx,E.dz);E.ph=(E.ph||0)+dt*15;personWalk(g,E.ph,1.4);
    if(!E.said&&E.t>1){E.said=1;v2Say(g.position.x,g.position.y+2.6,g.position.z,ro?'¡Noticias de Campania! ¡Paso, paso!':'¡Noticias de Corinto! ¡Abrid paso!',2400);}
    if(E.t>9)end();}}
// ---- pájaros que se espantan al acercarte
function v2Birds(dt){if(typeof AMB2==='undefined'||!AMB2.birds)return;for(const B of AMB2.birds){if(!B.b||!B.b.g.visible)continue;const g=B.b.g;
  if(!B.fly&&Math.hypot(B.cx-player.x,B.cz-player.z)<4.5){const a=Math.atan2(B.cz-player.z,B.cx-player.x);B.fly={t:0,dx:Math.cos(a),dz:Math.sin(a),y0:g.position.y};}
  if(B.fly){B.fly.t+=dt;const t=B.fly.t;g.position.set(B.cx+B.fly.dx*t*7,B.fly.y0+t*4.5,B.cz+B.fly.dz*t*7);if(t>1.6){B.cx+=B.fly.dx*14;B.cz+=B.fly.dz*14;B.fly=null;}}}}
// ---- sentarse a mirar (tecla O): la cámara baja y el tiempo pasa más deprisa mientras miras la vida de la calle
function v2Sit(){if(ui!=='play'||FLY.on||BOAT.on||MOUNT.riding)return;VIV.sit=!VIV.sit;
  if(VIV.sit){VIV.eye0=player.eye;player.eye=Math.max(0.9,player.eye-0.7);toast('<span class="label">Te sientas a descansar</span><br>Mira la vida de la calle. Muévete para levantarte. El tiempo pasa más deprisa mientras descansas.');}
  else v2Stand();}
function v2Stand(){if(!VIV.sit)return;VIV.sit=false;if(VIV.eye0)player.eye=VIV.eye0;}
// ---- comer en un puesto y llevar ánforas de encargo
const V2_FOOD={A:[['Una torta de cebada (maza) con queso','La maza, una masa de cebada sin cocer, era el pan de cada día; el trigo era más caro.'],['Higos secos y un puñado de aceitunas','Los higos del Ática eran famosos; estaba prohibido exportarlos, dicen, y de ahí vendría la palabra «sicofanta».'],['Un pescado frito de Falero','El pescado era el gran capricho de los atenienses: los cómicos se burlan de los que se arruinaban por él.'],['Vino mezclado con agua','Beber vino puro era cosa de bárbaros: los griegos lo mezclaban siempre, a menudo tres partes de agua por una de vino.']],
 R:[['Pan con queso y aceitunas','En la Roma del 80 había cientos de panaderías; los pobres recibían cada mes trigo gratis del Estado.'],['Un cuenco de puls','La puls, una papilla de trigo o de habas, era la comida de los romanos antiguos y de los pobres.'],['Una salchicha lucanica','Salchichas ahumadas al estilo de Lucania: se vendían en las tabernas y por la calle.'],['Un vaso de posca','Agua con vinagre: la bebida de los soldados y de los pobres. Quita la sed mejor que el vino.']]};
function v2VendorSetup(){VIV.vend.length=0;const ro=MODE==='roma';const spots=ro?[['ro_subura',10,-8],['ro_circo',-24,22],['ro_emporio',12,10]]:[['mercado',8,6],['pir_agora',8,8],['dipilon',-14,-10]];
  for(const[id,dx,dz]of spots){const f=artAnchor(id,dx,dz);if(!f)continue;const i=VIV.vend.length;VIV.vend.push({x:f[0],z:f[1]});
    artPerson(f,ro?{chiton:'#c9b48b',himation:'#8a5a3a',hair:'#3a2a1e',beard:true}:{chiton:'#d8c9a8',himation:'#6a4d3a',beard:true,hair:'#4a3a2a'},'v2:food:'+i,ro?'Tabernero':'Vendedor de comida',ro?'comida caliente y bebida':'tortas, higos y pescado',3);
    const s=box(1.8,0.9,0.8,M.wood,f[0]+1.4,floorAt(f[0]+1.4,f[1])+0.45,f[1]);addBox(f[0]+1.4,f[1],1.8,0.8,0);}
  const f=artAnchor(ro?'ro_emporio':'pir_agora',-10,6);if(f)artPerson(f,{short:true,noHimation:true,chiton:'#a89070',hair:'#2a1e16',beard:true},'v2:anfora',ro?'Capataz del muelle':'Capataz del puerto','busca porteadores',3);}
function v2Act(o){const k=String(o.act).slice(3),ro=MODE==='roma',mon=ro?'sestercio':'óbolo';
  if(k.startsWith('food')){const one=casaOpen('🍞',ro?'Tabernero':'Vendedor de comida',ro?'comida caliente y bebida':'tortas, higos y pescado'),B=$('dBody');
    const menu=()=>{$('dOpts').innerHTML='';B.innerHTML='<p>'+(ro?'«¡Pasa, pasa! Hoy tengo de todo, y barato.»':'«¡Acércate, forastero! Todo fresco de esta mañana.»')+'</p>';
      V2_FOOD[ro?'R':'A'].forEach(([n,info])=>one(n+' (1 '+mon+')',()=>{if(state.obols<1){B.innerHTML='<p>«Sin dinero no hay comida, amigo.»</p>';return;}state.obols-=1;save();updateStats();sfxCoin();VIV.fed=performance.now()+180000;
        $('dOpts').innerHTML='';B.innerHTML='<p>Comes de pie junto al puesto, como casi todo el mundo. Te sientes con fuerzas: durante un rato caminarás más ligero.</p><p class="sub">'+info+'</p>';one('Volver',menu);one('Adiós',()=>closeDialog());},'quiz'));one('Adiós',()=>closeDialog());};menu();return;}
  if(k==='anfora'){const one=casaOpen('⚱',ro?'Capataz del muelle':'Capataz del puerto','busca porteadores'),B=$('dBody');$('dOpts').innerHTML='';
    const dests=(ro?['ro_subura','ro_circo','ro_foro','ro_termas']:['mercado','ceramico','eleusinion','pompeion']).filter(id=>PLACES.find(q=>q.id===id));
    if(VIV.carry){B.innerHTML='<p>«¿Todavía aquí? ¡El ánfora tiene que llegar a '+PLACES.find(q=>q.id===VIV.carry.to).name+'!»</p>';one('Voy',()=>closeDialog());return;}
    const to=pick(dests),pl=PLACES.find(q=>q.id===to);B.innerHTML='<p>«¿Buscas trabajo? Lleva esta ánfora de '+(ro?'aceite de la Bética':'aceite de Samos')+' hasta '+pl.name+'. Allí te pagarán tres '+mon+'s. Y no la rompas.»</p><p class="sub">Los porteadores cargaban ánforas de 25 a 40 kilos al hombro. Irás más despacio mientras la lleves.</p>';
    one('Cargar el ánfora',()=>{VIV.carry={to,t0:performance.now()};v2CarryMesh(true);closeDialog();toast('<span class="label">Llevas un ánfora</span><br>Destino: '+pl.name+'. Mira el plano (M) si no sabes llegar.');},'quiz');one('No, gracias',()=>closeDialog());}}
function v2CarryMesh(on){const w=AVATAR.walk;if(!w||!PGEO||!PGEO.jar)return;if(on&&!VIV.jar){const a=new THREE.Mesh(PGEO.jar,lam('#b5603a'));a.scale.setScalar(0.55);a.position.set(0.25,1.5,0.02);a.rotation.z=0.7;w.add(a);VIV.jar=a;}if(!on&&VIV.jar){w.remove(VIV.jar);VIV.jar=null;}}
function v2CarryTick(){if(!VIV.carry)return;const pl=PLACES.find(q=>q.id===VIV.carry.to);if(!pl){VIV.carry=null;v2CarryMesh(false);return;}
  if(Math.hypot(pl.x-player.x,pl.z-player.z)<14){VIV.carry=null;v2CarryMesh(false);state.obols+=3;save();updateStats();sfxCoin();toast('<span class="label">Ánfora entregada</span><br>Te pagan 3 '+(MODE==='roma'?'sestercios':'óbolos')+'. Un porteador ganaba eso por un día entero de trabajo.');}
  else if(performance.now()-VIV.carry.t0>600000){VIV.carry=null;v2CarryMesh(false);toast('El capataz se ha cansado de esperar: alguien ha llevado el ánfora por ti.');}}
// ---- tick
function v2Tick(dt){if(!state||ui==='start')return;const now=performance.now();
  for(let i=VIV.lab.length-1;i>=0;i--)if(now>VIV.lab[i].until){scene.remove(VIV.lab[i].sp);VIV.lab.splice(i,1);}
  if(ui!=='play')return;v2Props();v2Circles(dt);v2Bump();v2Npcs(dt);v2Event(dt);v2Birds(dt);v2CarryTick();
  if(VIV.sit){if(keys.w||keys.s||keys.a||keys.d||keys.jump)v2Stand();else addHours(dt*0.02);}}
{const f=egxAct0;egxAct0=function(o){if(String(o.act).startsWith('v2:'))return v2Act(o);return f(o);};}
