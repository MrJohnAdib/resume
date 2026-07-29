import { z } from "zod";
import { StableItemSchema, TechnologySchema } from "./common.ts";

const SkillSchema = TechnologySchema.extend({
	title: z.string(),
	separatorAfter: z.string(),
});

export const SkillGroupSchema = StableItemSchema.extend({
	title: z.string().min(1),
	items: z.array(SkillSchema),
});
