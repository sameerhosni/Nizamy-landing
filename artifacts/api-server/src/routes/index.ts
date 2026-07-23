import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import openaiRouter from "./openai";
import ticketsRouter from "./tickets";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(openaiRouter);
router.use(ticketsRouter);

export default router;
