import type { Resume } from "../schema/resume.ts";
import { renderDetailedPage } from "../view/detailed-page.ts";
import { createDetailedView } from "./detailed-select.ts";

export function renderDetailedResume(resume: Resume) {
	return renderDetailedPage(createDetailedView(resume));
}
