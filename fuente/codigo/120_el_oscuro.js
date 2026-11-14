// ============================================================ EL OSCURO: la sombra de Heráclito en Éfeso (modo Atenas)
// Misión gemela de Sócrates, Diógenes y Pitágoras. Melita, una de las «abejas» (melissai) que sirven a Ártemis, cuenta que
// Heráclito dejó su libro en el Artemision y que de noche se oye a un viejo jugar a las tabas en el patio, como hacía él con
// los niños (Diógenes Laercio IX 3). Para llamarlo hay que jugar a las tabas allí de noche: «el tiempo es un niño que juega»
// (fr. 52). Su sombra, oscura y con brasas, te persigue con sus frases enigmáticas y sus desprecios a los efesios.
// Se le vence aceptando sus paradojas: la unidad de los contrarios. La misión es inventada; los fragmentos, no (numeración DK).
const HRC={g:null,o:null,next:0,said:{}};
function herz(){if(!state.her||typeof state.her!=='object')state.her={st:0,tries:0,lastTry:-1,tiros:0};return state.her;}
function herNight(){return clock.h>=21||clock.h<4.5;}
function herIn(){if(player.x<8000)return null;const I=islandOf(player.x);return I&&I.id==='efeso'?I:null;}
const LES_HERACLITO={title:'Heráclito: todo fluye y los contrarios son uno',cat:'Filosofía',who:'La sombra de Heráclito',where:'De noche, en el patio del Artemision de Éfeso, tras jugar a las tabas',hint:'Habla con Melita, servidora de Ártemis, en Éfeso',
  summary:'Heráclito de Éfeso (c. 540-480 a.C.), llamado «el oscuro» por sus frases enigmáticas, pensaba que todo cambia sin cesar («no es posible bañarse dos veces en el mismo río»), que el mundo es un fuego siempre vivo y que los contrarios forman una unidad: «el camino hacia arriba y hacia abajo es uno y el mismo». Por debajo del cambio hay una ley común, el lógos, que la mayoría no entiende. Despreciaba a sus conciudadanos, dejó su libro en el templo de Ártemis y, según la tradición, se retiró a jugar a las tabas con los niños.',fict:true};
const SRC_HERACLITO={a:['Heráclito, fragmentos (Diels-Kranz 22 B): 1, 9, 18, 30, 40, 51, 52, 53, 60, 75, 91, 97, 101, 119, 121, 123','Diógenes Laercio IX 1-17','Platón, Crátilo 402a','Aristóteles, Partes de los animales I 5, 645a («también aquí hay dioses»)'],m:['G. S. Kirk, J. E. Raven y M. Schofield, Los filósofos presocráticos (Gredos)'],n:['La misión y la sombra son inventadas. Melita es inventada; las «abejas» de Ártemis son un título real de sus servidoras.','Lo de «el filósofo que llora» es una tradición romana tardía (Séneca, Sobre la ira II 10).']};
const HER_FRASE=['«Este lógos, que es siempre, los hombres no lo entienden ni antes de oírlo ni después de oírlo.» (fr. 1)','«Los asnos preferirían la paja al oro.» (fr. 9)','«Los efesios merecerían ahorcarse todos los adultos y dejar la ciudad a los niños.» (fr. 121)','«A la naturaleza le gusta ocultarse.» (fr. 123)','«Los perros ladran a quien no conocen.» (fr. 97)','«Si no esperas lo inesperado, no lo encontrarás.» (fr. 18)','«Saber muchas cosas no enseña a tener entendimiento.» (fr. 40)','«Este mundo es un fuego siempre vivo, que se enciende y se apaga con medida.» (fr. 30)','«El carácter es, para el hombre, su destino.» (fr. 119)','«El sol tiene la anchura de un pie humano.» (fr. 3)'];
function herGhost(){const g=makePerson({chiton:'#3a3430',himation:'#2a2420',beard:true,hair:'#5a5048',noVary:true});const m=new THREE.MeshBasicMaterial({color:0x6a5a52,transparent:true,opacity:0.55,depthWrite:false});
  g.traverse(o=>{if(o.isMesh)o.material=m;});const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:0xff7a30,transparent:true,opacity:0.35,depthWrite:false,blending:THREE.AdditiveBlending}));gl.scale.set(2.2,3.2,1);gl.position.y=1.0;g.add(gl);   // un fuego que se enciende y se apaga con medida
  g.userData.noSnap=true;g.userData.m=m;g.userData.gl=gl;scene.add(g);return g;}
function herSetup(){LESSONS.heraclito_efeso=LES_HERACLITO;SRC.heraclito_efeso=SRC_HERACLITO;if(MODE!=='atenas')return;const I=ISLANDS.find(q=>q.id==='efeso');if(!I||!I.site)return;const s=I.site;
  const m=findFree(s.x+34,s.z+40,1);artPerson(m,{female:true,chiton:'#f0e8d8',himation:'#c9a24a',hair:'#3b2a1e',noVary:true},'her:melita','Melita','una «abeja» de Ártemis',3);
  const p=findFree(s.x+44,s.z+52,2);HRC.patio=p;const g=grp(p[0],floorAt(p[0],p[1]),p[1],0);box(2.4,0.08,2.4,lam('#e8dfcc'),0,0.04,0,g);for(let i=0;i<4;i++){const a=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.04,0.09),lam('#efe6d4'));a.position.set(rr(-0.4,0.4),0.1,rr(-0.4,0.4));a.rotation.y=R()*TAU;g.add(a);}
  egxObj(p[0],p[1],undefined,'her:tabas','Unas tabas en el patio','huesos de cordero para jugar',2.6);}
function herAct(o){const s=herz(),k=o.act;
  if(k==='her:melita'){const bt=[];let h;
    if(s.st===0){h='<p>Una muchacha con una diadema dorada y un manto amarillo barre los escalones del templo.</p><p>«A las que servimos a Ártemis nos llaman <i>melissai</i>, abejas. Yo soy Melita. ¿Vienes a ver el libro? Todos lo preguntan. Hace un siglo, un sabio de aquí, Heráclito, dejó su único libro en el templo, como ofrenda a la diosa. Lo escribió a propósito tan oscuro que solo lo entienden los que se esfuerzan. Los demás se rinden en la primera línea.»</p>';
      bt.push(['¿Por qué lo dejó aquí?',()=>{s.st=1;save();vmS('Μ','Melita','una «abeja» de Ártemis','<p>«Porque no soportaba a los efesios. Cuando expulsaron a su amigo Hermodoro, dijo que todos los adultos deberían ahorcarse y dejar la ciudad a los niños. Y se vino al patio del templo a jugar a las tabas con ellos. Cuando los ciudadanos se le acercaban a mirar, les decía: “¿De qué os extrañáis, miserables? ¿No es mejor esto que gobernar con vosotros?”»</p><p>«Y ahora… algunas noches, cuando cierro el templo, oigo caer tabas en el patio. Y una voz que dice cosas que no entiendo. Si quieres verlo, juega tú a las tabas allí de noche. A lo mejor le hace gracia.»</p><p class="sub">De noche, juega a las tabas en el patio del Artemision.</p>',[vmBye]);toast('<span class="label">El oscuro</span><br>De noche (a partir de las nueve), juega a las tabas en el patio del Artemision de Éfeso.');},'quiz']);}
    else if(s.st<4)h='<p>«Las tabas están en el patio, junto al templo. De noche. Y si te habla, no esperes entenderlo a la primera: él decía que la naturaleza ama ocultarse.»</p>';
    else h='<p>«¿Te habló? ¿Y lo entendiste? Mmm. Yo llevo años barriendo junto a su libro y todavía no paso de la primera línea. Algún día me la explicas.»</p>';
    bt.push(vmBye);vmS('Μ','Melita','una «abeja» de Ártemis',h,bt);return;}
  if(k==='her:tabas'){let h='<p>Cuatro tabas, huesecillos del tobillo de cordero, en el suelo del patio. Cada una cae de una de cuatro maneras, que valen 1, 3, 4 o 6.</p>';const bt=[];
    if(s.st===1&&herNight()){bt.push(['Tirar las tabas',()=>{s.tiros++;const v=[0,0,0,0].map(()=>pick([1,3,4,6])),afro=new Set(v).size===4,perro=v.every(x=>x===1);
      const txt='<p>Las tabas ruedan por el mármol y se quedan quietas: <b>'+v.join(' · ')+'</b>. '+(afro?'¡La tirada de Afrodita, las cuatro distintas, la mejor!':perro?'Cuatro unos: la tirada del perro, la peor.':'Nada especial.')+'</p>';
      if(afro||s.tiros>=3){s.st=2;save();vmS('🦴','Unas tabas en el patio','alguien más juega',txt+'<p>Antes de que puedas recogerlas, una mano oscura, con chispas entre los dedos, las coge y las vuelve a tirar. Una voz ronca dice: «El tiempo es un niño que juega a las tabas: el reino es de un niño».</p><p class="sub">Heráclito, fr. 52.</p>',[vmBye]);}
      else{save();vmS('🦴','Unas tabas en el patio','a ver otra vez',txt,[['Tirar otra vez',()=>herAct(o),'quiz'],vmBye]);}},'quiz']);}
    else if(s.st===1)h+='<p class="sub">De día hay demasiada gente. Vuelve de noche.</p>';
    bt.push(vmBye);vmS('🦴','Unas tabas en el patio','huesos de cordero para jugar',h,bt);return;}
  if(k==='her:sombra')herDuel();}
function herTick(dt){if(MODE!=='atenas'||!state)return;const s=herz(),I=herIn();
  const show=I&&s.st>=2&&s.st<4&&herNight();
  if(!show){if(HRC.g){scene.remove(HRC.g);HRC.g=null;if(HRC.o){HRC.o.x=1e9;HRC.o.lb.visible=false;}}return;}
  if(!HRC.g){HRC.g=herGhost();const b=HRC.patio||[player.x,player.z],a=Math.random()*TAU;HRC.g.position.set(b[0]+Math.cos(a)*2.5,0,b[1]+Math.sin(a)*2.5);
    if(!HRC.o){egxObj(HRC.g.position.x,HRC.g.position.z,undefined,'her:sombra','La sombra de Heráclito','el oscuro',3);HRC.o=EGX_OBJS[EGX_OBJS.length-1];}
    if(s.st===2){s.st=3;save();vmS('☾','Una sombra con brasas','en el patio del Artemision','<p>Un viejo de barba descuidada, envuelto en un manto oscuro, se sienta en el escalón y juega con tus tabas. Su contorno parpadea como un fuego que se apaga y se enciende. Te mira con desprecio y con algo de curiosidad.</p><p>«Otro efesio. No: un extranjero. Peor: un extranjero que juega. Bueno, eso me gusta. Te seguiré a ver si entiendes algo. Aunque los más no entienden nada, ni antes de oír ni después de oír.»</p><p class="sub">Heráclito te seguirá cada noche por Éfeso. Cuando te atrevas, habla con él (E).</p>',[vmBye]);}}
  const g=HRC.g,u=g.userData,t=performance.now()/1000;
  if(HRC.walk===1&&HRC.rio){const R=HRC.rio,dR=Math.hypot(player.x-R[0],player.z-R[1]),gx=dR>14?player.x+(R[0]-player.x)/dR*5:R[0]+2,gz=dR>14?player.z+(R[1]-player.z)/dR*5:R[1]+2,ddx=gx-g.position.x,ddz=gz-g.position.z,dd=Math.hypot(ddx,ddz);
    if(dd>0.05){const st=Math.min(dd,(dd>8?9:2.6)*dt);g.position.x+=ddx/dd*st;g.position.z+=ddz/dd*st;}g.position.y=floorAt(g.position.x,g.position.z)+0.12;g.rotation.y=Math.atan2(player.x-g.position.x,player.z-g.position.z);
    const f=0.5+0.5*Math.sin(t*1.3);u.m.opacity=0.35+0.25*f;u.gl.material.opacity=0.15+0.35*f;if(HRC.o){HRC.o.x=g.position.x;HRC.o.z=g.position.z;HRC.o.lb.position.set(g.position.x,g.position.y+2.8,g.position.z);}
    if(ui!=='play')return;const inW=typeof inWaterK==='function'&&inWaterK()<1&&dR<40,nowR=performance.now();
    if(!inW){if(nowR>HRC.stepAt){HRC.stepAt=nowR+14000;toast(HRC.step?'<i>«¡Vuelve al agua! Lo que tengo que decirte solo se entiende dentro.»</i>':'<i>«Por aquí, hacia el Caístro. Hasta la orilla, y luego dentro.»</i> <span class="sub">— la sombra de Heráclito</span>');}return;}
    if(nowR>HRC.stepAt){const L=HER_RIO[HRC.step];if(L){toast('<span class="label">Heráclito, en el río</span><br>'+L);HRC.step++;HRC.stepAt=nowR+7500;}else{HRC.walk=2;setTimeout(()=>{if(ui==='play')herDuel();},400);}}
    return;}
  const ang=-t*0.45,tx=player.x+Math.cos(ang)*3.2,tz=player.z+Math.sin(ang)*3.2,dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);
  if(d>40){g.position.x=tx;g.position.z=tz;}else if(d>0.05){const st=Math.min(d,(d>8?9:2.8)*dt);g.position.x+=dx/d*st;g.position.z+=dz/d*st;}
  g.position.y=floorAt(g.position.x,g.position.z)+0.12;g.rotation.y=Math.atan2(player.x-g.position.x,player.z-g.position.z);
  const f=0.5+0.5*Math.sin(t*1.3);u.m.opacity=0.35+0.25*f;u.gl.material.opacity=0.15+0.35*f;   // se enciende y se apaga con medida
  if(HRC.o){HRC.o.x=g.position.x;HRC.o.z=g.position.z;HRC.o.lb.position.set(g.position.x,g.position.y+2.8,g.position.z);}
  if(ui!=='play')return;const now=performance.now(),say=(k,txt,ms)=>{if(now>(HRC.said[k]||0)){HRC.said[k]=now+ms;toast('<i>'+txt+'</i> <span class="sub">— la sombra de Heráclito</span>');return true;}return false;};
  if(typeof VIV!=='undefined'&&VIV.sit)say('sit','«¿Duermes? Hasta los que duermen trabajan en lo que pasa en el mundo.» (fr. 75)',40000);
  if(typeof TORCH!=='undefined'&&TORCH.on)say('fuego','«Todas las cosas se cambian por fuego, y el fuego por todas las cosas, como las mercancías por oro.» (fr. 90)',60000);
  if(typeof inWaterK==='function'&&inWaterK()<1)say('rio','«En los mismos ríos entramos y no entramos; somos y no somos.» (fr. 49a)',40000);
  if(keys.run)say('run','«El camino hacia arriba y hacia abajo es uno y el mismo. ¿Adónde corres?» (fr. 60)',45000);
  if(now>HRC.next){HRC.next=now+20000+Math.random()*16000;toast('<i>'+pick(HER_FRASE)+'</i> <span class="sub">— la sombra de Heráclito · habla con él (E) para responderle</span>');}}
const HER_RIO=['«Mira el agua que te pasa por los tobillos. Ya no está: es otra. Sobre los que entran en los mismos ríos corren otras y otras aguas.» (fr. 12)',
 '«Quédate quieto. ¿Notas el frío? Al entrar estabas caliente; ahora el agua te enfría y tú la calientas a ella. Lo frío se calienta, lo caliente se enfría, lo húmedo se seca, lo seco se humedece.» (fr. 126)',
 '«Y sin embargo, es el Caístro. El río es el mismo precisamente porque cambia: si el agua se parara, sería una charca, no un río. Lo que permanece es la medida del cambio: el lógos.» (fr. 49a y 91)',
 '«Tú tampoco eres el mismo que entró hace un momento. En los mismos ríos entramos y no entramos; somos y no somos.» (fr. 49a)',
 '«Cambiando, descansa. Hasta la bebida de cebada se separa si no se remueve.» (fr. 84a y 125)'];
const HER_RONDAS=[
 {tema:'El río',intro:'Te señala el Caístro, que baja hacia el puerto. «Mañana te bañas en ese río. Pasado mañana, otra vez. ¿Te habrás bañado dos veces en el mismo río?»',
  op:[['Sí: el río es el mismo, se llama Caístro.',-1,'«El nombre es el mismo. El agua no: otras y otras aguas corren sobre los que entran en los mismos ríos. Y tú tampoco eres el mismo» (fr. 12 y 91).'],
   ['No: las aguas son otras, y yo también soy otro.',1,'«Bien. Y sin embargo es el mismo río: lo que lo hace río es que cambia. Lo que permanece es la medida del cambio, el lógos» (fr. 12, 49a y 91; Platón, Crátilo 402a).'],
   ['Depende de si ha llovido.',-1,'«Ha llovido siempre. Todo fluye, aunque no lo veas. A la naturaleza le gusta ocultarse» (fr. 123).']]},
 {tema:'La guerra y la paz',intro:'«Homero rezó para que la discordia desapareciera de entre los dioses y los hombres. ¿Tenía razón? ¿Qué es mejor, la guerra o la paz?»',
  op:[['La paz, siempre: la guerra solo trae desgracias.',-1,'«Homero se equivocó. Si la discordia desapareciera, desaparecería todo. No habría armonía sin agudo y grave, ni animales sin macho y hembra» (Aristóteles, Ética Eudemia VII 1, 1235a).'],
   ['La guerra, siempre: hace fuertes a los hombres.',-1,'«No te alegres tan deprisa, soldado. No he dicho que la guerra sea buena: digo que es el padre de todas las cosas, el que hace a unos dioses y a otros hombres, a unos esclavos y a otros libres. Es la tensión entre contrarios, no los gritos del campo de batalla» (fr. 53).'],
   ['Los contrarios se necesitan: de su tensión sale la armonía, como en el arco y en la lira.',1,'«No entienden cómo lo que difiere concuerda consigo mismo: armonía de tensiones contrarias, como la del arco y la lira. Tú sí» (fr. 51).']]},
 {tema:'El camino',intro:'Traza una línea en el polvo con el dedo, una cuesta. «El camino que sube desde el puerto hasta el templo, y el camino que baja desde el templo hasta el puerto: ¿son dos caminos o uno?»',
  op:[['Dos: uno sube y el otro baja.',-1,'«¿Dos? Pisas las mismas piedras. Lo que cambia es hacia dónde miras tú.»'],
   ['Uno y el mismo.',1,'«El camino hacia arriba y hacia abajo es uno y el mismo. Lo mismo son el vivo y el muerto, el despierto y el dormido, el joven y el viejo: lo uno, al cambiar, es lo otro» (fr. 60 y 88).'],
   ['Ninguno: los caminos no existen, solo los pasos.',-1,'«Eso es hablar oscuro sin decir nada. Hay camino. Es uno.»']]},
 {tema:'Lo que buscas',intro:'Por fin te mira a los ojos. Las brasas de su contorno brillan más. «Has venido de lejos, has jugado a las tabas a medianoche, me has aguantado. Dime: ¿qué has venido a buscar a Éfeso?»',
  op:[['A ti, para que me expliques tu libro.',-1,'«Mi libro no se explica: se descifra. Y si te lo explicara, sería mi entendimiento, no el tuyo. Saber muchas cosas no enseña a tener entendimiento» (fr. 40).'],
   ['Respuestas.',-1,'«Las respuestas son paja. Los asnos prefieren la paja al oro» (fr. 9).'],
   ['Me he buscado a mí mismo.',1,'Heráclito se ríe, una risa que suena como un tronco que cruje en el fuego. «Eso dije yo: me he buscado a mí mismo. Por los límites del alma no los encontrarías aunque recorrieras todos los caminos: tan profundo es su lógos» (fr. 45 y 101).']]}];
function herDuel(){const s=herz();if(s.st!==3)return;const day=state.day||1;
  if(HRC.rio&&HRC.walk===undefined&&s.lastTry!==day){HRC.walk=1;HRC.step=0;HRC.stepT=0;HRC.stepAt=0;vmS('☾','La sombra de Heráclito','el oscuro','<p>«¿Quieres preguntarme? Aquí no. Ven al río, al Caístro. Las cosas se entienden mejor con los pies mojados.»</p><p class="sub">Sigue a Heráclito hasta el río y métete en el agua.</p>',[vmBye]);return;}
  if(HRC.walk===1){vmS('☾','La sombra de Heráclito','el oscuro','<p>«Al río. Te espero allí.»</p>',[vmBye]);return;}
  if(s.lastTry===day){vmS('☾','La sombra de Heráclito','el oscuro','<p>«Basta por hoy. El sol es nuevo cada día; tú, de momento, no. Mañana por la noche.»</p>',[vmBye]);return;}
  let i=0,score=0,log='';const ronda=()=>{if(i>=HER_RONDAS.length)return fin();const R=HER_RONDAS[i],ord=[0,1,2].sort(()=>Math.random()-0.5);
    vmS('☾','La sombra de Heráclito',R.tema+' · '+(i+1)+' de '+HER_RONDAS.length,(log?'<p class="sub">'+log+'</p>':'')+'<p>'+R.intro+'</p>',ord.map(j=>[R.op[j][0],()=>{const o=R.op[j];score+=o[1];log=o[2];i++;ronda();},'quiz']));};
  const fin=()=>{s.tries++;s.lastTry=day;HRC.walk=undefined;
    if(score>=3){s.st=4;if(!state.lessons.includes('heraclito_efeso'))state.lessons.push('heraclito_efeso');qAdd('so',3,'Has aceptado las paradojas.');qAdd('lo',1);qAdd('kl',1);state.obols+=3;save();updateStats();sfxCoin();
      vmS('☾','La sombra de Heráclito','vencido a su manera','<p class="sub">'+log+'</p><p>«Eres el primero en un siglo que no sale corriendo a la primera línea. No te diré que me has entendido: eso no lo sabe nadie, ni yo. Pero has escuchado al lógos y no a mí, y eso es lo sabio: estar de acuerdo en que todo es uno» (fr. 50).</p><p>Recoge las tabas, las tira una última vez y salen las cuatro distintas: la tirada de Afrodita. Luego su contorno se apaga, como un fuego que ha llegado a su medida.</p><p class="sub">Lección aprendida: <b>'+LES_HERACLITO.title+'</b>.</p>',[vmBye]);
      if(HRC.g){scene.remove(HRC.g);HRC.g=null;}if(HRC.o){HRC.o.x=1e9;HRC.o.lb.visible=false;}}
    else{save();vmS('☾','La sombra de Heráclito','otra vez será','<p class="sub">'+log+'</p><p>«Tú también eres de los que no entienden ni antes de oír ni después de oír. Mañana por la noche lo volvemos a intentar. Y hasta entonces, te seguiré.»</p><p class="sub">Pista: con Heráclito no gana el sentido común. Busca la respuesta en la que los contrarios forman una unidad y en la que el cambio es lo que permanece. Puedes volver a intentarlo mañana por la noche.</p>',[vmBye]);}};
  ronda();}
// el Caístro, el río de Éfeso, que llega al mar junto al puerto
if(SIMPLE_GR.efeso){const o0=SIMPLE_GR.efeso.extra;SIMPLE_GR.efeso.extra=function(I){const pts=[];for(let i=0;i<=40;i++){const t=i/40;pts.push([I.x+520-t*960,I.z+360+Math.sin(t*5)*14]);}   // por el valle llano del sur, hasta el mar
  const r=addRiver(pts,18,{dep:2.2,name:'El Caístro'});if(r){let b=null,bd=1e9;const tw=I.town;for(const p of r.pts){const d=Math.hypot(p[0]-tw.x,p[1]-tw.z);if(d<bd&&p[0]>I.x-200){bd=d;b=p;}}HRC.rio=b;}
  if(o0)o0.call(this,I);};}
{const f=egxAct0;egxAct0=function(o){if(String(o.act).startsWith('her:'))return herAct(o);return f(o);};}
// ---- la antorcha se enciende con solo seleccionarla en la barra, y se apaga al cambiar a otro objeto (la F salta a ella y vuelve)
{const tt0=toggleTorch,hs0=hbSelect;const tIdx=()=>hbSlots().findIndex(q=>q.k==='antorcha');
  hbSelect=function(i){hs0(i);try{const tor=HBAR.sel===tIdx();if(!tor)HBAR.lastOther=HBAR.sel;if(typeof TORCH!=='undefined'&&TORCH.g&&ui==='play'&&tor!==!!TORCH.on)tt0();}catch(e){}};
  toggleTorch=function(){if(ui!=='play'||typeof TORCH==='undefined'||!TORCH.g)return;const ti=tIdx();if(ti<0)return tt0();
    if(HBAR.sel===ti)hbSelect(HBAR.lastOther!==undefined&&HBAR.lastOther!==ti?HBAR.lastOther:(ti+1)%9);else hbSelect(ti);};
  for(const sl of hbSlots())if(sl.k==='antorcha')sl.use=()=>toggleTorch();
  // al empezar, el cursor no se queda en la antorcha (si no, se encendería sola de día)
  const su0=hbSetup;hbSetup=function(){su0();try{const ti=tIdx();if(HBAR.sel===ti&&!(TORCH&&TORCH.on)){HBAR.sel=(ti+1)%9;hbz().sel=HBAR.sel;hbRender(true);}}catch(e){}};}
// ---- un paso de una persona sin atravesar edificios: si el paso choca, prueba a rodear; si no puede, no se mueve
function npcStep(g,ux,uz,st){const x=g.position.x,z=g.position.z;if(!isFree(x,z,0.3)){g.position.x+=ux*st;g.position.z+=uz*st;return true;}   // si ya estaba dentro (por un error de colocación), le dejamos salir
  for(const a of[0,0.5,-0.5,1.0,-1.0,1.5,-1.5]){const c=Math.cos(a),s=Math.sin(a),vx=ux*c-uz*s,vz=ux*s+uz*c,nx=x+vx*st,nz=z+vz*st;if(isFree(nx,nz,0.3)){g.position.x=nx;g.position.z=nz;return true;}}
  return false;}
// ============================================================ AVISOS QUE SE ABREN: la tecla Y (o tocar el aviso) lleva a su entrada del Diario o del Códice
const TLK={last:null};
function toastTarget(html){const m=/<span class="label">([^<]*)<\/span>(?:<br>)?([^<]*)/.exec(html||'');if(!m)return null;const lb=m[1].trim(),tx=(m[2]||'').split(' · ')[0].trim();
  if(/^Curiosidad/.test(lb))return{tab:'curios',q:tx};
  if(/^Lección aprendida/.test(lb))return{tab:'lessons',q:tx};
  if(/^Mito reconocido/.test(lb))return{tab:'myths',q:tx};
  if(/^(Primeros pasos|Misión|Encargo)/.test(lb))return{tab:'steps'};
  if(/^Copias la inscripción/.test(lb))return{tab:'places',q:tx};
  if(/^Bosque · /.test(lb))return{tab:'places',q:lb.replace(/^Bosque · /,'')};
  if(/^Llega el /.test(lb))return{tab:'fiestas'};
  if(/^★ Logro · /.test(lb))return{codex:1,q:lb.replace(/^★ Logro · /,'')};
  return null;}
function tlkHit(e){if(!e)return;e.scrollIntoView({block:'center'});e.classList.add('jHit');setTimeout(()=>e.classList.remove('jHit'),2800);}
function tlkFind(root,q){if(!root||!q)return null;const n=q.toLowerCase().slice(0,40);return[...root.querySelectorAll('.entry,.curio,.entries>div,div')].reverse().find(x=>x.children.length<12&&x.textContent.toLowerCase().includes(n))||null;}
function toastOpen(T){if(!T)return;try{
  if(T.codex){eduCodex();setTimeout(()=>{const c=$('codex');tlkHit(tlkFind(c,T.q)||[...(c?c.querySelectorAll('h4'):[])].find(h=>h.textContent==='Logros'));},90);return;}
  openJournal(T.tab);if(T.q)setTimeout(()=>tlkHit(tlkFind($('journal'),T.q)),90);}catch(e){console.warn('toastOpen',e);}}
{const st=document.createElement('style');st.textContent='#toast .tlink{pointer-events:auto;cursor:pointer}#toast .tlink:hover{border-left-color:#f0c890}#toast .thint{display:block;margin-top:5px;color:#f0c890;font-size:.78rem;letter-spacing:.02em}.jHit{outline:2px solid #f0c890;outline-offset:3px;border-radius:4px;transition:outline-color .4s}';document.head.appendChild(st);
 const t0=toast;toast=function(html){t0(html);try{const T=toastTarget(html);if(!T)return;const d=$('toast').lastElementChild;if(!d)return;d.classList.add('tlink');
   const h=document.createElement('small');h.className='thint';const w=T.codex?'el Códice':'el Diario';h.textContent=isTouch?'Toca para abrirlo en '+w:'[Y] Abrir en '+w;d.appendChild(h);
   TLK.last={T,d,until:performance.now()+5200};d.addEventListener('click',e=>{e.stopPropagation();d.remove();TLK.last=null;toastOpen(T);});}catch(e){}};
 if(!isTouch){const b=$('tutSkip');if(b)b.textContent='Saltar el tutorial (tecla Retroceso)';}}
// ============================================================ LA CURIA JULIA POR DENTRO: el altar y la estatua de la Victoria (Augusto, 29 a.C.)
function curiaSetup(){if(MODE!=='roma'||!CURIA.o)return;const o=CURIA.o;egxObj(o.x,o.z-6.4,CURIA.gy+1.6,'cur:altar','El altar de la Victoria','Curia Julia',2.8);egxObj(o.x+5.5,o.z+6,CURIA.gy+1.6,'cur:sala','La sala del Senado','Curia Julia',2.6);}
{const f=colSetup;colSetup=function(){f();try{curiaSetup();}catch(e){console.warn('curia',e);}};}
function curAct(o){const ro=()=>[['La Victoria y su altar',curVic,'quiz'],['El escudo de oro',curEsc,'quiz'],['Cómo se vota aquí',curVoto,'quiz'],vmBye];
  const z=state.seen||(state.seen={});if(!z.curia){z.curia=1;save();qAdd('so',1,'Has entrado en la Curia.');}
  if(o.act==='cur:sala')return vmS('🏛','La sala del Senado','Curia Julia · año 80 d.C.','<p>Una sala alta y sobria, más larga que ancha, con suelo de mármol de colores. A los lados, tres gradas bajas y anchas con bancos: ahí se sientan los senadores, unos seiscientos cuando están todos, aunque casi nunca están todos. Al fondo, en el tribunal, se sienta el cónsul que preside.</p><p>Las puertas de bronce se quedan abiertas durante las sesiones: desde fuera, en el Comicio, la gente oye los discursos, pero no entra.</p><p class="sub">El edificio de ladrillo que se conserva hoy en el Foro no es este: es la reconstrucción de Diocleciano, tras el incendio del año 283. La planta, la altura y las gradas eran parecidas.</p>',ro());
  vmS('✦','El altar de la Victoria','Curia Julia','<p>Al fondo, sobre un globo, una Victoria de oro con alas extendidas ofrece una corona. Delante, un pequeño altar de mármol donde arde incienso.</p><p>Elige qué quieres saber.</p>',ro());}
function curVic(){vmS('✦','La Victoria de Tarento','Octavio, después de Accio',
  '<p>El 2 de septiembre del 31 a.C., en Accio, la flota de Octavio derrotó a Marco Antonio y Cleopatra. Dos años después, el 28 de agosto del 29 a.C., Octavio inauguró esta Curia, que había empezado su padre adoptivo, Julio César, y puso dentro la estatua de la <b>Victoria</b> que los romanos se habían llevado de Tarento, y la adornó con botín de Egipto (Dion Casio, 51, 22).</p>'+
  '<p>Delante de la estatua está su <b>altar</b>. Augusto ordenó que cada senador, antes de sentarse, quemara incienso y ofreciera vino en el altar del dios del templo donde se reunía el Senado (Suetonio, <i>Augusto</i> 35, 3). Así, cada sesión empieza con un gesto ante la Victoria de Accio: el Senado delibera bajo la victoria que dio a Roma un solo señor.</p>'+
  '<p class="sub">Lo que todavía no sabe nadie (dentro de tres siglos): en el 382 el emperador Graciano, cristiano, hará retirar el altar; en el 384 el senador Símaco pedirá que lo devuelvan y el obispo Ambrosio de Milán se opondrá (Símaco, <i>Relatio</i> 3; Ambrosio, <i>Cartas</i> 17 y 18). Será uno de los últimos debates entre la religión antigua y la nueva.</p>',
  [['Volver',()=>curAct({act:'cur:altar'}),'quiz'],vmBye]);}
function curEsc(){vmS('◎','El escudo de oro','clupeus virtutis','<p>Encima de la Victoria cuelga un escudo de oro. En el 27 a.C. el Senado y el pueblo se lo regalaron a Augusto y lo colocaron en esta Curia. Su inscripción alababa cuatro virtudes: el valor, la clemencia, la justicia y la piedad (<i>virtus, clementia, iustitia, pietas</i>). Lo cuenta el propio Augusto en sus <i>Res Gestae</i> (34).</p><p class="sub">En Arlés (Francia) se encontró una copia en mármol de este escudo.</p>',[['Volver',()=>curAct({act:'cur:altar'}),'quiz'],vmBye]);}
function curVoto(){vmS('⚖','Cómo se vota aquí','el Senado en el año 80','<p>El cónsul presenta el asunto y pide la opinión (<i>sententia</i>) a los senadores por orden de rango: primero a los antiguos cónsules, después a los antiguos pretores, y así hacia abajo. Los más jóvenes, como Tácito, casi nunca llegan a hablar.</p><p>Para votar no se levanta la mano: los senadores se levantan y se ponen junto al que defiende la opinión que apoyan. Se llama «ir con los pies a una opinión» (<i>pedibus in sententiam ire</i>). Gana el lado con más gente.</p><p class="sub">En el año 80 manda el emperador Tito. El Senado aún debate y vota, pero las decisiones importantes las toma el emperador.</p>',[['Volver',()=>curAct({act:'cur:altar'}),'quiz'],vmBye]);}
{const f=egxAct0;egxAct0=function(o){if(String(o.act).startsWith('cur:'))return curAct(o);return f(o);};}
function curTick(dt){if(MODE!=='roma'||!CURIA.o)return;const o=CURIA.o,L=ROMA.bodaLight;if(!L)return;
  const inside=Math.abs(player.x-o.x)<8.6&&Math.abs(player.z-o.z)<13.4&&player.feet>CURIA.gy+1;
  if(inside&&ui!=='episode'){const t=performance.now()/1000,k=0.85+0.15*Math.sin(t*9)*Math.sin(t*5.3);L.position.set(o.x,CURIA.gy+4.5,o.z-6.5);L.intensity=1.5*k;L.distance=30;CURIA.on=true;if(CURIA.fl)CURIA.fl.scale.set(1,k*1.2,1);}
  else if(CURIA.on){L.intensity=0;CURIA.on=false;}}
