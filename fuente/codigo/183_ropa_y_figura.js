// ============================================================ ROPA CON CAÍDA Y FIGURA MÁS NATURAL
// Propuestas 3, 4 y 5 (personas), sin el archivo de Blender: se rehacen al cargar algunas piezas del modelo de persona.
// · Mangas: en vez de un bloque cuadrado sobre el hombro, una manga de tela que cae del hombro y se abre hacia el codo, como la del
//   quitón jonio, que se abrochaba con fíbulas a lo largo del brazo (Hope, Costumes of the Greeks and Romans, láms. 9-12).
// · Pliegues: cada prenda lleva un atributo con el ángulo alrededor del cuerpo y la altura; el sombreador dibuja pliegues verticales
//   finos en el quitón (el de lino, muy plisado), más anchos en el himation y la toga, y más marcados cuanto más abajo cae la tela.
// · Manto femenino: el extremo que cruza el pecho sigue el cuerpo en diagonal, del hombro izquierdo a la cadera derecha (antes era una
//   tabla plana), y la vuelta de las caderas cae más baja por un lado, como en las korai y las estelas áticas.
// · Las juntas de hombros y caderas quedan tapadas por la manga y el manto.
const FIG={done:false};
// ángulo, caída y número de pliegues por vértice (en el espacio de la persona)
function figFold(P,N,axis){if(!P)return;for(const m of P.meshes){const g=m.geo,p=g.attributes.position;if(!p)continue;const v=new THREE.Vector3();let y0=1e9,y1=-1e9;const W=[];
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(m.mat).add(P.pos);W.push(v.clone());y0=Math.min(y0,v.y);y1=Math.max(y1,v.y);}
    const a=new Float32Array(p.count*4),ax=axis||[0,0];
    for(let i=0;i<p.count;i++){const w=W[i],dx=w.x-ax[0]-(axis?P.pos.x:0),dz=w.z-ax[1]-(axis?P.pos.z:0),l=Math.hypot(dx,dz)||1;a[i*4]=dz/l;a[i*4+1]=dx/l;a[i*4+2]=(y1-w.y)/Math.max(0.05,y1-y0);a[i*4+3]=N;}
    g.setAttribute('aFd',new THREE.BufferAttribute(a,4));}}
// la tela de las personas pinta los pliegues (se encadena al sombreador que ya tiene, 009 personMat)
{const f=personMat;personMat=function(hex,kind,o){const m=f.apply(this,arguments);if(kind!=='cloth'||!m||m.userData.fold)return m;m.userData.fold=1;
  const prev=m.onBeforeCompile,pk=m.customProgramCacheKey;
  m.onBeforeCompile=function(sh,r){if(prev)prev.call(this,sh,r);
    sh.vertexShader='attribute vec4 aFd;\nvarying vec4 vFd;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvFd=aFd;');
    sh.fragmentShader='varying vec4 vFd;\n'+sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n{float on=step(0.001,abs(vFd.x)+abs(vFd.y));float th=atan(vFd.y,vFd.x);'+
      'float fo=sin(vFd.w*th+2.2*sin(th*2.0+vFd.z*3.0)+vFd.z*1.5);float k=on*(0.25+0.75*smoothstep(0.05,0.6,vFd.z));'+
      'diffuseColor.rgb*=mix(1.0,0.74+0.34*(0.5+0.5*fo),k*0.85);}');};
  m.customProgramCacheKey=function(){return (pk?pk.call(this):'')+'fd';};m.needsUpdate=true;return m;};}
// manga que cae del hombro
function figSleeve(s){const V=(x,y,z)=>new THREE.Vector3(x*s,y,z);
  const pts=[V(-0.04,0.07,0),V(-0.024,0.035,0),V(-0.006,-0.04,0.002),V(0.008,-0.13,0.005),V(0.014,-0.21,0.01)],rad=[0.04,0.086,0.086,0.081,0.08];
  const t=p2Tube(pts,rad,14),cap=new THREE.SphereGeometry(0.088,12,6,0,TAU,0,Math.PI/2);cap.scale(1.05,0.62,0.95);cap.translate(-0.022*s,0.034,0);
  // bajo de la manga algo irregular
  const Q=t.attributes.position;for(let i=0;i<Q.count;i++){const y=Q.getY(i);if(y<-0.18){const x=Q.getX(i),z=Q.getZ(i);Q.setY(i,y+0.012*Math.sin(Math.atan2(z,x-0.014*s)*3));}}t.computeVertexNormals();
  return mergeG([{g:t,m:new THREE.Matrix4()},{g:cap,m:new THREE.Matrix4()}]);}
// extremo del manto femenino que cruza el pecho en diagonal, pegado al cuerpo
function figSash(){const pts=[],N=16,rx=y=>0.2+0.03*Math.max(0,1.2-y),rz=y=>0.15+0.04*Math.max(0,1.2-y);
  for(let i=0;i<=N;i++){const t=i/N,th=-2.3+t*3.7,y=1.5+0.07*Math.sin(Math.min(1,t*2.2)*Math.PI)-t*0.58,o=0.03+0.015*Math.sin(t*Math.PI);
    pts.push([Math.sin(th)*(rx(y)+o),y,Math.cos(th)*(rz(y)+o),th]);}
  const pos=[],idx=[],W=0.17,T=0.018;
  for(let i=0;i<=N;i++){const [x,y,z,th]=pts[i],a=pts[Math.max(0,i-1)],b=pts[Math.min(N,i+1)],tg=new THREE.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]).normalize(),nr=new THREE.Vector3(Math.sin(th),0,Math.cos(th)),bn=new THREE.Vector3().crossVectors(tg,nr).normalize();
    const w=W*(0.8+0.25*Math.sin(i/N*Math.PI));for(const [u,d] of[[-1,0],[1,0],[1,1],[-1,1]]){pos.push(x+bn.x*u*w/2+nr.x*d*T,y+bn.y*u*w/2+nr.y*d*T,z+bn.z*u*w/2+nr.z*d*T);}}
  for(let i=0;i<N;i++)for(let k=0;k<4;k++){const a=i*4+k,b=i*4+(k+1)%4,c=a+4,d=b+4;idx.push(a,b,c,b,d,c);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
function figApply(){if(!GLB.ok||FIG.done)return;FIG.done=true;const I=new THREE.Matrix4();
  try{for(const [n,s] of[['P_sleeve_l',-1],['P_sleeve_r',1]]){const P=GLB.parts[n];if(!P||!P.meshes.length)continue;const role=P.meshes[0].role,g=figSleeve(s);g.computeBoundingSphere();const n2=g.attributes.position.count,cc=new Float32Array(n2*3);for(let i=0;i<n2;i++){const y=g.attributes.position.getY(i);const v=0.97-0.12*Math.max(0,(-0.1-y)/0.12);cc[i*3]=cc[i*3+1]=cc[i*3+2]=v;}g.setAttribute('color',new THREE.BufferAttribute(cc,3));P.meshes=[{geo:g,role,mat:I.clone()}];P.ao=1;P.pos.set(0,0,0);}}catch(e){console.warn('fig manga',e);}
  try{const P=GLB.parts.P_himation_f;if(P&&P.meshes.length===3){const role=P.meshes[0].role,s=figSash();s.computeBoundingSphere();P.meshes[2]={geo:s,role,mat:I.clone()};
    // la vuelta de las caderas: más larga y más baja por el lado derecho
    const hip=P.meshes[1].geo,Q=hip.attributes.position;hip.computeBoundingBox();const yb=hip.boundingBox.min.y;for(let i=0;i<Q.count;i++){const y=Q.getY(i);if(y<yb+0.02){const x=Q.getX(i);Q.setY(i,y-0.12-0.1*Math.max(0,x/0.3));}}hip.computeVertexNormals();P.ao=0;}}catch(e){console.warn('fig manto',e);}
  try{figFold(GLB.parts.P_chiton_f,30);figFold(GLB.parts.P_chiton_m,26);figFold(GLB.parts.P_tunic_short,18);figFold(GLB.parts.P_himation_m,11);figFold(GLB.parts.P_himation_f,12);
    figFold(GLB.parts.P_toga,9);figFold(GLB.parts.P_veil,12);figFold(GLB.parts.P_sleeve_l,9,[0,0]);figFold(GLB.parts.P_sleeve_r,9,[0,0]);}catch(e){console.warn('fig pliegues',e);}}
{const f=betterTrees;betterTrees=function(){f.apply(this,arguments);try{figApply();}catch(e){console.warn('fig',e);}};}
// ---------------------------------------------------------------- público de las gradas (anfiteatro, teatros, circo)
// Antes eran prismas de cinco caras; ahora una figura sentada (manto con hombros y cuello) y, aparte, la cabeza con su color de
// piel y el pelo por encima. Misma cantidad de objetos y una llamada de dibujo más por zona.
const FIG_SKIN=['#c99a74','#b3805a','#dcb391','#a07a4a','#d4a67f','#8a5f3e'].map(h=>new THREE.Color(h)),FIG_HAIR=['#2a1d14','#3b2a1e','#5a3d26','#1a120c','#8a8478'].map(h=>new THREE.Color(h));
function figSeatGeo(){if(FIG.seat)return FIG.seat;const pts=[[0,0],[0.25,0.02],[0.27,0.18],[0.25,0.42],[0.2,0.6],[0.22,0.78],[0.2,0.86],[0.12,0.92],[0.055,0.95],[0.05,1.0],[0,1.0]].map(([r,y])=>new THREE.Vector2(r,y));
  const g=new THREE.LatheGeometry(pts,9),p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);if(y>0.7)p.setZ(i,p.getZ(i)*0.72);}g.computeVertexNormals();g.computeBoundingSphere();return FIG.seat=g;}
function figHeadGeo(){if(FIG.head)return FIG.head;const h=new THREE.SphereGeometry(0.1,9,7);h.scale(0.9,1.1,0.95);h.translate(0,1.1,0);h.computeBoundingSphere();
  const hair=new THREE.SphereGeometry(0.106,9,5,0,TAU,0,Math.PI*0.45);hair.scale(0.92,1.1,0.97);hair.translate(0,1.117,0);hair.computeBoundingSphere();return FIG.head=[h,hair];}
{const f=chunked;chunked=function(geo,mat,items,opt){const P=geo&&geo.parameters;
  if(geo&&geo.type==='CylinderGeometry'&&P&&P.radialSegments===5&&Math.abs(P.radiusTop-0.2)<1e-6&&Math.abs(P.height-1.15)<1e-6&&items&&items.length){
    f.call(this,figSeatGeo(),mat,items,opt);   // el cuerpo, con el color de cada manto
    const hm=FIG.hm||(FIG.hm=new THREE.MeshLambertMaterial({color:0xffffff})),[hg,hr]=figHeadGeo();
    f.call(this,hg,hm,items.map((it,i)=>({m:it.m,c:FIG_SKIN[i%FIG_SKIN.length]})),opt);f.call(this,hr,hm,items.map((it,i)=>({m:it.m,c:FIG_HAIR[(i*7)%FIG_HAIR.length]})),opt);return;}
  return f.apply(this,arguments);};}
