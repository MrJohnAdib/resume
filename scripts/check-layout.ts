import path from "node:path";
import { type Page, chromium } from "@playwright/test";
import { startResumeServer } from "../src/build/resume-server.ts";
import { type Bounds, findOverflow } from "../src/layout/overflow.ts";

type Measurement = { page: Bounds; items: Bounds[] };

const measureScript = `(() => {
	const sheet = document.querySelector("#printArea");
	if (!sheet) throw new Error("Missing #printArea");
	sheet.style.width = sheet.dataset.pageWidth || "210mm";
	sheet.style.height = sheet.dataset.pageHeight || "296mm";
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
})()`;

async function measure(page: Page, url: string, label: string) {
	const failed: string[] = [];
	const origin = new URL(url).origin;
	const onResponse = (response: { status(): number; url(): string }) => {
		if (response.url().startsWith(origin) && response.status() >= 400) {
			failed.push(response.url());
		}
	};
	page.on("response", onResponse);
	await page.goto(url);
	await page.emulateMedia({ media: "print" });
	await page.evaluate(() => document.fonts.ready);
	page.off("response", onResponse);
	if (failed.length) {
		throw new Error(`${label} layout failed resource: ${failed.join(", ")}`);
	}
	return page.evaluate<Measurement>(measureScript);
}

function overflowAmount({ page, items }: Measurement) {
	return Math.max(
		0,
		...items.flatMap((item) => [
			item.bottom - page.bottom,
			item.right - page.right,
			page.left - item.left,
			page.top - item.top,
		]),
	);
}

export async function checkLayout(
	output = path.resolve("dist"),
	baseline = path.resolve("tests/fixtures/legacy-index.html"),
) {
	const server = await startResumeServer(output, baseline);
	const browser = await chromium.launch({ headless: true });
	try {
		const page = await browser.newPage({
			viewport: { width: 1440, height: 1300 },
		});
		const generated = await measure(
			page,
			`${server.url}/generated`,
			"generated",
		);
		const legacy = await measure(page, `${server.url}/legacy`, "legacy");
		if (overflowAmount(generated) <= overflowAmount(legacy) + 1) return;
		const overflow = findOverflow(generated.page, generated.items);
		throw new Error(
			`Compact layout overflow in section "${overflow?.sectionId ?? "page"}" near item "${overflow?.id ?? "unknown"}"`,
		);
	} finally {
		await browser.close();
		await server.close();
	}
}
