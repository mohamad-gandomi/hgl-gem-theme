<?php
/**
 * Theme setup and WordPress output cleanup.
 */

namespace HGL_GEM\Theme;

if (!defined('ABSPATH')) {
    exit;
}

final class ThemeSetup
{
    public static function setup(): void
    {
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
        add_theme_support('html5', ['script', 'style']);
        add_image_size('hgl_post_card', 720, 540, true);
        add_image_size('hgl_post_hero', 1200, 675, true);
    }

    public static function cleanHead(): void
    {
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
    }

    public static function dequeueCoreAssets(): void
    {
        remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
        remove_action('wp_footer', 'wp_enqueue_global_styles', 1);
        wp_dequeue_style('wp-block-library');
        wp_dequeue_style('classic-theme-styles');
        wp_dequeue_style('global-styles');
        wp_deregister_style('wp-block-library');
        wp_deregister_style('classic-theme-styles');
        wp_deregister_style('global-styles');
    }
}
