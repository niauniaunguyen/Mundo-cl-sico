// ============================================================ GRÁFICOS: nubes, sombras de contacto, agua, bruma, estaciones, parpadeo, noche y acabado
// V1 Relieve: las texturas del suelo y de los muros se «graban» con la luz del sol (036: GFXU) y los muros al norte tienen verdín (181).
// V2 Sombras de contacto: una mancha oscura y suave bajo los pies de cada persona cercana.
// V3 Nubes: una capa de nubes sacada de un cielo real de Poly Haven (CC0; herramientas/blender/nubes_capa.py → modelos/nubes.jpg),
//    teñida con la luz de cada hora (blancas a mediodía, doradas al atardecer, grises de noche), más densa cuando el tiempo es malo
//    y moviéndose despacio con el viento.
// V4 Agua: turquesa donde hay poco fondo y espuma en la orilla (con el mapa de alturas del terreno de 181).
// V5 Bruma: calima en verano a mediodía, neblina baja al amanecer y rayos de sol entre los árboles por la mañana y la tarde.
// V6 Estaciones: la hierba verde en primavera, agostada en verano, parda en otoño.
// V7 Desgaste: verdín y humedad en las caras de los muros que miran al norte (181).
// V8 Personas: parpadean (los ojos se cierran un instante cada pocos segundos).
// V9 Noche: las antorchas cercanas iluminan de verdad (cuatro luces que se mueven a las más próximas) y el cielo tiene las estrellas
//    brillantes reales en su sitio (catálogo de PyEphem, licencia MIT), con la precesión de los equinoccios aplicada: en el 386 a.C.
//    la Polar no marcaba el norte. Mirando arriba se dibujan las constelaciones que describe Arato (Fenómenos).
// V10 Acabado: un tono de color por época (más cálido en Atenas, más ocre en Roma), viñeteado suave, y «Detalle gráfico» en el menú
//    (alto, medio, bajo) para los ordenadores del aula.
const GQ={q:'alto',t:0,cRot:0,blob:null,mist:null,rays:null,lights:[],stars:null,lines:null,starT:0,seenSky:false,vig:null};
try{const v=localStorage.getItem('nostos-gq');if(v)GQ.q=v;else if(typeof ACC!=='undefined'&&ACC.lite)GQ.q='medio';}catch(e){}
function gqLabel(){return 'Detalle gráfico: '+GQ.q;}
function gqOn(min){const o={bajo:0,medio:1,alto:2};return o[GQ.q]>=o[min];}
function gqApply(){GFXU.uEmb.value=gqOn('medio')?1:0;SKY.uniforms.cOn.value=gqOn('medio')&&SKY.uniforms.cloudMap.value?1:0;gqGrade();}
{const f=gmDo;gmDo=function(k){if(k==='gq'){GQ.q=GQ.q==='alto'?'medio':GQ.q==='medio'?'bajo':'alto';try{localStorage.setItem('nostos-gq',GQ.q);}catch(e){}gqApply();gmRender();return;}return f.apply(this,arguments);};}
// ---- V3: nubes en el cielo
Object.assign(SKY.uniforms,{cloudMap:{value:null},cRot:{value:0},cDens:{value:0},cOn:{value:0},cLit:{value:new THREE.Color(1,1,1)},cDark:{value:new THREE.Color(0.6,0.62,0.66)}});
{const F=SKY.fragmentShader,i=F.lastIndexOf('gl_FragColor=vec4(c,1.0);}');
  SKY.fragmentShader='uniform sampler2D cloudMap;uniform float cRot,cDens,cOn;uniform vec3 cLit,cDark;\n'+F.slice(0,i)+
   'if(cOn>0.5&&vp.y>-0.02){float u=atan(vp.z,vp.x)/6.2832+0.5+cRot;float vv=acos(clamp(vp.y,0.0,1.0))/1.5708;vec3 cm=texture2D(cloudMap,vec2(u,1.0-min(vv,0.995))).rgb;'+
   'float th=0.22-cDens*0.3;float a=smoothstep(th,th+0.35,cm.r+cDens*0.2);a=max(a,cDens*cDens*0.8);a*=smoothstep(-0.02,0.1,vp.y);'+
   'vec3 cc=mix(cDark,cLit,clamp(cm.g*1.15,0.0,1.0)*(1.0-0.45*cDens));cc+=cLit*pow(s,6.0)*0.35*(1.0-cDens);c=mix(c,cc,a*0.93);}'+F.slice(i);SKY.needsUpdate=true;}
function gqClouds(){if(GQ.cl||typeof bpBytes!=='function')return;GQ.cl=1;bpBytes('imgnb').then(buf=>{if(!buf)return;const im=new Image();im.onload=()=>{const t=new THREE.Texture(im);t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.ClampToEdgeWrapping;t.generateMipmaps=false;t.minFilter=THREE.LinearFilter;t.needsUpdate=true;SKY.uniforms.cloudMap.value=t;   /* sin mipmaps: en la costura del ángulo la GPU elegía mal el nivel y salía una raya en el cielo */SKY.uniforms.cOn.value=gqOn('medio')?1:0;};im.src=URL.createObjectURL(new Blob([buf],{type:'image/jpeg'}));}).catch(()=>{});}
const _gc1=new THREE.Color(),_gc2=new THREE.Color();
function gqSkyColors(){const U=SKY.uniforms,e=SUNDIR.y,day=DAYF;_gc1.setRGB(0.05,0.06,0.09);_gc2.copy(sun.color).lerp(new THREE.Color(1,1,1),clamp((e-0.05)/0.35,0,1));U.cLit.value.copy(_gc1).lerp(_gc2,day);
  U.cDark.value.copy(U.cLit.value).multiplyScalar(0.62).lerp(U.top.value,0.25);let d=0;try{d=WXS.cl||0;}catch(e){}U.cDens.value=d;}
{const f=updateSky;updateSky=function(){const r=f.apply(this,arguments);try{gqSkyColors();gqHaze();}catch(e){}return r;};}
// ---- V5: calima de verano
function gqHaze(){if(!state||(typeof INT2!=='undefined'&&INT2.in))return;let ss='pri';try{ss=calNow().season.id;}catch(e){}const h=clock.h;if(ss==='ver'&&h>11&&h<17.5&&!(WXS.cl>0.3)){const k=Math.sin((h-11)/6.5*Math.PI)*0.5;
  scene.fog.near*=1-0.35*k;scene.fog.far*=1-0.3*k;scene.fog.color.lerp(_gc1.set('#e8d6ae'),0.3*k);}}
// ---- V2: sombras de contacto
function gqBlobTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,31);g.addColorStop(0,'rgba(0,0,0,0.62)');g.addColorStop(0.55,'rgba(0,0,0,0.3)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);}
function gqBlobs(){if(!gqOn('medio')){if(GQ.blob)GQ.blob.count=0;return;}if(!GQ.blob){const g=new THREE.PlaneGeometry(1,1);g.rotateX(-Math.PI/2);const m=new THREE.MeshBasicMaterial({map:gqBlobTex(),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3});
    GQ.blob=new THREE.InstancedMesh(g,m,240);GQ.blob.frustumCulled=false;GQ.blob.renderOrder=1;scene.add(GQ.blob);}
  const P=player,L=[];try{for(const g of BP.list){if(!g.visible||!g.parent)continue;const dx=g.position.x-P.x,dz=g.position.z-P.z;if(dx*dx+dz*dz<45*45)L.push(g);}}catch(e){}
  try{if(typeof INT2!=='undefined'&&INT2.ppl)for(const g of INT2.ppl)if(g.visible)L.push(g);}catch(e){}
  const M=new THREE.Matrix4(),q=new THREE.Quaternion();let n=0;for(const g of L){if(n>=240)break;const s=(g.scale.x||1)*0.95,y=floorAt(g.position.x,g.position.z);if(Math.abs(y-g.position.y)>0.6)continue;M.compose(new THREE.Vector3(g.position.x,y+0.04,g.position.z),q,new THREE.Vector3(s,1,s*1.15));GQ.blob.setMatrixAt(n++,M);}
  GQ.blob.count=n;GQ.blob.instanceMatrix.needsUpdate=true;}
// ---- V4: agua de poco fondo y espuma
function gqWater(){if(typeof SEA==='undefined'||!SEA||!SEA.material||!SEA.material.userData.wtr||SEA.material.userData.shore||typeof mfxU!=='function')return;const m=SEA.material,prev=m.onBeforeCompile,U=mfxU();m.userData.shore=1;
  m.onBeforeCompile=function(sh,r){prev.call(this,sh,r);sh.uniforms.uHgt=U.uHgt;sh.uniforms.uHgtB=U.uHgtB;
    sh.fragmentShader='uniform sampler2D uHgt;uniform vec4 uHgtB;\n'+sh.fragmentShader.replace('#include <fog_fragment>','{vec2 huv=(vWP.xz-uHgtB.xy)/uHgtB.z;float ins=step(0.0,huv.x)*step(huv.x,1.0)*step(0.0,huv.y)*step(huv.y,1.0)*uHgtB.w;float dep=vWP.y-texture2D(uHgt,clamp(huv,0.0,1.0)).r;'+
      'float shl=ins*(1.0-smoothstep(0.0,5.0,dep));float fo=ins*(1.0-smoothstep(0.0,0.8,dep))*(0.5+0.5*sin(dep*16.0-uT*1.8+vWP.x*0.25+vWP.z*0.17));gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(0.25,0.62,0.6),shl*0.5);gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(0.93,0.95,0.93),clamp(fo,0.0,1.0)*0.55);}\n#include <fog_fragment>');};
  m.needsUpdate=true;}
// ---- V5: neblina del amanecer y rayos de sol entre los árboles
function gqSoftTex(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,4,64,64,62);g.addColorStop(0,'rgba(255,255,255,0.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);}
function gqMist(){const h=clock.h,on=gqOn('alto')&&h>4.8&&h<9&&!(typeof INT2!=='undefined'&&INT2.in)&&!WXS.rain;const k=on?Math.sin((h-4.8)/4.2*Math.PI):0;
  if(!GQ.mist){if(!on)return;GQ.mist=[];const t=gqSoftTex();for(let i=0;i<14;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,color:'#e8ecf0',transparent:true,opacity:0,depthWrite:false,fog:true}));s.scale.set(70,14,1);scene.add(s);GQ.mist.push({s,a:i/14*TAU,r:40+Math.random()*80});}}
  const P=player;for(const m of GQ.mist){const x=P.x+Math.cos(m.a)*m.r,z=P.z+Math.sin(m.a)*m.r,y=terrainH(x,z);m.s.position.set(x,y+4,z);m.s.material.opacity=k*0.45*clamp((P.feet-y+8)/10,0.2,1);m.s.visible=k>0.01;}}
function gqRays(){const fk=(typeof FOR!=='undefined'&&FOR.k)||0,e=SUNDIR.y,on=gqOn('alto')&&fk>0.3&&e>0.08&&e<0.55&&!(WXS.cl>0.4);if(!GQ.rays){if(!on)return;GQ.rays=[];
  const c=document.createElement('canvas');c.width=16;c.height=128;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,128);g.addColorStop(0,'rgba(255,240,200,0)');g.addColorStop(0.3,'rgba(255,240,200,0.5)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(0,0,16,128);const t=new THREE.CanvasTexture(c);
  for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.4,22),new THREE.MeshBasicMaterial({map:t,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,opacity:0}));scene.add(m);GQ.rays.push({m,dx:(Math.random()-0.5)*30,dz:(Math.random()-0.5)*30,ph:Math.random()*6});}}
  const P=player,t=performance.now()/1000;for(const r of GQ.rays){const x=P.x+r.dx,z=P.z+r.dz;r.m.position.set(x+SUNDIR.x*8,terrainH(x,z)+9+SUNDIR.y*2,z+SUNDIR.z*8);r.m.lookAt(camera.position.x,r.m.position.y,camera.position.z);
    r.m.rotateZ(Math.atan2(SUNDIR.x,SUNDIR.y)*0.6);r.m.material.opacity=on?0.12*fk*(0.6+0.4*Math.sin(t*0.4+r.ph)):0;r.m.visible=on;}}
// ---- V6: la hierba según la estación
const GQ_GRASS={pri:'#ffffff',ver:'#e6cf8a',oto:'#d7c38e',inv:'#c9d2b9'};
function gqSeason(){try{if(!GR.mesh||!GR.mesh.material)return;const ss=calNow().season.id;if(GQ.ss===ss&&GQ.gm===GR.mesh)return;GQ.ss=ss;GQ.gm=GR.mesh;const m=GR.mesh.material;if(!m.userData.c0)m.userData.c0=m.color.clone();m.color.copy(m.userData.c0).multiply(_gc1.set(GQ_GRASS[ss]||'#ffffff'));}catch(e){}}
// ---- V8: parpadeo
function gqBlinkMat(mesh){const m=mesh.material.clone(),U={uBlink:{value:1},uBc:{value:0}};const g=mesh.geometry;if(!g.boundingBox)g.computeBoundingBox();U.uBc.value=(g.boundingBox.min.y+g.boundingBox.max.y)/2;
  const prev=m.onBeforeCompile;m.onBeforeCompile=function(sh,r){if(prev&&prev!==THREE.Material.prototype.onBeforeCompile)prev.call(this,sh,r);sh.uniforms.uBlink=U.uBlink;sh.uniforms.uBc=U.uBc;
    sh.vertexShader='uniform float uBlink,uBc;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.y=mix(uBc,transformed.y,uBlink);');};
  m.customProgramCacheKey=()=>'blink';mesh.material=m;mesh.userData.blinkU=U;mesh.userData.blinkT=1+Math.random()*4;}
function gqBlink(dt){if(!gqOn('medio'))return;const P=player;try{for(const g of BP.list){const dx=g.position.x-P.x,dz=g.position.z-P.z;if(dx*dx+dz*dz>20*20||!g.visible)continue;
  if(!g.userData.eyes){g.userData.eyes=[];g.traverse(o=>{if(o.isMesh&&/_ojos/.test(o.name))g.userData.eyes.push(o);});g.userData.eyes.forEach(gqBlinkMat);}
  for(const e of g.userData.eyes){const U=e.userData.blinkU;if(!U)continue;e.userData.blinkT-=dt;if(e.userData.blinkT<0){const k=-e.userData.blinkT;U.uBlink.value=k<0.06?1-k/0.06*0.9:k<0.14?0.1+(k-0.06)/0.08*0.9:1;if(k>0.14)e.userData.blinkT=2+Math.random()*4.5;}}}}catch(e){}}
// ---- V9: luces de las antorchas
function gqLights(){if(!GQ.lights.length){for(let i=0;i<4;i++){const l=new THREE.PointLight('#ffb060',0,16,2);scene.add(l);GQ.lights.push(l);}}
  const night=1-DAYF,P=player,t=performance.now()/1000;if(night<0.15||!gqOn('medio')){for(const l of GQ.lights)l.intensity=0;return;}
  const L=[];for(const tc of TORCHES){const p=tc.s.position,d=(p.x-P.x)**2+(p.z-P.z)**2;if(d<60*60)L.push([d,p]);}L.sort((a,b)=>a[0]-b[0]);
  GQ.lights.forEach((l,i)=>{const it=L[i];if(!it){l.intensity=0;return;}l.position.set(it[1].x,it[1].y+0.2,it[1].z);l.intensity=night*(1.6+0.25*Math.sin(t*9+i*2)+0.15*Math.sin(t*23+i));});}
// ---- V9: estrellas reales
const GQ_STARS=[["Acamar",44.565,-40.305,2.88],["Achernar",24.429,-57.237,0.45],["Acrux",186.65,-63.099,0.77],["Adara",104.656,-28.972,1.5],["Adhara",104.656,-28.972,1.5],["Agena",210.956,-60.373,0.61],["Albireo",292.68,27.96,3.05],["Alcor",201.306,54.988,3.99],["Alcyone",56.871,24.105,2.85],["Aldebaran",68.98,16.509,0.87],["Alderamin",319.645,62.586,2.45],["Alfirk",322.165,70.561,3.23],["Algenib",3.309,15.184,2.83],["Algieba",154.993,19.841,2.01],["Algol",47.042,40.956,2.09],["Alhena",99.428,16.399,1.93],["Alioth",193.507,55.96,1.76],["Alkaid",206.885,49.313,1.85],["Almach",30.975,42.33,2.1],["Alnair",332.058,-46.961,1.73],["Alnilam",84.053,-1.202,1.69],["Alnitak",85.19,-1.943,1.74],["Alphard",141.897,-8.659,1.99],["Alphecca",233.672,26.715,2.22],["Alpheratz",2.097,29.09,2.07],["Alshain",298.828,6.407,3.71],["Altair",297.696,8.868,0.76],["Ankaa",6.571,-42.306,2.4],["Antares",247.352,-26.432,1.06],["Arcturus",213.915,19.182,-0.05],["Arkab Posterior",290.805,-44.8,4.27],["Arkab Prior",290.66,-44.459,3.96],["Arneb",83.183,-17.822,2.58],["Atlas",57.291,24.053,3.62],["Atria",252.166,-69.028,1.91],["Avior",125.628,-59.509,1.86],["Bellatrix",81.283,6.35,1.64],["Betelgeuse",88.793,7.407,0.45],["Canopus",95.988,-52.696,-0.62],["Capella",79.172,45.998,0.08],["Caph",2.295,59.15,2.28],["Castor",113.649,31.888,1.58],["Cebalrai",265.868,4.567,2.76],["Deneb",310.358,45.28,1.25],["Denebola",177.265,14.572,2.14],["Diphda",10.897,-17.987,2.04],["Dubhe",165.932,61.751,1.81],["Electra",56.219,24.113,3.72],["Elnath",81.573,28.607,1.65],["Eltanin",269.152,51.489,2.24],["Enif",326.046,9.875,2.38],["Etamin",269.152,51.489,2.24],["Fomalhaut",344.413,-29.622,1.17],["Gacrux",187.791,-57.113,1.59],["Gienah Corvi",183.952,-17.542,2.58],["Gienah",183.952,-17.542,2.58],["Hadar",210.956,-60.373,0.61],["Hamal",31.793,23.462,2.01],["Izar",221.247,27.074,2.35],["Kaus Australis",276.043,-34.385,1.79],["Kochab",222.676,74.156,2.07],["Maia",56.457,24.368,3.87],["Markab",346.19,15.205,2.49],["Megrez",183.857,57.033,3.32],["Menkalinan",89.882,44.947,1.9],["Menkar",45.57,4.09,2.54],["Menkent",211.671,-36.37,2.06],["Merak",165.46,56.382,2.34],["Merope",56.582,23.948,4.14],["Miaplacidus",138.3,-69.717,1.67],["Mimosa",191.93,-59.689,1.25],["Minkar",182.531,-22.62,3.02],["Mintaka",83.002,-0.299,2.25],["Mirach",17.433,35.621,2.07],["Mirfak",51.081,49.861,1.79],["Mirzam",95.675,-17.956,1.98],["Mizar",200.981,54.925,2.23],["Naos",120.896,-40.003,2.21],["Nihal",82.061,-20.759,2.81],["Nunki",283.816,-26.297,2.05],["Peacock",306.412,-56.735,1.94],["Phecda",178.458,53.695,2.41],["Polaris",37.955,89.264,1.97],["Pollux",116.329,28.026,1.16],["Procyon",114.825,5.225,0.4],["Rasalgethi",258.662,14.39,2.78],["Rasalhague",263.734,12.56,2.08],["Regulus",152.093,11.967,1.36],["Rigel",78.634,-8.202,0.18],["Rigil Kentaurus",219.902,-60.834,-0.01],["Rukbat",290.972,-40.616,3.96],["Sabik",257.595,-15.725,2.43],["Sadalmelik",331.446,-0.32,2.95],["Sadr",305.557,40.257,2.23],["Saiph",86.939,-9.67,2.07],["Scheat",345.944,28.083,2.44],["Schedar",10.127,56.537,2.24],["Shaula",263.402,-37.104,1.62],["Sheliak",282.52,33.363,3.52],["Sirius",101.287,-16.716,-1.44],["Sirrah",2.097,29.09,2.07],["Spica",201.298,-11.161,0.98],["Suhail",136.999,-43.433,2.23],["Sulafat",284.736,32.69,3.25],["Tarazed",296.565,10.613,2.72],["Taygeta",56.302,24.467,4.3],["Thuban",211.097,64.376,3.67],["Unukalhai",236.067,6.426,2.63],["Vega",279.235,38.784,0.03],["Vindemiatrix",195.544,10.959,2.85],["Wezen",107.098,-26.393,1.83],["Zaurak",59.507,-13.509,2.97],["Zubenelgenubi",222.72,-16.042,2.75]];
const GQ_CONST=[['Orión',[['Betelgeuse','Bellatrix'],['Bellatrix','Mintaka'],['Mintaka','Alnilam'],['Alnilam','Alnitak'],['Alnitak','Saiph'],['Mintaka','Rigel'],['Betelgeuse','Alnitak']]],
 ['La Osa Mayor (Hélice)',[['Dubhe','Merak'],['Merak','Phecda'],['Phecda','Megrez'],['Megrez','Dubhe'],['Megrez','Alioth'],['Alioth','Mizar'],['Mizar','Alkaid']]],
 ['El León',[['Regulus','Algieba'],['Algieba','Denebola'],['Denebola','Regulus']]],['El Cisne',[['Deneb','Sadr'],['Sadr','Albireo']]],['La Lira',[['Vega','Sulafat'],['Sulafat','Sheliak'],['Sheliak','Vega']]],
 ['El Can Mayor (Sirio)',[['Sirius','Mirzam'],['Sirius','Adhara'],['Adhara','Wezen']]],['Las Pléyades',[['Alcyone','Atlas'],['Alcyone','Electra'],['Alcyone','Maia'],['Alcyone','Merope'],['Alcyone','Taygeta']]],
 ['Pegaso',[['Markab','Scheat'],['Scheat','Alpheratz'],['Alpheratz','Algenib'],['Algenib','Markab']]],['Los Gemelos (Dioscuros)',[['Castor','Pollux']]],['El Boyero (Arturo)',[['Arcturus','Izar']]],['El Escorpión',[['Antares','Shaula']]]];
function gqStarPos(){const D2R=Math.PI/180,eps=23.44*D2R,year=MODE==='roma'?80:-385,P=(50.29/3600)*(2000-year)*D2R;let N=180;try{N=solDia();}catch(e){}
  const lat=(typeof SOL!=='undefined'&&SOL.lat)||(MODE==='roma'?41.9:37.97)*D2R,lsun=((N-80)/365.25)*TAU,asun=Math.atan2(Math.sin(lsun)*Math.cos(eps),Math.cos(lsun)),Hs=(clock.h-12)*15*D2R,out={};
  for(const [n,ra,de,mag] of GQ_STARS){const a=ra*D2R,d=de*D2R;let b=Math.asin(Math.sin(d)*Math.cos(eps)-Math.cos(d)*Math.sin(eps)*Math.sin(a)),l=Math.atan2(Math.sin(a)*Math.cos(eps)+Math.tan(d)*Math.sin(eps),Math.cos(a));l-=P;
    const d2=Math.asin(Math.sin(b)*Math.cos(eps)+Math.cos(b)*Math.sin(eps)*Math.sin(l)),a2=Math.atan2(Math.sin(l)*Math.cos(eps)-Math.tan(b)*Math.sin(eps),Math.cos(l)),H=Hs+asun-a2;
    const E=-Math.cos(d2)*Math.sin(H),No=Math.cos(lat)*Math.sin(d2)-Math.sin(lat)*Math.cos(d2)*Math.cos(H),U=Math.sin(lat)*Math.sin(d2)+Math.cos(lat)*Math.cos(d2)*Math.cos(H);out[n]=[E*3300,U*3300,-No*3300,mag];}return out;}
function gqStars(){const op=STARS.material.opacity;if(!GQ.stars){const n=GQ_STARS.length,g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3),3));
    GQ.stars=new THREE.Points(g,new THREE.PointsMaterial({size:3.2,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:0,fog:false,depthWrite:false}));GQ.stars.frustumCulled=false;scene.add(GQ.stars);
    const lg=new THREE.BufferGeometry();let nl=0;for(const c of GQ_CONST)nl+=c[1].length;lg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(nl*6),3));
    GQ.lines=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:'#9fb8e0',transparent:true,opacity:0,fog:false,depthWrite:false}));GQ.lines.frustumCulled=false;scene.add(GQ.lines);STARS.material.size=1.1;}
  GQ.starT-=1;if(GQ.starT<=0&&op>0.02){GQ.starT=6;const S=gqStarPos(),pa=GQ.stars.geometry.attributes.position.array,ca=GQ.stars.geometry.attributes.color.array;let i=0;
    for(const [n,,,mag] of GQ_STARS){const p=S[n];pa[i*3]=p[0];pa[i*3+1]=p[1];pa[i*3+2]=p[2];const b=clamp(1.25-mag*0.32,0.25,1.2),w=hash(n.length,n.charCodeAt(0));ca[i*3]=b*(0.85+0.2*w);ca[i*3+1]=b*0.92;ca[i*3+2]=b*(1.05-0.2*w);i++;}
    GQ.stars.geometry.attributes.position.needsUpdate=true;GQ.stars.geometry.attributes.color.needsUpdate=true;const la=GQ.lines.geometry.attributes.position.array;let k=0;
    for(const c of GQ_CONST)for(const [a,b] of c[1]){const A=S[a]||[0,-9999,0],B=S[b]||[0,-9999,0];la.set([A[0],A[1],A[2],B[0],B[1],B[2]],k);k+=6;}GQ.lines.geometry.attributes.position.needsUpdate=true;}
  GQ.stars.material.opacity=op;GQ.stars.position.copy(camera.position);GQ.lines.position.copy(camera.position);const look=clamp((player.pitch-0.35)/0.35,0,1);GQ.lines.material.opacity=gqOn('medio')?op*0.28*look:0;
  if(look>0.8&&op>0.6&&!GQ.seenSky&&ui==='play'){GQ.seenSky=true;try{if(!state.seen.cielo){state.seen.cielo=1;save();toast('<span class="label">El cielo de noche</span><br>Las estrellas están donde estaban en el '+(MODE==='roma'?'80 d.C.':'386 a.C.')+'. Los griegos aprendieron las constelaciones con el poema de Arato (<i>Fenómenos</i>, siglo III a.C.), y Hesíodo usaba las Pléyades, Orión y Sirio como calendario del campo. Por la precesión, la estrella Polar todavía no marcaba el norte: el polo quedaba en un hueco del cielo, cerca de Kochab, en la Osa Menor.');}}catch(e){}}}
// ---- V10: tono de color y viñeteado
function gqGrade(){const c=renderer.domElement;if(!gqOn('medio')){c.style.filter='';if(GQ.vig)GQ.vig.hidden=true;return;}
  c.style.filter=MODE==='roma'?'sepia(0.08) saturate(1.05) contrast(1.03)':'sepia(0.05) saturate(1.08) contrast(1.04) brightness(1.01)';
  if(!GQ.vig){const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:2;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 62%,rgba(20,12,4,.28) 100%)';document.body.appendChild(d);GQ.vig=d;}GQ.vig.hidden=false;}
// ---- cada fotograma
{const f=uxTick;uxTick=function(dt){f(dt);if(!state||ui==='start')return;try{dt=Math.min(0.1,dt||0);GQ.t+=dt;SKY.uniforms.cRot.value=(SKY.uniforms.cRot.value+dt*0.0009*(1+((WIND&&WIND.s&&WIND.s.value)||0)))%1;gqBlink(dt);
  if(GQ.t>0.25){GQ.t=0;gqClouds();gqBlobs();gqWater();gqMist();gqRays();gqSeason();gqLights();gqStars();if(!GQ.graded){GQ.graded=1;gqApply();}}
  else if(GQ.stars){GQ.stars.position.copy(camera.position);GQ.lines.position.copy(camera.position);}}catch(e){if(!GQ.err){GQ.err=String(e&&e.stack||e).slice(0,300);console.warn('graficos',e);}}};}
