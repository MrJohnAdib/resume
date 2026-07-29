import { getRuntimeConfig } from "./config.js";

function compactVersion(value) {
	return value.replaceAll(".", "");
}

function pdfLink(version, pdf) {
	return `${pdf.folder}${pdf.filePrefix}${compactVersion(version)}.pdf`;
}

function isLocalFile() {
	return window.location.protocol === "file:";
}

function exists(url) {
	if (isLocalFile()) return false;
	try {
		const request = new XMLHttpRequest();
		request.open("HEAD", url, false);
		request.send();
		return request.status !== 404;
	} catch (error) {
		console.error("Error while checking file exists ", url, error);
		return false;
	}
}

function setButton(button, link) {
	if (!link) {
		button.setAttribute("href", "#");
		button.classList.add("hidden");
		return;
	}
	button.setAttribute("href", link);
	button.classList.remove("hidden");
}

export function setupPdfButton() {
	const button = document.querySelector("#pdf-btn");
	const version = document.querySelector("#version");
	if (!(button instanceof HTMLAnchorElement) || !version) return;
	const pdf = getRuntimeConfig().pdf;
	const current = pdfLink(version.textContent ?? "", pdf);
	if (exists(current)) return setButton(button, current);
	const latest = pdfLink(version.getAttribute("data-latest-pdf") ?? "", pdf);
	if (exists(latest)) return setButton(button, latest);
	if (isLocalFile() && pdf.localAction === "print") {
		setButton(button, "#direct-print");
		button.target = "";
		button.addEventListener("click", () => window.print());
		return;
	}
	setButton(button, null);
}
