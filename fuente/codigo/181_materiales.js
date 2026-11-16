// ============================================================ MATERIALES: variación, desgaste, brillo y visor de modelos
// Se completa lo que ya hacen las texturas triplanares de 036_acabado.js, sin descargar imágenes ni tocar el archivo de Blender:
// · variación: cada edificio sale de un tono algo distinto (ruido muy suave en el espacio del mundo), así las insulae no son idénticas;
// · desgaste: suciedad y humedad en el primer metro de los muros (según la altura sobre el terreno, leída de un mapa de alturas),
//   regueros de lluvia que bajan por las paredes y un poco de musgo en la sombra de los zócalos;
// · brillo: el mármol tiene un brillo suave y el bronce y el oro reflejan el sol y el cielo (con la sombra en cuenta), sin cambiar de
//   material: se calcula en el mismo sombreador para no romper el equilibrio de luces del resto de la escena;
// · tejados de teja y sillares que aún eran de color liso pasan a tener textura.
// Para revisar los modelos: mvOpen() (con #debug, o ?visor=1 en la dirección) abre un visor con cada pieza girando, sus polígonos,
// tres luces distintas y una medida de la escena (llamadas de dibujo, triángulos y milisegundos por fotograma).
const MFX={hTex:null,hB:new THREE.Vector4(0,0,1,0),cx:1e9,cz:1e9,u:null,done:new Set(),on:true};try{if(ACC.lite)MFX.on=false;}catch(e){}
const MFX_LOW=(typeof isTouch!=='undefined'&&isTouch)||(typeof ACC!=='undefined'&&ACC.lite);
function mfxU(){if(MFX.u)return MFX.u;MFX.u={uHgt:{value:null},uHgtB:{value:MFX.hB},uSunD:{value:LIGHTDIR},uSunC:{value:new THREE.Color(1,1,1)},uSkyC:{value:new THREE.Color(0.7,0.8,0.9)},uWet:{value:0}};return MFX.u;}
// mapa de alturas del terreno alrededor del jugador (para saber a qué altura del suelo está cada punto de un muro)
function mfxBake(cx,cz){const N=192,S=960,d=new Float32Array(N*N*4),x0=cx-S/2,z0=cz-S/2;
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){let h=0;try{h=terrainH(x0+(i+0.5)*S/N,z0+(j+0.5)*S/N);}catch(e){}d[(j*N+i)*4]=h;}
  const lin=renderer.extensions.get('OES_texture_float_linear');
  const t=new THREE.DataTexture(d,N,N,THREE.RGBAFormat,THREE.FloatType);t.magFilter=t.minFilter=lin?THREE.LinearFilter:THREE.NearestFilter;t.needsUpdate=true;
  if(MFX.hTex)MFX.hTex.dispose();MFX.hTex=t;mfxU().uHgt.value=t;MFX.hB.set(x0,z0,S,1);MFX.cx=cx;MFX.cz=cz;}
const MFX_GLSL='float mfH(vec2 p){p=mod(p,289.0);return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\n'+
  'float mfV(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mfH(i),mfH(i+vec2(1.0,0.0)),f.x),mix(mfH(i+vec2(0.0,1.0)),mfH(i+vec2(1.0,1.0)),f.x),f.y);}\n';
// kind: 'b' edificio (variación + desgaste), 'm' mármol (además, brillo suave), 'k' metal (brillo y reflejo del cielo)
function mfx(mat,kind){if(!mat||mat.userData.mfx)return mat;mat.userData.mfx=kind;const prev=mat.onBeforeCompile,pk=mat.customProgramCacheKey&&mat.customProgramCacheKey!==THREE.Material.prototype.customProgramCacheKey?mat.customProgramCacheKey.bind(mat):null;
  const lam=mat.type==='MeshLambertMaterial';
  mat.onBeforeCompile=function(sh,r){if(prev)prev.call(this,sh,r);Object.assign(sh.uniforms,mfxU());
    sh.vertexShader='varying vec3 vMfP;\nvarying vec3 vMfN;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvec4 mfw=vec4(transformed,1.0);vec3 mfn=objectNormal;\n#ifdef USE_INSTANCING\nmfw=instanceMatrix*mfw;mfn=mat3(instanceMatrix)*mfn;\n#endif\nmfw=modelMatrix*mfw;vMfP=mfw.xyz;vMfN=normalize(mat3(modelMatrix)*mfn);');
    let F='uniform sampler2D uHgt;uniform vec4 uHgtB;uniform vec3 uSunD,uSunC,uSkyC;uniform float uWet;\nvarying vec3 vMfP;\nvarying vec3 vMfN;\n'+MFX_GLSL+sh.fragmentShader;
    if(kind==='b'||kind==='m'||kind==='g'){F=F.replace('#include <color_fragment>','#include <color_fragment>\n{vec3 N=normalize(vMfN);float vert=1.0-abs(N.y);'+
      (kind==='g'?'vec3 q=vMfP*2.2;float gr=mfV(q.xz+q.y*0.7)*0.5+mfV(q.zy*2.3+5.1)*0.3+mfV(q.xy*5.1+2.7)*0.2;diffuseColor.rgb*=0.86+0.24*gr;':'')+
      'float t=mfV(vMfP.xz*0.045+7.3);diffuseColor.rgb*=0.9+0.18*t;diffuseColor.rgb*=mix(vec3(1.0),vec3(1.04,1.0,0.94),mfV(vMfP.xz*0.02+1.7));'+   // tono de cada edificio
      'vec2 uv=(vMfP.xz-uHgtB.xy)/uHgtB.z;float inside=step(0.0,uv.x)*step(uv.x,1.0)*step(0.0,uv.y)*step(uv.y,1.0)*uHgtB.w;'+
      'float hg=vMfP.y-texture2D(uHgt,clamp(uv,0.0,1.0)).r;float n=mfV(vMfP.xz*1.7+vMfP.y*0.9);'+
      'float g=(1.0-smoothstep(0.05,1.0+0.5*n,hg))*vert*inside*step(-0.6,hg);diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(0.6,0.58,0.48),g*0.85);'+   // suciedad y humedad abajo
      'float hc=abs(N.x)>abs(N.z)?vMfP.z:vMfP.x;float st=smoothstep(0.62,0.95,mfV(vec2(hc*2.3,vMfP.y*0.11)))*smoothstep(0.4,2.5,hg)*vert;diffuseColor.rgb*=1.0-0.13*st*(0.6+0.4*n);'+   // regueros
      'diffuseColor.rgb*=1.0-0.18*uWet*vert;}');}   // con lluvia, más oscuro
    if(kind==='k'){F=F.replace('#include <color_fragment>','#include <color_fragment>\n{float t=mfV(vMfP.xz*3.0+vMfP.y*2.0);diffuseColor.rgb*=0.88+0.2*t;}');}   // pátina irregular
    if(lam&&(kind==='m'||kind==='k')){const ks=kind==='k'?'0.55':'0.11',pw=kind==='k'?'38.0':'18.0',fr=kind==='k'?'0.35':'0.06';
      F=F.replace('#include <envmap_fragment>','{vec3 N=normalize(vMfN);if(!gl_FrontFacing)N=-N;vec3 V=normalize(cameraPosition-vMfP);vec3 H=normalize(uSunD+V);float sp=pow(max(dot(N,H),0.0),'+pw+')*step(0.0,dot(N,uSunD));'+
        'float fres=pow(1.0-max(dot(N,V),0.0),3.0);outgoingLight+=uSunC*sp*'+ks+'*getShadowMask()+uSkyC*fres*'+fr+'*(0.5+0.5*N.y)*diffuseColor.rgb*2.0;}\n#include <envmap_fragment>');}
    sh.fragmentShader=F;};
  mat.customProgramCacheKey=function(){return (pk?pk():'')+'|mfx'+kind;};mat.needsUpdate=true;return mat;}
// a qué clase pertenece un material ya creado
function mfxKind(m){if(!m||m.userData.mfx||!(m.type==='MeshLambertMaterial'||m.type==='MeshPhongMaterial'))return null;if(m.transparent||m.vertexColors)return null;
  if(m.userData.tpScale&&m.map){if(m.map===PTEX.leaf||m.map===PTEX.bark||m.map===PTEX.ground||m.map===PTEX.grass||m.map===PTEX.rock)return null;return m.map===PTEX.marble?'m':'b';}
  if(m.type==='MeshLambertMaterial'&&!m.map&&m.color&&m.color.getHex()===0xffffff&&m.userData.mfxIC)return 'g';
  if(m===M.bronze||m===M.gold||m===matCache['#8a6a3a']||m===matCache['#d9a93a']||m===matCache['#d8a040'])return 'k';return null;}
// superficies grandes que seguían de color liso: tejas y sillares
function mfxPlain(){const L=[['#934830',PTEX.tile,3],['#d9cfbd',PTEX.stone,3.2]];for(const [hex,tex,s] of L){const m=matCache[hex];if(m&&!m.map&&m.onBeforeCompile===THREE.Material.prototype.onBeforeCompile)triplanar(m,tex,s);}}
function mfxScan(){if(!MFX.on)return;mfxPlain();let n=0;scene.traverse(o=>{if(!o.isMesh)return;const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){if(MFX.done.has(m))continue;if(o.isInstancedMesh&&o.instanceColor&&o.userData.chunk)m.userData.mfxIC=1;MFX.done.add(m);const k=mfxKind(m);if(k){mfx(m,k);n++;}}});return n;}
function mfxSetup(){try{mfxBake(player.x,player.z);MFX.n=mfxScan();}catch(e){console.warn('mfx',e);}}
function mfxTick(dt){if(!MFX.u)return;MFX.t=(MFX.t||0)-dt;if(MFX.t>0)return;MFX.t=1;
  if(Math.hypot(player.x-MFX.cx,player.z-MFX.cz)>260)mfxBake(player.x,player.z);
  const U=MFX.u;U.uSunC.value.copy(sun.color).multiplyScalar(sun.intensity);U.uSkyC.value.copy(hemi.color).multiplyScalar(hemi.intensity);
  let wet=0;try{wet=Math.min(1,WXS.rain||0);}catch(e){}U.uWet.value+=(wet-U.uWet.value)*0.2;
  MFX.s=(MFX.s||0)+1;if(MFX.s%8===0)mfxScan();}   // lo que se construye después (mapas lejanos, interiores) también lo recibe
{const f=uxTick;uxTick=function(dt){f(dt);try{mfxTick(dt);}catch(e){}};}

// ---------------------------------------------------------------- visor de modelos (propuesta 11)
const MVW={r:null,sc:null,cam:null,obj:null,light:0,wire:false,raf:0};
function mvStats(o){let tri=0,ver=0,mes=0;const mats=new Set();o.traverse(m=>{if(!m.isMesh)return;mes++;const g=m.geometry,n=m.isInstancedMesh?m.count:1;tri+=(g.index?g.index.count:g.attributes.position.count)/3*n;ver+=g.attributes.position.count;(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>mats.add(x));});return{tri:Math.round(tri),ver,mes,mats:mats.size};}
function mvLights(){const s=MVW.sc;s.children.filter(o=>o.isLight).forEach(o=>s.remove(o));const k=MVW.light;
  if(k===0){s.add(new THREE.HemisphereLight(0xd6e4f2,0x8a7552,0.62));const d=new THREE.DirectionalLight(0xfff0d2,1);d.position.set(-3,4,3);s.add(d);s.background=new THREE.Color('#a9c7e0');}
  else if(k===1){s.add(new THREE.HemisphereLight(0x8a7aa0,0x5a3a2a,0.45));const d=new THREE.DirectionalLight(0xffa860,1.1);d.position.set(5,1,2);s.add(d);s.background=new THREE.Color('#d6a27c');}
  else{s.add(new THREE.HemisphereLight(0x1a2240,0x0a0806,0.25));const p=new THREE.PointLight(0xffa040,1.6,12);p.position.set(1.2,1.6,1.5);s.add(p);s.background=new THREE.Color('#0a1226');}}
function mvShow(name){const s=MVW.sc;if(MVW.obj)s.remove(MVW.obj);let o=null;try{o=name==='__persona'?(typeof makePerson==='function'?makePerson({}):null):glbPart(name);}catch(e){}if(!o){$('mvS').textContent='No se puede construir: '+name;return;}
  const g=new THREE.Group();g.add(o);o.position.set(0,0,0);const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3()),sz=b.getSize(new THREE.Vector3()).length()||1;o.position.sub(c);
  g.traverse(m=>{if(m.isMesh&&MVW.wire){m.material=m.material.clone();m.material.wireframe=true;}});s.add(g);MVW.obj=g;MVW.cam.position.set(0,sz*0.25,sz*1.15);MVW.cam.lookAt(0,0,0);
  const S=mvStats(g);$('mvS').innerHTML='<b>'+name+'</b> · '+S.tri+' triángulos · '+S.ver+' vértices · '+S.mes+' mallas · '+S.mats+' materiales · '+sz.toFixed(2)+' m';}
function mvMeasure(){const t0=performance.now();let n=0;const I=renderer.info.render;const go=()=>{renderer.render(scene,camera);n++;if(n<30)return requestAnimationFrame(go);const ms=(performance.now()-t0)/n;
  $('mvM').innerHTML='Escena principal: '+I.calls+' llamadas de dibujo · '+Math.round(I.triangles/1000)+' mil triángulos · '+ms.toFixed(1)+' ms por fotograma (sin el resto del juego) · '+renderer.info.memory.geometries+' geometrías · '+renderer.info.memory.textures+' texturas · '+(MFX.n||0)+' materiales con desgaste';};go();}
function mvOpen(){if($('mvBox'))return;const names=['__persona',...Object.keys(GLB.parts).sort()];
  eduOverlay('mvBox','Visor de modelos','<div style="display:flex;gap:10px;flex-wrap:wrap"><select id="mvL" size="12" style="min-width:190px;font:inherit">'+names.map(n=>'<option>'+n+'</option>').join('')+'</select><canvas id="mvC" width="520" height="380" style="max-width:100%;background:#000;border-radius:6px"></canvas></div><p id="mvS" class="sub"></p><div id="mvO"></div><p id="mvM" class="sub"></p>');
  const C=$('mvC');MVW.r=new THREE.WebGLRenderer({canvas:C,antialias:true});MVW.sc=new THREE.Scene();MVW.cam=new THREE.PerspectiveCamera(35,520/380,0.01,200);mvLights();
  $('mvL').onchange=e=>mvShow(e.target.value);$('mvL').onkeydown=e=>e.stopPropagation();
  [['Luz: día / atardecer / antorcha',()=>{MVW.light=(MVW.light+1)%3;mvLights();}],['Alambre',()=>{MVW.wire=!MVW.wire;mvShow($('mvL').value||'__persona');}],['Medir la escena',mvMeasure]].forEach(([t,f])=>$('mvO').appendChild(mgBtn(t,f)));
  mvShow('__persona');const loop=()=>{if(!$('mvBox')){MVW.r.dispose();try{MVW.r.forceContextLoss();}catch(e){}MVW.r=null;return;}if(MVW.obj)MVW.obj.rotation.y+=0.01;MVW.r.render(MVW.sc,MVW.cam);MVW.raf=requestAnimationFrame(loop);};loop();}
setTimeout(()=>{try{if(new URLSearchParams(location.search).get('visor'))setTimeout(mvOpen,6000);}catch(e){}},0);
