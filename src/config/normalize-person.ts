import type { z } from "zod";
import type {
	ProfileSourceSchema,
	SummarySourceSchema,
} from "../schema/person.ts";
import { generatedKeys } from "./keys.ts";

type ProfileSource = z.infer<typeof ProfileSourceSchema>;
type SummarySource = z.infer<typeof SummarySourceSchema>;

export function normalizePerson(
	person: ProfileSource,
	summary: SummarySource,
	base = "./",
) {
	const rebase = (source: string) =>
		source.startsWith("./") ? `${base}${source.slice(2)}` : source;
	const links = generatedKeys(person.links, ({ label }) => label).map(
		([id, link]) => ({
			id,
			...link,
			icon: rebase(link.icon),
			title: link.title ?? link.label,
		}),
	);
	const avatar = person.identity.avatar;
	return {
		identity: {
			name: person.identity.name,
			title: person.identity.title,
			...(avatar
				? {
						avatar: {
							url: rebase(avatar.src),
							alt: person.identity.name,
							...(avatar.hidden ? { hidden: true as const } : {}),
						},
					}
				: {}),
		},
		contact: {
			email: {
				label: person.contact.email.label,
				href: `mailto:${person.contact.email.address}`,
			},
			phone: {
				label: person.contact.phone,
				href: `tel:${person.contact.phone.replaceAll(/[^\d+]/g, "")}`,
			},
			location: person.contact.location,
			badge: person.contact.badge,
		},
		links: { items: links },
		summary: {
			items: summary.map((item) =>
				typeof item === "string" ? { text: item } : item,
			),
		},
	};
}
