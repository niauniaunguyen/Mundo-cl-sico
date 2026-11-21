// ============================================================ el Mediterráneo entero (botón del plano)
// Costas muy simplificadas en [longitud, latitud]; se dibuja en proyección equirrectangular. Cada época tiene sus pueblos y ciudades.
const MED={on:false,lon0:-10,lon1:42,lat0:28.5,lat1:48,v:null};
const MED_SEA=[[-5.6,36],[-4.4,36.7],[-2.5,36.8],[-2,36.7],[-1,37.6],[-0.5,38.3],[0.2,38.7],[-0.3,39.5],[0,40],[0.9,40.7],[1.25,41.1],[2.2,41.4],[3.3,42.3],[3,42.7],[3.5,43.3],[4.8,43.4],[5.4,43.3],[5.9,43.1],[7.3,43.7],[8.9,44.4],[9.8,44.1],[10.3,43.5],[10.5,42.9],[11.2,42.4],[11.8,42.1],[12.3,41.7],[13,41.2],[13.6,41.2],[14.2,40.8],[14.3,40.6],[14.8,40.6],[15,40.4],[15.3,40],[15.8,39.5],[16,38.7],[15.65,38.1],[15.9,37.95],[16.05,37.92],[16.6,38.4],[17.15,39.1],[16.6,39.6],[16.5,40.1],[17.2,40.47],[17.9,40.3],[18.35,39.8],[18.5,40.15],[17.95,40.65],[16.85,41.13],[16.1,41.9],[15.6,41.95],[15,42],[14.2,42.47],[13.5,43.6],[12.57,44.07],[12.3,44.4],[12.5,44.95],[12.3,45.4],[13.4,45.75],[13.75,45.6],[13.6,45.2],[13.9,44.8],[14.3,45.3],[15.2,44.2],[16.4,43.5],[17.6,42.9],[18.1,42.65],[18.7,42.4],[19.4,41.85],[19.45,41.3],[19.4,40.45],[20,39.7],[20.2,39.5],[20.75,38.95],[21.1,38.4],[21.7,38.35],[22.4,38.25],[22.9,38.2],[22.95,37.95],[22.4,38.1],[21.8,38.15],[21.3,37.95],[21.6,37.6],[21.65,36.9],[21.7,36.8],[21.95,36.8],[22.1,37],[22.48,36.38],[22.55,36.75],[23.2,36.43],[23.05,36.9],[22.8,37.55],[23.15,37.3],[23.4,37.4],[23.4,37.75],[23.05,37.92],[23.35,38],[23.55,38.03],[23.62,37.94],[24.02,37.65],[24.05,38],[23.95,38.25],[23.6,38.45],[22.9,38.9],[23,39.1],[22.95,39.35],[23.3,39.15],[23.1,39.5],[22.6,40],[22.6,40.5],[22.95,40.6],[23.3,40.25],[23.7,39.95],[23.75,40.25],[24.4,40.15],[23.9,40.4],[24.4,40.93],[25,40.95],[25.5,40.87],[25.9,40.85],[26,40.75],[26.6,40.6],[26.1,40.35],[26.2,40.05],[26.15,39.95],[26.1,39.5],[26.35,39.5],[26.95,39.55],[26.7,39.3],[26.8,38.9],[26.75,38.65],[27.1,38.45],[26.3,38.35],[26.6,38.1],[27.3,37.95],[27.2,37.65],[27.25,37.5],[27.42,37.04],[27.4,36.68],[28.1,36.8],[28.3,36.75],[29.1,36.6],[29.6,36.2],[30.4,36.2],[30.7,36.9],[31.4,36.75],[32,36.5],[32.8,36.05],[33.6,36.2],[34,36.3],[34.6,36.8],[34.9,36.9],[35.7,36.6],[36.15,36.85],[36.15,36.6],[35.8,36.2],[35.8,35.5],[35.9,35],[35.65,34.12],[35.5,33.9],[35.37,33.56],[35.2,33.27],[34.9,32.5],[34.75,32.05],[34.45,31.5],[32.55,31.05],[31.8,31.5],[30.4,31.45],[29.9,31.2],[29,30.85],[27.2,31.35],[25.1,31.6],[23.95,32.1],[23,32.6],[21.95,32.9],[21,32.8],[20.05,32.1],[19.8,31],[19.2,30.25],[18,30.8],[16.6,31.2],[15.2,32.3],[14.3,32.65],[13.2,32.9],[12.5,32.8],[11.5,33.2],[10.9,33.7],[10.1,33.9],[10.75,34.75],[11.1,35.2],[10.65,35.85],[11.05,37.05],[10.3,36.85],[10.05,37.05],[9.85,37.3],[8.7,36.95],[7.75,36.9],[6.9,37.1],[5.9,36.85],[5.1,36.75],[3.05,36.75],[2.2,36.6],[0.1,35.85],[-0.65,35.7],[-2.1,35.1],[-2.95,35.3],[-4.3,35.2],[-5.3,35.9],[-5.8,35.8]];
const MED_ATL=[[-5.8,35.8],[-6.2,35],[-6.8,34],[-7.6,33.6],[-8.5,33.2],[-9.3,32.5],[-9.8,31],[-9.6,30.4],[-10,29.5],[-10,28],[-13,28],[-13,49],[-1,49],[-1.5,47.5],[-2.2,47.1],[-1.2,46],[-1.5,44.5],[-1.8,43.4],[-3.8,43.45],[-5.8,43.6],[-7.7,43.75],[-8.4,43.4],[-9.3,42.9],[-8.9,42.1],[-8.7,41.15],[-8.9,40.2],[-9.5,38.8],[-9.2,38.7],[-8.8,38.4],[-9,37],[-7.9,37],[-7,37.2],[-6.3,36.5],[-6,36.1]];
const MED_BLACK=[[29.1,41.2],[28,41.65],[27.9,42.6],[27.95,43.2],[28.6,43.8],[28.65,44.17],[29.6,45.2],[30.2,45.85],[31.9,46.6],[33,46.1],[32.5,45.4],[33.4,44.6],[34.4,44.5],[35.4,45],[36.5,45.3],[36.9,45.2],[37.3,44.7],[38.1,44.4],[39.7,43.6],[41,43],[41.65,42.15],[41.6,41.6],[39.7,41],[38.4,40.95],[37.6,41.1],[36.6,41.35],[35.8,41.7],[35.1,42],[34,41.95],[33.3,42],[32.3,41.8],[31.4,41.3],[30.3,41.2]];
const MED_AZOV=[[35.4,45.35],[36.6,45.45],[37.6,45.6],[38.2,46.2],[39.2,47.15],[38.3,47.1],[37,46.7],[35.4,46.3],[35.1,45.7]];
const MED_MARM=[[26.2,40.05],[26.7,40.4],[27.5,40.65],[27.95,40.97],[28.98,41.01],[29.1,41.2],[29.15,41.05],[29.9,40.75],[29,40.4],[27.9,40.38],[27.3,40.4],[26.5,40.15]];
const MED_ISL=[
 [[12.4,37.8],[12.6,38.1],[13.35,38.2],[14,38.05],[15.1,38.15],[15.6,38.27],[15.25,37.85],[15.1,37.5],[15.3,37.05],[15.1,36.7],[14.5,36.8],[14.25,37.06],[13.55,37.25],[12.8,37.58]],
 [[8.2,41],[9.2,41.25],[9.8,40.6],[9.65,39.3],[9.55,39.15],[9,38.85],[8.4,39.05],[8.4,39.9],[8.5,40.4]],
 [[9.4,43],[9.55,42.6],[9.4,41.6],[9.15,41.38],[8.6,41.7],[8.6,42.3],[9,42.75]],
 [[23.55,35.3],[24.3,35.45],[25.1,35.33],[26.3,35.3],[26.15,35],[25,34.95],[24.7,34.95],[23.9,35.2],[23.55,35.2]],
 [[32.3,35.1],[33.1,35.35],[34,35.45],[34.6,35.7],[33.95,35.1],[33.7,34.95],[33,34.6],[32.4,34.75]],
 [[27.7,36.15],[28.2,36.45],[28.25,36.3],[27.75,35.9]],
 [[23.3,39.05],[23.5,38.75],[24.15,38.2],[24.55,38],[24.35,37.98],[23.55,38.45],[22.85,38.85]],
 [[2.35,39.6],[3.1,39.95],[3.45,39.7],[3,39.3],[2.4,39.5]],[[3.8,40],[4.3,39.85],[3.9,39.92]]];
const MED_DOT=[[25.45,37.05,0.15],[25.15,37.05,0.1],[25.27,37.4,0.05],[25.42,36.4,0.08],[24.4,36.7,0.12],[24.85,37.85,0.13],[25.15,37.6,0.1],[26,38.37,0.2],[26.3,39.15,0.3],[26.8,37.73,0.14],[27.15,36.85,0.12],[23.5,37.75,0.08],[23.45,37.93,0.06],[19.85,39.6,0.2],[20.55,38.2,0.22],[20.85,37.78,0.12],[22.98,36.25,0.1],[25.25,39.9,0.17],[24.7,40.7,0.14],[14.4,35.9,0.07],[10.25,42.78,0.08],[1.4,38.95,0.1],[11.9,36.8,0.07]];
const MED_RIV=[[[31.2,30],[31.25,29]],[[12.4,44.95],[11.6,44.95],[10.3,45.05],[9.2,45.15],[7.7,45]],[[29.6,45.2],[28.2,45.4],[27.9,44.2],[25,43.7],[22.6,44.2],[21,44.8],[19,45.5],[18.9,47.5]],
 [[0.9,40.7],[-0.9,41.65],[-1.9,42.4]],[[4.8,43.4],[4.85,45.75],[5.3,46.8]],[[-9.2,38.7],[-7,39.5],[-3.7,40]],[[-7.4,37.2],[-7.5,38.5],[-6.35,38.9],[-4,39]],[[12.3,41.7],[12.5,41.9],[12.5,42.4],[12.2,43]],
 [[-6.3,36.8],[-6,37.4],[-4.8,37.9],[-3.5,38]],[[38.8,30],[38.4,36.3],[38.9,40]],[[40,36.5],[41.5,35]]];
// dónde estás: la ciudad de partida y cada destino
const MED_POS={atenas:[23.73,37.98],egina:[23.43,37.75],delos:[25.27,37.4],naxos:[25.38,37.1],creta:[25.16,35.3],lesbos:[26.55,39.1],troya:[26.24,39.96],tebas:[23.32,38.32],esparta:[22.43,37.08],micenas:[22.76,37.73],
  megara:[23.35,38],corinto:[22.93,37.9],platea:[23.27,38.22],delfos:[22.5,38.48],argos:[22.72,37.63],epidauro:[23.08,37.6],mantinea:[22.4,37.62],olimpia:[21.63,37.64],maraton:[23.97,38.15],termopilas:[22.54,38.8],
  larisa:[22.42,39.64],pela:[22.52,40.76],dodona:[20.79,39.55],calidon:[21.53,38.37],egio:[22.08,38.25],itome:[21.92,37.18],calcis:[23.6,38.46],efeso:[27.34,37.94],mileto:[27.28,37.53],halicarnaso:[27.42,37.04],sardes:[28.04,38.49],estagira:[23.77,40.59]};
const MED_POS_RO={atenas:[12.48,41.89],campania:[14.25,40.84],apulia:[17.94,40.64],lucania:[15,40.42],samnium:[14.62,41.43],picenum:[13.58,42.85],umbria:[12.57,44.06],etruria:[11.76,42.25],aemilia:[10.92,44.65],liguria:[8.93,44.41],
  venetia:[10.99,45.44],transpadana:[9.08,45.81],regium:[15.65,38.11],tarraco:[1.25,41.12],barcino:[2.17,41.38],emporiae:[3.12,42.13],ilerda:[0.62,41.62],emerita:[-6.34,38.92],cartago:[10.32,36.85],gades:[-6.29,36.53],cartnova:[-0.98,37.6],corduba:[-4.78,37.88],medulas:[-6.76,42.46],massilia:[5.37,43.3],nemausus:[4.36,43.84],lugdunum:[4.83,45.76],alesia:[4.5,47.54]};
// pueblos y estados: [nombre, lon, lat, tamaño, color]; ciudades: [nombre, lon, lat, importancia (2 capital, 1 grande, 0 otra)]
const MED_INFO={
 atenas:{title:'El Mediterráneo hacia el 386 a.C.',
  note:'Paz del Rey (387/386 a.C.): Esparta pacta con Persia y las ciudades griegas de Asia quedan bajo el Gran Rey. Dionisio de Siracusa domina Sicilia; Cartago, el Mediterráneo occidental. Roma es una ciudad latina que se rehace del saqueo de los galos.',
  peoples:[['IMPERIO PERSA',33.5,39,17,'#8a2a1e'],['Artajerjes II',33.5,38.3,12,'#8a2a1e'],['Egipto',29.5,29.6,15,'#6a4a1a',1],['independiente',29.5,29.05,11,'#6a4a1a'],['Cartago',7.5,34.5,16,'#5a2a6a',1],['Fenicios',36.6,33.7,12,'#5a2a6a',1],
   ['Libios',18,29.7,13,'#6a5a3a',1],['Maurusios',-4,33.2,12,'#6a5a3a',1],['Iberos',-2.5,39.5,15,'#6a5a3a',1],['Turdetanos',-5.4,37.6,11,'#6a5a3a',1],['Celtas',-6,41.6,13,'#6a5a3a',1],['Celtas',1.5,46.6,13,'#6a5a3a',1],['Ligures',6.5,44.4,12,'#6a5a3a',1],
   ['Galos',9.5,45.7,13,'#6a5a3a',1],['VÉNETOS',12.2,46.2,11,'#6a5a3a'],['Etruscos',11.6,43.2,13,'#2a5a3a',1],['Latinos',13,42,11,'#2a5a3a',1],['Samnitas',15.2,41.4,11,'#2a5a3a',1],['MAGNA GRECIA',16.6,39.1,12,'#1f4a7a'],
   ['Ilirios',18.6,43.6,12,'#6a5a3a',1],['Macedonia',22,41.1,12,'#6a5a3a',1],['Tracios',25.6,42.4,13,'#6a5a3a',1],['reino odrisio',25.6,41.8,11,'#6a5a3a'],['Escitas',34.5,47.2,13,'#6a5a3a',1],['Grecia',22.2,39.3,15,'#1f4a7a',1],
   ['Dominios de Dionisio I',14.2,38.7,11,'#1f4a7a'],['Cirenaica griega',21.6,31.6,11,'#1f4a7a'],['Bósforo Cimerio',36.7,44.2,10,'#1f4a7a']],
  cities:[['Atenas',23.73,37.98,2],['Esparta',22.43,37.08,2],['Tebas',23.32,38.32,1],['Corinto',22.93,37.9,1],['Siracusa',15.29,37.07,2],['Cartago',10.32,36.85,2],['Tiro',35.2,33.27,1],['Sidón',35.37,33.56,0],
   ['Sardes',28.04,38.48,1],['Mileto',27.28,37.53,0],['Éfeso',27.34,37.94,0],['Rodas',28.22,36.44,0],['Bizancio',28.98,41.01,1],['Olbia',31.9,46.69,0],['Panticapeo',36.47,45.35,0],['Sinope',35.15,42.03,0],
   ['Cirene',21.86,32.82,1],['Menfis',31.25,29.85,1],['Naucratis',30.6,30.9,0],['Massalia',5.37,43.3,1],['Emporion',3.12,42.13,0],['Gadir',-6.29,36.53,1],['Roma',12.48,41.89,0],['Tarento',17.24,40.47,1],
   ['Neápolis',14.25,40.84,0],['Pela',22.52,40.75,0],['Útica',10.06,37.06,0],['Cnosos',25.16,35.3,0],['Mitilene',26.55,39.1,0],['Halicarnaso',27.42,37.04,0],['Salamina de Chipre',33.9,35.18,0],
   ['Argos',22.72,37.63,-1],['Delfos',22.5,38.48,-1],['Olimpia',21.63,37.64,-1],['Mégara',23.35,38,-1],['Platea',23.27,38.22,-1],['Maratón',23.97,38.15,-1],['Termópilas',22.54,38.8,-1],['Epidauro',23.08,37.6,-1],['Mantinea',22.4,37.62,-1],['Micenas',22.76,37.73,-1],['Egina',23.43,37.72,-1],['Delos',25.27,37.4,-1],['Naxos',25.38,37.1,-1],['Troya',26.24,39.96,-1],['Calcis',23.6,38.46,-1],['Corcira',19.92,39.62,-1],['Agrigento',13.58,37.31,-1],['Selinunte',12.82,37.58,-1],['Crotona',17.12,39.08,-1],['Regio',15.65,38.11,-1]]},
 roma:{title:'El Mediterráneo en el año 80 d.C.',
  note:'Bajo el emperador Tito, Roma gobierna todas las costas: los romanos lo llaman «nuestro mar», Mare Nostrum. Más allá de las fronteras quedan los partos, los germanos, los dacios, los sármatas y los pueblos del desierto.',
  peoples:[['IMPERIO ROMANO',16,47.2,17,'#8a2a1e'],['HISPANIA TARRACONENSE',-3,41.2,11,'#8a2a1e'],['BÉTICA',-4.6,37.7,11,'#8a2a1e'],['Lusitania',-7.6,39.9,11,'#8a2a1e',1],['GALIA NARBONENSE',3.2,44.4,11,'#8a2a1e'],
   ['GALIA LUGDUNENSE',0.5,47.3,10,'#8a2a1e'],['Italia',13.4,42.6,14,'#8a2a1e',1],['Mauretania',-4.4,33.7,11,'#8a2a1e',1],['Numidia',6,35.4,10,'#8a2a1e',1],['ÁFRICA PROCONSULAR',10.2,34.4,11,'#8a2a1e'],['CIRENAICA Y CRETA',21.4,31.6,10,'#8a2a1e'],
   ['Egipto',29.5,29.6,13,'#8a2a1e',1],['Judea',35.4,31.2,10,'#8a2a1e',1],['Siria',37.4,34.6,12,'#8a2a1e',1],['Cilicia',34.3,37.4,10,'#8a2a1e',1],['Asia',28.8,38.9,12,'#8a2a1e',1],['Galacia',32.8,39.8,11,'#8a2a1e',1],['Capadocia',36,38.6,10,'#8a2a1e',1],
   ['BITINIA Y PONTO',31.8,40.9,10,'#8a2a1e'],['LICIA Y PANFILIA',30.4,37.1,10,'#8a2a1e'],['Acaya',22,38.8,11,'#8a2a1e',1],['Macedonia',22.5,40.9,11,'#8a2a1e',1],['Tracia',26.2,42,11,'#8a2a1e',1],['Mesia',24.4,43.5,11,'#8a2a1e',1],
   ['Dalmacia',17.4,44,11,'#8a2a1e',1],['Panonia',17.8,46.4,11,'#8a2a1e',1],['NÓRICO',13.8,47.4,10,'#8a2a1e'],['CERDEÑA Y CÓRCEGA',8.3,40.6,9,'#8a2a1e'],['Sicilia',13.5,37.6,10,'#8a2a1e',1],
   ['IMPERIO PARTO',40.4,37.6,13,'#5a2a6a'],['Nabateos',36,30.3,11,'#6a4a1a',1],['Dacios',24.5,46.3,12,'#6a5a3a',1],['SÁRMATAS',33,47.5,12,'#6a5a3a'],['Reino del Bósforo',37,45.8,10,'#6a5a3a'],['Garamantes',14,29.2,12,'#6a5a3a',1],['Armenia',40.6,40,11,'#6a5a3a',1]],
  cities:[['Roma',12.48,41.89,2],['Alejandría',29.9,31.2,2],['Antioquía',36.16,36.2,2],['Cartago',10.32,36.85,2],['Éfeso',27.34,37.94,1],['Atenas',23.73,37.98,1],['Corinto',22.93,37.9,1],['Tarraco',1.25,41.12,1],['Corduba',-4.78,37.88,1],
   ['Emerita Augusta',-6.34,38.92,1],['Gades',-6.29,36.53,1],['Narbo',3.0,43.18,1],['Massilia',5.37,43.3,0],['Lugdunum',4.83,45.76,1],['Aquileia',13.37,45.77,1],['Mediolanum',9.19,45.46,0],['Pompeya (sepultada)',14.49,40.75,0],
   ['Siracusa',15.29,37.07,0],['Tesalónica',22.94,40.64,1],['Bizancio',28.98,41.01,0],['Nicomedia',29.92,40.77,0],['Pérgamo',27.18,39.12,0],['Esmirna',27.14,38.42,0],['Tarso',34.9,36.92,0],['Cesarea',34.9,32.5,1],
   ['Jerusalén (destruida en el 70)',35.23,31.78,0],['Leptis Magna',14.29,32.64,0],['Cirene',21.86,32.82,0],['Gortina',24.95,35.06,0],['Rodas',28.22,36.44,0],['Sinope',35.15,42.03,0],['Trapezunte',39.72,41.0,0],['Tomis',28.65,44.17,0],
   ['Panticapeo',36.47,45.35,0],['Cesarea de Mauretania',2.19,36.61,0],['Tingis',-5.8,35.78,0],['Carthago Nova',-0.98,37.6,0],['Brundisium',17.94,40.64,0],['Neápolis',14.25,40.84,0],['Ancira',32.86,39.93,0],['Damasco',36.3,33.51,0],
   ['Ostia',12.29,41.75,-1],['Tarquinii',11.76,42.25,-1],['Mutina',10.92,44.65,-1],['Genua',8.93,44.41,-1],['Verona',10.99,45.44,-1],['Comum',9.08,45.81,-1],['Ariminum',12.57,44.06,-1],['Asculum',13.58,42.85,-1],['Saepinum',14.62,41.43,-1],['Paestum',15,40.42,-1],['Capua',14.25,41.08,-1],['Puteoli',14.12,40.82,-1],['Ravenna',12.2,44.42,-1],['Barcino',2.17,41.38,-1],['Emporiae',3.12,42.13,-1],['Ilerda',0.62,41.62,-1],['Utica',10.06,37.06,-1],['Hippo Regius',7.75,36.9,-1],['Hispalis',-5.99,37.39,-1],['Caesaraugusta',-0.88,41.65,-1]]}};
// MED.v: vista ampliada (s = aumento; cx, cy = centro en coordenadas del mapa sin ampliar)
function medBase(W,H){const k=W/(MED.lon1-MED.lon0),ky=k/Math.cos(38*Math.PI/180),mh=(MED.lat1-MED.lat0)*ky,oy=Math.max(54,(H-mh)/2-10);return{k,ky,mh,oy};}
function medProj(W,H){const B=medBase(W,H),v=MED.v||{s:1,cx:W/2,cy:B.oy+B.mh/2},s=v.s;
  return{oy:B.oy,mh:B.mh,k:B.k*s,s,P:(lo,la)=>[((lo-MED.lon0)*B.k-v.cx)*s+W/2,(B.oy+(MED.lat1-la)*B.ky-v.cy)*s+B.oy+B.mh/2]};}
function medClamp(W,H){const B=medBase(W,H),v=MED.v;v.s=clamp(v.s,1,6);const hw=W/2/v.s,hh=B.mh/2/v.s;v.cx=clamp(v.cx,hw,W-hw);v.cy=clamp(v.cy,B.oy+hh,B.oy+B.mh-hh);}
function medReset(){const c=$('mapc'),B=medBase(c.width,c.height);MED.v={s:1,cx:c.width/2,cy:B.oy+B.mh/2};}
function medZoom(f,mx,my){const c=$('mapc'),W=c.width,H=c.height,B=medBase(W,H),v=MED.v;if(mx==null){mx=W/2;my=B.oy+B.mh/2;}
  const bx=(mx-W/2)/v.s+v.cx,by=(my-(B.oy+B.mh/2))/v.s+v.cy;v.s=clamp(v.s*f,1,6);v.cx=bx-(mx-W/2)/v.s;v.cy=by-(my-(B.oy+B.mh/2))/v.s;medClamp(W,H);drawMap();}
function medHere(){const r=regionOf(player.x);return(MODE==='roma'?MED_POS_RO:MED_POS)[r];}
function drawMed(){
  const c=$('mapc'),W=c.width,H=c.height,x=c.getContext('2d');if(!MED.v)medReset();const {P,oy,mh,k,s}=medProj(W,H);
  x.fillStyle='#2a2018';x.fillRect(0,0,W,H);x.save();x.beginPath();x.rect(0,oy,W,mh);x.clip();
  x.fillStyle='#d8c9a3';x.fillRect(0,oy,W,mh);
  const poly=(pts,fill,stroke)=>{x.beginPath();pts.forEach((p,i)=>{const q=P(p[0],p[1]);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);});x.closePath();x.fillStyle=fill;x.fill();if(stroke){x.strokeStyle=stroke;x.lineWidth=1.2;x.stroke();}};
  const SEA='#86a9ac',COAST='#6a5a44';
  for(const q of[MED_SEA,MED_ATL,MED_BLACK,MED_AZOV,MED_MARM])poly(q,SEA,COAST);
  {const a=P(26.2,40.05),b=P(26.6,40.35),d=P(29.1,41.2),e=P(28.98,41.01);x.strokeStyle=SEA;x.lineWidth=3*Math.sqrt(s);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.moveTo(d[0],d[1]);x.lineTo(e[0],e[1]);x.stroke();}   // estrechos
  for(const q of MED_ISL)poly(q,'#d8c9a3',COAST);
  for(const d of MED_DOT){const q=P(d[0],d[1]);x.fillStyle='#d8c9a3';x.strokeStyle=COAST;x.lineWidth=1;x.beginPath();x.arc(q[0],q[1],Math.max(1.8,d[2]*k),0,TAU);x.fill();x.stroke();}
  x.strokeStyle='#7f9ea4';x.lineWidth=1.4;for(const r of MED_RIV){x.beginPath();r.forEach((p,i)=>{const q=P(p[0],p[1]);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);});x.stroke();}
  // rejilla suave de meridianos y paralelos
  x.strokeStyle='rgba(90,74,58,.12)';x.lineWidth=1;for(let lo=-10;lo<=40;lo+=(s>2.5?5:10)){const a=P(lo,MED.lat0),b=P(lo,MED.lat1);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();}for(let la=30;la<=45;la+=5){const a=P(MED.lon0,la),b=P(MED.lon1,la);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();}
  const I=MED_INFO[MODE];
  x.textAlign='center';for(const p of I.peoples){const q=P(p[1],p[2]);x.font='italic '+Math.round(p[3]*Math.min(1.6,1+(s-1)*0.15))+'px Alegreya, Georgia, serif';x.lineWidth=3;x.strokeStyle='rgba(216,201,163,.85)';const t=p[5]?p[0].toUpperCase():p[0];x.strokeText(t,q[0],q[1]);x.fillStyle=p[4];x.fillText(t,q[0],q[1]);}
  // ampliado se ven más ciudades (las de importancia -1, que son los destinos del juego y otras menores)
  const used=[];for(const ct of I.cities.slice().sort((a,b)=>b[3]-a[3])){if(ct[3]<0&&s<2)continue;const q=P(ct[1],ct[2]);if(q[0]<-40||q[0]>W+40||q[1]<oy-40||q[1]>oy+mh+40)continue;const r=ct[3]===2?5:ct[3]===1?3.6:ct[3]===0?2.6:2.2;
    x.fillStyle=ct[3]===2?'#a8392b':'#16100c';x.strokeStyle='#f1e8d8';x.lineWidth=1.2;x.beginPath();x.arc(q[0],q[1],r,0,TAU);x.fill();x.stroke();
    x.font=(ct[3]===2?'bold 14px':ct[3]===1?'bold 12px':'11px')+' Alegreya, Georgia, serif';const w=x.measureText(ct[0]).width;
    let pos=null;for(const[dx,dy,al]of[[r+3,4,'left'],[-r-3,4,'right'],[0,-r-4,'center'],[0,r+12,'center']]){const x0=al==='left'?q[0]+dx:al==='right'?q[0]+dx-w:q[0]-w/2,y0=q[1]+dy-10;
      if(!used.some(u=>x0<u[0]+u[2]&&x0+w>u[0]&&y0<u[1]+12&&y0+12>u[1])){pos=[dx,dy,al,x0,y0];break;}}
    if(!pos){if(ct[3]<=0)continue;pos=[r+3,4,'left',q[0]+r+3,q[1]-6];}used.push([pos[3],pos[4],w]);
    x.textAlign=pos[2];x.lineWidth=3;x.strokeStyle='rgba(241,232,216,.9)';x.strokeText(ct[0],q[0]+pos[0],q[1]+pos[1]);x.fillStyle='#16100c';x.fillText(ct[0],q[0]+pos[0],q[1]+pos[1]);}
  {const pos=medHere();if(pos){const q=P(pos[0],pos[1]);x.fillStyle='#a8392b';x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.moveTo(q[0],q[1]-3);x.lineTo(q[0]+6,q[1]-15);x.lineTo(q[0]-6,q[1]-15);x.closePath();x.fill();x.stroke();}}
  x.restore();x.strokeStyle='#d9874a';x.lineWidth=2;x.strokeRect(1,oy,W-2,mh);
  x.textAlign='left';x.fillStyle='#f1e8d8';x.font='bold 20px Alegreya, Georgia, serif';x.fillText(I.title,14,oy-18);
  if(s>1.01){x.textAlign='right';x.font='13px Alegreya, Georgia, serif';x.fillStyle='#e8dcc4';x.fillText(`Aumento ×${s.toFixed(1)}`,W-14,oy-18);x.textAlign='left';}
  // nota histórica al pie, en varias líneas
  x.font='14px Alegreya, Georgia, serif';x.fillStyle='#e8dcc4';const words=I.note.split(' ');let line='',y=oy+mh+24;for(const wd of words){const t=line?line+' '+wd:wd;if(x.measureText(t).width>W-28){x.fillText(line,14,y);y+=19;line=wd;}else line=t;}if(line)x.fillText(line,14,y);
  y+=26;x.font='13px Alegreya, Georgia, serif';x.fillStyle='#a8392b';x.beginPath();x.arc(20,y-4,5,0,TAU);x.fill();x.fillStyle='#e8dcc4';x.fillText(MODE==='roma'?'Capital o gran ciudad':'Gran potencia o ciudad principal',32,y);
  x.fillStyle='#16100c';x.strokeStyle='#f1e8d8';x.beginPath();x.arc(250,y-4,3.4,0,TAU);x.fill();x.stroke();x.fillStyle='#e8dcc4';x.fillText('Otra ciudad',260,y);
  x.fillStyle='#a8392b';x.beginPath();x.moveTo(380,y-12);x.lineTo(386,y);x.lineTo(374,y);x.closePath();x.fill();x.fillStyle='#e8dcc4';x.fillText('Estás aquí',394,y);
}
function setMed(on){MED.on=on;{const b=$('mapMed'),t=on?'Volver al plano':'Mediterráneo';b.setAttribute('aria-label',t);b.title=t;b.innerHTML=on?'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/></svg>':'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3.6 3.2 14.4 0 18M12 3c-3.2 3.6-3.2 14.4 0 18"/></svg>';};if(on)medReset();
  document.querySelector('#map h2').textContent=on?'El Mediterráneo':regionOf(player.x)==='atenas'?(MODE==='roma'?'Plano de Roma':'Plano de Atenas'):'Plano de '+islandOf(player.x).name;drawMap();}
$('mapMed').onclick=()=>setMed(!MED.on);

