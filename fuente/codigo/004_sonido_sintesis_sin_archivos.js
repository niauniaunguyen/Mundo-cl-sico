// ============================================================ sonido (síntesis, sin archivos)
let AUD_ON=true;try{AUD_ON=localStorage.getItem('atenas-386-sound')!=='off';}catch(e){}
const AUD={ctx:null,master:null,plucks:{}};
function initAudio(){
  if(AUD.ctx){if(AUD.ctx.state==='suspended')AUD.ctx.resume();return;}
  try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=new C();AUD.ctx=ctx;
    const m=ctx.createGain();m.gain.value=AUD_ON?0.8:0;m.connect(ctx.destination);AUD.master=m;
    const nb=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AUD.noise=nb;
    const loop=()=>{const s=ctx.createBufferSource();s.buffer=nb;s.loop=true;s.start(0,Math.random()*2);return s;};
    const wf=ctx.createBiquadFilter();wf.type='lowpass';wf.frequency.value=380;const wg=ctx.createGain();wg.gain.value=0.03;loop().connect(wf).connect(wg).connect(m);AUD.wind=wg;
    const cf=ctx.createBiquadFilter();cf.type='bandpass';cf.frequency.value=520;cf.Q.value=0.9;const cg=ctx.createGain();cg.gain.value=0;loop().connect(cf).connect(cg).connect(m);AUD.crowd=cg;AUD.crowdF=cf;
    const cf2=ctx.createBiquadFilter();cf2.type='bandpass';cf2.frequency.value=1300;cf2.Q.value=2;const cg2=ctx.createGain();cg2.gain.value=0;loop().connect(cf2).connect(cg2).connect(m);AUD.crowd2=cg2;
    const wvf=ctx.createBiquadFilter();wvf.type='lowpass';wvf.frequency.value=520;const wvg=ctx.createGain();wvg.gain.value=0;loop().connect(wvf).connect(wvg).connect(m);AUD.waves=wvg;
  }catch(e){AUD.ctx=null;}
}
function toggleSound(){AUD_ON=!AUD_ON;try{localStorage.setItem('atenas-386-sound',AUD_ON?'on':'off');}catch(e){}
  if(AUD.master)AUD.master.gain.setTargetAtTime(AUD_ON?0.8:0,AUD.ctx.currentTime,0.1);
  const b=document.getElementById('bSound');if(b)b.setAttribute('aria-pressed',AUD_ON?'true':'false');}
function aOK(){return AUD.ctx&&AUD_ON&&AUD.ctx.state==='running';}
function envGain(t0,peak,att,dec,dest){const g=AUD.ctx.createGain();g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(peak,t0+att);g.gain.exponentialRampToValueAtTime(0.0001,t0+att+dec);g.connect(dest||AUD.master);return g;}
function sfxStep(stone){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;const s=c.createBufferSource();s.buffer=AUD.noise;const f=c.createBiquadFilter();f.type=stone?'bandpass':'lowpass';f.frequency.value=stone?1900:650;f.Q.value=stone?1.3:0.7;s.connect(f).connect(envGain(t,stone?0.08:0.13,0.005,0.09));s.start(t,Math.random()*2,0.13);}
function sfxBird(){if(!aOK())return;const c=AUD.ctx;let t=c.currentTime+0.05;const n=2+Math.floor(Math.random()*5),base=2600+Math.random()*1800;let dest=AUD.master;if(c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=Math.random()*1.6-0.8;p.connect(AUD.master);dest=p;}
  for(let i=0;i<n;i++){const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(base*(0.9+Math.random()*0.3),t);o.frequency.exponentialRampToValueAtTime(base*(1.15+Math.random()*0.4),t+0.06);o.connect(envGain(t,0.022,0.01,0.08,dest));o.start(t);o.stop(t+0.13);t+=0.08+Math.random()*0.09;}}
function sfxCricket(){if(!aOK())return;const c=AUD.ctx;let t=c.currentTime+0.02;for(let i=0;i<3;i++){const o=c.createOscillator();o.type='sine';o.frequency.value=4300+Math.random()*200;o.connect(envGain(t,0.012,0.005,0.03));o.start(t);o.stop(t+0.05);t+=0.06;}}
function sfxCoin(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;[1760,2350,2960].forEach((f,i)=>{const o=c.createOscillator();o.type='triangle';o.frequency.value=f;o.connect(envGain(t+i*0.07,0.06,0.004,0.5));o.start(t+i*0.07);o.stop(t+i*0.07+0.6);});}
function pluck(freq,when,vol){const c=AUD.ctx;let buf=AUD.plucks[freq];
  if(!buf){const sr=c.sampleRate,len=Math.floor(sr*1.8);buf=c.createBuffer(1,len,sr);const d=buf.getChannelData(0),N=Math.max(2,Math.floor(sr/freq)),ring=new Float32Array(N);for(let i=0;i<N;i++)ring[i]=Math.random()*2-1;let k=0;for(let i=0;i<len;i++){const nx=(k+1)%N,v=ring[k];d[i]=v;ring[k]=0.4985*(v+ring[nx]);k=nx;}AUD.plucks[freq]=buf;}
  const s=c.createBufferSource();s.buffer=buf;const g=c.createGain();g.gain.value=vol;s.connect(g).connect(AUD.master);s.start(when);}
const LYRE=[329.6,293.7,261.6,246.9,220,196,174.6,164.8]; // dos tetracordos dorios descendentes
function playPhrase(){if(!aOK())return;let t=AUD.ctx.currentTime+0.1,idx=Math.floor(Math.random()*4);const n=3+Math.floor(Math.random()*4);for(let i=0;i<n;i++){pluck(LYRE[idx],t,0.06);idx=clamp(idx+(Math.random()<0.6?1:-1)*(Math.random()<0.8?1:2),0,7);t+=0.32+Math.random()*0.4;}}
let aT=0,stepAcc=0,lastPX=null,lastPZ=null,lyreT=6;
function audioTick(dt){
  const moved=lastPX===null?0:Math.hypot(player.x-lastPX,player.z-lastPZ);lastPX=player.x;lastPZ=player.z;
  if(!aOK())return;
  if(ui==='play'&&player.grounded&&moved<3){stepAcc+=moved;if(stepAcc>(MOUNT.riding?(keys.run?3.2:1.9):(keys.run?1.3:0.8))){stepAcc=0;if(!MOUNT.riding)gfStep();}}   // los cascos los marca horseAlive, según el aire
  aT+=dt;if(aT<0.2)return;const st=aT;aT=0;const now=AUD.ctx.currentTime;
  const ad=Math.hypot(player.x-AGORA.x,player.z-AGORA.z);const crowd=clamp(1-(ad-25)/90,0,1)*(0.15+0.85*DAYF);
  AUD.crowd.gain.setTargetAtTime(0,now,0.6);AUD.crowd2.gain.setTargetAtTime(0,now,0.3);   // sin murmullo de ruido blanco: sonaba a siseo continuo
  const high=clamp((player.feet-5)/30,0,1),outside=insideWalls(player.x,player.z)?0:1;
  {const gust=Math.max(0,Math.sin(now*0.23)*Math.sin(now*0.071+1.3));const nz=typeof ACC!=='undefined'&&ACC.noAmb;AUD.wind.gain.setTargetAtTime(nz?0:(0.05*high+0.02*outside)*gust,now,1.5);}   // viento solo en lo alto o fuera de las murallas, a ráfagas
  const nearSea=player.x>8000?clamp(1-(terrainH(player.x,player.z)-1)/25,0.2,1):(HARBOR.ok?clamp(1-Math.hypot(player.x-HARBOR.x,player.z-HARBOR.z)/180,0,1):0);
  {const sea=player.x>8000?clamp(1-(terrainH(player.x,player.z)-0.5)/6,0,1):nearSea;AUD.waves.gain.setTargetAtTime(typeof ACC!=='undefined'&&ACC.noAmb?0:0.06*sea*(0.5+0.5*Math.sin(now*0.7)),now,0.4);}   // olas solo junto a la orilla
  if(DAYF>0.3&&Math.random()<st*(0.2+0.6*outside)*DAYF)sfxBird();
  if(DAYF<0.3&&Math.random()<st*1.2*(1-DAYF))sfxCricket();
  lyreT-=st;if(lyreT<0){lyreT=10+Math.random()*16;const near=[[THEA.x,THEA.z],[SYMP.x,SYMP.z],[ACADEMY.x,ACADEMY.z],[AGORA.x,AGORA.z]].some(p=>Math.hypot(player.x-p[0],player.z-p[1])<70);if(near)playPhrase();}
}

// luces puntuales (antorcha, hogueras, lámparas) calculadas en cada píxel y no solo en los vértices:
// en un muro largo los vértices quedan a decenas de metros y la luz de la antorcha no llegaba, o salía a triángulos
{const LV=THREE.ShaderChunk.lights_lambert_vertex,i0=LV.indexOf('#if NUM_POINT_LIGHTS > 0'),i1=LV.indexOf('#if NUM_SPOT_LIGHTS > 0');
  if(i0>=0&&i1>i0){THREE.ShaderChunk.lights_lambert_vertex=LV.slice(0,i0)+LV.slice(i1);
    const L=THREE.ShaderLib.lambert;
    L.vertexShader=L.vertexShader.replace('#define LAMBERT\n','#define LAMBERT\nvarying vec3 vPlPos;\nvarying vec3 vPlNor;\n').replace('#include <lights_lambert_vertex>','#include <lights_lambert_vertex>\nvPlPos=mvPosition.xyz;vPlNor=normalize(transformedNormal);');
    const K='reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();';
    L.fragmentShader=L.fragmentShader.replace('uniform float opacity;\n','uniform float opacity;\nvarying vec3 vPlPos;\nvarying vec3 vPlNor;\n').replace(K,K+'\n#if NUM_POINT_LIGHTS > 0\n{GeometricContext gp;gp.position=vPlPos;gp.normal=normalize(vPlNor);\n#ifdef DOUBLE_SIDED\nif(!gl_FrontFacing)gp.normal=-gp.normal;\n#endif\ngp.viewDir=normalize(-vPlPos);IncidentLight pl;\n#pragma unroll_loop_start\nfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\ngetPointDirectLightIrradiance( pointLights[ i ], gp, pl );reflectedLight.directDiffuse+=saturate(dot(gp.normal,pl.direction))*PI*pl.color*BRDF_Diffuse_Lambert(diffuseColor.rgb);\n}\n#pragma unroll_loop_end\n}\n#endif');}}
const matCache={};
function lam(hex,opts){const k=hex+(opts?JSON.stringify(opts):'');if(!matCache[k])matCache[k]=new THREE.MeshLambertMaterial(Object.assign({color:hex},opts||{}));return matCache[k];}
const M={
  marble:lam('#efe7d8'),marbleShade:lam('#ddd2bf'),stone:lam('#c9b99c'),limestone:lam('#b9a582'),
  tile:lam('#b4583b'),bronze:lam('#8a6a3a'),gold:lam('#d9a93a'),ivory:lam('#f3e5c8'),
  blue:lam('#2f4c86'),red:lam('#a8392b'),wood:lam('#7a5434'),dark:lam('#3a2c22'),
};
function box(w,h,d,mat,x,y,z,parent){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m;}

