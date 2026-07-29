import type { CheerioAPI } from "cheerio";
import {
	findArticle,
	isHidden,
	itemStatus,
	normalize,
	uniqueId,
} from "./helpers.ts";

export function extractEducation($: CheerioAPI) {
	const used = new Set<string>();
	return findArticle($, "Education")
		.children("section")
		.map((_, section) => {
			const headings = $(section).find("h4");
			const degree = normalize(headings.first().text());
			const metadata = $(section)
				.children("div.flex.flex-wrap.text-xs")
				.first();
			const times = metadata
				.find("time")
				.map((__, time) => ({
					datetime: $(time).attr("datetime") ?? "",
					label: normalize($(time).text()),
				}))
				.get();
			const courseworkDetails = $(section)
				.children("div.text-xs.text-stone-600")
				.first();
			const courseworkIds = new Set<string>();
			const coursework = courseworkDetails
				.find("span")
				.map((__, item) => {
					const label = normalize($(item).text()).replace(/[,.\s]+$/, "");
					return {
						id: uniqueId(label, courseworkIds),
						status: itemStatus(isHidden($, item)),
						label,
					};
				})
				.get();
			const thesisElement = $(section)
				.children("div.text-xs.hidden")
				.not(".text-stone-600")
				.first();
			const thesisNode = thesisElement.get(0);
			const thesis = thesisNode
				? {
						id: "thesis",
						status: itemStatus(isHidden($, thesisNode)),
						text: normalize(thesisElement.text()),
					}
				: undefined;
			return {
				id: uniqueId(degree, used),
				status: "current",
				degree,
				institution: normalize(headings.eq(1).text()),
				employmentType: normalize(
					metadata.children("div.grow.items-center.px-1").first().text(),
				),
				location: normalize(metadata.find("[itemprop='location']").text()),
				dates: times,
				...(thesis ? { thesis } : {}),
				coursework,
			};
		})
		.get();
}
