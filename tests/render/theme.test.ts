import assert from "node:assert/strict";
import test from "node:test";
import { renderThemeCss } from "../../src/render/theme.ts";

test("renders semantic compact layout settings as CSS variables", () => {
	const css = renderThemeCss();

	assert.match(css, /--resume-primary:#0891b2/);
	assert.match(css, /--resume-page-width:210mm/);
	assert.match(css, /body\{font-family:var\(--resume-body-font\)/);
});
