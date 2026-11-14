// ============================================================ MODO ATENCIÓN: QUÉ ESTÁ HACIENDO CADA PERSONA (campo, caminos y calle)
// Cada persona de los oficios del campo, de la granja, del tráfico de los caminos y de los campos junto al camino se puede mirar una a una
// (también las que se mueven); la ficha dice qué hace en ese momento y por qué. En la ciudad, el transeúnte dice si almuerza, va a la fuente,
// discute, se abanica, charla, o va con su pedagogo o detrás de su amo.
const ATP={
 lenador:['Un leñador','cortando leña','Corta leña a golpe de hacha y la apila para bajarla al llano.'],resinero:['Un resinero','sangrando un pino','Ha hecho una herida en el pino y recoge la resina que gotea; hervida, dará pez.'],
 cazador:['Un cazador','rondando las redes con sus perros','Ha tendido las redes en un paso del monte y ronda con los perros para levantar la caza y empujarla hacia ellas.'],
 pajarero:['Un pajarero','acercando la caña de liga','Acerca muy despacio la punta untada de liga a un pájaro posado: si la toca, se queda pegado.'],
 rizotomo:['Un cortador de raíces','arrancando raíces medicinales','Busca y arranca raíces y hierbas para remedios… y para cosas peores.'],apicultor:['Un colmenero','calmando las abejas con humo','Echa humo en las colmenas para que las abejas se calmen y poder sacar los panales.'],
 pastor:['Un pastor','guardando su rebaño','Vigila el rebaño mientras pace; el perro avisa si se acerca un lobo.'],altar:['Un pastor','rezando en un altar de campo','Ha dejado leche, una torta y una figurilla en el altar de Pan y las ninfas, y reza con los brazos levantados, como se rezaba en la Antigüedad.'],
 augur:['Un augur','observando el vuelo de las aves','Con la cabeza cubierta y el lituus en la mano, ha marcado un espacio sagrado (templum) y observa por dónde vuelan las aves para saber si los dioses aprueban.'],
 canteros:['Un cantero','sacando bloques de mármol','Golpea con el mazo las cuñas para separar el bloque de la roca.'],lavanderas:['Una lavandera','lavando ropa en el río','Golpea la ropa mojada contra una piedra; luego la tenderá sobre los arbustos.'],
 barquero:['Un barquero','cruzando el río','Empuja la barca con la pértiga de una orilla a otra. Por una moneda, te cruza.'],purpurero:['Un pescador de púrpura','vaciando las nasas','Saca los múrices de las nasas y los amontona: de cada uno saldrá una gota de tinte.'],
 esponjero:['Un buceador de esponjas','preparándose para bucear','Ata la piedra que le hará bajar rápido al fondo y prepara la red para las esponjas.'],mendigo:['Un mendigo','pidiendo limosna','Pide a los que pasan, sobre todo a los peregrinos y viajeros, que suelen ser generosos para tener buen viaje.']};
const ATP_FARM={oliva:[['vareando el olivo','Golpea las ramas con una vara larga para que caigan las aceitunas sobre la manta.'],['vareando el olivo','Golpea las ramas con una vara larga para que caigan las aceitunas sobre la manta.'],['recogiendo aceitunas','Recoge de la manta las aceitunas caídas y las echa al cesto.']],
 poda:[['podando la viña','Corta los sarmientos viejos para que la cepa dé más uva.'],['podando la viña','Corta los sarmientos viejos para que la cepa dé más uva.']],cava:[['cavando la viña','Cava la tierra alrededor de las cepas para que entre el agua.'],['escardando el campo','Quita las malas hierbas del sembrado.']],
 siega:[['segando con la hoz','Corta las espigas a media altura; luego las atará en gavillas.'],['segando con la hoz','Corta las espigas a media altura; luego las atará en gavillas.'],['segando con la hoz','Corta las espigas a media altura; luego las atará en gavillas.']],
 trilla:[['guiando los bueyes en la era','Hace dar vueltas a los bueyes sobre las espigas extendidas en la era: con las pezuñas, separan el grano de la paja.'],['aventando el grano','Lanza al aire con el bieldo lo trillado: el grano, que pesa, cae; la paja se la lleva el viento.']],
 vendimia:[['cortando racimos','Corta los racimos y los echa al cesto.'],['cortando racimos','Corta los racimos y los echa al cesto.'],['pisando la uva en el lagar','Pisa la uva descalzo en el lagar; el mosto corre por un canal hasta las tinajas.']]};
const ATP_RD={carro:['Un carretero','con su carro de bueyes','Los bueyes avanzan a paso de persona: por tierra, el transporte pesado es lento y caro, y siempre que se puede se lleva la carga por mar o por río.'],
 recua:['Un arriero','con su recua','Las mulas y los asnos son los camiones del mundo antiguo: van con la carga a lomos por sendas donde no pasa un carro.'],
 correo:['Un correo','del servicio del Estado','Es un correo del cursus publicus, el servicio que creó Augusto: cambia de caballo en las postas y lleva cartas y órdenes oficiales (Suetonio, Augusto 49).'],
 litera:['Un porteador','llevando una litera','Lleva la litera (lectica) de un viajero rico, que va dentro leyendo o durmiendo. Es trabajo de esclavos fuertes, a menudo elegidos por su estatura.'],
 soldados:['Un legionario','en marcha','Una columna de legionarios: a paso normal recorren unos treinta kilómetros en cinco horas, cargados con su equipo (Vegecio, Compendio de técnica militar 1, 9).'],
 peregrinos:['Un peregrino','camino del santuario','Va vestido de blanco a un santuario —Delfos, Olimpia, Eleusis— a consultar al oráculo, cumplir un voto o ver los juegos. Para las grandes fiestas se proclama una tregua sagrada que protege a los viajeros.'],
 rebano:['Un pastor','llevando el rebaño','Mueve el rebaño por el camino hacia otros pastos.']};
const ATP_FIELD={arar:['arando','Abre surcos con el arado tirado por bueyes antes de sembrar.'],verde:['cuidando el sembrado','El trigo y la cebada crecen con las lluvias del invierno; hay que quitar las malas hierbas y espantar a los pájaros.'],siega:['segando','Siega con la hoz y ata las gavillas.'],rastrojo:['en el rastrojo','Recoge lo que queda de la cosecha; luego meterán los animales a pastar el rastrojo.']};
function atWP(o){const v=new THREE.Vector3();o.getWorldPosition(v);return v;}
{const c0=atCands;atCands=function(){const C=c0.apply(this,arguments),ro=MODE==='roma',P=player;try{
  const near=v=>Math.abs(v.x-P.x)<70&&Math.abs(v.z-P.z)<70,add=(o,name,sub,txt)=>{if(!o||!o.visible)return;const v=atWP(o);if(!near(v))return;C.push({obj:o,x:v.x,y:v.y+1.3,z:v.z,r:0.8,name,sub,txt:()=>txt});};
  // oficios del campo
  for(const V of RU.live){if(Math.abs(V.x-P.x)>90||Math.abs(V.z-P.z)>90)continue;const T=RU_TX[V.k]&&(RU_TX[V.k][ro?'r':'a']||RU_TX[V.k].a);
    if(V.k==='granja'){const F=ATP_FARM[V.fase]||[],src=(RU_FARM[ro?'r':'a'][V.fase]||[])[1]||'';V.p.forEach((p,i)=>{const a=F[i];if(a)add(p,p.userData.fem?'Una campesina':'Un campesino',a[0],a[1]+' '+src);});continue;}
    const A=ATP[V.k];if(!A)continue;V.p.forEach(p=>add(p,A[0],A[1],A[2]+(T?' '+T[3]:'')));}
  for(const m of RU.mov){const T=RU_ROAD[m.kind],nm={hemerodromo:['Un hemeródromo','corriendo con un mensaje'],buhonero:['Un buhonero','de pueblo en pueblo con su fardo'],veterano:['Un veterano','volviendo a casa']}[m.kind];if(nm)add(m.p,nm[0],nm[1],T[1]);}
  // tráfico de los caminos y campos junto al camino (ya existían)
  if(typeof RD!=='undefined'){for(const M2 of RD.mov){const A=ATP_RD[M2.kind];if(!A||!M2.g||!M2.g.visible)continue;for(const p of (M2.g.userData.ps||[]))add(p,A[0],A[1],A[2]);}
    const mo=calNow().mo,ph=mo>=8&&mo<=10?'arar':mo>=11||mo<=2?'verde':mo<=5?'siega':'rastrojo',FA=ATP_FIELD[ph];for(const F of RD.fields)for(const q of F.w)add(q,'Un campesino',FA[0],FA[1]);}
  // la gente de la calle: qué está haciendo
  const byG=new Map();for(const w of walkers)if(w.g)byG.set(w.g,w);const A2=FAM.arg;
  for(const c of C){const w=c.obj&&byG.get(c.obj);if(!w)continue;const u=w.g.userData,bt=u.bt||'',kid=/^niño/.test(bt);let nm=kid?'Un niño':bt==='anciano'?'Un anciano':c.name,sub=c.sub,tx=null;
    if(w.fol&&w.fkind==='kid'){const ped=(w.fol.g.userData.feat||[]).includes('pedagogo');sub='con '+(ped?'su pedagogo':'su madre');tx=ped?ST_TXT.pedagogo[1]:'Va de la mano de su madre: las mujeres de condición humilde salen a la calle a comprar, a la fuente o a trabajar, y llevan a los niños con ellas.';}
    else if(w.fol&&w.fkind==='slave'){nm='Un esclavo';sub='acompañando a su amo';tx=ST_TXT.acolito[1];}
    else if(w.lead&&walkers.some(f=>f.fol===w&&f.fkind==='slave')){sub='seguido por su esclavo';tx=ST_TXT.acolito[1];}
    else if(A2&&(A2.a===w||A2.b===w)){sub='discutiendo con un vecino';tx=ST_TXT.pleito[1];}
    else if(u.bread){sub='almorzando';tx=ST_TXT.almuerzo[1];}
    else if(w.fgo){sub='yendo a la fuente con la hidria';tx=ST_TXT.fuente[1];}
    else if(u.gs&&u.gs.fan>0){sub='abanicándose';tx=ST_TXT.calor[1];}
    else if(w.pal){sub='charlando';tx=ro?'Se para a charlar: en la calle se sabe todo, desde los precios del trigo hasta lo último del emperador.':'Se para a charlar: en el ágora y en las calles se habla de todo, de la Asamblea a los precios del pescado.';}
    else if(kid&&w.speed>0&&bt==='niño que corre'){sub='corriendo';}
    else if(bt==='anciano'){sub='paseando despacio';tx='Pocos llegaban a viejos, y se les respetaba: en Esparta, los ancianos formaban la Gerusía, el consejo de mayores de sesenta años.';}
    if(kid&&!tx)tx=ro?'Un niño de Roma. Los niños libres llevan la bulla al cuello; a los siete años, los que pueden, van a la escuela del maestro (ludus).':'Un niño de Atenas. Hacia los siete años, los niños que pueden van al maestro de letras (grammatistés), al citarista y a la palestra.';
    if(nm!==c.name||sub!==c.sub||tx){const t0=c.txt;c.name=nm;c.sub=sub;if(tx)c.txt=()=>tx;else c.txt=t0;}}
 }catch(e){}return C;};}
// ============================================================ LLEGAR MIRANDO A ALGO: tras un viaje o un salto, si la cámara da contra una ladera, girar hacia lo despejado
const ARV={px:null,pz:null,t:-1};
function arvBlock(x,z,a){const h0=terrainH(x,z);let s=0;for(const d of[6,12,20,30]){const fx=x-Math.sin(a)*d,fz=z-Math.cos(a)*d;s+=Math.max(0,terrainH(fx,fz)-h0-d*0.15);}return s;}
function arvTick(dt){if(!state||ui==='start')return;const P=player;if(ARV.px!==null&&Math.hypot(P.x-ARV.px,P.z-ARV.pz)>60)ARV.t=0.5;ARV.px=P.x;ARV.pz=P.z;
  if(ARV.t<0)return;ARV.t-=dt;if(ARV.t>0||ui!=='play')return;ARV.t=-1;if(arvBlock(P.x,P.z,P.yaw)<3)return;
  let cx=P.x,cz=P.z;try{const I=islandOf(P.x);if(I){cx=I.x;cz=I.z;}}catch(e){}const toC=Math.atan2(P.x-cx,P.z-cz);
  let best=P.yaw,bs=1e9;for(let i=0;i<16;i++){const a=i/16*TAU,d=Math.abs(((a-toC+Math.PI)%TAU+TAU)%TAU-Math.PI);const s=arvBlock(P.x,P.z,a)*2+d*0.8;if(s<bs){bs=s;best=a;}}P.yaw=best;}
