import type { DetailedView } from "../../render/detailed-select.ts";
import { escapeHtml as e } from "../html.ts";

function contact({ person }: DetailedView) {
	return `<div id="contactBox" class="cv-contact">
			<div id="phoneBox" class="hidden"><a href="${e(person.contact.phone.href)}" itemprop="telephone" tabindex="-1">${e(person.contact.phone.label)}</a></div>
			<div itemprop="address">${e(person.contact.location)}</div>
			<div><a href="${e(person.contact.email.href)}" itemprop="email" tabindex="-1">${e(person.contact.email.label)}</a></div>
			<div>${e(person.contact.badge)}</div>
		</div>`;
}

function links({ person, site }: DetailedView) {
	const items = person.links.items
		.map(
			(link) =>
				`<div><a target="_blank" href="${e(link.url)}" title="${e(link.title)}">${e(link.label)}</a></div>`,
		)
		.join("");
	return `<div class="cv-links">${items}<span id="version" class="hidden" data-latest-pdf="${e(site.pdf.latestVersion)}">${e(site.pdf.version)}</span></div>`;
}

export function renderCvHeader(view: DetailedView) {
	const { person } = view;
	const summary = person.summary.items
		.map((item) => `<span>${e(item)}</span>`)
		.join(" ");
	return `<header itemscope itemtype="https://schema.org/Person" class="cv-header">
		${contact(view)}
		<div class="cv-identity">
			<h1 itemprop="name">${e(person.identity.name)}</h1>
			<h2 itemprop="jobTitle">${e(person.identity.title)}</h2>
		</div>
		${links(view)}
		<p class="cv-summary" itemprop="knowsAbout">${summary}</p>
	</header>`;
}
