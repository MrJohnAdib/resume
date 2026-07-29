import path from "node:path";
import type { ZodType } from "zod";
import { parseWithSource } from "../schema/errors.ts";
import { ItemManifestSchema } from "../schema/manifests.ts";
import { readJson, readValidated } from "./read-json.ts";
import { markSource } from "./source.ts";

type FragmentSchemas = Record<string, ZodType>;

export async function loadItem(
	file: string,
	schema: ZodType,
	fragments: FragmentSchemas = {},
): Promise<unknown> {
	const raw = await readJson<unknown>(file);
	const object =
		typeof raw === "object" && raw !== null
			? (raw as Record<string, unknown>)
			: {};
	if (!object.files) {
		return readValidated(file, schema);
	}
	const manifest = parseWithSource(ItemManifestSchema, raw, file);
	const directory = path.dirname(file);
	const loaded = await Promise.all(
		Object.entries(manifest.files).map(async ([key, source]) => {
			const fragmentFile = path.resolve(directory, source);
			const fragmentSchema = fragments[key];
			const value = fragmentSchema
				? await readValidated(fragmentFile, fragmentSchema)
				: await readJson<unknown>(fragmentFile);
			return [key, value] as const;
		}),
	);
	const composed: Record<string, unknown> = { id: manifest.id };
	if (manifest.status) composed.status = manifest.status;
	for (const [key, fragment] of loaded) {
		if (key === "profile" && fragment && !Array.isArray(fragment)) {
			Object.assign(composed, fragment);
		} else {
			composed[key] = fragment;
		}
	}
	parseWithSource(schema, composed, file);
	return markSource(composed, file);
}
