# Architecture

`resume.config.json` is the only root entry point. It resolves four independent
domains:

```text
site index ────── metadata, analytics, assets, PDF, banner
person index ──── identity, contact, links, summary
section index ─── reusable experience, skills, awards, education, volunteering
layout index ──── page, theme, typography, links, section and item selections
```

The recursive loader reads each referenced file, validates its local shape, and
then composes the complete model. Stable IDs connect layout selections to content.
Duplicate IDs and missing references are errors.

The compact renderer receives only selected records in layout order. Nunjucks
components own markup, generated theme CSS owns semantic design values, and
runtime modules own interactive behavior. Content files never contain arbitrary
HTML; rich text uses validated abbreviation and superscript fragments.

Each referenced file is validated as it is loaded, so failures report its real
source path and JSON path. Cross-file link, field, item, bullet, coursework,
skill, and technology references are then checked before rendering.

`dist/` is disposable build output. The build copies static routes and assets,
generates HTML and CSS, and checks the printed sheet for overflow. Tests compare
the generated page with `tests/fixtures/legacy-index.html` across desktop, mobile,
dark preference, print, phone-revealed, and PDF-button states.

The archived legacy HTML and runtime fixtures are intentionally exempt from the
100-line limit. The unchanged cover letter, Persian page, experimental multi-page
source, generated CSS and schemas, lockfiles, snapshots, and binary assets are
also legacy or generated exemptions.

## Layout names

`compact` is the current one-page layout. `detailed` is reserved for a future
multi-page layout that will select more of the same content without duplicating
personal data or changing compact output.
