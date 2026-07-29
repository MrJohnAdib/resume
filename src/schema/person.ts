import { z } from "zod";
import { StableItemSchema } from "./common.ts";

export const IdentitySchema = z.object({
	name: z.string().min(1),
	title: z.string().min(1),
	avatar: z.object({
		enabled: z.boolean(),
		url: z.string().min(1),
		alt: z.string(),
	}),
});

export const ContactSchema = z.object({
	email: z.object({
		label: z.string().min(1),
		href: z.string().startsWith("mailto:"),
	}),
	phone: z.object({
		label: z.string().min(1),
		href: z.string().startsWith("tel:"),
		revealOnContactClick: z.boolean(),
		showInPrint: z.boolean(),
	}),
	location: z.string(),
	badge: z.string(),
});

export const LinkSchema = StableItemSchema.extend({
	label: z.string().min(1),
	url: z.string().url(),
	title: z.string(),
	icon: z.string().min(1),
});

export const LinksSchema = z.object({ items: z.array(LinkSchema) });
export const SummarySchema = z.object({ items: z.array(z.string().min(1)) });

export const PersonSchema = z.object({
	identity: IdentitySchema,
	contact: ContactSchema,
	links: LinksSchema,
	summary: SummarySchema,
});
