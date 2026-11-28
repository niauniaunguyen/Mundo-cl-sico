// ============================================================ escena
const canvas=document.getElementById('c');
// suavizado de bordes (antialias): caro en las gráficas integradas de los Chromebooks y mini-PC. Se decide al arrancar con lo guardado
// (modo ligero, modo aula, nivel medido por 274) o, la primera vez, por el equipo (4 núcleos o menos, o 4 GB de memoria o menos: sin él)
const AA_ON=(()=>{try{const a=JSON.parse(localStorage.getItem('nostos-acc')||'{}');if(a.lite||a.aula||a.tier==='bajo'||a.tier==='medio')return false;if(a.tier==='alto')return true;}catch(e){}
  const nc=navigator.hardwareConcurrency||4,mem=navigator.deviceMemory||8;return !(nc<=4||mem<=4);})();
const renderer=new THREE.WebGLRenderer({canvas,antialias:AA_ON,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();
const HORIZON=new THREE.Color('#e7d9bd');
scene.fog=new THREE.Fog(HORIZON,260,2400);
const camera=new THREE.PerspectiveCamera(70,1,0.1,5000);
camera.rotation.order='YXZ';

const hemi=new THREE.HemisphereLight(0xd6e4f2,0x8a7552,0.62);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0d2,1.0);
const SUNDIR=new THREE.Vector3(-0.55,0.62,0.4).normalize();
sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-90,right:90,top:90,bottom:-90,near:1,far:600});
sun.shadow.bias=-0.0008;sun.shadow.normalBias=0.4;
scene.add(sun);scene.add(sun.target);

// cielo, estrellas y ciclo del día
const SKY=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,
  uniforms:{top:{value:new THREE.Color('#5d93c7')},mid:{value:new THREE.Color('#a9c7e0')},bot:{value:HORIZON.clone()},sunD:{value:SUNDIR},moonD:{value:new THREE.Vector3(0,-1,0)},glow:{value:1},mph:{value:0.5}},
  vertexShader:'varying vec3 vp;void main(){vp=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform vec3 top,mid,bot,sunD,moonD;uniform float glow,mph;varying vec3 vp;void main(){float h=vp.y;vec3 c=h>0.15?mix(mid,top,smoothstep(0.15,0.7,h)):mix(bot,mid,smoothstep(-0.02,0.15,h));float s=max(dot(vp,sunD),0.0);c+=vec3(1.0,0.82,0.55)*(pow(s,600.0)*1.6+pow(s,10.0)*0.22)*glow;float mo=max(dot(vp,moonD),0.0);vec3 mr=normalize(cross(moonD,vec3(0.0,1.0,0.0)));vec3 mu=cross(mr,moonD);vec3 dv=normalize(vp)-moonD;float xn=dot(dv,mr)/0.0346,yn=dot(dv,mu)/0.0346;float mk=cos(mph*6.2832);float lit=smoothstep(-0.08,0.08,xn-mk*sqrt(max(0.0,1.0-yn*yn)));c+=vec3(0.85,0.9,1.0)*smoothstep(0.9992,0.9996,mo)*(0.06+0.84*lit)+vec3(0.3,0.35,0.5)*pow(mo,40.0)*0.15*(0.25+0.75*(1.0-mk)*0.5);gl_FragColor=vec4(c,1.0);}'});
const skyMesh=new THREE.Mesh(new THREE.SphereGeometry(4000,32,16),SKY);scene.add(skyMesh);
const STARS=(()=>{const n=2200,p=new Float32Array(n*3),r=mulberry32(99);for(let i=0;i<n;i++){const th=r()*TAU,y=0.04+Math.pow(r(),0.8)*0.96,q=Math.sqrt(1-y*y);p[i*3]=Math.cos(th)*q*3500;p[i*3+1]=y*3500;p[i*3+2]=Math.sin(th)*q*3500;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color:0xfff6e8,size:1.6,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));scene.add(pts);return pts;})();
const TORCHES=[],TORCH_SPOTS=[];
const SYMP={x:0,z:0};
const clock={h:10,speed:1/60}; // una hora de juego por minuto real
let DAYF=1;
const LIGHTDIR=new THREE.Vector3().copy(SUNDIR);
const CS={dT:new THREE.Color('#5d93c7'),dM:new THREE.Color('#a9c7e0'),dB:new THREE.Color('#e7d9bd'),sT:new THREE.Color('#41639a'),sM:new THREE.Color('#d6a27c'),sB:new THREE.Color('#efb07a'),nT:new THREE.Color('#02050d'),nM:new THREE.Color('#0a1226'),nB:new THREE.Color('#151d33')};
const _c1=new THREE.Color(),_c2=new THREE.Color();
function hourLabel(){const h=clock.h,ev=todayEvent(),dl='día '+((state&&state.day)||1)+(ev?' · '+ev.title:'')+' · ';const n=h<5?'noche cerrada':h<7?'alba':h<10?'mañana':h<12.5?'ágora llena':h<15?'mediodía':h<18?'tarde':h<20?'atardecer':'noche';return dl+(MODE==='roma'&&typeof horaRomana==='function'?horaRomana(h):n)+' · ~'+Math.floor(h)+' h';}
function updateSky(){
  const a=(clock.h-6)/12*Math.PI;SUNDIR.set(Math.cos(a),Math.sin(a)*0.92,0.38).normalize();
  const e=SUNDIR.y,day=sstep(clamp((e+0.08)/0.32,0,1)),set=clamp(1-Math.abs(e-0.03)/0.22,0,1)*0.85;DAYF=day;
  const mix=(n,d,st,out)=>out.copy(n).lerp(d,day).lerp(st,set*(0.4+0.6*day));
  mix(CS.nT,CS.dT,CS.sT,SKY.uniforms.top.value);mix(CS.nM,CS.dM,CS.sM,SKY.uniforms.mid.value);mix(CS.nB,CS.dB,CS.sB,SKY.uniforms.bot.value);
  scene.fog.color.copy(SKY.uniforms.bot.value);
  SKY.uniforms.glow.value=clamp((e+0.1)*5,0,1);
  const moon=SKY.uniforms.moonD.value.set(-SUNDIR.x,Math.abs(SUNDIR.y)*0.8+0.15,-SUNDIR.z).normalize();
  if(e>-0.03){LIGHTDIR.copy(SUNDIR);if(LIGHTDIR.y<0.08)LIGHTDIR.y=0.08;LIGHTDIR.normalize();sun.intensity=1.4*sstep(clamp((e+0.03)/0.25,0,1));sun.color.setRGB(1,0.8+0.18*day,0.58+0.32*day);}
  else{LIGHTDIR.copy(moon);sun.intensity=0.22*clamp((-e-0.03)/0.1,0,1);sun.color.set('#9fb4d9');}
  hemi.intensity=0.16+0.40*day;hemi.color.copy(_c1.set('#3a4a70').lerp(_c2.set('#c4d8ee'),day));hemi.groundColor.copy(_c1.set('#1c1a20').lerp(_c2.set('#7a6448'),day));
  STARS.material.opacity=clamp(1-day*1.8,0,1);
  const night=clamp(1-day*1.4,0,1);for(const tc of TORCHES)tc.s.material.opacity=night;
  const ck=document.getElementById('clock');if(ck)ck.textContent=hourLabel();
}
const TORCH_TEX=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,244,210,1)');g.addColorStop(0.22,'rgba(255,176,80,0.9)');g.addColorStop(1,'rgba(255,120,30,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);})();
const TORCH_POST=new THREE.CylinderGeometry(0.05,0.07,1,5);
function addTorch(x,z,h){h=h||2.4;const gy=floorAt(x,z);const post=new THREE.Mesh(TORCH_POST,lam('#3a2c22'));post.scale.y=h;post.position.set(x,gy+h/2,z);scene.add(post);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0}));sp.position.set(x,gy+h+0.2,z);sp.scale.set(1.4,1.8,1);scene.add(sp);TORCHES.push({s:sp,ph:Math.random()*10});addCirc(x,z,0.12);}

