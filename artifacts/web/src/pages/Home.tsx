import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { Problem } from "@/components/sections/Problem";
import { ReturnModel } from "@/components/sections/ReturnModel";
import { Calculator } from "@/components/sections/Calculator";
import { Features } from "@/components/sections/Features";
import { Advantages } from "@/components/sections/Advantages";
import { WhoWeServe } from "@/components/sections/WhoWeServe";
import { DesignPartner } from "@/components/sections/DesignPartner";
import { Footer } from "@/components/layout/Footer";

export function Home() {
  const [employees, setEmployees] = useState(100);
  const [tier, setTier] = useState<"Standard" | "Growth" | "Pro">("Growth");

  useEffect(() => {
    document.title = "Mr-Hr — The HR system that pays you back";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Mr-Hr returns up to 30% of your subscription back to you, every year.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Mr-Hr returns up to 30% of your subscription back to you, every year.";
      document.head.appendChild(meta);
    }
  }, []);

  const tierPrice = tier === "Standard" ? 5 : tier === "Growth" ? 8 : 12;
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <Problem />
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
        <Features />
        <Advantages />
        <WhoWeServe />
        <DesignPartner snapshot={snapshot} />
      </main>
      <Footer />
    </div>
  );
}
