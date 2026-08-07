import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadResumeLayouts } from "../src/config/load-layouts.ts";
import { layoutRoutes } from "../src/config/site-defaults.ts";
import { renderCompactResume } from "../src/render/compact.ts";
import { renderDetailedResume } from "../src/render/detailed.ts";
import { renderDetailedCss } from "../src/render/theme-detailed.ts";
import { renderThemeCss } from "../src/render/theme.ts";
import { validateResume } from "../src/schema/validate.ts";

export async function renderSite(output = path.resolve("dist")) {
	const loaded = await loadResumeLayouts(path.resolve("resume.config.json"));
	await mkdir(path.join(output, "style"), { recursive: true });
	for (const resume of loaded.map(validateResume)) {
		const route = layoutRoutes[resume.layout.name] ?? "";
		const html =
			resume.layout.name === "detailed"
				? renderDetailedResume(resume)
				: renderCompactResume(resume);
		await mkdir(path.join(output, route), { recursive: true });
		await writeFile(path.join(output, route, "index.html"), html);
	}
	await writeFile(path.join(output, "style/theme.css"), renderThemeCss());
	await writeFile(path.join(output, "style/detailed.css"), renderDetailedCss());
}
