import { richText } from "../../render/rich-text.ts";
import type { ViewSection } from "../../render/select.ts";
import type { Resume } from "../../schema/resume.ts";
import { escapeHtml as e } from "../html.ts";

type Item = Resume["sections"]["experience"]["items"][number];

const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function monthLabel(date: { datetime: string; label: string }) {
	const match = date.datetime.match(/^(\d{4})-(\d{2})/);
	if (!match) return date.label;
	return `${months[Number(match[2]) - 1]} ${match[1]}`;
}

function organization(item: Item) {
	const name = e(item.organization.name);
	const content = item.organization.url
		? `<a target="_blank" rel="nofollow noopener" ${item.organization.linkEnabled ? "href" : "data-href"}="${e(item.organization.url)}" itemprop="url" tabindex="-1">${name}</a>`
		: `<span itemprop="name">${name}</span>`;
	const type = item.employmentType
		? `<span class="cv-muted"> · ${e(item.employmentType)}</span>`
		: "";
	return `<h4 class="cv-org">${content}${type}</h4>`;
}

function dates(item: Item) {
	const duration = `<span class="cv-duration"${item.dynamicDuration ? " data-duration" : ""}>${e(item.duration)}</span>`;
	const range = `<time datetime="${e(item.dates.start.datetime)}">${e(monthLabel(item.dates.start))}</time> — <time datetime="${e(item.dates.end.datetime)}">${e(monthLabel(item.dates.end))}</time>`;
	return `<div class="cv-dates" dir="ltr">${duration} ${range}</div>`;
}

function renderItem(item: Item) {
	const bullets = item.bullets.length
		? `<ul class="cv-bullets" itemprop="description">${item.bullets.map((bullet) => `<li>${richText(bullet.text, bullet.annotations)}</li>`).join("")}</ul>`
		: "";
	const technologies = item.technologies.length
		? `<div class="cv-tech"><h5>Tech Stack</h5> ${item.technologies.map(({ label }) => `<span>${e(label)}</span>`).join(", ")}</div>`
		: "";
	return `<section class="cv-item" data-item-id="${e(item.id)}" itemscope itemtype="https://schema.org/Organization">
			<div class="cv-row"><h3 class="cv-role">${e(item.title)}</h3>${dates(item)}</div>
			<div class="cv-row cv-sub">${organization(item)}${item.location ? `<div class="cv-location">${e(item.location)}</div>` : ""}</div>
			${bullets}${technologies}
		</section>`;
}

export function renderCvRoles(section: ViewSection) {
	const items = section.items as unknown as Item[];
	return items.map(renderItem).join("");
}
