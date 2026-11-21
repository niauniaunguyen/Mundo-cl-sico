# Uso único (ya aplicado): parte el <script> principal de fuente/atenas.src.html en módulos fuente/codigo/NNN_nombre.js,
# cortando por las marcas «// ====…» de sección. construir.py los vuelve a unir en orden alfabético en el marcador @@CODIGO@@.
import pathlib, re, unicodedata
raiz = pathlib.Path(__file__).resolve().parent.parent
src = (raiz / 'fuente' / 'atenas.src.html').read_text(encoding='utf-8')
lines = src.splitlines(keepends=True)
i0 = next(i for i, l in enumerate(lines) if l.strip() == '<script>' and i > 500) + 1
i1 = max(i for i, l in enumerate(lines) if l.strip() == '</script>')
code = lines[i0:i1]
MARK = '// ============================================================ '
cuts = [0] + [i for i, l in enumerate(code) if l.startswith(MARK) and i > 0] + [len(code)]
secs = [code[a:b] for a, b in zip(cuts, cuts[1:])]
merged = []
for s in secs:   # las secciones muy cortas se juntan con la anterior
    if merged and len(s) < 40: merged[-1] += s
    else: merged.append(list(s))
def slug(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower()
    t = re.sub(r'[^a-z0-9]+', '_', t).strip('_')
    return '_'.join(t.split('_')[:5]) or 'inicio'
out = raiz / 'fuente' / 'codigo'; out.mkdir(exist_ok=True)
for f in out.glob('*.js'): f.unlink()
for n, s in enumerate(merged):
    first = s[0][len(MARK):] if s[0].startswith(MARK) else 'inicio'
    name = f'{n:03d}_{slug(first.split(":")[0])}.js'
    (out / name).write_text(''.join(s), encoding='utf-8')
tpl = ''.join(lines[:i0]) + '@@CODIGO@@' + ''.join(lines[i1:])
(raiz / 'fuente' / 'atenas.src.html').write_text(tpl, encoding='utf-8')
print(len(merged), 'módulos')
