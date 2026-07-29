import path from "node:path";
import { parseWithSource } from "../schema/errors.ts";
import {
	SectionManifestSchema,
	SectionsManifestSchema,
} from "../schema/manifests.ts";
import {
	experienceFragmentSchemas,
	sectionItemSchemas,
} from "../schema/section-map.ts";
import { SectionsSchema } from "../schema/sections.ts";
import { loadItem } from "./load-item.ts";
import { readValidated } from "./read-json.ts";
import { markSource } from "./source.ts";

export async function loadSections(file: string) {
	const manifest = await readValidated(file, SectionsManifestSchema);
	const directory = path.dirname(file);
	const entries = await Promise.all(
		Object.entries(manifest).map(async ([id, source]) => {
			const schema = sectionItemSchemas[id as keyof typeof sectionItemSchemas];
			if (!schema) throw new Error(`Unknown section ID "${id}" in ${file}`);
			const sectionFile = path.resolve(directory, source);
			const section = await readValidated(sectionFile, SectionManifestSchema);
			const itemDirectory = path.dirname(sectionFile);
			const items = await Promise.all(
				section.items.map((item) =>
					loadItem(
						path.resolve(itemDirectory, item),
						schema,
						id === "experience" ? experienceFragmentSchemas : {},
					),
				),
			);
			return [id, { ...section, items }] as const;
		}),
	);
	const value = Object.fromEntries(entries);
	parseWithSource(SectionsSchema, value, file);
	return markSource(value, file);
}
