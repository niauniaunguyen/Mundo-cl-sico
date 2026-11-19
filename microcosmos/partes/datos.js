/* =====================================================================
   DATOS DE BIOLOGÍA (en español; las traducciones están en IDIOMAS)
   ===================================================================== */
const KPL = 5; // combates normales por nivel antes del jefe

// Rasgos: [texto, etiqueta]. La etiqueta permite señalar qué rasgo explica cada resultado.
const TYPES = {
  gp:{n:'Estafilococo',sci:'Staphylococcus aureus',min:1,col:0xa67bff,boss:'Biofilm de estafilococos',
    traits:[['Bacteria Gram+','gram'],['Pared de peptidoglucano gruesa','pg'],['Fisión binaria','fission']],
    desc:'Bacteria esférica (coco) que forma racimos. En la tinción de Gram queda violeta porque su gruesa pared de peptidoglucano retiene el cristal violeta. Cada pocos turnos se divide por fisión binaria y recupera vida.'},
  gn:{n:'Bacilo Gram−',sci:'Escherichia coli',min:3,col:0xff6fae,boss:'Colonia de E. coli',dodge:.15,dodgeWhy:'Su flagelo gira como una hélice y la aparta del golpe.',
    traits:[['Bacteria Gram−','gram'],['Membrana externa con LPS','outer'],['Peptidoglucano fino','pg'],['Flagelo','flag']],
    desc:'Bacilo (bastón) que se tiñe de rosa en la tinción de Gram: su capa de peptidoglucano es fina y está escondida bajo una membrana externa de lipopolisacárido (LPS). Esa membrana frena a la lisozima y a muchos antibióticos. Su flagelo le permite esquivar.'},
  vir:{n:'Virus de la gripe',sci:'Influenzavirus A',min:6,col:0xffb547,boss:'Viremia',
    traits:[['Acelular','acell'],['Envoltura con espículas','env'],['Parásito intracelular obligado','intra']],
    desc:'No es una célula: es material genético (ARN) dentro de una cápside y una envoltura con espículas de hemaglutinina y neuraminidasa. No tiene metabolismo propio, así que los antibióticos no le hacen nada. Turno sí, turno no, se esconde dentro de una célula del huésped para replicarse, y cada pocos turnos sus espículas mutan (deriva antigénica).'},
  lev:{n:'Levadura',sci:'Candida albicans',min:9,col:0xe0b35e,boss:'Candidiasis',
    traits:[['Hongo unicelular','fungus'],['Pared de quitina','chitin'],['Ergosterol en la membrana','ergo'],['Gemación','budding']],
    desc:'Hongo unicelular eucariota. Su pared es de quitina y glucanos (no de celulosa ni de peptidoglucano) y su membrana usa ergosterol en lugar de colesterol. Se reproduce por gemación: le brota una yema que crece.'},
  ame:{n:'Ameba',sci:'Amoeba proteus',min:12,col:0xb8f06a,boss:'Ameba gigante',dodge:.2,dodgeWhy:'Cambia de forma con sus pseudópodos y se escurre.',
    traits:[['Protozoo','protist'],['Sin pared celular','nowall'],['Pseudópodos','pseudo'],['Vacuola contráctil pequeña','vac']],
    desc:'Protozoo que se mueve emitiendo pseudópodos, prolongaciones de su citoplasma. No tiene pared celular: solo su membrana plasmática la separa del medio. Por eso cambia de forma y esquiva con facilidad.'},
  veg:{n:'Célula vegetal',sci:'Elodea canadensis (parénquima)',min:15,col:0x5dff8a,boss:'Tejido de parénquima',
    traits:[['Pared de celulosa','cellulose'],['Cloroplastos','chloro'],['Vacuola central','vac'],['Fotosíntesis','photo']],
    desc:'Célula eucariota con pared de celulosa, una gran vacuola central y cloroplastos. Mientras haya luz hace la fotosíntesis y se repara cada turno. Fíjate en la ciclosis: los cloroplastos giran arrastrados por el citoplasma.'},
  par:{n:'Paramecio',sci:'Paramecium caudatum',min:18,col:0xc6b3ff,boss:'Enjambre de paramecios',hits:2,
    traits:[['Protozoo ciliado','protist'],['Vacuola contráctil','vac'],['Miles de cilios','cilia'],['Sin pared celular','nowall']],
    desc:'Protozoo cubierto de cilios que baten en ondas: ataca dos veces por turno. Vive en agua dulce, un medio hipotónico, y tiene vacuolas contráctiles con forma de estrella que expulsan sin parar el agua que le entra por ósmosis.'},
  myc:{n:'Micoplasma',sci:'Mycoplasma pneumoniae',min:21,col:0xff9f6b,boss:'Neumonía atípica',dodge:.1,dodgeWhy:'Es tan pequeño y deformable que se cuela entre tus pseudópodos.',
    traits:[['Bacteria sin pared','nowall'],['Colesterol en la membrana','chol'],['Pleomórfica','pleo'],['Diminuta','tiny']],
    desc:'Una de las bacterias más pequeñas que existen y una excepción: no tiene pared celular. Toma colesterol del huésped para reforzar su membrana. Sin pared, los antibióticos que atacan el peptidoglucano no le hacen nada.'},
  can:{n:'Célula tumoral',sci:'Carcinoma (célula propia mutada)',min:24,col:0xff3b5c,boss:'Tumor',
    traits:[['Célula propia mutada','self'],['Sin pared celular','nowall'],['Mitosis descontrolada','mitosis'],['Evita la apoptosis','apop']],
    desc:'Una célula de tu propio cuerpo con mutaciones en genes que controlan el ciclo celular (como TP53). Se divide sin freno: cada turno recupera vida por mitosis. Como es propia, el sistema inmune la reconoce mal.'},
  bac:{n:'Bacilo esporulado',sci:'Bacillus cereus',min:27,col:0x8f6bff,boss:'Colonia esporulada',
    traits:[['Bacteria Gram+','gram'],['Pared de peptidoglucano','pg'],['Forma endosporas','spore']],
    desc:'Bacilo Gram+. Cuando las condiciones empeoran forma una endospora: una estructura deshidratada, con capas de proteína y ácido dipicolínico, que resiste el calor seco, la radiación y los desinfectantes. Solo el vapor a presión del autoclave la destruye.'},
  pri:{n:'Prion',sci:'PrPSc (proteína priónica mal plegada)',min:30,col:0xffe066,boss:'Placa amiloide',
    traits:[['Proteína mal plegada','protein'],['Sin ácidos nucleicos','nonuc'],['Resistente a proteasas','protres'],['Contagia su plegamiento','conv']],
    desc:'Ni siquiera es un ser vivo: es una proteína propia (PrP) plegada de forma anómala, rica en láminas β. Cuando toca una PrP normal, la obliga a plegarse igual: su ataque crece cada turno. No tiene ADN ni ARN y el sistema inmune no la ve como extraña.'},
};
const TYPE_ORDER = Object.keys(TYPES);
const BACTERIA = ['gp','gn','myc','bac'];

// Herramientas: pow = potencia, cd = turnos de recarga, cost = ATP para desbloquear
const TOOLS = [
  {id:'fago',n:'Fagocitosis',col:0x7fe0ff,pow:1,cd:0,cost:0,d:'Rodeas al invasor con pseudópodos, lo encierras en un fagosoma y lo digieres con las enzimas de tus lisosomas.'},
  {id:'lis',n:'Lisozima',col:0x9be7ff,pow:1.4,cd:1,cost:25,d:'Enzima de las lágrimas y la saliva. Rompe los enlaces β(1→4) entre NAM y NAG, los azúcares del peptidoglucano.'},
  {id:'pen',n:'Penicilina',col:0x4dffa0,pow:1.8,cd:2,cost:110,ab:true,d:'Antibiótico β-lactámico. Bloquea las transpeptidasas que entrelazan el peptidoglucano: la bacteria crece sin poder reparar su pared y estalla. Si abusas de ella, seleccionas cepas resistentes.'},
  {id:'uv',n:'Luz ultravioleta',col:0xb98cff,pow:1.2,cd:1,cost:260,d:'La UV-C une timinas vecinas del ADN (dímeros de timina) y bloquea la replicación y la transcripción.'},
  {id:'ac',n:'Anticuerpos',col:0xffd36b,pow:.8,cd:3,cost:420,d:'Inmunoglobulinas en forma de Y que se unen a antígenos concretos. Neutralizan virus y marcan (opsonizan) al objetivo: +60 % de daño durante 3 turnos.'},
  {id:'anf',n:'Anfotericina B',col:0xff9f6b,pow:1.7,cd:2,cost:900,d:'Antifúngico que se une al ergosterol de la membrana de los hongos y abre poros por donde se escapan iones.'},
  {id:'osm',n:'Choque osmótico',col:0x6c95ff,pow:1.3,cd:2,cost:1700,d:'Agua destilada: un medio hipotónico. El agua entra en la célula por ósmosis; si no tiene pared que la contenga, se hincha hasta reventar (lisis).'},
  {id:'luz',n:'Apagar la luz',col:0x334455,pow:0,cd:4,cost:2800,d:'Sin luz no hay fase luminosa de la fotosíntesis: los cloroplastos dejan de producir ATP y NADPH, y la célula no puede repararse.'},
  {id:'cel',n:'Celulasa',col:0x5dff8a,pow:1.6,cd:2,cost:3500,d:'Enzima que hidroliza la celulosa, el polisacárido que forma la pared de las células vegetales.'},
  {id:'tc',n:'Linfocito T citotóxico',col:0xff6fd8,pow:1.5,cd:2,cost:6500,d:'Linfocito CD8 que reconoce péptidos extraños presentados en el MHC-I de una célula y le ordena entrar en apoptosis. Ataca células infectadas o tumorales, aunque el virus esté escondido dentro.'},
  {id:'tax',n:'Taxol',col:0xff4f7b,pow:1.4,cd:3,cost:11000,d:'Antimitótico (paclitaxel). Estabiliza los microtúbulos e impide que se forme y se desmonte el huso mitótico. Bloquea la división durante 3 turnos.'},
  {id:'aut',n:'Autoclave',col:0xffffff,pow:2.4,cd:4,cost:18000,d:'Vapor de agua a 121–134 °C y alta presión. Desnaturaliza las proteínas y destruye incluso endosporas y priones.'},
];
const TOOL = Object.fromEntries(TOOLS.map(t => [t.id, t]));
// Rasgos que explican el resultado de cada herramienta (se resaltan en la ficha)
const KEYTRAIT = {fago:['acell','self','protein','cellulose','pseudo','tiny'], lis:['pg','outer','nowall','acell','chitin','cellulose','protein'], pen:['pg','outer','nowall','acell','chitin','cellulose','protein'],
  uv:['nonuc','cellulose','chloro'], ac:['self','protein','intra','cellulose','env'], anf:['ergo','chol','gram','acell','protein','protist'], osm:['nowall','pg','chitin','cellulose','vac','acell','protein'],
  luz:['photo','chloro'], cel:['cellulose','chitin','pg'], tc:['intra','self','gram','protist','fungus'], tax:['mitosis','fission','acell','protein','budding'], aut:['spore','protein']};

// Eficacia [multiplicador, explicación] de cada herramienta contra cada organismo
const NOWALL_PG = 'No tiene peptidoglucano: esa molécula solo existe en la pared de las bacterias.';
const EFF = {
  fago:{def:[1,'La fagocitosis sirve contra casi cualquier partícula: la engulles y la digieres.'],
    vir:[.7,'Las partículas víricas miden unos 100 nm: muchas se te escapan.'],
    veg:[.4,'La célula vegetal es grande y su pared rígida no se deja englobar.'],
    can:[.6,'Las células tumorales exhiben la señal «no me comas» (CD47) y frenan a los macrófagos.'],
    pri:[.5,'Los agregados de prion no se pueden digerir en los lisosomas: se acumulan.'],
    ame:[.8,'La ameba también fagocita: es difícil engullir a quien hace lo mismo que tú.'],
    par:[.6,'Un paramecio mide unas 200 µm, diez veces más que tú: solo puedes morder trozos.']},
  lis:{def:[0,NOWALL_PG],
    gp:[2.5,'Su peptidoglucano es grueso y está expuesto: la lisozima lo corta y la pared se deshace.'],
    gn:[.5,'La membrana externa de las Gram− tapa su fina capa de peptidoglucano.'],
    bac:[2,'Bacillus es Gram+: pared gruesa de peptidoglucano al descubierto.'],
    myc:[0,'El micoplasma no tiene pared celular: no hay peptidoglucano que romper.'],
    vir:[0,'Un virus no tiene pared ni peptidoglucano.'],
    lev:[0,'La pared de los hongos es de quitina y glucanos, no de peptidoglucano.'],
    veg:[0,'La pared vegetal es de celulosa: la lisozima no la reconoce.'],
    pri:[0,'Un prion es una proteína: no tiene pared que romper.']},
  pen:{def:[0,'La penicilina solo impide fabricar la pared de peptidoglucano de las bacterias.'],
    gp:[2.5,'Sin transpeptidasas, la bacteria no puede reforzar su pared al crecer: estalla.'],
    bac:[2.2,'Gram+: la penicilina llega a su pared sin obstáculos.'],
    gn:[.6,'La membrana externa frena la entrada de la penicilina; muchas Gram− le resisten.'],
    myc:[0,'Sin pared celular, la penicilina no tiene diana. Por eso las neumonías por micoplasma se tratan con otros antibióticos, como los macrólidos.'],
    vir:[0,'Los antibióticos no afectan a los virus: no tienen pared ni metabolismo propio.'],
    lev:[0,'Los hongos son eucariotas con pared de quitina: la penicilina no les afecta. De hecho, la penicilina la fabrica un hongo, Penicillium.']},
  uv:{def:[1,'La UV daña el ADN de cualquier célula.'],
    gp:[1.5,'Las bacterias tienen un solo cromosoma desnudo: la UV lo daña con facilidad.'],
    gn:[1.5,'Las bacterias tienen un solo cromosoma desnudo: la UV lo daña con facilidad.'],
    myc:[1.5,'Un genoma diminuto y sin pared que lo proteja.'],
    vir:[1.6,'Los dímeros que forma la UV en su genoma impiden que el virus se replique.'],
    veg:[.6,'Los pigmentos y la pared filtran parte de la radiación.'],
    bac:[1.3,'Mientras no forme la endospora, su ADN es vulnerable.'],
    pri:[0,'Un prion es solo proteína: no tiene ADN ni ARN que dañar.']},
  ac:{def:[1,'Los anticuerpos reconocen sus antígenos de superficie y lo marcan.'],
    vir:[2.5,'Los anticuerpos neutralizan el virus: tapan la hemaglutinina con la que se une a tus células.'],
    gp:[1.2,'Los anticuerpos opsonizan la bacteria: la marcan para que la destruyas.'],
    gn:[1.2,'Los anticuerpos opsonizan la bacteria y activan el complemento contra su membrana externa.'],
    veg:[.5,'La pared impide que lleguen a la membrana, pero la marcan.'],
    can:[.5,'Es una célula propia: tiene pocos antígenos que tu sistema inmune vea como extraños.'],
    pri:[0,'El prion es una proteína propia mal plegada: tu sistema inmune no la reconoce como extraña.']},
  anf:{def:[.3,'Las células animales usan colesterol, no ergosterol: les afecta poco.'],
    lev:[3,'La anfotericina B se une al ergosterol de su membrana y abre poros: la levadura pierde iones y muere.'],
    gp:[0,'Las bacterias no tienen esteroles en la membrana.'],gn:[0,'Las bacterias no tienen esteroles en la membrana.'],bac:[0,'Las bacterias no tienen esteroles en la membrana.'],
    myc:[.6,'El micoplasma toma colesterol del huésped para su membrana: algo le afecta.'],
    vir:[0,'Su envoltura viene de la membrana de la célula huésped y no tiene ergosterol.'],
    veg:[.4,'Las plantas usan fitoesteroles, parecidos al ergosterol pero no iguales.'],
    ame:[1.2,'Muchas amebas de vida libre tienen esteroles parecidos al ergosterol. La anfotericina B se usa contra Naegleria fowleri, la «ameba come-cerebros».'],
    par:[.5,'El paramecio usa otros esteroles (como el tetrahimanol): le afecta poco.'],
    pri:[0,'Un prion no tiene membrana.']},
  osm:{def:[.3,'Su pared celular resiste la presión del agua que entra: queda turgente, pero no revienta.'],
    ame:[2.5,'Sin pared celular, el agua entra por ósmosis hasta que la membrana estalla.'],
    myc:[2.5,'El micoplasma no tiene pared: la lisis osmótica es inmediata.'],
    can:[2.2,'Una célula animal no tiene pared: se hincha y revienta.'],
    par:[.6,'Sus vacuolas contráctiles bombean fuera el agua que entra: está adaptado al agua dulce.'],
    veg:[.3,'La pared de celulosa aguanta la presión de turgencia: la célula se pone turgente, no revienta.'],
    vir:[0,'Un virus no es una célula: no hay ósmosis que lo haga reventar.'],
    pri:[0,'Un prion es una proteína: no tiene membrana ni citoplasma.']},
  luz:{def:[0,'No hace la fotosíntesis: la oscuridad no le afecta.'],
    veg:[1,'Sin luz, los cloroplastos no pueden hacer la fase luminosa: se acabó la reparación por fotosíntesis.']},
  cel:{def:[0,'No tiene pared de celulosa.'],
    veg:[3,'La celulasa digiere su pared de celulosa y la deja indefensa.'],
    lev:[0,'La pared de los hongos es de quitina, no de celulosa.']},
  tc:{def:[.5,'Los linfocitos T citotóxicos atacan células propias infectadas o alteradas, no microbios libres.'],
    vir:[2.5,'Reconoce los péptidos víricos que la célula infectada presenta en su MHC-I y la destruye, con el virus dentro.'],
    can:[2,'Reconoce antígenos tumorales y le ordena entrar en apoptosis.'],
    lev:[.7,'Contra los hongos son más útiles los neutrófilos y los linfocitos Th17 que los T citotóxicos.'],
    pri:[0,'El prion es una proteína propia: no hay antígeno extraño que reconocer.']},
  tax:{def:[1,'Los eucariotas usan microtúbulos para dividirse: el taxol les afecta.'],
    can:[2.5,'Se divide sin control: si bloqueas su huso mitótico, se detiene y muere.'],
    gp:[0,'Las bacterias no tienen microtúbulos ni mitosis: se dividen por fisión binaria.'],
    gn:[0,'Las bacterias no tienen microtúbulos ni mitosis: se dividen por fisión binaria.'],
    bac:[0,'Las bacterias no tienen microtúbulos ni mitosis: se dividen por fisión binaria.'],
    myc:[0,'Las bacterias no tienen microtúbulos ni mitosis: se dividen por fisión binaria.'],
    vir:[0,'Un virus no se divide: lo copia la maquinaria de la célula que infecta.'],
    pri:[0,'Un prion no se divide: convierte proteínas sanas.'],
    ame:[1.2,'La ameba se divide por mitosis: el huso le es imprescindible.'],par:[1.2,'El paramecio usa microtúbulos para dividirse y para sus cilios.']},
  aut:{def:[1.2,'El vapor a presión desnaturaliza sus proteínas.'],
    bac:[1.5,'El autoclave es lo único que destruye endosporas.'],
    pri:[1.6,'Hacen falta 134 °C durante 18 minutos para inactivar priones: un autoclave prolongado.']},
};

// Combinaciones: la herramienta «then» justo después de «first» (con efecto) multiplica su eficacia
const COMBOS = [
  {id:'proto',first:'lis',then:'osm',types:['gp','gn','bac'],m:2.6,n:'Protoplasto',why:'La lisozima abrió la pared de peptidoglucano: sin ella, el agua entra por ósmosis y la bacteria revienta. Así se obtienen protoplastos en el laboratorio.'},
  {id:'opso',first:'ac',then:'fago',types:null,m:2.2,n:'Opsonización',why:'Tus receptores Fc reconocen la cola de los anticuerpos: fagocitas mucho mejor lo que está marcado.'},
  {id:'turg',first:'cel',then:'osm',types:['veg'],m:2.6,n:'Pared digerida',why:'Sin pared de celulosa que aguante la presión de turgencia, la célula vegetal estalla en agua destilada.'},
  {id:'poro',first:'anf',then:'osm',types:['lev'],m:2.2,n:'Poros en la membrana',why:'Los poros de la anfotericina dejan pasar iones y agua: la levadura pierde el control osmótico.'},
  {id:'apop',first:'tax',then:'tc',types:['can'],m:2.4,n:'Mitosis detenida',why:'Una célula bloqueada en mitosis activa sus señales de estrés, y el linfocito T la empuja antes a la apoptosis.'},
];

const UPG = [
  {id:'fue',n:'Enzimas lisosomales',d:'Más hidrolasas ácidas en tus lisosomas para digerir lo que capturas.',e:'Ataque ×1,15',base:10,k:1.4},
  {id:'mem',n:'Membrana reforzada',d:'Más fosfolípidos y colesterol: una bicapa más estable.',e:'Vida ×1,15',base:10,k:1.4},
  {id:'cit',n:'Citoesqueleto',d:'Filamentos de actina e intermedios que sostienen la célula ante los golpes.',e:'−4 % de daño recibido',base:30,k:1.4,max:15},
  {id:'rib',n:'Ribosomas',d:'Más síntesis de proteínas: aprovechas mejor lo que digieres.',e:'ATP por victoria ×1,2',base:25,k:1.55},
  {id:'mit',n:'Mitocondrias',d:'Respiración celular: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + ATP. Producen ATP aunque no combatas.',e:'+ATP por segundo',base:15,k:1.3},
  {id:'ref',n:'Señalización rápida',d:'Segundos mensajeros (AMPc, Ca²⁺) que aceleran tu respuesta.',e:'Combate automático más rápido',base:80,k:1.8,max:6},
];

// Células que puedes encarnar (se desbloquean al evolucionar)
const CELLS = {
  mac:{n:'Macrófago',size:'≈ 21 µm',need:0,hp:1,atk:1,bonus:{},nuc:'bean',gran:0xd8ff6b,
    d:'Fagocito grande y longevo que vive en los tejidos. Presenta antígenos a los linfocitos y equilibrado en todo.'},
  neu:{n:'Neutrófilo',size:'≈ 12 µm',need:1,hp:.85,atk:1.1,bonus:{gp:1.4,gn:1.4,bac:1.4,lev:1.4,myc:1.3},nuc:'lobes',gran:0xe8e0ff,
    d:'El leucocito más abundante: llega el primero a las infecciones y lanza trampas de ADN (NET) contra bacterias y hongos. ×1,4 contra bacterias y levaduras; algo menos de vida.'},
  nk:{n:'Linfocito NK',size:'≈ 10 µm',need:2,hp:.9,atk:1,bonus:{vir:1.5,can:1.5},nuc:'round',gran:0xff4f7b,hidden:true,
    d:'Asesino natural: detecta células que han perdido el MHC-I, como las infectadas o las tumorales, y las destruye con perforina y granzimas. ×1,5 contra virus y tumores, y alcanza al virus escondido.'},
  eos:{n:'Eosinófilo',size:'≈ 14 µm',need:3,hp:1.1,atk:1,bonus:{ame:1.5,par:1.5},nuc:'bilobed',gran:0xff7a3a,
    d:'Sus gránulos de proteína básica mayor atacan a parásitos demasiado grandes para fagocitarlos. ×1,5 contra protozoos y algo más de vida.'},
};

// Colores de tu célula: proteínas fluorescentes reales
const SKINS = {
  cfp:{n:'CFP (cian)',col:0x58c8ff,need:null,d:'Variante cian de la GFP.'},
  gfp:{n:'GFP (verde)',col:0x4dffa0,need:['evos',1],d:'Proteína verde fluorescente de la medusa Aequorea victoria. Shimomura, Chalfie y Tsien recibieron el Nobel de Química de 2008 por ella.'},
  yfp:{n:'YFP (amarilla)',col:0xffe066,need:['daily',1],d:'Variante amarilla de la GFP, obtenida cambiando unos pocos aminoácidos.'},
  bfp:{n:'BFP (azul)',col:0x7f8cff,need:['evos',3],d:'Variante azul de la GFP.'},
  mch:{n:'mCherry (roja)',col:0xff4f7b,need:['daily',3],d:'Proteína roja derivada de DsRed, del coral Discosoma.'},
  mor:{n:'mOrange',col:0xff9f40,need:['ach',8],d:'Otra variante de DsRed, de color naranja.'},
};

// Zonas del cuerpo (el mapa)
const ZONES = {
  san:{n:'Sangre',types:null,tint:[0,0,0],d:'Todo el torrente sanguíneo: puede aparecer cualquier organismo.'},
  pul:{n:'Pulmones',types:['gp','gn','vir','myc','lev'],tint:[.0,.02,.05],d:'Alvéolos pulmonares: gripe, neumonías bacterianas y atípicas.'},
  int:{n:'Intestino',types:['gn','ame','bac','lev','can'],tint:[.04,.02,0],d:'Intestino: E. coli, amebas, bacilos que forman esporas y tumores de colon.'},
  pie:{n:'Piel',types:['gp','lev','bac'],tint:[.04,.0,.02],d:'Heridas y piel: estafilococos, Candida y bacilos del suelo.'},
  cer:{n:'Cerebro',types:['pri','vir','ame'],tint:[.02,0,.05],d:'Sistema nervioso: priones, encefalitis víricas y Naegleria, la ameba que entra por la nariz.'},
  cha:{n:'Charca',types:['par','ame','veg'],tint:[0,.05,.02],d:'Una gota de agua de charca en el portaobjetos: protozoos y hojas de Elodea. (Aquí no estás dentro de un cuerpo: es una práctica de laboratorio.)'},
};

// Eventos aleatorios
const EVENTS = {
  fiebre:{n:'Fiebre',d:'La temperatura sube a 39 °C: las enzimas van más rápido y todos hacéis un 25 % más de daño.'},
  antib:{n:'Antibiótico en sangre',d:'Llega un antibiótico de amplio espectro: si el organismo es una bacteria, pierde un 8 % de su vida cada turno.'},
  vacuna:{n:'Vacuna',d:'Tu sistema inmune ya conoce a este organismo: ves la eficacia de todas tus herramientas contra él y los anticuerpos hacen el doble.'},
  inflam:{n:'Inflamación',d:'Los vasos se dilatan y llegan refuerzos: recuperas un 6 % de vida cada turno.'},
  hipoxia:{n:'Hipoxia',d:'Falta oxígeno: tus mitocondrias rinden menos y haces un 20 % menos de daño, pero ganas un 50 % más de ATP si vences.'},
};

// Jefes especiales cada 10 niveles (con dos fases)
const SPECIAL = [
  {type:'gn',n:'Sepsis',p2:'Choque endotóxico: al romperse, las bacterias liberan LPS y te dañan cada turno.'},
  {type:'vir',n:'Gripe pandémica',p2:'Tormenta de citocinas: tu propia inflamación se desboca y los dos hacéis un 30 % más de daño.'},
  {type:'can',n:'Tumor maligno',p2:'Angiogénesis: nuevos vasos sanguíneos lo alimentan y se cura cada turno, salvo si bloqueas su mitosis.'},
  {type:'pri',n:'Placa amiloide',p2:'Agregación: la placa crece y su ataque aumenta un 20 % cada turno.'},
];

// Logros: cada uno trae un dato curioso
const ACH = [
  {id:'k1',n:'Primera fagocitosis',f:'Élie Metchnikoff descubrió la fagocitosis en 1882 clavando espinas de rosal en larvas de estrella de mar. Recibió el Nobel en 1908.'},
  {id:'k100',n:'Cien victorias',f:'Tu médula ósea fabrica cada día unos 100 000 millones de neutrófilos.'},
  {id:'gp',n:'Cazador de estafilococos',f:'Alrededor del 30 % de las personas lleva Staphylococcus aureus en la nariz sin enfermar.'},
  {id:'gn',n:'Domador de E. coli',f:'En condiciones ideales, E. coli se divide cada 20 minutos: en 10 horas, una sola célula daría más de mil millones.'},
  {id:'vir',n:'Antivírico',f:'Un virión de la gripe mide unos 100 nm: cabrían unos 10 000 en fila en un milímetro.'},
  {id:'lev',n:'Equilibrio de la flora',f:'Candida albicans vive en la boca y el intestino de la mayoría de las personas; solo causa candidiasis cuando se rompe el equilibrio.'},
  {id:'veg',n:'Botánico',f:'Robert Hooke llamó «células» a las celdillas que vio en el corcho en 1665: eran las paredes de células vegetales muertas.'},
  {id:'par',n:'Gota de charca',f:'Un paramecio nada a alrededor de 1 mm por segundo, unas cinco veces su longitud.'},
  {id:'can',n:'Guardián del genoma',f:'El gen TP53, «el guardián del genoma», está mutado en cerca de la mitad de los cánceres humanos.'},
  {id:'pri',n:'Solo proteína',f:'Stanley Prusiner recibió el Nobel en 1997 por descubrir los priones, partículas infecciosas hechas solo de proteína.'},
  {id:'combo',n:'Sinergia',f:'La sinergia entre fármacos es real: por ejemplo, un β-lactámico daña la pared y facilita la entrada de un aminoglucósido.'},
  {id:'quiz',n:'Buen ojo clínico',f:'Antes de recetar un antibiótico, el laboratorio hace un antibiograma para saber a qué es sensible cada bacteria.'},
  {id:'sarm',n:'Presión selectiva',f:'El SARM se describió en 1961, apenas dos años después de empezar a usarse la meticilina.'},
  {id:'evo',n:'Descendencia',f:'LUCA, el último antepasado común universal de todos los seres vivos, vivió hace unos 4000 millones de años.'},
  {id:'l25',n:'Inmunidad adquirida',f:'Tus linfocitos B pueden fabricar miles de millones de anticuerpos distintos gracias a la recombinación V(D)J.'},
  {id:'atlas',n:'Atlas completo',f:'Antonie van Leeuwenhoek fue el primero en ver bacterias y protozoos, hacia 1676, con microscopios de una sola lente que él mismo pulía.'},
  {id:'daily',n:'Constancia',f:'Tu cuerpo renueva unos 330 000 millones de células al día, alrededor del 1 % del total.'},
  {id:'boss',n:'Contra la sepsis',f:'La sepsis es una respuesta descontrolada del cuerpo ante una infección: reconocerla pronto salva vidas.'},
];

// Retos diarios (se eligen dos cada día según la fecha)
const DAILY = [
  {id:'noab',n:'Vence a 6 bacterias sin usar antibióticos',goal:6},
  {id:'great',n:'Consigue 8 golpes «Muy eficaz»',goal:8},
  {id:'combo',n:'Haz 3 combinaciones',goal:3},
  {id:'boss',n:'Vence a 2 jefes',goal:2},
  {id:'fago',n:'Vence a 4 organismos usando solo la fagocitosis',goal:4},
  {id:'quick',n:'Gana 5 combates en 3 turnos o menos',goal:5},
  {id:'kills',n:'Gana 25 combates',goal:25},
];

// Datos de laboratorio: técnica de observación y tamaño real
const LAB = {
  gp:['Tinción de Gram','Ø ≈ 1 µm'], gn:['Tinción de Gram','2 × 0,5 µm'], vir:['Tinción negativa · microscopio electrónico','≈ 100 nm'],
  lev:['Blanco de calcoflúor (se une a la quitina)','4–6 µm'], ame:['Contraste de fases','≈ 500 µm'], veg:['Campo claro, sin teñir: la clorofila ya es verde','≈ 50 µm'],
  par:['Campo oscuro','≈ 200 µm'], myc:['Microscopio electrónico de barrido','0,2–0,3 µm'], can:['Hematoxilina y eosina','15–30 µm'],
  bac:['Verde de malaquita (tinción de esporas)','3–5 × 1 µm'], pri:['Rojo Congo (birrefringencia verde manzana)','fibrillas de ≈ 10 nm'],
};

const SOURCES = [
  'Madigan, M. T. et al. (2019). Brock. Biología de los microorganismos (14.ª ed.). Pearson.',
  'Alberts, B. et al. (2016). Biología molecular de la célula (6.ª ed.). Omega.',
  'Abbas, A. K., Lichtman, A. H. y Pillai, S. (2022). Inmunología celular y molecular (10.ª ed.). Elsevier.',
  'Murray, P. R., Rosenthal, K. S. y Pfaller, M. A. (2021). Microbiología médica (9.ª ed.). Elsevier.',
  'Prusiner, S. B. (1998). Prions. PNAS, 95(23), 13363–13383.',
  'OMS (1999). WHO Infection Control Guidelines for Transmissible Spongiform Encephalopathies.',
  'Sender, R. y Milo, R. (2021). The distribution of cellular turnover in the human body. Nature Medicine, 27, 45–48.',
  'Tsien, R. Y. (1998). The green fluorescent protein. Annual Review of Biochemistry, 67, 509–544.',
];
const LICENSES = [
  'Un macrófago no fabrica antibióticos ni enciende autoclaves: las herramientas representan lo que el sistema inmune y la medicina pueden hacer contra cada organismo.',
  'Los paramecios y las células vegetales no infectan a las personas: aparecen como práctica de laboratorio (la zona Charca).',
  'Los números de daño, vida y ATP son abstracciones de juego. Los multiplicadores de eficacia son orientativos y comparan unos organismos con otros.',
  'Las proporciones de los modelos 3D están exageradas para que se vean los orgánulos.',
];

