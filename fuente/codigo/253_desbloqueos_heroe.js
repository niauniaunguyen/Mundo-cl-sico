// ============================================================ LO QUE SE DESBLOQUEA CON LAS LEYENDAS (23/11: «aplícalos todos»)
//  1. Pegaso, montura voladora (al vencer todas las leyendas del modo): Z para montar y desmontar fuera de los portales. Vuela al doble de
//     velocidad que las alas y sin límite de altura: la cera no se derrite. De noche, si subes mucho, llegas cerca de tu estrella.
//  2. Objetos de héroe (cada uno al vencer su leyenda; sirven en todos los portales):
//     · la piel del león de Nemea: en cada leyenda, el primer golpe no cuenta (aguantas cuatro en vez de tres);
//     · las sandalias aladas de Perseo (Medusa): un segundo salto en el aire, en todo el juego (Hesíodo, Escudo 220; Apolodoro II 4,2);
//     · el casco de Hades (Cerbero): Z dentro de un portal, 5 s en que nada te alcanza (Ilíada V 844-845; Apolodoro II 4,2); se recarga en 30 s;
//     · los crótalos de bronce (aves del Estínfalo): R dentro de cualquier portal, las criaturas se quedan quietas 4 s; se recargan en 15 s.
//  3. El agón de las leyendas (con el título de Kallínikos/Victor): cinco leyendas vencidas al azar seguidas, de 10 orbes cada una y cada vez
//     más difíciles, contra el reloj. Se empieza desde la pestaña Leyendas del diario. Récord personal.
//  4. «Como en el mito» (con la estrella): al entrar en una leyenda ya vencida puedes elegir la versión difícil: la criatura empieza al
//     máximo y solo aguantas dos golpes. Premio: la corona de oro de esa leyenda.
const PEGR={on:false,g:null,starT:0},HEROI={hel:0,helCd:0,cro:0,dj:0},AGON={on:false,list:[],i:0,t0:0,next:0};
function premz2(){return premz();}
function heroHas(k){return premWon(k);}
// ---- 1. Pegaso
function pegrOwn(){return !!premz().star;}
function pegrToggle(){if(ui!=='play')return;if(typeof legIn==='function'&&legIn())return;if(!pegrOwn()){toast('Pegaso solo se deja montar por quien ha vencido todas las leyendas sin herir a nadie.');return;}
  if(PEGR.on){PEGR.on=false;FLY.on=false;if(PEGR.g)PEGR.g.visible=false;toast('Pegaso baja y se aleja al trote: volverá cuando lo llames (Z).');return;}
  if(MOUNT.riding){toast('Baja antes del caballo.');return;}if(player.feet-terrainH(player.x,player.z)>300){toast('Aquí dentro no hay sitio para Pegaso: sal al aire libre.');return;}
  if(!PEGR.g){const Q=(typeof crbHas==='function'&&crbHas('pegaso'))?crbQuad({g:scene},'pegaso',1.0):null;PEGR.g=Q?Q.g:herSimple({g:scene},'#f0f0ee',1.2,1.1).g;PEGR.Q=Q;}
  PEGR.on=true;FLY.on=true;player.vy=5;player.grounded=false;PEGR.g.visible=true;toast('<span class="label">Pegaso</span><br>Montas en Pegaso. Espacio para subir, C para bajar, Shift para ir más deprisa. Z para bajarte.');}
function pegrTick(dt,t){if(!PEGR.g)return;if(PEGR.on&&!FLY.on){PEGR.on=false;}PEGR.g.visible=PEGR.on;if(!PEGR.on)return;const P=player;PEGR.g.position.set(P.x,P.feet-1.25,P.z);PEGR.g.rotation.y=P.yaw+Math.PI;
  const Q=PEGR.Q;if(Q&&Q.wings&&Q.wings.length===2){const fl=Math.sin(t*6)*0.6;Q.wings[0].rotation.z=fl;Q.wings[1].rotation.z=-fl;}if(Q&&Q.legs)Q.legs.forEach((l,j)=>{l.rotation.x=0.6+(j>1?-1.0:0);});}
function pegrAlt(alt){if(alt>900){player.feet=terrainH(player.x,player.z)+900;player.vy=Math.min(0,player.vy);}
  if(alt>600&&typeof DAYF!=='undefined'&&DAYF<0.3&&premz().star&&!premz().near){premz().near=1;save();toast('<span class="label">'+premz().star+'</span><br>Desde aquí arriba, tu estrella brilla más que ninguna. Pegaso relincha: nadie ha subido tan alto sin quemarse las alas.');try{qAdd('kl',2,'Has subido al cielo a lomos de Pegaso.');}catch(e){}}}
addEventListener('keydown',e=>{if(e.code!=='KeyZ'||e.repeat||typeof ui==='undefined'||ui!=='play')return;if(typeof SW!=='undefined'&&SW.seg)return;
  if(typeof legIn==='function'&&legIn()){heroHelmet();e.stopImmediatePropagation();e.preventDefault();return;}pegrToggle();e.stopImmediatePropagation();e.preventDefault();},true);
// ---- 2. objetos de héroe
{const f=legHurt;legHurt=function(){if(heroHas('leon')&&!LEY.skinUsed&&LEY.on){LEY.skinUsed=true;LEY.inv=1.2;try{legSfx('clang');}catch(e){}toast('<span class="label">La piel del león</span><br>La piel del león de Nemea para el golpe: ninguna arma la atravesaba.');return;}
  if(HEROI.hel>0){LEY.inv=0.5;return;}const r=f.apply(this,arguments);if(LEY.hard&&LEY.on&&LEY.hits>=2){try{legLose();}catch(e){}}return r;};}
{const f=legStart;legStart=function(){const r=f.apply(this,arguments);try{LEY.skinUsed=false;const L=LEG[LEY.kind];
  if(LEY.hard&&L&&L.onOrb){for(const n of[4,8,12])try{L.onOrb.call(L,n);}catch(e){}}
  if(AGON.on&&L&&L.onOrb){for(let i=1;i<=AGON.i;i++)try{L.onOrb.call(L,i*4);}catch(e){}LEY.GOAL=10;}else LEY.GOAL=20;
  const items=[heroHas('leon')?'piel del león (el primer golpe no cuenta)':'',heroHas('medusa')?'sandalias aladas (doble salto)':'',heroHas('cerbero')?'casco de Hades (Z)':'',heroHas('aves')&&LEY.kind!=='aves'&&LEY.kind!=='argos'?'crótalos (R)':''].filter(Boolean);
  if(items.length)toast('<span class="label">Llevas contigo</span><br>'+items.join(' · ')+(LEY.hard?'<br><b>Como en el mito</b>: solo aguantas dos golpes.':'')+(AGON.on?'<br><b>Agón</b> '+(AGON.i+1)+' de '+AGON.list.length+': 10 orbes.':''));}catch(e){}return r;};}
function heroHelmet(){if(!heroHas('cerbero')){toast('El casco de Hades se gana venciendo a Cerbero.');return;}if(HEROI.helCd>0){toast('El casco aún no está listo ('+Math.ceil(HEROI.helCd)+' s).');return;}
  HEROI.hel=5;HEROI.helCd=30;LEY.inv=5;toast('<span class="label">El casco de Hades</span><br>Te vuelves invisible: durante unos segundos, nada te alcanza.');heroVeil(true);}
function heroVeil(on){if(!HEROI.veil){const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:27;background:radial-gradient(ellipse at center,rgba(40,60,110,0) 40%,rgba(30,40,90,.55) 100%);transition:opacity .4s;opacity:0';document.body.appendChild(d);HEROI.veil=d;}HEROI.veil.style.opacity=on?1:0;}
function heroCrotalos(){if(!heroHas('aves')){return false;}if(HEROI.cro>0){toast('Los crótalos aún no están listos ('+Math.ceil(HEROI.cro)+' s).');return true;}HEROI.cro=15;LEY.grace=Math.max(LEY.grace,4);try{legSfx('crot');}catch(e){}
  toast('<span class="label">Crótalos de Atenea</span><br>¡Clac, clac! Las criaturas se quedan quietas un momento.');return true;}
addEventListener('keydown',e=>{if(e.code!=='KeyR'||e.repeat||typeof legIn!=='function'||!legIn()||ui!=='play'||LEY.kind==='aves'||LEY.kind==='argos')return;if(heroCrotalos()){e.stopImmediatePropagation();e.preventDefault();}},true);
{const f=jump;jump=function(){const P=player;if(ui==='play'&&!FLY.on&&!P.grounded&&heroHas('medusa')&&!HEROI.dj&&!(MOUNT&&MOUNT.riding)&&performance.now()-(P.lastG||0)>160){HEROI.dj=1;P.vy=Math.max(P.vy,7.5);try{legSfx('screech');}catch(e){}return;}return f.apply(this,arguments);};}
// ---- 3. el agón
function agonStart(){const all=premAll().filter(k=>premWon(k)&&k!=='hidra');if(all.length<5){toast('Para el agón hacen falta al menos cinco leyendas vencidas.');return;}
  const L=all.sort(()=>Math.random()-0.5).slice(0,5);Object.assign(AGON,{on:true,list:L,i:0,t0:performance.now(),next:0.5,home:{x:player.x,z:player.z}});closeModals&&closeModals();
  toast('<span class="label">El agón de las leyendas</span><br>Cinco leyendas seguidas, 10 orbes en cada una, cada vez más difíciles. El reloj corre.');}
function agonEnter(){const k=AGON.list[AGON.i];const P=player,o=int2Door({id:'ley_agon',room:k,x:P.x,z:P.z,a:P.yaw,name:'El agón',sub:LEG[k].title()});o.g.visible=false;o._agon=true;AGON.door=o;LEY.hard=false;int2Enter(o);}
{const f=legWin;legWin=function(){const k=LEY.kind,hard=LEY.hard;const r=f.apply(this,arguments);try{if(hard){const z=legZ(k);const first=!z.oro;z.oro=(z.oro||0)+1;save();toast('<span class="label">Corona de oro</span><br>Has vencido «'+LEG[k].title()+'» como en el mito.'+(first?' La corona de oro queda en tu bestiario.':''));}
  if(AGON.on){AGON.i++;if(AGON.i>=AGON.list.length){const s=(performance.now()-AGON.t0)/1000,z=premz();const best=!z.agon||s<z.agon;if(best)z.agon=s;save();AGON.on=false;
      setTimeout(()=>{},0);AGON.end=s;AGON.best=best;}else AGON.next=2.5;}}catch(e){}return r;};}
{const f=legLose;legLose=function(){const r=f.apply(this,arguments);try{if(AGON.on){AGON.on=false;toast('<span class="label">Fin del agón</span><br>Has llegado a la leyenda '+(AGON.i+1)+' de '+AGON.list.length+'.');}}catch(e){}LEY.GOAL=20;return r;};}
function agonTick(dt){if(AGON.end){if(ui==='play'&&!(typeof legIn==='function'&&legIn())){const s=AGON.end,b=AGON.best;AGON.end=0;LEY.GOAL=20;
      int2Dlg('Ν',leyN('Niké','Victoria'),'¡Agón completado!','<p>Cinco leyendas en <b>'+Math.floor(s/60)+' min '+Math.round(s%60)+' s</b>.'+(b?' ¡Es tu mejor tiempo!':' Tu récord: '+Math.floor(premz().agon/60)+' min '+Math.round(premz().agon%60)+' s.')+'</p>');try{qAdd('ar',1,'Has completado un agón de leyendas.');}catch(e){}}return;}
  if(!AGON.on)return;if(typeof legIn==='function'&&legIn()){if(LEY.won&&ui==='play'&&AGON.next>0&&!INT2.busy){/* tras la victoria: salir */closeDialog&&0;int2Leave();}return;}
  if(ui!=='play'||INT2.busy)return;AGON.next-=dt;if(AGON.next<=0){AGON.next=9999;agonEnter();}}
// ---- 4. como en el mito
{const f=int2Enter;int2Enter=function(o){try{if(o&&!o._agon&&LEY_ROOMS.includes(o.room)&&(o.id!=='ley'||o._go)&&!o._hd&&o.room!=='hidra'&&premz().star&&premWon(o.room)&&!INT2.busy&&!INT2.in){
    int2Dlg('Ν',leyN('Niké','Victoria'),LEG[o.room].title(),'<p>Ya venciste esta leyenda. ¿Quieres entrar en la versión normal o <b>como en el mito</b>? (La criatura empieza al máximo y solo aguantas dos golpes; premio: la corona de oro.)</p>');
    const box=$('dOpts');box.innerHTML='';[['Normal',false],['Como en el mito',true]].forEach(([t,h],i)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(i+1)+'</span><span>'+t+'</span>';b.onclick=()=>{closeDialog();LEY.hard=h;o._hd=true;int2Enter(o);setTimeout(()=>{o._hd=false;},2000);};box.appendChild(b);});return;}
  if(o&&!o._hd&&!o._agon)LEY.hard=false;}catch(e){}return f.apply(this,arguments);};}
// ---- pestaña Leyendas: objetos, agón y coronas
{const f=premHTML;premHTML=function(){let h=f.apply(this,arguments);const z=premz(),items=[['leon','La piel del león de Nemea','el primer golpe de cada leyenda no cuenta'],['medusa','Las sandalias aladas de Perseo','un segundo salto en el aire'],['cerbero','El casco de Hades','Z en un portal: 5 s invisible'],['aves','Los crótalos de Atenea','R en un portal: las criaturas se quedan quietas 4 s']];
  h+='<h4>Objetos de héroe</h4><ul>'+items.map(([k,n,d])=>'<li>'+(premWon(k)?'✓ <b>'+n+'</b>: '+d:'· '+n+' (vence «'+(LEG[k]?LEG[k].title():k)+'»)')+'</li>').join('')+'</ul>';
  h+='<h4>Pegaso</h4><p>'+(premz().star?'Pulsa <b>Z</b> fuera de los portales para montar en Pegaso.':'Se deja montar cuando venzas todas las leyendas.')+'</p>';
  const oro=premAll().filter(k=>legZ(k).oro).length;h+='<h4>Como en el mito</h4><p>'+(premz().star?'Al entrar en una leyenda vencida, elige «como en el mito». Coronas de oro: <b>'+oro+'</b>.':'Se abre cuando venzas todas las leyendas.')+'</p>';
  h+='<h4>El agón</h4><p>'+(z.title?'Cinco leyendas seguidas contra el reloj.'+(z.agon?' Tu récord: '+Math.floor(z.agon/60)+' min '+Math.round(z.agon%60)+' s.':'')+' <button class="bt" id="agonGo">Empezar un agón</button>':'Se abre con el título de '+(MODE==='roma'?'Victor':'Kallínikos')+'.')+'</p>';
  setTimeout(()=>{const b=document.getElementById('agonGo');if(b)b.onclick=()=>{try{closeModals();}catch(e){}try{closeDialog();}catch(e){}agonStart();};},50);return h;};}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{const t=performance.now()/1000;pegrTick(dt,t);if(player.grounded)HEROI.dj=0;HEROI.helCd=Math.max(0,HEROI.helCd-dt);HEROI.cro=Math.max(0,HEROI.cro-dt);
  if(HEROI.hel>0){HEROI.hel-=dt;if(HEROI.hel<=0)heroVeil(false);}agonTick(dt);}catch(e){if(!HEROI.err){HEROI.err=String(e).slice(0,200);console.warn('heroe',e);}}return r;};}
