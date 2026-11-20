# Personajes de Nóstos (prototipo): una sola malla con esqueleto, ropa con caída y texturas pintadas.
# Se ejecuta con Blender como módulo de Python:  /opt/bvenv/bin/python herramientas/blender/personajes.py
# Salida: modelos/personajes.glb (no toca modelos/atenas_modelos.blend).
# Convención del proyecto: Z arriba, el personaje mira hacia -Y, metros. Lado .L = +X.
# Personajes: «ciudadano» (quitón largo y himation, Atenas 386 a.C.) y «hoplita» (quitón corto, coraza de lino con pteryges,
# grebas, casco corintio, escudo redondo (aspis) y lanza (dory)). Fuentes: Hope, Costumes of the Greeks and Romans (láms. 1-40);
# la panoplia del hoplita según la cerámica ática y los ejemplares de Olimpia (casco corintio, escudo de 0,9 m de diámetro).
import bpy,bmesh,math,random,os,sys
import numpy as np
from mathutils import Vector,Matrix,Euler
from mathutils.bvhtree import BVHTree
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','modelos')
TEX=os.path.join(OUT,'tex_personajes');os.makedirs(TEX,exist_ok=True)
TAU=math.tau
bpy.ops.wm.read_factory_settings(use_empty=True)
scn=bpy.context.scene

# ------------------------------------------------------------------ esqueleto
# articulaciones (proporciones algo heroicas: hombros anchos, manos y pies algo grandes, 7,3 cabezas)
J={'hips':(0,0,0.98),'spine':(0,0,1.10),'chest':(0,0,1.30),'neck':(0,0,1.50),'head':(0,0,1.585),'top':(0,0,1.81)}
for s,k in((1,'L'),(-1,'R')):
    J['clav.'+k]=(0.035*s,0.0,1.445);J['sho.'+k]=(0.205*s,0.01,1.44);J['elb.'+k]=(0.255*s,0.03,1.16);J['wri.'+k]=(0.275*s,-0.0,0.91);J['fin.'+k]=(0.285*s,-0.02,0.79)
    J['hip.'+k]=(0.095*s,0,0.95);J['kne.'+k]=(0.105*s,-0.015,0.53);J['ank.'+k]=(0.105*s,0.02,0.085);J['toe.'+k]=(0.11*s,-0.13,0.025)
BONES=[('hips','hips','spine',None),('spine','spine','chest','hips'),('chest','chest','neck','spine'),('neck','neck','head','chest'),('head','head','top','neck')]
for k in('L','R'):
    BONES+=[('clavicle.'+k,'clav.'+k,'sho.'+k,'chest'),('upperarm.'+k,'sho.'+k,'elb.'+k,'clavicle.'+k),('forearm.'+k,'elb.'+k,'wri.'+k,'upperarm.'+k),('hand.'+k,'wri.'+k,'fin.'+k,'forearm.'+k),
            ('thigh.'+k,'hip.'+k,'kne.'+k,'hips'),('shin.'+k,'kne.'+k,'ank.'+k,'thigh.'+k),('foot.'+k,'ank.'+k,'toe.'+k,'shin.'+k)]
def make_armature(name):
    ad=bpy.data.armatures.new(name);ob=bpy.data.objects.new(name,ad);scn.collection.objects.link(ob)
    bpy.context.view_layer.objects.active=ob;bpy.ops.object.mode_set(mode='EDIT')
    for bn,a,b,par in BONES:
        e=ad.edit_bones.new(bn);e.head=J[a];e.tail=J[b]
        if bn.startswith('foot'):e.roll=0
        if par:e.parent=ad.edit_bones[par];e.use_connect=False
    bpy.ops.object.mode_set(mode='OBJECT');return ob

# ------------------------------------------------------------------ cuerpo: modificador de piel sobre un grafo de articulaciones
def body_mesh(name,female=False):
    me=bpy.data.meshes.new(name);ob=bpy.data.objects.new(name,me);scn.collection.objects.link(ob)
    bm=bmesh.new();V={}
    pts=dict(J);pts['pelvis']=(0,0,0.9);pts['crotch']=(0,0,0.86)
    for s,k in((1,'L'),(-1,'R')):
        pts['bic.'+k]=tuple(Vector(J['sho.'+k]).lerp(Vector(J['elb.'+k]),0.45));pts['fore.'+k]=tuple(Vector(J['elb.'+k]).lerp(Vector(J['wri.'+k]),0.35))
        pts['thi.'+k]=tuple(Vector(J['hip.'+k]).lerp(Vector(J['kne.'+k]),0.4));pts['calf.'+k]=tuple(Vector(J['kne.'+k]).lerp(Vector(J['ank.'+k]),0.3))
        pts['thu.'+k]=(0.262*s,-0.05,0.862);pts['heel.'+k]=(0.105*s,0.06,0.04);pts['trap.'+k]=(0.1*s,0.012,1.47)
        pts['delt.'+k]=(0.225*s,0.005,1.4);pts['pal.'+k]=(0.281*s,-0.018,0.86)
        for f,(dx,dy) in enumerate(((-0.018,-0.012),(-0.006,-0.016),(0.006,-0.015),(0.017,-0.01))):pts['f%d.'%f+k]=(0.281*s+dx*s*0.6,-0.018+dy-0.006*abs(dx)/0.018,0.79+0.012*abs(dx)/0.018*(1 if f in(0,3) else 0))
    del pts['top'];del pts['fin.L'];del pts['fin.R']
    for k,p in pts.items():V[k]=bm.verts.new(p)
    E=[('pelvis','hips'),('hips','spine'),('spine','chest'),('chest','neck'),('neck','head')]
    for k in('L','R'):
        E+=[('neck','trap.'+k),('chest','clav.'+k),('clav.'+k,'sho.'+k),('sho.'+k,'delt.'+k),('delt.'+k,'bic.'+k),('bic.'+k,'elb.'+k),('elb.'+k,'fore.'+k),('fore.'+k,'wri.'+k),('wri.'+k,'pal.'+k),('pal.'+k,'f0.'+k),('pal.'+k,'f1.'+k),('pal.'+k,'f2.'+k),('pal.'+k,'f3.'+k),('wri.'+k,'thu.'+k),
            ('pelvis','hip.'+k),('hip.'+k,'thi.'+k),('thi.'+k,'kne.'+k),('kne.'+k,'calf.'+k),('calf.'+k,'ank.'+k),('ank.'+k,'toe.'+k),('ank.'+k,'heel.'+k)]
    for s_,k_ in((1,'L'),(-1,'R')):
        for nm,co in(('lat.'+k_,(0.105*s_,0.025,1.24)),('pec.'+k_,(0.07*s_,-0.065 if not female else -0.08,1.31 if not female else 1.29)),('bk.'+k_,(0.075*s_,0.075,1.35))):
            V[nm]=bm.verts.new(co);pts[nm]=co;E.append(('chest',nm))
    for a,b in E:bm.edges.new((V[a],V[b]))
    bm.to_mesh(me);bm.free()
    sk=ob.modifiers.new('piel','SKIN')
    R={'pelvis':(0.155,0.115),'hips':(0.15,0.11),'spine':(0.14,0.11),'chest':(0.17,0.13),'neck':(0.064,0.062),'head':(0.06,0.06),'crotch':(0.1,0.08)}
    if female:R.update({'hips':(0.178,0.118),'spine':(0.128,0.092),'chest':(0.158,0.112),'pelvis':(0.175,0.118)})
    for k in('L','R'):
        R.update({'lat.'+k:((0.07,0.07) if female else (0.1,0.085)),'bk.'+k:((0.065,0.06) if female else (0.085,0.075)),'pec.'+k:((0.06,0.055) if female else (0.075,0.06)),'trap.'+k:(0.055,0.06),'clav.'+k:(0.07,0.07),'sho.'+k:(0.078,0.075),'delt.'+k:(0.074,0.072),'bic.'+k:(0.064,0.066),'elb.'+k:(0.048,0.05),'fore.'+k:(0.056,0.05),'wri.'+k:(0.034,0.026),'pal.'+k:(0.04,0.018),'thu.'+k:(0.012,0.012),'f0.'+k:(0.008,0.008),'f1.'+k:(0.009,0.009),'f2.'+k:(0.009,0.009),'f3.'+k:(0.008,0.008),
                  'hip.'+k:(0.095,0.09),'thi.'+k:(0.09,0.09),'kne.'+k:(0.057,0.06),'calf.'+k:(0.066,0.068),'ank.'+k:(0.038,0.04),'toe.'+k:(0.045,0.025),'heel.'+k:(0.035,0.03)})
    keys=list(pts.keys())
    for i,v in enumerate(me.skin_vertices[0].data):
        r=R.get(keys[i],(0.05,0.05))
        if female and any(keys[i].startswith(p) for p in('sho','delt','bic','elb','fore','wri','trap','clav')):r=(r[0]*0.84,r[1]*0.84)
        if female and any(keys[i].startswith(p) for p in('kne','calf','ank')):r=(r[0]*0.9,r[1]*0.9)
        v.radius=r
    me.skin_vertices[0].data[keys.index('pelvis')].use_root=True
    sub=ob.modifiers.new('sub','SUBSURF');sub.levels=2;sub.render_levels=2   # dos niveles: cuello, hombros, brazos y manos redondeados (con uno, el cuello salía en aristas)
    bpy.context.view_layer.objects.active=ob
    for m in list(ob.modifiers):bpy.ops.object.modifier_apply(modifier=m.name)
    fix_normals(ob)
    return ob

def fix_normals(ob):
    me=ob.data;me.validate(verbose=False);bm=bmesh.new();bm.from_mesh(me);bmesh.ops.remove_doubles(bm,verts=bm.verts,dist=1e-6)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(me);bm.free()
    for p in me.polygons:p.use_smooth=True
# ------------------------------------------------------------------ cabeza esculpida (malla aparte, con su propia proyección UV)
HC=Vector((0,-0.01,1.655));HR=(0.099,0.106,0.127)
def _g(p,c,s):return math.exp(-((p[0]-c[0])**2+(p[1]-c[1])**2+(p[2]-c[2])**2)/(s*s))
def head_shape(x,y,z):   # desplazamiento radial sobre la esfera unidad (delante = -Y)
    fr=max(0,-y);d=0
    for s in(1,-1):
        d+=0.075*_g((x,y,z),(0.33*s,-0.9,0.3),0.2)      # arco de las cejas
        d-=0.075*_g((x,y,z),(0.33*s,-0.92,0.07),0.15)   # cuencas de los ojos
        d+=0.075*_g((x,y,z),(0.56*s,-0.72,-0.08),0.2)   # pómulos
        d-=0.03*_g((x,y,z),(0.58*s,-0.62,-0.38),0.18)   # hundimiento bajo el pómulo
        d-=0.04*_g((x,y,z),(0.82*s,-0.35,0.28),0.25)    # sienes
        d+=0.06*_g((x,y,z),(0.1*s,-0.97,-0.29),0.07)    # aletas de la nariz
        d-=0.025*_g((x,y,z),(0.16*s,-0.95,-0.22),0.05)   # surco junto a las aletas
    rz=min(1,max(0,(0.14-z)/0.42))**1.3;nose=0.27*math.exp(-(x/(0.045+0.035*rz))**2)*rz*(1 if z>-0.29 else math.exp(-((z+0.29)/0.035)**2))*min(1,fr*2.2)
    d+=nose
    d+=0.03*_g((x,y,z),(0,-0.97,0.22),0.12)   # entrecejo
    d-=0.02*math.exp(-(x/0.25)**2-((z+0.42)/0.12)**2)*fr      # la boca, algo más atrás que la nariz
    d+=0.03*math.exp(-(x/0.2)**2-((z+0.47)/0.06)**2)*fr      # labio superior
    d-=0.03*math.exp(-(x/0.2)**2-((z+0.555)/0.03)**2)*fr      # línea de la boca
    d+=0.04*math.exp(-(x/0.16)**2-((z+0.63)/0.07)**2)*fr      # labio inferior
    d+=0.11*_g((x,y,z),(0,-0.82,-0.84),0.22)                  # barbilla
    return d
def _interp(tab,h):   # interpolación suave en una tabla [(h,valor)] ordenada de arriba abajo
    if h>=tab[0][0]:return tab[0][1]
    for (h0,v0),(h1,v1) in zip(tab,tab[1:]):
        if h1<=h<=h0:t=(h0-h)/(h0-h1);t=t*t*(3-2*t);return v0+(v1-v0)*t
    return tab[-1][1]
# medidas de una cabeza adulta (m), con la altura relativa al centro HC: coronilla +0,13, cejas +0,035, ojos +0,008, boca -0,07, mentón -0,11
HF=[(0.13,0.0),(0.125,0.03),(0.11,0.06),(0.09,0.077),(0.065,0.087),(0.045,0.093),(0.033,0.097),(0.02,0.088),(0.008,0.086),(-0.01,0.088),(-0.03,0.09),(-0.045,0.09),(-0.06,0.089),(-0.075,0.088),(-0.09,0.088),(-0.1,0.086),(-0.108,0.074),(-0.115,0.05),(-0.125,0.044),(-0.16,0.044)]   # fondo delante (perfil)
HW=[(0.13,0.0),(0.125,0.03),(0.11,0.055),(0.09,0.068),(0.06,0.075),(0.03,0.077),(0.0,0.076),(-0.02,0.074),(-0.04,0.069),(-0.06,0.062),(-0.08,0.054),(-0.095,0.044),(-0.105,0.034),(-0.115,0.044),(-0.125,0.05),(-0.16,0.05)]   # medio ancho
HB=[(0.13,0.0),(0.125,0.035),(0.11,0.07),(0.085,0.095),(0.05,0.104),(0.015,0.1),(-0.02,0.09),(-0.05,0.075),(-0.08,0.06),(-0.11,0.052),(-0.16,0.05)]   # fondo detrás
HP=[(0.13,2.2),(0.06,2.3),(0.02,2.6),(-0.02,2.5),(-0.05,2.1),(-0.08,1.8),(-0.105,1.7),(-0.12,2.0),(-0.16,2.0)]   # forma de la sección delantera: más cuadrada en los pómulos, en V hacia el mentón
HEADFEM=[False]
def head_point(a,h):   # a: ángulo desde delante (0) hacia +X; h: altura sobre HC
    w=_interp(HW,h)*(0.96 if HEADFEM[0] and h<0 else 1);f=_interp(HF,h);bk=_interp(HB,h);p=_interp(HP,h) if math.cos(a)>0 else 2.2
    sa,ca=math.sin(a),math.cos(a)
    x=w*math.copysign(abs(sa)**(2/p),sa);y=-(f if ca>0 else -bk)*abs(ca)**(2/p) if ca>0 else bk*abs(ca)**(2/p)
    g=lambda X,Y,Z,cx,cz,r:math.exp(-((X-cx)**2+(Z-cz)**2)/(r*r))
    d=Vector((0,0,0));fr=max(0,ca)
    if fr>0:
        nx=abs(x);out=Vector((0,-1,0))
        # nariz: puente estrecho desde la raíz (h 0,022) hasta la punta (h -0,034), y la base que vuelve a la cara (h -0,044)
        if -0.046<h<0.024:
            t=max(0.0,(0.022-h)/0.056);amp=0.004+0.024*min(1,t)**1.6 if h>-0.034 else 0.028*max(0,(h+0.046)/0.012)**0.8
            nw=0.006+0.009*min(1,t)**1.2
            if HEADFEM[0]:amp*=0.8;nw*=0.85
            d+=out*amp*math.exp(-(nx/nw)**2)
        d+=out*0.007*g(nx,0,h,0.013,-0.038,0.007)   # aletas
        d-=out*0.004*g(nx,0,h,0.0,-0.05,0.006)*0   # (sin uso)
        # labios
        d+=out*0.0045*math.exp(-(nx/0.02)**2-((h+0.063)/0.006)**2)
        d-=out*0.0006*math.exp(-(nx/0.022)**2-((h+0.0705)/0.0015)**2)
        d+=out*0.004*math.exp(-(nx/0.018)**2-((h+0.077)/0.006)**2)
        d-=out*0.003*math.exp(-(nx/0.016)**2-((h+0.086)/0.005)**2)   # surco bajo el labio
        d+=out*(0.004 if HEADFEM[0] else 0.006)*math.exp(-(nx/0.022)**2-((h+0.098)/0.01)**2)   # mentón
        # cuencas de los ojos, pómulos y sienes
        d-=out*0.009*g(nx,0,h,0.032,0.008,0.016)
        d+=out*0.003*g(nx,0,h,0.03,0.034,0.014)   # arco de las cejas
        d+=Vector((math.copysign(1,x),0,0))*0.004*g(nx,0,h,0.058,-0.012,0.016)
        d+=out*0.003*g(nx,0,h,0.05,-0.008,0.016)
        d-=Vector((math.copysign(1,x),0,0))*0.003*g(nx,0,h,0.07,0.035,0.02)
    return HC+Vector((x,y,h))+d*fr**0.5
def head_point_mh(a,h):
    if HEADBVH is None:return head_point(a,h)
    o=HC+Vector((0,0,h));d=Vector((math.sin(a),-math.cos(a),0))
    hit=HEADBVH.ray_cast(o+d*0.3,-d,0.3)
    return hit[0] if hit[0] is not None else head_point(a,h)
def head_mesh(name,beard=False):
    NU,NV=112,84;bm=bmesh.new();rows=[]
    hs=[0.13-i*(0.29/NV) for i in range(NV+1)]
    for h in hs:
        rows.append([bm.verts.new(head_point((i/NU)*TAU,h)) for i in range(NU)])
    for j in range(NV):
        for i in range(NU):bm.faces.new((rows[j][i],rows[j][(i+1)%NU],rows[j+1][(i+1)%NU],rows[j+1][i]))
    bmesh.ops.remove_doubles(bm,verts=bm.verts,dist=1e-5)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    # aberturas de los ojos (almendra): detrás van los globos oculares
    kill=[]
    for f in bm.faces:
        q=f.calc_center_median()-HC;a=math.atan2(q.x,-q.y)
        for sg in(1,-1):
            da=a-EYE_A*sg;zz=q.z-EYE_Z
            if (da/EYE_W)**2+(zz/(EYE_H*(1-0.3*(da*sg)/EYE_W)))**2<1:kill.append(f)
    bmesh.ops.delete(bm,geom=kill,context='FACES')
    # borde liso: cada vértice del contorno se lleva exactamente a la curva de la almendra (sin escalones por los que asome el globo)
    for v in bm.verts:
        if not v.is_boundary:continue
        q=v.co-HC;a=math.atan2(q.x,-q.y)
        for sg in(1,-1):
            da=a-EYE_A*sg;dz=q.z-EYE_Z
            if abs(da)>EYE_W*1.6 or abs(dz)>EYE_H*2.5:continue
            hh=EYE_H*(1-0.3*(da*sg)/EYE_W);e=math.sqrt((da/EYE_W)**2+(dz/hh)**2)
            if e<1e-6:continue
            da2,dz2=da/e,dz/e;a2=EYE_A*sg+da2;r=math.hypot(q.x,q.y)
            v.co=HC+Vector((r*math.sin(a2),-r*math.cos(a2),EYE_Z+dz2))
    bm.normal_update()
    for v in bm.verts:   # párpados: el superior sobresale y baja un poco sobre el ojo; el inferior marca el borde
        q=v.co-HC;a=math.atan2(q.x,-q.y)
        for sg in(1,-1):
            da=a-EYE_A*sg;dz=q.z-EYE_Z;e=math.sqrt((da/EYE_W)**2+(dz/EYE_H)**2)
            if 0.85<e<2.0 and abs(da)<EYE_W*1.3:
                k=max(0,1-(e-0.85)/1.15)
                if dz>0:v.co+=v.normal*0.0026*k-Vector((0,0,0.0006*k))
                else:v.co+=v.normal*0.0014*k
    me=bpy.data.meshes.new(name);bm.to_mesh(me);bm.free();ob=bpy.data.objects.new(name,me);scn.collection.objects.link(ob)
    for p in me.polygons:p.use_smooth=True
    head_uv(me)
    return ob
EYE_A,EYE_Z,EYE_W,EYE_H=0.36,0.008,0.13,0.0064
def eye_mesh(name,head):   # globos oculares detrás de las aberturas, mirando al frente
    bm=bmesh.new();hb=BVHTree.FromObject(head,bpy.context.evaluated_depsgraph_get());CEN={}
    for sg in(1,-1):
        d=Vector((math.sin(EYE_A*sg),-math.cos(EYE_A*sg),0)).normalized();o=HC+Vector((0,0,EYE_Z))
        # radio de la cara en el borde de la abertura (a los lados del ojo, a su altura): el globo queda justo por dentro
        Rs=[]
        for da in(-EYE_W*1.15,EYE_W*1.15):
            dd=Vector((math.sin(EYE_A*sg+da),-math.cos(EYE_A*sg+da),0)).normalized();hit=hb.ray_cast(o+dd*0.3,-dd,0.3)
            if hit[0]:Rs.append((hit[0]-o).length)
        R=sum(Rs)/len(Rs) if Rs else 0.085
        c=o+d*(R-0.0118);r=0.0118;CEN[sg]=c+d*r   # la pupila, centrada en el punto del globo que asoma por la abertura (antes en el centro del globo: quedaba 5 mm hacia la nariz y la persona parecía bizca)
        g=bmesh.ops.create_uvsphere(bm,u_segments=16,v_segments=12,radius=r,matrix=Matrix.Translation(c)@Euler((math.radians(90),0,0)).to_matrix().to_4x4())
    me=bpy.data.meshes.new(name);bm.to_mesh(me);bm.free();ob=bpy.data.objects.new(name,me);scn.collection.objects.link(ob)
    for p in me.polygons:p.use_smooth=True
    uv=me.uv_layers.new(name='UVMap')   # proyección frontal centrada en cada globo: los dos miran al frente (sin estrabismo)
    for poly in me.polygons:
        for li in poly.loop_indices:
            co=me.vertices[me.loops[li].vertex_index].co;sg=1 if co.x>0 else -1;c=CEN[sg]
            uv.data[li].uv=(0.5+(co.x-c.x)/0.03,0.5+(co.z-c.z)/0.03)
    return ob
# ------------------------------------------------------------------ cabeza de MakeHuman (CC0): malla base hm08 con deformaciones de sexo, edad y origen
# Sustituye a la cabeza esculpida con fórmulas (head_mesh), que de cerca quedaba plana: nariz pintada, labios de raya, mentón en pico.
# Datos: makehuman/cabeza_mh.npz (ver makehuman/LEEME.md y makehuman_extraer.py). Se lleva al sistema del juego (Z arriba, cara hacia -Y,
# metros) con los ojos donde estaban (EYE_Z sobre HC) y la coronilla a la misma distancia de los ojos.
MH=np.load(os.path.join(os.path.dirname(os.path.abspath(__file__)),'makehuman','cabeza_mh.npz'))
LM={'mouth':-0.0705}
# mezcla por tipo de personaje: (fracción de «viejo», rasgos sueltos). Origen: mediterráneo, sobre todo «caucásico» con algo de los otros dos.
MHKIND={'ciudadano':(0.45,{'r_nose_hump_incr':0.35,'r_chin_prominent_incr':0.2}),'hoplita':(0.1,{'r_chin_width_incr':0.4,'r_head_square':0.3}),
        'obrero':(0.25,{'r_nose_width1_incr':0.4,'r_head_square':0.2}),'togado':(0.55,{'r_nose_scale_vert_incr':0.3,'r_forehead_trans_backward':0.3}),
        'tunicado':(0.35,{'r_nose_width1_incr':0.25,'r_chin_width_incr':0.2}),
        'legionario':(0.15,{'r_chin_width_incr':0.3,'r_l_cheek_bones_incr':0.3,'r_r_cheek_bones_incr':0.3}),
        'mujer':(0.05,{'r_mouth_upperlip_volume_incr':0.35,'r_mouth_lowerlip_volume_incr':0.35,'r_head_oval':0.5,'r_chin_width_decr':0.5,'r_nose_scale_horiz_decr':0.4,'r_head_scale_horiz_decr':0.35,'r_chin_prominent_decr':0.3,'r_r_eye_scale_incr':0.25,'r_l_eye_scale_incr':0.25}),
        'romana':(0.2,{'r_mouth_lowerlip_volume_incr':0.25,'r_nose_scale_vert_incr':0.2,'r_head_oval':0.4,'r_chin_width_decr':0.4,'r_head_scale_horiz_decr':0.3,'r_mouth_scale_horiz_decr':0.2})}
def mh_points(kind,female):
    old,extra=MHKIND.get(kind,(0.2,{}));sx='female' if female else 'male'
    P=MH['verts'].astype(float).copy()
    for eth,we in(('caucasian',0.74),('african',0.13),('asian',0.13)):
        for age,wa in(('young',1-old),('old',old)):
            if we*wa>0:P+=MH['%s_%s_%s'%(eth,sx,age)].astype(float)*1e-3*we*wa
    for k,w in extra.items():P+=MH[k].astype(float)*1e-3*w
    if not female:
        for k in('r_r_eye_scale_incr','r_l_eye_scale_incr'):P+=MH[k].astype(float)*1e-3*0.2
    return P
def mh_head(name,kind,female):
    global EYE_A,EYE_Z,EYE_W,EYE_H
    P=mh_points(kind,female);Q=MH['quads'];G=MH['group']
    eyes=[np.unique(Q[G==g]) for g in(1,2)];ec=[P[e].mean(0) for e in eyes];er=np.mean([np.ptp(P[e][:,0]) for e in eyes])/2
    em=(ec[0]+ec[1])/2;bv=np.unique(Q[G==0]);u=1.0/0.122*(P[:,1].max()-em[1])   # u: unidades de MakeHuman por cada 0,122 m (aprox.)
    band=bv[np.abs(P[bv,1]-em[1]-0.025*u)<0.008*u]   # a la altura de las cejas (u: unidades de MakeHuman por metro, aprox.)
    s=(0.188 if female else 0.196)/np.ptp(P[band,2])   # longitud media de la cabeza adulta (glabela-opistocráneo)
    tgt=Vector((0,HC.y-0.066,HC.z+0.008))
    W=np.stack([P[:,0]-em[0],-(P[:,2]-em[2]),P[:,1]-em[1]],1)*s+np.array(tgt)
    # la cabeza (sin el arranque de los hombros, que tapan el cuerpo y la ropa)
    keep=[i for i in range(len(Q)) if G[i]==0 and W[Q[i]][:,2].max()>1.462]
    def mk(nm,faces):
        used=np.unique(Q[faces]);m={k:j for j,k in enumerate(used)}
        me=bpy.data.meshes.new(nm);me.from_pydata([tuple(W[k]) for k in used],[],[[m[k] for k in Q[f]] for f in faces]);me.update()
        ob=bpy.data.objects.new(nm,me);scn.collection.objects.link(ob)
        for p in me.polygons:p.use_smooth=True
        return ob
    head=mk(name,keep)
    sub=head.modifiers.new('sub','SUBSURF');sub.levels=1;bpy.context.view_layer.objects.active=head;bpy.ops.object.modifier_apply(modifier='sub')
    fix_normals(head);head_uv(head.data)
    # los ojos: globos de MakeHuman, con la pupila en el punto que asoma
    eye=mk(name.replace('_cabeza','')+'_ojos',[i for i in range(len(Q)) if G[i] in(1,2)])
    CEN={}
    for sg,e in((1,0),(-1,1)):
        c=Vector(W[eyes[e]].mean(0));sg2=1 if c.x>0 else -1;CEN[sg2]=c+Vector((0,-er*s,0))
    uv=eye.data.uv_layers.new(name='UVMap')
    for poly in eye.data.polygons:
        for li in poly.loop_indices:
            co=eye.data.vertices[eye.data.loops[li].vertex_index].co;c=CEN[1 if co.x>0 else -1]
            uv.data[li].uv=(0.5+(co.x-c.x)/0.03,0.5+(co.z-c.z)/0.03)
    # referencias para la textura pintada (cejas, párpados, labios) y para el pelo
    c1=CEN[1]-HC;EYE_A=math.atan2(c1.x,-c1.y);EYE_Z=c1.z;EYE_W=0.95*er*s/math.hypot(c1.x,c1.y);EYE_H=0.33*er*s
    cl=[(v[2]-HC.z,v[1]) for v in W if abs(v[0])<0.003 and -0.1<v[2]-HC.z<-0.03]
    if cl:
        yf=min(y for h,y in cl);nt=min(cl,key=lambda t:t[1])[0]   # la punta de la nariz
        inner=[h for h,y in cl if yf+0.019<y<yf+0.032 and nt-0.05<h<nt-0.02]   # el interior de la boca, entre los labios
        if inner:LM['mouth']=sum(inner)/len(inner)
        print('boca',name,round(LM['mouth'],4),'nariz',round(nt,4))
    global HEADBVH
    HEADBVH=BVHTree.FromObject(head,bpy.context.evaluated_depsgraph_get())
    return head,eye
HEADBVH=None
_head_point_formula=None
def eye_tex(name,size=128):
    H=W=size;v,u=np.mgrid[0:H,0:W];x=(u+0.5)/W-0.5;y=(v+0.5)/H-0.5;r=np.hypot(x,y)
    col=np.ones((H,W,3))*hexc('#ece6dc');col*=(1-0.25*np.clip(r*2,0,1))[...,None]
    yi=y-0.035;ri=np.hypot(x,yi);iris=ri<0.21;col[iris]=hexc('#5a3a1e')*(0.8+0.4*np.cos(np.arctan2(y,x)*18)[iris][:,None]*0.15+0.0)
    col[ri<0.09]=hexc('#0a0605');col[(np.hypot(x+0.06,yi-0.06)<0.035)]=hexc('#ffffff')   # brillo
    return save_png(name,np.clip(blur(col,1),0,1))
def head_uv(me):   # UV cilíndrica: la cara queda en el centro de la textura
    uv=me.uv_layers.get('UVMap') or me.uv_layers.new(name='UVMap')
    for poly in me.polygons:
        for li in poly.loop_indices:
            co=me.vertices[me.loops[li].vertex_index].co-HC;a=math.atan2(co.x,-co.y)
            uv.data[li].uv=(0.5+a/TAU,(co.z+0.16)/0.34)
def nose_mesh(name):   # nariz: puente estrecho que se ensancha hacia la punta, con aletas
    bm=bmesh.new();N=14;K=14;rings=[]
    for i in range(N+1):
        t=i/N;z=HC.z+0.018-t*0.052;w=0.006+0.0078*t**1.5;pr=0.004+0.025*t**1.25   # ancho y cuánto sobresale
        yb=HC.y-HR[1]*0.985   # superficie de la cara
        ring=[]
        for k in range(K):
            q=k/K*TAU;x=math.cos(q)*w;yy=-max(0,math.sin(q))*pr+0.004
            if t>0.8:x*=1+0.3*(t-0.8)/0.2*(1-abs(math.sin(q)))   # aletas
            if t>0.9:yy*=1-0.5*(t-0.9)/0.1   # la punta se redondea hacia abajo
            ring.append(bm.verts.new((x,yb+yy,z)))
        rings.append(ring)
    for i in range(N):
        for k in range(K):bm.faces.new((rings[i][k],rings[i][(k+1)%K],rings[i+1][(k+1)%K],rings[i+1][k]))
    bm.faces.new(rings[-1]);bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    ob=obj_from_bm(name,bm);head_uv(ob.data);return ob
def ear_mesh(name):
    bm=bmesh.new()
    for s in(1,-1):
        g=bmesh.ops.create_uvsphere(bm,u_segments=14,v_segments=12,radius=1)
        for v in g['verts']:
            x,y,z=v.co
            if x>0:x=x*0.35+0.65*x*(1-math.exp(-(y*y+z*z)/0.45))   # concha hundida, borde (hélice) más grueso
            yy=y*(1-0.25*max(0,-z))   # lóbulo más estrecho
            v.co=Vector((x*0.0075*s,yy*0.02,z*0.03))
            v.co=Euler((math.radians(-8),0,math.radians(-18*s))).to_matrix()@v.co+HC+Vector((0.08*s,0.014,-0.006))
    me=bpy.data.meshes.new(name);bm.to_mesh(me);bm.free();ob=bpy.data.objects.new(name,me);scn.collection.objects.link(ob)
    for p in me.polygons:p.use_smooth=True
    head_uv(me);return ob
HL0=[0.066]
def hairline(a):t=abs(a)/math.pi;return HL0[0]-0.05*_sm(t/0.5)-0.085*_sm((t-0.55)/0.45)+0.004*math.sin(a*13)   # alta en la frente, baja por las sienes y cubre la nuca
def _sm(x):x=min(1,max(0,x));return x*x*(3-2*x)
def hair_weight(kind,co):   # 0 fuera, 1 dentro, con transición suave en el borde
    q=co-HC;a=math.atan2(q.x,-q.y);z=q.z
    if kind=='cejas':
        w=0
        for sg in(1,-1):
            da=a-EYE_A*sg;zb=EYE_Z+0.0195-0.008*(da*sg/0.13)**2+0.004*(da*sg/0.13)   # arco que sube hacia fuera
            w=max(w,_sm((0.0068-abs(z-zb))/0.003)*_sm((0.14-abs(da+0.015*sg))/0.04))
        return w
    if kind=='pelo':return _sm((z-hairline(a)+0.003)/0.012)
    zl=-0.048+0.05*_sm((abs(a)-0.35)/0.9)
    w=_sm((zl-z)/0.01)*_sm((1.45-abs(a))/0.15)
    wm=_sm((0.2-abs(a))/0.05)*_sm((0.0065-abs(z-LM['mouth']-0.0135))/0.003)   # bigote, sobre el labio superior
    hole=_sm((math.hypot(a/0.27,(z-LM['mouth'])/0.0115)-1)/0.35)   # la boca, sin barba (un óvalo)
    return max(w*hole,wm)
def hair_shell(name,head,kind):   # pelo o barba con volumen: copia de la cabeza en la zona del pelo, que se afina hasta la piel en el borde
    me=head.data;bm=bmesh.new();bm.from_mesh(me);bm.verts.ensure_lookup_table()
    W={v:hair_weight(kind,v.co) for v in bm.verts}
    thr=0.3 if kind=='cejas' else 0.55
    bmesh.ops.delete(bm,geom=[f for f in bm.faces if sum(W[v] for v in f.verts)/len(f.verts)<thr],context='FACES');bm.normal_update()
    bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
    # borde liso: cada vértice del contorno se lleva a la curva en que el peso vale exactamente el umbral (antes, el borde seguía las
    # caras borradas y salía en escalera, en dientes de sierra junto a la frente, las sienes y la barba)
    Wp=lambda a,h:hair_weight(kind,head_point_mh(a,h))-thr
    for v in bm.verts:
        if not v.is_boundary:continue
        q=v.co-HC;a=math.atan2(q.x,-q.y);h=q.z;f0=Wp(a,h);best=None
        for dz in(0.0015,0.003,0.005,0.008,0.012,0.018):
            for sgn in(1,-1):
                h2=h+sgn*dz
                if (Wp(a,h2)>0)!=(f0>0):best=('h',h,h2);break
            if best:break
        if not best:
            for da in(0.01,0.02,0.035,0.05,0.08):
                for sgn in(1,-1):
                    a2=a+sgn*da
                    if (Wp(a2,h)>0)!=(f0>0):best=('a',a,a2);break
                if best:break
        if not best:continue
        lo,hi=best[1],best[2]
        for _ in range(16):
            mid=(lo+hi)/2;fm=Wp(mid,h) if best[0]=='a' else Wp(a,mid)
            if (fm>0)==(f0>0):lo=mid
            else:hi=mid
        v.co=head_point_mh((lo+hi)/2,h) if best[0]=='a' else head_point_mh(a,(lo+hi)/2)
        W[v]=thr
    bm.normal_update()
    for v in bm.verts:
        w=W[v];q=v.co-HC;a=math.atan2(q.x,-q.y);n=v.normal.copy()
        lock=max(0,math.sin(a*14+math.sin(q.z*60)*1.5))**1.5*max(0,math.sin(q.z*110+a*5))   # mechones en relieve
        curl=0.5+0.5*math.sin(a*26+q.z*170)*math.sin(a*11-q.z*90)
        if kind=='cejas':off=0.0028+0.0012*curl
        elif kind=='pelo':off=0.004+0.006*curl+0.005*lock
        else:off=0.003+0.006*curl+0.006*lock+0.012*max(0,-(q.z+0.06))/0.07
        v.co+=n*(off*w*_sm((w-thr)/0.35)+0.0006+0.0012*w)
    me2=bpy.data.meshes.new(name);bm.to_mesh(me2);bm.free();ob=bpy.data.objects.new(name,me2);scn.collection.objects.link(ob)
    for p in me2.polygons:p.use_smooth=True
    head_uv(me2);return ob
def hair_tex(name,base,size=256):   # mechones: rayas finas en dirección de la caída, con brillo
    H=W=size;v,u=np.mgrid[0:H,0:W];u=(u+0.5)/W;v=(v+0.5)/H
    rs=np.random.RandomState(5);n1=blur(rs.rand(H,W),1);ph=np.sin(v*31+u*7)*1.4+np.sin(v*11)*0.8
    st=0.72+0.22*(0.5+0.5*np.sin(u*TAU*150+ph))+0.16*(0.5+0.5*np.sin(u*TAU*47+ph*0.6))*(0.7+0.3*np.sin(u*TAU*9))+0.12*(n1-0.5)
    col=hexc(base)[None,None,:]*st[...,None]*(0.85+0.3*v)[...,None]
    return save_png(name,np.clip(col,0,1))
def limb_shell(name,body,a,b,off,nu=24,nv=10,knee=0.0,gap=0.0):   # pieza ajustada a un miembro (grebas, correas): rayos alrededor del eje a→b
    bvh=BVHTree.FromObject(body,bpy.context.evaluated_depsgraph_get());a=Vector(a);b=Vector(b);ax=(b-a).normalized()
    u1=ax.cross(Vector((1,0,0))).normalized();u2=ax.cross(u1).normalized()
    # el ángulo 0 mira hacia delante (-Y) para poder dejar abierta la parte de atrás
    fw=Vector((0,-1,0));fw=(fw-ax*fw.dot(ax)).normalized();u1=fw;u2=ax.cross(u1).normalized()
    R=[];D=[]
    for j in range(nv+1):
        t=j/nv;p=a.lerp(b,t);rr=[];dd=[]
        for i in range(nu+1):
            an=-(math.pi-gap/2)+i/nu*(TAU-gap) if gap else i/nu*TAU
            d=u1*math.cos(an)+u2*math.sin(an)
            hit=bvh.ray_cast(p+d*0.12,-d,0.12);r=(hit[0]-p).length if hit[0] else None
            rr.append(r);dd.append(d)
        good=[r for r in rr if r];med=sorted(good)[len(good)//2] if good else 0.05
        rr=[r if (r and abs(r-med)<0.025) else med for r in rr]   # fuera los rayos que dan en la otra pierna o se pierden
        for k in range(3):rr=[(rr[max(0,i-1)]+2*rr[i]+rr[min(len(rr)-1,i+1)])/4 for i in range(len(rr))]
        R.append(rr);D.append((p,dd))
    for i in range(nu+1):   # suavizado a lo largo del miembro
        col=[R[j][i] for j in range(nv+1)]
        for k in range(2):col=[(col[max(0,j-1)]+2*col[j]+col[min(nv,j+1)])/4 for j in range(nv+1)]
        for j in range(nv+1):R[j][i]=col[j]
    bm=bmesh.new();rows=[]
    for j in range(nv+1):
        t=j/nv;p,dd=D[j];row=[]
        for i,d in enumerate(dd):
            if not gap and i==nu:break
            fr=max(0,d.dot(Vector((0,-1,0))))
            r=R[j][i]+off+knee*fr**2*math.exp(-((t-0.93)/0.06)**2)
            if j==nv or j==0:r+=0.003
            row.append(bm.verts.new(p+d*r))
        rows.append(row)
    uvl=bm.loops.layers.uv.new('UVMap');n=len(rows[0])
    for j in range(nv):
        for i in range(n if not gap else n-1):
            i2=(i+1)%n
            f=bm.faces.new((rows[j][i],rows[j][i2],rows[j+1][i2],rows[j+1][i]))
            for l,(di,dj) in zip(f.loops,((0,0),(1,0),(1,1),(0,1))):l[uvl].uv=((i+di)/n,(j+dj)/nv)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    ob=obj_from_bm(name,bm);sol=ob.modifiers.new('g','SOLIDIFY');sol.thickness=0.004;bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='g');return ob
def ionic_sleeve(name,sg,sho,elb):
    # manga: tubo holgado del hombro al codo, cerrado arriba con una cúpula que cubre el hombro (antes la boca de arriba quedaba
    # abierta y, vista desde arriba, se veía por dentro como un cilindro hueco)
    sh=Vector(sho);el=Vector(elb);ax=(el-sh).normalized();a0=sh+Vector((-0.02*sg,0,0.02));a1=sh.lerp(el,0.82)
    up=Vector((sg,0,0.35)).normalized();u1=(up-ax*up.dot(ax)).normalized();u2=ax.cross(u1).normalized()
    bm=bmesh.new();N=14;K=22;M=4;rows=[];R0=0.066
    for j in range(M,0,-1):   # cúpula: anillos cada vez más pequeños hacia arriba y hacia el cuello
        ph=j/M*math.pi/2*0.92;c=a0-ax*R0*math.sin(ph)*0.85;r=R0*math.cos(ph)
        rows.append([bm.verts.new(c+(u1*math.cos(k/K*TAU)+u2*math.sin(k/K*TAU))*r) for k in range(K)])
    for i in range(N+1):
        t=i/N;p=a0.lerp(a1,t);R=R0+0.042*min(1,t/0.5)**0.8
        row=[]
        for k in range(K):
            q=k/K*TAU;fold=0.006*(0.3+0.7*t)*(1+math.sin(q*7+t*2))
            sag=0.006*t*max(0,-math.cos(q))   # cuelga un poco por debajo del brazo
            hem=(0.012*math.sin(q*5)+0.01*max(0,-math.cos(q))) if i==N else 0
            row.append(bm.verts.new(p+ax*hem+(u1*math.cos(q)+u2*math.sin(q))*(R+fold)-u1*sag))
        rows.append(row)
    N=len(rows)-1
    uvl=bm.loops.layers.uv.new('UVMap')
    pole=bm.verts.new(a0-ax*R0*0.86)   # polo de la cúpula: la manga queda cerrada del todo por arriba
    for k in range(K):
        f=bm.faces.new((pole,rows[0][(k+1)%K],rows[0][k]))
        for l in f.loops:l[uvl].uv=(k/K,1-M/N)
    for i in range(N):
        for k in range(K):
            f=bm.faces.new((rows[i][k],rows[i][(k+1)%K],rows[i+1][(k+1)%K],rows[i+1][k]))
            for l,(dk,di) in zip(f.loops,((0,0),(1,0),(1,1),(0,1))):l[uvl].uv=((k+dk)/K,1-max(i+di,M)/N)   # la cúpula, con la tela lisa (sin la cenefa del borde)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    ob=obj_from_bm(name,bm);sol=ob.modifiers.new('g','SOLIDIFY');sol.thickness=0.005;bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='g')
    b2=bmesh.new()
    for t in(0.25,0.55,0.85):
        p=a0.lerp(a1,t)+u1*(R0+0.042*min(1,t/0.5)**0.8+0.01)
        bmesh.ops.create_uvsphere(b2,u_segments=8,v_segments=6,radius=0.0075,matrix=Matrix.Translation(p))
    bt=obj_from_bm('fibulas',b2);smart_uv(bt)
    return ob,bt
def shoulder_flap(name,body,sg):
    bvh=BVHTree.FromObject(body,bpy.context.evaluated_depsgraph_get());C=Vector((0.12*sg,0.0,1.36))
    bm=bmesh.new();N=14;Wn=4;rows=[]
    for i in range(N+1):
        t=i/N;ang=-1.25+t*2.5   # de detrás (+Y) a delante (-Y) pasando por encima
        row=[]
        for k in range(Wn+1):
            w=(k/Wn-0.5)*0.11
            d=Vector((0.25*sg,math.sin(-ang),math.cos(ang))).normalized()
            o=C+Vector((w*sg*0.9,0,0))
            hit=bvh.ray_cast(o+d*0.4,-d,0.4);p=(hit[0]+d*0.016) if hit[0] else None
            row.append([p,o,d])
        rows.append(row)
    # radios suavizados (sin saltos si algún rayo falla o da en otra parte)
    for k in range(Wn+1):
        rs=[((r[k][0]-r[k][1]).length if r[k][0] else None) for r in rows];good=sorted(x for x in rs if x);med=good[len(good)//2] if good else 0.13
        rs=[x if (x and abs(x-med)<0.04) else med for x in rs]
        for _ in range(3):rs=[(rs[max(0,i-1)]+2*rs[i]+rs[min(len(rs)-1,i+1)])/4 for i in range(len(rs))]
        for i,r in enumerate(rows):r[k]=r[k][1]+r[k][2]*rs[i]
    rows=[[bm.verts.new(p) for p in r] for r in rows]
    for i in range(N):
        for k in range(Wn):bm.faces.new((rows[i][k],rows[i][k+1],rows[i+1][k+1],rows[i+1][k]))
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    ob=obj_from_bm(name,bm);sol=ob.modifiers.new('g','SOLIDIFY');sol.thickness=0.012;bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='g');return ob
def sandals(name,body):   # sandalias: suela y correas (tobillo, empeine y dedos)
    parts=[]
    for k in('L','R'):
        an=Vector(J['ank.'+k]);to=Vector(J['toe.'+k]);he=an+Vector((0,0.07,-0.06))
        b2=bmesh.new();L=(to-he).length+0.04;c=(he+to)/2;c.z=0.0
        bmesh.ops.create_uvsphere(b2,u_segments=16,v_segments=6,radius=1,matrix=Matrix.Translation(c+Vector((0,-0.01,-0.002)))@Matrix.Diagonal((0.048,L/2,0.009,1)))
        parts.append(obj_from_bm('suela',b2))
        for (t,zz,ln) in((0.0,0.07,0.02),(0.45,0.045,0.02),(0.78,0.03,0.016)):
            p=an.lerp(to,t);p.z=zz if t>0 else an.z+0.02
            ax=Vector((0,0,1)) if t==0 else (to-an).normalized()
            parts.append(limb_shell('correa',body,p-ax*ln/2,p+ax*ln/2,0.004,nu=16,nv=1))
    for o in parts:smart_uv(o)
    return parts
def hide_covered(ob,covers,maxd=0.12,erode=2,radial=False):
    # borra las caras de 'ob' que otras piezas tapan por completo (con un margen de 'erode' anillos junto a los bordes):
    # lo que no existe no puede atravesar la prenda, ni quieto ni andando; y de paso pesa menos
    if not covers:return 0
    cb=bmesh.new()
    for c in covers:
        t=bmesh.new();t.from_mesh(c.data);t.transform(c.matrix_world);me=bpy.data.meshes.new('tmp');t.to_mesh(me);t.free();cb.from_mesh(me);bpy.data.meshes.remove(me)
    bvh=BVHTree.FromBMesh(cb);cb.free()
    bm=bmesh.new();bm.from_mesh(ob.data);bm.verts.ensure_lookup_table();bm.normal_update()
    mw=ob.matrix_world;cov=set()
    for v in bm.verts:
        co=mw@v.co;n=(mw.to_3x3()@v.normal).normalized()
        if radial:
            r=Vector((co.x,co.y,0))
            if r.length>1e-6 and n.dot(r)<0:n=-n
        hit=bvh.ray_cast(co+n*0.0015,n,maxd)
        if hit[0] is not None:cov.add(v)
    for _ in range(erode):cov={v for v in cov if all(e.other_vert(v) in cov for e in v.link_edges)}
    dead=[f for f in bm.faces if all(v in cov for v in f.verts)]
    bmesh.ops.delete(bm,geom=dead,context='FACES');bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
    bm.to_mesh(ob.data);bm.free();ob.data.update();return len(dead)
def drape_weights(ob):   # el extremo del manto cuelga del hombro y del pecho, no de las piernas
    for g in list(ob.vertex_groups):ob.vertex_groups.remove(g)
    C=ob.vertex_groups.new(name='chest');S=ob.vertex_groups.new(name='clavicle.L');H=ob.vertex_groups.new(name='hips')
    for v in ob.data.vertices:
        z=v.co.z;k=min(1,max(0,(z-0.8)/0.6))
        C.add([v.index],0.55*k+0.45*(1-k),'REPLACE');S.add([v.index],0.45*k,'REPLACE');H.add([v.index],0.55*(1-k),'REPLACE')
def _bvh_of(objs):
    cb=bmesh.new()
    for c in objs:
        t=bmesh.new();t.from_mesh(c.data);t.transform(c.matrix_world);me=bpy.data.meshes.new('tmp');t.to_mesh(me);t.free();cb.from_mesh(me);bpy.data.meshes.remove(me)
    b=BVHTree.FromBMesh(cb);cb.free();return b
def drape_end(name,path,width,folds=3,famp=0.03,snug=None,gap=0.025,far=0.03):   # extremo de un manto que cuelga: tira con pliegues en zigzag a lo largo de un camino
    bm=bmesh.new();P=[Vector(p) for p in path];N=24;rows=[];W=8
    pts=[]
    for i in range(N+1):   # interpolación Catmull-Rom
        t=i/N*(len(P)-1);k=min(int(t),len(P)-2);f=t-k
        p0=P[max(0,k-1)];p1=P[k];p2=P[k+1];p3=P[min(len(P)-1,k+2)]
        pts.append(0.5*((2*p1)+(-p0+p2)*f+(2*p0-5*p1+4*p2-p3)*f*f+(-p0+3*p1-3*p2+p3)*f*f*f))
    if snug:   # la línea central de la tira se acerca a la ropa de debajo (a 'gap') donde quedaba más lejos que 'far', y se suaviza:
        bvh=_bvh_of(snug)   # con los puntos a mano, al cambiar el cuerpo y la ropa la tira colgaba a 5-10 cm y hacía un arco sobre el hombro
        for i,p in enumerate(pts):
            loc,_,_,d=bvh.find_nearest(p)
            if loc is not None and d>far:pts[i]=loc+(p-loc).normalized()*gap
        for _ in range(3):pts=[pts[0]]+[(pts[i-1]+pts[i]*2+pts[i+1])/4 for i in range(1,N)]+[pts[N]]
    prev=None
    for i,p in enumerate(pts):   # el ancho de la tira, siempre de lado (x) y sin cambiar de sentido: antes, donde el camino era casi vertical,
        tg=(pts[min(N,i+1)]-pts[max(0,i-1)]).normalized()   # el lado se calculaba al revés y la tira se daba la vuelta (una X a la altura de la mano)
        side=Vector((1,0,0))-tg*tg.x
        if side.length<0.1:side=Vector((0,1,0))-tg*tg.y
        side.normalize()
        if prev is not None and side.dot(prev)<0:side=-side
        prev=side;nrm=side.cross(tg).normalized();t=i/N;w=width*(0.6+0.5*t)
        row=[]
        for k in range(W+1):
            q=k/W-0.5;z=famp*(0.3+0.7*t)*math.sin(q*TAU*folds/1.0+t*2)
            row.append(bm.verts.new(p+side*q*w+nrm*z))
        rows.append(row)
    uvl=bm.loops.layers.uv.new('UVMap')
    for i in range(N):
        for k in range(W):
            f=bm.faces.new((rows[i][k],rows[i][k+1],rows[i+1][k+1],rows[i+1][k]))
            for l,(dk,di) in zip(f.loops,((0,0),(1,0),(1,1),(0,1))):l[uvl].uv=((k+dk)/W*0.25,1-(i+di)/N)
    ob=obj_from_bm(name,bm);sol=ob.modifiers.new('g','SOLIDIFY');sol.thickness=0.008;bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='g');return ob

# ------------------------------------------------------------------ prenda: rejilla alrededor del cuerpo (u = vuelta, v = altura)
def torso_bvh(body):   # el cuerpo sin los brazos: la ropa se ajusta al torso y a las piernas, no envuelve los brazos
    bm=bmesh.new();bm.from_mesh(body.data)
    kill=[v for v in bm.verts if (abs(v.co.x)>0.188 and 0.72<v.co.z<1.39) or (abs(v.co.x)>0.17 and 1.39<=v.co.z<1.48)]
    bmesh.ops.delete(bm,geom=kill,context='VERTS');bm.verts.ensure_lookup_table()
    return BVHTree.FromBMesh(bm)
def garment(name,body,z0,z1,off,nu=72,nv=40,flare=0.0,folds=22,famp=0.012,top=None,skirt=True,clip=None,over=None):
    bvh=torso_bvh(body);bvo=BVHTree.FromObject(over,bpy.context.evaluated_depsgraph_get()) if over else None
    bm=bmesh.new();G=[]
    for j in range(nv+1):
        row=[];t=j/nv
        for i in range(nu):
            u=i/nu;a=u*TAU
            zt=top(u) if top else z1;z=z0+(zt-z0)*t
            d=Vector((math.sin(a),-math.cos(a),0))
            # distancia del eje a la piel: rayo desde fuera hacia el eje
            o=Vector((0,0,z))+d*0.6;hit=bvh.ray_cast(o,-d,0.6)
            r=(hit[0]-Vector((0,0,z))).length if hit[0] else 0.12
            if bvo:
                h2=bvo.ray_cast(o,-d,0.6)
                if h2[0]:r=max(r,(h2[0]-Vector((0,0,z))).length-off+0.016)
            row.append([a,z,r,t])
        G.append(row)
    # la falda no se pega a las piernas: radio mínimo según la altura, y suavizado alrededor
    for j,row in enumerate(G):
        rs=[q[2] for q in row]
        for k in range(3):rs=[max(rs[i],(rs[i-1]+rs[(i+1)%nu])/2) for i in range(nu)]
        for i,q in enumerate(row):
            z=q[1];hem=max(0,(0.95-z))/0.95
            sm=min(1,max(0,(1.02-z)/0.3));sm=sm*sm*(3-2*sm);rmin=(0.165+(0.035+flare*hem)*sm) if skirt and z<1.02 else 0
            drop=1-q[3]
            r=max(rs[i],q[2],rmin*(1.0+0.06*math.cos(2*q[0]))*(0.95+0.1*abs(math.sin(q[0]))))+off
            fd=famp*(0.25+0.75*drop)*math.sin(folds*q[0]+1.7*math.sin(q[0]*3+z*4))
            q.append(r+fd)
    vs=[]
    for j,row in enumerate(G):
        vr=[]
        for i,q in enumerate(row):
            a,z,r=q[0],q[1],q[4]
            if j==0:z+=0.012*math.sin(a*5)+0.008*math.sin(a*11)   # bajo irregular
            vr.append(bm.verts.new((math.sin(a)*r,-math.cos(a)*r,z)))
        vs.append(vr)
    faces=[]
    for j in range(nv):
        for i in range(nu):
            if clip and clip(i/nu,j/nv):continue
            f=bm.faces.new((vs[j][i],vs[j][(i+1)%nu],vs[j+1][(i+1)%nu],vs[j+1][i]));faces.append((f,i,j))
    uvl=bm.loops.layers.uv.new('UVMap')
    for f,i,j in faces:
        for l,(di,dj) in zip(f.loops,((0,0),(1,0),(1,1),(0,1))):l[uvl].uv=((i+di)/nu,(j+dj)/nv)
    loose=[v for v in bm.verts if not v.link_faces]
    bmesh.ops.delete(bm,geom=loose,context='VERTS')
    me=bpy.data.meshes.new(name);bm.to_mesh(me);bm.free();ob=bpy.data.objects.new(name,me);scn.collection.objects.link(ob)
    bm2=bmesh.new();bm2.from_mesh(me)
    for f in bm2.faces:   # hacia fuera: la normal apunta en el sentido contrario al eje
        c=f.calc_center_median();n=f.normal;out=Vector((c.x,c.y,0))
        if n.dot(out)<0:f.normal_flip()
    bm2.to_mesh(me);bm2.free()
    for p in me.polygons:p.use_smooth=True
    sol=ob.modifiers.new('grosor','SOLIDIFY');sol.thickness=0.006;sol.offset=-1
    bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='grosor')
    return ob

# ------------------------------------------------------------------ texturas pintadas (numpy → PNG)
def save_png(name,arr):
    h,w,_=arr.shape;img=bpy.data.images.new(name,w,h,alpha=False)
    rgba=np.concatenate([arr,np.ones((h,w,1))],axis=2).astype(np.float32);img.pixels.foreach_set(rgba.ravel());img.filepath_raw=os.path.join(TEX,name+'.png');img.file_format='PNG';img.save();return img
def hexc(h):h=h.lstrip('#');return np.array([int(h[i:i+2],16)/255 for i in(0,2,4)])
def meander(u,v,period):  # greca: 1 en la línea, 0 fuera (u,v en unidades de módulo)
    x=(u%period)/period*4;y=v*4
    xi=np.floor(x);yi=np.floor(np.clip(y,0,3.999))
    pat=np.array([[1,1,1,1],[1,0,0,0],[1,0,1,1],[1,0,0,1]])   # un módulo de 4x4
    return pat[yi.astype(int),xi.astype(int)]
def cloth_tex(name,base,border=None,band=(0.0,0.06),folds=22,size=256,neck=None,stripe=None,wool=True):
    H=W=size;v,u=np.mgrid[0:H,0:W];u=(u+0.5)/W;v=(v+0.5)/H
    a=u*TAU;f=np.sin(folds*a+1.7*np.sin(a*3+v*4))
    drop=1-v;shade=1+0.16*f*(0.3+0.7*drop)   # pliegues pintados: claro en la cresta, oscuro en el surco
    shade*=0.82+0.22*v   # algo más oscuro abajo
    col=hexc(base)[None,None,:]*shade[...,None]
    if wool:col*=(1+0.05*(np.random.RandomState(3).rand(H,W)-0.5))[...,None]
    def put_band(v0,v1,c):
        m=(v>=v0)&(v<v1)
        if not m.any():return
        loc=(v-v0)/(v1-v0);pat=meander(u*40,np.clip(loc*1.3-0.15,0,0.999),1.0)
        cc=hexc(c);bg=hexc(base)*0.55
        col[m]=np.where((pat[m]==1)[:,None],cc,bg)*shade[m][:,None]
        edge=m&((loc<0.1)|(loc>0.9));col[edge]=cc*shade[edge][:,None]
    if border:put_band(band[0]+0.004,band[1],border)
    if neck:put_band(1-band[1]+0.0,0.996,neck)
    if stripe:   # franja vertical (clavus) delante
        for c0 in stripe:
            m=np.abs(u-c0)<0.012;col[m]=hexc('#7a2a2a')*shade[m][:,None]
    return save_png(name,np.clip(col,0,1))
def blur(img,k=2):
    out=img.copy()
    for _ in range(k):out=(out+np.roll(out,1,0)+np.roll(out,-1,0)+np.roll(out,1,1)+np.roll(out,-1,1))/5
    return out
def skin_tex(name,base,beard=None,hair='#3b2a1e',size=512,front_up=0.0,fem=False):   # cabeza: piel, cejas, ojos, labios y pelo pintados (UV cilíndrica), con bordes suaves
    H=W=size;v,u=np.mgrid[0:H,0:W];u=(u+0.5)/W;v=(v+0.5)/H
    a=(u-0.5)*TAU;z=v*0.34-0.16
    col=np.ones((H,W,3))*hexc(base)
    col*=(1.0+0.05*np.clip((z+0.05)*4,0,1))[...,None]   # abajo, el mismo tono que el cuello del cuerpo (sin costura)
    cheek=np.exp(-((np.abs(a)-0.55)**2/0.04+(z+0.02)**2/0.004));col+=np.array([0.10,0.01,-0.01])*cheek[...,None]*0.6
    def layer(mask,c,k=1.0,soft=1):
        m=blur(mask.astype(float),soft)*k;cc=hexc(c) if isinstance(c,str) else c
        col[:]=col*(1-m[...,None])+cc*m[...,None]
    G=lambda a0,z0,sa,sz:np.exp(-((a-a0)/sa)**2-((z-z0)/sz)**2)
    light=0.09*G(0,0.075,0.5,0.03)+0.07*np.exp(-(a/0.05)**2)*((z>-0.04)&(z<0.03))+0.06*(G(0.55,-0.012,0.15,0.012)+G(-0.55,-0.012,0.15,0.012))+0.04*G(0,-0.1,0.18,0.012)
    shade=0.14*(G(0.34,0.024,0.16,0.008)+G(-0.34,0.024,0.16,0.008))+0.09*(G(0.12,-0.025,0.05,0.022)+G(-0.12,-0.025,0.05,0.022))+0.12*G(0,-0.042,0.1,0.006)
    for s2 in(1,-1):shade+=0.06*np.exp(-((a*s2-(0.17+np.clip(-z-0.04,0,0.06)*1.6))/0.03)**2)*((z<-0.035)&(z>-0.095))   # surcos de la nariz a la boca
    shade+=0.16*np.clip((-z-0.1)/0.05,0,1)+0.12*np.clip((np.abs(a)-0.9)/0.6,0,1)   # bajo la mandíbula y hacia los lados
    shade*=0.5 if fem else 0.75
    light*=0.0;shade=0.5*0.12*np.clip((np.abs(a)-0.9)/0.6,0,1)*np.clip((z+0.1)/0.03,0,1)   # la cabeza de MakeHuman ya tiene relieve: la textura no pinta sombras de nariz ni de surcos   # la luz del juego ya sombrea la cara: la textura solo insinúa (antes, de cerca, parecía sucia)
    col*=(1+light-shade)[...,None]
    red=0.06*(G(0.5,-0.03,0.18,0.02)+G(-0.5,-0.03,0.18,0.02))+0.12*G(0,-0.03,0.06,0.012)   # mejillas y punta de la nariz
    if fem:   # tez clara con albayalde (psimýthion) y colorete en las mejillas: Jenofonte, Económico X 2
        col=col*0.9+np.array([0.96,0.9,0.84])*0.1;red=red*1.7
    col+=np.array([0.10,-0.02,-0.03])[None,None,:]*red[...,None]
    for s2 in(1,-1):
        col*=(1-0.10*G(EYE_A*s2,EYE_Z+0.016,0.13,0.004)-0.07*G(EYE_A*s2,EYE_Z-0.013,0.12,0.006))[...,None]   # pliegue del párpado y ojera
    pore=blur(np.random.RandomState(11).rand(H,W),1);col*=(0.97+0.06*pore)[...,None]
    for s2 in(1,-1):
        da=a-EYE_A*s2
        rim=((da/(EYE_W*1.25))**2+((z-EYE_Z)/(EYE_H*1.45))**2<1)
        layer(rim,'#5a3424',0.18,2)   # sombra del párpado alrededor de la abertura
        layer((np.abs(da)<EYE_W*1.0)&(np.abs(z-EYE_Z-EYE_H*1.05)<0.0012),'#2a1a10',0.5,1)   # línea del párpado superior
        xb=da*s2/0.13;zb=EYE_Z+(0.0215 if fem else 0.0195)-0.005*(xb-0.1)**2-0.002*xb;th=(0.0014 if fem else 0.0028)*(1-0.4*np.clip((da*s2+0.13)/0.26,0,1))
        bmask=(np.abs(da+0.015*s2)<0.14)&(np.abs(z-zb)<th)
        strokes=0.75+0.35*np.sin((a*s2)*260+z*900)
        layer(bmask,hexc(hair)[None,None,:]*strokes[...,None],0.9,1)   # ceja con trazo de pelo
    lipw=0.19*(1-0.35*np.clip(np.abs(a)/0.19,0,1)**2)
    M_=LM['mouth']
    layer((a/0.2)**2+((z-M_-0.0042)/0.0042)**2<1,'#b06058' if fem else '#a06656',0.4,3)   # labio superior
    layer((a/0.18)**2+((z-M_+0.0048)/0.005)**2<1,'#b8706a' if fem else '#a87264',0.3,3)   # labio inferior
    layer((np.abs(a)<0.17)&(np.abs(z-M_)<0.0007),'#6a3a30',0.45,1)   # línea de cierre
    sm_=lambda x:np.clip(x,0,1)**2*(3-2*np.clip(x,0,1));t_=np.abs(a)/np.pi
    hl=HL0[0]-0.05*sm_(t_/0.5)-0.085*sm_((t_-0.55)/0.45)+0.004*np.sin(a*13)+front_up*np.clip(np.cos(a),0,1)
    hm=z>hl;strand=0.85+0.25*np.sin(a*60+z*90+np.sin(a*7)*3)*0.5
    hc=hexc(hair)[None,None,:]*strand[...,None];m=blur(hm.astype(float),2);col[:]=col*(1-m[...,None])+hc*m[...,None]
    if beard:   # la misma zona que la barba con volumen (hair_weight), algo más ancha y con borde suave
        sm=lambda x:np.clip(x,0,1)**2*(3-2*np.clip(x,0,1))
        zl=-0.048+0.05*sm((np.abs(a)-0.35)/0.9)
        hole=sm((np.hypot(a/0.27,(z-LM['mouth'])/0.0115)-1)/0.35);w=np.maximum(sm((zl-z+0.004)/0.01)*sm((1.49-np.abs(a))/0.15)*hole,sm((0.21-np.abs(a))/0.05)*sm((0.0085-np.abs(z-LM['mouth']-0.0135))/0.004))
        bc=hexc(beard)[None,None,:]*(0.8+0.35*np.sin(a*80+z*120)*0.5)[...,None]
        m=blur(w,2)*0.95;col[:]=col*(1-m[...,None])+bc*m[...,None]
    return save_png(name,np.clip(col,0,1))
def plain_tex(name,base,noise=0.06,size=64):
    H=W=size;r=np.random.RandomState(5).rand(H,W);col=hexc(base)[None,None,:]*(1+noise*(r-0.5))[...,None];return save_png(name,np.clip(col,0,1))
def material(name,img=None,color=(1,1,1),metal=0.0,rough=0.8):
    m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value=(*color,1);b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough
    if img:t=m.node_tree.nodes.new('ShaderNodeTexImage');t.image=img;m.node_tree.links.new(t.outputs['Color'],b.inputs['Base Color'])
    return m
def smart_uv(ob):
    bpy.ops.object.select_all(action='DESELECT');ob.select_set(True);bpy.context.view_layer.objects.active=ob
    bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=1.15,island_margin=0.02);bpy.ops.object.mode_set(mode='OBJECT')
def set_mat(ob,m):ob.data.materials.clear();ob.data.materials.append(m)

# ------------------------------------------------------------------ piezas rígidas del hoplita
def obj_from_bm(name,bm):
    me=bpy.data.meshes.new(name);bm.to_mesh(me);bm.free();ob=bpy.data.objects.new(name,me);scn.collection.objects.link(ob)
    for p in me.polygons:p.use_smooth=True
    return ob
def helmet():   # casco corintio: cuenco, carrilleras, nasal y aberturas de los ojos
    bm=bmesh.new();bmesh.ops.create_uvsphere(bm,u_segments=28,v_segments=18,radius=1)
    c=Vector((0,-0.012,1.66))
    kill=[]
    for v in bm.verts:
        x,y,z=v.co
        if z<-0.75 or (z<-0.2 and y>0.55):kill.append(v);continue
        # abertura en T: ojos y boca
        if y<-0.4 and ((-0.05<z<0.18 and abs(x)>0.1 and abs(x)<0.62) or (z<-0.05 and abs(x)<0.18)):kill.append(v);continue
        sx=1.0+0.08*max(0,-z)
        v.co=Vector((x*0.118*sx,y*0.132,z*0.15+(0.02 if z<0 else 0)))+c
    bmesh.ops.delete(bm,geom=kill,context='VERTS')
    ob=obj_from_bm('casco',bm);sol=ob.modifiers.new('g','SOLIDIFY');sol.thickness=0.008;bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='g')
    # cimera de crin: una aleta curva que se afina por delante y por detrás
    b2=bmesh.new();N=20;rings=[]
    for i in range(N+1):
        t=i/N;ang=-1.2+t*2.9;base=Vector((0,math.sin(ang)*0.15-0.012,1.66+math.cos(ang)*0.165))
        h=0.02+0.11*math.sin(t*math.pi)**0.8;w=0.022*(0.6+0.4*math.sin(t*math.pi))
        nrm=(base-Vector((0,-0.012,1.66))).normalized()
        ring=[]
        for k in range(10):
            q=k/10*TAU;off=nrm*(h*0.5*(1+math.sin(q)))+Vector((w*math.cos(q),0,0))
            ring.append(b2.verts.new(base+off))
        rings.append(ring)
    for i in range(N):
        for k in range(10):b2.faces.new((rings[i][k],rings[i][(k+1)%10],rings[i+1][(k+1)%10],rings[i+1][k]))
    b2.faces.new(rings[0][::-1]);b2.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(b2,faces=b2.faces)
    crest=obj_from_bm('cimera',b2)
    return ob,crest
def helmet_tex(name,size=256):   # bronce batido: pátina, línea grabada sobre las cejas que sube a las sienes, arista central y borde marcado
    H=W=size;v,u=np.mgrid[0:H,0:W];u=(u+0.5)/W;v=(v+0.5)/H;a=(u-0.5)*TAU;z=v*0.34-0.16
    r=np.random.RandomState(7)
    col=np.ones((H,W,3))*hexc('#bf9f5a')
    col*=(0.86+0.2*np.clip(z*5+0.4,0,1))[...,None]   # más claro arriba (pulido)
    pat=blur(r.rand(H,W),3);col*=(0.92+0.16*pat)[...,None]
    def line(m,c,k):col[m]=col[m]*(1-k)+hexc(c)*k
    brow=0.035+0.025*np.abs(np.sin(a))**1.5   # línea que sigue las cejas y sube hacia las sienes
    line(np.abs(z-brow)<0.0025,'#6a4a1e',0.75);line(np.abs(z-brow-0.006)<0.0015,'#6a4a1e',0.5)
    line((np.abs(a)<0.025)&(z>0.04),'#e8c27a',0.6)   # arista central, brillante
    line(np.abs(np.abs(a)-1.1)<0.02,'#7a5a26',0.3)
    return save_png(name,np.clip(col,0,1))
def coraza_tex(name,size=256):   # coraza de lino: tela encolada blanca, banda baja roja con greca, panel de escamas de bronce en los costados
    H=W=size;v,u=np.mgrid[0:H,0:W];u=(u+0.5)/W;v=(v+0.5)/H
    col=np.ones((H,W,3))*hexc('#ebe2cc')*(0.9+0.1*v)[...,None]
    side=np.minimum(np.abs(u-0.25),np.abs(u-0.75))<0.15
    sc_u=(u*64)%1;row=np.floor(v*22);sc_v=(v*22)%1;sc_u=(sc_u+0.5*(row%2))%1
    scale=side&(v>0.14)&(v<0.7);d=np.hypot(sc_u-0.5,sc_v*0.9)
    sc=hexc('#b89a58')*(0.75+0.35*(1-d))[...,None];col[scale]=sc[scale]
    edge=scale&(d>0.48)&(d<0.56);col[edge]=hexc('#6a4a1e')
    band=(v<0.12);col[band]=hexc('#a3301f')
    loc=v/0.12;pat=meander(u*36,np.clip(loc*1.3-0.15,0,0.999),1.0);m=band&(pat==1)&(loc>0.15)&(loc<0.85);col[m]=hexc('#efe6d0')
    top=v>0.93;col[top]=hexc('#2f4c86')
    return save_png(name,np.clip(blur(col,1),0,1))
def lorica_tex(name,size=256):   # lorica segmentata: bandas horizontales de hierro con remaches y correas de cuero
    H=W=size;v,u=np.mgrid[0:H,0:W];u=(u+0.5)/W;v=(v+0.5)/H
    band=(v*8)%1;col=np.ones((H,W,3))*hexc('#a9a69e')*(0.8+0.3*band)[...,None]
    col[band<0.07]=hexc('#3a3a38')
    riv=(np.abs(((u*24)%1)-0.5)<0.06)&(np.abs(band-0.5)<0.07)&(np.abs(np.abs(u-0.5)-0.04)<0.02);col[riv]=hexc('#d9c27a')
    strap=(np.abs(u-0.5)<0.012);col[strap]=hexc('#6a4428')
    return save_png(name,np.clip(col,0,1))
def galea():   # casco de legionario (tipo imperial-gálico): cuenco, guardanuca ancho, refuerzo frontal y carrilleras
    bm=bmesh.new();bmesh.ops.create_uvsphere(bm,u_segments=28,v_segments=18,radius=1);c=Vector((0,-0.006,1.665));kill=[]
    for v in bm.verts:
        x,y,z=v.co
        if z<-0.12 and y<0.25:kill.append(v);continue
        if z<-0.75:kill.append(v);continue
        fl=1+0.5*max(0,-z-0.1)*max(0,y)   # guardanuca que se abre hacia atrás
        v.co=Vector((x*0.118*fl,y*0.13*fl,z*0.14))+c
    bmesh.ops.delete(bm,geom=kill,context='VERTS')
    for s_ in(1,-1):   # carrilleras
        bmesh.ops.create_cube(bm,size=1,matrix=Matrix.Translation(c+Vector((0.079*s_,-0.045,-0.058)))@Euler((0,math.radians(4*s_),math.radians(-24*s_))).to_matrix().to_4x4()@Matrix.Diagonal((0.008,0.06,0.075,1)))   # pegadas a las mejillas
    bmesh.ops.create_cube(bm,size=1,matrix=Matrix.Translation(c+Vector((0,-0.118,0.03)))@Matrix.Diagonal((0.16,0.01,0.012,1)))   # refuerzo de la frente
    ob=obj_from_bm('galea',bm);sol=ob.modifiers.new('g','SOLIDIFY');sol.thickness=0.006;bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='g');return ob
def scutum():   # escudo curvo rectangular (1,05 x 0,65 m), rojo con bordes y rayos dorados y umbo de bronce
    bm=bmesh.new();nu=16;nv=12;R=0.45;rows=[]
    for j in range(nv+1):
        z=-0.525+1.05*j/nv;row=[]
        for i in range(nu+1):
            a=(i/nu-0.5)*0.65/R;row.append(bm.verts.new((R*math.sin(a),-(R*math.cos(a)-R)-0.0,z)))
        rows.append(row)
    uvl=bm.loops.layers.uv.new('UVMap')
    for j in range(nv):
        for i in range(nu):
            f=bm.faces.new((rows[j][i],rows[j][i+1],rows[j+1][i+1],rows[j+1][i]))
            for l,(di,dj) in zip(f.loops,((0,0),(1,0),(1,1),(0,1))):l[uvl].uv=((i+di)/nu,(j+dj)/nv)
    bmesh.ops.create_uvsphere(bm,u_segments=12,v_segments=8,radius=0.06,matrix=Matrix.Translation((0,-0.01,0))@Matrix.Diagonal((1,0.5,1,1)))
    ob=obj_from_bm('scutum',bm);sol=ob.modifiers.new('g','SOLIDIFY');sol.thickness=0.015;bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='g')
    S=256;v,u=np.mgrid[0:S,0:S];x=(u+0.5)/S;y=(v+0.5)/S
    col=np.ones((S,S,3))*hexc('#a3301f')
    edge=(x<0.04)|(x>0.96)|(y<0.03)|(y>0.97);col[edge]=hexc('#c9a24a')
    cx=np.abs(x-0.5);cy=np.abs(y-0.5);ray=((np.abs(cy-cx*1.6)<0.012)|(np.abs(cx)<0.012)|(np.abs(cy)<0.012))&(np.hypot(cx,cy*0.62)<0.32)&(np.hypot(cx,cy*0.62)>0.09);col[ray]=hexc('#d9b45a')
    img=save_png('scutum',np.clip(col,0,1))
    ob.rotation_euler=(0,0,0);return ob,img
def gladius():   # vaina del gladius colgada en la cadera derecha
    bm=bmesh.new();bmesh.ops.create_cube(bm,size=1,matrix=Matrix.Translation((-0.2,0.0,0.82))@Euler((math.radians(-12),0,0)).to_matrix().to_4x4()@Matrix.Diagonal((0.025,0.055,0.5,1)))
    bmesh.ops.create_cube(bm,size=1,matrix=Matrix.Translation((-0.2,0.0,1.12))@Matrix.Diagonal((0.03,0.06,0.1,1)))   # empuñadura
    return obj_from_bm('gladius',bm)
def shield():   # aspis: cuenco de 0,9 m con borde plano, pintado
    bm=bmesh.new();R=0.45;nu=40;nv=10;rows=[]
    for j in range(nv+1):
        t=j/nv;r=R*t;d=0.07*(1-t*t) if t<0.86 else 0.0
        rows.append([bm.verts.new((r*math.cos(i/nu*TAU),-d,r*math.sin(i/nu*TAU))) for i in range(nu)])
    rim=[bm.verts.new(((R+0.035)*math.cos(i/nu*TAU),0.008,(R+0.035)*math.sin(i/nu*TAU))) for i in range(nu)]
    rows.append(rim)
    uvl=bm.loops.layers.uv.new('UVMap')
    for j in range(len(rows)-1):
        for i in range(nu):
            f=bm.faces.new((rows[j][i],rows[j][(i+1)%nu],rows[j+1][(i+1)%nu],rows[j+1][i]))
            for l in f.loops:
                co=l.vert.co;l[uvl].uv=(0.5+co.x/1.0,0.5+co.z/1.0)
    bmesh.ops.remove_doubles(bm,verts=bm.verts,dist=1e-5)
    ob=obj_from_bm('escudo',bm);sol=ob.modifiers.new('g','SOLIDIFY');sol.thickness=0.02;bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='g')
    # pintura: fondo rojo, borde de bronce con cable, emblema (episema) de lambda? → un escorpión es frecuente; aquí, un pegaso no: una estrella de 8 puntas (sencilla)
    S=256;v,u=np.mgrid[0:S,0:S];x=(u+0.5)/S-0.5;y=(v+0.5)/S-0.5;r=np.hypot(x,y);a=np.arctan2(y,x)
    col=np.ones((S,S,3))*hexc('#a3301f')*(0.9+0.1*(1-r*2))[...,None]
    bz=(r>0.45*0.86)
    col[bz]=hexc('#b8893a')*(0.85+0.15*np.cos(a[bz]*60))[:,None]
    star=(r<0.16*(0.55+0.45*np.abs(np.cos(a*4))**6))
    col[star]=hexc('#1a120c')
    img=save_png('escudo',np.clip(col,0,1));return ob,img
def spear():
    bm=bmesh.new()
    bmesh.ops.create_cone(bm,cap_ends=True,segments=8,radius1=0.014,radius2=0.012,depth=2.3,matrix=Matrix.Translation((0,0,0)))
    bmesh.ops.create_cone(bm,cap_ends=True,segments=8,radius1=0.024,radius2=0.0,depth=0.26,matrix=Matrix.Translation((0,0,1.27)))
    bmesh.ops.create_cone(bm,cap_ends=True,segments=8,radius1=0.0,radius2=0.016,depth=0.16,matrix=Matrix.Translation((0,0,-1.22)))   # regatón (sauroter)
    return obj_from_bm('lanza',bm)

# ------------------------------------------------------------------ montaje
def skin_to(arm,objs,body):
    # pesos: el cuerpo, automáticos; la ropa y la cabeza, copiados del cuerpo (vértice más cercano)
    bpy.ops.object.select_all(action='DESELECT');body.select_set(True);arm.select_set(True);bpy.context.view_layer.objects.active=arm
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
    for ob in objs:
        dt=ob.modifiers.new('dt','DATA_TRANSFER');dt.object=body;dt.use_vert_data=True;dt.data_types_verts={'VGROUP_WEIGHTS'};dt.vert_mapping='POLYINTERP_NEAREST'
        dt.layers_vgroup_select_src='ALL';dt.layers_vgroup_select_dst='NAME'
        bpy.context.view_layer.objects.active=ob;bpy.ops.object.datalayout_transfer(modifier='dt');bpy.ops.object.modifier_apply(modifier='dt')
        am=ob.modifiers.new('arm','ARMATURE');am.object=arm;ob.parent=arm
def weights_from(ob,src,near=0.05,far=0.12):
    # capas: donde 'ob' va encima de 'src' (a menos de 'near'), copia los pesos del vértice más cercano de 'src', con transición
    # suave hasta 'far'. Las dos capas se mueven igual y la de abajo no puede salir por la de encima, ni andando
    from mathutils import kdtree
    sv=src.data.vertices;kd=kdtree.KDTree(len(sv))
    for i,v in enumerate(sv):kd.insert(src.matrix_world@v.co,i)
    kd.balance();sname={g.index:g.name for g in src.vertex_groups}
    G={g.name:g for g in ob.vertex_groups}
    if os.environ.get('NOSTOS_ROPA')=='2':
        ds=sorted(kd.find(ob.matrix_world@v.co)[2] for v in ob.data.vertices);print('DIST',ob.name,src.name,len(ds),'p10 %.3f p50 %.3f p90 %.3f'%(ds[len(ds)//10],ds[len(ds)//2],ds[9*len(ds)//10]))
    for v in ob.data.vertices:
        co,i,d=kd.find(ob.matrix_world@v.co)
        if d>far:continue
        k=1.0 if d<=near else 1-(d-near)/(far-near)
        for g in list(v.groups):g.weight*=(1-k)
        for g in sv[i].groups:
            n=sname[g.group]
            if n not in G:G[n]=ob.vertex_groups.new(name=n)
            G[n].add([v.index],g.weight*k,'ADD')
def strip_limbs(ob,ztop=1.05):
    # la ropa larga no se mueve con las manos, los antebrazos, las espinillas ni los pies (los copiaba del cuerpo por cercanía:
    # la mano cuelga a la altura de la cadera y arrastraba trozos de toga al balancear el brazo); los brazos, solo cerca del hombro
    G={g.name:g for g in ob.vertex_groups};idx={g.index:g.name for g in ob.vertex_groups}
    for n in('hips','spine','chest'):
        if n not in G:G[n]=ob.vertex_groups.new(name=n)
    for v in ob.data.vertices:
        tot=0.0;cut=0.0
        for g in v.groups:
            n=idx.get(g.group,'')
            if n.startswith(('hand','forearm','shin','foot')) or (n.startswith('upperarm') and v.co.z<ztop):cut+=g.weight;g.weight=0.0
            else:tot+=g.weight
        if cut>0:
            if tot>1e-4:
                for g in v.groups:g.weight=g.weight/tot*(tot+cut) if g.weight>0 else 0.0
            else:G['hips' if v.co.z<1.05 else 'spine'].add([v.index],1.0,'REPLACE')
def skirt_weights(ob,zc=0.98):
    # falda: casi toda de la cadera y un poco de cada muslo según el lado (así se mece y no se rasga al andar)
    names=[g.name for g in ob.vertex_groups]
    for n in('hips','thigh.L','thigh.R'):
        if n not in names:ob.vertex_groups.new(name=n)
    G={g.name:g for g in ob.vertex_groups}
    for v in ob.data.vertices:
        z=v.co.z
        if z>zc:continue
        k=min(1,(zc-z)/0.15)   # transición suave desde la cintura
        wl=0.34*min(1,max(0,(zc-z)/0.6));sL=min(1,max(0,0.5+v.co.x/0.5))   # muslos con menos peso y paso suave de un lado a otro: si no, al adelantar una pierna los pliegues se cruzan
        for g in list(v.groups):g.weight*=(1-k)
        G['hips'].add([v.index],k*(1-wl),'ADD');G['thigh.L'].add([v.index],k*wl*sL,'ADD');G['thigh.R'].add([v.index],k*wl*(1-sL),'ADD')
def attach(ob,arm,bone,loc=None):   # pieza rígida: todos sus vértices al 100 % en un hueso (malla con esqueleto, como el resto)
    bpy.context.view_layer.objects.active=ob;bpy.ops.object.select_all(action='DESELECT');ob.select_set(True);bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    g=ob.vertex_groups.new(name=bone);g.add([v.index for v in ob.data.vertices],1.0,'REPLACE')
    am=ob.modifiers.new('arm','ARMATURE');am.object=arm;ob.parent=arm
def join(objs,name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:o.select_set(True)
    bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();objs[0].name=name;return objs[0]

# ------------------------------------------------------------------ animaciones (andar, quieto)
def animate(arm,prefix):
    ad=arm.animation_data_create()
    def act(name,frames,fn):
        a=bpy.data.actions.new(prefix+name);ad.action=a
        for f in range(frames+1):
            ph=f/frames*TAU
            for pb in arm.pose.bones:pb.rotation_mode='XYZ';pb.rotation_euler=(0,0,0);pb.location=(0,0,0)
            fn(ph)
            for pb in arm.pose.bones:
                pb.keyframe_insert('rotation_euler',frame=f+1)
                if pb.name=='hips':pb.keyframe_insert('location',frame=f+1)
        slot=getattr(ad,'action_slot',None);tr=ad.nla_tracks.new();tr.name=prefix+name;st=tr.strips.new(prefix+name,1,a)
        if slot is not None and hasattr(st,'action_slot'):st.action_slot=slot
        ad.action=None
    P=arm.pose.bones
    def walk(ph):
        s=math.sin(ph);c=math.cos(ph)
        P['thigh.L'].rotation_euler.x=0.3*s;P['thigh.R'].rotation_euler.x=-0.3*s
        P['shin.L'].rotation_euler.x=-max(0,-math.sin(ph+0.9))*0.6-0.05;P['shin.R'].rotation_euler.x=-max(0,math.sin(ph+0.9))*0.6-0.05
        P['foot.L'].rotation_euler.x=0.15*math.sin(ph-0.6);P['foot.R'].rotation_euler.x=-0.15*math.sin(ph-0.6)
        P['upperarm.L'].rotation_euler.x=-0.32*s;P['upperarm.R'].rotation_euler.x=0.32*s
        P['forearm.L'].rotation_euler.x=-0.25-0.15*max(0,-s);P['forearm.R'].rotation_euler.x=-0.25-0.15*max(0,s)
        P['hips'].location=(0,0.025*abs(math.cos(ph))-0.012,0);P['hips'].rotation_euler.z=0.06*s;P['chest'].rotation_euler.z=-0.09*s;P['spine'].rotation_euler.x=0.03
        P['head'].rotation_euler.z=0.04*s
    def idle(ph):
        s=math.sin(ph)
        P['chest'].rotation_euler.x=0.015*s;P['neck'].rotation_euler.x=-0.01*s;P['upperarm.L'].rotation_euler.y=0.02*s;P['upperarm.R'].rotation_euler.y=-0.02*s
        P['upperarm.L'].rotation_euler.z=0.05;P['upperarm.R'].rotation_euler.z=-0.05;P['forearm.L'].rotation_euler.x=-0.12;P['forearm.R'].rotation_euler.x=-0.12
        P['head'].rotation_euler.z=0.05*math.sin(ph*0.5)
    act('andar',24,walk);act('quieto',60,idle)

FEM=('mujer','romana');BARBA={'ciudadano':'#6e4c33','hoplita':'#4a3424','obrero':'#3e2a1c'}
def build(kind):
    female=kind in FEM
    arm=make_armature(kind+'_esqueleto');arm.data.pose_position='REST'
    HEADFEM[0]=female;HL0[0]=0.06 if female else 0.066
    body=body_mesh(kind+'_cuerpo',female);head,eyes=mh_head(kind+'_cabeza',kind,female)
    skc='#e6c0a0' if female else '#d9ad88'
    smart_uv(body);skin=plain_tex(kind+'_piel',skc,0.04)
    set_mat(body,material(kind+'_piel',skin))
    hair={'mujer':'#3a2618','romana':'#4a2e1a','legionario':'#3b2a1e','tunicado':'#2e2218'}.get(kind,'#5e4029')
    covered=kind in('hoplita','legionario')
    set_mat(head,material(kind+'_cara',skin_tex(kind+'_cara',skc,front_up=(0.04 if covered else 0.0),beard=BARBA.get(kind),hair=hair,fem=female)))
    set_mat(eyes,material(kind+'_ojo',eye_tex(kind+'_ojo')))
    hm_=material(kind+'_pelo',hair_tex(kind+'_pelo',hair))
    pieces=[head,eyes];rigid=[]
    if not covered:
        hs=hair_shell(kind+'_pelo',head,'pelo');set_mat(hs,hm_);pieces.append(hs)
    if kind in BARBA:
        bd=hair_shell(kind+'_barba',head,'barba');set_mat(bd,material(kind+'_barba',hair_tex(kind+'_barba',BARBA[kind])));pieces.append(bd)
    if female:   # pelo recogido en un moño en la nuca, con una cinta
        b2=bmesh.new();yb=head_point_mh(math.pi,0.0).y-HC.y;bmesh.ops.create_uvsphere(b2,u_segments=16,v_segments=12,radius=1,matrix=Matrix.Translation(HC+Vector((0,yb+0.012,0.005)))@Matrix.Diagonal((0.048,0.04,0.042,1)))
        bmesh.ops.create_uvsphere(b2,u_segments=12,v_segments=8,radius=1,matrix=Matrix.Translation(HC+Vector((0,yb+0.035,-0.02)))@Matrix.Diagonal((0.034,0.03,0.03,1)))
        bn=obj_from_bm(kind+'_mono',b2);head_uv(bn.data);set_mat(bn,hm_);pieces.append(bn)
        hp=[head_point_mh(k/36*TAU,h) for k in range(36) for h in(0.03,0.045,0.055)];rx=max(abs(p.x) for p in hp)+0.009
        y0,y1=min(p.y for p in hp),max(p.y for p in hp);ry=(y1-y0)/2+0.009;cy=(y0+y1)/2;rb=1.0
        b3=bmesh.new();bmesh.ops.create_cone(b3,cap_ends=False,segments=24,radius1=1.0,radius2=0.965,depth=0.012,matrix=Matrix.Translation(Vector((0,cy,HC.z+0.047)))@Euler((math.radians(-14),0,0)).to_matrix().to_4x4()@Matrix.Diagonal((rx,ry,1,1)))
        cn=obj_from_bm(kind+'_cinta',b3);smart_uv(cn);set_mat(cn,material(kind+'_cinta_m',plain_tex(kind+'_cinta_t','#2f4c86' if kind=='mujer' else '#c9a24a',0.1)));pieces.append(cn)
    cuero=material('cuero',plain_tex('cuero','#6a4428',0.15),rough=0.7)
    for o in sandals('sandalia',body):set_mat(o,cuero);pieces.append(o)
    if kind=='ciudadano':
        # quitón largo de lino (hasta los tobillos en los hombres mayores; con mangas cortas abrochadas) y himation de lana
        ch=garment('quiton',body,0.1,1.5,0.012,folds=30,famp=0.006,flare=0.05,skirt=True,top=lambda u:1.505+0.06*abs(math.sin(u*TAU))**2-0.05*max(0,math.cos(u*TAU))**3)
        set_mat(ch,material('quiton',cloth_tex('quiton','#e8e0cf',border='#2f4c86',band=(0.0,0.05),folds=30,neck='#2f4c86')))
        def htop(u):   # el himation deja libre el hombro y el brazo derechos y cubre el izquierdo
            a=u*TAU;return 1.17+0.13*(0.5+0.5*math.sin(a))**1.3   # en diagonal: alto en el hombro izquierdo (+X), bajo en la axila derecha
        hm=garment('himation',body,0.22,1.5,0.03,folds=11,famp=0.026,flare=0.11,top=htop,skirt=True,over=ch)
        set_mat(hm,material('himation',cloth_tex('himation','#d6d6da',border='#3a3a46',band=(0.0,0.045),folds=11),color=(0.45,0.52,0.72)))   # textura clara: el juego la tiñe con el color de cada persona
        for o in(ch,hm):pieces.append(o)
        # el extremo del himation cae por delante desde el hombro izquierdo, y el otro por la espalda
        e1=drape_end('himation_extremo',[(0.085,0.02,1.535),(0.1,-0.085,1.49),(0.115,-0.165,1.35),(0.13,-0.205,1.05),(0.14,-0.22,0.75),(0.145,-0.225,0.5)],0.17,folds=2.5,famp=0.022,snug=[body]+pieces,gap=0.04)
        e2=drape_end('himation_espalda',[(0.12,0.08,1.5),(0.16,0.16,1.3),(0.17,0.2,1.0),(0.17,0.21,0.7)],0.24,folds=3,famp=0.02,snug=[body]+pieces,gap=0.04)
        for e in(e1,e2):set_mat(e,hm.data.materials[0]);pieces.append(e)
        # mangas del quitón jonio: la tela cae suelta del hombro hasta el codo y se abrocha con botones (fíbulas) por encima del brazo
        for k,sg in(('L',1),('R',-1)):
            sl,bt=ionic_sleeve('manga',sg,J['sho.'+k],J['elb.'+k]);set_mat(sl,ch.data.materials[0]);pieces.append(sl)
            set_mat(bt,material('oro',plain_tex('oro','#d9a93a',0.1),metal=0.9,rough=0.3));pieces.append(bt)
    elif kind=='hoplita':
        ch=garment('quiton_corto',body,0.66,1.5,0.012,folds=20,famp=0.008,flare=0.03,skirt=True,top=lambda u:1.505+0.06*abs(math.sin(u*TAU))**2-0.05*max(0,math.cos(u*TAU))**3)
        set_mat(ch,material('quiton_rojo',cloth_tex('quiton_rojo','#9a2a1e',border='#1a120c',band=(0.0,0.05),folds=20)))
        # coraza de lino (linothorax): rígida, de la cintura a las axilas, con pteryges (tiras) abajo
        lt=garment('coraza',body,0.86,1.43,0.03,folds=1,famp=0.0,skirt=False,nu=48,nv=12)
        set_mat(lt,material('coraza',coraza_tex('coraza'),rough=0.6))
        def ptery(u,v):return int(u*36)%2==1 and v<0.999   # tiras sueltas
        pt=garment('pteryges',body,0.6,0.86,0.04,folds=36,famp=0.004,skirt=True,flare=0.0,nu=72,nv=4,clip=lambda u,v:int(u*36)%3==2)
        set_mat(pt,lt.data.materials[0])
        pt2=garment('pteryges_b',body,0.56,0.8,0.032,folds=36,famp=0.003,skirt=True,flare=0.0,nu=72,nv=4,clip=lambda u,v:int(u*36+1.5)%3==2)
        set_mat(pt2,material('pteryges_rojo',cloth_tex('pteryges_rojo','#8a2418',border='#e6dcc4',band=(0.0,0.2),folds=1,wool=False)));pieces.append(pt2)
        for sgn in(1,-1):   # epomides: piezas que pasan por encima del hombro, de la espalda al pecho, ajustadas a él
            ep=shoulder_flap('hombrera',body,sgn);smart_uv(ep);set_mat(ep,lt.data.materials[0]);pieces.append(ep)
        # grebas de bronce, ajustadas a la pantorrilla y con la rodilla marcada
        for k in('L','R'):
            kn=Vector(J['kne.'+k]);an=Vector(J['ank.'+k])
            gr=limb_shell('greba',body,an+Vector((0,0,0.05)),kn+Vector((0,0,0.06)),0.007,nu=28,nv=12,knee=0.018,gap=1.0)
            set_mat(gr,material('bronce',plain_tex('bronce','#b49a5c',0.12),metal=0.85,rough=0.35) if 'bronce' not in bpy.data.materials else bpy.data.materials['bronce']);pieces.append(gr)
        for o in(ch,lt,pt):pieces.append(o)
        hel,crest=helmet();head_uv(hel.data);set_mat(hel,material('casco',helmet_tex('casco'),metal=0.85,rough=0.3));smart_uv(crest);set_mat(crest,material('crin',plain_tex('crin','#7a1e14',0.2)))
        rigid+=[(hel,'head'),(crest,'head')]
        sh,img=shield();set_mat(sh,material('escudo',img,metal=0.3,rough=0.5))
        # el escudo en el brazo izquierdo (porpax en el antebrazo)
        fa=Vector(J['elb.L']).lerp(Vector(J['wri.L']),0.5);sh.location=fa+Vector((0.07,-0.06,0.05));sh.rotation_euler=(0,0,math.radians(-10))
        rigid.append((sh,'forearm.L'))
        sp=spear();smart_uv(sp);set_mat(sp,material('madera',plain_tex('madera','#6b4a2e',0.15)))
        sp.location=Vector(J['fin.R'])+Vector((0,-0.02,0.05));sp.rotation_euler=(math.radians(-8),0,0);rigid.append((sp,'hand.R'))
    elif kind=='mujer':
        # quitón jonio largo (hasta los pies), con mangas abrochadas, e himation por encima (Hope, láms. 50-60; korai de la Acrópolis)
        ch=garment('quiton',body,0.03,1.5,0.012,folds=34,famp=0.006,flare=0.07,skirt=True,top=lambda u:1.505+0.06*abs(math.sin(u*TAU))**2-0.05*max(0,math.cos(u*TAU))**3)
        set_mat(ch,material('quiton',cloth_tex('quiton','#ece4d4',border='#a8392b',band=(0.0,0.04),folds=34,neck='#a8392b')))
        hm=garment('himation',body,0.3,1.5,0.03,folds=12,famp=0.024,flare=0.12,top=lambda u:1.17+0.13*(0.5+0.5*math.sin(u*TAU))**1.3,skirt=True,over=ch)
        set_mat(hm,material('himation',cloth_tex('himation','#d6d6da',border='#3a3a46',band=(0.0,0.045),folds=12)))
        e1=drape_end('himation_extremo',[(0.08,0.02,1.53),(0.095,-0.08,1.49),(0.11,-0.16,1.35),(0.125,-0.2,1.05),(0.135,-0.215,0.8)],0.16,folds=2.5,famp=0.02,snug=[body]+pieces,gap=0.04)
        e2=drape_end('himation_espalda',[(0.11,0.08,1.5),(0.15,0.15,1.3),(0.16,0.19,1.0),(0.16,0.2,0.75)],0.22,folds=3,famp=0.02,snug=[body]+pieces,gap=0.04)
        for e in(e1,e2):set_mat(e,hm.data.materials[0]);pieces.append(e)
        for o in(ch,hm):pieces.append(o)
        for k,sg in(('L',1),('R',-1)):
            sl,bt=ionic_sleeve('manga',sg,J['sho.'+k],J['elb.'+k]);set_mat(sl,ch.data.materials[0]);pieces.append(sl)
            set_mat(bt,material('oro',plain_tex('oro','#d9a93a',0.1),metal=0.9,rough=0.3));pieces.append(bt)
    elif kind=='obrero':
        # exomis: túnica corta de trabajo, abrochada en el hombro izquierdo, que deja al aire el hombro y el pecho derechos; cinturón y pilos de fieltro
        ex=garment('exomis',body,0.62,1.5,0.012,folds=16,famp=0.008,flare=0.04,skirt=True,
            top=lambda u:1.24+0.27*min(1,max(0,(math.sin(u*TAU)+0.6)/1.0))**1.2)
        set_mat(ex,material('exomis',cloth_tex('exomis','#b8a888',border='#5a4a38',band=(0.0,0.04),folds=16)));pieces.append(ex)
        bl=garment('cinturon',body,0.98,1.02,0.02,folds=1,famp=0.0,skirt=False,nu=40,nv=2,over=ex)
        set_mat(bl,material('cinturon_m',plain_tex('cinturon_t','#5a3d26',0.1)));pieces.append(bl)
        hp=[head_point_mh(k/36*TAU,h) for k in range(36) for h in(0.035,0.05,0.065)];rx=max(abs(p.x) for p in hp)+0.017
        y0,y1=min(p.y for p in hp),max(p.y for p in hp);ry=(y1-y0)/2+0.017;cy=(y0+y1)/2   # ajustado a la cabeza (ovalado), por encima del pelo
        b2=bmesh.new();bmesh.ops.create_cone(b2,cap_ends=True,segments=32,radius1=1.0,radius2=0.3,depth=0.13,matrix=Matrix.Translation(Vector((0,cy,HC.z+0.105)))@Matrix.Diagonal((rx,ry,1,1)))
        hsl=[o for o in pieces if o.name.startswith(kind+'_pelo')]
        for o in hsl:   # el pelo que quedaría por fuera del pilos se mete dentro (y lo que queda tapado se borra)
            for v in o.data.vertices:
                h=v.co.z-(HC.z+0.04)
                if h<0 or h>0.13:continue
                k=1-0.7*h/0.13;ex=math.sqrt((v.co.x/(rx*k))**2+((v.co.y-cy)/(ry*k))**2)
                if ex>0.9:v.co.x*=0.9/ex;v.co.y=cy+(v.co.y-cy)*0.9/ex
            o.data.update()
        pl=obj_from_bm('pilos',b2);smart_uv(pl);hide_covered(hsl[0],[pl],maxd=0.06) if hsl else None;set_mat(pl,material('fieltro',plain_tex('fieltro','#8a7350',0.2)));rigid.append((pl,'head'))
    elif kind=='togado':
        # túnica blanca hasta la rodilla y toga de lana (toga virilis), larga y envolvente, con el extremo sobre el hombro izquierdo
        tu=garment('tunica',body,0.55,1.5,0.012,folds=18,famp=0.007,flare=0.04,skirt=True,top=lambda u:1.505+0.06*abs(math.sin(u*TAU))**2-0.05*max(0,math.cos(u*TAU))**3)
        set_mat(tu,material('tunica',cloth_tex('tunica','#ece6d8',folds=18)));pieces.append(tu)
        for k,sg in(('L',1),('R',-1)):
            sl,bt=ionic_sleeve('manga',sg,J['sho.'+k],J['elb.'+k]);set_mat(sl,tu.data.materials[0]);pieces.append(sl)
        tg=garment('toga',body,0.12,1.5,0.035,folds=10,famp=0.03,flare=0.15,top=lambda u:1.2+0.16*(0.5+0.5*math.sin(u*TAU))**1.2,skirt=True,over=tu)
        set_mat(tg,material('toga',cloth_tex('toga','#f0ebe0',folds=10)));pieces.append(tg)
        e1=drape_end('toga_extremo',[(0.08,0.02,1.54),(0.1,-0.09,1.49),(0.12,-0.18,1.32),(0.13,-0.23,1.0),(0.14,-0.25,0.65),(0.145,-0.255,0.35)],0.22,folds=3,famp=0.03,snug=[body]+pieces,gap=0.04)
        e2=drape_end('toga_espalda',[(0.11,0.08,1.51),(0.15,0.16,1.3),(0.17,0.21,0.95),(0.17,0.23,0.55)],0.28,folds=3,famp=0.025,snug=[body]+pieces,gap=0.04)
        for e in(e1,e2):set_mat(e,tg.data.materials[0]);pieces.append(e)
    elif kind=='romana':
        # túnica con mangas, estola encima (vestido largo sin mangas, con tirantes) y palla (manto)
        tu=garment('tunica',body,0.04,1.5,0.011,folds=26,famp=0.005,flare=0.06,skirt=True,top=lambda u:1.505+0.06*abs(math.sin(u*TAU))**2-0.05*max(0,math.cos(u*TAU))**3)
        set_mat(tu,material('tunica',cloth_tex('tunica','#ece6d8',folds=26)));pieces.append(tu)
        for k,sg in(('L',1),('R',-1)):
            sl,bt=ionic_sleeve('manga',sg,J['sho.'+k],J['elb.'+k]);set_mat(sl,tu.data.materials[0]);pieces.append(sl)
        st=garment('estola',body,0.05,1.38,0.02,folds=20,famp=0.012,flare=0.08,skirt=True,over=tu)
        set_mat(st,material('estola',cloth_tex('estola','#d8d8dc',border='#3a3a46',band=(0.0,0.035),folds=20)));pieces.append(st)
        for sg in(1,-1):
            ep=shoulder_flap('tirante',body,sg);sx=0.35
            for v in ep.data.vertices:v.co.x=v.co.x*0.45+0.06*sg
            set_mat(ep,st.data.materials[0]);pieces.append(ep)
        pa=garment('palla',body,0.35,1.5,0.03,folds=11,famp=0.024,flare=0.12,top=lambda u:1.18+0.14*(0.5+0.5*math.sin(u*TAU))**1.3,skirt=True,over=st)
        set_mat(pa,material('palla',cloth_tex('palla','#d6d6da',border='#3a3a46',band=(0.0,0.04),folds=11)));pieces.append(pa)
        e1=drape_end('palla_extremo',[(0.08,0.02,1.53),(0.095,-0.08,1.49),(0.11,-0.16,1.35),(0.125,-0.2,1.05),(0.135,-0.215,0.8)],0.16,folds=2.5,famp=0.02,snug=[body]+pieces,gap=0.04)
        set_mat(e1,pa.data.materials[0]);pieces.append(e1)
    elif kind=='legionario':
        # túnica roja corta, lorica segmentata (bandas de hierro), hombreras de láminas, casco de tipo imperial-gálico, scutum curvo, gladius y caligae
        tu=garment('tunica',body,0.62,1.5,0.012,folds=18,famp=0.007,flare=0.04,skirt=True,top=lambda u:1.505+0.06*abs(math.sin(u*TAU))**2-0.05*max(0,math.cos(u*TAU))**3)
        set_mat(tu,material('tunica_roja',cloth_tex('tunica_roja','#9a2a1e',folds=18)));pieces.append(tu)
        for k,sg in(('L',1),('R',-1)):
            sl,bt=ionic_sleeve('manga',sg,J['sho.'+k],J['elb.'+k]);set_mat(sl,tu.data.materials[0]);pieces.append(sl)
        lo=garment('lorica',body,0.92,1.44,0.028,folds=1,famp=0.0,skirt=False,nu=48,nv=14,over=tu)
        set_mat(lo,material('lorica',lorica_tex('lorica'),metal=0.85,rough=0.4));pieces.append(lo)
        for sg in(1,-1):
            ep=shoulder_flap('hombrera_hierro',body,sg);smart_uv(ep);set_mat(ep,lo.data.materials[0]);pieces.append(ep)
        ga=galea();smart_uv(ga);set_mat(ga,material('galea',plain_tex('galea','#a8a49a',0.12),metal=0.85,rough=0.35));rigid.append((ga,'head'))
        sc,img=scutum();set_mat(sc,material('scutum',img,rough=0.5))
        fa=Vector(J['elb.L']).lerp(Vector(J['wri.L']),0.5);sc.location=fa+Vector((0.08,-0.07,0.0));rigid.append((sc,'forearm.L'))
        gl=gladius();smart_uv(gl);set_mat(gl,material('vaina',plain_tex('vaina','#5a3d26',0.15),rough=0.6));rigid.append((gl,'hips'))
    elif kind=='tunicado':
        # el romano de a pie (artesanos, bataneros, mozos, esclavos): túnica de lana sin teñir hasta la rodilla, ceñida con un cinturón,
        # mangas cortas; sin manto. En el 80 d.C. los hombres van afeitados y con el pelo corto (la moda de Tito). Carcopino, cap. VII
        tu=garment('tunica',body,0.6,1.5,0.012,folds=20,famp=0.008,flare=0.05,skirt=True,top=lambda u:1.505+0.06*abs(math.sin(u*TAU))**2-0.05*max(0,math.cos(u*TAU))**3)
        set_mat(tu,material('tunica',cloth_tex('tunica_lana','#bfae8c',folds=20)));pieces.append(tu)
        for k,sg in(('L',1),('R',-1)):
            sl,bt=ionic_sleeve('manga',sg,J['sho.'+k],J['elb.'+k]);set_mat(sl,tu.data.materials[0]);pieces.append(sl)
        bl=garment('cinturon',body,0.98,1.02,0.02,folds=1,famp=0.0,skirt=False,nu=40,nv=2,over=tu)
        set_mat(bl,material('cinturon_m',plain_tex('cinturon_t','#5a3d26',0.1)));pieces.append(bl)
    skin_to(arm,pieces,body)
    for o in pieces:
        if o.name.startswith(('himation_extremo','himation_espalda','toga_extremo','toga_espalda','palla_extremo')):drape_weights(o);(None if os.environ.get('NOSTOS_SIN') else (skirt_weights(o),strip_limbs(o)))   # por debajo de la cintura, como la falda que tapa (si no, el muslo empuja la falda a través del extremo)
        elif o.name.startswith(('quiton','himation','pteryges','exomis','tunica','toga','estola','palla')):
            if not os.environ.get('NOSTOS_SIN') and min(v.co.z for v in o.data.vertices)<0.45:strip_limbs(o)   # solo la ropa larga (la corta no llega a las manos)
            skirt_weights(o)
    # cada extremo de manto copia los pesos de la prenda que tapa, donde la tapa
    for o in ([] if os.environ.get('NOSTOS_SIN') else pieces):
        b=o.name.split('.')[0]
        if b in('himation_extremo','himation_espalda','toga_extremo','toga_espalda','palla_extremo'):
            under=[q for q in pieces if q.name.split('.')[0]==b.split('_')[0]]
            if under:weights_from(o,under[0],near=0.11,far=0.22)
    # y la prenda de debajo, donde el manto la tapa, sigue al manto (el quitón bajo el himation, la túnica bajo la toga…)
    for inn,out in(() if os.environ.get('NOSTOS_SIN') else (('quiton','himation'),('tunica','toga'),('estola','palla'))):
        I=[q for q in pieces if q.name.split('.')[0]==inn];O=[q for q in pieces if q.name.split('.')[0]==out]
        if I and O:weights_from(I[0],O[0],near=0.045,far=0.09)
    # el cinturón se mueve con la túnica que ciñe
    for q in ([] if os.environ.get('NOSTOS_SIN') else pieces):
        if q.name.split('.')[0]=='cinturon':
            U=[w for w in pieces if w.name.split('.')[0] in('tunica','exomis','quiton_corto')]
            if U:weights_from(q,U[0],near=0.1,far=0.2)
    for ob,bone in rigid:attach(ob,arm,bone)
    # capas: lo que queda debajo y tapado se borra (piel bajo la ropa, quitón bajo el manto o la coraza, pelo bajo el casco)
    byn=lambda *ns:[o for o in pieces+[r for r,_ in rigid] if o.name.split('.')[0] in ns]
    ropa=byn('quiton','quiton_corto','himation','himation_extremo','himation_espalda','manga','coraza','pteryges','pteryges_b','greba','hombrera','exomis','tunica','toga','toga_extremo','toga_espalda','estola','palla','palla_extremo','lorica','hombrera_hierro')
    n=hide_covered(body,ropa,maxd=0.12,erode=3)   # hasta 12 cm: la toga, el manto y las mangas holgadas se separan del cuerpo más de 5 cm, y la piel de debajo asomaba al moverse
    for nm,cv in((('tunica',('toga','toga_extremo','toga_espalda','estola','lorica','hombrera_hierro')),('estola',('palla','palla_extremo')),('quiton',('himation','himation_extremo','himation_espalda','manga')),('quiton_corto',('coraza','pteryges','pteryges_b')),('coraza',('hombrera',)),('pteryges',('pteryges_b',)))+(() if os.environ.get('NOSTOS_SIN') else (('tunica',('cinturon',)),('exomis',('cinturon',))))):
        for o in byn(nm):n+=hide_covered(o,byn(*cv),maxd=0.1,erode=1,radial=True)
    for o in byn(kind+'_pelo'):n+=hide_covered(o,byn('casco'),maxd=0.05,erode=1)
    print('CARAS OCULTAS BORRADAS',kind,n)
    arm.data.pose_position='POSE'
    animate(arm,kind+'_')
    return arm

ARMS={}
for k in(sys.argv[sys.argv.index('--')+1].split(',') if '--' in sys.argv else ['ciudadano','hoplita','mujer','obrero','togado','romana','legionario','tunicado']):ARMS[k]=build(k)
# diagnóstico de ropa que se atraviesa (NOSTOS_ROPA=1): en cada fotograma del paso y del reposo, cuántos vértices de una capa de abajo
# quedan por fuera de la de encima (en reposo estaban tapados). No exporta nada.
BADP=[]
def clip_report(kind,arm):
    obs=[o for o in bpy.data.objects if o.parent==arm and o.type=='MESH']
    byn=lambda *ns:[o for o in obs if o.name.split('.')[0] in ns]
    PAIRS=[('cuerpo',('quiton','quiton_corto','himation','exomis','tunica','toga','estola','palla','coraza','lorica','manga')),
      ('quiton',('himation','himation_extremo','himation_espalda')),('himation',('himation_extremo','himation_espalda')),
      ('tunica',('toga','toga_extremo','toga_espalda','estola','lorica','cinturon')),('toga',('toga_extremo','toga_espalda')),
      ('estola',('palla','palla_extremo')),('palla',('palla_extremo',)),('quiton_corto',('coraza','pteryges','pteryges_b')),('exomis',('cinturon',)),
      ('manga',('himation','toga','palla','himation_extremo','toga_extremo','palla_extremo'))]
    dg=bpy.context.evaluated_depsgraph_get()
    def world(o):
        e=o.evaluated_get(dg);me=e.to_mesh();mw=o.matrix_world
        P=[mw@v.co for v in me.vertices];N=[(mw.to_3x3()@v.normal).normalized() for v in me.vertices];F=[tuple(p.vertices) for p in me.polygons];e.to_mesh_clear();return P,N,F
    def poke(inn,outs,base):
        Pi,Ni,_=world(inn);T=[]
        for o in outs:
            P,_,F=world(o);T.append(BVHTree.FromPolygons(P,F))
        cov=[];bad=0
        for i,(p,n) in enumerate(zip(Pi,Ni)):
            hitf=any(t.ray_cast(p+n*0.001,n,0.12)[0] is not None for t in T)
            if base is None:cov.append(hitf);continue
            if not base[i]:continue
            if not hitf and any(t.ray_cast(p-n*0.001,-n,0.12)[0] is not None for t in T):
                bad+=1
                if os.environ.get('NOSTOS_ROPA')=='2':BADP.append((inn.name,round(p.x,2),round(p.y,2),round(p.z,2)))
        return cov if base is None else bad
    arm.data.pose_position='REST';bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
    base={}
    for nm,cv in PAIRS:
        for o in byn(nm):
            outs=byn(*cv)
            if outs:base[o.name]=(outs,poke(o,outs,None))
    arm.data.pose_position='POSE'
    tr={t.name:t for t in arm.animation_data.nla_tracks};res={}
    for an in(kind+'_andar',kind+'_quieto'):
        for t in tr.values():t.mute=(t.name!=an)
        for f in range(1,25 if an.endswith('andar') else 61,3):
            bpy.context.scene.frame_set(f);bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
            for nm,(outs,b) in base.items():
                n=poke(bpy.data.objects[nm],outs,b);tot=max(1,sum(b));k=(nm,an.split('_')[-1])
                if n/tot>res.get(k,(0,0,0))[0]:res[k]=(n/tot,n,f)
    for (nm,an),(r,n,f) in sorted(res.items()):print('ROPA',kind,nm,an,'%.1f%%'%(100*r),n,'fot',f)
    if BADP:
        import collections;c=collections.Counter((b[0],round(b[3],1),'delante' if b[2]<0 else 'detras','izq' if b[1]>0 else 'der') for b in BADP);print('PUNTOS',c.most_common(12))
def clip_render(kind,arm,frame,out):
    for o in bpy.data.objects:
        if o.type in('MESH','ARMATURE'):o.hide_render=not(o==arm or o.parent==arm) or (o.type=='MESH' and bool(os.environ.get('NOSTOS_SOLO')) and o.name.split('.')[0] not in os.environ['NOSTOS_SOLO'].split(','))
    tr={t.name:t for t in arm.animation_data.nla_tracks}
    for t in tr.values():t.mute=(t.name!=kind+'_andar')
    arm.data.pose_position='REST' if os.environ.get('NOSTOS_REPOSO') else 'POSE'
    sc=bpy.context.scene;sc.frame_set(frame);sc.render.engine='CYCLES';sc.cycles.samples=12;sc.render.resolution_x=900;sc.render.resolution_y=700
    if not sc.world:sc.world=bpy.data.worlds.new('w')
    sc.world.use_nodes=True;sc.world.node_tree.nodes['Background'].inputs[1].default_value=1.0
    if 'solR' not in bpy.data.objects:
        l=bpy.data.lights.new('solR','SUN');l.energy=3;lo=bpy.data.objects.new('solR',l);lo.rotation_euler=(0.7,0.3,2.6);sc.collection.objects.link(lo)
    c=bpy.data.cameras.new('cR');c.lens=50;co=bpy.data.objects.new('cR',c);sc.collection.objects.link(co);sc.camera=co
    import itertools
    imgs=[]
    for i,(px,py) in enumerate(((1.6,3.2),(-1.6,3.2),(2.6,-2.4))):
        co.location=(px,py,1.15);d=Vector((0,0,0.95))-co.location;co.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
        sc.render.filepath=out+'_%d.png'%i;bpy.ops.render.render(write_still=True)
if os.environ.get('NOSTOS_PESOS'):
    import collections
    for o in bpy.data.objects:
        if o.type!='MESH' or o.name.split('.')[0]!=os.environ['NOSTOS_PESOS']:continue
        names={g.index:g.name for g in o.vertex_groups};C=collections.Counter()
        for v in o.data.vertices:
            if v.co.z<1.15 and v.co.x>0.03 and v.co.y>0:
                for g in v.groups:
                    if g.weight>0.05:C[names[g.group]]+=1
        print('PESOS',o.name,C.most_common(12))
    sys.exit(0)
if os.environ.get('NOSTOS_ROPA'):
    for k,a in ARMS.items():clip_report(k,a)
    if os.environ.get('NOSTOS_VER'):
        for k,a in ARMS.items():clip_render(k,a,int(os.environ.get('NOSTOS_FOT','19')),os.path.join(os.environ['NOSTOS_VER'],k))
    sys.exit(0)
# un archivo por personaje (los huesos se llaman igual en todos y así cada uno se anima por separado)
tot=0
for k,a in ARMS.items():
    bpy.ops.object.select_all(action='DESELECT');a.select_set(True)
    for o in bpy.data.objects:
        if o.parent==a:o.select_set(True)
    f=os.path.join(OUT,'personaje_'+k+'.glb')
    bpy.ops.export_scene.gltf(filepath=f,export_format='GLB',export_skins=True,export_animations=True,export_animation_mode='NLA_TRACKS',
        export_image_format='JPEG',export_jpeg_quality=85,export_apply=False,export_yup=True,use_selection=True)
    tot+=os.path.getsize(f);print('GLB',k,os.path.getsize(f))
# versión ligera para el juego: menos triángulos (decimate por pieza) y JPEG más comprimido
RATIO={'toga':0.15,'palla':0.15,'estola':0.2,'tunica':0.2,'exomis':0.25,'lorica':0.4,'galea':0.5,'scutum':0.5,'toga_extremo':0.5,'toga_espalda':0.5,'palla_extremo':0.5,'mono':0.5,'himation':0.13,'cabeza':0.17,'quiton':0.2,'quiton_corto':0.2,'pelo':0.28,'barba':0.32,'coraza':0.4,'escudo':0.35,'greba':0.35,'manga':0.4,'cuerpo':0.5,'pteryges':0.45,'pteryges_b':0.45,'himation_extremo':0.5,'himation_espalda':0.5,'casco':0.5,'ojos':0.6,'orejas':0.6,'cimera':0.6}
def rkey(n):
    n=n.split('.')[0]
    for k in ARMS:n=n.replace(k+'_','')
    return n
# versión alta para el juego (las personas más cercanas): unas cuatro veces más triángulos que la ligera; se exporta antes de reducir más
KA=3.6
for k,a in ARMS.items():
    kids=[o for o in bpy.data.objects if o.parent==a and o.type=='MESH']
    for o in kids:
        r=RATIO.get(rkey(o.name))
        if not r or r*KA>=1:continue
        bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
        d=o.modifiers.new('dec','DECIMATE');d.ratio=r*KA
        bpy.ops.object.modifier_move_to_index(modifier='dec',index=0);bpy.ops.object.modifier_apply(modifier='dec')
    bpy.ops.object.select_all(action='DESELECT');a.select_set(True)
    for o in kids:o.select_set(True)
    f=os.path.join(OUT,'personaje_'+k+'_alta.glb')
    bpy.ops.export_scene.gltf(filepath=f,export_format='GLB',export_skins=True,export_animations=True,export_animation_mode='NLA_TRACKS',
        export_image_format='JPEG',export_jpeg_quality=70,export_apply=False,export_yup=True,use_selection=True)
    sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import compactar_glb;compactar_glb.main(f,f)
    print('GLB ALTA',k,os.path.getsize(f),sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in kids),'triángulos')
for k,a in ARMS.items():
    kids=[o for o in bpy.data.objects if o.parent==a and o.type=='MESH']
    for o in kids:
        r=RATIO.get(rkey(o.name))
        if not r:continue
        r=r*0.62/min(1,r*KA)   # la ligera, sobre lo que dejó la alta
        bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
        d=o.modifiers.new('dec','DECIMATE');d.ratio=r
        bpy.ops.object.modifier_move_to_index(modifier='dec',index=0);bpy.ops.object.modifier_apply(modifier='dec')
    bpy.ops.object.select_all(action='DESELECT');a.select_set(True)
    for o in kids:o.select_set(True)
    f=os.path.join(OUT,'personaje_'+k+'_juego.glb')
    bpy.ops.export_scene.gltf(filepath=f,export_format='GLB',export_skins=True,export_animations=True,export_animation_mode='NLA_TRACKS',
        export_image_format='JPEG',export_jpeg_quality=58,export_apply=False,export_yup=True,use_selection=True)
    sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import compactar_glb;compactar_glb.main(f,f)   # pesos, normales y UV con menos bits
    print('GLB JUEGO',k,os.path.getsize(f),sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in kids),'triángulos')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'personajes.blend'))
print('PERSONAJES OK',tot)
