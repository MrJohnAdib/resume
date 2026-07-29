import path from "node:path";
import { ResumeConfigSchema } from "../schema/config.ts";
import { loadLayout } from "./load-layout.ts";
import { loadPerson } from "./load-person.ts";
import { loadSections } from "./load-sections.ts";
import { loadSite } from "./load-site.ts";
import { readValidated } from "./read-json.ts";
import { markSource } from "./source.ts";

export async function loadResumeConfig(entryFile: string): Promise<unknown> {
	const entry = await readValidated(entryFile, ResumeConfigSchema);
	const root = path.dirname(entryFile);
	return markSource(
		{
			schemaVersion: entry.schemaVersion,
			site: await loadSite(path.resolve(root, entry.site)),
			person: await loadPerson(path.resolve(root, entry.person)),
			sections: await loadSections(path.resolve(root, entry.sections)),
			layout: await loadLayout(path.resolve(root, entry.layout)),
		},
		entryFile,
	);
}
