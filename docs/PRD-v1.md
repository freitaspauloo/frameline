# V1 � Backgrounds storefront PRD (archived)

> Historical draft. Kept for reference. Active product: `docs/PRD.md`.

# Relay � Product Requirements Document (V1)

##
 1. Overview / Summary

**Relay** is a design
er-owned platform for showcasing and selling 
digital design assets, launching with a curat
ed catalog of **backgrounds** (wallpapers, ab
stract compositions, gradients, textures, and
 patterns).

Relay serves a dual purpose:

1.
 **Portfolio** � a beautifully crafted show
case that demonstrates the designer's visual 
craft, taste, and attention to detail. The si
te itself is a portfolio piece; its polish is
 part of the product.
2. **Storefront** � a
 self-serve commerce experience where visitor
s can browse, preview, license, purchase, and
 download assets, with both free and premium 
tiers.

The platform is built by and for a **
solo designer**: it must be simple to operate
 (upload, price, publish, fulfill) without a 
team, while remaining extensible so future as
set categories (icons, illustrations, UI kits
, mockups) can be added without re-architecti
ng.

**MVP in one sentence:** A fast, visuall
y stunning site where a visitor can discover 
backgrounds, view rich previews, buy or downl
oad one in under a minute, and where the desi
gner can publish a new asset in under five mi
nutes.

---

## 2. Problem Statement & Motiva
tion

### For the designer (seller)

- Existi
ng marketplaces (Creative Market, Gumroad, En
vato, etc.) take significant revenue cuts, bu
ry individual creators in crowded catalogs, a
nd impose their own branding and browsing exp
erience � the opposite of a portfolio.
- Ge
neric portfolio sites (Behance, Dribbble, per
sonal sites) showcase work but have no native
, polished way to **sell** it.
- The designer
 needs a single destination that is both a cr
edibility signal ("this person can design and
 ship a product") and a revenue channel � f
ully under their own brand, domain, and creat
ive control.

### For buyers

- Finding high-
quality, tasteful backgrounds is noisy: stock
 sites are bloated with low-quality volume; m
arketplaces have inconsistent quality and con
fusing licensing.
- Buyers want **curation** 
(a single strong point of view), **clear lice
nsing** they can understand in one read, **in
stant delivery**, and confidence in what they
're getting (resolution, formats, how it will
 look in context).

### Why now

- A small, c
urated catalog from a single designer with a 
strong aesthetic is a differentiator, not a l
imitation.
- Modern web tooling makes it feas
ible for one person to run a fast, secure, hi
gh-polish commerce site without a backend tea
m.

---

## 3. Goals and Non-Goals

### Goals


- **G1 � Showcase craft.** The site's vis
ual design, motion, and browsing experience s
hould itself demonstrate the designer's skill
. Quality bar: "would this get featured on a 
design gallery site?"
- **G2 � Sell backgro
unds.** Enable one-off purchases and free dow
nloads of background assets with clear licens
ing and instant delivery.
- **G3 � Friction
less buying.** A visitor can go from landing 
to a completed download in under a minute, in
cluding guest checkout.
- **G4 � Solo-opera
ble.** Uploading, organizing, pricing, and pu
blishing an asset takes minutes; fulfillment 
is fully automated.
- **G5 � Extensible fou
ndation.** The data model, IA, and URLs are d
esigned so new asset categories can be added 
later without breaking changes.
- **G6 � Di
scoverable.** Strong SEO and shareability so 
assets and collections rank and circulate org
anically.

### Non-Goals (explicitly out of s
cope)

- **Multi-vendor marketplace.** Relay 
is single-seller. No third-party creator onbo
arding.
- **User-generated content.** No publ
ic uploads, comments, or reviews at launch.
-
 **Subscriptions at MVP.** All-access passes 
/ memberships are a later-phase consideration
, not MVP.
- **Custom/commission workflow.** 
A contact link is fine; a full briefing/quoti
ng system is not in scope.
- **Native mobile 
apps.** Web-first, responsive.
- **Complex en
terprise licensing.** No negotiated contracts
, seat management, or invoicing workflows at 
MVP.
- **AI generation features.** Relay sell
s human-crafted assets; generation tooling is
 out of scope.

---

## 4. Target Users & Per
sonas

### Buyer personas

**P1 � Priya, Pr
oduct Designer (primary)**
- Works at a start
up; needs backgrounds for marketing sites, ap
p onboarding screens, presentation decks.
- V
alues: quality and taste over volume, clear c
ommercial licensing, correct formats/resoluti
ons, fast checkout on a company card.
- Frust
ration: wading through stock-site noise; ambi
guous license terms she has to run past legal
.

**P2 � Marcus, Indie Developer / Founder
**
- Building an app or landing page solo; no
 design skills, limited budget.
- Values: fre
e tier to try, cheap one-off purchases, asset
s that make his product look professional ins
tantly, obvious "can I use this commercially?
" answers.
- Frustration: assets that look gr
eat in thumbnails but arrive low-res or water
marked.

**P3 � Sofia, Content Creator / So
cial Media Manager**
- Needs backgrounds for 
thumbnails, stories, streams, and device wall
papers.
- Values: variety of aspect ratios (v
ertical, square, ultrawide), trend-aware aest
hetics, quick browsing on mobile.
- Frustrati
on: assets offered in only one aspect ratio o
r resolution.

**P4 � The Appreciator / Fel
low Designer (secondary)**
- Browses for insp
iration, may download free assets, follows th
e designer's work.
- Value to Relay: word-of-
mouth, backlinks, social sharing, future hiri
ng/collab leads. The portfolio goal (G1) is l
argely for this audience.

### Seller persona


**P5 � The Designer (owner/operator)**
- 
Solo designer; strong visual skills, moderate
 technical comfort. No dedicated engineering 
or support staff.
- Needs: dead-simple upload
 and publishing flow, automated payments and 
delivery, basic sales visibility, and confide
nce the site won't break or leak paid files.

- Success looks like: publishing weekly drops
, growing an audience, generating meaningful 
side income, and using Relay as proof of prod
uct-design ability.

---

## 5. User Stories 
/ Jobs To Be Done

### Buyer stories

- **B1.
** As a visitor, I can browse the catalog vis
ually (large previews, minimal chrome) so I c
an quickly judge whether the style fits my pr
oject.
- **B2.** As a visitor, I can filter a
nd search by category, style, color, orientat
ion/aspect ratio, and price (free/premium) so
 I can narrow to what I need.
- **B3.** As a 
visitor, I can open an asset detail page with
 full-quality previews, in-context mockups, a
nd complete specs (dimensions, formats, file 
size) so I know exactly what I'm buying.
- **
B4.** As a visitor, I can understand the lice
nse in plain language before purchase so I'm 
confident about how I may use the asset.
- **
B5.** As a visitor, I can download free asset
s with minimal friction (at most an email cap
ture) so I can try before I buy.
- **B6.** As
 a buyer, I can purchase as a guest with a ca
rd (or wallet like Apple Pay/Google Pay) and 
receive an instant download link so checkout 
takes under a minute.
- **B7.** As a buyer, I
 receive an email receipt with a durable re-d
ownload link so I can retrieve files later or
 on another device.
- **B8.** As a returning 
buyer with an account, I can see my purchase 
history and re-download anything I own.
- **B
9.** As a visitor, I can browse curated colle
ctions (e.g., "Gradient Series 01," "Dark Mod
e Textures") so I can discover assets by them
e.
- **B10.** As a mobile visitor, I can brow
se, buy, and download comfortably on my phone
.

### Designer (admin) stories

- **D1.** As
 the designer, I can upload an asset with its
 files (multiple resolutions/formats), previe
ws, title, description, tags, category, colle
ction, and price, then publish it � in one 
flow, in minutes.
- **D2.** As the designer, 
I can mark an asset free or premium and set i
ts price and license type per asset.
- **D3.*
* As the designer, I can create and reorder c
ollections and feature specific assets/collec
tions on the homepage.
- **D4.** As the desig
ner, I can unpublish or edit an asset without
 breaking existing buyers' download links.
- 
**D5.** As the designer, I can see a simple d
ashboard: revenue, orders, top assets, free-d
ownload counts.
- **D6.** As the designer, I 
can trust that source files are never publicl
y accessible and paid files can't be hotlinke
d or scraped.
- **D7.** As the designer, I ca
n issue a refund and revoke the associated do
wnload access.

---

## 6. Product Scope � 
MVP vs. Later Phases

### MVP (Phase 1): Brow
se + sell backgrounds

| Area | In MVP |
|---
|---|
| Catalog | Backgrounds only; categorie
s/subcategories (gradients, textures, pattern
s, abstract, wallpapers); tags; collections |

| Discovery | Visual browse grid, filters (s
ubcategory, color, orientation, free/premium)
, keyword search, collections |
| Asset pages
 | Rich previews, watermarked/full-view image
s, specs, license summary, related assets |
|
 Commerce | Cart + guest checkout via hosted 
payment provider; free downloads (with option
al email capture); instant delivery via signe
d links; email receipts with re-download |
| 
Licensing | Two tiers: Personal and Commercia
l; plain-language license pages |
| Admin | A
uth-protected admin: upload, edit, publish/un
publish, price, organize collections, basic s
ales dashboard |
| Accounts | Optional buyer 
accounts (email magic link) for purchase hist
ory; guest checkout is the default path |
| P
latform | Responsive, SEO-ready, fast image d
elivery, analytics |

### Phase 2: Growth & p
olish

- Buyer accounts enriched: favorites/w
ishlists, library view.
- Discount codes and 
launch promos; "pay what you want" option for
 select assets.
- Email list integration and 
drop announcements (new collection notificati
ons).
- Bundles (buy a collection at a discou
nt).
- Improved search (color-based search fr
om extracted palettes, similarity/related-ass
et improvements).
- Extended License tier (hi
gher usage rights, higher price).
- Basic ana
lytics deepening: conversion funnels, per-ass
et views?downloads?purchases.

### Phase 
3: Category expansion & recurring revenue

- 
Second asset category (e.g., icons or UI kits
) � validates the extensibility of the data
 model, IA, and preview system (each category
 may need category-specific preview types and
 metadata).
- All-access pass / membership (s
ubscription) with gated library.
- Licensing 
upgrades (buy Personal, later upgrade to Comm
ercial by paying the difference).
- Localizat
ion/multi-currency display if buyer geography
 warrants it.

### Explicitly deferred indefi
nitely

- Multi-vendor support, public review
s, affiliate program, API for third parties.


---

## 7. Functional Requirements

Requirem
ents use MoSCoW priorities: **[M]** Must, **[
S]** Should, **[C]** Could (all scoped to MVP
 unless marked Phase 2+).

### 7.1 Browsing, 
Search & Filtering

- **[M]** Visual catalog 
grid with lazy-loaded, optimized preview imag
es; infinite scroll or paginated (choose one;
 must preserve scroll position on back-naviga
tion).
- **[M]** Filter by: subcategory, orie
ntation/aspect ratio (landscape/portrait/squa
re/ultrawide), pricing (free/premium), color 
family.
- **[M]** Keyword search across title
, description, and tags with instant or near-
instant results.
- **[M]** Sort by: newest, p
opular (downloads/purchases), price.
- **[M]*
* Collections index and collection detail pag
es (curated groupings with cover art and desc
riptions).
- **[S]** Filter state reflected i
n the URL (shareable/bookmarkable filtered vi
ews; also aids SEO).
- **[C]** Color extracti
on from assets to power color filtering autom
atically (else manually tagged at upload).

#
## 7.2 Asset Detail Pages

- **[M]** Large, h
igh-quality preview with zoom/full-screen vie
w. Previews are watermarked or resolution-lim
ited derivatives � never the deliverable fi
le.
- **[M]** Specs block: dimensions/resolut
ions included, file formats (e.g., PNG, JPG, 
SVG where applicable), total file size, inclu
ded variants (e.g., 4K, 5K, mobile vertical).

- **[M]** Pricing and license selector (Pers
onal / Commercial) with a one-paragraph plain
-language license summary and link to full te
rms.
- **[M]** Primary CTA: "Download free" o
r "Add to cart / Buy now" depending on tier.

- **[M]** Related assets (same collection, su
bcategory, or tags).
- **[S]** In-context moc
kup previews (asset shown on a device wallpap
er, website hero, presentation slide).
- **[S
]** Social sharing metadata (Open Graph/Twitt
er cards) rendering the asset preview beautif
ully.
- **[C]** Live preview tool (e.g., prev
iew the background at different aspect ratios
/crops).

### 7.3 Cart, Checkout & Payments


- **[M]** Cart supporting multiple assets; pe
r-item license selection.
- **[M]** Guest che
ckout � no account required to purchase.
- 
**[M]** Payments via a hosted, PCI-compliant 
provider (recommendation: Stripe Checkout). C
ard + Apple Pay/Google Pay. Relay never touch
es raw card data.
- **[M]** Order confirmatio
n page with immediate download access.
- **[M
]** Email receipt containing order summary, l
icense summary, and re-download link.
- **[M]
** Tax handling: use provider-supported autom
ated tax calculation (e.g., Stripe Tax) or cl
early scoped manual configuration; digital-go
ods VAT/sales-tax obligations must be address
ed before accepting international payments.
-
 **[S]** Refund flow (admin-initiated) that r
evokes download tokens for that order.
- **[C
]** Discount/promo codes (Phase 2).

### 7.4 
Free Downloads

- **[M]** Free assets downloa
dable without payment.
- **[S]** Optional ema
il capture before free download (configurable
 per asset or globally; must be skippable or 
clearly value-exchanged to avoid dark-pattern
 feel).
- **[M]** Free downloads counted in a
nalytics and delivered through the same signe
d-URL mechanism as paid files.

### 7.5 Licen
sing

- **[M]** Two license tiers at MVP:
  -
 **Personal** � non-commercial use (wallpap
ers, personal projects, mockups not for sale)
.
  - **Commercial** � use in client work, 
products, marketing, monetized content; defin
ed reasonable limits (see �11).
- **[M]** Ea
ch order records the exact license tier and l
icense version purchased (licenses are versio
ned; changes never retroactively alter past p
urchases).
- **[M]** Full license terms on a 
dedicated page; plain-language summary at poi
nt of sale.
- **[S]** License text included i
n the download package or receipt email.

###
 7.6 Downloads & Delivery

- **[M]** Files st
ored in private object storage; delivered onl
y via expiring signed URLs generated after en
titlement verification.
- **[M]** Durable re-
download: receipt email links to an order pag
e that can mint fresh signed URLs (rate-limit
ed).
- **[M]** Multi-file assets delivered as
 a ZIP (or per-file downloads) � decided pe
r asset at upload.
- **[M]** Download links r
esilient to asset file updates (buyers get th
e latest version; version noted in filenames 
or changelog).
- **[S]** Per-order download l
imits/rate limiting to deter link sharing (ge
nerous � never punish legitimate buyers).


### 7.7 Designer Admin (Upload & Management)


- **[M]** Secure admin area (strong auth �
 passkey or password + 2FA; single admin user
 is acceptable at MVP).
- **[M]** Asset creat
ion flow: upload deliverable files + preview 
images, auto-generate optimized preview deriv
atives, enter metadata (title, slug, descript
ion, tags, subcategory, orientation, collecti
on), set tier/price/license availability, sav
e as draft, publish.
- **[M]** Edit and unpub
lish without breaking existing purchase entit
lements.
- **[M]** Collection management: cre
ate, edit, order assets within, set cover, fe
ature on homepage.
- **[M]** Orders view: lis
t of orders with status, buyer email, items; 
refund action.
- **[S]** Dashboard: revenue o
ver time, orders, top assets, free-download c
ounts, traffic summary (or link out to analyt
ics tool).
- **[C]** Bulk upload / CSV metada
ta import (Phase 2, useful for large drops).


### 7.8 Accounts & Auth

- **[M]** Buyer acc
ounts are **optional**; guest checkout is fir
st-class. Orders are keyed to email.
- **[M]*
* Passwordless auth for buyers (email magic l
ink or code) to view purchase history and re-
download.
- **[S]** Post-purchase prompt: "Sa
ve this order to an account" (claims guest or
ders by verified email).
- **[M]** Admin auth
 is separate and hardened (see 7.7).

### 7.9
 Content & Marketing Pages

- **[M]** Homepag
e: hero showcasing featured collection/assets
, curated highlights, entry points to browse.
 This page carries the heaviest portfolio wei
ght � highest design/motion polish.
- **[M]
** About page: the designer's story, craft, a
nd process (portfolio credibility).
- **[M]**
 License, Terms, Privacy, and Contact/Support
 pages.
- **[S]** Simple journal/changelog fo
r drops (aids SEO and return visits; can be P
hase 2).

---

## 8. Non-Functional Requireme
nts

### Performance
- Largest Contentful Pai
nt < 2.0s on 4G for catalog and asset pages; 
Core Web Vitals in the "good" range across th
e site.
- Image-heavy pages must use responsi
ve images, modern formats (AVIF/WebP with fal
lbacks), lazy loading, and blur-up/dominant-c
olor placeholders (placeholders are also an a
esthetic opportunity).
- Catalog interactions
 (filter, sort, search) feel instant (< 200ms
 perceived).

### Image Delivery & Optimizati
on
- All previews served via CDN with on-the-
fly resizing/format negotiation.
- Deliverabl
e files never pass through the public CDN cac
he; signed URLs only.
- Preview derivatives g
enerated automatically at upload (multiple si
zes, watermarked where applicable) � never 
manual.

### SEO
- Server-rendered (or static
ally generated) catalog, collection, and asse
t pages with unique titles/descriptions, cano
nical URLs, and `Product` structured data (JS
ON-LD).
- Clean, stable, human-readable URLs:
 `/backgrounds/gradients/aurora-drift-01`. Ca
tegory segment in the path supports future ca
tegories.
- Sitemap, robots, Open Graph/Twitt
er images per asset and collection.

### Acce
ssibility
- WCAG 2.1 AA target: full keyboard
 navigability, visible focus states, alt text
 for all previews (entered at upload), suffic
ient contrast in UI chrome, motion-reduction 
respect (`prefers-reduced-motion`), accessibl
e forms and checkout.
- Note: a visually rich
 site is not exempt � accessible polish is 
part of the portfolio statement.

### Securit
y
- HTTPS everywhere; HSTS. No card data touc
hes Relay servers (hosted checkout).
- Privat
e storage for deliverables; expiring signed U
RLs; entitlement checks server-side on every 
download mint.
- Admin: strong auth, session 
hardening, audit-relevant logging of admin ac
tions.
- Payment webhook signature verificati
on; idempotent order fulfillment.
- Standard 
protections: rate limiting on download/auth e
ndpoints, input validation, dependency update
s.

### Privacy & Compliance
- Minimal data c
ollection (email + order data). Clear privacy
 policy. Cookie-consent handling appropriate 
to buyer geographies. GDPR-friendly analytics
 preferred.

### Responsiveness & Compatibili
ty
- Fully responsive from 360px to ultrawide
. Touch-friendly browsing and checkout. Last 
two major versions of evergreen browsers.

##
# Reliability & Operability
- Checkout and do
wnload paths are the critical availability su
rface; degraded browse is tolerable, failed f
ulfillment is not.
- Automated backups of the
 database; storage redundancy via cloud provi
der.
- Error monitoring and alerting suitable
 for a solo operator (email/push on payment o
r fulfillment failures).

---

## 9. Informat
ion Architecture & Key Pages/Screens

```
Hom
e
+-- Browse (/backgrounds)            
     ? category root; future: /icons, /ui-k
its �
�   +-- Subcategory views (/b
ackgrounds/gradients, /textures, �)
�   ?
??-- Asset detail (/backgrounds/{subcateg
ory}/{slug})
+-- Collections (/collecti
ons)
�   +-- Collection detail (/coll
ections/{slug})
+-- Search results (/se
arch?q=�)
+-- Cart (/cart) ? Checko
ut (hosted) ? Order confirmation (/orders/{
token})
+-- Free downloads entry (filte
red browse view, /backgrounds?tier=free)
+?
??- About (/about)
+-- License (/lice
nse) � Terms � Privacy � Contact
+--
 Account (/account)
�   +-- Purchase 
history & re-downloads
�   +-- Sign i
n (magic link)
+-- Admin (/admin) � a
uth-gated
    +-- Assets (list, create,
 edit)
    +-- Collections
    +-?
? Orders (+ refunds)
    +-- Dashboard

```

**Key screens and their jobs:**

| Scree
n | Primary job | Design notes |
|---|---|---
|
| Home | Impress + route to browse | Hero-l
evel polish; featured collection; motion welc
ome here |
| Browse grid | Fast visual scanni
ng | Dense but breathable grid; sticky filter
s; instant feedback |
| Asset detail | Conver
t (buy/download) | Big preview, zoom, mockups
, specs, unambiguous CTA + license clarity |

| Collection detail | Curated storytelling | 
Editorial layout; collection narrative; portf
olio moment |
| Cart/checkout | Zero-friction
 purchase | Hosted checkout; minimal steps; t
rust signals |
| Order confirmation | Deliver
 instantly | Prominent download buttons; acco
unt-save prompt |
| Admin upload | 5-minute p
ublish | Drag-and-drop, auto-derivatives, sen
sible defaults |

---

## 10. Data Model (Hig
h Level)

Entities and key relationships (ill
ustrative, not a schema spec):

- **Category*
* � `id, slug, name, description, sort_orde
r`. MVP has one ("backgrounds") but the entit
y exists from day one (G5).
- **Subcategory**
 � `id, category_id, slug, name` (gradients
, textures, patterns, abstract, wallpapers).

- **Asset** � `id, slug, title, description
, category_id, subcategory_id, status (draft/
published/unpublished), tier (free/premium), 
price(s) per license, orientation, color_tags
, tags[], specs (dimensions, formats, file_si
ze), published_at, alt_text`.
- **AssetFile**
 � `id, asset_id, storage_key (private), va
riant_label (e.g. "5K", "mobile"), format, ch
ecksum, version`. Deliverables; never public.

- **AssetPreview** � `id, asset_id, image_
key, kind (grid, detail, mockup, og), sort_or
der`. Public, CDN-served derivatives.
- **Col
lection** � `id, slug, name, description, c
over_preview_id, featured (bool), sort_order`
; many-to-many **CollectionAsset** with posit
ion.
- **License** � `id, key (personal/com
mercial), name, version, summary, full_text, 
active`. Versioned; orders reference a specif
ic version.
- **User** � `id, email, role (
buyer/admin), created_at`. Buyers are optiona
l accounts; guest orders link by email and ca
n be claimed.
- **Order** � `id, email, use
r_id (nullable), payment_provider_ref, status
 (pending/paid/refunded), totals, tax, create
d_at`.
- **OrderItem** � `id, order_id, ass
et_id, license_id + license_version, unit_pri
ce`. This is the durable **entitlement** reco
rd.
- **DownloadToken/Event** � `id, order_
item_id (or asset_id for free), token, expire
s_at, download_count`. Powers signed delivery
, re-downloads, limits, and analytics.
- **Em
ailCapture** *(optional)* � `email, source 
(free_download/newsletter), consent, created_
at`.

**Design principles:**
- Entitlements (
OrderItems) are immutable and survive asset e
dits/unpublishing (D4).
- Category is a first
-class dimension in data and URLs so Phase 3 
categories are additive.
- All deliverable ac
cess is mediated by entitlement checks + shor
t-lived tokens; no direct storage URLs anywhe
re.

---

## 11. Monetization & Licensing Mod
el

### Revenue model (MVP)

- **One-off purc
hases** of premium assets. Suggested anchor p
ricing (final pricing is the designer's call)
:
  - Personal license: ~$6�$12 per asset
 
 - Commercial license: ~$19�$39 per asset
-
 **Free tier** as the funnel: a rotating sele
ction of free assets drives traffic, email ca
pture, social sharing, and trust in file qual
ity.
- **Bundles** (Phase 2): collection bund
les at ~30�40% off the sum of items.
- **Al
l-access pass** (Phase 3): one-time "everythi
ng" purchase or subscription � only once th
e catalog is deep enough to justify it.

### 
License tiers

| Tier | Permitted | Not permi
tted |
|---|---|---|
| **Free** | Personal us
e; commercial use with attribution (or per de
signer's preference � decide before launch)
 | Redistribution/resale of the file itself |

| **Personal** | Wallpapers, personal projec
ts, non-monetized use | Any commercial use; r
edistribution |
| **Commercial** | Client wor
k, apps/websites, marketing, monetized conten
t, print (reasonable run limits) | Reselling/
redistributing the asset as-is or in asset pa
cks/templates; trademark use |
| **Extended**
 *(Phase 2)* | Everything in Commercial + pro
ducts-for-resale where the asset is a core co
mponent, large-run print, broadcast | Redistr
ibution as a standalone asset |

**Licensing 
principles:**
- One-page, plain-language lice
nse with a "human summary" at point of sale; 
buyers should never need a lawyer for a backg
round image.
- All tiers are perpetual, non-e
xclusive, and non-transferable. Licenses vers
ioned; each order pins its version.
- Univers
al prohibition across tiers: redistributing o
r reselling the raw files (including in templ
ate/asset bundles).

---

## 12. Suggested Te
ch Stack (Recommendation)

> This is a **reco
mmendation**, not a mandate � final choices
 belong to whoever builds it. The rationale i
s optimized for a solo operator: minimal ops,
 best-in-class image handling, strong SEO, an
d high polish per hour invested.

| Layer | R
ecommendation | Rationale |
|---|---|---|
| F
ramework | **Next.js (App Router) + TypeScrip
t** | SSR/SSG for SEO-critical catalog pages,
 built-in image optimization, one codebase fo
r storefront + admin + API routes; huge ecosy
stem |
| Styling / UI | **Tailwind CSS**, opt
ionally with shadcn/ui primitives; **Framer M
otion** for motion | Fast iteration on custom
, highly polished design (this is a portfolio
 � avoid off-the-shelf themes); accessible 
primitives without visual lock-in |
| Databas
e | **Postgres** (managed: Neon or Supabase) 
+ **Prisma or Drizzle** ORM | Relational fit 
for orders/entitlements; managed = zero ops; 
typed ORM for solo maintainability |
| File s
torage | **Cloudflare R2 or AWS S3** (private
 buckets) with signed URLs | Cheap, durable, 
standard signed-URL delivery; R2 has no egres
s fees (relevant for large image files) |
| I
mage/CDN | **Vercel Image Optimization or Clo
udflare Images** for previews | On-the-fly re
sizing, AVIF/WebP, global CDN � critical fo
r an image-heavy site |
| Payments | **Stripe
 Checkout + Stripe Tax + webhooks** | Hosted,
 PCI-compliant, wallets included, automated d
igital-goods tax; webhook-driven fulfillment 
is a well-trodden path. (Alternative: **Lemon
 Squeezy/Paddle** as merchant of record � t
rades fees for fully outsourced global tax co
mpliance; seriously consider if international
 tax handling is a concern) |
| Auth | **Auth
.js (NextAuth) or Clerk** � email magic lin
ks for buyers; hardened credentials/passkey f
or admin | Passwordless matches the low-frict
ion buyer model |
| Email | **Resend or Postm
ark** with React Email templates | Reliable t
ransactional receipts/download links |
| Sear
ch/filtering | Postgres full-text + indexed f
ilters at MVP; **Typesense/Meilisearch/Algoli
a** if catalog grows | Don't add a search ser
vice before the catalog needs it |
| Analytic
s | **Plausible or Fathom** (privacy-friendly
) + Stripe dashboard | Lightweight, GDPR-frie
ndly, sufficient for KPIs |
| Hosting | **Ver
cel** | First-class Next.js support, previews
, zero-ops for a solo operator |
| Monitoring
 | **Sentry** + provider alerts | Catch fulfi
llment failures fast |

**Key architectural n
otes:**
- Fulfillment is **webhook-driven and
 idempotent**: Stripe `checkout.session.compl
eted` ? create Order/OrderItems ? email r
eceipt. Never fulfill from the client redirec
t alone.
- Admin lives in the same app behind
 role-gated routes � no separate CMS needed
 at MVP, though a headless CMS (e.g., Sanity)
 is a reasonable alternative for asset metada
ta if the designer prefers editing there.

--
-

## 13. Success Metrics / KPIs

### North s
tar
- **Revenue per month** (trend, not absol
ute target at launch) and **portfolio impact*
* (inbound opportunities attributable to Rela
y).

### Commerce funnel
- Visitor ? asset-
detail view rate
- Asset view ? (free downl
oad OR add-to-cart) rate
- Cart ? completed
 purchase conversion (target: > 60% given hos
ted checkout)
- Overall visitor ? purchase 
conversion (healthy digital-goods benchmark: 
1�3%)
- Average order value; refund rate (<
 2%)

### Engagement & discovery
- Free downl
oads per month; free-download ? later-purch
ase rate (funnel validation)
- Email captures
 and list growth
- Organic search impressions
/clicks for asset and collection pages; asset
s ranking for "{style} background" queries
- 
Return-visitor rate; social referral traffic 
(Dribbble, X, Pinterest)

### Portfolio signa
l
- Features/mentions on design galleries and
 newsletters; backlinks
- Direct inquiries (h
iring, collaboration, commissions) via the co
ntact page

### Operational (solo-friendlines
s)
- Time to publish a new asset (target: < 5
 minutes)
- Fulfillment failure rate (target:
 ~0; every failure alerts)
- Support requests
 per 100 orders (proxy for UX/licensing clari
ty)

### Quality
- Core Web Vitals pass rate;
 Lighthouse accessibility = 95 on key templ
ates

---

## 14. Milestones / Phased Roadmap


> Phases, not dates. Each phase ends with a
 shippable state and explicit validation befo
re proceeding.

### Phase 0 � Foundation & 
Design Language
- Brand, visual language, and
 high-fidelity designs for the five key templ
ates (home, browse, asset detail, collection,
 checkout/confirmation).
- Finalize license t
exts and pricing; decide Stripe vs. merchant-
of-record for tax.
- Data model and URL struc
ture locked (category-extensible).
- **Exit c
riteria:** designs approved by the designer; 
licensing/pricing/tax approach decided.

### 
Phase 1 � MVP Build & Launch
- Catalog (bro
wse/filter/search), asset detail, collections
.
- Checkout (guest), payments, webhook fulfi
llment, signed downloads, receipts, re-downlo
ad.
- Free-download flow. Admin upload/manage
. SEO, analytics, monitoring, legal pages.
- 
Seed catalog: an initial curated drop (sugges
ted: 30�60 backgrounds across subcategories
, with a meaningful free selection).
- **Exit
 criteria:** end-to-end test purchases and do
wnloads succeed (including refund + revocatio
n); Core Web Vitals green; launch announcemen
t shipped.

### Phase 2 � Growth & Polish
-
 Buyer favorites/library, discount codes, bun
dles, email drop announcements.
- Color-based
 search, related-asset improvements, in-conte
xt mockup previews expanded.
- Extended licen
se tier. Conversion-funnel instrumentation an
d iteration based on Phase 1 data.
- **Exit c
riteria:** measurable lift in conversion or r
epeat purchases; email list growing; ops stil
l < a few hours/week.

### Phase 3 � Catego
ry Expansion & Recurring Revenue
- Launch sec
ond asset category (icons or UI kits) reusing
 the category-extensible foundation; category
-specific preview treatments.
- All-access pa
ss / membership evaluation and (if catalog de
pth supports it) launch.
- License-upgrade pu
rchases; multi-currency display if warranted.

- **Exit criteria:** second category live wi
thout re-architecture; recurring-revenue deci
sion made on real data.

---

## 15. Risks & 
Open Questions

### Risks

| Risk | Likelihoo
d | Impact | Mitigation |
|---|---|---|---|
|
 **Traffic/demand risk** � beautiful store,
 no visitors | High | High | Free tier as fun
nel; SEO from day one; leverage designer's ex
isting audience (Dribbble/X/Instagram); regul
ar "drops" as marketing events |
| **File pir
acy / link sharing** | Medium | Medium | Sign
ed expiring URLs, rate limits, watermarked pr
eviews; accept that determined piracy is unpr
eventable � optimize for legitimate-buyer e
xperience, not DRM |
| **Tax/compliance compl
exity** for international digital sales | Med
ium | High | Stripe Tax, or a merchant-of-rec
ord (Lemon Squeezy/Paddle) to outsource entir
ely; decide in Phase 0 |
| **Solo-operator ba
ndwidth** � building, designing, and market
ing compete for the same hours | High | Mediu
m | Ruthless MVP scope; hosted services over 
custom infra; automate fulfillment fully; adm
in flow speed as a tracked KPI |
| **Scope cr
eep** ("portfolio polish" is unbounded) | Hig
h | Medium | Polish budget concentrated on th
e five key templates; ship, then iterate |
| 
**Catalog depth** � small catalog may feel 
thin at launch | Medium | Medium | Frame as "
curated drops," not a stock library; collecti
ons make a small catalog feel intentional |
|
 **Platform dependence** (Stripe/Vercel polic
y or pricing changes) | Low | Medium | Standa
rd patterns and portable data model; entitlem
ents owned in Relay's DB, not the payment pro
vider |
| **Licensing disputes/confusion** | 
Low | Medium | Plain-language licenses, licen
se pinned per order, receipts include terms |


### Open Questions

1. **Free-tier licensin
g:** Do free assets permit commercial use (ma
x reach) or personal-only (stronger upsell)? 
Attribution required?
2. **Merchant of record
 vs. Stripe:** Is the designer willing to han
dle tax registration thresholds, or should Re
lay pay higher fees to outsource compliance e
ntirely?
3. **Email capture on free downloads
:** Required, optional, or skipped at launch?
 (Tension between list growth and frictionles
s portfolio feel.)
4. **Watermarking previews
:** Visible watermark (deters scraping, hurts
 aesthetics) vs. resolution-limited clean pre
views (prettier, easier to scrape)?
5. **Pric
ing validation:** Anchor prices are hypothese
s � validate against comparable curated sel
lers before launch, and revisit after first-m
onth data.
6. **Personal vs. Commercial split
:** Is a two-tier model worth the checkout co
mplexity at MVP, or should MVP ship a single 
"use it for almost anything" license and add 
tiers later?
7. **Drop cadence:** What publis
hing rhythm (e.g., a new collection per drop)
 can the designer sustainably commit to? This
 drives return visits and email strategy.
8. 
**Brand relationship:** Is Relay its own bran
d, or explicitly "{Designer Name}'s shop"? Af
fects domain, About page, and long-term posit
ioning.
9. **Second category candidate:** Whi
ch Phase 3 category (icons, UI kits, illustra
tions) best fits the designer's pipeline? Pre
view/mockup needs differ significantly per ca
tegory.
10. **Analytics depth:** Is privacy-f
riendly page analytics + Stripe enough, or is
 per-asset funnel instrumentation needed from
 day one?


