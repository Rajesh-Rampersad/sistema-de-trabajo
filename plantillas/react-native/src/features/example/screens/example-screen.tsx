import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useScreenState } from "@/shared/lib/use-screen-state";
import { ExampleCard } from "../components/example-card";
import { useExampleList } from "../data/use-example-list";
import type { ExampleItem } from "../domain/example-item";
import { formatTotal } from "../domain/format-total";

// Pantalla molde: cards NN (default), NN (loading), NN (empty). El dato llega por el hook de
// data/; los estados salen del dato y el StateSwitcher solo pasa por encima en desarrollo.
export function ExampleScreen() {
	const { isLoading, items, total } = useExampleList();
	const { state: previewState, StateSwitcher } = useScreenState(
		["default", "loading", "empty"] as const,
		"default",
	);
	const dataState = isLoading ? "loading" : total === 0 ? "empty" : "default";
	const state = previewState === "default" ? dataState : previewState;

	// Guarda solo lo que el usuario tocó; el resto viene del dato. Copiar el dato a useState no
	// sirve: el inicializador corre una vez, cuando el dato todavía puede no haber llegado.
	const [favoriteOverrides, setFavoriteOverrides] = useState<Map<string, boolean>>(() => new Map());
	const isFavorite = (item: ExampleItem) => favoriteOverrides.get(item.id) ?? item.isFavorite;
	const handleToggleFavorite = (item: ExampleItem) => {
		setFavoriteOverrides((current) => new Map(current).set(item.id, !isFavorite(item)));
	};

	return (
		<View className="flex-1 bg-surface-page">
			<ScrollView contentContainerClassName="gap-xl p-md pb-xl">
				<View className="rounded-xl bg-surface-card p-md">
					<Text accessibilityRole="header" className="heading-page text-text-primary">
						Ejemplo
					</Text>
					{state === "loading" && <ActivityIndicator accessibilityLabel="Cargando" />}
					{state === "empty" && <Text className="body text-text-tertiary">{formatTotal(0)}</Text>}
					{state === "default" && (
						<>
							<Text className="body text-text-tertiary">{formatTotal(total)}</Text>
							{items.map((item) => (
								<ExampleCard
									key={item.id}
									item={{ ...item, isFavorite: isFavorite(item) }}
									onToggleFavorite={() => handleToggleFavorite(item)}
								/>
							))}
						</>
					)}
				</View>
			</ScrollView>
			<StateSwitcher />
		</View>
	);
}
