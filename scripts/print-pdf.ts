import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { startResumeServer } from "../src/build/resume-server.ts";
import { layoutRoutes } from "../src/config/site-defaults.ts";
import { buildCss } from "./build-css.ts";
import { copyStatic } from "./copy-static.ts";
import { renderSite } from "./render.ts";

type RuntimeConfig = { pdf: { filePrefix: string; version: string } };

function runtimeConfig(html: string) {
	const match = html.match(
		/<script id="runtime-config" type="application\/json">([^<]*)<\/script>/,
	);
	if (!match?.[1]) throw new Error("Missing runtime config");
	return JSON.parse(match[1]) as RuntimeConfig;
}

function pdfName({ pdf }: RuntimeConfig) {
	return `${pdf.filePrefix}${pdf.version.replaceAll(".", "")}.pdf`;
}

async function main() {
	const output = path.resolve("dist");
	const folder = path.resolve("pdf");
	await rm(output, { recursive: true, force: true });
	await copyStatic(output);
	await renderSite(output);
	await buildCss(output);
	const server = await startResumeServer(output);
	const browser = await chromium.launch({
		headless: true,
		args: ["--font-render-hinting=none"],
	});
	try {
		const page = await browser.newPage({
			viewport: { width: 1440, height: 1300 },
		});
		for (const route of Object.values(layoutRoutes)) {
			const source = path.join(output, route, "index.html");
			const file = path.join(
				folder,
				pdfName(runtimeConfig(await readFile(source, "utf8"))),
			);
			await page.goto(`${server.url}/${route}`, { waitUntil: "networkidle" });
			await page.evaluate(() => document.fonts.ready);
			await page.pdf({
				path: file,
				preferCSSPageSize: true,
				printBackground: true,
			});
			console.log(`Printed ${path.relative(process.cwd(), file)}`);
		}
	} finally {
		await browser.close();
		await server.close();
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
