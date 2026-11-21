# Compacta un GLB de personaje para incrustarlo en el juego (sin Blender, solo Python + numpy):
#  · pesos del esqueleto (WEIGHTS_0): de 4 decimales de 32 bits a 4 bytes normalizados (permitido por glTF 2.0);
#  · normales (NORMAL): de 3 decimales a 3 bytes con signo normalizados (+1 de relleno), con la extensión KHR_mesh_quantization,
#    que el GLTFLoader de three r128 admite;
#  · coordenadas de textura (TEXCOORD_0) entre 0 y 1: a 2 enteros de 16 bits normalizados (misma extensión).
# Uso: python3 herramientas/blender/compactar_glb.py entrada.glb salida.glb
import json, struct, sys
import numpy as np
F32, U8, I8 = 5126, 5121, 5120
def read(path):
    b = open(path, 'rb').read(); n = struct.unpack('<I', b[12:16])[0]
    j = json.loads(b[20:20 + n]); off = 20 + n; bl = struct.unpack('<I', b[off:off + 4])[0]
    return j, b[off + 8:off + 8 + bl]
def acc_array(j, bin_, i):
    a = j['accessors'][i]; bv = j['bufferViews'][a['bufferView']]
    comp = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}[a['type']]
    dt = {5126: np.float32, 5125: np.uint32, 5123: np.uint16, 5121: np.uint8, 5122: np.int16, 5120: np.int8}[a['componentType']]
    st = bv.get('byteStride'); start = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    if st and st != comp * np.dtype(dt).itemsize:
        raw = np.frombuffer(bin_, dtype=np.uint8, count=st * a['count'], offset=start).reshape(a['count'], st)
        return raw[:, :comp * np.dtype(dt).itemsize].copy().view(dt).reshape(a['count'], comp)
    return np.frombuffer(bin_, dtype=dt, count=a['count'] * comp, offset=start).reshape(a['count'], comp).copy()
def main(src, dst):
    j, bin_ = read(src)
    roles = {}
    for m in j['meshes']:
        for p in m['primitives']:
            for k, v in p['attributes'].items(): roles[v] = k
    new_views, out = [], bytearray()
    def push(data, target=None, stride=None):
        while len(out) % 4: out.append(0)
        v = {'buffer': 0, 'byteOffset': len(out), 'byteLength': len(data)}
        if target: v['target'] = target
        if stride: v['byteStride'] = stride
        out.extend(data); new_views.append(v); return len(new_views) - 1
    for i, a in enumerate(j['accessors']):
        if 'bufferView' not in a: continue
        role = roles.get(i); arr = acc_array(j, bin_, i)
        bv = j['bufferViews'][a['bufferView']]; tgt = bv.get('target')
        if role == 'WEIGHTS_0' and a['componentType'] == F32:
            w = arr / np.maximum(arr.sum(1, keepdims=True), 1e-8)
            q = np.round(w * 255).astype(np.int32)
            q[np.arange(len(q)), q.argmax(1)] += 255 - q.sum(1)   # que sumen exactamente 255
            a.update(componentType=U8, normalized=True); a.pop('min', None); a.pop('max', None)
            a['bufferView'] = push(q.clip(0, 255).astype(np.uint8).tobytes(), tgt); a.pop('byteOffset', None)
        elif role == 'NORMAL' and a['componentType'] == F32:
            n = arr / np.maximum(np.linalg.norm(arr, axis=1, keepdims=True), 1e-8)
            q = np.zeros((len(n), 4), np.int8); q[:, :3] = np.round(n * 127).clip(-127, 127)
            a.update(componentType=I8, normalized=True); a.pop('min', None); a.pop('max', None)
            a['bufferView'] = push(q.tobytes(), tgt, 4); a.pop('byteOffset', None)
        elif role == 'TEXCOORD_0' and a['componentType'] == F32 and arr.min() >= -1e-4 and arr.max() <= 1 + 1e-4:
            q = np.round(arr.clip(0, 1) * 65535).astype(np.uint16)
            a.update(componentType=5123, normalized=True); a.pop('min', None); a.pop('max', None)
            a['bufferView'] = push(q.tobytes(), tgt); a.pop('byteOffset', None)
        else:
            raw = arr.tobytes(); a['bufferView'] = push(raw, tgt); a.pop('byteOffset', None)
    # imágenes y otras vistas que no son de accesores
    used = {a['bufferView'] for a in j['accessors'] if 'bufferView' in a}
    for im in j.get('images', []):
        if 'bufferView' in im:
            bv = j['bufferViews'][im['bufferView']]; o = bv.get('byteOffset', 0)
            im['bufferView'] = push(bin_[o:o + bv['byteLength']])
    j['bufferViews'] = new_views
    while len(out) % 4: out.append(0)
    j['buffers'] = [{'byteLength': len(out)}]
    for k in ('extensionsUsed', 'extensionsRequired'):
        j[k] = sorted(set(j.get(k, [])) | {'KHR_mesh_quantization'})
    js = json.dumps(j, separators=(',', ':')).encode()
    while len(js) % 4: js += b' '
    glb = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(out)) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(out), 0x004E4942) + bytes(out)
    open(dst, 'wb').write(glb)
    print(src, len(read(src)[1]), '->', dst, len(out))
if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
