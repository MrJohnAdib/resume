export function setupContactReveal() {
	const contact = document.querySelector("#contactBox");
	const phone = document.querySelector("#phoneBox");
	if (!contact || !phone) return;
	contact.addEventListener("click", () => phone.classList.remove("hidden"));
}
