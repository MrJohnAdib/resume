import { z } from "zod";
import {
	BulletSchema,
	DateRangeSchema,
	OrganizationSchema,
	StableItemSchema,
} from "./common.ts";

export const VolunteeringItemSchema = StableItemSchema.extend({
	title: z.string().min(1),
	organization: OrganizationSchema,
	location: z.string(),
	duration: z.string(),
	dynamicDuration: z.boolean(),
	dates: DateRangeSchema,
	bullets: z.array(BulletSchema),
});
