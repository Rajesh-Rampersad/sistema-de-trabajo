# Figma

Archivo: `<fileKey>` (<link>). Galería de cards: página <nombre>.

## Encontrar un frame

- Link del card: `figma.com/design/<fileKey>/<nombre>?node-id=12-345` → node `12:345`
  (guion → dos puntos).
- Cada card de `telas.md` tiene su node ID. Los bloques de una pantalla son frames hijos con
  nombre (`<feature>/<bloque>`): ese nombre va en el comentario del componente.

## Leer sin gastar la cuota

- **Exportar PNG** del frame (Figma › Export) no gasta nada. Sirve para comparar con la captura
  del dispositivo. Ojo: si el frame tiene "clip content", el PNG sale cortado.
- **MCP** (`get_design_context`): trae textos, colores, tokens y estructura exactos, incluso
  debajo del corte con `forceCode`. Con seat View son ≈ 20 llamadas/mes: **preguntar antes** y
  anotar en el plan lo que se leyó para no repetir.
- `get_metadata` sin node ID solo ve la página actual: pedir siempre por node ID.

## Del Figma al código

- Color, espacio, radio y tipografía → token de `global.css` con el nombre del Figma.
- Medida sin token → se agrega el token y se avisa al diseño en el PR.
- Texto del Figma ≠ requisito/microcopy → vale el requisito; se anota en `decisoes.md`.
- Nombre o vínculo equivocado en el Figma → `figma-divergencias.md`, para el diseño.

## Llamadas usadas

| Fecha | Node | Qué se leyó |
|---|---|---|
| <AAAA-MM-DD> | `<node>` | <card NN completo / frame X> |
