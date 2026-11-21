// ============================================================ JUGAR MÁS (3): juegos de mesa, banquete, teatro, escribir, cartas, atletismo, cocina,
// préstamo marítimo, arqueología y el perro que busca. Nada de violencia.
//  L1 Juegos de la época: las tabas (astrágalos) y pares o nones, contra quien quiera jugar.
//  L2 El banquete (symposion / convivium): saber estar, mezclar el vino con agua, la libación y el kótabos.
//  L3 El teatro: elegir máscara y acertar qué viene después en escenas de Aristófanes y de Plauto.
//  L4 Escribir como entonces: tu nombre en alfabeto griego (el jónico, oficial en Atenas desde el 403/402) o en capitales latinas,
//     y las abreviaturas de las inscripciones.
//  L5 Cartas: llevar una carta sellada y traer la respuesta (cartas reales: la de Mnesiergo en plomo; la invitación de Claudia Severa).
//  L6 Atletismo sin combate: carrera del estadio, salto con halteres y disco, con su premio.
//  L7 Cocina: reunir ingredientes por el mercado y seguir la receta (moretum en Roma, sopa de lentejas en Atenas).
//  L8 Préstamo marítimo: poner dinero en el viaje de un barco; si vuelve, cobras con intereses; si naufraga, lo pierdes.
//  L9 Arqueología: excavar, limpiar y fechar un objeto (es un marco moderno: así se trabaja hoy).
//  L10 El perro (179) aprende órdenes: «siéntate», «ven» y «busca» (objetos que la gente ha perdido).
function l3z(){const s=state;if(!s.k3||typeof s.k3!=='object')s.k3={ban:0,tea:{},esc:0,car:null,carD:{},atl:{},coc:null,cocD:{},pre:null,arq:{},per:null,perD:0};return s.k3;}
const L3={t:0,spots:false};
const lRo=()=>MODE==='roma';
// ---------------------------------------------------------------- L1 juegos de mesa
// Tabas: cuatro astrágalos (huesecillos de oveja) con cuatro caras que valen 1, 3, 4 y 6; las de 1 y 6 son estrechas y salen menos.
// La mejor tirada, «Venus» (las cuatro distintas); la peor, «el perro» (todo unos). Augusto jugaba a las tabas y lo cuenta en una carta (Suetonio, Augusto 71).
function lTalus(){const r=Math.random();return r<0.1?1:r<0.5?3:r<0.9?4:6;}
function lThrow(){const t=[lTalus(),lTalus(),lTalus(),lTalus()];const venus=new Set(t).size===4,perro=t.every(v=>v===1);return {t,venus,perro,sc:venus?100:perro?-1:t.reduce((a,b)=>a+b,0)};}
function lThrowTxt(x){return x.t.join(' · ')+(x.venus?' → <b>¡Venus!</b>':x.perro?' → <b>el perro</b>':' → '+x.sc);}
function lTabas(st){st=st||{yo:0,el:0,r:0};const a=lThrow(),b=lThrow();st.r++;if(a.sc>b.sc)st.yo++;else if(b.sc>a.sc)st.el++;
  const fin=st.yo===2||st.el===2||st.r>=5;let html='<p>Tu tirada: '+lThrowTxt(a)+'<br>La suya: '+lThrowTxt(b)+'</p><p>Rondas: tú '+st.yo+' · '+st.el+'</p>';
  if(fin){if(st.yo>st.el){cyPay(2,'Has ganado a las tabas');html+='<p><b>¡Ganas la partida!</b></p>';}else html+='<p>Esta vez pierdes. ¡Otra vez será!</p>';
    html+='<p class="sub">Los astrágalos eran el juego más corriente de niños y mayores; también servían para consultar a los dioses (en Bura, Acaya, había un oráculo de Heracles que se consultaba con tabas: Pausanias VII 25,10).</p>';jmDlg('⚄','Las tabas','Fin de la partida',html,[['Seguir',()=>{}]]);return;}
  jmDlg('⚄','Las tabas','Ronda '+st.r,html,[['Tirar otra vez',()=>lTabas(st)]]);}
function lPares(){const n=1+Math.floor(Math.random()*9);jmDlg('✋','Pares o nones',lRo()?'par impar':'ἀρτιάζειν','<p>Esconde unas nueces en el puño. «¿Pares o nones?»</p>',[['Pares',()=>lParesR(n,0)],['Nones',()=>lParesR(n,1)]]);}
function lParesR(n,g){const ok=n%2===g;if(ok)cyPay(1,'Pares o nones');jmSay('<p>Abre la mano: '+n+' nueces. '+(ok?'<b>¡Aciertas!</b>':'No aciertas.')+'</p><p class="sub">En Roma se jugaba con nueces (nuces): «dejar las nueces» (relinquere nuces) quería decir dejar de ser niño (Persio I 10). En Grecia el juego se llamaba artiázein.</p>');}
function lJuegos(){jmDlg('⚄',lRo()?'Unos jugadores':'Unos jugadores','¿Una partida?','<p>Junto al pórtico, unos hombres juegan sentados en el suelo. Te hacen sitio.</p><p class="sub">También jugaban a juegos de tablero (la petteia griega, los latrunculi y las duodecim scripta romanas). Se conservan tableros grabados en escalones y suelos, pero no las reglas completas, así que aquí no los reconstruimos.</p>',
  [['Jugar a las tabas',()=>lTabas()],['Jugar a pares o nones',()=>lPares()],['Ahora no',()=>{}]]);}
// ---------------------------------------------------------------- L2 el banquete
const LBQ={atenas:[
  ['Te invitan a un banquete. ¿Cómo te colocas en el lecho (kline)?',['Recostado sobre el codo izquierdo','Sentado en una silla','De pie, junto a la mesa'],0,'Los hombres comían recostados sobre el codo izquierdo, dos por lecho. Las mujeres de la familia no asistían; sí las flautistas y las heteras.'],
  ['El anfitrión mezcla el vino en la crátera. ¿Cómo se bebe?',['Mezclado con agua, más agua que vino','Puro, como los valientes','Con miel y sin agua'],0,'Beber vino puro era cosa de escitas, decían los griegos (Heródoto VI 84). Lo normal era una parte de vino por dos o tres de agua.'],
  ['Antes de beber, ¿qué se hace?',['Una libación: unas gotas para los dioses','Brindar chocando las copas','Nada'],0,'La primera copa se ofrecía al «buen demon» (Agathós Dáimon) y se cantaba un peán; después se elegía al simposiarca, que decidía cuánta agua llevaba el vino.']],
 roma:[
  ['Entras en el triclinio. ¿Dónde te tumbas?',['Donde el anfitrión te indique: cada sitio tiene su rango','Donde quieras','En el suelo'],0,'Tres lechos, nueve plazas. El sitio de honor era el «lugar consular», en el lecho del centro (Plutarco, Charlas de sobremesa I 3).'],
  ['¿Las mujeres de la casa están en el banquete?',['Sí, en esta época se recuestan con los hombres','No, comen aparte','Solo sirven la mesa'],0,'En la Roma imperial las mujeres libres participaban en los banquetes; en la Grecia clásica, las esposas no.'],
  ['Alguien dice que los romanos vomitaban para seguir comiendo en el «vomitorio». ¿Es cierto?',['No: el vomitorium es la salida de un teatro o anfiteatro','Sí, había una sala para eso','Solo en las Saturnales'],0,'El vomitorium es el pasillo por el que la gente «sale a borbotones» de las gradas (Macrobio, Saturnales VI 4,3). La sala para vomitar es un mito moderno.']]};
function lBanquete(i,ok){i=i||0;ok=ok||0;const L=LBQ[lRo()?'roma':'atenas'];if(i>=L.length)return lKottabos(ok);const Q=L[i];
  jmDlg(lRo()?'🍇':'🏺',lRo()?'El convivium':'El simposio',Q[0],'',Q[1].map((o,k)=>[o,()=>{const bien=k===Q[2];jmDlg('·','','',(bien?'<p><b>Bien.</b> ':'<p>No exactamente. ')+Q[3]+'</p>',[['Seguir',()=>lBanquete(i+1,ok+(bien?1:0))]]);}]));}
function lKottabos(ok){if(lRo()){l3z().ban++;save();if(ok>=2)cyPay(3,'Te has sabido comportar en el banquete');jmSay('<p>El banquete termina con música y una ronda de brindis por la salud del anfitrión. Has acertado '+ok+' de 3.</p>');return;}
  const o=eduOverlay('kotBox','El kótabos','<p>El juego del simposio: con un giro de muñeca, lanza las últimas gotas de vino de tu copa a un platillo en lo alto de un soporte. Pulsa cuando la marca esté en la zona verde.</p>'+mgBar('kot')+'<div id="kotO"></div>');
  const Z=$('kotZ'),K=$('kotK');Z.style.left='42%';Z.style.width='16%';let t=0,raf=0,done=false;const step=()=>{t+=0.018;K.style.left=(50+48*Math.sin(t*3))+'%';if(!done&&$('kotBox'))raf=requestAnimationFrame(step);};raf=requestAnimationFrame(step);
  $('kotO').appendChild(mgBtn('¡Lanzar!',()=>{if(done)return;done=true;cancelAnimationFrame(raf);const x=50+48*Math.sin(t*3),hit=x>=42&&x<=58;o.remove();ui='play';l3z().ban++;save();if(hit||ok>=2)cyPay(hit?3:2,'El simposio');
    jmSay('<p>'+(hit?'<b>¡Plaf!</b> El vino da en el platillo y cae con un ruido: has ganado el kótabos.':'Las gotas se pierden por el suelo. Los demás se ríen.')+' Has acertado '+ok+' de 3 preguntas.</p><p class="sub">Del kótabos hablan muchos poetas y lo pintan los vasos de figuras rojas; el ruido del platillo al caer «decía» si la persona amada te correspondía.</p>');}));}
// ---------------------------------------------------------------- L3 el teatro
const LT={atenas:{masks:['Máscara cómica (barbudo, nariz chata)','Máscara trágica (rey)','Máscara de esclavo'],src:'En el teatro de Dioniso, en las Grandes Dionisias. Todos los actores eran hombres y llevaban máscara; el coro cantaba y bailaba en la orquestra.',
  q:[['En «Las ranas» de Aristófanes, Dioniso cruza la laguna y el coro de ranas canta: «Brekekekex…»',['…koax koax!','…¡evohé!','…¡ío Peán!'],0],['En «Las nubes», ¿dónde aparece Sócrates?',['Colgado en una cesta, para pensar en las cosas del cielo','Bebiendo cicuta','En la Asamblea'],0],['El último estreno de Aristófanes, hace dos años (388), es «Pluto». ¿De qué trata?',['El dios de la riqueza, ciego, recupera la vista y reparte el dinero a los justos','Una guerra','Un viaje a la Luna'],0]]},
 roma:{masks:['Máscara del esclavo listo','Máscara del soldado fanfarrón','Máscara del viejo avaro'],src:'En el teatro de Marcelo o en el de Pompeyo, durante los juegos. En el 80 d.C. el público prefiere el mimo y el pantomimo, pero las comedias de Plauto se siguen representando y leyendo.',
  q:[['En «La comedia de la olla» (Aulularia) de Plauto, el viejo Euclión esconde…',['Una olla llena de oro','Una carta de amor','Un perro'],0],['«El soldado fanfarrón» (Miles gloriosus) presume de…',['Hazañas imposibles que nunca hizo','Ser muy pobre','Saber griego'],0],['¿Quiénes hacían los papeles de mujer en la comedia?',['Actores hombres con máscara','Actrices','Niños sin máscara'],0]]}};
function lTeatro(){const T=LT[lRo()?'roma':'atenas'];jmDlg('🎭','El teatro','Elige tu máscara','<p>'+T.src+'</p>',T.masks.map(m=>[m,()=>lTeaQ(T,0,0,m)]));}
function lTeaQ(T,i,ok,m){if(i>=T.q.length){if(ok>=2)cyPay(3,'Tu papel en el teatro');l3z().tea[lRo()?'r':'a']=1;save();jmSay('<p>Con tu '+m.split('(')[0].toLowerCase()+' has acertado '+ok+' de 3. '+(ok>=2?'El público aplaude.':'Algunos silban; otros se ríen igual.')+'</p>');return;}
  const Q=T.q[i];jmDlg('🎭','En escena',Q[0],'',Q[1].map((o,k)=>[o,()=>lTeaQ(T,i+1,ok+(k===Q[2]?1:0),m)]));}
// ---------------------------------------------------------------- L4 escribir como entonces
const LGR=[['th','Θ'],['ph','Φ'],['ps','Ψ'],['ch','Χ'],['ks','Ξ'],['x','Ξ'],['a','Α'],['b','Β'],['c','Κ'],['d','Δ'],['e','Ε'],['f','Φ'],['g','Γ'],['h',''],['i','Ι'],['j','Ι'],['k','Κ'],['l','Λ'],['m','Μ'],['n','Ν'],['ñ','Ν'],['o','Ο'],['p','Π'],['q','Κ'],['r','Ρ'],['s','Σ'],['t','Τ'],['u','Υ'],['v','Β'],['w','Ο'],['y','Υ'],['z','Ζ']];
function lGriego(n){n=n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');let o='';for(let i=0;i<n.length;){let hit=false;for(const [a,b] of LGR){if(n.startsWith(a,i)){o+=b;i+=a.length;hit=true;break;}}if(!hit){o+=n[i]===' '?' ':'';i++;}}return o;}
function lLatin(n){return n.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/U/g,'V').replace(/J/g,'I').replace(/W/g,'VV').replace(/Ñ/g,'N');}
const LAB={atenas:[['ΔΗΜΟΣ','«el pueblo»: aparece en los decretos de la Asamblea («ἔδοξεν τῇ βουλῇ καὶ τῷ δήμῳ», «lo acordaron el Consejo y el pueblo»)',['El pueblo','Un dios','La plata']],['ΑΘΕ','las tres primeras letras de «de los atenienses», en las monedas de la lechuza',['De los atenienses','Atenea','Una fecha']],['ΗΟΡΟΣ','«límite», en los mojones; escrito con el alfabeto ático antiguo, de antes del 403, que usaba H para el sonido «h»',['Límite','Puerta','Templo']]],
 roma:[['S·P·Q·R','Senatus Populusque Romanus, «el Senado y el pueblo romano»',['El Senado y el pueblo romano','Su Padre Quiere Riqueza','Sacrificio Para Quirino']],['D·M','Dis Manibus, «a los dioses manes»: el principio de las lápidas',['A los dioses manes','Decimo Mario','Dos monedas']],['S·T·T·L','Sit tibi terra levis, «que la tierra te sea leve»: el final de muchas lápidas',['Que la tierra te sea leve','Sestercios','Saturnales']]]};
function lEscribir(){const nm=(pjz()&&pjz().name)||'';const ro=lRo(),w=ro?lLatin(nm):lGriego(nm);
  jmDlg('✎',ro?'Un maestro (ludi magister)':'Un maestro (grammatistés)','Escribir como entonces','<p>Coges la tablilla de cera y el punzón (stilus / graphís): con la punta se escribe y con el extremo plano se borra.</p>'+(nm?'<p>Tu nombre, '+(ro?'en capitales latinas':'en letras griegas')+': <b style="font-size:1.4em">'+w+'</b></p>':'')+
   (ro?'<p class="sub">En latín no hay U ni J como letras propias: V e I sirven para las dos.</p>':'<p class="sub">Desde el 403/402 a.C. Atenas usa oficialmente el alfabeto jónico (con Η para la «e» larga y Ω para la «o» larga); antes se escribía con el ático antiguo. La «h» no tiene letra: es un espíritu áspero.</p>'),
   [['Leer abreviaturas de inscripciones',()=>lAbrev(0,0)],['Gracias',()=>{}]]);}
function lAbrev(i,ok){const L=LAB[lRo()?'roma':'atenas'];if(i>=L.length){l3z().esc=Math.max(l3z().esc,ok);save();if(ok>=2)cyPay(2,'Lees las inscripciones');jmSay('<p>Has descifrado '+ok+' de '+L.length+'.</p>');return;}
  const A=L[i],opts=A[2].map((o,k)=>[o,k]).sort(()=>Math.random()-0.5);jmDlg('✎','En la piedra','¿Qué dice «'+A[0]+'»?','',opts.map(([o,k])=>[o,()=>jmDlg('·','','','<p>'+(k===0?'<b>¡Sí!</b> ':'No: ')+'«'+A[0]+'» es '+A[1]+'.</p>',[['Seguir',()=>lAbrev(i+1,ok+(k===0?1:0))]])]));}
// ---------------------------------------------------------------- L5 cartas
const LCA={atenas:{from:[/pireo/,'Mnesiergo, un hombre que trabaja en el Pireo'],to:[/agora|mercado/,'su familia, junto al Ágora'],
   carta:'«Mnesiergo envía saludos a los de casa y les desea salud. Os pido que me mandéis una manta, la que sea más barata, no de piel de oveja; y unas suelas para los zapatos. Os lo devolveré cuando pueda.»',
   resp:'La familia mete la manta en un hatillo y te da una tablilla de vuelta: «Aquí tienes. Cuídate.»',src:'Es una carta real del siglo IV a.C., escrita en una lámina de plomo doblada y hallada en el Ática (Museo de Berlín). Es de las cartas privadas griegas más antiguas que se conservan.'},
 roma:{from:[/foro|forum/,'Claudia Severa'],to:[/palatin|domus|subura/,'su amiga Sulpicia Lepidina'],
   carta:'«Claudia Severa a su Lepidina, salud. El tercer día antes de los idus de septiembre, hermana, para el día de la celebración de mi cumpleaños, te invito de corazón a que vengas con nosotros: harás el día más agradable con tu presencia.»',
   resp:'Lepidina sonríe, escribe en una tablilla de madera y la sella: «Allí estaré.»',src:'La carta es real: una invitación de cumpleaños escrita en una tablilla de madera hallada en Vindolanda (Britania). Es de hacia el 100 d.C., unos veinte años después de este momento (anacronismo leve), y tiene unas líneas de la mano de la propia Claudia: de los textos latinos más antiguos escritos por una mujer.'}};
function lCarta(){const z=l3z(),C=LCA[lRo()?'roma':'atenas'];if(z.carD[lRo()?'r':'a']){toast('<span class="label">Cartas</span><br>Ya llevaste esta carta. ¡Gracias, mensajero!');return;}
  if(!z.car){z.car={st:1};save();const P=kPlace(C.to[0]);jmDlg('✉',C.from[1],'Una carta sellada','<p>«¿Vas hacia allí? Lleva esta carta a '+C.to[1]+'. No la abras: lleva mi sello.»</p>',[['La llevo',()=>toast('<span class="label">Carta</span><br>Llévala a '+(P?P.name:C.to[1])+'.')]]);return;}
  if(z.car.st===2){z.car=null;z.carD[lRo()?'r':'a']=1;save();cyPay(4,'Has llevado la carta');jmDlg('✉',C.from[1],'La respuesta','<p>'+C.resp+'</p><p><b>La carta decía:</b> '+C.carta+'</p><p class="sub">'+C.src+'</p>',[['Seguir',()=>{}]]);return;}
  toast('<span class="label">Carta</span><br>Aún tienes que entregarla a '+C.to[1]+'.');}
function lCartaTick(){const z=l3z();if(!z.car||z.car.st!==1)return;const C=LCA[lRo()?'roma':'atenas'],P=kPlace(C.to[0]);if(P&&Math.hypot(P.x-player.x,P.z-player.z)<30){z.car.st=2;save();
  jmDlg('✉',C.to[1],'La carta','<p>'+C.resp+'</p><p>Vuelve con la respuesta a quien te dio la carta.</p>',[['Seguir',()=>{}]]);}}
// ---------------------------------------------------------------- L6 atletismo
function lAtletismo(){const ro=lRo();jmDlg('🏃',ro?'En el Campo de Marte':'En el gimnasio','Pruebas atléticas','<p>'+(ro?'Los jóvenes romanos corren, saltan y lanzan en el Campo de Marte antes de bañarse en el Tíber.':'En el gimnasio se entrena desnudo (gymnós) y untado de aceite; después se rasca la piel con el estrígilo.')+'</p>',
  [['Carrera del estadio (≈ 185 m)',()=>lCarrera()],['Salto con halteres',()=>lSalto('salto')],['Lanzamiento de disco',()=>lSalto('disco')],['Ahora no',()=>{}]]);}
function lCarrera(){const o=eduOverlay('runBox','El estadio','<p>Pulsa el botón tan rápido como puedas durante 6 segundos.</p><p id="runT" style="font-size:1.6em">Prepárate…</p><div id="runO"></div>');let n=0,t0=0,on=false;const b=mgBtn('¡Correr!',()=>{if(!t0){t0=performance.now();on=true;}if(on)n++;});$('runO').appendChild(b);
  const tick=()=>{if(!$('runBox'))return;if(t0){const s=(performance.now()-t0)/1000;$('runT').textContent=Math.max(0,6-s).toFixed(1)+' s · '+n+' zancadas';if(s>=6){on=false;const tiempo=(185/(n*0.62+12)).toFixed(1);
    o.remove();ui='play';const z=l3z();z.atl.run=Math.max(z.atl.run||0,n);save();const ok=n>=38;if(ok)cyPay(3,'Ganas la carrera del estadio');jmSay('<p>Tiempo: unos '+tiempo+' s. '+(ok?'<b>¡Llegas el primero!</b>':'Llegas detrás de dos rivales.')+'</p><p class="sub">El estadio (stádion) medía 600 pies: unos 185 m en Olimpia, 178 en Delfos. Era la prueba más antigua de los Juegos Olímpicos.</p>');return;}}requestAnimationFrame(tick);};requestAnimationFrame(tick);}
function lSalto(k){const disco=k==='disco',o=eduOverlay('salBox',disco?'El disco':'El salto con halteres','<p>'+(disco?'Gira y suelta el disco cuando la marca esté en la zona verde.':'Toma impulso balanceando los halteres (pesas de piedra o plomo) y salta cuando la marca esté en la zona verde.')+'</p>'+mgBar('sal')+'<div id="salO"></div>');
  const Z=$('salZ'),K=$('salK');Z.style.left='60%';Z.style.width='12%';let t=0,raf=0,done=false;const step=()=>{t+=0.022;K.style.left=(50+48*Math.sin(t*2.6))+'%';if(!done&&$('salBox'))raf=requestAnimationFrame(step);};raf=requestAnimationFrame(step);
  $('salO').appendChild(mgBtn(disco?'¡Soltar!':'¡Saltar!',()=>{if(done)return;done=true;cancelAnimationFrame(raf);const x=50+48*Math.sin(t*2.6),q=Math.max(0,1-Math.abs(x-66)/30);o.remove();ui='play';
    const m=disco?(18+q*17).toFixed(1):(4.5+q*2.8).toFixed(2),ok=q>0.8;if(ok)cyPay(3,disco?'Buen lanzamiento de disco':'Buen salto');
    jmSay('<p>'+(disco?'El disco cae a '+m+' m.':'Saltas '+m+' m.')+' '+(ok?'<b>¡Excelente!</b>':'')+'</p><p class="sub">'+(disco?'El disco era de bronce o de piedra, de 1,5 a 6 kg; el Discóbolo de Mirón muestra el giro antes de soltarlo.':'Los halteres se balanceaban hacia delante al saltar para ganar distancia; no está claro si el salto griego era uno solo o varios seguidos.')+' Premio en las Panateneas: ánforas con aceite de los olivos sagrados de Atenea.</p>');}));}
// ---------------------------------------------------------------- L7 cocina
const LKO={atenas:{n:'Sopa de lentejas (phaké)',ing:[['Lentejas','un saco de lentejas del mercado'],['Cebolla','cebollas de Mégara, famosas'],['Aceite','aceite del Ática'],['Vinagre','un poco de vinagre (óxos)']],fake:['Tomate','Patata'],
   txt:'La sopa de lentejas era la comida del pobre: «Desde que es rico ya no le gustan las lentejas», dice un personaje de Aristófanes (Pluto 1004). Los ricos preferían el pescado: Arquéstrato de Gela escribió un poema gastronómico sobre dónde comprar el mejor.'},
 roma:{n:'Moretum (queso con hierbas y ajo)',ing:[['Ajo','cabezas de ajo'],['Queso','queso de oveja'],['Hierbas','apio, ruda y cilantro'],['Aceite','aceite y un chorro de vinagre']],fake:['Tomate','Maíz'],
   txt:'La receta está en el poema «Moretum» (Apéndice virgiliano): un campesino, Símilo, lo machaca en el mortero al amanecer. Tomate, patata y maíz llegarían de América mil cuatrocientos años después; la pimienta, en cambio, sí la usaban los romanos (venía de la India).'}};
function lCocina(){const z=l3z(),K=LKO[lRo()?'roma':'atenas'];if(!z.coc){z.coc={have:[]};save();jmDlg('🍲','En la cocina',K.n,'<p>Te enseñan a preparar '+K.n.toLowerCase()+'. Necesitas: '+K.ing.map(i=>i[0].toLowerCase()).join(', ')+'. Búscalos por los puestos del mercado y vuelve aquí.</p>',[['Voy',()=>lIngSpots()]]);return;}
  const falta=K.ing.filter(i=>!z.coc.have.includes(i[0]));if(falta.length){toast('<span class="label">Cocina</span><br>Te falta: '+falta.map(i=>i[0].toLowerCase()).join(', ')+'.');return;}
  const opts=[...K.ing.map(i=>i[0]),...K.fake].sort(()=>Math.random()-0.5);jmDlg('🍲','En la cocina','¿Qué NO lleva la receta?','<p>Antes de cocinar, alguien te ofrece más ingredientes…</p>',opts.map(o=>[o,()=>{const ok=K.fake.includes(o);z.coc=null;z.cocD[lRo()?'r':'a']=1;save();cyPay(ok?4:2,'Has cocinado '+K.n.toLowerCase());
    jmSay('<p>'+(ok?'<b>¡Bien!</b> Eso no existía en el Mediterráneo antiguo.':'Eso sí se usaba…')+' El plato queda listo.</p><p class="sub">'+K.txt+'</p>');}]));}
function lIngSpots(){if(L3.ing)return;L3.ing=1;const K=LKO[lRo()?'roma':'atenas'],P=kPlace(lRo()?/macellum|foro/:/mercado|agora/);if(!P)return;
  K.ing.forEach((g,i)=>{const a=i/K.ing.length*TAU+0.7,f=findFree(P.x+Math.cos(a)*24,P.z+Math.sin(a)*24,1);const gg=grp(f[0],floorAt(f[0],f[1]),f[1],0);box(0.5,0.4,0.5,lam('#a8884a'),0,0.2,0,gg);
    egxObj(f[0],f[1],undefined,()=>{const z=l3z();if(!z.coc)return toast('Aquí venden '+g[1]+'.');if(!z.coc.have.includes(g[0])){if(state.obols<1){toast('No tienes ni un '+(lRo()?'as':'óbolo')+'.');return;}state.obols-=1;updateStats();z.coc.have.push(g[0]);save();}toast('<span class="label">Cocina</span><br>Compras '+g[1]+'. Llevas '+z.coc.have.length+'/'+K.ing.length+'.');},g[0],'ingrediente',2);});}
// ---------------------------------------------------------------- L8 préstamo marítimo
// En Atenas: el «préstamo a la gruesa» (nautikòn dáneion): el prestamista adelanta dinero para un viaje; si el barco vuelve, cobra con intereses
// altos (20-30 %); si naufraga, lo pierde todo. Demóstenes XXXV (Contra Lácrito) conserva un contrato entero. En Roma, el fenus nauticum.
// De mediados de noviembre a marzo el mar está «cerrado» (Hesíodo, Trabajos 618-694; Vegecio IV 39): no zarpa nadie.
function lCerrado(){let mo=0;try{mo=calNow().mo;}catch(e){}return mo>=10||mo<=1;}
function lPrestamo(){const z=l3z(),ro=lRo(),d=state.day||1;
  if(z.pre){if(d<z.pre.vuelta){toast('<span class="label">Préstamo marítimo</span><br>El barco aún no ha vuelto. Vuelve el día '+z.pre.vuelta+'.');return;}
    const p=z.pre;z.pre=null;save();if(p.ok){state.obols+=p.c+Math.round(p.c*0.3);updateStats();save();jmSay('<p>¡El barco ha vuelto con '+(ro?'trigo de Egipto':'trigo del mar Negro')+'! Cobras '+p.c+' más el 30 %: '+(p.c+Math.round(p.c*0.3))+'.</p>');}
    else jmSay('<p>Malas noticias: una tormenta hundió el barco cerca de '+(ro?'Sicilia':'Eubea')+'. La tripulación se salvó en una barca, pero la carga se perdió, y tu dinero con ella. Así funcionaba este préstamo: el riesgo era del prestamista.</p>');return;}
  if(lCerrado()){jmDlg('⚓','En el puerto','El mar está cerrado','<p>«En invierno no zarpa nadie: hasta la primavera, los barcos esperan varados.» (De mediados de noviembre a marzo, el mare clausum.)</p>',[['Entendido',()=>{}]]);return;}
  jmDlg('⚓',ro?'Un naviero de Ostia':'Un naviero del Pireo','Préstamo marítimo','<p>«Necesito dinero para fletar el barco y comprar la carga. Si vuelve, te devuelvo el doble no: lo prestado más el 30 %. Si se hunde, lo pierdes. ¿Te arriesgas?»</p><p class="sub">'+(ro?'El fenus nauticum romano':'El nautikòn dáneion ateniense')+': el interés era alto porque el riesgo también.</p>',
   [5,10].map(c=>['Prestar '+c,()=>{if(state.obols<c){toast('No tienes bastante.');return;}state.obols-=c;updateStats();z.pre={c,vuelta:d+3,ok:Math.random()>0.18};save();toast('<span class="label">Préstamo marítimo</span><br>El barco zarpa. Vuelve el día '+(d+3)+'.');}]).concat([['Ahora no',()=>{}]]));}
// ---------------------------------------------------------------- L9 arqueología
const LA={atenas:[['Un fragmento de cerámica con figuras negras sobre fondo rojo','¿De cuándo es?',['Siglo VI a.C.','Siglo IV d.C.','De ayer'],0,'Las figuras negras son anteriores a las rojas (que aparecen hacia el 530 a.C.): este trozo ya era antiguo en el 386.'],
   ['Un óstrakon (trozo de cerámica) con un nombre rayado: ΘΕΜΙΣΘΟΚΛΕΣ','¿Para qué servía?',['Para votar el destierro (ostracismo)','Para pagar en el mercado','Para jugar'],0,'Se han hallado cientos de óstraka con el nombre de Temístocles, condenado al ostracismo hacia el 471 a.C.'],
   ['Una moneda de plata con una lechuza','¿Qué es?',['Una tetradracma de Atenas','Un denario romano','Una ficha de teatro'],0,'Las «lechuzas» de plata del Laurión se usaban en todo el Mediterráneo.']],
 roma:[['Una lucerna de barro con un gladiador en relieve','¿De cuándo es, más o menos?',['Siglo I d.C.','Siglo V a.C.','Edad Media'],0,'Las lucernas con escenas en el disco son típicas del siglo I d.C.'],
   ['Un ladrillo con un sello: el nombre del taller y de los cónsules del año','¿Para qué sirve hoy ese sello?',['Para fechar el edificio','Para saber el precio','Era un adorno'],0,'Los sellos de ladrillo (bolli laterizi) fechan muchos edificios romanos; abundan desde el siglo II.'],
   ['Un denario con la cabeza de Tito','¿Quién gobierna?',['Tito, el emperador de ahora','Augusto','Nerón'],0,'Tito reina del 79 al 81 d.C.']]};
function lArq(i){const L=LA[lRo()?'roma':'atenas'],z=l3z();if(i===undefined){i=L.findIndex((x,k)=>!z.arq[(lRo()?'r':'a')+k]);if(i<0){toast('<span class="label">Arqueología</span><br>Has excavado todo lo de esta zona.');return;}}
  const A=L[i];let n=0;const o=eduOverlay('arqBox','Excavar','<p class="sub">Esto es un marco moderno: hoy los arqueólogos excavan así; en el '+(lRo()?'80 d.C.':'386 a.C.')+' nadie lo hacía.</p><p id="arqT">Quita la tierra con cuidado, capa a capa.</p><div id="arqO"></div>');
  $('arqO').appendChild(mgBtn('Cepillar',()=>{n++;$('arqT').textContent=n<5?'Capa '+n+' de 5…':'¡Aparece algo: '+A[0].toLowerCase()+'!';if(n===5){o.remove();ui='play';
    jmDlg('⛏','Hallazgo',A[1],'<p>'+A[0]+'.</p>',A[2].map((op,k)=>[op,()=>{z.arq[(lRo()?'r':'a')+i]=1;save();if(k===A[3])cyPay(3,'Hallazgo bien fechado');jmSay('<p>'+(k===A[3]?'<b>¡Correcto!</b> ':'No: ')+A[4]+'</p>');}]));}}));}
// ---------------------------------------------------------------- L10 el perro aprende
const LP={atenas:[['un sello de anillo','Un comerciante'],['una llave de bronce','Una vecina'],['una sandalia','Un niño']],roma:[['un anillo con sello','Un liberto'],['una llave de bronce','Una matrona'],['una bulla (amuleto de niño)','Un niño']]};
function lPerro(){const z=coz(),y=l3z();if(!z.dog){jmDlg('🐕','El perro','Aún no tienes perro','<p>Puedes adoptar un cachorro en el mercado. «Cave canem» (cuidado con el perro), avisaban los mosaicos de las entradas en Pompeya.</p>',[['Vale',()=>{}]]);return;}
  jmDlg('🐕',z.dog,'Órdenes','<p>'+z.dog+' te mira moviendo la cola.</p><p class="sub">En la Odisea, Argos, el perro de Ulises, es el único que lo reconoce tras veinte años: mueve la cola, baja las orejas y muere (XVII 290-327).</p>',
   [['¡Siéntate!',()=>{L3.stay=true;toast(z.dog+' se sienta y espera.');}],['¡Ven!',()=>{L3.stay=false;L3.seek=null;toast(z.dog+' viene corriendo.');}],['¡Busca!',()=>lBusca()],['Nada',()=>{}]]);}
function lBusca(){const y=l3z();if(!y.per){toast('<span class="label">'+coz().dog+'</span><br>Olfatea el suelo, pero nadie ha perdido nada… de momento. Pregunta por la ciudad: a veces la gente pierde cosas.');return;}L3.stay=false;L3.seek={x:y.per.x,z:y.per.z};toast(coz().dog+' olfatea y sale corriendo. ¡Síguelo!');}
function lPerdido(){const y=l3z(),L=LP[lRo()?'roma':'atenas'];if(y.per){toast('<span class="label">Objeto perdido</span><br>Aún buscas '+y.per.o+'. '+(coz().dog?'Prueba a decirle «¡busca!» a tu perro (menú de Esc).':'Busca por los alrededores: brilla un poco.'));return;}
  const k=y.perD%L.length,a=Math.random()*TAU,r=25+Math.random()*20,f=findFree(player.x+Math.cos(a)*r,player.z+Math.sin(a)*r,0.5);y.per={o:L[k][0],who:L[k][1],x:f[0],z:f[1]};save();lPerSpawn();
  jmDlg('?',L[k][1],'Ha perdido algo','<p>«He perdido '+L[k][0]+' por aquí cerca. ¿Me ayudas a encontrarlo?»</p>',[['Te ayudo',()=>{}]]);}
function lPerSpawn(){const y=l3z();if(!y.per||L3.perG)return;const g=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,6),new THREE.MeshBasicMaterial({color:'#e8c060'}));g.position.set(y.per.x,floorAt(y.per.x,y.per.z)+0.08,y.per.z);scene.add(g);L3.perG=g;}
function lPerTick(){const y=l3z();if(!y.per)return;lPerSpawn();if(Math.hypot(y.per.x-player.x,y.per.z-player.z)<2.5){const o=y.per;y.per=null;y.perD++;save();if(L3.perG){scene.remove(L3.perG);L3.perG=null;}L3.seek=null;
  cyPay(3,'Has encontrado '+o.o);jmSay('<p>¡Aquí está '+o.o+'! Lo devuelves y te dan las gracias'+(coz().dog?' (y una caricia a '+coz().dog+')':'')+'.</p>');}}
{const f=dogTick;dogTick=function(dt){if(typeof DOG!=='undefined'&&DOG.on&&(L3.stay||L3.seek)){const g=DOG.on.A.g;if(L3.stay&&!L3.seek)return;const tx=L3.seek.x,tz=L3.seek.z,dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);
  if(d>0.8){const sp=Math.min(d,5*dt);g.position.set(g.position.x+dx/d*sp,floorAt(g.position.x+dx/d*sp,g.position.z+dz/d*sp),g.position.z+dz/d*sp);g.rotation.y=Math.atan2(dx,dz);DOG.on.ph+=sp*4;(DOG.on.A.legs||[]).forEach((l,i)=>{if(l)l.rotation.x=Math.sin(DOG.on.ph+(i%2?Math.PI:0))*0.5;});}
  else if(!L3.barked||performance.now()-L3.barked>4000){L3.barked=performance.now();try{sfxBark(2);}catch(e){}}return;}return f.apply(this,arguments);};}
{const f=gmDo;gmDo=function(k){if(k==='perro'){try{gmClose&&gmClose();}catch(e){}lPerro();return;}return f.apply(this,arguments);};}
// ---------------------------------------------------------------- dónde está cada cosa
function lSpots(){if(L3.spots||!state||typeof PLACES==='undefined'||PLACES.length<20)return;L3.spots=true;const ro=lRo();
  kSpot(ro?/basilica_julia|foro/:/stoa|agora/,-6,-14,()=>lJuegos(),'Unos jugadores','tabas y pares o nones');
  kSpot(ro?/domus|palatin/:/demo_|kerameis|ceramico/,8,8,()=>lBanquete(),ro?'Un convivium':'Un simposio','banquete');
  kSpot(ro?/teatro|marcel|pompey/:/teatro|dioniso/,6,6,()=>lTeatro(),'El teatro','sube a escena');
  kSpot(ro?/foro/:/agora/,20,10,()=>lEscribir(),'Un maestro','escribir como entonces');
  const C=LCA[ro?'roma':'atenas'];kSpot(C.from[0],-8,6,()=>lCarta(),C.from[1].split(',')[0],'una carta');
  kSpot(ro?/campo_marte|campus|estadio|circo/:/academia|liceo|gimnasio|cinosarges/,5,-5,()=>lAtletismo(),'Atletismo','carrera, salto y disco');
  kSpot(ro?/subura|insula|domus/:/demo_|kerameis|ceramico/,-12,-6,()=>lCocina(),'Una cocina','cocinar con receta');
  kSpot(ro?/emporio|ostia|portus|puerto/:/pireo|kantharos|emporio/,8,-8,()=>lPrestamo(),'Un naviero','préstamo marítimo');
  kSpot(ro?/foro/:/ceramico|kerameikos|dipilo/,-18,18,()=>lArq(),'Excavación','arqueología');
  kSpot(ro?/foro/:/agora/,-22,-8,()=>lPerdido(),'Alguien busca algo','objeto perdido');}
{const f=uxTick;uxTick=function(dt){f(dt);if(!state||ui==='start')return;const now=performance.now();if(now-L3.t<1000)return;L3.t=now;
  try{lSpots();lCartaTick();lPerTick();}catch(e){if(!L3.err){L3.err=String(e&&e.stack||e).slice(0,300);console.warn('jugar mas 3',e);}}};}
