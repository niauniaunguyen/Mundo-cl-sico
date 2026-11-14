// ============================================================ EL CAMINO DE ILIÓN: de la playa del desembarco a la ciudad, por la llanura del Escamandro
// Jerjes subió desde la costa a la ciudadela de Príamo en el 480 (Heródoto 7, 43); Alejandro desembarcará en el «puerto de los aqueos» y
// subirá a Ilión en el 334 (Arriano, Anábasis 1, 11-12). El trazado exacto no se conoce: aquí es un sendero de tierra que va del puerto a
// uno de los huecos de las murallas en ruinas, con un vado de piedras si cruza el Escamandro. Se monta al entrar en Troya (el puerto se
// define después de buildTroy). Sin R().
const ILR={built:false,t:0};
function ilionRoad(){const T=ISLANDS.find(I=>I.id==='troya'),P=PORTS.troya,h=T&&T.hill;if(!T||!P||!h)return false;
  // el hueco de la muralla (segmentos i%5===3 de buildTroy, radio 72) más orientado hacia el puerto
  const toP=Math.atan2(P.z-h.z,P.x-h.x);let best=null,bd=1e9;
  for(let i=3;i<36;i+=5){const a=(i+0.5)/36*TAU,d=Math.abs(((a-toP+Math.PI)%TAU+TAU)%TAU-Math.PI);if(d<bd){bd=d;best=a;}}
  const G={x:h.x+Math.cos(best)*86,z:h.z+Math.sin(best)*86},IN={x:h.x+Math.cos(best)*58,z:h.z+Math.sin(best)*58};
  // curva suave (Bézier cuadrática) del puerto al hueco, y luego recto hasta dentro
  const A={x:P.x+Math.cos(toP+Math.PI)*-6,z:P.z+Math.sin(toP+Math.PI)*-6},dx=G.x-A.x,dz=G.z-A.z,L=Math.hypot(dx,dz)||1,C={x:(A.x+G.x)/2-dz/L*55,z:(A.z+G.z)/2+dx/L*55};
  const pts=[];for(let i=0;i<=22;i++){const t=i/22,u=1-t;pts.push([u*u*A.x+2*u*t*C.x+t*t*G.x,u*u*A.z+2*u*t*C.z+t*t*G.z]);}pts.push([IN.x,IN.z]);
  const mat=lam('#8f7650'),stone=lam('#9a9284');let ford=0;
  for(let i=0;i<pts.length-1;i++){const[a,b]=[pts[i],pts[i+1]];let wet=null;try{wet=riverWater((a[0]+b[0])/2,(a[1]+b[1])/2);}catch(e){}
    if(wet===null){drapeStrip(a[0],a[1],b[0],b[1],2.6,mat,0.06);continue;}
    // vado: piedras pasaderas planas a lo ancho del cauce
    ford++;const sx=b[0]-a[0],sz=b[1]-a[1],sl=Math.hypot(sx,sz)||1;for(let k=0;k<=Math.ceil(sl/1.4);k++){const t=k/Math.ceil(sl/1.4),x=a[0]+sx*t,z=a[1]+sz*t,y=Math.max(terrainH(x,z),wet)+0.05;
      const s=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.65,0.35,7),stone);s.position.set(x,y,z);s.rotation.y=k*1.3;s.castShadow=s.receiveShadow=true;scene.add(s);addPlat&&addPlat(x,z,1.1,1.1,0,y+0.17);}}
  placeLive('puerto_aqueos','La playa de los aqueos','ΑΧΑΙΩΝ ΛΙΜΗΝ','Aquí, según la tradición, varaban sus naves los aqueos durante los diez años de la guerra: por eso lo llaman el puerto de los aqueos. Desde la playa, un camino de tierra cruza la llanura del Escamandro y sube a Ilión. Por él subió Jerjes en el 480, camino de Grecia con su ejército, para ver la ciudadela de Príamo y sacrificar mil bueyes a Atenea de Ilión (Heródoto 7, 43). Dentro de cincuenta años lo recorrerá Alejandro Magno: desembarcará aquí y subirá a Ilión a ofrecer sacrificios (Arriano, Anábasis 1, 11-12). El trazado del camino del juego es una reconstrucción: el exacto no se conoce.'+(ford?' A mitad de camino se vadea el Escamandro por unas piedras pasaderas.':''),P.x+Math.cos(toP)*8+Math.cos(toP+Math.PI/2)*5,P.z+Math.sin(toP)*8+Math.sin(toP+Math.PI/2)*5,-toP+Math.PI/2);
  ILR.ford=ford;ILR.pts=pts;return true;}
function ilrTick(dt){if(ILR.built||!state||MODE==='roma'||ui==='start')return;ILR.t-=dt;if(ILR.t>0)return;ILR.t=2;let r=null;try{r=regionOf(player.x);}catch(e){}if(r!=='troya')return;ILR.built=true;try{ilionRoad();}catch(e){}}
