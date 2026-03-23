import { Router, IRouter } from "express";
import calendarRoutes from "./calendar";
import sheetsRoutes from "./sheets";
import driveRoutes from "./drive";

const router: IRouter = Router();

router.use("/calendar", calendarRoutes);
router.use("/sheets", sheetsRoutes);
router.use("/drive", driveRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
