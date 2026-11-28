// ============================================================ LA JORNADA ROMANA (a partir de J. Carcopino, «La vida cotidiana en Roma»)
// Solo en el modo Roma. Carcopino describe sobre todo la Roma de Trajano (h. 100-120 d.C.); aquí se usa lo que ya vale para el 80,
// y se avisa de lo que es posterior. Barbería y ornatrix, termas de Tito, cena de clientes, micatio, el reloj de Augusto y sucesos de la calle.
function jrz(){if(!state.jr||typeof state.jr!=='object')state.jr={d:{}};if(!state.jr.d)state.jr.d={};return state.jr;}
function jrDone(k){return jrz().d[k]===(state.day||1);}
function jrMark(k){jrz().d[k]=state.day||1;save();}
function jrHora(){return Math.floor(clock.h-6)+1;}            // 1..12 de día
// duración de las horas según la estación (Roma, 42° N): de 8 h 54 min de luz en invierno a 15 h 6 min en verano
function jrDayLen(){let mo=0;try{mo=calNow().mo;}catch(e){}const doy=mo*30.4+15;return 12+3.1*Math.sin(2*Math.PI*(doy-80)/365);}
const JR_OBJS=[];
const JR={t:30+Math.random()*40,last:''};
const JR_RUMOR=['«¿Has oído? Los juegos del anfiteatro de Tito van a durar cien días. Dicen que morirán cinco mil fieras en uno solo».',
 '«Del Capitolio no ha quedado nada: el incendio se llevó el templo de Júpiter, el Panteón de Agripa y medio Campo de Marte. Tito ha dicho que lo paga todo de su bolsillo».',
 '«En Campania aún sacan muertos de la ceniza. Pompeya y Herculano han desaparecido, y con ellas el almirante Plinio, que fue a ayudar con la flota».',
 '«Agrícola sigue avanzando por Britania: este verano ha llegado hasta un estuario que llaman Taus. Más allá ya no hay nada, solo niebla y bárbaros pintados».',
 '«Dicen que el hermano del emperador, Domiciano, se pasa el día cazando moscas con un punzón. Y que no soporta que Tito sea tan querido».',
 '«Tito despidió a la reina Berenice al subir al trono. Los romanos no querían una reina judía en el Palatino; él lloraba, ella también».',
 '«El emperador dice que ha perdido el día si no ha hecho un favor a alguien. Ojalá me lo haga a mí: debo tres meses de alquiler»'];
function jrSetup(){JR_OBJS.length=0;if(MODE!=='roma')return;jrz();
  const add=(f,look,act,name,sub)=>{if(!f)return;artPerson(f,look,act,name,sub,3);};
  add(artAnchor('ro_subura',-12,8),{chiton:'#b8a888',hair:'#3a2a1a'},'jr:tonsor','Ciro','tonsor de la Subura');
  add(artAnchor('ro_termas',12,-14),{chiton:'#c8bca0',hair:'#4a3a2a'},'jr:termas','Fortunato','balneator de las termas de Tito');
  add(artAnchor('ro_palatino',-16,-12)||artAnchor('ro_clivus',8,8),Object.assign({},TOGA,{hair:'#8a8070'}),'jr:cena','Sexto Nevio','patrono rico, invita a cenar');
  add(artAnchor('ro_marcelo',16,12),{chiton:'#9a8a70',hair:'#2a1a10'},'jr:micatio','Gavio','ocioso del Pórtico de Octavia');
  const f=artAnchor('ro_obelisco',5,5);if(f)JR_OBJS.push(egxObj(f[0],f[1],undefined,'jr:reloj','El reloj de Augusto','¿qué hora es en Roma?',3));
  if(!ESSAYS.find(e=>e.id==='jornada'))ESSAYS.push(JR_ESSAY);}
function jrAct(o){const k=String(o.act).slice(3);if(k==='tonsor')return jrTonsor();if(k==='termas')return jrTermas();if(k==='cena')return jrCena();if(k==='micatio')return jrMicatio();if(k==='reloj')return jrReloj();}
// ---- la barbería (tonstrina) y la ornatrix
function jrTonsor(){const fem=typeof pjFem==='function'&&pjFem(),one=casaOpen('✂','Ciro','tonsor de la Subura'),B=$('dBody');
  const menu=html=>{$('dOpts').innerHTML='';B.innerHTML=html;
    if(!fem){one('Afeitarme con el maestro lento (2 sestercios)',()=>jrShave(true),'quiz');one('Afeitarme rápido, en la esquina (1 sestercio)',()=>jrShave(false),'quiz');}
    else one('¿Y las mujeres? ¿Dónde se peinan?',()=>jrOrnatrix(),'quiz');
    one('¿Qué se cuenta por ahí?',()=>menu('<p>'+JR_RUMOR[Math.floor(R()*JR_RUMOR.length)]+'</p><p class="sub">La barbería era uno de los grandes mentideros de Roma: los clientes esperaban en bancos, se miraban en los espejos de las paredes y comentaban las noticias.</p>'));
    one('¿Por qué os afeitáis todos?',()=>menu('<p>«Porque así va el emperador, y así iba Augusto. Barba solo llevan los filósofos, los soldados en campaña y los que están de luto. El primer afeitado de un joven es una fiesta: la <i>depositio barbae</i>. Los pelos se guardan en una cajita y se ofrecen a los dioses; Nerón ofreció los suyos a Júpiter en una caja de oro».</p><p class="sub">La moda de la barba no volverá hasta Adriano, que la dejó crecer hacia el 117.</p>'));
    one('Despedirse',closeDialog);};
  menu('<p>Una tienda abierta a la calle, con bancos para los que esperan y espejos de metal pulido en las paredes. El barbero afila una navaja de hierro en una piedra de Hispania, escupiendo en ella. «¿Afeitado? Aquí, o con aquel de la esquina, si tienes prisa y poca piel que perder».</p><p class="sub">Nadie se afeitaba solo: las navajas eran de hierro, se mellaban enseguida y no había jabón. Solo agua.</p>');}
function jrShave(slow){const B=$('dBody'),cost=slow?2:1;$('dOpts').innerHTML='';const one=casaOpen('✂','Ciro','tonsor de la Subura');
  if(state.obols<cost){B.innerHTML='<p>«Sin dinero no hay navaja», dice el barbero.</p>';one('Volver',jrTonsor);return;}
  state.obols-=cost;save();updateStats();const cut=!slow&&R()<0.45,first=!jrDone('tonsor');jrMark('tonsor');
  if(slow){clock.h=Math.min(23.5,clock.h+1);B.innerHTML='<p>El maestro trabaja con una lentitud desesperante: repasa cada pelo, mira el espejo, vuelve a empezar. Pasa una hora larga. Cuando acaba, tu piel está lisa como el mármol y ni una gota de sangre.</p><p class="sub">Los barberos famosos eran tan lentos que Augusto aprovechaba para leer o escribir mientras lo afeitaban; Marcial bromea con uno que tardaba tanto que, al acabar, ya te había vuelto a crecer la barba.</p>';}
  else if(cut)B.innerHTML='<p>Un empujón de la gente que pasa y la navaja resbala: ¡sangre! El barbero, sin inmutarse, te tapa el corte con un emplasto de <b>telarañas empapadas en aceite y vinagre</b>.</p><p class="sub">Es el remedio que recoge Plinio el Viejo para las heridas del afeitado. Los cortes eran tan frecuentes que los juristas fijaron quién pagaba los daños si un barbero de la calle hería a un cliente.</p>';
  else B.innerHTML='<p>Cuatro pasadas rápidas, un poco de agua fría y listo. Te escuece, pero no sangras: hoy tienes suerte.</p>';
  if(first&&!cut)qAdd('kl',1,'Bien afeitado, te miran mejor.');one('Volver',jrTonsor,'quiz');one('Despedirse',closeDialog);}
function jrOrnatrix(){const B=$('dBody');$('dOpts').innerHTML='';const one=casaOpen('✂','La ornatrix','peinadora, vecina del barbero');
  B.innerHTML='<p>El barbero se ríe: «Aquí solo vienen hombres. Las señoras se peinan en casa, con su <i>ornatrix</i>. Mi vecina lo es: pásate».</p><p>La ornatrix te sienta en un taburete y despliega su arsenal: peines de hueso, horquillas, un hierro de rizar que se calienta en las brasas, tarros de tinte y de afeites.</p><p class="sub">En época flavia está de moda un peinado altísimo: una diadema de rizos sobre la frente, como una torre, con el resto del pelo recogido en un moño de trenzas. Se usaban postizos y pelucas, a veces de pelo rubio germano.</p>';
  one('Peinado a la moda flavia (2 sestercios)',()=>{if(state.obols<2){B.innerHTML='<p>«Primero el dinero, querida».</p>';return;}state.obols-=2;const first=!jrDone('tonsor');jrMark('tonsor');save();updateStats();if(first)qAdd('kl',1,'Con ese peinado no pasas desapercibida.');
    $('dOpts').innerHTML='';B.innerHTML='<p>Dos horas de tirones, rizos y horquillas. Te maquilla: blanco de tiza en la frente, rojo de ocre en las mejillas, ceniza en las cejas. Al mirarte al espejo de bronce, apenas te reconoces: llevas una torre de rizos sobre la frente.</p><p class="sub">El blanco de plomo, también usado para blanquear la piel, era venenoso. Y las ornatrices sufrían a menudo la ira de sus amas por un rizo mal puesto, como cuentan Marcial y Juvenal.</p>';one('Volver',jrTonsor,'quiz');one('Despedirse',closeDialog);},'quiz');
  one('Volver',jrTonsor);}
// ---- las termas de Tito
function jrTermas(){const one=casaOpen('♨','Fortunato','balneator de las termas de Tito'),B=$('dBody'),h=jrHora(),noct=clock.h<6||clock.h>=18;$('dOpts').innerHTML='';
  if(noct){B.innerHTML='<p>«Cerrado. Las termas abren de día y cierran a la puesta de sol. Vuelve mañana después de comer».</p>';one('Despedirse',closeDialog);return;}
  B.innerHTML='<p>Las termas que Tito acaba de inaugurar junto al anfiteatro huelen todavía a cal y a mármol nuevo. El encargado cobra la entrada en una mesita: <b>un cuadrante</b>, la moneda más pequeña de Roma. Los niños entran gratis.</p><p class="sub">Es la hora '+h+'. Lo normal es venir después del trabajo, hacia la hora octava, cuando el agua está en su punto: así lo recomienda Marcial. '+(h<8?'Ahora aún hay poca gente.':'Ahora está lleno.')+'</p>';
  one('Pagar el cuadrante y entrar',()=>jrBath(0),'quiz');one('Despedirse',closeDialog);}
function jrBath(st){const B=$('dBody'),fem=typeof pjFem==='function'&&pjFem();$('dOpts').innerHTML='';const one=casaOpen('♨','Termas de Tito','THERMAE TITI');
  const S=[
   ['El vestuario (apodyterium)','<p>Te desnudas en el vestuario, entre nichos para la ropa. Un esclavo, el <i>capsarius</i>, se ofrece a vigilarla por una propina: los robos de ropa en las termas son famosos.</p>'+(fem?'<p class="sub">En el 80 no hay ninguna ley que separe a hombres y mujeres en las termas: muchas mujeres prefieren baños solo para ellas, pero otras vienen aquí por los juegos de la palestra. Adriano impondrá horarios separados.</p>':''),[['Pagarle (1 sestercio)',1],['Arriesgarme',0]]],
   ['La palestra','<p>Antes del baño, ejercicio al aire libre, rodeado de pórticos. Unos juegan al <i>trigon</i>, pasándose la pelota en triángulo; otros al <i>harpastum</i>, a empujones; hay quien hace rodar un aro con un gancho o levanta pesas de plomo; los luchadores se untan de aceite y cera y se cubren de polvo para agarrarse.</p>',[['Jugar al trigon',0],['Correr con el aro',0],['Luchar',0]]],
   ['El sudatorio y el caldarium','<p>Pasas a las salas calientes, que caldea un horno a través del suelo hueco y las paredes. En el sudatorio, aire seco que te hace sudar a chorros; en el caldarium, una bañera de agua caliente y una fuente para refrescarte la cara.</p><p class="sub">Para limpiarse, nada de jabón: aceite y el <i>strigilis</i>, una rasqueta curva de metal con la que se raspa el sudor y la suciedad.</p>',[['Pagar a un esclavo que me rasque (1 sestercio)',1],['Rascarme yo solo',0]]],
   ['El tepidarium y el frigidarium','<p>Una sala templada para no pasar de golpe del calor al frío, y después la piscina fría, al aire libre. El agua llega del acueducto. Sales nuevo.</p><p class="sub">Después del baño, mucha gente se queda: pasea por los jardines, charla, lee en la biblioteca o come algo de los vendedores. Las termas son el gran lugar de reunión del pueblo romano.</p>',[['Salir',0]]]];
  const s=S[st];B.innerHTML='<p class="sub">'+s[0]+'</p>'+s[1];
  s[2].forEach(([t,c])=>one(t,()=>{if(c&&state.obols>=c){state.obols-=c;save();updateStats();}
    if(st===0&&!c&&R()<0.3){toast('<span class="label">¡Te han robado!</span><br>Al volver, falta tu túnica buena. Sales con una vieja que alguien dejó.');}
    if(st+1<S.length)jrBath(st+1);else{const first=!jrDone('termas');jrMark('termas');if(first){qAdd('ar',1,'El ejercicio y el baño te dejan como nuevo.');}clock.h=Math.min(18,clock.h+1);closeDialog();}},'quiz'));}
// ---- la cena de clientes
function jrCena(){const one=casaOpen('🍷','Sexto Nevio','patrono rico'),B=$('dBody'),h=clock.h;$('dOpts').innerHTML='';
  if(jrDone('cena')){B.innerHTML='<p>«Hoy ya has cenado en mi casa, amigo. ¿Quieres que la gente diga que vives de mi mesa?»</p>';one('Despedirse',closeDialog);return;}
  if(h<14||h>=21){B.innerHTML='<p>«Ven a cenar, si quieres: en mi casa se cena a la hora nona, después del baño, como todo el mundo».</p><p class="sub">La cena (cena) era la comida principal y se tomaba a media tarde. Por la mañana bastaba un vaso de agua o un trozo de pan; a mediodía, un bocado rápido (prandium).</p>';one('Despedirse',closeDialog);return;}
  B.innerHTML='<p>Un esclavo, el <i>nomenclator</i>, anuncia tu nombre y te lleva al comedor, el <i>triclinium</i>: tres lechos alrededor de una mesa cuadrada, tres invitados en cada uno. Te toca el lecho más bajo, el de los clientes. Te quitan las sandalias, te lavan las manos y te recuestas sobre el codo izquierdo.</p>';
  one('Empezar a comer',()=>jrCena2(),'quiz');one('Mejor no, gracias',closeDialog);}
function jrCena2(){const B=$('dBody');$('dOpts').innerHTML='';const one=casaOpen('🍷','Sexto Nevio','patrono rico');
  B.innerHTML='<p>Primero, los entrantes (<i>gustatio</i>): huevos, aceitunas, lechuga y vino con miel, el <i>mulsum</i>. Después llegan los platos fuertes, y te das cuenta de algo: al anfitrión le sirven ostras y un rodaballo enorme; a ti, unos mejillones y un pescadito. Él bebe un Falerno añejo; a ti te llenan la copa con un vino de este año.</p><p class="sub">Marcial y Plinio el Joven se quejan de estos anfitriones que invitan a mucha gente y luego sirven distinta comida según el rango del invitado.</p>';
  const end=(txt,q)=>{jrMark('cena');if(q)qAdd(q[0],q[1],q[2]);$('dOpts').innerHTML='';B.innerHTML=txt+'<p>Llegan los postres (<i>secundae mensae</i>): fruta, pasteles con miel. Antes, una ofrenda a los Lares de la casa. Al despedirte, te llevas las sobras envueltas en tu servilleta, como hacen todos.</p>';one('Volver a casa',closeDialog,'quiz');};
  one('Callar y comer lo que me sirvan',()=>end('<p>Comes en silencio. Nadie se fija en ti; tampoco te vuelven a invitar con muchas ganas.</p>',null),'quiz');
  one('Hacer una broma ingeniosa al respecto',()=>{if(qLv('lo')>=4)end('<p>«¿Por qué no cenamos juntos, Sexto, si cenamos a la vez?», dices en voz alta. La mesa entera se ríe; el anfitrión, colorado, manda que te sirvan de su rodaballo.</p>',['lo',2,'Una broma a tiempo vale más que un discurso.']);else end('<p>Intentas una broma, pero se te traba la lengua y nadie se ríe. El anfitrión te mira con frialdad.</p>',null);},'quiz');
  one('Quejarme abiertamente',()=>end('<p>Te quejas. Se hace un silencio helado. Un esclavo te retira la copa: esa noche no vuelves a beber.</p><p class="sub">Un cliente dependía de su patrono: quejarse en su mesa era perderlo.</p>',null),'quiz');}
// ---- la micatio
function jrMicatio(){const one=casaOpen('✋','Gavio','ocioso del Pórtico de Octavia'),B=$('dBody');$('dOpts').innerHTML='';
  const n=jrz().mic===state.day?(jrz().micn||0):0;
  B.innerHTML='<p>Bajo las columnas del Pórtico de Octavia, un hombre sin nada que hacer te reta: «¿Una partida de <i>micatio</i>? Dos sestercios. Sacamos los dos a la vez los dedos que queramos y cantamos cuántos suman entre los dos. El que acierta, gana».</p><p class="sub">Los dados estaban prohibidos fuera de las Saturnales, pero la micatio no: era un juego de vista y de rapidez. De un hombre muy honrado se decía que «se podía jugar a la micatio con él a oscuras». Todavía se juega en Italia: es la morra.</p>';
  if(n>=3){B.innerHTML+='<p>«Por hoy ya está bien. Vuelve mañana».</p>';one('Despedirse',closeDialog);return;}
  if(state.obols>=2)one('Jugar (2 sestercios)',()=>{state.obols-=2;save();updateStats();const z=jrz();z.mic=state.day;z.micn=n+1;jrMicRound(0);},'quiz');
  one('Despedirse',closeDialog);}
function jrMicRound(r){const B=$('dBody');$('dOpts').innerHTML='';const one=casaOpen('✋','Gavio','ocioso del Pórtico de Octavia');
  if(r>=6){B.innerHTML='<p>Seis tiradas y nadie acierta. «Tablas: te devuelvo lo tuyo».</p>';state.obols+=2;save();updateStats();one('Volver',jrMicatio,'quiz');return;}
  B.innerHTML='<p class="sub">Tirada '+(r+1)+'. ¿Cuántos dedos sacas?</p>';
  for(let f=0;f<=5;f++)one(f===0?'El puño cerrado':f+(f===1?' dedo':' dedos'),()=>{$('dOpts').innerHTML='';B.innerHTML='<p class="sub">Sacas '+f+'. ¿Qué total cantas?</p>';
    for(let c=f;c<=f+5;c++)one('«¡'+['Ninguno','Uno','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez'][c]+'!»',()=>{
      const g=Math.floor(R()*6),gc=g+Math.floor(R()*6),tot=f+g,you=c===tot,him=gc===tot;$('dOpts').innerHTML='';
      B.innerHTML='<p>Gavio saca '+g+' y canta '+gc+'. En total, <b>'+tot+'</b>.</p>';
      if(you&&!him){state.obols+=4;save();updateStats();B.innerHTML+='<p>¡Has acertado! Te llevas los cuatro sestercios.</p>';if(!jrDone('micatio')){jrMark('micatio');qAdd('so',1,'Calcular deprisa también es saber.');}one('Volver',jrMicatio,'quiz');}
      else if(him&&!you){B.innerHTML+='<p>Gavio acierta y se guarda tus dos sestercios con una sonrisa.</p>';one('Volver',jrMicatio,'quiz');}
      else{B.innerHTML+='<p>'+(you?'Acertáis los dos: ':'Nadie acierta: ')+'otra tirada.</p>';one('Seguir',()=>jrMicRound(r+1),'quiz');}},'quiz');},'quiz');}
// ---- el reloj de Augusto: horas que cambian de duración
function jrReloj(){const one=casaOpen('◷','El reloj de Augusto','Horologium Augusti'),B=$('dBody'),L=jrDayLen(),dm=Math.round(L*60/12),nm=Math.round((24-L)*60/12),h=clock.h;$('dOpts').innerHTML='';
  B.innerHTML='<p>La sombra del obelisco cae sobre las líneas de bronce del pavimento. Ahora es '+(typeof horaRomana==='function'?horaRomana(h):'')+'.</p><p>Los romanos dividían el día, de la salida a la puesta del sol, en <b>doce horas</b>, y la noche en otras doce. Pero como los días son más largos en verano que en invierno, <b>las horas no duraban siempre lo mismo</b>: en pleno invierno, una hora del día duraba unos 45 de nuestros minutos; en pleno verano, unos 75.</p><p>Esta época del año, cada hora del día dura unos <b>'+dm+' minutos</b>, y cada hora de la noche, unos <b>'+nm+'</b>.</p><p class="sub">Para la noche, más que horas, se contaban cuatro «vigilias», los turnos de guardia de los soldados. Los relojes de agua (clepsidras) permitían medir el tiempo de noche y en los días nublados, pero nunca coincidían del todo: Séneca bromea con que es más fácil poner de acuerdo a los filósofos que a los relojes. Por eso la vida romana nunca tuvo la puntualidad de la nuestra.</p>';
  one('¿Cómo era un día normal?',()=>{$('dOpts').innerHTML='';B.innerHTML='<p>Al amanecer, todo el mundo en pie: los clientes, con la toga, a saludar a su patrono (la salutatio). Por la mañana, el trabajo, los negocios y los juicios: la mayoría de los oficios paraban hacia la hora sexta o séptima. A mediodía, un bocado y quizá la siesta. Por la tarde, las termas, hacia la hora octava, y después la cena, la gran comida del día, hacia la hora nona. Con la noche, a dormir: la luz de los candiles era tan mala que se aprovechaba el sol.</p>';one('Volver',jrReloj);one('Despedirse',closeDialog);},'quiz');
  one('Despedirse',closeDialog);}
// ---- sucesos de la calle (solo en la ciudad de Roma, mientras caminas)
const JR_STREET_DAY=['Desde un tercer piso alguien vacía un orinal sin mirar. ¡Por poco! La ley permite denunciar al vecino desde cuya ventana cayó.',
 'Un pregonero anuncia a gritos unas salchichas calientes; otro, unos garbanzos tostados. La calle es un mercado.',
 'Una litera pasa abriéndose paso a empujones: delante, unos esclavos apartan a la gente; dentro, un rico lee tranquilamente.',
 'Ruido de obras: en el Campo de Marte reconstruyen lo que quemó el incendio de esta primavera. Andamios, grúas de rueda y polvo por todas partes.',
 'Un mendigo pide limosna en las escaleras de un templo, con un cartel pintado que cuenta su naufragio.',
 'Una ínsula de seis pisos cruje sobre tu cabeza. Los vecinos dicen que el dueño ha mandado apuntalarla «hasta que la arreglen»: nadie se lo cree.',
 'Un maestro grita a sus alumnos bajo un toldo, en plena calle. Los vecinos se quejan del jaleo desde antes del alba.'];
const JR_STREET_NIGHT=['Retumban los carros: desde Julio César, los carros de transporte solo pueden circular por Roma de noche. Nadie duerme en las calles principales.',
 'Pasa una patrulla de vigiles, los bomberos y guardias nocturnos, con cubos, hachas y mantas mojadas. En Roma hay incendios casi cada noche.',
 'Unos borrachos vuelven de una taberna cantando. De noche, sin antorcha, las calles de Roma son peligrosas: no hay alumbrado público.'];
function jrTick(dt){if(MODE!=='roma'||!state||ui!=='play'||typeof storyOn==='function'&&storyOn())return;JR.t-=dt;if(JR.t>0)return;JR.t=110+Math.random()*120;
  const c=PLACES.find(p=>p.id==='ro_rostra');if(!c||Math.hypot(player.x-c.x,player.z-c.z)>1100||MOUNT.riding)return;
  const night=clock.h<6||clock.h>=19,L=night?JR_STREET_NIGHT:JR_STREET_DAY;let t=L[Math.floor(R()*L.length)];if(t===JR.last)return;JR.last=t;
  toast('<span class="label">'+(night?'Roma de noche':'En la calle')+'</span><br>'+t);}
const JR_ESSAY={id:'jornada',cat:'Contexto',title:'Un día en Roma',body:[
 'La jornada romana empezaba al amanecer, porque la luz de los candiles era pobre y cara. Levantarse era rápido: se dormía con la ropa interior y la túnica, y bastaba con calzarse y, si había que salir de visita, envolverse en la toga, una gran pieza de lana blanca tan pesada y difícil de colocar que muchos necesitaban ayuda. El desayuno era un vaso de agua o un poco de pan; el aseo de verdad se dejaba para las termas.',
 'Las horas romanas no eran como las nuestras: el día, de sol a sol, se dividía en doce horas, y la noche en otras doce, así que en invierno una hora de día duraba unos 45 minutos y en verano unos 75. Relojes de sol y de agua daban horas distintas, y nadie esperaba puntualidad.',
 'La primera obligación de la mañana era la salutatio: los clientes iban con la toga a saludar a su patrono, esperaban su turno según su rango y recibían la espórtula, una pequeña cantidad de dinero o comida. Luego venía el trabajo. En Roma había más de ciento cincuenta oficios organizados en corporaciones, de los panaderos a los estibadores del puerto del Tíber, pero casi todos paraban hacia la hora sexta o séptima: la tarde era para el ocio.',
 'Los hombres se afeitaban a diario en la barbería, que era también un lugar de tertulia; las mujeres se peinaban en casa con su ornatrix, que en época flavia les levantaba altísimos peinados de rizos. Por la tarde, Roma iba a las termas: ejercicio en la palestra, sala caliente, rasqueta y aceite, y baño frío, todo por un cuadrante. Tito inaugura las suyas, junto al anfiteatro, precisamente en el año 80.',
 'Hacia la hora nona llegaba la cena, la gran comida del día, tumbados en los lechos del triclinio: entrantes, platos fuertes y postres. Algunos anfitriones daban a los clientes peor comida y peor vino que a sí mismos, y Marcial se queja de ello con gracia. Por la noche, las calles se llenaban del estruendo de los carros, que solo podían circular de noche, y los vigiles vigilaban los incendios, constantes en unas ínsulas de madera y de cinco o seis pisos.',
 'Una advertencia: Jérôme Carcopino describe sobre todo la Roma de Trajano, hacia el 100-120 d.C., con textos de Marcial, Juvenal y Plinio el Joven. En el juego solo se usa lo que ya valía en el 80, y se avisa cuando algo es posterior, como la moda de la barba (Adriano) o la separación de horarios en las termas.'],
 src:{a:['Marcial, Epigramas','Séneca, Cartas a Lucilio','Plinio el Viejo, Historia natural'],m:['J. Carcopino, La vida cotidiana en Roma en el apogeo del Imperio (1939; trad. inglesa Daily Life in Ancient Rome)'],n:['Los textos del juego resumen con palabras propias las ideas de esa obra; no reproducen su texto.']}};

