// ============================================================ HERMES (MERCURIO): DIEZ ENCARGOS Y EL CADUCEO
// Hermes espera en el ágora, junto a las Hermas (el pórtico del noroeste, lleno de hermas votivas); en Roma, Mercurio, junto a su templo
// al pie del Aventino, frente al Circo Máximo (dedicado en el 495 a.C.; Livio II 21 y 27). Da diez encargos, uno detrás de otro, cada uno
// sobre un aspecto del dios y con una mecánica distinta:
//  1 el heraldo (carrera contra reloj) · 2 los caminos y sus montones de piedras (exploración) · 3 las vacas de Apolo (pastoreo y sigilo:
//  las vacas andan hacia atrás, como en el himno homérico) · 4 la lira (recoger y fabricar) · 5 los pesos del mercado (balanza) ·
//  6 el intérprete (emparejar palabras) · 7 Argos (ritmo con la siringa) · 8 el psicopompo (escoltar un alma) · 9 el atleta (carrera de
//  anillos) · 10 los acertijos del mensajero (adivinar y llegar)
// Al acabar, el caduceo: va a la barra de objetos y se ve en la mano; con él se cruzan las puertas cerradas a los vivos (el santuario de
// las Venerables, el mundus: 204) y, empuñado (R), los animales que tienes delante retroceden andando hacia atrás.
const HM={F:null,o:null,ents:[],tgt:null,t:0,timer:null,run:null,ready:false,cad:false,cadT:0};
function hmz(){if(!state.hermes||typeof state.hermes!=='object')state.hermes={m:0,on:false,met:false};return state.hermes;}
function hmName(){return MODE==='roma'?'Mercurio':'Hermes';}
function hmRO(){return MODE==='roma';}
function hmPlace(re,dx,dz){let p=null;if(typeof PLACES!=='undefined')p=PLACES.find(q=>isFinite(q.x)&&Math.abs(q.x)<4000&&Math.abs(q.z)<4000&&re.test((q.name||'')+' '+(q.id||'')));
  const b=p||{x:HM.F?HM.F.g.position.x:0,z:HM.F?HM.F.g.position.z:0};let f=null;try{f=findFree(b.x+(dx||0),b.z+(dz||0),1);}catch(e){}return f?{x:f[0],z:f[1],name:p?p.name:'',ok:!!p}:{x:b.x+(dx||0),z:b.z+(dz||0),name:p?p.name:'',ok:!!p};}
// una columna de luz (azul en Atenas, dorada en Roma) que marca dónde ir; también la sigue la brújula
function hmBeacon(x,z,col){const g=new THREE.Group();g.position.set(x,floorAt(x,z),z);const c=new THREE.Color(col||(hmRO()?'#ffc860':'#9fe0ff'));
  const m=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.35,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
  const cy=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.9,26,16,1,true),m);cy.position.y=13;g.add(cy);
  const r=new THREE.Mesh(new THREE.RingGeometry(1.1,1.5,24),m);r.rotation.x=-Math.PI/2;r.position.y=0.06;g.add(r);g.userData.m=m;scene.add(g);HM.ents.push(g);return g;}
function hmClear(){for(const e of HM.ents){if(e.parent)e.parent.remove(e);}HM.ents.length=0;HM.tgt=null;hmTimer(null);}
function hmNear(x,z,r){return Math.hypot(player.x-x,player.z-z)<(r||2.2);}
function hmTimer(s){HM.timer=s;let d=$('hmTimer');if(s===null){if(d)d.remove();return;}if(!d){d=document.createElement('div');d.id='hmTimer';
  d.style.cssText='position:fixed;left:50%;top:calc(58px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:31;padding:4px 14px;border-radius:16px;background:rgba(20,15,10,.7);border:1px solid #d9a948;color:#f3e6cf;font:600 17px Alegreya,Georgia,serif;pointer-events:none';document.body.appendChild(d);}
  d.textContent='⏳ '+Math.max(0,Math.ceil(s))+' s';}
function hmMsg(h){try{MSG.lastIn=performance.now();}catch(e){}toast('<span class="label">'+hmName()+'</span><br>'+h);}
function hmDlg(glyph,title,html,opts){dlg={n:null};ui='dialog';releasePointer();$('dGlyph').textContent=glyph||'☤';setName(hmName(),false);$('dTitle').textContent=title;$('dBody').innerHTML=html;
  const o=$('dOpts');o.innerHTML='';(opts||[['Seguir',closeDialog]]).forEach(([t,fn],i)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(i+1)+'</span><span>'+t+'</span>';b.onclick=fn;o.appendChild(b);});$('dialog').hidden=false;}
// ---------------------------------------------------------------- los diez encargos
const HM_M=[
 {id:'heraldo',t:'El heraldo',asp:'mensajero de los dioses',
  intro:()=>'<p>«Soy el heraldo de los dioses y el patrón de los heraldos de los hombres: los que llevan los mensajes y nadie puede tocar, ni en la guerra. Llevan mi vara, el <b>kerýkeion</b>. Lleva tú este mensaje, y rápido: '+(hmRO()?'a la Curia, donde se reúne el Senado':'a la Pnyx, donde se reúne la Asamblea')+'. Si llegas tarde, no vale.»</p><p class="sub">Los heraldos (kérykes) eran inviolables; el caduceo era su insignia. Ver Heródoto VII 133–136 (los heraldos de Darío) y Tucídides I 146.</p>',
  setup(R){const p=hmRO()?hmPlace(/Curia|Comicio|Rostra/i,4,4):hmPlace(/Pnyx|Bulé|Buleuterio|Tholos/i,4,4);R.p=p;R.b=hmBeacon(p.x,p.z);HM.tgt=p;const d=Math.hypot(p.x-player.x,p.z-player.z);R.T=Math.max(30,d/4.2+20);},
  tick(R,dt){R.T-=dt;hmTimer(R.T);if(hmNear(R.p.x,R.p.z,3))return 'ok';if(R.T<=0)return 'fail';},
  win:'<p>«¡Llegaste a tiempo! Así corría Filípides de Atenas a Esparta para pedir ayuda antes de Maratón: dos días de camino (Heródoto VI 105–106).»</p>'},
 {id:'caminos',t:'Los montones del camino',asp:'dios de los caminos',
  intro:()=>'<p>«En las encrucijadas y en los caminos los viajeros dejan una piedra al pasar: se forman montones, los <b>hermaia</b>, y en ellos se pone a veces una cabeza mía. Por eso me llaman Hermes. Ve a tres caminos que salen de la ciudad y deja tu piedra en cada uno.»</p><p class="sub">Así lo explican los antiguos (Cornuto, <i>Compendio de teología griega</i> 16); y por eso se llama «hermaion» al hallazgo afortunado en el camino.</p>',
  setup(R){const re=hmRO()?[/Puerta Capena|Capena/i,/Puerta Esquilina|Esquilin/i,/Puerta Colina|Colina|Salaria/i]:[/Dípilon|Dipilon/i,/Puerta de Acarnas|Acarnas|Diomea/i,/Puerta Itonia|Itonia|Falero|Pireo/i];
    R.pts=re.map((r,i)=>hmPlace(r,6+i,6-i));R.pts.forEach(p=>{p.b=hmBeacon(p.x,p.z);});R.n=0;},
  tick(R){let best=null,bd=1e9;for(const p of R.pts){if(p.done)continue;const d=Math.hypot(p.x-player.x,p.z-player.z);if(d<bd){bd=d;best=p;}
    if(d<3){p.done=1;R.n++;if(p.b.parent)p.b.parent.remove(p.b);const s=new THREE.Mesh(new THREE.DodecahedronGeometry(0.7,0),lam('#9a8e7a'));s.position.set(p.x,floorAt(p.x,p.z)+0.4,p.z);scene.add(s);try{sfxCoin();}catch(e){}hmMsg('Dejas tu piedra en el montón ('+R.n+' de 3).');}}
    HM.tgt=best;if(R.n>=3)return 'ok';},
  win:'<p>«Tres piedras, tres caminos. Quien encuentra algo en el camino dice «¡Hermes común!» (koinós Hermês): lo que se halla es de todos.»</p><p class="sub">El dicho aparece en Teofrasto, <i>Caracteres</i> 30,9.</p>'},
 {id:'vacas',t:'Las vacas de Apolo',asp:'el niño ladrón',
  intro:()=>'<p>«El mismo día que nací, salí de la cuna y robé cincuenta vacas a mi hermano Apolo. Para que no siguiera las huellas, las hice andar hacia atrás, y yo me até ramas a los pies. Ahora te toca a ti: acércate a las vacas, que te seguirán, y llévalas al establo sin que el pastor de Apolo te vea de cerca.»</p><p class="sub"><i>Himno homérico a Hermes</i> 68–86. Al final Apolo lo descubre y Hermes le regala la lira para hacer las paces.</p>',
  setup(R){const P0={x:HM.F.g.position.x,z:HM.F.g.position.z},c=hmPlace(/zzz/,-40,30),dst=hmPlace(/zzz/,30,-45);R.cows=[];R.dst=dst;R.b=hmBeacon(dst.x,dst.z);
    for(let i=0;i<4;i++){const f=findFree(c.x+rr(-4,4),c.z+rr(-4,4),0.8);const b=makeBeast('vaca',scene,f[0],f[1],rr(0,6.28));b.position.y=floorAt(f[0],f[1]);HM.ents.push(b);R.cows.push({b,x:f[0],z:f[1],h:{x:f[0],z:f[1]},fol:false});}
    const gp=hmPlace(/zzz/,-5,0);R.g={x:(c.x+dst.x)/2+12,z:(c.z+dst.z)/2,a:0};const gd=makePerson({chiton:'#d8c9a0',short:true,noHimation:true,hair:'#d9b44a',staff:true});gd.position.set(R.g.x,floorAt(R.g.x,R.g.z),R.g.z);scene.add(gd);HM.ents.push(gd);R.g.m=gd;
    const lb=labelSprite('El pastor de Apolo','no dejes que te vea de cerca',false);lb.position.y=2.3;gd.add(lb);HM.tgt=c;R.c=c;},
  tick(R,dt){const P=player;R.g.a+=dt*0.35;const gx=R.g.x+Math.cos(R.g.a)*10,gz=R.g.z+Math.sin(R.g.a)*10;R.g.m.position.set(gx,floorAt(gx,gz),gz);R.g.m.rotation.y=R.g.a+Math.PI/2;
    let lead=0,home=0,i=0;
    for(const c of R.cows){if(!c.fol&&Math.hypot(c.x-P.x,c.z-P.z)<6){c.fol=true;hmMsg('Una vaca te sigue… andando hacia atrás.');}
      if(c.fol){lead++;const k=i++,tx=P.x+Math.sin(P.yaw)*(2.2+k*1.4),tz=P.z+Math.cos(P.yaw)*(2.2+k*1.4),dx=tx-c.x,dz=tz-c.z,d=Math.hypot(dx,dz);
        if(d>0.4){const v=Math.min(d,dt*Math.min(4.5,d*1.2));c.x+=dx/d*v;c.z+=dz/d*v;c.b.rotation.y=Math.atan2(-dx,-dz);}
        c.b.position.set(c.x,floorAt(c.x,c.z),c.z);if(c.b.userData.qa)c.b.userData.qa.rev=true;if(Math.hypot(c.x-R.dst.x,c.z-R.dst.z)<5)c.in=true;}
      if(c.in)home++;}
    HM.tgt=lead<R.cows.length?R.c:R.dst;
    if(lead&&Math.hypot(P.x-gx,P.z-gz)<9){for(const c of R.cows){c.fol=false;c.in=false;c.x=c.h.x;c.z=c.h.z;c.b.position.set(c.x,floorAt(c.x,c.z),c.z);}hmMsg('¡El pastor te ha visto! Las vacas vuelven al prado. Rodéalo de lejos.');}
    if(home>=R.cows.length)return 'ok';},
  win:'<p>«Apolo me descubrió igual, claro: es el dios que todo lo ve. Pero cuando oyó la lira que yo había inventado, se la quedó a cambio de las vacas, y nos hicimos amigos.»</p>'},
 {id:'lira',t:'La lira',asp:'inventor de la lira',
  intro:()=>'<p>«Al salir de la cueva encontré una tortuga, le saqué la concha, le puse dos brazos de caña, un puente y siete cuerdas de tripa de oveja: la primera lira. Tráeme lo mismo: un caparazón de tortuga, cañas del río y tripa del carnicero.»</p><p class="sub"><i>Himno homérico a Hermes</i> 24–54. En griego, la lira de concha se llamaba <i>chélys</i>, «tortuga».</p>',
  setup(R){R.items=[['un caparazón de tortuga',hmRO()?hmPlace(/Palatin/i,9,-7):hmPlace(/Areópago|Ninfas|Colono/i,9,-7)],['cañas',hmRO()?hmPlace(/Tíber|Tiberina|puerto|Emporio/i,6,6):hmPlace(/Erídano|Iliso|río|fuente/i,6,6)],['tripa de oveja',hmRO()?hmPlace(/macellum|Boario|mercado/i,5,-5):hmPlace(/mercado|ágora|Ágora/i,30,-20)]].map(([n,p])=>({n,x:p.x,z:p.z,b:hmBeacon(p.x,p.z)}));R.n=0;},
  tick(R){let best=null,bd=1e9;for(const it of R.items){if(it.got)continue;const d=Math.hypot(it.x-player.x,it.z-player.z);if(d<bd){bd=d;best=it;}
    if(d<2.5){it.got=1;R.n++;if(it.b.parent)it.b.parent.remove(it.b);try{sfxCoin();}catch(e){}hmMsg('Consigues '+it.n+' ('+R.n+' de 3).');}}
    HM.tgt=best||{x:HM.F.g.position.x,z:HM.F.g.position.z};if(R.n>=3&&hmNear(HM.F.g.position.x,HM.F.g.position.z,5))return 'ok';},
  win:'<p>«¡Una chélys! Siete cuerdas, como las Pléyades, mis tías. Tócala.»</p>',after:()=>{try{sfxLyre(392,[0,2,4,7,4,2,0],0.12,0.32);}catch(e){}}},
 {id:'pesos',t:'Los pesos del mercado',asp:'dios del comercio',
  intro:()=>hmRO()?'<p>«Soy el dios de los mercaderes: <i>Mercurius</i>, de <i>merx</i>, la mercancía. Un comerciante quiere engañar con la balanza. Pon exactamente el peso que te pido con las pesas que hay.»</p><p class="sub">En Roma, la libra (unos 327 g) se divide en 12 onzas (unciae). Festo deriva el nombre de Mercurio de merx.</p>':'<p>«Soy el dios del ágora y de los que compran y venden. Los metronómoi vigilan que nadie engañe con las pesas. Pon en la balanza exactamente lo que te pido.»</p><p class="sub">En el ágora de Atenas se han encontrado pesas oficiales de bronce marcadas DEMOSION («público»); Aristóteles, <i>Constitución de los atenienses</i> 51, describe a los inspectores.</p>',
  puzzle:true},
 {id:'interprete',t:'El intérprete',asp:'la palabra y la traducción',
  intro:()=>'<p>«De mi nombre viene <b>hermeneús</b>, el intérprete: el que pasa las palabras de una lengua a otra y explica lo oscuro. Demuéstrame que sabes qué significan estas palabras.»</p><p class="sub">La etimología Hermes → hermeneúein la da Platón, <i>Crátilo</i> 407e–408b (los antiguos la creían; los lingüistas de hoy la discuten).</p>',
  puzzle:true},
 {id:'argos',t:'Argos de los cien ojos',asp:'Argifonte, el que mató a Argos',
  intro:()=>'<p>«Hera puso a Argos, que tenía cien ojos y nunca los cerraba todos, a vigilar a la vaca Ío. Zeus me mandó liberarla: le toqué la siringa hasta que se durmieron todos sus ojos. Ven: cerca de aquí hay un guardián que no duerme. Toca a tiempo, cuando el anillo se cierre sobre el círculo.»</p><p class="sub">Ovidio, <i>Metamorfosis</i> I 668–721.'+(hmRO()?' En Roma, el barrio del <b>Argileto</b> se explicaba como «la muerte de Argos» (Argi letum): Virgilio, <i>Eneida</i> VIII 345–346.':'')+'</p>',
  setup(R){const p=hmRO()?hmPlace(/Argilet|Subura/i,5,5):hmPlace(/Hefesteion|Hefesto|Colono/i,6,6);R.p=p;R.b=hmBeacon(p.x,p.z);HM.tgt=p;
    const a=makePerson({chiton:'#5a6a3a',short:true,noHimation:true,hair:'#2a1e14',beard:true,staff:true});a.position.set(p.x+2,floorAt(p.x+2,p.z),p.z);scene.add(a);HM.ents.push(a);
    const lb=labelSprite('Argos','el guardián que no duerme',true);lb.position.y=2.4;a.add(lb);R.a=a;},
  tick(R){if(!R.play&&hmNear(R.p.x,R.p.z,4)){R.play=true;hmRhythm(ok=>{R.res=ok?'ok':'retry';});}if(R.res==='ok')return 'ok';if(R.res==='retry'){R.res=null;R.play=false;hmMsg('Argos sigue con algún ojo abierto. Aléjate un poco y vuelve a intentarlo.');player.x+=3;}},
  win:'<p>«Se han cerrado los cien ojos. Hera los puso después en la cola del pavo real, su ave: por eso tiene esos ojos pintados.»</p>'},
 {id:'alma',t:'El psicopompo',asp:'el que guía a las almas',
  intro:()=>'<p>«Yo llevo las almas de los muertos hasta la orilla del Aqueronte. Hay un alma que no encuentra el camino: llévala '+(hmRO()?'a las tumbas de la vía Apia':'al Cerámico, el cementerio')+'. Va despacio; si te alejas, se pierde y se para.»</p><p class="sub"><i>Odisea</i> XXIV 1–14: Hermes guía a las almas de los pretendientes con su vara de oro. En los lécitos funerarios áticos aparece Hermes junto a Caronte.</p>',
  setup(R){const s=hmPlace(/zzz/,-15,-15),d=hmRO()?hmPlace(/Apia|Escipiones|Capena|sepulcr/i,8,8):hmPlace(/Cerámico|Ceramico|Dípilon|Eridano/i,10,6);R.d=d;R.b=hmBeacon(d.x,d.z);R.x=s.x;R.z=s.z;
    const m=makePerson({chiton:'#d8e0e8',himation:'#c0ccd8',hair:'#a0a8b0',glow:'#cfe6ff'});m.position.set(s.x,floorAt(s.x,s.z),s.z);m.traverse(o=>{if(o.isMesh&&o.material){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=0.55;}});scene.add(m);HM.ents.push(m);R.m=m;
    const lb=labelSprite('Un alma perdida','síguela… o que te siga',true);lb.position.y=2.3;m.add(lb);HM.tgt={x:s.x,z:s.z};},
  tick(R,dt){const P=player,dx=P.x-R.x,dz=P.z-R.z,d=Math.hypot(dx,dz);if(!R.met&&d<5){R.met=true;hmMsg('El alma te reconoce como guía y te sigue.');}
    if(R.met){if(d>14){if(!R.lost){R.lost=true;hmMsg('El alma se ha quedado atrás, perdida. Vuelve a por ella.');}HM.tgt={x:R.x,z:R.z};}
      else{R.lost=false;HM.tgt=R.d;if(d>2.2){const v=Math.min(d-2,dt*3.2);R.x+=dx/d*v;R.z+=dz/d*v;R.m.rotation.y=Math.atan2(dx,dz);try{personWalk(R.m,performance.now()/250,0.6);}catch(e){}}}
      R.m.position.set(R.x,floorAt(R.x,R.z)+0.15+Math.sin(performance.now()/500)*0.08,R.z);if(Math.hypot(R.x-R.d.x,R.z-R.d.z)<5)return 'ok';}},
  win:'<p>«Ya está en su sitio. Con un óbolo en la boca para el barquero, si su familia se acordó. Gracias, guía.»</p>'},
 {id:'atleta',t:'El atleta',asp:'patrón de la palestra (Enagonios)',
  intro:()=>'<p>«Soy el patrón de los gimnasios y de las palestras, con Heracles: allí hay estatuas mías. Corre y pasa por los cinco anillos de luz antes de que se acabe el tiempo.»</p><p class="sub">Pausanias V 14,9 (altar de Hermes Enagonios en Olimpia); en los gimnasios había hermas de Hermes y de Heracles.</p>',
  setup(R){const c=hmRO()?hmPlace(/Campo de Marte|Circo Flaminio|Panteón|Agripa/i,0,0):hmPlace(/Liceo|Academia|palestra|gimnasio|estadio/i,0,0);R.r=[];for(let i=0;i<5;i++){const a=i/5*TAU,p=(()=>{const f=findFree(c.x+Math.cos(a)*35,c.z+Math.sin(a)*35,1.2);return {x:f[0],z:f[1]};})();p.b=hmBeacon(p.x,p.z,'#ffe08a');R.r.push(p);}R.i=0;R.T=null;HM.tgt=R.r[0];},
  tick(R,dt){const p=R.r[R.i];if(R.T!==null){R.T-=dt;hmTimer(R.T);if(R.T<=0){hmMsg('Se acabó el tiempo. Empieza otra vez por el primer anillo.');R.T=null;R.i=0;R.r.forEach(q=>{q.b.visible=true;});HM.tgt=R.r[0];hmTimer(null);return;}}
    if(hmNear(p.x,p.z,3)){p.b.visible=false;try{sfxCoin();}catch(e){}if(R.i===0)R.T=75;R.i++;if(R.i>=R.r.length)return 'ok';HM.tgt=R.r[R.i];}},
  win:'<p>«¡Ágil como un mensajero! En las fiestas de Atenas había carreras con antorchas y en Roma, carreras de jóvenes en el Campo de Marte.»</p>'},
 {id:'acertijos',t:'Los acertijos del mensajero',asp:'dios astuto',
  intro:()=>'<p>«El último encargo. Te diré tres acertijos: cada uno es un lugar de la ciudad. Contesta, y ve allí.»</p>',puzzle:true}];
// ---------------------------------------------------------------- puzles en el diálogo
function hmPesos(done){const ro=hmRO(),W=ro?[1,2,3,6]:[1,2,4,6],U=ro?'onzas':'óbolos',G=ro?[5,9,12]:[7,11,13],R={i:0,sel:new Set()};
  const draw=()=>{const g=G[R.i],s=[...R.sel].reduce((a,b)=>a+W[b],0);
    hmDlg('⚖','La balanza ('+(R.i+1)+' de 3)','<p>Pon exactamente <b>'+g+' '+U+'</b>'+(ro&&g===12?' (una libra)':!ro&&g>=6?' (6 óbolos son una dracma)':'')+'. Ahora: <b>'+s+'</b>.</p><p class="sub">Pulsa las pesas para ponerlas o quitarlas.</p>',
      W.map((w,i)=>[(R.sel.has(i)?'✓ ':'')+'Pesa de '+w+' '+(w===1?U.slice(0,-1):U),()=>{R.sel.has(i)?R.sel.delete(i):R.sel.add(i);draw();}]).concat([['Pesar',()=>{if(s===g){R.i++;R.sel.clear();try{sfxCoin();}catch(e){}if(R.i>=G.length){closeDialog();done(true);}else draw();}else{hmDlg('⚖','No pesa lo justo','<p>La balanza se inclina hacia '+(s>g?'las pesas':'la mercancía')+'. Prueba otra combinación.</p>',[['Volver',draw]]);}}],['Dejarlo por ahora',()=>{closeDialog();done(false);}]]));};draw();}
function hmPalabras(done){const ro=hmRO(),L=ro?[['pater familias','el cabeza de familia'],['cliens','protegido de un patrono'],['tabernae','tiendas de la planta baja'],['libertus','esclavo liberado'],['aedes','templo, casa de un dios']]
    :[['ágora','plaza y mercado'],['oikos','la casa y la familia'],['metoikos','extranjero residente'],['kérykes','heraldos'],['xenía','la hospitalidad']],R={i:0,ok:0};
  const draw=()=>{const [w,m]=L[R.i],others=L.filter(x=>x[0]!==w).map(x=>x[1]),opts=[m,...others.sort(()=>Math.random()-0.5).slice(0,2)].sort(()=>Math.random()-0.5);
    hmDlg('Ε','El intérprete ('+(R.i+1)+' de '+L.length+')','<p>¿Qué significa <b>'+w+'</b>?</p>',opts.map(o=>[o,()=>{if(o===m)R.ok++;R.i++;if(R.i>=L.length){closeDialog();done(R.ok>=4,R.ok);}else draw();}]));};draw();}
function hmAcertijos(R,done){const ro=hmRO(),Q=ro?[
   ['«Tengo un ombligo de piedra y a mí llegan todos los caminos; aquí hablan los oradores subidos en proas de barcos.»',/Foro|Rostra|Comicio/i,['El Foro','El Circo','El Tíber']],
   ['«Me llenan de gritos doscientos cincuenta mil; los carros dan siete vueltas y yo, quieto, miro.»',/Circo/i,['El Circo Máximo','El Capitolio','El Panteón']],
   ['«En mí vive el dios más grande con su esposa y su hija; los generales suben a darme las gracias.»',/Capitolio|Júpiter/i,['El Capitolio','El Aventino','Las termas']]]
  :[['«Soy una roca alta; en mí vive la que nació armada de la cabeza de su padre.»',/Acrópolis|Partenón|Erecteion/i,['La Acrópolis','El Pireo','El Cerámico']],
   ['«Aquí hablan los ciudadanos de pie, sobre una colina, y votan levantando la mano.»',/Pnyx/i,['La Pnyx','El ágora','El Liceo']],
   ['«Soy puerto: por mí entra el trigo que come Atenas, y por mí salen las trirremes.»',/Pireo/i,['El Pireo','El Cerámico','La Academia']]];
  const step=()=>{if(R.k>=Q.length){done(true);return;}const [txt,re,opts]=Q[R.k];hmDlg('?','Acertijo '+(R.k+1)+' de 3','<p>'+txt+'</p>',opts.map((o,i)=>[o,()=>{if(i===0){closeDialog();const p=hmPlace(re,4,4);R.p=p;R.b=hmBeacon(p.x,p.z);HM.tgt=p;hmMsg('Ve a '+o.toLowerCase()+' y busca la luz.');}else{hmDlg('?','No es ese','<p>«Piénsalo otra vez.»</p>',[['Volver',step]]);}}]));};
  R.k=R.k||0;R.step=step;step();}
// ---------------------------------------------------------------- ritmo de la siringa (Argos)
function hmRhythm(done){let d=$('hmRh');if(d)d.remove();d=document.createElement('div');d.id='hmRh';
  d.style.cssText='position:fixed;inset:0;z-index:62;display:flex;align-items:center;justify-content:center;flex-direction:column;background:rgba(10,8,6,.35);color:#f3e6cf;font:600 18px Alegreya,Georgia,serif;user-select:none';
  d.innerHTML='<div style="margin-bottom:14px;text-shadow:0 1px 3px #000">Pulsa (clic, espacio o E) cuando el anillo cubra el círculo · <span id="hmRhN">0</span> de 5</div><div style="position:relative;width:220px;height:220px"><div id="hmRhC" style="position:absolute;left:80px;top:80px;width:60px;height:60px;border-radius:50%;border:3px solid #d9a948;box-sizing:border-box"></div><div id="hmRhR" style="position:absolute;border-radius:50%;border:4px solid #9fe0ff;box-sizing:border-box"></div></div><div id="hmRhE" style="margin-top:12px;font-size:15px;opacity:.85">ojos abiertos: 100</div>';
  document.body.appendChild(d);try{releasePointer();}catch(e){}ui='dialog';let t0=performance.now(),hit=0,miss=0,end=false;const P=1600;
  const loop=()=>{if(end)return;const k=((performance.now()-t0)%P)/P,s=200-k*170,r=$('hmRhR');if(r){r.style.width=r.style.height=s+'px';r.style.left=r.style.top=(110-s/2)+'px';}requestAnimationFrame(loop);};loop();
  const press=e=>{if(e&&e.type==='keydown'&&!(e.code==='Space'||e.code==='KeyE'))return;if(e){e.preventDefault();e.stopPropagation();}const k=((performance.now()-t0)%P)/P,s=200-k*170;
    if(Math.abs(s-60)<16){hit++;try{sfxAulos(520+hit*60,[0,4,7],0.08,0.2);}catch(x){}}else{miss++;}const n=$('hmRhN');if(n)n.textContent=hit;const E=$('hmRhE');if(E)E.textContent='ojos abiertos: '+Math.max(0,100-hit*20);
    if(hit>=5||miss>=6){end=true;removeEventListener('keydown',press,true);d.remove();ui='play';done(hit>=5);}};
  d.addEventListener('pointerdown',press);addEventListener('keydown',press,true);}
// ---------------------------------------------------------------- el desarrollo
function hmStart(){const z=hmz(),M=HM_M[z.m];if(!M)return;closeDialog();hmClear();z.on=true;save();HM.run={M};const R=HM.run;
  if(M.id==='pesos')return hmPesos(ok=>hmEnd(ok));if(M.id==='interprete')return hmPalabras((ok,n)=>{if(!ok)hmMsg('Has acertado '+n+' de 5. Necesitas al menos 4: vuelve a hablar conmigo.');hmEnd(ok);});
  if(M.id==='acertijos'){R.k=0;hmAcertijos(R,()=>{});return;}
  try{M.setup(R);}catch(e){console.warn('hermes',e);}hmMsg(M.t+': ¡en marcha! Sigue la luz y la brújula.');}
function hmEnd(ok){const z=hmz(),R=HM.run;hmClear();HM.run=null;z.on=false;if(!ok){save();return;}const M=HM_M[z.m];z.m++;state.obols=(state.obols||0)+5;save();try{updateStats();}catch(e){}
  try{qAdd('so',1,'Encargo de '+hmName()+': '+M.t);}catch(e){}if(M.after)try{M.after();}catch(e){}
  hmMsg('<b>Encargo cumplido: '+M.t+'</b> (+5 '+(hmRO()?'sestercios':'óbolos')+'). Vuelve a hablar conmigo'+(z.m>=HM_M.length?': tengo algo para ti.':'.'));HM.lastWin=M;}
function hmTick(dt){if(!state)return;if(!HM.ready){hmSetup();return;}const R=HM.run;if(R&&R.M){if(R.M.id==='acertijos'){if(R.p&&hmNear(R.p.x,R.p.z,3.5)){if(R.b&&R.b.parent)R.b.parent.remove(R.b);R.p=null;R.k++;try{sfxCoin();}catch(e){}if(R.k>=3)hmEnd(true);else setTimeout(()=>R.step(),400);}}
    else if(R.M.tick&&ui==='play'){let r;try{r=R.M.tick(R,dt);}catch(e){console.warn('hermes',e);}if(r==='ok')hmEnd(true);else if(r==='fail'){hmMsg('No ha llegado a tiempo. Vuelve a hablar conmigo para intentarlo otra vez.');hmEnd(false);}}}
  for(const e of HM.ents)if(e.userData&&e.userData.m)e.userData.m.opacity=0.28+0.12*Math.sin(performance.now()/300);
  if(HM.F){HM.F.mk.visible=!hmz().on&&hmz().m<=HM_M.length&&!state.caduceo;}
  hmCadTick(dt);}
function hmSetup(){if(typeof PLACES==='undefined'||PLACES.length<20)return;HM.ready=true;const ro=hmRO();const p=ro?hmPlace(/Mercur|Circo/i,-14,-18):hmPlace(/Hermas|Ágora|ágora/i,-12,10);
  const look={chiton:'#efe6d4',himation:ro?'#c9a24a':'#3a6a9a',short:true,hair:'#6a4a2a'};const F=divineFigure(p.x,p.z,look,ro?'#ffe0a0':'#c0ecff',hmName(),ro?'mensajero de los dioses, dios del comercio':'mensajero de los dioses, dios de los caminos',1.15);
  F.lb.visible=false;F.lb.userData.never=1;HM.F=F;const cad=hmCaduceusModel();cad.scale.setScalar(1.2);cad.position.set(0.32,1.0,0.12);F.g.add(cad);
  HM.o=egxObj(p.x,p.z,undefined,()=>hmTalk(),hmName(),'pulsa E para hablar',3.2);}
function hmTalk(){const z=hmz(),ro=hmRO(),nm=hmName();if(HM.run&&HM.run.M){const M=HM.run.M;hmDlg('☤',M.t,'<p>«Sigue con el encargo: '+M.asp+'.»</p>'+(M.intro?M.intro():''),[['Seguir',closeDialog],['Dejarlo y empezar de nuevo más tarde',()=>{hmClear();HM.run=null;z.on=false;save();closeDialog();}]]);return;}
  if(z.m>=HM_M.length){if(!state.caduceo){state.caduceo=1;save();hmGiveCad();
      hmDlg('☤','El caduceo','<p>«Has hecho lo que hace un mensajero: correr, guiar, engañar un poco, hablar bien, guardar la palabra dada. Toma mi vara, el '+(ro?'caduceus':'kerýkeion')+': dos serpientes que se miran, y alas en la punta.»</p><p>«Con él podrás pasar por donde solo pasan los que yo acompaño: '+(ro?'el mundus, la boca del mundo de abajo':'el santuario de las Venerables, bajo el Areópago')+'. Y si lo empuñas ante un animal, se apartará de ti andando hacia atrás, como mis vacas.»</p><p class="sub">Según el himno homérico, Apolo dio a Hermes la vara de oro a cambio de la lira (529–532). Las serpientes aparecen en las imágenes más tarde; el caduceo es la insignia de los heraldos.</p>');return;}
    hmDlg('☤',nm,'<p>«Ya llevas mi caduceo. Úsalo bien: empuñado (R) aparta a los animales; y con él se abren las puertas que estaban cerradas.»</p>');return;}
  const M=HM_M[z.m],first=!z.met;z.met=true;save();
  const head=first?'<p>«'+(ro?'Salve':'Chaîre')+'. Soy '+nm+', hijo de Zeus y de Maya. Voy de los dioses a los hombres y de los vivos a los muertos, protejo los caminos, a los mercaderes… y a los ladrones listos. Si haces diez encargos para mí, te daré algo que solo llevan mis heraldos.»</p>':'';
  const win=HM.lastWin?HM.lastWin.win:'';HM.lastWin=null;
  hmDlg('☤','Encargo '+(z.m+1)+' de '+HM_M.length+' · '+M.t,head+win+M.intro(),[['Acepto: «'+M.t+'»',()=>hmStart()],['Ahora no',closeDialog]]);}
// ---------------------------------------------------------------- el caduceo: modelo, objeto de la barra y efecto en los animales
function hmCaduceusModel(){const g=new THREE.Group(),gold=lam('#d9a948'),dk=lam('#7a5a20');const r=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.015,0.62,8),gold);r.position.y=0.31;g.add(r);
  const k=new THREE.Mesh(new THREE.SphereGeometry(0.026,10,8),gold);k.position.y=0.64;g.add(k);
  for(const s of[-1,1]){const pts=[];for(let i=0;i<=24;i++){const t=i/24,a=t*Math.PI*4*s;pts.push(new THREE.Vector3(Math.cos(a)*0.035,0.08+t*0.46,Math.sin(a)*0.035));}
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),48,0.007,6,false),dk));
    const w=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.004,0.04),gold);w.position.set(s*0.05,0.6,0);w.rotation.z=s*0.5;g.add(w);}
  g.traverse(o=>{if(o.isMesh)o.castShadow=false;});return g;}
Object.assign(HB_SVG,{caduceo:'<path d="M12 3v18"/><circle cx="12" cy="3.5" r="1.2"/><path d="M8 5.5c2 0 3-1 4-1s2 1 4 1"/><path d="M12 8c-3 1-3 3 0 4s3 3 0 4M12 8c3 1 3 3 0 4s-3 3 0 4"/>'});
HB_ITEMS.push({k:'caduceo',n:()=>hmRO()?'Caduceo de Mercurio (caduceus)':'Caduceo de Hermes (kerýkeion)',has:()=>!!(state&&state.caduceo),on:()=>HM.cad,use:()=>{HM.cad=!HM.cad;toast(HM.cad?'Empuñas el caduceo: los animales que tengas delante se apartarán andando hacia atrás.':'Bajas el caduceo.');},how:'Te lo da '+'Hermes (Mercurio en Roma) cuando completas sus diez encargos.'});
function hmGiveCad(){try{const h=hbz(),b=hbBar();if(!b.includes('caduceo')){const i=b.indexOf('vacio');b[i>=0?i:8]='caduceo';}h.got=h.got||{};h.got.caduceo=1;save();hbRender(true);}catch(e){}
  hmMsg('<b>Nuevo objeto: el caduceo.</b> Está en tu barra de objetos: elígelo y pulsa R para empuñarlo. Las puertas que brillaban apagadas ya se abren para ti.');}
{const f=heldModel;heldModel=function(k){if(k==='caduceo'){const key='caduceo';if(HELD.models[key])return HELD.models[key];const g=hmCaduceusModel();g.rotation.x=-0.2;g.traverse(o=>{if(o.isMesh)o.renderOrder=2;});HELD.models[key]=g;return g;}return f.apply(this,arguments);};}
// empuñado: los animales de delante (la fauna de calles y campos, 052) retroceden de cara al jugador
function hmCadTick(dt){if(!HM.cad||!state.caduceo||typeof FAUNA==='undefined')return;try{const it=hbSlots()[HBAR.sel];if(!it||it.k!=='caduceo'){HM.cad=false;return;}}catch(e){}
  const P=player,fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);
  for(const F of FAUNA){const g=F.A&&F.A.g;if(!g||!g.visible)continue;const dx=g.position.x-P.x,dz=g.position.z-P.z,d=Math.hypot(dx,dz);if(d>11||d<0.1)continue;if((dx*fx+dz*fz)/d<0.35)continue;
    const nx=g.position.x+dx/d*dt*1.3,nz=g.position.z+dz/d*dt*1.3;if(!isFree(nx,nz,0.3))continue;g.position.x=nx;g.position.z=nz;if(!F.fixedY)g.position.y=floorAt(nx,nz);
    g.rotation.y=Math.atan2(-dx,-dz);F.x=nx;F.z=nz;F.cx=nx;F.cz=nz;F.tx=nx;F.tz=nz;F.w=1;F.cadT=performance.now();if(g.userData.qa)g.userData.qa.rev=true;}
  for(const F of FAUNA){const g=F.A&&F.A.g;if(g&&g.userData.qa&&g.userData.qa.rev&&F.cadT&&performance.now()-F.cadT>600){g.userData.qa.rev=false;F.cadT=0;}}}
// la brújula apunta al encargo de Hermes mientras dura
{const f=guideTarget;guideTarget=function(){if(HM.run&&HM.tgt&&isFinite(HM.tgt.x))return {x:HM.tgt.x,z:HM.tgt.z};return f.apply(this,arguments);};}
{const f=uxTick;uxTick=function(dt){f(dt);try{hmTick(dt);}catch(e){if(!HM.err){HM.err=String(e&&e.stack||e).slice(0,300);console.warn('hermes',e);}}};}
// el empuje del caduceo se aplica también justo después del movimiento propio de la fauna (si no, su paso lo deshace)
{const f=faunaTick;faunaTick=function(dt){const r=f.apply(this,arguments);try{if(HM.cad)hmCadTick(0);}catch(e){}return r;};}
