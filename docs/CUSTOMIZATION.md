# Customizing the resume

## Edit personal details

Site settings live in `data/site/`. Identity, contact details, links, and summary
live in `data/person/`. Edit values there; do not put resume copy in templates.

## Add an item

1. Copy a similar file or item directory under `data/sections/<family>/`.
2. Give the record a unique, stable `id`.
3. Add its path to that family's `index.json`.
4. Add a small selection file under
   `layouts/compact/sections/<family>/`.
5. Reference that selection from the layout section's `index.json`.
6. Run `npm run validate`.

Experience records keep their stable `id` and optional `status` in the record's
`index.json`, with separate profile, bullets, and technology files. Their layout
selections choose explicit `fields`, `bullets`, and `technologies` IDs. Skills
use `items`; education can use `coursework`. Other section families use the same
stable-ID pattern and accept any number of records.

## Reorder or omit content

Change top-to-bottom section order in:

```text
layouts/compact/section-order.json
```

Change item order in the relevant layout section `index.json`. Change selected
fields, bullets, or technologies in the item's selection file. Content that is
not selected remains available in `data/` but is omitted from generated HTML.
The `current`, `alternate`, and `archived` statuses are descriptive only and
never make content render implicitly.

Change header-link order and selection in `layouts/compact/links.json`. A link's
status does not select it.

## Preview and verify

```bash
npm run dev
npm run validate
npm run build
npm test
npm run check
```

`npm run build` fails when the compact layout exceeds one A4 page and reports the
section and item ID nearest the overflow. Validation errors include the source
file and JSON path when a reference is missing or an ID is duplicated.

The file-length check fails when a hand-written source, template, test, or data
file reaches 100 lines. Split a large record into focused files instead of
disabling the check.

Generated schemas for each editable domain are in `schema/`. Runtime settings
such as PDF naming, phone behavior, and console messages live in `data/site/`
and `data/person/`; browser modules contain behavior rather than personal values.

## Archived values

Alternative summaries and permanently hidden legacy values are retained under
`data/archive/`. Do not add archived files to a layout unless the content should
be visible. `npm run migrate:legacy` is a maintenance tool for reproducing the
initial extraction from the archived HTML fixture, not a normal editing step.
