import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { Problem } from "@/components/sections/Problem";
import { Features } from "@/components/sections/Features";
import { WhyNizamy } from "@/components/sections/WhyNizamy";
import { ReturnModel } from "@/components/sections/ReturnModel";
import { Pricing } from "@/components/sections/Pricing";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { DesignPartner } from "@/components/sections/DesignPartner";
import { Footer } from "@/components/layout/Footer";
import { PublicChat } from "@/components/PublicChat";
import { ScrollButtons } from "@/components/ScrollButtons";
import { IncentivePopup } from "@/components/IncentivePopup";
import { initDashboardAnalytics } from "@/lib/dashboardAnalytics";
import { SeoHead } from "@/components/SeoHead";
import { HubSpotContact } from "@/components/sections/HubSpotContact";
import { useLanguage } from "@/lib/i18n";
import { HomeHero } from "@/components/home/HomeHero";
import { PainSection, SolutionSection, HowSection, BeforeAfterSection, HomePricing, HomeFaq } from "@/components/home/HomeSections";
import { annualTotal, tierPrice as priceFor, Tier } from "@/lib/plans";

export function Home() {
  const { language } = useLanguage();
  const employees = 100;
  const hoursSaved = 0.5;
  const hourlyValue = 30;
  const [tier, setTier] = useState<Tier>("Growth");

  useEffect(() => {
    initDashboardAnalytics();
    const target = window.location.hash.slice(1);
    if (target) {
      requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView());
    }
  }, []);

  const tierPrice = priceFor(tier);
  const subscription = annualTotal(tier, employees);
  // User-adjustable scenario, not measured savings or subscription cashback.
  const totalReturn = employees * hoursSaved * hourlyValue * 12;

  const snapshot = {
    employees,
    tier,
    tierPrice,
    subscription,
    totalReturn
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-600 selection:text-white flex flex-col">
      <SeoHead page="home" />
      <Navbar />
      <main className="flex-1">
        {language === "ar" ? (
          <>
            <HomeHero />
            <PainSection />
            <SolutionSection />
            <HowSection />
            <BeforeAfterSection />
            <HomePricing />
            <ReturnModel />
          </>
        ) : (
          <>
            <Hero />
            <StatsBar />
            <Features />
            <Problem />
            <WhyNizamy />
            <ReturnModel />
            <Pricing employees={employees} tier={tier} setTier={setTier} />
          </>
        )}
        <CaseStudies />
        <DesignPartner snapshot={snapshot} tier={tier} setTier={setTier} />
        <HubSpotContact />
        {language === "ar" && <HomeFaq />}
      </main>
      <Footer showCreator />
      <PublicChat />
      <ScrollButtons />
      <IncentivePopup key={language} />
    </div>
  );
}
