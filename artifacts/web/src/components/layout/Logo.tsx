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
      <div className="relative w-9 h-10 sm:w-11 sm:h-12 shrink-0">
        <img
          src="/images/logo-mascot.png"
          alt="Mr-Hr"
          className="w-full h-full object-contain"
        />
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
