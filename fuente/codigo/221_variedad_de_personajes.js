// ============================================================ MÁS VARIEDAD EN LA GENTE (vídeo 21/11: «muchos parecen Lisias»)
// Medido en Atenas: de 348 personas, las 147 mujeres llevaban la ropa del mismo color (el material se llama 'quiton.001' y el tinte
// de 184 solo miraba 'quiton') y los 194 hombres, tres tonos de blanco. Aquí cada persona recibe telas de una paleta de tintes de la época,
// con un poco de variación de tono, y algunos detalles más:
//  · Atenas (h. 386 a.C.): quitón de lana o lino casi siempre sin teñir o claro; el himation, de colores apagados (pardo, gris, ocre,
//    rojo de rubia, azul de glasto, verde oliva). Las mujeres, más color: azafrán (krokotos), rojo, azul, verde, violáceo suave.
//    El exomis de los trabajadores, de lana sin teñir o parda. Fuentes (parafraseadas): T. Hope, «Costumes of the Greeks and Romans»
//    (1812, láminas); L. Llewellyn-Jones (ed.), «Women's Dress in the Ancient Greek World» (2002), sobre el krokotos y los tintes;
//    Plinio, Historia natural XXXV y IX, sobre la rubia, el glasto y la púrpura (cara: aquí casi no se usa).
//  · Roma (80 d.C.): túnica blanca o sin teñir (parda la de los trabajadores); la toga, blanca (toga virilis); la estola y la palla de las
//    matronas, de colores (Ovidio, Arte de amar III 169-192, enumera los tintes de moda: azul cielo, verde agua, azafrán, amatista…).
//  · Algunos hombres jóvenes de Atenas sin barba (los efebos se afeitaban o aún no tenían barba; el adulto ateniense llevaba barba).
//  · El gorro de fieltro (pilos) del trabajador, de varios tonos.
const VAR={mats:new Map(),n:0,
  P:{atenas:{quiton:['#efe6d2','#e8dcc0','#f4efe4','#ddd2bb','#d8cdb4','#c9b99a'],
             himation:['#7a5a3c','#8b6d4f','#6d6a62','#8a7a5a','#9c4a35','#4f5f78','#5e6b48','#a08254','#5a4a3e','#7d3f36','#46506a'],
             mujer:['#c9952e','#d8a640','#a8443a','#8e3a3a','#4f6688','#5d7b8a','#6a7d4f','#8a6a8c','#ece3d0','#e8d5b0','#b8664a','#7b8fa6'],
             exomis:['#a89474','#8f7c5e','#7a6a52','#b5a382','#6e6150','#9a8a6a','#857055'],
             pilos:['#8a7350','#6e5a3e','#5a4a36','#9a8a6a','#7a6a5a']},
     roma:{tunica:['#efe9dc','#e6dccb','#d9ccb2','#c7b799','#a8916e','#8c7a60'],
           estola:['#5d86b0','#6f9c8c','#c79a3c','#a24a4a','#7a5f8e','#e3d6bc','#4f7a5a','#b86b4f','#8aa6c0'],
           palla:['#3f5f86','#5a7a5a','#8a4a4a','#6a5080','#a07a3a','#2f4a5a','#7a6a5a','#c2b08a']}}};
function varRnd(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%100000)/100000;};}
function varMat(m,hex,j){const key=m.uuid+'|'+hex+'|'+j;let n=VAR.mats.get(key);if(n)return n;n=m.clone();const c=new THREE.Color(hex);c.multiplyScalar(0.9+j*0.05);n.color=c;n.userData=Object.assign({},m.userData,{varTint:1});VAR.mats.set(key,n);return n;}
function varApply(g,kind,c){const R=varRnd(Math.floor(Math.random()*1e9)),pick=a=>a[Math.floor(R()*a.length)],j=Math.floor(R()*3);c=c||{};
  const A=VAR.P.atenas,Ro=VAR.P.roma,ro=MODE==='roma';let beardless=false;
  if(!ro&&(kind==='ciudadano'||kind==='obrero')&&!c.old&&R()<0.13)beardless=true;
  const qt=pick(A.quiton),hi=pick(A.himation),mu=pick(A.mujer),mu2=pick(A.himation.concat(A.mujer)),ex=pick(A.exomis),pi=pick(A.pilos),tu=pick(kind==='tunicado'?Ro.tunica.slice(2):Ro.tunica.slice(0,4)),es=pick(Ro.estola),pa=pick(Ro.palla);
  // un color propio y fuerte (el rojo de Telecleo, el de un personaje con nombre) se respeta; los blancos y crudos por defecto se cambian
  const strong=h=>{if(typeof h!=='string'&&typeof h!=='number')return false;try{const C=new THREE.Color(h),hsl={};C.getHSL(hsl);return hsl.s>0.3&&hsl.l<0.6;}catch(e){return false;}};
  const keepCh=strong(c.chiton),keepHi=strong(c.himation)||strong(c.veil);
  g.traverse(o=>{if(!o.isMesh||!o.material||Array.isArray(o.material))return;const nm=(o.material.name||'').replace(/\.\d+$/,'');
    if((keepCh&&/^(quiton|exomis|tunica|estola)$/.test(nm))||(keepHi&&/^(himation|palla)$/.test(nm)))return;
    if(kind==='mujer'){if(nm==='quiton')o.material=varMat(o.material,mu,j);else if(nm==='himation')o.material=varMat(o.material,mu2,(j+1)%3);}
    else if(kind==='ciudadano'){if(nm==='quiton')o.material=varMat(o.material,qt,j);else if(nm==='himation')o.material=varMat(o.material,hi,j);}
    else if(kind==='obrero'){if(nm==='exomis')o.material=varMat(o.material,ex,j);else if(nm==='fieltro')o.material=varMat(o.material,pi,j);}
    else if(kind==='romana'){if(nm==='estola')o.material=varMat(o.material,es,j);else if(nm==='palla')o.material=varMat(o.material,pa,j);else if(nm==='tunica')o.material=varMat(o.material,pick(Ro.tunica.slice(0,3)),j);}
    else if(kind==='togado'){if(nm==='tunica')o.material=varMat(o.material,pick(Ro.tunica.slice(0,3)),j);}
    else if(kind==='tunicado'){if(nm==='tunica')o.material=varMat(o.material,tu,j);}});
  if(beardless){g.userData.beardless=1;try{BP_YOUNG.add(g);}catch(e){}}
  try{varHair(g,R);}catch(e){}
  VAR.n++;return g;}
// color de pelo real: el tinte de antes multiplicaba una textura muy oscura y el rubio, el canoso o el pelirrojo casi no se veían.
// Ahora se elige un color de pelo y el tinte se calcula sobre el color medio de la textura (pelo y barba, el mismo).
// Reparto aproximado para el Mediterráneo antiguo: casi todos morenos o castaños; pocos pelirrojos o rubios (tracios, escitas, galos,
// germanos; y el rubio teñido de moda, Menandro y Ovidio); canas en algunos adultos.
VAR.HAIR=[['#1f1a17',30],['#3b2a1f',30],['#5a3e2a',14],['#7a5a3c',6],['#8e3f1f',3],['#b8955a',3],['#8f8a84',9],['#c9c5bf',5]];
VAR.avg=new Map();
function varAvg(map){const k=map.uuid;if(VAR.avg.has(k))return VAR.avg.get(k);let r=null;try{const im=map.image;if(im&&im.width){const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');x.drawImage(im,0,0,16,16);const d=x.getImageData(0,0,16,16).data;let a=[0,0,0];for(let i=0;i<d.length;i+=4){a[0]+=d[i];a[1]+=d[i+1];a[2]+=d[i+2];}r=a.map(v=>v/256/255);}}catch(e){}VAR.avg.set(k,r);return r;}
function varLin(v){return v>0.04045?Math.pow((v+0.055)/1.055,2.4):v/12.92;}
function varHair(g,R){let tot=0;for(const h of VAR.HAIR)tot+=h[1];let t=R()*tot,hex=VAR.HAIR[0][0];for(const h of VAR.HAIR){t-=h[1];if(t<=0){hex=h[0];break;}}
  const c=new THREE.Color(hex),tg=[c.r,c.g,c.b];
  g.traverse(o=>{if(!o.isMesh||!o.material||!o.material.map)return;const mn=(o.material.name||'');if(!/_(pelo|barba)$/.test(mn))return;const av=varAvg(o.material.map);if(!av)return;
    const key=o.material.map.uuid+'|hair|'+hex;let m=VAR.mats.get(key);if(!m){m=o.material.clone();m.color=new THREE.Color(...tg.map((v,i)=>v/Math.max(0.01,varLin(av[i]))));VAR.mats.set(key,m);}o.material=m;});}
{const f=bpMake;bpMake=function(kind,c){const g=f.apply(this,arguments);if(g&&!(c&&(c.noVary||c.keepColors)))try{varApply(g,kind,c);}catch(e){console.warn('varApply',e);}return g;};}
