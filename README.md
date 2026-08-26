# NexTravel Holidays

Marketing website and admin CMS for **NexTravel Holidays** — curated holiday packages across India. Visitors browse destinations, read full itineraries, and inquire on WhatsApp. Admins manage packages in MySQL from a private dashboard.

Public site: [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Table of contents

1. [What this project is](#what-this-project-is)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Architecture](#architecture)
5. [Prerequisites](#prerequisites)
6. [Getting started](#getting-started)
7. [Environment variables](#environment-variables)
8. [npm scripts](#npm-scripts)
9. [Public website](#public-website)
10. [Admin CMS](#admin-cms)
11. [Authentication](#authentication)
12. [Database](#database)
13. [Package data model](#package-data-model)
14. [Images and uploads](#images-and-uploads)
15. [WhatsApp inquiries](#whatsapp-inquiries)
16. [Project structure](#project-structure)
17. [Fallback when MySQL is down](#fallback-when-mysql-is-down)
18. [Design system](#design-system)
19. [Development notes](#development-notes)
20. [Production checklist](#production-checklist)
21. [Troubleshooting](#troubleshooting)

---

## What this project is

NexTravel is a **Next.js App Router** site for a travel agency. The public pages are a dark, branded marketing experience. Package catalog data lives in **MySQL 8**. If the database is unreachable, the public site still renders from static sample destinations in `data/destinations.ts`.

There is no customer checkout or payment flow. Booking and contact forms open a pre-filled WhatsApp chat with the agency.

The admin area is a **cookie-authenticated CMS** (single env-based admin user). From `/admin` you can create, edit, hide, feature, and delete tour packages. Changes show up immediately on the homepage and destination pages.

---

## Features

### Public site

- Home: hero, trusted brands, value props, featured packages, dream-destination CTA, experience section, expert guides, reviews
- Destinations index: all **active** packages as cards
- Destination detail: hero, gallery, overview, highlights, day-by-day itinerary, inclusions, related packages, sticky booking form
- About, gallery, contact, terms, privacy
- WhatsApp CTAs in the navbar, hero, footer consultation block, booking form, and contact form
- Mobile-first layout with a glass navbar and custom 404
- `/login` and `/signup` exist as UI placeholders (they do not create accounts)
- `/coming-soon/product` placeholder page

### Admin CMS (`/admin`)

- Login with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Dashboard stats: total, active, inactive, featured
- Package cards with cover, price, location, duration
- Create / edit a full package (card fields, overview, gallery, highlights, itinerary, included / not included)
- Upload images (JPG, PNG, WEBP, GIF, max 8 MB) to `public/uploads/`
- Toggle **Active** (hidden from the public site when off)
- Toggle **Featured** (homepage “Explore top destination”)
- Delete package (cascades related gallery, highlights, itinerary, items)
- Import sample packages from `data/destinations.ts` when slugs are missing
- `robots: noindex` on admin pages

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js **16.3.1** (App Router) |
| UI | React **19.2.8**, Tailwind CSS **4**, Inter via `next/font` |
| Icons | lucide-react |
| Database | MySQL **8.4** (Docker Compose), `mysql2` |
| Auth | HMAC-signed cookie (`nextravel_admin`), 7-day expiry |
| Forms | Next.js Server Actions |
| Language | TypeScript (strict) |
| Seed | `tsx` + `scripts/seed.ts` |

This repo uses **Next.js 16** conventions. Request interception for `/admin` is implemented in `proxy.ts` (not `middleware.ts`). Read `node_modules/next/dist/docs/` before changing framework APIs.

---

## Architecture

```
Browser
  ├── Public pages  →  lib/packages.ts
  │                      ├── MySQL (active packages)     [preferred]
  │                      └── data/destinations.ts        [fallback]
  │
  ├── Booking / Contact forms  →  wa.me/{WHATSAPP_NUMBER}
  │
  └── /admin
        ├── proxy.ts           cookie present? else → /admin/login
        ├── layout requireAdmin()
        └── Server Actions     lib/packages-db.ts  →  MySQL
```

**Key modules**

| File | Role |
| --- | --- |
| `lib/packages.ts` | Public catalog API. Uses `connection()` so pages stay dynamic. Filters `active !== false`. Falls back to static data on DB error. |
| `lib/packages-db.ts` | MySQL CRUD, schema bootstrap, seed-if-empty, related tables |
| `lib/db.ts` | mysql2 pool (singleton on `globalThis`), `ensureDatabase()` |
| `lib/schema.ts` | `CREATE TABLE IF NOT EXISTS` statements |
| `lib/auth.ts` | Credential check, token create/verify, `requireAdmin()` |
| `lib/package-form.ts` | Validates admin `FormData` into `PackageInput` |
| `lib/uploads.ts` | Saves admin images under `public/uploads/` |
| `lib/whatsapp.ts` | Builds `wa.me` URLs for inquiry, package, booking, contact |
| `proxy.ts` | Redirects unauthenticated `/admin/*` (except login) to `/admin/login` |

Destinations listing and detail pages set `dynamic = "force-dynamic"` so admin edits are not served from a stale static snapshot.

---

## Prerequisites

- **Node.js** 20+ (Next 16)
- **npm**
- **Docker Desktop** (for local MySQL) **or** any MySQL 8 instance you point env vars at

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment file

```bash
cp .env.example .env.local
```

Edit `.env.local`. For local Docker MySQL the example values already match `docker-compose.yml`. Change `AUTH_SECRET` to a long random string even in development.

### 3. Start MySQL and seed packages

```bash
npm run db:setup
```

This runs `docker compose up -d` then `npx tsx scripts/seed.ts`.

The seed script:

1. Loads `.env.local`
2. Creates the database if the user can (`CREATE DATABASE IF NOT EXISTS`)
3. Runs schema statements
4. Inserts sample packages from `featuredDestinations` **only if the `packages` table is empty** and `app_meta.catalog_seeded` is not already `1`

You can also split the steps:

```bash
npm run db:up      # docker compose up -d
npm run db:seed    # schema + seed-if-empty
```

MySQL is published on **host port 3308** → container port 3306, so it does not clash with a local MySQL on 3306.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Log in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login) with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local`.

### Other commands

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

---

## Environment variables

Copy from `.env.example`. **Do not commit `.env.local`.** `.gitignore` ignores `.env*`.

| Variable | Required | Default (code) | Purpose |
| --- | --- | --- | --- |
| `MYSQL_HOST` | Yes (prod) | `127.0.0.1` | MySQL host |
| `MYSQL_PORT` | Yes (prod) | `3308` | Host port (Compose maps 3308→3306) |
| `MYSQL_USER` | Yes (prod) | `nextravel` | App user |
| `MYSQL_PASSWORD` | Yes (prod) | `nextravel` | App password |
| `MYSQL_DATABASE` | Yes (prod) | `nextravel` | Database name |
| `ADMIN_EMAIL` | Yes for login | — | Admin login email (compared case-insensitive) |
| `ADMIN_PASSWORD` | Yes for login | — | Admin login password (exact match) |
| `AUTH_SECRET` | Yes for login | — | HMAC secret for the admin cookie. Must be a long random string. |

If `ADMIN_EMAIL`, `ADMIN_PASSWORD`, or `AUTH_SECRET` is missing, login returns: *Admin login is not configured.*

Docker Compose also sets `MYSQL_ROOT_PASSWORD=nextravel` inside the container. That is for local development only.

---

## npm scripts

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `next dev` | Development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve production build |
| `lint` | `eslint` | Lint |
| `db:up` | `docker compose up -d` | Start MySQL in the background |
| `db:seed` | `npx tsx scripts/seed.ts` | Ensure DB + schema + seed if empty |
| `db:setup` | Compose up + seed | First-time local database |

---

## Public website

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About, stats, values |
| `/destinations` | All active packages |
| `/destinations/[slug]` | Full package page |
| `/gallery` | Photo grid from `data/gallery.ts` |
| `/contact` | Contact cards + WhatsApp form |
| `/terms` | Terms & Conditions (`data/terms.ts`) |
| `/privacy` | Privacy Policy (`data/privacy.ts`) |
| `/login` | Placeholder login UI |
| `/signup` | Placeholder signup UI |
| `/coming-soon/[slug]` | Placeholder (currently `product`) |
| `/admin/login` | Admin login |
| `/admin` | Package dashboard (auth required) |
| `/admin/packages/new` | Create package |
| `/admin/packages/[id]/edit` | Edit package |

### Home sections (`app/page.tsx`)

1. `Navbar`
2. `Hero` — headline, Get Package (WhatsApp), Watch Demo overlay
3. `TrustedBrands`
4. `ValueSection`
5. `FeaturedDestinations` — up to 6 featured (or any active) packages from MySQL
6. `DreamDestination`
7. `ExperienceSection`
8. `ExpertGuides` — copy from `data/guides.ts`
9. `ReviewsSection` — `data/reviews.ts`
10. `Footer` — includes `ConsultationCTA`

`PopularDestinations` is implemented but commented out on the homepage.

### Destination detail (`/destinations/[slug]`)

Rendered only if the package exists **and** is active.

- Hero with cover, name, location, duration, price, rating
- Photo gallery
- Overview
- Experience highlights (title + image)
- Itinerary accordion (day, title, summary, activities)
- Included / not included lists
- Sticky **Book Your Trip Now** form → WhatsApp
- Up to 3 related packages

Inactive packages return 404 on the public site. Admins can still open them via “View” from the dashboard (you will see 404 while inactive).

### Contact

Displayed:

- Phone / WhatsApp: `+91 8866486477`
- Email: `info@nextravelholidays.com`

The contact form builds a WhatsApp message (name, number, email, subject, message). It does not send email from the server.

---

## Admin CMS

### Access

1. Open `/admin` — unauthenticated users are redirected to `/admin/login?from=...`
2. Sign in with env credentials
3. Cookie `nextravel_admin` is set (httpOnly, SameSite=lax, 7 days, `secure` in production)
4. Dashboard layout calls `requireAdmin()` again (redirects if the token is invalid or expired)

### Dashboard

- Stat cards: total / active / inactive / featured
- If MySQL is down: error panel with `docker compose up -d` and `npm run db:seed`
- Empty catalog: prompt to create a package
- Each card: cover, Active toggle, Featured badge, Edit, View, Delete

### Package form fields

**Card details** (cards + hero)

- Title (slug auto-generated until the slug field is edited)
- URL slug (unique)
- Category: `City` · `Mountain` · `Beach` · `Nature` · `Other`
- Short description, location, duration, price, rating (0–5), sort order
- Active, Featured
- Cover image (upload or path / URL)

**Page content**

- Full overview
- Gallery photos
- Experience highlights (title + image)
- Itinerary intro, then days (number, title, summary, activities one per line)
- Included / not included (one item per line)

Validation lives in `lib/package-form.ts`. Duplicate slugs are rejected (`ER_DUP_ENTRY` or a pre-check).

After create/update/delete/toggle, these paths are revalidated: `/`, `/destinations`, `/admin`, and `/destinations/[slug]` when known.

Server Actions accept bodies up to **12 MB** (`next.config.ts`) so image uploads fit under the 8 MB file cap.

---

## Authentication

Single admin user. Credentials are **not** stored in the database.

1. `validateAdminCredentials` compares email and password with `crypto.timingSafeEqual` (length must match).
2. `createAdminToken` builds `{ role: "admin", exp }` JSON, HMAC-SHA256 with `AUTH_SECRET`, then base64url.
3. `verifyAdminToken` checks signature, role, and expiry.
4. `proxy.ts` only checks that the cookie **exists** for `/admin` routes. Full verification is in `requireAdmin()` / `isAdmin()`.

Logout deletes the cookie and redirects to `/admin/login`.

Admin pages set `robots: { index: false, follow: false }`.

---

## Database

### Docker Compose (`docker-compose.yml`)

- Image: `mysql:8.4`
- Container: `nextravel-mysql`
- Port: `3308:3306`
- User / password / database: `nextravel`
- Charset: `utf8mb4` / `utf8mb4_unicode_ci`
- Volume: `nextravel_mysql_data`
- Healthcheck: `mysqladmin ping`

Stop:

```bash
docker compose down
```

Data persists in the named volume. To wipe the catalog (destructive):

```bash
docker compose down -v
npm run db:setup
```

### Connection pool (`lib/db.ts`)

- Limit: 10
- Charset: `utf8mb4`
- Stored on `globalThis` so Next.js hot reload does not open extra pools
- `mysql2` is listed in `serverExternalPackages`

### Schema (`lib/schema.ts`)

Created automatically on first DB access (`ensureSchema()`).

| Table | Purpose |
| --- | --- |
| `packages` | One row per tour: slug, name, cover, rating, copy, location, price, duration, category, itinerary intro, featured, active, sort_order |
| `package_gallery` | Extra photos (`image_url`, `sort_order`) |
| `package_highlights` | Highlight title + image |
| `package_itinerary` | Day number, title, summary, `activities` JSON |
| `package_items` | `kind` = `included` \| `not_included`, label |
| `app_meta` | Key/value (e.g. `catalog_seeded`) |

Foreign keys use `ON DELETE CASCADE`. Unique index on `packages.slug`.

If an older database is missing `active`, the app runs:

```sql
ALTER TABLE packages ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1 AFTER featured
```

and ignores `ER_DUP_FIELDNAME`.

### Seed behaviour

- `seedIfEmpty()` inserts all `featuredDestinations` only when `COUNT(packages) = 0` **and** `catalog_seeded` is not `1`.
- If you delete every package after a successful seed, it will **not** auto-reseed (meta flag stays `1`). Use **Import sample packages** in admin, or insert rows yourself.
- `importSamplePackages()` inserts sample rows whose slugs are not already present.

Sample slugs in `data/destinations.ts`:

- `udaipur-mount-abu`
- `bali`
- `goa`
- `kerala`
- `kashmir`
- `manali-kasol-adventure`
- `kullu-manali-kasol-honeymoon`
- `shimla-manali-honeymoon`
- `himachal-amritsar`

---

## Package data model

Shared TypeScript type: `Destination` in `data/destinations.ts`. DB rows add `id`, `featured`, `active`, `sortOrder` (`PackageRecord`).

| Field | Public use |
| --- | --- |
| `slug` | URL `/destinations/[slug]` |
| `name` | Card title, page title, WhatsApp package name |
| `image` | Card + hero cover |
| `gallery` | Detail gallery (falls back to cover) |
| `rating` | Hero |
| `description` | Card blurb |
| `overview` | Detail + meta description |
| `location` | Card + hero |
| `price` | Card + hero (display string, e.g. `₹7,000`) |
| `duration` | Card + hero |
| `category` | Filtering / admin |
| `highlights` | Detail grid |
| `itineraryIntro` + `itinerary` | Accordion |
| `included` / `notIncluded` | Detail lists |
| `featured` | Homepage grid |
| `active` | Public visibility |
| `sortOrder` | List order (`ORDER BY sort_order, id`) |

Public helpers in `lib/packages.ts`:

- `getAllDestinations()` — active only
- `getDestination(slug)` — active only
- `getFeaturedDestinations(limit)` — featured first, else any active
- `getDestinationsByCategory(category)` — first 6

---

## Images and uploads

| Kind | Where |
| --- | --- |
| Site assets | `public/images/` |
| Favicon | `public/favicon.png`, `app/icon.png`, `app/apple-icon.png` |
| Admin uploads | `public/uploads/{timestamp}-{safe-filename}` |

`saveUploadedImage`:

- Types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`
- Max size: **8 MB**
- Returns a public path such as `/uploads/1710000000000-cover.jpg`

`public/uploads/*` is gitignored except `.gitkeep`. Uploaded files must be backed up or stored on persistent disk in production.

`next.config.ts` allows `next/image` for any `https` host plus `localhost` / `127.0.0.1`. Remote URLs use `unoptimized` where needed (`isRemoteSrc`).

Admin image fields accept:

- A local path (`/images/kerala.jpg`)
- An uploaded `/uploads/...` path
- A full `https://...` URL

---

## WhatsApp inquiries

Number is hardcoded in `lib/whatsapp.ts`: **918866486477**.

| Helper | Used on |
| --- | --- |
| `whatsappInquiryUrl` | Navbar “Get Inquiry”, contact card |
| `whatsappPackageUrl` | Hero “Get Package” |
| `whatsappConsultantUrl` | Footer consultation CTA |
| `buildBookingWhatsAppUrl` | Destination booking form |
| `buildContactWhatsAppUrl` | Contact page form |

Booking messages include package name, traveler name, WhatsApp number, travel date (`DD/MM/YYYY`), traveler count, and notes.

To change the business number, update `WHATSAPP_NUMBER` in `lib/whatsapp.ts` (and the tel/display strings on the contact page).

---

## Project structure

```
app/
  layout.tsx                 Root layout, Inter, metadata, favicon
  page.tsx                   Home
  globals.css                Tailwind v4 theme tokens
  about/ contact/ gallery/   Marketing pages
  destinations/              Index + [slug] detail
  privacy/ terms/            Legal
  login/ signup/             Placeholder auth UI
  coming-soon/[slug]/        Placeholder
  not-found.tsx
  admin/
    actions.ts               Server Actions (login, CRUD, upload, import)
    login/page.tsx
    (dashboard)/
      layout.tsx             requireAdmin()
      page.tsx               Package dashboard
      packages/new/
      packages/[id]/edit/

components/                  Public UI
components/admin/            AdminShell, PackageForm, ImageField, buttons

data/                        Static content and sample packages
  destinations.ts            Types + sample catalog
  gallery.ts reviews.ts guides.ts
  privacy.ts terms.ts comingSoon.ts

lib/
  db.ts packages-db.ts schema.ts packages.ts
  auth.ts auth-constants.ts
  package-form.ts uploads.ts whatsapp.ts utils.ts

scripts/seed.ts              CLI seed
proxy.ts                     Admin cookie gate
docker-compose.yml
next.config.ts
```

Path alias: `@/*` → repo root (`tsconfig.json`).

---

## Fallback when MySQL is down

`lib/packages.ts` catches connection/query errors, logs once (`[packages] MySQL is unavailable, using static destinations.`), and serves **active** entries from `getStaticDestinations()`.

The **admin dashboard does not fall back**. It shows a MySQL error and asks you to start Docker and seed.

So:

- Marketing site can still demo with sample packages
- CMS requires a live database

---

## Design system

Dark theme in `app/globals.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#000000` | Page |
| `--foreground` | `#ededed` | Headings / body |
| `--brand` / `--pink` | `#e20e17` | CTAs, accents |
| `--muted` | `#9a9a9a` | Secondary text |
| `--card` | `#111111` | Cards |
| `--soft` | `#141414` | Panels |
| `--line` | `#2a2a2a` | Borders |

Font: **Inter** (`--font-inter`). Brand red `#E20E17` is used on buttons, underlines, and admin accents.

---

## Development notes

- **Next.js 16:** prefer current docs over older App Router examples. `proxy.ts` replaces the old middleware file for this app’s admin gate.
- **Dynamic catalog:** destination routes are force-dynamic; `getAllDestinations` awaits `connection()` so they are not statically frozen at build time.
- **Transactions:** insert/update wrap the package row and related tables; rollback on failure.
- **Slug:** `slugify()` lowercases, replaces non-alphanumerics with `-`.
- **Customer login:** `/login` and `/signup` forms currently `action="/destinations"` — they are not wired to auth.
- **AGENTS.md:** generated by `next dev`; leave it in place.

---

## Production checklist

1. Set all env vars on the host (never use example passwords).
2. Use a strong unique `AUTH_SECRET` and a strong `ADMIN_PASSWORD`.
3. Point `MYSQL_*` at a managed MySQL 8 instance (not the Compose defaults).
4. Run schema/seed once against that instance (`npm run db:seed` with production env, or migrate tables yourself).
5. Persist `public/uploads/` (or move uploads to object storage later).
6. Serve HTTPS so the admin cookie can use `secure: true`.
7. Restrict who can reach `/admin` (VPN, IP allowlist, or similar) in addition to the cookie.
8. Run `npm run build` and `npm run start` (or your platform’s Next.js adapter).
9. Confirm WhatsApp number and contact email before launch.

Vercel (or similar) needs a reachable MySQL host; Docker Compose is for local use. Uploaded files on ephemeral filesystems will disappear unless you attach a volume or external storage.

---

## Troubleshooting

**Admin login: “Admin login is not configured”**  
Add `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` to `.env.local` and restart `npm run dev`.

**Admin login: “Invalid email or password”**  
Email is trimmed and lowercased. Password must match exactly (including spaces).

**Dashboard: MySQL is not connected**  
Start Compose (`npm run db:up`), wait for healthy, confirm `.env.local` host/port (`127.0.0.1:3308`). Then `npm run db:seed`.

**Public site shows sample packages, admin is empty or errors**  
Public fallback is on; admin talks only to MySQL. Fix the database connection.

**New package does not appear on the site**  
Check **Active**. Featured-only homepage grid needs **Featured** (or no featured rows, in which case any active packages fill the grid).

**Slug already exists**  
Change the slug. Unique index `uq_packages_slug`.

**Image upload fails**  
Use JPG/PNG/WEBP/GIF under 8 MB. Ensure `public/uploads` is writable.

**Port 3308 already in use**  
Change the left side of `3308:3306` in `docker-compose.yml` **and** `MYSQL_PORT` in `.env.local`.

**Seed did not insert packages**  
Table is not empty, or `catalog_seeded` is already `1`. Import from admin or insert manually.

**Cookie not set in production**  
Site must be HTTPS (`secure` cookie). Confirm `AUTH_SECRET` is set the same on every instance.
