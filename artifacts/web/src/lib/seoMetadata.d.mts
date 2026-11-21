export interface SeoMetadata {
  pageKey: string; language: "ar" | "en"; template: string; path: string;
  canonical: string | null; title: string; description: string; h1: string; robots: string;
  alternates: { language: string; url: string }[];
  openGraph: { title: string; description: string; type: string; url: string | null; image: string; imageAlt: string; siteName: string; locale: string };
  twitter: { card: string; title: string; description: string; image: string; imageAlt: string };
}
interface MetadataConfig {
  site: { name: string; url: string; image: string; imageAlt: { ar: string; en: string } };
  metadataTemplates: Record<string, { ogType: string; twitterCard: string }>;
  pages: Record<string, {
    path: string; type: string; robots: string; metadataTemplate?: string; language?: string;
    /** Optional URL prefix when the app is served under a sub-path (e.g. "/ai-position"). */
    urlPrefix?: string;
    languageAlternates?: Record<string, string>;
    social?: { image: string; imageAlt: { ar: string; en: string } };
    // Pages with a fixed language only carry that language's copy.
    ar?: { title: string; description: string; heading: string };
    en?: { title: string; description: string; heading: string };
  }>;
}
export function resolveSeoMetadata(config: MetadataConfig, pageKey: string, language?: "ar" | "en"): SeoMetadata;
export function seoMetaTags(meta: SeoMetadata): ["name" | "property", string, string][];
export function pageUrl(config: MetadataConfig, key: string): string;
