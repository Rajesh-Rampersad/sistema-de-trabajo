#!/usr/bin/env bash
# Copia las plantillas del sistema de trabajo a un proyecto. No pisa archivos existentes.
# Uso: nuevo-proyecto.sh <react-native|nextjs> <directorio-del-proyecto>
set -euo pipefail

stack="${1:-}"
target="${2:-}"
here="$(cd "$(dirname "$0")" && pwd)"
templates="$here/plantillas"

case "$stack" in
	react-native | nextjs) ;;
	*)
		echo "Uso: $0 <react-native|nextjs> <directorio-del-proyecto>" >&2
		exit 1
		;;
esac
if [[ -z "$target" || ! -d "$target" ]]; then
	echo "El directorio del proyecto no existe: '$target'. Créalo primero (create-expo-app / create-next-app)." >&2
	exit 1
fi

copy() {
	local from="$1" to="$2"
	if [[ -e "$to" ]]; then
		echo "ya existe, no lo toco: ${to#"$target"/}"
	else
		mkdir -p "$(dirname "$to")"
		cp "$from" "$to"
		echo "creado: ${to#"$target"/}"
	fi
}

copy "$templates/AGENTS.$stack.md" "$target/AGENTS.md"
copy "$templates/CLAUDE.md" "$target/CLAUDE.md"
copy "$templates/docs/telas.md" "$target/docs/telas.md"
copy "$templates/docs/decisoes.md" "$target/docs/decisoes.md"
copy "$templates/docs/figma.md" "$target/docs/figma.md"
copy "$templates/docs/plan.md" "$target/docs/superpowers/plans/_plantilla.md"
mkdir -p "$target/docs/superpowers/specs"

echo
echo "Siguiente: completa los <…> de AGENTS.md y configura Biome, husky y lint-staged"
echo "(ver $here/README.md, sección Herramientas)."
if ! grep -qs "Guiar, no codear" "$HOME/.claude/CLAUDE.md"; then
	echo "Una vez por máquina: cat $templates/claude-usuario.md >> ~/.claude/CLAUDE.md"
fi
