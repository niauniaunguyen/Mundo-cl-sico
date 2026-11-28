// ============================================================ COLECCIONAR Y DESCUBRIR: monedas, el cuaderno de viaje y un perro
// P7. Álbum de monedas reales de la época: se encuentran por el suelo, se ganan en las actividades o se compran al cambista.
// P8. Cuaderno de viaje: cada fuente, altar, tumba, herma, mojón… que descubres (los que tienen ficha del modo atención) se apunta,
//     con metas, al modo de Pausanias, el viajero que describió Grecia lugar por lugar (siglo II d.C.).
// P9. Un perro: lo adoptas en el mercado, te sigue, persigue a los ladrones y escarba de vez en cuando hasta encontrar alguna moneda.
const COINS={atenas:[
 ['tetra','Tetradracma de Atenas','plata · unos 17 g','Atenea con casco a un lado; al otro, la lechuza, una rama de olivo y las letras ΑΘΕ. La moneda más famosa del Mediterráneo: por eso se dice «llevar lechuzas a Atenas».'],
 ['dracma','Dracma de Atenas','plata · unos 4,3 g','Seis óbolos. Es más o menos el jornal de un trabajador especializado.'],
 ['obolo','Óbolo de Atenas','plata · unos 0,7 g','Tan pequeño que mucha gente lo lleva en la boca para no perderlo, como cuenta Aristófanes. Es la paga diaria de un jurado… a medias: cobran tres.'],
 ['bronce406','Moneda de bronce plateado','bronce · 406 a.C.','En los últimos años de la guerra, Atenas acuñó bronce con un baño de plata. Aristófanes se burla de esa «moneda mala» en Las ranas (725-733). Pronto se retiró.'],
 ['egina','Estátera de Egina','plata · unos 12 g','Una tortuga marina; más tarde, de tierra. Las «tortugas» de Egina corrieron por toda Grecia antes que las lechuzas.'],
 ['corinto','Estátera de Corinto','plata · unos 8,6 g','El caballo alado Pegaso y la letra koppa: los «potros» de Corinto.'],
 ['darico','Dárico persa','oro · unos 8,4 g','El rey de Persia corriendo con arco y lanza. Con dáricos pagó Persia a unos y a otros en la guerra; con ellos se reconstruyeron los muros de Atenas.'],
 ['ciciceno','Ciciceno','electro (oro y plata)','Estátera de Cícico, en el mar de Mármara, con un atún. Muy usada en el comercio del mar Negro.'],
 ['siracusa','Tetradracma de Siracusa','plata','La ninfa Aretusa rodeada de delfines: de las monedas más bellas que se han hecho.'],
 ['tebas','Estátera de Tebas','plata','El escudo beocio, con sus dos escotaduras.']],
 roma:[
 ['aureo','Áureo de Tito','oro · unos 7,3 g','Veinticinco denarios. Con la cabeza laureada del emperador y su nombre y títulos alrededor.'],
 ['denario','Denario de Tito','plata · unos 3,4 g','Cuatro sestercios: el jornal de un trabajador. Algunos de este año llevan un elefante.'],
 ['sestercio_col','Sestercio del Anfiteatro','oricalco · 80-81 d.C.','Tito hizo acuñar sestercios con el anfiteatro recién terminado, visto desde arriba y lleno de gente: una de las monedas más famosas de Roma.'],
 ['sestercio','Sestercio','oricalco (latón)','La moneda de las cuentas: los precios se dan en sestercios.'],
 ['dupondio','Dupondio','oricalco','Dos ases. Se distingue del as porque el emperador lleva corona de rayos.'],
 ['as','As','cobre','Un cuarto de sestercio: lo que cuesta entrar en las termas son unos cuadrantes; un vaso de vino, un as.'],
 ['cuadrante','Cuadrante','bronce','La moneda más pequeña: un cuarto de as. «El cuadrante del baño».'],
 ['denario_cesar','Denario de César','plata · 49-48 a.C.','Un elefante pisando una serpiente. Las monedas viejas siguen circulando durante décadas.'],
 ['judaea','Sestercio «Judaea capta»','oricalco · 71 d.C.','Vespasiano y Tito celebran la toma de Jerusalén: una mujer llora bajo una palmera.'],
 ['nerón','Sestercio del puerto de Ostia','oricalco · Nerón','El puerto de Ostia visto desde arriba, con los barcos dentro.']]};
function coz(){const s=state;if(!s.coins)s.coins={have:{},n:0};return s.coins;}
function coinList(){return COINS[MODE==='roma'?'roma':'atenas'];}
function coinGive(id,why){const z=coz(),C=coinList().find(c=>c[0]===id);if(!C)return false;const nw=!z.have[id];z.have[id]=(z.have[id]||0)+1;save();
  toast('<span class="label">'+(nw?'Moneda nueva para tu álbum':'Otra moneda')+'</span><br>'+(why?why+' ':'')+'<b>'+C[1]+'</b>.');return true;}
function coinRandom(why){const L=coinList(),z=coz();const miss=L.filter(c=>!z.have[c[0]]);const pool=miss.length&&Math.random()<0.7?miss:L;return coinGive(pool[Math.floor(Math.random()*pool.length)][0],why);}
function coinAlbum(){const z=coz(),L=coinList();const n=L.filter(c=>z.have[c[0]]).length;
  eduOverlay('coinBox','Tu álbum de monedas','<p>'+n+' de '+L.length+' monedas. Se encuentran por el suelo (mira hacia abajo cuando algo brille), se ganan en las actividades o se compran al cambista ('+(MODE==='roma'?'los argentarii de la Basílica Emilia':'los trapezitas del Ágora')+').</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px">'+
    L.map(c=>{const h=z.have[c[0]];return '<div style="padding:8px;border:1px solid #6a4a30;border-radius:8px;'+(h?'':'opacity:.45')+'"><b>'+(h?c[1]:'¿?')+'</b>'+(h&&h>1?' ×'+h:'')+'<br><span class="sub">'+(h?c[2]:'aún no la tienes')+'</span>'+(h?'<p style="margin:6px 0 0;font-size:.9em">'+c[3]+'</p>':'')+'</div>';}).join('')+'</div>');}
// encontrar monedas por el suelo (raro; con perro, más) y premios de actividades
function coinTick(dt){if(!state||ui!=='play')return;const Z=coz();Z.acc=(Z.acc||0)+dt;if(Z.acc<20)return;Z.acc=0;if(player.x>8000)return;const moving=Math.hypot(GF.vx||0,GF.vz||0)>1;if(!moving)return;
  const p=DOG.on?0.12:0.035;if(Math.random()<p)coinRandom(DOG.on?'Tu perro escarba junto a un muro y saca algo del polvo:':'Algo brilla entre las piedras del suelo:');}
{const f=mgPay;mgPay=function(k,q,coins){f.apply(this,arguments);try{if(q>=0.9&&Math.random()<0.35)coinRandom('Además, te pagan con');}catch(e){}};}
{const f=huntTick;huntTick=function(dt){const was=state&&state.dyn&&state.dyn.hunt;f(dt);try{if(was!=='fin'&&state.dyn.hunt==='fin')coinGive(MODE==='roma'?'denario':'tetra','En el escondite está');}catch(e){}};}
// el cambista: vende una moneda que no tienes
function coinShop(){const z=coz(),miss=coinList().filter(c=>!z.have[c[0]]),ro=MODE==='roma';if(!miss.length){openInfo('El cambista','<p>«Ya tienes de todas las que yo tengo. ¡Eres mejor coleccionista que yo!»</p>');return;}
  const c=miss[0],price=ro?12:8;eduOverlay('coinBox','El cambista','<p>«Cambio monedas de todas partes: aquí llegan de cualquier puerto. Pesar, comprobar si son buenas, cambiarlas y prestar a interés: ese es mi oficio». Te ofrece <b>'+c[1]+'</b> por '+price+' '+(ro?'sestercios':'óbolos')+'.</p><div id="coO"></div>');
  $('coO').appendChild(mgBtn('Comprarla',()=>{if((state.obols||0)<price){toast('No tienes bastante.');return;}state.obols-=price;updateStats();coinGive(c[0],'Te la llevas:');document.getElementById('coinBox').remove();ui='play';}));}
// ---------------------------------------------------------------- P8. cuaderno de viaje
const CUAD_K={spring:'Fuentes',lacus:'Fuentes',compitum:'Altares de barrio',altar:'Altares',herm:'Hermas',tomb:'Tumbas',estelaf:'Tumbas',mile:'Mojones y miliarios',wtower:'Torres de la muralla',
  rostral:'Monumentos',rostra:'Monumentos',tambores:'Monumentos',st_honor:'Estatuas',st_marble:'Estatuas',st_bronze:'Estatuas',tesoro:'Tesoros de templo',aerarium:'Tesoros de templo',puesto:'Mercado',letrero:'Mercado',cave:'Cuevas',ruins:'Ruinas',tumulus:'Tumbas',obelisk:'Monumentos',spring2:'Fuentes'};
function cuz(){const s=state;if(!s.cuad)s.cuad={seen:{},n:0};return s.cuad;}
function cuadTick(dt){if(!state||ui!=='play'||player.x>8000)return;const Z=cuz();Z.acc=(Z.acc||0)+dt;if(Z.acc<1)return;Z.acc=0;const i0=Math.floor(player.x/40),j0=Math.floor(player.z/40);
  for(let i=i0-1;i<=i0+1;i++)for(let j=j0-1;j<=j0+1;j++){const a=ATR.get(i+','+j);if(!a)continue;for(const o of a){const cat=CUAD_K[o.k];if(!cat)continue;if(Math.hypot(o.x-player.x,o.z-player.z)>6)continue;const key=MODE[0]+o.k+'|'+Math.round(o.x)+'|'+Math.round(o.z);if(Z.seen[key])continue;Z.seen[key]=cat;Z.n++;
      const n=Z.n;if([5,15,40,80,150].includes(n)){qAdd('so',1,'Tu cuaderno de viaje crece.');toast('<span class="label">Cuaderno de viaje</span><br>Ya llevas '+n+' rincones apuntados. Míralo en Aprender › Cuaderno de viaje.');}save();}}}
function cuadOpen(){const Z=cuz(),by={};for(const k in Z.seen){if(k[0]!==MODE[0])continue;by[Z.seen[k]]=(by[Z.seen[k]]||0)+1;}const tot=Object.values(by).reduce((a,b)=>a+b,0);const goals=[5,15,40,80,150],next=goals.find(g=>g>tot);
  eduOverlay('cuadBox','Cuaderno de viaje','<p>Has apuntado <b>'+tot+'</b> rincones'+(next?' · siguiente meta: '+next:' · ¡todas las metas!')+'.</p><ul>'+Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([k,v])=>'<li>'+k+': '+v+'</li>').join('')+'</ul><p class="sub">Así viajaba Pausanias, que en el siglo II d.C. recorrió Grecia apuntando cada templo, estatua, tumba y fuente, y lo que la gente del lugar le contaba de ellos (Descripción de Grecia). Gracias a él sabemos dónde estaban muchas cosas que ya no existen. Acércate a fuentes, altares, tumbas, mojones o estatuas para apuntarlos.</p>');}
// ---------------------------------------------------------------- P9. un perro
const DOG={on:null};
function dogMake(){const z=coz();const A=animal('dog',{coat:'#8a6a4a'});if(!A||!A.g)return null;scene.add(A.g);return A;}
function dogAdopt(){const z=coz(),ro=MODE==='roma';if(z.dog){openInfo('El perro','<p>Ya tienes perro: '+z.dog+'.</p>');return;}const price=ro?5:3;
  eduOverlay('dogBox','Un cachorro','<p>Un vendedor tiene una camada de cachorros. «Buenos perros: guardan la casa y avisan de los ladrones. '+price+' '+(ro?'sestercios':'óbolos')+'». ¿Cómo lo llamarás?</p><input id="dogN" maxlength="16" value="'+(ro?'Ferox':'Argos')+'" style="font:inherit;padding:6px"><div id="dogO"></div><p class="sub">'+(ro?'En la entrada de muchas casas romanas hay un mosaico con un perro y el aviso CAVE CANEM, «cuidado con el perro».':'Argos es el perro de Ulises, el único que lo reconoce al volver a casa después de veinte años (Odisea 17, 290-327).')+'</p>');
  const I=$('dogN');I.onkeydown=e=>e.stopPropagation();$('dogO').appendChild(mgBtn('Adoptarlo',()=>{if((state.obols||0)<price){toast('No tienes bastante.');return;}state.obols-=price;updateStats();z.dog=netClean(I.value,16)||(ro?'Ferox':'Argos');save();document.getElementById('dogBox').remove();ui='play';dogSpawn();toast('<span class="label">'+z.dog+'</span><br>Tu perro te sigue a todas partes. Ladra a los ladrones y a veces escarba y encuentra algo.');}));}
function dogSpawn(){if(DOG.on||!coz().dog||player.x>8000)return;const A=dogMake();if(!A)return;A.g.position.set(player.x+1.5,floorAt(player.x+1.5,player.z),player.z);DOG.on={A,ph:0};}
function dogTick(dt){if(!state)return;const z=coz();if(!z.dog)return;if(!DOG.on){dogSpawn();return;}const D=DOG.on,g=D.A.g;if(player.x>8000||MOUNT.riding&&false){g.visible=false;return;}g.visible=ui!=='episode';
  const P=player,bx=P.x+Math.sin(P.yaw)*1.8+Math.cos(P.yaw)*0.9,bz=P.z+Math.cos(P.yaw)*1.8-Math.sin(P.yaw)*0.9;let tx=bx,tz=bz;
  if(THF.on){tx=THF.on.x;tz=THF.on.z;}const dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);
  if(d>40){g.position.set(bx,floorAt(bx,bz),bz);return;}const sp=Math.min(d,(d>4?9:3)*dt);if(d>0.4){const q={x:g.position.x+dx/d*sp,z:g.position.z+dz/d*sp};resolve(q,0.3);g.position.set(q.x,floorAt(q.x,q.z),q.z);g.rotation.y=Math.atan2(dx,dz);D.ph+=sp*4;
    (D.A.legs||[]).forEach((l,i)=>{if(l)l.rotation.x=Math.sin(D.ph+(i%2?Math.PI:0))*0.5;});}
  if(THF.on&&d<1.6&&!THF.on.dog){THF.on.dog=1;THF.on.t=Math.max(THF.on.t,0);toast(z.dog+' alcanza al ladrón y le muerde el manto: ¡ahora corre más despacio!');}}
// el ladrón corre menos si el perro lo ha mordido
{const f=thfTick;thfTick=function(dt){if(THF.on&&THF.on.dog)dt*=0.6;f(dt);};}
// ---------------------------------------------------------------- dónde y menú
function coSetup(){const ro=MODE==='roma',L=ro?[['ro_basilica_emilia',8,12,'co:shop','El cambista','monedas de todas partes'],['ro_macellum',8,-6,'co:dog','Cachorros en venta','un perro']]:[['mercado',-8,10,'co:shop','El cambista (trapezita)','monedas de todas partes'],['mercado',12,6,'co:dog','Cachorros en venta','un perro']];
  for(const[id,dx,dz,act,n,sub]of L){const p=(PLACES||[]).find(q=>q.id===id);if(!p)continue;let x=p.x+dx,z=p.z+dz;for(let k=0;k<8&&!isFree(x,z,0.8);k++){x+=1.5;z-=1;}egxObj(x,z,undefined,act,n,sub,2.6);}}
{const f=egxAct0;egxAct0=function(o){const a=String(o.act);if(a==='co:shop')return coinShop();if(a==='co:dog')return dogAdopt();return f(o);};}
{const g0=gmRight;gmRight=function(d){g0(d);try{if((GM.page||'')!=='aprender')return;const L=d.querySelector('.gr .list');if(!L||L.querySelector('[data-co]'))return;
  for(const[t,sub,fn]of[['Álbum de monedas',coinList().filter(c=>coz().have[c[0]]).length+' de '+coinList().length,coinAlbum],['Cuaderno de viaje',cuz().n+' rincones apuntados',cuadOpen]]){const b=document.createElement('button');b.dataset.co=1;b.innerHTML=gmIc('journal')+'<span class="t">'+t+'</span><span class="k">'+sub+'</span>';b.onclick=()=>{gmClose();setTimeout(fn,80);};L.appendChild(b);}}catch(e){}};}
{const f=uxTick;uxTick=function(dt){f(dt);for(const t of[coinTick,cuadTick,dogTick]){try{t(dt);}catch(e){}}};}
