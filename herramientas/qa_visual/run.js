// node run.js "<query>" script.js  → el script exporta async (p,P,shot)=>{}
const P=require('./page.js');
(async()=>{const [q,sc,out]=process.argv.slice(2);const p=await P.open(q);await P.ready(p);
 const shot=async n=>p.screenshot({timeout:200000,path:(out||(process.env.SALIDA||require('os').tmpdir()+'/nostos'))+'_'+n+'.png'});
 try{await require(require('path').resolve(sc))(p,P,shot);}catch(e){console.log('FALLO',e.message);}
 console.log(p.errs.join('\n')||'sin errores');await p.browser_.close();})();
