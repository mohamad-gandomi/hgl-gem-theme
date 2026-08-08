<?php
/**
 * Admin fields for certificate records.
 */

namespace HGL_GEM\Certificates\Admin;

use HGL_GEM\Certificates\PostTypes\CertificatePostType;
use HGL_GEM\Certificates\Security\CertificateCode;
use HGL_GEM\Certificates\Support\CertificatePdfFile;

if (!defined('ABSPATH')) {
    exit;
}

final class CertificateMetaBox
{
    private const NONCE_ACTION = 'hgl_save_certificate_details';
    private const NONCE_NAME = 'hgl_certificate_details_nonce';

    public static function register(): void
    {
        add_meta_box(
            'hgl-certificate-details',
            __('Certificate Details', 'hgl-gem'),
            [self::class, 'render'],
            CertificatePostType::POST_TYPE,
            'normal',
            'high'
        );
    }

    public static function render(\WP_Post $post): void
    {
        $has_code = (string) get_post_meta($post->ID, CertificatePostType::META_CODE_HASH, true) !== '';
        $visible_code = (string) get_post_meta($post->ID, CertificatePostType::META_CODE_DISPLAY, true);
        $pdf_id = (int) get_post_meta($post->ID, CertificatePostType::META_PDF_ID, true);
        $pdf_path = CertificatePdfFile::storedPath((string) get_post_meta($post->ID, CertificatePostType::META_PDF_PATH, true));
        $slug = sanitize_title($post->post_name);
        $qr_path = $slug !== '' ? '/licence/' . $slug . '/' : '';
        $qr_url = $qr_path !== '' ? home_url($qr_path) : '';

        wp_nonce_field(self::NONCE_ACTION, self::NONCE_NAME);
        ?>
        <div class="hgl-certificate-fields">
            <p>
                <label for="hgl-certificate-code"><strong><?php esc_html_e('Certificate Code', 'hgl-gem'); ?></strong></label>
                <input id="hgl-certificate-code" class="widefat" name="hgl_certificate_code" type="text" value="<?php echo esc_attr($visible_code); ?>">
                <?php if ($has_code) : ?>
                    <span class="description"><?php esc_html_e('Admins can view and update this code. It is still stored as a verification hash for public checks.', 'hgl-gem'); ?></span>
                <?php endif; ?>
            </p>
            <p>
                <label for="hgl-certificate-pdf-path"><strong><?php esc_html_e('Certificate PDF', 'hgl-gem'); ?></strong></label>
                <input id="hgl-certificate-pdf-path" class="widefat" name="hgl_certificate_pdf_path" type="text" value="<?php echo esc_attr($pdf_path); ?>">
                <input id="hgl-certificate-pdf-id" name="hgl_certificate_pdf_id" type="hidden" value="<?php echo esc_attr((string) $pdf_id); ?>">
            </p>
            <p>
                <button type="button" class="button" data-hgl-select-certificate-pdf><?php esc_html_e('Choose PDF', 'hgl-gem'); ?></button>
                <button type="button" class="button" data-hgl-remove-certificate-pdf><?php esc_html_e('Remove PDF', 'hgl-gem'); ?></button>
            </p>
            <div class="hgl-certificate-qr" style="display:flex;align-items:flex-start;gap:16px;margin-top:18px;padding:14px;border:1px solid #dcdcde;background:#fff;border-radius:6px;" data-hgl-certificate-qr="<?php echo esc_attr($qr_url); ?>" data-hgl-certificate-title="<?php echo esc_attr($slug !== '' ? $slug : 'certificate-qr'); ?>">
                <?php if ($qr_path !== '') : ?>
                    <div class="hgl-certificate-qr__preview" style="flex:0 0 auto;" data-hgl-certificate-qr-preview></div>
                    <div style="min-width:0;flex:1;">
                        <p style="margin:0 0 8px;"><strong><?php esc_html_e('Report QR Code', 'hgl-gem'); ?></strong></p>
                        <input class="widefat" type="text" value="<?php echo esc_attr($qr_url); ?>" readonly>
                        <p style="margin:10px 0 0;">
                            <button type="button" class="button button-primary" data-hgl-download-certificate-qr><?php esc_html_e('Download QR Code', 'hgl-gem'); ?></button>
                        </p>
                        <p class="description" style="margin-top:8px;"><?php esc_html_e('Full report URL used by the QR code. Regenerate/download after the production domain is configured.', 'hgl-gem'); ?></p>
                    </div>
                <?php else : ?>
                    <p class="description"><?php esc_html_e('Save this certificate first to generate its QR code from the final slug.', 'hgl-gem'); ?></p>
                <?php endif; ?>
            </div>
        </div>
        <?php
    }

    public static function save(int $post_id): void
    {
        if (!self::canSave($post_id)) {
            return;
        }

        $code = isset($_POST['hgl_certificate_code'])
            ? CertificateCode::normalize(wp_unslash((string) $_POST['hgl_certificate_code']))
            : '';
        $raw_pdf_path = isset($_POST['hgl_certificate_pdf_path'])
            ? esc_url_raw(wp_unslash((string) $_POST['hgl_certificate_pdf_path']))
            : '';
        $pdf_id = isset($_POST['hgl_certificate_pdf_id']) ? absint($_POST['hgl_certificate_pdf_id']) : 0;
        $pdf_path = '';

        if ($pdf_id > 0 && get_post_mime_type($pdf_id) === 'application/pdf') {
            $pdf_path = CertificatePdfFile::storedPath((string) wp_get_attachment_url($pdf_id));
        }

        if ($pdf_path === '' && $raw_pdf_path !== '') {
            $pdf_path = CertificatePdfFile::storedPath($raw_pdf_path);
            $pdf_id = $pdf_path === '' ? 0 : CertificatePdfFile::attachmentIdForPath($pdf_path);
        }

        if ($code !== '') {
            update_post_meta($post_id, CertificatePostType::META_CODE_HASH, CertificateCode::passwordHash($code));
            update_post_meta($post_id, CertificatePostType::META_CODE_DISPLAY, $code);
            update_post_meta($post_id, CertificatePostType::META_LOOKUP_HASH, CertificateCode::lookupHash($code));
        }

        update_post_meta($post_id, CertificatePostType::META_PDF_PATH, $pdf_path);
        update_post_meta($post_id, CertificatePostType::META_PDF_ID, $pdf_id);
    }

    public static function enqueueAssets(string $hook_suffix): void
    {
        if (!in_array($hook_suffix, ['post.php', 'post-new.php'], true)) {
            return;
        }

        $screen = get_current_screen();

        if (!$screen || $screen->post_type !== CertificatePostType::POST_TYPE) {
            return;
        }

        wp_enqueue_media();
        wp_enqueue_script(
            'hgl-certificate-admin',
            get_template_directory_uri() . '/assets/admin/certificate-meta.js',
            ['jquery'],
            HGL_GEM_THEME_VERSION,
            true
        );
    }

    private static function canSave(int $post_id): bool
    {
        if (
            !isset($_POST[self::NONCE_NAME])
            || !wp_verify_nonce(sanitize_text_field(wp_unslash((string) $_POST[self::NONCE_NAME])), self::NONCE_ACTION)
        ) {
            return false;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return false;
        }

        if (wp_is_post_revision($post_id)) {
            return false;
        }

        return current_user_can('edit_post', $post_id);
    }
}
