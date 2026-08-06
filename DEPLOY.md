# Deploying ICRTET-2026 to Vercel

The project is a standard Next.js 15 App Router app. Vercel needs **no
configuration** — no `vercel.json`, no build settings, no environment
variables. Every page is static, so it serves from the CDN.

---

## Option A — drag and drop (no Git account needed)

1. Unzip `icrtet-2026.zip`.
2. Go to <https://vercel.com/new> and sign in.
3. Choose **Deploy** → drag the unzipped **`icrtet-2026` folder** onto the page.
4. Vercel detects Next.js, runs `npm install` and `npm run build`, and gives
   you a `*.vercel.app` URL in a couple of minutes.

Do **not** upload the `.zip` itself, and make sure `node_modules` is absent —
it is already excluded from this bundle, and Vercel installs dependencies
itself.

## Option B — Git (recommended, gives automatic redeploys)

```bash
git init && git add -A && git commit -m "ICRTET-2026 conference website"
```

Then create an empty repository on GitHub and push:

```bash
git remote add origin https://github.com/<you>/icrtet-2026.git && git branch -M main && git push -u origin main
```

In Vercel: **Add New → Project → Import** that repository → **Deploy**.
Every later `git push` redeploys automatically.

## Option C — Vercel CLI

```bash
npm i -g vercel && vercel --prod
```

---

## Build settings (only if Vercel ever asks)

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Build command | `npm run build` |
| Output directory | *(leave blank — Next.js default)* |
| Install command | `npm install` |
| Node version | 20.x or later |

---

## After the first deploy — do this

**Set the real domain.** Open `src/content/conference.ts` and change
`seo.siteUrl` from the placeholder to your live URL:

```ts
siteUrl: "https://icrtet2026.vercel.app",   // or the university domain
```

This one value feeds the canonical URLs, `sitemap.xml`, `robots.txt`, the
Open Graph tags and the Event structured data. Leaving it wrong will point
search engines at a domain that does not exist. Redeploy after changing it.

**Add a custom domain** (optional): Vercel → Project → Settings → Domains.
For a university subdomain such as `icrtet2026.kanchiuniv.ac.in`, the IT team
adds a `CNAME` record pointing at `cname.vercel-dns.com`.

---

## Old URLs

Six routes were consolidated into `/registration`. If any were shared publicly
before launch, add redirects to `next.config.mjs` so the links keep working:

```js
async redirects() {
  return [
    { source: "/call-for-papers", destination: "/registration#call-for-papers", permanent: true },
    { source: "/key-areas", destination: "/registration#key-areas", permanent: true },
    { source: "/important-dates", destination: "/registration#important-dates", permanent: true },
    { source: "/author-guidelines", destination: "/registration#guidelines", permanent: true },
    { source: "/publication", destination: "/registration#publication", permanent: true },
    { source: "/committees", destination: "/#leadership", permanent: true },
  ];
}
```

If the site has never been public, skip this — the pages simply 404, which is
correct.

---

## Before sharing the URL widely

See the **"Before this goes public"** checklist in `README.md`. The critical
items are the bank details, the QR code images and their destinations, and the
registration and submission links — all currently placeholders in
`src/content/`.
