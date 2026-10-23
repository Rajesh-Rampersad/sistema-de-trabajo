# Sistema de trabajo

Cómo trabajo en proyectos de app con diseño en Figma, listo para repetirlo en proyectos nuevos
de **React Native (Expo)** y **Next.js**: diseño en Figma → tarea en el tracker (Azure DevOps,
GitHub) → plan con estado → código guiado → verificación en el dispositivo → PR.

```
sistema-de-trabajo/
  README.md                       esta guía
  lecciones.md                    síntoma → causa → qué hacer, de lo que ya costó tiempo
  nuevo-proyecto.sh               aplica todo a un proyecto recién creado
  plantillas/
    AGENTS.react-native.md        reglas del repo para Expo (va a AGENTS.md)
    AGENTS.nextjs.md              reglas del repo para Next.js (va a AGENTS.md)
    CLAUDE.md                     una línea: @AGENTS.md
    claude-usuario.md             modo de trabajo con Claude (va a ~/.claude/CLAUDE.md)
    docs/                         telas, decisoes, figma, plan, checklist-pantalla, pr
    comun/
      .husky/                     pre-commit (lint-staged + typecheck), pre-push (test)
      biome-plugins/              no-raw-values.grit: bloquea p-[12px], bg-[#fff]
      .claude/commands/           /retomar, /revisar, /cerrar-paso, /pr
    react-native/                 biome.json, jest, metro (Uniwind), tokens, molde
    nextjs/                       biome.json, vitest, tokens, molde
```

## Empezar un proyecto

Probado el 2026-10-23 con Expo SDK 58 y Next.js 16.4 (pnpm 11, Biome 2.6.2, TypeScript 6).

### React Native (Expo)

```bash
pnpm dlx create-expo-app@latest mi-app && cd mi-app
pnpm run reset-project               # responde "n": borra el ejemplo del template
~/sistema-de-trabajo/nuevo-proyecto.sh react-native .
# y sigue las instrucciones que imprime: dependencias, import "@/global.css" en el _layout,
# pnpm bundle (genera los tipos de Uniwind), pnpm check:fix && pnpm typecheck && pnpm test
```

### Next.js

```bash
pnpm dlx create-next-app@latest mi-web --ts --tailwind --app --src-dir --use-pnpm \
  --import-alias "@/*" --no-eslint
cd mi-web
~/sistema-de-trabajo/nuevo-proyecto.sh nextjs .
# y sigue las instrucciones: dependencias, @import del tokens.css en globals.css, reemplazar
# src/app/page.tsx del template, pnpm check:fix && pnpm typecheck && pnpm test && pnpm build
```

Qué hace el script:
- Copia las plantillas **sin pisar nada**; al final lista lo que ya existía, para que lo
  compares a mano.
- Si el template ya trae `AGENTS.md` (Next.js 16 y Expo 58 traen uno), agrega nuestras reglas
  **debajo**, una sola vez.
- Agrega a `package.json` los scripts (`check`, `typecheck`, `test`, `bundle`/`build`, `prepare`)
  y `lint-staged`, y a `tsconfig.json` el alias `@/`, `strict`, `noUncheckedIndexedAccess` y
  los tipos de jest en RN. Nunca cambia lo que ya existe, y solo escribe si agrega algo.
- `--sin-molde` omite la feature de ejemplo.

Después:
1. Completa los `<…>` del `AGENTS.md` (nombre, idioma del equipo, revisor).
2. Reemplaza los valores de ejemplo de `tokens.css` por las variables del Figma.
3. Copia el molde `src/features/example` para tu primera feature y borra el ejemplo (y la ruta
   `/ejemplo`).
4. Una vez por máquina: `cat plantillas/claude-usuario.md >> ~/.claude/CLAUDE.md`.

## Las piezas

### 1. El repo explica sus reglas (`AGENTS.md`)

Estructura por feature (`domain/` puro, `data/` con el I/O, `components/` por bloque del Figma,
`screens/` con los estados), dónde vive cada tipo de estado, solo tokens, accesibilidad, tests y
qué tiene que pasar antes del PR. `CLAUDE.md` solo lo importa, así Claude Code y otros agentes
leen lo mismo.

Las reglas que se pueden verificar no se quedan en el texto: `biome.json` bloquea los imports
entre features que no van por `index.ts`, que `domain/` importe React o I/O, y que `shared/`
importe `features/`; el plugin `no-raw-values.grit` bloquea valores sueltos en `className`.

### 2. Los docs mapean el diseño al código

- `docs/telas.md`: cada card del Figma con node ID, ruta, estados y status.
- `docs/decisoes.md`: cada desvío del Figma o de la spec, con el porqué.
- `docs/figma.md`: cómo leer el Figma sin gastar la cuota del MCP, y registro de llamadas.
- `docs/checklist-pantalla.md`: lo que se revisa antes de marcar un card como `feito`.
- `docs/pr.md`: plantilla de descripción de PR (Hecho, Falta, Para el revisor, Avisos).

### 3. Cada historia tiene un plan que se puede retomar

`docs/superpowers/plans/<fecha>-<historia>.md`, desde `_plantilla.md`. Lo importante es la
sección **Estado**: Hecho (con hashes), Falta (en orden), En el PR y "Retomar en otra máquina".
La memoria de Claude no viaja entre máquinas; el plan sí, mientras esté en la rama. Antes de
publicar el PR sale del repo (`git rm --cached`) y queda local.

### 4. El molde

`src/features/example` en cada stack: el formato de una feature con lo que costó aprender.

| | React Native | Next.js |
|---|---|---|
| Dato | hook `useExampleList` con `isLoading` | `getExampleList()` en el servidor |
| Estados | del dato + `StateSwitcher` en dev (`useScreenState`) | `loading.tsx`, `error.tsx`, vacío en la pantalla |
| Estado local | override de favoritos (`Map`) + dato | igual, en el componente de cliente |
| Tests | pantalla (carga, vacío, dato que llega después, toggle) + `it.each` | componente de cliente + `it.each` |

### 5. El ciclo de cada paso (y sus comandos)

| Momento | Qué pasa | Comando |
|---|---|---|
| Empezar el día / otra máquina | dónde quedamos y qué sigue | `/retomar` |
| Concepto y tarea | Claude explica con `archivo:línea` del repo y plantea la tarea | — |
| Escribir | lo escribes tú; pistas graduales si las pides | — |
| Revisar | diff + linter + tipos + tests; la causa, no solo el error | `/revisar` |
| Verificar | celular (adb) o navegador, captura contra el Figma | — |
| Cerrar | commit con el porqué + Estado del plan | `/cerrar-paso` |
| Entregar | descripción del PR; rebase y publicar con confirmación | `/pr` |

## Reglas de git

- Rama `feat/<flujo>-<cosa>`, `fix/…`, `docs/…`. Nunca trabajar en `main`.
- Commit en imperativo con alcance (`historial: barra de paginación`) y cuerpo con el porqué.
- **Nunca `--no-verify`.** Si el hook falla, se arregla la causa.
- `--force-with-lease` solo después del rebase y con confirmación explícita.
- Después del rebase, todo de nuevo: `check && typecheck && test && bundle/build`.
- El PR nace en borrador y sale de borrador cuando "Falta" está vacío o pasó a otro PR.
- En repos personales, el email noreply de GitHub solo en ese repo:
  `git config user.email <id>+<usuario>@users.noreply.github.com`.

## Verificar en el dispositivo (React Native)

```bash
adb pair <ip>:<puerto-del-diálogo> <código>     # una vez por PC
adb connect <ip>:<puerto>                       # cada vez que se cae el Wi-Fi
adb reverse tcp:8081 tcp:8081
adb shell am start -W -a android.intent.action.VIEW -d "<esquema>://<ruta>" <paquete>
adb exec-out screencap -p > captura.png
adb shell input swipe 540 1500 540 800 800      # deslizar desde el medio
adb exec-out uiautomator dump /dev/tty | grep -o 'text="[^"]*"'   # textos en pantalla
adb shell pm clear <paquete>                    # borra datos (vuelve el seed/onboarding)
```

## Verificar en el navegador (Next.js)

```bash
pnpm dev
pnpm exec playwright screenshot --viewport-size=390,844 http://localhost:3000/<ruta> captura.png
```

Revisar en 390 px (el móvil del Figma) y en el ancho de escritorio del diseño.

## Mantener el sistema

- Algo costó más de media hora → una entrada en `lecciones.md`.
- Una regla se repite en revisiones → pasa al `AGENTS.md` de plantilla y, si se puede, a
  `biome.json`.
- Actualizar Biome → fija la versión nueva en `nuevo-proyecto.sh` y prueba el script con un
  proyecto recién creado de cada stack (las reglas `nursery` cambian de nombre).
