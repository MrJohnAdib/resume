import { readdir } from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";
import { readValidated } from "./read-json.ts";

export async function loadItems<T, R>(
	directory: string,
	order: string[],
	schema: z.ZodType<T>,
	normalize: (id: string, value: T) => R,
) {
	if (new Set(order).size !== order.length) {
		throw new Error(`Duplicate item in layout order for ${directory}`);
	}
	const files = (await readdir(directory))
		.filter((file) => file.endsWith(".json"))
		.map((file) => [path.basename(file, ".json"), file] as const);
	const byKey = new Map(files);
	const missing = order.find((key) => !byKey.has(key));
	if (missing) throw new Error(`Missing item "${missing}" in ${directory}`);
	const unordered = files.find(([key]) => !order.includes(key));
	if (unordered) {
		throw new Error(
			`Item "${unordered[0]}" is not ordered in the active layout`,
		);
	}
	return Promise.all(
		order.map(async (id) => {
			const file = path.join(directory, byKey.get(id) as string);
			return normalize(id, await readValidated(file, schema));
		}),
	);
}
