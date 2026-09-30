import { Router } from "express";

export default function makeRegionRouter({ regionController }) {
  const router = Router();
  router.get("/provinces", (req, res, next) => regionController.listProvinces(req, res, next));
  router.get("/regencies", (req, res, next) => regionController.listRegencies(req, res, next));
  return router;
}
