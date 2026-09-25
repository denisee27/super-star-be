import { createContainer, asValue, asFunction } from "awilix";
import prisma from "./infra/db/prisma.js";
import { logger } from "./infra/logger/index.js";
import { makeInquiryRepository } from "./core/repositories/inquiry.repository.js";
import { makeAdminRepository } from "./core/repositories/admin.repository.js";
import { makeAdminLogRepository } from "./core/repositories/adminLog.repository.js";
import { makeDashboardRepository } from "./core/repositories/dashboard.repository.js";
import { makeInquiryService } from "./core/services/inquiry.service.js";
import { makeAdminService } from "./core/services/admin.service.js";
import { makeAdminLogService } from "./core/services/adminLog.service.js";
import { makeExportService } from "./core/services/export.service.js";
import { makeDashboardService } from "./core/services/dashboard.service.js";
import { makeInquiryController } from "./api/v1/inquiry/inquiry.controller.js";
import { makeAdminController } from "./api/v1/admin/admin.controller.js";
import { makeExportController } from "./api/v1/export/export.controller.js";
import { makeDashboardController } from "./api/v1/dashboard/dashboard.controller.js";
import { makeSettingRepository } from "./core/repositories/setting.repository.js";
import { makeSettingService } from "./core/services/setting.service.js";
import { makeSettingController } from "./api/v1/setting/setting.controller.js";
import { makeOtpRepository } from "./core/repositories/otp.repository.js";
import { makeOtpService } from "./core/services/otp.service.js";
import { makeOtpController } from "./api/v1/otp/otp.controller.js";

const container = createContainer();

container.register({
  prisma: asValue(prisma),
  logger: asValue(logger),

  // Repositories
  inquiryRepository: asFunction(makeInquiryRepository).singleton(),
  adminRepository: asFunction(makeAdminRepository).singleton(),
  adminLogRepository: asFunction(makeAdminLogRepository).singleton(),
  dashboardRepository: asFunction(makeDashboardRepository).singleton(),
  settingRepository: asFunction(makeSettingRepository).singleton(),
  otpRepository: asFunction(makeOtpRepository).singleton(),

  // Services
  otpService: asFunction(makeOtpService).singleton(),
  inquiryService: asFunction(makeInquiryService).singleton(),
  adminService: asFunction(makeAdminService).singleton(),
  adminLogService: asFunction(makeAdminLogService).singleton(),
  exportService: asFunction(makeExportService).singleton(),
  dashboardService: asFunction(makeDashboardService).singleton(),
  settingService: asFunction(makeSettingService).singleton(),

  // Controllers
  inquiryController: asFunction(makeInquiryController).singleton(),
  adminController: asFunction(makeAdminController).singleton(),
  exportController: asFunction(makeExportController).singleton(),
  dashboardController: asFunction(makeDashboardController).singleton(),
  settingController: asFunction(makeSettingController).singleton(),
  otpController: asFunction(makeOtpController).singleton(),
});

export default container;
