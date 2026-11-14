// ============================================================ EL TIEMPO: sol, nubes, niebla, viento, lluvia, tormenta, calor y nieve, según la estación
// Cada tiempo trae cambios: la lluvia apaga la antorcha y embarra los caminos, el calor cansa (el odre lo arregla), la tormenta impide zarpar
// y disuelve la Asamblea (señal de Zeus o de Júpiter), en invierno el mar está «cerrado», y la sequía se combate con ritos.
const WX_T={
 sol:{n:'despejado',cl:0,rain:0,fog:0},nubes:{n:'nublado',cl:0.55,rain:0,fog:0.1},niebla:{n:'niebla',cl:0.45,rain:0,fog:1},viento:{n:'viento',cl:0.2,rain:0,fog:0,wind:1},
 lluvia:{n:'lluvia',cl:0.85,rain:0.6,fog:0.4},tormenta:{n:'tormenta',cl:1,rain:1,fog:0.5,wind:1},calor:{n:'calor',cl:0,rain:0,fog:0.05,heat:1},nieve:{n:'nieve',cl:0.8,rain:0,snow:1,fog:0.5}};
const WX_ORDER=['auto','sol','nubes','niebla','viento','lluvia','tormenta','calor','nieve'];
const WXS={cl:0,rain:0,fog:0,snow:0,heat:0,rainM:null,snowM:null,flash:0,nextBolt:5,bow:null,bowT:0,heatE:0,snd:null,torchMsg:false};
function wxz(){if(!state.wx||typeof state.wx!=='object')state.wx={k:'sol',end:0,dry:0,lastRain:0,man:'auto',seen:{},rite:0};const w=state.wx;w.seen=w.seen||{};return w;}
function wxNow(){return((state&&state.day)||1)*24+clock.h;}
function wxK(){const w=wxz();return w.man&&w.man!=='auto'?w.man:w.k;}
function wxPick(){const mo=calNow().mo,ro=MODE==='roma',h=clock.h,w=wxz();let W;
  if(mo>=10||mo<=1)W={sol:3,nubes:3,lluvia:3,tormenta:1,niebla:1.5,viento:1.5,nieve:ro?0.35:0.3};
  else if(mo<=4)W={sol:5,nubes:3,lluvia:2,tormenta:0.8,niebla:1,viento:1.5};
  else if(mo<=7)W={sol:6,calor:mo>=6?4:1.5,nubes:1,tormenta:0.5,viento:ro?1:2.5};
  else W={sol:4,nubes:3,lluvia:2.5,tormenta:1.2,niebla:1.5,viento:1};
  if(!(h>=4&&h<=9))delete W.niebla;if(w.rite){W.lluvia=(W.lluvia||0)+8;W.nubes=(W.nubes||0)+2;w.rite=0;}
  let t=0;for(const k in W)t+=W[k];let r=Math.random()*t;for(const k in W){r-=W[k];if(r<=0)return k;}return 'sol';}
function wxChange(k){const w=wxz(),prev=w.k;w.k=k;w.end=wxNow()+(k==='niebla'?2+Math.random()*3:k==='tormenta'?1.5+Math.random()*3:3+Math.random()*9);
  if(WX_T[k].rain){w.dry=0;w.lastRain=state.day||1;}save();if(prev!==k&&ui==='play')wxAnnounce(k,prev);}
const WX_TXT={
 lluvia:['Llueve sobre Roma. Los romanos se echan por encima la paenula, una capa de lana con capucha. Las calles se llenan de barro (por eso hay piedras pasaderas para cruzar las calzadas), y el agua de los tejados cae al impluvium de cada casa y se guarda en una cisterna. Con lluvia, la antorcha no prende y el barro te hace ir más despacio.',
   'Llueve sobre Atenas. Zeus es quien manda la lluvia; los atenienses le rezaban: «Llueve, llueve, querido Zeus, sobre los campos y las llanuras de los atenienses» (lo recuerda Marco Aurelio, Meditaciones V 7). El agua de los tejados se guarda en cisternas, porque en verano las fuentes no bastan. Con lluvia, la antorcha no prende y el barro te hace ir más despacio.'],
 tormenta:['Truena. Para un romano, el rayo es un signo de Júpiter que interpretan los augures y los harúspices etruscos; si truena, no se pueden celebrar las asambleas del pueblo. Donde cae un rayo, los sacerdotes lo «entierran» y rodean el sitio con un brocal, el bidental, que nadie debe pisar. Con este temporal ningún barco zarpa.',
   'Truena: es Zeus. Una señal suya, como un trueno o un terremoto, disuelve la Asamblea en el acto; Aristófanes se burla de ello en Los acarnienses, y Tucídides (V 45) cuenta una asamblea interrumpida por un terremoto. Los sitios donde ha caído un rayo se cercan y se consagran a Zeus Kataibátes, «el que baja». Con este temporal ningún barco zarpa.'],
 niebla:['Niebla del Tíber: hasta media mañana no se ve la otra orilla y los barqueros del puerto fluvial esperan a que levante.','Bruma de la mañana sobre el Iliso y el Cefiso. Desde la Acrópolis, el mar ha desaparecido.'],
 viento:['Sopla el viento. Los marinos lo conocen por su nombre: el Aquilón del norte, el Austro del sur, el Favonio de poniente, que trae la primavera. Con buen viento, los barcos de Alejandría llegan a Puteoli en dos semanas.',
   'Sopla el Bóreas, el viento del norte. Los atenienses le tienen cariño: según Heródoto (VII 189), le rezaron antes de la batalla del Artemisio, su temporal hundió muchas naves persas y luego le levantaron un altar junto al Iliso. En verano soplan los etesios, los vientos regulares del norte que frenan a los barcos que van hacia el mar Negro.'],
 calor:['La canícula: los días en que Sirio, la estrella del Perro, sale con el sol. Quien puede se va de Roma a su villa; los demás duermen la siesta del mediodía, la meridiatio. Con este calor te cansas antes: bebe del odre y busca la sombra.',
   'Sirio, la estrella del Perro, sale con el sol: son los días más calurosos. Hesíodo aconseja sentarse a la sombra de una roca con buen vino y pan de leche (Trabajos y días 582-596). Con este calor te cansas antes: bebe del odre y busca la sombra.'],
 nieve:['Nieva, cosa que en Roma no pasa todos los años. Horacio describe el monte Soracte blanco de nieve y aconseja echar leña al fuego y sacar el vino añejo (Odas I 9). Con nieve se camina más despacio.','Nieva sobre el Ática, cosa que pasa algún invierno. Los pastores bajan los rebaños del Parnés y del Himeto. Con nieve se camina más despacio.'],
 nubes:['Se nubla el cielo sobre las siete colinas.','Se nubla el cielo sobre el Himeto.'],
 sol:['Escampa: vuelve el sol.','Escampa: vuelve el sol.']};
function wxAnnounce(k,prev){const w=wxz(),ro=MODE==='roma',t=WX_TXT[k][ro?0:1],first=!w.seen[k];w.seen[k]=1;save();
  const lb={sol:'Despejado',nubes:'Nublado',niebla:'Niebla',viento:'Viento',lluvia:'Lluvia',tormenta:'Tormenta',calor:'Calor',nieve:'Nieve'}[k];
  toast('<span class="label">El tiempo · '+lb+'</span><br>'+(first?t:t.split('. ')[0]+'.'));
  if(k==='sol'&&prev&&WX_T[prev].rain&&DAYF>0.5)wxRainbow();}
function wxSpeed(){const k=wxK();let f=1;if(WX_T[k].rain&&!MOUNT.riding)f*=0.92;if(k==='nieve')f*=0.86;if(WXS.heatE>=3)f*=0.85;return f;}
// ---- arco iris tras la lluvia
function wxRainbow(){if(WXS.bow){scene.remove(WXS.bow);WXS.bow=null;}const g=new THREE.TorusGeometry(260,10,8,64,Math.PI),cols=[];const p=g.attributes.position,c=new THREE.Color();
  for(let i=0;i<p.count;i++){const v=new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i)),r=Math.hypot(v.x,v.y),u=clamp((r-250)/20,0,1);c.setHSL(0.78*u,0.9,0.6);cols.push(c.r,c.g,c.b);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));const m=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:0,depthWrite:false,fog:false,blending:THREE.AdditiveBlending});const b=new THREE.Mesh(g,m);
  const away=new THREE.Vector3(-SUNDIR.x,0,-SUNDIR.z).normalize();b.position.set(camera.position.x+away.x*700,camera.position.y-60,camera.position.z+away.z*700);b.lookAt(camera.position.x,b.position.y,camera.position.z);scene.add(b);WXS.bow=b;WXS.bowT=90;
  const w=wxz();if(!w.seen.bow){w.seen.bow=1;save();setTimeout(()=>toast('<span class="label">Arco iris</span><br>Para griegos y romanos, el arco iris es Iris, la mensajera de los dioses, que baja por él del Olimpo con sus alas de colores. En la Ilíada es ella quien lleva los mensajes de Zeus.'),2500);}}
// ---- partículas de lluvia y nieve alrededor de la cámara
function wxMakeRain(){const n=2600,p=new Float32Array(n*6);for(let i=0;i<n;i++){const x=(Math.random()-0.5)*90,y=Math.random()*45,z=(Math.random()-0.5)*90;p.set([x,y,z,x+0.08,y-0.9,z],i*6);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));const m=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xaab6c4,transparent:true,opacity:0,depthWrite:false}));m.frustumCulled=false;scene.add(m);return m;}
function wxMakeSnow(){const n=2200,p=new Float32Array(n*3);for(let i=0;i<n;i++)p.set([(Math.random()-0.5)*80,Math.random()*40,(Math.random()-0.5)*80],i*3);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));const m=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:0.14,transparent:true,opacity:0,depthWrite:false}));m.frustumCulled=false;scene.add(m);return m;}
function wxSound(on,vol){try{if(!AUD.ctx||!AUD_ON){if(WXS.snd)WXS.snd.g.gain.value=0;return;}const C=AUD.ctx;if(!WXS.snd){const b=C.createBuffer(1,C.sampleRate*2,C.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    const s=C.createBufferSource();s.buffer=b;s.loop=true;const f=C.createBiquadFilter();f.type='bandpass';f.frequency.value=1400;f.Q.value=0.6;const g=C.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(AUD.master||C.destination);s.start();WXS.snd={s,g};}
    WXS.snd.g.gain.value=on?vol:0;}catch(e){}}
function wxThunder(delay){try{if(!AUD.ctx||!AUD_ON)return;const C=AUD.ctx,t=C.currentTime+delay,b=C.createBuffer(1,C.sampleRate*3,C.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,1.6);
  const s=C.createBufferSource();s.buffer=b;const f=C.createBiquadFilter();f.type='lowpass';f.frequency.value=180;const g=C.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.9,t+0.08);g.gain.exponentialRampToValueAtTime(0.001,t+2.8);s.connect(f);f.connect(g);g.connect(AUD.master||C.destination);s.start(t);}catch(e){}}
function wxBolt(){WXS.flash=1;const f=document.createElement('div');f.style.cssText='position:fixed;inset:0;z-index:57;pointer-events:none;background:#eef2ff;opacity:.55;transition:opacity .35s';document.body.appendChild(f);requestAnimationFrame(()=>requestAnimationFrame(()=>f.style.opacity=0));setTimeout(()=>f.remove(),450);wxThunder(0.6+Math.random()*2.2);
  const w=wxz();if(!w.seen.rayo&&ui==='play'){w.seen.rayo=1;save();setTimeout(()=>vmS('ϟ',MODE==='roma'?'El rayo de Júpiter':'El rayo de Zeus','un signo de los dioses',MODE==='roma'?'<p>Para los romanos, el rayo no es un accidente: es un mensaje de Júpiter. Los augures observan de qué parte del cielo viene, y los harúspices, siguiendo los libros de los etruscos, explican qué significa. Si truena durante una asamblea, el magistrado debe disolverla: «cuando Júpiter truena, es sacrílego celebrar los comicios», escribe Cicerón (Sobre la adivinación II 42-43).</p><p>Donde cae un rayo se «entierra» (fulgur conditum) y se rodea con un brocal, el bidental. En el Foro hay uno famoso, el puteal de Libón, junto al que se reúnen los prestamistas.</p>':'<p>Para los griegos, el rayo es el arma de Zeus, que se la forjaron los Cíclopes. Un trueno, un relámpago o un terremoto son una diosemía, una «señal de Zeus»: si ocurre durante la Asamblea, se disuelve en el acto. Aristófanes se burla de los que la invocaban para librarse de una votación incómoda (Los acarnienses 170-171).</p><p>El sitio donde cae un rayo se cerca y queda consagrado a Zeus Kataibátes, «el que baja»: nadie puede pisarlo.</p>',[vmBye]),1200);}}
function wxTick(dt){if(!state)return;const w=wxz();if(w.man==='auto'&&wxNow()>=w.end)wxChange(wxPick());
  const k=wxK(),T=WX_T[k],a=Math.min(1,dt*0.35);const inside=player.feet>CASA.Y-50||(typeof fzIn==='function'&&fzIn())||(typeof cavIn==='function'&&cavIn());
  WXS.cl+=((inside?0:T.cl)-WXS.cl)*a;WXS.rain+=((inside?0:T.rain||0)-WXS.rain)*a;WXS.fog+=((inside?0:T.fog||0)-WXS.fog)*a;WXS.snow+=((inside?0:T.snow||0)-WXS.snow)*a;WXS.heat+=((T.heat&&clock.h>10&&clock.h<18?1:0)-WXS.heat)*a;
  // lluvia y nieve
  if(WXS.rain>0.02){if(!WXS.rainM)WXS.rainM=wxMakeRain();const m=WXS.rainM;m.visible=true;m.material.opacity=0.42*WXS.rain*(0.5+0.5*DAYF)+0.08;m.position.set(camera.position.x,camera.position.y-20,camera.position.z);
    const p=m.geometry.attributes.position.array,v=dt*(20+8*WXS.rain);for(let i=0;i<p.length;i+=6){p[i+1]-=v;p[i+4]-=v;if(p[i+4]<0){p[i+1]+=45;p[i+4]+=45;}}m.geometry.attributes.position.needsUpdate=true;}else if(WXS.rainM)WXS.rainM.visible=false;
  if(WXS.snow>0.02){if(!WXS.snowM)WXS.snowM=wxMakeSnow();const m=WXS.snowM;m.visible=true;m.material.opacity=0.85*WXS.snow;m.position.set(camera.position.x,camera.position.y-18,camera.position.z);
    const p=m.geometry.attributes.position.array,t=performance.now()/1000;for(let i=0;i<p.length;i+=3){p[i+1]-=dt*1.3;p[i]+=Math.sin(t+i)*dt*0.3;if(p[i+1]<0)p[i+1]+=40;}m.geometry.attributes.position.needsUpdate=true;}else if(WXS.snowM)WXS.snowM.visible=false;
  wxSound(WXS.rain>0.05&&ui==='play',0.09*WXS.rain);
  // relámpagos
  if(k==='tormenta'&&!inside){WXS.nextBolt-=dt;if(WXS.nextBolt<=0){WXS.nextBolt=6+Math.random()*16;wxBolt();}}
  if(WXS.flash>0||WXS.fl0){WXS.flash=Math.max(0,WXS.flash-dt*4);if(WXS.hb!==undefined)hemi.intensity=WXS.hb+WXS.flash*1.2;WXS.fl0=WXS.flash>0;}
  // viento
  if(T.wind&&typeof WIND!=='undefined'&&WIND.s)WIND.s.value=Math.max(WIND.s.value,k==='tormenta'?2.2:1.8);
  // la lluvia apaga la antorcha
  if(WXS.rain>0.4&&typeof TORCH!=='undefined'&&TORCH.on&&!inside){try{toggleTorch0wx();}catch(e){TORCH.on=false;}if(!WXS.torchMsg){WXS.torchMsg=true;toast('<span class="label">Se apaga la antorcha</span><br>La lluvia apaga la llama. Espera a que escampe, o resguárdate bajo techo.');}}
  if(WXS.rain<0.2)WXS.torchMsg=false;
  // el calor cansa: cada hora de juego al sol, entre la hora cuarta y la décima, sin beber
  if(WXS.heat>0.5&&!inside&&ui==='play'){WXS.heatE+=dt*clock.speed;if(WXS.heatE>=3&&!WXS.heatMsg){WXS.heatMsg=true;toast('<span class="label">Agotado por el calor</span><br>Caminas más despacio. Bebe del odre (casilla 4) o espera a que caiga la tarde.');}}else if(WXS.heat<0.2){WXS.heatE=Math.max(0,WXS.heatE-dt*clock.speed);if(WXS.heatE<1)WXS.heatMsg=false;}
  if(WXS.bow){WXS.bowT-=dt;WXS.bow.material.opacity=0.22*clamp(Math.min(WXS.bowT/10,(90-WXS.bowT)/6),0,1)*(1-WXS.cl);if(WXS.bowT<=0){scene.remove(WXS.bow);WXS.bow=null;}}}
// sin antorcha bajo la lluvia
// con lluvia, la antorcha no prende: en su lugar, un farol de cuerno (la llama va dentro de una caja con paredes de cuerno raspado), que alumbra menos
const toggleTorch0wx=toggleTorch;toggleTorch=function(){if(state&&typeof TORCH!=='undefined'&&!TORCH.on&&WXS.rain>0.4&&!(player.feet>CASA.Y-50)){TORCH.lantern=true;
  if(!state.seen['farol']){state.seen['farol']=1;toast('<span class="label">Un farol de cuerno</span><br>Con esta lluvia una antorcha no prendería: enciendes un farol, una lamparilla de aceite dentro de una caja con paredes de cuerno raspado, tan fino que deja pasar la luz. Alumbra menos, pero no se apaga.'+(MODE==='roma'?' Marcial hace hablar a uno: «guía del camino, llevo la llama encerrada, y la lamparilla va a salvo en mi seno» (Epigramas 14, 61).':''));}
  else toast('Enciendes el farol de cuerno.');return toggleTorch0wx();}
  if(TORCH&&TORCH.on)TORCH.lantern=false;return toggleTorch0wx();};
{const u0=updateTorch;updateTorch=function(dt,t){u0(dt,t);if(TORCH.on&&TORCH.lantern&&TORCH.light){TORCH.light.intensity*=0.62;if(TORCH.fl)TORCH.fl.scale.multiplyScalar(0.55);}};}
// el cielo, la luz y la niebla según el tiempo (sobre lo que ya calcula updateSky)
const updateSkyWx=updateSky;updateSky=function(){updateSkyWx();try{const c=WXS.cl,f=WXS.fog,r=WXS.rain;if(c<0.01&&f<0.01&&WXS.heat<0.01)return;
  WXS.hb=hemi.intensity;const gr=_c2.setRGB(0.55,0.58,0.62).multiplyScalar(0.18+0.82*DAYF);for(const u of['top','mid','bot'])SKY.uniforms[u].value.lerp(gr,c*0.8);SKY.uniforms.glow.value*=1-c;
  sun.intensity*=1-0.72*c;hemi.intensity*=1-0.2*c;WXS.hb=hemi.intensity;STARS.material.opacity*=1-c;
  const ov=(typeof CAV!=='undefined'&&CAV.ovr)||(typeof FZ!=='undefined'&&FZ.ovr);
  if(!ov&&scene.fog){scene.fog.color.lerp(gr,c*0.7);scene.fog.near*=1-0.75*f;scene.fog.far=Math.max(140,scene.fog.far*(1-0.8*f)*(1-0.35*r));if(WXS.heat>0)scene.fog.color.lerp(_c1.set('#e8d2a8'),WXS.heat*0.25);}}catch(e){}};
// la hora del HUD dice también el tiempo
const hourLabelWx=hourLabel;hourLabel=function(){const k=state?wxK():'sol';return hourLabelWx()+(k!=='sol'?' · '+WX_T[k].n:'');};
// ---- consecuencias en el juego
// el mar en invierno y con temporal
const sail0=sail;sail=function(from,to,land){if(!land&&wxK()==='tormenta'){closeDialog();toast('<span class="label">Ningún barco zarpa</span><br>Con este temporal, los capitanes no se mueven del puerto. Vuelve cuando escampe (o pasa unas horas con la T).');return;}
  if(!land){const mo=calNow().mo;if(mo>=10||mo<=1)setTimeout(()=>toast('<span class="label">El mar cerrado</span><br>Entre noviembre y marzo casi nadie navega: es el «mar cerrado» (mare clausum), como recuerda Vegecio. Por eso el pasaje te ha costado la mitad más.'),2600);}
  return sail0(from,to,land);};
const fareOfWx=fareOf;fareOf=function(from,to,land){const f=fareOfWx(from,to,land);if(land)return f;const mo=calNow().mo;return (mo>=10||mo<=1)?Math.round(f*1.5):f;};
// la Asamblea (o los comicios) se disuelve con una señal de Zeus o de Júpiter
const progActWx=progAct;progAct=function(o){if(o&&o.act==='pg:asamblea'&&wxK()==='tormenta'){vmS('ϟ',MODE==='roma'?'Los comicios':'La Asamblea','se disuelve',MODE==='roma'?'<p>Truena. El magistrado que preside levanta la sesión: cuando Júpiter truena, el pueblo no puede votar (Cicerón, Sobre la adivinación II 42-43). Vuelve otro día.</p>':'<p>Un trueno retumba sobre la Pnix. El heraldo grita: «¡Diosemía!», una señal de Zeus, y los prítanes disuelven la Asamblea. Hoy no se vota nada más. Vuelve otro día.</p>',[vmBye]);return;}return progActWx(o);};
// la granja: la lluvia riega; la sequía seca
const farmRain0=farmRain;farmRain=function(){const w=wxz(),k=wxK();if(WX_T[k].rain)return true;if(w.dry>=6)return false;return farmRain0();};
// la sequía y los ritos para pedir lluvia (se ofrecen en el amuleto, casilla 9)
function wxDayTick(){const w=wxz();if(!WX_T[wxK()].rain)w.dry=(w.dry||0)+1;if(w.dry===6&&calNow().mo>=4&&calNow().mo<=8)toast('<span class="label">Sequía</span><br>Seis días sin llover. Los campos se agrietan y las cisternas bajan. '+(MODE==='roma'?'Los romanos piden la lluvia con el aquaelicium.':'Los atenienses suben al Himeto a rezar a Zeus Ombrios, el de la lluvia.')+' Puedes unirte con tu amuleto (casilla 9).');save();}
const newDay0wx=newDay;newDay=function(){newDay0wx();try{wxDayTick();}catch(e){}};
function wxRite(){const ro=MODE==='roma',w=wxz();w.rite=1;w.end=Math.min(w.end,wxNow()+1);qAdd('eu',1);save();
  vmS(ro?'☔':'☔',ro?'El aquaelicium':'Zeus Ombrios','un rito para pedir la lluvia',ro?'<p>En las sequías, los pontífices sacan de junto a la Puerta Capena el lapis manalis, una piedra sagrada, y la llevan en procesión hasta la ciudad para que «salga el agua». Las matronas suben descalzas y con el pelo suelto la cuesta del Capitolio para rezar a Júpiter, como recuerda con nostalgia un personaje de Petronio (Satiricón 44). Caminas con ellas.</p><p class="sub">Fuentes: Festo, s.v. manalis lapis; Petronio, Satiricón 44. El juego hará que llueva pronto, pero eso no prueba nada: los romanos tampoco sabían si funcionaba. +1 Pietas</p>':'<p>Subes al Himeto con otros vecinos. En la cumbre están la estatua de Zeus Himetio y los altares de Zeus Ombrios, el de la lluvia, y de Apolo Proopsios, «el que ve de lejos» (Pausanias I 32, 2). Rezáis la oración más antigua del Ática: «Llueve, llueve, querido Zeus, sobre los campos y las llanuras de los atenienses».</p><p class="sub">Fuentes: Pausanias I 32, 2; Marco Aurelio, Meditaciones V 7. El juego hará que llueva pronto, pero eso no prueba nada: los atenienses tampoco sabían si funcionaba. +1 Eusébeia</p>',[vmBye]);}
const spMenu0=spMenu;spMenu=function(){spMenu0();try{const w=wxz();if(w.dry>=6&&!WX_T[wxK()].rain){const O=$('dOpts'),b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">✶</span><span>'+(MODE==='roma'?'Unirte al aquaelicium (hay sequía)':'Subir al Himeto a pedir lluvia a Zeus (hay sequía)')+'</span>';b.onclick=()=>wxRite();O.insertBefore(b,O.firstChild);}}catch(e){}};
// el beber del odre quita el agotamiento del calor
const hbOdre0=hbOdre;hbOdre=function(){const n0=hbz().odre;hbOdre0();if(hbz().odre<n0){WXS.heatE=0;WXS.heatMsg=false;}};
// ---- menú: elegir el tiempo (para clase y para las fotos)
function wxLabel(){const m=state?wxz().man:'auto';return 'Tiempo: '+(m==='auto'?'según la estación':WX_T[m].n);}
function wxCycle(){const w=wxz(),i=WX_ORDER.indexOf(w.man||'auto');w.man=WX_ORDER[(i+1)%WX_ORDER.length];if(w.man==='auto')w.end=0;save();toast('<span class="label">'+wxLabel()+'</span><br>'+(w.man==='auto'?'El tiempo cambiará solo, según la estación del año.':'El tiempo se queda así hasta que lo cambies en el menú.'));}
GM_IC.wx='<path d="M7 17h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.5 1.5A3.3 3.3 0 0 0 7 17z"/><path d="M9 20l-1 2M13 20l-1 2M17 20l-1 2"/>';

