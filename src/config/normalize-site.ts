import type { z } from "zod";
import type { SiteSourceSchema } from "../schema/site.ts";

export function normalizeSite(site: z.infer<typeof SiteSourceSchema>) {
	if (!site.analytics || !site.banner || !site.console) {
		throw new Error(
			"The compact layout requires analytics, banner, and console",
		);
	}
	return {
		...site,
		analytics: {
			...site.analytics,
			enabled: true,
			provider: "google" as const,
		},
		banner: { ...site.banner, enabled: true as const },
		console: {
			...site.console,
			enabled: true as const,
			art: site.console.art.split("\n"),
		},
		pdf: { localAction: "print" as const, ...site.pdf },
	};
}
