module.exports=async(p)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));
 await p.evaluate(()=>{const s=__d.state;s.tut=1;s.pj={name:'Marco',g:'m',o:'roma'};});await p.evaluate(()=>__d.startGame());await W(2000);
 const out=await p.evaluate(()=>{const Q=__d.QA(),A=__d.AUD3(),fl=(x,z)=>Q.floorAt(x,z);
  const NEW=['siracusa','aetna','caralis','aleria','ostia','tibur','praeneste','capua','cumae','pompeii','tarentum','aquileia','ravenna','mediolanum','alpes','agrigentum','segesta','corinthus','athenae','delos','ephesus','pergamum','rhodus','antiochia','hierosolyma','cyprus','melita','cyrene','olisipo','londinium','caledonia','colonia','mogontiacum','carnuntum','salona','caesarea_m','cirta','emona','henna','selinus','eleusis','smyrna','tyrus','galilaea','eboracum','treveri','zama'];
  const inHouse=(x,z)=>A.footprints.some(f=>f.house&&!f.r&&Math.abs(x-f.x)<(f.w||0)/2&&Math.abs(z-f.z)<(f.d||0)/2);
  const R=[];for(const id of NEW){const I=Q.ISLANDS.find(i=>i.id===id);if(!I){R.push(id+': NO EXISTE');continue;}const inI=(x,z)=>Q.islandOf(x)===I;const P=[];
   const chk=(lab,x,z,wet)=>{if(!isFinite(x)){P.push(lab+' sin posición');return;}const h=fl(x,z);if(h<0.3&&!wet)P.push(lab+' en el agua (h '+h.toFixed(1)+')');if(inHouse(x,z))P.push(lab+' dentro de una casa');if(!A.isFree(x,z,0.5))P.push(lab+' bloqueado');};
   chk('llegada',I.arrive.x,I.arrive.z);
   for(const n of Q.npcObjs)if(inI(n.x,n.z)){if(fl(n.x,n.z)<0.3)P.push('PNJ '+n.data.name+' en el agua');if(inHouse(n.x,n.z))P.push('PNJ '+n.data.name+' dentro de una casa');}
   for(const s of Q.PLACES)if(inI(s.x,s.z)&&Math.abs(s.x-I.x)<1500){const h=fl(s.x,s.z);if(h<0.3)P.push('estela «'+s.name+'» en el agua');if(inHouse(s.x,s.z))P.push('estela «'+s.name+'» dentro de una casa');}
   for(const o of Q.EGX_OBJS)if(inI(o.x,o.z)&&o.r>0&&Math.abs(o.x-I.x)<1500){if(inHouse(o.x,o.z))P.push('objeto «'+o.data.name+'» dentro de una casa');}
   for(const g of A.GATES_W)if(g.from===id){if(inHouse(g.x,g.z))P.push('puerta a '+g.to+' dentro de una casa');if(fl(g.x,g.z)<0.3)P.push('puerta a '+g.to+' en el agua');
     if(g.path)for(const q of g.path)if(inHouse(q[0],q[1])){P.push('camino a '+g.to+' cruza una casa');break;}}
   if(P.length)R.push(id+': '+[...new Set(P)].join('; '));}
  return R.join('\n')||'todo bien';});console.log(out);};
