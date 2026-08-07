import { ResumeConfigSchema } from "../schema/config.ts";
import { loadResumeConfig } from "./load.ts";
import { readValidated } from "./read-json.ts";

export async function loadResumeLayouts(entryFile: string) {
	const entry = await readValidated(entryFile, ResumeConfigSchema);
	return Promise.all(
		entry.layouts.map((layout) => loadResumeConfig(entryFile, layout)),
	);
}
