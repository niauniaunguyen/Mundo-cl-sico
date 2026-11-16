// ============================================================ JUEGO MÁS DINÁMICO (1): aguante, trepar, saltar a caballo y perseguir al ladrón
// D1. Aguante: correr cansa; andar o pararse lo recupera, y beber en una fuente mucho más deprisa. Con más Areté/Virtus, más aguante.
// D2. Trepar: ante un podio, una terraza o un escalón alto (0,65-2,4 m) con sitio arriba, «E · Trepar».
// D8. A caballo, ante un murete, la barra espaciadora lo salta (la E desmonta).
// D3. Si te roban (de noche, o un carterista en el mercado), el ladrón huye corriendo: alcánzalo antes de que se pierda.
const AGL={st:1,ex:false,bar:null,drank:0};
function agMax(){return 9+0.9*Math.min(10,qLv(MODE==='roma'?'ar':'ar'));}   // segundos de carrera seguida
function agFountain(){const x=player.x,z=player.z;try{for(const a of ATR.values())for(const o of a)if((o.k==='lacus'||o.k==='spring')&&Math.hypot(o.x-x,o.z-z)<5)return true;}catch(e){}
  try{for(const p of PLACES)if(/Fuente|fuente|Krene|Lacus/.test(p.name)&&Math.hypot(p.x-x,p.z-z)<6)return true;}catch(e){}return false;}
function agTick(dt){if(!state||ui!=='play')return;const moving=Math.hypot(GF.vx||0,GF.vz||0)>5.5,riding=MOUNT.riding||FLY.on||BOAT.on;
  if(!riding&&keys.run&&moving&&!AGL.ex){AGL.st-=dt/agMax();if(AGL.st<=0){AGL.st=0;AGL.ex=true;toast('<span class="label">Sin aliento</span><br>Te paras a recuperar el resuello. Anda un poco, o bebe en una fuente.');}}
  else{let k=moving?1/8:1/5;if(agFountain()){k*=4;if(AGL.st<0.95&&performance.now()-AGL.drank>60000){AGL.drank=performance.now();toast('<span class="label">Agua fresca</span><br>Bebes en la fuente y recuperas el aliento.');}}AGL.st=Math.min(1,AGL.st+dt*k);if(AGL.ex&&AGL.st>0.5)AGL.ex=false;}
  let b=AGL.bar;if(!b){b=AGL.bar=document.createElement('div');b.id='agBar';b.style.cssText='position:fixed;left:50%;bottom:74px;transform:translateX(-50%);width:160px;height:5px;border-radius:3px;background:rgba(20,14,10,.55);pointer-events:none;z-index:9;transition:opacity .4s';b.innerHTML='<i style="display:block;height:100%;border-radius:3px;background:#e0b070;width:100%"></i>';document.body.appendChild(b);}
  b.style.opacity=AGL.st<0.995?'1':'0';b.firstChild.style.width=Math.round(AGL.st*100)+'%';b.firstChild.style.background=AGL.ex?'#b0563a':'#e0b070';}
// sin aliento no se corre (la velocidad de carrera vuelve a la de andar)
{const f=v2Spd;v2Spd=function(){const v=f.apply(this,arguments);return AGL.ex&&keys.run&&!MOUNT.riding&&!FLY.on?v*4.8/11:v;};}
// ---------------------------------------------------------------- D2. trepar
function clProbe(){const P=player,fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),f0=P.feet;if(vtShift(P.x+fx*0.55,P.z+fz*0.55)>0.08)return null;   // una pared: eso es para saltar, no para trepar
  const h1=floorAt(P.x+fx*0.7,P.z+fz*0.7)-f0;if(!(h1>0.65&&h1<=2.4))return null;const h2=floorAt(P.x+fx*1.4,P.z+fz*1.4)-f0;if(Math.abs(h2-h1)>0.35)return null;   // arriba hay suelo llano
  const lx=P.x+fx*1.4,lz=P.z+fz*1.4;if(vtShift(lx,lz)>0.05)return null;if(vtHit(P.x,f0+h1+1.6,P.z,fx,0,fz,1.6))return null;   // y sitio para ponerse de pie
  return{lx,lz,top:f0+h1,fL:f0+h2,H:h1,climb:true};}
{const f=vtProbe;vtProbe=function(){const r=f();if(r)return r;try{return clProbe();}catch(e){return null;}};}
// el aviso dice «Trepar» cuando es trepar, y a caballo «Espacio · Saltar con el caballo»
{const f=vtTick;vtTick=function(dt){
  if(!VT.on&&MOUNT.riding&&ui==='play'&&!FLY.on){VT.pt=(VT.pt||0)-dt;if(VT.pt<=0){VT.pt=0.12;const g=player.grounded;player.grounded=true;try{VT.can=vtProbe();}catch(e){VT.can=null;}player.grounded=g;if(VT.can&&VT.can.climb)VT.can=null;}
    const p=$('prompt');if(VT.can&&p){p.innerHTML='<kbd>Espacio</kbd>Saltar con el caballo';p.hidden=false;}return;}
  f(dt);try{const p=$('prompt');if(VT.can&&VT.can.climb&&!focus&&p&&!p.hidden)p.innerHTML='<kbd>E</kbd>Trepar';}catch(e){}};}
{const f=jump;jump=function(){if(MOUNT.riding&&VT.can&&!VT.on&&ui==='play'){vtGo();return;}return f.apply(this,arguments);};}
// ---------------------------------------------------------------- D3. el ladrón que huye
const THF={on:null};
function thfSpawn(n,why){if(THF.on)return;const P=player,a=P.yaw+Math.PI+(Math.random()-0.5)*1.2;const g=makePerson({noVary:true,short:true,chiton:'#3a3028',hair:'#2a2018',himation:'#2a221c'});
  const x=P.x-Math.sin(a)*-2,z=P.z-Math.cos(a)*-2;g.position.set(x,floorAt(x,z),z);scene.add(g);THF.on={g,x,z,a:a+Math.PI,n,t:0,why};
  toast('<span class="label">¡Al ladrón!</span><br>'+why+' Corre tras él: si lo alcanzas, recuperas lo tuyo.');try{mtBeacon(x,z);}catch(e){}}
function thfTick(dt){const T=THF.on;if(!T)return;if(ui!=='play')return;T.t+=dt;const P=player,dx=T.x-P.x,dz=T.z-P.z,d=Math.hypot(dx,dz);
  // huye en dirección contraria al jugador, zigzagueando; si choca, gira
  const want=Math.atan2(dx,dz)+Math.sin(T.t*1.7)*0.6,sp=(d<14?7.6:6.2)*dt;let ok=false;
  for(const off of[0,0.6,-0.6,1.2,-1.2,2,-2]){const a=want+off,q={x:T.x+Math.sin(a)*sp,z:T.z+Math.cos(a)*sp};resolve(q,0.35);if(Math.hypot(q.x-T.x,q.z-T.z)>sp*0.6&&Math.abs(floorAt(q.x,q.z)-floorAt(T.x,T.z))<0.7){T.x=q.x;T.z=q.z;T.a=a;ok=true;break;}}
  T.g.position.set(T.x,floorAt(T.x,T.z)+Math.abs(Math.sin(T.t*11))*0.08,T.z);T.g.rotation.y=T.a;try{MTR.beaconT=0;}catch(e){}
  if(d<1.8){scene.remove(T.g);THF.on=null;state.obols=(state.obols||0)+T.n+1;qAdd('ar',1,'¡Lo has alcanzado!');save();updateStats();
    toast('<span class="label">¡Atrapado!</span><br>Le agarras del manto. Te devuelve lo robado y una moneda más «por las molestias», y se escabulle entre la gente. '+(MODE==='roma'?'No hay policía como la nuestra: los vigiles persiguen sobre todo incendios y ladrones nocturnos.':'En Atenas no hay policía: quien pilla a un ladrón puede llevarlo él mismo ante los Once.'));return;}
  if(d>75||T.t>45){scene.remove(T.g);THF.on=null;toast('<span class="label">Se ha escapado</span><br>El ladrón se pierde entre las callejuelas.');}}
// de noche (091): el robo de siempre, y ahora el ladrón huye
{const f=uxThiefTick;uxThiefTick=function(dt){const o0=state&&state.obols;f(dt);try{if(state&&state.obols<o0)thfSpawn(o0-state.obols,'Te ha empujado y se ha llevado tu bolsa.');}catch(e){}};}
// de día, un carterista en los mercados (una vez al día como mucho)
function thfMarket(dt){if(!state||ui!=='play'||THF.on||(state.obols||0)<6)return;const d=state.day||1;if(state.thfDay===d)return;
  AGL.mk=(AGL.mk||0)+dt;if(AGL.mk<4)return;AGL.mk=0;let near=false;for(const p of PLACES)if(/mercado|Macellum|Subura|Ágora|Agora/i.test(p.name)&&Math.hypot(p.x-player.x,p.z-player.z)<45){near=true;break;}
  if(!near||Math.random()>0.04)return;state.thfDay=d;const n=Math.min(6,2+Math.floor(state.obols*0.08));state.obols-=n;save();updateStats();thfSpawn(n,'Un carterista te ha cortado la bolsa del cinturón entre el gentío.');}
{const f=uxTick;uxTick=function(dt){f(dt);try{agTick(dt);}catch(e){}try{thfTick(dt);}catch(e){}try{thfMarket(dt);}catch(e){}};}
