#!/usr/bin/env bash
# Todas las pruebas: las rápidas (sin navegador) y, con --navegador, las de humo y la huella del mundo en Atenas y en Roma.
# Requisitos de las del navegador: Chromium + Playwright y three@0.128 en herramientas/qa_visual (cd herramientas/qa_visual && npm install).
cd "$(dirname "$0")/../.." || exit 1
node herramientas/pruebas/comprobar.js || exit 1
[ "$1" = "--navegador" ] || { echo "(para las pruebas en el navegador: herramientas/pruebas/todo.sh --navegador)"; exit 0; }
curl -s -o /dev/null http://localhost:8386/ || { (setsid python3 -m http.server 8386 >/dev/null 2>&1 &); sleep 1; }
fallo=0
for m in atenas roma; do
  echo "== $m: huella del mundo";  node herramientas/pruebas/run.js "?modo=$m#debug" herramientas/pruebas/huella.js | grep -v "^    at" || fallo=1
  echo "== $m: prueba de humo";     node herramientas/pruebas/run.js "?modo=$m#debug" herramientas/pruebas/humo_$m.js | grep -v "^    at" | tail -6 || fallo=1
done
exit $fallo
