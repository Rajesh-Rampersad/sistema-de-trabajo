// Texto del total de la lista. Función pura: sin React, sin I/O, testeada con tabla de casos.
export function formatTotal(total: number): string {
	if (total === 0) return "Ningún elemento";
	if (total === 1) return "1 elemento";
	return `${total.toLocaleString("es")} elementos`;
}
