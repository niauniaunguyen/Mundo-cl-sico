// ============================================================ TALLERES DE FUENTES (P9)
// En algunas estelas aparece «Comparar fuentes»: dos textos antiguos (resumidos con nuestras palabras, no citados) que cuentan lo mismo
// de forma distinta, dos preguntas de opción múltiple y una conclusión libre. Se guarda en state.talleres y sale en el informe para
// el docente y en el cuaderno de viaje. Las fuentes escritas después del año del juego se marcan como anacronismo.
// Casos: Atenas → tiranicidas (Atenas), soros (Maratón), colono_leon (Termópilas); Roma → ro_coliseo, ro_palatino (Roma), pompeya.
const TALLERES={
 tiranicidas:{t:'¿Quién mató al tirano?',
  a:{n:'La versión de los atenienses',f:'Canciones de banquete (escolios) conservadas por Ateneo, Banquete de los sabios XV 695',x:'En los banquetes de Atenas se canta que Harmodio y Aristogitón escondieron la espada entre ramas de mirto, mataron al tirano y dieron a Atenas la igualdad ante la ley. Por eso tienen estatuas en el Ágora y sus descendientes comen en el Pritaneo.'},
  b:{n:'La versión de Tucídides',f:'Tucídides VI 54-59 y I 20 (escrito hacia el 400 a.C.)',x:'Tucídides dice que casi todos los atenienses se equivocan. Hiparco no era el tirano: lo era su hermano mayor, Hipias. El asesinato nació de una ofensa personal, no de un plan para liberar la ciudad. Después, Hipias gobernó tres años más (cuatro, según Heródoto), con más dureza, y fueron los espartanos quienes lo expulsaron en el 510. Heródoto (V 55-65) coincide en lo esencial.'},
  q:[{p:'Según Tucídides, ¿quién gobernaba Atenas cuando mataron a Hiparco?',o:['Su hermano Hipias','El propio Hiparco','La Asamblea del pueblo'],c:0},
     {p:'¿Por qué crees que los atenienses prefieren la versión de las canciones?',o:['Les da unos héroes de la libertad de los que sentirse orgullosos','Porque Tucídides no sabía leer','Porque las canciones son más antiguas y por eso siempre aciertan'],c:0}],
  r:'Una misma ciudad puede recordar su pasado como le conviene. Tucídides, que buscaba la exactitud, lo corrige comparando testimonios.'},
 soros:{t:'¿Cuántos murieron en Maratón?',
  a:{n:'Heródoto',f:'Heródoto VI 117 (escrito unos cincuenta años después de la batalla)',x:'Heródoto da cifras precisas: murieron unos 6.400 persas y 192 atenienses. Los nombres de los atenienses caídos están escritos en las estelas de este túmulo, tribu por tribu (lo cuenta también Pausanias I 32).'},
  b:{n:'Justino',f:'Justino, Epítome de Pompeyo Trogo II 9 (hacia el siglo II-III d.C.) · anacronismo señalado: se escribió mucho después del año del juego',x:'Siglos más tarde, Justino resume una historia universal y cuenta que en Maratón murieron doscientos mil persas, y que los atenienses persiguieron a los demás hasta las naves.'},
  q:[{p:'¿Qué fuente merece más confianza para el número de muertos atenienses?',o:['Heródoto, porque los 192 nombres estaban grabados aquí y se podían contar','Justino, porque su cifra es más grande','Las dos igual: cada una dice una cosa'],c:0},
     {p:'¿Por qué una cifra puede crecer con el paso de los siglos?',o:['Porque cada autor que copia la historia quiere hacer la victoria más grande','Porque los muertos se cuentan mejor con el tiempo','Porque Heródoto ocultó a la mitad de los persas'],c:0}],
  r:'Cuanto más lejos de los hechos está una fuente, más fácil es que la cifra se infle. Una prueba material (los nombres en las estelas) ayuda a decidir.'},
 colono_leon:{t:'¿Cuántos persas había en las Termópilas?',
  a:{n:'Heródoto',f:'Heródoto VII 184-186 y VII 21',x:'Heródoto suma soldados, marineros, criados y cocineros y llega a más de cinco millones de personas en el ejército de Jerjes. Dice también que, a su paso, los ríos se quedaban secos porque el ejército se bebía toda el agua.'},
  b:{n:'Los historiadores de hoy',f:'Estimaciones modernas (por ejemplo, Cawkwell, The Greek Wars, 2005) · anacronismo señalado',x:'Los historiadores actuales calculan cuánta agua y comida hacían falta para tanta gente y cuántos hombres cabían en los caminos. Piensan que el ejército de tierra tendría entre unas decenas de miles y unos doscientos o trescientos mil hombres.'},
  q:[{p:'¿Qué detalle del propio Heródoto hace dudar de su cifra?',o:['Que los ríos se secaban: ningún país podía alimentar ni dar de beber a cinco millones','Que habla de cocineros','Que escribe en griego'],c:0},
     {p:'¿Qué usan los historiadores de hoy para corregir la cifra?',o:['Cálculos de agua, comida y espacio en los caminos','Una lista oficial de los persas','La cifra que da el epitafio de la tumba'],c:0}],
  r:'Heródoto recoge lo que se contaba, y los griegos tenían motivos para hacer al enemigo enorme. Las cuentas de abastecimiento permiten poner límites.'},
 ro_coliseo:{t:'¿Cuántas fieras se mataron en la inauguración?',
  a:{n:'Suetonio',f:'Suetonio, Vida de Tito 7 (hacia el 120 d.C.) · anacronismo señalado: posterior al año del juego',x:'Suetonio cuenta que, al inaugurar el anfiteatro y las termas, Tito dio unos juegos espléndidos y que en un solo día se presentaron cinco mil fieras de todas clases.'},
  b:{n:'Dion Casio',f:'Dion Casio LXVI 25 (hacia el 220 d.C.) · anacronismo señalado',x:'Dion, un siglo después, dice que en los juegos de inauguración murieron nueve mil animales, salvajes y domésticos, y que también lucharon mujeres. Los juegos duraron cien días.'},
  q:[{p:'¿Se contradicen las dos cifras?',o:['No necesariamente: Suetonio habla de un día y Dion de todos los juegos','Sí: una de las dos tiene que ser falsa','No, porque las dos dicen nueve mil'],c:0},
     {p:'Hay un testigo que sí vivió aquellos juegos: el poeta Marcial, en su Libro de los espectáculos. ¿Por qué sería útil leerlo?',o:['Porque es una fuente de la época, escrita por alguien que estuvo allí','Porque los poetas nunca exageran','Porque da la cifra exacta de fieras'],c:0}],
  r:'Antes de decir que dos fuentes se contradicen hay que mirar si hablan de lo mismo. Y conviene buscar testigos de la época, aunque sean poetas que alaban al emperador.'},
 ro_palatino:{t:'¿Era Tito un buen emperador?',
  a:{n:'Suetonio, el elogio',f:'Suetonio, Vida de Tito 1 y 8 · anacronismo señalado: escrita unos cuarenta años después',x:'Suetonio lo llama «el amor y la delicia del género humano». Cuenta que, si un día no había hecho ningún favor, decía: «Amigos, he perdido el día», y que ayudó a las víctimas del Vesubio y del incendio de Roma.'},
  b:{n:'Suetonio, la sospecha',f:'Suetonio, Vida de Tito 6-7',x:'El mismo Suetonio cuenta que, antes de ser emperador, Tito tenía fama de cruel, de juerguista y de codicioso, que hizo matar a sospechosos sin juicio y que muchos temían que fuera otro Nerón. Dion Casio (LXVI 18) añade que reinó tan poco, dos años, que quizá por eso se le recordó bien.'},
  q:[{p:'¿Cómo pueden ser ciertas las dos imágenes de Tito?',o:['La opinión sobre él cambió al llegar al poder; antes y después se le vio distinto','Suetonio se equivocó de emperador','Una de las dos es de otro Tito'],c:0},
     {p:'¿Por qué duda Dion Casio del buen recuerdo de Tito?',o:['Porque gobernó muy poco tiempo y no le dio tiempo a hacerse odiar','Porque nunca fue emperador','Porque Dion lo conoció en persona'],c:0}],
  r:'Una fuente no es «buena» o «mala» en bloque: el mismo autor puede dar datos a favor y en contra. Hay que preguntarse también qué periodo de la vida de alguien se juzga.'},
 pompeya:{t:'¿Cuándo fue la erupción?',
  a:{n:'Plinio el Joven',f:'Plinio el Joven, Cartas VI 16 (hacia el 106 d.C.) · anacronismo señalado: escrita años después del juego',x:'Plinio, que vio la erupción desde Miseno con diecisiete años, escribe al historiador Tácito y fecha el comienzo el noveno día antes de las calendas de septiembre, es decir, el 24 de agosto. Pero los manuscritos medievales que copian su carta no coinciden todos en esa fecha.'},
  b:{n:'Una inscripción de carbón',f:'Inscripción hallada en 2018 en la Regio V de Pompeya · anacronismo señalado: descubrimiento moderno',x:'En una casa en obras apareció una nota escrita con carbón en la pared, con la fecha del decimosexto día antes de las calendas de noviembre: el 17 de octubre. El carbón se borra pronto, así que se escribió poco antes de la erupción. Encajan además las frutas de otoño, el mosto en las tinajas y los braseros encendidos que se han encontrado.'},
  q:[{p:'¿Por qué la inscripción de carbón es una prueba valiosa?',o:['La escribió alguien en aquellos días y nadie la ha copiado ni cambiado desde entonces','Porque el carbón dura para siempre','Porque la escribió Plinio'],c:0},
     {p:'¿Qué problema tiene la fecha de la carta de Plinio?',o:['Nos ha llegado copiada a mano durante siglos y las copias no dan todas la misma fecha','Plinio no estaba allí','Plinio escribió la carta el mismo día de la erupción'],c:0}],
  r:'Los textos antiguos nos llegan a través de copias, y una cifra o una fecha se puede estropear al copiarse. Una prueba arqueológica puede corregir a un texto famoso. Hoy muchos historiadores piensan que la erupción fue en otoño.'}};
function tlS(){return state.talleres||(state.talleres={});}
function tlHTML(T){return '<p><span class="label">Comparar fuentes · '+T.t+'</span></p>'+[T.a,T.b].map((s,i)=>'<div class="entry" style="margin:6px 0;padding:6px 10px;border-left:3px solid '+(i?'#8a6a3a':'#4a6a8a')+'"><p><b>'+(i?'B':'A')+'. '+s.n+'</b></p><p>'+s.x+'</p><p class="sub">'+s.f+'</p></div>').join('');}
function tlRun(id,back,o){const T=TALLERES[id],S=tlS(),ans=[];let i=0;const B=$('dBody');
  const ask=()=>{const Q=T.q[i];B.innerHTML=tlHTML(T)+'<p><b>Pregunta '+(i+1)+' de '+T.q.length+'.</b> '+Q.p+'</p>';o.innerHTML='';
    Q.o.map((t,k)=>({t,k})).sort((x,y)=>((x.k*7+i*3+id.length)%5)-((y.k*7+i*3+id.length)%5)).forEach((e,n)=>{const b=document.createElement('button');b.className='quiz';b.innerHTML='<span class="n">'+(n+1)+'</span><span>'+e.t+'</span>';
      b.onclick=()=>{ans.push(e.k);toast(e.k===Q.c?'Bien visto.':'No del todo: '+Q.o[Q.c]+'.');i++;i<T.q.length?ask():end();};o.appendChild(b);});};
  const end=()=>{const ok=ans.filter((a,k)=>a===T.q[k].c).length,prev=S[id];
    B.innerHTML='<p><span class="label">Comparar fuentes · conclusión</span></p><p><b>'+ok+' de '+T.q.length+' respuestas acertadas.</b></p><p>'+T.r+'</p><p>¿Qué has sacado en claro? Escríbelo con tus palabras (opcional; lo verá tu docente en el informe):</p><textarea id="tlTxt" rows="3" maxlength="600" style="width:100%;box-sizing:border-box;font:inherit;padding:6px;border-radius:6px">'+((prev&&prev.c)||'')+'</textarea>';
    o.innerHTML='';const g=document.createElement('button');g.className='quiz';g.innerHTML='<span class="n">1</span><span>Guardar en el cuaderno</span>';
    g.onclick=()=>{const c=(($('tlTxt')||{}).value||'').trim().slice(0,600);const first=!prev;S[id]={a:ans.slice(),ok,c,d:state.day||1};
      if(first&&ok===T.q.length){state.obols=(state.obols||0)+2;toast('Taller de fuentes completado: +2 '+(MODE==='roma'?'sestercios':'óbolos')+'.');}else toast('Guardado en el cuaderno de viaje.');
      save();if(typeof updateStats==='function')updateStats();B.innerHTML=back;o.innerHTML='';const s2=document.createElement('button');s2.innerHTML='<span class="n">1</span><span>Seguir</span>';s2.onclick=closeDialog;o.appendChild(s2);};
    o.appendChild(g);};
  ask();}
{const f=readSign;readSign=function(s){f.apply(this,arguments);try{const pl=s.data,T=TALLERES[pl.id];if(!T)return;const o=$('dOpts');if(!o)return;
  const b=document.createElement('button');b.className='quiz';const done=tlS()[pl.id];b.innerHTML='<span class="n">F</span><span>Comparar fuentes'+(done?' (hecho: '+done.ok+'/'+T.q.length+')':'')+'</span>';
  const back=$('dBody').innerHTML;b.onclick=()=>tlRun(pl.id,back,o);o.appendChild(b);}catch(e){console.warn('taller',e);}};}
// ---- en el informe para el docente y en el cuaderno de viaje
function tlLines(st){const S=(st&&st.talleres)||{},L=[];for(const[id,v]of Object.entries(S)){const T=TALLERES[id];if(!T)continue;L.push(' - '+T.t+' · '+v.ok+'/'+T.q.length+(v.c?' · «'+v.c+'»':''));}return L;}
{const f=dzReport;dzReport=function(){let t=f.apply(this,arguments);try{const L=tlLines(state);t+='\n\nTalleres de fuentes ('+L.length+' de '+Object.keys(TALLERES).filter(id=>(MODE==='roma')===/^(ro_|pompeya)/.test(id)).length+'):'+(L.length?'\n'+L.join('\n'):' ninguno todavía');}catch(e){}return t;};}
{const f=fxCuadTxt;fxCuadTxt=function(d){let t=f.apply(this,arguments);try{const L=tlLines(state);if(L.length)t+='\nTalleres de fuentes:\n'+L.join('\n')+'\n';}catch(e){}return t;};}
