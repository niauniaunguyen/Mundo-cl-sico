# Texturas de follaje dibujadas (fondo negro = transparente en el juego): ramillete de agujas de pino piñonero y ramita de ciprés.
#   python3 -I herramientas/texturas/ramilletes.py <carpeta de salida>
import sys, os, math, random
from PIL import Image, ImageDraw, ImageFilter
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
def pino():   # Pinus pinea: agujas por pares, largas (10-20 cm), rectas y rígidas, en penachos al final de las ramillas
    W = 512; im = Image.new('RGB', (W, W), (0, 0, 0)); d = ImageDraw.Draw(im); R = random.Random(3)
    for c in range(5):
        cx, cy = W / 2 + R.uniform(-110, 110), W / 2 + R.uniform(-110, 110)
        d.line([(cx, cy), (W / 2, W / 2)], fill=(92, 70, 48), width=6)
        for k in range(150):
            a = R.uniform(0, 2 * math.pi); L = R.uniform(70, 150); g = R.uniform(0.75, 1.15)
            col = (int(58 * g), int(92 * g), int(44 * g))
            d.line([(cx, cy), (cx + math.cos(a) * L, cy + math.sin(a) * L)], fill=col, width=R.choice([2, 2, 3]))
    return im
def cipres():   # Cupressus sempervirens: ramitas con hojas en escama, muy densas, verde oscuro
    W = 512; im = Image.new('RGB', (W, W), (0, 0, 0)); d = ImageDraw.Draw(im); R = random.Random(5)
    def rama(x, y, a, L, w, n):
        if n == 0 or L < 8: return
        x2, y2 = x + math.cos(a) * L, y + math.sin(a) * L; g = R.uniform(0.8, 1.15)
        d.line([(x, y), (x2, y2)], fill=(int(40 * g), int(66 * g), int(36 * g)), width=max(2, int(w)))
        for t in (0.35, 0.6, 0.85):
            px, py = x + (x2 - x) * t, y + (y2 - y) * t
            for s in (-1, 1): rama(px, py, a + s * R.uniform(0.5, 0.8), L * 0.45, w * 0.7, n - 1)
    for k in range(7): rama(W / 2 + R.uniform(-40, 40), W - 10, -math.pi / 2 + R.uniform(-0.5, 0.5), R.uniform(260, 380), 9, 4)
    return im.filter(ImageFilter.MaxFilter(3))
pino().save(os.path.join(OUT, 'pino_agujas.jpg'), quality=88); cipres().save(os.path.join(OUT, 'cipres_ramas.jpg'), quality=88)
print('ok')
