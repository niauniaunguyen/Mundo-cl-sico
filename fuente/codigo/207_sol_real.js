// ============================================================ EL SOL DE VERDAD
// El sol recorre el cielo como el real: la posición se calcula con la latitud del sitio (Atenas 38° N, Roma 41,9° N), la declinación
// del sol según el día del año (calendario del juego: un mes = SEASON_DAYS días) y la hora solar (clock.h; 12 h = mediodía, el sol al sur).
//  - En verano sale por el noreste, sube mucho (en Atenas, ~75° el 21 de junio) y se pone por el noroeste: días de ~14,5 h.
//  - En invierno sale por el sureste, apenas sube (~29°) y se pone por el suroeste: días de ~9,5 h.
//  - En los equinoccios sale por el este exacto y se pone por el oeste: 12 h de luz.
// Fórmulas de astronomía de posición (declinación de Cooper; altura y acimut a partir del ángulo horario). Sin refracción ni ecuación del tiempo.
// Además, las horas romanas son «temporales»: el día (de la salida a la puesta del sol) se divide en 12 horas iguales, más largas en
// verano que en invierno (Plinio, Historia natural II 188; Censorino, De die natali 23). Igual que los relojes de sol que lo medían.
const SOL={lat:0,dec:0,rise:6,set:18,_l:0};
function solLat(){let L=MODE==='roma'?41.9:37.97;try{const I=islandOf(player.x);if(I&&typeof I.lat==='number')L=I.lat;}catch(e){}return L;}
// día del año (1-365) según el calendario del juego, con la fracción del día por la hora
function solDia(){const d=(state&&state.day)||1,c=calNow(d),f=(((d-1)%SEASON_DAYS)+clock.h/24)/SEASON_DAYS;return c.mo*30.44+f*30.44+1;}
function solCalc(){const D2R=Math.PI/180,phi=solLat()*D2R,N=solDia(),dec=-23.44*D2R*Math.cos(TAU*(N+10)/365);SOL.lat=phi;SOL.dec=dec;
  const c=-Math.tan(phi)*Math.tan(dec),H0=Math.acos(clamp(c,-1,1))/D2R/15;SOL.rise=12-H0;SOL.set=12+H0;
  const H=(clock.h-12)*15*D2R,E=-Math.cos(dec)*Math.sin(H),No=Math.cos(phi)*Math.sin(dec)-Math.sin(phi)*Math.cos(dec)*Math.cos(H),U=Math.sin(phi)*Math.sin(dec)+Math.cos(phi)*Math.cos(dec)*Math.cos(H);
  return [E,U,-No];}   // mundo: +x = este, -z = norte (dirName, 011)
{const f=updateSky;updateSky=function(){
  // la versión de antes pone el sol en un arco fijo; se calcula todo con ella y luego se repite con el sol en su sitio
  let d;try{d=solCalc();}catch(e){return f.apply(this,arguments);}
  f.apply(this,arguments);SUNDIR.set(d[0],d[1],d[2]).normalize();
  // recalcular lo que depende de la altura del sol (copia de 003 con la dirección nueva)
  const e=SUNDIR.y,day=sstep(clamp((e+0.08)/0.32,0,1)),set=clamp(1-Math.abs(e-0.03)/0.22,0,1)*0.85;DAYF=day;
  const mix=(n,dd,st,out)=>out.copy(n).lerp(dd,day).lerp(st,set*(0.4+0.6*day));
  mix(CS.nT,CS.dT,CS.sT,SKY.uniforms.top.value);mix(CS.nM,CS.dM,CS.sM,SKY.uniforms.mid.value);mix(CS.nB,CS.dB,CS.sB,SKY.uniforms.bot.value);
  scene.fog.color.copy(SKY.uniforms.bot.value);SKY.uniforms.glow.value=clamp((e+0.1)*5,0,1);
  const moon=SKY.uniforms.moonD.value.set(-SUNDIR.x,Math.abs(SUNDIR.y)*0.8+0.15,-SUNDIR.z).normalize();
  if(e>-0.03){LIGHTDIR.copy(SUNDIR);if(LIGHTDIR.y<0.08)LIGHTDIR.y=0.08;LIGHTDIR.normalize();sun.intensity=1.4*sstep(clamp((e+0.03)/0.25,0,1));sun.color.setRGB(1,0.8+0.18*day,0.58+0.32*day);}
  else{LIGHTDIR.copy(moon);sun.intensity=0.22*clamp((-e-0.03)/0.1,0,1);sun.color.set('#9fb4d9');}
  hemi.intensity=0.16+0.40*day;hemi.color.copy(_c1.set('#3a4a70').lerp(_c2.set('#c4d8ee'),day));hemi.groundColor.copy(_c1.set('#1c1a20').lerp(_c2.set('#7a6448'),day));
  STARS.material.opacity=clamp(1-day*1.8,0,1);const night=clamp(1-day*1.4,0,1);for(const tc of TORCHES)tc.s.material.opacity=night;
  const ck=document.getElementById('clock');if(ck)ck.textContent=hourLabel();};}
// el disco del sol (antes solo había un resplandor): ~0,6° de radio (el real mide 0,27°, se agranda para que se vea en pantalla),
// blanco amarillento arriba y rojizo cerca del horizonte
SKY.fragmentShader=SKY.fragmentShader.replace('gl_FragColor=vec4(c,1.0);}',
  'float dk=smoothstep(0.99993,0.99996,s)*smoothstep(-0.02,0.01,vp.y);c=mix(c,mix(vec3(1.0,0.55,0.3),vec3(1.0,0.97,0.88),smoothstep(0.0,0.25,sunD.y))*1.15,dk*glow);gl_FragColor=vec4(c,1.0);}');
SKY.needsUpdate=true;
// horas romanas temporales: la hora prima empieza al salir el sol; la duodécima acaba al ponerse
{const f=horaRomana;horaRomana=function(h){try{const r=SOL.rise,s=SOL.set;if(!(s>r))return f(h);if(h<r||h>=s){const n=(h-s+24)%24,L=24-(s-r),v=Math.min(3,Math.floor(n/(L/4)));return ['prima','secunda','tertia','quarta'][v]+' vigilia de la noche';}
  const n=Math.min(12,Math.floor((h-r)/((s-r)/12))+1);return 'hora '+['prima','secunda','tertia','quarta','quinta','sexta','septima','octava','nona','decima','undecima','duodecima'][n-1];}catch(e){return f(h);}};}
// para pruebas y para el glosario: salida y puesta de hoy, en horas solares
function solHoy(){solCalc();const fm=x=>Math.floor(x)+':'+String(Math.round((x%1)*60)).padStart(2,'0');return {sale:fm(SOL.rise),pone:fm(SOL.set),horas:+(SOL.set-SOL.rise).toFixed(1),altMax:+(90-Math.abs(SOL.lat-SOL.dec)*180/Math.PI).toFixed(1)};}
