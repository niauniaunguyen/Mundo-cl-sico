#!/bin/bash
# Comprime con gltfpack (meshopt, posiciones en coma flotante para no cambiar las coordenadas) los modelos que el juego lee con
# GLTFLoader + MeshoptDecoder (000b): figuras en una malla, casas detalladas y criaturas. Deja las copias en modelos/cc/;
# construir.py usa la copia si existe. Uso: GLTFPACK=/ruta/gltfpack bash herramientas/comprimir_modelos.sh   (npm: gltfpack@0.21.0)
cd "$(dirname "$0")/.."; G=${GLTFPACK:-gltfpack}; mkdir -p modelos/cc
for f in modelos/personaje_*_uno.glb modelos/personaje_*_uno_baja.glb modelos/edificios.glb modelos/criaturas.glb modelos/criaturas2.glb modelos/criaturas3.glb; do
  [ -f "$f" ] || continue; o=modelos/cc/$(basename "$f"); [ "$o" -nt "$f" ] && continue
  "$G" -i "$f" -o "$o" -cc -kn -km -vpf >/dev/null 2>&1 && echo "$(basename "$f"): $(($(stat -c%s "$f")/1024)) → $(($(stat -c%s "$o")/1024)) KB" || echo "falló $f"
done
