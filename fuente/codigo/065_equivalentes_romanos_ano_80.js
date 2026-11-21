// ============================================================ equivalentes romanos (año 80): comercio desde el Emporio, la carrera del Circo Máximo,
// la huida de Miseno, el debate de Claudio sobre los galos, cuatro patrias nuevas, el capítulo «El pan de Roma» y tres misiones
const COM_TXT={atenas:{none:'No traes nada que vender. Compra vino en Quíos, trigo o atún en Bizancio, tierra blanca en Melos o madera en Olinto, y tráemelo.',
  how:'<p>El mercader rara vez es rico: pide un préstamo marítimo a un banquero o a un particular para comprar la carga, y si el barco se hunde, no lo devuelve. Por eso el interés es altísimo, un 20 o un 30 % por viaje. Se firma un contrato ante testigos con la ruta, la carga y el plazo.</p><p>El trigo es especial: una ley prohíbe a cualquiera que viva en el Ática llevar trigo a otro puerto que no sea Atenas, y prestar dinero para un barco que no lo traiga. Los guardianes del trigo vigilan que los revendedores no lo acaparen. Y no se navega en invierno, salvo necesidad.</p><p class="sub">Demóstenes XXXIV 37 y XXXV 10-13 y 50-51; Lisias XXII; Aristóteles, Constitución de los atenienses 51. Los precios del juego están simplificados.</p>'},
 roma:{none:'No traes nada que vender. Compra trigo en Cartago, aceite en Corduba, garum en Gades o plomo en Carthago Nova, y tráemelo aquí, al Emporio.',
  how:'<p>Roma, con casi un millón de habitantes, come trigo que viene del mar: según Flavio Josefo, África la alimenta ocho meses al año y Egipto, los otros cuatro. El Estado reparte trigo gratis cada mes a unos doscientos mil ciudadanos (la annona), y el prefecto de la annona compra y vigila los envíos. El emperador Claudio prometió compensar las pérdidas a los mercaderes que traían trigo en invierno, y premiaba a quienes construían barcos para ello.</p><p>El aceite de la Bética llega en ánforas redondas con sellos y etiquetas pintadas: el peso, el mercader, el control fiscal. Del 11 de noviembre al 10 de marzo, el mar está «cerrado»: casi nadie navega.</p><p class="sub">Flavio Josefo, La guerra de los judíos II 383-386; Suetonio, Claudio 18-19; Vegecio IV 39; Digesto XXII 2. Los precios del juego están simplificados.</p>'}};
function comTxt(){return COM_TXT[MODE==='roma'?'roma':'atenas'];}
function comMode(){if(MODE!=='roma'||COM.__r)return;for(const k in COM)delete COM[k];Object.defineProperty(COM,'__r',{value:true,enumerable:false});
  Object.assign(COM,{trigo:{k:'trigo',n:'saco de trigo de África',pl:'sacos de trigo de África',de:'himilcon',b:3,s:6},
   aceite:{k:'aceite',n:'ánfora de aceite de la Bética',pl:'ánforas de aceite de la Bética',de:'olearius',b:5,s:9},
   garum:{k:'garum',n:'ánfora de garum de Gades',pl:'ánforas de garum de Gades',de:'himilcon_gades',b:6,s:12},
   plomo:{k:'plomo',n:'lingote de plomo de Carthago Nova',pl:'lingotes de plomo de Carthago Nova',de:'eros_cn',b:4,s:8}});
  COM_EV.length=0;COM_EV.push(null,
   {t:'Ha llegado a Puteoli la flota del trigo de Alejandría: todo el mundo baja al muelle a verla, y el trigo baja de precio.',g:'trigo',f:0.75},
   {t:'Tito prepara los cien días de juegos del Anfiteatro: se necesita aceite para las lámparas y los cuerpos de los atletas.',g:'aceite',f:1.35},
   null,
   {t:'Después del gran incendio de este año, se reconstruye el Campo de Marte: se paga bien el plomo para tuberías y tejados.',g:'plomo',f:1.45},
   {t:'En los banquetes de moda no puede faltar el garum de Gades, el «garum de los aliados», el más caro.',g:'garum',f:1.35},
   null,
   {t:'Hay piratas cerca de Sicilia: los barcos esperan escolta y todo se encarece.',g:'*',f:1.2},
   {t:'Un mercader ha descargado un barco entero de aceite de la Bética: hay de sobra.',g:'aceite',f:0.75},
   {t:'El prefecto de la annona compra trigo para el reparto del mes.',g:'trigo',f:1.25});
  comPrice=function(g,sell){const G=COM[g],mo=calNow().mo;let f=1;const why=[];
    if(g==='trigo'){if(sell){if(mo>=10||mo<=2){f*=1.35;why.push('es invierno: el mar está cerrado y casi no llegan barcos');}else if(mo>=5&&mo<=8){f*=0.85;why.push('en verano llegan las flotas de África y de Egipto');}}else if(mo>=5&&mo<=8){f*=0.8;why.push('en África acaban de cosechar');}}
    if(g==='aceite'&&!sell&&(mo>=10||mo<=1)){f*=0.8;why.push('en la Bética acaban de recoger la aceituna');}
    if(g==='plomo'&&sell&&mo>=3&&mo<=8){f*=1.15;why.push('en la buena estación se construye más');}
    if(sell){const e=comEv();if(e&&(e.g===g||e.g==='*')){f*=e.f;why.push(e.t.charAt(0).toLowerCase()+e.t.slice(1,-1));}}
    return comLogos(sell?G.s:G.b,f,why,sell);};}
// ---- 2a. la carrera del Circo Máximo (desde Félix)
const CIRC={y:45,x0:35,x1:125,rin:9,rout:36};
function circD(x,y){const cx=clamp(x,CIRC.x0,CIRC.x1);return Math.hypot(x-cx,y-CIRC.y);}
function circPt(s,r){const S=CIRC.x1-CIRC.x0,A=Math.PI*r,L=2*S+2*A;s=((s%L)+L)%L;
  if(s<S)return[CIRC.x0+s,CIRC.y+r];s-=S;if(s<A){const th=Math.PI/2-s/r;return[CIRC.x1+r*Math.cos(th),CIRC.y+r*Math.sin(th)];}s-=A;
  if(s<S)return[CIRC.x1-s,CIRC.y-r];s-=S;const th=-Math.PI/2-s/r;return[CIRC.x0+r*Math.cos(th),CIRC.y+r*Math.sin(th)];}
function circLen(r){return 2*(CIRC.x1-CIRC.x0)+2*Math.PI*r;}
function circS(x,y){const r=Math.max(1,circD(x,y)),S=CIRC.x1-CIRC.x0,A=Math.PI*r;
  if(x>=CIRC.x0&&x<=CIRC.x1)return y>CIRC.y?x-CIRC.x0:S+A+(CIRC.x1-x);
  if(x>CIRC.x1){const th=Math.atan2(y-CIRC.y,x-CIRC.x1);return S+(Math.PI/2-th)*r;}
  let th=Math.atan2(y-CIRC.y,x-CIRC.x0);let ph=-Math.PI/2-th;ph=((ph%(2*Math.PI))+2*Math.PI)%(2*Math.PI);return 2*S+A+ph*r;}
function mgQuad(x,c,col,t){x.save();x.translate(c.x,c.y);x.rotate(c.a);if(c.crash)x.rotate(Math.sin(t*20)*0.4);
  x.fillStyle='#6b4a2e';x.fillRect(-1.6,-0.9,1.6,1.8);x.fillStyle=col;x.fillRect(-1.4,-0.7,1.2,1.4);x.strokeStyle='#3a2a1a';x.lineWidth=0.15;x.beginPath();x.moveTo(0,0);x.lineTo(1.2,0);x.stroke();
  const ph=t*14+(c.ph||0);for(let i=0;i<4;i++){const yy=-1.35+i*0.9,bob=Math.sin(ph+i)*0.15;x.fillStyle=['#5a3a22','#d8cfc0','#3a2a1e','#8a6a4a'][i];x.beginPath();x.ellipse(2.6+bob,yy,1.2,0.32,0,0,TAU);x.fill();x.beginPath();x.arc(3.7+bob,yy,0.22,0,TAU);x.fill();}
  if(c.me){x.strokeStyle='#e8b07a';x.lineWidth=0.3;x.strokeRect(-1.7,-1,1.8,2);}x.restore();
  if(c.me){x.fillStyle='#e8b07a';x.font='2.3px Georgia';x.textAlign='center';x.fillText('tú',c.x,c.y-2.6);x.textAlign='left';}}
const MG_CIRCO={id:'circo',title:'Una carrera en el Circo Máximo',
 intro:'<p>Félix te deja subir a su cuadriga para un entrenamiento… y esa noche sueñas que corres con los Verdes ante doscientas cincuenta mil personas. Tres vueltas (en las carreras de verdad son siete) alrededor de la spina, la barrera central con el obelisco de Augusto.</p><p>Las curvas, junto a las metae, son peligrosas: si chocas contra la spina o contra el muro a mucha velocidad, tu carro se hace pedazos (un naufragium) y pierdes un tiempo precioso. Usa el látigo con cuidado: los caballos se cansan.</p>',
 ctl:'<b>A</b> y <b>D</b> (o las flechas) para girar, <b>W</b> para el látigo, <b>S</b> para frenar.',ctlT:'Gira con <b>◀</b> y <b>▶</b>; <b>Látigo</b> para acelerar; <b>Frenar</b> en las curvas.',
 touch:[['ArrowLeft','◀'],['KeyS','Frenar'],['KeyW','Látigo'],['ArrowRight','▶']],
 src:'Plinio, Historia natural VIII 160 y XXXVI 102; Dionisio de Halicarnaso III 68; Suetonio, Calígula 55. Inscripción de Diocles, CIL VI 10048. En el juego hay cuatro carros; en el Circo podían correr doce.',
 first:'¡Cae la mappa! Las puertas de los carceres se abren.',winT:'¡Victoria de los Verdes!',failT:'No has ganado',
 init(G){const r=[14,19,24,29];G.cars=r.map((rr2,i)=>({x:CIRC.x0+2+i*0.5,y:CIRC.y+rr2,a:0,v:0,ln:rr2,me:i===1,col:['#c0392b','#2e8b3a','#e8e4da','#2f5d9a'][i],laps:0,half:false,top:15.6+Math.random()*2.6,ph:i,st:100,crash:0}));G.p=G.cars[1];G.done=false;G.place=0;G.order=[];},
 tick(G,dt){const P=G.p;
  for(const c of G.cars){if(c.crash>0){c.crash-=dt;c.v*=0.9;if(c.crash<=0){const s=circS(c.x,c.y),q=circPt(s,c.ln);c.x=q[0];c.y=q[1];}continue;}
    if(c.me){const tr=(mgk('KeyA','ArrowLeft')?-1:0)+(mgk('KeyD','ArrowRight')?1:0);const whip=mgk('KeyW','ArrowUp')&&c.st>0,brake=mgk('KeyS','ArrowDown');
      const tv=whip?21:brake?7:15;c.v+=(tv-c.v)*Math.min(1,dt*(brake?2:1.1));if(whip)c.st=Math.max(0,c.st-22*dt);else c.st=Math.min(100,c.st+8*dt);c.a+=tr*2.3*dt*(1-c.v/45);}
    else{const s=circS(c.x,c.y),q=circPt(s+7,c.ln),want=Math.atan2(q[1]-c.y,q[0]-c.x);c.a+=clamp(wrapA(want-c.a),-2.2*dt,2.2*dt);const curve=c.x<CIRC.x0+4||c.x>CIRC.x1-4;c.v+=((curve?c.top*0.78:c.top)-c.v)*dt*0.9;}
    c.x+=Math.cos(c.a)*c.v*dt;c.y+=Math.sin(c.a)*c.v*dt;
    if(c.me&&(c.x<CIRC.x0||c.x>CIRC.x1)&&c.v>14){const cx=c.x<CIRC.x0?CIRC.x0:CIRC.x1,dd=Math.hypot(c.x-cx,c.y-CIRC.y)||1,push=(c.v-14)*(c.v-14)*0.05*dt;c.x+=(c.x-cx)/dd*push;c.y+=(c.y-CIRC.y)/dd*push;if(!G.dw&&c.v>17){G.dw=1;mgSay('¡Derrapas en la curva! Afloja el látigo.',2);}}else if(c.me)G.dw=0;
    const d=circD(c.x,c.y);if(d<CIRC.rin+1.5||d>CIRC.rout-1.5){const hard=c.v>12;const cx=clamp(c.x,CIRC.x0,CIRC.x1),nx=(c.x-cx)/(d||1),ny=(c.y-CIRC.y)/(d||1),tgt=d<CIRC.rin+1.5?CIRC.rin+1.6:CIRC.rout-1.6;c.x=cx+nx*tgt;c.y=CIRC.y+ny*tgt;
      if(hard){c.crash=2.6;c.v=0;if(c.me)mgSay(d<CIRC.rin+2?'¡Naufragium! Rozas la spina en la curva y el carro vuelca. Los mozos lo enderezan…':'¡Naufragium! Te estrellas contra el muro. El público ruge.',3);}else c.v*=0.6;}
    // vueltas: cruzar la línea blanca (x=80) en la recta de abajo, después de haber pasado por la de arriba
    if(c.y<CIRC.y)c.half=true;if(c.half&&c.y>CIRC.y&&c.px!==undefined&&c.px<80&&c.x>=80){c.laps++;c.half=false;if(c.laps>=3&&!c.fin){c.fin=true;G.order.push(c);if(c.me)G.place=G.order.length;}
      else if(c.me&&c.laps<3)mgSay('Vuelta '+c.laps+' de 3. Un delfín de bronce se gira en la spina.',2.5);}
    c.px=c.x;}
  for(let i=0;i<G.cars.length;i++)for(let j=i+1;j<G.cars.length;j++){const a=G.cars[i],b=G.cars[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<2.4){const nx=(a.x-b.x)/(d||1),ny=(a.y-b.y)/(d||1);a.x+=nx*0.5;a.y+=ny*0.5;b.x-=nx*0.5;b.y-=ny*0.5;a.v*=0.97;b.v*=0.97;}}
  if(G.place)return G.place===1?'win':'fail';if(G.order.length>=3&&!G.p.fin)return 'fail';return null;},
 draw(G,x){const t=G.t;x.fillStyle='#6a5a44';x.fillRect(0,0,160,90);x.fillStyle='#c9b48b';x.beginPath();x.arc(CIRC.x0,CIRC.y,CIRC.rout,Math.PI/2,Math.PI*1.5);x.lineTo(CIRC.x1,CIRC.y-CIRC.rout);x.arc(CIRC.x1,CIRC.y,CIRC.rout,-Math.PI/2,Math.PI/2);x.closePath();x.fill();
  for(let i=0;i<220;i++){x.fillStyle='rgba(120,90,60,.16)';x.fillRect((i*37.3)%160,(i*23.9)%90,0.5,0.5);}
  x.fillStyle='#b8a888';x.fillRect(CIRC.x0,CIRC.y-2.2,CIRC.x1-CIRC.x0,4.4);x.fillStyle='#7a9ab0';x.fillRect(CIRC.x0+4,CIRC.y-1,CIRC.x1-CIRC.x0-8,2);
  x.fillStyle='#d8c8a0';x.beginPath();x.moveTo(78,CIRC.y-1);x.lineTo(80,CIRC.y-6);x.lineTo(82,CIRC.y-1);x.fill();
  for(const mx of[CIRC.x0,CIRC.x1])for(let k=0;k<3;k++){x.fillStyle='#d9a93a';x.beginPath();x.moveTo(mx-1+k,CIRC.y-2.4);x.lineTo(mx-0.5+k,CIRC.y-5);x.lineTo(mx+k,CIRC.y-2.4);x.fill();}
  const laps=G.p.laps;for(let k=0;k<3;k++){x.fillStyle=k<laps?'#d9a93a':'#8a7a5a';x.beginPath();x.ellipse(96+k*4,CIRC.y,1.4,0.6,k<laps?Math.PI:0,0,TAU);x.fill();}
  x.strokeStyle='#f4f0e6';x.lineWidth=0.4;x.beginPath();x.moveTo(80,CIRC.y+CIRC.rin);x.lineTo(80,CIRC.y+CIRC.rout);x.stroke();
  x.fillStyle='#8a7a5a';for(let i=0;i<6;i++)x.fillRect(CIRC.x0-CIRC.rout-1,CIRC.y-15+i*5,3,4);
  x.fillStyle='rgba(30,20,10,.75)';x.font='2.4px Georgia';x.fillText('carceres',2,CIRC.y-18);x.fillText('PALATINO',70,3.2);x.fillText('AVENTINO',70,89);
  for(const c of G.cars)mgQuad(x,c,c.col,t);},
 hud(G){const P=G.p;return 'Vuelta: <b>'+Math.min(3,P.laps+1)+'</b> de 3 · Caballos: <span style="display:inline-block;width:90px;height:9px;background:rgba(255,255,255,.2);vertical-align:middle"><span style="display:block;height:100%;width:'+P.st.toFixed(0)+'%;background:#2e8b3a"></span></span>'+(P.crash>0?' · <span style="color:#ffb070">¡naufragium!</span>':'');},
 after(G,res){return (res==='win'?'<p>Cruzas la línea el primero. Los partidarios de los Verdes, que llevan pañuelos verdes, saltan en las gradas. El presidente de los juegos te entrega la palma y una corona.</p>':'<p>'+(G.place?'Llegas en '+['','primer','segundo','tercer','cuarto'][G.place]+' lugar.':'Otro carro cruza antes la línea.')+' Los aurigas profesionales tardan años en dominar las curvas.</p>')+
  '<p>Los aurigas eran casi siempre esclavos o libertos, pero los mejores se hacían ricos y famosísimos. Una inscripción de Roma cuenta la carrera de Diocles, un lusitano del siglo II: 4.257 carreras, 1.462 victorias y casi 36 millones de sestercios en premios. Muchos morían jóvenes en un naufragium.</p>';}};
// ---- 2b. la huida de Miseno (desde Plinio)
const MG_MISENO={id:'miseno',title:'La noche de Miseno',
 intro:'<p>Plinio te cuenta la noche del Vesubio, y sueñas que eres él. 25 de agosto del 79, en Miseno, al otro lado del golfo. Ha amanecido, pero la luz es débil y la tierra tiembla. Tu madre te pide que huyas solo; tú te niegas y la llevas de la mano.</p><p>Sal de la ciudad hacia el norte, lejos del mar, entre la multitud. Cae ceniza: de vez en cuando hay que pararse a sacudírsela, o el peso te aplastará. Cuidado con las piedras pómez que caen (sus sombras te avisan). No dejes atrás a tu madre.</p>',
 ctl:'<b>W A S D</b> (o las flechas) para caminar; mantén <b>Espacio</b> para sacudirte la ceniza.',ctlT:'Camina con las flechas; mantén <b>Sacudir</b> para quitarte la ceniza.',
 touch:[['ArrowLeft','◀'],['ArrowUp','▲'],['Space','Sacudir'],['ArrowDown','▼'],['ArrowRight','▶']],
 src:'Plinio el Joven, Cartas VI 16 y VI 20, escritas a Tácito.',
 first:'«Sigamos por el camino mientras aún se ve», dices a tu madre.',winT:'Habéis salido de Miseno',failT:'La oscuridad os alcanza',
 init(G){G.p={x:80,y:86,ash:0,hp:3};G.m={x:80,y:87};G.stones=[];G.crowd=[];for(let i=0;i<26;i++)G.crowd.push({x:rr(10,150),y:rr(15,80),vx:rr(-2,2),vy:rr(-4,1)});G.sT=1;G.dark=0;G.lost=0;},
 tick(G,dt){const P=G.p,M=G.m;G.dark=Math.min(1,G.t/40);const shake=mgk('Space');
  if(shake){P.ash=Math.max(0,P.ash-45*dt);}else P.ash=Math.min(100,P.ash+(4+G.dark*6)*dt);
  const sp=shake?0:4.4*(1-P.ash/160),mx=(mgk('KeyD','ArrowRight')?1:0)-(mgk('KeyA','ArrowLeft')?1:0),my=(mgk('KeyS','ArrowDown')?1:0)-(mgk('KeyW','ArrowUp')?1:0),l=Math.hypot(mx,my)||1;
  P.x=clamp(P.x+mx/l*sp*dt,4,156);P.y=clamp(P.y+my/l*sp*dt,3,88);
  const dm=Math.hypot(P.x-M.x,P.y-M.y);if(dm>2){const v=Math.min(dm-2,3.9*dt);M.x+=(P.x-M.x)/dm*v;M.y+=(P.y-M.y)/dm*v;}
  if(dm>9){G.lost+=dt;if(G.lost>0.2&&!G.wm){G.wm=1;mgSay('«¡Hijo, sigue tú, yo soy vieja y pesada!». No la sueltes: espérala.',3);}if(G.lost>5){mgSay('Has perdido a tu madre entre la multitud.',3);return 'fail';}}else{G.lost=0;G.wm=0;}
  if(P.ash>=100){mgSay('El peso de la ceniza te tira al suelo.',3);return 'fail';}if(P.ash>70&&!G.wa){G.wa=1;mgSay('Pesas mucho: para y sacúdete la ceniza (Espacio).',2.5);}if(P.ash<40)G.wa=0;
  for(const c of G.crowd){c.x+=c.vx*dt;c.y+=c.vy*dt;if(c.x<4||c.x>156)c.vx*=-1;if(c.y<4||c.y>86)c.vy*=-1;const d=Math.hypot(c.x-P.x,c.y-P.y);if(d<1.6){P.x+=(P.x-c.x)/d*0.4;P.y+=(P.y-c.y)/d*0.4;}}
  G.sT-=dt;if(G.sT<0){G.sT=0.4+Math.random()*0.6;G.stones.push({x:clamp(P.x+rr(-14,14),4,156),y:clamp(P.y+rr(-16,6),4,86),t:0,r:rr(1.2,2.2)});}
  for(const s of G.stones){s.t+=dt;if(s.t>1.2&&!s.hit){s.hit=1;if(Math.hypot(s.x-P.x,s.y-P.y)<s.r+0.6){P.hp--;mgSay(P.hp>0?'¡Una piedra te golpea en el hombro!':'Una piedra te derriba.',2);if(P.hp<=0)return 'fail';}}}
  G.stones=G.stones.filter(s=>s.t<1.8);if(P.y<6&&dm<9)return 'win';return null;},
 draw(G,x){const t=G.t,P=G.p;x.fillStyle='#4a4038';x.fillRect(0,0,160,90);x.fillStyle='#2a3a48';x.fillRect(0,86,160,4);
  x.fillStyle='#5a5048';for(let i=0;i<12;i++){x.fillRect(4+i*13,20+((i*7)%30),7,5);}x.strokeStyle='#6a5e52';x.lineWidth=3;x.beginPath();x.moveTo(80,90);x.bezierCurveTo(70,60,95,40,78,0);x.stroke();
  for(const c of G.crowd){x.fillStyle='#2a221c';x.beginPath();x.arc(c.x,c.y,0.8,0,TAU);x.fill();}
  for(const s of G.stones){if(s.t<1.2){x.fillStyle='rgba(0,0,0,'+(0.15+s.t*0.35)+')';x.beginPath();x.arc(s.x,s.y,s.r*(0.4+s.t/2),0,TAU);x.fill();}else{x.fillStyle='#b8b0a0';x.beginPath();x.arc(s.x,s.y,s.r*0.6,0,TAU);x.fill();}}
  x.fillStyle='#c9b48b';x.beginPath();x.arc(G.m.x,G.m.y,0.8,0,TAU);x.fill();x.fillStyle='#e8d8b0';x.beginPath();x.arc(P.x,P.y,0.85,0,TAU);x.fill();x.strokeStyle='rgba(232,216,176,.6)';x.lineWidth=0.15;x.beginPath();x.moveTo(P.x,P.y);x.lineTo(G.m.x,G.m.y);x.stroke();
  for(let i=0;i<40;i++){x.fillStyle='rgba(200,195,185,.35)';x.fillRect((i*31.7+t*3)%160,(i*17.3+t*9)%90,0.3,0.6);}
  const r=60-G.dark*42,g=x.createRadialGradient(P.x,P.y,r*0.3,P.x,P.y,r);g.addColorStop(0,'rgba(10,8,6,0)');g.addColorStop(1,'rgba(10,8,6,'+(0.5+G.dark*0.45)+')');x.fillStyle=g;x.fillRect(0,0,160,90);
  x.fillStyle='rgba(230,220,200,.7)';x.font='2.4px Georgia';x.fillText('al norte: fuera de la ciudad',58,4);x.fillText('Miseno · el puerto de la flota',4,89);},
 hud(G){return 'Ceniza: <span style="display:inline-block;width:90px;height:9px;background:rgba(255,255,255,.2);vertical-align:middle"><span style="display:block;height:100%;width:'+G.p.ash.toFixed(0)+'%;background:#b8b0a0"></span></span> · '+'●'.repeat(Math.max(0,G.p.hp))+(G.lost>0?' · <span style="color:#ffb070">¡tu madre se queda atrás!</span>':'');},
 after(G,res){return (res==='win'?'<p>Salís de la ciudad y os sentáis junto al camino. Cae una oscuridad «no como la de una noche sin luna, sino como la de una habitación cerrada con la lámpara apagada». Se oyen gritos de mujeres, llantos de niños, voces de hombres que llaman a sus padres, a sus hijos, a sus esposas.</p>':'<p>Te despiertas sobresaltado.</p>')+
  '<p>Plinio, que entonces tenía diecisiete años, contó aquella noche en dos cartas a su amigo Tácito. Su tío, Plinio el Viejo, almirante de la flota de Miseno, había cruzado el golfo con sus barcos para ayudar a los que huían y murió en la playa de Estabias, ahogado por los gases. Gracias a esas cartas, a las erupciones como aquella las llamamos hoy «plinianas».</p>';}};
// ---- 3. el debate de Claudio: ¿galos en el Senado? (desde Tácito)
const CLAUDIO_R=[
 {ath:'Italia no está tan agotada como para no poder dar senadores a su capital. Antes bastaban los nacidos aquí para gobernar a los pueblos de nuestra sangre. ¿Qué honor les quedará a los nobles que quedan, o a un senador pobre del Lacio, si los ricos de la Galia lo llenan todo?',ref:'Anales XI 23',
  op:[['«Mis antepasados, los Claudios, eran sabinos: Atta Clauso fue recibido a la vez en la ciudadanía y entre los patricios. Ese ejemplo me pide hacer lo mismo.»','Un senador viejo murmura: «Eso fue hace quinientos años, César». Pero otros asienten: la familia del propio emperador vino de fuera.','Anales XI 24'],
   ['«Ya tenemos senadores de Etruria, de Lucania, de toda Italia. Y la colonia de Vienne, en la Galia, nos ha dado senadores dignos. ¿Dónde está la frontera de la virtud?»','«Italia es Italia», responde alguien. Claudio sonríe: «Italia, un día, también fue el extranjero».','Anales XI 24; tabla de Lyon'],
   ['«¿Nos arrepentimos de que los Balbos vinieran de Hispania, y otros no menos ilustres de la Galia Narbonense? Sus descendientes siguen entre nosotros, y no aman menos a esta patria.»','Varios senadores miran a un Cornelio Balbo sentado en los bancos: su familia, de Gades, lleva un siglo en el Senado.','Anales XI 24']]},
 {ath:'¿Llenaremos el Senado con los descendientes de quienes mataron a nuestras legiones y sitiaron al divino Julio en Alesia? Que tengan el nombre de ciudadanos, pero no las insignias de los senadores ni los honores de los magistrados.',ref:'Anales XI 23',
  op:[['«Esparta y Atenas, tan fuertes en la guerra, cayeron porque trataban a los vencidos como extranjeros. Rómulo, en cambio, tuvo a muchos pueblos por enemigos y por ciudadanos el mismo día.»','Se hace el silencio. Es el argumento más famoso del discurso: la fuerza de Roma ha sido siempre convertir a los vencidos en romanos.','Anales XI 24'],
   ['«Los galos llevan cien años de paz y lealtad, incluso cuando mi padre Druso los sometió a censo en plena guerra contra los germanos.»','«Cien años», repite alguien. Muchos de los presentes tienen en sus villas esclavos y amigos galos.','Anales XI 24'],
   ['«Ya tienen nuestras costumbres, nuestras artes y se casan con los nuestros: que traigan aquí su oro y su riqueza, en vez de guardarlos aparte.»','Los senadores más ricos asienten: el oro galo en Roma les interesa a todos.','Anales XI 24']]}];
function claudioDlg(n){const B=$('dBody'),o=$('dOpts'),m=m386z();let r=0;const add=(t,fn,c)=>{const b=document.createElement('button');b.className=c||'';b.innerHTML='<span class="n">'+(o.children.length+1)+'</span><span>'+t+'</span>';b.onclick=fn;o.appendChild(b);};
  const round=()=>{const R0=CLAUDIO_R[r];o.innerHTML='';B.innerHTML='<p class="sub">Año 48. Los nobles de la Galia Comata, ciudadanos romanos, piden poder ser senadores. En la Curia, el emperador Claudio va a hablar, y tú hablas por él.</p><p><b>Un senador:</b> «'+R0.ath+'»</p><p class="sub">Tácito, '+R0.ref+'</p>';
    R0.op.forEach(op=>add(op[0],()=>{B.innerHTML='<p><b>Tú, como Claudio:</b> '+op[0]+'</p><p>'+op[1]+'</p><p class="sub">'+op[2]+'. Claudio usó de verdad este argumento.</p>';o.innerHTML='';r++;add(r<CLAUDIO_R.length?'Seguir':'Llega la votación',r<CLAUDIO_R.length?round:decide);},'quiz'));};
  const decide=()=>{o.innerHTML='';B.innerHTML='<p>Claudio termina con una frase que Tácito recordará: «Todo lo que hoy se cree antiquísimo, padres conscriptos, fue un día nuevo… También esto que hoy defendemos con ejemplos se convertirá en un ejemplo». ¿Qué vota el Senado?</p>';
    add('Admitir a los nobles galos en el Senado',()=>end(true),'quiz');add('Rechazarlo: que sigan siendo ciudadanos sin honores',()=>end(false),'quiz');};
  const end=res=>{o.innerHTML='';const first=!m.claudio;m.claudio=res?'si':'no';if(first){qAdd('lo',3,'Has convencido al Senado.');qAdd('so',1);}save();
    B.innerHTML=(res?'<p>Así fue. El Senado aprobó la propuesta, y los primeros en ser admitidos fueron los eduos, aliados de Roma desde hacía siglos, a los que Roma llamaba «hermanos del pueblo romano».</p>':'<p>En la realidad el Senado aprobó la propuesta: los primeros fueron los eduos. Pero muchos senadores pensaban como tú, y Tácito recoge sus razones.</p>')+
      '<p>El discurso de Claudio se grabó en una gran tabla de bronce que se colocó en Lugdunum, la ciudad donde él había nacido. En 1528 la encontró un campesino en Lyon, y hoy se puede leer en el museo de la ciudad. Al compararla con el texto de Tácito vemos que el historiador resumió y mejoró el discurso, pero conservó sus argumentos.</p><p class="sub">Para pensar: ¿qué hace que alguien sea «de los nuestros»? ¿Por qué Roma duró tanto más que Atenas o Esparta?</p>'+(first?'<p class="sub">+3 Lógos · +1 Sophía</p>':'');
    add('Volver a la conversación',()=>{B.innerHTML='<p>Pregunta lo que quieras.</p>';renderOpts();});};
  round();}
// ---- 4. patrias nuevas para el peregrino
ORIG.roma.push(
 {id:'cartago',n:'Cartago, en África',de:'de Cartago',gm:'cartaginés',gf:'cartaginesa',pn:'Lucio Cecilio Saturnino',pt:'De la estación de los africanos',look:{chiton:'#efe6d4',himation:'#8a5a2a',hair:'#1a120c',beard:true},
  pi:'¡Salve, paisano! Lucio Cecilio, de Cartago. Aquí nos miran raro: Cartago fue la enemiga de Roma. Pero hoy es una colonia romana, la capital de África, y sin nuestro trigo Roma pasaría hambre.',
  tp:[['¿Qué piensan aquí de Cartago?','Todos conocen la historia: Aníbal, los elefantes, «Cartago debe ser destruida». La destruyeron en el 146 antes de Cristo. Un siglo después, César y Augusto la refundaron como colonia romana. Hoy es una de las ciudades más grandes del Imperio. En casa hablamos púnico todavía, pero en el foro, latín.'],['¿Qué noticias hay de África?','Que el emperador Vespasiano, el padre de Tito, fue procónsul de África hace años, y en Hadrumetum el pueblo le tiró nabos en un motín. ¡Y ahora su hijo es emperador! África da trigo a Roma ocho meses al año: no te dejes mirar por encima del hombro.']],
  bark:['¿Cartaginés? ¡Que no venga Aníbal!','De África viene el trigo y viene el polvo, dicen.'],react:'Al oír «de Cartago», levanta una ceja: «¿De la Cartago de Aníbal?».'},
 {id:'gades',n:'Gades, en la Bética',de:'de Gades',gm:'gaditano',gf:'gaditana',pn:'Lucio Cornelio Balbo, nieto',pt:'De la estación de los gaditanos',look:{chiton:'#efe6d4',himation:'#6a3a5a',hair:'#2a1a12'},
  pi:'¡Salve! Soy un Cornelio Balbo, como el famoso. Gades es la ciudad más antigua de Occidente, la fundaron los fenicios de Tiro. Y fue un gaditano, mi antepasado Balbo, el primer cónsul de Roma nacido fuera de Italia.',
  tp:[['¿Quién fue Balbo?','Lucio Cornelio Balbo, gaditano, amigo y banquero de César. Fue cónsul en el 40 antes de Cristo, el primero nacido fuera de Italia. Su sobrino celebró un triunfo y construyó en Roma un teatro de piedra, el Teatro de Balbo, en el Campo de Marte. Y amplió Gades con una ciudad nueva.'],['¿Qué saben de Gades en Roma?','Que tenemos el templo de Hércules, adonde Aníbal fue a cumplir sus votos antes de partir hacia Italia y donde César lloró ante la estatua de Alejandro, que nuestro garum es el mejor y que nuestras bailarinas, las puellae gaditanae, bailan con crótalos en los banquetes. Marcial escribe de ellas. A los poetas les gusta más esto que nuestra historia.']],
  bark:['¿Gaditano? ¡Baila algo!','De Gades viene el mejor garum. ¿Traes un ánfora?'],react:'Al oír «de Gades», sonríe: «El fin del mundo, las Columnas de Hércules».'},
 {id:'lugdunum',n:'Lugdunum, en la Galia',de:'de Lugdunum',gm:'lugdunense',gf:'lugdunense',pn:'Gayo Julio Víctor',pt:'De la estación de los galos',look:{chiton:'#efe6d4',himation:'#4f6a3a',hair:'#8a5a2a',beard:true},
  pi:'¡Salve! Soy Gayo Julio Víctor, de Lugdunum. Nuestra ciudad es la capital de las tres Galias: allí se reúnen cada uno de agosto los delegados de sesenta pueblos ante el altar de Roma y de Augusto.',
  tp:[['¿Somos bien recibidos en Roma?','Mejor que antes. El emperador Claudio, que nació en Lugdunum, convenció al Senado de admitir a los nobles galos. Su discurso está grabado en bronce en nuestra ciudad. Pero aún hay quien nos llama «galos de pantalones» y recuerda que nuestros antepasados quemaron Roma hace cinco siglos.'],['¿Qué hacen los galos en Roma?','De todo: senadores, mercaderes de vino, soldados. Y la cerámica roja que se hace en el sur de la Galia se vende en todo el Imperio. Y los pantalones, que aquí se reían de ellos, ya los llevan hasta algunos romanos en invierno.']],
  bark:['¿Galo? ¡Esconde las ocas del Capitolio!','Los de Lugdunum tenéis buen vino. Y buenas tejas.'],react:'Al oír «de Lugdunum», asiente: «La ciudad de Claudio».'},
 {id:'antioquia',n:'Antioquía, en Siria',de:'de Antioquía',gm:'antioqueno',gf:'antioquena',pn:'Teófilo',pt:'De la estación de los sirios',look:{chiton:'#efe6d4',himation:'#2a5a6a',hair:'#1a120c',beard:true},
  pi:'¡Salud, paisano! Teófilo, de Antioquía. La tercera ciudad del mundo, después de Roma y Alejandría, con una gran calle de pórticos que la cruza de punta a punta. Aquí en Roma somos muchos los sirios.',
  tp:[['¿Qué noticias hay de Antioquía?','Que hace diez años, después de tomar Jerusalén, Tito pasó por Antioquía y la gente le pidió que expulsara a los judíos de la ciudad. Tito se negó: «Su patria ha sido destruida; ¿adónde iban a ir?». Lo cuenta Josefo. En Antioquía viven griegos, sirios, judíos y también esos a los que llaman cristianos: allí les pusieron ese nombre.'],['¿Cómo ven aquí a los sirios?','Con desconfianza y con curiosidad. Traemos tejidos, especias, músicos, adivinos, tañedoras de arpa. Un poeta dirá un día, quejándose, que el río Orontes se ha vertido en el Tíber. Pero Roma no sería Roma sin nosotros.']],
  bark:['¿Sirio? ¿Me lees el futuro?','De Antioquía vienen los mejores tejidos de púrpura.'],react:'Al oír «de Antioquía», se inclina: «La reina de Oriente».'});
// ---- 5. capítulo de historia: «El pan de Roma»
if(typeof STORY_ROMA!=='undefined')STORY_ROMA.push({cat:'Economía',title:'El pan de Roma',
 actors:[{id:'tercia11',name:'Tercia',title:'Tu hermana',look:LKR.tercia,at:'npc:mercader',dx:5,dz:3}],
 intro:'Ha pasado un mes. Tercia, tu hermana, ya libre, no para de hacer preguntas. Hoy, en el Emporio, ha visto descargar sacos de trigo durante horas y quiere saber de dónde viene el pan que comen un millón de personas. Tiberio Claudio Eutiques, el comerciante de grano, os ofrece un viaje en uno de sus barcos.',
 steps:[
  {obj:'Reúnete con Tercia en el Emporio, junto al comerciante de grano',actor:'tercia11',scene:[
   ['Tercia','¡Mira cuántos sacos! ¿Todo esto se lo come Roma? ¿Y de dónde sale?'],
   ['Eutiques','De África y de Egipto, sobre todo. Flavio Josefo, el historiador judío que vive en Roma bajo la protección de los Flavios, dice que África alimenta a Roma ocho meses al año y Egipto los otros cuatro. Cada mes, el Estado reparte trigo gratis a unos doscientos mil ciudadanos.'],
   {who:'Eutiques',ask:'Según Josefo, ¿cuántos meses al año alimenta África a Roma?',a:['Ocho','Dos','Doce'],ok:'Eso es: ocho. Y Egipto, los otros cuatro. Si un año falla la cosecha o se hunden los barcos, en Roma hay motines.',ko:'Más. África es el granero principal: ocho meses al año.'},
   ['Eutiques','Mi barco sale mañana hacia Cartago. Id a verlo con vuestros propios ojos.'],
   ['','Navegáis cuatro días hacia el sur, pasando junto a Sicilia. Cartago aparece al fondo de su golfo.'],{fn:()=>storyTravel('npc:himilcon',6,6)}]},
  {obj:'Habla con Gayo Julio Himilcón, el comerciante de trigo de Cartago',npc:'himilcon',scene:[
   ['Himilcón','¿Romanos, aquí? Mis abuelos maldecían a Roma; yo le vendo trigo, y me va bien. El trigo de África crece en las grandes fincas del interior, y baja en carros hasta el puerto.'],
   ['Himilcón','Pero el mar no está siempre abierto. Del 11 de noviembre al 10 de marzo casi nadie navega: es el «mar cerrado». Por eso el emperador Claudio prometía pagar las pérdidas a quien se arriesgara a traer trigo en invierno.'],
   {choose:[['«¿Y si un barco se hunde?»',[['Himilcón','Entonces pierdo la carga, y el prestamista pierde su dinero: por eso cobran tanto interés. Pero si llega, gano el doble.']],'riesgo'],['«¿Por qué no se cultiva el trigo en Italia?»',[['Himilcón','Se cultiva, pero los grandes propietarios prefieren las viñas y los olivos, que dan más. Y traerlo por mar desde aquí es más barato que en carro desde el interior de Italia.']],'campo']]},
   ['Tercia','Y el trigo de Egipto, ¿cómo es?'],['Himilcón','Id a verlo. A Alejandría, con un barco que sale hoy.'],{fn:()=>storyTravel('npc:heron',6,6)}]},
  {obj:'Habla con Herón, en Alejandría',npc:'heron',scene:[
   ['Herón','Egipto es del emperador, no del Senado: ningún senador puede venir sin su permiso, para que nadie se apodere del granero de Roma. El Nilo crece cada verano, y del limo nace el trigo.'],
   ['Herón','Las naves del trigo de Alejandría son las más grandes del mar: algunas cargan más de mil toneladas. Cuando llegan a Puteoli, toda la ciudad baja al muelle: son las únicas que pueden llevar desplegada la vela de arriba, y así se las reconoce de lejos.'],
   {who:'Herón',ask:'¿Por qué ningún senador podía entrar en Egipto sin permiso del emperador?',a:['Para que nadie pudiera apoderarse del trigo que alimentaba a Roma','Porque los egipcios no querían romanos','Porque estaba prohibido por los dioses'],ok:'Exacto. Quien controlara Egipto podía matar de hambre a Roma. Augusto lo convirtió en una provincia especial, gobernada por un prefecto suyo.',ko:'Piensa en el trigo: quien controla Egipto controla el pan de Roma.'},
   ['Tercia','Volvamos a casa. Quiero contárselo todo a mamá.'],{fn:()=>storyTravel('actor:tercia11',4,4)}]},
  {obj:'Vuelve con Tercia al Emporio',actor:'tercia11',scene:[
   ['Tercia','Entonces, cada pan que comemos ha cruzado el mar. Si hay tormenta, o guerra, o un mal año en el Nilo… en Roma hay hambre.'],
   {who:'Tercia',ask:'¿Por qué los emperadores se preocupaban tanto del trigo?',a:['Porque una ciudad de un millón de personas dependía del mar para comer, y el hambre provocaba motines','Porque el trigo era sagrado','Porque los soldados no comían otra cosa'],ok:'Eso es. Juvenal resumirá lo que quería el pueblo de Roma en dos palabras: pan y circo.',ko:'Piensa en el millón de personas y en los barcos.'},
   ['Tercia','«Pan y circo». Bueno, el circo ya lo hemos visto. Mañana, ¿me llevas a ver una carrera?']]}],
 end:'Con Tercia has seguido el trigo desde los campos de África y el Nilo hasta el Emporio de Roma.',
 learn:'Roma, con cerca de un millón de habitantes, dependía del trigo importado por mar, sobre todo de África y de Egipto. El Estado repartía trigo gratuito a unos 200.000 ciudadanos (la annona), y los emperadores cuidaban el abastecimiento porque el hambre provocaba disturbios. Egipto era una provincia especial del emperador, cerrada a los senadores. La navegación se interrumpía en invierno (mare clausum).'});
// ---- 6. misiones romanas
Object.assign(MISION_TXT,{plomo:'Eros, en Carthago Nova, quiere saber si su plomo acaba en Roma: busca un tubo con sello en las Termas de Tito.',anforas:'Quinto Fulvio, en Corduba, quiere que mires las etiquetas de sus ánforas en los almacenes de Galba, en Roma.',oro:'Pintaio, en Las Médulas, quiere saber adónde va el oro que sacan de la montaña: pregunta en el templo de Saturno, en el Foro.'});
function m386OptsR(n,add){const m=m386z();if(MODE!=='roma')return;
  if(n.id==='auriga')add(m.mg_circo?'Volver a soñar con una carrera':'Soñar con una carrera en el Circo Máximo (minijuego)','quiz',()=>mgOpen(MG_CIRCO));
  if(n.id==='plinio')add(m.mg_miseno?'Volver a soñar la noche de Miseno':'Soñar la noche de Miseno (minijuego)','quiz',()=>mgOpen(MG_MISENO));
  if(n.id==='tacito')add(m.claudio?'Volver a hablar por Claudio':'Revivir el debate de Claudio sobre los galos','quiz',()=>claudioDlg(n));
  const one=(k,who,ask,on,ok,okFn)=>{if(n.id!==who)return;const st=m['ms_'+k];if(st==='fin')return;
    add(!st?ask:st==='hecho'?ok:'Sobre lo que me pediste…','quiz',()=>{const B=$('dBody');if(!st){m['ms_'+k]='on';save();B.innerHTML=on;toast('<span class="label">Misión</span><br>'+MISION_TXT[k]);renderOpts();}
      else if(st==='hecho'){m['ms_'+k]='fin';state.obols+=6+klBonus();qAdd('kl',2,'Has cumplido un encargo.');save();updateStats();sfxCoin();B.innerHTML=okFn();renderOpts();}else{B.innerHTML='<p>'+MISION_TXT[k]+'</p>';renderOpts();}});};
  one('plomo','eros_cn','¿Puedo hacer algo por ti?','<p>«Cada lingote que sale de aquí lleva un sello con el nombre del dueño de la mina. Dicen que en Roma el plomo acaba en tuberías y en los tejados de los templos. Si vas, busca un tubo de plomo con letras y dime qué pone. Me gustaría saber que mi trabajo sirve para algo».</p>','He visto un tubo de plomo en las Termas de Tito',()=>'<p>Le cuentas que los tubos de las nuevas termas llevan grabado el nombre del emperador y el del fontanero que los hizo. Eros se ríe. «Así que el plomo es mío, el trabajo de los esclavos, y el nombre, del emperador. Siempre igual». Te da seis sestercios.</p>');
  one('anforas','olearius','¿Puedo hacer algo por ti?','<p>«Mando cientos de ánforas a Roma cada año. Cada una lleva pintado el peso y mi nombre. Me han dicho que algunas no llegan a los almacenes de Galba, junto al Emporio. ¿Podrías mirar si están las mías?».</p>','He visto tus ánforas en los almacenes',()=>'<p>Le cuentas que has visto filas de ánforas redondas con su nombre pintado: «Q. Fulvi Rustici». Respira aliviado. «Las ánforas vacías no se pueden reutilizar: el aceite las impregna. En Roma las rompen y amontonan los trozos detrás de los almacenes. Dicen que ya hay una colina de cascotes». Te da seis sestercios.</p><p class="sub">Esa colina, el monte Testaccio, llegará a tener unos 50 millones de ánforas, la mayoría de aceite de la Bética.</p>');
  one('oro','astur','¿Puedo hacer algo por ti?','<p>«Derribamos montañas enteras con agua para sacar el oro. Mi abuelo luchó contra Roma en estos montes; yo cavo para ella. Si vas a Roma, pregunta adónde va nuestro oro. Dicen que lo guardan en un templo».</p>','Ya sé adónde va el oro',()=>'<p>Le cuentas que Plinio calcula que de Asturia, Gallaecia y Lusitania salen unas veinte mil libras de oro al año, y que el oro de las minas va al tesoro del emperador, el fisco, no a los pueblos que lo sacan. Pintaio se queda callado mucho rato. «Veinte mil libras. Y aquí ni un anillo». Insiste en darte seis sestercios.</p>');}
function m386SetupR(){if(MODE!=='roma')return;const P=id=>placeAt(id);
  const te=P('ro_termas');if(te)egxObj(te.x+5,te.z+4,undefined,'m:fistula','Un tubo de plomo','fistula');
  const ho=P('ro_horrea');if(ho)egxObj(ho.x+4,ho.z+3,undefined,'m:anforas','Ánforas de la Bética','tituli picti');
  const sa=P('ro_saturno');if(sa)egxObj(sa.x+5,sa.z+3,undefined,'m:aerarium','El tesoro de Saturno','aerarium');}
function m386ActR(o){const m=m386z(),one=casaOpen('◆',o.data.name,o.data.role||''),B=$('dBody');
  if(o.act==='m:fistula'){B.innerHTML='<p>Unos obreros entierran tubos de plomo para llevar el agua a las nuevas termas. Cada tramo está hecho con una lámina doblada y soldada, y lleva letras en relieve: <b>IMP · TITI · CAESARIS · AVG</b> y, debajo, el nombre del fontanero que lo fabricó.</p><p class="sub">Frontino, Los acueductos de Roma; se conservan cientos de fistulae con sellos.</p>';if(m.ms_plomo==='on'){m.ms_plomo='hecho';save();toast('<span class="label">Misión</span><br>Vuelve a Carthago Nova y cuéntaselo a Eros.');}one('Seguir',closeDialog);return;}
  if(o.act==='m:anforas'){B.innerHTML='<p>Filas de ánforas redondas y panzudas, de las que se usan para el aceite de la Bética. Tienen pintados en rojo y negro el peso del aceite, el nombre del mercader, <b>Q · FVLVI · RVSTICI</b>, y las marcas del control fiscal.</p><p class="sub">Estas etiquetas, los tituli picti, se han conservado a miles en el monte Testaccio, sobre todo de los siglos II y III.</p>';if(m.ms_anforas==='on'){m.ms_anforas='hecho';save();toast('<span class="label">Misión</span><br>Vuelve a Corduba y cuéntaselo a Quinto Fulvio.');}one('Seguir',closeDialog);return;}
  if(o.act==='m:aerarium'){B.innerHTML='<p>Bajo el templo de Saturno se guarda el tesoro público de Roma, el aerarium. Un esclavo público te explica que el oro de las minas de Hispania no viene aquí, sino al fisco, la caja del emperador. Plinio calcula que Asturia, Gallaecia y Lusitania dan unas veinte mil libras de oro al año.</p><p class="sub">Plinio, Historia natural XXXIII 78.</p>';if(m.ms_oro==='on'){m.ms_oro='hecho';save();toast('<span class="label">Misión</span><br>Vuelve a Las Médulas y cuéntaselo a Pintaio.');}one('Seguir',closeDialog);return;}}

