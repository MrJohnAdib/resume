export const layoutRoutes: Record<string, string> = {
	compact: "",
	detailed: "cv/",
};

export function layoutBase(layoutName: string) {
	return layoutRoutes[layoutName] ? "../" : "./";
}

export function siteAssets(base = "./") {
	return {
		favicon: `${base}img/favicon.png`,
		fontStylesheet: `${base}fonts/AirbnbCereal/style.css?v=19`,
		resumeStylesheet: `${base}style/style.min.css?v=19`,
		themeStylesheet: `${base}style/theme.css?v=1`,
		runtimeScript: `${base}script/resume.js?v=7`,
		icons: {
			email: `${base}img/email.svg`,
			telephone: `${base}img/tel.svg`,
			location: `${base}img/location.svg`,
			badge: `${base}img/star.svg`,
		},
		...(base === "./"
			? {}
			: { detailedStylesheet: `${base}style/detailed.css?v=3` }),
	};
}

export function pdfDefaults(base = "./") {
	return {
		folder: `${base}pdf/`,
		filePrefix: "MrAdib-Resume-",
		buttonLabel: "Download PDF",
		localAction: "print" as const,
	};
}
