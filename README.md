# Estrella del Balón

Simulador de carrera futbolística para móvil y navegador. Empiezas con 16 años, eliges posición y rasgos, y juegas hasta retirarte. Se juega con decisiones, no con reflejos. Sin límite de tiempo ni de energía para entrenar.

Es un juego original, con clubes y jugadores ficticios. Está inspirado en el género de simuladores de carrera por decisiones, sin copiar ningún juego concreto.

## Cómo jugar

Abre `index.html` en cualquier navegador moderno. No necesita instalación, servidor ni conexión (solo las tipografías de Google Fonts, con alternativa del sistema).

1. Elige nombre, posición, rasgo principal y rasgo secundario.
2. **Entreno:** paga € para sumar puntos a una habilidad, o gasta medallas para completar el nivel.
3. **Partido:** juega jornadas. Cada una da puntos de habilidad, dinero y medallas según tu nota.
4. **Vida:** cuida la relación con entrenador, vestuario, prensa, afición y directiva.
5. **Club, Dinero y Tienda:** ficha por clubes mejores, invierte y compra mejoras.

El progreso se guarda solo en el navegador (`localStorage`).

## Contenido

- **13 posiciones:** portero, central, lateral izquierdo y derecho, mediocentro defensivo, mediocentro, interior izquierdo y derecho, mediapunta, segundo delantero, delantero centro y extremo izquierdo y derecho.
- **Habilidades por categorías:** mentales, físicas, defensa, medio y ataque. 26 en el campo y 17 en portería. Cada posición da un peso distinto a cada una.
- **Rasgos:** 14 de campo y 4 de portero. El principal da +8 a sus habilidades y el secundario +4. Las demás habilidades no pasan del nivel 11 (el máximo es 14).
- **Partidos con decisiones:** una o dos jugadas por partido, con tres opciones según tu posición. Muestran riesgo, probabilidad de éxito y las habilidades que influyen. Puedes dejarlas en automático.
- **Liga de 20 clubes** con 22 jugadores cada uno, con nombre, edad, valoración y habilidades. Los goles y asistencias muestran quién los marca.
- **Relaciones:** entrenador, vestuario, prensa, afición y directiva, con acciones sociales y eventos aleatorios.
- **Economía:** salario, primas por partido, patrocinios, 8 negocios, fondo de inversión, redes sociales y tienda de mejoras.
- **Carrera:** contratos, ofertas en dos mercados por temporada, envejecimiento, retirada y resumen final.

## Estructura del repositorio

| Ruta | Contenido |
| --- | --- |
| `index.html` | Todo el juego: HTML, CSS y JavaScript en un solo archivo |
| `TECNOLOGIA.md` | Arquitectura, modelo de datos y fórmulas |
| `tests/simulacion.js` | Simula temporadas completas en Node para detectar errores |

## Pruebas

```bash
node tests/simulacion.js
```

Juega varias temporadas en distintas posiciones con un bot que entrena, elige decisiones y renderiza todas las pestañas. Si hay un error de lógica, falla con la traza.

## Ideas pendientes

- Copas europeas y selección nacional.
- Varias ligas y descensos.
- Rasgos que se desbloquean o se cambian con el tiempo.
- Exportar e importar la partida.
- Revisar el equilibrio de costes y probabilidades.

## Licencia

Pendiente de elegir por el autor.
