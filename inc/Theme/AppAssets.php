<?php
/**
 * Vite asset loading for the React app.
 */

namespace HGL_GEM\Theme;

if (!defined('ABSPATH')) {
    exit;
}

final class AppAssets
{
    public static function printHeadTags(): void
    {
        $meta = self::routeMeta();
        $is_english = $meta['locale'] === 'en';
        $canonical = self::routeUrl($meta['route'], $meta['locale']);
        $alternate_locale = $is_english ? 'fa' : 'en';
        $alternate = self::routeUrl($meta['route'], $alternate_locale);
        $image = HGL_GEM_DIST_URI . '/assets/img/hero-image-768.webp';
        ?>
        <meta name="description" content="<?php echo esc_attr($meta['description']); ?>">
        <?php if ($meta['robots']) : ?>
            <meta name="robots" content="<?php echo esc_attr($meta['robots']); ?>">
        <?php endif; ?>
        <link rel="canonical" href="<?php echo esc_url($canonical); ?>">
        <link rel="alternate" hreflang="<?php echo $is_english ? 'en' : 'fa'; ?>" href="<?php echo esc_url($canonical); ?>">
        <link rel="alternate" hreflang="<?php echo $is_english ? 'fa' : 'en'; ?>" href="<?php echo esc_url($alternate); ?>">
        <link rel="alternate" hreflang="x-default" href="<?php echo esc_url(self::routeUrl($meta['route'], 'fa')); ?>">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="HGL GEM">
        <meta property="og:title" content="<?php echo esc_attr($meta['title']); ?>">
        <meta property="og:description" content="<?php echo esc_attr($meta['description']); ?>">
        <meta property="og:url" content="<?php echo esc_url($canonical); ?>">
        <meta property="og:image" content="<?php echo esc_url($image); ?>">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="<?php echo esc_attr($meta['title']); ?>">
        <meta name="twitter:description" content="<?php echo esc_attr($meta['description']); ?>">
        <meta name="twitter:image" content="<?php echo esc_url($image); ?>">
        <script type="application/ld+json"><?php echo wp_json_encode(self::structuredData(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?></script>
        <link
            rel="preload"
            as="image"
            href="<?php echo esc_url(HGL_GEM_DIST_URI . '/assets/img/hero-image-640.webp'); ?>"
            imagesrcset="<?php echo esc_attr(HGL_GEM_DIST_URI . '/assets/img/hero-image-640.webp 640w, ' . HGL_GEM_DIST_URI . '/assets/img/hero-image-768.webp 768w'); ?>"
            imagesizes="(min-width: 1024px) 576px, calc(100vw - 32px)"
            fetchpriority="high"
        >
        <?php if (!$is_english) : ?>
            <link rel="preload" as="font" type="font/ttf" href="<?php echo esc_url(HGL_GEM_DIST_URI . '/assets/Ravi-VF-xTtXQV-q.ttf'); ?>" crossorigin>
        <?php endif; ?>
        <?php
    }

    public static function documentTitleParts(array $parts): array
    {
        if (is_admin()) {
            return $parts;
        }

        $meta = self::routeMeta();
        $parts['title'] = $meta['title'];
        unset($parts['tagline']);

        return $parts;
    }

    public static function maybePrintSitemap(): void
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

        if (!is_string($path) || trim($path, '/') !== 'hgl-sitemap.xml') {
            return;
        }

        $routes = ['', 'about', 'services', 'contact', 'blog'];
        $urls = [];

        foreach ($routes as $route) {
            $urls[] = self::routeUrl($route, 'fa');
            $urls[] = self::routeUrl($route, 'en');
        }

        status_header(200);
        header('Content-Type: application/xml; charset=UTF-8');

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            echo "  <url>\n";
            echo '    <loc>' . esc_url($url) . "</loc>\n";
            echo "    <changefreq>weekly</changefreq>\n";
            echo "  </url>\n";
        }

        echo "</urlset>\n";
        exit;
    }

    public static function robotsTxt(string $output, bool $public): string
    {
        if (!$public) {
            return $output;
        }

        return rtrim($output) . "\nSitemap: " . home_url('/hgl-sitemap.xml') . "\n";
    }

    public static function languageAttributes(string $output): string
    {
        if (is_admin()) {
            return $output;
        }

        return self::isEnglishRequest() ? 'lang="en-US" dir="ltr"' : 'lang="fa-IR" dir="rtl"';
    }

    public static function enqueue(): void
    {
        $manifest = self::manifest();
        $entry = $manifest['index.html'] ?? null;

        if (!$entry || empty($entry['file'])) {
            return;
        }

        if (!empty($entry['css']) && is_array($entry['css'])) {
            foreach ($entry['css'] as $index => $css_file) {
                wp_enqueue_style(
                    'hgl-gem-app-' . $index,
                    self::assetUri((string) $css_file),
                    [],
                    HGL_GEM_THEME_VERSION
                );
            }
        }

        wp_enqueue_script(
            'hgl-gem-app',
            self::assetUri((string) $entry['file']),
            [],
            HGL_GEM_THEME_VERSION,
            true
        );

        wp_script_add_data('hgl-gem-app', 'type', 'module');
        wp_localize_script('hgl-gem-app', 'HGL_WP', [
            'restUrl' => esc_url_raw(rest_url('hgl/v1/')),
            'assetBase' => esc_url_raw(HGL_GEM_DIST_URI),
            'nonce' => wp_create_nonce('wp_rest'),
        ]);
    }

    public static function moduleScriptTag(string $tag, string $handle, string $src): string
    {
        if ($handle !== 'hgl-gem-app') {
            return $tag;
        }

        return sprintf(
            '<script type="module" src="%s" id="%s-js"></script>',
            esc_url($src),
            esc_attr($handle)
        );
    }

    private static function manifest(): array
    {
        static $manifest = null;

        if ($manifest !== null) {
            return $manifest;
        }

        $path = HGL_GEM_DIST_PATH . '/.vite/manifest.json';
        if (!file_exists($path)) {
            $manifest = [];
            return $manifest;
        }

        $contents = file_get_contents($path);
        $decoded = json_decode($contents ?: '', true);
        $manifest = is_array($decoded) ? $decoded : [];

        return $manifest;
    }

    private static function assetUri(string $path): string
    {
        return HGL_GEM_DIST_URI . '/' . ltrim($path, '/');
    }

    private static function isEnglishRequest(): bool
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $trimmed = is_string($path) ? trim($path, '/') : '';

        return $trimmed === 'en' || str_starts_with($trimmed, 'en/');
    }

    private static function routeMeta(): array
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $trimmed = is_string($path) ? trim($path, '/') : '';
        $locale = ($trimmed === 'en' || str_starts_with($trimmed, 'en/')) ? 'en' : 'fa';
        $route = $locale === 'en' ? preg_replace('#^en/?#', '', $trimmed) : $trimmed;
        $route = trim((string) $route, '/');
        $route = $route === '' ? 'home' : $route;
        $route_key = preg_replace('#/.*$#', '', $route);

        if (str_starts_with($route, 'licence/')) {
            $route_key = 'licence';
        }

        $defaults = [
            'fa' => [
                'title' => 'صدور گواهی اصالت گوهرسنگ',
                'description' => 'صدور گواهی اصالت، کارشناسی رسمی، خدمات حقوقی، آموزش گوهرشناسی و مشاوره تخصصی سنگ های قیمتی.',
            ],
            'en' => [
                'title' => 'Gemstone Certification',
                'description' => 'Gemstone authenticity certificates, expert assessment, legal reporting, gemology training, and specialist consultation.',
            ],
        ];

        $pages = [
            'home' => [
                'fa' => ['title' => 'صدور گواهی اصالت گوهرسنگ', 'description' => 'صدور گواهی اصالت و گزارش تخصصی برای سنگ های قیمتی همراه با امکان پیگیری و استعلام آنلاین.'],
                'en' => ['title' => 'Gemstone Authenticity Certificates', 'description' => 'Specialist gemstone authenticity certificates and identification reports with online verification.'],
            ],
            'about' => [
                'fa' => ['title' => 'درباره مجموعه', 'description' => 'بیش از ۲۰ سال تجربه در کارشناسی، صدور گواهی اصالت و آموزش گوهرشناسی.'],
                'en' => ['title' => 'About the Laboratory', 'description' => 'More than 20 years of experience in gemstone assessment, certification, and gemology education.'],
            ],
            'services' => [
                'fa' => ['title' => 'خدمات تخصصی گوهرسنگ', 'description' => 'کارشناسی و ارزیابی گوهرسنگ، خدمات حقوقی، دوره های آموزش گوهرشناسی و مشاوره تخصصی.'],
                'en' => ['title' => 'Gemstone Services', 'description' => 'Gemstone assessment, legal reporting, gemology training, and specialist consultation services.'],
            ],
            'contact' => [
                'fa' => ['title' => 'تماس با ما', 'description' => 'برای درخواست صدور گواهی، کارشناسی رسمی، آموزش یا مشاوره تخصصی گوهرسنگ با ما تماس بگیرید.'],
                'en' => ['title' => 'Contact Us', 'description' => 'Request gemstone certification, expert assessment, training information, or specialist consultation.'],
            ],
            'blog' => [
                'fa' => ['title' => 'دانش و اخبار گوهرسنگ', 'description' => 'مقاله های آموزشی، اخبار گواهی اصالت و نکات کاربردی خرید، فروش و ارزیابی سنگ های قیمتی.'],
                'en' => ['title' => 'Gemstone Knowledge and News', 'description' => 'Gemology articles, certification notes, and practical guidance for gemstone buying and evaluation.'],
            ],
            'search' => [
                'fa' => ['title' => 'جستجو در سایت', 'description' => 'جستجو در گواهی ها، خدمات تخصصی، دوره های آموزشی و مطالب گوهرشناسی.', 'robots' => 'noindex,follow'],
                'en' => ['title' => 'Search the Site', 'description' => 'Search certificates, expert services, training courses, and gemstone education content.', 'robots' => 'noindex,follow'],
            ],
            'licence' => [
                'fa' => ['title' => 'استعلام گزارش گوهرسنگ', 'description' => 'کد شناسنامه درج شده روی گزارش را وارد کنید و فایل گزارش گوهرسنگ را از مسیر امن مشاهده کنید.'],
                'en' => ['title' => 'Verify Gemstone Report', 'description' => 'Enter the report code printed on the certificate to access the protected gemstone report.'],
            ],
        ];

        $meta = $pages[$route_key][$locale] ?? $defaults[$locale];
        $meta['locale'] = $locale;
        $meta['route'] = $route === 'home' ? '' : $route;
        $meta['robots'] = $meta['robots'] ?? '';

        return $meta;
    }

    private static function routeUrl(string $route, string $locale): string
    {
        $route = trim($route, '/');

        if ($locale === 'en') {
            return home_url($route === '' ? '/en/' : '/en/' . $route . '/');
        }

        return home_url($route === '' ? '/' : '/' . $route . '/');
    }

    private static function structuredData(): array
    {
        $logo = HGL_GEM_DIST_URI . '/assets/img/hgl-logo-new.webp';

        return [
            '@context' => 'https://schema.org',
            '@type' => ['LocalBusiness', 'ProfessionalService'],
            '@id' => home_url('/#organization'),
            'name' => 'HGL GEM',
            'alternateName' => 'Hope Gemological Laboratory',
            'url' => home_url('/'),
            'logo' => $logo,
            'image' => $logo,
            'telephone' => ['+985138114416', '+989153588482', '+989303588021'],
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => 'Imam Khomeini Street, Darayi three-way, Sabt Alley, Marmar International Gold and Jewellery Tower, 7th floor, Unit 9',
                'addressLocality' => 'Mashhad',
                'addressCountry' => 'IR',
            ],
            'areaServed' => ['IR'],
            'knowsAbout' => [
                'Gemstone certification',
                'Gemology',
                'Gemstone appraisal',
                'Jewellery reports',
            ],
        ];
    }
}
