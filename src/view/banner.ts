import { layoutBase } from "../config/site-defaults.ts";
import type { CompactView } from "../render/select.ts";
import { escapeHtml as e } from "./html.ts";

const versions = [
	{ layout: "compact", label: "Compact", route: "" },
	{ layout: "one", label: "One-Page CV", route: "one/" },
	{ layout: "detailed", label: "Full CV", route: "cv/" },
];

function switcher(current: string) {
	const base = layoutBase(current);
	const links = versions
		.map(({ layout, label, route }) =>
			layout === current
				? `<span class="rounded-full bg-gray-900 dark:bg-gray-100 px-3 py-1 font-semibold text-white dark:text-gray-900">${label}</span>`
				: `<a href="${base}${route}" class="rounded-full px-3 py-1 hover:text-cyan-500 transition-colors">${label}</a>`,
		)
		.join("");
	return `<nav id="layout-switcher" class="flex items-center gap-1 text-xs text-gray-900 dark:text-gray-100">${links}</nav>`;
}

const positions = [
	"left-[max(-7rem,calc(50%-52rem))]",
	"left-[max(45rem,calc(50%+8rem))]",
];
const gradient =
	"background-image:linear-gradient(to right,#ff80b5,#9089fc);clip-path:polygon(74.8% 41.9%,97.2% 73.2%,100% 34.9%,92.5% 0.4%,87.5% 0%,75% 28.6%,58.5% 54.6%,50.1% 56.8%,46.9% 44%,48.3% 17.4%,24.7% 53.9%,0% 27.9%,11.9% 74.2%,24.9% 54.1%,68.6% 100%,74.8% 41.9%)";

export function renderBanner(site: CompactView["site"], layoutName: string) {
	if (!site.banner.enabled) return "";
	const decoration = positions
		.map(
			(
				position,
			) => `<div class="absolute ${position} top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
		<div class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r opacity-30" style="${gradient}"></div>
	</div>`,
		)
		.join("");
	return `<div id="banner" class="select-none relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 dark:bg-gray-900">
	${decoration}
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 grow">
		<p class="text-xs md:text-sm leading-normal md:leading-8 text-gray-900 dark:text-gray-100">
			${e(site.banner.messageBefore)}
			<strong class="font-semibold">${e(site.banner.technology)}</strong>${e(site.banner.messageAfter)}
			<a href="${e(site.banner.linkUrl)}" target="_blank" class="whitespace-nowrap hover:text-cyan-500 transition-colors">${e(site.banner.linkLabel)}</a>
		</p>
		${switcher(layoutName)}
		<a id="pdf-btn" href="${e(site.metadata.url)}" target="_blank" class="relative flex-none rounded-lg bg-gray-900 dark:bg-gray-100 px-5 py-2 text-xs md:text-sm font-semibold text-white dark:text-gray-900 shadow-sm hover:bg-gray-700 dark:hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 select-none transition-all">
			${e(site.pdf.buttonLabel)}
			<span class="flex absolute -top-1 -right-1 h-3 w-3">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
				<span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
			</span>
		</a>
	</div>
</div>`;
}
