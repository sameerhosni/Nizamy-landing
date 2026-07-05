import { HeartHandshake } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const content = {
  en: {
    quote2: "We just built it so we only do well when you do.",
    footnote: "No fine print. Your team's growth genuinely benefits us too — that's the whole idea.",
  },
  ar: {
    quote2: "لا نستفيد إلا حين تستفيد أنت.",
    footnote: "بدون شروط خفية. نمو فريقك يفيدنا نحن أيضاً بشكل حقيقي — هذه هي الفكرة كلها.",
  },
};

export function Differentiation() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent text-primary flex items-center justify-center mx-auto mb-8">
            <HeartHandshake size={22} />
          </div>

          <p className="text-2xl md:text-3xl font-bold leading-snug text-gradient-primary mb-8">
            {t.quote2}
          </p>

          <p className="text-muted-foreground leading-relaxed">
            {t.footnote}
          </p>
        </div>
      </div>
    </section>
  );
}
