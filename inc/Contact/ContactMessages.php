<?php
/**
 * Contact message post type and REST endpoint.
 */

namespace HGL_GEM\Contact;

use HGL_GEM\Support\ClientIp;
use HGL_GEM\Support\Text;

if (!defined('ABSPATH')) {
    exit;
}

final class ContactMessages
{
    public const POST_TYPE = 'hgl_contact_message';

    public static function registerPostType(): void
    {
        register_post_type(self::POST_TYPE, [
            'labels' => [
                'name' => __('Contact Messages', 'hgl-gem'),
                'singular_name' => __('Contact Message', 'hgl-gem'),
                'menu_name' => __('Contact Messages', 'hgl-gem'),
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => false,
            'capability_type' => 'post',
            'supports' => ['title', 'editor'],
            'menu_icon' => 'dashicons-email',
        ]);
    }

    public static function registerRoutes(): void
    {
        register_rest_route('hgl/v1', '/contact', [
            'methods' => \WP_REST_Server::CREATABLE,
            'permission_callback' => '__return_true',
            'callback' => [self::class, 'submit'],
            'args' => [
                'name' => ['required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field'],
                'email' => ['required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_email'],
                'requestType' => ['required' => false, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field'],
                'message' => ['required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_textarea_field'],
                'website' => ['required' => false, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field'],
            ],
        ]);
    }

    public static function submit(\WP_REST_Request $request): \WP_REST_Response|\WP_Error
    {
        $nonce = (string) ($request->get_header('x_wp_nonce') ?: $request->get_header('X-WP-Nonce'));
        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new \WP_Error('hgl_contact_forbidden', __('Could not verify this request.', 'hgl-gem'), ['status' => 403]);
        }

        if ((string) $request->get_param('website') !== '') {
            return rest_ensure_response(['ok' => true]);
        }

        if (!self::rateLimit()) {
            return new \WP_Error('hgl_contact_rate_limited', __('Please wait before sending another message.', 'hgl-gem'), ['status' => 429]);
        }

        $name = Text::limit(Text::plain((string) $request->get_param('name')), 100);
        $email = sanitize_email((string) $request->get_param('email'));
        $request_type = Text::limit(Text::plain((string) $request->get_param('requestType')), 120);
        $raw_message = (string) $request->get_param('message');
        $message = Text::limit(Text::plain($raw_message), 3000);

        if ($name === '' || $email === '' || $message === '') {
            return new \WP_Error('hgl_contact_required', __('Please complete the required fields.', 'hgl-gem'), ['status' => 400]);
        }

        if (!is_email($email)) {
            return new \WP_Error('hgl_contact_email', __('Please enter a valid email address.', 'hgl-gem'), ['status' => 400]);
        }

        if (preg_match('/https?:\/\/|www\.|<[^>]+>|\[[^\]]+\]\([^)]+\)/i', $raw_message)) {
            return new \WP_Error('hgl_contact_spam', __('Your message could not be accepted.', 'hgl-gem'), ['status' => 400]);
        }

        $body = implode("\n\n", [
            'Name: ' . $name,
            'Email: ' . $email,
            'Request type: ' . $request_type,
            'Message:',
            $message,
        ]);

        $submission_id = wp_insert_post([
            'post_type' => self::POST_TYPE,
            'post_status' => 'private',
            'post_title' => sprintf('%s - %s', $name, current_time('Y-m-d H:i')),
            'post_content' => $body,
            'meta_input' => [
                '_hgl_contact_name' => $name,
                '_hgl_contact_email' => $email,
                '_hgl_contact_request_type' => $request_type,
            ],
        ], true);

        if (is_wp_error($submission_id)) {
            return new \WP_Error('hgl_contact_store_failed', __('Could not save your message. Please try again.', 'hgl-gem'), ['status' => 500]);
        }

        return rest_ensure_response(['ok' => true]);
    }

    private static function rateLimit(): bool
    {
        $key = 'hgl_contact_' . md5(ClientIp::address());
        $attempts = (int) get_transient($key);

        if ($attempts >= 5) {
            return false;
        }

        set_transient($key, $attempts + 1, 15 * MINUTE_IN_SECONDS);

        return true;
    }
}
