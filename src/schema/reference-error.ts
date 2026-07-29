import { sourceOf } from "../config/source.ts";

export function referenceError(owner: unknown, path: string, message: string) {
	const source = sourceOf(owner) ?? "composed resume configuration";
	return new Error(`${message}: ${source} at ${path}`);
}
