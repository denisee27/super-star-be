import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

export default function makeDashboardRouter({ dashboardController }) {
  const router = Router();
  router.get("/stats", authenticate, (req, res, next) => dashboardController.getStats(req, res, next));
  return router;
}
