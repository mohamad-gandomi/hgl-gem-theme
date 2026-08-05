param(
  [string]$ThemeSlug = "hgl-gem"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$packageRoot = Join-Path $root "theme-package"
$stageRoot = Join-Path $packageRoot $ThemeSlug
$zipPath = Join-Path $packageRoot "$ThemeSlug.zip"

if (Test-Path $stageRoot) {
  Remove-Item -LiteralPath $stageRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $stageRoot | Out-Null

$files = @(
  "style.css",
  "functions.php",
  "index.php",
  "front-page.php",
  "page.php",
  "single.php",
  "archive.php",
  "404.php",
  "README.md"
)

foreach ($file in $files) {
  Copy-Item -LiteralPath (Join-Path $root $file) -Destination (Join-Path $stageRoot $file) -Force
}

Copy-Item -LiteralPath (Join-Path $root "dist") -Destination (Join-Path $stageRoot "dist") -Recurse -Force
Copy-Item -LiteralPath (Join-Path $root "inc") -Destination (Join-Path $stageRoot "inc") -Recurse -Force
Copy-Item -LiteralPath (Join-Path $root "assets") -Destination (Join-Path $stageRoot "assets") -Recurse -Force

if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -LiteralPath $stageRoot -DestinationPath $zipPath -Force

Write-Host "Created upload-ready WordPress theme:"
Write-Host $zipPath
