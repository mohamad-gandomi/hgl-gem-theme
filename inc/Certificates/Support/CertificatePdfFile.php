<?php
/**
 * Strict PDF path helpers for certificate records.
 */

namespace HGL_GEM\Certificates\Support;

use HGL_GEM\Certificates\PostTypes\CertificatePostType;

if (!defined('ABSPATH')) {
    exit;
}

final class CertificatePdfFile
{
    public static function storedPath(string $url_or_path): string
    {
        $url_or_path = trim($url_or_path);

        if ($url_or_path === '') {
            return '';
        }

        $parts = wp_parse_url(str_starts_with($url_or_path, '/') ? home_url($url_or_path) : $url_or_path);

        if (!is_array($parts) || isset($parts['user']) || isset($parts['pass'])) {
            return '';
        }

        if (isset($parts['scheme']) && !in_array(strtolower((string) $parts['scheme']), ['http', 'https'], true)) {
            return '';
        }

        $path = rawurldecode((string) ($parts['path'] ?? ''));

        if (str_contains($path, '..') || !self::isUploadsPdfPath($path)) {
            return '';
        }

        return esc_url_raw($path);
    }

    public static function pathForPost(int $post_id): string
    {
        $attachment_id = (int) get_post_meta($post_id, CertificatePostType::META_PDF_ID, true);

        if ($attachment_id > 0 && get_post_mime_type($attachment_id) === 'application/pdf') {
            $attached_file = (string) get_attached_file($attachment_id);

            if (self::isReadableUploadsPdfFile($attached_file)) {
                return $attached_file;
            }
        }

        $stored_path = self::storedPath((string) get_post_meta($post_id, CertificatePostType::META_PDF_PATH, true));

        if ($stored_path === '') {
            return '';
        }

        $uploads = wp_get_upload_dir();
        $uploads_path = (string) (wp_parse_url((string) ($uploads['baseurl'] ?? ''), PHP_URL_PATH) ?: '/wp-content/uploads');
        $relative_path = ltrim(substr($stored_path, strlen(rtrim($uploads_path, '/') . '/')), '/');
        $file_path = trailingslashit((string) $uploads['basedir']) . $relative_path;

        return self::isReadableUploadsPdfFile($file_path) ? $file_path : '';
    }

    public static function attachmentIdForPath(string $path): int
    {
        $stored_path = self::storedPath($path);

        return $stored_path === '' ? 0 : attachment_url_to_postid(home_url($stored_path));
    }

    private static function isUploadsPdfPath(string $path): bool
    {
        $uploads = wp_get_upload_dir();
        $uploads_path = (string) (wp_parse_url((string) ($uploads['baseurl'] ?? ''), PHP_URL_PATH) ?: '/wp-content/uploads');
        $uploads_path = rtrim($uploads_path, '/') . '/';

        return str_starts_with($path, $uploads_path) && strtolower(pathinfo($path, PATHINFO_EXTENSION)) === 'pdf';
    }

    private static function isReadableUploadsPdfFile(string $file_path): bool
    {
        if ($file_path === '' || !is_readable($file_path)) {
            return false;
        }

        $uploads = wp_get_upload_dir();
        $base_dir = wp_normalize_path(trailingslashit((string) $uploads['basedir']));
        $normalized_path = wp_normalize_path($file_path);

        return str_starts_with($normalized_path, $base_dir) && strtolower(pathinfo($normalized_path, PATHINFO_EXTENSION)) === 'pdf';
    }
}
