# Árboles de Poly Haven (CC0, https://polyhaven.com) aligerados para el juego → modelos/arboles_ph.glb
#   /opt/bvenv/bin/python -I herramientas/blender/arboles_polyhaven.py -- <carpeta con las descargas gltf 1k> [salida.glb]
# Los modelos originales tienen cada hoja modelada (≈30.000 hojas, más de un millón de triángulos por árbol): imposible en un navegador.
# Aquí: tronco y ramas se simplifican (decimado) y cada hoja se cambia por una tarjeta de dos triángulos con la misma zona de la textura
# (el fondo negro de la textura de hojas se recorta en el juego); se queda una de cada K hojas, algo agrandadas, para mantener la copa llena.
# Cada árbol se normaliza: base en el suelo, centrado y 1 m de alto (el juego lo estira a las medidas del árbol que sustituye).
#   P_olivo  ← island_tree_02 (tronco retorcido, hoja lanceolada: hace de olivo, encina y laurel)
#   P_frondo ← island_tree_01 (copa ancha: hace de plátano, roble, castaño y haya)
#   P_pino y P_cipres: Poly Haven no tiene pino piñonero ni ciprés. Se hacen aquí: tronco con la corteza escaneada de «Pine Sapling Small»
#   (Poly Haven, CC0) y follaje de tarjetas con ramilletes dibujados (herramientas/texturas/ramilletes.py, tercer argumento: su carpeta).
#   Pino piñonero (Pinus pinea): tronco limpio que se abre en ramas gruesas y copa en sombrilla, ancha y plana.
#   Ciprés (Cupressus sempervirens, variedad piramidal): copa estrecha en forma de llama, muy densa y oscura.
import bpy, bmesh, sys, os, math, numpy as np
from mathutils import Vector
argv = sys.argv[sys.argv.index('--') + 1:]
SRC = argv[0]
RAM = argv[2] if len(argv) > 2 else None
OUT = argv[1] if len(argv) > 1 and argv[1] != '-' else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos', 'arboles_ph.glb')
TREES = [('P_olivo', 'island_tree_02', 3, 1.8, 2600, 2200), ('P_frondo', 'island_tree_01', 3, 1.9, 2800, 2400)]   # nombre, origen, 1 de cada K hojas, agrandar, tris tronco, tris ramas
bpy.ops.wm.read_factory_settings(use_empty=True)
out_objs = []
def decimate(o, target):
    n = sum(len(f.vertices) - 2 for f in o.data.polygons)
    if n <= target: return
    m = o.modifiers.new('d', 'DECIMATE'); m.ratio = target / n
    bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_apply(modifier='d')
for name, src, K, grow, ttr, tbr in TREES:
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(SRC, src, src + '_1k.gltf'))
    obj = [o for o in bpy.data.objects if o not in before and o.type == 'MESH'][0]
    for o in bpy.data.objects:
        if o not in before and o.type != 'MESH': bpy.data.objects.remove(o)
    bpy.ops.object.select_all(action='DESELECT'); obj.select_set(True); bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    # medidas: base en el suelo, centrado, 1 m de alto
    co = np.array([v.co[:] for v in obj.data.vertices]); mn, mx = co.min(0), co.max(0); H = mx[2] - mn[2]; cx, cy = (mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2
    for v in obj.data.vertices: v.co = Vector(((v.co.x - cx) / H, (v.co.y - cy) / H, (v.co.z - mn[2]) / H))
    bpy.ops.mesh.separate(type='MATERIAL')
    parts = [o for o in bpy.data.objects if o not in before and o.type == 'MESH']
    for o in parts:
        mat = o.material_slots[0].material.name
        if mat.endswith('_leaves'):
            bm = bmesh.new(); bm.from_mesh(o.data); uvl = bm.loops.layers.uv.active; bm.faces.ensure_lookup_table()
            seen = set(); quads = []; rng = np.random.default_rng(7); idx = 0
            for f in bm.faces:
                if f.index in seen: continue
                st = [f]; isl = []
                while st:
                    g = st.pop()
                    if g.index in seen: continue
                    seen.add(g.index); isl.append(g)
                    for e in g.edges:
                        for h in e.link_faces:
                            if h.index not in seen: st.append(h)
                idx += 1
                if idx % K: continue
                P = []; U = []
                for g in isl:
                    for l in g.loops: P.append(l.vert.co[:]); U.append(l[uvl].uv[:])
                P = np.array(P); U = np.array(U); c = P.mean(0); Q = P - c
                try: _, _, vt = np.linalg.svd(Q, full_matrices=False)
                except Exception: continue
                a1, a2 = vt[0], vt[1]; s1 = Q @ a1; s2 = Q @ a2
                A = np.c_[s1, s2, np.ones(len(s1))]; M, *_ = np.linalg.lstsq(A, U, rcond=None)   # de la hoja a la textura
                corners = [(s1.min(), s2.min()), (s1.max(), s2.min()), (s1.max(), s2.max()), (s1.min(), s2.max())]
                quads.append(([tuple(c + (x * a1 + y * a2) * grow) for x, y in corners], [tuple(np.array([x, y, 1]) @ M) for x, y in corners]))
            bm.free()
            me = bpy.data.meshes.new(name + '_hojas'); verts = []; faces = []; uvs = []
            for vs, us in quads:
                b = len(verts); verts += vs; faces.append((b, b + 1, b + 2, b + 3)); uvs += us
            me.from_pydata(verts, [], faces); me.update(); uv = me.uv_layers.new(name='UVMap')
            for i, l in enumerate(me.loops): uv.data[i].uv = uvs[l.vertex_index]
            me.materials.append(o.material_slots[0].material)
            no = bpy.data.objects.new(name + '_hojas', me); bpy.context.scene.collection.objects.link(no); bpy.data.objects.remove(o); out_objs.append(no)
            print('HOJAS', name, len(quads))
        else:
            if not mat.endswith('_branches'):   # fuera la losa de suelo escaneado bajo el tronco (se veía como una mancha clara)
                bm = bmesh.new(); bm.from_mesh(o.data); bm.verts.ensure_lookup_table()
                bmesh.ops.delete(bm, geom=[f for f in bm.faces if max(v.co.z for v in f.verts) < 0.025], context='FACES'); bm.to_mesh(o.data); bm.free()
            decimate(o, tbr if mat.endswith('_branches') else ttr)
            o.name = name + ('_ramas' if mat.endswith('_branches') else '_tronco'); out_objs.append(o)
            print('PIEZA', o.name, sum(len(f.vertices) - 2 for f in o.data.polygons))

# ---------------------------------------------------------------- pino piñonero y ciprés hechos aquí
def img_mat(name, path):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path); nt.links.new(t.outputs['Color'], b.inputs['Base Color']); return m
def tube(bm, uvl, pts, rads, sides=7):
    rings = []
    for i, (p, r) in enumerate(zip(pts, rads)):
        d = (Vector(pts[min(i + 1, len(pts) - 1)]) - Vector(pts[max(i - 1, 0)])).normalized(); a = d.orthogonal().normalized(); b2 = d.cross(a)
        rings.append([bm.verts.new(Vector(p) + (a * math.cos(k / sides * 2 * math.pi) + b2 * math.sin(k / sides * 2 * math.pi)) * r) for k in range(sides)])
    for i in range(len(rings) - 1):
        for k in range(sides):
            f = bm.faces.new((rings[i][k], rings[i][(k + 1) % sides], rings[i + 1][(k + 1) % sides], rings[i + 1][k]))
            for l, (u, v) in zip(f.loops, ((k / sides, i * 0.5), ((k + 1) / sides, i * 0.5), ((k + 1) / sides, (i + 1) * 0.5), (k / sides, (i + 1) * 0.5))): l[uvl].uv = (u, v)
def cards(bm, uvl, centers, size, R, up_bias):
    for c, s in zip(centers, size):
        n = Vector((R.uniform(-1, 1), R.uniform(-1, 1), R.uniform(-1, 1) + up_bias)).normalized(); a = n.orthogonal().normalized(); b2 = n.cross(a)
        rot = R.uniform(0, 2 * math.pi); a, b2 = a * math.cos(rot) + b2 * math.sin(rot), b2 * math.cos(rot) - a * math.sin(rot)
        vs = [bm.verts.new(Vector(c) + (a * x + b2 * y) * s) for x, y in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
        f = bm.faces.new(vs)
        for l, uv in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): l[uvl].uv = uv
def obj_from(bm, name, mat):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.materials.append(mat); o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); out_objs.append(o)
    print('PIEZA', name, sum(len(f.vertices) - 2 for f in me.polygons)); return o
if RAM:
    import random
    bark = img_mat('corteza_pino', os.path.join(SRC, 'pine_sapling_small', 'textures', 'pine_sapling_small_bark_diff_1k.jpg'))
    agu = img_mat('agujas_pino', os.path.join(RAM, 'pino_agujas.jpg')); cip = img_mat('ramas_cipres', os.path.join(RAM, 'cipres_ramas.jpg'))
    # pino piñonero: 1 m de alto, copa de 1,15 m de ancho
    R = random.Random(11); bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); tips = []
    tube(bm, uvl, [(0, 0, 0), (0.01, 0, 0.25), (0.03, 0.01, 0.5), (0.04, 0.01, 0.62)], [0.045, 0.036, 0.03, 0.027])
    for k in range(5):
        a = k / 5 * 2 * math.pi + R.uniform(-0.3, 0.3); L = R.uniform(0.3, 0.45)
        p1 = (0.04, 0.01, 0.62); p2 = (0.04 + math.cos(a) * L * 0.5, 0.01 + math.sin(a) * L * 0.5, 0.75); p3 = (0.04 + math.cos(a) * L, 0.01 + math.sin(a) * L, 0.84)
        tube(bm, uvl, [p1, p2, p3], [0.022, 0.015, 0.008], 6); tips.append(p3)
    cen = []; siz = []
    for i in range(1100):
        a = R.uniform(0, 2 * math.pi); r = 0.58 * math.sqrt(R.uniform(0, 1)); h = 0.86 + 0.12 * (1 - (r / 0.58) ** 2) + R.uniform(-0.05, 0.03)
        cen.append((math.cos(a) * r + 0.04, math.sin(a) * r + 0.01, h)); siz.append(R.uniform(0.055, 0.09))
    obj_from(bm, 'P_pino_tronco', bark)
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); cards(bm, uvl, cen, siz, R, 1.6); obj_from(bm, 'P_pino_hojas', agu)
    # ciprés: 1 m de alto, 0,24 m de ancho (llama)
    R = random.Random(13); bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap')
    tube(bm, uvl, [(0, 0, 0), (0, 0, 0.3), (0, 0, 0.7), (0, 0, 0.95)], [0.022, 0.018, 0.01, 0.004], 6)
    obj_from(bm, 'P_cipres_tronco', bark)
    cen = []; siz = []
    for i in range(1500):
        z = 0.06 + 0.94 * R.uniform(0, 1) ** 0.9; rad = 0.12 * math.sin(math.pi * min(1, (z - 0.03) / 0.97)) ** 0.6 * (1.15 - 0.35 * z); a = R.uniform(0, 2 * math.pi); r = rad * math.sqrt(R.uniform(0.25, 1))
        cen.append((math.cos(a) * r, math.sin(a) * r, z)); siz.append(R.uniform(0.04, 0.06) * (1.1 - 0.4 * z))
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('UVMap'); cards(bm, uvl, cen, siz, R, 0.0); obj_from(bm, 'P_cipres_hojas', cip)
# texturas a 512 px (el árbol se ve de lejos casi siempre) y sin mapas de normales ni de rugosidad: solo el color
for img in bpy.data.images:
    if img.size[0] > 512: img.scale(512, 512)
for m in bpy.data.materials:
    if not m.node_tree: continue
    for n in m.node_tree.nodes:
        if n.type == 'BSDF_PRINCIPLED':
            for k in ('Normal', 'Metallic', 'Roughness'):
                for l in list(n.inputs[k].links): m.node_tree.links.remove(l)
            n.inputs['Roughness'].default_value = 0.9
            for l in list(n.inputs['Alpha'].links): m.node_tree.links.remove(l)
    m.blend_method = 'OPAQUE'
bpy.ops.object.select_all(action='DESELECT')
for o in out_objs: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_image_format='JPEG', export_jpeg_quality=80, export_normals=True, export_texcoords=True, export_materials='EXPORT', export_apply=True)
print('GLB', OUT, os.path.getsize(OUT))
