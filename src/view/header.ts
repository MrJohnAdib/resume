import type { CompactView } from "../render/select.ts";
import { escapeHtml as e } from "./html.ts";

export function renderHeader(view: Pick<CompactView, "site" | "person">) {
	const { site, person } = view;
	const links = person.links.items
		.map(
			(
				link,
			) => `<a target="_blank" class="flex leading-4 rounded-lg bg-cyan-600 hover:bg-cyan-800 focus:bg-cyan-900 transition" href="${e(link.url)}" title="${e(link.title)}">
						<img src="${e(link.icon)}" alt="${e(link.id)}" class="h-8 w-8 p-2" />
						<span class="bg-white bg-opacity-30 px-2 leading-8 text-white font-xs">${e(link.label)}</span>
					</a>`,
		)
		.join("");
	const summary = person.summary.items
		.map((item) => `<span>${e(item)}</span>`)
		.join(" ");
	return `<header itemscope itemtype="https://schema.org/Person" class="overflow-hidden bg-stone-50">
	<div class="flex m-6 mb-4">
		<div class="basis-auto w-full">
			<div class="flex">
				<div class="grow"><h1 class="text-black text-3xl font-light- leading-8" itemprop="name">${e(person.identity.name)}</h1></div>
				<nav class="text-xs flex gap-2 justify-end text-stone-700">${links}</nav>
			</div>
			<div class="flex items-center">
				<div class="grow"><h2 class="text-cyan-600 text-xl leading-7 hover:text-cyan-800 transition" itemprop="jobTitle">${e(person.identity.title)}</h2></div>
				<a target="_blank" href="${e(site.metadata.url)}" dir="ltr" class="select-none text-stone-100 hover:text-cyan-800 transition text-xs" tabindex="-1">
					<code id="version" class="block font-light rtl:text-center" data-latest-pdf="${e(site.pdf.latestVersion)}">${e(site.pdf.version)}</code>
				</a>
			</div>
			<p class="text-stone-700 text-sm leading-snug mt-1" itemprop="knowsAbout">${summary}</p>
		</div>
	</div>
	<div id="contactBox" class="bg-stone-100 leading-10 px-6 gap-6 text-xs flex items-center justify-center text-stone-600 not-italic">
		<div class="flex items-center"><img src="${e(site.assets.icons.email)}" alt="email" /><a class="px-1" href="${e(person.contact.email.href)}" itemprop="email" tabindex="-1">${e(person.contact.email.label)}</a></div>
		<div class="flex items-center hidden" id="phoneBox"><img src="${e(site.assets.icons.telephone)}" alt="tel" /><a class="px-1" href="${e(person.contact.phone.href)}" itemprop="telephone" tabindex="-1">${e(person.contact.phone.label)}</a></div>
		<div class="flex items-center"><img src="${e(site.assets.icons.location)}" alt="location" /><div class="px-1" itemprop="address">${e(person.contact.location)}</div></div>
		<div class="flex items-center"><img src="${e(site.assets.icons.badge)}" alt="star" /><div class="px-1">${e(person.contact.badge)}</div></div>
	</div>
</header>`;
}
