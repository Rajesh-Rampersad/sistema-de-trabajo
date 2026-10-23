# Telas

Mapa de los cards de la galería del Figma (ver [`figma.md`](figma.md)) al código. Rutas
relativas a `src/app/`. **Status:** `feito` = fiel al Figma; `placeholder` = el archivo existe
con un placeholder; `a criar` = todavía no existe.

Al terminar una pantalla, actualiza el status aquí en el mismo PR.

| # | Card | Node | Archivo | Estado | Historia | Status |
|---|---|---|---|---|---|---|
| 01 | <app>/<flujo>/<pantalla>/default | `<node-id>` | `<ruta>` | `default` | <historia> | a criar |
| 02 | <app>/<flujo>/<pantalla>/loading | `<node-id>` | `<ruta>` (misma) | `loading` | <historia> | a criar |
| 03 | <app>/<flujo>/<pantalla>/empty | `<node-id>` | `<ruta>` (misma) | `empty` | <historia> | a criar |

Las variantes de un card (loading, vacío, error, offline) son **estados de la misma pantalla**,
no rutas.

## Componentes y hojas fuera de la galería

| Frame | Dónde aparece | Qué es | Historia | Status |
|---|---|---|---|---|
| <frame> (`<node-id>`) | `<ruta>` | <sheet, modal, toast…> | <historia> | a criar |

## Pendientes conocidos

- <card NN>: <qué falta y de quién depende>.
