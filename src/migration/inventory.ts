import { readFile } from "node:fs/promises";
import { load } from "cheerio";

function normalize(value: string) {
	return value.replace(/\s+/g, " ").trim();
}

function countSectionItems($: ReturnType<typeof load>, heading: string) {
	const title = $("h2")
		.filter((_, element) => normalize($(element).text()) === heading)
		.first();
	return title.parent("article").children("section").length;
}

export async function inventoryLegacyResume(file: string) {
	const html = await readFile(file, "utf8");
	const $ = load(html);
	const commentText = [...html.matchAll(/<!--([\s\S]*?)-->/g)]
		.map((match) => normalize(match[1]))
		.filter(Boolean);
	const hiddenText = $("[class~='hidden']")
		.map((_, element) => normalize($(element).text()))
		.get()
		.filter(Boolean);

	return {
		sectionItems: {
			experience: countSectionItems($, "Professional Experience"),
			skills: countSectionItems($, "Skills"),
			awards: countSectionItems($, "Awards and Honors"),
			education: countSectionItems($, "Education"),
			volunteering: countSectionItems($, "Volunteer work"),
		},
		hiddenElements: $("[class~='hidden']").length,
		comments: commentText.length,
		hiddenText,
		commentText,
	};
}
