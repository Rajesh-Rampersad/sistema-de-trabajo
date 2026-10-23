# <NOMBRE DEL SITIO>

App Next.js (App Router) de <CLIENTE>. Fase actual: <p. ej. "pantallas del Figma con dato fake">.
Spec: `docs/superpowers/specs/<fecha>-<tema>.md`.

- Implementando una página: empieza por `docs/telas.md` (card del Figma → ruta → estados).
- Leyendo el Figma: `docs/figma.md`. Por qué la stack es esta: `docs/decisoes.md`.

**Idioma:** identificadores en inglés; texto de UI, comentarios, commits y PR en <IDIOMA DEL
EQUIPO>. Revisor de diseño/PR: <NOMBRE>.

## Next.js cambia en cada versión

Antes de usar una API (caché, `params`, Server Actions, metadata), lee la doc de la versión
instalada: `node_modules/next/dist/docs/` (Next.js 16 la trae en el paquete) o
`https://nextjs.org/docs` con la versión del `package.json`. No mezcles patrones del Pages
Router. Next escribe un bloque propio al principio de este archivo y lo re-agrega en cada
`next dev`: déjalo y commitéalo.

## Estructura

```
src/app/                      rutas: page.tsx/layout.tsx finos; leen params/searchParams y renderizan la pantalla
  (grupo)/…                   grupos de rutas por flujo
  api/…/route.ts              solo si un cliente externo necesita el endpoint
src/features/<feature>/
  index.ts                    API pública: lo único que otra feature o ruta importa
  domain/                     funciones puras; sin React, sin fetch, sin I/O
  data/                       I/O: fetch, banco, Server Actions (`"use server"`), hooks de cliente
  components/                 bloques del Figma, con el nombre del frame en comentario
  screens/                    la pantalla entera, una por ruta
  mocks.ts                    dato fake de la feature
src/shared/                   ui/ layout/ lib/ db/
src/app/globals.css           tokens del Figma (@theme) y estilos de texto (@utility)
public/                       íconos, logos, ilustraciones exportados del Figma
```

## Reglas de dependencia

1. Una feature importa otra **solo por el `index.ts`**.
2. `domain/` no importa React, Next ni `data/`.
3. Solo `data/` hace I/O. La pantalla recibe el dato por función de `data/` (Server Component)
   o por hook de `data/` (Client Component).
4. **La pantalla nunca importa `mocks.ts`**: `data/` elige la fuente.
5. `shared/` no importa `features/`.
6. Lo que importa `server-only` (claves, banco) nunca llega a un `"use client"`.

Las reglas 1, 2 y 5 son `noRestrictedImports` en `biome.json`.

## Servidor y cliente

- Por defecto, Server Component. `"use client"` solo en la hoja que necesita estado, efecto o
  evento; pasa al cliente datos serializables, no funciones del servidor.
- Lectura: en el Server Component, por función de `data/`. Mutación: Server Action en `data/`
  + `revalidatePath`/`revalidateTag`.
- Estados de la ruta: `loading.tsx` (card de loading), `error.tsx` (card de error),
  `notFound()` + `not-found.tsx` (id inexistente). Vacío = estado de la pantalla.
- Filtro y página van en la URL (`searchParams`), no en `useState`: el link se puede compartir
  y el servidor ya renderiza filtrado.
- **Molde:** `src/features/example` (ruta `/ejemplo`): Server Component que lee de `data/`,
  `loading.tsx`, componente de cliente con override de favoritos y su test, función pura con
  `it.each`.

| Estado | Dónde |
|---|---|
| Dato del servidor | Server Component + función de `data/` |
| Dato remoto en el cliente (polling, infinito) | TanStack Query |
| Filtro, página, pestaña | `searchParams` |
| Preferencia del visitante | cookie (la lee el servidor) |
| Estado de un solo componente | `useState` |

## Estilo: solo tokens

- Tailwind v4 con tokens en `globals.css`, con el nombre del Figma: color, espacio, radio y un
  estilo tipográfico por elemento de texto.
- Un valor suelto (`bg-[#fff]`, `p-[12px]`) rompe el `pnpm check`; si el Figma tiene una medida
  sin token, agrégala con el nombre del Figma y avísalo en el PR.
- Imagen con `next/image` (ancho y alto del asset); fuente con `next/font`.

## Nomenclatura

| Qué | Patrón | Ejemplo |
|---|---|---|
| Segmento de ruta | idioma del equipo, kebab-case, espeja el card | `historico/[id]/page.tsx` |
| Archivo fuera de ruta | inglés, kebab-case | `history-card.tsx` |
| Componente | PascalCase, export nombrado (default solo en archivos de Next) | `export function HistoryCard` |
| Server Action | verbo + objeto | `deleteMeasurement` |
| Rama / commit | `feat/<flujo>-<cosa>` / imperativo con alcance | `historico: paginação` |

## Accesibilidad

HTML semántico primero (`button`, `a`, `nav`, `h1`…); ARIA solo cuando no alcanza. Área
clickeable mínima de 44 px en móvil. Foco visible. Respeta `prefers-reduced-motion`. WCAG 2.1 AA.

## Tests

- Regla pura: `*.test.ts` al lado, `it.each`, tiempo fijo. Gate de 100% de branch en
  `src/features/*/domain/**`.
- Componente de cliente: Vitest + Testing Library, un test por mecanismo.
- Flujo entre páginas (filtro en la URL, borrar y volver a la lista): Playwright.

## Cómo trabajamos

- Comandos de Claude Code (`.claude/commands/`): `/retomar` (dónde quedamos, según el Estado del
  plan), `/revisar` (diff + linter + tipos + tests, sin corregir), `/cerrar-paso` (commit +
  plan) y `/pr` (descripción del PR desde `docs/pr.md`).
- Plan de cada historia en `docs/superpowers/plans/` (plantilla `_plantilla.md`), con la sección
  Estado al día al cerrar cada paso.
- Antes de marcar un card como `feito`: `docs/checklist-pantalla.md`.

## Antes del PR

`pre-commit`: Biome sobre los staged + `pnpm typecheck`. `pre-push`: `pnpm test`.

`pnpm check && pnpm typecheck && pnpm test && pnpm build` en verde, página revisada en 390 px y
en el ancho de escritorio del Figma (todos los estados), status actualizado en `docs/telas.md`.
Nunca `--no-verify`.
