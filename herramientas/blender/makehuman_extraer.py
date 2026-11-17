# Extrae de MakeHuman la cabeza (y el cuello) de la malla base y las deformaciones de sexo, edad y origen que usa personajes.py.
#   python3 herramientas/blender/makehuman_extraer.py RUTA/base.obj RUTA/targets.npz   → herramientas/blender/makehuman/cabeza_mh.npz
# Origen de los datos (los dos con licencia CC0, dominio público, desde septiembre de 2020; ver makehuman/LEEME.md):
#   base.obj     github.com/makehumancommunity/makehuman, makehuman/data/3dobjs/base.obj (malla base hm08)
#   targets.npz  paquete de PyPI «makehuman» 1.3.2, makehuman/data/targets.npz (deformaciones compiladas: índice + vector int16 en milésimas)
# Unidades de MakeHuman: decímetros, Y arriba, la cara hacia +Z. Se guardan tal cual; personajes.py las lleva al sistema del juego.
import sys,os,numpy as np
obj,tnpz=sys.argv[1],sys.argv[2]
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'makehuman','cabeza_mh.npz')
V=[];F=[];cur=None
for l in open(obj):
    if l.startswith('v '):V.append([float(x) for x in l.split()[1:4]])
    elif l.startswith('g '):cur=l.split()[1]
    elif l.startswith('f '):F.append((cur,[int(x.split('/')[0])-1 for x in l.split()[1:]]))
V=np.array(V)
top=V[:,1].max()
# la cabeza, el cuello y el arranque de los hombros (lo que queda por debajo lo tapa el cuerpo del juego); los globos oculares aparte
GR={'body':0,'helper-l-eye':1,'helper-r-eye':2}
fs=[(GR[g],f) for g,f in F if g in GR and min(V[k,1] for k in f)>top-3.6]
used=np.array(sorted(set(k for _,f in fs for k in f)));m=-np.ones(len(V),int);m[used]=np.arange(len(used))
quads=np.array([[m[k] for k in f] for _,f in fs if len(f)==4]);qg=np.array([g for g,f in fs if len(f)==4])
assert len(quads)==len(fs),'la malla base debería ser de cuadriláteros'
T=np.load(tnpz)
D={}
for eth in('caucasian','african','asian'):
    for sex in('male','female'):
        for age in('young','old'):
            n='targets/macrodetails/%s-%s-%s'%(eth,sex,age);i=T[n+'.index'];v=T[n+'.vector']
            d=np.zeros((len(used),3),np.int16);k=m[i]>=0;d[m[i][k]]=v[k];D['%s_%s_%s'%(eth,sex,age)]=d
# algunos rasgos sueltos, para dar variedad a cada tipo de personaje
for n in('nose/nose-hump-incr','nose/nose-width1-incr','nose/nose-scale-vert-incr','chin/chin-prominent-incr','chin/chin-width-incr',
         'mouth/mouth-scale-horiz-incr','mouth/mouth-lowerlip-volume-incr','mouth/mouth-upperlip-volume-incr','cheek/l-cheek-bones-incr','cheek/r-cheek-bones-incr',
         'eyebrows/eyebrows-trans-down','head/head-square','head/head-oval','forehead/forehead-trans-backward',
         'chin/chin-width-decr','nose/nose-scale-horiz-decr','head/head-scale-horiz-decr','mouth/mouth-scale-horiz-decr','chin/chin-prominent-decr','eyes/r-eye-scale-incr','eyes/l-eye-scale-incr'):
    key='targets/'+n
    if key+'.index' not in T:print('falta',n);continue
    i=T[key+'.index'];v=T[key+'.vector'];d=np.zeros((len(used),3),np.int16);k=m[i]>=0;d[m[i][k]]=v[k];D['r_'+n.split('/')[1].replace('-','_')]=d
os.makedirs(os.path.dirname(OUT),exist_ok=True)
np.savez_compressed(OUT,verts=V[used].astype(np.float32),quads=quads.astype(np.int32),group=qg.astype(np.int8),**D)
print('escrito',OUT,os.path.getsize(OUT)//1024,'KB',len(used),'vértices',len(quads),'caras',len(D),'deformaciones')
