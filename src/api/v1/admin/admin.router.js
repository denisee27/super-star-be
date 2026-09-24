import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { loginSchema } from "./admin.validator.js";

export default function makeAdminRouter({ adminController }) {
  const router = Router();

  router.post("/login", validate(loginSchema, { assign: true }), (req, res, next) => adminController.login(req, res, next));
  router.post("/refresh", (req, res, next) => adminController.refresh(req, res, next));
  router.post("/logout", (req, res, next) => adminController.logout(req, res, next));
  router.get("/me", authenticate, (req, res, next) => adminController.getProfile(req, res, next));

  return router;
}
