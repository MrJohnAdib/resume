import { runtime } from "nunjucks";

export function jsonScript(value: unknown) {
	const json = JSON.stringify(value)
		.replaceAll("<", "\\u003c")
		.replaceAll(">", "\\u003e")
		.replaceAll("&", "\\u0026")
		.replaceAll("\u2028", "\\u2028")
		.replaceAll("\u2029", "\\u2029");
	return new runtime.SafeString(json);
}
