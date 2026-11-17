# Publicar Nóstos como web para el alumnado

El juego se construye en dos formas (`python3 fuente/construir.py`):

- **`atenas.html` + la carpeta `datos/`**: la página es ligera (unos 70 KB) y, al abrirse, trae de `datos/` el código y los datos (modelos, imágenes, relieve real de los destinos), unos 15 MB en total. Es la que se publica en la web y en Claude: ningún archivo pasa de 16 MB. Hay que subir siempre **las dos cosas juntas**, la página y la carpeta. Con doble clic desde el ordenador no funciona (el navegador no deja leer `datos/` sin un servidor).
- **`atenas_un_archivo.html`**: todo en un solo archivo (unos 15 MB), para usar sin conexión con doble clic o para pasarlo en un pendrive. No se guarda en el repositorio: se genera al construir (y la web de GitHub Pages lo ofrece en `/atenas_un_archivo.html`).

Hay tres formas de ponerlo en la web.

## 1. GitHub Pages (recomendada: se actualiza sola)

El repositorio ya incluye `.github/workflows/pages.yml`, que publica el juego cada vez que se sube un cambio.

1. En GitHub, abre el repositorio → **Settings** → **Pages**.
2. En **Source**, elige **GitHub Actions**. Solo hay que hacerlo una vez.
3. Si el repositorio es privado, GitHub Pages necesita un plan de pago; con un repositorio público es gratis.
4. En **Settings → Environments → github-pages**, comprueba que la rama `main-djww2r` (o `main`) puede publicar. Por defecto, GitHub solo deja publicar desde la rama principal.
5. Cada vez que se suba un cambio, la web se actualiza en unos minutos en `https://<usuario>.github.io/<repositorio>/`.

## 2. Netlify o Cloudflare Pages (arrastrar y soltar)

1. Crea una carpeta con `atenas.html` renombrado a `index.html`, la carpeta `datos/` entera y `version.json` (y, si quieres ofrecer la versión sin conexión, `atenas_un_archivo.html`).
2. En Netlify («Add new site → Deploy manually») o en Cloudflare Pages («Upload assets»), arrastra la carpeta.
3. Para actualizar, vuelve a arrastrar la carpeta con los archivos nuevos.

## 3. Sin web: el archivo

`atenas.html` se puede copiar a un pendrive, al aula virtual (Moodle, Classroom) o al escritorio de los ordenadores del aula y abrirse con doble clic. El progreso se guarda en el navegador de cada ordenador.

## Instalar el juego y usarlo sin conexión

En la web (GitHub Pages, Netlify, Cloudflare Pages…), el juego se puede **instalar** como una aplicación: en Chrome o Edge, con el botón de instalar de la barra de direcciones; en una tableta o un móvil, con «Añadir a la pantalla de inicio». Después de la primera partida con conexión, el juego guarda en el navegador la página, el código y todos los datos (unos 23 MB), y **funciona sin conexión**, útil si la wifi del centro falla. Cuando se publica una versión nueva, solo se vuelven a descargar los archivos que han cambiado.

Para Netlify o Cloudflare Pages hay que subir también, junto a `index.html`, los archivos de `fuente/pwa/` (`sw.js`, `manifest.webmanifest` y los dos iconos); `construir.py` los copia junto a `atenas.html`. GitHub Pages ya los copia solo. Dentro de Claude no se usa (la página va dentro de un marco y el navegador no lo permite).

## Aviso de versión nueva

`construir.py` escribe en `atenas.html` y en `version.json` una huella del contenido. Cuando el juego se sirve desde una web (GitHub Pages, Netlify…), comprueba cada diez minutos si hay una versión nueva y, si la hay, muestra un aviso con un botón para recargar. La partida se guarda antes de recargar.

## Privacidad

El juego no envía datos de los alumnos a ningún servidor. El progreso se guarda en el navegador de cada ordenador (localStorage). El modo Libre en línea usa la sala compartida de Claude, así que solo funciona abriendo el juego dentro de Claude; allí comparte con los demás jugadores de la partida el nombre elegido, la posición y los mensajes de chat. En GitHub Pages, Netlify o el archivo suelto, el modo en línea no está disponible y el resto del juego funciona igual.
