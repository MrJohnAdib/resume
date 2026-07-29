import type { CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import {
	findArticle,
	isHidden,
	itemStatus,
	normalize,
	uniqueId,
} from "./helpers.ts";

function extractDates($: CheerioAPI, section: AnyNode) {
	const times = $(section)
		.find("time")
		.map((_, time) => ({
			datetime: $(time).attr("datetime") ?? "",
			label: normalize($(time).text()),
		}))
		.get();
	return { start: times[0], end: times[1] };
}

function extractBullets($: CheerioAPI, section: AnyNode) {
	const used = new Set<string>();
	return $(section)
		.children("ul")
		.first()
		.children("li")
		.map((_, bullet) => {
			const text = normalize($(bullet).text());
			return {
				id: uniqueId(text.slice(0, 72), used),
				status: itemStatus(isHidden($, bullet)),
				text,
				annotations: $(bullet)
					.find("abbr")
					.map((__, abbr) => ({
						type: "abbr",
						value: normalize($(abbr).text()),
						title: $(abbr).attr("title") ?? "",
					}))
					.get(),
			};
		})
		.get();
}

function extractTechnologies($: CheerioAPI, section: AnyNode) {
	const used = new Set<string>();
	const stack = $(section)
		.children("div")
		.filter(
			(_, div) => normalize($(div).find("h3").first().text()) === "Tech Stack",
		);
	return stack
		.find("span")
		.map((_, item) => {
			const label = normalize($(item).text());
			return { id: uniqueId(label, used), label };
		})
		.get();
}

export function extractExperience($: CheerioAPI) {
	const used = new Set<string>();
	return findArticle($, "Professional Experience")
		.children("section")
		.map((_, section) => {
			const title = normalize($(section).children("h3").first().text());
			const meta = $(section).children("div.flex.items-center").first();
			const organization = meta.find("h4").first();
			const link = organization.find("a").first();
			const duration = meta
				.children("[data-duration], div.text-xs.text-stone-700")
				.first();
			return {
				id: uniqueId(title, used),
				status: itemStatus(isHidden($, section)),
				title,
				organization: {
					name: normalize(organization.text()),
					url: link.attr("href") ?? link.attr("data-href") ?? "",
					linkEnabled: Boolean(link.attr("href")),
				},
				employmentType: normalize(
					meta.children("div.grow.items-center").first().text(),
				),
				location: normalize(meta.find("[itemprop='location']").first().text()),
				duration: normalize(duration.text()),
				dynamicDuration: duration.is("[data-duration]"),
				dates: extractDates($, section),
				bullets: extractBullets($, section),
				technologies: extractTechnologies($, section),
			};
		})
		.get();
}
