// Huella del mundo: dónde están los edificios y casas, las estelas y las llegadas a cada mapa. Si cambia sin querer, algo ha
// alterado el orden del generador aleatorio R() del mundo (por ejemplo, código nuevo que llama a R() durante la construcción)
// y las casas, los árboles y la gente se han movido de sitio. Si el cambio es a propósito: ACTUALIZAR=1 para guardar la nueva.
const fs=require('fs'),path=require('path');
module.exports=async(p)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const modo=await p.evaluate(()=>/roma/.test(location.search)?'roma':'atenas');
 await p.evaluate(m=>{const s=__d.state;s.tut=1;s.pj={name:'Nía',g:'f',o:m==='roma'?'malaca':'quios'};},modo);await p.evaluate(()=>__d.startGame());await W(1500);
 const h=await p.evaluate(()=>{const r=v=>Math.round(v*10)/10,d=__d;
   // solo cosas fijas, que salen de R() al construir: edificios y casas, estelas y llegadas (la gente se mueve al arrancar; los mapas lejanos, x≥8000, se construyen poco a poco y no cuentan)
   const W=d.footprints.filter(f=>f.x<8000).map(f=>[r(f.x),r(f.z),r(f.r||0)]),N=d.PLACES.map(q=>[q.id,r(q.x),r(q.z)]),I=d.ISL().filter(q=>q.arrive).map(q=>[q.id,r(q.arrive.x),r(q.arrive.z)]);
   const H=v=>{const s=JSON.stringify(v);let a=2166136261;for(let i=0;i<s.length;i++){a^=s.charCodeAt(i);a=Math.imul(a,16777619)>>>0;}return a.toString(16);};
   return{huella:H([W,N,I]),partes:{edificios:H(W),estelas:H(N),mapas:H(I)},edificios:W.length,estelas:N.length,mapas:I.length,muestra:W.slice(0,3)};});
 const f=path.join(__dirname,'huella_'+modo+'.json');
 if(process.env.ACTUALIZAR||!fs.existsSync(f)){fs.writeFileSync(f,JSON.stringify(h,null,1));console.log('huella '+modo+' guardada: '+h.huella+' ('+h.edificios+' edificios, '+h.estelas+' estelas, '+h.mapas+' mapas)');return;}
 const ref=JSON.parse(fs.readFileSync(f,'utf8'));
 if(ref.huella===h.huella)console.log('✓ huella '+modo+' igual: '+h.huella);
 else{console.log('✗ LA HUELLA DEL MUNDO HA CAMBIADO ('+modo+'): '+ref.huella+' → '+h.huella+'\n  edificios '+ref.edificios+' → '+h.edificios+', estelas '+ref.estelas+' → '+h.estelas+', mapas '+ref.mapas+' → '+h.mapas+
   '\n  partes que cambian: '+Object.keys(h.partes).filter(k=>!ref.partes||ref.partes[k]!==h.partes[k]).join(', ')+'\n  primeros edificios antes '+JSON.stringify(ref.muestra)+' · ahora '+JSON.stringify(h.muestra)+'\n  ¿Alguien llama a R() durante la construcción del mundo? Si el cambio es a propósito: ACTUALIZAR=1');process.exitCode=1;}};
