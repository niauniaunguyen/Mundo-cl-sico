# Publicar Nóstos como web para el alumnado

El juego es un solo archivo, `atenas.html` (unos 10 MB), que funciona sin servidor ni instalación. Hay tres formas de ponerlo en la web.

## 1. GitHub Pages (recomendada: se actualiza sola)

El repositorio ya incluye `.github/workflows/pages.yml`, que publica el juego cada vez que se sube un cambio.

1. En GitHub, abre el repositorio → **Settings** → **Pages**.
2. En **Source**, elige **GitHub Actions**. Solo hay que hacerlo una vez.
3. Si el repositorio es privado, GitHub Pages necesita un plan de pago; con un repositorio público es gratis.
4. En **Settings → Environments → github-pages**, comprueba que la rama `main-djww2r` (o `main`) puede publicar. Por defecto, GitHub solo deja publicar desde la rama principal.
5. Cada vez que se suba un cambio, la web se actualiza en unos minutos en `https://<usuario>.github.io/<repositorio>/`.

## 2. Netlify o Cloudflare Pages (arrastrar y soltar)

1. Crea una carpeta con dos archivos: `atenas.html` renombrado a `index.html`, y `version.json`.
2. En Netlify («Add new site → Deploy manually») o en Cloudflare Pages («Upload assets»), arrastra la carpeta.
3. Para actualizar, vuelve a arrastrar la carpeta con los archivos nuevos.

## 3. Sin web: el archivo

`atenas.html` se puede copiar a un pendrive, al aula virtual (Moodle, Classroom) o al escritorio de los ordenadores del aula y abrirse con doble clic. El progreso se guarda en el navegador de cada ordenador.

## Aviso de versión nueva

`construir.py` escribe en `atenas.html` y en `version.json` una huella del contenido. Cuando el juego se sirve desde una web (GitHub Pages, Netlify…), comprueba cada diez minutos si hay una versión nueva y, si la hay, muestra un aviso con un botón para recargar. La partida se guarda antes de recargar.

## Privacidad

El juego no envía datos de los alumnos a ningún servidor. El progreso se guarda en el navegador de cada ordenador (localStorage). El modo Libre en línea usa la sala compartida de Claude, así que solo funciona abriendo el juego dentro de Claude; allí comparte con los demás jugadores de la partida el nombre elegido, la posición y los mensajes de chat. En GitHub Pages, Netlify o el archivo suelto, el modo en línea no está disponible y el resto del juego funciona igual.
