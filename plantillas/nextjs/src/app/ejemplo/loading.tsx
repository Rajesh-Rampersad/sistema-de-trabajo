// Card NN (loading): Next lo muestra mientras el Server Component de page.tsx espera el dato
export default function ExampleLoading() {
	return (
		<main className="min-h-dvh bg-surface-page p-md">
			<p role="status" className="body text-text-tertiary">
				Cargando…
			</p>
		</main>
	);
}
