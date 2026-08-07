import { richText } from "../../render/rich-text.ts";
import type { ViewSection } from "../../render/select.ts";
import type { Resume } from "../../schema/resume.ts";
import { renderHeading } from "../heading.ts";
import { escapeHtml as e, hasField } from "../html.ts";

type Item = Resume["sections"]["education"]["items"][number] & {
	fields: string[];
};

function renderItem(item: Item, last: boolean) {
	const dates = item.dates
		.map(
			(date) => `<time datetime="${e(date.datetime)}">${e(date.label)}</time>`,
		)
		.join(" - ");
	const coursework =
		hasField(item, "coursework") && item.coursework.length
			? `<div class="text-xs text-stone-600"><h3 class="font-light inline-block text-stone-700">Relevant Coursework</h3> ${item.coursework.map(({ label }) => `<span>${e(label)}</span>`).join(", ")}.</div>`
			: "";
	return `<section class="${last ? "" : "mb-1"}" data-item-id="${e(item.id)}" itemscope itemtype="https://schema.org/CollegeOrUniversity">
		<div class="flex items-center">${hasField(item, "degree") ? `<h4 class="grow text-base leading-5 font-light">${e(item.degree)}</h4>` : ""}</div>
		<div class="flex flex-wrap text-xs">
			${hasField(item, "institution") ? `<h4 class="flex items-center text-sm leading-4 text-stone-600">${e(item.institution)}</h4>` : ""}
			${hasField(item, "employmentType") && item.employmentType ? `<div class="grow text-xs text-stone-500">${e(item.employmentType)}</div>` : ""}
			${hasField(item, "location") && item.location ? `<div class="grow text-xs text-stone-500">${e(item.location)}</div>` : ""}
			<div class="grow flex items-center mx-1 text-xs"></div>
			${hasField(item, "dates") ? `<div dir="ltr" class="grow-0 text-stone-900">${dates}</div>` : ""}
		</div>
		${hasField(item, "thesis") && item.thesis ? `<div class="text-xs">${richText(item.thesis.text)}</div>` : ""}
		${coursework}
	</section>`;
}

export function renderEducation(section: ViewSection) {
	const items = section.items as unknown as Item[];
	return `<article class="mb-2.5" data-section-id="${e(section.id)}">${renderHeading(section)}${items.map((item, index) => renderItem(item, index === items.length - 1)).join("")}</article>`;
}
