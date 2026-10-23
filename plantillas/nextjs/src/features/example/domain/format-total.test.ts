import { describe, expect, it } from "vitest";
import { formatTotal } from "./format-total";

// El describe cita el requisito o el card que la regla implementa
describe("card NN: total de la lista", () => {
	it.each([
		["sin elementos", 0, "Ningún elemento"],
		["singular", 1, "1 elemento"],
		["plural", 2, "2 elementos"],
		["con separador de miles", 15000, "15.000 elementos"],
	])("%s", (_, total, expected) => {
		expect(formatTotal(total)).toBe(expected);
	});
});
