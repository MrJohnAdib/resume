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

export async function startVisualServer() {
	const server = createServer(async (request, response) => {
		try {
			const url = new URL(request.url ?? "/", "http://localhost");
			let file = path.join("dist", url.pathname);
			if (url.pathname === "/legacy") {
				file = "tests/fixtures/legacy-index.html";
			}
			if (url.pathname === "/legacy-style/style.min.css") {
				file = "style/style.min.css";
			}
			if (url.pathname === "/script/script.js") {
				file = "tests/fixtures/legacy-script.js";
			}
			if (url.pathname === "/generated") file = "dist/index.html";
			let body = await readFile(path.resolve(file));
			if (url.pathname === "/legacy") {
				body = Buffer.from(
					body
						.toString()
						.replace(
							"./style/style.min.css?v=19",
							"/legacy-style/style.min.css",
						),
				);
			}
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
