import path from "node:path";
import { extractLegacySections } from "../src/migration/extract-sections.ts";
import { inventoryLegacyResume } from "../src/migration/inventory.ts";
import {
	writeJson,
	writeLayoutSection,
	writeSection,
} from "../src/migration/write-data.ts";

async function main() {
	const root = process.cwd();
	const legacyFile = path.join(root, "tests/fixtures/legacy-index.html");
	const extracted = await extractLegacySections(legacyFile);
	const inventory = await inventoryLegacyResume(legacyFile);

	for (const [id, items] of Object.entries(extracted.content)) {
		await writeSection(path.join(root, "data/sections"), id, items);
		await writeLayoutSection(
			path.join(root, "layouts/compact/sections"),
			id,
			extracted.layout[id as keyof typeof extracted.layout],
		);
	}

	await writeJson(path.join(root, "data/sections/index.json"), {
		experience: "experience/index.json",
		skills: "skills/index.json",
		awards: "awards/index.json",
		education: "education/index.json",
		volunteering: "volunteering/index.json",
	});
	await writeJson(path.join(root, "data/archive/legacy-values.json"), {
		status: "archived",
		comments: inventory.commentText,
	});
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
