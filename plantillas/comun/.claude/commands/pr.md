---
description: Prepara o actualiza la descripción del PR (Hecho, Falta, Revisor, Avisos)
argument-hint: "[número del PR, opcional]"
---

Prepara la descripción del PR de esta rama. PR: `$ARGUMENTS` si viene; si no, búscalo por la
rama (`gh pr view` o `az repos pr list --source-branch <rama>`).

1. Fuentes: el Estado del plan, `git log origin/main..HEAD` y la descripción actual del PR, si
   existe (léela antes de reescribirla, para no perder lo que agregó otra persona).
2. Usa la plantilla `docs/pr.md`, en el idioma del equipo. Secciones: resumen en una línea (y si
   es parcial, qué queda afuera y dónde va), **Hecho**, **Falta** (o "va en otro PR"), **Para
   el revisor** (desvíos del Figma con el porqué, cosas fuera de la historia, preguntas
   abiertas), **Avisos** (frases con efecto jurídico, animaciones que no respetan "reducir
   animaciones", dependencias nativas nuevas, migrations, cómo se verificó).
3. Escríbela en un archivo temporal y muéstramela antes de publicar.
4. Publica solo con mi OK, mostrando el comando:
   - GitHub: `gh pr create --draft --title … --body-file …` o `gh pr edit <n> --body-file …`
   - Azure DevOps: `az repos pr update --id <n> --description "$(cat …)"`
5. Sacar de borrador (`gh pr ready` / `--draft false`), rebase y `--force-with-lease`: cada uno
   con confirmación explícita, después de que `check && typecheck && test && bundle/build`
   pasen sobre `origin/main`.
