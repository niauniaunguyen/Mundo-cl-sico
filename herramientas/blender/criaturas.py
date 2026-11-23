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

# ==================================================================== construir y exportar
BUILD = {'leon': build_leon, 'ave': build_ave, 'mino': build_mino}
made = []
for k, fn in BUILD.items():
    if ONLY and k not in ONLY: continue
    made.append(fn())

if PREV:
    SC.render.engine = 'CYCLES'; SC.cycles.samples = 32; SC.cycles.device = 'CPU'; SC.view_settings.view_transform = 'Standard'
    SC.render.resolution_x = 900; SC.render.resolution_y = 600
    w = bpy.data.worlds.new('w'); SC.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.6, 0.65, 0.7, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.7
    sun = bpy.data.objects.new('sol', bpy.data.lights.new('sol', 'SUN')); SC.collection.objects.link(sun); sun.rotation_euler = (0.7, 0.2, 0.9); sun.data.energy = 3
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); SC.collection.objects.link(cam); SC.camera = cam
    for r in made:
        if r.name != 'CR_leon':
            for nm, off in (('34', Vector((2.2, -2.2, 1.2))), ('frente', Vector((0.4, -2.4, 0.5)))):
                tgt = r.location + Vector((0, 0, 0.3 if r.name == 'CR_mino' else 0)); cam.location = tgt + off * (0.6 if r.name == 'CR_mino' else 1.0); cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
                SC.render.filepath = PREV.replace('.png', '_%s_%s.png' % (r.name, nm)); bpy.ops.render.render(write_still=True)
            continue
        for nm, off, tz in (('34', Vector((2.6, -2.6, 1.0)), 1.0), ('cara', Vector((0.6, -1.6, 0.15)), 1.3), ('lado', Vector((3.4, 0.0, 0.3)), 0.9)):
            tgt = Vector((0, -0.2 if nm != 'cara' else -1.1, tz)); cam.location = tgt + off; cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()
            SC.render.filepath = PREV.replace('.png', '_%s_%s.png' % (r.name, nm)); bpy.ops.render.render(write_still=True)
for r in made: r.location = (0, 0, 0)
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_apply=True, export_yup=True, export_image_format='JPEG', export_jpeg_quality=85)
print('CRIATURAS', OUT, os.path.getsize(OUT))
