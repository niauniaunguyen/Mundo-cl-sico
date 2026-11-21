// ============================================================ SENTARSE: rodillas, posturas (banco, suelo, de rodillas), bancos de piedra y la sombra en verano
// Las piernas se parten en muslo y espinilla con el mismo partidor que los codos (gsElbow): pivote en la rodilla. Con túnica larga solo se
// ven los pies, y el truco funciona igual (el cuerpo baja y los pies quedan delante, en el suelo). personPose(g,'sit'|'ground'|'kneel'|'stand').
// Bancos de piedra junto al Ágora y al Foro (a la sombra de los pórticos se sentaba la gente a charlar); en verano, de 12 a 16,5 h, algunos
// paseantes parados se van a sentar a la sombra del árbol más cercano (la sombra se calcula con la dirección del sol, SUNDIR).
const SIT={benches:[],t:0,built:false};
function personKnees(g){const u=g.userData;if(u.knees!==undefined)return u.knees;u.knees=(u.legs||[]).map(l=>{try{return gsElbow(l);}catch(e){return null;}});return u.knees;}
function personPose(g,mode,seatH){const u=g.userData;if(!u.legs)return;const K=personKnees(g);if(u.poseDy){g.position.y-=u.poseDy;u.poseDy=0;}
  g.rotation.order='YXZ';const set=(th,kn)=>{u.legs.forEach((l,i)=>{l.rotation.x=th;l.rotation.z=0;const k=K[i];if(k)k.rotation.x=kn;});};
  if(mode==='stand'||!mode){set(0,0);u.sitting=null;if(u.noSnapSit){u.noSnap=false;u.noSnapSit=false;}return;}
  const S=g.scale.y||1;let dy=0;
  if(mode==='sit'){set(-1.5,1.5);dy=((seatH||0.45)+0.04)-HIP_Y*S;}            // en un banco: muslos horizontales, espinillas verticales
  else if(mode==='ground'){set(-1.45,0.25);dy=0.36-HIP_Y*S;}                     // en el suelo, piernas casi estiradas
  else if(mode==='kneel'){set(0,1.55);dy=-HIP_Y*S*0.5+0.06;}                      // de rodillas: muslos verticales, espinillas atrás en el suelo
  g.position.y+=dy;u.poseDy=dy;u.sitting=mode;if(!u.noSnap){u.noSnap=true;u.noSnapSit=true;}}   // que SUELO no lo vuelva a subir al suelo
// sentarse en el suelo: con túnica corta, en el suelo (se ven las piernas); con túnica larga, sobre una piedra baja (la tela no se dobla)
function personShort(g){return (g.userData.legAmp||0)>0.3;}
const SIT_STONES=new Map();
function sitStone(g,x,z){const k=Math.round(x*2)+','+Math.round(z*2);if(!SIT_STONES.has(k)){const s=new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.44,0.44,7),M.stone||lam('#a39a8a'));s.position.set(x,terrainH(x,z)+0.22,z);s.castShadow=s.receiveShadow=true;scene.add(s);SIT_STONES.set(k,s);}personPose(g,'sit',0.45);}
function sitLow(g,x,z){if(personShort(g))personPose(g,'ground');else sitStone(g,x,z);}
// de rodillas: con túnica corta, de verdad; con túnica larga, sentado en una piedra (inclinado hacia delante quien la usa)
function kneelOrSit(g,x,z){if(personShort(g))personPose(g,'kneel');else sitStone(g,x,z);}
// bancos de piedra
function sitBench(x,z,a){const g=grp(x,terrainH(x,z),z,a),st=M.stone||lam('#bdb3a2');box(2.4,0.12,0.55,st,0,0.42,0,g);box(0.4,0.36,0.5,st,-0.95,0.18,0,g);box(0.4,0.36,0.5,st,0.95,0.18,0,g);addBox(x,z,2.4,0.55,a);
  const c=Math.cos(a),s=Math.sin(a),seat=k=>({x:x+c*k*0.6+s*0.45,z:z-s*k*0.6+c*0.45,a,y:terrainH(x,z)+0.48,who:null});SIT.benches.push({x,z,a,slots:[seat(-1),seat(1)]});}
function sitBuild(){if(SIT.built)return;SIT.built=true;const spots=MODE==='roma'?[['ro_rostra',-26,18,0.3],['ro_rostra',-34,30,0.3],['ro_rostra',22,26,-0.4],['ro_rostra',30,40,-0.4],['ro_rostra',-10,44,Math.PI]]
    :[[null,10,-20,0],[null,40,-34,0.5],[null,62,8,1.6],[null,22,26,Math.PI],[null,-12,4,-1.2],[null,72,-52,0.8]];
  for(const[id,dx,dz,a]of spots){let p=null;if(id){const q=PLACES.find(q=>q.id===id);if(q)p=findFree(q.x+dx,q.z+dz,1.8);}else p=findFree(AG.x+dx,AG.z+dz,1.8);if(p&&isFinite(p[0]))sitBench(p[0],p[1],a);}}
// a la sombra del árbol más cercano (la sombra cae al lado contrario del sol)
function sitShade(x,z){const cx=Math.floor(x/30),cz=Math.floor(z/30);let b=null,bd=32;for(let i=cx-1;i<=cx+1;i++)for(let j=cz-1;j<=cz+1;j++){const a=TRG.get(i+','+j);if(!a)continue;for(const q of a){const d=Math.hypot(q[0]-x,q[1]-z);if(d<bd){bd=d;b=q;}}}
  if(!b)return null;const L=Math.hypot(SUNDIR.x,SUNDIR.z)||1,sx=b[0]-SUNDIR.x/L*1.9,sz=b[1]-SUNDIR.z/L*1.9;return isFree(sx,sz,0.4)?{x:sx,z:sz,tx:b[0],tz:b[1]}:null;}
function sitTick(dt){if(!state||ui==='start')return;SIT.t-=dt;const scan=SIT.t<=0;if(scan){SIT.t=2;if(!SIT.built&&player.x<8000)sitBuild();}
  const P=player,h=clock.h,hot=typeof NEED!=='undefined'&&NEED.hot,inside=typeof CASA!=='undefined'&&CASA.inside;
  for(const w of walkers){if(w.home||!w.g||w.fol||w.pal)continue;const g=w.g,u=g.userData,dx=g.position.x-P.x,dz=g.position.z-P.z,d2=dx*dx+dz*dz;
    // levantarse
    if(w.sat){if(w.wait<=0.3||(w.sat==='sombra'&&!hot)||d2>140*140){personPose(g,'stand');if(w.seat){w.seat.who=null;w.seat=null;}w.sat=null;w.wait=0;}continue;}
    // ir hacia el sitio
    if(w.sgo){const T=w.sgo;w.tx=T.x;w.tz=T.z;w.wait=0;if(Math.hypot(g.position.x-T.x,g.position.z-T.z)<0.9){w.sgo=null;g.position.x=T.x;g.position.z=T.z;
        if(T.seat){g.rotation.y=T.a+Math.PI;g.position.y=terrainH(T.x,T.z);personPose(g,'sit',T.y-terrainH(T.x,T.z));w.sat='banco';w.wait=40+Math.random()*60;}
        else{g.rotation.y=Math.atan2(T.tx-T.x,T.tz-T.z)+Math.PI+(Math.random()-0.5);g.position.y=terrainH(T.x,T.z);sitLow(g,T.x,T.z);w.sat='sombra';w.wait=60+Math.random()*90;stFeat&&stFeat(g,'calor');}
        personWalk(g,0,0);w.moving=false;}else if(T.seat&&T.seat.who!==w){w.sgo=null;}continue;}
    if(!scan||d2>45*45||w.speed<=0||w.barks||!(w.wait>0)||w.fgo||w.eat||inside)continue;
    if(hot&&!w.shadeTried&&Math.random()<0.35){w.shadeTried=1;const S=sitShade(g.position.x,g.position.z);if(S){w.sgo=S;continue;}}
    if(Math.random()<0.06){for(const b of SIT.benches){if(Math.hypot(b.x-g.position.x,b.z-g.position.z)>30)continue;const s=b.slots.find(s=>!s.who);if(s){s.who=w;w.seat=s;w.sgo={x:s.x,z:s.z,a:s.a,y:s.y,seat:s};break;}}}}}
// en el modo atención, quien está sentado lo dice
{const c0=atCands;atCands=function(){const C=c0.apply(this,arguments);try{const by=new Map();for(const w of walkers)if(w.sat&&w.g)by.set(w.g,w);for(const c of C){const w=c.obj&&by.get(c.obj);if(!w)continue;
  if(w.sat==='sombra'){c.sub='sentado a la sombra';c.txt=()=>ST_TXT.calor[1];}else{c.sub='descansando en un banco';c.txt=()=>MODE==='roma'?'Se sienta un rato en un banco de piedra del Foro, a ver pasar a la gente: abogados, senadores, vendedores, curiosos. En Roma, mirar también es una ocupación.':'Se sienta un rato en un banco de piedra del ágora. Los atenienses pasaban horas así, a la sombra de los pórticos, charlando de política y de filosofía: de ahí la fama de las stoas.';}}}catch(e){}return C;};}
