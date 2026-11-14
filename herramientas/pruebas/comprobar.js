// Comprobaciones rápidas, sin navegador (unos segundos):  node herramientas/pruebas/comprobar.js
// 1. construye atenas.html (python3 fuente/construir.py)   2. sintaxis del código   3. funciones declaradas dos veces
// 4. funciones del bucle (gfTick) que no existen   5. marcadores @@ sin sustituir   6. tamaño del archivo
// Sale con código 1 si algo falla (los avisos no cuentan como fallo).
const fs=require('fs'),path=require('path'),vm=require('vm'),{execSync}=require('child_process');
const raiz=path.resolve(__dirname,'..','..'),dir=path.join(raiz,'fuente','codigo');let fallos=0,avisos=0;
const mal=m=>{fallos++;console.log('✗ '+m);},ojo=m=>{avisos++;console.log('· '+m);},bien=m=>console.log('✓ '+m);
try{const o=execSync('python3 fuente/construir.py',{cwd:raiz,encoding:'utf8'});bien('construido: '+o.trim().split('\n').pop());}catch(e){mal('construir.py ha fallado:\n'+(e.stdout||'')+(e.stderr||''));process.exit(1);}
const html=fs.readFileSync(path.join(raiz,'atenas.html'),'utf8');
// 2. sintaxis: el <script> más largo
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);const code=scripts.reduce((a,b)=>b.length>a.length?b:a,'');
try{new vm.Script(code,{filename:'atenas.html'});bien('sintaxis correcta ('+Math.round(code.length/1e3)+' KB de código)');}catch(e){mal('error de sintaxis: '+e.message+'\n'+(e.stack||'').split('\n').slice(0,3).join('\n'));}
// 3. funciones de primer nivel declaradas dos veces (la segunda pisa a la primera sin avisar)
const mods=fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort(),decl=new Map();
for(const f of mods){const L=fs.readFileSync(path.join(dir,f),'utf8').split('\n');L.forEach((l,i)=>{const m=/^function\s+([A-Za-z_$][\w$]*)\s*\(/.exec(l);if(m){if(!decl.has(m[1]))decl.set(m[1],[]);decl.get(m[1]).push(f+':'+(i+1));}});}
const dup=[...decl].filter(([,v])=>v.length>1);if(dup.length)for(const[k,v]of dup)mal('función declarada dos veces: '+k+' → '+v.join(', '));else bien(decl.size+' funciones de primer nivel, ninguna repetida');
// 4. el bucle: cada xxxTick(...) llamado en gfTick existe
const all=mods.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n');const gf=/function gfTick\(dt\)\{([^\n]*)/.exec(all);
if(gf){const names=[...new Set([...gf[1].matchAll(/([A-Za-z_$][\w$]*)\((?:dt)?\);/g)].map(m=>m[1]))];const miss=names.filter(n=>!new RegExp('(^|[^\\w$.])(function\\s+'+n+'\\s*\\(|(const|let|var)\\s+'+n+'\\s*=|'+n+'\\s*=\\s*function)','m').test(all));
  if(miss.length)mal('el bucle llama a funciones que no existen: '+miss.join(', '));else bien('bucle: '+names.length+' funciones, todas existen');}else ojo('no encuentro gfTick');
// 5. marcadores sin sustituir
const left=html.match(/@@(GLB2?|RAFAEL|VER|CODIGO)@@/g);   // marcadores de construcción (@@RF@@ es un marcador interno de la biblioteca)
if(left)mal('marcadores sin sustituir: '+[...new Set(left)].join(', '));else bien('sin marcadores pendientes');
// 6. tamaño
const mb=Buffer.byteLength(html)/1e6;if(mb>14)mal('atenas.html pesa '+mb.toFixed(1)+' MB (máximo 14)');else if(mb>12)ojo('atenas.html pesa '+mb.toFixed(1)+' MB (cerca del límite)');else bien('tamaño '+mb.toFixed(2)+' MB');
console.log(fallos?'\n'+fallos+' fallo(s)'+(avisos?', '+avisos+' aviso(s)':''):'\nTodo bien'+(avisos?' ('+avisos+' aviso(s))':''));process.exit(fallos?1:0);
