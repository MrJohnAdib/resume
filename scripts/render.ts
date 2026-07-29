import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadResumeConfig } from "../src/config/load.ts";
import { renderCompactResume } from "../src/render/compact.ts";
import { renderThemeCss } from "../src/render/theme.ts";
import { validateResume } from "../src/schema/validate.ts";

export async function renderSite(output = path.resolve("dist")) {
	const loaded = await loadResumeConfig(path.resolve("resume.config.json"));
	const resume = validateResume(loaded);
	await mkdir(path.join(output, "style"), { recursive: true });
	await writeFile(path.join(output, "index.html"), renderCompactResume(resume));
	await writeFile(path.join(output, "style/theme.css"), renderThemeCss());
}
