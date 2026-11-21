// Saca del juego los datos de cada destino para dem_todos.py (abrir con ?sinrelieve=1 para leer el relieve inventado):
//   OUTF=mapas_atenas.json node herramientas/pruebas/run.js "?modo=atenas&sinrelieve=1#debug" herramientas/relieve_real/mapas.js
const fs=require('fs');module.exports=async(p)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));
 await p.evaluate(()=>{const s=__d.state;s.tut=1;s.pj={name:'Ann',g:'f',o:'x'};});await p.evaluate(()=>__d.startGame());await W(2000);
 const L=await p.evaluate(()=>{const Q=__d.QA(),MP=Q.MODE==='roma'?Q.MED_POS_RO:Q.MED_POS,out=[];
  for(const I of Q.ISLANDS){if(!I||!isFinite(I.x))continue;const ll=MP[I.id];const st=30,half=I.R*1.45+30,n=Math.ceil(2*half/st)+1,H=[];
   for(let j=0;j<n;j++)for(let i=0;i<n;i++)H.push(Math.round(Q.islandBase(I,I.x-half+i*st,I.z-half+j*st)*10)/10);
   out.push({id:I.id,name:I.name,R:I.R,land:!!I.land,sea:I.sea,coast:I.coast||null,coastAt:I.coastAt||null,flat:!!I.flat,ll:ll||null,half,n,st,H,
     pads:I.pads.filter(p=>!p.road).map(p=>[Math.round(p.x-I.x),Math.round(p.z-I.z),Math.round(p.r),Math.round(p.h*10)/10]),dem:!!I.dem});}
  return {mode:Q.MODE,maps:out};});
 fs.writeFileSync(process.env.OUTF,JSON.stringify(L));console.log(L.mode,L.maps.length,'sin coordenadas:',L.maps.filter(m=>!m.ll).map(m=>m.id).join(' '));};
