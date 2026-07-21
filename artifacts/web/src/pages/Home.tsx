import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { Problem } from "@/components/sections/Problem";
import { Features } from "@/components/sections/Features";
import { WhyNizamy } from "@/components/sections/WhyNizamy";
import { ReturnModel } from "@/components/sections/ReturnModel";
import { Calculator } from "@/components/sections/Calculator";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { DesignPartner } from "@/components/sections/DesignPartner";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { ScrollButtons } from "@/components/ScrollButtons";

export function Home() {
  const [employees, setEmployees] = useState(100);
  const [tier, setTier] = useState<"Standard" | "Growth" | "Pro">("Growth");

  useEffect(() => {
    document.title = "Nizamy HR — The HR system that pays you back";
  }, []);

  const tierPrice = tier === "Standard" ? 3 : tier === "Growth" ? 5 : 8;
  const subscription = employees * tierPrice * 12;
  const layer1 = subscription * 0.15;
  const layer2 = subscription * 0.10;
  const layer3 = subscription * 0.05;
  const totalReturn = layer1 + layer2 + layer3;
  const effectiveCost = subscription - totalReturn;

  const snapshot = {
    employees,
    tier,
    tierPrice,
    subscription,
    totalReturn
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-600 selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <Problem />
        <Features />
        <WhyNizamy />
        <ReturnModel />
        <Calculator
          employees={employees}
          setEmployees={setEmployees}
          tier={tier}
          setTier={setTier}
          tierPrice={tierPrice}
          subscription={subscription}
          totalReturn={totalReturn}
          layer1={layer1}
          layer2={layer2}
          layer3={layer3}
          effectiveCost={effectiveCost}
        />
        <CaseStudies />
        <DesignPartner snapshot={snapshot} tier={tier} setTier={setTier} />
      </main>
      <Footer />
      <ChatWidget />
      <ScrollButtons />
    </div>
  );
}
