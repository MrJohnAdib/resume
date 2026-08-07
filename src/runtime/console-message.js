const messages = [
	"What are you searching for here? 😎",
	"If you need more info about me, check out my website at https://mradib.com",
	"If you like it, you can fork this one-page resume repository or give me a star on GitHub https://github.com/MrJohnAdib/resume",
];
const art = `

		888b     d888                d8888      888 d8b 888
		8888b   d8888              d88888      888 Y8P 888
		88888b.d88888              d88P888      888     888
		888Y88888P888 888d888     d88P 888  .d88888 888 88888b.       .d8888b  .d88b.  88888b.d88b.
		888 Y888P 888 888P"      d88P  888 d88" 888 888 888 "88b     d88P"    d88""88b 888 "888 "88b
		888  Y8P  888 888       d88P   888 888  888 888 888  888     888      888  888 888  888  888
		888   "   888 888      d8888888888 Y88b 888 888 888 d88P d8b Y88b.    Y88..88P 888  888  888
		888       888 888     d88P     888  "Y88888 888 88888P"  Y8P  "Y8888P  "Y88P"  888  888  888

		oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

		
`;

export function showConsoleMessage() {
	for (const message of messages) console.log(message);
	console.log(art);
}
