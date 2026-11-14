// ¿Atraviesa alguien un edificio? Observa durante SEG segundos (por defecto 60) a todos los que se mueven
// (paseantes, personajes con horario, figuras de sucesos, animales) y apunta a quien pisa dentro de una colisión.
// Uso: SEG=60 node run.js '?modo=atenas#debug' atraviesan.js   (ZONA=x,z para colocar al jugador en otro sitio)
module.exports=async(p)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const SEG=+(process.env.SEG||60);
 await p.evaluate(()=>{const s=__d.state;s.pj={name:'Nía',g:'f',o:(location.search.includes('roma')?'roma':'quios')};s.tut=1;});await p.evaluate(()=>__d.startGame());await W(3000);
 await p.evaluate((z)=>{const d=__d,pl=d.getP();if(z){const[x,zz]=z.split(',').map(Number);pl.x=x;pl.z=zz;pl.feet=d.floorAt(x,zz);pl.camY=pl.feet+1.6;}d.setUi('play');d.setH(10.5);window.__atr={};},process.env.ZONA||'');
 const t0=Date.now();while(Date.now()-t0<SEG*1000){await p.evaluate(()=>{const d=__d,ff=d.AUD3().isFree,A=window.__atr,pl=d.getP();
   const chk=(tipo,g,id)=>{if(!g||!g.visible)return;const x=g.position.x,z=g.position.z;if(Math.hypot(x-pl.x,z-pl.z)>160)return;if(!ff(x,z,0.15)){const k=tipo+':'+id;const e=A[k]||(A[k]={n:0,x:Math.round(x),z:Math.round(z)});e.n++;}};
   d.getW().forEach((w,i)=>{if(!w.home&&w.moving)chk('paseante('+w.mode+')',w.g,i);});
   d.QA().npcObjs.forEach(n=>{if(n.rtWalk)chk('personaje',n.g,n.data.id);});
   const V=d.VIV&&d.VIV();if(V&&V.evt&&V.evt.objs)V.evt.objs.forEach((o,i)=>chk('suceso '+V.evt.k,o,i));});await W(500);}
 const A=await p.evaluate(()=>window.__atr);const L=Object.entries(A).sort((a,b)=>b[1].n-a[1].n);
 console.log('Dentro de una colisión: '+L.length+' figuras');for(const[k,v]of L.slice(0,25))console.log('  '+k+' · '+v.n+' veces · primera vez en '+v.x+','+v.z);};
