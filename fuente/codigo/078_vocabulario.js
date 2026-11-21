// ============================================================ VOCABULARIO: maestros que enseñan palabras en griego (Atenas) y en latín (Roma)
// Cuando demuestras que sabes una palabra, pasa a aparecer en el idioma original en el resto de diálogos (#dBody).
// Al pasar el ratón o tocar la palabra se ve su significado. Se puede cambiar o desactivar en el menú (vocMode: orig · tr · off).
// Cada entrada: es = formas en español; g/gt = griego ático y transliteración; l = latín; eg/el = de dónde vienen palabras nuestras.
const VOCAB=[
 {k:'ciudad',es:['ciudad','ciudades'],g:['πόλις','πόλεις'],gt:['pólis','póleis'],l:['urbs','urbes'],eg:'política, metrópoli, acrópolis.',el:'urbano, urbanismo. Roma era «la Urbs», la ciudad por excelencia.'},
 {k:'casa',es:['casa','casas'],g:['οἰκία','οἰκίαι'],gt:['oikía','oikíai'],l:['domus','domus'],eg:'de la familia de οἶκος, la casa como familia y hacienda: economía, ecología.',el:'doméstico, domicilio. Casi nadie vivía en una domus: la mayoría alquilaba un piso en una insula.'},
 {k:'templo',es:['templo','templos'],g:['ἱερόν','ἱερά'],gt:['hierón','hierá'],l:['templum','templa'],eg:'«lo sagrado»: jerarquía, jeroglífico. El edificio del templo, en ático, era el νεώς.',el:'templo y contemplar: el templum era el trozo de cielo que el augur marcaba para mirar las aves.'},
 {k:'puerta',es:['puerta','puertas'],g:['θύρα','θύραι'],gt:['thýra','thýrai'],l:['porta','portae'],eg:'tiroides, por el escudo θυρεός, grande como una puerta.',el:'portal, portero. La porta era la de la muralla; la de una casa se llamaba ianua.'},
 {k:'escuela',es:['escuela','escuelas'],g:['σχολή','σχολαί'],gt:['scholḗ','scholaí'],l:['ludus','ludi'],eg:'escuela, escolar. Quería decir «tiempo libre»: estudiaba quien no tenía que trabajar.',el:'lúdico. Ludus es también «juego»; la escuela de primeras letras era el ludus litterarius.'},
 {k:'libro',es:['libro','libros'],g:['βιβλίον','βιβλία'],gt:['biblíon','biblía'],l:['liber','libri'],eg:'biblioteca, bibliografía. Viene de Biblos, el puerto fenicio por el que llegaba el papiro.',el:'libro, librería. Liber era la corteza interior del árbol, donde se escribía antes del papiro.'},
 {k:'ley',es:['ley','leyes'],g:['νόμος','νόμοι'],gt:['nómos','nómoi'],l:['lex','leges'],eg:'autonomía («darse leyes a uno mismo»), astronomía, economía.',el:'legal, legislar. Las Doce Tablas, las primeras leyes escritas, estaban expuestas en el Foro.'},
 {k:'pueblo',es:['pueblo','pueblos'],g:['δῆμος','δῆμοι'],gt:['dêmos','dêmoi'],l:['populus','populi'],eg:'democracia, epidemia. También era cada uno de los demos o barrios del Ática.',el:'popular, población. SPQR: Senatus Populusque Romanus, «el Senado y el Pueblo romano».'},
 {k:'ciudadano',es:['ciudadano','ciudadanos','ciudadana','ciudadanas'],g:['πολίτης','πολῖται','πολῖτις','πολίτιδες'],gt:['polítēs','polîtai','polîtis','polítides'],l:['civis','cives','civis','cives'],eg:'político, cosmopolita («ciudadano del mundo»).',el:'civil, civismo, civilización.'},
 {k:'maestro',es:['maestro','maestros','maestra','maestras'],g:['διδάσκαλος','διδάσκαλοι','διδάσκαλος','διδάσκαλοι'],gt:['didáskalos','didáskaloi','didáskalos','didáskaloi'],l:['magister','magistri','magistra','magistrae'],eg:'didáctica, autodidacta.',el:'magisterio, magistral. Viene de magis, «más»: el que sabe más.'},
 {k:'rey',es:['rey','reyes','reina','reinas'],g:['βασιλεύς','βασιλεῖς','βασίλεια','βασίλειαι'],gt:['basileús','basileîs','basíleia','basíleiai'],l:['rex','reges','regina','reginae'],eg:'basílica, Basilio. Para un ateniense del 386, «el Rey», sin más, era el rey de Persia.',el:'real, regio, régimen. Desde que expulsaron al último rey, los romanos odiaban la palabra.'},
 {k:'dios',es:['dios','dioses','diosa','diosas'],g:['θεός','θεοί','θεός','θεαί'],gt:['theós','theoí','theós','theaí'],l:['deus','dei','dea','deae'],eg:'teología, ateo, entusiasmo («tener un dios dentro»). A Atenea la llamaban simplemente ἡ θεός, «la diosa».',el:'divino, deidad, adiós.'},
 {k:'padre',es:['padre','padres'],g:['πατήρ','πατέρες'],gt:['patḗr','patéres'],l:['pater','patres'],eg:'patriarca, patriota.',el:'paterno, patria, patrimonio. El pater familias mandaba sobre toda la casa.'},
 {k:'madre',es:['madre','madres'],g:['μήτηρ','μητέρες'],gt:['mḗtēr','mētéres'],l:['mater','matres'],eg:'metrópoli: la «ciudad madre» que fundaba una colonia.',el:'materno, matrimonio, materia.'},
 {k:'hijo',es:['hijo','hijos','hija','hijas'],g:['υἱός','υἱοί','θυγάτηρ','θυγατέρες'],gt:['hyiós','hyioí','thygátēr','thygatéres'],l:['filius','filii','filia','filiae'],eg:'θυγάτηρ es pariente del inglés daughter y del alemán Tochter.',el:'filial; hijo viene de filius.'},
 {k:'hermano',es:['hermano','hermanos','hermana','hermanas'],g:['ἀδελφός','ἀδελφοί','ἀδελφή','ἀδελφαί'],gt:['adelphós','adelphoí','adelphḗ','adelphaí'],l:['frater','fratres','soror','sorores'],eg:'Filadelfia, «amor entre hermanos». Literalmente, «del mismo vientre».',el:'fraterno, fraile, sororidad.'},
 {k:'mujer',es:['mujer','mujeres'],g:['γυνή','γυναῖκες'],gt:['gynḗ','gynaîkes'],l:['femina','feminae'],eg:'ginecología, gineceo (la parte de la casa reservada a las mujeres).',el:'femenino. Nuestra «mujer» viene de otra palabra latina, mulier.'},
 {k:'niño',es:['niño','niños','niña','niñas'],g:['παῖς','παῖδες','παῖς','παῖδες'],gt:['paîs','paîdes','paîs','paîdes'],l:['puer','pueri','puella','puellae'],eg:'pedagogo, pediatra, enciclopedia.',el:'pueril, puericultura.'},
 {k:'amigo',es:['amigo','amigos','amiga','amigas'],g:['φίλος','φίλοι','φίλη','φίλαι'],gt:['phílos','phíloi','phílē','phílai'],l:['amicus','amici','amica','amicae'],eg:'filosofía («amor a la sabiduría»), filántropo.',el:'amigo, amistad, amable.'},
 {k:'esclavo',es:['esclavo','esclavos','esclava','esclavas'],g:['δοῦλος','δοῦλοι','δούλη','δοῦλαι'],gt:['doûlos','doûloi','doúlē','doûlai'],l:['servus','servi','serva','servae'],eg:'En Atenas había decenas de miles: en las casas, los talleres, las minas y al servicio de la ciudad.',el:'servil, servir, siervo.'},
 {k:'camino',es:['camino','caminos'],g:['ὁδός','ὁδοί'],gt:['hodós','hodoí'],l:['via','viae'],eg:'método («el camino para llegar»), éxodo, periodo.',el:'vía, viaje, trivial (el lugar donde se cruzan tres caminos).'},
 {k:'río',es:['río','ríos'],g:['ποταμός','ποταμοί'],gt:['potamós','potamoí'],l:['flumen','flumina'],eg:'hipopótamo («caballo de río»), Mesopotamia («entre ríos»).',el:'fluvial, fluir.'},
 {k:'mar',es:['mar','mares'],g:['θάλαττα','θάλατται'],gt:['thálatta','thálattai'],l:['mare','maria'],eg:'talasoterapia. Los atenienses decían θάλαττα; en otros dialectos, θάλασσα.',el:'marino, marítimo. Los romanos llamaban al Mediterráneo mare nostrum, «nuestro mar».'},
 {k:'isla',es:['isla','islas'],g:['νῆσος','νῆσοι'],gt:['nêsos','nêsoi'],l:['insula','insulae'],eg:'Peloponeso («isla de Pélope»), Polinesia («muchas islas»).',el:'insular, aislar. En Roma, una insula era también un bloque de pisos.'},
 {k:'agua',es:['agua','aguas'],g:['ὕδωρ','ὕδατα'],gt:['hýdōr','hýdata'],l:['aqua','aquae'],eg:'hidratar, hidrógeno.',el:'acuático, acueducto.'},
 {k:'vino',es:['vino','vinos'],g:['οἶνος','οἶνοι'],gt:['oînos','oînoi'],l:['vinum','vina'],eg:'enología. Los griegos lo bebían mezclado con agua.',el:'viña, vinagre («vino agrio»).',pre:1},
 {k:'pan',es:['pan','panes'],g:['ἄρτος','ἄρτοι'],gt:['ártos','ártoi'],l:['panis','panes'],eg:'Las panaderas del Ágora tenían fama de lenguaraces: Aristófanes se burla de ellas en Las ranas.',el:'panadería y compañero: «el que comparte el pan».'},
 {k:'aceite',es:['aceite','aceites'],g:['ἔλαιον','ἔλαια'],gt:['élaion','élaia'],l:['oleum','olea'],eg:'De ἔλαιον viene el latín oleum, y de ahí óleo y oleoducto.',el:'óleo, oleoducto. Nuestro «aceite» viene del árabe az-zayt.'},
 {k:'luz',es:['luz','luces'],g:['φῶς','φῶτα'],gt:['phôs','phôta'],l:['lux','luces'],eg:'fotografía («escribir con luz»), fósforo.',el:'lúcido, lucir, Lucía.'},
 {k:'noche',es:['noche','noches'],g:['νύξ','νύκτες'],gt:['nýx','nýktes'],l:['nox','noctes'],eg:'Nix era la diosa de la Noche, hija del Caos.',el:'nocturno, noctámbulo.'},
 {k:'fuego',es:['fuego','fuegos'],g:['πῦρ','πυρά'],gt:['pŷr','pyrá'],l:['ignis','ignes'],eg:'pirómano, pirotecnia, pira.',el:'ignición, ígneo. Nuestro «fuego» viene de focus, el hogar de la casa.'},
 {k:'tierra',es:['tierra','tierras'],g:['γῆ','γῆ'],gt:['gê','gê'],l:['terra','terrae'],eg:'geografía, geología, geometría («medir la tierra»).',el:'terrestre, terreno, territorio.'},
 {k:'guerra',es:['guerra','guerras'],g:['πόλεμος','πόλεμοι'],gt:['pólemos','pólemoi'],l:['bellum','bella'],eg:'polémica, polemizar.',el:'bélico, beligerante.'},
 {k:'paz',es:['paz','paces'],g:['εἰρήνη','εἰρῆναι'],gt:['eirḗnē','eirênai'],l:['pax','paces'],eg:'Irene. Esta primavera del 386 se jura la Paz del Rey, que acaba con la guerra de Corinto.',el:'pacífico, pacto. Vespasiano levantó el Templo de la Paz después de la guerra de Judea.'},
 {k:'verdad',es:['verdad','verdades'],g:['ἀλήθεια','ἀλήθειαι'],gt:['alḗtheia','alḗtheiai'],l:['veritas','veritates'],eg:'Literalmente, «lo que no está oculto» o «lo que no se olvida».',el:'verídico, verificar.'},
 {k:'muerte',es:['muerte','muertes'],g:['θάνατος','θάνατοι'],gt:['thánatos','thánatoi'],l:['mors','mortes'],eg:'eutanasia («buena muerte»). Tánatos, la Muerte, era hermano de Hipnos, el Sueño.',el:'mortal, mortífero.'}];
const VOC_K=Object.fromEntries(VOCAB.map(v=>[v.k,v]));
// maestros: tres por época, cada uno con tres lecciones de cuatro palabras
const VOC_T={
 atenas:[
  {id:'grammatistes',at:()=>findFree(AG.x-22,AG.z+32,1),look:{chiton:'#b9a78a',himation:'#6a5a48',beard:true,hair:'#4a3a2a',staff:true},name:'Dionisio',sub:'grammatistés, maestro de letras',glyph:'Γ',
   intro:'Bajo un pórtico, una docena de niños repite letras a coro con la tablilla de cera sobre las rodillas. El maestro te ve mirar: «¿Tú también quieres aprender? Aquí se paga a fin de mes, pero a ti te enseño unas palabras gratis».',
   note:'El grammatistés enseñaba a leer, escribir y contar. La escuela era privada y la pagaban los padres; las niñas, si aprendían, lo hacían en casa. Desde el 403 a.C. Atenas escribe oficialmente con el alfabeto jónico, el que verás aquí.',
   L:[['La ciudad',['ciudad','casa','templo','puerta']],['La escuela',['escuela','libro','ley','pueblo']],['Gente importante',['ciudadano','maestro','rey','dios']]]},
  {id:'paidagogos',at:()=>artAnchor('liceo',10,-8),look:{chiton:'#8a7a60',hair:'#3a2a1a',beard:true},name:'Sosias',sub:'pedagogo tracio',glyph:'Π',
   intro:'Un esclavo tracio espera junto al gimnasio con el manto de su amo pequeño colgado del brazo. «Lo llevo a la escuela, a la palestra y a casa, y le enseño modales. Si quieres, también te enseño a ti».',
   note:'El paidagogós («el que conduce al niño») era un esclavo de la casa que acompañaba al niño a todas partes y vigilaba su conducta. No era maestro, aunque muchas veces le ayudaba a repasar.',
   L:[['La familia',['padre','madre','hijo','hermano']],['La gente de casa',['mujer','niño','amigo','esclavo']],['De camino',['camino','río','mar','isla']]]},
  {id:'artopolis',at:()=>findFree(AG.x+42,AG.z-18,1),look:{female:true,chiton:'#c8b08a',himation:'#7a4a3a',hair:'#3a2a1a'},name:'Mírrine',sub:'panadera del Ágora',glyph:'Α',
   intro:'Una panadera vende hogazas y tortas de cebada en el mercado. «¿Vas a comprar o vas a mirar? Bueno, mientras te decides, te enseño cómo se dicen las cosas: los forasteros habláis fatal».',
   note:'Las vendedoras de pan (ἀρτοπώλιδες) eran figuras habituales del Ágora; Aristófanes las pinta como mujeres con mucho carácter. El marido de Mírrine murió en la guerra de Corinto, que esta primavera del 386 termina con la Paz del Rey.',
   L:[['La mesa',['agua','vino','pan','aceite']],['El día y la noche',['luz','noche','fuego','tierra']],['Palabras graves',['guerra','paz','verdad','muerte']]]}],
 roma:[
  {id:'magister',at:()=>artAnchor('ro_basilica_emilia',8,10),look:{chiton:'#d8d0c0',himation:'#7a6a58',hair:'#4a3a2a',staff:true},name:'Lucio Verecundo',sub:'ludi magister',glyph:'L',
   intro:'Bajo un toldo, junto a los pórticos del Foro, un maestro hace recitar a sus alumnos con la férula en la mano. «Empezamos antes del alba, así que los vecinos nos odian. ¿Quieres aprender algo de latín de verdad? Siéntate».',
   note:'El ludi magister enseñaba a leer, escribir y contar, a menudo en una pérgola abierta del Foro. Era un oficio mal pagado y famoso por los golpes de férula; Marcial se quejará de un maestro que lo despierta cada mañana con sus gritos.',
   L:[['La ciudad',['ciudad','casa','templo','puerta']],['La escuela',['escuela','libro','ley','pueblo']],['Gente importante',['ciudadano','maestro','rey','dios']]]},
  {id:'paedagogus',at:()=>artAnchor('ro_castor',-8,8),look:{chiton:'#9a8a70',hair:'#3a2a1a',beard:true},name:'Eutico',sub:'paedagogus griego',glyph:'P',
   intro:'Un esclavo griego espera a su joven amo a la sombra del templo de Cástor. «En casa le hablo en griego y en la calle en latín: así aprende los dos. Te enseño unas palabras, si quieres».',
   note:'Las familias romanas ricas confiaban a sus hijos a un paedagogus, casi siempre un esclavo griego. Gracias a él, muchos niños romanos aprendían griego antes que a leer en latín.',
   L:[['La familia',['padre','madre','hijo','hermano']],['La gente de casa',['mujer','niño','amigo','esclavo']],['De camino',['camino','río','mar','isla']]]},
  {id:'pistrix',at:()=>artAnchor('ro_subura',6,-8),look:{female:true,chiton:'#c8b08a',himation:'#8a5a3a',hair:'#2a1a10'},name:'Cecilia',sub:'panadera de la Subura',glyph:'C',
   intro:'Del horno de una panadería sale un olor que llena la calle. La panadera se limpia la harina de las manos: «Si vas a vivir en Roma, aprende a pedir las cosas como se dice. Ven, que te enseño».',
   note:'En la Roma flavia había cientos de panaderías (pistrina) con su molino y su horno. Cecilia ha vivido un año terrible: la erupción del Vesubio en el 79 y, esta primavera del 80, el gran incendio de Roma.',
   L:[['La mesa',['agua','vino','pan','aceite']],['El día y la noche',['luz','noche','fuego','tierra']],['Palabras graves',['guerra','paz','verdad','muerte']]]}]};
// ---- vocabulario latino básico (lista escolar aportada en «Vocabulario latín»; definiciones traducidas del catalán al español)
// Sustantivos y nombres propios: se sustituyen en los diálogos. Formato: clave|enunciado|significado|formas en español|formas latinas|de dónde viene|pre
// (pre=1: solo se cambia detrás de un determinante, porque la palabra española también es un verbo).
const VOC_LAT_N=`acies|acies, -ei (f.)|línea de batalla|||Acies: el ejército formado para combatir.
edificio|aedes, -is (f.)|edificio; en plural, casa|edificio,edificios|aedes,aedes|edil: el magistrado que cuidaba de los edificios.
campo|ager, agri (m.)|campo|campo,campos|ager,agri|agricultura, agrario.
ánimo|animus, -i (m.)|espíritu, ánimo|ánimo,ánimos|animus,animi|ánimo, unánime («de un solo ánimo»).
año|annus, -i (m.)|año|año,años|annus,anni|anual, aniversario, perenne.
armas|arma, -orum (n. pl.)|armas|arma,armas|arma,arma|arma, armadura. En latín solo existe en plural.
ayuda|auxilium, -i (n.)|ayuda; tropas auxiliares|ayuda,ayudas|auxilium,auxilia|auxilio, auxiliar.|1
guerra
campamento|castrum, -i (n.)|campamento (en plural, castra)|campamento,campamentos|castra,castra|castrense; de ahí vienen Castro y las ciudades inglesas en -chester.
causa|causa, -ae (f.)|causa, razón|causa,causas|causa,causae|causa, acusar.
ciudadano
civitas|civitas, -atis (f.)|ciudad, estado; ciudadanía|ciudadanía|civitas|ciudad (de civitatem), civilización.
cohorte|cohors, -ortis (f.)|cohorte|cohorte,cohortes|cohors,cohortes|cohorte; también corte, el patio y luego la corte del rey.
consejo|consilium, -i (n.)|consejo, plan|consejo,consejos|consilium,consilia|consejo, consiliario.
tropas|copia, -ae (f.)|abundancia; en plural, tropas|tropas|copiae|copioso, copia.
cuerpo|corpus, -oris (n.)|cuerpo|cuerpo,cuerpos|corpus,corpora|corporal, corpulento.
día|dies, -ei (m./f.)|día|día,días|dies,dies|diario, meridiano («del mediodía»).
casa
jinete|eques, -itis (m.)|jinete, caballero|jinete,jinetes,caballero,caballeros|eques,equites,eques,equites|ecuestre. Los equites eran el orden de los caballeros, por debajo de los senadores.
ejército|exercitus, -us (m.)|ejército|ejército,ejércitos|exercitus,exercitus|ejército, ejercicio.
fama|fama, -ae (f.)|fama|fama,famas|fama,famae|fama, famoso, infame.
hijo
río
hermano
trigo|frumentum, -i (n.)|trigo, grano|trigo,trigos|frumentum,frumenta|El Estado repartía trigo gratis a los ciudadanos pobres de Roma.
gens|gens, -entis (f.)|pueblo, linaje, clan|||gente, gentilicio. Cada familia noble era parte de una gens, como la gens Flavia.
hombre|homo, -inis (m.)|ser humano, persona|hombre,hombres|homo,homines|humano, homicida.
enemigo|hostis, -is (m./f.)|enemigo|enemigo,enemigos,enemiga,enemigas|hostis,hostes,hostis,hostes|hostil, hostilidad.
emperador|imperator, -oris (m.)|general victorioso, emperador|emperador,emperadores|imperator,imperatores|emperador. Al principio era el título que los soldados daban a su general tras una victoria.
imperio|imperium, -i (n.)|poder, mando; imperio|imperio,imperios|imperium,imperia|imperio, imperativo.
legado|legatus, -i (m.)|legado, enviado|legado,legados|legatus,legati|delegado, legación.
legión|legio, -onis (f.)|legión|legión,legiones|legio,legiones|legión, legionario.
letras|litterae, -arum (f. pl.)|letras; carta; literatura|letras|litterae|literatura, literal.
lugar|locus, -i (m.)|lugar|lugar,lugares|locus,loca|local, localizar, locomotora.
mar
muerte
nación|natio, -onis (f.)|nación, pueblo|nación,naciones|natio,nationes|nacional, nacer.
nave|navis, -is (f.)|nave, barco|nave,naves,barco,barcos|navis,naves,navis,naves|naval, navegar.
nombre|nomen, -inis (n.)|nombre|nombre,nombres|nomen,nomina|nominal, nominar, pronombre.
noche
mensajero|nuntius, -i (m.)|mensajero; noticia|mensajero,mensajeros,noticia,noticias|nuntius,nuntii,nuntius,nuntii|anunciar, nuncio.
rehenes|obsides, -um (m. pl.)|rehenes|rehenes,rehén|obsides,obses|Los romanos se llevaban rehenes de los pueblos vencidos para asegurarse de que cumplieran los pactos.
ojo|oculus, -i (m.)|ojo|ojo,ojos|oculus,oculi|ocular, oculista.
oppidum|oppidum, -i (n.)|ciudad pequeña, plaza fortificada|||Así llama César a las ciudades amuralladas de los galos.
obra|opus, -eris (n.)|obra|obra,obras|opus,opera|ópera, operario, opúsculo.
paz
dinero|pecunia, -ae (f.)|dinero|dinero,dineros|pecunia,pecuniae|pecuniario. Viene de pecus, el ganado: la riqueza más antigua.
peligro|periculum, -i (n.)|peligro|peligro,peligros|periculum,pericula|peligro, peligroso.
pie|pes, pedis (m.)|pie|pie,pies|pes,pedes|pedal, peatón, pedestre.
puente|pons, pontis (m.)|puente|puente,puentes|pons,pontes|pontífice: «el que hace puentes», como el Pontifex Maximus.
pueblo
puerta
guarnición|praesidium, -i (n.)|guarnición, protección|guarnición,guarniciones|praesidium,praesidia|presidio, presidir.
niño
reino|regnum, -i (n.)|reino|reino,reinos|regnum,regna|reinar, reinado.
cosa|res, rei (f.)|cosa, asunto|cosa,cosas|res,res|república: res publica, «la cosa pública».
rey
orilla|ripa, -ae (f.)|orilla|orilla,orillas|ripa,ripae|ribera, arribar («llegar a la orilla»).
sangre|sanguis, -inis (m.)|sangre|sangre,sangres|sanguis,sanguines|sanguíneo, sanguinario.
senado|senatus, -us (m.)|senado|senado,senados|senatus,senatus|senado y senador vienen de senex, anciano: era el consejo de los mayores.
esclavo
señal|signum, -i (n.)|señal; estandarte militar|señal,señales,estandarte,estandartes|signum,signa,signum,signa|signo, señal, insignia.
bosque|silva, -ae (f.)|bosque, selva|bosque,bosques,selva,selvas|silva,silvae,silva,silvae|silvestre, selva.
tiempo|tempus, -oris (n.)|tiempo|tiempo,tiempos|tempus,tempora|temporal, temporada.
templo
tierra
ciudad
esposa|uxor, -oris (f.)|esposa|esposa,esposas|uxor,uxores|uxoricidio.
camino
marido|vir, viri (m.)|hombre, varón; marido|marido,maridos|vir,viri|viril, virtud.
virtud|virtus, -utis (f.)|valor, virtud|virtud,virtudes|virtus,virtutes|virtud. Para un romano, virtus era sobre todo el valor del vir, del hombre.
vida|vita, -ae (f.)|vida|vida,vidas|vita,vitae|vital, vitamina.
herida|vulnus, -eris (n.)|herida|herida,heridas|vulnus,vulnera|vulnerable, invulnerable.`;
const VOC_LAT_P=`Afranio|Afranius, -i|Afranio, general de Pompeyo|Afranio|Afranius
Augusto|Augustus, -i|Augusto, el primer emperador|Augusto|Augustus
César|Caesar, -aris|César|César,Césares|Caesar,Caesares
Diana|Diana, -ae|Diana, diosa de la caza|Diana|Diana
Aníbal|Hannibal, -alis|Aníbal, el general cartaginés|Aníbal|Hannibal
Héctor|Hector, -oris|Héctor, el héroe troyano|Héctor|Hector
Júpiter|Iuppiter, Iovis|Júpiter, padre de los dioses|Júpiter|Iuppiter
Minos|Minos, -ois|Minos, rey de Creta|Minos|Minos
Numa|Numa, -ae|Numa, segundo rey de Roma|Numa|Numa
Pompeyo|Pompeius, -i|Pompeyo, rival de César|Pompeyo|Pompeius
Rómulo|Romulus, -i|Rómulo, fundador de Roma|Rómulo|Romulus
Espartaco|Spartacus, -i|Espartaco, el gladiador rebelde|Espartaco|Spartacus
Tarquinio|Tarquinius, -i|Tarquinio, el último rey de Roma|Tarquinio|Tarquinius
Troya|Troia, -ae|Troya|Troya|Troia
Venus|Venus, -eris|Venus, diosa del amor|Venus|Venus`;
// Solo se aprenden (no se sustituyen): enunciado|significado|de dónde viene
const VOC_LAT_O=[
 ['Adjetivos',`aeger, -gra, -grum|enfermo|
alius, -a, -ud|otro|alias, alienígena.
bonus, -a, -um|bueno|bonito, bonanza.
celer, -eris, -ere|rápido|acelerar, celeridad.
certus, -a, -um|seguro, cierto|certeza, certificado.
difficilis, -e|difícil|
durus, -a, -um|duro|durar, duradero.
facilis, -e|fácil|facilidad, facilitar.
fortis, -e|fuerte, valiente|fortaleza, fortificar.
gravis, -e|grave, pesado|gravedad.
honestus, -a, -um|honorable|honesto, honestidad.
ingens, -entis|enorme|
longus, -a, -um|largo|longitud.
magnus, -a, -um|grande|magnífico, magnitud.
multus, -a, -um|mucho|multitud, multiplicar.
novus, -a, -um|nuevo|novedad, renovar.
omnis, -e|todo, cada|ómnibus, omnipotente.
parvus, -a, -um|pequeño|párvulo.
primus, -a, -um|primero|primo, primario.
pulcher, -chra, -chrum|bello, hermoso|pulcro.
sacer, -cra, -crum|sagrado|sacerdote, sacrificio.
similis, -e|semejante|similar.
solus, -a, -um|solo|soledad, solitario.
tantus, -a, -um|tan grande|tanto.
totus, -a, -um|todo, entero|total.`],
 ['Pronombres',`ego|yo|egoísta.
hic, haec, hoc|este|
idem, eadem, idem|el mismo|idéntico.
ille, illa, illud|aquel|de ille vienen nuestros artículos el y la.
ipse, ipsa, ipsum|él mismo|
is, ea, id|él, ella, ello|
nos|nosotros|
nullus, -a, -um|ninguno|nulo.
noster, -tra, -trum|nuestro|
quis, quid|quién, qué|
suus, -a, -um|suyo|
tu|tú|
tuus, -a, -um|tuyo|
vos|vosotros|`],
 ['Verbos',`abeo, abii, abitum (irreg.)|irse|
accipio, accepi, acceptum (3.ª)|recibir|aceptar.
addo, addidi, additum (3.ª)|añadir|adición.
ago, egi, actum (3.ª)|hacer, actuar, llevar|actor, acto.
audio, audivi, auditum (4.ª)|oír|auditorio, audiencia.
cado, cecidi, casum (3.ª)|caer|caso, ocaso.
capio, cepi, captum (3.ª)|coger, capturar|capturar, cautivo.
cedo, cessi, cessum (3.ª)|retirarse, ceder|ceder, proceso.
cognosco, cognovi, cognitum (3.ª)|conocer|conocer, cognitivo.
cogo, coegi, coactum (3.ª)|obligar|coacción.
colloco, collocavi, collocatum (1.ª)|colocar|colocar.
confero, contuli, collatum (irreg.)|reunir|conferencia.
credo, credidi, creditum (3.ª)|creer|credo, crédito, incrédulo.
dico, dixi, dictum (3.ª)|decir|dictado, diccionario.
do, dedi, datum (1.ª)|dar|dato, donar.
duco, duxi, ductum (3.ª)|conducir, guiar|conducir, acueducto.
facio, feci, factum (3.ª)|hacer|fábrica, hecho.
fero, tuli, latum (irreg.)|llevar|fértil, transferir.
fugio, fugi, fugitum (3.ª)|huir|fuga, fugitivo.
habeo, habui, habitum (2.ª)|tener|haber, hábito.
interficio, interfeci, interfectum (3.ª)|matar|
invenio, inveni, inventum (4.ª)|encontrar|inventar: «encontrar algo nuevo».
mitto, misi, missum (3.ª)|enviar|misión, misil, remitir.
moneo, monui, monitum (2.ª)|avisar, aconsejar|monitor, amonestar.
moveo, movi, motum (2.ª)|mover|motor, móvil.
nolo, nolui (irreg.)|no querer|
occupo, occupavi, occupatum (1.ª)|ocupar|ocupar.
occido, occidi, occisum (3.ª)|abatir, dar muerte|
paro, paravi, paratum (1.ª)|preparar|preparar, aparato.
peto, petivi, petitum (3.ª)|buscar, pedir, atacar|petición, competir.
pono, posui, positum (3.ª)|poner|poner, posición.
possum, potui (irreg.)|poder|posible, potencia.
proficiscor, profectus sum (dep.)|partir, ponerse en marcha|
relinquo, reliqui, relictum (3.ª)|dejar, abandonar|reliquia.
sum, fui, futurum (irreg.)|ser, estar|futuro.
teneo, tenui, tentum (2.ª)|sujetar, mantener|tener, tenaz.
transeo, transii, transitum (irreg.)|atravesar|tránsito, transeúnte.
traduco, traduxi, traductum (3.ª)|hacer pasar, trasladar|traducir.
venio, veni, ventum (4.ª)|venir|venir, aventura.
video, vidi, visum (2.ª)|ver|vídeo («yo veo»), visión.
vinco, vici, victum (3.ª)|vencer|victoria, invicto.
vivo, vixi, victum (3.ª)|vivir|vivo, vivienda.
volo, volui (irreg.)|querer|voluntad.`],
 ['Adverbios',`deinde|después, luego|
eo|allí, hacia allí|
iam|ya|
ibi|allí|
ita|así|
nunc|ahora|
saepe|a menudo|
semper|siempre|sempiterno.
simul|a la vez|simultáneo.
statim|inmediatamente|
subito|de repente|súbito.
tam|tan|
tamen|sin embargo|
tum|entonces|`],
 ['Conjunciones',`ac / atque|y, y además|
antequam|antes de que|
aut|o|
autem|pero, en cambio|
cum (conjunción)|cuando, como (tiene varios valores)|
enim|en efecto, pues|
et|y|
igitur|así pues|
itaque|por tanto|
nam|pues (explica lo anterior)|
neque|y no, ni|
nec|ni|
nisi|si no|
postquam|después de que|
quia|porque|
quod|porque; que (también es relativo)|
quoniam|ya que|
sed|pero, sino|
si|si (condicional)|
ut|que, para que, como (tiene varios valores)|`],
 ['Preposiciones',`ab / a / abs (+ abl.)|de, desde; por (complemento agente)|
ad (+ acc.)|a, hacia, para, cerca de|
ante (+ acc.)|antes de, delante de|anterior, anteayer.
cum (+ abl.)|con|
de (+ abl.)|de, desde, sobre, acerca de|
ex / e (+ abl.)|de, desde, fuera de|exterior.
in (+ abl.)|en, sobre; (+ acc.) a, hacia, contra|
inter (+ acc.)|entre; durante|internacional.
per (+ acc.)|por, a través de|
post (+ acc.)|después de, detrás de|posterior, posguerra.
propter (+ acc.)|a causa de|`]];
// enunciados de las palabras latinas que ya estaban en la lista general
const VOC_LAT_EN={guerra:'bellum, -i (n.)',ciudadano:'civis, -is (m./f.)',casa:'domus, -us (f.)',hijo:'filius, -i (m.)',río:'flumen, -inis (n.)',hermano:'frater, -tris (m.)',mar:'mare, -is (n.)',muerte:'mors, mortis (f.)',noche:'nox, noctis (f.)',paz:'pax, pacis (f.)',pueblo:'populus, -i (m.)',puerta:'porta, -ae (f.)',niño:'puer, -i (m.)',rey:'rex, regis (m.)',esclavo:'servus, -i (m.)',templo:'templum, -i (n.)',tierra:'terra, -ae (f.)',ciudad:'urbs, urbis (f.)',camino:'via, -ae (f.)'};
const VOC_LAT_SEC=[];   // secciones de los dos maestros nuevos: [nombre, [claves]]
(function vocLatParse(){const add=v=>{VOCAB.push(v);return v.k;};
  const nouns=[],names=[];
  for(const ln of VOC_LAT_N.split('\n')){const f=ln.split('|');if(f.length===1){nouns.push(f[0]);continue;}
    const[k,en,m,es,la,der,pre]=f,head=en.split(',')[0];
    if(!es){nouns.push(add({k:'la_'+k,ro:1,nos:1,en,m,es:[m],l:[head],el:der}));continue;}
    nouns.push(add({k:'la_'+k,ro:1,en,m,es:es.split(','),l:la.split(','),el:der,pre:pre==='1'?1:0}));}
  for(const ln of VOC_LAT_P.split('\n')){const[k,en,m,es,la]=ln.split('|');names.push(add({k:'lp_'+k,ro:1,en,m,es:es.split(','),l:la.split(','),el:''}));}
  VOC_LAT_SEC.push(['Sustantivos',nouns],['Nombres propios',names]);
  for(const[sec,txt]of VOC_LAT_O){const ks=[];for(const ln of txt.split('\n')){const[en,m,der]=ln.split('|');ks.push(add({k:'lo_'+en,ro:1,nos:1,en,m,es:[m],l:[en],el:der||''}));}VOC_LAT_SEC.push([sec,ks]);}
  for(const k in VOC_LAT_EN){const v=VOCAB.find(x=>x.k===k);if(v)v.en=VOC_LAT_EN[k];}for(const v of VOCAB)VOC_K[v.k]=v;})();
// trocea una sección en lecciones de seis palabras (la última se queda con el resto)
function vocChunk(ks,n){const L=[];for(let i=0;i<ks.length;i+=n)L.push(ks.slice(i,i+n));if(L.length>1&&L[L.length-1].length<3)L[L.length-2].push(...L.pop());return L;}
function vocSecLessons(name,ks){const head=k=>{const v=VOCAB.find(x=>x.k===k);return v?(v.en||v.l[0]).split(/[ ,]/)[0]:k;};return vocChunk(ks,6).map((L,i)=>[name+' '+(i+1)+': '+head(L[0])+' – '+head(L[L.length-1]),L]);}

VOC_T.roma.push(
 {id:'grammaticus',at:()=>artAnchor('ro_grammaticus',6,6)||artAnchor('ro_basilica_julia',-10,8),look:{chiton:'#e0d8c8',himation:'#5a4a6a',hair:'#8a8070',staff:true},name:'Valerio Probo',sub:'grammaticus de Berito',glyph:'G',
  intro:'Un hombre mayor lee un rollo a la sombra, rodeado de unos pocos jóvenes. «No tengo escuela: tengo amigos que vienen a preguntar», dice sin levantar la vista. «Si quieres leer a César y a Virgilio, empieza por las palabras que más usan».',
  note:'Marco Valerio Probo, de Berito (la actual Beirut), fue el gramático más sabio de la época flavia: corregía y comentaba los textos de Virgilio, Horacio y Lucrecio. Según Suetonio, no daba clases como un maestro corriente: recibía por la tarde a unos pocos discípulos y conversaba con ellos. Sus palabras son las de una lista escolar de latín: lo más frecuente en los autores que se leen en clase.',
  S:VOC_LAT_SEC.slice(0,4).map(([n,ks])=>[n,vocSecLessons(n,ks)])},
 {id:'rhetor',at:()=>artAnchor('ro_paz',-12,10)||artAnchor('ro_basilica_julia',12,-8),look:{chiton:'#e8e0d0',himation:'#e8e0d0',hair:'#3a2a1a'},name:'Quintiliano',sub:'rhetor, maestro de oratoria',glyph:'Q',
  intro:'Un hispano de unos cuarenta y cinco años corrige a un alumno que declama con demasiados aspavientos. «Un orador sin palabras exactas es como un soldado sin armas», te dice. «Los verbos son la acción del discurso; las partículas, sus articulaciones. Empecemos».',
  note:'Marco Fabio Quintiliano, nacido en Calagurris (Calahorra), fue uno de los primeros maestros de retórica que cobró un sueldo del Estado, por decisión de Vespasiano. Hacia el 95 escribirá la Institutio oratoria, un tratado sobre cómo educar a un orador desde la infancia. Sus palabras son las de una lista escolar de latín.',
  S:VOC_LAT_SEC.slice(4).map(([n,ks])=>[n,vocSecLessons(n,ks)])});
for(const m in VOC_T)for(const T of VOC_T[m])if(!T.S)T.S=[['',T.L]];
const VOC={mode:'orig',re:null,map:null,ver:-1,vlen:-1};
try{const m=localStorage.getItem('nostos-voc');if(m==='orig'||m==='tr'||m==='off')VOC.mode=m;}catch(e){}
function vocz(){if(!state.voc||typeof state.voc!=='object')state.voc={w:{},l:{}};if(!state.voc.w)state.voc.w={};if(!state.voc.l)state.voc.l={};return state.voc;}
function vocKnown(k){return !!vocz().w[k];}
function VOCM(){return VOCAB.filter(v=>!v.ro||MODE==='roma');}
function vocCount(){return VOCM().filter(v=>vocKnown(v.k)).length;}
function vocEff(){return MODE==='roma'&&VOC.mode==='tr'?'orig':VOC.mode;}
function vocForm(v,i){const ro=MODE==='roma';return ro?v.l[i]:(vocEff()==='tr'?v.gt[i]:v.g[i]);}
function vocMean(v){return v.m||(v.es[2]?v.es[0]+' / '+v.es[2]:v.es[0]);}
function vocLbl(v,gi){return v.m||(gi===2&&v.es[2]?v.es[2]:v.es[0]);}
function vocShow(v,i,full){const ro=MODE==='roma';if(ro&&full&&v.en){const c=v.en.indexOf(',');return c>0&&!v.nos?'<b class="vw">'+v.en.slice(0,c)+'</b>'+v.en.slice(c):'<b class="vw">'+v.en+'</b>';}return '<b class="vw">'+(ro?v.l[i||0]:v.g[i||0])+'</b>'+(ro?'':' <i class="vtr">'+v.gt[i||0]+'</i>');}
// expresión regular con todas las formas en español de las palabras aprendidas
function vocBuild(){const known=Object.keys(vocz().w).filter(k=>VOC_K[k]&&!VOC_K[k].nos&&(!VOC_K[k].ro||MODE==='roma')),sig=known.join(',')+'|'+MODE+'|'+vocEff();if(VOC.sig===sig)return;VOC.sig=sig;
  VOC.map=new Map();for(const k of known){const v=VOC_K[k];v.es.forEach((f,i)=>{if(!VOC.map.has(f))VOC.map.set(f,[v,i]);});}
  const fs=[...VOC.map.keys()].sort((a,b)=>b.length-a.length);VOC.re=fs.length?new RegExp('(?<![\\p{L}])('+fs.join('|')+')(?![\\p{L}])','giu'):null;}
const VOC_PRE_VINO=/(?:^|[^\p{L}])(el|la|los|las|un|una|unos|unas|de|del|al|su|sus|mi|mis|tu|tus|buen|buena|mucho|mucha|poco|poca|este|esta|ese|esa|y|con|sin|o|más|menos|por|para|nuestra|nuestro|gran|copa|jarra|ánfora|pedir|pide|piden|pidió)\s+$/iu;
const VOC_SE=/(?:^|[^\p{L}])(se|te|me|le|lo|la|nos|os|les)\s+$/iu;
function vocWalk(root){if(!root||vocEff()==='off'||!state)return;vocBuild();if(!VOC.re)return;
  const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(tw.nextNode())nodes.push(tw.currentNode);
  for(const tn of nodes){const pe=tn.parentElement;if(!pe||pe.closest('.voc,.novoc,input,textarea,button,.label,script,style,svg'))continue;const txt=tn.nodeValue;VOC.re.lastIndex=0;let m,last=0,frag=null;
    while((m=VOC.re.exec(txt))){const low=m[0].toLowerCase(),hit=VOC.map.get(low);if(!hit)continue;const[v,i]=hit,before=txt.slice(Math.max(0,m.index-14),m.index);
      if(v.pre&&!VOC_PRE_VINO.test(before))continue;if(v.k==='casa'&&VOC_SE.test(before))continue;
      let out=vocForm(v,i);if(m[0][0]!==m[0][0].toLowerCase())out=out[0].toUpperCase()+out.slice(1);
      frag=frag||document.createDocumentFragment();frag.appendChild(document.createTextNode(txt.slice(last,m.index)));
      const s=document.createElement('span');s.className='voc';s.textContent=out;s.dataset.t=(MODE==='roma'?'':v.gt[i]+' · ')+m[0].toLowerCase();s.title=s.dataset.t;frag.appendChild(s);last=m.index+m[0].length;}
    if(frag){frag.appendChild(document.createTextNode(txt.slice(last)));tn.parentNode.replaceChild(frag,tn);}}}
// la sustitución se hace justo antes de que el diálogo empiece a escribirse solo
const twStart0=twStart;
twStart=function(){try{vocWalk($('dBody'));}catch(e){}twStart0();};
function vocCSS(){if($('vocCSS'))return;const s=document.createElement('style');s.id='vocCSS';s.textContent=
 '.voc{color:#f0c890;border-bottom:1px dotted rgba(240,200,144,.7);cursor:help;position:relative;white-space:nowrap}'+
 '.voc::after{content:attr(data-t);position:absolute;left:50%;bottom:calc(100% + 4px);transform:translateX(-50%);background:#1c140e;color:#f1e8d8;border:1px solid #d9874a;border-radius:6px;padding:2px 8px;font-size:.82em;font-style:normal;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s;z-index:5}'+
 '.voc:hover::after,.voc.on::after{opacity:1}'+
 '.vlist{margin:8px 0}.vlist div{padding:6px 0;border-bottom:1px solid rgba(217,135,74,.18)}.vw{font-size:1.15em;color:#f0c890}.vtr{opacity:.8}.vlist .sub{display:block;margin-top:2px}'+
 '.vq{text-align:center;margin:10px 0}.vq .vw{font-size:2em;display:block}';document.head.appendChild(s);}
vocCSS();
$('dBody').addEventListener('click',e=>{const v=e.target.closest&&e.target.closest('.voc');if(!v)return;document.querySelectorAll('.voc.on').forEach(x=>{if(x!==v)x.classList.remove('on');});v.classList.toggle('on');});
// ---- ajuste del menú
function vocLabel(){const ro=MODE==='roma';return (ro?'Palabras en latín':'Palabras en griego')+': '+(vocEff()==='off'?'no':ro?'sí':vocEff()==='tr'?'transliteradas':'alfabeto griego');}
function vocToggle(){const ro=MODE==='roma';VOC.mode=ro?(vocEff()==='off'?'orig':'off'):(VOC.mode==='orig'?'tr':VOC.mode==='tr'?'off':'orig');try{localStorage.setItem('nostos-voc',VOC.mode);}catch(e){}VOC.sig=null;
  toast(vocEff()==='off'?'Las palabras aprendidas se verán en español.':ro?'Las palabras que has aprendido aparecerán en latín en los diálogos.':vocEff()==='tr'?'Las palabras que has aprendido aparecerán en griego, escrito con nuestras letras.':'Las palabras que has aprendido aparecerán en griego, con su alfabeto.');}
GM_IC.voc='<path d="M4 4.5h16v11H10l-5 4v-4H4z"/><path d="M9 12.5l2.2-5.5 2.2 5.5M9.8 10.6h2.8"/><path d="M15.5 7.5v5"/>';
// ---- maestros
function vocSetup(){vocz();const L=VOC_T[MODE]||[];L.forEach((T,ti)=>{let f=T.at();if(!f)return;artPerson(f,T.look,'vc:'+ti,T.name,T.sub,3);});}
function vocLessonDone(T,si,li){return T.S[si][1][li][1].every(vocKnown);}
function vocAct(o){const ti=+String(o.act).slice(3),T=VOC_T[MODE][ti];if(!T)return;const one=casaOpen(T.glyph,T.name,T.sub),B=$('dBody'),ro=MODE==='roma',len=ro?'latín':'griego',tot=VOCM().length;
  const how=()=>'<div class="novoc"><p>Cuando aciertes el significado de un sustantivo, lo verás en '+len+' en el resto de diálogos del juego, en lugar de en español.'+(ro?' Los verbos, adjetivos y partículas solo se aprenden: meterlos en frases en español las volvería ilegibles.':' Puedes elegir verlo con el alfabeto griego o escrito con nuestras letras.')+'</p><p>Si no recuerdas qué significa, <b>pasa el ratón por encima o tócalo</b>.</p><p class="sub">Si te agobia, puedes cambiarlo o desactivarlo en el menú (Tab o el botón ☰) → «'+vocLabel()+'».</p></div>';
  const tail=()=>{if(vocCount())one('¿Qué palabras sé ya? ('+vocCount()+'/'+tot+')',()=>top(vocReview()));one('¿Cómo veré las palabras que aprenda?',()=>top(how()));one('Despedirse',closeDialog);};
  const lessons=(si)=>{T.S[si][1].forEach((Ls,li)=>{const n=Ls[1].filter(vocKnown).length,N=Ls[1].length,open=li===0||vocLessonDone(T,si,li-1);
      if(open)one((n===N?'Repasar: ':'Lección: ')+Ls[0]+' ('+n+'/'+N+')',()=>teach(si,li),n===N?'':'quiz');});};
  const secCount=si=>{const ks=T.S[si][1].flatMap(L=>L[1]);return ks.filter(vocKnown).length+'/'+ks.length;};
  const top=html=>{$('dOpts').innerHTML='';B.innerHTML=html;if(T.S.length===1)lessons(0);else T.S.forEach((S,si)=>one(S[0]+' ('+secCount(si)+')',()=>sec(si,'<div class="novoc"><p>«'+S[0]+'». Ve lección por lección: cada una se abre al terminar la anterior.</p></div>')));tail();};
  const sec=(si,html)=>{if(T.S.length===1)return top(html);$('dOpts').innerHTML='';B.innerHTML=html;lessons(si);one('Volver',()=>top('<div class="novoc"><p>«¿Qué más quieres aprender?»</p></div>'));};
  top('<div class="novoc"><p>'+T.intro+'</p><p class="sub">'+T.note+'</p><p class="sub">Sabes '+vocCount()+' de '+tot+' palabras en '+len+'.</p></div>');
  function teach(si,li){const Ls=T.S[si][1][li],W=Ls[1].map(k=>VOC_K[k]);$('dOpts').innerHTML='';
    B.innerHTML='<div class="novoc"><p>«'+Ls[0]+'». Escucha bien:</p><div class="vlist">'+W.map(v=>'<div>'+vocShow(v,0,true)+(!ro&&v.es[2]?' / '+vocShow(v,2):'')+(ro&&!v.en&&v.es[2]?' / '+vocShow(v,2):'')+' — <b>'+vocMean(v)+'</b>'+((ro?v.el:v.eg)?'<span class="sub">'+(ro?v.el:v.eg)+'</span>':'')+'</div>').join('')+'</div></div>';
    one('Ya me las sé: pregúntame',()=>quiz(si,li,0,0),'quiz');one('Volver',()=>sec(si,'<div class="novoc"><p>«Cuando quieras».</p></div>'));}
  function quiz(si,li,qi,ok){const Ls=T.S[si][1][li],W=Ls[1].map(k=>VOC_K[k]);if(qi>=W.length)return end(si,li,ok);const v=W[qi],gi=(qi%2&&v.es[2]&&!v.m)?2:0;$('dOpts').innerHTML='';
    B.innerHTML='<div class="novoc"><p class="sub">Pregunta '+(qi+1)+' de '+W.length+'</p><div class="vq">'+(v.nos?vocShow(v,0,true):vocShow(v,gi))+'</div><p>«¿Qué significa?»</p></div>';
    const others=W.filter(x=>x!==v&&vocLbl(x,gi)!==vocLbl(v,gi)).sort(()=>R()-0.5).slice(0,3),opts=[v,...others].sort(()=>R()-0.5);
    opts.forEach(x=>one(vocLbl(x,gi),()=>{const good=x===v,nw=good&&!vocKnown(v.k);
      if(good){vocz().w[v.k]=1;if(nw)state.obols+=1;save();updateStats();try{sfxTap();}catch(e){}}
      $('dOpts').innerHTML='';B.innerHTML='<div class="novoc"><div class="vq">'+(v.nos?vocShow(v,0,true):vocShow(v,gi))+'</div><p>'+(good?'«¡Eso es!» ':'«No». ')+'Significa <b>'+vocLbl(v,gi)+'</b>.'+(nw&&!v.nos?' <span class="sub">Desde ahora la verás en '+len+' en los diálogos.</span>':'')+'</p></div>';
      one('Seguir',()=>quiz(si,li,qi+1,ok+(good?1:0)),'quiz');}));}
  function end(si,li,ok){const L=T.S[si][1],Ls=L[li],done=vocLessonDone(T,si,li),k='l'+T.id+'_'+si+'_'+li,first=done&&!vocz().l[k];$('dOpts').innerHTML='';
    if(first){vocz().l[k]=1;qAdd('so',1);qAdd('lo',1,'Aprender otra lengua te da palabras para pensar.');save();}
    B.innerHTML='<div class="novoc"><p>Has acertado '+ok+' de '+Ls[1].length+'.</p><p>'+(done?(first?'«Muy bien. Ya conoces todas las palabras de esta lección».':'«Veo que no se te olvidan».')+(li<L.length-1&&first?' <span class="sub">Se abre la lección siguiente.</span>':'')+(first&&li===L.length-1?' <span class="sub">Has terminado esta parte.</span>':''):'«Las que has fallado no cuentan todavía. Repásalas y vuelve a intentarlo».')+'</p></div>';
    if(done&&li<L.length-1)one('Siguiente lección',()=>teach(si,li+1),'quiz');one('Volver',()=>sec(si,'<div class="novoc"><p>«¿Algo más?»</p></div>'));one('Despedirse',closeDialog);}}
function vocReview(){const ks=VOCM().filter(v=>vocKnown(v.k));return '<div class="novoc"><p>Palabras que ya conoces ('+ks.length+'/'+VOCM().length+'):</p><div class="vlist">'+ks.map(v=>'<div>'+vocShow(v,0,true)+' — '+vocMean(v)+'</div>').join('')+'</div></div>';}

