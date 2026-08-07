import { readFile } from "node:fs/promises";
import type { ZodType } from "zod";
import { parseWithSource } from "../schema/errors.ts";

export async function readJson<T>(file: string): Promise<T> {
	try {
		return JSON.parse(await readFile(file, "utf8")) as T;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`Unable to read JSON configuration ${file}: ${message}`);
	}
}

export async function readValidated<T>(
	file: string,
	schema: ZodType<T>,
): Promise<T> {
	return parseWithSource(schema, await readJson(file), file);
}
