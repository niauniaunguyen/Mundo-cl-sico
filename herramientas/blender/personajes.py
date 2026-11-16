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
    for a,b in E:bm.edges.new((V[a],V[b]))
    bm.to_mesh(me);bm.free()
    sk=ob.modifiers.new('piel','SKIN')
    R={'pelvis':(0.16,0.11),'hips':(0.165,0.11),'spine':(0.15,0.1),'chest':(0.185,0.12),'neck':(0.064,0.062),'head':(0.06,0.06),'crotch':(0.1,0.08)}
    if female:R.update({'hips':(0.175,0.115),'spine':(0.135,0.095),'chest':(0.165,0.115),'pelvis':(0.17,0.115)})
    for k in('L','R'):
        R.update({'trap.'+k:(0.055,0.06),'clav.'+k:(0.07,0.07),'sho.'+k:(0.078,0.075),'delt.'+k:(0.074,0.072),'bic.'+k:(0.064,0.066),'elb.'+k:(0.048,0.05),'fore.'+k:(0.056,0.05),'wri.'+k:(0.034,0.026),'pal.'+k:(0.04,0.018),'thu.'+k:(0.012,0.012),'f0.'+k:(0.008,0.008),'f1.'+k:(0.009,0.009),'f2.'+k:(0.009,0.009),'f3.'+k:(0.008,0.008),
                  'hip.'+k:(0.095,0.09),'thi.'+k:(0.09,0.09),'kne.'+k:(0.057,0.06),'calf.'+k:(0.066,0.068),'ank.'+k:(0.038,0.04),'toe.'+k:(0.045,0.025),'heel.'+k:(0.035,0.03)})
    keys=list(pts.keys())
    for i,v in enumerate(me.skin_vertices[0].data):
        r=R.get(keys[i],(0.05,0.05));v.radius=r
    me.skin_vertices[0].data[keys.index('pelvis')].use_root=True
    sub=ob.modifiers.new('sub','SUBSURF');sub.levels=1;sub.render_levels=1
    bpy.context.view_layer.objects.active=ob
    for m in list(ob.modifiers):bpy.ops.object.modifier_apply(modifier=m.name)
    fix_normals(ob)
    return ob

def fix_normals(ob):
    me=ob.data;me.validate(verbose=False);bm=bmesh.new();bm.from_mesh(me);bmesh.ops.remove_doubles(bm,verts=bm.verts,dist=1e-6)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(me);bm.free()
    for p in me.polygons:p.use_smooth=True
# ------------------------------------------------------------------ cabeza esculpida (malla aparte, con su propia proyección UV)
HC=Vector((0,-0.01,1.655));HR=(0.098,0.112,0.128)
def _g(p,c,s):return math.exp(-((p[0]-c[0])**2+(p[1]-c[1])**2+(p[2]-c[2])**2)/(s*s))
def head_shape(x,y,z):   # desplazamiento radial sobre la esfera unidad (delante = -Y)
    fr=max(0,-y);d=0
    for s in(1,-1):
        d+=0.06*_g((x,y,z),(0.33*s,-0.9,0.3),0.22)      # arco de las cejas
        d-=0.075*_g((x,y,z),(0.33*s,-0.92,0.07),0.15)   # cuencas de los ojos
        d+=0.055*_g((x,y,z),(0.55*s,-0.72,-0.1),0.22)   # pómulos
        d-=0.04*_g((x,y,z),(0.82*s,-0.35,0.28),0.25)    # sienes
        d+=0.05*_g((x,y,z),(0.11*s,-0.95,-0.3),0.09)    # aletas de la nariz
    rz=min(1,max(0,(0.12-z)/0.4))**1.4;nose=0.2*math.exp(-(x/(0.05+0.04*rz))**2)*rz*(1 if z>-0.28 else math.exp(-((z+0.28)/0.04)**2))*min(1,fr*2.2)
    d+=nose
    d-=0.02*math.exp(-(x/0.25)**2-((z+0.42)/0.12)**2)*fr      # la boca, algo más atrás que la nariz
    d+=0.03*math.exp(-(x/0.2)**2-((z+0.47)/0.06)**2)*fr      # labio superior
    d-=0.03*math.exp(-(x/0.2)**2-((z+0.555)/0.03)**2)*fr      # línea de la boca
    d+=0.04*math.exp(-(x/0.16)**2-((z+0.63)/0.07)**2)*fr      # labio inferior
    d+=0.11*_g((x,y,z),(0,-0.82,-0.84),0.22)                  # barbilla
    return d
def head_mesh(name,beard=False):
    bm=bmesh.new();bmesh.ops.create_uvsphere(bm,u_segments=72,v_segments=56,radius=1)
    rx,ry,rz=HR
    for v in bm.verts:
        x,y,z=v.co;r=1+head_shape(x,y,z);x*=r;y*=r;z*=r
        t=max(0,-z);x*=1-0.24*t*t;y*=1-0.08*t
        if z<0 and y<0:y-=0.05*t
        if z>0:y*=1+0.08*z
        v.co=Vector((x*rx,y*ry,z*rz))+HC
    # aberturas de los ojos (almendra): detrás van los globos oculares
    kill=[]
    for f in bm.faces:
        q=f.calc_center_median()-HC;a=math.atan2(q.x,-q.y)
        for sg in(1,-1):
            da=a-EYE_A*sg;zz=q.z-EYE_Z-0.004*math.cos(da/EYE_W*1.57)*0   # almendra
            if (da/EYE_W)**2+(zz/(EYE_H*(1-0.35*(da*sg)/EYE_W)))**2<1:kill.append(f)
    bmesh.ops.delete(bm,geom=kill,context='FACES')
    me=bpy.data.meshes.new(name);bm.to_mesh(me);bm.free();ob=bpy.data.objects.new(name,me);scn.collection.objects.link(ob)
    for p in me.polygons:p.use_smooth=True
    head_uv(me)
    return ob
EYE_A,EYE_Z,EYE_W,EYE_H=0.34,0.008,0.105,0.0072
def eye_mesh(name,head):   # globos oculares detrás de las aberturas, mirando al frente
    bm=bmesh.new();hb=BVHTree.FromObject(head,bpy.context.evaluated_depsgraph_get())
    for sg in(1,-1):
        d=Vector((math.sin(EYE_A*sg),-math.cos(EYE_A*sg),0)).normalized();o=HC+Vector((0,0,EYE_Z))
        # radio de la cara junto a la abertura (un poco por encima)
        hit=hb.ray_cast(o+Vector((0,0,0.018))+d*0.3,-d,0.3);R=(hit[0]-(o+Vector((0,0,0.018)))).length if hit[0] else 0.1
        c=o+d*(R-0.0135);r=0.0128
        g=bmesh.ops.create_uvsphere(bm,u_segments=16,v_segments=12,radius=r,matrix=Matrix.Translation(c)@Euler((math.radians(90),0,0)).to_matrix().to_4x4())
    me=bpy.data.meshes.new(name);bm.to_mesh(me);bm.free();ob=bpy.data.objects.new(name,me);scn.collection.objects.link(ob)
    for p in me.polygons:p.use_smooth=True
    uv=me.uv_layers.new(name='UVMap')   # proyección frontal por ojo: el iris en el centro
    for poly in me.polygons:
        for li in poly.loop_indices:
            co=me.vertices[me.loops[li].vertex_index].co;sg=1 if co.x>0 else -1
            cx=math.sin(EYE_A*sg)*0.1;q=co-HC
            uv.data[li].uv=(0.5+(q.x-cx*1.0)/0.03,0.5+(q.z-EYE_Z)/0.03)
    return ob
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
    bm=bmesh.new();N=10;K=8;rings=[]
    for i in range(N+1):
        t=i/N;z=HC.z+0.018-t*0.052;w=0.0065+0.0095*t**1.5;pr=0.004+0.026*t**1.25   # ancho y cuánto sobresale
        yb=HC.y-HR[1]*0.985   # superficie de la cara
        ring=[]
        for k in range(K):
            q=k/K*TAU;x=math.cos(q)*w;yy=-max(0,math.sin(q))*pr+0.004
            if t>0.8:x*=1+0.6*(t-0.8)/0.2*(1-abs(math.sin(q)))   # aletas
            ring.append(bm.verts.new((x,yb+yy,z)))
        rings.append(ring)
    for i in range(N):
        for k in range(K):bm.faces.new((rings[i][k],rings[i][(k+1)%K],rings[i+1][(k+1)%K],rings[i+1][k]))
    bm.faces.new(rings[-1]);bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    ob=obj_from_bm(name,bm);head_uv(ob.data);return ob
def ear_mesh(name):
    bm=bmesh.new()
    for s in(1,-1):
        g=bmesh.ops.create_uvsphere(bm,u_segments=12,v_segments=10,radius=1)
        for v in g['verts']:
            x,y,z=v.co
            if x>0.2:x-=0.55*math.exp(-(y*y+z*z)/0.25)   # concha
            v.co=Vector((x*0.011*s,y*0.022,z*0.031))
            v.co=Euler((0,0,math.radians(-14*s))).to_matrix()@v.co+HC+Vector((0.093*s,0.01,0.0))
    me=bpy.data.meshes.new(name);bm.to_mesh(me);bm.free();ob=bpy.data.objects.new(name,me);scn.collection.objects.link(ob)
    for p in me.polygons:p.use_smooth=True
    head_uv(me);return ob
def hairline(a):return 0.07-0.035*math.cos(a)+0.006*math.sin(a*13)
def hair_shell(name,head,kind):   # pelo o barba con volumen: copia de la cabeza en la zona del pelo, separada y con rizos
    me=head.data;bm=bmesh.new();bm.from_mesh(me);bm.verts.ensure_lookup_table()
    def zone(co):
        q=co-HC;a=math.atan2(q.x,-q.y);z=q.z
        if kind=='pelo':return z>hairline(a)-0.004
        mouth=False
        return ((z<-0.05+0.045*min(1,max(0,abs(a)-0.25)/0.6) and abs(a)<1.35) or (abs(a)<0.2 and -0.064<z<-0.052)) and not mouth
    keep=set(v for v in bm.verts if zone(v.co))
    bmesh.ops.delete(bm,geom=[f for f in bm.faces if not all(v in keep for v in f.verts)],context='FACES')
    bmesh.ops.delete(bm,geom=[v for v in bm.verts if not v.link_faces],context='VERTS')
    for v in bm.verts:
        q=v.co-HC;a=math.atan2(q.x,-q.y);n=Vector((q.x/HR[0]**2,q.y/HR[1]**2,q.z/HR[2]**2)).normalized()
        curl=0.5+0.5*math.sin(a*26+q.z*170)*math.sin(a*11-q.z*90)
        if kind=='pelo':off=0.007+0.006*curl+0.004*max(0,q.z)/0.13
        else:off=0.005+0.007*curl+0.012*max(0,-(q.z+0.06))/0.07
        v.co+=n*off
    me2=bpy.data.meshes.new(name);bm.to_mesh(me2);bm.free();ob=bpy.data.objects.new(name,me2);scn.collection.objects.link(ob)
    for p in me2.polygons:p.use_smooth=True
    sol=ob.modifiers.new('g','SOLIDIFY');sol.thickness=0.004;sol.offset=-1;bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='g')
    head_uv(me2);return ob
def hair_tex(name,base,size=256):   # mechones: rayas finas en dirección de la caída, con brillo
    H=W=size;v,u=np.mgrid[0:H,0:W];u=(u+0.5)/W;v=(v+0.5)/H
    st=0.75+0.35*(0.5+0.5*np.sin(u*TAU*70+np.sin(v*40)*2))*(0.6+0.4*np.sin(u*TAU*13))
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
    sh=Vector(sho);el=Vector(elb);ax=(el-sh).normalized();a0=sh+Vector((-0.06*sg,0,0.06));a1=sh.lerp(el,0.82)
    up=Vector((sg,0,0.35)).normalized();u1=(up-ax*up.dot(ax)).normalized();u2=ax.cross(u1).normalized()
    bm=bmesh.new();N=14;K=22;rows=[]
    for i in range(N+1):
        t=i/N;p=a0.lerp(a1,t);R=0.102+0.008*t**0.8
        row=[]
        for k in range(K):
            q=k/K*TAU;fold=0.006*(0.3+0.7*t)*(1+math.sin(q*7+t*2))
            sag=0.006*t*max(0,-math.cos(q))   # cuelga un poco por debajo del brazo
            hem=(0.012*math.sin(q*5)+0.01*max(0,-math.cos(q))) if i==N else 0
            row.append(bm.verts.new(p+ax*hem+(u1*math.cos(q)+u2*math.sin(q))*(R+fold)-u1*sag))
        rows.append(row)
    uvl=bm.loops.layers.uv.new('UVMap')
    for i in range(N):
        for k in range(K):
            f=bm.faces.new((rows[i][k],rows[i][(k+1)%K],rows[i+1][(k+1)%K],rows[i+1][k]))
            for l,(dk,di) in zip(f.loops,((0,0),(1,0),(1,1),(0,1))):l[uvl].uv=((k+dk)/K,1-(i+di)/N)
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    ob=obj_from_bm(name,bm);sol=ob.modifiers.new('g','SOLIDIFY');sol.thickness=0.005;bpy.context.view_layer.objects.active=ob;bpy.ops.object.modifier_apply(modifier='g')
    b2=bmesh.new()
    for t in(0.25,0.55,0.85):
        p=a0.lerp(a1,t)+u1*(0.102+0.008*t**0.8+0.01)
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
def drape_weights(ob):   # el extremo del manto cuelga del hombro y del pecho, no de las piernas
    for g in list(ob.vertex_groups):ob.vertex_groups.remove(g)
    C=ob.vertex_groups.new(name='chest');S=ob.vertex_groups.new(name='clavicle.L');H=ob.vertex_groups.new(name='hips')
    for v in ob.data.vertices:
        z=v.co.z;k=min(1,max(0,(z-0.8)/0.6))
        C.add([v.index],0.55*k+0.45*(1-k),'REPLACE');S.add([v.index],0.45*k,'REPLACE');H.add([v.index],0.55*(1-k),'REPLACE')
def drape_end(name,path,width,folds=3,famp=0.03):   # extremo de un manto que cuelga: tira con pliegues en zigzag a lo largo de un camino
    bm=bmesh.new();P=[Vector(p) for p in path];N=24;rows=[];W=8
    pts=[]
    for i in range(N+1):   # interpolación Catmull-Rom
        t=i/N*(len(P)-1);k=min(int(t),len(P)-2);f=t-k
        p0=P[max(0,k-1)];p1=P[k];p2=P[k+1];p3=P[min(len(P)-1,k+2)]
        pts.append(0.5*((2*p1)+(-p0+p2)*f+(2*p0-5*p1+4*p2-p3)*f*f+(-p0+3*p1-3*p2+p3)*f*f*f))
    for i,p in enumerate(pts):
        tg=(pts[min(N,i+1)]-pts[max(0,i-1)]).normalized();side=tg.cross(Vector((0,0,1)))
        if side.length<0.1:side=Vector((1,0,0))
        side.normalize();nrm=side.cross(tg).normalized();t=i/N;w=width*(0.6+0.5*t)
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
def skin_tex(name,base,beard=None,hair='#3b2a1e',size=512):   # cabeza: piel, cejas, ojos, labios y pelo pintados (UV cilíndrica), con bordes suaves
    H=W=size;v,u=np.mgrid[0:H,0:W];u=(u+0.5)/W;v=(v+0.5)/H
    a=(u-0.5)*TAU;z=v*0.34-0.16
    col=np.ones((H,W,3))*hexc(base)
    col*=(0.9+0.12*np.clip(z*4+0.5,0,1))[...,None]
    cheek=np.exp(-((np.abs(a)-0.55)**2/0.04+(z+0.02)**2/0.004));col+=np.array([0.10,0.01,-0.01])*cheek[...,None]*0.6
    def layer(mask,c,k=1.0,soft=1):
        m=blur(mask.astype(float),soft)*k;cc=hexc(c) if isinstance(c,str) else c
        col[:]=col*(1-m[...,None])+cc*m[...,None]
    G=lambda a0,z0,sa,sz:np.exp(-((a-a0)/sa)**2-((z-z0)/sz)**2)
    light=0.09*G(0,0.075,0.5,0.03)+0.07*np.exp(-(a/0.05)**2)*((z>-0.04)&(z<0.03))+0.06*(G(0.55,-0.012,0.15,0.012)+G(-0.55,-0.012,0.15,0.012))+0.04*G(0,-0.1,0.18,0.012)
    shade=0.14*(G(0.34,0.024,0.16,0.008)+G(-0.34,0.024,0.16,0.008))+0.09*(G(0.12,-0.025,0.05,0.022)+G(-0.12,-0.025,0.05,0.022))+0.12*G(0,-0.042,0.1,0.006)
    for s2 in(1,-1):shade+=0.06*np.exp(-((a*s2-(0.17+np.clip(-z-0.04,0,0.06)*1.6))/0.03)**2)*((z<-0.035)&(z>-0.095))   # surcos de la nariz a la boca
    shade+=0.16*np.clip((-z-0.1)/0.05,0,1)+0.12*np.clip((np.abs(a)-0.9)/0.6,0,1)   # bajo la mandíbula y hacia los lados
    col*=(1+light-shade)[...,None]
    for s2 in(1,-1):
        da=a-EYE_A*s2
        rim=((da/(EYE_W*1.25))**2+((z-EYE_Z)/(EYE_H*1.45))**2<1)
        layer(rim,'#5a3424',0.55,2)   # sombra del párpado alrededor de la abertura
        layer((np.abs(da)<EYE_W*1.05)&(np.abs(z-EYE_Z-EYE_H*0.95)<0.0022),'#2a1a10',0.85,1)   # línea del párpado superior
        layer((np.abs(da+0.02*s2)<0.13)&(np.abs(z-0.038-0.01*np.cos(da*8))<0.0045),hair,0.85,1)   # ceja
    lipw=0.15*(1-0.35*np.clip(np.abs(a)/0.15,0,1)**2)
    layer((np.abs(a)<lipw)&(z>-0.0705)&(z<-0.066),'#7e4236',0.8,1)   # labio superior
    layer((np.abs(a)<lipw*0.95)&(z>-0.076)&(z<-0.0705),'#9a5a4a',0.7,1)   # labio inferior
    layer((np.abs(a)<lipw*0.9)&(np.abs(z+0.0705)<0.0011),'#3a1810',0.9,0)   # línea de cierre
    hl=0.07-0.035*np.cos(a)+0.006*np.sin(a*13)
    hm=z>hl;strand=0.85+0.25*np.sin(a*60+z*90+np.sin(a*7)*3)*0.5
    hc=hexc(hair)[None,None,:]*strand[...,None];m=blur(hm.astype(float),2);col[:]=col*(1-m[...,None])+hc*m[...,None]
    if beard:
        bm=(z<-0.025+0.02*np.clip(np.abs(a)-0.6,0,1))&(np.abs(a)<1.35)
        mouth=((a/0.2)**2+((z+0.072)/0.012)**2)<1
        bm&=~mouth
        must=(np.abs(a)<0.22)&(np.abs(z+0.058)<0.009)&(np.abs(a)>0.02)
        bb=(bm|must).astype(float);bc=hexc(beard)[None,None,:]*(0.8+0.35*np.sin(a*80+z*120)*0.5)[...,None]
        m=blur(bb,3)*0.95;col[:]=col*(1-m[...,None])+bc*m[...,None]
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
        wl=0.5*min(1,max(0,(zc-z)/0.6));sL=min(1,max(0,0.5+v.co.x/0.28))
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

def build(kind):
    female=False
    arm=make_armature(kind+'_esqueleto');arm.data.pose_position='REST'
    body=body_mesh(kind+'_cuerpo',female);head=head_mesh(kind+'_cabeza',beard=(kind=='ciudadano'))
    smart_uv(body);skin=plain_tex(kind+'_piel','#d2a07a',0.04)
    set_mat(body,material(kind+'_piel',skin))
    hair='#5e4029'
    set_mat(head,material(kind+'_cara',skin_tex(kind+'_cara','#d2a07a',beard=('#6e4c33' if kind=='ciudadano' else None),hair=hair)))
    ears=ear_mesh(kind+'_orejas');set_mat(ears,body.data.materials[0])
    nose=nose_mesh(kind+'_nariz');set_mat(nose,head.data.materials[0])
    eyes=eye_mesh(kind+'_ojos',head);set_mat(eyes,material(kind+'_ojo',eye_tex(kind+'_ojo')))
    hm_=material(kind+'_pelo',hair_tex(kind+'_pelo',hair))
    hs=hair_shell(kind+'_pelo',head,'pelo');set_mat(hs,hm_)
    bd=hair_shell(kind+'_barba',head,'barba');set_mat(bd,material(kind+'_barba',hair_tex(kind+'_barba','#6e4c33' if kind=='ciudadano' else '#4a3424')))
    pieces=[head,ears,nose,eyes,hs,bd];rigid=[]
    cuero=material('cuero',plain_tex('cuero','#6a4428',0.15),rough=0.7)
    for o in sandals('sandalia',body):set_mat(o,cuero);pieces.append(o)
    if kind=='ciudadano':
        # quitón largo de lino (hasta los tobillos en los hombres mayores; con mangas cortas abrochadas) y himation de lana
        ch=garment('quiton',body,0.1,1.5,0.012,folds=30,famp=0.006,flare=0.05,skirt=True,top=lambda u:1.505+0.06*abs(math.sin(u*TAU))**2-0.05*max(0,math.cos(u*TAU))**3)
        set_mat(ch,material('quiton',cloth_tex('quiton','#e8e0cf',border='#2f4c86',band=(0.0,0.05),folds=30,neck='#2f4c86')))
        def htop(u):   # el himation deja libre el hombro y el brazo derechos y cubre el izquierdo
            a=u*TAU;return 1.17+0.13*(0.5+0.5*math.sin(a))**1.3   # en diagonal: alto en el hombro izquierdo (+X), bajo en la axila derecha
        hm=garment('himation',body,0.22,1.5,0.03,folds=11,famp=0.026,flare=0.11,top=htop,skirt=True,over=ch)
        set_mat(hm,material('himation',cloth_tex('himation','#6d7b9a',border='#2a2a3a',band=(0.0,0.045),folds=11)))
        for o in(ch,hm):pieces.append(o)
        # el extremo del himation cae por delante desde el hombro izquierdo, y el otro por la espalda
        e1=drape_end('himation_extremo',[(0.085,0.02,1.535),(0.1,-0.085,1.49),(0.115,-0.165,1.35),(0.13,-0.205,1.05),(0.14,-0.22,0.75),(0.145,-0.225,0.5)],0.17,folds=2.5,famp=0.022)
        e2=drape_end('himation_espalda',[(0.12,0.08,1.5),(0.16,0.16,1.3),(0.17,0.2,1.0),(0.17,0.21,0.7)],0.24,folds=3,famp=0.02)
        for e in(e1,e2):set_mat(e,hm.data.materials[0]);pieces.append(e)
        # mangas del quitón jonio: la tela cae suelta del hombro hasta el codo y se abrocha con botones (fíbulas) por encima del brazo
        for k,sg in(('L',1),('R',-1)):
            sl,bt=ionic_sleeve('manga',sg,J['sho.'+k],J['elb.'+k]);set_mat(sl,ch.data.materials[0]);pieces.append(sl)
            set_mat(bt,material('oro',plain_tex('oro','#d9a93a',0.1),metal=0.9,rough=0.3));pieces.append(bt)
    else:
        ch=garment('quiton_corto',body,0.66,1.5,0.012,folds=20,famp=0.008,flare=0.03,skirt=True,top=lambda u:1.505+0.06*abs(math.sin(u*TAU))**2-0.05*max(0,math.cos(u*TAU))**3)
        set_mat(ch,material('quiton_rojo',cloth_tex('quiton_rojo','#9a2a1e',border='#1a120c',band=(0.0,0.05),folds=20)))
        # coraza de lino (linothorax): rígida, de la cintura a las axilas, con pteryges (tiras) abajo
        lt=garment('coraza',body,0.86,1.43,0.03,folds=1,famp=0.0,skirt=False,nu=48,nv=12)
        set_mat(lt,material('coraza',cloth_tex('coraza','#e6dcc4',border='#a3301f',band=(0.0,0.12),folds=1,neck='#2f4c86',wool=False),rough=0.6))
        def ptery(u,v):return int(u*36)%2==1 and v<0.999   # tiras sueltas
        pt=garment('pteryges',body,0.6,0.86,0.04,folds=36,famp=0.004,skirt=True,flare=0.0,nu=72,nv=4,clip=lambda u,v:int(u*36)%3==2)
        set_mat(pt,lt.data.materials[0])
        for sgn in(1,-1):   # epomides: piezas que pasan por encima del hombro, de la espalda al pecho, ajustadas a él
            ep=shoulder_flap('hombrera',body,sgn);smart_uv(ep);set_mat(ep,lt.data.materials[0]);pieces.append(ep)
        # grebas de bronce, ajustadas a la pantorrilla y con la rodilla marcada
        for k in('L','R'):
            kn=Vector(J['kne.'+k]);an=Vector(J['ank.'+k])
            gr=limb_shell('greba',body,an+Vector((0,0,0.05)),kn+Vector((0,0,0.06)),0.007,nu=28,nv=12,knee=0.018,gap=1.0)
            set_mat(gr,material('bronce',plain_tex('bronce','#c4943e',0.1),metal=0.85,rough=0.35) if 'bronce' not in bpy.data.materials else bpy.data.materials['bronce']);pieces.append(gr)
        for o in(ch,lt,pt):pieces.append(o)
        hel,crest=helmet();smart_uv(hel);set_mat(hel,bpy.data.materials['bronce']);smart_uv(crest);set_mat(crest,material('crin',plain_tex('crin','#7a1e14',0.2)))
        rigid+=[(hel,'head'),(crest,'head')]
        sh,img=shield();set_mat(sh,material('escudo',img,metal=0.3,rough=0.5))
        # el escudo en el brazo izquierdo (porpax en el antebrazo)
        fa=Vector(J['elb.L']).lerp(Vector(J['wri.L']),0.5);sh.location=fa+Vector((0.07,-0.06,0.05));sh.rotation_euler=(0,0,math.radians(-10))
        rigid.append((sh,'forearm.L'))
        sp=spear();smart_uv(sp);set_mat(sp,material('madera',plain_tex('madera','#6b4a2e',0.15)))
        sp.location=Vector(J['fin.R'])+Vector((0,-0.02,0.05));sp.rotation_euler=(math.radians(-8),0,0);rigid.append((sp,'hand.R'))
    skin_to(arm,pieces,body)
    for o in pieces:
        if o.name.startswith(('himation_extremo','himation_espalda')):drape_weights(o)
        elif o.name.startswith(('quiton','himation','pteryges')):skirt_weights(o)
    for ob,bone in rigid:attach(ob,arm,bone)
    arm.data.pose_position='POSE'
    animate(arm,kind+'_')
    return arm

ARMS={}
for k in('ciudadano','hoplita'):ARMS[k]=build(k)
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
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'personajes.blend'))
print('PERSONAJES OK',tot)
