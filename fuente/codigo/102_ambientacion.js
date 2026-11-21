// ============================================================ AMBIENTACIÓN: detalles pequeños y documentados que se ven o se oyen al pasar
// Atenas: hóroi del Ágora, hecateos y «cenas de Hécate», señales de nacimiento y de duelo en las puertas, humo del Cerámico y de las forjas,
// lechuzas, pesas y pescado del mercado. Roma: miliarium aureum, compita de los Lares, ropa tendida y macetas, cave canem, toldos y rótulos,
// campana de las termas, vendedores. Campo: eras, exvotos en las fuentes, chozas, rediles y colmenas. Ambiente: luciérnagas, niebla del alba,
// motas de polvo, calima, golondrinas, flores de temporada, gallo y perros.
const AMB={smoke:[],owls:[],flies:null,mist:null,dust:null,sw:null,flowers:[],tSnd:0,tCry:0,tBell:-1,tCock:-1,cena:[],t:0};
function ambz(){if(!state.amb||typeof state.amb!=='object')state.amb={seen:{}};state.amb.seen=state.amb.seen||{};return state.amb;}
const AMB_TXT={
 horos:['Un hóros del Ágora','ΗΟΡΟΣ ΕΙΜΙ ΤΕΣ ΑΓΟΡΑΣ','«Soy el límite del Ágora», dice la piedra, en letras antiguas. Marcan dónde empieza el espacio público: quien está acusado de impiedad o ha maltratado a sus padres no puede pasar de aquí. Se conservan dos en su sitio (IG I³ 1087-1088).'],
 hekataion:['Un hecateo','ἙΚΑΤΑΙΟΝ','Junto a muchas puertas hay una pequeña imagen o un pilarcito de Hécate, la diosa de los umbrales y de las encrucijadas: guarda el paso entre la calle y la casa y mantiene lejos a los fantasmas que ella misma gobierna. Aristófanes da por hecho que hay un hecateo «delante de todas las puertas» (Avispas 804, del 422 a.C.); la llaman también Hécate <i>Propylaía</i>, «la de delante de la puerta». Algunas tienen tres cuerpos, una forma que popularizó Alcámenes hace unos cuarenta años (Pausanias II 30, 2). En luna nueva se le dejan en las encrucijadas las «cenas de Hécate»: pan, huevos, queso; los pobres se las comen sin escrúpulo, según Aristófanes (Pluto 594-597).'],
 cena:['Una cena de Hécate','ἙΚΑΤΗΣ ΔΕΙΠΝΟΝ','Luna nueva: en el cruce alguien ha dejado pan, un huevo y un poco de queso para Hécate, la diosa de las encrucijadas y de los fantasmas. Así se aparta lo malo de la casa.'],
 olivo:['Una corona de olivo en la puerta','ΣΤΕΦΑΝΟΣ','En esta casa ha nacido un niño: se cuelga en la puerta una corona de olivo. Si es una niña, una cinta de lana, por el trabajo del telar (Hesiquio, s.v. stéphanon ekphérein).'],
 lana:['Una cinta de lana en la puerta','ΕΡΙΟΝ','En esta casa ha nacido una niña: se cuelga en la puerta una cinta de lana.'],
 ardanion:['Un vaso de agua lustral','ΑΡΔΑΝΙΟΝ','Junto a esta puerta hay un vaso de agua traída de otra casa: aquí hay un muerto. Quien sale se purifica con ella, porque la muerte mancha (Aristófanes, Asambleístas 1033).'],
 pesas:['Pesas oficiales','ΣΤΑΘΜΑ ΔΗΜΟΣΙΑ','Pesas de bronce y de plomo con el sello de la ciudad. Los metronómoi vigilan que nadie engañe en el peso; los agoranómoi, que la mercancía sea buena (Aristóteles, Constitución de los atenienses 51).'],
 pescado:['Losas del pescado','ΙΧΘΥΟΠΩΛΑΙ','Los pescaderos venden sobre losas de piedra, y tienen fama de groseros y careros: los cómicos se ríen de ellos. Por ley no pueden mojar el pescado para que parezca fresco (Ateneo VI 224-228).'],
 miliario:['El miliario de oro','MILIARIVM AVREVM','Una columna de bronce dorado que Augusto levantó en el 20 a.C. junto al templo de Saturno. En ella están grabadas las distancias desde Roma a las principales ciudades del Imperio: de aquí parten, en teoría, todos los caminos (Plinio, Historia natural III 66).'],
 compitum:['Un altar de los Lares de la encrucijada','LARES COMPITALES','En cada esquina importante del barrio hay un altarcillo de los Lares Compitales, con guirnaldas y pinturas. Augusto los reorganizó y les añadió su Genio; los cuidan los vicomagistri, muchas veces libertos. En enero se celebran las Compitalia.'],
 canem:['Cave canem','CAVE CANEM','«¡Cuidado con el perro!»: el mosaico de la entrada avisa a los visitantes. Petronio lo cuenta en la casa de Trimalción, donde un perro pintado en la pared asusta a Encolpio (Satiricón 29).'],
 era:['Una era','ΑΛΩΣ · AREA','El círculo de piedra o de tierra batida donde se trilla el grano a final de primavera: los bueyes o las mulas pisan las espigas y luego se avienta con la pala para separar la paja del trigo (Jenofonte, Económico 18).'],
 exvoto:['Exvotos en la fuente','ΑΝΑΘΗΜΑΤΑ · VOTA','Junto al agua, figuritas de barro, tablillas pintadas y cintas: agradecimientos a las ninfas del manantial por una curación o un parto.'],
 choza:['Una choza de pastores','ΚΑΛΥΒΗ · CASA','Piedra seca abajo, ramas y paja arriba: aquí duermen los pastores en verano, junto al redil, cuando suben con el ganado a los pastos altos.'],
 colmena:['Colmenas','ΣΜΗΝΗ · ALVEARIA','Colmenas de barro y de corcho puestas en fila, al abrigo del viento. La miel es el único dulce que se conoce; la del Himeto es la más famosa (Varrón, Sobre el campo III 16).']};
function ambAct(o){const k=o.act.split(':')[1],T=AMB_TXT[k];if(!T)return;const z=ambz();if(!z.seen[k]){z.seen[k]=1;save();qAdd('so',1);}
  vmS('✦',T[0],T[1],'<p>'+T[2]+'</p>',[vmBye]);}
// el códice recoge lo que has visto
const eduEntriesAmb=eduEntries;eduEntries=function(){const E=eduEntriesAmb(),z=ambz();for(const k in z.seen)if(AMB_TXT[k])E.push({c:'Ambiente',n:AMB_TXT[k][0],t:AMB_TXT[k][2]});return E;};
function ambTex(r,g,b){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba('+r+','+g+','+b+',1)');gr.addColorStop(1,'rgba('+r+','+g+','+b+',0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
function ambSmoke(x,y,z){const S={x,y,z,p:[]};const tex=AMB.smokeTex||(AMB.smokeTex=ambTex(120,115,110));for(let i=0;i<7;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,opacity:0,depthWrite:false}));sp.userData.noCol=true;sp.position.set(x,y,z);scene.add(sp);S.p.push({sp,t:i/7});}AMB.smoke.push(S);}
function ambHouses(n){return footprints.filter(f=>f.house&&!f.r&&isFinite(f.x)&&(MODE==='roma'?romaInUrbs(f.x,f.z):(typeof insideWalls==='function'?insideWalls(f.x,f.z,10):true))).sort(()=>R()-0.5).slice(0,n);}
function ambDoor(f,dx,dy){return toW((f.w||10)*(dx||0.15),(f.d||10)/2+(dy||0.5),f.x,f.z,f.a||0);}
function ambSetup(){const ro=MODE==='roma';AMB.smoke.length=0;AMB.owls.length=0;AMB.cena.length=0;AMB.flowers.length=0;
  const st=M.stone||lam('#c9b99c'),wood=lam('#7a5434'),clay=lam('#b5683e');
  try{if(!ro){
    // hóroi del Ágora: dos mojones en las entradas del suroeste y del noroeste
    for(const[dx,dz]of[[-70,95],[-95,-60]]){const f=findFree(AG.x+dx,AG.z+dz,1);if(!f)continue;const g=grp(f[0],floorAt(f[0],f[1]),f[1],R()*TAU);box(0.45,1.1,0.3,lam('#d8cfbd'),0,0.55,0,g);addCirc(f[0],f[1],0.4);egxObj(f[0],f[1],undefined,'amb:horos','Un hóros','mojón del Ágora',2.4);}
    // hecateos y señales en las puertas
    ambHouses(40).forEach((f,i)=>{const d=ambDoor(f,0.32,0.45),y=floorAt(d[0],d[1]);
      if(i<14){const g=grp(d[0],y,d[1],f.a||0);box(0.35,0.25,0.35,st,0,0.12,0,g);const c=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.13,0.75,8),lam('#e0d6c2'));c.position.y=0.62;g.add(c);if(i<4)egxObj(d[0],d[1],undefined,'amb:hekataion','Un hecateo','imagen de Hécate junto a la puerta',2);}
      else if(i<20){const k=i<17?'olivo':i<19?'lana':'ardanion',dd=ambDoor(f,0.15,0.12),g=grp(dd[0],y,dd[1],f.a||0);
        if(k==='olivo'){const r=new THREE.Mesh(new THREE.TorusGeometry(0.22,0.035,5,16),lam('#6f7d4a'));r.position.set(0,1.75,0.08);g.add(r);}
        else if(k==='lana'){box(0.06,0.6,0.02,lam('#efe8d8'),0,1.6,0.08,g);box(0.4,0.05,0.02,lam('#efe8d8'),0,1.9,0.08,g);}
        else{const v=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.12,0.45,10),lam('#9a5a3a'));v.position.set(0.7,0.22,0.3);g.add(v);}
        egxObj(dd[0],dd[1]+0,undefined,'amb:'+k,AMB_TXT[k][0],'una señal en la puerta',2);}});
    // cenas de Hécate en tres cruces (solo se ven en luna nueva)
    for(let k=0;k<3;k++){const a=R()*TAU,r=200+R()*300,f=findFree(WALLC.x+Math.cos(a)*r,WALLC.z+Math.sin(a)*r,1);if(!f)continue;const g=grp(f[0],floorAt(f[0],f[1]),f[1],0);const pl=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.2,0.04,12),lam('#a8532f'));pl.position.y=0.02;g.add(pl);
      const br=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6),lam('#c9a46a'));br.scale.y=0.6;br.position.set(-0.06,0.07,0);g.add(br);const eg=new THREE.Mesh(new THREE.SphereGeometry(0.04,8,6),lam('#f2ece0'));eg.scale.y=1.3;eg.position.set(0.09,0.07,0.04);g.add(eg);g.visible=false;
      const o=egxObj(f[0],f[1],undefined,'amb:cena','Una cena de Hécate','ofrenda en el cruce',1.8);AMB.cena.push({g,o,x:f[0],z:f[1]});}
    // humo del Cerámico y de las forjas junto al Hefestión
    for(const[id,n]of[['ceramico',3],['hefestion',2]]){for(let k=0;k<n;k++){const f=artAnchor(id,rr(-30,30),rr(-30,30));if(f)ambSmoke(f[0],floorAt(f[0],f[1])+3,f[1]);}}
    // pesas y losas del pescado junto al Ágora
    {const f=findFree(AG.x+40,AG.z+70,2);if(f){const g=grp(f[0],floorAt(f[0],f[1]),f[1],0);box(1.6,0.8,0.8,st,0,0.4,0,g);for(let i=0;i<5;i++){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.05+i*0.02,0.06+i*0.02,0.05+i*0.02,10),lam('#8a6a3a'));w.position.set(-0.6+i*0.28,0.83+i*0.01,0);g.add(w);}addBox(f[0],f[1],1.6,0.8,0);egxObj(f[0],f[1]+1,undefined,'amb:pesas','Pesas oficiales','del metronómos',2.2);}}
    {const f=findFree(AG.x+60,AG.z+90,2);if(f){const g=grp(f[0],floorAt(f[0],f[1]),f[1],0.3);for(let s=0;s<3;s++){box(1.8,0.75,0.9,lam('#cfc4ad'),s*2.1,0.37,0,g);for(let i=0;i<4;i++){const fi=new THREE.Mesh(new THREE.SphereGeometry(0.09,7,5),lam(i%2?'#8a96a0':'#b8c0c4'));fi.scale.set(3,0.6,1);fi.position.set(s*2.1-0.5+i*0.33,0.8,0);fi.rotation.y=0.3;g.add(fi);}}addBox(f[0]+2.1,f[1],6.2,1,0.3);egxObj(f[0]+2,f[1]+1.2,undefined,'amb:pescado','Losas del pescado','pescaderos del Ágora',2.4);}}
  }else{
    // miliarium aureum, junto al templo de Saturno
    {const f=artAnchor('ro_saturno',10,-8);if(f){const g=grp(f[0],floorAt(f[0],f[1]),f[1],0);box(1.2,0.6,1.2,lam('#e6dccb'),0,0.3,0,g);const c=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.46,2.4,16),lam('#c9a24a',{emissive:'#3a2a08'}));c.position.y=1.8;g.add(c);addCirc(f[0],f[1],0.8);egxObj(f[0],f[1],undefined,'amb:miliario','El miliario de oro','MILIARIVM AVREVM',2.6);}}
    // compita: altarcillos de los Lares en las esquinas, con guirnaldas
    let nC=0;for(let k=0;k<400&&nC<16;k++){const x=rr(-700,500),z=rr(-600,500);if(!romaInUrbs(x,z)||roadDist(x,z)>5||roadDist(x,z)<2.5||!isFree(x,z,1.4))continue;const g=grp(x,floorAt(x,z),z,R()*TAU);box(0.9,1.1,0.7,lam('#d8ccb0'),0,0.55,0,g);box(1,0.12,0.8,lam('#e6dccb'),0,1.15,0,g);
      const gar=new THREE.Mesh(new THREE.TorusGeometry(0.32,0.05,5,14,Math.PI),lam('#5f7d3a'));gar.position.set(0,0.8,0.36);gar.rotation.z=Math.PI;g.add(gar);addCirc(x,z,0.6);egxObj(x,z,undefined,'amb:compitum','Lares de la esquina','compitum',2.2);nC++;}
    // ropa tendida, macetas, toldos y rótulos en las ínsulas; cave canem en las domus
    if(ROMA.houses){const cl=['#e9dfcb','#a8392b','#d9a23a','#4f6a7d','#efe8d8'];let n1=0,n2=0,n3=0;
      for(const k in ROMA.houses)for(const it of ROMA.houses[k]){if(R()>0.12)continue;const ins=k!=='H_dom',w=ins?(k==='H_insa'?22:16):26,d=ins?(k==='H_insa'?14:11):42,y=it.y;
        const front=(lx,ly,lz,obj)=>{const p=toW(lx,d/2+lz,it.x,it.z,it.a);obj.position.set(p[0],y+ly,p[1]);obj.rotation.y=-it.a;scene.add(obj);return obj;};
        if(ins&&n1<70){n1++;const g=new THREE.Group();g.userData.noCol=true;const L=rr(3,6);box(L,0.02,0.02,lam('#5a4630'),0,0,0,g);for(let i=0;i<4;i++)box(rr(0.5,0.9),rr(0.6,1),0.02,lam(pick(cl)),-L/2+0.6+i*L/4,-0.45,0,g);front(rr(-w/3,w/3),rr(6.5,9),0.35,g);}
        if(ins&&n2<70){n2++;const g=new THREE.Group();g.userData.noCol=true;for(let i=0;i<3;i++){const pt=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.12,0.28,8),clay);pt.position.set(i*0.5,0.14,0);g.add(pt);const pl=new THREE.Mesh(new THREE.SphereGeometry(0.22,6,5),lam(pick(['#5f7d3a','#4a6a32','#6f8a45'])));pl.position.set(i*0.5,0.4,0);g.add(pl);}{const o=front(rr(-w/3,w/3),rr(3.6,4.2),0.3,g);try{atReg(o.position.x,o.position.z,o.position.y,'macetas',0.9);}catch(e){}}}
        if(ins&&n3<60){n3++;const g=new THREE.Group();g.userData.noCol=true;const aw=new THREE.Mesh(new THREE.PlaneGeometry(rr(3,4.5),1.6),new THREE.MeshLambertMaterial({color:pick(['#c9b48b','#b5683e','#e9dfcb','#8a3f2f']),side:THREE.DoubleSide}));aw.rotation.x=-Math.PI/2+0.45;aw.position.set(0,0,0.7);g.add(aw);
          const sg=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.55,0.08),lam('#b0563a'));sg.position.set(0,0.75,0.05);g.add(sg);{const o=front(rr(-w/3,w/3),3,0.05,g);try{atReg(o.position.x,o.position.z,o.position.y,'letrero',0.8);}catch(e){}}}
        if(!ins){const p=toW(0,d/2+1.2,it.x,it.z,it.a),m=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.1),new THREE.MeshLambertMaterial({map:ambCanem()}));m.rotation.x=-Math.PI/2;m.rotation.z=-it.a;m.position.set(p[0],floorAt(p[0],p[1])+0.04,p[1]);m.userData.noCol=true;scene.add(m);if(R()<0.3)egxObj(p[0],p[1],undefined,'amb:canem','Cave canem','mosaico de la entrada',2);}}}
  }
  // en los mapas de naturaleza y de transición: eras, chozas con redil y colmenas; exvotos en las fuentes
  for(const I of ISLANDS){if(!I||!isFinite(I.x)||!(I.id in (typeof NAT_NY!=='undefined'?NAT_NY:{})))continue;const a=I.arrive||I.town||{x:I.x,z:I.z};
    const sp=(dx,dz)=>findFree(a.x+dx,a.z+dz,3);
    {const f=sp(rr(-60,60),rr(40,90));if(f&&Math.abs(terrainH(f[0]+4,f[1])-terrainH(f[0]-4,f[1]))<1){const gy=terrainH(f[0],f[1]);const fl=new THREE.Mesh(new THREE.CylinderGeometry(5,5,0.12,24),lam('#cdb88a'));fl.position.set(f[0],gy+0.05,f[1]);scene.add(fl);const ring=new THREE.Mesh(new THREE.TorusGeometry(5,0.18,5,32),st);ring.rotation.x=Math.PI/2;ring.position.set(f[0],gy+0.1,f[1]);scene.add(ring);
      const st2=new THREE.Mesh(new THREE.ConeGeometry(1.4,1.6,10),lam('#d9c27a'));st2.position.set(f[0]+2,gy+0.8,f[1]+1);scene.add(st2);AMB.flowers.push({o:st2,season:'ver'});egxObj(f[0],f[1],undefined,'amb:era','Una era','donde se trilla el grano',3);}}
    {const f=sp(rr(-90,90),rr(-90,-40));if(f){const gy=minGround(f[0],f[1],4,4,0),g=grp(f[0],gy,f[1],R()*TAU);const w=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.8,1.4,10),st);w.position.y=0.7;g.add(w);const rf=new THREE.Mesh(new THREE.ConeGeometry(2.1,2,10),lam('#a8925a'));rf.position.y=2.4;g.add(rf);addCirc(f[0],f[1],1.9);
      const pen=new THREE.Mesh(new THREE.TorusGeometry(4.5,0.35,4,20),st);pen.rotation.x=Math.PI/2;pen.position.set(6.5,0.3,0);pen.scale.set(1,1,1.6);g.add(pen);egxObj(f[0],f[1]+2.5,undefined,'amb:choza','Choza de pastores','y su redil',3);}}
    {const f=sp(rr(-50,50),rr(-30,30));if(f){const gy=minGround(f[0],f[1],5,2,0),g=grp(f[0],gy,f[1],R()*TAU);box(5.4,0.4,1.2,st,0,0.2,0,g);for(let i=0;i<5;i++){const h=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.9,10),i%2?clay:lam('#8a6a4a'));h.rotation.z=Math.PI/2;h.position.set(-2.1+i*1.05,0.7,0);g.add(h);}addBox(f[0],f[1],5.4,1.2,0);egxObj(f[0],f[1]+1.4,undefined,'amb:colmena','Colmenas','de barro y de corcho',2.6);}}
    // flores de temporada alrededor del camino
    {const fc=['#c0392b','#e8d36a','#9b6ab0','#f2ece0'],geo=new THREE.SphereGeometry(0.07,5,4),items=[];for(let k=0;k<260;k++){const x=a.x+rr(-120,120),z=a.z+rr(-120,120),h=terrainH(x,z);if(h<1)continue;const m=new THREE.Matrix4().makeTranslation(x,h+0.12,z);items.push({m,c:new THREE.Color(pick(fc))});}
      if(items.length){const before=CHUNKS.length;chunked(geo,new THREE.MeshLambertMaterial({color:0xffffff}),items,{far:220,shadow:false});for(let k=before;k<CHUNKS.length;k++){CHUNKS[k].im.userData.veg=true;AMB.flowers.push({o:CHUNKS[k].im,season:'pri',chunk:CHUNKS[k]});}}}}
    for(const[x,z]of AMB.springs||[])egxObj(x,z,undefined,'amb:exvoto','Exvotos','junto a la fuente',2);
  }catch(e){console.warn('ambSetup',e);}}
// exvotos en cada fuente de los mapas de naturaleza
const natSpringAmb=natSpring;natSpring=function(x,z){const r=natSpringAmb(x,z);try{const g=grp(x+2.6,terrainH(x+2.6,z+1),z+1,0);for(let i=0;i<5;i++){const f=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.07,0.22,6),lam('#b5683e'));f.position.set(rr(-0.5,0.5),0.11,rr(-0.3,0.3));g.add(f);}box(0.25,0.18,0.02,lam('#d9c9a0'),0.3,0.35,0,g);(AMB.springs=AMB.springs||[]).push([x+2.6,z+1]);}catch(e){}return r;};   /* la ficha se crea en ambSetup: egxSetup vacía la lista de objetos después de construir el mundo */
function ambCanem(){if(AMB.canemTex)return AMB.canemTex;const c=document.createElement('canvas');c.width=128;c.height=88;const x=c.getContext('2d');x.fillStyle='#e8e0cf';x.fillRect(0,0,128,88);x.fillStyle='#1d1612';x.fillRect(4,4,120,80);x.fillStyle='#e8e0cf';x.fillRect(8,8,112,72);
  x.fillStyle='#1d1612';x.beginPath();x.ellipse(60,40,30,12,0,0,TAU);x.fill();x.fillRect(84,30,16,10);x.fillRect(38,48,5,18);x.fillRect(48,48,5,18);x.fillRect(70,48,5,18);x.fillRect(80,48,5,18);x.fillRect(26,36,14,4);x.fillStyle='#a8392b';x.fillRect(86,40,10,3);
  x.fillStyle='#1d1612';x.font='bold 11px serif';x.textAlign='center';x.fillText('CAVE CANEM',64,79);AMB.canemTex=new THREE.CanvasTexture(c);return AMB.canemTex;}
// sonidos: gallo al alba, perros de noche, lechuza en Atenas, campana de las termas en Roma
function ambTone(f0,f1,dur,type,vol,delay){try{const C=AUD.ctx,t=C.currentTime+(delay||0),o=C.createOscillator(),g=C.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.03);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(AUD.master||C.destination);o.start(t);o.stop(t+dur+0.05);}catch(e){}}
function ambCock(){ambTone(520,780,0.18,'sawtooth',0.025,0);ambTone(780,900,0.35,'sawtooth',0.025,0.2);ambTone(900,600,0.5,'sawtooth',0.02,0.58);}
function ambBark(){for(let k=0;k<2;k++)try{gfNoise(AUD.ctx.currentTime+k*0.28,'bandpass',700+R()*200,3,0.05,0.005,0.12);}catch(e){}}
function ambOwl(){ambTone(420,380,0.35,'sine',0.04,0);ambTone(400,360,0.6,'sine',0.035,0.55);}
function ambBell(){for(const[f,v]of[[660,0.05],[1320,0.02],[1980,0.012]])ambTone(f,f*0.995,2.6,'sine',v,0);}
const AMB_CRY=['«¡Salchichas calientes!»','«¡Pasteles, pasteles recién hechos!»','«¡Azufre por cristal roto!» (el trapero cambia pajuelas de azufre por vidrio roto)','«¡Agua fresca, agua!»','«¡Higos de Tusculum!»'];
function ambTick(dt){if(!state||ui==='start')return;AMB.t+=dt;const ro=MODE==='roma',h=clock.h,night=h<5.5||h>20.5,mo=calNow().mo,season=mo>=2&&mo<=4?'pri':mo>=5&&mo<=7?'ver':mo>=8&&mo<=10?'oto':'inv';
  let inCity=false;try{inCity=!islandOf(player.x)&&player.feet<CASA.Y-50;}catch(e){}const nat=(()=>{try{const I=islandOf(player.x);return I&&typeof NAT_NY!=='undefined'&&(I.id in NAT_NY);}catch(e){return false;}})();
  // humo que sube y se deshace
  for(const S of AMB.smoke){const near=Math.abs(S.x-player.x)<400&&Math.abs(S.z-player.z)<400;for(const P of S.p){P.sp.visible=near&&!night;if(!near)continue;P.t+=dt*0.08;if(P.t>1)P.t-=1;const t=P.t;P.sp.position.set(S.x+Math.sin(t*3+S.x)*1.5+t*4,S.y+t*14,S.z+t*2);P.sp.scale.setScalar(1.5+t*6);P.sp.material.opacity=0.35*Math.sin(t*Math.PI);}}
  // cenas de Hécate solo en luna nueva
  {const nm=typeof cultDia==='function'&&cultDia().i===0;for(const C of AMB.cena){C.g.visible=nm;C.o.x=C.x;C.o.r=nm?1.8:0;}}
  // flores según la estación
  for(const F of AMB.flowers){const on=F.season===season||(F.season==='pri'&&season==='ver'&&mo===5);if(F.chunk){F.chunk.near=on?0:1e9;if(!on)F.o.visible=false;}else F.o.visible=on;}
  // sonidos del día y de la noche
  if(AUD_ON&&aOK()&&ui==='play'&&!ACC.noAmb){AMB.tSnd-=dt;
    if(h>5&&h<6.3&&AMB.tCock!==state.day&&(inCity||nat)){AMB.tCock=state.day;ambCock();}
    if(AMB.tSnd<0){AMB.tSnd=rr(18,40);if(night&&(inCity||nat)){if(!ro&&R()<0.5)ambOwl();else ambBark();}}
    if(ro&&inCity&&h>=13.8&&h<14.2&&AMB.tBell!==state.day){AMB.tBell=state.day;ambBell();const z=ambz();if(!z.seen.bell){z.seen.bell=1;save();toast('<span class="label">La campana de las termas</span><br>Suena el bronce: abren los baños. «Deja la pelota: suena la campana de las termas», bromea Marcial (Epigramas XIV 163). La mayoría de los romanos va a las termas a primera hora de la tarde.');}}
    if(ro&&inCity&&!night&&h>8&&h<17){AMB.tCry-=dt;if(AMB.tCry<0){AMB.tCry=rr(50,110);const near=walkers.some(w=>w.g&&Math.hypot(w.g.position.x-player.x,w.g.position.z-player.z)<25);if(near){toast('<span class="label">Un vendedor ambulante</span><br>'+pick(AMB_CRY)+(ambz().seen.cry?'':' <span class="sub">Séneca se queja de vivir encima de unas termas: gritos de los vendedores, del depilador, del pastelero y del salchichero (Cartas a Lucilio 56).</span>'));ambz().seen.cry=1;}}}}
  ambFx(dt,{night,h,season,inCity,nat});}
// partículas: luciérnagas, niebla del alba, motas de polvo, golondrinas; y calima en las horas de calor
function ambFx(dt,E){const ro=MODE==='roma';
  if(!AMB.flies){const n=40,pos=new Float32Array(n*3),g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));AMB.flies=new THREE.Points(g,new THREE.PointsMaterial({color:0xd8ff8a,size:0.12,transparent:true,opacity:0.9,depthWrite:false,blending:THREE.AdditiveBlending}));AMB.flies.frustumCulled=false;AMB.flies.userData.noCol=true;scene.add(AMB.flies);AMB.flyP=[...Array(n)].map(()=>({x:rr(-25,25),z:rr(-25,25),y:rr(0.4,2),ph:R()*10}));}
  const fl=E.season==='ver'&&E.night&&E.nat;AMB.flies.visible=fl;if(fl){const a=AMB.flies.geometry.attributes.position;AMB.flyP.forEach((p,i)=>{p.ph+=dt;const on=Math.sin(p.ph*2.3+i)>0.3;a.setXYZ(i,player.x+p.x+Math.sin(p.ph*0.4)*2,on?terrainH(player.x+p.x,player.z+p.z)+p.y+Math.sin(p.ph)*0.3:-999,player.z+p.z+Math.cos(p.ph*0.3)*2);});a.needsUpdate=true;}
  if(!AMB.mist){const m=new THREE.Mesh(new THREE.PlaneGeometry(180,180),new THREE.MeshBasicMaterial({map:ambTex(235,238,240),transparent:true,opacity:0,depthWrite:false}));m.rotation.x=-Math.PI/2;m.userData.noCol=true;scene.add(m);AMB.mist=m;}
  {let wet=false;try{wet=typeof riverWater==='function'&&(riverWater(player.x+20,player.z)!==null||riverWater(player.x-20,player.z)!==null||riverWater(player.x,player.z+20)!==null||riverWater(player.x,player.z-20)!==null);}catch(e){}
   const k=wet&&E.h>5&&E.h<8.5&&E.season!=='ver'?Math.min(1,(8.5-E.h)/2):0;AMB.mist.material.opacity+=(k*0.45-AMB.mist.material.opacity)*Math.min(1,dt*0.5);AMB.mist.visible=AMB.mist.material.opacity>0.01;if(AMB.mist.visible)AMB.mist.position.set(player.x,floorAt(player.x,player.z)+1.2,player.z);}
  if(!AMB.dust){const n=60,g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));AMB.dust=new THREE.Points(g,new THREE.PointsMaterial({color:0xfff2d0,size:0.025,transparent:true,opacity:0.7,depthWrite:false}));AMB.dust.frustumCulled=false;AMB.dust.userData.noCol=true;scene.add(AMB.dust);AMB.dustP=[...Array(n)].map(()=>[rr(-3,3),rr(0.2,2.6),rr(-3,3),R()*10]);}
  {const inside=player.feet>CASA.Y-50&&!E.night;AMB.dust.visible=inside;if(inside){const a=AMB.dust.geometry.attributes.position;AMB.dustP.forEach((p,i)=>{p[3]+=dt*0.2;a.setXYZ(i,player.x+p[0]+Math.sin(p[3])*0.3,player.feet+p[1]+Math.sin(p[3]*0.7)*0.2,player.z+p[2]+Math.cos(p[3]*0.8)*0.3);});a.needsUpdate=true;}}
  if(!AMB.sw){AMB.sw=[];for(let i=0;i<6;i++){const b=birdMesh('#1d1a22');b.g.scale.setScalar(0.32);b.g.userData.noCol=true;scene.add(b.g);AMB.sw.push({b,ph:R()*TAU,r:rr(6,14),sp:rr(1.2,2),y:rr(3,7)});}}
  {const on=E.season==='pri'&&!E.night&&E.h>7&&E.h<19&&(E.inCity||E.nat);for(const S of AMB.sw){S.b.g.visible=on;if(!on)continue;S.ph+=dt*S.sp;const x=player.x+Math.cos(S.ph)*S.r,z=player.z+Math.sin(S.ph*1.3)*S.r;S.b.g.position.set(x,floorAt(x,z)+S.y+Math.sin(S.ph*3)*1.2,z);S.b.g.rotation.y=-S.ph;const fa=Math.sin(AMB.t*14+S.ph)*0.7;if(S.b.wg){S.b.wg[0].rotation.z=fa;S.b.wg[1].rotation.z=-fa;}}
   if(on&&!ambz().seen.golond){ambz().seen.golond=1;save();setTimeout(()=>toast('<span class="label">Golondrinas</span><br>Han vuelto las golondrinas: es primavera. «Una golondrina no hace verano», dice el refrán que recoge Aristóteles (Ética a Nicómaco I 7).'),1200);}}
  // la calima ya la pone el tiempo meteorológico (WXS.heat) en los días de calor
}

