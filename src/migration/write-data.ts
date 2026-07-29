import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type DataItem = Record<string, unknown> & {
	id: string;
	status?: string;
	bullets?: unknown;
	technologies?: unknown;
};

export async function writeJson(file: string, value: unknown) {
	await mkdir(path.dirname(file), { recursive: true });
	await writeFile(file, `${JSON.stringify(value, null, "\t")}\n`);
}

function sectionTitle(id: string) {
	const titles: Record<string, string> = {
		experience: "Professional Experience",
		skills: "Skills",
		awards: "Awards and Honors",
		education: "Education",
		volunteering: "Volunteer work",
	};
	return titles[id];
}

async function writeExperience(root: string, item: DataItem) {
	const { id, status, bullets, technologies, ...profile } = item;
	const directory = path.join(root, id);
	await writeJson(path.join(directory, "index.json"), {
		id,
		...(status ? { status } : {}),
		files: {
			profile: "profile.json",
			bullets: "bullets.json",
			technologies: "technologies.json",
		},
	});
	await writeJson(path.join(directory, "profile.json"), profile);
	await writeJson(path.join(directory, "bullets.json"), bullets);
	await writeJson(path.join(directory, "technologies.json"), technologies);
	return `${id}/index.json`;
}

export async function writeSection(
	root: string,
	id: string,
	items: DataItem[],
) {
	const directory = path.join(root, id);
	const files =
		id === "experience"
			? await Promise.all(items.map((item) => writeExperience(directory, item)))
			: await Promise.all(
					items.map(async (item) => {
						const file = `${item.id}.json`;
						await writeJson(path.join(directory, file), item);
						return file;
					}),
				);
	await writeJson(path.join(directory, "index.json"), {
		title: sectionTitle(id),
		items: files,
	});
}

export async function writeLayoutSection(
	root: string,
	id: string,
	selection: { items: DataItem[] },
) {
	const directory = path.join(root, id);
	const files = await Promise.all(
		selection.items.map(async (item) => {
			const file = `${item.id}.json`;
			await writeJson(path.join(directory, file), item);
			return file;
		}),
	);
	await writeJson(path.join(directory, "index.json"), { items: files });
}
