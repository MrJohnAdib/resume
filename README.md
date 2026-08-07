# Modular Resume

This repository builds John Adib's compact one-page resume from focused JSON
files. The generated page preserves the original screen and print design while
keeping content, layout, rendering, and browser behavior separate.

## Quick start

Requirements: Node.js 22 or newer and npm 11.

```bash
npm ci
npx playwright install chromium
npm run dev
```

Open <http://localhost:4173>. The production site is generated in `dist/`.

## Commands

```bash
npm run validate     # validate every editable JSON file with Zod
npm run build        # generate the static site and check A4 overflow
npm test             # run unit, interaction, and pixel-parity tests
npm run check        # lint, format-check, type-check, and enforce file size
```

## Structure

```text
resume.config.json       Connects focused data to the layouts
data/profile.json        Identity, contact details, and links
data/summary.json        Current and hidden summary lines
data/site/               Metadata, release, analytics, and banner content
data/experience/         One complete JSON file per professional role
data/volunteering/       One complete JSON file per volunteer role
data/skills/             One JSON file per skill group
data/awards/             One JSON file per award
data/education/          One JSON file per degree
layouts/order.json       Shared record order for every layout
layouts/compact.json     One-page layout served at /
layouts/detailed.json    Three-page layout served at /cv/
src/schema/              Focused Zod validation modules
src/view/                Small TypeScript HTML components
src/runtime/             Browser behavior
tests/fixtures/          Original HTML used for visual verification
```

Visible values are the default. Retained alternatives use `hidden: true` beside
their related content and are omitted from generated HTML. IDs are generated
from filenames or labels; editable data has no repeated IDs, status, or
hardcoded duration.

See [Customization](docs/CUSTOMIZATION.md) for editing content and
[Architecture](docs/ARCHITECTURE.md) for the composition model.

## Deployment

GitHub Actions validates, builds, tests, and uploads the tested `dist/` artifact
to GitHub Pages on pushes to `main`. Pull requests run the same checks without
deploying. In a fork, select **GitHub Actions** as the Pages source.

Fonts, images, PDFs, CNAME, sitemap, cover letter, Persian resume, and auxiliary
routes are copied into every build.

## License

Licensed under the MIT License.
