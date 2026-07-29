import { sourceOf } from "../config/source.ts";
import { parseWithSource } from "./errors.ts";
import { assertUniqueLayoutIds } from "./layout-uniqueness.ts";
import { assertLayoutReferences } from "./references.ts";
import { type Resume, ResumeSchema } from "./resume.ts";
import { assertUniqueIds } from "./uniqueness.ts";

export function validateResume(
	input: unknown,
	source = "composed resume configuration",
): Resume {
	const resume = parseWithSource(ResumeSchema, input, source);
	const references = sourceOf(input) ? (input as Resume) : resume;
	assertUniqueIds(references);
	assertUniqueLayoutIds(references);
	assertLayoutReferences(references);
	return resume;
}
