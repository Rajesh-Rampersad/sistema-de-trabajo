import type { ExampleItem } from "./domain/example-item";

// Dato fake con los valores del Figma. Solo lo importa data/: la pantalla nunca.
export const exampleItems: ExampleItem[] = [
	{ id: "a", title: "Primer elemento", createdAt: "2026-10-14T09:45:00-03:00", isFavorite: true },
	{ id: "b", title: "Segundo elemento", createdAt: "2026-10-13T18:10:00-03:00", isFavorite: false },
];
