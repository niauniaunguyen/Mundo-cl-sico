// ============================================================ juicio en la Heliea
let trial=null;
function startTrial(){
  $('dialog').hidden=true;dlg=null;
  const H=TRIAL_H,extras=[];
  const mkP=(look,x,z,rot,y)=>{const p=makePerson(look);p.position.set(x,(y!==undefined?y:terrainH(x,z)),z);p.rotation.y=rot;scene.add(p);extras.push(p);return p;};
  for(let i=0;i<34;i++){const row=i%5,k=Math.floor(i/5);const x=H.x-9+k*2.2+R()*0.6,z=H.z-8+row*3.2;
    mkP({chiton:pick(['#e8dfcc','#d7c9ab','#efe6d5','#c9b48b']),himation:pick(['#7a5a3a','#4f6a7d','#8a3f2f','#5c6b3f','#a07a3a']),beard:R()<0.85,hair:pick(['#2b1f17','#5b4532','#8d8a85','#cfcfc8'])},x,z,-Math.PI/2,terrainH(x,z)-0.35);}
  const spk={
    her:mkP({chiton:'#efe6d5',himation:'#3f5d6e',beard:true,hair:'#4a3a2c',staff:true},H.x-11.5,H.z+5,Math.PI/2),
    acc:mkP({chiton:'#f1ebdd',himation:'#7a3f3a',beard:true,hair:'#5a4636'},H.x-11.5,H.z-1.8,Math.PI/2),
    def:mkP({chiton:'#b9a27a',himation:'#6b5a40',beard:true,hair:'#2e2018'},H.x-11.5,H.z+1.8,Math.PI/2)};
  for(const k in spk){const m=markerSprite();m.position.y=2.6;m.visible=false;spk[k].add(m);spk[k].userData.mk=m;}
  const cl=new THREE.Mesh(PGEO.jar,lam('#a8532f'));cl.scale.setScalar(1.6);cl.position.set(H.x-9.6,terrainH(H.x-10,H.z)+1.2,H.z);scene.add(cl);extras.push(cl);
  trial={i:0,extras,spk,saved:{x:player.x,z:player.z,yaw:player.yaw,pitch:player.pitch}};
  player.x=H.x+8;player.z=H.z;player.feet=floorAt(player.x,player.z);player.camY=player.feet+player.eye;player.yaw=Math.PI/2;player.pitch=-0.04;
  ui='dialog';releasePointer();$('dialog').hidden=false;trialRender();
}
function trialRender(){
  const st=TRIAL_STEPS[trial.i];
  $('dGlyph').textContent=st.glyph;setName(st.who,true);$('dTitle').textContent=st.title;$('dBody').innerHTML='<p>'+st.t+'</p>';
  for(const k in trial.spk)trial.spk[k].userData.mk.visible=(k===st.sp);
  const o=$('dOpts');o.innerHTML='';let n=1;
  const add=(txt,fn,cls)=>{const b=document.createElement('button');if(cls)b.className=cls;b.innerHTML='<span class="n">'+(n++)+'</span><span>'+txt+'</span>';b.onclick=fn;o.appendChild(b);};
  if(st.vote){add('Ficha que condena (eje hueco)',()=>trialVote(true),'quiz');add('Ficha que absuelve (eje macizo)',()=>trialVote(false),'quiz');}
  else add('Continuar',()=>{trial.i++;trialRender();});
  if(trial.i>0)add('Volver a escuchar lo anterior',()=>{trial.i--;trialRender();});
  add('Salir del tribunal',closeDialog);
  setTimeout(()=>{const b=o.querySelector('button');b&&b.focus({preventScroll:true});},30);
}
function trialVote(condemn){
  const others=500,share=0.42+R()*0.22;let c=Math.round(others*share)+(condemn?1:0);const a=501-c;
  const pc=Math.round(c/501*100);
  for(const k in trial.spk)trial.spk[k].userData.mk.visible=false;
  $('dGlyph').textContent='Ψ';setName('Recuento de votos');$('dTitle').textContent='Tu ficha: '+(condemn?'condenar':'absolver');
  $('dBody').innerHTML='<div class="tally" role="img" aria-label="'+c+' votos para condenar y '+a+' para absolver"><span style="width:'+pc+'%;background:#c4553d">'+c+' condenan</span><span style="width:'+(100-pc)+'%;background:#9aa865">'+a+' absuelven</span></div>'+
    '<p><b>'+(c>a?'Los vendedores de trigo son condenados.':'Los vendedores de trigo son absueltos.')+'</b> Este resultado es una simulación: <b>no sabemos cómo terminó el juicio real</b>. Solo se conserva el discurso de la acusación, escrito por Lisias hacia el 386 (discurso 22).</p>'+
    '<p>Lo que el caso muestra es muy real: Atenas dependía del trigo importado, los comerciantes eran metecos sin derechos políticos y la ira popular estuvo a punto de saltarse el procedimiento, porque parte del Consejo quería ejecutarlos sin juicio. Las fuentes están en la Biblioteca (B).</p>';
  if(!state.lessons.includes('juicio')){state.lessons.push('juicio');qAdd('lo',3,'Haber juzgado te enseña a pesar las palabras.');state.obols+=3;save();updateStats();sfxCoin();toast('<span class="label">Lección aprendida</span><br>'+LESSONS.juicio.title+' · +3 óbolos');}
  const mk=npcObjs.find(o=>o.data.id==='dicasta');if(mk)mk.mk.visible=!npcDone(mk.data);
  const o=$('dOpts');o.innerHTML='';const b=document.createElement('button');b.innerHTML='<span class="n">1</span><span>Salir del tribunal</span>';b.onclick=()=>{closeDialog();if(state.lessons.length>=Object.keys(LESSONS).length&&!state.done){state.done=true;save();setTimeout(showEnd,500);}};o.appendChild(b);b.focus({preventScroll:true});
}
function endTrial(){const t=trial;trial=null;t.extras.forEach(p=>scene.remove(p));player.x=TRIAL_H.x+20;player.z=TRIAL_H.z;player.feet=floorAt(player.x,player.z);player.camY=player.feet+player.eye;player.yaw=-Math.PI/2;player.pitch=0;}

