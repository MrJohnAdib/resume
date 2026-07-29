import path from "node:path";
import type { ZodType } from "zod";
import { readValidated } from "./read-json.ts";
import { markSource } from "./source.ts";

export async function loadProperties<T extends Record<string, string>>(
	manifestFile: string,
	manifestSchema: ZodType<T>,
	schemas: Record<string, ZodType>,
) {
	const manifest = await readValidated(manifestFile, manifestSchema);
	const directory = path.dirname(manifestFile);
	const entries = await Promise.all(
		Object.entries(manifest).map(async ([key, source]) => {
			const schema = schemas[key];
			if (!schema)
				throw new Error(`Missing schema for ${manifestFile}#$.${key}`);
			const file = path.resolve(directory, source);
			return [key, await readValidated(file, schema)] as const;
		}),
	);
	return markSource(Object.fromEntries(entries), manifestFile);
}
