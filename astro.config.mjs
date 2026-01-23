// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://framework-pranikah.faizmuttaqin.com",
	base: "/",
	outDir: "./docs",
	build: {
		assets: "assets",
	},
});
