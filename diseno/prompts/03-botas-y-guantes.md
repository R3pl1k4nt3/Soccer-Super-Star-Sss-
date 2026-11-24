# 03 · Botas y guantes de marcas ficticias

**Para qué:** imágenes de la tienda de material (pestaña Jugador → Material) y botas de la figura de cuerpo entero.

**Marcas (todas inventadas; no imitar logotipos reales):**

| Marca | Nivel | Identidad que debe transmitir | Color de marca sugerido |
| --- | --- | --- | --- |
| Tribanda | ★★★★ | Élite clásica, tres líneas paralelas en diagonal propias | blanco y negro |
| Arco | ★★★★ | Velocidad, una curva dinámica | naranja `#ff5a1f` |
| Felino | ★★★ | Agilidad, silueta de garra estilizada | amarillo `#ffd400` |
| Kaizen | ★★ | Técnica japonesa, ola o pincelada | azul `#1e88e5` |
| Nordika | ★★ | Resistencia nórdica, montaña o runa geométrica | verde `#00c853` |
| Leona | ★ | Barata y robusta, melena simplificada | rojo `#e53935` |

**Tipos de bota:** Velocidad (ligera, muy baja), Precisión (empeine liso), Control (textura en el empeine), Pase (interior acolchado), Agarre (tacos marcados, robusta). Portero: Saque.
**Gamas:** Básica, Media, Pro, Élite (más detalle y brillo cuanto más alta).
**Guantes de portero:** tipos Agarre, Reflejos y Juego aéreo, por marca.

**Prompt (botas)**

> Diseña una bota de fútbol para la marca ficticia «{MARCA}» (identidad: {IDENTIDAD}; color {COLOR}), modelo «{TIPO}», gama «{GAMA}». Vista lateral exterior del pie derecho, puntera hacia la derecha, estilo ilustración vectorial plana con volumen suave para un videojuego, fondo transparente, lienzo 512×256. El logotipo de la marca debe ser original y no parecerse a ninguna marca real de material deportivo. Más detalle, brillo y materiales premium cuanto más alta la gama (Básica sencilla, Élite muy cuidada). Sin texto.

**Prompt (guantes)**

> Diseña un par de guantes de portero para la marca ficticia «{MARCA}» ({IDENTIDAD}, color {COLOR}), modelo «{TIPO}», gama «{GAMA}». Vista frontal de la palma y el dorso, estilo ilustración vectorial plana con volumen suave, fondo transparente, lienzo 512×512, logotipo original. Sin texto.

**Entrega:** `entregas/material/bota-{marca}-{tipo}-{gama}.png` y `entregas/material/guantes-{marca}-{tipo}-{gama}.png` (en minúsculas y sin acentos, por ejemplo `bota-arco-velocidad-elite.png`). Lista completa en `inventario.json`.
