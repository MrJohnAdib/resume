import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

const directories = ["fonts", "img", "pdf", "fa", "multi-page-resume"];
const files = [
	"CNAME",
	"LICENSE",
	"coverletter.html",
	"favicon.ico",
	"sitemap.xml",
];

function includeStatic(source: string) {
	return !source.includes("node_modules") && !source.endsWith("/dist");
}

export async function copyStatic(output = path.resolve("dist")) {
	await mkdir(output, { recursive: true });
	for (const directory of directories) {
		await cp(directory, path.join(output, directory), {
			recursive: true,
			filter: includeStatic,
		});
	}
	for (const file of files) await cp(file, path.join(output, file));
	await mkdir(path.join(output, "script"), { recursive: true });
	await cp(
		"tests/fixtures/legacy-script.js",
		path.join(output, "script/script.js"),
	);
	await cp("src/runtime", path.join(output, "script"), { recursive: true });
}
