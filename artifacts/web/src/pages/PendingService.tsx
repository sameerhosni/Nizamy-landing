import { SeoHead } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { useLanguage } from "@/lib/i18n";

const titles = {
  reports: { ar: "التقارير", en: "Reports" },
};
const pages = { reports: "reportsService" } as const;

/** Temporary, deliberately unindexed pages until the service copy is supplied. */
export function PendingService({ service }: { service: keyof typeof titles }) {
  const { language, dir } = useLanguage();
  const title = titles[service][language];
  return (
    <div dir={dir} className="min-h-screen bg-slate-50">
      <SeoHead page={pages[service]} />
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-44 text-center">
        <h1 className="font-heading text-4xl font-black text-slate-900">{title}</h1>
        <p className="mt-6 text-lg text-slate-600">
          {language === "ar" ? "تفاصيل هذه الخدمة قريبًا." : "Details about this service are coming soon."}
        </p>
        <a className="mt-8 inline-block font-bold text-blue-600 hover:underline" href={import.meta.env.BASE_URL}>
          {language === "ar" ? "العودة للرئيسية" : "Back to home"}
        </a>
      </main>
    </div>
  );
}
