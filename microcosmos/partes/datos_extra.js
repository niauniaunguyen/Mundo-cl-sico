/* =====================================================================
   DATOS DE LA VERSIÓN 4 (textos marcados con T_() y traducidos con tr())
   ===================================================================== */
const T_ = s => s; // marca un texto traducible que se guarda en los datos

// Efectos secundarios: fracción de tu vida máxima que pierdes al usar la herramienta
const SIDE = {
  anf:[.04, T_('Efecto secundario: la anfotericina también daña un poco las membranas con colesterol, como la tuya.')],
  uv:[.03, T_('Efecto secundario: la radiación ultravioleta también daña tu propio ADN.')],
  tax:[.03, T_('Efecto secundario: el taxol también frena tus propios microtúbulos.')],
  aut:[.06, T_('Efecto secundario: el vapor caliente también te quema a ti.')],
  art:[.02, T_('Efecto secundario: los radicales libres de la artemisinina también te dañan un poco.')],
  arv:[.02, T_('Efecto secundario: algunos antirretrovirales dañan las mitocondrias.')],
  iso:[.02, T_('Efecto secundario: la isoniazida puede dañar el hígado.')],
};

// Árbol de habilidades del sistema inmune: tres ramas; cada nodo pide el anterior de su rama
const TREE = [
  {b:'inn', n:T_('Inmunidad innata'), nodes:[
    {id:'i1', cost:1, n:T_('Pseudópodos rápidos'), d:T_('La fagocitosis hace ×1,5 de daño.')},
    {id:'i2', cost:2, n:T_('Estallido respiratorio'), d:T_('Tus enzimas y especies reactivas de oxígeno: +25 % de daño contra bacterias.')},
    {id:'i3', cost:1, n:T_('Destoxificación'), d:T_('Los efectos secundarios de tus herramientas te dañan un 60 % menos.')},
    {id:'i4', cost:2, n:T_('Inflamación controlada'), d:T_('Recuperas un 4 % de vida al final de cada turno del enemigo.')}]},
  {b:'hum', n:T_('Inmunidad humoral'), nodes:[
    {id:'h1', cost:1, n:T_('Maduración de la afinidad'), d:T_('La opsonización de los anticuerpos dura 5 turnos en lugar de 3.')},
    {id:'h2', cost:2, n:T_('Cambio de clase'), d:T_('La opsonización da +100 % de daño en lugar de +60 %.')},
    {id:'h3', cost:1, n:T_('Células B de memoria'), d:T_('El cuestionario de cada organismo nuevo da el doble de ATP.')},
    {id:'h4', cost:2, n:T_('Células plasmáticas'), d:T_('Los anticuerpos se recargan un turno antes.')}]},
  {b:'cel', n:T_('Inmunidad celular'), nodes:[
    {id:'c1', cost:1, n:T_('Linfocitos T de memoria'), d:T_('El linfocito T citotóxico hace ×1,4 de daño.')},
    {id:'c2', cost:2, n:T_('Perforina'), d:T_('15 % de probabilidad de un golpe crítico que hace el doble de daño.')},
    {id:'c3', cost:1, n:T_('Granzimas'), d:T_('El linfocito T y el taxol se recargan un turno antes.')},
    {id:'c4', cost:2, n:T_('Vigilancia inmunitaria'), d:T_('+30 % de daño contra virus, VIH y células tumorales.')}]},
];
const TREE_NODES = Object.fromEntries(TREE.flatMap(br => br.nodes.map((n, i) => [n.id, Object.assign({b:br.b, prev:i ? br.nodes[i-1].id : null}, n)])));

// Modo historia: «Una infección de principio a fin»
const STORY = [
  {n:T_('La herida'), cell:'mac', zone:'pie', L:2, tools:['fago','lis'], battles:['gp','gp'],
    t:T_('Una espina de rosal atraviesa la piel. Por la herida entran estafilococos que vivían tranquilos sobre ella. Eres un macrófago que vive en el tejido: el primero en llegar. Esto es la inmunidad innata, que actúa en minutos y no necesita haber visto antes al invasor.')},
  {n:T_('Inflamación'), cell:'neu', zone:'pie', L:4, tools:['fago','lis','pen'], battles:['gp','gn','gp'],
    t:T_('Los macrófagos liberan citocinas. Los vasos se dilatan: la zona se pone roja, caliente, hinchada y duele. Por la sangre llegan miles de neutrófilos, y ahora eres uno de ellos. Lanzas trampas de ADN contra las bacterias.')},
  {n:T_('Presentación de antígenos'), cell:'mac', zone:'san', L:6, tools:['fago','lis','pen','uv'], battles:['gn','vir'],
    t:T_('Una célula dendrítica recoge trozos de las bacterias y viaja hasta un ganglio linfático. Allí los muestra en su MHC a los linfocitos T. Si alguno los reconoce, se activa y se multiplica. Mientras tanto, tú sigues defendiendo la herida, y por ella también ha entrado un virus.')},
  {n:T_('Anticuerpos'), cell:'mac', zone:'san', L:8, tools:['fago','lis','pen','uv','ac','tc'], battles:['vir','gn','vir'],
    t:T_('Los linfocitos T colaboradores activan a los linfocitos B, que se convierten en células plasmáticas y fabrican anticuerpos. Ya puedes usar anticuerpos y linfocitos T citotóxicos. Prueba la combinación de anticuerpos y fagocitosis: la opsonización.')},
  {n:T_('Sepsis'), cell:'mac', zone:'san', L:10, tools:['fago','lis','pen','uv','ac','tc','osm'], battles:['@sepsis'],
    t:T_('Algunas bacterias han llegado a la sangre. Si la respuesta se descontrola, la inflamación se extiende por todo el cuerpo: es la sepsis, una urgencia médica. Es el combate final.')},
];
const STORY_END = T_('Tras la infección quedan linfocitos B y T de memoria. Si los mismos microbios vuelven, la respuesta será mucho más rápida y ni siquiera notarás que has estado enfermo. Así funcionan las vacunas: enseñan a tu sistema inmune sin tener que pasar la enfermedad.');

// Microscopio interactivo: partes de cada modelo [nombre, descripción, posición]
const PARTS = {
  me:[[T_('Núcleo'),T_('Guarda el ADN. En el macrófago tiene forma de riñón.'),[.12,.05,0]],[T_('Aparato de Golgi'),T_('Cisternas apiladas que empaquetan proteínas en vesículas.'),[-.55,.35,.25]],
    [T_('Mitocondria'),T_('Produce ATP con la respiración celular. Fíjate en las crestas.'),[.45,-.35,.3]],[T_('Lisosomas'),T_('Vesículas con enzimas que digieren lo que fagocitas.'),[-.3,-.4,.5]],
    [T_('Retículo endoplasmático rugoso'),T_('Membranas con ribosomas que fabrican proteínas.'),[.62,0,.2]],[T_('Membrana plasmática'),T_('Bicapa de fosfolípidos que separa la célula del exterior.'),[0,1.15,.2]],
    [T_('Filopodio'),T_('Prolongación fina que explora el entorno.'),[.85,.7,.4]]],
  gp:[[T_('Coco'),T_('Célula esférica de 1 µm. En racimo, típica de Staphylococcus.'),[0,.1,.75]],[T_('Tabique de división'),T_('Por aquí se separan dos cocos en la fisión binaria.'),[.6,.5,.2]],
    [T_('Biopelícula'),T_('Matriz de polisacáridos que protege a la colonia.'),[1.25,.6,.4]],[T_('Adhesinas'),T_('Proteínas de superficie que se pegan a los tejidos.'),[.3,.62,.6]]],
  gn:[[T_('Membrana externa con LPS'),T_('Exclusiva de las Gram−. Frena la lisozima y muchos antibióticos.'),[0,.5,.1]],[T_('Nucleoide'),T_('ADN circular sin membrana nuclear.'),[0,0,0]],
    [T_('Ribosomas'),T_('Ribosomas 70S, más pequeños que los tuyos.'),[.4,.1,.25]],[T_('Fimbrias'),T_('Pelos cortos para adherirse.'),[-.4,.58,0]],[T_('Flagelo'),T_('Gira como una hélice impulsado por un motor de protones.'),[1.9,.2,0]]],
  vir:[[T_('Hemaglutinina'),T_('Espícula con la que el virus se une a tus células. Es la «H» de H1N1.'),[0,.98,0]],[T_('Neuraminidasa'),T_('Espícula que libera los virus nuevos. Es la «N» de H1N1.'),[.6,.6,.4]],
    [T_('Envoltura lipídica'),T_('Membrana robada a la célula que infectó.'),[.74,0,.1]],[T_('Segmentos de ARN'),T_('Ocho trozos de ARN: por eso la gripe se recombina con facilidad.'),[0,-.2,.2]]],
  lev:[[T_('Pared de quitina'),T_('La misma molécula que el caparazón de los insectos.'),[.78,0,0]],[T_('Núcleo'),T_('Es eucariota: tiene núcleo con membrana.'),[.15,.15,.2]],
    [T_('Vacuola'),T_('Almacena agua y sustancias.'),[-.12,-.25,.05]],[T_('Yema'),T_('La hija que está brotando.'),[.35,1.05,.1]],[T_('Cicatriz de gemación'),T_('Marca que deja cada yema al separarse.'),[.47,.38,.39]],[T_('Pseudohifa'),T_('Células alargadas en cadena: así invade los tejidos.'),[-.55,-1.25,0]]],
  ame:[[T_('Pseudópodo'),T_('Prolongación del citoplasma para moverse y comer.'),[1.3,.2,.1]],[T_('Núcleo'),T_('Núcleo grande y aplanado.'),[0,0,0]],[T_('Vacuola contráctil'),T_('Expulsa el agua que entra por ósmosis.'),[-.5,.3,.35]],
    [T_('Vacuola digestiva'),T_('Contiene algas que ha fagocitado.'),[.3,-.3,.35]],[T_('Ectoplasma'),T_('Capa externa, clara y sin gránulos.'),[0,1.12,.3]]],
  veg:[[T_('Pared de celulosa'),T_('Rígida: aguanta la presión de turgencia.'),[1.15,.45,.8]],[T_('Cloroplasto'),T_('Hace la fotosíntesis. Las pilas de discos son los grana.'),[.95,0,.3]],
    [T_('Vacuola central'),T_('Ocupa casi toda la célula y la mantiene turgente.'),[0,0,.45]],[T_('Núcleo'),T_('Desplazado a un lado por la vacuola.'),[-.78,.48,.38]],[T_('Plasmodesmos'),T_('Canales que comunican con las células vecinas.'),[.2,.85,.3]]],
  par:[[T_('Cilios'),T_('Miles de cilios que baten en ondas metacrónicas.'),[0,.55,0]],[T_('Macronúcleo'),T_('Controla el día a día de la célula.'),[-.05,0,.15]],[T_('Micronúcleo'),T_('Se usa en la reproducción sexual (conjugación).'),[.2,.05,.45]],
    [T_('Vacuola contráctil'),T_('Con forma de estrella: bombea fuera el agua.'),[0,.3,1]],[T_('Surco oral'),T_('Embudo por el que entra la comida.'),[.5,0,-.05]]],
  myc:[[T_('Orgánulo de adhesión'),T_('Punta con la que se pega a las células del pulmón.'),[.65,.9,0]],[T_('Membrana sin pared'),T_('Reforzada con colesterol robado al huésped.'),[-.6,0,.3]],[T_('ADN'),T_('Uno de los genomas más pequeños de cualquier ser vivo.'),[0,-.1,0]]],
  can:[[T_('Núcleos múltiples'),T_('Núcleos grandes y de tamaño desigual: señal de malignidad.'),[.2,.2,.3]],[T_('Nucléolo prominente'),T_('Fabrica ribosomas a toda velocidad para crecer.'),[.3,.32,.5]],
    [T_('Vesículas de membrana'),T_('Burbujas que forma al moverse e invadir.'),[1.1,.2,.5]],[T_('Mitosis anómala'),T_('Los cromosomas se reparten mal: aneuploidía.'),[-1.1,.8,-.25]],[T_('Vaso sanguíneo nuevo'),T_('Angiogénesis: el tumor fabrica sus propios vasos.'),[.6,-1.6,-.5]]],
  bac:[[T_('Bacilo'),T_('Bacteria en forma de bastón, en cadena.'),[0,.32,0]],[T_('Endospora'),T_('Núcleo deshidratado, córtex y cubierta de proteína. Aparece al esporular.'),[0,0,0]],[T_('Nucleoide'),T_('ADN bacteriano.'),[1.05,0,0]]],
  pri:[[T_('Lámina β'),T_('Cada flecha es un tramo de proteína plegado en lámina β.'),[.3,0,0]],[T_('Fibrilla amiloide'),T_('Las láminas se apilan en una fibra retorcida.'),[0,1.1,0]],[T_('PrP sana'),T_('Proteína normal, rica en hélices α. Al tocar la fibrilla se convierte.'),[1.5,.5,0]]],
  tbc:[[T_('Pared cérea'),T_('Ácidos micólicos: por eso retiene la fucsina en la tinción de Ziehl-Neelsen.'),[0,.25,.2]],[T_('Cordón'),T_('Las micobacterias se agrupan en cordones serpenteantes.'),[.9,-.1,0]]],
  mal:[[T_('Eritrocito infectado'),T_('Glóbulo rojo sin núcleo ni MHC-I: el escondite perfecto.'),[0,0,.3]],[T_('Anillo'),T_('Trofozoíto joven con forma de anillo de sello.'),[.15,.05,.2]],[T_('Merozoítos'),T_('Salen al reventar el eritrocito e invaden otros nuevos.'),[1,.6,.3]]],
  vih:[[T_('Glicoproteína gp120'),T_('Se une al receptor CD4 de tus linfocitos T.'),[0,.68,0]],[T_('Cápside cónica'),T_('Contiene dos copias de ARN y la transcriptasa inversa.'),[0,0,.2]],[T_('Envoltura'),T_('Membrana tomada de la célula infectada.'),[.6,0,0]]],
  ten:[[T_('Escólex'),T_('Cabeza con ventosas y una corona de ganchos para agarrarse al intestino.'),[-1.7,.1,0]],[T_('Proglótide'),T_('Cada segmento tiene órganos reproductores propios y se llena de huevos.'),[.6,0,0]],[T_('Tegumento'),T_('Piel viva que absorbe nutrientes: no tiene boca ni intestino.'),[1.4,.1,.1]]],
};

// Laboratorio de diagnóstico: resultado de cada prueba según el organismo
const DIAG_TESTS = {
  gram:{n:T_('Tinción de Gram'), r:{pos:T_('Se tiñe de violeta: bacteria Gram positiva.'), neg:T_('Se tiñe de rosa: bacteria Gram negativa.'), acid:T_('Se tiñe mal (Gram variable): una pared cérea impide que entren los colorantes.'),
    nowall:T_('Apenas se ve: no retiene el colorante, como si no tuviera pared.'), invis:T_('No se ve nada: es demasiado pequeño para el microscopio óptico.'), euk:T_('No es una bacteria: se ven células grandes con núcleo.'), macro:T_('No hace falta microscopio: se ve a simple vista.')}},
  fresco:{n:T_('Observación en fresco'), r:{gp:T_('Cocos agrupados en racimos, inmóviles.'), gn:T_('Bacilos que nadan deprisa con flagelos.'), bac:T_('Bacilos largos en cadena, inmóviles.'), tbc:T_('Bacilos finos agrupados en cordones serpenteantes.'),
    myc:T_('Células diminutas de forma variable.'), invis:T_('Demasiado pequeño para el microscopio óptico.'), lev:T_('Células ovaladas, algunas con yemas.'), ame:T_('Una célula grande que cambia de forma y se arrastra con pseudópodos.'),
    par:T_('Una célula con forma de zapatilla que nada girando gracias a sus cilios.'), veg:T_('Células rectangulares y verdes que forman un tejido.'), can:T_('Células grandes e irregulares, con núcleos de tamaño desigual.'),
    mal:T_('Algunos glóbulos rojos tienen un pequeño anillo dentro.'), ten:T_('Segmentos blancos y aplanados, visibles a simple vista.')}},
  zn:{n:T_('Tinción de Ziehl-Neelsen'), r:{pos:T_('Bacilos rojos sobre fondo azul: ácido-alcohol resistentes.'), neg:T_('Se ven azules: no son ácido-alcohol resistentes.'), na:T_('Prueba no útil: no hay bacterias que teñir.')}},
  esp:{n:T_('Tinción de esporas'), r:{pos:T_('Esporas verdes dentro de bacilos rosas.'), neg:T_('No se ven esporas.'), na:T_('Prueba no útil: no hay bacterias.')}},
  calco:{n:T_('Blanco de calcoflúor'), r:{chitin:T_('Brilla azul intenso con luz UV: pared de quitina, es un hongo.'), cell:T_('Brilla débilmente: el calcoflúor también se une a la celulosa.'), no:T_('No brilla: no tiene quitina ni celulosa.')}},
  me:{n:T_('Microscopio electrónico'), r:{vir:T_('Partículas esféricas de unos 100 nm con espículas en la envoltura.'), vih:T_('Partículas de unos 120 nm con una cápside interna en forma de cono.'),
    pri:T_('Fibrillas largas y retorcidas de unos 10 nm: amiloide.'), cell:T_('Se ven células completas con sus orgánulos: no es un virus.')}},
  giemsa:{n:T_('Frotis de sangre con Giemsa'), r:{pos:T_('Anillos morados dentro de los glóbulos rojos.'), neg:T_('Los glóbulos rojos están limpios.')}},
  congo:{n:T_('Rojo Congo con luz polarizada'), r:{pos:T_('Brillo verde manzana: hay depósitos de amiloide.'), neg:T_('Negativo: no hay amiloide.')}},
};
const DIAG_KEY = {
  gram:{gp:'pos',gn:'neg',bac:'pos',tbc:'acid',myc:'nowall',vir:'invis',vih:'invis',pri:'invis',lev:'euk',ame:'euk',par:'euk',veg:'euk',can:'euk',mal:'euk',ten:'macro'},
  fresco:{gp:'gp',gn:'gn',bac:'bac',tbc:'tbc',myc:'myc',vir:'invis',vih:'invis',pri:'invis',lev:'lev',ame:'ame',par:'par',veg:'veg',can:'can',mal:'mal',ten:'ten'},
  zn:{tbc:'pos',gp:'neg',gn:'neg',bac:'neg',myc:'neg'}, esp:{bac:'pos',gp:'neg',gn:'neg',tbc:'neg',myc:'neg'},
  calco:{lev:'chitin',veg:'cell'}, me:{vir:'vir',vih:'vih',pri:'pri'}, giemsa:{mal:'pos'}, congo:{pri:'pos'},
};
const DIAG_DEF = {zn:'na', esp:'na', calco:'no', me:'cell', giemsa:'neg', congo:'neg'};

// Narrador: la doctora Olmo, del laboratorio
const NARR = {
  new:T_('Lee sus rasgos: la pared, la membrana y el tipo de célula te dicen qué herramienta usar.'),
  immune:T_('No le ha hecho nada. Mira el rasgo resaltado en su ficha: ahí está la explicación.'),
  great:T_('¡Eso es! Has aprovechado su punto débil.'),
  lowhp:T_('Te queda poca vida. Si pierdes, retrocederás un nivel.'),
  boss:T_('Es un jefe: tiene mucha más vida. Es buen momento para una combinación.'),
  combo:T_('¡Una combinación! Quedará apuntada en el Laboratorio, en Herramientas.'),
  sarm:T_('Mira: una cepa resistente. Es lo que pasa cuando se abusa de un antibiótico.'),
  side:T_('Cuidado: esa herramienta también te daña a ti. Los fármacos tienen efectos secundarios.'),
  vih:T_('El VIH ataca a tus linfocitos T: cuanto más dure el combate, peor funcionarán los anticuerpos y los linfocitos T.'),
  mal:T_('Mientras esté dentro del glóbulo rojo, solo la artemisinina lo alcanza bien. Espera a que salgan los merozoítos.'),
  tbc:T_('La tuberculosis sobrevive dentro de los macrófagos: fagocitarla no basta. Necesitas un antibiótico específico.'),
  story:T_('Bienvenido al modo historia. Seguiremos una infección real, paso a paso.'),
};

