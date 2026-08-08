<?php
/**
 * Admin controls for pairing Persian and English blog posts.
 */

namespace HGL_GEM\Blog\Admin;

use HGL_GEM\Blog\BlogLanguage;

if (!defined('ABSPATH')) {
    exit;
}

final class PostLanguageMetaBox
{
    private const NONCE_ACTION = 'hgl_gem_post_language';
    private const NONCE_NAME = 'hgl_gem_post_language_nonce';

    public static function register(): void
    {
        add_meta_box(
            'hgl-post-language',
            __('Post Language', 'hgl-gem'),
            [self::class, 'render'],
            'post',
            'side',
            'default'
        );
    }

    public static function render(\WP_Post $post): void
    {
        $language = BlogLanguage::normalize((string) get_post_meta($post->ID, BlogLanguage::META_LANGUAGE, true));
        $translation_id = absint(get_post_meta($post->ID, BlogLanguage::META_TRANSLATION_ID, true));
        $translation = $translation_id > 0 ? get_post($translation_id) : null;
        $post_options = get_posts([
            'post_type' => 'post',
            'post_status' => ['publish', 'draft', 'pending', 'private', 'future'],
            'posts_per_page' => 100,
            'post__not_in' => [$post->ID],
            'orderby' => 'date',
            'order' => 'DESC',
            'no_found_rows' => true,
        ]);

        wp_nonce_field(self::NONCE_ACTION, self::NONCE_NAME);
        ?>
        <div class="hgl-post-language-fields">
            <p>
                <label for="hgl-content-language"><strong><?php esc_html_e('Language', 'hgl-gem'); ?></strong></label>
                <select id="hgl-content-language" name="hgl_content_language" class="widefat">
                    <option value="fa" <?php selected($language, 'fa'); ?>><?php esc_html_e('Persian', 'hgl-gem'); ?></option>
                    <option value="en" <?php selected($language, 'en'); ?>><?php esc_html_e('English', 'hgl-gem'); ?></option>
                </select>
            </p>
            <p>
                <label for="hgl-translation-post-select"><strong><?php esc_html_e('Translation post', 'hgl-gem'); ?></strong></label>
                <input id="hgl-translation-post-id" name="hgl_translation_post_id" type="hidden" value="<?php echo esc_attr((string) $translation_id); ?>" />
                <select id="hgl-translation-post-select" class="widefat hgl-select2" data-placeholder="<?php esc_attr_e('Search by title...', 'hgl-gem'); ?>">
                    <option value=""><?php esc_html_e('Choose by title...', 'hgl-gem'); ?></option>
                    <?php foreach ($post_options as $option) : ?>
                        <?php
                        $option_language = BlogLanguage::label((string) get_post_meta($option->ID, BlogLanguage::META_LANGUAGE, true));
                        $option_title = html_entity_decode(get_the_title($option), ENT_QUOTES, get_bloginfo('charset'));
                        ?>
                        <option value="<?php echo esc_attr((string) $option->ID); ?>" <?php selected($translation_id, (int) $option->ID); ?>>
                            <?php echo esc_html(sprintf('#%d - %s - %s', $option->ID, $option_language, $option_title)); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <span class="description"><?php esc_html_e('Search and choose the post in the other language. The reverse link is saved automatically.', 'hgl-gem'); ?></span>
                <?php if ($translation instanceof \WP_Post) : ?>
                    <span class="description hgl-translation-current">
                        <?php
                        printf(
                            esc_html__('Current: #%1$d - %2$s', 'hgl-gem'),
                            (int) $translation->ID,
                            esc_html(get_the_title($translation))
                        );
                        ?>
                    </span>
                <?php endif; ?>
            </p>
        </div>
        <?php
    }

    public static function save(int $post_id): void
    {
        if (!isset($_POST[self::NONCE_NAME]) || !wp_verify_nonce((string) $_POST[self::NONCE_NAME], self::NONCE_ACTION)) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $language = BlogLanguage::normalize(sanitize_key((string) ($_POST['hgl_content_language'] ?? 'fa')));
        $translation_id = absint($_POST['hgl_translation_post_id'] ?? 0);

        update_post_meta($post_id, BlogLanguage::META_LANGUAGE, $language);

        if ($translation_id > 0 && $translation_id !== $post_id && get_post_type($translation_id) === 'post') {
            update_post_meta($post_id, BlogLanguage::META_TRANSLATION_ID, $translation_id);
            update_post_meta($translation_id, BlogLanguage::META_TRANSLATION_ID, $post_id);
        } else {
            delete_post_meta($post_id, BlogLanguage::META_TRANSLATION_ID);
        }
    }

    public static function enqueueAssets(string $hook_suffix): void
    {
        if (!in_array($hook_suffix, ['post.php', 'post-new.php'], true)) {
            return;
        }

        $screen = get_current_screen();
        if (!$screen || $screen->post_type !== 'post') {
            return;
        }

        wp_enqueue_style(
            'hgl-gem-select2',
            get_template_directory_uri() . '/assets/vendor/select2/select2.min.css',
            [],
            '4.1.0-rc.0'
        );

        wp_enqueue_script(
            'hgl-gem-select2',
            get_template_directory_uri() . '/assets/vendor/select2/select2.min.js',
            ['jquery'],
            '4.1.0-rc.0',
            true
        );

        wp_enqueue_script(
            'hgl-gem-post-language-admin',
            get_template_directory_uri() . '/assets/admin/post-language.js',
            ['jquery', 'hgl-gem-select2'],
            HGL_GEM_THEME_VERSION,
            true
        );
    }

    public static function printStyles(): void
    {
        $screen = get_current_screen();
        if (!$screen || $screen->post_type !== 'post') {
            return;
        }
        ?>
        <style>
            #hgl-post-language .inside { overflow: visible; }
            #hgl-post-language .hgl-post-language-fields,
            #hgl-post-language .hgl-post-language-fields * { box-sizing: border-box; }
            #hgl-post-language .description { display: block; margin-top: 6px; }
            #hgl-post-language .hgl-translation-current { color: #1d2327; }
            #hgl-post-language .select2-container { max-width: 100%; width: 100% !important; }
            #hgl-post-language .select2-container .select2-selection--single { height: 34px; min-height: 34px; }
            #hgl-post-language .select2-container .select2-selection__rendered {
                line-height: 32px;
                overflow: hidden;
                padding-right: 28px;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            #hgl-post-language .select2-container .select2-selection__arrow { min-height: 32px; }
            #hgl-post-language .select2-container--default .select2-selection--single .select2-selection__clear {
                height: 32px;
                margin-right: 18px;
            }
            #hgl-post-language .select2-container--open { z-index: 100000; }
        </style>
        <?php
    }

    public static function columns(array $columns): array
    {
        $columns['hgl_language'] = __('Language', 'hgl-gem');
        $columns['hgl_translation'] = __('Translation', 'hgl-gem');

        return $columns;
    }

    public static function renderColumn(string $column, int $post_id): void
    {
        if ($column === 'hgl_language') {
            echo esc_html(BlogLanguage::label((string) get_post_meta($post_id, BlogLanguage::META_LANGUAGE, true)));
        }

        if ($column === 'hgl_translation') {
            $translation_id = absint(get_post_meta($post_id, BlogLanguage::META_TRANSLATION_ID, true));
            echo $translation_id > 0 ? esc_html((string) $translation_id) : '&mdash;';
        }
    }
}
