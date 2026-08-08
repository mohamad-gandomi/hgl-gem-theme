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
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $is_english = is_string($path) && (trim($path, '/') === 'en' || str_starts_with(trim($path, '/'), 'en/'));
        $description = $is_english
            ? 'HGL GEM provides gemstone authenticity certificates, expert assessment, legal reporting, gemology training, and certificate verification.'
            : 'HGL GEM ارائه دهنده گواهی اصالت گوهرسنگ، کارشناسی تخصصی، گزارش حقوقی، آموزش گوهرشناسی و استعلام گزارش است.';
        ?>
        <meta name="description" content="<?php echo esc_attr($description); ?>">
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
}
