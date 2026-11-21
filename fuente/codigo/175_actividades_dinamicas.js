// ============================================================ JUEGO MÁS DINÁMICO (2): carreras, recados, incendios, dados, la noche y la búsqueda del tesoro
// D4. Carreras: en Roma, dos vueltas al Circo Máximo contra tres cuadrigas (mejor a caballo); en Atenas, el tramo final de la
//     carrera de antorchas, del Dípilon a los Propileos, contra reloj.
// D5. Recados: alguien te pide llevar un mensaje a otra persona antes de que pase el tiempo; corre y busca atajos.
// D6. Incendio: de vez en cuando arde una casa cerca; coge agua en una fuente (E) y échala al fuego (E) antes de que se extienda.
// D7. Dados (tabas): una partida con la gente con la que hablas, con una apuesta pequeña.
// D9. La noche: en Roma, los carros entran en la ciudad de noche; en Atenas, el guardián de la puerta cobra por abrirla.
// D10. Búsqueda del tesoro: una tablilla con pistas escritas en las inscripciones de la ciudad (en griego o en latín).
const DYN={race:null,run:null,errand:null,fire:null,bucket:false,carts:[],hunt:null,hud:null};
function dynz(){const s=state;if(!s.dyn)s.dyn={};return s.dyn;}
function dynHud(t){let h=DYN.hud;if(!h){h=DYN.hud=document.createElement('div');h.style.cssText='position:fixed;left:50%;top:64px;transform:translateX(-50%);padding:6px 12px;border-radius:8px;background:rgba(22,16,12,.82);border:1px solid rgba(217,135,74,.5);color:#f3e6cf;font-size:.95rem;pointer-events:none;z-index:9';document.body.appendChild(h);}h.hidden=!t;if(t)h.innerHTML=t;}
const fmtS=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
function plc(id){return PLACES.find(p=>p.id===id);}
// ---------------------------------------------------------------- D4a. Circo Máximo
const CIRC_F=[['Los rojos','russata','#a8392b',14.2],['Los blancos','albata','#e8e2d4',13.6],['Los verdes','prasina','#3f7a3a',14.8]];
function circPath(s){const C=ROMA.circus,L=172,r=20,P=4*L+TAU*r,u=((s%P)+P)%P;let lx,lz;   // óvalo alrededor de la espina, en sentido contrario a las agujas del reloj
  if(u<2*L){lx=-L+u;lz=r;}else if(u<2*L+Math.PI*r){const a=(u-2*L)/r;lx=L+Math.sin(a)*r;lz=Math.cos(a)*r;}else if(u<4*L+Math.PI*r){lx=L-(u-2*L-Math.PI*r);lz=-r;}else{const a=(u-4*L-Math.PI*r)/r;lx=-L-Math.sin(a)*r;lz=-Math.cos(a)*r;}
  const w=C.cr(lx,lz);return{x:w[0],z:w[1],P};}
function circStart(){if(DYN.race||!ROMA.circus)return;const P0=circPath(0).P,laps=2;const riv=CIRC_F.map((f,i)=>{const g=new THREE.Group(),c=lam(f[2]);box(1.4,0.9,1.2,c,0,0.9,0,g);box(2.4,1.4,1.0,lam('#6b4a30'),0,1.1,-2.2,g);const p=makePerson({noVary:true,short:true,chiton:f[2]});p.position.set(0,0.9,0.2);g.add(p);scene.add(g);return{f,g,s:-i*6-6,v:f[3]};});
  DYN.race={riv,t:-3,laps,P:P0,ps:0,last:circProj(),done:false};const a=circPath(0);player.x=a.x;player.z=a.z+0;player.feet=floorAt(a.x,a.z);
  toast('<span class="label">Carrera en el Circo</span><br>Dos vueltas a la espina, en sentido contrario a las agujas del reloj. ¡A caballo se corre mejor! Las metas son los conos dorados de cada extremo.');}
function circProj(){// distancia recorrida aproximada del jugador sobre el óvalo
  const C=ROMA.circus,l=(function(){const dx=player.x-C.C.x,dz=player.z-C.C.z,c=Math.cos(C.CA),s=Math.sin(C.CA);return[dx*c-dz*s,dx*s+dz*c];})();let best=0,bd=1e9;const P=circPath(0).P;
  for(let s=0;s<P;s+=6){const q=circPath(s),d=Math.hypot(q.x-player.x,q.z-player.z);if(d<bd){bd=d;best=s;}}return best;}
function circTick(dt){const R=DYN.race;if(!R)return;R.t+=dt;const tot=R.laps*R.P;
  for(const v of R.riv){if(R.t>0&&v.s<tot)v.s+=v.v*dt*(1+Math.sin(R.t*0.3+v.v)*0.05);const a=circPath(v.s),b=circPath(v.s+2);v.g.position.set(a.x,floorAt(a.x,a.z),a.z);v.g.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);}
  const cur=circProj();let d=cur-R.last;if(d<-R.P/2)d+=R.P;if(d>R.P/2)d-=R.P;if(R.t>0&&Math.abs(d)<40)R.ps+=d;R.last=cur;
  const pos=1+R.riv.filter(v=>v.s>R.ps).length;
  dynHud(R.t<0?'Preparados… '+Math.ceil(-R.t):'Vuelta '+Math.min(R.laps,1+Math.floor(Math.max(0,R.ps)/R.P))+' de '+R.laps+' · vas '+pos+'.º · '+fmtS(R.t));
  if(R.ps>=tot){const fin=1+R.riv.filter(v=>v.s>=tot).length;for(const v of R.riv)scene.remove(v.g);DYN.race=null;dynHud('');const z=dynz();z.circ=(z.circ||0)+1;if(fin===1){qAdd('kl',2,'¡Has ganado en el Circo!');state.obols+=10;updateStats();}save();
    eduOverlay('dynEnd','Carrera en el Circo Máximo','<p>Llegas '+fin+'.º'+(fin===1?' ¡y ganas! Te dan una palma y diez sestercios.':'.')+'</p><p>Las carreras de verdad duraban siete vueltas, de izquierda a derecha alrededor de la espina, y lo más peligroso eran los giros junto a las metas, donde chocaban los carros (el «naufragio»). Los aurigas corrían para cuatro facciones, rojos, blancos, verdes y azules, y la gente era hincha de una de ellas: Plinio el Joven se burla de que miles de hombres se apasionen «por un trapo de color» (Cartas 9, 6). Algunos aurigas, como Diocles, se hicieron riquísimos.</p>');}
  if(R.t>600){for(const v of R.riv)scene.remove(v.g);DYN.race=null;dynHud('');}}
// ---------------------------------------------------------------- D4b. carrera de antorchas (Atenas)
const RUN_IDS=['dipilon','doce','eleusinion','propileos'];
function runStart(){if(DYN.run)return;const pts=RUN_IDS.map(plc).filter(Boolean);if(pts.length<3)return;let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].z-pts[i-1].z);
  DYN.run={pts,i:1,t:0,lim:Math.round(L/6.2)+15};player.x=pts[0].x+3;player.z=pts[0].z;player.feet=floorAt(player.x,player.z);try{mtBeacon(pts[1].x,pts[1].z);MTR.beaconT=600;}catch(e){}
  toast('<span class="label">Carrera de antorchas</span><br>El último tramo de la lampadedromía: del Dípilon al altar de los Doce Dioses, al Eleusinion y a los Propileos. Tienes '+DYN.run.lim+' segundos. Corre, pero no te quedes sin aliento.');}
function runTick(dt){const R=DYN.run;if(!R)return;R.t+=dt;const p=R.pts[R.i];dynHud('🔥 '+p.name+' · '+fmtS(Math.max(0,R.lim-R.t)));
  if(Math.hypot(p.x-player.x,p.z-player.z)<12){R.i++;if(R.i>=R.pts.length){const ok=R.t<=R.lim;DYN.run=null;dynHud('');const z=dynz();if(ok&&!z.run){z.run=1;qAdd('ar',2,'Has llegado con la antorcha encendida.');}save();
      eduOverlay('dynEnd','Carrera de antorchas',(ok?'<p>¡Llegas con la antorcha encendida en '+fmtS(R.t)+'!</p>':'<p>Llegas, pero tarde: '+fmtS(R.t)+'.</p>')+'<p>En la lampadedromía los corredores salían de noche del altar de Prometeo, en la Academia, y corrían hasta la ciudad con la antorcha encendida: gana quien llega primero sin que se le apague (Pausanias 1, 30, 2). En algunas fiestas se corría por relevos, por tribus. En el juego solo corres el tramo final.</p>');return;}
    try{mtBeacon(R.pts[R.i].x,R.pts[R.i].z);MTR.beaconT=600;}catch(e){}}
  if(R.t>R.lim+60){DYN.run=null;dynHud('');toast('Se te ha apagado la antorcha.');}}
// ---------------------------------------------------------------- D5. recados contra reloj
function errTick(dt){const E=DYN.errand;if(!E)return;E.t+=dt;dynHud('✉ Para '+E.toN+' · '+fmtS(Math.max(0,E.lim-E.t)));if(E.t>E.lim+120){DYN.errand=null;dynHud('');toast('El recado ya no sirve: llegó demasiado tarde.');}}
{const f=renderOpts;renderOpts=function(extra){f(extra);try{const n=dlg&&dlg.n;if(!n||!n.topics||DYN.race||DYN.run)return;const o=$('dOpts'),z=dynz(),day=state.day||1;
  const add=(ic,t,fn)=>{const b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">'+ic+'</span><span>'+t+'</span>';b.onclick=fn;o.insertBefore(b,o.lastChild);};
  const E=DYN.errand;if(E&&E.to===n.id){add('✉','Entregar el recado de '+E.fromN,()=>{const ok=E.t<=E.lim;DYN.errand=null;dynHud('');state.obols+=ok?4:1;if(ok)qAdd('ar',1,'Llegaste a tiempo.');save();updateStats();
      $('dBody').innerHTML='<p>'+(ok?'«¡Justo a tiempo! Gracias: toma, por la carrera».':'«¿Ahora? Ya es tarde… Bueno, gracias de todos modos».')+'</p><p class="sub">'+(ok?'+4':'+1')+' '+(MODE==='roma'?'sestercios':'óbolos')+'. Sin correo público, los mensajes urgentes los llevaban esclavos o muchachos a la carrera: un buen corredor valía oro.</p>';renderOpts();});return;}
  if(!E&&z.errDay!==day+':'+n.id){const me=npcObjs.find(q=>q.data===n);if(!me)return;const c=npcObjs.filter(q=>q.data!==n&&q.data.topics&&q.x<8000).map(q=>[q,Math.hypot(q.x-me.x,q.z-me.z)]).filter(([q,d])=>d>180&&d<650);if(!c.length)return;
    add('✉','«¿Necesitas que lleve algún recado?»',()=>{const[q,d]=c[Math.floor(Math.random()*c.length)];z.errDay=day+':'+n.id;const lim=Math.round(d/6.5)+25;DYN.errand={to:q.data.id,toN:q.data.name,fromN:n.name,t:0,lim};save();
      try{mtBeacon(q.x,q.z);MTR.beaconT=600;}catch(e){}$('dBody').innerHTML='<p>«¡Sí! Lleva esto a <b>'+q.data.name+'</b>, deprisa: tiene que saberlo antes de '+fmtS(lim)+'. Te marco el camino».</p><p class="sub">Corre y busca atajos: por las callejuelas, saltando muretes o trepando.</p>';renderOpts();});}}catch(e){}};}
// ---------------------------------------------------------------- D6. incendio con cubos
function fireStart(){if(DYN.fire||MODE==='x')return;const P=player;const hs=(footprints||[]).filter(f=>f.house&&f.x<8000&&Math.hypot(f.x-P.x,f.z-P.z)>40&&Math.hypot(f.x-P.x,f.z-P.z)<140);if(!hs.length)return;
  const f=hs[Math.floor(Math.random()*hs.length)],g=new THREE.Group(),fl=[];for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(0.9+Math.random(),2.5+Math.random()*2,6),new THREE.MeshBasicMaterial({color:i%2?0xff8a2a:0xffc040,transparent:true,opacity:0.85,fog:false}));m.position.set((Math.random()-0.5)*6,4+Math.random()*3,(Math.random()-0.5)*6);g.add(m);fl.push(m);}
  const sm=[];for(let i=0;i<10;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(2+Math.random()*2,8,6),new THREE.MeshBasicMaterial({color:0x5a5450,transparent:true,opacity:0.35,depthWrite:false}));s.position.set(0,8+i*2.5,0);g.add(s);sm.push(s);}
  g.position.set(f.x,floorAt(f.x,f.z),f.z);scene.add(g);DYN.fire={f,g,fl,sm,hp:5,t:0,lim:120};try{mtBeacon(f.x,f.z);MTR.beaconT=900;}catch(e){}
  toast('<span class="label">¡Fuego!</span><br>Arde una casa ahí cerca. Coge agua en una fuente (E) y échala al fuego (E). Hacen falta cinco cubos antes de que se extienda.');}
function fireNearFountain(){return agFountain();}
function fireTick(dt){const F=DYN.fire;if(!F){if(!state||ui!=='play')return;const z=dynz(),day=state.day||1;if(z.fireDay&&day-z.fireDay<2)return;DYN.fc=(DYN.fc||0)+dt;if(DYN.fc<30)return;DYN.fc=0;if(clock.h<8||clock.h>19||Math.random()>0.06)return;z.fireDay=day;save();fireStart();return;}
  F.t+=dt;const k=F.hp/5;F.fl.forEach((m,i)=>{m.scale.setScalar((0.4+k)*(1+Math.sin(F.t*8+i)*0.15));});F.sm.forEach((s,i)=>{s.position.y=8+((F.t*3+i*2.5)%25);s.material.opacity=0.35*k;});
  const d=Math.hypot(F.f.x-player.x,F.f.z-player.z);dynHud('🔥 Cubos: '+(5-F.hp)+' de 5'+(DYN.bucket?' · llevas agua':'')+' · '+fmtS(Math.max(0,F.lim-F.t)));
  const p=$('prompt');if(ui==='play'&&!focus&&p){if(!DYN.bucket&&fireNearFountain()){p.innerHTML='<kbd>E</kbd>Llenar el cubo';p.hidden=false;}else if(DYN.bucket&&d<9){p.innerHTML='<kbd>E</kbd>Echar el agua al fuego';p.hidden=false;}}
  if(F.t>F.lim){scene.remove(F.g);DYN.fire=null;DYN.bucket=false;dynHud('');toast('<span class="label">El fuego se ha extendido</span><br>Los vecinos consiguen apagarlo al final, pero la casa se ha perdido.');}}
{const f=interact;interact=function(){const F=DYN.fire;if(F&&!focus&&ui==='play'){const d=Math.hypot(F.f.x-player.x,F.f.z-player.z);
    if(!DYN.bucket&&fireNearFountain()){DYN.bucket=true;try{sfxTap();}catch(e){}toast('Llenas el cubo de cuero. ¡Rápido, al fuego!');return;}
    if(DYN.bucket&&d<9){DYN.bucket=false;F.hp--;try{gfPulse();}catch(e){}if(F.hp<=0){scene.remove(F.g);DYN.fire=null;dynHud('');const z=dynz();z.fires=(z.fires||0)+1;qAdd('kl',2,'Has ayudado a apagar un incendio.');qAdd('ar',1);save();
        eduOverlay('dynEnd','¡Apagado!','<p>Entre todos habéis apagado el fuego.</p>'+(MODE==='roma'?'<p>En Roma los incendios eran continuos: casas de varios pisos, madera, braseros y lámparas de aceite. Augusto creó los vigiles, siete cohortes de libertos que vigilaban de noche con cubos, bombas de agua y hachas, uno por cada dos barrios (Suetonio, Augusto 30; Dion Casio 55, 26). Juvenal dice que vivir en un tercer piso es esperar a que te despierte el humo (Sátiras 3, 197-202).</p>':'<p>En Atenas no había bomberos: cuando ardía una casa acudían los vecinos con cubos y vasijas, y se derribaba lo que hiciera falta para que el fuego no pasara a la de al lado.</p>'));}
      else toast('¡Al fuego! Quedan '+F.hp+' cubos.');return;}}
  return f.apply(this,arguments);};}
// ---------------------------------------------------------------- D7. dados (tabas)
function taliOpen(n){const ro=MODE==='roma',coin=ro?'sestercio':'óbolo';if((state.obols||0)<1){toast('No tienes dinero para apostar.');return;}
  const vals=[1,3,4,6],roll=()=>[0,0,0,0].map(()=>vals[Math.floor(Math.random()*4)]);
  const score=r=>{const u=new Set(r).size;if(u===4)return{v:100,t:ro?'¡Venus! (las cuatro distintas)':'¡Afrodita! (las cuatro distintas)'};if(r.every(x=>x===1))return{v:-1,t:ro?'el perro (cuatro unos)':'el perro (cuatro unos)'};return{v:r.reduce((a,b)=>a+b,0),t:'suma '+r.reduce((a,b)=>a+b,0)};};
  eduOverlay('taliBox',ro?'Tabas (tali)':'Tabas (astrágaloi)','<p>'+n.name+' saca cuatro tabas, huesecillos de cordero con cuatro caras que valen 1, 3, 4 y 6. «¿Una partida? Una moneda»</p><div id="taliB"></div><div id="taliO" class="lrnRow"></div><p class="sub">La mejor tirada es la que saca las cuatro caras distintas: «Venus» para los romanos, «Afrodita» para los griegos; la peor, cuatro unos, «el perro». Augusto jugaba a esto con sus amigos y lo cuenta en sus cartas (Suetonio, Augusto 71).</p>');
  const B=$('taliB'),O=$('taliO');const go=()=>{const a=roll(),b=roll(),sa=score(a),sb=score(b),win=sa.v>sb.v?1:sa.v<sb.v?-1:0;state.obols+=win;save();updateStats();
    B.innerHTML='<p>Tú: <b>'+a.join(' · ')+'</b> — '+sa.t+'<br>'+n.name+': <b>'+b.join(' · ')+'</b> — '+sb.t+'</p><p><b>'+(win>0?'¡Ganas un '+coin+'!':win<0?'Pierdes un '+coin+'.':'Empate.')+'</b></p>';O.innerHTML='';
    if((state.obols||0)>0){const c=document.createElement('button');c.textContent='Otra';c.onclick=go;O.appendChild(c);}};
  const s=document.createElement('button');s.textContent='Tirar';s.onclick=go;O.appendChild(s);}
{const f=renderOpts;renderOpts=function(extra){f(extra);try{const n=dlg&&dlg.n;if(!n||!n.topics||(typeof HIST!=='undefined'&&HIST.has(n.id)))return;const o=$('dOpts'),b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">⚄</span><span>«¿Echamos una partida a las tabas?»</span>';
  b.onclick=()=>{closeDialog();setTimeout(()=>taliOpen(n),60);};o.insertBefore(b,o.lastChild);}catch(e){}};}
// ---------------------------------------------------------------- D9. la noche
function nightNow(){return clock.h>=20.5||clock.h<5;}
function cartMake(){const g=new THREE.Group(),w=lam('#6b4a30');box(1.6,0.8,2.6,w,0,1.0,0,g);for(const sx of[-1,1])for(const sz of[-0.9,0.9]){const wh=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.15,10),lam('#4a3220'));wh.rotation.z=Math.PI/2;wh.position.set(sx*0.9,0.5,sz);g.add(wh);}
  box(0.7,1.1,1.8,lam('#6b5a4a'),0,1.1,2.5,g);box(0.35,0.4,0.6,lam('#6b5a4a'),0,1.7,3.4,g);const lt=new THREE.PointLight(0xffb060,0.8,10);lt.position.set(0,2.2,1.6);g.add(lt);scene.add(g);return g;}
function dynNightTick(dt){if(!state||ui!=='play')return;const z=dynz(),n=nightNow(),day=state.day||1;
  if(MODE==='roma'){if(!n||player.x>8000){for(const c of DYN.carts)scene.remove(c.g);DYN.carts=[];return;}
    if(z.cartN!==day&&DYN.carts.length){z.cartN=day;save();toast('<span class="label">Carros de noche</span><br>Una ley de César prohíbe a los carros entrar en Roma de día; por eso la ciudad se llena de ellos al anochecer (Tabla de Heraclea, líneas 56-61). Juvenal dice que el ruido de las ruedas y de los arrieros no deja dormir a nadie (Sátiras 3, 236-238).');}
    while(DYN.carts.length<5){const R=ROADS.filter(r=>r.pts&&r.pts.length>1&&r.pts.some(p=>Math.hypot(p[0]-player.x,p[1]-player.z)<220));if(!R.length)break;const r=R[Math.floor(Math.random()*R.length)];DYN.carts.push({g:cartMake(),r,i:0,u:Math.random(),dir:Math.random()<0.5?1:-1});}
    for(const c of DYN.carts){const p=c.r.pts;let a=p[c.i],b=p[Math.min(p.length-1,c.i+1)],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;c.u+=dt*2.2/L*c.dir;if(c.u>1){c.i++;c.u=0;if(c.i>=p.length-1){c.dir=-1;c.i=p.length-2;c.u=1;}}if(c.u<0){c.i--;c.u=1;if(c.i<0){c.dir=1;c.i=0;c.u=0;}}
      a=p[c.i];b=p[Math.min(p.length-1,c.i+1)];const x=a[0]+(b[0]-a[0])*c.u,zz=a[1]+(b[1]-a[1])*c.u;c.g.position.set(x,floorAt(x,zz),zz);c.g.rotation.y=Math.atan2((b[0]-a[0])*c.dir,(b[1]-a[1])*c.dir);
      if(Math.hypot(x-player.x,zz-player.z)>320){scene.remove(c.g);c.dead=1;}}DYN.carts=DYN.carts.filter(c=>!c.dead);}
  else if(n&&z.gateN!==day){for(const p of PLACES){if(!/Puerta|Dípilon|Πύλ/i.test(p.name)||Math.hypot(p.x-player.x,p.z-player.z)>14)continue;z.gateN=day;if((state.obols||0)>0){state.obols--;updateStats();}save();
      toast('<span class="label">La puerta está cerrada</span><br>De noche las puertas de la muralla se cierran. El guardián te abre el postigo por un óbolo. Eneas el Táctico, que escribirá unas décadas después, explica cómo vigilar las puertas de noche y quién debe guardar las llaves (Poliorcética 18-20).');break;}}}
// ---------------------------------------------------------------- D10. búsqueda del tesoro
const HUNT={atenas:{start:'basileios',steps:[
  ['horos','Busca la piedra que habla en primera persona: ΗΟΡΟΣ ΕΙΜΙ ΤΕΣ ΑΓΟΡΑΣ, «soy el mojón del Ágora». Marca dónde empieza la plaza.'],
  ['tiranicidas','Dos hombres de bronce con la espada en alto: ΑΡΜΟΔΙΟΣ ΚΑΙ ΑΡΙΣΤΟΓΕΙΤΩΝ. Los atenienses dicen que mataron a un tirano.'],
  ['eponimos','Diez héroes en fila sobre un pedestal largo: ΕΠΩΝΥΜΟΙ. Debajo se cuelgan los avisos de la ciudad.'],
  ['hefestion','Sube a la colina donde se oyen los martillos de los broncistas: ΗΦΑΙΣΤΕΙΟΝ.'],
  ['ceca','La última: donde se acuña la plata con la lechuza, ΑΡΓΥΡΟΚΟΠΕΙΟΝ.']],prize:'una tetradracma de plata con la lechuza de Atenea: vale cuatro dracmas, veinticuatro óbolos'},
 roma:{start:'ro_castor',steps:[
  ['ro_fastos','Busca las listas de magistrados de cada año, grabadas en mármol: FASTI. Están junto a la Regia.'],
  ['ro_rostra','Ahora, la tribuna adornada con espolones de barcos: ROSTRA.'],
  ['ro_saturno','Donde se guarda el tesoro del Estado: AEDES SATVRNI, «el templo de Saturno».'],
  ['ro_tabularium','Sube hacia el archivo del Estado, con su muro de arcos: TABVLARIVM.'],
  ['ro_jupiter','La última, en lo más alto: IOVI OPTIMO MAXIMO, «a Júpiter, el mejor y el más grande».']],prize:'un denario de plata de Tito, recién acuñado'}};
function huntDef(){return HUNT[MODE==='roma'?'roma':'atenas'];}
function huntSetup(){const H=huntDef(),p=plc(H.start);if(!p)return;const x=p.x+4,z=p.z+3;const g=grp(x,floorAt(x,z),z,0.4);box(0.5,0.08,0.35,lam('#c9a46a'),0,0.75,0,g);box(0.6,0.7,0.5,lam('#8a6a44'),0,0.35,0,g);egxObj(x,z,undefined,'dyn:hunt','Una tablilla olvidada','¿un acertijo?',2.2);
  if(MODE==='roma'&&ROMA.circus){const c=ROMA.circus.cr(-ROMA.circus.Lh-2,0);egxObj(c[0],c[1],undefined,'dyn:circ','Correr en el Circo','carrera de cuadrigas',4);}
  if(MODE!=='roma'){const d=plc('dipilon');if(d)egxObj(d.x+5,d.z+2,undefined,'dyn:run','Carrera de antorchas','el último tramo',3);}}
function huntAct(){const H=huntDef(),z=dynz();if(z.hunt==='fin'){openInfo('La tablilla','<p>Ya encontraste el tesoro.</p>');return;}if(typeof z.hunt!=='number')z.hunt=0;save();huntShow();}
function huntShow(){const H=huntDef(),z=dynz(),s=H.steps[z.hunt];openInfo('Búsqueda del tesoro · pista '+(z.hunt+1)+' de '+H.steps.length,'<p>'+s[1]+'</p><p class="sub">Encuentra la estela con esa inscripción y acércate a ella. Si te pierdes, el plano (M) muestra las estelas.</p>');}
function huntTick(dt){const z=dynz();if(typeof z.hunt!=='number'||ui!=='play')return;const H=huntDef(),s=H.steps[z.hunt],p=s&&plc(s[0]);if(!p)return;if(Math.hypot(p.x-player.x,p.z-player.z)>10)return;
  z.hunt++;save();try{sfxCoin();}catch(e){}if(z.hunt>=H.steps.length){z.hunt='fin';state.obols+=MODE==='roma'?16:24;qAdd('so',2,'Has sabido leer las inscripciones.');save();updateStats();
    openInfo('¡El tesoro!','<p>Al pie de la inscripción, bajo una piedra suelta, encuentras '+H.prize+'.</p><p class="sub">Has leído cinco inscripciones '+(MODE==='roma'?'latinas':'griegas')+'. Las inscripciones en piedra y bronce son una de las mejores fuentes de la Antigüedad: se conservan decenas de miles, y muchas, como el mojón del Ágora, todavía se pueden ver donde estaban.</p>');return;}
  toast('<span class="label">¡Encontrada!</span><br>'+p.greek+'. Siguiente pista…');setTimeout(huntShow,1200);}
{const f=egxAct0;egxAct0=function(o){const a=String(o.act);if(a==='dyn:hunt')return huntAct();if(a==='dyn:circ')return circStart();if(a==='dyn:run')return runStart();return f(o);};}
{const f=uxTick;uxTick=function(dt){f(dt);if(!state)return;for(const t of[circTick,runTick,errTick,fireTick,dynNightTick,huntTick]){try{t(dt);}catch(e){}}};}
