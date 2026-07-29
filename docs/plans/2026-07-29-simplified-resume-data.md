# Simplified Resume Data Implementation Plan

**Goal:** Make the resume easy to fork by using a few concise JSON files and one complete file per professional or volunteer role.

**Architecture:** Filenames generate record keys. Visible content uses plain values with no IDs or statuses; exceptional retained content uses `hidden: true`. A compact layout orders sections and roles while professional and volunteer roles share one data contract.

**Tech Stack:** TypeScript, Zod, Nunjucks, Tailwind CSS, Playwright.

---

## Target structure

```text
resume.config.json
data/
  site.json
  person.json
  summary.json
  skills.json
  awards.json
  education.json
  experience/*.json
  volunteering/*.json
layouts/
  compact.json
schema/
  resume.schema.json
```

- Derive role keys from filenames and other keys from their labels.
- Keep one complete role in each experience or volunteering file.
- Store visible bullets and technologies as strings.
- Use objects only for exceptions such as `hidden` or rich-text metadata.
- Omit empty properties and default behavior flags.
- Derive avatar alt text from the person's name.
- Derive contact links and always enable phone reveal and print behavior.
- Link the Awards and Honors heading to `https://mradib.com/awards`.
- Delete the archived prompt-injection footer and migration-only extraction code.

## Tasks

### 1. Specify the simple contract

- Add failing loader and render tests using the target files.
- Assert generated keys, optional hidden records, absent defaults, shared roles, and derived contact/avatar values.
- Verify the tests fail against the current manifest-heavy loader.

### 2. Consolidate data

- Merge site and person domains into one file each.
- Merge each experience profile, bullets, and technologies set.
- Consolidate skills, awards, and education by section.
- Move volunteering records to the shared role shape.
- Convert `alternate` to sparse `hidden: true` and remove `current`.

### 3. Simplify loading and validation

- Replace recursive manifests with direct small-file loading.
- Generate keys in memory and reject filename or label collisions.
- Default optional arrays to empty arrays without writing empty JSON values.
- Generate one editor-facing JSON Schema.

### 4. Simplify rendering and runtime

- Render all non-hidden content in data order after layout ordering.
- Share role validation and normalization while preserving exact section markup.
- Make contact reveal, print phone behavior, and avatar alt derivation automatic.
- Render an optional section-heading link without adding visual classes.

### 5. Remove obsolete machinery

- Delete archive, per-item layout files, migration code, redundant schemas, and superseded tests.
- Remove dependencies used only by migration.
- Update customization and architecture documentation.

### 6. Verify and publish

- Require zero-pixel parity in all six pinned states.
- Compare overflow against the legacy baseline in the same browser environment.
- Run schema, validation, file-length, typecheck, build, tests, audit, and diff checks.
- Commit and push the simplified branch, then wait for the draft PR check.
