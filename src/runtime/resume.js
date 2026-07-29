import { showConsoleMessage } from "./console-message.js";
import { setupContactReveal } from "./contact.js";
import { updateDurations } from "./duration.js";
import { setupPdfButton } from "./pdf.js";
import { setupPrintTitle } from "./print-title.js";

showConsoleMessage();
setupContactReveal();
setupPdfButton();
setupPrintTitle();
updateDurations();
