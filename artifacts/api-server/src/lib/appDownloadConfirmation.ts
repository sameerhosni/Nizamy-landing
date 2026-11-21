const ios = "https://apps.apple.com/sa/app/id6792693395";
const android = "https://play.google.com/store/apps/details?id=com.t2.nizamy";

export function appDownloadConfirmation(lang: "en" | "ar") {
  const title = lang === "ar" ? "مرحباً بك في نظامي — 5,000 نقطة ترحيبية مجانية" : "Welcome to Nizamy — 5,000 free welcome points";
  const body = lang === "ar"
    ? "شكرًا لك، استلمنا طلبك. لك 5,000 نقطة ترحيبية مجانية! حمّل تطبيق نظامي الآن وسجّل الدخول لبدء رحلتك. لا تحتاج إلى انتظار مكالمة للبدء."
    : "Thank you — we received your request. You have 5,000 free welcome points! Download Nizamy now and sign in to start your journey. You don't need to wait for a call to get started.";
  return {
    subject: title,
    text: `${title}\n\n${body}\n\nApp Store: ${ios}\nGoogle Play: ${android}\n\nNizamy — nizamy.app`,
    html: `<div dir="${lang === "ar" ? "rtl" : "ltr"}" style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;color:#16302b"><h1>${title}</h1><p style="line-height:1.8">${body}</p><p><a href="${ios}">Download on the App Store</a></p><p><a href="${android}">Get it on Google Play</a></p><p>Nizamy — nizamy.app</p></div>`,
  };
}
