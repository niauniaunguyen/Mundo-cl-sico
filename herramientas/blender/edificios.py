# Casas detalladas (fase C de los edificios) → modelos/edificios.glb
#   /opt/bvenv/bin/python -I herramientas/blender/edificios.py [-- carpeta_de_vistas]
# Versiones con mucho más detalle de las casas de modelos/atenas_modelos.glb, con las MISMAS medidas, origen y orientación
# (la puerta a -Y en Blender, +Z en el juego), para que el juego las cambie por las sencillas a menos de unos 600 m:
#   H2_gra / H2_grb / H2_grc  casa griega con patio (Olinto, Atenas: pastas, patio empedrado, altar, boca de cisterna; grb con piso alto)
#   H2_farm                    granja ática: casa, era empedrada para trillar, pithoi, horno, cerca de piedra seca y emparrado
#   H2_dom                     domus romana: fachada con tabernae, fauces, atrio con compluvio e impluvio, peristilo al fondo
#   H2_insa / H2_insb          ínsulas: planta baja de ladrillo con tiendas, pisos de estuco, ventanas con postigos, balcón de madera
# Detalles comunes: tejados de tejas de verdad (planas y cobijas, cumbrera, antefijas en el alero), cabezas de vigas bajo el alero,
# zócalo de piedra, puertas de dos hojas con marco y clavos de bronce, ventanas altas con postigos.
# Papeles (nombre del material, como en atenas_modelos.glb): wall, plaster, brick (se tiñen por casa), roof (se tiñe), socle, stone,
# wood, dark, bronze, tile (antefijas y cumbrera, sin teñir).
# Fuentes de las formas: casas de Olinto (Robinson y Graham, Excavations at Olynthus VIII), casas del Ática (Jones, Sackett y
# Graham, The Dema House, BSA 57); domus de Pompeya; ínsulas de Ostia (Casa di Diana) y Vitruvio II 8 (paredes de ladrillo).
import bpy, math, os, sys
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos', 'edificios.glb')
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
PREV = args[0] if args else None
bpy.ops.wm.read_factory_settings(use_empty=True)
SC = bpy.context.scene
TAU = math.tau
FULL = True      # False: nivel intermedio (sin tejas sueltas, vigas, clavos, barrotes ni accesorios)

class M:
    """malla por papel: M.get(papel).box(...)"""
    def __init__(s): s.v = []; s.f = []; s.uv = {}
    def uvq(s, a, b, c, d, u0=0, v0=0, u1=1, v1=1):
        """cuadrilátero con coordenadas de textura (rótulos, interiores pintados): a-b abajo, c-d arriba"""
        s.q(a, b, c, d); s.uv[len(s.f) - 1] = [(u0, v0), (u1, v0), (u1, v1), (u0, v1)]
    def q(s, a, b, c, d):
        i = len(s.v); s.v += [a, b, c, d]; s.f.append((i, i + 1, i + 2, i + 3))
    def tri(s, a, b, c):
        i = len(s.v); s.v += [a, b, c]; s.f.append((i, i + 1, i + 2))
    def box(s, x0, x1, y0, y1, z0, z1, bottom=False):
        if x0 > x1: x0, x1 = x1, x0
        if y0 > y1: y0, y1 = y1, y0
        if z0 > z1: z0, z1 = z1, z0
        P = lambda x, y, z: (x, y, z)
        s.q(P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1))                  # arriba
        s.q(P(x0, y0, z0), P(x0, y0, z1), P(x0, y1, z1), P(x0, y1, z0))                  # -x
        s.q(P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1))                  # +x
        s.q(P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1))                  # -y
        s.q(P(x0, y1, z0), P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0))                  # +y
        if bottom: s.q(P(x0, y0, z0), P(x0, y1, z0), P(x1, y1, z0), P(x1, y0, z0))
    def wedge(s, x0, x1, y0, y1, z0, za, zb, axis):
        """prisma con la cara de arriba inclinada: axis='x' → arriba va de za (en x0) a zb (en x1); 'y' → de za (y0) a zb (y1)"""
        if axis == 'x': t = {(0, 0): za, (0, 1): za, (1, 0): zb, (1, 1): zb}
        else: t = {(0, 0): za, (1, 0): za, (0, 1): zb, (1, 1): zb}
        X = (x0, x1); Y = (y0, y1); T = lambda i, j: (X[i], Y[j], t[(i, j)]); B = lambda i, j: (X[i], Y[j], z0)
        s.q(T(0, 0), T(1, 0), T(1, 1), T(0, 1))
        s.q(B(0, 0), T(0, 0), T(0, 1), B(0, 1)); s.q(B(1, 0), B(1, 1), T(1, 1), T(1, 0))
        s.q(B(0, 0), B(1, 0), T(1, 0), T(0, 0)); s.q(B(0, 1), T(0, 1), T(1, 1), B(1, 1))
    def cyl(s, cx, cy, r0, r1, z0, z1, n=10, cap=True):
        R = [(cx + math.cos(a) * r0, cy + math.sin(a) * r0, z0) for a in (k / n * TAU for k in range(n))]
        T = [(cx + math.cos(a) * r1, cy + math.sin(a) * r1, z1) for a in (k / n * TAU for k in range(n))]
        for k in range(n):
            j = (k + 1) % n; s.q(R[k], R[j], T[j], T[k])
        if cap:
            for k in range(1, n - 1): s.tri(T[0], T[k], T[k + 1])
    def lathe(s, cx, cy, prof, n=12):
        """prof: [(r, z)] de abajo arriba"""
        for (r0, z0), (r1, z1) in zip(prof, prof[1:]):
            for k in range(n):
                a, b = k / n * TAU, (k + 1) / n * TAU
                s.q((cx + math.cos(a) * r0, cy + math.sin(a) * r0, z0), (cx + math.cos(b) * r0, cy + math.sin(b) * r0, z0),
                    (cx + math.cos(b) * r1, cy + math.sin(b) * r1, z1), (cx + math.cos(a) * r1, cy + math.sin(a) * r1, z1))
    def half(s, p0, p1, r, up, n=5):
        """media caña (teja cobija) de p0 a p1, convexa hacia 'up'"""
        d = [p1[i] - p0[i] for i in range(3)]; L = math.sqrt(sum(x * x for x in d)) or 1; d = [x / L for x in d]
        side = [d[1] * up[2] - d[2] * up[1], d[2] * up[0] - d[0] * up[2], d[0] * up[1] - d[1] * up[0]]
        ring = lambda p: [tuple(p[i] + (math.cos(math.pi * k / n) * side[i] + math.sin(math.pi * k / n) * up[i]) * r for i in range(3)) for k in range(n + 1)]
        A, B = ring(p0), ring(p1)
        for k in range(n): s.q(A[k], B[k], B[k + 1], A[k + 1])

class House:
    def __init__(s, name): s.name = name; s.m = {}
    def __getitem__(s, role):
        if role not in s.m: s.m[role] = M()
        return s.m[role]
    def build(s):
        obs = []
        for role, m in s.m.items():
            if not m.f: continue
            me = bpy.data.meshes.new(s.name + '_' + role); me.from_pydata(m.v, [], m.f); me.validate(); me.update()
            if m.uv:
                ul = me.uv_layers.new(name='UVMap')
                for fi, poly in enumerate(me.polygons):
                    uvs = m.uv.get(fi)
                    for k, li in enumerate(poly.loop_indices): ul.data[li].uv = uvs[k] if uvs else (0.0, 0.0)
            import bmesh as _bm
            bm = _bm.new(); bm.from_mesh(me); _bm.ops.remove_doubles(bm, verts=bm.verts, dist=0.0006); bm.to_mesh(me); bm.free()   # menos vértices repetidos
            ob = bpy.data.objects.new(s.name + '_' + role, me); SC.collection.objects.link(ob)
            mod = ob.modifiers.new('aristas', 'EDGE_SPLIT'); mod.split_angle = math.radians(35)
            for p in me.polygons: p.use_smooth = True
            mat = bpy.data.materials.get(role) or bpy.data.materials.new(role); me.materials.append(mat)
            bpy.context.view_layer.objects.active = ob; ob.select_set(True)
            bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True); bpy.ops.object.modifier_apply(modifier='aristas')
            obs.append(ob)
        tri = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in obs); print(s.name, tri, 'triángulos'); return obs

# ---------------------------------------------------------------- piezas comunes
def slope(H, axis, a0, a1, hp, hz, lp, lz, tiles=True, ante=True, rafters=True, step=0.44, over=0.35):
    tiles = tiles and FULL; rafters = rafters and FULL
    """faldón de tejado: ridge (lado alto) en coordenada hp/altura hz, alero en lp/altura lz; a0..a1 a lo largo de la cumbrera.
    axis='x': la cumbrera va en X y el agua cae en Y; axis='y', al revés."""
    sgn = 1 if lp > hp else -1; L = abs(lp - hp); ex = lp + sgn * over; ez = lz - (hz - lz) / L * over
    def P(a, p, z): return (a, p, z) if axis == 'x' else (p, a, z)
    th = 0.09
    R = H['roof']
    R.q(P(a0, hp, hz + th), P(a1, hp, hz + th), P(a1, ex, ez + th), P(a0, ex, ez + th)) if sgn > 0 else R.q(P(a0, hp, hz + th), P(a0, ex, ez + th), P(a1, ex, ez + th), P(a1, hp, hz + th))
    R.q(P(a0, hp, hz), P(a0, ex, ez), P(a1, ex, ez), P(a1, hp, hz)) if sgn > 0 else R.q(P(a0, hp, hz), P(a1, hp, hz), P(a1, ex, ez), P(a0, ex, ez))
    R.q(P(a0, ex, ez), P(a0, ex, ez + th), P(a1, ex, ez + th), P(a1, ex, ez))                    # canto del alero
    for a in (a0, a1): R.tri(P(a, hp, hz), P(a, hp, hz + th), P(a, ex, ez + th)); R.tri(P(a, hp, hz), P(a, ex, ez + th), P(a, ex, ez))
    if tiles:
        nz = (lz - hz) / L; up = (0, -sgn * nz, 1) if axis == 'x' else (-sgn * nz, 0, 1); n = math.sqrt(sum(c * c for c in up)); up = tuple(c / n for c in up)
        a = a0 + step / 2
        while a < a1 - step / 3:
            p0 = P(a, hp, hz + th + 0.01); p1 = P(a, ex + sgn * 0.03, ez + th + 0.01)
            R.half(p0, p1, 0.075, up, 4)
            if ante:   # antefija: placa de terracota al final de cada fila de cobijas
                T = H['tile']; w = 0.1; zz = ez + th
                if axis == 'x': T.q((a - w, ex + sgn * 0.05, zz - 0.02), (a + w, ex + sgn * 0.05, zz - 0.02), (a + w * 0.6, ex + sgn * 0.05, zz + 0.2), (a - w * 0.6, ex + sgn * 0.05, zz + 0.2))
                else: T.q((ex + sgn * 0.05, a - w, zz - 0.02), (ex + sgn * 0.05, a - w * 0.6, zz + 0.2), (ex + sgn * 0.05, a + w * 0.6, zz + 0.2), (ex + sgn * 0.05, a + w, zz - 0.02))
            a += step
    if rafters:   # cabezas de las vigas bajo el alero
        W = H['wood']; a = a0 + 0.3
        while a < a1 - 0.2:
            pz = lz - 0.18
            if axis == 'x': W.box(a - 0.07, a + 0.07, lp, lp + sgn * (over * 0.8), pz, pz + 0.14)
            else: W.box(lp, lp + sgn * (over * 0.8), a - 0.07, a + 0.07, pz, pz + 0.14)
            a += 0.65

def gable(H, axis, a0, a1, b0, b1, zE, zR, **kw):
    """tejado a dos aguas sobre el rectángulo; cumbrera en el medio, con su teja cumbrera"""
    m = (b0 + b1) / 2
    slope(H, axis, a0, a1, m, zR, b0, zE, **kw); slope(H, axis, a0, a1, m, zR, b1, zE, **kw)
    p0 = (a0 - 0.1, m, zR + 0.1) if axis == 'x' else (m, a0 - 0.1, zR + 0.1); p1 = (a1 + 0.1, m, zR + 0.1) if axis == 'x' else (m, a1 + 0.1, zR + 0.1)
    H['tile'].half(p0, p1, 0.12, (0, 0, 1), 5 if FULL else 3)
    # piñones (los triángulos de las fachadas cortas)
    for a in (a0, a1):
        if axis == 'x': H['wall'].tri((a, b0, zE), (a, m, zR), (a, b1, zE))
        else: H['wall'].tri((b0, a, zE), (b1, a, zE), (m, a, zR))

def wallrun(H, x0, x1, y0, y1, z0, z1, role='wall', socle=0.8, sock=0.04):
    """muro de adobe enlucido sobre zócalo de piedra (un poco más grueso)"""
    H['socle'].box(x0 - sock, x1 + sock, y0 - sock, y1 + sock, -1.5, socle)
    H[role].box(x0, x1, y0, y1, socle, z1)

def door(H, cx, y, face=-1, w=1.1, h=2.15, deep=0.25, axis='x'):
    """puerta de dos hojas (una entornada) con marco de madera, dintel y umbral de piedra y clavos de bronce. face: hacia dónde mira"""
    def B(role, a0, a1, d0, d1, z0, z1):
        if axis == 'x': H[role].box(cx + a0, cx + a1, y + face * d0, y + face * d1, z0, z1)
        else: H[role].box(y + face * d0, y + face * d1, cx + a0, cx + a1, z0, z1)
    B('dark', -w / 2, w / 2, 0.0, 0.012, 0, h)                                         # el hueco (oscuro), sobre el muro
    B('wood', -w / 2 - 0.13, -w / 2, 0.0, 0.09, 0, h + 0.12); B('wood', w / 2, w / 2 + 0.13, 0.0, 0.09, 0, h + 0.12)   # jambas
    B('stone', -w / 2 - 0.28, w / 2 + 0.28, 0.0, 0.12, h + 0.12, h + 0.38)            # dintel
    B('stone', -w / 2 - 0.12, w / 2 + 0.12, 0.0, 0.3, -0.02, 0.07)                    # umbral
    B('wood', -w / 2 + 0.01, -0.01, 0.014, 0.06, 0.04, h - 0.03)                      # hoja cerrada
    # la otra hoja está abierta hacia dentro: se ve el hueco oscuro
    for k in range(3 if FULL else 0):
        for zz in (0.45, 1.05, 1.65):
            xx = -w / 2 + 0.12 + k * (w / 2 - 0.2) / 2
            B('bronze', xx - 0.025, xx + 0.025, 0.06, 0.075, zz, zz + 0.05)
    B('bronze', -0.12, -0.06, 0.06, 0.1, h * 0.5, h * 0.5 + 0.08)                      # aldaba

def window(H, cx, y, z, face=-1, w=0.5, h=0.45, axis='x', shutter=True):
    def B(role, a0, a1, d0, d1, z0, z1):
        if axis == 'x': H[role].box(cx + a0, cx + a1, y + face * d0, y + face * d1, z0, z1)
        else: H[role].box(y + face * d0, y + face * d1, cx + a0, cx + a1, z0, z1)
    B('dark', -w / 2, w / 2, 0.0, 0.012, z, z + h)
    B('wood', -w / 2 - 0.07, w / 2 + 0.07, 0.0, 0.06, z - 0.07, z); B('wood', -w / 2 - 0.07, w / 2 + 0.07, 0.0, 0.06, z + h, z + h + 0.07)
    B('wood', -w / 2 - 0.07, -w / 2, 0.0, 0.06, z, z + h); B('wood', w / 2, w / 2 + 0.07, 0.0, 0.06, z, z + h)
    for k in range(2 if FULL else 0): B('wood', -w / 2 + w * (k + 1) / 3 - 0.014, -w / 2 + w * (k + 1) / 3 + 0.014, 0.012, 0.035, z, z + h)    # barrotes
    if shutter and FULL:
        B('wood', w / 2 + 0.07, w / 2 + 0.07 + w / 2, 0.0, 0.045, z, z + h)          # postigo abierto contra el muro
        B('wood', -w / 2 - 0.07 - w / 2, -w / 2 - 0.07, 0.0, 0.045, z, z + h)

def post(H, x, y, z0, z1, r=0.14):
    """poste de madera sobre basa de piedra (pórticos de los patios)"""
    H['stone'].box(x - 0.24, x + 0.24, y - 0.24, y + 0.24, z0, z0 + 0.18)
    H['wood'].cyl(x, y, r, r * 0.9, z0 + 0.18, z1, 8, False)
    H['wood'].box(x - 0.22, x + 0.22, y - 0.16, y + 0.16, z1, z1 + 0.12)

def column(H, x, y, z0, z1, r=0.3, role='plaster'):
    """columna toscana estucada (domus): basa, fuste con éntasis, capitel"""
    H['stone'].box(x - r * 1.3, x + r * 1.3, y - r * 1.3, y + r * 1.3, z0, z0 + 0.15)
    H[role].lathe(x, y, [(r * 1.15, z0 + 0.15), (r * 1.05, z0 + 0.28), (r, z0 + 0.32), (r * 0.97, (z0 + z1) / 2), (r * 0.84, z1 - 0.35), (r * 0.9, z1 - 0.3), (r * 1.15, z1 - 0.12), (r * 1.15, z1)], 12)
    H[role].box(x - r * 1.3, x + r * 1.3, y - r * 1.3, y + r * 1.3, z1, z1 + 0.14)

def pithos(H, x, y, s=1.0):
    H['dark'].lathe(x, y, [(0.18 * s, 0), (0.38 * s, 0.25 * s), (0.45 * s, 0.6 * s), (0.4 * s, 0.95 * s), (0.22 * s, 1.1 * s), (0.25 * s, 1.18 * s), (0.17 * s, 1.18 * s)], 12) if False else \
        H['tile'].lathe(x, y, [(0.18 * s, 0), (0.38 * s, 0.25 * s), (0.45 * s, 0.6 * s), (0.4 * s, 0.95 * s), (0.22 * s, 1.1 * s), (0.25 * s, 1.18 * s), (0.17 * s, 1.18 * s)], 12)

def cobbles(H, x0, x1, y0, y1, z=0.0, role='stone', s=0.55, seed=3):
    """empedrado: losas algo levantadas y desiguales (se ven con la luz rasante)"""
    if not FULL: H[role].box(x0, x1, y0, y1, z, z + 0.04); return
    import random; R = random.Random(seed); y = y0
    while y < y1 - 0.05:
        x = x0 + R.random() * 0.2
        while x < x1 - 0.05:
            w = s * (0.7 + R.random() * 0.6); d = s * (0.7 + R.random() * 0.5); h = 0.03 + R.random() * 0.04
            H[role].box(x + 0.03, min(x1, x + w) - 0.03, y + 0.03, min(y1, y + d) - 0.03, z, z + h); x += w
        y += s


def interior(H, cx, y, z0, w, h, face=-1, cell=0, axis='x'):
    """hueco de puerta o ventana con el interior pintado (textura de 4 viñetas en el juego: hogar, telar, ánforas, atrio)"""
    u0 = cell * 0.25; d = face * 0.013
    if axis == 'x':
        a = (cx - w / 2, y + d, z0); b = (cx + w / 2, y + d, z0); c = (cx + w / 2, y + d, z0 + h); e = (cx - w / 2, y + d, z0 + h)
    else:
        a = (y + d, cx + w / 2, z0); b = (y + d, cx - w / 2, z0); c = (y + d, cx - w / 2, z0 + h); e = (y + d, cx + w / 2, z0 + h)
    if face > 0: a, b, c, e = b, a, e, c
    H['interior'].uvq(a, b, c, e, u0, 0, u0 + 0.25, 1)

def sign(H, cx, y, z0, w, h, cell, face=-1):
    """rótulo pintado sobre el estuco (atlas de 4×2 viñetas que dibuja el juego)"""
    u0 = (cell % 4) * 0.25; v0 = 0.5 if cell >= 4 else 0.0; d = face * 0.014
    a = (cx - w / 2, y + d, z0); b = (cx + w / 2, y + d, z0); c = (cx + w / 2, y + d, z0 + h); e = (cx - w / 2, y + d, z0 + h)
    if face > 0: a, b, c, e = b, a, e, c
    H['sign'].uvq(a, b, c, e, u0, v0, u0 + 0.25, v0 + 0.5)

def flakes(H, x0, x1, y, z0, z1, face=-1, n=5, seed=1):
    """desconchones del enlucido que dejan ver el adobe"""
    if not FULL: return
    import random; R = random.Random(seed)
    for k in range(n):
        x = x0 + R.random() * (x1 - x0); z = z0 + R.random() * (z1 - z0); w = 0.25 + R.random() * 0.6; h = 0.15 + R.random() * 0.4
        H['mud'].box(x - w / 2, x + w / 2, y + face * 0.004, y + face * 0.016, z, z + h)

def loom(H, x, y):
    """telar vertical de pesas (el de las casas griegas): dos postes, enjulio, urdimbre y pesas de barro"""
    if not FULL: return
    for s in (-0.7, 0.7): H['wood'].box(x + s - 0.05, x + s + 0.05, y - 0.05, y + 0.05, 0, 2.2)
    H['wood'].cyl(x, y, 0.06, 0.06, 2.0, 2.0, 6, False); H['wood'].box(x - 0.8, x + 0.8, y - 0.05, y + 0.05, 1.98, 2.08)
    H['wall'].box(x - 0.62, x + 0.62, y - 0.01, y + 0.01, 0.6, 1.98)
    for k in range(9): H['tile'].box(x - 0.58 + k * 0.145 - 0.035, x - 0.58 + k * 0.145 + 0.035, y - 0.04, y + 0.04, 0.42, 0.56)

def amphorae(H, x, y, n=3):
    if not FULL: return
    for k in range(n):
        H['tile'].lathe(x + k * 0.42, y, [(0.02, 0.0), (0.12, 0.12), (0.19, 0.4), (0.17, 0.62), (0.07, 0.75), (0.06, 0.9), (0.08, 0.92)], 10)

def roofrepair(H, x, y, z, ly=None):
    """tejas apiladas y escalera de mano: un tejado en obras"""
    if not FULL: return
    for k in range(4): H['tile'].box(x - 0.3, x + 0.3, y - 0.2, y + 0.2, z + k * 0.05, z + k * 0.05 + 0.045)
    ly = ly if ly is not None else y - 2.3   # la escalera, apoyada en el muro de fuera
    for s in (-0.22, 0.22): H['wood'].box(x + 1.0 + s - 0.03, x + 1.0 + s + 0.03, ly, ly + 0.06, 0.0, z + 0.4)
    for k in range(int(z / 0.35)): H['wood'].box(x + 0.78, x + 1.22, ly + 0.01, ly + 0.05, 0.3 + k * 0.35, 0.33 + k * 0.35)

# ---------------------------------------------------------------- casa griega con patio
def greek(name, W, D, two=False, small=False, var=0):
    """var 0: casa sola; var 1: con tienda a la calle y la puerta a la izquierda; var 2: con telar en el pórtico y el tejado en obras"""
    """W, D: medio ancho (X) y media profundidad (Y). Puerta a -Y. Nave principal (oikos/andrón) al fondo; patio delante."""
    H = House(name); X, Y = W, D; zW = 3.6
    yb = 1.1 if not small else -0.4                                  # fachada del patio de la nave del fondo
    # nave del fondo, con tejado a dos aguas (cumbrera en X)
    wallrun(H, -X, X, yb, Y, 0, zW); gable(H, 'x', -X - 0.35, X + 0.35, yb - 0.35, Y + 0.35, zW - 0.12, zW + 1.0)
    if two:   # piso alto sobre la mitad oeste (hyperoon), con su tejado
        H['wall'].box(-X, 0.6, yb + 0.6, Y, zW, zW + 2.6); gable(H, 'x', -X - 0.3, 0.9, yb + 0.25, Y + 0.3, zW + 2.6 - 0.1, zW + 3.6)
        for x in (-X + 1.5, -X + 3.3): window(H, x, yb + 0.6, zW + 1.2, -1, 0.55, 0.6)
        H['wood'].box(-X + 0.5, 0.2, yb - 0.4, yb + 0.6, zW + 0.05, zW + 0.15)                          # balcón de madera
        for x in (-X + 0.6, -2.0, 0.1): H['wood'].box(x - 0.04, x + 0.04, yb - 0.38, yb - 0.3, zW + 0.15, zW + 1.1)
        H['wood'].box(-X + 0.5, 0.2, yb - 0.4, yb - 0.32, zW + 1.0, zW + 1.08)
    # alas laterales de una planta (almacén, cocina), con tejado de una sola agua hacia el patio
    wing = 2.4 if not small else 2.0
    k = 1.0 / (wing + 0.35)   # pendiente del faldón: del muro exterior (alto) al patio (bajo)
    H['socle'].box(-X - 0.04, -X + wing + 0.04, -Y - 0.04, yb, -1.5, 0.8); H['wall'].wedge(-X, -X + wing, -Y, yb, 0.8, zW + 0.2 - 0.35 * 0.7 * k * 1.0, zW - 0.5 + 0.0, 'x')
    slope(H, 'y', -Y - 0.3, yb, -X - 0.35, zW + 0.2, -X + wing, zW - 0.5)
    if not small:
        H['socle'].box(X - wing - 0.04, X + 0.04, -Y - 0.04, yb, -1.5, 0.8); H['wall'].wedge(X - wing, X, -Y, yb, 0.8, zW - 0.5, zW + 0.2 - 0.35 * 0.7 * k, 'x')
        slope(H, 'y', -Y - 0.3, yb, X + 0.35, zW + 0.2, X - wing, zW - 0.5)
    else:
        wallrun(H, X - 0.35, X, -Y, yb, 0, 2.6)                       # tapia
    # fachada a la calle (muro del patio) con la puerta
    xr = X - (wing if not small else 0.35); xl = -X + wing
    wallrun(H, xl, xr, -Y, -Y + 0.45, 0, 2.9 if not small else 2.6)
    H['stone'].box(xl, xr, -Y - 0.02, -Y + 0.47, 2.9 if not small else 2.6, (2.9 if not small else 2.6) + 0.1)   # albardilla
    dx = (3.1 if var != 1 else -2.4) if not small else (1.6 if var != 1 else -1.4)
    door(H, dx, -Y, -1)
    if var == 1:   # tienda: hueco ancho con mostrador de obra y tablas de cierre apoyadas
        sx = 2.6 if not small else 1.9; H['dark'].box(sx - 0.95, sx + 0.95, -Y - 0.012, -Y, 0, 2.1); interior(H, sx, -Y, 0.05, 1.8, 2.0, -1, cell=2)
        H['wood'].box(sx - 1.05, sx + 1.05, -Y - 0.1, -Y + 0.02, 2.1, 2.28); H['stone'].box(sx - 0.9, sx + 0.9, -Y - 0.55, -Y - 0.012, 0, 0.9)
        if FULL:
            for k in range(3): H['wood'].box(sx + 1.1 + k * 0.2, sx + 1.28 + k * 0.2, -Y - 0.14 - k * 0.03, -Y - 0.08 - k * 0.03, 0, 2.0)
    for x in ((-X + 1.2,) if var == 1 else (-X + 1.2, X - 1.2)) if not small else ((-X + 1.0,) if var != 1 else ()): window(H, x, -Y, 2.2, -1, 0.42, 0.4, shutter=True)
    flakes(H, xl + 0.3, xr - 0.3, -Y, 0.95, 2.5, -1, 5, seed=len(name) + var)
    for x in (-3.5, 0.0, 3.5) if not small else (-2.2, 2.2): window(H, x, Y, 2.4, 1, 0.5, 0.42)   # ventanas altas al fondo
    # pastas: pórtico de madera delante de la nave del fondo
    for x in ([-X + wing + 1.0, -1.2, 1.2, X - wing - 1.0] if not small else [-2.0, 0.0, 2.0]): post(H, x, yb - 1.6, 0, 2.9)
    H['wood'].box(-X + wing, (X - wing) if not small else X - 0.35, yb - 1.82, yb - 1.38, 2.9, 3.12)
    slope(H, 'x', -X + wing, (X - wing) if not small else X - 0.35, yb + 0.05, zW - 0.2, yb - 1.6, 3.0, step=0.48, ante=False, over=0.4)
    # patio empedrado, altar de Zeus Herkeios, brocal de la cisterna, puerta interior y ventanas al patio
    cobbles(H, xl + 0.1, xr - 0.1, -Y + 0.5, yb - 1.9, 0.0, 'stone', 0.6)
    H['stone'].box(-0.5, 0.5, -0.9, -0.3, 0, 0.75); H['stone'].box(-0.6, 0.6, -1.0, -0.2, 0.75, 0.85)
    H['stone'].lathe(1.8 if not small else -1.0, -Y + 2.0, [(0.42, 0), (0.42, 0.55), (0.3, 0.6), (0.28, 0.5)], 12)
    door(H, 0.0, yb, -1, 1.2, 2.3); interior(H, 0.3, yb, 0.04, 0.58, 2.25, -1, cell=0 if var != 2 else 1); window(H, -2.6 if not small else -2.0, yb, 1.6, -1, 0.6, 0.6); window(H, 2.6 if not small else 2.0, yb, 1.6, -1, 0.6, 0.6)
    for x in (-X + wing, X - wing) if not small else (-X + wing,):
        s = 1 if x < 0 else -1; door(H, -Y + 3.0, x, s, 0.9, 2.0, axis='y')
    amphorae(H, (xr - 1.6) if not small else (xr - 1.5), yb - 2.3, 3)                  # ánforas a la sombra del pórtico
    if var == 2:
        loom(H, -X + wing + 1.9 if not small else -1.1, yb - 0.8)
        mid = (yb - 0.35 + Y + 0.35) / 2; yy = Y - 1.4; zz = (zW - 0.12) + (zW + 1.0 - (zW - 0.12)) * (Y + 0.35 - yy) / (Y + 0.35 - mid)
        roofrepair(H, X - 2.5, yy, zz + 0.12, Y + 0.55)
    return H.build()

# ---------------------------------------------------------------- granja ática
def farm(name='H2_farm', var=0):
    """var 1: con torre de piedra, como las torres de las granjas del Ática y de Tasos (siglos V-IV; su uso, almacén o refugio, se discute)"""
    H = House(name); zW = 3.2
    wallrun(H, -4.5, 4.5, -1.0, 5.0, 0, zW, socle=0.8); gable(H, 'x', -4.85, 4.85, -1.35, 5.35, zW - 0.12, 4.6)
    door(H, 1.5, -1.0, -1); window(H, -2.5, -1.0, 1.6, -1, 0.6, 0.5); window(H, -2.5, 5.0, 2.0, 1, 0.5, 0.4)
    # cerca de piedra seca del corral (piedras irregulares)
    import random; R = random.Random(7)
    def dry(x0, x1, y0, y1):
        L = max(abs(x1 - x0), abs(y1 - y0)); n = int(L / 0.55)
        for k in range(n):
            t0, t1 = k / n, (k + 1) / n; ax, ay = x0 + (x1 - x0) * t0, y0 + (y1 - y0) * t0; bx, by = x0 + (x1 - x0) * t1, y0 + (y1 - y0) * t1
            for lv in range(3):
                h = 0.32 + R.random() * 0.1; z = -0.5 + lv * 0.42 + R.random() * 0.05; j = (R.random() - 0.5) * 0.08
                if abs(x1 - x0) > abs(y1 - y0): H['socle'].box(ax + 0.02, bx - 0.02, ay - 0.32 + j, ay + 0.32 + j, z, z + h)
                else: H['socle'].box(ax - 0.32 + j, ax + 0.32 + j, ay + 0.02, by - 0.02, z, z + h)
    dry(-9.0, -1.2, -7.0, -7.0); dry(1.2, 9.0, -7.0, -7.0); dry(-9.0, -9.0, -7.0, 5.0); dry(9.0, 9.0, -7.0, 5.0)
    # era para trillar: círculo empedrado con bordillo
    cx, cy, r = -5.6, -3.2, 2.6
    for k in range(18):
        a0, a1 = k / 18 * TAU, (k + 1) / 18 * TAU
        H['stone'].q((cx + math.cos(a0) * (r - 0.3), cy + math.sin(a0) * (r - 0.3), 0.05), (cx + math.cos(a0) * r, cy + math.sin(a0) * r, 0.05),
                     (cx + math.cos(a1) * r, cy + math.sin(a1) * r, 0.05), (cx + math.cos(a1) * (r - 0.3), cy + math.sin(a1) * (r - 0.3), 0.05))
        H['stone'].box(cx + math.cos(a0) * r - 0.15, cx + math.cos(a0) * r + 0.15, cy + math.sin(a0) * r - 0.15, cy + math.sin(a0) * r + 0.15, 0, 0.22)
    H['stone'].cyl(cx, cy, r - 0.3, r - 0.3, 0.0, 0.04, 18)
    # pithoi junto a la casa, horno de cúpula, emparrado sobre la puerta
    for k, (x, y) in enumerate([(3.2, -2.2), (4.0, -2.6), (3.6, -3.4)]): pithos(H, x, y, 0.9 + k * 0.08)
    H['wall'].lathe(6.6, 2.0, [(0.95, 0), (0.95, 0.4), (0.85, 0.8), (0.55, 1.15), (0.15, 1.3), (0.0, 1.32)], 12); H['dark'].box(6.4, 6.8, 1.0, 1.08, 0.4, 0.75)
    for x in (0.0, 3.0):
        post(H, x, -3.0, 0, 2.4, 0.08)
    for k in range(6): H['wood'].box(-0.2, 3.2, -1.1 - k * 0.38, -1.06 - k * 0.38, 2.5, 2.55)
    H['wood'].box(-0.2, 3.2, -3.05, -2.95, 2.4, 2.5)
    flakes(H, -4.3, 4.3, -1.0, 0.9, 2.8, -1, 4, seed=11 + var)
    if var == 1:
        tx, ty, t = -6.6, 2.6, 1.8
        H['stone'].box(tx - t, tx + t, ty - t, ty + t, -1.0, 8.6)
        if FULL:
            for k in range(1, 14): H['socle'].box(tx - t - 0.015, tx + t + 0.015, ty - t - 0.015, ty + t + 0.015, k * 0.62 - 0.03, k * 0.62)   # hiladas
        door(H, tx + 0.6, ty - t, -1, 0.8, 1.8); window(H, tx, ty - t, 4.6, -1, 0.3, 0.6, shutter=False); window(H, tx, ty - t, 7.0, -1, 0.3, 0.6, shutter=False)
        gable(H, 'x', tx - t - 0.3, tx + t + 0.3, ty - t - 0.3, ty + t + 0.3, 8.55, 9.4, step=0.45)
    return H.build()

# ---------------------------------------------------------------- domus romana
def domus(name='H2_dom', var=0):
    H = House(name); X, Y, zW = 9.0, 15.0, 6.0
    H['redpaint'].box(-X, X, -Y - 0.01, -Y, 1.0, 1.85)                                       # zócalo pintado de rojo, como en Pompeya
    # fachada con zócalo y tabernae
    H['socle'].box(-X - 0.05, X + 0.05, -Y - 0.4, -Y + 0.05, -1.5, 1.0)
    H['plaster'].box(-X, X, -Y, -Y + 0.6, 1.0, zW)
    for s in (-1, 1):   # dos tiendas a la calle: hueco ancho, mostrador de obra con dolia, tablas de cierre apoyadas, viga de madera
        cx = s * 5.5; H['dark'].box(cx - 1.6, cx + 1.6, -Y - 0.02, -Y + 2.5, 0, 3.0)
        H['wood'].box(cx - 1.75, cx + 1.75, -Y - 0.12, -Y + 0.1, 3.0, 3.25)
        H['stone'].box(cx - 1.5, cx + 0.2, -Y + 0.2, -Y + 0.75, 0, 0.95)
        for k in range(2): H['tile'].lathe(cx - 1.1 + k * 0.7, -Y + 0.47, [(0.18, 0.96), (0.21, 0.99), (0.16, 1.0)], 10)
        for k in range(4 if FULL else 0): H['wood'].box(cx + 0.6 + k * 0.22, cx + 0.8 + k * 0.22, -Y + 0.15 + k * 0.03, -Y + 0.21 + k * 0.03, 0, 2.6)
        interior(H, cx, -Y - 0.02, 0.0, 3.2, 3.0, -1, cell=2)
        sign(H, cx, -Y, 3.35, 2.8, 0.55, (0 if s < 0 else 1) + var * 2)
    # fauces: puerta alta entre pilastras con capitel
    door(H, 0.0, -Y, -1, 2.0, 3.4, 0.6); interior(H, 0.5, -Y, 0.04, 0.95, 3.3, -1, cell=3)
    flakes(H, -X + 0.4, X - 0.4, -Y, 1.95, 4.2, -1, 4, seed=21 + var)
    for s in (-1, 1):
        H['plaster'].box(s * 1.35 - 0.22, s * 1.35 + 0.22, -Y - 0.2, -Y, 0, 3.9); H['stone'].box(s * 1.35 - 0.3, s * 1.35 + 0.3, -Y - 0.26, -Y, 3.9, 4.1)
    H['stone'].box(-X, X, -Y - 0.15, -Y, 4.4, 4.55)                                              # cornisa
    for x in (-6.5, -3.0, 3.0, 6.5): window(H, x, -Y, 4.75, -1, 0.5, 0.5, shutter=False)        # ventanas altas pequeñas
    # muros laterales y trasero
    for s in (-1, 1): H['socle'].box(s * X - 0.3 if s > 0 else -X - 0.05, s * X + 0.05 if s > 0 else -X + 0.3, -Y, Y, -1.5, 1.0); H['plaster'].box(s * X - 0.6 if s > 0 else -X, X if s > 0 else -X + 0.6, -Y, Y, 1.0, zW)
    H['socle'].box(-X, X, Y - 0.3, Y + 0.05, -1.5, 1.0); H['plaster'].box(-X, X, Y - 0.6, Y, 1.0, zW)
    # crujías del atrio con tejado hacia el compluvio (cubierta toscana, Vitruvio VI 3, 1)
    gable(H, 'x', -X - 0.4, X + 0.4, -Y - 0.4, -4.0, zW + 0.05, zW + 1.6)
    gable(H, 'x', -X - 0.4, X + 0.4, 2.0, Y + 0.4, zW + 0.05, zW + 1.6)
    slope(H, 'y', -4.0, 2.0, -X - 0.4, zW + 1.1, -5.0, zW + 0.2, over=0.2); slope(H, 'y', -4.0, 2.0, X + 0.4, zW + 1.1, 5.0, zW + 0.2, over=0.2)
    # impluvio bajo el compluvio y suelo de mortero del atrio
    H['stone'].box(-2.6, 2.6, -2.3, 0.3, 0.0, 0.18); H['dark'].box(-2.3, 2.3, -2.0, 0.0, 0.1, 0.19)
    H['stone'].box(-1.0, 1.0, 0.6, 1.0, 0.0, 0.85)                                               # cartibulum (mesa de piedra)
    # peristilo al fondo: columnas alrededor del jardín
    for x in (-6.5, -2.2, 2.2, 6.5):
        for y in (5.0, 12.0): column(H, x, y, 0, 3.6, 0.28)
    for y in (7.3, 9.6): column(H, -6.5, y, 0, 3.6, 0.28); column(H, 6.5, y, 0, 3.6, 0.28)
    H['wood'].box(-6.9, 6.9, 4.7, 5.3, 3.74, 3.95); H['wood'].box(-6.9, 6.9, 11.7, 12.3, 3.74, 3.95)
    H['wood'].box(-6.8, -6.2, 4.7, 12.3, 3.74, 3.95); H['wood'].box(6.2, 6.8, 4.7, 12.3, 3.74, 3.95)
    H['stone'].box(-6.2, 6.2, 5.3, 11.7, 0.0, 0.25)                                              # parterre
    if FULL:   # jardín del peristilo: setos de boj, laureles, rosales y una pila con surtidor (pinturas de jardín de Pompeya; Plinio el Joven, Cartas V 6)
        for y in (6.2, 10.8):
            H['plant'].box(-5.2, -1.0, y - 0.18, y + 0.18, 0.25, 0.75); H['plant'].box(1.0, 5.2, y - 0.18, y + 0.18, 0.25, 0.75)
        for (x, y) in ((-4.2, 8.5), (4.2, 8.5)):
            H['wood'].cyl(x, y, 0.08, 0.06, 0.25, 1.6, 6, False)
            H['plant'].lathe(x, y, [(0.0, 1.2), (0.7, 1.5), (0.85, 2.0), (0.7, 2.5), (0.3, 2.8), (0.0, 2.85)], 10)
        for (x, y) in ((-2.4, 7.2), (2.4, 7.2), (-2.4, 9.8), (2.4, 9.8)):
            H['plant'].lathe(x, y, [(0.0, 0.25), (0.35, 0.4), (0.4, 0.65), (0.25, 0.85), (0.0, 0.9)], 8)
            for k in range(5):
                a = k * 1.26; H['flower'].lathe(x + math.cos(a) * 0.28, y + math.sin(a) * 0.28, [(0.0, 0.7), (0.07, 0.74), (0.0, 0.8)], 6)
        H['stone'].lathe(0, 8.5, [(0.9, 0.25), (0.95, 0.55), (0.85, 0.6), (0.82, 0.4), (0.0, 0.4)], 16); H['dark'].cyl(0, 8.5, 0.8, 0.8, 0.5, 0.52, 16)
        H['stone'].cyl(0, 8.5, 0.07, 0.05, 0.5, 1.1, 8)
    return H.build()

# ---------------------------------------------------------------- ínsulas
def insula(name, X, Y, floors, Yb=None, var=0):
    H = House(name); Yb = Yb if Yb is not None else Y; fh = 3.2; z0 = 3.6; ztop = z0 + fh * (floors - 1)
    # planta baja de ladrillo con tiendas de arco rebajado
    H['socle'].box(-X - 0.05, X + 0.05, -Y - 0.05, Yb + 0.05, -1.5, 0.3)
    H['brick'].box(-X, X, -Y, Yb, 0.3, z0)
    n = max(3, int(2 * X / 3.6)); w = 2 * X / n
    for k in range(n):
        cx = -X + w * (k + 0.5); H['dark'].box(cx - w * 0.36, cx + w * 0.36, -Y - 0.02, -Y + 2.0, 0, 2.7)
        for j in range(7):   # arco de ladrillo
            a0, a1 = math.pi * j / 7, math.pi * (j + 1) / 7; r = w * 0.4
            H['brick'].box(cx - math.cos(a0) * r - 0.05, cx - math.cos(a1) * r + 0.05, -Y - 0.06, -Y + 0.02, 2.7 + math.sin(a0) * 0.35, 2.7 + math.sin(a0) * 0.35 + 0.22)
        H['wood'].box(cx - w * 0.36, cx + w * 0.36, -Y - 0.1, -Y + 0.05, 2.55, 2.7)
        interior(H, cx, -Y - 0.02, 0.0, w * 0.72, 2.55, -1, cell=2 if (k + var) % 2 else 3 if k == 0 else 2)
        if (k + var) % 2 == 0: sign(H, cx + w * 0.5, -Y - 0.06, 3.02, w * 0.42, 0.38, (4 + k + var * 2) % 8)
    # pisos de estuco con impostas, ventanas con postigos
    H['plaster'].box(-X, X, -Y, Yb, z0, ztop + 0.3)
    for f in range(floors):
        zf = z0 + fh * f; H['stone'].box(-X - 0.08, X + 0.08, -Y - 0.1, Yb + 0.08, zf - 0.08, zf + 0.06)
        if f == 0: continue
        for k in range(n * 2 - 1):
            cx = -X + w * (k + 1) / 2
            window(H, cx, -Y, zf - fh + 1.0, -1, 0.75, 1.0, shutter=((k + var + f) % 2 == 0))
    # balcón corrido de madera (maenianum) en el primer piso, sobre ménsulas
    zb = z0 + 0.1
    H['wood'].box(-X + 0.4, X - 0.4, -Y - 1.2, -Y, zb, zb + 0.14)
    for k in range(int(2 * X / 1.2)): x = -X + 0.6 + k * 1.2; H['wood'].box(x - 0.08, x + 0.08, -Y - 1.1, -Y, zb - 0.22, zb)
    for k in range(int(2 * X / 0.45)): x = -X + 0.5 + k * 0.45; H['wood'].box(x - 0.025, x + 0.025, -Y - 1.15, -Y - 1.1, zb + 0.14, zb + 1.0)
    H['wood'].box(-X + 0.4, X - 0.4, -Y - 1.2, -Y - 1.08, zb + 0.95, zb + 1.05)
    # tejado a cuatro aguas aproximado con dos faldones y piñones de estuco
    gable(H, 'x', -X - 0.4, X + 0.4, -Y - 0.4, Yb + 0.4, ztop + 0.25, ztop + 0.25 + (Y + Yb) * 0.16, step=0.5)
    return H.build()


# ---------------------------------------------------------------- piezas para templos y calles (K2_*), en unidades del juego
def extrude(H, role, pts, y0, y1):
    """polígono convexo en el plano XZ (x, z), extruido en Y de y0 a y1"""
    n = len(pts); M_ = H[role]
    cx = sum(p[0] for p in pts) / n; cz = sum(p[1] for p in pts) / n
    for k in range(n):
        a, b = pts[k], pts[(k + 1) % n]
        M_.q((a[0], y0, a[1]), (b[0], y0, b[1]), (b[0], y1, b[1]), (a[0], y1, a[1]))
        M_.tri((cx, y0, cz), (b[0], y0, b[1]), (a[0], y0, a[1])); M_.tri((cx, y1, cz), (a[0], y1, a[1]), (b[0], y1, b[1]))

def petal(cx, cz, ang, L, W, n=10):
    ca, sa = math.cos(ang), math.sin(ang); out = []
    for k in range(n):
        t = k / n * TAU; u = (math.cos(t) * 0.5 + 0.5) * L; v = math.sin(t) * W * (0.35 + 0.65 * math.sin(math.pi * (u / L) ** 0.8))
        out.append((cx + sa * u + ca * v, cz + ca * u - sa * v))
    return out

def spiral(H, role, cx, cz, r0, turns, side, w=0.035, y0=-0.05, y1=0.05):
    pts = []; N = 26
    for k in range(N + 1):
        t = k / N; a = side * (t * turns * TAU) + (math.pi if side < 0 else 0); r = r0 * (1 - 0.85 * t)
        pts.append((cx + math.cos(a) * r, cz + math.sin(a) * r))
    for a, b in zip(pts, pts[1:]):
        dx, dz = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dz) or 1; nx, nz = -dz / L * w, dx / L * w
        extrude(H, role, [(a[0] - nx, a[1] - nz), (b[0] - nx, b[1] - nz), (b[0] + nx, b[1] + nz), (a[0] + nx, a[1] + nz)], y0, y1)

def acroterion(name, n=9, s=1.0):
    """acrótera de palmeta (alto 1): base, dos volutas y abanico de hojas pintadas en rojo y azul alternos (reconstrucción)"""
    H = House(name)
    H['marble'].box(-0.28 * s, 0.28 * s, -0.08, 0.08, 0, 0.1 * s)
    for side in (-1, 1): spiral(H, 'marble', side * 0.12 * s, 0.2 * s, 0.1 * s, 1.5, side, 0.022)
    for k in range(n):
        t = (k - (n - 1) / 2) / ((n - 1) / 2); ang = t * math.radians(72)
        L = (0.5 - 0.14 * abs(t)) * s; role = 'paintred' if k % 2 == 0 else 'paintblue'
        extrude(H, role, petal(0, 0.3 * s, ang * 0.85, L, 0.045 * s), -0.04 - 0.01 * (k % 2), 0.04 + 0.01 * (k % 2))
    H['marble'].box(-0.05 * s, 0.05 * s, -0.05, 0.05, 0.22 * s, 0.34 * s)
    return H.build()

def lionhead():
    """gárgola de cabeza de león de la sima (alto ~0,4 m), mirando a +Z del juego; boca abierta con el caño"""
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import numpy as np, criaturas_lib as L
    def sdf(P):
        d = L.sd_ellipsoid(P, (0, 0.2, 0.0), (0.2, 0.2, 0.06))                                       # melena (disco)
        d = L.smin(d, L.sd_ellipsoid(P, (0, 0.2, 0.06), (0.12, 0.13, 0.1)), 0.04)                      # cara
        d = L.smin(d, L.sd_ellipsoid(P, (0, 0.15, 0.15), (0.075, 0.06, 0.07)), 0.03)                   # hocico
        d = L.smin(d, L.sd_ellipsoid(P, (0, 0.27, 0.12), (0.09, 0.03, 0.04)), 0.02)                   # entrecejo
        for sx in (-1, 1):
            d = L.smin(d, L.sd_ellipsoid(P, (sx * 0.11, 0.33, 0.04), (0.035, 0.035, 0.02)), 0.02)     # orejas
            d = L.smax(d, -L.sd_ellipsoid(P, (sx * 0.05, 0.23, 0.155), (0.02, 0.014, 0.02)), 0.008)   # ojos
            for k in range(7):                                                                         # mechones de la melena
                a = (k / 7) * math.pi + 0.2; d = L.smin(d, L.sd_ellipsoid(P, (sx * math.cos(a) * 0.19, 0.2 + math.sin(a) * 0.19 - 0.05, 0.0), (0.05, 0.05, 0.05)), 0.03)
        d = L.smax(d, -L.sd_capsule(P, (0, 0.11, 0.25), (0, 0.11, 0.05), 0.035, 0.035), 0.01)           # caño
        return d
    v, f = L.mesh_from_sdf(sdf, (-0.3, -0.05, -0.1), (0.3, 0.42, 0.3), 0.008)
    H = House('K2_lion'); m = H['marble']
    m.v = [(float(p[0]), float(-p[2]), float(p[1])) for p in v]; m.f = [tuple(int(i) for i in tr) for tr in f]   # malla conectada (si no, al aligerarla se rompe)
    obs = H.build()
    for o in obs:
        dm = o.modifiers.new('d', 'DECIMATE'); dm.ratio = min(1.0, 2500 / max(1, len(o.data.polygons))); bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_apply(modifier='d')
    return obs

def hekataion():
    """Hekataion de encrucijada: pilar con tres cuerpos de Hécate alrededor (tipo de Alcámenes, finales del s. V a.C.)"""
    H = House('K2_hekat')
    H['stone'].box(-0.45, 0.45, -0.45, 0.45, 0, 0.3); H['marble'].cyl(0, 0, 0.14, 0.12, 0.3, 1.75, 10)
    for k in range(3):
        a = k / 3 * TAU; cx, cy = math.cos(a) * 0.17, math.sin(a) * 0.17
        H['marble'].lathe(cx, cy, [(0.13, 0.3), (0.12, 0.8), (0.1, 1.25), (0.13, 1.4), (0.07, 1.48), (0.0, 1.5)], 8)       # cuerpo con peplo
        H['marble'].lathe(cx * 1.05, cy * 1.05, [(0.0, 1.49), (0.06, 1.52), (0.075, 1.6), (0.06, 1.68), (0.0, 1.71)], 8)  # cabeza
        H['marble'].lathe(cx * 1.05, cy * 1.05, [(0.08, 1.66), (0.085, 1.72), (0.0, 1.74)], 8)                             # polos (tocado)
    return H.build()

def compitum():
    """Compitum de un cruce romano: edículo con los Lares pintados en el fondo y un altar delante (como en Pompeya)"""
    H = House('K2_compit')
    H['stone'].box(-0.9, 0.9, -0.6, 0.6, 0, 0.5); H['plaster'].box(-0.85, 0.85, 0.35, 0.6, 0.5, 2.4)
    H['lares'].uvq((-0.75, 0.34, 0.65), (0.75, 0.34, 0.65), (0.75, 0.34, 2.15), (-0.75, 0.34, 2.15))
    for sx in (-0.7, 0.7): column(H, sx, -0.4, 0.5, 2.2, 0.08)
    H['plaster'].box(-0.9, 0.9, -0.55, 0.6, 2.32, 2.42); gable(H, 'y', -0.65, 0.7, -1.0, 1.0, 2.42, 2.85, step=0.3, rafters=False)
    H['stone'].box(-0.35, 0.35, -1.25, -0.75, 0, 0.9); H['stone'].box(-0.42, 0.42, -1.32, -0.68, 0.9, 1.0)
    return H.build()

def stall(name, goods):
    """puesto de mercado: cuatro postes, toldo de tela (papel «roof»: el juego le pone un color a cada puesto), mostrador y mercancía"""
    H = House(name)
    for (x, y) in ((-1.3, -0.8), (1.3, -0.8), (-1.3, 0.8), (1.3, 0.8)): H['wood'].box(x - 0.05, x + 0.05, y - 0.05, y + 0.05, 0, 2.1 if y < 0 else 2.4)
    H['roof'].q((-1.5, -1.2, 2.05), (1.5, -1.2, 2.05), (1.5, 1.0, 2.45), (-1.5, 1.0, 2.45)); H['roof'].q((-1.5, -1.2, 2.04), (-1.5, 1.0, 2.44), (1.5, 1.0, 2.44), (1.5, -1.2, 2.04))
    H['wood'].box(-1.25, 1.25, -0.75, -0.2, 0.75, 0.85); H['wood'].box(-1.2, -1.1, -0.7, -0.25, 0, 0.75); H['wood'].box(1.1, 1.2, -0.7, -0.25, 0, 0.75)
    import random; R = random.Random(len(name))
    if goods == 'pescado':
        for k in range(9): x = -1.0 + (k % 5) * 0.48; y = -0.6 + (k // 5) * 0.2; H['fish'].lathe(x, y, [(0.0, 0.86), (0.04, 0.87), (0.05, 0.9), (0.0, 0.92)], 6)
        H['wood'].box(-1.0, 1.0, 0.2, 0.7, 0, 0.5)
    elif goods == 'ceramica':
        for k in range(10): x = -1.0 + (k % 5) * 0.48; y = -0.55 + (k // 5) * 0.3; s = 0.6 + R.random() * 0.4; H['tile'].lathe(x, y, [(0.03, 0.85), (0.1 * s, 0.9), (0.13 * s, 1.0 + 0.1 * s), (0.06 * s, 1.15 + 0.15 * s), (0.07 * s, 1.18 + 0.15 * s)], 8)
        for k in range(4): H['tile'].lathe(-0.9 + k * 0.6, 0.55, [(0.05, 0), (0.22, 0.25), (0.25, 0.55), (0.12, 0.8), (0.13, 0.85)], 10)
    else:
        for k in range(5): H['cloth%d' % (k % 3 + 1)].cyl(-1.0 + k * 0.5, -0.45, 0.12, 0.12, 0.85, 1.05, 8)
        for k in range(3): H['spice'].lathe(-0.6 + k * 0.6, 0.5, [(0.25, 0), (0.25, 0.3), (0.2, 0.35), (0.0, 0.5)], 10)
    return H.build()

made = []
made += greek('H2_gra', 6.0, 5.5); made += greek('H2_gra2', 6.0, 5.5, var=1); made += greek('H2_gra3', 6.0, 5.5, var=2)
made += greek('H2_grb', 6.0, 5.5, two=True); made += greek('H2_grb2', 6.0, 5.5, two=True, var=1)
made += greek('H2_grc', 4.5, 4.5, small=True); made += greek('H2_grc2', 4.5, 4.5, small=True, var=1)
made += farm(); made += farm('H2_farm2', 1)
made += domus(); made += domus('H2_dom2', 1)
made += insula('H2_insa', 11.15, 8.5, 4); made += insula('H2_insa2', 11.15, 8.5, 4, var=1)
made += insula('H2_insb', 8.15, 7.5, 3); made += insula('H2_insb2', 8.15, 7.5, 3, var=1)
FULL = False   # nivel intermedio (H3_*): las mismas casas sin las piezas pequeñas
made += greek('H3_gra', 6.0, 5.5); made += greek('H3_grb', 6.0, 5.5, two=True); made += greek('H3_grc', 4.5, 4.5, small=True)
made += farm('H3_farm'); made += domus('H3_dom'); made += insula('H3_insa', 11.15, 8.5, 4); made += insula('H3_insb', 8.15, 7.5, 3)
FULL = True
made += stall('K2_puesto1', 'pescado'); made += stall('K2_puesto2', 'ceramica'); made += stall('K2_puesto3', 'telas')
made += acroterion('K2_acroc', 9, 1.0); made += acroterion('K2_acroe', 5, 0.7); made += lionhead(); made += hekataion(); made += compitum()

# ---------------------------------------------------------------- sombra horneada (oclusión ambiental) y desgaste, en el color de los vértices
def bake_vc(objs):
    import random
    SC.render.engine = 'CYCLES'; SC.cycles.samples = 12; SC.cycles.device = 'CPU'
    w = bpy.data.worlds.get('wb') or bpy.data.worlds.new('wb'); SC.world = w; w.light_settings.distance = 1.1
    SC.render.bake.target = 'VERTEX_COLORS'
    groups = {}
    for o in objs: groups.setdefault('_'.join(o.name.split('_')[:2]), []).append(o)
    for gi, (k, L) in enumerate(groups.items()):
        off = (gi % 8) * 90.0, (gi // 8) * 90.0
        for o in L: o.location = (off[0], off[1], 0)
        bpy.ops.mesh.primitive_plane_add(size=60, location=(off[0], off[1], -0.01)); ground = bpy.context.active_object
        for o in L:
            me = o.data; ca = me.color_attributes.new(name='Col', type='BYTE_COLOR', domain='POINT'); me.color_attributes.active_color = ca
            bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
            try: bpy.ops.object.bake(type='AO')
            except Exception as e: print('bake', o.name, e)
            role = o.name.split('_')[-1]; zmax = max(v.co.z for v in me.vertices) if me.vertices else 1; R = random.Random(hash(o.name) & 0xffff)
            for li, vx in enumerate(me.vertices):
                c = ca.data[li].color; ao = 0.42 + 0.58 * c[0]; co = vx.co; f = 1.0
                if role in ('wall', 'plaster', 'brick', 'redpaint'):
                    if co.z > 0.8: f *= 0.9 + 0.1 * min(1.0, (co.z - 0.8) / 1.0)                                   # humedad que sube del suelo
                    if co.z > zmax - 1.6: f *= 1.0 - 0.1 * max(0.0, math.sin(co.x * 3.1 + co.y * 2.3) * math.sin(co.x * 0.7)) * (co.z - (zmax - 1.6)) / 1.6   # chorreones bajo el alero
                elif role == 'roof':
                    h = math.sin(round(co.x / 0.44) * 12.9898 + round(co.y / 0.44) * 78.233) * 43758.5453 % 1.0
                    f *= 0.86 + 0.2 * h if h > 0.06 else 0.74                                                         # tejas de otro tono, alguna con musgo
                elif role == 'wood': f *= 0.86 + 0.14 * R.random()
                v = max(0.0, min(1.0, ao * f)); ca.data[li].color = (v, v, v, 1.0)
        bpy.data.objects.remove(ground, do_unlink=True)
        for o in L: o.location = (0, 0, 0)
bake_vc(made)
# ---------------------------------------------------------------- menos materiales: las piezas pequeñas, en una sola («misc»)
# bronce, antefijas y tejas sueltas, pintura, adobe, huecos oscuros: su color pasa al color de los vértices (multiplicado por la
# sombra horneada) y se juntan en una pieza con un material blanco. Cada casa pasa de unas 12-14 llamadas de dibujo a unas 7.
MISC = {'plant': (0.28, 0.4, 0.2), 'flower': (0.78, 0.3, 0.36), 'fish': (0.62, 0.66, 0.7), 'cloth1': (0.62, 0.22, 0.18), 'cloth2': (0.22, 0.32, 0.55), 'cloth3': (0.8, 0.68, 0.3), 'spice': (0.72, 0.45, 0.15), 'bronze': (0.54, 0.42, 0.23), 'tile': (0.71, 0.35, 0.23), 'redpaint': (0.56, 0.23, 0.16), 'mud': (0.56, 0.45, 0.33), 'paintred': (0.66, 0.27, 0.23),
        'paintblue': (0.23, 0.33, 0.53), 'gold': (0.85, 0.66, 0.23), 'dark': (0.1, 0.08, 0.06)}
def merge_misc(objs):
    groups = {}
    for o in objs: groups.setdefault('_'.join(o.name.split('_')[:2]), []).append(o)
    out = []
    for k, L in groups.items():
        parts = [o for o in L if o.name.split('_')[-1] in MISC]
        if len(parts) < 2 or (k.startswith('K2') and not k.startswith('K2_puesto')): out += L; continue
        for o in parts:
            base = MISC[o.name.split('_')[-1]]; ca = o.data.color_attributes.active_color
            for i in range(len(ca.data)):
                c = ca.data[i].color; ca.data[i].color = (c[0] * base[0], c[1] * base[1], c[2] * base[2], 1.0)
        mat = bpy.data.materials.get('misc') or bpy.data.materials.new('misc')
        for o in parts: o.data.materials.clear(); o.data.materials.append(mat)
        bpy.ops.object.select_all(action='DESELECT')
        for o in parts: o.select_set(True)
        bpy.context.view_layer.objects.active = parts[0]; bpy.ops.object.join(); j = bpy.context.active_object; j.name = k + '_misc'
        out += [o for o in L if o not in parts] + [j]
    return out
made = merge_misc(made)
if PREV:
    SC.render.engine = 'CYCLES'; SC.cycles.samples = 24; SC.render.resolution_x = 640; SC.render.resolution_y = 420; SC.view_settings.view_transform = 'Standard'
    w = bpy.data.worlds.new('w'); SC.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.7, 0.75, 0.8, 1)
    sun = bpy.data.objects.new('sol', bpy.data.lights.new('sol', 'SUN')); SC.collection.objects.link(sun); sun.rotation_euler = (0.8, 0.2, 0.7); sun.data.energy = 3
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); SC.collection.objects.link(cam); SC.camera = cam
    COL = {'wall': (0.9, 0.86, 0.78), 'plaster': (0.86, 0.72, 0.6), 'brick': (0.62, 0.34, 0.24), 'roof': (0.62, 0.3, 0.2), 'tile': (0.66, 0.33, 0.22), 'socle': (0.6, 0.56, 0.5), 'stone': (0.7, 0.66, 0.6), 'wood': (0.3, 0.2, 0.13), 'dark': (0.05, 0.04, 0.03), 'bronze': (0.5, 0.38, 0.2), 'redpaint': (0.55, 0.15, 0.1), 'mud': (0.45, 0.33, 0.22), 'interior': (0.25, 0.18, 0.12), 'sign': (0.9, 0.85, 0.7), 'paintred': (0.6, 0.15, 0.1), 'paintblue': (0.12, 0.2, 0.45), 'gold': (0.8, 0.6, 0.2), 'marble': (0.92, 0.9, 0.85), 'lares': (0.7, 0.5, 0.35)}
    for m in bpy.data.materials:
        m.use_nodes = True; m.node_tree.nodes['Principled BSDF'].inputs[0].default_value = COL.get(m.name, (0.6, 0.6, 0.6)) + (1,)
    from mathutils import Vector
    groups = {}
    for o in made: groups.setdefault('_'.join(o.name.split('_')[:2]), []).append(o)
    for k, L in groups.items():
        for o in made: o.hide_render = o not in L
        lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3)
        for o in L:
            for v in o.bound_box: p = o.matrix_world @ Vector(v); lo = Vector(map(min, lo, p)); hi = Vector(map(max, hi, p))
        c = (lo + hi) / 2; s = (hi - lo).length
        cam.location = c + Vector((0.9, -1.0, 0.6)) * s * 0.9; cam.rotation_euler = (c - cam.location).to_track_quat('-Z', 'Y').to_euler()
        SC.render.filepath = os.path.join(PREV, k + '.png'); bpy.ops.render.render(write_still=True)
    for o in made: o.hide_render = False
for m in bpy.data.materials: m.use_nodes = False
bpy.ops.object.select_all(action='DESELECT')
try: bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_apply=True, export_yup=True, export_vertex_color='ACTIVE')
except TypeError: bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_apply=True, export_yup=True, export_colors=True)
print('EDIFICIOS', OUT, os.path.getsize(OUT))
