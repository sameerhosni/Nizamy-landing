import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { attributionMiddleware } from "./lib/attribution";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use("/api/ticket",express.json({limit:"9mb"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", attributionMiddleware, router);

// When STATIC_DIR is set (e.g. in the Docker image), serve the built web
// frontend and fall back to index.html for client-side routing.
const staticDir = process.env["STATIC_DIR"];
if (staticDir) {
  const staticRoot = path.resolve(staticDir);
  const seoRoutes: Record<string, string> = {
    "/blog": "blog.html",
    "/hr-blog": "hrBlog.html",
    "/hr-blog/face-attendance-system-saudi-arabia": "hrBlogAttendance.html",
    "/hr-blog/ai-hr-assistant-employee-requests": "hrBlogAi.html",
    "/hr-blog/replace-excel-whatsapp-hr-management": "hrBlogSmallBiz.html",
    "/hr-blog/payroll-readiness-checklist-saudi": "hrBlogPayroll.html",
    "/hr-blog/ramadan-working-hours-saudi-attendance": "hrBlogRamadan.html",
    "/hr-blog/annual-leave-days-saudi-calculator": "hrBlogLeave.html",
    "/hr-blog/read-attendance-signals-fairly-saudi": "hrBlogSignals.html",
    "/hr-blog/ai-hr-small-steps-saudi-teams": "hrBlogAiSteps.html",
    "/en/hr-blog": "hrBlogEn.html",
    "/en/hr-blog/face-attendance-system-saudi-arabia": "hrBlogAttendanceEn.html",
    "/en/hr-blog/ai-hr-assistant-employee-requests": "hrBlogAiEn.html",
    "/en/hr-blog/replace-excel-whatsapp-hr-management": "hrBlogSmallBizEn.html",
    "/en/hr-blog/payroll-readiness-checklist-saudi": "hrBlogPayrollEn.html",
    "/en/hr-blog/ramadan-working-hours-saudi-attendance": "hrBlogRamadanEn.html",
    "/en/hr-blog/annual-leave-days-saudi-calculator": "hrBlogLeaveEn.html",
    "/en/hr-blog/read-attendance-signals-fairly-saudi": "hrBlogSignalsEn.html",
    "/en/hr-blog/ai-hr-small-steps-saudi-teams": "hrBlogAiStepsEn.html",
    "/hr-blog/end-of-service-benefits-calculator-saudi": "hrBlogEosb.html",
    "/en/hr-blog/end-of-service-benefits-calculator-saudi": "hrBlogEosbEn.html",
    "/hr-blog/sick-leave-pay-saudi-labor-law": "hrBlogSick.html",
    "/en/hr-blog/sick-leave-pay-saudi-labor-law": "hrBlogSickEn.html",
    "/blog/ai-hr-saudi-arabia": "blogArticle.html",
    "/blog/hr-app-nizamy": "nizamyAppArticle.html",
    "/services/attendance-performance": "attendanceService.html",
    "/services/ai-hr": "aiHrService.html",
    "/services/employee-rewards": "employeeRewardsService.html",
    "/services/reports": "reportsService.html",
    "/services/payroll-inputs": "payrollInputsService.html",
    "/sitemap": "sitemap.html",
    "/privacy-policy": "privacyPolicy.html",
    "/biometric-data-security": "biometricSecurity.html",
    "/faq/ar": "faq.html",
    "/faq/en": "faqEnglish.html",
    "/help": "helpCenter.html",
    "/small-business-hr-software-saudi-arabia": "hrSoftware.html",
    "/pricing": "pricingPage.html",
  };

  app.get(/^\/faq\/?$/i, (_req, res) => res.redirect(308, "/faq/ar"));
  for (const [canonicalPath, filename] of Object.entries(seoRoutes)) {
    const routePattern = new RegExp(`^${canonicalPath}/?$`, "i");
    app.get(routePattern, (req, res) => {
      if (req.path !== canonicalPath) {
        res.redirect(308, canonicalPath);
        return;
      }
      if (["/privacy-policy", "/biometric-data-security", "/pricing"].includes(canonicalPath)) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
      }
      res.sendFile(path.join(staticRoot, "seo", filename));
    });
  }
  app.use(express.static(staticRoot));
  app.get(/^\/support(?:\/visitors)?\/?$/, (_req,res)=>{
    res.setHeader("X-Robots-Tag","noindex, nofollow");
    res.setHeader("Cache-Control","no-store");
    res.sendFile(path.join(staticRoot,"index.html"));
  });
  app.get(/^\/(?!api(\/|$)).*/, (_req, res) => {
    res.status(404).sendFile(path.join(staticRoot, "seo", "notFound.html"));
  });
}

export default app;
