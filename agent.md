# HGL GEM Project Guide

This repository is a WordPress theme for HGL GEM. It uses WordPress for theme bootstrapping, blog content, contact-message storage, certificate records, and REST endpoints. The public site UI is a Vite React app styled with Tailwind CSS and loaded by WordPress from `dist/.vite/manifest.json`.

## Stack

- WordPress theme, PHP 8.0+.
- React 19 frontend built with Vite.
- Tailwind CSS for styling.
- Lucide React icons imported as direct ESM icon modules.
- WordPress REST API namespace: `hgl/v1`.
- Admin-only JavaScript in `assets/admin/`.

## Important Commands

```bash
npm install
npm run dev
npm run build
npm run theme:zip
```

`npm run build` must pass before production packaging. `npm run theme:zip` runs the build, stages the theme, and writes `theme-package/hb-hgl-gem.zip`.

## Theme Bootstrap

- `functions.php` is the bootstrap and hook map. Keep business logic in focused classes under `inc/`.
- `index.php` renders only the WordPress shell and `#root`; React owns the public UI.
- `front-page.php`, `page.php`, `single.php`, `archive.php`, and `404.php` all require `index.php`.
- React assets are read from `dist/.vite/manifest.json` by `HGL_GEM\Theme\AppAssets` and enqueued as a module script.
- `HGL_WP` is localized into the frontend with `restUrl`, `assetBase`, and a REST nonce.

## Routing

WordPress rewrite rules in `functions.php` send app routes to `index.php`:

- `/`
- `/en`
- `/about`, `/contact`, `/services`, `/blog`, `/search`
- English equivalents under `/en/...`
- `/licence/{slug}/` and `/en/licence/{slug}/`

Frontend routing is custom and lightweight:

- `src/hooks/useRoute.js` tracks `window.location` and uses `history.pushState`.
- `src/utils/routing.js` normalizes locale and route paths.
- `src/App.jsx` chooses the page component from `routePath`.

PHP structure:

- `inc/Theme/`: WordPress setup, output cleanup, React asset loading, app rewrites.
- `inc/Blog/`: blog language metadata, admin translation/category fields, public blog REST endpoints.
- `inc/Contact/`: contact-message post type and contact REST endpoint.
- `inc/Certificates/`: certificate post type, admin fields, upload handling, verification, download tokens, REST endpoints.
- `inc/Support/`: small shared helpers.

## Frontend Map

- `src/main.jsx`: React root.
- `src/App.jsx`: app composition, locale, modals, route selection.
- `src/data/siteContent.js`: static bilingual content and contact data.
- `src/layout/Header.jsx` and `src/layout/Footer.jsx`: global chrome.
- `src/pages/*`: route-level screens.
- `src/sections/*`: home page sections.
- `src/components/*`: shared UI pieces.
- `src/hooks/useWordPressPosts.js`: fetches posts, single posts, and categories from custom REST routes.
- `src/styles.css`: Tailwind entry plus global component styles and typography.

Most user-visible strings live in `src/data/siteContent.js`. Keep Persian and English copies in sync when changing navigation, forms, services, pages, or fallback content.

## Blog Content

WordPress posts are exposed through custom read-only REST endpoints:

- `GET /wp-json/hgl/v1/posts`
- `GET /wp-json/hgl/v1/posts/{slug}`
- `GET /wp-json/hgl/v1/categories`

Posts support a custom `_hgl_content_language` meta value of `fa` or `en`, plus `_hgl_translation_post_id` for cross-language blog switching. The admin UI for these fields is implemented in `inc/Blog/Admin/PostLanguageMetaBox.php` and enhanced by `assets/admin/post-language.js`.

Single post HTML is sanitized server-side with `wp_kses_post(apply_filters('the_content', ...))` before React renders it with `dangerouslySetInnerHTML`.

## Contact Flow

The public contact form posts to:

- `POST /wp-json/hgl/v1/contact`

Server behavior:

- Requires the localized REST nonce.
- Uses a hidden `website` honeypot.
- Limits by `REMOTE_ADDR`; do not trust forwarded IP headers unless the server is explicitly configured for trusted proxies.
- Strips tags and URLs from submitted text.
- Stores messages as private `hgl_contact_message` posts.

## Certificate Flow

Certificate code is implemented under `inc/Certificates/`.

- `PostTypes/CertificatePostType.php`: registers private admin-visible `hgl_certificate` records.
- `Admin/CertificateMetaBox.php`: certificate code/PDF fields and QR preview.
- `Uploads/PdfUploadRenamer.php`: renames uploaded PDFs to opaque random filenames.
- `Support/CertificatePdfFile.php`: validates stored PDF paths and resolves readable upload files.
- `Security/CertificateCode.php`: normalizes codes, stores a password hash, and creates a lookup HMAC.
- `Security/CertificateVerifier.php`: finds certificate records by slug or lookup hash and verifies the submitted code.
- `Security/CertificateRateLimiter.php`: limits failed verification attempts by code and `REMOTE_ADDR`.
- `Security/CertificateDownloadToken.php`: issues one-use 5-minute download tokens.
- `Rest/CertificateRestController.php`: verify and download REST endpoints.

Public endpoints:

- `POST /wp-json/hgl/v1/certificates/verify`
- `GET /wp-json/hgl/v1/certificates/{id}/download?token=...`

Admin QR codes currently use `home_url('/licence/{slug}/')`, so generate final printed QR images only after the production domain is configured.

Important deployment note: PHP protects the REST download path, but it cannot stop the web server from serving direct URLs under `wp-content/uploads`. If certificate PDFs are private, configure Apache/Nginx to deny direct PDF access or move certificate PDFs to a dedicated protected folder.

## Packaging

There are two packaging scripts:

- `scripts/package-theme.sh`: used by `npm run theme:zip`.
- `scripts/package-theme.ps1`: older PowerShell equivalent.

The package includes the built `dist/`, PHP theme files, `inc/`, `assets/`, and `README.md`.

The root `.htaccess` is part of the theme package and sets long-lived cache headers for static assets on Apache hosts. Nginx/CDN deployments need equivalent cache rules outside the theme.

## Security Notes For Future Work

- Do not expose raw certificate PDF URLs as the primary access path.
- Keep certificate download tokens short-lived and one-use.
- Treat certificate codes as secrets; avoid logging them or exposing them beyond the admin UI.
- Keep public REST routes read-only unless a route explicitly validates a nonce, capability, and rate limit.
- If changing post rendering, preserve server-side `wp_kses_post` or replace it with an equal or stricter sanitizer.
- If changing contact or certificate rate limiting, be careful with proxy headers. Only trust forwarded IP headers when the server is actually behind a trusted proxy that strips user-supplied values.
- Keep build output generated by `npm run build`; do not hand-edit `dist/`.
