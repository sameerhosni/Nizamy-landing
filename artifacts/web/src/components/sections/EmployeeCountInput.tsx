import { Minus, Plus } from "lucide-react";
import { clampEmployees, MAX_EMPLOYEES, MIN_EMPLOYEES } from "@/lib/plans";

interface Props {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  onCommit?: (n: number) => void;
  tone?: "light" | "dark";
  decLabel: string;
  incLabel: string;
}

export function EmployeeCountInput({ id, label, value, onChange, onCommit, tone = "light", decLabel, incLabel }: Props) {
  const dark = tone === "dark";
  const btn = `h-11 w-11 shrink-0 rounded-xl flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-4 ${
    dark ? "bg-white/10 text-white hover:bg-white/20 focus-visible:ring-amber-300/60" : "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-blue-200"
  } disabled:opacity-40`;
  const set = (n: number) => {
    const v = clampEmployees(n);
    onChange(v);
    onCommit?.(v);
  };
  return (
    <div>
      <label htmlFor={id} className={`block text-sm font-bold mb-2 ${dark ? "text-blue-100" : "text-slate-700"}`}>{label}</label>
      <div className="flex items-center gap-2" dir="ltr">
        <button type="button" className={btn} aria-label={decLabel} disabled={value <= MIN_EMPLOYEES} onClick={() => set(value - 1)}>
          <Minus size={18} />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={MIN_EMPLOYEES}
          max={MAX_EMPLOYEES}
          step={1}
          value={value}
          onChange={(e) => onChange(clampEmployees(Number(e.target.value)))}
          onBlur={() => onCommit?.(value)}
          className={`h-11 min-w-0 flex-1 rounded-xl text-center font-heading text-2xl font-black tabular-nums focus-visible:outline-none focus-visible:ring-4 ${
            dark ? "bg-white text-[#0A1A3A] focus-visible:ring-amber-300/60" : "bg-white border border-slate-200 text-blue-700 focus-visible:ring-blue-200"
          }`}
        />
        <button type="button" className={btn} aria-label={incLabel} disabled={value >= MAX_EMPLOYEES} onClick={() => set(value + 1)}>
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
