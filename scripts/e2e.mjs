/**
 * Browser smoke test for the built application.
 * Usage:  npm run build && npm run start -- -p 3000   (in one terminal)
 *         node scripts/e2e.mjs                        (in another)
 * Requires: npx playwright install chromium
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), "qa-output");
fs.mkdirSync(OUT, { recursive: true });

const errors = [];
const results = [];
function check(name, condition, detail = "") {
  results.push({ name, ok: Boolean(condition), detail });
  console.log(`${condition ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!condition) errors.push(name);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

try {
  // ---------- Homepage ----------
  await page.goto(BASE, { waitUntil: "networkidle" });
  check("homepage renders headline", (await page.locator("h1").first().innerText()).includes("Opens Doors"));
  check("homepage shows real resume previews", (await page.locator(".vr-doc").count()) >= 3);
  check("navbar links present", (await page.getByRole("link", { name: "Templates", exact: true }).count()) > 0);

  // ---------- Template gallery ----------
  await page.goto(`${BASE}/templates`, { waitUntil: "networkidle" });
  const cards = await page.locator("button[aria-label^='Preview']").count();
  check("gallery shows all 50 templates", cards === 50, `${cards} cards`);
  await page.getByPlaceholder("Search templates…").fill("developer");
  await page.waitForTimeout(250);
  const filtered = await page.locator("button[aria-label^='Preview']").count();
  check("search filters templates", filtered > 0 && filtered < 50, `${filtered} results`);
  await page.getByRole("button", { name: /Reset all filters|Reset/ }).first().click();
  await page.waitForTimeout(200);
  check("reset filters restores 50", (await page.locator("button[aria-label^='Preview']").count()) === 50);
  await page.locator("button[aria-label^='Preview']").first().click();
  await page.waitForTimeout(350);
  check("template preview modal opens", await page.getByRole("dialog").isVisible());
  check("modal has Use This Template action", (await page.getByRole("link", { name: /Use This Template/ }).count()) > 0);
  await page.keyboard.press("Escape");

  // ---------- Examples and guides ----------
  await page.goto(`${BASE}/examples`, { waitUntil: "networkidle" });
  check("examples page lists 10 cards", (await page.locator("button[aria-label^='Preview']").count()) === 10);
  await page.goto(`${BASE}/guides/ats-readable-resume`, { waitUntil: "networkidle" });
  check("guide article renders", (await page.locator("article h2").count()) >= 4);

  // ---------- Builder ----------
  await page.goto(`${BASE}/builder`, { waitUntil: "networkidle" });
  await page.waitForSelector(".vr-print-scale .vr-page", { timeout: 15000 });
  check("builder renders a resume page", (await page.locator(".vr-print-scale .vr-page").count()) >= 1);
  const nameBefore = await page.locator('.vr-print-scale [data-page-index="0"] .vr-name').first().textContent();
  check("sample data visible in live preview", nameBefore.includes("Aarav Mehta"), nameBefore);

  const nameInput = page.locator("#data-personal-fullName");
  await nameInput.fill("Priya Sharma");
  await page.waitForTimeout(500);
  const nameAfter = await page.locator('.vr-print-scale [data-page-index="0"] .vr-name').first().textContent();
  check("typing updates the live preview instantly", nameAfter.includes("Priya Sharma"), nameAfter);

  // Undo restores the previous snapshot
  await page.getByRole("button", { name: "Undo" }).click();
  await page.waitForTimeout(700);
  const undone = await page.locator('.vr-print-scale [data-page-index="0"] .vr-name').first().textContent();
  check("undo restores previous content", undone.includes("Aarav Mehta"), undone);

  // Switch template and verify content is preserved
  await page.getByRole("button", { name: /Change template/ }).click();
  await page.waitForTimeout(300);
  await page.getByPlaceholder("Search templates…").fill("Executive");
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: /Executive/ }).first().click();
  await page.waitForTimeout(600);
  const afterSwitch = await page.locator('.vr-print-scale [data-page-index="0"] .vr-name').first().textContent();
  check("switching templates preserves data", afterSwitch.includes("Aarav Mehta"), afterSwitch);
  check("switched template is applied", (await page.locator(".vr-print-scale .vr-doc[data-template='executive']").count()) > 0);

  // Page size switch
  await page.getByRole("button", { name: /US Letter/ }).click();
  await page.waitForTimeout(400);
  check("page size control works", (await page.locator(".vr-print-scale .vr-page").first().evaluate((el) => el.getBoundingClientRect().height > 0)));

  // Zoom
  await page.getByRole("button", { name: "Zoom in" }).click();
  check("zoom control works", (await page.getByText("115%").count()) > 0);

  // Writing assistant
  await page.getByRole("button", { name: "Writing assistant" }).click();
  await page.waitForTimeout(250);
  check("writing assistant opens", await page.getByRole("dialog").getByText("Resume completeness").isVisible());
  await page.keyboard.press("Escape");

  // JSON export
  await page.getByRole("button", { name: "Resume data" }).click();
  await page.waitForTimeout(250);
  const jsonDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  const jsonFile = await jsonDownload;
  const jsonPath = path.join(OUT, "exported-resume.json");
  await jsonFile.saveAs(jsonPath);
  const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  check("JSON export contains the resume data", parsed.data.personal.fullName === "Aarav Mehta" && parsed.version === 1);
  await page.keyboard.press("Escape");

  // PDF download
  const pdfDownload = page.waitForEvent("download", { timeout: 30000 });
  await page.getByRole("button", { name: /Download PDF/ }).click();
  const pdfFile = await pdfDownload;
  const pdfPath = path.join(OUT, "downloaded-resume.pdf");
  await pdfFile.saveAs(pdfPath);
  const pdf = fs.readFileSync(pdfPath);
  check("PDF download produces a real PDF file", pdf.subarray(0, 5).toString() === "%PDF-", `${pdf.length} bytes, ${pdfFile.suggestedFilename()}`);
  check("PDF filename uses the resume owner name", pdfFile.suggestedFilename().includes("aarav-mehta"), pdfFile.suggestedFilename());


  // ---------- JSON import ----------
  await page.getByRole("button", { name: "Resume data" }).click();
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await page.getByRole("button", { name: "Clear everything" }).click();
  await page.waitForTimeout(600);
  check("clear all empties the preview", (await page.locator('.vr-print-scale [data-page-index="0"] .vr-name').first().textContent()).includes("Your Name"));
  await page.getByRole("button", { name: "Resume data" }).click();
  await page.waitForTimeout(200);
  await page.locator('input[type="file"][accept*="json"]').setInputFiles(jsonPath);
  await page.waitForTimeout(700);
  check("JSON import restores the resume in the preview", (await page.locator('.vr-print-scale [data-page-index="0"] .vr-name').first().textContent()).includes("Aarav Mehta"));

  // ---------- Dark theme ----------
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: /Switch to dark theme/ }).click();
  check("dark theme toggles", await page.locator("html.dark").count() === 1);
  await page.getByRole("button", { name: /Switch to light theme/ }).click();

  // ---------- Every template renders in a real browser ----------
  const registrySource = fs.readFileSync(path.join(process.cwd(), "src/data/templates.ts"), "utf8");
  const allTemplates = [...registrySource.matchAll(/^\s*id:\s*"([a-z0-9-]+)",\s*name:/gm)].map((m) => m[1]);
  check("registry exposes 50 template ids", allTemplates.length === 50, `${allTemplates.length} ids`);
  let broken = [];
  for (const id of allTemplates) {
    await page.goto(`${BASE}/builder/?template=${id}`, { waitUntil: "domcontentloaded" });
    try {
      await page.waitForSelector(`.vr-print-scale .vr-doc[data-template="${id}"] .vr-page`, { timeout: 8000 });
    } catch { broken.push(id); }
  }
  check("all 50 templates render in the browser", broken.length === 0, broken.join(", "));

  // ---------- Template-specific features ----------
  await page.goto(`${BASE}/builder/?template=modern-sidebar`, { waitUntil: "networkidle" });
  await page.waitForSelector(".vr-print-scale .vr-sidebar", { timeout: 10000 });
  check("two-column templates render a sidebar", (await page.locator(".vr-print-scale .vr-sidebar").count()) > 0);
  await page.goto(`${BASE}/builder/?template=modern-creative`, { waitUntil: "networkidle" });
  await page.waitForSelector(".vr-print-scale .vr-skillbar", { timeout: 10000, state: "attached" });
  check("skill bars render on supporting templates", (await page.locator('.vr-print-scale [data-page-index="0"] .vr-skillbar').count()) > 0);
  await page.goto(`${BASE}/builder/?template=international-resume`, { waitUntil: "networkidle" });
  await page.waitForSelector(".vr-print-scale .vr-initials, .vr-print-scale .vr-photo", { timeout: 10000, state: "attached" });
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==", "base64");
  const photoPath = path.join(OUT, "test-photo.png");
  fs.writeFileSync(photoPath, png);
  await page.locator('input[type="file"][accept*="image"]').setInputFiles(photoPath);
  await page.waitForTimeout(700);
  check("profile photo can be added locally", (await page.locator('.vr-print-scale [data-page-index="0"] img.vr-photo').count()) > 0);

  // ---------- Repeatable entries + custom sections ----------
  await page.goto(`${BASE}/builder`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Work Experience/i }).first().click();
  await page.waitForTimeout(250);
  await page.getByRole("button", { name: "Add experience" }).click();
  await page.waitForTimeout(300);
  check("can add a work experience entry", (await page.getByRole("button", { name: "Add experience" }).count()) === 1 && (await page.locator('input[id^="data-experience-"]').count()) > 0);
  const beforeDuplicate = await page.getByRole("button", { name: "Duplicate entry" }).count();
  await page.getByRole("button", { name: "Duplicate entry" }).last().click();
  await page.waitForTimeout(350);
  const afterDuplicate = await page.getByRole("button", { name: "Duplicate entry" }).count();
  check("can duplicate an entry", afterDuplicate > beforeDuplicate, `${beforeDuplicate} -> ${afterDuplicate}`);
  await page.getByRole("button", { name: "Delete entry" }).last().click();
  await page.waitForTimeout(350);
  check("can delete an entry", (await page.getByRole("button", { name: "Duplicate entry" }).count()) < afterDuplicate);

  await page.getByRole("button", { name: /Custom sections/ }).first().click();
  await page.waitForTimeout(250);
  await page.getByRole("button", { name: "Add custom section" }).click();
  await page.waitForTimeout(350);
  const customTitle = page.locator('input[id^="data-customSections-"][id$="-title"]').first();
  await customTitle.fill("Volunteering Highlights");
  await page.getByRole("button", { name: "Add entry" }).click();
  await page.waitForTimeout(300);
  await page.locator('input[id*="entries-0-heading"]').first().fill("Community teaching");
  await page.waitForTimeout(600);
  const customPreview = await page.locator('.vr-print-scale [data-page-index="0"]').textContent();
  check("custom sections appear in the live preview", customPreview.includes("Volunteering Highlights") || (await page.locator('.vr-print-scale').textContent()).includes("Volunteering Highlights"), "");

  // ---------- Mobile ----------
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/builder`, { waitUntil: "networkidle" });
  check("mobile builder shows Edit/Preview/Customize tabs", (await page.getByRole("button", { name: "preview", exact: true }).count()) > 0);
  await page.getByRole("button", { name: "edit", exact: true }).click();
  await page.waitForTimeout(200);
  check("mobile edit tab reveals form fields", await page.locator("#data-personal-fullName").isVisible());
  await page.getByRole("button", { name: "preview", exact: true }).click();
  await page.waitForTimeout(300);
  check("mobile preview remains usable", (await page.locator(".vr-print-scale .vr-page").count()) >= 1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check("no horizontal overflow on mobile", overflow <= 2, `${overflow}px`);
  await page.goto(BASE, { waitUntil: "networkidle" });
  const homeOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check("no horizontal overflow on mobile homepage", homeOverflow <= 2, `${homeOverflow}px`);

  // ---------- Console cleanliness ----------
  const realErrors = consoleErrors.filter((e) => !/favicon|404 \(Not Found\)/i.test(e));
  check("no blocking console errors", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));
} catch (err) {
  check("e2e script completed without exceptions", false, String(err));
} finally {
  await browser.close();
}

console.log("\n" + "=".repeat(60));
console.log(`${results.filter((r) => r.ok).length}/${results.length} browser checks passed`);
fs.writeFileSync(path.join(OUT, "e2e-results.json"), JSON.stringify(results, null, 2));
if (errors.length) { console.error("Failed:", errors.join(", ")); process.exit(1); }
