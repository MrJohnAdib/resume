import path from "node:path";
import { parseWithSource } from "../schema/errors.ts";
import {
	LayoutLinksSchema,
	LayoutSchema,
	PageSchema,
	SectionOrderSchema,
	ThemeSchema,
	TypographySchema,
} from "../schema/layout.ts";
import { LayoutManifestSchema } from "../schema/manifests.ts";
import { loadLayoutSection } from "./load-layout-section.ts";
import { readValidated } from "./read-json.ts";
import { markSource } from "./source.ts";

export async function loadLayout(file: string) {
	const manifest = await readValidated(file, LayoutManifestSchema);
	const directory = path.dirname(file);
	const sections = await Promise.all(
		Object.entries(manifest.sections).map(async ([id, source]) => [
			id,
			await loadLayoutSection(path.resolve(directory, source)),
		]),
	);
	const value = {
		page: await readValidated(
			path.resolve(directory, manifest.page),
			PageSchema,
		),
		theme: await readValidated(
			path.resolve(directory, manifest.theme),
			ThemeSchema,
		),
		typography: await readValidated(
			path.resolve(directory, manifest.typography),
			TypographySchema,
		),
		sectionOrder: await readValidated(
			path.resolve(directory, manifest.sectionOrder),
			SectionOrderSchema,
		),
		links: await readValidated(
			path.resolve(directory, manifest.links),
			LayoutLinksSchema,
		),
		sections: Object.fromEntries(sections),
	};
	parseWithSource(LayoutSchema, value, file);
	return markSource(value, file);
}
