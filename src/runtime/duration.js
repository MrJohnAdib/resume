/**
 * @param {Date} startDate
 * @param {Date} endDate
 */
export function formatDuration(startDate, endDate) {
	const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
	const end = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1);
	const totalMonths =
		(end.getFullYear() - start.getFullYear()) * 12 +
		end.getMonth() -
		start.getMonth();
	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;
	const yearText = years === 1 ? "1 year" : `${years} years`;
	const monthText = months === 1 ? "1 month" : `${months} months`;
	const value = [years ? yearText : "", months ? monthText : ""]
		.filter(Boolean)
		.join(" ");
	return `(${value || "0 months"})`;
}

/** @param {Date} [now] */
export function updateDurations(now = new Date()) {
	for (const element of document.querySelectorAll("[data-duration]")) {
		const times = element.parentElement?.querySelectorAll("time[datetime]");
		if (!times || times.length < 2) continue;
		if (times[1].getAttribute("datetime") !== "present") continue;
		const start = times[0].getAttribute("datetime");
		if (start) element.textContent = formatDuration(new Date(start), now);
	}
}
