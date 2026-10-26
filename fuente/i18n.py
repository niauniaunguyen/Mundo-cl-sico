# Traducción del juego: localiza los literales de cadena del script principal y los envuelve para que,
# en tiempo de ejecución, se sustituyan por la traducción del idioma elegido.
#   'texto'              -> _t(ID,'texto')
#   `Lecciones ${a}/${b}` -> _tt(ID,["Lecciones ","/",""],a,b)     (clave del diccionario: «Lecciones {0}/{1}»)
# Los diccionarios están en fuente/i18n/<idioma>/*.json como {"texto en español": "traducción"}.
# Uso como herramienta:  python fuente/i18n.py pendientes ca   -> fuente/i18n/pendientes_ca.json (lo que falta)
import json, re, sys, pathlib

KEYWORDS_BEFORE_REGEX = {'return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'instanceof', 'yield', 'await'}
IDCH = re.compile(r'[A-Za-z0-9_$\u00c0-\uffff]')


def decode(raw, tpl=False):
    """Valor de un literal JS a partir de su texto sin comillas."""
    out = []; i = 0; n = len(raw)
    while i < n:
        c = raw[i]
        if c != '\\':
            if tpl and c == '\r':  # en las plantillas \r\n cuenta como \n
                out.append('\n'); i += 2 if raw[i+1:i+2] == '\n' else 1; continue
            out.append(c); i += 1; continue
        i += 1; c = raw[i]
        if c == 'n': out.append('\n')
        elif c == 't': out.append('\t')
        elif c == 'r': out.append('\r')
        elif c == 'b': out.append('\b')
        elif c == 'f': out.append('\f')
        elif c == 'v': out.append('\v')
        elif c == '0' and not raw[i+1:i+2].isdigit(): out.append('\0')
        elif c == 'x': out.append(chr(int(raw[i+1:i+3], 16))); i += 2
        elif c == 'u':
            if raw[i+1] == '{':
                j = raw.index('}', i); out.append(chr(int(raw[i+2:j], 16))); i = j
            else:
                out.append(chr(int(raw[i+1:i+5], 16))); i += 4
        elif c == '\r':
            if raw[i+1:i+2] == '\n': i += 1
        elif c in '\n\u2028\u2029': pass
        else: out.append(c)
        i += 1
    s = ''.join(out)
    # pares sustitutos (\ud83c\udfdb) -> un solo carácter
    return s.encode('utf-16', 'surrogatepass').decode('utf-16')


class Scanner:
    """Tokenizador mínimo de JavaScript: lo justo para encontrar cadenas, plantillas, comentarios y expresiones regulares."""

    def __init__(self, code):
        self.c = code; self.n = len(code)

    def scan(self, i, until_brace=False):
        """Devuelve (nodos, fin). Con until_brace se detiene en la llave que cierra una expresión ${...}."""
        c = self.c; n = self.n; nodes = []; prev = None  # prev: último token significativo ('id:x', 'num', 'str', 'p:x')
        depth = 0; pending_key = []
        while i < n:
            ch = c[i]
            if ch in ' \t\n\r\u2028\u2029\ufeff': i += 1; continue
            if c.startswith('//', i):
                j = c.find('\n', i); i = n if j < 0 else j; continue
            if c.startswith('/*', i):
                i = c.index('*/', i + 2) + 2; continue
            if ch in '\'"':
                j = i + 1
                while c[j] != ch:
                    j += 2 if c[j] == '\\' else 1
                node = {'t': 's', 's': i, 'e': j + 1, 'v': decode(c[i+1:j]), 'key': prev in ('p:{', 'p:,')}
                nodes.append(node); prev = 'str'; i = j + 1
                if node['key']:
                    k = i
                    while c[k] in ' \t\n\r': k += 1
                    node['key'] = c[k] == ':'
                continue
            if ch == '`':
                node, i = self.template(i); nodes.append(node); prev = 'str'; continue
            if ch == '/':
                regex = prev is None or prev.startswith('p:') and prev not in ('p:)', 'p:]', 'p:}') or (prev.startswith('id:') and prev[3:] in KEYWORDS_BEFORE_REGEX)
                if regex:
                    j = i + 1; cls = False
                    while True:
                        d = c[j]
                        if d == '\\': j += 2; continue
                        if d == '[': cls = True
                        elif d == ']': cls = False
                        elif d == '/' and not cls: break
                        j += 1
                    j += 1
                    while j < n and IDCH.match(c[j]): j += 1
                    prev = 'str'; i = j; continue
                prev = 'p:/'; i += 1; continue
            if IDCH.match(ch):
                j = i
                if ch.isdigit():
                    while j < n and (IDCH.match(c[j]) or c[j] == '.' or (c[j] in '+-' and c[j-1] in 'eE' and not c[i:i+2].lower().startswith('0x'))): j += 1
                    prev = 'num'
                else:
                    while j < n and IDCH.match(c[j]): j += 1
                    prev = 'id:' + c[i:j]
                i = j; continue
            if ch == '.' and i + 1 < n and c[i+1].isdigit():
                j = i + 1
                while j < n and (IDCH.match(c[j])): j += 1
                prev = 'num'; i = j; continue
            if ch == '{': depth += 1
            elif ch == '}':
                if until_brace and depth == 0: return nodes, i
                depth -= 1
            # operadores de varios caracteres: basta con tratarlos carácter a carácter salvo ++ y -- (que terminan expresión)
            if ch in '+-' and c[i+1:i+2] == ch:
                prev = 'p:)' if prev and (prev.startswith('id:') or prev in ('num', 'str', 'p:)', 'p:]')) else 'p:' + ch
                i += 2; continue
            if c.startswith('=>', i): prev = 'p:=>'; i += 2; continue
            prev = 'p:' + ch; i += 1
        return nodes, i

    def template(self, i):
        c = self.c; j = i + 1; quasis = []; exprs = []; start = j
        while True:
            d = c[j]
            if d == '\\': j += 2; continue
            if d == '`':
                quasis.append(decode(c[start:j], True)); j += 1; break
            if d == '$' and c[j+1] == '{':
                quasis.append(decode(c[start:j], True))
                kids, k = self.scan(j + 2, True)
                exprs.append({'s': j + 2, 'e': k, 'kids': kids})
                j = k + 1; start = j; continue
            j += 1
        return {'t': 't', 's': i, 'e': j, 'q': quasis, 'x': exprs, 'key': False}, j


def tkey(node):
    """Clave de diccionario de una plantilla."""
    q = node['q']; out = q[0]
    for k in range(1, len(q)): out += '{%d}' % (k - 1) + q[k]
    return out


def nodekey(node):
    return node['v'] if node['t'] == 's' else tkey(node)


def walk(nodes):
    for nd in nodes:
        yield nd
        if nd['t'] == 't':
            for x in nd['x']: yield from walk(x['kids'])


def main_script(html):
    a = html.rindex('<script>') + 8; b = html.index('</script>', a)
    return a, b


def literals(code):
    nodes, _ = Scanner(code).scan(0)
    return nodes


def rewrite(code, nodes, ids, skip=lambda nd: False):
    """Reescribe el código envolviendo los literales cuya clave está en ids ({clave: número})."""
    def emit(s, e, kids):
        out = []; p = s
        for nd in kids:
            if nd['s'] < s or nd['e'] > e: continue
            out.append(code[p:nd['s']])
            k = None if nd['key'] or skip(nd) else ids.get(nodekey(nd))
            if nd['t'] == 's':
                out.append(code[nd['s']:nd['e']] if k is None else '_t(%d,%s)' % (k, code[nd['s']:nd['e']]))
            elif k is None:
                # plantilla sin traducir: se copia, pero sus expresiones pueden tener literales traducibles
                q = p2 = nd['s']; parts = []
                for x in nd['x']:
                    parts.append(code[p2:x['s']]); parts.append(emit(x['s'], x['e'], x['kids'])); p2 = x['e']
                parts.append(code[p2:nd['e']]); out.append(''.join(parts))
            else:
                args = [json.dumps(q, ensure_ascii=False) for q in nd['q']]
                xs = [emit(x['s'], x['e'], x['kids']) for x in nd['x']]
                out.append('_tt(%d,[%s]%s)' % (k, ','.join(args), ''.join(',(' + x + ')' for x in xs)))
            p = nd['e']
        out.append(code[p:e])
        return ''.join(out)
    return emit(0, len(code), nodes)


# ---------------------------------------------------------------- HTML fijo (antes del script)
TEXT_RE = re.compile(r'>([^<>]+)<')
ATTR_RE = re.compile(r'\b(?:title|placeholder|aria-label)="([^"]+)"')


def html_texts(head):
    """Textos del HTML fijo (nodos de texto y atributos visibles), sin el CSS."""
    import html as H
    body = re.sub(r'<style>.*?</style>|<script[^>]*>.*?</script>', '', head, flags=re.S)
    out = []
    for m in TEXT_RE.finditer(body):
        t = H.unescape(m.group(1)).strip()
        if re.search(r'[A-Za-zÁÉÍÓÚáéíóúñ]', t): out.append(t)
    for m in ATTR_RE.finditer(body):
        out.append(H.unescape(m.group(1)).strip())
    return out


# ---------------------------------------------------------------- diccionarios
RAIZ = pathlib.Path(__file__).resolve().parent.parent
LANGS = ('ca', 'en')


def hkey(es):
    """Clave corta de un texto en español (para no repetir párrafos enteros en los diccionarios)."""
    import hashlib
    return '@' + hashlib.sha1(es.encode('utf-8')).hexdigest()[:8]


def parse_line(t):
    if len(t) >= 2 and t[0] == '"' and t[-1] == '"': return json.loads(t)
    return t


def load_dicts():
    """Lee fuente/i18n/*.txt: bloques de tres líneas (español o @clave, catalán, inglés) separados por una línea en blanco.
    Una línea entre comillas dobles se lee como cadena JSON (para espacios al principio o al final, \\n…);
    «=» significa «igual que en español». Devuelve {'ca': {es: tr}, 'en': {...}} y las claves @ por separado."""
    d = {lg: {} for lg in LANGS}; hashed = {lg: {} for lg in LANGS}
    for f in sorted((RAIZ / 'fuente' / 'i18n').glob('*.txt')):
        blocks = re.split(r'\n[ \t]*\n', f.read_text(encoding='utf-8').replace('\r\n', '\n').strip('\n'))
        for bi, bl in enumerate(blocks):
            lines = [l for l in bl.split('\n') if not l.startswith('#')]
            if not lines: continue
            assert len(lines) == 3, '%s, bloque %d: hacen falta 3 líneas y hay %d:\n%s' % (f.name, bi + 1, len(lines), bl)
            k = parse_line(lines[0])
            for lg, l in zip(LANGS, lines[1:]):
                v = parse_line(l)
                if v == '': continue
                tgt = hashed if k.startswith('@') else d
                v = None if v == '=' else v
                if k in tgt[lg] and tgt[lg][k] != v:
                    print('Aviso: %s (%s) está repetida en %s con otra traducción' % (k[:40], lg, f.name), file=sys.stderr)
                tgt[lg][k] = v
    return d, hashed


IDLIKE_PRE = re.compile(r'(\b(?:id|cat|kind|tab|mode|state|ui|need|carry|look|role)\s*:|[(\[,]|===|!==|==|!=|case)\s*$')
IDLIKE_POST = re.compile(r'\s*(===|!==|==|!=)')


def idlike(code, nd):
    """Una palabra suelta en minúsculas junto a un id:, una comparación o al principio de una lista es un identificador
    interno (id de lugar, estado…) y no se traduce aunque coincida con un término del diccionario."""
    v = nd['v'] if nd['t'] == 's' else None
    if v is None or not re.fullmatch(r'[a-z0-9_\-]+', v): return False
    return bool(IDLIKE_PRE.search(code[max(0, nd['s'] - 30):nd['s']]) or IDLIKE_POST.match(code[nd['e']:nd['e'] + 5]))


def build(html):
    """Devuelve el HTML con los literales envueltos y el marcador de las traducciones sustituido por las tablas."""
    dicts, hashed = load_dicts()
    a, b = main_script(html)
    code = html[a:b]
    nodes = literals(code)
    ids = {}; tables = {lg: [] for lg in LANGS}
    for nd in walk(nodes):
        k = nodekey(nd)
        if nd['key'] or k in ids or idlike(code, nd): continue
        vals = []
        for lg in LANGS:
            v = dicts[lg].get(k, hashed[lg].get(hkey(k), ''))
            vals.append(None if v in ('', None) else v)
        known = any(k in dicts[lg] or hkey(k) in hashed[lg] for lg in LANGS)
        if not known: continue
        ids[k] = len(ids)
        for lg, v in zip(LANGS, vals): tables[lg].append(v)
    texts = html_texts(html[:a])
    statics = {lg: {t: dicts[lg][t] for t in texts if dicts[lg].get(t)} for lg in LANGS}
    payload = json.dumps({'tr': tables, 'html': statics}, ensure_ascii=False, separators=(',', ':'))
    payload = payload.replace('</', '<\\/')
    code2 = rewrite(code, nodes, ids, lambda nd: idlike(code, nd))
    MARK = '/*@@I18N@@*/{tr:{},html:{}}'
    assert code2.count(MARK) == 1, 'falta el marcador de las traducciones'
    code2 = code2.replace(MARK, payload)
    return html[:a] + code2 + html[b:], len(ids)


# ---------------------------------------------------------------- herramienta: lo que falta por traducir
SPANISH = re.compile(r'[A-Za-zÁÉÍÓÚáéíóúñÑüÜ]{2,}')
CODEY = re.compile(r'^(#[0-9a-fA-F]{3,8}|[a-z0-9_\-:./#\[\]=*]+|[A-Z][A-Z0-9_]+|https?://\S+|rgba?\(.*\)|[a-z\-]+:[^ ]+;.*)$')


def is_text(s):
    s2 = s.strip()
    if not SPANISH.search(s2): return False
    if CODEY.match(s2): return False
    if re.match(r'^[\w\-]+(\s+[\w\-]+)*$', s2) and s2 == s2.lower() and not re.search(r'[áéíóúñü]', s2) and ' ' not in s2: return False
    return True


def groups(code, nodes):
    """Agrupa los literales por la declaración de primer nivel que los contiene (líneas sin sangría)."""
    starts = [(m.start(), m.group(1)) for m in re.finditer(r'^(?:const|let|var|function|async function)\s+([A-Za-z_$][\w$]*)', code, re.M)]
    import bisect
    pos = [s for s, _ in starts]
    for nd in walk(nodes):
        k = bisect.bisect_right(pos, nd['s']) - 1
        yield (starts[k][1] if k >= 0 else '_'), nd


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'pendientes'
    html = (RAIZ / 'fuente' / 'atenas.src.html').read_text(encoding='utf-8')
    a, b = main_script(html)
    code = html[a:b]; nodes = literals(code)
    if cmd == 'pendientes':
        # lista lo que falta por traducir, agrupado por la declaración que lo contiene, en el formato de los .txt
        # (con la clave @ para los textos largos): python fuente/i18n.py pendientes [grupo ...]
        want = set(sys.argv[2:])
        dicts, hashed = load_dicts()
        def done(k): return all(k in dicts[lg] or hkey(k) in hashed[lg] for lg in LANGS)
        out = {}; seen = set()
        for t in html_texts(html[:a]):
            if not done(t) and t not in seen: out.setdefault('_html', []).append(t); seen.add(t)
        for g, nd in groups(code, nodes):
            if nd['key']: continue
            k = nodekey(nd)
            if k in seen or not is_text(k) or done(k): continue
            seen.add(k); out.setdefault(g, []).append(k)
        p = RAIZ / 'fuente' / 'i18n' / 'pendientes.md'
        with p.open('w', encoding='utf-8') as fo:
            for g, v in out.items():
                if want and g not in want: continue
                fo.write('## %s\n' % g)
                for k in v: fo.write('%s %s\n' % (hkey(k), json.dumps(k, ensure_ascii=False)))
        print(p, sum(len(v) for v in out.values()), 'cadenas,', sum(len(k) for v in out.values() for k in v), 'caracteres')
        for g, v in out.items(): print('  %-28s %5d %8d' % (g, len(v), sum(len(k) for k in v)))
    elif cmd == 'huerfanas':
        # entradas de los diccionarios que ya no corresponden a ningún texto del juego
        dicts, hashed = load_dicts()
        keys = {nodekey(nd) for nd in walk(nodes) if not nd['key']}
        keys.update(html_texts(html[:a])); hk = {hkey(k) for k in keys}
        for lg in LANGS:
            for k in dicts[lg]:
                if k not in keys: print(lg, json.dumps(k, ensure_ascii=False)[:120])
            for k in hashed[lg]:
                if k not in hk: print(lg, k)
    elif cmd == 'volcar':  # para comprobar el tokenizador
        print(json.dumps([[nd['s'], nd['e'], nd['t'], nodekey(nd), nd['key']] for nd in walk(nodes)], ensure_ascii=False))
