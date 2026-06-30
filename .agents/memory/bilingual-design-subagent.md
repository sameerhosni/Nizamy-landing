---
name: Bilingual i18n after design-subagent restyles
description: Why to audit DESIGN-subagent output for hardcoded English in bilingual (EN/AR) artifacts
---

When the DESIGN subagent restyles a bilingual page, it tends to inject NEW decorative/microcopy strings (badges, mockup labels, stat captions) as hardcoded English literals or partial `lang === 'en' ? ... : ...` ternaries instead of routing them through the existing i18n content object.

**Why:** A pure-visual restyle brief focuses the subagent on look, not translation coverage, so freshly-invented hero/mockup text silently breaks the EN/AR requirement and only shows up under the Arabic toggle.

**How to apply:** After any design-subagent restyle of a bilingual artifact, grep the changed components for raw quoted English and inline `=== 'en'` ternaries; move all of it into the per-language content object (e.g. a `mockup` block) so it localizes. The Mr-Hr i18n toggles language via a Navbar button + useState, NOT a URL query param — `?lang=ar` does nothing, so screenshots can't verify Arabic; trust the `content[language]` wiring instead.
