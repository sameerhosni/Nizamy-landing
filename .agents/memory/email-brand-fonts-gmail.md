---
name: Brand fonts in Gmail emails
description: How to render true brand fonts (incl. Arabic) in Gmail — pre-rendered PNG headlines via ImageMagick+Pango; which tools fail
---

Rule: Gmail strips `<link>`/`@import`/`@font-face` web fonts. To show true brand fonts in email, pre-render display text as transparent PNGs (2x retina) and embed as CID attachments with alt-text + HTML-text fallback. Keep body copy as real text with a system font stack.

**Why:** User rejected system-font fallbacks for Arabic brand headings; inline @font-face only helps Apple Mail etc. Later the user also rejected mixing families in one email ("one font like the content") — emails now use IBM Plex Sans Arabic (body font) for everything, including the pre-rendered headline PNGs. Don't reintroduce Cairo/Tajawal into emails.

**How to apply:**
- Use system `magick` with Pango markup (`magick -background none "pango:@markup.txt" -trim +repage out.png`). Pango handles Arabic shaping/bidi correctly and auto-detects RTL.
- Do NOT use `@resvg/resvg-js` (broken Arabic bidi) or `node-canvas` (no Node 24 prebuild).
- Fontconfig quirk: single-weight TTFs may register weight inside the family name (e.g. family "Tajawal ExtraBold"). Then a Pango font desc like "Tajawal ExtraBold 56" mis-parses (family "Tajawal" + weight) and silently falls back to DejaVu — use `font_family="Tajawal ExtraBold" size="56pt"` span attrs instead. Cairo registered as family "Cairo", so `font="Cairo ExtraBold 56"` works.
- Fonts installed to `~/.fonts` + `fc-cache -f`; regeneration script lives in the scripts workspace package.
- Display `<img>` width = intrinsic px / 2; verify rendered PNGs visually (read the image files) — font fallback failures are silent.
