// ============================================================ HOMERO Y QUÍOS: LO QUE TE DICEN POR SER QUIOTA (28/11)
// ¿Era Homero de Quíos? No se sabe, pero era la patria que más se defendía. El himno homérico a Apolo, que Tucídides (III 104, hacia el
// 400 a.C.) atribuye a Homero, se despide con «un hombre ciego que vive en la rocosa Quíos» (Himno III 172). En Quíos vivían los
// Homéridas, rapsodas que decían descender del poeta (Píndaro, Nemea II 1; Platón, Fedro 252b; Isócrates, Helena 65). También lo
// reclamaban Esmirna, Colofón y otras: Cicerón cita a Colofón, Quíos, Salamina y Esmirna (En defensa de Arquias 19). La lista de «siete
// ciudades» es de epigramas posteriores: por eso aquí nadie la usa en el 386 a.C. (y se corrigió en el librero, 038, y en la estela de
// Quíos, 052).
// Como el protagonista es de Quíos: algunos personajes con nombre comentan algo de Homero la primera vez que te presentas, la gente
// de la calle hace bromas, y tu paisano te cuenta lo que se sabe.
const HOM_NPC={atenas:{
  maestro:'Cálias sonríe: «¿De Quíos? Mis alumnos aprenden a leer con los versos de tu paisano: hay padres que hacen que sus hijos se sepan la Ilíada y la Odisea enteras de memoria». (Jenofonte, Banquete III 5; Platón, Protágoras 325e)',
  isocrates:'Isócrates se interesa: «¿Quiota? Los Homéridas de tu isla cuentan que Helena se le apareció a Homero de noche y le mandó cantar a los que fueron a Troya. Bonita historia, aunque no sé si creérmela». (Isócrates, Helena 65)',
  platon:'Platón te mira con media sonrisa: «De la isla de los Homéridas… Sócrates se divertía preguntando a los rapsodas: recitaban a Homero de maravilla, pero no sabían explicar por qué era bueno lo que decían». (Platón, Ion)',
  lisias:'Lisias asiente: «Quíos, la del vino y la de Homero. Aquí todo el mundo cita a Homero, en la Asamblea y en los tribunales; yo prefiero que mis clientes hablen como gente corriente».'},
 roma:{
  quintiliano:'Quintiliano se anima: «¿De Quíos, la patria de Homero? Con él empiezo a mis alumnos: en Homero está todo lo que un orador necesita aprender, como del océano nacen los ríos». (Quintiliano, Institución oratoria X 1, 46)',
  grammaticus:'El maestro levanta la vista del rollo: «¿Quiota? Aquí los niños empiezan por el griego, y en griego se empieza por Homero; luego viene Virgilio». (Quintiliano I 1, 12 y I 8, 5)',
  plinio:'Plinio toma nota de algo: «Quíos… Su vino es de los más caros. Y tus paisanos presumían de murallas de mármol de colores; Cicerón se burló: más le habría admirado que fueran de piedra de Tíbur. Y Homero, dicen; aunque eso lo dicen cuatro ciudades». (Plinio, Historia natural XIV 73 y XXXVI 46)',
  marcial:'Marcial se ríe: «¡Un paisano de Homero! Si Homero hubiera cobrado por verso como yo, se habría muerto de hambre igual».'}};
const HOM_BARK={atenas:['¿De Quíos? Entonces sabrás recitar a Homero de corrido, ¿no?','El ciego que vive en la rocosa Quíos… ¿Eres pariente?','Mi abuelo decía que Homero era de Esmirna. Pero tú no le hagas caso.','Un quiota… ¿Conoces a los Homéridas? Dicen que recitan como nadie.'],
 roma:['¿Griego de Quíos? Mi hijo se pasa el día con Homero y no entiende ni la mitad.','¡De la patria de Homero! Bueno, una de ellas.','Quíos… Allí dicen que nació Homero, ¿no? En Esmirna dicen lo mismo.']};
const HOM_TP={atenas:['¿Es verdad que Homero era de Quíos?','«Eso decimos nosotros, y con razones. El himno a Apolo, que todos atribuyen a Homero, acaba hablando de un hombre ciego que vive en la rocosa Quíos: Tucídides lo cita en su historia. Y en la isla viven los Homéridas, que dicen descender de él y recitan sus versos. Pero los de Esmirna y los de Colofón también lo quieren para ellos. Tú, por si acaso, di siempre que sí.»'],
 roma:['¿Es verdad que Homero era de Quíos?','«Eso decimos en la isla, y con razones: el himno a Apolo, que se atribuye a Homero, habla de un ciego que vive en la rocosa Quíos, y allí estaban los Homéridas, que decían descender de él. Pero Cicerón, en un discurso famoso, ya dijo que se lo disputaban los de Colofón, los de Quíos, los de Salamina y los de Esmirna. Aquí, en Roma, lo que importa es que lo leen todos los niños.»']};
try{for(const m of['atenas','roma']){const o=(ORIG[m]||[]).find(x=>x.id==='quios');if(!o)continue;o.bark=(o.bark||[]).concat(HOM_BARK[m]);if(!o.tp.some(t=>t[0]===HOM_TP[m][0]))o.tp.push(HOM_TP[m]);}}catch(e){console.warn('homero',e);}
{const f=pjGreet;pjGreet=function(n,first){let r=f.apply(this,arguments);try{const og=origen();if(first&&og&&og.id==='quios'&&n&&n.id){const t=HOM_NPC[MODE==='roma'?'roma':'atenas'][n.id];if(t){if(og.react)r=r.replace(og.react+' ','');r+='<p class="sub">'+t+'</p>';}}}catch(e){}return r;};}
