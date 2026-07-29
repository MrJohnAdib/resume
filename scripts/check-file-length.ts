import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const roots = [
	".github",
	"data",
	"docs",
	"layouts",
	"scripts",
	"src",
	"style",
	"tests",
];
const rootFiles = [
	"README.md",
	"biome.json",
	"package.json",
	"resume.config.json",
	"tsconfig.json",
];
const extensions = new Set([
	".css",
	".html",
	".js",
	".json",
	".md",
	".njk",
	".ts",
	".yaml",
	".yml",
]);
const exempt = new Set([
	"style/style.min.css",
	"tests/fixtures/legacy-index.html",
	"tests/fixtures/legacy-script.js",
]);

async function filesWithin(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const file = path.join(directory, entry.name);
			return entry.isDirectory() ? filesWithin(file) : [file];
		}),
	);
	return nested.flat();
}

async function main() {
	const files = [
		...(await Promise.all(roots.map(filesWithin))).flat(),
		...rootFiles,
	].filter((file) => extensions.has(path.extname(file)) && !exempt.has(file));
	const oversized: string[] = [];
	for (const file of files) {
		const lines = (await readFile(file, "utf8")).split(/\r?\n/).length - 1;
		if (lines >= 100) oversized.push(`${file}: ${lines} lines`);
	}
	if (oversized.length) {
		throw new Error(
			`Hand-written files must stay below 100 lines:\n${oversized.join("\n")}`,
		);
	}
	console.log(`Checked ${files.length} hand-written files`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
