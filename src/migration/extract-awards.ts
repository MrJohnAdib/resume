import type { CheerioAPI } from "cheerio";
import {
	extractRichText,
	findArticle,
	isHidden,
	itemStatus,
	normalize,
	uniqueId,
} from "./helpers.ts";

export function extractAwards($: CheerioAPI) {
	const used = new Set<string>();
	return findArticle($, "Awards and Honors")
		.children("section")
		.map((_, section) => {
			const title = normalize($(section).find("h4").first().text());
			const detail = $(section).children("div.flex.flex-wrap").first();
			const descriptionElement = detail.children("div.grow").get(0);
			if (!descriptionElement)
				throw new Error(`Missing award detail: ${title}`);
			const time = detail.find("time").first();
			return {
				id: uniqueId(title, used),
				status: itemStatus(isHidden($, section)),
				title,
				location: normalize(
					$(section).find("div.text-stone-500.hidden").first().text(),
				),
				description: extractRichText($, descriptionElement),
				date: {
					datetime: time.attr("datetime") ?? "",
					label: normalize(time.text()),
				},
				datePlacement: time.parent().is(detail)
					? "before-container"
					: "inside-container",
			};
		})
		.get();
}
