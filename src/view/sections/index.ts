import type { ViewSection } from "../../render/select.ts";
import { renderAwards } from "./awards.ts";
import { renderEducation } from "./education.ts";
import { renderExperience } from "./experience.ts";
import { renderSkills } from "./skills.ts";
import { renderVolunteering } from "./volunteering.ts";

export function renderSection(section: ViewSection) {
	switch (section.id) {
		case "experience":
			return renderExperience(section);
		case "skills":
			return renderSkills(section);
		case "awards":
			return renderAwards(section);
		case "education":
			return renderEducation(section);
		case "volunteering":
			return renderVolunteering(section);
	}
}
