# Resume Architecture Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make every editable file small and intuitive, derive durations from dates, and remove Nunjucks and generated JSON Schema.

**Architecture:** Zod validates many focused JSON records loaded and ordered by one compact layout. Small TypeScript view functions render escaped static HTML without a template engine.

**Tech Stack:** TypeScript, Zod, Node.js, Tailwind CSS, Playwright

---

## Design

- Prefix experience and volunteering filenames with their start year, followed
  by the organization and a role suffix only when needed for uniqueness.
- Prefix award filenames with the award year. Use `masters.json` and
  `bachelors.json` for education.
- Keep location optional, remove locations containing `IR`, and retain London
  and UK locations.
- Derive all durations from start and end dates. Recalculate ongoing roles in
  the browser using the current date.
- Split profile, metadata, release, analytics, banner, skills, awards, and
  education into focused files. Store keywords as an array.
- Keep presentation constants and console output in code rather than content.
- Keep compact ordering in `layouts/compact.json`; generate record IDs from
  filenames.
- Remove generated JSON Schema and validate exclusively with focused Zod
  modules.
- Replace Nunjucks with escaped TypeScript HTML components under 100 lines.
- Preserve the current generated page pixel-for-pixel.

### Task 1: Lock the new contracts with failing tests

**Files:**
- Modify: `tests/config/simple-repository.test.ts`
- Modify: `tests/config/load-config.test.ts`
- Modify: `tests/config/load-roles.test.ts`
- Create: `tests/config/derived-duration.test.ts`
- Create: `tests/render/html.test.ts`

1. Assert year-first record filenames and business-first slugs.
2. Assert no editable role contains `duration` or an `IR` location.
3. Assert split profile/site/skills/awards/education paths and array keywords.
4. Assert fixed and ongoing duration calculation.
5. Assert rendering escapes unsafe content without Nunjucks.
6. Run the focused tests and confirm they fail for the old architecture.

### Task 2: Refactor data and loading

**Files:**
- Modify: `resume.config.json`, `layouts/compact.json`
- Create: `data/site/*.json`, `data/skills/*.json`, `data/awards/*.json`
- Create: `data/education/*.json`, `data/profile.json`
- Rename: `data/experience/*.json`, `data/volunteering/*.json`
- Modify: `src/schema/*.ts`, `src/config/*.ts`

1. Split and rename content while preserving every unique value.
2. Remove hardcoded durations, IR locations, empty groups, and near-duplicate
   hidden summary alternatives.
3. Add generic ordered-directory loading with filename-derived IDs.
4. Calculate normalized durations from dates.
5. Run focused config and duration tests until green.

### Task 3: Remove template and schema generators

**Files:**
- Delete: `src/templates/`, `schema/`, `scripts/generate-schema.ts`
- Create: `src/view/*.ts`
- Modify: `src/render/compact.ts`, `src/render/theme.ts`
- Modify: `scripts/render.ts`, `scripts/build-css.ts`
- Modify: `src/runtime/console-message.js`
- Modify: `package.json`, `package-lock.json`, `.vscode/settings.json`

1. Render the same semantic HTML with small escaped TypeScript components.
2. Move banner geometry, page theme, assets, and console text into code.
3. Remove Nunjucks dependencies and JSON Schema generation.
4. Point Tailwind at TypeScript view files.
5. Run render, build, and interaction tests until green.

### Task 4: Document, verify, and publish

**Files:**
- Modify: `README.md`, `docs/ARCHITECTURE.md`, `docs/CUSTOMIZATION.md`
- Modify: `.github/workflows/*.yml`

1. Document filenames, ordering, optional locations, derived durations, and
   Zod validation.
2. Run schema-free validation, file-length checks, build, all tests, audit,
   visual parity, and `git diff --check`.
3. Review the complete diff for retained content and unrelated files.
4. Commit, push `codex/modular-resume`, update PR #2, and wait for CI.
