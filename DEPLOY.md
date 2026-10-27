# Deploy Vellum

This ZIP contains a complete Next.js 15 application. There is no backend, no database, no API key, no environment variable and no third-party service to configure. Resume data never leaves the visitor's browser.

## Requirements

- Node.js **18.18+** (built and tested on Node **20.20.2**) and npm 10+
- ~1 GB of free disk space for `node_modules` and the Next.js build cache

## Deploy on any Node host (VPS, Render, Railway, Fly.io, cPanel/Node, your own server)

```bash
unzip vellum-resume-builder.zip
cd vellum
npm ci
npm run build
npm run start -- -p 3000
```

Open `http://your-host:3000`. Put a reverse proxy (nginx/Caddy) in front of port 3000 for HTTPS. The start command already binds to `0.0.0.0`.

Keep the process alive with `pm2`, systemd or the platform's process manager:

```bash
npm ci --omit=dev --ignore-scripts   # optional: only after the build is complete
pm2 start "npm run start -- -p 3000" --name vellum
```

> Do **not** set `NODE_ENV=production` before `npm ci`, and do **not** install with `--omit=dev` before `npm run build`: TypeScript, Tailwind and ESLint are dev dependencies needed during the build. `NODE_ENV` is set automatically by `next build` / `next start`.

## Deploy on Vercel

1. Extract the ZIP and push the `vellum/` folder to a Git repository (or import it directly).
2. Import the repository in Vercel. Framework preset: **Next.js** (auto-detected).
3. Build command: `npm run build`. Install command: `npm install` (or `npm ci`). Output: leave at the default.
4. Add **no environment variables**. Deploy.

## Deploy on Netlify

1. Extract the ZIP and push the `vellum/` folder to a Git repository.
2. Import the repository. Netlify auto-detects Next.js and enables its Next.js runtime/plugin.
3. Build command: `npm run build`. Publish directory: leave empty (the Next.js plugin manages `.next`).
4. Add **no environment variables**. Deploy.

## Deploy as static files (GitHub Pages, S3, Cloudflare Pages, any CDN)

All 20 routes are prerendered at build time and there are no API routes or server actions.

```bash
cd vellum
npm ci
# add one line to next.config.mjs:  output: "export",
npm run build
# upload the generated  out/  directory
```

Static hosting is optional — the default Node server also never receives any resume content.

## Health check after deploying

```bash
curl -I https://your-domain/            # 200
curl -I https://your-domain/builder     # 200
curl -I https://your-domain/fonts/DejaVuSans.ttf  # 200 (PDF fonts are local)
```

Then open `/builder`, type a name, and click **Download PDF**. A real PDF should download with selectable text. If the PDF button ever fails, check that `/fonts/*.ttf` is reachable on the same origin.

## Verified clean-install result (27 Oct 2026)

The ZIP was extracted into an empty directory and validated end-to-end with a fresh npm cache:

| Check | Result |
| --- | --- |
| `npm ci` (fresh cache, 491 packages) | passed |
| `npm run typecheck` (TypeScript strict) | passed |
| `npm run lint` | passed, 0 warnings |
| `npm run test` (Vitest) | 49/49 passed |
| `npm run build` | passed, 20 static routes |
| `npm run start -- -p 3200` + all 14 routes | 14× HTTP 200, unknown route 404 |
| `npm run test:e2e` (Playwright/Chromium) | 40/40 passed, no console errors |
| `npm run test:print` | print PDF generated |
| Production server log | no errors or warnings |

Sample outputs are included in `qa-output/`.
