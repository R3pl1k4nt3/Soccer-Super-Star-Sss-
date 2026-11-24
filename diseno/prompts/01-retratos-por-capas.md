# 01 · Retrato del jugador por capas

**Para qué:** sustituir el retrato que dibuja `js/avatar.js` (tarjetas, menú, Inicio, editor de aspecto).

**Lienzo:** 512 × 560 px (o SVG `viewBox="0 0 200 220"`), centro de la cara en (100, 92) del SVG, hombros cortados abajo. Fondo transparente.

**Capas y variantes** (un archivo por variante, mismo lienzo):

| Capa | Variantes (nombre de archivo) | Color de referencia para recolorear |
| --- | --- | --- |
| Cara | `cara-ovalada`, `cara-redonda`, `cara-cuadrada`, `cara-alargada` | piel `#d29a6e` |
| Orejas y cuello | `cuello` | piel `#d29a6e` |
| Ojos | `ojos-normales`, `ojos-rasgados`, `ojos-grandes`, `ojos-entornados` | iris `#3d7cc9` |
| Cejas | `cejas-finas`, `cejas-gruesas`, `cejas-arqueadas` | pelo `#4a2e1c` |
| Nariz y boca | `nariz-boca` | piel / labios automáticos |
| Barba | `barba-perilla`, `barba-corta`, `barba-poblada`, `barba-bigote` | pelo `#4a2e1c` |
| Pelo (detrás de la cabeza) | `pelo-atras-melena`, `pelo-atras-afro`, `pelo-atras-rastas`, `pelo-atras-coleta`, `pelo-atras-mono` | pelo `#4a2e1c` |
| Pelo (delante) | `pelo-rapado`, `pelo-corto`, `pelo-degradado`, `pelo-tupe`, `pelo-rizos`, `pelo-afro`, `pelo-melena`, `pelo-coleta`, `pelo-mono`, `pelo-rastas` | pelo `#4a2e1c` |
| Cinta | `cinta` | blanco |
| Hombros con camiseta | `camiseta-cuello-v`, `camiseta-cuello-redondo` | principal `#1565c0`, secundario `#ffffff` |
| Tatuaje de cuello | `tatuaje-cuello` | tinta `#18203a` |

**Prompt**

> Crea un set de piezas vectoriales por capas para el retrato de busto de un futbolista genérico (no basado en ninguna persona real), estilo ilustración plana con volumen suave, vista frontal, expresión neutra y segura, para un videojuego de carrera de fútbol con interfaz oscura. Todas las piezas en el mismo lienzo de 200×220 unidades, fondo transparente, alineadas para apilarse sin moverlas: cara (4 formas: ovalada, redonda, cuadrada, alargada), cuello y orejas, ojos (normales, rasgados, grandes, entornados), cejas (finas, gruesas, arqueadas), nariz y boca, barba (perilla, corta, poblada, bigote), pelo por detrás y por delante (rapado, corto, degradado, tupé, rizos, afro, melena, coleta, moño, rastas), cinta del pelo y hombros con camiseta de fútbol (cuello en V y redondo). Usa colores planos de referencia para poder recolorear: piel #d29a6e, pelo #4a2e1c, iris #3d7cc9, camiseta #1565c0 con detalles #ffffff. Sombras como capas semitransparentes negras, no como colores mezclados. Sin texto, sin logotipos, sin parecido con futbolistas reales. Entrega en SVG con un archivo por pieza.

**Entrega:** `entregas/retrato/<nombre>.svg`
