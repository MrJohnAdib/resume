import { parseWithSource } from "../schema/errors.ts";
import { PersonManifestSchema } from "../schema/manifests.ts";
import {
	ContactSchema,
	IdentitySchema,
	LinksSchema,
	PersonSchema,
	SummarySchema,
} from "../schema/person.ts";
import { loadProperties } from "./load-properties.ts";
import { markSource } from "./source.ts";

export async function loadPerson(file: string) {
	const value = await loadProperties(file, PersonManifestSchema, {
		identity: IdentitySchema,
		contact: ContactSchema,
		links: LinksSchema,
		summary: SummarySchema,
	});
	parseWithSource(PersonSchema, value, file);
	return markSource(value, file);
}
