// ============================================================ ROMA, AÑO 80 d.C.: relieve
// Origen en el centro del Foro. x = este, z = sur. Distancias comprimidas (más o menos a la mitad), edificios a tamaño real.
// Colinas: [cx, cz, rx, rz (meseta), altura, borde (fracción del radio que ocupa la ladera)]
// Alturas sobre el Foro antiguo (hacia 12 m s. n. m., más bajo que hoy por el relleno de los valles): Capitolio ~34 m (46 s. n. m.),
// Arx ~37, Palatino ~39, Aventino ~35, Celio ~38, Esquilino (Opio) ~44, Quirinal ~49, Viminal ~48 (cotas de Lanciani, Forma Urbis,
// y de Coarelli, Guida archeologica di Roma). El Quirinal, el Viminal y el Esquilino se subieron en v273 (antes 38, 34 y 34),
// con laderas algo más anchas para que la pendiente no crezca con las distancias comprimidas.
const RHILLS=[
 [-228,22,52,44,32,0.42],    // Capitolio: el Capitolium (cumbre sur, con el templo de Júpiter)
 [-218,-108,42,34,38,0.42],  // el Arx (cumbre norte, la más alta, con Juno Moneta y el auguraculum)
 [-214,-42,38,30,21,0.5],    // el Asylum, la hondonada entre las dos cumbres, tras el Tabularium
 [40,195,160,82,34,0.7],     // Palatino: más ancho de norte a sur (Lanciani, láms. 29 y 35)
 [-250,590,170,120,30,0.5],  // Aventino
 [520,330,150,95,28,0.6],    // Celio
 [470,-260,200,100,42,0.66], // Esquilino (Opio)
 [-150,-600,220,90,47,0.68], // Quirinal
 [180,-640,150,80,44,0.68],  // Viminal
 [-1400,250,150,600,62,0.8]  // Janículo
];
// el Tíber: [z, x] del centro del cauce, de norte a sur; rodea el Campo de Marte por el oeste y pasa junto a la isla
// al sur de la isla el río tuerce al este y pasa junto al Foro Boario y al pie del Aventino (Lanciani, láms. 28 y 34)
const RIV=[[-1700,-760],[-1400,-800],[-1100,-880],[-800,-1080],[-500,-1100],[-200,-900],[50,-640],[235,-520],[350,-515],[470,-468],[580,-478],[700,-600],[1000,-700],[1400,-780]];
function romaRiverX(z){if(z<=RIV[0][0])return RIV[0][1];for(let i=0;i<RIV.length-1;i++){const a=RIV[i],b=RIV[i+1];if(z<=b[0]){const t=(z-a[0])/(b[0]-a[0]);return lerp(a[1],b[1],sstep(t)*0.35+t*0.65);}}return RIV[RIV.length-1][1];}
function romaRiverW(z){return 34+38*Math.exp(-Math.pow((z-250)/120,2));}   // más ancho junto a la isla
function romaRiverDist(x,z){return Math.abs(x-romaRiverX(z));}
const ISLA={x:-520,z:250,rx:30,rz:92};
function inIsla(x,z,m){return Math.hypot((x-ISLA.x)/(ISLA.rx+(m||0)),(z-ISLA.z)/(ISLA.rz+(m||0)))<1;}
function romaInUrbs(x,z){
  if(romaRiverDist(x,z)<romaRiverW(z)+6)return inIsla(x,z);
  if(Math.hypot((x+80)/1000,(z+150)/850)<1&&x>romaRiverX(z))return true;
  return x<romaRiverX(z)&&x>romaRiverX(z)-430&&z>-260&&z<820;   // Trastévere
}
// zonas llanas: [cx, cz, rx, rz, altura, borde] (superelipse)
const CIRC_A=-0.349;   // el Circo Máximo, girado unos 20° respecto al eje este-oeste del juego (Lanciani, Forma Urbis, lám. 35)
const RFLATS=[
 [0,0,122,64,0.6,0.22],        // Foro Romano
 [60,-165,200,95,1.0,0.2],     // foros imperiales
 [65,405,320,78,1.0,0.12,-0.349],     // Circo Máximo (girado, CIRC_A)
 [480,-128,78,62,8,0.32],      // terraza de las Termas de Tito
 [-430,120,90,70,1.2,0.4],     // Velabro
 [-410,250,58,95,1.2,0.35],    // Foro Boario, hasta la Porta Trigemina
 [600,359,16,34,31.6,0.3],     // la domus visitable del Celio
 [470,359,16,34,31.6,0.3]      // la casa de la novia de la boda
];
const CLIVUS=[[-86,4],[-118,7],[-140,12],[-160,19],[-180,27],[-200,30]];
function clivusAt(x,z){let best=1e9,tt=0,acc=0,tot=0;for(let i=0;i<CLIVUS.length-1;i++)tot+=Math.hypot(CLIVUS[i+1][0]-CLIVUS[i][0],CLIVUS[i+1][1]-CLIVUS[i][1]);
  for(let i=0;i<CLIVUS.length-1;i++){const a=CLIVUS[i],b=CLIVUS[i+1],dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz),u=clamp(((x-a[0])*dx+(z-a[1])*dz)/(L*L),0,1),d=Math.hypot(x-a[0]-u*dx,z-a[1]-u*dz);if(d<best){best=d;tt=(acc+u*L)/tot;}acc+=L;}return{d:best,t:tt};}
function romaH(x,z){
  let h=1.8+(fbm(x*0.006,z*0.006)-0.45)*5;
  for(const H of RHILLS){const p=plateau(x,z,H[0],H[1],H[2],H[3],H[4],H[5]);if(p>0.01)h=Math.max(h,1.8+p+(fbm(x*0.03+H[0],z*0.03)-0.5)*3*Math.min(1,p/10));}
  h+=bump(x,z,1100,-900,500,24)+bump(x,z,1500,900,600,40);   // lomas del este y el camino a los montes Albanos
  {const e=Math.hypot((x-400)/120,(z-60)/105);if(e<1.5)h=lerp(2,h,sstep(clamp((e-1)/0.5,0,1)));}   // valle del anfiteatro (el antiguo lago de Nerón)
  for(const F of RFLATS){let qx=x,qz=z;if(F[6]){const dx=x-F[0],dz=z-F[1],c=Math.cos(F[6]),sn=Math.sin(F[6]);qx=F[0]+dx*c-dz*sn;qz=F[1]+dx*sn+dz*c;}const d=superD(qx,qz,F[0],F[1],F[2],F[3]);if(d<1+F[5])h=lerp(F[4],h,sstep(clamp((d-1)/F[5],0,1)));}
  {const w=sstep(clamp((-x-420)/110,0,1))*sstep(clamp((-z-40)/120,0,1));if(w>0)h=lerp(h,2.2+(fbm(x*0.01,z*0.01)-0.5)*1.2,w);}   // Campo de Marte
  if(x<-70&&x>-215&&z>-10&&z<45){const c=clivusAt(x,z);if(c.d<10){const top=1.8+32,hc=lerp(0.6,top,sstep(c.t)*0.25+c.t*0.75);h=lerp(hc,h,sstep(clamp((c.d-4.5)/5,0,1)));}}   // Clivus Capitolinus
  {const rx=romaRiverX(z);if(x<rx){const w=sstep(clamp((rx-x-60)/90,0,1))*(1-sstep(clamp((rx-x-380)/200,0,1)));if(w>0&&z>-300&&z<900)h=lerp(h,2.4,w*0.85);}}   // llanura del Trastévere
  // el cauce del Tíber
  const d=romaRiverDist(x,z),W=romaRiverW(z);
  if(d<W+16){const t=sstep(clamp((d-W+6)/22,0,1));h=lerp(-5,h,t);}
  if(inIsla(x,z,14)){const k=1-sstep(clamp((Math.hypot((x-ISLA.x)/ISLA.rx,(z-ISLA.z)/ISLA.rz)-1)/0.35,0,1));h=Math.max(h,lerp(-5,2.6,k));}
  return h;
}
function romaFieldOk(x,z){
  if(romaInUrbs(x,z)||romaInUrbs(x+40,z)||romaInUrbs(x-40,z)||romaInUrbs(x,z+40)||romaInUrbs(x,z-40))return false;
  if(romaRiverDist(x,z)<romaRiverW(z)+30)return false;if(roadDist(x,z)<7)return false;
  const h=romaH(x,z);if(h<0.5||h>55)return false;
  return Math.abs(romaH(x+4,z)-romaH(x-4,z))+Math.abs(romaH(x,z+4)-romaH(x,z-4))<2.4;
}
const RC={pave:new THREE.Color('#a89b82'),street:new THREE.Color('#857559'),basalt:new THREE.Color('#77736c'),sand:new THREE.Color('#c4ab7c'),mud:new THREE.Color('#6d6046'),bank:new THREE.Color('#7f7a55'),tufa:new THREE.Color('#8c7a5c'),garden:new THREE.Color('#6a8442'),urb:new THREE.Color('#8f6a4a')};
function romaPaved(x,z){if(x<-70&&x>-215&&z>-10&&z<45&&clivusAt(x,z).d<4.2)return true;return superD(x,z,0,0,118,60)<1||superD(x,z,60,-165,196,92)<1||superD(x,z,480,-128,72,56)<1||superD(x,z,-640,-500,60,60)<1;}
function romaColor(x,z,h,sl,c,inner){
  c.lerp(RC.garden,0.25);
  {const ft=fieldAt(x,z);if(ft)c.lerp(FIELD_C[ft],0.8);}
  const hill=clamp((h-10)/14,0,1);
  const urb=romaInUrbs(x,z),hq=urb&&romaQuarter(x,z),green=hq&&(hq[4]==='horti'||hq[4]==='open');
  if(urb&&!green)c.lerp(RC.urb,0.92*(1-hill*0.3));
  c.lerp(RC.garden,(green?0.5:urb?hill*0.12:hill*0.25)*(0.6+fbm(x*0.03,z*0.03)));
  if(romaPaved(x,z))c.lerp(RC.pave,0.8);
  if((()=>{const dx=x-65,dz=z-405,c=Math.cos(CIRC_A),sn=Math.sin(CIRC_A);return superD(65+dx*c-dz*sn,405+dx*sn+dz*c,65,405,300,44)<1;})()||Math.hypot((x-400)/41.5,(z-60)/24)<1)c.lerp(RC.sand,0.9);
  c.lerp(RC.tufa,clamp((sl-0.5)*1.4,0,1)*0.75);if(sl>0.5)c.lerp(RC.garden,clamp((sl-0.5)*0.5,0,0.35)*fbm(x*0.05+3,z*0.05));
  if(h<0.6&&romaRiverDist(x,z)<romaRiverW(z)+20)c.lerp(h<-1?RC.mud:RC.bank,0.8);
  if(inner){const rd=roadDist(x,z);if(rd<1.2)c.lerp(RC.basalt,clamp(1-(rd+0.4)/1.6,0,1));}
  c.multiplyScalar(0.86);
}

