# Vellum — Implementation & QA Report

**Date:** 27 October 2026
**Project:** `vellum-resume-builder` (Next.js 15 / App Router / TypeScript strict)
**Deliverable:** complete source in this folder + `vellum-resume-builder.zip`

---

## 1. Completed features

| Requirement | Status | Implementation |
| --- | --- | --- |
| Original brand identity | ✅ | "Vellum" wordmark + custom folded-page SVG mark used in navbar, footer, favicon (`src/app/icon.svg`), metadata and OpenGraph. Indigo accent `#4c47e8`, warm neutral surfaces. |
| Sticky responsive navbar & rich footer | ✅ | Active-route indication, scroll state, mobile menu, theme toggle, CTA. Five-column footer with template, example, guide and legal links; no fake contact/social links. |
| Homepage | ✅ | Hero with three real resume previews, benefits, featured templates, how-it-works, why-use, categories, career-stage sections, examples, writing tips, FAQ, final CTA. |
| ≥40 distinct templates | ✅ | **50** templates in one registry (`src/data/templates.ts`) across all six required categories, with 22 layout archetypes, 13 header styles, 13 heading styles, 5 bullet styles, 3 densities, 8 font families and 19 palettes. Unit tests assert structural variety (max 4 templates share an identical structural signature). |
| Template gallery `/templates` | ✅ | Search, category/style/audience filters, 5 sort modes, active chips, reset, empty state, preview modal, "Use This Template". All 50 registered templates shown. |
| Builder `/builder` | ✅ | 3-panel desktop workspace; tabbed mobile workspace; template picker; undo/redo; autosave indicator; print, data and assistant dialogs. |
| All editing sections | ✅ | Personal (incl. optional photo), summary, experience, education, grouped skills, projects, certifications, languages, awards, volunteer, publications, courses, activities, interests, references, custom sections. Add/edit/delete/duplicate/reorder. |
| Live real-time preview | ✅ | Same `ResumeIR` drives preview and PDF. Physical A4/Letter sheets, real multi-page pagination, page-break visualisation, zoom, page navigation, section highlighting, no stale content on template switch. |
| Template customisation | ✅ | Accent, font family, font size, section/line spacing, margins, page size, one/two columns, photo, skill bars, icons, page numbers, per-contact visibility, section show/hide + reorder, 5 presets, reset. Capability flags gate unavailable controls. |
| Local writing assistance | ✅ | Example summaries (7), bullet examples (6), 30 action verbs, 6 writing tips, common-typo hints, completeness checklist, length indicator, ATS-readability checklist. No external AI, no fake scores. |
| PDF download | ✅ | jsPDF text-flow engine with embedded subset DejaVu fonts, selectable text, A4/Letter, multi-page, heading-orphan protection, meaningful filename. Verified with `pypdf`. |
| Print support | ✅ | Dedicated print stylesheet + `PrintPortal`; verified with Chromium `page.pdf()` and `pypdf`. |
| JSON export/import | ✅ | Local File API, Zod-validated with lenient repair of partial files; tested in browser. |
| Optional local autosave / drafts | ✅ | Opt-in `localStorage`, duplicate resume, named drafts, explicit delete-all and clear-all confirmation. |
| Resume examples | ✅ | 10 fictional, fully editable examples, each linked to the builder. |
| Career guides | ✅ | 7 long-form guides at `/guides/[slug]` with internal links. |
| Informational pages | ✅ | About, Privacy, Terms, FAQ, 404. All navbar/footer links resolve (verified 200/404). |
| Light/dark theme, toasts, empty states, confirmations | ✅ | Theme provider with persisted preference; Sonner toasts; Radix dialogs/accordions. |
| Privacy-first | ✅ | No accounts, no backend/DB, no analytics, no third-party assets, no uploads. Documented at `/privacy`. |
| Responsive mobile/tablet/desktop | ✅ | Verified at 390px and 1440px; 0px horizontal overflow on mobile. |
| Automated tests | ✅ | 49 Vitest tests + 40 Playwright browser checks + PDF/print content verification. |
| README + ZIP | ✅ | This report, `README.md`, and `vellum-resume-builder.zip`. |

---

## 2. Architecture notes

- **Single template registry** — `src/data/templates.ts` drives the homepage, gallery, filters, previews, picker and builder. Nothing is fetched from an API.
- **Content/design separation** — `ResumeState` (`src/types/resume.ts`) holds content + customisation; `TemplateDefinition` (`src/types/template.ts`) holds presentation. `switchTemplate()` preserves all content and deliberate user overrides while adopting untouched template-specific defaults.
- **Shared intermediate representation** — `buildResumeIR()` converts structured data into ordered flow blocks. The HTML renderer and the PDF engine both consume it. There are no 50 separate hardcoded preview components.
- **Pagination** — pure, unit-tested `paginateBlocks()` distributes measured DOM blocks across physical page sheets, with `keepWithNext` groups so headings are not stranded. Sidebar and main columns paginate independently; the page count is the max of the two.
- **PDF** — `renderResumePdf()` maps IR blocks to jsPDF text operations with a `Column` cursor that handles page breaks and "heading + 3 lines" look-ahead. Fonts are subset TTFs loaded lazily from `/fonts/` and registered in jsPDF's VFS. `PrintPortal` covers the pixel-faithful path.
- **Bundle hygiene** — jsPDF and Playwright are not in the initial route bundles. First-load JS: 103 kB shared, 215 kB homepage, 253 kB builder.

---

## 3. Test results

### 3.1 Static / build

| Check | Command | Result |
| --- | --- | --- |
| TypeScript strict | `npm run typecheck` | ✅ 0 errors |
| ESLint | `npm run lint` | ✅ 0 warnings/errors |
| Production build | `npm run build` | ✅ compiled in ~20–30 s, 20 static routes generated, 0 errors |
| Route smoke (HTTP) | `curl` all routes | ✅ `/`, `/templates`, `/builder`, `/examples`, `/guides`, `/guides/[slug]`, `/about`, `/privacy`, `/terms`, `/faq`, `/fonts/*` all 200; unknown route 404 |
| Initial bundle | build output | ✅ 103 kB shared JS, builder 253 kB first load |

### 3.2 Vitest — 49 tests, all passing

```
✓ src/tests/templates.test.ts       (9 tests)   registry integrity, 50 unique templates,
                                                structural variety, categories, capabilities
✓ src/tests/resume-utils.test.ts   (14 tests)  template switching, presets, checklists,
                                                filenames, JSON round-trip, malformed input
✓ src/tests/renderer.test.ts        (9 tests)  IR + DOM blocks for all 50 templates,
                                                hidden sections, sidebars, custom sections,
                                                bullet splitting, CSS variables, section order
✓ src/tests/pagination.test.ts     (10 tests)  page breaks, keepWithNext, overflow,
                                                variable first-page height, wrap/clamp
✓ src/tests/pdf-export.test.ts      (7 tests)  real PDF for all 50 templates, A4/Letter
                                                geometry, selectable-text font objects,
                                                multi-page long content, hidden sections,
                                                standard-font fallback
```

### 3.3 Playwright browser checks — 40/40 passing (`npm run test:e2e`)

Highlights (full log: `qa-output/e2e-results.json`):

- Homepage headline + 3 real resume previews; navbar links.
- Gallery: 50 cards, search → 11 results, reset → 50, preview modal + Use This Template.
- Examples: 10 cards; guide article with ≥4 sections.
- Builder: page renders; sample data visible; **typing updates preview instantly**; **undo restores**; **template switching preserves content**; page-size and zoom controls; writing assistant.
- **PDF download**: `%PDF-` file, ~46 KB, filename `aarav-mehta-resume.pdf`.
- **JSON export/import**: exported file parsed and re-imported successfully in the browser.
- Clear-all with confirmation empties the preview.
- Dark theme toggle.
- **All 50 templates render in Chromium** without errors.
- Template-specific features: two-column sidebar, skill bars, locally uploaded profile photo.
- Repeatable entries: add, duplicate (3 → 4), delete; custom section appears in live preview.
- Mobile (390 × 844): Edit/Preview/Customize tabs, form fields, usable preview, **0 px horizontal overflow** on builder and homepage.
- **Zero blocking console errors** across the whole run.

### 3.4 Generated PDF verification (not just the button)

`pypdf` inspection of `qa-output/downloaded-resume.pdf` (direct download, Executive template + US Letter) and `qa-output/print-output.pdf` (Chromium print):

| Property | Download PDF | Print PDF |
| --- | --- | --- |
| `%PDF` header | ✅ | ✅ |
| Pages | 2 | 2 |
| Page geometry | 216.0 × 279.0 mm (US Letter) | 209.9 × 297.0 mm (A4) |
| Embedded font objects (`/FontFile2`) | ✅ | ✅ (browser fonts) |
| Selectable text contains name, role, company, skills | ✅ | ✅ |
| Text order | logical (summary → experience → bullets → education …) | logical after bullet-order fix |
| Application chrome ("Download PDF", "Customize", "Your content") | absent | absent |
| Headings stranded at page bottom | none (look-ahead fix verified) | none |

Additional PDF checks performed during development: all 50 templates produce a valid PDF; A4/Letter geometry asserted in Vitest; an 8-role / 48-bullet stress document produces multiple pages instead of truncation; hidden sections reduce the output.

### 3.5 Manual workflow checks

- Template selection from gallery → `/builder/?template=id` loads the correct design and its own defaults (two-column, photo and skill-bar templates verified).
- Switching templates inside the builder keeps every field; untouched accent/font/column/photo defaults follow the new template, deliberate overrides persist.
- Optional sections with no content are hidden automatically; hidden sections are excluded from both preview and PDF.
- Local autosave toggle, drafts, duplicate, sample data, and clear-all are available in the Resume data dialog.

---

## 4. Known limitations

1. **Direct PDF vs. on-screen pixels.** The primary download uses a text-flow PDF engine driven by the same data/IR as the preview, so it is faithful in structure, colour, typography and pagination but not pixel-identical. **Print → Save as PDF** produces an exact visual copy.
2. **Font coverage.** Bundled subsets cover Latin (incl. diacritics), Greek, Cyrillic, common punctuation/symbols and Devanagari codepoints. jsPDF does not perform complex script shaping; CJK, Arabic and emoji are not embedded and may be missing from the direct PDF. The print path uses system fonts and handles them better.
3. **Photos in direct PDF** are drawn as a square image; the HTML preview/print shows a circle. Photos are only offered on templates that support them.
4. **Import** supports Vellum JSON only. PDF/DOCX extraction was intentionally omitted rather than shipped unreliably. **DOCX export is not provided.**
5. **Local autosave** is opt-in, device- and browser-specific; there is no sync and no server recovery. Closing a tab without autosave or a JSON backup loses in-memory work (the UI warns about this).
6. **Undo/redo** uses debounced whole-document snapshots (500 ms); bursts of very fast edits may collapse into a single step.
7. **Very long single bullet** (taller than one page) will overflow its sheet — content is split at block/bullet granularity, not mid-sentence.
8. **No guaranteed ATS score or job outcome.** The ATS checklist is transparent, local guidance only.
9. `next lint` is deprecated in Next 16; the project pins Next 15 where it works. Migrating to the ESLint CLI is a future maintenance task.
10. Browser print dialogs vary by OS/browser; "background graphics" must be enabled for coloured templates when saving the print version as PDF.

---

## 5. How to reproduce

```bash
npm install
npm run verify                 # typecheck + 49 unit tests + production build
npm run start -- -p 3000       # in one terminal
npm run test:e2e               # 40 Chromium checks (needs: npx playwright install chromium)
npm run test:print             # prints the builder to qa-output/print-output.pdf
python3 -m pip install pypdf   # optional: inspect generated PDFs
```

All artifacts land in `qa-output/`. No network service, API key or account is required at any point.

---

## 6. Deliverables checklist

1. ✅ Complete source code (`src/`, `public/`, config, scripts, tests).
2. ✅ 50 distinct usable resume templates.
3. ✅ Fully functional resume editing.
4. ✅ Live preview shared with the PDF pipeline.
5. ✅ Working PDF download + print path.
6. ✅ Template customisation controls.
7. ✅ Resume examples and career guides.
8. ✅ Responsive navbar and footer.
9. ✅ All required routes and 404 page.
10. ✅ Automated tests (49 unit + 40 browser + PDF content verification).
11. ✅ README with setup and deployment instructions.
12. ✅ `vellum-resume-builder.zip`.
13. ✅ This report.
