import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const file = path.resolve("data/site/release.json");

function bumpMinor(version: string) {
	const match = version.match(/^v(\d+)\.(\d+)\.(\d+)$/);
	if (!match) throw new Error(`Unsupported version: ${version}`);
	return `v${match[1]}.${Number(match[2]) + 1}.0`;
}

async function main() {
	const release = JSON.parse(await readFile(file, "utf8"));
	const version = bumpMinor(release.version);
	const next = {
		date: new Date().toISOString().slice(0, 10),
		version,
		latestVersion: version,
	};
	await writeFile(file, `${JSON.stringify(next, null, "\t")}\n`);
	console.log(version);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
