// ============================================================ PLUMAS DE ÍCARO GUARDADAS (vídeo 23/11, opción 2: «criaturas que las protegen»)
// Cada una de las siete plumas está ahora junto al nido de una gaviota patiamarilla, que no te deja acercarte: abre las alas, grazna y
// te aparta (sin hacerte daño). Para cogerla hay que distraerla: con E, cerca de ella, le echas un pescadito seco de la cesta de Dédalo;
// mientras se lo come (unos 12 s), puedes coger la pluma. Si tardas, vuelve al nido.
// Que las gaviotas guarden las plumas es invención del juego. Lo que sí cuenta Ovidio (Metamorfosis VIII 189-195) es que Dédalo
// ordenó plumas de menor a mayor, las cosió con hilo por en medio y las pegó con cera por abajo, y que Ícaro jugaba con las que el viento
// se llevaba. Las gaviotas comen sobre todo peces: por eso el pescado.
const PLG={g:[],tip:0,fedN:0,R:2.7,FED:12};
function plgMake(f){const g=new THREE.Group();let M=null;try{M=typeof avnModel==='function'?avnModel('gaviota',null):null;}catch(e){}
  if(M){M.g.scale.setScalar(1.7);g.add(M.g);}else{const b=new THREE.Mesh(new THREE.SphereGeometry(0.22,10,8),lam('#e8e6e0'));b.scale.set(1,0.8,1.6);b.position.y=0.25;g.add(b);}
  const nest=new THREE.Mesh(new THREE.TorusGeometry(0.32,0.11,6,14),lam('#7a6a4a'));nest.rotation.x=Math.PI/2;nest.position.y=0.06;
  const a=(f.i*1.7)%TAU,hx=f.x+Math.cos(a)*1.1,hz=f.z+Math.sin(a)*1.1;g.position.set(hx,KNOS.y,hz);g.userData.noSeal=1;scene.add(g);nest.position.set(f.x,KNOS.y+0.06,f.z);scene.add(nest);
  return {f,g,M,home:[hx,hz],nest,fed:0,ang:0,flap:0};}
// las plumas se colocaban antes de que existiera el suelo del sueño, y todas acababan en fila, a 3 m unas de otras (vídeo 23/11:
// «que no estuvieran en línea recta»): se vuelven a repartir por el palacio cuando el suelo ya está
const PLG_SPOTS=[[0,8],[-6,44],[-32,60],[45,-40],[-45,-30],[-10,-40],[60,70]];
function plgSpread(){const Y=KNOS.y,used=[];let n=0;for(const f of FEATHERS){const s=PLG_SPOTS[f.i%PLG_SPOTS.length];let best=null;
  for(let r=0;r<=12&&!best;r+=2)for(let a=0;a<8&&!best;a++){const x=KNOS.x+s[0]+Math.cos(a*0.785)*r,z=KNOS.z+s[1]+Math.sin(a*0.785)*r;const q=[x,z];
    if(Math.abs(floorAt(q[0],q[1])-Y)<1&&!used.some(u=>Math.hypot(u[0]-q[0],u[1]-q[1])<8))best=q;}
  if(best){f.x=best[0];f.z=best[1];f.sp.position.x=f.x;f.sp.position.z=f.z;n++;}used.push([f.x,f.z]);}return n;}
function plgBuild(){if(PLG.g.length||!FEATHERS.length||typeof KNOS==='undefined')return;for(const f of FEATHERS)PLG.g.push(plgMake(f));}
function plgNear(){const P=player;let best=null,bd=4.2;for(const G of PLG.g){if(!G.f.sp.visible)continue;const d=Math.hypot(G.g.position.x-P.x,G.g.position.z-P.z);if(d<bd){bd=d;best=G;}}return best;}
function plgFeed(){const G=plgNear();if(!G)return false;if(G.fed>0)return true;G.fed=PLG.FED;PLG.fedN++;try{sfxCoin();}catch(e){}
  // se aparta un poco del nido, hacia donde cae el pescado
  const P=player,dx=G.g.position.x-P.x,dz=G.g.position.z-P.z,d=Math.hypot(dx,dz)||1;G.eat=[G.f.x+dx/d*3.2,G.f.z+dz/d*3.2];
  toast('<span class="label">La gaviota se distrae</span><br>Le echas un pescadito seco de la cesta de Dédalo y se lanza a por él. ¡Coge la pluma antes de que vuelva!');return true;}
function plgTick(dt){const w=wz();
  if(!PLG.spread&&FEATHERS.length&&Math.abs(player.feet-KNOS.y)<30){PLG.st=(PLG.st||0)-dt;if(PLG.st<=0){PLG.st=1;if(plgSpread()===FEATHERS.length){PLG.spread=1;for(const G of PLG.g){scene.remove(G.g);scene.remove(G.nest);}PLG.g.length=0;}}}
  if(!PLG.g.length){if(FEATHERS.length)plgBuild();return;}const on=w.q==='on',P=player,t=performance.now()/1000;
  for(const G of PLG.g){const vis=on&&G.f.sp.visible;G.g.visible=vis||(!G.f.sp.visible&&w.q==='on');G.nest.visible=G.g.visible;if(!G.g.visible)continue;
    if(G.M&&!G.M.g.parent){}   // (el modelo ya está en su grupo)
    let tx=G.home[0],tz=G.home[1];if(G.fed>0){G.fed-=dt;if(G.eat){tx=G.eat[0];tz=G.eat[1];}if(G.fed<=0)G.eat=null;}
    const dx=tx-G.g.position.x,dz=tz-G.g.position.z,dd=Math.hypot(dx,dz);if(dd>0.05){const s=Math.min(dd,dt*3);G.g.position.x+=dx/dd*s;G.g.position.z+=dz/dd*s;G.g.rotation.y=Math.atan2(dx,dz);}
    // guardiana: si no come, no deja acercarse a la pluma
    const pd=Math.hypot(P.x-G.f.x,P.z-G.f.z);let guard=false;
    if(vis&&G.fed<=0&&pd<PLG.R&&Math.abs(P.feet-KNOS.y)<4){guard=true;const k=PLG.R/(pd||0.01);P.x=G.f.x+(P.x-G.f.x)*k;P.z=G.f.z+(P.z-G.f.z)*k;G.g.rotation.y=Math.atan2(P.x-G.g.position.x,P.z-G.g.position.z);
      if(t-PLG.tip>5){PLG.tip=t;toast('<span class="label">Una gaviota guarda la pluma</span><br>Abre las alas y grazna: no te deja acercarte a su nido. Pulsa <b>E</b> junto a ella para echarle un pescado y distraerla.');}}
    if(G.M&&G.M.W.I&&G.M.W.D){const fl=guard?Math.sin(t*14)*0.9:G.fed>0?0:Math.max(0,Math.sin(t*0.7+G.f.i))*0.15;G.M.W.I.rotation.z=-fl;G.M.W.D.rotation.z=fl;
      const h=G.M.g.children.find(o=>/_cabeza$/.test(o.name));if(h)h.rotation.x=G.fed>0&&dd<0.2?Math.max(0,Math.sin(t*6))*0.6:0;}
    G.g.position.y=KNOS.y+(guard?0.15+Math.abs(Math.sin(t*7))*0.12:0);}}
{const f=wingsTick;wingsTick=function(dt){try{plgTick(dt);}catch(e){if(!PLG.err){PLG.err=String(e).slice(0,200);console.warn('plumas',e);}}return f.apply(this,arguments);};}
{const f=buildDaedalus;buildDaedalus=function(){const r=f.apply(this,arguments);try{PLG.g.length=0;PLG.spread=0;}catch(e){}return r;};}
// E junto a una gaviota: echarle el pescado (antes que cualquier otra acción de E)
addEventListener('keydown',e=>{if(e.code!=='KeyE'||e.repeat||typeof ui==='undefined'||ui!=='play'||!PLG.g.length)return;try{if(wz().q!=='on')return;if(plgFeed()){e.stopImmediatePropagation();e.preventDefault();}}catch(er){}},true);
// en el móvil, el botón de hablar (tTalk) hace lo mismo junto a una gaviota
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#tTalk');if(!b||typeof ui==='undefined'||ui!=='play'||!PLG.g.length)return;try{if(wz().q==='on'&&plgFeed()){e.stopImmediatePropagation();e.preventDefault();}}catch(er){}},true);
