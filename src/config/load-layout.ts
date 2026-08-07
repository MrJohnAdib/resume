import path from "node:path";
import { parseWithSource } from "../schema/errors.ts";
import { LayoutSourceSchema } from "../schema/layout.ts";
import { readJson } from "./read-json.ts";

export async function loadLayout(file: string) {
	const source = await readJson<Record<string, unknown>>(file);
	const order =
		typeof source.order === "string"
			? await readJson(path.resolve(path.dirname(file), source.order))
			: source.order;
	const layout = parseWithSource(
		LayoutSourceSchema,
		{ ...source, order },
		file,
	);
	return { name: path.basename(file, ".json"), ...layout };
}
