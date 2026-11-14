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
