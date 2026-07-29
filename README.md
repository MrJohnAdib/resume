# Modular Resume

This repository builds John Adib's compact one-page resume from small JSON files.
The generated page preserves the original screen and print design while keeping
content, layout selection, templates, and runtime behavior separate.

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
npm run validate     # validate data and cross-file IDs
npm run schema       # regenerate editor-friendly JSON Schemas
npm run build        # generate the complete static site and check A4 overflow
npm test             # run unit, integration, interaction, and visual tests
npm run check        # lint, format-check, and enforce file length
```

## Structure

```text
resume.config.json       Composes the site, person, content, and layout indexes
data/                    Reusable content and archived legacy values
layouts/compact/         One-page selection, ordering, and theme
src/templates/           Small Nunjucks components
src/runtime/             Browser behavior
scripts/                 Validation, generation, and build entry points
tests/fixtures/          Archived original HTML used for parity verification
dist/                    Generated deployable site
```

Content exists independently of presentation. A record is rendered only when its
stable ID is selected by the active layout. This replaces ordinary `hidden`
content toggles; the phone and runtime-disabled PDF button are the only stateful
exceptions.

See [Customization](docs/CUSTOMIZATION.md) for adding and reordering content and
[Architecture](docs/ARCHITECTURE.md) for the composition model.

## Deployment

The GitHub Actions workflow validates, builds, tests, and uploads the tested
`dist/` directory to GitHub Pages on pushes to `main`. Pull requests run the same
checks without deploying. In a fork, select **GitHub Actions** as the Pages source
in the repository settings.

The existing fonts, images, PDFs, CNAME, sitemap, cover letter, Persian resume,
and auxiliary routes are copied into every build.

## License

Licensed under the MIT License.
