import type { DetailedView } from "../render/detailed-select.ts";
import { jsonScript } from "../render/json-script.ts";
import { renderAnalytics } from "./analytics.ts";
import { renderBanner } from "./banner.ts";
import { renderCvHeader } from "./cv/header.ts";
import { renderCvSection } from "./cv/sections.ts";
import { renderHead } from "./head.ts";
import { escapeHtml as e } from "./html.ts";

function renderSheet(view: DetailedView, page: DetailedView["pages"][number]) {
	return `<div class="page" data-page="${page.number}">
					${page.number === 1 ? renderCvHeader(view) : ""}
					<main class="cv-main">
						${page.sections.map(renderCvSection).join("")}
					</main>
				</div>`;
}

export function renderDetailedPage(view: DetailedView) {
	return `<!doctype html>
<html lang="${e(view.site.metadata.language)}" dir="${e(view.site.metadata.direction)}" prefix="og: http://ogp.me/ns#">
	${renderHead(view.site)}
	<body>
		${renderBanner(view.site)}
		<div id="pageContainer" class="overflow-auto">
			<div id="printArea" data-size="A4" data-layout="detailed" data-layout-label="Detailed" data-overflow-policy="error" data-page-width="210mm" data-page-height="296mm">
				${view.pages.map((page) => renderSheet(view, page)).join("")}
			</div>
		</div>
		<script id="runtime-config" type="application/json">${jsonScript(view.runtimeConfig)}</script>
		<script type="module" src="${e(view.site.assets.runtimeScript)}"></script>
		${renderAnalytics(view.site.analytics)}
	</body>
</html>`;
}
