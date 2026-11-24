# 02 · Figura de cuerpo entero por capas

**Para qué:** sustituir la figura de cuerpo entero del editor de aspecto y de Carrera (camiseta por dentro o por fuera, medias, botas, tatuajes).

**Lienzo:** SVG `viewBox="0 0 200 520"` (o PNG 400 × 1040 px), de pie, vista frontal, pies en y = 505. Proporción de unas 7,5 cabezas. La cabeza se pone encima con las capas del encargo 01 (deja el cuello en x = 89-111, y = 140-175).

**Capas:**

| Capa | Variantes | Color de referencia |
| --- | --- | --- |
| Cuerpo (piel) | `cuerpo-delgado`, `cuerpo-normal`, `cuerpo-fuerte` | piel `#d29a6e` |
| Camiseta | `camiseta-{fuera|dentro}-manga-{corta|larga}-{delgado|normal|fuerte}` (12 archivos, por ejemplo `camiseta-fuera-manga-corta-normal`) | `#1565c0` / `#ffffff` |
| Pantalón | `pantalon-delgado`, `pantalon-normal`, `pantalon-fuerte` | `#ffffff` |
| Medias | `medias-altas` (por encima de la rodilla), `medias-normales`, `medias-bajadas` (se ven las espinilleras) | `#ffffff` con franja `#1565c0` |
| Botas | se toman del encargo 03 | — |
| Muñequera | `munequera` | `#ffffff` |
| Tatuajes | `tatuaje-brazo-izq`, `tatuaje-brazo-der`, `tatuaje-antebrazo-izq`, `tatuaje-antebrazo-der`, `tatuaje-pierna`, `tatuaje-mano` | tinta `#18203a` |

**Prompt**

> Crea un set vectorial por capas de un futbolista genérico de cuerpo entero, de pie, vista frontal, brazos ligeramente separados, estilo ilustración plana con volumen suave para un videojuego de carrera de fútbol. Lienzo 200×520 unidades, fondo transparente, pies apoyados en y=505; todas las capas alineadas para apilarse sin moverlas. Sin cabeza (se añade aparte; deja el cuello visible). Capas: cuerpo en tres complexiones (delgada, normal, fuerte); camiseta de fútbol por fuera o metida en el pantalón, con manga corta o larga; pantalón corto; medias por encima de la rodilla, normales o bajadas mostrando la espinillera; muñequera; tatuajes en brazo entero, antebrazo, pierna y mano, como capas de tinta oscura que se ven solo sobre la piel. Colores planos de referencia: piel #d29a6e, camiseta #1565c0 con detalles #ffffff, pantalón #ffffff, medias #ffffff con franja #1565c0, tinta #18203a. Sin logotipos ni texto ni dorsal (el número lo pone el juego). Entrega en SVG, un archivo por capa.

**Entrega:** `entregas/cuerpo/<nombre>.svg`
