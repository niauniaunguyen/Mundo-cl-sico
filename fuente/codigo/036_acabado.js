// ============================================================ acabado: texturas procedurales y luz
// Las texturas son de detalle (casi grises): el color de cada material las tiñe. Se proyectan según la posición en el mundo
// (proyección triplanar), así que un muro de 30 m y un pilar de 1 m tienen la textura a la misma escala, sin depender de las UV:
// sirve igual para cajas, columnas instanciadas, piezas de Blender (que no tienen UV) y el terreno.
function pnoise(x,y,P,seed){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,h=(i,j)=>{const a=((i%P)+P)%P,b=((j%P)+P)%P,s=Math.sin(a*127.1+b*311.7+seed*74.7)*43758.5453;return s-Math.floor(s);};
  const u=sstep(xf),v=sstep(yf);return lerp(lerp(h(xi,yi),h(xi+1,yi),u),lerp(h(xi,yi+1),h(xi+1,yi+1),u),v);}
function pfbm(x,y,P,seed,oct){let s=0,a=0.5,f=1,n=0;for(let o=0;o<(oct||4);o++){s+=pnoise(x*f,y*f,P*f,seed+o*7)*a;n+=a;a*=0.5;f*=2;}return s/n;}
// textura de N x N px: fn(u,v) en [0,1) devuelve [r,g,b] en [0,1]
function procTex(N,fn){const c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d'),img=x.createImageData(N,N);
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const p=fn(i/N,j/N),k=(j*N+i)*4;img.data[k]=clamp(p[0],0,1)*255;img.data[k+1]=clamp(p[1],0,1)*255;img.data[k+2]=clamp(p[2],0,1)*255;img.data[k+3]=255;}
  x.putImageData(img,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;}
const g3=v=>[v,v,v];
// sillería: hiladas de bloques al tresbolillo, con juntas y vetas suaves
function ashlarTex(rows,cols,rough,veins,seed){return procTex(256,(u,v)=>{const r=Math.floor(v*rows),off=(r%2)*0.5,cu=u*cols+off,c=Math.floor(cu),fu=cu-c,fv=v*rows-r;
  const joint=Math.min(fu,1-fu)*256/cols<1.6||Math.min(fv,1-fv)*256/rows<1.6;const blk=hash(c%cols+seed,r+seed*3);
  let val=0.9+blk*0.08-(pfbm(u*8,v*8,8,seed,4)-0.5)*rough;if(veins){const w=Math.sin((u*3+v*1.3+pfbm(u*4,v*4,4,seed+9,3)*2.2)*TAU*2);val-=Math.pow(Math.abs(w),18)*0.12;}
  if(joint)val*=0.72;return g3(val);});}
const PTEX={
 marble:ashlarTex(4,2,0.08,true,3),
 stone:ashlarTex(5,3,0.22,false,11),
 brick:procTex(256,(u,v)=>{const rows=22,r=Math.floor(v*rows),off=(r%2)*0.5,cu=u*7+off,c=Math.floor(cu),fu=cu-c,fv=v*rows-r;const mortar=fv<0.24||Math.min(fu,1-fu)<0.03;
   if(mortar)return[0.98,0.95,0.9];const b=0.74+hash(c,r)*0.18-(pfbm(u*16,v*16,16,5,3)-0.5)*0.12;return[b,b*0.97,b*0.94];}),
 plaster:procTex(256,(u,v)=>{let val=0.93-(pfbm(u*5,v*5,5,21,5)-0.5)*0.22-Math.pow(pfbm(u*24,v*24,24,4,2),3)*0.06;const st=pfbm(u*2,v*9,2,33,3);val-=Math.max(0,st-0.62)*0.25;return[val,val*0.99,val*0.96];}),
 tile:procTex(256,(u,v)=>{const cols=8,rows=6,cu=u*cols,c=Math.floor(cu),fu=cu-c,fv=(v*rows)%1;let val=0.72+0.28*Math.sin(fu*Math.PI);val*=0.85+0.15*fv;val*=0.92+hash(c,Math.floor(v*rows))*0.1;return[val,val*0.96,val*0.92];}),
 wood:procTex(256,(u,v)=>{const pl=Math.floor(u*5),g=pfbm(u*5*2,v*1.2,10,pl+2,4);let val=0.78+0.18*Math.sin((u*5*12+g*6)*TAU*0.5)*0.5+hash(pl,1)*0.08;if((u*5)%1<0.04)val*=0.6;return[val,val*0.94,val*0.88];}),
 leaf:procTex(128,(u,v)=>{const val=0.7+pfbm(u*12,v*12,12,51,3)*0.38;return[val*0.95,val,val*0.9];}),
 bark:procTex(128,(u,v)=>{const val=0.68+pfbm(u*14,v*3,14,61,4)*0.42;return[val,val*0.95,val*0.9];}),
 // detalle del suelo por zonas (ver terrainMat): roca, hierba, grava y tierra cuarteada
 rock:procTex(256,(u,v)=>{const b=pfbm(u*6,v*6,6,81,5),c=Math.abs(pnoise(u*10,v*10,10,83)-0.5),c2=Math.abs(pnoise(u*22,v*22,22,85)-0.5);let val=0.66+b*0.36;if(c<0.025)val*=0.62;if(c2<0.018)val*=0.78;return[val,val*0.98,val*0.95];}),
 grass:procTex(256,(u,v)=>{const a=pnoise(u*96,v*18,96,91),b=pnoise(u*20,v*96,20,93),c=pfbm(u*8,v*8,8,95,3);const val=0.68+Math.max(a,b)*0.34+c*0.12;return[val*0.9,val,val*0.74];}),
 gravel:procTex(256,(u,v)=>{const N=26,cu=u*N,cv=v*N;let best=9,sh=0;for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ci=Math.floor(cu)+di,cj=Math.floor(cv)+dj,a=((ci%N)+N)%N,b=((cj%N)+N)%N,px=ci+hash(a,b*7+1),py=cj+hash(a*3+5,b),r=0.22+hash(a+9,b+4)*0.25,d=Math.hypot(cu-px,cv-py)/r;if(d<best){best=d;sh=((cu-px)+(cv-py))/r;}}
   let val=0.8+(pnoise(u*60,v*60,60,97)-0.5)*0.1;if(best<1)val=best>0.82?0.6:0.92-sh*0.07+hash(Math.floor(cu),Math.floor(cv))*0.08;return[val,val*0.97,val*0.92];}),
 cracks:procTex(256,(u,v)=>{const N=12,cu=u*N,cv=v*N;let f1=9,f2=9;for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ci=Math.floor(cu)+di,cj=Math.floor(cv)+dj,a=((ci%N)+N)%N,b=((cj%N)+N)%N,d=Math.hypot(cu-ci-hash(a,b+3),cv-cj-hash(a+7,b));if(d<f1){f2=f1;f1=d;}else if(d<f2)f2=d;}
   let val=0.9+(pfbm(u*12,v*12,12,99,3)-0.5)*0.12;const w=pfbm(u*20,v*20,20,101,2);if(f2-f1<0.02+w*0.025)val*=0.8+w*0.12;return[val,val*0.97,val*0.93];}),
 ground:procTex(256,(u,v)=>{const big=pfbm(u*4,v*4,4,71,4),fine=pnoise(u*64,v*64,64,7),peb=Math.pow(pnoise(u*40,v*40,40,9),6);let val=0.8+big*0.18+fine*0.06-peb*0.25;return[val,val*(0.98+big*0.03),val*0.95];})
};
// proyección triplanar en un MeshLambertMaterial (con o sin instancias); 'scale' son los metros que ocupa la textura; flat: solo desde arriba (terreno)
// relieve de detalle (212): la textura se «graba» con la luz del sol: más clara donde sube hacia el sol, más oscura donde baja
const GFXU={uLd:{value:LIGHTDIR},uEmb:{value:1.0}};
function triplanar(mat,tex,scale,flat){
  mat.map=tex;const key='tp'+(flat?'f':'');mat.customProgramCacheKey=()=>key;mat.userData.tpScale=1/scale;
  mat.onBeforeCompile=sh=>{sh.uniforms.tpScale={value:mat.userData.tpScale};sh.uniforms.uLd=GFXU.uLd;sh.uniforms.uEmb=GFXU.uEmb;
    sh.vertexShader='varying vec3 vTpPos;\nvarying vec3 vTpNor;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvec4 tpw=vec4(transformed,1.0);vec3 tpn=objectNormal;\n#ifdef USE_INSTANCING\ntpw=instanceMatrix*tpw;tpn=mat3(instanceMatrix)*tpn;\n#endif\ntpw=modelMatrix*tpw;vTpPos=tpw.xyz;vTpNor=normalize(mat3(modelMatrix)*tpn);');
    sh.fragmentShader='uniform float tpScale,uEmb;uniform vec3 uLd;\nvarying vec3 vTpPos;\nvarying vec3 vTpNor;\n'+sh.fragmentShader.replace('#include <map_fragment>',flat?
      'vec4 tc=texture2D(map,vTpPos.xz*tpScale);diffuseColor*=tc;':
      'vec3 tb=pow(abs(normalize(vTpNor)),vec3(4.0));tb/=(tb.x+tb.y+tb.z);vec4 tc=texture2D(map,vTpPos.zy*tpScale)*tb.x+texture2D(map,vTpPos.xz*tpScale)*tb.y+texture2D(map,vTpPos.xy*tpScale)*tb.z;vec3 pB=vTpPos+uLd*0.035/max(tpScale*3.0,0.2);vec4 tB=texture2D(map,pB.zy*tpScale)*tb.x+texture2D(map,pB.xz*tpScale)*tb.y+texture2D(map,pB.xy*tpScale)*tb.z;diffuseColor*=tc*(1.0+clamp((dot(tc.rgb,vec3(0.333))-dot(tB.rgb,vec3(0.333)))*uEmb*1.6,-0.22,0.22));');};
  mat.needsUpdate=true;return mat;}
const ROLE_TEX={wall:['plaster',5],plaster:['plaster',5],brick:['brick',2.6],roof:['tile',3],foliage:['leaf',2.2],travertine:['stone',3.4],socle:['stone',2.6],stone:['stone',2],bark:['bark',1.6],wood:['wood',2],marble:['marble',4],granite:['marble',3],vine:['leaf',1.5]};
const WHITE_ROLE={},ROLE_MAT={};
function whiteRole(role){const t=ROLE_TEX[role];if(!t)return WHITE_M;if(!WHITE_ROLE[role])WHITE_ROLE[role]=triplanar(new THREE.MeshLambertMaterial({color:0xffffff}),PTEX[t[0]],t[1]);return WHITE_ROLE[role];}
function roleMat(role){const c=ROLE_C[role]||'#999999',t=ROLE_TEX[role];if(!t)return lam(c);if(!ROLE_MAT[role])ROLE_MAT[role]=triplanar(new THREE.MeshLambertMaterial({color:c}),PTEX[t[0]],t[1]);return ROLE_MAT[role];}
// los mapas y escalas del suelo son uniformes compartidos (TERR_U): 209 los cambia por los escaneos de Poly Haven cuando llegan
const TERR_U={uLd:GFXU.uLd,uEmb:GFXU.uEmb,tpScale:{value:1/9},groundMap:{value:PTEX.ground},rockMap:{value:PTEX.rock},grassMap:{value:PTEX.grass},gravMap:{value:PTEX.gravel},crackMap:{value:PTEX.cracks},rS:{value:0.2},hS:{value:0.6},vS:{value:0.42},cS:{value:0.11}};
function terrainMat(){const m=new THREE.MeshLambertMaterial({vertexColors:true,color:'#e2c99e'});TERR_MATS.push(m);triplanar(m,PTEX.ground,9,true);m.customProgramCacheKey=()=>'terr2';
  // el suelo cambia según el sitio: roca en las pendientes, hierba donde el color es verde, grava y tierra cuarteada a manchas,
  // y grandes manchas de color (tierra roja, zonas más claras u oscuras) para que no se repita la misma textura cada 9 m
  m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,TERR_U);
    sh.vertexShader='varying vec3 vTpPos;\nvarying vec3 vTpNor;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvec4 tpw=modelMatrix*vec4(transformed,1.0);vTpPos=tpw.xyz;vTpNor=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader='uniform float tpScale,rS,hS,vS,cS,uEmb;uniform vec3 uLd;uniform sampler2D groundMap,rockMap,grassMap,gravMap,crackMap;\nvarying vec3 vTpPos;\nvarying vec3 vTpNor;\n'+
     'float tH(vec2 p){p=mod(p,289.0);return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\nfloat tV(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(tH(i),tH(i+vec2(1.0,0.0)),f.x),mix(tH(i+vec2(0.0,1.0)),tH(i+vec2(1.0,1.0)),f.x),f.y);}\n'+
     sh.fragmentShader.replace('#include <map_fragment>',[
      'vec2 wp=vTpPos.xz;float m1=tV(wp*0.006),m2=tV(wp*0.021+3.7)*0.7+tV(wp*0.06+9.1)*0.3,m3=tV(wp*0.08+11.3);',
      'vec2 rw=mat2(0.8,-0.6,0.6,0.8)*wp;vec3 col=mix(texture2D(groundMap,wp*tpScale).rgb,texture2D(groundMap,rw*tpScale*0.31).rgb,0.3+0.3*m3);',   // dos escalas giradas: sin repetición visible
      'vec3 nn=abs(normalize(vTpNor));float slope=1.0-nn.y;',
      'vec3 rk=nn.x>nn.z?texture2D(rockMap,vTpPos.zy*rS).rgb:texture2D(rockMap,vTpPos.xy*rS).rgb;rk=mix(rk,texture2D(rockMap,wp*rS).rgb,nn.y);',
      '#ifdef USE_COLOR\nfloat green=smoothstep(0.0,0.05,vColor.g-vColor.r*0.93);\n#else\nfloat green=0.0;\n#endif',
      'float rockW=smoothstep(0.2,0.48,slope+(m2-0.5)*0.22);',
      'float grassW=green*(0.5+0.5*m3)*(1.0-rockW);',
      'float dry=(1.0-green)*(1.0-rockW);float gravW=dry*smoothstep(0.62,0.78,m2)*0.5;float crackW=dry*smoothstep(0.7,0.88,m1)*(1.0-gravW)*0.25;',
      'col=mix(col,texture2D(gravMap,wp*vS).rgb,gravW);col=mix(col,texture2D(crackMap,wp*cS).rgb,crackW);col=mix(col,texture2D(grassMap,wp*hS).rgb,grassW*0.8);col=mix(col,rk,rockW);',
      '{vec2 eo=normalize(uLd.xz+vec2(1e-4))*0.012/tpScale;float eA=dot(texture2D(groundMap,wp*tpScale).rgb,vec3(0.333)),eB=dot(texture2D(groundMap,(wp+eo)*tpScale).rgb,vec3(0.333));col*=1.0+clamp((eA-eB)*uEmb*(1.6-uLd.y),-0.3,0.3)*(1.0-rockW);}',   // relieve (212)
      'col*=0.86+0.26*m1;',   // manchas grandes más claras u oscuras
      'col=mix(col,col*vec3(1.08,0.95,0.84),smoothstep(0.55,0.82,m2)*0.55*dry);',   // tierra rojiza (terra rossa) a manchas
      'col=mix(col,col*vec3(0.9,0.97,1.0),smoothstep(0.62,0.88,m3)*0.25);',
      'diffuseColor.rgb*=col;'].join('\n'));};
  m.needsUpdate=true;return m;}   // tinte cálido: compensa la desaturación del mapeo tonal
// materiales de los edificios
triplanar(M.marble,PTEX.marble,4);triplanar(M.marbleShade,PTEX.marble,4);triplanar(M.stone,PTEX.stone,3);triplanar(M.limestone,PTEX.stone,3);
triplanar(M.tile,PTEX.tile,3);triplanar(M.wood,PTEX.wood,2);
triplanar(TRAV,PTEX.stone,3.6);triplanar(TRAV2,PTEX.stone,3.6);triplanar(BRICK,PTEX.brick,2.6);triplanar(PLAST,PTEX.plaster,5);triplanar(TUFA,PTEX.stone,3);
triplanar(RING_M,PTEX.stone,3);
for(const c of['#e8dfcc','#e6dcc6','#e3d8c2','#d9c7a8'])triplanar(lam(c),PTEX.plaster,5);   // enlucidos de casas griegas, escuelas y palestra
// luz: mapeo tonal filmico (los blancos ya no se queman), sombras más nítidas y amplias
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
{const sm=2048;sun.shadow.mapSize.set(sm,sm);}   // 4096 costaba mucho en escritorio y apenas se notabaObject.assign(sun.shadow.camera,{left:-130,right:130,top:130,bottom:-130,far:700});sun.shadow.camera.updateProjectionMatrix();sun.shadow.bias=-0.0005;sun.shadow.normalBias=0.5;

