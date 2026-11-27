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

class M:
    """malla por papel: M.get(papel).box(...)"""
    def __init__(s): s.v = []; s.f = []
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
    H['tile'].half(p0, p1, 0.12, (0, 0, 1), 5)
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
    for k in range(3):
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
    for k in range(2): B('wood', -w / 2 + w * (k + 1) / 3 - 0.014, -w / 2 + w * (k + 1) / 3 + 0.014, 0.012, 0.035, z, z + h)    # barrotes
    if shutter:
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
    import random; R = random.Random(seed); y = y0
    while y < y1 - 0.05:
        x = x0 + R.random() * 0.2
        while x < x1 - 0.05:
            w = s * (0.7 + R.random() * 0.6); d = s * (0.7 + R.random() * 0.5); h = 0.03 + R.random() * 0.04
            H[role].box(x + 0.03, min(x1, x + w) - 0.03, y + 0.03, min(y1, y + d) - 0.03, z, z + h); x += w
        y += s

# ---------------------------------------------------------------- casa griega con patio
def greek(name, W, D, two=False, small=False):
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
    dx = 3.1 if not small else 1.6
    door(H, dx, -Y, -1)
    for x in ((-X + 1.2, X - 1.2) if not small else (-X + 1.0,)): window(H, x, -Y, 2.2, -1, 0.42, 0.4, shutter=True)
    for x in (-3.5, 0.0, 3.5) if not small else (-2.2, 2.2): window(H, x, Y, 2.4, 1, 0.5, 0.42)   # ventanas altas al fondo
    # pastas: pórtico de madera delante de la nave del fondo
    for x in ([-X + wing + 1.0, -1.2, 1.2, X - wing - 1.0] if not small else [-2.0, 0.0, 2.0]): post(H, x, yb - 1.6, 0, 2.9)
    H['wood'].box(-X + wing, (X - wing) if not small else X - 0.35, yb - 1.82, yb - 1.38, 2.9, 3.12)
    slope(H, 'x', -X + wing, (X - wing) if not small else X - 0.35, yb + 0.05, zW - 0.2, yb - 1.6, 3.0, step=0.48, ante=False, over=0.4)
    # patio empedrado, altar de Zeus Herkeios, brocal de la cisterna, puerta interior y ventanas al patio
    cobbles(H, xl + 0.1, xr - 0.1, -Y + 0.5, yb - 1.9, 0.0, 'stone', 0.6)
    H['stone'].box(-0.5, 0.5, -0.9, -0.3, 0, 0.75); H['stone'].box(-0.6, 0.6, -1.0, -0.2, 0.75, 0.85)
    H['stone'].lathe(1.8 if not small else -1.0, -Y + 2.0, [(0.42, 0), (0.42, 0.55), (0.3, 0.6), (0.28, 0.5)], 12)
    door(H, 0.0, yb, -1, 1.2, 2.3); window(H, -2.6 if not small else -2.0, yb, 1.6, -1, 0.6, 0.6); window(H, 2.6 if not small else 2.0, yb, 1.6, -1, 0.6, 0.6)
    for x in (-X + wing, X - wing) if not small else (-X + wing,):
        s = 1 if x < 0 else -1; door(H, -Y + 3.0, x, s, 0.9, 2.0, axis='y')
    return H.build()

# ---------------------------------------------------------------- granja ática
def farm():
    H = House('H2_farm'); zW = 3.2
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
    return H.build()

# ---------------------------------------------------------------- domus romana
def domus():
    H = House('H2_dom'); X, Y, zW = 9.0, 15.0, 6.0
    # fachada con zócalo y tabernae
    H['socle'].box(-X - 0.05, X + 0.05, -Y - 0.4, -Y + 0.05, -1.5, 1.0)
    H['plaster'].box(-X, X, -Y, -Y + 0.6, 1.0, zW)
    for s in (-1, 1):   # dos tiendas a la calle: hueco ancho, mostrador de obra con dolia, tablas de cierre apoyadas, viga de madera
        cx = s * 5.5; H['dark'].box(cx - 1.6, cx + 1.6, -Y - 0.02, -Y + 2.5, 0, 3.0)
        H['wood'].box(cx - 1.75, cx + 1.75, -Y - 0.12, -Y + 0.1, 3.0, 3.25)
        H['stone'].box(cx - 1.5, cx + 0.2, -Y + 0.2, -Y + 0.75, 0, 0.95)
        for k in range(2): H['tile'].lathe(cx - 1.1 + k * 0.7, -Y + 0.47, [(0.18, 0.96), (0.21, 0.99), (0.16, 1.0)], 10)
        for k in range(4): H['wood'].box(cx + 0.6 + k * 0.22, cx + 0.8 + k * 0.22, -Y + 0.15 + k * 0.03, -Y + 0.21 + k * 0.03, 0, 2.6)
    # fauces: puerta alta entre pilastras con capitel
    door(H, 0.0, -Y, -1, 2.0, 3.4, 0.6)
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
    return H.build()

# ---------------------------------------------------------------- ínsulas
def insula(name, X, Y, floors, Yb=None):
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
    # pisos de estuco con impostas, ventanas con postigos
    H['plaster'].box(-X, X, -Y, Yb, z0, ztop + 0.3)
    for f in range(floors):
        zf = z0 + fh * f; H['stone'].box(-X - 0.08, X + 0.08, -Y - 0.1, Yb + 0.08, zf - 0.08, zf + 0.06)
        if f == 0: continue
        for k in range(n * 2 - 1):
            cx = -X + w * (k + 1) / 2
            window(H, cx, -Y, zf - fh + 1.0, -1, 0.75, 1.0, shutter=(k % 2 == 0))
    # balcón corrido de madera (maenianum) en el primer piso, sobre ménsulas
    zb = z0 + 0.1
    H['wood'].box(-X + 0.4, X - 0.4, -Y - 1.2, -Y, zb, zb + 0.14)
    for k in range(int(2 * X / 1.2)): x = -X + 0.6 + k * 1.2; H['wood'].box(x - 0.1, x + 0.1, -Y - 1.1, -Y, zb - 0.5, zb)
    for k in range(int(2 * X / 0.45)): x = -X + 0.5 + k * 0.45; H['wood'].box(x - 0.025, x + 0.025, -Y - 1.15, -Y - 1.1, zb + 0.14, zb + 1.0)
    H['wood'].box(-X + 0.4, X - 0.4, -Y - 1.2, -Y - 1.08, zb + 0.95, zb + 1.05)
    # tejado a cuatro aguas aproximado con dos faldones y piñones de estuco
    gable(H, 'x', -X - 0.4, X + 0.4, -Y - 0.4, Yb + 0.4, ztop + 0.25, ztop + 0.25 + (Y + Yb) * 0.16, step=0.5)
    return H.build()

made = []
made += greek('H2_gra', 6.0, 5.5)
made += greek('H2_grb', 6.0, 5.5, two=True)
made += greek('H2_grc', 4.5, 4.5, small=True)
made += farm()
made += domus()
made += insula('H2_insa', 11.15, 8.5, 4)
made += insula('H2_insb', 8.15, 7.5, 3)
if PREV:
    SC.render.engine = 'CYCLES'; SC.cycles.samples = 24; SC.render.resolution_x = 640; SC.render.resolution_y = 420; SC.view_settings.view_transform = 'Standard'
    w = bpy.data.worlds.new('w'); SC.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.7, 0.75, 0.8, 1)
    sun = bpy.data.objects.new('sol', bpy.data.lights.new('sol', 'SUN')); SC.collection.objects.link(sun); sun.rotation_euler = (0.8, 0.2, 0.7); sun.data.energy = 3
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); SC.collection.objects.link(cam); SC.camera = cam
    COL = {'wall': (0.9, 0.86, 0.78), 'plaster': (0.86, 0.72, 0.6), 'brick': (0.62, 0.34, 0.24), 'roof': (0.62, 0.3, 0.2), 'tile': (0.66, 0.33, 0.22), 'socle': (0.6, 0.56, 0.5), 'stone': (0.7, 0.66, 0.6), 'wood': (0.3, 0.2, 0.13), 'dark': (0.05, 0.04, 0.03), 'bronze': (0.5, 0.38, 0.2)}
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
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_apply=True, export_yup=True, export_materials='PLACEHOLDER' if False else 'EXPORT')
print('EDIFICIOS', OUT, os.path.getsize(OUT))
