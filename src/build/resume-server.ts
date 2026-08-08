import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const contentTypes: Record<string, string> = {
	".css": "text/css",
	".html": "text/html",
	".js": "text/javascript",
	".jpg": "image/jpeg",
	".png": "image/png",
	".svg": "image/svg+xml",
	".woff": "font/woff",
	".woff2": "font/woff2",
};

export async function startResumeServer(
	output = path.resolve("dist"),
	baseline = path.resolve("tests/fixtures/baseline-index.html"),
) {
	const server = createServer(async (request, response) => {
		try {
			const url = new URL(request.url ?? "/", "http://localhost");
			let file = path.join(output, url.pathname);
			if (url.pathname.endsWith("/")) file = path.join(file, "index.html");
			if (url.pathname === "/baseline") file = baseline;
			if (url.pathname === "/generated") {
				file = path.join(output, "index.html");
			}
			const body = await readFile(file);
			response.setHeader(
				"content-type",
				contentTypes[path.extname(file)] ?? "application/octet-stream",
			);
			response.end(request.method === "HEAD" ? undefined : body);
		} catch {
			response.statusCode = 404;
			response.end();
		}
	});
	await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
	const address = server.address();
	if (!address || typeof address === "string")
		throw new Error("Missing address");
	return {
		url: `http://127.0.0.1:${address.port}`,
		close: () => new Promise<void>((resolve) => server.close(() => resolve())),
	};
}
