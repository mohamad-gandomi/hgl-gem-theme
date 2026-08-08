<?php
/**
 * Shared text normalization helpers.
 */

namespace HGL_GEM\Support;

if (!defined('ABSPATH')) {
    exit;
}

final class Text
{
    public static function limit(string $value, int $length): string
    {
        if (function_exists('mb_substr')) {
            return mb_substr($value, 0, $length);
        }

        return substr($value, 0, $length);
    }

    public static function plain(string $value): string
    {
        $value = wp_strip_all_tags($value, true);
        $value = preg_replace('/https?:\/\/\S+|www\.\S+/i', '', $value);
        $value = preg_replace('/[^\P{C}\r\n\t]+/u', '', (string) $value);
        $value = preg_replace('/[ \t]+/', ' ', (string) $value);
        $value = preg_replace("/\n{3,}/", "\n\n", (string) $value);

        return trim((string) $value);
    }
}
