function version() {
	return (document.querySelector("#version")?.textContent ?? "").replaceAll(
		".",
		"",
	);
}

export function setupPrintTitle() {
	let originalTitle = document.title;
	window.addEventListener("beforeprint", () => {
		originalTitle = document.title;
		const pdf = getRuntimeConfig().pdf;
		const web = window.location.protocol !== "file:";
		const suffix = web && !pdf.titlePrefix ? "-web" : "";
		const prefix = pdf.titlePrefix ?? pdf.filePrefix;
		document.title = `${prefix}${version()}${suffix}`;
	});
	window.addEventListener("afterprint", () => {
		document.title = originalTitle;
	});
}
import { getRuntimeConfig } from "./config.js";
