import type { z } from "zod";
import type { RoleSourceSchema } from "../schema/role.ts";
import { generatedKeys } from "./keys.ts";

type SourceRole = z.infer<typeof RoleSourceSchema>;

function dateLabel(value: string) {
	if (value === "present") return "Present";
	const [year, month] = value.split("-");
	return month ? `${month}/${year}` : year;
}

function normalizeDate(source: SourceRole["dates"]["start"]) {
	const value = typeof source === "string" ? source : source.value;
	return {
		datetime: value,
		label: typeof source === "string" ? dateLabel(value) : source.label,
	};
}

export function normalizeRole(id: string, role: SourceRole) {
	const sourceBullets = role.bullets ?? [];
	const bullets = generatedKeys(sourceBullets, (bullet) =>
		typeof bullet === "string" ? bullet : bullet.text,
	).map(([bulletId, bullet]) => ({
		id: bulletId,
		text: typeof bullet === "string" ? bullet : bullet.text,
		...(typeof bullet === "string" ? {} : bullet),
	}));
	const technologies = generatedKeys(
		role.technologies ?? [],
		(value) => value,
	).map(([technologyId, label]) => ({ id: technologyId, label }));
	const website = role.organization.website;
	return {
		id,
		title: role.title,
		organization: {
			name: role.organization.name,
			...(role.organization.url
				? { url: role.organization.url, linkEnabled: true }
				: {}),
			...(website ? { url: website.href, linkEnabled: false } : {}),
		},
		...(role.employmentType ? { employmentType: role.employmentType } : {}),
		...(role.location ? { location: role.location } : {}),
		duration: role.duration,
		dynamicDuration:
			(typeof role.dates.end === "string"
				? role.dates.end
				: role.dates.end.value) === "present",
		dates: {
			start: normalizeDate(role.dates.start),
			end: normalizeDate(role.dates.end),
		},
		bullets,
		technologies,
		...(role.hidden ? { hidden: true as const } : {}),
	};
}
