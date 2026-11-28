// ============================================================ PERSONAJES ATENTOS: mirada, cejas que expresan, saludo a conocidos, empujones y truenos
// Mirada: quien está cerca te mira un rato, aparta la vista y vuelve a mirarte. Si ya habéis hablado, te saluda con la cabeza (una vez cada 90 s).
// Cejas: las de la cara son una sola pieza fija con la boca; al primer gesto se separan en dos piezas móviles (solo en quien reacciona).
// Empujones: si corres contra alguien, se aparta de tu camino y protesta (Juvenal, Sátira 3, 243-246, se queja de los codazos en las calles de Roma).
// Trueno: miran al cielo. Chasquear la lengua al ver el relámpago era costumbre: Aristófanes, Avispas 626; Plinio, Historia natural 28, 25.
const GZ={nod:{},bolt:0,bid:0,popT:-1e9,bumpT:0,tT:0,bare:new Map()};
const GZ_EX={neutral:[0,0],sorpresa:[0.009,-0.05],enfado:[-0.004,-0.38],tristeza:[0.003,0.42],duda:[0.006,0],alegria:[0.004,0.08]};
const GZ_BUMP={a:['¡Eh, mira por dónde andas!','¡Por el perro, que me pisas!','¡Cuidado, forastero!','¿Es que no ves?'],r:['¡Eh, cuidado!','¡Mira por dónde andas!','¿Tienes prisa? ¡Pues da la vuelta!','¡Por Hércules, que me tiras!']};
function gzLook(o,gs,dx,dz,d,dt){const g=o.g;
  if(GZ.bolt>0&&gs.bid!==GZ.bid&&d<25){gs.bid=GZ.bid;gs.sky=1.4+Math.random()*1.2;gs.skyY=(Math.random()-0.5)*0.6;gzExpr(gs,'sorpresa',1.6);if(Math.random()<0.3){gsSet(gs,'pecho',0.8,true);gs.react=2;}}
  if(gs.sky>0){gs.sky-=dt;gs.tgt.hx=-0.5;gs.tgt.hy=gs.skyY;if(gs.sky<=0){gs.tgt.hx=0;gs.tgt.hy=0;}return;}
  if(gs.nod>0){gs.nod-=dt;gs.tgt.hx=gs.nod>0.3?0.32:0.04;if(gs.nod<=0)gs.tgt.hx=0;}
  if(d>9){gs.gz=null;gs.tgt.hy=0;return;}
  const ang=Math.atan2(-dx,-dz)-g.rotation.y,a=((ang+Math.PI)%TAU+TAU)%TAU-Math.PI,lim=gs.walk?1.3:1.8;
  let z=gs.gz;if(!z)z=gs.gz={on:false,t:0.2+Math.random()*0.9,away:0};
  z.t-=dt;if(z.t<=0){z.on=!z.on;z.t=z.on?2+Math.random()*2.5+(d<3?2:0):2.5+Math.random()*5;z.away=(Math.random()-0.5)*1.2;
    if(z.on&&o.data&&o.data.id&&state.seen&&state.seen['m:'+o.data.id]&&ui==='play'){const now=performance.now()/1000,k=o.data.id;if(!(GZ.nod[k]>now-90)){GZ.nod[k]=now;gs.nod=0.6;gzExpr(gs,'alegria',1.2);}}}
  gs.tgt.hy=z.on&&Math.abs(a)<lim?Math.max(-0.85,Math.min(0.85,a)):z.away*(d<4?0.5:1);}
function gzBrows(gs){if(gs.brows!==undefined)return gs.brows;gs.brows=null;if(!gs.head)return null;const F=faceSpots();if(F.bl==null||F.br==null||!F.mat)return null;let fm=null;for(const ch of gs.head.children)if(ch.isMesh&&ch.material===F.mat){fm=ch;break;}if(!fm)return null;
  const cA=fm.geometry.attributes.color;if(!cA)return null;const col=new THREE.Color(cA.getX(0),cA.getY(0),cA.getZ(0));
  let ng=GZ.bare.get(fm.geometry);if(!ng){ng=fm.geometry.clone();const P=ng.attributes.position,x0=P.getX(0),y0=P.getY(0),z0=P.getZ(0);for(let i=0;i<72&&i<P.count;i++)P.setXYZ(i,x0,y0,z0);GZ.bare.set(fm.geometry,ng);}fm.geometry=ng;
  const geo=GZ.bgeo||(GZ.bgeo=new THREE.BoxGeometry(0.038,0.009,0.016)),mt=lam('#'+col.getHexString());
  const mk=(x,z,rz)=>{const m=new THREE.Mesh(geo,mt);m.position.set(x+fm.position.x,1.874+fm.position.y,z-0.003+fm.position.z);m.rotation.z=rz;gs.head.add(m);return m;};
  gs.brows={l:mk(-0.034,F.bl,0.14),r:mk(0.034,F.br,-0.14),y0:1.874+fm.position.y,y:0,rz:0,dl:0};return gs.brows;}
function gzExpr(gs,k,dur){gzBrows(gs);gs.ex={k,t:dur};}
function gzTone(s){s=(s||'').toLowerCase();
  if(/maldit|ladr[oó]n|idiota|imb[eé]cil|fuera de aqu|basta ya|c[oó]mo te atreves|desvergonz|sinverg|canalla|bribón|traidor|indign|furios|rabia|insolen/.test(s))return'enfado';
  if(/muert|muri[oó]|murieron|llor|triste|desgracia|lament|\bpena\b|peste|luto|ay de|hambre|destierro|exilio|duelo|tumba|enterr/.test(s))return'tristeza';
  if(/¡(qu[eé]|c[oó]mo|por zeus|por h[eé]rcules|por los dioses|por j[uú]piter|ah|oh)\b|asombr|incre[ií]ble|maravill|prodigio|¿de verdad|¿en serio/.test(s))return'sorpresa';
  if(/gracias|me alegr|bienvenid|feliz|alegr|bien hecho|excelente|estupendo|ja,? ja/.test(s))return'alegria';
  if(/\?[»"\s]*$/.test(s))return'duda';return'neutral';}
function sfxPop(){if(!aOK()||!AUD.noise)return;const c=AUD.ctx,t=c.currentTime;[0,0.17].forEach(d=>{const s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=2200;f.Q.value=3;const e=c.createGain();e.gain.setValueAtTime(0.0001,t+d);e.gain.exponentialRampToValueAtTime(0.25,t+d+0.003);e.gain.exponentialRampToValueAtTime(0.0001,t+d+0.03);s.connect(f).connect(e).connect(AUD.master);s.start(t+d,Math.random());s.stop(t+d+0.05);});}
function gzBolt(){GZ.bolt=2.5;GZ.bid++;const P=player,now=performance.now()/1000;if(now-GZ.popT<150)return;const nr=g=>g&&g.visible&&Math.hypot(g.position.x-P.x,g.position.z-P.z)<20;
  if(!npcObjs.some(o=>!o.hidden&&nr(o.g))&&!walkers.some(w=>!w.home&&nr(w.g)))return;GZ.popT=now;
  setTimeout(()=>{try{if(!state||ui==='start')return;sfxPop();toast('<span class="label">Costumbre</span><br>'+(MODE==='roma'?'Al ver el relámpago, la gente chasquea la lengua. Plinio el Viejo lo da por costumbre de todos los pueblos: saludar los relámpagos con ese chasquido (<i>Historia natural</i> 28, 25).':'Al ver el relámpago, alguien chasquea la lengua: así se saluda al rayo de Zeus. En las <i>Avispas</i> de Aristófanes (v. 626), el viejo Filocleón presume de que, cuando él relampaguea como Zeus, los ricos chasquean la lengua.'));}catch(e){}},900);}
{const b0=wxBolt;wxBolt=function(){const r=b0.apply(this,arguments);try{gzBolt();}catch(e){}return r;};}
function gzWalk(dt){if(!state||ui==='start')return;const P=player,sp=Math.hypot(GF.vx,GF.vz),R=MOUNT.riding?1.6:1.05,rng=GZ.bolt>0?25:9;if(GZ.bolt>0)GZ.bolt-=dt;if(GZ.bumpT>0)GZ.bumpT-=dt;
  const react=gs=>{if(gs.react>0){gs.react-=dt;if(gs.react<=0)gsRest(gs);}};
  const bump=(gs)=>{state.bumps=(state.bumps||0)+1;gs.react=1.3;gsSet(gs,'encoge',0.7);gzExpr(gs,'enfado',1.6);if(GZ.bumpT<=0&&Math.random()<0.4){GZ.bumpT=25;{const L=GZ_BUMP[MODE==='roma'?'r':'a'];toast('<i>«'+L[Math.floor(Math.random()*L.length)]+'»</i>');};}};
  let n=0;for(const w of walkers){if(w.home||!w.g||!w.g.visible||w.pal)continue;const g=w.g,dx=g.position.x-P.x,dz=g.position.z-P.z;if(Math.abs(dx)>rng||Math.abs(dz)>rng)continue;const d=Math.hypot(dx,dz);if(d>rng)continue;if(++n>16)break;
    const gs=gsRig(g);GS.list.add(g);gs.walk=!!w.moving;
    if(d<R&&sp>1.6&&!(w.bump>0)&&ui==='play'){w.bump=0.5;bump(gs);const ux=dx/(d||1),uz=dz/(d||1),vx=GF.vx/sp,vz=GF.vz/sp,s=(ux*vz-uz*vx)>0?-1:1;w.dux=ux*0.5-vz*s*0.85;w.duz=uz*0.5+vx*s*0.85;}
    if(w.bump>0){w.bump-=dt;if(w.wait!==Infinity&&w.speed>0&&!w.sat){const L=Math.hypot(w.dux,w.duz)||1;if(npcStep(g,w.dux/L,w.duz/L,2.4*dt))g.position.y=terrainH(g.position.x,g.position.z);}}
    react(gs);gzLook(w,gs,dx,dz,d,dt);gsApply(g,gs,dt);}
  for(const o of npcObjs){if(o.hidden||!o.g||!o.g.visible||o.g===GS.dlgG)continue;const dx=o.g.position.x-P.x,dz=o.g.position.z-P.z;if(Math.abs(dx)>2||Math.abs(dz)>2)continue;const gs=o.g.userData.gs;if(!gs)continue;
    if(Math.hypot(dx,dz)<R&&sp>1.6&&!(o.bump>0)&&ui==='play'){o.bump=2;bump(gs);gsSet(gs,'espalda',1);gs.tgt.hx=-0.15;}if(o.bump>0)o.bump-=dt;react(gs);}}
{const t0=gsTick;gsTick=function(dt){t0(dt);try{gzWalk(dt);}catch(e){}};}
function gzFace(dt){const t=performance.now()/1000,dg=GS.dlgG,typing=typeof TW!=='undefined'&&TW.on;
  if(dg&&dg.userData.gs){const gs=dg.userData.gs;gzBrows(gs);GZ.tT-=dt;if(GZ.tT<=0){GZ.tT=0.3;const tx=($('dBody')&&$('dBody').innerText)||'';gs.tone=gzTone(tx.slice(-140));}
    const M=gs.mouth;if(M&&M.visible)M.scale.x=gs.tone==='alegria'?1.3:gs.tone==='tristeza'?0.8:1;}
  for(const g of GS.list){const gs=g.userData.gs;if(!gs||!gs.brows)continue;const B=gs.brows;let k='neutral';if(gs.ex&&gs.ex.t>0){gs.ex.t-=dt;k=gs.ex.k;}else if(g===dg)k=gs.tone||'neutral';
    const E=GZ_EX[k]||GZ_EX.neutral,q=Math.min(1,dt*8);let ty=E[0];if(g===dg&&typing)ty+=0.004*Math.pow(Math.max(0,Math.sin(t*2.3)),6);
    B.y+=(ty-B.y)*q;B.rz+=(E[1]-B.rz)*q;B.dl+=((k==='duda'?1:0)-B.dl)*q;
    B.l.position.y=B.y0+B.y+0.004*B.dl;B.r.position.y=B.y0+B.y-0.006*B.dl;B.l.rotation.z=0.14+B.rz;B.r.rotation.z=-0.14-B.rz;}}
{const f0=faceTick;faceTick=function(dt){f0(dt);try{gzFace(dt);}catch(e){}};}
// ============================================================ CUERPOS VARIADOS: niños, ancianos, gruesos y flacos; andares; posturas al esperar
// Demografía: en una población antigua (esperanza de vida al nacer de 20-30 años) cerca de un tercio de la gente tenía menos de 15 años y
// muy pocos pasaban de los 60 (B. Frier, «Roman Life Expectancy», 1982; W. Scheidel, Death on the Nile, 2001). En la calle, pues,
// muchos niños. Los ancianos andan encorvados y algunos con bastón (el «animal de tres pies» del enigma de la Esfinge).
// Solo los paseantes anónimos cambian de cuerpo; a los personajes con nombre solo se les da postura (y a los ancianos, la espalda curvada).
const BV={t:0,grey:null};
function bvParts(g){const s=new Set();g.traverse(o=>{if(o.userData&&o.userData.part)s.add(o.userData.part);});return s;}
function bvStick(g){const a=g.userData.arms&&g.userData.arms[1];if(!a)return;g.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(a),sy=g.scale.y||1,hy=(b.min.y-g.position.y)/sy;if(!(hy>0.4&&hy<1.2))return;
  const L=hy+0.08,m=new THREE.Mesh(BV.sg||(BV.sg=new THREE.CylinderGeometry(0.016,0.02,1,6)),M.wood);m.scale.y=L;m.position.set(0,hy-a.position.y-L/2+0.06,0.04);m.castShadow=true;m.userData.keep=1;a.add(m);}
function bvGrey(g){const hm=BV.grey||(BV.grey=[personMat('#a19c94','hair'),lam('#b3aea6')]);g.traverse(o=>{const p=o.userData&&o.userData.part;if(!p)return;if(/^P_hair/.test(p))o.traverse(m=>{if(m.isMesh)m.material=hm[0];});if(p==='P_beard')o.traverse(m=>{if(m.isMesh)m.material=hm[1];});});}
function bvGreyHair(g){let grey=false;g.traverse(o=>{if(!grey&&o.isMesh&&o.parent&&o.parent.userData.part&&/^P_hair/.test(o.parent.userData.part)||(!grey&&o.isMesh&&o.userData.part&&/^P_hair/.test(o.userData.part))){const h={};o.material.color.getHSL(h);if(h.s<0.2&&h.l>0.3)grey=true;}});return grey;}
function bvWall(g){const a=g.rotation.y,x=g.position.x-Math.sin(a)*0.6,z=g.position.z-Math.cos(a)*0.6;try{return !isFree(x,z,0.12)&&isFree(g.position.x,g.position.z,0.25);}catch(e){return false;}}
function bvPost(g,P){if(g.userData.pose)return null;if(P.has('P_hydria')||P.has('P_amphora')||P.has('P_basket')||P.has('P_spear')||P.has('P_scutum')||P.has('P_staff'))return 'peso';if(bvWall(g))return 'apoyado';const r=Math.random();return r<0.25?'cruzados':r<0.47?'espalda':r<0.8?'peso':null;}
function bvWalker(w){const g=w.g,u=g.userData;w.bv=1;if(!GLB.ok||!g)return;g.rotation.order='YXZ';const P=bvParts(g),moving=w.speed>0,r=Math.random(),r2=Math.random();
  const kidOK=moving&&!P.has('P_beard')&&!P.has('P_hydria')&&!P.has('P_amphora')&&!P.has('P_spear')&&!P.has('P_scutum')&&!P.has('P_galea')&&!w.barks&&!bvGreyHair(g);
  if(kidOK&&r<0.4){const s=0.6+Math.random()*0.16;g.scale.set(s,s,s);u.bt='niño';w.speed*=1.15;w.sf=1.5;if(Math.random()<0.35){u.bt='niño que corre';w.speed*=1.6;u.legAmp=0.62;u.lean=0.06;}}
  else if(r2<0.1){u.bt='anciano';u.stoop=0.1+Math.random()*0.06;u.legAmp=0.26;w.sf=1.3;if(moving)w.speed*=0.6;bvGrey(g);if(!P.has('P_staff')&&Math.random()<0.55)bvStick(g);}
  else{const q=Math.random();if(q<0.14){g.scale.x*=1.16;g.scale.z*=1.16;u.bt='grueso';if(moving)w.speed*=0.88;}else if(q<0.26){g.scale.x*=0.88;g.scale.z*=0.88;u.bt='flaco';}
    if(moving){const k=Math.random();if(P.has('P_hydria')||P.has('P_amphora')){u.gait='carga';w.speed*=0.85;u.lean=0.04;w.sf=1.1;}
      else if(k<0.15){u.gait='prisa';w.speed*=1.35;u.legAmp=0.52;u.lean=0.05;w.sf=0.95;}else if(k<0.27){u.gait='cansado';w.speed*=0.75;u.stoop=0.04;u.legAmp=0.3;}else if(k<0.33){u.gait='cojea';w.speed*=0.7;u.limp=1;}}}
  u.post=bvPost(g,P);if(u.stoop)g.rotation.x=u.stoop;try{stWalker(w,g,P);}catch(e){}}
function bvNpc(o){const g=o.g,u=g.userData;o.bv=1;if(!GLB.ok||!g)return;g.rotation.order='YXZ';const P=bvParts(g),d=o.data||{},tt=((d.title||'')+' '+(d.name||'')).toLowerCase();
  if(/ancian|viej[oa]\b|\bvieja|\bviejo|senex|geronte/.test(tt)){u.stoop=0.08;g.rotation.x=0.08;}u.post=bvPost(g,P);try{stNpc(o,g,P,tt);}catch(e){}}
{const pg=pjGreet;pjGreet=function(n,first){let r=pg(n,first);try{r+=memGreet(n,first);}catch(e){}return r;};}
{const pw=personWalk;personWalk=function(g,ph,amp){pw(g,ph,amp);const u=g.userData;if(u.stoop===undefined&&u.lean===undefined&&!u.limp)return;
  g.rotation.x=(u.stoop||0)+(u.lean||0)*amp;if(u.limp&&u.legs){u.legs[0].rotation.x*=0.45;const s=Math.sin(ph);g.rotation.z=(s>0?0.075:0.015)*s*amp;}};}
{const r0=gsRig;gsRig=function(g){const had=g.userData.gs,gs=r0(g);if(!had){gs.g=g;if(g.userData.post==='cruzados'||g.userData.post==='espalda'||g.userData.post==='apoyado')gsRest(gs);}return gs;};}
Object.assign(GSET,{cruzados:[-0.42,-0.28,-0.42,-0.28,0.04,0,-1.75,-1.6]});
{const r0=gsRest;gsRest=function(gs){r0(gs);const g=gs.g,p=g&&g.userData.post;if(!p||g===GS.dlgG)return;if(p==='cruzados')gsSet(gs,'cruzados',1,true);else if(p==='espalda'||p==='apoyado')gsSet(gs,'espalda',1,true);};}
function bvTick(dt){if(!state||ui==='start')return;BV.t-=dt;if(BV.t<=0){BV.t=1.5;let n=0;const t0=performance.now();for(const w of walkers)if(w.bv===undefined&&w.g){bvWalker(w);if(++n>90)break;}for(const o of npcObjs)if(o.bv===undefined&&o.g){bvNpc(o);if(++n>120)break;}BV.ms=performance.now()-t0;if(n)BV.t=0.25;}
  const P=player,t=performance.now()/1000;
  // brazos cruzados de verdad: los antebrazos giran hacia dentro, por delante del pecho
  for(const g of GS.list){const gs=g.userData.gs;if(!gs||!gs.fore||!g.visible)continue;const on=Math.abs((gs.tgt.rf||0)-GSET.cruzados[7])<0.01&&Math.abs((gs.tgt.lf||0)-GSET.cruzados[6])<0.01,k=Math.min(1,dt*5);
    for(let i=0;i<2;i++){const f=gs.fore[i];if(!f)continue;const tg=on?-(gs.side?gs.side[i]:(i?1:-1))*0.95:0;f.rotation.z+=(tg-f.rotation.z)*k;}}
  for(const g of GS.list){const u=g.userData,p=u.post;if(!p||!g.visible||u.pose||u.sitting)continue;const dx=g.position.x-P.x,dz=g.position.z-P.z;if(dx*dx+dz*dz>400)continue;
    const mv=u._px!==undefined&&Math.abs(g.position.x-u._px)+Math.abs(g.position.z-u._pz)>0.003;u._px=g.position.x;u._pz=g.position.z;if(mv){u._st=0;continue;}u._st=(u._st||0)+dt;if(u._st<0.6)continue;
    const k=Math.min(1,dt*3),ph=(u.gs&&u.gs.t)||0;
    if(p==='peso'){g.rotation.z+=((0.03+0.012*Math.sin(t*0.45+ph))-g.rotation.z)*k;if(u.legs)u.legs[1].rotation.x+=(-0.13-u.legs[1].rotation.x)*k;}
    else if(p==='apoyado')g.rotation.x+=((u.stoop||0)-0.07-g.rotation.x)*k;}}
