# Architecture

`resume.config.json` connects focused content directories to the compact
layout:

```text
profile.json ──────── identity, contact details, social links
summary.json ──────── current and hidden summary lines
site/*.json ───────── metadata, release, analytics, banner content
experience/*.json ── one complete professional role per file
volunteering/*.json ─ one complete volunteer role per file
skills/*.json ─────── one skill group per file
awards/*.json ─────── one award per file
education/*.json ──── one degree per file
order.json ────────── shared record order for every layout
compact.json ──────── one-page section columns
detailed.json ─────── three-page section pages and breaks
```

The loader validates every file with a small Zod module and reports its source
path and JSON path. No generated JSON Schema is checked in. Professional and
volunteer roles share the same schema and normalizer.

Record keys come from filenames; nested keys come from labels and exist only in
the composed in-memory model. Experience and volunteering filenames begin with
their start year and organization. Award filenames begin with the award year.

Role data contains start and end dates, never a duration. The build calculates
fixed and initial ongoing durations. The browser recalculates ongoing durations
against the current date.

Visible content needs no presentation metadata. `hidden: true` is the sparse
exception for retained alternatives and inactive records. Hidden content is
omitted from generated HTML in every layout. An optional `layouts` list on a
bullet or role scopes it to the named layouts; content without the field
appears everywhere. The layout name comes from the layout filename. The phone is the only initially hidden runtime
element because contact click and print reveal it.

Small TypeScript view functions render escaped HTML without a template engine.
Structured abbreviation and superscript nodes support rich text without
arbitrary HTML. Presentation constants, asset paths, banner geometry, and
console output live in code rather than editable resume data.

`dist/` is disposable output. The build copies static routes and assets,
generates HTML and CSS, and compares A4 overflow with the original page. Tests
compare every pixel on desktop, mobile, dark preference, print, phone-revealed,
and PDF-button states.

Hand-written code, tests, layouts, documentation, and editable JSON files stay
below 100 lines.

## Layout names

`compact` is the two-column one-page layout at `/`. `detailed` is the
one-column three-page layout at `/cv/` with its own metadata and stylesheet.
Both share `layouts/order.json`; `detailed` assigns sections to pages and
splits experience with `pageBreaks`. Bullets tagged `"layouts": ["detailed"]`
surface only there. The build measures every A4 sheet for overflow.
