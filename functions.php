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
    add_image_size('hgl_post_card', 720, 540, true);
    add_image_size('hgl_post_hero', 1200, 675, true);
});

add_action('init', function () {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rest_output_link_wp_head');
    remove_action('template_redirect', 'rest_output_link_header', 11);
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
    remove_action('wp_head', 'wp_oembed_add_host_js');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'wp_print_auto_sizes_contain_css_fix');
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);
    remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');
});

add_action('wp_enqueue_scripts', function () {
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('classic-theme-styles');
    wp_dequeue_style('global-styles');
    wp_deregister_style('wp-block-library');
    wp_deregister_style('classic-theme-styles');
    wp_deregister_style('global-styles');
}, 100);

add_filter('emoji_svg_url', '__return_false');
add_filter('show_recent_comments_widget_style', '__return_false');
add_filter('wp_img_tag_add_auto_sizes', '__return_false');

add_action('init', function () {
    \HGL_GEM\Certificates\PostTypes\CertificatePostType::register();
    hgl_gem_register_contact_messages();

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

function hgl_gem_register_contact_messages(): void
{
    register_post_type('hgl_contact_message', [
        'labels' => [
            'name' => __('Contact Messages', 'hgl-gem'),
            'singular_name' => __('Contact Message', 'hgl-gem'),
            'menu_name' => __('Contact Messages', 'hgl-gem'),
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => false,
        'capability_type' => 'post',
        'supports' => ['title', 'editor'],
        'menu_icon' => 'dashicons-email',
    ]);
}

add_filter('query_vars', function (array $vars): array {
    $vars[] = 'hgl_app_route';
    return $vars;
});

add_filter('template_include', function (string $template): string {
    if (get_query_var('hgl_app_route') || hgl_gem_is_app_request()) {
        status_header(200);
        return get_template_directory() . '/index.php';
    }

    return $template;
});

function hgl_gem_is_app_request(): bool
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $path = '/' . trim((string) $path, '/');

    if ($path === '/') {
        return false;
    }

    return (bool) preg_match('#^/(en/)?(about|contact|services|blog|search)(/.*)?$#', $path)
        || (bool) preg_match('#^/(en/)?licence/[^/]+/?$#', $path);
}

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
                'default' => 8,
                'sanitize_callback' => 'absint',
                'validate_callback' => function ($value) {
                    return absint($value) <= 50;
                },
            ],
            'page' => [
                'default' => 1,
                'sanitize_callback' => 'absint',
            ],
            'search' => [
                'default' => '',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'category' => [
                'default' => '',
                'sanitize_callback' => 'sanitize_title',
            ],
            'lang' => [
                'default' => 'fa',
                'sanitize_callback' => 'sanitize_key',
            ],
        ],
    ]);

    register_rest_route('hgl/v1', '/categories', [
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => 'hgl_gem_rest_categories',
    ]);

    register_rest_route('hgl/v1', '/contact', [
        'methods' => WP_REST_Server::CREATABLE,
        'permission_callback' => '__return_true',
        'callback' => 'hgl_gem_rest_contact',
        'args' => [
            'name' => ['required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field'],
            'email' => ['required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_email'],
            'requestType' => ['required' => false, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field'],
            'message' => ['required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field'],
            'website' => ['required' => false, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field'],
        ],
    ]);
});

function hgl_gem_rest_posts(WP_REST_Request $request): WP_REST_Response
{
    $per_page = min(max(absint(hgl_gem_rest_param($request, 'per_page')), 1), 50);
    $page = max(absint(hgl_gem_rest_param($request, 'page')), 1);
    $search = sanitize_text_field(hgl_gem_rest_param($request, 'search'));
    $category = sanitize_title(hgl_gem_rest_param($request, 'category'));
    $locale = sanitize_key(hgl_gem_rest_param($request, 'lang')) === 'en' ? 'en' : 'fa';

    $query_args = [
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => $per_page,
        'paged' => $page,
        'ignore_sticky_posts' => true,
        'no_found_rows' => false,
        's' => $search,
    ];

    if ($category !== '') {
        $query_args['category_name'] = $category;
    }

    $query = new WP_Query($query_args);

    $posts = [];

    foreach ($query->posts as $post) {
        $post_id = (int) $post->ID;
        $cover_id = get_post_thumbnail_id($post_id);
        $card_image = hgl_gem_image_payload($cover_id, 'hgl_post_card');
        $hero_image = hgl_gem_image_payload($cover_id, 'hgl_post_hero');
        $categories = array_map(static function (WP_Term $term): array {
            return [
                'name' => html_entity_decode($term->name, ENT_QUOTES, get_bloginfo('charset')),
                'slug' => $term->slug,
            ];
        }, get_the_category($post_id));

        $posts[] = [
            'slug' => sanitize_title($post->post_name),
            'title' => html_entity_decode(get_the_title($post_id), ENT_QUOTES, get_bloginfo('charset')),
            'date' => hgl_gem_post_date($post_id, $locale),
            'excerpt' => hgl_gem_trim_excerpt($post_id, $locale),
            'content' => wp_kses_post(apply_filters('the_content', $post->post_content)),
            'cover' => $card_image['src'],
            'coverImage' => $card_image,
            'heroImage' => $hero_image,
            'categories' => $categories,
        ];
    }

    wp_reset_postdata();

    $response = rest_ensure_response([
        'items' => $posts,
        'total' => (int) $query->found_posts,
        'totalPages' => (int) $query->max_num_pages,
        'page' => $page,
        'perPage' => $per_page,
    ]);

    $response->header('X-WP-Total', (string) $query->found_posts);
    $response->header('X-WP-TotalPages', (string) $query->max_num_pages);

    return $response;
}

function hgl_gem_rest_param(WP_REST_Request $request, string $key): string
{
    $value = $request->get_param($key);

    return is_scalar($value) ? (string) $value : '';
}

function hgl_gem_rest_categories(): WP_REST_Response
{
    $terms = get_categories([
        'hide_empty' => true,
        'orderby' => 'name',
        'order' => 'ASC',
    ]);

    return rest_ensure_response(array_map(static function (WP_Term $term): array {
        return [
            'name' => html_entity_decode($term->name, ENT_QUOTES, get_bloginfo('charset')),
            'slug' => $term->slug,
            'count' => (int) $term->count,
        ];
    }, $terms));
}

function hgl_gem_rest_contact(WP_REST_Request $request)
{
    $nonce = (string) ($request->get_header('x_wp_nonce') ?: $request->get_header('X-WP-Nonce'));
    if (!wp_verify_nonce($nonce, 'wp_rest')) {
        return new WP_Error('hgl_contact_forbidden', __('Could not verify this request.', 'hgl-gem'), ['status' => 403]);
    }

    if ((string) $request->get_param('website') !== '') {
        return rest_ensure_response(['ok' => true]);
    }

    if (!hgl_gem_contact_rate_limit()) {
        return new WP_Error('hgl_contact_rate_limited', __('Please wait before sending another message.', 'hgl-gem'), ['status' => 429]);
    }

    $name = hgl_gem_limit_text(hgl_gem_plain_text((string) $request->get_param('name')), 100);
    $email = sanitize_email((string) $request->get_param('email'));
    $request_type = hgl_gem_limit_text(hgl_gem_plain_text((string) $request->get_param('requestType')), 120);
    $raw_message = (string) $request->get_param('message');
    $message = hgl_gem_limit_text(hgl_gem_plain_text($raw_message), 3000);

    if ($name === '' || $email === '' || $message === '') {
        return new WP_Error('hgl_contact_required', __('Please complete the required fields.', 'hgl-gem'), ['status' => 400]);
    }

    if (!is_email($email)) {
        return new WP_Error('hgl_contact_email', __('Please enter a valid email address.', 'hgl-gem'), ['status' => 400]);
    }

    if (preg_match('/https?:\/\/|www\.|<[^>]+>|\[[^\]]+\]\([^)]+\)/i', $raw_message)) {
        return new WP_Error('hgl_contact_spam', __('Your message could not be accepted.', 'hgl-gem'), ['status' => 400]);
    }

    $body = implode("\n\n", [
        'Name: ' . $name,
        'Email: ' . $email,
        'Request type: ' . $request_type,
        'Message:',
        $message,
    ]);

    $submission_id = wp_insert_post([
        'post_type' => 'hgl_contact_message',
        'post_status' => 'private',
        'post_title' => sprintf('%s - %s', $name, current_time('Y-m-d H:i')),
        'post_content' => $body,
        'meta_input' => [
            '_hgl_contact_name' => $name,
            '_hgl_contact_email' => $email,
            '_hgl_contact_request_type' => $request_type,
        ],
    ], true);

    if (is_wp_error($submission_id)) {
        return new WP_Error('hgl_contact_store_failed', __('Could not save your message. Please try again.', 'hgl-gem'), ['status' => 500]);
    }

    return rest_ensure_response(['ok' => true]);
}

function hgl_gem_contact_rate_limit(): bool
{
    $ip = hgl_gem_client_ip();
    $key = 'hgl_contact_' . md5($ip);
    $attempts = (int) get_transient($key);

    if ($attempts >= 5) {
        return false;
    }

    set_transient($key, $attempts + 1, 15 * MINUTE_IN_SECONDS);

    return true;
}

function hgl_gem_limit_text(string $value, int $length): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $length);
    }

    return substr($value, 0, $length);
}

function hgl_gem_plain_text(string $value): string
{
    $value = wp_strip_all_tags($value, true);
    $value = preg_replace('/https?:\/\/\S+|www\.\S+/i', '', $value);
    $value = preg_replace('/[^\P{C}\r\n\t]+/u', '', $value);
    $value = preg_replace('/[ \t]+/', ' ', (string) $value);
    $value = preg_replace("/\n{3,}/", "\n\n", (string) $value);

    return trim((string) $value);
}

function hgl_gem_client_ip(): string
{
    $candidates = [
        $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '',
        $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '',
        $_SERVER['REMOTE_ADDR'] ?? '',
    ];

    foreach ($candidates as $candidate) {
        $ip = trim(explode(',', (string) $candidate)[0]);
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
    }

    return 'unknown';
}

function hgl_gem_trim_excerpt(int $post_id, string $locale): string
{
    $excerpt = get_the_excerpt($post_id);
    $words = $locale === 'fa' ? 22 : 24;

    return wp_strip_all_tags(wp_trim_words($excerpt, $words, '...'));
}

function hgl_gem_image_payload(int $attachment_id, string $size): array
{
    if ($attachment_id <= 0) {
        return ['src' => '', 'srcset' => '', 'sizes' => '', 'width' => 0, 'height' => 0, 'alt' => ''];
    }

    $image = wp_get_attachment_image_src($attachment_id, $size);

    if (!$image) {
        return ['src' => '', 'srcset' => '', 'sizes' => '', 'width' => 0, 'height' => 0, 'alt' => ''];
    }

    return [
        'src' => esc_url_raw($image[0]),
        'srcset' => (string) wp_get_attachment_image_srcset($attachment_id, $size),
        'sizes' => $size === 'hgl_post_hero' ? '(min-width: 1024px) 768px, 100vw' : '(min-width: 768px) 33vw, 100vw',
        'width' => (int) $image[1],
        'height' => (int) $image[2],
        'alt' => get_post_meta($attachment_id, '_wp_attachment_image_alt', true),
    ];
}

function hgl_gem_post_date(int $post_id, string $locale): string
{
    $timestamp = (int) get_post_time('U', false, $post_id);

    if ($locale !== 'fa') {
        return esc_html(get_the_date('', $post_id));
    }

    [$jy, $jm, $jd] = hgl_gem_gregorian_to_jalali(
        (int) gmdate('Y', $timestamp),
        (int) gmdate('n', $timestamp),
        (int) gmdate('j', $timestamp)
    );

    $months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

    return hgl_gem_to_persian_digits($jd . ' ' . $months[$jm - 1] . ' ' . $jy);
}

function hgl_gem_to_persian_digits(string $value): string
{
    return strtr($value, ['0' => '۰', '1' => '۱', '2' => '۲', '3' => '۳', '4' => '۴', '5' => '۵', '6' => '۶', '7' => '۷', '8' => '۸', '9' => '۹']);
}

function hgl_gem_gregorian_to_jalali(int $gy, int $gm, int $gd): array
{
    $g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    $gy2 = $gm > 2 ? $gy + 1 : $gy;
    $days = 355666 + (365 * $gy) + intdiv($gy2 + 3, 4) - intdiv($gy2 + 99, 100) + intdiv($gy2 + 399, 400) + $gd + $g_d_m[$gm - 1];
    $jy = -1595 + (33 * intdiv($days, 12053));
    $days %= 12053;
    $jy += 4 * intdiv($days, 1461);
    $days %= 1461;

    if ($days > 365) {
        $jy += intdiv($days - 1, 365);
        $days = ($days - 1) % 365;
    }

    if ($days < 186) {
        $jm = 1 + intdiv($days, 31);
        $jd = 1 + ($days % 31);
    } else {
        $jm = 7 + intdiv($days - 186, 30);
        $jd = 1 + (($days - 186) % 30);
    }

    return [$jy, $jm, $jd];
}
