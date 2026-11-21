import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import { SaudiRiyalSymbol } from "@/components/SaudiRiyalSymbol";
import { STARTER_MONTHLY_PER_USER } from "@/lib/plans";
import { freeFeatures, starterFeatures } from "@/lib/pricingOffers";
import type { PricingFeature } from "@/lib/pricingModules";
import content from "@/lib/data/homepageContent.json";
import { goToStart, openChat } from "./homeActions";

const c = content.pricing.cards;
const LIMITED = "(استخدام محدود)";

function Header({ kind, name, price, children }: { kind: "free" | "paid"; name: string; price: number; children: ReactNode }) {
  const free = kind === "free";
  return (
    <div className="relative min-h-[190px] px-6 pb-12 pt-5 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 76%)", background: free ? "linear-gradient(155deg, #327bff, #1452f5)" : "linear-gradient(115deg, #048fc0, #009d88 65%, #008c79)" }}>
        {!free && <span className="absolute inset-0 bg-blue-600/25" style={{ clipPath: "polygon(0 0, 46% 0, 19% 100%, 0 100%)" }} />}
        <span className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(35deg, transparent 0, transparent 10px, rgba(255,255,255,.08) 10px, rgba(255,255,255,.08) 11px)" }} />
      </div>
      <div className="relative">
        <div className="text-xs font-black text-white/95">{name}</div>
        <div className="mt-1 flex items-center gap-3">
          <span data-testid={`text-price-${kind}`} dir="ltr" className="font-heading text-[88px] font-black leading-none tracking-tight tabular-nums sm:text-[104px]">{price}</span>
          <div className="flex min-w-0 flex-col items-start gap-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  if (!text.includes(LIMITED)) return <>{text}</>;
  return <>{text.replace(LIMITED, "").trim()} <span className="mx-1 inline-block rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-900">{c.limited}</span></>;
}

function List({ items, tone }: { items: PricingFeature[]; tone: string }) {
  return (
    <ul className="space-y-3">
      {items.map((f) => {
        const Icon = f.icon;
        return (
          <li key={f.key} className="flex items-start gap-2 text-sm font-medium leading-relaxed text-slate-700">
            <Icon aria-hidden size={16} className={`mt-1 shrink-0 ${tone}`} />
            <span><Label text={f.text.ar} /></span>
          </li>
        );
      })}
    </ul>
  );
}

function Cta({ label, onClick, cls, id }: { label: string; onClick: () => void; cls: string; id: string }) {
  return (
    <button type="button" data-testid={`button-home-plan-${id}`} onClick={onClick}
      className={`group flex min-h-12 w-full items-center justify-between gap-3 rounded-xl ps-5 pe-1.5 text-[15px] font-black text-white transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 ${cls}`}>
      <span>{label}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A1A3A]/15 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"><ArrowUpLeft size={16} /></span>
    </button>
  );
}

const card = "flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_16px_36px_-26px_rgba(10,26,58,0.5)] transition-shadow duration-300 hover:shadow-[0_24px_48px_-24px_rgba(10,26,58,0.45)]";
const reveal = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.45 } };

export function HomePricingCards() {
  const riyal = <SaudiRiyalSymbol label={c.currency} />;
  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-2">
      <motion.article {...reveal} data-testid="card-home-plan-free" className={`${card} ring-1 ring-[#0A1A3A]/10`}>
        <Header kind="free" name={c.freeName} price={0}>
          <span className="text-base font-black">{riyal}</span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black text-blue-700">{c.freeTag}</span>
        </Header>
        <div className="flex-1 px-6 pt-3"><List items={freeFeatures} tone="text-teal-700" /></div>
        <div className="px-6 pb-6 pt-6">
          <Cta id="free" label={c.freeCta} onClick={goToStart} cls="bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-300 shadow-[0_12px_26px_-14px_rgba(37,99,235,0.7)]" />
        </div>
      </motion.article>
      <motion.article {...reveal} data-testid="card-home-plan-starter" className={`${card} ring-2 ring-teal-600`}>
        <Header kind="paid" name={c.paidName} price={STARTER_MONTHLY_PER_USER}>
          <span className="text-sm font-black sm:text-base">{riyal} {c.perUser}</span>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-black text-teal-800">{c.billed}</span>
          <span data-testid="home-starter-free-trial" className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-teal-950">{c.trial}</span>
        </Header>
        <div className="flex-1 px-6 pt-3">
          <p className="mb-4 text-sm font-black text-teal-800">{c.includes}</p>
          <List items={starterFeatures} tone="text-teal-700" />
        </div>
        <div className="px-6 pb-6 pt-6">
          <Cta id="starter" label={c.paidCta} onClick={openChat} cls="bg-teal-700 hover:bg-teal-800 focus-visible:ring-teal-300 shadow-[0_12px_26px_-14px_rgba(15,118,110,0.7)]" />
        </div>
      </motion.article>
    </div>
  );
}
