// ============================================================ CORRECCIONES DEL VÍDEO DE PRUEBA (21/11): personajes
// 1. Estatuas: cualquier figura hecha con materiales de estatua (attrRoles) o con piel, pelo y ropa del mismo color es una estatua:
//    se queda quieta (sin respirar) y de piedra o de metal (186). Antes, las que no reconocía se convertían en personas que respiraban.
// 2. Modelos nuevos también para quien se quedaba con el antiguo: dioses y musas (con su brillo), soldados con casco, figuras con
//    atributos y niños pequeños (escala 0,45-0,6). Las figuritas diminutas (exvotos, adornos) siguen como estaban.
// 3. Más figuras con el modelo nuevo a la vez (BP.K): de lejos se veían muchos modelos antiguos.
const C21={};
{const f=stKind;stKind=function(c){const r=f(c);if(r||!c||c.glow||c.mask)return r;try{const n=s=>(s||'').toLowerCase(),sk=n(c.skin),hr=n(c.hair),ch=n(c.chiton);
  const same=sk&&ch&&sk===ch&&(!hr||hr===sk);if(!c.attrRoles&&!same)return null;const k=new THREE.Color(c.skin||c.chiton||'#ece4d6'),h={};k.getHSL(h);
  return h.l>0.72?'marble':(h.s>0.35&&h.l>0.45&&h.h>0.09&&h.h<0.16)?'gold':'bronze';}catch(e){return null;}};}
{const f=bpKind;bpKind=function(c){let r=f(c);if(r||!c)return r;if(c.statue||c.stKind)return null;
  if(c.scale&&c.scale<0.45)return null;   // figuritas y exvotos
  const ro=MODE==='roma';
  if(c.helmet||c.soldier)return ro?'legionario':'hoplita';
  if(c.glow||c.attrs||c.mask||(c.scale&&c.scale<0.6)){if(c.female)return ro?'romana':'mujer';if(c.toga&&ro)return 'togado';if(ro&&(c.short||c.noHimation))return 'tunicado';return ro?'togado':'ciudadano';}
  return r;};}
{const f=bpMake;bpMake=function(k,c){const g=f.apply(this,arguments);try{if(g&&c&&c.scale&&c.scale<0.6&&c.scale>=0.45){g.scale.multiplyScalar(c.scale);g.userData.young=1;BP_YOUNG.add(g);}
  if(g&&c&&c.glow&&typeof TORCH_TEX!=='undefined'){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:c.glow,transparent:true,opacity:0.32,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(2.2,2.8,1);s.position.y=1.0;g.add(s);}}catch(e){}return g;};}   // dioses y musas: un halo suave (la figura antigua brillaba)
// las estatuas convertidas no deben tener la figura nueva animada: si alguna llega a bpConv, se marca y no se convierte
{const f=bpConv;bpConv=function(g,force){try{if(g&&g.userData&&(g.userData.stKind||g.userData.cfg&&stKind(g.userData.cfg)))return null;}catch(e){}return f.apply(this,arguments);};}
try{if(!ACC.lite)BP.K=Math.max(BP.K,typeof isTouch!=='undefined'&&isTouch?28:60);}catch(e){}
// 4. No se habla a través de las paredes: entre el jugador y el personaje (o dios) no puede haber muro. Los carteles y relieves, que
//    están en la pared misma, no cuentan.
function c21Blocked(x,z){const dx=x-player.x,dz=z-player.z,d=Math.hypot(dx,dz);if(d<1.4)return false;for(let t=0.45;t<d-0.9;t+=0.35){const px=player.x+dx/d*t,pz=player.z+dz/d*t;if(!isFree(px,pz,0.04))return true;}return false;}
{const f=findFocus;findFocus=function(){const b=f.apply(this,arguments);try{if(b&&(b.kind==='npc'||b.kind==='god'||b.kind==='actor'||b.kind==='story'||b.kind==='captain')&&isFinite(b.x)&&c21Blocked(b.x,b.z))return null;}catch(e){}return b;};}
// 5. La columna de luz del mentor (G) sale también en la brújula, en dorado
{const f=drawCompass;drawCompass=function(){f.apply(this,arguments);try{if(typeof MTR==='undefined'||!MTR.beacon)return;const el=$('compass'),W=el.clientWidth,fov=110,head=-player.yaw*180/Math.PI,b0=MTR.beacon.position;
  const b=Math.atan2(b0.x-player.x,-(b0.z-player.z))*180/Math.PI;let d=((b-head+540)%360)-180;d=clamp(d,-fov/2+3,fov/2-3);const s=document.createElement('span');s.className='c obj';s.style.cssText='left:'+(W/2+d/fov*W)+'px;color:#ffcf6a;text-shadow:0 0 6px #ffb030';s.textContent='✦';el.appendChild(s);}catch(e){}};}
// 6. Al elegir un objeto de la barra por primera vez, qué es y para qué sirve (con la tecla R se usa)
const C21_HB={antorcha:'Alumbra de noche y en las cuevas.',tablilla:'Tu tablilla de cera: abre el diario, con las misiones y lo que has aprendido.',bolsa:'Tu bolsa: el dinero que llevas.',odre:'Agua para beber: te quita el cansancio del calor.',
  strigil:'Para el gimnasio o las termas: te untas de aceite, haces ejercicio y te rascas el sudor y el polvo con la hoja curva. Úsalo allí y te sentirás (y olerás) mejor.',caballo:'Llama a tu caballo.',alas:'Las alas de Dédalo: para volar (¡sin acercarte al sol!).',rollo:'Un rollo de papiro para leer.',amuleto:'Un amuleto que llevas encima.'};
{const f=hbSelect;hbSelect=function(i){f.apply(this,arguments);try{const it=hbSlots()[HBAR.sel];if(!it||!it.has())return;const z=state.c21=state.c21||{};z.hb=z.hb||{};if(z.hb[it.k])return;z.hb[it.k]=1;save();
  toast('<span class="label">'+it.n()+'</span><br>'+(C21_HB[it.k]||'')+' <span class="sub">Pulsa <b>R</b>'+(isTouch?' (o tócalo otra vez)':'')+' para usarlo.</span>');}catch(e){}};}
// 7. Las tabas, visuales: cuatro huesecillos dibujados que ruedan y caen; cada cara con su nombre y su valor
// (las caras: la ancha y plana «pranés» 3, la ancha y cóncava «hyptios» 4, la estrecha «kõon» 6 y la estrecha con la hendidura «chíon» 1;
//  las estrechas salen menos, por eso el 1 y el 6 son raros)
{const st=document.createElement('style');st.textContent='@keyframes c21roll{0%{transform:translateY(-60px) rotate(0)}60%{transform:translateY(6px) rotate(560deg)}80%{transform:translateY(-6px) rotate(700deg)}100%{transform:translateY(0) rotate(720deg)}}.c21t{display:inline-block;margin:6px;animation:c21roll .9s ease-out both}.c21row{display:flex;justify-content:center;gap:4px;margin:6px 0}';document.head.appendChild(st);}
function c21Talus(v,i){const pip={1:'·',3:'∴',4:'∷',6:'⁂'}[v],w=v===1||v===6?36:52;return '<span class="c21t" style="animation-delay:'+(i*0.12)+'s"><svg width="64" height="64" viewBox="0 0 64 64"><path d="M'+(32-w/2)+' 18 Q32 6 '+(32+w/2)+' 18 Q'+(32+w/2+8)+' 32 '+(32+w/2)+' 46 Q32 58 '+(32-w/2)+' 46 Q'+(32-w/2-8)+' 32 '+(32-w/2)+' 18Z" fill="#e8dcc0" stroke="#8a7a5a" stroke-width="2"/><text x="32" y="38" text-anchor="middle" font-size="18" fill="#5a4a3a">'+v+'</text><text x="32" y="52" text-anchor="middle" font-size="11" fill="#8a7a5a">'+pip+'</text></svg></span>';}
taliOpen=function(n){const ro=MODE==='roma',coin=ro?'sestercio':'óbolo';if((state.obols||0)<1){toast('No tienes dinero para apostar.');return;}
  const roll=()=>[0,0,0,0].map(()=>{const r=Math.random();return r<0.1?1:r<0.5?3:r<0.9?4:6;});   // las caras estrechas (1 y 6) salen menos
  const score=r=>{const u=new Set(r).size;if(u===4)return{v:100,t:ro?'¡Venus! (las cuatro distintas)':'¡Afrodita! (las cuatro distintas)'};if(r.every(x=>x===1))return{v:-1,t:'el perro (cuatro unos)'};return{v:r.reduce((a,b)=>a+b,0),t:'suma '+r.reduce((a,b)=>a+b,0)};};
  eduOverlay('taliBox',ro?'Tabas (tali)':'Tabas (astrágaloi)','<p>'+n.name+' saca cuatro tabas, huesecillos de cordero con cuatro caras que valen 1, 3, 4 y 6. «¿Una partida? Una moneda»</p><div id="taliB" style="text-align:center"></div><div id="taliO" class="lrnRow" style="justify-content:center"></div><p class="sub">La mejor tirada es la que saca las cuatro caras distintas: «Venus» para los romanos, «Afrodita» para los griegos; la peor, cuatro unos, «el perro». Las caras estrechas (1 y 6) salen menos. Augusto jugaba a esto con sus amigos y lo cuenta en sus cartas (Suetonio, Augusto 71).</p>');
  const B=$('taliB'),O=$('taliO');const go=()=>{const a=roll(),b=roll(),sa=score(a),sb=score(b),win=sa.v>sb.v?1:sa.v<sb.v?-1:0;state.obols+=win;save();updateStats();
    B.innerHTML='<div><b>Tú</b></div><div class="c21row">'+a.map(c21Talus).join('')+'</div><div>'+sa.t+'</div><div style="margin-top:10px"><b>'+n.name+'</b></div><div class="c21row">'+b.map((v,i)=>c21Talus(v,i+4)).join('')+'</div><div>'+sb.t+'</div>';O.innerHTML='';
    setTimeout(()=>{if(!$('taliBox'))return;B.insertAdjacentHTML('beforeend','<p style="font-size:1.2em"><b>'+(win>0?'¡Ganas un '+coin+'!':win<0?'Pierdes un '+coin+'.':'Empate.')+'</b></p>');if((state.obols||0)>0)O.appendChild(mgBtn('Tirar otra vez',go));},1300);};
  O.appendChild(mgBtn('Tirar las tabas',go));};
// 8. Modo atención: una estatua sin nombre propio junto a un lugar con nombre (a menos de 15 m) es parte de ese lugar (los Héroes
//    Epónimos: al mirar las estatuas de arriba salía «Estatua de bronce» y no el monumento); y los personajes de la historia también se marcan
{const f=atCands;atCands=function(){const C=f.apply(this,arguments);try{const gen=new Set(Object.values(ST_NOTE).map(n=>n[0]));
  for(const c of C){if(c.place||!gen.has(c.name))continue;let best=null,bd=15;for(const p of PLACES){if(!isFinite(p.x))continue;const d=Math.hypot(p.x-c.x,p.z-c.z);if(d<bd){bd=d;best=p;}}
    if(best){const t0=c.txt;c.name=best.name;c.sub=(c.sub?c.sub+' · ':'')+'parte del monumento';c.txt=()=>atFirst(best.text)+' '+(typeof t0==='function'?t0():'');}}
  for(const a of storyActors||[]){if(!a.g||!a.g.visible)continue;C.push({obj:a.g,x:a.x,y:floorAt(a.x,a.z)+1.4,z:a.z,r:0.9,name:a.data.name,sub:a.data.role||'',txt:()=>a.data.role?a.data.name+', '+a.data.role.toLowerCase()+'. Acércate y pulsa E para hablar.':'Acércate y pulsa E para hablar.'});}}catch(e){}return C;};}
// 9. El Capitolio (Roma): la malla del terreno tiene un vértice cada 4,7 m y en sus riscos salían grandes caras planas, con árboles
//    metidos en la roca. Encima va una malla fina (1,5 m) con la altura exacta; la gruesa se hunde un poco debajo para no asomar.
//    Y los árboles plantados en mitad de un risco (más de 45°) se quitan.
function c21Capitol(){if(MODE!=='roma'||C21.cap||typeof terrainInner==='undefined'||!terrainInner||!terrainInner.geometry)return;C21.cap=1;
  const cx=-222,cz=-42,W=200,D=280,st=1.5,nx=Math.round(W/st),nz=Math.round(D/st),G=terrainInner.geometry,P=G.attributes.position,Cc=G.attributes.color;
  const S=INNER.mesh||INNER.size+300,seg=Math.round(Math.sqrt(P.count))-1,step=S/seg,x0=INNER.x-S/2,z0=INNER.z-S/2;
  const g=new THREE.PlaneGeometry(W,D,nx,nz);g.rotateX(-Math.PI/2);const p=g.attributes.position,col=new Float32Array(p.count*3);
  for(let i=0;i<p.count;i++){const x=p.getX(i)+cx,z=p.getZ(i)+cz;p.setXYZ(i,x,terrainH(x,z)+0.03,z);const ix=Math.round((x-x0)/step),iz=Math.round((z-z0)/step),k=iz*(seg+1)+ix;
    if(Cc&&k>=0&&k<P.count){col[i*3]=Cc.getX(k);col[i*3+1]=Cc.getY(k);col[i*3+2]=Cc.getZ(k);}else{col[i*3]=0.8;col[i*3+1]=0.72;col[i*3+2]=0.58;}}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();g.computeBoundingSphere();const m=new THREE.Mesh(g,terrainMat());m.receiveShadow=true;m.userData.noCol=1;scene.add(m);C21.capMesh=m;
  // la malla gruesa, hundida dentro (con una rampa de 8 m en los bordes, donde las dos coinciden)
  for(let k=0;k<P.count;k++){const x=P.getX(k),z=P.getZ(k),ex=W/2-Math.abs(x-cx),ez=D/2-Math.abs(z-cz),e=Math.min(ex,ez);if(e<=0)continue;P.setY(k,P.getY(k)-2.2*Math.min(1,e/8));}
  P.needsUpdate=true;G.computeBoundingSphere();
  // árboles en los riscos
  const m4=new THREE.Matrix4(),z4=new THREE.Matrix4().makeScale(0,0,0);let n=0;for(const C of CHUNKS){const im=C.im;if(!im.userData.veg)continue;let ch=false;
    for(let i=0;i<im.count;i++){im.getMatrixAt(i,m4);const x=m4.elements[12],z=m4.elements[14];if(Math.abs(x-cx)>W/2||Math.abs(z-cz)>D/2)continue;
      const s=Math.max(Math.abs(terrainH(x+1.5,z)-terrainH(x-1.5,z)),Math.abs(terrainH(x,z+1.5)-terrainH(x,z-1.5)))/3;if(s>1){im.setMatrixAt(i,z4);ch=true;n++;}}
    if(ch)im.instanceMatrix.needsUpdate=true;}
  C21.capTrees=n;}
{const f=uxTick;uxTick=function(dt){f(dt);try{if(MODE==='roma'&&!C21.cap&&state&&ui!=='start')c21Capitol();}catch(e){C21.err=String(e&&e.stack||e).slice(0,300);C21.cap=1;}};}
// 10. Las rocas hechas con poliedros (cuevas, peñascos de los mitos, canteras…) se cambian por rocas escaneadas (206, Poly Haven) del
//     mismo tamaño, en cuanto estas llegan; se repasa cada pocos segundos por si se construye algo nuevo.
const C21RK={t:0,geo:new Map()};
function c21RockGeo(k,sx,sy,sz){const key=k+'|'+sx.toFixed(2)+'|'+sy.toFixed(2)+'|'+sz.toFixed(2);if(C21RK.geo.has(key))return C21RK.geo.get(key);const T=RK.tpl[k],g=T.g.clone();g.computeBoundingBox();const b=g.boundingBox,s=new THREE.Vector3(),c=new THREE.Vector3();b.getSize(s);b.getCenter(c);
  g.translate(-c.x,-c.y,-c.z);g.scale(sx/Math.max(s.x,1e-3),sy/Math.max(s.y,1e-3),sz/Math.max(s.z,1e-3));g.computeBoundingSphere();C21RK.geo.set(key,g);return g;}
function c21Rocks(){if(typeof RK==='undefined'||!RK.tpl)return;const L=[...RK_PIEDRA,...RK_PENA].filter(k=>RK.tpl[k]);if(!L.length)return;let n=0;
  scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.userData.c21rk||!o.geometry)return;const ty=o.geometry.type;if(ty!=='DodecahedronGeometry'&&ty!=='IcosahedronGeometry')return;
    const r=o.geometry.parameters&&o.geometry.parameters.radius||1;if(r*Math.max(o.scale.x,o.scale.y,o.scale.z)<0.3)return;   // piezas pequeñas (adornos, frutas) no
    const k=L[Math.floor(hash(o.position.x*1.7,o.position.z*2.3)*L.length)],d=2*r;o.geometry=c21RockGeo(k,d,d*0.8,d);o.material=RK.tpl[k].m;o.rotation.y+=hash(o.position.z,o.position.x)*6;o.userData.c21rk=1;o.castShadow=o.receiveShadow=true;n++;});
  C21RK.n=(C21RK.n||0)+n;}
{const f=uxTick;uxTick=function(dt){f(dt);const now=performance.now();if(now-C21RK.t<4000)return;C21RK.t=now;try{c21Rocks();}catch(e){C21.rkErr=String(e).slice(0,200);}};}
// 11. El incendio (175): llamas y humo de verdad (sprites de luz y volutas) en vez de conos y esferas
{const f=fireStart;fireStart=function(){f.apply(this,arguments);try{const F=DYN.fire;if(!F||F.c21)return;F.c21=1;const g=F.g;for(const m of[...F.fl,...F.sm])g.remove(m);F.fl.length=0;F.sm.length=0;
  const puff=typeof w2Tex==='function'?w2Tex('puff'):TORCH_TEX;
  for(let i=0;i<12;i++){const h=new THREE.Group(),s=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:i%3?'#ffb040':'#ffe080',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));s.scale.set(2.4+Math.random()*1.6,3.6+Math.random()*2.4,1);s.position.y=1.6;h.add(s);
    h.position.set((Math.random()-0.5)*6,3+Math.random()*2.5,(Math.random()-0.5)*6);g.add(h);F.fl.push(h);}
  for(let i=0;i<14;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:puff,color:'#4a4440',transparent:true,depthWrite:false,opacity:0.35}));const k=5+Math.random()*4;s.scale.set(k,k,1);s.position.set((Math.random()-0.5)*4,8+i*1.8,(Math.random()-0.5)*4);g.add(s);F.sm.push(s);}}catch(e){}};}
