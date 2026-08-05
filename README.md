# HGL GEM WordPress Theme

Fast React/Tailwind WordPress theme for HGL GEM.

The site pages and business content are static in React. WordPress admin is used for blog posts through a read-only REST route:

`/wp-json/hgl/v1/posts`

The theme also includes a secure certificate verification backend:

- Admins create certificate records from the `Certificates` menu.
- Each certificate stores a hashed code and a protected PDF.
- The public React modal posts to `/wp-json/hgl/v1/certificates/verify`.
- Verified requests receive a one-use PDF download URL that expires after 5 minutes.
- Legacy printed QR links like `/licence/2026-1572/` open a certificate verification page when the certificate post slug is `2026-1572`.
- The Certificate admin screen shows a local QR code for `/licence/{slug}/` and includes a PNG download button for placing the QR on PDFs.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The WordPress theme loads files from `dist/.vite/manifest.json`, so run the build before activating or uploading the theme.

## Upload-Ready Zip

```bash
npm run theme:zip
```

This creates:

`theme-package/hgl-gem.zip`

Upload that zip in WordPress admin:

Appearance -> Themes -> Add New -> Upload Theme

## Theme Install

Upload this folder as a theme, or copy it to:

`wp-content/themes/hgl-gem`

Required files for production:

- `dist/`
- `functions.php`
- `inc/`
- `assets/admin/`
- `style.css`
- `index.php`
- template fallback files

Create and publish normal WordPress Posts in the admin. They will appear on the Blog, Latest News, footer post links, and single blog routes.

Create and publish Certificate records in the admin for certificate verification. Upload PDFs through the certificate editor so the theme can validate and protect the file path.

For old printed QR codes, keep each imported certificate slug exactly the same as the old URL segment. Example:

`https://hgl-gem.com/licence/2026-1572/`

requires a published Certificate record with slug:

`2026-1572`

The QR page no longer redirects directly to the raw uploaded PDF. It asks for the certificate code, then opens the PDF through a temporary protected download URL.

Each saved Certificate edit screen includes a QR preview and download button. If the QR is not visible yet, save the Certificate first so WordPress creates the final slug.

The QR field uses a relative URL such as:

`/licence/2026-1572/`

This avoids localhost/domain problems while moving between development and production. For printed QR codes, generate/download the final QR after the production domain is configured if your scanner or print workflow requires a full absolute URL.

## Protect Direct PDF URLs

WordPress/PHP cannot block direct browser access to a PDF already served by the web server at a URL like:

`/wp-content/uploads/2026/08/example.pdf`

To make certificate PDFs private, block direct PDF access in the web server while still letting PHP read the files through the protected REST download endpoint.

Apache `.htaccess` option inside `wp-content/uploads/`:

```apache
<FilesMatch "\.pdf$">
  Require all denied
</FilesMatch>
```

Nginx option:

```nginx
location ~* ^/wp-content/uploads/.*\.pdf$ {
  deny all;
}
```

Use this only if uploaded PDFs are meant to be private. If the site has other public PDFs, move certificate PDFs into a dedicated protected uploads folder and deny that folder only.
