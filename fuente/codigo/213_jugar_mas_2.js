// ============================================================ JUGAR MÁS (2): jornadas, mapa por descubrir, casos, obras, citas, maestría,
// diario descargable, orientación a la antigua, debates y retos por equipos. Ninguna incluye violencia.
//  K1 Una jornada con alguien de la época: se le acompaña de un sitio a otro, con su horario y lo que hace.
//  K2 La ciudad se descubre andando: se apunta lo recorrido (celdas de 40 m); al pasar del 10, 25, 50, 75 y 100 %, un premio.
//  K3 Casos por resolver: tres testigos y una decisión ante el tribunal (Heliea / basílica Julia).
//  K4 Una obra pública: se paga la piedra, la conducción y los obreros, y la fuente queda con tu nombre grabado (evergetismo).
//  K5 Citas: avisos de mercado y asamblea/senado una hora antes; si estás allí, ves de qué va y ganas algo.
//  K6 Oficios por niveles: aprendiz, oficial y maestro (más paga en cada nivel).
//  K7 Mi diario de viaje: fotos (en pequeño) y notas propias, para descargar como página (para entregar en clase).
//  K8 Orientación a la antigua: llegar a un sitio con indicaciones de la época, sin mapa ni brújula.
//  K9 Debates de la asamblea o del Senado sobre propuestas reales de la época, y lo que pasó de verdad.
//  K10 Retos por equipos (modo en línea): alguien lanza un reto, cada uno elige equipo y se ve la clasificación.
function kz(){const s=state;if(!s.k2||typeof s.k2!=='object')s.k2={j:null,ex:{},exM:0,cas:{},obra:{},cit:{},or:null,deb:{},notas:[]};return s.k2;}
const K2={t:0,spots:false,ui:null};
const kRo=()=>MODE==='roma';
function kPlace(re){const R=re instanceof RegExp?re:new RegExp(re,'i');return (PLACES||[]).find(p=>isFinite(p.x)&&Math.abs(p.x)<4000&&Math.abs(p.z)<4000&&R.test((p.id||'')+' '+(p.name||'')));}
function kSpot(re,dx,dz,act,name,sub){const p=kPlace(re);if(!p)return null;const f=findFree(p.x+dx,p.z+dz,1);const g=grp(f[0],floorAt(f[0],f[1]),f[1],0);
  box(0.9,1.0,0.6,lam('#8a6a44'),0,0.5,0,g);egxObj(f[0],f[1],undefined,act,name,sub,2.6);return {x:f[0],z:f[1]};}
// ---------------------------------------------------------------- K1 jornadas
const KJ={atenas:[
  {id:'platon',n:'Platón',sub:'filósofo, 41 años',src:'Diógenes Laercio III 5-7 y 20; Platón, Carta VII.',pasos:[
    [/agora/,8,'Platón pasea por el Ágora. No le gusta: aquí condenaron a Sócrates, su maestro, hace trece años. Escucha a unos sofistas y frunce el ceño.'],
    [/dipilo|ceramico/,10,'Sale por la puerta del Dípilo y toma el camino de la Academia, entre tumbas. «Por aquí paseaba con Sócrates», dice.'],
    [/academia/,11,'En el gimnasio de la Academia, bajo los olivos de Atenea, se reúnen sus discípulos. Acaba de volver de Sicilia y ha decidido quedarse a enseñar aquí.'],
    [/academia/,17,'Al caer la tarde, preguntas y respuestas: «¿Qué es la justicia?». Nadie se va con una respuesta, pero todos piensan.']]},
  {id:'vendedora',n:'Mírrina, vendedora de coronas',sub:'viuda, vende en el Ágora',src:'Aristófanes, Tesmoforiantes 446-458 (la viuda que vende coronas de mirto).',pasos:[
    [/krene|fuente/,6,'Antes del alba, agua en la fuente pública: es el rato en que las mujeres hablan entre ellas.'],
    [/mercado|agora/,8,'Con los ramos de mirto ya trenzados, se sienta en su puesto del Ágora. Una corona para un banquete, otra para un sacrificio.'],
    [/agora/,12,'«Desde que el poeta dice que los dioses no existen, vendo la mitad», se queja: a ella le va el sustento en las fiestas.'],
    [/casa|demo/,18,'De vuelta a casa, cuenta los óbolos: hay para pan, aceite y poco más. Mañana, otra vez.']]},
  {id:'minero',n:'Sosias, esclavo minero',sub:'en las minas del Laurión',src:'Jenofonte, Poros IV 14-15 (Nicias alquilaba mil esclavos para las minas).',pasos:[
    [/laurion|lauri/,5,'Bajas con Sosias por el pozo con una lucerna de barro. Las galerías son tan bajas que se trabaja de rodillas.'],
    [/laurion|lauri/,11,'Arriba, otros lavan el mineral molido en los lavaderos: el agua escasea y se recoge en cisternas.'],
    [/laurion|lauri/,16,'Sosias pertenece a un ciudadano que lo alquila a la mina por un óbolo al día. La plata acaba en las lechuzas de Atenas.']]}],
 roma:[
  {id:'liberto',n:'Tiberio Claudio Fausto, liberto panadero',sub:'antes esclavo, hoy dueño de un horno',src:'Marcial y Juvenal (la salutatio); la tumba del panadero Eurísaces, en la Puerta Mayor.',pasos:[
    [/palatin|domus/,6,'Al amanecer, la salutatio: aunque ya es libre, saluda a su antiguo amo, su patrono, y recibe la espórtula.'],
    [/foro|forum/,9,'En el Foro arregla un contrato de harina en la basílica, entre abogados que gritan.'],
    [/termas/,14,'Las termas: el gran igualador. Por un cuadrante se bañan juntos ricos y pobres.'],
    [/subura|insula/,19,'Cena en una taberna de la Subura. Su sueño: un sepulcro con relieves de su oficio, como el del panadero Eurísaces.']]},
  {id:'vestal',n:'Cornelia, virgen vestal',sub:'sacerdotisa de Vesta',src:'Plutarco, Numa 9-10; Aulo Gelio I 12.',pasos:[
    [/vesta/,6,'El fuego sagrado de Vesta no puede apagarse nunca: Cornelia lo vigila y trae agua de una fuente, no del acueducto.'],
    [/vesta|atrium/,10,'En la casa de las vestales prepara la mola salsa, la harina con sal para los sacrificios.'],
    [/foro|rostra/,13,'Por la calle la precede un lictor: si se cruza con un condenado, puede salvarle la vida.'],
    [/vesta/,18,'Treinta años de servicio: diez aprendiendo, diez sirviendo y diez enseñando. Después podrá casarse.']]}]};
function kjList(){return KJ[kRo()?'roma':'atenas'];}
function kjStart(){const L=kjList();jmDlg('☉','Una jornada','¿A quién acompañas hoy?','<p>Pasa un día con alguien de la época: te dirá adónde va, y allí verás lo que hace.</p>',L.map(J=>[J.n+' · <span class="sub">'+J.sub+'</span>',()=>{kz().j={id:J.id,i:0};save();kjNext();}]).concat([['Ahora no',()=>{}]]));}
function kjCur(){const z=kz();if(!z.j)return null;const J=kjList().find(q=>q.id===z.j.id);return J?{J,i:z.j.i}:null;}
function kjNext(){const c=kjCur();if(!c)return;const st=c.J.pasos[c.i];if(!st){kz().j=null;save();cyPay(5,'Una jornada con '+c.J.n);toast('<span class="label">Fin de la jornada</span><br>'+c.J.src);return;}
  const P=kPlace(st[0]);toast('<span class="label">'+c.J.n+'</span><br>Sigue a '+c.J.n.split(',')[0]+' hasta <b>'+(P?P.name:'su destino')+'</b> ('+st[1]+' h).');}
function kjTick(){const c=kjCur();if(!c||ui!=='play')return;const st=c.J.pasos[c.i];if(!st)return;const P=kPlace(st[0]);if(!P){kz().j.i++;save();return;}
  if(Math.hypot(P.x-player.x,P.z-player.z)<35){if(clock.h<st[1])clock.h=st[1];kz().j.i++;save();jmDlg('☉',c.J.n,P.name+' · '+st[1]+' h','<p>'+st[2]+'</p>',[['Seguir',()=>kjNext()]]);}}
// ---------------------------------------------------------------- K2 ciudad por descubrir
function kInCity(x,z){try{return kRo()?romaInUrbs(x,z):insideWalls(x,z);}catch(e){return false;}}
function kExTotal(){if(K2.exT)return K2.exT;let n=0;for(let x=-4000;x<4000;x+=40)for(let z=-4000;z<4000;z+=40)if(kInCity(x+20,z+20))n++;K2.exT=Math.max(1,n);return K2.exT;}
function kExTick(){const P=player;if(!kInCity(P.x,P.z))return;const z=kz(),k=Math.floor(P.x/40)+','+Math.floor(P.z/40);if(z.ex[k])return;z.ex[k]=1;
  const n=Object.keys(z.ex).length,pc=n/kExTotal()*100;for(const m of[10,25,50,75,100])if(pc>=m&&z.exM<m){z.exM=m;save();cyPay(m===100?20:m/5,'Has recorrido el '+m+' % de '+(kRo()?'Roma':'Atenas'));
    toast('<span class="label">'+(kRo()?'Roma':'Atenas')+' a pie</span><br>Llevas recorrido el '+m+' % de la ciudad. '+(m<100?'Las calles que aún no has pisado siguen esperando.':'Has pisado todas sus calles: conoces la ciudad como un vecino.'));}}
function kExPct(){return Math.min(100,Math.round(Object.keys(kz().ex).length/kExTotal()*100));}
// ---------------------------------------------------------------- K3 casos
const KC={atenas:[
  {id:'herencia',n:'La herencia del alfarero',t:'Ha muerto un alfarero del Cerámico sin hijos varones. Su sobrino dice que el taller es suyo; su hija, que es ella quien hereda.',
   w:[['El vecino','«El alfarero tenía una hija, casada hace un año con un hombre del demo de Acarnas.»'],['El escriba del arconte','«La ley dice que, sin hijos varones, la hija es epíclera: la herencia pasa con ella, y el pariente más cercano puede reclamarla en matrimonio.»'],['La hija','«Mi padre no dejó testamento. Yo no puedo heredar sola: en Atenas una mujer no posee bienes por sí misma.»']],
   q:'¿Qué decide el tribunal?',o:['La herencia va con la hija epíclera, y el arconte vela por ella','El sobrino se queda el taller y la hija nada','Se vende el taller y se reparte'],ok:0,ex:'Así lo regulaba la ley ateniense de la epíclera: el patrimonio seguía a la hija y el arconte epónimo protegía a huérfanos y epícleras (Aristóteles, Const. de los atenienses 56,6-7; Iseo, discursos sobre herencias).'},
  {id:'mojon',n:'El mojón movido',t:'Dos campesinos discuten: el mojón de piedra (horos) que separa sus olivares ha aparecido tres pasos más allá.',
   w:[['El pastor','«Lo vi de noche: alguien tiraba de una piedra con un buey.»'],['El agrimensor','«En la piedra está grabado: ΗΟΡΟΣ, “límite”. Su sitio original aún se ve: queda el hoyo.»'],['El campesino viejo','«Mover un mojón es ofensa a Zeus Horios, el que guarda las lindes.»']],
   q:'¿Qué hay que hacer?',o:['Devolver el mojón al hoyo original y multar a quien lo movió','Dejarlo donde está','Partir el olivar a medias'],ok:0,ex:'Los horoi marcaban lindes, hipotecas y espacios públicos; moverlos era delito y sacrilegio (Platón, Leyes VIII 842e-843a).'},
  {id:'aceite',n:'El ánfora de aceite',t:'Un mercader dice que le han robado un ánfora de aceite del Ática en el Pireo.',
   w:[['El estibador','«El ánfora llevaba un sello en el asa. Lo recuerdo: una lechuza.»'],['El agoránomo','«Los agoránomos vigilamos pesos y medidas del mercado. Aquí hay un ánfora con ese sello… a la venta en otro puesto.»'],['El otro vendedor','«¡La compré de buena fe a un desconocido!»']],
   q:'¿Qué decide el tribunal?',o:['Devolver el ánfora al dueño; el vendedor puede reclamar al desconocido','El vendedor se la queda: la compró','Se tira el aceite'],ok:0,ex:'Los agoránomos vigilaban el mercado (Aristóteles, Const. 51,1); el sello del asa identificaba al productor, por eso hoy los arqueólogos fechan ánforas por sus sellos.'}],
 roma:[
  {id:'testamento',n:'El testamento sellado',t:'Un comerciante ha muerto y aparecen dos testamentos distintos.',
   w:[['Un testigo','«Yo sellé el testamento con mi anillo, junto a otros seis testigos.»'],['El jurista','«Un testamento válido lleva los sellos de siete testigos; el posterior anula al anterior si es válido.»'],['La viuda','«El segundo lo escribió él mismo, pero solo lo firmó con un esclavo como testigo.»']],
   q:'¿Cuál vale?',o:['El primero, con los siete sellos','El segundo, por ser el último','Ninguno: todo para el fisco'],ok:0,ex:'El testamento pretorio exigía siete sellos de testigos (Gayo, Instituciones II 119); el segundo, sin esas formas, no anulaba al primero.'},
  {id:'pan',n:'El pan falto de peso',t:'Unos vecinos de la Subura se quejan: el pan de un horno pesa menos de lo debido.',
   w:[['Una clienta','«Pago lo mismo y cada vez es más pequeño.»'],['El edil','«Los ediles vigilamos pesos y medidas en los mercados.»'],['El esclavo del horno','«El amo nos manda hacer la masa más pequeña cuando el trigo sube.»']],
   q:'¿Qué hace el edil?',o:['Pesar los panes con las medidas oficiales y multar al panadero','Nada: el precio es libre','Cerrar todos los hornos'],ok:0,ex:'Los ediles controlaban pesos y medidas y el abastecimiento; en Pompeya se han hallado mesas de medidas oficiales (mensa ponderaria).'},
  {id:'pared',n:'La pared de la ínsula',t:'Se agrieta la pared entre dos ínsulas y cada dueño culpa al otro.',
   w:[['El inquilino','«El de al lado ha añadido un piso más, y la pared ya no aguanta.»'],['El arquitecto','«Augusto limitó la altura de las casas a unos 70 pies; esta pasa de eso.»'],['El vecino','«¡Todos construyen alto: en Roma no hay sitio!»']],
   q:'¿Qué decide el juez?',o:['El que añadió el piso de más debe reparar y bajarlo','Que cada uno pague la mitad','Nadie es responsable'],ok:0,ex:'Augusto limitó la altura de los edificios a 70 pies (Estrabón V 3,7); Juvenal se queja de las casas que se caen (Sátira III).'}]};
function kcList(){return KC[kRo()?'roma':'atenas'];}
function kcStart(){const z=kz(),L=kcList().filter(c=>!z.cas[c.id]||!z.cas[c.id].done);if(!L.length){toast('<span class="label">Tribunal</span><br>No hay casos pendientes. ¡Has resuelto todos!');return;}
  const c=z.cas.cur&&L.find(q=>q.id===z.cas.cur);if(c){const st=z.cas[c.id]||{};if((st.w||[]).length>=3)return kcJudge(c);toast('<span class="label">'+c.n+'</span><br>Aún te faltan testigos: '+c.w.filter((w,i)=>!(st.w||[]).includes(i)).map(w=>w[0]).join(', ')+'.');return;}
  const C=L[0];z.cas.cur=C.id;z.cas[C.id]={w:[]};save();kcSpots(C);jmDlg('⚖',C.n,'Un caso por resolver','<p>'+C.t+'</p><p>Habla con los tres testigos (están cerca de aquí: busca a '+C.w.map(w=>w[0]).join(', ')+') y vuelve al tribunal.</p>',[['De acuerdo',()=>{}]]);}
function kcSpots(C){const T=kPlace(kRo()?/basilica_julia|basílica julia/:/heliea|tribunal/)||kPlace(kRo()?/foro/:/agora/);if(!T)return;C.w.forEach((w,i)=>{const a=i/3*TAU,f=findFree(T.x+Math.cos(a)*14,T.z+Math.sin(a)*14,1);
  const p=makePerson({chiton:['#8a6a4a','#5a6a7a','#9a5a4a'][i],short:i!==2,female:/hija|viuda|clienta/i.test(w[0])});p.position.set(f[0],floorAt(f[0],f[1]),f[1]);scene.add(p);
  egxObj(f[0],f[1],undefined,()=>{const z=kz(),st=z.cas[C.id];if(!st.w.includes(i)){st.w.push(i);save();}jmDlg('⚖',w[0],C.n,'<p>'+w[1]+'</p><p class="sub">Testigos escuchados: '+st.w.length+'/3.</p>',[['Gracias',()=>{}]]);},w[0],'testigo del caso',2.2);});}
function kcJudge(C){jmDlg('⚖','El tribunal',C.n,'<p>'+C.t+'</p><p><b>'+C.q+'</b></p>',C.o.map((o,i)=>[o,()=>{const z=kz();if(i===C.ok){z.cas[C.id].done=1;z.cas.cur=null;save();cyPay(6,'Caso resuelto: '+C.n);jmSay('<p><b>¡Bien argumentado!</b> '+C.ex+'</p>');}else jmSay('<p>El tribunal no te da la razón. Repasa lo que dijeron los testigos.</p><p class="sub">'+C.w.map(w=>'<b>'+w[0]+':</b> '+w[1]).join('<br>')+'</p>');}]));}
// ---------------------------------------------------------------- K4 obra pública
const KO={piedra:[8,'la piedra','Se compra caliza del Pireo / travertino de Tívoli y se paga el transporte.'],agua:[8,'la conducción','Tubos de barro cocido encajados uno en otro, desde el manantial.'],obreros:[8,'los obreros','Canteros y fontaneros cobran su jornal (una dracma al día en Atenas, como en las obras del Erecteion).']};
function koOpen(){const z=kz(),o=z.obra,ro=kRo();if(o.done){toast('<span class="label">Tu fuente</span><br>Aquí sigue tu fuente, con tu nombre grabado. Los vecinos llenan sus cántaros en ella.');return;}
  const falta=Object.keys(KO).filter(k=>!o[k]);jmDlg('⛲',ro?'El curator aquarum':'El encargado de las fuentes','Una fuente para el barrio','<p>'+(ro?'En Roma, los ricos pagan obras públicas para el pueblo y para su propia fama: es el evergetismo. Aquí falta una fuente.':'En Atenas, los ricos pagan obras y servicios para la ciudad (las liturgias), y la ciudad los honra. Aquí falta una fuente.')+'</p><p>Faltan: '+falta.map(k=>KO[k][1]+' ('+KO[k][0]+' '+uxCoin(KO[k][0])+')').join(', ')+'.</p>',
   falta.map(k=>['Pagar '+KO[k][1]+' ('+KO[k][0]+')',()=>{if(state.obols<KO[k][0]){toast('No tienes bastante dinero.');return;}state.obols-=KO[k][0];o[k]=1;save();updateStats();toast('<span class="label">La obra</span><br>'+KO[k][2]);if(Object.keys(KO).every(q=>o[q])){o.done=1;save();koBuild(true);}}]).concat([['Ahora no',()=>{}]]));}
function koBuild(nuevo){const z=kz(),o=z.obra;if(!o.done||K2.obraG||!o.x)return;const g=grp(o.x,floorAt(o.x,o.z),o.z,0),st=kRo()?M.stone:M.limestone;
  box(3.2,0.6,1.6,st,0,0.3,0,g);box(2.8,0.08,1.2,lam('#4f8a96'),0,0.62,0,g);box(0.5,2.2,0.5,M.marble,0,1.1,-0.6,g);const sp=box(0.12,0.12,0.3,M.bronze,0,1.6,-0.3,g);
  const nm=(pjz&&pjz()&&pjz().name)||(kRo()?'un ciudadano':'un forastero'),lb=labelSprite(kRo()?'FONS · '+nm.toUpperCase()+' · D(E) S(VA) P(ECVNIA) F(ECIT)':'ΚΡΗΝΗ · '+nm,kRo()?'«Lo hizo con su dinero»':'fuente pagada por '+nm,false);lb.position.y=3;g.add(lb);addBox(o.x,o.z,3.2,1.6,0);K2.obraG=g;
  if(nuevo)toast('<span class="label">¡Fuente terminada!</span><br>Tu nombre queda grabado en la piedra'+(kRo()?' con la fórmula «de sua pecunia fecit» (lo hizo con su dinero)':'')+'. Los vecinos te lo agradecerán.'),jmz().fama+=2;}
// ---------------------------------------------------------------- K5 citas
function kCitas(){const ro=kRo(),d=state.day||1;const L=[[ro?/macellum/:/mercado|agora/,ro?'El mercado del macellum':'El mercado del Ágora',8,12,ro?'Carne, pescado y verduras; los ediles vigilan pesos y medidas.':'Por la mañana el Ágora está llena: cada mercancía tiene su «círculo» (el del pescado, el del vino…).']];
  if(d%4===1)L.push([ro?/curia/:/pnyx/,ro?'Sesión del Senado':'Asamblea en la Pnyx',8,11,ro?'El Senado se reúne en la Curia; en el año 80 el emperador Tito propone y los senadores aprueban.':'Unos seis mil ciudadanos votan a mano alzada; ahora se cobra por asistir (tres óbolos, desde Agirrio).']);
  return L;}
function kCitaTick(){const z=kz(),d=state.day||1,h=clock.h;for(const [re,n,h0,h1,tx] of kCitas()){const k=d+':'+n;const P=kPlace(re);if(!P)continue;
  if(h>=h0-1&&h<h0&&!z.cit[k+':a']){z.cit[k+':a']=1;toast('<span class="label">Cita · '+n+'</span><br>Empieza a las '+h0+' h en '+P.name+'. Si vas, verás de qué va.');}
  if(h>=h0&&h<h1&&!z.cit[k+':v']&&Math.hypot(P.x-player.x,P.z-player.z)<45){z.cit[k+':v']=1;save();cyPay(2,n);toast('<span class="label">'+n+'</span><br>'+tx);}}}
// ---------------------------------------------------------------- K6 oficios por niveles
const KLV=[[0,'aprendiz',0],[3,'oficial',1],[8,'maestro',2]];
function kLv(n){let r=KLV[0];for(const l of KLV)if(n>=l[0])r=l;return r;}
{const f=mgPay;mgPay=function(k,q,coins){const z=mgz(),before=kLv(z[k]||0),r=f.apply(this,arguments),after=kLv(z[k]||0);try{if(after[2]){state.obols+=after[2];updateStats();}
  if(after!==before)toast('<span class="label">Oficio · '+after[1]+'</span><br>'+(after[1]==='oficial'?'Ya trabajas sin que te miren las manos: cobras un poco más.':'¡Eres maestro del oficio! Te pagan como a los mejores y podrías tener aprendices.'));}catch(e){}return r;};}
// ---------------------------------------------------------------- K7 diario descargable
function kdLoad(){try{return JSON.parse(localStorage.getItem('nostos-diario')||'[]');}catch(e){return [];}}
function kdSave(L){try{localStorage.setItem('nostos-diario',JSON.stringify(L.slice(-12)));}catch(e){}}
{const f=phShot;phShot=function(){const r=f.apply(this,arguments);try{const c=renderer.domElement,w=360,h=Math.round(c.height/c.width*w),t=document.createElement('canvas');t.width=w;t.height=h;t.getContext('2d').drawImage(c,0,0,w,h);
  const L=kdLoad();L.push({img:t.toDataURL('image/jpeg',0.7),d:state.day||1,h:Math.floor(clock.h),z:(typeof regionName==='function'?regionName():'')});kdSave(L);}catch(e){}return r;};}
function kdOpen(){const z=kz(),L=kdLoad();eduOverlay('kdBox','Mi diario de viaje','<p>Las fotos que haces en el modo foto se guardan aquí (las 12 últimas) y puedes añadir notas. Al final, descárgalo como una página para entregarlo o guardarlo.</p>'+
  '<div style="display:flex;flex-wrap:wrap;gap:8px">'+L.map(p=>'<figure style="margin:0;width:170px"><img src="'+p.img+'" style="width:170px;border-radius:6px"><figcaption class="sub">Día '+p.d+', '+p.h+' h · '+p.z+'</figcaption></figure>').join('')+'</div>'+
  '<p><b>Notas</b></p><ul>'+z.notas.map(n=>'<li>'+n.replace(/</g,'&lt;')+'</li>').join('')+'</ul><textarea id="kdTx" rows="3" style="width:100%;font:inherit" placeholder="Escribe lo que has visto o aprendido…"></textarea><div id="kdO"></div>');
  $('kdO').appendChild(mgBtn('Añadir nota',()=>{const t=$('kdTx').value.trim();if(t){z.notas.push(t.slice(0,600));save();kdOpen();}}));$('kdO').appendChild(mgBtn('Descargar el diario',kdDownload));}
async function kdDownload(){const z=kz(),L=kdLoad(),nm=(pjz&&pjz()&&pjz().name)||'';const html='<!doctype html><meta charset="utf-8"><title>Diario de viaje · Nóstos</title><body style="font-family:Georgia,serif;max-width:820px;margin:auto;padding:16px;background:#f4ede0;color:#2b231c"><h1>Diario de viaje'+(nm?' de '+nm:'')+'</h1><p>'+(kRo()?'Roma, 80 d.C.':'Atenas, 386 a.C.')+' · Nóstos</p>'+
  L.map(p=>'<figure><img src="'+p.img+'" style="max-width:100%"><figcaption>Día '+p.d+', '+p.h+' h · '+p.z+'</figcaption></figure>').join('')+'<h2>Notas</h2><ul>'+z.notas.map(n=>'<li>'+n.replace(/</g,'&lt;')+'</li>').join('')+'</ul></body>';
  try{const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;if(dl){await dl.save({filename:'diario_nostos.html',data:html});return;}}catch(e){}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download='diario_nostos.html';document.body.appendChild(a);a.click();a.remove();}
{const f=gmDo;gmDo=function(k){if(k==='diario'){try{gmClose&&gmClose();}catch(e){}kdOpen();return;}return f.apply(this,arguments);};}
// ---------------------------------------------------------------- K8 orientación a la antigua
const KOR={atenas:[[/academia/,'Sal del Ágora hacia el noroeste, cruza el Cerámico y sal por la puerta del Dípilo; sigue el camino entre las tumbas hasta el bosque de olivos del héroe Academo.'],[/pnyx/,'Desde el Ágora, sube hacia el suroeste a la colina rocosa donde se reúne el pueblo: busca la tribuna tallada en la roca.'],[/partenon/,'Sube a la roca de Atenea por la rampa del oeste, cruza los Propileos y camina hacia el gran templo de mármol.']],
 roma:[[/coliseo|anfiteatro/,'Desde el Foro, sigue la Vía Sacra hacia el este, deja el Palatino a tu derecha y busca el anfiteatro nuevo junto al Coloso de bronce.'],[/circo/,'Baja del Palatino hacia el sur, al valle entre el Palatino y el Aventino: allí está la pista larga de las carreras.'],[/vesta/,'En el Foro, busca el templo redondo cuyo fuego no se apaga nunca, junto a la casa de las vírgenes.']]};
function korStart(){const z=kz(),L=KOR[kRo()?'roma':'atenas'],i=Math.floor(Math.random()*L.length),P=kPlace(L[i][0]);if(!P)return;z.or={i,t0:performance.now()};save();document.body.classList.add('kOrient');
  jmDlg('⌖','Orientación a la antigua','Sin mapa ni brújula','<p>Como un viajero de la época, solo con indicaciones de palabra. El mapa y la brújula se ocultan hasta que llegues.</p><p><b>'+L[i][1]+'</b></p>',[['¡Allá voy!',()=>{}],['Mejor no',()=>korEnd(false)]]);}
function korEnd(ok){const z=kz();if(!z.or)return;const s=Math.round((performance.now()-z.or.t0)/1000);z.or=null;save();document.body.classList.remove('kOrient');if(ok)cyPay(s<240?5:3,'Has llegado sin mapa en '+Math.floor(s/60)+' min '+(s%60)+' s');}
function korTick(){const z=kz();if(!z.or)return;document.body.classList.add('kOrient');const L=KOR[kRo()?'roma':'atenas'],P=kPlace(L[z.or.i][0]);if(P&&Math.hypot(P.x-player.x,P.z-player.z)<40)korEnd(true);}
{const s=document.createElement('style');s.textContent='body.kOrient #mini,body.kOrient #compass{visibility:hidden!important}';document.head.appendChild(s);}
// ---------------------------------------------------------------- K9 debates
const KD={atenas:[
  {id:'paz',p:'¿Aceptamos la paz que propone el Rey de Persia?',a:['Calias: «Llevamos años de guerra; la paz nos deja reconstruir los Muros Largos y la flota.»','Trasibulo el joven: «¡Entregar las ciudades griegas de Asia al Gran Rey es una vergüenza!»','Un campesino: «Mientras haya guerra, los espartanos queman mis olivos.»'],o:['Aceptar la paz','Rechazarla'],r:'En 387/386 Atenas aceptó la Paz del Rey (o de Antálcidas): las ciudades griegas de Asia quedaron para Persia y las demás, «autónomas» (Jenofonte, Helénicas V 1,31).'},
  {id:'misthos',p:'¿Subimos a tres óbolos la paga por venir a la asamblea?',a:['Agirrio: «Si no pagamos, los pobres no pueden dejar su trabajo para votar.»','Un rico: «¡Pagar por votar! Así vienen por el dinero, no por la ciudad.»','Un zapatero: «Tres óbolos es medio jornal: sin ellos no vendría.»'],o:['Sí, tres óbolos','No, sin paga'],r:'Hacia el 393-390 se introdujo la paga por asistir y Agirrio la subió a tres óbolos (Aristóteles, Const. 41,3). Aristófanes se burla de ello en Las asambleístas.'}],
 roma:[
  {id:'campania',p:'¿Ayudamos a las ciudades de Campania arrasadas por el Vesubio?',a:['Un senador: «Pompeya y Herculano han desaparecido: hay miles de refugiados.»','Otro: «El tesoro está vacío tras el incendio de Roma.»','El emperador Tito: «Usaremos los bienes de los muertos sin herederos para reconstruir.»'],o:['Sí, ayudar','No'],r:'Tito envió a dos excónsules como curatores para reorganizar Campania y destinó a ello los bienes de quienes murieron sin herederos (Suetonio, Tito 8,3-4).'},
  {id:'divo',p:'¿Declaramos dios (divus) al difunto emperador Vespasiano?',a:['Un senador: «Restauró el Estado tras la guerra civil.»','Otro: «Él mismo bromeaba: “Ay, creo que me estoy convirtiendo en dios”.»','Tito: «Su templo se levantará en el Foro.»'],o:['Sí, divus Vespasianus','No'],r:'El Senado lo divinizó en el 79 y se empezó su templo junto al Tabulario (Suetonio, Vespasiano 23,4).'}]};
function kdbOpen(){const z=kz(),L=KD[kRo()?'roma':'atenas'],D=L.find(d=>!z.deb[d.id])||L[Math.floor(Math.random()*L.length)];
  jmDlg(kRo()?'S':'Δ',kRo()?'La Curia':'La Pnyx',D.p,'<p>'+D.a.map(a=>'· '+a).join('<br>')+'</p><p class="sub">Escucha y vota.</p>',D.o.map(o=>[o,()=>{z.deb[D.id]=o;save();if(!z.deb['_p'+D.id]){z.deb['_p'+D.id]=1;cyPay(2,'Has votado');}jmSay('<p>Has votado: <b>'+o+'</b>.</p><p><b>Lo que pasó de verdad:</b> '+D.r+'</p>');}]));}
// ---------------------------------------------------------------- K10 retos por equipos (en línea)
const KR=[['templos','Visitad tres templos',/templo|temple|partenon|vesta|hefest|jupiter|castor|saturno/],['fuentes','Encontrad tres fuentes',/krene|fuente|lacus|ninfeo/],['mercado','Id al mercado y al teatro',/mercado|macellum|teatro|marcelo/]];
const KRS={id:null,vis:{},team:'A',el:null};
function krOpen(){if(typeof NET==='undefined'||!NET.room){toast('<span class="label">Retos por equipos</span><br>Funcionan en el modo en línea: entra en una sala con tus compañeros (menú → En línea).');return;}
  jmDlg('⚑','Retos por equipos','Elige reto y equipo','<p>El reto que lances lo verán todos los de la sala. Cada sitio distinto que visitéis suma un punto a vuestro equipo.</p>',KR.map(r=>['Lanzar: '+r[1],()=>{KRS.id=r[0];KRS.vis={};KRS.t0=Date.now();netPresence(true);}]).concat(['A','B','C'].map(t=>['Mi equipo: '+t,()=>{KRS.team=t;netPresence(true);}])));}
function krTick(){if(typeof NET==='undefined'||!NET.room)return;try{for(const p of NET.room.peers()){const r=p.presence&&p.presence.kr;if(r&&r.id&&r.t0>(KRS.t0||0)){KRS.id=r.id;KRS.t0=r.t0;KRS.vis={};toast('<span class="label">¡Nuevo reto!</span><br>'+(KR.find(x=>x[0]===r.id)||['',''])[1]);}}}catch(e){}
  const R=KR.find(x=>x[0]===KRS.id);if(!R)return;for(const p of PLACES){if(!R[2].test(p.id+' '+p.name)||KRS.vis[p.id])continue;if(Math.hypot(p.x-player.x,p.z-player.z)<35){KRS.vis[p.id]=1;toast('<span class="label">Reto</span><br>+1 para el equipo '+KRS.team+': '+p.name);netPresence(true);}}
  if(!KRS.el){const d=document.createElement('div');d.style.cssText='position:fixed;right:16px;top:300px;z-index:20;background:rgba(26,20,14,.8);color:#f3e6c8;border:1px solid #c9a64a;border-radius:8px;padding:6px 10px;font:13px/1.4 var(--text,system-ui)';document.body.appendChild(d);KRS.el=d;}
  const sc={};sc[KRS.team]=(sc[KRS.team]||0)+Object.keys(KRS.vis).length;try{for(const p of NET.room.peers()){if(p.sameTab)continue;const k=p.presence&&p.presence.kr;if(k&&k.id===KRS.id)sc[k.tm||'A']=(sc[k.tm||'A']||0)+(+k.n||0);}}catch(e){}
  KRS.el.innerHTML='<b>'+R[1]+'</b><br>'+Object.keys(sc).sort().map(t=>'Equipo '+t+': '+sc[t]).join('<br>');}
{const f=netPresence;netPresence=function(force){try{if(typeof NET!=='undefined')NET.kr=KRS.id?{id:KRS.id,t0:KRS.t0,tm:KRS.team,n:Object.keys(KRS.vis).length}:null;}catch(e){}return f.apply(this,arguments);};}
// ---------------------------------------------------------------- dónde está cada cosa
function kSpots(){if(K2.spots||!state||typeof PLACES==='undefined'||PLACES.length<20)return;K2.spots=true;const ro=kRo();
  kSpot(ro?/foro/:/agora/,-16,12,()=>kjStart(),'Acompañar a alguien','una jornada de la época');
  kSpot(ro?/basilica_julia|basílica/:/heliea|tribunal/,6,-6,()=>kcStart(),'Un caso por resolver','el tribunal');
  const o=kz().obra;if(!o.x){const P=kPlace(ro?/subura/:/demo_|kerameis|ceramico/)||kPlace(ro?/foro/:/agora/);if(P){const f=findFree(P.x+18,P.z-10,2.5);o.x=f[0];o.z=f[1];}}
  if(o.x){egxObj(o.x,o.z,undefined,()=>koOpen(),o.done?'Tu fuente':'Una fuente por construir',o.done?'pagada por ti':'obra pública',3);koBuild(false);}
  kSpot(ro?/foro/:/agora/,14,-16,()=>korStart(),'Un reto de orientación','sin mapa ni brújula');
  kSpot(ro?/curia/:/pnyx/,4,8,()=>kdbOpen(),ro?'Sesión del Senado':'La asamblea','escucha y vota');
  kSpot(ro?/foro/:/agora/,-10,-18,()=>krOpen(),'Retos por equipos','en línea');}
{const f=uxTick;uxTick=function(dt){f(dt);if(!state||ui==='start')return;const now=performance.now();if(now-K2.t<1000)return;K2.t=now;
  try{kSpots();kjTick();kExTick();kCitaTick();korTick();krTick();}catch(e){if(!K2.err){K2.err=String(e&&e.stack||e).slice(0,300);console.warn('jugar mas 2',e);}}};}
