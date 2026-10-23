# Sistema de trabajo

Cómo trabajo en proyectos de app con diseño en Figma, listo para repetirlo en proyectos nuevos
de **React Native (Expo)** y **Next.js**: diseño en Figma → tarea en el tracker (Azure DevOps,
GitHub) → plan con estado → código guiado → verificación en el dispositivo → PR.

```
sistema-de-trabajo/
  README.md                     esta guía
  nuevo-proyecto.sh             copia las plantillas a un proyecto
  plantillas/
    CLAUDE.md                   una línea: @AGENTS.md
    AGENTS.react-native.md      reglas del repo para Expo (se copia como AGENTS.md)
    AGENTS.nextjs.md            reglas del repo para Next.js (se copia como AGENTS.md)
    claude-usuario.md           modo de trabajo con Claude (va en ~/.claude/CLAUDE.md)
    docs/
      telas.md                  card del Figma → ruta → estados → status
      decisoes.md               decisión — por qué — alternativa descartada
      figma.md                  cómo leer el Figma sin gastar la cuota
      plan.md                   plan de una historia, con estado para retomar
```

## Empezar un proyecto

```bash
~/sistema-de-trabajo/nuevo-proyecto.sh react-native ~/mi-app   # o: nextjs ~/mi-web
```

El script no pisa archivos que ya existen. Después:

1. Completar los `<…>` del `AGENTS.md` (nombre, idioma del equipo, revisor, links).
2. Configurar las herramientas (abajo) y commitear todo junto: `chore: base do repo`.
3. Una sola vez por máquina: copiar `plantillas/claude-usuario.md` a `~/.claude/CLAUDE.md`
   (o agregarlo al final si ya existe). Así cualquier proyecto arranca en el modo "guiar, no
   codear".

## Las cuatro piezas

### 1. El repo explica sus reglas (`AGENTS.md`)

Un archivo que cualquier persona o agente lee primero: estructura por feature, regla de
dependencias, dónde vive cada tipo de estado, estilo solo con tokens, cómo se testea, qué hay
que pasar antes del PR. `CLAUDE.md` solo lo importa (`@AGENTS.md`), así Claude Code y otros
agentes leen lo mismo.

Las reglas que se pueden verificar no se quedan en el texto: van al linter (Biome
`noRestrictedImports` para la dependencia entre features, `noDefaultExport`, nombre de archivo
en kebab-case, plugin contra valores sueltos como `p-[12px]`).

### 2. Los docs mapean el diseño al código

- `docs/telas.md`: cada card del Figma con node ID, ruta, estados y status
  (`feito` / `placeholder` / `a criar`). Se actualiza en el mismo PR de la pantalla.
- `docs/decisoes.md`: cada desvío del Figma o de la spec, con el porqué. Evita repetir la
  discusión en cada PR.
- `docs/figma.md`: cómo leer el Figma; exportar PNG no gasta cuota, el MCP sí (seat View
  ≈ 20 llamadas/mes).
- Si el Figma tiene errores de nombre o de vínculo, va un `docs/figma-divergencias.md` para el
  diseño.

### 3. Cada historia tiene un plan que se puede retomar (`docs/plan.md`)

Sale de la plantilla a `docs/superpowers/plans/<fecha>-<historia>.md`. Lo importante es la
sección **Estado** al principio: *Hecho* (con hashes), *Falta* (en orden), *En el PR* (avisos
para el revisor) y *Retomar en otra máquina* (comandos, ambiente, trampas conocidas). La
memoria de Claude no viaja entre máquinas; el plan sí, mientras esté en la rama.

Antes de publicar el PR, el plan sale del repo (`git rm --cached`) y queda local.

### 4. El ciclo de cada paso

1. **Concepto.** Claude explica la idea (por qué falla, qué patrón se usa) con referencias
   `archivo:línea` del propio repo.
2. **Tarea.** Qué cambiar y dónde, sin el código.
3. **Pistas graduales**, en orden: dirección → estructura → fragmento. La solución completa,
   solo si se pide ("hazlo por mí").
4. **Revisión** de lo escrito: `git diff`, linter, `typecheck`, el test del archivo.
5. **Verificación real**: en el celular (RN) o en el navegador (Next.js), con captura de
   pantalla comparada con el Figma.
6. **Commit** chico con un mensaje que explica el porqué; el plan se actualiza.

## Herramientas

| Pieza | React Native (Expo) | Next.js |
|---|---|---|
| Lint + formato | Biome (`pnpm check`) | Biome (`pnpm check`) |
| Tipos | `tsc --noEmit` | `tsc --noEmit` |
| Tests | jest-expo + Testing Library | Vitest + Testing Library; Playwright para e2e |
| Hooks | husky + lint-staged | husky + lint-staged |
| Build de prueba | `expo export` (`pnpm bundle`) | `next build` |
| Ver la pantalla | development build + adb | `pnpm dev` + Playwright o el navegador |
| Estilo | Uniwind (Tailwind v4), tokens en `global.css` | Tailwind v4, tokens en `globals.css` |

Hooks (en `.husky/`):

```sh
# pre-commit
pnpm exec lint-staged
pnpm typecheck
```

```sh
# pre-push
pnpm test
```

`package.json`:

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx,json,jsonc,css}": ["biome check --write --no-errors-on-unmatched"]
}
```

Gate de cobertura: 100% de branch solo en `src/features/*/domain/**` (funciones puras). Con un
gate global, `pnpm test <carpeta>` da un rojo falso: para un solo archivo usar
`--coverage=false`.

## Reglas de git

- Rama `feat/<flujo>-<cosa>`, `fix/…`, `docs/…`. Nunca trabajar en `main`.
- Commit en imperativo con alcance (`historial: barra de paginación`) y un cuerpo con el porqué.
- **Nunca `--no-verify`.** Si el hook falla, se arregla la causa.
- `--force-with-lease` solo después del rebase y con confirmación explícita.
- Rebase sobre `origin/main` antes de publicar; después del rebase se corre todo de nuevo
  (`check && typecheck && test && bundle/build`).
- Rebase con planes sin trackear: los commits viejos que tocan el plan chocan
  ("untracked working tree file would be overwritten"). Sacar el archivo, rebasear y
  restaurarlo.
- El PR nace en borrador con *Hecho / Falta / Avisos* y sale de borrador cuando *Falta* está
  vacío o se movió a otro PR.

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

Cuidados: al abrir en frío puede aparecer la splash antes del deep link; con una hoja (sheet)
abierta, `uiautomator` sigue viendo los botones de atrás, así que tocar sus coordenadas los
activa.

## Verificar en el navegador (Next.js)

```bash
pnpm dev
pnpm exec playwright screenshot --viewport-size=390,844 http://localhost:3000/<ruta> captura.png
```

Revisar en 390 px (el móvil del Figma) y en el ancho de escritorio del diseño.
