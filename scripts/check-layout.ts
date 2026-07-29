import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { type Bounds, findOverflow } from "../src/layout/overflow.ts";

type Measurement = {
	page: Bounds;
	items: Bounds[];
};

export async function checkLayout(output = path.resolve("dist")) {
	const browser = await chromium.launch({ headless: true });
	try {
		const page = await browser.newPage({
			viewport: { width: 1440, height: 1300 },
		});
		await page.goto(pathToFileURL(path.join(output, "index.html")).href);
		await page.emulateMedia({ media: "print" });
		await page.evaluate(() => document.fonts.ready);
		const result = await page.evaluate<Measurement | null>(`(() => {
			const sheet = document.querySelector("#printArea");
			if (!sheet) throw new Error("Missing #printArea");
			if (sheet.dataset.overflowPolicy !== "error") return null;
			sheet.style.width = sheet.dataset.pageWidth;
			sheet.style.height = sheet.dataset.pageHeight;
			sheet.style.overflow = "hidden";
			const bounds = (element) => {
				const box = element.getBoundingClientRect();
				return {
					id: element.getAttribute("data-item-id") || undefined,
					sectionId: element.closest("[data-section-id]")?.dataset.sectionId,
					top: box.top, right: box.right, bottom: box.bottom, left: box.left
				};
			};
			return {
				page: bounds(sheet),
				items: [
					...sheet.querySelectorAll("[data-item-id]"),
					...sheet.querySelectorAll("header, main")
				].map((element) => {
					const value = bounds(element);
					value.id ||= element.tagName.toLowerCase();
					return value;
				})
			};
		})()`);
		if (!result) return;
		const overflow = findOverflow(result.page, result.items);
		if (overflow) {
			throw new Error(
				`Compact layout overflow in section "${overflow.sectionId ?? "page"}" near item "${overflow.id ?? "unknown"}"`,
			);
		}
	} finally {
		await browser.close();
	}
}
