// ============================================================ MOMENTOS: QUE LO IMPORTANTE SE NOTE (22/11)
// Hasta ahora casi todo llegaba como un aviso pequeño (o se guardaba en el caduceo) y parecía circunstancial.
// Ahora cada logro tiene su ceremonia, con el mismo material del HUD (cerámica en Atenas, fresco en Roma):
// · un rótulo grande en el centro de arriba, con su palabra antigua (μάθημα / DISCIPLINA, ἔργον / OPVS…),
//   luz que barre el rótulo, chispas doradas, un destello en los bordes de la pantalla, la cámara que respira y un instante de cámara lenta;
// · música propia: llamada para una misión nueva, acorde para un paso cumplido y fanfarria de lira para lo grande.
// Se detecta solo, mirando lo que cambia en la partida (lecciones, mitos, favores de los dioses, primeros pasos, capítulos de la
// Historia, logros) y los avisos de misiones y encargos; no hay que tocar cada misión una por una.
// Mientras hay una misión en curso también se nota: el objetivo late con un rombo, se ilumina cuando cambia, hay una columna de luz
// en el destino que se ve de lejos, la brújula dice cuánto falta (en pasos y estadios en Atenas; en pasos y millas en Roma: el passus
// romano, 1,48 m, y la milla de mil pasos; el estadio ático, unos 185 m, y el paso griego, βῆμα, unos 0,74 m) y al llegar suena un aviso.
const MO={q:[],busy:false,snap:null,obj:'',objT:0,tk:0,arr:null,beacon:null,bT:0,spd:null};
const MO_K={   // [palabra antigua en Atenas, en Roma, rótulo, grande]
 lesson:['μάθημα','DISCIPLINA','Lección aprendida',1],myth:['μῦθος','FABVLA','Mito descubierto',1],god:['χάρις','GRATIA DEORVM','Favor de los dioses',1],
 logro:['τιμή','HONOS','Logro',1],chapter:['τέλος','FINIS','Capítulo completado',1],done:['τέλος','PERFECTVM','Misión cumplida',1],
 step:['ἔργον','OPVS','Objetivo cumplido',0],start:['ἔργον','OPVS','Nueva misión',0],place:['τόπος','LOCVS','Lugar descubierto',0]};
function moCSS(){if($('moCSS'))return;const s=document.createElement('style');s.id='moCSS';s.textContent=
 '#moBan{position:fixed;left:50%;top:15%;z-index:80;transform:translateX(-50%);min-width:min(440px,86vw);max-width:min(620px,92vw);box-sizing:border-box;text-align:center;pointer-events:auto;cursor:pointer;'+
 'padding:30px 34px 28px;color:#fbe6c8;font-family:var(--f-body);background:rgba(20,15,11,.9) no-repeat;background-size:100% 100%;animation:moIn .55s cubic-bezier(.2,1.4,.4,1) both;overflow:hidden}'+
 'body.hz #moBan{background-color:transparent}#moBan.small{top:11%;min-width:min(360px,84vw);padding:24px 28px 22px}'+
 '#moBan.out{animation:moOut .5s ease-in forwards}'+
 '#moBan .k{font:600 .78rem var(--f-display);letter-spacing:.32em;text-transform:uppercase;color:#e8b07a;text-shadow:0 0 3px #0c0704}'+
 '#moBan .k i{font-style:normal;letter-spacing:.12em;color:#ffd9a0;margin-right:.6em;font-family:var(--f-body);text-transform:none;font-size:1.05rem}'+
 'body.hzR #moBan .k i{font-family:var(--f-display);letter-spacing:.16em;font-size:.95rem}'+
 '#moBan .t{margin-top:6px;font:400 clamp(1.5rem,3.4vw,2.25rem)/1.15 var(--f-display);color:#fff1da;letter-spacing:.02em;text-shadow:0 0 2px #0c0704,0 0 12px rgba(255,200,120,.45),0 2px 3px #0c0704;animation:moT .9s ease-out both .1s}'+
 '#moBan.small .t{font-size:clamp(1.15rem,2.6vw,1.6rem)}'+
 '#moBan .s{margin-top:7px;font-size:1rem;color:#f1d2ae;text-shadow:0 0 3px #0c0704,0 1px 2px #0c0704;line-height:1.35}'+
 '#moBan .ln{height:2px;margin:10px auto 0;width:0;background:linear-gradient(90deg,transparent,#e8b07a,transparent);animation:moLn 1s ease-out forwards .25s}'+
 '#moBan::after{content:"";position:absolute;top:0;bottom:0;left:-40%;width:30%;background:linear-gradient(100deg,transparent,rgba(255,236,190,.28),transparent);transform:skewX(-18deg);animation:moSw 1.4s ease-in-out .35s both;pointer-events:none}'+
 '.moSp{position:fixed;z-index:81;width:6px;height:6px;border-radius:50%;background:radial-gradient(#fff6d8,#ffc65a 55%,transparent 70%);pointer-events:none;animation:moSp var(--d,1.4s) ease-out forwards}'+
 '.moVig{position:fixed;inset:0;z-index:53;pointer-events:none;background:radial-gradient(ellipse at 50% 40%,transparent 45%,rgba(255,196,96,.32) 100%);animation:moVig 1.6s ease-out forwards}'+
 '@keyframes moIn{0%{opacity:0;transform:translateX(-50%) scale(1.25);filter:blur(6px)}100%{opacity:1;transform:translateX(-50%) scale(1);filter:none}}'+
 '@keyframes moOut{to{opacity:0;transform:translateX(-50%) translateY(-24px) scale(.96)}}'+
 '@keyframes moT{0%{letter-spacing:.22em;opacity:0}100%{letter-spacing:.02em;opacity:1}}@keyframes moLn{to{width:70%}}'+
 '@keyframes moSw{0%{left:-40%}100%{left:120%}}'+
 '@keyframes moSp{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.3)}}'+
 '@keyframes moVig{0%{opacity:0}25%{opacity:1}100%{opacity:0}}'+
 '#stats.moNew{animation:moObj 2.4s ease-out}@keyframes moObj{0%,100%{filter:none}15%{filter:drop-shadow(0 0 10px rgba(255,200,110,.95)) brightness(1.25)}50%{filter:drop-shadow(0 0 6px rgba(255,200,110,.6))}}'+
 '#objective>b:first-child::before{content:"◆";display:inline-block;margin-right:6px;color:#ffd27a;text-shadow:0 0 6px rgba(255,190,90,.9);animation:moDia 1.6s ease-in-out infinite}'+
 '@keyframes moDia{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.7);opacity:.6}}'+
 'body.hz #compass .c.obj small{font:600 10px var(--f-body);margin-left:4px;color:#ffe0a8;letter-spacing:0;opacity:.95}'+
 '@media (prefers-reduced-motion:reduce){#moBan,#moBan .t,#moBan::after,.moSp,#stats.moNew,#objective>b:first-child::before{animation:none!important}#moBan .ln{width:70%}}';
 document.head.appendChild(s);}
// ---- sonidos (síntesis, como el resto del juego)
function moHorn(t,f,d,v){const c=AUD.ctx,o=c.createOscillator(),o2=c.createOscillator(),lp=c.createBiquadFilter();o.type='sawtooth';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f*1.002;
  lp.type='lowpass';lp.frequency.setValueAtTime(f*1.5,t);lp.frequency.linearRampToValueAtTime(f*4,t+0.12);lp.frequency.linearRampToValueAtTime(f*2.2,t+d);const g=envGain(t,v,0.06,d);o.connect(lp);o2.connect(lp);lp.connect(g);o.start(t);o2.start(t);o.stop(t+d+0.1);o2.stop(t+d+0.1);}
function moSfx(kind){if(!aOK())return;const t=AUD.ctx.currentTime+0.03;
  try{if(kind==='start'){moHorn(t,MODE==='roma'?196:220,0.35,0.06);moHorn(t+0.34,MODE==='roma'?293.66:329.63,0.9,0.07);gfNoise(t,'lowpass',140,0.9,0.18,0.005,0.25);gfNoise(t+0.34,'lowpass',140,0.9,0.14,0.005,0.3);}
  else if(kind==='step'){rwChord();gfNoise(t,'highpass',7000,0.7,0.03,0.002,0.4);}
  else if(kind==='place'){rwDiscSfx();}
  else{rwFanfare(true);gfNoise(t+0.45,'highpass',5000,0.5,0.06,0.01,1.6);gfNoise(t,'lowpass',120,0.9,0.22,0.005,0.35);}}catch(e){}}
// ---- la ceremonia
function momento(kind,title,sub){if(!title)return;MO.q.push({kind,title:String(title),sub:sub?String(sub):''});if(MO.q.length>6)MO.q.splice(1,MO.q.length-6);moNext();}
function moNext(){if(MO.busy||!MO.q.length)return;if(typeof ui==='undefined'||(ui!=='play'&&ui!=='dialog')||(typeof VUELO!=='undefined'&&VUELO.on)){setTimeout(moNext,700);return;}
  const it=MO.q.shift(),K=MO_K[it.kind]||MO_K.done,big=!!K[3],ro=MODE==='roma';MO.busy=true;moCSS();
  let b=$('moBan');if(b)b.remove();b=document.createElement('div');b.id='moBan';b.className=big?'big':'small';b.setAttribute('role','status');b.setAttribute('aria-live','polite');
  b.innerHTML='<div class="k"><i></i><span></span></div><div class="t"></div>'+(it.sub?'<div class="s"></div>':'')+'<div class="ln"></div>';
  b.querySelector('.k i').textContent=ro?K[1]:K[0];b.querySelector('.k span').textContent=K[2];b.querySelector('.t').textContent=it.title;if(it.sub)b.querySelector('.s').textContent=it.sub;
  document.body.appendChild(b);
  try{if(typeof HZ!=='undefined'&&HZ.on)hzFit(b,HZ.a?(w,h)=>hzPanelA(w,h,{top:1,bot:1,r:10}):(w,h)=>hzPanelR(w,h,{top:1,bot:1}));}catch(e){}
  moSfx(it.kind);
  const red=typeof GF!=='undefined'&&GF.reduced;
  if(!red){const r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,n=big?26:12;
    for(let i=0;i<n;i++){const p=document.createElement('div');p.className='moSp';const a=Math.random()*Math.PI*2,d=(big?140:90)+Math.random()*(big?180:90);
      p.style.left=(cx+(Math.random()-.5)*r.width*.8)+'px';p.style.top=(cy+(Math.random()-.5)*r.height*.6)+'px';p.style.setProperty('--x',(Math.cos(a)*d)+'px');p.style.setProperty('--y',(Math.sin(a)*d*.6-30)+'px');
      p.style.setProperty('--d',(1+Math.random()*0.9)+'s');p.style.animationDelay=(Math.random()*0.35)+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),2600);}
    if(big){const v=document.createElement('div');v.className='moVig';document.body.appendChild(v);setTimeout(()=>v.remove(),1700);
      try{RW.fov=Math.max(RW.fov,8);}catch(e){}
      try{const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);rwBurst(player.x+fx*3,player.feet+1.4,player.z+fz*3,0xffd27a,30,1.5);}catch(e){}
      moSlow();}}
  const end=()=>{if(!b.isConnected)return;b.classList.add('out');setTimeout(()=>{b.remove();MO.busy=false;setTimeout(moNext,250);},480);};
  b.onclick=end;setTimeout(end,big?3900:2700);}
// instante de cámara lenta (no se toca si alguien ya cambió la velocidad: jugar solo ×2, pruebas…)
function moSlow(){if(MO.spd!==null)return;const s0=window.__spd||1;if(s0!==1)return;MO.spd=s0;window.__spd=0.4;
  let k=0;const step=()=>{k++;window.__spd=Math.min(1,0.4+k*0.06);if(window.__spd<1)setTimeout(step,60);else{window.__spd=s0;MO.spd=null;}};setTimeout(step,450);}
// ---- lo que cambia en la partida
function moTake(){const s=state;if(!s)return null;let ch=-1,st=-1,stObj='';try{if(storyOn()&&s.story){ch=s.story.ch;st=s.story.st;const x=curStoryStep();stObj=x?x.obj:'';}}catch(e){}
  let sd=0,sT='';try{sd=stepsDone();const c=curStep();sT=c?c.title:'';}catch(e){}
  const gd={};try{for(const d of GODS)if(s.gods&&s.gods.q&&s.gods.q[d.id]==='done')gd[d.id]=1;}catch(e){}
  let lg={};try{lg=Object.assign({},eduz().logros);}catch(e){}
  return {L:new Set(s.lessons||[]),M:new Set(s.myths||[]),gd,lg,ch,st,stObj,sd,sT};}
function moObjHead(){const o=$('objective');if(!o)return '';const b=o.querySelector('b');return ((b?b.textContent:o.textContent.split('\n')[0])||'').trim();}
function moObjSub(){const o=$('objective');if(!o)return '';const s=o.querySelector('.sub');return s?s.textContent.trim():'';}
function moCheck(){const a=MO.snap,b=moTake();if(!b)return;MO.snap=b;if(!a)return;let got=false;
  for(const id of b.L)if(!a.L.has(id)){const L=LESSONS[id];momento('lesson',L?L.title:id,L&&L.who?'Te la ha enseñado '+L.who:'');got=true;}
  for(const id of b.M)if(!a.M.has(id)){const r=RELIEFS.find(x=>x.id===id);momento('myth',r?r.name:id,'');got=true;}
  for(const id in b.gd)if(!a.gd[id]){const g=GODS.find(x=>x.id===id);momento('god',g?(g.name||g.n||id):id,'Los dioses se acuerdan de quien los honra');got=true;}
  for(const k in b.lg)if(!a.lg[k]){const L=(typeof LOGROS!=='undefined'?LOGROS:[]).find(x=>x.k===k);if(L){momento('logro',L.n,L.d);got=true;}}
  if(b.ch>a.ch&&a.ch>=0){momento('chapter','Capítulo '+(a.ch+1),'');got=true;}
  else if(b.ch===a.ch&&b.st>a.st&&a.stObj){momento('step',a.stObj,'');got=true;}
  if(b.sd>a.sd&&a.sT){momento('step',a.sT,'Primeros pasos · '+b.sd);got=true;}
  return got;}
// el objetivo de arriba: si cambia, es una misión (u objetivo) nueva
function moObjTick(dt,got){const h=moObjHead(),k=h.replace(/[0-9]+/g,'#');if(!MO.obj){MO.obj=k;return;}
  if(k&&k!==MO.obj){MO.obj=k;const st=$('stats');if(st){st.classList.remove('moNew');void st.offsetWidth;st.classList.add('moNew');}try{hudPeek();}catch(e){}
    const t=h.replace(/^◆\s*/,''),sub=moObjSub();setTimeout(()=>momento('start',t,sub),got?300:0);MO.arr=null;}}
// columna de luz en el destino, distancia en la brújula y aviso al llegar
function moBeacon(dt){let t=null;try{t=guideTarget();}catch(e){}
  if(!t||!isFinite(t.x)||!isFinite(t.z)){if(MO.beacon)MO.beacon.visible=false;return;}
  if(!MO.beacon){const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:0.22,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false});
    const c=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.9,140,12,1,true),m);c.position.y=70;g.add(c);
    const rm=m.clone();rm.opacity=0.5;const ring=new THREE.Mesh(new THREE.RingGeometry(1.4,1.9,32),rm);ring.rotation.x=-Math.PI/2;ring.position.y=0.15;g.add(ring);
    g.renderOrder=5;scene.add(g);MO.beacon=g;}
  const g=MO.beacon,d=Math.hypot(t.x-player.x,t.z-player.z),ph=performance.now()/1000;g.visible=d>10&&ui==='play';
  g.position.set(t.x,floorAt(t.x,t.z),t.z);const fade=Math.min(1,Math.max(0,(d-10)/40));
  g.children[0].material.opacity=0.2*fade*(0.75+0.25*Math.sin(ph*2.2));g.children[1].material.opacity=0.5*fade;g.children[1].scale.setScalar(1+0.25*Math.sin(ph*3));
  const key=Math.round(t.x)+','+Math.round(t.z);if(d<7&&MO.arr!==key){MO.arr=key;try{gfFloat(MODE==='roma'?'Has llegado':'Has llegado','#ffe0a8');}catch(e){}moSfx('place');}}
function moDist(d){if(MODE==='roma'){const p=d/1.48;return p<1000?Math.round(p/5)*5+' pasos':(p/1000).toFixed(1).replace('.',',')+' millas';}
  return d<185?Math.round(d/0.74/5)*5+' pasos':(d/185).toFixed(1).replace('.',',')+' estadios';}
{const f=drawCompass;drawCompass=function(){const r=f.apply(this,arguments);try{const o=$('compass').querySelector('.c.obj');const t=guideTarget();
  if(o&&t&&!o.childElementCount){const d=Math.hypot(t.x-player.x,t.z-player.z);if(d>12)o.innerHTML='◆<small>'+moDist(d)+'</small>';}}catch(e){}return r;};}
// ---- los avisos de misiones y encargos que llegan por toast (cada misión tiene el suyo)
{const f=toast;toast=function(html){const r=f.apply(this,arguments);try{const s=String(html||''),m=s.match(/class="label">([^<]*)<\/span>/),lab=m?m[1].trim():'';
  if(lab&&!/Logro|Lección|Lugar/.test(lab)&&/Misi[oó]n|Encargo|Reto|Prueba|Corona|Examen|Trabajo|Favor/i.test(lab)){const body=s.replace(/<[^>]+>/g,' ').replace(lab,'').replace(/\s+/g,' ').trim();
    const sh=body.length>110?body.slice(0,107).replace(/\s\S*$/,'')+'…':body;
    if(/cumplid|completad|conseguid|superad|terminad|has ganado|lo has logrado|enhorabuena|bien hecho|has acabado|ya tienes/i.test(body))momento('done',lab,sh);
    else if(/nuev|aceptad|te pide|te encarga|empieza|comienza|ve a |busca /i.test(body))momento('start',lab,sh);}}catch(e){}return r;};}
// el rótulo de lugar descubierto pasa a ser una ceremonia pequeña, del mismo estilo
{const f=rwDiscover;rwDiscover=function(name,extra){try{momento('place',name,extra||'');return;}catch(e){}return f.apply(this,arguments);};}
// ---- tick (enganchado a gfTick, que corre en cada fotograma)
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(state&&ui!=='start'){MO.tk-=dt;if(MO.tk<=0){MO.tk=0.3;const got=moCheck();moObjTick(dt,got);}moBeacon(dt);}}catch(e){}return r;};}
