# Encargos de diseño para Estrella del Balón

Esta carpeta reúne los encargos para pedir a herramientas de diseño o de imagen (generadores de imágenes, ilustradores, editores vectoriales) los gráficos que el juego hoy dibuja con SVG sencillos: jugadores, botas, guantes, equipaciones, escudos ficticios, iconos y fondos.

## Cómo usarla

1. Lee `guia-de-estilo.md`: paleta, estilo, formatos y reglas comunes. Pégala siempre **antes** de cada encargo para que todo salga coherente.
2. Elige el encargo en `prompts/` y copia el bloque «Prompt». Cada archivo indica tamaño, formato, fondo y nombres de archivo.
3. Guarda lo que obtengas en `entregas/<tipo>/` con los nombres que pide `inventario.json`.
4. Cuando haya entregas, el juego podrá usarlas en lugar de los dibujos actuales: avísame y hago el cambio (se cargan por nombre de archivo, como los escudos reales).

## Encargos

| Archivo | Qué pide |
| --- | --- |
| `prompts/01-retratos-por-capas.md` | Retrato del jugador por capas (cara, ojos, cejas, pelo, barba, camiseta) para combinarlas como en el editor |
| `prompts/02-cuerpo-entero.md` | Figura de cuerpo entero por capas (camiseta dentro/fuera, mangas, medias, botas, tatuajes) |
| `prompts/03-botas-y-guantes.md` | Botas y guantes de las 6 marcas ficticias en sus gamas |
| `prompts/04-equipaciones.md` | Plantillas de camiseta para colorear por club (lisa, rayas, mitades, banda, franja) |
| `prompts/05-escudos-ficticios.md` | Escudos de los clubes ficticios a partir de forma, colores e iniciales |
| `prompts/06-iconos-interfaz.md` | Iconos de navegación, rasgos, acciones y momentos |
| `prompts/07-fondos-e-ilustraciones.md` | Fondos de pantalla, estadio, momentos estrella y logotipo |

## Reglas importantes

- **Todo ficticio.** Nada de logotipos, escudos, marcas o caras reales (ni Nike, Adidas, Puma… ni clubes reales). Las marcas del juego (Tribanda, Arco, Felino, Kaizen, Nordika, Leona…) son inventadas: el diseño no debe imitar los logotipos reales en los que se inspiran.
- **Nada de parecidos con futbolistas reales.** Los retratos son genéricos y combinables.
- **Uso:** juego no comercial, para pruebas y uso particular. Revisa las condiciones de la herramienta que uses sobre los derechos de lo que genera.
