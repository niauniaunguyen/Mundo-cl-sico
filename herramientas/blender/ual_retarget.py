# Animaciones de la Universal Animation Library de Quaternius (CC0, quaternius/ual_standard.glb) pasadas al esqueleto de personajes.py.
# Lo usa personajes.py (animate) si existe el archivo; si no, quedan las animaciones hechas a mano.
# Método: cada hueso nuestro sigue a uno de Quaternius. Se toma como postura de referencia el primer fotograma de su «Idle_Loop» (de pie,
# brazos abajo, como nuestra postura de reposo) y en cada fotograma se calcula cuánto ha girado el hueso de origen respecto a esa
# referencia (en el espacio del esqueleto); ese giro se aplica al hueso nuestro sobre su postura de reposo. La cadera, además, sube y baja
# (y se balancea) como la del origen, a escala de la pierna.
import bpy, os
from mathutils import Quaternion, Vector, Matrix
UAL = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'quaternius', 'ual_standard.glb')
MAP = {'hips': 'DEF-hips', 'spine': 'DEF-spine.001', 'chest': 'DEF-spine.003', 'neck': 'DEF-neck', 'head': 'DEF-head'}
for k in ('L', 'R'):
    MAP.update({'clavicle.' + k: 'DEF-shoulder.' + k, 'upperarm.' + k: 'DEF-upper_arm.' + k, 'forearm.' + k: 'DEF-forearm.' + k, 'hand.' + k: 'DEF-hand.' + k,
                'thigh.' + k: 'DEF-thigh.' + k, 'shin.' + k: 'DEF-shin.' + k, 'foot.' + k: 'DEF-foot.' + k})
# nuestras acciones ← las suyas (nombre que espera el juego: andar y quieto; las demás, para gestos y oficios)
CLIPS = {'andar': 'Walk_Loop', 'quieto': 'Idle_Loop', 'hablar': 'Idle_Talking_Loop', 'sentado': 'Sitting_Idle_Loop', 'correr': 'Jog_Fwd_Loop',
         'solemne': 'Walk_Formal_Loop', 'agachado': 'Fixing_Kneeling', 'coger': 'PickUp_Table', 'empujar': 'Push_Loop', 'antorcha': 'Idle_Torch_Loop', 'bailar': 'Dance_Loop'}
AIM = ('clavicle', 'upperarm', 'forearm', 'hand', 'thigh', 'shin', 'foot')
_SRC = None
def source():
    global _SRC
    if _SRC and _SRC['arm'].name in bpy.data.objects: return _SRC
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=UAL)
    new = [o for o in bpy.data.objects if o not in before]; arm = [o for o in new if o.type == 'ARMATURE'][0]
    for o in new:
        if o.type == 'MESH': o.hide_render = True; o.hide_viewport = True
    acts = {a.name: a for a in bpy.data.actions if a.name in CLIPS.values() or a.name.split('|')[-1] in CLIPS.values()}
    byname = {}
    for a in bpy.data.actions:
        for v in CLIPS.values():
            if a.name == v or a.name.endswith('|' + v) or a.name.startswith(v): byname.setdefault(v, a)
    ad = arm.animation_data_create()
    for t in list(ad.nla_tracks): ad.nla_tracks.remove(t)
    _SRC = {'arm': arm, 'acts': byname, 'new': new}; return _SRC
def _arm_q(arm, pb):
    return (arm.matrix_world @ pb.matrix).to_quaternion()
def _arm_head(arm, pb):
    return arm.matrix_world @ pb.head
def sample(src, clip, step=1):
    # poses (giros y cabeza de la cadera, en el espacio del mundo) de un clip de origen, fotograma a fotograma
    arm = src['arm']; a = src['acts'].get(clip)
    if not a: return None
    arm.animation_data.action = a
    try:
        slot = a.slots[0] if hasattr(a, 'slots') and len(a.slots) else None
        if slot is not None: arm.animation_data.action_slot = slot
    except Exception: pass
    f0, f1 = int(a.frame_range[0]), int(a.frame_range[1]); out = []
    for f in range(f0, f1 + 1, step):
        bpy.context.scene.frame_set(f)
        D = {}
        for b, sname in MAP.items():
            pb = arm.pose.bones[sname]; D['_d' + b] = ((arm.matrix_world @ pb.tail) - (arm.matrix_world @ pb.head)).normalized()
        out.append({b: _arm_q(arm, arm.pose.bones[s]) for b, s in MAP.items()} | {'_hip': _arm_head(arm, arm.pose.bones['DEF-hips'])} | D)
    return out
def retarget(arm, prefix, names=None, bmap=None, aim=None, hip='hips', thigh='thigh.L'):
    global MAP, AIM
    M0, A0 = MAP, AIM
    if bmap: MAP = bmap
    if aim: AIM = aim
    try: return _retarget(arm, prefix, names, hip, thigh)
    finally: MAP, AIM = M0, A0
def _retarget(arm, prefix, names, hip, thigh):
    src = source(); ref = sample(src, 'Idle_Loop')[0]
    sleg = (src['arm'].matrix_world @ src['arm'].data.bones['DEF-thigh.L'].head_local).z
    tleg = (arm.matrix_world @ arm.data.bones[thigh].head_local).z; k = tleg / max(1e-3, sleg)
    ad = arm.animation_data_create(); made = []
    for pb in arm.pose.bones: pb.rotation_mode = 'QUATERNION'
    order = [b.name for b in arm.data.bones]   # los padres antes que los hijos (orden de creación)
    rest = {b.name: (arm.matrix_world.to_quaternion() @ b.matrix_local.to_quaternion()) for b in arm.data.bones}
    for ours, clip in CLIPS.items():
        if names and ours not in names: continue
        fr = sample(src, clip)
        if not fr: print('UAL falta', clip); continue
        a = bpy.data.actions.new(prefix + ours); ad.action = a
        for i, P in enumerate(fr):
            Qd = {}
            for bn in order:
                pb = arm.pose.bones[bn]
                if bn in MAP:
                    Qd[bn] = P[bn] @ ref[bn].inverted() @ rest[bn]
                    # brazos y piernas: además, el hueso apunta exactamente hacia donde apunta el de origen (si no, la diferencia entre las
                    # dos posturas de reposo abre las piernas y dobla las rodillas hacia delante)
                    if bn.split('.')[0] in AIM or bn in AIM:
                        d0 = Qd[bn] @ Vector((0, 1, 0)); Qd[bn] = d0.rotation_difference(P['_d' + bn]) @ Qd[bn]
                else: Qd[bn] = (Qd[pb.parent.name] @ rest[pb.parent.name].inverted() @ rest[bn]) if pb.parent else rest[bn]
                if pb.parent: off = rest[pb.parent.name].inverted() @ rest[bn]; qb = off.inverted() @ Qd[pb.parent.name].inverted() @ Qd[bn]
                else: qb = rest[bn].inverted() @ Qd[bn]
                pb.rotation_quaternion = qb; pb.keyframe_insert('rotation_quaternion', frame=i + 1)
            d = (P['_hip'] - ref['_hip']) * k; hb = arm.pose.bones[hip]
            if ours in ('andar', 'correr', 'solemne'): d.y = 0.0   # en el sitio: el juego mueve a la persona
            hb.location = rest[hip].inverted() @ d; hb.keyframe_insert('location', frame=i + 1)
        slot = getattr(ad, 'action_slot', None); tr = ad.nla_tracks.new(); tr.name = prefix + ours; st = tr.strips.new(prefix + ours, 1, a)
        if slot is not None and hasattr(st, 'action_slot'): st.action_slot = slot
        if os.environ.get('NOSTOS_UALDBG') and ours == 'andar':
            import math
            f = 9; bpy.context.scene.frame_set(f + 1); bpy.context.view_layer.update()
            sa = src['arm']; sa.animation_data.action = src['acts'][clip]; bpy.context.scene.frame_set(int(src['acts'][clip].frame_range[0]) + f)
            for bn in ('thigh.L', 'shin.L', 'foot.L', 'upperarm.L', 'forearm.L', 'spine', 'head'):
                t = arm.pose.bones[bn]; o = sa.pose.bones[MAP[bn]]
                dt = (arm.matrix_world @ t.tail - arm.matrix_world @ t.head).normalized(); ds = (sa.matrix_world @ o.tail - sa.matrix_world @ o.head).normalized()
                print('DBG', bn, 'nuestro', [round(v, 2) for v in dt], 'origen', [round(v, 2) for v in ds])
        ad.action = None; made.append((ours, len(fr)))
    for pb in arm.pose.bones: pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0)
    print('UAL', prefix, made); return made
def cleanup():
    global _SRC
    if not _SRC: return
    for o in _SRC['new']:
        try: bpy.data.objects.remove(o)
        except Exception: pass
    _SRC = None
