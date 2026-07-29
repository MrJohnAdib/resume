import type { CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import {
	findArticle,
	isHidden,
	itemStatus,
	normalize,
	uniqueId,
} from "./helpers.ts";

function separatorAfter(element: AnyNode) {
	let node = element.nextSibling;
	let text = "";
	while (node) {
		if (node.type === "tag" && node.attribs?.itemprop === "name") break;
		if (node.type === "text") text += node.data;
		node = node.nextSibling;
	}
	const punctuation = normalize(text);
	if (punctuation.startsWith(",")) return ", ";
	if (punctuation.startsWith(".")) return ".";
	return " ";
}

export function extractSkills($: CheerioAPI) {
	const usedCategories = new Set<string>();
	return findArticle($, "Skills")
		.children("section")
		.map((_, section) => {
			const title = normalize($(section).children("h3").first().text());
			const usedItems = new Set<string>();
			const items = $(section)
				.find("[itemprop='name']")
				.map((__, item) => ({
					id: uniqueId(normalize($(item).text()), usedItems),
					label: normalize($(item).text()),
					title: $(item).attr("title") ?? "",
					separatorAfter: separatorAfter(item),
				}))
				.get();
			return {
				id: uniqueId(title, usedCategories),
				status: itemStatus(isHidden($, section)),
				title,
				items,
			};
		})
		.get();
}
