import { ExampleList } from "../components/example-list";
import { getExampleList } from "../data/get-example-list";
import { formatTotal } from "../domain/format-total";

// Pantalla molde (Server Component): cards NN (default) y NN (empty). La carga es el
// loading.tsx de la ruta y el error, el error.tsx; el vacío es un estado de esta pantalla.
export async function ExampleScreen() {
	const { items, total } = await getExampleList();

	return (
		<main className="min-h-dvh bg-surface-page p-md">
			<section className="rounded-xl bg-surface-card p-md">
				<h1 className="heading-page text-text-primary">Ejemplo</h1>
				<p className="body text-text-tertiary">{formatTotal(total)}</p>
				{total > 0 && <ExampleList items={items} />}
			</section>
		</main>
	);
}
