/* =====================================================================
   COLECCIONABLES: biobanco de muestras y hallazgos científicos.
   Se conservan al evolucionar. No cuentan en el modo clase ni en los eventos.
   ===================================================================== */

// Biobanco: muestras de cada organismo. Estrellas a 1, 3, 6, 10 y 15 muestras.
const STARS = [1, 3, 6, 10, 15];
// cada estrella: +6 % de daño y +5 % de ATP contra ese organismo
const STAR_DMG = .06, STAR_ATP = .05;
// colecciones por grupos: todos los organismos del grupo con ★1, ★3 o ★5
const GROUPS = [
  {id:'bac', n:T_('Bacterias'), types:['gp','gn','myc','bac','tbc'], k:'atk', col:0xa67bff},
  {id:'vir', n:T_('Virus y priones'), types:['vir','vih','pri'], k:'hp', col:0xffb547},
  {id:'euk', n:T_('Hongos y protozoos'), types:['lev','ame','par','mal'], k:'atp', col:0xb8f06a},
  {id:'mul', n:T_('Células y gusanos'), types:['veg','can','ten'], k:'atk', col:0xff3b5c},
];
const GROUP_K = [0, .05, .10, .20]; // según el nivel del grupo (★1, ★3, ★5 en todos)

// Hallazgos científicos: potenciadores permanentes con nivel I, II y III
const RELICS = [
  {id:'jenn', y:1796, n:T_('Vacuna de Jenner'), ic:'ac', col:0xffd36b, e:T_('+{p} % de daño con los anticuerpos'), p:15,
    f:T_('Edward Jenner inoculó a un niño pus de viruela bovina y comprobó que quedaba protegido frente a la viruela. «Vacuna» viene de «vaca». La viruela se declaró erradicada en 1980.')},
  {id:'leeu', y:1676, n:T_('Microscopio de Leeuwenhoek'), ic:'scope', col:0x58c8ff, e:T_('+{p} % de ATP por victoria'), p:10,
    f:T_('Antoni van Leeuwenhoek, un comerciante de telas holandés, talló lentes de hasta 270 aumentos. Fue el primero en ver bacterias y protozoos, a los que llamó «animálculos».')},
  {id:'teo', y:1839, n:T_('Teoría celular'), ic:'cell', col:0x4dffa0, e:T_('+{p} % de vida'), p:6,
    f:T_('Schleiden (en las plantas) y Schwann (en los animales) propusieron que todos los seres vivos están hechos de células. En 1855, Virchow añadió: toda célula procede de otra célula.')},
  {id:'meta', y:1882, n:T_('Fagocitos de Metchnikoff'), ic:'fago', col:0x7fe0ff, e:T_('+{p} % de daño con la fagocitosis'), p:15,
    f:T_('Iliá Méchnikov clavó espinas de rosal en larvas transparentes de estrella de mar y vio cómo unas células se amontonaban para engullir los intrusos. Así descubrió la fagocitosis. Nobel de 1908.')},
  {id:'gram', y:1884, n:T_('Tinción de Gram'), ic:'slide', col:0xa67bff, e:T_('+{p} % de daño con la lisozima y la penicilina'), p:15,
    f:T_('Hans Christian Gram buscaba teñir bacterias en tejido pulmonar. Su método, con cristal violeta y yodo, sigue siendo la primera prueba de cualquier laboratorio de microbiología.')},
  {id:'koch', y:1890, n:T_('Postulados de Koch'), ic:'tube', col:0xe0605c, e:T_('+{p} % de probabilidad de conseguir muestras'), p:25,
    f:T_('Robert Koch demostró que un microbio concreto causa una enfermedad concreta: el bacilo de la tuberculosis, en 1882. Sus postulados aún guían cómo se identifica un patógeno.')},
  {id:'flem', y:1928, n:T_('Placa de Fleming'), ic:'pen', col:0x4dffa0, e:T_('+{p} % de daño con la penicilina y menos cepas resistentes'), p:15,
    f:T_('Alexander Fleming volvió de vacaciones y vio que un moho, Penicillium, había matado a los estafilococos de una placa. En su discurso del Nobel ya avisó de que el mal uso de la penicilina crearía resistencias.')},
  {id:'krebs', y:1937, n:T_('Ciclo de Krebs'), ic:'mito', col:0xff7a4a, e:T_('+{p} % de ATP de las mitocondrias'), p:25,
    f:T_('Hans Krebs describió la ruta circular con la que las mitocondrias oxidan los restos de la glucosa y obtienen la energía para fabricar ATP. Nobel de 1953.')},
  {id:'dna', y:1952, n:T_('Fotografía 51'), ic:'dna', col:0xa67bff, e:T_('+{p} % de ataque'), p:6,
    f:T_('Rosalind Franklin obtuvo con rayos X la imagen que reveló la forma de hélice del ADN. Watson y Crick la usaron para proponer la doble hélice en 1953.')},
  {id:'mhc', y:1974, n:T_('Restricción por MHC'), ic:'tc', col:0xff6fd8, e:T_('+{p} % de daño con el linfocito T'), p:15,
    f:T_('Peter Doherty y Rolf Zinkernagel descubrieron que un linfocito T solo reconoce un antígeno cuando se lo presenta una molécula MHC. Nobel de 1996.')},
  {id:'pcr', y:1983, n:T_('PCR'), ic:'flask', col:0xffc65c, e:T_('+{p} % de ATP mientras no juegas'), p:25,
    f:T_('Kary Mullis ideó la reacción en cadena de la polimerasa: copia un trozo de ADN millones de veces en unas horas. Es la base de muchas pruebas diagnósticas, como las de la COVID-19.')},
  {id:'crispr', y:2012, n:T_('CRISPR-Cas9'), ic:'gear', col:0x9be7ff, e:T_('+{p} % de ataque y de vida'), p:4,
    f:T_('Emmanuelle Charpentier y Jennifer Doudna convirtieron un sistema de defensa de las bacterias contra los virus en unas «tijeras» para editar genes. Nobel de Química de 2020.')},
].sort((a, b) => a.y - b.y);
const RELIC = Object.fromEntries(RELICS.map(r => [r.id, r]));
// herramientas que potencia cada hallazgo
const REL_TOOL = {meta:['fago'], gram:['lis','pen'], jenn:['ac'], flem:['pen'], mhc:['tc']};
const ROMAN = ['', 'I', 'II', 'III'];
