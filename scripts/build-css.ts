import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

export async function buildCss(output = path.resolve("dist")) {
	const binary = path.resolve("node_modules/.bin/tailwindcss");
	await run(binary, [
		"-i",
		"./style/tailwind.css",
		"-o",
		path.join(output, "style/style.min.css"),
		"--content",
		"./src/view/**/*.ts,./coverletter.html,./fa/index.html",
		"--minify",
	]);
}
