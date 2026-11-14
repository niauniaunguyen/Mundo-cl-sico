// ============================================================ FAUNA SALVAJE: ciervos, corzos, gamos, jabalíes, osos, lobos, zorros y liebres, según el bosque, la hora y la época
// Solo alrededor del jugador (como mucho 6, 4 en móvil); pastan, pasean y huyen si te acercas. La primera vez que ves cada especie, un aviso con un dato y su fuente.
const WSP={deer:{n:'Ciervo',sp:9,dist:22,day:1},roe:{n:'Corzo',sp:8,dist:18,day:1},fallow:{n:'Gamo',sp:8,dist:20,day:1},boar:{n:'Jabalí',sp:6.5,dist:16,day:0.6},bear:{n:'Oso',sp:5,dist:24,day:0.8},
 wolf:{n:'Lobo',sp:7.5,dist:28,day:0.3},fox:{n:'Zorro',sp:7,dist:16,day:0.5},hare:{n:'Liebre',sp:9,dist:12,hop:1,day:0.7}};
// tres especies más para el bestiario de piezas (WILD) y sus datos
Object.assign(WILD,{fox:{c:'#b0642a',b:'#efe2cf',L:0.7,H:0.34,W:0.22,leg:0.28,neck:0.1,head:0.17,ears:1},roe:{c:'#9a6a3e',b:'#efe6d8',L:0.95,H:0.6,W:0.3,leg:0.58,neck:0.35,head:0.22,ant:1},
 fallow:{c:'#a8743e',b:'#f2e8d4',L:1.2,H:0.78,W:0.36,leg:0.72,neck:0.45,head:0.27,ant:1}});
Object.assign(FAUNA_INFO,{fox:{A:['Zorro','La zorra lista de las fábulas de Esopo, la de las uvas que «están verdes». En los montes caza liebres, perdices y ratones, y de noche se acerca a los gallineros.','Esopo, Fábulas'],R:['Zorro','La zorra lista de las fábulas: Fedro, un liberto de Augusto, puso en verso latino las fábulas de Esopo, como la de la zorra y las uvas. En la fiesta de Ceres, en abril, se soltaban zorras con antorchas atadas a la cola en el Circo.','Fedro IV 3; Ovidio, Fastos IV 681-712']},
 roe:{A:['Corzo','Pequeño y tímido; sale a comer a los claros al amanecer y al atardecer, y ladra como un perro cuando se asusta. Jenofonte lo cuenta entre la caza de los montes.','Jenofonte, Cinegético IX-XI'],R:['Corzo','Los romanos lo llaman caprea, «la cabrita». Sale a comer a los claros al amanecer y al atardecer, y ladra como un perro cuando se asusta.','Plinio, Historia natural VIII']},
 fallow:{A:['Gamo','De manchas blancas y cuernos en forma de pala. Vive en Asia Menor y en algunas islas del Egeo, y se consagra a Ártemis.','Eliano, Historia de los animales'],R:['Gamo','De manchas blancas y cuernos en forma de pala. Viene de Oriente, y los romanos ricos lo crían en grandes cotos cercados para cazarlo cerca de sus villas.','Varrón, Sobre la agricultura III 13']}});
const WILD_FA={dodona:{deer:2,boar:2,wolf:1,bear:1},citeron:{deer:2,boar:2,wolf:1,fox:1,hare:1},parnaso:{deer:1,boar:1,wolf:2,bear:1},liceo:{deer:2,boar:2,wolf:1},erimanto:{boar:3,deer:2,bear:1},tempe:{deer:1,fox:1,hare:1},taigeto:{boar:2,deer:2,wolf:1,bear:1},
 pentelico:{hare:2,fox:2,deer:1},eta:{deer:2,boar:2,bear:1,wolf:1},nemea:{hare:2,fox:1},lerna:{hare:1,fox:1},estinfalo:{deer:1,boar:1,fox:1},achelous:{boar:2,deer:2,wolf:1},escironides:{fox:2,hare:1},tenaro:{hare:2,fox:1},
 sila:{wolf:2,bear:1,boar:2,roe:2},ciminia:{boar:3,roe:2,deer:2,wolf:1},nemi:{roe:2,deer:1,fox:1,hare:1},soracte:{wolf:2,roe:1,fox:1},clitumno:{hare:2,fox:1},caudium:{boar:2,wolf:1,roe:1},lunae:{boar:1,roe:1,fox:1},rubico:{hare:2,fox:1,roe:1},
 emona:{bear:2,wolf:2,deer:2,roe:1},henna:{hare:2,fox:1,boar:1},tyrus:{fallow:2,fox:1},eboracum:{deer:2,boar:2,wolf:1,roe:1},treveri:{boar:3,deer:2,wolf:1,roe:1}};
const WFA={list:[],t:0,pool:{},bird:6};
function wMake(k){const A=animal(k,{s:k==='bear'?1.05:1});A.k=k;A.g.visible=false;return A;}
function wPick(fa){const night=clock.h<6||clock.h>20,dusk=(clock.h>5&&clock.h<8)||(clock.h>17.5&&clock.h<21),tot=[];let sum=0;
  for(const k in fa){let w=fa[k];const d=WSP[k].day;if(night)w*=1.5-d;else if(!dusk)w*=0.3+d;else w*=1.3;tot.push([k,w]);sum+=w;}let r=Math.random()*sum;for(const[k,w]of tot){r-=w;if(r<0)return k;}return tot.length?tot[0][0]:null;}
function wildTick(dt){if(!state||ui==='start'||(typeof ACC!=='undefined'&&ACC.lite))return;const P=player;dt=Math.min(dt,0.1);
  if(ui!=='play'&&WFA.list.length)return;   /* con un diálogo abierto, los animales se quedan quietos donde están */const ok=P.feet<300&&!FLY.on&&n2Out(P.x,P.z),MAX=isTouch?4:6;WFA.t-=dt;
  // ¿dónde estamos?: un bosque con su fauna, o el campo (liebres y zorros)
  let fa=null,fo=null;if(ok){if(P.x>8000){for(const f of FOREST_ON){if(Math.abs(P.x-f.I.x)<f.I.R*1.6){fo=f;break;}}fa=fo&&WILD_FA[fo.id]?WILD_FA[fo.id]:{hare:3,fox:1};}else fa={hare:3,fox:1};}
  if(ok&&WFA.t<=0&&WFA.list.length<MAX){WFA.t=2+Math.random()*3;const k=wPick(fa);
    if(k){for(let tries=0;tries<6;tries++){const a=Math.random()*TAU,d=32+Math.random()*26,x=P.x+Math.cos(a)*d,z=P.z+Math.sin(a)*d,t=terrainH(x,z);
      if(t<1.2||riverWater(x,z)!==null||!isFree(x,z,0.8)||!n2Out(x,z))continue;if(fo&&WILD_FA[fo.id]&&k!=='hare'&&k!=='fox'&&fo.mask(x,z)<fo.thr)continue;   // los del bosque, dentro del bosque
      const pl=WFA.pool[k]||(WFA.pool[k]=[]);const A=pl.pop()||wMake(k);const n=k==='hare'||k==='bear'?1:k==='wolf'?1+Math.floor(Math.random()*3):k==='boar'?1+Math.floor(Math.random()*3):k==='deer'||k==='fallow'?1+Math.floor(Math.random()*2):1;
      A.x=x;A.z=z;A.h=Math.random()*TAU;A.st='graze';A.tt=2+Math.random()*4;A.ph=Math.random()*9;A.g.visible=true;A.g.position.set(x,t,z);WFA.list.push(A);
      for(let m=1;m<n&&WFA.list.length<MAX;m++){const B=pl.pop()||wMake(k);B.x=x+(Math.random()-0.5)*6;B.z=z+(Math.random()-0.5)*6;B.h=A.h+(Math.random()-0.5);B.st='graze';B.tt=1+Math.random()*4;B.ph=Math.random()*9;B.g.visible=true;B.g.position.set(B.x,terrainH(B.x,B.z),B.z);WFA.list.push(B);}
      break;}}}
  const t=performance.now()/1000;
  for(let i=WFA.list.length-1;i>=0;i--){const A=WFA.list[i],S=WSP[A.k],dx=A.x-P.x,dz=A.z-P.z,d=Math.hypot(dx,dz);
    if(!ok||d>85){A.g.visible=false;(WFA.pool[A.k]=WFA.pool[A.k]||[]).push(A);WFA.list.splice(i,1);continue;}
    if(A.st!=='flee'&&d<S.dist*(MOUNT.riding?1.4:1)&&(P.moving!==false)){A.st='flee';A.h=Math.atan2(dx,dz)+(Math.random()-0.5)*0.6;A.tt=6+Math.random()*3;}
    A.tt-=dt;if(A.tt<=0){if(A.st==='flee'){A.st='walk';A.tt=3;}else if(A.st==='graze'){A.st='walk';A.tt=2+Math.random()*5;A.h+=(Math.random()-0.5)*1.6;}else{A.st='graze';A.tt=3+Math.random()*6;}}
    const sp=A.st==='flee'?S.sp:A.st==='walk'?S.sp*0.13:0;
    if(sp>0){if(A.k==='hare'&&A.st==='flee')A.h+=Math.sin(t*5+A.ph)*dt*2;   // la liebre corre en zigzag
      const nx=A.x+Math.sin(A.h)*sp*dt,nz=A.z+Math.cos(A.h)*sp*dt;if(isFree(nx,nz,0.5)&&riverWater(nx,nz)===null&&terrainH(nx,nz)>1.2){A.x=nx;A.z=nz;}else A.h+=1.3+Math.random();}
    const y=terrainH(A.x,A.z);A.g.position.set(A.x,y,A.z);A.g.rotation.y=A.h+Math.PI;
    const run=A.st==='flee',f=run?(A.k==='bear'?6:11):5,amp=sp>0?(run?0.75:0.35):0,ph=t*f+A.ph;
    A.legs[0].rotation.x=Math.sin(ph)*amp;A.legs[3].rotation.x=Math.sin(ph)*amp;A.legs[1].rotation.x=Math.sin(ph+Math.PI)*amp;A.legs[2].rotation.x=Math.sin(ph+Math.PI)*amp;
    A.g.position.y=y+(sp>0?Math.abs(Math.sin(ph))*(S.hop&&run?0.25:run?0.08:0.02):0);if(A.head)A.head.rotation.x=A.st==='graze'?-0.8+Math.sin(t*0.7+A.ph)*0.15:run?0.1:-0.1*Math.sin(t*0.5+A.ph);
    // primera vez que ves esta especie (cerca y delante)
    if(d<38&&state){const z2=state.seen||(state.seen={});if(!z2['wa:'+A.k]){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);if((-dx*fx-dz*fz)<0&&(dx*fx+dz*fz)/d>0.6){z2['wa:'+A.k]=1;const FI=(FAUNA_INFO[A.k]||{})[MODE==='roma'?'R':'A']||[S.n,'',''];state.fauna=state.fauna||{};if(!state.fauna[A.k]){state.fauna[A.k]=1;qAdd('so',1);}save();toast('<span class="label">Animal · '+FI[0]+'</span><br>'+FI[1]+(FI[2]?' ('+FI[2]+')':''));}}}}
  // cantos del bosque: cuco en primavera, el tamborileo del pito, el ruiseñor al anochecer
  WFA.bird-=dt;if(WFA.bird<=0){WFA.bird=7+Math.random()*10;if(ok&&aOK()){const sid=calNow().season.id,inF=FOR.k>0.25||(fo&&fo.mask(P.x,P.z)>fo.thr-0.03);
    if(inF&&clock.h>6&&clock.h<19&&sid!=='inv'){if(sid==='pri'&&Math.random()<0.55)wCuckoo();else if(Math.random()<0.6)wPecker();}
    if((inF||P.x<8000&&COLONO.on&&Math.hypot(P.x-COLONO.x,P.z-COLONO.z)<90)&&(clock.h>19||clock.h<5||sid==='pri')&&Math.random()<0.6)wNightingale();}}}
function wOut(v){const c=AUD.ctx,g=c.createGain();g.gain.value=v;g.connect(AUD.master);return g;}
function wCuckoo(){const c=AUD.ctx,t0=c.currentTime+0.05,out=wOut(0.11);for(let r=0;r<2+Math.floor(Math.random()*2);r++){for(const[f,dt,du]of[[680,0,0.22],[555,0.3,0.32]]){const o=c.createOscillator(),e=c.createGain();o.type='sine';o.frequency.value=f;e.gain.setValueAtTime(0,t0+r*1.1+dt);e.gain.linearRampToValueAtTime(1,t0+r*1.1+dt+0.03);e.gain.exponentialRampToValueAtTime(0.01,t0+r*1.1+dt+du);o.connect(e);e.connect(out);o.start(t0+r*1.1+dt);o.stop(t0+r*1.1+dt+du+0.05);}}}
function wPecker(){const c=AUD.ctx,t0=c.currentTime+0.05,out=wOut(0.09),n=14+Math.floor(Math.random()*8);for(let i=0;i<n;i++){const o=c.createOscillator(),e=c.createGain(),tt=t0+i*0.055;o.type='triangle';o.frequency.value=900-i*12;e.gain.setValueAtTime(0.9,tt);e.gain.exponentialRampToValueAtTime(0.01,tt+0.035);o.connect(e);e.connect(out);o.start(tt);o.stop(tt+0.04);}}
function wNightingale(){const c=AUD.ctx,t0=c.currentTime+0.05,out=wOut(0.06);let tt=t0;for(let ph=0;ph<4;ph++){const f0=1800+Math.random()*2600,n=4+Math.floor(Math.random()*8),du=0.04+Math.random()*0.07;
  for(let i=0;i<n;i++){const o=c.createOscillator(),e=c.createGain();o.type='sine';o.frequency.setValueAtTime(f0*(1+Math.random()*0.1),tt);o.frequency.linearRampToValueAtTime(f0*(0.8+Math.random()*0.5),tt+du);e.gain.setValueAtTime(0,tt);e.gain.linearRampToValueAtTime(1,tt+0.008);e.gain.exponentialRampToValueAtTime(0.01,tt+du);o.connect(e);e.connect(out);o.start(tt);o.stop(tt+du+0.02);tt+=du+0.02;}tt+=0.15+Math.random()*0.3;}}
const COLONO={on:false,x:0,z:0};
