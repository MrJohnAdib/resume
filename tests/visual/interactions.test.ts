import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "@playwright/test";
import { startVisualServer } from "./server.ts";

test("compact runtime preserves contact, PDF, and print-title behavior", async () => {
	const server = await startVisualServer();
	const browser = await chromium.launch({ headless: true });
	try {
		const page = await browser.newPage();
		const errors: Error[] = [];
		page.on("pageerror", (error) => errors.push(error));
		await page.goto(`${server.url}/generated`);

		const pdf = page.locator("#pdf-btn");
		await assert.doesNotReject(() => pdf.waitFor({ state: "visible" }));
		assert.match((await pdf.getAttribute("href")) ?? "", /v2440\.pdf$/);

		const phone = page.locator("#phoneBox");
		assert.equal(
			await phone.evaluate((node) => node.classList.contains("hidden")),
			true,
		);
		await page.locator("#contactBox").click();
		assert.equal(
			await phone.evaluate((node) => node.classList.contains("hidden")),
			false,
		);

		const originalTitle = await page.title();
		await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
		assert.equal(await page.title(), "MrAdib-Resume-v2440-web");
		await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
		assert.equal(await page.title(), originalTitle);
		assert.deepEqual(errors, []);
	} finally {
		await browser.close();
		await server.close();
	}
});

test("PDF control is omitted from view when no PDF can be resolved", async () => {
	const server = await startVisualServer();
	const browser = await chromium.launch({ headless: true });
	try {
		const page = await browser.newPage();
		await page.route("**/pdf/*.pdf", (route) =>
			route.fulfill({ status: 404, body: "" }),
		);
		await page.goto(`${server.url}/generated`);
		const pdf = page.locator("#pdf-btn");
		assert.equal(await pdf.getAttribute("href"), "#");
		assert.equal(
			await pdf.evaluate((node) => node.classList.contains("hidden")),
			true,
		);
	} finally {
		await browser.close();
		await server.close();
	}
});
