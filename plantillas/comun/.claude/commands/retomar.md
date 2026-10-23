---
description: Retoma la historia en curso desde el Estado del plan y propone el siguiente paso
argument-hint: "[ruta del plan, opcional]"
---

Retoma el trabajo de la historia en curso.

1. Plan: usa `$ARGUMENTS` si viene; si no, el `.md` más reciente de `docs/superpowers/plans/`
   (sin contar `_plantilla.md`). Lee la sección **Estado** completa: Hecho, Falta, En el PR y
   "Retomar en otra máquina".
2. Repo: `git fetch`, `git status -sb`, `git log --oneline -10` y cuántos commits hay de
   diferencia con `origin/main`. Si la rama local está atrás de la remota, propón `git pull`
   antes de nada.
3. Ambiente: revisa lo que pide "Retomar en otra máquina" (dependencias instaladas, Metro o
   `pnpm dev`, dispositivo conectado, login del tracker). Solo dime lo que falta; no lo
   arregles sin preguntar.
4. Contrasta el plan con el repo: si un hash de "Hecho" no existe o hay commits que el plan no
   menciona, avísame.
5. Resume en pocas líneas: dónde quedamos, qué sigue (el primer punto de "Falta") y qué está
   bloqueado y por quién.
6. Para el siguiente paso, sigue el modo "guiar, no codear": explícame el concepto con
   referencias `archivo:línea` del repo, plantea la tarea y deja las pistas graduales para
   cuando las pida. No escribas el código.
