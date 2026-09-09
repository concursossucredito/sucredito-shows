# Shows Sucrédito

Sitio simple (HTML/CSS/JS, sin build ni backend) para mostrar todos los
espectáculos con Tarjeta Sucrédito y llevar al cliente a comprar la
entrada en la boletería real.

## Estructura

```
index.html          -> la página
css/style.css        -> estilos
js/events.js          -> ACÁ se cargan los shows (editás solo este archivo para sumar/sacar eventos)
js/analytics.js        -> medición de clics (contador local + ganchos opcionales a GA4 o Google Sheets)
js/app.js               -> arma las tarjetas de show y conecta el tracking
assets/events/          -> flyers/afiches de cada show
```

## Cómo agregar un show nuevo

1. Guardá el flyer en `assets/events/` (ej: `artista-ciudad.jpg`).
2. Abrí `js/events.js` y copiá un bloque `{ ... }` del array `EVENTOS`,
   pegalo y completá los datos (fecha, lugar, cuotas, link de compra, etc.).
3. Guardá y listo — no hace falta tocar el HTML ni el CSS.

## Cómo probarlo en tu computadora

No necesita instalación. Con abrir `index.html` en el navegador ya funciona.
Si preferís levantar un servidor local (recomendado para que las imágenes
carguen sin problemas de rutas):

```bash
cd sucredito-shows
python3 -m http.server 8000
```

y entrá a `http://localhost:8000`.

## Cómo publicarlo (gratis) y subirlo a Git

**Opción recomendada: GitHub Pages**

```bash
cd sucredito-shows
git init
git add .
git commit -m "Sitio de shows Sucrédito"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/sucredito-shows.git
git push -u origin main
```

Después, en GitHub: `Settings > Pages > Deploy from a branch > main / (root)`.
En un par de minutos el sitio queda publicado en una URL tipo
`https://TU_USUARIO.github.io/sucredito-shows/`, lista para compartir por
WhatsApp o donde quieran.

(Netlify o Vercel funcionan igual de bien si prefieren arrastrar la carpeta
directamente desde su web, sin usar la terminal.)

## Cómo medir los clics en "Comprar entradas"

El sitio ya cuenta los clics localmente en el navegador de cada visitante
(sirve para probar que funciona, pero no es un panel central). Para ver
todo junto tenés dos caminos, se pueden usar los dos a la vez:

### Opción A — Google Analytics 4 (recomendada, gratis, 2 minutos)

1. Creá una propiedad en [analytics.google.com](https://analytics.google.com)
   y copiá el ID que empieza con `G-`.
2. Abrí `js/analytics.js` y pegalo acá:
   ```js
   const ANALYTICS_CONFIG = {
     GA4_MEASUREMENT_ID: "G-TU-ID-ACA",
     ...
   };
   ```
3. Listo. En GA4, en **Informes > Interacción > Eventos**, vas a ver
   `vista_pagina` (alguien entró al sitio) y `click_comprar` (alguien
   tocó comprar, con el nombre del show y la boletería incluidos).

### Opción B — Planilla de Google (igual que la encuesta)

Si ya tenés el Apps Script que usa la encuesta de Sucrédito, se puede
agregar una hoja nueva "Clics shows" y reusar ese mismo mecanismo:
1. Publicás (o reusás) un Web App de Apps Script que reciba `POST` y
   escriba una fila en la planilla.
2. Pegás esa URL en `js/analytics.js`:
   ```js
   const ANALYTICS_CONFIG = {
     ...
     WEBHOOK_URL: "https://script.google.com/macros/s/TU_ID/exec"
   };
   ```
3. Cada clic en "Comprar entradas" (y cada vista de página) va a llegar
   como una fila nueva, con el show, la boletería y la fecha.

### Ver los contadores sin configurar nada

Abriendo el sitio con `?debug=1` al final de la URL (ej:
`https://tusitio.com/?debug=1`) aparece un panel flotante con el conteo
de clics guardado en ese navegador. Útil para probar rápido que todo
esté funcionando antes de compartir el link.

## Notas de diseño

- El logo/isologo (el cuadrado rojo con las dos flechas `>>`) está hecho
  en SVG directamente en el HTML, tomado de la misma identidad que usa
  la encuesta de Sucrédito — no depende de ningún archivo de imagen.
- Cada show se muestra como una "entrada" (con costura punteada y
  muescas), no como una tarjeta genérica, para que la metáfora visual
  sea literalmente la de comprar un ticket.
- Tipografías: Archivo Black para títulos, Inter para texto — las
  mismas que ya usa la encuesta, para que ambas piezas se sientan de
  la misma marca.
