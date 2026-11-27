# Relieve de montaña con erosión, para que los montes dejen de ser cúpulas lisas (273_montanas.js).
#   /opt/bvenv/bin/python -I herramientas/terreno/montes_erosion.py
# 1. Un relieve de partida que se repite sin costuras (síntesis espectral: ruido con espectro 1/f^β, como el de los relieves reales,
#    más crestas), 512 × 512 celdas.
# 2. Erosión hidráulica con gotas de lluvia: cada gota baja por la pendiente, arranca material donde corre deprisa y lo deja donde se
#    frena. Así salen barrancos ramificados, crestas afiladas y conos de derrubios al pie, como en las laderas calizas del Ática.
#    (Algoritmo clásico de partículas; aquí todas las gotas de una tanda avanzan a la vez con numpy, y el mapa es un toro: lo que sale
#    por un borde entra por el opuesto, así el resultado sigue repitiéndose sin costuras.)
# 3. Salidas:
#    modelos/montes_altura.bin  256 × 256 alturas uint16 (para la forma de los montes en el procesador: 001 terrainH)
#    modelos/montes_detalle.webp 512 × 512: R, G = normal (x, z), B = altura, A = cauces (dónde se junta el agua) → sombreado del suelo
import numpy as np, os, sys
from PIL import Image
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos')
N = 512; rng = np.random.default_rng(386)

def spectral(beta, seed):
    r = np.random.default_rng(seed); kx = np.fft.fftfreq(N)[:, None]; ky = np.fft.fftfreq(N)[None, :]; k = np.sqrt(kx * kx + ky * ky); k[0, 0] = 1
    amp = k ** (-beta / 2); amp[0, 0] = 0; amp[k > 0.25] *= np.exp(-(k[k > 0.25] - 0.25) * 30)
    f = amp * np.exp(2j * np.pi * r.random((N, N))); h = np.real(np.fft.ifft2(f)); return (h - h.mean()) / h.std()

# fBm «erosionado» (I. Quílez): cada octava pesa menos donde las anteriores ya dan mucha pendiente → crestas afiladas y valles
# lisos, como en un monte gastado por el agua. Cada octava es un ruido de banda limitada hecho con la FFT, y su derivada exacta
# también (multiplicar por i·k): así todo se repite sin costuras.
kx = np.fft.fftfreq(N)[None, :]; ky = np.fft.fftfreq(N)[:, None]; kk = np.sqrt(kx * kx + ky * ky)
def octave(f, seed):
    r = np.random.default_rng(seed); band = np.exp(-((np.log2(np.maximum(kk, 1e-9)) - np.log2(f)) ** 2) / (2 * 0.35 ** 2)); band[0, 0] = 0
    F = band * np.exp(2j * np.pi * r.random((N, N))); n = np.real(np.fft.ifft2(F)); s = n.std()
    dx = np.real(np.fft.ifft2(F * 2j * np.pi * kx)) / s; dy = np.real(np.fft.ifft2(F * 2j * np.pi * ky)) / s; return n / s, dx, dy
h = np.zeros((N, N)); dX = np.zeros((N, N)); dY = np.zeros((N, N)); amp = 1.0
for i, f in enumerate([2 / N, 4 / N, 8 / N, 16 / N, 32 / N, 64 / N, 128 / N]):
    n, dx, dy = octave(f, 10 + i)
    if 2 <= i <= 4: n = 1.0 - np.abs(n) * 1.3; dx = -np.sign(n) * dx * 1.3; dy = -np.sign(n) * dy * 1.3   # crestas
    dX += dx * amp * f * N * 0.25; dY += dy * amp * f * N * 0.25
    h += amp * n / (1.0 + 1.6 * (dX * dX + dY * dY)); amp *= 0.5
h = (h - h.min()) / (h.max() - h.min()) * 70.0
def bil(a, x, y):
    x0 = np.floor(x).astype(int); y0 = np.floor(y).astype(int); fx = x - x0; fy = y - y0; x0 %= N; y0 %= N; x1 = (x0 + 1) % N; y1 = (y0 + 1) % N
    return a[y0, x0] * (1 - fx) * (1 - fy) + a[y0, x1] * fx * (1 - fy) + a[y1, x0] * (1 - fx) * fy + a[y1, x1] * fx * fy, (x0, y0, x1, y1, fx, fy)
def grad(a, x, y):
    x0 = np.floor(x).astype(int) % N; y0 = np.floor(y).astype(int) % N; x1 = (x0 + 1) % N; y1 = (y0 + 1) % N; fx = x - np.floor(x); fy = y - np.floor(y)
    gx = (a[y0, x1] - a[y0, x0]) * (1 - fy) + (a[y1, x1] - a[y1, x0]) * fy; gy = (a[y1, x0] - a[y0, x0]) * (1 - fx) + (a[y1, x1] - a[y0, x1]) * fx; return gx, gy
def splat(a, idx, v):
    x0, y0, x1, y1, fx, fy = idx
    np.add.at(a, (y0, x0), v * (1 - fx) * (1 - fy)); np.add.at(a, (y0, x1), v * fx * (1 - fy)); np.add.at(a, (y1, x0), v * (1 - fx) * fy); np.add.at(a, (y1, x1), v * fx * fy)

BR = [(i, j, np.exp(-(i * i + j * j) / 2.0)) for i in range(-2, 3) for j in range(-2, 3) if i * i + j * j <= 5]; BW = sum(w for _, _, w in BR)
def brush(a, x, y, v):   # la erosión se reparte en un pincel de radio 2 (si no, salen hoyos de una celda)
    xi = np.round(x).astype(int); yi = np.round(y).astype(int)
    for i, j, w in BR: np.add.at(a, ((yi + j) % N, (xi + i) % N), v * (w / BW))
flow = np.zeros((N, N)); H0 = h.copy()
INER, CAP, MINS, ERO, DEP, EVA, GRAV, LIFE = 0.05, 4.0, 0.01, 0.3, 0.3, 0.015, 4.0, 40
BATCH, ROUNDS = 40000, int(sys.argv[1]) if len(sys.argv) > 1 else 6
for rd in range(ROUNDS):
    M = BATCH; x = rng.random(M) * N; y = rng.random(M) * N; dx = np.zeros(M); dy = np.zeros(M); sp = np.ones(M); wat = np.ones(M); sed = np.zeros(M); alive = np.ones(M, bool)
    for step in range(LIFE):
        gx, gy = grad(h, x, y); hold, idx = bil(h, x, y)
        dx = dx * INER - gx * (1 - INER); dy = dy * INER - gy * (1 - INER); L = np.sqrt(dx * dx + dy * dy); ok = L > 1e-9; dx[ok] /= L[ok]; dy[ok] /= L[ok]; alive &= ok
        nx = x + dx; ny = y + dy; hnew, _ = bil(h, nx, ny); dh = hnew - hold
        cap = np.maximum(-dh, MINS) * sp * wat * CAP
        dep = (sed > cap) | (dh > 0)
        amtD = np.where(dh > 0, np.minimum(dh, sed), (sed - cap) * DEP); amtD = np.where(dep & alive, amtD, 0)
        amtE = np.where(~dep & alive, np.minimum((cap - sed) * ERO, -dh), 0)
        splat(h, idx, amtD); brush(h, x, y, -amtE); sed += amtE - amtD
        splat(flow, idx, wat * alive)
        sp = np.sqrt(np.maximum(sp * sp + dh * -GRAV, 0.0)); wat *= (1 - EVA); x = nx % N; y = ny % N
    # un poco de derrumbe (erosión térmica): ninguna pendiente imposible
    for _ in range(2):
        for (a, b) in ((1, 0), (0, 1), (-1, 0), (0, -1)):
            d = h - np.roll(np.roll(h, a, 0), b, 1); ex = np.maximum(d - 1.4, 0) * 0.25; h -= ex; h += np.roll(np.roll(ex, -a, 0), -b, 1)
    h = np.clip(h, H0 - 3.5, H0 + 1.5)   # barrancos, no pozos: la erosión no baja más de unos metros
    print('ronda', rd + 1, '/', ROUNDS, flush=True)

for _ in range(2): h = (4 * h + np.roll(h, 1, 0) + np.roll(h, -1, 0) + np.roll(h, 1, 1) + np.roll(h, -1, 1)) / 8   # alisa los granos sueltos
lo, hi = np.percentile(h, 0.02), np.percentile(h, 99.98); h = np.clip((h - lo) / (hi - lo), 0, 1)
# normal (pendiente) en cada celda, para el sombreado de detalle; el tamaño de la celda se fija en el juego (la escala del mosaico)
gx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5 * 70; gy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5 * 70
n = np.stack([-gx, np.ones_like(gx), -gy], -1); n /= np.linalg.norm(n, axis=-1, keepdims=True)
fl = np.log1p(flow); fl = np.clip(fl / max(np.percentile(fl, 99.5), 1e-6), 0, 1)
fl = (fl + np.roll(fl, 1, 0) + np.roll(fl, -1, 0) + np.roll(fl, 1, 1) + np.roll(fl, -1, 1)) / 5
img = np.stack([n[..., 0] * 0.5 + 0.5, n[..., 2] * 0.5 + 0.5, h, fl], -1)
Image.fromarray((img * 255 + 0.5).clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(OUT, 'montes_detalle.webp'), quality=90, method=6, alpha_quality=90, exact=True)
h2 = h.reshape(256, 2, 256, 2).mean((1, 3)); (h2 * 65535 + 0.5).astype('<u2').tofile(os.path.join(OUT, 'montes_altura.bin'))
if os.environ.get('MONTES_VISTA'): Image.fromarray((h * 255).astype(np.uint8)).save(os.environ['MONTES_VISTA'])   # vista previa en gris
print('MONTES', os.path.getsize(os.path.join(OUT, 'montes_detalle.webp')), os.path.getsize(os.path.join(OUT, 'montes_altura.bin')))
