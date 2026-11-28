// ============================================================ LA ACRÓPOLIS, COMPLETADA CON GOLVIN (modo Atenas, 386 a.C.) (28/11)
// Comparada con J.-C. Golvin, Ciudades del mundo antiguo, p. 52 («La Acrópolis de Atenas en tiempos de Pericles y Fidias»): todo lo que
// numera ya estaba en el juego salvo cuatro cosas, que existían en el 386 y se añaden aquí: el altar de Zeus Hypatos (n.º 11), la casa
// de las Arréforas (n.º 14), el témenos de Atenea Ergane (n.º 6, sitio hipotético) y el recinto de Zeus Polieo, donde se celebran las
// Bufonias (ya en el calendario de fiestas, pero sin altar). El exvoto de los navarcas de Delfos que cita Golvin (p. 51) ya estaba.
// Coordenadas del mundo de Atenas: el Erecteion en (−18, −34), el Partenón en (32, 13); el norte es −z.
function acrGolvin(){if(MODE!=='atenas')return;const free=(x,z,r)=>{try{return isFree(x,z,r);}catch(e){return true;}};
  const at=(x,z,r)=>{if(free(x,z,r))return[x,z];for(let k=1;k<10;k++)for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx*k*2,nz=z+dz*k*2;if(free(nx,nz,r))return[nx,nz];}return[x,z];};
  // el altar de Zeus Hypatos, delante de la puerta este del Erecteion
  {const[x,z]=at(0.5,-34,2);const y=floorAt(x,z);box(2.6,1.1,1.7,M.marble,x,y+0.55,z);box(3,0.2,2.1,M.marble,x,y+0.1,z);addBox(x,z,2.6,1.7,0);
   place('zeus_hypatos','Altar de Zeus Hypatos','ΒΩΜΟΣ ΔΙΟΣ ΥΠΑΤΟΥ','Delante de la entrada del Erecteion, un altar de Zeus el Altísimo. En él no se sacrifica nada que tenga vida: se dejan pasteles, y no se vierte vino. Pausanias lo cuenta como una costumbre muy antigua, de los tiempos del rey Cécrope. Hoy no queda nada.\n(Pausanias I 26.5; J.-C. Golvin, Ciudades del mundo antiguo, p. 52, n.º 11)',x+2.6,z+3,0);}
  // la casa de las Arréforas, al noroeste del Erecteion, junto a la muralla norte
  {const[x,z]=at(-42,-44,6);blockBuilding({name:'Casa de las Arréforas',x,z,rot:0,w:10,d:12,h:3.8,mat:lam('#e3d8c2')});
   place('arreforas','La casa de las Arréforas','ΟΙΚΙΑ ΑΡΡΗΦΟΡΩΝ','Aquí viven durante un año dos niñas de buena familia, de entre siete y once años, las arréforas, que ayudan a tejer el peplo de Atenea. Al final, en una fiesta nocturna, la sacerdotisa les pone en la cabeza unas cestas cuyo contenido ni ella ni las niñas conocen; bajan por un pasadizo hasta un santuario de la ladera, dejan las cestas y suben con otras, también tapadas. De la casa solo quedan los cimientos.\n(Pausanias I 27.3; Golvin, p. 52, n.º 14)',x+7,z+8,0);}
  // el recinto de Zeus Polieo, al noreste del Partenón
  {const[x,z]=at(54,-14,6);const y=floorAt(x,z),c=lam('#d8ccb2');for(const[dx,dz,w,d]of[[0,-8,18,0.6],[0,8,18,0.6],[-9,0,0.6,16],[9,-4,0.6,8]]){box(w,1.2,d,c,x+dx,y+0.6,z+dz);addBox(x+dx,z+dz,w,d,0);}
   box(2.4,1.2,2.4,M.marble,x-2,y+0.6,z);addBox(x-2,z,2.4,2.4,0);
   place('zeus_polieo','Recinto de Zeus Polieo','ΔΙΟΣ ΠΟΛΙΕΩΣ','El patio de Zeus protector de la ciudad, en el punto más alto de la roca. En su altar se celebran en junio las Bufonias: unos bueyes dan vueltas alrededor del grano, y el que come primero es sacrificado; después se juzga quién tuvo la culpa, y se condena… al cuchillo.\n(Pausanias I 24.4 y 28.10; Golvin, p. 52)',x+11,z+4,0);}
  // el témenos de Atenea Ergane: el sitio es hipotético
  {const[x,z]=at(-12,32,2);place('atenea_ergane','Atenea Ergane','ΑΘΗΝΑ ΕΡΓΑΝΗ','Atenea «obrera», la patrona de los artesanos y de las tejedoras: en algún lugar de la Acrópolis tiene un pequeño recinto con sus ofrendas. Pausanias la cita junto al Partenón, pero no se sabe dónde estaba exactamente: Golvin lo pone aquí, al oeste del templo, y también es una hipótesis.\n(Pausanias I 24.3; Golvin, p. 52, n.º 6)',x,z,0);}}
{const f=definePlaces;definePlaces=function(){const r=f.apply(this,arguments);try{acrGolvin();}catch(e){console.warn('acr',e);}return r;};}
