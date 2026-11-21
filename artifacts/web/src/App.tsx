import { Redirect } from "wouter";
import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import { Home } from "@/pages/Home";
const informationPages = () => import("@/pages/InformationPages");
const FaqEnglishPage = lazy(() => informationPages().then(m => ({ default: m.FaqEnglishPage })));
const NizamyAppArticle = lazy(() => import("@/pages/NizamyAppArticle").then(m => ({ default: m.NizamyAppArticle })));
const PrivacyPolicyPage = lazy(() => informationPages().then(m => ({ default: m.PrivacyPolicyPage })));
const BiometricSecurityPage = lazy(() => informationPages().then(m => ({ default: m.BiometricSecurityPage })));
const FaqPage = lazy(() => informationPages().then(m => ({ default: m.FaqPage })));
const HelpCenterPage = lazy(() => informationPages().then(m => ({ default: m.HelpCenterPage })));
const HrSoftwarePage = lazy(() => informationPages().then(m => ({ default: m.HrSoftwarePage })));
const PricingPage = lazy(() => informationPages().then(m => ({ default: m.PricingPage })));

const Sitemap = lazy(() => import("@/pages/Sitemap").then((module) => ({ default: module.Sitemap })));
const Blog = lazy(() => import("@/pages/Blog").then((module) => ({ default: module.Blog })));
const HrBlog = lazy(() => import("@/pages/HrBlog").then((module) => ({ default: module.HrBlog })));
const BlogArticle = lazy(() => import("@/pages/BlogArticle").then((module) => ({ default: module.BlogArticle })));
const AttendanceService = lazy(() => import("@/pages/AttendanceService").then((module) => ({ default: module.AttendanceService })));
const AiHrService = lazy(() => import("@/pages/ServiceLanding").then((module) => ({ default: module.AiHrService })));
const EmployeeRewardsService = lazy(() => import("@/pages/ServiceLanding").then((module) => ({ default: module.EmployeeRewardsService })));
const Support = lazy(() => import("@/pages/Support").then((module) => ({ default: module.Support })));
const NotFound = lazy(() => import("@/pages/not-found"));
const PayrollInputs = lazy(() => import("@/pages/PayrollInputs").then((m) => ({ default: m.PayrollInputs })));
const PendingService = lazy(() => import("@/pages/PendingService").then(m => ({ default: m.PendingService })));

const queryClient = new QueryClient();

function Router() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog/hr-app-nizamy" component={NizamyAppArticle} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/biometric-data-security" component={BiometricSecurityPage} />
        <Route path="/faq/ar" component={FaqPage} />
        <Route path="/faq/en" component={FaqEnglishPage} />
        <Route path="/faq"><Redirect to="/faq/ar" /></Route>
        <Route path="/help" component={HelpCenterPage} />
        <Route path="/small-business-hr-software-saudi-arabia" component={HrSoftwarePage} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/sitemap" component={Sitemap} />
        <Route path="/blog/ai-hr-saudi-arabia" component={BlogArticle} />
        <Route path="/services/attendance-performance" component={AttendanceService} />
        <Route path="/services/ai-hr" component={AiHrService} />
        <Route path="/services/employee-rewards" component={EmployeeRewardsService} />
        <Route path="/services/reports"><PendingService service="reports" /></Route>
        <Route path="/services/payroll-inputs" component={PayrollInputs} />
        <Route path="/hr-blog/:slug?" component={HrBlog} />
        <Route path="/en/hr-blog/:slug?" component={HrBlog} />
        <Route path="/blog" component={Blog} />
        <Route path="/support" component={Support} />
        <Route path="/support/visitors" component={Support} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
