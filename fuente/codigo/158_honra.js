// ============================================================ LA HONRA (timḗ / dignitas): el hilo que une todo lo que haces
// Lo que haces suma honra: lecciones, lugares, sueños, cartas, votos y sesiones, el taller, las lecciones de la diosa y tus cualidades.
// Se calcula a partir de lo ya hecho (también en partidas antiguas). Cada escalón es un honor real de la época, con su ceremonia y su fuente.
// Atenas (eres forastero): de xénos a ciudadano por decreto, como el banquero Pasión. Roma (peregrino): de recién llegado a caballero con anillo de oro.
const HON_R={
 atenas:[[0,'Xénos recién llegado','Nadie te conoce todavía.'],
  [15,'Conocido en el Ágora','En las tiendas y en la fuente ya saben tu nombre.','<p>En el Ágora te saludan por tu nombre. Un barbero comenta tus andanzas: en Atenas, las barberías son el lugar donde corren las noticias.</p>','Lisias XXIV 20 (las tertulias en barberías y tiendas).'],
  [40,'Elogio del Consejo','El Consejo de los Quinientos te ha elogiado públicamente.','<p>El heraldo lee en el Buleuterio un <b>elogio</b> (<i>épainos</i>) a tu nombre: «por su buena disposición hacia el pueblo de los atenienses». Es el primer honor que la ciudad da a un extranjero.</p>','Fórmula habitual de los decretos honoríficos (IG II², siglo IV a.C.).'],
  [80,'Isotéleia','Pagas los impuestos como un ciudadano: ya no el impuesto de los metecos.','<p>La Asamblea te concede la <b>isotéleia</b>: dejas de pagar el <i>metoíkion</i>, el impuesto anual de los metecos, y contribuyes como un ciudadano. Muy pocos extranjeros la consiguen.</p>','Aristóteles, Const. de los atenienses 58, 2-3; Harpocración, s.v. «isotelés».'],
  [130,'Corona de olivo y estela','Tu nombre está grabado en una estela en la Acrópolis.','<p>Por decreto del pueblo te coronan con una corona de olivo y tu decreto se graba en una <b>estela de mármol</b> en la Acrópolis, a la vista de todos.</p>','Decretos honoríficos de la Acrópolis (IG II²); Demóstenes XVIII 120 (la corona proclamada).'],
  [200,'Ciudadano por decreto','La Asamblea te ha hecho ciudadano de Atenas.','<p>En dos asambleas seguidas, y la segunda con al menos seis mil votos secretos, el pueblo te concede la <b>ciudadanía</b>. Lo consiguió muy poca gente: el banquero Pasión, que había sido esclavo, la obtuvo por sus regalos a la ciudad hacia el 376.</p>','[Demóstenes] LIX 88-92 (el procedimiento); Demóstenes XLV 85 (Pasión).']],
 roma:[[0,'Peregrino recién llegado','Nadie te conoce todavía.'],
  [15,'Conocido en el barrio','En tu vicus ya saben quién eres.','<p>Los vecinos de tu calle te saludan en el compitum, y el tabernero te fía el vino. En Roma, el barrio lo es todo.</p>','Juvenal III (la vida en el barrio); inscripciones de los vici.'],
  [40,'Cliente de una gran familia','Una familia noble te acepta entre sus clientes.','<p>Un senador te acepta entre sus <b>clientes</b>: le acompañarás en la <i>salutatio</i> y él te protegerá en los pleitos. Sin un patrono, en Roma no eres nadie.</p>','Marcial III 7; Séneca, Sobre los beneficios VI 34.'],
  [80,'Ciudadano romano','El emperador te ha concedido la ciudadanía.','<p>Por intercesión de tu patrono, el emperador Tito te concede la <b>ciudadanía romana</b>: tomas su nombre de familia, Flavio, como hicieron miles de provinciales en estos años.</p>','Plinio el Joven, Cartas X 5-7 (peticiones de ciudadanía al emperador); diplomas militares.'],
  [130,'Magistrado del barrio','Te eligen para cuidar el altar de los Lares de tu vicus.','<p>Los vecinos te eligen <b>vicomagister</b>: cuidarás el altar de los Lares y del Genio de Augusto, organizarás las Compitalia y llevarás la toga praetexta en las fiestas.</p>','Suetonio, Augusto 30; inscripciones de vicomagistri (CIL VI).'],
  [200,'Anillo de oro: caballero','El emperador te concede el anillo de oro del orden ecuestre.','<p>El emperador te concede el <b>anillo de oro</b> y te inscribe en el orden ecuestre. Normalmente hacían falta 400.000 sestercios; el emperador podía saltarse la norma, y lo hizo con libertos y amigos.</p>','Suetonio, Galba 14 y Vitelio 12 (anillos concedidos por el emperador); Plinio, Historia natural XXXIII 32-33.']]};
function honz(){if(!state.hon||typeof state.hon!=='object')state.hon={r:0};return state.hon;}
function honParts(){const s=state,P=[];const dream=Object.keys(s.seen||{}).filter(k=>k.startsWith('ep:')&&!k.startsWith('ep:am_')).length;
  let am=0,cartas=0,votes=0,tal=0,ql=0;try{am=Object.keys(amz().seen).length;}catch(e){}try{cartas=dzz().cartas||0;}catch(e){}try{votes=asz().votes||0;}catch(e){}try{tal=ttz2().done?1:0;}catch(e){}
  try{for(const q of QUAL)ql+=qLv(q.k)-1;}catch(e){}
  P.push(['Lecciones superadas',(s.lessons||[]).length,3],['Lugares descubiertos',(s.places||[]).length,1],['Sueños vividos',dream,2],['Lecciones de '+(MODE==='roma'?'Minerva':'Atenea'),am,2],
    ['Cartas entregadas',cartas,3],[MODE==='roma'?'Sesiones del Senado':'Asambleas',votes,3],['Taller del templo',tal,4],['Niveles de cualidades',ql,2]);return P;}
function honScore(){return honParts().reduce((a,p)=>a+p[1]*p[2],0);}
function honList(){return HON_R[MODE==='roma'?'roma':'atenas'];}
function honRank(sc){const L=honList();let r=0;for(let i=0;i<L.length;i++)if(sc>=L[i][0])r=i;return r;}
function honTitle(){return honList()[honz().r||0][1];}
function honCheck(){const z=honz(),sc=honScore(),r=honRank(sc);if(r<=(z.r||0))return;
  let gift=0;for(let k=(z.r||0)+1;k<=r;k++)gift+=k*5;state.obols+=gift;
  const R=honList()[r];z.r=r;save();updateStats();try{qAdd('kl',2,'Honra: '+R[1]);}catch(e){}try{sfxCoin();}catch(e){}
  const show=()=>{if(ui!=='play'){setTimeout(show,1500);return;}vmS(MODE==='roma'?'✦':'✦','La honra',R[1],R[3]+'<p class="sub">Fuente: '+R[4]+' · +'+gift+' '+(MODE==='roma'?'sestercios':'óbolos')+', +2 Kléos</p>'+(r<honList().length-1?'<p class="sub">Siguiente honor: <b>'+honList()[r+1][1]+'</b> ('+sc+'/'+honList()[r+1][0]+' de honra). Míralo en el diario › La honra.</p>':'<p class="sub">Has alcanzado el honor más alto.</p>'),[vmBye]);};
  setTimeout(show,800);}
function honPage(){const ro=MODE==='roma',sc=honScore(),L=honList(),r=honRank(sc),nx=L[r+1];
  let h='<p>'+(ro?'En Roma importa la <b>dignitas</b>: el prestigio que te da lo que haces por los demás.':'En Atenas importa la <b>timḗ</b>, la honra: lo que la ciudad reconoce de ti.')+' Todo lo que haces la aumenta.</p>';
  h+='<p style="font-size:1.15em">'+(ro?'Tu dignitas':'Tu honra')+': <b>'+sc+'</b> · '+L[r][1]+'</p>';
  if(nx){const p=Math.min(1,(sc-L[r][0])/(nx[0]-L[r][0]));h+='<div style="height:12px;background:#2a1e14;border:1px solid #6a4a30;border-radius:6px;overflow:hidden;margin:6px 0"><div style="height:100%;width:'+Math.round(p*100)+'%;background:#c98a4a"></div></div><p class="sub">Siguiente: <b>'+nx[1]+'</b> ('+nx[0]+') — '+nx[2]+'</p>';}
  h+='<h3 style="margin:14px 0 6px">De dónde sale</h3><table style="width:100%;border-collapse:collapse">'+honParts().map(p=>'<tr><td style="padding:3px 0">'+p[0]+'</td><td style="text-align:right">'+p[1]+' × '+p[2]+'</td><td style="text-align:right;width:3em"><b>'+p[1]*p[2]+'</b></td></tr>').join('')+'</table>';
  h+='<h3 style="margin:14px 0 6px">Los honores</h3>'+L.map((R,i)=>'<p style="margin:4px 0;opacity:'+(i<=r?1:0.55)+'">'+(i<=r?'✦':'·')+' <b>'+R[1]+'</b> <span class="sub">('+R[0]+')</span><br><span class="sub">'+R[2]+'</span></p>').join('');
  eduOverlay('honBox',ro?'La dignitas':'La honra',h);}
{const g0=gmRight;gmRight=function(d){g0(d);try{const g=d.querySelector('.gr');if(!g||GM.page)return;const two=g.querySelector('.two');if(two&&!two.querySelector('[data-hon]')){const b=document.createElement('button');b.dataset.hon='1';b.className='wide';
  b.innerHTML=gmIc('journal')+'<span class="t">'+(MODE==='roma'?'La dignitas':'La honra')+'</span><span class="k">'+honTitle()+' · '+honScore()+'</span>';b.onclick=()=>{gmClose();setTimeout(honPage,80);};two.insertBefore(b,two.firstChild);}}catch(e){}};}
// el título aparece en el informe del docente y en el saludo de algunos personajes
{const f=dzReport;dzReport=function(){return f()+'\n'+(MODE==='roma'?'Dignitas':'Honra')+': '+honScore()+' · '+honTitle();};}
{let t=0;const f=uxTick;uxTick=function(dt){f(dt);t+=dt;if(t<4||!state||ui==='start')return;t=0;try{honCheck();}catch(e){}};}
