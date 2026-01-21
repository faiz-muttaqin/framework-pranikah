// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://faiz-muttaqin.github.io",
	base: "/framework-pranikah",
	outDir: "./docs",
	build: {
		assets: "assets",
	},
});
