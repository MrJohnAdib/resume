import { z } from "zod";
import { HiddenFields, LayoutFields, SlugSchema } from "./common.ts";

const AvatarSourceSchema = z.object({
	src: z.string().min(1),
	...HiddenFields,
});

const LinkSourceSchema = z.object({
	label: z.string().min(1),
	url: z.string().url(),
	icon: z.string().min(1),
	title: z.string().min(1).optional(),
	...HiddenFields,
});

export const ProfileSourceSchema = z.object({
	identity: z.object({
		name: z.string().min(1),
		title: z.string().min(1),
		avatar: AvatarSourceSchema.optional(),
	}),
	contact: z.object({
		email: z.object({
			label: z.string().min(1),
			address: z.string().email(),
		}),
		phone: z.string().min(1),
		location: z.string().min(1),
		badge: z.string().min(1),
	}),
	links: z.array(LinkSourceSchema).min(1),
});

export const SummarySourceSchema = z.array(
	z.union([
		z.string().min(1),
		z.object({ text: z.string().min(1), ...HiddenFields, ...LayoutFields }),
	]),
);

export const PersonSchema = z.object({
	identity: z.object({
		name: z.string(),
		title: z.string(),
		avatar: z
			.object({
				url: z.string(),
				alt: z.string(),
				...HiddenFields,
			})
			.optional(),
	}),
	contact: z.object({
		email: z.object({ label: z.string(), href: z.string() }),
		phone: z.object({ label: z.string(), href: z.string() }),
		location: z.string(),
		badge: z.string(),
	}),
	links: z.object({
		items: z.array(
			z.object({
				id: SlugSchema,
				label: z.string(),
				url: z.string(),
				icon: z.string(),
				title: z.string().optional(),
				...HiddenFields,
			}),
		),
	}),
	summary: z.object({
		items: z.array(
			z.object({ text: z.string(), ...HiddenFields, ...LayoutFields }),
		),
	}),
});
