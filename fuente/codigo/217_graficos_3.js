// ============================================================ GRÁFICOS (3): mar con rompientes, suelo mojado, caras que hablan, telas al viento,
// barcos en el horizonte, aves que reaccionan, paredes con historia, interiores amueblados y cámara de cine en los diálogos.
// (El pino piñonero y el ciprés de calidad están en 215 / arboles_polyhaven.py; las manchas de las paredes, en triplanar de 036.)
//  X2 Mar: crestas blancas cuando sopla el viento y líneas de rompiente que avanzan hacia la orilla.
//  X3 Suelo mojado: tras la lluvia el suelo se oscurece, brilla a contraluz y quedan charcos que reflejan el cielo; se seca en unas horas.
//  X4 Caras que hablan: quien te habla mueve la cabeza (asiente, ladea). Los modelos no tienen huesos ni formas en la cara, así que
//     la boca y las expresiones no se pueden animar sin rehacer los personajes en Blender.
//  X5 Telas al viento: toldos del mercado, gallardetes en los pórticos y velas de los barcos, según la fuerza del viento.
//  X6 Barcos: trirremes y mercantes (Atenas) o mercantes y barcas (Roma) navegando mar adentro, cerca de donde estés.
//  X7 Aves: palomas en las plazas que alzan el vuelo al acercarte y gaviotas que planean cerca del mar.
//  X8 Paredes con historia: humedad que sube del suelo y manchas (en los materiales de pared, 036).
//  X9 Interiores amueblados: lechos, mesa de tres patas, arcón, telar (casas griegas), lucernas y vajilla según la casa.
//  X10 Cámara de cine: en los diálogos, el fondo se desenfoca por los bordes y una luz cálida ilumina al interlocutor.
const X3={t:0,wetH:-99,ships:[],pig:[],gulls:[],pen:[],awn:[],furn:{},cine:null,key:null,head:null,boot:false};
const x3R=mulberry32(2171);
// ---------------------------------------------------------------- X2 el mar
const X3U={uWc:{value:0}};
function x3Sea(){if(typeof SEA==='undefined'||!SEA||!SEA.material||!SEA.material.userData.shore||SEA.material.userData.x3)return;const m=SEA.material,prev=m.onBeforeCompile;m.userData.x3=1;
  m.onBeforeCompile=function(sh,r){prev.call(this,sh,r);sh.uniforms.uWc=X3U.uWc;sh.fragmentShader='uniform float uWc;\n'+sh.fragmentShader.replace('#include <fog_fragment>',
    '{float wd=length(cameraPosition-vWP);float c1=texture2D(uNrm,vWP.xz/23.0+vec2(uT*0.016,-uT*0.01)).r;float c2=texture2D(uNrm,vWP.xz/61.0-vec2(uT*0.007,uT*0.012)).g;float wc=smoothstep(0.80-uWc*0.12,0.93,c1*0.6+c2*0.5)*uWc*clamp(1.0-wd/1400.0,0.0,1.0);gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(0.93,0.95,0.95),wc*0.7);'+
    'vec2 huv2=(vWP.xz-uHgtB.xy)/uHgtB.z;float ins2=step(0.0,huv2.x)*step(huv2.x,1.0)*step(0.0,huv2.y)*step(huv2.y,1.0)*uHgtB.w;float dep2=vWP.y-texture2D(uHgt,clamp(huv2,0.0,1.0)).r;float brk=ins2*smoothstep(0.75,1.0,sin(dep2*2.2-uT*1.1))*(1.0-smoothstep(0.6,3.5,dep2))*smoothstep(0.05,0.4,dep2);gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(0.95,0.97,0.97),brk*(0.35+0.35*uWc));}\n#include <fog_fragment>');};
  m.needsUpdate=true;}
// ---------------------------------------------------------------- X3 suelo mojado
function x3Wet(){if(typeof TERR_U==='undefined'||!TERR_U.uWet)return;const now=(state.day||1)*24+clock.h;if((WXS.rain||0)>0.15)X3.wetH=now;
  const w=(WXS.rain||0)>0.15?Math.min(1,(WXS.rain||0)*1.4):Math.max(0,1-(now-X3.wetH)/5);const inside=typeof INT2!=='undefined'&&INT2.in;TERR_U.uWet.value=inside?0:w*(gqOn('medio')?1:0.6);
  if(scene.fog)TERR_U.uWetSky.value.copy(scene.fog.color).lerp(new THREE.Color('#ffffff'),0.15);}
// ---------------------------------------------------------------- X4 caras que hablan
function x3TalkHead(){const open=ui==='dialog'&&!$('dialog').hidden;if(!open){X3.head=null;return;}if(!X3.head||!X3.head.parent){let best=null,bd=4.5;for(const g of BP.list){if(!g.parent||!g.visible)continue;const v=g.position,d=Math.hypot(v.x-player.x,v.z-player.z);if(d<bd){bd=d;best=g;}}
  X3.head=null;if(best)best.traverse(o=>{if(o.isBone&&/^head$/i.test(o.name))X3.head=o;});}
  if(X3.head){const t=performance.now()/1000;X3.head.rotation.x+=Math.sin(t*2.1)*0.06+Math.max(0,Math.sin(t*0.9))*0.05;X3.head.rotation.z+=Math.sin(t*0.7)*0.05;X3.head.rotation.y+=Math.sin(t*0.5)*0.06;X3.head.updateMatrixWorld(true);}}
{const f=bpTick;bpTick=function(dt){f(dt);try{x3TalkHead();}catch(e){}};}
// ---------------------------------------------------------------- X5 telas al viento
function x3Pennants(){const ro=MODE==='roma';const P=kPlace(ro?/foro/:/agora/);if(!P)return;const cols=ro?['#9a2a22','#c9a64a']:['#2e4f8a','#b33a2a','#e6dcc0'];
  for(let i=0;i<6;i++){const a=i/6*TAU+0.4,f=findFree(P.x+Math.cos(a)*30,P.z+Math.sin(a)*30,0.6),y=floorAt(f[0],f[1]);const g=grp(f[0],y,f[1],x3R()*TAU);box(0.06,4.2,0.06,lam('#6b4a2c'),0,2.1,0,g);
    const geo=new THREE.PlaneGeometry(1.3,0.45,12,2);geo.translate(0.65,0,0);const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:cols[i%cols.length],side:THREE.DoubleSide}));m.position.set(0.03,3.9,0);g.add(m);
    X3.pen.push({m,base:Float32Array.from(geo.attributes.position.array),ph:x3R()*6});}}
function x3Cloth(){const w=Math.min(2.5,WIND.s?WIND.s.value:1),t=performance.now()/1000;
  for(const P of X3.pen){if(Math.hypot(P.m.parent.position.x-camera.position.x,P.m.parent.position.z-camera.position.z)>120)continue;const a=P.m.geometry.attributes.position,B=P.base;
    for(let i=0;i<a.count;i++){const x=B[i*3],k=x/1.3;a.setZ(i,Math.sin(t*(3+w*2)+x*4+P.ph)*0.16*k*(0.4+w*0.5)+Math.sin(t*7+x*9)*0.03*k);a.setY(i,B[i*3+1]-k*k*0.25*(1.4-Math.min(1.2,w)));}a.needsUpdate=true;P.m.geometry.computeVertexNormals();}
  if(typeof WG2!=='undefined'&&!X3.awnOk&&WG2.mk){X3.awnOk=1;scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='PlaneGeometry'&&o.geometry.parameters.width===2.5&&o.geometry.parameters.height===1.5)X3.awn.push({o,r:o.rotation.x,ph:x3R()*6});});}
  for(const A of X3.awn)A.o.rotation.x=A.r+Math.sin(t*(2+w)+A.ph)*0.03*w;
  for(const S of X3.ships)if(S.sail){S.sail.scale.z=1+0.25*Math.min(1.5,w)+Math.sin(t*1.3+S.ph)*0.05;}}
// ---------------------------------------------------------------- X6 barcos
function x3Ship(kind){const g=new THREE.Group(),wood=lam(kind==='tri'?'#3a2a1e':'#6b4a2c');
  const L=kind==='tri'?36:kind==='mer'?20:7,W=kind==='tri'?4.6:kind==='mer'?6:2.2;const hull=new THREE.Mesh(new THREE.CylinderGeometry(W/2,W/2*0.6,L,10,1,false,0,Math.PI),wood);hull.rotation.set(Math.PI/2,0,Math.PI/2);hull.scale.set(1,1,0.55);hull.position.y=0.6;g.add(hull);
  if(kind==='tri'){const eye=box(0.6,0.6,0.1,lam('#e6dcc0'),L/2-2,1.1,W/2-0.05,g);for(const s of[-1,1])for(let i=0;i<24;i++){const o=box(0.08,0.08,3,wood,-L/2+5+i*1.1,0.5,s*(W/2+1),g);o.rotation.x=s*0.35;}box(1,0.4,0.6,lam('#8a7a6a'),L/2+0.4,0.2,0,g);}
  if(kind!=='bar'||x3R()<0.7){const H=kind==='tri'?11:kind==='mer'?13:4;box(0.25,H,0.25,wood,kind==='mer'?0:2,H/2+0.6,0,g);const sw=kind==='bar'?2.6:kind==='tri'?9:11;const sail=new THREE.Mesh(new THREE.PlaneGeometry(sw,H*0.6),new THREE.MeshLambertMaterial({color:'#e8dcc4',side:THREE.DoubleSide}));
    sail.rotation.y=Math.PI/2;sail.position.set(kind==='mer'?0:2,H*0.62+0.6,0.2);g.add(sail);g.userData.sail=sail;}
  g.traverse(o=>{if(o.isMesh)o.castShadow=false;});return g;}
function x3SeaPoint(r0,r1){for(let k=0;k<24;k++){const a=x3R()*TAU,r=r0+x3R()*(r1-r0),x=player.x+Math.cos(a)*r,z=player.z+Math.sin(a)*r;let ok=true;for(let j=-2;j<=2;j++){if(terrainH(x+j*25,z)>-3||terrainH(x,z+j*25)>-3){ok=false;break;}}if(ok)return [x,z];}return null;}
function x3Ships(dt){if(typeof SEA==='undefined'||!SEA||!SEA.visible||player.x>8000)return;const ro=MODE==='roma',kinds=ro?['mer','mer','bar','bar','mer']:['tri','mer','bar','bar','tri','mer'];
  while(X3.ships.length<kinds.length){const S={g:x3Ship(kinds[X3.ships.length]),kind:kinds[X3.ships.length],ph:x3R()*6,on:false};S.sail=S.g.userData.sail;S.g.visible=false;scene.add(S.g);X3.ships.push(S);}
  for(const S of X3.ships){const g=S.g;const d=Math.hypot(g.position.x-player.x,g.position.z-player.z);
    if(!S.on||d>2200){const p=x3SeaPoint(S.kind==='bar'?250:450,1500);if(!p){g.visible=false;S.on=false;continue;}S.on=true;g.position.set(p[0],0,p[1]);S.h=x3R()*TAU;S.v=S.kind==='tri'?7:S.kind==='mer'?3.5:2;g.visible=true;}
    const nx=g.position.x+Math.sin(S.h)*S.v*dt,nz=g.position.z+Math.cos(S.h)*S.v*dt;if(terrainH(nx,nz)>-2.5||terrainH(nx+Math.sin(S.h)*30,nz+Math.cos(S.h)*30)>-2.5){S.h+=Math.PI*0.6;}else{g.position.x=nx;g.position.z=nz;}
    g.rotation.y=S.h-Math.PI/2;const t=performance.now()/1000;g.position.y=Math.sin(t*0.8+S.ph)*0.25-0.1;g.rotation.z=Math.sin(t*0.6+S.ph)*0.03;}}
// ---------------------------------------------------------------- X7 aves
function x3Pigeons(){const P=kPlace(MODE==='roma'?/foro/:/agora/);if(!P)return;const body=new THREE.SphereGeometry(0.11,8,6);body.scale(1,0.8,1.5);const head=new THREE.SphereGeometry(0.06,6,5);
  for(let i=0;i<14;i++){const g=new THREE.Group(),c=['#8a8f98','#9aa0a8','#6e737c','#b8b8b0'][i%4];const b=new THREE.Mesh(body,lam(c));b.position.y=0.12;g.add(b);const h=new THREE.Mesh(head,lam(c));h.position.set(0,0.22,0.14);g.add(h);
    const wg=[-1,1].map(s=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(0.22,0.1),new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide}));w.position.set(s*0.12,0.16,0);w.rotation.x=-Math.PI/2;g.add(w);return w;});
    const a=x3R()*TAU,r=4+x3R()*14,x=P.x+Math.cos(a)*r,z=P.z+Math.sin(a)*r;g.position.set(x,floorAt(x,z),z);g.rotation.y=x3R()*TAU;scene.add(g);X3.pig.push({g,wg,hx:x,hz:z,st:0,vy:0,vx:0,vz:0,t:0});}}
function x3PigTick(dt){const t=performance.now()/1000;for(const B of X3.pig){const g=B.g,d=Math.hypot(g.position.x-player.x,g.position.z-player.z);
  if(B.st===0){if(d<4.5){B.st=1;const a=Math.atan2(g.position.x-player.x,g.position.z-player.z)+(x3R()-0.5);B.vx=Math.sin(a)*6;B.vz=Math.cos(a)*6;B.vy=4;B.t=0;g.rotation.y=a;}
    else if(x3R()<0.01){g.rotation.y+=x3R()-0.5;}g.children[1].position.y=0.22+Math.max(0,Math.sin(t*6+B.hx))*0.03;}
  else if(B.st===1){B.t+=dt;g.position.x+=B.vx*dt;g.position.z+=B.vz*dt;g.position.y+=B.vy*dt;B.vy=Math.max(1.2,B.vy-dt*1.5);for(const w of B.wg)w.rotation.z=Math.sin(t*28)*0.9*(w.position.x>0?1:-1);if(B.t>6){B.st=2;B.t=0;g.visible=false;}}
  else{B.t+=dt;if(B.t>25&&Math.hypot(B.hx-player.x,B.hz-player.z)>15){B.st=0;g.visible=true;g.position.set(B.hx,floorAt(B.hx,B.hz),B.hz);for(const w of B.wg)w.rotation.z=0;}}}}
function x3Gulls(dt){const nw=performance.now();if(!X3.gt||nw-X3.gt>400){X3.gt=nw;X3.gNear=x3SeaPoint(60,220)!==null;}const near=X3.gNear;if(!X3.gulls.length){for(let i=0;i<6;i++){const g=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:'#f2f2ee',side:THREE.DoubleSide});
    for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.14),m);w.position.x=s*0.27;g.add(w);}const b=new THREE.Mesh(new THREE.SphereGeometry(0.07,6,5),m);b.scale.z=2.5;g.add(b);g.visible=false;scene.add(g);X3.gulls.push({g,ph:i*1.1,r:14+i*5,h:14+i*2});}}
  X3.gN=(X3.gN||0)*0.98+(near?0.02:0);const t=performance.now()/1000;for(const G of X3.gulls){G.g.visible=X3.gN>0.3;if(!G.g.visible)continue;if(!G.c||Math.hypot(G.c[0]-player.x,G.c[1]-player.z)>200){const p=x3SeaPoint(30,150);G.c=p||[player.x,player.z];}
    const a=t*0.25+G.ph;G.g.position.set(G.c[0]+Math.cos(a)*G.r,Math.max(2,G.h+Math.sin(t*0.5+G.ph)*2),G.c[1]+Math.sin(a)*G.r);G.g.rotation.y=-a;const fl=Math.sin(t*6+G.ph)*0.35;G.g.children[0].rotation.z=fl;G.g.children[1].rotation.z=-fl;}}
// ---------------------------------------------------------------- X9 interiores amueblados
function x3Furnish(room,R){if(!R||!R.g||X3.furn[R.X+','+R.Z])return;X3.furn[R.X+','+R.Z]=1;if(!/casa|ins|dom|villa|taller/i.test(room||''))return;const g=R.g,rich=/rica|dom|villa/i.test(room),ro=MODE==='roma';
  const bb=new THREE.Box3().setFromObject(g),c=new THREE.Vector3(),sz=new THREE.Vector3();bb.getCenter(c);bb.getSize(sz);if(sz.x<3||sz.z<3)return;g.worldToLocal(c);
  const sp=R.spawn||[0,0],hw=Math.min(sz.x,sz.z)*0.32,wood=lam(rich?'#5a3a22':'#7a5634'),cloth=lam(rich?(ro?'#8a2a22':'#2e4f8a'):'#b8a888');
  const far=(x,z)=>Math.hypot(x-sp[0],z-sp[1])>2.2,put=(x,z,fn)=>{if(!far(x,z))return;fn(x,z);addBox(R.X+x,R.Z+z,1,1,0);};
  put(c.x-hw,c.z,(x,z)=>{box(0.9,0.45,2.0,wood,x,0.22,z,g);box(0.92,0.12,1.9,cloth,x,0.5,z,g);box(0.9,0.3,0.2,cloth,x,0.6,z-0.9,g);});   // lecho (kline / lectus)
  put(c.x-hw+1.2,c.z,(x,z)=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.4,0.05,16),wood);t.position.set(x,0.6,z);g.add(t);for(let k=0;k<3;k++){const a=k/3*TAU;box(0.05,0.6,0.05,wood,x+Math.cos(a)*0.3,0.3,z+Math.sin(a)*0.3,g);}
    for(let k=0;k<3;k++){const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.04,0.06,10),lam(['#a8603a','#2a2420','#c9a64a'][k]));cup.position.set(x+(k-1)*0.15,0.66,z+0.05);g.add(cup);}
    const lu=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),lam('#a8603a'));lu.scale.set(1.3,0.5,1);lu.position.set(x+0.2,0.65,z-0.2);g.add(lu);});   // mesa de tres patas, vajilla y lucerna
  put(c.x+hw,c.z+hw*0.6,(x,z)=>{box(1.1,0.6,0.6,wood,x,0.3,z,g);box(1.12,0.05,0.62,lam('#8a7a5a'),x,0.62,z,g);});   // arcón
  if(!ro&&/casa/i.test(room))put(c.x+hw,c.z-hw*0.6,(x,z)=>{box(0.08,1.9,0.08,wood,x-0.7,0.95,z,g);box(0.08,1.9,0.08,wood,x+0.7,0.95,z,g);box(1.6,0.08,0.08,wood,x,1.85,z,g);
    for(let k=0;k<14;k++)box(0.01,1.4,0.01,lam('#e6dcc0'),x-0.6+k*0.09,1.1,z,g);for(let k=0;k<14;k++){const p=new THREE.Mesh(new THREE.SphereGeometry(0.04,6,4),lam('#8a7a6a'));p.position.set(x-0.6+k*0.09,0.38,z);g.add(p);}});   // telar vertical con pesas
  if(ro&&rich)put(c.x+hw*0.2,c.z-hw,(x,z)=>{box(0.5,0.9,0.5,lam('#d8d0c0'),x,0.45,z,g);const lar=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,0.4,8),lam('#8a6a3a'));lar.position.set(x,1.1,z);g.add(lar);});}   // larario
{const f=int2Room;int2Room=function(room){const R=f.apply(this,arguments);try{x3Furnish(room,R);}catch(e){console.warn('muebles',e);}return R;};}
// ---------------------------------------------------------------- X10 cámara de cine en los diálogos
function x3Cine(){const open=ui==='dialog'&&!$('dialog').hidden&&gqOn('medio');if(!X3.cine){const d=document.createElement('div');d.id='x3cine';
  d.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:3;opacity:0;transition:opacity .6s;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);mask-image:radial-gradient(ellipse 34% 42% at 50% 42%,transparent 55%,black 100%);-webkit-mask-image:radial-gradient(ellipse 34% 42% at 50% 42%,transparent 55%,black 100%)';
  document.body.appendChild(d);X3.cine=d;X3.key=new THREE.PointLight('#ffc890',0,9,2);scene.add(X3.key);}
  X3.cine.style.opacity=open?'1':'0';const k=X3.key;k.intensity+=((open?0.9:0)-k.intensity)*0.15;if(open){const dir=new THREE.Vector3();camera.getWorldDirection(dir);k.position.copy(camera.position).addScaledVector(dir,1.2);k.position.y+=0.6;}}
// ---------------------------------------------------------------- bucle
{const f=uxTick;uxTick=function(dt){f(dt);if(!state||ui==='start')return;try{dt=Math.min(0.1,dt||0);
  if(!X3.boot&&typeof PLACES!=='undefined'&&PLACES.length>20){X3.boot=true;if(gqOn('medio')){x3Pennants();x3Pigeons();}}
  X3U.uWc.value=Math.max(0,Math.min(1,((WIND.s?WIND.s.value:1)-0.9)*0.9));x3Sea();x3Wet();x3Cine();
  const inside=typeof INT2!=='undefined'&&INT2.in;if(!inside){x3Cloth();if(gqOn('medio'))x3Ships(dt);x3PigTick(dt);x3Gulls(dt);}
  }catch(e){if(!X3.err){X3.err=String(e&&e.stack||e).slice(0,300);console.warn('graficos 3',e);}}};}
