import { useLanguage } from "@/lib/i18n";
import { Check, X } from "lucide-react";

export function Problem() {
  const { language } = useLanguage();

  const content = {
    en: {
      eyebrow: "The old way vs. the new way",
      headingPart1: "Every other HR system costs you.",
      headingPart2: "Nizamy\u00A0HR pays you back.",
      subhead: "Same monthly fee. Completely different math. One drains your budget every year — the other grows with your team.",
      legacy: {
        tag: "The old way",
        title: "A pure cost",
        points: [
          "Pay every month, get nothing back",
          "Penalties and deductions that demotivate",
          "Chase employees to use it",
          "Time wasted on manual admin",
        ],
      },
      nizamy: {
        tag: "The Nizamy HR way",
        title: "A source of return",
        points: [
          "Return that grows with your team's performance",
          "Rewards and motivation — not punishment",
          "Employees engage automatically",
          "Time saved is money earned",
        ],
      },
    },
    ar: {
      eyebrow: "الطريقة القديمة مقابل الطريقة الجديدة",
      headingPart1: "كل أنظمة الموارد البشرية الأخرى تُكلّفك.",
      headingPart2: "نظامي\u00A0اتش\u00A0آر يعيد لك.",
      subhead: "نفس الرسوم الشهرية. حسبة مختلفة تماماً. أحدهما يستنزف ميزانيتك كل عام — والآخر ينمو مع فريقك.",
      legacy: {
        tag: "الطريقة القديمة",
        title: "تكلفة بحتة",
        points: [
          "تدفع كل شهر ولا يعود إليك شيء",
          "غرامات وخصومات تُحبط الموظفين",
          "تلاحق الموظفين لاستخدام النظام",
          "إهدار الوقت في المتابعة اليدوية",
        ],
      },
      nizamy: {
        tag: "طريقة نظامي اتش آر",
        title: "مصدر عائد",
        points: [
          "عائد يكبر مع أداء فريقك",
          "مكافآت وتحفيز بدل العقوبات",
          "تفاعل تلقائي من الموظفين",
          "الوقت الموفّر هو مال مكتسب",
        ],
      },
    },
  };

  const t = content[language];

  return (
    <section id="problem" className="py-24 sm:py-32 bg-white scroll-mt-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6 tracking-wider uppercase">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-[1.1] mb-6">
            <span className="text-slate-900">{t.headingPart1}</span>
            <br />
            <span className="text-blue-600">{t.headingPart2}</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
            {t.subhead}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Old way — muted */}
          <div className="rounded-3xl bg-slate-50 border border-slate-100 p-8 sm:p-10 flex flex-col">
            <span className="inline-block self-start text-xs font-bold text-slate-400 bg-white border border-slate-200 rounded-full px-3 py-1 mb-8">
              {t.legacy.tag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-400 mb-8">
              {t.legacy.title}
            </h3>
            <ul className="space-y-5 flex-1">
              {t.legacy.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 rtl:flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={14} className="text-slate-400" strokeWidth={2.5} />
                  </div>
                  <span className="text-slate-400 font-medium leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nizamy way — elevated */}
          <div
            className="rounded-3xl bg-white border-2 border-blue-500 p-8 sm:p-10 flex flex-col relative"
            style={{ boxShadow: "0 24px 60px -12px rgba(37, 99, 235, 0.2), 0 0 0 1px rgba(37,99,235,0.1)" }}
          >
            <span className="inline-block self-start text-xs font-bold text-white bg-blue-600 rounded-full px-3 py-1 mb-8">
              {t.nizamy.tag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-blue-600 mb-8">
              {t.nizamy.title}
            </h3>
            <ul className="space-y-5 flex-1">
              {t.nizamy.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 rtl:flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={14} className="text-blue-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-slate-800 font-semibold leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
