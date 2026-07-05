import { HandCoins } from "lucide-react";
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
    <div className={`flex items-center gap-1.5 sm:gap-2.5 select-none min-w-0 ${className}`}>
      <div className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-400 via-pink-500 to-indigo-500 flex items-center justify-center shadow-glow-sm shrink-0">
        <HandCoins className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] text-white" strokeWidth={2.5} aria-hidden="true" />
      </div>
      <div
        className={`font-extrabold text-base sm:text-2xl tracking-tight leading-none whitespace-nowrap truncate ${textColor}`}
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
