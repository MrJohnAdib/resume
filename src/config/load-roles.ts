import { RoleSourceSchema } from "../schema/role.ts";
import { loadItems } from "./load-items.ts";
import { normalizeRole } from "./normalize-role.ts";

export async function loadRoles(directory: string, order: string[]) {
	return loadItems(directory, order, RoleSourceSchema, normalizeRole);
}
