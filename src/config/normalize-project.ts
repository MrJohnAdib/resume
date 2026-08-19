import type { z } from "zod";
import type { ProjectSourceSchema } from "../schema/section-projects.ts";
import { generatedKeys } from "./keys.ts";

type SourceProject = z.infer<typeof ProjectSourceSchema>;

export function normalizeProject(id: string, project: SourceProject) {
	const bullets = generatedKeys(project.bullets, (bullet) =>
		typeof bullet === "string" ? bullet : bullet.text,
	).map(([bulletId, bullet]) => ({
		id: bulletId,
		text: typeof bullet === "string" ? bullet : bullet.text,
		...(typeof bullet === "string" ? {} : bullet),
	}));
	const technologies = generatedKeys(
		project.technologies ?? [],
		(value) => value,
	).map(([technologyId, label]) => ({ id: technologyId, label }));
	return {
		id,
		...(project.title ? { title: project.title } : {}),
		bullets,
		technologies,
		...(project.hidden ? { hidden: true as const } : {}),
		...(project.layouts ? { layouts: project.layouts } : {}),
	};
}
