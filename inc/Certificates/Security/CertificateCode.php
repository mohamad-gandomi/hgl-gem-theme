<?php
/**
 * Certificate code hashing helpers.
 */

namespace HGL_GEM\Certificates\Security;

if (!defined('ABSPATH')) {
    exit;
}

final class CertificateCode
{
    public static function normalize(string $code): string
    {
        return trim(sanitize_text_field($code));
    }

    public static function passwordHash(string $code): string
    {
        $code = self::normalize($code);

        return $code === '' ? '' : wp_hash_password($code);
    }

    public static function lookupHash(string $code): string
    {
        $code = self::normalize($code);

        return $code === '' ? '' : hash_hmac('sha256', $code, wp_salt('auth'));
    }

    public static function verify(string $enteredCode, string $storedHash): bool
    {
        $enteredCode = self::normalize($enteredCode);
        $storedHash = trim($storedHash);

        return $enteredCode !== '' && $storedHash !== '' && wp_check_password($enteredCode, $storedHash);
    }
}
