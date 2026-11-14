// abre el juego en Chromium sirviendo three.js en local (la CDN no es accesible desde aquí)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const NM=path.join(__dirname,'node_modules/three');
exports.open=async function(query,opts={}){
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:opts.viewport||{width:1280,height:800}});
  await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync(NM+'/build/three.min.js'),contentType:'text/javascript'}));
  await p.route('**/three@0.128.0/examples/js/**',r=>{const u=r.request().url(),f=u.split('/examples/js/')[1];if(f.includes('GLTFLoader'))return r.fulfill({body:fs.readFileSync(NM+'/examples/js/loaders/GLTFLoader.js'),contentType:'text/javascript'});r.fulfill({body:fs.readFileSync(NM+'/examples/js/'+f),contentType:'text/javascript'});});
  await p.route('**/GLTFLoader.js',r=>r.fulfill({body:fs.readFileSync(NM+'/examples/js/loaders/GLTFLoader.js'),contentType:'text/javascript'}));
  p.errs=[];p.on('pageerror',e=>p.errs.push('ERR '+e.message));p.on('console',m=>{if(m.type()==='error')p.errs.push('CON '+m.text().slice(0,300));});
  await p.goto('http://localhost:8386/'+(process.env.HTMLF||'atenas.html')+query);
  p.browser_=b;return p;
};
exports.ready=p=>p.waitForFunction(()=>!document.getElementById('go').disabled,null,{timeout:300000});
// textos visibles que parecen español (para el modo inglés)
exports.spanish=p=>p.evaluate(()=>{
  const re=/[áéíóúñ¿¡]|\b(de la|del|los|las|que|con|por|para|una|el|y|en el|es)\b/i;
  const out=new Set();const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  for(let n=tw.nextNode();n;n=tw.nextNode()){const el=n.parentElement;if(!el||el.closest('[hidden]')||el.closest('script,style'))continue;
    const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')continue;const t=n.nodeValue.trim();if(t&&re.test(t))out.add(t.slice(0,140));}
  return [...out];});
