import { z } from "zod";

const File = z.string().min(1);
const Section = z.object({
	title: z.string().min(1),
	directory: File,
});

export const ResumeConfigSchema = z.object({
	profile: File,
	summary: File,
	site: z.object({
		metadata: File,
		release: File,
		analytics: File,
		banner: File,
	}),
	sections: z.object({
		experience: Section,
		skills: Section,
		awards: Section.extend({ href: z.string().url() }),
		education: Section,
		volunteering: Section,
	}),
	layouts: z.array(File).min(1),
});
