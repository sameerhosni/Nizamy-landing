import { useLanguage } from "@/lib/i18n";
import { MapPin, Languages, CalendarClock, Building2 } from "lucide-react";

const icons = [MapPin, Languages, CalendarClock, Building2];

const content = {
  en: {
    title: "Built for the Saudi work environment",
    points: [
      {
        name: "Designed for Saudi workplaces",
        desc: "Built around how Saudi companies actually work, day to day.",
      },
      {
        name: "Understands Saudi Arabic",
        desc: "Employees and managers get answers in their own dialect.",
      },
      {
        name: "Supports daily HR operations",
        desc: "Attendance, requests, and approvals handled every day, not just reports.",
      },
      {
        name: "Fits small & growing businesses",
        desc: "Starts simple and scales with your team — no heavy setup.",
      },
    ],
  },
  ar: {
    title: "مصمم لبيئة العمل السعودية",
    points: [
      {
        name: "مصمم للشركات السعودية",
        desc: "مبني على طريقة عمل الشركات السعودية الفعلية، يوماً بيوم.",
      },
      {
        name: "يفهم اللهجة السعودية",
        desc: "الموظفون والمدراء يحصلون على إجابات بلهجتهم.",
      },
      {
        name: "يدعم عمليات الموارد البشرية اليومية",
        desc: "الحضور والطلبات والموافقات تُنجز كل يوم، وليست مجرد تقارير.",
      },
      {
        name: "مناسب للمنشآت الصغيرة والنامية",
        desc: "يبدأ بسيطاً وينمو مع فريقك — دون إعدادات معقدة.",
      },
    ],
  },
};

export function TrustBar() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl md:text-3xl font-heading font-black text-slate-900 mb-10">
          {t.title}
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.points.map((point, idx) => {
            const Icon = icons[idx];
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center rounded-2xl border border-slate-100 bg-slate-50/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-200"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <p className="font-heading font-black text-slate-900 text-sm mb-1.5">{point.name}</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{point.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
