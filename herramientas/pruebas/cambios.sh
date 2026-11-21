#!/usr/bin/env bash
# Pruebas que solo miran lo que ha cambiado: compara con un commit (por defecto, el anterior) y lanza solo las pruebas
# del navegador que tocan esos archivos. Las rápidas (sin navegador) se pasan siempre.
#   bash herramientas/pruebas/cambios.sh            → cambios del último commit y los que aún no están guardados
#   bash herramientas/pruebas/cambios.sh main~5     → cambios desde ese commit
#   bash herramientas/pruebas/cambios.sh HEAD~1 --ver   → solo dice qué lanzaría, sin lanzarlo
# Requisitos del navegador: los mismos que todo.sh (Chromium + Playwright).
cd "$(dirname "$0")/../.." || exit 1
base="${1:-HEAD~1}"; [ "$1" = "--ver" ] && base=HEAD~1
ver=0; for a in "$@"; do [ "$a" = "--ver" ] && ver=1; done
files=$( (git diff --name-only "$base" -- ; git diff --name-only; git ls-files --others --exclude-standard) | sort -u )
[ -z "$files" ] && { echo "No hay cambios desde $base."; exit 0; }
echo "Archivos cambiados desde $base:"; echo "$files" | sed 's/^/  · /'
node herramientas/pruebas/comprobar.js || exit 1
# qué pruebas tocan qué: por número o nombre del archivo de fuente/codigo y por carpeta
want=""
add(){ case " $want " in *" $1 "*) ;; *) want="$want $1";; esac; }
for f in $files; do
  b=$(basename "$f")
  case "$f" in
    fuente/codigo/*)
      n=${b%%_*}
      case "$b" in
        *terreno*|*relieve*|*campo*|*rio*|*montes*|*escenarios*|*construccion*) add terreno; add huella;;
        *personaje*|*caras*|*multitudes*|*gestos*|*ropa*|*oficio*|*vida*) add humo;;
        *bucle*|*entrada*|*caballo*|*colision*|*grada*|*saltar*) add recorridos; add humo;;
        *dialogo*|*menu*|*historia*|*capitulo*|*mision*|*jugar*) add humo;;
      esac
      case "$n" in 00[0-9]|01[0-9]) add huella; add humo;; esac   # base del mundo: todo puede cambiar
      add humo;;
    modelos/*|herramientas/blender/*) add humo;;
    fuente/*.html|fuente/construir.py) add humo; add huella;;
  esac
done
echo "Pruebas del navegador que tocan:${want:- ninguna}"
[ $ver = 1 ] && exit 0
[ -z "$want" ] && exit 0
python3 fuente/construir.py >/dev/null || exit 1
curl -s -o /dev/null http://localhost:8386/ || { (setsid python3 -m http.server 8386 >/dev/null 2>&1 &); sleep 1; }
fallo=0
for t in $want; do for m in atenas roma; do
  case $t in
    humo) echo "== $m: prueba de humo"; node herramientas/pruebas/run.js "?modo=$m#debug" herramientas/pruebas/humo_$m.js | grep -v "^    at" | tail -6 || fallo=1;;
    huella) echo "== $m: huella del mundo"; node herramientas/pruebas/run.js "?modo=$m#debug" herramientas/pruebas/huella.js | grep -v "^    at" || fallo=1;;
    terreno) echo "== $m: terreno"; node herramientas/pruebas/run.js "?modo=$m#debug" herramientas/pruebas/terreno.js | grep -v "^    at" | tail -15 || fallo=1;;
    recorridos) echo "== $m: recorridos a pie"; node herramientas/pruebas/run.js "?modo=$m#debug" herramientas/pruebas/recorridos.js | grep -v "^    at" | tail -20 || fallo=1;;
  esac
done; done
exit $fallo
