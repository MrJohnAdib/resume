import type { z } from "zod";
import type {
	PersonSourceSchema,
	SummarySourceSchema,
} from "../schema/person.ts";
import { generatedKeys } from "./keys.ts";

type PersonSource = z.infer<typeof PersonSourceSchema>;
type SummarySource = z.infer<typeof SummarySourceSchema>;

export function normalizePerson(person: PersonSource, summary: SummarySource) {
	const links = generatedKeys(person.links, ({ label }) => label).map(
		([id, link]) => ({
			id,
			...link,
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
							url: avatar.src,
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
