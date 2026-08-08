<?php
/**
 * WordPress rewrite routing for the React app.
 */

namespace HGL_GEM\Theme;

if (!defined('ABSPATH')) {
    exit;
}

final class AppRouting
{
    public static function addRewriteRules(): void
    {
        add_rewrite_rule('^en/?$', 'index.php?hgl_app_route=en', 'top');
        add_rewrite_rule(
            '^((en/)?licence/[^/]+/?)$',
            'index.php?hgl_app_route=$matches[1]',
            'top'
        );
        add_rewrite_rule(
            '^((en/)?(about|contact|services|blog|search)(/[^/]+)?)/?$',
            'index.php?hgl_app_route=$matches[1]',
            'top'
        );
    }

    public static function queryVars(array $vars): array
    {
        $vars[] = 'hgl_app_route';
        return $vars;
    }

    public static function templateInclude(string $template): string
    {
        if (get_query_var('hgl_app_route') || self::isAppRequest()) {
            status_header(200);
            return get_template_directory() . '/index.php';
        }

        return $template;
    }

    private static function isAppRequest(): bool
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $path = '/' . trim((string) $path, '/');

        if ($path === '/') {
            return false;
        }

        return (bool) preg_match('#^/(en/)?(about|contact|services|blog|search)(/.*)?$#', $path)
            || (bool) preg_match('#^/(en/)?licence/[^/]+/?$#', $path);
    }
}
