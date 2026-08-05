<?php
/**
 * Rate limiting for certificate verification attempts.
 */

namespace HGL_GEM\Certificates\Security;

if (!defined('ABSPATH')) {
    exit;
}

final class CertificateRateLimiter
{
    private const MAX_FAILED_ATTEMPTS = 8;
    private const LOCKOUT_SECONDS = 10 * MINUTE_IN_SECONDS;

    public static function isLimited(string $code): bool
    {
        return self::failureCount($code) >= self::MAX_FAILED_ATTEMPTS;
    }

    public static function recordFailure(string $code): void
    {
        set_transient(self::key($code), self::failureCount($code) + 1, self::LOCKOUT_SECONDS);
    }

    public static function clear(string $code): void
    {
        delete_transient(self::key($code));
    }

    private static function failureCount(string $code): int
    {
        return (int) get_transient(self::key($code));
    }

    private static function key(string $code): string
    {
        $ip_address = sanitize_text_field(wp_unslash((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown')));

        return 'hgl_certificate_verify_' . md5(CertificateCode::lookupHash($code) . '|' . $ip_address);
    }
}
