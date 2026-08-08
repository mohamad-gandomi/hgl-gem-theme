<?php
/**
 * Public blog REST endpoints for the React app.
 */

namespace HGL_GEM\Blog\Rest;

use HGL_GEM\Blog\Admin\CategoryEnglishLabel;
use HGL_GEM\Blog\BlogLanguage;

if (!defined('ABSPATH')) {
    exit;
}

final class BlogRestController
{
    public static function registerRoutes(): void
    {
        register_rest_route('hgl/v1', '/posts', [
            'methods' => \WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback' => [self::class, 'posts'],
            'args' => [
                'per_page' => [
                    'default' => 8,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => static fn($value): bool => absint($value) <= 50,
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
            'methods' => \WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback' => [self::class, 'post'],
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
            'methods' => \WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback' => [self::class, 'categories'],
            'args' => [
                'lang' => [
                    'default' => 'fa',
                    'sanitize_callback' => 'sanitize_key',
                ],
            ],
        ]);
    }

    public static function posts(\WP_REST_Request $request): \WP_REST_Response
    {
        $per_page = min(max(absint(self::param($request, 'per_page')), 1), 50);
        $page = max(absint(self::param($request, 'page')), 1);
        $search = sanitize_text_field(self::param($request, 'search'));
        $category = sanitize_title(self::param($request, 'category'));
        $locale = self::locale($request);

        $query_args = [
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => $per_page,
            'paged' => $page,
            'ignore_sticky_posts' => true,
            'no_found_rows' => false,
            's' => $search,
            'meta_query' => BlogLanguage::metaQuery($locale),
        ];

        if ($category !== '') {
            $query_args['category_name'] = $category;
        }

        $query = new \WP_Query($query_args);
        $posts = array_map(static fn(\WP_Post $post): array => self::postPayload($post, $locale), $query->posts);

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

    public static function post(\WP_REST_Request $request): \WP_REST_Response|\WP_Error
    {
        $slug = sanitize_title(self::param($request, 'slug'));
        $locale = self::locale($request);

        if ($slug === '') {
            return new \WP_Error('hgl_post_not_found', __('Post not found.', 'hgl-gem'), ['status' => 404]);
        }

        $query = new \WP_Query([
            'post_type' => 'post',
            'post_status' => 'publish',
            'name' => $slug,
            'posts_per_page' => 1,
            'no_found_rows' => true,
            'ignore_sticky_posts' => true,
            'meta_query' => BlogLanguage::metaQuery($locale),
        ]);

        if (!$query->have_posts()) {
            return new \WP_Error('hgl_post_not_found', __('Post not found.', 'hgl-gem'), ['status' => 404]);
        }

        $post = $query->posts[0];
        wp_reset_postdata();

        return rest_ensure_response(self::postPayload($post, $locale));
    }

    public static function categories(\WP_REST_Request $request): \WP_REST_Response
    {
        $locale = self::locale($request);
        $post_ids = get_posts([
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids',
            'no_found_rows' => true,
            'meta_query' => BlogLanguage::metaQuery($locale),
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

        return rest_ensure_response(array_map(static fn(\WP_Term $term): array => self::categoryPayload($term, $locale), $terms));
    }

    private static function postPayload(\WP_Post $post, string $locale): array
    {
        $post_id = (int) $post->ID;
        $cover_id = get_post_thumbnail_id($post_id);
        $card_image = self::imagePayload($cover_id, 'hgl_post_card');
        $hero_image = self::imagePayload($cover_id, 'hgl_post_hero');
        $categories = array_map(static fn(\WP_Term $term): array => self::categoryPayload($term, $locale), get_the_category($post_id));
        $language = BlogLanguage::normalize((string) get_post_meta($post_id, BlogLanguage::META_LANGUAGE, true));
        $translation_id = absint(get_post_meta($post_id, BlogLanguage::META_TRANSLATION_ID, true));

        return [
            'id' => $post_id,
            'slug' => sanitize_title($post->post_name),
            'title' => html_entity_decode(get_the_title($post_id), ENT_QUOTES, get_bloginfo('charset')),
            'date' => self::postDate($post_id, $locale),
            'excerpt' => self::trimExcerpt($post_id, $locale),
            'content' => wp_kses_post(apply_filters('the_content', $post->post_content)),
            'cover' => $card_image['src'],
            'coverImage' => $card_image,
            'heroImage' => $hero_image,
            'categories' => $categories,
            'language' => $language,
            'translationId' => $translation_id,
            'translation' => self::translationPayload($translation_id),
        ];
    }

    private static function translationPayload(int $translation_id): ?array
    {
        if ($translation_id <= 0 || get_post_type($translation_id) !== 'post' || get_post_status($translation_id) !== 'publish') {
            return null;
        }

        $language = BlogLanguage::normalize((string) get_post_meta($translation_id, BlogLanguage::META_LANGUAGE, true));
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

    private static function categoryPayload(\WP_Term $term, string $locale): array
    {
        $name = html_entity_decode($term->name, ENT_QUOTES, get_bloginfo('charset'));
        $english_label = trim((string) get_term_meta($term->term_id, CategoryEnglishLabel::META_KEY, true));

        return [
            'name' => $locale === 'en' && $english_label !== '' ? $english_label : $name,
            'persianName' => $name,
            'englishName' => $english_label,
            'slug' => $term->slug,
            'count' => (int) $term->count,
        ];
    }

    private static function imagePayload(int $attachment_id, string $size): array
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

    private static function postDate(int $post_id, string $locale): string
    {
        $timestamp = (int) get_post_time('U', false, $post_id);

        if ($locale !== 'fa') {
            return esc_html(get_the_date('', $post_id));
        }

        [$jy, $jm, $jd] = self::gregorianToJalali(
            (int) gmdate('Y', $timestamp),
            (int) gmdate('n', $timestamp),
            (int) gmdate('j', $timestamp)
        );

        $months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

        return self::toPersianDigits($jd . ' ' . $months[$jm - 1] . ' ' . $jy);
    }

    private static function trimExcerpt(int $post_id, string $locale): string
    {
        $excerpt = get_the_excerpt($post_id);
        $words = $locale === 'fa' ? 22 : 24;

        return wp_strip_all_tags(wp_trim_words($excerpt, $words, '...'));
    }

    private static function toPersianDigits(string $value): string
    {
        return strtr($value, ['0' => '۰', '1' => '۱', '2' => '۲', '3' => '۳', '4' => '۴', '5' => '۵', '6' => '۶', '7' => '۷', '8' => '۸', '9' => '۹']);
    }

    private static function gregorianToJalali(int $gy, int $gm, int $gd): array
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

    private static function locale(\WP_REST_Request $request): string
    {
        return sanitize_key(self::param($request, 'lang')) === 'en' ? 'en' : 'fa';
    }

    private static function param(\WP_REST_Request $request, string $key): string
    {
        $value = $request->get_param($key);

        return is_scalar($value) ? (string) $value : '';
    }
}
