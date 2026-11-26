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

El repositorio incluye `js/datos-reales.js` ya generado (temporada 2025-26), así que la versión real funciona también en la web publicada. Para actualizarlo con datos más recientes:

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
- **Inicio y bandeja:** resumen del jugador (valoración, valor, forma, energía, moral), próximo partido, todo lo pendiente (jugadas, prensa, eventos, ofertas, marcas, acciones) y novedades sin leer. Seis pestañas: Inicio, Partido, Jugador (entreno, material, aspecto), Carrera (club, competiciones, trayectoria) Vida (equipo, redes y publicidad, representante) y Negocios.
- **Acciones con límites:** consejo del entrenador cada 4 semanas, cena de equipo cada 8, mejora de contrato una vez por temporada y con el mercado abierto, pedir minutos solo si juegas poco; entrevistas y polémicas rinden menos si se repiten.
- **Progresión realista:** potencial oculto (se ve como un rango), crecimiento rápido hasta los 23, estable hasta los 28 y menor después; cerca del techo cuesta más; jugar hace crecer más que entrenar (cada punto entrenado en la misma semana cuesta un 4 % más). La forma (últimas 5 notas) afecta a la nota, a la titularidad y al valor.
- **Valor de mercado mensual** con aviso de subidas y bajadas y gráfico de evolución en Trayectoria.
- **Momentos estrella y momentos negros:** debut, primer gol, hat-trick, gol decisivo, títulos, partido perfecto, penalti decisivo en una tanda, jugada decisiva fallada, expulsión… Suben o bajan tu valor, seguidores, moral y relación con la prensa, y quedan en «Momentos de mi carrera».
- **Partido más visual:** minicampo con tu posición, el rival del duelo y la dirección de la jugada, y barra de dominio.
- **Resultados en ventana emergente:** al elegir una jugada importante, el resultado aparece al momento en una ventana (bien o mal, marcador y lo que cambia). Al acabar el partido se abre su resumen, y los últimos 10 partidos se pueden volver a ver desde la pestaña Partido. Puedes salir al menú o a Inicio en cualquier momento («Seguir más tarde»).
- **Partido en directo:** el reloj corre minuto a minuto, con los goles apareciendo al momento. Eliges la velocidad (x1, x2, x4) o saltas a la siguiente parada. El reloj se para en tus jugadas y cuando marcas o das una asistencia, con un ¡GOOOL! o ¡ASISTENCIA! en pantalla.
- **Jugadas por partido aleatorias:** como mínimo 1 si juegas menos de 60 minutos, 2 si juegas 60 o más y una más en partidos importantes; a menudo hay alguna más (hasta 6).
- **Móvil en horizontal:** menú lateral de iconos y contenido a dos columnas; la jugada y la ficha del rival, lado a lado.
- **Pretemporada sin club:** empiezas libre; varios clubes de la última división de tu país (y uno de la superior) te siguen. Durante 3 semanas haces una prueba por semana (partidillo, física o técnica, con su probabilidad a la vista) y firmas donde te convenzan. Siempre hay un contrato juvenil sin prueba. Donde firmes es tu cantera.
- **Rasgos que evolucionan:** Bronce, Plata, Oro y Platino. Suben jugando bien y usando el rasgo; cada rango aumenta su bonificación y el techo de sus habilidades. El principal llega a Platino y el secundario a Oro. Cuando el principal llega a Oro eliges un tercer rasgo (hasta Plata) y cuando el secundario llega a Oro, un cuarto (hasta Bronce); traen también sus limitaciones. Cada rasgo tiene su barra de desarrollo en Jugador → Entreno.
- **Rivales con rasgos:** los jugadores de la IA también tienen rasgo principal y, los mejores, secundario, con su rango (Bronce a Platino según su nivel). Sus rasgos suben las habilidades del rasgo y bajan las que limitan, y se ven en la ficha del rival durante el duelo, en las plantillas (un punto del color del rango) y en la ficha de cada jugador.
- **Evolución del resto de jugadores:** cada jugador guarda su valoración temporada a temporada (gráfico en su ficha y flecha ▲▼ en la plantilla). Sus rasgos suben de rango al mejorar y los veteranos pueden bajar. Al acabar la temporada ves los jóvenes que más despuntan y los rasgos que suben a Oro o Platino. Siguen saliendo canteranos cada año.
- **Edad y liga marcan tu mejora:** el ritmo de mejora es edad × liga × potencial y se ve desglosado en Jugador → Entreno. En ligas fuertes mejoras más rápido (hasta un 135 %); en las bajas más despacio (desde un 60 %), y marcas y asistes más, pero cada liga tiene un techo (su nivel medio + 14) por encima del cual casi no creces. La liga pesa mucho de joven (×1,25 hasta los 19) y poco de veterano (×0,4 desde los 31); a partir de los 31 pierdes físico más despacio en una liga fuerte. La tarjeta «Dónde mejorarías más» compara las divisiones de tu país y cada oferta muestra el ritmo que tendrías en ese club. Los jugadores de la IA siguen las mismas reglas.
- **Techos de habilidad (estilo 2K):** cada habilidad tiene un valor máximo de 99 que se ve en una barra: valor actual, margen hasta el techo, lo que desbloquean tus rasgos al subir de rango y lo bloqueado. Las habilidades clave del puesto llegan más alto (84-88) y las ajenas se quedan bajas (66-80). Cada rango de rasgo sube el techo de sus habilidades: el principal hasta 90, 93, 96 y 99 en Platino, y el secundario hasta 94 en Oro. Solo el rasgo principal en Platino llega a 99. Los límites de los rasgos bajan el techo. Cada jugador tiene una variación propia de ±3 por habilidad y un ritmo de mejora distinto en cada una (lenta, normal o rápida). Jugador → Entreno muestra las características principales del puesto con su techo.
- **Creación guiada:** primero el rasgo principal, luego el secundario, y un gráfico con el nivel máximo que podrá alcanzar cada habilidad de tu posición. Dorsal libre del 1 al 99.
- **Directiva:** cada pocas semanas te cita: objetivos de temporada (ambicioso o moderado, con prima si lo cumples), renovación cuando te queda un año, avisos por bajo rendimiento, interés de un grande o el proyecto del club. Puedes pedir una reunión, **solicitar el traspaso** (y, si te lo niegan, forzar la salida) o retirarlo.
- **Negociación de contratos:** al fichar o renovar se abre una mesa de negociación con salario, años, prima de fichaje, bonus por partido, por gol y por asistencia y % de tu próxima venta. Tú subes o bajas cada cláusula y propones; el club acepta, hace una contraoferta o se levanta si se agota su paciencia. Cuanto mejor es tu representante, más cláusulas puede pedir (nivel 1: salario y años; 2: prima y bonus por partido; 3: bonus por gol y asistencia; 4: % de venta), más le tolera la directiva y más información ve (paciencia, límite aproximado o exacto). Si se te acaba el contrato sin renovar, quedas **libre**: sin club, en una pretemporada de jugador libre de 3 semanas con clubes interesados según tu valoración y el alcance de tu representante (y, si te llevas bien con la directiva, tu antiguo club). Puedes negociar, firmar o hacer pruebas; como llegas sin traspaso, las primas de fichaje son más altas.
- **Negocios:** 16 empresas (de un piso de alquiler a un club de fútbol modesto) con tres niveles, gestor opcional, riesgo, resultado mensual que sube o baja, sucesos (inspecciones, meses récord, una startup que se dispara o se hunde) y venta. Campañas de publicidad puntuales según tus seguidores.
- **Hitos (Carrera → Hitos):** resumen de tu carrera y lista completa de trofeos (ligas, ascensos, copas, Europa y selección) y premios: Balón de Oro y podios, Bota de Oro, mejor joven del mundo, equipo mundial del año, **equipo europeo de la temporada** y mejor jugador de Europa, mejor jugador, goleador, asistente y joven de la liga, equipo de la temporada, jugador y equipo del mes, y premios de torneos. Cada hito guarda la temporada, el club y la división (con su nivel medio), y se ve cuántas veces lo has logrado en cada liga, además de tu puesto en el Balón de Oro cada temporada.
- **Versión app (Android, en preparación):** en la app el juego tiene una temporada gratis al día por dispositivo; para seguir ese día se compra el juego completo o se ven anuncios con recompensa (3 por temporada extra, configurable en `js/movil.js`). La web de GitHub sigue siendo libre. Para probar el modo app en el navegador: `index.html?app=1` (anuncios y compra simulados). La app usa solo la versión ficticia, el botón atrás de Android cierra ventanas o vuelve a Inicio, y al empezar aparece una tarjeta de primeros pasos.
- **Web instalable:** desde el móvil se puede «Añadir a pantalla de inicio» (icono propio, pantalla completa y funciona sin conexión). El enlace se ve con imagen y descripción al compartirlo.
- **Partidas a salvo:** el juego pide al navegador almacenamiento persistente y, cada 3 temporadas sin copia, recuerda en Inicio guardar la partida en un archivo.
- **Fin de carrera y compartir:** al retirarte aparece tu carrera completa (partidos, goles, asistencias, nota, títulos, Balón de Oro, veces mejor jugador de la liga, equipos de la temporada, horas sobre el césped, tiempo jugando, valoración y valor máximos, clubes y mejor temporada). Con «Compartir mi carrera» se crea una imagen vertical: en el móvil se comparte con el menú del sistema (Instagram, WhatsApp, X, Facebook…); en el ordenador, con X, Facebook, WhatsApp, descarga y copiar texto. También desde Carrera → Hitos.
- **Diario Balón:** titulares cada semana sobre tus partidos, la liga, rumores de fichaje, tu rival y tus premios, con hemeroteca en Inicio.
- **Capitanía:** tras dos temporadas en un club, con buena relación con el vestuario y entre los mejores de la plantilla, te eligen capitán (sube el salario, ganas algo más de duelos y tienes la «Charla de capitán»). También puedes ser capitán de la selección.
- **Vida personal (Vida → Vida personal):** cinco casas (más moral y descanso cada semana, con su alquiler), garaje con cinco coches y familia con eventos: conocer a alguien, boda, hijos y crisis.
- **Rival de tu generación:** un jugador de tu edad y nivel parecido en tu línea; en Inicio comparas valoración, valor, goles, asistencias y Balón de Oro, y llevas la cuenta de temporadas ganadas.
- **Dificultad:** Fácil, Normal o Leyenda (duelos, ritmo de mejora y salarios). Se elige al crear la carrera y se cambia en Carrera → Trayectoria.
- **Sugerencias:** enlace en el menú lateral para enviar ideas o fallos.
- **Pruebas automáticas:** en cada subida a GitHub se comprueba la sintaxis y el bot juega varias carreras (`.github/workflows/pruebas.yml`).
- **Más vida en el vestuario:** entrenamiento extra, ideas tácticas, charla con el capitán, torneo de videojuegos, directos en redes, visitas a peñas y nuevos eventos (piques, novatadas, filtraciones, palco con la directiva).
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
| `js/vida.js` | Directiva, negociación de contratos, traspasos, publicidad, empresas y vistas de Vida y Negocios |
| `js/hitos.js` | Pestaña Hitos: trofeos y premios con temporada, club y división |
| `js/movil.js` | Versión app: límite de temporadas por día, anuncios con recompensa, compra, botón atrás y primeros pasos |
| `js/contenido.js` | Dificultad, Diario Balón, capitanía, vida personal y rival generacional |
| `js/compartir.js` | Resumen de carrera, pantalla de retirada e imagen para compartir |
| `sw.js`, `manifest.webmanifest`, `iconos-app/` | Web instalable y sin conexión |
| `js/inicio.js` | Pestaña Inicio, bandeja y secciones agrupadas |
| `js/progresion.js` | Potencial, curva de edad, forma, valor mensual, momentos y gráfico |
| `diseno/` | Encargos (prompts, guía de estilo e inventario) para pedir gráficos a herramientas de diseño |
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
