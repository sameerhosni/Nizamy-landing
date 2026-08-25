---
name: App Store mobile link testing
description: How to implement and verify Apple App Store universal links across responsive browser tests.
---

Use a normal HTTPS anchor for App Store links with the exact `apps.apple.com` URL, `target="_blank"`, and `rel="noopener"`. Do not replace it with scripted blank-window or redirect-bridge workarounds solely to satisfy mobile browser automation.

**Why:** Mobile emulation can hand Apple universal links toward the operating system rather than emit a conventional browser popup. Forced `window.open` approaches produced blank tabs while the standards-based anchor remained correctly hit-testable and uncancelled.

**How to apply:** Verify the exact href, target, rel, tap-target dimensions, center hit-testing, and that click handling does not prevent the default action. Use a real mobile-device check if browser-versus-App-Store handoff behavior itself must be validated.