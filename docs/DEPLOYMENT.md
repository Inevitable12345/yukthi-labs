# Deployment

The site is a standard Next.js 16 App Router application. It has no database, no
queue and no persistent state; a deployment is just the build output plus a
handful of optional environment variables.

---

## Deploying to Vercel

This is the recommended target, and the path everything in the repository is set
up for. Nothing needs changing to deploy — the steps below are the whole job.

### 1. Push the repository to GitHub

```bash
git add -A
git commit -m "Yukthi Lab"
git push -u origin <your-branch>
```

### 2. Import the project

1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Under **Import Git Repository**, pick this repository. If you do not see it,
   choose **Adjust GitHub App Permissions** and grant Vercel access to it.
3. Vercel detects Next.js and fills in every build setting correctly:

   | Setting          | Value         |
   | ---------------- | ------------- |
   | Framework Preset | Next.js       |
   | Build Command    | `next build`  |
   | Output Directory | `.next`       |
   | Install Command  | `npm install` |
   | Root Directory   | `./`          |

   Leave all of them alone. There is no `vercel.json` in this repository and none
   is needed — security headers are served from `next.config.ts`, which Vercel
   honours.

4. Set the Node version if you want to pin it: **Project → Settings → General →
   Node.js Version → 22.x**. The `engines` field in `package.json` allows 20.9
   and above, and Vercel's default is fine.

### 3. Add environment variables

**Project → Settings → Environment Variables.** All of them are optional; the
site builds and runs correctly with none set.

| Variable                       | Environments        | What it does                                                                                                                                                    |
| ------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`         | Production          | Canonical origin for metadata, Open Graph, canonicals, sitemap and robots. Set this to your real domain, e.g. `https://yukthi.example` — with no trailing slash |
| `NEXT_PUBLIC_CONTACT_EMAIL`    | All                 | Published on `/contact`. Omit and the page simply says no public address is configured                                                                          |
| `CONTACT_WEBHOOK_URL`          | Production, Preview | Where validated contact submissions are POSTed as JSON. Omit and submissions are validated, rate-limited and logged server-side only                            |
| `NEXT_PUBLIC_ANALYTICS_SRC`    | Production          | A cookieless analytics script URL. Omit and no analytics loads at all                                                                                           |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Production          | The `data-domain` attribute that script expects                                                                                                                 |

Two notes that matter:

- **Leave `NEXT_PUBLIC_SITE_URL` unset on Preview deployments.** With it unset,
  `lib/metadata/site.ts` falls back to `VERCEL_URL`, so each preview gets correct
  canonicals for its own hostname instead of pointing at production.
- **`NEXT_PUBLIC_ANALYTICS_SRC` is baked into the CSP at build time**
  (`lib/security/headers.ts` derives `script-src` and `connect-src` from it). If
  you add or change it, **redeploy** — editing the variable alone will leave the
  browser refusing to load the script.

### 4. Deploy

Click **Deploy**. The first build takes two to three minutes. From then on every
push to the production branch deploys to production and every other branch and
pull request gets its own preview URL.

### 5. Add your domain

**Project → Settings → Domains → Add.** Vercel walks you through the DNS records:

- Apex domain (`yukthi.example`) → an `A` record to `76.76.21.21`
- Subdomain (`www.yukthi.example`) → a `CNAME` to `cname.vercel-dns.com`

Vercel issues the TLS certificate automatically once DNS resolves. Then go back
and set `NEXT_PUBLIC_SITE_URL` to the domain you just added, and redeploy so the
canonicals, sitemap and Open Graph images point at it.

### 6. Check the deployment

```bash
# Security headers are served from next.config.ts, so they must be present.
curl -sI https://your-domain | grep -i -E 'content-security-policy|x-frame-options|strict-transport'

# Crawlability.
curl -s https://your-domain/robots.txt
curl -s https://your-domain/sitemap.xml

# The Open Graph card renders on demand.
open https://your-domain/og?title=Yukthi%20Lab
```

Then open the site itself and confirm the exhibition scrolls, the coordinate
readout advances, and the scenario in room 16 propagates when you toggle it.

### Deploying from the CLI instead

```bash
npm i -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_SITE_URL production
vercel --prod
```

### Things that occasionally go wrong

| Symptom                                       | Cause and fix                                                                                                         |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Canonical URLs point at `localhost`           | `NEXT_PUBLIC_SITE_URL` unset **and** `VERCEL_URL` unavailable. Set the variable and redeploy                          |
| Open Graph image is blank in a card validator | The validator cached an earlier deployment. `/og` is server-rendered on demand; re-scrape the URL                     |
| Analytics script blocked in the console       | The CSP was built without the origin. Redeploy after setting `NEXT_PUBLIC_ANALYTICS_SRC`                              |
| Contact form succeeds but nothing arrives     | `CONTACT_WEBHOOK_URL` is unset. That is the intended default — submissions are acknowledged and logged, not forwarded |
| Build fails on a Node version error           | Set **Node.js Version** to 22.x in project settings                                                                   |

---

## Docker

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "run", "start"]
```

`NEXT_PUBLIC_*` values are inlined at build time, so pass them as build
arguments, not only at runtime.

---

## Self-hosted Node

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://your-domain npm run build
npm run start                     # listens on 3000
```

Put it behind a reverse proxy that terminates TLS. If your proxy also sets
security headers, make sure it does not duplicate the ones from
`next.config.ts` — two `Content-Security-Policy` headers are intersected by the
browser, which usually breaks the page rather than hardening it.

The in-memory rate limiter (`lib/security/rate-limit.ts`) is per process. Behind
more than one instance, swap `consume` for a shared store before relying on it.

---

## Continuous integration

```yaml
name: verify
on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run format:check
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

`npm run verify` runs everything except the browser tests locally, in the same
order.
