# Propuestas de caras: renderiza cada propuesta con la MISMA deformación de cara que usa el juego (fvMove, 186_caras_cuerpos_y_estatuas.js)
# sobre la cabeza de alta calidad (modelos/personaje_<tipo>_alta.glb), con los tonos de piel y pelo de la propuesta y, si va sin barba,
# la barba quitada de la malla y de la textura (como bpBeardless, 196). No toca ningún archivo del juego.
# Uso: /opt/bvenv/bin/python herramientas/blender/caras_propuestas.py -- propuestas.json carpeta_salida
import bpy,sys,os,json,math
import numpy as np
from mathutils import Vector
A=sys.argv[sys.argv.index('--')+1:];PJ=json.load(open(A[0]));OUT=A[1];os.makedirs(OUT,exist_ok=True)
RAIZ=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
EY=1.663
def fvs(a,b,t):x=min(1,max(0,(t-a)/(b-a)));return x*x*(3-2*x)
def fvg(t):return math.exp(-t*t)
def fvMove(x,y,z,P):   # copia literal de fvMove (186): x,y,z en metros del modelo del juego (Y arriba, la cara hacia +Z)
    Y=y-EY;ax=abs(x);sg=-1 if x<0 else 1;g=lambda k:P.get(k,0)
    keep=fvs(-0.158,-0.128,Y)*fvs(0.14,0.10,Y)
    if keep<=0:return x,y,z
    front=fvs(0.04,0.085,z);front2=fvs(-0.02,0.06,z);dx=dy=dz=0
    wn=fvg(x/0.02)*fvg((Y+0.03)/0.034)*fvs(0.078,0.1,z);dz+=g('nz')*wn;dx+=x*g('nw')*fvg(x/0.03)*fvg((Y+0.04)/0.022)*fvs(0.07,0.095,z)
    dz+=g('aq')*fvg(x/0.012)*fvg((Y+0.014)/0.013)*fvs(0.085,0.1,z);dy+=g('sn')*fvg(x/0.016)*fvg((Y+0.042)/0.012)*fvs(0.09,0.11,z)
    dz+=g('br')*fvg((Y-0.028)/0.011)*fvg(x/0.05)*front
    dx+=sg*g('cb')*fvg((ax-0.052)/0.02)*fvg((Y+0.016)/0.018)*fvs(0.0,0.05,z)
    dx+=sg*g('cf')*fvg((ax-0.048)/0.022)*fvg((Y+0.06)/0.022)*fvs(0.0,0.05,z)
    dz+=g('lp')*fvg((Y+0.071)/0.01)*fvg(x/0.022)*front
    jaw=fvs(-0.045,-0.095,Y);dx+=x*g('jw')*jaw;dz+=g('ch')*fvg(x/0.028)*fvg((Y+0.108)/0.022)*front
    dy-=g('fl')*fvs(-0.01,-0.1,Y)
    dx+=x*g('fw')*front2*fvs(0.09,0.03,Y)
    return x+dx*keep,y+dy*keep,z+dz*keep
import re
HEAD=re.compile(r'_(cabeza|orejas|ojos|pelo|barba|mono|cinta)$')
def load(kind):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(RAIZ,'modelos','personaje_%s_alta.glb'%kind))
    for o in bpy.data.objects:
        if o.type=='ARMATURE':o.data.pose_position='REST'
    bpy.context.view_layer.update()
    base={}
    for o in bpy.data.objects:
        if o.type=='MESH' and HEAD.search(o.name.split('.')[0]):base[o.name]=[v.co.copy() for v in o.data.vertices]
    tex={}
    for m in bpy.data.materials:
        if not m.use_nodes:continue
        for n in m.node_tree.nodes:
            if n.type=='TEX_IMAGE' and n.image:tex[m.name]=n.image
    return base,tex
def tint(m,rgb,key):
    nt=m.node_tree;b=nt.nodes.get('Principled BSDF')
    if not b:return
    inp=b.inputs['Base Color'];src=inp.links[0].from_socket if inp.links else None
    mx=nt.nodes.get('tinte') or nt.nodes.new('ShaderNodeMixRGB');mx.name='tinte';mx.blend_type='MULTIPLY';mx.inputs[0].default_value=1.0
    if src and src.node!=mx:nt.links.new(src,mx.inputs[1])
    mx.inputs[2].default_value=(min(1,rgb[0]/1.0) if False else rgb[0],rgb[1],rgb[2],1);nt.links.new(mx.outputs[0],inp)
def beardless(img):
    W,H=img.size;px=np.array(img.pixels[:],dtype=np.float32).reshape(H,W,4);cv=px[::-1]   # filas de arriba abajo, como el lienzo del juego
    sr,sg,sb=cv[int(H*0.9),int(W*0.12),:3];sl=sr+sg+sb
    y0=int(H*0.535);x0=int(W*0.25);x1=int(math.ceil(W*0.75))
    reg=cv[y0:,x0:x1,:3].sum(axis=2)<sl*0.94;M=np.zeros((H,W),bool);M[y0:,x0:x1]=reg
    from numpy.lib.stride_tricks import sliding_window_view
    P=np.pad(M,2);D=sliding_window_view(P,(5,5)).any(axis=(2,3));D[:y0]=False
    if M.sum()<W*H*0.01:return img
    cv[D,0]=sr*0.98;cv[D,1]=sg*0.98;cv[D,2]=sb*0.98
    yy,xx=np.mgrid[0:H,0:W];cx,cy,lw,lh=W*0.5,H*0.716,W*0.034,H*0.011
    L=((xx-cx)/lw)**2+((yy-cy)/lh)**2<=1;cv[L,0]=sr*0.86;cv[L,1]=sg*0.62;cv[L,2]=sb*0.58
    ln=(abs(yy-cy)<max(1,W/800))&(abs(xx-cx)<lw*0.95);cv[ln,0]=sr*0.45;cv[ln,1]=sg*0.3;cv[ln,2]=sb*0.28
    n=img.copy();n.pixels=cv[::-1].ravel().tolist();return n
def scene_setup(head):
    sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=24;sc.render.resolution_x=360;sc.render.resolution_y=360
    sc.world=bpy.data.worlds.new('w');sc.world.use_nodes=True;bg=sc.world.node_tree.nodes['Background'];bg.inputs[0].default_value=(0.62,0.58,0.52,1);bg.inputs[1].default_value=0.9
    l=bpy.data.lights.new('sol','SUN');l.energy=3.2;lo=bpy.data.objects.new('sol',l);lo.rotation_euler=(0.9,0.2,-0.5);sc.collection.objects.link(lo)
    f=bpy.data.lights.new('rel','AREA');f.energy=40;f.size=1.5;fo=bpy.data.objects.new('rel',f);fo.location=head+Vector((-1.2,-1.0,0.4));sc.collection.objects.link(fo)
    d=fo.location-head;fo.rotation_euler=(-d).to_track_quat('-Z','Y').to_euler()
    c=bpy.data.cameras.new('c');c.lens=105;co=bpy.data.objects.new('c',c);sc.collection.objects.link(co);sc.camera=co;return sc,co
for sex,kind in(('h','ciudadano'),('m','mujer')):
    for i,pr in enumerate(PJ[sex]):
        base,tex=load(kind)
        for o in bpy.data.objects:
            if o.name not in base:continue
            mw=o.matrix_world;inv=mw.inverted();me=o.data;nm=o.name.split('.')[0]
            W=[mw@c for c in base[o.name]]
            if nm.endswith('_ojos'):   # los ojos se mueven enteros (como en el juego)
                for s in(0,1):
                    idx=[k for k,w in enumerate(W) if (w.x<0)==(s==0)]
                    if not idx:continue
                    cx=sum(W[k].x for k in idx)/len(idx);cy=sum(W[k].z for k in idx)/len(idx);cz=sum(-W[k].y for k in idx)/len(idx)
                    mx,my,mz=fvMove(cx,cy,cz,pr['P']);d=Vector((mx-cx,-(mz-cz),my-cy))
                    for k in idx:me.vertices[k].co=inv@(W[k]+d)
            else:
                for k,w in enumerate(W):
                    x,y,z=fvMove(w.x,w.z,-w.y,pr['P']);me.vertices[k].co=inv@Vector((x,-z,y))
            me.update()
        for m in bpy.data.materials:
            if re.search(r'_(cara|piel)$',m.name):tint(m,pr['sk'],'sk')
            elif re.search(r'_(pelo|barba)$',m.name):
                if pr.get('peloHex') and m.name in tex:   # color de pelo absoluto: el tinte se calcula sobre el color medio de la textura
                    im=tex[m.name];a=np.array(im.pixels[:],dtype=np.float32).reshape(-1,4)[:,:3].mean(axis=0)
                    lin=lambda v:((v+0.055)/1.055)**2.4 if v>0.04045 else v/12.92
                    h=pr['peloHex'].lstrip('#');t=[int(h[k:k+2],16)/255 for k in(0,2,4)]
                    tint(m,[lin(t[k])/max(1e-3,lin(float(a[k]))) for k in range(3)],'hr')
                else:tint(m,pr['hr'],'hr')
        if pr.get('barba',1)==0:
            for o in bpy.data.objects:
                if o.type=='MESH' and re.search('barba|bigote',o.name,re.I):o.hide_render=True
            for m in bpy.data.materials:
                if m.name.endswith('_cara') and m.name in tex:
                    n=beardless(tex[m.name])
                    for nd in m.node_tree.nodes:
                        if nd.type=='TEX_IMAGE':nd.image=n
        hb=[o for o in bpy.data.objects if o.type=='MESH' and o.name.split('.')[0].endswith('_cabeza')][0]
        ws=[hb.matrix_world@v.co for v in hb.data.vertices];zt=max(w.z for w in ws)
        head=Vector((0,min(w.y for w in ws)+0.11,zt-0.13))
        sc,co=scene_setup(head)
        for view,a in((0,0.0),(1,0.6)):
            dd=1.25;co.location=head+Vector((math.sin(a)*dd,-math.cos(a)*dd,0.02));dv=head-co.location;co.rotation_euler=dv.to_track_quat('-Z','Y').to_euler()
            sc.render.filepath=os.path.join(OUT,'%s_%02d_%d.png'%(sex,i,view));bpy.ops.render.render(write_still=True)
        print('CARA',sex,i,pr['n'],flush=True)
print('FIN')
