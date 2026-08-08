#!/usr/bin/env sh
set -eu

theme_slug="${1:-hgl-gem}"
script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
root="$(CDPATH= cd -- "$script_dir/.." && pwd)"
package_root="$root/theme-package"
stage_root="$package_root/$theme_slug"
zip_path="$package_root/$theme_slug.zip"

rm -rf "$stage_root"
mkdir -p "$stage_root"

for file in \
  style.css \
  functions.php \
  index.php \
  front-page.php \
  page.php \
  single.php \
  archive.php \
  404.php \
  README.md
do
  cp "$root/$file" "$stage_root/$file"
done

cp -R "$root/dist" "$stage_root/dist"
cp -R "$root/inc" "$stage_root/inc"
cp -R "$root/assets" "$stage_root/assets"

rm -f "$zip_path"

(
  cd "$package_root"
  zip -qr "$zip_path" "$theme_slug"
)

printf 'Created upload-ready WordPress theme:\n%s\n' "$zip_path"
