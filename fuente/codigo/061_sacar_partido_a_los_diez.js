// ============================================================ sacar partido a los diez destinos del 386:
// comercio por mar, dos sueños jugables (Salamina y Esfacteria), el diálogo de Melos, nuevas patrias, un capítulo de historia y tres misiones
function m386z(){if(!state.m386||typeof state.m386!=='object')state.m386={};const m=state.m386;m.carga=m.carga||{};m.gan=m.gan||0;m.ventas=m.ventas||0;m.moriai=m.moriai||[];return m;}
const mon386=()=>MODE==='roma'?'sestercios':'óbolos';
// ---------------------------------------------------------------- 1. comercio
const COM={
 vino:{k:'vino',n:'ánfora de vino de Quíos',pl:'ánforas de vino de Quíos',de:'teocrines_quios',b:6,s:11},
 trigo:{k:'trigo',n:'saco de trigo del Ponto',pl:'sacos de trigo del Ponto',de:'protomaco_bizancio',b:3,s:6},
 atun:{k:'atún',n:'tinaja de atún en salazón',pl:'tinajas de atún en salazón',de:'protomaco_bizancio',b:4,s:7},
 tierra:{k:'tierra blanca',n:'saco de tierra blanca de Melos',pl:'sacos de tierra blanca de Melos',de:'cleobula_melos',b:2,s:5},
 madera:{k:'madera',n:'carga de troncos de la Calcídica',pl:'cargas de troncos de la Calcídica',de:'polixena_olinto',b:5,s:9}};
const COM_EV=[null,
 {t:'Han llegado al Pireo veinte barcos de trigo de Egipto: el trigo baja.',g:'trigo',f:0.75},
 {t:'Se habla de piratas en las Cícladas: pocos barcos se atreven a salir y todo se paga más caro.',g:'*',f:1.2},
 null,
 {t:'La ciudad quiere reparar las trirremes de los arsenales: se paga bien la madera.',g:'madera',f:1.4},
 {t:'Los pintores de la Stoa y de los talleres de estatuas buscan blanco de Melos.',g:'tierra',f:1.4},
 null,
 {t:'Los guardianes del trigo vigilan a los revendedores: el trigo se vende a precio justo, sin abusos.',g:'trigo',f:0.9},
 {t:'Un mercader ha traído mucho atún de Sinope: hay de sobra en el mercado.',g:'atun',f:0.7},
 {t:'Un rico prepara un gran banquete de bodas y busca el mejor vino.',g:'vino',f:1.3}];
const comEv=()=>COM_EV[((state.day||1)*7+3)%COM_EV.length];
// Lógos / Eloquentia: el regateo (redondea a tu favor)
function comLogos(base,f,why,sell){const L=qLv('lo')-1;if(!sell&&qLv('lo')>=2&&!progToday('buy')){f*=0.9;why.push('primera compra del día, con cortesía (−10 %)');}if(!sell&&progToday('hag')){f*=0.85;why.push('has regateado hoy (−15 %)');}if(L>0){f*=sell?1+0.02*L:1-0.02*L;why.push('regateas con '+(MODE==='roma'?'tu Eloquentia':'tu Lógos')+' ('+(sell?'+':'−')+2*L+' %)');}
  const v=base*f;return{p:Math.max(1,L>0?(sell?Math.ceil(v-0.001):Math.floor(v+0.001)):Math.round(v)),why};}
function comPrice(g,sell){const G=COM[g],mo=calNow().mo;let f=1;const why=[];
  if(g==='trigo'){if(sell){if(mo<=4){f*=1.35;why.push('antes de la cosecha el trigo escasea');}else if(mo>=6&&mo<=9){f*=0.8;why.push('después de la cosecha llegan muchos barcos de trigo');}if(mo>=10||mo===0){f*=1.2;why.push('en invierno casi nadie navega');}}
    else if(mo>=6&&mo<=9){f*=0.8;why.push('en el Ponto acaba de terminar la cosecha');}}
  if(g==='atun'&&!sell){if(mo>=8&&mo<=10){f*=0.6;why.push('en otoño los bancos de atunes salen del mar Negro y la pesca es enorme');}else f*=1.1;}
  if(g==='vino'){if(!sell&&mo>=8&&mo<=10){f*=0.8;why.push('acaban de vendimiar');}if(sell&&mo===1){f*=1.4;why.push('son las Antesterias, la fiesta del vino nuevo');}if(sell&&mo===2){f*=1.2;why.push('se acercan las Dionisias y sus banquetes');}}
  if(g==='madera'&&sell&&mo>=2&&mo<=4){f*=1.3;why.push('en primavera se preparan las flotas');}
  if(sell){const e=comEv();if(e&&(e.g===g||e.g==='*')){f*=e.f;why.push(e.t.charAt(0).toLowerCase()+e.t.slice(1,-1));}}
  return comLogos(sell?G.s:G.b,f,why,sell);}
const comCap=()=>(barcoOwn()?10:4)+(qLv('ar')>=3?2:0);
const comTot=()=>Object.values(m386z().carga).reduce((a,b)=>a+b,0);
function comCargaTxt(){const c=m386z().carga,L=Object.keys(c).filter(k=>c[k]>0);return L.length?L.map(k=>c[k]+' '+(c[k]===1?COM[k].n:COM[k].pl)).join(', '):'nada';}
function comSellerMenu(n){comMode();const m=m386z(),goods=Object.keys(COM).filter(k=>COM[k].de===n.id),B=$('dBody'),o=$('dOpts');
  const draw=msg=>{o.innerHTML='';let k=1;const add=(t,fn,c)=>{const b=document.createElement('button');b.className=c||'';b.innerHTML='<span class="n">'+(k++)+'</span><span>'+t+'</span>';b.onclick=fn;o.appendChild(b);};
    B.innerHTML=(msg?'<p>'+msg+'</p>':'')+goods.map(g=>{const P=comPrice(g,false);return '<p><b>'+COM[g].n.charAt(0).toUpperCase()+COM[g].n.slice(1)+'</b>: '+P.p+' '+mon386()+(P.why.length?' <span class="sub">('+P.why.join('; ')+')</span>':'')+'</p>';}).join('')+
      '<p class="sub">Llevas: '+comCargaTxt()+' · Espacio: '+comTot()+' de '+comCap()+(barcoOwn()?' (tu barco)':' (sin barco propio: pagarás 1 '+(MODE==='roma'?'sestercio':'óbolo')+' de flete por cada bulto al venderlo)')+' · Tienes '+state.obols+' '+mon386()+'.</p>';
    for(const g of goods){const P=comPrice(g,false);add('Comprar 1 '+COM[g].n+' por '+P.p+' '+mon386(),()=>{if(comTot()>=comCap())return draw('No te cabe nada más.');if(state.obols<P.p&&!(qLv('kl')>=4&&state.obols-P.p>=-15))return draw('No te llega el dinero.');state.obols-=P.p;progMark('buy');m.carga[g]=(m.carga[g]||0)+1;save();updateStats();sfxCoin();draw('Hecho: se carga en el barco.');},'quiz');}
    if(qLv('lo')>=5&&!progToday('hag')&&!progToday('hagno'))add('Regatear con el vendedor',()=>{const ok=Math.random()<0.4+qLv('lo')*0.05;if(ok)progMark('hag');else progMark('hagno');draw(ok?'Le recuerdas lo que pagan en el puerto de al lado, alabas su mercancía y le prometes volver. Suspira: «Está bien, hoy te lo dejo más barato».':'Se cruza de brazos: «Si no te gusta el precio, el mar es muy grande». Hoy no hay rebaja.');},'quiz');
    add('Volver a la conversación',()=>{B.innerHTML='<p>Pregunta lo que quieras.</p>';renderOpts();});};
  draw(n.id==='protomaco_bizancio'?'Trigo o atún: elige. Y no tardes, que el viento del norte no espera.':n.id==='cleobula_melos'?'Esta tierra blanca la usan los pintores: dicen que es el mejor blanco que hay.':n.id==='polixena_olinto'?'Mi marido vende troncos de los montes. Para remos y para cascos, nada mejor.':'Vino de Ariusia, el mejor. Te lo cargo yo mismo.');}
function comBuyerMenu(n){comMode();const m=m386z(),B=$('dBody'),o=$('dOpts'),e=comEv();o.innerHTML='';let k=1;const add=(t,fn,c)=>{const b=document.createElement('button');b.className=c||'';b.innerHTML='<span class="n">'+(k++)+'</span><span>'+t+'</span>';b.onclick=fn;o.appendChild(b);};
  const L=Object.keys(m.carga).filter(g=>m.carga[g]>0);
  B.innerHTML='<p>'+(e?'Noticias del puerto: '+e.t:'Hoy el puerto está tranquilo: ni noticias buenas ni malas.')+'</p>'+(L.length?L.map(g=>{const P=comPrice(g,true);return '<p><b>'+m.carga[g]+' '+(m.carga[g]===1?COM[g].n:COM[g].pl)+'</b>: te pago '+P.p+' por cada una'+(P.why.length?' <span class="sub">('+P.why.join('; ')+')</span>':'')+'.</p>';}).join(''):'<p>'+comTxt().none+'</p>')+
    '<p class="sub">Precios de compra en origen: '+Object.keys(COM).map(k=>COM[k].k+' '+COM[k].b).join(', ')+' (más o menos según la estación). Ganancias acumuladas: '+m.gan+' '+mon386()+'.</p>';
  if(L.length)add('Venderlo todo',()=>{let tot=0,fl=0;for(const g of L){const P=comPrice(g,true);tot+=P.p*m.carga[g];if(!barcoOwn())fl+=m.carga[g];if(!m['v_'+g]){m['v_'+g]=1;qAdd('kl',1,'Te conocen en el Pireo como mercader.');}m.carga[g]=0;}
    state.obols+=tot-fl;m.gan+=tot-fl;m.ventas++;save();updateStats();sfxCoin();B.innerHTML='<p>Cobras '+tot+' '+mon386()+(fl?', y pagas '+fl+' de flete al armador':'')+'. Te quedan '+(tot-fl)+' limpios.</p><p class="sub">'+(m.ventas===1?'Tu primera venta. Así vivían miles de mercaderes, '+(MODE==='roma'?'casi siempre libertos y provinciales':'casi siempre metecos o extranjeros')+': comprando barato donde algo sobraba y vendiendo donde faltaba.':'Llevas '+m.ventas+' ventas y '+m.gan+' '+mon386()+' de ganancia.')+'</p>';o.innerHTML='';k=1;add('Volver a la conversación',()=>{B.innerHTML='<p>Pregunta lo que quieras.</p>';renderOpts();});},'quiz');
  add('¿Cómo funciona el comercio por mar?',()=>{B.innerHTML=comTxt().how;comBuyerMenuBack(n);},'quiz');
  add('Volver a la conversación',()=>{B.innerHTML='<p>Pregunta lo que quieras.</p>';renderOpts();});}
function comBuyerMenuBack(n){const o=$('dOpts');o.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>Volver</span>';b.onclick=()=>comBuyerMenu(n);o.appendChild(b);}
// ---------------------------------------------------------------- 2. sueños jugables (lienzo propio, bucle propio)
const MG={on:false,keys:{}};
function mgCSS(){if($('mgCSS'))return;const s=document.createElement('style');s.id='mgCSS';s.textContent='#mg{position:fixed;inset:0;z-index:60;background:#0b1a24;color:#f1e8d8;font-family:Georgia,serif}#mg canvas{position:absolute;inset:0;width:100%;height:100%}#mg .box{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-width:min(640px,92vw);max-height:86vh;overflow:auto;background:rgba(20,16,12,.94);border:1px solid #d9874a;border-radius:10px;padding:20px 24px;line-height:1.5}#mg h2{margin:0 0 8px;font-weight:normal;color:#e8b07a}#mg .src{font-size:.85em;opacity:.75}#mg button{font:inherit;padding:8px 16px;margin:10px 8px 0 0;border-radius:6px;border:1px solid #d9874a;background:#d9874a;color:#1a120c;cursor:pointer}#mg button.gh{background:transparent;color:#f1e8d8}#mg .hud{position:absolute;left:14px;top:12px;font-size:15px;text-shadow:0 1px 3px #000;pointer-events:none}#mg .msg{position:absolute;left:50%;bottom:90px;transform:translateX(-50%);max-width:80vw;text-align:center;font-size:17px;text-shadow:0 1px 4px #000;pointer-events:none}#mg .tb{position:absolute;bottom:14px;left:0;right:0;display:flex;justify-content:center;gap:10px}#mg .tb button{margin:0;min-width:64px;min-height:52px;background:rgba(20,16,12,.7);color:#f1e8d8}#mg .x{position:absolute;right:12px;top:10px}';document.head.appendChild(s);}
function mgOpen(D){mgCSS();if(MOUNT.riding)dismount();FLY.on=false;closeDialog();ui='mg';releasePointer();
  const d=document.createElement('div');d.id='mg';d.innerHTML='<canvas></canvas><div class="hud"></div><div class="msg"></div>'+(isTouch?'<div class="tb">'+D.touch.map(t=>'<button data-k="'+t[0]+'">'+t[1]+'</button>').join('')+'</div>':'')+'<button class="gh x">'+(D.own?'Abandonar':'Despertar')+' · Esc</button><div class="box"><h2>'+D.title+'</h2>'+D.intro+'<p>'+(isTouch?D.ctlT:D.ctl)+'</p><p class="src">'+D.src+'</p><button class="go">'+(D.own?'¡A correr!':'Soñar')+' · Enter</button><button class="gh no">Ahora no · Esc</button></div>';
  document.body.appendChild(d);Object.assign(MG,{D,d,cv:d.querySelector('canvas'),on:false,intro:true,keys:{},msg:'',msgT:0,t:0,last:performance.now()});mgResize();
  d.querySelector('.go').onclick=mgStart;d.querySelector('.no').onclick=()=>mgClose();d.querySelector('.x').onclick=()=>mgEnd('skip');
  d.querySelectorAll('.tb button').forEach(b=>{const k=b.dataset.k,on=v=>e=>{e.preventDefault();MG.keys[k]=v;};b.addEventListener('pointerdown',on(true));for(const ev of['pointerup','pointerleave','pointercancel'])b.addEventListener(ev,on(false));});
  D.init(MG);mgDraw();}
function mgResize(){if(!MG.cv)return;const dpr=Math.min(2,devicePixelRatio||1);MG.cv.width=innerWidth*dpr;MG.cv.height=innerHeight*dpr;MG.x=MG.cv.getContext('2d');MG.x.setTransform(dpr,0,0,dpr,0,0);MG.W=innerWidth;MG.H=innerHeight;MG.s=Math.min(MG.W/160,MG.H/90);MG.ox=(MG.W-160*MG.s)/2;MG.oy=(MG.H-90*MG.s)/2;}
addEventListener('resize',()=>{if($('mg'))mgResize();});
function mgStart(){MG.d.querySelector('.box').hidden=true;MG.intro=false;MG.on=true;MG.t=0;MG.last=performance.now();MG.D.init(MG);mgSay(MG.D.first,4);requestAnimationFrame(mgLoop);}
function mgSay(m,t){MG.msg=m;MG.msgT=t||3;MG.d.querySelector('.msg').innerHTML=m;}
function mgLoop(now){if(!MG.on)return;const dt=Math.min(0.05,(now-MG.last)/1000);MG.last=now;MG.t+=dt;MG.msgT-=dt;if(MG.msgT<0&&MG.msg){MG.msg='';MG.d.querySelector('.msg').innerHTML='';}
  const r=MG.D.tick(MG,dt);mgDraw();if(r){mgEnd(r);return;}requestAnimationFrame(mgLoop);}
function mgDraw(){const x=MG.x;if(!x)return;x.save();x.fillStyle='#000';x.fillRect(0,0,MG.W,MG.H);x.translate(MG.ox,MG.oy);x.scale(MG.s,MG.s);MG.D.draw(MG,x);x.restore();MG.d.querySelector('.hud').innerHTML=MG.D.hud(MG);}
function mgEnd(res){MG.on=false;const D=MG.D,first=!D.own&&res==='win'&&!(m386z()['mg_'+D.id]);if(first){m386z()['mg_'+D.id]=1;state.obols+=3;qAdd('so',2);qAdd('ar',2,'Has vivido un sueño de batalla.');save();updateStats();sfxCoin();}
  const b=MG.d.querySelector('.box');b.hidden=false;b.innerHTML='<h2>'+(res==='win'?D.winT:res==='fail'?D.failT:'Te despiertas')+'</h2>'+(res==='skip'?'<p>El sueño se desvanece.</p>':D.after(MG,res))+(first?'<p class="src">+3 '+mon386()+' · Sophía y Areté</p>':'')+'<button class="go">'+(D.own?'Volver':'Despertar')+'</button>'+(res!=='win'?'<button class="gh re">'+(D.own?'Repetir la carrera':'Volver a soñarlo')+'</button>':'');
  b.querySelector('.go').onclick=()=>mgClose();const re=b.querySelector('.re');if(re)re.onclick=()=>{b.hidden=true;mgStart();};}
function mgClose(){MG.on=false;const d=$('mg');if(d)d.remove();ui='play';}
addEventListener('keydown',e=>{if(!$('mg'))return;e.stopImmediatePropagation();e.preventDefault();
  if(MG.intro){if(e.code==='Enter'||e.code==='Space')mgStart();else if(e.code==='Escape')mgClose();return;}
  if(!MG.on){if(e.code==='Enter'||e.code==='Escape')mgClose();return;}
  if(e.code==='Escape'){mgEnd('skip');return;}MG.keys[e.code]=true;},true);
addEventListener('keyup',e=>{if(!$('mg'))return;e.stopImmediatePropagation();MG.keys[e.code]=false;},true);
const mgk=(...c)=>c.some(k=>MG.keys[k]);
function mgObb(px,py,s){const dx=px-s.x,dy=py-s.y,c=Math.cos(s.a),n=Math.sin(s.a);const lx=dx*c+dy*n,ly=-dx*n+dy*c;return Math.abs(lx)<s.L/2&&Math.abs(ly)<s.w/2;}
function mgShip(x,s,hull,t){x.save();x.translate(s.x,s.y);x.rotate(s.a);x.globalAlpha=s.sink?Math.max(0,1-s.sink):1;
  x.strokeStyle='rgba(241,232,216,.55)';x.lineWidth=0.12;const n=9,ph=Math.sin((t||0)*6+(s.ph||0))*0.35*(s.v>0.5?1:0.2);
  for(let i=0;i<n;i++){const ox=-s.L/2+0.8+i*(s.L-1.6)/(n-1);x.beginPath();x.moveTo(ox,-s.w/2);x.lineTo(ox+ph,-s.w/2-1.1);x.moveTo(ox,s.w/2);x.lineTo(ox+ph,s.w/2+1.1);x.stroke();}
  x.fillStyle=hull;x.beginPath();x.moveTo(s.L/2+0.6,0);x.lineTo(s.L/2-1,-s.w/2);x.lineTo(-s.L/2,-s.w/2*0.8);x.lineTo(-s.L/2-0.4,0);x.lineTo(-s.L/2,s.w/2*0.8);x.lineTo(s.L/2-1,s.w/2);x.closePath();x.fill();
  x.fillStyle='#b08a3a';x.fillRect(s.L/2-0.2,-0.18,1.1,0.36);if(s.eye){x.fillStyle='#f1e8d8';x.beginPath();x.arc(s.L/2-1.4,-s.w/2+0.35,0.22,0,TAU);x.arc(s.L/2-1.4,s.w/2-0.35,0.22,0,TAU);x.fill();}
  if(s.me){x.strokeStyle='#e8b07a';x.lineWidth=0.35;x.stroke();}x.restore();if(s.me){x.fillStyle='#e8b07a';x.font='2.4px Georgia';x.textAlign='center';x.fillText('tu trirreme',s.x,s.y-3.2);x.textAlign='left';}}
// ---- Salamina
const MG_SAL={id:'salamina',title:'El sueño de Salamina',
 intro:'<p>Carino te habla de su abuelo, y esa noche sueñas que eres el trierarca de una trirreme ateniense. Es el amanecer de un día de septiembre del 480: las naves de Jerjes, que han pasado la noche remando, entran en el estrecho entre Salamina y el Ática.</p><p>Embiste las naves enemigas de costado con el espolón de bronce, a toda velocidad. Si vas despacio, el espolón no rompe el casco. Cuidado con que te embistan a ti, y no agotes a los remeros: la velocidad de ataque solo dura unos momentos. Hunde cinco naves.</p>',
 ctl:'<b>A</b> y <b>D</b> (o las flechas) para girar, <b>W</b> para remar a velocidad de ataque, <b>S</b> para ciar (remar hacia atrás).',ctlT:'Gira con <b>◀</b> y <b>▶</b>; <b>Ataque</b> para remar a toda velocidad; <b>Ciar</b> para frenar.',
 touch:[['ArrowLeft','◀'],['KeyS','Ciar'],['KeyW','Ataque'],['ArrowRight','▶']],
 src:'Heródoto VIII 76-96; Esquilo, Los persas 353-432; Plutarco, Temístocles 12-15. En el juego hay muchas menos naves: en la batalla hubo unas 370 griegas contra, quizá, el doble de persas.',
 first:'Las naves persas entran en el estrecho. ¡Al ataque!',winT:'¡Victoria en Salamina!',failT:'Tu trirreme se hunde',
 init(G){G.p={x:22,y:45,a:0,v:3,L:8,w:1.7,eye:true,me:true,hp:5,st:100};G.en=[];G.al=[];G.sunk=0;G.solas=0;G.spawn=0;G.brisa=false;G.fx=[];
  for(let i=0;i<4;i++)G.al.push({x:12+(i%2)*6,y:22+i*14,a:0,v:2.5,L:8,w:1.7,eye:true,ph:i});},
 coast(x){return[11+3*Math.sin(x*0.06),79-3*Math.sin(x*0.05+1)];},
 tick(G,dt){const P=G.p,S=this;
  // remeros y timón
  const atk=mgk('KeyW','ArrowUp')&&P.st>0,back=mgk('KeyS','ArrowDown');const tv=atk?10:back?-1.5:3.5;P.v+=(tv-P.v)*Math.min(1,dt*(atk?1.6:1.2));
  if(atk)P.st=Math.max(0,P.st-28*dt);else P.st=Math.min(100,P.st+10*dt);if(P.st===0&&!G.tired){G.tired=1;mgSay('Los remeros están agotados: hay que dejarles recuperar el aliento.',3);}if(P.st>40)G.tired=0;
  const tr=(mgk('KeyA','ArrowLeft')?-1:0)+(mgk('KeyD','ArrowRight')?1:0);P.a+=tr*1.5*dt*Math.min(1,0.4+Math.abs(P.v)/6);
  P.x+=Math.cos(P.a)*P.v*dt;P.y+=Math.sin(P.a)*P.v*dt;
  // costas y límites
  for(const s of [P,...G.en,...G.al]){const c=S.coast(s.x);if(s.y<c[0]+2){s.y=c[0]+2;if(s===P&&P.v>5){P.hp--;mgSay('¡Encallas contra las rocas de Salamina!',2.5);}s.v*=0.3;}if(s.y>c[1]-2){s.y=c[1]-2;if(s===P&&P.v>5){P.hp--;mgSay('¡Encallas en la costa del Ática!',2.5);}s.v*=0.3;}}
  P.x=clamp(P.x,2,158);
  // la brisa de la mañana (Plutarco): las naves persas, más altas, se balancean y giran mal
  if(!G.brisa&&G.t>40){G.brisa=true;mgSay('Se levanta la brisa de la mañana, como esperaba Temístocles. Las naves persas, más altas, se balancean y giran mal.',5);}
  // llegan los persas
  G.spawn-=dt;if(G.spawn<0&&G.en.filter(e=>!e.sink).length<12){G.spawn=G.t<20?1.6:2.6;const c=S.coast(160);G.en.push({x:168,y:rr(c[0]+8,c[1]-8),a:Math.PI+rr(-0.15,0.15),v:2.4,L:9,w:2,ph:R()*6,agr:R()<0.35});}
  for(const e of G.en){if(e.sink){e.sink+=dt*0.5;continue;}
    const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy);let want=Math.PI;if(e.agr&&d<22&&d>3)want=Math.atan2(dy,dx);
    const turn=G.brisa?0.25:0.6;e.a+=clamp(wrapA(want-e.a),-turn*dt,turn*dt);if(G.brisa)e.a+=Math.sin(G.t*1.3+e.ph)*0.15*dt;
    e.v+=((e.agr&&d<16?3.8:2.4)-e.v)*dt;e.x+=Math.cos(e.a)*e.v*dt;e.y+=Math.sin(e.a)*e.v*dt;if(e.x<-10)e.sink=0.01;}
  // las naves persas chocan entre sí en el estrecho
  const live=G.en.filter(e=>!e.sink);for(let i=0;i<live.length;i++)for(let j=i+1;j<live.length;j++){const a=live[i],b=live[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<2.6){const nx=(a.x-b.x)/(d||1),ny=(a.y-b.y)/(d||1);a.x+=nx*0.6;a.y+=ny*0.6;b.x-=nx*0.6;b.y-=ny*0.6;a.v*=0.5;b.v*=0.5;
    if(!a.bump&&R()<0.25){a.sink=0.01;G.solas++;mgSay('Dos naves persas chocan en la confusión del estrecho: una se hunde.',2.5);}a.bump=1;}}
  // aliados: avanzan y embisten
  for(const al of G.al){al.x+=Math.cos(al.a)*al.v*dt;al.y+=Math.sin(al.a)*al.v*dt;if(al.x>150)al.a=Math.PI;if(al.x<10)al.a=0;
    for(const e of live)if(!e.sink&&mgObb(al.x+Math.cos(al.a)*(al.L/2+0.5),al.y+Math.sin(al.a)*(al.L/2+0.5),e)&&R()<0.02)e.sink=0.01;}
  // embestidas
  const bx=P.x+Math.cos(P.a)*(P.L/2+0.6),by=P.y+Math.sin(P.a)*(P.L/2+0.6);
  for(const e of live){if(e.sink)continue;
    if(mgObb(bx,by,e)){const side=Math.abs(Math.sin(P.a-e.a)),fast=P.v>6;if(fast&&side>0.45){e.sink=0.01;G.sunk++;P.v=1;G.fx.push({x:bx,y:by,t:0});mgSay(['¡Crac! El espolón abre el costado de la nave enemiga.','¡Embestida! Los remeros enemigos saltan al agua.','¡Otra más! Ciad, ciad, para sacar el espolón.','La nave persa se escora y se hunde.','¡Hundida!'][G.sunk%5],2);}
      else{P.v=-1;e.v*=0.5;mgSay(fast?'Golpe de proa contra proa: no sirve, hay que darles de costado.':'Demasiado despacio: el espolón no rompe el casco. ¡Ataque!',2);}}
    const ex=e.x+Math.cos(e.a)*(e.L/2+0.6),ey=e.y+Math.sin(e.a)*(e.L/2+0.6);if(!e.hitT&&!G.inv&&mgObb(ex,ey,P)&&e.v>3.2){e.hitT=3;G.inv=2;P.hp--;P.v=0;mgSay('¡Te embisten! Entra agua por el costado.',2.5);}if(e.hitT)e.hitT=Math.max(0,e.hitT-dt);
    const d=Math.hypot(P.x-e.x,P.y-e.y);if(d<2.2){P.x+=(P.x-e.x)/d*0.5;P.y+=(P.y-e.y)/d*0.5;}}
  G.en=G.en.filter(e=>!e.sink||e.sink<1);if(G.inv)G.inv=Math.max(0,G.inv-dt);for(const f of G.fx)f.t+=dt;G.fx=G.fx.filter(f=>f.t<1);
  if(G.sunk>=5)return 'win';if(P.hp<=0)return 'fail';if(G.t>150)return 'fail';return null;},
 draw(G,x){const S=this,t=G.t;const g=x.createLinearGradient(0,0,0,90);g.addColorStop(0,'#2a6a84');g.addColorStop(1,'#1d4f6b');x.fillStyle=g;x.fillRect(0,0,160,90);
  x.strokeStyle='rgba(255,255,255,.07)';x.lineWidth=0.2;for(let i=0;i<40;i++){const wx=(i*37.7+t*1.5)%170-5,wy=(i*53.3)%90;x.beginPath();x.moveTo(wx,wy);x.quadraticCurveTo(wx+1.5,wy-0.6,wx+3,wy);x.stroke();}
  x.fillStyle='#a8976a';x.beginPath();x.moveTo(0,0);for(let i=0;i<=160;i+=4)x.lineTo(i,S.coast(i)[0]);x.lineTo(160,0);x.fill();x.beginPath();x.moveTo(0,90);for(let i=0;i<=160;i+=4)x.lineTo(i,S.coast(i)[1]);x.lineTo(160,90);x.fill();
  x.fillStyle='rgba(40,30,20,.75)';x.font='3px Georgia';x.fillText('SALAMINA',8,6);x.fillText('ÁTICA',8,88);x.font='2.2px Georgia';x.fillText('Monte Egaleo: el trono de Jerjes',108,88);
  for(const al of G.al)mgShip(x,al,'#3a2a1e',t);for(const e of G.en)mgShip(x,e,'#6a2a2a',t);mgShip(x,G.p,'#2a1e16',t);
  for(const f of G.fx){x.strokeStyle='rgba(241,232,216,'+(1-f.t)+')';x.lineWidth=0.3;x.beginPath();x.arc(f.x,f.y,1+f.t*4,0,TAU);x.stroke();}},
 hud(G){const P=G.p;return 'Naves hundidas: <b>'+G.sunk+'</b> de 5 · Casco: '+'♥'.repeat(Math.max(0,P.hp))+' · Remeros: <span style="display:inline-block;width:90px;height:9px;background:rgba(255,255,255,.2);vertical-align:middle"><span style="display:block;height:100%;width:'+P.st.toFixed(0)+'%;background:#d9874a"></span></span> · '+Math.max(0,150-G.t).toFixed(0)+' s';},
 after(G,res){return (res==='win'?'<p>Has hundido cinco naves'+(G.solas?', y otras '+G.solas+' se han hundido solas, chocando entre ellas en el estrecho':'')+'. Así fue en Salamina: Heródoto cuenta que las naves persas, demasiadas para tan poco espacio, se estorbaban unas a otras, mientras los griegos atacaban en orden.</p>':'<p>Tu trirreme se va a pique. Tranquilo: en la batalla real los atenienses perdieron unas cuarenta naves, y aun así vencieron.</p>')+
  '<p>Al caer la tarde, el estrecho estaba lleno de restos y de cadáveres. Jerjes, que lo había visto todo desde su trono en el monte Egaleo, volvió a Asia con parte del ejército. Al año siguiente, en Platea, los griegos vencieron por tierra.</p><p>Para Atenas, Salamina lo cambió todo: la ciudad que se había salvado en el mar se convirtió en una potencia naval, y los pobres que remaban en las trirremes ganaron peso en la Asamblea.</p>';}};
// ---- Esfacteria
const MG_ESF={id:'esfacteria',title:'El sueño de Esfacteria',
 intro:'<p>Glauco te cuenta la historia de su abuelo, y esa noche sueñas que eres él. Verano del 425: los espartanos aislados en Esfacteria pasan hambre, y Esparta ha prometido la libertad a los hilotas que les lleven comida. Tú nadas de noche desde la costa, arrastrando con una cuerda un odre lleno de semillas de adormidera con miel y linaza.</p><p>Las trirremes atenienses patrullan la bahía con faroles. Si te ven en la superficie, estás perdido: sumérgete al pasar cerca de la luz, pero sin quedarte sin aire. La corriente te arrastra hacia los lados.</p>',
 ctl:'<b>W A S D</b> (o las flechas) para nadar; mantén <b>Espacio</b> para bucear.',ctlT:'Nada con las flechas; mantén <b>Bucear</b> para sumergirte.',
 touch:[['ArrowLeft','◀'],['ArrowUp','▲'],['Space','Bucear'],['ArrowDown','▼'],['ArrowRight','▶']],
 src:'Tucídides IV 26 (los buceadores que llevaban comida a la isla, y la promesa de libertad a los hilotas), IV 38-40 (la rendición) y IV 80 (los dos mil hilotas que desaparecieron).',
 first:'Nada hacia la isla, al norte. Evita la luz de los faroles.',winT:'Llegas a Esfacteria',failT:'Te han visto',
 init(G){G.p={x:80,y:84,air:100,dive:false};G.lives=3;G.alarm=0;G.boats=[{x:20,y:30,v:6,r:11},{x:120,y:46,v:-4.5,r:12},{x:60,y:63,v:5.5,r:10},{x:140,y:20,v:-3.5,r:9}];G.caught=0;},
 tick(G,dt){const P=G.p;P.dive=mgk('Space')&&P.air>0;
  const sp=P.dive?3.4:5.2,mx=(mgk('KeyD','ArrowRight')?1:0)-(mgk('KeyA','ArrowLeft')?1:0),my=(mgk('KeyS','ArrowDown')?1:0)-(mgk('KeyW','ArrowUp')?1:0),l=Math.hypot(mx,my)||1;
  P.x+=mx/l*sp*dt+Math.sin(G.t*0.35)*1.4*dt;P.y+=my/l*sp*dt;P.x=clamp(P.x,3,157);P.y=clamp(P.y,4,86);
  if(P.dive){P.air-=34*dt;if(P.air<=0){P.air=0;mgSay('¡Te falta el aire! Tienes que subir a respirar.',2);}}else P.air=Math.min(100,P.air+22*dt);
  let lit=false;for(const b of G.boats){b.x+=b.v*dt;if(b.x<8||b.x>152)b.v*=-1;if(!P.dive&&Math.hypot(P.x-b.x,P.y-b.y)<b.r)lit=true;}
  G.alarm=lit?G.alarm+1.7*dt:Math.max(0,G.alarm-0.8*dt);if(lit&&G.alarm>0.25&&!G.warn){G.warn=1;mgSay('¡La luz del farol! Sumérgete.',1.8);}if(!lit)G.warn=0;
  if(G.alarm>=1){G.lives--;G.alarm=0;G.caught++;mgSay(G.lives>0?'«¡Allí, en el agua!». Te ven, pierdes el odre y vuelves a la costa como puedes. Inténtalo otra vez.':'Te han visto demasiadas veces.',3.5);P.x=80;P.y=84;P.air=100;if(G.lives<=0)return 'fail';}
  if(P.y<13)return 'win';return null;},
 draw(G,x){const t=G.t;x.fillStyle='#0a1622';x.fillRect(0,0,160,90);for(let i=0;i<60;i++){x.fillStyle='rgba(255,255,255,'+(0.2+0.3*Math.abs(Math.sin(i*3.1+t)))+')';x.fillRect((i*29.3)%160,(i*13.7)%90,0.25,0.25);}
  x.fillStyle='#1d2a1e';x.beginPath();x.moveTo(0,0);for(let i=0;i<=160;i+=4)x.lineTo(i,10+2*Math.sin(i*0.08));x.lineTo(160,0);x.fill();
  x.fillStyle='#2a2418';x.beginPath();x.moveTo(0,90);for(let i=0;i<=160;i+=4)x.lineTo(i,87+1.2*Math.sin(i*0.1));x.lineTo(160,90);x.fill();
  x.fillStyle='rgba(220,200,160,.55)';x.font='3px Georgia';x.fillText('ESFACTERIA',62,6);x.font='2.2px Georgia';x.fillText('Costa de Mesenia',4,89.5);
  for(let k=0;k<5;k++){x.fillStyle='rgba(255,170,60,'+(0.5+0.4*Math.sin(t*5+k))+')';x.beginPath();x.arc(40+k*20,6+Math.sin(k)*1.5,0.5,0,TAU);x.fill();}
  for(const b of G.boats){const rg=x.createRadialGradient(b.x,b.y,0.5,b.x,b.y,b.r);rg.addColorStop(0,'rgba(255,200,110,.45)');rg.addColorStop(1,'rgba(255,200,110,0)');x.fillStyle=rg;x.beginPath();x.arc(b.x,b.y,b.r,0,TAU);x.fill();mgShip(x,{x:b.x,y:b.y,a:b.v>0?0:Math.PI,v:1,L:8,w:1.7,eye:true},'#2a1e16',t);x.fillStyle='#ffcf7a';x.beginPath();x.arc(b.x,b.y,0.4,0,TAU);x.fill();}
  const P=G.p;x.globalAlpha=P.dive?0.35:1;x.fillStyle='#d8b890';x.beginPath();x.arc(P.x,P.y,0.7,0,TAU);x.fill();x.strokeStyle='rgba(241,232,216,.6)';x.lineWidth=0.15;x.beginPath();x.moveTo(P.x,P.y+0.7);x.lineTo(P.x,P.y+2.6);x.stroke();x.fillStyle='#8a6a3a';x.beginPath();x.ellipse(P.x,P.y+3.2,0.7,0.5,0,0,TAU);x.fill();x.globalAlpha=1;
  if(!P.dive){x.strokeStyle='rgba(255,255,255,.25)';x.beginPath();x.arc(P.x,P.y,1.2+0.4*Math.sin(t*4),0,TAU);x.stroke();}},
 hud(G){return 'Aire: <span style="display:inline-block;width:90px;height:9px;background:rgba(255,255,255,.2);vertical-align:middle"><span style="display:block;height:100%;width:'+G.p.air.toFixed(0)+'%;background:#6ab0d9"></span></span> · Intentos: '+'●'.repeat(G.lives)+(G.alarm>0?' · <span style="color:#ffcf7a">¡Te van a ver!</span>':'');},
 after(G,res){return (res==='win'?'<p>Llegas a la orilla de la isla, entre las rocas. Unas manos te agarran y te suben: son espartanos, flacos, con los ojos hundidos. Alguien abre el odre y lo reparte. Nadie te da las gracias: eres un hilota.</p>':'<p>Te despiertas con el corazón en la boca.</p>')+
  '<p>Tucídides cuenta que los buceadores llevaron comida a la isla durante semanas, y que otros hilotas desembarcaban de noche en la costa expuesta, con mar gruesa, arriesgando la barca. Al final, un incendio quemó la maleza de la isla y los atenienses atacaron: los 292 supervivientes se rindieron. Grecia no se lo podía creer.</p><p>¿Y la libertad prometida? Pocos años después, Esparta pidió a los hilotas más valientes que se presentaran para ser liberados. Se presentaron unos dos mil. Nadie volvió a verlos.</p>';}};
// ---------------------------------------------------------------- 3. el diálogo de los melios
const MELOS_R=[
 {ath:'No os vamos a soltar un largo discurso sobre si nuestro imperio es justo, ni vosotros nos digáis que no nos habéis hecho daño. Sabéis tan bien como nosotros que, entre los hombres, la justicia solo cuenta entre quienes tienen el mismo poder: los fuertes hacen lo que pueden y los débiles sufren lo que deben.',ref:'V 89',
  op:[['«Entonces hablemos de lo que os conviene a vosotros: si tratáis así a los débiles, el día que caigáis, todos os tratarán igual.»','No nos preocupa el final de nuestro imperio, si llega: no son los imperios rivales los que tratan peor a los vencidos, sino los súbditos que se rebelan. Ese riesgo es cosa nuestra.','V 90-91'],
   ['«Dejadnos ser neutrales: amigos vuestros, sin aliarnos con nadie.»','No. Vuestra amistad nos hace más daño que vuestro odio: nuestros súbditos verían en ella una prueba de debilidad, y en vuestro odio, una prueba de nuestra fuerza.','V 94-95'],
   ['«Los dioses están con los justos, y nosotros lo somos.»','También nosotros creemos tener a los dioses de nuestra parte. De los dioses lo suponemos, y de los hombres lo sabemos con certeza: dominan siempre donde pueden. No hicimos nosotros esa ley, ni somos los primeros en aplicarla.','V 104-105']]},
 {ath:'Os conviene someteros antes de sufrir lo peor, y a nosotros, no destruiros. Pensadlo bien: vuestra ciudad entera está en juego, y solo tenéis una.',ref:'V 93 y 111',
  op:[['«Los espartanos, que son de nuestra misma sangre, vendrán a ayudarnos.»','Los espartanos son los que más claramente llaman honroso a lo agradable y justo a lo que les conviene. No se arriesgarán por una isla en un mar que dominamos nosotros.','V 104-109'],
   ['«La guerra es incierta: a veces la suerte favorece al más débil. Si nos rendimos, perdemos toda esperanza.»','La esperanza consuela en el peligro a quien tiene de sobra. Pero arruina a quienes se lo juegan todo a ella, porque es derrochadora por naturaleza: solo se la conoce cuando ya es tarde.','V 102-103'],
   ['«Es una vergüenza entregar sin luchar una ciudad que es libre desde hace setecientos años.»','No es vergüenza ceder ante la ciudad más fuerte de Grecia cuando ofrece condiciones razonables: ser aliados y pagar tributo, conservando vuestras tierras. La vergüenza, a veces, arrastra a desgracias peores.','V 111-112']]}];
function melosDlg(n){const B=$('dBody'),o=$('dOpts'),m=m386z();let r=0;const add=(t,fn,c)=>{const b=document.createElement('button');b.className=c||'';b.innerHTML='<span class="n">'+(o.children.length+1)+'</span><span>'+t+'</span>';b.onclick=fn;o.appendChild(b);};
  const round=()=>{const R0=MELOS_R[r];o.innerHTML='';B.innerHTML='<p class="sub">Invierno del 416. En una sala cerrada, ante los magistrados de Melos, hablan los embajadores atenienses. Tú hablas por los melios.</p><p><b>Los atenienses:</b> «'+R0.ath+'»</p><p class="sub">Tucídides '+R0.ref+'</p>';
    R0.op.forEach(op=>add(op[0],()=>{B.innerHTML='<p><b>Tú:</b> '+op[0]+'</p><p><b>Los atenienses:</b> «'+op[1]+'»</p><p class="sub">Tucídides '+op[2]+'. Los melios usaron de verdad este argumento.</p>';o.innerHTML='';r++;add(r<MELOS_R.length?'Seguir':'Llega el momento de decidir',r<MELOS_R.length?round:decide);},'quiz'));};
  const decide=()=>{o.innerHTML='';B.innerHTML='<p>Los atenienses salen de la sala y os dejan deliberar. ¿Qué responde Melos?</p>';
    add('Resistir: «No entregaremos en un momento la libertad de setecientos años»',()=>end(true),'quiz');add('Rendirse: aceptar ser aliados de Atenas y pagar tributo',()=>end(false),'quiz');};
  const end=res=>{o.innerHTML='';const first=!m.melos;m.melos=res?'resistir':'rendirse';if(first){qAdd('lo',3,'Has defendido a Melos con la palabra.');qAdd('so',1);}save();
    B.innerHTML=(res?'<p>Eso mismo respondieron los melios. Los atenienses rodearon la ciudad con un muro y la sitiaron durante el invierno. Hubo traición dentro. Melos se rindió sin condiciones: los atenienses mataron a todos los hombres adultos, vendieron como esclavos a las mujeres y a los niños, y enviaron quinientos colonos.</p>':'<p>Los melios no lo hicieron, así que no sabemos qué habría pasado. Otras islas que aceptaron, como Sérifos o Sifnos, pagaron tributo a Atenas y siguieron existiendo; cuando Atenas perdió la guerra, recuperaron su independencia.</p>')+
      '<p>Tucídides no dice quién tenía razón. Escribe el diálogo como un espejo: el poder sin límites que no escucha razones y la libertad que no sabe medir sus fuerzas. Pocos meses después, la misma Asamblea votó la expedición a Sicilia, que acabaría en desastre.</p><p class="sub">Para pensar: ¿se puede hablar de justicia entre quienes no tienen el mismo poder? ¿Qué habrías hecho tú?</p>'+(first?'<p class="sub">+3 Lógos · +1 Sophía</p>':'');
    add('Volver a la conversación',()=>{B.innerHTML='<p>Pregunta lo que quieras.</p>';renderOpts();});};
  round();}
// ---------------------------------------------------------------- 4. nuevas patrias para el forastero
ORIG.atenas.push(
 {id:'quios',n:'Quíos, en Jonia',de:'de Quíos',gm:'quiota',gf:'quiota',pn:'Aristócrito',pt:'Ateniense, próxeno de los quiotas',look:{chiton:'#efe6d4',himation:'#6a3a5a',beard:true,hair:'#5a4a3a'},
  pi:'¡De Quíos! Soy Aristócrito, vuestro próxeno. Si te tratan mal en el mercado, ven a mi casa. Y si traes vino de tu tierra, mejor.',
  tp:[['¿Qué pasa ahora con Quíos?','Con la paz del Rey, Quíos es autónoma: libre y sola. Se habla de una alianza con Atenas, pero esta vez entre iguales, sin tributos. Tu ciudad no ha olvidado lo que pagaba en tiempos del imperio, ni la guerra del 412.'],['¿Qué saben de Quíos los atenienses?','Que tenéis el mejor vino, que decís que Homero era vuestro y que sois ricos. Y que de Quíos vinieron Ion, el poeta que conoció a Sófocles y a Pericles, e Hipócrates, el que enseñó geometría aquí y escribió los primeros elementos.'],['¿Cómo me tratarán?','Con respeto y un poco de envidia. Y algunos te recordarán que en Quíos hay más esclavos que ciudadanos. No discutas: diles que en el Laurio hay más todavía.']],
  bark:['¿Quiota? Invítame a una copa de tu vino y te perdono todo.','Dicen que Homero era de tu isla. ¿Lo conociste? ¡Es broma!'],react:'Al oír «de Quíos», se le iluminan los ojos: «¿Has traído vino?».'},
 {id:'rodas',n:'Rodas',de:'de Rodas',gm:'rodio',gf:'rodia',pn:'Demófilo',pt:'Ateniense, próxeno de los rodios',look:{chiton:'#efe6d4',himation:'#2f5a7a',beard:true,hair:'#3b2a1e'},
  pi:'¡Rodio! Soy Demófilo, tu próxeno. Vuestra ciudad nueva da que hablar: dicen que es la más bonita del Egeo.',
  tp:[['¿Cómo ven aquí a los rodios?','Como navegantes y comerciantes. Y como gente que cambia de bando: con Esparta, con Atenas, otra vez con Esparta… Los atenienses no lo dicen en voz alta porque ellos han hecho lo mismo.'],['¿Conocen aquí a Diágoras?','Todo el mundo. Y a su hijo Dorieo, campeón olímpico, que luchaba contra Atenas: lo capturaron en el 407 y lo trajeron aquí para condenarlo. Cuando la Asamblea vio al gran atleta encadenado, lo dejó libre sin pedir nada. Así es Atenas, a veces.']],
  bark:['¿De Rodas? Allí tenéis el sol todo el año, dicen.','Los rodios sois buenos marineros. Mi hermano siempre embarca con uno.'],react:'Al oír «de Rodas», asiente: «Buenos marineros, los rodios».'},
 {id:'melos',n:'Melos, en las Cícladas',de:'de Melos',gm:'melio',gf:'melia',pn:'Nicóstrato',pt:'Ateniense que votó contra el castigo de Melos',look:{chiton:'#d8cfc0',himation:'#5a5a6a',beard:true,beardC:'#d8d0c2',hair:'#d8d0c2'},
  pi:'De Melos… Me llamo Nicóstrato. Melos no tiene próxeno en Atenas, pero yo voté contra lo que os hicimos en el 416, y desde entonces ayudo a los melios que llegan. Bienvenido, o bienvenida.',
  tp:[['¿Cómo me mirarán en Atenas?','Algunos con vergüenza, otros con desprecio, la mayoría sin saber nada. Al año siguiente de lo de Melos, Eurípides estrenó Las troyanas: mujeres llorando a sus muertos antes de ser repartidas como esclavas. Todos entendieron. Ve a verla si la reponen.'],['¿Conocen aquí a otro melio?','A Diágoras, el poeta. Lo llamaban el ateo: se burlaba de los dioses y contaba en público los secretos de los Misterios de Eleusis. La ciudad ofreció un talento a quien lo matara. Huyó a tiempo. Aristófanes hizo chistes con él. No digas que eres pariente suyo.']],
  bark:['¿De Melos? Mi abuelo estuvo en aquel asedio. Mejor no hablemos de eso.','Melos… La isla de los que se negaron. Tenían valor, eso hay que reconocerlo.'],react:'Al oír «de Melos», se queda callado un momento y baja la vista.'},
 {id:'bizancio',n:'Bizancio, en el Bósforo',de:'de Bizancio',gm:'bizantino',gf:'bizantina',pn:'Antímaco',pt:'Ateniense, próxeno de los bizantinos',look:{chiton:'#efe6d4',himation:'#4f6a3a',beard:true,hair:'#4a3a2a'},
  pi:'¡Bizantino! Soy Antímaco. Atenas os necesita más de lo que dice: por vuestro estrecho pasa nuestro pan.',
  tp:[['¿Somos aliados de Atenas?','Desde hace tres años, cuando Trasíbulo puso en Bizancio un gobierno democrático y volvió a cobrar el diezmo del estrecho. Con la paz del Rey nadie sabe qué pasará, pero mientras el trigo pase, aquí os recibirán bien.'],['¿Qué dicen de los bizantinos?','Que vivís en las tabernas, que dejáis vuestras casas a los forasteros y que bebéis más que nadie. Lo dice un historiador de Quíos con muy mala lengua. Y como vuestros abuelos eran de Mégara, los atenienses os gastan las mismas bromas que a los megarenses.']],
  bark:['¿De Bizancio? Mientras pase el trigo, aquí eres de la familia.','Los bizantinos coméis atún hasta en el desayuno, ¿no?'],react:'Al oír «de Bizancio», sonríe: «¡El que nos da de comer!».'},
 {id:'corcira',n:'Corcira, en el mar Jonio',de:'de Corcira',gm:'corcireo',gf:'corcirea',pn:'Hegesandro',pt:'Ateniense, próxeno de los corcireos',look:{chiton:'#efe6d4',himation:'#7a5a2a',beard:true,hair:'#3b2a1e'},
  pi:'¡Corcireo! Soy Hegesandro, vuestro próxeno. Vuestra isla y la nuestra se aliaron hace medio siglo, y desde entonces no nos ha ido muy bien a ninguna de las dos.',
  tp:[['¿Qué recuerdan de Corcira?','La alianza del 433 contra Corinto, que encendió la guerra, y la guerra civil del 427, que Tucídides describió mejor que nadie. Algunos te mirarán como a un pariente del caos. No les hagas caso.'],['¿Qué tiene Corcira de bueno?','Un puerto en el camino de Italia y Sicilia, buenos aceites y una flota que todos quieren tener de su lado. Y los feacios de Homero, si es que eran vuestros.']],
  bark:['¿Corcireo? Vuestro aceite es bueno. Vuestras guerras civiles, no tanto.','Corcira… La isla de Nausícaa, ¿verdad?'],react:'Al oír «de Corcira», levanta una ceja: «Del camino de Italia».'});
Object.assign(FX_COINS,{quios:'las monedas de Quíos, con una esfinge sentada junto a un ánfora',rodas:'las monedas de Rodas, con la cabeza de Helios y una rosa',bizancio:'las monedas de Bizancio, con un buey sobre un delfín',melos:'las monedas de Melos, con una granada',corcira:'las monedas de Corcira, con una vaca que amamanta a su ternero',samos:'las monedas de Samos, con una cabeza de león',olinto:'las monedas de la liga de los calcideos, con Apolo y una lira'});
// ---------------------------------------------------------------- 5. capítulo de historia: la paz del Rey
if(typeof STORY_ATENAS!=='undefined')STORY_ATENAS.push({cat:'Historia',title:'La paz del Rey',
 actors:[{id:'padre11',name:'Eudemo',title:'Tu padre',look:LK.padre,at:'npc:naucleros',dx:5,dz:3}],
 intro:'Ha pasado un mes. Tu padre, Eudemo, no quiere volver a remar en una trirreme: ha decidido probar suerte como mercader, con un préstamo de Ctesón, el naviero del Pireo. Pero antes de cargar nada quiere entender cómo ha cambiado el mar con la paz que todos llaman «del Rey». Y quiere que vayas con él.',
 steps:[
  {obj:'Reúnete con tu padre en el Pireo, junto a Ctesón el naviero',actor:'padre11',scene:[
   ['Eudemo','Mira este puerto. Hace un año los barcos de trigo no llegaban: el espartano Antálcidas había cerrado el Helesponto con una flota pagada por los persas. Y la Asamblea tuvo que aceptar la paz.'],
   ['Eudemo','El heraldo leyó el texto en el Ágora. Me lo sé casi de memoria: «El rey Artajerjes considera justo que sean suyas las ciudades de Asia y, de las islas, Clazómenas y Chipre. Las demás ciudades griegas, pequeñas y grandes, serán autónomas, salvo Lemnos, Imbros y Esciros, que serán de los atenienses como antes. A quien no acepte esta paz, yo le haré la guerra».'],
   {who:'Eudemo',ask:'Según el texto de la paz, ¿de quién son ahora las ciudades griegas de Asia?',a:['Del rey de Persia','De Atenas','De Esparta'],ok:'Eso es. Después de un siglo de guerras para liberarlas, los griegos se las han devuelto al Gran Rey. Por eso hay quien la llama la paz de la vergüenza.',ko:'Vuelve a escuchar el texto: «El rey considera justo que sean suyas las ciudades de Asia».'},
   ['Eudemo','Vamos a ver con nuestros propios ojos qué significa. Primero, al Bósforo: allí se decide el pan de Atenas.'],
   ['','Embarcáis en un mercante. Seis días después, Bizancio aparece en la orilla del estrecho.'],{fn:()=>storyTravel('npc:protomaco_bizancio',6,6)}]},
  {obj:'Habla con Protómaco, el mercader de trigo de Bizancio',npc:'protomaco_bizancio',scene:[
   ['Protómaco','¿Atenienses? Llegáis en buen momento. El año pasado Antálcidas tuvo cerrado el Helesponto con ochenta naves: ni un grano pasaba hacia el Pireo. Así se gana una guerra sin batalla.'],
   ['Protómaco','Ahora, con la paz, el estrecho vuelve a estar abierto. Pero el diezmo que cobraba vuestro Trasíbulo se ha acabado. Y quien tenga más barcos mandará en el mar, diga lo que diga el papel.'],
   ['Eudemo','Entonces Atenas necesita amigos en el mar. Vamos a Quíos.'],['','Bajáis por el Helesponto, pasáis frente a Troya y Lesbos, y llegáis a Quíos.'],{fn:()=>storyTravel('npc:teocrines_quios',6,6)}]},
  {obj:'Habla con Teocrines, el vinatero de Quíos',npc:'teocrines_quios',scene:[
   ['Teocrines','¿Autónomos? Eso dice la paz: cada isla es libre. Libre y sola. Si mañana los espartanos quieren poner aquí un gobierno de amigos suyos, ¿quién nos defiende?'],
   ['Teocrines','Por eso hablamos con Atenas. Vosotros tenéis barcos; nosotros, vino y dinero. Pero una alianza entre iguales: sin tributos, sin guarniciones, sin colonos atenienses en nuestras tierras. ¿La aceptaría vuestra Asamblea?'],
   {choose:[['«Creo que sí: Atenas ha aprendido la lección»',[['Teocrines','Ojalá. Aquí nadie ha olvidado el tributo del imperio.']],'optimista'],['«Atenas quiere volver a mandar, como antes»',[['Teocrines','Al menos eres sincero. Pues que lo pongan por escrito: nada de tributos.']],'esceptico']]},
   ['','Dos años después, en el 384, Quíos y Atenas firmarán una alianza «en libertad y autonomía». En el 378 será la base de la Segunda Liga ateniense, que prometía no cobrar tributos ni instalar colonos.'],
   ['Eudemo','Falta ver el otro lado del mar: lo que se ha quedado el Rey. Vamos a Éfeso.'],{fn:()=>storyTravel('npc:glauce_efeso',6,6)}]},
  {obj:'Habla con Glauce, la sacerdotisa de Ártemis, en Éfeso',npc:'glauce_efeso',scene:[
   ['Glauce','Aquí ya pagamos tributo al sátrapa de Sardes, como en tiempos de nuestros abuelos. A la diosa le da igual quién mande: los persas respetan el santuario, y los peregrinos siguen viniendo.'],
   ['Glauce','Pero a los que gobernaban la ciudad con apoyo de Atenas o de Esparta les ha ido mal. Ahora mandan los amigos del sátrapa. Muchos se han ido a las islas, al otro lado del agua, donde todavía se puede decir lo que se piensa.'],
   {who:'Glauce',ask:'¿Qué ha cambiado para Éfeso con la paz del Rey?',a:['Vuelve a estar bajo el dominio persa y paga tributo al sátrapa','Se ha hecho aliada de Atenas','Se ha vuelto independiente'],ok:'Así es. Las ciudades griegas de Asia quedaron bajo Persia hasta que Alejandro las conquistó, cincuenta y tres años después.',ko:'Piensa en el texto de la paz: ¿de quién son las ciudades de Asia?'},
   ['Eudemo','Ya hemos visto bastante. Volvamos a casa.'],{fn:()=>storyTravel('actor:padre11',4,4)}]},
  {obj:'Vuelve con tu padre, en el Pireo',actor:'padre11',scene:[
   ['Eudemo','Así que esta es la paz: el Rey de Persia, al que vencimos en Maratón y en Salamina, decide ahora quién es libre en Grecia. Esparta hace de guardián y cobra su parte. Y Atenas busca amigos para volver a tener flota.'],
   {who:'Eudemo',ask:'¿Quién crees que salió ganando con la paz del Rey?',a:['El rey de Persia, que recuperó Asia sin luchar y se convirtió en árbitro de Grecia','Atenas, que recuperó su imperio','Tebas, que pasó a dominar Grecia'],ok:'Eso mismo pensaban muchos griegos. Isócrates, el maestro de retórica, escribirá que los bárbaros, a los que antes se vencía, ahora dictan las condiciones.',ko:'Piensa en quién decide en el texto de la paz y quién no tuvo que luchar para conseguirlo.'},
   ['Eudemo','Bueno. El trigo de Bizancio, el vino de Quíos… Ya sé qué voy a comerciar. Y tú vendrás conmigo.']]}],
 end:'Con tu padre has recorrido el mar de la paz del Rey: el estrecho por donde pasa el pan de Atenas, una isla que busca aliados sin amos y una ciudad de Asia que vuelve a pagar tributo a Persia.',
 learn:'La paz del Rey o de Antálcidas (387-386 a.C.) acabó con la guerra de Corinto. El rey persa Artajerjes II recuperó las ciudades griegas de Asia y Chipre, y declaró autónomas las demás ciudades griegas, con Esparta como garante. Persia, que no había podido conquistar Grecia por las armas, se convirtió en árbitro de sus guerras. Atenas reaccionó buscando aliados libres, como Quíos (384), que formarán la Segunda Liga ateniense en el 378.'});
// ---------------------------------------------------------------- 6. misiones que unen lugares
const MISION_TXT={escudo:'Glauco, en Pilos, quiere saber qué dicen los escudos de Esfacteria colgados en la Stoa Poikile de Atenas.',melio:'Cleóbula, en Melos, te ha pedido que busques en el Cerámico de Atenas a su hermano Aristeas, vendido de niño.',moriai:'Eutifrón, en Decelia, te ha pedido que revises los cinco olivos sagrados del demo.'};
function m386Opts(n,add){comMode();const m=m386z();m386OptsR(n,add);
  if(Object.values(COM).some(g=>g.de===n.id))add('Comerciar: comprar '+Object.keys(COM).filter(k=>COM[k].de===n.id).map(k=>COM[k].k).join(' o '),'quiz',()=>comSellerMenu(n));
  if(MODE==='atenas'?n.id==='naucleros':n.id==='mercader')add(comTot()?'Venderte mi carga ('+comCargaTxt()+')':'Hablar de comercio y de las noticias del puerto','quiz',()=>comBuyerMenu(n));
  if(n.id==='carino_salamina')add(m.mg_salamina?'Volver a soñar la batalla de Salamina':'Soñar la batalla de Salamina (minijuego)','quiz',()=>mgOpen(MG_SAL));
  if(n.id==='glauco_pilos')add(m.mg_esfacteria?'Volver a soñar la noche de tu abuelo':'Soñar la noche de tu abuelo en Esfacteria (minijuego)','quiz',()=>mgOpen(MG_ESF));
  if(n.id==='cleobula_melos')add(m.melos?'Volver a hablar por los melios':'Revivir el diálogo de los melios: hablar tú por Melos','quiz',()=>melosDlg(n));
  const one=(k,who,ask,on,ok,okFn)=>{if(n.id!==who)return;const st=m['ms_'+k];if(st==='fin')return;
    add(!st?ask:st==='hecho'?ok:'Sobre lo que me pediste…','quiz',()=>{const B=$('dBody');if(!st){m['ms_'+k]='on';save();B.innerHTML=on;toast('<span class="label">Misión</span><br>'+MISION_TXT[k]);renderOpts();}
      else if(st==='hecho'){m['ms_'+k]='fin';state.obols+=6+klBonus();qAdd('kl',2,'Has cumplido un encargo.');save();updateStats();sfxCoin();B.innerHTML=okFn();renderOpts();}
      else{B.innerHTML='<p>'+MISION_TXT[k]+'</p>';renderOpts();}});};
  one('escudo','glauco_pilos','¿Puedo hacer algo por ti?','<p>«Mi abuelo decía que los atenienses colgaron los escudos de los espartanos de Esfacteria en un pórtico de su ciudad, y que tienen letras. Yo no sé leer, y nunca iré a Atenas. Si vas, míralos y dime qué pone».</p>','Ya he visto los escudos de Pilos',()=>'<p>Le cuentas lo que pone: «Los atenienses, de los lacedemonios, de Pilos». Glauco se queda callado y luego se ríe bajito. «Así que los grandes espartanos están colgados en una pared, como trofeos de caza. Mi abuelo habría pagado por verlo». Te da seis óbolos de sus ahorros, aunque intentas no aceptarlos.</p>');
  one('melio','cleobula_melos','¿Puedo hacer algo por ti?','<p>«Tengo un hermano pequeño, Aristeas. Lo vendieron con siete años, el mismo día que a mí, pero a otro comprador. Me dijeron que lo compró un alfarero del Cerámico, en Atenas. Si vas por allí… solo quiero saber si vive».</p>','He encontrado a Aristeas',()=>'<p>Le cuentas que Aristeas vive, que es liberto, que tiene un taller de lámparas y dos hijas. Cleóbula aprieta la lamparilla que te dio entre las manos. «Siete años tenía. Y ahora tiene hijas». Llora y se ríe a la vez. «Dile que aquí sigue la higuera». Insiste en pagarte seis óbolos por el viaje.</p>');
  one('moriai','eutifron_decelia','¿Puedo ayudarte en algo?','<p>«Este mes vienen los inspectores del Areópago a revisar los olivos sagrados del demo, las morías, que son de Atenea. Hay cinco en nuestras tierras, cada uno con su cerca. Si falta uno, o alguien lo ha arrancado, el dueño de la finca va a juicio, y le puede costar el destierro. ¿Me ayudas a revisarlos? Están repartidos por el demo».</p>','He revisado los cinco olivos sagrados',()=>'<p>Le cuentas lo que has visto: cuatro olivos sanos y un tocón quemado, con su cerca. Eutifrón suspira aliviado. «El tocón también cuenta: está cercado y nadie lo ha tocado. Es de la guerra, cuando los espartanos quemaron todo. Hace unos años un vecino fue a juicio por arrancar uno de esos tocones, y lo defendió Lisias. Gracias». Te da seis óbolos.</p>');}
function m386Setup(){m386SetupR();if(MODE!=='atenas')return;const m=m386z();
  const pk=placeAt('poikile');if(pk)egxObj(pk.x+4,pk.z-6,undefined,'m:escudo','Los escudos de Pilos','Stoa Poikile');
  const ce=placeAt('ceramico');if(ce){const x=ce.x+14,z=ce.z+10;if(!M386.melio){M386.melio=makePerson({noVary:true,short:true,noHimation:true,chiton:'#a08a62',hair:'#3a2a1e',beard:true});M386.melio.position.set(x,floorAt(x,z),z);scene.add(M386.melio);addCirc(x,z,0.4);}egxObj(x,z,undefined,'m:melio','Aristeas','alfarero');}
  const D=ISLANDS.find(I=>I.id==='decelia');if(D)[[-200,60],[150,-60],[60,200],[-120,-220],[250,120]].forEach((q,i)=>{const x=D.x+q[0],z=D.z+q[1];if(!M386['o'+i]){M386['o'+i]=1;const gy=floorAt(x,z);
    if(i===3){const s=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.8,0.7,10),lam('#2a2018'));s.position.set(x,gy+0.35,z);scene.add(s);}else if(GLB.ok)treesGLB([{x,z,kind:'olive',k:1.5,collide:true}]);
    for(let k=0;k<10;k++){const a=k/10*TAU;box(0.12,1,0.12,lam('#6b5236'),x+Math.cos(a)*2.6,gy+0.5,z+Math.sin(a)*2.6);}}
    egxObj(x+3,z,undefined,'m:moria'+i,'Olivo sagrado de Atenea','moría');});}
const M386={};
function m386Act(o){if(MODE==='roma')return m386ActR(o);const m=m386z(),one=casaOpen('◆',o.data.name,o.data.role||''),B=$('dBody');
  if(o.act==='m:escudo'){B.innerHTML='<p>Colgados en la pared del pórtico, entre las pinturas de Maratón y de Troya, hay varios escudos de bronce, abollados y untados de pez para que no se oxiden. Son los escudos de los espartanos que se rindieron en Esfacteria en el 425. En uno se lee, punteado en el bronce: <b>ΑΘΗΝΑΙΟΙ ΑΠΟ ΛΑΚΕΔΑΙΜΟΝΙΩΝ ΕΚ ΠΥΛΟ</b>, «los atenienses, de los lacedemonios, de Pilos».</p><p class="sub">Pausanias I 15.4. Uno de estos escudos apareció en 1936 en un pozo del Ágora.</p>';
    if(m.ms_escudo==='on'){m.ms_escudo='hecho';save();toast('<span class="label">Misión</span><br>Vuelve a Pilos y cuéntaselo a Glauco.');}one('Seguir',closeDialog);return;}
  if(o.act==='m:melio'){if(m.ms_melio==='on'||m.ms_melio==='hecho'){B.innerHTML='<p>«¿Cleóbula? ¿Mi hermana Cleóbula, viva?». El alfarero deja el torno. «Yo era Aristeas. Aquí me llaman Melio, por la isla. Mi amo me dejó libre hace seis años; ahora hago lámparas para los muertos del Cerámico, ya ves». Se le quiebra la voz. «De la isla solo recuerdo una higuera junto a la puerta. Dale esto». Te da una lamparilla de barro.</p>';if(m.ms_melio==='on'){m.ms_melio='hecho';save();toast('<span class="label">Misión</span><br>Vuelve a Melos y cuéntaselo a Cleóbula.');}}
    else B.innerHTML='<p>Un alfarero modela lámparas en su torno, junto al cementerio. «¿Lámparas? Las mejores del Cerámico. Para los vivos y para los muertos». Habla con un acento ático perfecto.</p>';one('Seguir',closeDialog);return;}
  if(o.act.startsWith('m:moria')){const i=+o.act.slice(7);if(m.ms_moriai==='on'&&!m.moriai.includes(i)){m.moriai.push(i);save();}
    B.innerHTML=(i===3?'<p>Dentro de la cerca solo queda un tocón negro, quemado. Pero la cerca está entera y nadie lo ha arrancado: sigue siendo de la diosa.</p>':'<p>Un olivo viejo y retorcido, rodeado por una cerca de madera: es una moría, un olivo sagrado de Atenea. Nadie puede cortarlo ni arrancarlo, ni siquiera el dueño de la tierra, y su aceite se entrega para los premios de las Panateneas.</p>')+
      (m.ms_moriai==='on'?'<p class="sub">Olivos revisados: '+m.moriai.length+' de 5.</p>':'<p class="sub">Lisias VII; Aristóteles, Constitución de los atenienses 60.</p>');
    if(m.ms_moriai==='on'&&m.moriai.length>=5){m.ms_moriai='hecho';save();toast('<span class="label">Misión</span><br>Has revisado los cinco. Vuelve con Eutifrón.');}one('Seguir',closeDialog);return;}}

