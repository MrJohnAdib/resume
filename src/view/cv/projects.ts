import { richText } from "../../render/rich-text.ts";
import type { ViewSection } from "../../render/select.ts";
import type { Resume } from "../../schema/resume.ts";
import { copyBreak, escapeHtml as e } from "../html.ts";

type Item = Resume["sections"]["projects"]["items"][number];

function renderItem(item: Item) {
	const title = item.title
		? `<div class="cv-row"><h3 class="cv-role">${e(item.title)}</h3></div>`
		: "";
	const bullets = item.bullets.length
		? `<ul class="cv-bullets">${item.bullets.map((bullet) => `<li>${richText(bullet.text, bullet.annotations)}</li>`).join("")}</ul>`
		: "";
	const technologies = item.technologies.length
		? `<div class="cv-tech"><h5>Tech Stack:</h5> ${item.technologies.map(({ label }) => `<span>${e(label)}</span>`).join(", ")}</div>`
		: "";
	return `<section class="cv-item" data-item-id="${e(item.id)}">
			${title}${bullets}${technologies}${copyBreak}
		</section>`;
}

export function renderCvProjects(section: ViewSection) {
	const items = section.items as unknown as Item[];
	return items.map(renderItem).join("");
}
