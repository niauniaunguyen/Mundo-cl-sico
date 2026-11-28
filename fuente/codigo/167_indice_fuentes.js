// ============================================================ BIBLIOTECA: ÍNDICE DE FUENTES POR AUTOR
// Una sección nueva de la Biblioteca (B): cada autor antiguo citado en el juego, con sus fechas, las obras citadas y los artículos
// donde aparece. Lo más útil en clase: dice si el autor escribió ANTES del año del juego, EN su época o DESPUÉS (y cuánto),
// porque una fuente posterior cuenta lo que otros recordaban, no lo que vio.
// Fechas aproximadas (años: negativos = a.C.); son las habituales en los manuales.
const FI_AUTH=[
 ['Homero',/\bHomero|Ilíada|Odisea\b/,-750,-700,'poeta épico'],['Hesíodo',/\bHesíodo/,-720,-680,'poeta'],['Safo',/\bSafo\b/,-630,-570,'poeta'],
 ['Solón',/\bSolón\b(?=,|\s\d|\s\(fr)/,-640,-560,'legislador y poeta'],['Esquilo',/\bEsquilo/,-525,-456,'autor de tragedias'],['Píndaro',/\bPíndaro/,-518,-438,'poeta'],
 ['Baquílides',/\bBaquílides/,-518,-451,'poeta'],['Sófocles',/\bSófocles/,-497,-406,'autor de tragedias'],['Heródoto',/\bHeródoto/,-484,-425,'historiador'],
 ['Eurípides',/\bEurípides/,-480,-406,'autor de tragedias'],['Tucídides',/\bTucídides/,-460,-400,'historiador'],['Hipócrates',/\bHipócrates|corpus hipocrático/i,-460,-370,'médico'],
 ['Aristófanes',/\bAristófanes/,-446,-386,'autor de comedias'],['Lisias',/\bLisias\b/,-445,-380,'orador'],['Andócides',/\bAndócides/,-440,-390,'orador'],
 ['Isócrates',/\bIsócrates/,-436,-338,'orador'],['Jenofonte',/\bJenofonte/,-430,-354,'historiador'],['Platón',/\bPlatón,|\bPlatón\s\(|República\s\d|Banquete\s\d|Apología\s\d|Fedón\s\d|Leyes\s\d/,-427,-347,'filósofo'],
 ['Iseo',/\bIseo\b/,-420,-350,'orador'],['Esquines',/\bEsquines/,-389,-314,'orador'],['Demóstenes',/\bDemóstenes/,-384,-322,'orador'],
 ['Aristóteles',/\bAristóteles,|Constitución de los atenienses|Política\s\d|Ética a Nicómaco/,-384,-322,'filósofo'],['Teofrasto',/\bTeofrasto/,-371,-287,'filósofo'],
 ['Menandro',/\bMenandro/,-342,-290,'autor de comedias'],['Polibio',/\bPolibio/,-200,-118,'historiador'],['Catón',/\bCatón,|Sobre la agricultura/,-234,-149,'político y escritor'],
 ['Varrón',/\bVarrón/,-116,-27,'erudito'],['Cicerón',/\bCicerón/,-106,-43,'orador y político'],['César',/\bCésar, Guerra|Guerra de las Galias/,-100,-44,'general y escritor'],
 ['Diodoro',/\bDiodoro/,-90,-30,'historiador'],['Virgilio',/\bVirgilio|Eneida\s\d/,-70,-19,'poeta'],['Horacio',/\bHoracio/,-65,-8,'poeta'],['Vitruvio',/\bVitruvio/,-80,-15,'arquitecto'],
 ['Livio',/\bLivio\b|Tito Livio/,-59,17,'historiador'],['Dionisio de Halicarnaso',/Dionisio de Halicarnaso/,-60,-7,'historiador'],['Estrabón',/\bEstrabón/,-64,24,'geógrafo'],
 ['Ovidio',/\bOvidio/,-43,17,'poeta'],['Séneca',/\bSéneca/,-4,65,'filósofo'],['Columela',/\bColumela/,4,70,'agrónomo'],['Petronio',/\bPetronio/,27,66,'novelista'],
 ['Plinio el Viejo',/Plinio el Viejo|Plinio, Historia natural|Historia natural\s\d/,23,79,'naturalista'],['Flavio Josefo',/\bJosefo/,37,100,'historiador'],['Quintiliano',/\bQuintiliano/,35,100,'maestro de oratoria'],
 ['Marcial',/\bMarcial\b/,40,104,'poeta'],['Frontino',/\bFrontino/,40,103,'encargado de las aguas'],['Estacio',/\bEstacio/,45,96,'poeta'],['Plutarco',/\bPlutarco/,46,120,'biógrafo'],
 ['Juvenal',/\bJuvenal/,55,130,'poeta satírico'],['Tácito',/\bTácito/,56,120,'historiador'],['Plinio el Joven',/Plinio el Joven|Plinio, Cartas/,61,113,'abogado y escritor'],
 ['Suetonio',/\bSuetonio/,69,122,'biógrafo'],['Apolodoro',/\bApolodoro/,50,200,'mitógrafo (Biblioteca)'],['Luciano',/\bLuciano/,125,180,'escritor satírico'],
 ['Pausanias',/\bPausanias\b(?!,?\s(rey|el regente))/,110,180,'viajero y geógrafo'],['Aulo Gelio',/Aulo Gelio|Noches áticas/,125,180,'erudito'],['Festo',/\bFesto\b/,150,200,'gramático'],
 ['Galeno',/\bGaleno/,129,216,'médico'],['Pólux',/\bPólux,|Onomástico/,150,200,'gramático'],['Ateneo',/\bAteneo/,170,230,'erudito'],['Dion Casio',/Dion Casio|Dión Casio/,155,235,'historiador'],
 ['Diógenes Laercio',/Diógenes Laercio/,200,250,'biógrafo de filósofos'],['Historia Augusta',/Historia Augusta/,350,400,'colección de biografías'],['Macrobio',/\bMacrobio/,370,430,'erudito'],
 ['Isidoro',/\bIsidoro/,560,636,'obispo y enciclopedista']];
function fiYear(){return MODE==='roma'?80:-386;}
function fiY(y){return y<0?(-y)+' a.C.':y+' d.C.';}
function fiWhen(A){const Y=fiYear(),s=A[2],e=A[3];if(e<Y-20)return{k:'antes',t:'anterior: escribió '+(Y-e>0?'unos '+Math.round((Y-e)/10)*10+' años antes':'antes')};
  if(s>Y+5)return{k:'despues',t:'posterior: escribió unos '+Math.round((s-Y)/10)*10+' años después'};return{k:'epoca',t:'de la época del juego'};}
let FI=null,FI_BUSY=false;
function fiBuild(){if(FI&&FI.mode===MODE)return FI;FI_BUSY=true;const by=new Map();
  const ids=[];try{for(const sc of libSections())for(const it of sc.items)if(!it.id.startsWith('f:'))ids.push(it.id);}catch(e){}
  const scan=(txt,where)=>{if(!txt)return;for(let i=0;i<FI_AUTH.length;i++){const A=FI_AUTH[i];if(!A[1].test(txt))continue;let o=by.get(i);if(!o){o={items:new Set(),works:new Map(),other:0};by.set(i,o);}
      if(where)o.items.add(where);else o.other++;
      const re=new RegExp(A[0].replace(/ /g,'\\s')+',\\s*([A-ZÁÉÍÓÚ][^0-9;().,«»]{2,60}?)\\s*(?=[IVXL]+\\b|\\d)','g');let m;while((m=re.exec(txt))){const w=m[1].trim();o.works.set(w,(o.works.get(w)||0)+1);}}};
  for(const id of ids){try{scan(libPlain(id),id);}catch(e){}}
  // textos que no están en la Biblioteca: fichas del modo atención y temarios de Atenea/Minerva
  try{for(const k in ATX_DEF){const D=ATX_DEF[k];scan(D[2]+' '+D[3],null);}}catch(e){}
  try{for(const c in AM_TOPICS)for(const a in AM_TOPICS[c])for(const t of AM_TOPICS[c][a])scan(JSON.stringify(t),null);}catch(e){}
  FI_BUSY=false;FI={mode:MODE,by};return FI;}
function fiList(){const F=fiBuild();return[...F.by.keys()].sort((a,b)=>FI_AUTH[a][2]-FI_AUTH[b][2]);}
{const f=libSections;libSections=function(){const S=f();if(FI_BUSY)return S;try{const L=fiList();S.push({t:'Índice de fuentes',items:[{id:'f:guia',title:'Antes, durante o después: cómo leer las fuentes'}].concat(L.map(i=>({id:'f:'+i,title:FI_AUTH[i][0]})))});}catch(e){}return S;};}
{const f=libPlain;libPlain=function(id){if(!id.startsWith('f:'))return f(id);const v=id.slice(2);if(v==='guia')return 'fuentes antes durante después época posterior anterior';const A=FI_AUTH[+v];return A?A[0]+' '+A[4]+' fuente autor':'';};}
{const f=showArticle;showArticle=function(id){if(!id.startsWith('f:'))return f(id);libCur=id;const v=id.slice(2),F=fiBuild(),Y=fiYear();let h='<article>';
  if(v==='guia'){const L=fiList(),grp={antes:[],epoca:[],despues:[]};L.forEach(i=>grp[fiWhen(FI_AUTH[i]).k].push(i));
    h+='<span class="label">Índice de fuentes</span><h3>Antes, durante o después: cómo leer las fuentes</h3>'+
      '<p>El juego pasa en el '+fiY(Y)+', y cada dato viene de algún autor antiguo, pero no todos vivieron entonces. Quien escribe <b>en la época</b> pudo verlo o hablar con quien lo vio; quien escribe <b>después</b> cuenta lo que se recordaba o lo que leyó, a veces siglos más tarde, y puede equivocarse o adornarlo. Por eso, en el juego, lo que viene de una fuente posterior se marca.</p>'+
      '<p class="sub">Pregunta para pensar: ¿por qué un historiador que escribe trescientos años después puede saber algo que no cuenta nadie de la época? ¿Y por qué puede equivocarse?</p>';
    const row=i=>{const A=FI_AUTH[i],o=F.by.get(i);return '<button data-fi="'+i+'" style="display:block;width:100%;text-align:left;margin:3px 0">'+A[0]+' <span class="sub">('+fiY(A[2])+' – '+fiY(A[3])+', '+A[4]+') · '+(o.items.size+o.other)+' citas</span></button>';};
    h+='<h5>Anteriores al año del juego ('+grp.antes.length+')</h5>'+grp.antes.map(row).join('')+'<h5>De la época ('+grp.epoca.length+')</h5>'+grp.epoca.map(row).join('')+'<h5>Posteriores ('+grp.despues.length+')</h5>'+grp.despues.map(row).join('');}
  else{const i=+v,A=FI_AUTH[i],o=F.by.get(i)||{items:new Set(),works:new Map(),other:0},W=fiWhen(A);
    h+='<span class="label">Índice de fuentes · '+A[4]+'</span><h3>'+A[0]+'</h3><div class="meta">'+fiY(A[2])+' – '+fiY(A[3])+' · <b>'+W.t+'</b> (el juego pasa en el '+fiY(Y)+')</div>';
    if(o.works.size)h+='<h5>Obras citadas</h5><ul class="src">'+[...o.works].sort((a,b)=>b[1]-a[1]).map(([w,n])=>'<li>'+w+(n>1?' <span class="sub">('+n+')</span>':'')+'</li>').join('')+'</ul>';
    const its=[...o.items];h+='<h5>Dónde aparece en la Biblioteca ('+its.length+')</h5>'+(its.length?its.map(x=>{let t=x;try{for(const sc of libSections())for(const it of sc.items)if(it.id===x)t=it.title;}catch(e){}return '<button data-go="'+x+'" style="display:block;text-align:left;margin:3px 0">'+t+'</button>';}).join(''):'<p class="sub">En ningún artículo.</p>');
    if(o.other)h+='<p class="sub">Además, '+o.other+' '+(o.other===1?'cita':'citas')+' en las fichas del modo atención y en los temarios de '+(MODE==='roma'?'Minerva':'Atenea')+'.</p>';
    h+='<p><button data-go="f:guia">← Todas las fuentes</button></p>';}
  h+='</article>';$('libArt').innerHTML=h;$('libArt').scrollTop=0;
  $('libArt').querySelectorAll('[data-fi]').forEach(b=>b.onclick=()=>showArticle('f:'+b.dataset.fi));
  $('libArt').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showArticle(b.dataset.go));
  $('libList').querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',b.dataset.id===id?'true':'false'));};}
