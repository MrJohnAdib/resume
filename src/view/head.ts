import type { CompactView } from "../render/select.ts";
import { escapeHtml as e } from "./html.ts";

export function renderHead({ metadata, assets }: CompactView["site"]) {
	return `<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5" />
	<title>${e(metadata.title)}</title>
	<meta name="description" content="${e(metadata.description)}" />
	<meta name="keywords" content="${e(metadata.keywords)}" />
	<meta name="date" content="${e(metadata.date)}" />
	<meta property="og:title" content="${e(metadata.socialTitle)}" />
	<meta property="og:type" content="document" />
	<meta property="og:url" content="${e(metadata.url)}" />
	<meta property="og:image" content="${e(metadata.image)}" />
	<meta property="og:description" content="${e(metadata.socialDescription)}" />
	<meta name="twitter:card" content="${e(metadata.twitterCard)}" />
	<meta name="twitter:url" content="${e(metadata.url)}" />
	<meta name="twitter:title" content="${e(metadata.socialTitle)}" />
	<meta name="twitter:description" content="${e(metadata.socialDescription)}" />
	<meta name="twitter:image" content="${e(metadata.image)}" />
	<meta name="author" content="${e(metadata.author)}" />
	<link href="${e(metadata.authorUrl)}" rel="author" />
	<link href="${e(assets.favicon)}" type="image/png" rel="icon" />
	<link rel="stylesheet" href="${e(assets.fontStylesheet)}" />
	<link rel="stylesheet" href="${e(assets.resumeStylesheet)}" />
	<link rel="stylesheet" href="${e(assets.themeStylesheet)}" />
</head>`;
}
