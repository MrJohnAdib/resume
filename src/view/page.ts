import { jsonScript } from "../render/json-script.ts";
import type { CompactView } from "../render/select.ts";
import { renderAnalytics } from "./analytics.ts";
import { renderBanner } from "./banner.ts";
import { renderHead } from "./head.ts";
import { renderHeader } from "./header.ts";
import { escapeHtml as e } from "./html.ts";
import { renderSection } from "./sections/index.ts";

function column(sections: CompactView["leftSections"]) {
	return `<div class="basis-1/2">${sections.map(renderSection).join("")}</div>`;
}

export function renderPage(view: CompactView) {
	return `<!doctype html>
<html lang="${e(view.site.metadata.language)}" dir="${e(view.site.metadata.direction)}" prefix="og: http://ogp.me/ns#">
	${renderHead(view.site)}
	<body>
		${renderBanner(view.site, view.layout.name)}
		<div id="pageContainer" class="overflow-auto">
			<div id="printArea" data-size="A4" data-layout-label="Compact" data-overflow-policy="error" data-page-width="210mm" data-page-height="296mm">
				${renderHeader(view)}
				<main class="flex space-x-4 mx-6 mt-4 mb-4 bg-white">
					${column(view.leftSections)}
					${column(view.rightSections)}
				</main>
			</div>
		</div>
		<script id="runtime-config" type="application/json">${jsonScript(view.runtimeConfig)}</script>
		<script type="module" src="${e(view.site.assets.runtimeScript)}"></script>
		${renderAnalytics(view.site.analytics)}
	</body>
</html>`;
}
