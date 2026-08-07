import path from "node:path";
import { checkBuiltAssets } from "../src/build/assets.ts";

checkBuiltAssets(path.resolve("dist")).catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
