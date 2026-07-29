import type { CheerioAPI } from "cheerio";
import {
	findArticle,
	isHidden,
	itemStatus,
	normalize,
	uniqueId,
} from "./helpers.ts";

export function extractVolunteering($: CheerioAPI) {
	const used = new Set<string>();
	return findArticle($, "Volunteer work")
		.children("section")
		.map((_, section) => {
			const title = normalize($(section).children("h3").first().text());
			const meta = $(section).children("div.flex.items-center").first();
			const organization = meta.find("h4").first();
			const link = organization.find("a").first();
			const times = meta
				.find("time")
				.map((__, time) => ({
					datetime: $(time).attr("datetime") ?? "",
					label: normalize($(time).text()),
				}))
				.get();
			const text = normalize($(section).children("ul").first().text());
			return {
				id: uniqueId(title, used),
				status: itemStatus(isHidden($, section)),
				title,
				organization: {
					name: normalize(organization.text()),
					url: link.attr("href") ?? "",
				},
				location: normalize(meta.find("[itemprop='location']").text()),
				duration: normalize(
					meta.children("[data-duration], .text-stone-700").first().text(),
				),
				dynamicDuration: meta.children("[data-duration]").length > 0,
				dates: { start: times[0], end: times[1] },
				bullets: text
					? [{ id: uniqueId(text.slice(0, 72), new Set()), text }]
					: [],
			};
		})
		.get();
}
