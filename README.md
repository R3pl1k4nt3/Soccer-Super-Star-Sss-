# Estrella del Balón

Simulador de carrera futbolística para móvil y navegador. Empiezas con 16 años en la cantera de un club de la última división de tu país y juegas hasta retirarte: subes de categoría, fichas por clubes mejores, vas con tu selección y peleas por el Balón de Oro. Se juega con decisiones, no con reflejos.

Hay dos versiones, a elegir al crear la carrera:

- **Ficticia:** clubes con nombres inspirados en los reales (no los oficiales) y fuerza parecida a la de la temporada 2025-26. Todos los jugadores son ficticios: sus nombres se generan al azar y pueden coincidir con personas reales.
- **Real:** clubes y jugadores reales de las primeras divisiones de España, Inglaterra, Italia, Alemania, Francia, Portugal y Países Bajos, con su valor de mercado. Las categorías inferiores e Irlanda son generadas. **No es una versión comercial: es solo para pruebas y uso particular.** Los datos salen de un dataset público de Kaggle basado en Transfermarkt y pertenecen a sus titulares; las habilidades de cada jugador son estimaciones del juego a partir de su valor, edad y puesto.

### Escudos

Todos los clubes tienen un escudo generado (forma, colores e iniciales). En la versión real se pueden usar los escudos de verdad, descargados de TheSportsDB (API gratuita) una sola vez a la carpeta `escudos/`, que no se sube a GitHub:

```powershell
powershell -ExecutionPolicy Bypass -File tools\descargar-escudos.ps1
```

El script respeta el límite de la API (30 peticiones por minuto) y crea `js/escudos-reales.js`. Los clubes que no encuentre siguen con su escudo generado.

### Preparar la versión real

Los datos reales no se incluyen en el repositorio. Para generarlos:

1. Descarga el dataset «player-scores» de Kaggle y deja sus CSV (al menos clubs.csv y players.csv) en una carpeta datos junto a la carpeta del juego.
2. Desde la carpeta del juego, ejecuta:

```powershell
powershell -ExecutionPolicy Bypass -File tools\convertir-datos.ps1 -Datos ..\datos
```

Se crea js/datos-reales.js (unos 130 KB) y la opción «Real» aparece al crear la carrera. Vuelve a ejecutarlo cuando actualices los CSV.

## Cómo jugar

Abre `index.html` en cualquier navegador moderno. No necesita instalación, servidor ni conexión (solo las tipografías de Google Fonts, con alternativa del sistema).

1. Elige nombre, nacionalidad, país donde empiezas, posición y rasgos. Te toca un club al azar de la última división: será tu **cantera**.
2. **Entreno:** paga € para sumar puntos a una habilidad, o gasta medallas para completar el nivel.
3. **Partido:** cada semana juegas liga, copa, Europa o selección. En los partidos te enfrentas a rivales concretos y decides cómo afrontar cada duelo.
4. **Compet.:** clasificaciones, goleadores, asistentes, notas, equipo del mes y del año de cualquier liga, copa o torneo, y los premios mundiales.
5. **Club:** tu contrato, la selección, el representante y las ofertas.
6. **Vida:** relaciones, moral, acciones, redes sociales y community manager.
7. **Negocio:** patrocinios, inversiones y fondo.
8. **Tienda:** material (botas, guantes, ropa) y servicios.

Al abrir el juego aparece el **menú de partidas**: tres huecos para tener varias carreras a la vez. Cada partida se guarda sola en el navegador (IndexedDB). Desde el menú o desde la pestaña Carrera puedes **exportarla a un archivo .json** e **importarla** después, por ejemplo para hacer una copia de seguridad o seguir en otro ordenador.

## Contenido

- **Mundo:** 8 países con 2 a 4 divisiones y 420 clubes: España (Primera, Segunda, Primera Federación y Segunda Federación), Inglaterra (4), Italia, Alemania y Francia (3), Portugal, Países Bajos e Irlanda (2). Ascensos y descensos cada temporada. Más de 9.000 jugadores con nombre, nacionalidad, edad y habilidades.
- **Formatos reales (2025-26, simplificados):** tamaño real de cada división, ascensos y descensos directos, play-offs de ascenso (Segunda española, Championship, Serie B del 3º al 8º…) y promociones entre categorías (16º de la Bundesliga contra 3º de la 2. Bundesliga, *barrage* francés, Eredivisie, Irlanda). En la pestaña Compet. se explica cada frontera y se ven los cruces.
- **Europa con el formato actual:** fase de liga de 36 equipos (8 jornadas; 6 en la tercera competición), play-off del 9º al 24º, octavos, cuartos y semifinales a ida y vuelta y final a partido único. Plazas por país como en la realidad; el campeón de copa va a la segunda competición. Los clubes de países sin liga en el juego entran como invitados. En la versión real se llaman Champions League, Europa League y Conference League.
- **Copas:** de cada país, con su formato (el equipo modesto juega en casa en la Copa del Rey, semifinales a doble partido en España, Italia y Portugal…). En verano, Copa del Mundo (años pares) o Campeonato de Europa y Copa de Naciones (años impares).
- **Exigencia por nivel:** cuanto más alta la liga, más fuertes son los rivales, más difícil es ser titular y más cuesta ganar los duelos. Las ofertas dependen de tu valoración y de tu representante.
- **Valor de mercado** de cada jugador, al estilo Transfermarkt: depende de su nivel, edad, puesto y liga (y, en tu caso, de tu forma y tu fama). Se ve en las plantillas, en tu club, en tu carrera y en la clasificación «Más valiosos» de cada competición.
- **Duelos:** cada decisión es contra un jugador concreto del rival («Te enfrentas a K. Duarte, central, 74»). Ves su ficha en ese momento (aceleración, velocidad, fuerza, robo de balón, marcaje…), con su forma del día y el cansancio según el minuto, y qué habilidades suyas cuentan en cada opción frente a las tuyas. Las jugadas en los últimos minutos con el marcador ajustado, y las de partidos grandes, son **decisivas**: pesan el doble.
- **Estadísticas y premios:** goleadores, asistentes y notas por competición; equipo del mes y del año por liga; equipo ideal de cada torneo; equipo mundial del año; mejor jugador y mejor joven de cada liga; Bota de Oro; Balón de Oro con su ranking en directo.
- **Selección:** convocatorias según tu nivel frente a los mejores de tu nacionalidad en tu puesto, tu nota media y la prensa. Partidos en los parones y torneos de verano.
- **Ruedas de prensa:** tras partidos importantes o actuaciones destacadas. Tus respuestas cambian la relación con prensa, afición, entrenador, vestuario y directiva, tu moral y tus seguidores.
- **Representante:** cinco niveles. Cobra comisión, pero trae más ofertas y de más países, mejora salarios y atrae marcas antes.
- **Community manager:** hace crecer tus seguidores y tus ingresos en redes; los baratos pueden meterte en polémicas.
- **Material:** botas, guantes y ropa de marcas ficticias en cuatro gamas. Suben habilidades concretas y se desgastan con los partidos.
- **Patrocinios:** marcas de botas, bebida, coches, relojes, moda, videojuegos, telefonía y comida, con requisitos de valoración y seguidores, duración, publicaciones obligatorias y exclusividad de botas.
- **Aspecto del jugador:** piel, cara, ojos, cejas, pelo, barba, complexión, camiseta por dentro o por fuera, manga, altura de las medias, cinta, muñequera y dorsal. Se cambia en cualquier momento desde Carrera. La altura y los tatuajes se eligen al crear el jugador: luego se pueden añadir tatuajes, pero no quitar.
- **Cantera y relevo generacional:** cada verano cada club sube de 1 a 3 juveniles; los veteranos se retiran según edad y nivel, y las plantillas se mantienen entre 22 y 26 jugadores.
- **Diseño adaptable:** en ordenador, menú lateral y contenido en columnas; en tablet y móvil, barra superior y pestañas abajo.
- **Relaciones, moral, eventos, economía, envejecimiento y retirada.**

## Estructura del repositorio

| Ruta | Contenido |
| --- | --- |
| `index.html` | Página; carga `css/estilo.css` y los scripts de `js/` |
| `css/estilo.css` | Sistema visual y diseño adaptable |
| `js/formatos.js` | Ascensos, play-offs, copas, plazas europeas, Europa con fase de liga e invitados |
| `js/avatar.js` | Dibujo del jugador (retrato y cuerpo entero) |
| `js/escudos.js` | Escudos generados y uso de los reales si se han descargado |
| `js/guardado.js` | Huecos de partida, IndexedDB, exportar e importar |
| `tools/descargar-escudos.ps1` | Descarga los escudos reales de TheSportsDB |
| `js/aspecto.js` | Opciones de aspecto, colores de equipación y editor |
| `js/datos-reales.js` | Clubes y jugadores reales (se genera, no está en el repositorio) |
| `tools/convertir-datos.ps1` | Convierte los CSV de Kaggle en `js/datos-reales.js` |
| `tools/servidor.ps1` | Servidor local opcional para probar en `http://localhost` |
| `js/datos.js` | Países, ligas, clubes, selecciones, nombres, marcas, representantes y material |
| `js/nucleo.js` | Utilidades, posiciones, habilidades, rasgos y guardado |
| `js/mundo.js` | Creación del mundo, calendario, ligas, copas, torneos, ascensos y mercado de la IA |
| `js/partido.js` | Tu partido, duelos, semanas y fin de temporada |
| `js/premios.js` | Clasificaciones individuales, equipos ideales y premios |
| `js/entorno.js` | Representante, redes, material, patrocinios, prensa, eventos y dinero |
| `js/vistas.js` | Pantallas |
| `js/app.js` | Pintado y eventos |
| `TECNOLOGIA.md` | Arquitectura, modelo de datos y fórmulas |
| `tests/bot.js` | Bot que juega carreras completas |
| `tests/simulacion.js` | Ejecuta el bot en Node con varias posiciones y países |

## Pruebas

```bash
node tests/simulacion.js 5
```

Juega 5 temporadas con cinco carreras distintas (posiciones, nacionalidades y países), renderiza todas las pestañas y comprueba que la partida cabe en `localStorage`. Si hay un error de lógica, falla con la traza. El bot también se puede cargar en la consola del navegador (`tests/bot.js`, función `botCarrera`).

## Ideas pendientes

- Más países y ligas (Sudamérica, Estados Unidos, Arabia).
- Eliminatorias de ida y vuelta y fases previas europeas.
- Fichajes de la IA más completos (cesiones, cláusulas).
- Rasgos que se desbloquean con el tiempo.
- Exportar e importar la partida.
- Revisar el equilibrio de costes y probabilidades.

## Licencia

Pendiente de elegir por el autor.
