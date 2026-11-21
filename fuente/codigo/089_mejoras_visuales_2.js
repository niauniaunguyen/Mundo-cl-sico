// ============================================================ MEJORAS VISUALES 2: luna con fases, lejanía según la hora, ventanas encendidas, incienso,
// desenfoque en el modo foto y sombras de contacto (oclusión ambiental) dentro de la iluminación realzada.
// La luna sigue el calendario del juego: las Kalendas son luna nueva, las Nonas cuarto creciente y los Idus luna llena (el calendario romano antiguo era lunar; el ático también).
const VIS={win:null,winMat:null,inc:[],incT:0};
function visMoonPhase(){try{return cultDia().i*0.125;}catch(e){return 0.5;}}
const updateSky0=updateSky;updateSky=function(){updateSky0();try{
  if(SKY.uniforms.mph)SKY.uniforms.mph.value=visMoonPhase();
  // lejanía: de día el aire limpio deja ver lejos; al alba hay bruma; al atardecer el polvo dorado acorta la vista; de noche, casi nada
  const ov=(typeof CAV!=='undefined'&&CAV.ovr)||(typeof FZ!=='undefined'&&FZ.ovr);
  if(!ov&&scene.fog){const day=DAYF,h=clock.h,dawn=Math.max(0,1-Math.abs(h-6.6)/1.4),dusk=Math.max(0,1-Math.abs(h-18.4)/1.5);
    scene.fog.near=lerp(150,260,day)-dawn*90-dusk*40;scene.fog.far=lerp(1250,2400,day)-dawn*700-dusk*350;
    if(dusk>0)scene.fog.color.lerp(_c1.set('#e0a86e'),dusk*0.35);if(dawn>0)scene.fog.color.lerp(_c1.set('#c9c4cf'),dawn*0.4);}
  if(VIS.winMat){const night=clamp(1-DAYF*1.6,0,1);VIS.winMat.opacity=night*0.95;VIS.win.visible=night>0.02;}}catch(e){}};
// ventanas con luz de lucerna: dos o tres por casa, en sus fachadas
function visWindows(){const hs=footprints.filter(f=>f.house&&f.w>3&&f.d>3);if(!hs.length)return;const per=3,N=hs.length*per;
  const c=document.createElement('canvas');c.width=32;c.height=48;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,48);g.addColorStop(0,'#ffcf7a');g.addColorStop(1,'#ff9a3a');x.fillStyle=g;x.fillRect(0,0,32,48);x.fillStyle='rgba(60,30,10,.85)';x.fillRect(14,0,4,48);x.fillRect(0,22,32,3);
  const m=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,opacity:0,depthWrite:false,fog:true}),im=new THREE.InstancedMesh(new THREE.PlaneGeometry(0.75,1.05),m,N),d=new THREE.Object3D(),R=mulberry32(4242);let k=0;
  for(const f of hs){const a=f.a||0;for(let i=0;i<per;i++){if(R()<0.35)continue;const side=Math.floor(R()*4),u=(R()-0.5)*0.7;let lx,lz,nx,nz;
      if(side===0){lx=u*f.w;lz=f.d/2+0.06;nx=0;nz=1;}else if(side===1){lx=u*f.w;lz=-f.d/2-0.06;nx=0;nz=-1;}else if(side===2){lx=f.w/2+0.06;lz=u*f.d;nx=1;nz=0;}else{lx=-f.w/2-0.06;lz=u*f.d;nx=-1;nz=0;}
      const p=toW(lx,lz,f.x,f.z,a),wn=toW(nx,nz,0,0,a),gy=terrainH(p[0],p[1]);if(!isFinite(gy))continue;d.position.set(p[0],gy+(R()<0.5?2.4:5.6),p[1]);d.rotation.set(0,Math.atan2(wn[0],wn[1]),0);d.updateMatrix();im.setMatrixAt(k++,d.matrix);}}
  im.count=k;im.instanceMatrix.needsUpdate=true;im.frustumCulled=false;im.renderOrder=2;scene.add(im);VIS.win=im;VIS.winMat=m;}
// incienso en los altares cercanos (lararios, altares de las encrucijadas, la Hécate)
function visSetup(){try{visWindows();}catch(e){console.warn('visWindows',e);}
  VIS.inc=[];try{for(const o of CULT_OBJS)VIS.inc.push([o.x,o.z]);}catch(e){}for(const o of EGX_OBJS)if(o.act==='sp:compitum'||o.act==='sp:hecate')VIS.inc.push([o.x,o.z]);}
function visTick(dt){VIS.incT-=dt;if(VIS.incT>0)return;VIS.incT=0.3;for(const[x,z]of VIS.inc){if(Math.abs(x-player.x)>40||Math.abs(z-player.z)>40)continue;const y=floorAt(x,z)+1.6;pfx(x+(Math.random()-0.5)*0.2,y,z+(Math.random()-0.5)*0.2,{col:'#d9d4ca',vx:(Math.random()-0.5)*0.15,vy:0.55,vz:(Math.random()-0.5)*0.15,g:0,life:3.2,s:0.16,grow:0.5,a:0.32});}}
// ---- desenfoque (profundidad de campo) en el modo foto
const DOF={on:false,ready:false,loading:null,comp:null,pass:null};
function dofLoad(){if(DOF.ready)return Promise.resolve();if(DOF.loading)return DOF.loading;const base='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/';
  const L=['shaders/CopyShader.js','shaders/BokehShader.js','postprocessing/EffectComposer.js','postprocessing/RenderPass.js','postprocessing/ShaderPass.js','postprocessing/BokehPass.js'].filter(f=>!(f.endsWith('CopyShader.js')&&THREE.CopyShader)&&!(f.endsWith('EffectComposer.js')&&THREE.EffectComposer)&&!(f.endsWith('RenderPass.js')&&THREE.RenderPass)&&!(f.endsWith('ShaderPass.js')&&THREE.ShaderPass));
  DOF.loading=L.reduce((p,f)=>p.then(()=>new Promise((ok,ko)=>{const s=document.createElement('script');s.src=base+f;s.onload=ok;s.onerror=()=>ko(new Error(f));document.head.appendChild(s);})),Promise.resolve()).then(()=>{
    const W=innerWidth,H=innerHeight,pr=renderer.getPixelRatio(),rt=new THREE.WebGLRenderTarget(W*pr,H*pr,{format:THREE.RGBAFormat,depthBuffer:true,stencilBuffer:true}),c=new THREE.EffectComposer(renderer,rt);c.setPixelRatio(pr);c.setSize(W,H);c.addPass(new THREE.RenderPass(scene,camera));
    const b=new THREE.BokehPass(scene,camera,{focus:20,aperture:0.00012,maxblur:0.008,width:W,height:H});c.addPass(b);DOF.comp=c;DOF.pass=b;DOF.ready=true;addEventListener('resize',()=>{if(DOF.comp)DOF.comp.setSize(innerWidth,innerHeight);});});return DOF.loading;}
const _dofRay=new THREE.Raycaster();
function dofFocus(){try{_dofRay.setFromCamera({x:0,y:0},camera);_dofRay.far=600;const hits=_dofRay.intersectObjects(scene.children,true).filter(h=>h.object.visible&&!(h.object.material&&h.object.material.transparent));const d=hits.length?hits[0].distance:60;DOF.pass.uniforms.focus.value=d;DOF.pass.uniforms.aperture.value=0.00012*Math.min(3,40/Math.max(4,d));return d;}catch(e){return 0;}}
function dofToggle(){if(DOF.on){DOF.on=false;dofLbl();return;}toast('Cargando el desenfoque…');dofLoad().then(()=>{DOF.on=true;const d=dofFocus();dofLbl();toast('<span class="label">Desenfoque</span><br>Enfocado a '+Math.round(d)+' m: lo que está en el centro de la imagen. Mueve la vista y pulsa «Enfocar» otra vez.');}).catch(()=>toast('No se ha podido cargar el desenfoque (¿sin conexión?).'));}
function dofLbl(){const b=$('phDof');if(b)b.textContent='Desenfoque: '+(DOF.on?'sí':'no');const f=$('phFoc');if(f)f.hidden=!DOF.on;}
const phToggle0=phToggle;phToggle=function(on){phToggle0(on);if(PH.on&&$('phUI')&&!$('phDof')){const u=$('phUI'),x=$('phX'),b=document.createElement('button');b.id='phDof';b.onclick=e=>{e.stopPropagation();dofToggle();};u.insertBefore(b,x);const f=document.createElement('button');f.id='phFoc';f.textContent='Enfocar';f.onclick=e=>{e.stopPropagation();if(DOF.on){const d=dofFocus();toast('Enfocado a '+Math.round(d)+' m.');}};u.insertBefore(f,x);dofLbl();}if(!PH.on)DOF.on=false;};
// ---- sombras de contacto (SSAO) dentro de la iluminación realzada: más sombra en rincones, bajo los pórticos y al pie de los muros
GFX.ao=false;try{GFX.ao=localStorage.getItem('nostos-ao')==='on';}catch(e){}
function aoLabel(){return 'Sombras de contacto: '+(GFX.ao?'sí':'no');}
function aoLoad(){if(GFX.aoPass)return Promise.resolve();const base='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/';const L=['math/SimplexNoise.js','shaders/SSAOShader.js','postprocessing/SSAOPass.js'];
  return L.reduce((p,f)=>p.then(()=>new Promise((ok,ko)=>{const s=document.createElement('script');s.src=base+f;s.onload=ok;s.onerror=()=>ko(new Error(f));document.head.appendChild(s);})),Promise.resolve()).then(()=>{
    const p=new THREE.SSAOPass(scene,camera,innerWidth,innerHeight);p.kernelRadius=1.2;p.minDistance=0.00008;p.maxDistance=0.0012;try{const W=innerWidth*renderer.getPixelRatio(),H=innerHeight*renderer.getPixelRatio(),dt=new THREE.DepthTexture();dt.type=THREE.UnsignedIntType;p.normalRenderTarget.dispose();p.normalRenderTarget=new THREE.WebGLRenderTarget(W,H,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,format:THREE.RGBAFormat,depthTexture:dt});p.ssaoMaterial.uniforms.tNormal.value=p.normalRenderTarget.texture;p.ssaoMaterial.uniforms.tDepth.value=dt;if(p.depthRenderMaterial)p.depthRenderMaterial.uniforms.tDepth.value=dt;p.beautyRenderTarget.dispose();p.beautyRenderTarget=new THREE.WebGLRenderTarget(W,H,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat,stencilBuffer:true});p.ssaoMaterial.uniforms.tDiffuse.value=p.beautyRenderTarget.texture;if(p.blendMaterial&&p.blendMaterial.uniforms.tDiffuse)p.blendMaterial.uniforms.tDiffuse.value=p.blendRenderTarget?p.blendRenderTarget.texture:p.blendMaterial.uniforms.tDiffuse.value;}catch(e){console.warn('ssao 32 bits',e);}GFX.comp.insertPass(p,1);GFX.aoPass=p;addEventListener('resize',()=>p.setSize(innerWidth,innerHeight));});}
function aoSet(on){GFX.ao=on;try{localStorage.setItem('nostos-ao',on?'on':'off');}catch(e){}
  if(!on){if(GFX.aoPass)GFX.aoPass.enabled=false;toast('Sombras de contacto desactivadas.');return;}
  const go=()=>aoLoad().then(()=>{GFX.aoPass.enabled=true;toast('<span class="label">Sombras de contacto</span><br>Funcionan junto con la iluminación realzada. Si el juego va lento, desactívalas.');}).catch(()=>{GFX.ao=false;toast('No se han podido cargar las sombras de contacto (¿sin conexión?).');});
  if(!GFX.on){gfxSet(true);const w=setInterval(()=>{if(GFX.on&&GFX.comp){clearInterval(w);go();}},400);setTimeout(()=>clearInterval(w),30000);}else go();}
if(GFX.ao)setTimeout(()=>{const w=setInterval(()=>{if(GFX.on&&GFX.comp){clearInterval(w);aoSet(true);}},800);setTimeout(()=>clearInterval(w),40000);},4500);
GM_IC.ao='<circle cx="9" cy="12" r="5"/><path d="M14 7a5 5 0 0 1 0 10"/><path d="M4 20h16"/>';

