import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

export default function makeSettingRouter({ settingController }) {
  const router = Router();
  // Public — needed by the brand success screen without auth
  router.get("/brand-wa", (req, res, next) => settingController.getBrandWaConfig(req, res, next));
  // Admin-only — update settings
  router.patch("/", authenticate, (req, res, next) => settingController.updateSettings(req, res, next));
  return router;
}
