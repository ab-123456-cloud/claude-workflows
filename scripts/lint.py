#!/usr/bin/env python3
"""Structure lint for this skills marketplace.

Checks, per skill directory under plugins/*/skills/:
  - SKILL.md exists and starts with YAML frontmatter
  - frontmatter `name` matches the directory name
  - frontmatter `description` exists and stays within Claude's 1024-char limit

Repo-wide checks:
  - marketplace.json and plugin.json agree on the version
  - no user-specific absolute paths (Windows or Unix home directories)
  - no e-mail addresses outside GitHub noreply
  - .ps1 files are pure ASCII (Windows PowerShell 5.1 misreads UTF-8
    without BOM as ANSI, which breaks string literals)

Stdlib only; exits 1 with a finding list, 0 when clean.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SELF = Path(__file__).resolve()
findings = []


def note(path, message):
    findings.append(f"{path.relative_to(ROOT)}: {message}")


def frontmatter(text):
    if not text.startswith("---"):
        return None
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None
    fields = {}
    key = None
    for line in parts[1].splitlines():
        if re.match(r"^\S", line) and ":" in line:
            key, _, value = line.partition(":")
            key = key.strip()
            fields[key] = value.strip().lstrip(">-").strip()
        elif key and line.startswith(" "):
            fields[key] = (fields[key] + " " + line.strip()).strip()
    return fields


# --- per-skill checks ---------------------------------------------------
for skill_dir in sorted(ROOT.glob("plugins/*/skills/*")):
    if not skill_dir.is_dir():
        continue
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        note(skill_dir, "missing SKILL.md")
        continue
    fields = frontmatter(skill_md.read_text(encoding="utf-8"))
    if fields is None:
        note(skill_md, "missing or unterminated YAML frontmatter")
        continue
    if fields.get("name") != skill_dir.name:
        note(skill_md, f"frontmatter name {fields.get('name')!r} != directory name {skill_dir.name!r}")
    description = fields.get("description", "")
    if not description:
        note(skill_md, "missing description")
    elif len(description) > 1024:
        note(skill_md, f"description is {len(description)} chars (limit 1024)")

# --- version consistency ------------------------------------------------
marketplace = json.loads((ROOT / ".claude-plugin" / "marketplace.json").read_text(encoding="utf-8"))
for entry in marketplace.get("plugins", []):
    plugin_json = ROOT / entry["source"] / ".claude-plugin" / "plugin.json"
    plugin = json.loads(plugin_json.read_text(encoding="utf-8"))
    if plugin.get("version") != entry.get("version"):
        note(plugin_json, f"version {plugin.get('version')!r} != marketplace version {entry.get('version')!r}")

# --- leak and encoding checks -------------------------------------------
HOME_PATH = re.compile(r"[A-Za-z]:[\\/]+Users[\\/]+\w+|/(?:home|Users)/[a-z][\w.-]*")
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
EMAIL_OK = ("users.noreply.github.com", "example.com", "example.org")

for path in ROOT.rglob("*"):
    if not path.is_file() or ".git" in path.parts or path == SELF:
        continue
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        continue
    for match in HOME_PATH.finditer(text):
        note(path, f"user-specific absolute path: {match.group(0)!r}")
    for match in EMAIL.finditer(text):
        if not match.group(0).endswith(EMAIL_OK):
            note(path, f"e-mail address: {match.group(0)!r}")
    if path.suffix == ".ps1" and any(ord(c) > 127 for c in text):
        note(path, "non-ASCII characters in .ps1 (breaks Windows PowerShell 5.1 without BOM)")

if findings:
    print(f"{len(findings)} finding(s):")
    for finding in findings:
        print(f"  - {finding}")
    sys.exit(1)
print("lint: clean")
