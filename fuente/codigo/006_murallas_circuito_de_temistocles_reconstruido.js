// ============================================================ murallas (circuito de Temístocles, reconstruido por Conón)
const WALLC={x:-250,z:-170};
const wallR=th=>720+45*Math.sin(3*th+1);
const WN=200;
const wallPts=[];for(let i=0;i<WN;i++){const th=-Math.PI+i/WN*TAU;const r=wallR(th);wallPts.push([WALLC.x+Math.cos(th)*r,WALLC.z+Math.sin(th)*r,th]);}
// ángulos de las puertas alrededor de WALLC, revisados con el plano de Judeich (Topographie von Athen, 1905, fig. 9): Diocares al nordeste, Melítide al suroeste junto a la colina de las Musas,
// y el Dípilon y la Puerta Sagrada al noroeste del Ágora (antes estaban al norte)
const GATE_ANG={dipylon:-2.62,sagrada:-2.70,este:-0.6,norte:-1.5,pireo:2.3,sur:0.65,eria:-1.95,diomea:0.33,halade:1.2,melitides:1.88};
const gateSeg={};
for(const k in GATE_ANG){let best=0,bd=9;for(let i=0;i<WN;i++){const a=wallPts[i],b=wallPts[(i+1)%WN];const mid=Math.atan2((a[1]+b[1])/2-WALLC.z,(a[0]+b[0])/2-WALLC.x);const d=Math.abs(wrapA(mid-GATE_ANG[k]));if(d<bd){bd=d;best=i;}}gateSeg[k]=best;}
const GATES={};for(const k in gateSeg){const a=wallPts[gateSeg[k]],b=wallPts[(gateSeg[k]+1)%WN];const x=(a[0]+b[0])/2,z=(a[1]+b[1])/2,ol=Math.hypot(x-WALLC.x,z-WALLC.z);GATES[k]={x,z,dx:b[0]-a[0],dz:b[1]-a[1],ox:(x-WALLC.x)/ol,oz:(z-WALLC.z)/ol};}
function insideWalls(x,z,margin=0){const th=Math.atan2(z-WALLC.z,x-WALLC.x);return Math.hypot(x-WALLC.x,z-WALLC.z)<wallR(th)-margin;}
const LW_DIR=(()=>{const l=Math.hypot(-0.8,0.6);return[-0.8/l,0.6/l];})();
const LW=[2.05,2.6].map(th=>{const r=wallR(th);return[WALLC.x+Math.cos(th)*r,WALLC.z+Math.sin(th)*r];});

const D=GATES.dipylon,SG=GATES.sagrada,PG=GATES.pireo,EG=GATES.este,NG=GATES.norte,SGATE=GATES.sur;

// ---- el Pireo: marco de referencia junto a la costa (u: a lo largo de la costa hacia el sureste; v: tierra adentro)
const PIR0=(()=>{const t=(1750-(PG.z-PG.x))/1.4;return{x:PG.x+LW_DIR[0]*t,z:PG.z+LW_DIR[1]*t};})();
const pirP=(u,v)=>[PIR0.x+Math.SQRT1_2*(u+v),PIR0.z+Math.SQRT1_2*(u-v)];
const PIR_BAYS=[{id:'zea',u:96,v:40,R:24},{id:'muniquia',u:150,v:30,R:15}].map(b=>{const p=pirP(b.u,b.v);return Object.assign(b,{x:p[0],z:p[1]});});
const PIR_HILL=(()=>{const p=pirP(150,72);return{x:p[0],z:p[1]};})();
const BEND={x:PIR_HILL.x+10,z:PIR_HILL.z-10};   // el Bendideion, en una explanada junto a la cima de Muniquia, del lado de tierra (el otro lado cae a la dársena)
function pirCarve(x,z,h){if(Math.abs(x-PIR0.x)>420||Math.abs(z-PIR0.z)>420)return h;
  const h0=h;h+=bump(x,z,PIR_HILL.x,PIR_HILL.z,38,20);   // la colina de Muniquia
  {const d=Math.hypot(x-BEND.x,z-BEND.z);if(d<22){const t=h0+bump(BEND.x,BEND.z,PIR_HILL.x,PIR_HILL.z,38,20);h=lerp(t,h,sstep(clamp((d-11)/11,0,1)));}}   // explanada del Bendideion
  for(const b of PIR_BAYS){const d=Math.hypot(x-b.x,z-b.z);if(d<b.R+10){const t=-6+6.4*sstep(clamp((d-b.R*0.9)/(b.R*0.1+10),0,1));if(t<h)h=t;}
    {const dx=x-PIR0.x,dz=z-PIR0.z,u=Math.SQRT1_2*(dx+dz),v=Math.SQRT1_2*(dx-dz);if(Math.abs(u-b.u)<7&&v<b.v&&v>-40){const t=-5.5+5.3*sstep(clamp((Math.abs(u-b.u)-4)/4,0,1));if(t<h)h=t;}}}   // el canal de entrada
  return h;}
function pirWet(x,z){for(const b of PIR_BAYS){if(Math.hypot(x-b.x,z-b.z)<b.R+10)return true;const dx=x-PIR0.x,dz=z-PIR0.z,u=Math.SQRT1_2*(dx+dz),v=Math.SQRT1_2*(dx-dz);if(Math.abs(u-b.u)<9&&v<b.v&&v>-40)return true;}return false;}
function pirIn(x,z){if(MODE!=='atenas')return false;const dx=x-PIR0.x,dz=z-PIR0.z,u=Math.SQRT1_2*(dx+dz),v=Math.SQRT1_2*(dx-dz);return u>-235&&u<185&&v>-80&&v<210;}
// ---- los barrios (demos) de la ciudad: orientación de su trama, tamaño de las casas y proporción de casas de dos pisos
const ATH_DEMES=[
 {id:'melite',name:'Melite',gr:'ΜΕΛΙΤΗ',sub:'Barrio acomodado entre la Pnyx, las Ninfas y el Ágora: aquí tuvo su casa Temístocles, junto al templo de Ártemis Aristobule que él mismo fundó.',x:-560,z:-150,r:200,a:0.35,p:15,two:0.4,blk:5},
 {id:'koile',name:'Coile',gr:'ΚΟΙΛΗ',sub:'«La hondonada», entre la Pnyx y la colina de las Musas: casas pequeñas de gente humilde junto al camino del Pireo.',x:-470,z:290,r:190,a:0.75,p:10,two:0,blk:6},
 {id:'kollytos',name:'Colito',gr:'ΚΟΛΛΥΤΟΣ',sub:'Barrio al sur de la Acrópolis; según algunos, aquí nació Platón.',x:-130,z:300,r:180,a:0.2,p:13,two:0.25,blk:5},
 {id:'kydathenaion',name:'Cidateneo',gr:'ΚΥΔΑΘΗΝΑΙΟΝ',sub:'«La Atenas gloriosa», al norte de la Acrópolis y al este del Ágora: el barrio de Aristófanes.',x:-80,z:-360,r:220,a:0.5,p:14,two:0.3,blk:5},
 {id:'skambonidai',name:'Escambónidas',gr:'ΣΚΑΜΒΩΝΙΔΑΙ',sub:'Barrio del norte de la ciudad, al norte del Ágora.',x:-420,z:-660,r:190,a:0.3,p:12,two:0.2,blk:5},
 {id:'kerameis',name:'Cerámico interior',gr:'ΚΕΡΑΜΕΙΣ',sub:'Los alfareros, entre el Dípilon y el Ágora: talleres, hornos y humo.',x:-735,z:-470,r:140,a:0.62,p:11,two:0.05,blk:4},
 {id:'diomeia',name:'Diomea',gr:'ΔΙΟΜΕΙΑ',sub:'Barrio del este, camino del Cinosarges, donde se celebra a Heracles.',x:330,z:60,r:200,a:0.1,p:12,two:0.15,blk:5}];
function demeAt(x,z){if(MODE!=='atenas')return null;let b=null,bd=1e9;for(const d of ATH_DEMES){const q=Math.hypot(x-d.x,z-d.z)/d.r;if(q<1&&q<bd){bd=q;b=d;}}return b;}

const ACADEMY={x:-1146,z:-1219};   // al norte-noroeste del Dípilon, a ~1,5 km en la realidad (aquí comprimido)
// el Dromos: el camino ancho del Dípilon a la Academia, con las tumbas y el cementerio público a los lados
const DROMOS=(()=>{const dx=ACADEMY.x-D.x,dz=ACADEMY.z-D.z,l=Math.hypot(dx,dz);return{x:D.x,z:D.z,ox:dx/l,oz:dz/l,L:l};})();
const LYCEUM={x:640,z:-110};
const CYNO={x:520,z:400},OLY={x:255,z:195};
const ELEUS={x:-198,z:-175};   // al pie de la Acrópolis, al este de la subida de la Vía Panatenaica
ROADS.push({name:'Vía Panatenaica',w:5,pts:[[D.x,D.z],[D.x-D.ox*80,D.z-D.oz*80],AL(-150,-150),AL(-88,-132),AL(-28,-88),AL(60,30),AL(140,118),[-226,-100],[-232,-15],[-238,-2]]});
ROADS.push({w:4.5,pts:[[D.x,D.z],[ACADEMY.x-DROMOS.ox*40,ACADEMY.z-DROMOS.oz*40]]});
ROADS.push({w:3,pts:[[SG.x,SG.z],[SG.x+SG.ox*420+90,SG.z+SG.oz*420]]});
ROADS.push({w:3.5,pts:[AL(-58,96),[-548,-150],[-538,-40],[PNYX.x+12,PNYX.z-34]]});
ROADS.push({w:4,pts:[[-228,-128],[-120,-150],[60,-250],[EG.x-60,EG.z+110],[EG.x,EG.z],[EG.x+EG.ox*90,EG.z+EG.oz*90],[LYCEUM.x-28,LYCEUM.z]]});
ROADS.push({w:3.5,pts:[[-238,-2],[-205,80],[-112,114],[-40,132],[-30,200],[80,214],[150,196],[190,236],[SGATE.x,SGATE.z],[CYNO.x-26,CYNO.z]]});
ROADS.push({w:4,pts:[[PNYX.x+12,PNYX.z-34],[-610,170],[PG.x,PG.z],[PG.x+LW_DIR[0]*1600,PG.z+LW_DIR[1]*1600]]});
ROADS.push({w:3,pts:[AL(-40,-162),[-520,-560],[NG.x,NG.z],[NG.x-20,NG.z-420]]});

// ============================================================ malla del terreno
const INNER={x:-300,z:-260,size:2200};   // en Roma pasa a {0,−170,2800} antes de construir el terreno
const ROAD_C=new THREE.Color('#cdb791'),GRASS_C=new THREE.Color('#9a9258'),GREEN_C=new THREE.Color('#7b8148'),EARTH_C=new THREE.Color('#b69a6b'),ROCK_C=new THREE.Color('#a69a87'),SAND_C=new THREE.Color('#d8c8a0'),AGORA_C=new THREE.Color('#c9b48b');
function buildTerrain(size,seg,cx,cz,inner){
  const g=new THREE.PlaneGeometry(size,size,seg,seg);g.rotateX(-Math.PI/2);
  const pos=g.attributes.position,n=pos.count,col=new Float32Array(n*3);const c=new THREE.Color();
  if(inner)INNER.mesh=size;const half=(INNER.mesh||INNER.size)/2-2,step=size/seg;   // la malla cercana pasa un poco del borde: así la lejana no asoma sobre las salidas
  for(let i=0;i<n;i++){
    const x=pos.getX(i)+cx,z=pos.getZ(i)+cz;
    let h=displayH(x,z);
    const isIn=Math.abs(x-INNER.x)<half&&Math.abs(z-INNER.z)<half;
    // la malla lejana, por debajo de la cercana: cada vértice baja por debajo del punto más bajo del suelo real a su alrededor,
    // para que sus triángulos (de más de 100 m) no asomen donde una colina linda con una zona allanada (el Capitolio junto al Foro; el Pireo)
    const edgeD=half-Math.max(Math.abs(x-INNER.x),Math.abs(z-INNER.z));   // junto al borde de la malla cercana, la lejana conserva la altura real: así empalman sin corte
    if(!inner&&isIn&&edgeD>step*1.05){let mn=h;for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const v=displayH(x+a*step/2,z+b*step/2);if(v<mn)mn=v;}h=Math.min(h-(pirIn(x,z)?40:8),mn-3);}
    pos.setXYZ(i,x,h,z);
    const RH=MODE==='roma'?romaH:rawH;
    const sl=(Math.abs(RH(x+2,z)-RH(x-2,z))+Math.abs(RH(x,z+2)-RH(x,z-2)))/4;
    const nn=fbm(x*0.05,z*0.05);
    c.copy(GRASS_C).lerp(GREEN_C,clamp(nn*1.6-0.4,0,1));
    if(MODE==='roma'){romaColor(x,z,h,sl,c,inner&&isIn);const v=0.94+hash(x*0.37,z*0.53)*0.1;col[i*3]=c.r*v;col[i*3+1]=c.g*v;col[i*3+2]=c.b*v;continue;}
    {const ft=fieldAt(x,z);if(ft)c.lerp(FIELD_C[ft],0.8);}
    if(insideWalls(x,z))c.lerp(EARTH_C,0.55);
    if(Math.hypot(x-AG.x,z-AG.z)<135)c.lerp(AGORA_C,0.85);
    if(h<0.8&&(z-x)>1650)c.lerp(SAND_C,0.8);
    c.lerp(ROCK_C,clamp((sl-0.45)*1.6,0,1));
    if(inner&&isIn){const rd=roadDist(x,z);if(rd<1.5)c.lerp(ROAD_C,clamp(1-(rd+0.5)/2,0,1));}
    if(inCavea(x,z))c.set('#a88f68');
    const v=0.94+hash(x*0.37,z*0.53)*0.1;
    col[i*3]=c.r*v;col[i*3+1]=c.g*v;col[i*3+2]=c.b*v;
  }
  g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();
  const m=new THREE.Mesh(g,terrainMat());m.receiveShadow=inner;scene.add(m);return m;
}

// ============================================================ columnas instanciadas (dóricas y jónicas)
const COLS=[],ICOLS=[],CCOLS=[];
function addColumn(x,y,z,r,h,a,type,noCollide){(type==='ionic'?ICOLS:type==='corinthian'?CCOLS:COLS).push([x,y,z,r,h,a||0]);if(!noCollide)addCirc(x,z,r*1.05);}
