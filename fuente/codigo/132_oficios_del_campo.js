// ============================================================ OFICIOS DEL CAMPO: quién vive y trabaja en el monte, el río, la costa y los caminos
// En los mapas de naturaleza (RD_MAPS) se montan, al entrar por primera vez, escenas con su actividad, su sonido, su ficha en el modo atención y
// unas palabras si hablas con ellos: leñadores, resineros, cazadores con perros y redes, pajareros, cortadores de raíces, colmeneros, pastores
// con rebaño, altares de campo (Grecia) y augures (Italia), la granja según la estación, canteros, lavanderas, barqueros, pescadores de púrpura,
// buceadores de esponjas, y por los caminos corredores, buhoneros, veteranos y mendigos. Ya existían: carboneros, pescadores, rebaños y tráfico.
// Colocación con forRng (semilla por mapa): no toca R().
const RU={built:{},live:[],mov:[],t:0,riv:{}};
const RU_MAP={citeron:['lenador','cazador','pastor','altar','granja'],nemea:['pastor','granja','apicultor','lavanderas'],liceo:['cazador','pastor','altar','rizotomo','lenador'],
 tempe:['lavanderas','barquero','pajarero','rizotomo','pastor'],parnaso:['pastor','altar','rizotomo','apicultor','resinero'],pentelico:['canteros','apicultor','granja','lenador'],
 eta:['rizotomo','lenador','pastor','cazador'],achelous:['barquero','lavanderas','granja','pajarero'],taigeto:['cazador','resinero','pastor','lenador'],escironides:['esponjero','pastor','granja'],
 lerna:['lavanderas','granja','pajarero','apicultor'],erimanto:['cazador','lenador','resinero','pastor'],estinfalo:['pajarero','apicultor','lavanderas','granja'],tenaro:['purpurero','pastor','altar'],
 lebadea:['granja','apicultor','lavanderas','pastor'],nemi:['lenador','lavanderas','pajarero','granja','cazador'],soracte:['pastor','augur','cazador','granja'],clitumno:['pastor','lavanderas','barquero','granja'],
 sila:['resinero','lenador','cazador','pastor'],ciminia:['lenador','resinero','cazador','augur'],caudium:['pastor','granja','augur'],lunae:['canteros','granja','pastor'],padus:['barquero','pajarero','lavanderas','granja'],rubico:['granja','augur','barquero','pastor']};
const RU_W={a:{chiton:'#8a7a5a',exomis:true,hair:'#3a2a1e'},r:{chiton:'#8a7a5a',short:true,noHimation:true,hair:'#3a2a1e'},f:{female:true,chiton:'#c9b48b',noHimation:true,hair:'#3a2a1e'}};
function ruRng(id){let h=7;for(const c of id)h=(h*31+c.charCodeAt(0))%999983;return forRng(h/999983+0.017);}
function ruP(look,x,z,ry){const g=makePerson(Object.assign({noVary:true},look));g.rotation.order='YXZ';g.position.set(x,terrainH(x,z),z);g.rotation.y=ry||0;scene.add(g);return g;}
function ruW(f){return Object.assign({},f?RU_W.f:(MODE==='roma'?RU_W.r:RU_W.a));}
function ruHand(g,m,dy,dz){if(m&&m.userData)m.userData.ruTool=1;   // (196 lo pasa a la mano del modelo de Blender)
  const a=g.userData.arms&&g.userData.arms[1];if(!a)return false;g.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(a),hy=(b.min.y-g.position.y)/(g.scale.y||1);if(!(hy>0.4&&hy<1.2))return false;
  m.position.set(0,hy-a.position.y+(dy||0),dz||0.04);m.traverse(o=>{if(o.isMesh)o.castShadow=true;});a.add(m);return true;}
function ruCyl(r,h,mat,x,y,z,par){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,8),mat);m.position.set(x||0,y||0,z||0);m.castShadow=true;(par||scene).add(m);return m;}
function ruTree(par,x,z,pine){const g=new THREE.Group();g.position.set(x,0,z);par.add(g);ruCyl(0.3,pine?8:3,lam(pine?'#5a4030':'#5a4a38'),0,pine?4:1.5,0,g);const c=new THREE.Mesh(pine?new THREE.ConeGeometry(2.4,5,9):new THREE.SphereGeometry(2.4,9,7),lam(pine?'#3f5a36':'#7d8a5e'));c.position.y=pine?8:3.8;c.castShadow=true;g.add(c);return g;}
// ---- dónde: un sitio llano, seco y libre; las orillas y los vados se buscan en los ríos del mapa
function ruGround(g){g.updateMatrixWorld(true);const v=new THREE.Vector3();for(const ch of g.children){if(ch.userData.noGround)continue;ch.getWorldPosition(v);ch.position.y+=terrainH(v.x,v.z)-g.position.y;}}
function ruSteep(I,rng,used){for(let k=0;k<160;k++){const a=rng()*TAU,r=I.R*(0.15+rng()*0.7),x=I.x+Math.cos(a)*r,z=I.z+Math.sin(a)*r;if(used.some(u=>Math.hypot(u[0]-x,u[1]-z)<34))continue;const h=terrainH(x,z);if(h<1)continue;
    let best=null,bs=0;for(let j=0;j<8;j++){const b=j/8*TAU,s=terrainH(x+Math.sin(b)*8,z+Math.cos(b)*8)-h;if(s>bs){bs=s;best=b;}}if(bs<3.5||bs>12)continue;if(!isFree(x,z,2))continue;used.push([x,z]);return{x,z,ry:best+Math.PI};}return null;}
function ruSpot(I,rng,used,flat){for(let k=0;k<(flat?140:70);k++){const a=rng()*TAU,r=I.R*(0.18+rng()*0.62),x=I.x+Math.cos(a)*r,z=I.z+Math.sin(a)*r;
    if(used.some(u=>Math.hypot(u[0]-x,u[1]-z)<34))continue;if(I.arrive&&Math.hypot(I.arrive.x-x,I.arrive.z-z)<26)continue;const h=terrainH(x,z);if(h<0.8)continue;
    const fr=flat||3,fl=flat?1.2:1.6;if(Math.abs(terrainH(x+fr,z)-terrainH(x-fr,z))>fl||Math.abs(terrainH(x,z+fr)-terrainH(x,z-fr))>fl)continue;let w=null;try{w=riverWater(x,z);}catch(e){}if(w!==null)continue;
    if(I.lake&&Math.hypot((x-I.lake.x)/I.lake.rx,(z-I.lake.z)/I.lake.rz)<1.15)continue;if(!isFree(x,z,2.5))continue;used.push([x,z]);return{x,z,ry:rng()*TAU};}return null;}
function ruWaterPts(I){if(RU.riv[I.id])return RU.riv[I.id];const P=[];for(let x=-I.R*0.9;x<=I.R*0.9;x+=8)for(let z=-I.R*0.9;z<=I.R*0.9;z+=8){let w=null;try{w=riverWater(I.x+x,I.z+z);}catch(e){}if(w!==null)P.push([I.x+x,I.z+z,w]);}return RU.riv[I.id]=P;}
function ruDry(x,z){let w=null;try{w=riverWater(x,z);}catch(e){}return w===null&&terrainH(x,z)>0.5;}
function ruBank(I,rng,used){const P=ruWaterPts(I);for(let k=0;k<50&&P.length;k++){const p=P[Math.floor(rng()*P.length)];if(used.some(u=>Math.hypot(u[0]-p[0],u[1]-p[1])<30))continue;
    for(let j=0;j<8;j++){const a=j/8*TAU+rng()*0.3,dx=Math.cos(a),dz=Math.sin(a);for(let s=1;s<14;s++){const x=p[0]+dx*s,z=p[1]+dz*s;if(ruDry(x,z)){const bx=x+dx*1.5,bz=z+dz*1.5;if(ruDry(bx,bz)&&isFree(bx,bz,1.2)){used.push([bx,bz]);return{x:bx,z:bz,ry:Math.atan2(-dx,-dz),w:p[2]};}break;}}}}
  if(I.lake){for(let k=0;k<20;k++){const a=rng()*TAU,x=I.lake.x+Math.cos(a)*(I.lake.rx+3),z=I.lake.z+Math.sin(a)*(I.lake.rz+3);if(ruDry(x,z)&&isFree(x,z,1.2)&&!used.some(u=>Math.hypot(u[0]-x,u[1]-z)<30)){used.push([x,z]);return{x,z,ry:Math.atan2(I.lake.x-x,I.lake.z-z)};}}}return null;}
function ruFord(I,rng,used){const P=ruWaterPts(I);for(let k=0;k<60&&P.length;k++){const p=P[Math.floor(rng()*P.length)];if(used.some(u=>Math.hypot(u[0]-p[0],u[1]-p[1])<40))continue;
    for(let j=0;j<8;j++){const a=j/8*Math.PI,dx=Math.cos(a),dz=Math.sin(a);const side=sg=>{for(let s=1;s<26;s++){const x=p[0]+dx*s*sg,z=p[1]+dz*s*sg;if(ruDry(x,z))return[x+dx*sg*1.2,z+dz*sg*1.2,s];}return null;};const A=side(1),B=side(-1);
      if(A&&B&&A[2]+B[2]>5){used.push([p[0],p[1]]);return{A,B,w:p[2],x:p[0],z:p[1]};}}}return null;}
function ruShore(I,rng,used){for(let k=0;k<16;k++){const a=rng()*TAU,s=shoreAlong(I.x,I.z,Math.cos(a),Math.sin(a),I.R*1.6);if(Math.hypot(s[0]-I.x,s[1]-I.z)<20)continue;if(used.some(u=>Math.hypot(u[0]-s[0],u[1]-s[1])<30))continue;if(terrainH(s[0],s[1])<0.3)continue;used.push(s);return{x:s[0],z:s[1],ry:a};}return null;}
// ---- textos: [nombre, subtítulo, palabras, nota con la fuente] para Grecia (a) y Roma (r)
const RU_TX={
 lenador:{a:['Un leñador','hylotómos','«Encina y roble para las vigas y el carbón, pino y abeto para los barcos, olmo para los ejes de los carros. Aquí arriba se corta; abajo, en la ciudad, se paga caro: el Ática se ha quedado casi sin bosques».','Platón dirá que los montes del Ática, que antes daban vigas para las casas grandes, ahora solo alimentan abejas (Critias 111c). Teofrasto, que aún no ha nacido, dedicará un libro entero a las maderas (Historia de las plantas, libro 5).'],
   r:['Un leñador','lignarius','«Antes de aclarar un bosque hay que pedir permiso al dios o a la diosa que lo habite, con un cerdo y una oración. Y la madera se corta con luna menguante, que si no se carcome».','La oración y el cerdo del sacrificio están en Catón, Sobre la agricultura 139: «seas dios o diosa, a quien está consagrado este bosque…». Lo de la luna lo recoge Plinio el Viejo (Historia natural, libro 16).']},
 resinero:{a:['Un resinero','sacando pez','«Hago una herida en el pino, abajo, y la resina gotea en la vasija. Hervida, da la pez: con ella se calafatean los barcos y se untan por dentro las ánforas. Por eso tantos vinos saben a resina».','Teofrasto, que aún no ha nacido, describirá cómo se saca la pez en Macedonia y en el monte Ida (Historia de las plantas 9, 2-3).'],
   r:['Un resinero','sacando pez','«Herida en el pino, vasija debajo, y luego a hervir. Con la pez se calafatean los barcos y se untan las tinajas del vino».','La pez del Bruttium, la de los montes de la Sila, era la más apreciada de Italia: la alaban Plinio el Viejo (Historia natural, libros 14 y 16) y Columela (Sobre la agricultura, libro 12).']},
 cazador:{a:['Un cazador','con perros y redes','«Las redes se tienden de madrugada en los pasos de la liebre; los perros la levantan y la empujan hacia ellas. Los mejores perros, los de Laconia: rápidos y callados».','Jenofonte, el discípulo de Sócrates, vive ahora retirado en su finca de Escilunte, cerca de Olimpia, cazando. Se le atribuye un tratado sobre la caza con perros y redes, el Cinegético.'],
   r:['Un cazador','con perros y redes','«Jabalí con lanza y red, ciervo con perros. Y no creas que solo cazan los pobres: los señores salen al monte con esclavos, redes y jaurías».','Plinio el Joven contará que caza sentado junto a las redes con las tablillas al lado, por si se le ocurre algo que escribir: «Minerva anda por los montes no menos que Diana» (Cartas 1, 6).']},
 pajarero:{a:['Un pajarero','con la caña de liga','«Unto la punta de esta caña larga con liga, hecha de bayas de muérdago, y la acerco despacio al pájaro posado. Si la toca, se queda pegado».','En las Aves de Aristófanes, los pájaros se quejan de los pajareros que los atrapan con redes, lazos, varetas de liga y trampas (v. 526-528).'],
   r:['Un pajarero','auceps','«Caña de liga, reclamo y paciencia. El pájaro no ve la caña: oye el canto y se acerca».','Marcial lo resume en dos versos: al pájaro no solo lo engaña la caña, también el canto con que lo llaman (Epigramas 14, 218).']},
 rizotomo:{a:['Un cortador de raíces','rhizotómos','«Hay raíces que curan y raíces que matan. Y algunas hay que cortarlas como se debe: de noche, de cara al viento, después de trazar un círculo alrededor con la espada. Si no, la planta se venga».','Teofrasto, que aún no ha nacido, recogerá las costumbres de los cortadores de raíces, aunque muchas le parezcan supersticiones (Historia de las plantas 9, 8).'],
   r:['Un herbolario','herbarius','«Esta para la tos, esta para las heridas, esta mejor ni tocarla. Cada una tiene su luna y su hora».','Plinio el Viejo dedica varios libros de su Historia natural a los remedios que dan las plantas (libros 20-27).']},
 apicultor:{a:['Un colmenero','melittourgós','«Un poco de humo y las abejas se calman. Las colmenas son de barro cocido, tumbadas: los panales se sacan por detrás. La mejor miel de Grecia es la del Himeto, en el Ática».','Solón dejó escrito que quien ponga colmenas debe dejar trescientos pies de distancia con las del vecino (Plutarco, Solón 23).'],
   r:['Un colmenero','apiarius','«Colmenas de mimbre y de corcho, un poco de humo… Las abejas son como una ciudad: cada una tiene su oficio».','Virgilio dedica a las abejas todo el libro cuarto de las Geórgicas; Varrón trata de ellas en Sobre la agricultura 3, 16.']},
 pastor:{a:['Un pastor','con su rebaño','«Arriba en verano, abajo en invierno. Las cabras comen lo que sea; las ovejas quieren buena hierba. De noche, el perro y el fuego, por los lobos. Y si me aburro, la siringa, la flauta de Pan».','Hesíodo cuenta que las Musas se le aparecieron mientras apacentaba corderos al pie del Helicón (Teogonía 22-23).'],
   r:['Un pastor','con su rebaño','«En verano, a los pastos del monte; en invierno, a la llanura, por las cañadas. Pales y Fauno guardan el ganado; el 21 de abril, en las Parilia, saltamos sobre hogueras de paja».','Virgilio abre las Bucólicas con un pastor, Títiro, tumbado a la sombra de un haya tocando la flauta (Bucólicas 1, 1-2). Las Parilia las cuenta Ovidio (Fastos 4, 721-806).']},
 altar:{a:['Un altar de campo','para Pan y las ninfas','«Un poco de leche, una torta, una figurilla de barro… Pan cuida de los rebaños y las ninfas, de las fuentes. Más vale tenerlos contentos».','En la cueva Coricia, en el Parnaso, consagrada a Pan y a las ninfas (Pausanias 10, 32, 7), los arqueólogos han encontrado miles de figurillas, anillos y tabas que dejaron pastores y peregrinos.'],r:null},
 augur:{a:null,r:['Un augur','con el lituus','«Silencio. Con el lituus divido el cielo en regiones. Si las aves vuelan por la izquierda, los dioses aprueban».','Livio cuenta cómo un augur, con la cabeza cubierta y el lituus en la mano, tomó los auspicios para el rey Numa mirando al cielo (Ab urbe condita 1, 18).']},
 canteros:{a:['Canteros','en la cantera de mármol','«Con el pico abrimos zanjas alrededor del bloque, luego metemos cuñas y lo separamos de la roca. Lo peor es bajarlo al llano, en trineos, con bueyes y cuerdas».','Del Pentélico salió el mármol del Partenón y de los Propileos. En la cantera todavía se ven las marcas de los picos.'],
   r:['Canteros','en la cantera de mármol','«Mármol de Luna, blanco como la nieve. De aquí, en barco hasta el Tíber».','Desde Augusto, que presumía de haber recibido una Roma de ladrillo y dejarla de mármol (Suetonio, Augusto 28), el mármol de Luna, el de Carrara, llena los foros y los templos.']},
 lavanderas:{a:['Lavanderas','en el río','«Pisamos la ropa en el agua y la golpeamos contra las piedras; luego, a secar sobre los arbustos».','Así lava Nausícaa con sus criadas en el río cuando aparece Ulises, desnudo, entre los matorrales (Odisea 6, 85-98).'],
   r:['Lavanderas','en el río','«En la ciudad, la ropa buena va al batanero; aquí, al río, como siempre».','Los bataneros (fullones) lavaban con orina, que se recogía en vasijas por las calles; Vespasiano le puso un impuesto (Suetonio, Vespasiano 23).']},
 barquero:{a:['Un barquero','porthmeús','«¿Al otro lado? Un óbolo, como Caronte».','Por eso a los muertos se les pone un óbolo en la boca: para pagar al barquero Caronte, que pasa las almas al otro lado de la laguna del Hades.'],
   r:['Un barquero','portitor','«¿Al otro lado? Un as».','Los griegos ponían un óbolo en la boca de los muertos para Caronte; en Italia también se encuentran monedas en las tumbas.']},
 purpurero:{a:['Un pescador de púrpura','porphyreús','«Cebo las nasas con mejillones y caen los múrices. Luego se rompe la concha y se saca una glándula pequeñita… Hacen falta miles para teñir un manto. Por eso la púrpura vale más que la plata».','La púrpura de Laconia es famosa. Aristóteles, que nacerá dentro de dos años, describirá cómo se pescan los múrices (Historia de los animales 5, 15).'],r:null},
 esponjero:{a:['Un buceador de esponjas','con la piedra','«Me tiro con una piedra atada para bajar rápido, corto las esponjas del fondo y subo antes de que se me acabe el aire».','Heródoto cuenta que el mejor buceador de su tiempo, Escilias de Escione, se pasó a los griegos nadando bajo el agua ochenta estadios (8, 8), aunque él mismo no se lo cree.'],r:null},
 mendigo:{a:['Un mendigo','junto al camino','«¡Una limosna, por Zeus Hospitalario!»','Zeus protege a forasteros y mendigos: «de Zeus vienen todos los forasteros y mendigos», dice Nausícaa (Odisea 6, 207-208).'],
   r:['Un mendigo','junto al camino','«¡Una moneda, por los dioses!»','En la cuesta de Aricia, en la Vía Apia, los carros van despacio y los mendigos esperan junto a las ruedas: Juvenal llama a alguien «digno de mendigar en las ruedas de Aricia» (Sátiras 4, 117).']}};
const RU_FARM={a:{oliva:['Vareamos el olivo: las aceitunas caen sobre la manta. Para aceite, para comer, para la lámpara.','Arrancar un olivo sagrado se castigaba con dureza: Lisias escribió un discurso para un acusado de arrancar el tocón de uno (Discurso 7).'],
  poda:['Podamos la viña antes de que se despierte.','«Antes de que llegue la golondrina, poda las viñas» (Hesíodo, Trabajos y días 568-570).'],cava:['Cavamos alrededor de las cepas y quitamos las malas hierbas.','Hesíodo lo cuenta todo, mes a mes, en Trabajos y días.'],
  siega:['A segar: hoz en mano y gavillas atadas.','«Cuando salen las Pléyades, empieza la siega; cuando se ponen, la labranza» (Hesíodo, Trabajos y días 383-384).'],trilla:['Los bueyes pisan las espigas en la era; luego lanzamos el grano al aire y el viento se lleva la paja.','«Que tus esclavos trillen el grano sagrado de Deméter cuando aparezca Orión, en una era bien redonda» (Hesíodo, Trabajos y días 597-599).'],
  vendimia:['Se cortan los racimos y se pisan en el lagar.','«Cuando Orión y Sirio lleguen a lo alto del cielo, corta los racimos y llévalos a casa» (Hesíodo, Trabajos y días 609-611).']},
 r:{oliva:['Vareamos los olivos y recogemos la aceituna de la manta.','Catón explica cómo recoger y prensar la aceituna (Sobre la agricultura 64-65).'],poda:['Podamos la viña.','Virgilio da consejos para podar la vid en las Geórgicas, libro 2.'],cava:['Cavamos y escardamos las cepas.','Columela lo explica con detalle en Sobre la agricultura.'],
  siega:['A segar, con la hoz.','Varrón cuenta que en Italia se siega de tres maneras distintas, según la región (Sobre la agricultura 1, 50).'],trilla:['Los bueyes pisan las espigas en la era.','Varrón describe la trilla con bueyes y con el trillo (tribulum) en Sobre la agricultura 1, 52.'],vendimia:['Se cortan los racimos y se pisan en el lagar.','Varrón explica la vendimia en Sobre la agricultura 1, 54.']}};
const RU_ROAD={hemerodromo:['El hemeródromo','Corre un hemeródromo, un «corredor de día», mensajero profesional. Filípides corrió de Atenas a Esparta en dos días para pedir ayuda antes de Maratón (Heródoto 6, 105-106).'],
 buhonero:['El buhonero','Un buhonero con su fardo: agujas, cintas, amuletos, perfumes baratos… En el campo, él es el mercado.'],
 veterano:['El veterano','Un veterano vuelve a casa después de veinte años en las legiones. Con lo que le pagan al licenciarse, el praemium, se comprará unas tierras.']};
for(const k in RU_TX){const T=RU_TX[k];ATX_DEF['ru_'+k]=[(T.a||T.r)[0],'oficio del campo',(T.a||T.r)[3],(T.r||T.a)[3],1.4,45];}
// ---- construcción de cada escena
function ruBuild(I){const id=I.id,rng=ruRng(id),used=[],ro=MODE==='roma';RU.built[id]=1;
  for(const k of RU_MAP[id]||[]){try{
    if(k==='granja'){const s=ruSpot(I,rng,used,13)||ruSpot(I,rng,used);if(s)ruFarm(I,s);continue;}
    if(k==='canteros'){const s=ruSteep(I,rng,used)||ruSpot(I,rng,used);if(s)ruMake(I,k,s);continue;}
    if(k==='lavanderas'){const s=ruBank(I,rng,used);if(s)ruMake(I,k,s);continue;}
    if(k==='barquero'){const f=ruFord(I,rng,used);if(f)ruFerry(I,f);continue;}
    if(k==='purpurero'||k==='esponjero'){const s=ruShore(I,rng,used);if(s)ruMake(I,k,s);continue;}
    if((k==='altar'&&ro)||(k==='augur'&&!ro))continue;
    const s=ruSpot(I,rng,used);if(s)ruMake(I,k,s);}catch(e){}}
  try{ruRoad(I,rng);}catch(e){}}
function ruMake(I,k,s){const ro=MODE==='roma',{x,z,ry}=s,y=terrainH(x,z),g=grp(x,y,z,ry),V={k,x,z,I,g,p:[],an:[],ph:Math.random()*10,st:0};const W=()=>ruW(false);
  const pp=(look,lx,lz,r)=>{const c=Math.cos(ry),sn=Math.sin(ry),wx=x+lx*c+lz*sn,wz=z-lx*sn+lz*c;const p=ruP(look,wx,wz,ry+(r||0));V.p.push(p);return p;};
  if(k==='lenador'){const p=pp(W(),0,0);const ax=new THREE.Group();ruCyl(0.022,0.8,M.wood,0,0,0,ax);box(0.04,0.13,0.2,M.bronze,0,-0.36,0.08,ax);ruHand(p,ax,0.25);
    const lg=ruCyl(0.32,4,lam('#6a5038'),0,0.32,1.3,g);lg.rotation.z=Math.PI/2;for(let i=0;i<6;i++){const c=ruCyl(0.15,1.3,lam('#7a5a40'),-2.6+(i%3)*0.32,0.16+Math.floor(i/3)*0.28,-1,g);c.rotation.z=Math.PI/2;}}
  if(k==='resinero'){ruTree(g,0,1.2,true);box(0.3,0.8,0.06,lam('#e3be6a'),0,1,0.88,g);ruCyl(0.13,0.25,lam('#a8532f'),0,0.13,0.98,g);const p=pp(W(),0.3,0.05);}
  if(k==='cazador'){const look=ro?Object.assign(W(),{chiton:'#6a5a3a'}):Object.assign(W(),{chlamys:'#6a4a2a',petasos:'back'});const p=pp(look,0,0);const sp=new THREE.Group();ruCyl(0.018,2.2,M.wood,0,0.5,0,sp);const hd=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.22,6),M.bronze);hd.position.y=1.7;sp.add(hd);ruHand(p,sp,0);
    for(const sx of[-2.2,2.2])ruCyl(0.03,1.6,M.wood,sx,0.8,4,g);const net=new THREE.Mesh(new THREE.PlaneGeometry(4.4,1.4,10,4),new THREE.MeshBasicMaterial({color:'#6a5a40',wireframe:true}));net.position.set(0,0.75,4);g.add(net);
    for(let i=0;i<2;i++){try{const A=animal('dog',{});if(A&&A.g){V.an.push({A,i});}}catch(e){}}}
  if(k==='pajarero'){const p=pp(W(),0,0);const rod=ruCyl(0.012,3.6,lam('#b8a070'),0,0,0,new THREE.Group());const rg=new THREE.Group();rod.parent.remove(rod);rg.add(rod);rod.position.y=1.5;rg.rotation.x=1.25;ruHand(p,rg,0);V.rod=rg;
    const b=new THREE.Mesh(new THREE.SphereGeometry(1.3,8,6),lam('#5f7a44'));b.position.set(0,1.2,3.6);g.add(b);box(0.12,0.1,0.18,lam('#6a5040'),0,2.5,3.6,g);}
  if(k==='rizotomo'){const p=pp(W(),0,0);kneelOrSit(p,p.position.x,p.position.z);p.rotation.x=0.35;const bk=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.18,0.3,10,1,true),lam('#a8864f'));bk.position.set(0.7,0.15,0.3);g.add(bk);for(let i=0;i<6;i++){const h=new THREE.Mesh(new THREE.SphereGeometry(0.22,6,5),lam(['#6a8a4a','#7a9a5a','#8a7a4a'][i%3]));h.position.set(Math.cos(i)*1.4,0.15,0.9+Math.sin(i)*1.1);g.add(h);}}
  if(k==='apicultor'){const bench=box(4.2,0.4,0.8,M.stone,0,0.2,-1.5,g);for(let i=0;i<5;i++){if(ro){const h=new THREE.Mesh(new THREE.ConeGeometry(0.34,0.75,10),lam('#b49a5a'));h.position.set(-1.7+i*0.85,0.78,-1.5);g.add(h);}else{const h=ruCyl(0.24,0.8,lam('#b5603a'),-1.7+i*0.85,0.65,-1.5,g);h.rotation.x=Math.PI/2;}}
    const p=pp(W(),0,0.6,Math.PI);const sm=ruCyl(0.08,0.18,lam('#8a6a4a'),0,0,0,new THREE.Group());const sg=sm.parent;ruHand(p,sg,0);V.smoke=1;}
  if(k==='pastor'){const cl=I.id==='clitumno';const p=pp(Object.assign(W(),{staff:true}),0,0);V.syr=1;
    if(cl){for(let i=0;i<3;i++){const b=makeBeast('buey',scene,x,z,0);b.traverse(o=>{if(o.isMesh&&o.material&&o.material.color){const c=o.material.color,l=(c.r+c.g+c.b)/3;if(l>0.08)o.material=lam('#ece6da');}});V.an.push({B:b,i,r:4+i*1.6,a0:i*2.1});}}
    else for(let i=0;i<7;i++){try{const A=animal(i%3===0?'goat':'sheep',{});if(A&&A.g)V.an.push({A,i,r:3+(i*1.37)%5,a0:i*0.9});}catch(e){}}
    try{const D=animal('dog',{});if(D&&D.g){D.g.position.set(x+1.2,y,z+0.8);D.g.rotation.y=ry;}}catch(e){}}
  if(k==='altar'){const al=new THREE.Group();g.add(al);box(1.1,0.7,0.8,M.stone,0,0.35,1.6,al);box(0.6,0.25,0.5,M.stone,0.15,0.82,1.6,al);const gar=new THREE.Mesh(new THREE.TorusGeometry(0.42,0.05,5,14),lam('#5a7a3a'));gar.rotation.x=Math.PI/2;gar.position.set(0,0.98,1.6);al.add(gar);
    for(let i=0;i<3;i++){ruCyl(0.05,0.08,lam('#c9874a'),-0.35+i*0.3,0.74,1.3,al);}const f=box(0.08,0.2,0.06,lam('#d8c0a0'),0.3,0.82,1.4,al);const p=pp(Object.assign(W(),{staff:true}),0,0);V.pray=1;}
  if(k==='augur'){const p=pp({toga:true,chiton:'#efe8d8',himation:'#efe8d8',veil:true,noVary:true},0,0);const li=new THREE.Group();ruCyl(0.018,0.9,lam('#8a6a3a'),0,0.2,0,li);const cv=new THREE.Mesh(new THREE.TorusGeometry(0.07,0.016,5,10,Math.PI*1.4),lam('#8a6a3a'));cv.position.y=0.68;li.add(cv);ruHand(p,li,0);V.aug=1;
    for(const[a,b]of[[-4,-4],[4,-4],[-4,4],[4,4]])box(0.3,0.4,0.3,M.stone,a,0.2,b,g);}
  if(k==='canteros'){const wh=lam('#efece4'),wh2=lam('#dcd8cc');for(let i=0;i<4;i++)box(9-i*1.2,2.4,2.4,i%2?wh2:wh,0,0.2+i*0.9,-4-i*2,g);for(let i=0;i<14;i++)box(0.25+(i%3)*0.15,0.15,0.3,wh,Math.cos(i*2.3)*3.5,0.07,-1+Math.sin(i*2.3)*1.5,g);const sl=new THREE.Group();g.add(sl);sl.position.set(3.5,0,1);box(1.6,1.1,1.1,wh,0,0.75,0,sl);for(const s of[-0.5,0.5])box(0.12,0.16,2.2,M.wood,s,0.08,0,sl);
    for(let i=0;i<2;i++){const p=pp(W(),-1.5+i*2.6,-1.6,Math.PI);const mt=new THREE.Group();ruCyl(0.02,0.6,M.wood,0,0,0,mt);box(0.1,0.12,0.22,lam('#5a5a5a'),0,-0.28,0.06,mt);ruHand(p,mt,0.2);}V.clink=1;}
  if(k==='lavanderas'){for(let i=0;i<2;i++){const p=pp(ruW(true),-0.9+i*1.8,0.4);kneelOrSit(p,p.position.x,p.position.z);p.rotation.x=0.3;}
    for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.9,7,6),lam('#5f7a44'));b.position.set(-3+i*3,0.7,-2.5);g.add(b);const cl=new THREE.Mesh(new THREE.PlaneGeometry(1.1,0.7),new THREE.MeshLambertMaterial({color:['#efe8d8','#b84a3a','#d8c48a'][i],side:THREE.DoubleSide}));cl.position.set(-3+i*3,1.45,-2.5);cl.rotation.y=0.3;g.add(cl);}V.slap=1;}
  if(k==='purpurero'){const p=pp(W(),0,0);kneelOrSit(p,p.position.x,p.position.z);p.rotation.x=0.3;for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.ConeGeometry(0.3,0.6,9,1,true),lam('#a08a5a'));b.rotation.x=Math.PI;b.position.set(-2+i*0.9,0.3,1.6);g.add(b);}
    for(let i=0;i<24;i++){const sh=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.12,5),lam('#e8dcc8'));sh.position.set(1.5+Math.cos(i*2.4)*0.6,0.05+(i%4)*0.04,-0.8+Math.sin(i*2.4)*0.6);sh.rotation.z=i;g.add(sh);}ruCyl(0.6,0.7,M.stone,-1.8,0.35,-1.2,g);}
  if(k==='esponjero'){const p=pp(Object.assign(W(),{exomis:true}),0,0);box(1.2,0.35,3,M.wood,2.2,0.2,0.5,g);box(0.3,0.2,0.25,M.stone,0.6,0.1,0.8,g);const bag=new THREE.Mesh(new THREE.SphereGeometry(0.25,7,5),lam('#c8a860'));bag.position.set(-0.6,0.22,0.7);g.add(bag);}
  if(k==='mendigo'){const p=pp({chiton:'#6a5a48',short:true,noHimation:true,hair:'#4a4038',noVary:true},0,0);sitLow(p,p.position.x,p.position.z);ruCyl(0.12,0.06,lam('#8a5a3a'),0,0.03,0.7,g);V.beg=1;}
  ruGround(g);
  const T=RU_TX[k]&&(RU_TX[k][ro?'r':'a']||RU_TX[k].a);if(T){egxObj(x,z,undefined,'ru:'+k+':'+RU.live.length,T[0],T[1],3.4);atReg(x,z,y+1,'ru_'+k,3);}
  RU.live.push(V);return V;}
// la granja: era, olivo, viña, lagar y campo; la faena cambia con el mes
function ruFarm(I,s){const{x,z,ry}=s,y=terrainH(x,z),g=grp(x,y,z,ry),V={k:'granja',x,z,I,g,p:[],an:[],ph:Math.random()*10,fase:null};
  const era=new THREE.Mesh(new THREE.CylinderGeometry(4.5,4.6,0.16,24),lam('#cdbb92'));era.position.y=0.08;g.add(era);V.era=era;
  V.olive=ruTree(g,9,4,false);V.olive.children[1].material=lam('#7b8a62');V.cloth=new THREE.Mesh(new THREE.PlaneGeometry(5,5),lam('#efe8d8'));V.cloth.rotation.x=-Math.PI/2;V.cloth.position.set(9,0.05,4);g.add(V.cloth);
  for(let i=0;i<7;i++){ruCyl(0.03,1.2,M.wood,-9,0.6,-6+i*2,g);box(0.5,0.6,1.4,lam('#5d7a3a'),-9,1.05,-6+i*2,g);}
  V.vat=box(1.8,0.8,1.8,lam('#8a6a4a'),-5,0.4,8.5,g);V.must=box(1.6,0.05,1.6,lam('#4a1a3a'),-5,0.81,8.5,g);
  V.field=new THREE.Mesh(new THREE.PlaneGeometry(12,7),lam('#d0b25a'));V.field.rotation.x=-Math.PI/2;V.field.position.set(0,0.06,-12);g.add(V.field);
  V.sheaves=new THREE.Group();g.add(V.sheaves);for(let i=0;i<6;i++){const sh=ruCyl(0.22,0.8,lam('#d8bc6a'),-4+i*1.6,0.4,-10.5,V.sheaves);}
  V.oxen=[];for(let i=0;i<2;i++){const b=makeBeast('buey',g,0,0,0);V.oxen.push(b);}
  ruGround(g);for(const o of V.oxen)o.userData.noGround=1;
  for(let i=0;i<3;i++){const fem=i===2&&Math.random()<0.5,p=ruP(ruW(fem),x,z,ry);p.userData.fem=fem;V.p.push(p);const tl=new THREE.Group();ruCyl(0.02,2.6,M.wood,0,0.7,0,tl);ruHand(p,tl,0);p.userData.tool=tl;}
  egxObj(x,z,undefined,'ru:granja:'+RU.live.length,'Una granja','el trabajo del mes',8);RU.live.push(V);ruFarmPhase(V);return V;}
function ruFase(){const mo=calNow().mo;return mo>=10||mo===0?'oliva':mo<=2?'poda':mo===3?'cava':mo<=5?'siega':mo<=7?'trilla':'vendimia';}
function ruFarmPhase(V){const f=ruFase();if(V.fase===f)return;V.fase=f;const{x,z,g}=V,ry=g.rotation.y,c=Math.cos(ry),s=Math.sin(ry);
  const put=(p,lx,lz,face,bend,vis)=>{p.visible=vis!==false;const wx=x+lx*c+lz*s,wz=z-lx*s+lz*c;p.position.set(wx,terrainH(wx,wz),wz);p.rotation.y=ry+(face||0);p.rotation.x=bend||0;p.userData.tool.visible=false;};
  V.cloth.visible=f==='oliva';V.sheaves.visible=f==='siega';V.must.visible=f==='vendimia';V.field.material.color.set(f==='siega'?'#d0b25a':f==='trilla'||f==='vendimia'?'#b8a070':f==='oliva'||f==='poda'?'#6e8a3e':'#6e5434');for(const o of V.oxen)o.visible=f==='trilla';
  const[a,b,d]=V.p;
  if(f==='oliva'){put(a,7.4,2.2,-0.6);put(b,10.6,5.8,2.4);put(d,9,4.6,0.3,0.7);a.userData.tool.visible=b.userData.tool.visible=true;}
  else if(f==='poda'){put(a,-8,-2,-Math.PI/2,0.2);put(b,-8,3,-Math.PI/2,0.2);put(d,0,0,0,0,false);}
  else if(f==='cava'){put(a,-8,-1,-Math.PI/2,0.45);put(b,1,-11,0,0.5);put(d,0,0,0,0,false);}
  else if(f==='siega'){put(a,-3,-12,0,0.7);put(b,0,-13,0,0.7);put(d,3,-12,0,0.7);}
  else if(f==='trilla'){put(a,0,0,0);put(b,5.6,1,-Math.PI/2);put(d,0,0,0,0,false);b.userData.tool.visible=true;}
  else{put(a,-8,-3,-Math.PI/2,0.5);put(b,-8,2,-Math.PI/2,0.5);put(d,-5,8.5,0);d.position.y+=0.6;}}
// el barquero: una barca que cruza el río de una orilla a otra
function ruFerry(I,f){const ro=MODE==='roma',bt=new THREE.Group();scene.add(bt);box(1.3,0.35,3.2,M.wood,0,0.15,0,bt);box(1.1,0.1,0.2,M.wood,0,0.38,1.3,bt);
  const p=makePerson({noVary:true,...ruW(false)});p.position.set(0,0.3,-0.9);bt.add(p);const pole=ruCyl(0.025,3.6,M.wood,0.5,1.4,-0.6,bt);pole.rotation.x=0.35;
  const V={k:'barquero',x:f.A[0],z:f.A[1],I,g:bt,p:[p],an:[],f,t:0,pole};RU.live.push(V);const T=RU_TX.barquero[ro?'r':'a'];egxObj(f.A[0],f.A[1],undefined,'ru:barquero:'+(RU.live.length-1),T[0],T[1],4);atReg(f.A[0],f.A[1],terrainH(f.A[0],f.A[1])+1,'ru_barquero',3);}
// los caminos: un caminante que va y viene; y un mendigo junto al camino en los mapas de peregrinos
function ruRoad(I,rng){const Ps=rdPaths(I.id);if(!Ps.length)return;const P=Ps[0],ro=MODE==='roma';
  if(['parnaso','nemi','nemea','clitumno'].includes(I.id)){const q=P[Math.floor(P.length/2)],q2=P[Math.floor(P.length/2)+1]||P[0],dx=q2[0]-q[0],dz=q2[1]-q[1],l=Math.hypot(dx,dz)||1,x=q[0]-dz/l*3.2,z=q[1]+dx/l*3.2;ruMake(I,'mendigo',{x,z,ry:Math.atan2(dz/l*3,-dx/l*3)});}
  const kind=ro?(I.id.length%2?'veterano':'buhonero'):(I.id.length%2?'hemerodromo':'buhonero');
  const look=kind==='hemerodromo'?{chiton:'#d8ccb4',short:true,noHimation:true,hair:'#3a2a1e'}:kind==='veterano'?{chiton:'#9a3a2a',short:true,noHimation:true,hair:'#5a5048'}:Object.assign(ruW(false),{});
  const p=ruP(look,P[0][0],P[0][1],0);if(kind==='buhonero'){box(0.5,0.6,0.35,lam('#8a7350'),0,1.3,-0.25,p);}if(kind==='veterano'){const fk=ruCyl(0.02,1.6,M.wood,0.2,1.55,-0.1,p);fk.rotation.x=1.1;box(0.3,0.3,0.3,lam('#7a6040'),0.2,1.9,-0.6,p);}
  const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));RU.mov.push({p,P,L,s:rng()*L[L.length-1],dir:1,sp:kind==='hemerodromo'?5:kind==='veterano'?1.3:1.0,kind,ph:0,I});}
// ---- sonidos
function ruSfx(k){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;
  if(k==='chop'){const s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=700;s.connect(f).connect(envGain(t,0.22,0.003,0.12));s.start(t,Math.random());s.stop(t+0.2);const o=c.createOscillator();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(70,t+0.15);o.connect(envGain(t,0.15,0.003,0.16));o.start(t);o.stop(t+0.2);}
  else if(k==='clink'){[2300,3100].forEach((fq,i)=>{const o=c.createOscillator();o.type='triangle';o.frequency.value=fq;o.connect(envGain(t+i*0.01,0.06,0.002,0.12));o.start(t);o.stop(t+0.2);});}
  else if(k==='slap'){const s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=800;f.Q.value=1.2;s.connect(f).connect(envGain(t,0.2,0.002,0.09));s.start(t,Math.random());s.stop(t+0.15);}
  else if(k==='buzz'){[205,212].forEach(fq=>{const o=c.createOscillator();o.type='sawtooth';o.frequency.value=fq;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=700;o.connect(f).connect(envGain(t,0.012,0.3,1.4));o.start(t);o.stop(t+1.8);});}
  else if(k==='syrinx'){const N=[523.3,587.3,659.3,784,880];let tt=t;for(let i=0;i<5;i++){const fq=N[Math.floor(Math.random()*N.length)],d=0.25+Math.random()*0.3,o=c.createOscillator();o.type='sine';o.frequency.value=fq;const v=c.createOscillator(),vg=c.createGain();v.frequency.value=5.5;vg.gain.value=fq*0.012;v.connect(vg).connect(o.frequency);o.connect(envGain(tt,0.05,0.04,d));o.start(tt);v.start(tt);o.stop(tt+d+0.1);v.stop(tt+d+0.1);tt+=d*0.9;}}}
// ---- animación y vida (solo cerca)
function ruTick(dt){if(!state||ui==='start')return;const P=player,t=performance.now()/1000;RU.t-=dt;
  if(RU.t<=0){RU.t=2;const I=rcI();if(I&&!RU.built[I.id]&&RU_MAP[I.id])ruBuild(I);for(const V of RU.live)if(V.k==='granja'&&Math.abs(V.x-P.x)<300)ruFarmPhase(V);}
  for(const V of RU.live){const dx=V.x-P.x,dz=V.z-P.z;if(dx*dx+dz*dz>90*90)continue;const near=dx*dx+dz*dz<45*45,tt=t+V.ph;V.sT=(V.sT||0)-dt;const p=V.p[0],arm=p&&p.userData.arms&&p.userData.arms[1];
    if(V.k==='lenador'&&arm){const ph=(tt*0.75)%1;arm.rotation.x=ph<0.55?-2.7*ph/0.55:-2.7+2.7*Math.min(1,(ph-0.55)/0.1);p.rotation.x=ph>0.6&&ph<0.75?0.15:0.05;if(V.pp<0.65&&ph>=0.65&&near)gfAt(V.x,V.z,()=>ruSfx('chop'));V.pp=ph;}
    else if(V.k==='resinero'&&arm)arm.rotation.x=-1.25+0.15*Math.sin(tt*5);
    else if(V.k==='pajarero'&&arm)arm.rotation.x=-0.8-0.3*(0.5+0.5*Math.sin(tt*0.35));
    else if(V.k==='rizotomo'&&arm)arm.rotation.x=-0.7+0.35*Math.sin(tt*3.5);
    else if(V.k==='apicultor'){if(arm)arm.rotation.x=-1+0.2*Math.sin(tt*1.3);if(near&&Math.random()<dt*4)pfx(V.x+(Math.random()-0.5)*3,terrainH(V.x,V.z)+0.8+Math.random(),V.z+(Math.random()-0.5)*3,{col:'#2a2010',vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5),vz:(Math.random()-0.5)*2,g:0,life:1,s:0.05,a:1});
      if(near&&Math.random()<dt*3)pfx(p.position.x,p.position.y+1.1,p.position.z,{col:'#cfc8bc',vx:(Math.random()-0.5)*0.4,vy:0.5,vz:(Math.random()-0.5)*0.4,g:-0.2,life:2,s:0.25,grow:1.5,a:0.35});if(near&&V.sT<=0){V.sT=6+Math.random()*6;gfAt(V.x,V.z,()=>ruSfx('buzz'));}}
    else if(V.k==='canteros'){for(let i=0;i<V.p.length;i++){const q=V.p[i],a2=q.userData.arms&&q.userData.arms[1];if(!a2)continue;const ph=(tt*0.9+i*0.5)%1;a2.rotation.x=ph<0.6?-2.2*ph/0.6:-2.2+2.2*Math.min(1,(ph-0.6)/0.08);if(i===0){if(V.pp<0.68&&ph>=0.68&&near)gfAt(V.x,V.z,()=>ruSfx('clink'));V.pp=ph;}}}
    else if(V.k==='lavanderas'){for(let i=0;i<V.p.length;i++){const q=V.p[i],a2=q.userData.arms;if(!a2)continue;const ph=(tt*0.8+i*0.45)%1,v=ph<0.6?-1.9*ph/0.6:-1.9+1.9*Math.min(1,(ph-0.6)/0.1);a2[0].rotation.x=a2[1].rotation.x=v;if(i===0){if(V.pp<0.7&&ph>=0.7&&near)gfAt(V.x,V.z,()=>ruSfx('slap'));V.pp=ph;}}}
    else if(V.k==='purpurero'&&arm)arm.rotation.x=-0.8+0.3*Math.sin(tt*2.5);
    else if(V.k==='altar'&&p&&p.userData.arms){const v=-2.3+0.12*Math.sin(tt*0.8);p.userData.arms[0].rotation.x=v;p.userData.arms[1].rotation.x=v;}
    else if(V.k==='augur'&&arm){arm.rotation.x=-2.2+0.4*Math.sin(tt*0.25);p.rotation.y=V.g.rotation.y+0.6*Math.sin(tt*0.12);}
    else if(V.k==='mendigo'&&arm)arm.rotation.x=-0.9+0.1*Math.sin(tt*1.5);
    else if(V.k==='pastor'){if(arm)arm.rotation.x=-0.3;for(const o of V.an){const ang=(o.a0||0)+Math.sin(tt*0.04+o.i)*0.9+tt*0.01,r=o.r||4,ax=V.x+Math.cos(ang)*(r+3),az=V.z+Math.sin(ang)*(r+3),G=o.A?o.A.g:o.B;
        G.position.set(ax,terrainH(ax,az),az);G.rotation.y=-ang+(o.i%2?0.4:-0.4);if(o.A&&o.A.head)o.A.head.rotation.x=0.4*Math.max(0,Math.sin(tt*0.7+o.i*1.7));}
      if(near&&V.sT<=0){V.sT=22+Math.random()*20;gfAt(V.x,V.z,()=>ruSfx('syrinx'));if(arm)arm.rotation.x=-1.4;}}
    else if(V.k==='cazador'){const ang=tt*0.12,cx=V.x+Math.cos(ang)*7,cz=V.z+Math.sin(ang)*7;p.position.set(cx,terrainH(cx,cz),cz);p.rotation.y=-ang+Math.PI;personWalk(p,tt*4.6,1);
      for(const o of V.an){const a2=ang-0.25-o.i*0.18,dx2=V.x+Math.cos(a2)*(7.8+o.i),dz2=V.z+Math.sin(a2)*(7.8+o.i);o.A.g.position.set(dx2,terrainH(dx2,dz2)+Math.abs(Math.sin(tt*9+o.i))*0.04,dz2);o.A.g.rotation.y=-a2+Math.PI;if(o.A.tail)o.A.tail.rotation.y=0.4*Math.sin(tt*12);}}
    else if(V.k==='granja'){const f=V.fase,[a,b,d]=V.p;const sw=(q,sp,amp,base)=>{const ar=q.userData.arms;if(ar&&q.visible)ar[1].rotation.x=(base||-1)+amp*Math.sin(tt*sp+q.position.x);};
      if(f==='oliva'){for(const q of[a,b]){const ar=q.userData.arms;if(ar){const v=-2.5+0.6*Math.sin(tt*4+q.position.x);ar[0].rotation.x=ar[1].rotation.x=v;}}sw(d,3,0.3,-0.6);}
      else if(f==='poda'||f==='cava'){sw(a,3,0.4);sw(b,2.6,0.4);}else if(f==='siega'){sw(a,3.2,0.6,-0.5);sw(b,3,0.6,-0.5);sw(d,3.4,0.6,-0.5);}
      else if(f==='trilla'){const c0=Math.cos(V.g.rotation.y),s0=Math.sin(V.g.rotation.y);V.oxen.forEach((o,i)=>{const an=tt*0.35+i*0.5,lx=Math.cos(an)*3.3,lz=Math.sin(an)*3.3;o.position.set(lx,V.era.position.y-0.08,lz);o.rotation.y=-an;});a.rotation.y=V.g.rotation.y-tt*0.35+Math.PI/2;
        sw(b,2.2,0.9,-1.8);if(near&&Math.random()<dt*3){const wx=b.position.x,wz=b.position.z;pfx(wx,b.position.y+2.2,wz,{col:'#e0cc90',vx:(Math.random()-0.5)*1.5+1,vy:0.4,vz:(Math.random()-0.5)*1.5,g:1,life:1.5,s:0.12,a:0.8});}}
      else{sw(a,2.5,0.4,-0.9);sw(b,2.3,0.4,-0.9);d.position.y=terrainH(d.position.x,d.position.z)+0.6+Math.abs(Math.sin(tt*3))*0.15;}}
    else if(V.k==='barquero'){const F=V.f,cyc=26,u=(tt%cyc)/cyc,k=u<0.4?u/0.4:u<0.5?1:u<0.9?1-(u-0.5)/0.4:0,e=k*k*(3-2*k),bx=F.A[0]+(F.B[0]-F.A[0])*e,bz=F.A[1]+(F.B[1]-F.A[1])*e;V.g.position.set(bx,F.w-0.05,bz);V.g.rotation.y=Math.atan2(F.B[0]-F.A[0],F.B[1]-F.A[1]);V.pole.rotation.x=0.35+0.25*Math.sin(tt*1.6);}}
  // caminantes
  for(const m of RU.mov){const dx=m.p.position.x-P.x,dz=m.p.position.z-P.z,d2=dx*dx+dz*dz;if(d2>300*300){m.p.visible=false;continue;}m.p.visible=true;const Lt=m.L[m.L.length-1];m.s+=m.dir*m.sp*dt;if(m.s>Lt){m.s=Lt;m.dir=-1;}if(m.s<0){m.s=0;m.dir=1;}
    let i=1;while(i<m.L.length-1&&m.L[i]<m.s)i++;const a=m.P[i-1],b=m.P[i],u=(m.s-m.L[i-1])/((m.L[i]-m.L[i-1])||1),x=a[0]+(b[0]-a[0])*u,z=a[1]+(b[1]-a[1])*u;m.p.position.set(x,terrainH(x,z),z);m.p.rotation.y=Math.atan2((b[0]-a[0])*m.dir,(b[1]-a[1])*m.dir);
    m.ph+=m.sp*dt*(m.kind==='hemerodromo'?2.6:4.6);personWalk(m.p,m.ph,m.kind==='hemerodromo'?1.5:1);if(m.kind==='hemerodromo')m.p.rotation.x=0.12;
    if(d2<49&&!state.seen['ru:'+m.kind]&&ui==='play'){state.seen['ru:'+m.kind]=1;const T=RU_ROAD[m.kind];toast('<span class="label">Fíjate · '+T[0]+'</span><br>'+T[1]);}}}
// ---- hablar con ellos
function ruAct(o){const ro=MODE==='roma',[,k,ix]=String(o.act).split(':'),V=RU.live[+ix],seen=state.seen;
  if(k==='granja'){const f=V?V.fase:ruFase(),T=RU_FARM[ro?'r':'a'][f];const nm={oliva:'la aceituna',poda:'la poda',cava:'la cava',siega:'la siega',trilla:'la trilla',vendimia:'la vendimia'}[f];
    if(!seen['ruk:granja:'+f]){seen['ruk:granja:'+f]=1;qAdd('so',1,'Aprendes cómo se trabaja el campo.');save();}return vmS('❦',ro?'Una granja':'Una granja','ahora toca '+nm,'<p>«'+T[0]+'»</p><p class="sub">'+T[1]+'</p>',[vmBye]);}
  const T=RU_TX[k]&&(RU_TX[k][ro?'r':'a']||RU_TX[k].a);if(!T)return;let extra='';
  if(k==='pastor'&&V&&V.I&&V.I.id==='clitumno')extra='<p>«Estos bueyes blancos son los del Clitumno: dicen que el agua del río los vuelve blancos, y por eso los prefieren para los sacrificios de los triunfos en Roma».</p><p class="sub">Virgilio, Geórgicas 2, 146-148.</p>';
  if(k==='pastor'&&V&&V.I&&V.I.id==='soracte')extra='<p class="sub">En este monte, las familias de los Hirpi Sorani caminan descalzas sobre las brasas en la fiesta de Apolo sin quemarse (Plinio, Historia natural 7, 19).</p>';
  if(k==='rizotomo'&&V&&V.I&&V.I.id==='tempe')extra='<p class="sub">Tesalia tiene fama de tierra de hechiceras y de hierbas poderosas.</p>';
  if(!seen['ruk:'+k]){seen['ruk:'+k]=1;qAdd('so',1,'Aprendes un oficio del campo.');save();}
  const B=[];const mon=ro?'as':'óbolo';
  if(k==='barquero'&&V)B.push(['Cruzar el río (1 '+mon+')',()=>{if(state.obols<1){toast('No tienes ni un '+mon+'.');return;}state.obols-=1;updateStats();sfxCoin();closeDialog();const F=V.f,dA=Math.hypot(player.x-F.A[0],player.z-F.A[1]),dB=Math.hypot(player.x-F.B[0],player.z-F.B[1]),D=dA<dB?F.B:F.A;player.x=D[0];player.z=D[1];player.feet=floorAt(D[0],D[1]);player.camY=player.feet+player.eye;toast('El barquero te deja en la otra orilla.');},'quiz']);
  if(k==='mendigo')B.push(['Darle una moneda (1 '+mon+')',()=>{if(state.obols<1){toast('No tienes ni un '+mon+'.');return;}state.obols-=1;updateStats();sfxCoin();const d=state.day||1;if(seen['rumend']!==d){seen['rumend']=d;qAdd('eu',1,ro?'La piedad también es con los pobres.':'Zeus Hospitalario lo ve.');}save();$('dBody').innerHTML='<p>«¡Que los dioses te lo paguen!»</p>';},'quiz']);
  B.push(vmBye);return vmS('❦',T[0],T[1],'<p>'+T[2]+'</p>'+extra+'<p class="sub">'+T[3]+'</p>',B);}
{const e0=egxAct0;egxAct0=function(o){if(String(o.act).startsWith('ru:'))return ruAct(o);return e0.apply(this,arguments);};}
