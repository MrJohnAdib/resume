# Modular Resume

This repository builds John Adib's compact one-page resume from JSON. The
generated page preserves the original screen and print design while keeping
content, layout, templates, and browser behavior separate.

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
npm run validate     # validate every editable JSON file
npm run schema       # regenerate the editor-friendly JSON Schema
npm run build        # generate the static site and check A4 overflow
npm test             # run unit, interaction, and pixel-parity tests
npm run check        # lint, format-check, type-check, and enforce code size
```

## Structure

```text
resume.config.json       Connects data to the compact layout
data/site.json           Metadata, assets, analytics, PDF, and banner
data/person.json         Identity, contact details, and links
data/summary.json        Current and hidden summary lines
data/experience/         One complete JSON file per professional role
data/volunteering/       One complete JSON file per volunteer role
data/*.json              Skills, awards, and education
layouts/compact.json     Page settings and section/role order
src/templates/           Focused Nunjucks components
src/runtime/             Browser behavior
tests/fixtures/          Original HTML used for visual verification
```

Visible values are the default. Retained alternatives use `hidden: true` beside
their related content and are omitted from generated HTML. Keys are generated
from filenames or labels; editable data has no repeated IDs or `current` status.

See [Customization](docs/CUSTOMIZATION.md) for editing and reordering content and
[Architecture](docs/ARCHITECTURE.md) for the composition model.

## Deployment

GitHub Actions validates, builds, tests, and uploads the tested `dist/` artifact
to GitHub Pages on pushes to `main`. Pull requests run the same checks without
deploying. In a fork, select **GitHub Actions** as the Pages source.

Fonts, images, PDFs, CNAME, sitemap, cover letter, Persian resume, and auxiliary
routes are copied into every build.

## License

Licensed under the MIT License.
