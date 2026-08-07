import assert from "node:assert/strict";
import test from "node:test";
import { jsonScript } from "../../src/render/json-script.ts";

test("serializes runtime configuration without closing the script element", () => {
	const value = {
		message: '</script><img src=x onerror="alert(1)">',
	};
	const serialized = jsonScript(value).toString();

	assert.doesNotMatch(serialized, /<\/script>|<img/);
	assert.deepEqual(JSON.parse(serialized), value);
});
