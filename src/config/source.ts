const sources = new WeakMap<object, string>();

export function markSource<T>(value: T, source: string): T {
	if (typeof value === "object" && value !== null) sources.set(value, source);
	return value;
}

export function markSourceTree<T>(value: T, source: string): T {
	if (typeof value !== "object" || value === null) return value;
	sources.set(value, source);
	for (const child of Object.values(value)) markSourceTree(child, source);
	return value;
}

export function sourceOf(value: unknown) {
	return typeof value === "object" && value !== null
		? sources.get(value)
		: undefined;
}
