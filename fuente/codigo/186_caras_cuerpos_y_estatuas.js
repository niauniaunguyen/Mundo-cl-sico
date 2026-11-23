// ============================================================ CARAS DISTINTAS, CUERPOS DISTINTOS Y ESTATUAS PINTADAS
// 1. Tipos de cara. Los personajes de Blender comparten una sola cabeza por tipo de persona; aquí, sin añadir datos al archivo, se
//    deforma la cabeza (y con ella orejas, ojos, pelo y barba, para que todo encaje) con un campo suave de desplazamientos medido
//    sobre el modelo: ojos a 1,663 m, punta de la nariz a 0,127 m por delante, mentón a 1,545 m, cuello a 1,495 m (que no se toca,
//    para que la cabeza siga cosida al cuerpo). Ocho tipos (FV_TYPES), más suaves en las mujeres, y una variación al azar encima.
// 2. Cuerpos: altura (desviación de unos 4 cm sobre 1,70 m: los esqueletos de la Atenas clásica dan unos 1,68 m de media en los
//    hombres y 1,56 m en las mujeres) y complexión; tono de piel y color de pelo distintos.
// 3. Estatuas: las figuras de mármol, bronce u oro que el juego hacía con la persona sencilla (makePerson con colores de piedra o metal)
//    se cambian, de cerca, por los modelos de Blender en mármol pintado, bronce con ojos incrustados o crisoelefantina (oro y marfil).
//    Policromía: la escultura griega y romana se pintaba (encáustica sobre el mármol: ropa de colores con cenefas, pelo, ojos y labios;
//    piel con un tono suave). Fuentes: V. Brinkmann y U. Wünsche (eds.), «Gods in Color», 2007; Plinio, Historia natural XXXV 133;
//    Pausanias I 24, 5-7 (la Atenea Pártenos de Fidias, de oro y marfil). Los bronces llevaban ojos de piedra y pasta de vidrio y
//    labios de cobre (los guerreros de Riace, hacia 450).
const NPB={list:[],R:70,all:[],vis:[],nb:0,MAXB:60};
const FV={geo:new Map(),E:{x:0,y:1.663,z:0.078}};
// tipos de cara: nz nariz adelante, nw nariz ancha, aq nariz aguileña, sn nariz respingona, br arco de las cejas, jw mandíbula ancha,
// ch mentón adelantado, fl cara larga, cb pómulos, cf mejillas llenas, fw cara ancha, lp labios gruesos
const FV_TYPES=[
 {n:'clásica (perfil griego)',nz:0.004,aq:0,br:0.002},
 {n:'aguileña',nz:0.006,aq:0.006,nw:-0.08,fl:0.008,fw:-0.03,cb:0.003},
 {n:'chata (como los retratos de Sócrates)',nz:-0.005,sn:0.005,nw:0.22,fw:0.05,br:0.004,lp:0.002,cf:0.003},
 {n:'cuadrada',jw:0.09,br:0.004,ch:0.004,fw:0.02},
 {n:'fina',jw:-0.07,fw:-0.04,ch:-0.002,nw:-0.06,fl:0.004},
 {n:'redonda',cf:0.006,fw:0.05,fl:-0.006,jw:0.03,nz:-0.002},
 {n:'huesuda',cb:0.006,cf:-0.004,fl:0.006,br:0.003,jw:0.02},
 {n:'mentón fuerte',ch:0.007,jw:0.05,fl:0.004,nz:0.002}];
const _fvs=(a,b,t)=>{const x=Math.min(1,Math.max(0,(t-a)/(b-a)));return x*x*(3-2*x);},_fvg=t=>Math.exp(-t*t);
// desplazamiento de un punto (x,y,z en metros del modelo) según el tipo P
function fvMove(x,y,z,P){const Y=y-FV.E.y,ax=Math.abs(x),sg=x<0?-1:1;
  const keep=_fvs(-0.158,-0.128,Y)*_fvs(0.14,0.10,Y);if(keep<=0)return[x,y,z];   // el cuello y la coronilla no se mueven
  const front=_fvs(0.04,0.085,z),front2=_fvs(-0.02,0.06,z);let dx=0,dy=0,dz=0;
  // nariz
  const wn=_fvg(x/0.02)*_fvg((Y+0.03)/0.034)*_fvs(0.078,0.1,z);dz+=(P.nz||0)*wn;dx+=x*(P.nw||0)*_fvg(x/0.03)*_fvg((Y+0.04)/0.022)*_fvs(0.07,0.095,z);
  dz+=(P.aq||0)*_fvg(x/0.012)*_fvg((Y+0.014)/0.013)*_fvs(0.085,0.1,z);dy+=(P.sn||0)*_fvg(x/0.016)*_fvg((Y+0.042)/0.012)*_fvs(0.09,0.11,z);
  // cejas, pómulos, mejillas, labios
  dz+=(P.br||0)*_fvg((Y-0.028)/0.011)*_fvg(x/0.05)*front;
  dx+=sg*(P.cb||0)*_fvg((ax-0.052)/0.02)*_fvg((Y+0.016)/0.018)*_fvs(0.0,0.05,z);
  dx+=sg*(P.cf||0)*_fvg((ax-0.048)/0.022)*_fvg((Y+0.06)/0.022)*_fvs(0.0,0.05,z);
  dz+=(P.lp||0)*_fvg((Y+0.071)/0.01)*_fvg(x/0.022)*front;
  // mandíbula, mentón y largo de la cara (bajan hacia el mentón y vuelven a 0 en el cuello)
  const jaw=_fvs(-0.045,-0.095,Y);dx+=x*(P.jw||0)*jaw;dz+=(P.ch||0)*_fvg(x/0.028)*_fvg((Y+0.108)/0.022)*front;
  dy-=(P.fl||0)*_fvs(-0.01,-0.1,Y);
  dx+=x*(P.fw||0)*front2*_fvs(0.09,0.03,Y);
  return[x+dx*keep,y+dy*keep,z+dz*keep];}
function fvParams(t,fem,rnd){const P=Object.assign({},FV_TYPES[t%FV_TYPES.length]),k=fem?0.8:1.5;
  for(const key of['nz','nw','aq','sn','br','jw','ch','fl','cb','cf','fw','lp']){const jit={nw:0.08,jw:0.04,fw:0.03,nz:0.002,ch:0.002,fl:0.003}[key]||0;P[key]=((P[key]||0)+(rnd()-0.5)*jit)*k;}
  if(fem){P.br*=0.4;P.ch*=0.5;P.jw=Math.min(P.jw,0.03);}return P;}
const FV_HEAD=/_(cabeza|orejas|ojos|pelo|barba|mono|cinta)$/;
// geometría deformada (compartida por todos los que tienen la misma variante)
function fvGeo(src,key,P){let g=FV.geo.get(key);if(g)return g;g=src.clone();const a=g.attributes.position,arr=new Float32Array(a.count*3);
  if(/_ojos\|/.test(key)){   // los globos oculares se mueven enteros, sin deformarse: si no, al estrechar la cara el iris (delante) se iba hacia la nariz más que el resto del ojo y la persona quedaba bizca
    const C=[[0,0,0,0],[0,0,0,0]];for(let i=0;i<a.count;i++){const s=a.getX(i)<0?0:1;C[s][0]+=a.getX(i);C[s][1]+=a.getY(i);C[s][2]+=a.getZ(i);C[s][3]++;}
    const D=C.map(c=>{if(!c[3])return[0,0,0];const x=c[0]/c[3],y=c[1]/c[3],z=c[2]/c[3],m=fvMove(x,y,z,P);return[m[0]-x,m[1]-y,m[2]-z];});
    for(let i=0;i<a.count;i++){const d=D[a.getX(i)<0?0:1];arr[i*3]=a.getX(i)+d[0];arr[i*3+1]=a.getY(i)+d[1];arr[i*3+2]=a.getZ(i)+d[2];}}
  else for(let i=0;i<a.count;i++){const p=fvMove(a.getX(i),a.getY(i),a.getZ(i),P);arr[i*3]=p[0];arr[i*3+1]=p[1];arr[i*3+2]=p[2];}
  g.setAttribute('position',new THREE.BufferAttribute(arr,3));g.computeBoundingSphere();FV.geo.set(key,g);return g;}
const FV_SKIN=[[1,1,1],[0.9,0.84,0.78],[1.05,1.02,0.98],[0.94,0.9,0.8],[0.84,0.77,0.7]],FV_HAIR=[[1,1,1],[0.55,0.55,0.58],[0.7,0.66,0.64],[1.45,1.2,0.95],[1.55,1.05,0.75]];
// varía una persona de Blender: cara, piel, pelo y cuerpo
function bpVary(g,kind,seed,ft){const R=mulberry32(seed>>>0),fem=kind==='mujer'||kind==='romana',t0=Math.floor(R()*FV_TYPES.length),t=ft!==undefined?ft:t0,v=Math.floor(R()*3),P=fvParams(t,fem,mulberry32((t*7+v*131+(fem?1:0))*977));
  const sk=FV_SKIN[fem?[0,2,2,3][Math.floor(R()*4)]:Math.floor(R()*R()*FV_SKIN.length)],hr=FV_HAIR[R()<0.6?0:1+Math.floor(R()*(R()<0.85?2:4))];
  const root=g.children[0];g.traverse(o=>{if(!o.isMesh)return;const nm=o.name||'',mn=o.material&&o.material.name||'';
    if(FV_HEAD.test(nm)){o.userData.fvKey=kind+'|'+nm+'|'+t+'|'+v;o.userData.fvP=P;o.geometry=fvGeo(o.geometry,o.userData.fvKey,P);}
    if(/_(cara|piel)$/.test(mn))o.material=fvTint(o.material,sk);else if(/_(pelo|barba)$/.test(mn))o.material=fvTint(o.material,hr);});
  // altura: media y desviación de los esqueletos áticos (el modelo mide unos 1,75 m); complexión: ancho de hombros y cintura
  const hm=fem?1.56/1.75*1.05:1.68/1.75*1.03,h=hm*(1+(R()+R()+R()-1.5)*0.05),w=h*(0.95+R()*0.1);root.scale.set(w,h,w);
  g.userData.face=FV_TYPES[t].n;return g;}
function fvTint(m,c){const key=m.uuid+'|'+c.join(',');if(BP.mats.has(key))return BP.mats.get(key);const n=m.clone();n.color=n.color.clone().multiply(new THREE.Color(c[0],c[1],c[2]));BP.mats.set(key,n);return n;}
{const f=bpMake;bpMake=function(kind,c){const g=f.apply(this,arguments);if(g&&!(c&&c.noVary))try{bpVary(g,kind,Math.floor(Math.random()*1e9));}catch(e){console.warn('bpVary',e);}return g;};}

// ---------------------------------------------------------------- estatuas
const STB={list:[],ready:false,R:150,mats:new Map(),n:0};
const ST_MARBLE=new Set(['#ece4d6','#efe7d8','#efe8dc','#f3e5c8']),ST_GOLD=new Set(['#d9a93a','#c9962e','#c9a24a','#b8862f']);
// ¿es una estatua? (piel, pelo y ropa de piedra o metal)
function stKind(c){if(!c||c.glow||c.mask)return null;const n=s=>(s||'').toLowerCase(),sk=n(c.skin),hr=n(c.hair),ch=n(c.chiton);if(!sk||!ch)return null;
  const rgb=s=>{const k=new THREE.Color(s);return k;},col=rgb(sk),hs={};col.getHSL(hs);
  const metal=s=>{const k=rgb(s),h={};k.getHSL(h);return h.h>0.06&&h.h<0.14&&h.s>0.15&&h.l<0.6;};
  if(ST_MARBLE.has(sk)&&ST_MARBLE.has(hr||sk)&&ST_MARBLE.has(ch))return 'marble';
  if(ST_GOLD.has(ch)&&(ST_GOLD.has(hr)||ST_MARBLE.has(sk)))return 'gold';
  if(metal(sk)&&metal(ch)&&(!hr||metal(hr))&&(c.attrRoles||sk===ch||sk===hr||sk===n(c.himation)))return 'bronze';return null;}   // piel del color de la ropa: una persona de verdad nunca lo es
{const f=makePerson;makePerson=function(c){const g=f.apply(this,arguments);try{const k=stKind(c);if(g&&!k)NPB.all.push(g);if(k&&g){g.userData.stKind=k;STB.list.push({g,c,k,n:g.children.length});}}catch(e){}return g;};}
// pintura sobre mármol: la textura pintada del personaje se mezcla con el blanco cálido del mármol (paint: cuánto color lleva la pieza)
function stPaintMat(m,paint,tint,cloth){const n=new THREE.MeshPhongMaterial({map:m.map,shininess:22,specular:0x2a2620,skinning:true});n.name=m.name;if(!m.map)n.color.set(tint||'#ece4d6');
  n.onBeforeCompile=sh=>{sh.uniforms.uPaint={value:paint};sh.uniforms.uTint={value:new THREE.Color(tint||'#ece4d6')};sh.uniforms.uCloth={value:new THREE.Color(cloth||'#ffffff')};
    sh.fragmentShader='uniform float uPaint;uniform vec3 uTint;uniform vec3 uCloth;\n'+sh.fragmentShader.replace('#include <map_fragment>',
      `#ifdef USE_MAP
        vec4 texelColor=mapTexelToLinear(texture2D(map,vUv));vec3 tc=texelColor.rgb;float lum=dot(tc,vec3(0.3,0.59,0.11));tc=mix(vec3(lum),tc,1.25);tc*=mix(vec3(1.0),uCloth*1.25,0.9);   // la tela clara se pinta con el pigmento   // pintura algo más viva
        diffuseColor.rgb*=mix(uTint,tc,uPaint);
      #endif`);};
  n.customProgramCacheKey=()=>'stPaint2';return n;}
// pigmentos documentados en la escultura pintada (Brinkmann, «Gods in Color»): azul egipcio, verde malaquita, cinabrio, ocre amarillo, púrpura
const ST_PIG=[['#4a6fb8','#b5402e'],['#5a9466','#c8902e'],['#b5402e','#4a6fb8'],['#d6a23a','#7a3f78'],['#7a3f78','#d6a23a']];
function stMat(m,k,fem,pi){pi=pi||0;const nm=m.name||'',key=m.uuid+k+(fem?'f':'m')+pi;if(STB.mats.has(key))return STB.mats.get(key);let n;
  const eye=/_ojo$/.test(nm),face=/_cara$/.test(nm),skin=/_piel$/.test(nm),hair=/_(pelo|barba)$/.test(nm);
  if(k==='marble')n=eye?stPaintMat(m,1):face?stPaintMat(m,fem?0.3:0.42,fem?'#eee2d2':'#e2c7a4'):skin?stPaintMat(m,0,fem?'#efe3d3':'#e0c4a0'):hair?stPaintMat(m,0.9):stPaintMat(m,0.8,null,/^(himation|palla|manto)/.test(nm)?ST_PIG[pi%5][0]:/^(quiton|peplo|estola|manga|tunica)/.test(nm)&&!/_rojo/.test(nm)?ST_PIG[pi%5][1]:null);   // la toga, blanca
  else if(k==='bronze')n=eye?m.clone():new THREE.MeshPhongMaterial({color:hair?'#6e5530':'#9a7440',shininess:55,specular:'#c8a060',skinning:true});   // ojos incrustados
  else n=eye?m.clone():(face||skin)?stPaintMat(m,face?0.25:0,'#f1e3c4'):new THREE.MeshPhongMaterial({color:'#d9a93a',shininess:80,specular:'#ffe6a0',skinning:true});   // oro y marfil
  n.skinning=true;STB.mats.set(key,n);return n;}
// tipo de figura de Blender según la estatua
function stModel(c){if(c.female)return(c.helmet||(c.attrs||[]).some(a=>/spear|shield|aegis/i.test(a)))?'atenea':'mujer';if(c.toga&&BP.tpl.togado)return 'togado';if(c.helmet||c.soldier)return 'hoplita';return 'ciudadano';}
// copia una pieza con esqueleto de otro modelo (casco, escudo, lanza) al esqueleto de esta figura, por nombre de hueso
function stGraft(dst,src,names){const bones={};dst.traverse(o=>{if(o.isBone)bones[o.name]=o;});let host=null;dst.traverse(o=>{if(!host&&o.isSkinnedMesh)host=o;});if(!host)return;
  src.traverse(o=>{if(!o.isSkinnedMesh||!names.test(o.name))return;const bs=o.skeleton.bones.map(b=>bones[b.name]);if(bs.some(b=>!b))return;
    const m=new THREE.SkinnedMesh(o.geometry,o.material);m.name=o.name;host.parent.add(m);m.bind(new THREE.Skeleton(bs,o.skeleton.boneInverses),host.bindMatrix);});}
function bpStatue(c,k){const mk=stModel(c),base=mk==='atenea'?'mujer':mk;if(!BP.tpl[base])return null;const T=BP.tpl[base],root=bpClone(T.scene),fem=base==='mujer';
  if(mk==='atenea'&&BP.tpl.hoplita){stGraft(root,bpClone(BP.tpl.hoplita.scene),/^(casco|cimera|escudo|lanza)$/);root.traverse(o=>{if(/_mono$|_cinta$/.test(o.name))o.visible=false;});}
  const mix=new THREE.AnimationMixer(root),idle=T.anims.find(a=>a.name.endsWith('quieto'));if(idle){mix.clipAction(idle).play();mix.update(0.4);}   // postura fija
  const pi=(STB.pi=(STB.pi||0)+1);root.traverse(o=>{if(!o.isMesh)return;o.material=stMat(o.material,k,fem,pi);o.castShadow=true;o.frustumCulled=false;});
  const g=new THREE.Group();g.add(root);g.userData.statue=k;g.userData.pj=base;return g;}
// cambia, de cerca, cada estatua sencilla por la de Blender (a la altura y en el sitio de la sencilla)
function stSwap(){let made=0;const W=new Set(walkers.map(w=>w.g));for(const s of STB.list){if(s.bp||s.skip||!s.g.parent)continue;const g=s.g;if(W.has(g)){s.skip=true;continue;}
    if(g.children.length!==s.n){s.skip=true;continue;}   // le han colgado algo (la Nike de la Pártenos...): se queda la sencilla
    const n=bpStatue(s.c,s.k);if(!n){s.skip=true;continue;}
    g.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(g),ws=new THREE.Vector3(),wp=new THREE.Vector3();g.getWorldScale(ws);g.getWorldPosition(wp);
    if(box.isEmpty()||!(ws.y>0)){s.skip=true;continue;}const hL=(box.max.y-box.min.y)/ws.y,y0=(box.min.y-wp.y)/ws.y,root=n.children[0],sc=hL/1.785;
    root.scale.setScalar(sc);root.position.y=y0;n.position.copy(g.position);n.quaternion.copy(g.quaternion);n.scale.copy(g.scale);n.visible=false;g.parent.add(n);s.bp=n;made++;}
  STB.n+=made;return made;}
function stbTick(){if(!STB.ready)return;const cx=camera.position.x,cy=camera.position.y,cz=camera.position.z,R2=STB.R*STB.R,v=new THREE.Vector3();
  for(const s of STB.list){if(!s.bp||!s.g.parent)continue;s.g.getWorldPosition(v);const near=(v.x-cx)**2+(v.y-cy)**2+(v.z-cz)**2<R2;if(s.bp.visible!==near){s.bp.visible=near;s.g.visible=!near;}}}
{let acc=0;const f=uxTick;uxTick=function(dt){f(dt);acc+=dt;if(acc>0.4){acc=0;try{stbTick();}catch(e){}}};}
// las figuras de las estatuas (ciudadano, mujer y hoplita) se cargan también en Roma
{const f=bpSetup;bpSetup=function(){f.apply(this,arguments);const need=['ciudadano','mujer','hoplita','obrero'],L=BP_MODE[MODE]||[];
  for(const k of need)if(!L.includes(k))bpParse('glbpj_'+k,k,()=>{});
  let tries=0;const w=setInterval(()=>{if(need.every(k=>BP.tpl[k])||++tries>60){clearInterval(w);if(BP.tpl.ciudadano||BP.tpl.mujer){try{stSwap();STB.ready=true;stbTick();}catch(e){console.warn('estatuas',e);}}}},500);};}

// ---------------------------------------------------------------- personajes con nombre
// Los transeúntes ya llevaban la figura de Blender, pero no los personajes con los que se habla (npcObjs): seguían con la sencilla.
// A cada uno se le añade la de Blender dentro de su propio grupo (así lo que gira o mueve el grupo —mirar al jugador, gestos— sigue
// valiendo); su figura sencilla pasa a un contenedor que se oculta de cerca. Los rótulos y marcas (sprites) no se tocan.
NPB.R=70;NPB.K=14;try{if(typeof isTouch!=='undefined'&&isTouch){NPB.R=45;NPB.K=8;NPB.MAXB=24;}if(ACC.lite){NPB.R=35;NPB.K=6;NPB.MAXB=16;}}catch(e){}
function npcKind(c){if(!c||c.glow||c.mask||(c.scale&&c.scale<0.95))return null;
  if(MODE==='roma'){if(c.soldier)return 'legionario';if(c.female)return 'romana';if(c.toga||c.himation&&!c.short)return 'togado';return BP.tpl.obrero?'obrero':null;}   // sin toga ni manto: túnica corta de trabajo
  if(c.female)return 'mujer';if(c.spear||c.soldier||c.helmet)return 'hoplita';if(c.exomis||c.short||c.noHimation)return 'obrero';return 'ciudadano';}
const NPB_GREY=new Map();
// candidatos: se marcan al aparecer; la figura de Blender se crea solo cuando el personaje está entre los NPB.K más cercanos
// (dos por vez, para no dar tirones) y se suelta cuando hay más de NPB.MAXB creadas y esta es de las más lejanas
function npcOk(g){if(!g||g.userData.npb||g.userData.pj||g.userData.stKind)return false;g.userData.npb=1;const c=g.userData.cfg;if(!c||c.noBlender)return false;   /* antes también se dejaban fuera los noVary: el cantero, el mendigo, el cabrero... seguían con la figura antigua (vídeo 23/11) */const k=npcKind(c);if(!k||!BP.tpl[k])return false;g.userData.npbKind=k;return true;}
function npcDress(g){const c=g.userData.cfg,k=g.userData.npbKind;const n=bpMake(k,c);if(!n)return null;const root=n.children[0],B=n.userData.bp;n.remove(root);
  // canas: la textura del pelo es oscura y teñirla no la vuelve gris; se pinta de gris sin textura
  const hc=c&&c.hair?new THREE.Color(c.hair):null,hs={};if(hc)hc.getHSL(hs);
  if(hc&&hs.l>0.45&&hs.s<0.25)root.traverse(m=>{if(m.isMesh&&/_(pelo|barba)$/.test(m.material.name||'')){let gm=NPB_GREY.get(c.hair);if(!gm){gm=new THREE.MeshLambertMaterial({color:hc.clone().multiplyScalar(0.85),skinning:true});NPB_GREY.set(c.hair,gm);}m.material=gm;}});
  if(c&&c.himation&&!(c.toga&&!c.pulla))root.traverse(m=>{if(m.isMesh&&m.material.name==='toga')m.material=bpTint(m.material,c.himation,1.6);});   // sin toga: el manto (pallium) con su color
  let hold=g.userData.npbHold;if(!hold){hold=new THREE.Group();hold.name='figuraSencilla';for(const ch of [...g.children])if(!ch.isSprite){g.remove(ch);hold.add(ch);}g.add(hold);g.userData.npbHold=hold;}
  g.add(root);return {root,hold,B};}
function npbTick(){if(!BP.ready)return;const cx=camera.position.x,cz=camera.position.z,R2=NPB.R*NPB.R,v=new THREE.Vector3(),A=[];NPB.vis.length=0;
  for(const e of NPB.list){const g=e.g;if(!g.parent)continue;let vis=g.visible;for(let q=g.parent;vis&&q&&q!==scene;q=q.parent)if(!q.visible)vis=false;
    g.getWorldPosition(v);e.d2=(v.x-cx)**2+(v.z-cz)**2;if(vis&&e.d2<R2&&!g.userData.sitting)A.push(e);else if(e.f&&e.f.root.visible){e.f.root.visible=false;e.f.hold.visible=true;}}
  A.sort((a,b)=>a.d2-b.d2);let built=0;
  A.forEach((e,i)=>{let near=i<NPB.K;if(near&&!e.f){if(built<2){e.f=npcDress(e.g);built++;NPB.nb++;}if(!e.f)near=false;}
    if(e.f){const g=e.g;for(const ch of [...g.children])if(ch!==e.f.root&&ch!==e.f.hold&&!ch.isSprite){g.remove(ch);e.f.hold.add(ch);}   // piezas que se añaden después (detalle de cerca)
      e.f.root.visible=near;e.f.hold.visible=!near;if(near)NPB.vis.push(e.f);}});
  if(NPB.nb>NPB.MAXB){const B=NPB.list.filter(e=>e.f&&!e.f.root.visible).sort((a,b)=>b.d2-a.d2);for(const e of B){if(NPB.nb<=NPB.MAXB)break;e.g.remove(e.f.root);e.f.hold.visible=true;e.f=null;NPB.nb--;}}}
function npbAnim(dt){for(const f of NPB.vis){if(f.hold.visible&&f.root.visible)f.hold.visible=false;   // el detalle por distancia de las personas vuelve a encender sus piezas
  const B=f.B;if(!B||!B.idle)continue;B.t+=dt;if(B.walk)B.walk.setEffectiveWeight(0);B.idle.setEffectiveWeight(1);B.idle.time=B.t%B.idle.getClip().duration;B.mix.update(0);}}
{let acc=0,acc2=3;const f=uxTick;uxTick=function(dt){f(dt);if(!BP.ready)return;acc+=dt;acc2+=dt;try{if(acc2>3){acc2=0;const W=new Set(walkers.map(w=>w.g));for(const g of NPB.all){if(g.userData.npb||!g.parent||W.has(g)||(g.parent.userData&&g.parent.userData.old===g))continue;if(npcOk(g))NPB.list.push({g,f:null,d2:1e12});}}
  if(acc>0.3){acc=0;npbTick();}npbAnim(dt);}catch(e){}};}

// ---------------------------------------------------------------- versión alta de cerca
// Cada personaje tiene dos versiones: la ligera (unos 11 000-12 000 triángulos) para todos y la alta (39 000-50 000: cabeza, pelo, ropa y
// manos con mucho más detalle) para los pocos que están más cerca. La alta se trae en segundo plano después de arrancar (datos/glbpj_*_alta,
// data-lazy) y no se clona: a la persona cercana se le cambia la geometría de cada pieza por la de la alta (mismos huesos y en el mismo
// orden, comprobado al exportar), con la misma deformación de cara. Las más cercanas: BPH.N a menos de BPH.D metros.
const BPH={tpl:{},N:6,D:16,on:new Set()};try{if(typeof isTouch!=='undefined'&&isTouch){BPH.N=3;BPH.D=11;}if(ACC.lite)BPH.N=0;}catch(e){}
function bphLoad(){if(BPH.loading||!BPH.N)return;BPH.loading=1;const L=Object.keys(BP.tpl).filter(k=>k[0]!=='@');let i=0;
  const next=()=>{if(i>=L.length)return;const k=L[i++];bpParse('glbpj_'+k+'_alta','@'+k,()=>{const T=BP.tpl['@'+k];delete BP.tpl['@'+k];
    if(T){const M={};T.scene.traverse(o=>{if(o.isMesh)M[o.name]=o.geometry;});BPH.tpl[k]=M;}setTimeout(next,400);});};setTimeout(next,4000);}
function bphSet(root,kind,on){const M=BPH.tpl[kind];if(!M&&on)return false;root.traverse(o=>{if(!o.isMesh)return;const u=o.userData;
    if(on){const hg=M[o.name];if(!hg)return;if(!u.loGeo)u.loGeo=o.geometry;o.geometry=u.fvKey?fvGeo(hg,u.fvKey+'|alta',u.fvP):hg;}
    else if(u.loGeo){o.geometry=u.loGeo;}});return true;}
function bphTick(){if(!BPH.N)return;const cx=camera.position.x,cy=camera.position.y,cz=camera.position.z,D2=BPH.D*BPH.D,v=new THREE.Vector3(),C=[];
  const add=(root,kind,obj)=>{if(!root||!root.visible||!BPH.tpl[kind])return;let vis=true;for(let q=obj;q&&q!==scene;q=q.parent)if(!q.visible){vis=false;break;}if(!vis)return;obj.getWorldPosition(v);const d2=(v.x-cx)**2+(v.y-cy)**2*0.3+(v.z-cz)**2;if(d2<D2)C.push([d2,root,kind]);};
  for(const g of BP.list)add(g.children[0],g.userData.pj,g);
  for(const e of NPB.list)if(e.f)add(e.f.root,e.g.userData.npbKind,e.g);
  for(const s of STB.list)if(s.bp)add(s.bp.children[0],s.bp.userData.pj,s.bp);
  C.sort((a,b)=>a[0]-b[0]);const want=new Set();for(let i=0;i<Math.min(BPH.N,C.length);i++){const[,root,kind]=C[i];want.add(root);if(!BPH.on.has(root)&&bphSet(root,kind,true))BPH.on.add(root);}
  for(const r of BPH.on)if(!want.has(r)){bphSet(r,null,false);BPH.on.delete(r);}}
{let acc=0;const f=uxTick;uxTick=function(dt){f(dt);if(!BP.ready)return;if(!BPH.loading)bphLoad();acc+=dt;if(acc>0.3){acc=0;try{bphTick();}catch(e){}}};}
