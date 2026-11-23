// ============================================================ Dédalo, encerrado en su propio laberinto, y las alas de cera
// Misión: recoger siete plumas por el palacio del sueño de Cnosos. Premio: alas para volar (X), con el aviso de Ícaro: si subes demasiado, la cera se funde.
const DAED={g:null,x:0,z:0,lb:null,mk:null,kind:'daedalo',data:{name:'Dédalo',role:'el arquitecto del laberinto'}},FEATHERS=[];
const FLY={on:false,melt:0,warn:0,ind:null};
function wz(){if(!state.wings||typeof state.wings!=='object')state.wings={q:'',got:[],own:false};if(!Array.isArray(state.wings.got))state.wings.got=[];return state.wings;}
function buildDaedalus(){if(MODE!=='atenas'||!KNOS.maze)return;const M2=KNOS.maze,Y=KNOS.y;
  DAED.x=M2.x0+2.5;DAED.z=M2.z0+2.5;   // en el rincón más apartado del laberinto
  const g=makePerson({noVary:true,chiton:'#cdbf9f',himation:'#5a4a3a',beard:true,hair:'#bdb6aa',beardC:'#cfc8bc',staff:true});g.position.set(DAED.x,Y,DAED.z);g.rotation.y=Math.PI*0.75;scene.add(g);DAED.g=g;
  const lb=labelSprite('Dédalo','arquitecto ateniense',false);lb.position.y=2.45;lb.visible=false;g.add(lb);DAED.lb=lb;const mk=markerSprite();mk.position.y=2.95;g.add(mk);DAED.mk=mk;
  box(1.6,0.9,0.8,lam('#7a5a3a'),M2.x0+1.4,Y+0.45,M2.z0+3.8);   // su mesa de trabajo
  const spots=[[0,8],[-6,44],[-32,60],[45,-40],[-45,-30],[-10,-40],[60,70]];
  spots.forEach((s,i)=>{let f=findFree(KNOS.x+s[0],KNOS.z+s[1],0.6);if(Math.abs(floorAt(f[0],f[1])-Y)>1)f=[KNOS.x+(i-3)*3,KNOS.z+20];
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:FEATHER_TEX,transparent:true,depthWrite:false}));sp.scale.set(0.9,1.4,1);sp.position.set(f[0],Y+1.1,f[1]);sp.visible=false;scene.add(sp);
    FEATHERS.push({i,sp,x:f[0],z:f[1]});});
  wingsRefresh();}
const FEATHER_TEX=(()=>{const c=document.createElement('canvas');c.width=64;c.height=128;const x=c.getContext('2d');
  x.fillStyle='rgba(255,236,170,0.35)';x.beginPath();x.arc(32,64,30,0,TAU);x.fill();
  x.strokeStyle='#5a4a3a';x.lineWidth=3;x.beginPath();x.moveTo(32,120);x.lineTo(32,12);x.stroke();
  x.fillStyle='#f3eee2';x.beginPath();x.moveTo(32,12);x.quadraticCurveTo(58,50,34,104);x.quadraticCurveTo(8,50,32,12);x.fill();
  x.strokeStyle='#c9bfae';x.lineWidth=1;for(let y=24;y<100;y+=7){x.beginPath();x.moveTo(32,y);x.lineTo(50,y-6);x.moveTo(32,y);x.lineTo(14,y-6);x.stroke();}
  return new THREE.CanvasTexture(c);})();
function wingsRefresh(){const w=wz();for(const f of FEATHERS)f.sp.visible=w.q==='on'&&!w.got.includes(f.i);if(DAED.mk)DAED.mk.visible=!w.own;}
function daedalusTalk(){const w=wz();dlg={n:null};ui='dialog';releasePointer();
  $('dGlyph').textContent='Δ';setName('Dédalo');$('dTitle').textContent='Arquitecto ateniense, prisionero del rey Minos · personaje mítico';
  const o=$('dOpts');o.innerHTML='';let k=1;const add=(txt,fn,cls)=>{const b=document.createElement('button');if(cls)b.className=cls;b.innerHTML='<span class="n">'+(k++)+'</span><span>'+txt+'</span>';b.onclick=fn;o.appendChild(b);};
  if(w.own){$('dBody').innerHTML='<p>¿Qué tal vuelan mis alas? Recuerda: ni muy bajo, que el mar empapa las plumas, ni muy alto, que el sol derrite la cera. Por el camino de en medio.</p>';add('Despedirse',closeDialog);}
  else if(w.q===''){$('dBody').innerHTML='<p>¿Un visitante? ¿Y vivo? Soy Dédalo, ateniense, el mejor artesano de la tierra… o eso decían. Yo construí este laberinto para el rey Minos. Y Minos, para que nadie conozca su secreto, me ha encerrado en él con mi hijo Ícaro, que ahora duerme ahí detrás.</p><p>Minos es dueño de la tierra y del mar. Pero no del aire. Las gaviotas dejan caer plumas grandes por todo el palacio. Tráeme siete, y con hilo y cera de abejas te haré unas alas como las nuestras.</p>';
    add('Te traeré las siete plumas',()=>{w.q='on';save();wingsRefresh();$('dBody').innerHTML='<p>Busca por el patio, junto a las alas del palacio y los almacenes. Brillan un poco al sol. Ojo: cada una está junto al nido de una gaviota, y no te dejarán acercarte. Llévate pescaditos secos de mi cesta y échaselos con <b>E</b>: mientras comen, coge la pluma. Y date prisa: no sé cuánto tiempo seguirá Minos sin vigilar este rincón.</p>';o.innerHTML='';k=1;add('Ir a buscarlas',closeDialog);},'quiz');
    add('Despedirse',closeDialog);}
  else if(w.got.length<FEATHERS.length){$('dBody').innerHTML='<p>Llevas '+w.got.length+' de '+FEATHERS.length+' plumas. Busca por todo el palacio: el patio, los almacenes de las grandes tinajas, los pórticos.</p>';add('Seguir buscando',closeDialog);}
  else{$('dBody').innerHTML='<p>¡Siete! Mira: las coso por los cañones con hilo de lino, las pequeñas las pego con cera, y las curvo un poco, como las de un ave de verdad. Ya está.</p><p>Escúchame bien, como se lo digo a Ícaro cada día: no vueles demasiado bajo, que la humedad del mar pesa en las plumas, ni demasiado alto, que el sol derrite la cera. Sígueme a mí, por el camino de en medio.</p><p class="sub">Ovidio cuenta que Ícaro, feliz de volar, subió demasiado: la cera se fundió y cayó al mar que hoy lleva su nombre. Dédalo llegó a Sicilia.</p>';
    add('Ponerse las alas',()=>{w.own=true;w.q='done';qAdd('kl',2,'Dicen que has volado como Dédalo.');save();wingsRefresh();sfxCoin();closeDialog();toast('<span class="label">Alas de cera</span><br>Sal del laberinto y, ya al aire libre, pulsa <b>X</b> para desplegarlas y volver a plegarlas. Espacio para subir, C para bajar, Shift para planear deprisa. ¡No subas demasiado!');updateStats();});}
  $('dialog').hidden=false;setTimeout(()=>{const b=o.querySelector('button');b&&b.focus({preventScroll:true});},30);
}
function wingsTick(dt){const w=wz();
  if(DAED.g){const d=Math.hypot(DAED.x-player.x,DAED.z-player.z);DAED.lb.visible=d<12;if(DAED.mk.visible)DAED.mk.position.y=2.95+Math.sin(performance.now()/500)*0.08;}
  if(w.q==='on')for(const f of FEATHERS){if(!f.sp.visible)continue;f.sp.position.y=KNOS.y+1.1+Math.sin(performance.now()/400+f.i)*0.15;
    if(ui==='play'&&Math.hypot(f.x-player.x,f.z-player.z)<2&&Math.abs(player.feet-KNOS.y)<4){w.got.push(f.i);f.sp.visible=false;save();sfxCoin();
      toast('<span class="label">Pluma '+w.got.length+' de '+FEATHERS.length+'</span><br>'+(w.got.length<FEATHERS.length?'Sigue buscando por el palacio.':'¡Ya las tienes todas! Vuelve al rincón del laberinto donde espera Dédalo.'));}}
  if(FLY.melt>0){FLY.melt-=dt;if(FLY.melt<=0)toast('Has rehecho la cera de las alas, como te enseñó Dédalo. Pulsa <b>X</b> para volar.');}
  if(!FLY.on)return;const alt=player.feet-terrainH(player.x,player.z);if(alt>300){FLY.on=false;return;}
  if(alt>95&&FLY.warn<=0){FLY.warn=6;toast('<span class="label">¡Cuidado!</span><br>Hace calor tan cerca del sol: la cera empieza a ablandarse. Baja un poco.');}FLY.warn-=dt;
  if(alt>125){FLY.on=false;FLY.melt=30;toast('<span class="label">Como Ícaro</span><br>Has subido demasiado: la cera se derrite y las plumas se sueltan. Caes planeando como puedes…');}
}
function toggleWings(){if(ui!=='play')return;const w=wz();if(!w.own)return;
  if(FLY.melt>0){toast('Las alas aún se están rehaciendo: espera un poco.');return;}
  if(MOUNT.riding){toast('Baja antes del caballo: no es buena idea volar con él.');return;}
  // el laberinto de Creta y la Gran Pirámide son interiores construidos muy por encima del terreno: allí no se puede volar
  if(!FLY.on&&player.feet-terrainH(player.x,player.z)>300){toast(Math.abs(player.feet-KNOS.y)<30?'<span class="label">Entre muros</span><br>Aquí dentro, entre los muros del laberinto, no hay sitio para desplegar las alas. Sal al aire libre, como hicieron Dédalo e Ícaro, y vuela desde allí.':'Aquí dentro no hay sitio para desplegar las alas. Sal al aire libre.');return;}
  FLY.on=!FLY.on;if(FLY.on){player.vy=4;player.grounded=false;toast('Despliegas las alas. Espacio para subir, C para bajar. Pulsa <b>X</b> para plegarlas.');}}
function flyMove(nx,nz){const fl=floorAt(nx,nz);if(fl>player.feet-0.3)return tryMove(nx,nz);if(rfWall(nx,nz))return false;
  if(nx<8000){nx=clamp(nx,INNER.x-INNER.size/2+20,INNER.x+INNER.size/2-20);nz=clamp(nz,INNER.z-INNER.size/2+20,INNER.z+INNER.size/2-20);}
  else{const q={x:nx,z:nz};sqClamp(q);nx=q.x;nz=q.z;}   // destinos: el cuadrado de su escenario (antes, 1,38·R)
  player.x=nx;player.z=nz;return true;}
