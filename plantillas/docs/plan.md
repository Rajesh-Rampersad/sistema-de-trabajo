# Plan: <historia en una línea>

<Historia NNN "<título>" (<link al tracker>). Cards <NN, NN>. Spec, si la hay: `<ruta>`.>

## Rama

`feat/<flujo>-<cosa>`, desde `main` en `<hash>`. PR <número> (borrador): <link>.

## Estado (<AAAA-MM-DD>)

**Hecho** (rama pusheada hasta `<hash>`):
- Paso N `<hash>`: <qué quedó y cómo se verificó (test, celular, navegador)>.

**Falta**, en este orden:
1. **Paso N** (`<archivo>`): <qué y por qué>.
2. …

**En el PR** (avisos para el revisor): <desvíos del Figma, cosas fuera de la historia, frases
jurídicas, animaciones que no respetan "reducir animaciones", dependencias nativas nuevas>.

### Retomar en otra máquina

```bash
git fetch origin && git switch <rama> && git pull
pnpm install
pnpm start            # o: pnpm dev
```

- Ambiente: <dispositivo, seed, cuentas, login del tracker (`az login --allow-no-subscriptions`),
  conector de Figma y llamadas usadas>.
- Trampas conocidas: <lo que costó una hora y no está en ningún otro lado>.

### Preguntas para <diseño/PO>

1. <pregunta> (bloquea el paso N).

## Pasos

1. **Leer los cards** (`docs/figma.md`): medidas, textos, estados, comportamiento.
2. **Dato**: schema/migration o contrato; seed de desarrollo.
3. **Dominio** (`domain/`): tipos y funciones puras con `it.each`, 100% de branch.
4. **Consulta** (`data/`): recibe la conexión por parámetro; test con banco en memoria.
5. **Hook / función de datos** (`data/`): estados de carga, vacío, encontrado.
6. **Componentes** por bloque del Figma.
7. **Pantalla**: estados + test de pantalla (un test por mecanismo).
8. **Docs**: `telas.md` (status), `decisoes.md` (desvíos).
9. **Verificar**: `check && typecheck && test && bundle/build`; dispositivo o navegador contra el
   card, todos los estados. Rebase, push, PR.

## Qué se aprende aquí

- <concepto 1: p. ej. por qué el filtro va en la URL>.
- <concepto 2>.
