import { useLanguage } from "@/lib/i18n";
import { Clock, MessageSquare, EyeOff, Users } from "lucide-react";

const icons = [Clock, MessageSquare, EyeOff, Users];

export function Problem() {
  const { language } = useLanguage();

  const content = {
    en: {
      eyebrow: "The real cost of manual HR",
      heading: "Your team runs on WhatsApp, spreadsheets, and guesswork.",
      subhead: "Before you can think about performance, you're buried in attendance logs, leave requests, and chasing approvals — manually.",
      pains: [
        { title: "Hours lost every week", desc: "Manual attendance reports eat 4–6 hours of HR time that could go anywhere else." },
        { title: "Approvals live on WhatsApp", desc: "Leave requests, shift changes, early exits — no record, no history, no accountability." },
        { title: "Zero visibility into performance", desc: "No way to know who's actually delivering without running a report yourself." },
        { title: "HR is the middleman for everything", desc: "Employees can't do anything without going through HR first — every small request is a task." },
      ],
    },
    ar: {
      eyebrow: "التكلفة الحقيقية للموارد البشرية اليدوية",
      heading: "فريقك يعمل بالواتساب والجداول والتخمين.",
      subhead: "قبل أن تفكر في الأداء، أنت تغرق في سجلات الحضور وطلبات الإجازات ومتابعة الموافقات — يدوياً.",
      pains: [
        { title: "ساعات تُهدر كل أسبوع", desc: "تقارير الحضور اليدوية تأكل 4–6 ساعات من وقت الموارد البشرية كل أسبوع." },
        { title: "الموافقات تعيش على الواتساب", desc: "طلبات الإجازة وتبديل الشفتات والمغادرة المبكرة — لا سجل، لا تاريخ، لا محاسبة." },
        { title: "لا رؤية فعلية للأداء", desc: "لا طريقة لمعرفة من يؤدي فعلاً — إلا بإعداد تقرير بنفسك." },
        { title: "الموارد البشرية وسيطة في كل شيء", desc: "الموظفون لا يستطيعون إتمام أي طلب دون المرور بالموارد البشرية — كل طلب صغير يصبح مهمة." },
      ],
    },
  };

  const t = content[language];

  return (
    <section id="problem" className="py-24 sm:py-32 bg-white scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <span className="inline-block text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-6 tracking-wider uppercase">
            {t.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-[1.1] mb-6 text-slate-900">
            {t.heading}
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
            {t.subhead}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          {t.pains.map((pain, idx) => {
            const Icon = icons[idx];
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-50 border border-slate-100 p-7 sm:p-8 flex gap-5 rtl:flex-row-reverse group hover:border-slate-200 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:border-slate-300 transition-colors">
                  <Icon size={20} className="text-slate-400" />
                </div>
                <div className="rtl:text-right">
                  <h3 className="text-base font-heading font-black text-slate-900 mb-1.5">{pain.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{pain.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
