import type { CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";

export function normalize(value: string) {
	return value.replace(/\s+/g, " ").trim();
}

export function slug(value: string) {
	return normalize(value)
		.normalize("NFKD")
		.replace(/[^\p{Letter}\p{Number}]+/gu, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase();
}

export function uniqueId(value: string, used: Set<string>) {
	const base = slug(value) || "item";
	let candidate = base;
	let suffix = 2;
	while (used.has(candidate)) candidate = `${base}-${suffix++}`;
	used.add(candidate);
	return candidate;
}

export function isHidden($: CheerioAPI, element: AnyNode) {
	return $(element).hasClass("hidden");
}

export function findArticle($: CheerioAPI, title: string) {
	return $("h2")
		.filter((_, element) => normalize($(element).text()) === title)
		.first()
		.parent("article");
}

export function itemStatus(hidden: boolean) {
	return hidden ? "alternate" : "current";
}

export function extractRichText($: CheerioAPI, element: AnyNode) {
	if (!$(element).find("abbr, sup").length) return normalize($(element).text());
	const nodes = $(element)
		.contents()
		.map((_, node) => {
			const value =
				node.type === "text" ? node.data.replace(/\s+/g, " ") : $(node).text();
			const type = node.type === "tag" ? node.name : "text";
			return {
				type,
				value,
				...(type === "abbr" ? { title: $(node).attr("title") ?? "" } : {}),
			};
		})
		.get();
	const first = nodes[0];
	const last = nodes.at(-1);
	if (first) first.value = first.value.trimStart();
	if (last) last.value = last.value.trimEnd();
	return nodes;
}
