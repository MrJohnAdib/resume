import { richText } from "../../render/rich-text.ts";
import type { ViewSection } from "../../render/select.ts";
import type { Resume } from "../../schema/resume.ts";
import { renderHeading } from "../heading.ts";
import { escapeHtml as e, hasField } from "../html.ts";

type Item = Resume["sections"]["awards"]["items"][number] & {
	fields: string[];
};

function renderItem(item: Item) {
	let date = "";
	if (hasField(item, "date")) {
		const time = `<time datetime="${e(item.date.datetime)}">${e(item.date.label)}</time>`;
		date =
			item.datePlacement === "before-container"
				? `${time}<div dir="ltr" class="grow-0 text-stone-900"></div>`
				: `<div dir="ltr" class="grow-0 text-stone-900">${time}</div>`;
	}
	return `<section class="mb-1" data-item-id="${e(item.id)}">
		<div class="flex items-center">
			${hasField(item, "title") ? `<h4 class="grow text-base leading-5 font-light">${e(item.title)}</h4>` : ""}
			${hasField(item, "location") && item.location ? `<div class="grow-0 text-stone-500 text-xs">${e(item.location)}</div>` : ""}
		</div>
		<div class="flex flex-wrap text-xs">
			${hasField(item, "description") ? `<div class="grow leading-4 text-stone-600">${richText(item.description)}</div>` : ""}${date}
		</div>
	</section>`;
}

export function renderAwards(section: ViewSection) {
	const items = section.items as unknown as Item[];
	return `<article class="mb-2.5" data-section-id="${e(section.id)}">${renderHeading(section)}${items.map(renderItem).join("")}</article>`;
}
