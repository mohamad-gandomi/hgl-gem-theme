<?php
/**
 * One-use short-lived download tokens.
 */

namespace HGL_GEM\Certificates\Security;

if (!defined('ABSPATH')) {
    exit;
}

final class CertificateDownloadToken
{
    private const TTL_SECONDS = 5 * MINUTE_IN_SECONDS;

    public static function issue(int $post_id): string
    {
        $token = wp_generate_password(48, false, false);
        set_transient(self::key($token), $post_id, self::TTL_SECONDS);

        return $token;
    }

    public static function consume(string $token, int $post_id): bool
    {
        $token = sanitize_text_field($token);

        if ($token === '') {
            return false;
        }

        $key = self::key($token);
        $stored_post_id = (int) get_transient($key);

        if ($stored_post_id !== $post_id) {
            return false;
        }

        delete_transient($key);

        return true;
    }

    private static function key(string $token): string
    {
        return 'hgl_certificate_download_' . hash('sha256', $token);
    }
}
