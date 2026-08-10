<?php
/**
 * HGL GEM theme bootstrap.
 *
 * Static site content lives in the React app. WordPress manages blog content,
 * contact messages, and certificate verification through focused PHP modules.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('HGL_GEM_THEME_VERSION', '1.0.0');
define('HGL_GEM_DIST_PATH', get_template_directory() . '/dist');
define('HGL_GEM_DIST_URI', get_template_directory_uri() . '/dist');

require_once get_template_directory() . '/inc/Support/Text.php';
require_once get_template_directory() . '/inc/Support/ClientIp.php';

require_once get_template_directory() . '/inc/Theme/ThemeSetup.php';
require_once get_template_directory() . '/inc/Theme/AppRouting.php';
require_once get_template_directory() . '/inc/Theme/AppAssets.php';

require_once get_template_directory() . '/inc/Blog/BlogLanguage.php';
require_once get_template_directory() . '/inc/Blog/Admin/PostLanguageMetaBox.php';
require_once get_template_directory() . '/inc/Blog/Admin/CategoryEnglishLabel.php';
require_once get_template_directory() . '/inc/Blog/Rest/BlogRestController.php';

require_once get_template_directory() . '/inc/Contact/ContactMessages.php';

require_once get_template_directory() . '/inc/Certificates/PostTypes/CertificatePostType.php';
require_once get_template_directory() . '/inc/Certificates/Security/CertificateCode.php';
require_once get_template_directory() . '/inc/Certificates/Security/CertificateRateLimiter.php';
require_once get_template_directory() . '/inc/Certificates/Security/CertificateDownloadToken.php';
require_once get_template_directory() . '/inc/Certificates/Security/CertificateVerifier.php';
require_once get_template_directory() . '/inc/Certificates/Support/CertificatePdfFile.php';
require_once get_template_directory() . '/inc/Certificates/Admin/CertificateMetaBox.php';
require_once get_template_directory() . '/inc/Certificates/Rest/CertificateRestController.php';
require_once get_template_directory() . '/inc/Certificates/Uploads/PdfUploadRenamer.php';

add_action('after_setup_theme', [\HGL_GEM\Theme\ThemeSetup::class, 'setup']);
add_action('init', [\HGL_GEM\Theme\ThemeSetup::class, 'cleanHead']);
add_action('wp_enqueue_scripts', [\HGL_GEM\Theme\ThemeSetup::class, 'dequeueCoreAssets'], 100);
add_filter('emoji_svg_url', '__return_false');
add_filter('show_recent_comments_widget_style', '__return_false');
add_filter('wp_img_tag_add_auto_sizes', '__return_false');

add_action('init', function (): void {
    \HGL_GEM\Certificates\PostTypes\CertificatePostType::register();
    \HGL_GEM\Contact\ContactMessages::registerPostType();
    \HGL_GEM\Theme\AppRouting::addRewriteRules();
});

add_filter('query_vars', [\HGL_GEM\Theme\AppRouting::class, 'queryVars']);
add_filter('template_include', [\HGL_GEM\Theme\AppRouting::class, 'templateInclude']);
add_action('after_switch_theme', static function (): void {
    flush_rewrite_rules();
});

add_action('wp_enqueue_scripts', [\HGL_GEM\Theme\AppAssets::class, 'enqueue']);
add_action('wp_head', [\HGL_GEM\Theme\AppAssets::class, 'printHeadTags'], 1);
add_action('template_redirect', [\HGL_GEM\Theme\AppAssets::class, 'maybePrintSitemap'], 0);
add_filter('document_title_parts', [\HGL_GEM\Theme\AppAssets::class, 'documentTitleParts']);
add_filter('language_attributes', [\HGL_GEM\Theme\AppAssets::class, 'languageAttributes']);
add_filter('script_loader_tag', [\HGL_GEM\Theme\AppAssets::class, 'moduleScriptTag'], 10, 3);
add_filter('robots_txt', [\HGL_GEM\Theme\AppAssets::class, 'robotsTxt'], 10, 2);

add_action('rest_api_init', function (): void {
    \HGL_GEM\Blog\Rest\BlogRestController::registerRoutes();
    \HGL_GEM\Certificates\Rest\CertificateRestController::registerRoutes();
    \HGL_GEM\Contact\ContactMessages::registerRoutes();
});

add_action('add_meta_boxes', [\HGL_GEM\Certificates\Admin\CertificateMetaBox::class, 'register']);
add_action('save_post_' . \HGL_GEM\Certificates\PostTypes\CertificatePostType::POST_TYPE, [\HGL_GEM\Certificates\Admin\CertificateMetaBox::class, 'save']);
add_action('admin_enqueue_scripts', [\HGL_GEM\Certificates\Admin\CertificateMetaBox::class, 'enqueueAssets']);
add_filter('wp_handle_upload_prefilter', [\HGL_GEM\Certificates\Uploads\PdfUploadRenamer::class, 'rename']);

add_action('add_meta_boxes_post', [\HGL_GEM\Blog\Admin\PostLanguageMetaBox::class, 'register']);
add_action('save_post_post', [\HGL_GEM\Blog\Admin\PostLanguageMetaBox::class, 'save']);
add_action('admin_enqueue_scripts', [\HGL_GEM\Blog\Admin\PostLanguageMetaBox::class, 'enqueueAssets']);
add_action('admin_head-post.php', [\HGL_GEM\Blog\Admin\PostLanguageMetaBox::class, 'printStyles']);
add_action('admin_head-post-new.php', [\HGL_GEM\Blog\Admin\PostLanguageMetaBox::class, 'printStyles']);
add_filter('manage_post_posts_columns', [\HGL_GEM\Blog\Admin\PostLanguageMetaBox::class, 'columns']);
add_action('manage_post_posts_custom_column', [\HGL_GEM\Blog\Admin\PostLanguageMetaBox::class, 'renderColumn'], 10, 2);

add_action('category_add_form_fields', [\HGL_GEM\Blog\Admin\CategoryEnglishLabel::class, 'addField']);
add_action('category_edit_form_fields', [\HGL_GEM\Blog\Admin\CategoryEnglishLabel::class, 'editField']);
add_action('created_category', [\HGL_GEM\Blog\Admin\CategoryEnglishLabel::class, 'save']);
add_action('edited_category', [\HGL_GEM\Blog\Admin\CategoryEnglishLabel::class, 'save']);
add_filter('manage_edit-category_columns', [\HGL_GEM\Blog\Admin\CategoryEnglishLabel::class, 'columns']);
add_filter('manage_category_custom_column', [\HGL_GEM\Blog\Admin\CategoryEnglishLabel::class, 'renderColumn'], 10, 3);
