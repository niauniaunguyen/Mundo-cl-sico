# PROTOTIPO: un personaje con el cuerpo de MakeHuman (malla base hm08, esqueleto «default» y sus pesos; todo CC0, ver makehuman/LEEME.md)
# y las animaciones de Quaternius (ual_retarget.py) pasadas a ese esqueleto, para comparar cómo se deforma con el cuerpo de personajes.py.
#   /opt/bvenv/bin/python herramientas/blender/prototipo_mh.py -- salida.glb [vista_prefijo]
# Lleva una túnica corta de lana con cinturón y pelo corto, como el «tunicado» del juego. No se usa todavía en el juego.
import bpy, bmesh, sys, os, json, math
import numpy as np
from mathutils import Vector, Matrix
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import ual_retarget as U
MH = os.path.join(HERE, 'makehuman')
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = args[0] if args else os.path.join(HERE, '..', '..', 'modelos', 'prototipo_mh.glb'); VIEW = args[1] if len(args) > 1 else None
bpy.ops.wm.read_factory_settings(use_empty=True); scn = bpy.context.scene
# ---- malla base: vértices (todas, en el orden del archivo: los pesos y las articulaciones se refieren a ese orden) y caras por grupo
V = []; F = []; UVs = []; FT = []; cur = None
for l in open(os.path.join(MH, 'base.obj')):
    if l.startswith('v '): V.append([float(x) for x in l.split()[1:4]])
    elif l.startswith('vt '): UVs.append([float(x) for x in l.split()[1:3]])
    elif l.startswith('g '): cur = l.split()[1]
    elif l.startswith('f '):
        p = [x.split('/') for x in l.split()[1:]]; F.append((cur, [int(a[0]) - 1 for a in p], [int(a[1]) - 1 if len(a) > 1 and a[1] else -1 for a in p]))
V = np.array(V, float)
# forma: hombre joven, musculatura media (deformaciones «macro» de MakeHuman)
T = np.load(os.path.join(MH, 'cuerpo_targets.npz'))
for k, w in (('caucasian-male-young', 1.0), ('universal-male-young-averagemuscle-averageweight', 0.6), ('universal-male-young-maxmuscle-averageweight', 0.4)):
    V[T[k + '.index']] += T[k + '.vector'].astype(float) * 1e-3 * w
# unidades: decímetros, Y arriba, cara hacia +Z  →  metros, Z arriba, cara hacia -Y; pies en el suelo y 1,72 m de alto
P = np.stack([V[:, 0], -V[:, 2], V[:, 1]], 1) / 10.0
body_idx = sorted({k for g, f, _ in F if g == 'body' for k in f})
zmin = P[body_idx, 2].min(); P[:, 2] -= zmin; s = 1.72 / P[body_idx, 2].max(); P *= s
# ---- esqueleto: cada articulación es la media de unos vértices (los cubos auxiliares de la malla base)
S = json.load(open(os.path.join(MH, 'esqueleto_default.mhskel')))
J = {k: Vector(P[v].mean(0)) for k, v in S['joints'].items()}
ad = bpy.data.armatures.new('mh_esqueleto'); arm = bpy.data.objects.new('mh_esqueleto', ad); scn.collection.objects.link(arm)
bpy.context.view_layer.objects.active = arm; bpy.ops.object.mode_set(mode='EDIT')
B = S['bones']; done = set()
def mk(n):
    if n in done: return
    b = B[n]
    if b['parent']: mk(b['parent'])
    e = ad.edit_bones.new(n); e.head = J[b['head']]; e.tail = J[b['tail']]
    if (e.tail - e.head).length < 1e-4: e.tail = e.head + Vector((0, 0, 0.01))
    if b['parent']: e.parent = ad.edit_bones[b['parent']]
    done.add(n)
for n in B: mk(n)
bpy.ops.object.mode_set(mode='OBJECT')
# ---- cuerpo y ojos (las caras de los grupos body y helper-*-eye), con sus UV
keep = [(g, f, t) for g, f, t in F if g in ('body', 'helper-l-eye', 'helper-r-eye')]
me = bpy.data.meshes.new('mh_cuerpo'); me.from_pydata([tuple(p) for p in P], [], [f for _, f, _ in keep]); me.update()
uvl = me.uv_layers.new(name='UV')
for poly, (_, f, t) in zip(me.polygons, keep):
    for li, ti in zip(poly.loop_indices, t):
        if ti >= 0: uvl.data[li].uv = UVs[ti]
body = bpy.data.objects.new('mh_cuerpo', me); scn.collection.objects.link(body)
W = json.load(open(os.path.join(MH, 'pesos_default.mhw')))['weights']
for bn, lst in W.items():
    if bn not in ad.bones: continue
    vg = body.vertex_groups.new(name=bn)
    for vi, w in lst: vg.add([vi], w, 'REPLACE')
eyes_set = {k for g, f, _ in keep if g != 'body' for k in f}
# los vértices sueltos (cubos auxiliares, otras ayudas) fuera; los índices cambian, pero los grupos ya están puestos
bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS'); bm.to_mesh(me); bm.free()
for p in me.polygons: p.use_smooth = True
def mat(name, col, rough=0.8):
    m = bpy.data.materials.new(name); m.use_nodes = True; bs = m.node_tree.nodes['Principled BSDF']; bs.inputs['Base Color'].default_value = (*col, 1); bs.inputs['Roughness'].default_value = rough; return m
skin = mat('mh_piel', (0.72, 0.48, 0.33)); eye = mat('mh_ojo', (0.85, 0.83, 0.8), 0.3)
me.materials.append(skin); me.materials.append(eye)
for p in me.polygons:
    c = p.center
    if c.z > 1.5 and abs(c.x) < 0.06 and c.y < -0.06 and any(True for _ in [0]): pass
# los ojos: los polígonos de los globos (por posición: dentro de las órbitas) con el material claro
eyez = [J[k].z for k in ('eye.L____head', 'eye.R____head') if k in J]
if eyez:
    ez = sum(eyez) / len(eyez)
    for p in me.polygons:
        c = p.center
        if abs(c.z - ez) < 0.018 and 0.015 < abs(c.x) < 0.05 and c.y < -0.06: p.material_index = 1
mod = body.modifiers.new('arm', 'ARMATURE'); mod.object = arm; body.parent = arm
# ---- pelo corto: la parte alta y de atrás de la cabeza, separada 4 mm
top = P[body_idx, 2].max(); bm = bmesh.new(); bm.from_mesh(me)
hf = [f for f in bm.faces if f.calc_center_median().z > top - 0.115 and not (f.calc_center_median().y < -0.045 and f.calc_center_median().z < top - 0.045)]
hb = bmesh.new(); vm = {}
for f in hf:
    vs = []
    for v in f.verts:
        if v.index not in vm: vm[v.index] = hb.verts.new(v.co + v.normal * 0.005)
        vs.append(vm[v.index])
    try: hb.faces.new(vs)
    except ValueError: pass
bm.free(); hm = bpy.data.meshes.new('mh_pelo'); hb.to_mesh(hm); hb.free(); hair = bpy.data.objects.new('mh_pelo', hm); scn.collection.objects.link(hair)
hm.materials.append(mat('mh_pelo', (0.12, 0.08, 0.05), 0.9))
for p in hm.polygons: p.use_smooth = True
hv = hair.vertex_groups.new(name='head'); hv.add(list(range(len(hm.vertices))), 1.0, 'REPLACE'); m2 = hair.modifiers.new('arm', 'ARMATURE'); m2.object = arm; hair.parent = arm
# ---- túnica: copia del torso, los brazos hasta medio brazo y los muslos, separada 1,4 cm, más una falda hasta la rodilla
knee = (J['lowerleg01.L____head'].z if 'lowerleg01.L____head' in J else 0.5); waist = J[B['spine05']['head']].z if 'spine05' in B else 1.0
def wsum(v, names): return sum(g.weight for g in v.groups if body.vertex_groups[g.group].name.startswith(names))
bm = bmesh.new(); bm.from_mesh(me); dl = bm.verts.layers.deform.active; vgn = {vg.index: vg.name for vg in body.vertex_groups}
def inside(v):
    if v.co.z < knee + 0.06 or v.co.z > top - 0.24: return False
    d = v[dl]; n = {vgn[i]: w for i, w in d.items()}
    lim = sum(w for k, w in n.items() if k.startswith(('lowerarm', 'wrist', 'finger', 'metacarpal', 'lowerleg', 'foot', 'toe', 'neck', 'head')))
    return lim < 0.25 and sum(w for k, w in n.items() if k.startswith('upperarm02')) < 0.5
tf = [f for f in bm.faces if all(inside(v) for v in f.verts)]
tb = bmesh.new(); vm = {}; tl = tb.verts.layers.deform.new()
for f in tf:
    vs = []
    for v in f.verts:
        if v.index not in vm:
            nv = tb.verts.new(v.co + v.normal * 0.014); nd = nv[tl]
            for i, w in v[dl].items(): nd[i] = w
            vm[v.index] = nv
        vs.append(vm[v.index])
    try: tb.faces.new(vs)
    except ValueError: pass
bm.free(); tme = bpy.data.meshes.new('mh_tunica'); tb.to_mesh(tme); tb.free(); tun = bpy.data.objects.new('mh_tunica', tme); scn.collection.objects.link(tun)
for vg in body.vertex_groups: tun.vertex_groups.new(name=vg.name)
# falda: un cono entre la cadera y la rodilla, que envuelve los dos muslos; pesos de la cadera y, abajo, de cada muslo según el lado
hipz = J[B['upperleg01.L']['head']].z; z0, z1 = knee + 0.02, hipz + 0.06; ring = 40; rows = 8; sb = bmesh.new(); grid = []
for j in range(rows + 1):
    t = j / rows; z = z0 + (z1 - z0) * t; row = []
    sel = P[body_idx]; sel = sel[(np.abs(sel[:, 0]) < 0.22) & (np.abs(sel[:, 1]) < 0.2)]; band = sel[np.abs(sel[:, 2] - z) < 0.03]   # solo el tronco y las piernas (no las manos)
    rx = (np.abs(band[:, 0]).max() if len(band) else 0.18) + 0.03 + 0.05 * (1 - t); ry = (np.abs(band[:, 1]).max() if len(band) else 0.12) + 0.03 + 0.04 * (1 - t)
    for i in range(ring):
        a = i / ring * 2 * math.pi; row.append(sb.verts.new((math.cos(a) * rx, math.sin(a) * ry, z)))
    grid.append(row)
for j in range(rows):
    for i in range(ring): sb.faces.new((grid[j][i], grid[j][(i + 1) % ring], grid[j + 1][(i + 1) % ring], grid[j + 1][i]))
sme = bpy.data.meshes.new('mh_falda'); sb.to_mesh(sme); sb.free(); sk = bpy.data.objects.new('mh_falda', sme); scn.collection.objects.link(sk)
G = {n: sk.vertex_groups.new(name=n) for n in ('root', 'upperleg01.L', 'upperleg01.R')}
for v in sme.vertices:
    t = (v.co.z - z0) / (z1 - z0); leg = 0.45 * (1 - t); side = min(1, max(0, 0.5 + v.co.x / 0.3))
    G['root'].add([v.index], 1 - leg, 'REPLACE'); G['upperleg01.L'].add([v.index], leg * side, 'REPLACE'); G['upperleg01.R'].add([v.index], leg * (1 - side), 'REPLACE')
cloth = mat('mh_lana', (0.6, 0.53, 0.4), 0.95)
for o in (tun, sk):
    o.data.materials.append(cloth)
    for p in o.data.polygons: p.use_smooth = True
    md = o.modifiers.new('arm', 'ARMATURE'); md.object = arm; o.parent = arm
# cinturón
bb = bmesh.new(); bmesh.ops.create_cone(bb, cap_ends=False, segments=40, radius1=1, radius2=1, depth=0.04)
for v in bb.verts:
    a = math.atan2(v.co.y, v.co.x); sel = P[body_idx]; sel = sel[(np.abs(sel[:, 0]) < 0.2) & (np.abs(sel[:, 1]) < 0.18)]; band = sel[np.abs(sel[:, 2] - waist) < 0.02]
    rx = np.abs(band[:, 0]).max() + 0.022; ry = np.abs(band[:, 1]).max() + 0.022; v.co = Vector((math.cos(a) * rx, math.sin(a) * ry, waist + v.co.z))
bme = bpy.data.meshes.new('mh_cinturon'); bb.to_mesh(bme); bb.free(); belt = bpy.data.objects.new('mh_cinturon', bme); scn.collection.objects.link(belt)
bme.materials.append(mat('mh_cuero', (0.25, 0.15, 0.08), 0.7)); belt.vertex_groups.new(name='spine05' if 'spine05' in B else 'root').add(list(range(len(bme.vertices))), 1.0, 'REPLACE')
mb = belt.modifiers.new('arm', 'ARMATURE'); mb.object = arm; belt.parent = arm
# ---- animaciones de Quaternius en este esqueleto
MAPMH = {'root': 'DEF-hips', 'spine04': 'DEF-spine.001', 'spine02': 'DEF-spine.002', 'spine01': 'DEF-spine.003', 'neck01': 'DEF-neck', 'head': 'DEF-head'}
for k in ('L', 'R'):
    MAPMH.update({'clavicle.' + k: 'DEF-shoulder.' + k, 'upperarm01.' + k: 'DEF-upper_arm.' + k, 'lowerarm01.' + k: 'DEF-forearm.' + k, 'wrist.' + k: 'DEF-hand.' + k,
                  'upperleg01.' + k: 'DEF-thigh.' + k, 'lowerleg01.' + k: 'DEF-shin.' + k, 'foot.' + k: 'DEF-foot.' + k})
MAPMH = {k: v for k, v in MAPMH.items() if k in ad.bones}
AIMMH = tuple(k for k in MAPMH if k.split('.')[0] in ('clavicle', 'upperarm01', 'lowerarm01', 'wrist', 'upperleg01', 'lowerleg01', 'foot'))
U.retarget(arm, 'mh_', bmap=MAPMH, aim=AIMMH, hip='root', thigh='upperleg01.L')
U.cleanup()
print('MH huesos', len(ad.bones), 'vértices cuerpo', len(me.vertices), 'túnica', len(tme.vertices))
# ---- exportar
bpy.ops.object.select_all(action='DESELECT'); arm.select_set(True)
for o in bpy.data.objects:
    if o.parent == arm: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_skins=True, export_animations=True, export_animation_mode='NLA_TRACKS', use_selection=True, export_yup=True)
print('GLB', OUT, os.path.getsize(OUT))
