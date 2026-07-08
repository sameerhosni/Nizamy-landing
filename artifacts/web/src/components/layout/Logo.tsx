import { ScanFace } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "light", className = "" }: LogoProps) {
  const { dir } = useLanguage();
  const isRtl = dir === "rtl";
  const textColor = variant === "light" ? "text-white" : "text-[#0F172A]";

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none min-w-0 ${className}`}>
      <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-glow-sm shrink-0 border-2 border-white/20">
        <ScanFace className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} aria-hidden="true" />
      </div>
      <div
        className={`font-heading font-extrabold text-lg sm:text-2xl tracking-tight leading-none whitespace-nowrap truncate ${textColor}`}
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
