import { z } from "zod";
import {
	BulletSchema,
	DateRangeSchema,
	OrganizationSchema,
	StableItemSchema,
	TechnologySchema,
} from "./common.ts";

export const ExperienceProfileSchema = z
	.object({
		title: z.string().min(1),
		organization: OrganizationSchema,
		employmentType: z.string(),
		location: z.string(),
		duration: z.string(),
		dynamicDuration: z.boolean(),
		dates: DateRangeSchema,
	})
	.strict();

export const ExperienceBulletsSchema = z.array(BulletSchema);
export const ExperienceTechnologiesSchema = z.array(TechnologySchema);

export const ExperienceItemSchema = StableItemSchema.extend({
	...ExperienceProfileSchema.shape,
	bullets: ExperienceBulletsSchema,
	technologies: ExperienceTechnologiesSchema,
});
