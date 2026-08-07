export const siteAssets = {
	favicon: "./img/favicon.png",
	fontStylesheet: "./fonts/AirbnbCereal/style.css?v=19",
	resumeStylesheet: "./style/style.min.css?v=19",
	themeStylesheet: "./style/theme.css?v=1",
	runtimeScript: "./script/resume.js?v=7",
	icons: {
		email: "./img/email.svg",
		telephone: "./img/tel.svg",
		location: "./img/location.svg",
		badge: "./img/star.svg",
	},
};

export const pdfDefaults = {
	folder: "./pdf/",
	filePrefix: "MrAdib-Resume-",
	buttonLabel: "Download PDF",
	localAction: "print" as const,
};
