import type { ViewSection } from "../render/select.ts";
import { escapeHtml as e } from "./html.ts";

export function renderHeading(section: ViewSection) {
	const title = section.href
		? `<a href="${e(section.href)}" target="_blank" rel="noopener">${e(section.title)}</a>`
		: e(section.title);
	return `<h2 class="text-cyan-600 text-xl leading-5 mb-1.5 underline underline-offset-2">${title}</h2>`;
}
