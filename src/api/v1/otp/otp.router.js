import { Router } from "express";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";

const sendSchema = z.object({ body: z.object({ email: z.string().email("Format email tidak valid") }) });
const verifySchema = z.object({ body: z.object({ email: z.string().email(), code: z.string().length(6) }) });

export default function makeOtpRouter({ otpController }) {
  const router = Router();
  router.post("/send", validate(sendSchema), (req, res, next) => otpController.send(req, res, next));
  router.post("/verify", validate(verifySchema), (req, res, next) => otpController.verify(req, res, next));
  return router;
}
