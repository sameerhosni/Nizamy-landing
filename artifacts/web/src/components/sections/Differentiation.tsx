import { Receipt, HeartHandshake, X, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const content = {
  en: {
    eyebrow: "Not a competitor. A different game.",
    title: "Every other system sells you software. We share the outcome.",
    subtitle: "Most HR vendors get paid whether your team grows or not — their revenue has nothing to do with your results. Mr-Hr only wins when you do. That's not a better version of the same thing. It's a different relationship entirely.",
    oldLabel: "The vendor model",
    newLabel: "The partner model",
    oldFooter: "Success is your problem, not theirs.",
    newFooter: "Your growth is our business model.",
    oldPoints: [
      "Charges the same fee whether your team performs or not.",
      "Attendance means policing a device at the door.",
      "\u201cSelf-service\u201d still lands most requests back on HR's desk.",
    ],
    newPoints: [
      "Up to 30% of your subscription comes back — your performance is literally our revenue model.",
      "Face, fingerprint, GPS, and voice — attendance that removes friction instead of adding rules.",
      "A Saudi-dialect AI agent resolves things instantly, so nothing is left to slow performance down.",
    ],
    closing: "We're not racing to win a feature war. We're racing to win alongside you.",
  },
  ar: {
    eyebrow: "لسنا منافسين. نحن نلعب لعبة مختلفة.",
    title: "كل نظام آخر يبيعك برنامجاً. نحن نشاركك النتيجة.",
    subtitle: "معظم مزوّدي أنظمة الموارد البشرية يتقاضون أجرهم سواء نما فريقك أم لا — إيراداتهم لا علاقة لها بنتائجك. مستر إتش آر لا يربح إلا حين تربح أنت. هذه ليست نسخة أفضل من الشيء نفسه، بل علاقة مختلفة تماماً.",
    oldLabel: "نموذج المزوّد التقليدي",
    newLabel: "نموذج الشراكة",
    oldFooter: "نجاحك مشكلتك أنت، لا مشكلتهم.",
    newFooter: "نموّك هو نموذج عملنا.",
    oldPoints: [
      "يتقاضى نفس الرسوم سواء أدى فريقك أم لا.",
      "الحضور يعني مراقبة جهاز عند الباب.",
      "\u201cالخدمة الذاتية\u201d غالباً ما تنتهي بطلب يصل إلى مكتب الموارد البشرية على أي حال.",
    ],
    newPoints: [
      "حتى ٣٠٪ من اشتراكك يعود إليك — لأن أداءك هو نموذج إيراداتنا فعلياً.",
      "وجه، بصمة، موقع جغرافي، وصوت — حضور يزيل الاحتكاك بدلاً من فرض القيود.",
      "وكيل ذكاء اصطناعي باللهجة السعودية يحل الأمور فوراً، فلا يتبقى ما يُبطئ الأداء.",
    ],
    closing: "لسنا في سباق مزايا مع أحد. نحن نسعى للفوز إلى جانبك.",
  },
};

export function Differentiation() {
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

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-2xl border border-border/50 bg-white p-8 md:p-10 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-muted-foreground/10 flex items-center justify-center shrink-0">
                <Receipt size={20} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-muted-foreground">{t.oldLabel}</h3>
            </div>
            <ul className="space-y-4 flex-1">
              {t.oldPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-muted-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={12} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
            <p className="text-sm font-medium text-muted-foreground mt-8 pt-6 border-t border-border/50">
              {t.oldFooter}
            </p>
          </div>

          <div className="relative rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/40 p-8 md:p-10 flex flex-col overflow-hidden">
            <div className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} w-40 h-40 blur-[70px] rounded-full opacity-20 bg-primary`} />
            <div className="relative flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                <HeartHandshake size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground">{t.newLabel}</h3>
            </div>
            <ul className="relative space-y-4 flex-1">
              {t.newPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-primary" />
                  </div>
                  <p className="text-foreground font-medium leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
            <p className="relative text-sm font-semibold text-primary mt-8 pt-6 border-t border-primary/20">
              {t.newFooter}
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground font-medium mt-10 max-w-xl mx-auto leading-relaxed">
          {t.closing}
        </p>
      </div>
    </section>
  );
}
