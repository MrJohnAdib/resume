import { z } from "zod";
import { AwardItemSchema } from "./section-awards.ts";
import { EducationItemSchema } from "./section-education.ts";
import { ExperienceItemSchema } from "./section-experience.ts";
import { SkillGroupSchema } from "./section-skills.ts";
import { VolunteeringItemSchema } from "./section-volunteering.ts";

function sectionOf<T extends z.ZodType>(item: T) {
	return z.object({ title: z.string(), items: z.array(item) }).loose();
}

export const SectionsSchema = z
	.object({
		experience: sectionOf(ExperienceItemSchema),
		skills: sectionOf(SkillGroupSchema),
		awards: sectionOf(AwardItemSchema),
		education: sectionOf(EducationItemSchema),
		volunteering: sectionOf(VolunteeringItemSchema),
	})
	.loose();
