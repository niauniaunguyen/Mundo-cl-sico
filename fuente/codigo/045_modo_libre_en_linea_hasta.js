// ============================================================ MODO LIBRE EN LÍNEA (hasta 15 jugadores, capacidad room)
// Cada sala es un room con nombre «mc-<época>-<código>». Cada jugador publica su presencia (nombre, color, posición)
// y los demás lo ven como un avatar. El chat va por el tema «chat». Todo lo recibido es de otros: se muestra como texto.
const NET={room:null,code:'',name:'',color:'',av:new Map(),t:0,sent:'',max:15,log:[]};
const NET_COLORS=['#a8392b','#2f4c86','#5a8a3a','#c9a24a','#6a4d7a','#2a8a8a','#c96a2a','#8a2a5a','#4a6a2a','#3a3a8a','#8a6a3a','#2a6a8a','#aa4a6a','#6a8a8a','#7a2a1e'];
const netClean=(s,n)=>String(s||'').replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁠-⁯]/g,'').trim().slice(0,n);
function netCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<4;i++)s+=a[Math.floor(Math.random()*a.length)];return s;}
async function netJoin(name,code){
  const msg=t=>{$('netMsg').textContent=t;};
  NET.name=netClean(name,20)||'Viajero';NET.code=netClean(code,8).toUpperCase().replace(/[^A-Z0-9]/g,'')||netCode();
  try{localStorage.setItem('mc-net-name',NET.name);}catch(e){}
  msg('Conectando…');
  let lobby=null;try{lobby=window.claude&&window.claude.use?await window.claude.use('room'):null;}catch(e){lobby=null;}
  if(!lobby){msg('El juego en línea solo funciona al abrir esta página en claude.ai, compartida con tus compañeros. Puedes jugar en el modo libre sin conexión.');return false;}
  let room;try{room=await lobby.join(('mc-'+MODE+'-'+NET.code).toLowerCase());}catch(e){msg('No se ha podido entrar en la sala ('+(e&&e.code||'error')+'). Inténtalo de nuevo.');return false;}
  await new Promise(r=>setTimeout(r,2500));
  const others=room.peers().filter(p=>!p.sameTab).length;
  if(others>=NET.max){await room.leave();msg('La sala '+NET.code+' está llena (máximo '+NET.max+' jugadores). Crea otra sala.');return false;}
  const used=new Set(room.peers().map(p=>p.presence&&p.presence.c));NET.color=NET_COLORS.find(c=>!used.has(c))||NET_COLORS[Math.floor(Math.random()*NET_COLORS.length)];
  NET.room=room;
  room.onPeers(ch=>{for(const p of ch.left)netDrop(p.peer);netList();},()=>{netSay('','Se ha perdido la conexión con la sala.');});
  room.on('chat',m=>{const p=room.peers().find(q=>q.peer===m.peer);const who=m.sameTab?NET.name:netClean(p&&p.presence&&p.presence.n,20)||'Alguien';netSay(who,netClean(m.data&&m.data.t,200));});
  room.onConnection(c=>{$('netState').textContent=c?'':' · reconectando…';});
  netPresence(true);$('net').hidden=false;netList();
  netSay('','Has entrado en la sala '+NET.code+'. Dile este código a tus compañeros para que entren contigo. Pulsa Intro para escribir en el chat.');
  return true;
}
function netPresence(force){const r=NET.room;if(!r)return;
  const o={n:NET.name,c:NET.color,x:Math.round(player.x*10)/10,z:Math.round(player.z*10)/10,y:Math.round(player.feet*10)/10,a:Math.round(player.yaw*100)/100,q:NET.q||0,q2:{qz:NET.qz||0,hu:(state&&state.dyn&&state.dyn.hunt)||0}};   // q2: concurso y búsqueda del tesoro (180)   // q: misión de grupo (171_mision_grupo.js)
  const k=JSON.stringify(o);if(!force&&k===NET.sent)return;NET.sent=k;r.presence(o).catch(()=>{});}
function netAvatar(p){let a=NET.av.get(p.peer);const pr=p.presence||{};
  if(!a){const col=NET_COLORS.includes(pr.c)?pr.c:'#6a6a6a';const g=makePerson({noVary:true,chiton:col,himation:'#efe6d4',hair:'#3b2a1e'});scene.add(g);
    const lb=labelSprite(netClean(pr.n,20)||'Jugador','jugador en línea',false);lb.position.y=2.45;g.add(lb);
    a={g,lb,x:+pr.x||0,z:+pr.z||0,y:+pr.y||0,yaw:+pr.a||0,n:pr.n};NET.av.set(p.peer,a);g.position.set(a.x,a.y,a.z);}
  if(pr.n!==a.n){a.n=pr.n;a.g.remove(a.lb);a.lb=labelSprite(netClean(pr.n,20)||'Jugador','jugador en línea',false);a.lb.position.y=2.45;a.g.add(a.lb);}
  a.tx=+pr.x||0;a.tz=+pr.z||0;a.ty=+pr.y||0;a.tyaw=+pr.a||0;return a;}
function netDrop(peer){const a=NET.av.get(peer);if(a){scene.remove(a.g);NET.av.delete(peer);}}
function netList(){const r=NET.room;if(!r)return;const ps=r.peers();
  $('netHead').textContent='En línea · sala '+NET.code+' · '+ps.length+'/'+NET.max;
  const ul=$('netPeople');ul.innerHTML='';for(const p of ps){const li=document.createElement('li');const pr=p.presence||{};li.style.borderLeftColor=NET_COLORS.includes(pr.c)?pr.c:'#6a6a6a';li.textContent=(netClean(pr.n,20)||'…')+(p.sameTab?' (tú)':'');ul.appendChild(li);}}
function netSay(who,txt){if(!txt)return;NET.log.push([who,txt]);if(NET.log.length>7)NET.log.shift();const el=$('netLog');el.innerHTML='';
  for(const[w,t]of NET.log){const d=document.createElement('div');if(w){const b=document.createElement('b');b.textContent=w+': ';d.appendChild(b);}else d.className='sys';d.appendChild(document.createTextNode(t));el.appendChild(d);}}
function netChatOpen(){const i=$('netIn');i.hidden=false;i.value='';releasePointer();setTimeout(()=>i.focus(),20);}
function netTick(dt){const r=NET.room;if(!r)return;NET.t+=dt;
  if(NET.t>0.12){NET.t=0;netPresence(false);for(const p of r.peers())if(!p.sameTab)netAvatar(p);}
  const k=Math.min(1,dt*8);for(const a of NET.av.values()){if(a.tx===undefined)continue;const mvd=Math.hypot((a.tx-a.x)*k,(a.tz-a.z)*k);a.ph=(a.ph||0)+mvd*4.6;personWalk(a.g,a.ph,mvd/Math.max(dt,1e-3)>0.3?1:0);a.x+=(a.tx-a.x)*k;a.z+=(a.tz-a.z)*k;a.y+=(a.ty-a.y)*k;
    let d=a.tyaw-a.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));a.yaw+=d*k;a.g.position.set(a.x,a.y,a.z);a.g.rotation.y=a.yaw+Math.PI;
    a.lb.visible=Math.hypot(a.x-player.x,a.z-player.z)<40;}
}
function storyGo(){const t=storyTarget();if(!t)return;if(Math.hypot(t.x-player.x,t.z-player.z)<120){toast('Ya estás cerca: sigue el rombo ◆ de la brújula.');return;}
  storyTravel(()=>t,6,6);addHours(1);toast('<span class="label">'+(MODE==='roma'?'Un carretero':'Un carretero')+' te lleva</span><br>Pasa una hora de camino.');}
