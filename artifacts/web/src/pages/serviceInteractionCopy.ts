export type Lang = "en" | "ar";
/** Where the supported explanation comes from in serviceLandingContent.json */
export type Ref = { card: number } | { section: string; p: number };
export type Priority = { id: string; label: string; hint: string; ref: Ref; steps: string[] };
export type ExplorerCopy = {
  service: string;
  title: string;
  lead: string;
  tablist: string;
  supported: string;
  workflowTitle: string;
  illustrative: string;
  enquiryTitle: string;
  enquiryLead: string;
  summaryLabel: string;
  summaryService: string;
  summaryPriority: string;
  formError: string;
  stickyCta: string;
  priorities: Priority[];
};

const ill = {
  en: "Illustrative workflow only. This is not live software, real data or a product demo.",
  ar: "مثال توضيحي للمسار فقط. هذا ليس برنامجاً مباشراً ولا بيانات حقيقية ولا عرضاً تجريبياً للمنتج.",
};

export const explorerCopy: Record<string, Record<Lang, ExplorerCopy>> = {
  aiHrService: {
    en: {
      service: "AI in HR",
      title: "Start with the priority that matters most to you",
      lead: "Choose one area to see what Nizamy says about it, then tell our team what you would like to talk through.",
      tablist: "Choose your HR priority",
      supported: "What Nizamy says",
      workflowTitle: "How it could flow",
      illustrative: ill.en,
      enquiryTitle: "Talk to our team about this priority",
      enquiryLead: "Share your details here, then download Nizamy and get started in the app.",
      summaryLabel: "Your enquiry",
      summaryService: "Service",
      summaryPriority: "Priority",
      formError: "We could not send your details. Your entries are kept, please try again.",
      stickyCta: "Talk to our team",
      priorities: [
        { id: "attendance", label: "Attendance", hint: "Mobile check-in", ref: { card: 0 }, steps: ["Employee records attendance from a phone", "Face verification with liveness detection, where configured", "Attendance information is available in reports"] },
        { id: "requests", label: "Employee requests", hint: "Self-service", ref: { card: 1 }, steps: ["Employee asks the AI assistant or opens a request", "Documents, requests and approvals follow self-service workflows", "HR handles what needs human judgment"] },
        { id: "insights", label: "Insights", hint: "Attendance and performance", ref: { card: 2 }, steps: ["Attendance, punctuality and activity gather in reports", "Managers look for patterns and ask better questions", "Follow-up stays a human decision with context"] },
      ],
    },
    ar: {
      service: "الذكاء الاصطناعي في الموارد البشرية",
      title: "ابدأ بالأولوية الأهم لديك",
      lead: "اختر مجالاً واحداً لتعرف ما يقوله نظامي عنه، ثم أخبر فريقنا بما تود مناقشته.",
      tablist: "اختر أولويتك في الموارد البشرية",
      supported: "ما يقوله نظامي",
      workflowTitle: "كيف قد يسير العمل",
      illustrative: ill.ar,
      enquiryTitle: "تحدث مع فريقنا حول هذه الأولوية",
      enquiryLead: "سجّل بياناتك هنا، ثم حمّل نظامي وابدأ من داخل التطبيق.",
      summaryLabel: "طلبك",
      summaryService: "الخدمة",
      summaryPriority: "الأولوية",
      formError: "تعذر إرسال بياناتك. المدخلات محفوظة، يرجى المحاولة مرة أخرى.",
      stickyCta: "تواصل مع فريقنا",
      priorities: [
        { id: "attendance", label: "الحضور", hint: "تسجيل عبر الجوال", ref: { card: 0 }, steps: ["يسجل الموظف حضوره من هاتفه", "التحقق بالوجه مع كشف الحيوية عند إعداده", "تتوفر معلومات الحضور في التقارير"] },
        { id: "requests", label: "طلبات الموظفين", hint: "الخدمة الذاتية", ref: { card: 1 }, steps: ["يسأل الموظف المساعد الذكي أو يفتح طلباً", "المستندات والطلبات والموافقات عبر الخدمة الذاتية", "تتولى الموارد البشرية ما يحتاج إلى حكم إنساني"] },
        { id: "insights", label: "الرؤى", hint: "الحضور والأداء", ref: { card: 2 }, steps: ["يجتمع الحضور والالتزام والنشاط في تقارير", "يلاحظ المديرون الأنماط ويطرحون أسئلة أفضل", "تبقى المتابعة قراراً إنسانياً يراعي السياق"] },
      ],
    },
  },
  employeeRewardsService: {
    en: {
      service: "Employee rewards",
      title: "Which part of rewards do you want to get right?",
      lead: "Choose one area to see what Nizamy says about it, then tell our team what you would like to talk through.",
      tablist: "Choose your rewards priority",
      supported: "What Nizamy says",
      workflowTitle: "How it could flow",
      illustrative: ill.en,
      enquiryTitle: "Talk to our team about this priority",
      enquiryLead: "Share your details here, then download Nizamy and get started in the app.",
      summaryLabel: "Your enquiry",
      summaryService: "Service",
      summaryPriority: "Priority",
      formError: "We could not send your details. Your entries are kept, please try again.",
      stickyCta: "Talk to our team",
      priorities: [
        { id: "criteria", label: "Criteria", hint: "Clear standards", ref: { section: "criteria", p: 0 }, steps: ["Define the contribution or behaviour to encourage", "Choose indicators that fit the role and work", "Explain how recognition relates to them"] },
        { id: "recognition", label: "Recognition", hint: "Commitment to appreciation", ref: { section: "connect", p: 0 }, steps: ["Employees understand what is valued and why", "Managers follow up with available workforce information", "Appreciation ties to the behaviours you want to reinforce"] },
        { id: "giftcards", label: "Gift cards", hint: "Smart rewards", ref: { section: "connect", p: 1 }, steps: ["Select an approach that fits team, budget and policy", "Explain eligibility, award details and approval", "Organize rewards in one consistent workspace"] },
        { id: "fairness", label: "Fairness", hint: "Policy and review", ref: { section: "fairness", p: 0 }, steps: ["Define who nominates or approves and when awards are reviewed", "Use data as part of the picture, with manager context", "Provide a route for review and revisit the approach"] },
      ],
    },
    ar: {
      service: "مكافآت الموظفين",
      title: "أي جانب من المكافآت تريد إتقانه؟",
      lead: "اختر مجالاً واحداً لتعرف ما يقوله نظامي عنه، ثم أخبر فريقنا بما تود مناقشته.",
      tablist: "اختر أولويتك في المكافآت",
      supported: "ما يقوله نظامي",
      workflowTitle: "كيف قد يسير العمل",
      illustrative: ill.ar,
      enquiryTitle: "تحدث مع فريقنا حول هذه الأولوية",
      enquiryLead: "سجّل بياناتك هنا، ثم حمّل نظامي وابدأ من داخل التطبيق.",
      summaryLabel: "طلبك",
      summaryService: "الخدمة",
      summaryPriority: "الأولوية",
      formError: "تعذر إرسال بياناتك. المدخلات محفوظة، يرجى المحاولة مرة أخرى.",
      stickyCta: "تواصل مع فريقنا",
      priorities: [
        { id: "criteria", label: "المعايير", hint: "معايير واضحة", ref: { section: "criteria", p: 0 }, steps: ["حدد الإنجاز أو السلوك الذي تريد تشجيعه", "اختر مؤشرات تناسب الدور والعمل", "اشرح كيف يرتبط التقدير بها"] },
        { id: "recognition", label: "التقدير", hint: "من الالتزام إلى التقدير", ref: { section: "connect", p: 0 }, steps: ["يعرف الموظفون ما يُقدّر ولماذا", "يتابع المديرون بالبيانات المتاحة", "يرتبط التقدير بالسلوك الذي تريد تعزيزه"] },
        { id: "giftcards", label: "بطاقات الهدايا", hint: "مكافآت ذكية", ref: { section: "connect", p: 1 }, steps: ["اختر أسلوباً يناسب الفريق والميزانية والسياسات", "وضّح شروط الاستحقاق والمكافأة والاعتماد", "نظّم المكافآت في مساحة عمل موحدة"] },
        { id: "fairness", label: "العدالة", hint: "السياسة والمراجعة", ref: { section: "fairness", p: 0 }, steps: ["حدد من يرشح أو يعتمد ومتى تتم المراجعة", "استخدم البيانات جزءاً من الصورة مع سياق المدير", "وفّر مساراً للمراجعة وأعد النظر في النهج"] },
      ],
    },
  },
};
