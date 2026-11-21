export type ChapterId = "ai" | "attendance" | "rewards" | "reports" | "onboarding" | "payroll";

export type AppScreen = { n: number; label: string; description: string };

// Reserve the real screenshot geometry before download/decoding and on tab changes.
export const screenHeights: Record<number, number> = {
  0: 1008, 1: 1023, 2: 982, 3: 977, 4: 964, 5: 994,
  6: 1031, 7: 1028, 8: 1031, 9: 1072, 10: 1048, 11: 1047,
};

export type Chapter = {
  id: ChapterId;
  index: string;
  tab: string;
  headline: string;
  /** icon keys from homepageContent.solution.cards rendered with this chapter */
  benefits: string[];
  screens: AppScreen[];
};

export const chapters: Chapter[] = [
  {
    id: "ai",
    index: "٠١",
    tab: "اسأل نظامي",
    headline: "الموظف يكتب طلبه كأنه يسولف، والمساعد يرد من سياسات شركتك.",
    benefits: ["bot", "list"],
    screens: [
      { n: 9, label: "مساعد الخدمة الذاتية", description: "شاشة الترحيب في مساعد نظامي، حيث يسأل الموظف عن سياسات شركته." },
      { n: 8, label: "سؤال عن طلبات الإجازة", description: "الموظف يسأل عن طلباته، والمساعد يرد بملخص وجدول لطلبات الإجازة وحالتها." },
    ],
  },
  {
    id: "attendance",
    index: "٠٢",
    tab: "حضور بالوجه",
    headline: "تسجيل الحضور من جوال الموظف، بالتحقق من بصمة الوجه.",
    benefits: ["face", "fingerprint"],
    screens: [
      { n: 6, label: "تسجيل الحضور", description: "شاشة تسجيل الحضور: ضع وجهك داخل الإطار، مع خيار بصمة الوجه أو بصمة الأصبع." },
      { n: 7, label: "تسجيل بصمة الوجه", description: "خطوة تسجيل بصمة الوجه للموظف قبل استخدامها في الحضور." },
    ],
  },
  {
    id: "rewards",
    index: "٠٣",
    tab: "مكافآت وخصومات",
    headline: "نقاط ومتجر خصومات من علامات يعرفها فريقك.",
    benefits: ["gift"],
    screens: [
      { n: 2, label: "متجر الخصومات", description: "متجر داخل التطبيق يعرض كوبونات وبطاقات هدايا من علامات تجارية." },
      { n: 5, label: "نقاط المكافآت", description: "رصيد نقاط المكافآت للموظف داخل التطبيق." },
      { n: 3, label: "عروض العلامات التجارية", description: "عروض وخصومات من علامات تجارية للموظفين." },
      { n: 4, label: "عرض خصم", description: "عرض خصم من إحدى العلامات التجارية." },
    ],
  },
  {
    id: "reports",
    index: "٠٤",
    tab: "تقارير وقيمة",
    headline: "تقارير بالذكاء الاصطناعي، وصورة أوضح لقيمة نظامي لمنشأتك.",
    benefits: ["archive"],
    screens: [
      { n: 1, label: "تقارير بالذكاء الاصطناعي", description: "تقارير تُنشأ بالذكاء الاصطناعي من بيانات الموارد البشرية." },
      { n: 0, label: "القيمة للأعمال", description: "شاشة توضح القيمة التشغيلية لاستخدام نظامي." },
    ],
  },
  {
    id: "payroll",
    index: "٠٥",
    tab: "الرواتب",
    headline: "من الحضور إلى الرواتب، كل التفاصيل في مكان واحد.",
    benefits: ["wallet"],
    screens: [],
  },
  {
    id: "onboarding",
    index: "٠٦",
    tab: "الإعداد بالذكاء الاصطناعي",
    headline: "كل إعدادات شركتك عبر الذكاء الاصطناعي، بمحادثة مع نظامي.",
    benefits: ["setup"],
    screens: [
      { n: 11, label: "إعداد الشركة مع نظامي AI", description: "مساعد نظامي يبدأ معك محادثة لإعداد حساب شركتك." },
      { n: 10, label: "اختر طريقة الإعداد", description: "بعد التحقق، اختر الإعداد مع AIHR أو الإعداد اليدوي." },
    ],
  },
];

export const whyCopy = {
  tabsLabel: "اكتشف نظامي حسب الميزة",
  realScreens: "لقطات حقيقية من التطبيق",
  enlarge: "تكبير",
  close: "إغلاق",
  prev: "السابق",
  next: "التالي",
  moreScreens: "شاشات أخرى",
  learnMore: "اعرف أكثر",
  pause: "إيقاف التنقل التلقائي",
  play: "تشغيل التنقل التلقائي",
  rotation: "تتغير المواضيع كل ٥ ثوانٍ",
};
