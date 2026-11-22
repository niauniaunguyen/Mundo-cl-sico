# Objetos de Poly Haven (CC0, https://polyhaven.com) aligerados para el juego → modelos/objetos_ph.glb
#   /opt/bvenv/bin/python -I herramientas/blender/objetos_polyhaven.py -- <carpeta con las descargas gltf 1k> [salida.glb]
# Escaneados realistas (no low poly). Se eligieron los que no desentonan en la Atenas del 386 a.C. ni en la Roma del 80 d.C.;
# se descartaron los jarrones de porcelana y loza esmaltada, la jarra con flores, la escalera de tijera y el taburete torneado (modernos).
# Cada objeto: una sola malla, decimada a unos pocos miles de triángulos, texturas a 512 px en JPEG, base en el suelo y centrado.
# Se guarda a su tamaño real (metros). Nombre en el GLB: O_<nombre del juego>.
#   O_olla      ← planter_pot_clay (olla / maceta de barro)          O_hogar    ← stone_fire_pit (hogar de piedras)
#   O_cesto     ← wicker_basket_01 (cesto abierto de mimbre)         O_cesta    ← wicker_basket_02 (cesta con tapa)
#   O_cuenco    ← wooden_bowl_01 (cuenco grande de madera)           O_escudilla← wooden_bowl_02 (cuenco pequeño)
#   O_cuchara   ← wooden_spoon                                       O_plato    ← carved_wooden_plate
#   O_tabla     ← wooden_cutting_board                               O_taburete ← wooden_stool_02 (rústico)
#   O_granada   ← food_pomegranate_01  O_manzana ← food_apple_01    O_cebolla  ← yellow_onion
#   O_cubo, O_tina ← wooden_bucket_01 / 02 (cubos de duelas con aros: solo en el modo Roma)
import bpy, sys, os, math
from mathutils import Vector
argv = sys.argv[sys.argv.index('--') + 1:]
SRC = argv[0]
OUT = argv[1] if len(argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos', 'objetos_ph.glb')
ITEMS = [('O_olla', 'planter_pot_clay', 1800), ('O_hogar', 'stone_fire_pit', 2200), ('O_cesto', 'wicker_basket_01', 3000),
         ('O_cesta', 'wicker_basket_02', 3000), ('O_cuenco', 'wooden_bowl_01', 1800), ('O_escudilla', 'wooden_bowl_02', 1000),
         ('O_cuchara', 'wooden_spoon', 500), ('O_plato', 'carved_wooden_plate', 900), ('O_tabla', 'wooden_cutting_board', 500),
         ('O_taburete', 'wooden_stool_02', 2000), ('O_granada', 'food_pomegranate_01', 700), ('O_manzana', 'food_apple_01', 600),
         ('O_cebolla', 'yellow_onion', 600), ('O_cubo', 'wooden_bucket_01', 2000), ('O_tina', 'wooden_bucket_02', 2200)]
TEX = 512
bpy.ops.wm.read_factory_settings(use_empty=True)
done = []
for name, src, target in ITEMS:
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(SRC, src, src + '_1k.gltf'))
    new = [o for o in bpy.data.objects if o not in before]
    ms = [o for o in new if o.type == 'MESH']
    bpy.ops.object.select_all(action='DESELECT')
    for o in ms: o.select_set(True)
    bpy.context.view_layer.objects.active = ms[0]
    bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
    if len(ms) > 1: bpy.ops.object.join()
    ob = bpy.context.view_layer.objects.active
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    for o in new:
        try:
            if o != ob and o.name in bpy.data.objects: bpy.data.objects.remove(o, do_unlink=True)
        except ReferenceError: pass   # ya unida a la malla principal
    n = sum(len(p.vertices) - 2 for p in ob.data.polygons)
    if n > target:
        m = ob.modifiers.new('d', 'DECIMATE'); m.ratio = target / n; bpy.ops.object.modifier_apply(modifier='d')
    # base en el suelo y centrado (en Blender Z es arriba)
    pts = [ob.matrix_world @ v.co for v in ob.data.vertices]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts))); mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    off = Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z))
    for v in ob.data.vertices: v.co -= off
    ob.location = (0, 0, 0); ob.name = name; ob.data.name = name
    print('OBJ', name, 'tris', sum(len(p.vertices) - 2 for p in ob.data.polygons), 'tam', [round(x, 2) for x in (mx - mn)])
    done.append(ob)
# texturas a 512 px
for im in bpy.data.images:
    if im.size[0] > TEX: im.scale(TEX, max(1, int(im.size[1] * TEX / im.size[0])))
for i, ob in enumerate(done): ob.location.x = i * 2.0
bpy.ops.object.select_all(action='DESELECT')
for ob in done: ob.select_set(True); ob.location.x = 0
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_image_format='JPEG', export_jpeg_quality=80, export_normals=True, export_texcoords=True, export_materials='EXPORT', export_apply=True)
print('OBJETOS', OUT, os.path.getsize(OUT))
