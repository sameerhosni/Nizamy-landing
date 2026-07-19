import { useLanguage } from "@/lib/i18n";
import { Clock, MessageSquare, EyeOff, Users } from "lucide-react";

const icons = [Clock, MessageSquare, EyeOff, Users];

export function Problem() {
  const { language } = useLanguage();

  const content = {
    en: {
      eyebrow: "The real cost of chaos",
      heading: "You're not running your business… you're managing the chaos.",
      subhead: "Every morning starts with follow-ups. Who was late today? Why wasn't the project finished? Where did the team's time go? You make decisions based on impressions — and fix problems after it's too late. The result: silent daily waste eating your profits, invisibly.",
      pains: [
        { title: "No real-time visibility", desc: "You don't know how your team is performing until month-end — by then the losses have already compounded." },
        { title: "Decisions based on gut, not data", desc: "You judge commitment and achievement through impressions — not through actual numbers." },
        { title: "Exhausting follow-up, no real improvement", desc: "Hours spent checking and chasing — with no meaningful change in productivity to show for it." },
        { title: "Silent waste keeps growing", desc: "Daily tardiness, stuck tasks, meetings with no outcomes — quiet costs that drain your profits." },
      ],
    },
    ar: {
      eyebrow: "التكلفة الحقيقية للفوضى",
      heading: "أنت لا تدير شركتك… أنت تدير الفوضى.",
      subhead: "كل صباح تبدأ بالمتابعة. مَن تأخر اليوم؟ لماذا لم يُنجز المشروع؟ أين ذهب وقت الفريق؟ تصدر قراراتك بناءً على انطباعات، وتصحح المشكلات بعد فوات الأوان. المحصلة: هدر يومي صامت يأكل أرباحك، وأنت لا تراه.",
      pains: [
        { title: "غياب الرؤية اللحظية", desc: "لا تعرف أداء فريقك إلا بعد نهاية الشهر، وحينها تكون الخسائر قد تراكمت." },
        { title: "قرارات مبنية على الحدس", desc: "تحكم على الالتزام والإنجاز من خلال الانطباعات، لا من خلال الأرقام." },
        { title: "متابعة مرهقة بلا نتيجة", desc: "تقضي ساعات في التدقيق والمحاسبة، دون تحسن حقيقي في الإنتاجية." },
        { title: "الهدر الخفي يتضخم", desc: "تأخيرات يومية، مهام عالقة، واجتماعات بلا مخرجات… تكاليف صامتة تستنزف أرباحك." },
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
