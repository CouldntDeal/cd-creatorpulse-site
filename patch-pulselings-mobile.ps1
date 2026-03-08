# patch-pulselings-mobile.ps1
# Run from: C:\Users\Kaide\Desktop\cd-creatorpulse-site
# Fixes mobile overlap: position:sticky on sidebar causes leaderboard
# to layer over content instead of stacking on phones

$file = "pulselings.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$old = '@media (max-width: 900px) {
        .pulselings-body { grid-template-columns: 1fr; }
        .pulselings-sidebar { order: -1; }  /* leaderboard above content on mobile */
      }'

$new = '@media (max-width: 900px) {
        /* Stack columns vertically — sidebar above content */
        .pulselings-body { display: flex; flex-direction: column; }
        .pulselings-sidebar {
          order: -1;
          position: static;
          max-height: none;
          overflow-y: visible;
          width: 100%;
        }
        .pulselings-main { width: 100%; }
        .pulselings-page { padding-left: 14px; padding-right: 14px; }
      }
      @media (max-width: 600px) {
        .pulse-hero { padding: 28px 0 14px; }
        .pulse-hero h1 { font-size: 28px; }
        .guide-grid { grid-template-columns: 1fr; }
        .lb-xp, .lb-id { display: none; }
      }'

if (-not $content.Contains($old)) {
  Write-Host "ERROR: Could not find the target string. File may already be patched or has changed." -ForegroundColor Red
  exit 1
}

$patched = $content.Replace($old, $new)
[System.IO.File]::WriteAllText($file, $patched, [System.Text.Encoding]::UTF8)
Write-Host "OK: pulselings.html patched successfully." -ForegroundColor Green
