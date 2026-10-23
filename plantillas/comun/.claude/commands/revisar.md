---
description: Revisa lo que escribí (diff, linter, tipos y tests) sin corregirlo por mí
argument-hint: "[archivo o carpeta, opcional]"
---

Revisa el código que escribí en este paso. Alcance: `$ARGUMENTS` si viene; si no, todo lo que
cambió desde el último commit (`git diff HEAD` + archivos sin trackear relevantes).

1. Corre y muestra el resultado resumido de:
   - `git diff HEAD -- <alcance>`
   - `pnpm biome check <archivos cambiados>`
   - `pnpm typecheck`
   - los tests de los archivos tocados, con `--coverage=false` (con un gate de cobertura global,
     un test suelto da un rojo falso)
2. Si algo falla, explica **la causa**, no solo el mensaje: qué asumí mal y cuál es el concepto
   detrás. Agrupa los errores que tienen la misma causa.
3. Aunque todo pase, revisa contra el `AGENTS.md`: reglas de dependencia, solo tokens,
   accesibilidad (role, label, 44 px), comentario con el frame del Figma, nombres. Y revisa si
   los tests cubren el bug que motivó el cambio: si no lo habrían detectado, dilo.
4. **No corrijas el código.** Dame la siguiente pista en orden (dirección → estructura →
   fragmento). La solución completa, solo si te la pido.
5. Si todo está bien, dilo en una línea y propone el siguiente paso: verificar en el dispositivo
   o navegador, y después `/cerrar-paso`.
