#!/usr/bin/env bash
# Aplica el sistema de trabajo a un proyecto recién creado (create-expo-app / create-next-app).
# Copia plantillas sin pisar archivos, agrega scripts y alias al package.json/tsconfig.json y
# dice qué dependencias instalar.
# Uso: nuevo-proyecto.sh <react-native|nextjs> <directorio-del-proyecto> [--sin-molde]
set -euo pipefail

stack="${1:-}"
target="${2:-}"
with_molde=true
[[ "${3:-}" == "--sin-molde" ]] && with_molde=false
here="$(cd "$(dirname "$0")" && pwd)"
templates="$here/plantillas"

case "$stack" in
	react-native | nextjs) ;;
	*)
		echo "Uso: $0 <react-native|nextjs> <directorio-del-proyecto> [--sin-molde]" >&2
		exit 1
		;;
esac
if [[ -z "$target" || ! -f "$target/package.json" ]]; then
	echo "No encuentro $target/package.json. Crea el proyecto primero (create-expo-app / create-next-app)." >&2
	exit 1
fi
target="$(cd "$target" && pwd)"
if [[ "$stack" == react-native && -f "$target/scripts/reset-project.js" ]]; then
	echo "Aviso: el proyecto todavía tiene el ejemplo de create-expo-app. Lo normal es correr antes" >&2
	echo "  pnpm run reset-project   (borra src/ y scripts/; este script agrega lo suyo después)" >&2
	read -r -p "¿Sigo igual? [s/N] " answer
	[[ "$answer" == [sS] ]] || exit 1
fi
skipped=()

copy() {
	local from="$1" to="$2"
	if [[ -e "$to" ]]; then
		skipped+=("${to#"$target"/}")
	else
		mkdir -p "$(dirname "$to")"
		cp "$from" "$to"
		echo "creado: ${to#"$target"/}"
	fi
}

# Copia un árbol de plantillas, archivo por archivo, sin pisar
copy_tree() {
	local root="$1" file
	while IFS= read -r -d '' file; do
		copy "$file" "$target/${file#"$root"/}"
	done < <(find "$root" -type f -print0 | sort -z)
}

# AGENTS.md: si ya existe (Next.js 16 escribe uno y lo re-agrega en cada `next dev`), nuestras
# reglas van debajo de su bloque, una sola vez
agents="$target/AGENTS.md"
if [[ ! -e "$agents" ]]; then
	copy "$templates/AGENTS.$stack.md" "$agents"
elif grep -q "sistema-de-trabajo" "$agents"; then
	skipped+=("AGENTS.md")
else
	{ printf '\n<!-- sistema-de-trabajo -->\n\n'; cat "$templates/AGENTS.$stack.md"; } >>"$agents"
	echo "agregado: AGENTS.md (debajo de lo que ya tenía)"
fi

# Docs, reglas y comandos
copy "$templates/CLAUDE.md" "$target/CLAUDE.md"
for doc in telas decisoes figma checklist-pantalla pr; do
	copy "$templates/docs/$doc.md" "$target/docs/$doc.md"
done
copy "$templates/docs/plan.md" "$target/docs/superpowers/plans/_plantilla.md"
mkdir -p "$target/docs/superpowers/specs"
copy_tree "$templates/comun"

# Configuración y molde del stack
stack_dir="$templates/$stack"
while IFS= read -r -d '' file; do
	rel="${file#"$stack_dir"/}"
	if [[ "$with_molde" == false && ("$rel" == src/features/example/* || "$rel" == src/app/ejemplo*) ]]; then
		continue
	fi
	copy "$file" "$target/$rel"
done < <(find "$stack_dir" -type f -print0 | sort -z)
chmod +x "$target/.husky/pre-commit" "$target/.husky/pre-push"

# package.json y tsconfig.json: agrega lo que falta, nunca cambia lo que ya está
STACK="$stack" TARGET="$target" node <<'EOF'
const fs = require("node:fs");
const path = require("node:path");
const stack = process.env.STACK;
const dir = process.env.TARGET;

const scripts = {
	check: "biome check .",
	"check:fix": "biome check --write .",
	typecheck: "tsc --noEmit",
	prepare: "husky",
	...(stack === "react-native"
		? {
				test: "TZ=UTC jest --coverage",
				"test:watch": "TZ=UTC jest --watch",
				bundle: "expo export --platform android --platform ios --output-dir .expo-export",
			}
		: { test: "TZ=UTC vitest run --coverage", "test:watch": "TZ=UTC vitest" }),
};

const pkgPath = path.join(dir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.scripts ??= {};
let pkgChanged = false;
for (const [name, command] of Object.entries(scripts)) {
	if (pkg.scripts[name] === undefined) {
		pkg.scripts[name] = command;
		pkgChanged = true;
		console.log(`package.json: script "${name}"`);
	} else if (pkg.scripts[name] !== command) {
		console.log(`package.json: "${name}" ya existe ("${pkg.scripts[name]}"); el sistema usa "${command}"`);
	}
}
if (pkg["lint-staged"] === undefined) {
	pkg["lint-staged"] = {
		"*.{ts,tsx,js,jsx,mjs,mts,json,jsonc,css}": ["biome check --write --no-errors-on-unmatched"],
	};
	pkgChanged = true;
	console.log("package.json: lint-staged");
}
// Solo escribe si agregó algo: reescribir deshace el formato que aplicó Biome
if (pkgChanged) fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, "\t")}\n`);

const tsPath = path.join(dir, "tsconfig.json");
try {
	const ts = JSON.parse(fs.readFileSync(tsPath, "utf8"));
	ts.compilerOptions ??= {};
	ts.compilerOptions.paths ??= {};
	let tsChanged = false;
	const wanted = { "@/*": ["./src/*"], ...(stack === "react-native" ? { "@/assets/*": ["./assets/*"] } : {}) };
	for (const [alias, target] of Object.entries(wanted)) {
		if (ts.compilerOptions.paths[alias] === undefined) {
			ts.compilerOptions.paths[alias] = target;
			tsChanged = true;
			console.log(`tsconfig.json: alias ${alias}`);
		}
	}
	// TypeScript 6 ya no incluye solo todo node_modules/@types: los tipos de jest van listados
	if (stack === "react-native") {
		const types = ts.compilerOptions.types ?? [];
		if (!types.includes("jest")) {
			ts.compilerOptions.types = [...types, "jest"];
			tsChanged = true;
			console.log('tsconfig.json: types "jest"');
		}
	}
	for (const flag of ["strict", "noUncheckedIndexedAccess"]) {
		if (ts.compilerOptions[flag] === undefined) {
			ts.compilerOptions[flag] = true;
			tsChanged = true;
			console.log(`tsconfig.json: ${flag}`);
		}
	}
	if (tsChanged) fs.writeFileSync(tsPath, `${JSON.stringify(ts, null, "\t")}\n`);
} catch {
	console.log('tsconfig.json: no lo pude leer como JSON; agrega a mano "paths": { "@/*": ["./src/*"] }');
}
EOF

if ((${#skipped[@]})); then
	echo
	echo "Ya existían y no los toqué (compáralos con $templates):"
	printf '  %s\n' "${skipped[@]}"
fi

echo
echo "Siguiente:"
if [[ "$stack" == react-native ]]; then
	echo "  1. npx expo install jest-expo jest @types/jest react-native-safe-area-context"
	echo "     pnpm add -D -E @biomejs/biome@2.6.2 && pnpm add -D husky lint-staged @testing-library/react-native"
	echo "     pnpm add uniwind tailwindcss"
	echo "     Si pnpm dice ERR_PNPM_IGNORED_BUILDS: pnpm approve-builds (Uniwind necesita @parcel/watcher)"
	echo "  2. En src/app/_layout.tsx, primera línea: import \"@/global.css\";"
	echo "     (metro.config.js y src/global.css ya vienen con Uniwind y los tokens)"
else
	echo "  1. pnpm add -D -E @biomejs/biome@2.6.2 && pnpm add -D husky lint-staged vitest @vitest/coverage-v8 @vitejs/plugin-react \\"
	echo "       jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom"
	echo "  2. En src/app/globals.css, después de @import \"tailwindcss\": @import \"../styles/tokens.css\";"
fi
echo "  3. pnpm install (activa husky) y completa los <…> de AGENTS.md."
if [[ "$stack" == react-native ]]; then
	echo "  4. pnpm bundle (genera uniwind-types.d.ts) && pnpm check:fix && pnpm typecheck && pnpm test"
else
	echo "  4. pnpm check:fix && pnpm typecheck && pnpm test && pnpm build"
fi
if [[ "$with_molde" == true ]]; then
	echo "  El molde está en src/features/example (ruta /ejemplo): cópialo para tu primera feature y bórralo."
fi
if ! grep -qs "Guiar, no codear" "$HOME/.claude/CLAUDE.md"; then
	echo "  Una vez por máquina: cat $templates/claude-usuario.md >> ~/.claude/CLAUDE.md"
fi
