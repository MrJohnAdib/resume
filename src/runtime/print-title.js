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
		const suffix = window.location.protocol === "file:" ? "" : "-web";
		const prefix = getRuntimeConfig().pdf.filePrefix;
		document.title = `${prefix}${version()}${suffix}`;
	});
	window.addEventListener("afterprint", () => {
		document.title = originalTitle;
	});
}
import { getRuntimeConfig } from "./config.js";
