import { AwardItemSchema } from "./section-awards.ts";
import { EducationItemSchema } from "./section-education.ts";
import {
	ExperienceBulletsSchema,
	ExperienceItemSchema,
	ExperienceProfileSchema,
	ExperienceTechnologiesSchema,
} from "./section-experience.ts";
import { SkillGroupSchema } from "./section-skills.ts";
import { VolunteeringItemSchema } from "./section-volunteering.ts";

export const sectionItemSchemas = {
	experience: ExperienceItemSchema,
	skills: SkillGroupSchema,
	awards: AwardItemSchema,
	education: EducationItemSchema,
	volunteering: VolunteeringItemSchema,
};

export const experienceFragmentSchemas = {
	profile: ExperienceProfileSchema,
	bullets: ExperienceBulletsSchema,
	technologies: ExperienceTechnologiesSchema,
};
