# <NOMBRE DEL APP>

App React Native (Expo) de <CLIENTE>. Fase actual: <p. ej. "pantallas del Figma con dato fake">.
Spec: `docs/superpowers/specs/<fecha>-<tema>.md`.

- Implementando una pantalla: empieza por `docs/telas.md` (card del Figma → ruta → estados).
- Leyendo el Figma (medida, color, texto, comportamiento): `docs/figma.md`.
- Por qué la stack es esta: `docs/decisoes.md`.

**Idioma:** identificadores en inglés; texto de UI, comentarios, commits y PR en <IDIOMA DEL
EQUIPO>. Revisor de diseño/PR: <NOMBRE>.

## Expo cambia en cada SDK

Antes de usar una API de Expo/React Native, lee la doc de la versión del `expo` del
`package.json` (`https://docs.expo.dev/versions/v<major>.0.0/`) o `https://docs.expo.dev/llms.txt`.
Dependencia nueva: `npx expo install <paquete>`. Si tiene código nativo, el APK se rehace:
avisa en el PR. `ios/` y `android/` son generados (CNG); la configuración nativa va en `app.json`.

## El objetivo es el development build

El app corre en un development build (`expo-dev-client`). Pasos en `docs/development-build.md`.

## Estructura

```
src/app/                      rutas (Expo Router): solo parámetro, stackOptions y la pantalla
src/features/<feature>/
  index.ts                    API pública: lo único que otra feature o ruta importa
  domain/                     funciones puras; sin React, sin RN, sin I/O
  data/                       I/O: red, banco, archivo, kv; hooks de dato
  components/                 bloques de la pantalla, con el nombre del frame del Figma en comentario
  screens/                    la pantalla entera (estados + StateSwitcher), una por ruta
  mocks.ts                    dato fake de la feature
src/shared/                   ui/ layout/ common/ feedback/ db/ kv/ lib/
src/global.css                tokens del Figma (@theme) y estilos de texto (@utility)
assets/                       icons/, logos/, illustrations/ exportados del Figma
```

## Reglas de dependencia

1. Una feature importa otra **solo por el `index.ts`**; dentro de la feature, import relativo.
2. `domain/` no importa React, React Native, `data/` ni libs de I/O.
3. Solo `data/` habla con red, banco, archivo, kv y módulo nativo. Componente y pantalla reciben
   el dato por hook.
4. **La pantalla nunca importa `mocks.ts`**: el hook de `data/` elige la fuente.
5. `shared/` no importa `features/`.

Las reglas 1, 2 y 5 son `noRestrictedImports` en `biome.json`.

## Estado

| Estado | Dónde |
|---|---|
| Preferencia que sobrevive al reinicio | store Zustand con `persist` |
| Estado de sesión que cruza pantallas | store Zustand sin `persist` |
| Dato con filas y consultas | Drizzle + `useLiveQuery` (consulta recibe `Database`, test con banco en memoria) |
| Dato remoto | TanStack Query |
| Filtro de pantalla | parámetro de URL |
| Estado de una sola pantalla | `useState` |

- `useLiveQuery` empieza con `data` vacío y `updatedAt` undefined: el hook expone `isLoading`
  para no confundir "todavía no sé" con "no hay nada".
- No copies a `useState` un valor que viene del banco: guarda solo lo que el usuario cambió
  (override) y combínalo con el banco en el render.
- Columna nueva: edita el `schema.ts`, genera la migration con la herramienta (nunca a mano).

## Pantallas

- **Ruta fina** en `src/app/`: lee el parámetro y renderiza la pantalla de la feature.
- **Estados** (loading, offline, vacío, error) son estados de la misma pantalla, no rutas. El
  estado sale del dato; un `StateSwitcher` solo de desarrollo permite revisar cada card.
- **Un componente por bloque del Figma**, con el nombre del frame en un comentario
  (`// Figma: <frame> (card NN)`).
- Safe area resuelta en el layout; la pantalla no suma insets.

## Estilo: solo tokens

- Clases que salen de `src/global.css`, con el nombre del Figma: color (`text-text-primary`),
  espacio y radio (`p-md`, `rounded-lg`), texto (**un estilo tipográfico por `<Text>`**).
- Un valor suelto (`bg-[#fff]`, `p-[12px]`) rompe el `pnpm check`. Si el Figma tiene una medida
  sin token, agrégala a `global.css` con el nombre del Figma y avísalo en el PR.
- `className` solo funciona en componentes RN y en los de `ui/`; los de otra lib lo ignoran en
  silencio.

## Nomenclatura

| Qué | Patrón | Ejemplo |
|---|---|---|
| Ruta | idioma del equipo, kebab-case, espeja el card | `historico/filtros.tsx` |
| Archivo fuera de ruta | inglés, kebab-case | `history-card.tsx` |
| Componente | PascalCase, export nombrado (default solo en ruta) | `export function HistoryCard` |
| Hook | `use` + camelCase | `useHistoryList` |
| Evento | prop `on*`, handler `handle*` | `onPress={handleToggleFavorite}` |
| Booleano | `is` / `has` / `can` | `isFavorite` |
| Rama | `feat/<flujo>-<cosa>` | `feat/historico-filtros` |
| Commit | imperativo, alcance opcional | `historico: barra de paginação` |

## Accesibilidad

Todo `Pressable` tiene `accessibilityRole` y, si el texto no alcanza, `accessibilityLabel`.
Área táctil mínima de 44 px (`min-h-11 min-w-11`), aunque el Figma dibuje menos (avísalo en el PR).
Animaciones con Reanimated; respeta "Reducir animaciones". Lo que no la respete, avísalo en el PR.

## Tests

`pnpm test` (jest-expo + Testing Library, `TZ=UTC`).
- Regla pura: `*.test.ts` al lado, tabla de casos (`it.each`), tiempo fijo. Gate de 100% de
  branch en `src/features/*/domain/**`.
- Pantalla: un test por mecanismo (conecta el hook, muestra el estado), mockeando el hook de
  `data/`. Sin tests de inventario.
- Consulta de banco: banco en memoria con las migrations del app.

## Antes del PR

`pre-commit`: Biome sobre los staged + `pnpm typecheck`. `pre-push`: `pnpm test`.

`pnpm check && pnpm typecheck && pnpm test && pnpm bundle` en verde, pantalla revisada en el
development build contra el card (todos los estados), status actualizado en `docs/telas.md`.
Nunca `--no-verify`.
