// ============================================================ minijuego de navegación: el sueño de Ulises (Odisea XII)
// Unidades: x de -1 a 1 a lo ancho; la distancia recorrida (pos) en las mismas unidades.
const SEAG={on:false};
function seaEligible(from,to){return MODE==='atenas'&&from!=='egina'&&to!=='egina';}
function seaCourse(){
  const rk=(k,x,d,r)=>{const pts=[];for(let i=0;i<9;i++)pts.push(0.72+Math.random()*0.4);return{k,x,d,r,pts,hit:false};};
  return{len:17.6,s0:10.8,s1:16.2,chary:{x:0.5,d:13.7},scyl:{d:12.9},
    objs:[rk('rock',-0.45,2.1,0.12),rk('rock',0.48,3.0,0.14),rk('siren',0.62,4.6,0.15),rk('rock',-0.3,5.9,0.11),rk('siren',-0.6,6.8,0.15),rk('rock',0.28,7.9,0.12),rk('siren',0.56,8.9,0.15),rk('rock',-0.62,9.6,0.1)]};
}
function bankL(d){const C=SEAG.c;if(!C)return-1.6;const a=sstep(clamp((d-C.s0+0.8)/0.8,0,1))*sstep(clamp((C.s1+0.8-d)/0.8,0,1));return lerp(-1.6,-0.8,a)-0.05*Math.sin(d*9)*a-0.03*Math.sin(d*23)*a;}
function bankR(d){const C=SEAG.c;if(!C)return 1.6;const a=sstep(clamp((d-C.s0+0.8)/0.8,0,1))*sstep(clamp((C.s1+0.8-d)/0.8,0,1));return lerp(1.6,0.98,a)+0.04*Math.sin(d*7+1)*a+0.03*Math.sin(d*19)*a;}
function seaIntro(arrive){
  ui='sea';releasePointer();Object.assign(SEAG,{on:false,arrive,intro:true});
  const s=$('sea');s.hidden=false;$('seaIntro').hidden=false;$('seaBtns').hidden=true;$('seaHud').hidden=true;seaResize();
  $('seaIntro').innerHTML='<h2>El sueño de Ulises</h2>'+
    '<p>Mientras navegáis, Hagnón os cuenta cómo Ulises pasó junto a la isla de las sirenas y entre Escila y Caribdis. Con el vaivén del barco te quedas dormido en cubierta… y sueñas que eres uno de sus compañeros.</p>'+
    '<p>'+(isTouch?'Gobierna el barco con los botones <b>◀</b> y <b>▶</b>. Mantén pulsado <b>Taparse los oídos</b> cuando canten las sirenas: no las oirás, pero con las manos en las orejas no puedes gobernar, y la corriente te arrastra hacia sus rocas.':'Gobierna el barco con <b>A</b> y <b>D</b> (o las flechas). Mantén pulsado <b>Espacio</b> para taparte los oídos cuando canten las sirenas: no las oirás, pero con las manos en las orejas no puedes gobernar, y la corriente te arrastra hacia sus rocas.')+'</p>'+
    '<p>En el estrecho, las sombras rojas en el agua avisan de dónde van a morder las cabezas de Escila. Al otro lado, no dejes que te trague el remolino de Caribdis.</p>'+
    '<p class="src">Homero, Odisea XII 39-54, 73-126 y 158-259. En el poema, Ulises tapa con cera los oídos de sus compañeros y se hace atar al mástil para oír el canto sin peligro.</p>'+
    '<div class="startbtns"><button class="primary" id="seaGo">Soñar · Enter</button><button class="ghost" id="seaNo">Seguir el viaje sin soñar · Esc</button></div>';
  $('seaGo').onclick=seaStart;$('seaNo').onclick=()=>seaEnd('skip');
  setTimeout(()=>{const b=$('seaGo');b&&b.focus({preventScroll:true});},30);
  seaDraw(0);
}
function seaStart(){
  Object.assign(SEAG,{on:true,intro:false,c:seaCourse(),pos:-0.6,x:0,vx:0,crew:6,charm:0,song:0,ear:false,kL:false,kR:false,t:0,cT:0,sT:1.5,atk:[],msg:'',msgT:0,hint:0,shake:0,lost:0,fx:[],noteT:0,mi:0});
  $('seaIntro').hidden=true;$('seaBtns').hidden=false;$('seaHud').hidden=false;
  seaSay(isTouch?'Gobierna con ◀ y ▶. Evita las rocas.':'Gobierna con A y D (o con las flechas). Evita las rocas.',4);
  seaAudio(true);
}
function seaSay(m,t){SEAG.msg=m;SEAG.msgT=t||2.6;$('seaMsg').innerHTML=m;}
function seaLose(n,m){SEAG.crew=Math.max(0,SEAG.crew-n);SEAG.lost+=n;SEAG.shake=0.5;seaSay(m,3);seaThump();if(SEAG.crew<=0)setTimeout(()=>{if(SEAG.on)seaEnd('fail');},900);}
function seaTick(dt){
  if(!SEAG.on){return;}
  const C=SEAG.c;SEAG.t+=dt;if(SEAG.crew<=0){seaDraw(dt);return;}
  // sirenas: cuanto más cerca, más fuerte el canto
  let song=0,sx=0;for(const o of C.objs)if(o.k==='siren'){const s=clamp(1-Math.hypot(o.x-SEAG.x,o.d-SEAG.pos)/1.25,0,1);if(s>song){song=s;sx=o.x;}}
  SEAG.song=song;const ear=SEAG.ear;
  let inp=ear?0:(SEAG.kR?1:0)-(SEAG.kL?1:0);
  if(!ear&&song>0)inp*=1-0.55*song;
  SEAG.vx+=(inp*0.78-SEAG.vx)*Math.min(1,dt*5);
  if(song>0){const dir=Math.sign(sx-SEAG.x);SEAG.x+=dir*0.2*song*dt;                       // la corriente lleva hacia la roca
    if(!ear){SEAG.vx+=dir*1.1*song*dt;SEAG.charm+=song*dt*0.55;}}
  if(ear||song===0)SEAG.charm=Math.max(0,SEAG.charm-dt*0.32);
  if(SEAG.charm>=1){SEAG.charm=0.25;SEAG.vx=-Math.sign(sx-SEAG.x)*0.5;seaLose(1,'Un compañero se lanza al agua, hechizado por el canto, y nada hacia las sirenas.');}
  SEAG.x+=SEAG.vx*dt;
  // Caribdis: sorbe el mar y lo vomita, tres veces al día; aquí, cada siete segundos
  let speed=0.42;SEAG.cT=(SEAG.cT+dt)%7;const sorbe=SEAG.cT<4.6;
  {const c=C.chary,dx=c.x-SEAG.x,dy=c.d-SEAG.pos,d=Math.hypot(dx,dy)||1e-3;if(d<1.15){const f=1-d/1.15;
     if(sorbe){SEAG.x+=dx/d*0.62*f*dt;SEAG.pos+=dy/d*0.3*f*dt;}else{SEAG.x-=dx/d*0.3*f*dt;}
     if(sorbe&&d<0.13){seaLose(2,'¡Caribdis se traga el barco! Gira y gira en el remolino hasta que el mar lo devuelve, y perdéis a dos compañeros. Vuelve a intentarlo.');SEAG.pos=C.s0-0.3;SEAG.x=-0.15;SEAG.vx=0;SEAG.atk=[];return;}}}
  SEAG.pos+=speed*dt;
  // límites: las orillas del estrecho
  const L=bankL(SEAG.pos)+0.07,R=bankR(SEAG.pos)-0.07;if(SEAG.x<L){SEAG.x=L;SEAG.vx=Math.max(0,SEAG.vx);}if(SEAG.x>R){SEAG.x=R;SEAG.vx=Math.min(0,SEAG.vx);}
  SEAG.x=clamp(SEAG.x,-0.95,0.95);
  // rocas
  for(const o of C.objs){if(o.hit)continue;const d=Math.hypot(o.x-SEAG.x,o.d-SEAG.pos);if(d<o.r+0.05){o.hit=true;SEAG.vx=-Math.sign(o.x-SEAG.x||1)*0.7;seaLose(1,o.k==='siren'?'El barco se estrella contra la roca de las sirenas, entre huesos de marineros. Un compañero cae al mar.':'¡El casco golpea una roca! Un compañero cae al mar.');}}
  // Escila: seis cabezas que salen de la cueva y muerden donde va a pasar el barco
  if(SEAG.pos>C.s0+0.2&&SEAG.pos<C.s1-0.4){SEAG.sT-=dt;if(SEAG.sT<0){SEAG.sT=1.5+Math.random()*0.9;
      const tx=clamp(SEAG.x+SEAG.vx*0.9+(Math.random()-0.5)*0.16,bankL(SEAG.pos+0.45)+0.1,0.3);SEAG.atk.push({x:tx,d:SEAG.pos+0.42*1.05,t:0});}}
  for(const a of SEAG.atk){a.t+=dt;if(a.t>1.05&&!a.done){a.done=true;if(Math.hypot(a.x-SEAG.x,a.d-SEAG.pos)<0.14)seaLose(1,'Una cabeza de Escila arrebata a un compañero de la cubierta.');}}
  SEAG.atk=SEAG.atk.filter(a=>a.t<1.5);
  // avisos por tramos
  if(SEAG.hint===0&&SEAG.pos>3.5){SEAG.hint=1;seaSay(isTouch?'Se oye un canto dulcísimo… Mantén pulsado «Taparse los oídos».':'Se oye un canto dulcísimo… Mantén pulsado Espacio para taparte los oídos.',4);}
  if(SEAG.hint===1&&SEAG.pos>C.s0-0.8){SEAG.hint=2;seaSay('El estrecho: a la izquierda, la cueva de Escila; a la derecha, el remolino de Caribdis.',4.5);}
  if(SEAG.hint===2&&SEAG.pos>C.s1+0.4){SEAG.hint=3;seaSay('Mar abierto. El sueño se desvanece…',3);}
  SEAG.msgT-=dt;if(SEAG.msgT<0&&SEAG.msg){SEAG.msg='';$('seaMsg').innerHTML=SEAG.ear?'Oídos tapados':'';}
  if(!SEAG.msg)$('seaMsg').innerHTML=SEAG.ear?'Oídos tapados':'';
  SEAG.shake=Math.max(0,SEAG.shake-dt);
  seaAudioTick(dt);
  if(SEAG.pos>=C.len)return seaEnd('win');
  seaDraw(dt);
}
function seaEnd(res){
  const was=SEAG.on;SEAG.on=false;SEAG.intro=false;seaAudio(false);$('sea').hidden=true;
  const v=$('voyage');
  if(res==='win'){const first=!state.seen.odisea;if(first){state.seen.odisea=1;state.obols+=3;save();updateStats();sfxCoin();}
    v.querySelector('.vs').innerHTML=(SEAG.crew===6?'Has pasado sin perder a nadie: mejor que Ulises, a quien Escila arrebató seis compañeros.':'Has pasado con '+SEAG.crew+' de 6 compañeros. En la Odisea, Escila se lleva a seis.')+(first?' Hagnón, divertido, te da 3 óbolos por la historia.':'');
    v.querySelector('.vf').textContent='Despiertas en cubierta. Ya se ve tierra.';}
  else if(res==='fail'){v.querySelector('.vs').textContent='Despiertas sobresaltado. Hagnón se ríe: «Solo era un sueño. Ulises también perdió a todos sus compañeros, pero llegó a Ítaca».';v.querySelector('.vf').textContent='Ya se ve tierra.';}
  else if(was){v.querySelector('.vf').textContent='Te despiertas antes de tiempo. Ya se ve tierra.';}
  setTimeout(SEAG.arrive,res==='skip'&&!was?900:3200);
}
function seaResize(){const cv=$('seaC');if(!cv)return;const dpr=Math.min(2,window.devicePixelRatio||1);cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;SEAG.cx=cv.getContext('2d');SEAG.cx.setTransform(dpr,0,0,dpr,0,0);SEAG.W=innerWidth;SEAG.H=innerHeight;SEAG.U=Math.min(SEAG.W*0.46,SEAG.H*0.5,460);SEAG.sy=SEAG.H*0.74;}
window.addEventListener('resize',()=>{if(!$('sea').hidden){seaResize();seaDraw(0);}});
const _fr=v=>v-Math.floor(v),_hs=(a,b)=>_fr(Math.sin(a*12.9898+b*78.233)*43758.5453);
function seaDraw(dt){
  const x=SEAG.cx;if(!x)return;const W=SEAG.W,H=SEAG.H,U=SEAG.U,C=SEAG.c,pos=SEAG.on?SEAG.pos:0,t=SEAG.t||performance.now()/1000;
  const sh=SEAG.shake?(Math.random()-0.5)*14*SEAG.shake:0,sw=SEAG.on&&!SEAG.ear?Math.sin(t*1.7)*SEAG.song*10:0;
  x.save();x.translate(sh+sw,sh*0.6);
  const X=v=>W/2+v*U,Y=d=>SEAG.sy-(d-pos)*U;
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0f3a52');g.addColorStop(1,'#1d5a73');x.fillStyle=g;x.fillRect(-30,-30,W+60,H+60);
  // olas
  const st=0.16,i0=Math.floor((pos-(H-SEAG.sy)/U)/st)-1,i1=Math.ceil((pos+SEAG.sy/U)/st)+1;x.strokeStyle='rgba(225,240,245,0.16)';x.lineWidth=2;x.beginPath();
  for(let i=i0;i<=i1;i++){const y=Y(i*st);for(let k=0;k<6;k++){const xx=_hs(i,k)*W+Math.sin(t*0.9+i+k)*8;x.moveTo(xx,y);x.quadraticCurveTo(xx+11,y-5,xx+22,y);}}x.stroke();
  if(!C){x.restore();return;}
  // orillas del estrecho
  const dTop=pos+SEAG.sy/U+0.2,dBot=pos-(H-SEAG.sy)/U-0.2;
  if(dTop>C.s0-1&&dBot<C.s1+1){
    for(const side of[-1,1]){x.beginPath();x.moveTo(side<0?-40:W+40,Y(dBot));for(let d=dBot;d<=dTop;d+=0.04)x.lineTo(X(side<0?bankL(d):bankR(d)),Y(d));x.lineTo(side<0?-40:W+40,Y(dTop));x.closePath();
      x.fillStyle=side<0?'#4a3f35':'#6a5c49';x.fill();x.strokeStyle='rgba(240,248,250,0.45)';x.lineWidth=3;x.stroke();}
    // cueva de Escila
    {const d=C.scyl.d,cx=X(bankL(d))-U*0.06,cy=Y(d);x.fillStyle='#120d0a';x.beginPath();x.ellipse(cx,cy,U*0.09,U*0.13,0,0,TAU);x.fill();
     for(let k=0;k<6;k++){const a=k/6*TAU+t*0.7;x.fillStyle='#d94a2a';x.beginPath();x.arc(cx+Math.cos(a)*U*0.04,cy+Math.sin(a)*U*0.07,2.2,0,TAU);x.fill();}}
    // la higuera sobre la roca de Caribdis
    {const d=C.chary.d+0.25,tx=X(bankR(d))+U*0.08,ty=Y(d);x.fillStyle='#4a3424';x.fillRect(tx-3,ty-2,6,18);x.fillStyle='#3f6a3a';x.beginPath();x.arc(tx,ty-6,U*0.06,0,TAU);x.fill();}
    // Caribdis
    {const c=C.chary,cx=X(c.x),cy=Y(c.d),R=U*0.34,sorbe=SEAG.cT<4.6;const rg=x.createRadialGradient(cx,cy,2,cx,cy,R);rg.addColorStop(0,sorbe?'#03121c':'#5d8ea0');rg.addColorStop(1,'rgba(29,90,115,0)');x.fillStyle=rg;x.beginPath();x.arc(cx,cy,R,0,TAU);x.fill();
     x.strokeStyle=sorbe?'rgba(220,240,245,0.5)':'rgba(255,255,255,0.75)';x.lineWidth=2;const rot=SEAG.t*(sorbe?3.2:-1.2);
     for(let k=0;k<5;k++){x.beginPath();for(let s=0;s<=40;s++){const u=s/40,a=rot+k/5*TAU+u*5,r=R*(sorbe?(1-u):u)*0.95;x[s?'lineTo':'moveTo'](cx+Math.cos(a)*r,cy+Math.sin(a)*r*0.8);}x.stroke();}}
  }
  // rocas y sirenas
  for(const o of C.objs){const y=Y(o.d);if(y<-80||y>H+80)continue;const cx=X(o.x),r=o.r*U;
    x.strokeStyle='rgba(240,248,250,0.4)';x.lineWidth=3;x.beginPath();x.arc(cx,y,r*1.18+Math.sin(t*2+o.d)*2,0,TAU);x.stroke();
    x.beginPath();o.pts.forEach((q,i)=>{const a=i/o.pts.length*TAU;x[i?'lineTo':'moveTo'](cx+Math.cos(a)*r*q,y+Math.sin(a)*r*q);});x.closePath();x.fillStyle='#5f554b';x.fill();
    x.fillStyle='#857868';x.beginPath();x.arc(cx-r*0.2,y-r*0.25,r*0.45,0,TAU);x.fill();
    if(o.k==='siren'){x.fillStyle='#e9e1cf';for(let k=0;k<5;k++){x.fillRect(cx+(_hs(o.d,k)-0.5)*r*1.4,y+(_hs(k,o.d)-0.1)*r*0.8,6,2);}   // huesos
      for(const s of[-1,1]){const fl=Math.sin(t*6+s)*0.5;x.save();x.translate(cx+s*r*0.42,y-r*0.12);x.scale(U/280,U/280);
        x.fillStyle='#b98d55';x.beginPath();x.ellipse(0,6,9,12,0,0,TAU);x.fill();
        x.beginPath();x.moveTo(-6,2);x.lineTo(-22,-6+fl*10);x.lineTo(-8,12);x.closePath();x.fill();x.beginPath();x.moveTo(6,2);x.lineTo(22,-6+fl*10);x.lineTo(8,12);x.closePath();x.fill();
        x.fillStyle='#e2b48c';x.beginPath();x.arc(0,-8,6,0,TAU);x.fill();x.fillStyle='#3a2418';x.beginPath();x.arc(0,-10,6,Math.PI,TAU);x.fill();x.restore();}
      const s=clamp(1-Math.hypot(o.x-SEAG.x,o.d-SEAG.pos)/1.25,0,1);
      if(s>0){x.font='bold '+Math.round(18+8*s)+'px serif';for(let k=0;k<5;k++){const u=_fr(t*0.45+k/5),nx=lerp(cx,X(SEAG.x),u)+Math.sin(t*3+k)*14,ny=lerp(y,SEAG.sy,u);x.fillStyle='rgba(255,214,150,'+(s*(1-u)*(SEAG.ear?0.35:1)).toFixed(2)+')';x.fillText(k%2?'♪':'♫',nx,ny);}}}
  }
  // ataques de Escila: aviso en el agua y mordisco
  for(const a of SEAG.atk){const ax=X(a.x),ay=Y(a.d);
    if(a.t<1.05){const k=a.t/1.05;x.fillStyle='rgba(150,25,20,'+(0.15+0.35*k).toFixed(2)+')';x.beginPath();x.arc(ax,ay,U*(0.2-0.08*k),0,TAU);x.fill();x.strokeStyle='rgba(255,120,90,0.7)';x.lineWidth=2;x.beginPath();x.arc(ax,ay,U*(0.2-0.08*k),0,TAU);x.stroke();}
    else{const d=C.scyl.d,cx=X(bankL(d))-U*0.04,cy=Y(d);x.strokeStyle='#4f6a44';x.lineWidth=U*0.045;x.lineCap='round';x.beginPath();x.moveTo(cx,cy);x.quadraticCurveTo((cx+ax)/2,Math.min(cy,ay)-U*0.35,ax,ay);x.stroke();
      x.fillStyle='#5d7a50';x.beginPath();x.ellipse(ax,ay,U*0.05,U*0.065,0,0,TAU);x.fill();x.fillStyle='#f3ead8';for(let k=-2;k<=2;k++){x.beginPath();x.moveTo(ax+k*U*0.016,ay+U*0.02);x.lineTo(ax+k*U*0.016+3,ay+U*0.055);x.lineTo(ax+k*U*0.016+6,ay+U*0.02);x.fill();}
      x.fillStyle='#ffcf3a';x.beginPath();x.arc(ax-U*0.02,ay-U*0.02,2.5,0,TAU);x.arc(ax+U*0.02,ay-U*0.02,2.5,0,TAU);x.fill();}}
  // el barco: una nave negra con vela y remos
  if(SEAG.on||SEAG.intro){const bx=X(SEAG.on?SEAG.x:0),by=SEAG.sy,L=U*0.2,B=U*0.065;x.save();x.translate(bx,by);x.rotate((SEAG.vx||0)*0.45);
    x.strokeStyle='rgba(240,248,250,0.5)';x.lineWidth=2;x.beginPath();x.moveTo(-B*0.9,L*0.45);x.lineTo(-B*1.6,L*1.3);x.moveTo(B*0.9,L*0.45);x.lineTo(B*1.6,L*1.3);x.stroke();
    const oa=Math.sin(t*4)*0.35;x.strokeStyle='#8a6a48';x.lineWidth=2;for(let k=0;k<5;k++){const oy=-L*0.15+k*L*0.12;for(const s of[-1,1]){x.beginPath();x.moveTo(s*B*0.8,oy);x.lineTo(s*B*2.1,oy+Math.sin(oa+k*0.2)*L*0.12*s*s);x.stroke();}}
    x.fillStyle='#231d19';x.beginPath();x.moveTo(0,-L*0.62);x.quadraticCurveTo(B*1.25,-L*0.1,B*0.8,L*0.5);x.lineTo(-B*0.8,L*0.5);x.quadraticCurveTo(-B*1.25,-L*0.1,0,-L*0.62);x.fill();
    x.fillStyle='#6b4a2e';x.beginPath();x.moveTo(0,-L*0.45);x.quadraticCurveTo(B*0.9,-L*0.05,B*0.6,L*0.42);x.lineTo(-B*0.6,L*0.42);x.quadraticCurveTo(-B*0.9,-L*0.05,0,-L*0.45);x.fill();
    x.fillStyle='#e7dcc4';x.fillRect(-B*1.5,-L*0.08,B*3,L*0.09);x.fillStyle='#9a3f2f';x.fillRect(-B*1.5,-L*0.045,B*3,L*0.02);
    const n=SEAG.on?SEAG.crew:6;x.fillStyle='#d9b48a';for(let k=0;k<n;k++){x.beginPath();x.arc((k%2?1:-1)*B*0.35,L*0.05+Math.floor(k/2)*L*0.11,3.2,0,TAU);x.fill();}
    x.restore();}
  x.restore();
  // hechizo de las sirenas: viñeta rosada y marcadores
  if(SEAG.on){if(SEAG.song>0&&!SEAG.ear){const vg=x.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3,W/2,H/2,Math.max(W,H)*0.7);vg.addColorStop(0,'rgba(230,120,160,0)');vg.addColorStop(1,'rgba(230,120,160,'+(0.45*SEAG.song).toFixed(2)+')');x.fillStyle=vg;x.fillRect(0,0,W,H);}
    const px=16,py=Math.max(70,SEAG.H*0.1);x.fillStyle='rgba(22,16,12,0.72)';x.fillRect(px-8,py-22,196,60);
    x.font='14px Georgia,serif';x.fillStyle='#f1e8d8';x.fillText('Compañeros',px,py-4);for(let k=0;k<6;k++){x.fillStyle=k<SEAG.crew?'#d9874a':'rgba(241,232,216,0.2)';x.beginPath();x.arc(px+104+k*14,py-9,5,0,TAU);x.fill();}
    x.fillStyle='#f1e8d8';x.fillText('Hechizo',px,py+24);x.fillStyle='rgba(241,232,216,0.2)';x.fillRect(px+70,py+14,104,10);x.fillStyle='#e07aa0';x.fillRect(px+70,py+14,104*clamp(SEAG.charm,0,1),10);
    const pr=clamp(SEAG.pos/C.len,0,1);x.fillStyle='rgba(241,232,216,0.25)';x.fillRect(W-10,60,4,H-160);x.fillStyle='#d9874a';x.fillRect(W-12,60+(H-160)*(1-pr)-4,8,8);}
}
function seaKey(e,down){
  if(SEAG.intro){if(!down)return;if(e.code==='Enter'||e.code==='Space'){e.preventDefault();seaStart();}else if(e.code==='Escape')seaEnd('skip');return;}
  if(!SEAG.on)return;e.preventDefault();
  if(e.code==='KeyA'||e.code==='ArrowLeft')SEAG.kL=down;else if(e.code==='KeyD'||e.code==='ArrowRight')SEAG.kR=down;else if(e.code==='Space'){SEAG.ear=down;$('seaEar').classList.toggle('on',down);}
  else if(e.code==='Escape'&&down)seaEnd('skip');
}
function seaHold(id,set){const b=$(id);const on=v=>e=>{e.preventDefault();if(SEAG.on)set(v);b.classList.toggle('on',v&&SEAG.on);};
  b.addEventListener('pointerdown',on(true));for(const ev of['pointerup','pointerleave','pointercancel'])b.addEventListener(ev,on(false));b.addEventListener('contextmenu',e=>e.preventDefault());}
seaHold('seaL',v=>SEAG.kL=v);seaHold('seaR',v=>SEAG.kR=v);seaHold('seaEar',v=>SEAG.ear=v);
$('seaSkip').onclick=()=>{if(SEAG.on||SEAG.intro)seaEnd('skip');};
// sonido: canto de dos voces con vibrato, y el rugido del remolino
function seaAudio(on){
  if(!on){const a=SEAG.au;SEAG.au=null;if(a){try{const n=AUD.ctx.currentTime;a.g.gain.setTargetAtTime(0,n,0.1);a.wg.gain.setTargetAtTime(0,n,0.1);setTimeout(()=>{try{a.o1.stop();a.o2.stop();a.lfo.stop();a.src.stop();}catch(e){}},500);}catch(e){}}return;}
  if(!aOK())return;const c=AUD.ctx;
  const g=c.createGain();g.gain.value=0;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3000;g.connect(lp).connect(AUD.master);
  const o1=c.createOscillator(),o2=c.createOscillator();o1.type='sine';o2.type='triangle';const g2=c.createGain();g2.gain.value=0.3;o1.connect(g);o2.connect(g2).connect(g);
  const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=5.2;lg.gain.value=5;lfo.connect(lg);lg.connect(o1.frequency);lg.connect(o2.frequency);
  const src=c.createBufferSource();src.buffer=AUD.noise;src.loop=true;const wf=c.createBiquadFilter();wf.type='lowpass';wf.frequency.value=260;const wg=c.createGain();wg.gain.value=0;src.connect(wf).connect(wg).connect(AUD.master);
  o1.start();o2.start();lfo.start();src.start();SEAG.au={g,lp,o1,o2,lfo,src,wg};
}
const SEA_MEL=[0,3,7,12,10,7,8,5,3,2,0,-2];
function seaAudioTick(dt){const a=SEAG.au;if(!a||!aOK())return;const n=AUD.ctx.currentTime;
  SEAG.noteT-=dt;if(SEAG.noteT<0){SEAG.noteT=0.48+Math.random()*0.25;SEAG.mi=(SEAG.mi+1)%SEA_MEL.length;const f=440*Math.pow(2,SEA_MEL[SEAG.mi]/12);a.o1.frequency.setTargetAtTime(f,n,0.06);a.o2.frequency.setTargetAtTime(f*1.5,n,0.06);}
  a.g.gain.setTargetAtTime(SEAG.song*(SEAG.ear?0.015:0.08),n,0.12);a.lp.frequency.setTargetAtTime(SEAG.ear?320:3200,n,0.1);
  const c=SEAG.c.chary,d=Math.hypot(c.x-SEAG.x,c.d-SEAG.pos);a.wg.gain.setTargetAtTime(clamp(1-d/1.6,0,1)*(SEAG.cT<4.6?0.35:0.15),n,0.2);}
function seaThump(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;const s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=180;s.connect(f).connect(envGain(t,0.5,0.01,0.45));s.start(t,Math.random());s.stop(t+0.6);}


// ============================================================ mitos en piedra
function openRelief(o){
  const r=o.data,done=state.myths.includes(r.id);dlg={n:null};ui='dialog';releasePointer();
  $('dGlyph').textContent='Μ';setName(r.name);$('dTitle').textContent='Mito en piedra · '+state.myths.length+' de '+RELIEFS.length+' reconocidos';
  const o2=$('dOpts');o2.innerHTML='';let k=1;const add=(txt,fn,cls)=>{const b=document.createElement('button');if(cls)b.className=cls;b.innerHTML='<span class="n">'+(k++)+'</span><span>'+txt+'</span>';b.onclick=fn;o2.appendChild(b);};
  if(done){$('dBody').innerHTML='<p>'+r.see+'</p><div class="verdict">'+r.ok+'</div>';add('Seguir',closeDialog);}
  else{$('dBody').innerHTML='<p>'+r.see+'</p><p><span class="label">¿Qué mito representa?</span></p>';
    [0,1,2].sort(()=>Math.random()-0.5).forEach(i=>add(r.a[i],()=>reliefAnswer(o,i===0),'quiz'));add('Mirar más tarde',closeDialog);}
  $('dialog').hidden=false;setTimeout(()=>{const b=o2.querySelector('button');b&&b.focus({preventScroll:true});},30);
}
function reliefAnswer(o,ok){
  const r=o.data,o2=$('dOpts');o2.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>Seguir</span>';b.onclick=closeDialog;
  if(ok){if(!state.myths.includes(r.id)){state.myths.push(r.id);state.obols+=1;qAdd('so',1);save();updateStats();sfxCoin();o.mk.visible=false;
      toast('<span class="label">Mito reconocido</span><br>'+r.name+' · +1 óbolo');
      if(state.myths.length===RELIEFS.length){state.obols+=5;save();updateStats();setTimeout(()=>toast('<span class="label">Has reconocido todos los mitos</span><br>Eunice te da 5 óbolos más.'),1200);}}
    $('dBody').innerHTML='<p>'+r.see+'</p><div class="verdict">'+r.ok+'</div><p class="sub">Las fuentes están en la Biblioteca (B), sección Mitos.</p>';}
  else{$('dBody').innerHTML='<p>'+r.see+'</p><div class="verdict bad">No es ese. Fíjate otra vez en los detalles, o pregunta a Eunice, la abuela de la fuente.</div>';const b2=document.createElement('button');b2.innerHTML='<span class="n">2</span><span>Volver a intentarlo</span>';b2.onclick=()=>openRelief(o);o2.appendChild(b);o2.appendChild(b2);return;}
  o2.appendChild(b);
}


