# 08 · Lo que falta (ropa de compresión y de potencia)

**Para qué:** las 8 prendas de la tienda (Jugador → Material → Ropa) que no estaban en la primera entrega. Mismo estilo que las botas y guantes del encargo 03.

**Formato:** SVG (o PNG transparente 512×512), prenda vista de frente, sin cuerpo, fondo transparente.
**Carpeta:** `diseno/entregas/material/`

| Archivo | Prenda | Marca | Gama |
| --- | --- | --- | --- |
| `ropa-leona-ropa-de-compresion-basica.svg` | Camiseta térmica de compresión | Leona | Básica |
| `ropa-leona-ropa-de-potencia-basica.svg` | Malla corta de potencia | Leona | Básica |
| `ropa-kaizen-ropa-de-compresion-media.svg` | Camiseta térmica de compresión | Kaizen | Media |
| `ropa-kaizen-ropa-de-potencia-media.svg` | Malla corta de potencia | Kaizen | Media |
| `ropa-felino-ropa-de-compresion-pro.svg` | Camiseta térmica de compresión | Felino | Pro |
| `ropa-felino-ropa-de-potencia-pro.svg` | Malla corta de potencia | Felino | Pro |
| `ropa-tribanda-ropa-de-compresion-elite.svg` | Camiseta térmica de compresión | Tribanda | Élite |
| `ropa-tribanda-ropa-de-potencia-elite.svg` | Malla corta de potencia | Tribanda | Élite |

Identidad de cada marca (igual que en el encargo 03): Leona, robusta y barata, rojo `#e53935`; Kaizen, técnica japonesa, azul `#1e88e5`; Felino, agilidad, amarillo `#ffd400`; Tribanda, élite clásica, blanco y negro.

**Prompt** (pega antes la guía de estilo y repite cambiando los valores de la tabla)

> Diseña una prenda deportiva para la marca ficticia «{MARCA}» ({IDENTIDAD}, color {COLOR}): {PRENDA} de gama «{GAMA}». Vista frontal de la prenda sola (sin cuerpo), estilo ilustración vectorial plana con volumen suave, igual que el resto del material del juego. Fondo transparente, lienzo 512×512 (o SVG con viewBox 0 0 512 512). Logotipo de la marca original, sin parecido con marcas reales. Más detalle, costuras y brillo cuanto más alta la gama (Básica sencilla, Élite muy cuidada). Sin texto.

**Después:** ejecuta `powershell -ExecutionPolicy Bypass -File tools\registrar-graficos.ps1`.
