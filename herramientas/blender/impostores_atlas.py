# Junta los fotogramas de impostores.py en modelos/impostor_<tipo>.png: a la izquierda, la figura (8 ángulos × 7 filas: 6 momentos
# de andar y uno quieto, 64×128 px cada uno); a la derecha, en gris, la máscara de qué se tiñe (canal rojo del color de los vértices).
#   python3 herramientas/blender/impostores_atlas.py carpeta_tmp
import sys, os
from PIL import Image
T = sys.argv[1]; MOD = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos'); W, H = 64, 128
for kind in ['ciudadano', 'mujer', 'obrero', 'hoplita', 'togado', 'romana', 'legionario', 'tunicado']:
    if not os.path.exists(os.path.join(T, '%s_0_0.png' % kind)): continue
    o = Image.new('RGBA', (W * 16, H * 7), (0, 0, 0, 0))
    for r in range(7):
        for a in range(8):
            p = os.path.join(T, '%s_%d_%d.png' % (kind, r, a))
            if not os.path.exists(p): continue
            im = Image.open(p).convert('RGBA'); o.paste(im, (a * W, r * H))
            m = Image.open(os.path.join(T, '%s_%d_%d_m.png' % (kind, r, a))).convert('RGBA'); R = m.split()[0]
            o.paste(Image.merge('RGBA', (R, R, R, m.split()[3])), (W * 8 + a * W, r * H))
    out = os.path.join(MOD, 'impostor_%s.webp' % kind); o.save(out, 'WEBP', quality=88, method=6); print(kind, os.path.getsize(out) // 1024, 'KB')
