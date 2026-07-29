# Customizing the resume

## Edit personal details

Edit `data/person.json` for identity, contact details, and links. Edit
`data/summary.json` for summary lines and `data/site.json` for metadata, assets,
PDF naming, analytics, banner, and console copy.

Do not add IDs, `status: current`, empty values, or behavior flags. Avatar alt
text is generated from the person's name. The phone link is generated from its
label, and contact click plus print reveal are automatic.

## Add a role

Copy one similar JSON file into `data/experience/` or `data/volunteering/`. The
filename becomes its generated key, so use a descriptive lowercase filename:

```text
data/experience/staff-software-engineer.json
```

Keep the role, organization, dates, bullets, and technologies together in that
one file. Plain bullet and technology values are strings. Omit unavailable
properties instead of writing empty strings or arrays.

Add the filename without `.json` to the matching `roles` array in
`layouts/compact.json`. That array controls role order.

## Reorder sections

Move entries in `layouts/compact.json` under `sections`. Their array order is
top-to-bottom within each column:

```json
{ "type": "experience", "column": "left" }
```

Skills, awards, and education use their array order in `data/skills.json`,
`data/awards.json`, and `data/education.json`.

## Retain an inactive value

Add `"hidden": true` only to an exceptional role, bullet, skill group, link,
award, course, or summary line. It remains near related content but is omitted
from every rendered layout unless a future layout explicitly includes it.

Do not use CSS classes to hide ordinary resume content. The phone box is the
only allowlisted stateful hidden element.

## Preview and diagnose

```bash
npm run dev
npm run validate
npm run build
npm test
npm run check
```

Validation errors identify the source file and JSON path. Missing or unordered
role filenames are reported directly. `npm run build` reports the section and
generated item key if compact output exceeds the original A4 baseline.

The editable contract is generated at `schema/resume.schema.json`. Hand-written
code, templates, tests, layouts, and documentation must stay below 100 lines.
Consolidated content files may be longer so the repository stays easy to browse.
