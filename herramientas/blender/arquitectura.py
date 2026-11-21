# Columnas de detalle para la arquitectura cercana (fase B de los modelos 3D: niveles de detalle).
#   /opt/bvenv/bin/python herramientas/blender/arquitectura.py   → modelos/arquitectura.glb (+ _juego.glb, normales en 8 bits)
# El juego dibuja cada columna con piezas de modelos/atenas_modelos.glb (C_*: unos cientos de triángulos) y, a más de 260-340 m,
# con un cilindro. Estas piezas (K_*) son el tercer nivel, para las columnas a menos de unos 40 m: mismas medidas y mismo origen
# que las C_*, de modo que el juego solo cambia la geometría de esas columnas.
#   K_doric_shaft       fuste dórico: radio 1 abajo, 0,79 arriba, alto 1 (el juego lo estira a la altura del fuste); éntasis
#                       (Vitruvio III 3, 13), 20 estrías de arista viva y las tres ranuras del hypotrachelion
#   K_doric_echinus     equino dórico (alto 0,32): tres anillos (anuli) y el perfil del equino, de 0,79 a 1,31
#   K_ionic_base        basa ática (alto 0,56, radio 1,47): toro, escocia y toro con sus filetes (Vitruvio III 5, 2)
#   K_ionic_shaft       fuste jónico: 24 estrías semicirculares separadas por filetes, con apófige abajo
#   K_ionic_capital     capitel jónico: equino con ovas, cojinetes (pulvini) con balteo y volutas en espiral con su ojo, ábaco
#   K_corinthian_capital capitel corintio (alto 2,3): kálathos, dos filas de 8 hojas de acanto, caulículos y volutas en las
#                       esquinas, ábaco de lados cóncavos con florón (Vitruvio IV 1, 11-12)
# Unidades: el radio inferior del fuste = 1 (el juego escala por el radio de cada columna; los fustes, además, por su altura).
import bpy, math, os, sys
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos', 'arquitectura.glb')
TAU = math.tau

class Mesh:
    def __init__(s): s.v = []; s.f = []
    def add(s, p): s.v.append(p); return len(s.v) - 1
    def grid(s, rows, closed_u=True, flip=False):
        """rows: lista de anillos (cada uno, lista de puntos); une anillo a anillo. flip: cara del otro lado
        (los anillos que giran de +x a +z alrededor de +y, como los del torno, necesitan flip para mirar hacia fuera)"""
        idx = [[s.add(p) for p in r] for r in rows]; n = len(rows[0])
        for a, b in zip(idx, idx[1:]):
            for i in range(n if closed_u else n - 1):
                j = (i + 1) % n; s.f.append((a[i], b[i], b[j], a[j]) if flip else (a[i], a[j], b[j], b[i]))
        return idx
    def fan(s, ring, c, flip=False):
        ci = s.add(c); n = len(ring)
        for i in range(n):
            j = (i + 1) % n; s.f.append((ring[i], ci, ring[j]) if not flip else (ring[j], ci, ring[i]))
    def obj(s, name, split=32):
        me = bpy.data.meshes.new(name); me.from_pydata(s.v, [], s.f); me.validate(); me.update()
        for p in me.polygons: p.use_smooth = True
        ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob)
        m = ob.modifiers.new('aristas', 'EDGE_SPLIT'); m.split_angle = math.radians(split); m.use_edge_sharp = False
        mat = bpy.data.materials.get('marble') or bpy.data.materials.new('marble'); me.materials.append(mat)
        tri = sum(len(p.vertices) - 2 for p in me.polygons); print(name, tri, 'triángulos'); return ob

def lathe(M, prof, seg, mod=None):
    """prof: [(r, y)] de abajo arriba; mod(theta, y, r) → r"""
    rows = []
    for r, y in prof:
        ring = []
        for i in range(seg):
            t = i / seg * TAU; rr = mod(t, y, r) if mod else r
            ring.append((rr * math.cos(t), y, rr * math.sin(t)))
        rows.append(ring)
    return M.grid(rows, flip=True)

def tube(M, pts, rad, sides=6, cap=True):
    """tubo a lo largo de pts [(x,y,z)] con radio rad (número o función de 0..1)"""
    rows = []; n = len(pts)
    for k, p in enumerate(pts):
        a = pts[max(0, k - 1)]; b = pts[min(n - 1, k + 1)]
        t = [b[i] - a[i] for i in range(3)]; L = math.sqrt(sum(x * x for x in t)) or 1; t = [x / L for x in t]
        up = (0, 0, 1) if abs(t[2]) < 0.9 else (1, 0, 0)
        u = [up[1] * t[2] - up[2] * t[1], up[2] * t[0] - up[0] * t[2], up[0] * t[1] - up[1] * t[0]]; Lu = math.sqrt(sum(x * x for x in u)) or 1; u = [x / Lu for x in u]
        w = [t[1] * u[2] - t[2] * u[1], t[2] * u[0] - t[0] * u[2], t[0] * u[1] - t[1] * u[0]]
        r = rad(k / (n - 1)) if callable(rad) else rad
        rows.append([tuple(p[i] + r * (math.cos(TAU * j / sides) * u[i] + math.sin(TAU * j / sides) * w[i]) for i in range(3)) for j in range(sides)])
    idx = M.grid(rows)
    if cap: M.fan(idx[0], pts[0]); M.fan(idx[-1], pts[-1], True)

def box(M, x0, x1, y0, y1, z0, z1):
    P = [(x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1), (x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)]
    b = len(M.v); M.v += P
    for f in [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]: M.f.append(tuple(b + i for i in reversed(f)))

# ---------------------------------------------------------------- dórico
def doric_shaft():
    M = Mesh(); NF, PER = 20, 5
    def rb(t): return 1 - 0.21 * t + 0.022 * math.sin(math.pi * t)          # éntasis: se hincha un poco a media altura
    ts = [i / 16 for i in range(17)] + [0.952, 0.956, 0.962, 0.966, 0.972, 0.976]   # ranuras del hypotrachelion
    ts = sorted(set(ts))
    def groove(t): return 0.988 if any(abs(t - g) < 0.0015 for g in (0.956, 0.966, 0.976)) else 1.0
    rows = []
    for t in ts:
        ring = []
        for f in range(NF):
            for k in range(PER):
                u = k / PER; th = (f + u) / NF * TAU
                d = 0.05 * math.sqrt(max(0, 1 - (2 * u - 1) ** 2))      # estría: arco rebajado entre dos aristas vivas
                r = rb(t) * (1 - d) * groove(t)
                ring.append((r * math.cos(th), t, r * math.sin(th)))
        rows.append(ring)
    M.grid(rows, flip=True); return M.obj('K_doric_shaft', split=50)

def doric_echinus():
    M = Mesh(); prof = [(0.79, 0.0)]
    for k in range(3):                                                      # tres anuli
        y = 0.008 + k * 0.022; prof += [(0.795, y), (0.83, y + 0.006), (0.83, y + 0.012), (0.795, y + 0.018)]
    prof += [(0.80, 0.075)]
    for i in range(1, 15):                                                  # equino: sube casi recto y se abre arriba
        s = i / 14; prof.append((0.80 + 0.51 * (1 - (1 - s) ** 1.6) ** 1.05, 0.075 + 0.235 * s ** 0.85))
    prof += [(1.312, 0.31), (1.312, 0.32), (0.0, 0.32)]
    lathe(M, prof, 72); return M.obj('K_doric_echinus')

# ---------------------------------------------------------------- jónico
def ionic_base():
    M = Mesh(); prof = [(1.35, 0.0)]
    for i in range(1, 12): a = -math.pi / 2 + math.pi * i / 12; prof.append((1.35 + 0.12 * math.cos(a), 0.12 + 0.12 * math.sin(a)))   # toro inferior
    prof += [(1.35, 0.24), (1.22, 0.245), (1.22, 0.27)]
    for i in range(1, 10): a = math.pi * i / 10; prof.append((1.22 - 0.065 * math.sin(a), 0.27 + 0.13 * (1 - math.cos(a)) / 2))      # escocia
    prof += [(1.22, 0.40), (1.12, 0.405)]
    for i in range(1, 10): a = -math.pi / 2 + math.pi * i / 10; prof.append((1.12 + 0.078 * math.cos(a), 0.483 + 0.078 * math.sin(a)))  # toro superior
    prof += [(1.12, 0.56), (1.035, 0.56)]
    lathe(M, prof, 72); return M.obj('K_ionic_base')

def ionic_shaft():
    M = Mesh(); NF = 24; rows = []
    ts = [0, 0.004, 0.012, 0.025, 0.045] + [i / 14 for i in range(1, 14)] + [0.955, 0.975, 0.988, 1.0]
    for t in ts:
        rb = (1 - 0.14 * t) * (1 + 0.035 * math.exp(-t / 0.012))           # se estrecha hacia arriba; apófige abajo
        fade = min(1, t / 0.04, (1 - t) / 0.04)                              # las estrías acaban redondeadas
        ring = []
        for f in range(NF):
            for k, (u, flat) in enumerate([(0, 1), (0.1, 1), (0.25, 0), (0.4, 0), (0.55, 0), (0.7, 0), (0.85, 0)]):
                th = (f + (u if k < 2 else 0.1 + (u - 0.1) * 0.9 / 0.9)) / NF * TAU
                d = 0 if flat else 0.065 * math.sin(math.pi * (u - 0.1) / 0.9) * fade
                r = rb * (1 - d); ring.append((r * math.cos(th), t, r * math.sin(th)))
        rows.append(ring)
    M.grid(rows, flip=True); return M.obj('K_ionic_shaft', split=50)

def spiral(cx, cy, z, r0, turns=2.75, eye=0.075, n=90, sgn=1):
    """espiral logarítmica de la voluta: empieza arriba y gira hacia fuera (sgn) y abajo, hasta el ojo"""
    b = math.log(r0 / eye) / (turns * TAU); pts = []
    for i in range(n + 1):
        ph = turns * TAU * i / n; r = r0 * math.exp(-b * ph); a = math.pi / 2 - sgn * ph
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a), z))
    return pts

def ionic_capital():
    M = Mesh()
    # equino con ovas y dardos: 24 ovas que abultan en el cuarto bocel
    prof = [(0.86, 0.0), (0.9, 0.03)] + [(0.9 + 0.11 * math.sin(math.pi * i / 8), 0.03 + 0.2 * i / 8) for i in range(1, 8)] + [(0.9, 0.23), (0.86, 0.26)]
    lathe(M, prof, 96, lambda t, y, r: r * (1 + (0.035 * max(0, math.cos(24 * t)) ** 0.6 if 0.07 < y < 0.2 else 0)))
    # cuerpo central (bajo el ábaco y entre las volutas)
    box(M, -1.2, 1.2, 0.42, 0.86, -0.96, 0.96)
    for sx in (-1, 1):
        cx, cy, R0 = 1.2 * sx, 0.42, 0.46
        # cojinete (pulvinus) a lo largo de z, con el balteo en el centro
        rows = []
        zs = [-0.98 + 1.96 * i / 20 for i in range(21)]
        for z in zs:
            w = 1 - 0.13 * math.exp(-(z / 0.32) ** 2) - (0.03 if abs(abs(z) - 0.12) < 0.03 or abs(z) < 0.03 else 0)
            rows.append([(cx + R0 * w * math.cos(TAU * j / 36), cy + R0 * w * math.sin(TAU * j / 36), z) for j in range(36)])
        idx = M.grid(rows); M.fan(idx[0], (cx, cy, -0.98)); M.fan(idx[-1], (cx, cy, 0.98), True)
        # voluta en las dos caras: listel en espiral y ojo
        for z, zz in ((0.98, 1.0), (-0.98, -1.0)):
            tube(M, spiral(cx, cy, zz, R0 * 0.95, sgn=sx, n=80), lambda u: 0.04 - 0.02 * u, sides=6)
            tube(M, [(cx, cy, z), (cx, cy, zz + (0.035 if zz > 0 else -0.035))], 0.06, sides=10)
    # ábaco, con un pequeño bocel
    box(M, -1.3, 1.3, 0.86, 0.93, -1.04, 1.04); box(M, -1.34, 1.34, 0.93, 0.99, -1.086, 1.086)
    return M.obj('K_ionic_capital')

# ---------------------------------------------------------------- corintio
def leaf(M, ang, y0, H, W, rbell, tip=0.28):
    """hoja de acanto: lámina curva con lóbulos, nervio central y punta que se vuelve hacia fuera; dos caras"""
    NU, NV = 9, 10; rows = []; rows2 = []
    for j in range(NV + 1):
        v = j / NV; w = W * math.sin(math.pi * min(1, v * 1.05) ** 0.75) * (1 + 0.16 * math.sin(5 * math.pi * v) ** 2 * (1 - v))
        y = y0 + H * v - tip * 0.6 * max(0, v - 0.75) ** 2 / 0.0625 * 0.25
        ring = []; ring2 = []
        for i in range(NU + 1):
            u = -1 + 2 * i / NU; a = ang + u * w / max(0.3, rbell(y))
            out = 0.03 + 0.05 * (1 - abs(u)) + tip * v ** 3 + 0.03 * abs(math.sin(u * 6))  # nervio y pliegues
            r = rbell(y) + out
            ring.append((r * math.cos(a), y, r * math.sin(a))); ring2.append(((r - 0.02) * math.cos(a), y, (r - 0.02) * math.sin(a)))
        rows.append(ring); rows2.append(ring2[::-1])
    M.grid(rows, closed_u=False); M.grid(rows2, closed_u=False)

def corinthian_capital():
    M = Mesh()
    def rbell(y): return 0.9 + 0.17 * (y / 2.0) ** 1.6
    lathe(M, [(0.9, 0.0)] + [(0.9 + 0.05 * math.sin(math.pi * i / 6), 0.01 + 0.08 * i / 6) for i in range(1, 6)] + [(0.9, 0.1)] +
          [(rbell(y), y) for y in [0.15 + 1.85 * i / 10 for i in range(11)]] + [(1.12, 2.0), (1.12, 2.05), (0, 2.05)], 64)
    for k in range(8): leaf(M, k / 8 * TAU, 0.08, 0.85, 0.42, rbell, tip=0.22)                     # fila baja
    for k in range(8): leaf(M, (k + 0.5) / 8 * TAU, 0.45, 1.0, 0.4, rbell, tip=0.26)               # fila alta, entre las otras
    up = (0, 1, 0)
    def vol(c, d, R0, turns, rad, n=36):     # espiral en el plano de d (horizontal) y la vertical: arranca abajo, se abre hacia d y se enrolla
        pts = []
        for i in range(n + 1):
            u = i / n; ph = -math.pi / 2 + u * turns * TAU; R = R0 * math.exp(-1.3 * u)
            pts.append(tuple(c[k] + d[k] * R * math.cos(ph) + up[k] * R * math.sin(ph) for k in range(3)))
        tube(M, pts, lambda u: rad * (1 - 0.5 * u), sides=6); return pts[0]
    def stem(p0, p1, rad):                    # caulículo: tallo que sale entre las hojas y sube curvado hasta la voluta
        pts = [tuple(p0[q] + (p1[q] - p0[q]) * s + (0.06 * math.sin(math.pi * s) if q != 1 else 0) * (p0[q] / max(0.01, math.hypot(p0[0], p0[2]))) for q in range(3)) for s in [i / 8 for i in range(9)]]
        tube(M, pts, lambda u: rad * (1.15 - 0.3 * u), sides=8)
    for k in range(4):
        a = (k + 0.5) / 4 * TAU; d = (math.cos(a), 0, math.sin(a)); tng = (-math.sin(a), 0, math.cos(a))
        for side in (-1, 1):                                                                        # pareja de volutas de esquina, cada una con su caulículo
            o = [tng[q] * side * 0.09 for q in range(3)]
            st = vol(tuple(d[q] * 1.16 + o[q] + up[q] * 1.92 for q in range(3)), d, 0.25, 1.45, 0.06)
            stem(tuple(d[q] * 1.0 + o[q] * 2.2 + up[q] * 1.3 for q in range(3)), st, 0.065)
        b2 = k / 4 * TAU; e = (math.cos(b2), 0, math.sin(b2)); tb = (-math.sin(b2), 0, math.cos(b2))
        for side in (-1, 1):                                                                        # hélices del centro de cada lado, que se enrollan una hacia la otra
            dd = tuple(tb[q] * -side for q in range(3))
            st = vol(tuple(e[q] * 1.06 + tb[q] * side * 0.2 + up[q] * 1.88 for q in range(3)), dd, 0.15, 1.4, 0.04, n=28)
            stem(tuple(e[q] * 1.02 + tb[q] * side * 0.32 + up[q] * 1.45 for q in range(3)), st, 0.042)
    # ábaco: cuadrado de lados cóncavos (flecha 0,2) con las esquinas cortadas, bocel arriba y florón en el centro de cada lado
    ring = []; A = 1.0
    C = [(A, A), (-A, A), (-A, -A), (A, -A)]
    for k in range(4):
        p0, p1 = C[k], C[(k + 1) % 4]; mx, mz = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2; L = math.hypot(mx, mz); nx, nz = -mx / L, -mz / L
        for i in range(17):
            u = 0.05 + 0.9 * i / 16; x = p0[0] + (p1[0] - p0[0]) * u + nx * 0.2 * math.sin(math.pi * u); z = p0[1] + (p1[1] - p0[1]) * u + nz * 0.2 * math.sin(math.pi * u)
            ring.append((x, z))
    ring = ring[::-1]
    for y0, y1, k in ((2.05, 2.2, 1.0), (2.2, 2.3, 1.03)):
        lo = [M.add((x * k, y0, z * k)) for x, z in ring]; hi = [M.add((x * k, y1, z * k)) for x, z in ring]; N = len(ring)
        for i in range(N): j = (i + 1) % N; M.f.append((lo[i], lo[j], hi[j], hi[i]))
        M.fan(hi, (0, y1, 0), True); M.fan(lo, (0, y0, 0))
    for k in range(4):
        t = k / 4 * TAU; c = (0.86 * math.cos(t), 2.17, 0.86 * math.sin(t))
        tube(M, [c, (c[0] * 1.12, c[1], c[2] * 1.12)], 0.085, sides=10)
    return M.obj('K_corinthian_capital')

def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for f in (doric_shaft, doric_echinus, ionic_base, ionic_shaft, ionic_capital, corinthian_capital): f()
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(OUT), export_format='GLB', export_normals=True, export_texcoords=False,
                              export_materials='PLACEHOLDER', export_apply=True, export_yup=False)
    print('escrito', os.path.abspath(OUT), os.path.getsize(OUT) // 1024, 'KB')
    import subprocess
    subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'compactar_glb.py'), os.path.abspath(OUT), os.path.abspath(OUT.replace('.glb', '_juego.glb'))], check=True)

main()
