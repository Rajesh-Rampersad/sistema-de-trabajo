"use client";

import { useState } from "react";
import type { ExampleItem } from "../domain/example-item";

type ExampleListProps = { items: ExampleItem[] };

// Figma: <feature>/<bloque> (card NN). Componente de cliente solo porque tiene estado: el dato
// llega del Server Component por prop. Guarda solo lo que el usuario tocó; el resto viene del
// dato (copiarlo a useState lo congelaría en el primer render). Para persistir, una Server
// Action en data/ + revalidatePath.
export function ExampleList({ items }: ExampleListProps) {
	const [favoriteOverrides, setFavoriteOverrides] = useState<Map<string, boolean>>(() => new Map());
	const isFavorite = (item: ExampleItem) => favoriteOverrides.get(item.id) ?? item.isFavorite;
	const handleToggleFavorite = (item: ExampleItem) => {
		setFavoriteOverrides((current) => new Map(current).set(item.id, !isFavorite(item)));
	};

	return (
		<ul>
			{items.map((item) => (
				<li
					key={item.id}
					className="flex items-center justify-between border-border-global border-b py-md"
				>
					<span className="heading-section text-text-primary">{item.title}</span>
					<button
						type="button"
						onClick={() => handleToggleFavorite(item)}
						aria-pressed={isFavorite(item)}
						aria-label={`Favorito: ${item.title}`}
						className="label-action min-h-11 min-w-11 text-text-accent"
					>
						{isFavorite(item) ? "Favorito" : "Favoritar"}
					</button>
				</li>
			))}
		</ul>
	);
}
