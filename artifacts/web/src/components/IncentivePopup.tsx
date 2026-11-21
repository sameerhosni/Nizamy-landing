import { useEffect, useRef, useState } from "react";
import { Gift } from "lucide-react";
import { HubSpotForm } from "@/components/HubSpotForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n";
import { hasSeenWelcome, markWelcomeSeen } from "@/lib/welcomePopup";

export function IncentivePopup() {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";
  const [isOpen, setIsOpen] = useState(() => !isAr || !hasSeenWelcome());
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!isAr) setIsOpen(true);
  }, [language]);

  useEffect(() => {
    if (!isOpen || hasTrackedView.current) return;
    if (isAr) markWelcomeSeen();
    track("incentive_popup_viewed", { language, variant: "full" });
    hasTrackedView.current = true;
  }, [language, isOpen, isAr]);

  const copy = {
    badge: isAr ? "نظامي" : "Welcome Gift",
    titleHighlight: isAr ? "" : "5,000",
    titleRest: isAr ? "أهلًا فيك في نظامي" : "Free Loyalty Points",
    description: isAr
      ? "HR يشتغل عنك: حضور، طلبات، تقارير، ومكافآت — في تطبيق واحد."
      : "Download the Nizamy app and register your company to receive this gift.",
    formHeading: isAr
      ? "عندك سؤال؟ اكتب لنا هنا"
      : "For inquiries, contact us using the form below",
    formError: isAr
      ? "ما قدرنا نرسل النموذج. تأكد من اتصالك وجرّب مرة ثانية."
      : "The form could not be submitted. Check your connection and try again.",
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      track("incentive_popup_cancelled", { language, variant: "full" });
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[calc(100dvh-1rem)] max-w-[calc(100%_-_1rem)] overflow-y-auto rounded-3xl border-sky-100/80 bg-background p-4 shadow-[0_28px_90px_-28px_rgba(15,23,42,0.5)] [scrollbar-width:none] before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-sky-400 before:via-blue-500 before:to-cyan-400 [&::-webkit-scrollbar]:hidden sm:max-w-lg sm:p-6"
        dir={dir}
        data-testid="incentive-popup"
        data-variant="full"
      >
        <div className="space-y-2 sm:space-y-4">
          <DialogHeader className={`flex flex-col pe-6 ${isAr ? "text-right sm:text-right" : "text-left sm:text-left"}`}>
            <div className={`mb-1.5 inline-flex items-center gap-1.5 self-start rounded-full bg-sky-50 px-2.5 py-1 border border-sky-100/50 ${isAr ? "mr-7" : ""}`}>
              <Gift className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
              <span className="text-xs font-bold tracking-wide text-sky-800 uppercase">
                {copy.badge}
              </span>
            </div>

            <DialogTitle
              className="font-heading text-2xl sm:text-[26px] font-extrabold text-slate-900 leading-tight mb-1"
              data-testid="incentive-title"
            >
              <span className="text-sky-600">{copy.titleHighlight}</span> {copy.titleRest}
            </DialogTitle>

            <DialogDescription
              className="text-[14px] sm:text-[15px] font-medium text-slate-600 leading-snug"
              data-testid="incentive-desc"
            >
              {copy.description}
            </DialogDescription>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
              <p className="text-[13px] sm:text-sm font-semibold text-slate-800">
                {copy.formHeading}
              </p>
            </div>
          </DialogHeader>

          <HubSpotForm
            includeSector
            locale={language}
            errorMessage={copy.formError}
            onClose={() => handleOpenChange(false)}
            onSubmitted={() => {
              track("incentive_popup_submitted", { language });
            }}
            testId="hubspot-incentive-form"
            copyOverrides={isAr ? { submit: "ابدأ مجانًا", close: "مو الحين" } : undefined}
            closeAsText={isAr}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
