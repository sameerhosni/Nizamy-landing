import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { useCreateIncentiveSignup } from "@workspace/api-client-react";
import { track } from "@/lib/analytics";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gift, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const HIDE_KEY = "nizamy_incentive_hidden";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }
};

function toLatinDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (digit) =>
      String(digit.charCodeAt(0) - "٠".charCodeAt(0)),
    )
    .replace(/[۰-۹]/g, (digit) =>
      String(digit.charCodeAt(0) - "۰".charCodeAt(0)),
    );
}

function normalizeSaudiMobile(value: string): string | null {
  const trimmed = value.trim();
  const plusCount = (trimmed.match(/\+/g) ?? []).length;

  if (
    !/^[+()\-\s0-9٠-٩۰-۹]+$/.test(trimmed) ||
    plusCount > 1 ||
    (plusCount === 1 && !trimmed.startsWith("+"))
  ) {
    return null;
  }

  let digits = toLatinDigits(trimmed).replace(/\D/g, "");

  if (digits.startsWith("00966")) {
    digits = digits.slice(5);
  } else if (digits.startsWith("966")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return /^5\d{8}$/.test(digits) ? `+966${digits}` : null;
}

function normalizeContact(value: string) {
  const trimmed = value.trim();

  if (EMAIL_PATTERN.test(trimmed)) {
    return { email: trimmed.toLowerCase(), mobile: null };
  }

  return { email: null, mobile: normalizeSaudiMobile(trimmed) };
}

const formSchema = z
  .object({
    intent: z.enum(["existing_hr", "seeking_hr", "exploring"], {
      required_error: "INTENT_REQUIRED",
    }),
    contact: z.string().min(1, { message: "CONTACT_REQUIRED" }),
  })
  .superRefine((data, ctx) => {
    const normalized = normalizeContact(data.contact);

    if (data.contact && !normalized.email && !normalized.mobile) {
      ctx.addIssue({
        path: ["contact"],
        code: z.ZodIssueCode.custom,
        message: "CONTACT_INVALID",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

function LocalizedFormMessage({
  message,
  testId,
}: {
  message?: string;
  testId: string;
}) {
  const { formMessageId } = useFormField();

  if (!message) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      className="text-[0.8rem] font-medium text-destructive"
      data-testid={testId}
    >
      {message}
    </p>
  );
}

export function IncentivePopup() {
  const { language, dir } = useLanguage();
  const isAr = language === "ar";
  
  const [isOpen, setIsOpen] = useState(false);
  const [resultState, setResultState] = useState<"none" | "awarded" | "already_claimed" | "error">("none");
  const hasTrackedView = useRef(false);
  const languageRef = useRef(language);

  // Keep ref up to date for the timeout without re-triggering it
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const { mutate: createSignup, isPending } = useCreateIncentiveSignup();

  useEffect(() => {
    if (safeStorage.getItem(HIDE_KEY)) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      if (!hasTrackedView.current) {
        track("incentive_popup_viewed", { language: languageRef.current });
        hasTrackedView.current = true;
      }
    }, 5000); // 5 second delay

    return () => clearTimeout(timer);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact: "",
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) {
      // User is closing it (cancel or after completion)
      if (resultState === "none" || resultState === "error") {
        track("incentive_popup_cancelled", { language });
        safeStorage.setItem(HIDE_KEY, "true");
      }
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const onSubmit = (values: FormValues) => {
    track("incentive_popup_submitted", { intent: values.intent, language });

    const contact = normalizeContact(values.contact);
    
    createSignup(
      {
        data: {
          intent: values.intent,
          email: contact.email,
          mobile: contact.mobile,
          language,
        },
      },
      {
        onSuccess: (res) => {
          setResultState(res.status);
          if (res.status === "awarded") {
            track("incentive_popup_awarded", { language });
          } else {
            track("incentive_popup_duplicate", { language });
          }
          // Hide permanently
          safeStorage.setItem(HIDE_KEY, "true");
        },
        onError: () => {
          setResultState("error");
          track("incentive_popup_error", { language });
        }
      }
    );
  };

  const onInvalidSubmit = () => {
    track("incentive_popup_validation_failed", { language });
  };

  const t = {
    title: isAr ? "هدية خاصة لزوارنا" : "A Special Gift For You",
    desc: isAr 
      ? "احصل على نقاط ولاء إضافية عند انضمامك إلينا مستقبلاً. سجل اهتمامك الآن."
      : "Claim bonus loyalty points for when you join us. Register your interest now.",
    intentLabel: isAr ? "ما هو وضعك الحالي؟" : "What best describes you?",
    intentHr: isAr ? "أستخدم نظام موارد بشرية حالياً" : "I currently use an HR system",
    intentSeek: isAr ? "أبحث عن نظام موارد بشرية" : "I'm looking for an HR system",
    intentExplore: isAr ? "مجرد استكشاف" : "Just exploring",
    contactLabel: isAr ? "البريد الإلكتروني أو رقم الجوال" : "Email or Mobile Number",
    contactPlaceholder: isAr ? "example@domain.com أو 05XXXXXXXX" : "example@domain.com or 05XXXXXXXX",
    submit: isAr ? "المطالبة بالهدية" : "Claim Reward",
    cancel: isAr ? "لا، شكراً" : "No, thanks",
    successTitle: isAr ? "تم تسجيل الهدية!" : "Reward Claimed!",
    successDesc: isAr ? "لقد أضفنا النقاط إلى حسابك المستقبلي. شكراً لاهتمامك." : "We've attached the points to your future account. Thank you!",
    claimedTitle: isAr ? "تم تسجيلك مسبقاً" : "Already Claimed",
    claimedDesc: isAr ? "يبدو أنك قمت بالمطالبة بهذه الهدية من قبل. لا تقلق، نقاطك محفوظة." : "Looks like you've already claimed this reward. Don't worry, your points are safe.",
    errorTitle: isAr ? "حدث خطأ" : "Something went wrong",
    errorDesc: isAr ? "تعذر إكمال طلبك. يرجى المحاولة مرة أخرى لاحقاً." : "We couldn't complete your request. Please try again later.",
    errorRetry: isAr ? "حاول مرة أخرى" : "Try Again",
    close: isAr ? "إغلاق" : "Close"
  };

  const tErrors: Record<string, string> = {
    INTENT_REQUIRED: isAr ? "يرجى اختيار وضعك الحالي." : "Please select your current HR situation.",
    CONTACT_REQUIRED: isAr ? "معلومات الاتصال مطلوبة." : "Contact information is required.",
    CONTACT_INVALID: isAr ? "يجب أن يكون بريداً إلكترونياً صحيحاً أو رقم جوال سعودي (مثل 05XXXXXXXX)." : "Must be a valid email or Saudi mobile number (e.g., 05XXXXXXXX).",
  };
  const intentError = form.formState.errors.intent?.message;
  const contactError = form.formState.errors.contact?.message;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-primary/10 shadow-glow" dir={dir} data-testid="incentive-popup">
        {resultState === "none" && (
          <>
            <DialogHeader className="sm:text-left rtl:sm:text-right">
              <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary rtl:mx-0 rtl:ml-auto">
                <Gift className="w-6 h-6" />
              </div>
              <DialogTitle className="text-2xl font-bold font-heading" data-testid="incentive-title">
                {t.title}
              </DialogTitle>
              <DialogDescription className="text-base mt-2" data-testid="incentive-desc">
                {t.desc}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-6 mt-2">
                <FormField
                  control={form.control}
                  name="intent"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-semibold">{t.intentLabel}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                          className="flex flex-col space-y-1"
                          dir={dir}
                          data-testid="input-intent"
                        >
                          <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0 p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
                            <FormControl>
                              <RadioGroupItem value="existing_hr" data-testid="intent-existing" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer w-full">{t.intentHr}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0 p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
                            <FormControl>
                              <RadioGroupItem value="seeking_hr" data-testid="intent-seeking" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer w-full">{t.intentSeek}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-x-reverse space-y-0 p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer transition-colors">
                            <FormControl>
                              <RadioGroupItem value="exploring" data-testid="intent-exploring" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer w-full">{t.intentExplore}</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <LocalizedFormMessage
                        message={
                          intentError
                            ? tErrors[intentError] || intentError
                            : undefined
                        }
                        testId="error-intent"
                      />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">{t.contactLabel}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t.contactPlaceholder} 
                          {...field} 
                          dir="ltr"
                          className={isAr ? "text-right" : "text-left"}
                          data-testid="input-contact"
                        />
                      </FormControl>
                      <LocalizedFormMessage
                        message={
                          contactError
                            ? tErrors[contactError] || contactError
                            : undefined
                        }
                        testId="error-contact"
                      />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => onOpenChange(false)}
                    className="w-full sm:w-auto text-muted-foreground"
                    data-testid="button-cancel"
                  >
                    {t.cancel}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-submit"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin rtl:ml-2 rtl:mr-0" /> : null}
                    {t.submit}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}

        {resultState === "awarded" && (
          <div className="py-6 text-center" data-testid="status-awarded">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold font-heading mb-3">{t.successTitle}</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mb-8">
              {t.successDesc}
            </DialogDescription>
            <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto px-8" data-testid="button-close-awarded">
              {t.close}
            </Button>
          </div>
        )}

        {resultState === "already_claimed" && (
          <div className="py-6 text-center" data-testid="status-already-claimed">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold font-heading mb-3">{t.claimedTitle}</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mb-8">
              {t.claimedDesc}
            </DialogDescription>
            <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto px-8" data-testid="button-close-claimed">
              {t.close}
            </Button>
          </div>
        )}

        {resultState === "error" && (
          <div className="py-6 text-center" data-testid="status-error">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold font-heading mb-3">{t.errorTitle}</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mb-8">
              {t.errorDesc}
            </DialogDescription>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full sm:w-auto px-8" data-testid="button-close-error">
                {t.close}
              </Button>
              <Button onClick={() => setResultState("none")} className="w-full sm:w-auto px-8" data-testid="button-retry-error">
                {t.errorRetry}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
