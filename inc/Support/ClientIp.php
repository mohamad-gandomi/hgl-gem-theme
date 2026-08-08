<?php
/**
 * Client IP detection for public rate limits.
 */

namespace HGL_GEM\Support;

if (!defined('ABSPATH')) {
    exit;
}

final class ClientIp
{
    public static function address(): string
    {
        $remote_addr = (string) ($_SERVER['REMOTE_ADDR'] ?? '');

        if (filter_var($remote_addr, FILTER_VALIDATE_IP)) {
            return $remote_addr;
        }

        return 'unknown';
    }
}
