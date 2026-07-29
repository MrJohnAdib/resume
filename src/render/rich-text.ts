import { runtime } from "nunjucks";
import type { InlineNode, RichText } from "../schema/common.ts";

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function renderNode(node: InlineNode) {
	const value = escapeHtml(node.value);
	if (node.type === "abbr") {
		return `<abbr title="${escapeHtml(node.title)}">${value}</abbr>`;
	}
	if (node.type === "sup") return `<sup>${value}</sup>`;
	return value;
}

export function richText(value: RichText, annotations: InlineNode[] = []) {
	if (Array.isArray(value)) {
		return new runtime.SafeString(value.map(renderNode).join(""));
	}
	let html = escapeHtml(value);
	for (const annotation of annotations) {
		const text = escapeHtml(annotation.value);
		html = html.replace(text, renderNode(annotation));
	}
	return new runtime.SafeString(html);
}
