import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import incentivesRouter from "./incentives";
import openaiRouter from "./openai";
import ticketsRouter from "./tickets";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(incentivesRouter);
router.use(openaiRouter);
router.use(ticketsRouter);

export default router;
