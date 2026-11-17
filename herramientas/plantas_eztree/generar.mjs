// Genera modelos/arbustos.glb (los arbustos de detalle de 203_arbustos_de_detalle.js) y una vista previa.
//   cd herramientas/plantas_eztree && npm i --ignore-scripts && git clone --depth 1 https://github.com/dgreenheck/ez-tree ez-tree-src
//   node generar.mjs [vista.png]
// EZ-Tree (MIT): https://github.com/dgreenheck/ez-tree — se usa su generador de ramas y hojas; las texturas son propias (hojas.js).
import { execFileSync } from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import { createRequire } from 'node:module';
const here=path.dirname(new URL(import.meta.url).pathname),tmp=fs.mkdtempSync(path.join(here,'.tmp-'));
execFileSync(path.join(here,'node_modules/.bin/esbuild'),['pagina.js','--bundle','--format=iife','--alias:ez-tree=./ez-tree-src/src/lib/index.js','--outfile='+path.join(tmp,'b.js'),'--preserve-symlinks','--log-level=error'],{cwd:here,stdio:'inherit'});
fs.writeFileSync(path.join(tmp,'i.html'),'<!doctype html><body style="margin:0"><script src="b.js"></script>');
const srv=http.createServer((q,r)=>{const f=path.join(tmp,path.basename(q.url.split('?')[0]));if(!fs.existsSync(f)){r.statusCode=404;return r.end();}r.end(fs.readFileSync(f));}).listen(0);
const { chromium }=createRequire(import.meta.url)('playwright');const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:440}});
p.on('pageerror',e=>console.log('error:',e.message));await p.goto('http://localhost:'+srv.address().port+'/i.html');await p.waitForFunction(()=>window.__done,null,{timeout:300000});
const r=await p.evaluate(()=>({info:window.__info,err:window.__err,glb:window.__glb}));console.log(r.info.join('\n'));if(r.err)throw new Error(r.err);
const out=path.join(here,'..','..','modelos','arbustos.glb');fs.writeFileSync(out,Buffer.from(r.glb,'base64'));console.log('→',out,fs.statSync(out).size,'bytes');
if(process.argv[2])await p.screenshot({path:process.argv[2]});await b.close();srv.close();fs.rmSync(tmp,{recursive:true});
