# Tecnología

## Stack

- HTML, CSS y JavaScript sin frameworks ni dependencias. `index.html` carga los scripts de `js/` con etiquetas `<script>` normales, así que funciona abriendo el archivo con doble clic.
- Tipografías Barlow y Barlow Condensed desde Google Fonts, con alternativa del sistema.
- Persistencia: tres huecos de partida en IndexedDB (base `estrella_balon`, almacén `partidas`), con respaldo en `localStorage` si IndexedDB no está disponible. El índice de huecos va en `localStorage` (`estrella_balon_huecos`). Se guarda con un retardo de 250 ms para no escribir 2 MB en cada clic. Exportar e importar usa archivos JSON con la partida completa; solo se aceptan partidas de la misma versión de formato (`S.v`, ahora 5).
- Diseño adaptable (`css/estilo.css`): desde 1024 px, menú lateral y contenido en dos columnas (tres desde 1500 px); por debajo, barra superior y pestañas abajo. Botones de verdad para todo lo que se pulsa, foco visible, zonas táctiles de 44 px o más, avisos con `aria-live` y ventanas con `role="dialog"` que se cierran con Esc.
- Pruebas con Node, sin librerías: `tests/simulacion.js` carga los scripts en un contexto `vm` con un DOM simulado y ejecuta el bot de `tests/bot.js`.

## Arquitectura

Los scripts comparten el ámbito global y se cargan en este orden: datos → núcleo → mundo → premios → entorno → partido → vistas → app. Hay un único estado global `S` y una función `render()` que reconstruye la pantalla con plantillas de texto.

- **Eventos:** un solo listener de clic con delegación. Los botones llevan `data-a` (acción) y `data-id`, `data-n` o `data-i`.
- **Flujo:** acción → modifica `S` → `save()` → `render()`.
- **Estado de interfaz** que no se guarda: `UI` (competición elegida, pestañas internas, plantilla abierta).
- **Versionado:** `S.v` y la clave de `localStorage` cambian cuando el formato es incompatible. La versión actual es la 5; las partidas anteriores no se cargan.

## Modelo de datos

| Campo | Contenido |
| --- | --- |
| `S.clubs[]` | `id`, `n`, `co` (país), `t` (división), `str` (fuerza), `ros[]` (ids de jugadores) y tabla (`pts`, `pj`, `w`, `d`, `l`, `gf`, `gc`) |
| `S.lgs[]` | `id` (p. ej. `ESP1`), `co`, `t`, `n`, `clubs[]`, `order[]` (orden para el calendario) |
| `S.pl[]` | Todos los jugadores. `i`, `n`, `p`, `a`, `d` (diferencia con la fuerza del club), `o` (valoración), `s` (semilla de habilidades), `t` (rasgo), `nat`, `c` (club), `st` (estadísticas por competición: `L`, `C`, `E`, `T`, `N` → `[pj, goles, asistencias, suma de notas]`), `ms` (mes en liga). Tú eres `S.pl[S.me]` con `me: 1`. Los retirados se sustituyen por `0` |
| `S.cal[]` | Semanas de la temporada: `k` (`L` liga, `C` copa, `E` Europa, `N` selección, `T` torneo de verano), `r` (ronda) y `m` (mes) |
| `S.cups`, `S.eu[]`, `S.tours[]` | Copas por país y torneos de grupos y eliminatorias |
| `S.match` | Partido pendiente con duelos sin resolver (permite recargar la página) |
| `S.press` | Rueda de prensa pendiente |
| `S.aw`, `S.bdo`, `S.trophies` | Equipos ideales y premios (con nombres, no ids), Balón de Oro por temporada y tu palmarés |
| `S.agent`, `S.cm`, `S.gear`, `S.spons`, `S.sofs` | Representante, community manager, material equipado, patrocinios activos y propuestas |

Las habilidades de los jugadores de la IA no se guardan: se generan al mostrarlas con un generador pseudoaleatorio sembrado con `s`.

## Fórmulas principales

**Habilidades**
- Valor: `base + (nivel - 1) × 5 - declive + bonus de rasgo + bonus de material`.
- Valoración total: media ponderada por los pesos de la posición.
- Puntos para subir de nivel: `8 + 3 × nivel`. Nivel máximo 14, o 11 si no es de un rasgo.

**Calendario**
- 46 semanas de liga (las de 24 equipos usan todas; las demás descansan alguna), Europa (17: 8 de fase de liga, 2 de play-off, 2 de octavos, 2 de cuartos, 2 de semis y la final), copa (8), parones de selecciones (4), play-offs y promociones (4) y el torneo de verano.
- Mercado abierto las primeras 5 semanas y las primeras 4 de enero.

**Partidos**
- Goles: Poisson con `1,35 × exp(d / 30)` y `1,1 × exp(-d / 30)`, donde `d` es la diferencia de fuerza más 3 de campo (0 en campo neutral).
- Todos los partidos del mundo se juegan con alineación 4-3-3: se reparten goles, asistencias y notas a cada jugador.
- Ser titular: tu valoración frente al mejor de tu puesto en el club, la relación con el entrenador y la moral.
- Duelo: `base por riesgo (0,72 / 0,55 / 0,40) + (tus habilidades - las del rival en ese momento) / 50 ± entrenador, moral, energía y rasgos`, entre 0,05 y 0,95. «En ese momento» suma la forma del día del rival (±2 de media) y su cansancio: desde el minuto 55 pierde hasta un 10% en lo físico (la mitad en el resto), menos cuanta más resistencia tenga.
- Jugada decisiva: desde el minuto 70 con diferencia de un gol o menos, o en partidos muy importantes. Multiplica por 1,5 lo que ganas o pierdes en la nota.
- Tu parte de los goles del equipo: `peso de la posición × 0,75 × (tu valoración / fuerza del equipo)²`.

**Valor de mercado**
- `100 M€ × e^((valoración - 90) / 8) × edad × puesto × liga`. Edad: de ×1,4 (19 años o menos) a ×0,3 (34 o más). Puesto: de ×0,7 (portero) a ×1,15 (delantero centro). Liga: tabla `LVF` por país y división (×1,15 en la Premier, ×0,12 en Segunda Federación).
- Tu valor además se ajusta por tu nota media de la temporada y tus seguidores.
- Versión real: la valoración de cada jugador sale de invertir esa fórmula con su valor real, y un factor de calibración (`vk`) hace que el valor inicial coincida con el del archivo.

**Versión real**
- `tools/convertir-datos.ps1` lee `clubs.csv` y `players.csv` de la temporada indicada y escribe `REALDATA` con, por club, los 24 jugadores más valiosos: nombre, puesto, edad, nacionalidad y valor.
- Los clubes reales sustituyen a la primera división de cada país. Su fuerza es la media del mejor once menos 2,5. Si falta algún puesto en la plantilla, se completa con jugadores generados.
- Las nacionalidades sin selección en el juego se guardan con su nombre y no tienen equipo nacional.

**Premios**
- Equipo del mes: mejor nota media del mes por puesto en cada liga (mínimo 2 partidos).
- Balón de Oro: nota, goles y asistencias ponderados por `(fuerza media de la liga / 75)⁴`, más Europa, torneo de selecciones y títulos.

**Temporada**
- Ascensos y descensos según `FMT` en `js/formatos.js`: por cada frontera, descensos directos, ascensos directos, play-off (2, 3, 4 o 6 equipos; con 4 puede subir 1 o 2) y promociones. En el play-off, el empate favorece al mejor clasificado; en finales y promociones hay penaltis. La fuerza de cada club cambia un poco y tiende al rango de su división.
- Cada verano: retiradas entre 33 y 40 años (más tarde si el jugador es bueno), 1-3 juveniles por club, puestos mínimos cubiertos y plantillas de 22 a 26.
- Los clubes grandes fichan a los mejores jugadores de clubes más débiles.
- Plazas europeas según la clasificación de cada primera división.
- Desde los 31 años tus habilidades físicas pierden nivel. Retirada voluntaria desde los 35 y obligatoria a los 40.

## Limitaciones

- La partida ocupa de 1,5 a 2 MB en `localStorage` (el límite suele ser de 5 MB).
- El guardado vive en un solo navegador. No hay copia en la nube ni exportación.
- No hay pruebas automáticas de interfaz.
- Los nombres de jugadores se generan al azar y pueden coincidir con personas reales.
