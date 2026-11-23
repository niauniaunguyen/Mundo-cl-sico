# Criaturas de los portales de leyenda, esculpidas con código → modelos/criaturas.glb
#   /opt/bvenv/bin/python -I herramientas/blender/criaturas.py [-- vista.png]
# (Hace falta scikit-image en ese Python: /opt/bvenv/bin/pip install scikit-image.)
# Hechas a mano con código (sin modelos ajenos), con herramientas/blender/criaturas_lib.py: formas anatómicas fundidas (SDF),
# superficie por marching cubes, aligeradas en Blender y con la textura pintada sobre el propio modelo (1024 px).
# Piezas (el juego anima girando las piezas sobre su origen):
#   CR_leon_cuerpo (cabeza, melena y tronco), CR_leon_pDI/pDD/pTI/pTD (patas delanteras y traseras, origen en el hombro/cadera), CR_leon_cola
#   CR_ave_cuerpo, CR_ave_aI/aD (alas, origen en el hombro), CR_ave_cola                 (ave del Estínfalo)
#   CR_mino_cabeza (cabeza de toro para el Minotauro; se pone sobre el cuerpo humano de Blender del juego, origen en el cuello)
# Mira hacia +Z en el juego (-Y en Blender), arriba +Y (+Z en Blender). Medidas reales en metros.
import bpy, bmesh, sys, os, math, numpy as np
from mathutils import Vector
AQ = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQ)
import criaturas_lib as L
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
PREV = args[0] if args else None
ONLY = args[1].split(',') if len(args) > 1 else None
OUT = os.path.join(AQ, '..', '..', 'modelos', 'criaturas.glb')
TMP = os.path.join(AQ, '..', '..', 'modelos', '_criaturas_tex'); os.makedirs(TMP, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
SC = bpy.context.scene
TEX = 1024

def g2b(v):  # del juego a Blender
    return np.stack([v[:, 0], -v[:, 2], v[:, 1]], -1)
def b2g(v):
    return np.stack([v[:, 0], v[:, 2], -v[:, 1]], -1)

def make_part(name, sdf, lo, hi, step, pivot, tris, parent=None):
    v, f = L.mesh_from_sdf(sdf, lo, hi, step)
    v = v - np.asarray(pivot)
    me = bpy.data.meshes.new(name); me.from_pydata(g2b(v).tolist(), [], f.tolist()); me.update()
    ob = bpy.data.objects.new(name, me); SC.collection.objects.link(ob); ob.location = Vector(g2b(np.asarray([pivot], float))[0])
    if parent: ob.parent = parent; ob.location = ob.location - parent.location
    bpy.context.view_layer.objects.active = ob; bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True)
    n = len(me.polygons)
    if n > tris:
        m = ob.modifiers.new('d', 'DECIMATE'); m.ratio = tris / n; bpy.ops.object.modifier_apply(modifier='d')
    for p in ob.data.polygons: p.use_smooth = True
    print('PIEZA', name, 'tris', len(ob.data.polygons))
    return ob

def paint(obs, name, colf, rough=0.85, spec=0.15):
    """une UV de todas las piezas en un solo mapa y pinta la textura con colf(pos_juego_mundo, normal_juego)"""
    bpy.ops.object.select_all(action='DESELECT')
    for o in obs: o.select_set(True)
    bpy.context.view_layer.objects.active = obs[0]
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.004); bpy.ops.object.mode_set(mode='OBJECT')
    UV = []; POS = []; NOR = []; TRI = []; off = 0
    for o in obs:
        me = o.data; me.calc_loop_triangles(); mw = o.matrix_world; nm = mw.to_3x3()
        uvl = me.uv_layers.active.data
        uv = np.array([uvl[i].uv[:] for i in range(len(me.loops))])
        pos = np.array([(mw @ me.vertices[l.vertex_index].co)[:] for l in me.loops])
        nor = np.array([(nm @ me.vertices[l.vertex_index].normal)[:] for l in me.loops])
        tri = np.array([t.loops[:] for t in me.loop_triangles]) + off
        UV.append(uv); POS.append(b2g(pos)); NOR.append(b2g(nor)); TRI.append(tri); off += len(uv)
    img = L.bake(np.concatenate(UV), np.concatenate(POS), np.concatenate(NOR), np.concatenate(TRI), colf, S=TEX)
    im = bpy.data.images.new(name, TEX, TEX); px = np.ones((TEX, TEX, 4), np.float32); px[..., :3] = img[::-1]; im.pixels = px.ravel()
    path = os.path.join(TMP, name + '.png'); im.filepath_raw = path; im.file_format = 'PNG'; im.save()
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; bs = nt.nodes['Principled BSDF']
    tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = im; nt.links.new(tx.outputs['Color'], bs.inputs['Base Color'])
    bs.inputs['Roughness'].default_value = rough
    try: bs.inputs['Specular IOR Level'].default_value = spec
    except Exception: pass
    for o in obs:
        o.data.materials.clear(); o.data.materials.append(m)
    return m

def eyes(parent, pts, r, col):
    m = bpy.data.materials.new('ojo_' + parent.name); m.use_nodes = True; bs = m.node_tree.nodes['Principled BSDF']
    bs.inputs['Base Color'].default_value = col; bs.inputs['Roughness'].default_value = 0.4
    for i, p in enumerate(pts):
        bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=14, v_segments=10, radius=r)
        me = bpy.data.meshes.new('ojo%d' % i); bm.to_mesh(me); bm.free(); me.materials.append(m)
        for pl in me.polygons: pl.use_smooth = True
        o = bpy.data.objects.new(parent.name + '_ojo%d' % i, me); SC.collection.objects.link(o)
        o.location = Vector(g2b(np.asarray([p], float))[0]) - parent.matrix_world.translation; o.parent = parent
    mp = bpy.data.materials.new('pupila_' + parent.name); mp.use_nodes = True; bp = mp.node_tree.nodes['Principled BSDF']; bp.inputs['Base Color'].default_value = (0.02, 0.015, 0.01, 1); bp.inputs['Roughness'].default_value = 0.1
    for i, p in enumerate(pts):
        bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=10, v_segments=8, radius=r * 0.45)
        me = bpy.data.meshes.new('pu%d' % i); bm.to_mesh(me); bm.free(); me.materials.append(mp)
        o = bpy.data.objects.new(parent.name + '_ojop%d' % i, me); SC.collection.objects.link(o)
        q = np.asarray([p], float) + np.asarray([[0, 0, r * 0.7]]); o.scale = (1, 1, 0.5)
        o.location = Vector(g2b(q)[0]) - parent.matrix_world.translation; o.parent = parent
    # se unen al cuerpo (una sola malla con dos materiales)
    bpy.ops.object.select_all(action='DESELECT')
    for o in parent.children:
        if '_ojo' in o.name: o.select_set(True)
    parent.select_set(True); bpy.context.view_layer.objects.active = parent; bpy.ops.object.join()

def mix(a, b, t):
    t = np.clip(t, 0, 1)[..., None]; return a * (1 - t) + b * t
def sm(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
C = lambda *c: np.array(c, float)

# ==================================================================== EL LEÓN DE NEMEA
# Panthera leo, macho adulto: unos 2,5 m del hocico al nacimiento de la cola (+0,9 m de cola), 1,15 m a la cruz, 190 kg.
# El león del mito es más grande y de piel invulnerable (Apolodoro II 5,1); aquí, un poco más grande que uno real (×1,15).
LEON_MANE_C = (0, 1.3, 0.8)
def leon_body(P):
    d = L.sd_ellipsoid(P, (0, 1.02, 0.05), (0.31, 0.34, 0.78))                      # tronco
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.98, 0.42), (0.33, 0.42, 0.42)), 0.12)     # pecho hondo
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.04, -0.52), (0.30, 0.34, 0.38)), 0.12)    # grupa
    d = L.smin(d, L.sd_ellipsoid(P, (0.17, 1.02, 0.52), (0.13, 0.26, 0.2)), 0.08)   # paletillas
    d = L.smin(d, L.sd_ellipsoid(P, (-0.17, 1.02, 0.52), (0.13, 0.26, 0.2)), 0.08)
    d = L.smin(d, L.sd_ellipsoid(P, (0.16, 0.98, -0.55), (0.15, 0.3, 0.26)), 0.08)  # muslos
    d = L.smin(d, L.sd_ellipsoid(P, (-0.16, 0.98, -0.55), (0.15, 0.3, 0.26)), 0.08)
    d = L.smax(d, -(P[:, 1] - 0.62 - 0.12 * np.clip(-P[:, 2] * 0.6, 0, 1)), 0.08)  # vientre recogido hacia atrás
    d = L.smin(d, L.sd_capsule(P, (0, 1.12, 0.55), (0, 1.3, 0.95), 0.25, 0.2), 0.1)  # cuello
    # cabeza: cráneo, hocico ancho, nariz, mandíbula, carrillos, orejas redondas
    h = L.sd_ellipsoid(P, (0, 1.36, 1.1), (0.21, 0.18, 0.22))
    h = L.smin(h, L.sd_ellipsoid(P, (0, 1.27, 1.3), (0.155, 0.12, 0.16)), 0.07)       # hocico ancho y cuadrado
    h = L.smin(h, L.sd_capsule(P, (0, 1.4, 1.16), (0, 1.33, 1.43), 0.085, 0.075), 0.06)  # caña de la nariz, ancha y recta
    h = L.smin(h, L.sd_ellipsoid(P, (0, 1.32, 1.46), (0.06, 0.04, 0.03)), 0.02)      # trufa
    h = L.smin(h, L.sd_ellipsoid(P, (0, 1.15, 1.26), (0.12, 0.065, 0.15)), 0.05)
    h = L.smin(h, L.sd_ellipsoid(P, (0, 1.46, 1.12), (0.16, 0.05, 0.12)), 0.06)      # frente plana
    for s in (-1, 1):
        h = L.smin(h, L.sd_ellipsoid(P, (s * 0.09, 1.24, 1.36), (0.065, 0.06, 0.07)), 0.03)   # almohadillas de los bigotes
        h = L.smin(h, L.sd_ellipsoid(P, (s * 0.15, 1.52, 1.02), (0.06, 0.06, 0.03)), 0.03)    # orejas
        h = L.smax(h, -L.sd_ellipsoid(P, (s * 0.09, 1.405, 1.29), (0.035, 0.022, 0.03)), 0.015)  # cuencas de los ojos
        h = L.smin(h, L.sd_capsule(P, (s * 0.05, 1.445, 1.27), (s * 0.13, 1.44, 1.22), 0.02, 0.015), 0.02)  # arco de las cejas
    d = L.smin(d, h, 0.06)
    # melena: una masa alrededor del cuello y la cabeza, con mechones (ruido estirado hacia atrás) y algo de pelo en el pecho
    mp = P - np.asarray(LEON_MANE_C)
    m = L.sd_ellipsoid(P, LEON_MANE_C, (0.4, 0.44, 0.38))
    m = L.smin(m, L.sd_ellipsoid(P, (0, 1.0, 0.68), (0.24, 0.32, 0.2)), 0.1)
    m = L.smax(m, -L.sd_ellipsoid(P, (0, 1.3, 1.3), (0.25, 0.33, 0.3)), 0.05)        # la cara queda libre
    rr = np.linalg.norm(mp, axis=-1, keepdims=True) + 1e-6; dr = mp / rr        # mechones: ruido fino de lado, largo hacia fuera
    sh = L.fbm(np.concatenate([dr * 9.0, rr * 2.5], -1)[:, [0, 1, 3]] + dr[:, 2:3] * 7, 4, 3)
    m = m - 0.07 * (sh - 0.45) * 2.0 - 0.008 * (L.fbm(P * 40, 2, 21) - 0.5)
    return L.smin(d, m, 0.05)

def leon_leg(P, front, s):
    x = s * 0.19
    if front:
        d = L.sd_chain(P, [(x, 1.0, 0.5), (x, 0.6, 0.42), (x * 1.02, 0.2, 0.5), (x * 1.04, 0.08, 0.58)], [0.17, 0.13, 0.1, 0.095])
        return L.smin(d, L.sd_ellipsoid(P, (x, 0.78, 0.47), (0.12, 0.24, 0.14)), 0.06)   # antebrazo musculoso
    d = L.sd_chain(P, [(x, 1.02, -0.55), (x, 0.6, -0.4), (x, 0.36, -0.68), (x, 0.09, -0.6), (x, 0.07, -0.5)], [0.19, 0.13, 0.085, 0.08, 0.085])
    return L.smin(d, L.sd_ellipsoid(P, (x, 0.8, -0.5), (0.15, 0.27, 0.24)), 0.07)   # muslo
    return d

def leon_paw(P, front, s):
    x = s * 0.19 * (1.04 if front else 1.0); z = 0.62 if front else -0.5
    d = L.sd_ellipsoid(P, (x, 0.07, z), (0.11, 0.07, 0.13))
    for k in (-1.5, -0.5, 0.5, 1.5):                                          # dedos
        d = L.smin(d, L.sd_ellipsoid(P, (x + k * 0.045, 0.045, z + 0.1), (0.032, 0.04, 0.045)), 0.025)
    return d

def leon_tail(P):
    d = L.sd_chain(P, [(0, 1.05, -0.86), (0, 0.85, -1.15), (0, 0.6, -1.4), (0, 0.48, -1.72)], [0.06, 0.045, 0.038, 0.032])
    return L.smin(d, L.sd_ellipsoid(P, (0, 0.46, -1.8), (0.06, 0.07, 0.12)) - 0.02 * L.fbm(P * 30, 2, 9), 0.03)

def leon_col(P, N):
    base = C(0.74, 0.55, 0.31); cream = C(0.88, 0.79, 0.62); dark = C(0.22, 0.13, 0.07)
    col = np.tile(base, (len(P), 1))
    col = mix(col, cream, sm(-N[:, 1], 0.2, 0.75) * sm(1.15 - P[:, 1], 0.0, 0.35) * sm(P[:, 1], 0.45, 0.65))                    # vientre y pecho claros
    col = mix(col, C(0.66, 0.48, 0.27), sm(P[:, 1], 1.1, 1.3))                                         # lomo algo más oscuro
    md = np.linalg.norm((P - np.asarray(LEON_MANE_C)) / np.asarray((0.4, 0.44, 0.38)), axis=-1)
    face = np.linalg.norm((P - np.asarray((0, 1.3, 1.3))) / np.asarray((0.25, 0.33, 0.3)), axis=-1)
    mane = sm(1.12 - md, 0, 0.12) * sm(face - 0.95, 0, 0.12) + sm(0.3 - np.linalg.norm((P - np.asarray((0, 1.0, 0.68))) / np.asarray((0.24, 0.32, 0.2)), axis=-1) + 0.75, 0, 0.1) * 0.8
    mc = mix(np.tile(C(0.55, 0.36, 0.18), (len(P), 1)), C(0.16, 0.09, 0.05), sm(-(P[:, 2] - LEON_MANE_C[2]), -0.15, 0.3) + 0.35 * sm(md, 0.7, 1.1))
    col = mix(col, mc, mane)
    mz = np.linalg.norm((P - np.asarray((0, 1.21, 1.38))) / np.asarray((0.12, 0.08, 0.1)), axis=-1)
    col = mix(col, C(0.86, 0.78, 0.64), sm(1.1 - mz, 0, 0.4) * 0.8)                                            # hocico y barbilla blancos
    nose = sm(P[:, 2], 1.465, 1.48) * sm(P[:, 1], 1.285, 1.3) * sm(1.345 - P[:, 1], 0, 0.01) * sm(0.055 - np.abs(P[:, 0]) + (P[:, 1] - 1.3) * 0.5, 0, 0.01)
    col = mix(col, C(0.55, 0.3, 0.27), nose)                                                            # trufa
    col = mix(col, C(0.2, 0.12, 0.08), nose * sm(np.abs(P[:, 0]), 0.045, 0.06))                        # orificios
    col = mix(col, dark, sm(0.012 - np.abs(P[:, 1] - 1.185), 0, 0.008) * sm(P[:, 2], 1.3, 1.4))        # comisura de los labios
    for s in (-1, 1):
        col = mix(col, C(0.18, 0.11, 0.07), sm(0.05 - np.linalg.norm(P - np.asarray((s * 0.09, 1.405, 1.262)), axis=-1), 0, 0.012))   # contorno oscuro de los ojos
        col = mix(col, C(0.95, 0.92, 0.86), sm(0.04 - np.linalg.norm(P - np.asarray((s * 0.085, 1.37, 1.29)), axis=-1), 0, 0.015) * 0.35)  # mancha clara bajo el ojo
    for s in (-1, 1):
        col = mix(col, dark, sm(0.045 - np.linalg.norm(P - np.asarray((s * 0.15, 1.53, 1.0)), axis=-1), 0, 0.02) * sm(-N[:, 2], -0.2, 0.3))  # dorso de las orejas
    col = mix(col, C(0.12, 0.08, 0.05), sm(-P[:, 2] - 1.72, 0, 0.06))                                    # borla de la cola
    col = mix(col, col * 0.82, sm(0.12 - P[:, 1], 0, 0.06))                                             # patas: almohadillas más oscuras
    # pelo: vetas finas a lo largo del cuerpo y moteado suave
    st = L.fbm(np.stack([P[:, 0] * 120, P[:, 1] * 120, P[:, 2] * 22], -1), 3, 5)
    mot = L.fbm(P * 7, 3, 11)
    col = col * (0.84 + 0.3 * st[:, None]) * (0.92 + 0.16 * mot[:, None])
    return np.clip(col, 0, 1)

def build_leon():
    root = bpy.data.objects.new('CR_leon', None); SC.collection.objects.link(root)
    body = make_part('CR_leon_cuerpo', leon_body, (-0.6, 0.45, -1.05), (0.6, 1.9, 1.65), 0.013, (0, 0, 0), 26000, root)
    eyes(body, [(-0.09, 1.405, 1.258), (0.09, 1.405, 1.258)], 0.022, (0.55, 0.3, 0.04, 1))
    parts = [body]
    for nm, front, s, pv in (('pDI', True, -1, (-0.19, 1.0, 0.5)), ('pDD', True, 1, (0.19, 1.0, 0.5)), ('pTI', False, -1, (-0.19, 1.02, -0.55)), ('pTD', False, 1, (0.19, 1.02, -0.55))):
        fn = (lambda F, S: (lambda P: L.smin(leon_leg(P, F, S), leon_paw(P, F, S), 0.03)))(front, s)
        x0 = s * 0.19
        parts.append(make_part('CR_leon_' + nm, fn, (x0 - 0.2, -0.02, (0.25 if front else -0.95)), (x0 + 0.2, 1.2, (0.8 if front else -0.25)), 0.011, pv, 5000, root))
    parts.append(make_part('CR_leon_cola', leon_tail, (-0.12, 0.35, -1.98), (0.12, 1.15, -0.78), 0.011, (0, 1.05, -0.86), 2500, root))
    paint(parts, 'leon_piel', leon_col)
    return root

# ==================================================================== AVE DEL ESTÍNFALO
# Pausanias (VIII 22,4) dice que eran del tamaño de una grulla y parecidas al ibis, pero con el pico más fuerte y recto; Apolonio
# (II 1030-1089) cuenta que soltaban plumas como dardos. Aquí: zancuda de 1,2 m, 2,3 m de envergadura, plumaje de bronce oscuro,
# pico, uñas y remeras de bronce (el juego les da un material algo metálico).
def ave_body(P):
    d = L.sd_ellipsoid(P, (0, 0, 0), (0.17, 0.16, 0.34))                                    # cuerpo
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.02, 0.18), (0.14, 0.15, 0.16)), 0.06)              # pechuga
    d = L.smin(d, L.sd_chain(P, [(0, 0.05, 0.26), (0, 0.16, 0.46), (0, 0.2, 0.66), (0, 0.22, 0.82)], [0.07, 0.05, 0.045, 0.045]), 0.05)   # cuello
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.24, 0.88), (0.055, 0.06, 0.08)), 0.03)            # cabeza
    d = L.smin(d, L.sd_capsule(P, (0, 0.23, 0.93), (0, 0.19, 1.28), 0.026, 0.004), 0.015)   # pico largo y recto
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.27, 0.86), (0.03, 0.04, 0.06)) - 0.01 * L.fbm(P * 60, 2, 4), 0.02)   # cresta corta
    t = L.sd_ellipsoid(P, (0, 0.03, -0.42), (0.14, 0.03, 0.2))                               # cola en abanico
    d = L.smin(d, t, 0.05)
    for s in (-1, 1):                                                                        # patas largas, recogidas hacia atrás en vuelo
        d = L.smin(d, L.sd_chain(P, [(s * 0.07, -0.08, -0.05), (s * 0.07, -0.14, -0.2), (s * 0.06, -0.12, -0.75), (s * 0.06, -0.12, -0.9)], [0.035, 0.022, 0.014, 0.012]), 0.03)
        for k in (-1, 0, 1):                                                                 # dedos con uñas de bronce
            d = L.smin(d, L.sd_capsule(P, (s * 0.06, -0.12, -0.9), (s * 0.06 + k * 0.04, -0.13, -1.0), 0.01, 0.004), 0.01)
    return d - 0.006 * (L.fbm(P * 45, 2, 7) - 0.5)

def ave_wing(P, s):
    # ala extendida a lo largo de x; el borde de salida hecho de remeras (festón)
    x = P[:, 0] * s
    d = L.sd_ellipsoid(P, (s * 0.6, 0.0, -0.02), (0.62, 0.035, 0.24))
    d = L.smin(d, L.sd_ellipsoid(P, (s * 0.16, 0.0, 0.0), (0.18, 0.05, 0.2)), 0.08)
    fest = 0.03 * np.abs(np.sin(x * 22))                                                     # puntas de las remeras
    d = d + fest * L.sm_np(-P[:, 2], 0.05, 0.2) if hasattr(L, 'sm_np') else d + fest * np.clip((-P[:, 2] - 0.05) / 0.15, 0, 1)
    d = L.smax(d, -(P[:, 0] * s), 0.01)                                                      # nada por dentro del hombro
    return d

def ave_col(P, N):
    br = C(0.36, 0.25, 0.13); dk = C(0.12, 0.1, 0.08); gold = C(0.72, 0.5, 0.22)
    col = mix(np.tile(dk, (len(P), 1)), br, L.fbm(P * 6, 3, 2))
    # plumas: escamas en el cuerpo y bandas en las alas
    sc = L.fbm(np.stack([P[:, 0] * 60, P[:, 1] * 60, P[:, 2] * 140], -1), 2, 13)
    col = col * (0.82 + 0.3 * sc[:, None])
    wing = np.clip((np.abs(P[:, 0]) - 0.22) / 0.1, 0, 1)
    band = np.clip(np.abs(np.sin(np.abs(P[:, 0]) * 22)), 0, 1)
    col = mix(col, gold * (0.7 + 0.3 * band[:, None]), wing * np.clip((-P[:, 2] + 0.02) / 0.1, 0, 1) * 0.95)   # remeras de bronce
    beak = np.clip((P[:, 2] - 0.95) / 0.03, 0, 1) * (np.abs(P[:, 0]) < 0.05)
    col = mix(col, gold, beak)
    claw = np.clip((-P[:, 2] - 0.92) / 0.03, 0, 1) * (P[:, 1] < -0.1)
    col = mix(col, gold, claw)
    col = mix(col, C(0.55, 0.12, 0.06), np.clip(1 - np.linalg.norm((P - np.asarray((0, 0.27, 0.86))) / np.asarray((0.035, 0.045, 0.065)), axis=-1), 0, 1) * 1.5)   # cresta rojiza
    return np.clip(col, 0, 1)

def build_ave():
    root = bpy.data.objects.new('CR_ave', None); SC.collection.objects.link(root); root.location = (0, 0, 0)
    body = make_part('CR_ave_cuerpo', ave_body, (-0.25, -0.3, -1.1), (0.25, 0.4, 1.35), 0.009, (0, 0, 0), 9000, root)
    eyes(body, [(-0.035, 0.255, 0.92), (0.035, 0.255, 0.92)], 0.011, (0.7, 0.15, 0.05, 1))
    wi = make_part('CR_ave_aI', lambda P: ave_wing(P, -1), (-1.3, -0.08, -0.32), (0.02, 0.08, 0.3), 0.009, (-0.1, 0.05, 0.05), 4000, root)
    wd = make_part('CR_ave_aD', lambda P: ave_wing(P, 1), (-0.02, -0.08, -0.32), (1.3, 0.08, 0.3), 0.009, (0.1, 0.05, 0.05), 4000, root)
    m = paint([body, wi, wd], 'ave_bronce', ave_col, rough=0.45)
    try: m.node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value = 0.55
    except Exception: pass
    root.location = (3.5, 0, 1.2)
    return root

# ==================================================================== CABEZA DEL MINOTAURO (toro)
# Cabeza de toro sobre cuerpo humano, como en los vasos áticos (p. ej. el kílix de Aison, h. 420 a.C., con Teseo arrastrándolo).
# Toro de la Edad del Bronce (uro domesticado), con cuernos en lira. Origen en la base del cuello (donde acaba el cuello humano).
def mino_head(P):
    d = L.sd_capsule(P, (0, 0.0, -0.02), (0, 0.2, 0.08), 0.15, 0.17)                         # cuello ancho y morrillo
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.3, 0.1), (0.17, 0.17, 0.2)), 0.08)                 # testuz
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.36, 0.14), (0.19, 0.12, 0.14)), 0.06)             # frente ancha y plana
    d = L.smin(d, L.sd_capsule(P, (0, 0.32, 0.2), (0, 0.22, 0.44), 0.12, 0.095), 0.05)       # cara larga y recta
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.19, 0.47), (0.11, 0.08, 0.065)), 0.035)           # morro ancho
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.13, 0.38), (0.07, 0.035, 0.1)), 0.03)             # mandíbula
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.0, 0.08), (0.08, 0.14, 0.08)), 0.06)              # papada, bajo el cuello
    for s in (-1, 1):
        d = L.smax(d, -L.sd_ellipsoid(P, (s * 0.05, 0.2, 0.53), (0.022, 0.018, 0.03)), 0.01)   # ollares
        d = L.smin(d, L.sd_ellipsoid(P, (s * 0.2, 0.36, 0.08), (0.09, 0.03, 0.05)), 0.03)        # orejas de lado
        d = L.smax(d, -L.sd_ellipsoid(P, (s * 0.13, 0.33, 0.22), (0.025, 0.022, 0.03)), 0.012)   # cuencas, a los lados
        d = L.smin(d, L.sd_ellipsoid(P, (s * 0.13, 0.36, 0.21), (0.035, 0.018, 0.035)), 0.02)       # arco sobre el ojo
        # cuernos en lira: salen de lado, se curvan hacia arriba y adelante
        hp = [(s * 0.13, 0.44, 0.1), (s * 0.27, 0.47, 0.11), (s * 0.37, 0.56, 0.17), (s * 0.39, 0.69, 0.26), (s * 0.34, 0.78, 0.34)]
        d = L.smin(d, L.sd_chain(P, hp, [0.055, 0.045, 0.034, 0.022, 0.006]), 0.02)
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.45, 0.1), (0.11, 0.06, 0.08)) - 0.025 * L.fbm(P * 25, 3, 5), 0.03)   # tupé rizado de la testuz
    return d - 0.004 * (L.fbm(P * 60, 2, 8) - 0.5)

def mino_col(P, N):
    hair = C(0.16, 0.1, 0.07); col = mix(np.tile(hair, (len(P), 1)), C(0.26, 0.17, 0.11), L.fbm(P * 8, 3, 3))
    st = L.fbm(np.stack([P[:, 0] * 90, P[:, 1] * 25, P[:, 2] * 90], -1), 3, 5)
    col = col * (0.8 + 0.35 * st[:, None])
    muz = np.clip(1 - np.linalg.norm((P - np.asarray((0, 0.19, 0.5))) / np.asarray((0.13, 0.1, 0.08)), axis=-1), 0, 1)
    col = mix(col, C(0.42, 0.36, 0.34), muz * 1.6)                                                     # morro gris rosado
    horn = np.clip((np.abs(P[:, 0]) - 0.19) / 0.05, 0, 1) * np.clip((P[:, 1] - 0.42) / 0.03, 0, 1)
    tip = np.clip((P[:, 1] - 0.66) / 0.12, 0, 1); base = np.clip((0.3 - np.abs(P[:, 0])) / 0.08, 0, 1)
    hc = mix(mix(np.tile(C(0.78, 0.74, 0.62), (len(P), 1)), C(0.35, 0.32, 0.28), base), C(0.1, 0.09, 0.08), tip)
    hc = hc * (0.95 + 0.05 * np.sin(np.linalg.norm(P[:, :2], axis=-1) * 160)[:, None])   # anillos del cuerno
    col = mix(col, hc, horn)        # cuerno: marfil y punta oscura
    return np.clip(col, 0, 1)

def build_mino():
    root = bpy.data.objects.new('CR_mino', None); SC.collection.objects.link(root)
    hd = make_part('CR_mino_cabeza', mino_head, (-0.5, -0.2, -0.25), (0.5, 0.9, 0.65), 0.008, (0, 0, 0), 14000, root)
    eyes(hd, [(-0.132, 0.33, 0.232), (0.132, 0.33, 0.232)], 0.018, (0.28, 0.06, 0.03, 1))
    paint([hd], 'mino_pelo', mino_col, rough=0.7)
    root.location = (-3.5, 0, 1.0)
    return root

# ==================================================================== CUADRÚPEDOS (constructor común)
# spec: body(P) -> sdf del tronco, cuello y cabeza; legs: 4 x (puntos, radios) del hombro/cadera al casco o la pata (el primero es el
# pivote); foot: 'pezuna' o 'pata'; tail: (puntos, radios) o función; col(P, N); eyes: (puntos, radio, color); lo/hi: caja del cuerpo
def foot_sdf(P, p, kind, r):
    if kind == 'pezuna':
        return L.sd_capsule(P, (p[0], p[1] + 0.02, p[2]), (p[0], 0.015, p[2] + 0.02), r * 0.95, r * 1.05)
    d = L.sd_ellipsoid(P, (p[0], 0.05, p[2] + 0.04), (r * 1.25, r * 0.8, r * 1.5))
    for k in (-1.5, -0.5, 0.5, 1.5):
        d = L.smin(d, L.sd_ellipsoid(P, (p[0] + k * r * 0.55, 0.035, p[2] + r * 1.4), (r * 0.38, r * 0.45, r * 0.5)), r * 0.3)
    return d

def build_quad(key, spec):
    root = bpy.data.objects.new('CR_' + key, None); SC.collection.objects.link(root)
    body = make_part('CR_%s_cuerpo' % key, spec['body'], spec['lo'], spec['hi'], spec.get('step', 0.012), (0, 0, 0), spec.get('tris', 16000), root)
    if spec.get('eyes'):
        e = spec['eyes']; eyes(body, e[0], e[1], e[2])
    parts = [body]
    for nm, (pts, rads) in zip(('pDI', 'pDD', 'pTI', 'pTD'), spec['legs']):
        fn = (lambda PT, RD: (lambda P: L.smin(L.sd_chain(P, PT, RD), foot_sdf(P, PT[-1], spec['foot'], RD[-1]), 0.02)))(pts, rads)
        xs = [q[0] for q in pts]; zs = [q[2] for q in pts]; mr = max(rads) + 0.08
        parts.append(make_part('CR_%s_%s' % (key, nm), fn, (min(xs) - mr, -0.02, min(zs) - mr - 0.05), (max(xs) + mr, pts[0][1] + mr, max(zs) + mr + 0.12), spec.get('lstep', 0.01), pts[0], spec.get('ltris', 2500), root))
    if spec.get('tail'):
        tf, tlo, thi, tpv = spec['tail']
        parts.append(make_part('CR_%s_cola' % key, tf, tlo, thi, 0.01, tpv, spec.get('ttris', 2000), root))
    for ex in spec.get('extra', []):
        nm, fn, lo, hi, pv, tr = ex; parts.append(make_part('CR_%s_%s' % (key, nm), fn, lo, hi, 0.01, pv, tr, root))
    paint(parts, key + '_piel', spec['col'], rough=spec.get('rough', 0.8))
    return root

def hair(P, k=110, sk=22, seed=5):
    return L.fbm(np.stack([P[:, 0] * k, P[:, 1] * k, P[:, 2] * sk], -1), 3, seed)

def dist(P, c, r):
    return np.linalg.norm((P - np.asarray(c)) / np.asarray(r), axis=-1)

# ---- LA CIERVA DE CERINEA: cierva roja (Cervus elaphus), con cuernos de oro y pezuñas de bronce (Píndaro, Olímpica III 29;
# Calímaco, Himno a Ártemis 100-109). Las ciervas no tienen cuernas: el mito se los da, y el juego también.
def cierva_body(P):
    d = L.sd_ellipsoid(P, (0, 1.05, 0), (0.21, 0.25, 0.58))
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.0, 0.33), (0.21, 0.3, 0.3)), 0.1)
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.06, -0.42), (0.21, 0.26, 0.28)), 0.1)
    d = L.smax(d, -(P[:, 1] - 0.8), 0.08)
    d = L.smin(d, L.sd_capsule(P, (0, 1.12, 0.42), (0, 1.55, 0.7), 0.12, 0.075), 0.08)
    h = L.sd_ellipsoid(P, (0, 1.62, 0.8), (0.075, 0.085, 0.13))
    h = L.smin(h, L.sd_ellipsoid(P, (0, 1.55, 0.97), (0.045, 0.05, 0.085)), 0.04)
    for s in (-1, 1):
        h = L.smin(h, L.sd_capsule(P, (s * 0.05, 1.7, 0.75), (s * 0.13, 1.8, 0.7), 0.03, 0.02), 0.02)          # orejas grandes
        h = L.smin(h, L.sd_chain(P, [(s * 0.04, 1.7, 0.78), (s * 0.11, 1.92, 0.72), (s * 0.18, 2.14, 0.64), (s * 0.2, 2.34, 0.7)], [0.022, 0.018, 0.014, 0.008]), 0.012)   # cuerna de oro
        for a, b in (((s * 0.09, 1.86, 0.74), (s * 0.12, 1.92, 0.9)), ((s * 0.17, 2.1, 0.65), (s * 0.2, 2.18, 0.8)), ((s * 0.19, 2.25, 0.66), (s * 0.27, 2.36, 0.62))):
            h = L.smin(h, L.sd_capsule(P, a, b, 0.012, 0.005), 0.008)                                         # puntas
    return L.smin(d, h, 0.04) - 0.003 * (hair(P) - 0.5)

def cierva_col(P, N):
    col = np.tile(C(0.58, 0.36, 0.2), (len(P), 1))
    col = mix(col, C(0.86, 0.78, 0.64), np.clip(-N[:, 1] * 1.5, 0, 1) * (P[:, 1] > 0.75) * (P[:, 1] < 1.2))
    col = mix(col, C(0.92, 0.88, 0.8), np.clip(1.2 - dist(P, (0, 1.05, -0.68), (0.14, 0.18, 0.1)), 0, 1))      # espejo blanco de la grupa
    col = mix(col, col * 0.75, np.clip((0.6 - P[:, 1]) / 0.3, 0, 1))                                          # patas más oscuras
    gold = (P[:, 1] > 1.72) & (np.abs(P[:, 0]) > 0.02) & (np.abs(P[:, 0]) < 0.3) & (P[:, 2] < 0.95)
    col = mix(col, C(0.9, 0.68, 0.26) * (0.85 + 0.25 * L.fbm(P * 40, 2, 3))[:, None], gold & ~((P[:, 1] < 1.84) & (np.abs(P[:, 0]) > 0.09) & (P[:, 2] < 0.74)))
    col = mix(col, C(0.72, 0.52, 0.24), np.clip((0.1 - P[:, 1]) / 0.05, 0, 1))                                # pezuñas de bronce
    col = mix(col, C(0.08, 0.06, 0.05), np.clip(1.2 - dist(P, (0, 1.55, 1.05), (0.03, 0.03, 0.02)), 0, 1))   # nariz
    return np.clip(col * (0.86 + 0.26 * hair(P)[:, None]), 0, 1)

CIERVA = dict(body=cierva_body, lo=(-0.4, 0.6, -0.8), hi=(0.4, 2.45, 1.15), col=cierva_col, foot='pezuna', tris=16000,
  eyes=([(-0.062, 1.65, 0.86), (0.062, 1.65, 0.86)], 0.018, (0.05, 0.03, 0.02, 1)),
  legs=[([(-0.11, 1.0, 0.34), (-0.11, 0.62, 0.32), (-0.11, 0.3, 0.35), (-0.11, 0.06, 0.37)], [0.085, 0.05, 0.032, 0.03]),
        ([(0.11, 1.0, 0.34), (0.11, 0.62, 0.32), (0.11, 0.3, 0.35), (0.11, 0.06, 0.37)], [0.085, 0.05, 0.032, 0.03]),
        ([(-0.11, 1.05, -0.45), (-0.11, 0.72, -0.32), (-0.11, 0.48, -0.56), (-0.11, 0.06, -0.5)], [0.12, 0.06, 0.034, 0.03]),
        ([(0.11, 1.05, -0.45), (0.11, 0.72, -0.32), (0.11, 0.48, -0.56), (0.11, 0.06, -0.5)], [0.12, 0.06, 0.034, 0.03])],
  tail=(lambda P: L.sd_chain(P, [(0, 1.18, -0.66), (0, 1.1, -0.74), (0, 1.0, -0.76)], [0.045, 0.04, 0.02]), (-0.12, 0.9, -0.85), (0.12, 1.3, -0.6), (0, 1.18, -0.66)))

# ---- EL JABALÍ DE ERIMANTO: jabalí (Sus scrofa) enorme; Heracles lo cansó haciéndolo correr por la nieve (Apolodoro II 5,4).
def jabali_body(P):
    d = L.sd_ellipsoid(P, (0, 0.72, 0.18), (0.3, 0.38, 0.46))
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.67, -0.38), (0.26, 0.3, 0.34)), 0.12)
    d = L.smax(d, -(P[:, 1] - 0.34), 0.06)
    d = L.smin(d, L.sd_capsule(P, (0, 0.74, 0.55), (0, 0.5, 1.02), 0.21, 0.075), 0.1)                        # cabeza en cuña
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.7, 0.72), (0.17, 0.16, 0.2)), 0.08)                                   # carrillos
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.47, 1.06), (0.075, 0.065, 0.035)), 0.02)                          # jeta
    for s in (-1, 1):
        d = L.smin(d, L.sd_ellipsoid(P, (s * 0.12, 0.92, 0.6), (0.04, 0.08, 0.05)), 0.03)                  # orejas
        d = L.smin(d, L.sd_chain(P, [(s * 0.06, 0.45, 0.92), (s * 0.1, 0.47, 1.0), (s * 0.11, 0.56, 1.02), (s * 0.08, 0.62, 0.99)], [0.022, 0.018, 0.012, 0.004]), 0.01)   # colmillos
    sp = np.clip(1 - np.abs(P[:, 0]) / 0.1, 0, 1) * np.clip((P[:, 2] + 0.5) / 0.4, 0, 1) * np.clip((0.8 - P[:, 2]) / 0.3, 0, 1)
    d = d - 0.07 * sp * L.fbm(np.stack([P[:, 0] * 50, P[:, 1] * 8, P[:, 2] * 40], -1), 3, 2)                 # crin de cerdas en el lomo
    return d - 0.006 * (hair(P, 140, 60) - 0.5)

def jabali_col(P, N):
    col = mix(np.tile(C(0.2, 0.16, 0.13), (len(P), 1)), C(0.36, 0.3, 0.24), L.fbm(P * 5, 3, 4))
    col = mix(col, C(0.48, 0.38, 0.36), np.clip(1.3 - dist(P, (0, 0.47, 1.06), (0.08, 0.07, 0.05)), 0, 1))      # jeta
    tusk = np.zeros(len(P), bool)
    for s in (-1, 1):
        tusk |= L.sd_chain(P, [(s * 0.06, 0.45, 0.92), (s * 0.1, 0.47, 1.0), (s * 0.11, 0.56, 1.02), (s * 0.08, 0.62, 0.99)], [0.022, 0.018, 0.012, 0.004]) < 0.006
    col = mix(col, C(0.9, 0.86, 0.74), tusk)
    col = mix(col, C(0.1, 0.08, 0.07), np.clip(1 - np.abs(P[:, 0]) / 0.08, 0, 1) * (P[:, 1] > 0.95))           # cerdas negras
    return np.clip(col * (0.8 + 0.4 * hair(P, 160, 40)[:, None]), 0, 1)

JABALI = dict(body=jabali_body, lo=(-0.45, 0.25, -0.8), hi=(0.45, 1.25, 1.15), col=jabali_col, foot='pezuna', tris=16000, step=0.01,
  eyes=([(-0.1, 0.7, 0.78), (0.1, 0.7, 0.78)], 0.016, (0.15, 0.06, 0.03, 1)),
  legs=[([(-0.14, 0.6, 0.32), (-0.14, 0.35, 0.3), (-0.14, 0.06, 0.33)], [0.11, 0.06, 0.045]),
        ([(0.14, 0.6, 0.32), (0.14, 0.35, 0.3), (0.14, 0.06, 0.33)], [0.11, 0.06, 0.045]),
        ([(-0.14, 0.62, -0.45), (-0.14, 0.38, -0.42), (-0.14, 0.25, -0.55), (-0.14, 0.06, -0.5)], [0.13, 0.07, 0.05, 0.045]),
        ([(0.14, 0.62, -0.45), (0.14, 0.38, -0.42), (0.14, 0.25, -0.55), (0.14, 0.06, -0.5)], [0.13, 0.07, 0.05, 0.045])],
  tail=(lambda P: L.smin(L.sd_chain(P, [(0, 0.8, -0.7), (0, 0.62, -0.78), (0, 0.48, -0.78)], [0.025, 0.015, 0.012]), L.sd_ellipsoid(P, (0, 0.45, -0.78), (0.03, 0.05, 0.03)), 0.02), (-0.1, 0.38, -0.9), (0.1, 0.9, -0.62), (0, 0.8, -0.7)))

# ---- EL TORO DE CRETA: el toro que Poseidón sacó del mar para Minos; blanco en Ovidio (Arte de amar I 290: «candidus») y en otros.
def toro_body(P):
    d = L.sd_ellipsoid(P, (0, 1.2, 0), (0.37, 0.44, 0.85))
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.5, 0.35), (0.25, 0.18, 0.32)), 0.12)                                # morrillo
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.1, 0.52), (0.36, 0.48, 0.36)), 0.12)
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.85, 0.7), (0.07, 0.25, 0.16)), 0.08)                                # papada
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.2, -0.62), (0.34, 0.4, 0.38)), 0.12)
    d = L.smax(d, -(P[:, 1] - 0.72), 0.08)
    d = L.smin(d, L.sd_capsule(P, (0, 1.35, 0.7), (0, 1.25, 1.02), 0.28, 0.2), 0.1)
    # la cabeza de toro del Minotauro, más baja y algo inclinada hacia delante
    q = P - np.asarray((0, 0.98, 0.95)); a = 0.45; c, s_ = math.cos(a), math.sin(a)
    q2 = np.stack([q[:, 0], q[:, 1] * c + q[:, 2] * s_, -q[:, 1] * s_ + q[:, 2] * c], -1)
    d = L.smin(d, mino_head(q2 / 1.05) * 1.05, 0.06)
    return d - 0.003 * (hair(P) - 0.5)

def toro_col(P, N):
    col = mix(np.tile(C(0.9, 0.87, 0.8), (len(P), 1)), C(0.74, 0.71, 0.66), L.fbm(P * 4, 3, 6) * 0.8)
    col = mix(col, C(0.6, 0.57, 0.53), np.clip((0.5 - P[:, 1]) / 0.3, 0, 1))
    q = P - np.asarray((0, 0.98, 0.95)); a = 0.45; c, s_ = math.cos(a), math.sin(a)
    q2 = np.stack([q[:, 0], q[:, 1] * c + q[:, 2] * s_, -q[:, 1] * s_ + q[:, 2] * c], -1) / 1.05
    head = np.clip((P[:, 2] - 0.9) / 0.1, 0, 1)
    mc = mino_col(q2, N)
    horn = np.clip((np.abs(q2[:, 0]) - 0.19) / 0.05, 0, 1) * np.clip((q2[:, 1] - 0.42) / 0.03, 0, 1)
    muz = np.clip(1 - np.linalg.norm((q2 - np.asarray((0, 0.19, 0.5))) / np.asarray((0.13, 0.1, 0.08)), axis=-1), 0, 1) * 1.6
    col = mix(col, mc, head * np.clip(horn + muz, 0, 1))
    return np.clip(col * (0.9 + 0.18 * hair(P)[:, None]), 0, 1)

TORO = dict(body=toro_body, lo=(-0.6, 0.6, -1.1), hi=(0.6, 2.25, 1.75), col=toro_col, foot='pezuna', tris=18000, step=0.013,
  eyes=([(-0.142, 1.235, 1.13), (0.142, 1.235, 1.13)], 0.02, (0.2, 0.06, 0.03, 1)),
  legs=[([(-0.22, 1.0, 0.55), (-0.22, 0.6, 0.5), (-0.22, 0.28, 0.55), (-0.22, 0.06, 0.57)], [0.15, 0.1, 0.07, 0.065]),
        ([(0.22, 1.0, 0.55), (0.22, 0.6, 0.5), (0.22, 0.28, 0.55), (0.22, 0.06, 0.57)], [0.15, 0.1, 0.07, 0.065]),
        ([(-0.22, 1.05, -0.65), (-0.22, 0.65, -0.5), (-0.22, 0.45, -0.8), (-0.22, 0.06, -0.72)], [0.17, 0.1, 0.07, 0.065]),
        ([(0.22, 1.05, -0.65), (0.22, 0.65, -0.5), (0.22, 0.45, -0.8), (0.22, 0.06, -0.72)], [0.17, 0.1, 0.07, 0.065])],
  tail=(lambda P: L.smin(L.sd_chain(P, [(0, 1.45, -0.95), (0, 1.0, -1.05), (0, 0.5, -1.05)], [0.04, 0.025, 0.02]), L.sd_ellipsoid(P, (0, 0.45, -1.05), (0.04, 0.1, 0.04)) - 0.02 * L.fbm(P * 30, 2, 8), 0.02), (-0.12, 0.3, -1.2), (0.12, 1.55, -0.85), (0, 1.45, -0.95)))

# ---- LAS YEGUAS DE DIOMEDES: yeguas salvajes del rey de los bistones, en Tracia (Apolodoro II 5,8; Eurípides, Alcestis 481-498).
def yegua_body(P):
    d = L.sd_ellipsoid(P, (0, 1.25, 0), (0.24, 0.3, 0.68))
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.2, 0.44), (0.25, 0.34, 0.3)), 0.12)
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.3, -0.5), (0.26, 0.3, 0.32)), 0.12)
    d = L.smax(d, -(P[:, 1] - 0.95), 0.08)
    d = L.smin(d, L.sd_capsule(P, (0, 1.35, 0.55), (0, 1.78, 0.86), 0.17, 0.1), 0.1)                         # cuello
    h = L.sd_capsule(P, (0, 1.84, 0.88), (0, 1.52, 1.18), 0.1, 0.065)                                       # cabeza larga
    h = L.smin(h, L.sd_ellipsoid(P, (0, 1.72, 0.92), (0.09, 0.11, 0.1)), 0.05)                               # quijadas
    for s in (-1, 1):
        h = L.smin(h, L.sd_capsule(P, (s * 0.04, 1.92, 0.86), (s * 0.06, 2.02, 0.83), 0.025, 0.01), 0.015)  # orejas
        h = L.smax(h, -L.sd_ellipsoid(P, (s * 0.03, 1.5, 1.23), (0.015, 0.02, 0.02)), 0.008)                 # ollares
    d = L.smin(d, h, 0.04)
    # crin: una cresta de mechones a lo largo del cuello
    t = np.clip((P[:, 1] - 1.35) / 0.55, 0, 1); cz = 0.5 + t * 0.32; cy = 1.42 + t * 0.48
    crest = np.sqrt(P[:, 0] ** 2 + ((P[:, 2] - cz) * 0.7 + (P[:, 1] - cy) * 0.7) ** 2) - 0.07
    crest = np.maximum(crest, -(P[:, 1] - 1.3)); crest = np.maximum(crest, P[:, 1] - 1.98)
    crest = crest - 0.05 * (L.fbm(np.stack([P[:, 0] * 30, P[:, 1] * 6, P[:, 2] * 30], -1), 3, 9) - 0.4)
    return L.smin(d, crest, 0.03) - 0.002 * (hair(P) - 0.5)

def yegua_col(P, N):
    col = mix(np.tile(C(0.16, 0.1, 0.07), (len(P), 1)), C(0.3, 0.18, 0.11), L.fbm(P * 4, 3, 12) * 0.7)
    t = np.clip((P[:, 1] - 1.35) / 0.55, 0, 1); cz = 0.5 + t * 0.32
    col = mix(col, C(0.04, 0.03, 0.03), (P[:, 2] < cz + 0.02) & (P[:, 2] > 0.38) & (np.abs(P[:, 0]) < 0.1) & (P[:, 1] > 1.42) & (P[:, 1] < 2.0) & (P[:, 2] < 0.85))   # crin negra
    col = mix(col, C(0.05, 0.04, 0.04), np.clip((0.4 - P[:, 1]) / 0.2, 0, 1))
    return np.clip(col * (0.85 + 0.3 * hair(P, 150, 30)[:, None]), 0, 1)

def yegua_tail(P):
    d = L.sd_chain(P, [(0, 1.4, -0.82), (0, 1.25, -0.98), (0, 0.9, -1.08), (0, 0.6, -1.08)], [0.06, 0.09, 0.08, 0.04])
    return d - 0.04 * (L.fbm(np.stack([P[:, 0] * 30, P[:, 1] * 5, P[:, 2] * 30], -1), 3, 7) - 0.4)

YEGUA = dict(body=yegua_body, lo=(-0.4, 0.85, -0.9), hi=(0.4, 2.1, 1.3), col=yegua_col, foot='pezuna', tris=16000, rough=0.55,
  eyes=([(-0.085, 1.76, 0.98), (0.085, 1.76, 0.98)], 0.02, (0.18, 0.05, 0.03, 1)),
  legs=[([(-0.13, 1.1, 0.45), (-0.13, 0.7, 0.42), (-0.13, 0.3, 0.45), (-0.13, 0.06, 0.47)], [0.1, 0.06, 0.042, 0.05]),
        ([(0.13, 1.1, 0.45), (0.13, 0.7, 0.42), (0.13, 0.3, 0.45), (0.13, 0.06, 0.47)], [0.1, 0.06, 0.042, 0.05]),
        ([(-0.13, 1.2, -0.55), (-0.13, 0.8, -0.4), (-0.13, 0.55, -0.65), (-0.13, 0.06, -0.58)], [0.13, 0.07, 0.045, 0.05]),
        ([(0.13, 1.2, -0.55), (0.13, 0.8, -0.4), (0.13, 0.55, -0.65), (0.13, 0.06, -0.58)], [0.13, 0.07, 0.045, 0.05])],
  tail=(yegua_tail, (-0.25, 0.45, -1.3), (0.25, 1.55, -0.72), (0, 1.4, -0.82)))

# ---- PERROS: Cerbero (tres cabezas y cola de serpiente: Apolodoro II 5,12) y Ortro (dos cabezas: Hesíodo, Teogonía 309)
def dog_head(P, c, yaw):
    q = P - np.asarray(c); ca, sa = math.cos(yaw), math.sin(yaw)
    q = np.stack([q[:, 0] * ca - q[:, 2] * sa, q[:, 1], q[:, 0] * sa + q[:, 2] * ca], -1)
    h = L.sd_ellipsoid(q, (0, 0, 0), (0.11, 0.1, 0.12))
    h = L.smin(h, L.sd_capsule(q, (0, -0.02, 0.08), (0, -0.04, 0.24), 0.065, 0.05), 0.04)                    # hocico de moloso, largo
    h = L.smin(h, L.sd_ellipsoid(q, (0, -0.085, 0.14), (0.06, 0.03, 0.1)), 0.025)                           # mandíbula
    h = L.smin(h, L.sd_ellipsoid(q, (0, -0.02, 0.28), (0.035, 0.028, 0.02)), 0.015)                           # trufa
    h = L.smin(h, L.sd_ellipsoid(q, (0, 0.06, 0.06), (0.06, 0.03, 0.06)), 0.03)                               # frente
    for s in (-1, 1):
        h = L.smin(h, L.sd_ellipsoid(q, (s * 0.1, 0.0, -0.02), (0.03, 0.08, 0.05)), 0.03)                    # orejas caídas
        h = L.smax(h, -L.sd_ellipsoid(q, (s * 0.055, 0.035, 0.1), (0.022, 0.016, 0.02)), 0.01)
    return h

def dog_heads_list(n):
    return [((-0.2, 1.05, 0.68), -0.35), ((0.0, 1.12, 0.74), 0.0), ((0.2, 1.05, 0.68), 0.35)] if n == 3 else [((-0.12, 1.08, 0.72), -0.2), ((0.12, 1.08, 0.72), 0.2)]

def dog_body_n(n):
    def f(P):
        d = L.sd_ellipsoid(P, (0, 0.75, 0), (0.2, 0.24, 0.5))
        d = L.smin(d, L.sd_ellipsoid(P, (0, 0.72, 0.3), (0.22, 0.3, 0.26)), 0.1)
        d = L.smax(d, -(P[:, 1] - 0.5), 0.06)
        for (c, yaw) in dog_heads_list(n):
            d = L.smin(d, L.sd_capsule(P, (c[0] * 0.4, 0.85, 0.38), (c[0], c[1] - 0.05, c[2] - 0.08), 0.13, 0.09), 0.08)
            d = L.smin(d, dog_head(P, c, yaw), 0.05)
        return d - 0.004 * (hair(P) - 0.5)
    return f

def dog_col(P, N):
    col = mix(np.tile(C(0.1, 0.08, 0.07), (len(P), 1)), C(0.24, 0.18, 0.13), L.fbm(P * 5, 3, 14) * 0.7)
    snake = (P[:, 2] < -0.55) & (P[:, 1] > 0.55)
    sc = 0.5 + 0.5 * np.sin(P[:, 0] * 260) * np.sin(P[:, 2] * 260 + P[:, 1] * 120)
    col = mix(col, C(0.22, 0.3, 0.16) * (0.7 + 0.5 * sc)[:, None], snake)                                   # cola de serpiente (Cerbero)
    return np.clip(col * (0.85 + 0.3 * hair(P, 140, 30)[:, None]), 0, 1)

def dog_spec(n, snake):
    heads = dog_heads_list(n)
    eyes_ = []
    for (c, yaw) in heads:
        for s in (-1, 1):
            lx, lz = s * 0.055, 0.105; ca, sa = math.cos(yaw), math.sin(yaw)
            eyes_.append((c[0] + lx * ca + lz * sa, c[1] + 0.03, c[2] - lx * sa + lz * ca))
    tail = (lambda P: L.smin(L.sd_chain(P, [(0, 0.85, -0.48), (0, 0.95, -0.75), (0.1, 1.05, -1.0), (0.05, 1.15, -1.2)], [0.05, 0.045, 0.04, 0.03]), L.sd_ellipsoid(P, (0.05, 1.17, -1.26), (0.045, 0.035, 0.07)), 0.02)) if snake else \
           (lambda P: L.sd_chain(P, [(0, 0.85, -0.48), (0, 0.9, -0.7), (0, 0.75, -0.85)], [0.04, 0.03, 0.02]))
    return dict(body=dog_body_n(n), lo=(-0.45, 0.45, -0.65), hi=(0.45, 1.35, 1.2), col=dog_col, foot='pata', tris=16000, step=0.01,
      eyes=(eyes_, 0.013, (0.6, 0.18, 0.04, 1)),
      legs=[([(-0.12, 0.7, 0.33), (-0.12, 0.4, 0.3), (-0.12, 0.08, 0.34)], [0.09, 0.06, 0.05]),
            ([(0.12, 0.7, 0.33), (0.12, 0.4, 0.3), (0.12, 0.08, 0.34)], [0.09, 0.06, 0.05]),
            ([(-0.12, 0.75, -0.4), (-0.12, 0.48, -0.32), (-0.12, 0.3, -0.48), (-0.12, 0.08, -0.43)], [0.11, 0.06, 0.045, 0.045]),
            ([(0.12, 0.75, -0.4), (0.12, 0.48, -0.32), (0.12, 0.3, -0.48), (0.12, 0.08, -0.43)], [0.11, 0.06, 0.045, 0.045])],
      tail=(tail, (-0.15, 0.6, -1.4), (0.25, 1.3, -0.4), (0, 0.85, -0.48)))

# ---- LADÓN: la serpiente-dragón que guarda las manzanas de oro de las Hespérides, enroscada al árbol (Apolonio IV 1396-1407;
# Hesíodo, Teogonía 333-335). El cuerpo enroscado es una pieza; la cabeza, otra, con el origen en el cuello, para que ataque.
def ladon_coil(P):
    th = np.arctan2(P[:, 2], P[:, 0]); y = P[:, 1]; best = None
    for k in range(-1, 5):
        tt = th + k * 2 * math.pi
        yy = 0.25 + tt / (2 * math.pi) * 1.0                                                                   # sube 1 m por vuelta
        valid = (tt >= 0) & (tt <= 2.6 * 2 * math.pi)
        rr = 0.75 + 0.04 * np.sin(tt * 3)
        rad = 0.24 - 0.06 * np.clip(tt / (2.6 * 2 * math.pi), 0, 1)
        dd = np.sqrt((np.sqrt(P[:, 0] ** 2 + P[:, 2] ** 2) - rr) ** 2 + (y - yy) ** 2) - rad
        dd = np.where(valid, dd, 9.0); best = dd if best is None else np.minimum(best, dd)
    top = 0.25 + 2.6; ang = 2.6 * 2 * math.pi
    ex = (0.75 * math.cos(ang), top, 0.75 * math.sin(ang))
    neck = L.sd_chain(P, [ex, (ex[0] * 1.1, top + 0.3, ex[2] * 1.1 + 0.2), (0.3, top + 0.6, 0.7)], [0.18, 0.16, 0.14])
    d = L.smin(best, neck, 0.08)
    return d - 0.01 * (L.fbm(P * 30, 2, 31) - 0.5)

LADON_NECK = (0.3, 3.45, 0.7)
def ladon_head(P):
    c = np.asarray(LADON_NECK)
    h = L.sd_capsule(P, c, c + np.asarray((0, 0.05, 0.3)), 0.14, 0.15)
    h = L.smin(h, L.sd_ellipsoid(P, c + np.asarray((0, 0.06, 0.45)), (0.16, 0.12, 0.2)), 0.06)
    h = L.smin(h, L.sd_capsule(P, c + np.asarray((0, 0.03, 0.55)), c + np.asarray((0, -0.02, 0.85)), 0.1, 0.06), 0.05)   # hocico
    h = L.smin(h, L.sd_capsule(P, c + np.asarray((0, -0.08, 0.5)), c + np.asarray((0, -0.12, 0.8)), 0.07, 0.04), 0.03)   # mandíbula
    for s in (-1, 1):
        h = L.smin(h, L.sd_chain(P, [c + np.asarray((s * 0.08, 0.15, 0.4)), c + np.asarray((s * 0.16, 0.3, 0.25)), c + np.asarray((s * 0.2, 0.36, 0.05))], [0.035, 0.022, 0.006]), 0.02)   # cuernos hacia atrás
        for k in range(4):                                                                                       # gola de púas
            h = L.smin(h, L.sd_capsule(P, c + np.asarray((s * 0.12, 0.02 - k * 0.05, 0.3)), c + np.asarray((s * 0.3, 0.05 - k * 0.07, 0.15)), 0.02, 0.004), 0.015)
        h = L.smax(h, -L.sd_ellipsoid(P, c + np.asarray((s * 0.11, 0.12, 0.56)), (0.03, 0.022, 0.03)), 0.01)
    return h

def ladon_col(P, N):
    sc = 0.5 + 0.5 * np.sin(P[:, 0] * 90 + np.sin(P[:, 1] * 70) * 2) * np.sin(P[:, 1] * 90 + P[:, 2] * 40)
    col = mix(np.tile(C(0.16, 0.26, 0.12), (len(P), 1)), C(0.5, 0.46, 0.16), L.fbm(P * 3, 3, 17))
    col = col * (0.7 + 0.45 * sc[:, None])
    belly = np.clip(-(N[:, 0] * P[:, 0] + N[:, 2] * P[:, 2]) / (np.sqrt(P[:, 0] ** 2 + P[:, 2] ** 2) + 1e-3), 0, 1)
    col = mix(col, C(0.82, 0.7, 0.36), belly * 0.8 * (P[:, 1] < 2.9))                                         # vientre amarillo hacia el árbol
    return np.clip(col, 0, 1)

def build_ladon():
    root = bpy.data.objects.new('CR_ladon', None); SC.collection.objects.link(root)
    body = make_part('CR_ladon_cuerpo', ladon_coil, (-1.1, -0.05, -1.1), (1.1, 3.6, 1.2), 0.016, (0, 0, 0), 16000, root)
    hd = make_part('CR_ladon_cabeza', ladon_head, (0.0, 3.05, 0.55), (0.65, 3.95, 1.65), 0.009, LADON_NECK, 7000, root)
    c = LADON_NECK; eyes(hd, [(c[0] - 0.11, c[1] + 0.12, c[2] + 0.555), (c[0] + 0.11, c[1] + 0.12, c[2] + 0.555)], 0.022, (0.85, 0.6, 0.05, 1))
    paint([body, hd], 'ladon_escamas', ladon_col, rough=0.5)
    return root

# ==================================================================== construir y exportar
# ==================================================================== SEGUNDO LOTE (→ modelos/criaturas2.glb, texturas de 512 px)
# Criaturas de los demás portales: centauro, Pegaso, grifo, Quimera, Esfinge, mujer-ave (Harpías y Sirenas), cabeza de Gorgona,
# Tritón, tortuga (la de Escirón), zorra (Teumeso) y una serpiente grande genérica (Pitón, dragones, Laocoonte, Bagradas...).
def human_head(P, c, fem=False, beard=False, s=1.0):
    q = (P - np.asarray(c)) / s
    h = L.sd_ellipsoid(q, (0, 0.02, -0.01), (0.09, 0.11, 0.1))
    h = L.smin(h, L.sd_ellipsoid(q, (0, -0.06, 0.035), (0.065, 0.06, 0.06)), 0.04)            # mandíbula y mejillas
    h = L.smin(h, L.sd_capsule(q, (0, 0.03, 0.085), (0, -0.02, 0.105), 0.014, 0.018), 0.01)     # nariz
    h = L.smin(h, L.sd_ellipsoid(q, (0, 0.045, 0.07), (0.065, 0.015, 0.03)), 0.015)             # cejas
    for k in (-1, 1):
        h = L.smax(h, -L.sd_ellipsoid(q, (k * 0.033, 0.025, 0.088), (0.017, 0.011, 0.012)), 0.006)
        h = L.smin(h, L.sd_ellipsoid(q, (k * 0.09, 0.0, -0.01), (0.012, 0.03, 0.02)), 0.01)      # orejas
    hair = L.sd_ellipsoid(q, (0, 0.06, -0.03), (0.1, 0.1, 0.105)) - 0.012 * L.fbm(q * 40, 3, 4)
    hair = L.smax(hair, -(q[:, 2] - 0.03 + (q[:, 1] - 0.06) * 0.6), 0.02)                     # la cara libre
    if fem: hair = L.smin(hair, L.sd_ellipsoid(q, (0, 0.02, -0.12), (0.06, 0.06, 0.05)) - 0.01 * L.fbm(q * 40, 2, 5), 0.03)   # moño
    h = L.smin(h, hair, 0.015)
    if beard: h = L.smin(h, L.sd_ellipsoid(q, (0, -0.09, 0.05), (0.07, 0.06, 0.05)) - 0.015 * L.fbm(q * 40, 3, 6), 0.03)
    return h * s

def skin_col(P, base=(0.72, 0.52, 0.38)):
    return np.tile(C(*base), (len(P), 1)) * (0.92 + 0.12 * L.fbm(P * 20, 2, 33))[:, None]

def wing(P, s, span=1.25, chord=0.42, root=(0, 0, 0)):
    q = P - np.asarray(root); x = q[:, 0] * s
    d = L.sd_ellipsoid(q, (s * span * 0.5, 0.0, -0.02), (span * 0.52, 0.035, chord * 0.55))
    d = L.smin(d, L.sd_ellipsoid(q, (s * 0.14, 0.0, 0.0), (0.16, 0.05, chord * 0.5)), 0.08)
    d = d + 0.03 * np.abs(np.sin(x * 18)) * np.clip((-q[:, 2] - 0.02) / 0.12, 0, 1)
    return L.smax(d, -(q[:, 0] * s), 0.01)

def feather_col(P, base, tip):
    col = mix(np.tile(C(*base), (len(P), 1)), C(*tip), np.clip((np.abs(P[:, 0]) - 0.5) / 0.6, 0, 1))
    return col * (0.82 + 0.3 * L.fbm(np.stack([P[:, 0] * 80, P[:, 1] * 80, P[:, 2] * 25], -1), 2, 9))[:, None]

def horse_trunk(P, with_neck=True):
    d = L.sd_ellipsoid(P, (0, 1.25, 0), (0.24, 0.3, 0.68))
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.2, 0.44), (0.25, 0.34, 0.3)), 0.12)
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.3, -0.5), (0.26, 0.3, 0.32)), 0.12)
    return L.smax(d, -(P[:, 1] - 0.95), 0.08)

# ---- centauro (Ovidio, Metamorfosis XII 210-535; los de los vasos, con torso humano sobre cuerpo de caballo)
def centauro_body(P):
    d = horse_trunk(P)
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.62, 0.6), (0.2, 0.26, 0.15)), 0.1)                  # cintura humana
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.88, 0.6), (0.23, 0.2, 0.14)), 0.08)                 # pecho
    for k in (-1, 1):
        d = L.smin(d, L.sd_chain(P, [(k * 0.22, 1.98, 0.6), (k * 0.3, 1.72, 0.62), (k * 0.32, 1.48, 0.72)], [0.07, 0.055, 0.045]), 0.04)   # brazos
    d = L.smin(d, L.sd_capsule(P, (0, 2.02, 0.6), (0, 2.12, 0.62), 0.06, 0.055), 0.03)
    return L.smin(d, human_head(P, (0, 2.24, 0.62), beard=True), 0.03)

def centauro_col(P, N):
    horse = mix(np.tile(C(0.42, 0.26, 0.14), (len(P), 1)), C(0.3, 0.18, 0.1), L.fbm(P * 4, 3, 2))
    col = mix(horse, skin_col(P), np.clip((P[:, 1] - 1.5) / 0.1, 0, 1) * (P[:, 2] > 0.35))
    col = mix(col, C(0.16, 0.1, 0.07), (P[:, 1] > 2.26) | ((P[:, 1] < 2.18) & (P[:, 1] > 2.08) & (P[:, 2] > 0.6)))   # pelo y barba
    return np.clip(col, 0, 1)

def legs_horse(sc=1.0):
    return [([(-0.13, 1.1, 0.45), (-0.13, 0.7, 0.42), (-0.13, 0.3, 0.45), (-0.13, 0.06, 0.47)], [0.1, 0.06, 0.042, 0.05]),
            ([(0.13, 1.1, 0.45), (0.13, 0.7, 0.42), (0.13, 0.3, 0.45), (0.13, 0.06, 0.47)], [0.1, 0.06, 0.042, 0.05]),
            ([(-0.13, 1.2, -0.55), (-0.13, 0.8, -0.4), (-0.13, 0.55, -0.65), (-0.13, 0.06, -0.58)], [0.13, 0.07, 0.045, 0.05]),
            ([(0.13, 1.2, -0.55), (0.13, 0.8, -0.4), (0.13, 0.55, -0.65), (0.13, 0.06, -0.58)], [0.13, 0.07, 0.045, 0.05])]

CENTAURO = dict(body=centauro_body, lo=(-0.45, 0.85, -0.9), hi=(0.45, 2.42, 1.0), col=centauro_col, foot='pezuna', tris=14000,
  eyes=([(-0.033, 2.265, 0.705), (0.033, 2.265, 0.705)], 0.011, (0.08, 0.05, 0.03, 1)), legs=legs_horse(),
  tail=(yegua_tail, (-0.25, 0.45, -1.3), (0.25, 1.55, -0.72), (0, 1.4, -0.82)))

# ---- Pegaso (Hesíodo, Teogonía 280-286; Píndaro, Olímpica XIII 63-92): caballo blanco con alas
PEGASO = dict(YEGUA); PEGASO.update(col=lambda P, N: np.clip(mix(np.tile(C(0.93, 0.92, 0.9), (len(P), 1)), C(0.78, 0.78, 0.8), L.fbm(P * 4, 3, 2) * 0.6) * (0.92 + 0.12 * hair(P)[:, None]), 0, 1), tris=14000,
  extra=[('aI', lambda P: wing(P, -1, 1.5, 0.55, (-0.2, 1.55, 0.35)), (-1.9, 1.4, -0.1), (-0.1, 1.7, 0.75), (-0.2, 1.55, 0.35), 3000),
         ('aD', lambda P: wing(P, 1, 1.5, 0.55, (0.2, 1.55, 0.35)), (0.1, 1.4, -0.1), (1.9, 1.7, 0.75), (0.2, 1.55, 0.35), 3000)])

# ---- grifo (Heródoto III 116 y IV 13; Esquilo, Prometeo 803-804): cuerpo de león, cabeza y alas de águila
def grifo_body(P):
    d = L.sd_ellipsoid(P, (0, 1.0, 0.05), (0.3, 0.33, 0.75))
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.98, 0.42), (0.31, 0.4, 0.4)), 0.12)
    d = L.smax(d, -(P[:, 1] - 0.62), 0.08)
    d = L.smin(d, L.sd_capsule(P, (0, 1.15, 0.55), (0, 1.55, 0.85), 0.24, 0.13), 0.1)            # cuello de plumas
    h = L.sd_ellipsoid(P, (0, 1.62, 0.92), (0.13, 0.14, 0.17))
    h = L.smin(h, L.sd_chain(P, [(0, 1.62, 1.05), (0, 1.6, 1.2), (0, 1.5, 1.27)], [0.06, 0.04, 0.008]), 0.03)   # pico ganchudo
    h = L.smin(h, L.sd_ellipsoid(P, (0, 1.78, 0.86), (0.04, 0.08, 0.07)) - 0.01 * L.fbm(P * 40, 2, 3), 0.03)   # cresta
    return L.smin(d, h, 0.05) - 0.004 * (hair(P) - 0.5)

def grifo_col(P, N):
    col = np.tile(C(0.72, 0.55, 0.32), (len(P), 1))
    col = mix(col, C(0.85, 0.82, 0.74) * (0.8 + 0.3 * L.fbm(np.stack([P[:, 0] * 60, P[:, 1] * 60, P[:, 2] * 20], -1), 2, 6))[:, None], np.clip((P[:, 2] - 0.6) / 0.1, 0, 1) * (P[:, 1] > 1.15))
    col = mix(col, C(0.85, 0.62, 0.2), (P[:, 2] > 1.08) & (P[:, 1] > 1.45) & (P[:, 1] < 1.66))
    return np.clip(col * (0.88 + 0.22 * hair(P)[:, None]), 0, 1)

GRIFO = dict(body=grifo_body, lo=(-0.5, 0.5, -1.0), hi=(0.5, 1.9, 1.35), col=grifo_col, foot='pata', tris=14000,
  eyes=([(-0.085, 1.66, 1.0), (0.085, 1.66, 1.0)], 0.02, (0.75, 0.45, 0.05, 1)),
  legs=[([(-0.19, 1.0, 0.5), (-0.19, 0.6, 0.42), (-0.19, 0.2, 0.5), (-0.2, 0.08, 0.58)], [0.15, 0.11, 0.08, 0.075]),
        ([(0.19, 1.0, 0.5), (0.19, 0.6, 0.42), (0.19, 0.2, 0.5), (0.2, 0.08, 0.58)], [0.15, 0.11, 0.08, 0.075]),
        ([(-0.19, 1.02, -0.55), (-0.19, 0.6, -0.4), (-0.19, 0.36, -0.68), (-0.19, 0.09, -0.6)], [0.17, 0.11, 0.07, 0.07]),
        ([(0.19, 1.02, -0.55), (0.19, 0.6, -0.4), (0.19, 0.36, -0.68), (0.19, 0.09, -0.6)], [0.17, 0.11, 0.07, 0.07])],
  tail=(leon_tail, (-0.12, 0.35, -1.98), (0.12, 1.15, -0.78), (0, 1.05, -0.86)),
  extra=[('aI', lambda P: wing(P, -1, 1.3, 0.5, (-0.22, 1.3, 0.25)), (-1.7, 1.18, -0.3), (-0.1, 1.42, 0.6), (-0.22, 1.3, 0.25), 3000),
         ('aD', lambda P: wing(P, 1, 1.3, 0.5, (0.22, 1.3, 0.25)), (0.1, 1.18, -0.3), (1.7, 1.42, 0.6), (0.22, 1.3, 0.25), 3000)])

# ---- Quimera (Ilíada VI 179-182; Hesíodo, Teogonía 319-324): león delante, cabra en medio, serpiente detrás
def quimera_body(P):
    d = leon_body(P)
    d = L.smin(d, L.sd_capsule(P, (0, 1.25, -0.25), (0, 1.75, -0.05), 0.12, 0.08), 0.06)          # cuello de cabra que sale del lomo
    h = L.sd_capsule(P, (0, 1.78, -0.04), (0, 1.66, 0.18), 0.075, 0.05)
    for k in (-1, 1):
        h = L.smin(h, L.sd_chain(P, [(k * 0.04, 1.85, -0.05), (k * 0.08, 1.98, -0.15), (k * 0.1, 1.95, -0.3)], [0.025, 0.018, 0.006]), 0.01)   # cuernos
    h = L.smin(h, L.sd_ellipsoid(P, (0, 1.6, 0.16), (0.025, 0.05, 0.03)) - 0.01 * L.fbm(P * 50, 2, 7), 0.02)   # perilla
    return L.smin(d, h, 0.04)

def quimera_col(P, N):
    col = leon_col(P, N)
    goat = (P[:, 1] > 1.42) & (P[:, 2] < 0.3) & (P[:, 2] > -0.4) & (np.abs(P[:, 0]) < 0.2)
    return np.clip(mix(col, C(0.5, 0.46, 0.4) * (0.85 + 0.3 * hair(P)[:, None]), goat), 0, 1)

def quimera_tail(P):
    return L.smin(L.sd_chain(P, [(0, 1.05, -0.86), (0, 1.15, -1.15), (0.1, 1.3, -1.45), (0.05, 1.4, -1.65)], [0.06, 0.055, 0.045, 0.035]), L.sd_ellipsoid(P, (0.05, 1.42, -1.72), (0.05, 0.04, 0.08)), 0.02)

QUIMERA = dict(body=quimera_body, lo=(-0.6, 0.45, -1.05), hi=(0.6, 2.05, 1.65), col=quimera_col, foot='pata', tris=16000, step=0.013,
  eyes=([(-0.09, 1.405, 1.258), (0.09, 1.405, 1.258)], 0.022, (0.55, 0.3, 0.04, 1)),
  legs=GRIFO['legs'], tail=(quimera_tail, (-0.15, 0.85, -1.85), (0.25, 1.55, -0.78), (0, 1.05, -0.86)))

# ---- Esfinge (Hesíodo, Teogonía 326; Sófocles, Edipo rey; Apolodoro III 5,8): cuerpo de leona, cabeza de mujer, alas
def esfinge_body(P):
    d = L.sd_ellipsoid(P, (0, 1.0, 0.05), (0.28, 0.32, 0.72))
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.98, 0.42), (0.29, 0.38, 0.38)), 0.12)
    d = L.smax(d, -(P[:, 1] - 0.62), 0.08)
    d = L.smin(d, L.sd_capsule(P, (0, 1.15, 0.55), (0, 1.55, 0.78), 0.2, 0.08), 0.1)
    return L.smin(d, human_head(P, (0, 1.72, 0.8), fem=True, s=1.5), 0.04)

def esfinge_col(P, N):
    col = np.tile(C(0.76, 0.58, 0.36), (len(P), 1)) * (0.88 + 0.22 * hair(P)[:, None])
    col = mix(col, C(0.72, 0.54, 0.42), np.clip((P[:, 1] - 1.55) / 0.08, 0, 1) * (P[:, 2] > 0.62))
    col = mix(col, C(0.12, 0.08, 0.06), (P[:, 1] > 1.8) & (P[:, 2] < 0.86))                     # pelo negro
    return np.clip(col, 0, 1)

ESFINGE = dict(body=esfinge_body, lo=(-0.5, 0.5, -1.0), hi=(0.5, 2.0, 1.15), col=esfinge_col, foot='pata', tris=14000,
  eyes=([(-0.05, 1.76, 0.932), (0.05, 1.76, 0.932)], 0.014, (0.12, 0.08, 0.05, 1)), legs=GRIFO['legs'], tail=GRIFO['tail'],
  extra=[('aI', lambda P: wing(P, -1, 1.1, 0.45, (-0.2, 1.3, 0.3)), (-1.5, 1.18, -0.2), (-0.1, 1.42, 0.6), (-0.2, 1.3, 0.3), 2500),
         ('aD', lambda P: wing(P, 1, 1.1, 0.45, (0.2, 1.3, 0.3)), (0.1, 1.18, -0.2), (1.5, 1.42, 0.6), (0.2, 1.3, 0.3), 2500)])

# ---- mujer-ave: las Sirenas de los vasos griegos (cuerpo de ave, cabeza de mujer) y las Harpías (Apolonio II 178-300)
def arpia_body(P):
    d = L.sd_ellipsoid(P, (0, 0.0, 0.0), (0.2, 0.2, 0.36))
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.06, 0.2), (0.17, 0.2, 0.16)), 0.06)
    d = L.smin(d, L.sd_capsule(P, (0, 0.15, 0.28), (0, 0.3, 0.34), 0.07, 0.05), 0.04)
    d = L.smin(d, human_head(P, (0, 0.44, 0.36), fem=True, s=1.05), 0.03)
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.02, -0.45), (0.15, 0.03, 0.22)), 0.05)               # cola
    for k in (-1, 1):
        d = L.smin(d, L.sd_chain(P, [(k * 0.08, -0.12, 0.05), (k * 0.08, -0.32, 0.05), (k * 0.08, -0.4, 0.12)], [0.035, 0.022, 0.01]), 0.03)   # patas con garras
    return d - 0.005 * (L.fbm(np.stack([P[:, 0] * 60, P[:, 1] * 60, P[:, 2] * 20], -1), 2, 9) - 0.5)

def arpia_col(P, N):
    col = feather_col(P, (0.55, 0.45, 0.35), (0.3, 0.24, 0.2))
    col = mix(col, skin_col(P, (0.78, 0.6, 0.48)), np.clip((P[:, 1] - 0.3) / 0.05, 0, 1) * (P[:, 2] > 0.2))
    col = mix(col, C(0.14, 0.1, 0.08), (P[:, 1] > 0.5) & (P[:, 2] < 0.42))
    col = mix(col, C(0.6, 0.5, 0.2), P[:, 1] < -0.3)
    return np.clip(col, 0, 1)

def build_arpia():
    root = bpy.data.objects.new('CR_arpia', None); SC.collection.objects.link(root)
    b = make_part('CR_arpia_cuerpo', arpia_body, (-0.3, -0.5, -0.75), (0.3, 0.62, 0.55), 0.008, (0, 0, 0), 9000, root)
    eyes(b, [(-0.034, 0.466, 0.452), (0.034, 0.466, 0.452)], 0.011, (0.1, 0.06, 0.04, 1))
    wi = make_part('CR_arpia_aI', lambda P: wing(P, -1, 1.1, 0.42, (-0.12, 0.1, 0.05)), (-1.35, -0.05, -0.3), (0.0, 0.25, 0.35), 0.009, (-0.12, 0.1, 0.05), 3000, root)
    wd = make_part('CR_arpia_aD', lambda P: wing(P, 1, 1.1, 0.42, (0.12, 0.1, 0.05)), (0.0, -0.05, -0.3), (1.35, 0.25, 0.35), 0.009, (0.12, 0.1, 0.05), 3000, root)
    paint([b, wi, wd], 'arpia_plumas', arpia_col, rough=0.8)
    return root

# ---- cabeza de Gorgona (Hesíodo, Teogonía 274-283; el gorgoneion arcaico: serpientes por pelo, colmillos y lengua fuera)
def gorgona_head(P):
    h = human_head(P, (0, 0.14, 0.02), fem=True, s=1.15)
    for i in range(14):                                                                         # serpientes
        a = i / 14 * 2 * math.pi; e = 0.25 + (i % 3) * 0.25
        b0 = (math.cos(a) * 0.08 * math.cos(e), 0.2 + math.sin(e) * 0.08, -0.02 + math.sin(a) * 0.08 * math.cos(e) * 0.8)
        b1 = (math.cos(a) * 0.17, 0.24 + math.sin(e) * 0.14, -0.04 + math.sin(a) * 0.14)
        b2 = (math.cos(a + 0.6) * 0.22, 0.2 + math.sin(e) * 0.2, -0.02 + math.sin(a + 0.6) * 0.18)
        h = L.smin(h, L.sd_chain(P, [b0, b1, b2], [0.016, 0.014, 0.012]), 0.01)
        h = L.smin(h, L.sd_ellipsoid(P, b2, (0.02, 0.016, 0.026)), 0.006)
    for k in (-1, 1): h = L.smin(h, L.sd_capsule(P, (k * 0.025, 0.06, 0.1), (k * 0.03, 0.02, 0.12), 0.007, 0.003), 0.004)   # colmillos
    return h

def gorgona_col(P, N):
    col = skin_col(P, (0.62, 0.66, 0.5))
    sn = np.linalg.norm(P[:, [0, 2]], axis=-1) > 0.1
    col = mix(col, C(0.22, 0.34, 0.16) * (0.7 + 0.5 * (0.5 + 0.5 * np.sin(P[:, 0] * 300) * np.sin(P[:, 2] * 300)))[:, None], sn & (P[:, 1] > 0.18))
    return np.clip(col, 0, 1)

def build_gorgona():
    root = bpy.data.objects.new('CR_gorgona', None); SC.collection.objects.link(root)
    h = make_part('CR_gorgona_cabeza', gorgona_head, (-0.35, -0.05, -0.3), (0.35, 0.5, 0.3), 0.006, (0, 0, 0), 9000, root)
    eyes(h, [(-0.038, 0.17, 0.12), (0.038, 0.17, 0.12)], 0.014, (0.9, 0.75, 0.2, 1))
    paint([h], 'gorgona_piel', gorgona_col, rough=0.6)
    return root

# ---- Tritón (Hesíodo, Teogonía 930-933; Pausanias IX 20,4): torso de hombre y cola de pez, fuera del agua
def triton_body(P):
    d = L.sd_ellipsoid(P, (0, 1.1, 0), (0.2, 0.28, 0.14))
    d = L.smin(d, L.sd_ellipsoid(P, (0, 1.36, 0), (0.24, 0.2, 0.15)), 0.08)
    for k in (-1, 1): d = L.smin(d, L.sd_chain(P, [(k * 0.24, 1.46, 0), (k * 0.36, 1.22, 0.08), (k * 0.4, 1.0, 0.2)], [0.07, 0.055, 0.045]), 0.04)
    d = L.smin(d, human_head(P, (0, 1.72, 0.02), beard=True), 0.03)
    d = L.smin(d, L.sd_capsule(P, (0, 1.5, 0.0), (0, 1.6, 0.01), 0.06, 0.055), 0.03)
    d = L.smin(d, L.sd_chain(P, [(0, 0.9, 0), (0, 0.6, -0.15), (0, 0.4, -0.5), (0, 0.45, -0.95), (0, 0.65, -1.25)], [0.19, 0.16, 0.12, 0.08, 0.05]), 0.06)
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.75, -1.38), (0.3, 0.12, 0.04)), 0.04)                 # aleta de la cola
    return d

def triton_col(P, N):
    col = skin_col(P, (0.6, 0.5, 0.4))
    sc = 0.5 + 0.5 * np.sin(P[:, 0] * 200) * np.sin(P[:, 1] * 150 + P[:, 2] * 150)
    col = mix(col, C(0.25, 0.42, 0.4) * (0.7 + 0.4 * sc)[:, None], P[:, 1] < 0.95)
    col = mix(col, C(0.2, 0.22, 0.16), (P[:, 1] > 1.76) | ((P[:, 1] > 1.6) & (P[:, 1] < 1.68) & (P[:, 2] > 0.05)))
    return np.clip(col, 0, 1)

def build_triton():
    root = bpy.data.objects.new('CR_triton', None); SC.collection.objects.link(root)
    b = make_part('CR_triton_cuerpo', triton_body, (-0.55, 0.2, -1.5), (0.55, 1.92, 0.35), 0.01, (0, 0, 0), 11000, root)
    eyes(b, [(-0.033, 1.745, 0.105), (0.033, 1.745, 0.105)], 0.011, (0.1, 0.25, 0.2, 1))
    paint([b], 'triton_piel', triton_col, rough=0.5)
    return root

# ---- la tortuga de Escirón (Plutarco, Teseo 10): tortuga de mar enorme
def tortuga_body(P):
    d = L.sd_ellipsoid(P, (0, 0.35, 0), (0.75, 0.32, 0.95))
    d = L.smax(d, -(P[:, 1] - 0.12), 0.05)
    d = L.smin(d, L.sd_capsule(P, (0, 0.28, 0.85), (0, 0.35, 1.2), 0.17, 0.15), 0.06)
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.36, 1.3), (0.17, 0.14, 0.2)), 0.05)
    for k in (-1, 1):
        d = L.smin(d, L.sd_ellipsoid(P, (k * 0.95, 0.15, 0.45), (0.45, 0.05, 0.2)), 0.08)          # aletas delanteras
        d = L.smin(d, L.sd_ellipsoid(P, (k * 0.6, 0.12, -0.8), (0.25, 0.05, 0.18)), 0.08)
    return d

def tortuga_col(P, N):
    v = L.fbm(P * 3, 2, 3); cell = 0.5 + 0.5 * np.sin(P[:, 0] * 9) * np.sin(P[:, 2] * 9)
    col = mix(np.tile(C(0.3, 0.26, 0.16), (len(P), 1)), C(0.5, 0.42, 0.24), cell)
    col = mix(col, C(0.18, 0.15, 0.1), np.clip(1 - np.abs(np.sin(P[:, 0] * 9) * np.sin(P[:, 2] * 9)) * 6, 0, 1) * (P[:, 1] > 0.3))
    col = mix(col, C(0.45, 0.42, 0.34), (P[:, 1] < 0.3))
    return np.clip(col * (0.85 + 0.3 * v[:, None]), 0, 1)

def build_tortuga():
    root = bpy.data.objects.new('CR_tortuga', None); SC.collection.objects.link(root)
    b = make_part('CR_tortuga_cuerpo', tortuga_body, (-1.5, 0.0, -1.2), (1.5, 0.75, 1.6), 0.014, (0, 0, 0), 10000, root)
    eyes(b, [(-0.12, 0.42, 1.4), (0.12, 0.42, 1.4)], 0.025, (0.05, 0.04, 0.03, 1))
    paint([b], 'tortuga', tortuga_col, rough=0.6)
    return root

# ---- zorra de Teumeso (Apolodoro II 4,7; Pausanias IX 19,1)
def zorra_body(P):
    d = L.sd_ellipsoid(P, (0, 0.55, 0), (0.15, 0.17, 0.42))
    d = L.smin(d, L.sd_ellipsoid(P, (0, 0.53, 0.25), (0.15, 0.2, 0.2)), 0.08)
    d = L.smax(d, -(P[:, 1] - 0.38), 0.05)
    d = L.smin(d, L.sd_capsule(P, (0, 0.6, 0.32), (0, 0.75, 0.5), 0.1, 0.075), 0.06)
    h = L.sd_ellipsoid(P, (0, 0.78, 0.55), (0.09, 0.08, 0.1))
    h = L.smin(h, L.sd_capsule(P, (0, 0.76, 0.6), (0, 0.72, 0.8), 0.045, 0.015), 0.03)         # hocico fino
    for k in (-1, 1): h = L.smin(h, L.sd_capsule(P, (k * 0.05, 0.85, 0.52), (k * 0.08, 0.98, 0.5), 0.03, 0.006), 0.015)   # orejas grandes
    return L.smin(d, h, 0.03)

def zorra_col(P, N):
    col = np.tile(C(0.8, 0.42, 0.16), (len(P), 1))
    col = mix(col, C(0.95, 0.92, 0.86), np.clip(-N[:, 1], 0, 1) * (P[:, 2] > 0.1) * (P[:, 1] > 0.35))
    col = mix(col, C(0.95, 0.92, 0.86), (P[:, 2] > 0.62) & (P[:, 1] < 0.74))
    col = mix(col, C(0.12, 0.08, 0.06), np.clip((0.2 - P[:, 1]) / 0.1, 0, 1))
    col = mix(col, C(0.95, 0.94, 0.9), P[:, 2] < -0.92)
    return np.clip(col * (0.86 + 0.25 * hair(P)[:, None]), 0, 1)

ZORRA = dict(body=zorra_body, lo=(-0.3, 0.3, -0.5), hi=(0.3, 1.05, 0.9), col=zorra_col, foot='pata', tris=9000, step=0.008,
  eyes=([(-0.045, 0.81, 0.62), (0.045, 0.81, 0.62)], 0.012, (0.6, 0.4, 0.05, 1)),
  legs=[([(-0.08, 0.5, 0.25), (-0.08, 0.3, 0.23), (-0.08, 0.05, 0.26)], [0.05, 0.03, 0.03]), ([(0.08, 0.5, 0.25), (0.08, 0.3, 0.23), (0.08, 0.05, 0.26)], [0.05, 0.03, 0.03]),
        ([(-0.08, 0.52, -0.3), (-0.08, 0.32, -0.24), (-0.08, 0.2, -0.36), (-0.08, 0.05, -0.32)], [0.07, 0.035, 0.03, 0.03]), ([(0.08, 0.52, -0.3), (0.08, 0.32, -0.24), (0.08, 0.2, -0.36), (0.08, 0.05, -0.32)], [0.07, 0.035, 0.03, 0.03])],
  tail=(lambda P: L.sd_chain(P, [(0, 0.58, -0.38), (0, 0.5, -0.65), (0, 0.42, -0.95)], [0.05, 0.09, 0.05]) - 0.02 * L.fbm(P * 30, 2, 3), (-0.2, 0.25, -1.1), (0.2, 0.75, -0.3), (0, 0.58, -0.38)))

# ---- serpiente grande genérica: espiral en el suelo, cuello alzado y cabeza aparte (para que ataque)
SERP_NECK = (0, 1.7, 1.0)
def serp_coil(P):
    r = np.sqrt(P[:, 0] ** 2 + P[:, 2] ** 2); th = np.arctan2(P[:, 2], P[:, 0]); best = None
    for k in range(-1, 4):
        tt = th + k * 2 * math.pi; valid = (tt >= 0) & (tt <= 2.5 * 2 * math.pi)
        rr = 1.4 - tt / (2 * math.pi) * 0.42; rad = 0.14 + 0.1 * np.clip(tt / (5 * math.pi), 0, 1)
        dd = np.sqrt((r - rr) ** 2 + (P[:, 1] - rad) ** 2) - rad; dd = np.where(valid, dd, 9.0); best = dd if best is None else np.minimum(best, dd)
    ang = 2.5 * 2 * math.pi; e = (0.35 * math.cos(ang), 0.24, 0.35 * math.sin(ang))
    neck = L.sd_chain(P, [e, (0.1, 0.6, 0.5), (0.05, 1.2, 0.8), SERP_NECK], [0.24, 0.22, 0.19, 0.16])
    return L.smin(best, neck, 0.08) - 0.006 * (L.fbm(P * 30, 2, 31) - 0.5)

def serp_head(P):
    return ladon_head(P - np.asarray(SERP_NECK) + np.asarray(LADON_NECK))

def build_serp():
    root = bpy.data.objects.new('CR_serp', None); SC.collection.objects.link(root)
    b = make_part('CR_serp_cuerpo', serp_coil, (-1.7, -0.02, -1.7), (1.7, 1.95, 1.7), 0.014, (0, 0, 0), 12000, root)
    hd = make_part('CR_serp_cabeza', serp_head, (-0.35, 1.3, 0.85), (0.35, 2.2, 2.0), 0.009, SERP_NECK, 6000, root)
    c = SERP_NECK; eyes(hd, [(c[0] - 0.11, c[1] + 0.12, c[2] + 0.555), (c[0] + 0.11, c[1] + 0.12, c[2] + 0.555)], 0.022, (0.85, 0.6, 0.05, 1))
    paint([b, hd], 'serp_escamas', ladon_col, rough=0.5)
    return root

BUILD2 = {'centauro': lambda: build_quad('centauro', CENTAURO), 'pegaso': lambda: build_quad('pegaso', PEGASO), 'grifo': lambda: build_quad('grifo', GRIFO),
          'quimera': lambda: build_quad('quimera', QUIMERA), 'esfinge': lambda: build_quad('esfinge', ESFINGE), 'arpia': build_arpia, 'gorgona': build_gorgona,
          'triton': build_triton, 'tortuga': build_tortuga, 'zorra': lambda: build_quad('zorra', ZORRA), 'serp': build_serp}
BUILD = {'leon': build_leon, 'ave': build_ave, 'mino': build_mino, 'cierva': lambda: build_quad('cierva', CIERVA), 'jabali': lambda: build_quad('jabali', JABALI),
         'toro': lambda: build_quad('toro', TORO), 'yegua': lambda: build_quad('yegua', YEGUA), 'cerbero': lambda: build_quad('cerbero', dog_spec(3, True)),
         'ortro': lambda: build_quad('ortro', dog_spec(2, False)), 'ladon': build_ladon}
made = []
if ONLY and 'lote2' in ONLY:
    BUILD = BUILD2; OUT = OUT.replace('criaturas.glb', 'criaturas2.glb'); TEX = 512; ONLY = [x for x in ONLY if x != 'lote2'] or None
for k, fn in BUILD.items():
    if ONLY and k not in ONLY: continue
    r = fn(); made.append(r)
    if k not in ('leon', 'ave', 'mino'): r.location = (len(made) * 5.0, 0, 0)

if PREV:
    SC.render.engine = 'CYCLES'; SC.cycles.samples = 32; SC.cycles.device = 'CPU'; SC.view_settings.view_transform = 'Standard'
    SC.render.resolution_x = 900; SC.render.resolution_y = 600
    w = bpy.data.worlds.new('w'); SC.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.6, 0.65, 0.7, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.7
    sun = bpy.data.objects.new('sol', bpy.data.lights.new('sol', 'SUN')); SC.collection.objects.link(sun); sun.rotation_euler = (0.7, 0.2, 0.9); sun.data.energy = 3
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); SC.collection.objects.link(cam); SC.camera = cam
    for r in made:
        if r.name != 'CR_leon':
            for nm, off in (('34', Vector((2.2, -2.2, 1.2))), ('frente', Vector((0.4, -2.4, 0.5)))):
                big = {'CR_toro': 1.6, 'CR_ladon': 2.0, 'CR_jabali': 1.2, 'CR_cerbero': 1.1, 'CR_ortro': 1.1, 'CR_cierva': 1.4, 'CR_yegua': 1.6}.get(r.name, 1.0); tgt = r.location + Vector((0, 0, 0.3 if r.name == 'CR_mino' else (0 if r.name == 'CR_ave' else 0.6 * big))); cam.location = tgt + off * (0.6 if r.name == 'CR_mino' else big); cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
                SC.render.filepath = PREV.replace('.png', '_%s_%s.png' % (r.name, nm)); bpy.ops.render.render(write_still=True)
            continue
        for nm, off, tz in (('34', Vector((2.6, -2.6, 1.0)), 1.0), ('cara', Vector((0.6, -1.6, 0.15)), 1.3), ('lado', Vector((3.4, 0.0, 0.3)), 0.9)):
            tgt = Vector((0, -0.2 if nm != 'cara' else -1.1, tz)); cam.location = tgt + off; cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
            SC.render.filepath = PREV.replace('.png', '_%s_%s.png' % (r.name, nm)); bpy.ops.render.render(write_still=True)
for r in made: r.location = (0, 0, 0)
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_apply=True, export_yup=True, export_image_format='JPEG', export_jpeg_quality=85)
print('CRIATURAS', OUT, os.path.getsize(OUT))
