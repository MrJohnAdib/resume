import type { CvView } from "../../render/cv-select.ts";
import { escapeHtml as e } from "../html.ts";

function contact({ person }: CvView) {
	const phone = `<span id="phoneBox" class="hidden"><a href="${e(person.contact.phone.href)}" itemprop="telephone" tabindex="-1">${e(person.contact.phone.label)}</a><span class="cv-sep">·</span></span>`;
	return `<div id="contactBox" class="cv-contact">${phone}<span itemprop="address">${e(person.contact.location)}</span><span class="cv-sep">·</span><span>${e(person.contact.badge)}</span></div>`;
}

function links({ person, site }: CvView) {
	const email = `<a href="${e(person.contact.email.href)}" itemprop="email" tabindex="-1">${e(person.contact.email.label)}</a>`;
	const items = person.links.items.map(
		(link) =>
			`<a target="_blank" href="${e(link.url)}" title="${e(link.title)}">${e(link.label)}</a>`,
	);
	const version = `<span id="version" class="hidden" data-latest-pdf="${e(site.pdf.latestVersion)}">${e(site.pdf.version)}</span>`;
	return `<div class="cv-links">${[...items, email].join('<span class="cv-sep">·</span>')}${version}</div>`;
}

export function renderCvHeader(view: CvView) {
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
