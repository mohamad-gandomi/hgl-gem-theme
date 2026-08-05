<?php
/**
 * Gives uploaded PDF files opaque filenames.
 */

namespace HGL_GEM\Certificates\Uploads;

if (!defined('ABSPATH')) {
    exit;
}

final class PdfUploadRenamer
{
    private const RANDOM_LENGTH = 10;
    private const MAX_ATTEMPTS = 10;

    public static function rename(array $file): array
    {
        if (!self::isPdfUpload($file)) {
            return $file;
        }

        $file['name'] = self::uniqueFilename();

        return $file;
    }

    private static function isPdfUpload(array $file): bool
    {
        $name = isset($file['name']) ? (string) $file['name'] : '';
        $type = isset($file['type']) ? strtolower((string) $file['type']) : '';
        $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));

        if ($extension !== 'pdf' || $type !== 'application/pdf') {
            return false;
        }

        if (empty($file['tmp_name']) || !is_uploaded_file((string) $file['tmp_name'])) {
            return false;
        }

        $detected_type = wp_check_filetype_and_ext((string) $file['tmp_name'], $name, ['pdf' => 'application/pdf']);

        return ($detected_type['ext'] ?? '') === 'pdf' && ($detected_type['type'] ?? '') === 'application/pdf';
    }

    private static function uniqueFilename(): string
    {
        $upload_dir = wp_get_upload_dir();
        $target_dir = $upload_dir['path'] ?? '';

        for ($attempt = 0; $attempt < self::MAX_ATTEMPTS; $attempt++) {
            $filename = wp_generate_password(self::RANDOM_LENGTH, false, false) . '.pdf';

            if ($target_dir === '' || !file_exists(trailingslashit($target_dir) . $filename)) {
                return $filename;
            }
        }

        return wp_unique_filename($target_dir, wp_generate_password(16, false, false) . '.pdf');
    }
}
