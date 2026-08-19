export function escapeHtml(value: unknown) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

export function hasField(item: { fields: string[] }, field: string) {
	return item.fields.includes(field);
}

export const copyBreak = '<p class="cv-break">\n</p>';

export const separator =
	'<span class="cv-sep"> · </span><span class="cv-nl">\n</span>';
