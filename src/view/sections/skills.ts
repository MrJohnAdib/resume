import type { ViewSection } from "../../render/select.ts";
import type { Resume } from "../../schema/resume.ts";
import { renderHeading } from "../heading.ts";
import { escapeHtml as e, hasField } from "../html.ts";

type Item = Resume["sections"]["skills"]["items"][number] & {
	fields: string[];
};

export function renderSkills(section: ViewSection) {
	const items = section.items as unknown as Item[];
	const groups = items
		.map((group) => {
			const title = hasField(group, "title")
				? `<h3 class="font-light inline-block text-stone-700">${e(group.title)}</h3>${hasField(group, "items") ? " " : ""}`
				: "";
			const skills = hasField(group, "items")
				? group.items
						.map((item) =>
							item.title
								? `<abbr itemprop="name" title="${e(item.title)}">${e(item.label)}</abbr>${e(item.separatorAfter)}`
								: `<span itemprop="name">${e(item.label)}</span>${e(item.separatorAfter)}`,
						)
						.join("")
				: "";
			return `<section class="leading-5 text-xs" data-item-id="${e(group.id)}" itemscope itemtype="https://schema.org/ListItem">${title}${skills}</section>`;
		})
		.join("");
	return `<article class="mb-1 text-stone-600" data-section-id="${e(section.id)}">${renderHeading(section)}${groups}</article>`;
}
