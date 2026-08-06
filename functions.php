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
add_action('add_meta_boxes_post', 'hgl_gem_register_post_language_meta_box');
add_action('save_post_post', 'hgl_gem_save_post_language_meta');
add_action('category_add_form_fields', 'hgl_gem_category_english_label_add_field');
add_action('category_edit_form_fields', 'hgl_gem_category_english_label_edit_field');
add_action('created_category', 'hgl_gem_save_category_english_label');
add_action('edited_category', 'hgl_gem_save_category_english_label');
add_filter('manage_post_posts_columns', 'hgl_gem_post_language_columns');
add_action('manage_post_posts_custom_column', 'hgl_gem_render_post_language_columns', 10, 2);
add_filter('manage_edit-category_columns', 'hgl_gem_category_english_label_columns');
add_filter('manage_category_custom_column', 'hgl_gem_render_category_english_label_column', 10, 3);
add_action('admin_enqueue_scripts', 'hgl_gem_enqueue_post_language_assets');

function hgl_gem_register_post_language_meta_box(): void
{
    add_meta_box(
        'hgl-post-language',
        __('Post Language', 'hgl-gem'),
        'hgl_gem_render_post_language_meta_box',
        'post',
        'side',
        'default'
    );
}

function hgl_gem_render_post_language_meta_box(WP_Post $post): void
{
    $language = hgl_gem_content_language((string) get_post_meta($post->ID, '_hgl_content_language', true));
    $translation_id = absint(get_post_meta($post->ID, '_hgl_translation_post_id', true));
    $translation = $translation_id > 0 ? get_post($translation_id) : null;
    $post_options = get_posts([
        'post_type' => 'post',
        'post_status' => ['publish', 'draft', 'pending', 'private', 'future'],
        'posts_per_page' => 100,
        'post__not_in' => [$post->ID],
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => true,
    ]);

    wp_nonce_field('hgl_gem_post_language', 'hgl_gem_post_language_nonce');
    ?>
    <div class="hgl-post-language-fields">
    <p>
        <label for="hgl-content-language"><strong><?php esc_html_e('Language', 'hgl-gem'); ?></strong></label>
        <select id="hgl-content-language" name="hgl_content_language" class="widefat">
            <option value="fa" <?php selected($language, 'fa'); ?>><?php esc_html_e('Persian', 'hgl-gem'); ?></option>
            <option value="en" <?php selected($language, 'en'); ?>><?php esc_html_e('English', 'hgl-gem'); ?></option>
        </select>
    </p>
    <p>
        <label for="hgl-translation-post-select"><strong><?php esc_html_e('Translation post', 'hgl-gem'); ?></strong></label>
        <input id="hgl-translation-post-id" name="hgl_translation_post_id" type="hidden" value="<?php echo esc_attr((string) $translation_id); ?>" />
        <select id="hgl-translation-post-select" class="widefat hgl-select2" data-placeholder="<?php esc_attr_e('Search by title...', 'hgl-gem'); ?>">
            <option value=""><?php esc_html_e('Choose by title...', 'hgl-gem'); ?></option>
            <?php foreach ($post_options as $option) : ?>
                <?php
                $option_language = hgl_gem_language_label((string) get_post_meta($option->ID, '_hgl_content_language', true));
                $option_title = html_entity_decode(get_the_title($option), ENT_QUOTES, get_bloginfo('charset'));
                ?>
                <option value="<?php echo esc_attr((string) $option->ID); ?>" <?php selected($translation_id, (int) $option->ID); ?>>
                    <?php echo esc_html(sprintf('#%d - %s - %s', $option->ID, $option_language, $option_title)); ?>
                </option>
            <?php endforeach; ?>
        </select>
        <span class="description"><?php esc_html_e('Search and choose the post in the other language. The reverse link is saved automatically.', 'hgl-gem'); ?></span>
        <?php if ($translation instanceof WP_Post) : ?>
            <span class="description hgl-translation-current">
                <?php
                printf(
                    esc_html__('Current: #%1$d - %2$s', 'hgl-gem'),
                    (int) $translation->ID,
                    esc_html(get_the_title($translation))
                );
                ?>
            </span>
        <?php endif; ?>
    </p>
    </div>
    <?php
}

function hgl_gem_enqueue_post_language_assets(string $hook_suffix): void
{
    if (!in_array($hook_suffix, ['post.php', 'post-new.php'], true)) {
        return;
    }

    $screen = get_current_screen();
    if (!$screen || $screen->post_type !== 'post') {
        return;
    }

    wp_enqueue_style(
        'hgl-gem-select2',
        get_template_directory_uri() . '/assets/vendor/select2/select2.min.css',
        [],
        '4.1.0-rc.0'
    );

    wp_enqueue_script(
        'hgl-gem-select2',
        get_template_directory_uri() . '/assets/vendor/select2/select2.min.js',
        ['jquery'],
        '4.1.0-rc.0',
        true
    );

    wp_enqueue_script(
        'hgl-gem-post-language-admin',
        get_template_directory_uri() . '/assets/admin/post-language.js',
        ['jquery', 'hgl-gem-select2'],
        HGL_GEM_THEME_VERSION,
        true
    );
}

function hgl_gem_save_post_language_meta(int $post_id): void
{
    if (!isset($_POST['hgl_gem_post_language_nonce']) || !wp_verify_nonce((string) $_POST['hgl_gem_post_language_nonce'], 'hgl_gem_post_language')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $language = hgl_gem_content_language(sanitize_key((string) ($_POST['hgl_content_language'] ?? 'fa')));
    $translation_id = absint($_POST['hgl_translation_post_id'] ?? 0);

    update_post_meta($post_id, '_hgl_content_language', $language);

    if ($translation_id > 0 && $translation_id !== $post_id && get_post_type($translation_id) === 'post') {
        update_post_meta($post_id, '_hgl_translation_post_id', $translation_id);
        update_post_meta($translation_id, '_hgl_translation_post_id', $post_id);
    } else {
        delete_post_meta($post_id, '_hgl_translation_post_id');
    }
}

add_action('admin_head-post.php', 'hgl_gem_post_language_admin_styles');
add_action('admin_head-post-new.php', 'hgl_gem_post_language_admin_styles');

function hgl_gem_post_language_admin_styles(): void
{
    $screen = get_current_screen();
    if (!$screen || $screen->post_type !== 'post') {
        return;
    }
    ?>
    <style>
        #hgl-post-language .inside {
            overflow: visible;
        }

        #hgl-post-language .hgl-post-language-fields,
        #hgl-post-language .hgl-post-language-fields * {
            box-sizing: border-box;
        }

        #hgl-post-language .description {
            display: block;
            margin-top: 6px;
        }

        #hgl-post-language .hgl-translation-current {
            color: #1d2327;
        }

        #hgl-post-language .select2-container {
            max-width: 100%;
            width: 100% !important;
        }

        #hgl-post-language .select2-container .select2-selection--single {
            height: 34px;
            min-height: 34px;
        }

        #hgl-post-language .select2-container .select2-selection__rendered {
            line-height: 32px;
            overflow: hidden;
            padding-right: 28px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        #hgl-post-language .select2-container .select2-selection__arrow {
            min-height: 32px;
        }

        #hgl-post-language .select2-container--default .select2-selection--single .select2-selection__clear {
            height: 32px;
            margin-right: 18px;
        }

        #hgl-post-language .select2-container--open {
            z-index: 100000;
        }
    </style>
    <?php
}

function hgl_gem_category_english_label_add_field(): void
{
    wp_nonce_field('hgl_gem_category_english_label', 'hgl_gem_category_english_label_nonce');
    ?>
    <div class="form-field term-hgl-english-label-wrap">
        <label for="hgl-category-english-label"><?php esc_html_e('English label', 'hgl-gem'); ?></label>
        <input id="hgl-category-english-label" name="hgl_category_english_label" type="text" value="" />
        <p><?php esc_html_e('Used as the category name on the English site.', 'hgl-gem'); ?></p>
    </div>
    <?php
}

function hgl_gem_category_english_label_edit_field(WP_Term $term): void
{
    $english_label = (string) get_term_meta($term->term_id, '_hgl_english_label', true);

    wp_nonce_field('hgl_gem_category_english_label', 'hgl_gem_category_english_label_nonce');
    ?>
    <tr class="form-field term-hgl-english-label-wrap">
        <th scope="row"><label for="hgl-category-english-label"><?php esc_html_e('English label', 'hgl-gem'); ?></label></th>
        <td>
            <input id="hgl-category-english-label" name="hgl_category_english_label" type="text" value="<?php echo esc_attr($english_label); ?>" class="regular-text" />
            <p class="description"><?php esc_html_e('Used as the category name on the English site. Persian uses the normal category name.', 'hgl-gem'); ?></p>
        </td>
    </tr>
    <?php
}

function hgl_gem_save_category_english_label(int $term_id): void
{
    if (!isset($_POST['hgl_gem_category_english_label_nonce']) || !wp_verify_nonce((string) $_POST['hgl_gem_category_english_label_nonce'], 'hgl_gem_category_english_label')) {
        return;
    }

    if (!current_user_can('manage_categories')) {
        return;
    }

    $english_label = hgl_gem_limit_text(sanitize_text_field((string) ($_POST['hgl_category_english_label'] ?? '')), 120);

    if ($english_label !== '') {
        update_term_meta($term_id, '_hgl_english_label', $english_label);
    } else {
        delete_term_meta($term_id, '_hgl_english_label');
    }
}

function hgl_gem_content_language(string $language): string
{
    return $language === 'en' ? 'en' : 'fa';
}

function hgl_gem_language_label(string $language): string
{
    return hgl_gem_content_language($language) === 'en' ? __('English', 'hgl-gem') : __('Persian', 'hgl-gem');
}

function hgl_gem_post_language_columns(array $columns): array
{
    $columns['hgl_language'] = __('Language', 'hgl-gem');
    $columns['hgl_translation'] = __('Translation', 'hgl-gem');

    return $columns;
}

function hgl_gem_render_post_language_columns(string $column, int $post_id): void
{
    if ($column === 'hgl_language') {
        echo esc_html(hgl_gem_language_label((string) get_post_meta($post_id, '_hgl_content_language', true)));
    }

    if ($column === 'hgl_translation') {
        $translation_id = absint(get_post_meta($post_id, '_hgl_translation_post_id', true));
        echo $translation_id > 0 ? esc_html((string) $translation_id) : '&mdash;';
    }
}

function hgl_gem_category_english_label_columns(array $columns): array
{
    $columns['hgl_english_label'] = __('English label', 'hgl-gem');

    return $columns;
}

function hgl_gem_render_category_english_label_column(string $content, string $column, int $term_id): string
{
    if ($column === 'hgl_english_label') {
        $english_label = (string) get_term_meta($term_id, '_hgl_english_label', true);
        return $english_label !== '' ? esc_html($english_label) : '&mdash;';
    }

    return $content;
}

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

    register_rest_route('hgl/v1', '/posts/(?P<slug>[^/]+)', [
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => 'hgl_gem_rest_post',
        'args' => [
            'slug' => [
                'required' => true,
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
        'args' => [
            'lang' => [
                'default' => 'fa',
                'sanitize_callback' => 'sanitize_key',
            ],
        ],
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
        'meta_query' => hgl_gem_language_meta_query($locale),
    ];

    if ($category !== '') {
        $query_args['category_name'] = $category;
    }

    $query = new WP_Query($query_args);

    $posts = array_map(static function (WP_Post $post) use ($locale): array {
        return hgl_gem_post_payload($post, $locale);
    }, $query->posts);

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

function hgl_gem_rest_post(WP_REST_Request $request)
{
    $slug = sanitize_title(hgl_gem_rest_param($request, 'slug'));
    $locale = sanitize_key(hgl_gem_rest_param($request, 'lang')) === 'en' ? 'en' : 'fa';

    if ($slug === '') {
        return new WP_Error('hgl_post_not_found', __('Post not found.', 'hgl-gem'), ['status' => 404]);
    }

    $query = new WP_Query([
        'post_type' => 'post',
        'post_status' => 'publish',
        'name' => $slug,
        'posts_per_page' => 1,
        'no_found_rows' => true,
        'ignore_sticky_posts' => true,
        'meta_query' => hgl_gem_language_meta_query($locale),
    ]);

    if (!$query->have_posts()) {
        return new WP_Error('hgl_post_not_found', __('Post not found.', 'hgl-gem'), ['status' => 404]);
    }

    $post = $query->posts[0];
    wp_reset_postdata();

    return rest_ensure_response(hgl_gem_post_payload($post, $locale));
}

function hgl_gem_post_payload(WP_Post $post, string $locale): array
{
    $post_id = (int) $post->ID;
    $cover_id = get_post_thumbnail_id($post_id);
    $card_image = hgl_gem_image_payload($cover_id, 'hgl_post_card');
    $hero_image = hgl_gem_image_payload($cover_id, 'hgl_post_hero');
    $categories = array_map(static function (WP_Term $term) use ($locale): array {
        return hgl_gem_category_payload($term, $locale);
    }, get_the_category($post_id));
    $language = hgl_gem_content_language((string) get_post_meta($post_id, '_hgl_content_language', true));
    $translation_id = absint(get_post_meta($post_id, '_hgl_translation_post_id', true));
    $translation = hgl_gem_translation_payload($translation_id);

    return [
        'id' => $post_id,
        'slug' => sanitize_title($post->post_name),
        'title' => html_entity_decode(get_the_title($post_id), ENT_QUOTES, get_bloginfo('charset')),
        'date' => hgl_gem_post_date($post_id, $locale),
        'excerpt' => hgl_gem_trim_excerpt($post_id, $locale),
        'content' => wp_kses_post(apply_filters('the_content', $post->post_content)),
        'cover' => $card_image['src'],
        'coverImage' => $card_image,
        'heroImage' => $hero_image,
        'categories' => $categories,
        'language' => $language,
        'translationId' => $translation_id,
        'translation' => $translation,
    ];
}

function hgl_gem_translation_payload(int $translation_id): ?array
{
    if ($translation_id <= 0 || get_post_type($translation_id) !== 'post' || get_post_status($translation_id) !== 'publish') {
        return null;
    }

    $language = hgl_gem_content_language((string) get_post_meta($translation_id, '_hgl_content_language', true));
    $slug = get_post_field('post_name', $translation_id);

    if (!$slug) {
        return null;
    }

    return [
        'id' => $translation_id,
        'slug' => sanitize_title($slug),
        'language' => $language,
    ];
}

function hgl_gem_rest_param(WP_REST_Request $request, string $key): string
{
    $value = $request->get_param($key);

    return is_scalar($value) ? (string) $value : '';
}

function hgl_gem_language_meta_query(string $locale): array
{
    if ($locale === 'en') {
        return [
            [
                'key' => '_hgl_content_language',
                'value' => 'en',
                'compare' => '=',
            ],
        ];
    }

    return [
        'relation' => 'OR',
        [
            'key' => '_hgl_content_language',
            'compare' => 'NOT EXISTS',
        ],
        [
            'key' => '_hgl_content_language',
            'value' => 'en',
            'compare' => '!=',
        ],
    ];
}

function hgl_gem_rest_categories(WP_REST_Request $request): WP_REST_Response
{
    $locale = sanitize_key(hgl_gem_rest_param($request, 'lang')) === 'en' ? 'en' : 'fa';
    $post_ids = get_posts([
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'fields' => 'ids',
        'no_found_rows' => true,
        'meta_query' => hgl_gem_language_meta_query($locale),
    ]);

    if (!$post_ids) {
        return rest_ensure_response([]);
    }

    $terms = get_terms([
        'taxonomy' => 'category',
        'hide_empty' => true,
        'orderby' => 'name',
        'order' => 'ASC',
        'object_ids' => $post_ids,
    ]);

    if (is_wp_error($terms)) {
        return rest_ensure_response([]);
    }

    return rest_ensure_response(array_map(static function (WP_Term $term) use ($locale): array {
        return hgl_gem_category_payload($term, $locale);
    }, $terms));
}

function hgl_gem_category_payload(WP_Term $term, string $locale): array
{
    $name = html_entity_decode($term->name, ENT_QUOTES, get_bloginfo('charset'));
    $english_label = trim((string) get_term_meta($term->term_id, '_hgl_english_label', true));

    return [
        'name' => $locale === 'en' && $english_label !== '' ? $english_label : $name,
        'persianName' => $name,
        'englishName' => $english_label,
        'slug' => $term->slug,
        'count' => (int) $term->count,
    ];
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
