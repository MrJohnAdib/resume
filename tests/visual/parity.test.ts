import assert from "node:assert/strict";
import test from "node:test";
import { comparePages } from "./compare.ts";
import { startVisualServer } from "./server.ts";

test("compact page is pixel-identical to the approved baseline", async () => {
	const server = await startVisualServer();
	try {
		const difference = await comparePages(
			`${server.url}/baseline`,
			`${server.url}/generated`,
		);
		assert.equal(difference, 0);
	} finally {
		await server.close();
	}
});

test("responsive, dark, print, phone, and PDF states retain visual parity", async () => {
	const server = await startVisualServer();
	const cases = [
		{ viewport: { width: 390, height: 844 }, selector: null },
		{ colorScheme: "dark" as const, selector: null },
		{ media: "print" as const },
		{ revealPhone: true },
		{ missingPdf: true, selector: null },
	];
	try {
		for (const options of cases) {
			const difference = await comparePages(
				`${server.url}/baseline`,
				`${server.url}/generated`,
				options,
			);
			assert.equal(difference, 0, JSON.stringify(options));
		}
	} finally {
		await server.close();
	}
});
