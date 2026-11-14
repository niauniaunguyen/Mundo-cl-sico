// QA automático: recorre personajes, estelas, dioses, objetos, Musas, biblioteca, destinos, esferas e historia
module.exports=async(p,P,shot)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));
 await p.evaluate(()=>{const s=__d.state;s.pj={name:'Nía',g:'f',o:'quios'};s.tut=1;});await p.evaluate(()=>__d.startGame());await W(2500);
 const sections=['npc','sign','god','egx','muse','lib','isl','sphere','story','misc'];
 for(const sec of sections){
  const r=await p.evaluate(async sec=>{const Q=window.__d.QA(),I=[],BAD=/undefined|NaN|\[object |\bnull\b|function\s*\(|<\/?[a-z]+[^>]*$/;
   const D=()=>document.getElementById('dialog'),body=()=>document.getElementById('dBody').innerText,btns=()=>[...document.querySelectorAll('#dOpts button')];
   const chk=(where)=>{const t=body()+' '+document.getElementById('dName').innerText+' '+document.getElementById('dTitle').innerText;if(BAD.test(t))I.push(where+': texto raro → '+(t.match(BAD)||[''])[0]+' … '+t.slice(0,90));if(D().hidden)I.push(where+': el diálogo no se ve');if(!body().trim())I.push(where+': cuerpo vacío');};
   const reset=()=>{try{Q.closeDialog();}catch(e){}D().hidden=true;window.__d.setUi('play');};
   const T=(where,fn)=>{try{fn();}catch(e){I.push(where+': ERROR '+e.message);}};
   if(sec==='npc'){for(const o of Q.npcObjs){const n=o.data;T('npc '+n.id,()=>{Q.state.seen=Q.state.seen||{};window.__d.openDialog(n);chk('npc '+n.id);
      const k=btns().length;for(let i=0;i<Math.min(k,14);i++){const b=btns()[i];if(!b)break;const tx=b.innerText;if(/Despedirse|Cerrar|Volver a la/i.test(tx))continue;if(b.className.includes('quiz')&&/lección|Responder|Pregunta|examen|carrera|caverna|Llévame|Cerrar los ojos|juegos|caso/i.test(tx))continue;
        T('npc '+n.id+' «'+tx.slice(0,30)+'»',()=>{b.click();chk('npc '+n.id+' «'+tx.replace(/\n/g,' ').slice(0,30)+'»');window.__d.openDialog(n);});}});reset();}}
   if(sec==='sign'){for(const s of Q.signObjs){T('estela '+(s.data&&s.data.id),()=>{Q.readSign(s);chk('estela '+s.data.id);});reset();}
     const ids={};for(const pl of Q.PLACES){if(ids[pl.id])I.push('estela duplicada: '+pl.id);ids[pl.id]=1;if(!isFinite(pl.x)||!isFinite(pl.z))I.push('estela con posición NaN: '+pl.id);}}
   if(sec==='god'){for(const g of Q.godObjs){T('dios '+g.data.id,()=>{Q.openGod(g);chk('dios '+g.data.id);for(const b of btns().slice(0,3)){b.click();chk('dios '+g.data.id+' tema');}});reset();}}
   if(sec==='egx'){for(const o of Q.EGX_OBJS){if(!isFinite(o.x)||!isFinite(o.z)){I.push('objeto NaN '+o.act);continue;}T('objeto '+o.act,()=>{window.__d.egxAct(o);if(window.__d.QA().state&&document.getElementById('race3d')&&!document.getElementById('race3d').hidden)return;if(!document.getElementById('mg'))chk('objeto '+o.act);});
     const mg=document.getElementById('mg');if(mg)mg.remove();reset();}}
   if(sec==='muse'){for(const m of Q.MUSE_OBJS){T('musa '+m.m.id,()=>{Q.museTalk(m);chk('musa '+m.m.id);});reset();}}
   if(sec==='lib'){for(const e of Q.ESSAYS){T('ensayo '+e.id,()=>{Q.openLibrary('e:'+e.id);const L=document.getElementById('library')||document.querySelector('.lib');const t=(document.querySelector('#lib, #library, .library')||document.body).innerText;if(BAD.test(t.slice(0,5000)))I.push('ensayo '+e.id+': texto raro '+(t.match(BAD)||[''])[0]);});}
     try{const l=document.querySelector('#library');if(l)l.hidden=true;}catch(e){}reset();}
   if(sec==='isl'){for(const isl of Q.ISLANDS){const PT=window.__d.PORTS||{},a=isl.arrive||isl.town||PT[isl.id+'_n']||PT[isl.id];if(!a){I.push('destino sin llegada: '+isl.id);continue;}   // los destinos marítimos antiguos (Delos, Creta, Lesbos, Troya) llegan por su puertoconst h=Q.floorAt(a.x,a.z);if(!isFinite(h))I.push('destino '+isl.id+': suelo NaN');else if(h<-0.5)I.push('destino '+isl.id+': la llegada está bajo el agua ('+h.toFixed(1)+')');
     if(isl.town){const h2=Q.floorAt(isl.town.x,isl.town.z);if(h2<-0.5)I.push('destino '+isl.id+': el pueblo está bajo el agua');}}}
   if(sec==='sphere'){for(const s of Q.EPI.spheres){T('esfera '+s.data.id,()=>{Q.epiStart(s.data);Q.epiEnd&&Q.epiEnd();});reset();}}
   if(sec==='story'){T('historia',()=>{Q.startStory();});let guard=0,lastCh=-1;const st=()=>Q.state.story;
     while(guard++<900&&Q.state.story&&!Q.state.story.fin){const b=btns();if(!D().hidden&&b.length){chk('historia cap '+(st().ch+1)+' paso '+st().st);const c=b.find(x=>!/Volver|Repetir/.test(x.innerText))||b[0];try{c.click();}catch(e){I.push('historia: ERROR '+e.message);break;}continue;}
       const s=Q.curStoryStep();if(!s){break;}try{Q.storyFire();}catch(e){I.push('historia cap '+(st().ch+1)+': ERROR '+e.message);break;}
       if(D().hidden&&!btns().length){I.push('historia cap '+(st().ch+1)+' paso '+st().st+': no avanza');break;}}
     I.push('INFO historia: capítulo '+(Q.state.story?Q.state.story.ch+1:'?')+', paso '+(Q.state.story?Q.state.story.st:'?')+', vueltas '+guard);reset();}
   if(sec==='misc'){T('menú',()=>{Q.gmOpen();Q.gmClose();});T('mapa',()=>{Q.openMap();});reset();
     const near={};for(const s of Q.signObjs){const k=Math.round(s.x/3)+','+Math.round(s.z/3);if(near[k])I.push('estelas superpuestas: '+near[k]+' y '+s.data.id);near[k]=s.data.id;}}
   return I;},sec);
  console.log('## '+sec+' ('+r.length+')');for(const l of r.slice(0,80))console.log(' - '+l);if(r.length>80)console.log(' … y '+(r.length-80)+' más');}
};
