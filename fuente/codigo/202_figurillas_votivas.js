// ============================================================ FIGURILLAS VOTIVAS: coleccionar el favor de los dioses
// En los santuarios griegos y romanos los fieles dejaban figurillas de barro cocido como ofrenda (exvotos): se han encontrado por miles,
// por ejemplo en los depósitos de la Acrópolis, en los santuarios de Deméter (mujeres con un lechón o una antorcha) o en los templos
// romanos (los sigilla). Aquí hay 18 por modo, tres de cada uno de seis dioses, escondidas cerca de los lugares del dios (en la ciudad y
// en los destinos). Reunir las tres de un dios da su favor, una ventaja de juego que va con su carácter; y cada 6, un título.
//  Hermes / Mercurio (caminos): andas un 10 % más deprisa · Atenea / Minerva (sabiduría): +1 moneda por cada lección nueva
//  Poseidón / Neptuno (el mar): los pasajes cuestan la mitad · Deméter / Ceres (el grano): cada mañana, pan y 2 monedas
//  Apolo (las Musas, la profecía): +1 moneda por cada estela nueva · Hefesto / Vulcano (el fuego): tu antorcha alumbra mucho más
const FG_GODS={atenas:[
 {k:'hermes',n:'Hermes',gr:'ΕΡΜΗΣ',re:/herm|mercado|ágora|agora|dípilon|heraldo|estadio|palestra|gimnasio/i,fig:'un joven con sombrero de ala ancha (pétaso) y un carnero al hombro (Hermes Crióforo)',fav:'Andas un 10 % más deprisa: Hermes protege a los caminantes.'},
 {k:'atenea',n:'Atenea',gr:'ΑΘΗΝΑ',re:/atenea|partenón|erecteion|propileos|acrópolis|pártenos/i,fig:'Atenea sentada en su trono, con el casco y la égida',fav:'Cada lección nueva te da una moneda más: Atenea premia a quien aprende.'},
 {k:'poseidon',n:'Poseidón',gr:'ΠΟΣΕΙΔΩΝ',re:/poseid|pireo|puerto|sunion|muelle|faro|istmo/i,fig:'una pequeña placa con Poseidón y su tridente (como las de los alfareros de Corinto)',fav:'Los pasajes en barco y en carro cuestan la mitad: Poseidón calma el mar.'},
 {k:'demeter',n:'Deméter',gr:'ΔΗΜΗΤΗΡ',re:/deméter|demeter|eleusi|eleusinion|perséfone|campo|trigo|granja/i,fig:'una mujer que sostiene un lechón y una antorcha, la ofrenda típica de las Tesmoforias',fav:'Cada mañana encuentras pan y 2 monedas: Deméter da el grano.'},
 {k:'apolo',n:'Apolo',gr:'ΑΠΟΛΛΩΝ',re:/apolo|apollo|delfos|pitia|liceo|délos|delos|musas/i,fig:'Apolo con la lira, como el citaredo de las Musas',fav:'Cada estela que lees por primera vez te da una moneda: Apolo, dios de las Musas, inspira a quien lee.'},
 {k:'hefesto',n:'Hefesto',gr:'ΗΦΑΙΣΤΟΣ',re:/hefest|herrer|fragua|cerámico|alfar|taller|laurión|minas/i,fig:'un herrero con gorro de fieltro (pilos) y martillo',fav:'Tu antorcha alumbra mucho más: Hefesto es el dios del fuego.'}],
 roma:[
 {k:'hermes',n:'Mercurio',gr:'MERCVRIVS',re:/mercur|mercado|foro|forum|emporio|macellum|vía apia|circo máximo/i,fig:'Mercurio con el pétaso alado, el caduceo y una bolsa de dinero',fav:'Andas un 10 % más deprisa: Mercurio protege a los caminantes y a los mercaderes.'},
 {k:'atenea',n:'Minerva',gr:'MINERVA',re:/minerva|capitolio|júpiter|jupiter|foro de augusto|biblioteca/i,fig:'Minerva con casco y escudo',fav:'Cada lección nueva te da una moneda más: Minerva protege a los que estudian y a los artesanos.'},
 {k:'poseidon',n:'Neptuno',gr:'NEPTVNVS',re:/neptun|ostia|puerto|tíber|tiber|isla|faro|portus/i,fig:'Neptuno con el tridente y un delfín',fav:'Los pasajes en barco y en carro cuestan la mitad: Neptuno calma el mar.'},
 {k:'demeter',n:'Ceres',gr:'CERES',re:/ceres|aventino|horrea|\bgrano|trigo|circo|annona/i,fig:'Ceres con espigas de trigo y una antorcha',fav:'Cada mañana encuentras pan y 2 monedas: Ceres da el grano (y Roma reparte el trigo).'},
 {k:'apolo',n:'Apolo',gr:'APOLLO',re:/apolo|apollo|palatino|sibila|marcelo|cumas|musas|juegos escénicos/i,fig:'Apolo con la lira, como en su templo del Palatino',fav:'Cada estela que lees por primera vez te da una moneda: Apolo, dios de las Musas, inspira a quien lee.'},
 {k:'hefesto',n:'Vulcano',gr:'VOLCANVS',re:/vulcan|volcanal|herrer|fragua|taller|fullonica|vesubio|etna/i,fig:'Vulcano con gorro de fieltro, tenazas y martillo',fav:'Tu antorcha alumbra mucho más: Vulcano es el dios del fuego.'}]};
const FG={objs:[],ready:false,glint:null};
function fgz(){if(!state.fg||typeof state.fg!=='object')state.fg={got:{}};return state.fg;}
function fgGods(){return FG_GODS[MODE==='roma'?'roma':'atenas'];}
function fgHas(k){const z=fgz();return [0,1,2].every(i=>z.got[k+i]);}
function fgCount(){return Object.keys(fgz().got).length;}
function fgTitle(n){const ro=MODE==='roma';return n>=18?(ro?'Amado de los dioses (pius)':'Amado de los dioses (theophilés)'):n>=12?(ro?'Devoto de los templos':'Devoto de los santuarios (eusebés)'):n>=6?'Visitante de los santuarios':'';}
// modelo: figurilla de barro (base, cuerpo de campana, cabeza y un atributo), con un brillo que se ve de cerca
function fgModel(G){const g=new THREE.Group(),tc=lam('#b8693e'),dk=lam('#8f4e2c');
  const b=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.08,0.03,10),dk);b.position.y=0.015;g.add(b);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.065,0.17,10),tc);body.position.y=0.115;g.add(body);
  const h=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,8),tc);h.position.y=0.225;g.add(h);
  const at=G.k==='atenea'?new THREE.Mesh(new THREE.ConeGeometry(0.032,0.04,8),dk):G.k==='poseidon'?new THREE.Mesh(new THREE.CylinderGeometry(0.004,0.004,0.24,4),dk):G.k==='hermes'?new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.008,10),dk):
    G.k==='demeter'?new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),lam('#c98a6a')):G.k==='apolo'?new THREE.Mesh(new THREE.TorusGeometry(0.03,0.006,6,10,Math.PI*1.4),dk):new THREE.Mesh(new THREE.BoxGeometry(0.025,0.05,0.018),dk);
  if(G.k==='atenea'||G.k==='hermes')at.position.y=0.26;else if(G.k==='poseidon'){at.position.set(0.05,0.15,0);}else{at.position.set(0.045,0.13,0.03);}g.add(at);
  if(!FG.glint){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),r=x.createRadialGradient(32,32,2,32,32,30);r.addColorStop(0,'rgba(255,236,170,1)');r.addColorStop(0.35,'rgba(255,200,110,.55)');r.addColorStop(1,'rgba(255,190,90,0)');x.fillStyle=r;x.fillRect(0,0,64,64);
    FG.glint=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});}
  const s=new THREE.Sprite(FG.glint);s.scale.set(0.7,0.7,1);s.position.y=0.16;g.add(s);g.userData.glint=s;g.scale.setScalar(1.6);return g;}
// dónde: tres lugares (estelas) del dios, repartidos; cada figurilla, a unos pasos de la estela, en sitio libre
function fgSetup(){if(FG.ready||!state||typeof PLACES==='undefined'||PLACES.length<20)return;FG.ready=true;const z=fgz(),used=new Set();
  const hash=s=>{let h=7;for(const ch of s)h=(h*31+ch.charCodeAt(0))%100003;return h;};
  for(const G of fgGods()){let L=PLACES.filter(p=>isFinite(p.x)&&G.re.test((p.name||'')+' '+(p.id||'')+' '+(p.greek||''))&&!used.has(p.id));
    L.sort((a,b)=>hash(a.id)-hash(b.id));const pick3=[];for(const p of L){if(pick3.every(q=>Math.hypot(q.x-p.x,q.z-p.z)>60))pick3.push(p);if(pick3.length>=3)break;}
    for(const p of L){if(pick3.length>=3)break;if(!pick3.includes(p))pick3.push(p);}
    while(pick3.length<3){const p=PLACES[(hash(G.k)+pick3.length*37)%PLACES.length];if(!pick3.includes(p))pick3.push(p);else break;}
    pick3.forEach((p,i)=>{used.add(p.id);const id=G.k+i;if(z.got[id])return;const a=(hash(id)%628)/100,d=3+hash(id+'d')%3;let f=null;try{f=findFree(p.x+Math.cos(a)*d,p.z+Math.sin(a)*d,0.5);}catch(e){}if(!f)f=[p.x+Math.cos(a)*d,p.z+Math.sin(a)*d];
      const g=fgModel(G);g.position.set(f[0],floorAt(f[0],f[1]),f[1]);g.rotation.y=a;scene.add(g);FG.objs.push({id,G,g,x:f[0],z:f[1],place:p.name});});}}
function fgTick(dt){if(!state)return;if(!FG.ready){fgSetup();return;}if(ui!=='play')return;const t=performance.now()/1000;
  for(let i=FG.objs.length-1;i>=0;i--){const o=FG.objs[i],d=Math.hypot(o.x-player.x,o.z-player.z);const near=d<45;o.g.visible=near;if(!near)continue;
    o.g.rotation.y+=dt*0.6;const s=o.g.userData.glint;if(s){const k=0.55+0.25*Math.sin(t*3+i);s.scale.set(k,k,1);}
    if(d<1.6&&Math.abs(floorAt(o.x,o.z)-player.feet)<1.5){fgTake(o);scene.remove(o.g);FG.objs.splice(i,1);}}
  fgFavTick(dt);}
function fgTake(o){const z=fgz();z.got[o.id]=1;save();const G=o.G,n=[0,1,2].filter(i=>z.got[G.k+i]).length,tot=fgCount();try{sfxCoin();}catch(e){}
  let h='<span class="label">Figurilla votiva · '+G.n+' ('+n+' de 3)</span><br>Encuentras '+G.fig+', de barro cocido: la dejó aquí un fiel como ofrenda.';
  if(n===3)h+='<br><b>Favor de '+G.n+':</b> '+G.fav;const T=fgTitle(tot);if(T&&T!==fgTitle(tot-1))h+='<br><b>Nuevo título:</b> '+T+' ('+tot+' figurillas).';
  MSG&&(MSG.lastIn=performance.now());toast(h);}   // se ve al momento (es respuesta a lo que acaba de hacer el alumno)
// ---- los favores
{const f=v2Spd;v2Spd=function(){return f.apply(this,arguments)*(state&&fgHas('hermes')?1.1:1);};}
{const f=fareOf;fareOf=function(){const r=f.apply(this,arguments);return state&&fgHas('poseidon')&&r>0?Math.ceil(r/2):r;};}
{const f=newDay;newDay=function(){const r=f.apply(this,arguments);try{if(state&&fgHas('demeter')){state.obols+=2;save();updateStats();toast('<span class="label">Favor de '+fgGods()[3].n+'</span><br>Al levantarte encuentras pan reciente y 2 monedas.');}}catch(e){}return r;};}
{const f=readSign;readSign=function(s){const nw=!!(s&&s.data&&state&&!state.places.includes(s.data.id));const r=f.apply(this,arguments);try{if(nw&&fgHas('apolo')){state.obols+=1;save();updateStats();}}catch(e){}return r;};}
{const f=updateTorch;updateTorch=function(dt,t){const r=f.apply(this,arguments);try{if(state&&fgHas('hefesto')&&TORCH.on&&TORCH.light){TORCH.light.intensity*=1.6;TORCH.light.distance=52;}else if(TORCH.light)TORCH.light.distance=34;}catch(e){}return r;};}
function fgFavTick(dt){const z=fgz(),n=(state.lessons||[]).length;if(z.ln===undefined){z.ln=n;return;}if(n>z.ln){if(fgHas('atenea')){state.obols+=n-z.ln;save();updateStats();}z.ln=n;}}
// ---- el panel (Menú › Aprender, junto al álbum de monedas)
function fgPanel(){const z=fgz(),tot=fgCount(),T=fgTitle(tot),ro=MODE==='roma';
  eduOverlay('fgBox','Figurillas votivas','<p>'+tot+' de 18'+(T?' · <b>'+T+'</b>':'')+'. En los santuarios '+(ro?'romanos':'griegos')+' los fieles dejaban figurillas de barro cocido como ofrenda. Búscalas cerca de los lugares de cada dios: brillan cuando estás cerca. Reúne las tres de un dios para ganar su favor.</p>'+
   '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px">'+fgGods().map(G=>{const n=[0,1,2].filter(i=>z.got[G.k+i]).length,ok=n===3;
     const where=FG.objs.filter(o=>o.G===G).map(o=>o.place).filter(Boolean);
     return '<div style="padding:9px;border:1px solid '+(ok?'#d9a948':'#6a4a30')+';border-radius:8px;'+(ok?'background:rgba(217,169,72,.1)':'')+'"><b>'+G.n+'</b> <span class="sub">'+G.gr+'</span><br>'+
       '<span style="font-size:1.3em;letter-spacing:4px">'+[0,1,2].map(i=>z.got[G.k+i]?'◆':'◇').join('')+'</span> '+n+' de 3'+
       '<p style="margin:6px 0 0;font-size:.9em">'+(ok?'<b>Favor:</b> '+G.fav:'<span class="sub">Al completarla: '+G.fav.split(':')[0]+'.</span>'+(where.length?'<br><span class="sub">Pistas: cerca de '+[...new Set(where)].slice(0,2).join(' y de ')+'.</span>':''))+'</p></div>';}).join('')+'</div>'+
   '<p class="sub" style="margin-top:8px">Títulos: 6 figurillas, «Visitante de los santuarios»; 12, «Devoto»; 18, «Amado de los dioses». Fuente: las figurillas de terracota aparecen por miles en los depósitos votivos (por ejemplo, el de la Acrópolis o el santuario de Deméter en Corinto).</p>');}
{const g0=gmRight;gmRight=function(d){g0(d);try{if((GM.page||'')!=='aprender')return;const L=d.querySelector('.gr .list');if(!L||L.querySelector('[data-fg]'))return;const b=document.createElement('button');b.dataset.fg=1;
  b.innerHTML=gmIc('journal')+'<span class="t">Figurillas votivas</span><span class="k">'+fgCount()+' de 18'+(fgTitle(fgCount())?' · '+fgTitle(fgCount()):'')+'</span>';b.onclick=()=>{gmClose();setTimeout(fgPanel,80);};L.appendChild(b);}catch(e){}};}
{const f=uxTick;uxTick=function(dt){f(dt);try{fgTick(dt);}catch(e){if(!FG.err){FG.err=1;console.warn('figurillas',e);}}};}
