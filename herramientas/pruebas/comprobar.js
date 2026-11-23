// Comprobaciones rápidas, sin navegador (unos segundos):  node herramientas/pruebas/comprobar.js
// 1. construye atenas.html (python3 fuente/construir.py)   2. sintaxis del código   3. funciones declaradas dos veces
// 4. funciones del bucle (gfTick) que no existen   5. marcadores @@ sin sustituir   6. tamaño del archivo
// 7. envolturas ({const f=X;X=function…}) sobre funciones que no existen o que no se pueden reasignar, o que no llaman a la original
// 8. traducciones pegadas a la palabra anterior («return_t(…)»)
// Sale con código 1 si algo falla (los avisos no cuentan como fallo).
const fs=require('fs'),path=require('path'),vm=require('vm'),{execSync}=require('child_process');
const raiz=path.resolve(__dirname,'..','..'),dir=path.join(raiz,'fuente','codigo');let fallos=0,avisos=0;
const mal=m=>{fallos++;console.log('✗ '+m);},ojo=m=>{avisos++;console.log('· '+m);},bien=m=>console.log('✓ '+m);
try{const o=execSync('python3 fuente/construir.py',{cwd:raiz,encoding:'utf8'});bien('construido: '+o.trim().split('\n').pop());}catch(e){mal('construir.py ha fallado:\n'+(e.stdout||'')+(e.stderr||''));process.exit(1);}
const html=fs.readFileSync(path.join(raiz,'Nóstos.html'),'utf8');   // la versión de un solo archivo: el código entero en un <script>
// 2. sintaxis: el <script> más largo
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);const code=scripts.reduce((a,b)=>b.length>a.length?b:a,'');
try{new vm.Script(code,{filename:'atenas.html'});bien('sintaxis correcta ('+Math.round(code.length/1e3)+' KB de código)');}catch(e){
  // dónde: node --check sobre el código extraído da la línea; se busca esa línea en los módulos para decir en cuál está
  let donde='';try{const tmp=path.join(require('os').tmpdir(),'nostos_main.js');fs.writeFileSync(tmp,code);execSync('node --check '+tmp,{stdio:'pipe'});}catch(c){const m=/:(\d+)\n/.exec(String(c.stderr||''));if(m){const ln=code.split('\n')[+m[1]-1]||'';const f=fs.readdirSync(dir).filter(f=>f.endsWith('.js')).find(f=>fs.readFileSync(path.join(dir,f),'utf8').includes(ln.trim().slice(0,80)));donde='\n  en '+(f||'¿?')+': '+ln.trim().slice(0,160);}}
  mal('error de sintaxis: '+e.message+donde);}
// 3. funciones de primer nivel declaradas dos veces (la segunda pisa a la primera sin avisar)
const mods=fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort(),decl=new Map();
for(const f of mods){const L=fs.readFileSync(path.join(dir,f),'utf8').split('\n');L.forEach((l,i)=>{const m=/^function\s+([A-Za-z_$][\w$]*)\s*\(/.exec(l);if(m){if(!decl.has(m[1]))decl.set(m[1],[]);decl.get(m[1]).push(f+':'+(i+1));}});}
const dup=[...decl].filter(([,v])=>v.length>1);if(dup.length)for(const[k,v]of dup)mal('función declarada dos veces: '+k+' → '+v.join(', '));else bien(decl.size+' funciones de primer nivel, ninguna repetida');
// 4. el bucle: cada xxxTick(...) llamado en gfTick existe
const all=mods.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n');const gf=/function gfTick\(dt\)\{([^\n]*)/.exec(all);
if(gf){const names=[...new Set([...gf[1].matchAll(/([A-Za-z_$][\w$]*)\((?:dt)?\);/g)].map(m=>m[1]))];const miss=names.filter(n=>!new RegExp('(^|[^\\w$.])(function\\s+'+n+'\\s*\\(|(const|let|var)\\s+'+n+'\\s*=|'+n+'\\s*=\\s*function)','m').test(all));
  if(miss.length)mal('el bucle llama a funciones que no existen: '+miss.join(', '));else bien('bucle: '+names.length+' funciones, todas existen');}else ojo('no encuentro gfTick');
// 7. envolturas: muchos módulos añaden comportamiento a una función de otro con {const f=X;X=function(…){f(…);…}}.
//    Falla si X no es una función ni un let/var (sería un error al cargar); avisa si la envoltura no llama nunca a f (la sustituye sin decirlo).
{const reW=/(?<![\w$.])const\s+([\w$]+)\s*=\s*([A-Za-z_$][\w$]*)\s*;\s*\2\s*=\s*(?:async\s+)?function\s*\([^)]*\)\s*\{/g;let nW=0,malW=[],sinF=[];
  for(const f of mods){const s=fs.readFileSync(path.join(dir,f),'utf8');let m;reW.lastIndex=0;while((m=reW.exec(s))){nW++;const v=m[1],X=m[2],ln=s.slice(0,m.index).split('\n').length;
    if(!new RegExp('(^|[\\n;])\\s*(async\\s+)?function\\s+'+X.replace(/\$/g,'\\$')+'\\s*\\(|(^|\\n)(let|var)\\s+'+X.replace(/\$/g,'\\$')+'\\s*=').test(all))malW.push(X+' ('+f+':'+ln+')');
    if(/^\s*\}/.test(s.slice(reW.lastIndex))){nW--;continue;}   // X=function(){}: silenciar un momento, no es ampliar
    let i=reW.lastIndex,d=1;while(i<s.length&&d){const c=s[i++];if(c==='{')d++;else if(c==='}')d--;}
    if(!new RegExp('(^|[^\\w$.])'+v.replace(/\$/g,'\\$')+'\\s*(\\(|\\.apply|\\.call)').test(s.slice(reW.lastIndex,i)))sinF.push(X+' ('+f+':'+ln+')');}}
  if(malW.length)mal('envolturas sobre algo que no es una función reasignable: '+malW.join(', '));else bien(nW+' envolturas, todas sobre funciones que existen');
  if(sinF.length)ojo('envolturas que no llaman a la función original: '+sinF.join(', '));}
// 8. traducciones pegadas: el constructor envuelve los textos en _t(n,'…'); si queda pegado a una palabra («return_t(») el juego falla al llegar ahí
{const g=[...new Set((code.match(/[\w$]_tt?\(\d+,/g)||[]))];if(g.length)mal('traducciones pegadas a la palabra anterior: '+g.slice(0,5).join(' '));else bien('traducciones bien separadas');}
// 5. marcadores sin sustituir
const left=html.match(/@@(GLB2?|RAFAEL|VER|TSIG|CODIGO)@@/g);   // marcadores de construcción (@@RF@@ es un marcador interno de la biblioteca)
if(left)mal('marcadores sin sustituir: '+[...new Set(left)].join(', '));else bien('sin marcadores pendientes');
// 6. tamaño
{const pg=fs.statSync(path.join(raiz,'atenas.html')).size/1e6,dd=path.join(raiz,'datos'),F=fs.readdirSync(dd).map(f=>[f,fs.statSync(path.join(dd,f)).size/1e6]),big=F.reduce((a,b)=>b[1]>a[1]?b:a,['',0]),tot=F.reduce((a,b)=>a+b[1],0);
  // una página de Claude admite 16 MB por archivo: la página ligera y cada archivo de datos/ deben quedar por debajo (con margen, 15)
  if(pg>1)mal('atenas.html pesa '+pg.toFixed(2)+' MB: debería ser la página ligera');else if(big[1]>15)mal('datos/'+big[0]+' pesa '+big[1].toFixed(1)+' MB (máximo 15 por archivo)');else if(big[1]>13)ojo('datos/'+big[0]+' pesa '+big[1].toFixed(1)+' MB (cerca del límite de 15 por archivo)');
  else bien('atenas.html '+Math.round(pg*1000)+' KB + datos/ '+tot.toFixed(1)+' MB en '+F.length+' archivos (el mayor, '+big[0]+', '+big[1].toFixed(1)+' MB)');}
console.log(fallos?'\n'+fallos+' fallo(s)'+(avisos?', '+avisos+' aviso(s)':''):'\nTodo bien'+(avisos?' ('+avisos+' aviso(s))':''));process.exit(fallos?1:0);
