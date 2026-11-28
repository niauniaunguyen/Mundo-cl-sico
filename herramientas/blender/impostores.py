# Figuras lejanas sacadas de los modelos de Blender (en vez de siluetas):
#   /opt/bvenv/bin/python -I herramientas/blender/impostores.py -- carpeta_tmp [tipos]
# Para cada personaje_<tipo>_juego.glb: 8 ángulos × 6 momentos de la animación de andar (y la fila 7, quieto), 64×128 px cada uno,
# con fondo transparente. Luego herramientas/blender/impostores_atlas.py los junta en modelos/impostor_<tipo>.png (512×896).
# Ángulo 0: la figura mira a la cámara; cada columna, 45° más girada en sentido antihorario visto desde arriba.
import bpy, sys, os, math
a = sys.argv[sys.argv.index('--') + 1:]; TMP = a[0]; KINDS = a[1].split(',') if len(a) > 1 else ['ciudadano', 'mujer', 'obrero', 'hoplita', 'togado', 'romana', 'legionario', 'tunicado']
MOD = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'modelos')
for kind in KINDS:
    src = os.path.join(MOD, 'personaje_%s_uno.glb' % kind)   # la figura en una malla: lleva en el color de los vértices qué se tiñe
    if not os.path.exists(src): continue
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=src)
    SC = bpy.context.scene
    arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
    for o in list(bpy.data.objects):
        if o.type == 'MESH' and o.parent != arm: bpy.data.objects.remove(o, do_unlink=True)
    walk = next((x for x in bpy.data.actions if '_andar' in x.name), None); idle = next((x for x in bpy.data.actions if '_quieto' in x.name), None)
    if not arm.animation_data: arm.animation_data_create()
    if arm.animation_data.nla_tracks:
        for t in list(arm.animation_data.nla_tracks): arm.animation_data.nla_tracks.remove(t)
    SC.render.engine = 'CYCLES'; SC.cycles.samples = 12; SC.cycles.device = 'CPU'; SC.cycles.use_denoising = False
    w = bpy.data.worlds.new('w'); SC.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.75, 0.78, 0.85, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.9
    sun = bpy.data.objects.new('sol', bpy.data.lights.new('sol', 'SUN')); SC.collection.objects.link(sun); sun.rotation_euler = (math.radians(50), 0, math.radians(-30)); sun.data.energy = 2.6
    SC.render.film_transparent = True; SC.render.resolution_x = 64; SC.render.resolution_y = 128; SC.render.image_settings.file_format = 'PNG'; SC.render.image_settings.color_mode = 'RGBA'
    SC.view_settings.view_transform = 'Standard'
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); SC.collection.objects.link(cam); SC.camera = cam
    cam.data.type = 'ORTHO'; cam.data.ortho_scale = 2.0; cam.location = (0, -10, 0.95 + 10 * math.tan(math.radians(8))); cam.rotation_euler = (math.radians(90 - 8), 0, 0)
    arm.rotation_mode = 'XYZ'
    me = next(o for o in bpy.data.objects if o.type == 'MESH')
    tex = next(n.image for m in me.data.materials for n in m.node_tree.nodes if n.type == 'TEX_IMAGE' and n.image)
    mcol = bpy.data.materials.new('col'); mcol.use_nodes = True; bs = mcol.node_tree.nodes['Principled BSDF']; tn = mcol.node_tree.nodes.new('ShaderNodeTexImage'); tn.image = tex
    mcol.node_tree.links.new(tn.outputs['Color'], bs.inputs['Base Color']); bs.inputs['Roughness'].default_value = 0.9
    mmask = bpy.data.materials.new('mask'); mmask.use_nodes = True; nt = mmask.node_tree; nt.nodes.remove(nt.nodes['Principled BSDF'])
    ca = nt.nodes.new('ShaderNodeVertexColor'); ca.layer_name = me.data.color_attributes[0].name if me.data.color_attributes else 'Col'; em = nt.nodes.new('ShaderNodeEmission'); nt.links.new(ca.outputs['Color'], em.inputs['Color']); nt.links.new(em.outputs['Emission'], nt.nodes['Material Output'].inputs['Surface'])
    bgw = w.node_tree.nodes['Background']
    rows = []
    if walk:
        f0, f1 = walk.frame_range
        for fi in range(6): rows.append((walk, f0 + (f1 - f0) * fi / 6.0))
    if idle: rows.append((idle, idle.frame_range[0]))
    for ri, (act, fr) in enumerate(rows):
        arm.animation_data.action = act; SC.frame_set(int(fr), subframe=fr - int(fr))
        for ai in range(8):
            arm.rotation_euler = (arm.rotation_euler[0], arm.rotation_euler[1], math.radians(45 * ai))
            me.data.materials[0] = mcol; bgw.inputs[1].default_value = 0.9; sun.hide_render = False; SC.cycles.samples = 12
            SC.render.filepath = os.path.join(TMP, '%s_%d_%d.png' % (kind, ri, ai)); bpy.ops.render.render(write_still=True)
            me.data.materials[0] = mmask; bgw.inputs[1].default_value = 0.0; sun.hide_render = True; SC.cycles.samples = 1
            SC.render.filepath = os.path.join(TMP, '%s_%d_%d_m.png' % (kind, ri, ai)); bpy.ops.render.render(write_still=True)
    print('IMPOSTOR', kind, len(rows))
