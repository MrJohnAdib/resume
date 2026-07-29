import { type Resume, ResumeSchema } from "./resume.ts";

export function validateResume(input: unknown): Resume {
	return ResumeSchema.parse(input);
}
