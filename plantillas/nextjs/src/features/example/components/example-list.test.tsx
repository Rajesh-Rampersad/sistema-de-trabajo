import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ExampleItem } from "../domain/example-item";
import { ExampleList } from "./example-list";

const items: ExampleItem[] = [
	{ id: "a", title: "Uno", createdAt: "2026-10-14T09:45:00-03:00", isFavorite: true },
	{ id: "b", title: "Dos", createdAt: "2026-10-13T18:10:00-03:00", isFavorite: false },
];

// Un test por mecanismo, no un inventario de textos
describe("ejemplo (card NN): favoritos", () => {
	it("el favorito del dato aparece aunque llegue después del primer render", () => {
		const { rerender } = render(<ExampleList items={[]} />);

		rerender(<ExampleList items={items} />);

		expect(screen.getAllByText("Favorito")).toHaveLength(1);
	});

	it("favoritar cambia solo esa fila", () => {
		render(<ExampleList items={items} />);

		fireEvent.click(screen.getByRole("button", { name: "Favorito: Dos" }));

		expect(screen.getByRole("button", { name: "Favorito: Dos" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(screen.getAllByText("Favorito")).toHaveLength(2);
	});
});
