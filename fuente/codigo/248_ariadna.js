// ============================================================ ARIADNA (vídeo 23/11: «me gustaría que se pudiera hablar con Ariadna; el modo atención no dice quién es»)
// En la entrada del laberinto del sueño de Cnosos. Ahora lleva su nombre encima y se puede hablar con ella (E).
// Fuentes: Plutarco, Teseo 19; Apolodoro, Epítome I 8-9; Catulo 64; Ovidio, Heroidas X y Metamorfosis VIII 172-182.
const ARI={o:null};
function ariObj(){const g=KNOS.ari;if(!g||!g.parent)return null;if(!ARI.o||ARI.o.g!==g){const lb=labelSprite('Ariadna','hija del rey Minos · personaje mítico',true);lb.position.y=2.45;lb.visible=false;g.add(lb);
    ARI.o={kind:'ariadna',g,lb,x:g.position.x,z:g.position.z,data:{name:'Ariadna',title:'hija del rey Minos'}};}return ARI.o;}
function ariTalk(){dlg={n:null};ui='dialog';releasePointer();$('dGlyph').textContent='Α';setName('Ariadna');$('dTitle').textContent='Hija de Minos y Pasífae · personaje mítico';
  const o=$('dOpts');o.innerHTML='';let k=1;const add=(t,fn)=>{const b=document.createElement('button');b.innerHTML='<span class="n">'+(k++)+'</span><span>'+t+'</span>';b.onclick=fn;o.appendChild(b);};
  const say=(h)=>{$('dBody').innerHTML=h;};
  say('<p>¡Chist! Que no te oigan los guardias de mi padre. Soy Ariadna, hija de Minos. Toma este ovillo: ata el cabo a la entrada y suéltalo a tu paso. El laberinto lo hizo Dédalo, y ni él mismo sabe ya salir sin ayuda.</p>');
  const Q=[['¿Por qué me ayudas?','<p>Porque cada nueve años llegan de Atenas siete muchachos y siete muchachas para el Minotauro, y estoy harta de ver barcos de velas negras. Plutarco cuenta que me enamoré de Teseo al verlo llegar, y que el ovillo fue idea de Dédalo.</p>'],
    ['¿Quién es el Minotauro?','<p>Mi medio hermano. Mi madre, Pasífae, lo tuvo de un toro que Poseidón envió a Minos. Lo llaman Asterión, «el estrellado». Mi padre lo encerró aquí dentro para que nadie lo viera.</p>'],
    ['¿Qué te pasará después?','<p>Dicen que me iré con Teseo y que me dejará dormida en la isla de Naxos. Allí me encontrará Dioniso, y mi corona de bodas acabará en el cielo: la Corona Boreal. Catulo y Ovidio escribirán mis quejas en la playa.</p><p class="sub">Catulo 64; Ovidio, Heroidas X; Metamorfosis VIII 172-182.</p>']];
  const menu=()=>{o.innerHTML='';k=1;for(const[q,a]of Q)add(q,()=>{say(a);menu();});add('Despedirse',closeDialog);};menu();
  $('dialog').hidden=false;setTimeout(()=>{const b=o.querySelector('button');b&&b.focus({preventScroll:true});},30);}
{const f=findFocus;findFocus=function(){const b=f.apply(this,arguments);try{const A=ariObj();if(A&&Math.abs(player.feet-KNOS.y)<6){const d=Math.hypot(A.x-player.x,A.z-player.z);A.lb.visible=d<12;
  if(d<3.2&&(!b||Math.hypot(b.x-player.x,b.z-player.z)>d))return A;}}catch(e){}return b;};}
{const f=interact;interact=function(){if(focus&&focus.kind==='ariadna'){try{gfPulse();}catch(e){}ariTalk();return;}return f.apply(this,arguments);};}
// en el modo atención, con su nombre (y también Dédalo)
{const f=atCands;atCands=function(){const C=f.apply(this,arguments);try{const A=ariObj();if(A&&A.g.visible)C.push({obj:A.g,x:A.x,y:A.g.position.y+1.4,z:A.z,r:0.9,name:'Ariadna',sub:'hija del rey Minos · personaje mítico',txt:()=>'La princesa que dio a Teseo el ovillo para salir del laberinto. Acércate y pulsa E para hablar con ella.'});
  if(DAED.g&&DAED.g.visible)C.push({obj:DAED.g,x:DAED.x,y:DAED.g.position.y+1.4,z:DAED.z,r:0.9,name:'Dédalo',sub:'arquitecto ateniense · personaje mítico',txt:()=>'El artesano que construyó el laberinto y ahora está encerrado en él. Acércate y pulsa E para hablar con él.'});}catch(e){}return C;};}
