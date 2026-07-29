import { readdir } from "node:fs/promises";
import path from "node:path";
import { RoleSourceSchema } from "../schema/role.ts";
import { normalizeRole } from "./normalize-role.ts";
import { readValidated } from "./read-json.ts";

export async function loadRoles(directory: string, order: string[]) {
	if (new Set(order).size !== order.length) {
		throw new Error(`Duplicate role in layout order for ${directory}`);
	}
	const files = (await readdir(directory))
		.filter((file) => file.endsWith(".json"))
		.map((file) => [path.basename(file, ".json"), file] as const);
	const byKey = new Map(files);
	const missing = order.find((key) => !byKey.has(key));
	if (missing) throw new Error(`Missing role "${missing}" in ${directory}`);
	const unordered = files.find(([key]) => !order.includes(key));
	if (unordered) {
		throw new Error(
			`Role "${unordered[0]}" is not ordered in the active layout`,
		);
	}
	return Promise.all(
		order.map(async (id) => {
			const file = path.join(directory, byKey.get(id) as string);
			return normalizeRole(id, await readValidated(file, RoleSourceSchema));
		}),
	);
}
