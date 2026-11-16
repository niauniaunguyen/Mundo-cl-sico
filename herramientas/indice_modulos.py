# Escribe fuente/codigo/INDICE.md: cada módulo con su número de líneas y las secciones («// ====…») que contiene.
# Lo llama construir.py en cada construcción, así que el índice nunca se queda viejo.
import pathlib
raiz = pathlib.Path(__file__).resolve().parent.parent
d = raiz / 'fuente' / 'codigo'
MARK = '// ============================================================ '
filas = ['# Índice de módulos', '', 'Generado por `herramientas/indice_modulos.py` al construir. Los módulos se unen en este orden (alfabético).', '',
         '| Módulo | Líneas | Secciones |', '|---|---:|---|']
for f in sorted(d.glob('*.js')):
    L = f.read_text(encoding='utf-8').split('\n')
    secs = [l[len(MARK):].strip().replace('|', '/')[:110] for l in L if l.startswith(MARK)]
    filas.append(f'| `{f.name}` | {len(L)} | ' + ('<br>'.join(secs) if secs else '(inicio del código)') + ' |')
(d / 'INDICE.md').write_text('\n'.join(filas) + '\n', encoding='utf-8')

# Escribe también fuente/codigo/ENVOLTURAS.md: qué funciones se amplían desde otros módulos ({const f=X;X=function(…){f(…);…}}) y en qué orden.
# Al llamar a X se ejecuta primero la ÚLTIMA envoltura de la lista, que llama a la anterior, y así hasta la original.
import re
reW = re.compile(r'(?<![\w$.])const\s+[\w$]+\s*=\s*([A-Za-z_$][\w$]*)\s*;\s*\1\s*=\s*(?:async\s+)?function')
reD = re.compile(r'(?m)^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(')
orig, capas = {}, {}
for f in sorted(d.glob('*.js')):
    s = f.read_text(encoding='utf-8')
    for m in reD.finditer(s): orig.setdefault(m.group(1), f.name)
    for m in reW.finditer(s):
        if re.match(r'\s*\([^)]*\)\s*\{\s*\}', s[m.end():]): continue   # silenciar un momento (X=function(){}) no es ampliar
        capas.setdefault(m.group(1), []).append(f'`{f.name[:3]}`:{s.count(chr(10), 0, m.start()) + 1}')
filas = ['# Envolturas', '', 'Generado por `herramientas/indice_modulos.py` al construir.', '',
         'Muchos módulos amplían una función de otro sin tocarla: `{const f=X;X=function(…){f(…); …lo nuevo…}}`.',
         'Esta tabla dice, para cada función ampliada, dónde nace y qué módulos la amplían, en orden (`número de módulo:línea`).',
         'Al llamar a la función se ejecuta primero la última capa, que llama a la anterior, y así hasta la original.',
         '`herramientas/pruebas/comprobar.js` falla si una capa apunta a algo que no es una función, y avisa si una capa no llama a la anterior.', '',
         f'{len(capas)} funciones ampliadas, {sum(map(len, capas.values()))} capas.', '',
         '| Función | Nace en | Capas | Ampliada en |', '|---|---|---:|---|']
for k, v in sorted(capas.items(), key=lambda x: (-len(x[1]), x[0].lower())):
    filas.append(f'| `{k}` | `{orig.get(k, "?")}` | {len(v)} | ' + ' · '.join(v) + ' |')
(d / 'ENVOLTURAS.md').write_text('\n'.join(filas) + '\n', encoding='utf-8')
