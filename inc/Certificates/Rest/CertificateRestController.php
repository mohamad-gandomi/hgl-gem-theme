<?php
/**
 * REST endpoints for certificate verification and protected downloads.
 */

namespace HGL_GEM\Certificates\Rest;

use HGL_GEM\Certificates\Security\CertificateDownloadToken;
use HGL_GEM\Certificates\Security\CertificateVerifier;
use HGL_GEM\Certificates\Support\CertificatePdfFile;

if (!defined('ABSPATH')) {
    exit;
}

final class CertificateRestController
{
    public static function registerRoutes(): void
    {
        register_rest_route('hgl/v1', '/certificates/verify', [
            'methods' => \WP_REST_Server::CREATABLE,
            'permission_callback' => '__return_true',
            'callback' => [self::class, 'verify'],
            'args' => [
                'code' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'slug' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_title',
                ],
            ],
        ]);

        register_rest_route('hgl/v1', '/certificates/(?P<id>\d+)/download', [
            'methods' => \WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback' => [self::class, 'download'],
            'args' => [
                'token' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);
    }

    public static function verify(\WP_REST_Request $request): \WP_REST_Response|\WP_Error
    {
        $post_id = CertificateVerifier::verify(
            (string) $request->get_param('code'),
            (string) $request->get_param('slug')
        );

        if (is_wp_error($post_id)) {
            return $post_id;
        }

        if (CertificatePdfFile::pathForPost((int) $post_id) === '') {
            return new \WP_Error('hgl_certificate_missing_pdf', __('Could not verify this certificate.', 'hgl-gem'), ['status' => 403]);
        }

        $download_url = add_query_arg(
            'token',
            rawurlencode(CertificateDownloadToken::issue((int) $post_id)),
            rest_url('hgl/v1/certificates/' . (int) $post_id . '/download')
        );

        return rest_ensure_response([
            'title' => html_entity_decode(get_the_title((int) $post_id), ENT_QUOTES, get_bloginfo('charset')),
            'downloadUrl' => esc_url_raw($download_url),
            'expiresIn' => 5 * MINUTE_IN_SECONDS,
        ]);
    }

    public static function download(\WP_REST_Request $request): \WP_REST_Response|\WP_Error
    {
        $post_id = absint($request['id']);
        $token = (string) $request->get_param('token');

        if (!CertificateDownloadToken::consume($token, $post_id)) {
            return new \WP_Error('hgl_certificate_invalid_download', __('This download link has expired.', 'hgl-gem'), ['status' => 403]);
        }

        $path = CertificatePdfFile::pathForPost($post_id);

        if ($path === '' || !is_readable($path)) {
            return new \WP_Error('hgl_certificate_missing_pdf', __('This PDF is not available.', 'hgl-gem'), ['status' => 404]);
        }

        nocache_headers();
        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="' . basename($path) . '"');
        header('Content-Length: ' . (string) filesize($path));
        readfile($path);
        exit;
    }
}
