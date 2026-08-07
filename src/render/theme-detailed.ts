export function renderDetailedCss() {
	return [
		"@media screen{",
		"#printArea[data-layout=detailed]{display:flex;flex-direction:column;gap:20px;",
		"height:auto;min-height:auto;box-shadow:none;border-radius:0;overflow:visible;background:none}",
		"body{counter-reset:page}",
		".page{width:100%;min-height:var(--resume-page-height);position:relative;",
		"background-color:var(--resume-page-background);box-shadow:0 0 5px rgba(0,0,0,20%);",
		"border-radius:10px;overflow:hidden}",
		'.page::after{content:"Page " counter(page);counter-increment:page;position:absolute;',
		"bottom:10px;right:20px;font-size:10px;color:var(--resume-muted)}",
		"}",
		"@media print{",
		"#printArea[data-layout=detailed]{width:100%;min-width:0;height:auto}",
		".page{box-shadow:none;border-radius:0;min-height:auto;page-break-after:always;break-after:page}",
		".page:last-child{page-break-after:auto;break-after:auto}",
		".page::after{display:none!important}",
		"h2,h3{page-break-after:avoid;break-after:avoid}",
		"[data-item-id]{page-break-inside:avoid;break-inside:avoid}",
		"*{-webkit-print-color-adjust:exact;print-color-adjust:exact}",
		"}",
	].join("");
}
