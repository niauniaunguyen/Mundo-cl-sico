// ============================================================ VEGETACIÓN MEJOR: consejos de arte de entornos aplicados
// 1. Normales «de esfera»: la copa se sombrea como una sola masa y no como un racimo de bolas sueltas (normales transferidas de una forma simple).
// 2. Oclusión ambiental pintada: más oscuro abajo y por dentro de la copa, más claro arriba (atributo aAO; si falta, vale 0 y no cambia nada).
// 3. Luz de borde y algo de luz que atraviesa las hojas a contraluz (rim/translucidez barata, calculada en el vértice).
// 4. Viento en dos capas: el balanceo de siempre + un temblor fino de las hojas desfasado por vértice para que no se mueva todo a la vez.
// 5. Colocación en grupos: matas al pie de algunos árboles, más densas cerca y más sueltas lejos (caída de densidad), con números deterministas (no tocan R()).
function vegPrep(geo){if(!geo||geo.userData.vegOk)return;geo.userData.vegOk=1;const p=geo.attributes.position,n=geo.attributes.normal;if(!p||!n)return;
  geo.computeBoundingBox();const b=geo.boundingBox,cx=(b.min.x+b.max.x)/2,cy=(b.min.y+b.max.y)/2,cz=(b.min.z+b.max.z)/2,hx=Math.max(0.3,(b.max.x-b.min.x)/2),hy=Math.max(0.3,(b.max.y-b.min.y)/2),hz=Math.max(0.3,(b.max.z-b.min.z)/2);
  const ao=new Float32Array(p.count),v=new THREE.Vector3(),o=new THREE.Vector3();
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
    v.set((x-cx)/(hx*hx),(y-cy)/(hy*hy)*0.85,(z-cz)/(hz*hz));if(v.lengthSq()<1e-8)v.set(0,1,0);v.normalize();o.set(n.getX(i),n.getY(i),n.getZ(i));o.lerp(v,0.7).normalize();n.setXYZ(i,o.x,o.y,o.z);
    const h=(y-b.min.y)/(2*hy),r=Math.min(1,Math.hypot((x-cx)/hx,(z-cz)/hz));ao[i]=Math.min(0.55,0.42*Math.pow(1-h,1.4)*(1.05-0.55*r)+0.12*(1-r));}
  n.needsUpdate=true;geo.setAttribute('aAO',new THREE.BufferAttribute(ao,1));}
{const f=windMat;windMat=function(mat){const w=f(mat);if(w.userData.veg2)return w;w.userData.veg2=1;w.userData.isWind=1;const prev=w.onBeforeCompile;
  w.onBeforeCompile=function(sh,r){if(prev)prev.call(this,sh,r);
    sh.vertexShader='attribute float aAO;\nvarying float vAO;varying float vRim;\n'+sh.vertexShader.replace('#include <project_vertex>',
      '{float fk=max(0.0,position.y-0.6);float ph=dot(position,vec3(4.1,2.7,3.3));transformed+=normal*sin(uWT*6.3+ph)*0.018*fk*uWS;}\n#include <project_vertex>')
      .replace(/}\s*$/,'vAO=aAO;\n#ifdef USE_INSTANCING\nvec3 wn=normalize(mat3(modelViewMatrix)*mat3(instanceMatrix)*normal);\n#else\nvec3 wn=normalize(normalMatrix*normal);\n#endif\nvRim=pow(1.0-abs(dot(wn,normalize(-mvPosition.xyz))),2.2);\n}');
    sh.fragmentShader='varying float vAO;varying float vRim;\n'+sh.fragmentShader.replace('#include <tonemapping_fragment>','gl_FragColor.rgb*=(1.0-vAO);gl_FragColor.rgb+=vec3(0.10,0.12,0.04)*vRim*(1.0-vAO);\n#include <tonemapping_fragment>');};
  const k0=w.customProgramCacheKey;w.customProgramCacheKey=()=>(k0?k0():'')+'veg2';return w;};}
{const f=chunked;chunked=function(geo,mat,items,opt){try{if(mat&&mat.userData&&mat.userData.isWind)vegPrep(geo);}catch(e){}return f(geo,mat,items,opt);};}
// 5. matas al pie de los árboles, en grupos con caída de densidad
{const f=treesGLB;treesGLB=function(list){f(list);try{if(!GLB.parts.T_bush)return;const B=[];
  for(const t of list){if(t.kind==='cypress')continue;const h0=hash(t.x*0.37,t.z*0.53);if(h0>0.4)continue;const n=1+Math.floor(hash(t.x,t.z*1.7)*3);
    for(let k=0;k<n;k++){const a=hash(t.x+k*3.1,t.z)*TAU,d=1.6+Math.pow(hash(t.z+k,t.x*0.7),1.6)*3.2,x=t.x+Math.cos(a)*d,z=t.z+Math.sin(a)*d;if(riverWater(x,z)!==null)continue;
      const s=(0.55+hash(x,z)*0.6)*(1.15-d/6);B.push({x,y:floorAt(x,z)-0.05,z,a:hash(z,x)*TAU,sx:s,sy:s*(0.8+hash(x*2,z)*0.4),sz:s,cf:new THREE.Color('#6f7d4a').offsetHSL((hash(x,z*3)-0.5)*0.04,(hash(z,x*3)-0.5)*0.1,(hash(x*5,z)-0.5)*0.1)});}}
  if(B.length)placeModules('T_bush',B,{far:700,shadow:false});}catch(e){}};}
