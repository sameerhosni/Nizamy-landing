# Metadata and social templates

`seo.config.json` is the editable page catalog. `src/lib/seoMetadata.mjs`
resolves it for both the live React head and crawler-facing HTML. Do not add
independent social-field defaults to components or prerendering.

## Required page fields

Each priority route has a stable, lowercase `path`, an indexing policy and
localized `title`, `description` and `heading` (the actual H1).
Titles, descriptions and H1s must be unique within each language.
The configured site origin supplies absolute URLs; never use preview domains,
query parameters or session values as canonical URLs.

## Shared templates

| Field | Website template | Article template |
| --- | --- | --- |
| Title tag | Unique localized title | Unique localized article title |
| Meta description | Unique localized description | Unique localized article description |
| H1 | Existing approved page headline | Article headline |
| Canonical / `og:url` | Site origin + stable path | Site origin + article slug |
| `og:title`, `og:description` | Page title and description | Article title and description |
| `og:type` | `website` | `article` |
| `og:site_name`, `og:locale` | Brand and active locale | Brand and active locale |
| `og:image`, `og:image:alt` | Configured image and localized alt | Article-specific image and localized alt |
| `twitter:card` | `summary_large_image` | `summary_large_image` |
| `twitter:title`, `twitter:description` | Page title and description | Article title and description |
| `twitter:image`, `twitter:image:alt` | Same configured image and alt | Article-specific image and alt |

Per-page `social.image` and `social.imageAlt` override the brand image.
`metadataTemplate` can explicitly choose a registered template. Article schema
types select the article template automatically; other public pages select the
website template.

## Priority coverage

Homepage, blog index, both blog articles, attendance service, AI HR service,
employee rewards, sitemap, privacy, face-data security, help, Saudi SME HR
software, pricing, Arabic FAQs and English FAQs are included in the audit.
Staff tools and unknown URLs are not public priority templates.

Arabic FAQs use `/faq/ar`; English FAQs use `/faq/en`. Each has fixed-language
content, metadata and canonical URL, with reciprocal `hreflang` links.
The legacy `/faq` permanently redirects to the Arabic version.
Both FAQ links and the privacy link remain footer-only. Face-data is a Services
menu item.

Removing draft labels does not verify missing policy, biometric or pricing
details. The confirmation notices, active-policy/offer links and indexing
restrictions remain until those details are approved.
404 responses have no canonical or social URL.

## Validation and resolved field matrix

Run the web build, then:

```sh
node artifacts/web/scripts/verify-seo-metadata.mjs
```

The audit checks unique required fields, canonical paths, all OG/Twitter tags,
one matching H1, social-image availability, language alternatives and FAQ
schema/content separation. It writes the complete resolved field matrix to
`artifacts/web/dist/seo-metadata-audit.json` for inspection.
