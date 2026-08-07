import { renderSite } from "./render.ts";

renderSite().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
