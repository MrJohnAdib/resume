import path from "node:path";
import { chromium } from "@playwright/test";
import { startResumeServer } from "../src/build/resume-server.ts";
import { type Bounds, findOverflow } from "../src/layout/overflow.ts";

type Measurement = { page: Bounds; items: Bounds[] };

const measureScript = (expectedPages: number) => `(() => {
	const sheet = document.querySelector("#printArea");
	if (!sheet) throw new Error("Missing #printArea");
	sheet.style.width = sheet.dataset.pageWidth || "210mm";
	sheet.style.minWidth = sheet.style.width;
	const pages = [...sheet.querySelectorAll(".page")];
	if (pages.length !== ${expectedPages}) throw new Error("Expected ${expectedPages} pages, found " + pages.length);
	const bounds = (element) => {
		const box = element.getBoundingClientRect();
		return {
			id: element.getAttribute("data-item-id") || undefined,
			sectionId: element.closest("[data-section-id]")?.dataset.sectionId,
			top: box.top, right: box.right, bottom: box.bottom, left: box.left
		};
	};
	return pages.map((sheetPage) => {
		sheetPage.style.height = sheet.dataset.pageHeight || "296mm";
		sheetPage.style.overflow = "hidden";
		return {
			page: bounds(sheetPage),
			items: [
				...sheetPage.querySelectorAll("[data-item-id]"),
				...sheetPage.querySelectorAll("header, main")
			].map((element) => {
					const value = bounds(element);
					value.id ||= element.tagName.toLowerCase();
					return value;
				})
		};
	});
})()`;

export async function checkCvLayout(
	output = path.resolve("dist"),
	routes: Array<{ route: string; pages: number }> = [
		{ route: "cv/", pages: 3 },
		{ route: "one/", pages: 1 },
	],
) {
	const server = await startResumeServer(output);
	const browser = await chromium.launch({ headless: true });
	try {
		const page = await browser.newPage({
			viewport: { width: 1440, height: 1300 },
		});
		const failed: string[] = [];
		const origin = new URL(server.url).origin;
		page.on("response", (response) => {
			if (response.url().startsWith(origin) && response.status() >= 400) {
				failed.push(response.url());
			}
		});
		for (const { route, pages } of routes) {
			failed.length = 0;
			await page.goto(`${server.url}/${route}`);
			await page.emulateMedia({ media: "print" });
			await page.evaluate(() => document.fonts.ready);
			if (failed.length) {
				throw new Error(`${route} failed resource: ${failed.join(", ")}`);
			}
			const measurements = await page.evaluate<Measurement[]>(
				measureScript(pages),
			);
			for (const [index, measurement] of measurements.entries()) {
				const overflow = findOverflow(measurement.page, measurement.items);
				if (overflow) {
					throw new Error(
						`${route} overflow on page ${index + 1} in section "${overflow.sectionId ?? "page"}" near item "${overflow.id ?? "unknown"}"`,
					);
				}
			}
		}
	} finally {
		await browser.close();
		await server.close();
	}
}
