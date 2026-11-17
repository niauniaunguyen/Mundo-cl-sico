# Animales con esqueleto y animaciones de Quaternius («Ultimate Animated Animals», CC0, dominio público) para el juego.
#   /opt/bvenv/bin/python herramientas/blender/animales_quaternius.py RUTA/glTF   → modelos/animales_q.glb (y modelos/animales_q_juego.glb)
# Origen: pack de @Quaternius (quaternius.com), copia en github.com/Tekh-ops/Ultimate-Animated-Animals-July-2021 (License.txt: CC0 1.0).
# Se quedan solo los animales que encajan en la Antigüedad mediterránea (no la alpaca, americana, ni el shiba, japonés) y solo las
# animaciones que usa el juego: andar, galope, quieto y comer. Cada animal es un esqueleto Q_<especie> y sus animaciones se llaman
# <especie>|Walk, <especie>|Gallop, <especie>|Idle, <especie>|Eating. Tamaño real (cruz en metros) según la especie.
import bpy,os,sys,math
SRC=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else sys.argv[-1]
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','modelos','animales_q.glb')
# especie del juego: (archivo, alzada a la cruz en m o largo, eje): caballos griegos y romanos pequeños (1,40-1,50 m), burro 1,10, buey 1,40
SP={'horse':('Horse.gltf',1.45),'donkey':('Donkey.gltf',1.1),'cow':('Cow.gltf',1.3),'bull':('Bull.gltf',1.45),
    'deer':('Deer.gltf',0.95),'stag':('Stag.gltf',1.15),'wolf':('Wolf.gltf',0.75),'fox':('Fox.gltf',0.4),'dog':('Husky.gltf',0.6)}
KEEP=('Walk','Gallop','Idle','Eating')
bpy.ops.wm.read_factory_settings(use_empty=True)
for sp,(fn,h) in SP.items():
    before=set(bpy.data.objects);acts0=set(bpy.data.actions)
    bpy.ops.import_scene.gltf(filepath=os.path.join(SRC,fn))
    new=[o for o in bpy.data.objects if o not in before];arm=[o for o in new if o.type=='ARMATURE'][0]
    roots=[o for o in new if o.parent is None]
    # escala: altura total del modelo en reposo → h (la cruz queda algo más baja que la cabeza; basta para el juego)
    import mathutils
    zs=[(o.matrix_world@mathutils.Vector(c)).z for o in new if o.type=='MESH' for c in o.bound_box]
    k=h/(max(zs)-min(zs))*1.12
    for r in roots:r.scale*=k
    arm.name='Q_'+sp
    for o in new:
        if o.type=='MESH':o.name='Q_'+sp+'_malla'
    # las animaciones: solo las que usa el juego, renombradas y puestas como pistas NLA del esqueleto
    ad=arm.animation_data or arm.animation_data_create();ad.action=None
    for t in list(ad.nla_tracks):ad.nla_tracks.remove(t)
    for a in [a for a in bpy.data.actions if a not in acts0]:
        base=a.name.split('|')[-1].split('.')[0]
        base=base.replace(arm.name+'_','')
        nm=next((x for x in KEEP if base==x or base.endswith('_'+x) or base.endswith(x) and not base.endswith('Gallop_Jump') and len(base)-len(x)<12),None)
        if nm and 'Jump' not in base and not base.endswith(('Headlow','HeadLow','Idle_2','Left','Right')) and (sp+'|'+nm) not in bpy.data.actions:
            a.name=sp+'|'+nm;tr=ad.nla_tracks.new();tr.name=a.name;tr.strips.new(a.name,0,a)
        else:bpy.data.actions.remove(a)
    print(sp,'animaciones:',[t.name for t in ad.nla_tracks],'escala',round(k,4))
bpy.ops.export_scene.gltf(filepath=os.path.abspath(OUT),export_format='GLB',export_skins=True,export_animations=True,export_animation_mode='NLA_TRACKS',
    export_apply=False,export_yup=True,export_texcoords=False,export_materials='EXPORT',export_optimize_animation_size=True,export_force_sampling=True,export_frame_step=2)
print('escrito',os.path.abspath(OUT),os.path.getsize(OUT)//1024,'KB')
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import compactar_glb;compactar_glb.main(os.path.abspath(OUT),os.path.abspath(OUT.replace('.glb','_juego.glb')))
print('juego',os.path.getsize(OUT.replace('.glb','_juego.glb'))//1024,'KB')
