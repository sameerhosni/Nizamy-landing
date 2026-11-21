import { notifySubmissionSuccess } from "@/lib/feedbackSurvey";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitHubspotForm } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AppStoreLinks, appPointsCopy } from "@/components/ui/AppStoreLinks";
import { websiteFormMessage, SECTOR_MAX_LENGTH, SECTOR_MESSAGE_RESERVE } from "@/lib/websiteFormMessage";

type HubSpotFormProps = {
  locale?: string;
  className?: string;
  testId?: string;
  errorMessage: string;
  onSubmitted?: () => void;
  submissionContext?: string;
  onStarted?: () => void;
  onPendingChange?: (pending: boolean) => void;
  onClose?: () => void;
  includeSector?: boolean;
  copyOverrides?: Partial<Record<"firstName" | "email" | "message" | "submit" | "successTitle" | "successBody" | "close" | "retryable" | "consentUnavailable", string>>;
  requiredMessage?: string;
  closeAsText?: boolean;
};

type FormValues = {
  intents: ("existing_hr" | "exploring" | "seeking_hr")[];
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  sector: string;
  message: string;
  marketingOptIn: boolean;
};

const initialValues: FormValues = {
  intents: [],
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  sector: "",
  message: "",
  marketingOptIn: true,
};

function getHubSpotCookie() {
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function HubSpotForm({
  locale = "en",
  className,
  testId,
  errorMessage,
  onSubmitted,
  submissionContext = "",
  onStarted,
  onPendingChange,
  onClose,
  includeSector = false,
  copyOverrides,
  requiredMessage,
  closeAsText = false,
}: HubSpotFormProps) {
  const isAr = locale === "ar";
  const returnToWebsite = () => {
    if (onClose) onClose();
    else window.location.assign(import.meta.env.BASE_URL);
  };
  const fieldId = useId();
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  useEffect(() => {
    if (status !== "success") return;
    const timer = window.setTimeout(returnToWebsite, 20000);
    return () => window.clearTimeout(timer);
  }, [status]);
  const [submissionError, setSubmissionError] = useState(errorMessage);
  const [notificationEmailSent, setNotificationEmailSent] = useState(true);
  const requestId = useRef(crypto.randomUUID());
  const requestContext = useRef(submissionContext);
  const hasStarted = useRef(false);
  const context = submissionContext.trim();
  const messageLimit = Math.max(0, 4000 - context.length - (context ? 2 : 0) - (includeSector ? SECTOR_MESSAGE_RESERVE : 0));

  const copy = {
    reason: isAr ? "سبب التواصل" : "Reason",
    existingHr: isAr ? "أستخدم نظام موارد بشرية بالفعل" : "Already using HR system",
    exploring: isAr ? "أستكشف الخيارات فقط" : "Just exploring",
    seekingHr: isAr ? "أبحث عن نظام موارد بشرية" : "Looking for HR system",
    firstName: isAr ? "الاسم الأول" : "First name",
    lastName: isAr ? "اسم العائلة" : "Last name",
    email: isAr ? "البريد الإلكتروني" : "Email",
    phone: isAr ? "رقم الهاتف" : "Phone number",
    sector: isAr ? "قطاع المنشأة (اختياري)" : "Client sector (optional)",
    sectorPlaceholder: isAr ? "مثل: التعليم، الصحة، التجزئة" : "e.g. Education, healthcare, retail",
    message: isAr ? "الرسالة" : "Message",
    marketing: isAr
      ? "أوافق على تلقي رسائل بريد إلكتروني تسويقية من نظامي، ويمكنني إلغاء الاشتراك في أي وقت."
      : "I agree to receive marketing emails from Nizamy. I can unsubscribe at any time.",
    consentUnavailable: isAr
      ? "التسجيل في الرسائل التسويقية غير متاح حالياً، ولم يُرسل استفسارك بعد. يمكنك المحاولة لاحقاً، أو إلغاء تحديد الموافقة التسويقية وإرسال الاستفسار فقط."
      : "Marketing signup is currently unavailable, and your inquiry has not been sent. You can try later, or uncheck marketing consent and submit only your inquiry.",
    submit: isAr ? "إرسال" : "Send",
    sending: isAr ? "جارٍ الإرسال..." : "Sending...",
    successTitle: isAr ? "وصلنا طلبك" : "Form submitted",
    successBody: isAr
      ? `حياك الله! لك 5,000 نقطة ترحيبية مجانية. ${appPointsCopy.ar} بنرجّعك للموقع خلال 20 ثانية عشان تكمّل تصفّحك.`
      : `Welcome! You have 5,000 free welcome points. ${appPointsCopy.en} We'll return you to the website in 20 seconds to continue your journey.`,
    close: isAr ? "إغلاق" : "Close",
    notificationWarning: isAr
      ? "وصلنا طلبك، لكن ما قدرنا نرسل بعض رسائل التأكيد. تقدر تحمّل التطبيق من الروابط أعلاه."
      : "Your request was received, but some confirmation emails could not be sent. You can download the app using the links above.",
    retryable: isAr
      ? "ما قدرنا نرسل النموذج الحين. جرّب مرة ثانية."
      : "We could not complete your submission right now. Please try again.",
    ...copyOverrides,
  };

  const setField = <Field extends keyof FormValues>(
    field: Field,
    value: FormValues[Field],
  ) => {
    if (values[field] !== value) requestId.current = crypto.randomUUID();
    setValues((current) => ({ ...current, [field]: value }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "pending" || !values.intents.length) return;
    const message = websiteFormMessage(values.message, context, includeSector ? values.sector : "", locale);
    if (message.length > 4000) {
      setSubmissionError(errorMessage);
      setStatus("error");
      return;
    }
    if (requestContext.current !== submissionContext) {
      requestId.current = crypto.randomUUID();
      requestContext.current = submissionContext;
    }
    setStatus("pending");
    onPendingChange?.(true);

    try {
      const hutk = getHubSpotCookie();
      const result = await submitHubspotForm({
        requestId: requestId.current,
        language: isAr ? "ar" : "en",
        intents: values.intents,
        marketingOptIn: values.marketingOptIn,
        // Preserve the submit-based processing flag; no separate disclosure is shown.
        consentToProcess: true,
        firstname: values.firstname.trim() || undefined,
        lastname: values.lastname.trim() || undefined,
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        message: message || undefined,
        pageUri: window.location.href,
        pageName: document.title,
        hutk,
      });

      if (result.hubspotSubmitted !== true) throw new Error("Form submission was not confirmed");
      setNotificationEmailSent(result.notificationEmailSent);
      setStatus("success");
      notifySubmissionSuccess("marketing_form");
      onSubmitted?.();
    } catch (error) {
      const apiError = error as {
        status?: number;
        data?: { reason?: string };
      };
      if (apiError.data?.reason === "marketing_consent_unavailable") {
        setSubmissionError(copy.consentUnavailable);
      } else if (apiError.status === 503) {
        setSubmissionError(copy.retryable);
      } else {
        setSubmissionError(errorMessage);
      }
      setStatus("error");
    } finally {
      onPendingChange?.(false);
    }
  };

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex min-h-48 flex-col items-center justify-center rounded-2xl bg-emerald-50 px-5 py-8 text-center",
          className,
        )}
        data-testid={testId}
        role="status"
      >
        <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-600" aria-hidden="true" />
        <h3 className="text-lg font-bold text-slate-950">{copy.successTitle}</h3>
        <p className="mt-1 text-sm text-slate-600">{copy.successBody}</p>
        <AppStoreLinks language={isAr ? "ar" : "en"} source="hubspot_form_success" className="mt-4" />
        {!notificationEmailSent && (
          <p className="mt-3 text-sm text-amber-800" role="alert">
            {copy.notificationWarning}
          </p>
        )}
        {(
          <Button type="button" variant="outline" className="mt-5 h-11 w-full rounded-xl border-emerald-200 bg-white/80 font-semibold text-slate-700 shadow-none hover:border-emerald-300 hover:bg-white hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-emerald-300 sm:w-auto sm:min-w-40" onClick={returnToWebsite} data-testid="button-hubspot-form-success-close">
            {isAr ? "كمّل تصفّح الموقع" : "Continue to the website"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <form
      className={cn("space-y-3", className)}
      data-testid={testId}
      onSubmit={handleSubmit}
      onInvalidCapture={(event) => {
        const field = event.target;
        if (requiredMessage && (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
          field.setCustomValidity(field.validity.valueMissing ? requiredMessage : "");
        }
      }}
      onInputCapture={(event) => {
        const field = event.target;
        if (requiredMessage && (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) field.setCustomValidity("");
      }}
      onFocusCapture={() => {
        if (!hasStarted.current) {
          hasStarted.current = true;
          onStarted?.();
        }
      }}
      noValidate={false}
    >
      <fieldset className="min-w-0 space-y-1.5" disabled={status === "pending"}>
        <legend className="text-sm font-medium">
          {copy.reason} <span className="text-red-600" aria-hidden="true">*</span>
          <span className="ms-2 text-xs font-normal text-slate-500">{isAr ? "يمكنك اختيار أكثر من سبب" : "Select all that apply"}</span>
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {([["existing_hr", copy.existingHr], ["exploring", copy.exploring], ["seeking_hr", copy.seekingHr]] as const).map(([reason, label]) => (
            <label key={reason} className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-blue-400",
              values.intents.includes(reason) ? "border-blue-500 bg-blue-50 text-blue-900" : "border-input bg-white text-slate-800",
            )}>
              <input type="checkbox" name="intents" value={reason} required={reason === "existing_hr" && !values.intents.length} checked={values.intents.includes(reason)} className="accent-blue-600"
                onChange={(event) => {
                  event.currentTarget.form?.querySelector<HTMLInputElement>('input[name="intents"]')?.setCustomValidity("");
                  setField("intents", event.currentTarget.checked ? [...values.intents, reason] : values.intents.filter((r) => r !== reason));
                }} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {includeSector && (
        <div className="space-y-1.5">
          <Label htmlFor={`${fieldId}-sector`}>{copy.sector}</Label>
          <Input
            id={`${fieldId}-sector`}
            name="sector"
            maxLength={SECTOR_MAX_LENGTH}
            placeholder={copy.sectorPlaceholder}
            value={values.sector}
            onChange={(event) => setField("sector", event.target.value)}
            disabled={status === "pending"}
            className="h-10 bg-white"
            data-testid="input-client-sector"
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${fieldId}-firstname`}>{copy.firstName}</Label>
          <Input
            id={`${fieldId}-firstname`}
            name="firstname"
            maxLength={100}
            autoComplete="given-name"
            value={values.firstname}
            onChange={(event) => setField("firstname", event.target.value)}
            disabled={status === "pending"}
            className="h-10 bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${fieldId}-lastname`}>{copy.lastName}</Label>
          <Input
            id={`${fieldId}-lastname`}
            name="lastname"
            maxLength={100}
            autoComplete="family-name"
            value={values.lastname}
            onChange={(event) => setField("lastname", event.target.value)}
            disabled={status === "pending"}
            className="h-10 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor={`${fieldId}-email`}>
            {copy.email} <span className="text-red-600" aria-hidden="true">*</span>
          </Label>
          <Input
            id={`${fieldId}-email`}
            name="email"
            type="email"
            maxLength={320}
            autoComplete="email"
            dir="ltr"
            required
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            disabled={status === "pending"}
            className="h-10 min-w-0 bg-white"
          />
        </div>
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor={`${fieldId}-phone`}>{copy.phone} <span className="text-red-600" aria-hidden="true">*</span></Label>
          <Input
            id={`${fieldId}-phone`}
            name="phone"
            type="tel"
            required
            pattern=".*\S.*"
            maxLength={50}
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="+966"
            value={values.phone}
            onChange={(event) => setField("phone", event.target.value)}
            disabled={status === "pending"}
            className="h-10 min-w-0 bg-white"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${fieldId}-message`}>{copy.message}</Label>
        <Textarea
          id={`${fieldId}-message`}
          name="message"
          rows={2}
          maxLength={messageLimit}
          value={values.message}
          onChange={(event) => setField("message", event.target.value)}
          disabled={status === "pending"}
          className="min-h-16 resize-none bg-white"
        />
      </div>

      <div hidden className="space-y-3 border-t border-slate-200 pt-3">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700">
          <input
            type="checkbox"
            name="marketingOptIn"
            checked={values.marketingOptIn}
            onChange={(event) => setField("marketingOptIn", event.target.checked)}
            disabled={status === "pending"}
            className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
            data-testid="checkbox-marketing-consent"
          />
          <span>{copy.marketing}</span>
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700" data-testid="status-hubspot-form-error">
          {submissionError}
        </p>
      )}

      <div className={cn("grid gap-2", onClose && "grid-cols-2")}>
        <Button
          type="submit"
          disabled={status === "pending"}
          className="h-11 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-bold text-white hover:from-sky-600 hover:to-blue-700"
        >
          {status === "pending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {status === "pending" ? copy.sending : copy.submit}
        </Button>
        {onClose && (
          <Button type="button" variant={closeAsText ? "ghost" : "outline"} className="h-11 rounded-xl" onClick={onClose}>
            {copy.close}
          </Button>
        )}
      </div>
    </form>
  );
}
