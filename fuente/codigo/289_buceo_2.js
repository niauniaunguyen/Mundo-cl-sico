// ============================================================ EL BUCEO (2): LA RESPIRACIÓN, LA FAUNA, EL PORTAL, EL PALACIO DE POSEIDÓN Y LA ATLÁNTIDA (28/11)
// · Aguantar la respiración: al principio, 30 s; tras sumergirte 3 veces, 40 s; después, 1 s más por cada 5 minutos que lleves en total
//   bajo el agua (hasta +20), y 4 s más por cada prueba de Escilias o de los urinatores. El juego suma todos los segundos bajo el agua.
// · Con una hora en total bajo el agua se despierta un portal de leyenda en el fondo (la criatura está por decidir).
// · Con diez horas, aparece el palacio de Poseidón (Neptuno en el 80): antes, en su sitio solo hay un altar con la ofrenda de la misión.
//   En su puerta, un portal como los de las casas lleva a su interior, un mapa propio a 900 m de altura (como la Gran Pirámide).
// · Fauna fiel y variada (Aristóteles, Historia de los animales; Plinio IX y XXXII; Opiano): peces en bancos, solitarios y del fondo,
//   según el mar; cada especie, con su ficha del Modo Atención.
// · Más allá de las Columnas de Hércules (modo Roma, el Océano), Platón situaba la Atlántida (Timeo 24e-25d; Critias 113c-121c).
// · Rendimiento: el fondo, las rocas, la posidonia y los pecios de cada tramo solo se dibujan en el tramo donde estás.
function dvAirMax(){const z=dvz();const n=['conchas','aguante','carrera'].filter(k=>z.esc&&z.esc[k]).length;const base=(z.dives||0)>=3?40:30,prog=(z.dives||0)>=3?Math.min(20,Math.floor((z.uwT||0)/300)):0;return base+prog+4*n;}
function dvFmt(t){t=Math.floor(t||0);const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return(h?h+' h ':'')+(h||m?m+' min ':'')+s+' s';}
// ---------------- la fauna
// [clave, nombre, tipo de cuerpo, cantidad máxima, escala, color, comportamiento, mares (null = todos), grupos]
const DV2_SP=[
 ['salpa','Salpas','fish',36,1,'#e0d4a8','school',null,3],
 ['sargo','Sargos','fish',24,1.1,'#d0ccc0','school',null,2],
 ['castanuela','Castañuelas','fish',40,0.55,'#3a4a7a','school',null,2],
 ['boga','Bogas','fish',30,0.8,'#b8c8c8','school',null,2],
 ['dorada','Doradas','fish',16,1.3,'#eae4d4','school',null,2],
 ['mujol','Mújoles','fish',16,1.2,'#a8b0b0','school',['saronico','corintio','helesponto','ponto','ostia','crater','pontus','adriaticum'],2],
 ['atun','Atunes','tuna',8,3.2,'#4a5a72','school',['helesponto','ponto','egeonorte','jonico','fretum','siculum','pontus','gaditanum','oceanus','sardum'],1],
 ['escaro','Escaros','fish',8,1.3,'#5a9a8a','school',['cretico','tyrrn','crater','aegaeum'],1],
 ['mero','Un mero','fish',2,3.4,'#6a5a48','solo',null,2],
 ['sepia','Una sepia','cuttle',2,1,'#a89a88','solo',null,2],
 ['tortuga','Una tortuga boba','turtle',1,1,'#7a6a4a','solo',['cretico','jonico','icario','siculum','africum','aegyptium','syria','ionium'],1],
 ['medusa','Medusas','jelly',8,1,'#e8d8f0','drift',null,2],
 ['pulpo','Un pulpo','oct',3,1,'#a06a5a','static',null,3],
 ['morena','Una morena','eel',3,1,'#5a4a2a','static',null,3],
 ['langosta','Una langosta','lobster',3,1,'#8a3a2a','static',null,3],
 ['torpedo','Un torpedo','flat',2,1,'#8a7a5a','static',null,2],
 ['estrella','Estrellas de mar','star',8,1,'#d8602a','static',null,8],
 ['erizo','Erizos','urchin',12,1,'#3a1a3a','static',null,12],
 ['caballito','Un caballito de mar','seahorse',2,1,'#c8a040','static',null,2],
 ['nacra','Una nacra','pinna',3,1,'#6a5a4a','static',null,3]];
const DV2G={};
function dv2Geo(){if(DV2G.ok)return DV2G;DV2G.ok=1;const M=(g,x,y,z,rx,ry,rz,sx,sy,sz)=>{const m=new THREE.Matrix4().compose(new THREE.Vector3(x||0,y||0,z||0),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0,ry||0,rz||0)),new THREE.Vector3(sx||1,sy||1,sz||1));return[g,m];};
  DV2G.fish=dvGeo().fish;DV2G.oct=dvGeo().oct;
  {const b=new THREE.SphereGeometry(1,10,8);b.scale(0.35,0.45,1.5);const t=new THREE.ConeGeometry(0.55,0.5,3);t.rotateX(-Math.PI/2);t.scale(1.4,1,1);t.translate(0,0,-1.7);const f=new THREE.ConeGeometry(0.2,0.5,3);f.translate(0,0.5,0.2);DV2G.tuna=mergeGeos([[b,new THREE.Matrix4()],[t,new THREE.Matrix4()],[f,new THREE.Matrix4()]]);}
  {const L=[];for(let i=0;i<10;i++){const c=new THREE.CylinderGeometry(0.11-i*0.006,0.12-i*0.006,0.25,6);c.rotateX(Math.PI/2);L.push(M(c,Math.sin(i*0.7)*0.15,0,0.25*i));}const h=new THREE.SphereGeometry(0.13,8,6);h.scale(1,1,1.4);L.push(M(h,0,0.02,2.55));DV2G.eel=mergeGeos(L);}
  {const b=new THREE.SphereGeometry(0.4,10,8);b.scale(1,0.18,1);const t=new THREE.CylinderGeometry(0.03,0.06,0.7,4);t.rotateX(Math.PI/2);t.translate(0,0,-0.65);DV2G.flat=mergeGeos([[b,new THREE.Matrix4()],[t,new THREE.Matrix4()]]);}
  {const L=[];for(let i=0;i<5;i++){const a=new THREE.ConeGeometry(0.07,0.3,4);a.rotateZ(-Math.PI/2);a.translate(0.15,0,0);L.push(M(a,0,0.03,0,0,i/5*TAU,0));}const c=new THREE.SphereGeometry(0.07,6,4);c.scale(1,0.5,1);L.push(M(c,0,0.03,0));DV2G.star=mergeGeos(L);}
  {const L=[];const c=new THREE.SphereGeometry(0.1,8,6);c.scale(1,0.7,1);L.push(M(c,0,0.06,0));for(let i=0;i<18;i++){const s=new THREE.CylinderGeometry(0.005,0.01,0.16,3);s.translate(0,0.08,0);const a=i*2.4,e=0.2+(i%5)*0.25;L.push(M(s,0,0.06,0,Math.cos(a)*e,0,Math.sin(a)*e));}DV2G.urchin=mergeGeos(L);}
  {const L=[];const sh=new THREE.SphereGeometry(0.5,10,6,0,TAU,0,Math.PI/2);sh.scale(1,0.45,1.25);L.push(M(sh,0,0,0));const h=new THREE.SphereGeometry(0.13,8,6);h.scale(1,0.9,1.3);L.push(M(h,0,0.05,0.75));
   for(const[x,z,ry]of[[0.45,0.35,0.6],[-0.45,0.35,-0.6],[0.35,-0.45,2.4],[-0.35,-0.45,-2.4]]){const f=new THREE.BoxGeometry(0.42,0.04,0.16);L.push(M(f,x,0,z,0,ry,0));}DV2G.turtle=mergeGeos(L);}
  {const L=[];const d=new THREE.SphereGeometry(0.35,10,6,0,TAU,0,Math.PI/2);d.scale(1,0.7,1);L.push(M(d,0,0,0));for(let i=0;i<8;i++){const t=new THREE.CylinderGeometry(0.01,0.02,1.1,3);t.translate(0,-0.55,0);const a=i/8*TAU;L.push(M(t,Math.cos(a)*0.25,0,Math.sin(a)*0.25,(i%2-0.5)*0.15));}DV2G.jelly=mergeGeos(L);}
  {const L=[];for(let i=0;i<8;i++){const s=new THREE.SphereGeometry(0.035-i*0.002,6,4);L.push(M(s,Math.sin(i*0.6)*0.03,0.32-i*0.04,Math.max(0,i-4)*0.025));}const h=new THREE.SphereGeometry(0.04,6,4);h.scale(1,1,1.3);L.push(M(h,0,0.36,0.04));const sn=new THREE.CylinderGeometry(0.01,0.012,0.07,4);sn.rotateX(Math.PI/2);L.push(M(sn,0,0.35,0.1));DV2G.seahorse=mergeGeos(L);}
  {const L=[];const b=new THREE.CylinderGeometry(0.09,0.12,0.6,6);b.rotateX(Math.PI/2);L.push(M(b,0,0.1,0));const t=new THREE.ConeGeometry(0.12,0.25,6);t.rotateX(-Math.PI/2);L.push(M(t,0,0.1,-0.42));
   for(const s of[-1,1]){const a=new THREE.CylinderGeometry(0.01,0.015,0.9,3);a.rotateX(Math.PI/2);L.push(M(a,s*0.06,0.14,0.7,0,s*0.25,0));for(let i=0;i<4;i++){const l=new THREE.CylinderGeometry(0.008,0.01,0.25,3);l.rotateZ(s*1.1);L.push(M(l,s*0.13,0.05,0.12-i*0.1));}}DV2G.lobster=mergeGeos(L);}
  {const s=new THREE.ConeGeometry(0.16,0.8,4);s.scale(1,1,0.45);s.translate(0,0.4,0);DV2G.pinna=s;}
  {const b=new THREE.SphereGeometry(1,10,6);b.scale(0.2,0.12,0.42);const f=new THREE.TorusGeometry(0.2,0.03,3,12);f.scale(1,0.3,2.1);const L=[[b,new THREE.Matrix4()],[f,new THREE.Matrix4()]];for(let i=0;i<8;i++){const t=new THREE.CylinderGeometry(0.008,0.015,0.2,3);t.rotateX(Math.PI/2);L.push(M(t,(i%4-1.5)*0.04,(i<4?0.02:-0.02),0.5));}DV2G.cuttle=mergeGeos(L);}
  return DV2G;}
const DV2={sp:null,seg:null,regd:new Set(),saveT:0,subT:0,portal:null,pal:null,said:{}};
function dv2Sp(){if(DV2.sp)return DV2.sp;const G=dv2Geo();DV2.sp=DV2_SP.map(([k,name,kind,n,sc,col,bh,seas,groups])=>{const mat=dvCausticMat(new THREE.MeshLambertMaterial({color:col,transparent:kind==='jelly',opacity:kind==='jelly'?0.55:1,side:kind==='jelly'?THREE.DoubleSide:THREE.FrontSide}));
    const im=new THREE.InstancedMesh(G[kind],mat,n);im.frustumCulled=false;im.visible=false;scene.add(im);return{k,name,kind,n,s:sc,bh,seas,groups,im,f:[]};});return DV2.sp;}
function dv2SegFauna(id){const H=DV.segs[id];if(!H)return;DV2.seg=id;const r=mulberry32(700+swD().segs[id].k*7+(MODE==='roma'?3:0)),sy=swSeaY();
  const spot=(deep)=>{for(let t=0;t<20;t++){const lx=(r()-0.5)*SW.H*1.5,lz=(r()-0.5)*SW.H*1.5,y=H.h(lx,lz);if(sy-y>(deep||5))return{lx,lz,y};}return{lx:0,lz:0,y:H.h(0,0)};};
  for(const S of dv2Sp()){S.f=[];if(S.seas&&!S.seas.includes(id)){S.im.count=0;continue;}const per=Math.max(1,Math.floor(S.n/S.groups));
    for(let g=0;g<S.groups;g++){const p=spot(S.k==='atun'?20:S.bh==='static'?4:6),x=SW.X+p.lx,z=H.cz+p.lz;
      const c={x,z,ax:x,az:z,y:S.bh==='static'?p.y:Math.min(sy-2,p.y+(S.k==='atun'?10:S.bh==='drift'?8:2.5+r()*6)),vx:0,vz:0,ph:r()*6,sp:S.k==='atun'?5:S.bh==='solo'?0.6:1.2};
      for(let i=0;i<per;i++){const so=S.bh==='static';const ox=so?(r()-0.5)*(S.k==='erizo'||S.k==='estrella'?5:0.2):(r()-0.5)*(S.k==='atun'?10:6),oz=so?(r()-0.5)*(S.k==='erizo'||S.k==='estrella'?5:0.2):(r()-0.5)*(S.k==='atun'?10:6);
        S.f.push({c,ox,oy:so?0:(r()-0.5)*2,oz,ph:r()*6,x:c.x+ox,y:c.y,z:c.z+oz,a:r()*TAU});}
      const key=id+':'+S.k+':'+g;if(!DV2.regd.has(key)){DV2.regd.add(key);try{atReg(x,z,c.y+(S.bh==='static'?0.3:0),'fa_'+S.k,S.bh==='static'?3:7);}catch(e){}}}
    S.im.count=S.f.length;}}
function dv2FaunaTick(dt,show,uw){const sp=dv2Sp();for(const S of sp)S.im.visible=show&&S.f.length>0;if(!show)return;if(DV2.seg!==SW.seg)dv2SegFauna(SW.seg);
  const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),V=new THREE.Vector3(),Sc=new THREE.Vector3(),sy=swSeaY(),t=DV.t;
  for(const S of sp){if(!S.f.length)continue;const seen=new Set();
    S.f.forEach((f,i)=>{const c=f.c;
      if(S.bh!=='static'&&!seen.has(c)){seen.add(c);if(S.bh==='drift'){c.y=clamp(c.y+Math.sin(t*0.2+c.ph)*0.15*dt,dvBed(c.x,c.z)+2,sy-1.5);c.x+=Math.sin(t*0.05+c.ph)*0.2*dt;c.z+=Math.cos(t*0.04+c.ph)*0.2*dt;}
        else{const dx=c.x-player.x,dz=c.z-player.z,d=Math.hypot(dx,dz)||1,fear=uw&&d<(S.k==='atun'?20:12)&&Math.abs(c.y-player.camY)<8&&S.k!=='tortuga';const R2=S.bh==='solo'?10:S.k==='atun'?80:25;
          const tx=fear?c.x+dx/d*12:c.ax+Math.cos(t*0.1*(c.sp)+c.ph)*R2,tz=fear?c.z+dz/d*12:c.az+Math.sin(t*0.13*(c.sp)+c.ph)*R2,mx=fear?6:c.sp*(S.k==='atun'?2:1);
          c.vx+=((tx-c.x)*0.2-c.vx)*Math.min(1,dt*(fear?3:0.8));c.vz+=((tz-c.z)*0.2-c.vz)*Math.min(1,dt*(fear?3:0.8));const L=Math.hypot(c.vx,c.vz);if(L>mx){c.vx*=mx/L;c.vz*=mx/L;}c.x+=c.vx*dt;c.z+=c.vz*dt;c.y=clamp(c.y,dvBed(c.x,c.z)+1.2,sy-1.5);}}
      let rx=0,ry=f.a,rz=0;
      if(S.bh==='static'){if(f.y===c.y){f.x=c.x+f.ox;f.z=c.z+f.oz;f.y=dvBed(f.x,f.z)+(S.k==='caballito'?0.4:S.k==='morena'?0.15:0);}
        if(S.k==='morena')ry=f.a+Math.sin(t*0.8+f.ph)*0.3;else if(S.k==='pulpo')ry=f.a+Math.sin(t*0.3+f.ph)*0.4;else if(S.k==='caballito')rz=Math.sin(t+f.ph)*0.1;else if(S.k==='langosta')ry=f.a+Math.sin(t*0.2+f.ph)*0.2;
        if(S.k==='nacra')rx=0.25;}
      else{const nx=c.x+f.ox+Math.sin(t*0.7+f.ph)*0.8,ny=c.y+f.oy+Math.sin(t*2+f.ph)*0.2,nz=c.z+f.oz+Math.cos(t*0.6+f.ph)*0.8;const vx=nx-f.x,vz=nz-f.z;if(Math.abs(vx)+Math.abs(vz)>0.002)f.a=Math.atan2(vx,vz);f.x=nx;f.y=ny;f.z=nz;ry=f.a+(S.bh==='drift'?t*0.1:Math.sin(t*(S.k==='tortuga'?1.5:8)+f.ph)*0.1);
        if(S.k==='medusa'){const pu=1+Math.sin(t*2+f.ph)*0.12;Sc.set(pu,1/pu,pu);}}
      e.set(rx,ry,rz);q.setFromEuler(e);V.set(f.x,f.y,f.z);if(S.k!=='medusa'||S.bh!=='drift')Sc.set(S.s,S.s,S.s);m4.compose(V,q,Sc);S.im.setMatrixAt(i,m4);});
    S.im.instanceMatrix.needsUpdate=true;}}
// ---------------- solo se dibuja el tramo donde estás
function dv2Cull(){const on=BOAT.sea?SW.seg:null;if(DV2.cullK===on)return;DV2.cullK=on;for(const id in DV.segs){const H=DV.segs[id];for(const m of H.meshes||[])m.visible=id===on;}}
// ---------------- el portal de leyenda (una hora bajo el agua)
function dv2PortalSeg(){return MODE==='roma'?'siculum':'jonico';}
function dv2Portal(){if(DV2.portal||!dvz().portal)return;const seg=dv2PortalSeg(),H=DV.segs[seg];if(!H)return;const lx=-120,lz=-150,y=H.h(lx,lz),x=SW.X+lx,z=H.cz+lz,g=new THREE.Group();
  const ring=new THREE.Mesh(new THREE.TorusGeometry(3.2,0.45,10,40),new THREE.MeshLambertMaterial({color:'#2a6a8a',emissive:'#0a4a6a'}));ring.position.y=3.6;g.add(ring);
  const disc=new THREE.Mesh(new THREE.CircleGeometry(3,40),new THREE.MeshBasicMaterial({color:'#7ad8f0',transparent:true,opacity:0.45,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));disc.position.y=3.6;g.add(disc);
  for(let i=0;i<6;i++){const st=new THREE.Mesh(new THREE.DodecahedronGeometry(0.8,0),lam('#5a5a5a'));const a=i/6*TAU;st.position.set(Math.cos(a)*4.6,0.5,Math.sin(a)*1.8);g.add(st);}
  g.position.set(x,y,z);scene.add(g);DV2.portal={g,x,y,z,seg,disc};try{atReg(x,z,y+3.6,'uw_portal',8);}catch(e){}}
function dv2PortalUse(){vmS('◎','El portal del abismo','una puerta de leyenda en el fondo del mar','<p>El anillo de piedra zumba y el agua dentro gira como un remolino. Desde el otro lado llega un rumor grave, como de algo enorme que respira en la oscuridad.</p><p class="sub">Este portal llevará a enfrentarse a una criatura del mar. Todavía no está decidido cuál: de momento, el portal no se abre del todo.</p>',[vmBye]);}
// ---------------- el palacio de Poseidón (diez horas bajo el agua)
function dv2PalaceFind(){if(DV2.pal)return DV2.pal;const P=swD().palace;if(!P)return null;const cz=swSegZ(P.seg),x=SW.X+P.x,z=cz+P.z,y=SW.BED,L={x,y,z,parts:[],obj:null};
  for(const o of scene.children){if(Math.abs(o.position.x-x)<0.01&&Math.abs(o.position.z-z)<0.01&&Math.abs(o.position.y-y)<0.01&&o.type==='Group')L.parts.push(o);
    else if(o.type==='Group'&&Math.abs(o.position.y-(y+3))<0.01&&Math.hypot(o.position.x-x,o.position.z-z)<9&&o!==SW.bg)L.parts.push(o);}
  L.obj=SW.objs.find(o=>o.act==='sw:palacio');
  {const g=new THREE.Group();box(1.8,4.2,1.8,M.marble,0,2.1,0,g);box(2.4,0.4,2.4,M.marble,0,4.3,0,g);g.position.set(x,y,z+5);scene.add(g);L.altar=g;}
  DV2.pal=L;return L;}
function dv2PalaceVis(){const L=dv2PalaceFind();if(!L)return;const on=!!dvz().palace;for(const o of L.parts)o.visible=on;L.altar.visible=!on;
  const i=SW.objs.indexOf(L.obj);if(on&&L.obj&&i<0)SW.objs.push(L.obj);if(!on&&i>=0)SW.objs.splice(i,1);
  if(on&&!L.door){const g=new THREE.Group(),gold=M.gold;box(0.8,9,0.8,gold,-3.2,4.5,0,g);box(0.8,9,0.8,gold,3.2,4.5,0,g);box(7.6,1,1,gold,0,9.3,0,g);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(5.6,8.6),new THREE.MeshBasicMaterial({color:'#9af0ff',transparent:true,opacity:0.5,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));pl.position.y=4.4;g.add(pl);
    g.position.set(L.x,L.y,L.z+16);scene.add(g);L.door=g;L.doorPl=pl;try{atReg(L.x,L.z+16,L.y+4,'pal_puerta',8);}catch(e){}}}
function dv2PalaceEnter(){const P=swD().palace,I=dv2Interior();DV2.back={seg:P.seg,x:DV2.pal.x,z:DV2.pal.z+20};
  BOAT.on=false;BOAT.sea=false;SW.swim=false;swUnder(false);updateSky();
  egxTeleport(I.x,I.z+40,I.Y,0,'<span class="label">'+(MODE==='roma'?'El palacio de Neptuno':'El palacio de Poseidón')+'</span><br>Cruzas el umbral y el agua se queda atrás, como una cortina. Dentro se respira.');}
function dv2PalaceLeave(){const B=DV2.back;if(!B)return;closeDialog();Object.assign(BOAT,{on:true,sea:true,g:SW.bg});SW.seg=B.seg;SW.swim=true;const sy=swSeaY();player.x=B.x;player.z=B.z;
  SW.depth=Math.max(0,sy-1.45-(dvBed(B.x,B.z)+4));BOAT.y=sy-1.45-SW.depth;player.feet=BOAT.y;player.camY=player.feet+player.eye;DV.air=dvAirMax();curZone=null;toast('Vuelves al agua por la puerta del palacio. Te sientes con el aire lleno, como si Anfitrite te lo hubiera regalado.');}
// el interior: a 900 m de altura, fuera del corredor del mar
const DV2_INT={built:false};
function dv2Interior(){const I=DV2_INT;if(I.built)return I;I.built=true;const ro=MODE==='roma',X=SW.X+1500,Z=-20000,Y=900;Object.assign(I,{x:X,z:Z,Y});
  const em=(c,e)=>new THREE.MeshLambertMaterial({color:c,emissive:e||'#000000'});
  const mos=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#1f5a72';x.fillRect(0,0,w,h);for(let y=0;y<h;y+=32){x.strokeStyle='#e8e0c8';x.lineWidth=3;x.beginPath();for(let xx=0;xx<=w;xx+=4)x.lineTo(xx,y+16+Math.sin(xx*0.1)*8);x.stroke();}
    x.fillStyle='#e8d8a0';for(let i=0;i<4;i++){const cx=32+i*64,cy=32+(i%2)*128;x.beginPath();x.ellipse(cx,cy,22,9,0.3,0,TAU);x.fill();x.beginPath();x.moveTo(cx-20,cy);x.lineTo(cx-34,cy-10);x.lineTo(cx-34,cy+10);x.fill();}});mos.repeat.set(8,6);
  const nac=canvasTex(128,128,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#cfe8ea');g.addColorStop(0.5,'#e8d8f0');g.addColorStop(1,'#d0f0e0');x.fillStyle=g;x.fillRect(0,0,w,h);x.strokeStyle='rgba(120,140,160,0.25)';for(let i=0;i<30;i++){x.beginPath();x.arc(Math.random()*w,Math.random()*h,10+Math.random()*20,0,Math.PI);x.stroke();}});nac.repeat.set(6,2);
  const gold=em('#d8b050','#4a3410'),floor=new THREE.MeshLambertMaterial({map:mos,emissive:'#0a2028'}),wallM=new THREE.MeshLambertMaterial({map:nac,emissive:'#304848'}),blue=em('#2a5a7a','#0a2030');
  const g=grp(X,Y,Z,0),W=70,L=110,H=22;
  box(W,1,L,floor,0,-0.5,0,g);addPlat(X,Z,W,L,0,Y);
  for(const s of[-1,1]){box(1.5,H,L,wallM,s*W/2,H/2,0,g);addSeg(X+s*W/2,Z-L/2,X+s*W/2,Z+L/2,0.8);}
  box(W,H,1.5,wallM,0,H/2,-L/2,g);addSeg(X-W/2,Z-L/2,X+W/2,Z-L/2,0.8);
  for(const s of[-1,1]){box(W/2-6,H,1.5,wallM,s*(W/4+3),H/2,L/2,g);addSeg(X+s*6,Z+L/2,X+s*W/2,Z+L/2,0.8);}
  box(W+2,1.5,L+2,blue,0,H+0.7,0,g);
  {const sky=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#16405a';x.fillRect(0,0,w,h);x.fillStyle='#e8c860';for(let i=0;i<20;i++){x.beginPath();x.arc(Math.random()*w,Math.random()*h,1.5+Math.random()*2,0,TAU);x.fill();}});sky.repeat.set(6,9);
   const c=new THREE.Mesh(new THREE.PlaneGeometry(W,L),new THREE.MeshLambertMaterial({map:sky,emissive:'#102838',side:THREE.DoubleSide}));c.rotation.x=Math.PI/2;c.position.set(0,H-0.1,0);g.add(c);}
  // columnas de oro con capiteles de conchas
  for(let i=0;i<9;i++)for(const s of[-1,1]){const cz=-L/2+12+i*11,cx=s*(W/2-10);const c=new THREE.Mesh(new THREE.CylinderGeometry(1,1.15,H-2,16),gold);c.position.set(cx,(H-2)/2,cz);g.add(c);const k=new THREE.Mesh(new THREE.SphereGeometry(1.8,12,6,0,TAU,0,Math.PI/2),em('#f0e8d8','#403830'));k.scale.y=0.6;k.position.set(cx,H-2,cz);k.rotation.x=Math.PI;g.add(k);addCirc(X+cx,Z+cz,1.2);}
  // el estrado con los tronos de Poseidón y Anfitrite
  {box(30,1.6,12,gold,0,0.8,-L/2+10,g);addPlat(X,Z-L/2+10,30,12,0,Y+1.6);for(let i=0;i<3;i++)box(30,0.5,1.2,gold,0,0.25+i*0.5,-L/2+16.4+i*1.1,g);
   for(const[dx,who]of[[-5,ro?'Neptuno':'Poseidón'],[5,ro?'Salacia (Anfitrite)':'Anfitrite']]){box(4,5,3,gold,dx,1.6+2.5,-L/2+7,g);box(4,1,3.5,gold,dx,1.6+1.5,-L/2+9,g);
     const p=makePerson(dx<0?{chiton:'#2a5a8a',himation:'#d8b050',hair:'#e8e8e8',beard:true}:{female:true,chiton:'#e8e0f0',himation:'#3a8a9a',hair:'#3a2a1e'});p.scale.setScalar(2.2);p.position.set(X+dx,Y+1.6+0.6,Z-L/2+9.3);p.rotation.y=0;scene.add(p);
     if(dx<0){const tr=new THREE.Group();const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,7,6),gold);sh.position.y=3.5;tr.add(sh);for(const o of[-0.45,0,0.45]){const pr=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.9,4),gold);pr.position.set(o,7.3,0);tr.add(pr);}const bar=new THREE.Mesh(new THREE.BoxGeometry(1,0.12,0.12),gold);bar.position.y=6.85;tr.add(bar);tr.position.set(X+dx+2.4,Y+1.6,Z-L/2+9.8);scene.add(tr);}}
   I.objs=[egxObj(X+5,Z-L/2+14,Y+1.6,()=>dv2Amphitrite(),ro?'Salacia (Anfitrite)':'Anfitrite','la reina del mar',4),egxObj(X-5,Z-L/2+14,Y+1.6,()=>vmS('Π',ro?'Neptuno':'Poseidón',ro?'el señor del mar':'el que sacude la tierra','<p>'+(ro?'Neptuno':'Poseidón')+' no habla: te mira desde el trono, con el tridente apoyado a su lado. Cuando mueve la cabeza, retumba el suelo.</p><p class="sub">'+(ro?'En Roma, Neptuno era al principio un dios del agua dulce; al identificarse con Poseidón, se convirtió en el señor del mar.':'Para los griegos, Poseidón es también el dios de los terremotos y de los caballos: «el que sacude la tierra».')+'</p>',[vmBye]),ro?'Neptuno':'Poseidón','en su trono',4)];}
  // el carro: caballos de cascos de bronce y crines de oro (Ilíada XIII 23-26)
  {const cx=-20,cz=10,c=new THREE.Group();box(3,1.6,2.4,gold,0,1.4,0,c);const wh=new THREE.Mesh(new THREE.TorusGeometry(1,0.12,6,16),gold);wh.rotation.y=Math.PI/2;wh.position.set(0,1,1.2);c.add(wh);const wh2=wh.clone();wh2.position.z=-1.2;c.add(wh2);box(0.2,0.2,5,gold,0,1.2,3.6,c);c.position.set(X+cx,Y,Z+cz);c.rotation.y=Math.PI;scene.add(c);addBox(X+cx,Z+cz,3,4,0);
   for(const s of[-1,1]){const h=grp(X+cx+s*1.2,Y,Z+cz-6,Math.PI);if(typeof GLB!=='undefined'&&GLB.ok&&typeof animalGLB==='function')animalGLB('A_horse',h,'#d8b050','#f0d070');else{box(1,1.2,2.6,gold,0,1.6,0,h);box(0.5,1.2,0.8,gold,0,2.4,1.5,h);}addCirc(X+cx+s*1.2,Z+cz-6,1);}
   I.objs.push(egxObj(X+cx+3,Z+cz,Y,()=>vmS('🐎','El carro del dios','con caballos de cascos de bronce','<p>Homero cuenta que Poseidón tiene su palacio en las profundidades del mar, en Egas, «de oro, brillante, eterno». Allí unce a su carro dos caballos de cascos de bronce y crines de oro, se viste de oro, toma el látigo y parte sobre las olas; los monstruos del mar saltan a su alrededor, y el mar se abre con alegría.</p><p class="src">Ilíada XIII 21-31</p>',[vmBye]),'El carro de oro','con los caballos del dios',4));}
  // las nereidas que bailan en corro alrededor de la fuente de los delfines (Baquílides 17)
  {const fx=0,fz=8;const pool=new THREE.Mesh(new THREE.CylinderGeometry(7,7.5,0.8,32),gold);pool.position.set(X+fx,Y+0.4,Z+fz);scene.add(pool);const w=new THREE.Mesh(new THREE.CircleGeometry(6.6,32),new THREE.MeshLambertMaterial({color:'#4fb0c8',emissive:'#0a3040'}));w.rotation.x=-Math.PI/2;w.position.set(X+fx,Y+0.85,Z+fz);scene.add(w);addCirc(X+fx,Z+fz,7.4);
   for(let i=0;i<3;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(0.5,10,8),gold);d.scale.set(0.6,0.6,2);const a=i/3*TAU;d.position.set(X+fx+Math.cos(a)*1.4,Y+2.4,Z+fz+Math.sin(a)*1.4);d.rotation.set(-0.9,-a,0);scene.add(d);}
   I.ner=[];const cols=['#8ac8d8','#d8a8c8','#a8d8b8','#e8d8a8','#b8b8e8','#e8b8a8','#a8e0e0','#d0c0e8','#c8e8a8','#e8c8d8'];for(let i=0;i<10;i++){const p=makePerson({female:true,chiton:cols[i],himation:'#f0f0f0',hair:i%2?'#3a2a1e':'#8a5a2a'});scene.add(p);I.ner.push(p);}
   I.objs.push(egxObj(X+fx,Z+fz+8.5,Y,()=>vmS('💃','Las nereidas','las cincuenta hijas de Nereo','<p>En corro, con los pies como el agua, bailan las hijas de Nereo. Baquílides cuenta que Teseo bajó al fondo del mar para demostrar que era hijo de Poseidón, y vio a las nereidas bailar en el palacio, con cintas de oro en el pelo; Anfitrite lo vistió con un manto de púrpura y le puso en la cabeza una corona de rosas, y Teseo salió del mar seco, ante los ojos asombrados de los atenienses.</p><p class="src">Baquílides, Ditirambo 17 (Teseo); Hesíodo, Teogonía 240-264 (los nombres de las nereidas)</p>',[vmBye]),'Las nereidas','bailan en corro',5));
   I.fx=fx;I.fz=fz;}
  // los tesoros del mar, en nichos
  {const items=[['Coral','#d8503a'],['Perlas','#f0f0ea'],['Ámbar','#d89030'],['Púrpura','#7a2a6a'],['Oro de los naufragios','#e8c050'],['Nácar','#e8e0f0']];
   items.forEach(([n,c],i)=>{const s=i<3?-1:1,cz=-20+(i%3)*14,x=s*(W/2-2.5);box(3,4,4,blue,x,2,cz,g);const o=new THREE.Mesh(new THREE.DodecahedronGeometry(0.7,0),em(c,c));o.position.set(X+x,Y+4.7,Z+cz);scene.add(o);});
   I.objs.push(egxObj(X-W/2+5,Z-6,Y,()=>vmS('💎','Los tesoros del mar','en nichos de nácar','<p>En los nichos de las paredes, los regalos del mar: coral de Sicilia, perlas del océano Índico, ámbar que las olas traen del norte, conchas de púrpura de Tiro, oro de los barcos hundidos.</p>',[vmBye]),'Los tesoros del mar','en las paredes',4));}
  // lámparas y la salida
  for(let i=0;i<8;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,color:'#9af0ff'}));sp.scale.set(3,4,1);sp.position.set(X+(i%2?1:-1)*(W/2-4),Y+9,Z-L/2+15+Math.floor(i/2)*25);scene.add(sp);}
  {const door=new THREE.Mesh(new THREE.PlaneGeometry(11,15),new THREE.MeshBasicMaterial({color:'#9af0ff',transparent:true,opacity:0.5,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));door.position.set(X,Y+7.5,Z+L/2);scene.add(door);box(16,18,1,new THREE.MeshBasicMaterial({color:'#2a7aa0'}),0,9,L/2+3,g);
   I.objs.push(egxObj(X,Z+L/2-3,Y,()=>dv2PalaceLeave(),'Volver al mar','la puerta del palacio',4));}
  for(const[k,dx,dz]of[['pal_trono',0,-L/2+10],['pal_carro',-20,10],['pal_nereidas',0,8],['pal_tesoros',-W/2+3,-6]])try{atReg(X+dx,Z+dz,Y+2,k,8);}catch(e){}
  return I;}
function dv2Amphitrite(){const ro=MODE==='roma',z=dvz();vmS('Α',ro?'Salacia (Anfitrite)':'Anfitrite','la reina del mar','<p>«Bienvenido a la casa de mi esposo. Pocos mortales han llegado hasta aquí: Teseo, que venía a demostrar quién era su padre, y ahora tú, que has pasado tanto tiempo en nuestras aguas que ya te conocen todos los peces».</p>'+(z.palGift?'':'<p>Te pone sobre los hombros un manto de púrpura, como a Teseo.</p>'),
  [z.palGift?['¿Quién eres?',()=>vmS('Α','Anfitrite','nereida, hija de Nereo','<p>«Soy una de las hijas de Nereo. Cuando '+(ro?'Neptuno':'Poseidón')+' quiso casarse conmigo me escondí junto a Atlas, en el extremo del mundo; un delfín me encontró y me convenció de volver. Por eso el delfín está entre las estrellas».</p><p class="src">Higino, Astronomía II 17; Hesíodo, Teogonía 930</p>',[vmBye])]:['Aceptar el manto',()=>{z.palGift=1;save();closeDialog();toast('<span class="label">El manto de púrpura</span><br>Como Teseo en el poema de Baquílides. Desde hoy aguantas 10 segundos más bajo el agua.');}],vmBye]);}
{const f=dvAirMax;dvAirMax=function(){return f()+(dvz().palGift?10:0);};}
// el corro de las nereidas gira
function dv2InteriorTick(dt){const I=DV2_INT;if(!I.built||!I.ner)return;if(Math.hypot(player.x-I.x,player.z-I.z)>200)return;const t=DV.t||0;I.ner.forEach((p,i)=>{const a=t*0.4+i/I.ner.length*TAU;p.position.set(I.x+I.fx+Math.cos(a)*9.5,I.Y+Math.abs(Math.sin(t*3+i))*0.25,I.z+I.fz+Math.sin(a)*9.5);p.rotation.y=-a;});}
// ---------------- la Atlántida (modo Roma, más allá de las Columnas de Hércules)
function dv2Atlantis(){if(MODE!=='roma'||!SW.uw||SW.seg!=='oceanus'||DV2.said.atl)return;const z=dvz();DV2.said.atl=1;if(z.atl)return;z.atl=1;save();
  vmS('🌊','Más allá de las Columnas','donde Platón situó la Atlántida','<p>Por aquí, más allá de las Columnas de Hércules, decía Platón que había existido una isla mayor que Libia y Asia juntas, la Atlántida, cuyos reyes dominaban media Europa y África. Quisieron conquistar el resto, y Atenas los venció. Después, en un solo día y una noche terribles, hubo terremotos e inundaciones y la isla se hundió en el mar; por eso, decía, el océano de aquí no se puede navegar, por el barro que dejó la isla al hundirse, poco por debajo de la superficie.</p><p>Platón dice que la historia la contaron los sacerdotes de Sais, en Egipto, a Solón. Ya en la Antigüedad se discutía: Estrabón recuerda que, según Aristóteles, «el que la inventó la hizo desaparecer».</p><p class="sub">Hoy se piensa que la Atlántida es un mito inventado por Platón para su filosofía; no hay restos en el fondo del océano.</p><p class="src">Platón, Timeo 24e-25d, y Critias 108e-121c; Estrabón II 3.6 y XIII 1.36</p>',[vmBye]);
  try{atReg(player.x,player.z,player.camY,'uw_atlantis',30);}catch(e){}}
// ---------------- el bucle: segundos bajo el agua, inmersiones, hitos
function dv2Tick(dt){if(!DV.built||!swD())return;const z=dvz(),sy=swSeaY(),under=BOAT.sea&&SW.swim&&player.camY<sy-0.1;dv2Cull();
  if(under){z.uwT=(z.uwT||0)+dt;DV2.subT+=dt;DV2.saveT+=dt;if(DV2.saveT>10){DV2.saveT=0;save();}}
  else if(DV2.subT>0){if(DV2.subT>=3){z.dives=(z.dives||0)+1;save();if(z.dives===3)toast('<span class="label">Los pulmones se acostumbran</span><br>Tras tres inmersiones ya aguantas 40 segundos. Cuanto más tiempo pases bajo el agua, más aguantarás.');}DV2.subT=0;}
  if((z.uwT||0)>=3600&&!z.portal){z.portal=1;save();toast('<span class="label">Una hora bajo el agua</span><br>Has pasado una hora entera bajo el mar. En el '+swD().segs[dv2PortalSeg()].name+' se ha despertado algo: un anillo de piedra brilla en el fondo.');}
  if(z.portal)dv2Portal();if(DV2.portal){DV2.portal.g.visible=BOAT.sea&&SW.seg===DV2.portal.seg;DV2.portal.disc.rotation.z=(DV.t||0)*0.6;DV2.portal.disc.material.opacity=0.35+Math.sin((DV.t||0)*2)*0.12;}
  if((z.uwT||0)>=36000&&!z.palace){z.palace=1;save();toast('<span class="label">Diez horas bajo el mar</span><br>El mar ya te tiene por uno de los suyos. En '+swD().segs[swD().palace.seg].name+', donde había un altar, ahora brilla un palacio de oro.');}
  dv2PalaceVis();if(DV2.pal&&DV2.pal.doorPl)DV2.pal.doorPl.material.opacity=0.35+Math.sin((DV.t||0)*1.5)*0.12;
  dv2FaunaTick(dt,BOAT.sea&&SW.seg&&(SW.uw||SW.swim),SW.uw);dv2Atlantis();}
function dv2Built(){dv2Sp();dv2PalaceVis();}
{const tk0=swTick;swTick=function(dt){tk0(dt);try{dv2Tick(dt);}catch(e){if(!DV2.err){DV2.err=1;console.warn('buceo2',e);}}};}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{dv2InteriorTick(dt);}catch(e){}return r;};}
// acciones bajo el agua: el portal y la puerta del palacio
{const a0=swAction;swAction=function(){const a=a0.apply(this,arguments);if(BOAT.sea&&SW.swim&&SW.uw){const P=DV2.portal;if(P&&SW.seg===P.seg&&Math.hypot(player.x-P.x,player.z-P.z)<6)return['Entrar en el portal',dv2PortalUse];
    const L=DV2.pal;if(L&&L.door&&dvz().palace&&SW.seg===swD().palace.seg&&Math.hypot(player.x-L.x,player.z-(L.z+16))<7)return['Entrar en el palacio',dv2PalaceEnter];}return a;};}
// el indicador: el total bajo el agua y las inmersiones
{const h0=dvHud;dvHud=function(){h0();const H=$('dvHud');if(!H||!H.innerHTML||!(BOAT.sea&&SW.seg))return;const z=dvz(),k=Math.floor(z.uwT||0)+'|'+(z.dives||0)+'|'+dvAirMax();if(H.dataset.k2===k&&H.querySelector('.tot'))return;H.dataset.k2=k;
  const old=H.querySelector('.tot');if(old)old.remove();const d=document.createElement('div');d.className='tot';
  const next=(z.uwT||0)<3600?' · portal a la hora':(z.uwT||0)<36000?' · palacio a las 10 h':'';d.innerHTML='<small>Bajo el agua en total: '+dvFmt(z.uwT)+' · '+(z.dives||0)+' inmersiones · aguantas '+dvAirMax()+' s'+next+'</small>';H.appendChild(d);};}
// Modo Atención: la fauna y el palacio
Object.assign(ATX_DEF,{
 fa_salpa:ATX_DEF.uw_salpa,fa_dorada:ATX_DEF.uw_dorada,fa_mero:ATX_DEF.uw_mero,fa_pulpo:ATX_DEF.uw_pulpo,
 fa_sargo:['Sargos','peces de rayas negras','Aristóteles dice que los sargos se aparean dos veces al año y que se alimentan de algas y de lo que remueven en la arena.','Opiano cuenta que el sargo es tan amigo de las cabras que los pescadores se disfrazan con pieles de cabra para atraerlo.',0.5,30],
 fa_castanuela:['Castañuelas','pececillos de azul oscuro','Pequeños y numerosos, nadan en nubes sobre las rocas. De jóvenes son de un azul eléctrico.','Pequeños y numerosos, nadan en nubes sobre las rocas. De jóvenes son de un azul eléctrico.',0.4,25],
 fa_boga:['Bogas','peces de banco','Aristóteles las cita entre los peces que andan en grandes bancos cerca de la costa.','Pescado barato, para salar.',0.4,25],
 fa_mujol:['Mújoles','peces de las desembocaduras','Aristóteles dice que el mújol no come carne y que entra en los ríos y las lagunas.','En los estanques de las villas se crían mújoles; Plinio cuenta que en Nemausus los delfines ayudan a pescarlos (IX 29-32).',0.5,30],
 fa_atun:['Atunes','grandes nadadores','Aristóteles cuenta que los atunes entran en el Ponto en primavera para desovar y salen en otoño; en Bizancio los pescan desde atalayas.','En Sicilia y en Gades se pescan con almadrabas; de su carne salada y de sus vísceras se hace salsa. Plinio dice que algunos pesan más de quince talentos.',0.8,50],
 fa_escaro:['Escaros','el pez que rumia','Aristóteles dice que el escaro es el único pez que rumia como las vacas. Abunda en Creta.','Plinio cuenta que Optato, almirante del emperador Claudio, trajo escaros vivos de Creta y los soltó en las costas de Italia, y que durante cinco años se devolvían al mar los que se pescaban (IX 62).',0.5,30],
 fa_sepia:['Una sepia','tinta en el agua','Cuando tiene miedo, suelta su tinta para enturbiar el agua y escapar, dice Aristóteles. Con la tinta, dicen, se puede escribir.','Persio dice que con la tinta de sepia se escribe; Plinio cuenta que su tinta es tan negra que puede teñir.',0.4,15],
 fa_tortuga:['Una tortuga boba','tortuga de mar','Aristóteles dice que la tortuga de mar pone sus huevos en la arena de la playa y los entierra.','Con su caparazón se hacen incrustaciones de lujo en los muebles; Plinio dice que Carvilio Polión fue el primero en usarlo así.',0.6,30],
 fa_medusa:['Medusas','las «ortigas de mar»','Aristóteles las llama ortigas de mar (akaléphai): pican como la ortiga, se pegan a las rocas o nadan libres, y no se sabe si son plantas o animales.','Plinio las llama pulmones de mar: dicen que, si se frota un palo con ellas, brilla en la oscuridad.',0.6,20],
 fa_morena:['Una morena','en su agujero','Aristóteles dice que es muy voraz y que muerde hasta a otros peces de su especie.','Los ricos romanos crían morenas en estanques. Vedio Polión, amigo de Augusto, quiso echar a sus morenas a un esclavo que había roto una copa; Augusto se lo impidió (Séneca, Sobre la ira III 40).',0.3,15],
 fa_langosta:['Una langosta','con sus antenas largas','Aristóteles la llama kárabos y la distingue del bogavante; dice que pelea con el pulpo y pierde.','Plinio cuenta que los romanos las comen hervidas; es un plato caro.',0.2,12],
 fa_torpedo:['Un torpedo','un pez que adormece','Aristóteles cuenta que el torpedo se esconde en la arena y adormece a los peces que pasan por encima antes de comérselos.','Plinio dice que su poder entumece el brazo del pescador a través de la caña; los médicos lo ponen sobre la cabeza de los enfermos de dolores.',0.1,12],
 fa_estrella:['Estrellas de mar','cinco brazos','Aristóteles dice que la estrella de mar es tan caliente que lo que coge se le cuece: por eso destruye las ostras.','Plinio repite que la estrella de mar quema lo que toca.',0.1,10],
 fa_erizo:['Erizos','bolas de púas','Aristóteles describe su boca de cinco dientes, como una linterna (hoy se llama «linterna de Aristóteles»), y dice que sus huevos se comen.','Los erizos crudos con vinagre y miel son un entrante de las cenas romanas.',0.1,10],
 fa_caballito:['Un caballito de mar','entre la posidonia','Pequeño, con cabeza de caballo, se agarra a la hierba con la cola.','Plinio lo llama hipocampo y dice que su ceniza cura males; en las pinturas, los hipocampos gigantes tiran del carro de Neptuno.',0.2,8],
 fa_nacra:['Una nacra','la gran concha clavada en la arena','Aristóteles cuenta que vive clavada en la arena con un cangrejito que la avisa cuando entra la presa.','Con los hilos que la sujetan al fondo se teje la «seda del mar», muy rara y cara.',0.3,10],
 uw_portal:['El portal del abismo','un anillo de piedra en el fondo','Un portal de leyenda: lleva a enfrentarse a una criatura del mar.','Un portal de leyenda: lleva a enfrentarse a una criatura del mar.',3.6,30],
 uw_atlantis:['El mar de la Atlántida','más allá de las Columnas','Platón la situó aquí; dijo que se hundió en un día y una noche.','Platón la situó aquí; dijo que se hundió en un día y una noche.',0,60],
 pal_puerta:['La puerta del palacio','un portal de oro','La entrada del palacio del dios del mar.','La entrada del palacio del dios del mar.',4,30],
 pal_trono:['Los tronos','del señor del mar y de su esposa','Poseidón y Anfitrite, sentados en oro.','Neptuno y Salacia, que los romanos identifican con Poseidón y Anfitrite.',3,30],
 pal_carro:['El carro de oro','Ilíada XIII','Dos caballos de cascos de bronce y crines de oro.','Dos caballos de cascos de bronce y crines de oro.',2,30],
 pal_nereidas:['El corro de las nereidas','Baquílides 17','Las hijas de Nereo bailan con los pies como el agua.','Las hijas de Nereo bailan con los pies como el agua.',2,30],
 pal_tesoros:['Los tesoros del mar','coral, perlas, ámbar','Los regalos del mar, en nichos de nácar.','Los regalos del mar, en nichos de nácar.',4,20]});
// dentro del palacio no se anuncian las zonas de tierra que hay debajo (a 900 m de altura, sobre el mar entre dos destinos)
{const ck=checkZone;checkZone=function(){const I=DV2_INT;if(I.built&&player.feet>800&&Math.abs(player.x-I.x)<120&&Math.abs(player.z-I.z)<120)return;return ck.apply(this,arguments);};}
