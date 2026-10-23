import type { ExampleItem } from "../domain/example-item";
import { exampleItems } from "../mocks";

export type ExampleList = { isLoading: boolean; items: ExampleItem[]; total: number };

// El hook elige la fuente: hoy el mock, mañana el banco (useLiveQuery) o la red (TanStack
// Query) sin que la pantalla cambie. Mantén el formato: isLoading separa "todavía no sé" de
// "no hay nada" (useLiveQuery empieza con data vacío y updatedAt undefined).
export function useExampleList(): ExampleList {
	return { isLoading: false, items: exampleItems, total: exampleItems.length };
}
