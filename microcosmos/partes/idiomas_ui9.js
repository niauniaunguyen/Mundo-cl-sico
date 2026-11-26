// Textos de la versión 13: «español»: [català, English]
const I18N_RAW9 = {
  // especiación
  "Especiación":["Especiació","Speciation"], "Tu linaje se convierte en una especie nueva":["El teu llinatge es converteix en una espècie nova","Your lineage becomes a new species"],
  "Tras muchas generaciones acumulando cambios, tu linaje ya no puede cruzarse con sus antepasados: es una especie nueva. Elige el rasgo que la define. Este rasgo es permanente.":["Després de moltes generacions acumulant canvis, el teu llinatge ja no es pot creuar amb els avantpassats: és una espècie nova. Tria el tret que la defineix. Aquest tret és permanent.","After many generations of accumulated change, your lineage can no longer interbreed with its ancestors: it's a new species. Choose its defining trait. This trait is permanent."],
  "Nueva especie: {n}":["Nova espècie: {n}","New species: {n}"],
  "Genoma compacto":["Genoma compacte","Compact genome"], "Menos ADN de relleno: copias tu genoma más deprisa y fabricas más proteínas de ataque.":["Menys ADN de farciment: copies el genoma més de pressa i fabriques més proteïnes d'atac.","Less filler DNA: you copy your genome faster and make more attack proteins."], "+10 % de ataque para siempre":["+10 % d'atac per sempre","+10 % attack forever"],
  "Membrana de doble capa":["Membrana de doble capa","Double-layer membrane"], "Tu membrana gana una segunda capa de lípidos más resistente.":["La membrana guanya una segona capa de lípids més resistent.","Your membrane gains a second, tougher lipid layer."], "+10 % de vida para siempre":["+10 % de vida per sempre","+10 % health forever"],
  "Metabolismo eficiente":["Metabolisme eficient","Efficient metabolism"], "Tus enzimas aprovechan mejor cada molécula de glucosa.":["Els enzims aprofiten millor cada molècula de glucosa.","Your enzymes get more out of every glucose molecule."], "+15 % de ATP para siempre":["+15 % d'ATP per sempre","+15 % ATP forever"],
  "Receptores versátiles":["Receptors versàtils","Versatile receptors"], "Tus receptores reconocen más patrones: aprendes antes las debilidades.":["Els receptors reconeixen més patrons: aprens abans les debilitats.","Your receptors recognise more patterns: you learn weaknesses sooner."], "+20 % de daño contra organismos de tu biobanco con ★3 o más":["+20 % de dany contra organismes del biobanc amb ★3 o més","+20 % damage against biobank organisms at ★3 or more"],
  // estados del cuerpo
  "Tu cuerpo: {n}. {d}":["El teu cos: {n}. {d}","Your body: {n}. {d}"],
  "Descanso":["Descans","Rest"], "Has dormido bien: el sueño refuerza la producción de linfocitos. +10 % de vida.":["Has dormit bé: el son reforça la producció de limfòcits. +10 % de vida.","You slept well: sleep boosts lymphocyte production. +10 % health."],
  "Estrés":["Estrès","Stress"], "Hay estrés: el cortisol frena el sistema inmune. −15 % de ataque.":["Hi ha estrès: el cortisol frena el sistema immunitari. −15 % d'atac.","Stress: cortisol dampens the immune system. −15 % attack."],
  "Ejercicio":["Exercici","Exercise"], "El ejercicio moderado mejora la circulación de los leucocitos. +10 % de ataque y +15 % de ATP por victoria.":["L'exercici moderat millora la circulació dels leucòcits. +10 % d'atac i +15 % d'ATP per victòria.","Moderate exercise improves white-cell circulation. +10 % attack and +15 % ATP per victory."],
  "Buena alimentación":["Bona alimentació","Good nutrition"], "Una dieta variada aporta vitaminas y energía. +20 % de ATP por segundo.":["Una dieta variada aporta vitamines i energia. +20 % d'ATP per segon.","A varied diet provides vitamins and energy. +20 % ATP per second."],
  "Fiebre leve":["Febre lleu","Mild fever"], "Una fiebre leve acelera las enzimas: +15 % de daño, pero te cansa (−10 % de vida).":["Una febre lleu accelera els enzims: +15 % de dany, però et cansa (−10 % de vida).","A mild fever speeds up enzymes: +15 % damage, but tires you (−10 % health)."],
  // microbiota
  "Microbiota":["Microbiota","Microbiota"], "microbiota":["microbiota","microbiota"],
  "Tu microbiota compite con bacterias y levaduras. Los antibióticos la reducen; vencer sin ellos la recupera.":["La teva microbiota competeix amb bacteris i llevats. Els antibiòtics la redueixen; vèncer sense ells la recupera.","Your microbiota competes with bacteria and yeasts. Antibiotics shrink it; winning without them restores it."],
  "Tu microbiota compite con él por el alimento y el espacio: le resta un {p} %.":["La teva microbiota hi competeix per l'aliment i l'espai: li resta un {p} %.","Your microbiota competes with it for food and space: −{p} %."],
  "El antibiótico también mata a tu microbiota: baja al {p} %.":["L'antibiòtic també mata la teva microbiota: baixa al {p} %.","The antibiotic also kills your microbiota: down to {p} %."],
  // plásmidos y antibiograma
  "Plásmido de resistencia":["Plasmidi de resistència","Resistance plasmid"],
  "Transferencia horizontal: le pasa a {n} un plásmido con el gen de resistencia a la penicilina.":["Transferència horitzontal: passa a {n} un plasmidi amb el gen de resistència a la penicil·lina.","Horizontal transfer: it passes {n} a plasmid carrying the penicillin-resistance gene."],
  "Antibiograma":["Antibiograma","Antibiogram"], "Hacer un antibiograma":["Fer un antibiograma","Run an antibiogram"], "Antibiograma: {t} ×1,3":["Antibiograma: {t} ×1,3","Antibiogram: {t} ×1.3"],
  "Necesitas al menos dos herramientas para el antibiograma.":["Necessites almenys dues eines per a l'antibiograma.","You need at least two tools for the antibiogram."],
  "¿Qué disco frena más a {n}?":["Quin disc frena més {n}?","Which disc stops {n} best?"],
  "Has sembrado la bacteria en una placa con agar y has puesto discos con cada herramienta. Tras incubar, alrededor de cada disco aparece un halo donde no crece: cuanto más grande, más eficaz. Elige el mejor y tendrás +30 % de daño con él en este combate.":["Has sembrat el bacteri en una placa amb agar i hi has posat discos amb cada eina. Després d'incubar, al voltant de cada disc apareix un halo on no creix: com més gran, més eficaç. Tria el millor i tindràs +30 % de dany amb ell en aquest combat.","You've spread the bacterium on an agar plate and placed a disc for each tool. After incubation, a ring where nothing grows appears around each disc: the bigger, the more effective. Pick the best and get +30 % damage with it this battle."],
  "Incubar 24 horas":["Incubar 24 hores","Incubate 24 hours"],
  "¡Bien leído! {t} tiene el halo más grande: +30 % de daño con ella en este combate.":["Ben llegit! {t} té l'halo més gran: +30 % de dany amb ella en aquest combat.","Well read! {t} has the biggest ring: +30 % damage with it this battle."],
  "El halo más grande era el de {t}.":["L'halo més gran era el de {t}.","The biggest ring was {t}'s."],
  // citocinas
  "Citocinas":["Citocines","Cytokines"], "Citocinas: se acumula una por turno":["Citocines: se n'acumula una per torn","Cytokines: one builds up each turn"],
  "Fiebre":["Febre","Fever"], "Subes la temperatura: +30 % de daño durante 3 turnos.":["Puges la temperatura: +30 % de dany durant 3 torns.","You raise your temperature: +30 % damage for 3 turns."],
  "Neutrófilos":["Neutròfils","Neutrophils"], "Llamas a cientos de neutrófilos: un ataque fuerte contra tu objetivo.":["Crides centenars de neutròfils: un atac fort contra el teu objectiu.","You call in hundreds of neutrophils: a strong attack on your target."],
  "Inflamación":["Inflamació","Inflammation"], "Llegan sangre y refuerzos: recuperas un 20 % de vida.":["Arriben sang i reforços: recuperes un 20 % de vida.","Blood and reinforcements arrive: you recover 20 % health."], "tormenta":["tempesta","storm"],
  "Tormenta de citocinas: has abusado de las señales de alarma y la inflamación te daña a ti (−15 % de vida).":["Tempesta de citocines: has abusat dels senyals d'alarma i la inflamació et fa mal a tu (−15 % de vida).","Cytokine storm: you've overused the alarm signals and inflammation harms you (−15 % health)."],
  // brotes
  "¡Brote en {z}! Ve allí desde el mapa y vence 5 organismos antes de 10 minutos para contenerlo.":["Brot a {z}! Ves-hi des del mapa i venç 5 organismes abans de 10 minuts per contenir-lo.","Outbreak in {z}! Go there from the map and defeat 5 organisms within 10 minutes to contain it."],
  "El brote se ha extinguido solo, pero no has llegado a tiempo.":["El brot s'ha extingit sol, però no hi has arribat a temps.","The outbreak burned out on its own, but you didn't make it in time."],
  "El brote se ha extendido a {z}. Ahora hay que vencer 7 organismos.":["El brot s'ha estès a {z}. Ara cal vèncer 7 organismes.","The outbreak has spread to {z}. Now you must defeat 7 organisms."],
  "Brote: {k}/{n}":["Brot: {k}/{n}","Outbreak: {k}/{n}"], "¡Brote! {k}/{n} organismos vencidos":["Brot! {k}/{n} organismes vençuts","Outbreak! {k}/{n} organisms defeated"],
  "¡Brote contenido! +1 ADN y 2 muestras. Así trabajan los epidemiólogos: cortar la transmisión a tiempo.":["Brot contingut! +1 ADN i 2 mostres. Així treballen els epidemiòlegs: tallar la transmissió a temps.","Outbreak contained! +1 DNA and 2 samples. That's what epidemiologists do: cut transmission in time."],
  // vacunas
  "Vacuna (3 muestras)":["Vacuna (3 mostres)","Vaccine (3 samples)"], "vacunado: {n} combates":["vacunat: {n} combats","vaccinated: {n} battles"],
  "Vacuna contra {n}: los próximos 10 combates contra él empezarán con el evento «Vacuna».":["Vacuna contra {n}: els propers 10 combats contra ell començaran amb l'esdeveniment «Vacuna».","{n} vaccine: your next 10 battles against it start with the “Vaccine” event."],
  // retos del profesor
  "Retos del profesor":["Reptes del professor","Teacher challenges"], "cualquier organismo":["qualsevol organisme","any organism"], "sin prohibir nada":["sense prohibir res","nothing banned"], "sin":["sense","without"],
  "Reto: vence {n} veces a {t}":["Repte: venç {n} vegades {t}","Challenge: defeat {t} {n} times"], "sin usar {b}":["sense fer servir {b}","without using {b}"], "Quitar reto":["Treure el repte","Remove challenge"],
  "Crear un reto para la clase":["Crear un repte per a la classe","Create a class challenge"],
  "Elige el organismo, cuántas veces hay que vencerlo y una herramienta prohibida. Comparte el código con tus alumnos.":["Tria l'organisme, quantes vegades cal vèncer-lo i una eina prohibida. Comparteix el codi amb els alumnes.","Choose the organism, how many times to beat it and a banned tool. Share the code with your students."],
  "Crear código":["Crear codi","Create code"], "Cargar un reto":["Carregar un repte","Load a challenge"], "Pega aquí el código del reto":["Enganxa aquí el codi del repte","Paste the challenge code here"],
  "Reto cargado":["Repte carregat","Challenge loaded"], "¡Reto del profesor completado! +1 ADN.":["Repte del professor completat! +1 ADN.","Teacher challenge complete! +1 DNA."], "Reto: {k}/{n}":["Repte: {k}/{n}","Challenge: {k}/{n}"],
  // láminas, escala, resumen, accesibilidad
  "Lámina":["Làmina","Plate"], "Descargar lámina":["Descarregar la làmina","Download plate"],
  "Es unas {k} veces más pequeño que tu célula.":["És unes {k} vegades més petit que la teva cèl·lula.","It's about {k} times smaller than your cell."],
  "Es unas {k} veces más grande que tu célula.":["És unes {k} vegades més gran que la teva cèl·lula.","It's about {k} times bigger than your cell."],
  "Tiene más o menos tu tamaño.":["Té més o menys la teva mida.","It's about your size."], "Tú":["Tu","You"], "(Escala logarítmica.)":["(Escala logarítmica.)","(Log scale.)"],
  "Resumen":["Resum","Summary"], "Herramienta estrella: {t}. Turnos: {n}.":["Eina estrella: {t}. Torns: {n}.","Star tool: {t}. Turns: {n}."],
  "Accesibilidad visual":["Accessibilitat visual","Visual accessibility"], "Paleta para daltonismo":["Paleta per a daltonisme","Colour-blind palette"],
  "Sustituye el verde y el rojo de las eficacias y las barras por azul y naranja, que se distinguen con cualquier tipo de daltonismo.":["Substitueix el verd i el vermell de les eficàcies i les barres per blau i taronja, que es distingeixen amb qualsevol tipus de daltonisme.","Replaces green and red in effectiveness badges and bars with blue and orange, which stay distinct with any colour blindness."],
  "Alto contraste":["Alt contrast","High contrast"], "Paneles opacos, bordes más marcados y texto más grande.":["Panells opacs, vores més marcades i text més gran.","Opaque panels, stronger borders and larger text."],
};
for (const k in I18N_RAW9){ I18N.ca[k] = I18N_RAW9[k][0]; I18N.en[k] = I18N_RAW9[k][1]; }
