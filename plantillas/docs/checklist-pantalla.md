# Checklist de pantalla

Antes de marcar un card como `feito` en `telas.md`. Copia la lista en el plan o en el PR y tacha.

## Diseño

- [ ] Comparada con el card en el dispositivo o navegador (captura al lado del PNG del Figma),
      en el ancho del Figma (390 px en móvil).
- [ ] **Todos los estados** del card: default, loading, vacío, error, offline (con el
      `StateSwitcher` en RN; con `loading.tsx`, `error.tsx` y datos vacíos en Next.js).
- [ ] El estado sale del dato, no solo del switcher: con el dato real cargando, se ve la carga
      y no el vacío.
- [ ] Textos del requisito o microcopy; si difieren del Figma, anotado en `decisoes.md`.
- [ ] Un componente por bloque del Figma, con el nombre del frame en un comentario.

## Estilo

- [ ] Solo tokens (`pnpm check` sin "valor suelto"); medida nueva agregada con el nombre del
      Figma y avisada en el PR.
- [ ] Un estilo tipográfico por texto, más una clase de color.

## Accesibilidad

- [ ] Todo lo que se toca tiene rol y nombre (`accessibilityRole`/`accessibilityLabel` en RN;
      `button`/`a` con texto o `aria-label` en web).
- [ ] Área táctil ≥ 44 px, aunque el Figma dibuje menos (avisado en el PR).
- [ ] Estado comunicado: seleccionado, deshabilitado, presionado (`accessibilityState` /
      `aria-pressed`, `aria-current`, `disabled`).
- [ ] El título de la pantalla es encabezado (`accessibilityRole="header"` / `h1`).
- [ ] Animaciones que respetan "reducir animaciones"; las que no, avisadas en el PR.

## Dato y código

- [ ] La pantalla no importa `mocks.ts`; el dato llega por `data/`.
- [ ] Nada copiado del dato a `useState` (override + dato en el render).
- [ ] Lo que depende de una lista que cambia (página, selección) se ajusta si la lista se
      achica (por ejemplo, al borrar el último de la última página).
- [ ] Reglas puras en `domain/` con `it.each` y 100% de branch.
- [ ] Un test de pantalla por mecanismo; el test habría detectado el bug que motivó el cambio.

## Cierre

- [ ] `check && typecheck && test && bundle/build` en verde.
- [ ] `telas.md` actualizado; Estado del plan actualizado.
