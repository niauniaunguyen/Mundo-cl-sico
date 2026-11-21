// ============================================================ LA LLEGADA: los primeros minutos con un guía, sin carteles de instrucciones
// En una partida nueva del modo Libre, un guía (Lisias, un muchacho del Pireo / Gaya, una niña de la Subura) te recibe y te lleva:
// 1 a conocer a alguien (hablar), 2 a una esfera de sueño (soñar), 3 hasta la diosa (aprender), 4 te da el plano (orientarse) y 5 te deja una meta: la honra de la ciudad.
// Se aprende moviéndose detrás de alguien. Los recordatorios de teclas solo salen si te quedas parado sin saber qué hacer.
function obz(){if(!state.ob||typeof state.ob!=='object')state.ob={st:0,done:0};return state.ob;}
const OB={g:null,wp:[],wi:0,stuck:0,last:0,idle:0,ix:0,iz:0,sub:null,subT:0,said:{},hintT:0};
function obRoute(){const ro=MODE==='roma',Q=(id)=>{const p=PLACES.find(q=>q.id===id);return p?[p.x,p.z]:null;},N=id=>{const o=npcObjs.find(o=>o.data&&o.data.id===id);return o?[o.x,o.z]:null;},S=id=>{const s=EPI.spheres.find(s=>s.data&&s.data.id===id);return s?[s.x,s.z,s.data]:null;};
  if(ro)return[{k:'talk',npc:'tacito',to:N('tacito'),wp:[N('tacito')]},{k:'dream',sph:S('sabinas'),wp:[S('sabinas')]},
    {k:'god',wp:[Q('ro_saturno'),Q('ro_clivus'),[-185,70],[-205,82],[-222,62],[-222,40],AM.o?[AM.o.x,AM.o.z+2.5]:null]},{k:'map'},{k:'end'}];
  return[{k:'talk',npc:'pritano',to:N('pritano'),wp:[N('pritano')]},{k:'dream',sph:S('orestes'),wp:[[-330,-160],S('orestes')]},
    {k:'god',wp:[[-210,-20],Q('propileos'),[-40,-22],[30,-22],[78,-6],[78,12],AM.o?[AM.o.x+3,AM.o.z]:null]},{k:'map'},{k:'end'}];}
const OB_TXT={atenas:{name:'Lisias',sub:'un muchacho del Pireo',
  hello:'¡Eh, tú, el recién llegado! Soy Lisias. Mi padre dice que a los forasteros hay que enseñarles la ciudad. ¡Sígueme!',
  talk:'Ese de ahí es Eucles: este mes es prítano, de los que presiden el Consejo. Ve a hablar con él, no muerde.',
  talkDone:'¿Ves? En Atenas cualquiera te cuenta cómo funciona la ciudad. Ahora te enseño algo raro. ¡Vamos!',
  dream:'¿Ves esa luz que flota? Es una esfera de sueño. Si la tocas, sueñas lo que pasó aquí hace mucho. Tócala, yo te espero.',
  dreamDone:'¡Has soñado! Hay esferas así por toda Grecia. Ahora, lo mejor: arriba, en la Acrópolis.',
  god:'Dentro del Partenón está la estatua de Atenea… y dicen que, a quien mira con atención, la diosa le habla. Entra tú; yo no me atrevo.',
  godDone:'¿Te ha hablado? ¡Lo sabía! Toma, para que no te pierdas: un plano de la ciudad.',
  map:'Mira el plano (M). Si un sitio ya lo conoces, puedes ir directo.',
  end:'Y ahora te dejo. Un consejo: en Atenas te respetan si aprendes, ayudas y hablas bien. Cuanto más hagas, más te honrará la ciudad: lo verás en tu diario. ¡Suerte, forastero!',
  wait:['¡Por aquí!','¡Venga, que no es lejos!','¡Sígueme!']},
 roma:{name:'Gaya',sub:'una niña de la Subura',
  hello:'¡Salve! ¿Eres nuevo en Roma? Soy Gaya y me conozco todas las calles. ¡Sígueme, que te enseño!',
  talk:'Ese joven es Tácito: acaba de entrar en el Senado. Dicen que escribirá historia. Ve a hablar con él.',
  talkDone:'¿A que habla bonito? Ven, que te enseño una cosa que brilla.',
  dream:'Esa luz es una esfera de sueño. Tócala y verás lo que pasó aquí cuando Roma era pequeña. Te espero.',
  dreamDone:'¡Has soñado! Ahora subimos al Capitolio. El templo se quemó este año, pero Minerva sigue allí.',
  god:'Ahí, junto a la puerta del templo… ¿la ves? Es Minerva. Habla con ella, que enseña a quien pregunta.',
  godDone:'¡Te ha hablado una diosa! Toma, mi tío es agrimensor y me dio esto: un plano de Roma.',
  map:'Mira el plano (M). Desde ahí puedes ir a los sitios que ya conoces.',
  end:'Me voy, que mi madre me espera en el horno. En Roma importa la honra: si aprendes y ayudas, subirás de rango. Míralo en tu diario. ¡Vale!',
  wait:['¡Por aquí!','¡Corre, que es aquí al lado!','¡Sígueme!']}};
const obT=()=>OB_TXT[MODE==='roma'?'roma':'atenas'];
function obSay(t,dur){if(!OB.sub){const d=document.createElement('div');d.id='obSub';d.style.cssText='position:fixed;left:50%;bottom:118px;transform:translateX(-50%);max-width:min(640px,90vw);background:rgba(20,15,10,.82);color:#f3e6cf;border:1px solid #c98a4a;border-radius:12px;padding:10px 16px;font:16px Alegreya,Georgia,serif;z-index:30;pointer-events:auto;line-height:1.35';document.body.appendChild(d);OB.sub=d;}
  const T=obT();OB.sub.innerHTML='<b style="color:#e8a85a">'+T.name+'</b> · '+t+' <a href="#" id="obSkip" style="color:#a89a7a;font-size:.8em;margin-left:8px">saltar presentación (tecla Retroceso ⌫)</a>';OB.sub.hidden=false;OB.subT=dur||9;
  $('obSkip').onclick=e=>{e.preventDefault();obFinish(true);};}
function obHint(t){toast(t);}
function obActive(){return state&&!storyOn()&&obz().st>0&&!obz().done;}
function obStart(){const z=obz();if(z.done||z.st>0||storyOn())return;z.st=1;save();OB.route=obRoute();OB.stage=0;obSpawn();obStage(0);}
function obSpawn(){const ro=MODE==='roma',a=player.yaw,x=player.x-Math.sin(a)*4,z=player.z-Math.cos(a)*4;
  const g=makePerson(ro?{female:true,chiton:'#c9a46a',short:true,noHimation:true,hair:'#3a2a1e',scale:0.78,noVary:true}:{chiton:'#d8ccb4',short:true,noHimation:true,hair:'#5a3a22',scale:0.8,noVary:true});
  g.position.set(x,floorAt(x,z),z);scene.add(g);OB.g=g;const lb=labelSprite(obT().name,obT().sub,false);lb.position.y=2.2;g.add(lb);OB.lb=lb;}
function obStage(i){OB.stage=i;const z=obz();z.st=i+1;save();const S=OB.route[i],T=obT();if(!S)return obFinish(false);
  OB.wp=(S.wp||[]).filter(Boolean);OB.wi=0;OB.stuck=0;
  if(S.k==='talk')obSay(i===0?T.hello:T.talk,10);else if(S.k==='dream')obSay(T.talkDone,8);else if(S.k==='god')obSay(T.dreamDone,8);
  else if(S.k==='map'){obSay(T.godDone,8);setTimeout(()=>{if(ui==='play'){openMap();obSay(T.map,8);}},2500);}
  else if(S.k==='end'){obSay(T.end,12);setTimeout(()=>obFinish(false),12000);}}
function obDone(S){if(!S)return false;if(S.k==='talk')return seenAny(S.npc);if(S.k==='dream')return S.sph?epiDone(S.sph[2]):true;if(S.k==='god')return!!(typeof amz==='function'&&amz().met);if(S.k==='map')return!!state.steps.map;return false;}
function obFinish(skip){const z=obz();z.done=1;save();if(OB.sub)OB.sub.hidden=true;state.tut=1;
  if(OB.g){const g=OB.g;setTimeout(()=>{scene.remove(g);},skip?0:6000);if(!skip){OB.leave=true;}else OB.g=null;}
  if(skip)toast('Presentación saltada. Tus primeros pasos están en el diario (J).');else{try{qAdd('kl',1,'Has conocido la ciudad');}catch(e){}}}
function obTick(dt){if(!state||ui==='start')return;const z=obz();
  if(OB.sub&&!OB.sub.hidden){OB.subT-=dt;if(OB.subT<=0)OB.sub.hidden=true;}
  if(!OB.g)return;const g=OB.g,P=player;
  if(OB.leave){g.position.x+=Math.sin(g.rotation.y)*dt*2;g.position.z+=Math.cos(g.rotation.y)*dt*2;g.position.y=floorAt(g.position.x,g.position.z);personWalk(g,performance.now()/160,1);return;}
  if(z.done||ui!=='play'&&ui!=='dialog'){return;}
  const S=OB.route[OB.stage];if(obDone(S)){obStage(OB.stage+1);return;}
  // ¿se ha quedado parado el jugador al principio? un recordatorio discreto
  if(Math.hypot(P.x-OB.ix,P.z-OB.iz)>1.5){OB.ix=P.x;OB.iz=P.z;OB.idle=0;}else OB.idle+=dt;
  if(OB.idle>12&&performance.now()-OB.hintT>25000){OB.hintT=performance.now();
    obHint(S&&S.k==='talk'&&S.to&&Math.hypot(P.x-S.to[0],P.z-S.to[1])<6?(isTouch?'Toca la <b>mano</b> para hablar.':'Pulsa <b>E</b> para hablar.'):S&&S.k==='dream'&&S.sph&&Math.hypot(P.x-S.sph[0],P.z-S.sph[1])<6?(isTouch?'Toca la <b>mano</b> para tocar la esfera.':'Pulsa <b>E</b> para tocar la esfera.'):(isTouch?'Desliza el pulgar izquierdo para <b>caminar</b> y el derecho para <b>mirar</b>.':'Camina con <b>W A S D</b> y mira con el ratón.'));}
  // el guía va por delante, hasta el siguiente punto; espera si te quedas atrás
  const gx=g.position.x,gz=g.position.z,dP=Math.hypot(P.x-gx,P.z-gz);let tgt=OB.wp[OB.wi];
  if(tgt&&Math.hypot(tgt[0]-gx,tgt[1]-gz)<(OB.wi===OB.wp.length-1?3:2.5)){if(OB.wi<OB.wp.length-1){OB.wi++;tgt=OB.wp[OB.wi];}else tgt=null;}
  let moving=false;
  if(tgt&&dP<11){const sp=3.6;
    // camino de verdad (rejilla de 1,5 m que rodea paredes y no sube pendientes imposibles); antes, si se atascaba, saltaba al punto siguiente atravesando casas
    if(!OB.path||OB.pathFor!==tgt||(OB.stuck>0.8&&performance.now()-(OB.pathT||0)>1500)){OB.path=obPath(gx,gz,tgt[0],tgt[1]);OB.pathFor=tgt;OB.pathT=performance.now();OB.stuck=0;}
    let nx0=tgt[0],nz0=tgt[1];if(OB.path&&OB.path.length){while(OB.path.length>1&&Math.hypot(OB.path[0][0]-gx,OB.path[0][1]-gz)<0.9)OB.path.shift();nx0=OB.path[0][0];nz0=OB.path[0][1];}
    const a=Math.atan2(nx0-gx,nz0-gz);let ok=false;
    for(const off of[0,0.35,-0.35,0.8,-0.8,1.3,-1.3]){const aa=a+off,nx=gx+Math.sin(aa)*sp*dt,nz=gz+Math.cos(aa)*sp*dt;if(isFree(nx,nz,0.3)&&Math.abs(floorAt(nx,nz)-g.position.y)<0.8){g.position.x=nx;g.position.z=nz;let dr=aa-g.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));g.rotation.y+=dr*Math.min(1,dt*8);ok=true;break;}}
    if(ok){moving=true;OB.stuck=0;}else{OB.stuck+=dt;if(OB.stuck>6&&!obSeen(tgt[0],tgt[1])&&!obSeen(gx,gz)){g.position.x=tgt[0];g.position.z=tgt[1];OB.stuck=0;OB.path=null;}}   // atascado de verdad: solo si no lo ves
    g.position.y=floorAt(g.position.x,g.position.z);}
  else{const a=Math.atan2(P.x-gx,P.z-gz);let d=a-g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));g.rotation.y+=d*Math.min(1,dt*3);
    if(dP>16&&performance.now()-OB.last>9000){OB.last=performance.now();obSay(pick(obT().wait),3);}
    if(dP>60){const a2=Math.atan2(gx-P.x,gz-P.z),q=findFree(P.x-Math.sin(P.yaw)*7,P.z-Math.cos(P.yaw)*7,0.5);if(!obSeen(q[0],q[1])){g.position.x=q[0];g.position.z=q[1];g.position.y=floorAt(q[0],q[1]);OB.path=null;}}}   // te has ido lejos: vuelve a por ti, por detrás, sin que lo veas aparecer
  if(moving)personWalk(g,performance.now()/170,1);else personWalk(g,0,0);
  // al llegar al destino de la etapa, explica qué hacer (una vez)
  if(!tgt&&S&&!OB.said[OB.stage]&&dP<12){OB.said[OB.stage]=1;const T=obT();if(S.k==='dream')obSay(T.dream,10);else if(S.k==='god')obSay(T.god,10);else if(S.k==='talk'&&OB.stage>0)obSay(T.talk,10);}}
// la partida nueva del modo libre empieza con el guía en lugar del tutorial de carteles
{const f=tutStart;tutStart=function(){if(!storyOn()&&!obz().done&&!state.lessons.length&&!state.places.length){state.tut=1;save();obStart();return;}return f.apply(this,arguments);};}
// si se recarga a mitad de la presentación, el guía vuelve
{const f=uxTick;uxTick=function(dt){f(dt);try{if(state&&ui==='play'&&!OB.g&&obActive()&&!OB.route){OB.route=obRoute();obSpawn();obStage(Math.max(0,obz().st-1));}obTick(dt);}catch(e){}};}

// saltar la presentación con una tecla (Retroceso): con el ratón no se puede, porque el ratón mueve la cámara
addEventListener('keydown',e=>{if(e.code!=='Backspace'||!OB.sub||OB.sub.hidden||obz().done)return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;e.preventDefault();obFinish(true);});

// ¿se ve este punto? (delante de la cámara y a menos de 45 m)
function obSeen(x,z){const v=new THREE.Vector3(x,floorAt(x,z)+1,z);if(v.distanceTo(camera.position)>45)return false;v.project(camera);return v.z<1&&Math.abs(v.x)<1.1&&Math.abs(v.y)<1.1;}
// búsqueda de camino A* en una rejilla de 1,5 m: celdas libres (isFree) y sin escalones de más de 0,8 m entre vecinas
function obPath(sx,sz,tx,tz){const S=1.5,ox=Math.min(sx,tx)-40,oz=Math.min(sz,tz)-40,W=Math.ceil((Math.abs(tx-sx)+80)/S),H=Math.ceil((Math.abs(tz-sz)+80)/S);if(W*H>60000)return null;
  const ci=(x,z)=>[Math.round((x-ox)/S),Math.round((z-oz)/S)],cx=i=>ox+i*S,K=(i,j)=>j*W+i,[si,sj]=ci(sx,sz),[ti,tj]=ci(tx,tz);
  const free=new Map(),hgt=new Map(),ok=(i,j)=>{const k=K(i,j);if(!free.has(k)){const x=cx(i),z=oz+j*S;free.set(k,isFree(x,z,0.35));hgt.set(k,floorAt(x,z));}return free.get(k);};
  ok(si,sj);const g=new Map([[K(si,sj),0]]),came=new Map(),open=[[Math.hypot(ti-si,tj-sj),si,sj]],seen=new Set();let n=0;
  while(open.length&&n++<5000){let bi=0;for(let q=1;q<open.length;q++)if(open[q][0]<open[bi][0])bi=q;const [,i,j]=open.splice(bi,1)[0],k=K(i,j);if(seen.has(k))continue;seen.add(k);
    if(Math.abs(i-ti)<=1&&Math.abs(j-tj)<=1){const out=[[tx,tz]];let c=k;while(came.has(c)){out.unshift([cx(c%W),oz+Math.floor(c/W)*S]);c=came.get(c);}return out;}
    for(const [di,dj] of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const a=i+di,b=j+dj;if(a<0||b<0||a>=W||b>=H)continue;const kk=K(a,b);if(seen.has(kk)||!ok(a,b))continue;
      if(Math.abs(hgt.get(kk)-hgt.get(k)||0)>0.8)continue;const ng=g.get(k)+Math.hypot(di,dj);if(ng<(g.has(kk)?g.get(kk):1e9)){g.set(kk,ng);came.set(kk,k);open.push([ng+Math.hypot(ti-a,tj-b),a,b]);}}}
  return null;}
