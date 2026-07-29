let cached;

export function getRuntimeConfig() {
	if (cached) return cached;
	const element = document.querySelector("#runtime-config");
	if (!element) throw new Error("Missing #runtime-config");
	cached = JSON.parse(element.textContent ?? "{}");
	return cached;
}
