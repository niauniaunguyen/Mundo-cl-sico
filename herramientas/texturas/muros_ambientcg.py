# Texturas de muros a partir de escaneos reales de ambientCG (CC0, https://ambientcg.com) → modelos/muro_*.jpg
#   python3 -I herramientas/texturas/muros_ambientcg.py <carpeta con los mapas de color *.jpg (p. ej. Marble012.jpg)>
# El juego (036_acabado.js, PTEX) dibuja sus texturas de detalle a mano: sillares con juntas, hiladas de ladrillo, tablas...
# Aquí los escaneos se convierten en grises de media 1 (el color lo sigue poniendo cada material). En el juego (244_muros_escaneados.js):
#   · ladrillo ← Bricks097 (ladrillo viejo y desigual): sustituye al dibujado (tiene sus propias hiladas y llagas).
#   · mármol ← Marble012 (mármol blanco con vetas grises), piedra ← Travertine009 (travertino claro), estuco ← Plaster003,
#     madera ← Wood049: solo su grano fino se multiplica sobre el dibujo de siempre, que conserva sus juntas y sus tablas.
# Para el grano fino se quita la variación grande (se divide por una versión muy desenfocada): así no salen manchas que se repiten.
import sys, os, numpy as np
from PIL import Image, ImageFilter
SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos')
# nombre del juego: (escaneo, ¿solo grano fino?, contraste)
T = {'marmol': ('Marble012', True, 0.8), 'piedra': ('Travertine009', True, 0.7), 'estuco': ('Plaster003', True, 0.9),
     'ladrillo': ('Bricks097', False, 0.7), 'madera': ('Wood049', True, 0.8)}
N = 512
for k, (name, fine, K) in T.items():
    im = Image.open(os.path.join(SRC, name + '.jpg')).convert('L')
    if im.size[0] != im.size[1]:                      # el ladrillo es 2:1: se repite para hacerlo cuadrado (sigue empalmando)
        w, h = im.size; sq = Image.new('L', (w, w))
        for y in range(0, w, h): sq.paste(im, (0, y))
        im = sq
    im = im.resize((N, N), Image.LANCZOS)
    if k == 'madera': im = im.transpose(Image.ROTATE_90)   # el grano a lo largo de las tablas del juego (en vertical)
    x = np.asarray(im, dtype=np.float32) / 255 + 0.02
    if fine:
        # desenfoque «envolvente» (la textura se repite): se pega en mosaico 3×3, se desenfoca y se recorta el centro
        big = Image.fromarray((np.tile(x, (3, 3)) * 200).astype(np.uint8)).filter(ImageFilter.GaussianBlur(N / 10))
        lo = np.asarray(big, dtype=np.float32)[N:2 * N, N:2 * N] / 200 + 0.02
        x = x / lo
    x = x / x.mean()
    y = np.clip((x - 1) * K + 1, 0.4, 1.6) / 1.6      # media 1 → guardada como 1/1,6 (0,625), para dejar sitio a lo claro
    out = Image.fromarray((y * 255 + 0.5).astype(np.uint8))
    f = os.path.join(OUT, 'muro_%s.jpg' % k); out.save(f, quality=84, optimize=True)
    print('MURO', k, name, out.size, os.path.getsize(f), 'min/max', round(float(y.min()) * 1.6, 2), round(float(y.max()) * 1.6, 2))
