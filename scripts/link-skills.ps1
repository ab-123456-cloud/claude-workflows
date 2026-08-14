# Link every skill in this repo into ~/.claude/skills so Claude Code loads
# them straight from your working copy -- edits and `git pull` take effect
# immediately, no copying step.
#
# Windows junctions are used (no admin rights or developer mode needed).
# Safe by design: existing real directories are never touched -- remove them
# yourself if you want them replaced by a link. Re-running is idempotent.

$ErrorActionPreference = 'Stop'

$repoSkills = Join-Path (Split-Path $PSScriptRoot -Parent) 'plugins\flow-skills\skills'
$target = Join-Path $env:USERPROFILE '.claude\skills'

if (-not (Test-Path $repoSkills)) { throw "Skills folder not found: $repoSkills" }
if (-not (Test-Path $target)) { New-Item -ItemType Directory -Path $target | Out-Null }

$linked = @(); $skipped = @()

Get-ChildItem $repoSkills -Directory | Where-Object {
    Test-Path (Join-Path $_.FullName 'SKILL.md')
} | ForEach-Object {
    $link = Join-Path $target $_.Name
    if (Test-Path $link) {
        $item = Get-Item $link -Force
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
            # Existing junction/symlink: remove the link only (never the target's
            # contents), then relink -- keeps the run idempotent after repo moves.
            cmd /c rmdir "$link"
        } else {
            $skipped += $_.Name
            return
        }
    }
    New-Item -ItemType Junction -Path $link -Target $_.FullName | Out-Null
    $linked += $_.Name
}

Write-Host "Linked into ${target}:"
$linked | ForEach-Object { Write-Host "  + $_" }
if ($skipped) {
    Write-Host "Skipped (a real folder is already there -- remove it first if you want the link):"
    $skipped | ForEach-Object { Write-Host "  ! $_" }
}
