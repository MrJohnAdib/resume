# Customizing the resume

## Personal and site details

Edit `data/profile.json` for identity, contact details, and links. Edit
`data/summary.json` for summary lines.

Site data is intentionally small:

- `data/site/metadata.json` contains SEO and social metadata. Keywords are an
  array. `data/site/metadata-cv.json` is the `/cv/` variant.
- `data/site/release.json` contains the update date and PDF versions.
- `data/site/analytics.json` contains the analytics measurement ID.
- `data/site/banner.json` contains banner copy and its repository link.

Avatar alt text and the phone link are generated automatically. Console output,
assets, colours, geometry, and other presentation details live in code.

## Add or reorder a role

Create one complete file in `data/experience/` or `data/volunteering/`. Prefix
its filename with the start year and organization:

```text
data/experience/2027-example-company.json
data/experience/2027-example-company-staff-engineer.json
```

Append a short role only when the organization and year are not unique. Set
`dates.start` and `dates.end`; never add `duration`. Use `present` for an ongoing
role. Omit `location` when it is not useful.

Add the filename without `.json` to the matching array under `order` in
`layouts/order.json`. That shared file controls display order in every layout.

## Skills, awards, and education

Each skill group, award, and degree has one file in its section directory.
Add its filename without `.json` to the matching array in `layouts/order.json`.

Skill filenames describe the group. Award filenames begin with the award year:

```text
data/skills/platform-engineering.json
data/awards/2027-example-award.json
data/education/doctorate.json
```

## Hidden alternatives

Add `"hidden": true` only to an exceptional role, bullet, skill group, link,
award, course, or summary line. It stays available in data but is omitted from
every generated layout.

Add `"layouts": ["detailed"]` to a role or bullet that belongs only to the
named layouts. Content without the field appears in every layout.

Do not use CSS hiding for ordinary resume content. The phone box is the only
allowlisted stateful hidden element.

## Preview and diagnose

```bash
npm run dev
npm run validate
npm run build
npm test
npm run check
```

Zod validation errors identify the source file and JSON path. Missing or
unordered filenames are reported directly. The build identifies the section
and generated item key if compact output exceeds the original A4 baseline.
