# Relieve real para los destinos: del modelo digital de elevaciones Copernicus GLO-30 (ESA / Airbus, licencia abierta de
# Copernicus; teselas de 1° con un punto cada segundo de arco, unos 30 m) a una rejilla compacta para el juego.
# Uso: python3 -I herramientas/relieve_real/dem.py CARPETA_CON_TESELAS  → escribe fuente/codigo/187_relieve_real_datos.js
# Teselas: https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N37_00_E021_00_DEM/Copernicus_DSM_COG_10_N37_00_E021_00_DEM.tif
# Cada sitio: un punto real (lat, lon) que en el juego está en (gx, gz) respecto al centro del mapa; x = este, z = sur (el norte es -z),
# a escala 1:1. e0: altura real que en el juego es 0 (el suelo no baja de 1,5 m: no hay mar tierra adentro).
import sys, os, math, base64, json
import numpy as np, tifffile
SITES = {
  # Olimpia: el centro del templo de Zeus (37,63797 N; 21,63010 E) está en el juego en (20, 10)
  'olimpia': dict(lat=37.63797, lon=21.63010, gx=20, gz=10, R=480, e0=30.0),
  # Delfos: el templo de Apolo (38,48222 N; 22,50111 E) está en el juego en (-150, -40); e0 = el punto más bajo del mapa
  'delfos': dict(lat=38.48222, lon=22.50111, gx=-150, gz=-40, R=460, e0=None),
}
STEP = 30.0
def tile(folder, lat, lon):
    t = 'N%02d_00_E%03d_00' % (math.floor(lat), math.floor(lon))
    return tifffile.imread(os.path.join(folder, t + '.tif')), math.floor(lat), math.floor(lon)
def smooth(a, r0, r1, c0, c1, sig=1.0):   # suavizado gaussiano de la zona: borra casas, carreteras y aparcamientos de hoy (el modelo es de 2011-2015)
    w = a[r0:r1, c0:c1].astype(float); k = np.exp(-np.arange(-3, 4) ** 2 / (2 * sig * sig)); k /= k.sum()
    w = np.apply_along_axis(lambda v: np.convolve(np.pad(v, 3, mode='edge'), k, 'valid'), 0, w)
    w = np.apply_along_axis(lambda v: np.convolve(np.pad(v, 3, mode='edge'), k, 'valid'), 1, w)
    b = a.astype(float).copy(); b[r0:r1, c0:c1] = w; return b
def sample(a, la0, lo0, lat, lon):   # bilineal en la tesela (fila 0 = norte)
    n = a.shape[0]; r = (la0 + 1 - lat) * n - 0.5; c = (lon - lo0) * n - 0.5
    r0 = np.clip(np.floor(r).astype(int), 0, n - 2); c0 = np.clip(np.floor(c).astype(int), 0, n - 2); fr = r - r0; fc = c - c0
    return (a[r0, c0] * (1 - fr) * (1 - fc) + a[r0 + 1, c0] * fr * (1 - fc) + a[r0, c0 + 1] * (1 - fr) * fc + a[r0 + 1, c0 + 1] * fr * fc)
def main(folder, out):
    data = {}
    for k, s in SITES.items():
        a, la0, lo0 = tile(folder, s['lat'], s['lon']); rr = int((la0 + 1 - s['lat']) * a.shape[0]); cc = int((s['lon'] - lo0) * a.shape[0]); a = smooth(a, max(0, rr - 60), rr + 60, max(0, cc - 60), cc + 60); half = s['R'] * 1.45 + STEP; n = int(math.ceil(2 * half / STEP)) + 1
        lx = -half + np.arange(n) * STEP; X, Z = np.meshgrid(lx, lx)
        mx = 111320 * math.cos(math.radians(s['lat'])); mz = 110574
        lon = s['lon'] + (X - s['gx']) / mx; lat = s['lat'] - (Z - s['gz']) / mz
        hr = sample(a, la0, lo0, lat, lon); e0 = s['e0'] if s['e0'] is not None else float(hr.min()) - 2; h = hr - e0
        q = np.round(np.clip(h, 1.5, 3000) * 10).astype('<i2')
        data[k] = dict(x0=-half, n=n, st=STEP, b=base64.b64encode(q.tobytes()).decode())
        print(k, 'n', n, 'alturas', round(float(h.min()), 1), round(float(h.max()), 1), 'centro', round(float(sample(a, la0, lo0, np.array([s['lat']]), np.array([s['lon']]))[0]), 1), 'm s.n.m.', 'e0', round(e0, 1))
    js = ('// GENERADO por herramientas/relieve_real/dem.py: relieve real (Copernicus GLO-30) de los destinos de prueba.\n'
          '// x0: esquina (este y sur, en metros desde el centro del mapa), n×n puntos cada st metros; b: alturas en decímetros (int16, base64).\n'
          'const DEMDATA=' + json.dumps(data, separators=(',', ':')) + ';\n')
    open(out, 'w').write(js)
if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'fuente/codigo/187_relieve_real_datos.js')
