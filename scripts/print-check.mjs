/** Verifies the dedicated print stylesheet by asking Chromium to print the builder. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const out = path.join(process.cwd(), "qa-output");
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}/builder`, { waitUntil: "networkidle" });
await page.waitForSelector(".vr-print-portal .vr-page", { timeout: 15000 });
await page.emulateMedia({ media: "print" });
await page.pdf({ path: path.join(out, "print-output.pdf"), printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("Wrote qa-output/print-output.pdf", fs.statSync(path.join(out, "print-output.pdf")).size, "bytes");
