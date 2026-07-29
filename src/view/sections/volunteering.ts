import { richText } from "../../render/rich-text.ts";
import type { ViewSection } from "../../render/select.ts";
import type { Resume } from "../../schema/resume.ts";
import { renderHeading } from "../heading.ts";
import { escapeHtml as e, hasField } from "../html.ts";

type Item = Resume["sections"]["volunteering"]["items"][number] & {
	fields: string[];
};

function renderItem(item: Item) {
	const name = e(item.organization.name);
	const organization = item.organization.url
		? `<a class="text-stone-500" itemprop="name" target="_blank" href="${e(item.organization.url)}">${name}</a>`
		: `<span class="text-stone-500" itemprop="name">${name}</span>`;
	const bullets = item.bullets.length
		? `<ul class="list-disc list-outside leading-[14px] text-xs text-gray-300 ml-4" itemprop="description">${item.bullets.map((bullet) => `<li><span class="text-stone-500 mt-1.5 block">${richText(bullet.text, bullet.annotations)}</span></li>`).join("")}</ul>`
		: "";
	return `<section class="mb-1" data-item-id="${e(item.id)}" itemscope itemtype="https://schema.org/Organization">
		${hasField(item, "title") ? `<h3 class="font-light text-base leading-5">${e(item.title)}</h3>` : ""}
		<div class="flex items-center">
			${hasField(item, "organization") ? `<h4 class="flex items-center font-light text-sm leading-4">${organization}</h4>` : ""}
			<div class="grow flex items-center mx-1 text-xs"></div>
			${hasField(item, "location") && item.location ? `<div class="grow text-xs text-stone-500">${e(item.location)}</div>` : ""}
			${hasField(item, "duration") ? `<div class="text-xs text-stone-700"${item.dynamicDuration ? " data-duration" : ""}>${e(item.duration)}</div>` : ""}
			${hasField(item, "dates") ? `<div class="flex items-center text-xs"><div dir="ltr" class="text-stone-700 text-xs px-1"><time datetime="${e(item.dates.start.datetime)}">${e(item.dates.start.label)}</time> - <time datetime="${e(item.dates.end.datetime)}">${e(item.dates.end.label)}</time></div></div>` : ""}
		</div>${bullets}
	</section>`;
}

export function renderVolunteering(section: ViewSection) {
	const items = section.items as unknown as Item[];
	return `<article class="mb-2.5" data-section-id="${e(section.id)}">${renderHeading(section)}${items.map(renderItem).join("")}</article>`;
}
