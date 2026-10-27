# Vellum — Free Online Resume Builder

> Build a resume that opens doors. **50 templates · Live preview · Free PDF · No account.**

Vellum is a complete, production-quality, browser-based resume builder. It has no login, no backend, no database, no payment screen and no external AI service. Every essential feature — editing, template previews, customisation, PDF export and JSON backup — runs locally in the browser.

---

## 1. Quick start

Requirements: **Node.js 18.18+** (tested on Node 20) and npm.

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build:

```bash
npm run build
npm run start -- -p 3000
```

There are **no environment variables, no API keys and no services to configure**. The app is entirely static/client-side; no `.env` file is needed.

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server on `0.0.0.0` |
| `npm run build` | Production build (also runs type checking + lint) |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` (strict mode) |
| `npm run lint` | ESLint via `next lint` |
| `npm run test` | 49 Vitest unit/integration tests |
| `npm run verify` | typecheck + tests + production build |
| `npm run test:e2e` | 40 Playwright browser checks (requires a running server) |
| `npm run test:print` | Generates a PDF through the browser print stylesheet |

Browser tests need a one-time browser install:

```bash
npx playwright install chromium
# On a minimal Linux image you may also need: npx playwright install-deps chromium
```

Then, with `npm run start` running in another terminal:

```bash
npm run test:e2e
npm run test:print
```

---

## 2. What is included

- **50 distinct resume templates** in six categories, driven by one template registry. Each definition combines a layout archetype, header treatment, heading style, bullet style, typography, density, palette, section order and capability flags — not just a colour swap.
- **Full template gallery** (`/templates`) with search, category/style/audience filters, five sort modes, active-filter chips, reset, empty state, preview modal and "Use This Template" links. Filters can be pre-applied with query params (`?category=`, `?style=`, `?audience=`).
- **Builder** (`/builder`) with a three-panel desktop workspace (content editor / live preview / customisation) and a tabbed mobile workspace (Edit / Preview / Customize).
- **Real editing** for personal details, summary, experience, education, skills, projects, certifications, languages, awards, volunteer work, publications, courses, activities, interests, references and user-created custom sections. Add, edit, delete, duplicate and reorder entries; reorder and hide sections.
- **Live preview** that updates on every keystroke, with real A4 / US Letter page geometry, multi-page pagination, page-break visualisation, page navigation, zoom and optional section highlighting.
- **Customisation**: accent colour, font family, font size, line spacing, section spacing, margins, page size, two-column layout, photo, skill bars, contact icons, page numbers, per-contact visibility and section visibility/order. Five presets and a Reset action. Unsupported controls are visibly disabled and explained.
- **Writing assistance** that is 100% local: example summaries, bullet examples, action verbs, writing tips, a small common-typo guide, a completeness checklist, a resume length indicator and an ATS-readability checklist. No scores or guarantees.
- **Working PDF download** — a real, selectable-text PDF with embedded fonts, A4/Letter geometry, multi-page flow and heading-orphan protection. A dedicated print stylesheet provides a second, pixel-faithful "Print / Save as PDF" path.
- **Data tools**: JSON export/import, optional local autosave, named local drafts, duplicate resume, load sample data, clear all with confirmation, undo/redo.
- **Content pages**: 10 fictional editable resume examples, 7 full career guides with dynamic routes, About, Privacy, Terms, FAQ, 404, sticky navbar and a comprehensive footer.
- **Light/dark theme**, toast notifications, keyboard-friendly Radix-based UI controls and accessible labels.

---

## 3. Tech stack

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS 3 · shadcn-style UI built on Radix primitives · Lucide React · Framer Motion · React Hook Form · Zod · jsPDF 3 · Sonner · Vitest · Playwright (dev only).

No CSS/JS/font requests go to third-party origins. The application intentionally uses system font stacks in the UI; the PDF fonts are bundled static assets served by the app itself.

---

## 4. Architecture

```
src/
  app/                     routes, global CSS, metadata, favicon, 404
  components/
    navigation/ layout/    navbar + footer
    home/ shared/ ui/      brand, theme, animations, shadcn-style primitives
    templates/             gallery, filter logic, template cards
    resume-renderer/       shared HTML renderer, pagination, header, page chrome,
                           thumbnails, print portal, scaled preview
    builder/               workspace, forms, customisation, dialogs
    examples/ guides/      content components
  data/
    templates.ts           THE single 50-template registry
    sample-resume.ts       fictional demo content
    resume-examples.ts     10 editable examples
    guides.ts              7 long-form articles
    writing-help.ts        local writing suggestions
  lib/
    resume-ir.ts           framework-agnostic intermediate representation
    pagination.ts          pure block pagination algorithm
    pdf-export.ts          jsPDF text-flow engine + font loading
    resume-validation.ts   Zod schemas, lenient JSON import
    resume-utils.ts        data helpers, presets, checklists, filenames
    drafts.ts              opt-in local storage
    use-history.ts         debounced undo/redo snapshots
  types/                   resume.ts, template.ts
  tests/                   49 Vitest tests
scripts/                   Playwright e2e + print verification
public/fonts/              subset DejaVu TTFs + license
```

### The rendering pipeline (important)

```
ResumeState (content + customisation)
        ↓  buildResumeIR(state, template)
ResumeIR (header + ordered flow blocks, per column)
        ↓                            ↓
buildRenderBlocks()            renderResumePdf()
(HTML DOM blocks)              (jsPDF text flow)
        ↓                            ↓
paginateBlocks() × 2 columns   Column/ensure() page breaks
        ↓                            ↓
.vr-page sheets (preview)      downloadable PDF
        ↓
PrintPortal → browser print stylesheet → Save as PDF
```

`ResumeState` stores **content separately from design**. A template is a declarative set of presentation rules; switching templates only changes `templateId` (plus untouched template-specific defaults), so nothing the user typed is lost. Both the on-screen preview and the PDF engine consume the *same* `ResumeIR`, which is why hidden sections, section ordering and contact visibility behave identically in both.

The HTML preview measures each block in a hidden, exact-width pass and then distributes block IDs across physical page sheets using `paginateBlocks`. This gives genuine multi-page previews (including independently paginated sidebar/main columns) instead of one long scrolling canvas.

### PDF export: two complementary paths

1. **Download PDF** (primary) — `src/lib/pdf-export.ts` builds a PDF with jsPDF. It embeds subset **DejaVu** TrueType fonts (fetched from `/fonts/` on the same origin, never uploaded), writes real selectable text, supports A4 and US Letter, flows across pages, keeps headings with following content and applies the selected template's accent, typography and column layout. jsPDF is dynamically imported so it is not in the initial bundle.
2. **Print Resume** — `PrintPortal` renders an unscaled copy of the same paginated HTML directly under `<body>`. The print stylesheet hides all application chrome, sets `@page` to the chosen page size and prints each `.vr-page` on its own sheet with background colours preserved. Choose "Save as PDF" in the browser dialog for a pixel-faithful export.

Font files are subsets generated with `fontTools` from the system DejaVu family; see `public/fonts/LICENSE.txt`.

---

## 5. Privacy model

- No accounts, no email collection, no cookies for tracking, no analytics, no third-party scripts/fonts.
- Resume content lives in the memory of the open tab by default.
- Optional autosave and named drafts use `localStorage` on the user's device only; they can be deleted from the Resume data dialog.
- JSON import uses the browser File API; PDF generation and print use browser APIs. No resume content is transmitted.
- The only client-side requests are for the app's own static assets (including the bundled font files). See `/privacy` for the user-facing policy.

---

## 6. Deployment

Vellum is a standard Next.js app with no server-side data requirements. **See `DEPLOY.md` for step-by-step instructions for Vercel, Netlify, any Node host and static CDN hosting**, plus a post-deploy health check.

- **Quick deploy from this ZIP:** `unzip vellum-resume-builder.zip && cd vellum && npm ci && npm run build && npm run start -- -p 3000`. No environment variables, no API keys, no database.
- **Vercel / Netlify / any Node host:** `npm install && npm run build && npm run start`. No environment variables.
- **Static export:** the app has no API routes and no server actions. If you want a fully static build, add `output: "export"` to `next.config.mjs` and run `npm run build`; the generated `out/` directory can be served by any static host. (The default configuration uses the Next.js Node server, which is also fine — it still never receives resume content.)
- Set your real domain in `metadata` / `openGraph` before launch if you want canonical URLs.

---

## 7. Verification

See `REPORT.md` for the full test report. Summary:

- `npm run typecheck` — clean; `npm run lint` — clean; `npm run build` — succeeds (20 static routes).
- `npm run test` — **49 passing** Vitest tests, including PDF generation for all 50 templates and both page sizes.
- `npm run test:e2e` — **40 passing** Playwright checks in a real Chromium browser, including all 50 templates rendering, live editing, undo, template switching, PDF/JSON download, JSON import, custom sections, mobile layout and zero blocking console errors.
- Downloaded PDF and printed PDF were opened with `pypdf`: correct page geometry, `%PDF` header, embedded font objects, selectable text and no application chrome.
- **Clean-install verification:** the deliverable ZIP was extracted into an empty directory and, with a fresh npm cache, `npm ci` → typecheck → lint → 49 unit tests → `npm run build` → `npm run start` → 14 route checks → 40 browser checks → print check all passed with no server-log errors. See `DEPLOY.md`.

`qa-output/` contains sample artifacts from the verification run (a downloaded PDF, a printed PDF, an exported JSON and the e2e result log).

---

## 8. Known limitations

- The direct PDF export is a **faithful text-flow rendering** of the resume, not a pixel-identical raster of the HTML page. Use **Print → Save as PDF** when you need an exact visual match.
- The bundled fonts cover Latin, Greek, Cyrillic, common punctuation and Devanagari codepoints, but complex script shaping (e.g. conjuncts) is not performed by jsPDF. CJK, Arabic and emoji are not embedded; those characters may be missing from the direct PDF. Print/Save as PDF uses your system fonts and handles them better.
- Profile photos are optional and only available on templates that support them. In the direct PDF they are drawn as a square image; the HTML preview and print version show a circle.
- PDF/DOCX resume import is deliberately not implemented — extraction quality is unreliable. Vellum JSON import/export is supported instead. DOCX export is not available.
- Local autosave is opt-in and device-specific; there is no cross-device sync.
- Undo/redo is snapshot-based with a short debounce, so extremely rapid consecutive edits may be grouped into one step.
- No tool can guarantee an ATS score or an interview; the checklists are guidance only.

---

Built with care for job seekers everywhere. Free forever.
