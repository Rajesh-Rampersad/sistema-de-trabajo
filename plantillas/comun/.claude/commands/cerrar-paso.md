---
description: Cierra el paso actual con commit y actualiza el Estado del plan
argument-hint: "[resumen del paso, opcional]"
---

Cierra el paso que acabamos de terminar. Resumen del paso: `$ARGUMENTS` (si viene vacío,
dedúcelo del diff y del plan).

1. Verifica antes de commitear: `pnpm check`, `pnpm typecheck` y los tests de lo tocado. Si algo
   falla, para y dime qué; no uses `--no-verify` nunca.
2. Pregúntame si ya lo vimos en el dispositivo o navegador. Si no, ofrece hacerlo (captura de
   pantalla) antes del commit.
3. Commit chico, solo con los archivos de este paso. Mensaje en el idioma del equipo
   (`AGENTS.md`), imperativo, con alcance (`<feature>: <qué>`) y un cuerpo con el **porqué**.
   Agrega las líneas de atribución que pida el entorno. Muéstrame el comando.
4. Actualiza la sección **Estado** del plan de la historia: pasa el paso a "Hecho" con el hash y
   cómo se verificó, reordena "Falta" y agrega a "En el PR" lo que el revisor tenga que saber
   (desvío del Figma, algo fuera de la historia). Actualiza la fecha del Estado.
5. Si el plan está trackeado en la rama, va en un commit `docs: plano/plan …` aparte.
6. **No hagas push** salvo que te lo pida. Si te lo pido: push normal (el pre-push corre los
   tests); `--force-with-lease` solo con mi confirmación explícita.
