// ============================================================ VOCES Y MÚSICA POR MOMENTOS
// Voces: la lectura en voz alta (🔊 o lectura automática) usa una voz distinta según quién habla: mujer, hombre, niño, persona mayor o divinidad
// (tono y velocidad; y, si el navegador tiene varias voces en español, una femenina o masculina). Lo que dice el guía de la llegada también se puede oír.
// Música: un motivo de lira al hablar con una diosa, un bordón suave mientras dura un sueño, una fanfarria de aulós al recibir un honor
// y el murmullo de la gente en la Asamblea o junto al Senado. Todo sintetizado (sin archivos) y con el volumen general del juego.
const VZ={fem:/^(Mónica|Monica|Paulina|Helena|Laura|Lucía|Lucia|Elvira|Sabina|Marisol|Conchita|Penélope|Esperanza|Dalia|Microsoft Helena|Google español)/i,masc:/^(Jorge|Diego|Pablo|Juan|Álvaro|Alvaro|Enrique|Carlos|Raúl|Microsoft Pablo)/i};
function vzVoices(){try{return speechSynthesis.getVoices().filter(v=>/^es/.test(v.lang));}catch(e){return[];}}
function vzProfile(){const nm=(($('dName')&&$('dName').textContent)||'')+' '+(($('dTitle')&&$('dTitle').textContent)||''),n=(typeof dlg!=='undefined'&&dlg&&dlg.n)||null,lk=n&&n.look||{};
  if(/Atenea|Minerva|Zeus|Júpiter|Juno|Hera|Apolo|Musa|Mnemósine|diosa|dios |Hermes|Mercurio|Deméter|Ceres|Artemisa|Diana|Afrodita|Venus|Poseidón|Neptuno|Dioniso|Baco|Hécate|Trivia/i.test(nm))
    return{pitch:/diosa|Atenea|Minerva|Juno|Hera|Musa|Mnemósine|Deméter|Ceres|Artemisa|Diana|Afrodita|Venus|Hécate|Trivia/i.test(nm)?1.08:0.72,rate:0.86,fem:/diosa|Atenea|Minerva|Juno|Hera|Musa|Mnemósine|Deméter|Ceres|Artemisa|Diana|Afrodita|Venus|Hécate|Trivia/i.test(nm)};
  if(/niñ|muchach|Lisias|Gaya|Aristóteles|escolar/i.test(nm))return{pitch:1.45,rate:1.04,fem:/niña|Gaya/.test(nm)};
  const old=/abuel|anciano|anciana|viej|sacerdote|Platón|Isócrates/i.test(nm)||(lk.hair&&/#[cdef][0-9a-f]{5}/i.test(lk.hair)&&lk.beard);
  const fem=!!lk.female||/sacerdotisa|vestal|madre|abuela|hetera|aguadora|Mirrina|Pomponia|Cornelia|ella\b/i.test(nm);
  return{pitch:(fem?1.22:0.88)*(old?0.88:1),rate:old?0.88:0.97,fem};}
{const f=accSpeak;accSpeak=function(t,prof){try{const S=window.speechSynthesis;if(!S)return f(t);S.cancel();const P=prof||vzProfile();const u=new SpeechSynthesisUtterance(String(t).replace(/\s+/g,' ').slice(0,3000));
  u.lang='es-ES';u.rate=P.rate||0.95;u.pitch=P.pitch||1;const L=vzVoices();const want=L.find(v=>(P.fem?VZ.fem:VZ.masc).test(v.name));const v=want||L[0];if(v)u.voice=v;S.speak(u);}catch(e){return f(t);}};}
// el guía de la llegada habla con voz de niño o niña si la lectura automática está activa
{const f=obSay;obSay=function(t,dur){f(t,dur);try{if(typeof ACC!=='undefined'&&ACC.auto)accSpeak(t,{pitch:1.45,rate:1.04,fem:MODE==='roma'});}catch(e){}};}
// ---- música por momentos
const MM={drone:null,murT:0};
function mmLyre(kind){try{const base=MODE==='roma'?220:196;sfxLyre(base,kind==='god'?[0,3,7,10,12,10,7]:[0,7,12],0.18,0.32);}catch(e){}}
function mmFanfare(){try{const b=MODE==='roma'?233:220;sfxAulos(b,[0,4,7,12,7,12],0.06,0.28);}catch(e){}}
function mmDrone(on){if(!aOK())return;const c=AUD.ctx;if(on&&!MM.drone){const g=c.createGain();g.gain.value=0.0001;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=600;
    const o1=c.createOscillator(),o2=c.createOscillator();o1.type='triangle';o2.type='sine';o1.frequency.value=MODE==='roma'?110:98;o2.frequency.value=(MODE==='roma'?110:98)*1.5;o2.detune.value=4;
    o1.connect(lp);o2.connect(lp);lp.connect(g);g.connect(AUD.master);o1.start();o2.start();g.gain.setTargetAtTime(0.035,c.currentTime,1.2);MM.drone={g,o:[o1,o2]};}
  else if(!on&&MM.drone){const D=MM.drone;MM.drone=null;D.g.gain.setTargetAtTime(0.0001,c.currentTime,0.6);setTimeout(()=>{try{D.o.forEach(o=>o.stop());}catch(e){}},2500);}}
// al abrir el diálogo de la diosa, un motivo de lira
{const f=amTalk;amTalk=function(){mmLyre('god');return f.apply(this,arguments);};}
// al recibir un honor, fanfarria
{const f=honCheck;honCheck=function(){const r0=honz().r||0;f();if((honz().r||0)>r0)setTimeout(mmFanfare,700);};}
// sueños: bordón mientras dura; murmullo en la Asamblea o el Senado
{const f=uxTick;uxTick=function(dt){f(dt);try{mmDrone(!!(typeof EPI!=='undefined'&&EPI.cur&&ui==='episode'));
  if(typeof DZ!=='undefined'&&DZ.crowd&&ui==='play'){const c=DZ.crowd.children[0];if(c){const dx=c.position.x-player.x,dz=c.position.z-player.z,d=Math.hypot(dx,dz);MM.murT-=dt;
    if(d<70&&MM.murT<=0){MM.murT=0.35+Math.random()*0.6;const pan=Math.max(-1,Math.min(1,(dx*Math.cos(player.yaw)-dz*Math.sin(player.yaw))/30));sfxPhrase(pan,Math.max(0.02,0.11*(1-d/70)));}}}}catch(e){}};}
