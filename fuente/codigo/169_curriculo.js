// ============================================================ CURRÍCULO: qué saberes trabaja cada lección (relación orientativa)
// Cada lección tiene una categoría (Política, Sociedad, Mitos…). Aquí se relaciona con los grandes bloques de saberes de la ESO
// (LOMLOE): Geografía e Historia, y Cultura Clásica, Latín y Griego. No son códigos oficiales: es una guía para que el docente vea
// qué ha trabajado cada alumno. Sale en el informe del alumno y en el Panel de clase (por alumno y para toda la clase).
const CUR_S={
 gh_poder:['Geografía e Historia','Formas de gobierno y ciudadanía','la polis y la democracia; la República y el Imperio; quién participa y quién no'],
 gh_soc:['Geografía e Historia','Sociedad, economía y vida cotidiana','libres y esclavos, mujeres, trabajo, comercio, educación, la casa'],
 gh_hist:['Geografía e Historia','Hechos y procesos históricos','guerras, expansión, colonias, el territorio y sus cambios'],
 gh_pat:['Geografía e Historia','Arte y patrimonio','templos, escultura, urbanismo; cómo se conserva y se estudia'],
 cc_mito:['Cultura Clásica, Latín y Griego','Mitología y religión','dioses, héroes, ritos, oráculos y fiestas'],
 cc_pens:['Cultura Clásica, Latín y Griego','Pensamiento y ciencia','filosofía, medicina, astronomía, técnica'],
 cc_leg:['Cultura Clásica, Latín y Griego','Legado clásico','instituciones, palabras, arte e ideas que han llegado hasta hoy']};
// los nombres van como valores (no como claves) para que se traduzcan igual que la categoría de las lecciones en catalán e inglés
const CUR_CAT=Object.fromEntries([['Política',['gh_poder','cc_leg']],['Guerra',['gh_hist','gh_poder']],['Historia',['gh_hist']],['Geografía',['gh_hist']],['Sociedad',['gh_soc']],['Economía',['gh_soc']],['Vida cotidiana',['gh_soc']],['Técnica',['gh_soc','cc_pens']],['Educación',['gh_soc','cc_leg']],['Arte',['gh_pat','cc_leg']],['Cultura',['gh_pat','cc_leg']],['Religión',['cc_mito']],['Mitos',['cc_mito']],['Mito',['cc_mito']],['Mitología',['cc_mito']],['Genealogías',['cc_mito']],['Filosofía',['cc_pens']],['Ciencia',['cc_pens']],['Naturaleza',['cc_pens']]]);
function curOf(ids){const n={};for(const id of ids||[]){const L=LESSONS[id];if(!L)continue;for(const k of CUR_CAT[L.cat]||[])n[k]=(n[k]||0)+1;}return n;}
function curAll(){const n={};for(const id in LESSONS){const L=LESSONS[id];for(const k of CUR_CAT[L.cat]||[])n[k]=(n[k]||0)+1;}return n;}
// informe del alumno
{const f=dzReport;dzReport=function(){const r=f();try{const n=curOf(state.lessons),T=curAll();const L=['','Relación orientativa con el currículo (lecciones superadas / disponibles):'];
  for(const k in CUR_S)if(T[k])L.push('  '+CUR_S[k][0]+' · '+CUR_S[k][1]+': '+(n[k]||0)+' / '+T[k]);
  const i=r.indexOf('--- datos para el panel');return i>=0?r.slice(0,i)+L.join('\n')+'\n\n'+r.slice(i):r+L.join('\n');}catch(e){return r;}};}
{const f=pdData;pdData=function(){const d=f();try{d.cur=curOf(state.lessons);d.curT=curAll();}catch(e){}return d;};}
// Panel de clase: tabla por saberes
{const f=pdRender;pdRender=function(){f();try{const O=$('pdOut'),R=PD.rows;if(!O||!R.length)return;
  const keys=Object.keys(CUR_S).filter(k=>R.some(r=>r.curT&&r.curT[k]));if(!keys.length)return;
  const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const cell=(r,k)=>{const a=(r.cur&&r.cur[k])||0,t=(r.curT&&r.curT[k])||0;if(!t)return '—';const p=a/t;return '<span title="'+a+' de '+t+'" style="display:inline-block;min-width:3.2em;padding:1px 4px;border-radius:4px;background:rgba(201,138,74,'+(0.12+p*0.7).toFixed(2)+')">'+a+'/'+t+'</span>';};
  let h='<h3 style="margin-top:18px">Por saberes del currículo</h3><p class="sub">Relación orientativa entre las categorías de las lecciones y los bloques de saberes de la ESO (Geografía e Historia; Cultura Clásica, Latín y Griego). No son códigos oficiales. Cuanto más intenso el color, más lecciones superadas de ese bloque.</p>'+
    '<div style="overflow:auto"><table style="border-collapse:collapse;width:100%;font-size:.88em"><tr><th style="text-align:left;padding:4px;border-bottom:1px solid #6a4a30">Alumno</th>'+keys.map(k=>'<th style="text-align:left;padding:4px;border-bottom:1px solid #6a4a30" title="'+esc(CUR_S[k][2])+'">'+esc(CUR_S[k][1])+'<br><span class="sub" style="font-weight:normal">'+esc(CUR_S[k][0])+'</span></th>').join('')+'</tr>'+
    R.map(r=>'<tr><td style="padding:4px;border-bottom:1px solid #3a2a1e">'+esc(r.nombre)+'</td>'+keys.map(k=>'<td style="padding:4px;border-bottom:1px solid #3a2a1e">'+cell(r,k)+'</td>').join('')+'</tr>').join('')+'</table></div>';
  // lo menos trabajado por la clase
  const share=k=>{let a=0,t=0;for(const r of R){a+=(r.cur&&r.cur[k])||0;t+=(r.curT&&r.curT[k])||0;}return t?a/t:1;};const low=keys.slice().sort((a,b)=>share(a)-share(b)).slice(0,2);
  h+='<p><b>Lo menos trabajado por la clase:</b> '+low.map(k=>esc(CUR_S[k][1])+' ('+Math.round(share(k)*100)+'%)').join(' · ')+'. En Aprender › Rutas por temas hay recorridos guiados para reforzarlo.</p>';
  O.insertAdjacentHTML('beforeend',h);}catch(e){}};}
