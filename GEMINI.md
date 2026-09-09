# AIgnite Project-Wide Agent Rules

All AI agents, coding assistants, and contributors working on this codebase must strictly follow these rules:

## 1. Punctuation: No Em Dashes
- **STRICT REQUIREMENT:** Never use em dashes (`—`) or en dashes (`–`) anywhere in this project.
- **Always use a standard single hyphen (`-`)** for dashes in all user interface copy, markdown documentation, headings, page titles, data fixtures, code comments, and strings.
- Example:
  - ❌ `AIgnite — Master Applied AI in 5-Minute Daily Sparks`
  - ✅ `AIgnite - Master Applied AI in 5-Minute Daily Sparks`
- *Exception:* Third-party vendor-generated blocks that are automatically managed by external CLI tools.

## 2. Typography: Minimum Font Size (`text-sm` or Larger)
- **STRICT REQUIREMENT:** Never use `text-xs` (12px / 0.75rem) anywhere in Tailwind CSS classes. 12px is too small for accessibility, legibility, and mobile usability.
- **The minimum allowed text size across the entire project is `text-sm` (14px / 0.875rem)** or `text-base` (16px / 1rem).
- This applies to all components, labels, badges, pills, buttons, subtitles, telemetry indicators, metadata, and captions.
- To indicate secondary hierarchy or diminished visual prominence, use color and opacity tokens (e.g. `text-sm text-muted-foreground`) or font weights (`font-normal`, `font-medium`), NOT smaller font sizes.
- Example:
  - ❌ `className="text-xs text-muted-foreground"`
  - ✅ `className="text-sm text-muted-foreground"`
