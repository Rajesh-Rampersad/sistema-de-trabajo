import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ExampleList } from "../data/use-example-list";
import { useExampleList } from "../data/use-example-list";
import { ExampleScreen } from "./example-screen";

// La pantalla recibe el dato por el hook de data/: el test fija lo que el hook entrega.
// Un test por mecanismo, no un inventario de textos.
jest.mock("../data/use-example-list", () => ({ useExampleList: jest.fn() }));
const mockUseExampleList = jest.mocked(useExampleList);

const loaded: ExampleList = {
	isLoading: false,
	total: 2,
	items: [
		{ id: "a", title: "Uno", createdAt: "2026-10-14T09:45:00-03:00", isFavorite: true },
		{ id: "b", title: "Dos", createdAt: "2026-10-13T18:10:00-03:00", isFavorite: false },
	],
};
const loading: ExampleList = { isLoading: true, items: [], total: 0 };

describe("ejemplo (cards NN–NN)", () => {
	it("mientras el dato no llega, muestra la carga y no el vacío", async () => {
		mockUseExampleList.mockReturnValue(loading);
		await render(<ExampleScreen />);

		expect(screen.getByLabelText("Cargando")).toBeOnTheScreen();
		expect(screen.queryByText("Ningún elemento")).not.toBeOnTheScreen();
	});

	it("sin elementos, muestra el vacío", async () => {
		mockUseExampleList.mockReturnValue({ isLoading: false, items: [], total: 0 });
		await render(<ExampleScreen />);

		expect(screen.getByText("Ningún elemento")).toBeOnTheScreen();
	});

	it("el favorito del dato aparece aunque llegue después del primer render", async () => {
		mockUseExampleList.mockReturnValue(loading);
		await render(<ExampleScreen />);

		mockUseExampleList.mockReturnValue(loaded);
		await screen.rerender(<ExampleScreen />);

		expect(screen.getAllByText("Favorito")).toHaveLength(1);
	});

	it("favoritar cambia solo esa tarjeta", async () => {
		mockUseExampleList.mockReturnValue(loaded);
		await render(<ExampleScreen />);

		await fireEvent.press(screen.getByText("Favoritar"));

		expect(screen.getAllByText("Favorito")).toHaveLength(2);
	});
});
