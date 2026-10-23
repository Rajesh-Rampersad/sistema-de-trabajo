const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

// Los worktrees de Claude Code tienen node_modules propio: vigilarlos agota el límite de inotify
// (ENOSPC). Anclado a la raíz de este proyecto: corriendo desde un worktree, su ruta también
// coincidiría.
const worktrees = path
	.join(__dirname, ".claude", "worktrees")
	.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
config.resolver.blockList = [
	...[config.resolver.blockList].flat().filter(Boolean),
	new RegExp(`^${worktrees}([\\\\/]|$)`),
];

// Uniwind compila el CSS (Tailwind v4) en el build y genera los tipos de className
module.exports = withUniwindConfig(config, {
	cssEntryFile: "./src/global.css",
	dtsFile: "./uniwind-types.d.ts",
});
