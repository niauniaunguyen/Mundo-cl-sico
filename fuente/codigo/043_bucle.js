// ============================================================ bucle
function resize(){const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
window.addEventListener('resize',resize);

function tryMove(nx,nz){
  if(RF.ok&&!BOAT.on&&(RF.onRoof||player.feet>floorAt(player.x,player.z)+2.6))return rfMove(nx,nz);   // por los tejados
  const p={x:nx,z:nz};resolve(p,0.35);
  if(p.x<8000){p.x=clamp(p.x,INNER.x-INNER.size/2+20,INNER.x+INNER.size/2-20);p.z=clamp(p.z,INNER.z-INNER.size/2+20,INNER.z+INNER.size/2-20);}
  else sqClamp(p);   // destinos: el cuadrado de su escenario (antes, 1,38·R)
  const hN=floorAt(p.x,p.z);
  if(hN-player.feet>0.65){const tN0=terrainH(p.x,p.z);if(MOUNT.riding||hN>tN0+0.01||hN-player.feet>2.2||inCavea(p.x,p.z))return false;   // un escalón de edificio no se sube; un risco del terreno, sí: trepando despacio
    const q=clbSlow(p.x,p.z,4,1.15);if(!q)return false;p.x=q[0];p.z=q[1];player.feet=Math.min(floorAt(p.x,p.z),player.feet+0.12);}
  if(player.feet-hN>2.5&&CAVEAS.some(C=>caveaH(C,player.x,player.z)!==null)&&!CAVEAS.some(C=>caveaH(C,p.x,p.z)!==null))return false;   // desde lo alto de las gradas no se salta al vacío
  if(MODE==='roma'&&hN<-1.2&&!FLY.on)return false;   // el Tíber no se cruza a pie: hay que buscar un puente (volando, sí)
  const d=Math.hypot(p.x-player.x,p.z-player.z);
  if(d>1e-5&&!inCavea(p.x,p.z)){const tN=terrainH(p.x,p.z),tC=terrainH(player.x,player.z),lim=qLv('ar')>=8?2.2:1.15,k=(tN-tC)/d;if(hN<=tN+0.01&&k>lim&&tN>player.feet-0.05){const q=clbSlow(p.x,p.z,k,lim);if(!q)return false;p.x=q[0];p.z=q[1];}}
  if(hN<-1.2)return false;
  player.x=p.x;player.z=p.z;return true;
}
let last=performance.now(),zt=0,ft=0,ct=0,skyT=0,cullT=1,mt=0;
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min(0.05,(now-last)/1000)*(window.__spd||1);last=now;   /* __spd: velocidad del juego (223: jugar solo ×2) */const t=now/1000;
  if(ui==='sea'){seaTick(dt);return;}
  crossT+=dt;if(crossT>0.1){crossT=0;placeCross();}   // el punto de mira vuelve al centro (y el cursor reaparece) fuera del juego
  if(ui!=='start'){if(ui==='episode')clock.h=(clock.h+dt*clock.speed)%24;else addHours(dt*clock.speed);skyT+=dt;if(skyT>0.25){skyT=0;updateSky();}}
  if(ui==='play'&&BOAT.on)boatTick(dt);
  else if(ui==='play'){
    let f=(keys.w?1:0)-(keys.s?1:0)-joy.y,s=(keys.d?1:0)-(keys.a?1:0)+joy.x;const L=Math.hypot(f,s);if(L>1){f/=L;s/=L;}
    const sp=(FLY.on?(keys.run?30:15)*(typeof PEGR!=='undefined'&&PEGR.on?2.2:1):(keys.run?11:4.8)*v2Spd()*(MOUNT.riding?3*horseMul()*(1+RW.dash):1+0.02*(qLv('ar')-1)))*dt;const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw);
    const wk=inWaterK(),idt=1/Math.max(dt,1e-4),gv=gfVel((fx*f+rx*s)*sp*wk*idt,(fz*f+rz*s)*sp*wk*idt,dt,L>0.01),mx=gv[0]*dt,mz=gv[1]*dt;   // inercia (game feel)
    const mv=FLY.on?flyMove:tryMove;if(Math.hypot(mx,mz)>1e-5){if(!mv(player.x+mx,player.z+mz)){const a=mv(player.x+mx,player.z),b=a||mv(player.x,player.z+mz);gfBlock(a,b);}}
  }
  const fl=BOAT.on?BOAT.y:rfFloor(player.x,player.z,player.feet);RF.onRoof=!BOAT.on&&RF.ok&&fl>floorAt(player.x,player.z)+0.5;
  if(FLY.on&&ui!=='play')FLY.on=false;
  if(FLY.on)player.vy+=((keys.jump?7:(keys.down?-9:-0.8))-player.vy)*Math.min(1,dt*3.5);else player.vy-=16*dt;player.feet+=player.vy*dt;
  if(FLY.on){const wv=riverWater(player.x,player.z);if(wv!==null&&player.feet<wv+0.4){player.feet=wv+0.4;if(player.vy<0)player.vy=0;}}   // volando, se roza el agua sin hundirse
  if(player.feet<=fl){const was=player.grounded;if(!player.grounded&&player.vy<-5)gfLand(-player.vy);player.feet=fl;player.vy=0;player.grounded=true;player.jumps=0;player.lastG=performance.now();if(!was&&player.jbuf&&player.lastG-player.jbuf<150&&ui==='play'){player.jbuf=0;jump();}}
  else if(player.grounded&&player.feet-fl<0.6&&player.vy<=0){player.feet=fl;player.vy=0;player.lastG=performance.now();}
  else player.grounded=false;
  updateMount(dt);
  const targetY=player.feet+player.eye+(MOUNT.riding?Math.abs(Math.sin(MOUNT.ph))*Math.min(0.07,MOUNT.v*0.004):0);player.camY=player.camY&&Math.abs(player.camY-targetY)<3?lerp(player.camY,targetY,1-Math.exp(-dt*18)):targetY;{const gC=floorAt(player.x,player.z)+0.3;if(player.camY<gC)player.camY=gC;}   /* tras un salto grande la cámara va directa a su sitio y nunca queda bajo tierra */
  if(freeAim()&&mouseIn){const ex=lastMX/innerWidth;if(ex<0.05)player.yaw+=dt*1.8*(1-ex/0.05);else if(ex>0.95)player.yaw-=dt*1.8*((ex-0.95)/0.05);}
  updateAvatar(dt,t);placeCamera();
  updateTorch(dt,t);
  sun.position.set(player.x+LIGHTDIR.x*250,player.camY+LIGHTDIR.y*250,player.z+LIGHTDIR.z*250);skyMesh.position.copy(camera.position);STARS.position.copy(camera.position);sun.target.position.set(player.x,player.camY,player.z);
  if(ui==='episode')epiTick(dt,t);
  updateSpheres(dt,t);updatePlumes(t);if(MODE==='atenas')updateKnossos(dt,t);

  // personajes
  for(const n of npcObjs){const d=Math.hypot(n.x-player.x,n.z-player.z);n.lb.visible=d<14&&d>3.2;   // de muy cerca el cartel taparía media pantalla; ya lo dice el aviso «Hablar con…»

    if(d<6&&!n.noTurn){const ta=Math.atan2(player.x-n.x,player.z-n.z);n.g.rotation.y+=wrapA(ta-n.g.rotation.y)*Math.min(1,dt*4);}
    n.mk.position.y=2.95+Math.sin(t*2+n.x)*0.08;n.g.children[1].rotation.z=Math.sin(t*1.3+n.x)*0.02;}
  for(const s of signObjs){if(s.mk.visible){s.mk.rotation.y=t*1.5;s.mk.position.y=2.6+Math.sin(t*2+s.x)*0.1;}}
  for(const I of ISLANDS)if(I.mesh)I.mesh.visible=Math.abs(player.x-I.x)<2200;
  if(SEA){SEA.position.x=Math.round(player.x/500)*500;SEA.position.z=Math.round(player.z/500)*500;}
  for(const sh of SHIPS){sh.g.position.y=-2.2+Math.sin(t*0.8+sh.ph)*0.15;sh.g.rotation.z=Math.sin(t*0.6+sh.ph)*0.025;}
  for(const c of captains){const d=Math.hypot(c.x-player.x,c.z-player.z);c.lb.visible=d<14;}
  for(const r of reliefObjs)if(r.mk.visible){r.mk.rotation.y=t*1.2;}
  if(DAYF<0.75)for(const tc of TORCHES){const f=1+Math.sin(t*9+tc.ph)*0.08+Math.sin(t*23+tc.ph*2)*0.05;tc.s.scale.set(1.4*f,1.8*f,1);}
  audioTick(dt);
  updateGods(dt,t);
  // a más de 180 m una persona ocupa apenas unos píxeles: no se dibuja
  stepsTick(dt);evTick(dt);gatesTick(dt);storyTick(dt);netTick(dt);horseTick(dt);wingsTick(dt);qualTick();tutTick(dt);convTick(dt);seasonTick(dt);fxTick(dt);cultTick();fastosTick();vuTick(dt);ofTick(dt,performance.now()/1000);mktTick();egxTick();vidaTick(dt);gfTick(dt);arisTick();faunaTick(dt);
  cullT+=dt;if(cullT>0.3){cullT=0;for(const w of walkers){const d=Math.hypot(w.g.position.x-player.x,w.g.position.z-player.z),I=typeof IMP!=='undefined'&&IMP.on;w.imp=I&&!w.home&&!w.occ&&d>=IMP.D&&d<IMP.F;w.g.visible=!w.home&&!(I&&w.occ&&d>IMP.OC)&&d<(I?IMP.D:150);}   // 259: de lejos, figura plana; detrás de un muro, nada
    for(const n of npcObjs)n.g.visible=!n.hidden&&Math.hypot(n.x-player.x,n.z-player.z)<150;
    for(const c of CHUNKS){const d=Math.hypot(c.x-player.x,c.z-player.z);c.im.visible=d<c.far&&d>=c.near;}}
  updatePerformance(dt,t);
  if(MODE==='atenas'&&ROMA.theatres.length)updateRomaTheatre(dt,t);
  updateSocial(dt,t);
  if(MODE==='roma')updateRome(dt,t);
  // paseantes
  for(const w of walkers){const g=w.g;if(w.home)continue;
    if(w.wait>0){w.wait-=dt;if(w.moving){w.moving=false;personWalk(g,0,0);}continue;}
    let dx=w.tx-g.position.x,dz=w.tz-g.position.z,d=Math.hypot(dx,dz);
    if(d<0.5){if(w.mode==='agora'){const b=w.box||[AG.x-30,AG.x+90,AG.z-70,AG.z+45];for(let k=0;k<8;k++){w.tx=rr(b[0],b[1]);w.tz=rr(b[2],b[3]);if(isFree(w.tx,w.tz,0.6))break;}w.wait=R()<0.4?rr(1,6):0;}
      else{const rd=g.userData.road;let sI=g.userData.seg+(g.userData.dir>0?1:0);if(sI<=0||sI>=rd.pts.length-1){g.userData.dir*=-1;}g.userData.seg=clamp(g.userData.seg+(g.userData.dir>0?1:-1),0,rd.pts.length-2);const tp=rd.pts[g.userData.dir>0?g.userData.seg+1:g.userData.seg];const off=(g.userData.dir>0?1:-1)*1.6;w.tx=tp[0]+off;w.tz=tp[1]+off;}
      continue;}
    const pd=Math.hypot(player.x-g.position.x,player.z-g.position.z);if(pd<1.4)continue;
    const st=Math.min(d,w.speed*dt);
    if(!npcStep(g,dx/d,dz/d,st)){w.blk=(w.blk||0)+dt;if(w.blk>1.5){w.blk=0;if(w.mode==='agora'){const b=w.box||[AG.x-30,AG.x+90,AG.z-70,AG.z+45];for(let k=0;k<8;k++){w.tx=rr(b[0],b[1]);w.tz=rr(b[2],b[3]);if(isFree(w.tx,w.tz,0.6))break;}}else{w.wait=rr(0.5,2);if(R()<0.5&&g.userData.dir!==undefined)g.userData.dir*=-1;}}continue;}
    w.blk=0;w.moving=true;w.ph=(w.ph===undefined?w.phase:w.ph)+st*4.6*(w.sf||1);g.position.y=terrainH(g.position.x,g.position.z)+Math.abs(Math.sin(w.ph))*0.045;
    const ta=Math.atan2(dx,dz);g.rotation.y+=wrapA(ta-g.rotation.y)*Math.min(1,dt*5);
    personWalk(g,w.ph,1);}

  if(ui==='play'){
    ft+=dt;if(ft>0.1){ft=0;focus=findFocus();const p=$('prompt');
      if(focus){const lab=focus.kind==='npc'?'Hablar con '+focus.data.name:focus.kind==='god'?'Hablar con '+focus.data.name:focus.kind==='sign'?'Leer: '+focus.data.name:focus.kind==='relief'?'Observar: '+focus.data.name:focus.kind==='sphere'?'Tocar la esfera: '+focus.data.name:focus.kind==='captain'?'Hablar con '+focus.data.name+', '+focus.data.role:(focus.kind==='story'||focus.kind==='daedalo'||focus.kind==='fest')?'Hablar con '+focus.data.name:focus.kind==='carro'?'Hablar con '+focus.data.name+', el carretero':(focus.kind==='musa'||focus.kind==='mnemo'||focus.kind==='zeus')?'Hablar con '+focus.data.name:focus.kind==='olygate'?'Examinar el sendero del Olimpo':focus.kind==='casaAgente'||focus.kind==='tour'||focus.kind==='barcoW'||(focus.kind==='luna'&&focus.act==='npc')?'Hablar con '+focus.data.name:focus.kind==='barcoMat'?'Examinar: '+focus.data.name:focus.kind==='barca'?'Subir a la barca':focus.kind==='fauna'?'Observar: '+focus.data.name:focus.kind==='barcoMio'?(barcoOwn()?'Subir al «'+barcoName()+'»':'Mirar el amarre'):focus.kind==='luna'?focus.data.name:focus.kind==='casaPuerta'?(cz().st>=3?'Entrar en tu casa':'Mirar la puerta'):focus.kind==='culto'?'Usar: '+focus.data.name:focus.kind==='egx'?focus.data.name:focus.kind==='hogar'?(focus.act==='salir'?'Salir a la calle':'Usar: '+focus.data.name):focus.kind==='olyback'?'Bajar del Olimpo':'Escuchar';p.innerHTML='<kbd>'+(isTouch?'Hablar':'E')+'</kbd>'+lab;p.hidden=false;}
      else if(horseNear()){p.innerHTML='<kbd>E</kbd>Montar el caballo';p.hidden=false;}
      else p.hidden=true;}
    zt+=dt;if(zt>0.5){zt=0;checkZone();checkGodQuests();}
    ct+=dt;if(ct>0.05){ct=0;drawCompass();}
    mt+=dt;if(mt>0.1){mt=0;drawMini();}
  }else $('prompt').hidden=true;
  if(!(typeof gfxRender==='function'&&gfxRender()))renderer.render(scene,camera);
}

// ============================================================ arranque
