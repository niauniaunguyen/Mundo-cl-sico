// ============================================================ el caballo: se gana con un favor y crece recogiendo esferas doradas
const HORSE_NPC=()=>MODE==='roma'?'auriga':'tesalia';
function hz(){if(!state.horse||typeof state.horse!=='object')state.horse={own:false,q:'',xp:0,lvl:1};return state.horse;}
const horseNeed=l=>4+l*2;                       // esferas para pasar del nivel l al siguiente
const horseMul=()=>(1+0.02*(hz().lvl-1))*(qLv('ar')>=4?1.05:1);         // +2 % de velocidad por nivel
const horseJump=()=>1+0.03*(hz().lvl-1);        // y un poco más de impulso al saltar
const MARE={g:null};
function horseModel(x,z,coat){const g=grp(x,floorAt(x,z),z,R()*TAU);
  if(GLB.ok)animalGLB('A_horse',g,coat,'#2e2018');else{const c=lam(coat),dk=lam('#1e140e');box(0.75,0.8,1.95,c,0,1.55,0,g);box(0.35,0.9,0.35,c,0,2.2,0.95,g).rotation.x=0.5;box(0.33,0.36,0.8,c,0,2.6,1.3,g);
    for(const[px,pz]of[[0.25,0.75],[-0.25,0.75],[0.25,-0.75],[-0.25,-0.75]])box(0.15,1.2,0.15,dk,px,0.6,pz,g);}return g;}
function mareShow(){const h=hz();if(MARE.g){scene.remove(MARE.g);MARE.g=null;}
  if(h.q==='caught'){const o=npcAt(HORSE_NPC());if(o){const f=findFree(o.x+3,o.z+2.5,1.2);MARE.g=horseModel(f[0],f[1],MODE==='roma'?'#d8cfc0':'#8a6a4a');}return;}   // ya ha vuelto sola con su dueño
  if(h.q!=='on')return;
  if(h.mx===undefined){const o=npcAt(HORSE_NPC());if(!o)return;let f=null;
    for(let k=0;k<30&&!f;k++){const a=R()*TAU,d=130+R()*90,q=findFree(o.x+Math.cos(a)*d,o.z+Math.sin(a)*d,1.2);if(floorAt(q[0],q[1])>-0.5&&regionOf(q[0])===regionOf(o.x)&&Math.abs(floorAt(q[0],q[1])-floorAt(o.x,o.z))<20)f=q;}
    if(!f)f=findFree(o.x+50,o.z+30,1.2);h.mx=f[0];h.mz=f[1];save();}
  MARE.g=horseModel(h.mx,h.mz,MODE==='roma'?'#d8cfc0':'#8a6a4a');}
function horseTarget(){const h=hz();if(h.q==='on'&&h.mx!==undefined)return{x:h.mx,z:h.mz};if(h.q==='caught')return npcAt(HORSE_NPC());return null;}
function horseQuest(n){const h=hz(),ro=MODE==='roma',o=$('dOpts');
  const one=(txt,fn)=>{o.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>'+txt+'</span>';b.onclick=fn;o.appendChild(b);setTimeout(()=>b.focus({preventScroll:true}),30);};
  if(h.q===''){$('dBody').innerHTML='<p>'+(ro?'¿Un caballo? Yo conduzco cuadrigas para los Verdes, chaval, no vendo jamelgos. Aunque… esta mañana se nos ha escapado una yegua blanca de las cuadras. Si la encuentras antes que los Azules, te regalo un caballo de los nuestros: ya no corre en el circo, pero tiene corazón.':'¿Un caballo? En Tesalia criamos los mejores de Grecia. Pero no se los doy a cualquiera. Al traer a la ciudad a Aura, una yegua joven, se me escapó por las afueras. Encuéntrala y tráemela, y te daré uno de mis potros.')+'</p>';
    o.innerHTML='';const b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">1</span><span>Acepto: buscaré la yegua</span>';
    b.onclick=()=>{h.q='on';save();mareShow();closeDialog();toast('<span class="label">Encargo</span><br>Busca la yegua escapada: sigue el rombo ◆ de la brújula.');};o.appendChild(b);
    const c=document.createElement('button');c.innerHTML='<span class="n">2</span><span>Ahora no</span>';c.onclick=()=>renderOpts();o.appendChild(c);return;}
  if(h.q==='on'){$('dBody').innerHTML='<p>'+(ro?'¿Todavía nada? Es blanca y asustadiza. Sigue el rombo de la brújula.':'¿Aún no la has visto? Es castaña, con una estrella en la frente. Sigue el rombo de la brújula.')+'</p>';one('Voy a buscarla',()=>renderOpts());return;}
  if(h.q==='caught'){h.q='done';h.own=true;if(MARE.g){scene.remove(MARE.g);MARE.g=null;}h.xp=0;h.lvl=1;qAdd('kl',2);qAdd('ar',1);save();updateStats();sfxCoin();
    $('dBody').innerHTML='<p>'+(ro?'¡La yegua ha vuelto sola a las cuadras, y sé que fuiste tú quien la encontró! Los Azules se van a morder los puños. Toma: este es Rayo. Es viejo para el circo, pero joven para ti.':'¡Aura ha vuelto sola, trotando como si nada! Y me ha dicho quién la encontró. Has cumplido, y un tesalio cumple su palabra: este potro se llama Céfiro.')+'</p><p>'+(ro?'Félix':'Eudico')+' añade: «Aún tiene mucho que aprender. Cuando cabalgues, verás <b>esferas doradas</b> por el camino: pasa a través de ellas. Cada una le da experiencia, y con cada nivel corre un 2 % más rápido y salta un poco más».</p>';
    one('Ponerle nombre',()=>horseNameDlg(ro?'Rayo':'Céfiro',()=>{closeDialog();toast('<span class="label">Ya tienes caballo</span><br>Pulsa <b>'+(isTouch?'el botón del caballo':'H')+'</b> para llamar a '+hz().name+'.');}));return;}
}
// ponerle (o cambiarle) el nombre al caballo
function horseName(){return hz().name||(MODE==='roma'?'Rayo':'Céfiro');}
function horseNameDlg(def,after){const o=$('dOpts');$('dBody').innerHTML='<p>¿Cómo quieres llamar a tu caballo?</p><p><input id="hName" maxlength="20" autocomplete="off" style="background:#16100c;border:1px solid #6b4a2e;color:var(--bone);padding:6px 8px;font:inherit;width:min(260px,100%)"></p><p class="sub">Los griegos y romanos ponían a sus caballos nombres como Bucéfalo («cabeza de buey»), Aura («brisa»), Podargo («pies veloces») o Incitato («impetuoso»).</p>';
  const i=$('hName');i.value=hz().name||def;o.innerHTML='';const b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">1</span><span>Ponerle este nombre</span>';
  const ok=()=>{const v=(i.value||'').replace(/[<>&"]/g,'').trim().slice(0,20)||def;hz().name=v;save();updateStats();sfxCoin();after&&after();};b.onclick=ok;o.appendChild(b);
  i.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();ok();}};setTimeout(()=>{i.focus();i.select();},40);}
// esferas doradas: solo mientras cabalgas, cada ~60 m aparece una por delante
const HORBS=[];let horbAcc=0,horbLast=null;
function horbSpawn(){const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw);
  const d=45+R()*35,l=(R()-0.5)*18,f=findFree(player.x+fx*d+rx*l,player.z+fz*d+rz*l,0.8);const fl=floorAt(f[0],f[1]);if(fl<-0.5||Math.abs(fl-player.feet)>15)return;
  const g=new THREE.Group();g.position.set(f[0],fl+1.4,f[1]);
  const m=new THREE.Mesh(new THREE.SphereGeometry(0.6,16,12),new THREE.MeshBasicMaterial({color:0xffd860}));g.add(m);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:EPI_TEX,color:0xffc840,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));sp.scale.set(4.2,4.2,1);g.add(sp);
  scene.add(g);HORBS.push({g,x:f[0],z:f[1],y:fl+1.4,t:R()*6});}
function horbClear(){for(const o of HORBS)scene.remove(o.g);HORBS.length=0;}
function horseTick(dt){
  const h=hz();if(MARE.g&&h.q==='on'){MARE.g.rotation.y+=dt*0.2;
    if(ui==='play'&&Math.hypot(h.mx-player.x,h.mz-player.z)<4){h.q='caught';save();sfxWhistle();mareCine();}}
  if(!MOUNT.riding){if(HORBS.length)horbClear();horbLast=null;return;}
  if(horbLast){horbAcc+=Math.hypot(player.x-horbLast.x,player.z-horbLast.z);}horbLast={x:player.x,z:player.z};
  if(horbAcc>60){horbAcc=0;if(HORBS.length<8)horbSpawn();}
  for(let i=HORBS.length-1;i>=0;i--){const o=HORBS[i];o.t+=dt;o.g.position.y=o.y+Math.sin(o.t*2.4)*0.25;o.g.children[0].scale.setScalar(1+Math.sin(o.t*5)*0.08);
    const d=Math.hypot(o.x-player.x,o.z-player.z);
    if(d<2.8&&Math.abs(o.y-(player.feet+1.4))<3.5){scene.remove(o.g);HORBS.splice(i,1);horseXP();continue;}
    if(d>230){scene.remove(o.g);HORBS.splice(i,1);}}
}
function horseXP(){const h=hz();h.xp++;sfxCoin();
  if(h.xp>=horseNeed(h.lvl)){h.xp=0;h.lvl++;qAdd('ar',2);toast('<span class="label">¡'+horseName()+' sube al nivel '+h.lvl+'!</span><br>Ahora corre un '+Math.round((horseMul()-1)*100)+' % más rápido y salta más alto.');}
  save();updateStats();}
