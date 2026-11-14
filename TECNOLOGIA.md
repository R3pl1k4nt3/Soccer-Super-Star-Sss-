# Tecnología

## Stack

- HTML, CSS y JavaScript sin frameworks ni dependencias, en un solo archivo (`index.html`).
- Tipografías Barlow y Barlow Condensed desde Google Fonts, con alternativa del sistema.
- Persistencia en `localStorage` (clave `estrella_balon_v3`). Si no está disponible, el juego funciona sin guardar.
- Diseñado para móvil: barra de estado arriba, pestañas abajo y vista con scroll.
- Pruebas con Node, sin librerías: `tests/simulacion.js` carga el script del HTML con un DOM simulado.

## Arquitectura

Todo el código está dentro de una función autoejecutable. Hay un único estado global `S` y una función `render()` que reconstruye la pantalla completa con plantillas de texto.

- **Eventos:** un solo listener de clic con delegación. Los botones llevan `data-a` (acción) y `data-id` o `data-n` (parámetros).
- **Flujo:** acción → modifica `S` → `save()` → `render()`.
- **Vistas:** una función por pestaña (`viewTrain`, `viewMatch`, `viewLeague`, `viewClub`, `viewLife`, `viewMoney`, `viewShop`, `viewCareer`), más ventanas modales (resumen de temporada, retirada, plantilla).
- **Versionado de guardado:** `S.v` y la clave de `localStorage` cambian cuando el formato es incompatible. La versión actual es la 3.

## Modelo de datos

| Campo | Contenido |
| --- | --- |
| `S.skills[]` | `id`, `n`, `cat`, `w` (peso), `lvl`, `prog`, `pen` (declive por edad), `base` |
| `S.tp`, `S.ts` | Rasgo principal y secundario |
| `S.clubs[]` | `str` (fuerza 26 a 88), tabla (`pts`, `pj`, `gf`, `gc`) y `ros[]` (22 jugadores) |
| `ros[]` | `n`, `p` (posición), `a` (edad), `d` (diferencia con la fuerza del club), `o` (valoración), `s` (semilla), `f` (titular), `t` (rasgo) |
| `S.fixtures` | 38 jornadas, calculadas con el método del círculo y vuelta invertida |
| `S.rel` | Entrenador, vestuario, prensa, afición y directiva (0 a 100) |
| `S.match` | Partido pendiente con decisiones sin resolver (permite recargar la página) |

Las habilidades de los rivales no se guardan. Se generan al mostrarlas con un generador pseudoaleatorio sembrado con `ros[].s`.

## Fórmulas principales

**Habilidades**
- Valor de una habilidad: `base + (nivel - 1) × 5 - declive + bonus de rasgo`.
- Valoración total: media ponderada por los pesos de la posición.
- Puntos para subir de nivel: `8 + 3 × nivel`. Nivel máximo 14, o 11 si no es de un rasgo.
- Coste de un punto: 12 000 € (habilidad clave, peso 3 o más) o 4 000 €, multiplicado por `1 + 0,25 × (nivel - 1)`.
- Promoción: cuesta tantas medallas como puntos falten.

**Partido**
- Goles: Poisson con `1,4 × exp(d / 35)` en casa y `1,1 × exp(-d / 35)` fuera, donde `d` es la diferencia de fuerza más 3.
- Ser titular: depende de tu valoración frente al mejor jugador de tu posición en el club y de la relación con el entrenador.
- Nota: base 6, ajustada por rival, resultado, goles, asistencias, paradas, decisiones, energía, relaciones y rasgos. Va de 3,5 a 10.
- Decisión: probabilidad de éxito `0,2 + habilidades / 120 - 0,1 × riesgo ± ajustes`, entre 0,08 y 0,92.
- Puntos de habilidad por partido: según nota y resultado, multiplicados por `habilidades / 8`.

**Temporada**
- Cada año cambia la fuerza de los clubes, envejecen las plantillas y se renuevan los contratos.
- Desde los 31 años las habilidades físicas pierden nivel.
- Retirada voluntaria desde los 35 y obligatoria a los 40.

## Pruebas

`node tests/simulacion.js` crea carreras en varias posiciones, entrena, toma decisiones, juega temporadas completas, abre la vista de plantilla y renderiza todas las pestañas.

Detecta errores de ejecución, no el equilibrio del juego. El equilibrio se ajusta a mano con las constantes de coste, puntos y probabilidades.

## Limitaciones

- Un solo archivo de unas 70 KB. Si el juego crece, conviene separar datos, lógica y vistas.
- El guardado vive en un solo navegador. No hay copia en la nube ni exportación.
- No hay pruebas automáticas de interfaz.
- Los nombres de jugadores se generan al azar y pueden coincidir con personas reales.
