import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../../middleware/validate.js";
import { authenticate, requireSuperAdmin } from "../../middleware/auth.middleware.js";
import { loginSchema, verifyLoginOtpSchema, createAdminSchema } from "./admin.validator.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit." },
  skipSuccessfulRequests: false,
});

export default function makeAdminRouter({ adminController }) {
  const router = Router();

  // Auth — rate limited
  router.post("/login", authLimiter, validate(loginSchema, { assign: true }), (req, res, next) => adminController.login(req, res, next));
  router.post("/login/verify", authLimiter, validate(verifyLoginOtpSchema, { assign: true }), (req, res, next) => adminController.verifyLoginOtp(req, res, next));
  router.post("/refresh", (req, res, next) => adminController.refresh(req, res, next));
  router.post("/logout", (req, res, next) => adminController.logout(req, res, next));
  router.get("/me", authenticate, (req, res, next) => adminController.getProfile(req, res, next));

  // User management — super admin only
  router.get("/users", authenticate, requireSuperAdmin, (req, res, next) => adminController.listAdmins(req, res, next));
  router.post("/users", authenticate, requireSuperAdmin, validate(createAdminSchema, { assign: true }), (req, res, next) => adminController.createAdmin(req, res, next));
  router.patch("/users/:id", authenticate, requireSuperAdmin, (req, res, next) => adminController.updateAdmin(req, res, next));
  router.post("/users/:id/reset-password", authenticate, requireSuperAdmin, (req, res, next) => adminController.resetAdminPassword(req, res, next));
  router.delete("/users/:id", authenticate, requireSuperAdmin, (req, res, next) => adminController.deleteAdmin(req, res, next));

  // Audit logs — super admin only
  router.get("/logs", authenticate, requireSuperAdmin, (req, res, next) => adminController.getLogs(req, res, next));

  return router;
}
