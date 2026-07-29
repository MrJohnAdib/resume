import { z } from "zod";

const FileSchema = z.string().min(1);

export const SiteManifestSchema = z.object({
	metadata: FileSchema,
	analytics: FileSchema,
	assets: FileSchema,
	pdf: FileSchema,
	banner: FileSchema,
	console: FileSchema,
});

export const PersonManifestSchema = z.object({
	identity: FileSchema,
	contact: FileSchema,
	links: FileSchema,
	summary: FileSchema,
});

export const SectionsManifestSchema = z.record(z.string(), FileSchema);

export const SectionManifestSchema = z.object({
	title: z.string().min(1),
	items: z.array(FileSchema),
});

export const ItemManifestSchema = z.object({
	id: z.string().min(1),
	status: z.enum(["current", "alternate", "archived"]).optional(),
	files: z.record(z.string(), FileSchema),
});

export const LayoutManifestSchema = z.object({
	page: FileSchema,
	theme: FileSchema,
	typography: FileSchema,
	sectionOrder: FileSchema,
	links: FileSchema,
	sections: z.record(z.string(), FileSchema),
});

export const LayoutSectionManifestSchema = z.object({
	items: z.array(z.union([FileSchema, z.object({ id: z.string() }).loose()])),
});
