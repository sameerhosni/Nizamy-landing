import type { LucideIcon } from "lucide-react";
import {
  Fingerprint, ScanFace, AudioLines, Users, UserCog, Bot, Settings2, CalendarClock, Gift, TicketPercent, BadgePercent,
  Wallet, FileSpreadsheet, BarChart3, Archive, ListChecks, LifeBuoy, Headset, Sparkles, Megaphone, Filter, UserCheck, BriefcaseBusiness,
} from "lucide-react";

type L = { en: string; ar: string };
export interface PricingFeature { key: string; icon: LucideIcon; text: L; short?: L; badge?: L }
export interface PricingModule { key: string; icon: LucideIcon; title: L; features: PricingFeature[]; soon?: boolean; note?: L }

// Presentation metadata for the paid plan. Feature text mirrors planFeatures in plans.ts — keep in sync.
const detailedModules: PricingModule[] = [
  { key: "attendance", icon: Fingerprint, title: { en: "Attendance", ar: "الحضور والانصراف" }, features: [
    { key: "fingerprint", short: { en: "Fingerprint or face check-in, no training", ar: "حضور فوري بالبصمة أو الوجه دون تدريب" }, icon: Fingerprint, text: { en: "Instant fingerprint check-in (finger or face) — no training needed", ar: "تسجيل حضور فوري بالبصمة (إصبع / وجه) — لا تدريب مطلوب" } },
    { key: "liveness", short: { en: "Face check-in with liveness detection", ar: "تسجيل بالوجه مع كشف الحيوية" }, icon: ScanFace, text: { en: "Face check-in with liveness detection to help reduce check-in fraud", ar: "تسجيل بالوجه مع كشف الحيوية للمساعدة في الحد من التلاعب" } },
    { key: "voiceprint", short: { en: "Voiceprint check-in & check-out", ar: "حضور وانصراف ببصمة الصوت" }, icon: AudioLines, text: { en: "Voiceprint check-in and check-out", ar: "تسجيل حضور وانصراف ببصمة الصوت" } },
  ] },
  { key: "hr", icon: Users, title: { en: "HR", ar: "الموارد البشرية" }, features: [
    { key: "self-service", short: { en: "Self-service from day one", ar: "خدمة ذاتية من اليوم الأول" }, icon: UserCog, text: { en: "Self-service tools your team can use from day one", ar: "خدمة ذاتية يستخدمها فريقك من اليوم الأول" } },
    { key: "ai-hr", short: { en: "AI answers HR requests instantly", ar: "ذكاء اصطناعي يجيب طلبات الموارد البشرية فوراً" }, icon: Bot, text: { en: "An AI assistant that answers HR requests instantly", ar: "مساعد ذكاء اصطناعي يُجيب على طلبات الموارد البشرية في الحال" } },
    { key: "ai-setup", short: { en: "AI account setup, no training needed", ar: "إعداد الحساب بالذكاء الاصطناعي دون تدريب" }, icon: Settings2, text: { en: "AI-assisted account setup — no training or help needed", ar: "مساعد ذكاء اصطناعي لإعدادات الحساب دون الحاجة إلى تدريب أو مساعدة" } },
    { key: "ai-shifts", short: { en: "AI shift configuration", ar: "إعداد الورديات بالذكاء الاصطناعي" }, icon: CalendarClock, text: { en: "Shift configuration through a smart AI assistant", ar: "إعدادات الورديات عبر مساعد ذكاء اصطناعي ذكي" } },
  ] },
  { key: "rewards", icon: Gift, title: { en: "Rewards", ar: "المكافآت" }, features: [
    { key: "codes", short: { en: "Discount codes that boost attendance", ar: "أكواد خصم ترفع معدل الحضور" }, icon: TicketPercent, text: { en: "Discount codes that drive commitment and boost attendance", ar: "أكواد خصم تُحرّك الالتزام وترفع معدل الحضور" } },
    { key: "gifts", short: { en: "Smart gift cards & rewards", ar: "بطاقات هدايا ومكافآت ذكية" }, icon: Gift, text: { en: "Smart gift cards and rewards that motivate top performers", ar: "بطاقات هدايا ومكافآت ذكية تُحفّز أصحاب الأداء العالي" } },
    { key: "coupons", short: { en: "Exclusive discount coupons", ar: "كوبونات خصم حصرية" }, icon: BadgePercent, text: { en: "Exclusive discount coupons", ar: "كوبونات خصم حصرية" } },
  ] },
  { key: "payroll", icon: Wallet, title: { en: "Payroll & reports", ar: "الرواتب والتقارير" }, features: [
    { key: "payroll", icon: FileSpreadsheet, text: { en: "One-click payroll reports", ar: "تقارير رواتب بنقرة واحدة" } },
    { key: "reports", short: { en: "Clear, regular reports", ar: "تقارير دورية واضحة" }, icon: BarChart3, text: { en: "Clear, regular reports", ar: "تقارير دورية واضحة" } },
    { key: "history", short: { en: "6 months of securely stored history", ar: "٦ أشهر من السجلات المحفوظة بأمان" }, icon: Archive, text: { en: "6 months of history, securely stored", ar: "٦ أشهر من السجلات محفوظة بأمان" } },
  ] },
  { key: "tasks", icon: ListChecks, title: { en: "HR administration", ar: "إجراءات الموارد البشرية" }, features: [
    { key: "ai-tasks", short: { en: "AI assistant for HR administration", ar: "مساعد ذكي لإجراءات الموارد البشرية" }, icon: Bot, text: { en: "AI assistant for HR administration (limited use)", ar: "مساعد ذكي لإجراءات الموارد البشرية (استخدام محدود)" }, badge: { en: "Limited use", ar: "استخدام محدود" } },
  ] },
  { key: "support", icon: LifeBuoy, title: { en: "Support & early access", ar: "الدعم والوصول المبكر" }, features: [
    { key: "priority", short: { en: "Priority support via tickets", ar: "أولوية الدعم عبر نظام التذاكر" }, icon: Headset, text: { en: "Priority support through the ticketing system", ar: "أولوية الدعم الفني عبر نظام التذاكر" } },
    { key: "early", short: { en: "Free early access to new features", ar: "وصول مبكر مجاني للمزايا الجديدة" }, icon: Sparkles, text: { en: "Free early access to new features", ar: "وصول مبكر للمزايا الجديدة مجاناً" } },
  ] },
];

// Upcoming module — not included, not counted. Copy from Features.tsx recruitment description.
export const upcomingModule: PricingModule = {
  key: "recruitment", icon: BriefcaseBusiness, soon: true, title: { en: "Recruitment", ar: "التوظيف" },
  note: { en: "Attract, screen, and hire candidates through one streamlined pipeline.", ar: "استقطب المرشحين وقيّمهم ووظّفهم عبر مسار واحد منظم." },
  features: [
    { key: "attract", icon: Megaphone, text: { en: "Attract", ar: "الاستقطاب" } },
    { key: "screen", icon: Filter, text: { en: "Screen", ar: "التقييم" } },
    { key: "hire", icon: UserCheck, text: { en: "Hire", ar: "التوظيف" } },
  ],
};

export const findPricingFeature = (key: string) => detailedModules.flatMap((m) => m.features).find((f) => f.key === key);
export const FREE_FEATURE_KEYS = ["fingerprint", "self-service", "codes", "reports"];

const combinedFeatures: Record<string, { keys: string[]; short: L; icon: LucideIcon }[]> = {
  attendance: [
    { keys: ["fingerprint", "voiceprint"], icon: Fingerprint, short: { en: "Fingerprint, face & voice attendance — no training", ar: "حضور بالبصمة والوجه والصوت دون تدريب" } },
    { keys: ["liveness"], icon: ScanFace, short: { en: "Face liveness detection to reduce fraud", ar: "كشف حيوية الوجه للحد من التلاعب" } },
  ],
  hr: [
    { keys: ["self-service", "ai-hr"], icon: Bot, short: { en: "Employee self-service with instant AI HR answers", ar: "خدمة ذاتية للموظفين وإجابات فورية بالذكاء الاصطناعي" } },
    { keys: ["ai-setup", "ai-shifts"], icon: Settings2, short: { en: "AI account & shift setup — no training or help", ar: "إعداد الحساب والورديات بالذكاء الاصطناعي دون تدريب أو مساعدة" } },
  ],
  rewards: [
    { keys: ["codes", "coupons"], icon: TicketPercent, short: { en: "Discount codes & exclusive coupons", ar: "أكواد خصم وكوبونات حصرية" } },
    { keys: ["gifts"], icon: Gift, short: { en: "Smart gift cards & rewards", ar: "بطاقات هدايا ومكافآت ذكية" } },
  ],
  payroll: [
    { keys: ["payroll", "reports"], icon: FileSpreadsheet, short: { en: "Regular reports & one-click payroll reports", ar: "تقارير دورية وتقارير رواتب بنقرة واحدة" } },
    { keys: ["history"], icon: Archive, short: { en: "6 months of securely stored history", ar: "٦ أشهر من السجلات المحفوظة بأمان" } },
  ],
};

// Combine related benefits for display without changing the free plan's entitlements.
export const paidModules: PricingModule[] = detailedModules.map((module) => {
  const groups = combinedFeatures[module.key];
  if (!groups) return module;
  return {
    ...module,
    features: groups.map(({ keys, short, icon }) => {
      const originals = keys.map((key) => {
        const feature = module.features.find((item) => item.key === key);
        if (!feature) throw new Error(`Unknown pricing feature: ${key}`);
        return feature;
      });
      return {
        key: keys.join("-"),
        icon,
        short,
        text: {
          en: originals.map((feature) => feature.text.en).join("; "),
          ar: originals.map((feature) => feature.text.ar).join("؛ "),
        },
      };
    }),
  };
});

export const includedFeatureCount = paidModules.reduce((n, m) => n + m.features.length, 0);
