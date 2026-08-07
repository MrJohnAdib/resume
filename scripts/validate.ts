import path from "node:path";
import { loadResumeConfig } from "../src/config/load.ts";
import { validateResume } from "../src/schema/validate.ts";

async function main() {
	const file = path.resolve(process.argv[2] ?? "resume.config.json");
	validateResume(await loadResumeConfig(file));
	console.log(`Validated ${path.relative(process.cwd(), file)}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
