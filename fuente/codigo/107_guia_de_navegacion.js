// ============================================================ GUÍA DE NAVEGACIÓN: flechas 3D alrededor de la barca hacia cada destino (Y para ocultarlas)
// En el puerto: hacia mar abierto. En un tramo: puertos donde desembarcar (con distancia), tramos vecinos, pasos (díolkos, Bósforo…) y, en dorado,
// el siguiente paso hacia el objetivo de la misión o del encargo (si está en otro mar, por la ruta más corta entre tramos).
const SWNAV={on:true,pool:[],t:0,list:[]};try{SWNAV.on=localStorage.getItem('nostos-guia')!=='off';}catch(e){}
function navLabel(){const c=document.createElement('canvas');c.width=512;c.height=128;const t=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true,fog:false}));s.scale.set(3.2,0.8,1);s.renderOrder=12;return{s,c,t,k:''};}
function navText(L,a,b,gold){const k=a+'|'+b+'|'+gold;if(L.k===k)return;L.k=k;const x=L.c.getContext('2d');x.clearRect(0,0,512,128);x.fillStyle='rgba(16,22,26,0.72)';x.fillRect(8,10,496,108);x.fillStyle=gold?'#ffc84a':'#8fe0ea';x.fillRect(8,10,5,108);
  x.textAlign='center';x.fillStyle=gold?'#ffd878':'#f1e8d8';x.font='40px Marcellus, Georgia, serif';x.fillText(a,256,58,480);x.fillStyle=gold?'#f0d098':'#bfe6ea';x.font='italic 28px Alegreya, Georgia, serif';x.fillText(b,256,98,480);L.t.needsUpdate=true;}
function navArrow(){const g=new THREE.Group(),mat=new THREE.MeshBasicMaterial({color:'#8fe0ea',transparent:true,opacity:0.9,depthWrite:false,side:THREE.DoubleSide});
  // flecha plana tumbada sobre el agua (vista desde la barca, se lee su forma)
  const sh=new THREE.Shape();sh.moveTo(-0.22,-1.1);sh.lineTo(0.22,-1.1);sh.lineTo(0.22,0.25);sh.lineTo(0.62,0.25);sh.lineTo(0,1.2);sh.lineTo(-0.62,0.25);sh.lineTo(-0.22,0.25);sh.closePath();
  const ar=new THREE.Mesh(new THREE.ShapeGeometry(sh),mat);ar.rotation.x=Math.PI/2;ar.renderOrder=11;g.add(ar);
  const ol=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshBasicMaterial({color:'#10161a',transparent:true,opacity:0.45,depthWrite:false,side:THREE.DoubleSide}));ol.rotation.x=Math.PI/2;ol.scale.setScalar(1.12);ol.position.y=-0.01;ol.renderOrder=10;g.add(ol);
  const L=navLabel();L.s.position.set(0,1.1,0.6);g.add(L.s);g.visible=false;scene.add(g);return{g,mat,L};}
function navGraph(){const D=swD(),G={};for(const id in D.segs){const S=D.segs[id];G[id]=[];for(const d of['n','s','e','w'])if(S[d])G[id].push({to:S[d],dir:d});for(const dc of S.deco||[])if(dc.go)G[id].push({to:dc.go[0],go:dc});}return G;}
function navRoute(from,to){if(from===to)return null;const G=navGraph(),prev={},Q=[from];prev[from]=null;while(Q.length){const c=Q.shift();if(c===to)break;for(const e of G[c]||[])if(!(e.to in prev)){prev[e.to]={from:c,e};Q.push(e.to);}}if(!(to in prev))return null;let c=to,step=null;while(prev[c]&&prev[c].from!==from)c=prev[c].from;return prev[c]?prev[c].e:null;}
function navGoals(){const D=swD(),z=sw2z(),out=[];const segOfIsle=id=>{for(const k in D.segs)for(const I of D.segs[k].isl)if(I.id===id)return[k,I];return null;};
  if(z.task){const r=segOfIsle(z.task.to);if(r)out.push({seg:r[0],I:r[1],what:'Encargo: '+z.task.name});}
  if(z.m===1){for(const k in D.segs)for(const I of D.segs[k].isl)if(I.giver)out.push({seg:k,x:I.x,z:I.z,what:'Misión: '+D.giver.name});}
  if(z.m>=2&&z.m<3)for(const it of D.items){if(z.it[it.key])continue;if(it.where==='palace')out.push({seg:D.palace.seg,x:D.palace.x,z:D.palace.z,what:'Misión: '+it.short+' (bucea)'});else{const r=segOfIsle(it.where);if(r)out.push({seg:r[0],I:r[1],what:'Misión: '+it.short});}}
  if(z.m>=3&&!z.owner3){}
  if(typeof SWAF!=='undefined'&&z.af===1)for(const k in SWAF.it){const I=SWAF.it[k];out.push({seg:I.seg,wx:I.x,wz:I.z,what:'Afrodita: '+SW_AFT[k][0].toLowerCase()});}
  if(z.m>=1&&z.m<3&&D.items.every(it=>z.it[it.key])){const r=segOfIsle('atenas');if(r)out.push({seg:r[0],I:r[1],what:'Vuelve con '+D.owner.name});}
  return out;}
function navTargets(){const D=swD(),z=sw2z(),T=[],px=player.x,pz=player.z,dist=(x,zz)=>Math.round(Math.hypot(x-px,zz-pz));
  if(!SW.seg){const m=swMoorOf(z.at),P=PORTS[z.at];if(m&&P){let dx=m.x-P.x,dz=m.z-P.z;const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const left=Math.max(0,Math.round(110-Math.hypot(px-m.x,pz-m.z)));T.push({x:px+dx*200,z:pz+dz*200,a:'Mar abierto',b:'rema unos '+left+' m en esta dirección',gold:true});}return T;}
  const S=D.segs[SW.seg],cz=swSegZ(SW.seg),goals=navGoals(),goldEdge={},goldGo={};
  for(const G of goals){if(G.seg===SW.seg){let x,zz;if(G.I){const ux=px-(SW.X+G.I.x),uz=pz-(cz+G.I.z),l=Math.hypot(ux/G.I.rx,uz/G.I.rz)||1;x=SW.X+G.I.x+ux/l;zz=cz+G.I.z+uz/l;}else if(G.wx!==undefined){x=G.wx;zz=G.wz;}else{x=SW.X+G.x;zz=cz+G.z;}T.push({x,z:zz,a:G.what,b:'a '+dist(x,zz)+' m',gold:true,pri:0});}
    else{const e=navRoute(SW.seg,G.seg);if(e){if(e.go)goldGo[e.go.info+e.to]=G.what;else goldEdge[e.dir]=G.what;}}}
  const NM={n:'Norte',s:'Sur',e:'Este',w:'Oeste'};
  for(const d of['n','s','e','w']){const t=S[d];if(!t)continue;const P={n:[px,cz-SW.H-60],s:[px,cz+SW.H+60],e:[SW.X+SW.H+60,pz],w:[SW.X-SW.H-60,pz]}[d];const g=goldEdge[d];T.push({x:P[0],z:P[1],a:NM[d]+': '+D.segs[t].name,b:g?'→ '+g:'cruza el borde a '+dist(P[0],P[1])+' m',gold:!!g,pri:g?1:3});}
  for(const dc of S.deco||[])if(dc.go){const x=SW.X+dc.x,zz=cz+dc.z,g=goldGo[dc.info+dc.go[0]];T.push({x,z:zz,a:dc.goT.replace(/ (por|hacia) .*/,''),b:g?'→ '+g:'paso a '+D.segs[dc.go[0]].name+' · '+dist(x,zz)+' m',gold:!!g,pri:g?1:3});}
  for(const I of S.isl){if(!I.id)continue;const ux=px-(SW.X+I.x),uz=pz-(cz+I.z),l=Math.hypot(ux/I.rx,uz/I.rz)||1,x=SW.X+I.x+ux/l,zz=cz+I.z+uz/l;T.push({x,z:zz,a:I.name.split(' y ')[0],b:'desembarcar · a '+dist(x,zz)+' m',gold:false,pri:2});}
  T.sort((a,b)=>(a.pri-b.pri)||(Math.hypot(a.x-px,a.z-pz)-Math.hypot(b.x-px,b.z-pz)));return T.slice(0,7);}
function navTick(dt){const show=SWNAV.on&&BOAT.sea&&!SW.swim&&!SW.uw&&ui==='play'&&swD();
  if(!show){for(const A of SWNAV.pool)A.g.visible=false;return;}
  SWNAV.t-=dt;if(SWNAV.t<0){SWNAV.t=0.3;SWNAV.list=navTargets();}
  while(SWNAV.pool.length<SWNAV.list.length)SWNAV.pool.push(navArrow());const sy=swSeaY(),t=performance.now()/1000;
  SWNAV.pool.forEach((A,i)=>{const T=SWNAV.list[i];if(!T){A.g.visible=false;return;}const dx=T.x-player.x,dz=T.z-player.z,l=Math.hypot(dx,dz)||1,r=4.6;
    A.g.visible=true;A.g.scale.setScalar(1.1);A.g.position.set(player.x+dx/l*r,sy+0.45+Math.sin(t*2+i)*0.05,player.z+dz/l*r);A.g.rotation.y=Math.atan2(dx,dz);A.mat.color.set(T.gold?'#ffc84a':'#8fe0ea');
    A.L.s.position.set(0,1.3+(i%3)*0.6,0.9);navText(A.L,T.a,T.b,T.gold);});}
window.addEventListener('keydown',e=>{if(e.code!=='KeyY'||e.repeat||ui!=='play'||!BOAT.sea||(e.target&&e.target.tagName==='INPUT'))return;SWNAV.on=!SWNAV.on;try{localStorage.setItem('nostos-guia',SWNAV.on?'on':'off');}catch(_){}toast(SWNAV.on?'Guía de navegación activada: las flechas señalan cada destino. Las doradas, tu objetivo.':'Guía de navegación oculta (Y para volver a verla).');SW2.hudK='';});

// ============================================================ AGUA: oleaje animado, reflejo del cielo según el ángulo (Fresnel) y destellos del sol
// Mar y ríos usan un mapa de normales generado aquí (sin imágenes externas), muestreado dos veces en coordenadas del mundo con escalas y
// direcciones distintas; así no hay costuras cuando el plano del mar se recoloca siguiendo al jugador. Hacia el horizonte el agua refleja el
// color del cielo (el de la niebla del horizonte); mirando hacia abajo se ve su color profundo.
const WTR={tex:null,mats:[],t:0};
function wtrTex(){if(WTR.tex)return WTR.tex;const N=256,h=new Float32Array(N*N),TA=Math.PI*2;
  const W=[[1,0,0.5,0],[0,1,0.45,1.3],[2,1,0.25,2.1],[1,-2,0.22,0.7],[3,2,0.12,4.2],[-2,3,0.11,1.9],[5,1,0.06,0.3],[1,5,0.06,2.8],[4,-5,0.04,5.1],[7,3,0.03,3.3],[-6,7,0.025,0.9]];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=0;for(const[a,b,amp,ph]of W)v+=amp*Math.sin(TA*(a*x+b*y)/N+ph);h[y*N+x]=v;}
  const c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),im=g.createImageData(N,N);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const L=h[y*N+(x+N-1)%N],R=h[y*N+(x+1)%N],U=h[((y+N-1)%N)*N+x],D=h[((y+1)%N)*N+x];let nx=(L-R)*2.2,nz=(U-D)*2.2,ny=1;const l=Math.hypot(nx,ny,nz);nx/=l;ny/=l;nz/=l;const i=(y*N+x)*4;im.data[i]=(nx*0.5+0.5)*255;im.data[i+1]=(nz*0.5+0.5)*255;im.data[i+2]=(ny*0.5+0.5)*255;im.data[i+3]=255;}
  g.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;try{t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());}catch(e){}return WTR.tex=t;}
function wtrApply(mat,o){if(!mat||mat.userData.wtr)return;o=o||{};mat.userData.wtr=1;const U={uNrm:{value:wtrTex()},uT:{value:0},uSky:{value:new THREE.Color('#b8c8d0')},uStr:{value:o.str||0.55}};
  mat.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);
    sh.vertexShader='varying vec3 vWP;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n vWP=(modelMatrix*vec4(transformed,1.0)).xyz;');
    sh.fragmentShader='varying vec3 vWP;\nuniform sampler2D uNrm;uniform float uT;uniform vec3 uSky;uniform float uStr;\n'+sh.fragmentShader
     .replace('#include <normal_fragment_begin>','#include <normal_fragment_begin>\n float wDist=length(cameraPosition-vWP);float wS=uStr*clamp(1.0-wDist/900.0,0.18,1.0);\n vec3 w1=texture2D(uNrm,vWP.xz/14.0+vec2(uT*0.021,uT*0.013)).xzy*2.0-1.0;vec3 w2=texture2D(uNrm,vWP.xz/37.5+vec2(-uT*0.012,uT*0.017)).xzy*2.0-1.0;\n vec3 wN=normalize(vec3((w1.x+w2.x)*wS,1.0,(w1.z+w2.z)*wS));if(!gl_FrontFacing)wN.y=-wN.y;\n normal=normalize((viewMatrix*vec4(wN,0.0)).xyz);')
     .replace('#include <fog_fragment>','{vec3 vD=normalize(cameraPosition-vWP);float fr=0.02+0.98*pow(1.0-clamp(abs(dot(wN,vD)),0.0,1.0),5.0);vec3 rc=mix(uSky,vec3(0.42,0.6,0.74),0.4);gl_FragColor.rgb=mix(gl_FragColor.rgb,rc,clamp(fr,0.0,0.55));}\n#include <fog_fragment>');};
  mat.needsUpdate=true;WTR.mats.push(U);}
function waterSetup(){if(SEA){const m=SEA.material;m.color.set(MODE==='roma'?'#22586a':'#1e5a78');m.shininess=420;m.specular.set('#b8ccd4');wtrApply(m,{str:0.6});
    SEA.onBeforeRender=()=>{WTR.t=performance.now()/1000;const sky=scene.fog?scene.fog.color:null;for(const U of WTR.mats){U.uT.value=WTR.t;if(sky)U.uSky.value.copy(sky);}};}
  try{for(const r of CARVE.rivers)if(r.mesh&&r.mesh.material){r.mesh.material.shininess=300;if(r.mesh.material.specular)r.mesh.material.specular.set('#9fb8c0');wtrApply(r.mesh.material,{str:0.35});}}catch(e){}}

