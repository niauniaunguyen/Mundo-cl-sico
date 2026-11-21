/* =====================================================================
   FASE TARDÍA: varios enemigos a la vez (desde el nivel 50 y el 150),
   vida ×3 desde el nivel 100 y lo que se desbloquea para hacerle frente.
   ===================================================================== */
// número de enemigos por combate y fuerza de cada uno (la suma es algo mayor que un enemigo solo)
const nFoes = L => L >= 150 ? 3 : L >= 50 ? 2 : 1;
const GROUP_FOE = {1:{hp:1, atk:1, atp:1}, 2:{hp:2.4, atk:2.4, atp:2.4}, 3:{hp:1.8, atk:1.8, atp:1.8}};
const HP_X100 = 3; // desde el nivel 100

// Herramientas de área (nivel 100): alcanzan a todos los enemigos a la vez
TOOLS.push(
  {id:'cmp', n:'Sistema del complemento', col:0xffe08a, pow:1, cd:2, cost:1e17, aoe:true, need:100,
    d:'Unas treinta proteínas de la sangre que se activan en cascada y forman el complejo de ataque a la membrana (MAC): un poro que agujerea la membrana de los microbios. Alcanza a todos los organismos a la vez.'},
  {id:'ifn', n:'Interferones', col:0x8fd8ff, pow:1.1, cd:3, cost:3e17, aoe:true, need:100,
    d:'Citocinas que avisan a las células vecinas de que hay un virus: frenan su replicación y activan a los macrófagos y a los linfocitos NK. Alcanzan a todos los organismos a la vez.'},
  {id:'fgt', n:'Bacteriófagos', col:0x9dffb0, pow:1.4, cd:3, cost:6e17, aoe:true, need:100,
    d:'Virus que solo infectan bacterias (fagoterapia). Se multiplican dentro de una bacteria, la revientan y los fagos nuevos saltan a las demás. Alcanzan a todas las bacterias a la vez.'},
);
for (const t of TOOLS) TOOL[t.id] = t;
Object.assign(EFF, {
  cmp:{def:[1,'El complemento perfora la membrana de casi cualquier célula extraña.'],
    gn:[2.2,'El complejo de ataque a la membrana perfora con facilidad la membrana externa de las Gram−.'],
    myc:[2,'Sin pared que la proteja, su membrana queda llena de poros.'],
    gp:[.5,'La gruesa pared de peptidoglucano de las Gram+ impide que el poro llegue a la membrana.'],
    bac:[.5,'Es Gram+: su pared gruesa la protege del complemento.'],
    tbc:[.3,'La pared cérea de ácidos micólicos frena el complemento.'],
    vir:[1.3,'El complemento rompe la envoltura de los virus que la tienen, como el de la gripe.'],
    vih:[.5,'El VIH se lleva de tu célula proteínas que frenan el complemento (CD55 y CD59) y se protege con ellas.'],
    lev:[.4,'La pared de quitina protege su membrana.'], veg:[.2,'La pared de celulosa protege su membrana.'],
    can:[.3,'Es una célula propia: tiene proteínas que frenan el complemento, como CD59.'],
    mal:[.6,'Dentro del glóbulo rojo, protegido por las proteínas reguladoras del eritrocito, apenas le llega.'],
    ten:[.3,'Su tegumento lo protege y se renueva sin parar.'], pri:[0,'Un prion no tiene membrana que perforar.']},
  ifn:{def:[.4,'Los interferones no matan directamente: avisan a las células para que se defiendan. Contra este organismo apenas ayudan.'],
    vir:[2.5,'Las células avisadas por el interferón fabrican proteínas que frenan la replicación del virus.'],
    vih:[1.6,'El interferón frena la replicación del VIH, aunque el virus tiene proteínas para escapar de él.'],
    can:[1.4,'Los interferones activan a los linfocitos NK y T contra el tumor: se usan en algunos cánceres, como el melanoma.'],
    tbc:[1.6,'El interferón γ activa a los macrófagos infectados para que por fin digieran a la micobacteria.'],
    mal:[.8,'El interferón γ ayuda contra la fase del plasmodio en el hígado, pero poco dentro de los glóbulos rojos.'],
    pri:[0,'El prion no se replica como un virus ni lo reconoce el sistema inmune.']},
  fgt:{def:[0,'Los bacteriófagos solo infectan bacterias: cada fago reconoce receptores de una bacteria concreta.'],
    gp:[2.5,'El fago se une a su pared, inyecta su ADN y la bacteria fabrica cientos de fagos nuevos hasta reventar.'],
    gn:[2.5,'Los fagos de E. coli, como T4, son los más estudiados: la revientan en unos 30 minutos.'],
    bac:[2,'Hay muchos fagos de Bacillus, aunque no afectan a la endospora.'],
    myc:[.8,'Hay pocos fagos conocidos de micoplasmas.'],
    tbc:[1.6,'Los micobacteriófagos se han usado para salvar a pacientes con infecciones resistentes a todos los antibióticos.']},
});
Object.assign(KEYTRAIT, {cmp:['outer','nowall','env','pg','wax','teg','cellulose','chitin','self','cd4','protein'], ifn:['acell','intra','env','self','retro','wax','rbc'],
  fgt:['gram','pg','outer','wax','nowall','spore','acell','protist','fungus','self','protein']});
SIDE.ifn = [.03, T_('Efecto secundario: los interferones también te provocan fiebre y malestar, como una gripe.')];

// Orgánulos de élite (nivel 100)
const UPG3 = [
  {id:'tlr', n:T_('Receptores tipo Toll'), d:T_('Proteínas de la membrana que reconocen patrones de los microbios, como el LPS, la flagelina o el ARN vírico, y activan antes la respuesta.'), e:T_('Ataque ×1,1'), base:3e16, k:1.5, max:12, col:0xffb547, ic:'signal'},
  {id:'glc', n:T_('Glucocáliz'), d:T_('Capa de glúcidos unida a las proteínas y los lípidos de la membrana. La protege de los golpes y ayuda a distinguir lo propio de lo extraño.'), e:T_('Vida ×1,1'), base:3e16, k:1.5, max:12, col:0x9be7ff, ic:'bilayer'},
  {id:'sec', n:T_('Gránulos secretores'), d:T_('Vesículas cargadas de enzimas y proteínas tóxicas que se liberan al exterior (desgranulación) y alcanzan también a los organismos cercanos.'), e:T_('+10 % de tu daño salpica a los demás enemigos'), base:6e16, k:1.7, max:10, col:0xff7ad9, ic:'lyso'},
];
Object.assign(UPG_VIS, {tlr:T_('En tu célula: receptores en forma de Y en la membrana.'), glc:T_('En tu célula: una capa de glúcidos alrededor de la membrana.'), sec:T_('En tu célula: gránulos de colores bajo la membrana.')});
Object.assign(MILESTONE, {
  t50:T_('Ahora vienen de dos en dos'), d50:T_('Desde el nivel 50 lucharás contra dos organismos a la vez, y cada uno es más fuerte que un organismo solo. Elige a quién atacar tocándolo en la lista o en la escena.'),
  r50:T_('Recompensa: +5 ADN y +2 puntos del árbol inmunitario.'),
  t100:T_('Una infección generalizada'), d100:T_('Desde el nivel 100 los organismos tienen el triple de vida. Para hacerles frente se desbloquean los orgánulos de élite y tres herramientas nuevas que alcanzan a todos los enemigos a la vez.'),
  r100:T_('Recompensa: +10 ADN, +3 puntos del árbol inmunitario y los orgánulos y herramientas nuevos.'),
  t150:T_('Tres frentes abiertos'), d150:T_('Desde el nivel 150 lucharás contra tres organismos a la vez. Las herramientas de área y los gránulos secretores son ahora tu mejor arma.'),
  r150:T_('Recompensa: +15 ADN y +3 puntos del árbol inmunitario.'),
});
