// ============================================================ viajes en barco
const VOY_FACTS=['En el Pireo, los aduaneros cobran la pentekosté: el dos por ciento del valor de toda mercancía que entra o sale del puerto.','Los mercantes navegan a vela; las trirremes de guerra, a remo.','Se navega de primavera a otoño; en invierno el mar se considera cerrado.','De noche, si se puede, se fondea en una cala o se sigue la Osa Mayor.','Los marineros vierten vino al mar para que Poseidón les sea favorable.','Un buen día de navegación cubre unos noventa kilómetros con viento favorable.'];
const LAND_FACTS=['El camino sube por el monte Citerón, donde según el mito fue abandonado Edipo recién nacido.','Los viajeros duermen en posadas o al raso; los ricos van a caballo, los demás a pie o en carro.','Un carro de bueyes recorre unos veinte o treinta kilómetros al día.','En el paso de Eleuteras, la frontera entre el Ática y Beocia, Atenas tiene una fortaleza.'];
function destOf(k){return ISLANDS.find(I=>I.id===k);}
function homeName(){return MODE==='roma'?'Roma':'Atenas';}
function destName(k){return k==='atenas'?(MODE==='roma'?'Roma (el Emporio)':'el Pireo (Atenas)'):destOf(k).name;}
function landName(k){return k==='atenas'?homeName():destOf(k).name;}
// lfare/ldays: precio y duración por tierra desde la ciudad que hace de centro (Tarraco, en Hispania)
function fareOf(from,to,land){const f0=fareOf0(from,to,land),tes=state&&state.fx&&state.fx.tes;return f0>0&&tes&&tes[from]?Math.ceil(f0/2):f0;}
function fareOf0(from,to,land){const A=destOf(from),B=destOf(to);if(land&&((A&&A.lfare)||(B&&B.lfare)))return Math.max(A&&A.lfare||0,B&&B.lfare||0);
  if(from==='atenas'||to==='atenas')return(A||B).fare;return Math.max(A.fare,B.fare);}
function daysOf(from,to,land){const A=destOf(from),B=destOf(to);if(land&&((B&&B.ldays)||(A&&A.ldays)))return(B&&B.ldays)||A.ldays;const k=from==='atenas'?to:(to==='atenas'?from:to);return destOf(k).days;}
// destinos por tierra desde un sitio: los de su misma red (Grecia, Italia o Hispania) y la ciudad que hace de centro
function landDests(here){const n=netOf(here),hub={hisp:'tarraco',gal:'massilia',sic:'siracusa',sar:'caralis',cor:'aleria',afr:'cartago',ach:'corinthus',asi:'ephesus',syr:'antiochia',bri:'londinium',del:'delos',rho:'rhodus',cyp:'cyprus',mel:'melita',cyr:'cyrene',dal:'salona',mau:'caesarea_m',asia:'efeso',eg:MODE==='roma'?'alejandria':'naucratis'}[n]||'atenas';return[hub,...ISLANDS.filter(I=>!bySea(I)&&(I.net||'gr')===n).map(I=>I.id)].filter((d,i,a)=>d!==here&&a.indexOf(d)===i);}
function cur(){return MODE==='roma'?' sestercios':' óbolos';}
function openLand(c){
  dlg={n:null};ui='dialog';releasePointer();const here=c.port,dests=landDests(here);
  if(MODE==='roma')return openRomaLand(c,here,dests);
  $('dGlyph').textContent='Λ';setName('Lisicles',true);$('dTitle').textContent='Arriero · caminos de Grecia · personaje inventado';
  $('dBody').innerHTML='<p>Salud, forastero. Llevo cerámica de Atenas por los caminos de Grecia y vuelvo con lo que encuentro: anguilas del Copais, lana de Arcadia, hierro de Laconia. Si quieres, te subes al carro. Hasta Tebas son dos días; hasta Micenas, tres; hasta Esparta, una semana.</p>';
  const o=$('dOpts');o.innerHTML='';let k=1;const add=(txt,fn,cls)=>{const b=document.createElement('button');if(cls)b.className=cls;b.innerHTML='<span class="n">'+(k++)+'</span><span>'+txt+'</span>';b.onclick=fn;o.appendChild(b);};
  for(const d of dests){const f=fareOf(here,d),can=state.obols>=f;add('Viajar a '+(d==='atenas'?'Atenas':ISLANDS.find(I=>I.id===d).name)+' · '+f+' óbolos'+(can?'':' (pagarás cargando ánforas)'),()=>sail(here,d,true),'quiz');}
  add('¿Cómo están las cosas por Grecia?',()=>{$('dBody').innerHTML='<p>Con la paz del Rey, los espartanos mandan en toda Grecia. Han obligado a disolver la liga de las ciudades beocias y quieren reconstruir Platea; en Tebas hay dos bandos, los amigos de Esparta y los que no la soportan. En Esparta, el rey Agesilao está contento. En Micenas no queda nadie a quien le importe: solo piedras y cabras.</p>';});
  add('¿Es seguro el camino?',()=>{$('dBody').innerHTML='<p>Hacia Tebas, en el Citerón hay fortines atenienses y alguna vez bandidos; dormimos en Eleuteras, donde nació el culto de Dioniso. Hacia el Peloponeso hay que cruzar las Rocas Escironias, donde según el mito Teseo mató al bandido Escirón, y luego el Istmo. En Arcadia, cuidado con los lobos.</p>';});
  add('Despedirse',closeDialog);$('dialog').hidden=false;setTimeout(()=>{const b=o.querySelector('button');b&&b.focus({preventScroll:true});},30);
}
// el cochero de Roma (y el de Tarraco): carruajes de alquiler por las calzadas
function openRomaLand(c,here,dests){
  const hisp=netOf(here)==='hisp';
  $('dGlyph').textContent='V';setName(c.data.name,true);$('dTitle').textContent=hisp?'Cochero · caminos de Hispania · personaje inventado':'Cochero · carruajes de alquiler por las calzadas de Italia · personaje inventado';
  $('dBody').innerHTML=hisp?'<p>Salud, viajero. Llevo gente y equipaje por las calzadas de Hispania en mi raeda, un carro de cuatro ruedas con toldo. Tierra adentro todo está más lejos de lo que parece: a Ilerda son tres días; a Emerita, casi un mes.</p>':'<p>Salud, ciudadano. Tengo una raeda, un carro de cuatro ruedas con toldo, y dos mulas que conocen todas las calzadas de Italia. Si tienes prisa, alquilo también un cisium, más ligero. Cambiamos de mulas en las posadas del camino. ¿Adónde vamos?</p>';
  const o=$('dOpts');o.innerHTML='';let k=1;const add=(txt,fn,cls)=>{const b=document.createElement('button');if(cls)b.className=cls;b.innerHTML='<span class="n">'+(k++)+'</span><span>'+txt+'</span>';b.onclick=fn;o.appendChild(b);};
  for(const d of dests){const f=fareOf(here,d,true),can=state.obols>=f;add('Viajar a '+landName(d)+' · '+f+' sestercios'+(can?'':' (pagarás ayudando con las mulas)'),()=>sail(here,d,true),'quiz');}
  add('¿Cómo se viaja por Italia?',()=>{$('dBody').innerHTML='<p>Por las calzadas: la Apia hacia el sur, la Flaminia hacia el norte, la Aurelia por la costa de Etruria, la Salaria hacia el Adriático. Cada mil pasos hay un miliario que dice cuánto falta. Hacemos unas veinticinco o treinta millas al día. Los correos del emperador cambian de caballos en las mansiones y van mucho más deprisa, pero ese servicio no es para nosotros: solo para quien lleva un permiso oficial.</p>';});
  add('¿Es seguro el camino?',()=>{$('dBody').innerHTML='<p>Más que antes. Desde Augusto hay puestos de soldados en los caminos y pocos bandidos se atreven cerca de Roma. Lo peor son las posadas: Horacio se quejaba del agua, de los mosquitos y de los posaderos tacaños. Y en invierno, la nieve en los pasos de los Apeninos. Llévate tu propia manta.</p>';});
  add('Despedirse',closeDialog);$('dialog').hidden=false;setTimeout(()=>{const b=o.querySelector('button');b&&b.focus({preventScroll:true});},30);
}
function openVoyage(c){
  if(c.mode==='tierra')return openLand(c);
  if(MODE==='roma')return openRomaVoyage(c);
  dlg={n:null};ui='dialog';releasePointer();godEvent('captain');
  $('dGlyph').textContent='Ν';setName('Hagnón',true);$('dTitle').textContent='Armador · capitán de un mercante · personaje inventado';
  $('dBody').innerHTML='<p>Salud. Mi barco es un mercante redondo, de vela: nada de remeros como en las trirremes. Llevo vino, aceite y cerámica, y pasajeros, si no se marean. ¿Adónde quieres ir?</p>';
  renderVoyOpts(c);$('dialog').hidden=false;
}
function openRomaVoyage(c){
  dlg={n:null};ui='dialog';releasePointer();
  $('dGlyph').textContent='N';setName(c.data.name,true);$('dTitle').textContent='Naviero · naves de carga a Hispania y a África · personaje inventado';
  $('dBody').innerHTML=c.port==='atenas'?'<p>Salud. Mi barca baja por el Tíber hasta Portus, el gran puerto que construyó Claudio junto a Ostia. Allí embarcas en mi nave, una oneraria que vuelve a Hispania con vajilla, vidrio y telas, y trae aceite, vino y salazones. ¿Adónde quieres ir?</p>':'<p>Salud. Volvemos a Italia con ánforas de vino y de aceite. Si quieres, te llevo a Portus, junto a Ostia, o a otro puerto de la costa.</p>';
  renderVoyOpts(c);$('dialog').hidden=false;
}
function renderVoyOpts(c){
  const o=$('dOpts');o.innerHTML='';let k=1;const add=(txt,fn,cls)=>{const b=document.createElement('button');if(cls)b.className=cls;b.innerHTML='<span class="n">'+(k++)+'</span><span>'+txt+'</span>';b.onclick=fn;o.appendChild(b);};
  const dests=['atenas',...ISLANDS.filter(bySea).map(I=>I.id)].filter(d=>d!==c.port);
  for(const d of dests){const f=fareOf(c.port,d),can=state.obols>=f;add('Viajar a '+destName(d)+' · '+f+cur()+(can?'':' (pagarás trabajando a bordo)'),()=>sail(c.port,d),'quiz');}
  if(MODE==='roma'){add('¿Cuánto se tarda?',()=>{$('dBody').innerHTML='<p>Con buen viento, de Ostia a la Hispania Citerior se llega en cuatro días: lo dice Plinio el Viejo, que en paz descanse. Si el viento no ayuda, una semana o dos. A Gades, en el otro extremo, siete días. Solo se navega de primavera a otoño: en invierno el mar está cerrado.</p>';renderVoyOpts(c);});
    add('¿Qué lleváis en la bodega?',()=>{$('dBody').innerHTML='<p>De Hispania traemos aceite de la Bética, vino de la Tarraconense, garum y salazones, metales de las minas. Llevamos de Italia vajilla roja de Arretium, lámparas, vidrio, tejidos. Las ánforas vacías de aceite acaban en Roma en un monte que crece junto al Emporio: hay tantas que ya es una colina.</p>';renderVoyOpts(c);});
    add('Despedirse',closeDialog);setTimeout(()=>{const b=$('dOpts').querySelector('button');b&&b.focus({preventScroll:true});},30);return;}
  add('¿Cuánto cuesta el pasaje?',()=>{$('dBody').innerHTML='<p>Barato. De Egina al Pireo cobro dos óbolos, como todo el mundo. A las Cícladas, una dracma; a Lesbos, una y media; a Creta, dos dracmas. Hasta desde Egipto o el mar Negro se cobran solo dos dracmas, con mujer, hijos y equipaje. Lo dice Platón, que se queja de que el piloto que te salva la vida cobra menos que un maestro de retórica. Si no tienes dinero, ayudarás con las velas.</p>';renderVoyOpts(c);});
  add('¿Es peligroso navegar?',()=>{$('dBody').innerHTML='<p>Navegamos de primavera a otoño, de día y cerca de la costa si se puede; en invierno el mar está cerrado. Hay tormentas, rocas y piratas. Hasta hace unos meses, los corsarios de Egina asaltaban a todo barco ateniense. Ahora, con la Paz del Rey, el mar está más tranquilo. Más o menos.</p>';renderVoyOpts(c);});
  add('Despedirse',closeDialog);
  setTimeout(()=>{const b=o.querySelector('button');b&&b.focus({preventScroll:true});},30);
}
function sail(from,to,land){
  const f=fareOf(from,to,land),paid=state.obols>=f;if(paid){state.obols-=f;save();updateStats();}
  $('dialog').hidden=true;dlg=null;ui='voyage';
  if(MOUNT.riding)dismount();if(MOUNT.g){MOUNT.g.visible=false;MOUNT.st='away';}   // el caballo se queda en tierra
  const v=$('voyage');v.querySelector('.vt').textContent=land?'De camino a '+landName(to):'Navegando hacia '+destName(to);v.classList.toggle('land',!!land);
  const dd=daysOf(from,to,land);v.querySelector('.vs').textContent=dd.charAt(0).toUpperCase()+dd.slice(1)+'. '+(paid?(f===0&&!land&&barcoOwn()?'Viajas en tu propio barco, el «'+barcoName()+'».':MODE==='roma'?'Pagas '+f+' sestercios.':'Pagas '+f+' óbolos.'):(land?(MODE==='roma'?'Pagas el viaje ayudando con las mulas y los fardos.':'Pagas el viaje cargando ánforas en el carro.'):'Pagas el pasaje ayudando a la tripulación con las velas.'));
  v.querySelector('.vf').textContent=land?pick(MODE==='roma'?ROMA_LAND_FACTS:LAND_FACTS):pick(MODE==='roma'?ROMA_VOY_FACTS:VOY_FACTS);v.hidden=false;requestAnimationFrame(()=>v.classList.add('show'));
  const arrive=()=>{const P=PORTS[land&&to==='atenas'?'atenas_n':(land&&PORTS[to+'_n']?to+'_n':to)];player.x=P.x;player.z=P.z;player.feet=floorAt(P.x,P.z);player.camY=player.feet+player.eye;player.vy=0;player.yaw=P.yaw;player.pitch=0;curZone=null;
    addHours(to==='egina'||from==='egina'?5:10);updateSky();fxArrive(to);
    v.classList.remove('show');setTimeout(()=>{v.hidden=true;ui='play';},700);};
  if(!land&&seaEligible(from,to))setTimeout(()=>seaIntro(arrive),2400);   // en alta mar, el sueño de Ulises
  else setTimeout(arrive,3400);
}
