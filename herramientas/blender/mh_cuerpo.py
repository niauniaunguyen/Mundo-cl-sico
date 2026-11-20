# El cuerpo de MakeHuman (malla base hm08, CC0) para personajes.py, en lugar del cuerpo hecho con piezas (body_mesh).
# - La forma: las mismas deformaciones que la cabeza (origen, sexo, edad; MHKIND), sobre la malla completa (makehuman/cuerpo_targets.npz).
# - La posición y la escala: exactamente las de la cabeza (mh_head), para que el cuello case sin costura; luego todo se baja o sube
#   hasta que los pies tocan el suelo (moviendo HC, el centro de la cabeza, que usa el resto del script).
# - Las articulaciones del esqueleto del juego (J) se ponen donde caen las de MakeHuman (makehuman/esqueleto_default.mhskel).
# - Los pesos: los de MakeHuman (makehuman/pesos_default.mhw, 163 huesos) sumados en nuestros 25 huesos (MAPW).
# Así se deforma bien al doblar rodillas, codos y hombros, y la ropa, las caras y el juego siguen usando los mismos nombres.
import os, json, numpy as np, bpy, bmesh
from mathutils import Vector
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'makehuman')
_C = {}
def _load():
    if _C: return _C
    V = []; F = []; cur = None
    for l in open(os.path.join(D, 'base.obj')):
        if l.startswith('v '): V.append([float(x) for x in l.split()[1:4]])
        elif l.startswith('g '): cur = l.split()[1]
        elif l.startswith('f '): F.append((cur, [int(x.split('/')[0]) - 1 for x in l.split()[1:]]))
    V = np.array(V)
    # los vértices de la cabeza tal como los eligió makehuman_extraer.py (mismo criterio y mismo orden)
    top = V[:, 1].max(); GR = {'body': 0, 'helper-l-eye': 1, 'helper-r-eye': 2}
    fs = [f for g, f in F if g in GR and min(V[k, 1] for k in f) > top - 3.6]
    used = np.array(sorted(set(k for f in fs for k in f)))
    _C.update(V=V, F=F, used=used, T=np.load(os.path.join(D, 'cuerpo_targets.npz')),
              S=json.load(open(os.path.join(D, 'esqueleto_default.mhskel'))), W=json.load(open(os.path.join(D, 'pesos_default.mhw')))['weights'])
    return _C
def points(MH, MHKIND, kind, female):
    # igual que mh_points de personajes.py, pero sobre la malla completa
    C = _load(); T = C['T']; old, extra = MHKIND.get(kind, (0.2, {})); sx = 'female' if female else 'male'
    P = C['V'].copy()
    for eth, we in (('caucasian', 0.74), ('african', 0.13), ('asian', 0.13)):
        for age, wa in (('young', 1 - old), ('old', old)):
            if we * wa > 0:
                k = '%s_%s_%s' % (eth, sx, age); P[T[k + '.index']] += T[k + '.vector'].astype(float) * 1e-3 * we * wa
    U = C['used']
    for k, w in extra.items(): P[U] += MH[k].astype(float) * 1e-3 * w
    if not female:
        for k in ('r_r_eye_scale_incr', 'r_l_eye_scale_incr'): P[U] += MH[k].astype(float) * 1e-3 * 0.2
    return P
def xform(MH, P, HC, female):
    # la transformación de mh_head (personajes.py): ojos, banda de las cejas, escala por la longitud de la cabeza
    U = _load()['used']; Ph = P[U]; Q = MH['quads']; G = MH['group']
    eyes = [np.unique(Q[G == g]) for g in (1, 2)]; ec = [Ph[e].mean(0) for e in eyes]; em = (ec[0] + ec[1]) / 2
    bv = np.unique(Q[G == 0]); u = 1.0 / 0.122 * (Ph[:, 1].max() - em[1]); band = bv[np.abs(Ph[bv, 1] - em[1] - 0.025 * u) < 0.008 * u]
    s = (0.188 if female else 0.196) / np.ptp(Ph[band, 2]); tgt = np.array((0, HC.y - 0.066, HC.z + 0.008))
    return lambda X: np.stack([X[..., 0] - em[0], -(X[..., 2] - em[2]), X[..., 1] - em[1]], -1) * s + tgt
# nuestros huesos ← huesos de MakeHuman (los pesos se suman)
def _ours(n):
    side = n[-2:] if n.endswith(('.L', '.R')) else ''; b = n[:-2] if side else n
    if b in ('root', 'spine05', 'pelvis'): return 'hips'
    if b in ('spine04', 'spine03'): return 'spine'
    if b in ('spine02', 'spine01', 'breast'): return 'chest'
    if b.startswith('neck'): return 'neck'
    if b in ('clavicle', 'shoulder01'): return 'clavicle' + side
    if b.startswith('upperarm'): return 'upperarm' + side
    if b.startswith('lowerarm'): return 'forearm' + side
    if b in ('wrist',) or b.startswith(('finger', 'metacarpal')): return 'hand' + side
    if b.startswith('upperleg'): return 'thigh' + side
    if b.startswith('lowerleg'): return 'shin' + side
    if b == 'foot' or b.startswith('toe'): return 'foot' + side
    return 'head'   # la cabeza y la cara (ojos, mandíbula, lengua…)
def setup(MH, MHKIND, kind, female, J, HC, cut):
    """Calcula la forma y la colocación, mueve HC para que los pies toquen el suelo y pone J en las articulaciones de MakeHuman.
    Devuelve la función que construye la malla del cuerpo (después de make_armature)."""
    C = _load(); P = points(MH, MHKIND, kind, female); X = xform(MH, P, HC, female); Wp = X(P)
    body_v = sorted({k for g, f in C['F'] if g == 'body' for k in f}); dz = -Wp[body_v, 2].min()
    HC.z += dz; X = xform(MH, P, HC, female); Wp = X(P)
    jp = {k: Vector(Wp[v].mean(0)) for k, v in C['S']['joints'].items()}
    def jh(b): return jp[b + '____head']
    def jt(b): return jp[b + '____tail']
    J['hips'] = tuple(jh('spine05')); J['spine'] = tuple(jh('spine03')); J['chest'] = tuple(jh('spine01')); J['neck'] = tuple(jh('neck01')); J['head'] = tuple(jh('head'))
    J['top'] = tuple(Vector((0, jh('head').y, Wp[body_v, 2].max())))
    for k in ('L', 'R'):
        J['clav.' + k] = tuple(jh('clavicle.' + k)); J['sho.' + k] = tuple(jh('upperarm01.' + k)); J['elb.' + k] = tuple(jh('lowerarm01.' + k)); J['wri.' + k] = tuple(jh('wrist.' + k))
        J['fin.' + k] = tuple(jt('finger3-3.' + k)) if ('finger3-3.' + k + '____tail') in jp else tuple(jt('wrist.' + k))
        J['hip.' + k] = tuple(jh('upperleg01.' + k)); J['kne.' + k] = tuple(jh('lowerleg01.' + k)); J['ank.' + k] = tuple(jh('foot.' + k))
        J['toe.' + k] = tuple(jt('toe3-1.' + k)) if ('toe3-1.' + k + '____tail') in jp else tuple(jt('foot.' + k))
    def build_body(name, scn):
        # las caras del cuerpo por debajo del corte de la cabeza (con 2 cm de solape, que tapa la cabeza)
        faces = [f for g, f in C['F'] if g == 'body' and min(Wp[k, 2] for k in f) < cut + 0.02]
        used = sorted({k for f in faces for k in f}); m = {k: i for i, k in enumerate(used)}
        me = bpy.data.meshes.new(name); me.from_pydata([tuple(Wp[k]) for k in used], [], [[m[k] for k in f] for f in faces]); me.update()
        ob = bpy.data.objects.new(name, me); scn.collection.objects.link(ob)
        for p in me.polygons: p.use_smooth = True
        acc = {}
        for bn, lst in C['W'].items():
            o = _ours(bn)
            for vi, w in lst:
                if vi in m: acc.setdefault(o, {}); acc[o][m[vi]] = acc[o].get(m[vi], 0) + w
        for o, d in acc.items():
            vg = ob.vertex_groups.new(name=o)
            for i, w in d.items(): vg.add([i], min(1.0, w), 'REPLACE')
        return ob
    return build_body
