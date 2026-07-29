import { z } from "zod";

export const ResumeConfigSchema = z.object({
	$schema: z.string().optional(),
	site: z.string().min(1),
	person: z.string().min(1),
	summary: z.string().min(1),
	sections: z.object({
		experience: z.object({
			title: z.string().min(1),
			directory: z.string().min(1),
		}),
		skills: z.string().min(1),
		awards: z.string().min(1),
		education: z.string().min(1),
		volunteering: z.object({
			title: z.string().min(1),
			directory: z.string().min(1),
		}),
	}),
	layout: z.string().min(1),
});
