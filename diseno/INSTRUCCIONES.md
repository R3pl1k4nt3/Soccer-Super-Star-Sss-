# Cómo conseguir y subir los gráficos nuevos

El juego tiene dos versiones de gráficos y se elige en el **menú de partidas** o en **Carrera → Trayectoria → Gráficos**:

- **Clásicos:** los dibujos actuales, generados por el propio juego.
- **Mejorados:** usa los archivos que pongas en `diseno/entregas/`. Si falta alguna pieza, ese elemento sigue con el dibujo clásico, así que puedes ir subiéndolos poco a poco.

## Pasos

1. Abre la herramienta de imágenes que vayas a usar (ChatGPT, Gemini, Midjourney, Adobe Firefly, un ilustrador…).
2. Pega primero **todo** el texto de `diseno/guia-de-estilo.md`.
3. Pega el bloque **Prompt** del encargo (archivos en `diseno/prompts/`). Donde ponga `{MARCA}`, `{TIPO}`, etc., sustitúyelo por el valor que toque (están en las tablas de abajo y en `diseno/inventario.json`).
4. Guarda cada imagen en la carpeta indicada con el **nombre exacto** (minúsculas, sin acentos, con guiones).
5. Desde la carpeta del juego, ejecuta:

```powershell
powershell -ExecutionPolicy Bypass -File tools\registrar-graficos.ps1
```

6. Abre el juego y elige **Gráficos → Mejorados**.

Para que salga también en la web, haz commit y súbelo a GitHub (o pídemelo).

## Qué va en cada carpeta

Todas las carpetas están dentro de `diseno/entregas/`.

### `retrato/` · encargo `prompts/01-retratos-por-capas.md`
**Formato:** SVG, lienzo `viewBox="0 0 200 220"`, fondo transparente, con los colores de referencia (piel `#d29a6e`, pelo `#4a2e1c`, iris `#3d7cc9`, camiseta `#1565c0` y `#ffffff`).
El retrato mejorado solo se usa cuando están **todas** las piezas que necesita el aspecto del jugador.

| Archivos | Cuántos |
| --- | --- |
| `cara-ovalada.svg`, `cara-redonda.svg`, `cara-cuadrada.svg`, `cara-alargada.svg` | 4 |
| `cuello.svg`, `nariz-boca.svg`, `camiseta-cuello-v.svg`, `cinta.svg`, `tatuaje-cuello.svg` | 5 |
| `ojos-normales.svg`, `ojos-rasgados.svg`, `ojos-grandes.svg`, `ojos-entornados.svg` | 4 |
| `cejas-finas.svg`, `cejas-gruesas.svg`, `cejas-arqueadas.svg` | 3 |
| `barba-perilla.svg`, `barba-corta.svg`, `barba-poblada.svg`, `barba-bigote.svg` | 4 |
| `pelo-rapado.svg`, `pelo-corto.svg`, `pelo-degradado.svg`, `pelo-tupe.svg`, `pelo-rizos.svg`, `pelo-afro.svg`, `pelo-melena.svg`, `pelo-coleta.svg`, `pelo-mono.svg`, `pelo-rastas.svg` | 10 |
| `pelo-atras-melena.svg`, `pelo-atras-afro.svg`, `pelo-atras-rastas.svg`, `pelo-atras-coleta.svg`, `pelo-atras-mono.svg` | 5 |

Mínimo para empezar: las 9 piezas de un aspecto concreto (por ejemplo `cara-ovalada`, `cuello`, `ojos-normales`, `cejas-finas`, `nariz-boca`, `camiseta-cuello-v` y `pelo-corto`).

### `cuerpo/` · encargo `prompts/02-cuerpo-entero.md`
**Formato:** SVG, lienzo `viewBox="0 0 200 520"`, pies en y = 505, sin cabeza (se pone la del retrato).

| Archivos | Cuántos |
| --- | --- |
| `cuerpo-delgado.svg`, `cuerpo-normal.svg`, `cuerpo-fuerte.svg` | 3 |
| `pantalon-delgado.svg`, `pantalon-normal.svg`, `pantalon-fuerte.svg` | 3 |
| `camiseta-{fuera\|dentro}-manga-{corta\|larga}-{delgado\|normal\|fuerte}.svg` (por ejemplo `camiseta-fuera-manga-corta-normal.svg`) | 12 |
| `medias-altas.svg`, `medias-normales.svg`, `medias-bajadas.svg` | 3 |
| `munequera.svg` | 1 |
| `tatuaje-brazo-izq.svg`, `tatuaje-brazo-der.svg`, `tatuaje-antebrazo-izq.svg`, `tatuaje-antebrazo-der.svg`, `tatuaje-pierna.svg`, `tatuaje-mano.svg` | 6 |

### `material/` · encargo `prompts/03-botas-y-guantes.md`
**Formato:** PNG transparente (512×256 las botas, 512×512 los guantes) o SVG. Aparecen como imagen en la tienda (Jugador → Material).
La lista completa de los 116 nombres está en `diseno/inventario.json` (campo `material`, columna `archivo`). Ejemplos: `bota-arco-velocidad-elite.png`, `bota-leona-agarre-basica.png`, `guantes-felino-reflejos-pro.png`, `ropa-tribanda-ropa-de-compresion-elite.png`.

### `escudos/` · encargo `prompts/05-escudos-ficticios.md`
**Opción A (la que está subida):** piezas `forma-*.svg`, `division-*.svg` y `emblema-*.svg`. El juego compone el escudo de cada club eligiendo forma, división y emblema a partir de su nombre y lo colorea con sus colores (`#ff00ff` → principal, `#00ffff` → secundario).

**Opción B (opcional, tiene prioridad):** un escudo completo por club.
**Formato:** SVG cuadrado o PNG transparente. Solo para la **versión ficticia** (la real usa los escudos descargados).
Nombre: `club-` + nombre del club en minúsculas, sin acentos y con guiones. La lista de los 204 clubes de primera división e invitados, con sus colores e iniciales, está en `diseno/inventario.json` (campo `escudos`). Ejemplos: `club-chamartin-cf.svg`, `club-merseyside-reds.svg`.

### `iconos/` · encargo `prompts/06-iconos-interfaz.md`
**Formato:** SVG 24×24 con `stroke="currentColor"`.
Ahora el juego usa los de navegación: `nav-inicio.svg`, `nav-partido.svg`, `nav-jugador.svg`, `nav-carrera.svg`, `nav-vida.svg`. El resto de iconos del encargo (rasgos, acciones, momentos) quedan preparados para más adelante con el nombre `<grupo>-<nombre>.svg`.

### `fondos/` · encargo `prompts/07-fondos-e-ilustraciones.md`
**Formato:** JPG o WEBP.
`fondo-escritorio.jpg` (1920×1080) y `fondo-movil.jpg` (1080×1920). Se ven oscurecidos detrás de la interfaz.

### `logo/` · encargo `prompts/07-fondos-e-ilustraciones.md`
**Formato:** SVG o PNG transparente.
`logo-icono.svg` (sustituye a la estrella del menú lateral) y `logo-horizontal.svg` (preparado para más adelante).

### `equipacion/` · encargo `prompts/04-equipaciones.md`
Preparada para más adelante: `lisa.svg`, `rayas-verticales.svg`, `rayas-horizontales.svg`, `mitades.svg`, `banda-diagonal.svg`, `franja-pecho.svg`, `cuello-contraste.svg`, `mangas-contraste.svg`.

## Lo que falta

Las 8 prendas de ropa (compresión y potencia): encargo `prompts/08-lo-que-falta.md`. Mientras no estén, en la tienda aparecen sin imagen.

Los .zip y los visores .html que traen las herramientas se pueden dejar en las carpetas: el juego no los usa y no se suben a GitHub.

## Orden recomendado

1. **Retrato** (es lo que más se ve: Inicio, menú, tarjetas).
2. **Escudos** de primera división.
3. **Iconos** de navegación, **fondo** y **logotipo**.
4. **Cuerpo entero** y **material**.
