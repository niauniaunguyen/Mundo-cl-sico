// ============================================================ oficios: talleres y vendedores con su trabajo, su explicación y sus pregones
const OFIC=[];
function sfxOficio(k){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;
  if(k==='yunque'){[0,0.32].forEach((d,i)=>{const o=c.createOscillator();o.type='square';o.frequency.value=i?1180:1240;o.connect(envGain(t+d,0.035,0.002,0.25));o.start(t+d);o.stop(t+d+0.3);});}
  else if(k==='campana'){[880,1320,1760].forEach((f,i)=>{const o=c.createOscillator();o.type='sine';o.frequency.value=f;o.connect(envGain(t,0.05/(i+1),0.003,1.6));o.start(t);o.stop(t+1.7);});}
  else if(k==='molino'){const o=c.createOscillator();o.type='sawtooth';o.frequency.value=55;o.connect(envGain(t,0.02,0.2,1.2));o.start(t);o.stop(t+1.4);}}
// tipo: 'taller' (con trabajadores animados) o 'pregon' (vendedor que anuncia su mercancía cada cierto tiempo)
function oficio(o){let[x,z]=findFree(o.x,o.z,o.r||3);if(roadDist(x,z)<(o.r||3)+2.5){for(let k=1;k<=12;k++){const a2=k*2.4,dd=4+k*1.5,q=findFree(x+Math.cos(a2)*dd,z+Math.sin(a2)*dd,o.r||3);if(roadDist(q[0],q[1])>=(o.r||3)+2.5){[x,z]=q;break;}}}   // los puestos, fuera del camino
  const gy=floorAt(x,z),g=grp(x,gy,z,o.rot||0);if(o.build)o.build(g);
  const ppl=(o.ppl||[]).map(p=>{const m=p.make?p.make():makePerson(Object.assign({noVary:true},p.look));m.position.set(p.x||0,p.y||0,p.z||0);m.rotation.y=p.r||0;g.add(m);return{m,anim:p.anim||'brazos'};});
  const lb=labelSprite(o.name,o.sub,false);lb.position.set(0,3.4,0);lb.visible=false;g.add(lb);addCirc(x,z,o.r?o.r*0.6:1.6);
  OFIC.push(Object.assign({},o,{x,z,g,ppl,lb,next:0,seen:0}));}
// yunque: tocón de madera, cuerpo de hierro, cara plana arriba (a 0,82 m) y bigornia (el cuerno) a un lado
function anvilAt(g,x,z){const ir=lam('#3d3a38'),wd=lam('#5a3f28');const st=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.32,0.56,10),wd);st.position.set(x,0.28,z);g.add(st);
  box(0.34,0.16,0.2,ir,x,0.64,z,g);box(0.24,0.06,0.3,ir,x,0.59,z,g);box(0.56,0.1,0.24,ir,x,0.77,z,g);
  const hn=new THREE.Mesh(new THREE.ConeGeometry(0.09,0.26,8),ir);hn.rotation.z=-Math.PI/2;hn.position.set(x-0.4,0.77,z);g.add(hn);}
const FSP={pts:null,n:90,i:0,v:null,life:null};
function forjaChispas(o){if(!FSP.pts){const g=new THREE.BufferGeometry(),P=new Float32Array(FSP.n*3).fill(-9999);g.setAttribute('position',new THREE.BufferAttribute(P,3));
    FSP.pts=new THREE.Points(g,new THREE.PointsMaterial({color:0xffa040,size:0.065,map:TORCH_TEX,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false}));FSP.pts.frustumCulled=false;FSP.pts.userData.noCull=true;scene.add(FSP.pts);FSP.v=new Float32Array(FSP.n*3);FSP.life=new Float32Array(FSP.n);}
  const w=o.g.localToWorld(new THREE.Vector3(o.anvil[0],o.anvil[1]+0.04,o.anvil[2])),P=FSP.pts.geometry.attributes.position.array;
  for(let k=0;k<14;k++){const j=FSP.i;FSP.i=(FSP.i+1)%FSP.n;P[j*3]=w.x;P[j*3+1]=w.y;P[j*3+2]=w.z;const a=R()*TAU,sp=rr(1.2,3.4);FSP.v[j*3]=Math.cos(a)*sp;FSP.v[j*3+1]=rr(1.2,3.2);FSP.v[j*3+2]=Math.sin(a)*sp;FSP.life[j]=rr(0.25,0.6);}
  FSP.pts.geometry.attributes.position.needsUpdate=true;}
function forjaTick(dt){if(!FSP.pts)return;const P=FSP.pts.geometry.attributes.position.array;let any=false;
  for(let j=0;j<FSP.n;j++){if(FSP.life[j]<=0)continue;any=true;FSP.life[j]-=dt;if(FSP.life[j]<=0){P[j*3+1]=-9999;continue;}FSP.v[j*3+1]-=9.8*dt;P[j*3]+=FSP.v[j*3]*dt;P[j*3+1]+=FSP.v[j*3+1]*dt;P[j*3+2]+=FSP.v[j*3+2]*dt;}
  if(any)FSP.pts.geometry.attributes.position.needsUpdate=true;}
function ofTick(dt,t){forjaTick(dt);if(!state||!OFIC.length)return;const h=clock.h,open=h>=6.5&&h<18.5,now=performance.now(),d=state.day||1;
  for(const o of OFIC){const dd=Math.hypot(o.x-player.x,o.z-player.z);if(dd>140){continue;}
    const on=open&&(!o.siesta||h<11.5||h>=14);o.g.visible=dd<140;for(const p of o.ppl)p.m.visible=on;
    o.lb.visible=dd<12;if(!on)continue;
    for(const[i,p]of o.ppl.entries()){const a=p.m.userData.arms;
      if(p.anim==='forja'&&a){const ph=(t*1.5+i*0.37)%1,dn=0.22;a[1].rotation.x=ph<dn?lerp(-2.3,-0.62,Math.pow(ph/dn,2)):lerp(-0.62,-2.3,sstep((ph-dn)/(1-dn)));a[0].rotation.x=-0.55;   // la izquierda sujeta la pieza con las tenazas
        if(p.lastPh!==undefined&&p.lastPh<dn&&ph>=dn&&o.anvil&&dd<45){forjaChispas(o);if(dd<22&&ui==='play')sfxClang(0.05*clamp(1-dd/22,0.2,1));}p.lastPh=ph;}
      else if(p.anim==='martillo'&&a){a[1].rotation.x=-1.4+Math.abs(Math.sin(t*3+i))*1.2;}
      else if(p.anim==='pisar'){p.m.position.y=(o.ppl[i].y0===undefined?(o.ppl[i].y0=p.m.position.y):o.ppl[i].y0)+Math.abs(Math.sin(t*4+i))*0.18;if(a){a[0].rotation.x=-0.5;a[1].rotation.x=-0.5;}if(p.m.userData.bp)personWalk(p.m,t*4+i,0.7);}   // con el modelo de Blender: el paso en el sitio, pisando la ropa
      else if(p.anim==='girar'){const R2=o.millR||2.2,ang=t*0.5+i*Math.PI;p.m.position.set(Math.cos(ang)*R2,p.m.position.y,Math.sin(ang)*R2);p.m.rotation.y=-ang;/* de cara hacia donde anda: antes a los animales se les sumaba media vuelta y el burro de la muela andaba de espaldas */if(p.m.userData.arms)personWalk(p.m,t*4,1);}
      else if(a){a[1].rotation.x=-0.8+Math.sin(t*2+i)*0.4;a[0].rotation.x=Math.sin(t*1.3+i)*0.2;}}
    if(o.spin)o.spin.rotation.y=t*0.5;
    if(dd<9&&ui==='play'&&o.seen!==d){o.seen=d;toast('<span class="label">'+o.name+'</span><br>'+o.text);if(o.sfx)sfxOficio(o.sfx);o.next=now+15000;}
    else if(dd<18&&ui==='play'&&now>o.next&&o.pregon){o.next=now+30000+Math.random()*25000;toast('<i>«'+pick(o.pregon)+'»</i> <span class="sub">— '+o.who+'</span>');if(o.sfx)sfxOficio(o.sfx);}
    else if(dd<25&&o.sfx&&o.sfx!=='campana'&&Math.random()<dt*0.25)sfxOficio(o.sfx);}}
function ofSetup(){OFIC.length=0;const W=lam('#6b4a2e'),ST=M.limestone,TER=lam('#a8624a');
  if(MODE==='roma'){
    oficio({x:205,z:-335,rot:0,r:5,name:'Panadería',sub:'pistrinum',sfx:'molino',millR:2.4,
      build:g=>{for(const[mx,mz]of[[0,0]]){const meta=new THREE.Mesh(new THREE.ConeGeometry(0.7,1.2,12),ST);meta.position.set(mx,0.6,mz);g.add(meta);const cat=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.75,1.4,12,1,true),lam('#6f6a62'));cat.position.set(mx,1.4,mz);cat.material.side=THREE.DoubleSide;g.add(cat);}
        const oven=new THREE.Mesh(new THREE.SphereGeometry(1.6,14,10,0,TAU,0,Math.PI/2),TER);oven.position.set(5,0,-2);g.add(oven);box(3.6,0.9,1,W,5,0.45,1.6,g);for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.12,10),lam('#c9935a'));b.position.set(3.8+i*0.45,0.96,1.6);g.add(b);}},
      ppl:[{make:()=>{const a=animal('donkey',{c:{coat:'#7a6a5a',mane:'#2a2018'},extra:['mane'],s:0.9});return a.g;},y:0,anim:'girar'},{look:{short:true,noHimation:true,chiton:'#d8cfb8',hair:'#2a1a12'},x:5,z:2.4,r:Math.PI}],
      text:'Un burro con los ojos tapados da vueltas para mover la muela de piedra volcánica: arriba, una pieza hueca en forma de reloj de arena, el catillus, gira sobre otra cónica, la meta, y muele el trigo. Al lado, el horno de leña. Las panaderías de Pompeya han conservado hasta los panes carbonizados, redondos y divididos en ocho porciones. El panadero Eurísaces, un liberto, se hizo enterrar en Roma en una tumba decorada con su oficio.',
      pregon:['¡Pan caliente! ¡Pan de trigo y pan de cebada!','¡Panes redondos, de ocho porciones, recién salidos del horno!'],who:'el panadero'});
    oficio({x:250,z:-365,rot:0.4,r:4,name:'Lavandería y tintorería',sub:'fullonica',
      build:g=>{for(let i=0;i<3;i++){const t=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.55,0.7,14),ST);t.position.set(-2+i*2,0.35,0);g.add(t);const w=new THREE.Mesh(new THREE.CircleGeometry(0.5,14),lam('#c9c27a'));w.rotation.x=-Math.PI/2;w.position.set(-2+i*2,0.71,0);g.add(w);}
        for(let i=0;i<3;i++){const a=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.15,0.9,8),lam('#b8734a'));a.position.set(3.5,0.45,-1+i*0.7);g.add(a);}box(0.1,1.8,3,W,-3.6,0.9,0,g);box(4,0.05,0.05,W,-1.6,1.8,-1.5,g);for(let i=0;i<3;i++)box(0.9,1.2,0.04,lam(['#efe6d4','#a8392b','#4f6a7d'][i]),-3+i*1.2,1.2,-1.5,g);},
      ppl:[0,1,2].map(i=>({look:{short:true,noHimation:true,chiton:'#a89070',hair:'#2a1a12'},x:-2+i*2,y:0.35,anim:'pisar'})),
      text:'En las tinas, los bataneros pisan la ropa sucia durante horas en agua con tierra de batán y orina, que blanquea la lana. La orina se recoge en ánforas en las esquinas de las calles. El emperador Vespasiano le puso un impuesto, y cuando su hijo Tito se quejó de lo poco digno del negocio, le acercó una moneda a la nariz: «¿Huele?». Desde entonces se dice que el dinero no huele.',
      pregon:['¡Se lavan togas! ¡Blancas como la nieve para las elecciones!'],who:'el batanero'});
    oficio({x:178,z:-300,rot:-0.6,r:2.5,name:'Barbería',sub:'tonstrina',
      build:g=>{box(0.9,0.5,0.9,W,0,0.25,0,g);box(0.3,0.6,0.04,lam('#c9b48b'),0.9,1.4,0,g);},
      ppl:[{look:{short:true,noHimation:true,chiton:'#e9dfc8',hair:'#3a2a1e'},x:0,z:0,y:0,r:0},{look:{short:true,noHimation:true,chiton:'#4f6a7d',hair:'#2a1a12'},x:0.7,z:0.2,r:-Math.PI/2}],
      text:'El barbero afeita con una navaja de hierro sin jabón, solo con agua: un buen barbero es un tesoro y uno torpe deja la cara llena de cortes, que se tapan con telarañas empapadas en aceite. La barbería es también el sitio donde se cuentan todos los chismes de la ciudad. El primer afeitado de un joven es una fiesta: la barba se guarda y se ofrece a los dioses.',
      pregon:['¡Afeitado y corte! ¿Quién quiere quedar como un senador?'],who:'el barbero'});
    oficio({x:290,z:-420,rot:0,r:3,name:'Herrería',sub:'officina ferraria',sfx:'yunque',
      build:g=>{anvilAt(g,0,0);const f=new THREE.Mesh(new THREE.BoxGeometry(1.4,1,1.2),TER);f.position.set(-2,0.5,0);g.add(f);const fire=new THREE.Mesh(new THREE.SphereGeometry(0.3,8,6),new THREE.MeshBasicMaterial({color:'#ff8a3a'}));fire.position.set(-2,1.1,0);g.add(fire);},
      anvil:[0,0.82,0],ppl:[{look:{short:true,noHimation:true,exomis:true,chiton:'#6b5a4a',hair:'#2a1a12',beard:true,attrs:['G_hammer_hand']},x:0.72,r:-Math.PI/2,anim:'forja'}],
      text:'El herrero calienta el hierro en la fragua y lo golpea sobre el yunque: clavos, herramientas, cerraduras, rejas. En su larario honra a Vulcano. En la Subura, entre talleres como este, se oye martillear desde el amanecer: Marcial se quejaba de que en Roma no había manera de dormir.',pregon:null});
    oficio({x:-450,z:150,rot:0,r:3,name:'Taberna de comidas',sub:'thermopolium',
      build:g=>{box(4,1,1,lam('#c9b48b'),0,0.5,0,g);for(let i=0;i<3;i++){const d=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.05,12),lam('#3a2a1e'));d.position.set(-1.2+i*1.2,1.02,0);g.add(d);}box(4,2.4,0.2,lam('#a8392b'),0,1.2,-1.4,g);},
      ppl:[{look:{female:true,chiton:'#e9dfcb',himation:'#7a3a2a',hair:'#3b2a1e'},z:-0.8},{look:{short:true,noHimation:true,chiton:'#a89070',hair:'#2a1a12'},z:1.1,r:Math.PI}],
      text:'Un mostrador de obra con grandes tinajas empotradas: lentejas, garbanzos, salchichas, vino caliente con especias. Como en las ínsulas casi nadie tiene cocina, mucha gente come aquí, de pie o en un banco. Los ricos las miran mal: dicen que en las tabernas solo hay borrachos, marineros y esclavos fugados.',
      pregon:['¡Vino caliente con miel y pimienta! ¡Lentejas con puerro!','¡Pasa, pasa: aquí se come por un as!'],who:'la tabernera'});
    oficio({x:405,z:-150,rot:0,r:2,name:'Vendedor de salchichas',sub:'botularius',
      build:g=>{box(1.2,0.8,0.8,W,0,0.4,0,g);const b=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.25,12),lam('#3a3a3a'));b.position.set(0,0.95,0);g.add(b);},
      ppl:[{look:{short:true,noHimation:true,chiton:'#8a6a4a',hair:'#3a2a1e'},z:-0.7}],siesta:false,
      text:'Junto a las termas siempre hay vendedores: de salchichas calientes, de pasteles, de bebidas. Séneca, que vivía encima de unos baños, se quejaba de no poder concentrarse con tanto grito: el que vende salchichas, el pastelero, el de las bebidas, cada uno con su pregón.',
      pregon:['¡Salchichas calientes! ¡Recién hechas!','¡Pasteles de miel para después del baño!'],who:'el vendedor'});}
  else{
    oficio({x:AL(-75,52)[0],z:AL(-75,52)[1],rot:0,r:2.5,name:'Zapatería',sub:'σκυτοτομεῖον',
      build:g=>{box(1.6,0.8,0.8,W,0,0.4,0,g);for(let i=0;i<4;i++)box(0.25,0.08,0.6,lam('#6b4a2e'),-0.6+i*0.4,0.84,0,g);box(0.4,0.4,0.4,W,0,0.2,0.9,g);},
      ppl:[{look:{chiton:'#b7a27c',exomis:true,hair:'#5a4a3a',beard:true},z:0.9,r:Math.PI,anim:'martillo'}],
      text:'En el borde del Ágora trabajan los zapateros: cortan el cuero y clavan las suelas con clavos de hierro. En el taller de uno de ellos, Simón, se reunía Sócrates con sus jóvenes amigos para conversar, porque no podían entrar en el Ágora. Los arqueólogos encontraron allí clavos de zapatero y un vaso con el nombre de Simón grabado.',pregon:null});
    oficio({x:AL(55,20)[0],z:AL(55,20)[1],rot:0,r:3,name:'Puestos del pescado',sub:'ἰχθυοπωλεῖον',sfx:'campana',
      build:g=>{box(3,0.8,1,ST,0,0.4,0,g);for(let i=0;i<7;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.18,8,6),lam(i%2?'#9aa6ae':'#c0c6c8'));f.scale.set(2.2,0.6,0.8);f.position.set(-1.2+i*0.4,0.9,0);g.add(f);}},
      ppl:[{look:{chiton:'#d8c9a8',exomis:true,hair:'#3b2a1e',beard:true},z:-0.8}],
      text:'Cuando suena la campana, se abre el mercado del pescado y todo el mundo corre: el pescado fresco se acaba pronto. Estrabón cuenta que un citaredo que tocaba ante un público se quedó solo en cuanto sonó la campana; solo un sordo seguía escuchando. Los pescaderos tienen fama de caros y de groseros: los poetas cómicos se burlan de ellos sin parar.',
      pregon:['¡Anguilas del Copais! ¡Atún del Ponto, salmonetes del Falero!','¡Sardinas frescas! ¡A tres óbolos la ración!'],who:'el pescadero'});
    oficio({x:AL(25,-45)[0],z:AL(25,-45)[1],rot:0.3,r:2.5,name:'Barbería',sub:'κουρεῖον',
      build:g=>{box(0.9,0.5,0.9,W,0,0.25,0,g);},
      ppl:[{look:{chiton:'#e8dfcc',himation:'#4f6a7d',hair:'#3a2a1e',beard:true},x:0,z:0},{look:{chiton:'#d7c9ab',exomis:true,hair:'#2a1a12'},x:0.7,z:0.2,r:-Math.PI/2}],
      text:'Las barberías son como clubes: los atenienses van no solo a cortarse el pelo y arreglarse la barba, sino a enterarse de las noticias. El orador Lisias dice que todo el mundo tiene su barbería, su perfumería o su zapatería donde pasar el rato. Plutarco cuenta que la noticia del desastre de Sicilia llegó a Atenas a través de un barbero del Pireo, y que nadie le creyó.',
      pregon:['¡Barba al estilo espartano o a la moda de Atenas, tú eliges!'],who:'el barbero'});
    oficio({x:AL(-110,-10)[0],z:AL(-110,-10)[1],rot:0,r:3,name:'Fundición de bronce',sub:'χαλκεῖον',sfx:'yunque',
      build:g=>{const f=new THREE.Mesh(new THREE.BoxGeometry(1.4,1,1.2),TER);f.position.set(-1.5,0.5,0);g.add(f);const fire=new THREE.Mesh(new THREE.SphereGeometry(0.3,8,6),new THREE.MeshBasicMaterial({color:'#ff8a3a'}));fire.position.set(-1.5,1.1,0);g.add(fire);anvilAt(g,0.6,0);},
      anvil:[0.6,0.82,0],ppl:[{look:{chiton:'#6b5a4a',exomis:true,hair:'#2a1a12',beard:true,attrs:['G_hammer_hand']},x:1.25,r:-Math.PI/2,anim:'forja'}],
      text:'Al pie de la colina del templo de Hefesto, el dios herrero, están los talleres de los broncistas y los herreros. Allí se funden estatuas en fosas excavadas en el suelo y se forjan armas y herramientas. El humo, el ruido y el calor no paran en todo el día.',pregon:null});
    oficio({x:AL(15,55)[0],z:AL(15,55)[1],rot:Math.PI,r:2.5,name:'Panaderas',sub:'ἀρτοπώλιδες',
      build:g=>{box(1.6,0.7,0.8,W,0,0.35,0,g);for(let i=0;i<5;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.18,8,6),lam('#c9935a'));b.scale.y=0.6;b.position.set(-0.6+i*0.3,0.78,0);g.add(b);}},
      ppl:[{look:{female:true,chiton:'#e8dfcc',himation:'#8a5a3a',hair:'#3b2a1e'},z:-0.7}],
      text:'Las vendedoras de pan del Ágora tienen fama de lenguaraces: en Las avispas de Aristófanes, una panadera a la que un borracho ha tirado los panes le amenaza con llevarlo a juicio. Muchas de estas vendedoras son mujeres pobres, metecas o viudas, que ganan así su sustento.',
      pregon:['¡Pan de trigo! ¡Tortas de cebada! ¡Bollos con sésamo!'],who:'la panadera'});}}

