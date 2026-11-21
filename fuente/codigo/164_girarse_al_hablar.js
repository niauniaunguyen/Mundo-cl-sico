// ============================================================ GIRARSE AL HABLAR: quien te habla se vuelve hacia ti
// Antes solo giraba la cabeza (128_gestos.js, hasta ~50°), así que alguien de espaldas te contestaba sin mirarte.
// Ahora, al abrir el diálogo, todo el cuerpo gira hacia ti con suavidad (más deprisa cuanto más le falta), y la cabeza termina el gesto.
// Al cerrar el diálogo, pasados dos segundos, vuelve despacio a la postura que tenía (su puesto, su tarea, la vista sobre lo que hacía),
// salvo que haya echado a andar: entonces manda su rutina.
const TURN={g:null,back:[]};
function turnAng(a){return((a+Math.PI)%TAU+TAU)%TAU-Math.PI;}
function turnTick(dt){try{
  let g=null;if(ui==='dialog'&&typeof dlg!=='undefined'&&dlg&&dlg.n){const o=npcObjs.find(o=>o.data===dlg.n);if(o&&o.g&&o.g.visible!==false)g=o.g;}
  if(g!==TURN.g){if(TURN.g&&TURN.g.userData.turn0!==undefined)TURN.back.push({g:TURN.g,wait:2,x:TURN.g.position.x,z:TURN.g.position.z});TURN.g=g;
    if(g){TURN.back=TURN.back.filter(b=>b.g!==g);if(g.userData.turn0===undefined)g.userData.turn0=g.rotation.y;}}
  if(g){const P=player,dx=P.x-g.position.x,dz=P.z-g.position.z;if(dx*dx+dz*dz>0.04){const a=turnAng(Math.atan2(dx,dz)-g.rotation.y);
      g.rotation.y+=a*Math.min(1,dt*(2.5+Math.abs(a)*1.5));}}
  for(const b of TURN.back){if(Math.abs(b.g.position.x-b.x)+Math.abs(b.g.position.z-b.z)>0.05){delete b.g.userData.turn0;b.done=1;continue;}   // si echa a andar, manda su rutina
    if(b.wait>0){b.wait-=dt;continue;}const a=turnAng(b.g.userData.turn0-b.g.rotation.y);b.g.rotation.y+=a*Math.min(1,dt*1.2);
    if(Math.abs(a)<0.01){b.g.rotation.y=b.g.userData.turn0;delete b.g.userData.turn0;b.done=1;}}
  if(TURN.back.length)TURN.back=TURN.back.filter(b=>!b.done);}catch(e){}}
{const f=uxTick;uxTick=function(dt){f(dt);turnTick(dt);};}
