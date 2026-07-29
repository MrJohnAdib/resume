import path from "node:path";
import nunjucks from "nunjucks";
import type { Resume } from "../schema/resume.ts";
import { jsonScript } from "./json-script.ts";
import { richText } from "./rich-text.ts";
import { createCompactView } from "./select.ts";

export function renderCompactResume(resume: Resume) {
	const templates = path.resolve("src/templates");
	const environment = nunjucks.configure(templates, {
		autoescape: true,
		noCache: true,
		trimBlocks: true,
		lstripBlocks: true,
	});
	environment.addFilter("richText", richText);
	environment.addFilter("jsonScript", jsonScript);
	return environment.render("page.njk", createCompactView(resume));
}
