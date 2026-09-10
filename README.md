# NexTravel Holidays

Marketing website and admin CMS for **NexTravel Holidays** — curated holiday packages across India. Visitors browse destinations, read itineraries, and inquire on WhatsApp. Admins manage packages, gallery, reviews, site photos, and legal pages in MySQL.

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

NexTravel is a **Next.js App Router** site for a travel agency. Public pages are a dark, branded marketing experience. Catalog and CMS content live in **MySQL 8**. If MySQL is unreachable, the public site still falls back to static samples in `data/`.

There is no customer checkout. Booking and contact forms open a pre-filled WhatsApp chat.

The admin area is a **cookie-authenticated CMS**. From `/admin` you manage packages, gallery, reviews, legal pages, image optimisation, and settings. Site marketing photos are edited at the hidden route `/admin/7script`.

---

## Features

### Public site

- Home: hero, trusted brands, value props, featured packages, dream destination, experience, expert guides, **flipping reviews** (every 5 seconds)
- Destinations: active packages as cards with **offer price** + optional **original (strikethrough) price**
- Destination detail: hero, gallery, overview, highlights, itinerary, inclusions, booking form
- About, gallery, contact
- **Terms & Privacy** loaded from MySQL (`legal_pages`)
- WhatsApp CTAs across navbar, forms, and footer

### Admin CMS (`/admin`)

| Area | Route | Notes |
| --- | --- | --- |
| Packages | `/admin` | CRUD, featured, green **ON/OFF** active toggle, offer + original price |
| Gallery | `/admin/gallery` | Public `/gallery` photos |
| Reviews | `/admin/reviews` | Carousel reviews (avatar, quote, rating, type) |
| Legal | `/admin/legal` | Edit Terms & Privacy |
| Optimise img | `/admin/optimise` | Compress pending images |
| Settings | `/admin/settings` | Visible admin email/password only |
| 7script (hidden) | `/admin/7script` | Site marketing photos (not in sidebar) |

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js **16.3.1** (App Router) |
| UI | React **19.2.8**, Tailwind CSS **4**, Inter via `next/font` |
| Icons | lucide-react |
| Database | MySQL **8** (`mysql2`) |
| Images | `sharp` (upload + optimise) |
| Auth | HMAC-signed cookie (`nextravel_admin`), 7-day expiry |
| Forms | Next.js Server Actions |
| Seed | `tsx` + `scripts/seed.ts` |

Admin request gating uses `proxy.ts` (not `middleware.ts`). Prefer docs under `node_modules/next/dist/docs/`.

---

## Architecture

```
Browser
  ├── Public pages
  │     ├── packages / gallery / reviews / legal / site_images  → MySQL
  │     └── data/*.ts fallbacks when MySQL is down
  │
  ├── Booking / Contact → wa.me/{WHATSAPP_NUMBER}
  │
  └── /admin
        ├── proxy.ts            cookie present?
        ├── layout requireAdmin()
        └── Server Actions      lib/*-db.ts → MySQL
```

| Module | Role |
| --- | --- |
| `lib/packages.ts` / `packages-db.ts` | Package catalog + CRUD |
| `lib/gallery.ts` / `gallery-db.ts` | Public gallery |
| `lib/reviews.ts` / `reviews-db.ts` | Reviews carousel |
| `lib/site-images.ts` / `site-images-db.ts` | Marketing photo slots |
| `lib/legal.ts` / `legal-db.ts` | Terms & Privacy |
| `lib/admin-credentials.ts` | Visible + hidden admins in `app_meta` |
| `lib/auth.ts` | Login token + credential check |
| `lib/schema.ts` | `CREATE TABLE IF NOT EXISTS` |
| `lib/db.ts` | mysql2 pool |
| `proxy.ts` | Unauthenticated `/admin/*` → login |

---

## Prerequisites

- Node.js **20+**
- npm
- MySQL **8** (system install, Homebrew, or **XAMPP** — match `MYSQL_PORT` in `.env.local`)

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Set MySQL host/port/user/password. Set a long random `AUTH_SECRET`.

### 3. Database

```bash
mysql -u root -p < database/nextravel.sql
npm run db:seed
```

XAMPP example:

```bash
/Applications/XAMPP/xamppfiles/bin/mysql -u root -P 3307 < database/nextravel.sql
```

Then set `MYSQL_PORT=3307` (and empty password if needed) in `.env.local`.

`npm run db:seed` will:

1. Load `.env.local`
2. Create DB if allowed
3. Run schema (`ensureSchema`)
4. Ensure **both** default admin accounts
5. Seed packages / gallery / reviews / legal pages when empty

### 4. Run

```bash
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `MYSQL_HOST` | Prod | `127.0.0.1` | MySQL host |
| `MYSQL_PORT` | Prod | `3306` | MySQL port (XAMPP often `3307`) |
| `MYSQL_USER` | Prod | `nextravel` | DB user |
| `MYSQL_PASSWORD` | Prod | `nextravel` | DB password |
| `MYSQL_DATABASE` | Prod | `nextravel` | Database name |
| `ADMIN_EMAIL` | Fallback | — | Visible admin fallback if DB empty |
| `ADMIN_PASSWORD` | Fallback | — | Visible admin fallback |
| `AUTH_SECRET` | Yes | — | HMAC secret for admin cookie |
| `NEXT_PUBLIC_SITE_URL` | SEO | — | Canonical / Open Graph base URL |

Prefer DB credentials (Settings + seeded defaults) over env for day-to-day login. Env remains a fallback.

---

## npm scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run db:seed` / `db:setup` | Schema + seed-if-empty + default admins |

---

## Public website

| Route | Content source |
| --- | --- |
| `/` | Home (packages, reviews, site images) |
| `/about` | About + collage / founder from `site_images` |
| `/destinations` | Active packages |
| `/destinations/[slug]` | Package detail |
| `/gallery` | `gallery_items` |
| `/contact` | Contact + hero from `site_images` |
| `/terms` | `legal_pages` slug `terms` |
| `/privacy` | `legal_pages` slug `privacy` |
| `/admin/*` | CMS (auth required except login) |

### Destination cards

- Show **offer price** (`price`)
- If set, show **original price** above it with strikethrough (`original_price`)

### Reviews

- Up to many reviews in MySQL; **4 slots** flip every **5 seconds**
- Two side photos come from `site_images` (`reviews_photo_1`, `reviews_photo_2`)

---

## Admin CMS

### Sidebar

Packages · Gallery · Reviews · Legal · Optimise img · Settings  

**7script** is **not** in the sidebar. Open manually: [http://localhost:3000/admin/7script](http://localhost:3000/admin/7script)

### Packages

- Offer price + optional original price
- Green **ON** / gray **OFF** active toggle
- Featured, sort order, gallery, highlights, itinerary, inclusions

### Gallery / Reviews

- CRUD + ON/OFF active toggle
- Import sample data buttons

### Legal

- Edit Terms & Conditions and Privacy Policy (sections, intro, last updated)

### Optimise img

- Lists images waiting to compress; run AI optimise (paths unchanged)

### 7script

- All marketing site photos (home, about, destinations hero, contact, etc.)

---

## Authentication

Two admin accounts are stored in **`app_meta`** (not a separate users table).

### Visible (Settings)

| | |
| --- | --- |
| Email | `pulkit@nextravelholidays.com` |
| Password | `1234567890` |

Shown and editable in **Admin → Settings**.

### Hidden (system / 7Script)

| | |
| --- | --- |
| Email | `admin@7scripttechnologies.com` |
| Password | `admin@7s@!!` |

Can sign in at `/admin/login`. **Not** shown in Settings. Reserved email cannot be used as the visible Settings email.

Both accounts work for login. Cookie: `nextravel_admin` (httpOnly, 7 days, `secure` in production).

---

## Database

### Import

```bash
mysql -u root -p < database/nextravel.sql
npm run db:seed
```

Schema source of truth for fresh installs: `database/nextravel.sql`  
Runtime bootstrap: `lib/schema.ts` via `ensureSchema()` (also adds missing columns such as `active`, `original_price`).

### Tables

| Table | Purpose |
| --- | --- |
| `packages` | Tours: slug, copy, `price`, `original_price`, featured, active, sort_order |
| `package_gallery` | Extra package photos |
| `package_highlights` | Highlight title + image |
| `package_itinerary` | Days + activities JSON |
| `package_items` | Included / not included |
| `gallery_items` | Public gallery |
| `reviews` | Review carousel |
| `site_images` | Marketing image slots (`image_key`, `image_url`, `caption`) |
| `legal_pages` | `terms` / `privacy` pages (`sections_json`) |
| `app_meta` | Seed flags + admin credentials |

### Important `app_meta` keys

| Key | Meaning |
| --- | --- |
| `admin_email` / `admin_password` | Visible admin |
| `admin_hidden_email` / `admin_hidden_password` | Hidden admin |
| `admin_defaults_v2` | Defaults applied |
| `catalog_seeded` / `gallery_seeded` / `reviews_seeded` | Seed guards |

### Seed behaviour

- Packages: insert samples only when table empty and `catalog_seeded` ≠ `1`
- Gallery / reviews / legal: seed-if-empty from `data/*`
- Admins: ensured on seed and on credential reads

---

## Package data model

Type: `Destination` in `data/destinations.ts` (+ `id`, `featured`, `active`, `sortOrder` from DB).

| Field | Use |
| --- | --- |
| `price` | Offer / sale price on cards and hero |
| `originalPrice` | Optional MRP shown with strikethrough |
| `active` | Public visibility |
| `featured` | Homepage featured grid |
| `sortOrder` | List order |

---

## Images and uploads

| Kind | Where |
| --- | --- |
| Static assets | `public/images/` |
| Admin uploads | `public/uploads/` |
| Marketing slots | `site_images` → often `/images/...` or `/uploads/...` |
| Gallery / reviews / packages | Their own tables |

Upload limits: JPG/PNG/WEBP/GIF, max **8 MB**. Optimise page compresses pending files in place.

---

## WhatsApp inquiries

Number in `lib/whatsapp.ts`: **918866486477**.

Helpers: inquiry, package, consultant, booking form, contact form.

---

## Project structure

```
app/
  page.tsx                    Home
  about/ contact/ gallery/
  destinations/               Index + [slug]
  privacy/ terms/             Legal (from MySQL)
  admin/
    actions.ts
    login/
    (dashboard)/
      page.tsx                Packages
      gallery/ reviews/ legal/
      optimise/ settings/
      7script/                Hidden site photos CMS
      packages/

components/                   Public UI (ReviewsCarousel, DestinationCard, …)
components/admin/             AdminShell, forms, StatusToggle (ON/OFF)

data/                         Static fallbacks + samples
lib/                          db, *-db, auth, schema, uploads, whatsapp
scripts/seed.ts
database/nextravel.sql
proxy.ts
```

---

## Fallback when MySQL is down

Public loaders fall back to `data/destinations.ts`, `data/gallery.ts`, `data/reviews.ts`, `data/terms.ts` / `data/privacy.ts`, and default site image paths.

**Admin does not fall back** — it shows a MySQL error until the DB is up.

---

## Design system

Dark theme (`app/globals.css`): black background, `#ededed` text, brand `#e20e17`, muted `#9a9a9a`, cards `#111111`. Font: **Inter**.

Admin active toggle: green **ON** / gray **OFF** (`StatusToggle`).

---

## Development notes

- Next.js 16: use `proxy.ts` for admin gate; check current docs before API changes.
- Destination routes are force-dynamic.
- Package writes use transactions across related tables.
- Customer `/login` and `/signup` are UI placeholders only.

---

## Production checklist

1. Strong unique `AUTH_SECRET` and admin passwords (change defaults).
2. Managed MySQL 8 + run `nextravel.sql` / `db:seed` once.
3. Persist `public/uploads/`.
4. HTTPS for secure admin cookies.
5. Restrict `/admin` (VPN / IP allowlist recommended).
6. Confirm WhatsApp number and contact email.
7. `npm run build` && `npm run start` (or platform adapter).

---

## Troubleshooting

**Admin login not configured**  
Set `AUTH_SECRET` (and optionally `ADMIN_EMAIL` / `ADMIN_PASSWORD`) in `.env.local`, restart dev server.

**Invalid email or password**  
Use visible or hidden account exactly. Email is lowercased; password is exact.

**MySQL is not connected**  
Check host/port (XAMPP often **3307**). Import `database/nextravel.sql`, run `npm run db:seed`.

**Where are admin users in phpMyAdmin?**  
Open table **`app_meta`** — keys `admin_email`, `admin_password`, `admin_hidden_*`. There is no `users` table.

**Package missing on site**  
Ensure Active is **ON**. Check Featured for homepage grid.

**Seed did not insert packages**  
Table not empty or `catalog_seeded` is `1`. Use Import samples in admin.

**Cookie issues in production**  
Need HTTPS and the same `AUTH_SECRET` on all instances.
