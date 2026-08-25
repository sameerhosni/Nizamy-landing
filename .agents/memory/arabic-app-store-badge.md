---
name: Arabic App Store badge locale
description: Correct Apple Marketing Tools locale for the official Arabic App Store badge.
---

Use the Apple Marketing Tools badge locale `ar-ar` for the official Arabic “Download on the App Store” artwork. Locales such as `ar`, `ar-sa`, `ar-ae`, and `ar-eg` can silently return the English US/UK SVG instead.

**Why:** The badge endpoint returned HTTP 200 for regional Arabic locale codes but served English artwork; the SVG title exposed the fallback. The `ar-ar` response identifies itself as the Arabic badge.

**How to apply:** When refreshing the local badge asset, use Apple’s official badge API with `ar-ar` and confirm the downloaded SVG title contains `_AR_` before shipping.