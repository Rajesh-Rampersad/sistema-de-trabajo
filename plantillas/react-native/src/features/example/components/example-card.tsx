import { Pressable, Text, View } from "react-native";
import type { ExampleItem } from "../domain/example-item";

type ExampleCardProps = {
	item: ExampleItem;
	onToggleFavorite: () => void;
};

// Figma: <feature>/<bloque> (card NN). Un componente por bloque del Figma, con el nombre del frame.
export function ExampleCard({ item, onToggleFavorite }: ExampleCardProps) {
	return (
		<View className="flex-row items-center justify-between border-border-global border-b py-md">
			<Text className="heading-section text-text-primary">{item.title}</Text>
			<Pressable
				onPress={onToggleFavorite}
				accessibilityRole="button"
				accessibilityLabel={`${item.isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}: ${item.title}`}
				accessibilityState={{ selected: item.isFavorite }}
				className="min-h-11 min-w-11 items-end justify-center"
			>
				<Text className="label-action text-text-accent">
					{item.isFavorite ? "Favorito" : "Favoritar"}
				</Text>
			</Pressable>
		</View>
	);
}
