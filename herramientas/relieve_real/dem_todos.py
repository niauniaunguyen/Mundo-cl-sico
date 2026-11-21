# Relieve real para todos los destinos (los dos modos), a partir del modelo de elevaciones Copernicus GLO-30 (ESA / Airbus,
# licencia abierta de Copernicus; un punto cada segundo de arco, ~30 m), leído por trozos del servidor público (no hace falta
# descargar teselas enteras).
#   python3 -I herramientas/relieve_real/dem_todos.py mapas_atenas.json mapas_roma.json  → modelos/relieve_real.json
# mapas_*.json los saca el juego (herramientas/relieve_real/mapas.js): para cada destino, sus coordenadas (MED_POS), su tamaño,
# si tiene costa, sus solares y el relieve inventado de antes en una rejilla de 30 m.
# Para cada destino:
#  1. se lee el relieve real alrededor de sus coordenadas, suavizado (borra casas, carreteras y canteras de hoy);
#  2. las coordenadas del juego son aproximadas (centésimas de grado, ~1 km): se prueba a desplazar la ventana hasta ±600 m y se
#     elige el sitio en que mejor coinciden la costa real y la del juego (si hay costa) y en que los solares de los edificios quedan
#     en terreno llano, sin alejarse sin motivo del punto dado;
#  3. se guarda la rejilla (decímetros, int16, base64) con la altura que pasa a ser 0: el nivel del mar si hay costa; si no, el punto
#     más bajo del mapa menos 2 m.
# Delfos y Olimpia llevan su ajuste a mano (dem.py: monumentos situados con sus coordenadas reales).
import sys, os, json, math, base64
import numpy as np
os.environ.setdefault('GDAL_HTTP_MAX_RETRY', '4'); os.environ.setdefault('GDAL_DISABLE_READDIR_ON_OPEN', 'EMPTY_DIR')
import rasterio
from rasterio.windows import Window
MANUAL = {'atenas': {'olimpia': dict(lat=37.63797, lon=21.63010, gx=20, gz=10, e0=30.0), 'delfos': dict(lat=38.48222, lon=22.50111, gx=-150, gz=-40, e0=None)}}
EXTRA = {'roma': {'alejandria': [29.92, 31.2], 'menfis': [31.25, 29.85]}}
URL = 'https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_{0}_00_{1}_00_DEM/Copernicus_DSM_COG_10_{0}_00_{1}_00_DEM.tif'
TILES = {}
def tname(la, lo):
    return ('N%02d' % la if la >= 0 else 'S%02d' % -la), ('E%03d' % lo if lo >= 0 else 'W%03d' % -lo)
def window(la0, la1, lo0, lo1):   # trozo suavizado de las teselas que cubren el recuadro: (array, lat norte, lon oeste, dlat, dlon)
    out = []
    for la in range(math.floor(la0), math.floor(la1) + 1):
        for lo in range(math.floor(lo0), math.floor(lo1) + 1):
            key = (la, lo)
            if key not in TILES:
                try: TILES[key] = rasterio.open('/vsicurl/' + URL.format(*tname(la, lo)))
                except Exception: TILES[key] = None
            d = TILES[key]
            if d is None: continue
            t = d.transform; c0 = int((max(lo0, lo) - t.c) / t.a) - 4; c1 = int((min(lo1, lo + 1) - t.c) / t.a) + 4
            r0 = int((min(la1, la + 1) - t.f) / t.e) - 4; r1 = int((max(la0, la) - t.f) / t.e) + 4
            c0, r0 = max(0, c0), max(0, r0); c1, r1 = min(d.width, c1), min(d.height, r1)
            a = d.read(1, window=Window(c0, r0, c1 - c0, r1 - r0)).astype(float)
            out.append((a, t.f + r0 * t.e, t.c + c0 * t.a, t.e, t.a))
    return out
def smooth(a, sig=1.6):   # 1,6 puntos (~50 m): borra casas, carreteras, bancales y el borde de los bosques (el modelo mide la superficie, árboles incluidos)
    k = np.exp(-np.arange(-5, 6) ** 2 / (2 * sig * sig)); k /= k.sum(); p = np.pad(a, 5, mode='edge')
    p = np.apply_along_axis(lambda v: np.convolve(v, k, 'valid'), 0, p); return np.apply_along_axis(lambda v: np.convolve(v, k, 'valid'), 1, p)
def sample(parts, lat, lon):
    h = np.zeros(lat.shape)
    for a, la_top, lo_left, dla, dlo in parts:
        r = (lat - la_top) / dla - 0.5; c = (lon - lo_left) / dlo - 0.5
        m = (r >= -0.5) & (c >= -0.5) & (r <= a.shape[0] - 0.5) & (c <= a.shape[1] - 0.5)   # hasta el borde de la tesela: sin franja vacía en la unión de dos
        if not m.any(): continue
        rr = np.clip(r[m], 0, a.shape[0] - 1.0001); cc = np.clip(c[m], 0, a.shape[1] - 1.0001)
        r0 = np.floor(rr).astype(int); c0 = np.floor(cc).astype(int); fr = rr - r0; fc = cc - c0
        h[m] = a[r0, c0] * (1 - fr) * (1 - fc) + a[r0 + 1, c0] * fr * (1 - fc) + a[r0, c0 + 1] * (1 - fr) * fc + a[r0 + 1, c0 + 1] * fr * fc
    return h
def grid(parts, lat0, lon0, xs, zs):
    X, Z = np.meshgrid(xs, zs); mx = 111320 * math.cos(math.radians(lat0)); return sample(parts, lat0 - Z / 110574, lon0 + X / mx)
def site(M, mode):
    n, st, half = M['n'], M['st'], M['half']; xs = -half + np.arange(n) * st
    man = MANUAL.get(mode, {}).get(M['id'])
    if man:
        lat0 = man['lat'] + man['gz'] / 110574; lon0 = man['lon'] - man['gx'] / (111320 * math.cos(math.radians(man['lat'])))
    else:
        ll = M['ll'] or EXTRA.get(mode, {}).get(M['id']); lon0, lat0 = ll
    S = 600 if not man else 0; pad_deg = (half + S + 200) / 110574
    parts = window(lat0 - pad_deg, lat0 + pad_deg, lon0 - pad_deg * 1.4, lon0 + pad_deg * 1.4)
    if not parts: return None, 'sin datos'
    parts = [(smooth(q[0]),) + tuple(q[1:]) for q in parts]
    G = np.array(M['H']).reshape(n, n); X, Z = np.meshgrid(xs, xs)
    sqh = M['R'] * (1.25 if M['land'] else 1.4); inside = (np.abs(X) < sqh - 30) & (np.abs(Z) < sqh - 30)
    coastal = bool(M['coast']) or not M['land']; gsea = G < 0.6
    best = (None, -1e9, 0, 0)
    offs = [(0, 0)] if man else [(dx, dz) for dx in range(-S, S + 1, 60) for dz in range(-S, S + 1, 60)]
    big = grid(parts, lat0, lon0, -half - S + np.arange(n + 2 * S // st) * st, -half - S + np.arange(n + 2 * S // st) * st) if not man else None
    for dx, dz in offs:
        if man: D = grid(parts, lat0, lon0, xs, xs)
        else: i0 = (dx + S) // st; j0 = (dz + S) // st; D = big[j0:j0 + n, i0:i0 + n]
        dsea = D <= 0.5
        sc = -0.15 * math.hypot(dx, dz) / 600
        if coastal: sc += 3.0 * float((gsea == dsea)[inside].mean())
        gz, gx = np.gradient(D, st); sl = np.hypot(gx, gz)
        for px, pz, r, h in M['pads']:
            i = int(round((px + half) / st)); j = int(round((pz + half) / st))
            if 0 <= i < n and 0 <= j < n: sc -= 0.6 * min(1.0, sl[j, i] / 0.35) / max(1, len(M['pads'])) + (0.3 / max(1, len(M['pads'])) if dsea[j, i] and not gsea[j, i] else 0)
        if sc > best[1]: best = (D, sc, dx, dz)
    D, sc, dx, dz = best; dsea = D <= 0.5
    land = D[~(D <= 0.5)]
    if man and man['e0'] is not None: e0 = man['e0']
    elif coastal:   # con costa: el nivel del mar, si el mar real cae donde el del juego; si no (la ciudad antigua estaba tierra adentro), el terreno junto a la orilla del juego
        near = np.zeros_like(gsea)
        for k in range(1, 5): near |= np.roll(gsea, k, 0) | np.roll(gsea, -k, 0) | np.roll(gsea, k, 1) | np.roll(gsea, -k, 1)
        shore = near & ~gsea & inside; agree = float(dsea[gsea & inside].mean()) if (gsea & inside).any() else 0
        e0 = 0.0 if agree > 0.5 or not shore.any() else max(0.0, float(np.percentile(D[shore], 20)) - 2)
    else: e0 = float(D.min()) - 2
    q = np.round(np.clip(D - e0, -9, 3000) * 10).astype('<i2')
    info = dict(x0=-half, n=n, st=st, b=base64.b64encode(q.tobytes()).decode(), cs=1 if coastal else 0, e0=round(e0, 1), off=[dx, dz], ll=[round(lon0, 5), round(lat0, 5)])
    return info, 'desplazado %d,%d m · %s · %d..%d m · puntuación %.2f' % (dx, dz, 'costa' if coastal else 'interior', int(D.min()), int(D.max()), sc)
def main(files, out):
    res = {}
    for f in files:
        d = json.load(open(f)); mode = d['mode']; res[mode] = {}
        for M in d['maps']:
            if os.environ.get('SOLO') and M['id'] not in os.environ['SOLO'].split(','): continue
            try: info, msg = site(M, mode)
            except Exception as e: info, msg = None, 'ERROR ' + str(e)[:120]
            print(mode, M['id'], msg, flush=True)
            if info: res[mode][M['id']] = info
    json.dump(res, open(out, 'w'), separators=(',', ':'))
    print('escrito', out, os.path.getsize(out) // 1024, 'KB')
if __name__ == '__main__':
    main(sys.argv[1:], os.environ.get('SALIDA', 'modelos/relieve_real.json'))
