// ============================================================ EL BUCEO, MEJORADO: 20 PROPUESTAS (28/11)
// Antes: fondo llano a −38 m con niebla turquesa, posidonia de cajas, ninguna vida, 30 s de aire y tres ánforas por pecio.
// Jugabilidad: la piedra de lastre (G) y el aceite en la boca (O) de los buceadores de esponjas; aire y presión en los oídos; esponjas,
// múrex y coral para vender; los urinatores de Ostia (en el 80) y Escilias de Escione (en el 386) con sus pruebas; pecios con historia y
// con hallazgos en la arena; Hélice (en el 386, aún en pie; en el 80, ruinas bajo el agua) y el naufragio de Anticitera (en el 80);
// los odres de Esfacteria; corrientes, frío y el perro de mar; la campana de buceo (B); y todo cuenta para el Modo Atención.
// Gráficos: fondo con relieve, dunas y rocas que sube hacia las islas; praderas de posidonia que se mecen; bancos de peces que huyen;
// luz del sol ondulando en el fondo y rayos desde la superficie; color y visibilidad según la profundidad; el círculo de luz de la
// superficie vista desde abajo; partículas, burbujas y nubes de arena; pecios con cuadernas y montones de ánforas; latido y oídos.
// Coste: cada tramo, unas pocas mallas instanciadas o fundidas; peces, partículas y rayos solo existen cerca del jugador, bajo el agua.
// Fuentes: Opiano, Haliéutica V 612-674 (los esponjeros: la piedra, el aceite, el perro de mar); Plinio II 234 (el aceite), IX 125-151
// (púrpura, esponjas y perros de mar), XXXII 21-24 (coral); Aristóteles, Historia de los animales V 16, y Problemas XXXII (los oídos;
// la caldera para respirar, XXXII 5, atribuido); Tucídides IV 26 (Esfacteria); Heródoto VIII 8 (Escilias); Pausanias VII 24.12 y
// Estrabón VIII 7.2 (Hélice); CIL VI 1872 y XIV 303 (los urinatores de Ostia); J.-C. Golvin, Ciudades del mundo antiguo, p. 123.
const DV={built:false,segs:{},air:30,stone:false,useStone:true,oilT:0,earP:0,earHurt:0,still:0,lastDepth:0,bellOn:null,fish:[],fishSeg:null,
  hb:0,bub:[],puff:[],t:0,test:null,mis:null,dogs:[],cur:[],hud:'',picks:[],digs:[],wrecks:[]};
const mr=(a,b)=>a+Math.random()*(b-a),mpick=L=>L[Math.floor(Math.random()*L.length)];   // azar de juego, sin tocar el generador con semilla del mundo
function dvz(){const z=sw2z();z.dv=z.dv||{};const d=z.dv;d.inv=d.inv||{sp:0,mu:0,co:0,cg:0};d.oil=d.oil===undefined?3:d.oil;d.airMax=d.airMax||30;d.pick=d.pick||{};d.find=d.find||{};d.esc=d.esc||{};d.bell=d.bell||0;d.done=d.done||{};return d;}
// ---------------- datos por mar
const DV_SEA={
 atenas:{sp:['saronico','cicladas','icario','cretico','egeonorte'],co:['jonico'],dog:['cretico','jonico','ponto'],
  cargo:{saronico:['vino de Quíos','ánforas de cuello ancho con la esfinge de Quíos estampada'],cicladas:['mármol de Paros','bloques de mármol blanco y ánforas de vino'],cretico:['aceite de Creta','jarras de aceite y cerámica pintada'],icario:['vino de Samos','ánforas samias'],
   corintio:['cerámica de Corinto','vasos y tejas de Corinto'],jonico:['trigo de Sicilia','sacos podridos y ánforas de vino de Sicilia'],egeonorte:['madera y pez de Macedonia','troncos para remos y jarras de pez'],helesponto:['trigo del Ponto','ánforas de trigo'],ponto:['pescado salado','jarras de pescado en salazón'],colquide:['lino y miel','jarras de miel']}},
 roma:{sp:['aegaeum','syria'],co:['siculum','sardum','tyrrn','eolias','fretum','crater'],dog:['siculum','africum','oceanus','aegaeum'],
  cargo:{ostia:['trigo de Egipto','sacos de trigo y jarras'],tyrrn:['vino de Etruria','ánforas de vino'],crater:['vino de Campania','ánforas campanas'],eolias:['alumbre de Lípari','bloques de alumbre'],ionium:['aceite de Apulia','ánforas apulias'],adriaticum:['vino de Istria','ánforas'],
   siculum:['trigo de Sicilia','ánforas y sacos'],aegaeum:['estatuas de bronce y mármol','piezas de arte para las villas de Roma'],syria:['vidrio de Sidón','cajas de vasos de vidrio'],oceanus:['salazón de Gades','ánforas de garum'],pontus:['pescado del Ponto','jarras de salazón'],
   fretum:['vino de Mesina','ánforas'],africum:['aceite de África','ánforas africanas'],aegyptium:['trigo y papiro','sacos y rollos'],sardum:['plomo y trigo de Cerdeña','lingotes de plomo'],baleares:['vino de la Tarraconense','ánforas'],gaditanum:['garum de Gades','ánforas de garum']}}};
const DV_FINDS=['una lucerna de barro','un puñado de monedas','un plato de barniz negro','unas pesas de red de plomo','un cepo de ancla de plomo','una estatuilla de bronce','un anillo con un sello','unos dados de hueso','una jarrita de perfume','un cuenco con restos de pez'];
// ---------------- relieve del fondo
function dvSegOf(x,z){if(!swD())return null;const S=swD().segs;for(const id in S){const cz=swSegZ(id);if(Math.abs(z-cz)<SW.DZ/2&&Math.abs(x-SW.X)<SW.H+300)return id;}return null;}
function dvBed(x,z){const id=dvSegOf(x,z);if(!id)return SW.BED;const G=DV.segs[id];return G?G.h(x-SW.X,z-swSegZ(id)):SW.BED;}
function dvMakeH(id){const D=swD(),S=D.segs[id],cz=swSegZ(id),sy=swSeaY(),k=S.k+(MODE==='roma'?50:0),keep=[];
  const kp=(lx,lz,r)=>keep.push([lx,lz,r||16]);
  if(S.wreck)kp(S.wreck.x,S.wreck.z,22);
  {let lx=((S.k*137+60)%480)-240,lz=((S.k*271+130)%480)-240;for(let t=0;t<8;t++){let bad=false;for(const I of S.isl){if(Math.hypot((lx-I.x)/I.rx,(lz-I.z)/I.rz)<1.4)bad=true;}if(!bad)break;lx=(lx+170)%480-240;lz=(lz+110)%480-240;}kp(lx,lz,20);}
  if(D.palace&&D.palace.seg===id)kp(D.palace.x,D.palace.z,40);
  const AF=typeof SW_AF!=='undefined'&&SW_AF[MODE];if(AF)for(const n in AF.items){const it=AF.items[n];if(it[0]===id&&it[3])kp(it[1],it[2],10);}
  for(const o of SW.objs||[])if(o.y!==undefined&&o.y<sy-5&&Math.abs(o.z-cz)<SW.DZ/2)kp(o.x-SW.X,o.z-cz,14);
  const isl=S.isl;
  const h=(lx,lz)=>{const n1=fbm((lx+k*997)*0.006,(lz-k*613)*0.006),n2=vnoise((lx+k*31)*0.02,(lz+k*17)*0.02),dune=Math.sin(lx*0.09+Math.sin(lz*0.03)*2)*0.5+0.5;
    let hu=Math.max(0,n1-0.42)*42+dune*0.9+n2*1.2;
    if(n1>0.62)hu+=(n1-0.62)*60;   // crestas de roca
    let y=SW.BED+hu;
    for(const I of isl){const q=Math.hypot((lx-I.x)/I.rx,(lz-I.z)/I.rz);if(q<2.4){const top=sy-(I.rock?4:3),t=clamp(1-(q-1)/1.4,0,1);y=Math.max(y,lerp(y,top,t*t*(3-2*t)));}}
    for(const[a,b,r]of keep){const d=Math.hypot(lx-a,lz-b);if(d<r*2){const t=clamp((d-r)/r,0,1);y=lerp(SW.BED,y,t*t);}}
    return Math.min(y,sy-1.2);};
  return{h,keep,cz};}
// textura de arena con ondas
function dvSandTex(){return canvasTex(256,256,(x,w,h)=>{x.fillStyle='#cdb98e';x.fillRect(0,0,w,h);const r=mulberry32(7);for(let i=0;i<4000;i++){x.fillStyle='rgba('+(r()<0.5?'255,245,220':'90,70,40')+','+(0.05+r()*0.08)+')';x.fillRect(r()*w,r()*h,1+r()*2,1);}
  x.strokeStyle='rgba(120,95,60,0.22)';x.lineWidth=3;for(let y=0;y<h;y+=16){x.beginPath();for(let xx=0;xx<=w;xx+=8)x.lineTo(xx,y+Math.sin(xx*0.05+y)*4);x.stroke();}});}
// material del fondo: arena y roca por color de vértice, y la luz del sol que ondula (cáusticas) solo bajo el agua
const DVU={t:{value:0},sea:{value:-2.2},on:{value:0}};
function dvCausticMat(base){const prev=base.onBeforeCompile,pk=base.customProgramCacheKey?base.customProgramCacheKey.bind(base):null;base.onBeforeCompile=function(sh,r){if(prev)prev.call(this,sh,r);sh.uniforms.dvT=DVU.t;sh.uniforms.dvSea=DVU.sea;sh.uniforms.dvOn=DVU.on;
    sh.vertexShader='varying vec3 vDvW;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\n#ifdef USE_INSTANCING\nvDvW=(modelMatrix*instanceMatrix*vec4(transformed,1.0)).xyz;\n#else\nvDvW=(modelMatrix*vec4(transformed,1.0)).xyz;\n#endif');
    sh.fragmentShader='uniform float dvT;uniform float dvSea;uniform float dvOn;varying vec3 vDvW;\nfloat dvC(vec2 p){p*=0.32;float t=dvT*0.6;vec2 q=p+vec2(sin(p.y*1.7+t),cos(p.x*1.3-t*0.8));float a=abs(sin(q.x*2.1+t)+sin(q.y*2.3-t*1.1)+sin((q.x+q.y)*1.6+t*0.7));return pow(clamp(1.0-a*0.55,0.0,1.0),3.0);}\n'+
      sh.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\nif(dvOn>0.5){float dd=clamp((dvSea-vDvW.y)/40.0,0.0,1.0);gl_FragColor.rgb+=vec3(0.55,0.75,0.7)*dvC(vDvW.xz)*(1.0-dd)*0.55;gl_FragColor.rgb=mix(gl_FragColor.rgb,gl_FragColor.rgb*vec3(0.7,0.92,1.0),dd);}');};
  base.customProgramCacheKey=()=>'dvC'+(pk?pk():'');return base;}
let DV_M=null;
function dvMats(){if(DV_M)return DV_M;const sand=dvSandTex();sand.repeat.set(1,1);
  DV_M={bed:dvCausticMat(new THREE.MeshLambertMaterial({map:sand,vertexColors:true})),rock:dvCausticMat(new THREE.MeshLambertMaterial({color:'#8a8274',vertexColors:false})),
    pos:dvCausticMat(windMat(new THREE.MeshLambertMaterial({color:'#4f7a3a',side:THREE.DoubleSide}))),sp:dvCausticMat(new THREE.MeshLambertMaterial({color:'#c9a25a'})),mu:dvCausticMat(new THREE.MeshLambertMaterial({color:'#9a7a6a'})),
    co:dvCausticMat(new THREE.MeshLambertMaterial({color:'#d8503a',emissive:'#301008'})),wood:dvCausticMat(new THREE.MeshLambertMaterial({color:'#3e3022'})),amph:dvCausticMat(new THREE.MeshLambertMaterial({color:'#b0643c'})),
    stone:dvCausticMat(new THREE.MeshLambertMaterial({color:'#bdb6a2'})),dig:dvCausticMat(new THREE.MeshLambertMaterial({color:'#d8c49a'}))};
  return DV_M;}
const dvInst=(geo,mat,list,scale)=>{if(!list.length)return null;const im=new THREE.InstancedMesh(geo,mat,list.length),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
  list.forEach((p,i)=>{e.set(p.rx||0,p.ry||0,p.rz||0);q.setFromEuler(e);const s=p.s||scale||1;m4.compose(new THREE.Vector3(p.x,p.y,p.z),q,new THREE.Vector3(s*(p.sx||1),s*(p.sy||1),s*(p.sz||1)));im.setMatrixAt(i,m4);});
  im.castShadow=false;im.receiveShadow=true;scene.add(im);if(DV._seg)DV._seg.push(im);return im;};
// ---------------- geometrías
const DVG={};
function dvGeo(){if(DVG.ok)return DVG;DVG.ok=1;
  {const L=[];for(let i=0;i<7;i++){const g=new THREE.PlaneGeometry(0.11,0.75+(i%3)*0.15,1,2);g.translate(0,(0.75+(i%3)*0.15)/2,0);L.push([g,new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler((i%2-0.5)*0.35,i*0.9,(i%3-1)*0.25)).setPosition(Math.cos(i)*0.12,0,Math.sin(i)*0.12)]);}DVG.blade=tbMerge(L);}   // una mata de siete cintas
  DVG.rock=new THREE.DodecahedronGeometry(1,1);{const p=DVG.rock.attributes.position,r=mulberry32(3);for(let i=0;i<p.count;i++){const s=0.8+r()*0.4;p.setXYZ(i,p.getX(i)*s,p.getY(i)*s*0.7,p.getZ(i)*s);}DVG.rock.computeVertexNormals();}
  DVG.sp=new THREE.SphereGeometry(0.35,8,6);DVG.sp.scale(1,0.8,1);
  {const g=new THREE.ConeGeometry(0.18,0.5,7);g.rotateZ(Math.PI/2);DVG.mu=g;}
  {const L=[];for(let i=0;i<6;i++){const c=new THREE.CylinderGeometry(0.03,0.05,0.5+i%3*0.15,5);c.translate(0,0.25,0);const m=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler((i-2.5)*0.25,i*1.1,(i%2-0.5)*0.5));L.push([c,m]);}DVG.co=mergeGeos(L);}
  DVG.amph=new THREE.LatheGeometry([[0,0],[0.08,0.02],[0.16,0.2],[0.26,0.55],[0.27,0.75],[0.2,0.95],[0.08,1.05],[0.07,1.3],[0.1,1.35],[0,1.36]].map(p=>new THREE.Vector2(p[0],p[1])),8);DVG.amph.rotateZ(Math.PI/2);
  {const g=new THREE.TorusGeometry(2.2,0.18,4,10,Math.PI);DVG.rib=g;}
  // pez: cuerpo, cola y aleta (mira a +z)
  {const b=new THREE.SphereGeometry(1,8,6);b.scale(0.18,0.32,0.7);const t=new THREE.ConeGeometry(0.28,0.4,3);t.rotateX(-Math.PI/2);t.scale(0.25,1,1);t.translate(0,0,-0.8);const f=new THREE.ConeGeometry(0.12,0.3,3);f.translate(0,0.35,0);DVG.fish=mergeGeos([[b,new THREE.Matrix4()],[t,new THREE.Matrix4()],[f,new THREE.Matrix4()]]);}
  {const b=new THREE.SphereGeometry(1,8,6);b.scale(0.35,0.4,1.9);const t=new THREE.ConeGeometry(0.6,0.9,3);t.rotateX(-Math.PI/2);t.scale(0.2,1,1);t.translate(0,0,-2.1);const f=new THREE.ConeGeometry(0.25,0.6,3);f.translate(0,0.55,0.1);const s=new THREE.ConeGeometry(0.2,0.7,3);s.rotateZ(Math.PI/2);s.translate(0.4,-0.15,0.4);const s2=s.clone();s2.rotateZ(Math.PI);DVG.dog=mergeGeos([[b,new THREE.Matrix4()],[t,new THREE.Matrix4()],[f,new THREE.Matrix4()],[s,new THREE.Matrix4()],[s2,new THREE.Matrix4()]]);}
  {const L=[];const hd=new THREE.SphereGeometry(0.35,8,6);hd.scale(1,0.9,1.1);hd.translate(0,0.35,0);L.push([hd,new THREE.Matrix4()]);for(let i=0;i<8;i++){const a=i/8*TAU,c=new THREE.CylinderGeometry(0.03,0.07,0.9,4);c.rotateZ(Math.PI/2);c.translate(0.45,0,0);L.push([c,new THREE.Matrix4().makeRotationY(a).setPosition(0,0.08,0)]);}DVG.oct=mergeGeos(L);}
  return DVG;}
// ---------------- construir cada tramo
function dvBuild(){if(DV.built||!SW.built||!swD())return;DV.built=true;const D=swD(),sy=swSeaY(),M=dvMats(),G=dvGeo(),SEA_=DV_SEA[MODE],z=dvz();
  // fuera el fondo llano, la posidonia de cajas y las rocas sueltas de antes (cientos de mallas por tramo)
  const kill=[];for(const o of scene.children){if(!o.isMesh||Math.abs(o.position.x-SW.X)>SW.H+260||o.position.z>SW.Z0+SW.H+300)continue;const g=o.geometry&&o.geometry.type,y=o.position.y;
    if(g==='PlaneGeometry'&&Math.abs(y-SW.BED)<0.01)kill.push(o);else if(g==='BoxGeometry'&&y<SW.BED+5&&o.material&&o.material.color&&o.material.color.getHexString()==='5f7a3e')kill.push(o);
    else if(g==='DodecahedronGeometry'&&Math.abs(y-(SW.BED+0.5))<0.01)kill.push(o);}
  for(const o of kill)scene.remove(o);
  // los cascos viejos de los pecios (cajas): se sustituyen por quilla, tablazón y cuadernas
  for(const o of [...scene.children]){if(o.type!=='Group'||Math.abs(o.position.x-SW.X)>SW.H+60||o.position.y>SW.BED+0.7||o.position.y<SW.BED+0.4)continue;const c0=o.children[0],pr=c0&&c0.geometry&&c0.geometry.type==='BoxGeometry'&&c0.geometry.parameters;if(pr&&pr.width>=3.9&&pr.width<=5.1&&pr.depth>=12.9&&pr.depth<=16.1)scene.remove(o);}
  for(const id in D.segs){const S=D.segs[id],H=dvMakeH(id),cz=H.cz,r=mulberry32(900+S.k*13+(MODE==='roma'?7:0));DV.segs[id]=H;H.meshes=[];DV._seg=H.meshes;
    // el fondo con relieve
    {const W=SW.H*2+200,n=100,g=new THREE.PlaneGeometry(W,W,n,n);g.rotateX(-Math.PI/2);const p=g.attributes.position,uv=g.attributes.uv,col=[],c=new THREE.Color(),sand=new THREE.Color('#d6c29a'),rock=new THREE.Color('#857c6c'),deep=new THREE.Color('#b8a47c');
     for(let i=0;i<p.count;i++){const lx=p.getX(i),lz=p.getZ(i),y=H.h(lx,lz);p.setY(i,y);uv.setXY(i,lx/18,lz/18);const hu=y-SW.BED,s=Math.abs(H.h(lx+3,lz)-y)+Math.abs(H.h(lx,lz+3)-y);c.copy(deep).lerp(sand,clamp(hu/12,0,1)).lerp(rock,clamp((s-1.2)/3,0,1));col.push(c.r,c.g,c.b);}
     g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.computeVertexNormals();const m=new THREE.Mesh(g,M.bed);m.position.set(SW.X,0,cz);m.receiveShadow=true;scene.add(m);H.mesh=m;H.meshes.push(m);}
    const at=(lx,lz)=>({x:SW.X+lx,y:H.h(lx,lz),z:cz+lz});
    const okSpot=(lx,lz)=>{for(const I of S.isl)if(Math.hypot((lx-I.x)/I.rx,(lz-I.z)/I.rz)<1.15)return false;return true;};
    // rocas
    {const L=[];for(let i=0;i<70;i++){const lx=(r()-0.5)*SW.H*2,lz=(r()-0.5)*SW.H*2;if(!okSpot(lx,lz))continue;const p=at(lx,lz);if(sy-p.y<4)continue;L.push(Object.assign(p,{s:1+r()*3.5,ry:r()*6,rx:r()*0.4,sy:0.6+r()*0.6}));}dvInst(G.rock,M.rock,L);}
    // praderas de posidonia: manchas entre 8 y 35 m de profundidad
    {const L=[];for(let m=0;m<14;m++){const cx=(r()-0.5)*SW.H*1.9,cz2=(r()-0.5)*SW.H*1.9,R=12+r()*22;for(let i=0;i<220;i++){const a=r()*TAU,d=Math.sqrt(r())*R,lx=cx+Math.cos(a)*d,lz=cz2+Math.sin(a)*d;if(!okSpot(lx,lz))continue;const p=at(lx,lz),dep=sy-p.y;if(dep<6||dep>36)continue;
        L.push(Object.assign(p,{s:1,sy:1.2+r()*1.6,ry:r()*6,rx:(r()-0.5)*0.3}));}if(m===0&&L.length)H.posAt=L[0];}H.pos=dvInst(G.blade,M.pos,L);if(L.length)try{atReg(L[0].x,L[0].z,L[0].y,'uw_posidonia',8);}catch(e){}}
    // esponjas, múrex y coral: lo que se recoge
    const kinds=[['mu',18,G.mu,M.mu,0.9]];if(SEA_.sp.includes(id))kinds.push(['sp',14,G.sp,M.sp,1]);if(SEA_.co.includes(id))kinds.push(['co',9,G.co,M.co,1.2]);
    for(const[kd,n,geo,mat,sc]of kinds){const L=[];for(let i=0;i<n;i++){let lx,lz,p,ok=false;for(let t=0;t<20&&!ok;t++){lx=(r()-0.5)*SW.H*1.8;lz=(r()-0.5)*SW.H*1.8;if(!okSpot(lx,lz))continue;p=at(lx,lz);const dep=sy-p.y;ok=kd==='co'?dep>18:kd==='sp'?dep>8:dep>4;}if(!ok)continue;
        const key=id+':'+kd+':'+i;L.push(Object.assign(p,{s:sc,ry:r()*6,key}));DV.picks.push({key,kd,seg:id,x:p.x,y:p.y,z:p.z,list:L,i:L.length-1});}
      const im=dvInst(geo,mat,L);for(const P of DV.picks)if(P.list===L)P.im=im;if(L.length)try{atReg(L[0].x,L[0].z,L[0].y,'uw_'+kd,4);}catch(e){}}
    // los pecios: cuadernas, montón de ánforas y dos sitios donde escarbar
    {const sites=[];if(S.wreck)sites.push([S.wreck.x,S.wreck.z,0.6]);{let lx=((S.k*137+60)%480)-240,lz=((S.k*271+130)%480)-240;for(let t=0;t<8;t++){let bad=false;for(const I of S.isl){if(Math.hypot((lx-I.x)/I.rx,(lz-I.z)/I.rz)<1.4)bad=true;}if(!bad)break;lx=(lx+170)%480-240;lz=(lz+110)%480-240;}sites.push([lx,lz,S.k]);}
     const ribs=[],amph=[],digs=[],keel=[];
     sites.forEach(([lx,lz,a],w)=>{const c=Math.cos(a),s=Math.sin(a),P=(u,v)=>at(lx+u*c+v*s,lz-u*s+v*c);
       for(let i=0;i<7;i++){const p=P(0,-7+i*2.3);ribs.push(Object.assign(p,{ry:a+Math.PI/2,y:p.y-0.6,s:0.9+(i%3===0?0.1:0),sy:0.75}));}
       {const p=P(0,0);keel.push(Object.assign(p,{y:p.y+0.1,ry:a,s:1}));}
       for(let i=0;i<40;i++){const u=(r()-0.5)*8,v=(r()-0.5)*13,p=P(u,v);amph.push(Object.assign(p,{y:p.y+0.3+(Math.abs(u)<2.3?0.55+r()*0.7:0),ry:a+(r()<0.7?0:Math.PI/2)+(r()-0.5)*0.4,rx:(r()-0.5)*0.5,s:0.9+r()*0.3}));}
       for(let j=0;j<2;j++){const p=P((j?1:-1)*5.5,(j?4:-3)),key=id+':dig:'+w+':'+j;digs.push(Object.assign({},p,{sy:0.35,s:1.6,key}));DV.digs.push({key,seg:id,x:p.x,y:p.y,z:p.z,find:DV_FINDS[(S.k*3+w*2+j)%DV_FINDS.length]});}
       DV.wrecks.push({seg:id,x:SW.X+lx,y:H.h(lx,lz),z:cz+lz,cargo:(SEA_.cargo[id]||['mercancías','ánforas'])});
       try{atReg(SW.X+lx,cz+lz,H.h(lx,lz)+1,'uw_wreck',8,(SEA_.cargo[id]||['mercancías'])[0]);}catch(e){}});
     dvInst(G.rib,M.wood,ribs);{const kg=boxUV(4.6,0.5,15,4);dvInst(kg,M.wood,keel);}dvInst(G.amph,M.amph,amph);H.digIm=dvInst(new THREE.SphereGeometry(1,10,6,0,TAU,0,Math.PI/2),M.dig,digs);H.digL=digs;}
    // una corriente en cada tramo
    DV.cur.push({seg:id,x:SW.X+(r()-0.5)*SW.H*1.4,z:cz+(r()-0.5)*SW.H*1.4,r:70+r()*50,a:r()*TAU,v:1+r()*0.8});
    // el perro de mar, en algunos mares
    if(SEA_.dog.includes(id))DV.dogs.push({seg:id,x0:SW.X+(r()-0.5)*SW.H,z0:cz+(r()-0.5)*SW.H,ph:r()*6,g:null,t:0,st:'ronda',x:0,y:0,z:0,a:0});
  }
  DV._seg=null;dvSpecial();dvPickVis();if(typeof dv2Built==='function')dv2Built();}
function dvPickVis(){const z=dvz(),m4=new THREE.Matrix4(),zero=new THREE.Matrix4().makeScale(0,0,0),day=state.day||1;
  const touched=new Set();for(const P of DV.picks){const got=z.pick[P.key]&&day-z.pick[P.key]<4;if(!P.im)continue;if(got){P.im.setMatrixAt(P.i,zero);}else{const p=P.list[P.i],q=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,p.ry||0,0));m4.compose(new THREE.Vector3(p.x,p.y,p.z),q,new THREE.Vector3(p.s,p.s,p.s));P.im.setMatrixAt(P.i,m4);}touched.add(P.im);}
  for(const im of touched)im.instanceMatrix.needsUpdate=true;
  for(const id in DV.segs){const H=DV.segs[id];if(!H.digIm)continue;H.digL.forEach((d,i)=>{if(z.find[d.key])H.digIm.setMatrixAt(i,zero);});H.digIm.instanceMatrix.needsUpdate=true;}}
// ---------------- lugares especiales: Hélice, Anticitera, Esfacteria, Escilias y los urinatores
function dvSpecial(){const ro=MODE==='roma',D=swD(),z=dvz(),st=lam('#cfc6b0');
  const put=(seg,lx,lz)=>{const H=DV.segs[seg];if(!H)return null;return{x:SW.X+lx,y:H.h(lx,lz),z:H.cz+lz};};
  if(ro&&D.segs.aegaeum){   // Anticitera: el barco del 60 a.C., con estatuas de bronce y mármol
    const p=put('aegaeum',-180,150);if(p){const g=grp(p.x,p.y,p.z,0.4);box(5,1,18,lam('#3e3022'),0,0.3,0,g);for(let i=0;i<4;i++){const s=makePerson({toga:false,chiton:'#5a6a5a',hair:'#5a6a5a',noHimation:true});s.traverse(o=>{if(o.isMesh)o.material=lam(i%2?'#6f7f6a':'#d8d2c0');});s.rotation.set(Math.PI/2*(i%2?1:0.6),i,0);s.position.set(-2+i*1.4,0.6,-4+i*2.5);s.scale.setScalar(1.3);g.add(s);}
      SW.objs.push(egxObj(p.x,p.z,p.y+1,()=>vmS('🏺','Un naufragio rico','frente a Anticitera','<p>Entre las piedras asoman brazos de bronce y cuerpos de mármol cubiertos de algas: un barco que se hundió hace unos ciento cuarenta años, cargado de estatuas, vasos de lujo y monedas de Pérgamo y de Éfeso, camino de las villas de Roma. Entre la carga hay una caja de madera con ruedas dentadas de bronce que nadie sabe para qué sirven.</p><p class="sub">Unos pescadores de esponjas lo encontrarán en 1900. La caja es el mecanismo de Anticitera, un calculador astronómico; las estatuas, como el Efebo, están hoy en el Museo Arqueológico Nacional de Atenas.</p>',[vmBye]),'El naufragio de Anticitera','estatuas entre las algas',8));
      try{atReg(p.x,p.z,p.y+1,'uw_wreck',8,'Anticitera');}catch(e){}}}
  if(D.segs.corintio&&!ro){   // Hélice, en el 386 aún en pie, en la costa sur del golfo
    const S=D.segs.corintio,I=S.isl.find(i=>!i.rock)||S.isl[0];if(I){const lx=I.x,lz=I.z+I.rz*0.9;SW.info.push(Object.assign(egxObj(SW.X+lx,swSegZ('corintio')+lz+14,swSeaY()+1,()=>vmS('🏛','Hélice','la ciudad aquea de Poseidón','<p>En la costa, entre la playa y los olivos, la ciudad de Hélice, con su gran santuario de Poseidón Heliconio. Dentro de trece años, en una noche del invierno del 373, un terremoto y una ola gigante la hundirán en el mar con todos sus habitantes. Siglos después se verán sus ruinas bajo el agua.</p><p class="src">Pausanias VII 24.12; Estrabón VIII 7.2</p>',[vmBye]),'Hélice','la ciudad de Poseidón',30),{seg:'corintio'}));}}
  if(ro&&D.segs.ionium){   // Hélice bajo el agua: el golfo de Corinto no tiene tramo en el modo Roma; está en la entrada del golfo, al este del mar Jonio
    const p=put('ionium',260,-60);if(p){const g=grp(p.x,p.y,p.z,0);for(let i=0;i<16;i++){const h=1+Math.random()*5;box(1.2,h,mr(3,9),st,(i%4-1.5)*8+mr(-2,2),h/2,(Math.floor(i/4)-1.5)*8,g).rotation.y=mr(0,3);}for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.55,mr(2,5),10),st);c.position.set(mr(-14,14),1.2,mr(-14,14));c.rotation.z=i%2?1.5:0;g.add(c);}
      SW.objs.push(egxObj(p.x,p.z,p.y+1,()=>vmS('🏛','Las ruinas de Hélice','bajo el agua','<p>Muros, columnas caídas y calles cubiertas de algas: Hélice, la ciudad de Poseidón que el mar se tragó en una noche del 373 a.C., con un terremoto y una ola. Pausanias contará que todavía se ven sus ruinas bajo el agua, aunque ya gastadas por el mar; Eratóstenes dijo que los barqueros le enseñaron una estatua de bronce de Poseidón en pie en el fondo, que se enganchaba en las redes.</p><p class="sub">En el juego está en la entrada del golfo de Corinto, porque el modo Roma no tiene un tramo dentro del golfo. Los arqueólogos la encontraron en 2001, ya en tierra, bajo los sedimentos de la llanura.</p><p class="src">Pausanias VII 24.12-13; Estrabón VIII 7.2</p>',[vmBye]),'Las ruinas de Hélice','una ciudad bajo el agua',14));try{atReg(p.x,p.z,p.y+2,'uw_ruin',10,'Hélice');}catch(e){}}}
  if(!ro&&D.segs.jonico){   // Esfacteria: llevar odres a nado sin que te vean los barcos atenienses (Tucídides IV 26)
    const S2='jonico',cz=swSegZ(S2),isl={x:SW.X+200,z:cz-180},g=new THREE.Mesh(new THREE.SphereGeometry(1,24,10,0,TAU,0,Math.PI/2),lam('#6c6242'));g.scale.set(60,22,26);g.position.set(isl.x,swSeaY()-1.5,isl.z);scene.add(g);
    DV.mis={kind:'esf',seg:S2,isl,start:{x:SW.X+40,z:cz-120},ships:[]};
    SW.info.push(Object.assign(egxObj(DV.mis.start.x,DV.mis.start.z,swSeaY()+1,()=>dvEsfTalk(),'Un viejo ilota','en una barca de pesca',10),{seg:S2}));
    SW.info.push(Object.assign(egxObj(isl.x-40,isl.z+30,swSeaY()+1,()=>vmS('🏝','Esfacteria','la isla de los espartanos sitiados','<p>En el 425 a.C., los atenienses dejaron aislados en esta isla larga a cuatrocientos veinte hoplitas espartanos. Esparta prometió dinero a quien les llevara comida, y la libertad a los ilotas que lo hicieran: unos llegaban de noche en barcas con mal tiempo; otros, buceando, arrastraban odres con semillas de amapola amasadas con miel y linaza molida.</p><p class="src">Tucídides IV 26</p>',[vmBye]),'Esfacteria','la isla de los sitiados',30),{seg:S2}));}
  {   // Escilias (en el 386) o el jefe de los urinatores (en el 80): las pruebas, los encargos y la campana
    const seg=ro?'ostia':'egeonorte';if(D.segs[seg]){const cz=swSegZ(seg),x=SW.X+(ro?-120:-200),zz=cz+(ro?40:120),y=swSeaY();
      const raft=new THREE.Group();box(5,0.6,3,lam('#6e4b2c'),0,0,0,raft);const p=makePerson(ro?{short:true,noHimation:true,chiton:'#7a6a50',hair:'#2a1e14'}:{short:true,noHimation:true,chiton:'#8a7a5a',hair:'#3a2a1e',beard:true});p.position.y=0.3;raft.add(p);raft.position.set(x,y-0.1,zz);scene.add(raft);
      SW.info.push(Object.assign(egxObj(x,zz,y+1,()=>dvMasterTalk(),ro?'Marco, jefe de los urinatores':'Escilias de Escione',ro?'el gremio de buzos de Ostia':'el mejor buceador de Grecia',10),{seg}));DV.master={seg,x,z:zz};}}}
function dvMasterTalk(){const ro=MODE==='roma',z=dvz(),done=['conchas','aguante','carrera'].filter(k=>z.esc[k]).length;
  const intro=ro?'<p>«¡Salve! Marco, del cuerpo de los urinatores de Ostia. Bajamos a por lo que se cae de los barcos al descargar en el puerto de Claudio: sacos, ánforas, anclas, hasta lingotes. Hay inscripciones del gremio en Ostia y en Roma».</p>':'<p>«Soy Escilias, de Escione. Hace casi cien años, cuentan, mi abuelo rescató para los persas los tesoros de sus barcos hundidos en el Pelión, y luego se pasó a los griegos buceando ochenta estadios sin salir a respirar. Heródoto no se lo creyó: dijo que fue en barca. Yo te enseño lo que sé, si te atreves».</p>';
  const btn=[];for(const[k,t]of[['conchas','Prueba 1: traer tres conchas del fondo'],['aguante','Prueba 2: aguantar bajo el agua'],['carrera','Prueba 3: la carrera de las boyas']])if(!z.esc[k])btn.push([t,()=>{closeDialog();dvTestStart(k);}]);
  if(ro&&!z.urin)btn.push(['Pedir un encargo de rescate',()=>{closeDialog();dvUrinStart();}]);
  if(!z.bell&&(ro?done>=1:done>=3))btn.push([ro?'Comprar una campana de buceo (30 sestercios)':'Recibir la caldera de Escilias',()=>{if(ro){if(state.obols<30){toast('No tienes bastante dinero.');return;}state.obols-=30;updateStats();}z.bell=1;save();closeDialog();toast('<span class="label">La campana de buceo</span><br>Una caldera de bronce boca abajo, con aire dentro. Con <b>B</b>, desde la barca, la bajas al fondo; dentro respiras. Los Problemas atribuidos a Aristóteles hablan de calderas así para los buceadores (XXXII 5).');}]);
  btn.push(vmBye);vmS(ro?'Μ':'Σ',ro?'Marco':'Escilias',ro?'jefe de los urinatores':'buceador de Escione',intro+'<p>Pruebas superadas: <b>'+done+' de 3</b>. Cada una te enseña a aguantar más: ahora tienes <b>'+dvAirMax()+' s</b> de aire.</p>',btn);}
function dvTestStart(k){const z=dvz(),M=DV.master;if(!M)return;DV.test={k,t:k==='aguante'?0:k==='conchas'?120:75,n:0,objs:[]};
  if(k==='conchas'){const H=DV.segs[M.seg];for(let i=0;i<3;i++){const lx=M.x-SW.X+mr(-50,50),lz=M.z-H.cz+mr(-50,50),y=H.h(lx,lz),m=new THREE.Mesh(new THREE.SphereGeometry(0.3,8,6,0,TAU,0,Math.PI/2),new THREE.MeshLambertMaterial({color:'#f0e6d0',emissive:'#403020'}));m.position.set(SW.X+lx,y,H.cz+lz);scene.add(m);DV.test.objs.push(m);}
    toast('<span class="label">Las conchas</span><br>Hay tres conchas blancas en el fondo, cerca. Tienes dos minutos.');}
  if(k==='aguante')toast('<span class="label">El aguante</span><br>Baja a más de diez metros y quédate allí veinticinco segundos sin subir.');
  if(k==='carrera'){const H=DV.segs[M.seg];for(let i=0;i<4;i++){const a=i/4*TAU,lx=M.x-SW.X+Math.cos(a)*40,lz=M.z-H.cz+Math.sin(a)*40,y=Math.max(H.h(lx,lz)+3,swSeaY()-12),m=new THREE.Mesh(new THREE.TorusGeometry(1.6,0.15,6,18),new THREE.MeshBasicMaterial({color:i?'#e8c860':'#ff7050'}));m.position.set(SW.X+lx,y,H.cz+lz);scene.add(m);DV.test.objs.push(m);}
    toast('<span class="label">La carrera</span><br>Pasa bajo el agua por los cuatro aros, en orden (el rojo primero), en un minuto y cuarto.');}}
function dvTestEnd(ok){const T=DV.test;if(!T)return;for(const o of T.objs)scene.remove(o);DV.test=null;const z=dvz();
  if(ok){z.esc[T.k]=1;save();if(typeof sfxCoin==='function')sfxCoin();toast('<span class="label">¡Prueba superada!</span><br>Ahora aguantas '+dvAirMax()+' segundos sin respirar.'+(['conchas','aguante','carrera'].every(k=>z.esc[k])?' '+(MODE==='roma'?'Marco te ofrece entrar en el gremio de los urinatores.':'Escilias te llama «buceador de Escione».'):''));}
  else toast('No lo has conseguido. Vuelve a hablar con '+(MODE==='roma'?'Marco':'Escilias')+' para intentarlo otra vez.');}
function dvUrinStart(){const z=dvz(),segs=['ostia','crater','tyrrn'].filter(s=>DV.segs[s]),seg=mpick(segs),H=DV.segs[seg],lx=mr(-200,200),lz=mr(-200,200),what=mpick(['un ancla de hierro','un saco de trigo','un lingote de plomo','una caja de vidrio']);
  z.urin={seg,lx,lz,what,pay:12+Math.floor(Math.random()*10)};save();dvUrinMesh();toast('<span class="label">Encargo de los urinatores</span><br>Se cayó '+what+' al agua en '+swD().segs[seg].name+'. Una boya roja marca el sitio. Súbelo y lo cobras en cualquier puerto: '+z.urin.pay+' sestercios.');}
function dvUrinMesh(){const z=dvz();if(DV.urinG){scene.remove(DV.urinG);DV.urinG=null;}if(!z.urin||z.urin.got)return;const U=z.urin,H=DV.segs[U.seg];if(!H)return;const x=SW.X+U.lx,zz=H.cz+U.lz,y=H.h(U.lx,U.lz),g=new THREE.Group();
  const it=box(1,0.6,0.7,lam('#5a4a3a'),0,0.3,0,g);const rope=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,swSeaY()-y,4),lam('#c9b48b'));rope.position.y=(swSeaY()-y)/2;g.add(rope);const b=new THREE.Mesh(new THREE.SphereGeometry(0.5,10,8),new THREE.MeshLambertMaterial({color:'#c83a2a'}));b.position.y=swSeaY()-y;g.add(b);
  g.position.set(x,y,zz);scene.add(g);DV.urinG=g;DV.urinAt={x,y,z:zz};}
function dvEsfTalk(){const z=dvz();vmS('Ι','Un viejo ilota','de Mesenia','<p>«Mi abuelo era uno de ellos. Buceaba desde la costa hasta la isla, de noche, arrastrando un odre con semillas de amapola y miel, por debajo de las trirremes atenienses. Los espartanos le prometieron la libertad. ¿Te atreves a hacerlo tú? Lleva este odre hasta la orilla de Esfacteria. Si un barco te ve en la superficie cerca de él, tendrás que volver a empezar».</p>',[[z.done.esf?'Repetirlo':'Llevar el odre',()=>{closeDialog();dvEsfStart();}],vmBye]);}
function dvEsfStart(){const M=DV.mis;if(!M)return;for(const s of M.ships)scene.remove(s.g);M.ships=[];
  for(let i=0;i<3;i++){const g=sw2Ship('trirreme');scene.add(g);M.ships.push({g,ph:i*2.1,x0:M.isl.x-160+i*30,z0:M.isl.z+60+i*35});}
  M.on=true;M.t=240;toast('<span class="label">Los odres de Esfacteria</span><br>Llega a nado hasta la orilla de la isla (al este). Cerca de las trirremes, ve por debajo del agua.');}
// ---------------- efectos: rayos, ventana de Snell, partículas, burbujas
function dvFx(){if(DV.fx)return DV.fx;const F={};
  {const t=canvasTex(64,256,(x,w,h)=>{for(let i=0;i<w;i++){const k=Math.pow(Math.sin(i/w*Math.PI),2);const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,255,240,'+(0.5*k).toFixed(3)+')');g.addColorStop(1,'rgba(255,255,240,0)');x.fillStyle=g;x.fillRect(i,0,1,h);}});
   const L=[];for(let i=0;i<10;i++){const g=new THREE.PlaneGeometry(2+Math.random()*3,40);g.translate(0,-20,0);L.push([g,new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0.25,i*0.7,0.1)).setPosition((Math.random()-0.5)*30,0,(Math.random()-0.5)*30)]);}
   const geo=tbMerge(L);F.rays=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,opacity:0.5}));F.rays.frustumCulled=false;F.rays.visible=false;scene.add(F.rays);}
  {const t=canvasTex(128,128,(x,w,h)=>{const g=x.createRadialGradient(64,64,10,64,64,64);g.addColorStop(0,'rgba(230,250,255,0.9)');g.addColorStop(0.8,'rgba(160,220,240,0.5)');g.addColorStop(1,'rgba(160,220,240,0)');x.fillStyle=g;x.fillRect(0,0,w,h);});
   F.snell=new THREE.Mesh(new THREE.CircleGeometry(1,40),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,opacity:0.55}));F.snell.rotation.x=Math.PI/2;F.snell.visible=false;scene.add(F.snell);}
  {const n=600,p=new Float32Array(n*3);for(let i=0;i<n*3;i++)p[i]=(Math.random()-0.5)*40;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
   F.snow=new THREE.Points(g,new THREE.PointsMaterial({color:'#d8ecec',size:0.07,transparent:true,opacity:0.55,depthWrite:false}));F.snow.frustumCulled=false;F.snow.visible=false;scene.add(F.snow);}
  {const n=80,g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));F.bub=new THREE.Points(g,new THREE.PointsMaterial({color:'#e8f8ff',size:0.12,transparent:true,opacity:0.8,depthWrite:false}));F.bub.frustumCulled=false;F.bub.visible=false;scene.add(F.bub);F.bubL=[];
   const g2=new THREE.BufferGeometry();g2.setAttribute('position',new THREE.BufferAttribute(new Float32Array(60*3),3));F.puff=new THREE.Points(g2,new THREE.PointsMaterial({color:'#c8b48a',size:0.5,transparent:true,opacity:0.5,depthWrite:false}));F.puff.frustumCulled=false;F.puff.visible=false;scene.add(F.puff);F.puffL=[];}
  // peces: cuatro especies instanciadas, que solo se mueven en el tramo donde estás
  {F.sp=[];   // los peces: 289_buceo_2.js
   F.dog=new THREE.Mesh(dvGeo().dog,dvCausticMat(new THREE.MeshLambertMaterial({color:'#7a7a72'})));F.dog.visible=false;scene.add(F.dog);}
  DV.fx=F;return F;}
function dvBubble(n,x,y,z,col){const F=dvFx();for(let i=0;i<n;i++)F.bubL.push({x:x+(Math.random()-0.5)*0.4,y:y+Math.random()*0.3,z:z+(Math.random()-0.5)*0.4,vy:0.8+Math.random()*0.8,t:6});if(F.bubL.length>80)F.bubL.splice(0,F.bubL.length-80);}
function dvPuff(x,y,z){const F=dvFx();for(let i=0;i<8;i++)F.puffL.push({x:x+(Math.random()-0.5),y:y+0.2,z:z+(Math.random()-0.5),vx:(Math.random()-0.5)*0.8,vy:0.3+Math.random()*0.4,vz:(Math.random()-0.5)*0.8,t:2.5});if(F.puffL.length>60)F.puffL.splice(0,F.puffL.length-60);}
// peces de un tramo: centros de banco deterministas; huyen del jugador
function dvFishSeg(id){const F=dvFx(),H=DV.segs[id];if(!H)return;DV.fishSeg=id;const r=mulberry32(500+swD().segs[id].k);
  for(const S of F.sp){S.f=[];const groups=S.k==='salpa'?3:S.k==='dorada'?2:S.n;for(let gi=0;gi<groups;gi++){const lx=(r()-0.5)*SW.H*1.2,lz=(r()-0.5)*SW.H*1.2,y=H.h(lx,lz);const c={x:SW.X+lx,z:H.cz+lz,y:y+(S.k==='pulpo'?0.3:3+r()*6),ax:SW.X+lx,az:H.cz+lz,vx:0,vz:0,ph:r()*6};
      const per=Math.floor(S.n/groups);for(let i=0;i<per;i++)S.f.push({c,ox:(r()-0.5)*6,oy:(r()-0.5)*2,oz:(r()-0.5)*6,ph:r()*6,x:c.x,y:c.y,z:c.z,a:0});
      try{atReg(c.x,c.z,c.y,'uw_'+S.k,6);}catch(e){}}}}
// ---------------- el bucle
function dvTick(dt){if(!SW.built||!swD())return;if(!DV.built)dvBuild();if(!DV.built)return;DV.t+=dt;DVU.t.value=DV.t;const sy=swSeaY();DVU.sea.value=sy;
  const uw=!!SW.uw,F=dvFx(),swim=BOAT.sea&&SW.swim,z=dvz();DVU.on.value=uw?1:0;
  // la luz, el color y la visibilidad según la profundidad (y el aceite)
  const depth=Math.max(0,sy-player.camY),dk=clamp(depth/35,0,1);DV.oilT=Math.max(0,DV.oilT-dt);
  if(uw&&scene.fog){const c=new THREE.Color('#2f8aa0').lerp(new THREE.Color('#0d2f4c'),dk);scene.fog.color.copy(c);if(scene.background&&scene.background.isColor)scene.background.copy(c);scene.fog.near=1;scene.fog.far=lerp(80,36,dk)*(DV.oilT>0?1.8:1);}
  F.rays.visible=uw&&depth<28;if(F.rays.visible){F.rays.position.set(player.x+Math.sin(DV.t*0.05)*4,sy-0.3,player.z);F.rays.rotation.y=DV.t*0.02;F.rays.material.opacity=0.28*(1-depth/28);}
  F.snell.visible=uw;if(uw){const R=Math.min(45,Math.max(2,depth*1.13));F.snell.scale.set(R,R,1);F.snell.position.set(player.x,sy-0.08,player.z);F.snell.material.opacity=0.55*(1-dk*0.7);}
  F.snow.visible=uw;if(uw){const p=F.snow.geometry.attributes.position,a=p.array,cur=DV.curNow||{x:0,z:0};for(let i=0;i<a.length;i+=3){a[i]+=(cur.x*0.3+Math.sin(DV.t+i)*0.02)*dt;a[i+1]-=0.05*dt;a[i+2]+=cur.z*0.3*dt;for(let k=0;k<3;k++){if(a[i+k]>20)a[i+k]-=40;else if(a[i+k]<-20)a[i+k]+=40;}}p.needsUpdate=true;F.snow.position.set(player.x,player.camY,player.z);}
  // burbujas y arena
  F.bub.visible=F.bubL.length>0;if(F.bub.visible){const p=F.bub.geometry.attributes.position;F.bubL=F.bubL.filter(b=>{b.y+=b.vy*dt;b.x+=Math.sin(DV.t*5+b.y)*0.01;b.t-=dt;return b.t>0&&b.y<sy;});for(let i=0;i<80;i++){const b=F.bubL[i];if(b)p.setXYZ(i,b.x,b.y,b.z);else p.setXYZ(i,0,-9999,0);}p.needsUpdate=true;}
  F.puff.visible=F.puffL.length>0;if(F.puff.visible){const p=F.puff.geometry.attributes.position;F.puffL=F.puffL.filter(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;b.vy*=0.97;b.t-=dt;return b.t>0;});for(let i=0;i<60;i++){const b=F.puffL[i];if(b)p.setXYZ(i,b.x,b.y,b.z);else p.setXYZ(i,0,-9999,0);}p.needsUpdate=true;}
  // los peces del tramo
  const seg=SW.seg;const showFish=BOAT.sea&&seg&&(uw||swim);for(const S of F.sp)S.im.visible=showFish;
  if(showFish){if(DV.fishSeg!==seg)dvFishSeg(seg);const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),V=new THREE.Vector3(),Sc=new THREE.Vector3();
    for(const S of F.sp){const seen=new Set();S.f.forEach((f,i)=>{const c=f.c;if(!seen.has(c)){seen.add(c);if(S.k!=='pulpo'){const dx=c.x-player.x,dz=c.z-player.z,d=Math.hypot(dx,dz)||1,fear=uw&&d<12&&Math.abs(c.y-player.camY)<8;
          const tx=fear?c.x+dx/d*12:c.ax+Math.cos(DV.t*0.1+c.ph)*25,tz=fear?c.z+dz/d*12:c.az+Math.sin(DV.t*0.13+c.ph)*25,sp=fear?6:1.2;c.vx+=((tx-c.x)*0.2-c.vx)*Math.min(1,dt*(fear?3:0.8));c.vz+=((tz-c.z)*0.2-c.vz)*Math.min(1,dt*(fear?3:0.8));
          const L=Math.hypot(c.vx,c.vz);if(L>sp){c.vx*=sp/L;c.vz*=sp/L;}c.x+=c.vx*dt;c.z+=c.vz*dt;const by=dvBed(c.x,c.z);c.y=clamp(c.y,by+1.2,sy-1.5);}}
        if(S.k==='pulpo'){f.x=c.x;f.y=dvBed(c.x,c.z)+0.1;f.z=c.z;f.a=Math.sin(DV.t*0.3+f.ph)*0.5;}
        else{const ws=Math.sin(DV.t*2+f.ph);const nx=c.x+f.ox+Math.sin(DV.t*0.7+f.ph)*0.8,ny=c.y+f.oy+ws*0.2,nz=c.z+f.oz+Math.cos(DV.t*0.6+f.ph)*0.8;const vx=nx-f.x,vz=nz-f.z;if(Math.abs(vx)+Math.abs(vz)>0.002)f.a=Math.atan2(vx,vz);f.x=nx;f.y=ny;f.z=nz;}
        q.setFromAxisAngle(up,f.a+(S.k==='pulpo'?0:Math.sin(DV.t*8+f.ph)*0.12));V.set(f.x,f.y,f.z);Sc.set(S.s,S.s,S.s);m4.compose(V,q,Sc);S.im.setMatrixAt(i,m4);});S.im.instanceMatrix.needsUpdate=true;S.im.count=S.f.length;}}
  // el perro de mar: ronda y, si te mueves cerca, se acerca; si te quedas quieto, pierde el interés (Plinio IX 151)
  F.dog.visible=false;if(showFish){const Dg=DV.dogs.find(d=>d.seg===seg);if(Dg){const by=dvBed(Dg.x0,Dg.z0);if(!Dg.x){Dg.x=Dg.x0;Dg.z=Dg.z0;Dg.y=by+5;}const dx=player.x-Dg.x,dz=player.z-Dg.z,dy=player.camY-Dg.y,d=Math.hypot(dx,dz,dy);
      const moving=swim&&(keys.w||keys.s||keys.a||keys.d||Math.abs(joy.x)+Math.abs(joy.y)>0.1);DV.still=moving?0:DV.still+dt;
      if(uw&&d<22&&DV.still<3){Dg.st='curioso';Dg.x+=dx/d*2.2*dt;Dg.z+=dz/d*2.2*dt;Dg.y+=dy/d*1.2*dt;Dg.a=Math.atan2(dx,dz);if(d<3&&Dg.t<=0){Dg.t=8;DV.air=Math.max(1,DV.air-6);toast('<span class="label">El perro de mar</span><br>Un escualo gris te roza y te da un susto: se te escapa el aire. Opiano cuenta que los esponjeros temían a estos «perros». Quédate quieto y se irá.');}}
      else{Dg.st='ronda';Dg.ph+=dt*0.15;const tx=Dg.x0+Math.cos(Dg.ph)*30,tz=Dg.z0+Math.sin(Dg.ph)*30;Dg.a=Math.atan2(tx-Dg.x,tz-Dg.z);Dg.x+=(tx-Dg.x)*dt*0.5;Dg.z+=(tz-Dg.z)*dt*0.5;Dg.y+=(by+5-Dg.y)*dt*0.3;}
      Dg.t-=dt;F.dog.visible=true;F.dog.position.set(Dg.x,Dg.y,Dg.z);F.dog.rotation.set(0,Dg.a+Math.sin(DV.t*3)*0.1,0);
      if(!Dg.reg){Dg.reg=1;try{atReg(Dg.x0,Dg.z0,by+5,'uw_dogfish',8);}catch(e){}}}}
  // la campana
  if(DV.bellOn){const b=DV.bellOn;if(!BOAT.sea||SW.seg!==b.seg||Math.hypot(SW.bg.position.x-b.x,SW.bg.position.z-b.z)>40){scene.remove(b.g);DV.bellOn=null;toast('Subes la campana a la barca.');}
    else if(swim&&Math.hypot(player.x-b.x,player.z-b.z)<2.2&&Math.abs(player.camY-(b.y+1.4))<1.6){if(DV.air<dvAirMax()-0.5){DV.air=Math.min(dvAirMax(),DV.air+dt*10);if(Math.random()<dt*2)dvBubble(2,b.x,b.y+2.6,b.z);}}}
  // pruebas y misiones
  if(DV.test){const T=DV.test;if(T.k==='conchas'){T.t-=dt;for(let i=T.objs.length-1;i>=0;i--){const o=T.objs[i];if(o.visible&&Math.hypot(player.x-o.position.x,player.z-o.position.z,player.camY-o.position.y)<2.2){o.visible=false;T.n++;toast('Concha '+T.n+' de 3.');}}if(T.n>=3)dvTestEnd(true);else if(T.t<=0)dvTestEnd(false);}
    else if(T.k==='aguante'){if(uw&&depth>10)T.t+=dt;else if(T.t>0)T.t=0;if(T.t>=25)dvTestEnd(true);}
    else if(T.k==='carrera'){T.t-=dt;const o=T.objs[T.n];if(o&&Math.hypot(player.x-o.position.x,player.z-o.position.z,player.camY-o.position.y)<2.4&&uw){o.material.color.set('#60d080');T.n++;if(T.n<4)T.objs[T.n].material.color.set('#ff7050');}if(T.n>=4)dvTestEnd(true);else if(T.t<=0)dvTestEnd(false);}}
  if(DV.mis&&DV.mis.on){const M=DV.mis;M.t-=dt;for(const s of M.ships){s.ph+=dt*0.12;s.x=s.x0+Math.sin(s.ph)*90;s.z=s.z0+Math.cos(s.ph*0.7)*40;s.g.position.set(s.x,sy-0.2,s.z);s.g.rotation.y=Math.atan2(Math.cos(s.ph)*90,-Math.sin(s.ph*0.7)*28);
      if(BOAT.sea&&SW.seg===M.seg&&Math.hypot(player.x-s.x,player.z-s.z)<28&&!uw){M.on=false;for(const t of M.ships)scene.remove(t.g);M.ships=[];toast('<span class="label">¡Te han visto!</span><br>Un vigía de la trirreme da la voz. Vuelve con el ilota para intentarlo otra vez, y cerca de los barcos ve por debajo del agua.');return;}}
    if(swim&&Math.hypot((player.x-M.isl.x)/62,(player.z-M.isl.z)/28)<1.15){M.on=false;for(const t of M.ships)scene.remove(t.g);M.ships=[];const pay=MODE==='roma'?0:12;state.obols+=pay;z.done.esf=1;save();updateStats();if(typeof sfxCoin==='function')sfxCoin();
      toast('<span class="label">¡Lo has conseguido!</span><br>Un espartano flaco sale de entre las rocas y coge el odre sin decir palabra. Tucídides cuenta que así, durante semanas, los sitiados aguantaron. +'+pay+' óbolos.');}
    else if(M.t<=0){M.on=false;for(const t of M.ships)scene.remove(t.g);M.ships=[];toast('Ha pasado demasiado tiempo: la marea ya no ayuda. Vuelve a intentarlo.');}}
  // sonido: el latido con poco aire, el silbido de los oídos
  if(uw&&typeof aOK==='function'&&aOK()){DV.hb-=dt;const low=DV.air/dvAirMax();if(low<0.35&&DV.hb<=0){DV.hb=0.45+low*1.6;dvThump();}if(DV.earP>0.6&&Math.random()<dt*1.5)dvWhistle();}
  dvHud();}
function dvThump(){const c=AUD.ctx,t=c.currentTime;for(const[dt2,f]of[[0,58],[0.16,48]]){const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(f,t+dt2);o.frequency.exponentialRampToValueAtTime(30,t+dt2+0.15);o.connect(envGain(t+dt2,0.35,0.01,0.18,AUD.master));o.start(t+dt2);o.stop(t+dt2+0.25);}}
function dvWhistle(){const c=AUD.ctx,t=c.currentTime,o=c.createOscillator();o.type='sine';o.frequency.value=3200+Math.random()*900;o.connect(envGain(t,0.03,0.05,0.5,AUD.master));o.start(t);o.stop(t+0.6);}
// ---------------- nadar: aire propio, piedra, presión, corrientes, frío y el relieve
{const row0=swRow;swRow=function(dt){const z=dvz(),sy=swSeaY(),wasSwim=SW.swim,d0=SW.depth;if(SW.swim)SW.air=999;   // el aire lo lleva este módulo
  const r=row0.apply(this,arguments);if(!BOAT.sea||!SW.swim){if(wasSwim&&!SW.swim){DV.stone=false;}return r;}
  const dive=keys.jump||SW.diveHold,under=player.camY<sy-0.1;
  // la piedra: baja el doble de rápido; se suelta al tocar el fondo
  if(DV.stone&&dive)SW.depth+=3*dt;
  // corrientes
  DV.curNow=null;if(under){const C=DV.cur.find(c=>c.seg===SW.seg&&Math.hypot(player.x-c.x,player.z-c.z)<c.r);if(C){const vx=Math.sin(C.a)*C.v,vz=Math.cos(C.a)*C.v;player.x+=vx*dt;player.z+=vz*dt;DV.curNow={x:vx,z:vz};if(!DV.curSaid){DV.curSaid=1;toast('Una corriente te arrastra. Nada de lado para salir de ella.');}}}
  // el relieve: no se atraviesa el fondo
  const bed=dvBed(player.x,player.z),maxD=sy-1.45-(bed+0.3);if(SW.depth>maxD){SW.depth=Math.max(0,maxD);if(DV.stone){DV.stone=false;dvPuff(player.x,bed,player.z);toast('Sueltas la piedra en el fondo.');}else if(Math.random()<dt*4)dvPuff(player.x,bed,player.z);}
  // presión en los oídos: bajar deprisa sin pararse a compensar
  const vd=(SW.depth-d0)/Math.max(dt,1e-3);if(vd>2.5&&SW.depth>6)DV.earP+=dt*(DV.stone?0.12:0.08)*(SW.depth/20);else DV.earP=Math.max(0,DV.earP-dt*(vd<0.5?0.35:0.05));
  if(DV.earP>1&&DV.earHurt<=0){DV.earHurt=4;DV.earP=0.5;DV.air=Math.max(1,DV.air-5);SW.depth=Math.max(0,SW.depth-1.5);toast('<span class="label">¡Los oídos!</span><br>Un dolor agudo: has bajado demasiado deprisa. Aristóteles cuenta que a los buceadores se les rompen los tímpanos. Para un momento a media bajada para que se igualen.');}
  DV.earHurt=Math.max(0,DV.earHurt-dt);if(DV.earHurt>0)SW.depth=Math.min(SW.depth,d0);
  // el aire: frío por debajo de veinte metros
  if(under){DV.air-=dt*(SW.depth>20?1.25:1);if(DV.air<=0){DV.air=dvAirMax();SW.depth=0;SW.swim=false;DV.stone=false;toast('Te falta el aire… Unas manos te suben a la superficie y te dejan junto a la barca. ¿Una nereida?');}
    if(Math.random()<dt*0.35)dvBubble(3,player.x,player.camY-0.2,player.z);}
  else DV.air=Math.min(dvAirMax(),DV.air+dt*8);
  if(dive&&d0<0.3&&SW.depth>=0.3)dvBubble(6,player.x,sy-0.5,player.z);
  BOAT.y=sy-1.45-SW.depth;player.feet=BOAT.y;return r;};}
{const tk0=swTick;swTick=function(dt){tk0(dt);try{dvTick(dt);}catch(e){if(!DV.err){DV.err=1;console.warn('buceo',e);}}};}
// al tirarse al agua: aire lleno y, si se lleva, la piedra
{const a0=swAction;swAction=function(){const a=a0.apply(this,arguments);const z=dvz(),sy=swSeaY();
  if(a&&a[0]==='Tirarse al agua'){const f=a[1];return[a[0]+(DV.useStone?' (con piedra)':''),()=>{f();DV.air=dvAirMax();DV.stone=DV.useStone;DV.earP=0;}];}
  if(BOAT.sea&&SW.swim&&player.camY<sy-1){
    for(const P of DV.picks){if(P.seg!==SW.seg||(z.pick[P.key]&&(state.day||1)-z.pick[P.key]<4))continue;if(Math.hypot(player.x-P.x,player.z-P.z,player.camY-1.2-P.y)<3.4){const N={sp:'una esponja',mu:'un múrex',co:'una rama de coral'}[P.kd];
        return['Coger '+N,()=>{z.pick[P.key]=state.day||1;z.inv[P.kd]++;save();dvPickVis();dvPuff(P.x,P.y,P.z);toast({sp:'Arrancas una esponja de la roca. Plinio dice que las más blandas y finas se llaman de Acaya (IX 148-150).',mu:'Coges un múrex: de su glándula sale la púrpura. Para teñir una sola túnica hacen falta miles (Plinio IX 125-141).',co:'Cortas una rama de coral: bajo el agua es blando y verde, dice Plinio, y se endurece y enrojece al sacarlo al aire (XXXII 22).'}[P.kd]+' Lo venderás en el próximo puerto.');}];}}
    for(const d of DV.digs){if(d.seg!==SW.seg||z.find[d.key])continue;if(Math.hypot(player.x-d.x,player.z-d.z,player.camY-1.2-d.y)<3)return['Escarbar en la arena',()=>{z.find[d.key]=1;z.inv.cg++;save();dvPickVis();dvPuff(d.x,d.y,d.z);const W=DV.wrecks.find(w=>w.seg===d.seg&&Math.hypot(w.x-d.x,w.z-d.z)<20);
        toast('<span class="label">Un hallazgo</span><br>Entre la arena aparece '+d.find+'.'+(W?' El barco llevaba '+W.cargo[0]+': '+W.cargo[1]+'.':'')+' Lo guardas para enseñarlo en puerto.');}];}
    if(DV.urinAt&&dvz().urin&&!dvz().urin.got&&Math.hypot(player.x-DV.urinAt.x,player.z-DV.urinAt.z,player.camY-1.2-DV.urinAt.y)<3)return['Atar la cuerda a '+dvz().urin.what,()=>{const U=dvz().urin;U.got=1;save();dvUrinMesh();toast('Atas la cuerda: desde la barca lo izas a bordo. Cóbralo en cualquier puerto.');}];}
  return a;};}
// vender en el puerto
{const l0=swLand;swLand=function(id){const ok=swMoorOf(id)||swPortOf(id);l0(id);if(!ok)return;const z=dvz(),ro=MODE==='roma',coin=sw2coin();
  setTimeout(()=>{let pay=0,msg=[];const pr=ro?{sp:3,mu:2,co:6,cg:4}:{sp:2,mu:1,co:4,cg:3},N={sp:'esponjas',mu:'múrex',co:'ramas de coral',cg:'hallazgos de pecio'};
    for(const k in pr)if(z.inv[k]){pay+=z.inv[k]*pr[k];msg.push(z.inv[k]+' '+N[k]);z.inv[k]=0;}
    if(z.urin&&z.urin.got){pay+=z.urin.pay;msg.push(z.urin.what+' para los urinatores');z.urin=null;}
    z.oil=3;if(pay){state.obols+=pay;save();updateStats();if(typeof sfxCoin==='function')sfxCoin();toast('<span class="label">Lo del fondo</span><br>Vendes '+msg.join(', ')+': +'+pay+' '+coin+'. Rellenas el frasco de aceite.');}else save();},1600);};}
// teclas: G (piedra sí o no), O (aceite), B (campana); solo en el mar
addEventListener('keydown',e=>{if(!BOAT.sea||ui!=='play'||!SW.seg)return;const z=dvz();
  if(e.code==='KeyG'){DV.useStone=!DV.useStone;toast(DV.useStone?'Te tirarás al agua con una piedra de lastre: bajarás el doble de rápido y ahorrarás aire. Opiano cuenta que así bajaban los esponjeros.':'Te tirarás al agua sin piedra.');e.stopImmediatePropagation();}
  else if(e.code==='KeyO'&&SW.swim&&SW.uw){if(z.oil>0&&DV.oilT<=0){z.oil--;DV.oilT=20;save();dvBubble(5,player.x,player.camY,player.z);toast('Escupes el aceite que llevabas en la boca: el agua se aclara y ves mejor el fondo (Plinio II 234). Te quedan '+z.oil+'.');}else if(z.oil<=0)toast('No te queda aceite: rellénalo en un puerto.');e.stopImmediatePropagation();}
  else if(e.code==='KeyB'&&!SW.swim&&z.bell){if(DV.bellOn){scene.remove(DV.bellOn.g);DV.bellOn=null;toast('Subes la campana.');}else{const x=SW.bg.position.x,zz=SW.bg.position.z,y=dvBed(x,zz),g=new THREE.Group(),c=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.8,2.8,16,1,true),new THREE.MeshLambertMaterial({color:'#9a6a3a',side:THREE.DoubleSide}));c.position.y=1.4;g.add(c);
      const cap=new THREE.Mesh(new THREE.SphereGeometry(1.3,16,8,0,TAU,0,Math.PI/2),lam('#9a6a3a'));cap.position.y=2.8;g.add(cap);const rope=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,swSeaY()-y-3,4),lam('#c9b48b'));rope.position.y=(swSeaY()-y+3)/2;g.add(rope);g.position.set(x,y,zz);scene.add(g);
      DV.bellOn={g,x,y,z:zz,seg:SW.seg};try{atReg(x,zz,y+1.5,'uw_bell',4);}catch(e2){}toast('Bajas la campana hasta el fondo, bajo la barca. Métete dentro para respirar.');}e.stopImmediatePropagation();}},true);
// el indicador: profundidad, aire, oídos, piedra, aceite y lo que llevas
function dvHud(){if(!$('dvHud')){const d=document.createElement('div');d.id='dvHud';document.body.appendChild(d);const s=document.createElement('style');s.textContent='#dvHud{position:fixed;left:50%;bottom:118px;transform:translateX(-50%);z-index:30;pointer-events:none;font:600 13px var(--f-body,serif);color:#e8f6f8;text-shadow:0 1px 2px #000;text-align:center;min-width:260px}#dvHud .b{height:8px;border-radius:4px;background:rgba(0,0,0,.4);margin:3px 0;overflow:hidden}#dvHud .b i{display:block;height:100%;background:#8fd4e8}#dvHud .b.lo i{background:#e86a50}#dvHud .e i{background:#e8c060}#swHud .air{display:none}';document.head.appendChild(s);}
  const H=$('dvHud'),z=dvz();if(!(BOAT.sea&&SW.seg&&ui==='play')){if(H.innerHTML)H.innerHTML='';DV.hud='';return;}
  const sy=swSeaY(),dep=SW.swim?Math.max(0,sy-player.camY):0,a=DV.air/dvAirMax(),inv=['sp','mu','co','cg'].filter(k=>z.inv[k]).map(k=>z.inv[k]+' '+{sp:'esponjas',mu:'múrex',co:'coral',cg:'hallazgos'}[k]).join(' · ');
  const tst=DV.test?(DV.test.k==='aguante'?'Aguante: '+DV.test.t.toFixed(0)+' / 25 s':DV.test.k==='conchas'?'Conchas '+DV.test.n+'/3 · '+DV.test.t.toFixed(0)+' s':'Aros '+DV.test.n+'/4 · '+DV.test.t.toFixed(0)+' s'):(DV.mis&&DV.mis.on?'Odres de Esfacteria · '+DV.mis.t.toFixed(0)+' s':'');
  const k=[SW.swim?Math.round(dep):'',Math.round(a*20),Math.round(DV.earP*10),DV.stone,DV.useStone,z.oil,DV.oilT>0,inv,tst,!!z.bell,!!DV.bellOn].join('|');if(k===DV.hud)return;DV.hud=k;
  H.innerHTML=(SW.swim?'<div>'+Math.round(dep)+' m'+(DV.stone?' · con piedra':'')+(DV.oilT>0?' · aceite':'')+'</div><div class="b'+(a<0.3?' lo':'')+'"><i style="width:'+(a*100).toFixed(0)+'%"></i></div>'+(DV.earP>0.25?'<div class="b e"><i style="width:'+Math.min(100,DV.earP*100).toFixed(0)+'%"></i></div><small>oídos: para a media bajada</small>':''):'')+
   (tst?'<div>'+tst+'</div>':'')+(inv?'<div><small>'+inv+'</small></div>':'')+'<div><small>G: piedra '+(DV.useStone?'sí':'no')+' · O: aceite ('+z.oil+')'+(z.bell?' · B: campana'+(DV.bellOn?' (abajo)':''):'')+'</small></div>';}
// Modo Atención: lo del fondo
Object.assign(ATX_DEF,{
 uw_posidonia:['Pradera de posidonia','planta del mar','No es un alga: es una planta con flores que vive bajo el agua, con hojas como cintas. Sus hojas secas se amontonan en las playas.','Plinio la llama «alga» y dice que con ella se envuelven los vasos y las ánforas para que no se rompan en los barcos.',0.8,30],
 uw_salpa:['Un banco de salpas','peces de rayas doradas','Pastan la posidonia en grupo. Los pescadores dicen que su carne huele a algas.','Los romanos las pescan, pero no las aprecian: dicen que hay que golpearlas con palos para ablandarlas.',0.5,30],
 uw_dorada:['Doradas','peces de frente dorada','Tienen una mancha dorada entre los ojos. Aristóteles cuenta que se esconden en invierno.','Sergio Orata, el que inventó los criaderos de ostras, recibió su apodo de las doradas (aurata).',0.5,30],
 uw_mero:['Un mero','pez grande de las rocas','Vive solo, escondido en una cueva de las rocas, y crece hasta tener el tamaño de un hombre.','Un pez muy apreciado en las mesas ricas de Roma.',0.8,25],
 uw_pulpo:['Un pulpo','en su cueva','Aristóteles dice que el pulpo es un animal estúpido, porque se acerca a la mano del pescador, pero también que cambia de color para esconderse.','Plinio cuenta el caso de un pulpo enorme de Carteya que salía del mar para robar salazón de los depósitos.',0.4,15],
 uw_sp:['Esponjas','en las rocas','Aristóteles discute si son animales o plantas; dice que sienten, porque se encogen cuando las van a arrancar.','Se usan para lavarse, para limpiar, para beber en los cascos de los soldados y para pintar.',0.4,12],
 uw_mu:['Múrex','caracoles de la púrpura','De una glándula de estos caracoles sale el tinte más caro del mundo, la púrpura. Huelen fatal cuando se pudren en las tinas.','La púrpura de Tiro es la mejor. Solo el emperador y los senadores llevan bandas de púrpura en la toga.',0.4,12],
 uw_co:['Coral','ramas rojas en las rocas','Los griegos dicen que nació de la sangre de la Medusa: Perseo dejó la cabeza sobre unas algas y se volvieron de piedra.','Plinio cuenta que los indios lo aprecian tanto como los romanos las perlas, y que se cuelga al cuello de los niños como amuleto (XXXII 21-24).',0.4,12],
 uw_wreck:['Un pecio','barco hundido','Cada barco hundido es una cápsula del tiempo: la carga, la vajilla de los marineros, las monedas, el ancla.','Los barcos de carga romanos llevan miles de ánforas, apiladas en capas. Los urinatores bajan a rescatar lo que pueden.',1,40],
 uw_ruin:['Ruinas bajo el agua','una ciudad hundida','Una ciudad que se tragó el mar.','Una ciudad que se tragó el mar.',2,40],
 uw_bell:['La campana de buceo','una caldera boca abajo','Una caldera de bronce boca abajo guarda el aire dentro: los buceadores respiran de ella en el fondo.','Una caldera de bronce boca abajo guarda el aire dentro: los buceadores respiran de ella en el fondo.',1.5,15],
 uw_dogfish:['Un perro de mar','un tiburón pequeño','Opiano cuenta que los esponjeros temen a los «perros» del mar, que rondan a los buceadores.','Plinio dice que los esponjeros luchan con los perros de mar, que se acercan sobre todo a los que se quedan quietos; aquí es al revés: el que se mueve atrae su curiosidad.',0.8,30]});
// ventana del vaivén: la cámara se mece un poco bajo el agua
{const rr0=renderer.render.bind(renderer);renderer.render=function(sc,cam){if(SW.uw&&cam===camera){const z0=cam.rotation.z;cam.rotation.z=z0+Math.sin(DV.t*0.9)*0.012;cam.updateMatrixWorld();const r=rr0(sc,cam);cam.rotation.z=z0;return r;}return rr0(sc,cam);};}
