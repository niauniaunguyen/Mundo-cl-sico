# Herramientas para esculpir criaturas con código (las usa herramientas/blender/criaturas.py)
#  · Formas con funciones de distancia (SDF): elipsoides y cápsulas que se funden con una unión suave, como músculos bajo la piel;
#    la superficie se saca con marching cubes (scikit-image) y se aligera en Blender.
#  · Textura de color pintada sobre el propio modelo: cada píxel del mapa UV se convierte en su punto 3D y se le da color con una
#    función (pelaje, escamas, plumas...). Todo es nuestro y se puede publicar con el juego.
# Coordenadas de trabajo «del juego»: x a la derecha, y arriba, z hacia delante (hacia donde mira la criatura); en metros.
import numpy as np, math

# ------------------------------------------------------------------ ruido
def _hash3(ix, iy, iz, seed=0):
    h = (ix * 73856093) ^ (iy * 19349663) ^ (iz * 83492791) ^ (seed * 2654435761)
    h = (h ^ (h >> 13)) * 1274126177
    return ((h ^ (h >> 16)) & 0xFFFFFF) / float(0xFFFFFF)

def vnoise(p, seed=0):
    p = np.asarray(p, dtype=np.float64); f = np.floor(p); t = p - f; t = t * t * (3 - 2 * t); i = f.astype(np.int64)
    out = 0
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                w = (t[..., 0] if dx else 1 - t[..., 0]) * (t[..., 1] if dy else 1 - t[..., 1]) * (t[..., 2] if dz else 1 - t[..., 2])
                out = out + w * _hash3(i[..., 0] + dx, i[..., 1] + dy, i[..., 2] + dz, seed)
    return out

def fbm(p, oct=4, seed=0):
    a, s, tot = 0.5, 1.0, 0.0
    for k in range(oct):
        tot = tot + a * vnoise(np.asarray(p) * s, seed + k * 17); s *= 2.03; a *= 0.5
    return tot

# ------------------------------------------------------------------ formas
def sd_ellipsoid(P, c, r):
    q = (P - np.asarray(c)) / np.asarray(r); k0 = np.linalg.norm(q, axis=-1); k1 = np.linalg.norm(q / np.asarray(r), axis=-1)
    return k0 * (k0 - 1.0) / np.maximum(k1, 1e-6)

def sd_capsule(P, a, b, ra, rb):
    a = np.asarray(a, float); b = np.asarray(b, float); pa = P - a; ba = b - a
    h = np.clip((pa @ ba) / (ba @ ba), 0, 1)
    return np.linalg.norm(pa - h[..., None] * ba, axis=-1) - (ra + (rb - ra) * h)

def sd_chain(P, pts, rads):
    d = None
    for i in range(len(pts) - 1):
        e = sd_capsule(P, pts[i], pts[i + 1], rads[i], rads[i + 1]); d = e if d is None else smin(d, e, 0.02)
    return d

def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h - k * h * (1 - h)

def smax(a, b, k):
    return -smin(-a, -b, k)

# ------------------------------------------------------------------ de la forma a la malla
def mesh_from_sdf(fn, lo, hi, step):
    from skimage.measure import marching_cubes
    lo = np.asarray(lo, float); hi = np.asarray(hi, float); n = np.ceil((hi - lo) / step).astype(int) + 1
    xs = [lo[i] + np.arange(n[i]) * step for i in range(3)]
    G = np.stack(np.meshgrid(*xs, indexing='ij'), -1)
    D = np.empty(G.shape[:3], np.float32)
    for i in range(0, n[0], 16):                           # por rodajas, para no llenar la memoria
        D[i:i + 16] = fn(G[i:i + 16].reshape(-1, 3)).reshape(G[i:i + 16].shape[:3])
    v, f, nr, _ = marching_cubes(D, 0.0, spacing=(step, step, step))
    return v + lo, f[:, ::-1].copy()

# ------------------------------------------------------------------ pintar la textura sobre el modelo
def bake(uv, pos, nor, tri, colf, S=1024, pad=10):
    """uv (L,2), pos/nor (L,3) por esquina; tri (T,3) índices de esquina. colf(pos(N,3), nor(N,3)) -> (N,3) en 0..1"""
    img = np.zeros((S, S, 3), np.float32); has = np.zeros((S, S), bool)
    U = uv * (S - 1)
    PP = []; NN = []; IJ = []
    for t in tri:
        a, b, c = U[t[0]], U[t[1]], U[t[2]]
        x0, x1 = int(max(0, np.floor(min(a[0], b[0], c[0])))), int(min(S - 1, np.ceil(max(a[0], b[0], c[0]))))
        y0, y1 = int(max(0, np.floor(min(a[1], b[1], c[1])))), int(min(S - 1, np.ceil(max(a[1], b[1], c[1]))))
        if x1 < x0 or y1 < y0: continue
        xs, ys = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
        den = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
        if abs(den) < 1e-12: continue
        l1 = ((b[1] - c[1]) * (xs - c[0]) + (c[0] - b[0]) * (ys - c[1])) / den
        l2 = ((c[1] - a[1]) * (xs - c[0]) + (a[0] - c[0]) * (ys - c[1])) / den
        l3 = 1 - l1 - l2; m = (l1 >= -0.02) & (l2 >= -0.02) & (l3 >= -0.02)
        if not m.any(): continue
        L = np.stack([l1[m], l2[m], l3[m]], -1)
        PP.append(L @ pos[list(t)]); NN.append(L @ nor[list(t)]); IJ.append(np.stack([(ys[m] - 0.5).astype(int), (xs[m] - 0.5).astype(int)], -1))
    P = np.concatenate(PP); Nn = np.concatenate(NN); IJ = np.concatenate(IJ)
    Nn /= np.maximum(np.linalg.norm(Nn, axis=-1, keepdims=True), 1e-6)
    C = colf(P, Nn)
    img[IJ[:, 0], IJ[:, 1]] = C; has[IJ[:, 0], IJ[:, 1]] = True
    for _ in range(pad):                                     # se estira el borde de cada isla para que no se vean costuras
        nb = np.zeros_like(img); cnt = np.zeros((S, S), np.float32)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            sh = np.roll(np.roll(has, dy, 0), dx, 1); si = np.roll(np.roll(img, dy, 0), dx, 1)
            nb += si * sh[..., None]; cnt += sh
        new = (~has) & (cnt > 0); img[new] = nb[new] / cnt[new][:, None]; has |= new
    img[~has] = C.mean(0)
    return np.clip(img[::-1], 0, 1)                           # la fila 0 de una imagen es arriba; v=0 es abajo
