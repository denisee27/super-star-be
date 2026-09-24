import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

export default function makeExportRouter({ exportController }) {
  const router = Router();
  router.get("/inquiries", authenticate, (req, res, next) => exportController.exportInquiries(req, res, next));
  return router;
}
