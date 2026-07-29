import { getRuntimeConfig } from "./config.js";

export function showConsoleMessage() {
	const config = getRuntimeConfig().console;
	if (!config.enabled) return;
	for (const message of config.messages) console.log(message);
	console.log(config.art.join("\n"));
}
