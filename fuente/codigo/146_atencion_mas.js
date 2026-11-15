// ============================================================ MIRAR CON ATENCIÓN (5): edificios enteros, estatuas con nombre, puentes y ríos con su nombre
// (vídeo de Roma) El templo de Júpiter solo se iluminaba desde algunos ángulos: el punto de mira de cada lugar era su estela, no el edificio.
// Ahora cada edificio con nombre (footprints) es un objetivo con su centro y su tamaño. Las estatuas toman el nombre del dios o del personaje
// del santuario o monumento en que están; los puentes, el del puente más cercano; el agua del río, el nombre del río.
const ATM={fp:null,pl:null};
function atmPlaceByName(n){if(!n)return null;const k=n.toLowerCase();return PLACES.find(p=>p.name&&(p.name.toLowerCase()===k||p.name.toLowerCase().includes(k)||k.includes(p.name.toLowerCase())))||null;}
function atmFp(){if(ATM.fp)return ATM.fp;ATM.fp=[];const seen=new Set();
  for(const f of footprints){if(!f.name||!isFinite(f.x)||seen.has(f.name+Math.round(f.x)))continue;seen.add(f.name+Math.round(f.x));const r=f.r||Math.max(f.w||0,f.d||0)/2;if(r<4)continue;
    const P=atmPlaceByName(f.name);ATM.fp.push({x:f.x,z:f.z,r,name:f.name,P});}
  return ATM.fp;}
// el dios o personaje de un lugar: «Templo de Júpiter Óptimo Máximo» → «Júpiter Óptimo Máximo»
function atmWho(n){const m=/(?:templo|ara|santuario|altar|tumba|mausoleo|estatua|columna|arco|bosque sagrado|cella)\s+(?:de\s+la\s+|de\s+los\s+|de\s+las\s+|del\s+|de\s+)(.+)$/i.exec(n||'');return m?m[1].replace(/\s*\(.*\)$/,'').trim():null;}
function atmNearPlace(x,z,R,test){let best=null,bd=R;for(const p of PLACES){if(!isFinite(p.x))continue;const d=Math.hypot(p.x-x,p.z-z);if(d<bd&&(!test||test(p))){bd=d;best=p;}}return best;}
function atmRiverName(x,z){let best=null,bd=260;const cx=Math.floor(x/40),cz=Math.floor(z/40);for(let i=cx-6;i<=cx+6;i++)for(let j=cz-6;j<=cz+6;j++){const a=ATR.get(i+','+j);if(!a)continue;for(const o of a){if(o.k!=='river'||!o.ex)continue;const d=Math.hypot(o.x-x,o.z-z);if(d<bd){bd=d;best=o.ex;}}}
  if(!best&&MODE==='roma'&&x<8000&&Math.abs(x)<2500&&Math.abs(z)<2500)best='El Tíber';return best;}
{const ac=atCands;atCands=function(){const C=ac(),P=player,ro=MODE==='roma';try{
  // 1) estatuas, puentes y ríos con nombre propio
  for(const c of C){if(c._atm)continue;c._atm=1;
    if(c.name==='Estatua de mármol'||c.name==='Estatua de bronce'){const p=atmNearPlace(c.x,c.z,40,q=>!!atmWho(q.name));if(p){const w=atmWho(p.name);c.name='Estatua: '+w;c.sub=(c.sub||'escultura')+' · '+p.name;const t0=c.txt;
        c.txt=()=>(/templo|santuario|ara|bosque/i.test(p.name)?'En el santuario de '+w+': la imagen del dios o una estatua votiva, regalo de un devoto agradecido. ':/tumba|mausoleo/i.test(p.name)?'Junto a la tumba de '+w+', una estatua en su memoria. ':'Una estatua de '+w+' o en su honor. ')+t0();c.def=undefined;}
      else{const q=atmNearPlace(c.x,c.z,60);if(q){c.sub=(c.sub||'escultura')+' · '+q.name;const t0=c.txt;c.txt=()=>(ro?'Una estatua honorífica: en Roma, los foros, pórticos y templos estaban llenos de estatuas de magistrados, generales y benefactores, puestas por decreto del senado o pagadas por sus familias. ':'Una estatua votiva u honorífica, regalo a los dioses o premio de la ciudad a un ciudadano ilustre. ')+t0();c.def=undefined;}}}
    else if(c.name==='Puente'){const p=atmNearPlace(c.x,c.z,(c.r||20)+60,q=>/puente|pons|pont/i.test(q.name+' '+(q.greek||'')));if(p){c.name=p.name;c.sub='puente';const t=p.text;c.txt=()=>t;c.def=undefined;}}
    else if(c.name==='Río'||c.name==='Agua de río'){const n=atmRiverName(c.x,c.z);if(n){c.name=n;c.sub='río';}}}
  // 2) edificios enteros: el centro y el tamaño de su planta, no solo la estela
  for(const f of atmFp()){const dx=f.x-P.x,dz=f.z-P.z,d=Math.hypot(dx,dz);if(d>420||d<f.r*0.6)continue;   // si estás dentro, no tapa lo que hay dentro
    const y=floorAt(f.x,f.z)+Math.min(14,f.r*0.5),Pl=f.P;
    C.push({x:f.x,y,z:f.z,r:f.r*0.85,place:1,name:f.name,sub:Pl?(Pl.greek||''):'edificio',txt:()=>Pl?(atFirst(Pl.text)+' '+atFirst((Pl.text||'').slice(atFirst(Pl.text).length).trim())):'Un edificio de '+(ro?'Roma':'la ciudad')+'. Acércate a su estela, si la tiene, para leer más.'});}
}catch(e){}return C;};}
// el agua mirada a lo lejos (sin objetivo): con el nombre del río
{const ag=atGround;atGround=function(){const g=ag();if(g&&g.name==='Agua de río'){const n=atmRiverName(g.x,g.z);if(n){g.name=n;g.sub='río';}}return g;};}
// ============================================================ NADAR EN LOS RÍOS: flotar en la superficie (antes se caminaba por el fondo y el personaje desaparecía bajo el agua)
const RSW={on:false,msg:false};
function rswTick(){if(!state||ui!=='play'||FLY.on||BOAT.on||MOUNT.riding){RSW.on=false;return;}const w=riverWater(player.x,player.z);
  let ww=w;if(ww===null&&MODE==='roma'&&player.x<8000&&typeof romaRiverDist==='function'&&romaRiverDist(player.x,player.z)<romaRiverW(player.z)+4)ww=-2.2;   // el Tíber de Roma
  if(ww===null){RSW.on=false;return;}const bed=floorAt(player.x,player.z);if(ww-bed<1.3){RSW.on=false;return;}   // vadeable: se camina por el fondo
  const top=ww-1.25;   // la cabeza (a 1,6 m de los pies) queda fuera del agua
  if(player.feet<top){player.feet=top;if(player.vy<0)player.vy=0;player.grounded=true;}
  if(!RSW.on){RSW.on=true;if(!RSW.msg){RSW.msg=true;toast('<span class="label">Nadas</span><br>El agua te cubre: nadas despacio hacia la orilla. '+(MODE==='roma'?'Los romanos aprendían a nadar de niños; «no sabe ni nadar ni leer» se decía del más ignorante.':'Los griegos decían del más ignorante que «no sabe ni nadar ni las letras» (Platón, Leyes 689d).'));}}}
{const f=uxTick;uxTick=function(dt){f(dt);try{rswTick();}catch(e){}};}
// ============================================================ ÁRBOLES: al suelo después de rebajar el terreno bajo los edificios, y fuera de las ínsulas
// Los árboles se plantan antes de applyFlats; donde luego se rebaja el terreno (solares y su transición) quedaban flotando (la copa en el aire),
// y alguno había caído dentro de una ínsula. Tras applyFlats: cada ejemplar baja lo que bajó el suelo, y los que quedan dentro de un edificio se quitan.
const VEGFIX_SKIP=/jard|hort|bosque|campo|p[oó]rtic|porticus|templo de la paz|foro|plaza|circo|estadio|nemus|lucus|[aá]rea|domus|casa|villa|peristil|granja|huert|santuario|gimnasio|academia|liceo|palestra/i;
function vegFix(){if(!FLATS.length&&!footprints.length)return;const G=new Map(),C=40;
  for(const f of footprints){if(f.reserve||!isFinite(f.x))continue;if(f.name&&VEGFIX_SKIP.test(f.name))continue;const r=f.r||Math.hypot(f.w||0,f.d||0)/2;if(!r||r>90)continue;
    for(let i=Math.floor((f.x-r)/C);i<=Math.floor((f.x+r)/C);i++)for(let j=Math.floor((f.z-r)/C);j<=Math.floor((f.z+r)/C);j++){const k=i+','+j;let a=G.get(k);if(!a)G.set(k,a=[]);a.push(f);}}
  const inB=(x,z)=>{const a=G.get(Math.floor(x/C)+','+Math.floor(z/C));if(!a)return false;for(const f of a){if(f.r){if(Math.hypot(x-f.x,z-f.z)<f.r-0.5)return true;continue;}const A=f.a||0,dx=x-f.x,dz=z-f.z,c=Math.cos(A),s=Math.sin(A),lx=dx*c-dz*s,lz=dx*s+dz*c;if(Math.abs(lx)<f.w/2-0.4&&Math.abs(lz)<f.d/2-0.4)return true;}return false;};
  const m=new THREE.Matrix4(),v=new THREE.Vector3(),Z=new THREE.Matrix4().makeScale(0,0,0);let moved=0,gone=0;
  for(const ch of CHUNKS){const im=ch.im;if(!im||!im.userData.veg)continue;let ch2=false;
    for(let i=0;i<im.count;i++){im.getMatrixAt(i,m);v.setFromMatrixPosition(m);if(v.x>8000)continue;
      if(inB(v.x,v.z)){im.setMatrixAt(i,Z);ch2=true;gone++;continue;}
      if(!FLAT_GRID.has(Math.floor(v.x/FLAT_C)+','+Math.floor(v.z/FLAT_C)))continue;const d=terrainH(v.x,v.z)-terrainH0(v.x,v.z);if(d<-0.05){m.elements[13]+=d;im.setMatrixAt(i,m);ch2=true;moved++;}}
    if(ch2){im.instanceMatrix.needsUpdate=true;}}
  return [moved,gone];}
{const f=applyFlats;applyFlats=function(){const r=f.apply(this,arguments);try{window.__vegfix=vegFix();}catch(e){console.warn('vegFix',e);}return r;};}
// los muretes de los campos se colocan a veces después de las puertas: se vuelve a despejar el paso al terminar la carga
{const f=rfSetup;rfSetup=function(){try{gateClearWalls();}catch(e){}return f.apply(this,arguments);};}
// ============================================================ ROMA: barca en el Tíber, junto al Emporio, y Tiberino que te la señala
// El Tíber de Roma no es un río excavado (addRiver) sino el cauce del terreno con el agua del mar a -2,2 m: no tenía embarcadero ni barca.
// Se le da un trazado para la barca (el mismo que usan los ríos de los mapas) y un embarcadero con barca junto al Emporio (vídeo: «ahí tendría que estar la barca»).
const TIBER={r:null,god:null,said:false};
function romaTiberDock(){if(MODE!=='roma'||typeof romaRiverX!=='function')return;const pts=[],L=[];let wmin=1e9;
  for(let z=-1300;z<=1150;z+=25){pts.push([romaRiverX(z),z]);L.push(-1.95);wmin=Math.min(wmin,romaRiverW(z));}
  const r={pts,L,w:Math.max(20,wmin*2-14),wet:2,dep:3,dry:false,name:'el Tíber',S:[0]};for(let i=1;i<pts.length;i++)r.S.push(r.S[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));TIBER.r=r;
  // el punto del río más cercano al Emporio (-470, 628)
  let s=0,bd=1e9;for(let q=0;q<r.S[r.S.length-1];q+=5){const P=riverAt(r,q),d=Math.hypot(P.x+470,P.z-628);if(d<bd){bd=d;s=q;}}
  const P=riverAt(r,s),W=romaRiverW(P.z),sg=(-470-P.x)*(-P.tz)+(628-P.z)*P.tx>=0?1:-1,nx=-P.tz*sg,nz=P.tx*sg;   // hacia la orilla del Emporio
  const bx=P.x+nx*(W+4),bz=P.z+nz*(W+4),pl=grp(bx,0,bz,Math.atan2(nx,nz));const wood=lam('#7a5a3a'),by=Math.max(terrainH(bx,bz),-1.6);
  box(2.2,0.22,18,wood,0,by+0.1,-8,pl);for(let k=0;k<4;k++)for(const s2 of[-1,1])box(0.2,4,0.2,lam('#5a4028'),s2*1,-1.2,-1-k*5,pl);   // el embarcadero, mar adentro
  const bg=boatMesh(),lat=sg*(r.w/2-1.5),bxp=P.x-P.tz*lat,bzp=P.z+P.tx*lat;bg.position.set(bxp,-2.35,bzp);bg.rotation.y=Math.atan2(P.tx,P.tz);
  const lb=labelSprite('Barca de río','el Tíber · remar río arriba y abajo',false);lb.position.y=2.2;lb.visible=false;bg.add(lb);
  const D={kind:'barca',x:P.x+nx*(W+0.5),z:P.z+nz*(W+0.5),lb,data:{name:'Barca de río',role:''},r,s,lat,g:bg,home:{x:bxp,y:-2.35,z:bzp,a:bg.rotation.y}};BOAT.docks.push(D);r.dock=D;
  // Tiberino, el dios del río, de pie sobre el agua junto a la barca: barba, corona de juncos y un remo (así lo pintan las estatuas de los ríos)
  try{const g=makePerson({chiton:'#5f8a8c',himation:'#3f6a6e',skin:'#9fbab4',hair:'#c8d8d0',beard:true,beardC:'#c8d8d0',attrs:['G_wreath']});g.scale.setScalar(1.35);
    const gx=P.x-P.tz*(lat-sg*6),gz=P.z+P.tx*(lat-sg*6);g.position.set(gx,-2.4,gz);g.rotation.y=Math.atan2(bx-gx,bz-gz);scene.add(g);
    const gl=labelSprite('Tiberino','el padre Tíber, dios del río',true);gl.position.y=2.6;g.add(gl);TIBER.god={g,x:gx,z:gz,y0:-2.4};}catch(e){}}
function tiberTick(dt){const T=TIBER.god;if(!T||MODE!=='roma')return;const t=performance.now()/1000;T.g.position.y=T.y0+Math.sin(t*0.8)*0.12;
  const d=Math.hypot(player.x-T.x,player.z-T.z);T.g.visible=d<260;
  if(!TIBER.said&&d<45&&ui==='play'&&!BOAT.on){TIBER.said=true;try{sfxTap();}catch(e){}toast('<span class="label">Tiberino, el padre Tíber</span><br>El dios del río asoma entre las aguas: «Forastero, junto al Emporio hay un embarcadero con una barca. Súbete y rema: yo llevo a Roma el trigo, el vino y el mármol del mundo». En la Eneida es él quien se aparece en sueños a Eneas y le indica dónde fundar su ciudad (Virgilio, Eneida VIII 31-65).');}}
{const f=uxTick;uxTick=function(dt){f(dt);try{tiberTick(dt);}catch(e){}};}
// ============================================================ ESFERA DE SUEÑO EN CARTAGO: DIDO Y ENEAS (Eneida IV)
EPISODES.push({id:'dido_eneas',mode:'roma',name:'Dido y Eneas',at:()=>natAt('cartago',40,-90),h:20,
 teaser:'un banquete en un palacio a medio construir, una tormenta y una cueva, un dios con alas en los pies, unas naves que zarpan al alba y una hoguera.',
 build(S){S.ground('#c9b47e');const A=S.a;S.water(0,90,600,80);S.hill(-40,-60,40,18,'#a8955e');
   A.pal=S.box(30,9,18,'#e2d6bc',0,4.5,-20);S.box(32,0.6,20,'#b8643f',0,9.3,-20);for(let i=0;i<6;i++)S.box(0.9,8,0.9,'#efe6d4',-12.5+i*5,4,-10.6);   // el palacio, aún en obras
   A.cave=S.box(7,5,1,'#2a2420',-40,2.5,-42);
   A.ships=[];for(let i=0;i<5;i++){const b=S.box(3,1.6,11,'#6b4a30',-24+i*12,0.5,72);A.ships.push(b);}
   A.pyre=S.box(4,1.6,4,'#6b4a2e',22,0.8,22);A.fire=fireSprite(S,22,3,22,5);A.fire.visible=false;
   A.dido=S.person({female:true,chiton:'#efe6d4',himation:'#6a2a5a',hair:'#2a1e14',attrs:['G_diadem']},2,-6,0);
   A.ene=S.person({chiton:'#b8432f',himation:'#7a5a3a',hair:'#3a2a1e',beard:true},-2,-6,0);
   A.asc=S.person({chiton:'#efe6d4',hair:'#5a3a22'},-4,-5,0);A.asc.scale.setScalar(0.62);
   A.anna=S.person({female:true,chiton:'#e6dccb',himation:'#3f5a7a',hair:'#3a2a1e'},5,-7,0);
   A.merc=S.person({chiton:'#efe6d4',hair:'#c9a46a',attrs:['G_petasos','G_caduceus']},0,30,0);A.mglow=glowSprite(S,0,31,0,5,0xfff0c0);
   A.iris=S.person({female:true,chiton:'#f0d8e8',himation:'#9ac0e8',hair:'#c9a46a'},0,30,0);A.iglow=glowSprite(S,0,31,0,6,0xffc8f0);
   A.guests=[];for(let i=0;i<6;i++)A.guests.push(S.person({chiton:pick(['#e6dccb','#d8ccb4','#c9b48b']),himation:pick(['#7a2a2a','#2f4c6e','#6a5a3a']),hair:'#2a1e14',beard:i%2===0},-10+i*4,-14,0));},
 beats:[
  {h:21,cam:[0,4,10,0,1.6,-8],d:14,txt:'Eneas, huido de Troya en llamas con su hijo Ascanio y sus compañeros, llega a las costas de África tras una tempestad. Allí la reina Dido, que también huyó de su patria, Tiro, está levantando una ciudad nueva: Cartago. Lo acoge en su palacio y, durante el banquete, le pide que cuente la caída de Troya. Eneas habla toda la noche. Dido lo escucha sin apartar los ojos de él.',
   enter(S){const A=S.a;A.merc.visible=A.mglow.visible=A.iris.visible=A.iglow.visible=false;A.fire.visible=false;A.guests.forEach(g=>g.visible=true);A.dido.position.set(2,0,-6);A.ene.position.set(-2,0,-6);A.dido.rotation.y=-Math.PI/2;A.ene.rotation.y=Math.PI/2;},
   upd(t,dt,S){armUp(S.a.ene,null,-0.6-Math.sin(t*1.5)*0.4);}},
  {h:11,cut:true,cam:[-30,6,-20,-40,2,-42],d:14,txt:'Venus y Juno se ponen de acuerdo, cada una por sus motivos. Durante una cacería estalla una tormenta; todos se dispersan, y Dido y Eneas se refugian en la misma cueva. La Tierra y Juno dan la señal: brillan los relámpagos y las ninfas gritan en los montes. «Aquel día fue el primero de su muerte y la causa de sus males», dice Virgilio. Dido lo llama matrimonio.',
   enter(S){const A=S.a;A.guests.forEach(g=>g.visible=false);A.asc.visible=A.anna.visible=false;A.dido.position.set(-34,0,-30);A.ene.position.set(-30,0,-28);epiFlash();},
   upd(t,dt,S){const A=S.a;walkTo(A.dido,[-34,-30],[-40,-40],0,6,t);walkTo(A.ene,[-30,-28],[-39,-39],0,6,t);if(t>7&&t<7.1)epiFlash();}},
  {h:12,cut:true,cam:[8,5,14,0,6,0],d:14,txt:'Pasan los meses. Eneas se viste de púrpura y dirige las obras de Cartago, como si fuera su ciudad. Júpiter envía entonces a Mercurio, que baja volando con sus sandalias aladas: «¿Construyes Cartago y olvidas tu reino y tu destino? Si no te importa tu gloria, piensa en Ascanio, a quien se le debe Italia». Eneas se queda helado y decide partir en secreto.',
   enter(S){const A=S.a;A.dido.visible=false;A.ene.position.set(0,0,0);A.ene.rotation.y=0;A.merc.visible=A.mglow.visible=true;},
   upd(t,dt,S){const A=S.a,y=Math.max(1.2,30-t*4);A.merc.position.set(0,y-1.2,4);A.mglow.position.set(0,y,4);if(t>7)armUp(A.merc,null,-2.4);}},
  {h:17,cut:true,cam:[0,3,6,0,1.6,-3],d:15,txt:'Dido lo adivina antes de que se lo digan. Le suplica, le recuerda lo que han vivido, le dice que por él lo ha perdido todo. Eneas, con los ojos fijos por orden de Júpiter, contesta poco: que nunca la olvidará, que no fue su elección. «Italiam non sponte sequor»: «No voy a Italia por mi voluntad».',
   enter(S){const A=S.a;A.merc.visible=A.mglow.visible=false;A.dido.visible=true;A.dido.position.set(0,0,-4);A.dido.rotation.y=0;A.ene.position.set(0,0,0);A.ene.rotation.y=Math.PI;},
   upd(t,dt,S){armUp(S.a.dido,-1.6-Math.sin(t*2)*0.3,-1.6-Math.cos(t*2)*0.3);}},
  {h:5.5,cut:true,cam:[30,8,10,0,1,70],d:15,txt:'Al alba, Dido ve desde lo alto del palacio las naves de los troyanos ya en el mar, a toda vela. Manda a su hermana Ana levantar una gran hoguera, como para quemar los recuerdos de Eneas, y lanza una maldición: que entre su pueblo y el de Eneas no haya nunca amistad, y que de sus huesos nazca un vengador. Los romanos leían aquí el anuncio de Aníbal y de las guerras púnicas.',
   enter(S){const A=S.a;A.ene.visible=false;A.anna.visible=true;A.dido.position.set(20,0,16);A.dido.rotation.y=Math.PI;A.anna.position.set(24,0,18);A.pyre.visible=true;},
   upd(t,dt,S){S.a.ships.forEach((b,i)=>{b.position.z=72+t*2.2+i;});armUp(S.a.dido,null,-2.6);}},
  {h:6,cam:[30,4,30,22,2,22],d:16,txt:'Sube a la pira, toma la espada que Eneas le había regalado y se da muerte. Su agonía es larga, hasta que Juno, compadecida, envía a Iris, que baja del cielo sobre su arco de colores y le corta un mechón de cabello para Plutón: así su alma queda libre.<p class="sub">Fuentes: Virgilio, Eneida I 494-756 y IV (citas: IV 169-170, 265-276, 361, 622-629, 693-705); Ovidio, Heroidas VII. Así lo contaban los romanos. Ojo: según la cronología antigua, Troya cayó unos 350 años antes de que se fundara Cartago (hacia el 814 a.C.): Eneas y Dido no pudieron conocerse. Otra versión, la de Timeo y Justino (XVIII 6), cuenta que Dido se arrojó a la hoguera para no casarse con un rey africano, Jarbas.</p>',
   enter(S){const A=S.a;A.fire.visible=true;A.dido.position.set(22,1.6,22);A.anna.position.set(26,0,24);A.iris.visible=A.iglow.visible=true;},
   upd(t,dt,S){const A=S.a,y=Math.max(3.4,28-t*3);A.iris.position.set(22,y-1.2,25);A.iglow.position.set(22,y,25);if(t>3)fall(A.dido,(t-3)/3),A.dido.position.y=1.6;}}]});
// ============================================================ CARTAGO: un combate de gladiadores en el anfiteatro (vídeo: «estaría bien algún espectáculo»)
// Un murmillo (escudo grande, espada corta) contra un retiario (red y tridente): la pareja más famosa de la época. Gente en las gradas. Solo de día.
const CMUN={on:false,g:[],crowd:[],t:0,lb:null,said:false};
function cmunBuild(){const I=ISLANDS.find(q=>q.id==='cartago');if(!I||!I.amph)return false;const x=I.amph.x,z=I.amph.z,y=floorAt(x,z)+0.05;
  const m=makePerson({chiton:'#b8432f',short:true,noHimation:true,hair:'#2a1e14',spear:true});m.position.set(x-2,y,z);scene.add(m);
  const r=makePerson({chiton:'#d8ccb4',short:true,noHimation:true,hair:'#3a2a1e',spear:true});r.position.set(x+2,y,z);scene.add(r);
  const net=new THREE.Mesh(new THREE.SphereGeometry(0.5,8,6),new THREE.MeshLambertMaterial({color:'#8a7a5a',wireframe:true}));net.position.set(0.5,1.1,0.3);r.add(net);
  CMUN.g=[m,r];CMUN.x=x;CMUN.z=z;CMUN.y=y;const lb=labelSprite('Un combate de gladiadores','murmillo contra retiario',false);lb.position.set(x,y+5,z);scene.add(lb);CMUN.lb=lb;
  for(let i=0;i<40;i++){const a=R()*TAU,k=0.55+R()*0.4,px=x+Math.cos(a)*46*k,pz=z+Math.sin(a)*36*k;if(Math.abs(Math.sin(a))<0.1)continue;const p=makePerson({chiton:pick(['#e6dccb','#d8ccb4','#9a7a5a','#b8a888']),hair:'#2a1e14',noHimation:R()<0.5});p.position.set(px,y+1.2+(k-0.5)/0.45*10,pz);p.rotation.y=Math.atan2(x-px,z-pz);scene.add(p);CMUN.crowd.push(p);}
  return true;}
function cmunTick(dt){if(MODE!=='roma'||!state)return;const I=islandOf?islandOf(player.x):null;const near=I&&I.id==='cartago'&&I.amph&&Math.hypot(player.x-I.amph.x,player.z-I.amph.z)<160&&DAYF>0.5;
  if(near&&!CMUN.on){if(!CMUN.g.length&&!cmunBuild())return;CMUN.on=true;}
  const vis=near;for(const o of[...CMUN.g,...CMUN.crowd])o.visible=vis;if(CMUN.lb)CMUN.lb.visible=vis&&Math.hypot(player.x-CMUN.x,player.z-CMUN.z)<70;if(!vis){CMUN.on=false;return;}
  CMUN.t+=dt;const t=CMUN.t,a=t*0.6,[m,r]=CMUN.g,d=2.2+Math.sin(t*1.7)*0.9;
  m.position.set(CMUN.x+Math.cos(a)*d,CMUN.y,CMUN.z+Math.sin(a)*d);r.position.set(CMUN.x-Math.cos(a)*d,CMUN.y,CMUN.z-Math.sin(a)*d);m.lookAt(r.position.x,CMUN.y,r.position.z);r.lookAt(m.position.x,CMUN.y,m.position.z);
  try{personWalk(m,t*7,0.6);personWalk(r,t*7+1,0.6);if(m.userData.arms)m.userData.arms[1].rotation.x=-0.6-Math.max(0,Math.sin(t*3))*1.2;if(r.userData.arms)r.userData.arms[1].rotation.x=-0.4-Math.max(0,Math.sin(t*2.3+1))*1.4;}catch(e){}
  for(let i=0;i<CMUN.crowd.length;i+=3){const p=CMUN.crowd[i];if(p.userData.arms)p.userData.arms[0].rotation.x=-Math.max(0,Math.sin(t*4+i))*2.4;}
  if(!CMUN.said&&Math.hypot(player.x-CMUN.x,player.z-CMUN.z)<60){CMUN.said=true;toast('<span class="label">Munus</span><br>Hoy hay gladiadores: un murmillo, con casco de pez y escudo grande, contra un retiario, con red y tridente y la cabeza descubierta. Los combates los paga un magistrado o un notable de la ciudad para ganarse al pueblo. No todos acaban en muerte: un gladiador era caro, y el que había luchado bien podía salir vivo (missus) aunque perdiera.');}}
{const f=uxTick;uxTick=function(dt){f(dt);try{cmunTick(dt);}catch(e){}};}
