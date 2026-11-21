// ============================================================ ARREGLOS DEL VÍDEO DE PARTIDA (16-11): avisos, lluvia bajo techo, el Capitolio y el modo atención
// 1. Los avisos se amontonaban (cinco a la vez tapando el plano): ahora se ven dos como mucho; el más antiguo se retira.
// 2. Bajo techo (templos, basílicas, la Curia, casas, termas, el Panteón) no llueve ni vuelan pájaros por dentro.
// 3. En las laderas muy empinadas (el Capitolio) el relieve que se ve quedaba hasta 4 m por encima del suelo con el que se calcula
//    la altura: el jugador se hundía en la colina y la veía «flotar» desde dentro. Ahora sus pies nunca quedan bajo el relieve visible.
// 4. Modo atención: las columnas rostrales del Foro se reconocen como tales (antes decía «Columna toscana»), y una columna
//    que forma parte de un monumento con ficha propia cede su sitio a esa ficha.
{const f=toast;toast=function(html){f(html);try{const c=$('toast');while(c&&c.children.length>2)c.firstChild.remove();}catch(e){}};}
function fxUnderRoof(){try{if(typeof dzUnderRoof==='function'&&dzUnderRoof())return true;}catch(e){}try{if(typeof intInside==='function'&&intInside())return true;}catch(e){}
  try{if(typeof hdIn==='function'&&hdIn())return true;}catch(e){}return false;}
{let was=false;const f=uxTick;uxTick=function(dt){f(dt);try{if(!state)return;const inn=fxUnderRoof();
  if(inn&&typeof WXS!=='undefined'&&WXS.rainM)WXS.rainM.visible=false;
  if(inn!==was){was=inn;for(const fl of (VIDA&&VIDA.flocks)||[])for(const b of fl.b)b.g.visible=!inn;}}catch(e){}};}
{const f=rfFloor;rfFloor=function(x,z,feet){const r=f(x,z,feet);try{if(BOAT.on||(RF&&RF.onRoof)||FLY.on||x>8000||r>terrainH(x,z)+0.05)return r;if(typeof cavIn==='function'&&cavIn())return r;const m=meshH(x,z);if(m!==null&&m>r&&m-r<6)return m;}catch(e){}return r;};}
Object.assign(ATX_DEF,{rostral:['Columna rostral','columna rostrata',
  'Una columna con los espolones de bronce de naves enemigas.',
  'Una columna adornada con los espolones de bronce (rostra) arrancados a las naves enemigas, como la que se levantó a Gayo Duilio por la primera victoria naval de Roma sobre Cartago, en Milas (260 a.C.). Augusto dedicó otras con los espolones de la flota de Antonio y Cleopatra, vencida en Accio (31 a.C.).',5,60]});
// las columnas rostrales: en 031 (x=-58, z=-26 y z=10)
function fxRostral(){if(MODE!=='roma')return;for(const z of[-26,10]){try{atReg(-58,z,romaH(-58,z),'rostral',1.6);}catch(e){}}}
// una columna suelta que está junto a algo con ficha más concreta (a menos de 3 m) no compite con ello
{const f=atCands;atCands=function(){const C=f.apply(this,arguments);try{const sp=C.filter(c=>!c.place&&!/^Columna (toscana|dórica|jónica|corintia)$/.test(c.name));
  return C.filter(c=>!(/^Columna (toscana|dórica|jónica|corintia)$/.test(c.name)&&sp.some(o=>o!==c&&Math.hypot(o.x-c.x,o.z-c.z)<3)));}catch(e){return C;}};}
// 5. Más objetos importantes del Foro y del Capitolio con ficha (encontrados con el recuento de lo que no la tenía)
Object.assign(ATX_DEF,{
 rostra:['Los espolones de los Rostra','rostra','Espolones de bronce de naves.',
  'Los espolones de bronce que dan nombre a la tribuna de los oradores, los Rostra. Los primeros se arrancaron a las naves de Antium, vencida en el 338 a.C., y se clavaron aquí (Livio 8, 14, 12). Desde lo alto hablan los magistrados al pueblo.',3,40],
 st_honor:['Estatua honorífica','estatua de bronce','Una estatua de bronce sobre un pedestal.',
  'Una estatua de bronce sobre un alto pedestal con una inscripción: el Senado la vota a quien ha servido bien a Roma. Eran tantas que los censores del 158 a.C. mandaron quitar del Foro las que no había aprobado el Senado o el pueblo (Plinio, Historia natural 34, 30).',3.5,50],
 tesoro:['Ofrendas del templo','tesoro sagrado','Ofrendas y tesoros.',
  'Ofrendas que los fieles y los generales dejan al dios: vasos de oro y plata, coronas, armas del enemigo, monedas. Los templos guardan también dinero y documentos, porque nadie se atreve a robar a un dios.',1.2,25],
 aerarium:['El tesoro del Estado','aerarium Saturni','El tesoro público.',
  'Bajo el templo de Saturno se guarda el tesoro del Estado (aerarium Saturni): lingotes, monedas y las cuentas públicas, además de las leyes grabadas en bronce y las enseñas de las legiones. Lo custodian funcionarios llamados prefectos del erario (Tácito, Anales 13, 29).',1.2,25],
 andamio:['Andamio','obras','Un andamio de madera.',
  'Andamios de madera atados con cuerdas: hay obras. El incendio de este año ha quemado el templo de Júpiter en el Capitolio y otros edificios del Campo de Marte, y Tito ha prometido rehacerlos (Suetonio, Tito 8, 3-4; Dion Casio 66, 24). Lo acabará su hermano Domiciano.',3,60]});
{const f=urbScaffold;urbScaffold=function(x,z,w,d,h,a){const r=f.apply(this,arguments);try{atReg(x,z,floorAt(x,z),'andamio',Math.max(w||4,d||4)/2);}catch(e){}return r;};}
{const f=tpDecorate;tpDecorate=function(o,g,cw,zBack,zFront,ly,hh,front,roman){f.apply(this,arguments);try{const R=tpRule(o.name);if(!g||!R||R.none||!R.tk||!(cw>5&&zFront-zBack>6))return;
  g.updateMatrixWorld(true);const v=new THREE.Vector3(0,ly,(zBack+2.4+3.5+zFront-1.2)/2).applyMatrix4(g.matrixWorld);atReg(v.x,v.z,v.y,/Saturno/.test(o.name||'')?'aerarium':'tesoro',Math.min(cw/2,4));}catch(e){}};}
{const f=fxRostral;fxRostral=function(){f();if(MODE!=='roma')return;try{atReg(-64,-8,romaH(-64,-8),'rostra',8);}catch(e){}
  for(const[x,z]of[[-40,-30],[-20,-32],[0,-33],[20,-32],[-35,26],[-10,28],[100,-30],[-45,8]]){try{atReg(x,z,romaH(x,z)+2.6,'st_honor',1.2);}catch(e){}}};}
