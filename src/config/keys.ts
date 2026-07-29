export function keyFrom(value: string) {
	return value
		.normalize("NFKD")
		.toLowerCase()
		.replaceAll("+", "-plus")
		.replaceAll("#", "-sharp")
		.replaceAll(/[^a-z0-9]+/g, "-")
		.replaceAll(/^-|-$/g, "");
}

export function generatedKeys<T>(
	items: T[],
	label: (item: T) => string,
): Array<[string, T]> {
	const used = new Map<string, number>();
	return items.map((item) => {
		const base = keyFrom(label(item)) || "item";
		if (used.has(base)) throw new Error(`Duplicate generated key "${base}"`);
		used.set(base, 1);
		return [base, item];
	});
}
