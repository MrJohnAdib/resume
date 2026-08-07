import path from "node:path";
import { loadResumeLayouts } from "../src/config/load-layouts.ts";
import { validateResume } from "../src/schema/validate.ts";

async function main() {
	const file = path.resolve(process.argv[2] ?? "resume.config.json");
	for (const resume of await loadResumeLayouts(file)) validateResume(resume);
	console.log(`Validated ${path.relative(process.cwd(), file)}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
