import { ZodError, type ZodType } from "zod";

function jsonPath(path: PropertyKey[]) {
	return path.reduce<string>(
		(result, part) =>
			typeof part === "number"
				? `${result}[${part}]`
				: `${result}.${String(part)}`,
		"$",
	);
}

export function parseWithSource<T>(
	schema: ZodType<T>,
	input: unknown,
	source: string,
): T {
	try {
		return schema.parse(input);
	} catch (error) {
		if (!(error instanceof ZodError)) throw error;
		const details = error.issues
			.map((issue) => `${jsonPath(issue.path)}: ${issue.message}`)
			.join("; ");
		throw new Error(`Invalid JSON configuration ${source} at ${details}`);
	}
}
