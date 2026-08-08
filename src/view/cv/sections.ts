import { richText } from "../../render/rich-text.ts";
import type { ViewSection } from "../../render/select.ts";
import type { Resume } from "../../schema/resume.ts";
import { escapeHtml as e } from "../html.ts";
import { renderCvRoles } from "./roles.ts";

type Sections = Resume["sections"];
type SkillGroup = Sections["skills"]["items"][number];
type Award = Sections["awards"]["items"][number];
type Education = Sections["education"]["items"][number];

function heading(section: ViewSection) {
	const title = section.href
		? `<a href="${e(section.href)}" target="_blank" rel="noopener">${e(section.title)}</a>`
		: e(section.title);
	return `<h2 class="cv-heading">${title}</h2>`;
}

function skillGroup(group: SkillGroup) {
	const items = group.items
		.map((item, index) => {
			const last = index === group.items.length - 1;
			const separator =
				last && item.separatorAfter === ", " ? "." : item.separatorAfter;
			return item.title
				? `<abbr itemprop="name" title="${e(item.title)}">${e(item.label)}</abbr>${e(separator)}`
				: `<span itemprop="name">${e(item.label)}</span>${e(separator)}`;
		})
		.join("");
	return `<div class="cv-skill" data-item-id="${e(group.id)}" itemscope itemtype="https://schema.org/ListItem"><h3>${e(group.title)}</h3><div>${items}</div></div>`;
}

function award(item: Award) {
	return `<section class="cv-item" data-item-id="${e(item.id)}">
			<div class="cv-row"><h3 class="cv-role">${e(item.title)}</h3><div class="cv-dates" dir="ltr"><time datetime="${e(item.date.datetime)}">${e(item.date.label)}</time></div></div>
			<div class="cv-desc">${richText(item.description)}</div>
		</section>`;
}

function education(item: Education) {
	const dates = item.dates.length
		? `<div class="cv-dates" dir="ltr"><time datetime="${e(item.dates[0]?.datetime)}">${e(item.dates[0]?.label)}</time> — <time datetime="${e(item.dates.at(-1)?.datetime)}">${e(item.dates.at(-1)?.label)}</time></div>`
		: "";
	const thesis = item.thesis
		? `<div class="cv-desc">${richText(item.thesis.text)}</div>`
		: "";
	const coursework = item.coursework.length
		? `<div class="cv-tech"><h5>Relevant Coursework</h5> ${item.coursework.map(({ label }) => `<span>${e(label)}</span>`).join(", ")}.</div>`
		: "";
	return `<section class="cv-item" data-item-id="${e(item.id)}" itemscope itemtype="https://schema.org/CollegeOrUniversity">
			<div class="cv-row"><h3 class="cv-role">${e(item.degree)}</h3>${dates}</div>
			<div class="cv-row cv-sub"><h4 class="cv-org">${e(item.institution)}${item.employmentType ? `<span class="cv-muted"> · ${e(item.employmentType)}</span>` : ""}</h4></div>
			${thesis}${coursework}
		</section>`;
}

function body(section: ViewSection) {
	if (section.id === "skills") {
		const groups = section.items as unknown as SkillGroup[];
		return `<div class="cv-skills">${groups.map(skillGroup).join("")}</div>`;
	}
	if (section.id === "awards") {
		return (section.items as unknown as Award[]).map(award).join("");
	}
	if (section.id === "education") {
		return (section.items as unknown as Education[]).map(education).join("");
	}
	return renderCvRoles(section);
}

export function renderCvSection(section: ViewSection) {
	const continued = (section as { continued?: boolean }).continued;
	return `<article data-section-id="${e(section.id)}">${continued ? "" : heading(section)}${body(section)}</article>`;
}
