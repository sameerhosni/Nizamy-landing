import { useLanguage } from "@/lib/i18n";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const { dir } = useLanguage();
  const isRtl = dir === "rtl";
  const textColor = variant === "light" ? "text-white" : "text-foreground";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 via-pink-500 to-indigo-500 flex items-center justify-center shadow-glow-sm shrink-0">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white"
          aria-hidden="true"
        >
          <path
            d="M4 12a8 8 0 1 1 3 6.24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 18v-4.5h4.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        className={`font-extrabold text-2xl tracking-tight leading-none whitespace-nowrap ${textColor}`}
      >
        {isRtl ? (
          <>
            مستر<span className="text-gradient-primary">-إتش آر</span>
          </>
        ) : (
          <>
            Mr<span className="text-gradient-primary">-Hr</span>
          </>
        )}
      </div>
    </div>
  );
}
