import type { z } from "zod";
import { formatDuration } from "../runtime/duration.js";
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

function dateFrom(source: SourceRole["dates"]["start"], now: Date) {
	const value = typeof source === "string" ? source : source.value;
	if (value === "present") return now;
	const [year, month = "1", day = "1"] = value.split("-");
	return new Date(Number(year), Number(month) - 1, Number(day));
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
	const now = new Date();
	const dynamicDuration =
		(typeof role.dates.end === "string"
			? role.dates.end
			: role.dates.end.value) === "present";
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
		duration: formatDuration(
			dateFrom(role.dates.start, now),
			dateFrom(role.dates.end, now),
		),
		dynamicDuration,
		dates: {
			start: normalizeDate(role.dates.start),
			end: normalizeDate(role.dates.end),
		},
		bullets,
		technologies,
		...(role.hidden ? { hidden: true as const } : {}),
		...(role.layouts ? { layouts: role.layouts } : {}),
	};
}
