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
# ---- razas de perro antiguas, a partir del perro de Quaternius (no hay un pack CC0 de razas accesible): la malla se deforma por zonas
# según el hueso que más la mueve (cabeza, hocico, torso, pecho, patas, orejas, cola) y se repinta; los huesos no cambian, así que usan
# las mismas animaciones que 'dog' (el juego las comparte). Fuentes de las razas: Jenofonte, Cinegético III-IV (laconios y sus tipos);
# Aristóteles, Historia de los animales IX 1 (molosos); Estrabón VI 2.11 y Plinio III 152 (el perrito de Melite); Grattio, Cinegética
# 154-200 (el umbro, de buen olfato y cobarde); Opiano, Cinegética I 373 ss. (el cretense).
#   zonas: (ancho de cabeza, largo de hocico, ancho del torso, hondo del pecho, grosor de patas, tamaño de orejas, pelo); colores: (manto, segundo, claro)
BREEDS={'moloss':((1.22,0.72,1.22,1.1,1.3,0.7,0.0),('#4e3c2e','#5e4836','#8a7058')),
        'laconian':((0.8,1.25,0.8,1.2,0.8,0.85,0.0),('#a8784a','#8a5e34','#d8b88a')),
        'cretan':((0.9,1.1,0.9,1.05,0.9,1.0,0.0),('#9a5a30','#b0703a','#e0c090')),
        'melitan':((1.05,0.75,1.0,0.95,0.95,0.9,0.05),('#efe8dc','#e6ddcc','#f6f2ea')),
        'umbrian':((0.95,1.1,0.95,1.05,1.0,1.3,0.0),('#7a5232','#2e241c','#c8a070'))}
def _hex(h):h=h.lstrip('#');c=[int(h[i:i+2],16)/255 for i in(0,2,4)];return tuple(x**2.2 for x in c)+(1,)
def breed(name,P,C):
    before=set(bpy.data.objects);acts0=set(bpy.data.actions)
    bpy.ops.import_scene.gltf(filepath=os.path.join(SRC,'Husky.gltf'))
    new=[o for o in bpy.data.objects if o not in before];arm=[o for o in new if o.type=='ARMATURE'][0];me=[o for o in new if o.type=='MESH'][0]
    for a in [a for a in bpy.data.actions if a not in acts0]:bpy.data.actions.remove(a)
    if arm.animation_data:arm.animation_data.action=None
    hw,sl,tw,cd,lt,ea,fl=P;M=me.data;G={g.index:g.name for g in me.vertex_groups}
    dom=[];
    for v in M.vertices:
        best=max(v.groups,key=lambda g:g.weight,default=None);dom.append(G[best.group] if best else '')
    import mathutils
    zs=[v.co.z for v in M.vertices];H=max(zs)-min(zs)
    cen={}
    for v,d in zip(M.vertices,dom):c=cen.setdefault(d,[mathutils.Vector(),0]);c[0]+=v.co;c[1]+=1
    cen={k:c[0]/c[1] for k,c in cen.items()}
    tor=[cen[k] for k in('Torso','Torso2','Torso3','Back','Body') if k in cen];tz=sum(c.z for c in tor)/len(tor)
    for v,d in zip(M.vertices,dom):
        co=v.co.copy();c=cen.get(d,co)
        if d in('Head','Neck3'):
            co.x*=hw
            if co.y<cen['Head'].y:co.y=cen['Head'].y+(co.y-cen['Head'].y)*sl   # el hocico (la cara mira hacia -Y)
        elif d in('Body','Back','Torso','Torso2','Torso3','Neck1','Neck2'):
            co.x*=tw
            if d in('Torso2','Torso3') and co.z<tz:co.z=tz+(co.z-tz)*cd   # pecho más hondo
        elif 'Leg' in d or 'Shoulder' in d:co.x=c.x+(co.x-c.x)*lt;co.y=c.y+(co.y-c.y)*lt
        elif d.startswith('Ear'):r=cen.get('Ear1'+d[-2:],c);co=r+(co-r)*ea
        elif d.startswith('Tail'):co.x=c.x+(co.x-c.x)*lt;co.z=c.z+(co.z-c.z)*lt
        v.co=co
    if fl:
        for v in M.vertices:v.co+=v.normal*fl*H
    # colores: el manto oscuro, el gris y el blanco del husky pasan a los de la raza (ojos y nariz siguen negros)
    for m in M.materials:
        b=m.node_tree.nodes['Principled BSDF'].inputs['Base Color'];r=b.default_value[0]
        if r>0.6:b.default_value=_hex(C[2])
        elif r>0.2:b.default_value=_hex(C[1])
        elif r>0.04:b.default_value=_hex(C[0])
    zs=[(me.matrix_world@mathutils.Vector(c)).z for c in me.bound_box];k=0.6/(max(zs)-min(zs))*1.12
    for r in [o for o in new if o.parent is None]:r.scale*=k
    arm.name='Q_'+name;me.name='Q_'+name+'_malla';print('raza',name)
for n,(P,C) in BREEDS.items():breed(n,P,C)
# el perro de la calle (el husky): con el color de los perros mediterráneos, leonado
for m in bpy.data.objects['Q_dog_malla'].data.materials:
    b=m.node_tree.nodes['Principled BSDF'].inputs['Base Color'];r=b.default_value[0]
    if r>0.6:b.default_value=_hex('#e0c8a0')
    elif r>0.2:b.default_value=_hex('#b08a5a')
    elif r>0.04:b.default_value=_hex('#8a6a42')
bpy.ops.export_scene.gltf(filepath=os.path.abspath(OUT),export_format='GLB',export_skins=True,export_animations=True,export_animation_mode='NLA_TRACKS',
    export_apply=False,export_yup=True,export_texcoords=False,export_materials='EXPORT',export_optimize_animation_size=True,export_force_sampling=True,export_frame_step=2)
print('escrito',os.path.abspath(OUT),os.path.getsize(OUT)//1024,'KB')
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import compactar_glb;compactar_glb.main(os.path.abspath(OUT),os.path.abspath(OUT.replace('.glb','_juego.glb')))
print('juego',os.path.getsize(OUT.replace('.glb','_juego.glb'))//1024,'KB')
