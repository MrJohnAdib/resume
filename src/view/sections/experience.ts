import { richText } from "../../render/rich-text.ts";
import type { ViewSection } from "../../render/select.ts";
import type { Resume } from "../../schema/resume.ts";
import { renderHeading } from "../heading.ts";
import { escapeHtml as e, hasField } from "../html.ts";

type Item = Resume["sections"]["experience"]["items"][number] & {
	fields: string[];
};

function organization(item: Item) {
	if (!hasField(item, "organization")) return "";
	const value = item.organization;
	const name = e(value.name);
	const content = value.url
		? `<a class="block text-stone-500" target="_blank" rel="nofollow noopener" ${value.linkEnabled ? "href" : "data-href"}="${e(value.url)}" itemprop="url" tabindex="-1">${name}</a>`
		: `<span class="text-stone-500" itemprop="name">${name}</span>`;
	return `<h4 class="flex items-center font-light text-sm leading-4">${content}</h4>`;
}

function renderItem(item: Item, last: boolean) {
	const bullets = item.bullets.length
		? `<ul class="list-disc list-outside leading-[14px] text-xs text-gray-300 ml-4" itemprop="description">${item.bullets.map((bullet) => `<li><span class="text-stone-500 mt-1.5 block">${richText(bullet.text, bullet.annotations)}</span></li>`).join("")}</ul>`
		: "";
	const technologies =
		hasField(item, "technologies") && item.technologies.length
			? `<div class="leading-[14px] text-xs text-stone-600 mt-2"><h3 class="font-light inline-block text-stone-700">Tech Stack</h3> ${item.technologies.map(({ label }) => `<span>${e(label)}</span>`).join(", ")}</div>`
			: "";
	return `<section class="${last ? "" : "mb-1.5"}" data-item-id="${e(item.id)}" itemscope itemtype="https://schema.org/Organization">
		${hasField(item, "title") ? `<h3 class="font-light text-base leading-5">${e(item.title)}</h3>` : ""}
		<div class="flex items-center">
			${organization(item)}
			${hasField(item, "employmentType") && item.employmentType ? `<div class="grow items-center mx-1 text-xs px-1 text-stone-500">${e(item.employmentType)}</div>` : ""}
			${hasField(item, "location") && item.location ? `<div class="grow text-xs text-stone-500">${e(item.location)}</div>` : ""}
			${hasField(item, "duration") ? `<div class="text-xs text-stone-700"${item.dynamicDuration ? " data-duration" : ""}>${e(item.duration)}</div>` : ""}
			${hasField(item, "dates") ? `<div class="flex items-center text-xs"><div dir="ltr" class="text-stone-700 text-xs px-1"><time datetime="${e(item.dates.start.datetime)}">${e(item.dates.start.label)}</time> - <time datetime="${e(item.dates.end.datetime)}">${e(item.dates.end.label)}</time></div></div>` : ""}
		</div>${bullets}${technologies}
	</section>`;
}

export function renderExperience(section: ViewSection) {
	const items = section.items as unknown as Item[];
	return `<article data-section-id="${e(section.id)}">${renderHeading(section)}${items.map((item, index) => renderItem(item, index === items.length - 1)).join("")}</article>`;
}
