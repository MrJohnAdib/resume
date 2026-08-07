import assert from "node:assert/strict";
import test from "node:test";
import { renderDetailedCss } from "../../src/render/theme-detailed.ts";
import { renderThemeCss } from "../../src/render/theme.ts";

test("renders semantic compact layout settings as CSS variables", () => {
	const css = renderThemeCss();

	assert.match(css, /--resume-primary:#0891b2/);
	assert.match(css, /--resume-page-width:210mm/);
	assert.match(css, /body\{font-family:var\(--resume-body-font\)/);
});

test("renders detailed sheet CSS with safe page breaks", () => {
	const css = renderDetailedCss();

	assert.match(css, /#printArea\[data-layout=detailed\]\{display:flex/);
	assert.match(css, /\.page\{box-shadow:none.*break-after:page\}/);
	assert.match(
		css,
		/\.page:last-child\{page-break-after:auto;break-after:auto\}/,
	);
	assert.match(css, /\[data-item-id\]\{page-break-inside:avoid/);
	assert.match(css, /min-height:var\(--resume-page-height\)/);
});
