# La Hidra de Lerna para el portal de las leyendas (fuente/codigo/208_portal_de_las_leyendas.js) → modelos/hidra.glb
#   /opt/bvenv/bin/python herramientas/blender/hidra.py [-- vista.png]
# Hecha a mano con código (sin modelos ajenos): todo es nuestro y se puede publicar con el juego.
# Piezas (el juego las combina; las cabezas y los cuellos se multiplican):
#   HY_cuerpo    el cuerpo de serpiente enroscado, del que salen los cuellos (la cima, en HY_cima: un vacío con su posición)
#   HY_cuello    un cuello recto a lo largo de +Z, de 0 a 1 (la longitud la pone el juego: dobla cada vértice sobre una curva)
#   HY_cabeza    la cabeza (cráneo, dientes de arriba, ojos), mirando a -Y; el origen, en la nuca, donde acaba el cuello
#   HY_mandibula la mandíbula (dientes de abajo, lengua bífida), hija de la cabeza, con el origen en la bisagra (se abre girando en X)
# Aspecto: serpiente de agua grande, escamas carenadas en el lomo (verde bronce oscuro con manchas en rombo), placas ventrales
# anchas y amarillentas, ojos ámbar de pupila vertical, colmillos curvos. Las texturas (color y relieve) se calculan aquí (numpy).
# Iconografía: en la cerámica griega (p. ej. la hidria de Caere del Getty, h. 525 a.C.) la Hidra es una gran serpiente con muchos
# cuellos que salen de un solo cuerpo; el número de cabezas varía según el autor (Alceo 9, Simónides 50, Apolodoro 9, una inmortal).
import bpy, bmesh, sys, os, math, numpy as np
from mathutils import Vector, Matrix
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
PREV = args[0] if args else None
AQ = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(AQ, '..', '..', 'modelos', 'hidra.glb')
TMP = os.path.join(AQ, '..', '..', 'modelos', '_hidra_tex'); os.makedirs(TMP, exist_ok=True)
TAU = 2 * math.pi
bpy.ops.wm.read_factory_settings(use_empty=True)
rng = np.random.default_rng(386)

# ------------------------------------------------------------------ texturas (repetibles en u y en v)
def _hash(a, b):
    x = np.sin(a * 127.1 + b * 311.7) * 43758.5453
    return x - np.floor(x)
def _smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def scales_tex(S=1024, NU=26, NV=26):
    """Escamas: u = alrededor (0,5 = el vientre), v = a lo largo. Devuelve color (S,S,3) y altura (S,S)."""
    v, u = np.mgrid[0:S, 0:S] / S
    # --- lomo y flancos: escamas carenadas en tresbolillo, que se solapan como tejas (cada fila tapa la base de la siguiente)
    row = np.floor(v * NV); off = 0.5 * (row % 2); cu = u * NU + off; col = np.floor(cu)
    x = cu - col - 0.5; y = v * NV - row - 0.5
    d = (x / 0.56) ** 2 + ((y + 0.12) / 0.66) ** 2
    dome = np.clip(1 - d, 0, 1) ** 0.6
    tip = np.clip(0.5 - y, 0, 1)                     # más alta hacia la punta (que mira a la cola)
    keel = 0.35 * np.exp(-(x / 0.07) ** 2) * _smooth(-y, -0.45, 0.1)
    hd = dome * (0.55 + 0.45 * tip) + keel * (dome > 0.05)
    # --- vientre: placas anchas (una por cada dos filas), con el borde trasero levantado
    yb = (v * NV / 2) % 1.0
    hb = (0.35 + 0.65 * yb ** 1.4) * _smooth(yb, 0.0, 0.06)
    bel = _smooth(np.abs(u - 0.5), 0.17, 0.12)       # 1 en el vientre, 0 fuera (transición suave en el borde)
    H = hd * (1 - bel) + hb * bel
    # --- color
    rnd = _hash(col % NU, row % NV)
    # manchas en rombo a lo largo del lomo (repetibles: frecuencias enteras)
    du = np.minimum(np.abs(u - 0.0), np.abs(u - 1.0))     # distancia al lomo (u = 0)
    dia = np.abs(((v * 4) % 1.0) - 0.5) * 2               # 0..1 a lo largo
    blot = _smooth(0.32 - (du * 2.4 + np.abs(dia - 0.5) * 0.9), 0.0, 0.08)
    side = np.abs(((u * 2 + v * 8) % 1.0) - 0.5) * 2       # bandas oblicuas en los flancos
    sideb = _smooth(0.18 - np.abs(side - 0.5) * 0.5 - np.abs(du - 0.27), 0.0, 0.05)
    c_back = np.array([0.25, 0.30, 0.17]); c_dark = np.array([0.07, 0.09, 0.05]); c_flank = np.array([0.33, 0.35, 0.19]); c_belly = np.array([0.58, 0.55, 0.40])
    fl = _smooth(du, 0.16, 0.36)[..., None]
    C = c_back * (1 - fl) + c_flank * fl
    C = C * (1 - blot[..., None]) + c_dark * blot[..., None]
    C = C * (1 - 0.7 * sideb[..., None]) + c_dark * 0.7 * sideb[..., None]
    C = C * (0.85 + 0.3 * rnd[..., None])
    C = C * (1 - bel[..., None]) + c_belly * (0.9 + 0.15 * _hash(np.floor(v * NV / 2), 3.0))[..., None] * bel[..., None]
    ao = 0.35 + 0.65 * np.clip(H * 1.4, 0, 1)
    C = np.clip(C * ao[..., None], 0, 1)
    return C, H
def normal_from_height(H, k=6.0):
    gx = (np.roll(H, -1, 1) - np.roll(H, 1, 1)) * 0.5 * k; gy = (np.roll(H, -1, 0) - np.roll(H, 1, 0)) * 0.5 * k
    n = np.stack([-gx, gy, np.ones_like(H)], -1); n /= np.linalg.norm(n, axis=-1, keepdims=True)
    return n * 0.5 + 0.5
def eye_tex(S=256):
    y, x = (np.mgrid[0:S, 0:S] / S - 0.5) * 2
    r = np.hypot(x, y); a = np.arctan2(y, x)
    iris = np.array([0.85, 0.58, 0.12]) * (0.8 + 0.12 * np.sin(a * 23 + r * 30 + np.sin(a * 7) * 2)[..., None]) * (1.15 - 0.5 * r)[..., None]
    pupil = (np.abs(x) < 0.09 * np.sqrt(np.clip(1 - (y / 0.8) ** 2, 0, 1)) + 0.005) & (np.abs(y) < 0.8)
    C = np.where(pupil[..., None], 0.02, iris)
    C = np.where((r > 0.92)[..., None], np.array([0.12, 0.08, 0.03]), C)
    return np.clip(C, 0, 1)
def save_img(name, arr, alpha=None):
    S0, S1 = arr.shape[:2]; im = bpy.data.images.new(name, S1, S0, alpha=False)
    px = np.concatenate([arr[::-1], np.ones((S0, S1, 1))], -1).astype(np.float32)   # Blender guarda las filas de abajo arriba
    im.pixels.foreach_set(px.ravel()); im.filepath_raw = os.path.join(TMP, name + '.png'); im.file_format = 'PNG'; im.save(); return im
C, H = scales_tex(); N = normal_from_height(H)
IM_C = save_img('hidra_escamas', C); IM_N = save_img('hidra_escamas_relieve', N); IM_E = save_img('hidra_ojo', eye_tex())
IM_N.colorspace_settings.name = 'Non-Color'

def mat_scales(name='escamas_hidra'):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = IM_C; nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    tn = nt.nodes.new('ShaderNodeTexImage'); tn.image = IM_N; nm = nt.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = 1.0
    nt.links.new(tn.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    b.inputs['Roughness'].default_value = 0.42
    try: b.inputs['Specular IOR Level'].default_value = 0.6
    except Exception: pass
    return m
def mat_plain(name, rgb, rough=0.5, emit=None, img=None):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    if img:
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = img; nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
        if emit: nt.links.new(t.outputs['Color'], b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value = emit
    return m
M_SC = mat_scales(); M_MOUTH = mat_plain('boca_hidra', (0.36, 0.09, 0.09), 0.35); M_TOOTH = mat_plain('dientes_hidra', (0.86, 0.82, 0.68), 0.3)
M_EYE = mat_plain('ojo_hidra', (1, 1, 1), 0.08, emit=0.6, img=IM_E); M_TONGUE = mat_plain('lengua_hidra', (0.30, 0.05, 0.08), 0.3)

# ------------------------------------------------------------------ utilidades de malla
def obj_from(name, verts, faces, uvs=None, mats=None, fmat=None, smooth=True):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], [tuple(f) for f in faces]); me.update()
    if uvs is not None:
        ul = me.uv_layers.new(name='UVMap')
        for p in me.polygons:
            for li in p.loop_indices:
                vi = me.loops[li].vertex_index; ul.data[li].uv = uvs[vi] if not isinstance(uvs, dict) else uvs[(p.index, vi)]
    for m in (mats or []): me.materials.append(m)
    if fmat is not None:
        for p in me.polygons: p.material_index = fmat[p.index]
    for p in me.polygons: p.use_smooth = smooth
    ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob); return ob
def tube(path, radius, K=24, up=Vector((0, 0, 1)), vscale=1.0, cap0=False, cap1=True, flat=None):
    """Tubo a lo largo de una lista de puntos. radius(i) → radio; flat(i) → (ancho, alto) relativos. u: 0 en el lomo, 0,5 en el vientre.
    v: longitud recorrida / perímetro (las escamas no se estiran). Devuelve vértices, caras y uv (por vértice, con costura)."""
    n = len(path); V = []; F = []; UV = []; v_acc = 0.0; prevN = None
    for i in range(n):
        p = path[i]; t = (path[min(n - 1, i + 1)] - path[max(0, i - 1)]).normalized()
        if prevN is None: Nn = (up - t * up.dot(t)).normalized()
        else: Nn = (prevN - t * prevN.dot(t)).normalized()       # marco que no gira (transporte paralelo)
        prevN = Nn; B = t.cross(Nn).normalized(); r = radius(i); fw, fh = flat(i) if flat else (1, 1)
        if i: v_acc += (path[i] - path[i - 1]).length / (TAU * max(0.02, r)) * vscale
        for k in range(K + 1):
            a = k / K * TAU   # a = 0: arriba (lomo); a = π: abajo (vientre)
            q = p + Nn * (math.cos(a) * r * fh) + B * (math.sin(a) * r * fw)
            V.append(q); UV.append((k / K, v_acc))
    for i in range(n - 1):
        for k in range(K):
            a = i * (K + 1) + k; F.append((a, a + 1, a + K + 2, a + K + 1))
    if cap1:   # punta: un polo
        c = len(V); V.append(path[-1] + (path[-1] - path[-2]).normalized() * radius(n - 1) * 0.6); UV.append((0.5, v_acc + 0.1))
        for k in range(K): a = (n - 1) * (K + 1) + k; F.append((a, a + 1, c))
    if cap0:
        c = len(V); V.append(path[0] - (path[1] - path[0]).normalized() * radius(0) * 0.5); UV.append((0.5, -0.1))
        for k in range(K): F.append((k + 1, k, c))
    return V, F, UV

# ------------------------------------------------------------------ el cuello (recto, de z = 0 a z = 1; radio en metros)
def neck():
    NS = 44; path = [Vector((0, 0, i / (NS - 1))) for i in range(NS)]
    rad = lambda i: (0.36 - 0.15 * (i / (NS - 1)) ** 0.8) * (1 + 0.06 * math.exp(-((i / (NS - 1) - 0.08) / 0.08) ** 2))
    V, F, UV = tube(path, rad, K=26, up=Vector((0, -1, 0)), vscale=4.0, cap0=False, cap1=False, flat=lambda i: (1.0, 0.9))
    # nota: el lomo (u = 0) mira a -Y, como la cara de arriba de la cabeza; el vientre, a +Y
    ob = obj_from('HY_cuello', V, F, UV, [M_SC]); return ob

# ------------------------------------------------------------------ la cabeza y la mandíbula (loft de secciones superelípticas)
HL = 0.95; HINGE_T = 0.2
def wid(t): return 0.17 + 0.11 * math.exp(-((t - 0.3) / 0.22) ** 2) - 0.08 * max(0, t - 0.55) / 0.45 - 0.02 * max(0, t - 0.85) / 0.15
def hup(t): return 0.16 + 0.04 * math.exp(-((t - 0.3) / 0.2) ** 2) + 0.035 * math.exp(-((t - 0.46) / 0.07) ** 2) - 0.1 * max(0, t - 0.5) / 0.5
def hjaw(t): return 0.115 - 0.065 * max(0, t - 0.25) / 0.75
def sup(c, s, n=2.6):
    return math.copysign(abs(c) ** (2 / n), c), math.copysign(abs(s) ** (2 / n), s)
def head():
    NT = 52; K = 40; V = []; UV = []; F = []; FM = []
    def ring_upper(t):
        y = -t * HL; w = wid(t); hu = hup(t)
        # por debajo: la garganta llena detrás de la bisagra, el paladar delgado delante
        bl = 1 - min(1, max(0, (t - HINGE_T + 0.04) / 0.08)); hp = hjaw(t) * 0.95 * bl + 0.018 * (1 - bl)
        pts = []
        for k in range(K + 1):
            a = k / K * TAU; c, s = math.cos(a), math.sin(a); X, Z = sup(s, c)   # a = 0 arriba
            z = Z * (hu if Z > 0 else hp); x = X * w * (1 if Z > -0.2 else 1 - 0.15 * (1 - bl))
            pts.append(Vector((x, y, z)))
        return pts
    for i in range(NT):
        t = (i / (NT - 1)) ** 0.9 * 0.985
        for k, p in enumerate(ring_upper(t)): V.append(p); UV.append((k / K, t * HL / (TAU * 0.2)))
    for i in range(NT - 1):
        for k in range(K):
            a = i * (K + 1) + k; F.append((a, a + K + 1, a + K + 2, a + 1))
            ang = (k + 0.5) / K * TAU; FM.append(1 if (math.cos(ang) < -0.6 and i / NT > HINGE_T + 0.04) else 0)   # paladar: boca
    # hocico: casquete
    c = len(V); V.append(Vector((0, -HL, 0.03))); UV.append((0.5, HL / (TAU * 0.2) + 0.05))
    for k in range(K): a = (NT - 1) * (K + 1) + k; F.append((a, c, a + 1)); FM.append(0)
    # nuca: casquete (tapado por el cuello, pero cerrado)
    c = len(V); V.append(Vector((0, 0.06, 0.0))); UV.append((0.5, -0.05))
    for k in range(K): F.append((k + 1, c, k)); FM.append(0)
    # ---- detalles: cuencas y arcos de los ojos, fosas nasales, mejillas
    EYE_T = 0.43; ex = wid(EYE_T) * 0.82; ez = hup(EYE_T) * 0.5; ey = -EYE_T * HL
    for j, v in enumerate(V):
        for sg in (1, -1):
            d = (v - Vector((sg * ex, ey, ez))).length
            if d < 0.09: v += Vector((sg * 0.012, 0, 0)) * -(1 - d / 0.09) * 1.8                # cuenca
            br = Vector((sg * ex * 0.95, ey + 0.01, ez + 0.06))
            db = math.hypot((v.y - br.y) / 1.6, v.z - br.z) if abs(v.x - br.x) < 0.07 else 9
            if db < 0.05 and v.z > ez: v.z += 0.025 * (1 - db / 0.05); v.x += sg * 0.01 * (1 - db / 0.05)   # arco ciliar
            nz = Vector((sg * 0.045, -HL * 0.95, hup(0.95) * 0.75))
            if (v - nz).length < 0.025: v -= (v - Vector((sg * 0.02, -HL * 0.93, 0))).normalized() * 0.012 * (1 - (v - nz).length / 0.025)   # fosas nasales
        if 0.1 < -v.y / HL < 0.35 and v.z < 0.04 and abs(v.x) > 0.12: v.x *= 1.04   # músculos de la mandíbula (mejillas)
    ob = obj_from('HY_cabeza', V, F, UV, [M_SC, M_MOUTH], FM)
    # ---- ojos (esferas de verdad, encajadas en la cuenca)
    for sg in (1, -1):
        bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=14, radius=0.042)
        uvl = bm.loops.layers.uv.new('UVMap')
        for f in bm.faces:
            for l in f.loops: co = l.vert.co; l[uvl].uv = (co.y / 0.084 * -1 + 0.5, co.z / 0.084 + 0.5) if sg > 0 else (co.y / 0.084 + 0.5, co.z / 0.084 + 0.5)
        me = bpy.data.meshes.new('ojo'); bm.to_mesh(me); bm.free()
        for p in me.polygons: p.use_smooth = True
        me.materials.append(M_EYE); eo = bpy.data.objects.new('HY_ojo', me); bpy.context.scene.collection.objects.link(eo)
        eo.location = (sg * (ex - 0.008), ey, ez + 0.004); eo.rotation_euler = (0, 0, sg * math.radians(90)); eo.scale = (1, 1, 0.92)
        join_into(ob, eo)
    # ---- dientes de arriba: en el borde del paladar, apuntando abajo y un poco atrás; dos colmillos delante
    for sg in (1, -1):
        for j in range(15):
            t = 0.27 + j / 14 * 0.66; w = wid(t) * 0.9; L = 0.03 + 0.012 * math.sin(j * 1.7) ** 2
            if j in (11, 12): L = 0.085 if j == 12 else 0.05
            add_tooth(ob, Vector((sg * w, -t * HL, -0.01)), Vector((0, 0.35, -1)).normalized(), L, 0.009 + (0.006 if j == 12 else 0))
    return ob, (ex, ey, ez)
def add_tooth(target, base, dirv, L, r):
    bm = bmesh.new(); seg = 5; K = 7; rings = []
    for i in range(seg + 1):
        u = i / seg; c = base + dirv * L * u + Vector((0, 0.18 * L * u * u, 0))   # se curva hacia atrás
        rr = r * (1 - u) ** 0.8 + 0.0005; rings.append([bm.verts.new(c + Vector((math.cos(k / K * TAU) * rr, math.sin(k / K * TAU) * rr * 0.8, 0))) for k in range(K)])
    for i in range(seg):
        for k in range(K): bm.faces.new((rings[i][k], rings[i][(k + 1) % K], rings[i + 1][(k + 1) % K], rings[i + 1][k]))
    me = bpy.data.meshes.new('diente'); bm.to_mesh(me); bm.free(); me.materials.append(M_TOOTH)
    for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new('d', me); bpy.context.scene.collection.objects.link(o); join_into(target, o)
def join_into(target, o):
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); target.select_set(True); bpy.context.view_layer.objects.active = target
    if not o.data.uv_layers: o.data.uv_layers.new(name='UVMap')
    bpy.ops.object.join()
def jaw():
    NT = 40; K = 32; V = []; UV = []; F = []; FM = []; t0 = HINGE_T - 0.04; t1 = 0.965
    for i in range(NT):
        t = t0 + (t1 - t0) * i / (NT - 1); y = -t * HL; w = wid(t) * 0.92; h = hjaw(t)
        for k in range(K + 1):
            a = k / K * TAU; c, s = math.cos(a), math.sin(a); X, Z = sup(s, c)
            z = -0.012 + (Z * 0.012 if Z > 0 else Z * h); V.append(Vector((X * w, y, z))); UV.append((k / K, t * HL / (TAU * 0.16)))
    for i in range(NT - 1):
        for k in range(K):
            a = i * (K + 1) + k; F.append((a, a + K + 1, a + K + 2, a + 1)); ang = (k + 0.5) / K * TAU; FM.append(1 if math.cos(ang) > 0.55 else 0)
    c = len(V); V.append(Vector((0, -t1 * HL - 0.015, -0.03))); UV.append((0.5, 1.5))
    for k in range(K): a = (NT - 1) * (K + 1) + k; F.append((a, c, a + 1)); FM.append(0)
    c = len(V); V.append(Vector((0, -t0 * HL + 0.03, -0.05))); UV.append((0.5, 0))
    for k in range(K): F.append((k + 1, c, k)); FM.append(0)
    ob = obj_from('HY_mandibula', V, F, UV, [M_SC, M_MOUTH], FM)
    for sg in (1, -1):
        for j in range(12):
            t = 0.32 + j / 11 * 0.58; w = wid(t) * 0.82
            add_tooth(ob, Vector((sg * w, -t * HL, -0.005)), Vector((0, 0.3, 1)).normalized(), 0.024 + 0.008 * math.sin(j * 2.1) ** 2, 0.007)
    # lengua bífida, recogida dentro de la boca
    pts = [Vector((0, -(0.35 + 0.5 * u) * HL, 0.002 + 0.01 * math.sin(u * 3))) for u in np.linspace(0, 1, 14)]
    bm = bmesh.new(); prev = None
    for i, p in enumerate(pts):
        u = i / (len(pts) - 1); w = 0.03 * (1 - 0.6 * u)
        if u > 0.72:   # la horquilla
            sp = (u - 0.72) / 0.28 * 0.035; row = [bm.verts.new(p + Vector((-sp - w * 0.4, 0, 0))), bm.verts.new(p + Vector((-sp + w * 0.2, 0, 0))), bm.verts.new(p + Vector((sp - w * 0.2, 0, 0))), bm.verts.new(p + Vector((sp + w * 0.4, 0, 0)))]
        else: row = [bm.verts.new(p + Vector((-w, 0, 0))), bm.verts.new(p + Vector((-w * 0.3, 0, 0.004))), bm.verts.new(p + Vector((w * 0.3, 0, 0.004))), bm.verts.new(p + Vector((w, 0, 0)))]
        if prev:
            for k in range(3):
                if u > 0.72 and k == 1: continue
                bm.faces.new((prev[k], prev[k + 1], row[k + 1], row[k]))
        prev = row
    me = bpy.data.meshes.new('lengua'); bm.to_mesh(me); bm.free(); me.materials.append(M_TONGUE)
    lo = bpy.data.objects.new('lengua', me); bpy.context.scene.collection.objects.link(lo); join_into(ob, lo)
    # el origen, en la bisagra
    hinge = Vector((0, -HINGE_T * HL + 0.02, -0.01))
    ob.data.transform(Matrix.Translation(-hinge)); ob.location = hinge
    return ob

# ------------------------------------------------------------------ el cuerpo: la cola enroscada dos vueltas y el tronco que sube
def body():
    pts = []; NP = 150
    for i in range(NP):
        u = i / (NP - 1)
        if u < 0.78:   # espiral en el suelo, de fuera hacia dentro, apoyada
            a = 1.2 + u / 0.78 * TAU * 1.85; R = 3.3 - 1.5 * u / 0.78
            rr = 0.08 + 0.62 * (u / 0.78) ** 0.7
            pts.append((Vector((math.cos(a) * R, math.sin(a) * R * 0.92, rr * 0.82 + 0.02 * math.sin(a * 3))), rr))
        else:          # el tronco sube hacia el centro, donde nacen los cuellos
            w = (u - 0.78) / 0.22; a = 1.2 + TAU * 1.85 + w * 1.4; R = 1.8 * (1 - w) ** 1.3
            rr = 0.7 + 0.25 * math.sin(w * math.pi)
            pts.append((Vector((math.cos(a) * R, math.sin(a) * R * 0.92, 0.6 + 1.25 * w ** 1.2)), rr))
    # la cima: el tronco se redondea en una cúpula ancha (los hombros de donde salen los cuellos)
    p1, r1 = pts[-1]; tdir = (pts[-1][0] - pts[-2][0]).normalized()
    for j in range(1, 9):
        ph = j / 8 * math.pi / 2 * 0.97; pts.append((p1 + tdir * r1 * 0.9 * math.sin(ph), r1 * 1.08 * math.cos(ph) + 0.02))
    P = [p for p, r in pts]; RR = [r for p, r in pts]; NP = len(P)
    V, F, UV = tube(P, lambda i: RR[i], K=32, up=Vector((0, 0, 1)), vscale=1.0, cap0=True, cap1=True, flat=lambda i: (1.0, 0.82 if i < 150 * 0.78 else 0.95))
    ob = obj_from('HY_cuerpo', V, F, UV, [M_SC])
    top = P[-9] + Vector((0, 0, 0.25))
    e = bpy.data.objects.new('HY_cima', None); e.location = top; bpy.context.scene.collection.objects.link(e)
    return ob, top

nk = neck(); hd, eye = head(); jw = jaw(); jw.parent = hd; bd, top = body()
# las caras hacia fuera (el juego dibuja solo la cara de delante: con las normales hacia dentro, se vería el interior negro)
for o in (nk, hd, jw, bd):
    bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free(); o.data.update()
# limpieza de nombres de malla y triángulos
for o in (nk, hd, jw, bd): o.data.name = o.name
tri = {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in (nk, hd, jw, bd)}
print('HIDRA triángulos', tri, 'cima', tuple(round(c, 2) for c in top))
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_image_format='JPEG', export_jpeg_quality=86, export_apply=True, export_yup=True)
print('HIDRA', OUT, os.path.getsize(OUT))

# ------------------------------------------------------------------ vista previa (Cycles): una hidra montada como en el juego
if PREV:
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = 24; sc.render.resolution_x = 1200; sc.render.resolution_y = 800
    sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True; sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0.55, 0.62, 0.7, 1); sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.8
    l = bpy.data.lights.new('sol', 'SUN'); l.energy = 3.5; lo = bpy.data.objects.new('sol', l); lo.rotation_euler = (0.8, 0.2, 2.4); sc.collection.objects.link(lo)
    gr = bpy.data.meshes.new('suelo'); bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=30); bm.to_mesh(gr); bm.free()
    gr.materials.append(mat_plain('barro', (0.3, 0.27, 0.18), 0.9)); go = bpy.data.objects.new('suelo', gr); sc.collection.objects.link(go)
    # cuellos doblados (como en el juego: cada vértice del cuello recto se lleva a una curva)
    import random; random.seed(3)
    for k in range(7):
        fan = (k / 6 - 0.5) * 2.4; L = 3.6 + (k % 3) * 0.5
        b = top + Vector((math.sin(fan) * 0.45, -math.cos(fan) * 0.15, -0.3)); tipp = b + Vector((math.sin(fan) * L * 0.6, -L * 0.45 - random.random() * 0.4, L * 0.85))
        c1 = Vector((b.x, b.y - 0.2, tipp.z * 0.75))
        def bez(s): return b * (1 - s) ** 2 + c1 * 2 * s * (1 - s) + tipp * s * s
        o = nk.copy(); o.data = nk.data.copy(); sc.collection.objects.link(o)
        for v in o.data.vertices:
            s = v.co.z; p = bez(s); T = (bez(min(1, s + 0.01)) - bez(max(0, s - 0.01))).normalized()
            side = T.cross(Vector((0, -1, 0))).normalized(); up = side.cross(T).normalized()
            v.co = p + side * v.co.x + up * (-v.co.y)
        h = hd.copy(); h.data = hd.data; sc.collection.objects.link(h); h.location = tipp
        d = (Vector((0, -12, 1.5)) - tipp).normalized(); h.rotation_euler = (-d).to_track_quat('Y', 'Z').to_euler()
        j = jw.copy(); sc.collection.objects.link(j); j.parent = h; j.rotation_euler = (math.radians(-25 if k % 2 else -5), 0, 0)
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
    cam.location = (3.5, -11, 3.2); cam.rotation_euler = (Vector((0, 0, 2.6)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = PREV; bpy.ops.render.render(write_still=True)
    # primer plano de una cabeza
    cam.location = top + Vector((1.2, -5.2, 3.9)); h0 = [o for o in sc.objects if o.name.startswith('HY_cabeza')][-1]
    cam.location = h0.location + Vector((0.9, -1.6, 0.25)); cam.rotation_euler = (h0.location + Vector((0, -0.3, 0)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = PREV.replace('.png', '_cabeza.png'); bpy.ops.render.render(write_still=True)
