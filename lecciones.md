# Lecciones

Cosas que costaron tiempo y que conviene saber desde el día uno. Cada una: **síntoma** → causa →
qué hacer. Agrega las nuevas al final de su sección.

## React y estado

- **Un valor que viene del banco/servidor no se actualiza en pantalla** → se copió a
  `useState(() => …)`, y el inicializador corre una sola vez, cuando el dato todavía estaba vacío
  → guarda solo lo que el usuario cambió (`Map<id, valor>` de overrides) y calcula
  `override ?? valorDelDato` en el render. Ejemplo en `plantillas/*/src/features/example`.
- **Al togglear, el valor vuelve al anterior o se invierte mal** → el handler invierte el
  override y no lo que se ve → guarda `!valorVisible(item)`, con la misma función que usa el
  render.
- **Un estado que depende de una lista queda fuera de rango** (página 3 de 2 después de borrar)
  → ajústalo en el render cuando ya cargó: `if (!isLoading && page > pageCount) setPage(pageCount)`.
  Es el patrón de React "ajustar estado durante el render", sin `useEffect`.
- **Copiar un patrón de otra pantalla y que no compile** (`state.detail` no existe) → el
  patrón era para un elemento y aquí hay muchos → antes de copiar, pregunta "¿cuántos hay?": uno
  = un valor; muchos = un `Map` por id.

## Dato (Drizzle `useLiveQuery`, TanStack Query)

- **Por un instante aparece "no hay nada" antes de la lista** → `useLiveQuery` empieza con
  `data: []` y `updatedAt: undefined` → el hook expone `isLoading` (cargado = `updatedAt`
  definido en todas las consultas) y la pantalla muestra la carga, no el vacío.
- **El filtro o la página cambian y la lista no** → `useLiveQuery` usa la consulta del primer
  render → todo lo que cambia la consulta va en las `deps`.
- **Cambiar el seed no cambia el celular** → el seed solo graba con la tabla vacía → borra los
  datos del app (`adb shell pm clear <paquete>`; vuelve también el onboarding).

## Tests

- **`pnpm test <carpeta>` falla por cobertura aunque todo pase** → el gate es global y solo
  corrió una parte → `--coverage=false` para un archivo; el gate se mide con `pnpm test`
  completo.
- **El test pasa pero el bug estaba** → el mock entrega el dato desde el primer render → para
  bugs de "dato que llega después": `jest.fn()`/`vi.fn()` con `mockReturnValue` vacío, `rerender`
  con el dato y recién ahí el `expect`.
- **`tsc` no encuentra `describe`/`jest` aunque `@types/jest` está instalado** → TypeScript 6
  ya no incluye automáticamente todo `node_modules/@types` → `"types": ["jest"]` en el
  `tsconfig.json` (el script lo agrega). Con Vitest no hace falta: se importa de `vitest`.
- **`toLocaleString("es")` no pone punto en 1500** → en español los números de 4 cifras no se
  agrupan (`minimumGroupingDigits: 2`) → 15000 → "15.000".

## Herramientas

- **Biome dice "Checked 1 file" y no revisa lo que pediste** → la ruta está en el `.gitignore`
  (`useIgnoreFile: true`); por ejemplo, una entrada `example` → `biome check --verbose` muestra
  "provided but ignored".
- **Error de tipos en rutas que no tocaste** (`"/x" is not assignable…`) → tipos de rutas de
  Expo Router viejos → `pnpm start` una vez (regenera `.expo/types`).
- **El cambio no aparece en el celular** (Fast Refresh no aplicó) → `adb reverse tcp:8081
  tcp:8081`, `adb shell am force-stop <paquete>` y reabrir el dev client. En frío aparece la
  splash antes del deep link.
- **"unexpected end of stream on localhost"** → Metro está parado → `pnpm start`.

## Proyecto nuevo

- **`create-next-app` / `create-expo-app` ya traen un `AGENTS.md`** (Next lo re-agrega en cada
  `next dev`) → no lo reemplaces: el script agrega nuestras reglas debajo.
- **Biome falla en el código de ejemplo del template** (`page.tsx` de Next con `max-w-[…]`,
  `explore.tsx` de Expo con texto suelto) → reemplaza la página de Next; en Expo, corre
  `pnpm run reset-project` antes del script.
- **`pnpm` corta con `ERR_PNPM_IGNORED_BUILDS`** → pnpm 11 bloquea los scripts de build de las
  dependencias → `pnpm approve-builds` (Uniwind necesita `@parcel/watcher`); queda en
  `allowBuilds` del `pnpm-workspace.yaml`.
- **`tsc` rechaza `import "@/global.css"` en Expo** → el `expo-env.d.ts` generado está en el
  `.gitignore` → `src/types/expo.d.ts` con `/// <reference types="expo/types" />`.
- **La config de Biome da "unknown key"** después de actualizar → las reglas `nursery` cambian
  de nombre entre versiones menores (`useSortedClasses` → `useTailwindSortedClasses` en 2.6) →
  fija la versión exacta (`pnpm add -D -E @biomejs/biome@x.y.z`) y actualízala a propósito.
- **Biome 2.6 reformatea los `.md`** → excluye `**/*.md` en `files.includes` si no quieres que
  toque los docs ni el bloque de Next en `AGENTS.md`.
- **Metro da `ENOSPC`** → vigila los worktrees de Claude Code (`.claude/worktrees`, cada uno con
  su `node_modules`) → `blockList` en `metro.config.js` (ya viene en la plantilla).

## Git y PR

- **El rebase para con "untracked working tree file would be overwritten"** → un plan sin
  trackear que commits viejos sí tocaban → sácalo de la carpeta, rebasea y restáuralo.
- **Conflicto en un doc de pendientes después del rebase** → otra rama agregó su entrada en el
  mismo lugar → quédate con las dos entradas y saca solo lo que tu rama cerró.
- **Commits firmados con el email equivocado** → `user.email` global del trabajo → en repos
  personales, `git config user.email <id>+<usuario>@users.noreply.github.com` solo en ese repo;
  si no hiciste push, `git commit --amend --reset-author --no-edit`.

## Figma

- **El PNG exportado corta la pantalla** → el frame tiene "clip content" → `get_design_context`
  con `forceCode` trae el frame entero (gasta 1 llamada del MCP).
- **El MCP no encuentra la pantalla** → `get_metadata` sin node ID solo ve la página actual →
  siempre pide por node ID.
- **El nombre del frame no coincide con el contenido** → error del archivo de diseño → anótalo
  en `docs/figma-divergencias.md` y pregunta; no implementes sobre el frame equivocado.

## Dispositivo (adb)

- **Probando por adb se borró un elemento sin querer** → con la hoja de confirmación abierta,
  `uiautomator` sigue listando el botón "Excluir" de la pantalla de atrás, y tocar sus
  coordenadas cae en el botón de confirmar de la hoja → cierra la hoja antes de tocar la
  pantalla de atrás y saca las coordenadas de un dump hecho con la hoja abierta.
- **`adb devices` no muestra el celular en WSL** → el adb de Windows y el de WSL tienen listas
  separadas → `adb connect` desde el mismo lado donde corres los comandos.
