// ============================================================ LOS DEMÁS TRABAJOS DE HERACLES EN LOS PORTALES DE LEYENDA (23/11)
// «Añádelos todos»: los siete trabajos con criatura que faltaban, cada uno en su destino (los portales aparecen al llegar, cuando los
// portales están abiertos; en Roma también salen en el menú del portal de Hércules). Las criaturas son de Blender (criaturas.py, 249).
// Como en los demás: nadie sale herido; se esquiva, se para con el escudo (Q) y se reúnen 20 orbes de Niké.
//  · La cierva de Cerinea (Arcadia, Mantinea): corre sin parar; Ártemis, celosa de su cierva, lanza flechas de luz que avisan con una
//    sombra. Apolodoro II 5,3; Píndaro, Olímpica III 26-34 (cuernos de oro); Calímaco, Himno a Ártemis 98-109.
//  · El jabalí de Erimanto (en la nieve): embiste como el león. Apolodoro II 5,4; Diodoro IV 12.
//  · El toro de Creta (Creta): embiste. Apolodoro II 5,7; Pausanias I 27,9-10 (luego, el toro de Maratón).
//  · Las yeguas de Diomedes (Tasos, frente a la costa de los bistones de Tracia): cruzan la arena al galope; el polvo avisa por dónde.
//    Apolodoro II 5,8; Eurípides, Alcestis 481-498. (En el mito comían carne humana: aquí, solo galopan.)
//  · Los bueyes de Gerión: el gigante de tres cuerpos lanza piedras desde lejos y su perro Ortro, de dos cabezas, embiste.
//    Hesíodo, Teogonía 287-294 y 309; Apolodoro II 5,10. En Atenas, en Siracusa (Diodoro IV 23: Heracles cruzó Sicilia con los
//    bueyes); en Roma, en Gades, junto a Eritía.
//  · Las manzanas de las Hespérides: Ladón, enroscado al árbol, lanza la cabeza hacia ti tras un aviso. Hesíodo, Teogonía 333-335;
//    Apolonio IV 1396-1407. En Cirene (algunos situaban el jardín en Libia, junto a Evespérides).
//  · Cerbero (cabo Ténaro; en Roma, Cumas, junto al lago Averno): tres cabezas y cola de serpiente; embiste. Apolodoro II 5,12.
// (Los establos de Augías y el cinturón de Hipólita no tienen criatura: no tienen portal.)
const HER12={};
// ---- escenarios
function herArena(room,c1,c2,opt){const R=legArena(room,c1,c2);const g=R.g;opt=opt||{};
  if(opt.rocks)legRocks(R,opt.rocks,LEY_RA+2,LEY_RA+14,opt.rockC||'#8d8476',opt.seed||5);
  if(opt.trees){const m=lam(opt.treeC||'#3e5232');for(let i=0;i<opt.trees;i++){const a=Math.random()*TAU,r=LEY_RA+4+Math.random()*16,h=5+Math.random()*4,t=new THREE.Mesh(new THREE.ConeGeometry(1.4+Math.random(),h,7),m);t.position.set(Math.cos(a)*r,h/2,Math.sin(a)*r);t.castShadow=true;g.add(t);}}
  if(opt.sea){const s=new THREE.Mesh(new THREE.CircleGeometry(60,40,Math.PI*0.1,Math.PI*0.8),new THREE.MeshPhongMaterial({color:'#2f5f78',shininess:80}));s.rotation.x=-Math.PI/2;s.rotation.z=Math.PI;s.position.set(0,0.03,-LEY_RA-3);g.add(s);}
  if(opt.snow){const m=lam('#f2f4f6');for(let i=0;i<40;i++){const a=Math.random()*TAU,r=LEY_RA+1+Math.random()*12,s=1+Math.random()*3,k=new THREE.Mesh(new THREE.SphereGeometry(s,8,6),m);k.scale.y=0.35;k.position.set(Math.cos(a)*r,0,Math.sin(a)*r);g.add(k);}}
  if(opt.dark){for(let i=0;i<10;i++){const a=i/10*TAU,f=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#6a8aff',transparent:true,opacity:0.5,blending:THREE.AdditiveBlending,depthWrite:false}));f.scale.set(1.4,2.2,1);f.position.set(Math.cos(a)*(LEY_RA+2),1.2,Math.sin(a)*(LEY_RA+2));g.add(f);}}
  INT2_ZN[room]=opt.zn;return R;}
// ---- teñir un modelo (copias del material): el mismo modelo sirve para varias criaturas
function herTint(g,col,metal){const c=new THREE.Color(col);g.traverse(o=>{if(!o.isMesh||!o.material)return;const m=o.material.clone();if(m.color)m.color.multiply(c);if(metal&&'metalness' in m){m.metalness=metal;m.roughness=0.35;}o.material=m;});return g;}
// ---- figura sencilla mientras no llega el modelo de Blender
function herSimple(R,col,len,h){const g=new THREE.Group(),m=lam(col),b=new THREE.Mesh(new THREE.SphereGeometry(0.5,12,9),m);b.scale.set(0.8*h,0.8*h,len);b.position.y=h;g.add(b);
  const hd=new THREE.Mesh(new THREE.SphereGeometry(0.3*h,10,8),m);hd.position.set(0,h*1.2,len*0.55);g.add(hd);const legs=[];
  for(const[x,z]of[[-0.3,0.4],[0.3,0.4],[-0.3,-0.4],[0.3,-0.4]]){const p=new THREE.Group();p.position.set(x*h,h,z*len);const l=new THREE.Mesh(new THREE.CylinderGeometry(0.08*h,0.07*h,h,6),m);l.position.y=-h/2;p.add(l);g.add(p);legs.push(p);}
  R.g.add(g);return {g,legs,body:new THREE.Object3D()};}
// ---- los que embisten (como el león de 210): jabalí, toro, Cerbero, Ortro
function herCharger(key,o){const C=Object.assign({},LEG.leon,o);
  C.mk=function(R){const L2=crbHas(o.model)&&crbQuad(R,o.model,o.scale);if(L2){L2.body.position.y=1;if(o.tint)herTint(L2.g,o.tint,o.metal);return L2;}return herSimple(R,o.col,o.len||1,o.h||0.9);};
  C.reset=function(R){const A=this;if(!A.lion){A.lion=A.mk(R);}A.lion.g.visible=true;A.lion.g.position.set(0,0,-8);A.lion.g.rotation.set(0,0,0);A.st='acecha';A.t=3;A.ang=-Math.PI/2;A.waitK=1;A.rested=false;LEY.extra='<span>'+o.who+': acecha</span>';};
  C.tick=function(dt,t,act){const A=this;if(crbHas(o.model)&&A.lion&&!A.lion.cr&&LEY.R){const old=A.lion,p=old.g.position.clone(),ry=old.g.rotation.y;LEY.R.g.remove(old.g);A.lion=A.mk(LEY.R);A.lion.g.position.copy(p);A.lion.g.rotation.y=ry;}
    const r=LEG.leon.tick.call(this,dt,t,act);if(LEY.extra&&LEY.extra.indexOf('León')>=0){LEY.extra=LEY.extra.replace('León',o.who);try{leyHud();}catch(e){}}return r;};
  C.end=function(){this.rested=true;LEY.extra='<span>'+o.who+': descansa</span>';};
  LEG[key]=C;return C;}
herCharger('jabali',{who:'El jabalí',model:'jabali',scale:1.6,col:'#4a3c30',len:1.1,h:0.8,title:()=>'El jabalí de Erimanto',
  rule:'El jabalí hoza a tu alrededor; cuando <b>baja la cabeza y gruñe</b>, embiste en línea recta: apártate de lado o para el golpe con el escudo. Cada 4 orbes embiste más a menudo.',
  lose:'El jabalí te ha derribado tres veces.',win:'«Veinte orbes en la nieve del Erimanto. El jabalí, hundido hasta el pecho y sin aliento, se queda quieto. Como en el mito, la nieve lo ha cansado.»',
  myth:'<p class="sub">En el mito, Euristeo pidió el jabalí del monte Erimanto vivo. Heracles lo hizo salir de su guarida a gritos, lo obligó a correr por la nieve honda hasta que se cansó y lo llevó a Micenas a hombros; Euristeo, del miedo, se escondió en una tinaja de bronce (Apolodoro II 5,4; Diodoro IV 12). Aquí solo hay que esquivarlo.</p>',
  build(){return herArena('jabali','#e8ebee','#cfd5da',{snow:true,trees:26,treeC:'#2f4030',zn:['El monte Erimanto','ΕΡΥΜΑΝΘΟΣ','Leyenda · Apolodoro, Biblioteca II 5,4']});}});
herCharger('toro',{who:'El toro',model:'toro',scale:1.05,col:'#e8e4da',len:1.4,h:1.1,title:()=>'El toro de Creta',
  rule:'El toro escarba y resopla; cuando <b>agacha los cuernos y muge</b>, embiste en línea recta: apártate o para el golpe con el escudo. Cada 4 orbes embiste más a menudo.',
  lose:'El toro te ha derribado tres veces.',win:'«Veinte orbes junto al mar. El toro blanco se cansa de embestir al aire y se mete en el agua hasta las rodillas, tranquilo, como el día en que salió de ella.»',
  myth:'<p class="sub">En el mito, Poseidón hizo salir del mar un toro blanco para que Minos se lo sacrificara; Minos se lo quedó, y el dios hizo enloquecer al animal. Heracles lo atrapó y lo llevó a Grecia; suelto, acabó en Maratón, donde más tarde lo venció Teseo (Apolodoro II 5,7; Pausanias I 27,9-10). Es también el padre del Minotauro. Aquí basta con esquivarlo.</p>',
  build(){return herArena('toro','#7f8a4c','#6a7440',{sea:true,rocks:14,rockC:'#a09a88',zn:['La costa de Creta','ΚΡΗΤΗ','Leyenda · Apolodoro, Biblioteca II 5,7']});}});
herCharger('cerbero',{who:'Cerbero',model:'cerbero',scale:1.5,col:'#1e1814',len:1,h:0.8,title:()=>'Cerbero',
  rule:'Cerbero ronda con sus tres cabezas; cuando <b>se agacha y ladra con las tres a la vez</b>, embiste: apártate o para el golpe con el escudo. Cada 4 orbes embiste más a menudo.',
  lose:'Cerbero te ha derribado tres veces.',win:'«Veinte orbes a la orilla del Aqueronte. Cerbero se tumba, con las tres cabezas sobre las patas. Hades te deja salir: has entrado y salido sin hacerle daño, como pidió.»',
  myth:'<p class="sub">En el mito, el último trabajo fue traer del Hades a Cerbero, el perro de tres cabezas, cola de serpiente y serpientes en el lomo, que no deja salir a los muertos. Hades se lo prestó a Heracles con una condición: dominarlo sin armas. Heracles bajó por el cabo Ténaro, lo llevó a Micenas y lo devolvió (Apolodoro II 5,12). Los romanos situaban una entrada al inframundo en el lago Averno, junto a Cumas, por donde baja Eneas (Virgilio, Eneida VI).</p>',
  build(){return herArena('cerbero','#2e2a33','#1d1a22',{dark:true,rocks:30,rockC:'#3a3640',seed:13,zn:['La entrada del Hades','ΑΙΔΗΣ','Leyenda · Apolodoro, Biblioteca II 5,12']});}});
LEG.cerbero.onOrb=function(n){if(n%3===0)this.waitK=Math.max(0.4,this.waitK-0.15);};
// ---- las yeguas de Diomedes: cruzan la arena al galope por carriles; el polvo avisa 1,2 s antes
LEG.yeguas={title:()=>'Las yeguas de Diomedes',
  rule:'Las yeguas cruzan la arena al <b>galope en línea recta</b>: una franja de polvo avisa por dónde van a pasar. Apártate de la franja. Cada 4 orbes corren más yeguas a la vez.',
  lose:'Las yeguas te han arrollado tres veces.',win:'«Veinte orbes entre el polvo. Las yeguas se cansan de galopar y se ponen a pacer, mansas: ya se pueden llevar a Micenas.»',
  myth:'<p class="sub">En el mito, Diomedes, rey de los bistones de Tracia (no el héroe de Troya), tenía unas yeguas salvajes que alimentaba con carne humana. Heracles se las llevó y, cuando comieron, se volvieron mansas (Apolodoro II 5,8; Eurípides, Alcestis 481-498). Aquí no come nadie a nadie: solo galopan.</p>',
  build(){return herArena('yeguas','#9a8a62','#857650',{rocks:12,trees:10,treeC:'#566a3a',zn:['La llanura de Tracia','ΘΡΑΚΗ','Leyenda · Apolodoro, Biblioteca II 5,8']});},
  mkMare(R){const L2=CRB.tpl&&crbQuad(R,'yegua',1.0);const M=L2||herSimple(R,'#2a1d16',1.2,1.1);M.g.visible=false;return M;},
  reset(R){const A=this;if(A.mares)for(const m of A.mares)R.g.remove(m.M.g);A.mares=[];A.max=2;A.t=2;A.marks=A.marks||[];for(const k of A.marks)R.g.remove(k.m);A.marks=[];LEY.extra='<span>Yeguas: 2</span>';},
  lane(R){const P=player,px=P.x-R.X,pz=P.z-R.Z,a=Math.random()*TAU,dx=Math.cos(a),dz=Math.sin(a),ox=px+LEY.pv.x*0.8,oz=pz+LEY.pv.z*0.8;   // un carril que pasa por donde vas a estar
    const L=LEY_RA+4,sx=ox-dx*L,sz=oz-dz*L,ex=ox+dx*L,ez=oz+dz*L;const mk=new THREE.Mesh(new THREE.PlaneGeometry(2.2,L*2),new THREE.MeshBasicMaterial({color:'#d8b878',transparent:true,opacity:0.35,depthWrite:false}));
    mk.rotation.x=-Math.PI/2;mk.rotation.z=-Math.atan2(dx,dz);mk.position.set(ox,0.05,oz);R.g.add(mk);this.marks.push({m:mk,t:1.2});return {sx,sz,ex,ez,dx,dz,warn:1.2,s:0};},
  tick(dt,t,act){const A=this,R=LEY.R;if(!A.mares||!R)return;
    for(let i=A.marks.length-1;i>=0;i--){const k=A.marks[i];k.t-=dt;k.m.material.opacity=0.2+0.35*Math.abs(Math.sin(k.t*10));if(k.t<=0){R.g.remove(k.m);A.marks.splice(i,1);}}
    for(let i=A.mares.length-1;i>=0;i--){const m=A.mares[i];if(m.warn>0){m.warn-=dt;continue;}m.M.g.visible=true;m.s+=dt*15;const x=m.sx+m.dx*m.s,z=m.sz+m.dz*m.s;m.M.g.position.set(x,0,z);m.M.g.rotation.y=Math.atan2(m.dx,m.dz);
      const ph=t*16;m.M.legs.forEach((l,j)=>{l.rotation.x=Math.sin(ph+(j%2?Math.PI:0)+(j>1?Math.PI/2:0))*0.9;});if(m.s>2*(LEY_RA+4)){R.g.remove(m.M.g);A.mares.splice(i,1);}}
    if(!act)return;A.t-=dt;if(A.t<=0&&A.mares.length<A.max){A.t=1.6+Math.random()*1.2;const ln=A.lane(R);ln.M=A.mkMare(R);A.mares.push(ln);try{legSfx('screech');}catch(e){}}},
  hitTest(P){const R=LEY.R;if(Math.abs(P.feet-R.Y)>1.2)return false;for(const m of this.mares){if(m.warn>0||!m.M.g.visible)continue;const g=m.M.g.position;if(Math.hypot(R.X+g.x-P.x,R.Z+g.z-P.z)<1.3){if(LEY_SH.up&&LEY_SH.st>0){const f=-Math.sin(player.yaw)*m.dx+-Math.cos(player.yaw)*m.dz;if(f<-0.3){LEY_SH.st=Math.max(0,LEY_SH.st-0.5);legSfx('clang');player.x+=m.dx*1.5;player.z+=m.dz*1.5;LEY.inv=0.8;return false;}}return true;}}return false;},
  onOrb(n){if(n%4===0){this.max=Math.min(5,this.max+1);LEY.extra='<span>Yeguas: '+this.max+'</span>';}},
  end(){for(const m of this.mares)m.M.g.visible=false;}};
// ---- la cierva de Cerinea: corre en círculos; caen flechas de luz de Ártemis (sombra 1,1 s antes)
LEG.cierva={title:()=>'La cierva de Cerinea',
  rule:'La cierva corre sin parar y <b>Ártemis</b> la protege: sus flechas de luz caen donde vas a estar, y una sombra roja avisa antes. Cada 3 orbes, Ártemis dispara más a menudo.',
  lose:'Las flechas de Ártemis te han alcanzado tres veces.',win:'«Veinte orbes. La cierva se para a beber en el río Ladón y deja que te acerques. Ártemis baja el arco: has cumplido sin herir a su animal sagrado.»',
  myth:'<p class="sub">En el mito, la cierva de Cerinea, de cuernos de oro y pezuñas de bronce, estaba consagrada a Ártemis. Heracles la persiguió un año entero, hasta que la alcanzó junto al río Ladón, en Arcadia; por el camino tuvo que convencer a Ártemis y a Apolo de que no la llevaba para matarla (Apolodoro II 5,3; Píndaro, Olímpica III 26-34; Calímaco, Himno a Ártemis 98-109).</p>',
  build(){return herArena('cierva','#74844a','#62703e',{trees:34,treeC:'#3a5030',rocks:8,zn:['Los bosques de Arcadia','ΑΡΚΑΔΙΑ','Leyenda · Apolodoro, Biblioteca II 5,3']});},
  reset(R){const A=this;if(!A.D||(CRB.tpl&&!A.D.cr)){if(A.D)R.g.remove(A.D.g);A.D=(CRB.tpl&&crbQuad(R,'cierva',1.0))||herSimple(R,'#9a6a40',1,0.9);}A.a=0;A.t=2;A.per=2.2;A.marks=A.marks||[];for(const k of A.marks)R.g.remove(k.m);A.marks=[];LEY.extra='';},
  tick(dt,t,act){const A=this,R=LEY.R;if(!A.D||!R)return;if(CRB.tpl&&!A.D.cr)A.reset(R);
    A.a+=dt*0.55;const r=9+Math.sin(t*0.4)*2.5,x=Math.cos(A.a)*r,z=Math.sin(A.a)*r;A.D.g.position.set(x,Math.max(0,Math.sin(t*9))*0.25,z);A.D.g.rotation.y=Math.atan2(-Math.sin(A.a),Math.cos(A.a));
    const ph=t*13;A.D.legs.forEach((l,j)=>{l.rotation.x=Math.sin(ph+(j%2?Math.PI:0)+(j>1?Math.PI/2:0))*0.8;});
    for(let i=A.marks.length-1;i>=0;i--){const k=A.marks[i];k.t-=dt;k.m.material.opacity=0.25+0.5*(1-k.t/1.1);if(k.t<=0){R.g.remove(k.m);A.marks.splice(i,1);}}
    if(!act)return;A.t-=dt;if(A.t>0)return;A.t=A.per*(0.7+Math.random()*0.6);
    const P=player,tx=P.x-R.X+LEY.pv.x*1.0,tz=P.z-R.Z+LEY.pv.z*1.0,mk=new THREE.Mesh(new THREE.RingGeometry(0.2,1.3,24),new THREE.MeshBasicMaterial({color:'#c0402a',transparent:true,opacity:0.3,depthWrite:false}));
    mk.rotation.x=-Math.PI/2;mk.position.set(tx,0.06,tz);R.g.add(mk);A.marks.push({m:mk,t:1.1});
    const from=new THREE.Vector3(R.X+tx*0.3,R.Y+22,R.Z+tz*0.3-6),to=new THREE.Vector3(R.X+tx,R.Y,R.Z+tz),T=1.1,v=to.clone().sub(from).divideScalar(T);v.y+=0.5*2*T;
    const ar=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.4,5),new THREE.MeshBasicMaterial({color:'#fff2c0'}));const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ffe8a0',transparent:true,opacity:0.8,blending:THREE.AdditiveBlending,depthWrite:false}));gl.scale.set(0.9,0.9,1);ar.add(gl);
    legShot(ar,from,v,{g:2,r:0.42,orient:true,life:3});},
  onOrb(n){if(n%3===0)this.per=Math.max(0.9,this.per-0.25);},
  end(){}};
// ---- Gerión y Ortro
LEG.gerion={title:()=>'Los bueyes de Gerión',
  rule:'Gerión, el gigante de tres cuerpos, <b>lanza piedras</b> desde el fondo: un círculo de polvo avisa dónde caen. Y su perro <b>Ortro</b>, de dos cabezas, embiste cuando se agacha. Cada 4 orbes, todo va más deprisa.',
  lose:'Gerión y Ortro te han derribado tres veces.',win:'«Veinte orbes. Ortro se echa a los pies de su amo y Gerión, con sus tres cuerpos cansados, se sienta en una roca. Los bueyes rojos se dejan llevar.»',
  myth:'<p class="sub">En el mito, Gerión, nieto de Medusa, tenía tres cuerpos unidos por la cintura y vivía en la isla de Eritía, en el extremo occidental, junto al Océano. Sus bueyes rojos los guardaban el pastor Euritión y el perro Ortro, de dos cabezas. Heracles levantó al pasar las Columnas, en el estrecho, y volvió con los bueyes por Iberia, la Galia, Italia y Sicilia (Hesíodo, Teogonía 287-294; Apolodoro II 5,10; Diodoro IV 17-24). Aquí no muere nadie.</p>',
  build(){const R=herArena('gerion','#8a7a5a','#6e6046',{sea:true,rocks:18,rockC:'#8e8270',zn:['La isla de Eritía','ΕΡΥΘΕΙΑ','Leyenda · Apolodoro, Biblioteca II 5,10']});
    const cm=lam('#8a3a22');for(let i=0;i<6;i++){const c=herSimple(R,'#8a3a22',1.2,0.75);c.g.position.set(-14+i*5.5,0,-LEY_RA-6-Math.random()*4);c.g.rotation.y=Math.random()*6;}   // los bueyes rojos, al fondo
    return R;},
  giant(R){const g=new THREE.Group();let ok=false;
    if(typeof bpMake==='function'&&BP.tpl&&BP.tpl.hoplita){for(let k=0;k<3;k++){const h=bpMake('hoplita',{chiton:'#6a2a1a'});if(!h)continue;h.userData.noBlender=1;h.rotation.y=(k-1)*0.55;h.position.x=(k-1)*0.38;g.add(h);ok=true;}}
    if(!ok){for(let k=0;k<3;k++){const p=makePerson({chiton:'#6a2a1a',spear:true,noVary:true,noBlender:true});p.rotation.y=(k-1)*0.55;p.position.x=(k-1)*0.38;g.add(p);}}
    g.scale.setScalar(2.3);g.position.set(0,0,-12.5);R.g.add(g);return g;},
  reset(R){const A=this;if(!A.G){A.G=this.giant(R);}A.t=2.5;A.per=2.4;A.warn=0;A.dust=A.dust||[];for(const d of A.dust)R.g.remove(d.m);A.dust=[];
    if(!A.dog){A.dog=Object.create(LEG.ortro);}A.dog.lion=null;LEG.ortro.reset.call(A.dog,R);A.dog.waitK=1.6;},
  tick(dt,t,act){const A=this,R=LEY.R;if(!A.G||!R)return;A.G.rotation.y=Math.atan2(player.x-R.X,player.z-R.Z+12.5);
    for(const h of A.G.children){const B=h.userData&&h.userData.bp;if(B&&B.mix)B.mix.update(dt);}
    for(let i=A.dust.length-1;i>=0;i--){const d=A.dust[i];d.t-=dt;d.m.material.opacity=Math.max(0,d.t)*0.5;if(d.t<=0){R.g.remove(d.m);A.dust.splice(i,1);}}
    LEG.ortro.tick.call(A.dog,dt,t,act);if(LEY.extra&&LEY.extra.indexOf('Ortro')<0)LEY.extra=LEY.extra.replace(/^<span>[^:]*/,'<span>Ortro');
    if(!act)return;
    if(A.warn>0){A.warn-=dt;if(A.warn<=0){const from=new THREE.Vector3(R.X,R.Y+5.5,R.Z-12),to=new THREE.Vector3(A.tx,R.Y,A.tz),T=1.3,v=to.clone().sub(from).divideScalar(T);v.y+=0.5*9*T;
        legShot(new THREE.Mesh(new THREE.DodecahedronGeometry(0.42,0),lam('#7a7062')),from,v,{g:9,r:0.6,life:3,cost:0.3});}}
    else{A.t-=dt;if(A.t<=0){A.t=A.per*(0.7+Math.random()*0.6);A.warn=1.0;const P=player;A.tx=P.x+LEY.pv.x*1.3;A.tz=P.z+LEY.pv.z*1.3;
      const m=new THREE.Mesh(new THREE.RingGeometry(0.3,1.4,24),new THREE.MeshBasicMaterial({color:'#c0402a',transparent:true,opacity:0.45,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(A.tx-R.X,0.06,A.tz-R.Z);R.g.add(m);A.dust.push({m,t:2.3});}}},
  orbOk:(x,z)=>z>-8.5,
  hitTest(P){return this.dog&&LEG.ortro.hitTest.call(this.dog,P);},
  onOrb(n){if(n%4===0){this.per=Math.max(1.2,this.per-0.3);if(this.dog)this.dog.waitK=Math.max(0.6,this.dog.waitK-0.2);}},
  end(){if(this.dog)LEG.ortro.end.call(this.dog);LEY.extra='<span>Gerión y Ortro: descansan</span>';}};
herCharger('ortro',{who:'Ortro',model:'ortro',scale:1.2,col:'#2a2018',len:1,h:0.75,title:()=>'Ortro',rule:'',lose:'',win:'',myth:'',build(){return herArena('ortro','#8a7a5a','#6e6046',{});}});
// ---- Ladón y el árbol de las manzanas de oro
LEG.ladon={title:()=>'Las manzanas de las Hespérides',
  rule:'Ladón, enroscado al árbol, <b>mira hacia ti y sus ojos brillan</b>: entonces lanza la cabeza en línea recta. Apártate de su mirada. Los orbes son esta vez manzanas de oro. Cada 4 manzanas ataca más a menudo.',
  lose:'Ladón te ha alcanzado tres veces.',win:'«Veinte manzanas de oro. Ladón se enrosca más fuerte al árbol y cierra los ojos: las Hespérides, que cantan al atardecer, dicen que puedes irte en paz.»',
  myth:'<p class="sub">En el mito, las manzanas de oro eran el regalo de bodas de Gea a Hera, y las guardaban las Hespérides, hijas de la Noche, y la serpiente Ladón, que nunca dormía, en un jardín del extremo occidental. En una versión, Heracles convenció a Atlas para que fuera por ellas mientras él sostenía el cielo (Hesíodo, Teogonía 215-216 y 333-335; Apolodoro II 5,11; Apolonio IV 1396-1407). Algunos situaban el jardín en Libia, junto a Evespérides, cerca de Cirene.</p>',
  build(){const R=herArena('ladon','#5f7a3e','#4f6634',{trees:16,treeC:'#3d5a2e',zn:['El jardín de las Hespérides','ΕΣΠΕΡΙΔΕΣ','Leyenda · Hesíodo, Teogonía 333-335']});const g=R.g;
    const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.6,6,10),lam('#5a4630'));tr.position.y=3;tr.castShadow=true;g.add(tr);
    const cr=new THREE.Mesh(new THREE.SphereGeometry(3.2,16,12),lam('#3f6a32'));cr.position.y=6.8;cr.scale.y=0.75;cr.castShadow=true;g.add(cr);
    const am=new THREE.MeshPhongMaterial({color:'#e8b030',shininess:90,emissive:new THREE.Color('#4a3000')});for(let i=0;i<26;i++){const a=Math.random()*TAU,e=Math.random()*1.2-0.3,ap=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),am);ap.position.set(Math.cos(a)*3*Math.cos(e),6.8+Math.sin(e)*2.4,Math.sin(a)*3*Math.cos(e));g.add(ap);}
    addCirc(R.X,R.Z,1.9);return R;},
  mk(R){const g=new THREE.Group();R.g.add(g);let head=null;
    if(CRB.tpl&&CRB.tpl.CR_ladon_cuerpo){const b=crbPart('CR_ladon_cuerpo');b.position.set(0,0,0);g.add(b);const h=crbPart('CR_ladon_cabeza');if(h){head=new THREE.Group();head.position.copy(h.position);h.position.set(0,0,0);head.add(h);g.add(head);}g.scale.setScalar(1.25);return {g,head,cr:true};}
    const m=lam('#3a5a2a');for(let i=0;i<40;i++){const a=i*0.4,s=new THREE.Mesh(new THREE.SphereGeometry(0.26,8,6),m);s.position.set(Math.cos(a)*0.75,0.25+i*0.065,Math.sin(a)*0.75);g.add(s);}
    head=new THREE.Group();head.position.set(0.3,3.45,0.7);const hm=new THREE.Mesh(new THREE.SphereGeometry(0.22,10,8),m);hm.scale.z=1.8;hm.position.z=0.3;head.add(hm);g.add(head);g.scale.setScalar(1.25);return {g,head,cr:false};},
  reset(R){const A=this;if(!A.D||(CRB.tpl&&!A.D.cr)){if(A.D)R.g.remove(A.D.g);A.D=A.mk(R);}A.st='mira';A.t=2.5;A.per=2.8;A.out=0;
    if(!A.glow){A.glow=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#ffd040',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));A.glow.scale.set(1.6,1.6,1);R.g.add(A.glow);}LEY.extra='<span>Ladón: vigila</span>';},
  tick(dt,t,act){const A=this,R=LEY.R;if(!A.D||!R)return;if(CRB.tpl&&!A.D.cr){const st=A.st;A.reset(R);A.st=st;}
    const P=player,px=P.x-R.X,pz=P.z-R.Z,H=A.D.head,base=H?new THREE.Vector3().copy(H.userData.p0||(H.userData.p0=H.position.clone())):null;
    if(A.st!=='ataca')A.D.g.rotation.y+=((Math.atan2(px,pz)-Math.atan2(0.3,0.7))-A.D.g.rotation.y)*Math.min(1,dt*1.5);
    if(H&&A.st!=='ataca'){A.D.g.updateMatrixWorld(true);H.lookAt(P.x,R.Y+1.2,P.z);}
    const hw=new THREE.Vector3();if(H)H.getWorldPosition(hw);A.glow.position.set(hw.x-R.X,hw.y-R.Y,hw.z-R.Z);A.glow.material.opacity=A.st==='aviso'?0.6+0.4*Math.sin(t*20):0;
    if(A.st==='ataca'){A.out+=dt;const k=A.out<0.35?A.out/0.35:Math.max(0,1-(A.out-0.35)/0.6);if(H&&base&&A.wd){const ry=A.D.g.rotation.y,c=Math.cos(ry),sn=Math.sin(ry),lx=A.wd.x*c-A.wd.z*sn,lz=A.wd.x*sn+A.wd.z*c;H.position.set(base.x+lx*k*7/1.25,base.y-k*2.2/1.25,base.z+lz*k*7/1.25);}if(A.out>0.95){A.st='mira';A.t=A.per*(0.7+Math.random()*0.6);if(H)H.position.copy(base);LEY.extra='<span>Ladón: vigila</span>';leyHud();}}
    if(!act)return;
    if(A.st==='mira'){A.t-=dt;if(A.t<=0){A.st='aviso';A.t=0.9;LEY.extra='<span style="color:#ff9a5a">Ladón: ¡va a atacar!</span>';leyHud();try{legSfx('fire');}catch(e){}}}
    else if(A.st==='aviso'){A.t-=dt;if(A.t<=0){const L2=Math.hypot(px,pz)||1;A.dir={x:px/L2,z:pz/L2};A.lx=px;A.lz=pz;A.st='ataca';A.out=0;
        // el ataque es en el sistema del dragón (que ya mira hacia ti): adelante en su z local
        A.dir={x:0,z:1};A.wd={x:px/L2,z:pz/L2};}}},
  hitTest(P){const A=this,R=LEY.R;if(A.st!=='ataca'||A.out<0.2||A.out>0.6||!A.wd)return false;const px=P.x-R.X,pz=P.z-R.Z,along=px*A.wd.x+pz*A.wd.z,side=Math.abs(-px*A.wd.z+pz*A.wd.x);
    if(along<1||along>10||side>1.1)return false;if(LEY_SH.up&&LEY_SH.st>0){const f=-Math.sin(player.yaw)*A.wd.x+-Math.cos(player.yaw)*A.wd.z;if(f<-0.3){LEY_SH.st=Math.max(0,LEY_SH.st-0.45);legSfx('clang');LEY.inv=0.8;A.out=0.61;return false;}}A.out=0.61;return true;},
  orbOk:(x,z)=>Math.hypot(x,z)>3,
  onOrb(n){if(n%4===0)this.per=Math.max(1.3,this.per-0.35);},
  end(){this.st='duerme';LEY.extra='<span>Ladón: cierra los ojos</span>';}};
// ---- registro: salas, orden, portales de los destinos y menú del portal de Roma
for(const k of['cierva','jabali','toro','yeguas','gerion','ladon','cerbero']){LEY_ROOMS.push(k);LEG_ORDER.push(k);LEY_HER.push(k);}
LEY_DEST.atenas.push(['mantinea','cierva'],['erimanto','jabali'],['creta','toro'],['tasos','yeguas'],['siracusa386','gerion'],['cirene','ladon'],['tenaro','cerbero']);
LEY_DEST.roma.push(['gades','gerion'],['cumae','cerbero'],['cyrene','ladon']);
// en Atenas, el menú de un portal no las ofrece (cada una tiene el suyo); 237 las quitaría de Roma si no estuvieran aquí
