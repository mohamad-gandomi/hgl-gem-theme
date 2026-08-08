<?php
/**
 * Admin controls for localized category labels.
 */

namespace HGL_GEM\Blog\Admin;

use HGL_GEM\Support\Text;

if (!defined('ABSPATH')) {
    exit;
}

final class CategoryEnglishLabel
{
    public const META_KEY = '_hgl_english_label';

    private const NONCE_ACTION = 'hgl_gem_category_english_label';
    private const NONCE_NAME = 'hgl_gem_category_english_label_nonce';

    public static function addField(): void
    {
        wp_nonce_field(self::NONCE_ACTION, self::NONCE_NAME);
        ?>
        <div class="form-field term-hgl-english-label-wrap">
            <label for="hgl-category-english-label"><?php esc_html_e('English label', 'hgl-gem'); ?></label>
            <input id="hgl-category-english-label" name="hgl_category_english_label" type="text" value="" />
            <p><?php esc_html_e('Used as the category name on the English site.', 'hgl-gem'); ?></p>
        </div>
        <?php
    }

    public static function editField(\WP_Term $term): void
    {
        $english_label = (string) get_term_meta($term->term_id, self::META_KEY, true);

        wp_nonce_field(self::NONCE_ACTION, self::NONCE_NAME);
        ?>
        <tr class="form-field term-hgl-english-label-wrap">
            <th scope="row"><label for="hgl-category-english-label"><?php esc_html_e('English label', 'hgl-gem'); ?></label></th>
            <td>
                <input id="hgl-category-english-label" name="hgl_category_english_label" type="text" value="<?php echo esc_attr($english_label); ?>" class="regular-text" />
                <p class="description"><?php esc_html_e('Used as the category name on the English site. Persian uses the normal category name.', 'hgl-gem'); ?></p>
            </td>
        </tr>
        <?php
    }

    public static function save(int $term_id): void
    {
        if (!isset($_POST[self::NONCE_NAME]) || !wp_verify_nonce((string) $_POST[self::NONCE_NAME], self::NONCE_ACTION)) {
            return;
        }

        if (!current_user_can('manage_categories')) {
            return;
        }

        $english_label = Text::limit(sanitize_text_field((string) ($_POST['hgl_category_english_label'] ?? '')), 120);

        if ($english_label !== '') {
            update_term_meta($term_id, self::META_KEY, $english_label);
        } else {
            delete_term_meta($term_id, self::META_KEY);
        }
    }

    public static function columns(array $columns): array
    {
        $columns['hgl_english_label'] = __('English label', 'hgl-gem');

        return $columns;
    }

    public static function renderColumn(string $content, string $column, int $term_id): string
    {
        if ($column !== 'hgl_english_label') {
            return $content;
        }

        $english_label = (string) get_term_meta($term_id, self::META_KEY, true);

        return $english_label !== '' ? esc_html($english_label) : '&mdash;';
    }
}
