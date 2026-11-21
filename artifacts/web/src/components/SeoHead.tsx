import { useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import seoConfig from "../../seo.config.json";
import serviceContent from "../pages/serviceLandingContent.json";
import informationContent from "../pages/informationPagesContent.json";
import blogDetails from "../pages/hrBlogDetails.json";
import payrollContent from "../pages/payrollPageContent.json";
import social from "@/lib/social.json";
import homepageContent from "@/lib/data/homepageContent.json";
import { pageUrl, resolveSeoMetadata, seoMetaTags } from "@/lib/seoMetadata.mjs";

const sameAs = Object.values(social as Record<string, string>).filter((u) => /^https:\/\//.test(u));

export type SeoPageKey = keyof typeof seoConfig.pages;

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = url;
}

function removeCanonical() {
  document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.remove();
}

function removeMeta(attribute: "name" | "property", key: string) {
  document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)?.remove();
}

function buildStructuredData(pageKey: SeoPageKey, language: "en" | "ar") {
  // Pages with a fixed language (e.g. the English blog twins) only carry that language's copy.
  type Copy = { title: string; description: string; heading: string; summary: string };
  type Cfg = { path: string; type: string; parent?: string; ar?: Copy; en?: Copy; hubItems?: { key: string; ar: { title: string }; en: { title: string } }[] };
  const cfgPages = seoConfig.pages as unknown as Record<string, Cfg>;
  const page = cfgPages[pageKey]!;
  const copy = (page[language] ?? page.ar ?? page.en)!;
  const url = pageUrl(seoConfig, pageKey);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${seoConfig.site.url}/#organization`,
      name: seoConfig.site.name,
      alternateName: seoConfig.site.nameArabic,
      url: seoConfig.site.url,
      logo: `${seoConfig.site.url}/favicon.png`,
      email: seoConfig.site.email,
      ...(sameAs.length ? { sameAs } : {}),
      areaServed: {
        "@type": "Country",
        name: "Saudi Arabia"
      },
      knowsLanguage: ["ar", "en"]
    },
    {
      "@type": "WebSite",
      "@id": `${seoConfig.site.url}/#website`,
      url: seoConfig.site.url,
      name: seoConfig.site.name,
      alternateName: seoConfig.site.nameArabic,
      publisher: { "@id": `${seoConfig.site.url}/#organization` },
      inLanguage: ["ar", "en"]
    },
    {
      "@type": page.type,
      "@id": `${url}#webpage`,
      url,
      name: copy.title,
      headline: copy.heading,
      description: copy.description,
      isPartOf: { "@id": `${seoConfig.site.url}/#website` },
      about: { "@id": `${seoConfig.site.url}/#organization` },
      inLanguage: language
    }
  ];
  if (pageKey === "home" && language === "ar") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: homepageContent.faq.map(({ question, answer }) => ({
        "@type": "Question", name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }
  if (pageKey === "faq" || pageKey === "faqEnglish") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: informationContent.faq[language].faqs.map(f => ({
        "@type": "Question", name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  if (pageKey === "blogArticle" || pageKey === "nizamyAppArticle") {
    graph[2]!.image = `${seoConfig.site.url}/images/${pageKey === "blogArticle" ? "saudi-hr-editorial.webp" : "attendance-app-screen.webp"}`;
    graph[2]!.author = { "@id": `${seoConfig.site.url}/#organization` };
    graph[2]!.publisher = { "@id": `${seoConfig.site.url}/#organization` };
  }
  if (pageKey === "attendanceService") {
    graph[2]!.image = `${seoConfig.site.url}/images/face-id-checkin.png`;
  }

  if (pageKey === "aiHrService" || pageKey === "employeeRewardsService") {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: copy.heading,
      description: copy.description,
      url,
      serviceType: copy.heading,
      provider: { "@id": `${seoConfig.site.url}/#organization` },
      areaServed: { "@type": "Country", name: "Saudi Arabia" }
    });
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: serviceContent[pageKey][language].faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    });
  }

  const parentKey = (page as { parent?: string }).parent as SeoPageKey | undefined;
  if (parentKey?.startsWith("hrBlog")) {
    const details = (blogDetails as Record<string, Record<"ar" | "en", { updated?: string; faqs: { q: string; a: string }[] }>>)[page.path.split("/").pop()!]?.[language];
    if (details) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: details.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
      });
    }
    if (details?.updated) { graph[2]!.datePublished = details.updated; graph[2]!.dateModified = details.updated; }
    graph[2]!.image = `${seoConfig.site.url}/opengraph.jpg`;
    graph[2]!.author = { "@id": `${seoConfig.site.url}/#organization` };
    graph[2]!.publisher = { "@id": `${seoConfig.site.url}/#organization` };
  }
  if (pageKey === "payrollInputsService") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: payrollContent[language].faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
    });
  }
  if (pageKey === "hrBlog" || pageKey === "hrBlogEn") {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#articles`,
      itemListElement: (page.hubItems ?? []).map((item, index) => ({
        "@type": "ListItem", position: index + 1,
        name: item[language].title,
        url: pageUrl(seoConfig, item.key)
      }))
    });
  }
  if (pageKey !== "home" && pageKey !== "notFound") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: language === "ar" ? "الرئيسية" : "Home",
          item: `${seoConfig.site.url}/`
        },
        ...(parentKey ? [{
          "@type": "ListItem",
          position: 2,
          name: (cfgPages[parentKey]![language] ?? cfgPages[parentKey]!.ar ?? cfgPages[parentKey]!.en)!.heading,
          item: pageUrl(seoConfig, parentKey)
        }] : []),
        {
          "@type": "ListItem",
          position: parentKey ? 3 : 2,
          name: copy.heading,
          item: url
        }
      ]
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

export function SeoHead({ page, languageOverride }: { page: SeoPageKey; languageOverride?: "ar" | "en" }) {
  const { language: contextLanguage } = useLanguage();
  const language = languageOverride ?? contextLanguage;

  useEffect(() => {
    const meta = resolveSeoMetadata(seoConfig, page, language);
    document.title = meta.title;
    document.documentElement.lang = meta.language;
    document.documentElement.dir = meta.language === "ar" ? "rtl" : "ltr";
    for (const [attribute, key, value] of seoMetaTags(meta)) upsertMeta(attribute, key, value);
    document.head.querySelectorAll("link[data-nizamy-alternate]").forEach(link => link.remove());
    for (const alternate of meta.alternates) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = alternate.language;
      link.href = alternate.url;
      link.dataset.nizamyAlternate = "";
      document.head.appendChild(link);
    }
    upsertMeta("name", "author", seoConfig.site.name);
    let script = document.head.querySelector<HTMLScriptElement>("#nizamy-structured-data");
    if (page === "notFound") {
      removeCanonical();
      removeMeta("property", "og:url");
      script?.remove();
    } else {
      upsertCanonical(meta.canonical!);
      if (!script) {
        script = document.createElement("script");
        script.id = "nizamy-structured-data";
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(buildStructuredData(page, meta.language));
    }
  }, [language, page]);

  return null;
}