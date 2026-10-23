# Decisiones

Cada entrada: **decisión** — por qué — alternativa descartada. Quién decidió y cuándo, si no es
obvio. ❓ = depende de confirmación externa (diseño, cliente, regulación).

## Stack

- **<Framework y versión>.** <Por qué.> — <Alternativa descartada.>
- **<Lib de estilo>.** <Por qué.> — <Alternativa descartada.>

## Arquitectura

| Papel | Lib |
|---|---|
| Dato remoto | <TanStack Query / Server Components> |
| Dato con filas | <Drizzle + SQLite / Postgres> |
| Estado global | <Zustand> |
| Validación de contrato | <zod> |

## Diferencias con el Figma (a propósito)

- **<Qué hace el código>**, no <lo que muestra el Figma>: <requisito o razón>. ❓ <pregunta
  abierta, si la hay>.
