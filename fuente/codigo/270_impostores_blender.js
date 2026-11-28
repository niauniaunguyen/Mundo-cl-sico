// ============================================================ FIGURAS LEJANAS SACADAS DE BLENDER (27/11)
// Las personas lejanas (259, IMP) eran siluetas planas. Ahora, para quien tiene figura de Blender, una hoja renderizada del propio
// modelo (herramientas/blender/impostores.py + impostores_atlas.py → modelos/impostor_<tipo>.webp): 8 ángulos × 6 momentos del paso
// y uno quieto, y al lado la máscara de qué se tiñe. En el juego: el ángulo según desde dónde se mira, el paso si anda, y el color de
// la ropa de cada persona (el mismo que su figura de cerca). Una llamada de dibujo por tipo de persona. Sin modelo: la silueta de antes.
const IMB={tex:{},mesh:{},loading:false,n:0};
function imbLoad(){if(IMB.loading||typeof datoGet!=='function'||typeof BP_MODE==='undefined')return;IMB.loading=true;
  for(const k of BP_MODE[MODE]||[])datoGet('imip_'+k).then(t=>{t=(t||'').trim();if(t.length<100)return;const im=new Image();im.onload=()=>{const tx=new THREE.Texture(im);tx.needsUpdate=true;tx.magFilter=THREE.LinearFilter;tx.minFilter=THREE.LinearMipmapLinearFilter;IMB.tex[k]=tx;};im.src='data:image/webp;base64,'+t;}).catch(()=>{});}
function imbMesh(k){if(IMB.mesh[k])return IMB.mesh[k];const tx=IMB.tex[k];if(!tx)return null;const N=600,geo=new THREE.PlaneGeometry(1,2);geo.translate(0,0.95,0);
  const mat=new THREE.ShaderMaterial({fog:true,uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{map:{value:null},uDim:{value:1},uTime:{value:0}}]),
    vertexShader:'uniform float uTime;attribute vec3 aA;attribute vec3 aB;varying vec2 vUv;varying vec3 vA;varying vec3 vB;\n#include <fog_pars_vertex>\nvoid main(){vec3 c=vec3(instanceMatrix[3]);float s=instanceMatrix[0][0],yaw=instanceMatrix[0][1],ph=instanceMatrix[0][2],mv=instanceMatrix[1][1];vec3 tc=cameraPosition-c;tc.y=0.0;float va=atan(tc.x,tc.z);float rel=va-yaw;float ai=mod(floor(-rel/0.785398+0.5),8.0);float row=mv>0.5?floor(mod(uTime*7.5+ph*6.0,6.0)):6.0;vUv=vec2((ai+uv.x)/16.0,1.0-(row+1.0-uv.y)/7.0);vA=aA;vB=aB;vec3 r=normalize(vec3(tc.z,0.0,-tc.x)+1e-5);vec3 wp=c+r*position.x*s+vec3(0.0,position.y*s,0.0);vec4 mvPosition=viewMatrix*vec4(wp,1.0);gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
    fragmentShader:'uniform sampler2D map;uniform float uDim;varying vec2 vUv;varying vec3 vA;varying vec3 vB;\n#include <fog_pars_fragment>\nvoid main(){vec4 t=texture2D(map,vUv);if(t.a<0.5)discard;float m=texture2D(map,vUv+vec2(0.5,0.0)).r;vec3 tn=m>0.87?vB:(m>0.35?vA:vec3(1.0));gl_FragColor=vec4(t.rgb*tn*uDim,1.0);\n#include <fog_fragment>\n}'});
  mat.uniforms.map.value=tx;const m=new THREE.InstancedMesh(geo,mat,N);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.count=0;m.frustumCulled=false;m.userData.noSeal=1;m.userData.noCull=1;m.userData.noInst=1;
  geo.setAttribute('aA',new THREE.InstancedBufferAttribute(new Float32Array(N*3).fill(1),3));geo.setAttribute('aB',new THREE.InstancedBufferAttribute(new Float32Array(N*3).fill(1),3));scene.add(m);IMB.mesh[k]=m;return m;}
function imbCols(w){if(w.imbC)return w.imbC;const c=(w.g.userData&&w.g.userData.cfg)||{},hA=(c.himation||c.veil)?(typeof c.veil==='string'?c.veil:c.himation):null,hB=c.chiton||null;
  const A=hA?new THREE.Color(hA).multiplyScalar(1.25):new THREE.Color(1,1,1),B=hB?new THREE.Color(hB).multiplyScalar(1.08):new THREE.Color(1,1,1);return w.imbC=[A,B];}
const _imbM=new THREE.Matrix4();
{const f=impTick;impTick=function(dt){if(typeof walkers==='undefined'||!IMP.on)return f.apply(this,arguments);imbLoad();
  const counts={},mine=[];for(const k in IMB.mesh)counts[k]=0;
  for(const w of walkers){if(!w.imp||!w.g)continue;const k=(w.g.userData.bp&&w.g.userData.bp.kind)||(typeof bpfKind==='function'?bpfKind(w.g.userData.cfg):null);if(!k||!IMB.tex[k])continue;const m=imbMesh(k);if(!m)continue;
    const i=counts[k]||0;if(i>=600)continue;const p=w.g.position,s=((w.g.userData.cfg&&w.g.userData.cfg.scale)||1)*(w.g.scale.y||1),mv=w.mode!=='idle'&&w.speed>0?1:0;
    _imbM.identity();const e=_imbM.elements;e[0]=s;e[1]=w.g.rotation.y;e[2]=(w.ph0!==undefined?w.ph0:(w.ph0=Math.random()));e[5]=mv;e[10]=1;e[12]=p.x;e[13]=p.y;e[14]=p.z;m.setMatrixAt(i,_imbM);
    const[A,B]=imbCols(w),gA=m.geometry.attributes.aA,gB=m.geometry.attributes.aB;gA.setXYZ(i,A.r,A.g,A.b);gB.setXYZ(i,B.r,B.g,B.b);counts[k]=i+1;w.imp=false;mine.push(w);}
  let dim=1;try{dim=clamp(0.28+(sun.intensity||0)*0.55+(typeof hemi!=='undefined'?hemi.intensity*0.25:0),0.25,1.15);}catch(e){}
  for(const k in IMB.mesh){const m=IMB.mesh[k];m.count=counts[k]||0;m.visible=m.count>0;m.instanceMatrix.needsUpdate=true;m.geometry.attributes.aA.needsUpdate=true;m.geometry.attributes.aB.needsUpdate=true;m.material.uniforms.uTime.value+=dt;m.material.uniforms.uDim.value=dim;}
  IMB.n=mine.length;const r=f.apply(this,arguments);for(const w of mine)w.imp=true;return r;};}   // el resto (sin modelo), con la silueta de 259
