// ============================================================ PREMIOS DE LOS PORTALES DE LEYENDA (23/11)
//  1. El cielo de los monstruos: cada leyenda vencida enciende en el cielo de noche (212, estrellas reales) su constelación, en dorado,
//     si el mito la llevó al cielo (catasterismo): el León, la Hidra, el Dragón (Ladón), la Ballena (el ceto), Pegaso, el Toro, el
//     Centauro, Perseo y la cabeza de Medusa (Algol), Andrómeda, el Can Mayor (Lélape), Ofiuco y la Serpiente (Asclepio), la Lira, el Águila
//     (las aves del Estínfalo), la Corona de Ariadna, Aries (el carnero del vellocino) y Heracles. Las demás, una estrella. Con todas, una
//     estrella nueva con tu nombre. Fuentes: Pseudo-Eratóstenes, Catasterismos; Higino, Astronomía II; Arato, Fenómenos (anacronismo
//     señalado en el modo Atenas: son recopilaciones posteriores al 386 a.C., aunque muchas historias ya se contaban).
//  2. Título: Kallínikos, «el de la bella victoria», el epíteto de Heracles (Arquíloco, fr. 324; Píndaro, Olímpica IX 1-4); en Roma,
//     Victor, como el Hércules Vencedor del Foro Boario. Al vencer los trabajos de Heracles.
//  3. Olimpia: con los trabajos vencidos, los sacerdotes del templo de Zeus te enseñan las doce metopas de los trabajos (h. 460 a.C.;
//     Pausanias V 10,9). En Roma: el Ara Máxima de Hércules, junto al templo de Hércules Vencedor (Livio I 7,10-14).
//  4. El bestiario de tu casa: una figurilla de terracota por leyenda vencida, en un estante (las figurillas votivas de barro eran la
//     ofrenda más común en los santuarios). Al acercarte (E), su ficha.
//  5. Pestaña «Leyendas» en el diario: todas, con su estado, constelación y récord.
const PREM={said:{},figs:null,last:''};
const PREM_LAB=['leon','hidra','cierva','jabali','aves','toro','yeguas','gerion','ladon','cerbero'];
const PREM_NOT=['diomedes','argiripa','ortro'];
function premAll(){const ro=MODE==='roma',S=new Set();for(const[,k]of LEY_DEST[ro?'roma':'atenas'])S.add(k);if(ro){S.add('caco');for(const k of LEY_HER)S.add(k);}else S.add('minotauro');
  return [...S].filter(k=>LEG[k]&&!PREM_NOT.includes(k));}
function premWon(k){try{return !!(leyz()[k]&&leyz()[k].won);}catch(e){return false;}}
function premz(){const z=x4z();z.prem=z.prem||{lit:[]};return z.prem;}
// constelaciones (nombres de estrellas del catálogo de 212); l: líneas, p: estrellas sueltas
const PREM_CAT={leon:['El León',[['Regulus','Algieba'],['Algieba','Denebola'],['Denebola','Regulus']],'Zeus lo puso en el cielo por ser el rey de las fieras (Catasterismos 12).'],
 hidra:['La Hidra',[],'Su estrella más brillante es Alfard, «la solitaria».',['Alphard']],ladon:['El Dragón',[['Thuban','Eltanin']],'Hera puso en el cielo a la serpiente que guardaba sus manzanas (Catasterismos 3).'],
 ketos_troya:['La Ballena (el ceto)',[['Menkar','Diphda']],'El monstruo marino de Andrómeda acabó entre las estrellas (Catasterismos 36).'],
 ketos_jope:['Andrómeda',[['Alpheratz','Mirach'],['Mirach','Almach']],'Atenea la puso en el cielo con los brazos extendidos, como estaba en la roca (Catasterismos 17).'],
 pegaso:['Pegaso',[['Markab','Scheat'],['Scheat','Alpheratz'],['Alpheratz','Algenib'],['Algenib','Markab']],'Subió al cielo tras derribar a Belerofonte (Catasterismos 18).'],
 toro:['El Toro',[['Aldebaran','Elnath']],'Se decía que era el toro de Europa, o el de Creta (Catasterismos 14).'],
 centauros:['El Centauro',[['Rigil Kentaurus','Hadar'],['Hadar','Menkent']],'Es Quirón, el centauro sabio, maestro de héroes (Catasterismos 40).'],
 medusa:['Perseo y la cabeza de Medusa',[['Mirfak','Algol']],'Algol, «la cabeza del demonio», es la cabeza de Medusa en la mano de Perseo; su brillo cambia cada pocos días.'],
 teumeso:['El Can Mayor (Lélape)',[['Sirius','Mirzam'],['Sirius','Adhara'],['Adhara','Wezen']],'Zeus subió al cielo al perro Lélape (Catasterismos 33).'],
 esculapio:['Ofiuco y la Serpiente',[['Rasalhague','Sabik']],'Asclepio con su serpiente, subido al cielo por Zeus (Catasterismos 6).',['Unukalhai']],
 sirenas:['La Lira',[['Vega','Sulafat'],['Sulafat','Sheliak'],['Sheliak','Vega']],'La lira de Orfeo, que cantó más fuerte que las Sirenas (Catasterismos 24).'],
 aves:['El Águila',[['Altair','Tarazed'],['Altair','Alshain']],'Una de las aves que, según algunos, Heracles espantó del Estínfalo (Higino II 15; lo más común es que sea el águila de Zeus).'],
 minotauro:['La Corona de Ariadna',[],'Dioniso puso en el cielo la corona de bodas de Ariadna (Catasterismos 5).',['Alphecca']],
 dragon_colquide:['El Carnero (Aries)',[],'El carnero del vellocino de oro (Catasterismos 19).',['Hamal']],
 cerbero:['Heracles',[],'El que está de rodillas: Heracles, en una de sus hazañas (Catasterismos 4).',['Rasalgethi']]};
function premSky(){const op=(typeof STARS!=='undefined'&&STARS.material)?STARS.material.opacity:0;if(op<0.02){if(PREM.lines)PREM.lines.visible=PREM.pts.visible=false;if(PREM.me)PREM.me.visible=false;return;}
  if(!PREM.lines){PREM.lines=new THREE.LineSegments(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:'#ffd27a',transparent:true,opacity:0,fog:false,depthWrite:false}));PREM.lines.frustumCulled=false;scene.add(PREM.lines);
    PREM.pts=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:'#ffe2a0',size:5,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));PREM.pts.frustumCulled=false;scene.add(PREM.pts);}
  PREM.t=(PREM.t||0)-1;if(PREM.t<=0){PREM.t=6;let S;try{S=gqStarPos();}catch(e){return;}const L=[],Pp=[],names=Object.keys(S);
    for(const k of premAll()){if(!premWon(k))continue;const C=PREM_CAT[k];if(C){for(const[a,b]of C[1])if(S[a]&&S[b])L.push(...S[a].slice(0,3),...S[b].slice(0,3));for(const[a]of C[1].concat((C[3]||[]).map(x=>[x])))if(S[a])Pp.push(...S[a].slice(0,3));}
      else{const n=names[Math.floor(hash(k.length*7.3,k.charCodeAt(0)*1.7)*names.length)];if(S[n])Pp.push(...S[n].slice(0,3));}}
    PREM.lines.geometry.setAttribute('position',new THREE.Float32BufferAttribute(L,3));PREM.pts.geometry.setAttribute('position',new THREE.Float32BufferAttribute(Pp,3));
    if(premz().star&&S.Alderamin){if(!PREM.me){PREM.me=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:'#fff4c8',transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));PREM.me.scale.set(90,90,1);scene.add(PREM.me);
        PREM.meL=labelSprite(premz().star,'tu estrella',false);PREM.meL.scale.multiplyScalar(40);scene.add(PREM.meL);}PREM.meP=S.Alderamin.slice(0,3);}}
  PREM.lines.visible=PREM.pts.visible=true;PREM.lines.position.copy(camera.position);PREM.pts.position.copy(camera.position);PREM.lines.material.opacity=op*0.8;PREM.pts.material.opacity=op;
  if(PREM.me&&PREM.meP){PREM.me.visible=PREM.meL.visible=true;PREM.me.position.set(camera.position.x+PREM.meP[0]*0.98+120,camera.position.y+PREM.meP[1]*0.98,camera.position.z+PREM.meP[2]*0.98);PREM.me.material.opacity=op*(0.8+0.2*Math.sin(performance.now()/300));
    PREM.meL.position.copy(PREM.me.position);PREM.meL.position.y+=70;PREM.meL.material.opacity=op;}}
// avisos al vencer, título, la estrella final
function premCheck(){const all=premAll(),won=all.filter(premWon),z=premz(),ro=MODE==='roma';
  for(const k of won){if(z.lit.includes(k))continue;z.lit.push(k);save();const C=PREM_CAT[k];
    toast('<span class="label">'+(C?'Se enciende una constelación: '+C[0]:'Una estrella nueva en el cielo')+'</span><br>'+(C?C[2]:'La leyenda de '+LEG[k].title()+' ya brilla de noche.')+' Mírala esta noche; y en tu casa tienes su figurilla.');}
  const lab=PREM_LAB.filter(k=>all.includes(k));if(!z.title&&lab.length&&lab.every(premWon)){z.title=ro?'Victor':'Kallínikos';save();try{qAdd('ar',3,'Te llaman '+z.title+'.');}catch(e){}
    int2Dlg('Η',ro?'Hércules':'Heracles',ro?'Victor':'Kallínikos, «el de la bella victoria»','<p>Has terminado todos los trabajos que tienen portal. '+(ro?'En Roma te llamarán <b>Victor</b>, como al Hércules Vencedor del Foro Boario. Ve al Ara Máxima, junto a su templo: los sacerdotes te esperan.':'Los griegos llamaban así a Heracles: <b>Kallínikos</b> (Arquíloco; Píndaro, Olímpica IX). Ve a Olimpia: en el templo de Zeus, los sacerdotes te enseñarán las doce metopas de los trabajos.')+'</p>');
    try{rwDiscover('Título: '+z.title,'has vencido los trabajos de Heracles');}catch(e){}}
  if(!z.star&&all.length&&all.every(premWon)){const nm=(state.pj&&state.pj.name)||'Sin nombre';z.star='La estrella de '+nm;save();PREM.t=0;
    int2Dlg('★',ro?'Iuppiter':'Zeus','El cielo de los monstruos','<p>Has vencido todas las leyendas sin herir a nadie. '+(ro?'Júpiter':'Zeus')+' hace lo que hacía con los héroes y las criaturas de los mitos: te pone en el cielo. Esta noche, cerca del polo, brilla <b>'+z.star+'</b>, entre el Dragón, Pegaso y Andrómeda.</p><p class="sub">A esto los griegos lo llamaban catasterismo, «ponerse entre los astros». Lo recogen el Pseudo-Eratóstenes (Catasterismos) e Higino (Astronomía II).'+(ro?'':' Son recopilaciones posteriores al 386 a.C. (anacronismo señalado), aunque muchas de estas historias ya se contaban.')+'</p>');
    try{rwDiscover(z.star,'una estrella con tu nombre');}catch(e){}}}
// las metopas de Olimpia / el Ara Máxima
const PREM_METOPAS=['El león de Nemea: un Heracles joven y cansado, con el león muerto a los pies; Atenea y Hermes miran.','La Hidra de Lerna.','Las aves del Estínfalo: Heracles se las presenta a Atenea, sentada en una roca.','El toro de Creta: Heracles lo sujeta en diagonal; la composición más famosa.','La cierva de Cerinea: Heracles le apoya la rodilla en el lomo.','La reina de las Amazonas, Hipólita, y su cinturón.',
  'El jabalí de Erimanto: Euristeo se esconde en la tinaja de bronce.','Las yeguas de Diomedes.','Gerión, con sus tres cuerpos.','Atlas trae las manzanas de las Hespérides mientras Heracles sostiene el cielo, con Atenea ayudándole.','Cerbero, sacado del Hades.','Los establos de Augías: Heracles, con Atenea, abre el paso a los ríos.'];
function premOlimpia(){const z=premz(),ro=MODE==='roma';if(!z.title||z.olim)return;const P=PLACES.find(p=>p.id===(ro?'ro_hercules':'zeus_olimpia'));if(!P||Math.hypot(player.x-P.x,player.z-P.z)>45||ui!=='play')return;z.olim=1;save();
  if(!ro)int2Dlg('Ζ','Los sacerdotes de Zeus','Las metopas de los doce trabajos','<p>«Tú eres quien ha vencido a las criaturas sin matarlas. Mira arriba, sobre las columnas del pronaos y del opistodomo: seis metopas en cada lado, los doce trabajos de Heracles, esculpidas hace unos setenta años.»</p><ol>'+PREM_METOPAS.map(m=>'<li>'+m+'</li>').join('')+'</ol><p class="sub">Pausanias V 10,9 las describe; hoy se conservan en el Museo de Olimpia y en el Louvre. Es la primera vez que aparecen juntos los doce trabajos tal como luego se fijaron.</p>');
  else int2Dlg('H','Los sacerdotes de Hércules','El Ara Máxima','<p>«Aquí, según la tradición, el propio Hércules fundó su altar después de vencer a Caco. Los Potitios y los Pinarios, dos familias, guardaban su culto; desde hace siglos lo atienden esclavos públicos. Ofrécele el diezmo, como hacen los comerciantes del Foro Boario, y entra con la cabeza descubierta, a la manera griega.»</p><p class="sub">Livio I 7,10-14; Virgilio, Eneida VIII 268-305; Dionisio de Halicarnaso I 40. Las mujeres no podían participar en este culto.</p>');
  try{qAdd('so',2,'Has visto los trabajos de Heracles en piedra.');}catch(e){}}
// el bestiario de la casa: figurillas de terracota
const PREM_FIG={leon:'CR_leon',aves:'CR_ave',minotauro:'CR_mino',cierva:'CR_cierva',jabali:'CR_jabali',cromion:'CR_jabali',calidon:'CR_jabali',toro:'CR_toro',toros_bronce:'CR_toro',yeguas:'CR_yegua',cerbero:'CR_cerbero',gerion:'CR_ortro',ladon:'CR_ladon',
  medusa:'CR_gorgona',quimera:'CR_quimera',pegaso:'CR_pegaso',esfinge:'CR_esfinge',teumeso:'CR_zorra',centauros:'CR_centauro',grifos:'CR_grifo',harpias:'CR_arpia',sirenas:'CR_arpia',triton:'CR_triton',escion:'CR_tortuga',
  ketos_troya:'CR_serp',ketos_jope:'CR_serp',dragon_ares:'CR_serp',dragon_colquide:'CR_serp',piton:'CR_serp',equidna:'CR_serp',laocoonte:'CR_serp',bagradas:'CR_serp',esculapio:'CR_serp'};
const PREM_TERRA=new THREE.MeshLambertMaterial({color:'#b8683e'});
function premFig(k){let o=null;const n=PREM_FIG[k];if(n&&typeof crbPart==='function')o=crbPart(n);
  if(!o){o=makePerson({noVary:true,noBlender:true,chiton:'#b8683e',short:true,noHimation:true});}
  o.traverse(m=>{if(m.isMesh){m.material=PREM_TERRA;m.castShadow=false;}if(m.isSprite)m.visible=false;});o.position.set(0,0,0);o.updateMatrixWorld(true);
  const b=new THREE.Box3().setFromObject(o),s=new THREE.Vector3();b.getSize(s);const k2=0.32/Math.max(s.x,s.y,s.z,0.01);o.scale.multiplyScalar(k2);o.position.y=-b.min.y*k2;const g=new THREE.Group();g.add(o);return g;}
function premShelf(){if(!CASA.X||typeof CASA.Y==='undefined')return;const keys=premAll().filter(premWon),sig=keys.join(',')+'|'+(CRB&&CRB.tpl?1:0)+(CRB&&CRB.tpl2?1:0);if(PREM.figs&&PREM.sig===sig)return;PREM.sig=sig;
  if(PREM.figs){scene.remove(PREM.figs);}const g=new THREE.Group();g.position.set(CASA.X-9,CASA.Y,CASA.Z-14.5);scene.add(g);PREM.figs=g;const wd=lam('#6a4a30');
  for(let r=0;r<4;r++){const sh=new THREE.Mesh(new THREE.BoxGeometry(5.2,0.06,0.42),wd);sh.position.set(0,0.5+r*0.55,0);g.add(sh);}
  keys.forEach((k,i)=>{const f=premFig(k),r=Math.floor(i/13),c=i%13;f.position.set(-2.4+c*0.4,0.53+r*0.55,0);f.rotation.y=0.3;g.add(f);});
  if(!CASA.objs.some(o=>o.act==='bestiario')){const lb=labelSprite('El bestiario','figurillas de terracota de tus leyendas',false);lb.position.set(0,2.9,0.5);lb.visible=false;g.add(lb);CASA.objs.push({kind:'hogar',act:'bestiario',x:CASA.X-9,z:CASA.Z-13.6,lb,r:2.6,data:{name:'El bestiario',role:''}});}}
function premHTML(){const all=premAll(),z=premz(),ro=MODE==='roma';let won=0;const rows=all.map(k=>{const w=premWon(k);if(w)won++;const C=PREM_CAT[k],zz=legZ(k);
    return '<tr><td>'+(w?'✓':'·')+'</td><td>'+LEG[k].title()+'</td><td>'+(C?C[0]:(w?'una estrella':'—'))+'</td><td>'+(zz.won?'vencida '+zz.won+'×':zz.best?'récord '+zz.best:'')+'</td></tr>';}).join('');
  return '<p><b>'+won+' de '+all.length+'</b> leyendas vencidas en '+(ro?'el modo Roma':'el modo Atenas')+'.'+(z.title?' Te llaman <b>'+z.title+'</b>.':' Al vencer los trabajos de '+(ro?'Hércules':'Heracles')+', un título.')+(z.star?' En el cielo brilla <b>'+z.star+'</b>.':' Con todas, una estrella con tu nombre.')+'</p>'+
    '<p class="sub">Los portales se abren al huir del laberinto de Cnosos con las alas; cada uno está en su destino. De noche, mira el cielo: las constelaciones de las que venzas se ven en dorado. En tu casa, el estante del bestiario.</p><table class="ley">'+rows+'</table>';}
if(typeof X4_TABS!=='undefined')X4_TABS.leyendas={n:'Leyendas',h:premHTML};
{const f=hogarAct;hogarAct=function(o){if(o&&o.act==='bestiario'){int2Dlg('☘','El bestiario','Tus leyendas',premHTML());return;}return f.apply(this,arguments);};}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(!state||ui==='start')return r;PREM.a=(PREM.a||0)+dt;premSky();if(PREM.a>2){PREM.a=0;premCheck();premOlimpia();if(Math.abs(player.feet-CASA.Y)<40)premShelf();}}catch(e){if(!PREM.err){PREM.err=String(e).slice(0,200);console.warn('premios',e);}}return r;};}
