// ============================================================ GAME FEEL 3: RECOMPENSAS
// Monedas que saltan y vuelan al monedero (óbolos de plata con la lechuza en Atenas, sestercios de oricalco en Roma),
// contador que rueda, gasto con monedas que caen, esferas del caballo con imán, estallido, racha y acelerón,
// lugares descubiertos con rótulo y subidas de nivel con fanfarria de lira.
const RW={shown:null,hold:0,st:null,fl:null,flN:0,flS:'',flT:0,flTo:0,combo:0,lastOrb:0,dash:0,fov:0,parts:[]};
const RW_PENTA=[0,2,4,7,9,12,14,16,19,21,24];
function rwNote(i){return 1046.5*Math.pow(2,RW_PENTA[Math.max(0,Math.min(RW_PENTA.length-1,i))]/12);}
// ---- sonidos
function rwClink(i,vol,dl){if(!aOK())return;const c=AUD.ctx,t=c.currentTime+(dl||0),f=rwNote(i)*(1+(Math.random()-0.5)*0.012),v=vol||0.05;
  [[1,v,0.35,'triangle'],[2.76,v*0.45,0.18,'sine'],[5.4,v*0.2,0.08,'sine']].forEach(([m,p,d,ty])=>{const o=c.createOscillator();o.type=ty;o.frequency.value=f*m;o.connect(envGain(t,p,0.002,d));o.start(t);o.stop(t+d+0.05);});
  gfNoise(t,'highpass',6000,0.7,v*0.5,0.001,0.03);}
function rwJingle(n){if(!aOK())return;const t=AUD.ctx.currentTime;for(let i=0;i<Math.min(8,2+n);i++)gfNoise(t+i*0.035+Math.random()*0.02,'bandpass',5200+Math.random()*2500,6,0.04,0.002,0.04);}
function rwPluck(f,t,v,d){const c=AUD.ctx;[[1,'triangle',v],[2,'sine',v*0.3],[3,'sine',v*0.12]].forEach(([m,ty,p])=>{const o=c.createOscillator();o.type=ty;o.frequency.value=f*m;o.connect(envGain(t,p,0.003,d/m));o.start(t);o.stop(t+d+0.1);});}
function rwChord(){if(!aOK())return;const t=AUD.ctx.currentTime+0.02;[523.25,659.25,783.99,1046.5].forEach((f,i)=>rwPluck(f,t+i*0.03,0.04,1.4));}
function rwSpendSfx(n){if(!aOK())return;const t=AUD.ctx.currentTime,k=Math.min(4,1+Math.floor(n/3));
  for(let i=0;i<k;i++)rwClink(4-i,0.035,0.08+i*0.07);gfNoise(t+0.05,'lowpass',320,0.8,0.12,0.004,0.12);}
function rwFanfare(big){if(!aOK())return;const t=AUD.ctx.currentTime+0.03;[523.25,659.25,783.99,1046.5].forEach((f,i)=>rwPluck(f,t+i*0.09,0.07,1.2));
  [523.25,783.99,1046.5,1318.5].forEach(f=>rwPluck(f,t+0.45,0.045,2.2));if(big){gfNoise(t+0.45,'lowpass',180,0.8,0.2,0.01,0.7);[1568,2093].forEach((f,i)=>rwPluck(f,t+0.7+i*0.12,0.03,1.6));}}
function rwDiscSfx(){if(!aOK())return;const t=AUD.ctx.currentTime+0.02;[587.33,880,739.99,1174.66].forEach((f,i)=>rwPluck(f,t+i*0.15,0.05,1.6));}
function rwOrbSfx(n){if(!aOK())return;const c=AUD.ctx,t=c.currentTime,f=rwNote(n-1)*0.5;
  [[1,0.06,0.6],[2.01,0.025,0.35],[3.98,0.012,0.2]].forEach(([m,p,d])=>{const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(f*m*0.94,t);o.frequency.exponentialRampToValueAtTime(f*m,t+0.04);o.connect(envGain(t,p,0.004,d));o.start(t);o.stop(t+d+0.05);});
  const s=c.createBufferSource();s.buffer=AUD.noise;const bp=c.createBiquadFilter();bp.type='bandpass';bp.Q.value=2;bp.frequency.setValueAtTime(800,t);bp.frequency.exponentialRampToValueAtTime(5000,t+0.25);s.connect(bp).connect(envGain(t,0.05,0.05,0.2));s.start(t,Math.random()*2,0.35);}
// el tintineo genérico no suena cuando ya suenan las monedas (las que llegan al monedero o las que se gastan)
const sfxCoin0=sfxCoin;
sfxCoin=function(){if(state&&GF.obols!==null&&state.obols!==GF.obols)return;sfxCoin0();};
// ---- estilos
function rwCSS(){if($('rwCSS'))return;const s=document.createElement('style');s.id='rwCSS';s.textContent=
 '.rwCoin{position:fixed;left:0;top:0;width:20px;height:20px;margin:-10px 0 0 -10px;pointer-events:none;z-index:58;will-change:transform}'+
 '.rwCoin i{display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:50%;font:700 6.5px/1 Georgia,serif;font-style:normal;animation:rwSpin .45s linear infinite}'+
 '.rwCoin.ag i{background:radial-gradient(circle at 35% 30%,#fff,#d8dce0 40%,#878d95 85%);color:#5a6068;box-shadow:0 0 9px rgba(230,240,255,.85),inset 0 0 0 1.5px #a8aeb5}'+
 '.rwCoin.or i{background:radial-gradient(circle at 35% 30%,#fff6c8,#e2b84e 45%,#8f6418 90%);color:#6e4a0e;box-shadow:0 0 9px rgba(255,210,120,.85),inset 0 0 0 1.5px #b88a2a}'+
 '@keyframes rwSpin{0%{transform:scaleX(1)}50%{transform:scaleX(.15)}100%{transform:scaleX(1)}}'+
 '#sObols,#sHorse{display:inline-block;transform-origin:left center}.rwBump{animation:rwBump .32s ease-out}'+
 '@keyframes rwBump{0%{transform:scale(1)}40%{transform:scale(1.3);color:#ffe08a;text-shadow:0 0 10px rgba(255,210,120,.95)}100%{transform:scale(1)}}'+
 '#sHorse{background:linear-gradient(90deg,rgba(232,195,122,.4) var(--hx,0%),rgba(255,255,255,.07) var(--hx,0%));border-radius:3px;padding:0 6px}'+
 '.rwFl{position:fixed;pointer-events:none;z-index:58;font:700 17px Georgia,serif;text-shadow:0 1px 3px #000,0 0 10px rgba(0,0,0,.6);white-space:nowrap;transition:opacity .4s}'+
 '.rwFl.pop{animation:rwFlPop .3s cubic-bezier(.3,1.7,.5,1)}@keyframes rwFlPop{from{transform:scale(.55)}to{transform:scale(1)}}'+
 '.rwBan{position:fixed;left:50%;top:17%;transform:translateX(-50%);pointer-events:none;z-index:57;text-align:center;color:#f3e6cf;text-shadow:0 2px 8px #000,0 0 18px rgba(0,0,0,.6);animation:rwBan 3.8s ease-out forwards;width:max-content;max-width:90vw}'+
 '.rwBan small{display:block;font:600 12px Georgia,serif;letter-spacing:.35em;color:#e8b07a;text-transform:uppercase}'+
 '.rwBan b{display:block;font:400 clamp(24px,4.5vw,40px) Marcellus,Georgia,serif;font-weight:400;margin-top:4px}.rwBan em{display:block;font:italic 15px Georgia,serif;color:#e8c37a;margin-top:2px}'+
 '.rwBan .ln{height:1px;margin:8px auto 0;width:0;background:linear-gradient(90deg,transparent,#e8b07a,transparent);animation:rwLn 1s .1s ease-out forwards}'+
 '@keyframes rwBan{0%{opacity:0;transform:translateX(-50%) translateY(8px)}12%{opacity:1;transform:translateX(-50%)}80%{opacity:1}100%{opacity:0}}@keyframes rwLn{to{width:min(70vw,420px)}}'+
 '#lvup .n{animation:rwNum .7s cubic-bezier(.3,1.8,.5,1)}@keyframes rwNum{0%{transform:scale(.2);opacity:0}100%{transform:none;opacity:1}}'+
 '#lvup .c{position:relative;overflow:hidden}#lvup .c:after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,225,170,.2),transparent);animation:rwShine 1.2s .3s ease-out forwards;pointer-events:none}@keyframes rwShine{to{left:130%}}'+
 '@media (prefers-reduced-motion:reduce){.rwCoin{display:none}.rwBan,#lvup .n,#lvup .c:after{animation:none}.rwBan .ln{width:min(70vw,420px);animation:none}}';document.head.appendChild(s);}
rwCSS();
// ---- monedero
function rwUnit(n){return MODE==='roma'?(n===1?'sestercio':'sestercios'):(n===1?'óbolo':'óbolos');}
function rwCounter(){const e=$('sObols');if(!e||!state)return;const n=RW.shown===null?state.obols:Math.round(RW.shown);e.textContent=n+' '+rwUnit(n);}
function rwRect(){const e=$('sObols');let r=e&&e.getBoundingClientRect();if(!r||!r.width){const s=$('stats');r=s?s.getBoundingClientRect():null;}return r||{left:20,top:20,right:120,width:100,height:20};}
function rwTarget(){const r=rwRect();return{x:r.left+12,y:r.top+r.height/2};}
function rwSource(){const d=$('dialog');if(d&&!d.hidden){const r=d.getBoundingClientRect();if(r.width)return{x:r.left+r.width/2,y:r.top+Math.min(90,r.height/3)};}return{x:innerWidth/2,y:innerHeight*0.58};}
function rwCoinEl(){const e=document.createElement('div');e.className='rwCoin '+(MODE==='roma'?'or':'ag');e.innerHTML='<i>'+(MODE==='roma'?'SC':'ΑΘΕ')+'</i>';document.body.appendChild(e);return e;}
function rwBump(id){const e=$(id||'sObols');if(!e)return;e.classList.remove('rwBump');void e.offsetWidth;e.classList.add('rwBump');}
function rwFloat(sg,d){const now=performance.now(),r=rwRect();let e=RW.fl;
  if(e&&e.isConnected&&RW.flS===sg&&now-RW.flT<1600)RW.flN+=d;else{if(e)e.remove();e=document.createElement('div');e.className='rwFl';document.body.appendChild(e);RW.fl=e;RW.flN=d;RW.flS=sg;}
  RW.flT=now;e.textContent=(sg==='+'?'+':'−')+RW.flN+' '+rwUnit(RW.flN);e.style.color=sg==='+'?(MODE==='roma'?'#f0cf72':'#eef2f6'):'#e8907a';
  e.style.left=Math.min(innerWidth-140,r.right+10)+'px';e.style.top=(r.top+r.height/2-11)+'px';e.style.opacity=1;e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop');
  clearTimeout(RW.flTo);RW.flTo=setTimeout(()=>{e.style.opacity=0;setTimeout(()=>{e.remove();if(RW.fl===e)RW.fl=null;},450);},2000);}
function rwGain(d){rwFloat('+',d);const big=d>=10;
  if(GF.reduced||!document.body.animate){RW.hold=0;rwClink(2,0.05);rwBump();return;}
  const s=rwSource(),T=rwTarget(),k=Math.min(big?14:8,d<=6?d:6+Math.ceil(Math.log2(d)));rwJingle(k);if(big)gfGlow();
  RW.hold=performance.now()+650;   // el contador empieza a rodar cuando llega la primera moneda
  let last=0;for(let i=0;i<k;i++){const e=rwCoinEl(),a=-Math.PI/2+(Math.random()-0.5)*2.6,v=55+Math.random()*95,px=s.x+Math.cos(a)*v,py=s.y+Math.sin(a)*v*0.8,dl=i*55,dur=1000+Math.random()*180;
    e.animate([{transform:'translate('+s.x+'px,'+s.y+'px) scale(.3)',opacity:0},{transform:'translate('+px+'px,'+py+'px) scale(1.2)',opacity:1,offset:.28,easing:'ease-in-out'},
      {transform:'translate('+(px+(Math.random()-0.5)*12)+'px,'+(py+14)+'px) scale(1)',opacity:1,offset:.48,easing:'cubic-bezier(.55,0,.85,.45)'},
      {transform:'translate('+T.x+'px,'+T.y+'px) scale(.55)',opacity:1,offset:.97},{transform:'translate('+T.x+'px,'+T.y+'px) scale(.4)',opacity:0}],{duration:dur,delay:dl,fill:'both'});
    const at=dl+dur*0.97;last=Math.max(last,at);setTimeout(()=>{e.remove();rwClink(Math.min(10,i),0.042);rwBump();},at);}
  if(big)setTimeout(rwChord,last+60);}
function rwSpend(d){rwFloat('−',d);rwSpendSfx(d);RW.hold=0;if(GF.reduced||!document.body.animate)return;const T=rwTarget(),k=Math.min(6,1+Math.floor(d/3));
  for(let i=0;i<k;i++){const e=rwCoinEl(),dx=(Math.random()-0.25)*90,dl=i*60;
    e.animate([{transform:'translate('+T.x+'px,'+T.y+'px) scale(.6)',opacity:1},{transform:'translate('+(T.x+dx*0.5)+'px,'+(T.y-28)+'px) scale(.95)',opacity:1,offset:.3,easing:'ease-in'},{transform:'translate('+(T.x+dx)+'px,'+(T.y+110)+'px) scale(.8)',opacity:0}],{duration:750,delay:dl,fill:'both'});
    setTimeout(()=>e.remove(),dl+780);}}
function rwObols(){if(!state)return;if(RW.st!==state){RW.st=state;GF.obols=state.obols;RW.shown=state.obols;rwCounter();return;}
  if(GF.obols===null)GF.obols=state.obols;const d=state.obols-GF.obols;if(d){GF.obols=state.obols;if(d>0)rwGain(d);else rwSpend(-d);}}
function rwRoll(dt){if(!state)return;const tgt=state.obols;if(RW.shown===null){RW.shown=tgt;rwCounter();return;}
  if(RW.shown!==tgt&&performance.now()>RW.hold){const df=tgt-RW.shown,rate=Math.max(5,Math.abs(df)*2.8);RW.shown+=Math.sign(df)*Math.min(Math.abs(df),rate*dt);if(Math.abs(tgt-RW.shown)<0.02)RW.shown=tgt;rwCounter();}}
const updateStats0=updateStats;
updateStats=function(){updateStats0();rwCounter();const h=hz(),e=$('sHorse');if(e&&h.own)e.style.setProperty('--hx',Math.round(Math.min(1,h.xp/horseNeed(h.lvl))*100)+'%');};
// ---- partículas en el mundo (esferas del caballo)
const RW_RING=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.strokeStyle='rgba(255,240,200,1)';x.lineWidth=4;x.shadowColor='#ffd060';x.shadowBlur=8;x.beginPath();x.arc(32,32,24,0,Math.PI*2);x.stroke();return new THREE.CanvasTexture(c);})();
function rwSprite(tex,col){return new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:col,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));}
function rwBurst(x,y,z,col,n,sc){const s=sc||1,ivx=MOUNT.riding?GF.vx*0.8:0,ivz=MOUNT.riding?GF.vz*0.8:0;
  for(let i=0;i<n;i++){const sp=rwSprite(EPI_TEX,col);sp.position.set(x,y,z);const a=Math.random()*Math.PI*2,u=Math.random()*2-1,r=Math.sqrt(1-u*u),v=(2+Math.random()*3)*s;scene.add(sp);
    RW.parts.push({sp,vx:Math.cos(a)*r*v+ivx,vy:Math.abs(u)*v+2,vz:Math.sin(a)*r*v+ivz,t:0,L:0.6+Math.random()*0.45,s0:(0.16+Math.random()*0.22)*s});}
  const rg=rwSprite(RW_RING,col);rg.position.set(x,y,z);scene.add(rg);RW.parts.push({sp:rg,ring:1,vx:ivx,vy:0,vz:ivz,t:0,L:0.5,s0:2.4*s});}
function rwParts(dt){for(let i=RW.parts.length-1;i>=0;i--){const p=RW.parts[i];p.t+=dt;const k=p.t/p.L;if(k>=1){scene.remove(p.sp);p.sp.material.dispose();RW.parts.splice(i,1);continue;}
  p.sp.position.x+=p.vx*dt;p.sp.position.z+=p.vz*dt;
  if(p.ring){const s=0.3+p.s0*k;p.sp.scale.set(s,s,1);p.sp.material.opacity=0.8*(1-k);}
  else{p.vy-=9*dt;p.sp.position.y+=p.vy*dt;const s=p.s0*(1-k*0.7);p.sp.scale.set(s,s,1);p.sp.material.opacity=0.9*(1-k*k);}}}
// imán: las esferas cercanas se acercan al jinete
function rwMagnet(dt){if(!MOUNT.riding||!HORBS.length)return;for(const o of HORBS){const dx=player.x-o.x,dz=player.z-o.z,d=Math.hypot(dx,dz);
  if(d<10&&d>0.05&&Math.abs(o.y-(player.feet+1.4))<4){const st=Math.min(d,(16-d)*dt*1.7);o.x+=dx/d*st;o.z+=dz/d*st;o.g.position.x=o.x;o.g.position.z=o.z;}}}
const horseXP0=horseXP;
horseXP=function(){const now=performance.now(),h=hz(),l0=h.lvl;RW.combo=now-RW.lastOrb<5000?RW.combo+1:1;RW.lastOrb=now;
  const sf=sfxCoin;sfxCoin=function(){};try{horseXP0();}finally{sfxCoin=sf;}
  rwOrbSfx(RW.combo);if(!GF.reduced){RW.dash=Math.min(0.35,0.12+RW.combo*0.03);RW.fov=Math.min(9,3+RW.combo);}
  const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);rwBurst(player.x+fx*3.2,player.feet+1.5,player.z+fz*3.2,0xffd060,RW.combo>2?22:14,RW.combo>2?1.3:1);
  gfFloat('✦ +1'+(RW.combo>1?' · racha ×'+RW.combo:''),'#ffd87a');rwBump('sHorse');
  if(h.lvl>l0)setTimeout(()=>{rwFanfare(true);try{sfxNeigh();}catch(e){}gfGlow();rwBurst(player.x+fx*5,player.feet+1.2,player.z+fz*5,0xffe6a0,36,1.8);RW.fov=12;},150);};
// ---- rótulo de lugar descubierto
function rwDiscover(name,extra){rwCSS();const b=document.createElement('div');b.className='rwBan';
  b.innerHTML='<small>Lugar descubierto</small><b></b>'+(extra?'<em></em>':'')+'<div class="ln"></div>';b.querySelector('b').textContent=name;if(extra)b.querySelector('em').textContent=extra;
  document.querySelectorAll('.rwBan').forEach(x=>x.remove());document.body.appendChild(b);rwDiscSfx();setTimeout(()=>b.remove(),3900);}
// ---- tick
function rwTick(dt){rwObols();rwRoll(dt);rwMagnet(dt);rwParts(dt);const k=Math.exp(-dt*1.6);RW.dash*=k;RW.fov*=Math.exp(-dt*2.2);if(RW.dash<0.002)RW.dash=0;if(RW.combo&&performance.now()-RW.lastOrb>5000)RW.combo=0;}

