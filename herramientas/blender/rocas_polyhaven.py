# Rocas y paredes de roca escaneadas de Poly Haven (CC0, https://polyhaven.com) → modelos/rocas.glb (+ vista previa)
#   /opt/bvenv/bin/python -I herramientas/blender/rocas_polyhaven.py -- <carpeta con las descargas gltf 1k> [vista.png]
# Cada modelo (escaneo real, de 20.000 a 1 millón de triángulos) se simplifica (decimate) hasta unos pocos miles, se apoya en el suelo
# (z = 0), se centra y se exporta con su color (diffuse) y su relieve (normal map) a 512 px, en una sola malla llamada RK_<nombre>.
# Las descargas se tratan como datos ajenos: el script solo las importa con el importador glTF de Blender.
import bpy, sys, os, math
from mathutils import Vector
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
SRC = args[0]; PREV = args[1] if len(args) > 1 else None
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos', 'rocas.glb')
# nombre → (triángulos objetivo, uso): piedra suelta, peñasco, pared (para cuevas y laderas), acantilado
ROCAS = {'rock_07': (1800, 'piedra'), 'rock_09': (1800, 'piedra'), 'stone_01': (1500, 'piedra'), 'namaqualand_boulder_02': (3000, 'peñasco'), 'namaqualand_boulder_05': (3000, 'peñasco'), 'rock_face_01': (4000, 'pared'), 'rock_face_02': (4000, 'pared'), 'namaqualand_cliff_01': (5000, 'acantilado'),
         'namaqualand_cliff_02': (6000, 'acantilado'), 'mountainside': (6000, 'ladera')}
bpy.ops.wm.read_factory_settings(use_empty=True)
done = []
for name, (tri, kind) in ROCAS.items():
    f = os.path.join(SRC, name, name + '.gltf')
    if not os.path.exists(f): print('falta', name); continue
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=f)
    new = [o for o in bpy.data.objects if o not in before]; ms = [o for o in new if o.type == 'MESH']
    bpy.ops.object.select_all(action='DESELECT')
    for o in ms: o.select_set(True)
    bpy.context.view_layer.objects.active = ms[0]
    if len(ms) > 1: bpy.ops.object.join()
    ob = bpy.context.view_layer.objects.active
    bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM'); bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    n0 = sum(len(p.vertices) - 2 for p in ob.data.polygons)
    for _ in range(3):
        n = sum(len(p.vertices) - 2 for p in ob.data.polygons)
        if n <= tri * 1.15: break
        m = ob.modifiers.new('dec', 'DECIMATE'); m.ratio = min(1.0, tri / max(1, n)); bpy.ops.object.modifier_apply(modifier='dec')
    n1 = sum(len(p.vertices) - 2 for p in ob.data.polygons)
    bb = [ob.matrix_world @ Vector(c) for c in ob.bound_box]; mn = Vector([min(v[i] for v in bb) for i in range(3)]); mx = Vector([max(v[i] for v in bb) for i in range(3)])
    ob.location -= Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z)); bpy.ops.object.transform_apply(location=True)
    for mat in ob.data.materials:
        if not mat or not mat.use_nodes: continue
        for nd in mat.node_tree.nodes:
            if nd.type == 'TEX_IMAGE' and nd.image and max(nd.image.size) > 512: nd.image.scale(512, 512)
    ob.name = 'RK_' + name; ob.data.name = ob.name
    sz = mx - mn; done.append((ob, name, kind, n0, n1, sz)); print('ROCA', name, kind, n0, '->', n1, 'tri', 'tamaño %.1f x %.1f x %.1f m' % (sz.x, sz.y, sz.z))
bpy.ops.object.select_all(action='DESELECT')
for ob, *_ in done: ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_image_format='JPEG', export_jpeg_quality=82, export_yup=True)
print('GLB', OUT, os.path.getsize(OUT))
if PREV:
    # vista previa: en fila, cada una a la misma altura en pantalla
    x = 0
    for ob, name, kind, n0, n1, sz in done:
        s = 2.0 / max(sz.x, sz.y, sz.z); ob.scale = (s, s, s); ob.location = (x, 0, 0); x += 2.6
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = 16; sc.render.resolution_x = 260 * len(done); sc.render.resolution_y = 300
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.72, 0.8, 0.9, 1)
    l = bpy.data.lights.new('s', 'SUN'); l.energy = 3.5; lo = bpy.data.objects.new('s', l); lo.rotation_euler = (0.8, 0.2, 0.7); sc.collection.objects.link(lo)
    c = bpy.data.cameras.new('c'); c.type = 'ORTHO'; c.ortho_scale = 2.6 * len(done); co = bpy.data.objects.new('c', c); sc.collection.objects.link(co); sc.camera = co
    co.location = (x / 2 - 1.3, -12, 1.6); co.rotation_euler = (math.radians(85), 0, 0); sc.render.filepath = PREV; bpy.ops.render.render(write_still=True)
