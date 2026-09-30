import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { createEventSchema, updateEventSchema, eventIdSchema } from "./event.validator.js";

export default function makeEventRouter({ eventController }) {
  const router = Router();

  router.get("/", (req, res, next) => eventController.list(req, res, next));
  router.get("/all", authenticate, (req, res, next) => eventController.listAll(req, res, next));
  router.post("/", authenticate, validate(createEventSchema, { assign: true }), (req, res, next) => eventController.create(req, res, next));
  router.patch("/:id", authenticate, validate(updateEventSchema, { assign: true }), (req, res, next) => eventController.update(req, res, next));
  router.delete("/:id", authenticate, validate(eventIdSchema, { assign: true }), (req, res, next) => eventController.remove(req, res, next));

  return router;
}
