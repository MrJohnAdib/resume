import type { z } from "zod";
import type {
	AnalyticsSourceSchema,
	BannerSourceSchema,
	MetadataSourceSchema,
	ReleaseSourceSchema,
} from "../schema/site.ts";
import { layoutBase, pdfDefaults, siteAssets } from "./site-defaults.ts";

type SiteSources = {
	metadata: z.infer<typeof MetadataSourceSchema>;
	release: z.infer<typeof ReleaseSourceSchema>;
	analytics: z.infer<typeof AnalyticsSourceSchema>;
	banner: z.infer<typeof BannerSourceSchema>;
};

export function normalizeSite(source: SiteSources, layoutName = "compact") {
	const base = layoutBase(layoutName);
	return {
		metadata: {
			...source.metadata,
			keywords: source.metadata.keywords.join(", "),
			date: source.release.date,
		},
		assets: siteAssets(base),
		pdf: {
			...pdfDefaults(base),
			version: source.release.version,
			latestVersion: source.release.latestVersion,
		},
		analytics: {
			...source.analytics,
			enabled: true as const,
			provider: "google" as const,
		},
		banner: { ...source.banner, enabled: true as const },
	};
}
