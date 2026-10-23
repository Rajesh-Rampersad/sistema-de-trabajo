import { useCallback, useState } from "react";
import { Pressable, Text } from "react-native";

// Las variantes de un card del Figma (loading, vacío, error…) son estados de la misma pantalla.
// En desarrollo, <StateSwitcher /> rota el estado para compararlo con cada card; en producción
// no se dibuja y el estado queda en el inicial. La pantalla combina este estado con el del dato:
// en "default" manda el dato.
export function useScreenState<const S extends readonly string[]>(states: S, initial: S[number]) {
	const [state, setState] = useState<S[number]>(initial);

	const StateSwitcher = useCallback(() => {
		if (!__DEV__) return null;
		const handlePress = () => {
			const next = states[(states.indexOf(state) + 1) % states.length];
			if (next !== undefined) setState(next);
		};
		return (
			<Pressable
				onPress={handlePress}
				accessibilityRole="button"
				accessibilityLabel="Cambiar estado de la pantalla (desarrollo)"
				className="absolute right-lg bottom-lg min-h-11 justify-center rounded-xl bg-text-primary px-md opacity-80"
			>
				<Text className="label-action text-surface-card">estado: {state}</Text>
			</Pressable>
		);
	}, [state, states]);

	return { state, StateSwitcher };
}
