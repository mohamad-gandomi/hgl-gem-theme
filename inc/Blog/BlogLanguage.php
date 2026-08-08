<?php
/**
 * Blog language metadata helpers.
 */

namespace HGL_GEM\Blog;

if (!defined('ABSPATH')) {
    exit;
}

final class BlogLanguage
{
    public const META_LANGUAGE = '_hgl_content_language';
    public const META_TRANSLATION_ID = '_hgl_translation_post_id';

    public static function normalize(string $language): string
    {
        return $language === 'en' ? 'en' : 'fa';
    }

    public static function label(string $language): string
    {
        return self::normalize($language) === 'en' ? __('English', 'hgl-gem') : __('Persian', 'hgl-gem');
    }

    public static function metaQuery(string $locale): array
    {
        if ($locale === 'en') {
            return [
                [
                    'key' => self::META_LANGUAGE,
                    'value' => 'en',
                    'compare' => '=',
                ],
            ];
        }

        return [
            'relation' => 'OR',
            [
                'key' => self::META_LANGUAGE,
                'compare' => 'NOT EXISTS',
            ],
            [
                'key' => self::META_LANGUAGE,
                'value' => 'en',
                'compare' => '!=',
            ],
        ];
    }
}
