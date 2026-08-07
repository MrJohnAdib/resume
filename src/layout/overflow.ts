export type Bounds = {
	id?: string;
	sectionId?: string;
	top: number;
	right: number;
	bottom: number;
	left: number;
};

export function findOverflow(page: Bounds, items: Bounds[], tolerance = 1) {
	return items.find(
		(item) =>
			item.bottom > page.bottom + tolerance ||
			item.right > page.right + tolerance ||
			item.left < page.left - tolerance ||
			item.top < page.top - tolerance,
	);
}
