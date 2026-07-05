import { RefreshCw, Bot, ScanFace, X, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const icons = [RefreshCw, ScanFace, Bot];

const content = {
  en: {
    eyebrow: "Why teams switch to Mr-Hr",
    title: "Same category. A different league.",
    subtitle: "Every HR system in Saudi tracks attendance and answers employee requests. Here's exactly where Mr-Hr pulls ahead.",
    otherLabel: "Traditional HR systems",
    mrhrLabel: "Mr-Hr",
    items: [
      {
        name: "The return",
        others: "A monthly bill. Nothing comes back, no matter how well your team performs.",
        mrhr: "Up to 30% of your subscription returned every year — the better your team performs, the more you get back.",
      },
      {
        name: "Attendance verification",
        others: "One fingerprint device at the door. Miss it, and you're stuck with manual correction requests.",
        mrhr: "Face, fingerprint, GPS, and voice — employees check in the way that fits them, anywhere, with zero manual reconciliation.",
      },
      {
        name: "AI self-service",
        others: "A basic request form or a generic chatbot that still routes most things back to HR.",
        mrhr: "A Saudi-dialect AI agent that resolves payslip questions, documents, and policies instantly — around the clock, no queue.",
      },
    ],
  },
  ar: {
    eyebrow: "لماذا تنتقل الشركات إلى مستر إتش آر",
    title: "نفس الفئة. مستوى مختلف تماماً.",
    subtitle: "كل نظام موارد بشرية في السعودية يسجّل الحضور ويرد على طلبات الموظفين. إليك بالضبط أين يتفوق مستر إتش آر.",
    otherLabel: "أنظمة الموارد البشرية التقليدية",
    mrhrLabel: "مستر إتش آر",
    items: [
      {
        name: "العائد",
        others: "فاتورة شهرية. لا يعود إليك شيء مهما كان أداء فريقك.",
        mrhr: "حتى ٣٠٪ من اشتراكك يعود إليك كل عام — كلما تحسّن أداء فريقك، زاد ما تسترده.",
      },
      {
        name: "التحقق من الحضور",
        others: "جهاز بصمة واحد عند الباب. إن فاتك، تعلق في طلبات تصحيح يدوية.",
        mrhr: "وجه، بصمة، موقع جغرافي، وصوت — يسجّل الموظف حضوره بالطريقة التي تناسبه، من أي مكان، دون أي مطابقة يدوية.",
      },
      {
        name: "الخدمة الذاتية بالذكاء الاصطناعي",
        others: "نموذج طلب بسيط أو روبوت محادثة عام يُحيل معظم الطلبات إلى الموارد البشرية على أي حال.",
        mrhr: "وكيل ذكاء اصطناعي باللهجة السعودية يحل استفسارات الرواتب والمستندات والسياسات فوراً — على مدار الساعة، دون طابور انتظار.",
      },
    ],
  },
};

export function CompetitiveEdge() {
  const { language, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const t = content[language];

  return (
    <section className="py-24 bg-[#F8F9FE] border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-accent px-3 py-1 rounded-full mb-4">
            {t.eyebrow}
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">{t.title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {t.items.map((item, idx) => {
            const Icon = icons[idx];
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/50 bg-white shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-3 px-6 md:px-8 pt-6">
                  <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">{item.name}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-px bg-border/50 mt-6">
                  <div className="bg-white p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-muted-foreground/10 flex items-center justify-center shrink-0">
                        <X size={12} className="text-muted-foreground" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {t.otherLabel}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.others}</p>
                  </div>

                  <div className="bg-gradient-to-br from-primary/5 to-accent/30 p-6 md:p-8 relative">
                    <div className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} w-1 h-full bg-primary`} />
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                        {t.mrhrLabel}
                      </span>
                    </div>
                    <p className="text-foreground font-medium leading-relaxed">{item.mrhr}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
