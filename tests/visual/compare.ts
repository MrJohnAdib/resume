import assert from "node:assert/strict";
import { type Page, chromium } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

type CompareOptions = {
	viewport?: { width: number; height: number };
	colorScheme?: "light" | "dark";
	media?: "screen" | "print";
	missingPdf?: boolean;
	selector?: string | null;
	revealPhone?: boolean;
};

async function screenshot(page: Page, url: string, options: CompareOptions) {
	if (options.missingPdf) {
		await page.route("**/pdf/*.pdf", (route) =>
			route.fulfill({ status: 404, body: "" }),
		);
	}
	await page.goto(url);
	await page.emulateMedia({ media: options.media ?? "screen" });
	await page.evaluate(() => document.fonts.ready);
	await page.evaluate(
		() =>
			new Promise<void>((resolve) =>
				requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
			),
	);
	if (options.revealPhone) await page.locator("#contactBox").click();
	if (options.selector === null) {
		return page.screenshot({ animations: "disabled", fullPage: true });
	}
	return page
		.locator(options.selector ?? "#printArea")
		.screenshot({ animations: "disabled" });
}

export async function comparePages(
	legacyUrl: string,
	generatedUrl: string,
	options: CompareOptions = {},
) {
	const browser = await chromium.launch({ headless: true });
	try {
		const context = await browser.newContext({
			viewport: options.viewport ?? { width: 1440, height: 1300 },
			colorScheme: options.colorScheme ?? "light",
		});
		const page = await context.newPage();
		const legacy = PNG.sync.read(await screenshot(page, legacyUrl, options));
		const generated = PNG.sync.read(
			await screenshot(page, generatedUrl, options),
		);
		assert.equal(generated.width, legacy.width);
		assert.equal(generated.height, legacy.height);
		return pixelmatch(
			legacy.data,
			generated.data,
			undefined,
			legacy.width,
			legacy.height,
			{ threshold: 0 },
		);
	} finally {
		await browser.close();
	}
}
