<!--
Plantilla de descripción de PR. Se escribe en el idioma del equipo. El comando /pr la completa
a partir del plan y del log. Borra las secciones vacías.
-->

<Una línea: qué entrega este PR. Si es parcial: qué queda afuera y en qué PR va.> (Historia NNN)

## Hecho
- <Bloque o card>: <qué quedó>, <cómo se verificó>.

## Falta / va en otro PR
- <Qué>, <por qué espera> (<de quién depende>).

## Para el revisor
- <Desvío del Figma>: <qué hace el código> en vez de <lo del Figma>, porque <requisito/razón>.
- <Algo fuera de la historia que entró>: <por qué>.
- <Pregunta abierta para diseño/PO>.

## Avisos
- Frases con efecto jurídico, copiadas tal cual: "<texto>".
- Animaciones que no respetan "reducir animaciones": <cuáles>.
- Dependencia con código nativo / migration de banco: <cuál> (hay que rehacer el build: sí/no).
- Verificado: `check && typecheck && test && bundle/build` en verde sobre `origin/main`;
  <dispositivo/navegador> con <casos probados>.
