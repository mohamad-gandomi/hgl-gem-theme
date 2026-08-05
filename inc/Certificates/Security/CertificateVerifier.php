<?php
/**
 * Finds and verifies certificate records.
 */

namespace HGL_GEM\Certificates\Security;

use HGL_GEM\Certificates\PostTypes\CertificatePostType;

if (!defined('ABSPATH')) {
    exit;
}

final class CertificateVerifier
{
    public static function verify(string $entered_code, string $slug = ''): int|\WP_Error
    {
        $entered_code = CertificateCode::normalize($entered_code);
        $slug = sanitize_title($slug);

        if ($entered_code === '' || strlen($entered_code) > 80) {
            return new \WP_Error('hgl_certificate_invalid_code', __('Could not verify this certificate.', 'hgl-gem'), ['status' => 403]);
        }

        if (CertificateRateLimiter::isLimited($entered_code)) {
            return new \WP_Error('hgl_certificate_rate_limited', __('Could not verify this certificate.', 'hgl-gem'), ['status' => 429]);
        }

        $post_id = $slug !== '' ? self::findPostIdBySlug($slug) : self::findPostIdByCode($entered_code);

        if ($post_id <= 0) {
            CertificateRateLimiter::recordFailure($entered_code);
            return new \WP_Error('hgl_certificate_not_found', __('Could not verify this certificate.', 'hgl-gem'), ['status' => 403]);
        }

        $stored_hash = (string) get_post_meta($post_id, CertificatePostType::META_CODE_HASH, true);

        if (!CertificateCode::verify($entered_code, $stored_hash)) {
            CertificateRateLimiter::recordFailure($entered_code);
            return new \WP_Error('hgl_certificate_mismatch', __('Could not verify this certificate.', 'hgl-gem'), ['status' => 403]);
        }

        CertificateRateLimiter::clear($entered_code);

        return $post_id;
    }

    private static function findPostIdByCode(string $code): int
    {
        $query = new \WP_Query([
            'post_type' => CertificatePostType::POST_TYPE,
            'post_status' => 'publish',
            'fields' => 'ids',
            'posts_per_page' => 1,
            'no_found_rows' => true,
            'meta_key' => CertificatePostType::META_LOOKUP_HASH,
            'meta_value' => CertificateCode::lookupHash($code),
        ]);

        return empty($query->posts) ? 0 : (int) $query->posts[0];
    }

    private static function findPostIdBySlug(string $slug): int
    {
        $query = new \WP_Query([
            'post_type' => CertificatePostType::POST_TYPE,
            'post_status' => 'publish',
            'name' => $slug,
            'fields' => 'ids',
            'posts_per_page' => 1,
            'no_found_rows' => true,
        ]);

        return empty($query->posts) ? 0 : (int) $query->posts[0];
    }
}
