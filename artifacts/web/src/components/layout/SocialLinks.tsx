import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import social from "@/lib/social.json";
import { track } from "@/lib/analytics";

const items = [
  { id: "linkedin", Icon: Linkedin, label: { ar: "لينكدإن", en: "LinkedIn" } },
  { id: "instagram", Icon: Instagram, label: { ar: "إنستغرام", en: "Instagram" } },
  { id: "youtube", Icon: Youtube, label: { ar: "يوتيوب", en: "YouTube" } },
  { id: "facebook", Icon: Facebook, label: { ar: "فيسبوك", en: "Facebook" } },
] as const;

const urls = social as Record<string, string>;

/** Icons for the company's social profiles. Only profiles with an https address in src/lib/social.json are shown. */
export function SocialLinks({ language, location = "footer" }: { language: "ar" | "en"; location?: string }) {
  const links = items.filter((i) => /^https:\/\//.test(urls[i.id] ?? ""));
  if (links.length === 0) return null;
  return (
    <ul aria-label={language === "ar" ? "حساباتنا على وسائل التواصل" : "Follow us"} className="mt-5 flex flex-wrap items-center gap-3">
      {links.map(({ id, Icon, label }) => (
        <li key={id}>
          <a
            href={urls[id]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label[language]}
            title={label[language]}
            onClick={() => track("social_click", { platform: id, location })}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors duration-300 hover:bg-blue-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Icon size={19} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
