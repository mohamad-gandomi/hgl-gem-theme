<?php
/**
 * Certificate custom post type.
 */

namespace HGL_GEM\Certificates\PostTypes;

if (!defined('ABSPATH')) {
    exit;
}

final class CertificatePostType
{
    public const POST_TYPE = 'hgl_certificate';
    public const META_CODE_HASH = '_hgl_certificate_code_hash';
    public const META_CODE_DISPLAY = '_hgl_certificate_code_display';
    public const META_LOOKUP_HASH = '_hgl_certificate_lookup_hash';
    public const META_PDF_ID = '_hgl_certificate_pdf_id';
    public const META_PDF_PATH = '_hgl_certificate_pdf_path';

    public static function register(): void
    {
        register_post_type(self::POST_TYPE, [
            'labels' => [
                'name' => __('Certificates', 'hgl-gem'),
                'singular_name' => __('Certificate', 'hgl-gem'),
                'add_new_item' => __('Add New Certificate', 'hgl-gem'),
                'edit_item' => __('Edit Certificate', 'hgl-gem'),
                'new_item' => __('New Certificate', 'hgl-gem'),
                'view_item' => __('View Certificate', 'hgl-gem'),
                'search_items' => __('Search Certificates', 'hgl-gem'),
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => false,
            'has_archive' => false,
            'menu_icon' => 'dashicons-media-document',
            'supports' => ['title'],
            'capability_type' => 'post',
        ]);
    }
}
