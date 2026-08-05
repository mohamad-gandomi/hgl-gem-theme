<?php
/**
 * HGL GEM theme bootstrap.
 *
 * Static site content lives in the React app. WordPress is used for blog post
 * management through a small read-only REST endpoint.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('HGL_GEM_THEME_VERSION', '1.0.0');
define('HGL_GEM_DIST_PATH', get_template_directory() . '/dist');
define('HGL_GEM_DIST_URI', get_template_directory_uri() . '/dist');

require_once get_template_directory() . '/inc/Certificates/PostTypes/CertificatePostType.php';
require_once get_template_directory() . '/inc/Certificates/Security/CertificateCode.php';
require_once get_template_directory() . '/inc/Certificates/Security/CertificateRateLimiter.php';
require_once get_template_directory() . '/inc/Certificates/Security/CertificateDownloadToken.php';
require_once get_template_directory() . '/inc/Certificates/Security/CertificateVerifier.php';
require_once get_template_directory() . '/inc/Certificates/Support/CertificatePdfFile.php';
require_once get_template_directory() . '/inc/Certificates/Admin/CertificateMetaBox.php';
require_once get_template_directory() . '/inc/Certificates/Rest/CertificateRestController.php';
require_once get_template_directory() . '/inc/Certificates/Uploads/PdfUploadRenamer.php';

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['script', 'style']);
});

add_action('init', function () {
    \HGL_GEM\Certificates\PostTypes\CertificatePostType::register();

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
});

add_filter('query_vars', function (array $vars): array {
    $vars[] = 'hgl_app_route';
    return $vars;
});

add_filter('template_include', function (string $template): string {
    if (get_query_var('hgl_app_route')) {
        status_header(200);
        return get_template_directory() . '/index.php';
    }

    return $template;
});

add_action('after_switch_theme', function () {
    flush_rewrite_rules();
});

add_action('add_meta_boxes', [\HGL_GEM\Certificates\Admin\CertificateMetaBox::class, 'register']);
add_action('save_post_' . \HGL_GEM\Certificates\PostTypes\CertificatePostType::POST_TYPE, [\HGL_GEM\Certificates\Admin\CertificateMetaBox::class, 'save']);
add_action('admin_enqueue_scripts', [\HGL_GEM\Certificates\Admin\CertificateMetaBox::class, 'enqueueAssets']);
add_filter('wp_handle_upload_prefilter', [\HGL_GEM\Certificates\Uploads\PdfUploadRenamer::class, 'rename']);

function hgl_gem_manifest(): array
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

function hgl_gem_asset_uri(string $path): string
{
    return HGL_GEM_DIST_URI . '/' . ltrim($path, '/');
}

add_action('wp_enqueue_scripts', function () {
    $manifest = hgl_gem_manifest();
    $entry = $manifest['index.html'] ?? null;

    if (!$entry || empty($entry['file'])) {
        return;
    }

    if (!empty($entry['css']) && is_array($entry['css'])) {
        foreach ($entry['css'] as $index => $css_file) {
            wp_enqueue_style(
                'hgl-gem-app-' . $index,
                hgl_gem_asset_uri($css_file),
                [],
                HGL_GEM_THEME_VERSION
            );
        }
    }

    wp_enqueue_script(
        'hgl-gem-app',
        hgl_gem_asset_uri($entry['file']),
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
});

add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ($handle !== 'hgl-gem-app') {
        return $tag;
    }

    return sprintf(
        '<script type="module" src="%s" id="%s-js"></script>',
        esc_url($src),
        esc_attr($handle)
    );
}, 10, 3);

add_action('rest_api_init', function () {
    \HGL_GEM\Certificates\Rest\CertificateRestController::registerRoutes();

    register_rest_route('hgl/v1', '/posts', [
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => 'hgl_gem_rest_posts',
        'args' => [
            'per_page' => [
                'default' => 12,
                'sanitize_callback' => 'absint',
                'validate_callback' => function ($value) {
                    return absint($value) <= 50;
                },
            ],
        ],
    ]);
});

function hgl_gem_rest_posts(WP_REST_Request $request): WP_REST_Response
{
    $per_page = min(max(absint($request->get_param('per_page')), 1), 50);

    $query = new WP_Query([
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => $per_page,
        'ignore_sticky_posts' => true,
        'no_found_rows' => true,
    ]);

    $posts = [];

    foreach ($query->posts as $post) {
        $post_id = (int) $post->ID;
        $cover = get_the_post_thumbnail_url($post_id, 'large');

        $posts[] = [
            'slug' => sanitize_title($post->post_name),
            'title' => html_entity_decode(get_the_title($post_id), ENT_QUOTES, get_bloginfo('charset')),
            'date' => esc_html(get_the_date('', $post_id)),
            'excerpt' => wp_strip_all_tags(get_the_excerpt($post_id)),
            'content' => wp_kses_post(apply_filters('the_content', $post->post_content)),
            'cover' => $cover ? esc_url_raw($cover) : '',
        ];
    }

    wp_reset_postdata();

    return rest_ensure_response($posts);
}
