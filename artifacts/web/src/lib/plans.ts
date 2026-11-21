// Legacy identifiers stay stable for API/analytics: Standard = public "Free", Growth = public "Starter".
// GrowthPlus identifies the new public Growth offer; Pro keeps its historical price.
export type Tier = "Standard" | "Growth" | "GrowthPlus" | "Pro";
export type PublicTier = Exclude<Tier, "Pro">;

export const STARTER_MONTHLY_PER_USER = 3;
export const STARTER_ANNUAL_PER_USER = STARTER_MONTHLY_PER_USER * 12; // 36 SAR
export const GROWTH_MONTHLY_PER_USER = 7;

export const tierPrice = (tier: Tier) => (tier === "GrowthPlus" ? GROWTH_MONTHLY_PER_USER : tier === "Growth" ? STARTER_MONTHLY_PER_USER : tier === "Pro" ? 8 : 0);
export const annualTotal = (tier: Tier, employees: number) => employees * tierPrice(tier) * 12;

export const MIN_EMPLOYEES = 1;
export const MAX_EMPLOYEES = 100000;
export const clampEmployees = (n: number) =>
  Math.min(MAX_EMPLOYEES, Math.max(MIN_EMPLOYEES, Math.round(Number.isFinite(n) ? n : MIN_EMPLOYEES)));

export const publicTierLabel: Record<PublicTier, { en: string; ar: string }> = {
  Standard: { en: "Free", ar: "المجانية" },
  Growth: { en: "Starter", ar: "Starter" },
  GrowthPlus: { en: "Growth", ar: "Growth" },
};

export const planFeatures = {
  en: {
    basic: [
      "Instant fingerprint check-in (finger or face) — no training needed",
      "Self-service tools your team can use from day one",
      "Discount codes that drive commitment and boost attendance",
      "Clear, regular reports",
    ],
    growthAdd: [
      "An AI assistant that answers HR requests instantly",
      "Smart gift cards and rewards that motivate top performers",
      "6 months of history, securely stored",
      "Face check-in with liveness detection to help reduce check-in fraud",
      "One-click payroll reports",
      "Priority support through the ticketing system",
      "AI assistant for HR administration (limited use)",
      "AI-assisted account setup — no training or help needed",
      "Shift configuration through a smart AI assistant",
      "Exclusive discount coupons",
      "Free early access to new features",
      "Voiceprint check-in and check-out",
    ],
  },
  ar: {
    basic: [
      "تسجيل حضور فوري بالبصمة (إصبع / وجه) — لا تدريب مطلوب",
      "خدمة ذاتية يستخدمها فريقك من اليوم الأول",
      "أكواد خصم تُحرّك الالتزام وترفع معدل الحضور",
      "تقارير دورية واضحة",
    ],
    growthAdd: [
      "مساعد ذكاء اصطناعي يُجيب على طلبات الموارد البشرية في الحال",
      "بطاقات هدايا ومكافآت ذكية تُحفّز أصحاب الأداء العالي",
      "٦ أشهر من السجلات محفوظة بأمان",
      "تسجيل بالوجه مع كشف الحيوية للمساعدة في الحد من التلاعب",
      "تقارير رواتب بنقرة واحدة",
      "أولوية الدعم الفني عبر نظام التذاكر",
      "مساعد ذكي لإجراءات الموارد البشرية (استخدام محدود)",
      "مساعد ذكاء اصطناعي لإعدادات الحساب دون الحاجة إلى تدريب أو مساعدة",
      "إعدادات الورديات عبر مساعد ذكاء اصطناعي ذكي",
      "كوبونات خصم حصرية",
      "وصول مبكر للمزايا الجديدة مجاناً",
      "تسجيل حضور وانصراف ببصمة الصوت",
    ],
  },
};
