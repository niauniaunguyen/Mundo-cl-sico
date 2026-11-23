// ============================================================ BESTIARIO: 37 PORTALES DE LEYENDA MÁS (23/11: «hazlos todos», hasta llegar a 50 criaturas)
// Cada criatura tiene su portal en el destino que le corresponde (se abren con los demás, tras huir de Cnosos). Como en todos: nadie sale
// herido; se esquiva, se usa el escudo (Q) y se reúnen 20 orbes de Niké. Modelos: Blender (criaturas.py: lotes 1 y 2) y las personas de
// Blender del juego (gigantes, Argos, Tritón, Erinias...). Para no hacer 37 sistemas distintos, hay unas pocas maneras de jugar:
//  · embiste (como el león, 210/250) · lanza desde el fondo (como Gerión) · ataca con la cabeza tras un aviso (como Ladón)
//  · cosas que caen del cielo (como las aves) · cruzan la arena al galope (como las yeguas) y otras propias: la mirada de Medusa,
//    los cien ojos de Argos, el remolino de Caribdis y el canto de las Sirenas, los vientos de Escirón, acercarse a Pegaso sin correr,
//    acompañar a la serpiente de Esculapio y las preguntas de la Esfinge y de las Erinias.
// Anacronismos señalados: las versiones que solo cuentan autores posteriores al 386 a.C. (Apolonio, Virgilio, Ovidio, Valerio Máximo...)
// se marcan como tales en el modo Atenas.
const BEST={keys:[]};
function bestRo(){return typeof MODE!=='undefined'&&MODE==='roma';}
function bestLate(txt){return bestRo()?'':'<p class="sub"><b>Anacronismo señalado:</b> '+txt+'</p>';}
// ---- personas de Blender (o figura sencilla) para gigantes y otros
function bestHuman(kind,cfg,sc,tint){let g=null;if(typeof bpMake==='function'&&BP.tpl&&BP.tpl[kind]){g=bpMake(kind,cfg||{});if(g)g.userData.noBlender=1;}
  if(!g){g=makePerson(Object.assign({noVary:true,noBlender:true},cfg||{}));}g.scale.setScalar(sc||1);if(tint)herTint(g,tint.c,tint.m);return g;}
function bestAnim(g,dt,walk){const B=g&&g.userData&&g.userData.bp;if(!B||!B.mix)return;if(B.walk)B.walk.setEffectiveWeight(walk||0);if(B.idle)B.idle.setEffectiveWeight(1-(walk||0));B.mix.update(dt);}
function bestOneEye(g,y){const e=new THREE.Mesh(new THREE.SphereGeometry(0.06,10,8),new THREE.MeshPhongMaterial({color:'#f4f0e0',emissive:new THREE.Color('#302010')}));e.position.set(0,y,0.11);g.add(e);const p=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),lam('#1a1208'));p.position.set(0,y,0.165);g.add(p);
  g.traverse(o=>{if(o.isMesh&&/ojos/.test(o.name))o.visible=false;});return g;}
// ---- proyectiles
const BEST_PROJ={piedra:()=>new THREE.Mesh(new THREE.DodecahedronGeometry(0.45,0),lam('#7a7062')),
  fuego:()=>{const m=new THREE.Mesh(LEG_FIRE,LEG_FIREM),gl=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ff8a30',transparent:true,opacity:0.85,blending:THREE.AdditiveBlending,depthWrite:false}));gl.scale.set(1.6,1.6,1);m.add(gl);return m;},
  yunque:()=>new THREE.Mesh(new THREE.BoxGeometry(0.6,0.35,0.35),new THREE.MeshPhongMaterial({color:'#4a4a50',shininess:60})),
  agua:()=>new THREE.Mesh(new THREE.SphereGeometry(0.45,10,8),new THREE.MeshPhongMaterial({color:'#6fb6d8',transparent:true,opacity:0.7,shininess:90})),
  anfora:()=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.2,0.6,8),lam('#a85a32'));return m;},
  oro:()=>new THREE.Mesh(new THREE.DodecahedronGeometry(0.25,0),new THREE.MeshPhongMaterial({color:'#e8b030',shininess:90})),
  pluma:()=>new THREE.Mesh(LEG_FEATHER,LEG_BRONZE),
  chispa:()=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ffb040',transparent:true,opacity:0.9,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(0.9,0.9,1);return s;}};
function bestRing(R,x,z,t,r){const m=new THREE.Mesh(new THREE.RingGeometry(0.25,r||1.4,24),new THREE.MeshBasicMaterial({color:'#c0402a',transparent:true,opacity:0.4,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,0.06,z);R.g.add(m);return {m,t};}
function bestMarks(A,R,dt){A.marks=A.marks||[];for(let i=A.marks.length-1;i>=0;i--){const k=A.marks[i];k.t-=dt;k.m.material.opacity=0.25+0.4*Math.abs(Math.sin(k.t*8));if(k.t<=0){R.g.remove(k.m);A.marks.splice(i,1);}}}
// ---- común a todas: textos, escenario, registro
function bestDef(key,c){const L=Object.assign({title:()=>c.t,rule:c.rule,lose:c.lose||'La leyenda te ha alcanzado tres veces.',win:c.win,myth:'<p class="sub">'+c.myth+'</p>'+(c.late?bestLate(c.late):''),
    build(){return herArena(key,c.c1||'#7a7458',c.c2||'#625e48',Object.assign({zn:c.zn},c.arena||{}));}},c.extra||{});
  LEG[key]=L;LEY_ROOMS.push(key);LEG_ORDER.push(key);BEST.keys.push(key);
  for(const id of c.at||[])LEY_DEST.atenas.push([id,key]);for(const id of c.ro||[])LEY_DEST.roma.push([id,key]);if(c.menuRo)LEY_HER.push(key);return L;}

// ==================================================================== MANERAS DE JUGAR
// (1) embiste: el cargador de 250 (cuadrúpedos de Blender)
function bestCharger(key,c){const C=herCharger(key,Object.assign({who:c.who,model:c.model,scale:c.scale||1,tint:c.tint,metal:c.metal,col:c.col||'#6a5a4a',len:1,h:0.9,title:()=>c.t,rule:c.rule,lose:c.lose||'Te ha derribado tres veces.',win:c.win,myth:'<p class="sub">'+c.myth+'</p>'+(c.late?bestLate(c.late):''),
    build(){return herArena(key,c.c1,c.c2,Object.assign({zn:c.zn},c.arena||{}));}},c.extra||{}));
  LEY_ROOMS.push(key);LEG_ORDER.push(key);BEST.keys.push(key);for(const id of c.at||[])LEY_DEST.atenas.push([id,key]);for(const id of c.ro||[])LEY_DEST.roma.push([id,key]);if(c.menuRo)LEY_HER.push(key);return C;}
// (2) lanza desde el fondo: units(R) -> [{g, y}] (de dónde sale cada tiro); proj, per, multi
function bestThrower(key,c){return bestDef(key,Object.assign({},c,{extra:Object.assign({
  reset(R){const A=this;if(!A.U){A.U=c.units(R);}A.t=2.5;A.per=c.per||2.4;A.warn=[];bestMarks(A,R,99);LEY.extra='<span>'+c.who+'</span>';},
  tick(dt,t,act){const A=this,R=LEY.R;if(!A.U||!R)return;const P=player;for(const u of A.U){u.g.rotation.y=Math.atan2(P.x-R.X-u.g.position.x,P.z-R.Z-u.g.position.z);bestAnim(u.g,dt,0);if(u.tick)u.tick(dt,t);}
    bestMarks(A,R,dt);if(!act)return;
    for(let i=A.warn.length-1;i>=0;i--){const w=A.warn[i];w.t-=dt;if(w.t>0)continue;A.warn.splice(i,1);const u=w.u,from=new THREE.Vector3(R.X+u.g.position.x,R.Y+(u.y||5),R.Z+u.g.position.z),to=new THREE.Vector3(R.X+w.x,R.Y,R.Z+w.z),T=1.3,v=to.clone().sub(from).divideScalar(T);v.y+=0.5*9*T;
      legShot(BEST_PROJ[c.proj||'piedra'](),from,v,{g:9,r:0.6,life:3,cost:0.3});try{legSfx(c.proj==='fuego'?'fire':'clang');}catch(e){}}
    A.t-=dt;if(A.t>0)return;A.t=A.per*(0.7+Math.random()*0.6);const u=A.U[Math.floor(Math.random()*A.U.length)];
    for(let k=0;k<(c.multi||1);k++){const x=P.x-R.X+LEY.pv.x*1.3+(k?(Math.random()-0.5)*5:0),z=P.z-R.Z+LEY.pv.z*1.3+(k?(Math.random()-0.5)*5:0);A.marks.push(bestRing(R,x,z,2.3));A.warn.push({u,x,z,t:1.0});}},
  orbOk:c.orbOk||((x,z)=>z>-8.5),
  onOrb(n){if(n%4===0)this.per=Math.max(c.minPer||1.1,this.per-0.3);},end(){LEY.extra='<span>'+c.who+': '+(c.rest||'descansa')+'</span>';}},c.extra2||{})}));}
// (3) ataca con la cabeza tras un aviso: spots = [[x,z,escala]]; modelo serpiente (serp) o Ladón; teñido opcional
function bestStriker(key,c){return bestDef(key,Object.assign({},c,{extra:Object.assign({
  unit(R,x,z,s){const g=new THREE.Group();g.position.set(x,c.sink||0,z);R.g.add(g);let head=null,cr=false;
    if(crbHas('serp')){const b=crbPart('CR_serp_cuerpo');b.position.set(0,0,0);g.add(b);const h=crbPart('CR_serp_cabeza');if(h){head=new THREE.Group();head.position.copy(h.position);h.position.set(0,0,0);head.add(h);g.add(head);}cr=true;if(c.tint)herTint(g,c.tint,c.metal);}
    else{const m=lam(c.col||'#3a5a2a');for(let i=0;i<24;i++){const a=i*0.5,q=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,6),m);q.position.set(Math.cos(a)*(1.3-i*0.04),0.2+i*0.06,Math.sin(a)*(1.3-i*0.04));g.add(q);}head=new THREE.Group();head.position.set(0,1.7,1.0);const hm=new THREE.Mesh(new THREE.SphereGeometry(0.22,10,8),m);hm.scale.z=1.8;hm.position.z=0.3;head.add(hm);g.add(head);}
    g.scale.setScalar(s||1);return {g,head,cr,p0:head?head.position.clone():null,s:s||1};},
  reset(R){const A=this;if(!A.U||(crbHas('serp')&&!A.U[0].cr)){if(A.U)for(const u of A.U)R.g.remove(u.g);A.U=(c.spots||[[0,-9,1.6]]).map(([x,z,s])=>A.unit(R,x,z,s));if(c.decor)c.decor(R,A);}
    A.st='mira';A.t=2.2;A.per=c.per||2.6;A.cur=null;A.out=0;if(!A.glow){A.glow=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ffd040',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));A.glow.scale.set(1.6,1.6,1);R.g.add(A.glow);}LEY.extra='<span>'+c.who+': vigila</span>';},
  tick(dt,t,act){const A=this,R=LEY.R;if(!A.U||!R)return;if(crbHas('serp')&&!A.U[0].cr){const st=A.st;A.reset(R);A.st=st;}const P=player,px=P.x-R.X,pz=P.z-R.Z;
    for(const u of A.U){if(A.st==='ataca'&&u===A.cur)continue;u.g.rotation.y+=((Math.atan2(px-u.g.position.x,pz-u.g.position.z))-u.g.rotation.y)*Math.min(1,dt*1.5);if(u.head){u.g.updateMatrixWorld(true);u.head.lookAt(P.x,R.Y+1.2,P.z);}}
    const u=A.cur;if(u&&u.head){const hw=new THREE.Vector3();u.head.getWorldPosition(hw);A.glow.position.set(hw.x-R.X,hw.y-R.Y,hw.z-R.Z);}A.glow.material.opacity=A.st==='aviso'?0.6+0.4*Math.sin(t*20):0;
    if(A.st==='ataca'&&u){A.out+=dt;const k=A.out<0.35?A.out/0.35:Math.max(0,1-(A.out-0.35)/0.6);if(u.head&&u.p0){const ry=u.g.rotation.y,cs=Math.cos(ry),sn=Math.sin(ry),lx=A.wd.x*cs-A.wd.z*sn,lz=A.wd.x*sn+A.wd.z*cs,L=(c.reach||7)/u.s;u.head.position.set(u.p0.x+lx*k*L,u.p0.y-k*1.4/u.s,u.p0.z+lz*k*L);}
      if(A.out>0.95){A.st='mira';A.t=A.per*(0.7+Math.random()*0.6);if(u.head)u.head.position.copy(u.p0);LEY.extra='<span>'+c.who+': vigila</span>';leyHud();}}
    if(!act)return;
    if(A.st==='mira'){A.t-=dt;if(A.t<=0){A.cur=A.U[Math.floor(Math.random()*A.U.length)];A.st='aviso';A.t=0.9;LEY.extra='<span style="color:#ff9a5a">'+c.who+': ¡va a atacar!</span>';leyHud();try{legSfx('fire');}catch(e){}}}
    else if(A.st==='aviso'){A.t-=dt;if(A.t<=0){const ux=A.cur.g.position.x,uz=A.cur.g.position.z,dx=px-ux,dz=pz-uz,L=Math.hypot(dx,dz)||1;A.wd={x:dx/L,z:dz/L};A.st='ataca';A.out=0;}}},
  hitTest(P){const A=this,R=LEY.R;if(A.st!=='ataca'||A.out<0.2||A.out>0.6||!A.wd||!A.cur)return false;const px=P.x-R.X-A.cur.g.position.x,pz=P.z-R.Z-A.cur.g.position.z,along=px*A.wd.x+pz*A.wd.z,side=Math.abs(-px*A.wd.z+pz*A.wd.x);
    if(along<0.5||along>(c.reach||7)+3||side>1.1)return false;if(LEY_SH.up&&LEY_SH.st>0){const f=-Math.sin(player.yaw)*A.wd.x+-Math.cos(player.yaw)*A.wd.z;if(f<-0.3){LEY_SH.st=Math.max(0,LEY_SH.st-0.45);legSfx('clang');LEY.inv=0.8;A.out=0.61;return false;}}A.out=0.61;return true;},
  orbOk:c.orbOk||((x,z)=>{for(const[sx,sz]of(c.spots||[[0,-9]]))if(Math.hypot(x-sx,z-sz)<3)return false;return true;}),
  onOrb(n){if(n%4===0)this.per=Math.max(1.2,this.per-0.35);if(c.onOrb2)c.onOrb2.call(this,n);},end(){this.st='duerme';LEY.extra='<span>'+c.who+': '+(c.rest||'se enrosca y duerme')+'</span>';}},c.extra2||{})}));}
// (4) caen del cielo: voladores (mk(R) -> {g, wings}) que dan vueltas y sueltan proj; sombra 1,1 s antes
function bestRain(key,c){return bestDef(key,Object.assign({},c,{extra:Object.assign({
  reset(R){const A=this;if(A.F)for(const f of A.F)R.g.remove(f.g);A.F=[];for(let i=0;i<(c.n||4);i++){const f=c.mk(R,i);f.a=Math.random()*TAU;f.r=6+Math.random()*6;f.h=(c.h||7)+Math.random()*3;f.sp=(0.25+Math.random()*0.2)*(Math.random()<0.5?1:-1);f.ph=Math.random()*TAU;A.F.push(f);}
    A.t=2.5;A.per=c.per||2.4;bestMarks(A,R,99);LEY.extra='<span>'+c.who+'</span>';},
  tick(dt,t,act){const A=this,R=LEY.R;if(!A.F||!R)return;for(const f of A.F){f.a+=f.sp*dt;const x=Math.cos(f.a)*f.r,z=Math.sin(f.a)*f.r;f.g.position.set(x,f.h+Math.sin(t*0.7+f.ph)*0.8,z);f.g.rotation.y=Math.atan2(-Math.sin(f.a)*f.sp,Math.cos(f.a)*f.sp);
      if(f.wings&&f.wings.length===2){const fl=Math.sin(t*7+f.ph)*0.6;f.wings[0].rotation.z=fl;f.wings[1].rotation.z=-fl;}}
    bestMarks(A,R,dt);if(!act)return;A.t-=dt;if(A.t>0)return;A.t=A.per*(0.7+Math.random()*0.6);const f=A.F[Math.floor(Math.random()*A.F.length)],P=player,tx=P.x-R.X+LEY.pv.x,tz=P.z-R.Z+LEY.pv.z;
    A.marks.push(bestRing(R,tx,tz,1.1,1.5));try{legSfx('screech');}catch(e){}
    for(let k=0;k<(c.multi||3);k++){const ex=tx+(Math.random()-0.5)*1.6,ez=tz+(Math.random()-0.5)*1.6,from=new THREE.Vector3(R.X+f.g.position.x,R.Y+f.g.position.y,R.Z+f.g.position.z),to=new THREE.Vector3(R.X+ex,R.Y,R.Z+ez),T=1.1,v=to.clone().sub(from).divideScalar(T);v.y+=0.5*2*T;
      legShot(BEST_PROJ[c.proj||'pluma'](),from,v,{g:2,r:0.42,orient:c.proj==='pluma',life:3});}},
  onOrb(n){if(n%3===0)this.per=Math.max(1.0,this.per-0.25);},end(){for(const f of this.F)f.r+=20;}},c.extra2||{})}));}
// (5) cruzan la arena: mk(R) -> {g, legs}; franja de polvo 1,2 s antes
function bestLanes(key,c){const Y=LEG.yeguas;return bestDef(key,Object.assign({},c,{extra:Object.assign({
  mkMare(R){const M=c.mk(R);M.g.visible=false;if(!M.legs)M.legs=[];return M;},reset:Y.reset,lane:Y.lane,
  tick(dt,t,act){const r=Y.tick.call(this,dt,t,act);if(this.mares)for(const m of this.mares){if(m.M.g.visible){if(c.fly)m.M.g.position.y=c.fly;bestAnim(m.M.human,dt,1);}}if(LEY.extra&&LEY.extra.indexOf('Yeguas')>=0)LEY.extra=LEY.extra.replace('Yeguas',c.who);return r;},
  hitTest:Y.hitTest,onOrb(n){Y.onOrb.call(this,n);if(LEY.extra)LEY.extra=LEY.extra.replace('Yeguas',c.who);if(c.onOrb2)c.onOrb2.call(this,n);},end:Y.end},c.extra2||{})}));}
// (6) preguntas (Esfinge, Erinias): cada 4 orbes, una pregunta; si fallas, cuenta como golpe
function bestQuiz(L,Q,who){const f=L.onOrb;L.onOrb=function(n){if(f)f.call(this,n);if(n%4!==0||!LEY.on)return;const q=Q[(n/4-1)%Q.length];
  int2Dlg('?',who,q[0],'<p>'+q[1]+'</p>');const box=$('dOpts');box.innerHTML='';q[2].forEach((o,i)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(i+1)+'</span><span>'+o+'</span>';
    b.onclick=()=>{closeDialog();if(i===q[3])toast('<span class="label">¡Bien!</span><br>'+q[4]);else{toast('<span class="label">No</span><br>'+q[4]);legHurt();}};box.appendChild(b);});};return L;}
// (7) el cargador con persona de Blender (Anteo)
function bestHumanCharger(key,c){const C=bestCharger(key,c);C.mk=function(R){const g=bestHuman(c.kind||'obrero',c.cfg,c.scale||2.2,c.htint);R.g.add(g);return {g,legs:[],body:new THREE.Object3D(),human:true};};
  const t0=C.tick;C.tick=function(dt,t,act){const r=t0.call(this,dt,t,act);if(this.lion)bestAnim(this.lion.g,dt,this.st==='embiste'?1:this.st==='acecha'?0.6:0);return r;};return C;}

// ==================================================================== LAS 37
const GIANT=(kind,col,sc,x,z,tint)=>R=>{const g=bestHuman(kind,{chiton:col},sc,tint);g.position.set(x,0,z);R.g.add(g);return g;};
// ---- 14 Medusa y las Gorgonas: no mirarlas (solo en el reflejo del escudo)
bestDef('medusa',{t:'Medusa y las Gorgonas',who:'Las Gorgonas',at:['argos'],ro:['cyrene'],c1:'#6a6a5a',c2:'#4e4e44',arena:{rocks:30,rockC:'#7a7a70',seed:31},zn:['La guarida de las Gorgonas','ΓΟΡΓΟΝΕΣ','Leyenda · Hesíodo, Teogonía 274-283'],
  rule:'Las tres Gorgonas se acercan despacio. <b>No las mires de frente</b>: si las tienes delante en la pantalla más de medio segundo, te quedas de piedra (cuenta como golpe). Con el <b>escudo alzado</b> (Q) las ves en su reflejo, como Perseo, y no pasa nada. Tampoco dejes que te toquen.',
  win:'«Veinte orbes sin mirarlas a los ojos. Las Gorgonas se cubren la cara y se retiran a su cueva.»',
  myth:'En el mito, Perseo cortó la cabeza de Medusa, la única Gorgona mortal, mirándola en el reflejo de su escudo de bronce, con las sandalias aladas y el casco de Hades (Hesíodo, Teogonía 274-283; Apolodoro II 4,2-3). De su cuello nacieron Pegaso y Crisaor. Aquí nadie corta nada.',
  extra:{reset(R){const A=this;if(A.G&&!A.gcr&&crbHas('gorgona')){for(const G of A.G)R.g.remove(G.g);A.G=null;}if(!A.G){A.gcr=crbHas('gorgona');A.G=[];for(let i=0;i<3;i++){const g=bestHuman('mujer',{chiton:'#3a4a2a',himation:'#2a3020'},1.15);
        const H=crbPart('CR_gorgona_cabeza');if(H){g.traverse(o=>{if(o.isMesh&&/cabeza|pelo|ojos/.test(o.name))o.visible=false;});let hb=null;g.traverse(o=>{if(o.isBone&&o.name==='head')hb=o;});R.g.add(g);g.updateMatrixWorld(true);if(hb){const wp=new THREE.Vector3();hb.getWorldPosition(wp);g.worldToLocal(wp);H.position.copy(wp);H.position.y-=0.12;g.add(H);g.updateMatrixWorld(true);hb.attach(H);}else{H.position.set(0,1.5,0);g.add(H);}}else R.g.add(g);
        A.G.push({g,a:i/3*TAU});}}for(const G of A.G){G.g.position.set(Math.cos(G.a)*11,0,Math.sin(G.a)*11);}A.stare=0;A.sp=0.6;LEY.extra='<span>Gorgonas</span>';},
    tick(dt,t,act){const A=this,R=LEY.R;if(!A.G||!R)return;const P=player,cam=camera,fw=new THREE.Vector3();cam.getWorldDirection(fw);let look=false;
      for(const G of A.G){const gp=G.g.position,dx=P.x-R.X-gp.x,dz=P.z-R.Z-gp.z,d=Math.hypot(dx,dz)||1;if(act&&d>1.5){gp.x+=dx/d*dt*A.sp;gp.z+=dz/d*dt*A.sp;}G.g.rotation.y=Math.atan2(dx,dz);bestAnim(G.g,dt,act?0.5:0);
        const v=new THREE.Vector3(R.X+gp.x-cam.position.x,R.Y+1.6-cam.position.y,R.Z+gp.z-cam.position.z),dd=v.length();v.normalize();if(dd<30&&v.dot(fw)>0.93)look=true;}
      if(act&&look&&!(LEY_SH.up&&LEY_SH.st>0)){A.stare+=dt;LEY.extra='<span style="color:#ff9a5a">¡No la mires!</span>';}else{A.stare=Math.max(0,A.stare-dt*2);if(act)LEY.extra='<span>Gorgonas</span>';}if(act)leyHud();},
    hitTest(P){const A=this,R=LEY.R;if(A.stare>0.5){A.stare=0;for(const G of A.G){const a=Math.atan2(G.g.position.z,G.g.position.x);G.g.position.set(Math.cos(a)*12,0,Math.sin(a)*12);}return true;}
      for(const G of A.G)if(Math.hypot(R.X+G.g.position.x-P.x,R.Z+G.g.position.z-P.z)<1.1){const a=Math.atan2(G.g.position.z,G.g.position.x);G.g.position.set(Math.cos(a)*12,0,Math.sin(a)*12);return true;}return false;},
    onOrb(n){if(n%4===0)this.sp=Math.min(1.6,this.sp+0.2);},end(){this.sp=0;}}});
// ---- 15 la Quimera
bestCharger('quimera',{t:'La Quimera',who:'La Quimera',model:'quimera',scale:1.1,at:['halicarnaso'],ro:['rhodus'],c1:'#8a7a58',c2:'#6e6046',arena:{rocks:22,rockC:'#8a7a66',seed:15},zn:['Los montes de Licia','ΛΥΚΙΑ','Leyenda · Ilíada VI 179-183'],
  rule:'La Quimera ronda: <b>cuando se agazapa y ruge con sus tres cabezas</b>, embiste. Apártate o para el golpe con el escudo.',win:'«Veinte orbes. La Quimera, cansada, se echa entre las rocas humeantes del monte.»',
  myth:'En la Ilíada (VI 179-183), la Quimera es león por delante, serpiente por detrás y cabra en medio, y echa fuego; la venció Belerofonte a lomos de Pegaso. Hesíodo la hace hija de Equidna (Teogonía 319-325). En Licia había un monte del que salían llamas de la tierra (hoy, Yanartaş), que quizá dio pie al mito.'});
// ---- 16 Pegaso: acercarse sin correr
bestDef('pegaso',{t:'Pegaso',who:'Pegaso',at:['corinto'],ro:['corinthus'],c1:'#8a9a5a',c2:'#74844a',arena:{trees:16},zn:['La fuente Pirene','ΠΕΙΡΗΝΗ','Leyenda · Píndaro, Olímpica XIII 63-92'],
  rule:'Pegaso pasta y vuela de un sitio a otro. Aquí nadie ataca: reúne los orbes, pero <b>si corres a menos de 8 m de él</b>, se espanta y cocea el aire (cuenta como golpe). Acércate andando.',
  win:'«Veinte orbes sin espantarlo. Pegaso baja la cabeza y deja que le pongas el freno de oro de Atenea.»',
  myth:'En el mito, Pegaso, el caballo alado nacido del cuello de Medusa, bebía en la fuente Pirene de Corinto. Belerofonte lo domó con un freno de oro que Atenea le dio en sueños (Píndaro, Olímpica XIII 63-92; Hesíodo, Teogonía 280-286). Las monedas de Corinto llevan a Pegaso.',
  extra:{reset(R){const A=this;if(!A.P||(crbHas('pegaso')&&!A.P.cr)){if(A.P)R.g.remove(A.P.g);A.P=(crbHas('pegaso')&&crbQuad(R,'pegaso',1.0))||herSimple(R,'#f0f0ee',1.2,1.1);}A.tg={x:0,z:-6};A.t=0;A.sp=0;A.fly=0;LEY.extra='<span>Pegaso: pasta</span>';},
    tick(dt,t,act){const A=this,R=LEY.R;if(!A.P||!R)return;if(crbHas('pegaso')&&!A.P.cr)A.reset(R);const g=A.P.g;A.t-=dt;if(A.t<=0){A.t=5+Math.random()*4;const a=Math.random()*TAU,r=Math.random()*10;A.tg={x:Math.cos(a)*r,z:Math.sin(a)*r};A.fly=1.6;}
      const dx=A.tg.x-g.position.x,dz=A.tg.z-g.position.z,d=Math.hypot(dx,dz);if(d>0.3){g.position.x+=dx/d*Math.min(d,dt*(A.fly>0?7:1.2));g.position.z+=dz/d*Math.min(d,dt*(A.fly>0?7:1.2));g.rotation.y=Math.atan2(dx,dz);}
      A.fly=Math.max(0,A.fly-dt);g.position.y=A.fly>0?Math.sin(Math.min(1,A.fly/1.6)*Math.PI)*3:0;if(A.P.wings&&A.P.wings.length===2){const fl=A.fly>0?Math.sin(t*9)*0.7:0.2;A.P.wings[0].rotation.z=fl;A.P.wings[1].rotation.z=-fl;}
      const ph=t*(A.fly>0?12:3);A.P.legs.forEach((l,j)=>{l.rotation.x=d>0.3?Math.sin(ph+(j%2?Math.PI:0))*0.4:0;});A.sp=Math.hypot(LEY.pv.x,LEY.pv.z);},
    hitTest(P){const A=this,R=LEY.R;if(!A.P)return false;const d=Math.hypot(R.X+A.P.g.position.x-P.x,R.Z+A.P.g.position.z-P.z);if(d<8&&A.sp>5.2){A.tg={x:-A.P.g.position.x,z:-A.P.g.position.z};A.fly=1.6;A.t=4;LEY.extra='<span style="color:#ff9a5a">Pegaso: ¡se espanta!</span>';leyHud();return true;}return false;},
    end(){this.t=99;}}});
// ---- 17 la Esfinge: embiste desde la roca y pregunta
bestQuiz(bestCharger('esfinge',{t:'La Esfinge de Tebas',who:'La Esfinge',model:'esfinge',scale:1.2,at:['tebas'],ro:['menfis'],c1:'#a08a5c',c2:'#8a7650',arena:{rocks:20,rockC:'#9b8a6c',seed:17},zn:['El monte Ficio','ΣΦΙΓΞ','Leyenda · Sófocles, Edipo rey'],
  rule:'La Esfinge salta sobre ti cuando <b>se agazapa</b>: apártate o usa el escudo. Y cada 4 orbes te hace una <b>pregunta</b>: si fallas, cuenta como golpe.',win:'«Veinte orbes y todas las respuestas. La Esfinge se queda callada en su roca: alguien ha sabido contestar.»',
  myth:'En el mito, la Esfinge, con cabeza de mujer, cuerpo de león y alas, se sentaba junto a Tebas y devoraba a quien no resolvía su enigma. Edipo lo resolvió y ella se despeñó (Apolodoro III 5,8; Sófocles, Edipo rey; Hesíodo la llama Fix, Teogonía 326). La esfinge egipcia es otra: león con cabeza de rey, sin alas.'}),
  [['El enigma de la Esfinge','¿Qué ser anda a cuatro patas por la mañana, a dos al mediodía y a tres por la tarde?',['El ser humano','El caballo','El sol'],0,'El ser humano: gatea de niño, anda erguido de adulto y con bastón de viejo (así lo cuenta Apolodoro III 5,8).'],
   ['Otro enigma','Hay dos hermanas: una da a luz a la otra y esta, a su vez, a la primera. ¿Quiénes son?',['El día y la noche','La tierra y el mar','Atenas y Esparta'],0,'El día y la noche (en griego, hēmera y nyx, femeninas las dos). Este enigma lo recoge Ateneo.'],
   ['Una pregunta de Tebas','¿Quién fundó Tebas según el mito?',['Cadmo','Teseo','Perseo'],0,'Cadmo, el fenicio, que mató al dragón de Ares y sembró sus dientes.'],
   ['Una pregunta de teatro','¿Qué tragedia de Sófocles cuenta la historia de Edipo y la Esfinge?',['Edipo rey','Antígona','Medea'],0,'Edipo rey, representada en Atenas hacia el 429 a.C. (Medea es de Eurípides).'],
   ['La última','¿Qué le pasó a Edipo al saber la verdad sobre sus padres?',['Se cegó y se fue de Tebas','Se hizo rey de Atenas','Se convirtió en piedra'],0,'Se arrancó los ojos y se marchó desterrado; murió en Colono, junto a Atenas (Sófocles, Edipo en Colono).']],'La Esfinge');
// ---- 18 la cerda de Cromión
bestCharger('cromion',{t:'La cerda de Cromión',who:'La cerda Fea',model:'jabali',scale:1.3,tint:'#e0b0a0',at:['megara'],ro:['corinthus'],c1:'#8a7a5a',c2:'#6e6046',arena:{trees:20,treeC:'#4a5a34'},zn:['Cromión','ΚΡΟΜΜΥΩΝ','Leyenda · Plutarco, Teseo 9'],
  rule:'La cerda hoza y, cuando <b>baja la cabeza y gruñe</b>, embiste: apártate o para el golpe con el escudo.',win:'«Veinte orbes. La cerda se tumba en el barro, satisfecha, y deja el camino libre.»',
  myth:'En el mito, camino de Atenas, el joven Teseo libró el istmo de bandidos y de la cerda de Cromión, a la que llamaban Fea, por el nombre de la vieja que la criaba (Plutarco, Teseo 9; Apolodoro, Epítome I 1).'});
// ---- 19 Escirón y la tortuga: ráfagas de viento hacia el acantilado
bestDef('escion',{t:'Escirón y la tortuga',who:'Escirón',at:['escironides'],ro:['athenae'],c1:'#9a8a6a',c2:'#7e705a',arena:{sea:true,rocks:16,rockC:'#a09684'},zn:['Las rocas Escironias','ΣΚΙΡΩΝ','Leyenda · Plutarco, Teseo 10'],
  rule:'Escirón empuja a los viajeros hacia el mar, donde espera una tortuga enorme. Cuando <b>las hojas tiemblan y él levanta el brazo</b>, llega una ráfaga que te arrastra hacia el acantilado (al fondo): ponte de cara a Escirón y alza el escudo, o camina hacia delante para no perder terreno. Si tocas el borde, cuenta como golpe.',
  win:'«Veinte orbes al borde del acantilado. Escirón se sienta en su roca y la tortuga se hunde en el agua: ya nadie lavará los pies de nadie.»',
  myth:'En el mito, Escirón obligaba a los que pasaban por el camino de Mégara a lavarle los pies y los tiraba de una patada al mar, donde una tortuga se los comía. Teseo le hizo lo mismo (Plutarco, Teseo 10; Apolodoro, Epítome I 2). Los megarenses contaban otra cosa: que Escirón era un hombre justo.',
  extra:{reset(R){const A=this;if(!A.E){A.E=bestHuman('obrero',{chiton:'#5a4a3a'},1.5);A.E.position.set(0,0,-13);R.g.add(A.E);if(crbHas('tortuga')){A.T=crbPart('CR_tortuga_cuerpo');A.T.position.set(4,-0.2,-19);A.T.scale.setScalar(1.6);R.g.add(A.T);}}A.t=3;A.per=4;A.st='calma';A.w=0;LEY.extra='<span>Escirón: espera</span>';},
    tick(dt,t,act){const A=this,R=LEY.R;if(!A.E||!R)return;A.E.rotation.y=Math.atan2(player.x-R.X,player.z-R.Z+13);bestAnim(A.E,dt,0);if(A.T)A.T.position.y=-0.2+Math.sin(t*0.8)*0.1;
      if(!act)return;A.t-=dt;if(A.st==='calma'&&A.t<=0){A.st='aviso';A.t=1.0;LEY.extra='<span style="color:#ff9a5a">Escirón: ¡ráfaga!</span>';leyHud();}
      else if(A.st==='aviso'&&A.t<=0){A.st='viento';A.t=1.6;}else if(A.st==='viento'){const P=player,blk=LEY_SH.up&&LEY_SH.st>0&&Math.cos(P.yaw)>0.4;const f=blk?1.2:5.5;P.z-=f*dt;if(blk)LEY_SH.st=Math.max(0,LEY_SH.st-0.25*dt);if(A.t<=0){A.st='calma';A.t=A.per*(0.7+Math.random()*0.6);LEY.extra='<span>Escirón: espera</span>';leyHud();}}},
    hitTest(P){const R=LEY.R;if(P.z-R.Z<-(LEY_RA-1.6)){P.z=R.Z;P.x=R.X;return true;}return false;},orbOk:(x,z)=>z>-10,onOrb(n){if(n%4===0)this.per=Math.max(1.8,this.per-0.5);},end(){this.st='fin';}}});
// ---- 20 el monstruo marino de Troya
bestStriker('ketos_troya',{t:'El monstruo de Troya',who:'El monstruo marino',at:['troya'],tint:'#9ab0c0',spots:[[0,-11,2.0]],reach:9,sink:-0.6,c1:'#a8996c',c2:'#8c7f5a',arena:{sea:true,rocks:8},zn:['La playa de Troya','ΤΡΟΙΑ','Leyenda · Ilíada XX 145-148; Apolodoro II 5,9'],
  rule:'El monstruo sale del mar y <b>sus ojos brillan antes de lanzar la cabeza</b> en línea recta: apártate de su mirada o para con el escudo.',win:'«Veinte orbes. El monstruo se hunde en el mar y no vuelve: Hesíone queda libre.»',
  myth:'En el mito, Poseidón envió un monstruo marino contra Troya porque el rey Laomedonte no le pagó por las murallas. Heracles salvó a la princesa Hesíone, atada en la playa (Ilíada XX 145-148; Apolodoro II 5,9).'});
// ---- 21 el ceto de Andrómeda
bestStriker('ketos_jope',{t:'El ceto de Andrómeda',who:'El ceto',at:['naucratis'],ro:['tyrus'],tint:'#7a98a8',spots:[[-4,-11,1.8],[4,-11,1.8]],reach:8,sink:-0.6,c1:'#b0a07a',c2:'#968860',arena:{sea:true,rocks:10},zn:['La costa de Jope','ΙΟΠΠΗ','Leyenda · Apolodoro II 4,3'],
  rule:'Dos cabezas del ceto salen del agua y <b>brillan antes de atacar</b> en línea recta. Apártate o para con el escudo.',win:'«Veinte orbes. El ceto se aleja mar adentro y Andrómeda baja de la roca.»',
  myth:'En el mito, Casiopea presumió de ser más bella que las Nereidas, y Poseidón mandó un monstruo marino (ketos) contra Etiopía. Andrómeda, su hija, fue atada a una roca para él; Perseo, que volvía con la cabeza de Medusa, la liberó (Apolodoro II 4,3). Los antiguos situaban la roca en Jope (hoy Jaffa), y allí enseñaban las marcas de las cadenas (Estrabón XVI 2,28).',
  late:'Las dos cabezas son del juego; el relato completo con la roca de Jope es de Estrabón (siglo I a.C.).'});
// ---- 22 la zorra de Teumeso y el perro Lélape
bestLanes('teumeso',{t:'La zorra de Teumeso',who:'La zorra y Lélape',at:['tebas'],c1:'#8a8a5a',c2:'#70704a',arena:{trees:14,rocks:8},zn:['El monte Teumeso','ΤΕΥΜΗΣΣΟΣ','Leyenda · Apolodoro II 4,7'],
  rule:'La zorra que nadie puede atrapar y el perro que siempre atrapa lo que persigue <b>cruzan la arena a toda velocidad</b>: el polvo avisa por dónde. Apártate.',win:'«Veinte orbes. Zeus convierte a los dos en piedra en plena carrera: así acaba la persecución imposible.»',
  myth:'En el mito, la zorra de Teumeso no podía ser atrapada, y Lélape, el perro de Céfalo, atrapaba siempre a su presa. Zeus resolvió la paradoja convirtiendo a los dos en piedra (Apolodoro II 4,7; Pausanias IX 19,1; Ovidio, Metamorfosis VII 759-793).',
  mk(R){const fox=Math.random()<0.5,k=fox?'zorra':'ortro';const Q=crbHas(k)&&crbQuad(R,k,fox?1.4:1.0);if(Q)return Q;return herSimple(R,fox?'#c86a28':'#3a2a20',0.8,0.6);}});
// ---- 23 el jabalí de Calidón
bestCharger('calidon',{t:'El jabalí de Calidón',who:'El jabalí',model:'jabali',scale:1.9,tint:'#a08a78',at:['calidon'],c1:'#6e7a4a',c2:'#5a6440',arena:{trees:30,treeC:'#344a2a'},zn:['Los bosques de Calidón','ΚΑΛΥΔΩΝ','Leyenda · Ilíada IX 529-599'],
  rule:'El jabalí que envió Ártemis embiste cuando <b>baja la cabeza y gruñe</b>: apártate o para el golpe con el escudo. Atalanta y Meleagro están lejos: estás sola o solo.',win:'«Veinte orbes. El jabalí se interna en el bosque y Ártemis deja en paz los campos de Calidón.»',
  myth:'En el mito, Eneo, rey de Calidón, olvidó a Ártemis en un sacrificio, y la diosa envió un jabalí enorme que arrasó los campos. A la cacería acudieron muchos héroes; Atalanta lo hirió la primera (Ilíada IX 529-599; Ovidio, Metamorfosis VIII 270-444; Apolodoro I 8,2-3). Pausanias vio sus colmillos en Tegea (VIII 46,1).'});
// ---- 24 el dragón de Ares en Tebas
bestStriker('dragon_ares',{t:'El dragón de Ares',who:'El dragón',at:['tebas'],tint:'#c09070',spots:[[0,-9,1.7]],c1:'#6a7a4a',c2:'#566440',arena:{trees:18,rocks:10},zn:['La fuente de Ares','ΔΙΡΚΗ','Leyenda · Ovidio, Metamorfosis III 31-98'],
  rule:'El dragón guarda la fuente y <b>sus ojos brillan antes de atacar</b>. Apártate de su mirada o para con el escudo.',win:'«Veinte orbes. El dragón vuelve a enroscarse junto a la fuente: Cadmo podrá sacar agua sin pelear.»',
  myth:'En el mito, Cadmo, buscando a su hermana Europa, llegó a Beocia; un dragón de Ares que guardaba una fuente mató a sus compañeros. Cadmo lo mató, sembró sus dientes y de ellos nacieron los espartos, los primeros tebanos (Apolodoro III 4,1; Eurípides, Fenicias 638-675; Ovidio, Metamorfosis III 31-98).',late:'El relato detallado del combate es de Ovidio (siglo I d.C.); en el 386 a.C. se conocía por Eurípides y otros.'});
// ---- 25 Argos Panoptes: pasar sin que te vean sus ojos
bestDef('argos',{t:'Argos de los cien ojos',who:'Argos',at:['argos'],c1:'#7a8a5a',c2:'#64744a',arena:{trees:12},zn:['El prado de Ío','ΑΡΓΟΣ','Leyenda · Apolodoro II 1,3'],
  rule:'Argos vigila a la vaca Ío con sus cien ojos: <b>cuatro haces de mirada giran</b> a su alrededor (en el suelo, en rojo). Si te pillan dentro más de un instante, cuenta como golpe. Con <b>R</b> tocas la siringa de Hermes y sus ojos se adormecen un rato.',
  win:'«Veinte orbes sin que te viera. Argos da una cabezada al son de la siringa, como con Hermes.»',
  myth:'En el mito, Hera puso a Argos Panoptes, que tenía ojos por todo el cuerpo y nunca los cerraba todos, a vigilar a Ío, convertida en vaca. Hermes lo durmió con la música de su siringa y sus historias (Apolodoro II 1,3; Ovidio, Metamorfosis I 622-723). Hera puso sus ojos en la cola del pavo real.',
  extra:{reset(R){const A=this;if(!A.G){A.G=bestHuman('ciudadano',{chiton:'#4a3a2a',himation:'#6a5a3a'},1.5);R.g.add(A.G);for(let i=0;i<24;i++){const e=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#e8f0ff',transparent:true,opacity:0.8,depthWrite:false}));e.scale.set(0.12,0.12,1);const a=Math.random()*TAU,h=0.5+Math.random()*1.9;e.position.set(Math.cos(a)*0.22,h,Math.sin(a)*0.18);A.G.add(e);}
      A.cones=[];for(let k=0;k<4;k++){const m=new THREE.Mesh(new THREE.CircleGeometry(14,16,-0.26,0.52),new THREE.MeshBasicMaterial({color:'#d04030',transparent:true,opacity:0.22,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.y=0.07;R.g.add(m);A.cones.push(m);}}
      A.a=0;A.sp=0.45;A.sleep=0;A.cd=0;A.in=0;LEY.extra='<span>Argos: vigila (R: siringa)</span>';},
    tick(dt,t,act){const A=this,R=LEY.R;if(!A.G||!R)return;bestAnim(A.G,dt,0);A.cd=Math.max(0,A.cd-dt);A.sleep=Math.max(0,A.sleep-dt);if(act&&A.sleep<=0)A.a+=dt*A.sp;
      A.cones.forEach((m,k)=>{m.rotation.z=A.a+k*Math.PI/2;m.material.opacity=A.sleep>0?0.05:0.22;});A.G.rotation.y=-A.a;
      if(!act||A.sleep>0){A.in=0;return;}const P=player,px=P.x-R.X,pz=P.z-R.Z,d=Math.hypot(px,pz),ang=Math.atan2(-pz,px);let inside=false;
      for(let k=0;k<4;k++){let da=ang-(A.a+k*Math.PI/2);da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)<0.26&&d<14&&d>1)inside=true;}A.in=inside?A.in+dt:0;},
    hitTest(){if(this.in>0.35){this.in=-0.8;return true;}return false;},onOrb(n){if(n%4===0)this.sp=Math.min(1.1,this.sp+0.12);},end(){this.sleep=999;}}});
addEventListener('keydown',e=>{if(e.code!=='KeyR'||e.repeat||!legIn()||LEY.kind!=='argos'||ui!=='play')return;const A=LEG.argos;if(A.cd>0){toast('La siringa aún no está lista ('+Math.ceil(A.cd)+' s).');}else{A.sleep=4;A.cd=12;try{sfxAulos&&sfxAulos();}catch(er){}toast('<span class="label">Siringa</span><br>Los ojos de Argos se cierran un momento…');}e.stopImmediatePropagation();e.preventDefault();},true);
// ---- 26 Anteo: el gigante que embiste
bestHumanCharger('anteo',{t:'Anteo',who:'Anteo',kind:'obrero',cfg:{chiton:'#6a4a2a'},scale:2.2,at:['cirene'],ro:['cirta'],c1:'#c0a070',c2:'#a88a5a',arena:{rocks:12,rockC:'#b09a78'},zn:['El desierto de Libia','ΑΝΤΑΙΟΣ','Leyenda · Píndaro, Ístmica IV 52-55'],
  rule:'Anteo, hijo de la Tierra, reta a luchar a quien pasa: cuando <b>se agacha</b>, embiste. Apártate o para con el escudo.',win:'«Veinte orbes. Anteo se ríe, se sienta en la arena y te deja pasar: nunca había visto a nadie esquivarlo tanto.»',
  myth:'En el mito, Anteo, hijo de Poseidón y de Gea, obligaba a luchar a los extranjeros en Libia y los vencía, porque cada vez que tocaba la tierra, su madre, recobraba las fuerzas. Heracles lo levantó del suelo y así lo venció (Píndaro, Ístmica IV 52-55; Apolodoro II 5,11).'});
// ---- 27 Escila: seis cabezas desde la roca
bestStriker('escila',{t:'Escila',who:'Escila',at:['crotona'],ro:['regium'],tint:'#a8a0a8',spots:[[-6,-11,1.1],[-3.6,-12,1.1],[-1.2,-12.6,1.1],[1.2,-12.6,1.1],[3.6,-12,1.1],[6,-11,1.1]],reach:9,per:2.0,c1:'#7a7a72',c2:'#5e5e58',arena:{sea:true,rocks:20,rockC:'#6a6a66'},zn:['El estrecho','ΣΚΥΛΛΑ','Leyenda · Odisea XII 85-100'],
  rule:'Seis cabezas asoman de la roca de Escila; <b>la que va a atacar brilla</b> y se lanza en línea recta. Apártate o para con el escudo.',win:'«Veinte orbes. Las seis cabezas se meten en su cueva: el barco puede pasar.»',
  myth:'En la Odisea (XII 85-100 y 245-259), Escila vive en una cueva del estrecho, frente a Caribdis: tiene doce pies, seis cuellos larguísimos y en cada cabeza tres filas de dientes; de cada barco que pasa se lleva seis hombres. Los antiguos la situaban en el estrecho de Mesina.'});
// ---- 28 Caribdis: el remolino
bestDef('caribdis',{t:'Caribdis',who:'Caribdis',at:['crotona'],ro:['regium'],c1:'#3f6a80',c2:'#2f5468',arena:{rocks:14,rockC:'#6a6a66'},zn:['El remolino','ΧΑΡΥΒΔΙΣ','Leyenda · Odisea XII 101-110'],
  rule:'Caribdis traga el mar tres veces al día: el centro <b>te arrastra hacia el remolino</b>, cada vez más fuerte cuando el agua gira deprisa. No llegues al centro.',win:'«Veinte orbes. Caribdis escupe el agua y se calma: es el momento de pasar.»',
  myth:'En la Odisea (XII 101-110 y 426-446), Caribdis, bajo una higuera, sorbe el agua oscura del mar tres veces al día y tres veces la devuelve. Ulises se salvó agarrándose a la higuera. Los antiguos lo situaban en el estrecho de Mesina, frente a Escila.',
  extra:{reset(R){const A=this;if(!A.W){A.W=new THREE.Mesh(new THREE.CircleGeometry(LEY_RA-0.5,48),new THREE.MeshPhongMaterial({color:'#2f6a8a',shininess:90,transparent:true,opacity:0.85}));A.W.rotation.x=-Math.PI/2;A.W.position.y=0.03;R.g.add(A.W);A.H=new THREE.Mesh(new THREE.CircleGeometry(2,24),new THREE.MeshBasicMaterial({color:'#0a1a22'}));A.H.rotation.x=-Math.PI/2;A.H.position.y=0.05;R.g.add(A.H);}A.ph=0;A.k=1;LEY.extra='<span>Caribdis: tranquila</span>';},
    tick(dt,t,act){const A=this,R=LEY.R;if(!A.W||!R)return;A.ph+=dt;const s=0.5+0.5*Math.sin(A.ph*0.45);A.W.rotation.z+=dt*(0.4+2.5*s);A.H.scale.setScalar(0.6+s*1.2);
      if(!act)return;const P=player,dx=R.X-P.x,dz=R.Z-P.z,d=Math.hypot(dx,dz)||1,f=(0.8+3.2*s)*A.k;P.x+=dx/d*f*dt+(-dz/d)*f*0.5*dt;P.z+=dz/d*f*dt+(dx/d)*f*0.5*dt;LEY.extra=s>0.7?'<span style="color:#ff9a5a">Caribdis: ¡traga!</span>':'<span>Caribdis: gira</span>';},
    hitTest(P){const R=LEY.R;if(Math.hypot(P.x-R.X,P.z-R.Z)<1.6){P.x=R.X;P.z=R.Z+11;return true;}return false;},orbOk:(x,z)=>Math.hypot(x,z)>4,onOrb(n){if(n%4===0)this.k+=0.15;},end(){this.k=0;}}});
// ---- 29 las Sirenas: el canto atrae
bestDef('sirenas',{t:'Las Sirenas',who:'Las Sirenas',at:['tarento'],ro:['campania'],c1:'#c8b88a',c2:'#a89a70',arena:{sea:true,rocks:12,rockC:'#b0a890'},zn:['La isla de las Sirenas','ΣΕΙΡΗΝΕΣ','Leyenda · Odisea XII 39-54 y 165-200'],
  rule:'Las Sirenas cantan desde las rocas del fondo y <b>su canto te arrastra hacia ellas</b>. Con el <b>escudo alzado</b> (Q) te tapas los oídos con cera, como los compañeros de Ulises, y no te arrastra. Si llegas a las rocas, cuenta como golpe.',
  win:'«Veinte orbes sin dejarte llevar. Las Sirenas callan: alguien ha oído su canto y ha seguido su camino.»',
  myth:'En la Odisea (XII 39-54 y 165-200), las Sirenas cantan desde un prado lleno de huesos y quien las oye ya no vuelve a casa. Ulises tapó con cera los oídos de sus compañeros y se hizo atar al mástil para oírlas. En el arte griego son aves con cabeza de mujer, no mujeres-pez: eso es de la Edad Media.',
  extra:{reset(R){const A=this;if(A.S&&!A.scr&&crbHas('arpia')){for(const g of A.S)R.g.remove(g);A.S=null;}if(!A.S){A.scr=crbHas('arpia');A.S=[];for(let i=0;i<3;i++){const g=new THREE.Group();g.position.set(-4+i*4,2.2,-13);R.g.add(g);const r=new THREE.Mesh(new THREE.DodecahedronGeometry(1.8,1),lam('#9a9282'));r.position.y=-1.4;g.add(r);
        if(crbHas('arpia')){const b=crbPart('CR_arpia_cuerpo');b.position.set(0,0.2,0);b.scale.setScalar(1.6);g.add(b);herTint(b,'#f0e0c8');}A.S.push(g);}}A.sing=0;A.t=2;A.k=1;LEY.extra='<span>Sirenas: callan</span>';},
    tick(dt,t,act){const A=this,R=LEY.R;if(!A.S||!R)return;for(const g of A.S)g.rotation.y=Math.atan2(player.x-R.X-g.position.x,player.z-R.Z-g.position.z);if(!act)return;
      A.t-=dt;if(A.t<=0){A.sing=A.sing>0?0:3.5;A.t=A.sing>0?3.5:2+Math.random()*2;try{if(A.sing>0&&typeof sfxAulos==='function')sfxAulos();}catch(e){}}
      if(A.sing>0){A.sing-=dt;const P=player,blk=LEY_SH.up&&LEY_SH.st>0;LEY.extra='<span style="color:#ff9a5a">Sirenas: ¡cantan!</span>';if(!blk){const dx=R.X-P.x,dz=R.Z-13-P.z,d=Math.hypot(dx,dz)||1;P.x+=dx/d*2.8*A.k*dt;P.z+=dz/d*2.8*A.k*dt;}else LEY_SH.st=Math.max(0,LEY_SH.st-0.15*dt);}else LEY.extra='<span>Sirenas: callan</span>';},
    hitTest(P){const R=LEY.R;if(P.z-R.Z<-(LEY_RA-2.2)){P.z=R.Z+8;return true;}return false;},orbOk:(x,z)=>z>-9,onOrb(n){if(n%4===0)this.k+=0.15;},end(){this.sing=0;this.t=999;}}});
// ---- 30 Polifemo
bestThrower('polifemo',{t:'Polifemo',who:'Polifemo',at:['siracusa386'],ro:['aetna'],proj:'piedra',per:2.6,c1:'#7a7a5a',c2:'#5e5e48',arena:{rocks:26,rockC:'#5a5450',seed:30},zn:['La cueva del cíclope','ΠΟΛΥΦΗΜΟΣ','Leyenda · Odisea IX'],
  units:R=>{const g=bestOneEye(bestHuman('obrero',{chiton:'#5a4a3a'},3.2),1.68);g.position.set(0,0,-12.5);R.g.add(g);return [{g,y:6}];},rest:'busca a «Nadie»',
  rule:'El cíclope ciego por un día lanza rocas hacia donde te oye: <b>un círculo de polvo</b> avisa dónde caen. Apártate.',win:'«Veinte orbes. Polifemo grita a sus hermanos que «Nadie» le engaña, y nadie viene.»',
  myth:'En la Odisea (IX), Ulises y sus compañeros quedaron atrapados en la cueva de Polifemo, cíclope hijo de Poseidón. Ulises le dijo que se llamaba «Nadie», lo emborrachó y escaparon atados bajo las ovejas; el cíclope les tiró rocas al mar. Los antiguos situaban a los cíclopes en Sicilia, junto al Etna (Tucídides VI 2,1).'});
// ---- 31 los Lestrigones
bestThrower('lestrigones',{t:'Los Lestrigones',who:'Los Lestrigones',at:['leucade'],ro:['campania'],proj:'piedra',per:2.0,multi:2,c1:'#7a8060',c2:'#62684e',arena:{sea:true,rocks:18},zn:['Telépilo','ΛΑΙΣΤΡΥΓΟΝΕΣ','Leyenda · Odisea X 80-132'],
  units:R=>[-6,0,6].map(x=>{const g=bestHuman('obrero',{chiton:'#4a3a2a'},2.6);g.position.set(x,0,-12);R.g.add(g);return {g,y:5};}),
  rule:'Tres gigantes lanzan rocas desde el acantilado, <b>de dos en dos</b>: los círculos de polvo avisan. Apártate.',win:'«Veinte orbes. Los gigantes se cansan de tirar piedras al aire y vuelven a su ciudad.»',
  myth:'En la Odisea (X 80-132), los Lestrigones, gigantes caníbales de la ciudad de Telépilo, hundieron a pedradas once de las doce naves de Ulises en su puerto. Los romanos los situaban en Formias, en el Lacio (Cicerón, Ad Atticum II 13).'});
// ---- 32 las Harpías
bestRain('harpias',{t:'Las Harpías',who:'Las Harpías',at:['zacinto'],ro:['tarentum'],proj:'pluma',n:4,c1:'#7a7a58',c2:'#626246',arena:{rocks:10,trees:8},zn:['Las islas Estrófades','ΑΡΠΥΙΑΙ','Leyenda · Apolonio II 178-300'],
  mk:(R,i)=>{const g=new THREE.Group();R.g.add(g);let w=[];if(crbHas('arpia')){const b=crbPart('CR_arpia_cuerpo');b.position.set(0,0,0);g.add(b);for(const k of['aI','aD']){const p=crbPart('CR_arpia_'+k);if(!p)continue;const piv=new THREE.Group();piv.position.copy(p.position);p.position.set(0,0,0);piv.add(p);g.add(piv);w.push(piv);}herTint(g,'#7a6a6a');g.scale.setScalar(1.5);}
    else{const b=new THREE.Mesh(new THREE.SphereGeometry(0.35,10,8),lam('#4a3a3a'));g.add(b);}return {g,wings:w};},
  rule:'Las Harpías bajan en picado y <b>sueltan plumas como dardos</b>; la sombra roja avisa dónde caen. Apártate o para con el escudo.',win:'«Veinte orbes. Los Boréadas aparecen en el cielo y las Harpías huyen a las islas Estrófades.»',
  myth:'En el mito, las Harpías, «las que arrebatan», mitad ave y mitad mujer, robaban y ensuciaban la comida del adivino Fineo; los Boréadas, hijos del viento del norte, las persiguieron hasta las islas Estrófades (Apolonio II 178-300; Hesíodo, Teogonía 265-269). En la Eneida (III 209-258) atacan a Eneas allí mismo.',late:'El relato de Fineo y las Estrófades lo cuentan sobre todo Apolonio (siglo III a.C.) y Virgilio.'});
// ---- 33 las serpientes de Laocoonte
bestLanes('laocoonte',{t:'Las serpientes de Laocoonte',who:'Las serpientes',at:['troya'],ro:['pergamum'],c1:'#a8996c',c2:'#8c7f5a',arena:{sea:true},zn:['La playa de Troya','LAOCOON','Leyenda · Virgilio, Eneida II 199-227'],
  mk(R){const g=new THREE.Group();R.g.add(g);if(crbHas('serp')){const b=crbPart('CR_serp_cuerpo');b.position.set(0,0,0);g.add(b);const h=crbPart('CR_serp_cabeza');if(h)g.add(h);herTint(g,'#9ab0a0');g.scale.setScalar(0.8);}else{const m=new THREE.Mesh(new THREE.SphereGeometry(0.4,8,6),lam('#3a5a3a'));m.scale.z=4;g.add(m);}return {g,legs:[]};},
  rule:'Dos serpientes gigantes salen del mar y <b>cruzan la playa en línea recta</b>: el rastro avisa por dónde. Apártate.',win:'«Veinte orbes. Las serpientes se refugian bajo el escudo de la estatua de Minerva.»',
  myth:'En la Eneida (II 199-227), dos serpientes enormes salieron del mar y mataron al sacerdote troyano Laocoonte y a sus hijos, porque había avisado de que el caballo de madera era un engaño. El famoso grupo de mármol de Laocoonte, en Roma, lo vio Plinio en casa del emperador Tito (Historia natural XXXVI 37).',late:'Esta versión es de Virgilio (siglo I a.C.); en el 386 a.C. la historia de Laocoonte existía (Sófocles escribió un Laocoonte, perdido), pero no como en la Eneida.'});
// ---- 34 el dragón de la Cólquide
bestStriker('dragon_colquide',{t:'El dragón del vellocino de oro',who:'El dragón',at:['sinope'],tint:'#d8c890',spots:[[0,-8,1.8]],per:2.4,c1:'#5a7240',c2:'#4a6036',arena:{trees:24,treeC:'#2f4a28'},zn:['El bosque de Ares','ΚΟΛΧΙΣ','Leyenda · Apolonio IV 123-166'],
  decor:(R)=>{const v=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.9,0.05),new THREE.MeshPhongMaterial({color:'#e8b830',shininess:90,emissive:new THREE.Color('#3a2a00')}));v.position.set(0,4.2,-10);R.g.add(v);const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.6,6,10),lam('#5a4630'));tr.position.set(0,3,-10.8);R.g.add(tr);},
  rule:'El dragón que nunca duerme guarda el vellocino de oro, colgado de una encina: <b>sus ojos brillan antes de atacar</b>. Apártate o para con el escudo.',win:'«Veinte orbes. Medea canta y el dragón, por fin, cierra los ojos.»',
  myth:'En el mito, el vellocino de oro colgaba de una encina en el bosque de Ares, en la Cólquide, guardado por un dragón que nunca dormía. Medea lo adormeció con un canto y una pócima, y Jasón tomó el vellocino (Píndaro, Pítica IV 241-246; Apolonio IV 123-166). La Cólquide está en la costa oriental del mar Negro, más allá de Sinope.'});
// ---- 35 los toros de bronce de Eetes
bestCharger('toros_bronce',{t:'Los toros de bronce de Eetes',who:'El toro de bronce',model:'toro',scale:1.05,tint:'#c08a4a',metal:0.75,at:['sinope'],c1:'#7a6a4a',c2:'#62563c',arena:{rocks:12},zn:['El campo de Ares','ΚΟΛΧΙΣ','Leyenda · Píndaro, Pítica IV 224-246'],
  rule:'El toro de pezuñas de bronce resopla fuego y, cuando <b>agacha los cuernos</b>, embiste. Apártate o para con el escudo.',win:'«Veinte orbes. El toro se deja uncir al yugo, como hizo Jasón con la pomada de Medea.»',
  myth:'En el mito, el rey Eetes de la Cólquide puso a Jasón una prueba: uncir dos toros de pezuñas de bronce que echaban fuego, hechos por Hefesto, y arar con ellos un campo. Medea le dio una pomada que lo protegía del fuego (Píndaro, Pítica IV 224-246; Apolonio III 1278-1407).'});
// ---- 36 Talos, el gigante de bronce
bestThrower('talos',{t:'Talos, el gigante de bronce',who:'Talos',at:['creta'],proj:'piedra',per:2.2,c1:'#a8996c',c2:'#8c7f5a',arena:{sea:true,rocks:10},zn:['La costa de Creta','ΤΑΛΩΣ','Leyenda · Apolonio IV 1638-1688'],
  units:R=>{const g=bestHuman('hoplita',{chiton:'#8a6a3a'},3.4,{c:'#d0a060',m:0.8});g.position.set(0,0,-12.5);R.g.add(g);return [{g,y:7}];},
  rule:'Talos da la vuelta a Creta tres veces al día y <b>tira rocas</b> a los barcos que se acercan: los círculos de polvo avisan. Apártate.',win:'«Veinte orbes. Talos se queda quieto, mirando al mar: Medea le canta y se le olvida para qué estaba allí.»',
  myth:'En el mito, Talos era un gigante de bronce, regalo de Hefesto (o de Zeus) a Minos, que recorría Creta y apedreaba a los barcos. Tenía una sola vena cerrada con un clavo en el tobillo; Medea lo hechizó y la vena se abrió (Apolonio IV 1638-1688; Apolodoro I 9,26). Las monedas de Festo lo representan con alas.',late:'El episodio de Talos y los argonautas lo cuenta Apolonio (siglo III a.C.); Talos ya aparece en vasos áticos del siglo V a.C.'});
// ---- 37 Tifón
bestThrower('tifon',{t:'Tifón',who:'Tifón',at:['siracusa386'],ro:['aetna'],proj:'fuego',per:2.0,multi:2,c1:'#4a3a32',c2:'#3a2e28',arena:{rocks:28,rockC:'#3a3430',dark:true},zn:['Bajo el Etna','ΤΥΦΩΝ','Leyenda · Hesíodo, Teogonía 820-868'],
  units:R=>{const g=bestHuman('obrero',{chiton:'#3a2a22'},3.8,{c:'#9a8070'});g.position.set(0,0,-12.5);R.g.add(g);if(crbHas('serp')){for(const s of[-1,1]){const c=crbPart('CR_serp_cuerpo');c.position.set(s*1.4,0,-12.5);c.scale.setScalar(1.3);herTint(c,'#8a9a80');R.g.add(c);}}return [{g,y:7.5}];},
  rule:'Tifón, aplastado bajo el Etna, <b>escupe rocas ardientes de dos en dos</b>: los círculos de polvo avisan. Apártate.',win:'«Veinte orbes. El Etna se calma: Tifón se duerme bajo la montaña, que solo humea.»',
  myth:'En el mito, Tifón, hijo de Gea y Tártaro, con cien cabezas de serpiente, luchó con Zeus por el mundo; Zeus lo venció con el rayo y lo enterró bajo el Etna, cuyas erupciones son su fuego (Hesíodo, Teogonía 820-868; Píndaro, Pítica I 15-28; Esquilo, Prometeo 351-372). Por debajo de la cintura era de serpientes.'});
// ---- 38 Pitón
bestStriker('piton',{t:'Pitón',who:'Pitón',at:['delfos'],tint:'#b0a080',spots:[[0,-8,2.0]],reach:8,c1:'#8a8a64',c2:'#70704e',arena:{rocks:24,rockC:'#a8a090',seed:38},zn:['La fuente de Delfos','ΠΥΘΩΝ','Leyenda · Himno homérico a Apolo 300-374'],
  rule:'La serpiente de Delfos guarda la fuente: <b>sus ojos brillan antes de atacar</b>. Apártate o para con el escudo.',win:'«Veinte orbes. Pitón se enrosca junto a la fuente. Apolo podrá fundar su oráculo sin matar a nadie… en este sueño.»',
  myth:'En el Himno homérico a Apolo (300-374), el dios mató con sus flechas a la dragona que vivía junto a la fuente de Delfos y dejó que se pudriera al sol (pythein, «pudrir»): de ahí los nombres de Pito y de la Pitia. Los Juegos Píticos lo recordaban.'});
// ---- 39 los Gigantes
bestThrower('gigantes',{t:'Los Gigantes',who:'Los Gigantes',at:['olinto'],ro:['campania'],proj:'piedra',per:1.9,multi:2,c1:'#6a5a44',c2:'#544838',arena:{rocks:30,rockC:'#6a5e50',dark:true},zn:['Los campos de Flegra','ΓΙΓΑΝΤΕΣ','Leyenda · Apolodoro I 6,1-2'],
  units:R=>[-7,-2.5,2.5,7].map((x,i)=>{const g=bestHuman(i%2?'hoplita':'obrero',{chiton:'#3a2a20'},2.8);g.position.set(x,0,-12+Math.abs(x)*0.1);R.g.add(g);return {g,y:5.5};}),
  rule:'Los hijos de la Tierra <b>arrancan rocas y las lanzan</b> de dos en dos: los círculos de polvo avisan. Apártate.',win:'«Veinte orbes. Los Gigantes dejan las rocas en el suelo y se sientan: la batalla contra los dioses se queda en un sueño.»',
  myth:'En el mito, los Gigantes, nacidos de la sangre de Urano que cayó sobre la Tierra (Hesíodo, Teogonía 183-186), atacaron el Olimpo en la llanura de Flegra; los dioses los vencieron con la ayuda de Heracles (Apolodoro I 6,1-2; Píndaro, Nemea I 67-68). Es la Gigantomaquia del friso del Partenón (metopas del este). Flegra se situaba en Palene (Calcídica) o en los campos Flegreos de Campania.'});
// ---- 40 los Hecatónquiros
bestThrower('hecatonquiros',{t:'Los de cien brazos',who:'Los Hecatónquiros',at:['larisa'],proj:'piedra',per:2.4,multi:4,c1:'#7a6e58',c2:'#625846',arena:{rocks:30,rockC:'#6e6458'},zn:['La llanura de Tesalia','ΕΚΑΤΟΓΧΕΙΡΕΣ','Leyenda · Hesíodo, Teogonía 147-153 y 713-735'],
  units:R=>[-5,5].map(x=>{const g=new THREE.Group();g.position.set(x,0,-12.5);R.g.add(g);for(let k=0;k<3;k++){const h=bestHuman('obrero',{chiton:'#4a3a2a'},3.0);h.rotation.y=(k-1)*0.9;g.add(h);}return {g,y:6};}),
  rule:'Cada gigante de cien brazos <b>lanza cuatro rocas a la vez</b>: los círculos de polvo avisan. Busca un hueco.',win:'«Veinte orbes. Coto, Briareo y Giges vuelven a su guardia, a las puertas del Tártaro.»',
  myth:'En el mito, Coto, Briareo y Giges, hijos de Urano, tenían cien brazos y cincuenta cabezas. Zeus los liberó y con sus rocas, trescientas a la vez, vencieron a los Titanes; luego los puso de guardianes del Tártaro (Hesíodo, Teogonía 147-153 y 617-735). La batalla, la Titanomaquia, se libró en Tesalia.'});
// ---- 41 Equidna
bestStriker('equidna',{t:'Equidna',who:'Equidna',at:['olbia'],tint:'#a0a890',spots:[[0,-8,1.9]],c1:'#7a7a5a',c2:'#626246',arena:{rocks:20,rockC:'#7a7468'},zn:['La cueva de Equidna','ΕΧΙΔΝΑ','Leyenda · Hesíodo, Teogonía 295-305'],
  decor:(R,A)=>{const u=A.U[0];if(!u)return;const w=bestHuman('mujer',{chiton:'#3a4a30',himation:'#2a3a24'},1.3);w.position.set(0,0.2,0);u.g.add(w);},
  rule:'Mitad mujer, mitad serpiente: <b>la cola brilla antes de lanzarse</b> en línea recta. Apártate o para con el escudo.',win:'«Veinte orbes. Equidna vuelve a su cueva, bajo la tierra, lejos de los dioses y de los hombres.»',
  myth:'En Hesíodo (Teogonía 295-305), Equidna es una ninfa de ojos vivos y bellas mejillas por arriba y una serpiente enorme por abajo, que vive en una cueva; con Tifón fue madre de Ortro, Cerbero, la Hidra y la Quimera. Heródoto (IV 8-10) cuenta que los griegos del mar Negro la hacían madre de los escitas, con Heracles.'});
// ---- 42 los Centauros: centauromaquia
bestLanes('centauros',{t:'Los Centauros',who:'Los Centauros',at:['larisa'],c1:'#8a8a5a',c2:'#70704a',arena:{trees:20,rocks:8},zn:['La boda de Pirítoo','ΚΕΝΤΑΥΡΟΙ','Leyenda · Ovidio, Metamorfosis XII 210-535'],
  mk(R){const Q=crbHas('centauro')&&crbQuad(R,'centauro',1.0);if(Q)return Q;return herSimple(R,'#6a4a30',1.2,1.1);},
  rule:'En la boda de los lápitas, los centauros han bebido vino puro y <b>galopan por el patio en línea recta</b>: el polvo avisa por dónde. Apártate.',win:'«Veinte orbes. Los centauros, mareados, se duermen entre las mesas. La boda puede seguir.»',
  myth:'En el mito, los centauros, invitados a la boda de Pirítoo, rey de los lápitas de Tesalia, se emborracharon e intentaron raptar a la novia y a las mujeres; lápitas y centauros lucharon (Ilíada I 262-268; Ovidio, Metamorfosis XII 210-535). Es la centauromaquia de las metopas del sur del Partenón y del frontón de Olimpia.'});
// ---- 43 los grifos
bestRain('grifos',{t:'Los grifos',who:'Los grifos',at:['panticapeo'],proj:'oro',n:3,h:8,c1:'#a08a5c',c2:'#8a7650',arena:{rocks:24,rockC:'#a89070'},zn:['Las montañas del oro','ΓΡΥΠΕΣ','Leyenda · Heródoto III 116 y IV 13'],
  mk:(R,i)=>{const g=new THREE.Group();R.g.add(g);let w=[];const Q=crbHas('grifo')&&crbQuad(R,'grifo',0.9);if(Q){R.g.remove(Q.g);g.add(Q.g);w=Q.wings||[];}else{g.add(new THREE.Mesh(new THREE.SphereGeometry(0.5,10,8),lam('#b08a50')));}return {g,wings:w};},
  rule:'Los grifos guardan el oro del norte y <b>sueltan pepitas</b> sobre quien se acerca; la sombra roja avisa dónde caen. Apártate o para con el escudo.',win:'«Veinte orbes. Los grifos vuelven a sus nidos de oro: hoy no han tenido que pelear con los arimaspos.»',
  myth:'Heródoto (III 116 y IV 13 y 27) cuenta, sin creérselo del todo, que en el extremo norte los grifos guardan el oro y los arimaspos, hombres de un solo ojo, se lo roban. Esquilo los llama «perros de Zeus de pico afilado que no ladran» (Prometeo 803-804). Los escitas y los griegos del mar Negro los ponían en sus joyas de oro.'});
// ---- 44 el Fénix
bestRain('fenix',{t:'El Fénix',who:'El Fénix',at:['menfis'],ro:['menfis'],proj:'chispa',n:1,h:9,per:2.8,multi:2,c1:'#c8b080',c2:'#b09a68',arena:{rocks:10,rockC:'#c8b48a'},zn:['Heliópolis','ΦΟΙΝΙΞ','Leyenda · Heródoto II 73'],
  mk:(R,i)=>{const g=new THREE.Group();R.g.add(g);let w=[];if(crbHas('ave')){const b=crbPart('CR_ave_cuerpo');b.position.set(0,0,0);g.add(b);for(const k of['aI','aD']){const p=crbPart('CR_ave_'+k);if(!p)continue;const piv=new THREE.Group();piv.position.copy(p.position);p.position.set(0,0,0);piv.add(p);g.add(piv);w.push(piv);}herTint(g,'#ff9a50');g.scale.setScalar(1.6);}
    const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ffb040',transparent:true,opacity:0.6,blending:THREE.AdditiveBlending,depthWrite:false}));gl.scale.set(4,4,1);g.add(gl);return {g,wings:w};},
  rule:'El Fénix vuela sobre el templo del Sol y <b>suelta chispas</b>; la sombra roja avisa dónde caen. Los orbes son mirra: reúne veinte para su nido.',win:'«Veinte orbes de mirra. El Fénix hace su nido y arde, y de la ceniza sale un Fénix nuevo.»',
  myth:'Heródoto (II 73) cuenta lo que le dijeron los sacerdotes de Heliópolis, aunque no se lo cree: que el Fénix, rojo y dorado como un águila, viene cada 500 años desde Arabia con el cuerpo de su padre envuelto en mirra, para enterrarlo en el templo del Sol. Lo de que renace de sus cenizas es de autores posteriores (Ovidio, Metamorfosis XV 391-407; Plinio X 3-5).'});
// ---- 45 Lamia y Empusa: espectros que cruzan
bestLanes('empusa',{t:'Lamia y Empusa',who:'Los espectros',at:['lebadea'],ro:['cumae'],c1:'#3a3640',c2:'#28242e',arena:{dark:true,rocks:18,rockC:'#3a3640'},zn:['El camino de los muertos','ΕΜΠΟΥΣΑ','Leyenda · Aristófanes, Ranas 285-311'],
  mk(R){const g=bestHuman('mujer',{chiton:'#d0d4e0',himation:'#9aa0b8'},1.2);g.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=0.55;o.material.emissive=new THREE.Color('#203048');}});R.g.add(g);return {g,legs:[],human:g};},
  rule:'Los espectros de los cuentos de miedo <b>cruzan el camino de los muertos</b> deslizándose: una franja avisa por dónde. Apártate.',win:'«Veinte orbes. Los espectros se desvanecen: eran cuentos para asustar a los niños.»',
  myth:'Lamia y Empusa eran los fantasmas de los cuentos de miedo griegos. En las Ranas de Aristófanes (285-311, del 405 a.C.), Dioniso, bajando al Hades, ve a Empusa, que cambia de forma: vaca, mula, mujer hermosa, perro, con una pierna de bronce. A Lamia, según Diodoro (XX 41), la usaban las nodrizas para asustar a los niños.'});
// ---- 46 las Erinias: cruzan y preguntan
bestQuiz(bestLanes('erinias',{t:'Las Erinias',who:'Las Erinias',at:['delfos'],ro:['athenae'],fly:1.5,c1:'#4a4448',c2:'#36303a',arena:{dark:true,rocks:12},zn:['El templo de Delfos','ΕΡΙΝΥΕΣ','Leyenda · Esquilo, Euménides'],
  mk(R){const g=bestHuman('mujer',{chiton:'#1a1418',himation:'#2a2028'},1.15);R.g.add(g);if(crbHas('arpia')){for(const k of['aI','aD']){const p=crbPart('CR_arpia_'+k);if(!p)continue;p.position.set(k==='aI'?-0.12:0.12,1.35,-0.08);p.scale.setScalar(1.2);herTint(p,'#3a3038');g.add(p);}}return {g,legs:[],human:g};},
  rule:'Las Erinias persiguen a Orestes y <b>cruzan volando el templo</b>: una franja avisa por dónde. Y cada 4 orbes te preguntan, como en un juicio: si fallas, cuenta como golpe.',
  win:'«Veinte orbes y un juicio justo. Las Erinias se convierten en Euménides, «las Benévolas», y se quedan a vivir en Atenas.»',
  myth:'En las Euménides de Esquilo (458 a.C.), las Erinias, diosas de la venganza, persiguen a Orestes, que ha matado a su madre. Atenea funda el tribunal del Areópago para juzgarlo; los votos empatan, ella vota a favor de Orestes y convence a las Erinias de quedarse en Atenas como Euménides, «las Benévolas».'}),
  [['Primera pregunta del juicio','¿Qué tribunal funda Atenea para juzgar a Orestes?',['El Areópago','La Boulé','La Heliea'],0,'El Areópago, en la colina de Ares, que en el 386 a.C. sigue juzgando los homicidios.'],
   ['Segunda pregunta','En un juicio ateniense, ¿cómo votaban los jueces?',['Con fichas o piedrecitas en urnas, en secreto','Levantando la mano','Lo decidía un solo juez'],0,'Con piedrecitas (psephoi) y, más tarde, con fichas de bronce, en urnas.'],
   ['Tercera pregunta','¿Por qué es importante el final de las Euménides?',['La venganza deja paso a un juicio con tribunal','Gana la venganza','Orestes se queda en Delfos para siempre'],0,'La cadena de venganzas de la familia de Agamenón se corta con un juicio: la justicia de la ciudad.'],
   ['Cuarta pregunta','¿Quién escribió la Orestíada, la trilogía de las Euménides?',['Esquilo','Aristófanes','Heródoto'],0,'Esquilo, en el 458 a.C.: Agamenón, Las Coéforas y Las Euménides.'],
   ['Última pregunta','Si un juicio empataba en Atenas, ¿qué pasaba con el acusado?',['Quedaba absuelto','Lo condenaban','Se repetía el juicio'],0,'Quedaba absuelto: el «voto de Atenea» favorecía al acusado.']],'Las Erinias');
// ---- 47 el Tritón de Tanagra
bestThrower('triton',{t:'El Tritón de Tanagra',who:'El Tritón',at:['platea'],proj:'agua',per:2.2,c1:'#7a8a6a',c2:'#62705a',arena:{sea:true,rocks:12},zn:['La orilla de Tanagra','ΤΡΙΤΩΝ','Leyenda · Pausanias IX 20,4'],
  units:R=>{const g=new THREE.Group();g.position.set(0,-0.3,-12.5);R.g.add(g);if(crbHas('triton')){const b=crbPart('CR_triton_cuerpo');b.position.set(0,0,0);b.scale.setScalar(2.2);g.add(b);}else g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.3,3,8),lam('#3a6a5a')));return [{g,y:4}];},
  rule:'El Tritón asusta a las mujeres que bajan a bañarse lanzando <b>chorros de agua</b>: los círculos avisan dónde caen. Apártate.',win:'«Veinte orbes. El Tritón vuelve al mar: hoy no ha robado ni una oveja.»',
  myth:'Pausanias (IX 20,4-5) cuenta en Tanagra (Beocia) que un Tritón atacaba a las mujeres que se bañaban en el mar y robaba ganado, hasta que lo emborracharon con vino; él mismo vio un tritón disecado en el templo de Dioniso. Los tritones, hijos de Poseidón, son mitad hombre, mitad pez (Hesíodo, Teogonía 930-933).',late:'Lo que cuenta Pausanias es del siglo II d.C.'});
// ---- 48 la serpiente de Esculapio: acompañarla
bestDef('esculapio',{t:'La serpiente de Esculapio',who:'La serpiente',at:['epidauro'],menuRo:true,c1:'#6a8a5a',c2:'#56744a',arena:{trees:16,sea:true},zn:['El santuario de Epidauro','ASCLEPIVS','Leyenda · Livio, Periocha XI; Ovidio, Metamorfosis XV 622-744'],
  rule:'La serpiente sagrada del dios de la medicina va por su camino. Aquí nadie ataca: <b>acompáñala sin alejarte más de 7 m</b> y reúne los orbes que aparecen a su paso. Si te quedas atrás más de 3 segundos, cuenta como golpe.',
  win:'«Veinte orbes. La serpiente llega a la isla del Tíber y allí se queda: es el santuario de Esculapio de Roma.»',
  myth:'En el 293 a.C., durante una peste, los romanos mandaron a buscar al dios de la medicina a Epidauro. Según contaban, una serpiente sagrada subió sola a su barco y, al llegar a Roma, nadó hasta la isla del Tíber, donde se construyó el templo de Esculapio (Livio, Periocha XI; Valerio Máximo I 8,2; Ovidio, Metamorfosis XV 622-744). La isla se reformó con forma de barco.',
  late:'Esta leyenda es de un siglo después del 386 a.C. En Atenas, el culto de Asclepio llegó desde Epidauro en el 420 a.C., y Sófocles lo acogió en su casa.',
  extra:{reset(R){const A=this;if(!A.S||(crbHas('serp')&&!A.S.cr)){if(A.S)R.g.remove(A.S.g);const g=new THREE.Group();R.g.add(g);let cr=false;if(crbHas('serp')){const b=crbPart('CR_serp_cuerpo');b.position.set(0,0,0);g.add(b);const h=crbPart('CR_serp_cabeza');if(h)g.add(h);herTint(g,'#b09a70');g.scale.setScalar(0.55);cr=true;}else g.add(new THREE.Mesh(new THREE.SphereGeometry(0.3,8,6),lam('#8a7a50')));A.S={g,cr};}
      A.a=0;A.far=0;LEY.extra='<span>La serpiente avanza</span>';},
    tick(dt,t,act){const A=this,R=LEY.R;if(!A.S||!R)return;if(crbHas('serp')&&!A.S.cr)A.reset(R);if(act)A.a+=dt*0.12;const r=9+Math.sin(A.a*3)*3,x=Math.cos(A.a)*r,z=Math.sin(A.a)*r;A.S.g.position.set(x,0,z);A.S.g.rotation.y=Math.atan2(-Math.sin(A.a),Math.cos(A.a));
      if(!act)return;const d=Math.hypot(player.x-R.X-x,player.z-R.Z-z);if(d>7){A.far+=dt;LEY.extra='<span style="color:#ff9a5a">¡No te quedes atrás!</span>';}else{A.far=0;LEY.extra='<span>La serpiente avanza</span>';}},
    hitTest(){if(this.far>3){this.far=0;return true;}return false;},
    orbOk(x,z){const A=LEG.esculapio;if(!A.S)return true;return Math.hypot(x-A.S.g.position.x,z-A.S.g.position.z)<8;},end(){}}});
// ---- 49 la serpiente del Bagradas
bestStriker('bagradas',{t:'La serpiente del Bagradas',who:'La serpiente',ro:['cartago'],tint:'#8a7a5a',spots:[[0,-9,2.4]],reach:9,c1:'#b8a070',c2:'#a08a5a',arena:{rocks:14,rockC:'#b09a78'},zn:['El río Bagradas','BAGRADA','Leyenda · Valerio Máximo I 8 ext. 19'],
  rule:'Junto al río, una serpiente enorme <b>brilla antes de lanzarse</b>: apártate o para con el escudo.',win:'«Veinte orbes. La serpiente vuelve al río y el ejército de Régulo puede seguir su marcha.»',
  myth:'Valerio Máximo (I 8 ext. 19) y Plinio (Historia natural VIII 37) cuentan que en el 256 a.C., en la primera guerra púnica, el ejército del cónsul Régulo se encontró junto al río Bagradas, cerca de Cartago, una serpiente de 120 pies, y que su piel se guardó en Roma hasta la guerra de Numancia. Es una leyenda: los historiadores modernos no se la creen, pero los romanos la contaban como historia.'});
// ---- 50 los Cíclopes de la fragua
bestThrower('ciclopes',{t:'La fragua de los Cíclopes',who:'Los Cíclopes',at:['lemnos'],ro:['aetna'],proj:'yunque',per:2.1,multi:2,c1:'#4a3e36',c2:'#3a302a',arena:{dark:true,rocks:20,rockC:'#3a3430'},zn:['La fragua del volcán','ΚΥΚΛΩΠΕΣ','Leyenda · Hesíodo, Teogonía 139-146'],
  units:R=>[-4.5,4.5].map(x=>{const g=bestOneEye(bestHuman('obrero',{chiton:'#2a201a'},2.6),1.68);g.position.set(x,0,-12);R.g.add(g);const f=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ff7a2a',transparent:true,opacity:0.7,blending:THREE.AdditiveBlending,depthWrite:false}));f.scale.set(3,3,1);f.position.set(x*0.5,1,-11);R.g.add(f);return {g,y:5};}),
  rule:'Los Cíclopes forjan rayos para Zeus y, enfadados por la visita, <b>lanzan yunques y escoria</b> de dos en dos: los círculos avisan. Apártate.',win:'«Veinte orbes. Los Cíclopes vuelven al yunque: hay rayos que terminar.»',
  myth:'En Hesíodo (Teogonía 139-146), los Cíclopes Brontes, Estéropes y Arges, «trueno, relámpago y rayo», hijos de Urano, forjaron el rayo de Zeus. Más tarde se les hizo ayudantes de Hefesto en sus fraguas de Lemnos o bajo los volcanes de Sicilia y de las islas Eolias (Calímaco, Himno a Ártemis 46-86; Virgilio, Eneida VIII 416-453).'});
// ---- portales: más de uno por destino (cada uno un poco más allá)
{const f=leyDestTick;leyDestTick=function(){if(!leyOpen()||typeof ISLANDS==='undefined')return;const L=LEY_DEST[MODE==='roma'?'roma':'atenas'],cnt={};
  for(const[id,room]of L){cnt[id]=(cnt[id]||0)+1;const key=id+':'+room;if(MNT.dest[key]||(cnt[id]===1&&MNT.dest[id]))continue;const I=ISLANDS.find(q=>q.id===id);if(!I||!LEG[room])continue;
    if(Math.hypot(player.x-I.x,player.z-I.z)>I.R*1.4)continue;const c=I.town||I,n=cnt[id]-1,a0=n*0.9,ox=22*Math.cos(a0)-14*Math.sin(a0),oz=22*Math.sin(a0)+14*Math.cos(a0),f2=findFree(c.x+ox,c.z+oz,1.6)||[c.x+ox,c.z+oz],a=Math.atan2(c.x-f2[0],c.z-f2[1])+Math.PI;
    const o=int2Door({id:'ley_'+room,room,x:f2[0],z:f2[1],a,name:'Portal de leyenda',sub:LEG[room].title()});o.g.position.y=floorAt(f2[0],f2[1]);leyRed(o);MNT.dest[key]=o;if(n===0)MNT.dest[id]=o;}};}
