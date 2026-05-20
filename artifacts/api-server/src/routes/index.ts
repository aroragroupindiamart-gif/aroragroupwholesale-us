import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import pagesRouter from "./pages.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(pagesRouter);

export default router;
