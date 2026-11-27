# Optimización de las figuras de Blender sin cambiarlas por otras peores:
#   /opt/bvenv/bin/python -I herramientas/blender/personajes_unir.py [tipos separados por comas]
# Para cada modelos/personaje_<tipo>_juego.glb (21 mallas y 10 materiales: unas 20 llamadas de dibujo por persona):
#   · une todas las piezas con esqueleto en UNA malla con UN material y un atlas de 1024 px con las texturas de siempre
#     (la cara ocupa 512 px, como antes; el resto, 256) → modelos/personaje_<tipo>_uno.glb, con las 11 animaciones
#   · en el color de los vértices (canal rojo) guarda qué pieza se tiñe por persona: 0,5 = himation/palla, 1 = quitón/túnica,
#     0 = el resto; el juego multiplica por el color de cada persona, como hacía bpTint con los materiales separados
#   · una versión aligerada (≈2.600 triángulos en vez de ≈14.000) con el mismo esqueleto → personaje_<tipo>_uno_baja.glb,
#     para la media distancia
import bpy, sys, os, math, numpy as np
AQ = os.path.dirname(os.path.abspath(__file__)); MOD = os.path.join(AQ, '..', '..', 'modelos')
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
KINDS = args[0].split(',') if args else ['ciudadano', 'mujer', 'obrero', 'hoplita', 'togado', 'romana', 'legionario', 'tunicado']
TINT_A = {'himation', 'palla'}; TINT_B = {'quiton', 'estola', 'exomis', 'tunica'}
AT = 1024; C = 256

def img_array(im, size):
    w, h = im.size
    if w == 0 or h == 0: return np.ones((size, size, 4), np.float32)
    a = np.array(im.pixels[:], np.float32).reshape(h, w, 4)
    ys = (np.arange(size) * h / size).astype(int); xs = (np.arange(size) * w / size).astype(int)
    return a[ys][:, xs]

def build(kind):
    src = os.path.join(MOD, 'personaje_%s_juego.glb' % kind)
    if not os.path.exists(src): print('falta', src); return
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=src)
    arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
    meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm]
    extra = [o for o in bpy.data.objects if o.type == 'MESH' and o not in meshes]
    for o in extra: bpy.data.objects.remove(o, do_unlink=True)
    print('PASO importado', len(meshes), flush=True)
    # ---- atlas: un sitio para cada material (la cara, 2×2 casillas)
    mats = []
    for o in meshes:
        for m in o.data.materials:
            if m and m not in mats: mats.append(m)
    def tex_of(m):
        if not m.use_nodes: return None
        for n in m.node_tree.nodes:
            if n.type == 'TEX_IMAGE' and n.image: return n.image
        return None
    big = [m for m in mats if tex_of(m) and tex_of(m).size[0] >= 512]
    slots = {}; free = [(i, j) for j in range(4) for i in range(4)]
    for m in big:
        for c in [(0, 0), (2, 0), (0, 2), (2, 2)]:
            cells = [(c[0] + a, c[1] + b) for a in (0, 1) for b in (0, 1)]
            if all(x in free for x in cells):
                for x in cells: free.remove(x)
                slots[m.name] = (c[0], c[1], 2); break
    for m in mats:
        if m.name in slots: continue
        if not free: print('sin sitio para', m.name); continue
        c = free.pop(0); slots[m.name] = (c[0], c[1], 1)
    print('PASO huecos', slots, flush=True)
    atlas = np.ones((AT, AT, 4), np.float32)
    for m in mats:
        if m.name not in slots: continue
        i, j, s = slots[m.name]; im = tex_of(m); px = C * s
        a = img_array(im, px) if im else np.tile(np.array(list(m.diffuse_color), np.float32), (px, px, 1))
        atlas[j * C:j * C + px, i * C:i * C + px] = a
    print('PASO atlas', flush=True)
    # ---- coordenadas de textura y piezas que se tiñen
    pad = 2.0 / AT
    for o in meshes:
        me = o.data; me.color_attributes.new(name='Col', type='BYTE_COLOR', domain='CORNER')   # primero el color: crearlo mueve las capas de memoria
        if not me.uv_layers: me.uv_layers.new(name='UVMap')
        ca = me.color_attributes['Col']; uv = me.uv_layers.active
        for p in me.polygons:
            m = me.materials[p.material_index] if me.materials else None
            i, j, s = slots.get(m.name, (0, 0, 1)) if m else (0, 0, 1)
            base = m.name if m else ''
            t = 0.5 if base in TINT_A else 1.0 if base in TINT_B else 0.0
            for li in p.loop_indices:
                u, v = uv.data[li].uv if uv else (0.5, 0.5)
                u = min(max(u, 0), 1); v = min(max(v, 0), 1)
                uv.data[li].uv = (i * C / AT + pad + u * (C * s / AT - 2 * pad), j * C / AT + pad + v * (C * s / AT - 2 * pad))
                ca.data[li].color = (t, 1.0, 1.0, 1.0)
        me.color_attributes.active_color = ca
    print('PASO uv', flush=True)
    # ---- un material con el atlas
    img = bpy.data.images.new('atlas_' + kind, AT, AT); img.pixels[:] = atlas.ravel(); img.file_format = 'JPEG'
    mat = bpy.data.materials.new(kind + '_atlas'); mat.use_nodes = True
    bs = mat.node_tree.nodes['Principled BSDF']; tn = mat.node_tree.nodes.new('ShaderNodeTexImage'); tn.image = img
    mat.node_tree.links.new(tn.outputs['Color'], bs.inputs['Base Color']); bs.inputs['Roughness'].default_value = 0.9
    for o in meshes: o.data.materials.clear(); o.data.materials.append(mat)
    bpy.ops.object.select_all(action='DESELECT')
    for o in meshes: o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]; bpy.ops.object.join(); body = bpy.context.active_object; body.name = kind + '_uno'
    print('PASO unido', flush=True)
    # ---- nombres de las animaciones como en el original (kind_andar…)
    suf = '_' + arm.name
    for a in bpy.data.actions:
        if a.name.endswith(suf): a.name = a.name[:-len(suf)]
    if not arm.animation_data: arm.animation_data_create()
    for a in bpy.data.actions:
        tr = arm.animation_data.nla_tracks.new(); tr.name = a.name; tr.strips.new(a.name, 0, a)
    bpy.ops.object.select_all(action='SELECT')
    out = os.path.join(MOD, 'personaje_%s_uno.glb' % kind)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS', export_image_format='JPEG', export_jpeg_quality=86, export_vertex_color='ACTIVE')
    tri = sum(len(p.vertices) - 2 for p in body.data.polygons)
    # ---- versión aligerada (mismo esqueleto, sin animaciones: el juego solo usa su geometría)
    dm = body.modifiers.new('d', 'DECIMATE'); dm.ratio = min(1.0, 3200 / max(1, tri)); dm.use_collapse_triangulate = True
    bpy.context.view_layer.objects.active = body; bpy.ops.object.modifier_apply(modifier='d')
    out2 = os.path.join(MOD, 'personaje_%s_uno_baja.glb' % kind)
    bpy.ops.export_scene.gltf(filepath=out2, export_format='GLB', export_animations=False, export_image_format='NONE', export_vertex_color='ACTIVE')
    print('UNIDO', kind, tri, '→', sum(len(p.vertices) - 2 for p in body.data.polygons), os.path.getsize(out) // 1024, 'KB', os.path.getsize(out2) // 1024, 'KB')

for k in KINDS: build(k)
