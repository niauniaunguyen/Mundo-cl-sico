// ============================================================ LA CATÁBASIS: BAJAR AL HADES (rogue-like) (24/11)
// Por el portal del cabo Ténaro (Atenas) o de Cumas, junto al lago Averno (Roma), una vez vencido Cerbero en su leyenda.
// Tres mapas de 20 salas: el Érebo (la bajada), los Ríos (Aqueronte, Estigia, Cocito, Flegetonte, Lete) y el Tártaro. Cada sala es una
// prueba al estilo de los portales de leyenda, con criaturas combinadas al azar: reúne los orbes y no dejes que te alcancen. Nadie sale
// herido: aquí también se esquiva y se para con el escudo. La vida se conserva de sala en sala.
//  · Tras cada sala eliges entre dos puertas: un don de un dios (uno de tres), óbolos, granos de granada, una fuente que cura o una sala
//    de élite (más difícil, más premio). Con los óbolos, Caronte vende remedios en algunas salas.
//  · Sala 10: un jefe intermedio; sala 20: un jefe con fases. Érebo: Medusa / Cerbero. Ríos: Equidna / las Erinias. Tártaro: los de cien
//    brazos / Tifón.
//  · Si te alcanzan del todo, las sombras te devuelven arriba: ganas granos de granada según lo lejos que hayas llegado. En el altar de
//    Perséfone (al entrar) se cambian por mejoras permanentes. La granada: Perséfone comió sus granos en el Hades y tuvo que volver cada
//    año (Himno homérico a Deméter 371-374 y 411-413).
//  · Si superas los tres mapas, Caronte te lleva en su barca al Inframundo (255).
const CATA={run:null,mechs:[],deco:null,R:null};
const CATA_MAPS=[{n:'El Érebo',g:'ΕΡΕΒΟΣ',c1:'#2e2a33',c2:'#1f1c24',pool:['empusa','harpias','ortro','polifemo','lestrigones','escion'],mini:['medusa'],boss:['cerbero','empusa'],
    bn:'Cerbero, el guardián',bt:'Cerbero no deja salir a nadie del Hades; aquí, además, las sombras cruzan la sala. Aguanta: es la puerta de abajo.'},
  {n:'Los ríos del Hades',g:'ΣΤΥΞ',c1:'#1f2c36',c2:'#151d24',pool:['caribdis','piton','laocoonte','sirenas','harpias','dragon_ares'],mini:['equidna'],boss:['erinias','harpias','piton'],
    bn:'Las Erinias',bt:'Las diosas de la venganza vigilan los ríos; con ellas vuelan las Keres. No tienen nada contra ti: solo pon a prueba tu paso.'},
  {n:'El Tártaro',g:'ΤΑΡΤΑΡΟΣ',c1:'#3a2620',c2:'#24170f',pool:['gigantes','hecatonquiros','talos','quimera','escila','ciclopes'],mini:['hecatonquiros','gigantes'],boss:['tifon','escila'],
    bn:'Tifón, encadenado',bt:'El más terrible de los hijos de la Tierra, vencido por Zeus, se revuelve en el fondo del Tártaro (Hesíodo, Teogonía 820-868).'}];
const CATA_NOQUIZ={esfinge:1,erinias:1};
const CATA_BOONS=[['hermes','Hermes','vas un 12 % más deprisa'],['atenea','Atenea','el escudo aguanta más y se recupera antes'],['artemis','Ártemis','cada sala pide 2 orbes menos'],
  ['demeter','Deméter','curas 1 y ganas 1 de vida máxima'],['hefesto','Hefesto','piel de bronce: el primer golpe de cada sala no cuenta'],['hipnos','Hipnos','las criaturas van un 12 % más despacio'],
  ['dioniso','Dioniso','recoges los orbes desde más lejos'],['nyx','Nix','tras un golpe, eres intocable más tiempo'],['persefone','Perséfone','cada sala te da 1 grano de granada más'],['hecate','Hécate','los avisos duran más: las criaturas tardan en empezar']];
const CATA_UP=[['vida','Vida','+1 de vida máxima',3,[4,8,14]],['escudo','Escudo de bronce','el escudo dura y se recupera más',3,[3,6,10]],['paso','Paso ligero','+5 % de velocidad',3,[3,6,10]],
  ['bolsa','Bolsa de óbolos','empiezas con 8 óbolos más',3,[2,4,7]],['iman','Mano de Hermes','recoges los orbes desde un poco más lejos',2,[4,9]],['asclepio','Mano de Asclepio','una vez por bajada, vuelves con 1 de vida',1,[15]],
  ['hecateP','Antorcha de Hécate','las criaturas tardan un poco más en atacar',3,[4,8,12]]];
function cataz(){if(!state.cata||typeof state.cata!=='object')state.cata={granos:0,up:{},runs:0,best:0,done:0};return state.cata;}
function cataLv(k){return cataz().up[k]||0;}
function cataRng(){return Math.random();}
function cataPick(a){return a[Math.floor(Math.random()*a.length)];}
// ---- el escenario (se reutiliza la sala; cada mapa cambia los colores y los adornos)
LEG.cata={title:()=>MODE==='roma'?'El descenso al Orco':'La bajada al Hades',rule:'',lose:'',win:'',myth:'',
  build(){const R=legArena('cata','#2e2a33','#1f1c24');INT2_ZN.cata=['La entrada del Hades','ΚΑΤΑΒΑΣΙΣ','Odisea XI; Aristófanes, Ranas; Platón, Fedón 112-114'];CATA.R=R;return R;},
  reset(){},tick(dt,t,act){cataTick(dt,t,act);},hitTest(P){return cataHit(P);},orbOk:(x,z)=>{for(const m of CATA.mechs)if(m.o.orbOk&&!m.o.orbOk(x,z))return false;return true;}};
LEY_ROOMS.push('cata');LEY_DEST.atenas.push(['tenaro','cata']);LEY_DEST.roma.push(['cumae','cata']);
function cataDeco(mapI){const R=CATA.R;if(!R)return;if(CATA.deco)R.g.remove(CATA.deco);const M=CATA_MAPS[mapI],g=new THREE.Group();R.g.add(g);CATA.deco=g;
  const fl=new THREE.Mesh(new THREE.CircleGeometry(LEY_RA+0.9,48),lam(M.c1));fl.rotation.x=-Math.PI/2;fl.position.y=0.02;g.add(fl);
  const rm=lam(mapI===2?'#4a2a20':'#3a3640');for(let i=0;i<30;i++){const a=i/30*TAU,r=LEY_RA+2+Math.random()*10,s=2+Math.random()*4,k=new THREE.Mesh(new THREE.DodecahedronGeometry(s,1),rm);k.position.set(Math.cos(a)*r,s*0.4,Math.sin(a)*r);k.scale.y=1+Math.random()*1.5;g.add(k);}
  const col=['#6a8aff','#5ab0c8','#ff6a2a'][mapI];for(let i=0;i<12;i++){const a=i/12*TAU,f=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:col,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending,depthWrite:false}));f.scale.set(1.6,2.4,1);f.position.set(Math.cos(a)*(LEY_RA+1.5),1.3,Math.sin(a)*(LEY_RA+1.5));g.add(f);}
  if(mapI===1){const w=new THREE.Mesh(new THREE.RingGeometry(LEY_RA+1.2,LEY_RA+9,48),new THREE.MeshPhongMaterial({color:'#1c3a48',shininess:90}));w.rotation.x=-Math.PI/2;w.position.y=0.03;g.add(w);}
  if(mapI===2){for(let i=0;i<8;i++){const a=i/8*TAU,c=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,14,6),new THREE.MeshPhongMaterial({color:'#8a6a3a',shininess:60}));c.position.set(Math.cos(a)*(LEY_RA+6),7,Math.sin(a)*(LEY_RA+6));g.add(c);}}}   // las cadenas de bronce del Tártaro
// ---- las criaturas de cada sala: copias (Object.create) de las leyendas, con sus piezas apuntadas para quitarlas luego
function cataMechAdd(src,lvl){const R=CATA.R,L=LEG[src];if(!L||!L.reset)return;const o=Object.create(L);for(const k of['lion','U','G','D','S','F','A','P','E','T','W','H','mares','marks','dog','birds','glow','cones','fires','smoke','giant','cows','heads'])if(Object.prototype.hasOwnProperty.call(L,k))o[k]=undefined;
  const n0=R.g.children.length;try{o.reset(R);}catch(e){console.warn('cata',src,e);}const added=R.g.children.slice(n0);
  if(o.onOrb&&!CATA_NOQUIZ[src])for(let i=1;i<=lvl;i++)try{o.onOrb.call(o,i*4);}catch(e){}CATA.mechs.push({src,o,added});}
function cataClear(){const R=CATA.R;for(const m of CATA.mechs){for(const a of m.added)R.g.remove(a);for(const k of['lion','D','P','E','T','G','S'])try{const v=m.o[k];if(v&&v.g&&v.g.parent)v.g.parent.remove(v.g);else if(v&&v.isObject3D&&v.parent)v.parent.remove(v);}catch(e){}
    try{if(m.o.U)for(const u of m.o.U){const g=u.g||u;if(g&&g.parent)g.parent.remove(g);}}catch(e){}try{if(m.o.mares)for(const x of m.o.mares)x.M.g.parent&&x.M.g.parent.remove(x.M.g);}catch(e){}
    try{if(m.o.F)for(const f of m.o.F)f.g.parent&&f.g.parent.remove(f.g);}catch(e){}try{if(m.o.marks)for(const x of m.o.marks)x.m.parent&&x.m.parent.remove(x.m);}catch(e){}try{if(m.o.dog&&m.o.dog.lion)m.o.dog.lion.g.parent&&m.o.dog.lion.g.parent.remove(m.o.dog.lion.g);}catch(e){}}
  CATA.mechs=[];for(const s of LEY.shots)scene.remove(s.m);LEY.shots=[];for(const o of LEY.orbs)scene.remove(o.g);LEY.orbs=[];}
// ---- la bajada
function cataHasBoon(k){return CATA.run&&CATA.run.boons.includes(k);}
function cataNewRun(){const z=cataz();z.runs++;save();const hp=3+cataLv('vida')+(typeof heroHas==='function'&&heroHas('leon')?1:0);
  CATA.run={map:0,room:1,hp,maxHp:hp,obols:8*cataLv('bolsa'),boons:[],revive:cataLv('asclepio')>0,next:'prueba',elite:false,granosRun:0};}
function cataRoomType(){const r=CATA.run;if(r.room===20)return 'boss';if(r.room===10)return 'mini';return r.elite?'elite':'prueba';}
function cataSetup(){const r=CATA.run,M=CATA_MAPS[r.map],tp=cataRoomType();cataClear();cataDeco(r.map);const prog=r.room+r.map*20;
  if(tp==='boss'){r.bossPh=0;cataMechAdd(M.boss[0],2+r.map);LEY.GOAL=18;}
  else if(tp==='mini'){for(const s of M.mini)cataMechAdd(s,1+r.map);LEY.GOAL=14;}
  else{const n=tp==='elite'?3:(r.room>=14?2:r.room>=6?(Math.random()<0.6?2:1):1),pool=M.pool.slice().sort(()=>Math.random()-0.5);for(let i=0;i<n;i++)cataMechAdd(pool[i%pool.length],Math.floor(prog/8)+(tp==='elite'?2:0));LEY.GOAL=6+Math.floor(r.room/4)+r.map;}
  if(cataHasBoon('artemis'))LEY.GOAL=Math.max(3,LEY.GOAL-2);r.bronze=cataHasBoon('hefesto');
  LEY.n=0;LEY.hits=0;LEY.inv=0;LEY.won=false;LEY.on=true;LEY.grace=2.5+0.6*cataLv('hecateP')+(cataHasBoon('hecate')?1.2:0);LEY_SH.st=1;LEY_SH.tired=false;player.x=CATA.R.X;player.z=CATA.R.Z+10;player.yaw=0;
  if(tp==='boss')int2Dlg('Ϙ',M.bn,M.n+' · sala 20',`<p>${M.bt}</p><p><b>Reúne ${LEY.GOAL} orbes.</b> A los 6 y a los 12, la cosa se complica.</p>`);
  else if(tp==='mini')toast('<span class="label">'+M.n+' · sala 10</span><br>Una guardiana del camino te espera. Reúne '+LEY.GOAL+' orbes.');
  leyHud();}
// la primera sala: el altar de Perséfone y el comienzo
function cataAltar(onGo){const z=cataz(),ro=MODE==='roma',P=ro?'Proserpina':'Perséfone';
  const html='<p>Junto a la boca de la cueva hay un altar con granadas. Una voz de mujer, tranquila: «Soy '+P+'. Bajar es fácil; volver, no tanto. Cada vez que las sombras te devuelvan arriba, tráeme los granos de granada que encuentres y te daré algo para la próxima vez.»</p>'+
    '<p>Tienes <b>'+z.granos+'</b> granos de granada. Bajadas: '+z.runs+'. '+(z.best?'Lo más lejos que has llegado: '+cataBestTxt(z.best)+'.':'')+(z.done?' <b>Ya has llegado al fondo del Hades.</b>':'')+'</p>'+
    '<table class="ley">'+CATA_UP.map(([k,n,d,mx,c])=>{const lv=cataLv(k);return '<tr><td><b>'+n+'</b></td><td>'+d+'</td><td>'+lv+'/'+mx+'</td><td>'+(lv<mx?c[lv]+' granos':'—')+'</td></tr>';}).join('')+'</table>';
  int2Dlg('Π',P,'El altar de '+P,html);const box=$('dOpts');box.innerHTML='';let n=1;const add=(t,fn,dis)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(n++)+'</span><span>'+t+'</span>';if(dis)b.disabled=true;b.onclick=fn;box.appendChild(b);};
  add('Bajar al Hades',()=>{closeDialog();onGo();});
  for(const[k,nm,,mx,c]of CATA_UP){const lv=cataLv(k);if(lv>=mx)continue;add('Ofrecer '+c[lv]+' granos: '+nm,()=>{if(z.granos<c[lv]){toast('No tienes granos suficientes.');return;}z.granos-=c[lv];z.up[k]=lv+1;save();cataAltar(onGo);},z.granos<c[lv]);}
  if(z.done)add('Pedir a Caronte que te lleve directamente al Inframundo',()=>{closeDialog();cataLeave(true);});
  add('Volver arriba',()=>{closeDialog();cataLeave(false);});}
function cataBestTxt(b){return CATA_MAPS[Math.floor((b-1)/20)].n+', sala '+(((b-1)%20)+1);}
function cataLeave(toInf){CATA.run=null;cataClear();LEY.on=false;leyHud();INT2.busy=false;if(toInf&&typeof infTravel==='function'){INT2.in=null;infTravel();return;}int2Leave();}
// ---- al terminar una sala: dos puertas
const CATA_DOORS=[['don','Un don de los dioses','eliges uno de tres'],['obolos','Óbolos','para Caronte'],['granada','Granos de granada','para el altar de Perséfone'],['fuente','La fuente de Mnemósine','curas 1 de vida'],['elite','Una sala de élite','más difícil: don y óbolos al terminarla'],['tienda','La barca de Caronte','compra con óbolos']];
function cataDoors(){const r=CATA.run;let opts=CATA_DOORS.slice();if(r.hp>=r.maxHp)opts=opts.filter(o=>o[0]!=='fuente');if(r.room===9||r.room===19)opts=opts.filter(o=>o[0]!=='elite');opts.sort(()=>Math.random()-0.5);const two=opts.slice(0,2);
  int2Dlg('Ϙ',CATA_MAPS[r.map].n,'Sala '+r.room+' superada','<p>Delante, dos pasadizos. Sobre cada uno, una señal:</p>');const box=$('dOpts');box.innerHTML='';
  two.forEach(([k,n,d],i)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(i+1)+'</span><span><b>'+n+'</b> · '+d+'</span>';b.onclick=()=>{closeDialog();cataReward(k);};box.appendChild(b);});}
function cataReward(k){const r=CATA.run;r.elite=false;
  if(k==='don'){cataBoonPick(()=>cataGo());return;}
  if(k==='obolos'){const v=6+Math.floor(Math.random()*6)+r.map*3;r.obols+=v;toast('<span class="label">Óbolos</span><br>+'+v+' óbolos para Caronte.');}
  else if(k==='granada'){const v=1+r.map;cataz().granos+=v;r.granosRun+=v;save();toast('<span class="label">Granos de granada</span><br>+'+v+'. Perséfone los aceptará arriba.');}
  else if(k==='fuente'){r.hp=Math.min(r.maxHp,r.hp+1);toast('<span class="label">La fuente de Mnemósine</span><br>Bebes de la fuente de la Memoria, no del Lete: recuperas 1 de vida.');}
  else if(k==='elite'){r.elite=true;toast('<span class="label">Sala de élite</span><br>Más criaturas y más deprisa. Si la superas, un don y óbolos.');}
  else if(k==='tienda'){cataShop();return;}
  cataGo();}
function cataBoonPick(then){const r=CATA.run,av=CATA_BOONS.filter(b=>!r.boons.includes(b[0])||b[0]==='demeter').sort(()=>Math.random()-0.5).slice(0,3);
  int2Dlg('✦','Los dioses','Elige un don','<p>Tres dioses te ofrecen algo para el camino. Solo puedes aceptar uno.</p>');const box=$('dOpts');box.innerHTML='';
  av.forEach(([k,n,d],i)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(i+1)+'</span><span><b>'+n+'</b>: '+d+'</span>';b.onclick=()=>{closeDialog();if(k==='demeter'){r.maxHp++;r.hp=Math.min(r.maxHp,r.hp+1);}else r.boons.push(k);toast('<span class="label">Don de '+n+'</span><br>'+d+'.');then();};box.appendChild(b);});}
function cataShop(){const r=CATA.run,ro=MODE==='roma';int2Dlg('Χ',ro?'Charon':'Caronte','La barca de '+(ro?'Charon':'Caronte'),'<p>El barquero, viejo y sucio, te mira con desprecio. «Aquí nada es gratis. Tienes <b>'+r.obols+'</b> óbolos.»</p><p class="sub">En las Ranas de Aristófanes (139-140), Caronte cobra dos óbolos por el pasaje.</p>');
  const box=$('dOpts');box.innerHTML='';let n=1;const add=(t,c,fn)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(n++)+'</span><span>'+t+' · '+c+' óbolos</span>';if(r.obols<c)b.disabled=true;b.onclick=()=>{r.obols-=c;fn();cataShop();};box.appendChild(b);};
  add('Un trago de la fuente (cura 1)',6,()=>{r.hp=Math.min(r.maxHp,r.hp+1);});add('Una moneda para un dios (un don)',14,()=>{closeDialog();cataBoonPick(()=>cataShop());});add('Una vida más (máxima)',18,()=>{r.maxHp++;r.hp++;});
  const b=document.createElement('button');b.innerHTML='<span class="n">'+n+'</span><span>Seguir bajando</span>';b.onclick=()=>{closeDialog();cataGo();};box.appendChild(b);}
function cataGo(){const r=CATA.run;r.room++;if(r.room>20){r.room=1;r.map++;if(r.map>2){cataVictory();return;}
    int2Dlg('Ϙ',CATA_MAPS[r.map].n,'Más abajo',r.map===1?'<p>La cueva se abre a una orilla gris. Se oye agua: el Aqueronte, el Cocito, la Estigia… En el Fedón (112e-113c), Platón hace hablar a Sócrates de estos ríos que corren bajo la tierra.</p>':'<p>Las orillas se acaban en un abismo. El Tártaro está tan por debajo del Hades como el cielo por encima de la tierra: un yunque de bronce tardaría nueve días en caer hasta él (Hesíodo, Teogonía 720-725).</p>');
    const box=$('dOpts');box.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>Seguir</span>';b.onclick=()=>{closeDialog();cataSetup();};box.appendChild(b);return;}
  cataSetup();}
function cataVictory(){const z=cataz(),first=!z.done;z.done=1;z.granos+=10;z.best=60;save();cataClear();LEY.on=false;leyHud();const ro=MODE==='roma';
  int2Dlg('Χ',ro?'Charon':'Caronte','Has llegado al fondo','<p>Tifón se calma en sus cadenas. Detrás de ti suenan unos remos: '+(ro?'Charon':'Caronte')+' acerca su barca a la orilla. «Nadie vivo baja tan hondo. Sube: te llevo al otro lado. Allí está la casa de '+(ro?'Plutón':'Hades')+'.» Esta vez no te cobra.</p><p>+10 granos de granada.</p>'+(first?'<p><b>Se abre el Inframundo</b>: desde ahora, '+(ro?'Charon':'Caronte')+' te llevará allí desde el altar de la entrada.</p>':''));
  const box=$('dOpts');box.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>Subir a la barca</span>';b.onclick=()=>{closeDialog();cataLeave(true);};box.appendChild(b);
  try{qAdd('ar',4,'Has bajado al fondo del Hades.');rwDiscover('El Inframundo','has cruzado el Aqueronte en la barca de Caronte');}catch(e){}}
function cataDeath(){const r=CATA.run,z=cataz();if(r.revive){r.revive=false;r.hp=1;LEY.inv=2;toast('<span class="label">La mano de Asclepio</span><br>Cuando ya no podías más, vuelves en ti con 1 de vida.');return;}
  const prog=r.room+r.map*20,g=Math.max(1,Math.floor(prog/3))+r.map*2;z.granos+=g;if(prog>z.best)z.best=prog;save();LEY.on=false;cataClear();leyHud();
  int2Dlg('Π',MODE==='roma'?'Proserpina':'Perséfone','Las sombras te devuelven arriba','<p>Te alcanzan una vez más y todo se vuelve gris. Cuando abres los ojos, estás otra vez en la boca de la cueva, junto al altar.</p><p>Has llegado a <b>'+cataBestTxt(prog)+'</b>. Ganas <b>'+g+'</b> granos de granada'+(r.granosRun?' (más '+r.granosRun+' que ya llevabas)':'')+'.</p>');
  const box=$('dOpts');box.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>Ir al altar</span>';b.onclick=()=>{closeDialog();CATA.run=null;cataAltar(()=>{cataNewRun();cataSetup();});};box.appendChild(b);}
// ---- cada fotograma (con los dones)
function cataTick(dt,t,act){if(!CATA.run){return;}const r=CATA.run,slow=(cataHasBoon('hipnos')?0.88:1)*Math.pow(0.95,cataLv('hecateP'));
  for(const m of CATA.mechs){try{m.o.tick.call(m.o,dt*slow,t,act);}catch(e){if(!m.err){m.err=1;console.warn('cata',m.src,e);}}}
  // jefe: fases
  if(cataRoomType()==='boss'&&act){const M=CATA_MAPS[r.map];if(r.bossPh===0&&LEY.n>=6){r.bossPh=1;cataMechAdd(M.boss[1],2+r.map);toast('<span class="label">¡Segunda fase!</span><br>Algo más se une a la sala.');}
    else if(r.bossPh===1&&LEY.n>=12&&M.boss[2]){r.bossPh=2;cataMechAdd(M.boss[2],3+r.map);toast('<span class="label">¡Última fase!</span><br>Aguanta un poco más.');}else if(r.bossPh===1&&LEY.n>=12){r.bossPh=2;for(const m of CATA.mechs)if(m.o.onOrb&&!CATA_NOQUIZ[m.src])try{m.o.onOrb.call(m.o,16);}catch(e){}toast('<span class="label">¡Última fase!</span><br>Todo va más deprisa.');}}
  // imán de orbes
  const mag=0.7*cataLv('iman')+(cataHasBoon('dioniso')?1.4:0);if(mag>0)for(const o of LEY.orbs){if(Math.hypot(o.x-player.x,o.z-player.z)<1.3+mag){o.x=player.x;o.z=player.z;}}
  // escudo
  if(!LEY_SH.up)LEY_SH.st=Math.min(1,LEY_SH.st+dt*(0.06*cataLv('escudo')+(cataHasBoon('atenea')?0.12:0)));}
function cataHit(P){if(!CATA.run)return false;for(const m of CATA.mechs){try{if(m.o.hitTest&&m.o.hitTest.call(m.o,P))return true;}catch(e){}}return false;}
// ---- se enganchan a las leyendas: empezar, golpe, victoria, derrota, marcador
{const f=legStart;legStart=function(){if(LEY.kind!=='cata')return f.apply(this,arguments);leyReset();LEY.orbOk=LEG.cata.orbOk;LEY.on=false;legTouchBtns();
  ui='play';setTimeout(()=>{},0);if(!CATA.run)cataAltar(()=>{cataNewRun();cataSetup();});};}
{const f=legHurt;legHurt=function(){if(LEY.kind!=='cata'||!CATA.run)return f.apply(this,arguments);const r=CATA.run;
  if(r.bronze){r.bronze=false;LEY.inv=1.2;try{legSfx('clang');}catch(e){}toast('<span class="label">Piel de bronce</span><br>El don de Hefesto para el golpe.');return;}
  if(typeof HEROI!=='undefined'&&HEROI.hel>0){LEY.inv=0.5;return;}
  r.hp--;LEY.inv=cataHasBoon('nyx')?2.2:1.2;leySfx('hit');if(LEY.fl){LEY.fl.style.opacity=1;setTimeout(()=>LEY.fl&&(LEY.fl.style.opacity=0),280);}leyHud();if(r.hp<=0)cataDeath();};}
{const f=legWin;legWin=function(){if(LEY.kind!=='cata'||!CATA.run)return f.apply(this,arguments);const r=CATA.run,tp=cataRoomType();LEY.on=false;LEY.won=true;for(const s of LEY.shots)scene.remove(s.m);LEY.shots=[];for(const o of LEY.orbs)scene.remove(o.g);LEY.orbs=[];leyHud();
  try{sfxCoin();}catch(e){}if(cataHasBoon('persefone')){cataz().granos++;r.granosRun++;}const prog=r.room+r.map*20;if(prog>cataz().best)cataz().best=prog;save();
  if(tp==='elite'){r.obols+=10;cataBoonPick(()=>cataDoors());return;}
  if(tp==='boss'||tp==='mini'){const g=tp==='boss'?4+r.map*2:2+r.map;cataz().granos+=g;r.granosRun+=g;r.obols+=tp==='boss'?15:8;save();toast('<span class="label">'+(tp==='boss'?CATA_MAPS[r.map].bn+' se aparta':'La guardiana se aparta')+'</span><br>+'+g+' granos de granada y óbolos.');}
  cataDoors();};}
{const f=legLose;legLose=function(){if(LEY.kind!=='cata')return f.apply(this,arguments);};}
{const f=leyHud;leyHud=function(){f.apply(this,arguments);try{if(LEY.kind==='cata'&&CATA.run&&LEY.hud&&LEY.on){const r=CATA.run,M=CATA_MAPS[r.map],hp='♥'.repeat(Math.max(0,r.hp))+'♡'.repeat(Math.max(0,r.maxHp-r.hp));
    LEY.hud.innerHTML='<span style="color:#9fb8ff">'+M.n+' · sala '+r.room+'/20'+(r.elite?' (élite)':'')+'</span><span style="color:#ffd25a">Orbes '+LEY.n+'/'+LEY.GOAL+'</span><span>Vida '+hp+'</span><span>Óbolos '+r.obols+'</span>'+(r.boons.length?'<span>Dones: '+r.boons.map(b=>(CATA_BOONS.find(x=>x[0]===b)||[0,b])[1]).join(', ')+'</span>':'')+(typeof legShieldHud==='function'?legShieldHud():'');}}catch(e){}};}
// el portal del Ténaro: solo tras vencer a Cerbero
{const f=int2Enter;int2Enter=function(o){if(o&&o.room==='cata'&&!INT2.in&&!INT2.busy&&typeof premWon==='function'&&!premWon('cerbero')){toast('<span class="label">La boca del Hades</span><br>Un ladrido triple sale de la cueva. Antes de bajar, vence la leyenda de Cerbero.');return;}return f.apply(this,arguments);};}
// al salir de la sala a mitad de bajada, se pierde la bajada
{const f=int2Leave;int2Leave=function(){if(INT2.in&&INT2.in.o&&INT2.in.o.room==='cata'&&CATA.run){CATA.run=null;cataClear();LEY.on=false;}return f.apply(this,arguments);};}
// velocidad (Hermes y Paso ligero)
{const f=v2Spd;v2Spd=function(){const v=f.apply(this,arguments);try{if(LEY.kind==='cata'&&CATA.run&&typeof legIn==='function'&&legIn())return v*(1+0.05*cataLv('paso'))*(cataHasBoon('hermes')?1.12:1);}catch(e){}return v;};}
// fuera de las leyendas de premios y del agón
try{PREM_NOT.push('cata');}catch(e){}
