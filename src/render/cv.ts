import type { Resume } from "../schema/resume.ts";
import { renderCvPage } from "../view/cv/page.ts";
import { createCvView } from "./cv-select.ts";

export function renderCvResume(resume: Resume) {
	return renderCvPage(createCvView(resume));
}
