# Copas de detalle de los árboles cercanos (fase B de los modelos 3D: plantas).
#   /opt/bvenv/bin/python herramientas/blender/plantas.py   → modelos/plantas.glb
# Cuando el jugador se acerca a un árbol, el juego cambia su copa sencilla por una de detalle (TLOD, 182_relieves_y_detalle.js).
# Antes esa copa se hacía en el juego con esferas sobre la copa sencilla; ahora sale de aquí: racimos de hojas deformados con ruido,
# repartidos según la forma de cada especie, con el mismo presupuesto (unos 3.000 triángulos por copa).
#   H_olive    olivo: copa baja, irregular y abierta, en racimos sueltos (el olivo se poda en vaso, con el centro claro)
#   H_pine     pino piñonero: una sombrilla plana y ancha, más densa en el borde
#   H_plane    plátano de Oriente: copa alta y redonda, de racimos grandes
#   H_cypress  ciprés: una llama estrecha de mechones verticales
# Cada copa queda dentro de la caja [-0,5, 0,5] × [0, 1] × [-0,5, 0,5]; el juego la estira a la caja de la copa sencilla
# (así encaja con su tronco y con la escala y el giro de cada árbol). El sombreado interior (más oscuro dentro de la copa)
# lo pone el juego (vegPrep), igual que en las demás plantas.
import bpy, bmesh, math, random, os, sys
from mathutils import Vector, noise
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos', 'plantas.glb')

def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def tuft(bm, c, r, sx, sy, sz, seed, sub=2, rough=0.32):
    """Un racimo de hojas: icosfera deformada con ruido (bultos de hojas), aplastada según la especie."""
    m = bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0)
    off = Vector((seed * 3.17, seed * 1.31, seed * 2.03))
    for v in m['verts']:
        d = v.co.normalized()
        n = noise.noise(d * 1.9 + off)            # bultos grandes
        n2 = noise.noise(d * 4.3 + off * 1.7)      # hojas sueltas
        k = 1.0 + rough * n + rough * 0.45 * n2
        v.co = Vector((d.x * k * r * sx + c.x, d.y * k * r * sy + c.y, d.z * k * r * sz + c.z))

def in_hull(p, kind):
    """Densidad de racimos en el punto p según la forma de la copa (0..1)."""
    x, y, z = p
    if kind == 'olive':    # copa ancha y baja, con el centro más claro (poda en vaso)
        r = math.hypot(x, z); e = (r / 1.0) ** 2 + ((y - 0.5) / 0.48) ** 2
        return 1.0 if e < 1 and not (r < 0.32 and y > 0.55) else 0.0
    if kind == 'pine':     # sombrilla: disco plano algo abombado arriba
        r = math.hypot(x, z); top = 0.62 + 0.38 * (1 - (r / 1.0) ** 2)
        return 1.0 if r < 1.0 and 0.18 < y < top else 0.0
    if kind == 'plane':    # bola alta, algo achatada abajo
        e = math.hypot(x, z) ** 2 / 0.95 ** 2 + ((y - 0.52) / 0.5) ** 2
        return 1.0 if e < 1 else 0.0
    if kind == 'cypress':  # llama: radio que se afina hacia arriba
        rad = 0.95 * (math.sin(min(1, y * 1.15) * math.pi * 0.5 + 1e-4) ** 0.6) * (1 - y) ** 0.75 + 0.02
        return 1.0 if math.hypot(x, z) < rad and 0.02 < y < 0.99 else 0.0
    return 0.0

SPEC = {   # nº de racimos, radio, aplastamiento (x, y, z), rugosidad, sesgo hacia la superficie
    'olive':   dict(n=46, r=0.2, s=(1.0, 0.72, 1.0), rough=0.38, shell=0.7),
    'pine':    dict(n=44, r=0.2, s=(1.15, 0.45, 1.15), rough=0.3, shell=0.8),
    'plane':   dict(n=42, r=0.24, s=(1.0, 0.82, 1.0), rough=0.34, shell=0.75),
    'cypress': dict(n=48, r=0.17, s=(0.62, 1.25, 0.62), rough=0.28, shell=0.85),
}

def crown(kind, seed):
    S = SPEC[kind]; R = random.Random(seed)
    bm = bmesh.new(); pts = []
    tries = 0
    while len(pts) < S['n'] and tries < 20000:
        tries += 1
        p = Vector((R.uniform(-1, 1), R.uniform(0, 1), R.uniform(-1, 1)))
        if not in_hull(p, kind): continue
        # más racimos cerca de la superficie: es lo que se ve; dentro basta con unos pocos que tapen los huecos
        q = p.copy(); out = 0
        for k in range(1, 6):
            q2 = p + Vector((p.x, 0, p.z)).normalized() * 0.06 * k if Vector((p.x, 0, p.z)).length > 1e-3 else p + Vector((0, 0.06 * k, 0))
            if not in_hull(q2, kind): out = k; break
        if out == 0 and R.random() < S['shell']: continue
        if any((p - o).length < S['r'] * 0.9 for o in pts): continue
        pts.append(p)
    for i, p in enumerate(pts):
        sx, sy, sz = S['s']; f = R.uniform(0.8, 1.2)
        tuft(bm, p, S['r'] * f, sx, sy, sz, seed * 101 + i, sub=2, rough=S['rough'])
    me = bpy.data.meshes.new('H_' + kind); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new('H_' + kind, me); bpy.context.scene.collection.objects.link(ob)
    # a la caja [-0,5, 0,5] × [0, 1] × [-0,5, 0,5]
    xs = [v.co.x for v in me.vertices]; ys = [v.co.y for v in me.vertices]; zs = [v.co.z for v in me.vertices]
    cx, cz = (min(xs) + max(xs)) / 2, (min(zs) + max(zs)) / 2; y0 = min(ys)
    sx, sy, sz = max(xs) - min(xs), max(ys) - y0, max(zs) - min(zs)
    for v in me.vertices: v.co = Vector(((v.co.x - cx) / sx, (v.co.y - y0) / sy, (v.co.z - cz) / sz))
    for p in me.polygons: p.use_smooth = True
    mat = bpy.data.materials.get('foliage') or bpy.data.materials.new('foliage'); me.materials.append(mat)
    print(kind, len(me.polygons), 'triángulos' if all(len(p.vertices) == 3 for p in me.polygons) else 'caras', len(pts), 'racimos')
    return ob

def main():
    clear()
    for i, k in enumerate(['olive', 'pine', 'plane', 'cypress']): crown(k, 11 + i * 7)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(OUT), export_format='GLB', export_normals=True, export_texcoords=False,
                              export_materials='PLACEHOLDER', export_apply=True, export_yup=False)
    print('escrito', os.path.abspath(OUT), os.path.getsize(OUT) // 1024, 'KB')

main()
# versión del juego: normales en 8 bits (compactar_glb.py); construir.py la incrusta comprimida con gzip (#glbpl, se trae en segundo plano)
import subprocess
subprocess.run([sys.executable if 'python' in os.path.basename(sys.executable) else 'python3', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'compactar_glb.py'), os.path.abspath(OUT), os.path.abspath(OUT.replace('.glb', '_juego.glb'))], check=True)
