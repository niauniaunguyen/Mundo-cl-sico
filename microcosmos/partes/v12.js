/* =====================================================================
   VERSIÓN 12: datos de las mejoras de jugabilidad y gráficas
   ===================================================================== */

// Mutaciones: al evolucionar eliges una de tres. Cada una tiene una ventaja y un coste.
// k = multiplicadores (atk, hp, taken, fago, lis, atps, rw, side, dodge)
const MUTS = [
  {id:'quit', n:T_('Pared de quitina'), d:T_('Fabricas una pared rígida como la de los hongos. Aguantas mucho más, pero no puedes engullir bien.'), e:T_('Vida ×1,5 · fagocitosis ×0,3'), k:{hp:1.5, fago:.3}},
  {id:'flag', n:T_('Flagelo'), d:T_('Un flagelo como el de las bacterias te permite apartarte de los golpes.'), e:T_('Esquivas el 15 % de los ataques · vida ×0,85'), k:{dodge:.15, hp:.85}},
  {id:'mito', n:T_('Mitocondrias extra'), d:T_('Duplicas tus mitocondrias: más energía, aunque gastas parte en mantenerlas.'), e:T_('ATP por segundo ×2 · ataque ×0,9'), k:{atps:2, atk:.9}},
  {id:'liso', n:T_('Lisosomas gigantes'), d:T_('Tus lisosomas crecen y digieren más deprisa, pero ocupan sitio en el citoplasma.'), e:T_('Fagocitosis ×1,6 y lisozima ×1,3 · vida ×0,9'), k:{fago:1.6, lis:1.3, hp:.9}},
  {id:'caps', n:T_('Cápsula'), d:T_('Te rodeas de una cápsula de polisacáridos, como muchas bacterias: amortigua los golpes, pero te hace más lenta.'), e:T_('Daño recibido ×0,8 · ataque ×0,9'), k:{taken:.8, atk:.9}},
  {id:'plas', n:T_('Plásmido de destoxificación'), d:T_('Un plásmido con genes que neutralizan sustancias tóxicas. Copiarlo cuesta energía.'), e:T_('Sin efectos secundarios · ATP por victoria ×0,9'), k:{side:0, rw:.9}},
  {id:'poli', n:T_('Núcleo poliploide'), d:T_('Tienes varias copias de cada cromosoma: fabricas más proteínas de ataque, pero tu membrana se resiente.'), e:T_('Ataque ×1,25 · vida ×0,8'), k:{atk:1.25, hp:.8}},
  {id:'ribo', n:T_('Ribosomas extra'), d:T_('Más ribosomas: aprovechas mejor lo que digieres, aunque te queda menos energía para defenderte.'), e:T_('ATP por victoria ×1,4 · vida ×0,9'), k:{rw:1.4, hp:.9}},
];
const MUT = Object.fromEntries(MUTS.map(m => [m.id, m]));

// Recursos de cada zona del cuerpo
const ZONE_RES = {
  san:{n:T_('Hierro'), d:T_('La sangre transporta hierro en la hemoglobina: la artemisinina, que se activa con él, hace ×1,3.'), k:{art:1.3}},
  pul:{n:T_('Oxígeno'), d:T_('Los alvéolos están llenos de oxígeno: tus mitocondrias producen un 30 % más de ATP por segundo y nunca hay hipoxia.'), k:{atps:1.3, nohyp:true}},
  int:{n:T_('Glucosa'), d:T_('En el intestino se absorbe la glucosa de la comida: ganas un 20 % más de ATP por victoria.'), k:{rw:1.2}},
  pie:{n:T_('Barrera de queratina'), d:T_('Las capas de queratina de la piel frenan a los invasores: recibes un 10 % menos de daño y encuentras más muestras.'), k:{taken:.9, samp:1.5}},
  cer:{n:T_('Barrera hematoencefálica'), d:T_('Los capilares del cerebro apenas dejan pasar sustancias: los antibióticos hacen ×0,7, pero recibes un 10 % menos de daño.'), k:{ab:.7, taken:.9}},
  cha:{n:T_('Luz'), d:T_('El agua de charca recibe mucha luz: las células vegetales se reparan el doble, pero apagar la luz es más eficaz.'), k:{veg:2}},
};

// Expedición diaria: 5 combates con una regla que cambia cada día
const DAY_RULES = [
  {id:'ab', n:T_('Solo fármacos'), d:T_('Solo puedes usar fármacos: penicilina, anfotericina B, taxol, isoniazida, artemisinina…'), tools:['pen','anf','tax','iso','art','arv','pzq','lis']},
  {id:'fis', n:T_('Sin agentes físicos'), d:T_('Nada de radiación, ósmosis ni calor: solo enzimas, anticuerpos, células y fármacos.'), tools:['fago','lis','pen','ac','anf','cel','tc','tax']},
  {id:'inm', n:T_('Solo el sistema inmune'), d:T_('Ni fármacos ni laboratorio: solo tus defensas naturales.'), tools:['fago','lis','ac','tc']},
  {id:'lab', n:T_('Solo el laboratorio'), d:T_('Sin defensas naturales: radiación, ósmosis, calor y enzimas de laboratorio.'), tools:['uv','osm','aut','cel','luz','pen']},
  {id:'all', n:T_('Todo vale'), d:T_('Todas las herramientas, pero los organismos son de los más difíciles.'), tools:['fago','lis','pen','uv','ac','anf','osm','luz','cel','tc','tax','aut'], hard:true},
];

// Ciclos de vida (Atlas): pasos de cada ciclo
const CYCLES = {
  gp:[T_('La bacteria crece y duplica su ADN'), T_('Se forma un tabique en el centro'), T_('Se separan dos células hijas iguales'), T_('Cada hija vuelve a crecer (unos 30 min)')],
  vir:[T_('Se une a tu célula con la hemaglutinina'), T_('Entra y libera su ARN'), T_('Tu célula fabrica copias del virus'), T_('Los nuevos virus salen y tu célula muere')],
  lev:[T_('A la célula madre le brota una yema'), T_('El núcleo se divide y una copia pasa a la yema'), T_('La yema crece'), T_('Se separa y deja una cicatriz en la madre')],
  bac:[T_('Bacilo activo que crece y se divide'), T_('Las condiciones empeoran: forma una endospora'), T_('La endospora resiste años en reposo'), T_('Vuelven las buenas condiciones: germina')],
  mal:[T_('Un mosquito Anopheles te pica e inyecta esporozoítos'), T_('Se multiplican en el hígado'), T_('Invaden los glóbulos rojos y los revientan'), T_('Otro mosquito se los lleva al picarte')],
  vih:[T_('Se une a la proteína CD4 de un linfocito T'), T_('La transcriptasa inversa copia su ARN a ADN'), T_('Ese ADN se integra en el de la célula'), T_('La célula fabrica virus nuevos')],
  can:[T_('Una célula acumula mutaciones en genes del ciclo celular'), T_('Se divide sin control y evita la apoptosis'), T_('Forma vasos nuevos que la alimentan (angiogénesis)'), T_('Puede invadir otros tejidos (metástasis)')],
  ten:[T_('Comes carne de cerdo poco hecha con larvas'), T_('El escólex se agarra al intestino'), T_('Forma proglótides llenas de huevos'), T_('Los huevos salen con las heces')],
};

// Modos de microscopio (filtro de la escena)
const SCOPES = [
  {id:'', n:T_('Campo oscuro'), f:''},
  {id:'gram', n:T_('Tinción de Gram'), f:'sepia(.55) hue-rotate(230deg) saturate(2.2) brightness(1.05)'},
  {id:'fluo', n:T_('Fluorescencia'), f:'contrast(1.5) saturate(2.4) brightness(1.15)'},
  {id:'fase', n:T_('Contraste de fases'), f:'grayscale(1) contrast(1.6) brightness(1.2)'},
  {id:'mebs', n:T_('Microscopio electrónico'), f:'grayscale(1) contrast(1.9) brightness(.95) sepia(.12)'},
];
