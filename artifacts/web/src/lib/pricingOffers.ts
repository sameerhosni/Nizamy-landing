import { Archive, AudioLines, BarChart3, Bell, Bot, BriefcaseBusiness, CalendarClock, Fingerprint, Gift, Headset, ListChecks, MessageCircle, Network, ScanFace, Settings2, ShieldCheck, Sparkles, Star, TicketPercent, UserCheck, Wallet, WifiOff } from "lucide-react";
import type { PricingFeature } from "./pricingModules";

export const freeFeatures: PricingFeature[] = [
  { key: "welcome-points", icon: Gift, text: { en: "5,000 welcome points to use in the loyalty system", ar: "٥٬٠٠٠ نقطة ترحيبية للاستخدام في نظام الولاء" } },
  { key: "biometric", icon: Fingerprint, text: { en: "Biometric check-in and check-out using the face or fingerprint stored on the employee’s phone", ar: "حضور وانصراف عن طريق السمات الحيوية (بصمة الوجه أو الإصبع المخزنة في جوال الموظف)" } },
  { key: "self-service", icon: Bot, text: { en: "Self-service (leave, permission requests, employee requests and more) through an AI agent (limited access)", ar: "خدمات ذاتية (إجازات، استئذانات، طلبات موظفين...) عبر وكيل ذكاء اصطناعي (استخدام محدود)" } },
  { key: "rewards", icon: TicketPercent, text: { en: "Employee rewards through discount codes for local and international brands", ar: "مكافآت للموظفين عبر مجموعة من أكواد الخصم لعلامات تجارية محلية وعالمية" } },
  { key: "dashboard", icon: BarChart3, text: { en: "Real-time access to reports and system features through the manager dashboard", ar: "وصول لحظي للتقارير ومميزات النظام عبر لوحة تحكم المدير" } },
];

export const starterFeatures: PricingFeature[] = [
  { key: "welcome-points", icon: Gift, text: { en: "20,000 welcome points to use in the loyalty system", ar: "٢٠٬٠٠٠ نقطة ترحيبية للاستخدام في نظام الولاء" } },
  { key: "roles-permissions", icon: ShieldCheck, text: { en: "Roles and permissions management", ar: "إدارة الأدوار والصلاحيات" } },
  { key: "organization-structure", icon: Network, text: { en: "Administrative and organizational structure management", ar: "إدارة الهيكل الإداري والتنظيمي" } },
  { key: "points-system", icon: Star, text: { en: "Points system management", ar: "إدارة نظام النقاط" } },
  { key: "face-3d", icon: ScanFace, text: { en: "Check-in and check-out with 3D facial biometric verification", ar: "تسجيل حضور وانصراف عبر التحقق من بصمة الوجه ثلاثية الأبعاد" } },
  { key: "liveness", icon: ScanFace, text: { en: "Detect photo-based attendance fraud with liveness detection", ar: "كشف التلاعب أثناء التحضير بالصورة عبر كشف الحيوية Liveness" } },
  { key: "ai-setup", icon: Settings2, text: { en: "Set up and configure your organization’s account through an AI assistant, without training", ar: "إعداد وتهيئة حساب المنشأة عبر وكيل الذكاء الاصطناعي المساعد دون الحاجة إلى تدريب" } },
  { key: "ai-shifts", icon: CalendarClock, text: { en: "Set up shifts through an AI assistant, without training", ar: "إعداد الورديات عبر وكيل الذكاء الاصطناعي المساعد دون الحاجة إلى تدريب" } },
  { key: "coupons", icon: TicketPercent, text: { en: "Exclusive discount codes for local and international brands", ar: "أكواد خصم حصرية لعلامات تجارية محلية وعالمية" } },
  { key: "gifts", icon: Gift, text: { en: "A variety of gift cards and rewards from local and international brands", ar: "بطاقات هدايا ومكافآت متنوعة من علامات تجارية محلية وعالمية" } },
  { key: "payroll", icon: Wallet, text: { en: "Payroll management", ar: "إدارة الرواتب" } },
  { key: "history", icon: Archive, text: { en: "6 months of securely stored history", ar: "٦ أشهر من السجلات المحفوظة بأمان" } },
  { key: "ai-tasks", icon: ListChecks, text: { en: "Unlimited AI assistance for HR administration", ar: "مساعد ذكي لإجراءات الموارد البشرية دون قيود" } },
  { key: "early", icon: Sparkles, text: { en: "Free early access to new features", ar: "وصول مبكر مجاني للمزايا الجديدة" } },
  { key: "support", icon: Headset, text: { en: "Online support through the ticketing system", ar: "دعم أونلاين عبر نظام التذاكر" } },
];

// Growth inherits Starter; these lines explicitly replace its limited allowances.
export const growthFeatures: PricingFeature[] = [
  { key: "recruitment", icon: BriefcaseBusiness, text: { en: "Recruitment management", ar: "إدارة التوظيف" } },
  { key: "whatsapp-management", icon: MessageCircle, text: { en: "Manage the system through WhatsApp without logging in", ar: "إدارة النظام عبر خدمة واتس اب دون الحاجة إلى الدخول للنظام" } },
  { key: "sms-whatsapp-alerts", icon: Bell, text: { en: "Notifications via SMS and WhatsApp messages", ar: "التنبيهات عبر رسائل نصية وعبر رسائل الواتس اب" } },
  { key: "full-payroll", icon: Wallet, text: { en: "Full payroll management", ar: "إدارة الرواتب بالكامل" } },
  { key: "voiceprint", icon: AudioLines, text: { en: "Voice attendance — check-in & check-out", ar: "حضور وانصراف ببصمة الصوت" } },
  { key: "evaluation", icon: UserCheck, text: { en: "Employee performance evaluation", ar: "تقييم أداء الموظفين" } },
  { key: "unlimited-tasks", icon: ListChecks, text: { en: "Unlimited AI assistance for HR administration", ar: "مساعد ذكي لإجراءات الموارد البشرية دون قيود" } },
  { key: "archive-12", icon: Archive, text: { en: "12 months of securely stored history", ar: "١٢ شهراً من السجلات المحفوظة بأمان" } },
  { key: "early", icon: Sparkles, text: { en: "Free early access to new features", ar: "وصول مبكر مجاني للمزايا الجديدة" } },
  { key: "offline", icon: WifiOff, text: { en: "Offline attendance", ar: "تسجيل الحضور دون اتصال بالإنترنت" } },
];
