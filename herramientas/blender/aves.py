# El mochuelo (Atenas) y el águila (Roma) del vuelo de entrada (fuente/codigo/227_vuelo_de_entrada.js) → modelos/aves.glb
#   /opt/bvenv/bin/python herramientas/blender/aves.py [-- vista.png]
# Hechos a mano con código (sin modelos ajenos). Colores por vértice (sin texturas): pesa muy poco.
# Cada ave es un vacío (mochuelo / aguila) con estas piezas; el juego bate las alas girando las piezas del brazo y de la mano:
#   <ave>_cuerpo, <ave>_cabeza (con ojos, pico y disco facial), <ave>_cola
#   <ave>_aI1 / <ave>_aD1   brazo del ala izquierda / derecha, con el origen en el hombro
#   <ave>_aI2 / <ave>_aD2   mano del ala (hija del brazo), con el origen en la muñeca
# Mira hacia -Y en Blender (en el juego, hacia +Z), alas a lo largo de ±X, arriba +Z. Medidas reales en metros:
#   mochuelo (Athene noctua): unos 22 cm de largo y 55-60 cm de envergadura (aquí algo más, 75 cm, para que se lea en pantalla);
#   águila real (Aquila chrysaetos): unos 85 cm de largo y 2 m de envergadura, con las «puntas de los dedos» (primarias separadas).
import bpy, bmesh, sys, os, math
from mathutils import Vector
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
PREV = args[0] if args else None
AQ = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(AQ, '..', '..', 'modelos', 'aves.glb')
bpy.ops.wm.read_factory_settings(use_empty=True)
SC = bpy.context.scene

def h(x, y, z=0.0):
    s = math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
    return s - math.floor(s)

def mat():
    m = bpy.data.materials.new('plumaje'); m.use_nodes = True
    nt = m.node_tree; bs = nt.nodes['Principled BSDF']; ca = nt.nodes.new('ShaderNodeVertexColor'); ca.layer_name = 'Col'
    nt.links.new(ca.outputs['Color'], bs.inputs['Base Color']); bs.inputs['Roughness'].default_value = 0.85
    return m
MAT = mat()

def finish(name, bm, colf, loc=(0, 0, 0), parent=None, flat=False):
    me = bpy.data.meshes.new(name); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    ca = me.color_attributes.new('Col', 'BYTE_COLOR', 'CORNER')
    for poly in me.polygons:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co
            c = colf(v); ca.data[li].color = (c[0], c[1], c[2], 1.0)
    me.materials.append(MAT)
    for p in me.polygons: p.use_smooth = not flat
    ob = bpy.data.objects.new(name, me); SC.collection.objects.link(ob); ob.location = loc
    if parent: ob.parent = parent
    return ob

def ellipsoid(bm, c, r, seg=16, ring=10, deform=None):
    res = bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=ring, radius=1.0)
    for v in res['verts']:
        p = Vector((v.co.x * r[0], v.co.y * r[1], v.co.z * r[2]))
        if deform: p = deform(p)
        v.co = p + Vector(c)
    return res['verts']

def cone(bm, base, tip, r0, seg=8):
    base, tip = Vector(base), Vector(tip); d = tip - base; L = d.length
    res = bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r0, radius2=0.0005, depth=L)
    q = Vector((0, 0, 1)).rotation_difference(d.normalized())
    for v in res['verts']:
        v.co = q @ (v.co + Vector((0, 0, L / 2))) + base

def slab(bm, outline, th=0.008, camber=0.0, span=1.0):
    # contorno en el plano XY (x hacia fuera, y a lo largo de la cuerda: -y es el borde de ataque), grosor th
    vs = [bm.verts.new((x, y, camber * math.sin(math.pi * min(1, max(0, x / span))) )) for x, y in outline]
    f = bm.faces.new(vs)
    bmesh.ops.triangulate(bm, faces=[f]); bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=3, use_grid_fill=True)
    for v in bm.verts: v.co.z = camber * math.sin(math.pi * min(1, max(0, v.co.x / span)))
    ex = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    for e in ex['geom']:
        if isinstance(e, bmesh.types.BMVert): e.co.z -= th
    bmesh.ops.triangulate(bm, faces=bm.faces[:])

# ------------------------------------------------------------------ el mochuelo
def owl_col(v, part):
    base = Vector((0.42, 0.29, 0.17)); spot = h(round(v.x * 90), round(v.y * 90), round(v.z * 90))
    if part == 'cuerpo':
        if v.z < -0.02: base = Vector((0.82, 0.76, 0.64)).lerp(Vector((0.45, 0.32, 0.2)), 0.35 if spot > 0.6 else 0.0)   # vientre claro con rayas
        elif spot > 0.82: base = Vector((0.9, 0.85, 0.75))
    elif part == 'cabeza':
        if spot > 0.8: base = Vector((0.9, 0.86, 0.76))
    elif part in ('ala', 'cola'):
        band = (math.sin(v.x * 70 + v.y * 25) > 0.55)
        if spot > 0.86: base = Vector((0.9, 0.85, 0.74))
        elif band: base = Vector((0.6, 0.47, 0.32))
    return base

def owl():
    root = bpy.data.objects.new('mochuelo', None); SC.collection.objects.link(root)
    bm = bmesh.new(); ellipsoid(bm, (0, 0, 0), (0.085, 0.13, 0.085), seg=28, ring=18, deform=lambda p: Vector((p.x * (1 - 0.25 * max(0, p.y) / 0.13), p.y, p.z)))
    finish('mochuelo_cuerpo', bm, lambda v: owl_col(v, 'cuerpo'), parent=root)
    # cabeza: ancha y plana por detrás, disco facial claro, «cejas» blancas, ojos amarillos
    bm = bmesh.new(); ellipsoid(bm, (0, 0, 0), (0.082, 0.07, 0.066), seg=24, ring=16)
    ellipsoid(bm, (0, -0.052, -0.004), (0.062, 0.022, 0.05), seg=12, ring=8)
    for s in (-1, 1):
        ellipsoid(bm, (s * 0.028, -0.07, 0.008), (0.017, 0.012, 0.017), seg=10, ring=6)
        ellipsoid(bm, (s * 0.028, -0.081, 0.008), (0.009, 0.006, 0.009), seg=8, ring=5)
        ellipsoid(bm, (s * 0.03, -0.066, 0.03), (0.022, 0.01, 0.006), seg=8, ring=5)
    cone(bm, (0, -0.07, -0.012), (0, -0.088, -0.03), 0.01)
    def hc(v):
        if v.y < -0.075 and abs(v.x) > 0.018 and v.z > -0.005 and v.z < 0.022:
            return Vector((0.05, 0.04, 0.03)) if v.y < -0.084 else Vector((0.95, 0.78, 0.12))
        if v.y < -0.066 and v.z < -0.01 and abs(v.x) < 0.013: return Vector((0.82, 0.72, 0.4))
        if v.y < -0.06 and v.z > 0.022 and v.z < 0.04: return Vector((0.93, 0.9, 0.83))
        if v.y < -0.05: return Vector((0.78, 0.7, 0.56))
        return owl_col(v, 'cabeza')
    finish('mochuelo_cabeza', bm, hc, loc=(0, -0.1, 0.06), parent=root)
    bm = bmesh.new(); slab(bm, [(-0.03, 0), (0.03, 0), (0.042, 0.075), (0, 0.085), (-0.042, 0.075)], th=0.006)
    finish('mochuelo_cola', bm, lambda v: owl_col(v, 'cola'), loc=(0, 0.1, 0.01), parent=root, flat=True)
    inner = [(0, -0.07), (0.07, -0.078), (0.155, -0.07), (0.16, 0.085), (0.08, 0.1), (0, 0.08)]
    outer = [(0, -0.07), (0.07, -0.066), (0.12, -0.05), (0.155, -0.02), (0.165, 0.03), (0.15, 0.075), (0.11, 0.1), (0.05, 0.105), (0, 0.085)]
    for s, nm in ((-1, 'I'), (1, 'D')):
        bm = bmesh.new(); slab(bm, [(s * x, y) for x, y in inner], th=0.005, camber=0.012, span=s * 0.16)
        a1 = finish('mochuelo_a%s1' % nm, bm, lambda v: owl_col(v, 'ala'), loc=(s * 0.06, -0.01, 0.035), parent=root, flat=True)
        bm = bmesh.new(); slab(bm, [(s * x, y) for x, y in outer], th=0.004, camber=0.008, span=s * 0.18)
        finish('mochuelo_a%s2' % nm, bm, lambda v: owl_col(v, 'ala'), loc=(s * 0.155, 0, 0), parent=a1, flat=True)
    return root

# ------------------------------------------------------------------ el águila
def eag_col(v, part):
    dark = Vector((0.25, 0.16, 0.09)); mid = Vector((0.42, 0.28, 0.15)); gold = Vector((0.78, 0.58, 0.28))
    n = h(round(v.x * 40), round(v.y * 40), round(v.z * 40))
    if part == 'cuerpo': return mid.lerp(dark, 0.4 + 0.3 * n)
    if part == 'cabeza': return gold.lerp(mid, 0.25 * n)
    if part == 'cola': return dark.lerp(Vector((0.35, 0.25, 0.16)), 0.4 if math.sin(v.y * 60) > 0.6 else 0.0)
    if part == 'ala1': return (Vector((0.55, 0.4, 0.22)) if v.y < -0.02 else mid).lerp(dark, 0.3 * n)   # cobertoras más claras
    if part == 'ala2': return Vector((0.16, 0.1, 0.06)).lerp(dark, 0.4 * n)   # primarias oscuras
    return mid

def eagle():
    root = bpy.data.objects.new('aguila', None); SC.collection.objects.link(root)
    bm = bmesh.new(); ellipsoid(bm, (0, 0, 0), (0.1, 0.27, 0.1), deform=lambda p: Vector((p.x * (1 - 0.35 * max(0, p.y) / 0.27), p.y, p.z * (1 - 0.2 * max(0, p.y) / 0.27))))
    finish('aguila_cuerpo', bm, lambda v: eag_col(v, 'cuerpo'), parent=root)
    bm = bmesh.new(); ellipsoid(bm, (0, 0, 0), (0.058, 0.075, 0.06))
    for s in (-1, 1):
        ellipsoid(bm, (s * 0.04, -0.035, 0.018), (0.012, 0.01, 0.01), seg=8, ring=5)
    cone(bm, (0, -0.065, 0.005), (0, -0.11, -0.012), 0.022)
    cone(bm, (0, -0.105, -0.008), (0, -0.112, -0.035), 0.009)
    def hc(v):
        if v.y < -0.06 and abs(v.x) < 0.024: return Vector((0.9, 0.72, 0.2)) if v.y > -0.1 else Vector((0.15, 0.12, 0.1))
        if abs(v.x) > 0.035 and v.y < -0.025 and v.z > 0.008: return Vector((0.55, 0.3, 0.08))
        return eag_col(v, 'cabeza')
    finish('aguila_cabeza', bm, hc, loc=(0, -0.3, 0.05), parent=root)
    bm = bmesh.new(); slab(bm, [(-0.05, 0), (0.05, 0), (0.12, 0.22), (0.06, 0.25), (0, 0.24), (-0.06, 0.25), (-0.12, 0.22)], th=0.008)
    finish('aguila_cola', bm, lambda v: eag_col(v, 'cola'), loc=(0, 0.22, 0.01), parent=root, flat=True)
    inner = [(0, -0.12), (0.2, -0.13), (0.42, -0.11), (0.42, 0.15), (0.2, 0.18), (0, 0.16)]
    # mano con cinco primarias separadas («dedos»)
    outer = [(0, -0.11), (0.16, -0.1), (0.3, -0.08)]
    for k in range(5):
        y0 = -0.07 + k * 0.045; outer += [(0.36 + 0.02 * (4 - k), y0 - 0.008), (0.5 - 0.025 * k, y0 + 0.004), (0.36 + 0.02 * (4 - k), y0 + 0.018)]
    outer += [(0.3, 0.16), (0.12, 0.17), (0, 0.15)]
    for s, nm in ((-1, 'I'), (1, 'D')):
        bm = bmesh.new(); slab(bm, [(s * x, y) for x, y in inner], th=0.008, camber=0.03, span=s * 0.42)
        a1 = finish('aguila_a%s1' % nm, bm, lambda v: eag_col(v, 'ala1'), loc=(s * 0.08, -0.05, 0.035), parent=root, flat=True)
        bm = bmesh.new(); slab(bm, [(s * x, y) for x, y in outer], th=0.006, camber=0.015, span=s * 0.5)
        finish('aguila_a%s2' % nm, bm, lambda v: eag_col(v, 'ala2'), loc=(s * 0.42, 0, 0), parent=a1, flat=True)
    return root

o = owl(); e = eagle(); e.location.x = 2.0
tri = sum(sum(len(p.vertices) - 2 for p in ob.data.polygons) for ob in SC.objects if ob.type == 'MESH')
print('AVES triángulos', tri)
if PREV:
    SC.render.engine = 'CYCLES'; SC.cycles.samples = 24; SC.cycles.device = 'CPU'; SC.view_settings.view_transform = 'Standard'
    SC.render.resolution_x = 700; SC.render.resolution_y = 450
    w = bpy.data.worlds.new('w'); SC.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.55, 0.62, 0.7, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.6
    sun = bpy.data.objects.new('sol', bpy.data.lights.new('sol', 'SUN')); SC.collection.objects.link(sun); sun.rotation_euler = (0.6, 0.3, 0.8); sun.data.energy = 2.5
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); SC.collection.objects.link(cam); SC.camera = cam
    for nm, ox, d in (('mochuelo', 0.0, 0.9), ('aguila', 2.0, 3.2)):
        tgt = Vector((ox, -0.05, 0)); cam.location = tgt + Vector((0.35 * d, 0.85 * d, 0.62 * d))
        cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
        SC.render.filepath = PREV.replace('.png', '_' + nm + '.png'); bpy.ops.render.render(write_still=True)
e.location.x = 0.0
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_apply=True, export_yup=True, export_vertex_color='MATERIAL')
print('AVES', OUT, os.path.getsize(OUT))
