import { z } from "zod";

export const ResumeConfigSchema = z.object({
	$schema: z.string().optional(),
	schemaVersion: z.literal("1.0.0"),
	site: z.string().min(1),
	person: z.string().min(1),
	sections: z.string().min(1),
	layout: z.string().min(1),
});
