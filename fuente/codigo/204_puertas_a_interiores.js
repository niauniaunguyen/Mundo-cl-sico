// ============================================================ PUERTAS CON AURA: los interiores de la ciudad
// Algunas puertas de la ciudad brillan (azul claro en Atenas, naranja en Roma): se pueden cruzar, andando o con E, y llevan a su interior,
// que es otro mapa (se construye la primera vez, lejos, como la casa propia de 052). Dentro, otra puerta con aura devuelve a la calle.
// Atenas: casas griegas (de un ciudadano acomodado y de una familia humilde), el taller de un alfarero del Cerámico, la cueva de Pan en la
//   ladera norte de la Acrópolis y el santuario de las Venerables (Semnai) bajo el Areópago, cerrado: solo un heraldo de los dioses puede
//   bajar (el caduceo de Hermes, 205).
// Roma: ínsulas (la taberna de la planta baja y, por la escalera, un piso alquilado en lo alto), una villa con peristilo y jardín, la
//   cueva del Lupercal al pie del Palatino y el mundus, la boca del mundo de los muertos, cerrado salvo con el caduceo de Mercurio.
// Cada interior tiene cosas que mirar (con E), con sus fuentes. Anacronismos señalados donde los hay.
const INT2={ppl:[],doors:[],rooms:{},in:null,busy:false,t:0,msgT:0,auraTex:null,ready:false};
function int2Col(){return MODE==='roma'?new THREE.Color('#ff9a3a'):new THREE.Color('#8fdcff');}
function int2AuraTex(){if(INT2.auraTex)return INT2.auraTex;const c=document.createElement('canvas');c.width=64;c.height=128;const x=c.getContext('2d');
  const g=x.createRadialGradient(32,96,4,32,80,70);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(0.45,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,128);
  const v=x.createLinearGradient(0,0,0,128);v.addColorStop(0,'rgba(0,0,0,.65)');v.addColorStop(0.35,'rgba(0,0,0,0)');x.globalCompositeOperation='destination-out';x.fillStyle=v;x.fillRect(0,0,64,128);
  INT2.auraTex=new THREE.CanvasTexture(c);return INT2.auraTex;}
// el aura: un velo de luz en el vano y un halo, que laten; más tenue si la puerta está cerrada para ti
function int2Aura(parent,w,h,locked){const col=int2Col(),m=new THREE.MeshBasicMaterial({map:int2AuraTex(),color:col,transparent:true,opacity:locked?0.35:0.8,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);p.position.y=h/2;parent.add(p);
  const sm=new THREE.SpriteMaterial({map:FG&&FG.glint?FG.glint.map:int2AuraTex(),color:col,transparent:true,opacity:locked?0.25:0.55,blending:THREE.AdditiveBlending,depthWrite:false});
  const s=new THREE.Sprite(sm);s.scale.set(w*2.2,h*1.4,1);s.position.set(0,h*0.55,0.15);parent.add(s);return {p,s,m,sm,base:locked?0.35:0.8};}
// una puerta en el mundo: marco de piedra o madera y el aura; hacia fuera mira +Z local del grupo
function int2Door(o){const g=grp(o.x,floorAt(o.x,o.z),o.z,o.a);const wd=o.cave?2.2:1.5,hh=o.cave?2.6:2.5;
  if(o.cave){const rk=lam('#8d8476');for(let i=0;i<7;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(rr(1.2,2.2),0),rk);const an=Math.PI*(i/6);r.position.set(Math.cos(an)*2.3,Math.sin(an)*2.4+0.4,-0.9);r.rotation.set(rr(0,3),rr(0,3),0);g.add(r);}
    const dk=new THREE.Mesh(new THREE.CircleGeometry(1.3,16,0,Math.PI),new THREE.MeshBasicMaterial({color:'#120d09'}));dk.scale.set(1,1.6,1);dk.position.set(0,0,-0.3);g.add(dk);
    addCirc(o.x-Math.sin(o.a)*1.5+Math.cos(o.a)*2.4,o.z-Math.cos(o.a)*1.5-Math.sin(o.a)*2.4,1.2);addCirc(o.x-Math.sin(o.a)*1.5-Math.cos(o.a)*2.4,o.z-Math.cos(o.a)*1.5+Math.sin(o.a)*2.4,1.2);}
  else{const m=MODE==='roma'?lam('#7a5232'):M.marble;box(0.25,hh+0.3,0.3,m,-wd/2-0.12,(hh+0.3)/2,0,g);box(0.25,hh+0.3,0.3,m,wd/2+0.12,(hh+0.3)/2,0,g);box(wd+0.7,0.3,0.34,m,0,hh+0.3,0,g);
    box(0.06,hh,wd+0.02,lam('#4a321e'),-wd/2+0.02,hh/2,-0.55,g).rotation.y=Math.PI/2.2;}   // la hoja de la puerta, abierta hacia dentro
  const A=int2Aura(g,wd,hh,o.locked&&!int2Key());A.p.position.z=0.05;o.g=g;o.A=A;
  const lb=labelSprite(o.name,o.locked&&!int2Key()?'cerrado: solo un heraldo de los dioses':o.sub,false);lb.position.y=hh+1.4;lb.visible=false;g.add(lb);o.lb=lb;
  const fx=o.x+Math.sin(o.a)*0.9,fz=o.z+Math.cos(o.a)*0.9;o.eg=egxObj(fx,fz,undefined,()=>int2Enter(o),o.locked&&!int2Key()?o.name+' (cerrado)':'Entrar: '+o.name,o.sub,2.2);
  INT2.doors.push(o);return o;}
function int2Key(){try{return !!(state&&state.caduceo);}catch(e){return false;}}
// ---- dónde: casas de la ciudad (una cara libre de la casa) y sitios con nombre (PLACES)
function int2Place(re){if(typeof PLACES==='undefined')return null;const L=PLACES.filter(p=>isFinite(p.x)&&Math.abs(p.x)<4000&&Math.abs(p.z)<4000&&re.test((p.name||'')+' '+(p.id||'')));return L.length?L[0]:null;}   // en la ciudad, no en un destino lejano
function int2HouseDoors(n,used){const ro=MODE==='roma',L=footprints.filter(f=>f.house&&f.w&&f.d&&(ro?romaInUrbs(f.x,f.z):insideWalls(f.x,f.z))),out=[];
  const c=ro?[60,40]:[0,0];L.sort((a,b)=>Math.hypot(a.x-c[0],a.z-c[1])-Math.hypot(b.x-c[0],b.z-c[1]));
  for(const f of L){if(out.length>=n)break;if(used.some(u=>Math.hypot(u[0]-f.x,u[1]-f.z)<(ro?120:90)))continue;if(Math.hypot(f.x-c[0],f.z-c[1])<25)continue;
    // la cara de la casa que da a la calle: la primera con sitio libre delante
    for(const [lx,lz,da] of[[0,1,0],[1,0,Math.PI/2],[0,-1,Math.PI],[-1,0,-Math.PI/2]]){const p=toW(lx*(f.w/2+0.06),lz*(f.d/2+0.06),f.x,f.z,f.a),q=toW(lx*(f.w/2+2),lz*(f.d/2+2),f.x,f.z,f.a);
      if(!isFree(q[0],q[1],0.8)||Math.abs(floorAt(q[0],q[1])-floorAt(p[0],p[1]))>0.6)continue;out.push({x:p[0],z:p[1],a:f.a+da,f,kind:ro&&f.c==='#cdb994'?'dom':'ins'});used.push([f.x,f.z]);break;}}
  return out;}
function int2Spot(P,dx,dz){if(!P)return null;let f=null;try{f=findFree(P.x+dx,P.z+dz,1.6);}catch(e){}if(!f)return null;return {x:f[0],z:f[1],a:Math.atan2(P.x-f[0],P.z-f[1])+Math.PI};}
function int2Setup(){if(INT2.ready||!state||typeof PLACES==='undefined'||PLACES.length<20||!footprints.length)return;INT2.ready=true;const ro=MODE==='roma',used=[];
  const H=int2HouseDoors(ro?4:4,used);
  const T=ro?['insula','insula','villa','insula']:['casaRica','casaPobre','casaRica','taller'];
  const NM2={casaRica:[['Casa de Calias','la casa de un ciudadano acomodado'],['Casa de Critón','la casa de un ciudadano acomodado']]};let nr=0;
  H.forEach((h,i)=>{let t=T[i%T.length];if(ro&&h.kind==='dom'&&t==='insula')t='villa';
    const N={casaRica:['Casa de Calias','la casa de un ciudadano acomodado'],casaPobre:['Casa de Lisístrata','una familia de pocos recursos'],taller:['Taller de Eufronio','un alfarero del Cerámico'],
      insula:['Ínsula de Arrio','taberna abajo; pisos de alquiler arriba'],villa:['Domus de los Vetios','casa con peristilo y jardín']}[t];
    const NN=t==='casaRica'?NM2.casaRica[(nr++)%2]:N;int2Door({id:'d'+i,x:h.x,z:h.z,a:h.a,room:t,name:NN[0],sub:NN[1]});
    if(!ro)try{const hp=toW(1.4,0.6,h.x,h.z,h.a);herm(hp[0],hp[1],h.a);}catch(e){}});   // a la puerta de las casas atenienses, un herma (Hermes Propileo)
  if(ro){const lu=int2Spot(int2Place(/Lupercal/i)||int2Place(/Palatin/i),-8,10);if(lu)int2Door(Object.assign(lu,{id:'lup',room:'lupercal',cave:true,name:'Cueva del Lupercal',sub:'donde la loba amamantó a los gemelos'}));
    const mu=int2Spot(int2Place(/Comicio|Comitium|umbilic|mundus/i)||int2Place(/Foro/i),6,-6);if(mu)int2Door(Object.assign(mu,{id:'mun',room:'mundus',cave:true,locked:true,name:'El mundus',sub:'la boca del mundo subterráneo'}));}
  else{const pa=int2Spot(int2Place(/Pan\b|Clepsidra|Aglauro|Aglauros/i)||int2Place(/Erecteion|Acrópolis/i),-10,24);if(pa)int2Door(Object.assign(pa,{id:'pan',room:'cuevaPan',cave:true,name:'Cueva de Pan',sub:'en la ladera norte de la Acrópolis'}));
    const se=int2Spot(int2Place(/Areópago|Areopago/i)||int2Place(/Acrópolis/i),8,8);if(se)int2Door(Object.assign(se,{id:'sem',room:'semnai',cave:true,locked:true,name:'Santuario de las Venerables',sub:'la grieta bajo el Areópago'}));}}
// ---- dentro: cada interior, una vez, en su sitio lejano
function int2Base(room){const I=ISLANDS[0],k=Object.keys(INT2.rooms).length;return {X:I.x,Y:2400,Z:I.z+14000+k*700};}
function int2Info(R,x,z,name,sub,glyph,title,html){egxObj(R.X+x,R.Z+z,R.Y,()=>int2Dlg(glyph,name,title,html),name,sub,2.4);}
function int2Dlg(glyph,name,title,html){dlg={n:null};ui='dialog';releasePointer();$('dGlyph').textContent=glyph;setName(name,true);$('dTitle').textContent=title;$('dBody').innerHTML=html;
  const o=$('dOpts');o.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>Seguir mirando</span>';b.onclick=closeDialog;o.appendChild(b);$('dialog').hidden=false;}
function int2Room(room){if(INT2.rooms[room])return INT2.rooms[room];const R=int2Base(room);R.g=grp(R.X,R.Y,R.Z,0);INT2.rooms[room]=R;
  const g=R.g,ro=MODE==='roma';
  const F=(w,d,cx,cz,y,m)=>{box(w,0.4,d,m,cx,y-0.2,cz,g);addPlat(R.X+cx,R.Z+cz,w,d,0,R.Y+y);};
  const W=(x1,z1,x2,z2,h,m,y0)=>{const L=Math.hypot(x2-x1,z2-z1),w=new THREE.Mesh(new THREE.BoxGeometry(L,h,0.3),m);w.position.set((x1+x2)/2,(y0||0)+h/2,(z1+z2)/2);w.rotation.y=-Math.atan2(z2-z1,x2-x1);w.castShadow=w.receiveShadow=true;g.add(w);addSeg(R.X+x1,R.Z+z1,R.X+x2,R.Z+z2,0.25);};
  const P=(cfg,x,z,a,y)=>{const p=makePerson(cfg);p.position.set(R.X+x,R.Y+(y||0),R.Z+z);p.rotation.y=a||0;scene.add(p);addCirc(R.X+x,R.Z+z,0.4);INT2.ppl.push(p);return p;};
  const lamp=(x,y,z)=>{const s=new THREE.Mesh(new THREE.SphereGeometry(0.07,8,6),new THREE.MeshBasicMaterial({color:'#ffcf6a'}));s.position.set(x,y,z);g.add(s);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:int2AuraTex(),color:'#ffb24a',transparent:true,opacity:0.6,blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.set(0.8,1.2,1);sp.position.set(x,y+0.1,z);g.add(sp);};
  const exit=(x,z,a)=>{R.exit={x:R.X+x,z:R.Z+z,a};const eg=grp(R.X+x,R.Y,R.Z+z,a);const A=int2Aura(eg,1.5,2.5,false);R.exitA=A;R.exitG=eg;
    egxObj(R.X+x+Math.sin(a)*0.9,R.Z+z+Math.cos(a)*0.9,R.Y,()=>int2Leave(),'Salir a la calle','',2.2);};
  const T=(x,y,z,txt,c)=>{const s=labelSprite(txt,'',false);s.position.set(x,y,z);g.add(s);return s;};
  // suelo de alrededor (por si se mira por un hueco) y cielo tapado en las cuevas
  if(room==='casaRica'||room==='casaPobre'){const rich=room==='casaRica',wl=roleMat('plaster'),st=roleMat('stone'),wd=roleMat('wood');
    const Wd=rich?14:9,D=rich?16:10;F(Wd,D,0,0,0,st);W(-Wd/2,-D/2,Wd/2,-D/2,3.6,wl);W(-Wd/2,-D/2,-Wd/2,D/2,3.6,wl);W(Wd/2,-D/2,Wd/2,D/2,3.6,wl);W(-Wd/2,D/2,-0.9,D/2,3.6,wl);W(0.9,D/2,Wd/2,D/2,3.6,wl);
    if(rich){// patio (aulé) con el altar de Zeus Herkeios y pórtico; andrón con siete lechos; telar; pozo
      const pt=new THREE.Mesh(new THREE.PlaneGeometry(6,6),lam('#c9b48b'));pt.rotation.x=-Math.PI/2;pt.position.set(0,0.01,1);g.add(pt);
      box(0.9,0.9,0.9,M.marble,0,0.45,1,g);addCirc(R.X,R.Z+1,0.7);for(const[cx,cz]of[[-3,-2],[3,-2],[-3,4],[3,4]]){box(0.3,3.4,0.3,M.marble,cx,1.7,cz,g);}
      box(14,0.3,4,roleMat('roof'),0,3.75,-6,g);box(14,0.3,3,roleMat('roof'),0,3.75,6.5,g);
      W(-7,-3.2,-1,-3.2,3.6,wl);W(1,-3.2,7,-3.2,3.6,wl);   // el andrón, al fondo, con su puerta descentrada
      for(let i=0;i<5;i++){const x=-5.6+i*2.8;box(2.2,0.55,0.9,wd,x,0.28,-7.3,g);box(2.1,0.15,0.8,lam('#2f5a5a'),x,0.62,-7.3,g);}
      box(0.12,2.3,0.12,wd,-6,1.15,3,g);box(0.12,2.3,0.12,wd,-6,1.15,5,g);box(0.1,0.1,2.1,wd,-6,2.2,4,g);box(0.02,1.6,1.8,lam('#a8543a'),-6,1.3,4,g);
      const pz=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.65,0.8,14),st);pz.position.set(4.5,0.4,5);g.add(pz);addCirc(R.X+4.5,R.Z+5,0.7);
      P({chiton:'#d8cfbc',himation:'#7d4a3a',beard:true,hair:'#5a4a3a'},-2,-6.2,0);P({female:true,chiton:'#c9b48b',himation:'#6a7d8a',hair:'#3a2a1e'},-5.2,4,Math.PI/2);
      P({chiton:'#bfae8c',short:true,noHimation:true,hair:'#2a1a12'},4,4,-Math.PI/2);
      int2Info(R,0,2.3,'El altar del patio','Zeus Herkeios','Ζ','El patio (aulé) y su altar','<p>La casa griega se cierra a la calle y se abre hacia dentro, a un patio sin techo que da luz y aire a las habitaciones. En el patio está el altar de <b>Zeus Herkeios</b>, el «del cercado», que protege la casa; y en la puerta, el herma de <b>Hermes</b>, guardián de los umbrales.</p><p class="sub">Así son las casas excavadas en Atenas y, mejor conservadas, en Olinto (destruida en 348 a.C.).</p>');
      int2Info(R,0,-4.2,'El andrón','la sala de los hombres','Α','El andrón: el banquete','<p>La sala de recibir de los hombres, con los lechos (klínai) junto a las paredes y la puerta descentrada para que quepan. Aquí se celebra el simposio: se come recostado y después se bebe vino mezclado con agua, se canta y se conversa. Las mujeres de la casa no entran cuando hay invitados.</p><p class="sub">Fuentes: Platón y Jenofonte, <i>Banquete</i>; las salas de banquete se reconocen en las excavaciones por el suelo más alto junto a las paredes.</p>');
      int2Info(R,-4.6,4,'El telar','el trabajo de la casa','Ι','El telar vertical','<p>Hilar y tejer es el trabajo de las mujeres de la casa, libres y esclavas: la lana se convierte en ropa y mantas. El telar es vertical, con pesas de barro que tensan los hilos: en las excavaciones aparecen a montones.</p><p class="sub">Jenofonte, <i>Económico</i> VII–IX: Iscómaco enseña a su joven esposa a llevar la casa, guardar las provisiones y dirigir a las criadas.</p>');
      int2Info(R,4.5,3.6,'El pozo','agua de la casa','Φ','El pozo o la cisterna','<p>Las casas con pozo o cisterna se ahorran ir a la fuente pública; las demás mandan a las mujeres o a los esclavos con la hidria, y en la fuente se habla de todo.</p>');}
    else{// casa humilde: una sala con el hogar, una escalera de madera al piso alto, cántaros y un telar pequeño
      box(1.2,0.5,1.2,st,-2.5,0.25,-3,g);lamp(-2.5,0.75,-3);for(let i=0;i<4;i++){const a=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.12,0.9,10),lam('#b0603a'));a.position.set(3.2,0.45,-3.6+i*0.6);g.add(a);}
      for(let i=0;i<8;i++)box(1.2,0.08,0.3,wd,2.6,0.3+i*0.38,2.5-i*0.35,g);box(9,0.2,4,wd,0,3.3,-3,g);box(9,0.3,10.4,roleMat('roof'),0,3.75,0,g);
      P({female:true,chiton:'#a89878',himation:'#6b5a48',hair:'#2a1d14'},-1.6,-1.5,0.6);P({chiton:'#bfae8c',short:true,noHimation:true,hair:'#3a2a1e',scale:0.7},0.5,1.2,-0.4);
      int2Info(R,-2.5,-1.6,'El hogar','fuego, luz y comida','Ε','El hogar (hestía)','<p>Una sola sala hace de cocina, comedor y taller; el humo sale por las tejas. El hogar está consagrado a <b>Hestia</b>: al nacer un niño se le pasea alrededor del fuego para recibirlo en la familia (las Anfidromias).</p>');
      int2Info(R,2.6,0.6,'La escalera','al piso de arriba','Λ','El piso de arriba','<p>Muchas casas tienen un piso alto de adobe y madera. En el discurso de Lisias <i>Sobre el asesinato de Eratóstenes</i>, Eufileto cuenta que su casa tenía dos pisos y que, al nacer su hijo, él se mudó arriba y las mujeres bajaron, para no tener que bajar la escalera con el niño.</p><p class="sub">Lisias I 9–10 (hacia el 400 a.C.).</p>');
      int2Info(R,3.2,-1.6,'Las tinajas','la despensa','Π','Lo que se guarda','<p>Cebada, aceite, vino aguado, higos secos, aceitunas: la comida de todos los días. El trigo es más caro y gran parte llega por mar del mar Negro.</p>');}
    exit(0,D/2-0.4,Math.PI);R.spawn=[0,D/2-2,Math.PI];}
  else if(room==='taller'){const st=roleMat('stone'),wd=roleMat('wood');F(12,10,0,0,0,lam('#a0805a'));W(-6,-5,6,-5,3.2,lam('#b9a07a'));W(-6,-5,-6,5,3.2,lam('#b9a07a'));W(6,-5,6,5,3.2,lam('#b9a07a'));W(-6,5,-0.9,5,3.2,lam('#b9a07a'));W(0.9,5,6,5,3.2,lam('#b9a07a'));
    const k=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.4,2.2,14),lam('#8a5a3a'));k.position.set(-3.5,1.1,-2.5);g.add(k);addCirc(R.X-3.5,R.Z-2.5,1.4);lamp(-3.5,0.4,-1.3);
    const wh=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.45,0.08,16),wd);wh.position.set(1.5,0.55,-2);g.add(wh);box(0.6,0.5,0.6,wd,1.5,0.25,-2,g);
    for(let i=0;i<9;i++){const v=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.1,0.36,10),lam(i%3?'#c2683e':'#2a1a14'));v.position.set(-1+(i%5)*0.55,1.2+Math.floor(i/5)*0.45,-4.6);g.add(v);}
    box(3,0.06,0.5,wd,0.2,1.0,-4.6,g);box(3,0.06,0.5,wd,0.2,1.45,-4.6,g);
    P({chiton:'#a89878',short:true,noHimation:true,beard:true,hair:'#3a2a1e'},1.5,-1.1,Math.PI);P({chiton:'#bfae8c',short:true,noHimation:true,hair:'#2a1a12',scale:0.8},-2,0,0.5);
    int2Info(R,-3.5,-0.8,'El horno','tres fuegos','Κ','El horno y sus tres fases','<p>El color negro y rojo de los vasos áticos sale del fuego, no de dos pinturas: primero se cuece con aire (todo rojo), luego se ahoga el horno con leña verde (todo negro) y al final se vuelve a abrir. El barniz fino se queda negro y la arcilla vuelve a ponerse roja.</p><p class="sub">Técnica reconstruida por los ceramistas modernos a partir de los vasos; en la hidria Caputi (hacia 470 a.C.) se ve a Atenea visitando un taller de pintores.</p>');
    int2Info(R,1.5,0,'El torno','a mano','Τ','El torno del alfarero','<p>Un aprendiz hace girar la rueda con la mano mientras el maestro levanta la pieza. Luego se pinta con un pincel finísimo. Los pintores a veces firman: «Eufronio me pintó» (Euphrónios égrapsen).</p><p class="sub">Eufronio trabajó hacia el 510–500 a.C.: aquí su taller es un homenaje (anacronismo).</p>');
    int2Info(R,0.2,-3.4,'Los vasos','listos para vender','Ψ','Para qué sirve cada vaso','<p>Ánfora (transportar), hidria (agua), crátera (mezclar vino y agua), kílix (beber), lécito (aceite para los muertos). Los vasos áticos se venden por todo el Mediterráneo: de Etruria a Crimea.</p>');
    exit(0,4.6,Math.PI);R.spawn=[0,3,Math.PI];}
  else if(room==='insula'){// abajo, la taberna (con su mostrador de dolia); un pasillo y la escalera; arriba, el piso alquilado (cenaculum)
    const pl=lam('#c88a5a'),wd=roleMat('wood'),fl=lam('#8a6a4a');F(9,7,0,0,0,lam('#9a8a7a'));W(-4.5,-3.5,4.5,-3.5,3.6,pl);W(-4.5,-3.5,-4.5,3.5,3.6,pl);W(-4.5,3.5,-0.9,3.5,3.6,pl);W(0.9,3.5,4.5,3.5,3.6,pl);W(4.5,-3.5,4.5,1.2,3.6,pl);W(4.5,2.8,4.5,3.5,3.6,pl);
    box(5,1,1,lam('#d8c9a8'),-1,0.5,-1,g);addSeg(R.X-3.5,R.Z-1,R.X+1.5,R.Z-1,0.5);for(let i=0;i<3;i++){const d=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.1,12),lam('#7a4a2a'));d.position.set(-2.6+i*1.4,1.0,-1);g.add(d);}
    for(let i=0;i<6;i++){const a=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.08,0.9,10),lam('#b0603a'));a.position.set(-3.8+i*0.5,0.45,-3);g.add(a);}box(9,0.3,7.4,roleMat('roof'),0,3.75,0,g);lamp(0,2.6,-3.2);
    P({chiton:'#b98a5a',short:true,noHimation:true,hair:'#2a1a12'},-1,-2.2,0);P({chiton:'#d8cfbc',short:true,noHimation:true,hair:'#4a3a2a'},2,0.5,2.5);
    // pasillo y escalera (cada peldaño, 0,3 m) hasta el tercer piso, que está a un lado (sin pisar la taberna)
    F(2.2,1.6,5.6,2,0,fl);W(4.5,1.2,6.7,1.2,3.6,pl);W(4.5,2.8,5.1,2.8,3.6,pl);
    for(let i=0;i<24;i++){const y=0.3*(i+1);F(1.6,0.5,5.9,2.8+0.5*i+0.25,y,wd);}W(5.1,2.8,5.1,15,9.5,pl);W(6.7,1.2,6.7,15,9.5,pl);
    const Y2=7.2,Z2=15.5;F(9,7,4,Z2+3.5,Y2,fl);W(-0.5,Z2,5.1,Z2,3.2,pl,Y2);W(6.7,Z2,8.5,Z2,3.2,pl,Y2);W(-0.5,Z2,-0.5,Z2+7,3.2,pl,Y2);W(8.5,Z2,8.5,Z2+7,3.2,pl,Y2);W(-0.5,Z2+7,8.5,Z2+7,3.2,pl,Y2);
    box(9,0.3,7.4,roleMat('roof'),4,Y2+3.35,Z2+3.5,g);box(2,0.5,1,wd,1,Y2+0.25,Z2+5.8,g);box(1.8,0.2,0.9,lam('#8a7a5a'),1,Y2+0.6,Z2+5.8,g);
    const br=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.3,0.3,10),lam('#5a4a3a'));br.position.set(6.5,Y2+0.15,Z2+5.5);g.add(br);box(1,1,0.1,lam('#b8d0e0'),8.4,Y2+1.8,Z2+3.5,g).rotation.y=Math.PI/2;
    P({female:true,chiton:'#b0a07a',himation:'#7a5a3a',hair:'#3a2a1e'},3,Z2+4.5,Math.PI,Y2);
    int2Info(R,-1,0.4,'El mostrador','vino caliente y comida','T','La taberna de la planta baja','<p>La planta baja de las ínsulas da a la calle con tiendas (tabernae): aquí se vende vino, garbanzos, salchichas. La mayoría de los romanos no cocina en casa —no hay cocina en los pisos ni se puede encender fuego sin riesgo—, así que se come fuera.</p><p class="sub">Las tabernas con dolia en el mostrador se conservan en Pompeya y Ostia.</p>');
    int2Info(R,5.9,4.2,'La escalera','al tercer piso','S','Subir cuesta, y cuesta','<p>Los pisos bajos son los caros; cuanto más arriba, más barato y peor: sin agua, con frío, y lejos de la calle si hay incendio. Augusto limitó la altura de las casas a 70 pies (unos 21 m) por los derrumbes.</p><p class="sub">Estrabón V 3,7; Juvenal, <i>Sátiras</i> III, se queja de casas que se caen y de incendios: «arriba, bajo las tejas, el último en enterarse es el que vive donde anidan las palomas» (paráfrasis).</p>');
    int2Info(R,4,Z2+2.5,'El cenáculo','el piso alquilado','C','Un piso en lo alto','<p>Dos habitaciones para toda una familia: un lecho, un arcón, un brasero de carbón (peligroso) y un orinal: el agua hay que subirla de la fuente del barrio y lo sucio se baja… o se tira por la ventana, aunque está multado.</p><p class="sub">El <i>Digesto</i> recoge la acción contra «lo que se arroja o se derrama» (de deiectis vel effusis) sobre los que pasan por la calle.</p>');
    exit(0,3.2,Math.PI);R.spawn=[0,1.8,Math.PI];}
  else if(room==='villa'){// atrio con impluvio, tablinum, peristilo con jardín y fuente, triclinio con pinturas
    const wr=lam('#b23a2e'),wy=lam('#d8b85a'),mb=roleMat('marble');F(16,26,0,0,0,mb);
    W(-8,-13,8,-13,4.2,wr);W(-8,-13,-8,13,4.2,wr);W(8,-13,8,13,4.2,wr);W(-8,13,-0.9,13,4.2,wr);W(0.9,13,8,13,4.2,wr);W(-8,1,-2,1,4.2,wy);W(2,1,8,1,4.2,wy);
    box(3,0.25,3,lam('#7fa6b4'),0,0.05,7,g);for(const s of[[-1.5,7],[1.5,7]])addSeg(R.X+s[0],R.Z+5.5,R.X+s[0],R.Z+8.5,0.2);addSeg(R.X-1.5,R.Z+5.5,R.X+1.5,R.Z+5.5,0.2);addSeg(R.X-1.5,R.Z+8.5,R.X+1.5,R.Z+8.5,0.2);
    box(16,0.3,5,roleMat('roof'),0,4.3,10.5,g);box(16,0.3,5,roleMat('roof'),0,4.3,3.5,g);
    const gd=new THREE.Mesh(new THREE.PlaneGeometry(10,9),lam('#5f7a3a'));gd.rotation.x=-Math.PI/2;gd.position.set(0,0.02,-5.5);g.add(gd);
    for(let i=0;i<10;i++){const a=i/10*TAU,x=Math.cos(a)*5.6,z=-5.5+Math.sin(a)*4.8;box(0.3,3.6,0.3,mb,x,1.8,z,g);}
    const fo=new THREE.Mesh(new THREE.CylinderGeometry(0.8,0.9,0.5,16),mb);fo.position.set(0,0.25,-5.5);g.add(fo);addCirc(R.X,R.Z-5.5,0.9);
    for(let i=0;i<8;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(rr(0.4,0.7),8,6),lam(pick(['#4e6a32','#5d7a3a','#3e5a2c'])));b.position.set(rr(-4,4),0.4,rr(-9,-2));if(Math.hypot(b.position.x,b.position.z+5.5)>1.5)g.add(b);}
    for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.2),lam(['#2f5a7a','#7a2a2a','#c9a64a'][i]));c.position.set(-7.84,2.2,9.5-i*2.2);c.rotation.y=Math.PI/2;g.add(c);}
    for(const[x,z,r]of[[5,9.5,0],[6.6,11,Math.PI/2],[5,12.4,0]]){box(r?3:1,0.6,r?1:3,roleMat('wood'),x,0.3,z,g);}
    P({toga:true,chiton:'#efe9dc',hair:'#5a4a3a'},-1.5,9.6,Math.PI);P({female:true,chiton:'#c97a8a',himation:'#e6dcc8',hair:'#4a2a1a'},2,-3,0.3);P({chiton:'#b0a07a',short:true,noHimation:true,hair:'#2a1a12'},-3,-8,0.8);
    int2Info(R,0,9.2,'El atrio','con su impluvio','A','El atrio y el impluvio','<p>Por el hueco del techo (compluvio) entra la luz y la lluvia, que cae al estanque (impluvio) y pasa a una cisterna. En el atrio el señor recibe cada mañana a sus clientes (la salutatio).</p><p class="sub">Vitruvio, <i>Sobre la arquitectura</i> VI 3–5.</p>');
    int2Info(R,0,-3.2,'El peristilo','jardín con pórticos','H','El peristilo','<p>Un jardín rodeado de columnas, con fuente y arriates: la parte privada de la casa. En Pompeya se han reconstruido los jardines a partir de los huecos de las raíces en la ceniza.</p><p class="sub">La casa de los Vetios de Pompeya (reformada después del 62 d.C.) es el modelo de este interior; sus dueños eran dos libertos ricos.</p>');
    int2Info(R,5,8,'El triclinio','tres lechos','Τ','El triclinio y las pinturas','<p>Tres lechos en forma de U alrededor de una mesa: nueve comensales como mucho. Las paredes, pintadas al fresco con paneles rojos, amarillos y negros y escenas mitológicas (el llamado «cuarto estilo»).</p>');
    exit(0,12.6,Math.PI);R.spawn=[0,11,Math.PI];}
  else if(room==='lupercal'||room==='cuevaPan'||room==='semnai'||room==='mundus'){// cuevas: paredes de roca irregulares, poca luz
    const rk=lam(room==='mundus'||room==='semnai'?'#4a4038':'#7a6e60'),Wc=room==='semnai'||room==='mundus'?14:11,D=room==='semnai'||room==='mundus'?18:12;F(Wc,D,0,0,0,lam('#5e5246'));
    for(let i=0;i<34;i++){const a=i/34*TAU,x=Math.cos(a)*Wc/2*1.05,z=Math.sin(a)*D/2*1.05;if(z>D/2-2&&Math.abs(x)<1.6)continue;const r=new THREE.Mesh(new THREE.DodecahedronGeometry(rr(1.6,2.6),0),rk);r.position.set(x,rr(0.5,2.6),z);r.rotation.set(rr(0,3),rr(0,3),0);g.add(r);}
    for(let i=0;i<34;i++){const a=i/34*TAU,b=(i+1)/34*TAU;const x1=Math.cos(a)*Wc/2*0.92,z1=Math.sin(a)*D/2*0.92,x2=Math.cos(b)*Wc/2*0.92,z2=Math.sin(b)*D/2*0.92;if(z1>D/2-2.4&&Math.abs(x1)<1.8)continue;addSeg(R.X+x1,R.Z+z1,R.X+x2,R.Z+z2,0.3);}
    const dome=new THREE.Mesh(new THREE.SphereGeometry(1,20,12,0,TAU,0,Math.PI/2),new THREE.MeshLambertMaterial({color:rk.color,side:THREE.BackSide}));dome.scale.set(Wc/2*1.2,room==='semnai'||room==='mundus'?6:4.5,D/2*1.2);g.add(dome);R.cave=true;
    lamp(-Wc/4,1.4,-D/4);lamp(Wc/4,1.6,-D/5);lamp(0,1.2,D/4);
    if(room==='lupercal'){const w=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.5,0.4),lam('#7a6650'));w.position.set(0,1.2,-D/2+1.4);g.add(w);box(1.6,1.2,1,lam('#9a8a70'),0,0.6,-D/2+1.4,g);
      const fig=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.5,0.4),lam('#6a5038'));fig.position.set(0,1.55,-D/2+1.4);g.add(fig);
      const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.6,0.15,12),lam('#6a8aa0'));sp.position.set(3,0.08,-2);g.add(sp);
      int2Info(R,0,-D/2+3,'La loba y los gemelos','el origen de Roma','L','El Lupercal','<p>Aquí, según la leyenda, la loba amamantó a Rómulo y Remo, abandonados junto al Tíber. La gruta, al pie del Palatino, está consagrada a Fauno Luperco. El 15 de febrero, en las Lupercales, los lupercos salen de aquí corriendo alrededor del Palatino y golpean con tiras de piel de cabra a quien encuentran: dicen que da fertilidad.</p><p class="sub">Dionisio de Halicarnaso I 32 y 79; Ovidio, <i>Fastos</i> II 381–424. Augusto la restauró (<i>Res gestae</i> 19).</p>');
      int2Info(R,3,-0.6,'El manantial','agua de la gruta','F','Una fuente bajo el monte','<p>Los autores antiguos hablan de una gruta con un manantial y un bosque sagrado al pie del monte. En 2007 se anunció el hallazgo de una cavidad decorada bajo el Palatino que algunos identificaron con el Lupercal; la identificación está en discusión.</p>');}
    else if(room==='cuevaPan'){const al=box(1,0.8,0.8,lam('#9a8e7a'),0,0.4,-D/2+1.8,g);for(let i=0;i<4;i++){const r=box(0.8,1,0.12,lam('#d8cfbc'),-2.5+i*1.6,1.6,-D/2+0.9,g);}
      const sy=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.04,6,12,Math.PI),lam('#c9a64a'));sy.position.set(0.3,0.95,-D/2+1.8);g.add(sy);
      P({chiton:'#bfae8c',short:true,noHimation:true,hair:'#5a4a3a',beard:true,staff:true},2.5,-1,-0.6);
      int2Info(R,0,-D/2+3.2,'El altar de Pan','con ofrendas','Π','La cueva de Pan','<p>Antes de Maratón (490 a.C.), el corredor Filípides contó que el dios Pan le había salido al paso en el monte Partenio y le había preguntado por qué los atenienses no le daban culto, si él los ayudaba. Después de la victoria, los atenienses le consagraron esta gruta bajo la Acrópolis, con sacrificios y una carrera de antorchas cada año.</p><p class="sub">Heródoto VI 105; Pausanias I 28,4.</p>');
      int2Info(R,-1.7,-D/2+2.3,'Los relieves','de Pan y las Ninfas','Ν','Exvotos de piedra','<p>En las grutas de Pan se dejan relieves con el dios de patas de cabra tocando la siringa, las Ninfas bailando y Hermes guiándolas: Pan es hijo de Hermes según el himno homérico.</p><p class="sub">Himno homérico XIX, a Pan. Se conservan muchos relieves así del siglo IV a.C., por ejemplo de la cueva de Vari, en el Ática.</p>');}
    else if(room==='semnai'){box(1.2,1.8,0.8,lam('#c9c0b0'),-3,0.9,-D/2+2.5,g);box(1.2,1.8,0.8,lam('#c9c0b0'),0,0.9,-D/2+2,g);box(1.2,1.8,0.8,lam('#c9c0b0'),3,0.9,-D/2+2.5,g);
      const ch=new THREE.Mesh(new THREE.CircleGeometry(1.8,16),new THREE.MeshBasicMaterial({color:'#050403'}));ch.rotation.x=-Math.PI/2;ch.position.set(0,0.03,-1);g.add(ch);addCirc(R.X,R.Z-1,1.7);
      int2Info(R,0,-D/2+4,'Las estatuas','Plutón, Hermes y la Tierra','Σ','El santuario de las Venerables','<p>En la grieta del Areópago tienen su santuario las Semnai, las «Venerables»: las Erinias, diosas de la venganza de la sangre, a las que Atenea convenció para quedarse en Atenas como protectoras. Pausanias se sorprende de que sus estatuas no den miedo, y cuenta que allí también hay imágenes de Plutón, de <b>Hermes</b> y de la Tierra.</p><p class="sub">Pausanias I 28,6; Esquilo, <i>Euménides</i> (458 a.C.). Hermes, que acompaña las almas (psicopompo), es el único que va y viene del mundo de abajo: por eso solo con su caduceo se baja aquí.</p>');
      int2Info(R,0,0.8,'La grieta','hacia abajo','Χ','Ofrendas sin vino','<p>A las Semnai no se les ofrece vino, sino libaciones de agua y miel (nephália); y los que han sido absueltos en el tribunal del Areópago les sacrifican aquí.</p><p class="sub">Esquilo, <i>Euménides</i> 107; Pausanias I 28,6.</p>');}
    else{const pit=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,0.3,20,1,true),lam('#3a3028'));pit.position.set(0,0.15,-2);g.add(pit);const hole=new THREE.Mesh(new THREE.CircleGeometry(1.5,20),new THREE.MeshBasicMaterial({color:'#020202'}));hole.rotation.x=-Math.PI/2;hole.position.set(0,0.05,-2);g.add(hole);addCirc(R.X,R.Z-2,1.7);
      const lp=box(1.8,0.25,1.8,lam('#7a7468'),3.2,0.12,-2,g);lp.rotation.z=0.15;
      int2Info(R,0,0.2,'La boca','del mundo de los muertos','M','El mundus','<p>Rómulo, al fundar Roma, mandó cavar un hoyo redondo y echar en él primicias y un puñado de tierra de cada uno de los lugares de origen de los colonos: el <i>mundus</i>. Se tapaba con una piedra, el <i>lapis manalis</i>, y se abría tres días al año: entonces, decían, la puerta de los dioses tristes y de los de abajo quedaba abierta, y no se hacía nada importante.</p><p class="sub">Plutarco, <i>Rómulo</i> 11; Macrobio, <i>Saturnales</i> I 16,18 (cita a Varrón). Dónde estaba exactamente es discutido (en el Comicio o en el Palatino).</p>');
      int2Info(R,3.2,0.2,'La piedra','lapis manalis','L','La tapa del mundus','<p>Mercurio, que guía a las almas, es el único dios que entra y sale del mundo de abajo: por eso aquí solo se baja con su caduceo. En el juego, el mundus está abierto para ti; en Roma solo se abría el 24 de agosto, el 5 de octubre y el 8 de noviembre.</p>');}
    exit(0,D/2-1.2,Math.PI);R.spawn=[0,D/2-3,Math.PI];}
  return R;}
// ---- entrar y salir (con fundido, como la casa propia)
function int2Fade(txt,fn){ui='voyage';try{if(MOUNT.riding)dismount();if(MOUNT.g){MOUNT.g.visible=false;MOUNT.st='away';}FLY.on=false;}catch(e){}
  const v=$('voyage');v.classList.add('land');v.querySelector('.vt').textContent=txt;v.querySelector('.vs').textContent='';v.querySelector('.vf').textContent='';v.hidden=false;requestAnimationFrame(()=>v.classList.add('show'));
  setTimeout(()=>{fn();player.feet=floorAt(player.x,player.z);player.camY=player.feet+player.eye;player.vy=0;player.pitch=0;curZone=null;hudKey='';v.classList.remove('show');setTimeout(()=>{v.hidden=true;ui='play';INT2.busy=false;},600);},1100);}
function int2Enter(o){if(INT2.busy||INT2.in)return;if(o.locked&&!int2Key()){int2Locked(o);return;}INT2.busy=true;const ro=MODE==='roma';
  int2Fade(o.cave?(ro?'Bajas a la oscuridad de la gruta…':'Entras en la gruta…'):'Cruzas el umbral…',()=>{const R=int2Room(o.room);INT2.in={o,R};player.x=R.X+R.spawn[0];player.z=R.Z+R.spawn[1];player.yaw=R.spawn[2]+Math.PI;
    const z=int2z();if(!z.seen[o.room]){z.seen[o.room]=1;save();try{rwDiscover(o.name,'un interior nuevo');}catch(e){}}});}
function int2Leave(){if(INT2.busy||!INT2.in)return;INT2.busy=true;const o=INT2.in.o;int2Fade('Sales a la calle…',()=>{INT2.in=null;player.x=o.x+Math.sin(o.a)*1.8;player.z=o.z+Math.cos(o.a)*1.8;player.yaw=o.a+Math.PI;});}
function int2Locked(o){const t=performance.now();if(t-INT2.msgT<4000)return;INT2.msgT=t;MSG&&(MSG.lastIn=t);
  toast('<span class="label">'+o.name+'</span><br>Una fuerza te detiene en el umbral. Por aquí solo pasan los que acompaña '+(MODE==='roma'?'Mercurio':'Hermes')+', el que va y viene entre los vivos y los muertos. Quizá algún día lleves su caduceo.');}
function int2z(){if(!state.int2||typeof state.int2!=='object')state.int2={seen:{}};return state.int2;}
// cruzar el aura andando: si estás en el vano y avanzas hacia dentro, entras (o sales)
function int2Tick(dt){if(!state)return;if(!INT2.ready){int2Setup();return;}const t=performance.now()/1000,P=player;
  for(const o of INT2.doors){const d=Math.hypot(o.x-P.x,o.z-P.z);o.g.visible=d<260;if(!o.g.visible)continue;const k=0.75+0.25*Math.sin(t*2.2+o.x);o.A.m.opacity=o.A.base*k;o.A.sm.opacity=o.A.base*0.6*k;
    const lk=o.locked&&!int2Key();if(o.lk!==lk){o.lk=lk;o.A.base=lk?0.35:0.8;if(o.eg){o.eg.data.name=lk?o.name+' (cerrado)':'Entrar: '+o.name;}}
    if(ui==='play'&&!INT2.busy&&!INT2.in&&d<1.0){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),toIn=(-(Math.sin(o.a))*fx+-(Math.cos(o.a))*fz);if(toIn>0.3){if(lk){int2Locked(o);P.x=o.x+Math.sin(o.a)*1.3;P.z=o.z+Math.cos(o.a)*1.3;}else int2Enter(o);}}}
  // la gente de dentro, con los modelos de Blender en cuanto están cargados (como las multitudes, 196)
  if(INT2.ppl.length&&typeof BP!=='undefined'&&Object.keys(BP.tpl).length)for(let i=INT2.ppl.length-1;i>=0;i--){const g=INT2.ppl[i];if(g.userData.bp||g.userData.bpNo||bpConv(g,true))INT2.ppl.splice(i,1);}
  if(INT2.in){const R=INT2.in.R;if(R.exitA){const k=0.75+0.25*Math.sin(t*2.2);R.exitA.m.opacity=0.8*k;R.exitA.sm.opacity=0.5*k;}
    const e=R.exit;if(e&&ui==='play'&&!INT2.busy&&Math.hypot(e.x-P.x,e.z-P.z)<1.0){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);if(-(Math.sin(e.a)*fx+Math.cos(e.a)*fz)>0.3)int2Leave();/* hacia la pared de la puerta */}}}
{const f=egxAct0;egxAct0=function(o){if(o&&typeof o.act==='function')return o.act(o);return f.apply(this,arguments);};}
{const f=uxTick;uxTick=function(dt){f(dt);try{int2Tick(dt);}catch(e){if(!INT2.err){INT2.err=String(e&&e.stack||e).slice(0,300);console.warn('puertas',e);}}};}
// bajo techo no llueve ni nieva
{const f=wxTick;wxTick=function(dt){const r=f.apply(this,arguments);try{if(INT2.in){if(WXS.rainM)WXS.rainM.visible=false;if(WXS.snowM)WXS.snowM.visible=false;}}catch(e){}return r;};}
// el cartel de zona: el del interior (no el de la casa propia, que está cerca en el mapa lejano)
const INT2_ZN={casaRica:['La casa de un ciudadano','ΟΙΚΙΑ','Atenas, siglo IV a.C.'],casaPobre:['Una casa humilde','ΟΙΚΙΑ','Lisias, Sobre el asesinato de Eratóstenes'],taller:['Un taller de alfarero','ΚΕΡΑΜΕΙΟΝ','El Cerámico'],
 cuevaPan:['La cueva de Pan','ΠΑΝΟΣ ΑΝΤΡΟΝ','Heródoto VI 105'],semnai:['El santuario de las Venerables','ΣΕΜΝΑΙ','Pausanias I 28,6'],insula:['Una ínsula','INSVLA','Juvenal, Sátiras III'],
 villa:['Una domus con peristilo','DOMVS','Vitruvio VI'],lupercal:['El Lupercal','LVPERCAL','Ovidio, Fastos II'],mundus:['El mundus','MVNDVS','Macrobio, Saturnales I 16']};
{const f=checkZone;checkZone=function(){if(INT2.in){const k='int_'+INT2.in.o.room;if(curZone!==k){curZone=k;const T=INT2_ZN[INT2.in.o.room];if(T)showZone(T[0],T[1],T[2]);}return;}return f.apply(this,arguments);};}
