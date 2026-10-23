import type { ExampleItem } from "../domain/example-item";
import { exampleItems } from "../mocks";

export type ExampleList = { items: ExampleItem[]; total: number };

// Lectura del lado del servidor: la llama el Server Component de la pantalla. Hoy devuelve el
// mock; mañana el banco o una API, sin que la pantalla cambie. Si usa claves o el banco,
// agrega `import "server-only"` para que nunca llegue a un componente de cliente.
export async function getExampleList(): Promise<ExampleList> {
	return { items: exampleItems, total: exampleItems.length };
}
