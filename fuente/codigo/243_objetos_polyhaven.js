// ============================================================ OBJETOS ESCANEADOS DE POLY HAVEN (CC0) en mercados, casas y calles (22/11)
// Modelos realistas (no low poly) de https://polyhaven.com, aligerados en Blender (herramientas/blender/objetos_polyhaven.py → #glbob,
// en segundo plano): olla de barro, hogar de piedras, cesto y cesta de mimbre, cuencos, cuchara, plato y tabla de madera, taburete rústico,
// granadas, manzanas y cebollas; y, solo en el modo Roma, cubos y tinas de duelas con aros (no hay certeza de que se usaran así en la
// Grecia del 386 a.C.). Se descartaron los jarrones de porcelana y loza esmaltada, la jarra con flores, la escalera de tijera y el taburete
// torneado de Poly Haven: son modernos.
//  · Mercado: en los puestos de fruta, las bolas de colores se cambian por cestos de mimbre llenos de granadas, manzanas y cebollas;
//    en todos los puestos, una cesta o una olla en el suelo.
//  · Interiores de las casas: sobre la mesa de tres patas, un plato con granadas, un cuenco y una cuchara; junto a la pared, una olla,
//    una cesta y un taburete.
//  · Calles: junto a algunas puertas de las casas cercanas, una olla, un cesto con cebollas o una tina (Roma).
// Las granadas son de la tierra: Perséfone comió sus granos en el Hades (Himno homérico a Deméter 371-374). La cebolla era comida de pobres
// y de soldados (Aristófanes, Acarnienses 550; Jenofonte, Banquete IV 8).
const OBP={tpl:null,loading:false,stalls:[],rooms:[],doors:[],t:0,n:0};
function obpLoad(){if(OBP.loading||OBP.tpl||typeof bpBytes!=='function'||!THREE.GLTFLoader)return;OBP.loading=true;
  bpBytes('glbob').then(buf=>{if(!buf)return;new THREE.GLTFLoader().parse(buf,'',gl=>{const T={};gl.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(/^O_/.test(o.name))T[o.name.slice(2)]=o;}});OBP.tpl=T;},e=>console.warn('objetos',e));}).catch(e=>console.warn('objetos',e));}
{const f=chooseMode;chooseMode=function(){const r=f.apply(this,arguments);try{setTimeout(obpLoad,2500);}catch(e){}return r;};}
function obp(k,x,y,z,ry,s){const T=OBP.tpl&&OBP.tpl[k];if(!T)return null;const m=T.clone();m.position.set(x,y,z);m.rotation.set(0,ry||0,0);if(s)m.scale.setScalar(s);OBP.n++;return m;}
// un cesto lleno: cesto abierto y fruta amontonada encima
function obpBasket(par,x,y,z,ry,fruit){const b=obp('cesto',x,y,z,ry);if(!b)return;par.add(b);const F=fruit||'granada';
  for(let j=0;j<7;j++){const a=j*2.4,r=j?0.08+0.03*(j%2):0;const f=obp(F,x+Math.cos(a)*r,y+0.08+(j?0:0.04),z+Math.sin(a)*r*0.7,a);if(f)par.add(f);}}
// ---- mercado (214)
{const f=w2Stall;w2Stall=function(x,z,a,ro,i){const n0=scene.children.length;const r=f.apply(this,arguments);try{const g=scene.children[scene.children.length-1];if(g&&g.isGroup&&scene.children.length>n0)OBP.stalls.push({g,kind:i%4,i});}catch(e){}return r;};}
function obpStalls(){for(const S of OBP.stalls){if(S.done)continue;S.done=true;const g=S.g;
  if(S.kind===1){for(const c of g.children){const y=c.position.y;if(y>0.9&&y<1.1)c.visible=false;}   // las bolas de colores y sus cajas
    const fr=['granada','manzana','cebolla','granada','manzana'];for(let k=0;k<5;k++)obpBasket(g,-0.8+k*0.4,0.89,0.1,k,fr[k]);}
  const k=['olla','cesta','olla','cesta'][S.i%4];const o=obp(k,0.6,0,0.75,S.i);if(o)g.add(o);
  if(MODE==='roma'&&S.i%3===0){const t=obp('tina',-0.6,0,0.85,S.i);if(t)g.add(t);}}}
// ---- interiores (217 x3Furnish)
{const f=x3Furnish;x3Furnish=function(room,R){const had=R&&X3.furn[R.X+','+R.Z];const r=f.apply(this,arguments);try{if(!had&&R&&R.g&&/casa|ins|dom|villa|taller/i.test(room||''))OBP.rooms.push({R,room});}catch(e){}return r;};}
function obpRooms(){for(const Q of OBP.rooms){if(Q.done)continue;Q.done=true;const R=Q.R,g=R.g;
  const bb=new THREE.Box3().setFromObject(g),c=new THREE.Vector3(),sz=new THREE.Vector3();bb.getCenter(c);bb.getSize(sz);if(sz.x<3||sz.z<3)continue;g.worldToLocal(c);const hw=Math.min(sz.x,sz.z)*0.32,sp=R.spawn||[0,0];
  const far=(x,z)=>Math.hypot(x-sp[0],z-sp[1])>2.2;
  // la mesa de tres patas de 217 está en (c.x-hw+1.2, 0.6, c.z): plato con granadas, cuenco y cuchara
  const tx=c.x-hw+1.2,tz=c.z;if(far(tx,tz)){const p=obp('plato',tx-0.12,0.63,tz-0.08,0.4);if(p){g.add(p);for(let j=0;j<3;j++){const f=obp('granada',tx-0.12+(j-1)*0.08,0.66,tz-0.08+(j%2)*0.05,j);if(f)g.add(f);}}
    const cu=obp('escudilla',tx+0.16,0.63,tz+0.1,1);if(cu)g.add(cu);const sp2=obp('cuchara',tx+0.05,0.635,tz+0.2,2.2);if(sp2)g.add(sp2);}
  // junto a la pared del fondo: olla, cesta y taburete
  const wx=c.x+hw*0.3,wz=c.z-hw*0.95;if(far(wx,wz)){for(const[k,dx,ry]of[['olla',0,0.3],['cesta',0.45,1.2],['taburete',-0.5,0.2]]){const o=obp(k,wx+dx,0,wz,ry);if(o)g.add(o);}}}}
// ---- calles: junto a algunas puertas de las casas cercanas (por turnos, solo cerca)
function obpDoors(){if(typeof footprints==='undefined')return;const P=player,R=55;let made=0;
  if(OBP.doors.length>=60){for(let i=OBP.doors.length-1;i>=0;i--){const g=OBP.doors[i];if(Math.hypot(g.position.x-P.x,g.position.z-P.z)>140){scene.remove(g);OBP.doors.splice(i,1);if(g.userData.fp)g.userData.fp.obp=0;}}}
  for(const f of footprints){if(made>3||OBP.doors.length>=60)break;if(!f.house||f.obp)continue;const d=Math.hypot(f.x-P.x,f.z-P.z);if(d>R||d<8)continue;
    const h=Math.sin(f.x*12.9898+f.z*78.233)*43758.5453,r=h-Math.floor(h);f.obp=1;if(r>0.28)continue;
    const a=f.a||0,side=r<0.14?1:-1,lz=side*(f.d/2+0.35),lx=(r*7%1-0.5)*f.w*0.5,ca=Math.cos(a),sa=Math.sin(a),x=f.x+lx*ca+lz*sa,z=f.z-lx*sa+lz*ca;
    try{if(typeof roadDist==='function'&&roadDist(x,z)<1.0)continue;}catch(e){}const y=floorAt(x,z),g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=a;
    const pick=r<0.07?['olla','cesta']:r<0.14?['cesto']:r<0.21?(MODE==='roma'?['tina','olla']:['olla','olla']):['cesta','taburete'];
    pick.forEach((k,j)=>{if(k==='cesto'){obpBasket(g,j*0.5,0,0,j,'cebolla');return;}const o=obp(k,j*0.5,0,0,j*1.3+r*6);if(o)g.add(o);});
    g.userData.fp=f;scene.add(g);OBP.doors.push(g);made++;}}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!OBP.tpl){if(state&&ui!=='start'&&!OBP.loading)obpLoad();}else{OBP.t-=dt;if(OBP.t<=0){OBP.t=1.2;obpStalls();obpRooms();obpDoors();}}}catch(e){if(!OBP.err){OBP.err=1;console.warn('obp',e);}}return r;};}
