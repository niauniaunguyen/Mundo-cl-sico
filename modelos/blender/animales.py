# Animales de Nóstos: cada animal en piezas (cuerpo, cabeza con pivote en el cuello, cola, patas con pivote en la cadera).
# Convención del proyecto: Z arriba, el animal mira hacia -Y; el nombre del material indica su papel (coat, beak, comb…).
import bpy,bmesh,math
from mathutils import Matrix,Euler,Vector
OUT='/home/user/Mundo-cl-sico/modelos/'
bpy.ops.wm.read_factory_settings(use_empty=True)
col=bpy.data.collections.new('animales');bpy.context.scene.collection.children.link(col)
MATS={}
def mat(role):
    if role not in MATS:
        m=bpy.data.materials.new(role);MATS[role]=m
    return MATS[role]
def M(loc=(0,0,0),rot=(0,0,0),scl=(1,1,1)):
    return Matrix.Translation(Vector(loc))@Euler(rot).to_matrix().to_4x4()@Matrix.Diagonal(Vector((*scl,1)))
def part(name,pieces,pivot=(0,0,0)):
    bm=bmesh.new();roles=[]
    for kind,role,mtx,a in pieces:
        if role not in roles:roles.append(role)
        n0=len(bm.faces)
        if kind=='sph':bmesh.ops.create_uvsphere(bm,u_segments=a.get('u',12),v_segments=a.get('v',8),radius=1,matrix=mtx)
        elif kind=='cyl':bmesh.ops.create_cone(bm,cap_ends=True,segments=a.get('s',8),radius1=a['r1'],radius2=a['r2'],depth=a['d'],matrix=mtx)
        elif kind=='box':bmesh.ops.create_cube(bm,size=1,matrix=mtx)
        bm.faces.ensure_lookup_table()
        for f in bm.faces[n0:]:f.material_index=roles.index(role)
    bmesh.ops.translate(bm,verts=bm.verts,vec=-Vector(pivot))
    me=bpy.data.meshes.new(name);bm.to_mesh(me);bm.free()
    for r in roles:me.materials.append(mat(r))
    for p in me.polygons:p.use_smooth=True
    ob=bpy.data.objects.new(name,me);ob.location=pivot;col.objects.link(ob);return ob
S=lambda role,loc,scl,rot=(0,0,0),**a:('sph',role,M(loc,rot,scl),a)
def C(role,a,b,r1,r2,s=8):
    # cilindro/cono de a a b (en el mundo)
    a=Vector(a);b=Vector(b);d=(b-a).length;mid=(a+b)/2;q=Vector((0,0,1)).rotation_difference((b-a).normalized())
    return ('cyl',role,Matrix.Translation(mid)@q.to_matrix().to_4x4(),{'r1':r1,'r2':r2,'d':d,'s':s})
def legs4(pfx,fy,by,hx,hy,ln,r,role='coat',foot='hoof',paw=False):
    for k,x,y in (('fl',hx,fy),('fr',-hx,fy),('bl',hx,by),('br',-hx,by)):
        pcs=[C(role,(x,y,hy),(x,y,0.04),r,r*0.8)]
        pcs.append(S(foot,(x,y-(0.02 if paw else 0),0.03),(r*1.15,r*(1.5 if paw else 1.1),r*0.7)) )
        part(pfx+'_leg_'+k,pcs,(x,y,hy))
def legs2(pfx,hx,hy,ln,r,role='beak'):
    for k,x in (('l',hx),('r',-hx)):
        part(pfx+'_leg_'+k,[C(role,(x,0,hy),(x,0,0.02),r,r*0.9),S(role,(x,-0.03,0.01),(r*1.6,r*3.5,r*0.6)),S(role,(x+r*2,-0.02,0.01),(r*1.2,r*2.6,r*0.5),(0,0,0.5)),S(role,(x-r*2,-0.02,0.01),(r*1.2,r*2.6,r*0.5),(0,0,-0.5))],(x,0,hy))
# ---------------------------------------------------------------- perro (laconio de talla media; moloso y melitense se escalan en el juego)
part('A_dog_body',[S('coat',(0,0.02,0.55),(0.15,0.36,0.16)),S('coat',(0,-0.24,0.57),(0.17,0.17,0.19)),S('coat',(0,0.26,0.56),(0.14,0.13,0.15)),C('coat',(0,-0.3,0.62),(0,-0.43,0.76),0.085,0.07)])
part('A_dog_head',[S('coat',(0,-0.5,0.83),(0.085,0.1,0.085)),S('coat',(0,-0.63,0.8),(0.05,0.085,0.042)),S('nose',(0,-0.71,0.795),(0.022,0.02,0.02)),
  S('eye',(0.04,-0.58,0.85),(0.012,0.012,0.012)),S('eye',(-0.04,-0.58,0.85),(0.012,0.012,0.012)),
  S('coat',(0.06,-0.47,0.9),(0.022,0.03,0.055),(0.4,0,0.3)),S('coat',(-0.06,-0.47,0.9),(0.022,0.03,0.055),(0.4,0,-0.3))],(0,-0.43,0.76))
part('A_dog_tail',[C('coat',(0,0.36,0.62),(0,0.52,0.82),0.03,0.012)],(0,0.36,0.62))
legs4('A_dog',-0.24,0.28,0.08,0.48,0.46,0.035,'coat','coat',True)
# ---------------------------------------------------------------- tipos de perro antiguos (cada uno con su propio modelo)
def dog(pfx,H,bl,bw,bd,chest,head,mz,mw,ears,tail,lr,fluffy=False,dewlap=False):
    y0=H+0.07;pcs=[S('coat',(0,0.02,y0),(bw,bl,bd)),S('coat',(0,-bl*0.62,y0+0.02),(chest[0],chest[1],chest[2])),S('coat',(0,bl*0.7,y0+0.01),(bw*0.9,bl*0.35,bd*0.9))]
    nb=(0,-bl*0.8,y0+0.07);nt=(0,-bl*1.05,y0+0.2+head*0.6)
    pcs.append(C('coat',nb,nt,head*0.9,head*0.75))
    if dewlap:pcs.append(S('coat',(0,-bl*0.95,y0+0.06),(head*0.7,head*0.6,head*0.8)))
    if fluffy:
        for k in range(14):a=k/14*6.283;pcs.append(S('coat',(math.cos(a)*bw*0.95,bl*(-0.6+1.2*(k%7)/6),y0-bd*0.55),(bw*0.45,bl*0.22,bd*0.85)))
    part(pfx+'_body',pcs)
    hc=(0,nt[1]-head*0.5,nt[2]+head*0.2)
    hp=[S('coat',hc,(head,head*1.15,head*0.95)),S('coat',(0,hc[1]-head*0.6-mz*0.5,hc[2]-head*0.22),(mw,mz*0.62,mw*0.85)),S('nose',(0,hc[1]-head*0.62-mz,hc[2]-head*0.27),(mw*0.45,mw*0.4,mw*0.4)),
        S('eye',(head*0.5,hc[1]-head*0.75,hc[2]+head*0.2),(0.011,0.011,0.011)),S('eye',(-head*0.5,hc[1]-head*0.75,hc[2]+head*0.2),(0.011,0.011,0.011))]
    for sx in (1,-1):
        if ears=='erect':hp.append(C('coat',(sx*head*0.55,hc[1]+head*0.1,hc[2]+head*0.6),(sx*head*0.75,hc[1]+head*0.15,hc[2]+head*1.5),head*0.32,0.004,6))
        elif ears=='drop':hp.append(S('coat',(sx*head*0.95,hc[1]+head*0.05,hc[2]-head*0.1),(head*0.12,head*0.45,head*0.75)))
        elif ears=='long':hp.append(S('coat',(sx*head*0.95,hc[1]+head*0.05,hc[2]-head*0.55),(head*0.1,head*0.5,head*1.25)))
        elif ears=='fluffy':hp.append(S('coat',(sx*head*0.9,hc[1]+head*0.1,hc[2]-head*0.35),(head*0.35,head*0.4,head*0.85)))
    part(pfx+'_head',hp,nb)
    tb=(0,bl*0.95,y0+0.06)
    if tail=='saber':tp=[C('coat',tb,(0,bl*1.4,y0+0.32),0.03*lr/0.035,0.012)]
    elif tail=='curl':tp=[C('coat',tb,(0,bl*1.05,y0+0.25),0.03,0.025),C('coat',(0,bl*1.05,y0+0.25),(0,bl*0.8,y0+0.32),0.025,0.012)]
    else:tp=[S('coat',(0,bl*0.95,y0+bd*0.9+0.04*k),(0.06,0.09-0.015*k,0.05)) for k in range(4)]
    part(pfx+'_tail',tp,tb)
    hy=H;fy=-bl*0.62;by=bl*0.72;hx=bw*0.6
    for k,x,y in (('fl',hx,fy),('fr',-hx,fy),('bl',hx,by),('br',-hx,by)):
        lp=[C('coat',(x,y,hy),(x,y,0.04),lr,lr*0.8),S('coat',(x,y-0.02,0.03),(lr*1.15,lr*1.5,lr*0.7))]
        if fluffy:lp.append(S('coat',(x,y,hy*0.5),(lr*2.2,lr*2.2,hy*0.45)))
        part(pfx+'_leg_'+k,lp,(x,y,hy))
dog('A_moloss',0.6,0.42,0.2,0.21,(0.24,0.2,0.24),0.13,0.11,0.075,'drop','saber',0.058,dewlap=True)
dog('A_laconian',0.6,0.36,0.11,0.12,(0.14,0.16,0.19),0.07,0.2,0.035,'erect','saber',0.028)
dog('A_cretan',0.5,0.32,0.12,0.13,(0.14,0.15,0.17),0.075,0.15,0.04,'erect','curl',0.03)
dog('A_melitan',0.12,0.17,0.1,0.1,(0.11,0.1,0.11),0.07,0.06,0.03,'fluffy','plume',0.024,fluffy=True)
dog('A_umbrian',0.5,0.35,0.14,0.15,(0.16,0.16,0.18),0.09,0.15,0.055,'long','saber',0.035)
# ---------------------------------------------------------------- gato (más raro en Grecia; en Roma, ya más común)
part('A_cat_body',[S('coat',(0,0.01,0.24),(0.075,0.19,0.08)),S('coat',(0,-0.12,0.25),(0.08,0.08,0.085))])
part('A_cat_head',[S('coat',(0,-0.24,0.33),(0.06,0.06,0.055)),S('coat',(0,-0.29,0.315),(0.032,0.03,0.025)),S('nose',(0,-0.315,0.32),(0.008,0.006,0.006)),
  S('eye',(0.025,-0.29,0.34),(0.011,0.008,0.011)),S('eye',(-0.025,-0.29,0.34),(0.011,0.008,0.011)),
  C('coat',(0.035,-0.23,0.37),(0.045,-0.23,0.42),0.022,0.002,6),C('coat',(-0.035,-0.23,0.37),(-0.045,-0.23,0.42),0.022,0.002,6)],(0,-0.17,0.28))
part('A_cat_tail',[C('coat',(0,0.18,0.26),(0,0.3,0.4),0.016,0.014),C('coat',(0,0.3,0.4),(0,0.34,0.52),0.014,0.01)],(0,0.18,0.26))
legs4('A_cat',-0.12,0.14,0.045,0.22,0.21,0.017,'coat','coat',True)
# ---------------------------------------------------------------- comadreja (el «gato» de los griegos)
part('A_weasel_body',[S('coat',(0,0,0.085),(0.035,0.15,0.035)),S('belly',(0,-0.08,0.075),(0.028,0.06,0.025))])
part('A_weasel_head',[S('coat',(0,-0.18,0.1),(0.03,0.04,0.026)),S('nose',(0,-0.22,0.098),(0.006,0.005,0.005)),S('eye',(0.015,-0.2,0.11),(0.005,0.005,0.005)),S('eye',(-0.015,-0.2,0.11),(0.005,0.005,0.005)),
  S('coat',(0.02,-0.16,0.122),(0.01,0.006,0.01)),S('coat',(-0.02,-0.16,0.122),(0.01,0.006,0.01))],(0,-0.14,0.095))
part('A_weasel_tail',[C('coat',(0,0.14,0.09),(0,0.28,0.12),0.014,0.006)],(0,0.14,0.09))
legs4('A_weasel',-0.09,0.1,0.025,0.07,0.07,0.01,'coat','coat',True)
# ---------------------------------------------------------------- cerdo
part('A_pig_body',[S('coat',(0,0,0.43),(0.22,0.42,0.22)),S('coat',(0,-0.3,0.45),(0.18,0.16,0.19))])
part('A_pig_head',[S('coat',(0,-0.5,0.44),(0.13,0.15,0.13)),C('snout',(0,-0.6,0.42),(0,-0.68,0.41),0.06,0.055,10),S('nose',(0.02,-0.685,0.41),(0.01,0.004,0.012)),S('nose',(-0.02,-0.685,0.41),(0.01,0.004,0.012)),
  S('eye',(0.06,-0.6,0.49),(0.012,0.012,0.012)),S('eye',(-0.06,-0.6,0.49),(0.012,0.012,0.012)),
  S('coat',(0.09,-0.48,0.55),(0.05,0.02,0.07),(0.7,0,0.5)),S('coat',(-0.09,-0.48,0.55),(0.05,0.02,0.07),(0.7,0,-0.5))],(0,-0.38,0.45))
part('A_pig_tail',[C('coat',(0,0.42,0.48),(0,0.48,0.52),0.012,0.01),C('coat',(0,0.48,0.52),(0.03,0.5,0.48),0.01,0.008)],(0,0.42,0.48))
legs4('A_pig',-0.26,0.28,0.12,0.26,0.25,0.045,'coat','hoof')
# ---------------------------------------------------------------- cabra (con cuernos y barba)
part('A_goat_body',[S('coat',(0,0,0.63),(0.15,0.36,0.17)),S('coat',(0,-0.24,0.66),(0.15,0.15,0.18)),C('coat',(0,-0.3,0.72),(0,-0.4,0.86),0.07,0.055)])
part('A_goat_head',[S('coat',(0,-0.47,0.9),(0.06,0.11,0.065),(0.35,0,0)),S('nose',(0,-0.57,0.86),(0.02,0.015,0.015)),S('eye',(0.045,-0.46,0.93),(0.01,0.01,0.01)),S('eye',(-0.045,-0.46,0.93),(0.01,0.01,0.01)),
  C('horn',(0.03,-0.42,0.96),(0.06,-0.32,1.1),0.022,0.006),C('horn',(-0.03,-0.42,0.96),(-0.06,-0.32,1.1),0.022,0.006),C('coat',(0,-0.52,0.83),(0,-0.53,0.72),0.022,0.004),
  S('coat',(0.07,-0.43,0.92),(0.05,0.015,0.02),(0,0,0.3)),S('coat',(-0.07,-0.43,0.92),(0.05,0.015,0.02),(0,0,-0.3))],(0,-0.4,0.86))
part('A_goat_tail',[C('coat',(0,0.34,0.72),(0,0.38,0.82),0.025,0.01)],(0,0.34,0.72))
legs4('A_goat',-0.23,0.27,0.08,0.52,0.5,0.028,'coat','hoof')
# ---------------------------------------------------------------- gallo y gallina
def bird(p,s,feather,tailN,comb,tall):
    part(p+'_body',[S(feather,(0,0,0.36*s),(0.12*s,0.17*s,0.13*s)),S(feather,(0,-0.1*s,0.42*s),(0.09*s,0.09*s,0.1*s)),S('wing',(0.1*s,0.02*s,0.38*s),(0.03*s,0.13*s,0.08*s)),S('wing',(-0.1*s,0.02*s,0.38*s),(0.03*s,0.13*s,0.08*s))])
    hp=(0,-0.12*s,0.5*s);pcs=[C(feather,hp,(0,-0.16*s,0.6*s),0.05*s,0.04*s),S(feather,(0,-0.17*s,0.63*s),(0.045*s,0.05*s,0.05*s)),C('beak',(0,-0.21*s,0.63*s),(0,-0.25*s,0.62*s),0.014*s,0.002*s,6),
        S('eye',(0.03*s,-0.19*s,0.645*s),(0.008*s,0.008*s,0.008*s)),S('eye',(-0.03*s,-0.19*s,0.645*s),(0.008*s,0.008*s,0.008*s)),S('comb',(0,-0.205*s,0.585*s),(0.01*s,0.012*s,0.02*s*comb))]
    for k in range(4 if comb>1 else 2):pcs.append(S('comb',(0,(-0.2+0.025*k)*s,(0.675+0.01*comb)*s),(0.008*s,0.014*s,0.02*s*comb)))
    part(p+'_head',pcs,hp)
    tp=(0,0.14*s,0.42*s);pcs=[]
    for k in range(tailN):a=-0.5+k/(max(1,tailN-1))*1.0;pcs.append(S('tail',(0,(0.2+0.04*abs(a))*s,(0.48+tall*0.12)*s),(0.012*s,0.06*s,(0.1+tall*0.1)*s),(-0.6-0.5*a*tall,0,0)))
    part(p+'_tail',pcs,tp)
    legs2(p,0.045*s,0.27*s,0.26*s,0.012*s)
bird('A_rooster',1.0,'feather',7,2.2,1.0)
bird('A_hen',0.85,'feather',4,0.8,0.15)
# ---------------------------------------------------------------- ganso
part('A_goose_body',[S('feather',(0,0.02,0.4),(0.14,0.27,0.13)),S('feather',(0,0.24,0.43),(0.08,0.08,0.06)),S('feather',(0.11,0.05,0.42),(0.04,0.18,0.07)),S('feather',(-0.11,0.05,0.42),(0.04,0.18,0.07))])
hp=(0,-0.2,0.45);part('A_goose_head',[C('feather',hp,(0,-0.25,0.65),0.045,0.03),C('feather',(0,-0.25,0.65),(0,-0.27,0.78),0.03,0.03),S('feather',(0,-0.29,0.8),(0.04,0.055,0.04)),
  C('beak',(0,-0.33,0.795),(0,-0.4,0.78),0.022,0.01),S('beak',(0,-0.335,0.82),(0.012,0.012,0.012)),S('eye',(0.03,-0.3,0.815),(0.007,0.007,0.007)),S('eye',(-0.03,-0.3,0.815),(0.007,0.007,0.007))],hp)
part('A_goose_tail',[S('feather',(0,0.3,0.46),(0.05,0.05,0.03),(0.4,0,0))],(0,0.27,0.44))
legs2('A_goose',0.06,0.29,0.28,0.014)
# ---------------------------------------------------------------- lechuza (el ave de Atenea)
part('A_owl_body',[S('feather',(0,0,0.16),(0.08,0.07,0.12)),S('belly',(0,-0.04,0.15),(0.06,0.04,0.09)),S('wing',(0.07,0.01,0.16),(0.025,0.06,0.1)),S('wing',(-0.07,0.01,0.16),(0.025,0.06,0.1))])
hp=(0,0,0.25);part('A_owl_head',[S('feather',(0,0,0.31),(0.07,0.065,0.06)),S('face',(0,-0.05,0.31),(0.055,0.02,0.045)),S('eyey',(0.022,-0.068,0.318),(0.015,0.008,0.015)),S('eyey',(-0.022,-0.068,0.318),(0.015,0.008,0.015)),
  S('eye',(0.022,-0.075,0.318),(0.007,0.004,0.007)),S('eye',(-0.022,-0.075,0.318),(0.007,0.004,0.007)),C('beak',(0,-0.06,0.3),(0,-0.075,0.288),0.008,0.001,5),
  C('feather',(0.04,0,0.355),(0.05,0,0.385),0.012,0.002,5),C('feather',(-0.04,0,0.355),(-0.05,0,0.385),0.012,0.002,5)],hp)
legs2('A_owl',0.025,0.05,0.05,0.008,'beak')
# ---------------------------------------------------------------- codorniz (para las peleas de codornices)
part('A_quail_body',[S('feather',(0,0,0.075),(0.055,0.075,0.055)),S('wing',(0.045,0.01,0.08),(0.015,0.05,0.035)),S('wing',(-0.045,0.01,0.08),(0.015,0.05,0.035))])
hp=(0,-0.06,0.1);part('A_quail_head',[S('feather',(0,-0.075,0.115),(0.03,0.032,0.03)),C('beak',(0,-0.1,0.115),(0,-0.115,0.11),0.008,0.001,5),S('belly',(0,-0.085,0.12),(0.031,0.02,0.006)),S('eye',(0.02,-0.088,0.12),(0.004,0.004,0.004)),S('eye',(-0.02,-0.088,0.12),(0.004,0.004,0.004))],hp)
legs2('A_quail',0.02,0.035,0.035,0.004)
# ---------------------------------------------------------------- pavo real: cola cerrada (train) y abierta (fan)
part('A_peacock_body',[S('peacock',(0,0,0.58),(0.1,0.19,0.12)),S('wing',(0.08,0.04,0.58),(0.03,0.14,0.08)),S('wing',(-0.08,0.04,0.58),(0.03,0.14,0.08))])
hp=(0,-0.14,0.65);part('A_peacock_head',[C('peacock',hp,(0,-0.2,0.88),0.045,0.025),S('peacock',(0,-0.21,0.92),(0.03,0.04,0.03)),C('beak',(0,-0.24,0.92),(0,-0.27,0.915),0.01,0.002,5),
  S('face',(0.02,-0.225,0.925),(0.006,0.012,0.006)),S('face',(-0.02,-0.225,0.925),(0.006,0.012,0.006))]+[C('peacock',(0,-0.2+0.01*k,0.95),(0.012*(k-1),-0.21+0.012*k,1.02),0.003,0.003,4) for k in range(3)]+[S('peacock',(0.012*(k-1),-0.21+0.012*k,1.03),(0.01,0.01,0.01)) for k in range(3)],hp)
part('A_peacock_train',[S('train',(0,0.55,0.32),(0.13,0.55,0.035),(-0.42,0,0))]+[S('eyespot',(0.06*((k%3)-1),0.4+0.12*(k//3),0.38-0.05*(k//3)),(0.03,0.03,0.012),(-0.42,0,0)) for k in range(12)],(0,0.15,0.55))
fan=[];N=34
for k in range(N):
    a=-1.35+k/(N-1)*2.7;L=0.95;x=math.sin(a)*L*0.55;z=0.55+math.cos(a)*L*0.55
    fan.append(C('train',(0,0.16,0.6),(x*1.7,0.22,z+0.25*math.cos(a)),0.012,0.012,4))
    fan.append(S('train',(x*1.72,0.225,z+0.26*math.cos(a)),(0.07,0.01,0.1),(0,a,0)))
    fan.append(S('eyespot',(x*1.74,0.215,z+0.27*math.cos(a)),(0.03,0.012,0.035),(0,a,0)))
part('A_peacock_fan',fan,(0,0.16,0.6))
legs2('A_peacock',0.04,0.47,0.46,0.012,'beak')
# ---------------------------------------------------------------- mono (macaco), sentado: el capricho de los presumidos de Teofrasto
part('A_monkey_body',[S('coat',(0,0,0.2),(0.09,0.08,0.12)),S('coat',(0.06,-0.06,0.07),(0.045,0.08,0.045)),S('coat',(-0.06,-0.06,0.07),(0.045,0.08,0.045)),
  C('coat',(0.08,0,0.27),(0.07,-0.08,0.1),0.022,0.018),C('coat',(-0.08,0,0.27),(-0.07,-0.08,0.1),0.022,0.018),S('face',(0.07,-0.09,0.09),(0.02,0.025,0.012)),S('face',(-0.07,-0.09,0.09),(0.02,0.025,0.012))])
hp=(0,-0.01,0.3);part('A_monkey_head',[S('coat',(0,-0.01,0.36),(0.065,0.06,0.06)),S('face',(0,-0.055,0.35),(0.045,0.025,0.04)),S('eye',(0.018,-0.075,0.365),(0.007,0.005,0.007)),S('eye',(-0.018,-0.075,0.365),(0.007,0.005,0.007)),
  S('face',(0.065,-0.01,0.37),(0.012,0.008,0.016)),S('face',(-0.065,-0.01,0.37),(0.012,0.008,0.016))],hp)
# ---------------------------------------------------------------- culebra doméstica, enroscada (protectora de la casa)
pcs=[]
for k in range(60):
    t=k/59;a=t*TWO if False else t*4.6*math.pi;r=0.16-0.1*t;pcs.append(S('snake',(math.cos(a)*r,math.sin(a)*r,0.025+t*0.03),(0.024-0.008*t,0.024-0.008*t,0.022-0.006*t),u=8,v=6))
part('A_snake_body',pcs)
hp=(0.06,0,0.06);part('A_snake_head',[C('snake',(0.06,0,0.06),(0.06,-0.02,0.2),0.018,0.016),S('snake',(0.06,-0.04,0.215),(0.022,0.032,0.016)),S('eye',(0.074,-0.05,0.222),(0.004,0.004,0.004)),S('eye',(0.046,-0.05,0.222),(0.004,0.004,0.004))],hp)
# ---------------------------------------------------------------- loro (en las casas ricas de Roma), posado
part('A_parrot_body',[S('parrot',(0,0,0.11),(0.045,0.045,0.08)),C('tail',(0,0.02,0.05),(0,0.05,-0.08),0.025,0.008)])
hp=(0,0,0.18);part('A_parrot_head',[S('parrot',(0,-0.01,0.2),(0.04,0.04,0.038)),S('comb',(0,-0.035,0.19),(0.02,0.012,0.02)),C('beak',(0,-0.045,0.205),(0,-0.065,0.185),0.014,0.004,6),S('eye',(0.028,-0.025,0.21),(0.006,0.006,0.006)),S('eye',(-0.028,-0.025,0.21),(0.006,0.006,0.006))],hp)
bpy.ops.wm.save_as_mainfile(filepath=OUT+'animales.blend')
for o in bpy.data.objects:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT+'animales.glb',export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_texcoords=False,export_normals=True)
print('OBJETOS',len(bpy.data.objects),'VERTS',sum(len(o.data.vertices) for o in bpy.data.objects))
