import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/index.js";
import { logger } from "./infra/logger/index.js";
import { errorHandler } from "./api/middleware/errorHandler.js";
import container from "./container.js";
import makeInquiryRouter from "./api/v1/inquiry/inquiry.router.js";
import makeAdminRouter from "./api/v1/admin/admin.router.js";
import makeExportRouter from "./api/v1/export/export.router.js";
import makeDashboardRouter from "./api/v1/dashboard/dashboard.router.js";
import makeSettingRouter from "./api/v1/setting/setting.router.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api", limiter);

const { inquiryController, adminController, exportController, dashboardController, settingController } = container.cradle;

app.use("/api/v1/inquiry", makeInquiryRouter({ inquiryController }));
app.use("/api/v1/admin", makeAdminRouter({ adminController }));
app.use("/api/v1/export", makeExportRouter({ exportController }));
app.use("/api/v1/dashboard", makeDashboardRouter({ dashboardController }));
app.use("/api/v1/settings", makeSettingRouter({ settingController }));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use((req, res) => res.status(404).json({ success: false, error: "Route not found" }));
app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
});

export default app;
