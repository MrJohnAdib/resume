import assert from "node:assert/strict";
import test from "node:test";
import { renderThemeCss } from "../../src/render/theme.ts";

test("renders semantic compact layout settings as CSS variables", () => {
	const css = renderThemeCss({
		page: { width: "210mm", height: "296mm" },
		theme: { primary: "#0891b2", screenBackground: "#f3f4f6" },
		typography: { bodyFont: "Example Sans" },
	});

	assert.match(css, /--resume-primary:#0891b2/);
	assert.match(css, /--resume-page-width:210mm/);
	assert.match(css, /body\{font-family:var\(--resume-body-font\)/);
});
