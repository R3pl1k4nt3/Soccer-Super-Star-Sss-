# 05 · Escudos de clubes ficticios

**Para qué:** mejorar los escudos generados (versión ficticia y clubes sin escudo real). El juego hoy combina forma, colores, franjas e iniciales (`js/escudos.js`).

**Opción A, plantillas** (recomendada): un sistema que el juego combine solo.
- 8 formas de escudo (clásico, redondo, cuadrado redondeado, puntiagudo, almenado, ovalado, hexagonal, escudo con corona).
- 8 divisiones del campo (liso, rayas, mitades, diagonal, chevron, banda, cuarteles, borde).
- 12 emblemas centrales (balón, león, águila, torre, ancla, estrella, corona, castillo, ola, roble, lobo, barco).
- Todo con dos colores de referencia (#ff00ff y #00ffff) y un tercero dorado (#f5c542) para detalles.

**Prompt (opción A)**

> Diseña un sistema modular de escudos de fútbol ficticios en SVG, para combinarlos por capas en el mismo lienzo de 100×104: 8 formas de escudo, 8 divisiones del campo y 12 emblemas centrales (balón, león, águila, torre, ancla, estrella, corona, castillo, ola, roble, lobo, barco). Colores planos de referencia para recolorear: principal #ff00ff, secundario #00ffff y detalles #f5c542. Estilo heráldico moderno y plano, legible a 20 px, sin texto ni parecido con escudos de clubes reales. Un archivo por pieza, con grupos con nombre.

**Opción B, un escudo por club:** lista de clubes ficticios en `inventario.json` (campo `escudos`), con sus colores. Pide cada uno con:

> Diseña el escudo de un club de fútbol ficticio llamado «{NOMBRE}», de {CIUDAD}, con colores {COLOR1} y {COLOR2}. Estilo heráldico moderno y plano, legible a 20 px, SVG en lienzo 100×104 con fondo transparente. Puede incluir las iniciales «{INICIALES}». No debe parecerse al escudo de ningún club real.

**Entrega:** `entregas/escudos/<pieza>.svg` (opción A) o `entregas/escudos/club-<nombre-en-minusculas>.svg` (opción B).
