// ============================================================ plano
const MAPB={x0:-1320,x1:760,z0:-1290,z1:470};
const MAPC={};let MB=MAPB;
function mapStale(c){return c._fp!==footprints.length&&performance.now()-(c._t||0)>15000;}   // el plano se rehace si han cambiado los edificios
function regionBounds(k){const S=regionSquare(k);if(!S)return MAPB;const hh=S.h*1.05,w=hh*900/760;return{x0:S.cx-w,x1:S.cx+w,z0:S.cz-hh,z1:S.cz+hh};}   // el cuadrado entero del escenario (con el Pireo, Ostia o la Vía Apia)
function mapXY(x,z,W,H){return[(x-MB.x0)/(MB.x1-MB.x0)*W,(z-MB.z0)/(MB.z1-MB.z0)*H];}
function buildMapBase(W,H,step){
  step=step||2;const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const img=x.createImageData(W,H);
  for(let j=0;j<H;j+=step)for(let i=0;i<W;i+=step){const wx=MB.x0+i/W*(MB.x1-MB.x0),wz=MB.z0+j/H*(MB.z1-MB.z0);const h=terrainH(wx,wz);const hx=terrainH(wx+3,wz)-h,hz=terrainH(wx,wz+3)-h;const sh=clamp(1+(-hx-hz)*0.25,0.55,1.4);
    let r,g,b;if(h<-0.5){r=58;g=110;b=135;}else{const t=clamp(h/60,0,1);r=lerp(176,140,t);g=lerp(160,128,t);b=lerp(112,104,t);if(wx<8000&&(MODE==='roma'?romaInUrbs(wx,wz):insideWalls(wx,wz))){r+=18;g+=10;}
      else if(MODE==='atenas'&&wx<8000&&h>0.6){const ft=fieldAt(wx,wz);if(ft){const C=[0,[206,186,112],[128,146,84],[150,128,84],[196,176,108],[118,150,80]][ft]||[0,0,0];r=C[0];g=C[1];b=C[2];}}}   // campos: trigo, olivos, viñas, cebada, huertos
    r*=sh;g*=sh;b*=sh;for(let dj=0;dj<step&&j+dj<H;dj++)for(let di=0;di<step&&i+di<W;di++){const k=((j+dj)*W+(i+di))*4;img.data[k]=r;img.data[k+1]=g;img.data[k+2]=b;img.data[k+3]=255;}}
  x.putImageData(img,0,0);
  const P=(wx,wz)=>mapXY(wx,wz,W,H);
  x.strokeStyle='#e9dcc0';x.lineCap='round';
  for(const r of ROADS){x.lineWidth=Math.max(1.5,r.w*W/(MB.x1-MB.x0)*1.4);x.beginPath();r.pts.forEach((p,i)=>{const q=P(p[0],p[1]);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);});x.stroke();}
  for(const f of footprints){if(f.reserve)continue;x.fillStyle=f.c;if(f.r){const q=P(f.x,f.z);x.beginPath();x.arc(q[0],q[1],f.r*W/(MB.x1-MB.x0),0,TAU);x.fill();continue;}
    const cs=[[-f.w/2,-f.d/2],[f.w/2,-f.d/2],[f.w/2,f.d/2],[-f.w/2,f.d/2]].map(p=>{const w=toW(p[0],p[1],f.x,f.z,f.a);return P(w[0],w[1]);});x.beginPath();cs.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));x.closePath();x.fill();}
  if(MODE==='atenas'){x.strokeStyle='#5a4532';x.lineWidth=3*W/900;x.beginPath();for(let i=0;i<=WN;i++){const p=wallPts[i%WN];const q=P(p[0],p[1]);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();
  for(const s of LW){const a=P(s[0],s[1]),b=P(s[0]+LW_DIR[0]*900,s[1]+LW_DIR[1]*900);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();}}
  x.font='italic 15px Alegreya, Georgia, serif';x.textAlign='center';x.fillStyle='#2a1e14';
  const lab=MODE==='roma'?ROMA_LABELS:[['Acrópolis',0,-85],['Ágora',AG.x+20,AG.z-20],['Pnyx',PNYX.x,PNYX.z-30],['Areópago',AREO.x,AREO.z-34],['Teatro',THEA.x,THEA.z+70],['Odeón',162,85],['Academia',ACADEMY.x,ACADEMY.z-80],['Liceo',LYCEUM.x,LYCEUM.z-45],['Cerámico',D.x-70,D.z-20],['Muros Largos',PG.x-260,PG.z+190],['Licabeto',450,-860],['Colina de las Musas',-330,330],['Cinosarges',CYNO.x,CYNO.z+45],['Olimpieion',OLY.x,OLY.z+50],['Eleusinion',ELEUS.x+55,ELEUS.z+10]];
  for(const l of lab){const q=P(l[1],l[2]);x.fillText(l[0],q[0],q[1]);}
  // salidas a pie hacia los mapas vecinos
  x.font='bold 13px Alegreya, Georgia, serif';for(const g of GATES_W){const q=P(g.x,g.z);if(q[0]<0||q[1]<0||q[0]>W||q[1]>H)continue;
    x.fillStyle='#7a2a1a';x.beginPath();x.arc(q[0],q[1],5,0,TAU);x.fill();x.fillStyle='#2a1e14';const tx=clamp(q[0]-g.ox*14,50,W-50),tz=clamp(q[1]-g.oz*14,14,H-6);x.fillText('→ '+mapName(g.to),tx,tz);}
  if(MODE==='atenas'){x.font='italic 22px Alegreya, Georgia, serif';}if(MODE==='atenas')for(const I of ISLANDS){const q=P(I.x,I.z-I.R*0.2);x.fillText(I.name,q[0],q[1]);}
  if(HARBOR.ok){x.font='italic 15px Alegreya, Georgia, serif';const q=P(HARBOR.x-40,HARBOR.z+30);x.fillText('Pireo (barco a las islas)',q[0],q[1]);}
  // el escenario es un cuadrado: lo de fuera, más oscuro; el borde, en línea discontinua
  {const k=(MB.x0+MB.x1)/2<8000?'atenas':(islandOf((MB.x0+MB.x1)/2)||{}).id,S=k&&regionSquare(k);if(S){const a=P(S.cx-S.h,S.cz-S.h),b=P(S.cx+S.h,S.cz+S.h);
    x.save();x.fillStyle='rgba(22,16,12,.38)';x.beginPath();x.rect(0,0,W,H);x.rect(a[0],a[1],b[0]-a[0],b[1]-a[1]);x.fill('evenodd');
    x.setLineDash([10,6]);x.strokeStyle='#2a1e14';x.lineWidth=2.5;x.strokeRect(a[0],a[1],b[0]-a[0],b[1]-a[1]);x.restore();}}
  c._fp=footprints.length;c._t=performance.now();return c;
}
// el plano se puede ampliar (rueda, botones o pellizco) y desplazar arrastrando; ampliado muestra los nombres de lugares y personajes
const MV={s:1,cx:0,cz:0,moved:false,pinch:0};const MAPHI={};
function mapVB(){const w=(MB.x1-MB.x0)/MV.s,h=(MB.z1-MB.z0)/MV.s;return{x0:MV.cx-w/2,z0:MV.cz-h/2,w,h};}
function mapV(x,z,W,H){const v=mapVB();return[(x-v.x0)/v.w*W,(z-v.z0)/v.h*H];}
function mapClamp(){MV.s=clamp(MV.s,1,8);const w=(MB.x1-MB.x0)/MV.s/2,h=(MB.z1-MB.z0)/MV.s/2;MV.cx=clamp(MV.cx,MB.x0+w,MB.x1-w);MV.cz=clamp(MV.cz,MB.z0+h,MB.z1-h);}
function mapZoom(f,mx,my){if(MED.on)return medZoom(f,mx,my);const c=$('mapc');if(mx==null){mx=c.width/2;my=c.height/2;}const v=mapVB(),wx=v.x0+mx/c.width*v.w,wz=v.z0+my/c.height*v.h;
  MV.s=clamp(MV.s*f,1,8);const v2=mapVB();MV.cx=wx-(mx/c.width-0.5)*v2.w;MV.cz=wz-(my/c.height-0.5)*v2.h;mapClamp();drawMap();}
function openMap(){stepFlag('map');ui='map';releasePointer();document.querySelector('#map h2').textContent=regionOf(player.x)==='atenas'?(MODE==='roma'?'Plano de Roma':'Plano de Atenas'):'Plano de '+islandOf(player.x).name;$('map').hidden=false;
  MB=regionBounds(regionOf(player.x));MV.s=1;MV.cx=(MB.x0+MB.x1)/2;MV.cz=(MB.z0+MB.z1)/2;setMed(false);}
// esfera de sueño en el plano: círculo azul claro con aro; gris azulado si ya se ha soñado
function sphereIcon(x,q,r,done){const g=x.createRadialGradient(q[0]-r*0.3,q[1]-r*0.3,0,q[0],q[1],r);g.addColorStop(0,'#ffffff');g.addColorStop(1,done?'#8fa0b8':'#7fb2ff');
  x.fillStyle=g;x.strokeStyle='#16100c';x.lineWidth=1.5;x.beginPath();x.arc(q[0],q[1],r,0,TAU);x.fill();x.stroke();x.strokeStyle=done?'rgba(143,160,184,.8)':'rgba(127,178,255,.9)';x.lineWidth=1.5;x.beginPath();x.ellipse(q[0],q[1],r*1.7,r*0.6,-0.4,0,TAU);x.stroke();}
function drawMap(){
  if(MED.on)return drawMed();
  const c=$('mapc'),W=c.width,H=c.height,x=c.getContext('2d');const key=regionOf(player.x);MB=regionBounds(key);if(!MAPC[key]||mapStale(MAPC[key]))MAPC[key]=buildMapBase(W,H);
  // ampliado: plano en alta resolución (se construye una vez, la primera vez que se amplía)
  if(MV.s>1.5&&!MAPHI[key])MAPHI[key]=buildMapBase(W*3,H*3,4);
  const base=MV.s>1.5?MAPHI[key]:MAPC[key],v=mapVB(),kx=base.width/(MB.x1-MB.x0),kz=base.height/(MB.z1-MB.z0);
  x.fillStyle='#2a2018';x.fillRect(0,0,W,H);x.drawImage(base,(v.x0-MB.x0)*kx,(v.z0-MB.z0)*kz,v.w*kx,v.h*kz,0,0,W,H);try{mapFog(x,key,v,W,H);}catch(e){}
  const P=(wx,wz)=>mapV(wx,wz,W,H),vis=q=>q[0]>-20&&q[1]>-20&&q[0]<W+20&&q[1]<H+20,big=MV.s>=2.2;
  // los nombres que se pisarían se desplazan hacia abajo o hacia arriba
  const used=[],label=(t,q,dy,col)=>{x.font='bold 12px Alegreya, Georgia, serif';x.textAlign='center';const w=x.measureText(t).width+4;
    let y=q[1]+dy;for(const off of [0,13,-13-2*dy,26,-26-2*dy,39]){const yy=q[1]+dy+off;if(!used.some(r=>Math.abs(r[0]-q[0])<(r[2]+w)/2&&Math.abs(r[1]-yy)<13)){y=yy;break;}}
    used.push([q[0],y,w]);x.lineWidth=3;x.strokeStyle='rgba(241,232,216,.9)';x.strokeText(t,q[0],y);x.fillStyle=col||'#16100c';x.fillText(t,q[0],y);};
  for(const c of captains){const q=P(c.x,c.z);if(!vis(q))continue;x.fillStyle='#2f5a7a';x.beginPath();x.moveTo(q[0]-7,q[1]);x.lineTo(q[0]+7,q[1]);x.lineTo(q[0]+4,q[1]+5);x.lineTo(q[0]-4,q[1]+5);x.closePath();x.fill();x.fillRect(q[0]-0.8,q[1]-10,1.6,10);}
  for(const s of signObjs){const q=P(s.x,s.z);if(!vis(q))continue;const ok=state.places.includes(s.data.id);x.fillStyle=ok?'#d9874a':'rgba(22,16,12,.55)';x.beginPath();x.moveTo(q[0],q[1]-6);x.lineTo(q[0]+5,q[1]);x.lineTo(q[0],q[1]+6);x.lineTo(q[0]-5,q[1]);x.closePath();x.fill();
    if(big&&ok)label(s.data.name,q,-9,'#5a2e10');}
  for(const n of npcObjs){if(n.hidden)continue;const q=P(n.x,n.z);if(!vis(q))continue;const ok=state.lessons.includes(n.data.id);x.fillStyle=ok?'#6f8a4e':'#f0b45c';x.strokeStyle='#16100c';x.lineWidth=2;x.beginPath();x.arc(q[0],q[1],6,0,TAU);x.fill();x.stroke();
    x.fillStyle='#16100c';x.font='bold 11px Georgia';x.textAlign='center';x.fillText(n.data.glyph,q[0],q[1]+4);if(big)label(n.data.name,q,19);}
  for(const o of godObjs){if(!state.gods.met.includes(o.data.id)||regionOf(o.x)!==regionOf(player.x))continue;const q=P(o.x,o.z);if(!vis(q))continue;x.fillStyle='#ffd27a';x.strokeStyle='#16100c';x.lineWidth=1.5;x.beginPath();
    for(let k=0;k<10;k++){const r=k%2?3.5:8,a=k/10*TAU-Math.PI/2;x.lineTo(q[0]+Math.cos(a)*r,q[1]+Math.sin(a)*r);}x.closePath();x.fill();x.stroke();if(big)label(o.data.name,q,20,'#7a5a1a');}
  if(qLv('so')>=5&&typeof OVID_OBJS!=='undefined')for(const o of OVID_OBJS){if(ovz().seen[o.o.id]||regionOf(o.e.x)!==regionOf(player.x))continue;const q=P(o.e.x,o.e.z);if(!vis(q))continue;x.fillStyle='#7fe08a';x.strokeStyle='#1a3a1a';x.lineWidth=1;x.beginPath();x.arc(q[0],q[1],4.5,0,TAU);x.fill();x.stroke();}
  for(const s of EPI.spheres){if(regionOf(s.x)!==regionOf(player.x))continue;const q=P(s.x,s.z);if(!vis(q))continue;sphereIcon(x,q,7,epiDone(s.data));if(big)label(s.data.name,q,20,'#2a4a7a');}
  const q=P(player.x,player.z);const b=-player.yaw;x.save();x.translate(q[0],q[1]);x.rotate(b);x.fillStyle='#a8392b';x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.moveTo(0,-11);x.lineTo(7,8);x.lineTo(0,4);x.lineTo(-7,8);x.closePath();x.fill();x.stroke();x.restore();
  x.fillStyle='rgba(22,16,12,.8)';x.fillRect(10,H-76,250,66);x.font='13px Alegreya, Georgia';x.textAlign='left';
  sphereIcon(x,[24,H-62],5,false);x.fillStyle='#f1e8d8';x.fillText('Esfera de sueño (momento mítico)',36,H-58);
  x.fillStyle='#f0b45c';x.beginPath();x.arc(24,H-44,5,0,TAU);x.fill();x.fillStyle='#f1e8d8';x.fillText('Personaje por conocer',36,H-40);
  x.fillStyle='#d9874a';x.fillRect(19,H-27,10,10);x.fillStyle='#f1e8d8';x.fillText('Lugar descubierto (clic para viajar)',36,H-18);
  x.fillStyle='rgba(22,16,12,.8)';x.fillRect(W-238,H-34,228,24);x.fillStyle='#f1e8d8';x.textAlign='center';x.fillText(MV.s>1.01?`Aumento ×${MV.s.toFixed(1)}`+(big?'':' · amplía más para ver nombres'):'Rueda o + para ampliar',W-124,H-17);
}
function mapPt(e){const c=$('mapc'),r=c.getBoundingClientRect();return[(e.clientX-r.left)/r.width*c.width,(e.clientY-r.top)/r.height*c.height];}
$('mapc').addEventListener('wheel',e=>{e.preventDefault();const m=mapPt(e);mapZoom(e.deltaY<0?1.25:0.8,m[0],m[1]);},{passive:false});
const MPTR=new Map();
$('mapc').addEventListener('pointerdown',e=>{$('mapc').setPointerCapture(e.pointerId);MPTR.set(e.pointerId,mapPt(e));MV.moved=false;
  if(MPTR.size===2){const [a,b]=[...MPTR.values()];MV.pinch=Math.hypot(a[0]-b[0],a[1]-b[1]);}});
$('mapc').addEventListener('pointermove',e=>{if(!MPTR.has(e.pointerId))return;const c=$('mapc'),m=mapPt(e),o=MPTR.get(e.pointerId);MPTR.set(e.pointerId,m);
  if(MPTR.size===2){const [a,b]=[...MPTR.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(MV.pinch)mapZoom(d/MV.pinch,(a[0]+b[0])/2,(a[1]+b[1])/2);MV.pinch=d;MV.moved=true;return;}
  const dx=m[0]-o[0],dy=m[1]-o[1];if(Math.abs(dx)+Math.abs(dy)>2)MV.moved=true;
  if(MED.on){if(MV.moved&&MED.v.s>1.01){MED.v.cx-=dx/MED.v.s;MED.v.cy-=dy/MED.v.s;medClamp(c.width,c.height);drawMap();}return;}
  if(MV.moved&&MV.s>1.01){const v=mapVB();MV.cx-=dx/c.width*v.w;MV.cz-=dy/c.height*v.h;mapClamp();drawMap();}});
const mapUp=e=>{MPTR.delete(e.pointerId);if(MPTR.size<2)MV.pinch=0;};
$('mapc').addEventListener('pointerup',mapUp);$('mapc').addEventListener('pointercancel',mapUp);
$('mapc').addEventListener('click',e=>{
  if(MV.moved){MV.moved=false;return;}
  if(MED.on)return;
  const c=$('mapc');const [mx,my]=mapPt(e);
  let best=null,bd=16;for(const s of signObjs){if(!state.places.includes(s.data.id))continue;if(regionOf(s.x)!==regionOf(player.x))continue;const q=mapV(s.x,s.z,c.width,c.height);const d=Math.hypot(q[0]-mx,q[1]-my);if(d<bd){bd=d;best=s;}}
  if(best){const a=best.data.rot;const off=toW(0,2.6,best.x,best.z,a);player.x=off[0];player.z=off[1];const p={x:player.x,z:player.z};resolve(p,0.35);player.x=p.x;player.z=p.z;player.feet=floorAt(player.x,player.z);player.camY=player.feet+player.eye;player.vy=0;
    player.yaw=Math.atan2(player.x-best.x,player.z-best.z);closeModals();toast('Viajas a: '+best.data.name);}
});
$('mapIn').onclick=()=>mapZoom(1.5);$('mapOut').onclick=()=>mapZoom(1/1.5);
$('mapMe').onclick=()=>{if(MED.on){const pos=medHere(),c=$('mapc'),B=medBase(c.width,c.height);if(!pos)return;if(MED.v.s<3)MED.v.s=3;MED.v.cx=(pos[0]-MED.lon0)*B.k;MED.v.cy=B.oy+(MED.lat1-pos[1])*B.ky;medClamp(c.width,c.height);drawMap();return;}if(MV.s<3)MV.s=3;MV.cx=player.x;MV.cz=player.z;mapClamp();drawMap();};
$('mapAll').onclick=()=>{if(MED.on){medReset();drawMap();return;}MV.s=1;mapClamp();drawMap();};
