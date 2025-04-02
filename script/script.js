const myDate = new Date().toLocaleString("en-us", {
	day: "numeric",
	month: "short",
	year: "numeric",
});
for (const el of document.querySelectorAll("[data-fill-current]")) {
	el.textContent = myDate;
	el.setAttribute("date", myDate);
}

document.querySelector("#contactBox").addEventListener("click", () => {
	document.querySelector("#phoneBox").classList.remove("hidden");
});

function replaceDataOnClick(event) {
	const element = event.target;
	const fieldTitle = element.getAttribute("data-fill");
	const fieldValue = element.textContent;
	const msg = `Enter new value for [ ${fieldTitle} ]`;
	const fieldSelector = `[data-fill='${fieldTitle}']`;

	// Get new value from prompt
	let newVal = window.prompt(msg, fieldValue);

	if (!newVal) {
		newVal = `[${fieldTitle}]`;
	}

	// Replace with new text on all parts of the document
	for (const field of document.querySelectorAll(fieldSelector)) {
		field.textContent = newVal;
		field.setAttribute("data-fill-val", newVal);
	}
}

for (const element of document.querySelectorAll("[data-fill]")) {
	element.addEventListener("click", replaceDataOnClick);
}

function removeDotsFromVersion(version) {
	return version.replace(/\./g, "");
}

function getResumeVersion() {
	const ver = document.querySelector("#version").textContent;
	return removeDotsFromVersion(ver);
}

function getResumeLatestPdfVersion() {
	const ver =
		document.querySelector("#version").attributes["data-latest-pdf"].value;
	return removeDotsFromVersion(ver);
}

function getPdfLink(resumeVersion) {
	const folderPath = "./pdf/";
	const resumeFilePrefix = "MrAdib-Resume-";
	const pdfLink = `${folderPath}${resumeFilePrefix}${resumeVersion}.pdf`;
	return pdfLink;
}

function isLocalFile() {
	return window.location.protocol === "file:";
}

function isFileExists(url) {
	// if the url of the page is file://, return true
	if (isLocalFile()) {
		return false;
	}

	try {
		const http = new XMLHttpRequest();
		http.open("HEAD", url, false);
		http.send();
		const isExists = http.status !== 404;
		return isExists;
	} catch (err) {
		console.error("Error while checking file exists ", url, err);
		return false;
	}
}
const pdfBtn = document.querySelector("#pdf-btn");

function setPdfButtonLink(link) {
	const pdfBtnIsHidden = pdfBtn.classList.contains("hidden");
	if (!link) {
		pdfBtn.setAttribute("href", "#");
		if (!pdfBtnIsHidden) {
			pdfBtn.classList.add("hidden");
		}
		return;
	}
	pdfBtn.setAttribute("href", link);
	if (pdfBtnIsHidden) {
		pdfBtn.classList.remove("hidden");
	}
}

function showPdfButton() {
	const resumeVersion = getResumeVersion();
	const pdfLink = getPdfLink(resumeVersion);
	const isPdfExists = isFileExists(pdfLink);
	if (isPdfExists) {
		setPdfButtonLink(pdfLink);
		return;
	}

	const latestResumeVersion = getResumeLatestPdfVersion();
	const latestPdfLink = getPdfLink(latestResumeVersion);
	const isLatestPdfExists = isFileExists(latestPdfLink);
	if (isLatestPdfExists) {
		setPdfButtonLink(latestPdfLink);
		return;
	}

	// if current page url, show the button with sample link
	if (isLocalFile()) {
		setPdfButtonLink("#direct-print");
		pdfBtn.target = "";
		pdfBtn.onclick = () => {
			window.print();
		};
		return;
	}

	// If pdf file not exists at all hide the pdf button
	setPdfButtonLink(null);
}

function consoleMessage() {
	console.log("What are you searching for here? 😎");
	console.log(
		"If you need more info about me, check out my website at https://mradib.com",
	);
	console.log(
		"If you like it, you can fork this one-page resume repository or give me a star on GitHub https://github.com/MrJohnAdib/resume",
	);
	console.log(`

		888b     d888                d8888      888 d8b 888
		8888b   d8888               d88888      888 Y8P 888
		88888b.d88888              d88P888      888     888
		888Y88888P888 888d888     d88P 888  .d88888 888 88888b.       .d8888b  .d88b.  88888b.d88b.
		888 Y888P 888 888P"      d88P  888 d88" 888 888 888 "88b     d88P"    d88""88b 888 "888 "88b
		888  Y8P  888 888       d88P   888 888  888 888 888  888     888      888  888 888  888  888
		888   "   888 888      d8888888888 Y88b 888 888 888 d88P d8b Y88b.    Y88..88P 888  888  888
		888       888 888     d88P     888  "Y88888 888 88888P"  Y8P  "Y8888P  "Y88P"  888  888  888

		oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
		`);
}

// on load page show pdf button
consoleMessage();
showPdfButton();

window.addEventListener("beforeprint", () => {
	window.originalTitle = document.title;
	let documentTitle = `MrAdib-Resume-${getResumeVersion()}`;
	if (!isLocalFile()) {
		documentTitle += "-web";
	}
	document.title = documentTitle;
});

window.addEventListener("afterprint", () => {
	if (window.originalTitle) {
		document.title = window.originalTitle;
	}
});
