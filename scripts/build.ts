import { rm } from "node:fs/promises";
import path from "node:path";
import { checkBuiltAssets } from "../src/build/assets.ts";
import { buildCss } from "./build-css.ts";
import { checkLayout } from "./check-layout.ts";
import { copyStatic } from "./copy-static.ts";
import { renderSite } from "./render.ts";

async function main() {
	const output = path.resolve("dist");
	await rm(output, { recursive: true, force: true });
	await copyStatic(output);
	await renderSite(output);
	await buildCss(output);
	await checkBuiltAssets(output);
	await checkLayout(output);
	console.log(`Built ${path.relative(process.cwd(), output)}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
