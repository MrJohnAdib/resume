# Architecture

`resume.config.json` is the root entry point. It connects a small set of content
files to one layout:

```text
site.json ───────── metadata, assets, analytics, PDF, banner, console
person.json ─────── identity, contact details, social links
summary.json ────── current and hidden summary lines
experience/*.json ─ one complete professional role per file
volunteering/*.json one complete volunteer role per file
section JSON ────── skills, awards, and education
compact.json ────── page, theme, typography, section order, role order
```

The loader validates each file and reports its source path and JSON path.
Professional and volunteer roles use the same schema and normalizer. A role key
comes from its filename; nested keys come from labels and exist only in the
composed in-memory model.

Visible content needs no presentation metadata. `hidden: true` is the sparse
exception for retained alternatives and inactive records. Hidden content stays
with its section and is omitted from generated HTML. The phone is the only
initially hidden runtime element because contact click and print reveal it.

The compact renderer filters hidden values, applies the order from
`layouts/compact.json`, and renders focused Nunjucks components. Structured
abbreviation and superscript nodes support rich text without arbitrary HTML.
Browser modules own automatic duration, contact, PDF, print-title, and console
behavior; those behaviors are not editable flags.

`dist/` is disposable output. The build copies static routes and assets,
generates HTML and CSS, and compares A4 overflow with the original page in the
same browser environment. Tests compare every output pixel with
`tests/fixtures/legacy-index.html` on desktop, mobile, dark preference, print,
phone-revealed, and PDF-button states.

Hand-written code, templates, tests, and documentation stay below 100 lines.
Consolidated content JSON is excluded from that code-size rule so related data
does not need to be fragmented into dozens of artificial files.

## Layout names

`compact` is the current one-page layout. `detailed` is reserved for a future
three-page layout that can select more of the same data without duplicating
personal details or changing compact output.
