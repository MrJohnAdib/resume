import path from "node:path";
import { parseWithSource } from "../schema/errors.ts";
import {
	LayoutSectionSchema,
	LayoutSelectionSchema,
} from "../schema/layout.ts";
import { LayoutSectionManifestSchema } from "../schema/manifests.ts";
import { readJson, readValidated } from "./read-json.ts";
import { markSource } from "./source.ts";

export async function loadLayoutSection(file: string) {
	const raw = await readJson<unknown>(file);
	const manifest = parseWithSource(LayoutSectionManifestSchema, raw, file);
	const directory = path.dirname(file);
	const items = await Promise.all(
		manifest.items.map((item) => {
			if (typeof item === "string") {
				return readValidated(
					path.resolve(directory, item),
					LayoutSelectionSchema,
				);
			}
			return markSource(
				parseWithSource(LayoutSelectionSchema, item, file),
				file,
			);
		}),
	);
	const value = { items };
	parseWithSource(LayoutSectionSchema, value, file);
	return markSource(value, file);
}
