import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { submitMcnSchema, submitPasSchema, submitBrandSchema, updateStatusSchema } from "./inquiry.validator.js";

export default function makeInquiryRouter({ inquiryController }) {
  const router = Router();

  router.post("/mcn", validate(submitMcnSchema, { assign: true }), (req, res, next) => inquiryController.submitMcnInquiry(req, res, next));
  router.post("/pas", validate(submitPasSchema, { assign: true }), (req, res, next) => inquiryController.submitPasInquiry(req, res, next));
  router.post("/brand", validate(submitBrandSchema, { assign: true }), (req, res, next) => inquiryController.submitBrandInquiry(req, res, next));

  router.get("/", authenticate, (req, res, next) => inquiryController.getAllInquiries(req, res, next));
  router.get("/:id", authenticate, (req, res, next) => inquiryController.getInquiryById(req, res, next));
  router.patch("/:id/status", authenticate, validate(updateStatusSchema, { assign: true }), (req, res, next) => inquiryController.updateInquiry(req, res, next));

  return router;
}
