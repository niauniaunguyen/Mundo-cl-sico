// ============================================================ PERSONAS MÁS CUIDADAS: cabeza, pelo, brazos con manos y ropa suavizada
// Se rehacen al cargar algunas piezas del modelo de persona (las mismas para todos los personajes), sin tocar el archivo de Blender:
// · cabeza redondeada con mandíbula, barbilla, nariz y orejas; la cara queda a la misma profundidad, así los ojos, cejas y boca siguen en su sitio;
// · pelo que sigue la cabeza con su línea de nacimiento (rizo corto en los hombres; recogido con moño en las mujeres);
// · brazos con hombro, codo y muñeca algo doblados, y manos con pulgar;
// · normales suavizadas en la ropa y las piernas: menos aspecto de caja, más de tela.
function p2Smooth(geo){const P=geo.attributes.position;if(!P)return;const map=new Map(),key=i=>Math.round(P.getX(i)*500)+','+Math.round(P.getY(i)*500)+','+Math.round(P.getZ(i)*500);
  if(!geo.attributes.normal)geo.computeVertexNormals();const N=geo.attributes.normal;
  for(let i=0;i<P.count;i++){const k=key(i);let a=map.get(k);if(!a){a=[0,0,0];map.set(k,a);}a[0]+=N.getX(i);a[1]+=N.getY(i);a[2]+=N.getZ(i);}
  for(let i=0;i<P.count;i++){const a=map.get(key(i)),l=Math.hypot(a[0],a[1],a[2])||1;N.setXYZ(i,a[0]/l,a[1]/l,a[2]/l);}N.needsUpdate=true;}
function p2Head(){const cy=1.815,rx=0.094,ry=0.128,rz=0.1;const g=new THREE.SphereGeometry(1,28,22),P=g.attributes.position;
  for(let i=0;i<P.count;i++){let x=P.getX(i),y=P.getY(i),z=P.getZ(i);const t=Math.max(0,-y);   // t: cuánto por debajo del centro
    x*=1-0.28*t*t;z*=1-0.12*t;if(y<0&&z>0)z+=0.06*t;   // mandíbula más estrecha y barbilla adelantada
    if(y>0)z*=1+0.06*y;   // cráneo algo más largo por detrás
    if(Math.abs(x)>0.55&&y>-0.2&&y<0.35)x*=0.97;   // sienes
    P.setXYZ(i,x*rx,cy+y*ry,z*rz);}g.computeVertexNormals();
  const nose=new THREE.ConeGeometry(0.018,0.05,8);nose.rotateX(-Math.PI/2-0.35);nose.translate(0,cy-0.015,0.104);
  const ear=s=>{const e=new THREE.SphereGeometry(0.02,8,6);e.scale(0.5,1.25,0.9);e.translate(s*0.091,cy+0.005,-0.006);return e;};
  const neck=new THREE.CylinderGeometry(0.045,0.052,0.14,12,1,true);neck.translate(0,1.66,-0.01);
  const L=[{g,m:new THREE.Matrix4()},{g:nose,m:new THREE.Matrix4()},{g:ear(1),m:new THREE.Matrix4()},{g:ear(-1),m:new THREE.Matrix4()},{g:neck,m:new THREE.Matrix4()}];
  for(const o of L)if(!o.g.attributes.normal)o.g.computeVertexNormals();return mergeG(L);}
function p2Hair(fem){const cy=1.815,g=new THREE.SphereGeometry(1,30,20),P=g.attributes.position;
  for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i);
    // línea del pelo: alta en la frente, baja por detrás; por debajo, el casquete se mete dentro de la cabeza (no se ve)
    const front=Math.max(0,z),line=fem?(0.18+0.35*front*front-0.95*Math.max(0,-z)):(0.32+0.3*front*front-0.75*Math.max(0,-z));
    const on=y>line-(fem?0.12:0.05)*Math.abs(x);
    const curl=fem?1+0.02*Math.sin(y*30+x*12):1+0.07*(Math.sin(x*41+y*23)*Math.sin(z*37+y*19));
    const k=on?(fem?1.09:1.1)*curl:0.85;P.setXYZ(i,x*0.094*k,cy+y*0.128*k+(on?0.006:0),z*0.1*k-0.004);}
  g.computeVertexNormals();if(!fem)return g;
  const bun=new THREE.SphereGeometry(0.055,12,10);bun.scale(1,0.85,0.8);bun.translate(0,cy+0.03,-0.13);
  const band=new THREE.TorusGeometry(0.098,0.008,6,24);band.rotateX(Math.PI/2+0.35);band.translate(0,cy+0.07,-0.01);
  return mergeG([{g,m:new THREE.Matrix4()},{g:bun,m:new THREE.Matrix4()},{g:band,m:new THREE.Matrix4()}]);}
// brazo: tubo de radio variable por una línea quebrada (hombro, codo, muñeca) + mano
function p2Tube(pts,rad,seg){const pos=[],idx=[],up=new THREE.Vector3(1,0,0),t=new THREE.Vector3(),n=new THREE.Vector3(),b=new THREE.Vector3();
  for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],c=pts[Math.min(pts.length-1,i+1)];t.subVectors(c,a).normalize();n.crossVectors(t,up).normalize();if(n.lengthSq()<0.1)n.set(0,0,1);b.crossVectors(t,n).normalize();
    for(let s=0;s<seg;s++){const an=s/seg*TAU,cx=Math.cos(an)*rad[i],sy=Math.sin(an)*rad[i];pos.push(pts[i].x+n.x*cx+b.x*sy,pts[i].y+n.y*cx+b.y*sy,pts[i].z+n.z*cx+b.z*sy);}}
  for(let i=0;i<pts.length-1;i++)for(let s=0;s<seg;s++){const a=i*seg+s,b2=i*seg+(s+1)%seg,c=a+seg,d=b2+seg;idx.push(a,c,b2,b2,c,d);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
function p2Arm(s){const V=(x,y,z)=>new THREE.Vector3(x*s,y,z);
  const pts=[V(0,0.03,0),V(0.005,-0.08,0.0),V(0.01,-0.2,0.005),V(0.012,-0.31,0.015),V(0.01,-0.34,0.02),V(0.008,-0.46,0.045),V(0.006,-0.58,0.07),V(0.005,-0.62,0.078)];
  const rad=[0.05,0.052,0.046,0.038,0.036,0.035,0.028,0.026];const arm=p2Tube(pts,rad,10);
  const sh=new THREE.SphereGeometry(0.052,10,8);sh.translate(0,0.02,0);
  const palm=new THREE.SphereGeometry(1,10,8);palm.scale(0.022,0.05,0.036);palm.translate(0.004*s,-0.665,0.085);
  const fing=new THREE.SphereGeometry(1,8,6);fing.scale(0.018,0.035,0.03);fing.translate(0.002*s,-0.715,0.09);
  const th=new THREE.SphereGeometry(1,6,5);th.scale(0.012,0.028,0.012);th.rotateZ(-0.5*s);th.translate(-0.012*s,-0.655,0.112);
  return mergeG([arm,sh,palm,fing,th].map(g=>{if(!g.attributes.normal)g.computeVertexNormals();return{g,m:new THREE.Matrix4()};}));}
function p2Apply(){if(!GLB.ok||GLB.p2)return;GLB.p2=1;const I=new THREE.Matrix4();
  const put=(name,geo)=>{const P=GLB.parts[name];if(!P||!P.meshes.length)return;const m=P.meshes[0];geo.computeBoundingSphere();m.geo=geo;m.mat=I.clone();P.meshes.length=1;};
  try{put('P_head',p2Head());}catch(e){console.warn('p2 head',e);}
  try{put('P_hair_m',p2Hair(false));put('P_hair_f',p2Hair(true));}catch(e){console.warn('p2 hair',e);}
  try{put('P_arm_l',p2Arm(-1));put('P_arm_r',p2Arm(1));}catch(e){console.warn('p2 arm',e);}
  try{const P=GLB.parts.P_himation_f;if(P&&P.meshes.length){const role=P.meshes[0].role;   // manto femenino: por la espalda, una vuelta en las caderas y un extremo cruzando el pecho
    const back=new THREE.CylinderGeometry(0.235,0.33,1.08,18,6,true,Math.PI-1.75,3.5);back.translate(0,1.08,-0.01);
    const hip=new THREE.CylinderGeometry(0.275,0.3,0.42,18,2,true,-1.5,3.0);hip.translate(0,0.86,0.0);
    const sash=new THREE.BoxGeometry(0.17,0.62,0.025,1,4,1);sash.rotateZ(0.62);sash.translate(0.03,1.33,0.19);
    for(const g of[back,hip,sash]){const Q=g.attributes.position;for(let i=0;i<Q.count;i++){const y=Q.getY(i),x=Q.getX(i);Q.setX(i,x*(1+0.04*Math.sin(y*22+x*9)));}g.computeVertexNormals();g.computeBoundingSphere();}
    P.meshes=[back,hip,sash].map(g=>({geo:g,role,mat:I.clone()}));P.ao=0;}}catch(e){console.warn('p2 himation',e);}
  for(const n of['P_chiton_f','P_chiton_m','P_himation_f','P_himation_m','P_toga','P_tunic_short','P_sleeve_l','P_sleeve_r','P_veil','P_legs','P_beard','P_rider_body','P_rider_legs'])
    {const P=GLB.parts[n];if(P)for(const m of P.meshes)try{p2Smooth(m.geo);}catch(e){}}}
{const f=betterTrees;betterTrees=function(){f.apply(this,arguments);try{p2Apply();}catch(e){console.warn('p2',e);}};}
