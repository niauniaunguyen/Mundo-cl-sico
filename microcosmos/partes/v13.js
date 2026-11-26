/* =====================================================================
   VERSIÓN 13: datos de las nuevas mejoras
   ===================================================================== */

// Tres células nuevas del sistema inmune (se desbloquean con más evoluciones)
// tb = multiplicador de daño con herramientas concretas
Object.assign(CELLS, {
  den:{n:'Célula dendrítica', size:'≈ 15 µm', need:4, hp:.9, atk:1, bonus:{vir:1.2, vih:1.2}, nuc:'round', gran:0xffc65c, dend:true, tb:{tc:1.5, ifn:1.3},
    d:'Con sus largas prolongaciones captura antígenos y los presenta a los linfocitos T en los ganglios. Tu linfocito T citotóxico hace ×1,5 y los interferones ×1,3.'},
  mas:{n:'Mastocito', size:'≈ 12 µm', need:5, hp:1.05, atk:1, bonus:{ten:1.6, par:1.3, ame:1.3}, nuc:'round', gran:0xb36bff, tb:{}, inflam:true,
    d:'Lleno de gránulos de histamina. Provoca inflamación y alergias, y es clave contra los parásitos grandes. Empieza cada combate con inflamación y hace ×1,6 contra la tenia.'},
  lyb:{n:'Linfocito B', size:'≈ 8 µm', need:6, hp:.85, atk:1.05, bonus:{}, nuc:'round', gran:0x7fe0ff, tb:{ac:1.6},
    d:'Fabrica anticuerpos y, al activarse, se convierte en célula plasmática. Tus anticuerpos hacen ×1,6 y la opsonización dura un turno más.'},
});

// Especiación: cada 6 evoluciones tu linaje se convierte en una especie nueva con un rasgo permanente
const SPECIES = [
  {id:'gen', n:T_('Genoma compacto'), d:T_('Menos ADN de relleno: copias tu genoma más deprisa y fabricas más proteínas de ataque.'), e:T_('+10 % de ataque para siempre'), k:{atk:1.1}},
  {id:'mem', n:T_('Membrana de doble capa'), d:T_('Tu membrana gana una segunda capa de lípidos más resistente.'), e:T_('+10 % de vida para siempre'), k:{hp:1.1}},
  {id:'met', n:T_('Metabolismo eficiente'), d:T_('Tus enzimas aprovechan mejor cada molécula de glucosa.'), e:T_('+15 % de ATP para siempre'), k:{rw:1.15, atps:1.15}},
  {id:'rec', n:T_('Receptores versátiles'), d:T_('Tus receptores reconocen más patrones: aprendes antes las debilidades.'), e:T_('+20 % de daño contra organismos de tu biobanco con ★3 o más'), k:{star3:1.2}},
];
const SPEC = Object.fromEntries(SPECIES.map(x => [x.id, x]));

// Estados del cuerpo: cambian cada 5 minutos de juego
const BODY = [
  {id:'rest', n:T_('Descanso'), ic:'cell', col:0x7fe0ff, d:T_('Has dormido bien: el sueño refuerza la producción de linfocitos. +10 % de vida.'), k:{hp:1.1}},
  {id:'stress', n:T_('Estrés'), ic:'signal', col:0xff6f6f, d:T_('Hay estrés: el cortisol frena el sistema inmune. −15 % de ataque.'), k:{atk:.85}},
  {id:'sport', n:T_('Ejercicio'), ic:'adv', col:0x4dffa0, d:T_('El ejercicio moderado mejora la circulación de los leucocitos. +10 % de ataque y +15 % de ATP por victoria.'), k:{atk:1.1, rw:1.15}},
  {id:'food', n:T_('Buena alimentación'), ic:'atp', col:0xffc65c, d:T_('Una dieta variada aporta vitaminas y energía. +20 % de ATP por segundo.'), k:{atps:1.2}},
  {id:'fever', n:T_('Fiebre leve'), ic:'mito', col:0xff9f40, d:T_('Una fiebre leve acelera las enzimas: +15 % de daño, pero te cansa (−10 % de vida).'), k:{atk:1.15, hp:.9}},
];

// Tamaño real aproximado (µm) para la comparación de escala
const SIZE_UM = {gp:1, gn:2, vir:.1, lev:5, ame:500, veg:60, par:200, myc:.3, can:20, bac:4, pri:.02, tbc:3, mal:2, vih:.12, ten:3e6};
const CELL_UM = {mac:21, neu:12, nk:10, eos:14, den:15, mas:12, lyb:8};

// Bacterias que compiten con la microbiota y pueden pasarse plásmidos
const BIOTA_FOES = ['gp','gn','lev','myc','bac'];
const PLASMID_FOES = ['gp','gn','bac','myc'];
const BIOTA_ZONES = ['int','pie'];

// Habilidades de citocinas (se cargan un punto por turno, hasta 10)
const CYTO = [
  {id:'fev', n:T_('Fiebre'), c:4, col:0xff9f40, d:T_('Subes la temperatura: +30 % de daño durante 3 turnos.')},
  {id:'neu', n:T_('Neutrófilos'), c:5, col:0xe8e0ff, d:T_('Llamas a cientos de neutrófilos: un ataque fuerte contra tu objetivo.')},
  {id:'inf', n:T_('Inflamación'), c:3, col:0xff6fae, d:T_('Llegan sangre y refuerzos: recuperas un 20 % de vida.')},
];
