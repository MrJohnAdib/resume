import type { DetailedView } from "../../render/detailed-select.ts";
import { escapeHtml as e } from "../html.ts";

function contact({ person }: DetailedView) {
	const phone = `<span id="phoneBox" class="hidden"><a href="${e(person.contact.phone.href)}" itemprop="telephone" tabindex="-1">${e(person.contact.phone.label)}</a> ◊ </span>`;
	return `<div id="contactBox" class="cv-contact">${phone}<span itemprop="address">${e(person.contact.location)}</span> ◊ <span>${e(person.contact.badge)}</span></div>`;
}

function links({ person, site }: DetailedView) {
	const email = `<a href="${e(person.contact.email.href)}" itemprop="email" tabindex="-1">${e(person.contact.email.label)}</a>`;
	const items = person.links.items.map(
		(link) =>
			`<a target="_blank" href="${e(link.url)}" title="${e(link.title)}">${e(link.label)}</a>`,
	);
	const version = `<span id="version" class="hidden" data-latest-pdf="${e(site.pdf.latestVersion)}">${e(site.pdf.version)}</span>`;
	return `<div class="cv-links">${[email, ...items].join(" ◊ ")}${version}</div>`;
}

export function renderCvHeader(view: DetailedView) {
	const { person } = view;
	const summary = person.summary.items
		.map((item) => `<span>${e(item)}</span>`)
		.join(" ");
	return `<header itemscope itemtype="https://schema.org/Person" class="cv-header">
		<h1 itemprop="name">${e(person.identity.name)}</h1>
		<h2 itemprop="jobTitle">${e(person.identity.title)}</h2>
		${contact(view)}
		${links(view)}
		<p class="cv-summary" itemprop="knowsAbout">${summary}</p>
	</header>`;
}
