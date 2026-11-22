// ============================================================ PIES AL SUELO (22/11)
// Corrige en tiempo real la altura de cada persona para que sus pies toquen el suelo: ni se hunden ni flotan.
// · Personas de Blender (con esqueleto): en cada fotograma, antes de dibujar, se mide dónde están de verdad los tobillos (huesos
//   foot.L y foot.R, ya animados: al andar uno se levanta) y qué suelo hay debajo de cada pie (terreno, escalinatas, gradas,
//   plataformas, orillas). El pie más bajo se apoya justo en su suelo; la diferencia se aplica suavemente al modelo, no al personaje.
// · Figuras sencillas (de lejos o sin esqueleto): se apoyan en el suelo real bajo su centro (el juego las ponía sobre el terreno
//   desnudo, sin escalones ni plataformas).
// Se respeta a quien está sentado o en una pose especial, y a quien está muy por encima o por debajo (tejados, barcas, dioses que
// flotan): no se toca lo que no es un error. Solo trabaja con la gente cercana a la cámara, por turnos, para no costar FPS.
const PIES={on:true,R:60,n:0,fix:0,max:0,list:[],i:0,frame:-1,sole:0.085,stat:{bp:0,old:0,big:0}};
function piesGround(x,z,y){try{return typeof rfFloor==='function'?rfFloor(x,z,y):floorAt(x,z);}catch(e){return terrainH(x,z);}}
function piesBones(g){const u=g.userData;if(u.piesB!==undefined)return u.piesB;let L=null,R=null,root=g.children[0];
  if(root)root.traverse(o=>{if(!o.isBone)return;if(o.name==='foot.L'||o.name==='foot_L'||/^foot\.?L$/i.test(o.name))L=o;if(o.name==='foot.R'||o.name==='foot_R'||/^foot\.?R$/i.test(o.name))R=o;});
  u.piesB=(L&&R)?{L,R,root}:null;return u.piesB;}
function piesSkip(g){const u=g.userData;return !g.parent||!g.visible||u.sitting||u.seated||u.pose||u.noPies||u.ride||u.inBoat;}
// gente que se revisa: transeúntes, personajes con nombre y las figuras de Blender sueltas (patrullas)
function piesCollect(){const A=[],seen=new Set(),add=g=>{if(g&&!seen.has(g)){seen.add(g);A.push(g);}};
  try{for(const w of walkers)add(w.g);}catch(e){}try{for(const n of npcObjs)add(n.g);}catch(e){}try{for(const g of BP.list)add(g);}catch(e){}PIES.list=A;}
const PV1=new THREE.Vector3(),PV2=new THREE.Vector3();
function piesFix(g,dt){const u=g.userData,bp=u.bp?piesBones(g):null,root=g.children[0];
  if(bp&&root&&root.visible){g.updateMatrixWorld(true);bp.L.getWorldPosition(PV1);bp.R.getWorldPosition(PV2);const gs=g.scale.y||1,so=PIES.sole*(Math.abs(root.matrixWorld.elements[5])||gs);
    const off=root.position.y*gs,gL=PV1.y-off-so-piesGround(PV1.x,PV1.z,PV1.y-off),gR=PV2.y-off-so-piesGround(PV2.x,PV2.z,PV2.y-off),gap=Math.min(gL,gR);
    PIES.stat.vis=(PIES.stat.vis||0)+1;if(!isFinite(gap)||Math.abs(gap)>1.4){u.piesT=0;PIES.stat.big++;}else u.piesT=Math.max(-0.6,Math.min(0.6,-gap))/gs;
    PIES.max=Math.max(PIES.max,Math.abs(gap));PIES.stat.bp++;return;}
  // figura sencilla: apoyo bajo el centro (se conserva el pequeño bote del paso)
  const x=g.position.x,z=g.position.z,y=g.position.y,gr=piesGround(x,z,y),d=y-gr;
  if(Math.abs(d)>1.4||!isFinite(d))return;if(d<-0.02||d>0.07){g.position.y=gr+Math.min(0.045,Math.max(0,d));PIES.fix++;PIES.stat.old++;PIES.max=Math.max(PIES.max,Math.abs(d));}}
function piesApply(dt){const k=1-Math.exp(-dt*14);for(const g of PIES.list){const u=g.userData;if(u.piesT===undefined)continue;const r=g.children[0];if(!r)continue;
  if(!r.visible||piesSkip(g)){if(r.position.y!==0)r.position.y*=0.8;continue;}r.position.y+=(u.piesT-r.position.y)*k;if(Math.abs(u.piesT-r.position.y)>0.01)PIES.fix++;}}
function piesTick(dt){if(!PIES.on||typeof camera==='undefined'||!state)return;PIES.n++;if(PIES.n%120===1||!PIES.list.length)piesCollect();
  const cx=camera.position.x,cz=camera.position.z,R2=PIES.R*PIES.R,L=PIES.list,N=L.length;if(!N)return;
  // por turnos: unas 40 personas cercanas por fotograma
  let done=0;for(let k=0;k<N&&done<40;k++){const g=L[PIES.i=(PIES.i+1)%N];if(!g||piesSkip(g))continue;const dx=g.position.x-cx,dz=g.position.z-cz;if(dx*dx+dz*dz>R2)continue;
    try{piesFix(g,dt);}catch(e){}done++;}
  piesApply(dt);}
// justo antes de dibujar: así ya se han movido todos (los transeúntes se recolocan después de los demás sistemas)
{const r0=renderer.render.bind(renderer);let last=0;renderer.render=function(sc,cam){try{const now=performance.now();if(sc===scene&&now-last>4){const dt=Math.min(0.05,(now-last)/1000)||0.016;last=now;piesTick(dt);}}catch(e){}return r0(sc,cam);};}
// para las pruebas: cuántos se corrigen y el mayor desfase visto
function piesInforme(){const r={personas:PIES.list.length,medidos:PIES.stat.vis||0,blender:PIES.stat.bp,sencillas:PIES.stat.old,fuera:PIES.stat.big,mayor:+PIES.max.toFixed(3),corregidos:PIES.fix};PIES.stat={bp:0,old:0,big:0};PIES.max=0;PIES.fix=0;return r;}
