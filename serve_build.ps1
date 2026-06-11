# Serve the production dashboard build on :3000 for OBS capture.
# The dev server (`bun run start`) hot-reloads on file edits, which flashes
# on stream — use this static server during recording sessions instead.
#
#   .\serve_build.ps1              # serve existing build
#   .\serve_build.ps1 -Build       # rebuild first
param([switch]$Build)

$repo = $PSScriptRoot
if ($Build) {
    Push-Location $repo
    bun run build
    Pop-Location
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

# The build is path-prefixed (PUBLIC_URL=/rimapi-dashboard), so expose it via
# a junction matching that prefix.
$root = Join-Path $repo "serve_root"
$link = Join-Path $root "rimapi-dashboard"
New-Item -ItemType Directory -Force $root | Out-Null
if (-not (Test-Path $link)) {
    New-Item -ItemType Junction -Path $link -Target (Join-Path $repo "build") | Out-Null
}

bunx serve $root -l 3000 --no-clipboard
