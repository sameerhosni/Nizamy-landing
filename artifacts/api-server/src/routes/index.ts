import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import incentivesRouter from "./incentives";
import openaiRouter from "./openai";
import ticketsRouter from "./tickets";
import hubspotFormsRouter from "./hubspotForms";
import supportRouter from "./support";
import { trafficRouter } from "./traffic";

const router: IRouter = Router();

router.use(healthRouter);
router.use(trafficRouter);
router.use(leadsRouter);
router.use(incentivesRouter);
router.use(openaiRouter);
router.use(ticketsRouter);
router.use(hubspotFormsRouter);
router.use("/support",supportRouter);

export default router;
