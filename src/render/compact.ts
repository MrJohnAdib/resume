import type { Resume } from "../schema/resume.ts";
import { renderPage } from "../view/page.ts";
import { createCompactView } from "./select.ts";

export function renderCompactResume(resume: Resume) {
	return renderPage(createCompactView(resume));
}
