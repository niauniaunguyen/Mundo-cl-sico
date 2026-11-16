// ============================================================ MIRAR CON ATENCIÓN: más objetos repetidos que no tenían ficha
// Encontrados con un recuento de todo lo que hay en Atenas y en Roma (qué función crea cada objeto y si el modo atención tiene algo cerca):
// balcones de las ínsulas, vomitorios, mástiles del toldo y mojones del anfiteatro, macetas y letreros, el público de las gradas
// y los muros de piedra seca entre los campos. Cada uno se apunta en el registro (atReg) donde se construye.
Object.assign(ATX_DEF,{
 maenianum:['Balcón de madera','maenianum','Un balcón de madera volado sobre la calle.',
  'Un balcón de madera volado sobre la calle (maenianum). El nombre viene de Gayo Menio, que, según Festo, fue el primero en sacar tablados sobre las columnas del Foro para ver los espectáculos (s. v. Maeniana). Con tanta madera, los incendios saltan de casa en casa: tras el del 64, Nerón mandó poner pórticos delante de las ínsulas para apagar el fuego desde sus terrazas (Suetonio, Nerón 16; Tácito, Anales 15, 43).',0.5,40],
 vomitorium:['Vomitorio','vomitorium','Una boca de acceso a las gradas.',
  'Una de las bocas por las que el público entra a las gradas y sale de ellas. Macrobio explica que se llaman vomitoria porque «vomitan» a la gente hacia fuera (Saturnales 6, 4, 3). Cada espectador lleva una tésera con el número de su arco, su sector y su fila, y así encuentra su sitio sin perderse.',1.3,40],
 velarium:['Mástil del toldo','velarium','Un mástil para un toldo.',
  'Uno de los mástiles de madera que, encajados en ménsulas de piedra en lo alto de la fachada, sostienen las cuerdas del velarium, el gran toldo que da sombra a las gradas. Lo manejan marineros de la flota de Miseno, que tienen su cuartel junto al anfiteatro (Historia Augusta, Cómodo 15, 6).',2,90],
 cippus:['Mojón de travertino','cippus','Un mojón de piedra.',
  'Uno de los mojones de piedra que rodean el anfiteatro a cierta distancia. No se sabe con seguridad para qué servían: quizá para atar las cuerdas del toldo, quizá para cerrar el paso y ordenar a la multitud los días de juegos.',1,30],
 macetas:['Macetas en la ventana','plantas en tiestos','Flores y hierbas en tiestos.',
  'Quien vive en una ínsula no tiene jardín: pone flores y hierbas en tiestos en la ventana. Plinio el Viejo lo cuenta como costumbre de la plebe de Roma, que se hace en las ventanas una imagen de huerto (Historia natural 19, 59).',0.4,25],
 letrero:['Letrero de tienda','taberna','El letrero de una tienda.',
  'El letrero de una taberna, pintado sobre tabla. Muchas tiendas se anuncian también con un dibujo de lo que venden, porque no todo el mundo sabe leer, como los rótulos pintados que se conservan en las fachadas de Pompeya.',0.6,25],
 publico:['Público','espectadores',
  'Los atenienses pasan días enteros en el teatro durante las fiestas de Dioniso, viendo una obra tras otra desde el amanecer. Los asientos de honor de la primera fila (proedría) son para sacerdotes, magistrados y benefactores de la ciudad.',
  'Cada uno se sienta según quién es: los senadores, abajo; los caballeros, en las filas siguientes; los soldados, aparte; las mujeres, arriba del todo. Lo ordenó Augusto (Suetonio, Augusto 44).',1,60],
 drywall:['Muro de piedra seca','linde del campo',
  'Piedras sin argamasa, amontonadas al limpiar el campo: marcan la linde de cada parcela y, en las laderas, sostienen bancales. En el Ática el suelo es pedregoso y estos muros están por todas partes.',
  'Piedras sin argamasa que separan las parcelas. Los agrimensores romanos miden el campo y lo dividen en lotes, y los mojones y los muros marcan de quién es cada uno.',0.4,30]});
// el público de teatros, circo y anfiteatro son figuritas iguales (un cilindro de 0,2-0,26 × 1,15): se busca una vez tras la carga
// y se apunta una ficha cada 12 m de grada
function atxCrowdScan(){const seen=new Set(),m=new THREE.Matrix4(),v=new THREE.Vector3();let n=0;
  const add=(x,y,z)=>{const k=Math.floor(x/12)+','+Math.floor(z/12);if(seen.has(k))return;seen.add(k);atReg(x,z,y-0.6,'publico',3);n++;};
  scene.traverse(o=>{const P=o.isMesh&&o.geometry&&o.geometry.parameters;if(!P||P.radiusTop!==0.2||P.radiusBottom!==0.26||P.height!==1.15)return;o.updateMatrixWorld(true);
    if(o.isInstancedMesh){for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);m.premultiply(o.matrixWorld);v.setFromMatrixPosition(m);add(v.x,v.y,v.z);}}
    else{o.getWorldPosition(v);add(v.x,v.y,v.z);}});return n;}
{let done=false;const f=uxTick;uxTick=function(dt){f(dt);if(!done&&state&&ui==='play'){done=true;try{atxCrowdScan();}catch(e){}}};}
