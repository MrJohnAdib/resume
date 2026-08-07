import type { CompactView } from "../render/select.ts";
import { escapeHtml as e } from "./html.ts";

export function renderAnalytics(analytics: CompactView["site"]["analytics"]) {
	if (!analytics.enabled) return "";
	const id = e(analytics.measurementId);
	return `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag("js", new Date());
	gtag("config", "${id}");
</script>`;
}
