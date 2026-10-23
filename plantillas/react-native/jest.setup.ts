// Mocks de módulos nativos que los tests de pantalla necesitan. Agrega aquí los del proyecto
// (kv-store, sensores, etc.), cada uno con un comentario de por qué.

// Insets fijos del propio paquete: una pantalla renderiza sin SafeAreaProvider
jest.mock(
	"react-native-safe-area-context",
	() => require("react-native-safe-area-context/jest/mock").default,
);
