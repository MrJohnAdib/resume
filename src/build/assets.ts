import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";

function isLocal(reference: string) {
	return !/^(?:[a-z]+:|\/\/|#)/i.test(reference);
}

function assetPath(reference: string, root: string, source: string) {
	const clean = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
	const base = clean.startsWith("/")
		? root
		: path.join(root, path.dirname(source));
	return path.resolve(base, clean.replace(/^\/+/, ""));
}

async function checkReferences(
	references: Iterable<string>,
	root: string,
	source: string,
) {
	for (const reference of references) {
		if (!isLocal(reference)) continue;
		const target = assetPath(reference, root, source);
		const display = path.relative(root, target);
		if (display === ".." || display.startsWith(`..${path.sep}`)) {
			throw new Error(
				`${source} references asset outside build root ${reference}`,
			);
		}
		try {
			await access(target);
		} catch {
			throw new Error(`${source} references missing asset ${display}`);
		}
	}
}

export async function checkHtmlAssets(
	html: string,
	root: string,
	source: string,
) {
	const $ = load(html);
	const references = new Set<string>();
	$("[src], [href]").each((_, element) => {
		for (const attribute of ["src", "href"]) {
			const value = $(element).attr(attribute)?.trim();
			if (value) references.add(value);
		}
	});
	await checkReferences(references, root, source);
}

export async function checkCssAssets(
	css: string,
	root: string,
	source: string,
) {
	const references = [...css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map(
		(match) => match[1],
	);
	await checkReferences(references, root, source);
}

async function assetFiles(root: string, directory = root): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const target = path.join(directory, entry.name);
		const experimental =
			directory === root && entry.name === "multi-page-resume";
		if (entry.isDirectory() && !experimental) {
			files.push(...(await assetFiles(root, target)));
		}
		if (
			entry.isFile() &&
			[".css", ".html"].includes(path.extname(entry.name))
		) {
			files.push(path.relative(root, target));
		}
	}
	return files;
}

export async function checkBuiltAssets(root: string) {
	for (const source of await assetFiles(root)) {
		const content = await readFile(path.join(root, source), "utf8");
		if (source.endsWith(".html")) {
			await checkHtmlAssets(content, root, source);
		} else {
			await checkCssAssets(content, root, source);
		}
	}
}
