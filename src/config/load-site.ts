import { parseWithSource } from "../schema/errors.ts";
import { SiteManifestSchema } from "../schema/manifests.ts";
import {
	AnalyticsSchema,
	AssetsSchema,
	BannerSchema,
	ConsoleSchema,
	MetadataSchema,
	PdfSchema,
	SiteSchema,
} from "../schema/site.ts";
import { loadProperties } from "./load-properties.ts";
import { markSource } from "./source.ts";

export async function loadSite(file: string) {
	const value = await loadProperties(file, SiteManifestSchema, {
		metadata: MetadataSchema,
		analytics: AnalyticsSchema,
		assets: AssetsSchema,
		pdf: PdfSchema,
		banner: BannerSchema,
		console: ConsoleSchema,
	});
	parseWithSource(SiteSchema, value, file);
	return markSource(value, file);
}
