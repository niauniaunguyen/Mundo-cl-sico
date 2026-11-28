// node run.js "<query>" prueba.js   (el juego se sirve en http://localhost:8386; todo.sh lo arranca solo)
const P=require('../qa_visual/page.js');
(async()=>{const [q,sc]=process.argv.slice(2);const p=await P.open(q);await P.ready(p);
 try{await require(require('path').resolve(sc))(p,P,async n=>p.screenshot({path:(process.env.SALIDA||require('os').tmpdir()+'/nostos')+'_'+n+'.png',timeout:200000}));}catch(e){console.log('✗ FALLO',e.message);process.exitCode=1;}
 const errs=p.errs.filter(e=>!/rc:mirador/.test(e));console.log(errs.length?'✗ errores de consola:\n'+errs.join('\n'):'✓ sin errores de consola');if(errs.length)process.exitCode=1;await p.browser_.close();})();
