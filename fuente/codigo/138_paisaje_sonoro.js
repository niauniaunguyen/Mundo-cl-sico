// ============================================================ PAISAJE SONORO Y MÚSICA DE AMBIENTE (todo sintetizado, sin archivos)
// Templos de día: aulós (Grecia: la doble flauta acompañaba los sacrificios, como muestran los vasos pintados) o tibia (Roma: el tibicen
// tocaba para tapar cualquier ruido de mal agüero, Plinio, Historia natural 28, 11). Noche en la ciudad: el mochuelo
// de Atenea («llevar lechuzas a Atenas», Aristófanes, Aves 301) o una lechuza en Roma, perros lejanos y, al anochecer, una lira de algún
// banquete. Mercado: monedas. Música de ambiente: frases breves y espaciadas en modos antiguos (lira en Grecia, tibia en Roma, siringa en el
// campo); se quita en Ajustes («Música de ambiente», state.musOff). Respeta el sonido apagado y ACC.noAmb.
const PS={t:0,mus:60+Math.random()*40,aul:20,owl:30,dog:25,sym:40,gull:10,creak:6,coin:8};
const MODO={dorio:[0,1,3,5,7,8,10,12],frigio:[0,2,3,5,7,9,10,12],lidio:[0,2,4,5,7,9,11,12]};
function psPhrase(n,mode){const M=MODO[mode]||MODO.dorio,out=[];let i=Math.floor(Math.random()*4)+2;for(let k=0;k<n;k++){i=Math.max(0,Math.min(M.length-1,i+(Math.random()<0.5?-1:1)*(Math.random()<0.25?2:1)));out.push(M[i]);}out.push(M[0]);return out;}
// aulós / tibia: dos tubos de lengüeta (una nota pedal y la melodía), sonido nasal
function sfxAulos(base,notes,vol,dur){if(!aOK())return;const c=AUD.ctx,t0=c.currentTime+0.05,d=dur||0.42,L=notes.length*d;
  const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1300;bp.Q.value=0.9;const out=c.createGain();out.gain.setValueAtTime(0.0001,t0);out.gain.exponentialRampToValueAtTime(vol,t0+0.08);out.gain.setValueAtTime(vol,t0+L-0.12);out.gain.exponentialRampToValueAtTime(0.0001,t0+L+0.1);bp.connect(out);out.connect(AUD.master);
  const dr=c.createOscillator();dr.type='sawtooth';dr.frequency.value=base/2;const dg=c.createGain();dg.gain.value=0.35;dr.connect(dg).connect(bp);dr.start(t0);dr.stop(t0+L+0.15);   // el bordón
  const me=c.createOscillator();me.type='sawtooth';const vib=c.createOscillator(),vg=c.createGain();vib.frequency.value=5.2;vg.gain.value=base*0.008;vib.connect(vg).connect(me.frequency);
  notes.forEach((st,k)=>me.frequency.setValueAtTime(base*Math.pow(2,st/12),t0+k*d));me.connect(bp);me.start(t0);vib.start(t0);me.stop(t0+L+0.15);vib.stop(t0+L+0.15);}
function sfxLyre(base,notes,vol,dur){if(!aOK())return;const t0=AUD.ctx.currentTime+0.05,d=dur||0.5;notes.forEach((st,k)=>{try{rwPluck(base*Math.pow(2,st/12),t0+k*d*(0.8+Math.random()*0.4),vol,1.6);}catch(e){}});}
function sfxLechuza(roma){if(!aOK())return;const c=AUD.ctx,t=c.currentTime+0.02;const call=(t0,f0,f1,len)=>{const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(f0,t0);o.frequency.linearRampToValueAtTime(f1,t0+len*0.4);o.frequency.linearRampToValueAtTime(f0*0.92,t0+len);o.connect(envGain(t0,0.045,0.03,len));o.start(t0);o.stop(t0+len+0.1);};
  if(roma){call(t,620,700,0.5);call(t+0.9,560,650,0.9);}else{call(t,1450,1800,0.35);}}   // mochuelo: «kiu» agudo; lechuza (cárabo): ulular grave
function sfxDog(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime+0.02;for(let k=0;k<2+Math.floor(Math.random()*2);k++){const t0=t+k*0.32,o=c.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(330,t0);o.frequency.exponentialRampToValueAtTime(190,t0+0.14);const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=700;o.connect(f).connect(envGain(t0,0.025,0.01,0.16));o.start(t0);o.stop(t0+0.2);}}
function sfxCoins(){if(!aOK())return;const c=AUD.ctx,t=c.currentTime;[0,0.07,0.16].forEach((d,i)=>{const o=c.createOscillator();o.type='sine';o.frequency.value=3200+i*410;o.connect(envGain(t+d,0.012,0.002,0.18));o.start(t+d);o.stop(t+d+0.2);});}
const PS_TEMPLE=/templo|temple|partenon|hefest|erecte|aedes|vesta|iupp|iovis|saturn|castor|concord|apolo|apollo|atenea|zeus|asclep|olimpie|heraion|artemis|diana|mars|venus|isis|panteon/i;
function psNearPlace(re,r){const P=player;let b=null,bd=r;for(const q of PLACES){if(Math.abs(q.x-P.x)>r||Math.abs(q.z-P.z)>r)continue;if(!re.test(q.id+' '+q.name))continue;const d=Math.hypot(q.x-P.x,q.z-P.z);if(d<bd){bd=d;b=q;}}return b?[b,bd]:null;}
function psSeen(k,t){if(!state.seen||state.seen[k])return;state.seen[k]=1;toast('<span class="label">Escucha · '+t[0]+'</span><br>'+t[1]);}
function psTick(dt){if(!aOK()||!state||ui==='start'||(typeof ACC!=='undefined'&&ACC.noAmb))return;const ro=MODE==='roma',h=clock.h,night=h<5.5||h>20.5,day=h>7&&h<19,P=player,inCity=P.x<8000,busy=ui!=='play';
  for(const k of['mus','aul','owl','dog','sym','gull','creak','coin'])PS[k]-=dt;
  // templos de día: aulós o tibia
  if(day&&PS.aul<=0){PS.aul=35+Math.random()*50;const T=psNearPlace(PS_TEMPLE,45);if(T&&!busy){const[q,d]=T;gfAt(q.x,q.z,()=>sfxAulos(ro?330:294,psPhrase(7+Math.floor(Math.random()*4),ro?'lidio':'dorio'),0.03*Math.max(0.3,1-d/45)));
    psSeen('ps:aulos',ro?['La tibia','En un sacrificio romano siempre suena la tibia: el tibicen toca durante la oración para que no se oiga ninguna otra palabra, que podría ser de mal agüero (Plinio, Historia natural 28, 11).']:['El aulós','Junto al altar suena el aulós, la doble flauta: un tubo sostiene una nota y el otro hace la melodía. Los vasos pintados muestran casi siempre a un aulete en los sacrificios.']);}}
  // (gaviotas del puerto y crujidos de la barca: ya los hace gfAudio)
  // mercado: monedas cerca de los vendedores
  if(day&&h<14&&PS.coin<=0){PS.coin=5+Math.random()*8;for(const w of walkers){if(!w.barks||!w.g.visible)continue;if(Math.abs(w.g.position.x-P.x)<14&&Math.abs(w.g.position.z-P.z)<14){gfAt(w.g.position.x,w.g.position.z,sfxCoins);break;}}}
  // noche: mochuelo o lechuza, perros, y al anochecer una lira de un banquete
  if(night&&inCity&&PS.owl<=0){PS.owl=25+Math.random()*50;sfxLechuza(ro);if(!ro)psSeen('ps:lechuza',['El mochuelo de Atenea','En Atenas hay tantos mochuelos, el ave de Atenea que sale en las monedas, que «llevar lechuzas a Atenas» es el refrán para algo inútil (Aristófanes, Aves 301).']);}
  if(night&&inCity&&PS.dog<=0){PS.dog=20+Math.random()*45;sfxDog();}
  if(inCity&&h>19.5&&h<23.5&&PS.sym<=0){PS.sym=40+Math.random()*60;if(!busy){sfxLyre(220,psPhrase(6,'dorio'),0.018,0.55);psSeen('ps:banquete',ro?['Un convivium','De alguna casa llega música: en las cenas de los ricos tocaban músicos y bailarinas, y se recitaban poemas entre plato y plato.']:['Un banquete','De alguna casa llega una lira: en el banquete (symposion), después de cenar, los invitados beben, cantan por turnos y tocan la lira; tocarla bien era parte de la buena educación.']);}}
  // música de ambiente
  if(PS.mus<=0){PS.mus=70+Math.random()*80;if(!state.musOff&&!busy){let I=null;try{I=islandOf(P.x);}catch(e){}const nat=I&&typeof RD_MAPS!=='undefined'&&RD_MAPS.includes(I.id);
    if(nat&&!night){try{ruSfx('syrinx');}catch(e){}}else if(ro)sfxAulos(night?262:294,psPhrase(8,'frigio'),night?0.012:0.016,0.5);else sfxLyre(night?196:247,psPhrase(8,Math.random()<0.5?'dorio':'frigio'),night?0.016:0.022,0.6);}}}
// Ajustes: música de ambiente sí/no
{const g0=gmRight;gmRight=function(d){g0(d);try{if(GM.page!=='ajustes')return;const g=d.querySelector('.gr'),l=g&&(g.querySelector('.list')||g);if(!l)return;const b=document.createElement('button');b.className='wide';
  b.innerHTML='<span class="t">'+(state.musOff?'Música de ambiente: no':'✓ Música de ambiente: sí')+'</span><span class="k">frases breves de lira, aulós o siringa, de vez en cuando</span>';b.onclick=()=>{state.musOff=!state.musOff;save();gmRender();};l.appendChild(b);}catch(e){}};}
